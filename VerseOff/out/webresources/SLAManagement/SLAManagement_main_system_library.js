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
var SlaKpi;
(function (SlaKpi) {
    var Constants = (function () {
        function Constants() {
        }
        return Constants;
    }());
    Constants.ACTIVATE = "SLAKPI_Activate";
    Constants.DEACTIVATE = "SLAKPI_Deactivate";
    Constants.DEACTIVATE_MESSAGE = "SLAKPI_Deactivate_Message";
    Constants.ACTIVATE_MESSAGE = "SLAKPI_Activate_Message";
    Constants.PROCESSING = "Progress_Message";
    Constants.DEACTIVATE_TITLE = "SLAKPI_Deactivate_Title";
    Constants.ACTIVATE_TITLE = "SLAKPI_Activate_Title";
    Constants.ERROR_TITLE = "SLAKPI_BusinessProcessError_Title";
    Constants.SLAITEM_PAUSECONDITIONSEMPTYALERT = "SLAItem_PauseConditionsEmptyAlert";
    Constants.SLAKPI_RECOMMENDATION_ENTITYNAME = "SLAKPI_Recommendation_Entityname";
    Constants.SLAKPI_RECOMMENDATION_KPIFIELD = "SLAKPI_Recommendation_KPIField";
    Constants.SLAKPI_ACTIVATION_ERROR_MESSAGE = "SLAKPI_Activation_Error_Message";
    Constants.SLAKPI_RelatedEntitiesNotification = "SLA_RelatedEntitiesNotification";
    SlaKpi.Constants = Constants;
})(SlaKpi || (SlaKpi = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var SLAManagement;
(function (SLAManagement) {
    var ResourceStringProvider = (function () {
        function ResourceStringProvider() {
        }
        ResourceStringProvider.getResourceString = function (key) {
            var value = Xrm.Utility.getResourceString(ResourceStringProvider.WebResourceName, key);
            if (value === undefined || value === null) {
                value = key;
            }
            return value;
        };
        return ResourceStringProvider;
    }());
    ResourceStringProvider.WebResourceName = "Localization/Languages/SLAStrings";
    SLAManagement.ResourceStringProvider = ResourceStringProvider;
})(SLAManagement || (SLAManagement = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
var SLAManagement;
(function (SLAManagement) {
    SLAManagement.TelemetryConstants = {
        UCContext: "AutoFixUpUC",
        UCPrefix: "msdyn.AutoFixUpUC"
    };
    SLAManagement.TelemetryErrors = {
        IncidentPluginError: "IncidentPluginError",
        CustomEntityPluginError: "CustomEntityPluginError",
        UCCheckDependencyDisabledError: "UCCheckDependencyDisabledError"
    };
    SLAManagement.CommonSource = {
        UCIncidentPlugin: "UCIncidentPlugin",
        UCCheckDependencyDisabled: "UCCheckDependencyDisable",
        UCCustomEntityPlugin: "UCCustomeEntityPlugin",
        CheckSLASettingsDisable: "CheckSLASettingsDisable"
    };
    SLAManagement.CommonParameters = {
        Error: "Error",
        Info: "Info",
        Marker: "Marker",
        Warning: "Warning",
        Source: "Source",
        Parameters: "Parameters"
    };
    var Telemetry = (function () {
        function Telemetry() {
        }
        /**
         * Set context which is included in all log output.
         * @param name name of the current context
         */
        Telemetry.setContext = function (name, prefixName) {
            Telemetry._contextName = name;
            Telemetry._prefixName = prefixName;
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
                var name_1 = error.name, message = error.message;
                errorParam = { name: name_1, message: message };
            }
            else if (typeof error === "string") {
                errorParam = error;
            }
            else {
                errorParam = __assign({}, error);
            }
            var errorMarker = (_a = {},
                _a[SLAManagement.CommonParameters.Source] = source,
                _a[SLAManagement.CommonParameters.Error] = errorParam,
                _a[SLAManagement.CommonParameters.Parameters] = params,
                _a);
            Telemetry.logInternal(SLAManagement.CommonParameters.Error, errorMarker)();
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
                _a[SLAManagement.CommonParameters.Source] = source,
                _a[SLAManagement.CommonParameters.Warning] = warningParam,
                _a[SLAManagement.CommonParameters.Parameters] = params,
                _a);
            Telemetry.logInternal(SLAManagement.CommonParameters.Warning, warningMarker)();
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
                _a[SLAManagement.CommonParameters.Source] = source,
                _a[SLAManagement.CommonParameters.Info] = infoParam,
                _a[SLAManagement.CommonParameters.Parameters] = params,
                _a);
            Telemetry.logInternal(SLAManagement.CommonParameters.Info, infoMarker)();
            var _a;
        };
        /**
         * Logs duration marker
         * @param source
         * @param params
         */
        Telemetry.startTimer = function (source, params) {
            var marker = (_a = {},
                _a[SLAManagement.CommonParameters.Source] = source,
                _a[SLAManagement.CommonParameters.Parameters] = params,
                _a);
            return Telemetry.logInternal(SLAManagement.CommonParameters.Marker, marker);
            var _a;
        };
        /**
         * Internal method to log the event to UCI
         * @param name Event name
         * @param parameters Event params
         */
        Telemetry.logInternal = function (name, parameters) {
            // Safety in case the UCI context doesn't contain telemetry
            // infrastructure.
            if (!Xrm.Internal || !Xrm.Internal.createPerformanceStopwatch) {
                return function () { };
            }
            var context = Telemetry._contextName || "";
            var fullName = Telemetry._prefixName + "." + context + "." + name;
            var stop = Xrm.Internal.createPerformanceStopwatch(fullName, parameters);
            return function (endParameters) {
                stop(endParameters);
            };
        };
        return Telemetry;
    }());
    SLAManagement.Telemetry = Telemetry;
})(SLAManagement || (SLAManagement = {}));
/**
 * Data manager to manage the data and execute CRUD operations to entities
 */
var ClientUtility;
(function (ClientUtility) {
    var DataManager = (function () {
        function DataManager() {
        }
        /**
         * Get Geo value of the org
         * @return Geo value of the org
         */
        DataManager.getOrganizationGeo = function () {
            var organizationGeoName = "";
            var organizationSettings = null;
            var xrm = window.Xrm;
            if (xrm && xrm.Utility && xrm.Utility.getGlobalContext()) {
                organizationSettings = xrm.Utility.getGlobalContext().organizationSettings;
            }
            if (organizationSettings) {
                organizationGeoName = organizationSettings.organizationGeo;
                if (organizationGeoName && organizationGeoName.toUpperCase() === "NA") {
                    organizationGeoName = organizationSettings.isSovereignCloud ? "GCC" : organizationGeoName;
                }
            }
            return organizationGeoName;
        };
        /**
         * Gets MS Docs Redirect base URL
         * @returns Docs Redirect base URL
         */
        DataManager.getMSDocsRedirectBaseURL = function () {
            var currentGeo = this.getOrganizationGeo();
            var docBaseURL = currentGeo === "USR" ? "https://aka.microsoft.scloud" :
                currentGeo === "USE" ? "https://aka.eaglex.ic.gov" :
                    "https://go.microsoft.com";
            return docBaseURL;
        };
        /**
         * Gets MS Docs base URL
         * @returns Docs base URL
         */
        DataManager.getMSDocsBaseURL = function () {
            var currentGeo = this.getOrganizationGeo();
            var docBaseURL = currentGeo === "USR" ? "https://docs.microsoft.scloud" :
                currentGeo === "USE" ? "https://docs.eaglex.ic.gov" :
                    "https://learn.microsoft.com";
            return docBaseURL;
        };
        return DataManager;
    }());
    ClientUtility.DataManager = DataManager;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../Common/ResxConstants.ts" />
/// <reference path="../Common/ResourceStringProvider.ts" />
/// <reference path="../Common/Telemetry.ts" />
/// <reference path="../../../ClientUtility/Client/Common/DataManager.ts" />
var SLAManagement;
(function (SLAManagement) {
    var Constants = (function () {
        function Constants() {
        }
        return Constants;
    }());
    Constants.activatationInputBag = {
        statecode: 1,
        statuscode: 2
    };
    Constants.dectivatationInputBag = {
        statecode: 0,
        statuscode: 1
    };
    Constants.SLAAdvancedPauseConfiguration = "msdyn_advancedpauseconfiguration";
    Constants.SLAPauseConfigurationXML = "msdyn_pauseconfigurationxml";
    Constants.SLASectionId = "{3c22bc9d-8de9-44ee-a739-8c7d10602c5d}";
    Constants.SLAControlId = "WebResource_preview";
    Constants.SLALabel = "General";
    Constants.FcbSLAEnableProactiveChecks = "SLAEnableProactiveChecks";
    Constants.SLAWebClientDeprecationNotification = "SLAWebClientDeprecationNotification";
    Constants.SLA_WebClientDeprecationNotification = "SLA_WebClientDeprecationNotification";
    Constants.SysAdminRoleName = "SLA_Role_SystemAdministrator";
    Constants.SLA_EnvironmentVariableSchemaName = "msdyn_SLAWebClientDeprecationAcknowledge";
    Constants.SLA_EnvironmentVariableDisplayName = "SLA Web Client Deprecation Acknowledge";
    Constants.SysAdminRoleTemplateId = "627090FF-40A3-4053-8790-584EDC5BE201";
    Constants.SLALimitationsDocsUrl = "https://learn.microsoft.com/dynamics365/customer-service/sla-limitations";
    SLAManagement.Constants = Constants;
    var ActivationLocation;
    (function (ActivationLocation) {
        ActivationLocation[ActivationLocation["HomePageGrid"] = 0] = "HomePageGrid";
        ActivationLocation[ActivationLocation["KPIForm"] = 1] = "KPIForm";
    })(ActivationLocation || (ActivationLocation = {}));
    var WebClientDeprecationState;
    (function (WebClientDeprecationState) {
        WebClientDeprecationState[WebClientDeprecationState["YetToShow"] = 0] = "YetToShow";
        WebClientDeprecationState[WebClientDeprecationState["YetToAcknowledge"] = 1] = "YetToAcknowledge";
        WebClientDeprecationState[WebClientDeprecationState["Acknowledged"] = 2] = "Acknowledged";
        WebClientDeprecationState[WebClientDeprecationState["Canceled"] = 3] = "Canceled";
    })(WebClientDeprecationState = SLAManagement.WebClientDeprecationState || (SLAManagement.WebClientDeprecationState = {}));
    var SLAManagementMainSystemLibraryWebResource = (function () {
        function SLAManagementMainSystemLibraryWebResource() {
        }
        SLAManagementMainSystemLibraryWebResource.isFcbEnabled = function (fcbName) {
            return Xrm.Internal.isUci() ? Xrm.Internal.isFeatureEnabled(fcbName) : Xrm.Internal.isFeatureEnabled("FCB." + fcbName);
        };
        SLAManagementMainSystemLibraryWebResource.EntityRecommendationMessage = function () {
            try {
                if (Xrm.Page.ui.getFormType() == 1) {
                    var entityControl = Xrm.Page.getControl('msdyn_entityname');
                    entityControl.addNotification({
                        messages: [SLAManagement.ResourceStringProvider.getResourceString(SlaKpi.Constants.SLAKPI_RECOMMENDATION_ENTITYNAME)],
                        notificationLevel: 'RECOMMENDATION',
                        uniqueId: 'slakpi_slaforentityrecommendation',
                        actions: null
                    });
                }
            }
            catch (exception) {
                console.log("Error in adding recommendation message for Entity Name field.");
            }
        };
        SLAManagementMainSystemLibraryWebResource.kpifieldRecommendationMessage = function () {
            try {
                if (Xrm.Page.ui.getFormType() == 1) {
                    var entityControl = Xrm.Page.getControl('msdyn_kpifield');
                    entityControl.addNotification({
                        messages: [SLAManagement.ResourceStringProvider.getResourceString(SlaKpi.Constants.SLAKPI_RECOMMENDATION_KPIFIELD)],
                        notificationLevel: 'RECOMMENDATION',
                        uniqueId: 'slakpi_kpiinstancerecommendation',
                        actions: null
                    });
                }
            }
            catch (exception) {
                console.log("Error in adding recommendation message for KPI field.");
            }
        };
        SLAManagementMainSystemLibraryWebResource.onPostSave = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var formParams = Xrm.Utility.getGlobalContext().getQueryStringParameters();
            if (formParams.pageType == "quickcreate") {
                var entityId = formContext.data.entity.getId();
                var entityName = formContext.data.entity.getEntityName();
                var record = {
                    statecode: 1,
                    statuscode: 2
                };
                var successCallback = function () {
                    SLAManagement.Telemetry.logInfo("INFO", {
                        message: "Updated slakpi to active state."
                    });
                };
                var errorCallBack = function () {
                    SLAManagement.Telemetry.logInfo("INFO", {
                        message: "Error in activating slakpi."
                    });
                    Xrm.Navigation.openErrorDialog({ message: SLAManagement.ResourceStringProvider.getResourceString(SlaKpi.Constants.SLAKPI_ACTIVATION_ERROR_MESSAGE) });
                };
                Xrm.WebApi.updateRecord(entityName, entityId, record).then(successCallback, errorCallBack);
            }
        };
        SLAManagementMainSystemLibraryWebResource.showDialog = function (title, text, buttonLabel, inputBagstate, listOfRecords, controlToRefresh, activationLoc) {
            var confirmStrings = { text: text, title: title, confirmButtonLabel: buttonLabel };
            var dialogOptions = {
                width: 500,
                height: 250,
                position: "center"
            };
            Xrm.Navigation.openConfirmDialog(confirmStrings, dialogOptions).then(function (response) {
                if (response.confirmed) {
                    Xrm.Utility.showProgressIndicator(SLAManagement.ResourceStringProvider.getResourceString(SlaKpi.Constants.PROCESSING));
                    for (var i = 0; i < listOfRecords.length; i++) {
                        if (i == listOfRecords.length - 1) {
                            // Validation to check whether form is activating when XML config empty
                            if (activationLoc == ActivationLocation.KPIForm && Xrm.Page.getAttribute(Constants.SLAAdvancedPauseConfiguration) && Xrm.Page.getAttribute(Constants.SLAAdvancedPauseConfiguration).getValue()) {
                                var pauseCriteriaXml = Xrm.Page.getAttribute(Constants.SLAPauseConfigurationXML).getValue();
                                if (!this.isPauseCriteriaValid(pauseCriteriaXml)) {
                                    Xrm.Navigation.openAlertDialog({ text: SLAManagement.ResourceStringProvider.getResourceString(SlaKpi.Constants.SLAITEM_PAUSECONDITIONSEMPTYALERT) });
                                    Xrm.Utility.closeProgressIndicator();
                                    return;
                                }
                            }
                            Xrm.WebApi.updateRecord(listOfRecords[i].TypeName, listOfRecords[i].Id, inputBagstate).then(function (response) {
                                Xrm.Utility.closeProgressIndicator();
                                if (controlToRefresh) {
                                    controlToRefresh.refresh();
                                }
                            }, function (error) {
                                Xrm.Utility.closeProgressIndicator();
                                var alertStrings = { text: error.message, title: SLAManagement.ResourceStringProvider.getResourceString(SlaKpi.Constants.ERROR_TITLE) };
                                Xrm.Navigation.openAlertDialog(alertStrings);
                            });
                        }
                        else {
                            Xrm.WebApi.updateRecord(listOfRecords[i].TypeName, listOfRecords[i].Id, inputBagstate);
                        }
                    }
                }
            }.bind(this));
        };
        SLAManagementMainSystemLibraryWebResource.showSLAWebClientDeprecationNotification = function () {
            try {
                Xrm.WebApi.retrieveMultipleRecords("sla", "?fetchXml=" + SLAManagementMainSystemLibraryWebResource.FETCHXML_ANY_ACTIVE_LEGACY_SLA).then(function success(result) {
                    if (result.entities.length > 0) {
                        var notificationMessage = SLAManagement.ResourceStringProvider.getResourceString(Constants.SLA_WebClientDeprecationNotification);
                        notificationMessage = notificationMessage.replace("{0}", ClientUtility.DataManager.getMSDocsRedirectBaseURL() + "/fwlink/p/?linkid=2198689");
                        Xrm.Page.ui.setFormNotification(notificationMessage, "WARNING", Constants.SLAWebClientDeprecationNotification);
                        SLAManagementMainSystemLibraryWebResource.openSLAWebClientDeprecationAckDialog();
                    }
                }, function error(error) {
                    console.log("Error in adding web client SLA deprecation notification in SLAKPI form. " + error);
                });
            }
            catch (exception) {
                console.log("Error in adding web client SLA deprecation notification in SLAKPI form.");
            }
        };
        SLAManagementMainSystemLibraryWebResource.openSLAWebClientDeprecationAckDialog = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isUserHasSystemAdminRole, envVariableValue, navigationOptions, pageInput, exception_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, SLAManagementMainSystemLibraryWebResource.isUserHasSystemAdminRole()];
                        case 1:
                            isUserHasSystemAdminRole = _a.sent();
                            if (!isUserHasSystemAdminRole) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.getEnvironmentVariableValue(Constants.SLA_EnvironmentVariableSchemaName)];
                        case 2:
                            envVariableValue = _a.sent();
                            if (envVariableValue != WebClientDeprecationState.Acknowledged) {
                                navigationOptions = {
                                    target: 2,
                                    position: 1,
                                    width: { value: 600, unit: "px" },
                                    height: { value: 200, unit: "px" }
                                };
                                pageInput = {
                                    pageType: "webresource",
                                    webresourceName: "ServiceLevelAgreement/Sla/msdyn_SLAWebClientDeprecationAckDialog.html",
                                };
                                if (envVariableValue != WebClientDeprecationState.Canceled && envVariableValue != WebClientDeprecationState.YetToAcknowledge) {
                                    this.setEnvironmentVariableValue(Constants.SLA_EnvironmentVariableSchemaName, Constants.SLA_EnvironmentVariableDisplayName, WebClientDeprecationState.YetToAcknowledge.toString());
                                }
                                Xrm.Navigation.navigateTo(pageInput, navigationOptions);
                            }
                            _a.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            exception_1 = _a.sent();
                            console.log("SLAKPI::openSLAWebClientDeprecationAckDialog:Error in opening SLA web client deprecation acknowledge dialog. " + exception_1);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        SLAManagementMainSystemLibraryWebResource.isUserHasSystemAdminRole = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isAdminUser_1, userSettings, fetchXml, exception_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            isAdminUser_1 = false;
                            userSettings = Xrm.Utility.getGlobalContext().userSettings;
                            fetchXml = SLAManagementMainSystemLibraryWebResource.FETCHXML_USER_ROLE_TEMPLATE_ID.replace(/\{0}/g, userSettings.userId);
                            fetchXml = fetchXml.replace(/[\t\n]/gm, "");
                            return [4 /*yield*/, Xrm.WebApi.retrieveMultipleRecords("role", "?fetchXml=" + fetchXml).then(function success(result) {
                                    if (result.entities.length > 0) {
                                        if (!!result.entities.find(function (entity) { return entity._roletemplateid_value === Constants.SysAdminRoleTemplateId || entity._roletemplateid_value === Constants.SysAdminRoleTemplateId.toLowerCase(); })) {
                                            isAdminUser_1 = true;
                                        }
                                    }
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, isAdminUser_1];
                        case 2:
                            exception_2 = _a.sent();
                            console.log("SLAKPI::isUserHasSystemAdminRole: Error in checking user's admin role " + exception_2);
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Getting environment variable value
         */
        SLAManagementMainSystemLibraryWebResource.getEnvironmentVariableValue = function (schemaName) {
            return __awaiter(this, void 0, void 0, function () {
                var envVaribleValue, envVaribaleDefinition, envVaribleDefinitionEntity;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            envVaribleValue = null;
                            return [4 /*yield*/, Xrm.WebApi.retrieveMultipleRecords("environmentvariabledefinition", "?$top=1" +
                                    "&$select=environmentvariabledefinitionid,defaultvalue" +
                                    "&$expand=environmentvariabledefinition_environmentvariablevalue($select=value)" +
                                    ("&$filter=schemaname eq '" + schemaName + "'"))];
                        case 1:
                            envVaribaleDefinition = _a.sent();
                            if (envVaribaleDefinition && envVaribaleDefinition.entities && envVaribaleDefinition.entities.length > 0) {
                                envVaribleDefinitionEntity = envVaribaleDefinition.entities[0];
                                // Use the default value only if no related values
                                envVaribleValue = envVaribleDefinitionEntity.defaultvalue;
                                // Get the related value if provided
                                if (envVaribleDefinitionEntity.environmentvariabledefinition_environmentvariablevalue.length > 0) {
                                    envVaribleValue = envVaribleDefinitionEntity.environmentvariabledefinition_environmentvariablevalue[0].value;
                                }
                            }
                            return [2 /*return*/, envVaribleValue];
                    }
                });
            });
        };
        /**
         * Creating\Setting environment variable value
         */
        SLAManagementMainSystemLibraryWebResource.setEnvironmentVariableValue = function (schemaName, displayName, value) {
            return __awaiter(this, void 0, void 0, function () {
                var envVariableDefinition, envVaribleDefinitionEntity, definitionId, valueId, attributes, attributes, envVarDefResponse, envVarValAttributes;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Xrm.WebApi.retrieveMultipleRecords("environmentvariabledefinition", "?$top=1" +
                                "&$select=environmentvariabledefinitionid" +
                                "&$expand=environmentvariabledefinition_environmentvariablevalue($select=environmentvariablevalueid)" +
                                ("&$filter=schemaname eq '" + schemaName + "'"))];
                        case 1:
                            envVariableDefinition = _a.sent();
                            if (!(envVariableDefinition && envVariableDefinition.entities && envVariableDefinition.entities.length > 0)) return [3 /*break*/, 2];
                            envVaribleDefinitionEntity = envVariableDefinition.entities[0];
                            definitionId = envVaribleDefinitionEntity.environmentvariabledefinitionid;
                            if (envVaribleDefinitionEntity.environmentvariabledefinition_environmentvariablevalue.length > 0) {
                                valueId = envVaribleDefinitionEntity.environmentvariabledefinition_environmentvariablevalue[0].environmentvariablevalueid;
                                Xrm.WebApi.updateRecord("environmentvariablevalue", valueId, { "value": value });
                            }
                            else {
                                attributes = {
                                    "value": value,
                                    "EnvironmentVariableDefinitionId@odata.bind": "/environmentvariabledefinitions(" + definitionId + ")"
                                };
                                Xrm.WebApi.createRecord("environmentvariablevalue", attributes);
                            }
                            return [3 /*break*/, 5];
                        case 2:
                            attributes = {
                                "schemaname": schemaName,
                                "displayname": displayName,
                                "defaultvalue": "0"
                            };
                            return [4 /*yield*/, Xrm.WebApi.createRecord("environmentvariabledefinition", attributes)];
                        case 3:
                            envVarDefResponse = _a.sent();
                            envVarValAttributes = {
                                "value": value,
                                "EnvironmentVariableDefinitionId@odata.bind": "/environmentvariabledefinitions(" + envVarDefResponse.id + ")"
                            };
                            return [4 /*yield*/, Xrm.WebApi.createRecord("environmentvariablevalue", envVarValAttributes)];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        // show proactive notification when we detect if SLA KPI has configured pause condition with related entities 
        SLAManagementMainSystemLibraryWebResource.showNotificationIfSLAKPIHasRelatedEntityCondition = function () {
            return __awaiter(this, void 0, void 0, function () {
                var recordId, fetchXml, exception_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            recordId = Xrm.Page.data.entity.getId();
                            fetchXml = SLAManagementMainSystemLibraryWebResource.FETCHXML_SLAKPI.replace("@slakpiId", recordId);
                            return [4 /*yield*/, Xrm.WebApi.retrieveMultipleRecords("msdyn_slakpi", "?fetchXml=" + fetchXml).then(function success(result) {
                                    if (result.entities.length > 0) {
                                        var slaKPI = result.entities[0];
                                        if (slaKPI) {
                                            if (SLAManagementMainSystemLibraryWebResource.checkLinkEntityExistsInFetchXML(slaKPI.msdyn_pauseconfigurationxml)) {
                                                var notificationMessage = SLAManagement.ResourceStringProvider.getResourceString(SlaKpi.Constants.SLAKPI_RelatedEntitiesNotification);
                                                notificationMessage = notificationMessage.replace("{0}", slaKPI.msdyn_name).replace("Item", "KPI");
                                                notificationMessage = notificationMessage.replace("{1}", Constants.SLALimitationsDocsUrl);
                                                Xrm.Page.ui.setFormNotification(notificationMessage, "WARNING", SlaKpi.Constants.SLAKPI_RelatedEntitiesNotification);
                                            }
                                        }
                                    }
                                }, function error(error) {
                                    console.log(error, SlaKpi.Constants.SLAKPI_RelatedEntitiesNotification);
                                })];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            exception_3 = _a.sent();
                            SLAManagement.Telemetry.logError(SlaKpi.Constants.SLAKPI_RelatedEntitiesNotification, {
                                "Feature": "SLA",
                                "Log": "Error in checkIfSLAKPIHasRelatedEntityConfiguration",
                                "Error": exception_3
                            });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return SLAManagementMainSystemLibraryWebResource;
    }());
    // fetchXML for retrieve any active legacy SLAs
    SLAManagementMainSystemLibraryWebResource.FETCHXML_ANY_ACTIVE_LEGACY_SLA = "<fetch version=\"1.0\" output-format=\"xml-platform\" top=\"1\" mapping=\"logical\" distinct=\"false\">\n                <entity name=\"sla\">\n                    <attribute name=\"name\" />\n                    <attribute name=\"slaid\" />\n                    <filter type=\"and\">\n                        <condition attribute=\"statecode\" operator=\"eq\" value=\"1\"/>\n                    </filter>\n                    <filter type=\"or\">\n                        <condition attribute=\"slaversion\" operator=\"null\"/>\n                        <condition attribute=\"slaversion\" operator=\"eq\" value=\"100000000\"/>\n                    </filter>\n                </entity>\n            </fetch>";
    SLAManagementMainSystemLibraryWebResource.FETCHXML_USER_ROLE_TEMPLATE_ID = "<fetch version='1.0' distinct='false' no-lock='false' mapping='logical'>\n\t\t\t\t<entity name='role'>\n\t\t\t\t\t<attribute name='roletemplateid' />\n\t\t\t\t\t<link-entity name='systemuserroles' to='roleid' from='roleid' link-type='inner'>\n\t\t\t\t\t\t<filter type='and'>\n\t\t\t\t\t\t\t<condition attribute='systemuserid' operator= 'eq' value='{0}' />\n\t\t\t\t\t\t</filter>\n\t\t\t\t\t</link-entity>\n\t\t\t\t</entity>\n\t\t\t</fetch>";
    SLAManagementMainSystemLibraryWebResource.FETCHXML_SLAKPI = "<fetch version=\"1.0\" output-format=\"xml-platform\" mapping=\"logical\" distinct=\"false\">\n                <entity name=\"msdyn_slakpi\">\n                    <attribute name=\"msdyn_slakpiid\"/>\n                    <attribute name=\"msdyn_name\"/>\n                    <attribute name=\"msdyn_pauseconfigurationxml\"/>\n                    <filter type=\"and\">\n                        <condition attribute=\"msdyn_slakpiid\" operator=\"eq\" uitype=\"msdyn_slakpi\" value=\"@slakpiId\"/>\n                    </filter>\n                </entity>\n            </fetch>";
    SLAManagementMainSystemLibraryWebResource.form_onload = function (formContext) {
        // TODO: Replace magic number for getFormType()
        if (Xrm.Page.ui.getFormType() === 1) {
            var advancedPauseToggleControl = Xrm.Page.getControl(Constants.SLAAdvancedPauseConfiguration);
            var pauseConfigurationControl = Xrm.Page.getControl(Constants.SLAPauseConfigurationXML);
            if (advancedPauseToggleControl != null && pauseConfigurationControl != null) {
                Xrm.Page.getControl(Constants.SLAAdvancedPauseConfiguration).setVisible(false);
                Xrm.Page.getControl(Constants.SLAPauseConfigurationXML).setVisible(false);
            }
        }
        else {
            // TODO: Replace magic strings
            Xrm.Page.ui.tabs.get("General").sections.get("PauseConfiguration").setVisible(true);
            Xrm.Page.getControl(Constants.SLAAdvancedPauseConfiguration).setVisible(true);
            var value = Xrm.Page.getAttribute(Constants.SLAAdvancedPauseConfiguration).getValue();
            if (value == true) {
                Xrm.Page.ui.controls.get(Constants.SLAPauseConfigurationXML).setVisible(true);
            }
            else {
                Xrm.Page.ui.controls.get(Constants.SLAPauseConfigurationXML).setVisible(false);
            }
        }
        if (SLAManagementMainSystemLibraryWebResource.isFcbEnabled(Constants.FcbSLAEnableProactiveChecks)) {
            SLAManagementMainSystemLibraryWebResource.EntityRecommendationMessage();
            SLAManagementMainSystemLibraryWebResource.kpifieldRecommendationMessage();
            SLAManagementMainSystemLibraryWebResource.showNotificationIfSLAKPIHasRelatedEntityCondition();
        }
        if (Xrm.Page.ui.getFormType() !== 1) {
            Xrm.Page.ui.tabs.get(Constants.SLALabel).sections.get(Constants.SLASectionId).controls.get(Constants.SLAControlId).setVisible(false);
        }
        if (SLAManagementMainSystemLibraryWebResource.isFcbEnabled(Constants.FcbSLAEnableProactiveChecks)) {
            // show legacy SLA deprecation notificaiton in UCI if any legacy SLA existed
            SLAManagementMainSystemLibraryWebResource.showSLAWebClientDeprecationNotification();
        }
        var formContext = formContext || Xrm.Page;
        formContext.data.entity.addOnPostSave(SLAManagementMainSystemLibraryWebResource.onPostSave);
    };
    SLAManagementMainSystemLibraryWebResource.onChangeAdvancedPauseConfiguration = function (context) {
        var value = Xrm.Page.getAttribute(Constants.SLAAdvancedPauseConfiguration).getValue();
        if (value == false) {
            Xrm.Page.ui.controls.get(Constants.SLAPauseConfigurationXML).getAttribute().setValue(null);
            Xrm.Page.ui.controls.get(Constants.SLAPauseConfigurationXML).setVisible(false);
        }
        else {
            Xrm.Page.ui.controls.get(Constants.SLAPauseConfigurationXML).setVisible(true);
        }
    };
    SLAManagementMainSystemLibraryWebResource.activateSLAClick = function (entityId, entityName) {
        var list = [];
        list[0] = { TypeName: entityName, Id: entityId };
        SLAManagementMainSystemLibraryWebResource.showDialog(SLAManagement.ResourceStringProvider.getResourceString(SlaKpi.Constants.ACTIVATE_TITLE), SLAManagement.ResourceStringProvider.getResourceString(SlaKpi.Constants.ACTIVATE_MESSAGE).replace("{0}", "1"), SLAManagement.ResourceStringProvider.getResourceString(SlaKpi.Constants.ACTIVATE), Constants.activatationInputBag, list, Xrm.Page.ui, ActivationLocation.KPIForm);
    };
    SLAManagementMainSystemLibraryWebResource.deactivateSLAClick = function (entityId, entityName) {
        var list = [];
        list[0] = { TypeName: entityName, Id: entityId };
        SLAManagementMainSystemLibraryWebResource.showDialog(SLAManagement.ResourceStringProvider.getResourceString(SlaKpi.Constants.DEACTIVATE_TITLE), SLAManagement.ResourceStringProvider.getResourceString(SlaKpi.Constants.DEACTIVATE_MESSAGE).replace("{0}", "1"), SLAManagement.ResourceStringProvider.getResourceString(SlaKpi.Constants.DEACTIVATE), Constants.dectivatationInputBag, list, Xrm.Page.ui, ActivationLocation.KPIForm);
    };
    SLAManagementMainSystemLibraryWebResource.gridActivateSLAClick = function (records, entityName, gridControl) {
        SLAManagementMainSystemLibraryWebResource.showDialog(SLAManagement.ResourceStringProvider.getResourceString(SlaKpi.Constants.ACTIVATE_TITLE), SLAManagement.ResourceStringProvider.getResourceString(SlaKpi.Constants.ACTIVATE_MESSAGE).replace("{0}", records.length.toString()), SLAManagement.ResourceStringProvider.getResourceString(SlaKpi.Constants.ACTIVATE), Constants.activatationInputBag, records, gridControl, ActivationLocation.HomePageGrid);
    };
    SLAManagementMainSystemLibraryWebResource.gridDeactivateSLAClick = function (records, entityName, gridControl) {
        SLAManagementMainSystemLibraryWebResource.showDialog(SLAManagement.ResourceStringProvider.getResourceString(SlaKpi.Constants.DEACTIVATE_TITLE), SLAManagement.ResourceStringProvider.getResourceString(SlaKpi.Constants.DEACTIVATE_MESSAGE).replace("{0}", records.length.toString()), SLAManagement.ResourceStringProvider.getResourceString(SlaKpi.Constants.DEACTIVATE), Constants.dectivatationInputBag, records, gridControl, ActivationLocation.HomePageGrid);
    };
    SLAManagementMainSystemLibraryWebResource.isPauseCriteriaValid = function (pauseCriteriaXml) {
        if (pauseCriteriaXml && pauseCriteriaXml.indexOf("condition") != -1 && pauseCriteriaXml.indexOf("operator") != -1)
            return true;
        return false;
    };
    // check whether fetch xml contains link-entity or not
    SLAManagementMainSystemLibraryWebResource.checkLinkEntityExistsInFetchXML = function (fetchXml) {
        if (fetchXml != null && fetchXml.indexOf("link-entity") != -1) {
            return true;
        }
        else {
            return false;
        }
    };
    SLAManagement.SLAManagementMainSystemLibraryWebResource = SLAManagementMainSystemLibraryWebResource;
})(SLAManagement || (SLAManagement = {}));
//# sourceMappingURL=SLAManagement_main_system_library.js.map