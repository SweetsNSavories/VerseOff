// verseoff_bridge.js
// Pure JavaScript Mock of the Dataverse Client API

window.verseOffState = {
    attributes: {},
    controls: {}
};

// The central QWebChannel bridge object (injected dynamically by Qt)
window.pyBridge = null;

window.formContext = {
    data: {
        entity: {
            attributes: {
                get: function(name) {
                    if (typeof name !== 'string') {
                        // Return collection mock
                        return {
                            forEach: function(cb) {
                                Object.keys(window.verseOffState.attributes).forEach(k => {
                                    cb(window.formContext.getAttribute(k), 0);
                                });
                            }
                        };
                    }
                    if (!window.verseOffState.attributes[name]) {
                        window.verseOffState.attributes[name] = { value: null, submitMode: "dirty", requiredLevel: "none" };
                    }
                    return {
                        getValue: function() { return window.verseOffState.attributes[name].value; },
                        setValue: function(val) { 
                            window.verseOffState.attributes[name].value = val;
                            if (window.pyBridge) {
                                window.pyBridge.updateFieldFromJS(name, String(val));
                            }
                        },
                        getSubmitMode: function() { return window.verseOffState.attributes[name].submitMode; },
                        setSubmitMode: function(mode) { window.verseOffState.attributes[name].submitMode = mode; },
                        getRequiredLevel: function() { return window.verseOffState.attributes[name].requiredLevel; },
                        setRequiredLevel: function(level) { window.verseOffState.attributes[name].requiredLevel = level; },
                        getName: function() { return name; }
                    };
                }
            },
            save: function() {
                if (window.pyBridge) window.pyBridge.triggerSaveFromJS();
            }
        }
    },
    ui: {
        controls: {
            get: function(name) {
                if (typeof name !== 'string') return { forEach: function() {} };
                if (!window.verseOffState.controls[name]) {
                    window.verseOffState.controls[name] = { visible: true, disabled: false };
                }
                return {
                    getVisible: function() { return window.verseOffState.controls[name].visible; },
                    setVisible: function(val) { 
                        window.verseOffState.controls[name].visible = val;
                        if (window.pyBridge) window.pyBridge.setControlVisibleFromJS(name, val);
                    },
                    getDisabled: function() { return window.verseOffState.controls[name].disabled; },
                    setDisabled: function(val) { 
                        window.verseOffState.controls[name].disabled = val;
                        if (window.pyBridge) window.pyBridge.setControlDisabledFromJS(name, val);
                    },
                    getName: function() { return name; }
                };
            }
        },
        tabs: {
            get: function(name) {
                return {
                    sections: {
                        get: function(secName) {
                            return {
                                setVisible: function(val) {}
                            };
                        }
                    },
                    setVisible: function(val) {}
                };
            }
        },
        setFormNotification: function(msg, level, id) {
            if (window.pyBridge) window.pyBridge.setFormNotificationFromJS(msg, level, id);
        },
        clearFormNotification: function(id) {
            if (window.pyBridge) window.pyBridge.clearFormNotificationFromJS(id);
        }
    },
    getAttribute: function(name) { return this.data.entity.attributes.get(name); },
    getControl: function(name) { return this.ui.controls.get(name); }
};

