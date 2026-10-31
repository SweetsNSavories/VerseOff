var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var KnowledgeDraftAssist;
(function (KnowledgeDraftAssist) {
    var CommonParameters;
    (function (CommonParameters) {
        CommonParameters["Error"] = "Error";
        CommonParameters["Info"] = "Info";
        CommonParameters["Marker"] = "Marker";
        CommonParameters["Warning"] = "Warning";
        CommonParameters["Source"] = "Source";
        CommonParameters["Parameters"] = "Parameters";
    })(CommonParameters = KnowledgeDraftAssist.CommonParameters || (KnowledgeDraftAssist.CommonParameters = {}));
    var Telemetry = /** @class */ (function () {
        function Telemetry() {
        }
        /**
         * Log an error event
         * @param source Telemetry source
         * @param error Telemetry error
         * @param params Telemetry params
         */
        Telemetry.logError = function (source, error, params) {
            var _a;
            var errorParam;
            if (error instanceof Error) {
                var message = error.message, stack = error.stack;
                errorParam = { message: message, stack: stack };
            }
            else if (typeof error === "string") {
                errorParam = error;
            }
            else {
                errorParam = __assign({}, error);
            }
            var errorMarker = (_a = {},
                _a[CommonParameters.Source] = source,
                _a[CommonParameters.Error] = errorParam,
                _a[CommonParameters.Parameters] = params,
                _a);
            Telemetry.logInternal(CommonParameters.Error, errorMarker)();
        };
        /**
         * Log a warning event
         * @param source Telemetry source
         * @param warning Telemetry warning
         * @param params Telemetry params
         */
        Telemetry.logWarning = function (source, warning, params) {
            var _a;
            var warningParam;
            if (typeof warning === "string") {
                warningParam = warning;
            }
            else {
                warningParam = __assign({}, warning);
            }
            var warningMarker = (_a = {},
                _a[CommonParameters.Source] = source,
                _a[CommonParameters.Warning] = warningParam,
                _a[CommonParameters.Parameters] = params,
                _a);
            Telemetry.logInternal(CommonParameters.Warning, warningMarker)();
        };
        /**
         * Log an informational event
         * @param source Telemetry source
         * @param info Telemetry informational
         * @param params Telemetry params
         */
        Telemetry.logInfo = function (source, info, params) {
            var _a;
            var infoParam;
            if (typeof info === "string") {
                infoParam = info;
            }
            else {
                infoParam = __assign({}, info);
            }
            var infoMarker = (_a = {},
                _a[CommonParameters.Source] = source,
                _a[CommonParameters.Info] = infoParam,
                _a[CommonParameters.Parameters] = params,
                _a);
            Telemetry.logInternal(CommonParameters.Info, infoMarker)();
        };
        /**
         * Logs duration marker
         * @param source
         * @param params
         */
        Telemetry.measureStartStop = function (source, params) {
            var _a;
            var marker = (_a = {},
                _a[CommonParameters.Source] = source,
                _a[CommonParameters.Parameters] = params,
                _a);
            return Telemetry.logInternal(CommonParameters.Marker, marker);
        };
        /**
         * Internal method to log the event to UCI
         * @param name Event name
         * @param parameters Event params
         */
        Telemetry.logInternal = function (name, parameters) {
            var fullName = "".concat(this.SessionName, ".").concat(name);
            // Safety in case the UCI context doesn't contain telemetry
            // infrastructure.
            var xrm = window.Xrm || parent.Xrm;
            if (!xrm || !xrm.Internal || !xrm.Internal.createPerformanceStopwatch) {
                return function () { };
            }
            var stop = xrm.Internal.createPerformanceStopwatch(fullName, parameters);
            if (!xrm || !xrm.Reporting) {
                return function () { };
            }
            var reporting = xrm.Reporting;
            var params = parameters;
            var reportingParams = Object.keys(params).map(function (key) {
                return { name: key, value: params[key] };
            });
            //Markers will be logged at call back when the call finishes
            if (!fullName.includes(CommonParameters.Marker)) {
                if (name == CommonParameters.Error)
                    reporting.reportFailure(fullName, params === null || params === void 0 ? void 0 : params.Error, "", reportingParams);
                else
                    reporting.reportSuccess(fullName, reportingParams);
            }
            return function (endParameters) {
                stop(endParameters);
                var unionedParams = __assign(__assign({}, parameters), endParameters);
                var endReportingParams = Object.keys(unionedParams).map(function (key) {
                    return { name: key, value: unionedParams[key] };
                });
                reporting.reportSuccess(fullName, endReportingParams);
            };
        };
        Telemetry.SessionName = "Client.KnowledgeDraft";
        return Telemetry;
    }());
    KnowledgeDraftAssist.Telemetry = Telemetry;
})(KnowledgeDraftAssist || (KnowledgeDraftAssist = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference lib="es2017.object" />
/// <reference lib="es2018.promise" />
/// <reference path="Telemetry.ts" />
var KnowledgeDraftAssist;
(function (KnowledgeDraftAssist) {
    var Constants = /** @class */ (function () {
        function Constants() {
        }
        /**
         * button for ok
         */
        Constants.OK_ID = "ok_id";
        /**
         * button for insert content
         */
        Constants.CONTENT_ID = "InsertContent";
        /**
         * button for insert url
         */
        Constants.URL_ID = "InsertUrl";
        /**
         * Field on the dialog to get the selected Template
         */
        Constants.KnowledgeArticleLogicalName = "knowledgearticle";
        /**
         * Entity logical Name for Knowledge Article
         */
        Constants.EmailLogicalName = "email";
        /**
         * Event Name for telemetry
         */
        Constants.FeatureName = "Insert KA in email";
        /**
         * Event Name for telemetry
         */
        Constants.releaseWave = "October 2020";
        /**
         * Event Name for telemetry
         */
        Constants.SourceType = "EmailDialogWebresource";
        /*
         * Control ID for email content editor.
         */
        Constants.EmailEditorControlId = "description";
        /*
         * Control ID for KbWrapper Control.
         */
        Constants.SelectKaControl = "selectKA_id";
        /*
         * Control ID for footer label Control.
         */
        Constants.FooterLabelId = "lbl_selectCount";
        /*
         * Dialog XML ID.
         */
        Constants.DialogXmlId = "CopilotAgentDraftKA";
        /*
         * Is Multiple Selection Enabled Param.
         */
        Constants.isMultipleSelectionParam = "param_isMultipleSelectionEnabled";
        /*
         * Resource key for success message.
         */
        Constants.SuccessMessage = "KnowledgeArticle_DialogInsert_SuccessMessage";
        /*
         * Resource key for success message.
         */
        Constants.FailureMessage = "KnowledgeArticle_DialogInsert_FailureMessage";
        /*
         * Resource key for confirm button label on confirmation dialog.
         */
        Constants.ProceedWithoutCopyConfirmButtonLabelResx = "InsertArticle.ProceedWithoutCopyConfirmButtonLabel";
        /*
         * Resource key for cancel button label on confirmation dialog.
         */
        Constants.ProceedWithoutCopyCancelButtonLabelResx = "InsertArticle.ProceedWithoutCopyCancelButtonLabel";
        /*
         * Resource key for confirmation dialog message.
         */
        Constants.ProceedWithoutCopyDialogMessageResx = "InsertArticle.ProceedWithoutCopyDialogMessage";
        /*
         * Type indicating gloabal toast.
         */
        Constants.GLOBAL_NOTIFICATION_TYPE_TOAST = 1;
        /*
         * Type indicating sucess notification.
         */
        Constants.GLOBAL_NOTIFICATION_LEVEL_SUCCESS = 1;
        /*
         * Type Indicating Warning notification.
         */
        Constants.GLOBAL_NOTIFICATION_LEVEL_WARNING = 3;
        /*
         * APM setting value for Knowledge creations
         */
        Constants.CaseBasedKnowledgeCreation = 829050005;
        /*
         * Telemetry constant
         */
        Constants.TelemetryGetFeatureSettings = "GetFeatureSettings";
        Constants.ProposeKADialog = "ProposeKADialog";
        /*
         * FCS constants
         */
        Constants.FcsNamespace = "ServiceIntelligence.CustomerService";
        Constants.FcsKey = "CopilotKnowledgeDraftAssistEnabled";
        /*
         * Knowledge configuration constants
         */
        Constants.IsAgentKAdraftEnabled = "isAgentKAdraftEnabled";
        Constants.SettingValue = "1";
        Constants.KnowledgeConfigurationEntity = "msdyn_knowledgeconfiguration";
        Constants.KnowledgeCopilotGroupType = 3;
        return Constants;
    }());
    KnowledgeDraftAssist.Constants = Constants;
    var DialogCommandBarActions = /** @class */ (function () {
        function DialogCommandBarActions() {
            var _this = this;
            this.openProposeKADialog = function (entityName, eventContext) {
                var _a;
                var dialogOptions = { height: 775, width: 908, position: 1 /* XrmClientApi.Constants.WindowPosition.center */ };
                Xrm.Navigation.openDialog(Constants.DialogXmlId, dialogOptions, { 'entity_id': (_a = eventContext.entityReference) === null || _a === void 0 ? void 0 : _a.id }).then(function () {
                    KnowledgeDraftAssist.Telemetry.logInfo(Constants.ProposeKADialog, "Propose new knowledge dialog opened", { "onResolve": false });
                });
            };
            this.dialogOnLoad = function (context) {
            };
            this.fetchRequiredChecksForKnowledgeCreation = function () { return __awaiter(_this, void 0, void 0, function () {
                var fcsValue, _isEnabledInApm, _isAgentKADraftEnabled, _isAIAgentsEnabled, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            fcsValue = this.isFCSEnabled();
                            if (!fcsValue) {
                                return [2 /*return*/, false];
                            }
                            return [4 /*yield*/, this.isCopilotEnabledInAPM()];
                        case 1:
                            _isEnabledInApm = _a.sent();
                            return [4 /*yield*/, this.fetchIsAgentKADraftCopilotEnabled()];
                        case 2:
                            _isAgentKADraftEnabled = _a.sent();
                            return [4 /*yield*/, this.isAIAgentsEnabled()];
                        case 3:
                            _isAIAgentsEnabled = _a.sent();
                            KnowledgeDraftAssist.Telemetry.logInfo(Constants.TelemetryGetFeatureSettings, "Completed fetching required settings for knowledge creation", { "IsEnabledInAPM": _isEnabledInApm, "IsAgentKADraftEnabled": _isAgentKADraftEnabled, "FcsIsCopilotKnowledgeDraftAssistEnabled": fcsValue, "IsAIAgentsEnabled": _isAIAgentsEnabled });
                            return [2 /*return*/, (_isEnabledInApm && _isAgentKADraftEnabled && _isAIAgentsEnabled)];
                        case 4:
                            error_1 = _a.sent();
                            KnowledgeDraftAssist.Telemetry.logError(Constants.TelemetryGetFeatureSettings, "Failed in fetching required settings for knowledge creation", error_1);
                            return [2 /*return*/, false];
                        case 5: return [2 /*return*/];
                    }
                });
            }); };
        }
        DialogCommandBarActions.prototype.isKMDraftAssistEnabled = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.fetchRequiredChecksForKnowledgeCreation().then(function (result) {
                    (result != undefined) ? resolve(result) : resolve(false);
                }).catch(function (error) {
                    reject(error);
                });
            });
        };
        DialogCommandBarActions.prototype.isFCSEnabled = function () {
            var isCopilotKnowledgeDraftAssistEnabled = window.Xrm.Utility.getGlobalContext().getFeatureControlSetting(Constants.FcsNamespace, Constants.FcsKey);
            return isCopilotKnowledgeDraftAssistEnabled;
        };
        DialogCommandBarActions.prototype.isCopilotEnabledInAPM = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var timeoutDuration = 120000; // 2 minutes timeout
                var timeoutId = setTimeout(function () {
                    reject("Timed out while determining if APM has Copilot enabled.");
                }, timeoutDuration);
                var apmPromise = _this.fetchCopilotAPMConfig();
                apmPromise
                    .then(function (result) {
                    resolve(result);
                })
                    .catch(function (error) {
                    KnowledgeDraftAssist.Telemetry.logError(Constants.TelemetryGetFeatureSettings, "Failed in fetching isCopilotEnabledInAPM()", error);
                    reject(error);
                })
                    .finally(function () {
                    clearTimeout(timeoutId);
                });
            });
        };
        DialogCommandBarActions.prototype.fetchCopilotAPMConfig = function () {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var isMultiSession, eventParams, getAppConfigActionRequest, configs, config, appConfigUniqueName, appConfigId, isCaseBasedKnowledgeCreationEnabled, error_2;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            isMultiSession = ((_a = Microsoft === null || Microsoft === void 0 ? void 0 : Microsoft.AppRuntime) === null || _a === void 0 ? void 0 : _a.Sessions) != null;
                            if (!isMultiSession)
                                return [2 /*return*/, true];
                            eventParams = {
                                "Microsoft": Microsoft == null ? "Microsoft is null or undefined" :
                                    (Microsoft.AppRuntime == null ? "Microsoft is not null, but Microsoft.AppRuntime is null or undefined" :
                                        (Microsoft.AppRuntime.Sessions == null ? "Microsoft.AppRuntime is not null, but Microsoft.AppRuntime.Sessions is null or undefined" :
                                            "Microsoft.AppRuntime.Sessions is not null or undefined")),
                                "Xrm.App": ((_b = window.Xrm) === null || _b === void 0 ? void 0 : _b.App) == null ? "Xrm.App is null or undefined" :
                                    (window.Xrm.App.sessions == null ? "Xrm.App is not null, but Xrm.App.sessions is null or undefined" :
                                        "Xrm.App.sessions is not null or undefined")
                            };
                            KnowledgeDraftAssist.Telemetry.logInfo(Constants.TelemetryGetFeatureSettings, "Logging insights for app sessions", eventParams);
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 4, , 5]);
                            getAppConfigActionRequest = {
                                AppUniqueName: "msdyn_CustomerServiceWorkspace",
                                UserId: window.Xrm.Utility.getGlobalContext().userSettings
                                    .userId,
                                getMetadata: function () {
                                    return {
                                        boundParameter: null,
                                        parameterTypes: {
                                            AppUniqueName: {
                                                typeName: "Edm.String",
                                                structuralProperty: 1,
                                            },
                                            UserId: {
                                                typeName: "Edm.String",
                                                structuralProperty: 1,
                                            },
                                        },
                                        operationType: 0,
                                        operationName: "msdyn_getAppConfigByContext",
                                    };
                                },
                            };
                            return [4 /*yield*/, window.Xrm.WebApi.online
                                    .execute(getAppConfigActionRequest)
                                    .then(function (response) {
                                    return response.json();
                                })
                                    .then(function (data) {
                                    return JSON.parse(data === null || data === void 0 ? void 0 : data.AppConfigurations);
                                })];
                        case 2:
                            configs = _c.sent();
                            config = Object.values(configs)[0];
                            appConfigUniqueName = config === null || config === void 0 ? void 0 : config.AppConfigUniqueName;
                            appConfigId = config === null || config === void 0 ? void 0 : config.AppConfigId;
                            if (config == null ||
                                appConfigUniqueName == null ||
                                appConfigId == null)
                                throw "could not find an app config or could not find the unique name of an app config";
                            return [4 /*yield*/, this.fetchCaseBasedKnowledgeCreationEnabledFromCopilotAPMConfig(appConfigId)];
                        case 3:
                            isCaseBasedKnowledgeCreationEnabled = _c.sent();
                            return [2 /*return*/, isCaseBasedKnowledgeCreationEnabled];
                        case 4:
                            error_2 = _c.sent();
                            KnowledgeDraftAssist.Telemetry.logError(Constants.TelemetryGetFeatureSettings, "Failed in fetching apm config", error_2);
                            throw error_2;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        DialogCommandBarActions.prototype.fetchCaseBasedKnowledgeCreationEnabledFromCopilotAPMConfig = function (appConfigId) {
            return __awaiter(this, void 0, void 0, function () {
                var copilotConfigparams, copilotConfigEnabled;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            copilotConfigparams = "?$filter=_msdyn_appconfigurationid_value eq ".concat(appConfigId, " and msdyn_copilotfeature eq ").concat(Constants.CaseBasedKnowledgeCreation);
                            return [4 /*yield*/, window.Xrm.WebApi.retrieveMultipleRecords("msdyn_appcopilotconfiguration", copilotConfigparams).then(function (response) {
                                    var _a;
                                    if (response.entities.length == 0) {
                                        return true;
                                    }
                                    else {
                                        var enabled = (_a = response.entities[0]) === null || _a === void 0 ? void 0 : _a.msdyn_enabled;
                                        return enabled == null || enabled == undefined ? true : enabled;
                                    }
                                })];
                        case 1:
                            copilotConfigEnabled = _a.sent();
                            return [2 /*return*/, copilotConfigEnabled];
                    }
                });
            });
        };
        DialogCommandBarActions.prototype.fetchIsAgentKADraftCopilotEnabled = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isEnabled;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, window.Xrm.WebApi.retrieveMultipleRecords(Constants.KnowledgeConfigurationEntity, "?$filter=msdyn_groupname%20eq%20" +
                                Constants.KnowledgeCopilotGroupType).then(function (response) {
                                var entities = response.entities;
                                if (!entities) {
                                    return false;
                                }
                                for (var i = 0; i < entities.length; i++) {
                                    if (entities[i].msdyn_settingname == Constants.IsAgentKAdraftEnabled) {
                                        if (entities[i].msdyn_settingvalue !== Constants.SettingValue) {
                                            return false;
                                        }
                                        else {
                                            return true;
                                        }
                                    }
                                }
                            })];
                        case 1:
                            isEnabled = _a.sent();
                            return [2 /*return*/, isEnabled];
                    }
                });
            });
        };
        DialogCommandBarActions.prototype.isAIAgentsEnabled = function () {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var action, response, data, settings, isAIAgentsEnabled, error_3;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            action = {
                                getMetadata: function () {
                                    return {
                                        boundParameter: null,
                                        operationName: "msdyn_RetrievePlatformCopilotSettings",
                                        operationType: 0,
                                        parameterTypes: {}
                                    };
                                }
                            };
                            return [4 /*yield*/, window.Xrm.WebApi.online.execute(action)];
                        case 1:
                            response = _b.sent();
                            if (!response.ok) {
                                throw new Error("API call failed with status: ".concat(response.status, " ").concat(response.statusText));
                            }
                            return [4 /*yield*/, response.json()];
                        case 2:
                            data = _b.sent();
                            if (!data || !data.Result) {
                                throw new Error("Invalid response from msdyn_RetrievePlatformCopilotSettings API");
                            }
                            settings = JSON.parse(data.Result);
                            isAIAgentsEnabled = ((_a = settings === null || settings === void 0 ? void 0 : settings.CSCopilotHubSetting) === null || _a === void 0 ? void 0 : _a.AIAgents) === true;
                            return [2 /*return*/, isAIAgentsEnabled];
                        case 3:
                            error_3 = _b.sent();
                            KnowledgeDraftAssist.Telemetry.logError(Constants.TelemetryGetFeatureSettings, "Failed to check AI Agents enabled status", error_3);
                            // Default to true if we can't determine the status
                            return [2 /*return*/, true];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return DialogCommandBarActions;
    }());
    KnowledgeDraftAssist.DialogCommandBarActions = DialogCommandBarActions;
    var CommandBarActions = /** @class */ (function () {
        function CommandBarActions() {
        }
        CommandBarActions.Instance = new DialogCommandBarActions();
        return CommandBarActions;
    }());
    KnowledgeDraftAssist.CommandBarActions = CommandBarActions;
})(KnowledgeDraftAssist || (KnowledgeDraftAssist = {}));
//# sourceMappingURL=msdyn_KnowledgeDraftAssistLibrary.js.map