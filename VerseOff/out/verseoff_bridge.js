(function (global) {
    "use strict";

    const ASYNC_HANDLER_TIMEOUT_MS = 10000;
    const ASYNC_EVENTS = new Set(["onload", "onsave"]);
    const GRID_EVENTS = new Set([
        "gridonload",
        "gridonchange",
        "onrecordselect",
        "gridonsave"
    ]);

    class VerseOffUnsupportedClientApiError extends Error {
        constructor(apiName, detail) {
            super(
                "VerseOff does not support " + apiName +
                (detail ? ": " + detail : "")
            );
            this.name = "VerseOffUnsupportedClientApiError";
            this.apiName = apiName;
        }
    }

    const runtime = {
        dynamicHandlers: Object.create(null),
        attributeCache: Object.create(null),
        controlCache: Object.create(null),
        pendingOperations: Object.create(null)
    };

    function emptyState() {
        return {
            attributes: {},
            controls: {},
            grids: {},
            entity: {
                logicalName: "",
                id: "",
                primaryIdAttribute: "",
                primaryNameAttribute: "",
                primaryName: ""
            },
            context: {
                clientUrl: "",
                version: "9.2.0.0",
                user: {},
                organization: {},
                app: {},
                client: {
                    client: "Web",
                    state: "Offline",
                    formFactor: 1
                }
            },
            eventHandlers: [],
            queryParameters: {},
            webResources: {},
            webResourceUrls: {},
            localizedResources: {},
            process: {
                processes: [],
                activeProcessId: "",
                activeStageId: "",
                selectedStageId: ""
            }
        };
    }

    global.verseOffState = emptyState();
    global.pyBridge = null;
    global.VerseOffUnsupportedClientApiError =
        VerseOffUnsupportedClientApiError;

    function unsupported(apiName, detail) {
        return new VerseOffUnsupportedClientApiError(apiName, detail);
    }

    function requireBridge(apiName) {
        if (!global.pyBridge) {
            throw unsupported(apiName, "the Chromium/Python bridge is not ready");
        }
        return global.pyBridge;
    }

    function bridgeOperation(apiName, invoke) {
        return new Promise(function (resolve, reject) {
            let bridge;
            try {
                bridge = requireBridge(apiName);
            } catch (error) {
                reject(error);
                return;
            }
            const requestId = (
                apiName + ":" + Date.now() + ":" +
                Math.random().toString(16).slice(2)
            );
            const timer = global.setTimeout(function () {
                delete runtime.pendingOperations[requestId];
                reject(new Error(
                    apiName + " did not complete within 60 seconds"
                ));
            }, 60000);
            runtime.pendingOperations[requestId] = {
                resolve: resolve,
                reject: reject,
                timer: timer,
                apiName: apiName
            };
            try {
                invoke(bridge, requestId);
            } catch (error) {
                global.clearTimeout(timer);
                delete runtime.pendingOperations[requestId];
                reject(error);
            }
        });
    }

    function completeBridgeOperation(requestId, responseJson) {
        const pending = runtime.pendingOperations[requestId];
        if (!pending) {
            return;
        }
        global.clearTimeout(pending.timer);
        delete runtime.pendingOperations[requestId];
        try {
            const response = JSON.parse(responseJson);
            if (response && response.error) {
                pending.reject(new Error(response.error));
            } else {
                pending.resolve(response);
            }
        } catch (error) {
            pending.reject(new Error(
                pending.apiName + " returned invalid JSON: " +
                error.message
            ));
        }
    }

    function normalizeEventName(eventName) {
        const name = String(eventName || "").toLowerCase();
        return {
            loaded: "formloaded",
            onpostsave: "postsave",
            ondataonload: "dataonload"
        }[name] || name;
    }

    function makeCollection(itemsProvider, nameProvider) {
        function items() {
            const value = itemsProvider();
            return Array.isArray(value) ? value : [];
        }
        return {
            get: function (query) {
                const values = items();
                if (query === undefined || query === null) {
                    return values.slice();
                }
                if (typeof query === "number") {
                    return values[query] || null;
                }
                if (typeof query === "function") {
                    return values.filter(function (item, index) {
                        return Boolean(query(item, index));
                    });
                }
                if (Array.isArray(query)) {
                    const wantedNames = new Set(query.map(String));
                    return values.filter(function (item) {
                        return wantedNames.has(String(nameProvider(item)));
                    });
                }
                const wanted = String(query);
                return values.find(function (item) {
                    return String(nameProvider(item)) === wanted;
                }) || null;
            },
            getLength: function () {
                return items().length;
            },
            forEach: function (callback) {
                items().forEach(function (item, index) {
                    callback(item, index);
                });
            }
        };
    }

    function dynamicBucket(eventName, key, create) {
        const normalized = normalizeEventName(eventName);
        if (!runtime.dynamicHandlers[normalized]) {
            if (!create) {
                return [];
            }
            runtime.dynamicHandlers[normalized] = Object.create(null);
        }
        const bucketKey = key || "__form__";
        if (!runtime.dynamicHandlers[normalized][bucketKey]) {
            if (!create) {
                return [];
            }
            runtime.dynamicHandlers[normalized][bucketKey] = [];
        }
        return runtime.dynamicHandlers[normalized][bucketKey];
    }

    function addDynamicHandler(eventName, key, handler) {
        if (typeof handler !== "function") {
            throw new TypeError("Client API event handler must be a function");
        }
        dynamicBucket(eventName, key, true).push(handler);
    }

    function removeDynamicHandler(eventName, key, handler) {
        const handlers = dynamicBucket(eventName, key, false);
        const index = handlers.indexOf(handler);
        if (index >= 0) {
            handlers.splice(index, 1);
        }
    }

    function ensureAttributeState(bag, name) {
        if (!bag[name]) {
            bag[name] = {
                value: null,
                initialValue: null,
                submitMode: "dirty",
                requiredLevel: "none",
                type: "string",
                format: "text",
                dirty: false
            };
        }
        return bag[name];
    }

    function sendFormValue(name, value) {
        if (global.pyBridge) {
            global.pyBridge.updateFieldFromJS(name, JSON.stringify(value));
        }
    }

    function sendGridValue(gridName, rowId, name, value) {
        if (global.pyBridge) {
            global.pyBridge.updateGridCellFromJS(
                gridName,
                rowId,
                name,
                JSON.stringify(value)
            );
        }
    }

    function validateAttributeValue(attributeState, value) {
        if (value === null) {
            return value;
        }
        const type = String(attributeState.type || "string").toLowerCase();
        if (type === "boolean" && typeof value !== "boolean") {
            throw new TypeError("Boolean attributes require a boolean value");
        }
        if (["integer", "bigint", "decimal", "double", "money",
             "optionset", "picklist", "state", "status"].includes(type) &&
            typeof value !== "number") {
            throw new TypeError(type + " attributes require a number value");
        }
        if (
            ["multiselectoptionset", "multiselectpicklist"].includes(type) &&
            (
                !Array.isArray(value) ||
                value.some(function (item) {
                    return typeof item !== "number";
                })
            )
        ) {
            throw new TypeError(
                "Multi-select attributes require an array of numbers"
            );
        }
        if (type === "datetime" && !(value instanceof Date)) {
            throw new TypeError("DateTime attributes require a Date value");
        }
        if (
            ["lookup", "customer", "owner", "partylist"].includes(type) &&
            (
                !Array.isArray(value) ||
                value.some(function (item) {
                    return (
                        !item ||
                        typeof item !== "object" ||
                        !item.id ||
                        !item.entityType
                    );
                })
            )
        ) {
            throw new TypeError(
                "Lookup attributes require an EntityReference array"
            );
        }
        return value;
    }

    function bridgeAttributeValue(value) {
        if (value instanceof Date) {
            return value.toISOString();
        }
        return value;
    }

    function createAttribute(options) {
        const name = options.name;
        function state() {
            return ensureAttributeState(options.bagProvider(), name);
        }
        const attribute = {
            getName: function () {
                return name;
            },
            getValue: function () {
                const item = state();
                if (
                    String(item.type || "").toLowerCase() === "datetime" &&
                    item.value !== null &&
                    !(item.value instanceof Date)
                ) {
                    return new Date(item.value);
                }
                return item.value;
            },
            setValue: function (value) {
                const item = state();
                item.value = validateAttributeValue(item, value);
                item.dirty = true;
                if (options.gridName) {
                    sendGridValue(
                        options.gridName,
                        options.rowId,
                        name,
                        bridgeAttributeValue(value)
                    );
                    void global.executeJsEvent(
                        "gridonchange",
                        options.gridName,
                        {
                            rowId: options.rowId,
                            attributeName: name
                        }
                    );
                } else {
                    sendFormValue(name, bridgeAttributeValue(value));
                }
            },
            getInitialValue: function () {
                const item = state();
                if (
                    String(item.type || "").toLowerCase() === "datetime" &&
                    item.initialValue !== null &&
                    !(item.initialValue instanceof Date)
                ) {
                    return new Date(item.initialValue);
                }
                return item.initialValue;
            },
            getIsDirty: function () {
                return Boolean(state().dirty);
            },
            getSubmitMode: function () {
                return state().submitMode || "dirty";
            },
            setSubmitMode: function (mode) {
                if (!["always", "never", "dirty"].includes(mode)) {
                    throw new RangeError("Invalid submit mode: " + mode);
                }
                state().submitMode = mode;
            },
            getRequiredLevel: function () {
                return state().requiredLevel || "none";
            },
            setRequiredLevel: function (level) {
                if (!["none", "required", "recommended"].includes(level)) {
                    throw new RangeError("Invalid required level: " + level);
                }
                state().requiredLevel = level;
            },
            getAttributeType: function () {
                return state().type || "string";
            },
            getFormat: function () {
                return state().format || null;
            },
            getUserPrivilege: function () {
                return Object.assign({
                    canRead: false,
                    canUpdate: false,
                    canCreate: false
                }, state().userPrivilege || {});
            },
            getParent: function () {
                return options.gridName
                    ? null
                    : formEntity;
            },
            isValid: function () {
                return state().isValid !== false;
            },
            setIsValid: function (isValid, message) {
                state().isValid = Boolean(isValid);
                const notificationId = "attr_valid_" + name;
                if (!isValid && message) {
                    formUi.setFormNotification(
                        String(message),
                        "ERROR",
                        notificationId
                    );
                } else if (isValid) {
                    formUi.clearFormNotification(notificationId);
                }
            },
            getOptions: function () {
                return (state().options || []).map(function (option) {
                    return {
                        text: option.text || option.label || "",
                        value: option.value
                    };
                });
            },
            getOption: function (valueOrLabel) {
                const optionsList = this.getOptions();
                return optionsList.find(function (option) {
                    return (
                        option.value === valueOrLabel ||
                        option.text === valueOrLabel
                    );
                }) || null;
            },
            getSelectedOption: function () {
                const current = state().value;
                if (Array.isArray(current)) {
                    return current.map(function (value) {
                        return attribute.getOption(value);
                    }).filter(Boolean);
                }
                return attribute.getOption(current);
            },
            getText: function () {
                const selected = this.getSelectedOption();
                if (Array.isArray(selected)) {
                    return selected.map(function (option) {
                        return option.text;
                    });
                }
                return selected ? selected.text : null;
            },
            getIsPartyList: function () {
                return Boolean(state().isPartyList);
            },
            getMax: function () {
                return state().max === undefined ? null : state().max;
            },
            getMin: function () {
                return state().min === undefined ? null : state().min;
            },
            getPrecision: function () {
                return state().precision === undefined
                    ? null
                    : state().precision;
            },
            setPrecision: function (precision) {
                const numeric = Number(precision);
                if (!Number.isInteger(numeric) || numeric < 0) {
                    throw new RangeError("Precision must be a nonnegative integer");
                }
                state().precision = numeric;
            },
            getMaxLength: function () {
                return state().maxLength === undefined
                    ? null
                    : state().maxLength;
            },
            addOnChange: function (handler) {
                addDynamicHandler(
                    options.gridName ? "gridonchange" : "onchange",
                    options.runtimeKey || name,
                    handler
                );
            },
            removeOnChange: function (handler) {
                removeDynamicHandler(
                    options.gridName ? "gridonchange" : "onchange",
                    options.runtimeKey || name,
                    handler
                );
            },
            fireOnChange: function () {
                return global.executeJsEvent(
                    options.gridName ? "gridonchange" : "onchange",
                    options.gridName || name,
                    options.gridName ? {
                        rowId: options.rowId,
                        attributeName: name
                    } : {
                        attributeName: name
                    }
                );
            }
        };
        Object.defineProperty(attribute, "controls", {
            enumerable: true,
            get: function () {
                return makeCollection(
                    options.controlsProvider || function () {
                        return [];
                    },
                    function (control) {
                        return control.getName();
                    }
                );
            }
        });
        return attribute;
    }

    function formAttribute(name) {
        if (!runtime.attributeCache[name]) {
            runtime.attributeCache[name] = createAttribute({
                name: name,
                bagProvider: function () {
                    return global.verseOffState.attributes;
                },
                controlsProvider: function () {
                    const control = formControl(name);
                    return control ? [control] : [];
                }
            });
        }
        return runtime.attributeCache[name];
    }

    function gridState(name) {
        return global.verseOffState.grids[name] || {
            name: name,
            entityName: "",
            rows: [],
            selectedIds: [],
            totalRecordCount: 0
        };
    }

    function findGridRow(gridName, rowId) {
        const grid = gridState(gridName);
        const cleanId = String(rowId || "").replace(/[{}]/g, "").toLowerCase();
        return (grid.rows || []).find(function (row) {
            return String(row.id || "")
                .replace(/[{}]/g, "")
                .toLowerCase() === cleanId;
        }) || null;
    }

    function createGridCell(gridName, row, attribute) {
        const attr = createRowAttribute(gridName, row, attribute);
        return {
            getName: function () {
                return attribute;
            },
            getLabel: function () {
                return (
                    ensureAttributeState(row.attributes, attribute).label ||
                    attribute
                );
            },
            getAttribute: function () {
                return attr;
            },
            getValue: function () {
                return attr.getValue();
            },
            setDisabled: function (disabled) {
                const value = ensureAttributeState(row.attributes, attribute);
                value.disabled = Boolean(disabled);
            },
            getDisabled: function () {
                return Boolean(
                    ensureAttributeState(row.attributes, attribute).disabled
                );
            },
            setNotification: function (message, uniqueId) {
                if (global.pyBridge) {
                    global.pyBridge.setFormNotificationFromJS(
                        message,
                        "ERROR",
                        "grid_" + gridName + "_" + row.id + "_" +
                        attribute + "_" + uniqueId
                    );
                }
            },
            clearNotification: function (uniqueId) {
                if (global.pyBridge) {
                    global.pyBridge.clearFormNotificationFromJS(
                        "grid_" + gridName + "_" + row.id + "_" +
                        attribute + "_" + uniqueId
                    );
                }
            }
        };
    }

    function createRowAttribute(gridName, row, attribute) {
        return createAttribute({
            name: attribute,
            bagProvider: function () {
                return row.attributes || (row.attributes = {});
            },
            gridName: gridName,
            rowId: row.id,
            runtimeKey: gridName + ":" + row.id + ":" + attribute,
            controlsProvider: function () {
                return [createGridCell(gridName, row, attribute)];
            }
        });
    }

    function createGridEntity(gridName, row) {
        const attributes = makeCollection(
            function () {
                return Object.keys(row.attributes || {}).map(function (name) {
                    return createRowAttribute(gridName, row, name);
                });
            },
            function (attribute) {
                return attribute.getName();
            }
        );
        return {
            attributes: attributes,
            columns: attributes,
            getId: function () {
                return row.id || "";
            },
            getEntityName: function () {
                return row.entityName || gridState(gridName).entityName || "";
            },
            getPrimaryAttributeValue: function () {
                return row.primaryName || "";
            },
            getEntityReference: function () {
                return {
                    id: row.id || "",
                    entityType: (
                        row.entityName ||
                        gridState(gridName).entityName ||
                        ""
                    ),
                    name: row.primaryName || ""
                };
            },
            getIsDirty: function () {
                return Object.keys(row.attributes || {}).some(function (name) {
                    return Boolean(row.attributes[name].dirty);
                });
            }
        };
    }

    function createRowFormContext(gridName, row) {
        const entity = createGridEntity(gridName, row);
        const controls = makeCollection(
            function () {
                return Object.keys(row.attributes || {}).map(function (name) {
                    return createGridCell(gridName, row, name);
                });
            },
            function (control) {
                return control.getName();
            }
        );
        const data = {
            entity: entity,
            attributes: entity.attributes,
            getIsDirty: entity.getIsDirty,
            isValid: function () {
                return true;
            }
        };
        const ui = { controls: controls };
        return {
            data: data,
            ui: ui,
            getAttribute: function (name) {
                return entity.attributes.get(name);
            },
            getControl: function (name) {
                return controls.get(name);
            }
        };
    }

    function createGridRow(gridName, row) {
        const entity = createGridEntity(gridName, row);
        const data = {
            entity: entity,
            getEntity: function () {
                return entity;
            }
        };
        return {
            data: data,
            getData: function () {
                return data;
            }
        };
    }

    function createGrid(gridName) {
        function rows() {
            return (gridState(gridName).rows || []).map(function (row) {
                return createGridRow(gridName, row);
            });
        }
        function selectedRows() {
            const selected = new Set(
                (gridState(gridName).selectedIds || []).map(String)
            );
            return (gridState(gridName).rows || [])
                .filter(function (row) {
                    return selected.has(String(row.id));
                })
                .map(function (row) {
                    return createGridRow(gridName, row);
                });
        }
        return {
            getRows: function () {
                return makeCollection(
                    rows,
                    function (row) {
                        return row.getData().getEntity().getId();
                    }
                );
            },
            getSelectedRows: function () {
                return makeCollection(
                    selectedRows,
                    function (row) {
                        return row.getData().getEntity().getId();
                    }
                );
            },
            getTotalRecordCount: function () {
                const grid = gridState(gridName);
                return Number(
                    grid.totalRecordCount === undefined
                        ? (grid.rows || []).length
                        : grid.totalRecordCount
                );
            }
        };
    }

    function formControl(name) {
        if (!name) {
            return null;
        }
        if (!runtime.controlCache[name]) {
            runtime.controlCache[name] = {
                getName: function () {
                    return name;
                },
                getLabel: function () {
                    return (global.verseOffState.controls[name] || {}).label || "";
                },
                setLabel: function (label) {
                    const state = global.verseOffState.controls[name] || {};
                    state.label = String(label);
                    global.verseOffState.controls[name] = state;
                },
                getVisible: function () {
                    return (global.verseOffState.controls[name] || {}).visible !== false;
                },
                setVisible: function (visible) {
                    const state = global.verseOffState.controls[name] || {};
                    state.visible = Boolean(visible);
                    global.verseOffState.controls[name] = state;
                    if (global.pyBridge) {
                        global.pyBridge.setControlVisibleFromJS(
                            name,
                            Boolean(visible)
                        );
                    }
                },
                getDisabled: function () {
                    return Boolean(
                        (global.verseOffState.controls[name] || {}).disabled
                    );
                },
                setDisabled: function (disabled) {
                    const state = global.verseOffState.controls[name] || {};
                    state.disabled = Boolean(disabled);
                    global.verseOffState.controls[name] = state;
                    if (global.pyBridge) {
                        global.pyBridge.setControlDisabledFromJS(
                            name,
                            Boolean(disabled)
                        );
                    }
                },
                getControlType: function () {
                    return (
                        (global.verseOffState.controls[name] || {}).type ||
                        "standard"
                    );
                },
                getContentWindow: function () {
                    return Promise.resolve({
                        setClientApiContext: function (xrm, formContext) {
                            if (global.pyBridge) {
                                global.pyBridge.injectWebResourceContextFromJS(name);
                            }
                        }
                    });
                },
                getAttribute: function () {
                    return formAttribute(name);
                },
                getParent: function () {
                    return findControlParent(name);
                },
                getEntityName: function () {
                    if (this.getControlType() !== "subgrid") {
                        return null;
                    }
                    return gridState(name).entityName || null;
                },
                getGridType: function () {
                    return Number(gridState(name).gridType || 1);
                },
                getRelationship: function () {
                    return gridState(name).relationship || null;
                },
                getFetchXml: function () {
                    return gridState(name).fetchXml || "";
                },
                getUrl: function () {
                    throw unsupported("gridControl.getUrl");
                },
                getViewSelector: function () {
                    const grid = gridState(name);
                    return {
                        getCurrentView: function () {
                            return grid.currentView || null;
                        },
                        setCurrentView: function (viewReference) {
                            grid.currentView = viewReference || null;
                            requireBridge("viewSelector.setCurrentView")
                                .setGridViewFromJS(
                                    name,
                                    JSON.stringify(
                                        viewReference || {}
                                    )
                                );
                        },
                        isVisible: function () {
                            return grid.viewSelectorVisible !== false;
                        }
                    };
                },
                openRelatedGrid: function () {
                    requireBridge("gridControl.openRelatedGrid")
                        .openRelatedGridFromJS(name);
                },
                refreshRibbon: function () {
                    requireBridge("gridControl.refreshRibbon")
                        .refreshRibbonFromJS();
                },
                setFocus: function () {
                    requireBridge("control.setFocus")
                        .setControlFocusFromJS(name);
                },
                refresh: function () {
                    requireBridge("control.refresh")
                        .refreshControlFromJS(name);
                },
                getGrid: function () {
                    if (this.getControlType() !== "subgrid") {
                        throw unsupported(
                            "control.getGrid",
                            name + " is not a grid control"
                        );
                    }
                    return createGrid(name);
                },
                addOnLoad: function (handler) {
                    addDynamicHandler("gridonload", name, handler);
                },
                removeOnLoad: function (handler) {
                    removeDynamicHandler("gridonload", name, handler);
                },
                addOnChange: function (handler) {
                    addDynamicHandler("gridonchange", name, handler);
                },
                removeOnChange: function (handler) {
                    removeDynamicHandler("gridonchange", name, handler);
                },
                addOnRecordSelect: function (handler) {
                    addDynamicHandler("onrecordselect", name, handler);
                },
                removeOnRecordSelect: function (handler) {
                    removeDynamicHandler("onrecordselect", name, handler);
                },
                addOnSave: function (handler) {
                    addDynamicHandler("gridonsave", name, handler);
                },
                removeOnSave: function (handler) {
                    removeDynamicHandler("gridonsave", name, handler);
                },
                addPreSearch: function (handler) {
                    addDynamicHandler("presearch", name, handler);
                },
                removePreSearch: function (handler) {
                    removeDynamicHandler("presearch", name, handler);
                },
                addOnLookupTagClick: function (handler) {
                    addDynamicHandler("onlookuptagclick", name, handler);
                },
                removeOnLookupTagClick: function (handler) {
                    removeDynamicHandler("onlookuptagclick", name, handler);
                },
                addOnOutputChange: function (handler) {
                    addDynamicHandler("onoutputchange", name, handler);
                },
                removeOnOutputChange: function (handler) {
                    removeDynamicHandler("onoutputchange", name, handler);
                },
                addNotification: function (notification) {
                    const messages = (notification || {}).messages || [];
                    const uniqueId = (
                        (notification || {}).uniqueId ||
                        String(Date.now())
                    );
                    if (messages.length) {
                        formUi.setFormNotification(
                            messages[0],
                            (notification || {}).notificationLevel ||
                                "ERROR",
                            "ctrl_" + name + "_" + uniqueId
                        );
                    }
                    return true;
                },
                setNotification: function (message, uniqueId) {
                    return formUi.setFormNotification(
                        message,
                        "ERROR",
                        "ctrl_" + name + "_" + uniqueId
                    );
                },
                clearNotification: function (uniqueId) {
                    return formUi.clearFormNotification(
                        "ctrl_" + name + "_" + uniqueId
                    );
                },
                getOutputs: function () {
                    return Object.assign(
                        {},
                        (global.verseOffState.controls[name] || {}).outputs ||
                            {}
                    );
                },
                getSrc: function () {
                    return (
                        (global.verseOffState.controls[name] || {}).src ||
                        ""
                    );
                },
                setSrc: function (src) {
                    const state = (
                        global.verseOffState.controls[name] || {}
                    );
                    state.src = String(src || "");
                    requireBridge("control.setSrc")
                        .setWebResourceSourceFromJS(name, state.src);
                },
                getInitialUrl: function () {
                    return (
                        (global.verseOffState.controls[name] || {})
                            .initialUrl || ""
                    );
                },
                getData: function () {
                    return (
                        (global.verseOffState.controls[name] || {}).data ||
                        ""
                    );
                },
                setData: function (data) {
                    const state = (
                        global.verseOffState.controls[name] || {}
                    );
                    state.data = String(data || "");
                    requireBridge("control.setData")
                        .setWebResourceDataFromJS(name, state.data);
                },
                getContentWindow: function () {
                    const invoke = function (functionName, args) {
                        return bridgeOperation(
                            "control.getContentWindow." + functionName,
                            function (bridge, requestId) {
                                bridge.requestWebResourceInvocationFromJS(
                                    requestId,
                                    name,
                                    functionName,
                                    JSON.stringify(args || [])
                                );
                            }
                        ).then(function (response) {
                            return response.value;
                        });
                    };
                    const target = {
                        invoke: function (functionName) {
                            return invoke(
                                functionName,
                                Array.prototype.slice.call(arguments, 1)
                            );
                        },
                        postMessage: function (message, targetOrigin) {
                            return invoke("__postMessage", [
                                message,
                                targetOrigin || "*"
                            ]);
                        }
                    };
                    return Promise.resolve(new Proxy(target, {
                        get: function (object, property) {
                            if (property === "then") {
                                return undefined;
                            }
                            if (property in object) {
                                return object[property];
                            }
                            return function () {
                                return invoke(
                                    String(property),
                                    Array.prototype.slice.call(arguments)
                                );
                            };
                        }
                    }));
                },
                getObject: function () {
                    throw unsupported(
                        "control.getObject",
                        "DOM objects cannot cross QWebEngine processes"
                    );
                },
                addOnReadyStateComplete: function (handler) {
                    addDynamicHandler(
                        "onreadystatecomplete",
                        name,
                        handler
                    );
                },
                removeOnReadyStateComplete: function (handler) {
                    removeDynamicHandler(
                        "onreadystatecomplete",
                        name,
                        handler
                    );
                },
                addOnResultOpened: function (handler) {
                    addDynamicHandler("onresultopened", name, handler);
                },
                removeOnResultOpened: function (handler) {
                    removeDynamicHandler("onresultopened", name, handler);
                },
                addOnSelection: function (handler) {
                    addDynamicHandler("onselection", name, handler);
                },
                removeOnSelection: function (handler) {
                    removeDynamicHandler("onselection", name, handler);
                },
                addOnPostSearch: function (handler) {
                    addDynamicHandler("onpostsearch", name, handler);
                },
                removeOnPostSearch: function (handler) {
                    removeDynamicHandler("onpostsearch", name, handler);
                },
                getSearchQuery: function () {
                    return (
                        (global.verseOffState.controls[name] || {})
                            .searchQuery || ""
                    );
                },
                setSearchQuery: function (query) {
                    const state = (
                        global.verseOffState.controls[name] || {}
                    );
                    state.searchQuery = String(query || "");
                },
                getSelectedResults: function () {
                    return (
                        (global.verseOffState.controls[name] || {})
                            .selectedResults || []
                    ).slice();
                },
                getTotalResultCount: function () {
                    return Number(
                        (global.verseOffState.controls[name] || {})
                            .totalResultCount || 0
                    );
                },
                openSearchResult: function () {
                    throw unsupported(
                        "kbsearch.openSearchResult",
                        "knowledge results are not cached"
                    );
                },
                getState: function () {
                    return Number(
                        (global.verseOffState.controls[name] || {})
                            .state || 0
                    );
                },
                isLoaded: function () {
                    return (
                        (global.verseOffState.controls[name] || {})
                            .isLoaded !== false
                    );
                },
                getOptions: function () {
                    return formAttribute(name).getOptions();
                },
                addOption: function (option, index) {
                    const state = (
                        global.verseOffState.controls[name] || {}
                    );
                    const options = state.options || (
                        state.options = []
                    );
                    const value = {
                        text: (option || {}).text || "",
                        value: (option || {}).value
                    };
                    if (index === undefined || index === null) {
                        options.push(value);
                    } else {
                        options.splice(Number(index), 0, value);
                    }
                },
                clearOptions: function () {
                    const state = (
                        global.verseOffState.controls[name] || {}
                    );
                    state.options = [];
                },
                removeOption: function (value) {
                    const state = (
                        global.verseOffState.controls[name] || {}
                    );
                    state.options = (state.options || []).filter(
                        function (option) {
                            return option.value !== value;
                        }
                    );
                },
                getEntityTypes: function () {
                    return (
                        (global.verseOffState.controls[name] || {})
                            .entityTypes || []
                    ).slice();
                },
                setEntityTypes: function (entityTypes) {
                    const state = (
                        global.verseOffState.controls[name] || {}
                    );
                    state.entityTypes = (entityTypes || []).slice();
                    requireBridge("lookup.setEntityTypes")
                        .setLookupEntityTypesFromJS(
                            name,
                            JSON.stringify(state.entityTypes)
                        );
                },
                getDefaultView: function () {
                    return (
                        (global.verseOffState.controls[name] || {})
                            .defaultView || null
                    );
                },
                setDefaultView: function (viewId) {
                    const state = (
                        global.verseOffState.controls[name] || {}
                    );
                    state.defaultView = viewId || null;
                    requireBridge("lookup.setDefaultView")
                        .setLookupDefaultViewFromJS(
                            name,
                            String(viewId || "")
                        );
                },
                addCustomFilter: function (
                    filter,
                    entityLogicalName
                ) {
                    const state = (
                        global.verseOffState.controls[name] || {}
                    );
                    (state.customFilters || (
                        state.customFilters = []
                    )).push({
                        filter: filter,
                        entityLogicalName: entityLogicalName || null
                    });
                    requireBridge("lookup.addCustomFilter")
                        .addLookupFilterFromJS(
                            name,
                            String(filter || ""),
                            String(entityLogicalName || "")
                        );
                },
                addCustomView: function (
                    viewId,
                    entityName,
                    viewDisplayName,
                    fetchXml,
                    layoutXml,
                    isDefault
                ) {
                    const state = (
                        global.verseOffState.controls[name] || {}
                    );
                    (state.customViews || (
                        state.customViews = []
                    )).push({
                        viewId: viewId,
                        entityName: entityName,
                        viewDisplayName: viewDisplayName,
                        fetchXml: fetchXml,
                        layoutXml: layoutXml,
                        isDefault: Boolean(isDefault)
                    });
                    requireBridge("lookup.addCustomView")
                        .addLookupViewFromJS(
                            name,
                            JSON.stringify({
                                viewId: viewId,
                                entityName: entityName,
                                viewDisplayName: viewDisplayName,
                                fetchXml: fetchXml,
                                layoutXml: layoutXml,
                                isDefault: Boolean(isDefault)
                            })
                        );
                }
            };
        }
        return runtime.controlCache[name];
    }

    const formAttributes = makeCollection(
        function () {
            return Object.keys(global.verseOffState.attributes)
                .filter(function (name) {
                    return (
                        global.verseOffState.attributes[name]
                            .isEntityAttribute !== false
                    );
                })
                .map(formAttribute);
        },
        function (attribute) {
            return attribute.getName();
        }
    );
    const formDataAttributes = makeCollection(
        function () {
            return Object.keys(global.verseOffState.attributes)
                .filter(function (name) {
                    return (
                        global.verseOffState.attributes[name]
                            .isEntityAttribute === false
                    );
                })
                .map(formAttribute);
        },
        function (attribute) {
            return attribute.getName();
        }
    );

    const formControls = makeCollection(
        function () {
            return Object.keys(global.verseOffState.controls).map(
                formControl
            );
        },
        function (control) {
            return control.getName();
        }
    );

    const formEntity = {
        attributes: formAttributes,
        getId: function () {
            return global.verseOffState.entity.id || "";
        },
        getEntityName: function () {
            return global.verseOffState.entity.logicalName || "";
        },
        getPrimaryAttributeValue: function () {
            return global.verseOffState.entity.primaryName || "";
        },
        getEntityReference: function () {
            return {
                id: this.getId(),
                entityType: this.getEntityName(),
                name: this.getPrimaryAttributeValue()
            };
        },
        getIsDirty: function () {
            return Object.keys(global.verseOffState.attributes).some(
                function (name) {
                    return Boolean(global.verseOffState.attributes[name].dirty);
                }
            );
        },
        getDataXml: function () {
            const values = Object.keys(global.verseOffState.attributes)
                .filter(function (name) {
                    const attribute =
                        global.verseOffState.attributes[name];
                    return (
                        attribute.isEntityAttribute !== false &&
                        attribute.submitMode !== "never" &&
                        (
                            attribute.dirty ||
                            attribute.submitMode === "always"
                        )
                    );
                })
                .map(function (name) {
                    const attribute =
                        global.verseOffState.attributes[name];
                    return (
                        "<" + name + ">" +
                        global.Xrm.Encoding.xmlEncode(
                            attribute.value === null ||
                            attribute.value === undefined
                                ? ""
                                : String(attribute.value)
                        ) +
                        "</" + name + ">"
                    );
                })
                .join("");
            return "<entity>" + values + "</entity>";
        },
        isValid: function () {
            return Object.keys(global.verseOffState.attributes)
                .filter(function (name) {
                    return (
                        global.verseOffState.attributes[name]
                            .isEntityAttribute !== false
                    );
                })
                .every(function (name) {
                    return (
                        global.verseOffState.attributes[name]
                            .isValid !== false
                    );
                });
        },
        save: function (saveMode) {
            void bridgeOperation(
                "formContext.data.entity.save",
                function (bridge, requestId) {
                    bridge.requestSaveFromJS(
                        requestId,
                        Number(saveMode || 1)
                    );
                }
            );
        },
        addOnSave: function (handler) {
            addDynamicHandler("onsave", null, handler);
        },
        removeOnSave: function (handler) {
            removeDynamicHandler("onsave", null, handler);
        },
        addOnPostSave: function (handler) {
            addDynamicHandler("postsave", null, handler);
        },
        removeOnPostSave: function (handler) {
            removeDynamicHandler("postsave", null, handler);
        }
    };

    const formData = {
        entity: formEntity,
        attributes: formDataAttributes,
        addOnLoad: function (handler) {
            addDynamicHandler("dataonload", null, handler);
        },
        removeOnLoad: function (handler) {
            removeDynamicHandler("dataonload", null, handler);
        },
        getIsDirty: formEntity.getIsDirty,
        isValid: function () {
            return true;
        },
        refresh: function (save) {
            return bridgeOperation(
                "formContext.data.refresh",
                function (bridge, requestId) {
                    bridge.requestRefreshFormDataFromJS(
                        requestId,
                        Boolean(save)
                    );
                }
            );
        },
        save: function (options) {
            const mode = options && options.saveMode
                ? Number(options.saveMode)
                : 1;
            return bridgeOperation(
                "formContext.data.save",
                function (bridge, requestId) {
                    bridge.requestSaveFromJS(requestId, mode);
                }
            );
        }
    };

    function processDefinitionById(processId) {
        const processState = global.verseOffState.process || {};
        return (processState.processes || []).find(function (process) {
            return String(process.id || "") === String(processId || "");
        }) || null;
    }

    function stageDefinitionById(stageId) {
        const processState = global.verseOffState.process || {};
        for (const process of processState.processes || []) {
            const stage = (process.stages || []).find(function (item) {
                return String(item.id || "") === String(stageId || "");
            });
            if (stage) {
                return stage;
            }
        }
        return null;
    }

    function createProcessStep(step) {
        return {
            getAttribute: function () {
                return step.attribute || null;
            },
            getName: function () {
                return step.name || step.attribute || "";
            },
            getProgress: function () {
                return Number(step.progress || 0);
            },
            isRequired: function () {
                return Boolean(step.required);
            },
            setProgress: function (progress, message) {
                step.progress = Number(progress);
                step.progressMessage = message || "";
            }
        };
    }

    function createProcessStage(stage) {
        if (!stage) {
            return null;
        }
        return {
            getCategory: function () {
                return {
                    getValue: function () {
                        return Number(stage.category || 0);
                    }
                };
            },
            getEntityName: function () {
                return stage.entityName || "";
            },
            getId: function () {
                return stage.id || "";
            },
            getName: function () {
                return stage.name || "";
            },
            getNavigationBehavior: function () {
                return stage.navigationBehavior || null;
            },
            getStatus: function () {
                return stage.status || "inactive";
            },
            getSteps: function () {
                return makeCollection(
                    function () {
                        return (stage.steps || []).map(createProcessStep);
                    },
                    function (step) {
                        return step.getName();
                    }
                );
            }
        };
    }

    function createProcessDefinition(process) {
        if (!process) {
            return null;
        }
        return {
            getId: function () {
                return process.id || "";
            },
            getName: function () {
                return process.name || "";
            },
            getStages: function () {
                return makeCollection(
                    function () {
                        return (process.stages || []).map(
                            createProcessStage
                        );
                    },
                    function (stage) {
                        return stage.getId();
                    }
                );
            },
            isRendered: function () {
                return process.rendered !== false;
            }
        };
    }

    function persistProcessState() {
        return bridgePromise(
            "formContext.data.process",
            function (bridge, callback) {
                bridge.updateProcessStateFromJS(
                    JSON.stringify(global.verseOffState.process || {}),
                    callback
                );
            }
        );
    }

    function navigateToStage(stageId, direction, callback) {
        const target = stageDefinitionById(stageId);
        if (!target) {
            if (callback) {
                callback("invalid");
            }
            return;
        }
        void global.executeJsEvent(
            "onprestagechange",
            null,
            {stageId: stageId, direction: direction}
        ).then(function (preResult) {
            if (
                preResult.prevented ||
                (preResult.errors || []).length
            ) {
                if (callback) {
                    callback("preventDefault");
                }
                return;
            }
            global.verseOffState.process.activeStageId = stageId;
            global.verseOffState.process.selectedStageId = stageId;
            return persistProcessState().then(function () {
                return global.executeJsEvent(
                    "onstagechange",
                    null,
                    {stageId: stageId, direction: direction}
                );
            }).then(function () {
                return global.executeJsEvent(
                    "onstageselected",
                    null,
                    {stageId: stageId, direction: direction}
                );
            }).then(function () {
                if (callback) {
                    callback("success");
                }
            });
        }).catch(function (error) {
            console.error(error);
            if (callback) {
                callback("invalid");
            }
        });
    }

    const formProcess = {
        addOnPreProcessStatusChange: function (handler) {
            addDynamicHandler("onpreprocessstatuschange", null, handler);
        },
        removeOnPreProcessStatusChange: function (handler) {
            removeDynamicHandler(
                "onpreprocessstatuschange",
                null,
                handler
            );
        },
        addOnProcessStatusChange: function (handler) {
            addDynamicHandler("onprocessstatuschange", null, handler);
        },
        removeOnProcessStatusChange: function (handler) {
            removeDynamicHandler("onprocessstatuschange", null, handler);
        },
        addOnPreStageChange: function (handler) {
            addDynamicHandler("onprestagechange", null, handler);
        },
        removeOnPreStageChange: function (handler) {
            removeDynamicHandler("onprestagechange", null, handler);
        },
        addOnStageChange: function (handler) {
            addDynamicHandler("onstagechange", null, handler);
        },
        removeOnStageChange: function (handler) {
            removeDynamicHandler("onstagechange", null, handler);
        },
        addOnStageSelected: function (handler) {
            addDynamicHandler("onstageselected", null, handler);
        },
        removeOnStageSelected: function (handler) {
            removeDynamicHandler("onstageselected", null, handler);
        },
        getActiveProcess: function () {
            return createProcessDefinition(
                processDefinitionById(
                    (global.verseOffState.process || {}).activeProcessId
                )
            );
        },
        getActiveStage: function () {
            return createProcessStage(
                stageDefinitionById(
                    (global.verseOffState.process || {}).activeStageId
                )
            );
        },
        getSelectedStage: function () {
            return createProcessStage(
                stageDefinitionById(
                    (global.verseOffState.process || {}).selectedStageId
                )
            );
        },
        getActivePath: function () {
            const process = processDefinitionById(
                (global.verseOffState.process || {}).activeProcessId
            );
            return makeCollection(
                function () {
                    return (process && process.stages || []).map(
                        createProcessStage
                    );
                },
                function (stage) {
                    return stage.getId();
                }
            );
        },
        setActiveProcess: function (processId, callback) {
            const process = processDefinitionById(processId);
            if (!process) {
                if (callback) {
                    callback("invalid");
                }
                return;
            }
            void global.executeJsEvent(
                "onpreprocessstatuschange",
                null,
                {}
            ).then(function (preResult) {
                if (
                    preResult.prevented ||
                    (preResult.errors || []).length
                ) {
                    if (callback) {
                        callback("preventDefault");
                    }
                    return;
                }
                global.verseOffState.process.activeProcessId = processId;
                global.verseOffState.process.activeStageId = (
                    (process.stages || [])[0] || {}
                ).id || "";
                global.verseOffState.process.selectedStageId =
                    global.verseOffState.process.activeStageId;
                return persistProcessState().then(function () {
                    return global.executeJsEvent(
                        "onprocessstatuschange",
                        null,
                        {}
                    );
                }).then(function () {
                    if (callback) {
                        callback("success");
                    }
                });
            }).catch(function () {
                if (callback) {
                    callback("invalid");
                }
            });
        },
        setActiveStage: function (stageId, callback) {
            navigateToStage(stageId, null, callback);
        },
        moveNext: function (callback) {
            const path = this.getActivePath().get();
            const current = global.verseOffState.process.activeStageId;
            const index = path.findIndex(function (stage) {
                return stage.getId() === current;
            });
            if (index < 0 || index + 1 >= path.length) {
                if (callback) {
                    callback("end");
                }
                return;
            }
            navigateToStage(
                path[index + 1].getId(),
                "Next",
                callback
            );
        },
        movePrevious: function (callback) {
            const path = this.getActivePath().get();
            const current = global.verseOffState.process.activeStageId;
            const index = path.findIndex(function (stage) {
                return stage.getId() === current;
            });
            if (index <= 0) {
                if (callback) {
                    callback("beginning");
                }
                return;
            }
            navigateToStage(
                path[index - 1].getId(),
                "Previous",
                callback
            );
        },
        getEnabledProcesses: function (callback) {
            const processes = {};
            ((global.verseOffState.process || {}).processes || []).forEach(
                function (process) {
                    processes[process.id] = process.name;
                }
            );
            callback(processes);
        },
        getProcessInstances: function (callback) {
            callback([]);
        },
        setActiveProcessInstance: function (
            processInstanceId,
            callback,
            errorCallback
        ) {
            if (errorCallback) {
                errorCallback(
                    unsupported(
                        "formContext.data.process.setActiveProcessInstance"
                    )
                );
            }
        }
    };

    formData.process = formProcess;

    function uiState() {
        return global.verseOffState.ui || {
            tabs: {},
            forms: [],
            navigation: [],
            process: {},
            headerSection: {}
        };
    }

    function createSection(tabName, sectionName) {
        function state() {
            return (
                ((uiState().tabs || {})[tabName] || {}).sections || {}
            )[sectionName] || {};
        }
        return {
            controls: makeCollection(
                function () {
                    return (state().controls || []).map(formControl);
                },
                function (control) {
                    return control.getName();
                }
            ),
            getName: function () {
                return sectionName;
            },
            getLabel: function () {
                return state().label || sectionName;
            },
            setLabel: function (label) {
                state().label = String(label);
                requireBridge("section.setLabel")
                    .setSectionLabelFromJS(
                        tabName,
                        sectionName,
                        String(label)
                    );
            },
            getParent: function () {
                return createTab(tabName);
            },
            getVisible: function () {
                return state().visible !== false;
            },
            setVisible: function (visible) {
                state().visible = Boolean(visible);
                requireBridge("section.setVisible")
                    .setSectionVisibleFromJS(
                        tabName,
                        sectionName,
                        Boolean(visible)
                    );
            }
        };
    }

    function createTab(tabName) {
        function state() {
            return (uiState().tabs || {})[tabName] || {};
        }
        return {
            sections: makeCollection(
                function () {
                    return Object.keys(state().sections || {}).map(
                        function (sectionName) {
                            return createSection(tabName, sectionName);
                        }
                    );
                },
                function (section) {
                    return section.getName();
                }
            ),
            addTabStateChange: function (handler) {
                addDynamicHandler(
                    "tabstatechange",
                    tabName,
                    handler
                );
            },
            removeTabStateChange: function (handler) {
                removeDynamicHandler(
                    "tabstatechange",
                    tabName,
                    handler
                );
            },
            getContentType: function () {
                return state().contentType || "data";
            },
            setContentType: function (contentType) {
                state().contentType = contentType;
            },
            getDisplayState: function () {
                return state().displayState || "collapsed";
            },
            setDisplayState: function (displayState) {
                if (!["expanded", "collapsed"].includes(displayState)) {
                    throw new RangeError(
                        "Tab display state must be expanded or collapsed"
                    );
                }
                state().displayState = displayState;
                requireBridge("tab.setDisplayState")
                    .setTabDisplayStateFromJS(tabName, displayState);
            },
            getLabel: function () {
                return state().label || tabName;
            },
            setLabel: function (label) {
                state().label = String(label);
                requireBridge("tab.setLabel")
                    .setTabLabelFromJS(tabName, String(label));
            },
            getName: function () {
                return tabName;
            },
            getParent: function () {
                return formUi;
            },
            getVisible: function () {
                return state().visible !== false;
            },
            setVisible: function (visible) {
                state().visible = Boolean(visible);
                requireBridge("tab.setVisible")
                    .setTabVisibleFromJS(tabName, Boolean(visible));
            },
            setFocus: function () {
                this.setDisplayState("expanded");
            }
        };
    }

    function findControlParent(controlName) {
        for (const tabName of Object.keys(uiState().tabs || {})) {
            const tab = (uiState().tabs || {})[tabName];
            for (const sectionName of Object.keys(
                tab.sections || {}
            )) {
                if (
                    (tab.sections[sectionName].controls || [])
                        .includes(controlName)
                ) {
                    return createSection(tabName, sectionName);
                }
            }
        }
        return null;
    }

    const formTabs = makeCollection(
        function () {
            return Object.keys(uiState().tabs || {}).map(createTab);
        },
        function (tab) {
            return tab.getName();
        }
    );

    function formItem(item) {
        return {
            getId: function () {
                return item.id || "";
            },
            getLabel: function () {
                return item.label || "";
            },
            getVisible: function () {
                return item.visible !== false;
            },
            setVisible: function (visible) {
                item.visible = Boolean(visible);
            },
            navigate: function () {
                requireBridge("formSelectorItem.navigate")
                    .navigateFormFromJS(item.id || "");
            }
        };
    }

    function navigationItem(item) {
        return {
            getId: function () {
                return item.id || "";
            },
            getLabel: function () {
                return item.label || "";
            },
            setLabel: function (label) {
                item.label = String(label);
            },
            getVisible: function () {
                return item.visible !== false;
            },
            setVisible: function (visible) {
                item.visible = Boolean(visible);
            },
            setFocus: function () {
                throw unsupported(
                    "navigationItem.setFocus",
                    "the generated form has no legacy form-navigation pane"
                );
            }
        };
    }

    const formUi = {
        controls: formControls,
        tabs: formTabs,
        formSelector: {
            items: makeCollection(
                function () {
                    return (uiState().forms || []).map(formItem);
                },
                function (item) {
                    return item.getId();
                }
            ),
            getCurrentItem: function () {
                const active = uiState().activeFormId;
                const item = (uiState().forms || []).find(
                    function (candidate) {
                        return candidate.id === active;
                    }
                );
                return item ? formItem(item) : null;
            }
        },
        navigation: {
            items: makeCollection(
                function () {
                    return (uiState().navigation || []).map(
                        navigationItem
                    );
                },
                function (item) {
                    return item.getId();
                }
            )
        },
        process: {
            getDisplayState: function () {
                return uiState().process.displayState || "expanded";
            },
            setDisplayState: function (displayState) {
                uiState().process.displayState = displayState;
            },
            getVisible: function () {
                return uiState().process.visible !== false;
            },
            setVisible: function (visible) {
                uiState().process.visible = Boolean(visible);
            },
            reflow: function () {}
        },
        quickForms: makeCollection(
            function () {
                return Object.keys(
                    global.verseOffState.controls || {}
                ).filter(function (name) {
                    return (
                        global.verseOffState.controls[name].type
                        === "quickform"
                    );
                }).map(formControl);
            },
            function (control) {
                return control.getName();
            }
        ),
        headerSection: {
            getBodyVisible: function () {
                return uiState().headerSection.bodyVisible !== false;
            },
            setBodyVisible: function (visible) {
                uiState().headerSection.bodyVisible = Boolean(visible);
            },
            getCommandBarVisible: function () {
                return (
                    uiState().headerSection.commandBarVisible !== false
                );
            },
            setCommandBarVisible: function (visible) {
                uiState().headerSection.commandBarVisible =
                    Boolean(visible);
            },
            getTabNavigatorVisible: function () {
                return (
                    uiState().headerSection.tabNavigatorVisible !== false
                );
            },
            setTabNavigatorVisible: function (visible) {
                uiState().headerSection.tabNavigatorVisible =
                    Boolean(visible);
            }
        },
        addOnLoad: function (handler) {
            addDynamicHandler("onload", null, handler);
        },
        removeOnLoad: function (handler) {
            removeDynamicHandler("onload", null, handler);
        },
        addLoaded: function (handler) {
            addDynamicHandler("formloaded", null, handler);
        },
        removeLoaded: function (handler) {
            removeDynamicHandler("formloaded", null, handler);
        },
        getFormType: function () {
            return Number(global.verseOffState.formType || 1);
        },
        getViewPortHeight: function () {
            return Number(global.innerHeight || 0);
        },
        getViewPortWidth: function () {
            return Number(global.innerWidth || 0);
        },
        setFormNotification: function (message, level, uniqueId) {
            requireBridge("formContext.ui.setFormNotification")
                .setFormNotificationFromJS(message, level, uniqueId);
            return true;
        },
        clearFormNotification: function (uniqueId) {
            requireBridge("formContext.ui.clearFormNotification")
                .clearFormNotificationFromJS(uniqueId);
            return true;
        },
        refreshRibbon: function () {
            requireBridge("formContext.ui.refreshRibbon")
                .refreshRibbonFromJS();
        },
        close: function () {
            requireBridge("formContext.ui.close").closeFormFromJS();
        },
        setFormEntityName: function (entityName) {
            global.verseOffState.entity.logicalName =
                String(entityName || "");
        }
    };

    global.formContext = {
        data: formData,
        ui: formUi,
        getAttribute: function (name) {
            return formAttributes.get(name);
        },
        getControl: function (name) {
            return formControls.get(name);
        }
    };

    function eventSubject(eventName, controlName, payload) {
        const event = normalizeEventName(eventName);
        if (GRID_EVENTS.has(event)) {
            const gridControl = formControl(controlName);
            if (event === "gridonload") {
                return {
                    formContext: global.formContext,
                    eventSource: gridControl
                };
            }
            const row = findGridRow(controlName, payload.rowId);
            if (!row) {
                throw new Error(
                    "Grid event " + event + " could not resolve row " +
                    String(payload.rowId || "") + " in " + controlName
                );
            }
            const rowContext = createRowFormContext(controlName, row);
            const entity = rowContext.data.entity;
            if (event === "gridonchange") {
                const attribute = payload.attributeName
                    ? rowContext.getAttribute(payload.attributeName)
                    : null;
                if (!attribute) {
                    throw new Error(
                        "Grid OnChange requires a valid attributeName"
                    );
                }
                return {
                    formContext: rowContext,
                    eventSource: attribute
                };
            }
            return {
                formContext: rowContext,
                eventSource: entity
            };
        }
        if (event === "onchange") {
            return {
                formContext: global.formContext,
                eventSource: formAttribute(
                    payload.attributeName || controlName
                )
            };
        }
        if (event === "tabstatechange") {
            return {
                formContext: global.formContext,
                eventSource: createTab(controlName)
            };
        }
        if ([
            "presearch",
            "onlookuptagclick",
            "onoutputchange",
            "onreadystatecomplete",
            "onresultopened",
            "onselection",
            "onpostsearch"
        ].includes(event)) {
            return {
                formContext: global.formContext,
                eventSource: formControl(controlName)
            };
        }
        if ([
            "onprocessstatuschange",
            "onpreprocessstatuschange",
            "onstagechange",
            "onprestagechange",
            "onstageselected"
        ].includes(event)) {
            return {
                formContext: global.formContext,
                eventSource: formProcess
            };
        }
        return {
            formContext: global.formContext,
            eventSource: {
                onload: formUi,
                formloaded: formUi,
                dataonload: formEntity,
                onsave: formEntity,
                postsave: null
            }[event] || (controlName ? formControl(controlName) : null)
        };
    }

    function createEventArguments(eventName, payload, saveState) {
        const event = normalizeEventName(eventName);
        if (event === "onsave" || event === "gridonsave") {
            let syncPhase = true;
            let preventOnError = false;
            let timeoutDisabled = false;
            return {
                getSaveMode: function () {
                    return Number(payload.saveMode || 1);
                },
                isDefaultPrevented: function () {
                    return Boolean(saveState.prevented);
                },
                preventDefault: function () {
                    if (!syncPhase) {
                        throw new Error(
                            "preventDefault must be called synchronously"
                        );
                    }
                    saveState.prevented = true;
                },
                preventDefaultOnError: function () {
                    preventOnError = true;
                },
                disableAsyncTimeout: function () {
                    if (!syncPhase) {
                        throw new Error(
                            "disableAsyncTimeout must be called before awaiting"
                        );
                    }
                    timeoutDisabled = true;
                },
                _finishSyncPhase: function () {
                    syncPhase = false;
                },
                _shouldPreventOnError: function () {
                    return preventOnError;
                },
                _isTimeoutDisabled: function () {
                    return timeoutDisabled;
                }
            };
        }
        if (event === "postsave") {
            return {
                getEntityReference: function () {
                    return payload.entityReference || formEntity.getEntityReference();
                },
                getIsSaveSuccess: function () {
                    return Boolean(payload.isSaveSuccess);
                },
                getSaveErrorInfo: function () {
                    return payload.saveErrorInfo || null;
                }
            };
        }
        if (event === "onload" || event === "dataonload") {
            return {
                getDataLoadState: function () {
                    return Number(payload.dataLoadState || 1);
                }
            };
        }
        if (event === "onlookuptagclick") {
            return {
                getTagValue: function () {
                    return payload.tagValue || null;
                }
            };
        }
        if ([
            "onprocessstatuschange",
            "onpreprocessstatuschange",
            "onstagechange",
            "onprestagechange",
            "onstageselected"
        ].includes(event)) {
            const args = {
                getDirection: function () {
                    return payload.direction || null;
                },
                getStage: function () {
                    return createProcessStage(
                        stageDefinitionById(payload.stageId)
                    );
                }
            };
            if (
                event === "onprestagechange" ||
                event === "onpreprocessstatuschange"
            ) {
                args.preventDefault = function () {
                    saveState.prevented = true;
                };
                args.isDefaultPrevented = function () {
                    return Boolean(saveState.prevented);
                };
            }
            return args;
        }
        return null;
    }

    function createExecutionContext(
        eventName,
        controlName,
        payload,
        depth,
        sharedVariables,
        saveState
    ) {
        const subject = eventSubject(eventName, controlName, payload);
        const eventArgs = createEventArguments(
            eventName,
            payload,
            saveState
        );
        let active = true;
        function ensureActive() {
            if (!active) {
                throw new Error(
                    "This execution context is no longer valid because " +
                    "its event handler has completed"
                );
            }
        }
        return {
            getFormContext: function () {
                ensureActive();
                return subject.formContext;
            },
            getEventSource: function () {
                ensureActive();
                return subject.eventSource;
            },
            getEventArgs: function () {
                ensureActive();
                return eventArgs;
            },
            getContext: function () {
                ensureActive();
                return global.Xrm.Utility.getGlobalContext();
            },
            getDepth: function () {
                ensureActive();
                return depth;
            },
            getSharedVariable: function (key) {
                ensureActive();
                return sharedVariables[key];
            },
            setSharedVariable: function (key, value) {
                ensureActive();
                sharedVariables[key] = value;
            },
            _eventArgs: eventArgs,
            _deactivate: function () {
                active = false;
            }
        };
    }

    function resolveFunction(functionName) {
        const parts = String(functionName || "").split(".").filter(Boolean);
        let owner = global;
        for (let index = 0; index < parts.length - 1; index += 1) {
            owner = owner && owner[parts[index]];
        }
        const name = parts[parts.length - 1];
        const handler = owner && owner[name];
        if (typeof handler !== "function") {
            throw new Error(
                "Client script function was not found: " + functionName
            );
        }
        return { owner: owner, handler: handler };
    }

    function promiseWithTimeout(promise, milliseconds) {
        return new Promise(function (resolve, reject) {
            const timer = global.setTimeout(function () {
                reject(new Error(
                    "Client event handler exceeded " +
                    milliseconds + "ms"
                ));
            }, milliseconds);
            Promise.resolve(promise).then(
                function (value) {
                    global.clearTimeout(timer);
                    resolve(value);
                },
                function (error) {
                    global.clearTimeout(timer);
                    reject(error);
                }
            );
        });
    }

    function handlerMatches(handler, eventName, controlName) {
        if (!handler || handler.enabled === false) {
            return false;
        }
        if (normalizeEventName(handler.event) !== eventName) {
            return false;
        }
        const expected = handler.control || null;
        return expected === (controlName || null);
    }

    function dynamicKeys(eventName, controlName, payload) {
        const keys = [controlName || "__form__"];
        if (
            eventName === "gridonchange" &&
            payload.rowId &&
            payload.attributeName
        ) {
            keys.push(
                controlName + ":" + payload.rowId + ":" +
                payload.attributeName
            );
        }
        return keys;
    }

    global.executeJsEvent = async function (
        eventName,
        controlName,
        eventPayload
    ) {
        const event = normalizeEventName(eventName);
        const payload = eventPayload || {};
        const configured = (global.verseOffState.eventHandlers || [])
            .filter(function (handler) {
                return handlerMatches(handler, event, controlName);
            })
            .sort(function (left, right) {
                return Number(left.order || 0) - Number(right.order || 0);
            });
        const dynamic = [];
        dynamicKeys(event, controlName, payload).forEach(function (key) {
            dynamicBucket(event, key, false).slice().forEach(
                function (handler) {
                    dynamic.push(handler);
                }
            );
        });
        const pipelineLength = configured.length + dynamic.length;
        const errors = [];
        const saveState = { prevented: false };
        const sharedVariables = Object.create(null);

        if (pipelineLength > 50) {
            errors.push({
                function: "<pipeline>",
                message: (
                    "Dataverse supports no more than 50 handlers per event; " +
                    pipelineLength + " were registered"
                )
            });
        }

        async function invoke(
            descriptor,
            handler,
            owner,
            passContext,
            parameters,
            depth
        ) {
            const executionContext = createExecutionContext(
                event,
                controlName,
                payload,
                depth,
                sharedVariables,
                saveState
            );
            const eventArgs = executionContext._eventArgs;
            let returned;
            try {
                const args = [];
                if (passContext) {
                    args.push(executionContext);
                }
                (parameters || []).forEach(function (parameter) {
                    args.push(parameter);
                });
                returned = handler.apply(owner, args);
                if (eventArgs && eventArgs._finishSyncPhase) {
                    eventArgs._finishSyncPhase();
                }
                if (returned && typeof returned.then === "function") {
                    if (!ASYNC_EVENTS.has(event)) {
                        returned.catch(function () {});
                        throw new Error(
                            event + " does not support Promise-returning handlers"
                        );
                    }
                    if (
                        eventArgs &&
                        eventArgs._isTimeoutDisabled &&
                        eventArgs._isTimeoutDisabled()
                    ) {
                        await returned;
                    } else {
                        await promiseWithTimeout(
                            returned,
                            ASYNC_HANDLER_TIMEOUT_MS
                        );
                    }
                }
            } catch (error) {
                errors.push({
                    function: descriptor,
                    message: String(
                        error && error.message ? error.message : error
                    ),
                    name: error && error.name ? error.name : "Error"
                });
                if (
                    eventArgs &&
                    eventArgs._shouldPreventOnError &&
                    eventArgs._shouldPreventOnError()
                ) {
                    saveState.prevented = true;
                }
            } finally {
                executionContext._deactivate();
            }
        }

        let depth = 0;
        for (const descriptor of configured.slice(0, 50)) {
            try {
                const resolved = resolveFunction(descriptor.function);
                await invoke(
                    descriptor.function,
                    resolved.handler,
                    resolved.owner,
                    Boolean(descriptor.pass_context),
                    descriptor.parameters || [],
                    depth
                );
            } catch (error) {
                errors.push({
                    function: descriptor.function || "<unnamed>",
                    message: String(
                        error && error.message ? error.message : error
                    ),
                    name: error && error.name ? error.name : "Error"
                });
            }
            depth += 1;
        }
        for (const handler of dynamic.slice(0, Math.max(0, 50 - depth))) {
            await invoke(
                handler.name || "<code-added handler>",
                handler,
                global,
                true,
                [],
                depth
            );
            depth += 1;
        }

        if ((event === "onsave" || event === "gridonsave") && errors.length) {
            saveState.prevented = true;
        }
        return {
            event: event,
            control: controlName || null,
            prevented: Boolean(saveState.prevented),
            errors: errors,
            handlerCount: Math.min(pipelineLength, 50)
        };
    };

    function gridParameterRows(controlName, selection) {
        const grid = gridState(controlName);
        const selected = new Set((grid.selectedIds || []).map(String));
        if (selection === "selected") {
            return (grid.rows || []).filter(function (row) {
                return selected.has(String(row.id));
            });
        }
        if (selection === "unselected") {
            return (grid.rows || []).filter(function (row) {
                return !selected.has(String(row.id));
            });
        }
        return (grid.rows || []).slice();
    }

    function rowReferences(rows, fallbackEntityName) {
        return rows.map(function (row) {
            return {
                id: row.id || "",
                entityType: row.entityName || fallbackEntityName || "",
                name: row.primaryName || ""
            };
        });
    }

    function crmRibbonParameter(value, commandContext) {
        const parameter = String(value || "");
        const controlName = commandContext.controlName || "";
        const grid = gridState(controlName);
        const selectedRows = gridParameterRows(controlName, "selected");
        const allRows = gridParameterRows(controlName, "all");
        const unselectedRows = gridParameterRows(
            controlName,
            "unselected"
        );
        const globalApiContext = globalContext();
        const mappings = {
            PrimaryControl: function () {
                return global.formContext;
            },
            SelectedControl: function () {
                if (!controlName) {
                    throw new Error(
                        "SelectedControl requires a grid controlName"
                    );
                }
                return formControl(controlName);
            },
            CommandProperties: function () {
                return commandContext.commandProperties || {};
            },
            PrimaryEntityTypeName: function () {
                return formEntity.getEntityName();
            },
            PrimaryEntityTypeCode: function () {
                return global.verseOffState.entity.objectTypeCode || null;
            },
            FirstPrimaryItemId: function () {
                return formEntity.getId();
            },
            PrimaryItemIds: function () {
                return formEntity.getId() ? [formEntity.getId()] : [];
            },
            SelectedControlSelectedItemCount: function () {
                return selectedRows.length;
            },
            SelectedControlSelectedItemIds: function () {
                return selectedRows.map(function (row) {
                    return row.id || "";
                });
            },
            SelectedControlSelectedItemReferences: function () {
                return rowReferences(selectedRows, grid.entityName);
            },
            SelectedControlAllItemCount: function () {
                return allRows.length;
            },
            SelectedControlAllItemIds: function () {
                return allRows.map(function (row) {
                    return row.id || "";
                });
            },
            SelectedControlAllItemReferences: function () {
                return rowReferences(allRows, grid.entityName);
            },
            SelectedControlUnselectedItemCount: function () {
                return unselectedRows.length;
            },
            SelectedControlUnselectedItemIds: function () {
                return unselectedRows.map(function (row) {
                    return row.id || "";
                });
            },
            SelectedControlUnselectedItemReferences: function () {
                return rowReferences(unselectedRows, grid.entityName);
            },
            SelectedEntityTypeName: function () {
                return (
                    (selectedRows[0] || {}).entityName ||
                    grid.entityName ||
                    ""
                );
            },
            SelectedEntityTypeCode: function () {
                return grid.objectTypeCode || null;
            },
            OrgName: function () {
                return globalApiContext.organizationSettings.uniqueName;
            },
            OrgLcid: function () {
                return globalApiContext.organizationSettings.languageId;
            },
            UserLcid: function () {
                return globalApiContext.userSettings.languageId;
            }
        };
        const resolver = mappings[parameter];
        if (!resolver) {
            throw unsupported(
                "Ribbon CrmParameter",
                "unknown value " + parameter
            );
        }
        return resolver();
    }

    function ribbonParameter(parameter, commandContext) {
        const type = String((parameter || {}).type || "");
        const value = (parameter || {}).value;
        if (type === "CrmParameter") {
            return crmRibbonParameter(value, commandContext);
        }
        if (type === "StringParameter") {
            return String(value === undefined ? "" : value);
        }
        if (type === "BoolParameter") {
            return String(value).toLowerCase() === "true";
        }
        if (type === "IntParameter") {
            const integer = Number.parseInt(value, 10);
            if (!Number.isFinite(integer)) {
                throw new TypeError(
                    "Ribbon IntParameter is invalid: " + value
                );
            }
            return integer;
        }
        if (
            type === "DecimalParameter" ||
            type === "DoubleParameter"
        ) {
            const number = Number(value);
            if (!Number.isFinite(number)) {
                throw new TypeError(
                    "Ribbon " + type + " is invalid: " + value
                );
            }
            return number;
        }
        throw unsupported(
            "Ribbon action parameter",
            "unsupported type " + type
        );
    }

    global.executeRibbonAction = async function (
        action,
        commandContext
    ) {
        const descriptor = action || {};
        const context = commandContext || {};
        if (descriptor.type !== "JavaScriptFunction") {
            return {
                executed: false,
                errors: [{
                    function: descriptor.function_name || "<ribbon>",
                    message: (
                        "Unsupported Ribbon action type " +
                        String(descriptor.type || "")
                    )
                }]
            };
        }
        try {
            const resolved = resolveFunction(descriptor.function_name);
            const args = (descriptor.children || []).map(function (
                parameter
            ) {
                return ribbonParameter(parameter, context);
            });
            const result = resolved.handler.apply(resolved.owner, args);
            if (result && typeof result.then === "function") {
                await promiseWithTimeout(
                    result,
                    ASYNC_HANDLER_TIMEOUT_MS
                );
            }
            return {
                executed: true,
                errors: []
            };
        } catch (error) {
            return {
                executed: false,
                errors: [{
                    function: descriptor.function_name || "<ribbon>",
                    message: String(
                        error && error.message ? error.message : error
                    ),
                    name: error && error.name ? error.name : "Error"
                }]
            };
        }
    };

    global.evaluateRibbonRule = async function (
        rule,
        commandContext
    ) {
        const descriptor = rule || {};
        try {
            const resolved = resolveFunction(descriptor.function_name);
            const args = (descriptor.children || []).map(function (
                parameter
            ) {
                return ribbonParameter(
                    parameter,
                    commandContext || {}
                );
            });
            let value = resolved.handler.apply(resolved.owner, args);
            if (value && typeof value.then === "function") {
                value = await promiseWithTimeout(
                    value,
                    ASYNC_HANDLER_TIMEOUT_MS
                );
            }
            return {
                value: Boolean(value),
                errors: []
            };
        } catch (error) {
            return {
                value: false,
                errors: [{
                    function: descriptor.function_name || "<custom rule>",
                    message: String(
                        error && error.message ? error.message : error
                    ),
                    name: error && error.name ? error.name : "Error"
                }]
            };
        }
    };

    global.updateStateFromPython = function (fieldName, value) {
        const item = ensureAttributeState(
            global.verseOffState.attributes,
            fieldName
        );
        item.value = value;
    };

    global.initializeVerseOffState = function (state) {
        const next = Object.assign(emptyState(), state || {});
        next.attributes = next.attributes || {};
        next.controls = next.controls || {};
        next.grids = next.grids || {};
        next.entity = Object.assign(emptyState().entity, next.entity || {});
        next.context = Object.assign(emptyState().context, next.context || {});
        next.eventHandlers = Array.isArray(next.eventHandlers)
            ? next.eventHandlers
            : [];
        Object.keys(next.attributes).forEach(function (name) {
            ensureAttributeState(next.attributes, name);
        });
        global.verseOffState = next;
        global.Xrm.Page = global.formContext;
        return true;
    };

    global.connectVerseOffBridge = function (bridge, runtimeId) {
        if (!bridge) {
            throw new Error("QWebChannel did not expose pyBridge");
        }
        global.pyBridge = bridge;
        if (
            bridge.operationCompleted &&
            typeof bridge.operationCompleted.connect === "function"
        ) {
            bridge.operationCompleted.connect(completeBridgeOperation);
        }
        bridge.runtimeReady(String(runtimeId || ""));
    };

    function parseBridgeResponse(apiName, responseText) {
        let response;
        try {
            response = JSON.parse(responseText);
        } catch (error) {
            throw new Error(
                apiName + " returned invalid JSON: " + error.message
            );
        }
        if (response && response.error) {
            throw new Error(response.error);
        }
        return response;
    }

    function bridgePromise(apiName, invoke) {
        return new Promise(function (resolve, reject) {
            try {
                const bridge = requireBridge(apiName);
                invoke(bridge, function (responseText) {
                    try {
                        resolve(parseBridgeResponse(apiName, responseText));
                    } catch (error) {
                        reject(error);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    function globalContext() {
        const context = global.verseOffState.context || {};
        const user = context.user || {};
        const organization = context.organization || {};
        const app = context.app || {};
        const client = context.client || {};
        const roleValues = (user.roles || []).map(function (role) {
            return {
                id: role.id || role.roleId || "",
                name: role.name || ""
            };
        });
        return {
            userSettings: {
                dateFormattingInfo: user.dateFormattingInfo || {},
                isGuidedHelpEnabled: false,
                isHighContrastEnabled: Boolean(user.isHighContrastEnabled),
                isRTL: Boolean(user.isRTL),
                languageId: Number(user.languageId || 1033),
                roles: makeCollection(
                    function () {
                        return roleValues;
                    },
                    function (role) {
                        return role.id;
                    }
                ),
                securityRolePrivileges: user.securityRolePrivileges || [],
                securityRoles: user.securityRoles || roleValues.map(
                    function (role) {
                        return role.id;
                    }
                ),
                transactionCurrencyId: user.transactionCurrencyId || "",
                transactionCurrency: user.transactionCurrency || null,
                userId: user.id || "",
                userName: user.name || "",
                getSecurityRolePrivilegesInfo: function () {
                    if (!user.securityRolePrivilegesInfo) {
                        return Promise.reject(unsupported(
                            "userSettings.getSecurityRolePrivilegesInfo",
                            "the effective privilege snapshot was not packaged"
                        ));
                    }
                    return Promise.resolve(
                        Object.assign(
                            {},
                            user.securityRolePrivilegesInfo
                        )
                    );
                },
                getTimeZoneOffsetMinutes: function () {
                    if (user.timeZoneOffsetMinutes !== undefined) {
                        return Number(user.timeZoneOffsetMinutes);
                    }
                    return new Date().getTimezoneOffset();
                }
            },
            organizationSettings: {
                attributes: organization.attributes || {},
                baseCurrencyId: organization.baseCurrencyId || "",
                baseCurrency: organization.baseCurrency || null,
                defaultCountryCode: organization.defaultCountryCode || "",
                isAutoSaveEnabled: Boolean(organization.isAutoSaveEnabled),
                isTrialOrganization: Boolean(
                    organization.isTrialOrganization
                ),
                organizationExpiryDate: (
                    organization.organizationExpiryDate || null
                ),
                languageId: Number(organization.languageId || 1033),
                organizationId: organization.id || "",
                uniqueName: organization.uniqueName || "",
                useSkypeProtocol: Boolean(
                    organization.useSkypeProtocol
                ),
                fullNameConventionCode: Number(
                    organization.fullNameConventionCode || 0
                )
            },
            client: {
                getClient: function () {
                    return client.client || "Web";
                },
                getClientState: function () {
                    return client.state || "Offline";
                },
                getFormFactor: function () {
                    return Number(client.formFactor || 1);
                },
                isOffline: function () {
                    return (client.state || "Offline") === "Offline";
                },
                isNetworkAvailable: function () {
                    return Boolean(client.networkAvailable);
                }
            },
            getAdvancedConfigSetting: function (setting) {
                const settings = context.advancedConfigSettings || {};
                return Object.prototype.hasOwnProperty.call(
                    settings,
                    setting
                ) ? settings[setting] : null;
            },
            getClientUrl: function () {
                return context.clientUrl || "";
            },
            getCurrentAppName: function () {
                return Promise.resolve(app.displayName || "");
            },
            getCurrentAppProperties: function () {
                return Promise.resolve({
                    appId: app.id || "",
                    displayName: app.displayName || "",
                    uniqueName: app.uniqueName || "",
                    url: app.url || "",
                    webResourceId: null,
                    webResourceName: null,
                    welcomePageId: null,
                    welcomePageName: null
                });
            },
            getCurrentAppUrl: function () {
                return app.url || "";
            },
            getVersion: function () {
                return context.version || "9.2.0.0";
            },
            getWebResourceUrl: function (webResourceName) {
                const urls = global.verseOffState.webResourceUrls || {};
                if (urls[webResourceName]) {
                    return urls[webResourceName];
                }
                return (
                    context.webResourceBaseUrl ||
                    "offline://verseoff/webresources/"
                ) + webResourceName;
            },
            isOnPremises: function () {
                return Boolean(context.isOnPremises);
            },
            prependOrgName: function (path) {
                const prefix = organization.uniqueName
                    ? "/" + organization.uniqueName
                    : "";
                return prefix + (
                    String(path || "").startsWith("/")
                        ? String(path || "")
                        : "/" + String(path || "")
                );
            },
            getQueryStringParameters: function () {
                return Object.assign(
                    {},
                    global.verseOffState.queryParameters || {}
                );
            }
        };
    }

    const localWebApi = {
        createRecord: function (entityLogicalName, data) {
            return bridgePromise("Xrm.WebApi.createRecord", function (
                bridge,
                callback
            ) {
                bridge.webApiCreateFromJS(
                    entityLogicalName,
                    JSON.stringify(data || {}),
                    callback
                );
            });
        },
        deleteRecord: function (entityLogicalName, id) {
            return bridgePromise("Xrm.WebApi.deleteRecord", function (
                bridge,
                callback
            ) {
                bridge.webApiDeleteFromJS(entityLogicalName, id, callback);
            });
        },
        retrieveRecord: function (entityLogicalName, id, options) {
            return bridgePromise("Xrm.WebApi.retrieveRecord", function (
                bridge,
                callback
            ) {
                bridge.webApiRetrieveFromJS(
                    entityLogicalName,
                    id,
                    options || "",
                    callback
                );
            });
        },
        retrieveMultipleRecords: function (
            entityLogicalName,
            options,
            maxPageSize
        ) {
            return bridgePromise(
                "Xrm.WebApi.retrieveMultipleRecords",
                function (bridge, callback) {
                    bridge.webApiRetrieveMultipleFromJS(
                        entityLogicalName,
                        options || "",
                        String(maxPageSize || ""),
                        callback
                    );
                }
            );
        },
        updateRecord: function (entityLogicalName, id, data) {
            return bridgePromise("Xrm.WebApi.updateRecord", function (
                bridge,
                callback
            ) {
                bridge.webApiUpdateFromJS(
                    entityLogicalName,
                    id,
                    JSON.stringify(data || {}),
                    callback
                );
            });
        },
        isAvailableOffline: function (entityLogicalName) {
            return Boolean(
                global.verseOffState.availableOfflineEntities &&
                global.verseOffState.availableOfflineEntities.includes(
                    entityLogicalName
                )
            );
        },
        execute: function () {
            return Promise.reject(unsupported("Xrm.WebApi.execute"));
        },
        executeMultiple: function () {
            return Promise.reject(unsupported("Xrm.WebApi.executeMultiple"));
        }
    };

    const onlineWebApi = {};
    Object.keys(localWebApi).forEach(function (methodName) {
        onlineWebApi[methodName] = function () {
            return Promise.reject(
                unsupported("Xrm.WebApi.online." + methodName)
            );
        };
    });

    global.Xrm = {
        Page: global.formContext,
        App: {
            addGlobalNotification: function (notification) {
                return bridgePromise(
                    "Xrm.App.addGlobalNotification",
                    function (bridge, callback) {
                        bridge.addGlobalNotificationFromJS(
                            JSON.stringify(notification || {}),
                            function (responseText) {
                                try {
                                    const response = parseBridgeResponse(
                                        "Xrm.App.addGlobalNotification",
                                        responseText
                                    );
                                    callback(JSON.stringify(response.id));
                                } catch (error) {
                                    callback(JSON.stringify({
                                        error: error.message
                                    }));
                                }
                            }
                        );
                    }
                );
            },
            clearGlobalNotification: function (uniqueId) {
                return bridgePromise(
                    "Xrm.App.clearGlobalNotification",
                    function (bridge, callback) {
                        bridge.clearGlobalNotificationFromJS(
                            uniqueId,
                            callback
                        );
                    }
                );
            }
        },
        Copilot: {
            isM365CopilotEnabled: function () {
                return false;
            },
            getCurrentAgent: function () {
                return undefined;
            },
            addActionHandler: function () {
                throw unsupported("Xrm.Copilot.addActionHandler");
            },
            addDefaultActionHandlers: function () {
                throw unsupported(
                    "Xrm.Copilot.addDefaultActionHandlers"
                );
            },
            removeActionHandler: function () {
                throw unsupported("Xrm.Copilot.removeActionHandler");
            },
            removeDefaultActionHandlers: function () {
                throw unsupported(
                    "Xrm.Copilot.removeDefaultActionHandlers"
                );
            },
            openM365CopilotPanel: function () {
                throw unsupported("Xrm.Copilot.openM365CopilotPanel");
            },
            sendPromptToM365Copilot: function () {
                return Promise.reject(
                    unsupported("Xrm.Copilot.sendPromptToM365Copilot")
                );
            },
            updateContext: function () {
                throw unsupported("Xrm.Copilot.updateContext");
            },
            executeEvent: function () {
                return Promise.reject(
                    unsupported("Xrm.Copilot.executeEvent")
                );
            },
            executePrompt: function () {
                return Promise.reject(
                    unsupported("Xrm.Copilot.executePrompt")
                );
            }
        },
        Device: {
            captureAudio: function () {
                return Promise.reject(
                    unsupported("Xrm.Device.captureAudio")
                );
            },
            captureImage: function () {
                return Promise.reject(
                    unsupported("Xrm.Device.captureImage")
                );
            },
            captureVideo: function () {
                return Promise.reject(
                    unsupported("Xrm.Device.captureVideo")
                );
            },
            getBarcodeValue: function () {
                return Promise.reject(
                    unsupported("Xrm.Device.getBarcodeValue")
                );
            },
            getCurrentPosition: function () {
                return Promise.reject(
                    unsupported("Xrm.Device.getCurrentPosition")
                );
            },
            pickFile: function (options) {
                return bridgePromise(
                    "Xrm.Device.pickFile",
                    function (bridge, callback) {
                        bridge.pickFileFromJS(
                            JSON.stringify(options || {}),
                            callback
                        );
                    }
                );
            }
        },
        Encoding: {
            htmlEncode: function (value) {
                const element = global.document
                    ? global.document.createElement("div")
                    : null;
                if (!element) {
                    return String(value)
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/"/g, "&quot;")
                        .replace(/'/g, "&#39;");
                }
                element.textContent = String(value);
                return element.innerHTML;
            },
            htmlDecode: function (value) {
                if (!global.document) {
                    return String(value)
                        .replace(/&lt;/g, "<")
                        .replace(/&gt;/g, ">")
                        .replace(/&quot;/g, '"')
                        .replace(/&#39;/g, "'")
                        .replace(/&amp;/g, "&");
                }
                const element = global.document.createElement("textarea");
                element.innerHTML = String(value);
                return element.value;
            },
            htmlAttributeEncode: function (value) {
                return this.htmlEncode(value)
                    .replace(/`/g, "&#96;")
                    .replace(/=/g, "&#61;");
            },
            xmlEncode: function (value) {
                return String(value)
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;");
            },
            xmlAttributeEncode: function (value) {
                return this.xmlEncode(value)
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&apos;");
            }
        },
        Navigation: {
            openAlertDialog: function (strings) {
                try {
                    requireBridge("Xrm.Navigation.openAlertDialog")
                        .showAlertFromJS((strings || {}).text || "");
                    return Promise.resolve();
                } catch (error) {
                    return Promise.reject(error);
                }
            },
            openConfirmDialog: function (strings) {
                return new Promise(function (resolve, reject) {
                    try {
                        requireBridge("Xrm.Navigation.openConfirmDialog")
                            .showConfirmFromJS(
                                (strings || {}).text || "",
                                function (confirmed) {
                                    resolve({
                                        confirmed: Boolean(confirmed)
                                    });
                                }
                            );
                    } catch (error) {
                        reject(error);
                    }
                });
            },
            openErrorDialog: function (options) {
                try {
                    requireBridge("Xrm.Navigation.openErrorDialog")
                        .showErrorFromJS((options || {}).message || "");
                    return Promise.resolve();
                } catch (error) {
                    return Promise.reject(error);
                }
            },
            openFile: function (file) {
                requireBridge("Xrm.Navigation.openFile").openFileFromJS(
                    (file || {}).fileName || "",
                    (file || {}).fileContent || ""
                );
            },
            openForm: function (options, formParameters) {
                return bridgePromise(
                    "Xrm.Navigation.openForm",
                    function (bridge, callback) {
                        bridge.openFormFromJS(
                            JSON.stringify(options || {}),
                            JSON.stringify(formParameters || {}),
                            callback
                        );
                    }
                );
            },
            openUrl: function (url) {
                requireBridge("Xrm.Navigation.openUrl").openUrlFromJS(url);
            },
            openWebResource: function (name, options, data) {
                requireBridge("Xrm.Navigation.openWebResource")
                    .openWebResourceFromJS(
                        name,
                        JSON.stringify(options || {}),
                        String(data || "")
                    );
            },
            navigateTo: function (pageInput, navigationOptions) {
                return bridgePromise(
                    "Xrm.Navigation.navigateTo",
                    function (bridge, callback) {
                        bridge.navigateToFromJS(
                            JSON.stringify(pageInput || {}),
                            JSON.stringify(navigationOptions || {}),
                            callback
                        );
                    }
                );
            }
        },
        Panel: {
            loadPanel: function () {
                throw unsupported(
                    "Xrm.Panel.loadPanel",
                    "the preview side-panel host is not available offline"
                );
            }
        },
        Utility: {
            getGlobalContext: globalContext,
            getEntityMetadata: function (entityName, attributes) {
                return bridgePromise(
                    "Xrm.Utility.getEntityMetadata",
                    function (bridge, callback) {
                        bridge.getEntityMetadataFromJS(
                            entityName,
                            JSON.stringify(attributes || []),
                            callback
                        );
                    }
                );
            },
            getEntityMainFormDescriptor: function (
                entityName,
                formId
            ) {
                return bridgePromise(
                    "Xrm.Utility.getEntityMainFormDescriptor",
                    function (bridge, callback) {
                        bridge.getEntityMainFormDescriptorFromJS(
                            entityName,
                            formId || "",
                            callback
                        );
                    }
                );
            },
            getLearningPathAttributeName: function () {
                return "OptOutLearningPath";
            },
            getPageContext: function () {
                return {
                    input: Object.assign({
                        pageType: "entityrecord",
                        entityName: formEntity.getEntityName(),
                        entityId: formEntity.getId()
                    }, global.verseOffState.queryParameters || {})
                };
            },
            getResourceString: function (webResourceName, key) {
                const resources =
                    global.verseOffState.localizedResources || {};
                const strings = resources[webResourceName];
                if (!strings) {
                    throw new Error(
                        "RESX web resource was not packaged: " +
                        webResourceName
                    );
                }
                if (!Object.prototype.hasOwnProperty.call(strings, key)) {
                    throw new Error(
                        "RESX key was not found: " + key
                    );
                }
                return strings[key];
            },
            showProgressIndicator: function (message) {
                requireBridge("Xrm.Utility.showProgressIndicator")
                    .showProgressFromJS(message || "");
            },
            closeProgressIndicator: function () {
                requireBridge("Xrm.Utility.closeProgressIndicator")
                    .closeProgressFromJS();
            },
            refreshParentGrid: function (lookupOptions) {
                requireBridge("Xrm.Utility.refreshParentGrid")
                    .refreshParentGridFromJS(
                        JSON.stringify(lookupOptions || {})
                    );
            },
            lookupObjects: function (options) {
                return bridgePromise(
                    "Xrm.Utility.lookupObjects",
                    function (bridge, callback) {
                        bridge.lookupObjectsFromJS(
                            ((options || {}).entityTypes || []).join(","),
                            callback
                        );
                    }
                );
            },
            invokeProcessAction: function () {
                return Promise.reject(
                    unsupported("Xrm.Utility.invokeProcessAction")
                );
            },
            getAllowedStatusTransitions: function () {
                return Promise.reject(
                    unsupported("Xrm.Utility.getAllowedStatusTransitions")
                );
            }
        },
        WebApi: Object.assign({}, localWebApi, {
            offline: localWebApi,
            online: onlineWebApi
        })
    };
    global.GetGlobalContext = globalContext;
})(typeof window !== "undefined" ? window : globalThis);
