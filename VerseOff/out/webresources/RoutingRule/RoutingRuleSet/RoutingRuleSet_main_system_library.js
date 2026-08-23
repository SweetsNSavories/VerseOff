var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var RoutingRule;
(function (RoutingRule) {
    /* tslint:disable:crm-force-fields-private */
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
    RoutingRule.IsAdvancedUnifiedRoutingEnabledRequest = IsAdvancedUnifiedRoutingEnabledRequest;
})(RoutingRule || (RoutingRule = {}));
var RoutingRule;
(function (RoutingRule) {
    RoutingRule.CommonParameters = {
        Error: "Error",
        Info: "Info",
        Marker: "Marker",
        Warning: "Warning",
        Source: "Source",
        Parameters: "Parameters"
    };
    RoutingRule.TelemetryConstants = {
        CompulsoryPrefix: "msdyn"
    };
    var Telemetry = (function () {
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
                _a[RoutingRule.CommonParameters.Source] = source,
                _a[RoutingRule.CommonParameters.Error] = errorParam,
                _a[RoutingRule.CommonParameters.Parameters] = params,
                _a);
            Telemetry.logInternal(RoutingRule.CommonParameters.Error, errorMarker)();
            var _a;
        };
        /**
        * Log a warning event
        * @param source Telemetry source
        * @param warning Telemetry warning
        * @param params Telemetry params
        */
        Telemetry.logWarning = function (source, warning, params) {
            var warningParam;
            if (typeof warning === "string") {
                warningParam = warning;
            }
            else {
                warningParam = __assign({}, warning);
            }
            var warningMarker = (_a = {},
                _a[RoutingRule.CommonParameters.Source] = source,
                _a[RoutingRule.CommonParameters.Warning] = warningParam,
                _a[RoutingRule.CommonParameters.Parameters] = params,
                _a);
            Telemetry.logInternal(RoutingRule.CommonParameters.Warning, warningMarker)();
            var _a;
        };
        /**
        * Log an informational event
        * @param source Telemetry source
        * @param info Telemetry informational
        * @param params Telemetry params
        */
        Telemetry.logInfo = function (source, info, params) {
            var infoParam;
            if (typeof info === "string") {
                infoParam = info;
            }
            else {
                infoParam = __assign({}, info);
            }
            var infoMarker = (_a = {},
                _a[RoutingRule.CommonParameters.Source] = source,
                _a[RoutingRule.CommonParameters.Info] = infoParam,
                _a[RoutingRule.CommonParameters.Parameters] = params,
                _a);
            Telemetry.logInternal(RoutingRule.CommonParameters.Info, infoMarker)();
            var _a;
        };
        /**
        * Logs duration marker
        * @param source
        * @param params
        */
        Telemetry.startTimer = function (source, params) {
            var marker = (_a = {},
                _a[RoutingRule.CommonParameters.Source] = source,
                _a[RoutingRule.CommonParameters.Parameters] = params,
                _a);
            return Telemetry.logInternal(RoutingRule.CommonParameters.Marker, marker);
            var _a;
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
            var fullName = RoutingRule.TelemetryConstants.CompulsoryPrefix + "." + context + "." + name;
            var stop = Xrm.Internal.createPerformanceStopwatch(fullName, parameters);
            return function (endParameters) {
                stop(endParameters);
            };
        };
        return Telemetry;
    }());
    RoutingRule.Telemetry = Telemetry;
})(RoutingRule || (RoutingRule = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../../TypeDefinitions/RoutingRule/Localization/ResourceStringProvider.d.ts" />
/// <reference path="ODataContracts/IsAdvancedUnifiedRoutingEnabledRequest.ts" />
/// <reference path="../Utils/Telemetry.ts" />
var RoutingRule;
(function (RoutingRule) {
    var RoutingRuleSetLibrary = (function () {
        function RoutingRuleSetLibrary() {
            var _this = this;
            this.form_onload = function () {
                if (!ClientUtility.ClientUtil.isUCI()) {
                    var notificationText = RoutingRule.ResourceStringProvider.getResourceString("INFO_DEPRECATION_NOTICE_FOR_LEGACY_ROUTINGRULE");
                    Xrm.Page.ui.setFormNotification(notificationText, Xrm.Constants.FormNotificationLevels.information, "RoutingRuleNotification");
                }
                else {
                    RoutingRule.Telemetry.logInfo(RoutingRule.Telemetry.contextName, {
                        message: "Retrieving workflow to verify if advanced routing is enabled."
                    });
                    Xrm.WebApi.retrieveMultipleRecords("workflow", "?$select=uniquename&$filter=category eq 3 and uniquename eq 'IsAdvancedUnifiedRoutingEnabled'").then(function (res) {
                        if (res && res.entities.length >= 1) {
                            RoutingRule.Telemetry.logInfo(RoutingRule.Telemetry.contextName, {
                                message: "Verifying if advanced routing is enabled."
                            });
                            Xrm.WebApi.online.execute(new RoutingRule.IsAdvancedUnifiedRoutingEnabledRequest()).then(function (response) {
                                response.json().then(function (jsonResponse) {
                                    var isAdvancedUnifiedRoutingEnabled = jsonResponse.IsAdvancedUnifiedRoutingEnabled;
                                    if (!(Boolean)(isAdvancedUnifiedRoutingEnabled)) {
                                        _this.setFormNotificationText();
                                    }
                                });
                            }, function (err) {
                                RoutingRule.Telemetry.logError(RoutingRule.Telemetry.contextName + "Error", { error: err, message: "Error in executing IsAdvancedUnifiedRoutingEnabledRequest action" });
                            });
                        }
                        else {
                            RoutingRule.Telemetry.logInfo(RoutingRule.Telemetry.contextName, {
                                message: "IsAdvancedUnifiedRoutingEnabled record is not available within workflow, hence showing the notification for basic routing rule set about Unified Rounting"
                            });
                            _this.setFormNotificationText();
                        }
                    }, function (err) {
                        RoutingRule.Telemetry.logError(RoutingRule.Telemetry.contextName + "Error", { error: err, message: "Error in retrieving workflow records for checking IsAdvancedUnifiedRoutingEnabled" });
                    });
                }
            };
        }
        RoutingRuleSetLibrary.prototype.setFormNotificationText = function () {
            var notificationText = RoutingRule.ResourceStringProvider.getResourceString("TURN_ON_UNIFIED_ROUTING_NOTIFICATION_ROUTINGRULE");
            Xrm.Page.ui.setFormNotification(notificationText, Xrm.Constants.FormNotificationLevels.information, "RoutingRuleNotification");
        };
        return RoutingRuleSetLibrary;
    }());
    RoutingRule.RoutingRuleSetLibrary = RoutingRuleSetLibrary;
})(RoutingRule || (RoutingRule = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="./RoutingRuleSetLibrary.ts" />
var RoutingRule;
(function (RoutingRule) {
    /**
    * Register RoutingRuleItem instance in Mscrm namespace
    */
    var RoutingRuleSet = (function () {
        function RoutingRuleSet() {
        }
        return RoutingRuleSet;
    }());
    RoutingRuleSet.Instance = new RoutingRule.RoutingRuleSetLibrary();
    RoutingRuleSet.ctor = (function () {
    })();
    RoutingRule.RoutingRuleSet = RoutingRuleSet;
})(RoutingRule || (RoutingRule = {}));
//# sourceMappingURL=RoutingRuleSet_main_system_library.js.map