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
var CMA;
(function (CMA) {
    var _a, _b;
    // ─── Telemetry ────────────────────────────────────────────────────────────
    var _operationTimers = new Map();
    var _componentName = "CMAWebresource";
    function toTelemetryArray(params) {
        var result = [];
        for (var key in params) {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
                result.push({ name: key, value: params[key] });
            }
        }
        return result;
    }
    var GetFCSWithUserContextRequest = /** @class */ (function () {
        function GetFCSWithUserContextRequest(input) {
            this.msdyn_GetFCSWithUserContextInput = input;
        }
        GetFCSWithUserContextRequest.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {
                    msdyn_GetFCSWithUserContextInput: {
                        typeName: "Edm.String",
                        structuralProperty: 1,
                    },
                },
                operationType: 0,
                operationName: "msdyn_GetFCSWithUserContext",
            };
        };
        return GetFCSWithUserContextRequest;
    }());
    // Unbound-action request for the msdyn_AIAgentAction custom API (the supervisor verb router).
    var AIAgentActionRequest = /** @class */ (function () {
        function AIAgentActionRequest(caseId, requestedAction, sourceForLog) {
            this.Entity = { entityType: EntityNames.Incident, id: caseId };
            this.RequestedAction = requestedAction;
            this.SourceForLog = sourceForLog;
        }
        AIAgentActionRequest.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {
                    Entity: { typeName: "mscrm.incident", structuralProperty: 5 },
                    RequestedAction: { typeName: "Edm.String", structuralProperty: 1 },
                    SourceForLog: { typeName: "Edm.String", structuralProperty: 1 },
                },
                operationType: 0,
                operationName: AIAgentActionApi,
            };
        };
        return AIAgentActionRequest;
    }());
    function logEventStart(operationName, extraParams) {
        if (extraParams === void 0) { extraParams = {}; }
        _operationTimers.set(operationName, Date.now());
        reportSuccess(__assign({ operationName: operationName, status: "started", timestamp: Date.now() }, extraParams));
    }
    function logEventEnd(operationName, extraParams, success) {
        if (extraParams === void 0) { extraParams = {}; }
        if (success === void 0) { success = true; }
        var start = _operationTimers.get(operationName);
        if (start) {
            var durationMs = Date.now() - start;
            _operationTimers.delete(operationName);
            reportSuccess(__assign({ operationName: operationName, status: "ended", durationMs: durationMs, timestamp: Date.now(), success: success }, extraParams));
        }
        else {
            reportFailure(new Error("No start time found for operation \"".concat(operationName, "\". Cannot log duration.")), { operationName: operationName });
        }
    }
    function reportSuccess(params) {
        var _a;
        var telemetryParams = toTelemetryArray(params);
        (_a = Xrm === null || Xrm === void 0 ? void 0 : Xrm.Reporting) === null || _a === void 0 ? void 0 : _a.reportSuccess(_componentName, telemetryParams);
    }
    function reportFailure(error, params, suggestedMitigation) {
        var _a;
        if (params === void 0) { params = {}; }
        if (suggestedMitigation === void 0) { suggestedMitigation = ""; }
        var telemetryParams = toTelemetryArray(params);
        (_a = Xrm === null || Xrm === void 0 ? void 0 : Xrm.Reporting) === null || _a === void 0 ? void 0 : _a.reportFailure(_componentName, error, suggestedMitigation, telemetryParams);
    }
    // ─────────────────────────────────────────────────────────────────────────
    var Operations = {
        ShouldShowEscalateCMA: "ShouldShowEscalateCMA",
        ShouldShowEscalateMultipleCMA: "ShouldShowEscalateMultipleCMA",
        ShouldShowResumeCMA: "ShouldShowResumeCMA",
        UserLevelFCSCheck: "UserLevelFCSCheck",
        EscalateSingleCMA: "EscalateSingleCMA",
        EscalateSingleCMATotal: "EscalateSingleCMA_Total",
        EscalateMultipleCMA: "EscalateMultipleCMA",
        EscalateMultipleCMATotal: "EscalateMultipleCMA_Total",
        BulkIncidentDataRetrieval: "EscalateMultipleCMAIncidentDataRetrieval",
        BulkEscalateUpdates: "EscalateMultipleCMABulkUpdates",
        ShouldShowStopCRA: "ShouldShowStopCRA",
        ShouldShowStopMultipleCRA: "ShouldShowStopMultipleCRA",
        StopSingleCRA: "StopSingleCRA",
        StopSingleCRATotal: "StopSingleCRA_Total",
        StopMultipleCRA: "StopMultipleCRA",
        StopMultipleCRATotal: "StopMultipleCRA_Total",
        BulkStopIncidentDataRetrieval: "StopMultipleCRAIncidentDataRetrieval",
        BulkStopUpdates: "StopMultipleCRABulkUpdates",
    };
    var LocalizationKeys = {
        LimitExceededTitle: "EscalateMultipleLimitExceededTitle",
        LimitExceededText: "EscalateMultipleLimitExceededText",
        PartialIssueTitle: "EscalateMultiplePartialIssueTitle",
        AllSkippedTitle: "EscalateMultipleAllSkippedTitle",
        SkippedCasesText: "EscalateMultipleSkippedCasesText",
        FailedCasesText: "EscalateMultipleFailedCasesText",
        SuccessCountZeroText: "EscalateMultipleSuccessCountZeroText",
        SuccessCountSingularText: "EscalateMultipleSuccessCountSingularText",
        SuccessCountPluralText: "EscalateMultipleSuccessCountPluralText",
        ProgressMessage: "EscalateMultipleProgressMessage",
    };
    var EntityNames = {
        AIAgentStatus: "msdyn_aiagentstatus",
        Incident: "incident",
    };
    // msdyn_AIAgentAction wiring. User-facing Stop strings are full-sentence localized templates (no {action} injection).
    var AIAgentActionApi = "msdyn_AIAgentAction";
    var SupervisorSource = "Supervisor";
    // Sent as the integer option value in string form: Dataverse exposes this custom-API request Picklist as Edm.String (Stop = 1).
    var RequestedActionValues = {
        Stop: "1",
    };
    // AI-agent-action response contract (must match AIAgentActionConstants on the server).
    var AIAgentActionOutputParams = {
        Outcome: "Outcome",
        Reason: "Reason",
    };
    var SupervisorOutcomes = {
        Allow: "Allow",
        NoOp: "NoOp",
        Skipped: "Skipped",
        // Client-synthesized marker (not a server Outcome): tags a per-case failure so it routes to the single-case failure dialog.
        Reject: "Reject",
    };
    var SupervisorReasons = {
        AlreadyStopped: "AlreadyStopped",
        IgnoredShadow: "IgnoredShadow",
        NoStatusRecord: "NoStatusRecord",
        // An in-flight (InProgress) run is not stoppable — the server absorbs the Stop as an informative no-op.
        BlockedInProgress: "BlockedInProgress",
        // The case is resolved/cancelled (inactive) — the server skips the Stop and leaves the AI agent untouched.
        InactiveCase: "InactiveCase",
        // Skip reasons with no single-case dialog; humanized only in the bulk skipped list.
        IncompleteStatusRecord: "IncompleteStatusRecord",
        FcsOff: "FcsOff",
    };
    // Localized-label resx keys for humanizing server reason tokens. AgentBusy is shared by Stop's BlockedInProgress and Escalate's LockedInProgress.
    var SupervisorReasonKeys = {
        InactiveCase: "SupervisorReasonInactiveCase",
        NoStatusRecord: "SupervisorReasonNoStatusRecord",
        IncompleteStatusRecord: "SupervisorReasonIncompleteStatusRecord",
        FcsOff: "SupervisorReasonFcsOff",
        IgnoredShadow: "SupervisorReasonIgnoredShadow",
        AgentBusy: "SupervisorReasonAgentBusy",
        AlreadyStopped: "SupervisorReasonAlreadyStopped",
    };
    var StopLocalizationKeys = {
        LimitExceededTitle: "SupervisorLimitExceededTitle",
        LimitExceededText: "SupervisorLimitExceededText",
        PartialIssueTitle: "SupervisorPartialIssueTitle",
        AllSkippedTitle: "SupervisorAllSkippedTitle",
        SkippedCasesText: "SupervisorSkippedCasesText",
        // bug 6560393: server-skipped cases (they HAVE a status record) get a distinct label from client-detected no-status cases.
        ServerSkippedCasesText: "SupervisorServerSkippedCasesText",
        FailedCasesText: "SupervisorFailedCasesText",
        SuccessCountZeroText: "SupervisorSuccessCountZeroText",
        SuccessCountSingularText: "SupervisorSuccessCountSingularText",
        SuccessCountPluralText: "SupervisorSuccessCountPluralText",
        ProgressMessage: "SupervisorProgressMessage",
        SingleProgressMessage: "SupervisorSingleProgressMessage",
        SingleSuccess: "SupervisorSingleSuccess",
        SingleSuccessTitle: "SupervisorSingleSuccessTitle",
        SingleFailure: "SupervisorSingleFailure",
        SingleFailureTitle: "SupervisorSingleFailureTitle",
        BulkSuccessTitle: "SupervisorBulkSuccessTitle",
        SingleAlreadyStoppedTitle: "SupervisorSingleAlreadyStoppedTitle",
        SingleAlreadyStoppedText: "SupervisorSingleAlreadyStoppedText",
        SingleShadowTitle: "SupervisorSingleShadowTitle",
        SingleShadowText: "SupervisorSingleShadowText",
        SingleNoStatusTitle: "SupervisorSingleNoStatusTitle",
        SingleNoStatusText: "SupervisorSingleNoStatusText",
        SingleInProgressTitle: "SupervisorSingleInProgressTitle",
        SingleInProgressText: "SupervisorSingleInProgressText",
        SingleInactiveTitle: "SupervisorSingleInactiveTitle",
        SingleInactiveText: "SupervisorSingleInactiveText",
        SingleNotAppliedTitle: "SupervisorSingleNotAppliedTitle",
        SingleNotAppliedText: "SupervisorSingleNotAppliedText",
    };
    var CMALibrary = /** @class */ (function () {
        function CMALibrary() {
        }
        // Sends the incident + Stop verb; the server derives the target and returns the transition decision.
        CMALibrary.invokeSetAIAgentStatus = function (caseId) {
            return __awaiter(this, void 0, void 0, function () {
                var request, response, apiResult, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            request = new AIAgentActionRequest(caseId, RequestedActionValues.Stop, SupervisorSource);
                            return [4 /*yield*/, Xrm.WebApi.online.execute(request)];
                        case 1:
                            response = _b.sent();
                            if (!(response === null || response === void 0 ? void 0 : response.ok)) return [3 /*break*/, 3];
                            return [4 /*yield*/, response.json()];
                        case 2:
                            apiResult = _b.sent();
                            return [2 /*return*/, {
                                    outcome: (apiResult && apiResult[AIAgentActionOutputParams.Outcome]) || "",
                                    reason: (apiResult && apiResult[AIAgentActionOutputParams.Reason]) || "",
                                }];
                        case 3:
                            _a = Error.bind;
                            return [4 /*yield*/, CMALibrary.extractResponseError(response)];
                        case 4: 
                        // Xrm.WebApi.execute resolves (doesn't reject) on non-2xx; returning empty would show a false success (bug 6560158), so throw.
                        throw new (_a.apply(Error, [void 0, _b.sent()]))();
                    }
                });
            });
        };
        // Routes a single-case Stop decision to its dialog: Reject → failure; Allow → silent success; NoOp/Skipped → informative.
        CMALibrary.showStopOutcomeDialog = function (result) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(result.outcome === SupervisorOutcomes.Reject)) return [3 /*break*/, 2];
                            return [4 /*yield*/, Xrm.Navigation.openAlertDialog({
                                    title: CMALibrary.getLocalizedString(StopLocalizationKeys.SingleFailureTitle),
                                    text: CMALibrary.getLocalizedString(StopLocalizationKeys.SingleFailure, { reason: result.reason }),
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                        case 2:
                            if (!(result.outcome === SupervisorOutcomes.NoOp)) return [3 /*break*/, 10];
                            if (!(result.reason === SupervisorReasons.AlreadyStopped)) return [3 /*break*/, 4];
                            return [4 /*yield*/, Xrm.Navigation.openAlertDialog({
                                    title: CMALibrary.getLocalizedString(StopLocalizationKeys.SingleAlreadyStoppedTitle),
                                    text: CMALibrary.getLocalizedString(StopLocalizationKeys.SingleAlreadyStoppedText),
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                        case 4:
                            if (!(result.reason === SupervisorReasons.IgnoredShadow)) return [3 /*break*/, 6];
                            return [4 /*yield*/, Xrm.Navigation.openAlertDialog({
                                    title: CMALibrary.getLocalizedString(StopLocalizationKeys.SingleShadowTitle),
                                    text: CMALibrary.getLocalizedString(StopLocalizationKeys.SingleShadowText),
                                })];
                        case 5:
                            _a.sent();
                            return [2 /*return*/];
                        case 6:
                            if (!(result.reason === SupervisorReasons.BlockedInProgress)) return [3 /*break*/, 8];
                            return [4 /*yield*/, Xrm.Navigation.openAlertDialog({
                                    title: CMALibrary.getLocalizedString(StopLocalizationKeys.SingleInProgressTitle),
                                    text: CMALibrary.getLocalizedString(StopLocalizationKeys.SingleInProgressText),
                                })];
                        case 7:
                            _a.sent();
                            return [2 /*return*/];
                        case 8: return [4 /*yield*/, Xrm.Navigation.openAlertDialog({
                                title: CMALibrary.getLocalizedString(StopLocalizationKeys.SingleNotAppliedTitle),
                                text: CMALibrary.getLocalizedString(StopLocalizationKeys.SingleNotAppliedText),
                            })];
                        case 9:
                            _a.sent();
                            return [2 /*return*/];
                        case 10:
                            if (!(result.outcome === SupervisorOutcomes.Skipped)) return [3 /*break*/, 16];
                            if (!(result.reason === SupervisorReasons.NoStatusRecord)) return [3 /*break*/, 12];
                            return [4 /*yield*/, Xrm.Navigation.openAlertDialog({
                                    title: CMALibrary.getLocalizedString(StopLocalizationKeys.SingleNoStatusTitle),
                                    text: CMALibrary.getLocalizedString(StopLocalizationKeys.SingleNoStatusText),
                                })];
                        case 11:
                            _a.sent();
                            return [2 /*return*/];
                        case 12:
                            if (!(result.reason === SupervisorReasons.InactiveCase)) return [3 /*break*/, 14];
                            return [4 /*yield*/, Xrm.Navigation.openAlertDialog({
                                    title: CMALibrary.getLocalizedString(StopLocalizationKeys.SingleInactiveTitle),
                                    text: CMALibrary.getLocalizedString(StopLocalizationKeys.SingleInactiveText),
                                })];
                        case 13:
                            _a.sent();
                            return [2 /*return*/];
                        case 14: return [4 /*yield*/, Xrm.Navigation.openAlertDialog({
                                title: CMALibrary.getLocalizedString(StopLocalizationKeys.SingleNotAppliedTitle),
                                text: CMALibrary.getLocalizedString(StopLocalizationKeys.SingleNotAppliedText),
                            })];
                        case 15:
                            _a.sent();
                            return [2 /*return*/];
                        case 16: 
                        // Allow/unknown keeps the success confirmation (bug 6560363).
                        return [4 /*yield*/, Xrm.Navigation.openAlertDialog({
                                title: CMALibrary.getLocalizedString(StopLocalizationKeys.SingleSuccessTitle),
                                text: CMALibrary.getLocalizedString(StopLocalizationKeys.SingleSuccess),
                            })];
                        case 17:
                            // Allow/unknown keeps the success confirmation (bug 6560363).
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // Bulk classification: only a genuine Allow counts as a stop; NoOp/Skipped roll into the skipped bucket.
        CMALibrary.classifyBulkStopOutcome = function (result) {
            return (result.outcome === SupervisorOutcomes.NoOp || result.outcome === SupervisorOutcomes.Skipped) ? "skipped" : "success";
        };
        CMALibrary.getCurrentIncidentId = function () {
            try {
                var id = Xrm.Page.data.entity.getId();
                return id ? id.replace("{", "").replace("}", "") : undefined;
            }
            catch (error) {
                console.error("Error in getCurrentIncidentId: ", error);
                return undefined;
            }
        };
        // Reads the OData error message from a failed response body.
        CMALibrary.extractResponseError = function (response) {
            return __awaiter(this, void 0, void 0, function () {
                var errorBody, parseError_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, response.json()];
                        case 1:
                            errorBody = _a.sent();
                            return [2 /*return*/, (errorBody && errorBody.error && errorBody.error.message) || ""];
                        case 2:
                            parseError_1 = _a.sent();
                            console.error("Error parsing failed AI agent action response: ", parseError_1);
                            return [2 /*return*/, ""];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        CMALibrary.extractServerReason = function (error) {
            var err = error;
            return err && (err.message || err.Message) ? (err.message || err.Message) : "";
        };
        CMALibrary.getStopIssueTitle = function (successfulStopsCount) {
            return CMALibrary.getLocalizedString(successfulStopsCount > 0 ? StopLocalizationKeys.PartialIssueTitle : StopLocalizationKeys.AllSkippedTitle);
        };
        CMALibrary.getStopIssueText = function (incidentsWithoutStatus, serverSkippedUpdates, failedUpdates, successfulStopsCount) {
            var sections = [
                CMALibrary.getLocalizedString(successfulStopsCount === 0
                    ? StopLocalizationKeys.SuccessCountZeroText
                    : successfulStopsCount === 1
                        ? StopLocalizationKeys.SuccessCountSingularText
                        : StopLocalizationKeys.SuccessCountPluralText, { caseCount: successfulStopsCount.toString() }),
            ];
            // Client-detected: these cases had no AI agent status record at all.
            if (incidentsWithoutStatus.length > 0) {
                sections.push(CMALibrary.getLocalizedString(StopLocalizationKeys.SkippedCasesText, {
                    caseList: CMALibrary.getCaseListSummary(incidentsWithoutStatus),
                }));
            }
            // Server-skipped cases have a status record; distinct label (bug 6560393).
            if (serverSkippedUpdates.length > 0) {
                sections.push(CMALibrary.getLocalizedString(StopLocalizationKeys.ServerSkippedCasesText, {
                    caseList: CMALibrary.getCaseListSummary(serverSkippedUpdates),
                }));
            }
            if (failedUpdates.length > 0) {
                sections.push(CMALibrary.getLocalizedString(StopLocalizationKeys.FailedCasesText, {
                    caseList: CMALibrary.getCaseListSummary(failedUpdates),
                }));
            }
            return sections.join("\n\n");
        };
        CMALibrary.isFCSEnabledWithUserFallback = function (namespaceName, featureControlName, userLevelGateName) {
            return __awaiter(this, void 0, void 0, function () {
                var isEnabledAtOrg, isUserLevelGateEnabled;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            isEnabledAtOrg = Xrm.Utility.getGlobalContext().getFeatureControlSetting(namespaceName, featureControlName);
                            if (isEnabledAtOrg) {
                                return [2 /*return*/, true];
                            }
                            isUserLevelGateEnabled = Xrm.Utility.getGlobalContext().getFeatureControlSetting(namespaceName, userLevelGateName);
                            if (!isUserLevelGateEnabled) {
                                return [2 /*return*/, false];
                            }
                            return [4 /*yield*/, CMALibrary.isFCSEnabledAtUserLevel(namespaceName, featureControlName)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        CMALibrary.isFCSEnabledAtUserLevel = function (namespaceName, featureControlName) {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var currentUserId, sessionStorageKey, cached, cachedValue, additionalFilters_1, additionalFilterKeys, inputParameters, request, response, apiResult, featureControlSettingsMap, namespacedKey, result, fallback, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 4, , 5]);
                            currentUserId = Xrm.Utility.getGlobalContext().getUserId();
                            sessionStorageKey = "feature_".concat(featureControlName, "_").concat(currentUserId || "");
                            cached = sessionStorage.getItem(sessionStorageKey);
                            if (cached !== null) {
                                cachedValue = cached === "true";
                                reportSuccess({ operation: Operations.UserLevelFCSCheck, Message: "UserLevelFCSCheck is found in cache, returning cached value", featureControlName: featureControlName, cacheHit: true, result: cachedValue });
                                return [2 /*return*/, cachedValue];
                            }
                            logEventStart(Operations.UserLevelFCSCheck, { featureControlName: featureControlName, namespaceName: namespaceName });
                            additionalFilters_1 = {};
                            if (currentUserId) {
                                additionalFilters_1["userId"] = currentUserId;
                            }
                            additionalFilterKeys = Object.keys(additionalFilters_1);
                            inputParameters = {
                                NamespaceName: namespaceName,
                                FeatureControlNames: [featureControlName],
                                AdditionalFilterKeys: additionalFilterKeys,
                                AdditionalFilterValues: additionalFilterKeys.map(function (k) { return additionalFilters_1[k]; }),
                            };
                            request = new GetFCSWithUserContextRequest(JSON.stringify(inputParameters));
                            if (!((_a = Xrm.WebApi) === null || _a === void 0 ? void 0 : _a.online)) return [3 /*break*/, 3];
                            return [4 /*yield*/, Xrm.WebApi.online.execute(request)];
                        case 1:
                            response = _b.sent();
                            if (!(response === null || response === void 0 ? void 0 : response.ok)) return [3 /*break*/, 3];
                            return [4 /*yield*/, response.json()];
                        case 2:
                            apiResult = _b.sent();
                            featureControlSettingsMap = JSON.parse((apiResult === null || apiResult === void 0 ? void 0 : apiResult.msdyn_GetFCSWithUserContextOutput) || "{}");
                            namespacedKey = "".concat(namespaceName.toLowerCase(), ".").concat(featureControlName.toLowerCase());
                            result = false;
                            if (featureControlSettingsMap[namespacedKey]) {
                                result = featureControlSettingsMap[namespacedKey].Value === true;
                            }
                            reportSuccess({
                                operation: Operations.UserLevelFCSCheck,
                                Message: "UserLevelFCSCheck is not found in cache, returning API result",
                                featureControlName: featureControlName,
                                cacheHit: false,
                                result: result,
                            });
                            sessionStorage.setItem(sessionStorageKey, String(result));
                            logEventEnd(Operations.UserLevelFCSCheck, { featureControlName: featureControlName, result: result, cacheHit: false });
                            return [2 /*return*/, result];
                        case 3:
                            fallback = !!Xrm.Utility.getGlobalContext().getFeatureControlSetting(namespaceName, featureControlName);
                            reportSuccess({ operation: Operations.UserLevelFCSCheck, featureControlName: featureControlName, Message: "UserLevelFCSCheck api call failed, falling back to org-level result", fallbackResult: fallback });
                            logEventEnd(Operations.UserLevelFCSCheck, { featureControlName: featureControlName, result: fallback, fallback: true }, false);
                            return [2 /*return*/, fallback];
                        case 4:
                            error_1 = _b.sent();
                            if (_operationTimers.has(Operations.UserLevelFCSCheck)) {
                                logEventEnd(Operations.UserLevelFCSCheck, { featureControlName: featureControlName, Message: "UserLevelFCSCheck failed with an unhandled error" }, false);
                            }
                            reportFailure(error_1, { operation: Operations.UserLevelFCSCheck, featureControlName: featureControlName, Message: "Unhandled error in isFCSEnabledAtUserLevel" });
                            console.error("[CMA:isFCSEnabledAtUserLevel] Error, falling back to org-level check", error_1);
                            // Fallback to org-level check on exception
                            return [2 /*return*/, !!Xrm.Utility.getGlobalContext().getFeatureControlSetting(namespaceName, featureControlName)];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        CMALibrary.checkUserEntityPrivilege = function (entityLogicalName, accessType) {
            return __awaiter(this, void 0, void 0, function () {
                var privilegeName, privilegeNameLower, rolePrivileges, guid, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            privilegeName = "prv".concat(accessType).concat(entityLogicalName);
                            privilegeNameLower = privilegeName.toLowerCase();
                            return [4 /*yield*/, Xrm.Utility.getGlobalContext().userSettings.getSecurityRolePrivilegesInfo()];
                        case 1:
                            rolePrivileges = _a.sent();
                            for (guid in rolePrivileges) {
                                if (Object.prototype.hasOwnProperty.call(rolePrivileges, guid) &&
                                    rolePrivileges[guid].privilegeName.toLowerCase() === privilegeNameLower) {
                                    return [2 /*return*/, true];
                                }
                            }
                            return [2 /*return*/, false];
                        case 2:
                            error_2 = _a.sent();
                            reportFailure(error_2, {
                                operation: "checkUserEntityPrivilege",
                                entityLogicalName: entityLogicalName,
                                accessType: accessType,
                                Message: "Error retrieving user security role privileges",
                            });
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        CMALibrary.getAIAgentStatusId = function (primaryRecordId) {
            var _a, _b, _d;
            return __awaiter(this, void 0, void 0, function () {
                var record, incidentId, incidentRecord, recordId;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            record = (_d = (_b = (_a = Xrm.Page.getAttribute(EntityNames.AIAgentStatus)) === null || _a === void 0 ? void 0 : _a.getValue()) === null || _b === void 0 ? void 0 : _b[0]) === null || _d === void 0 ? void 0 : _d.id;
                            if (!!record) return [3 /*break*/, 2];
                            incidentId = primaryRecordId || Xrm.Page.data.entity.getId().replace("{", "").replace("}", "");
                            return [4 /*yield*/, Xrm.WebApi.retrieveRecord(EntityNames.Incident, incidentId, "?$select=_msdyn_aiagentstatus_value")];
                        case 1:
                            incidentRecord = _e.sent();
                            record = incidentRecord._msdyn_aiagentstatus_value;
                            if (!record) {
                                return [2 /*return*/, undefined];
                            }
                            _e.label = 2;
                        case 2:
                            recordId = record.replace("{", "").replace("}", "");
                            return [2 /*return*/, recordId];
                    }
                });
            });
        };
        CMALibrary.getBulkIncidentRecords = function (incidentIds) {
            return __awaiter(this, void 0, void 0, function () {
                var values, fetchXml, result, incidentRecords, _loop_1, _i, incidentIds_1, incidentId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            values = incidentIds.map(function (incidentId) { return "<value>".concat(incidentId, "</value>"); }).join("");
                            fetchXml = "<fetch><entity name='incident'><attribute name='incidentid'/><attribute name='ticketnumber'/><attribute name='msdyn_aiagentstatus'/><filter type='and'><condition attribute='incidentid' operator='in'>".concat(values, "</condition></filter></entity></fetch>");
                            return [4 /*yield*/, Xrm.WebApi.retrieveMultipleRecords(EntityNames.Incident, "?fetchXml=".concat(encodeURIComponent(fetchXml)))];
                        case 1:
                            result = _a.sent();
                            incidentRecords = (result === null || result === void 0 ? void 0 : result.entities) || [];
                            _loop_1 = function (incidentId) {
                                if (!incidentRecords.find(function (incidentRecord) { return incidentRecord.incidentid === incidentId; })) {
                                    incidentRecords.push({
                                        incidentid: incidentId,
                                        ticketnumber: incidentId
                                    });
                                }
                            };
                            for (_i = 0, incidentIds_1 = incidentIds; _i < incidentIds_1.length; _i++) {
                                incidentId = incidentIds_1[_i];
                                _loop_1(incidentId);
                            }
                            return [2 /*return*/, incidentRecords.map(function (incidentRecord) { return ({
                                    incidentId: incidentRecord.incidentid,
                                    ticketNumber: incidentRecord.ticketnumber || incidentRecord.incidentid,
                                    aiAgentStatusId: incidentRecord._msdyn_aiagentstatus_value
                                }); })];
                    }
                });
            });
        };
        CMALibrary.getEscalatedStatusData = function (escalatedOn) {
            return {
                "msdyn_currentaistatus": "Escalated",
                "statecode": 1,
                "statuscode": 2 /* AIAgentStatusCode.Escalated */,
                "msdyn_fallbackreason": 10,
                "msdyn_escalatedon": escalatedOn
            };
        };
        CMALibrary.getEscalationIssueTitle = function (compatibleCaseCount) {
            return CMALibrary.getLocalizedString(compatibleCaseCount > 0
                ? LocalizationKeys.PartialIssueTitle
                : LocalizationKeys.AllSkippedTitle);
        };
        CMALibrary.getEscalationIssueText = function (incidentsWithoutStatus, failedUpdates, successfulEscalationsCount) {
            var sections = [
                CMALibrary.getLocalizedString(successfulEscalationsCount === 0
                    ? LocalizationKeys.SuccessCountZeroText
                    : successfulEscalationsCount === 1
                        ? LocalizationKeys.SuccessCountSingularText
                        : LocalizationKeys.SuccessCountPluralText, {
                    caseCount: successfulEscalationsCount.toString()
                })
            ];
            if (incidentsWithoutStatus.length > 0) {
                sections.push(CMALibrary.getLocalizedString(LocalizationKeys.SkippedCasesText, {
                    caseList: CMALibrary.getCaseListSummary(incidentsWithoutStatus)
                }));
            }
            if (failedUpdates.length > 0) {
                sections.push(CMALibrary.getLocalizedString(LocalizationKeys.FailedCasesText, {
                    caseList: CMALibrary.getCaseListSummary(failedUpdates)
                }));
            }
            return sections.join("\n\n");
        };
        // Humanizes a per-case reason: known token → localized label; bare PascalCase → space-split; free-form sentence → unchanged.
        CMALibrary.getReasonLabel = function (reason) {
            if (!reason) {
                return reason;
            }
            var labelKey = CMALibrary.supervisorReasonLabelKeys[reason];
            if (labelKey) {
                return CMALibrary.getLocalizedString(labelKey);
            }
            if (/^[A-Za-z]+$/.test(reason) && /[a-z][A-Z]/.test(reason)) {
                return reason.replace(/([a-z])([A-Z])/g, "$1 $2");
            }
            return reason;
        };
        CMALibrary.getCaseListSummary = function (caseRecords) {
            return caseRecords
                .map(function (caseRecord) {
                var label = caseRecord.ticketNumber || caseRecord.incidentId;
                return caseRecord.reason ? "".concat(label, " \u2014 ").concat(CMALibrary.getReasonLabel(caseRecord.reason)) : label;
            })
                .join("\n");
        };
        CMALibrary.getLocalizedString = function (key, replacements) {
            var localizedValue = Xrm.Utility.getResourceString(CMALibrary.localizedResourceName, key);
            if (!localizedValue) {
                localizedValue = CMALibrary.localizedStringDefaults[key] || key;
            }
            if (!replacements) {
                return localizedValue;
            }
            for (var replacementKey in replacements) {
                if (Object.prototype.hasOwnProperty.call(replacements, replacementKey)) {
                    localizedValue = localizedValue.split("{".concat(replacementKey, "}")).join(replacements[replacementKey]);
                }
            }
            return localizedValue;
        };
        var _c;
        _c = CMALibrary;
        // Fallback bulk cap when the MaxBulkSupervisorActionCount FCS is missing/invalid.
        CMALibrary.defaultMaxBulkActionCount = 10;
        CMALibrary.maxBulkActionCountFcsKey = "MaxBulkSupervisorActionCount";
        CMALibrary.localizedResourceName = "msdyn_CaseManagementIntelligence/Localization/Languages/CMALocResource";
        CMALibrary.localizedStringDefaults = (_a = {},
            _a[LocalizationKeys.LimitExceededTitle] = "Unable to escalate cases",
            _a[LocalizationKeys.LimitExceededText] = "You can escalate a maximum of {maxCount} cases at a time. You selected {selectedCount}. Remove some cases and try again.",
            _a[LocalizationKeys.PartialIssueTitle] = "Unable to escalate some cases",
            _a[LocalizationKeys.AllSkippedTitle] = "Unable to escalate selected cases",
            _a[LocalizationKeys.SkippedCasesText] = "Skipped cases without an AI Agent status record:\n{caseList}",
            _a[LocalizationKeys.FailedCasesText] = "Failed to escalate cases:\n{caseList}",
            _a[LocalizationKeys.SuccessCountZeroText] = "No cases were escalated",
            _a[LocalizationKeys.SuccessCountSingularText] = "Successfully escalated {caseCount} case",
            _a[LocalizationKeys.SuccessCountPluralText] = "Successfully escalated {caseCount} cases",
            _a[LocalizationKeys.ProgressMessage] = "Escalating selected cases",
            _a[StopLocalizationKeys.LimitExceededTitle] = "Too many cases selected",
            _a[StopLocalizationKeys.LimitExceededText] = "You can stop a maximum of {maxCount} cases at a time. You selected {selectedCount}. Remove some cases and try again.",
            _a[StopLocalizationKeys.PartialIssueTitle] = "Some cases were not stopped",
            _a[StopLocalizationKeys.AllSkippedTitle] = "No cases were stopped",
            _a[StopLocalizationKeys.SkippedCasesText] = "Skipped cases (no applicable AI Agent status):\n{caseList}",
            _a[StopLocalizationKeys.ServerSkippedCasesText] = "Skipped cases (already stopped or not applicable):\n{caseList}",
            _a[StopLocalizationKeys.FailedCasesText] = "Failed cases:\n{caseList}",
            _a[StopLocalizationKeys.SuccessCountZeroText] = "No cases were stopped",
            _a[StopLocalizationKeys.SuccessCountSingularText] = "Successfully stopped {caseCount} case",
            _a[StopLocalizationKeys.SuccessCountPluralText] = "Successfully stopped {caseCount} cases",
            _a[StopLocalizationKeys.ProgressMessage] = "Stopping the selected cases",
            _a[StopLocalizationKeys.SingleProgressMessage] = "Stopping the case",
            _a[StopLocalizationKeys.SingleSuccess] = "The case was stopped.",
            _a[StopLocalizationKeys.SingleSuccessTitle] = "Case stopped",
            _a[StopLocalizationKeys.SingleFailure] = "The action could not be completed: {reason}",
            _a[StopLocalizationKeys.SingleFailureTitle] = "Couldn't stop the case",
            _a[StopLocalizationKeys.BulkSuccessTitle] = "Cases stopped",
            _a[StopLocalizationKeys.SingleAlreadyStoppedTitle] = "The case is already stopped",
            _a[StopLocalizationKeys.SingleAlreadyStoppedText] = "This case's AI Agent is already stopped, so no change was made.",
            _a[StopLocalizationKeys.SingleShadowTitle] = "AI Agent is in Shadow mode",
            _a[StopLocalizationKeys.SingleShadowText] = "AI Agent cannot be stopped in Shadow mode.",
            _a[StopLocalizationKeys.SingleNoStatusTitle] = "No active AI Agent to stop",
            _a[StopLocalizationKeys.SingleNoStatusText] = "This case doesn't have an active AI Agent, so there was nothing to stop.",
            _a[StopLocalizationKeys.SingleInProgressTitle] = "AI Agent is currently working",
            _a[StopLocalizationKeys.SingleInProgressText] = "This case's AI Agent is currently working on the case, so it can't be stopped right now. Try again once it finishes.",
            _a[StopLocalizationKeys.SingleInactiveTitle] = "This case is inactive",
            _a[StopLocalizationKeys.SingleInactiveText] = "This case is resolved or canceled. Reactivate it first.",
            _a[StopLocalizationKeys.SingleNotAppliedTitle] = "The case wasn't stopped",
            _a[StopLocalizationKeys.SingleNotAppliedText] = "The stop action couldn't be applied to this case, so no change was made.",
            _a[SupervisorReasonKeys.InactiveCase] = "Inactive case (resolved or canceled)",
            _a[SupervisorReasonKeys.NoStatusRecord] = "AI Agent is not enabled",
            _a[SupervisorReasonKeys.IncompleteStatusRecord] = "Malformed AI Agent status record",
            _a[SupervisorReasonKeys.FcsOff] = "Feature is not available yet",
            _a[SupervisorReasonKeys.IgnoredShadow] = "AI Agent is in Shadow mode",
            _a[SupervisorReasonKeys.AgentBusy] = "AI Agent is currently working",
            _a[SupervisorReasonKeys.AlreadyStopped] = "Already stopped",
            _a);
        // Reads the tunable bulk cap from FCS, flooring to the default when absent or not a positive integer.
        CMALibrary.getMaxBulkActionCount = function () {
            var rawValue = Xrm.Utility.getGlobalContext().getFeatureControlSetting("ServiceIntelligence.CaseManagement", CMALibrary.maxBulkActionCountFcsKey);
            var parsedValue = parseInt(String(rawValue), 10);
            return !isNaN(parsedValue) && parsedValue > 0 ? parsedValue : CMALibrary.defaultMaxBulkActionCount;
        };
        CMALibrary.shouldShowEscalateCMA = function (primaryRecordId) { return __awaiter(_c, void 0, void 0, function () {
            var isAISupervisorEnabled, isManualEscalateEnabled, hasWritePrivilege, recordId, result, shouldShow, error_3;
            return __generator(_c, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        logEventStart(Operations.ShouldShowEscalateCMA, { primaryRecordId: primaryRecordId });
                        isAISupervisorEnabled = Xrm.Utility.getGlobalContext().getFeatureControlSetting("ServiceIntelligence.CaseManagement", "AISupervisorEnabled");
                        if (!isAISupervisorEnabled) {
                            reportSuccess({
                                operation: Operations.ShouldShowEscalateCMA,
                                Message: "ShouldShowEscalateCMA returned false: AISupervisorEnabled FCS is disabled",
                            });
                            logEventEnd(Operations.ShouldShowEscalateCMA, {
                                shouldShow: false,
                                reason: "AISupervisorEnabled disabled",
                            });
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, CMALibrary.isFCSEnabledWithUserFallback("ServiceIntelligence.CaseManagement", "EnableManualEscalateForCMA", "EnableManualEscalateUserLevelFCSCheck")];
                    case 1:
                        isManualEscalateEnabled = _a.sent();
                        if (!isManualEscalateEnabled) {
                            reportSuccess({
                                operation: Operations.ShouldShowEscalateCMA,
                                Message: "ShouldShowEscalateCMA returned false: EnableManualEscalateForCMA disabled",
                            });
                            logEventEnd(Operations.ShouldShowEscalateCMA, {
                                shouldShow: false,
                                reason: "EnableManualEscalateForCMA disabled",
                            });
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, CMALibrary.checkUserEntityPrivilege(EntityNames.AIAgentStatus, "Write")];
                    case 2:
                        hasWritePrivilege = _a.sent();
                        if (!hasWritePrivilege) {
                            reportSuccess({ operation: Operations.ShouldShowEscalateCMA, Message: "ShouldShowEscalateCMA returned false: user lacks Write privilege on AIAgentStatus" });
                            logEventEnd(Operations.ShouldShowEscalateCMA, { shouldShow: false, reason: "no Write privilege on AIAgentStatus" });
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, CMALibrary.getAIAgentStatusId(primaryRecordId)];
                    case 3:
                        recordId = _a.sent();
                        if (!recordId) {
                            reportSuccess({ operation: Operations.ShouldShowEscalateCMA, Message: "ShouldShowEscalateCMA returned false: no AIAgentStatus record found" });
                            logEventEnd(Operations.ShouldShowEscalateCMA, { shouldShow: false, reason: "no AIAgentStatus record" });
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, Xrm.WebApi.retrieveRecord(EntityNames.AIAgentStatus, recordId, "?$select=statuscode")];
                    case 4:
                        result = _a.sent();
                        shouldShow = result.statuscode == 3 /* AIAgentStatusCode.Idle */ || result.statuscode == 1 /* AIAgentStatusCode.InProgress */;
                        logEventEnd(Operations.ShouldShowEscalateCMA, { shouldShow: shouldShow, statuscode: result.statuscode });
                        return [2 /*return*/, shouldShow];
                    case 5:
                        error_3 = _a.sent();
                        if (_operationTimers.has(Operations.ShouldShowEscalateCMA)) {
                            logEventEnd(Operations.ShouldShowEscalateCMA, { Message: "shouldShowEscalateCMA failed with an unhandled error" }, false);
                        }
                        reportFailure(error_3, { operation: Operations.ShouldShowEscalateCMA, Message: "Unhandled error in shouldShowEscalateCMA" });
                        console.error("[CMA:shouldShowEscalate] Error in shouldShowEscalateCMA: ", error_3);
                        return [2 /*return*/, false];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        CMALibrary.shouldShowEscalateMultipleCMA = function (primaryRecordId) { return __awaiter(_c, void 0, void 0, function () {
            var isAISupervisorEnabled, isManualEscalateMultipleEnabled, hasWritePrivilege, error_4;
            return __generator(_c, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        logEventStart(Operations.ShouldShowEscalateMultipleCMA, { primaryRecordId: primaryRecordId });
                        isAISupervisorEnabled = Xrm.Utility.getGlobalContext().getFeatureControlSetting("ServiceIntelligence.CaseManagement", "AISupervisorEnabled");
                        if (!isAISupervisorEnabled) {
                            reportSuccess({
                                operation: Operations.ShouldShowEscalateMultipleCMA,
                                Message: "ShouldShowEscalateMultipleCMA returned false: AISupervisorEnabled FCS is disabled",
                            });
                            logEventEnd(Operations.ShouldShowEscalateMultipleCMA, { shouldShow: false, reason: "AISupervisorEnabled disabled" });
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, CMALibrary.isFCSEnabledWithUserFallback("ServiceIntelligence.CaseManagement", "EnableManualEscalateMultipleForCMA", "EnableManualEscalateMultipleUserLevelEvaluation")];
                    case 1:
                        isManualEscalateMultipleEnabled = _a.sent();
                        if (!isManualEscalateMultipleEnabled) {
                            reportSuccess({
                                operation: Operations.ShouldShowEscalateMultipleCMA,
                                Message: "ShouldShowEscalateMultipleCMA returned false, FCS is disabled at both org and user level",
                            });
                            logEventEnd(Operations.ShouldShowEscalateMultipleCMA, { shouldShow: false, reason: "FCS disabled at both org and user level" });
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, CMALibrary.checkUserEntityPrivilege(EntityNames.AIAgentStatus, "Write")];
                    case 2:
                        hasWritePrivilege = _a.sent();
                        if (!hasWritePrivilege) {
                            reportSuccess({ operation: Operations.ShouldShowEscalateMultipleCMA, Message: "ShouldShowEscalateMultipleCMA returned false: user lacks Write privilege on AIAgentStatus" });
                            logEventEnd(Operations.ShouldShowEscalateMultipleCMA, { shouldShow: false, reason: "no Write privilege on AIAgentStatus" });
                            return [2 /*return*/, false];
                        }
                        logEventEnd(Operations.ShouldShowEscalateMultipleCMA, { shouldShow: true });
                        return [2 /*return*/, true];
                    case 3:
                        error_4 = _a.sent();
                        if (_operationTimers.has(Operations.ShouldShowEscalateMultipleCMA)) {
                            logEventEnd(Operations.ShouldShowEscalateMultipleCMA, { Message: "shouldShowEscalateMultipleCMA failed with an unhandled error" }, false);
                        }
                        reportFailure(error_4, { operation: Operations.ShouldShowEscalateMultipleCMA, Message: "Unhandled error in shouldShowEscalateMultipleCMA" });
                        console.error("[CMA:shouldShowEscalateMultiple] Error in shouldShowEscalateMultipleCMA: ", error_4);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        CMALibrary.shouldShowResumeCMA = function (primaryRecordId) { return __awaiter(_c, void 0, void 0, function () {
            var isAISupervisorEnabled, isManualResumeEnabled, hasWritePrivilege, recordId, result, shouldShow, error_5;
            return __generator(_c, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        logEventStart(Operations.ShouldShowResumeCMA, { primaryRecordId: primaryRecordId });
                        isAISupervisorEnabled = Xrm.Utility.getGlobalContext().getFeatureControlSetting("ServiceIntelligence.CaseManagement", "AISupervisorEnabled");
                        if (!isAISupervisorEnabled) {
                            reportSuccess({ operation: Operations.ShouldShowResumeCMA, Message: "ShouldShowResumeCMA returned false: AISupervisorEnabled FCS is disabled" });
                            logEventEnd(Operations.ShouldShowResumeCMA, { shouldShow: false, reason: "AISupervisorEnabled disabled" });
                            return [2 /*return*/, false];
                        }
                        isManualResumeEnabled = Xrm.Utility.getGlobalContext().getFeatureControlSetting("ServiceIntelligence.CaseManagement", "EnableManualResumeForCMA");
                        if (!isManualResumeEnabled) {
                            reportSuccess({ operation: Operations.ShouldShowResumeCMA, Message: "ShouldShowResumeCMA returned false: EnableManualResumeForCMA disabled" });
                            logEventEnd(Operations.ShouldShowResumeCMA, { shouldShow: false, reason: "EnableManualResumeForCMA disabled" });
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, CMALibrary.checkUserEntityPrivilege(EntityNames.AIAgentStatus, "Write")];
                    case 1:
                        hasWritePrivilege = _a.sent();
                        if (!hasWritePrivilege) {
                            reportSuccess({ operation: Operations.ShouldShowResumeCMA, Message: "ShouldShowResumeCMA returned false: user lacks Write privilege on AIAgentStatus" });
                            logEventEnd(Operations.ShouldShowResumeCMA, { shouldShow: false, reason: "no Write privilege on AIAgentStatus" });
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, CMALibrary.getAIAgentStatusId(primaryRecordId)];
                    case 2:
                        recordId = _a.sent();
                        if (!recordId) {
                            reportSuccess({ operation: Operations.ShouldShowResumeCMA, Message: "ShouldShowResumeCMA returned false: no AIAgentStatus record found" });
                            logEventEnd(Operations.ShouldShowResumeCMA, { shouldShow: false, reason: "no AIAgentStatus record" });
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, Xrm.WebApi.retrieveRecord(EntityNames.AIAgentStatus, recordId, "?$select=statuscode")];
                    case 3:
                        result = _a.sent();
                        shouldShow = result.statuscode == 2 /* AIAgentStatusCode.Escalated */ || result.statuscode == 4 /* AIAgentStatusCode.Paused */;
                        logEventEnd(Operations.ShouldShowResumeCMA, { shouldShow: shouldShow, statuscode: result.statuscode });
                        return [2 /*return*/, shouldShow];
                    case 4:
                        error_5 = _a.sent();
                        if (_operationTimers.has(Operations.ShouldShowResumeCMA)) {
                            logEventEnd(Operations.ShouldShowResumeCMA, { Message: "shouldShowResumeCMA failed with an unhandled error" }, false);
                        }
                        reportFailure(error_5, { operation: Operations.ShouldShowResumeCMA, Message: "Unhandled error in shouldShowResumeCMA" });
                        console.error("[CMA:shouldShowResume] Error in shouldShowResumeCMA: ", error_5);
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        CMALibrary.escalateCMA = function () { return __awaiter(_c, void 0, void 0, function () {
            var recordId, entityName, data, error_6;
            return __generator(_c, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        logEventStart(Operations.EscalateSingleCMATotal, { Message: "EscalateCMA method started" });
                        return [4 /*yield*/, CMALibrary.getAIAgentStatusId()];
                    case 1:
                        recordId = _a.sent();
                        if (!recordId) {
                            reportSuccess({
                                operation: Operations.EscalateSingleCMA,
                                Message: "EscalateCMA skipped: no AI Agent Status record found for the current case",
                            });
                            console.error("No AI Agent Status record found to escalate.");
                            logEventEnd(Operations.EscalateSingleCMATotal, { Message: "EscalateCMA exited early: no AI agent status record" });
                            return [2 /*return*/];
                        }
                        logEventStart(Operations.EscalateSingleCMA, {
                            Message: "Starting single case escalation",
                        });
                        entityName = EntityNames.AIAgentStatus;
                        data = {
                            "msdyn_currentaistatus": "Escalated",
                            "statecode": 1,
                            "statuscode": 2,
                            "msdyn_fallbackreason": 10,
                            "msdyn_escalatedon": new Date().toISOString()
                        };
                        return [4 /*yield*/, Xrm.WebApi.updateRecord(entityName, recordId, data)];
                    case 2:
                        _a.sent();
                        logEventEnd(Operations.EscalateSingleCMA, {
                            Message: "Single case escalation completed successfully",
                        });
                        Xrm.Page.ui.refreshRibbon();
                        Xrm.Page.data.refresh();
                        logEventEnd(Operations.EscalateSingleCMATotal, { Message: "EscalateCMA completed successfully" });
                        return [3 /*break*/, 4];
                    case 3:
                        error_6 = _a.sent();
                        if (_operationTimers.has(Operations.EscalateSingleCMA)) {
                            logEventEnd(Operations.EscalateSingleCMA, { Message: "Single case escalation failed" }, false);
                        }
                        if (_operationTimers.has(Operations.EscalateSingleCMATotal)) {
                            logEventEnd(Operations.EscalateSingleCMATotal, { Message: "EscalateCMA failed with an unhandled error" }, false);
                        }
                        reportFailure(error_6, {
                            operation: Operations.EscalateSingleCMA,
                            Message: "Unhandled error in escalateCMA",
                        });
                        console.error("Error in escalateCMA: ", error_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        CMALibrary.escalateMultipleCMA = function (incidentIds, gridControl) { return __awaiter(_c, void 0, void 0, function () {
            var maxBulkCount, incidentRecords, incidentsWithoutStatus, compatibleIncidentRecords, escalatedOn_1, updateResults, failedUpdates, successfulEscalationsCount, error_7;
            return __generator(_c, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        logEventStart(Operations.EscalateMultipleCMATotal, {
                            Message: "EscalateMultipleCMA method started",
                            selectedCount: incidentIds.length,
                            isBulkAction: incidentIds.length > 1,
                        });
                        maxBulkCount = CMALibrary.getMaxBulkActionCount();
                        if (!(incidentIds.length > maxBulkCount)) return [3 /*break*/, 2];
                        reportSuccess({
                            operation: Operations.EscalateMultipleCMA,
                            Message: "EscalateMultipleCMA aborted: selection exceeds max bulk escalation limit",
                            selectedCount: incidentIds.length,
                            maxCount: maxBulkCount,
                        });
                        return [4 /*yield*/, Xrm.Navigation.openAlertDialog({
                                title: CMALibrary.getLocalizedString(LocalizationKeys.LimitExceededTitle),
                                text: CMALibrary.getLocalizedString(LocalizationKeys.LimitExceededText, {
                                    maxCount: maxBulkCount.toString(),
                                    selectedCount: incidentIds.length.toString(),
                                })
                            })];
                    case 1:
                        _a.sent();
                        logEventEnd(Operations.EscalateMultipleCMATotal, { Message: "EscalateMultipleCMA exited early: limit exceeded" });
                        return [2 /*return*/];
                    case 2:
                        Xrm.Utility.showProgressIndicator(CMALibrary.getLocalizedString(LocalizationKeys.ProgressMessage));
                        logEventStart(Operations.BulkIncidentDataRetrieval, {
                            Message: "Retrieving incident records for bulk escalation",
                            selectedCount: incidentIds.length,
                        });
                        return [4 /*yield*/, CMALibrary.getBulkIncidentRecords(incidentIds)];
                    case 3:
                        incidentRecords = _a.sent();
                        incidentsWithoutStatus = incidentRecords.filter(function (incidentRecord) { return !incidentRecord.aiAgentStatusId; });
                        compatibleIncidentRecords = incidentRecords.filter(function (incidentRecord) { return !!incidentRecord.aiAgentStatusId; });
                        logEventEnd(Operations.BulkIncidentDataRetrieval, {
                            Message: "Incident records retrieved",
                            selectedCount: incidentIds.length,
                            compatibleCount: compatibleIncidentRecords.length,
                            skippedCount: incidentsWithoutStatus.length,
                        });
                        logEventStart(Operations.BulkEscalateUpdates, {
                            Message: "Starting bulk AI agent status updates",
                            compatibleCount: compatibleIncidentRecords.length,
                        });
                        escalatedOn_1 = new Date().toISOString();
                        return [4 /*yield*/, Promise.all(compatibleIncidentRecords.map(function (incidentRecord) {
                                var aiAgentStatusId = incidentRecord.aiAgentStatusId;
                                return Xrm.WebApi.updateRecord(EntityNames.AIAgentStatus, aiAgentStatusId, CMALibrary.getEscalatedStatusData(escalatedOn_1)).then(function () { return ({ success: true, ticketNumber: incidentRecord.ticketNumber, incidentId: incidentRecord.incidentId }); }, function () { return ({ success: false, ticketNumber: incidentRecord.ticketNumber, incidentId: incidentRecord.incidentId }); });
                            }))];
                    case 4:
                        updateResults = _a.sent();
                        failedUpdates = updateResults.filter(function (updateResult) { return !updateResult.success; });
                        successfulEscalationsCount = updateResults.length - failedUpdates.length;
                        logEventEnd(Operations.BulkEscalateUpdates, {
                            Message: "Bulk AI agent status updates completed",
                            selectedCount: incidentIds.length,
                            compatibleCount: compatibleIncidentRecords.length,
                            skippedCount: incidentsWithoutStatus.length,
                            successCount: successfulEscalationsCount,
                            failedCount: failedUpdates.length,
                        }, failedUpdates.length === 0);
                        Xrm.Utility.closeProgressIndicator();
                        if (!(incidentsWithoutStatus.length > 0 || failedUpdates.length > 0)) return [3 /*break*/, 6];
                        reportSuccess({
                            operation: Operations.EscalateMultipleCMA,
                            Message: "Bulk escalation completed with partial issues",
                            selectedCount: incidentIds.length,
                            successCount: successfulEscalationsCount,
                            skippedCount: incidentsWithoutStatus.length,
                            failedCount: failedUpdates.length,
                        });
                        return [4 /*yield*/, Xrm.Navigation.openAlertDialog({
                                title: CMALibrary.getEscalationIssueTitle(compatibleIncidentRecords.length),
                                text: CMALibrary.getEscalationIssueText(incidentsWithoutStatus, failedUpdates, successfulEscalationsCount)
                            })];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        reportSuccess({
                            operation: Operations.EscalateMultipleCMA,
                            Message: "Bulk escalation completed successfully",
                            selectedCount: incidentIds.length,
                            successCount: successfulEscalationsCount,
                        });
                        _a.label = 7;
                    case 7:
                        if (compatibleIncidentRecords.length > 0) {
                            gridControl.refresh();
                        }
                        logEventEnd(Operations.EscalateMultipleCMATotal, {
                            Message: "EscalateMultipleCMA completed",
                            selectedCount: incidentIds.length,
                            successCount: successfulEscalationsCount,
                            skippedCount: incidentsWithoutStatus.length,
                            failedCount: failedUpdates.length,
                        }, failedUpdates.length === 0 && incidentsWithoutStatus.length === 0);
                        return [3 /*break*/, 9];
                    case 8:
                        error_7 = _a.sent();
                        Xrm.Utility.closeProgressIndicator();
                        if (_operationTimers.has(Operations.BulkEscalateUpdates)) {
                            logEventEnd(Operations.BulkEscalateUpdates, { Message: "Bulk escalation failed with an unhandled error" }, false);
                        }
                        else if (_operationTimers.has(Operations.BulkIncidentDataRetrieval)) {
                            logEventEnd(Operations.BulkIncidentDataRetrieval, { Message: "Incident data retrieval failed with an unhandled error" }, false);
                        }
                        if (_operationTimers.has(Operations.EscalateMultipleCMATotal)) {
                            logEventEnd(Operations.EscalateMultipleCMATotal, { Message: "EscalateMultipleCMA failed with an unhandled error" }, false);
                        }
                        reportFailure(error_7, {
                            operation: Operations.EscalateMultipleCMA,
                            Message: "Unhandled error in escalateMultipleCMA",
                            selectedCount: incidentIds.length,
                        });
                        console.error("Error in escalateMultipleCMA: ", error_7);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        }); };
        CMALibrary.resumeCMA = function () { return __awaiter(_c, void 0, void 0, function () {
            var recordId, entityName, data, error_8;
            return __generator(_c, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, CMALibrary.getAIAgentStatusId()];
                    case 1:
                        recordId = _a.sent();
                        if (!recordId) {
                            console.error("No AI Agent Status record found to resume.");
                            return [2 /*return*/];
                        }
                        entityName = EntityNames.AIAgentStatus;
                        data = {
                            "msdyn_currentaistatus": "Idle",
                            "statecode": 1,
                            "statuscode": 3,
                            "msdyn_fallbackreason": null,
                            "msdyn_escalatedon": null
                        };
                        return [4 /*yield*/, Xrm.WebApi.updateRecord(entityName, recordId, data)];
                    case 2:
                        _a.sent();
                        Xrm.Page.ui.refreshRibbon();
                        Xrm.Page.data.refresh();
                        return [3 /*break*/, 4];
                    case 3:
                        error_8 = _a.sent();
                        console.error("Error in resumeCMA: ", error_8);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        // ─── Stop (standalone supervisor control, PR1) ────────────────────────────
        // Stop routes through the msdyn_AIAgentAction custom API (the supervisor-verb entry point).
        // Shared visibility gate for the single-case and bulk Stop ribbon buttons; the operation is threaded
        // through so each button's telemetry stays distinct. The public wrapper names are bound by RibbonDiff EnableRules.
        CMALibrary.evaluateStopVisibility = function (primaryRecordId, operation) { return __awaiter(_c, void 0, void 0, function () {
            var methodName, isAISupervisorEnabled, isManualStopEnabled, hasWritePrivilege, error_9;
            return __generator(_c, function (_a) {
                switch (_a.label) {
                    case 0:
                        methodName = operation.charAt(0).toLowerCase() + operation.slice(1);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        logEventStart(operation, { primaryRecordId: primaryRecordId });
                        isAISupervisorEnabled = Xrm.Utility.getGlobalContext().getFeatureControlSetting("ServiceIntelligence.CaseManagement", "AISupervisorEnabled");
                        if (!isAISupervisorEnabled) {
                            reportSuccess({
                                operation: operation,
                                Message: "".concat(operation, " returned false: AISupervisorEnabled FCS is disabled"),
                            });
                            logEventEnd(operation, { shouldShow: false, reason: "AISupervisorEnabled disabled" });
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, CMALibrary.isFCSEnabledWithUserFallback("ServiceIntelligence.CaseManagement", "EnableManualStopForCRA", "EnableManualStopUserLevelFCSCheck")];
                    case 2:
                        isManualStopEnabled = _a.sent();
                        if (!isManualStopEnabled) {
                            reportSuccess({
                                operation: operation,
                                Message: "".concat(operation, " returned false: EnableManualStopForCRA disabled at org and user level"),
                            });
                            logEventEnd(operation, { shouldShow: false, reason: "EnableManualStopForCRA disabled" });
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, CMALibrary.checkUserEntityPrivilege(EntityNames.AIAgentStatus, "Write")];
                    case 3:
                        hasWritePrivilege = _a.sent();
                        if (!hasWritePrivilege) {
                            reportSuccess({ operation: operation, Message: "".concat(operation, " returned false: user lacks Write privilege on AIAgentStatus") });
                            logEventEnd(operation, { shouldShow: false, reason: "no Write privilege on AIAgentStatus" });
                            return [2 /*return*/, false];
                        }
                        logEventEnd(operation, { shouldShow: true });
                        return [2 /*return*/, true];
                    case 4:
                        error_9 = _a.sent();
                        if (_operationTimers.has(operation)) {
                            logEventEnd(operation, { Message: "".concat(methodName, " failed with an unhandled error") }, false);
                        }
                        reportFailure(error_9, { operation: operation, Message: "Unhandled error in ".concat(methodName) });
                        console.error("Error in ".concat(methodName, ": "), error_9);
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        CMALibrary.shouldShowStopCRA = function (primaryRecordId) { return __awaiter(_c, void 0, void 0, function () { return __generator(_c, function (_a) {
            return [2 /*return*/, CMALibrary.evaluateStopVisibility(primaryRecordId, Operations.ShouldShowStopCRA)];
        }); }); };
        CMALibrary.shouldShowStopMultipleCRA = function (primaryRecordId) { return __awaiter(_c, void 0, void 0, function () { return __generator(_c, function (_a) {
            return [2 /*return*/, CMALibrary.evaluateStopVisibility(primaryRecordId, Operations.ShouldShowStopMultipleCRA)];
        }); }); };
        CMALibrary.stopCRA = function () { return __awaiter(_c, void 0, void 0, function () {
            var caseId, stopOutcome, invokeError_1, error_10;
            return __generator(_c, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        logEventStart(Operations.StopSingleCRATotal, { Message: "StopCRA method started" });
                        caseId = CMALibrary.getCurrentIncidentId();
                        if (!caseId) {
                            reportSuccess({ operation: Operations.StopSingleCRA, Message: "StopCRA skipped: no current case id" });
                            logEventEnd(Operations.StopSingleCRATotal, { Message: "StopCRA exited early: no current case id" });
                            return [2 /*return*/];
                        }
                        logEventStart(Operations.StopSingleCRA, { Message: "Starting single case stop" });
                        Xrm.Utility.showProgressIndicator(CMALibrary.getLocalizedString(StopLocalizationKeys.SingleProgressMessage));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 6]);
                        return [4 /*yield*/, CMALibrary.invokeSetAIAgentStatus(caseId)];
                    case 2:
                        stopOutcome = _a.sent();
                        logEventEnd(Operations.StopSingleCRA, { Message: "Single case stop completed", Outcome: stopOutcome.outcome, Reason: stopOutcome.reason });
                        reportSuccess({ operation: Operations.StopSingleCRA, success: true, Outcome: stopOutcome.outcome, Reason: stopOutcome.reason });
                        Xrm.Utility.closeProgressIndicator();
                        return [4 /*yield*/, CMALibrary.showStopOutcomeDialog(stopOutcome)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        invokeError_1 = _a.sent();
                        logEventEnd(Operations.StopSingleCRA, { Message: "Single case stop failed" }, false);
                        reportFailure(invokeError_1, { operation: Operations.StopSingleCRA, Message: "Single case stop failed" });
                        Xrm.Utility.closeProgressIndicator();
                        return [4 /*yield*/, Xrm.Navigation.openAlertDialog({
                                title: CMALibrary.getLocalizedString(StopLocalizationKeys.SingleFailureTitle),
                                text: CMALibrary.getLocalizedString(StopLocalizationKeys.SingleFailure, {
                                    reason: CMALibrary.extractServerReason(invokeError_1),
                                }),
                            })];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        Xrm.Page.ui.refreshRibbon();
                        Xrm.Page.data.refresh();
                        logEventEnd(Operations.StopSingleCRATotal, { Message: "StopCRA completed" });
                        return [3 /*break*/, 8];
                    case 7:
                        error_10 = _a.sent();
                        Xrm.Utility.closeProgressIndicator();
                        if (_operationTimers.has(Operations.StopSingleCRA)) {
                            logEventEnd(Operations.StopSingleCRA, { Message: "Single case stop failed with an unhandled error" }, false);
                        }
                        if (_operationTimers.has(Operations.StopSingleCRATotal)) {
                            logEventEnd(Operations.StopSingleCRATotal, { Message: "StopCRA failed with an unhandled error" }, false);
                        }
                        reportFailure(error_10, { operation: Operations.StopSingleCRA, Message: "Unhandled error in stopCRA" });
                        console.error("Error in stopCRA: ", error_10);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        CMALibrary.stopMultipleCRA = function (incidentIds, gridControl) { return __awaiter(_c, void 0, void 0, function () {
            var maxBulkCount, incidentRecords, incidentsWithoutStatus, compatibleIncidentRecords, updateResults, failedUpdates, serverSkippedUpdates, successfulStopsCount, totalSkippedCount, nonSuccessCount, singleOutcome, error_11;
            var _this = _c;
            return __generator(_c, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 12, , 13]);
                        logEventStart(Operations.StopMultipleCRATotal, {
                            Message: "StopMultipleCRA method started",
                            selectedCount: incidentIds.length,
                            isBulkAction: incidentIds.length > 1,
                        });
                        maxBulkCount = CMALibrary.getMaxBulkActionCount();
                        if (!(incidentIds.length > maxBulkCount)) return [3 /*break*/, 2];
                        reportSuccess({
                            operation: Operations.StopMultipleCRA,
                            Message: "StopMultipleCRA aborted: selection exceeds max bulk limit",
                            selectedCount: incidentIds.length,
                            maxCount: maxBulkCount,
                        });
                        return [4 /*yield*/, Xrm.Navigation.openAlertDialog({
                                title: CMALibrary.getLocalizedString(StopLocalizationKeys.LimitExceededTitle),
                                text: CMALibrary.getLocalizedString(StopLocalizationKeys.LimitExceededText, {
                                    maxCount: maxBulkCount.toString(),
                                    selectedCount: incidentIds.length.toString(),
                                }),
                            })];
                    case 1:
                        _a.sent();
                        logEventEnd(Operations.StopMultipleCRATotal, { Message: "StopMultipleCRA exited early: limit exceeded" });
                        return [2 /*return*/];
                    case 2:
                        Xrm.Utility.showProgressIndicator(CMALibrary.getLocalizedString(StopLocalizationKeys.ProgressMessage));
                        logEventStart(Operations.BulkStopIncidentDataRetrieval, {
                            Message: "Retrieving incident records for bulk stop",
                            selectedCount: incidentIds.length,
                        });
                        return [4 /*yield*/, CMALibrary.getBulkIncidentRecords(incidentIds)];
                    case 3:
                        incidentRecords = _a.sent();
                        incidentsWithoutStatus = incidentRecords.filter(function (incidentRecord) { return !incidentRecord.aiAgentStatusId; });
                        compatibleIncidentRecords = incidentRecords.filter(function (incidentRecord) { return !!incidentRecord.aiAgentStatusId; });
                        logEventEnd(Operations.BulkStopIncidentDataRetrieval, {
                            Message: "Incident records retrieved",
                            selectedCount: incidentIds.length,
                            compatibleCount: compatibleIncidentRecords.length,
                            skippedCount: incidentsWithoutStatus.length,
                        });
                        logEventStart(Operations.BulkStopUpdates, {
                            Message: "Starting bulk stop updates",
                            compatibleCount: compatibleIncidentRecords.length,
                        });
                        return [4 /*yield*/, Promise.all(compatibleIncidentRecords.map(function (incidentRecord) { return __awaiter(_this, void 0, void 0, function () {
                                var stopOutcome, caseError_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, CMALibrary.invokeSetAIAgentStatus(incidentRecord.incidentId)];
                                        case 1:
                                            stopOutcome = _a.sent();
                                            return [2 /*return*/, {
                                                    status: CMALibrary.classifyBulkStopOutcome(stopOutcome),
                                                    ticketNumber: incidentRecord.ticketNumber,
                                                    incidentId: incidentRecord.incidentId,
                                                    // Preserve the per-case decision so a single skipped/no-op case can reuse the form's reason-specific dialog.
                                                    outcome: stopOutcome.outcome,
                                                    reason: stopOutcome.reason,
                                                }];
                                        case 2:
                                            caseError_1 = _a.sent();
                                            reportFailure(caseError_1, {
                                                operation: Operations.StopMultipleCRA,
                                                incidentId: incidentRecord.incidentId,
                                                Message: "Per-case stop failed",
                                            });
                                            return [2 /*return*/, {
                                                    status: "failed",
                                                    ticketNumber: incidentRecord.ticketNumber,
                                                    incidentId: incidentRecord.incidentId,
                                                    outcome: SupervisorOutcomes.Reject,
                                                    reason: CMALibrary.extractServerReason(caseError_1),
                                                }];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 4:
                        updateResults = _a.sent();
                        failedUpdates = updateResults.filter(function (updateResult) { return updateResult.status === "failed"; });
                        serverSkippedUpdates = updateResults.filter(function (updateResult) { return updateResult.status === "skipped"; });
                        successfulStopsCount = updateResults.filter(function (updateResult) { return updateResult.status === "success"; }).length;
                        totalSkippedCount = incidentsWithoutStatus.length + serverSkippedUpdates.length;
                        logEventEnd(Operations.BulkStopUpdates, {
                            Message: "Bulk stop updates completed",
                            selectedCount: incidentIds.length,
                            compatibleCount: compatibleIncidentRecords.length,
                            skippedCount: totalSkippedCount,
                            successCount: successfulStopsCount,
                            failedCount: failedUpdates.length,
                        }, failedUpdates.length === 0);
                        Xrm.Utility.closeProgressIndicator();
                        if (!(totalSkippedCount > 0 || failedUpdates.length > 0)) return [3 /*break*/, 9];
                        reportSuccess({
                            operation: Operations.StopMultipleCRA,
                            Message: "Bulk stop completed with partial issues",
                            selectedCount: incidentIds.length,
                            successCount: successfulStopsCount,
                            skippedCount: totalSkippedCount,
                            failedCount: failedUpdates.length,
                        });
                        nonSuccessCount = totalSkippedCount + failedUpdates.length;
                        if (!(successfulStopsCount === 0 && nonSuccessCount === 1)) return [3 /*break*/, 6];
                        singleOutcome = failedUpdates.length === 1
                            ? { outcome: SupervisorOutcomes.Reject, reason: failedUpdates[0].reason || "" }
                            : serverSkippedUpdates.length === 1
                                ? { outcome: serverSkippedUpdates[0].outcome, reason: serverSkippedUpdates[0].reason }
                                // Client-detected no-status case → Skipped + NoStatusRecord single-case dialog.
                                : { outcome: SupervisorOutcomes.Skipped, reason: SupervisorReasons.NoStatusRecord };
                        return [4 /*yield*/, CMALibrary.showStopOutcomeDialog(singleOutcome)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, Xrm.Navigation.openAlertDialog({
                            title: CMALibrary.getStopIssueTitle(successfulStopsCount),
                            text: CMALibrary.getStopIssueText(incidentsWithoutStatus, serverSkippedUpdates, failedUpdates, successfulStopsCount),
                        })];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        reportSuccess({
                            operation: Operations.StopMultipleCRA,
                            Message: "Bulk stop completed successfully",
                            selectedCount: incidentIds.length,
                            successCount: successfulStopsCount,
                        });
                        // All-success shows a single confirmation; a single grid case mirrors the form's single-case copy ("Case stopped").
                        return [4 /*yield*/, Xrm.Navigation.openAlertDialog(successfulStopsCount === 1
                                ? {
                                    title: CMALibrary.getLocalizedString(StopLocalizationKeys.SingleSuccessTitle),
                                    text: CMALibrary.getLocalizedString(StopLocalizationKeys.SingleSuccess),
                                }
                                : {
                                    title: CMALibrary.getLocalizedString(StopLocalizationKeys.BulkSuccessTitle),
                                    text: CMALibrary.getLocalizedString(StopLocalizationKeys.SuccessCountPluralText, {
                                        caseCount: successfulStopsCount.toString(),
                                    }),
                                })];
                    case 10:
                        // All-success shows a single confirmation; a single grid case mirrors the form's single-case copy ("Case stopped").
                        _a.sent();
                        _a.label = 11;
                    case 11:
                        if (compatibleIncidentRecords.length > 0) {
                            gridControl.refresh();
                        }
                        logEventEnd(Operations.StopMultipleCRATotal, {
                            Message: "StopMultipleCRA completed",
                            selectedCount: incidentIds.length,
                            successCount: successfulStopsCount,
                            skippedCount: totalSkippedCount,
                            failedCount: failedUpdates.length,
                        }, failedUpdates.length === 0 && totalSkippedCount === 0);
                        return [3 /*break*/, 13];
                    case 12:
                        error_11 = _a.sent();
                        Xrm.Utility.closeProgressIndicator();
                        if (_operationTimers.has(Operations.BulkStopUpdates)) {
                            logEventEnd(Operations.BulkStopUpdates, { Message: "Bulk stop failed with an unhandled error" }, false);
                        }
                        else if (_operationTimers.has(Operations.BulkStopIncidentDataRetrieval)) {
                            logEventEnd(Operations.BulkStopIncidentDataRetrieval, { Message: "Incident data retrieval failed with an unhandled error" }, false);
                        }
                        if (_operationTimers.has(Operations.StopMultipleCRATotal)) {
                            logEventEnd(Operations.StopMultipleCRATotal, { Message: "StopMultipleCRA failed with an unhandled error" }, false);
                        }
                        reportFailure(error_11, {
                            operation: Operations.StopMultipleCRA,
                            Message: "Unhandled error in stopMultipleCRA",
                            selectedCount: incidentIds.length,
                        });
                        console.error("Error in stopMultipleCRA: ", error_11);
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/];
                }
            });
        }); };
        // Maps a server reason token to its localized label key; unmapped tokens fall through to a space-split (see getReasonLabel).
        CMALibrary.supervisorReasonLabelKeys = (_b = {},
            _b[SupervisorReasons.InactiveCase] = SupervisorReasonKeys.InactiveCase,
            _b[SupervisorReasons.NoStatusRecord] = SupervisorReasonKeys.NoStatusRecord,
            _b[SupervisorReasons.IncompleteStatusRecord] = SupervisorReasonKeys.IncompleteStatusRecord,
            _b[SupervisorReasons.FcsOff] = SupervisorReasonKeys.FcsOff,
            _b[SupervisorReasons.IgnoredShadow] = SupervisorReasonKeys.IgnoredShadow,
            _b[SupervisorReasons.BlockedInProgress] = SupervisorReasonKeys.AgentBusy,
            _b[SupervisorReasons.AlreadyStopped] = SupervisorReasonKeys.AlreadyStopped,
            _b);
        return CMALibrary;
    }());
    CMA.CMALibrary = CMALibrary;
})(CMA || (CMA = {}));
//# sourceMappingURL=msdyn_CMAWebresource.js.map