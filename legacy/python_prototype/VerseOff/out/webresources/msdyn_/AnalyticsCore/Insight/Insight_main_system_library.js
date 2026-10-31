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
var AnalyticsCore;
(function (AnalyticsCore) {
    var CommonParameters;
    (function (CommonParameters) {
        CommonParameters["Error"] = "Error";
        CommonParameters["Info"] = "Info";
        CommonParameters["Marker"] = "Marker";
        CommonParameters["Warning"] = "Warning";
        CommonParameters["Source"] = "Source";
        CommonParameters["Parameters"] = "Parameters";
    })(CommonParameters = AnalyticsCore.CommonParameters || (AnalyticsCore.CommonParameters = {}));
    var Telemetry = (function () {
        function Telemetry() {
        }
        Telemetry.createTracingSession = function (sessionName) {
            Telemetry._sessionName = sessionName;
        };
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
        Telemetry.measureStartStop = function (source, params) {
            var _a;
            var marker = (_a = {},
                _a[CommonParameters.Source] = source,
                _a[CommonParameters.Parameters] = params,
                _a);
            return Telemetry.logInternal(CommonParameters.Marker, marker);
        };
        Telemetry.logInternal = function (name, parameters) {
            var fullName = Telemetry.AnalyticsPrefix + "." + Telemetry._sessionName + "." + name;
            if (!Xrm || !(Xrm.Internal) || !(Xrm.Internal.createPerformanceStopwatch)) {
                return function () { };
            }
            var stop = Xrm.Internal.createPerformanceStopwatch(fullName, parameters);
            if (!Xrm || !(Xrm.Reporting)) {
                return function () { };
            }
            var reporting = Xrm.Reporting;
            var params = parameters;
            var reportingParams = Object.keys(params).map(function (key) {
                return { name: key, value: params[key] };
            });
            if (name == CommonParameters.Error)
                reporting.reportFailure(fullName, params != null ? params.Error : null, "", reportingParams);
            else
                reporting.reportSuccess(fullName, reportingParams);
            return function (endParameters) {
                stop(endParameters);
            };
        };
        Telemetry.AnalyticsPrefix = "msdyn.DataInsightsAndAnalytics";
        return Telemetry;
    }());
    AnalyticsCore.Telemetry = Telemetry;
})(AnalyticsCore || (AnalyticsCore = {}));
var AnalyticsCore;
(function (AnalyticsCore) {
    var IsAdvancedUnifiedRoutingEnabledRequest = (function () {
        function IsAdvancedUnifiedRoutingEnabledRequest() {
        }
        IsAdvancedUnifiedRoutingEnabledRequest.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: null,
                operationName: "msdyn_IsAdvancedUnifiedRoutingEnabled",
                operationType: 0,
            };
        };
        return IsAdvancedUnifiedRoutingEnabledRequest;
    }());
    AnalyticsCore.IsAdvancedUnifiedRoutingEnabledRequest = IsAdvancedUnifiedRoutingEnabledRequest;
})(AnalyticsCore || (AnalyticsCore = {}));
var AnalyticsCore;
(function (AnalyticsCore) {
    var Constants = (function () {
        function Constants() {
        }
        Constants.URRecordsAnalyticsFeatureId = "{7d0e9742-ff53-4445-b825-7248392405ec}";
        Constants.URConversationsAnalyticsFeatureId = "{f8d4455e-9b53-4142-8c09-81fd70e6986d}";
        Constants.CSHistoricalAnalyticsFeatureId = "8fef4d92-fba9-ea11-a81c-000d3a6ce6ca";
        Constants.OCHistoricalAnalyticsFeatureId = "c7cb0a2e-38d2-ea11-a813-000d3a8ab15e";
        Constants.IsEnabledAttribute = "msdyn_isenabled";
        Constants.EnableURToggleControlName = "msdyn_enableurtogglehelptext";
        Constants.EnableCSParentControlName = "msdyn_enablecsparenthelptext";
        Constants.EnableOCParentControlName = "msdyn_enableocparenthelptext";
        Constants.InsightOnLoadMethod = "Insight.onLoadHandler";
        Constants.InsightFormLoadError = "InsightFormLoadError";
        Constants.SessionName = "OnFormLoad";
        Constants.OCAnalyticsFeatureFetchError = "Error fetching OC Historical Analytics feature record";
        Constants.CSAnalyticsFeatureFetchError = "Error fetching CS Historical Analytics feature record";
        Constants.AdvancedRoutingWorkflowFetchError = "Error fetching IsAdvancedUnifiedRoutingEnabled workflow";
        Constants.AdvancedRoutingWorkflowExecutionError = "Error executing IsAdvancedUnifiedRoutingEnabled workflow";
        Constants.AdvancedRoutingWorkflowResponseParsingError = "Error parsing IsAdvancedUnifiedRoutingEnabled workflow response";
        Constants.AdvancedRoutingWorkflowEmptyResponseError = "IsAdvancedUnifiedRoutingEnabled workflow response is null or empty";
        return Constants;
    }());
    AnalyticsCore.Constants = Constants;
})(AnalyticsCore || (AnalyticsCore = {}));
var AnalyticsCore;
(function (AnalyticsCore) {
    var Insight = (function () {
        function Insight() {
        }
        Insight.onLoadHandler = function (context) {
            var formContext = context.getFormContext();
            if (formContext == null || formContext.data == null || formContext.data.entity == null) {
                return;
            }
            var featureId = formContext.data.entity.getId().toLowerCase();
            if (featureId == AnalyticsCore.Constants.URRecordsAnalyticsFeatureId) {
                AnalyticsCore.Telemetry.createTracingSession(AnalyticsCore.Constants.SessionName);
                var field = formContext.data.entity.attributes.get(AnalyticsCore.Constants.IsEnabledAttribute);
                var enableFeaturecontrol = formContext.getControl(field.getName());
                enableFeaturecontrol.setDisabled(true);
                var urToggleHelpTextControl = formContext.ui.getControls(AnalyticsCore.Constants.EnableURToggleControlName).getByName(AnalyticsCore.Constants.EnableURToggleControlName);
                var csParentHelpTextControl = formContext.ui.getControls(AnalyticsCore.Constants.EnableCSParentControlName).getByName(AnalyticsCore.Constants.EnableCSParentControlName);
                Xrm.WebApi.retrieveMultipleRecords("workflow", "?$select=uniquename&$filter=category eq 3 and uniquename eq 'IsAdvancedUnifiedRoutingEnabled'").then(function (res) {
                    if (res && res.entities && res.entities.length >= 1) {
                        var request = new AnalyticsCore.IsAdvancedUnifiedRoutingEnabledRequest();
                        Xrm.WebApi.online.execute(request).then(function (response) {
                            response.json().then(function (jsonResponse) {
                                var isAdvancedUnifiedRoutingEnabled = jsonResponse.IsAdvancedUnifiedRoutingEnabled;
                                if (!isAdvancedUnifiedRoutingEnabled) {
                                    urToggleHelpTextControl.setVisible(true);
                                }
                                else {
                                    enableFeaturecontrol.setDisabled(false);
                                    Xrm.WebApi.retrieveRecord("msdyn_datainsightsandanalyticsfeature", AnalyticsCore.Constants.CSHistoricalAnalyticsFeatureId).then(function (response) {
                                        if (response && !response.msdyn_isenabled) {
                                            csParentHelpTextControl.setVisible(true);
                                        }
                                    }).catch(function (error) { return AnalyticsCore.Telemetry.logError(AnalyticsCore.Constants.InsightFormLoadError, error, {
                                        "Record Id": AnalyticsCore.Constants.CSHistoricalAnalyticsFeatureId,
                                        "ErrorDetails": AnalyticsCore.Constants.CSAnalyticsFeatureFetchError,
                                        function: AnalyticsCore.Constants.InsightOnLoadMethod
                                    }); });
                                }
                            }).catch(function (error) { return AnalyticsCore.Telemetry.logError(AnalyticsCore.Constants.InsightFormLoadError, error, {
                                "ErrorDetails": AnalyticsCore.Constants.AdvancedRoutingWorkflowResponseParsingError,
                                function: AnalyticsCore.Constants.InsightOnLoadMethod
                            }); });
                        }).catch(function (error) { return AnalyticsCore.Telemetry.logError(AnalyticsCore.Constants.InsightFormLoadError, error, {
                            "ErrorDetails": AnalyticsCore.Constants.AdvancedRoutingWorkflowExecutionError,
                            function: AnalyticsCore.Constants.InsightOnLoadMethod
                        }); });
                    }
                    else {
                        urToggleHelpTextControl.setVisible(true);
                        AnalyticsCore.Telemetry.logError(AnalyticsCore.Constants.InsightFormLoadError, AnalyticsCore.Constants.AdvancedRoutingWorkflowEmptyResponseError, { function: AnalyticsCore.Constants.InsightOnLoadMethod });
                    }
                }).catch(function (error) { return AnalyticsCore.Telemetry.logError(AnalyticsCore.Constants.InsightFormLoadError, error, {
                    "ErrorDetails": AnalyticsCore.Constants.AdvancedRoutingWorkflowFetchError,
                    function: AnalyticsCore.Constants.InsightOnLoadMethod
                }); });
            }
            else if (featureId == AnalyticsCore.Constants.URConversationsAnalyticsFeatureId) {
                AnalyticsCore.Telemetry.createTracingSession(AnalyticsCore.Constants.SessionName);
                var ocParentHelpTextControl = formContext.ui.getControls(AnalyticsCore.Constants.EnableOCParentControlName).getByName(AnalyticsCore.Constants.EnableOCParentControlName);
                Xrm.WebApi.retrieveRecord("msdyn_datainsightsandanalyticsfeature", AnalyticsCore.Constants.OCHistoricalAnalyticsFeatureId).then(function (response) {
                    if (response && !response.msdyn_isenabled) {
                        ocParentHelpTextControl.setVisible(true);
                    }
                }).catch(function (error) { return AnalyticsCore.Telemetry.logError(AnalyticsCore.Constants.InsightFormLoadError, error, {
                    "Record Id": AnalyticsCore.Constants.OCHistoricalAnalyticsFeatureId,
                    "ErrorDetails": AnalyticsCore.Constants.OCAnalyticsFeatureFetchError,
                    function: AnalyticsCore.Constants.InsightOnLoadMethod
                }); });
            }
        };
        return Insight;
    }());
    AnalyticsCore.Insight = Insight;
})(AnalyticsCore || (AnalyticsCore = {}));
