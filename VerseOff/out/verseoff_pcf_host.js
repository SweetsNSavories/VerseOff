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
            instance.updateView(context);
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
            instance.updateView(context);
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
