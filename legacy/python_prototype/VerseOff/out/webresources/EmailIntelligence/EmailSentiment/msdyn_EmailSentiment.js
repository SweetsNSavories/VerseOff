var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var EmailIntelligence;
(function (EmailIntelligence) {
    'use strict';
    var AppCheckHelper = /** @class */ (function () {
        function AppCheckHelper() {
        }
        AppCheckHelper.checkAppName = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, Promise.all([
                            window.Xrm.Utility.getGlobalContext().getCurrentAppProperties(),
                            window.Xrm.App.getCurrentAppComponents()
                        ])
                            .then(function (_a) {
                            var appProperties = _a[0], currentAppComponents = _a[1];
                            if (appProperties === undefined || appProperties === null) {
                                console.error("@@ App properties are undefined or null.");
                                return false; // Return false in case of error
                            }
                            // Check for specific app names
                            if (appProperties.uniqueName === "msdyn_TeamMember_Sales" ||
                                appProperties.uniqueName === "msdynce_saleshub" ||
                                appProperties.uniqueName === "msdynce_MarketingApp" ||
                                appProperties.uniqueName === "msdyncrm_MarketingSMBApp") {
                                return false; // App name doesn't match desired apps
                            }
                            if (currentAppComponents == null || currentAppComponents == undefined) {
                                return false; // Check if currentAppComponents is null or undefined
                            }
                            var currentAppEntities = currentAppComponents.entities;
                            var hasIncidentEntity = currentAppEntities.some(function (entity) { return entity.LogicalName === 'incident'; });
                            return hasIncidentEntity; // Return the result here
                        })
                            .catch(function (error) {
                            console.error("Error fetching app properties or components:", error);
                            return false; // Return false in case of error
                        })];
                });
            });
        };
        return AppCheckHelper;
    }());
    EmailIntelligence.AppCheckHelper = AppCheckHelper;
})(EmailIntelligence || (EmailIntelligence = {}));
/// <reference path="./AppCheckHelper.ts" />
var EmailIntelligence;
(function (EmailIntelligence) {
    'use strict';
    var Constants = /** @class */ (function () {
        function Constants() {
        }
        Constants.CopilotSettingAttributes = {
            AGENT_COPILOT_SETTING_ENTITY_NAME: "msdyn_agentcopilotsetting",
            AGENT_COPILOT_SETTING_ENTITY_ID: "c619dd93-b4fb-4f8b-8ab3-2c6ca53ca48a",
            AGENT_COPILOT_SETTING_EMAIL_SENTIMENT_ENABLED: "msdyn_emailsettingsenabled",
        };
        Constants.FCBConstants = {
            FCB_SHOW_SENTIMENT: "EnableEmailSentiment",
        };
        Constants.EmailFormPerfFCS = {
            Namespace: "CS.EmailIntelligence",
            FeatureName: "EnableEmailFormPerfEnhancements",
        };
        Constants.TelemetryConstants = {
            CrossGeoCheckHelper: "CrossGeoCheckHelper",
            EmailSentimentLibrary: "EmailIntelligence.EmailSentiment.EmailSentimentLibrary",
        };
        return Constants;
    }());
    EmailIntelligence.Constants = Constants;
})(EmailIntelligence || (EmailIntelligence = {}));
/// <reference path="./Constants.ts" />
var EmailIntelligence;
(function (EmailIntelligence) {
    'use strict';
    var FCSCheckHelper = /** @class */ (function () {
        function FCSCheckHelper() {
        }
        FCSCheckHelper.isEmailFormPerfEnhancementsEnabled = function () {
            try {
                return FCSCheckHelper.getFeatureControlSetting(EmailIntelligence.Constants.EmailFormPerfFCS.Namespace, EmailIntelligence.Constants.EmailFormPerfFCS.FeatureName, false) === true;
            }
            catch (error) {
                return false;
            }
        };
        FCSCheckHelper.getFeatureControlSetting = function (namespace, settingKey, defaultValue) {
            try {
                if (typeof window.Xrm === "undefined") {
                    return defaultValue;
                }
                var value = window.Xrm.Utility.getGlobalContext().getFeatureControlSetting(namespace, settingKey);
                if (value !== undefined && value !== null) {
                    return value;
                }
                return defaultValue;
            }
            catch (error) {
                return defaultValue;
            }
        };
        return FCSCheckHelper;
    }());
    EmailIntelligence.FCSCheckHelper = FCSCheckHelper;
})(EmailIntelligence || (EmailIntelligence = {}));
/// <reference path="./Constants.ts" />
/// <reference path="./FCSCheckHelper.ts" />
var EmailIntelligence;
(function (EmailIntelligence) {
    'use strict';
    var AgentCopilotHelper = /** @class */ (function () {
        function AgentCopilotHelper() {
        }
        AgentCopilotHelper.getStatus = function () {
            if (!EmailIntelligence.FCSCheckHelper.isEmailFormPerfEnhancementsEnabled()) {
                return AgentCopilotHelper._fetchStatus();
            }
            if (AgentCopilotHelper._statusPromise === null) {
                AgentCopilotHelper._statusPromise = AgentCopilotHelper._fetchStatus();
            }
            return AgentCopilotHelper._statusPromise;
        };
        AgentCopilotHelper._fetchStatus = function () {
            return window.Xrm.WebApi.online.retrieveRecord(EmailIntelligence.Constants.CopilotSettingAttributes.AGENT_COPILOT_SETTING_ENTITY_NAME, EmailIntelligence.Constants.CopilotSettingAttributes.AGENT_COPILOT_SETTING_ENTITY_ID)
                .then(function (response) {
                // Safe fallback if `msdyn_emailsentimentenabled` is undefined or null
                var emailSettingsEnabled = (response && response["msdyn_emailsentimentenabled"] !== undefined) ? response["msdyn_emailsentimentenabled"] : true;
                return emailSettingsEnabled;
            })
                .catch(function (error) {
                console.error("Error:", (error && error.message) ? error.message : error);
                return false;
            });
        };
        AgentCopilotHelper._statusPromise = null;
        return AgentCopilotHelper;
    }());
    EmailIntelligence.AgentCopilotHelper = AgentCopilotHelper;
})(EmailIntelligence || (EmailIntelligence = {}));
var EmailIntelligence;
(function (EmailIntelligence) {
    'use strict';
    EmailIntelligence.CommonParameters = {
        Error: "Error",
        Info: "Info",
        Marker: "Marker",
        Warning: "Warning",
        Source: "Source",
        Parameters: "Parameters"
    };
    EmailIntelligence.TelemetryConstants = {
        ApplyRoutingRule: "ApplyRoutingRule",
        ApplyRoutingRuleFromGrid: "ApplyRoutingRuleFromGrid",
        SaveAndRoute: "SaveAndRoute",
        ProposeKADialog: "ProposeKADialog",
        CompulsoryPrefix: "msdyn"
    };
    var Telemetry = /** @class */ (function () {
        function Telemetry() {
        }
        /**
        * Set context which is included in all log output.
        * @param name name of the current context
        */
        Telemetry.setContext = function (name) {
            Telemetry.contextName = name;
        };
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
                _a[EmailIntelligence.CommonParameters.Source] = source,
                _a[EmailIntelligence.CommonParameters.Error] = errorParam,
                _a[EmailIntelligence.CommonParameters.Parameters] = params,
                _a);
            Telemetry.logInternal(EmailIntelligence.CommonParameters.Error, errorMarker)();
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
                _a[EmailIntelligence.CommonParameters.Source] = source,
                _a[EmailIntelligence.CommonParameters.Warning] = warningParam,
                _a[EmailIntelligence.CommonParameters.Parameters] = params,
                _a);
            Telemetry.logInternal(EmailIntelligence.CommonParameters.Warning, warningMarker)();
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
                _a[EmailIntelligence.CommonParameters.Source] = source,
                _a[EmailIntelligence.CommonParameters.Info] = infoParam,
                _a[EmailIntelligence.CommonParameters.Parameters] = params,
                _a);
            Telemetry.logInternal(EmailIntelligence.CommonParameters.Info, infoMarker)();
        };
        /**
        * Logs duration marker
        * @param source
        * @param params
        */
        Telemetry.startTimer = function (source, params) {
            var _a;
            var marker = (_a = {},
                _a[EmailIntelligence.CommonParameters.Source] = source,
                _a[EmailIntelligence.CommonParameters.Parameters] = params,
                _a);
            return Telemetry.logInternal(EmailIntelligence.CommonParameters.Marker, marker);
        };
        /**
        * Internal method to log the event to UCI
        * @param name Event name
        * @param parameters Event params
        */
        Telemetry.logInternal = function (name, parameters) {
            // Safety in case the UCI context doesn't contain telemetry infrastructure.
            if (!Xrm.Internal || !Xrm.Internal.createPerformanceStopwatch) {
                return function () { };
            }
            var context = Telemetry.contextName || "";
            var fullName = EmailIntelligence.TelemetryConstants.CompulsoryPrefix + "." + context + "." + name;
            var stop = Xrm.Internal.createPerformanceStopwatch(fullName, parameters);
            return function (endParameters) {
                stop(endParameters);
            };
        };
        return Telemetry;
    }());
    EmailIntelligence.Telemetry = Telemetry;
})(EmailIntelligence || (EmailIntelligence = {}));
/// <reference path="./Telemetry.ts" />
/// <reference path="./Constants.ts" />
/// <reference path="./FCSCheckHelper.ts" />
var EmailIntelligence;
(function (EmailIntelligence) {
    'use strict';
    var CrossGeoCheckHelper = /** @class */ (function () {
        function CrossGeoCheckHelper() {
        }
        CrossGeoCheckHelper.getStatus = function () {
            if (!EmailIntelligence.FCSCheckHelper.isEmailFormPerfEnhancementsEnabled()) {
                return CrossGeoCheckHelper._fetchStatus();
            }
            if (CrossGeoCheckHelper._statusPromise === null) {
                CrossGeoCheckHelper._statusPromise = CrossGeoCheckHelper._fetchStatus();
            }
            return CrossGeoCheckHelper._statusPromise;
        };
        CrossGeoCheckHelper._fetchStatus = function () {
            return __awaiter(this, void 0, void 0, function () {
                var status, newApiRequest, response, responseData, resultString, result, crossGeoData, copilotSettings, applicable, enabled, allowAIAgents, allowCrossGeo, IsCrossGeoAlongWithAIAgentsEnabled, error_1, actionRequest;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            status = {
                                crossGeoCopilotDataMovementApplicable: true,
                                crossGeoCopilotDataMovementEnabled: true,
                                crossGeoDataMovement: true,
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            newApiRequest = {
                                getMetadata: function () { return ({
                                    boundParameter: null,
                                    parameterTypes: {},
                                    operationName: "msdyn_RetrievePlatformCopilotSettings",
                                    operationType: 0,
                                }); },
                            };
                            return [4 /*yield*/, window.Xrm.WebApi.online.execute(newApiRequest)];
                        case 2:
                            response = _a.sent();
                            if (!(response && response.ok)) return [3 /*break*/, 4];
                            return [4 /*yield*/, response.json()];
                        case 3:
                            responseData = _a.sent();
                            resultString = responseData && responseData.Result ? responseData.Result : "{}";
                            result = JSON.parse(resultString);
                            crossGeoData = result.CrossGeoDataMovement ? result.CrossGeoDataMovement : {};
                            copilotSettings = result.CSCopilotHubSetting ? result.CSCopilotHubSetting : {};
                            applicable = crossGeoData.crossGeoCopilotDataMovementApplicable ? crossGeoData.crossGeoCopilotDataMovementApplicable : false;
                            enabled = crossGeoData.crossGeoCopilotDataMovementEnabled ? crossGeoData.crossGeoCopilotDataMovementEnabled : false;
                            allowAIAgents = copilotSettings.AIAgents ? copilotSettings.AIAgents : false;
                            status.crossGeoCopilotDataMovementApplicable = applicable;
                            status.crossGeoCopilotDataMovementEnabled = enabled;
                            allowCrossGeo = (applicable && enabled) || !applicable;
                            IsCrossGeoAlongWithAIAgentsEnabled = allowCrossGeo && allowAIAgents;
                            EmailIntelligence.Telemetry.logInfo(EmailIntelligence.Constants.TelemetryConstants.CrossGeoCheckHelper, { APIName: "msdyn_RetrievePlatformCopilotSettings", allowCrossGeo: allowCrossGeo, allowAIAgents: allowAIAgents, IsCrossGeoAlongWithAIAgentsEnabled: IsCrossGeoAlongWithAIAgentsEnabled });
                            return [2 /*return*/, IsCrossGeoAlongWithAIAgentsEnabled];
                        case 4:
                            if (response && response.status && response.statusText && !response.ok) {
                                throw new Error("New API did not return OK. " + response.statusText + " (" + response.status + ")");
                            }
                            else {
                                throw new Error("New API did not return OK and response is undefined.");
                            }
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            error_1 = _a.sent();
                            // Log new API failure
                            EmailIntelligence.Telemetry.logError(EmailIntelligence.Constants.TelemetryConstants.CrossGeoCheckHelper, error_1, { APIName: "msdyn_RetrievePlatformCopilotSettings", ErrorMessage: (error_1 instanceof Error) ? error_1.message : String(error_1) });
                            return [3 /*break*/, 7];
                        case 7:
                            actionRequest = {
                                ScenarioType: "ppaccrossgeo",
                                RequestPayload: "",
                                getMetadata: function () {
                                    return {
                                        operationType: 0,
                                        operationName: "msdyn_InvokeIntelligenceAction",
                                        boundParameter: null,
                                        parameterTypes: {
                                            ScenarioType: { typeName: "Edm.String", structuralProperty: 1 },
                                            RequestPayload: { typeName: "Edm.String", structuralProperty: 1 }
                                        }
                                    };
                                }
                            };
                            return [2 /*return*/, window.Xrm.WebApi.online
                                    .execute(actionRequest)
                                    .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                                    var jsonRes, parsedResult, crossGeoCopilotDataMovementApplicable, crossGeoCopilotDataMovementEnabled;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!response.ok) return [3 /*break*/, 2];
                                                return [4 /*yield*/, response.json()];
                                            case 1:
                                                jsonRes = _a.sent();
                                                parsedResult = JSON.parse((jsonRes && jsonRes.Result) ? jsonRes.Result : "{}");
                                                crossGeoCopilotDataMovementApplicable = parsedResult.crossGeoCopilotDataMovementApplicable;
                                                crossGeoCopilotDataMovementEnabled = parsedResult.crossGeoCopilotDataMovementEnabled;
                                                status.crossGeoCopilotDataMovementApplicable = (crossGeoCopilotDataMovementApplicable !== undefined && crossGeoCopilotDataMovementApplicable !== null)
                                                    ? crossGeoCopilotDataMovementApplicable
                                                    : false;
                                                status.crossGeoCopilotDataMovementEnabled = (crossGeoCopilotDataMovementEnabled !== undefined && crossGeoCopilotDataMovementEnabled !== null)
                                                    ? crossGeoCopilotDataMovementEnabled
                                                    : false;
                                                status.crossGeoDataMovement =
                                                    (status.crossGeoCopilotDataMovementApplicable && status.crossGeoCopilotDataMovementEnabled) ||
                                                        !status.crossGeoCopilotDataMovementApplicable;
                                                EmailIntelligence.Telemetry.logInfo(EmailIntelligence.Constants.TelemetryConstants.CrossGeoCheckHelper, { APIName: "msdyn_InvokeIntelligenceAction PPACCrossGeo", crossGeoCopilotDataMovementApplicable: crossGeoCopilotDataMovementApplicable, crossGeoCopilotDataMovementEnabled: crossGeoCopilotDataMovementEnabled });
                                                return [2 /*return*/, status.crossGeoDataMovement];
                                            case 2: throw new Error("Error while fetching PPAC data movement status. Status: " + response.status + " - " + response.statusText);
                                        }
                                    });
                                }); })
                                    .catch(function (error) {
                                    EmailIntelligence.Telemetry.logError(EmailIntelligence.Constants.TelemetryConstants.CrossGeoCheckHelper, error instanceof Error ? error : new Error(String(error)), { APIName: "msdyn_InvokeIntelligenceAction PPACCrossGeo", ErrorMessage: (error instanceof Error) ? error.message : String(error) });
                                    return false;
                                })];
                    }
                });
            });
        };
        CrossGeoCheckHelper._statusPromise = null;
        return CrossGeoCheckHelper;
    }());
    EmailIntelligence.CrossGeoCheckHelper = CrossGeoCheckHelper;
})(EmailIntelligence || (EmailIntelligence = {}));
/// <reference path="./Constants.ts" />
var EmailIntelligence;
(function (EmailIntelligence) {
    'use strict';
    var FCBCheckHelper = /** @class */ (function () {
        function FCBCheckHelper() {
        }
        FCBCheckHelper.getStatus = function () {
            var isEmailSentimentFCBEnabled = false;
            if (window.Xrm.Internal.isUci()) {
                isEmailSentimentFCBEnabled = window.Xrm.Internal.isDisruptiveFeatureEnabled("FCB." + EmailIntelligence.Constants.FCBConstants.FCB_SHOW_SENTIMENT);
            }
            else {
                isEmailSentimentFCBEnabled =
                    //s (window as any).Xrm.Internal.isFeatureEnabled(FCBConstant.FCB_April2024Update) &&
                    window.Xrm.Internal.isFeatureEnabled(EmailIntelligence.Constants.FCBConstants.FCB_SHOW_SENTIMENT);
            }
            return isEmailSentimentFCBEnabled;
        };
        return FCBCheckHelper;
    }());
    EmailIntelligence.FCBCheckHelper = FCBCheckHelper;
})(EmailIntelligence || (EmailIntelligence = {}));
///<reference path="./AgentCopilotHelper.ts" />
/// <reference path="./CrossGeoCheckHelper.ts" />
/// <reference path="./FCBCheckHelper.ts" />
/// <reference path="./FCSCheckHelper.ts" />
/// <reference path="./AppCheckHelper.ts" />
/// <reference path="./Telemetry.ts" />
//import FCBCheckHelper from "./FCBCheckHelper";
//import { AgentCopilotHelper } from "./AgentCopilotHelper";
//import { AppCheckHelper } from "./AppCheckHelper";
var EmailIntelligence;
(function (EmailIntelligence) {
    'use strict';
    var EmailSentimentLibrary = /** @class */ (function () {
        function EmailSentimentLibrary() {
        }
        EmailSentimentLibrary.onLoad = function (executionContext) {
            EmailIntelligence.Telemetry.setContext(EmailIntelligence.Constants.TelemetryConstants.EmailSentimentLibrary);
            var formContext = executionContext.getFormContext();
            var isEmailSentimentFCBEnabled = this.getIsFCBEnabled();
            var doesFormHaveSentimentFieldControl = formContext.getControl("msdyn_sentiment") != null;
            if (!isEmailSentimentFCBEnabled) {
                if (doesFormHaveSentimentFieldControl) {
                    formContext.getControl("msdyn_sentiment").setVisible(false);
                }
                return;
            }
            if (EmailIntelligence.FCSCheckHelper.isEmailFormPerfEnhancementsEnabled()) {
                // Perf-enhanced path: hide initially and reveal only if all four checks pass.
                // Avoids a visible flash during the async check window.
                if (doesFormHaveSentimentFieldControl) {
                    formContext.getControl("msdyn_sentiment").setVisible(false);
                }
                var stopTimer_1 = EmailIntelligence.Telemetry.startTimer("DeferredSentimentChecks", { fcsEnabled: true });
                Promise.all([
                    EmailSentimentLibrary.getIsCrossgeoEnabledWithAgent(),
                    EmailSentimentLibrary.getIsSentimentSetting(),
                    EmailSentimentLibrary.getIsAppPermitted(),
                    EmailSentimentLibrary.showSentimentControlForDraftAndReceivedEmail(formContext)
                ]).then(function (values) {
                    var shouldReveal = !!(values[0] && values[1] && values[2] && values[3]);
                    if (shouldReveal && doesFormHaveSentimentFieldControl) {
                        formContext.getControl("msdyn_sentiment").setVisible(true);
                    }
                    stopTimer_1({ status: "success", visibilityRevealed: shouldReveal });
                }).catch(function (error) {
                    stopTimer_1({ status: "error" });
                    EmailIntelligence.Telemetry.logError(EmailIntelligence.Constants.TelemetryConstants.EmailSentimentLibrary, error instanceof Error ? error : new Error(String(error)), { Event: "DeferredSentimentChecksError" });
                });
            }
            else {
                // FCS off: run the pre-perf-enhancement code path (master behavior).
                Promise.all([this.getIsCrossgeoEnabledWithAgent(), this.getIsSentimentSetting(), this.getIsAppPermitted(), this.showSentimentControlForDraftAndReceivedEmail(formContext)]).then(function (values) {
                    if (values[0] && values[1] && values[2] && values[3]) {
                        if (doesFormHaveSentimentFieldControl) {
                            formContext.getControl("msdyn_sentiment").setVisible(true);
                        }
                    }
                    else {
                        if (doesFormHaveSentimentFieldControl) {
                            formContext.getControl("msdyn_sentiment").setVisible(false);
                        }
                    }
                })
                    .catch(function (_error) {
                    if (doesFormHaveSentimentFieldControl) {
                        formContext.getControl("msdyn_sentiment").setVisible(false);
                    }
                });
            }
        };
        // Method to check if Cross-Geo is enabled
        EmailSentimentLibrary.getIsCrossgeoEnabledWithAgent = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isCrossGeoEnabledWithAgent, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, EmailIntelligence.CrossGeoCheckHelper.getStatus()];
                        case 1:
                            isCrossGeoEnabledWithAgent = _a.sent();
                            return [2 /*return*/, isCrossGeoEnabledWithAgent];
                        case 2:
                            error_2 = _a.sent();
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // Method to check if Sentiment setting is enabled
        EmailSentimentLibrary.getIsSentimentSetting = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isSentimentEnabled, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, EmailIntelligence.AgentCopilotHelper.getStatus()];
                        case 1:
                            isSentimentEnabled = _a.sent();
                            return [2 /*return*/, isSentimentEnabled];
                        case 2:
                            error_3 = _a.sent();
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // Method to check if FCB is enabled
        EmailSentimentLibrary.getIsFCBEnabled = function () {
            var isFCBEnabled = EmailIntelligence.FCBCheckHelper.getStatus();
            return isFCBEnabled;
        };
        EmailSentimentLibrary.getIsAppPermitted = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isPermittedApp;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, EmailIntelligence.AppCheckHelper.checkAppName()];
                        case 1:
                            isPermittedApp = _a.sent();
                            return [2 /*return*/, isPermittedApp];
                    }
                });
            });
        };
        // Method to show SentimentControl For Received, Draft Emails
        EmailSentimentLibrary.showSentimentControlForDraftAndReceivedEmail = function (formContext) {
            return __awaiter(this, void 0, void 0, function () {
                var stateCode, statusCode, parentActivitiId, sentimentValue, parentActivitiIdValue, parentRecord, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            stateCode = formContext.getAttribute("statecode").getValue();
                            statusCode = formContext.getAttribute("statuscode").getValue();
                            parentActivitiId = formContext.getAttribute("parentactivityid").getValue();
                            sentimentValue = formContext.getAttribute("msdyn_sentiment").getValue();
                            if (parentActivitiId && parentActivitiId.length > 0) {
                                parentActivitiIdValue = parentActivitiId ? parentActivitiId[0].id : null;
                            }
                            if (!(statusCode === 4 && stateCode === 1 && sentimentValue !== null && sentimentValue !== undefined)) return [3 /*break*/, 1];
                            //Received email and sentiment has some value
                            return [2 /*return*/, true];
                        case 1:
                            if (!(parentActivitiIdValue && statusCode === 1)) return [3 /*break*/, 3];
                            return [4 /*yield*/, Xrm.WebApi.online.retrieveRecord("email", parentActivitiIdValue, "?$select=statecode,statuscode,msdyn_sentiment")];
                        case 2:
                            parentRecord = _a.sent();
                            if (parentRecord) {
                                if (parentRecord.statuscode === 4 && parentRecord.msdyn_sentiment !== null && parentRecord.msdyn_sentiment !== undefined) {
                                    return [2 /*return*/, true];
                                }
                                else {
                                    return [2 /*return*/, false];
                                }
                            }
                            else {
                                return [2 /*return*/, false];
                            }
                            return [3 /*break*/, 4];
                        case 3: return [2 /*return*/, false];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_4 = _a.sent();
                            return [2 /*return*/, false];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        return EmailSentimentLibrary;
    }());
    EmailIntelligence.EmailSentimentLibrary = EmailSentimentLibrary;
})(EmailIntelligence || (EmailIntelligence = {}));
