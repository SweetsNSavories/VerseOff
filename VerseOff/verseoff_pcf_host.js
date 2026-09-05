(function (global) {
    "use strict";

    let bridge = null;
    let configuration = null;
    let instance = null;
    let context = null;
    let notifyOutputChanged = null;

    function report(error) {
        const message = String(
            error && error.message ? error.message : error
        );
        const stack = String(error && error.stack ? error.stack : "");
        if (bridge) {
            bridge.runtimeError(message, stack);
        } else {
            console.error(error);
        }
    }

    function failStorage(storageName) {
        try {
            const storage = global[storageName];
            if (!storage) {
                return;
            }
            const target = Object.getPrototypeOf(storage) || storage;
            ["getItem", "setItem", "removeItem", "clear"].forEach(
                function (method) {
                    target[method] = function () {
                        throw new Error(
                            storageName +
                            " is unavailable to Power Apps components"
                        );
                    };
                }
            );
        } catch (error) {
            report(error);
        }
    }

    failStorage("localStorage");
    failStorage("sessionStorage");

    // =========================================================================
    // IN-PROCESS VIRTUAL DOM & HTML ADAPTOR (QJSEngine Compatible)
    // =========================================================================
    global.window = global.window || global;

    function escapeHtml(str) {
        return String(str || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function VirtualNode(nodeType, nodeName) {
        this.nodeType = nodeType; // 1 = Element, 3 = Text
        this.nodeName = String(nodeName || "").toUpperCase();
        this.tagName = this.nodeName;
        this.attributes = {};
        this.style = {};
        this.childNodes = [];
        this.parentNode = null;
        this._listeners = {};
        this._textContent = "";
        this._value = "";
    }

    Object.defineProperty(VirtualNode.prototype, "id", {
        get: function () { return this.attributes.id || ""; },
        set: function (val) { this.setAttribute("id", val); }
    });

    Object.defineProperty(VirtualNode.prototype, "className", {
        get: function () { return this.attributes["class"] || ""; },
        set: function (val) { this.setAttribute("class", val); }
    });

    Object.defineProperty(VirtualNode.prototype, "value", {
        get: function () { return this._value !== undefined ? this._value : (this.attributes.value || ""); },
        set: function (val) {
            this._value = val;
            this.attributes.value = String(val);
            this._scheduleSync();
        }
    });

    Object.defineProperty(VirtualNode.prototype, "children", {
        get: function () {
            return this.childNodes.filter(function (n) { return n.nodeType === 1; });
        }
    });

    Object.defineProperty(VirtualNode.prototype, "firstChild", {
        get: function () { return this.childNodes[0] || null; }
    });

    Object.defineProperty(VirtualNode.prototype, "lastChild", {
        get: function () { return this.childNodes[this.childNodes.length - 1] || null; }
    });

    Object.defineProperty(VirtualNode.prototype, "classList", {
        get: function () {
            const self = this;
            return {
                add: function () {
                    const existing = (self.className || "").split(/\s+/).filter(Boolean);
                    for (let i = 0; i < arguments.length; i++) {
                        if (existing.indexOf(arguments[i]) === -1) existing.push(arguments[i]);
                    }
                    self.className = existing.join(" ");
                },
                remove: function () {
                    const toRemove = Array.prototype.slice.call(arguments);
                    const existing = (self.className || "").split(/\s+/).filter(Boolean);
                    self.className = existing.filter(function (c) { return toRemove.indexOf(c) === -1; }).join(" ");
                },
                contains: function (cls) {
                    return (self.className || "").split(/\s+/).indexOf(cls) !== -1;
                },
                toggle: function (cls) {
                    if (this.contains(cls)) { this.remove(cls); return false; }
                    this.add(cls); return true;
                }
            };
        }
    });

    Object.defineProperty(VirtualNode.prototype, "textContent", {
        get: function () {
            if (this.nodeType === 3) return this._textContent;
            return this.childNodes.map(function (c) { return c.textContent; }).join("");
        },
        set: function (val) {
            this.childNodes = [];
            this.appendChild(global.document.createTextNode(String(val || "")));
        }
    });

    Object.defineProperty(VirtualNode.prototype, "innerText", {
        get: function () { return this.textContent; },
        set: function (val) { this.textContent = val; }
    });

    Object.defineProperty(VirtualNode.prototype, "innerHTML", {
        get: function () {
            return this.childNodes.map(function (c) { return c.toHtml(); }).join("");
        },
        set: function (html) {
            this.childNodes = [];
            // Parse simple text or basic HTML strings
            const str = String(html || "");
            if (str.indexOf("<") === -1) {
                this.appendChild(global.document.createTextNode(str));
            } else {
                // Wrap in text/raw HTML representation
                const textNode = new VirtualNode(3, "#text");
                textNode._textContent = str;
                textNode._rawHtml = true;
                this.appendChild(textNode);
            }
            this._scheduleSync();
        }
    });

    VirtualNode.prototype.setAttribute = function (name, value) {
        this.attributes[name] = String(value);
        this._scheduleSync();
    };

    VirtualNode.prototype.getAttribute = function (name) {
        return this.attributes[name] !== undefined ? this.attributes[name] : null;
    };

    VirtualNode.prototype.removeAttribute = function (name) {
        delete this.attributes[name];
        this._scheduleSync();
    };

    VirtualNode.prototype.hasAttribute = function (name) {
        return this.attributes[name] !== undefined;
    };

    VirtualNode.prototype.appendChild = function (child) {
        if (!child) return child;
        if (child.parentNode) child.parentNode.removeChild(child);
        child.parentNode = this;
        this.childNodes.push(child);
        this._scheduleSync();
        return child;
    };

    VirtualNode.prototype.removeChild = function (child) {
        const index = this.childNodes.indexOf(child);
        if (index !== -1) {
            this.childNodes.splice(index, 1);
            child.parentNode = null;
            this._scheduleSync();
        }
        return child;
    };

    VirtualNode.prototype.insertBefore = function (newChild, refChild) {
        if (!refChild) return this.appendChild(newChild);
        const index = this.childNodes.indexOf(refChild);
        if (index === -1) return this.appendChild(newChild);
        if (newChild.parentNode) newChild.parentNode.removeChild(newChild);
        newChild.parentNode = this;
        this.childNodes.splice(index, 0, newChild);
        this._scheduleSync();
        return newChild;
    };

    VirtualNode.prototype.replaceChild = function (newChild, oldChild) {
        const index = this.childNodes.indexOf(oldChild);
        if (index !== -1) {
            if (newChild.parentNode) newChild.parentNode.removeChild(newChild);
            newChild.parentNode = this;
            oldChild.parentNode = null;
            this.childNodes.splice(index, 1, newChild);
            this._scheduleSync();
        }
        return oldChild;
    };

    VirtualNode.prototype.addEventListener = function (type, listener) {
        type = String(type || "").toLowerCase();
        this._listeners[type] = this._listeners[type] || [];
        this._listeners[type].push(listener);
    };

    VirtualNode.prototype.removeEventListener = function (type, listener) {
        type = String(type || "").toLowerCase();
        if (this._listeners[type]) {
            this._listeners[type] = this._listeners[type].filter(function (l) { return l !== listener; });
        }
    };

    VirtualNode.prototype.dispatchEvent = function (event) {
        const type = String(event && event.type ? event.type : event || "").toLowerCase();
        const list = this._listeners[type] || [];
        for (let i = 0; i < list.length; i++) {
            try { list[i].call(this, event); } catch (e) { report(e); }
        }
    };

    VirtualNode.prototype.querySelector = function (selector) {
        const matches = this.querySelectorAll(selector);
        return matches.length > 0 ? matches[0] : null;
    };

    VirtualNode.prototype.querySelectorAll = function (selector) {
        const results = [];
        const sel = String(selector || "").trim();
        function search(node) {
            for (let i = 0; i < node.childNodes.length; i++) {
                const child = node.childNodes[i];
                if (child.nodeType === 1) {
                    if (sel.startsWith("#") && child.id === sel.slice(1)) {
                        results.push(child);
                    } else if (sel.startsWith(".") && child.classList.contains(sel.slice(1))) {
                        results.push(child);
                    } else if (child.tagName.toLowerCase() === sel.toLowerCase()) {
                        results.push(child);
                    }
                    search(child);
                }
            }
        }
        search(this);
        return results;
    };

    VirtualNode.prototype._getRootContainer = function () {
        let cur = this;
        while (cur.parentNode) cur = cur.parentNode;
        return cur;
    };

    VirtualNode.prototype._scheduleSync = function () {
        const root = this._getRootContainer();
        if (root && typeof root.sync === "function") {
            root.sync();
        }
    };

    VirtualNode.prototype.toHtml = function () {
        if (this.nodeType === 3) {
            return this._rawHtml ? this._textContent : escapeHtml(this._textContent);
        }
        const tag = this.tagName.toLowerCase();
        let attrs = "";
        for (const k in this.attributes) {
            if (Object.prototype.hasOwnProperty.call(this.attributes, k)) {
                attrs += " " + k + '="' + escapeHtml(this.attributes[k]) + '"';
            }
        }
        let styleStr = "";
        for (const s in this.style) {
            if (Object.prototype.hasOwnProperty.call(this.style, s) && this.style[s]) {
                const cssKey = s.replace(/([A-Z])/g, "-$1").toLowerCase();
                styleStr += cssKey + ":" + this.style[s] + ";";
            }
        }
        if (styleStr) {
            attrs += ' style="' + escapeHtml(styleStr) + '"';
        }
        const voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
        if (voidTags.indexOf(tag) !== -1) {
            return "<" + tag + attrs + " />";
        }
        const inner = this.childNodes.map(function (c) { return c.toHtml(); }).join("");
        return "<" + tag + attrs + ">" + inner + "</" + tag + ">";
    };

    // Global Document Mock
    global.document = {
        createElement: function (tagName) {
            return new VirtualNode(1, tagName);
        },
        createTextNode: function (text) {
            const node = new VirtualNode(3, "#text");
            node._textContent = String(text !== undefined && text !== null ? text : "");
            return node;
        },
        createDocumentFragment: function () {
            return new VirtualNode(11, "#document-fragment");
        },
        getElementById: function (id) {
            if (global._pcfContainer && global._pcfContainer.id === id) return global._pcfContainer;
            return global._pcfContainer ? global._pcfContainer.querySelector("#" + id) : null;
        },
        querySelector: function (sel) {
            return global._pcfContainer ? global._pcfContainer.querySelector(sel) : null;
        },
        querySelectorAll: function (sel) {
            return global._pcfContainer ? global._pcfContainer.querySelectorAll(sel) : [];
        },
        body: new VirtualNode(1, "body"),
        head: new VirtualNode(1, "head")
    };

    // Default container element
    global._pcfContainer = global.document.createElement("div");
    global._pcfContainer.id = "pcf-container";
    global._pcfContainer.sync = function () {
        if (bridge && typeof bridge.syncDom === "function") {
            try {
                bridge.syncDom(global._pcfContainer.toHtml());
            } catch (e) {
                report(e);
            }
        }
    };
    global.document.body.appendChild(global._pcfContainer);

    // Event dispatcher from Qt Host
    global.dispatchVerseOffDomEvent = function (elementId, eventType, eventValue) {
        const el = elementId ? global.document.getElementById(elementId) : global._pcfContainer;
        if (el) {
            if (eventValue !== undefined) el.value = eventValue;
            el.dispatchEvent({
                type: eventType,
                target: el,
                value: eventValue,
                preventDefault: function () {},
                stopPropagation: function () {}
            });
        }
    };

    // =========================================================================
    // REACT & REACTDOM MOCKS FOR VIRTUAL PCF CONTROLS
    // =========================================================================
    function renderVirtualReact(vnode, parentDom) {
        if (vnode === null || vnode === undefined || vnode === false) return;
        if (typeof vnode === "string" || typeof vnode === "number") {
            parentDom.appendChild(global.document.createTextNode(String(vnode)));
            return;
        }
        if (Array.isArray(vnode)) {
            for (let i = 0; i < vnode.length; i++) renderVirtualReact(vnode[i], parentDom);
            return;
        }
        if (!vnode.type) return;

        // Functional Component
        if (typeof vnode.type === "function") {
            try {
                if (vnode.type.prototype && vnode.type.prototype.render) {
                    const inst = new vnode.type(vnode.props || {});
                    const rendered = inst.render();
                    renderVirtualReact(rendered, parentDom);
                } else {
                    const rendered = vnode.type(vnode.props || {});
                    renderVirtualReact(rendered, parentDom);
                }
            } catch (e) {
                report(e);
            }
            return;
        }

        // Fragment
        if (vnode.type === "react.fragment" || vnode.type === global.React.Fragment) {
            const ch = (vnode.props && vnode.props.children) || [];
            renderVirtualReact(ch, parentDom);
            return;
        }

        // HTML Tag
        if (typeof vnode.type === "string") {
            const dom = global.document.createElement(vnode.type);
            const props = vnode.props || {};
            for (const propName in props) {
                if (propName === "children" || propName === "key" || propName === "ref") continue;
                if (propName === "className") {
                    dom.className = props[propName];
                } else if (propName === "style" && typeof props[propName] === "object") {
                    Object.assign(dom.style, props[propName]);
                } else if (propName.startsWith("on") && typeof props[propName] === "function") {
                    const eventName = propName.slice(2).toLowerCase();
                    dom.addEventListener(eventName, props[propName]);
                } else {
                    dom.setAttribute(propName, props[propName]);
                }
            }
            if (props.children) {
                renderVirtualReact(props.children, dom);
            }
            parentDom.appendChild(dom);
        }
    }

    global.React = {
        createElement: function (type, props) {
            const children = Array.prototype.slice.call(arguments, 2);
            props = Object.assign({}, props);
            const flatChildren = [];
            for (let i = 0; i < children.length; i++) {
                if (Array.isArray(children[i])) {
                    flatChildren.push.apply(flatChildren, children[i]);
                } else if (children[i] !== null && children[i] !== undefined && children[i] !== false) {
                    flatChildren.push(children[i]);
                }
            }
            props.children = flatChildren.length === 1 ? flatChildren[0] : flatChildren;
            return {
                $$typeof: typeof Symbol === "function" && Symbol.for ? Symbol.for("react.element") : 0xeac7,
                type: type,
                props: props,
                key: props.key || null,
                ref: props.ref || null
            };
        },
        Fragment: "react.fragment",
        useState: function (initial) {
            const val = typeof initial === "function" ? initial() : initial;
            return [val, function () {}];
        },
        useEffect: function (fn) {
            try { fn(); } catch (e) { report(e); }
        },
        useCallback: function (fn) { return fn; },
        useMemo: function (fn) { return fn(); },
        useRef: function (val) { return { current: val }; },
        useContext: function (ctx) { return ctx ? ctx._val : null; },
        createContext: function (defVal) {
            return { _val: defVal, Provider: function (p) { return p.children; }, Consumer: function (p) { return p.children(defVal); } };
        },
        Component: function (props) {
            this.props = props || {};
            this.state = {};
        },
        PureComponent: function (props) {
            this.props = props || {};
            this.state = {};
        },
        Children: {
            map: function (c, fn) { return Array.isArray(c) ? c.map(fn) : [fn(c)]; },
            forEach: function (c, fn) { if (Array.isArray(c)) c.forEach(fn); else fn(c); },
            count: function (c) { return Array.isArray(c) ? c.length : (c ? 1 : 0); },
            only: function (c) { return Array.isArray(c) ? c[0] : c; },
            toArray: function (c) { return Array.isArray(c) ? c : [c]; }
        }
    };
    global.React.Component.prototype.setState = function (next) { Object.assign(this.state, next); };
    global.React.PureComponent.prototype.setState = function (next) { Object.assign(this.state, next); };

    global.ReactDOM = {
        render: function (element, container, callback) {
            if (!container) container = global._pcfContainer;
            container.childNodes = [];
            renderVirtualReact(element, container);
            if (typeof container.sync === "function") container.sync();
            if (typeof callback === "function") callback();
        },
        createRoot: function (container) {
            if (!container) container = global._pcfContainer;
            return {
                render: function (element) {
                    global.ReactDOM.render(element, container);
                },
                unmount: function () {
                    container.childNodes = [];
                    if (typeof container.sync === "function") container.sync();
                }
            };
        },
        unmountComponentAtNode: function (container) {
            if (container) {
                container.childNodes = [];
                if (typeof container.sync === "function") container.sync();
            }
            return true;
        }
    };

    // FluentUI React Component Mocks
    const FluentUI = {
        PrimaryButton: function (props) {
            return global.React.createElement("button", {
                className: "ms-Button ms-Button--primary " + (props.className || ""),
                style: Object.assign({ backgroundColor: "#0078d4", color: "#ffffff", padding: "6px 16px", borderRadius: "4px", border: "none", cursor: "pointer", fontWeight: "600" }, props.style || {}),
                onClick: props.onClick
            }, props.text || props.children);
        },
        DefaultButton: function (props) {
            return global.React.createElement("button", {
                className: "ms-Button ms-Button--default " + (props.className || ""),
                style: Object.assign({ backgroundColor: "#ffffff", color: "#323130", padding: "6px 16px", borderRadius: "4px", border: "1px solid #8a8886", cursor: "pointer", fontWeight: "600" }, props.style || {}),
                onClick: props.onClick
            }, props.text || props.children);
        },
        TextField: function (props) {
            return global.React.createElement("div", { className: "ms-TextField" },
                props.label ? global.React.createElement("label", { style: { fontWeight: "600", display: "block", marginBottom: "4px" } }, props.label) : null,
                global.React.createElement("input", {
                    type: "text",
                    value: props.value !== undefined ? props.value : "",
                    placeholder: props.placeholder || "",
                    style: Object.assign({ width: "100%", padding: "6px 8px", border: "1px solid #8a8886", borderRadius: "4px" }, props.style || {}),
                    onChange: props.onChange
                })
            );
        },
        Toggle: function (props) {
            return global.React.createElement("div", { className: "ms-Toggle", style: { display: "flex", alignItems: "center", gap: "8px" } },
                global.React.createElement("button", {
                    type: "button",
                    style: { width: "40px", height: "20px", borderRadius: "10px", backgroundColor: props.checked ? "#0078d4" : "#8a8886", border: "none", cursor: "pointer" },
                    onClick: props.onChange
                }),
                props.label ? global.React.createElement("span", null, props.label) : null
            );
        },
        Slider: function (props) {
            return global.React.createElement("div", { className: "ms-Slider" },
                props.label ? global.React.createElement("label", null, props.label) : null,
                global.React.createElement("input", {
                    type: "range",
                    min: props.min || 0,
                    max: props.max || 100,
                    step: props.step || 1,
                    value: props.value || 0,
                    onChange: props.onChange
                })
            );
        },
        Dropdown: function (props) {
            const options = (props.options || []).map(function (opt) {
                return global.React.createElement("option", { value: opt.key }, opt.text);
            });
            return global.React.createElement("select", { className: "ms-Dropdown", onChange: props.onChange }, options);
        },
        Checkbox: function (props) {
            return global.React.createElement("label", { style: { display: "flex", alignItems: "center", gap: "6px" } },
                global.React.createElement("input", { type: "checkbox", checked: Boolean(props.checked), onChange: props.onChange }),
                props.label ? global.React.createElement("span", null, props.label) : null
            );
        },
        Stack: function (props) {
            return global.React.createElement("div", {
                className: "ms-Stack",
                style: Object.assign({ display: "flex", flexDirection: props.horizontal ? "row" : "column", gap: (props.tokens && props.tokens.childrenGap) || "8px" }, props.style || {})
            }, props.children);
        },
        Label: function (props) {
            return global.React.createElement("label", { className: "ms-Label", style: { fontWeight: "600" } }, props.children);
        },
        Spinner: function (props) {
            return global.React.createElement("div", { className: "ms-Spinner", style: { color: "#0078d4", fontStyle: "italic" } }, props.label || "Loading...");
        },
        Icon: function (props) {
            return global.React.createElement("span", { className: "ms-Icon ms-Icon--" + (props.iconName || "") });
        }
    };
    global.FluentUI = FluentUI;
    global.Fabric = FluentUI;
    global["@fluentui/react"] = FluentUI;


    function callbackPromise(apiName, invoke) {
        return new Promise(function (resolve, reject) {
            try {
                invoke(function (responseJson) {
                    try {
                        const response = JSON.parse(responseJson);
                        if (response && response.error) {
                            reject(new Error(response.error));
                        } else {
                            resolve(response);
                        }
                    } catch (error) {
                        reject(new Error(
                            apiName + " returned invalid JSON: " +
                            error.message
                        ));
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    function makeProperty(definition, value) {
        return {
            raw: value === undefined ? null : value,
            formatted: (
                value === undefined || value === null
                    ? ""
                    : String(value)
            ),
            type: definition.of_type || (
                definition.accepted_types || []
            )[0] || "SingleLine.Text",
            security: {
                editable: definition.editable !== false,
                readable: definition.readable !== false,
                secured: Boolean(definition.secured)
            },
            attributes: definition.attributes || null,
            error: false,
            errorMessage: null
        };
    }

    function makeCollection(items) {
        return {
            get: function (query) {
                if (query === undefined || query === null) {
                    return items.slice();
                }
                if (typeof query === "number") {
                    return items[query] || null;
                }
                if (typeof query === "function") {
                    return items.filter(query);
                }
                return items.find(function (item) {
                    return (
                        item.name === query ||
                        item.id === query
                    );
                }) || null;
            },
            getLength: function () {
                return items.length;
            },
            forEach: function (callback) {
                items.forEach(callback);
            }
        };
    }

    function makeDataset(definition, datasetState) {
        const state = datasetState || {};
        const records = state.records || {};
        const selectedIds = (state.selectedIds || []).slice();
        const paging = {
            hasNextPage: Boolean(state.hasNextPage),
            hasPreviousPage: Boolean(state.hasPreviousPage),
            totalResultCount: Number(
                state.totalRecordCount ||
                Object.keys(records).length
            ),
            setPageSize: function (size) {
                state.pageSize = Number(size);
            },
            loadNextPage: function () {
                return Promise.reject(new Error(
                    "PCF dataset server paging is unavailable offline"
                ));
            },
            loadPreviousPage: function () {
                return Promise.reject(new Error(
                    "PCF dataset server paging is unavailable offline"
                ));
            },
            loadExactPage: function () {
                return Promise.reject(new Error(
                    "PCF dataset server paging is unavailable offline"
                ));
            },
            reset: function () {
                state.page = 1;
            }
        };
        return {
            columns: state.columns || [],
            error: false,
            errorCode: 0,
            errorMessage: "",
            filtering: {
                getFilter: function () {
                    return state.filter || null;
                },
                setFilter: function (filter) {
                    state.filter = filter || null;
                },
                clearFilter: function () {
                    state.filter = null;
                }
            },
            linking: {
                addLinkedEntity: function () {
                    throw new Error(
                        "PCF dataset linked entities are unavailable offline"
                    );
                },
                getLinkedEntities: function () {
                    return [];
                }
            },
            loading: false,
            paging: paging,
            records: records,
            sortedRecordIds: (
                state.sortedRecordIds || Object.keys(records)
            ).slice(),
            sorting: state.sorting || [],
            addColumn: function () {
                throw new Error(
                    "PCF dynamic dataset columns are unavailable offline"
                );
            },
            clearSelectedRecordIds: function () {
                selectedIds.splice(0, selectedIds.length);
            },
            getSelectedRecordIds: function () {
                return selectedIds.slice();
            },
            getTargetEntityType: function () {
                return state.entityName || "";
            },
            getTitle: function () {
                return state.title || definition.display_name_key || "";
            },
            getViewId: function () {
                return state.viewId || "";
            },
            openDatasetItem: function (reference) {
                return context.navigation.openForm({
                    entityName: reference.etn ||
                        reference.entityType ||
                        state.entityName,
                    entityId: reference.id
                });
            },
            refresh: function () {
                bridge.requestDatasetRefresh(definition.name);
            },
            retrieveRecordCommand: function () {
                return Promise.resolve([]);
            },
            setSelectedRecordIds: function (ids) {
                selectedIds.splice(
                    0,
                    selectedIds.length,
                    ...(ids || []).map(String)
                );
            }
        };
    }

    function buildContext(config) {
        const parameters = {};
        const events = {};
        (config.definition.properties || []).forEach(function (definition) {
            parameters[definition.name] = makeProperty(
                definition,
                (config.values || {})[definition.name]
            );
        });
        (config.definition.datasets || []).forEach(function (definition) {
            parameters[definition.name] = makeDataset(
                definition,
                (config.datasets || {})[definition.name]
            );
        });
        (config.definition.events || []).forEach(function (definition) {
            events[definition.name] = function (payload) {
                bridge.eventRaised(
                    definition.name,
                    JSON.stringify(
                        payload === undefined ? null : payload
                    )
                );
            };
        });

        return {
            client: {
                getClient: function () {
                    return "Web";
                },
                getFormFactor: function () {
                    return 1;
                },
                isOffline: function () {
                    return true;
                },
                isNetworkAvailable: function () {
                    return false;
                },
                disableScroll: false
            },
            copilot: {
                isM365CopilotEnabled: function () {
                    return false;
                }
            },
            device: {
                captureAudio: null,
                captureImage: null,
                captureVideo: null,
                getBarcodeValue: null,
                getCurrentPosition: null,
                pickFile: function (options) {
                    return callbackPromise(
                        "Device.pickFile",
                        function (callback) {
                            bridge.pickFile(
                                JSON.stringify(options || {}),
                                callback
                            );
                        }
                    );
                }
            },
            events: events,
            factory: {
                getPopupService: function () {
                    throw new Error(
                        "PCF popup service is unavailable offline"
                    );
                },
                requestRender: function () {
                    global.requestAnimationFrame(function () {
                        if (instance && context) {
                            instance.updateView(context);
                        }
                    });
                }
            },
            formatting: {
                formatCurrency: function (value, precision, symbol) {
                    return String(symbol || "") +
                        Number(value).toFixed(Number(precision || 2));
                },
                formatDecimal: function (value, precision) {
                    return Number(value).toFixed(Number(precision || 2));
                },
                formatInteger: function (value) {
                    return String(Math.trunc(Number(value)));
                },
                formatLanguage: function (languageId) {
                    return String(languageId);
                }
            },
            mode: {
                allocatedHeight: Number(config.height || 0),
                allocatedWidth: Number(config.width || 0),
                isControlDisabled: Boolean(config.disabled),
                isVisible: config.visible !== false,
                label: config.label || "",
                setControlState: function (state) {
                    bridge.setControlState(JSON.stringify(state || {}));
                },
                setFullScreen: function (fullScreen) {
                    bridge.setFullScreen(Boolean(fullScreen));
                },
                trackContainerResize: function (enabled) {
                    bridge.trackContainerResize(Boolean(enabled));
                }
            },
            navigation: {
                openAlertDialog: function (strings, options) {
                    return callbackPromise(
                        "navigation.openAlertDialog",
                        function (callback) {
                            bridge.navigation(
                                "openAlertDialog",
                                JSON.stringify({
                                    strings: strings || {},
                                    options: options || {}
                                }),
                                callback
                            );
                        }
                    );
                },
                openConfirmDialog: function (strings, options) {
                    return callbackPromise(
                        "navigation.openConfirmDialog",
                        function (callback) {
                            bridge.navigation(
                                "openConfirmDialog",
                                JSON.stringify({
                                    strings: strings || {},
                                    options: options || {}
                                }),
                                callback
                            );
                        }
                    );
                },
                openErrorDialog: function (options) {
                    return callbackPromise(
                        "navigation.openErrorDialog",
                        function (callback) {
                            bridge.navigation(
                                "openErrorDialog",
                                JSON.stringify(options || {}),
                                callback
                            );
                        }
                    );
                },
                openForm: function (options, parameters) {
                    return callbackPromise(
                        "navigation.openForm",
                        function (callback) {
                            bridge.navigation(
                                "openForm",
                                JSON.stringify({
                                    options: options || {},
                                    parameters: parameters || {}
                                }),
                                callback
                            );
                        }
                    );
                },
                openFile: function () {
                    return Promise.reject(new Error(
                        "PCF navigation.openFile is unavailable"
                    ));
                },
                openUrl: function (url) {
                    return callbackPromise(
                        "navigation.openUrl",
                        function (callback) {
                            bridge.navigation(
                                "openUrl",
                                JSON.stringify({url: url}),
                                callback
                            );
                        }
                    );
                },
                openWebResource: function (name, options, data) {
                    return callbackPromise(
                        "navigation.openWebResource",
                        function (callback) {
                            bridge.navigation(
                                "openWebResource",
                                JSON.stringify({
                                    name: name,
                                    options: options || {},
                                    data: data || ""
                                }),
                                callback
                            );
                        }
                    );
                }
            },
            parameters: parameters,
            resources: {
                getResource: function (name, success, failure) {
                    const resources = config.resourceContents || {};
                    global.setTimeout(function () {
                        if (
                            Object.prototype.hasOwnProperty.call(
                                resources,
                                name
                            )
                        ) {
                            if (typeof success === "function") {
                                success(resources[name]);
                            }
                        } else if (typeof failure === "function") {
                            failure(
                                "PCF resource was not packaged: " + name
                            );
                        }
                    }, 0);
                },
                getString: function (key) {
                    return (config.strings || {})[key] || key;
                }
            },
            updatedProperties: (config.updatedProperties || []).slice(),
            userSettings: Object.assign({
                dateFormattingInfo: {},
                isRTL: false,
                languageId: 1033,
                numberFormattingInfo: {},
                securityRoles: [],
                userId: "",
                userName: "",
                getTimeZoneOffsetMinutes: function () {
                    return new Date().getTimezoneOffset();
                }
            }, config.userSettings || {}),
            utils: {
                getEntityMetadata: function (entityName, attributes) {
                    return callbackPromise(
                        "utils.getEntityMetadata",
                        function (callback) {
                            bridge.getEntityMetadata(
                                entityName,
                                JSON.stringify(attributes || []),
                                callback
                            );
                        }
                    );
                },
                hasEntityPrivilege: function (
                    entityTypeName,
                    privilegeType,
                    privilegeDepth
                ) {
                    return callbackPromise(
                        "utils.hasEntityPrivilege",
                        function (callback) {
                            bridge.hasEntityPrivilege(
                                entityTypeName,
                                Number(privilegeType),
                                Number(privilegeDepth),
                                callback
                            );
                        }
                    );
                },
                lookupObjects: function (options) {
                    return callbackPromise(
                        "utils.lookupObjects",
                        function (callback) {
                            bridge.lookupObjects(
                                JSON.stringify(options || {}),
                                callback
                            );
                        }
                    );
                }
            },
            webAPI: {
                createRecord: function (entityName, data) {
                    return callbackPromise(
                        "webAPI.createRecord",
                        function (callback) {
                            bridge.webApi(
                                "create",
                                entityName,
                                "",
                                JSON.stringify(data || {}),
                                callback
                            );
                        }
                    );
                },
                deleteRecord: function (entityName, id) {
                    return callbackPromise(
                        "webAPI.deleteRecord",
                        function (callback) {
                            bridge.webApi(
                                "delete",
                                entityName,
                                id,
                                "",
                                callback
                            );
                        }
                    );
                },
                retrieveRecord: function (entityName, id, options) {
                    return callbackPromise(
                        "webAPI.retrieveRecord",
                        function (callback) {
                            bridge.webApi(
                                "retrieve",
                                entityName,
                                id,
                                options || "",
                                callback
                            );
                        }
                    );
                },
                retrieveMultipleRecords: function (
                    entityName,
                    options,
                    maxPageSize
                ) {
                    return callbackPromise(
                        "webAPI.retrieveMultipleRecords",
                        function (callback) {
                            bridge.webApi(
                                "retrieveMultiple",
                                entityName,
                                "",
                                JSON.stringify({
                                    options: options || "",
                                    maxPageSize: maxPageSize || null
                                }),
                                callback
                            );
                        }
                    );
                },
                updateRecord: function (entityName, id, data) {
                    return callbackPromise(
                        "webAPI.updateRecord",
                        function (callback) {
                            bridge.webApi(
                                "update",
                                entityName,
                                id,
                                JSON.stringify(data || {}),
                                callback
                            );
                        }
                    );
                }
            }
        };
    }

    function resolveConstructor(definition) {
        const namespaceParts = String(definition.namespace || "")
            .split(".")
            .filter(Boolean);
        let owner = global;
        namespaceParts.forEach(function (part) {
            owner = owner && owner[part];
        });
        const constructor = owner && owner[definition.constructor];
        if (typeof constructor !== "function") {
            throw new Error(
                "PCF constructor was not registered: " +
                definition.namespace + "." + definition.constructor
            );
        }
        return constructor;
    }

    global.initializeVerseOffPcf = function (config) {
        try {
            configuration = config || {};
            context = buildContext(configuration);
            notifyOutputChanged = function () {
                let outputs = {};
                if (instance && typeof instance.getOutputs === "function") {
                    outputs = instance.getOutputs() || {};
                }
                bridge.outputsChanged(JSON.stringify(outputs));
            };
            const Constructor = resolveConstructor(
                configuration.definition || {}
            );
            instance = new Constructor();
            const container = global.document.getElementById(
                "pcf-container"
            );
            instance.init(
                context,
                notifyOutputChanged,
                configuration.state || {},
                container
            );
            const viewResult = instance.updateView(context);
            if (viewResult && (viewResult.$$typeof || viewResult.type)) {
                global.ReactDOM.render(viewResult, container);
            }
            if (container && typeof container.sync === "function") {
                container.sync();
            }
            bridge.initialized();
            return true;
        } catch (error) {
            report(error);
            return false;
        }
    };

    global.updateVerseOffPcf = function (update) {
        try {
            if (!instance || !context) {
                throw new Error("PCF control is not initialized");
            }
            const next = update || {};
            Object.keys(next.values || {}).forEach(function (name) {
                if (context.parameters[name]) {
                    context.parameters[name].raw = next.values[name];
                    context.parameters[name].formatted = (
                        next.values[name] === null ||
                        next.values[name] === undefined
                            ? ""
                            : String(next.values[name])
                    );
                }
            });
            context.updatedProperties = (
                next.updatedProperties || []
            ).slice();
            if (next.width !== undefined) {
                context.mode.allocatedWidth = Number(next.width);
            }
            if (next.height !== undefined) {
                context.mode.allocatedHeight = Number(next.height);
            }
            const viewResult = instance.updateView(context);
            const container = global.document.getElementById("pcf-container");
            if (viewResult && (viewResult.$$typeof || viewResult.type)) {
                global.ReactDOM.render(viewResult, container);
            }
            if (container && typeof container.sync === "function") {
                container.sync();
            }
            return true;
        } catch (error) {
            report(error);
            return false;
        }
    };

    global.destroyVerseOffPcf = function () {
        try {
            if (instance && typeof instance.destroy === "function") {
                instance.destroy();
            }
        } finally {
            instance = null;
            context = null;
        }
    };

    global.connectVerseOffPcfBridge = function (channelObject) {
        bridge = channelObject;
        bridge.runtimeReady();
    };

    global.ComponentFramework = global.ComponentFramework || {};
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : this));
