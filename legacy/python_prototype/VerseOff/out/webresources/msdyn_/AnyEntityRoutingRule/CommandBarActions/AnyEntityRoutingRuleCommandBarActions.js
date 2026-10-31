var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var ODataCreateRequest = (function () {
        function ODataCreateRequest(etn, payload) {
            this.etn = etn;
            this.payload = payload;
        }
        ODataCreateRequest.prototype.getMetadata = function () {
            return {
                boundParameter: undefined,
                parameterTypes: {},
                operationName: "Create",
                operationType: 2,
            };
        };
        return ODataCreateRequest;
    }());
    ODataContract.ODataCreateRequest = ODataCreateRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var EvaluateRuleAndRouteRequest = (function () {
        function EvaluateRuleAndRouteRequest(Target, RoutingRuleSetId) {
            this.Target = Target;
            this.RoutingRuleSetId = RoutingRuleSetId;
        }
        EvaluateRuleAndRouteRequest.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {
                    "Target": {
                        "typeName": "Microsoft.Dynamics.CRM." + this.Target.LogicalName,
                        "structuralProperty": 5
                    },
                    "RoutingRuleSetId": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    }
                },
                operationName: "_EvaluateRuleAndRoute",
                operationType: 0,
            };
        };
        return EvaluateRuleAndRouteRequest;
    }());
    ODataContract.EvaluateRuleAndRouteRequest = EvaluateRuleAndRouteRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var EvaluateMasterEntityRoutingConfigurationRequest = (function () {
        function EvaluateMasterEntityRoutingConfigurationRequest(Target) {
            this.Target = Target;
        }
        EvaluateMasterEntityRoutingConfigurationRequest.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {
                    "Target": {
                        "typeName": "Microsoft.Dynamics.CRM." + this.Target.LogicalName,
                        "structuralProperty": 5
                    }
                },
                operationName: "msdyn_EvaluateMasterEntityRoutingConfiguration",
                operationType: 0,
            };
        };
        return EvaluateMasterEntityRoutingConfigurationRequest;
    }());
    ODataContract.EvaluateMasterEntityRoutingConfigurationRequest = EvaluateMasterEntityRoutingConfigurationRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
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
    ODataContract.IsAdvancedUnifiedRoutingEnabledRequest = IsAdvancedUnifiedRoutingEnabledRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var ShouldEnableRoutingCommandRequest = (function () {
        function ShouldEnableRoutingCommandRequest(EntityLogicalName) {
            this.EntityLogicalName = EntityLogicalName;
        }
        ShouldEnableRoutingCommandRequest.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {
                    "EntityLogicalName": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    }
                },
                operationName: "msdyn_ShouldEnableRoutingCommand",
                operationType: 0,
            };
        };
        return ShouldEnableRoutingCommandRequest;
    }());
    ODataContract.ShouldEnableRoutingCommandRequest = ShouldEnableRoutingCommandRequest;
})(ODataContract || (ODataContract = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var AnyEntityRoutingRule;
(function (AnyEntityRoutingRule) {
    var DialogName = (function () {
        function DialogName() {
        }
        return DialogName;
    }());
    DialogName.RouteCase = "routecase";
    DialogName.SaveAndRouteCase = "saveandroutecase";
    AnyEntityRoutingRule.DialogName = DialogName;
})(AnyEntityRoutingRule || (AnyEntityRoutingRule = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var AnyEntityRoutingRule;
(function (AnyEntityRoutingRule) {
    var EntityNames = (function () {
        function EntityNames() {
        }
        return EntityNames;
    }());
    EntityNames.RoutingRule = "routingrule";
    EntityNames.RoutingRuleItem = "routingruleitem";
    EntityNames.RoutingRuleInstance = "msdyn_routingruleinstance";
    EntityNames.Workflow = "workflow";
    AnyEntityRoutingRule.EntityNames = EntityNames;
})(AnyEntityRoutingRule || (AnyEntityRoutingRule = {}));
var AnyEntityRoutingRule;
(function (AnyEntityRoutingRule) {
    AnyEntityRoutingRule.CommonParameters = {
        Error: "Error",
        Info: "Info",
        Marker: "Marker",
        Warning: "Warning",
        Source: "Source",
        Parameters: "Parameters"
    };
    AnyEntityRoutingRule.TelemetryConstants = {
        ApplyRoutingRule: "ApplyRoutingRule_AER",
        ApplyRoutingRuleFromGrid: "ApplyRoutingRule_AER_FromGrid",
        SaveAndRoute: "SaveAndRoute_AER",
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
                _a[AnyEntityRoutingRule.CommonParameters.Source] = source,
                _a[AnyEntityRoutingRule.CommonParameters.Error] = errorParam,
                _a[AnyEntityRoutingRule.CommonParameters.Parameters] = params,
                _a);
            Telemetry.logInternal(AnyEntityRoutingRule.CommonParameters.Error, errorMarker)();
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
                _a[AnyEntityRoutingRule.CommonParameters.Source] = source,
                _a[AnyEntityRoutingRule.CommonParameters.Warning] = warningParam,
                _a[AnyEntityRoutingRule.CommonParameters.Parameters] = params,
                _a);
            Telemetry.logInternal(AnyEntityRoutingRule.CommonParameters.Warning, warningMarker)();
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
                _a[AnyEntityRoutingRule.CommonParameters.Source] = source,
                _a[AnyEntityRoutingRule.CommonParameters.Info] = infoParam,
                _a[AnyEntityRoutingRule.CommonParameters.Parameters] = params,
                _a);
            Telemetry.logInternal(AnyEntityRoutingRule.CommonParameters.Info, infoMarker)();
            var _a;
        };
        /**
        * Logs duration marker
        * @param source
        * @param params
        */
        Telemetry.startTimer = function (source, params) {
            var marker = (_a = {},
                _a[AnyEntityRoutingRule.CommonParameters.Source] = source,
                _a[AnyEntityRoutingRule.CommonParameters.Parameters] = params,
                _a);
            return Telemetry.logInternal(AnyEntityRoutingRule.CommonParameters.Marker, marker);
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
            var fullName = AnyEntityRoutingRule.TelemetryConstants.CompulsoryPrefix + "." + context + "." + name;
            var stop = Xrm.Internal.createPerformanceStopwatch(fullName, parameters);
            return function (endParameters) {
                stop(endParameters);
            };
        };
        return Telemetry;
    }());
    AnyEntityRoutingRule.Telemetry = Telemetry;
})(AnyEntityRoutingRule || (AnyEntityRoutingRule = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../../../../TypeDefinitions/AnyEntityRoutingRule/Localization/ResourceStringProvider.d.ts" />
/// <reference path="../../Common/DataContracts/CRUD/ODataCreateRequest.ts" />
/// <reference path="../../Common/DataContracts/Action/EvaluateRuleAndRouteRequest.ts" />
/// <reference path="../../Common/DataContracts/Action/EvaluateMasterEntityRoutingConfigurationRequest.ts" />
/// <reference path="../../Common/DataContracts/Action/IsAdvancedUnifiedRoutingEnabledRequest.ts" />
/// <reference path="../../Common/DataContracts/Action/ShouldEnableRoutingCommandRequest.ts" />
/// <reference path="../../Common/DialogName.ts" />
/// <reference path="../../Common/EntityNames.ts" />
/// <reference path="../../Utils/Telemetry.ts" />
var AnyEntityRoutingRule;
(function (AnyEntityRoutingRule) {
    var EntityRoutingCommandKey = "EntityRoutingCommandKey";
    var AnyEntityRoutingRuleCommandBarActions = (function () {
        function AnyEntityRoutingRuleCommandBarActions() {
            var _this = this;
            this.isRoutingRuleCreatedForEntity = function (entityName) {
                // Reading session data from session storage
                var sessionData = sessionStorage && sessionStorage.getItem(EntityRoutingCommandKey);
                var entityRoutingCommandInfo = sessionData ? JSON.parse(sessionData) : {};
                if (entityName in entityRoutingCommandInfo) {
                    return Promise.resolve(entityRoutingCommandInfo[entityName]);
                }
                // Adding entity info in session variable
                var request = new ODataContract.ShouldEnableRoutingCommandRequest(entityName);
                return Xrm.WebApi.online.execute(request).then(function (response) {
                    return response.json().then(function (jsonResponse) {
                        entityRoutingCommandInfo[entityName] = jsonResponse.EnableRoutingCommand;
                        sessionStorage && sessionStorage.setItem(EntityRoutingCommandKey, JSON.stringify(entityRoutingCommandInfo));
                        return jsonResponse.EnableRoutingCommand;
                    }, function () {
                        entityRoutingCommandInfo[entityName] = false;
                        sessionStorage && sessionStorage.setItem(EntityRoutingCommandKey, JSON.stringify(entityRoutingCommandInfo));
                        return false;
                    });
                }, function () {
                    entityRoutingCommandInfo[entityName] = false;
                    sessionStorage && sessionStorage.setItem(EntityRoutingCommandKey, JSON.stringify(entityRoutingCommandInfo));
                    return false;
                });
            };
            this.saveAndRunRoutingRuleAndClose = function (entityId) {
                var entityName = Xrm.Page.data.entity.getEntityName();
                AnyEntityRoutingRule.Telemetry.setContext(AnyEntityRoutingRule.TelemetryConstants.SaveAndRoute);
                AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                    message: "SaveAndRoute for " + entityName + " entity with id " + entityId + " is clicked."
                });
                ClientUtility.DialogUtil.showProgressMessage();
                Xrm.Page.data.save().then(function () {
                    ClientUtility.DialogUtil.hideProgressMessage();
                    AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                        message: "Invoking _performActionAfterCheckingUnifiedRouting_form"
                    });
                    _this._performActionAfterCheckingUnifiedRouting_form(_this._actionAfterSaveAndRoutingRule, entityId);
                }, function (err) {
                    AnyEntityRoutingRule.Telemetry.logError(AnyEntityRoutingRule.Telemetry.contextName + "Error", {
                        error: err, message: "Error in saving the " + entityName + " record with id " + entityId
                    });
                    ClientUtility.DialogUtil.hideProgressMessage();
                });
            };
            this._actionAfterSaveAndRoutingRule = function (result, entityId, entityName, displayName, isAdvancedUnifiedRoutingEnabled) {
                if (isAdvancedUnifiedRoutingEnabled === void 0) { isAdvancedUnifiedRoutingEnabled = false; }
                if (ClientUtility.ClientUtil.isMobileOffline()) {
                    ClientUtility.DialogUtil.showMoCAOfflineError();
                    return;
                }
                if (result.confirmed == true) {
                    Xrm.Page.data.save().then(function () {
                        var recordId = new Array(1);
                        recordId[0] = ClientUtility.DataUtil.isNullOrEmptyString(entityId) ? Xrm.Page.data.entity.getId() : entityId;
                        AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                            message: "Invoking routing for id " + recordId + " with advanced routing set to " + isAdvancedUnifiedRoutingEnabled
                        });
                        !ClientUtility.DataUtil.isNullOrUndefined(recordId) && _this._executeRouting(recordId, null, entityName, displayName, isAdvancedUnifiedRoutingEnabled);
                    }, function (err) {
                        AnyEntityRoutingRule.Telemetry.logError(AnyEntityRoutingRule.Telemetry.contextName + "Error", { error: err, message: "Error in saving the " + entityName + " record with id " + entityId });
                        ClientUtility.DialogUtil.actionFailedCallbackForMoca;
                    });
                }
            };
            this._performActionAfterCheckingUnifiedRouting_form = function (callbackFunction, entityId) {
                AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                    message: "Invoked _performActionAfterCheckingUnifiedRouting_form"
                });
                var openUnifiedRoutingDialog = function () {
                    var options = { width: 400, height: 200, position: 1 /* center */ };
                    var confirmDialogStrings = { text: "" };
                    var entityName = Xrm.Page.data.entity.getEntityName();
                    if (!ClientUtility.DataUtil.isNullOrEmptyString(entityName)) {
                        Xrm.Utility.getEntityMetadata(entityName).then(function (entityMetadata) {
                            var displayName = entityMetadata.DisplayName;
                            confirmDialogStrings.title = ClientUtility.StringUtil.format(AnyEntityRoutingRule.ResourceStringProvider.getResourceString("RouteDialog_Title"), displayName);
                            confirmDialogStrings.text = ClientUtility.StringUtil.format(AnyEntityRoutingRule.ResourceStringProvider.getResourceString("UR_RouteDialog_AddRequiredConfirmForSingleRecord_Body"), displayName.toLocaleLowerCase());
                            confirmDialogStrings.confirmButtonLabel = AnyEntityRoutingRule.ResourceStringProvider.getResourceString("Button_Label_Route");
                            confirmDialogStrings.cancelButtonLabel = AnyEntityRoutingRule.ResourceStringProvider.getResourceString("Button_Label_Cancel");
                            var callbackFunctionClose = ClientUtility.DialogUtil.createCallbackFunctionFactory(callbackFunction, entityId, entityName, displayName, true);
                            Xrm.Navigation.openConfirmDialog(confirmDialogStrings, options).then(callbackFunctionClose);
                        });
                    }
                };
                var openDialog = function () {
                    if (Xrm.Internal.isFeatureEnabled("AnyEntityRoutingRule")) {
                        var options = { width: 400, height: 200, position: 1 /* center */ };
                        var confirmDialogStrings = { text: "" };
                        var entityName = Xrm.Page.data.entity.getEntityName();
                        if (!ClientUtility.DataUtil.isNullOrEmptyString(entityName)) {
                            Xrm.Utility.getEntityMetadata(entityName).then(function (entityMetadata) {
                                var displayName = entityMetadata.DisplayName;
                                confirmDialogStrings.title = ClientUtility.StringUtil.format(AnyEntityRoutingRule.ResourceStringProvider.getResourceString("RouteDialog_Title"), displayName);
                                confirmDialogStrings.text = ClientUtility.StringUtil.format(AnyEntityRoutingRule.ResourceStringProvider.getResourceString("RouteDialog_AddRequiredConfirmForSingleRecord_Body"), displayName.toLocaleLowerCase());
                                confirmDialogStrings.confirmButtonLabel = AnyEntityRoutingRule.ResourceStringProvider.getResourceString("Button_Label_Route");
                                confirmDialogStrings.cancelButtonLabel = AnyEntityRoutingRule.ResourceStringProvider.getResourceString("Button_Label_Cancel");
                                var callbackFunctionClose = ClientUtility.DialogUtil.createCallbackFunctionFactory(callbackFunction, entityId, entityName, displayName, false);
                                Xrm.Navigation.openConfirmDialog(confirmDialogStrings, options).then(callbackFunctionClose);
                            });
                        }
                    }
                    else {
                        _this._alertAnyEntityRoutingRuleFCBNotEnabled();
                    }
                };
                AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                    message: "Retrieving workflow to verify if advanced routing is enabled."
                });
                Xrm.WebApi.retrieveMultipleRecords("workflow", "?$select=uniquename&$filter=category eq 3 and uniquename eq 'IsAdvancedUnifiedRoutingEnabled'").then(function (res) {
                    if (res && res.entities.length >= 1) {
                        var request = new ODataContract.IsAdvancedUnifiedRoutingEnabledRequest();
                        Xrm.WebApi.online.execute(request).then(function (response) {
                            response.json().then(function (jsonResponse) {
                                var isAdvancedUnifiedRoutingEnabled = jsonResponse.IsAdvancedUnifiedRoutingEnabled;
                                if (isAdvancedUnifiedRoutingEnabled) {
                                    AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                                        message: "Advanced Routing is enabled, hence invoking the openUnifiedRoutingDialog"
                                    });
                                    openUnifiedRoutingDialog();
                                }
                                else {
                                    AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                                        message: "Advanced Routing is not enabled, hence invoking the usual openDialog"
                                    });
                                    openDialog();
                                }
                            });
                        }, function (err) {
                            AnyEntityRoutingRule.Telemetry.logError(AnyEntityRoutingRule.Telemetry.contextName + "Error", { error: err, message: "Error in executing IsAdvancedUnifiedRoutingEnabledRequest action" });
                            ClientUtility.DialogUtil.actionFailedCallbackForMoca;
                        });
                    }
                    else {
                        AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                            message: "IsAdvancedUnifiedRoutingEnabled record is not available within workflow, hence invoking the usual openDialog for basic routing rule set"
                        });
                        openDialog();
                    }
                }, function (err) {
                    AnyEntityRoutingRule.Telemetry.logError(AnyEntityRoutingRule.Telemetry.contextName + "Error", { error: err, message: "Error in retrieving workflow records for checking IsAdvancedUnifiedRoutingEnabled" });
                    ClientUtility.DialogUtil.actionFailedCallbackForMoca;
                });
            };
            this.runRoutingRuleGrid = function (gridControl, records) {
                var entityName = gridControl.getEntityName();
                AnyEntityRoutingRule.Telemetry.setContext(AnyEntityRoutingRule.TelemetryConstants.ApplyRoutingRuleFromGrid);
                AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                    message: "ApplyRoutingRuleFromGrid for " + entityName + " entity is clicked."
                });
                if (ClientUtility.DataUtil.isNullOrUndefined(records) || !records.length) {
                    var alertDialogStrings = { text: "" };
                    alertDialogStrings.text = AnyEntityRoutingRule.ResourceStringProvider.getResourceString("Error_Message_Action_NoItemSelected");
                    AnyEntityRoutingRule.Telemetry.logWarning(AnyEntityRoutingRule.Telemetry.contextName + "Warning", "One or more " + entityName + " records were not selected");
                    Xrm.Navigation.openAlertDialog(alertDialogStrings);
                    return;
                }
                _this._performActionAfterCheckingUnifiedRouting_grid(_this._actionAfterRoutingRule, gridControl, records);
            };
            this._actionAfterRoutingRule = function (result, gridControl, entityIds, entityName, displayName, isAdvancedUnifiedRoutingEnabled) {
                if (isAdvancedUnifiedRoutingEnabled === void 0) { isAdvancedUnifiedRoutingEnabled = false; }
                if (ClientUtility.ClientUtil.isMobileOffline()) {
                    ClientUtility.DialogUtil.showMoCAOfflineError();
                    return;
                }
                if (result.confirmed == true) {
                    !ClientUtility.DataUtil.isNullOrUndefined(entityIds) && _this._executeRouting(entityIds, gridControl, entityName, displayName, isAdvancedUnifiedRoutingEnabled);
                }
            };
            this._performActionAfterCheckingUnifiedRouting_grid = function (callbackFunction, gridControl, records) {
                var recordIds = "";
                for (var ids = new Array(records.length), i = 0; i < records.length; i++) {
                    if (ids.length > 0)
                        ids[i] = records[i].Id;
                    recordIds += i + 1 + ". " + records[i].Id + " ";
                }
                AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                    message: "Attempting to route " + records.length + " records with ids " + recordIds
                });
                var openUnifiedRoutingDialog = function () {
                    var options = { width: 460, height: 250, position: 1 /* center */ };
                    var confirmDialogStrings = { text: "" };
                    var entityName = gridControl.getEntityName();
                    if (!ClientUtility.DataUtil.isNullOrEmptyString(entityName)) {
                        Xrm.Utility.getEntityMetadata(entityName).then(function (entityMetadata) {
                            var displayName = entityMetadata.DisplayName;
                            var collectionName = ClientUtility.DataUtil.EmptyString;
                            if (records.length > 1)
                                collectionName = entityMetadata.DisplayCollectionName;
                            confirmDialogStrings.title = ClientUtility.StringUtil.format(AnyEntityRoutingRule.ResourceStringProvider.getResourceString("RouteDialog_Title"), displayName);
                            if (records.length > 1)
                                confirmDialogStrings.text = ClientUtility.StringUtil.format(AnyEntityRoutingRule.ResourceStringProvider.getResourceString("UR_RouteDialog_AddRequiredConfirmForMultipleRecords_Body"), records.length, collectionName.toLocaleLowerCase());
                            else
                                confirmDialogStrings.text = ClientUtility.StringUtil.format(AnyEntityRoutingRule.ResourceStringProvider.getResourceString("UR_RouteDialog_AddRequiredConfirmForSingleRecord_Body"), displayName.toLocaleLowerCase());
                            confirmDialogStrings.confirmButtonLabel = AnyEntityRoutingRule.ResourceStringProvider.getResourceString("Button_Label_Route");
                            confirmDialogStrings.cancelButtonLabel = AnyEntityRoutingRule.ResourceStringProvider.getResourceString("Button_Label_Cancel");
                            var callback = ClientUtility.DialogUtil.createCallbackFunctionFactory(callbackFunction, gridControl, ids, entityName, displayName, true);
                            Xrm.Navigation.openConfirmDialog(confirmDialogStrings, options).then(callback);
                        });
                    }
                };
                var openDialog = function () {
                    if (Xrm.Internal.isFeatureEnabled("AnyEntityRoutingRule")) {
                        var options = { width: 460, height: 250, position: 1 /* center */ };
                        var confirmDialogStrings = { text: "" };
                        var entityName = gridControl.getEntityName();
                        if (!ClientUtility.DataUtil.isNullOrEmptyString(entityName)) {
                            Xrm.Utility.getEntityMetadata(entityName).then(function (entityMetadata) {
                                var displayName = entityMetadata.DisplayName;
                                var collectionName = ClientUtility.DataUtil.EmptyString;
                                if (records.length > 1)
                                    collectionName = entityMetadata.DisplayCollectionName;
                                confirmDialogStrings.title = ClientUtility.StringUtil.format(AnyEntityRoutingRule.ResourceStringProvider.getResourceString("RouteDialog_Title"), displayName);
                                if (records.length > 1)
                                    confirmDialogStrings.text = ClientUtility.StringUtil.format(AnyEntityRoutingRule.ResourceStringProvider.getResourceString("RouteDialog_AddRequiredConfirmForMultipleRecords_Body"), records.length, collectionName.toLocaleLowerCase());
                                else
                                    confirmDialogStrings.text = ClientUtility.StringUtil.format(AnyEntityRoutingRule.ResourceStringProvider.getResourceString("RouteDialog_AddRequiredConfirmForSingleRecord_Body"), displayName.toLocaleLowerCase());
                                confirmDialogStrings.confirmButtonLabel = AnyEntityRoutingRule.ResourceStringProvider.getResourceString("Button_Label_Route");
                                confirmDialogStrings.cancelButtonLabel = AnyEntityRoutingRule.ResourceStringProvider.getResourceString("Button_Label_Cancel");
                                var callback = ClientUtility.DialogUtil.createCallbackFunctionFactory(callbackFunction, gridControl, ids, entityName, displayName, false);
                                Xrm.Navigation.openConfirmDialog(confirmDialogStrings, options).then(callback);
                            });
                        }
                    }
                    else {
                        _this._alertAnyEntityRoutingRuleFCBNotEnabled();
                    }
                };
                AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                    message: "Retrieving workflow to verify if advanced routing is enabled."
                });
                Xrm.WebApi.retrieveMultipleRecords("workflow", "?$select=uniquename&$filter=category eq 3 and uniquename eq 'IsAdvancedUnifiedRoutingEnabled'").then(function (res) {
                    if (res && res.entities.length >= 1) {
                        var request = new ODataContract.IsAdvancedUnifiedRoutingEnabledRequest();
                        Xrm.WebApi.online.execute(request).then(function (response) {
                            response.json().then(function (jsonResponse) {
                                var isAdvancedUnifiedRoutingEnabled = jsonResponse.IsAdvancedUnifiedRoutingEnabled;
                                if (isAdvancedUnifiedRoutingEnabled) {
                                    AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                                        message: "Advanced Routing is enabled, hence invoking the openUnifiedRoutingDialog"
                                    });
                                    openUnifiedRoutingDialog();
                                }
                                else {
                                    AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                                        message: "Advanced Routing is not enabled, hence invoking the usual openDialog"
                                    });
                                    openDialog();
                                }
                            });
                        }, function (err) {
                            AnyEntityRoutingRule.Telemetry.logError(AnyEntityRoutingRule.Telemetry.contextName + "Error", { error: err, message: "Error in executing IsAdvancedUnifiedRoutingEnabledRequest action" });
                            ClientUtility.DialogUtil.actionFailedCallbackForMoca;
                        });
                    }
                    else {
                        AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                            message: "IsAdvancedUnifiedRoutingEnabled record is not available within workflow, hence invoking the usual openDialog for basic routing rule set"
                        });
                        openDialog();
                    }
                }, function (err) {
                    AnyEntityRoutingRule.Telemetry.logError(AnyEntityRoutingRule.Telemetry.contextName + "Error", { error: err, message: "Error in retrieving workflow records for checking IsAdvancedUnifiedRoutingEnabled" });
                    ClientUtility.DialogUtil.actionFailedCallbackForMoca;
                });
            };
            this._executeRouting = function (selectedRecords, gridControl, entityName, displayName, isAdvancedUnifiedRoutingEnabled) {
                if (isAdvancedUnifiedRoutingEnabled === void 0) { isAdvancedUnifiedRoutingEnabled = false; }
                if (isAdvancedUnifiedRoutingEnabled) {
                    AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                        message: "Invoking AnyEntity Advanced Unified Routing"
                    });
                    _this._executeAnyEntityAdvancedUnifiedRouting(selectedRecords, gridControl, entityName, displayName);
                }
                else {
                    if (!Xrm.Internal.isFeatureEnabled("April2021Update")) {
                        AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                            message: "Invoking AnyEntity Basic Routing since FCB.April2021Update is disabled"
                        });
                        _this._executeAnyEntityRoutingRule(selectedRecords, gridControl, entityName, displayName);
                    }
                    else {
                        var alert = { text: "" };
                        alert.text = AnyEntityRoutingRule.ResourceStringProvider.getResourceString("RouteDialog_For_NonCase_Routing");
                        AnyEntityRoutingRule.Telemetry.logWarning(AnyEntityRoutingRule.Telemetry.contextName + "Warning", "Routing using basic routing rulesets is only available for cases");
                        Xrm.Navigation.openAlertDialog(alert);
                        return;
                    }
                }
            };
            this._executeAnyEntityAdvancedUnifiedRouting = function (selectedRecords, gridControl, entityName, displayName) {
                AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                    message: "Retrieving MERC record for " + entityName + " entity"
                });
                Xrm.WebApi.retrieveMultipleRecords("msdyn_masterentityroutingconfiguration", "?$select=msdyn_entitylogicalname&$filter=msdyn_entitylogicalname eq '" + entityName + "'").then(function (response) {
                    if ((!response || !(response.entities.length > 0))) {
                        var alert = { text: "", title: "" };
                        alert.title = AnyEntityRoutingRule.ResourceStringProvider.getResourceString("RouteDialog_Validation_RecordRoutingHeaderMessage");
                        alert.text = ClientUtility.StringUtil.format(AnyEntityRoutingRule.ResourceStringProvider.getResourceString("RouteDialog_Validation_RecordRoutingBodyMessage"), entityName);
                        AnyEntityRoutingRule.Telemetry.logWarning(AnyEntityRoutingRule.Telemetry.contextName + "Warning", "Record routing is not set up for " + entityName);
                        Xrm.Navigation.openAlertDialog(alert);
                        return;
                    }
                    var successfulActionExecution = function () {
                        // Close the form
                        if (!ClientUtility.DataUtil.isNullOrUndefined(gridControl)) {
                            gridControl.refresh();
                        }
                        else {
                            Xrm.Page.ui.close();
                        }
                        AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                            message: "AnyEntity Advanced Unified Routing execution was successful"
                        });
                    };
                    var actionExecutionFailure = function (response) {
                        AnyEntityRoutingRule.Telemetry.logError(AnyEntityRoutingRule.Telemetry.contextName + "Error", { error: response, message: "AnyEntity Advanced Unified Routing execution failed" });
                        ClientUtility.DialogUtil.actionFailedCallbackForMoca(response);
                    };
                    var actionExecutedCallbackForMultiple = function (response) {
                        // Validate each response separately
                        for (var idx = 0; idx < response.length; idx++) {
                            var result = response[idx];
                            if (result.status !== 200 && result.status !== 204) {
                                AnyEntityRoutingRule.Telemetry.logError(AnyEntityRoutingRule.Telemetry.contextName + "Error", { error: response, message: "AnyEntity Advanced Unified Routing execution faced workflow error" });
                                // Report error if any
                                _this.openAlertDialogForWorkFlowMultipleError();
                                return;
                            }
                        }
                        // Close the form if there was no error(s)
                        successfulActionExecution();
                    };
                    _this._executeEvaluateMasterEntityRoutingConfigurationAction(selectedRecords, entityName).then(actionExecutedCallbackForMultiple, actionExecutionFailure);
                }, function (err) {
                    AnyEntityRoutingRule.Telemetry.logError(AnyEntityRoutingRule.Telemetry.contextName + "Error", { error: err, message: "Error in retrieving MERC record for " + entityName + " entity" });
                    ClientUtility.DialogUtil.actionFailedCallbackForMoca;
                });
            };
            this._executeAnyEntityRoutingRule = function (selectedRecords, gridControl, entityName, displayName) {
                AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                    message: "Retrieving the routing rules for " + entityName + " entity"
                });
                Xrm.WebApi.retrieveMultipleRecords(AnyEntityRoutingRule.EntityNames.RoutingRule, "?$select=_workflowid_value, msdyn_entitylogicalname&$filter=statuscode eq 2 and msdyn_entitylogicalname eq '" + entityName + "'").then(function (response) {
                    // BUG 650899 - If there’s no active rule to route the case, should show up the message “There’s no active rule to route this case” in Web & UCI
                    if ((!response || !(response.entities.length > 0))) {
                        var alert = { text: "" };
                        alert.text = ClientUtility.StringUtil.format(AnyEntityRoutingRule.ResourceStringProvider.getResourceString("RouteDialog_Validation_ActiveRouteRuleRequiredMessage"), displayName.toLocaleLowerCase());
                        AnyEntityRoutingRule.Telemetry.logWarning(AnyEntityRoutingRule.Telemetry.contextName + "Warning", "There is no active routing rule set to route this " + entityName);
                        Xrm.Navigation.openAlertDialog(alert);
                        return;
                    }
                    var routingRuleSetId = response.entities ? response.entities[0].routingruleid : response.value[0].routingruleid;
                    var routeWorkflowId = response.entities ? response.entities[0]._workflowid_value : response.value[0]._workflowid_value;
                    AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                        message: "Identified routing ruleset id is " + routingRuleSetId + " bearing the workflow id " + routeWorkflowId
                    });
                    var successfulWorkflowExecution = function () {
                        // close the form
                        if (!ClientUtility.DataUtil.isNullOrUndefined(gridControl)) {
                            gridControl.refresh();
                        }
                        else {
                            Xrm.Page.ui.close();
                        }
                        AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                            message: "CS Basic Routing execution was successful"
                        });
                    };
                    var workflowExecutionFailure = function (response) {
                        AnyEntityRoutingRule.Telemetry.logError(AnyEntityRoutingRule.Telemetry.contextName + "Error", { error: response, message: "CS Basic Routing execution failed" });
                        ClientUtility.DialogUtil.actionFailedCallbackForMoca(response);
                    };
                    var workflowExecutedCallbackForMultiple = function (response) {
                        // validate each response separately
                        for (var idx = 0; idx < response.length; idx++) {
                            var result = response[idx];
                            if (result.status !== 200) {
                                AnyEntityRoutingRule.Telemetry.logError(AnyEntityRoutingRule.Telemetry.contextName + "Error", { error: response, message: "CS Basic Routing execution faced workflow error" });
                                // report error if any
                                _this.openAlertDialogForWorkFlowMultipleError();
                                return;
                            }
                        }
                        // close the form if there was no error(s)
                        successfulWorkflowExecution();
                    };
                    var query = "?$filter=_routingruleid_value eq '" + routingRuleSetId + "' and startswith(conditionxml,'<fetch') &$top=1";
                    AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                        message: "Retrieving the fetchXML based routing rule items for routing ruleset id " + routingRuleSetId
                    });
                    Xrm.WebApi.retrieveMultipleRecords(AnyEntityRoutingRule.EntityNames.RoutingRuleItem, query).then(function (innerResponse) {
                        if (innerResponse.entities.length == 1) {
                            if (selectedRecords.length >= 1) {
                                AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                                    message: "Invoking _executeEvaluateRuleAndRouteAction action"
                                });
                                _this._executeEvaluateRuleAndRouteAction(selectedRecords, routingRuleSetId, entityName).then(successfulWorkflowExecution, workflowExecutionFailure);
                            }
                        }
                        else {
                            if (!ClientUtility.DataUtil.isNullOrUndefined(routeWorkflowId)) {
                                if (selectedRecords.length === 1) {
                                    if (!ClientUtility.DataUtil.isNullOrUndefined(selectedRecords[0])) {
                                        var selectedRecordId = ClientUtility.Guid.tryCreate(selectedRecords[0].toString());
                                        AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                                            message: "Executing the workflow " + routeWorkflowId + " for " + entityName + " " + selectedRecordId
                                        });
                                        _this._executeWorkFlow(selectedRecordId, routeWorkflowId).then(successfulWorkflowExecution, workflowExecutionFailure);
                                    }
                                }
                                else {
                                    AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                                        message: "Executing the workflow " + routeWorkflowId + " for multiple record of entity " + entityName
                                    });
                                    _this._executeWorkFlowMultiple(selectedRecords, routeWorkflowId).then(workflowExecutedCallbackForMultiple, workflowExecutionFailure);
                                }
                            }
                        }
                    }, function (err) {
                        AnyEntityRoutingRule.Telemetry.logError(AnyEntityRoutingRule.Telemetry.contextName + "Error", { error: err, message: "Error in retrieving the routing ruleitems bearing conditionXML beginning with fetch keyword" });
                        ClientUtility.DialogUtil.actionFailedCallbackForMoca;
                    });
                }, function (err) {
                    AnyEntityRoutingRule.Telemetry.logError(AnyEntityRoutingRule.Telemetry.contextName + "Error", { error: err, message: "Error in retrieving the routing rule sets for " + entityName + " entity" });
                    ClientUtility.DialogUtil.actionFailedCallbackForMoca;
                });
            };
            this._executeEvaluateRuleAndRouteAction = function (selectedRecords, routingRuleSetId, entityName) { return __awaiter(_this, void 0, void 0, function () {
                var odataType, primaryIdAttribute, evaluateRuleAndRouteRequest, i, regardingId, target;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            odataType = "Microsoft.Dynamics.CRM." + entityName;
                            primaryIdAttribute = "";
                            return [4 /*yield*/, Xrm.Utility.getEntityMetadata(entityName).then(function (response) { return primaryIdAttribute = response["PrimaryIdAttribute"]; })];
                        case 1:
                            _a.sent();
                            evaluateRuleAndRouteRequest = [];
                            for (i = 0; i < selectedRecords.length; i++) {
                                if (!ClientUtility.DataUtil.isNullOrUndefined(selectedRecords[i])) {
                                    if (selectedRecords[i].startsWith('{')) {
                                        regardingId = selectedRecords[i].slice(1, -1);
                                    }
                                    else {
                                        regardingId = selectedRecords[i].toString();
                                    }
                                    target = {};
                                    target["@odata.type"] = odataType;
                                    target[primaryIdAttribute] = regardingId;
                                    AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                                        message: "Executing EvaluateRuleAndRouteRequest for " + entityName + " record " + regardingId
                                    });
                                    evaluateRuleAndRouteRequest[i] = new ODataContract.EvaluateRuleAndRouteRequest(target, routingRuleSetId);
                                }
                            }
                            return [2 /*return*/, Xrm.WebApi.online.executeMultiple(evaluateRuleAndRouteRequest)];
                    }
                });
            }); };
            this._executeEvaluateMasterEntityRoutingConfigurationAction = function (selectedRecords, entityName) { return __awaiter(_this, void 0, void 0, function () {
                var odataType, primaryIdAttribute, evaluateMasterEntityRoutingConfigurationRequest, i, regardingId, target;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            odataType = "Microsoft.Dynamics.CRM." + entityName;
                            primaryIdAttribute = "";
                            return [4 /*yield*/, Xrm.Utility.getEntityMetadata(entityName).then(function (response) { return primaryIdAttribute = response["PrimaryIdAttribute"]; })];
                        case 1:
                            _a.sent();
                            evaluateMasterEntityRoutingConfigurationRequest = [];
                            for (i = 0; i < selectedRecords.length; i++) {
                                if (!ClientUtility.DataUtil.isNullOrUndefined(selectedRecords[i])) {
                                    if (selectedRecords[i].startsWith('{')) {
                                        regardingId = selectedRecords[i].slice(1, -1);
                                    }
                                    else {
                                        regardingId = selectedRecords[i].toString();
                                    }
                                    target = {};
                                    target["@odata.type"] = odataType;
                                    target[primaryIdAttribute] = regardingId;
                                    AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                                        message: "Executing EvaluateMasterEntityRoutingConfigurationRequest for " + entityName + " record " + regardingId
                                    });
                                    evaluateMasterEntityRoutingConfigurationRequest[i] = new ODataContract.EvaluateMasterEntityRoutingConfigurationRequest(target);
                                }
                            }
                            return [2 /*return*/, Xrm.WebApi.online.executeMultiple(evaluateMasterEntityRoutingConfigurationRequest)];
                    }
                });
            }); };
            this._executeWorkFlow = function (entityId, routeWorkflowId) {
                if (ClientUtility.ClientUtil.isMobileOffline()) {
                    ClientUtility.DialogUtil.showMoCAOfflineError();
                    Xrm.Page.ui.close();
                    return;
                }
                if (!ClientUtility.DataUtil.isNullOrUndefined(entityId) && !ClientUtility.DataUtil.isNullOrUndefined(routeWorkflowId)) {
                    var inputArguments = new ODataContract.InputArgument();
                    inputArguments.Count = 1;
                    inputArguments.IsReadOnly = true;
                    inputArguments.Keys = new Array("UIScript_Input_Integer_IsManualRun");
                    var valueObject = new ODataContract.Object();
                    valueObject.Type = "System.Int32";
                    valueObject.Value = "1";
                    inputArguments.Values = [valueObject];
                    var inputArgumentCollection = new ODataContract.InputArgumentCollection();
                    inputArgumentCollection.Arguments = inputArguments;
                    var request = new ODataContract.ExecuteWorkflowRequest({ id: routeWorkflowId, entityType: AnyEntityRoutingRule.EntityNames.Workflow }, { guid: entityId }, inputArgumentCollection);
                    AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                        message: "Executing the workflow " + routeWorkflowId + " with entity record id " + entityId
                    });
                    return Xrm.WebApi.online.execute(request);
                }
            };
            this._executeWorkFlowMultiple = function (selectedRecords, routeWorkFlowId) {
                var inputArguments = new ODataContract.InputArgument();
                inputArguments.Count = 1;
                inputArguments.IsReadOnly = true;
                inputArguments.Keys = new Array("UIScript_Input_Integer_IsManualRun");
                var valueObject = new ODataContract.Object();
                valueObject.Type = "System.Int32";
                valueObject.Value = "1";
                inputArguments.Values = [valueObject];
                var inputArgumentCollection = new ODataContract.InputArgumentCollection();
                inputArgumentCollection.Arguments = inputArguments;
                for (var requests = new Array(selectedRecords.length), i = 0; i < selectedRecords.length; i++) {
                    if (requests.length > 0) {
                        AnyEntityRoutingRule.Telemetry.logInfo(AnyEntityRoutingRule.Telemetry.contextName, {
                            message: "Executing the workflow " + routeWorkFlowId + " with entity record id " + selectedRecords[i]
                        });
                        requests[i] = new ODataContract.ExecuteWorkflowRequest({ id: routeWorkFlowId, entityType: AnyEntityRoutingRule.EntityNames.Workflow }, { guid: selectedRecords[i] }, inputArgumentCollection);
                    }
                }
                return Xrm.WebApi.online.executeMultiple(requests);
            };
            this.openAlertDialogForWorkFlowMultipleError = function () {
                var alertDialogStrings = { text: "" };
                alertDialogStrings.text = AnyEntityRoutingRule.ResourceStringProvider.getResourceString("Error_Message_MultipleErrorsFound");
                Xrm.Navigation.openAlertDialog(alertDialogStrings, null);
            };
            this._alertAnyEntityRoutingRuleFCBNotEnabled = function () {
                var alert = { text: "" };
                alert.text = AnyEntityRoutingRule.ResourceStringProvider.getResourceString("AnyEntityRoutingRuleFCBNotEnabled");
                Xrm.Navigation.openAlertDialog(alert);
                return;
            };
        }
        return AnyEntityRoutingRuleCommandBarActions;
    }());
    AnyEntityRoutingRule.AnyEntityRoutingRuleCommandBarActions = AnyEntityRoutingRuleCommandBarActions;
})(AnyEntityRoutingRule || (AnyEntityRoutingRule = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="UCI/AnyEntityRoutingRuleCommandBarActions.ts" />
var AnyEntityRoutingRule;
(function (AnyEntityRoutingRule) {
    var CommandBarActions = (function () {
        function CommandBarActions() {
        }
        return CommandBarActions;
    }());
    CommandBarActions.ctor = (function () {
        if (Xrm.Internal.isUci()) {
            CommandBarActions.Instance = new AnyEntityRoutingRule.AnyEntityRoutingRuleCommandBarActions();
        }
    })();
    AnyEntityRoutingRule.CommandBarActions = CommandBarActions;
})(AnyEntityRoutingRule || (AnyEntityRoutingRule = {}));