window.Xrm = {
    Page: window.formContext, // Legacy bridge
    Navigation: {
        openAlertDialog: function(strings, options) {
            if (window.pyBridge) window.pyBridge.showAlertFromJS(strings.text);
            return Promise.resolve();
        },
        openConfirmDialog: function(confirmStrings, confirmOptions) {
            return new Promise(function(resolve, reject) {
                if (window.pyBridge) {
                    window.pyBridge.showConfirmFromJS(confirmStrings.text, function(result) {
                        resolve({ confirmed: result });
                    });
                } else {
                    resolve({ confirmed: true }); // Fallback
                }
            });
        },
        openErrorDialog: function(errorOptions) {
            return new Promise(function(resolve, reject) {
                if (window.pyBridge) {
                    window.pyBridge.showErrorFromJS(errorOptions.message || "An unknown error occurred.");
                }
                resolve({});
            });
        },
        openFile: function(file, openFileOptions) {
            if (window.pyBridge && file && file.fileName && file.fileContent) {
                window.pyBridge.openFileFromJS(file.fileName, file.fileContent);
            }
        },
        openForm: function(entityFormOptions, formParameters) {
            return new Promise(function(resolve, reject) {
                if (window.pyBridge && entityFormOptions && entityFormOptions.entityName) {
                    var recordId = entityFormOptions.entityId || "";
                    window.pyBridge.openFormFromJS(entityFormOptions.entityName, recordId);
                }
                resolve({});
            });
        },
        openUrl: function(url, openUrlOptions) {
            if (window.pyBridge && url) {
                window.pyBridge.openUrlFromJS(url);
            }
        },
        openWebResource: function(webResourceName, windowOptions, data) {
            if (window.pyBridge && webResourceName) {
                window.pyBridge.openWebResourceFromJS(webResourceName, data ? String(data) : "");
            }
        },
        navigateTo: function(pageInput, navigationOptions) {
            if (window.pyBridge) {
                var pageType = pageInput.pageType || "entityrecord";
                var entityName = pageInput.entityName || "unknown";
                window.pyBridge.navigateToFromJS(pageType, entityName);
            }
            return Promise.resolve();
        }
    },
    Panel: {
        loadPanel: function(url, title) {
            if (window.pyBridge) {
                window.pyBridge.loadPanelFromJS(url, title || "");
            }
        }
    },
    Utility: {
        closeProgressIndicator: function() {
            if (window.pyBridge) window.pyBridge.closeProgressFromJS();
        },
        getAllowedStatusTransitions: function(entityName, stateCode) {
            return Promise.resolve([]);
        },
        getEntityMainFormDescriptor: function(entityName, formId) {
            return new Promise(function(resolve, reject) {
                if (window.pyBridge) {
                    window.pyBridge.getEntityMainFormDescriptorFromJS(entityName, formId || "", function(descriptorJson) {
                        try {
                            resolve(JSON.parse(descriptorJson));
                        } catch (e) {
                            resolve({});
                        }
                    });
                } else {
                    resolve({});
                }
            });
        },
        getEntityMetadata: function(entityName, attributes) {
            return new Promise(function(resolve, reject) {
                if (window.pyBridge) {
                    window.pyBridge.getEntityMetadataFromJS(entityName, function(metadataJson) {
                        try {
                            resolve(JSON.parse(metadataJson));
                        } catch (e) {
                            resolve({});
                        }
                    });
                } else {
                    resolve({});
                }
            });
        },
        getGlobalContext: function() {
            return {
                userSettings: {
                    dateFormattingInfo: {},
                    defaultDashboardId: "{00000000-0000-0000-0000-000000000000}",
                    isGuidedHelpEnabled: false,
                    isHighContrastEnabled: false,
                    isRTL: false,
                    languageId: 1033, // English
                    roles: { get: function() { return []; }, forEach: function(cb) {} },
                    securityRolePrivileges: [],
                    securityRoles: [],
                    transactionCurrencyId: "{00000000-0000-0000-0000-000000000000}",
                    userId: "{00000000-0000-0000-0000-000000000000}",
                    userName: "Offline User",
                    getTimeZoneOffsetMinutes: function() { return new Date().getTimezoneOffset(); }
                },
                organizationSettings: {
                    attributes: {},
                    baseCurrencyId: "{00000000-0000-0000-0000-000000000000}",
                    baseCurrency: { id: "{00000000-0000-0000-0000-000000000000}", name: "US Dollar" }, // Deprecated but often checked
                    defaultCountryCode: "US",
                    isAutoSaveEnabled: false, // In offline mode, maybe we disable autosave for safety
                    languageId: 1033, // English
                    organizationId: "{11111111-1111-1111-1111-111111111111}",
                    uniqueName: "VerseOffOfflineOrg",
                    useSkypeProtocol: false
                },
                client: {
                    getClient: function() { return "Mobile"; },
                    getClientState: function() { return "Offline"; },
                    getFormFactor: function() { return 1; }, // 1 = Desktop
                    isOffline: function() { return true; }
                },
                getAdvancedConfigSetting: function(setting) {
                    // Safely return null for obscure advanced server settings offline
                    console.log("VerseOff: getAdvancedConfigSetting requested for " + setting);
                    return null;
                },
                getClientUrl: function() {
                    return "offline://verseoff";
                },
                getCurrentAppName: function() {
                    return Promise.resolve("VerseOff");
                },
                getCurrentAppProperties: function() {
                    return Promise.resolve({
                        appId: "{22222222-2222-2222-2222-222222222222}",
                        displayName: "VerseOff",
                        uniqueName: "verseoff",
                        url: "offline://verseoff",
                        webResourceId: null,
                        webResourceName: null,
                        welcomePageId: null,
                        welcomePageName: null
                    });
                },
                getCurrentAppUrl: function() {
                    return "offline://verseoff/main.aspx?appid={22222222-2222-2222-2222-222222222222}";
                },
                getVersion: function() {
                    return "9.2.0.0"; // Emulate standard v9.2 unified interface
                },
                getWebResourceUrl: function(webResourceName) {
                    return "offline://verseoff/webresources/" + webResourceName;
                },
                isOnPremises: function() {
                    return false;
                },
                prependOrgName: function(sPath) {
                    var orgName = "VerseOffOfflineOrg";
                    if (sPath && sPath.charAt(0) !== "/") {
                        sPath = "/" + sPath;
                    }
                    return "/" + orgName + sPath;
                }
            };
        },
        getLearningPathAttributeName: function() {
            return "OptOutLearningPath";
        },
        getPageContext: function() {
            var entityName = "offline_entity";
            var recordId = "";
            if (window.formContext && window.formContext.data && window.formContext.data.entity) {
                entityName = window.formContext.data.entity.getEntityName() || entityName;
                recordId = window.formContext.data.entity.getId() || recordId;
            }
            return { 
                input: { 
                    pageType: "entityrecord", 
                    entityName: entityName,
                    entityId: recordId
                } 
            };
        },
        getResourceString: function(webResourceName, key) {
            return key;
        },
        invokeProcessAction: function(name, parameters) {
            // Server actions are silently stubbed offline to prevent crashes
            console.warn("VerseOff: invokeProcessAction '" + name + "' bypassed in offline mode.");
            return Promise.resolve({ response: "" });
        },
        lookupObjects: function(lookupOptions) {
            return new Promise(function(resolve, reject) {
                if (window.pyBridge) {
                    var entityTypes = lookupOptions.entityTypes ? lookupOptions.entityTypes.join(",") : "";
                    window.pyBridge.lookupObjectsFromJS(entityTypes, function(resultJson) {
                        try {
                            resolve(JSON.parse(resultJson));
                        } catch (e) {
                            resolve([]);
                        }
                    });
                } else {
                    resolve([]);
                }
            });
        },
        refreshParentGrid: function(lookupOptions) {
            if (window.pyBridge) {
                var optionsStr = lookupOptions ? JSON.stringify(lookupOptions) : "{}";
                window.pyBridge.refreshParentGridFromJS(optionsStr);
            }
        },
        showProgressIndicator: function(message) {
            if (window.pyBridge) window.pyBridge.showProgressFromJS(message);
        }
    },
    WebApi: (function() {
        var api = {
            createRecord: function(entityLogicalName, data) {
                return new Promise(function(resolve, reject) {
                    if (window.pyBridge) {
                        window.pyBridge.webApiCreateFromJS(entityLogicalName, JSON.stringify(data), function(res) {
                            var response = JSON.parse(res);
                            if (response.error) reject({ message: response.error });
                            else resolve(response);
                        });
                    } else reject({ message: "Offline bridge missing" });
                });
            },
            deleteRecord: function(entityLogicalName, id) {
                return new Promise(function(resolve, reject) {
                    if (window.pyBridge) {
                        window.pyBridge.webApiDeleteFromJS(entityLogicalName, id, function(res) {
                            var response = JSON.parse(res);
                            if (response.error) reject({ message: response.error });
                            else resolve(response);
                        });
                    } else reject({ message: "Offline bridge missing" });
                });
            },
            retrieveRecord: function(entityLogicalName, id, options) {
                return new Promise(function(resolve, reject) {
                    if (window.pyBridge) {
                        window.pyBridge.webApiRetrieveFromJS(entityLogicalName, id, options || "", function(res) {
                            var response = JSON.parse(res);
                            if (response.error) reject({ message: response.error });
                            else resolve(response);
                        });
                    } else reject({ message: "Offline bridge missing" });
                });
            },
            retrieveMultipleRecords: function(entityLogicalName, options, maxPageSize) {
                return new Promise(function(resolve, reject) {
                    if (window.pyBridge) {
                        window.pyBridge.webApiRetrieveMultipleFromJS(entityLogicalName, options || "", function(res) {
                            var response = JSON.parse(res);
                            if (response.error) reject({ message: response.error });
                            else resolve(response);
                        });
                    } else reject({ message: "Offline bridge missing" });
                });
            },
            updateRecord: function(entityLogicalName, id, data) {
                return new Promise(function(resolve, reject) {
                    if (window.pyBridge) {
                        window.pyBridge.webApiUpdateFromJS(entityLogicalName, id, JSON.stringify(data), function(res) {
                            var response = JSON.parse(res);
                            if (response.error) reject({ message: response.error });
                            else resolve(response);
                        });
                    } else reject({ message: "Offline bridge missing" });
                });
            },
            isAvailableOffline: function(entityLogicalName) {
                // In VerseOff, everything in the local cache is "available offline"
                return true;
            },
            execute: function(request) {
                // Server-side custom actions/functions cannot run offline
                console.warn("VerseOff: Xrm.WebApi.execute bypassed in offline mode. Action: " + (request.getMetadata ? request.getMetadata().operationName : "unknown"));
                return Promise.resolve({
                    ok: true,
                    status: 200,
                    statusText: "OK",
                    headers: { get: function() { return null; } },
                    json: function() { return Promise.resolve({}); },
                    text: function() { return Promise.resolve(""); }
                });
            },
            executeMultiple: function(requests) {
                // Batch execute - stub each request individually
                console.warn("VerseOff: Xrm.WebApi.executeMultiple bypassed in offline mode. Requests: " + (requests ? requests.length : 0));
                var responses = (requests || []).map(function() {
                    return {
                        ok: true,
                        status: 200,
                        statusText: "OK",
                        headers: { get: function() { return null; } },
                        json: function() { return Promise.resolve({}); },
                        text: function() { return Promise.resolve(""); }
                    };
                });
                return Promise.resolve(responses);
            }
        };
        api.offline = api;
        api.online = api;
        return api;
    })()
};

// Method called by Python to update JS state (e.g. when user types in UI)
window.updateStateFromPython = function(fieldName, value) {
    if (!window.verseOffState.attributes[fieldName]) {
        window.verseOffState.attributes[fieldName] = {};
    }
    window.verseOffState.attributes[fieldName].value = value;
};
