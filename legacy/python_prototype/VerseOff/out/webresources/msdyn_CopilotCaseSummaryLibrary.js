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
var Mscrm;
(function (Mscrm) {
    var CSIntelligence;
    (function (CSIntelligence) {
        var CopilotCaseSummary;
        (function (CopilotCaseSummary) {
            CopilotCaseSummary.TelemetryEvents = {
                SessionName: "Mscrm.CSIntelligence.CopilotCaseSummary",
                SetVisibilityOfCaseSummaryEvent: "SetVisibilityOfCaseSummary",
                IsSettingAndFCSEnabledEvent: "IsSettingAndFCSEnabled",
                GetFCSEnabled: "GetFCSEnabled",
                IsCopilotEnabledInAPM: "IsCopilotEnabledInAPM",
                SetVisibilityDuringError: "SetVisibilityDuringError",
                GetCopilotSetting: "GetCopilotSetting",
                GetAppProfileConfiguration: "GetAppProfileConfiguration",
            };
            CopilotCaseSummary.FCS = {
                FCSNameSpace: "ServiceIntelligence.CustomerService",
                FCSKeyCopilotCaseSummary: "CopilotCaseSummary",
                DefaultOnSummaryFCS: "DefaultOnSummary",
            };
            CopilotCaseSummary.CacheKeys = {
                SessionStorageSingleSessionCacheKey: "msdyn_copilotCaseSummaryEnabledSingleSession",
                SessionStorageMultiSessionCacheKey: "msdyn_copilotCaseSummaryEnabledMultiSession",
                SessionStorageSettingCacheKey: "msdyn_copilotCaseSummarySetting",
            };
            CopilotCaseSummary.CopilotSummarizationConstants = {
                SettingEntityName: "msdyn_copilotsummarizationsetting",
                DefaultSettingRecordId: "7fa56176-c226-45e5-b8fa-25d56e0dcc21",
                AppSettingCaseSummary: "msdyn_casesummaryEnabled",
            };
            CopilotCaseSummary.CopilotSummarizationSettingAttributes = {
                Name: "msdyn_name",
                CopilotEnabled: "msdyn_enabled",
                CaseSummaryEnabled: "msdyn_casesummaryenabled",
                ConversationSummaryOnDemandEnabled: "msdyn_ondemandenabled",
                ConversationSummaryConvEndsEnabled: "msdyn_whenconversationendsenabled",
                ConversationSummaryAgentJoinsEnabled: "msdyn_whenagentjoinsenabled",
                InteractionsEnabled: "msdyn_interactionsenabled",
                UseAgentLanguage: "msdyn_useagentlanguage",
                AutoEnabled: "msdyn_autoenabled",
                CaseSummaryConfiguration: "msdyn_casesummaryconfiguration",
                ConversationSummaryConfiguration: "msdyn_conversationsummaryconfiguration",
                AllowTranslation: "msdyn_allowtranslation",
                RelatedRecordConfiguration: "msdyn_relatedrecordconfiguration",
            };
            var CopilotFeatures;
            (function (CopilotFeatures) {
                CopilotFeatures[CopilotFeatures["CaseSummary"] = 829050003] = "CaseSummary";
            })(CopilotFeatures = CopilotCaseSummary.CopilotFeatures || (CopilotCaseSummary.CopilotFeatures = {}));
        })(CopilotCaseSummary = CSIntelligence.CopilotCaseSummary || (CSIntelligence.CopilotCaseSummary = {}));
    })(CSIntelligence = Mscrm.CSIntelligence || (Mscrm.CSIntelligence = {}));
})(Mscrm || (Mscrm = {}));
/// <reference path="Constants.ts" />
var Mscrm;
(function (Mscrm) {
    var CSIntelligence;
    (function (CSIntelligence) {
        var CopilotCaseSummary;
        (function (CopilotCaseSummary) {
            var CommonParameters;
            (function (CommonParameters) {
                CommonParameters["Error"] = "Error";
                CommonParameters["Info"] = "Info";
                CommonParameters["Marker"] = "Marker";
                CommonParameters["Warning"] = "Warning";
                CommonParameters["Source"] = "Source";
                CommonParameters["Parameters"] = "Parameters";
            })(CommonParameters = CopilotCaseSummary.CommonParameters || (CopilotCaseSummary.CommonParameters = {}));
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
                    var fullName = "".concat(CopilotCaseSummary.TelemetryEvents.SessionName, ".").concat(name);
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
                return Telemetry;
            }());
            CopilotCaseSummary.Telemetry = Telemetry;
        })(CopilotCaseSummary = CSIntelligence.CopilotCaseSummary || (CSIntelligence.CopilotCaseSummary = {}));
    })(CSIntelligence = Mscrm.CSIntelligence || (Mscrm.CSIntelligence = {}));
})(Mscrm || (Mscrm = {}));
/// <reference path="Constants.ts" />
/// <reference path="Telemetry.ts" />
var Mscrm;
(function (Mscrm) {
    var CSIntelligence;
    (function (CSIntelligence) {
        var CopilotCaseSummary;
        (function (CopilotCaseSummary) {
            function isNullOrUndefined(object) {
                return object === undefined || object === null;
            }
            CopilotCaseSummary.isNullOrUndefined = isNullOrUndefined;
            function getFCSEnabled(nameSpace, key) {
                var isFCSEnabled = false;
                var globalContext = window.Xrm.Utility.getGlobalContext();
                var fcsValue = globalContext.getFeatureControlSetting(nameSpace, key);
                if (isNullOrUndefined(fcsValue)) {
                    throw "Undefined or null returned from getFeatureControlSetting for NameSpace '".concat(nameSpace, " Key '").concat(key, "'");
                }
                else if (fcsValue) {
                    isFCSEnabled = true;
                }
                CopilotCaseSummary.Telemetry.logInfo(CopilotCaseSummary.TelemetryEvents.GetFCSEnabled, {
                    nameSpace: nameSpace,
                    key: key,
                    isEnabled: isFCSEnabled,
                });
                return isFCSEnabled;
            }
            CopilotCaseSummary.getFCSEnabled = getFCSEnabled;
            function hasPrivilegeError(error) {
                var errorString = typeof error === "object" ? JSON.stringify(error) : error;
                return /is missing \S+ privilege/.test(errorString);
            }
            CopilotCaseSummary.hasPrivilegeError = hasPrivilegeError;
            function isMultiSession() {
                var _a;
                return !!((_a = Xrm === null || Xrm === void 0 ? void 0 : Xrm.App) === null || _a === void 0 ? void 0 : _a.sessions);
            }
            CopilotCaseSummary.isMultiSession = isMultiSession;
        })(CopilotCaseSummary = CSIntelligence.CopilotCaseSummary || (CSIntelligence.CopilotCaseSummary = {}));
    })(CSIntelligence = Mscrm.CSIntelligence || (Mscrm.CSIntelligence = {}));
})(Mscrm || (Mscrm = {}));
/// <reference path="Utils.ts" />
var Mscrm;
(function (Mscrm) {
    var CSIntelligence;
    (function (CSIntelligence) {
        var CopilotCaseSummary;
        (function (CopilotCaseSummary) {
            var CACHE_INVALIDATION_DURATION_IN_MS = 43200000; // 12 hours
            function getCachedItemByKey(key) {
                // Check the cache for the last stored value and its expiry date.
                // If the value exists and hasn't expired, use it. Otherwise return null.
                var jsonObject = sessionStorage.getItem(key);
                if (!CopilotCaseSummary.isNullOrUndefined(jsonObject)) {
                    var cachedItem = void 0;
                    try {
                        cachedItem = JSON.parse(jsonObject);
                    }
                    catch (error) {
                        // Do nothing. If the item cannot be parsed, it will be removed below.
                    }
                    if (!CopilotCaseSummary.isNullOrUndefined(cachedItem) &&
                        !CopilotCaseSummary.isNullOrUndefined(cachedItem.expiryDate) &&
                        !CopilotCaseSummary.isNullOrUndefined(cachedItem.value) &&
                        new Date() <= new Date(cachedItem.expiryDate)) {
                        return cachedItem.value;
                    }
                    else {
                        // Remove the item from the cache as it could not be parsed, does not fit the expected format or is expired.
                        sessionStorage.removeItem(key);
                    }
                }
                return null;
            }
            CopilotCaseSummary.getCachedItemByKey = getCachedItemByKey;
            function setCachedItemByKey(key, value) {
                var sessionItem = {
                    expiryDate: new Date(new Date().getTime() + CACHE_INVALIDATION_DURATION_IN_MS),
                    value: value,
                };
                var itemToCache = JSON.stringify(sessionItem);
                sessionStorage.setItem(key, itemToCache);
            }
            CopilotCaseSummary.setCachedItemByKey = setCachedItemByKey;
        })(CopilotCaseSummary = CSIntelligence.CopilotCaseSummary || (CSIntelligence.CopilotCaseSummary = {}));
    })(CSIntelligence = Mscrm.CSIntelligence || (Mscrm.CSIntelligence = {}));
})(Mscrm || (Mscrm = {}));
/// <reference lib="es2018" />
/// <reference path="Constants.ts" />
/// <reference path="Telemetry.ts" />
/// <reference path="Utils.ts" />
/// <reference path="SessionStorage.ts" />
/// <reference path="ISetting.ts" />
var Mscrm;
(function (Mscrm) {
    var CSIntelligence;
    (function (CSIntelligence) {
        var CopilotCaseSummary;
        (function (CopilotCaseSummary) {
            function setVisibilityOfCaseSummary(context, columnName, summarySettingId) {
                var _this = this;
                var _a, _b, _c, _d, _e;
                var formContext = context.getFormContext();
                var copilotSummaryControl = formContext === null || formContext === void 0 ? void 0 : formContext.getControl(columnName);
                var currentItem = (_c = (_b = (_a = formContext === null || formContext === void 0 ? void 0 : formContext.ui) === null || _a === void 0 ? void 0 : _a.formSelector) === null || _b === void 0 ? void 0 : _b.getCurrentItem) === null || _c === void 0 ? void 0 : _c.call(_b);
                var formId = (_d = currentItem === null || currentItem === void 0 ? void 0 : currentItem.getId) === null || _d === void 0 ? void 0 : _d.call(currentItem);
                var formLabel = (_e = currentItem === null || currentItem === void 0 ? void 0 : currentItem.getLabel) === null || _e === void 0 ? void 0 : _e.call(currentItem);
                var settingId = summarySettingId !== null && summarySettingId !== void 0 ? summarySettingId : CopilotCaseSummary.CopilotSummarizationConstants.DefaultSettingRecordId;
                if (copilotSummaryControl) {
                    CopilotCaseSummary.Telemetry.logInfo(CopilotCaseSummary.TelemetryEvents.SetVisibilityOfCaseSummaryEvent, "Starting evaluation for copilot case summary.", { formId: formId, formLabel: formLabel, columnName: columnName, settingId: settingId });
                    var sessionStorageCacheKey_1 = CopilotCaseSummary.isMultiSession()
                        ? "".concat(CopilotCaseSummary.CacheKeys.SessionStorageMultiSessionCacheKey, "_").concat(settingId)
                        : "".concat(CopilotCaseSummary.CacheKeys.SessionStorageSingleSessionCacheKey, "_").concat(settingId);
                    var isFeatureEnabledInCache = CopilotCaseSummary.getCachedItemByKey(sessionStorageCacheKey_1);
                    if (isFeatureEnabledInCache != null) {
                        copilotSummaryControl.setVisible(isFeatureEnabledInCache);
                        CopilotCaseSummary.Telemetry.logInfo(CopilotCaseSummary.TelemetryEvents.SetVisibilityOfCaseSummaryEvent, "Setting the visibility based on cache was successful.", { isFeatureEnabledInCache: isFeatureEnabledInCache, sessionStorageCacheKey: sessionStorageCacheKey_1 });
                    }
                    else {
                        isSettingAndFCSEnabled(settingId)
                            .then(function (isFeatureEnabled) {
                            copilotSummaryControl.setVisible(isFeatureEnabled);
                            try {
                                CopilotCaseSummary.setCachedItemByKey(sessionStorageCacheKey_1, isFeatureEnabled);
                                CopilotCaseSummary.Telemetry.logInfo(CopilotCaseSummary.TelemetryEvents.SetVisibilityOfCaseSummaryEvent, "Setting the visibility and cache was successful.", {
                                    isFeatureEnabled: isFeatureEnabled,
                                    sessionStorageCacheKey: sessionStorageCacheKey_1,
                                });
                            }
                            catch (error) {
                                CopilotCaseSummary.Telemetry.logError(CopilotCaseSummary.TelemetryEvents.SetVisibilityOfCaseSummaryEvent, "Setting the cache failed.", {
                                    error: error,
                                    sessionStorageCacheKey: sessionStorageCacheKey_1,
                                });
                            }
                        })
                            .catch(function (error) { return __awaiter(_this, void 0, void 0, function () {
                            var isPrivilegeError, showCaseSummary;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        isPrivilegeError = CopilotCaseSummary.hasPrivilegeError(error);
                                        if (!isPrivilegeError) return [3 /*break*/, 2];
                                        return [4 /*yield*/, shouldSetVisibilityDuringError()];
                                    case 1:
                                        showCaseSummary = _a.sent();
                                        copilotSummaryControl.setVisible(showCaseSummary);
                                        return [3 /*break*/, 3];
                                    case 2:
                                        copilotSummaryControl.setVisible(false);
                                        _a.label = 3;
                                    case 3:
                                        CopilotCaseSummary.Telemetry.logError(CopilotCaseSummary.TelemetryEvents.SetVisibilityOfCaseSummaryEvent, "Getting the feature settings failed.", {
                                            error: error,
                                            sessionStorageCacheKey: sessionStorageCacheKey_1,
                                            isPrivilegeError: isPrivilegeError,
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    }
                }
                else {
                    CopilotCaseSummary.Telemetry.logError(CopilotCaseSummary.TelemetryEvents.SetVisibilityOfCaseSummaryEvent, "The control with the given column name was not found on the form.", { formId: formId, formLabel: formLabel, columnName: columnName, settingId: settingId });
                }
            }
            CopilotCaseSummary.setVisibilityOfCaseSummary = setVisibilityOfCaseSummary;
            function shouldSetVisibilityDuringError() {
                return __awaiter(this, void 0, void 0, function () {
                    var showCaseSummary, globalContext, appSettingEnabled, isDefaultOnSummaryFCS, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                showCaseSummary = false;
                                globalContext = window.Xrm.Utility.getGlobalContext();
                                appSettingEnabled = globalContext.getCurrentAppSetting(CopilotCaseSummary.CopilotSummarizationConstants.AppSettingCaseSummary);
                                isDefaultOnSummaryFCS = CopilotCaseSummary.getFCSEnabled(CopilotCaseSummary.FCS.FCSNameSpace, CopilotCaseSummary.FCS.DefaultOnSummaryFCS);
                                // case summary is only shown in error conditions when the app setting is enabled and the default on summary FCS is enabled
                                showCaseSummary = appSettingEnabled && isDefaultOnSummaryFCS;
                                if (!(showCaseSummary && CopilotCaseSummary.isMultiSession())) return [3 /*break*/, 2];
                                return [4 /*yield*/, isCopilotEnabledInAPM()];
                            case 1:
                                showCaseSummary = _a.sent();
                                _a.label = 2;
                            case 2:
                                CopilotCaseSummary.Telemetry.logInfo(CopilotCaseSummary.TelemetryEvents.SetVisibilityDuringError, "Setting the visibility for error was successful.", {
                                    showCaseSummary: showCaseSummary,
                                    isMultiSession: CopilotCaseSummary.isMultiSession(),
                                    isDefaultOnSummaryFCS: isDefaultOnSummaryFCS,
                                    appSettingEnabled: appSettingEnabled,
                                });
                                return [2 /*return*/, showCaseSummary];
                            case 3:
                                error_1 = _a.sent();
                                // silently log the error and return false
                                CopilotCaseSummary.Telemetry.logError(CopilotCaseSummary.TelemetryEvents.SetVisibilityDuringError, "Setting the visibility for error failed.", { isMultiSession: CopilotCaseSummary.isMultiSession() });
                                return [2 /*return*/, false];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
            function isSettingAndFCSEnabled(settingId) {
                var _a;
                return __awaiter(this, void 0, void 0, function () {
                    var isCaseSummaryFCSEnabled, isCaseSummaryEnabled, settings, globalContext, appSettingEnabled, settingAutoEnabled, isDefaultOnSummaryFCS, isAgentAuthorizedInAPM;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                isCaseSummaryFCSEnabled = CopilotCaseSummary.getFCSEnabled(CopilotCaseSummary.FCS.FCSNameSpace, CopilotCaseSummary.FCS.FCSKeyCopilotCaseSummary);
                                if (!isCaseSummaryFCSEnabled) return [3 /*break*/, 3];
                                isCaseSummaryEnabled = false;
                                return [4 /*yield*/, getCopilotSummarizationSetting(settingId)];
                            case 1:
                                settings = _b.sent();
                                if (settings.copilotEnabled && settings.caseSummaryEnabled) {
                                    isCaseSummaryEnabled = true;
                                }
                                globalContext = window.Xrm.Utility.getGlobalContext();
                                appSettingEnabled = globalContext.getCurrentAppSetting(CopilotCaseSummary.CopilotSummarizationConstants.AppSettingCaseSummary);
                                settingAutoEnabled = (_a = settings.autoEnabled) !== null && _a !== void 0 ? _a : false;
                                isDefaultOnSummaryFCS = CopilotCaseSummary.getFCSEnabled(CopilotCaseSummary.FCS.FCSNameSpace, CopilotCaseSummary.FCS.DefaultOnSummaryFCS);
                                // case summary is enabled if the below conditions are met:
                                // 1. case summary setting is enabled and app setting is enabled
                                // 2. auto-on FCS and auto-enabled setting are both enabled or auto-enabled setting is disabled
                                isCaseSummaryEnabled =
                                    isCaseSummaryEnabled &&
                                        appSettingEnabled &&
                                        ((isDefaultOnSummaryFCS && settingAutoEnabled) || !settingAutoEnabled);
                                CopilotCaseSummary.Telemetry.logInfo(CopilotCaseSummary.TelemetryEvents.IsSettingAndFCSEnabledEvent, "Successfully retrieved summarization settings.", {
                                    isCaseSummaryEnabled: isCaseSummaryEnabled,
                                    appSettingEnabled: appSettingEnabled,
                                    isDefaultOnSummaryFCS: isDefaultOnSummaryFCS,
                                    settingAutoEnabled: settingAutoEnabled,
                                    isMultiSession: CopilotCaseSummary.isMultiSession(),
                                });
                                if (!isCaseSummaryEnabled) return [3 /*break*/, 3];
                                if (!CopilotCaseSummary.isMultiSession()) {
                                    // For single session we do not need to check additional authorization
                                    return [2 /*return*/, true];
                                }
                                return [4 /*yield*/, isCopilotEnabledInAPM()];
                            case 2:
                                isAgentAuthorizedInAPM = _b.sent();
                                if (CopilotCaseSummary.isNullOrUndefined(isAgentAuthorizedInAPM)) {
                                    throw "Undefined or null returned from isCopilotEnabledInAPM";
                                }
                                else if (isAgentAuthorizedInAPM) {
                                    return [2 /*return*/, true];
                                }
                                _b.label = 3;
                            case 3: return [2 /*return*/, false];
                        }
                    });
                });
            }
            function getCopilotSummarizationSetting(settingId) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                return __awaiter(this, void 0, void 0, function () {
                    var cacheKey, timer, cachedSetting, copilotSettingFromCache, copilotEnabled_1, caseSummaryEnabled_1, conversationSummaryOnDemandEnabled_1, conversationSummaryConvEndsEnabled_1, conversationSummaryAgentJoinsEnabled_1, interactionsEnabled_1, useAgentLanguage_1, autoEnabled_1, allowTranslation_1, attributeList, setting, copilotSetting, copilotEnabled, caseSummaryEnabled, conversationSummaryOnDemandEnabled, conversationSummaryConvEndsEnabled, conversationSummaryAgentJoinsEnabled, interactionsEnabled, useAgentLanguage, autoEnabled, allowTranslation, error_2;
                    return __generator(this, function (_l) {
                        switch (_l.label) {
                            case 0:
                                cacheKey = "".concat(CopilotCaseSummary.CacheKeys.SessionStorageSettingCacheKey, "_").concat(settingId);
                                timer = CopilotCaseSummary.Telemetry.measureStartStop(CopilotCaseSummary.TelemetryEvents.GetCopilotSetting, { cacheKey: cacheKey, settingId: settingId });
                                _l.label = 1;
                            case 1:
                                _l.trys.push([1, 3, , 4]);
                                cachedSetting = CopilotCaseSummary.getCachedItemByKey(cacheKey);
                                if (!CopilotCaseSummary.isNullOrUndefined(cachedSetting)) {
                                    copilotSettingFromCache = cachedSetting;
                                    copilotEnabled_1 = copilotSettingFromCache.copilotEnabled, caseSummaryEnabled_1 = copilotSettingFromCache.caseSummaryEnabled, conversationSummaryOnDemandEnabled_1 = copilotSettingFromCache.conversationSummaryOnDemandEnabled, conversationSummaryConvEndsEnabled_1 = copilotSettingFromCache.conversationSummaryConvEndsEnabled, conversationSummaryAgentJoinsEnabled_1 = copilotSettingFromCache.conversationSummaryAgentJoinsEnabled, interactionsEnabled_1 = copilotSettingFromCache.interactionsEnabled, useAgentLanguage_1 = copilotSettingFromCache.useAgentLanguage, autoEnabled_1 = copilotSettingFromCache.autoEnabled, allowTranslation_1 = copilotSettingFromCache.allowTranslation;
                                    timer({
                                        success: true,
                                        copilotEnabled: copilotEnabled_1,
                                        caseSummaryEnabled: caseSummaryEnabled_1,
                                        conversationSummaryOnDemandEnabled: conversationSummaryOnDemandEnabled_1,
                                        conversationSummaryConvEndsEnabled: conversationSummaryConvEndsEnabled_1,
                                        conversationSummaryAgentJoinsEnabled: conversationSummaryAgentJoinsEnabled_1,
                                        interactionsEnabled: interactionsEnabled_1,
                                        useAgentLanguage: useAgentLanguage_1,
                                        autoEnabled: autoEnabled_1,
                                        allowTranslation: allowTranslation_1,
                                        fromCache: true,
                                    });
                                    return [2 /*return*/, copilotSettingFromCache];
                                }
                                attributeList = [
                                    CopilotCaseSummary.CopilotSummarizationSettingAttributes.Name,
                                    CopilotCaseSummary.CopilotSummarizationSettingAttributes.CopilotEnabled,
                                    CopilotCaseSummary.CopilotSummarizationSettingAttributes.CaseSummaryEnabled,
                                    CopilotCaseSummary.CopilotSummarizationSettingAttributes.ConversationSummaryOnDemandEnabled,
                                    CopilotCaseSummary.CopilotSummarizationSettingAttributes.ConversationSummaryConvEndsEnabled,
                                    CopilotCaseSummary.CopilotSummarizationSettingAttributes.ConversationSummaryAgentJoinsEnabled,
                                    CopilotCaseSummary.CopilotSummarizationSettingAttributes.InteractionsEnabled,
                                    CopilotCaseSummary.CopilotSummarizationSettingAttributes.UseAgentLanguage,
                                    CopilotCaseSummary.CopilotSummarizationSettingAttributes.AutoEnabled,
                                    CopilotCaseSummary.CopilotSummarizationSettingAttributes.CaseSummaryConfiguration,
                                    CopilotCaseSummary.CopilotSummarizationSettingAttributes.ConversationSummaryConfiguration,
                                    CopilotCaseSummary.CopilotSummarizationSettingAttributes.AllowTranslation,
                                    CopilotCaseSummary.CopilotSummarizationSettingAttributes.RelatedRecordConfiguration,
                                ];
                                return [4 /*yield*/, Xrm.WebApi.retrieveRecord(CopilotCaseSummary.CopilotSummarizationConstants.SettingEntityName, settingId, "?$select=".concat(attributeList.join(",")))];
                            case 2:
                                setting = _l.sent();
                                if (!setting) {
                                    timer({ success: false, error: "No settings record found." });
                                    throw "Error occurred when fetching copilot summarization settings record with id: ".concat(settingId);
                                }
                                copilotSetting = {
                                    name: setting[CopilotCaseSummary.CopilotSummarizationSettingAttributes.Name],
                                    copilotEnabled: (_a = setting[CopilotCaseSummary.CopilotSummarizationSettingAttributes.CopilotEnabled]) !== null && _a !== void 0 ? _a : false,
                                    caseSummaryEnabled: (_b = setting[CopilotCaseSummary.CopilotSummarizationSettingAttributes.CaseSummaryEnabled]) !== null && _b !== void 0 ? _b : false,
                                    conversationSummaryOnDemandEnabled: (_c = setting[CopilotCaseSummary.CopilotSummarizationSettingAttributes
                                        .ConversationSummaryOnDemandEnabled]) !== null && _c !== void 0 ? _c : false,
                                    conversationSummaryConvEndsEnabled: (_d = setting[CopilotCaseSummary.CopilotSummarizationSettingAttributes
                                        .ConversationSummaryConvEndsEnabled]) !== null && _d !== void 0 ? _d : false,
                                    conversationSummaryAgentJoinsEnabled: (_e = setting[CopilotCaseSummary.CopilotSummarizationSettingAttributes
                                        .ConversationSummaryAgentJoinsEnabled]) !== null && _e !== void 0 ? _e : false,
                                    interactionsEnabled: (_f = setting[CopilotCaseSummary.CopilotSummarizationSettingAttributes.InteractionsEnabled]) !== null && _f !== void 0 ? _f : false,
                                    useAgentLanguage: (_g = setting[CopilotCaseSummary.CopilotSummarizationSettingAttributes.UseAgentLanguage]) !== null && _g !== void 0 ? _g : true,
                                    autoEnabled: (_h = setting[CopilotCaseSummary.CopilotSummarizationSettingAttributes.AutoEnabled]) !== null && _h !== void 0 ? _h : false,
                                    caseSummaryConfiguration: setting[CopilotCaseSummary.CopilotSummarizationSettingAttributes.CaseSummaryConfiguration],
                                    relatedrecordconfiguration: (_j = tryParseJSON(setting[CopilotCaseSummary.CopilotSummarizationSettingAttributes.RelatedRecordConfiguration])) !== null && _j !== void 0 ? _j : undefined,
                                    conversationSummaryConfiguration: setting[CopilotCaseSummary.CopilotSummarizationSettingAttributes
                                        .ConversationSummaryConfiguration],
                                    allowTranslation: (_k = setting[CopilotCaseSummary.CopilotSummarizationSettingAttributes.AllowTranslation]) !== null && _k !== void 0 ? _k : true,
                                };
                                // save settings to cache
                                CopilotCaseSummary.setCachedItemByKey(cacheKey, copilotSetting);
                                copilotEnabled = copilotSetting.copilotEnabled, caseSummaryEnabled = copilotSetting.caseSummaryEnabled, conversationSummaryOnDemandEnabled = copilotSetting.conversationSummaryOnDemandEnabled, conversationSummaryConvEndsEnabled = copilotSetting.conversationSummaryConvEndsEnabled, conversationSummaryAgentJoinsEnabled = copilotSetting.conversationSummaryAgentJoinsEnabled, interactionsEnabled = copilotSetting.interactionsEnabled, useAgentLanguage = copilotSetting.useAgentLanguage, autoEnabled = copilotSetting.autoEnabled, allowTranslation = copilotSetting.allowTranslation;
                                timer({
                                    success: true,
                                    copilotEnabled: copilotEnabled,
                                    caseSummaryEnabled: caseSummaryEnabled,
                                    conversationSummaryOnDemandEnabled: conversationSummaryOnDemandEnabled,
                                    conversationSummaryConvEndsEnabled: conversationSummaryConvEndsEnabled,
                                    conversationSummaryAgentJoinsEnabled: conversationSummaryAgentJoinsEnabled,
                                    interactionsEnabled: interactionsEnabled,
                                    useAgentLanguage: useAgentLanguage,
                                    autoEnabled: autoEnabled,
                                    allowTranslation: allowTranslation,
                                    fromCache: false,
                                });
                                return [2 /*return*/, copilotSetting];
                            case 3:
                                error_2 = _l.sent();
                                timer({ success: false, error: error_2 });
                                throw error_2;
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
            CopilotCaseSummary.getCopilotSummarizationSetting = getCopilotSummarizationSetting;
            function isCopilotEnabledInAPM() {
                return __awaiter(this, void 0, void 0, function () {
                    var timeoutId, timeoutPromise, apmPromise;
                    return __generator(this, function (_a) {
                        timeoutId = undefined;
                        timeoutPromise = new Promise(function (resolve, reject) {
                            timeoutId = setTimeout(function () {
                                reject("Timed out while determining if APM has Copilot enabled.");
                            }, 120000);
                        });
                        apmPromise = fetchCopilotAPMConfig();
                        return [2 /*return*/, Promise.race([apmPromise, timeoutPromise]).finally(function () {
                                if (timeoutId)
                                    clearTimeout(timeoutId);
                            })];
                    });
                });
            }
            function fetchCopilotAPMConfig() {
                var _a;
                return __awaiter(this, void 0, void 0, function () {
                    var isMultiSession, appConfigUniqueName, appConfig, isCaseSummaryEnabled, error_3;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                isMultiSession = ((_a = Microsoft === null || Microsoft === void 0 ? void 0 : Microsoft.AppRuntime) === null || _a === void 0 ? void 0 : _a.Sessions) != null;
                                if (!isMultiSession)
                                    return [2 /*return*/, true];
                                appConfigUniqueName = undefined;
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 4, , 5]);
                                return [4 /*yield*/, getAppProfileConfig()];
                            case 2:
                                appConfig = _b.sent();
                                appConfigUniqueName = appConfig.AppConfigUniqueName;
                                return [4 /*yield*/, fetchCaseSummaryEnabledFromCopilotAPMConfig(appConfigUniqueName)];
                            case 3:
                                isCaseSummaryEnabled = _b.sent();
                                CopilotCaseSummary.Telemetry.logInfo(CopilotCaseSummary.TelemetryEvents.IsCopilotEnabledInAPM, "Copilot APM check succeeded.", { isCaseSummaryEnabled: isCaseSummaryEnabled, appConfigUniqueName: appConfigUniqueName });
                                return [2 /*return*/, isCaseSummaryEnabled];
                            case 4:
                                error_3 = _b.sent();
                                CopilotCaseSummary.Telemetry.logError(CopilotCaseSummary.TelemetryEvents.IsCopilotEnabledInAPM, "Failed to determine if Copilot is enabled in APM.", { error: error_3 });
                                throw error_3;
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            }
            /**
             * Fetches the app profile configuration for the user.
             * @returns app configuration
             */
            function getAppProfileConfig() {
                var _a, _b, _c;
                return __awaiter(this, void 0, void 0, function () {
                    var appConfiguration, appConfigUniqueName, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                _e.trys.push([0, 2, , 4]);
                                return [4 /*yield*/, ((_c = (_b = (_a = Microsoft === null || Microsoft === void 0 ? void 0 : Microsoft.AppRuntime) === null || _a === void 0 ? void 0 : _a.Utility) === null || _b === void 0 ? void 0 : _b.getEnvironment) === null || _c === void 0 ? void 0 : _c.call(_b))];
                            case 1:
                                appConfiguration = _e.sent();
                                appConfigUniqueName = appConfiguration === null || appConfiguration === void 0 ? void 0 : appConfiguration.AppConfigName;
                                if (!appConfigUniqueName)
                                    throw "Could not find app config unique name in environment.";
                                CopilotCaseSummary.Telemetry.logInfo(CopilotCaseSummary.TelemetryEvents.GetAppProfileConfiguration, "Fetched app configuration from environment.", { source: "environment", appConfigUniqueName: appConfigUniqueName });
                                return [2 /*return*/, { AppConfigUniqueName: appConfigUniqueName }];
                            case 2:
                                _d = _e.sent();
                                return [4 /*yield*/, getAppConfigFromPlugin()];
                            case 3: return [2 /*return*/, _e.sent()];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
            function getAppConfigFromPlugin() {
                return __awaiter(this, void 0, void 0, function () {
                    var getAppConfigActionRequest, configs, config, appConfigUniqueName;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                getAppConfigActionRequest = {
                                    AppUniqueName: "msdyn_CustomerServiceWorkspace",
                                    UserId: Xrm.Utility.getGlobalContext().userSettings.userId,
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
                                return [4 /*yield*/, Xrm.WebApi.online
                                        .execute(getAppConfigActionRequest)
                                        .then(function (response) {
                                        return response.json();
                                    })
                                        .then(function (data) {
                                        return tryParseJSON(data === null || data === void 0 ? void 0 : data.AppConfigurations);
                                    })];
                            case 1:
                                configs = _a.sent();
                                config = Object.values(configs)[0];
                                appConfigUniqueName = config === null || config === void 0 ? void 0 : config.AppConfigUniqueName;
                                if (!appConfigUniqueName)
                                    throw "Could not find app config unique name in context plugin.";
                                CopilotCaseSummary.Telemetry.logInfo(CopilotCaseSummary.TelemetryEvents.GetAppProfileConfiguration, "Fetched app configuration from plugin.", { source: "plugin", appConfigUniqueName: appConfigUniqueName });
                                return [2 /*return*/, { AppConfigUniqueName: appConfigUniqueName }];
                        }
                    });
                });
            }
            function fetchCaseSummaryEnabledFromCopilotAPMConfig(appConfigUniqueName) {
                return __awaiter(this, void 0, void 0, function () {
                    var copilotConfigparams, copilotConfigEnabled;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                copilotConfigparams = "?$filter=msdyn_appconfigurationid/msdyn_uniquename eq '".concat(appConfigUniqueName, "' and msdyn_copilotfeature eq ").concat(CopilotCaseSummary.CopilotFeatures.CaseSummary);
                                return [4 /*yield*/, Xrm.WebApi.retrieveMultipleRecords("msdyn_appcopilotconfiguration", copilotConfigparams).then(function (response) {
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
            }
            function tryParseJSON(jsonString) {
                // eslint-disable-line @typescript-eslint/no-explicit-any
                try {
                    if (jsonString === undefined) {
                        throw "passed json string is undefined";
                    }
                    var jsonData = JSON.parse(jsonString);
                    // Handle non-exception-throwing cases:
                    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
                    // but... JSON.parse(null) returns null, and typeof null === "object",
                    // so we must check for that, too. null is falsey, so this suffices:
                    if (jsonData && typeof jsonData === "object") {
                        return jsonData;
                    }
                }
                catch (e) {
                    return false;
                }
                return false;
            }
        })(CopilotCaseSummary = CSIntelligence.CopilotCaseSummary || (CSIntelligence.CopilotCaseSummary = {}));
    })(CSIntelligence = Mscrm.CSIntelligence || (Mscrm.CSIntelligence = {}));
})(Mscrm || (Mscrm = {}));
//# sourceMappingURL=msdyn_CopilotCaseSummaryLibrary.js.map