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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var ClientUtility;
(function (ClientUtility) {
    var DataUtil = (function () {
        function DataUtil() {
        }
        /**
         * Checks whether an object is null.
         * @param object The object to check.
         * @returns A flag indicating whether the object is null.
         */
        DataUtil.isNull = function (object) {
            return object === null;
        };
        /**
         * Checks whether an object is undefined.
         * @param object The object to check.
         * @returns A flag indicating whether the object is undefined.
         */
        DataUtil.isUndefined = function (object) {
            return object === undefined;
        };
        /**
         * Checks whether an object is null or undefined.
         * @param object The object to check.
         * @returns A flag indicating whether the object is null or undefined.
         */
        DataUtil.isNullOrUndefined = function (object) {
            return object === null || object === undefined;
        };
        /**
         * Checks whether an object is an undefined, null or empty string.
         * @param object The object to check.
         * @returns A flag indicating whether the object is undefined, null or an empty string.
         */
        DataUtil.isNullOrEmptyString = function (object) {
            return DataUtil.isNullOrUndefined(object) || object === "";
        };
        /**
         * Checks whether an object is an null, an empty or whitespace string.
         * @param object The object to check.
         * @returns A Boolean value indicating whether the object is null, an empty or whitespace string.
         */
        DataUtil.isNullOrWhiteSpace = function (value) {
            return DataUtil.isNullOrEmptyString(value) || (DataUtil.isString(value) && value.trim() == "");
        };
        /**
         * Tries to convert an object to string
         * @param object The object to convert.
         * @returns Returns the object converted to string or the object itself if this is null or undefined.
         */
        DataUtil.toStringWithNullCheck = function (object) {
            return DataUtil.isNullOrUndefined(object) ? object : object.toString();
        };
        /**
         * Checks if a given object is a string
         * @param object The object check.
         * @returns true if the object is a string; otherwise, false.
         */
        DataUtil.isString = function (object) {
            return typeof object === 'string' || object instanceof String;
        };
        return DataUtil;
    }());
    DataUtil.EmptyString = "";
    ClientUtility.DataUtil = DataUtil;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="DataUtil.ts" />
var ClientUtility;
(function (ClientUtility) {
    var DateValidation = (function () {
        function DateValidation() {
        }
        DateValidation.validateStartDateIsSmallerThanEndDate = function (oStartDate, oEndDate, errorMessage, oDateToClear) {
            var startDate = oStartDate.getValue();
            var endDate = oEndDate.getValue();
            if (startDate && endDate && endDate < startDate) {
                var alertStrings = {
                    text: errorMessage
                };
                Xrm.Navigation.openAlertDialog(alertStrings);
                oDateToClear.setValue(null);
                oDateToClear.fireOnChange();
            }
        };
        DateValidation.isStartDateLessThanEndDate = function (oBeginDate, oEndDate, fixBeginDate, oBeginDateValue, oEndDateValue, errorMessage) {
            if (!ClientUtility.DataUtil.isNullOrUndefined(oBeginDate.getValue()) && !ClientUtility.DataUtil.isNullOrUndefined(oEndDate.getValue()) && oBeginDate.getValue() > oEndDate.getValue()) {
                var alertStrings = {
                    text: errorMessage
                };
                Xrm.Navigation.openAlertDialog(alertStrings, null);
                if (fixBeginDate) {
                    oBeginDate.setValue(oBeginDateValue);
                }
                else {
                    oEndDate.setValue(oEndDateValue);
                }
                return false;
            }
            return true;
        };
        return DateValidation;
    }());
    ClientUtility.DateValidation = DateValidation;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var ClientUtility;
(function (ClientUtility) {
    /**
    * Entity names constants used in Common solution
    */
    var EntityNames = (function () {
        function EntityNames() {
        }
        return EntityNames;
    }());
    EntityNames.Account = "account";
    EntityNames.ActivityMimeAttachment = "activitymimeattachment";
    EntityNames.ActivityParty = "activityparty";
    EntityNames.Connection = "connection";
    EntityNames.ConnectionRole = "connectionrole";
    EntityNames.Contact = "contact";
    EntityNames.DynamicProperty = "dynamicproperty";
    EntityNames.KnowledgeArticle = "knowledgearticle";
    EntityNames.Lead = "lead";
    EntityNames.Organization = "organization";
    EntityNames.Product = "product";
    EntityNames.ProductAssociation = "productassociation";
    EntityNames.PriceLevel = "pricelevel";
    EntityNames.SystemUser = "systemuser";
    EntityNames.TransactionCurrency = "transactioncurrency";
    EntityNames.UoM = "uom";
    EntityNames.UoMSchedule = "uomschedule";
    ClientUtility.EntityNames = EntityNames;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sla;
(function (Sla) {
    var EntityTypeCodes;
    (function (EntityTypeCodes) {
        EntityTypeCodes[EntityTypeCodes["Incident"] = 112] = "Incident";
        EntityTypeCodes[EntityTypeCodes["SLA"] = 9750] = "SLA";
    })(EntityTypeCodes = Sla.EntityTypeCodes || (Sla.EntityTypeCodes = {}));
    var EntityTypeCodeStrings = (function () {
        function EntityTypeCodeStrings() {
        }
        return EntityTypeCodeStrings;
    }());
    EntityTypeCodeStrings.Incident = "112";
    EntityTypeCodeStrings.SLA = "9750";
    Sla.EntityTypeCodeStrings = EntityTypeCodeStrings;
})(Sla || (Sla = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sla;
(function (Sla) {
    var EntityNames = (function () {
        function EntityNames() {
        }
        return EntityNames;
    }());
    EntityNames.SLA = "sla";
    Sla.EntityNames = EntityNames;
})(Sla || (Sla = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sla;
(function (Sla) {
    var SLAState;
    (function (SLAState) {
        SLAState[SLAState["draft"] = 0] = "draft";
        SLAState[SLAState["active"] = 1] = "active";
    })(SLAState = Sla.SLAState || (Sla.SLAState = {}));
})(Sla || (Sla = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
var Sla;
(function (Sla) {
    Sla.TelemetryConstants = {
        UCContext: "AutoFixUpUC",
        UCPrefix: "msdyn.AutoFixUpUC"
    };
    Sla.TelemetryErrors = {
        IncidentPluginError: "IncidentPluginError",
        CustomEntityPluginError: "CustomEntityPluginError",
        SLAFailToShowNotificationError: "SLAFailToShowNotificationError"
    };
    Sla.CommonSource = {
        SLAInactiveSDKStepsIncident: "SLAInactiveSDKStepsIncident",
        SLAInactiveSDKStepsCustomEntity: "SLAInactiveSDKStepsCustomEntity",
        SLAActivationSuccessful: "SLAActivationSuccessful",
        SLAActivationFailed: "SLAActivationFailed",
        SLASettingsDisable: "SLASettingsDisable",
        SLAInactiveSDKStepsPlugins: "SLAInactiveSDKStepsPlugins",
        SLAInactiveWorkflows: "SLAInactiveWorkflows",
        SLAFailToShowNotification: "SLAFailToShowNotification",
        SLAInactiveStaticWorkflow: "SLAInactiveStaticWorkflow",
        SLAInactiveActionWorkflow: "SLAInactiveActionWorkflow",
        SLAInactiveCustomTimeCalculationWorkflow: "SLAInactiveCustomTimeCalculationWorkflow",
        SLAInactiveWorkflowOwnerDisabled: "SLAInactiveWorkflowOwnerDisabled",
        NoSLASetAsDefault: "NoSLASetAsDefault",
        SLAWebClientDeprecationNotification: "SLAWebClientDeprecationNotification",
        SLAChangedAttribiteNullNotification: "SLAChangedAttribiteNullNotification",
        SLARelatedEntitiesNotification: "SLARelatedEntitiesNotification",
        SLAWorkingHoursEmptyNotification: "WorkingHoursEmptyNotification",
    };
    Sla.CommonParameters = {
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
                _a[Sla.CommonParameters.Source] = source,
                _a[Sla.CommonParameters.Error] = errorParam,
                _a[Sla.CommonParameters.Parameters] = params,
                _a);
            Telemetry.logInternal(Sla.CommonParameters.Error, errorMarker)();
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
                _a[Sla.CommonParameters.Source] = source,
                _a[Sla.CommonParameters.Warning] = warningParam,
                _a[Sla.CommonParameters.Parameters] = params,
                _a);
            Telemetry.logInternal(Sla.CommonParameters.Warning, warningMarker)();
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
                _a[Sla.CommonParameters.Source] = source,
                _a[Sla.CommonParameters.Info] = infoParam,
                _a[Sla.CommonParameters.Parameters] = params,
                _a);
            Telemetry.logInternal(Sla.CommonParameters.Info, infoMarker)();
            var _a;
        };
        /**
         * Logs duration marker
         * @param source
         * @param params
         */
        Telemetry.startTimer = function (source, params) {
            var marker = (_a = {},
                _a[Sla.CommonParameters.Source] = source,
                _a[Sla.CommonParameters.Parameters] = params,
                _a);
            return Telemetry.logInternal(Sla.CommonParameters.Marker, marker);
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
    Sla.Telemetry = Telemetry;
})(Sla || (Sla = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../../ClientUtility/Client/Common/DataUtil.ts" />
/// <reference path="../../../../ClientUtility/Client/Common/DateValidation.ts" />
/// <reference path="../../../../ClientUtility/Client/Common/EntityNames.ts" />
/// <reference path="../../Common/EntityTypeCodes.ts" />
/// <reference path="../../Common/EntityNames.ts" />
/// <reference path="../../Common/EntityStates.ts" />
/// <reference path="../../Common/Telemetry.ts" />
var Sla;
(function (Sla) {
    /**
  * Main web resource library for Sla
  */
    var SlaMainSystemLibraryBase = (function () {
        function SlaMainSystemLibraryBase() {
            this.enhancedSlaFcb = "FCB.SLAV2";
            this._legacyObjectTypeCode = "0";
            this._fcbSLAEnableProactiveChecks = "SLAEnableProactiveChecks";
            this.applicableFromPicklistOnchange = function () {
            };
            this.businessHoursIdOnclick = function () {
            };
            this.formOnload = function () {
            };
            this.formOnsave = function () {
            };
            this.formOnchange = function () {
            };
            this.updateIfSlaActive = function (slaId, entityName, columnNames, isForm, gridControl, records, entityTypeCode) {
            };
            this.updateSlaIfNoDefaultSlaExists = function (gridControl, records, entityTypeCode, slaId, entityName, isForm, currentTypeCode) {
            };
            this.isFcbEnabled = function (fcbName) {
            };
            this.isUserHasSystemAdminRole = function () {
            };
        }
        return SlaMainSystemLibraryBase;
    }());
    // dependencies for legacy & Modern SLA
    // PostOperationIncidentCreateEntitlement
    SlaMainSystemLibraryBase.INCIDENT_POST_CREATE_PLUGIN_SDK_MESSAGE_ID = "8fbadfbe-c104-e711-80ca-02155dc812c3";
    //PostOperationIncidentUpdateEntitlement
    SlaMainSystemLibraryBase.INCIDENT_POST_UPDATE_PLUGIN_SDK_MESSAGE_ID = "a468c44e-c204-e711-80ca-02155dc812c3";
    // SlaPreCreatePlugin
    SlaMainSystemLibraryBase.CUSTOM_ENTITY_PRE_CREATE_PLUGIN_TYPE_ID = "7c4799d6-1e66-447e-90f6-c06a7a839b8c";
    // SlaPostCreatePlugin
    SlaMainSystemLibraryBase.CUSTOM_ENTITY_POST_CREATE_PLUGIN_TYPE_ID = "8bc09e08-a763-4400-987c-4e80ba2c56b6";
    // SlaPreUpdatePlugin
    SlaMainSystemLibraryBase.CUSTOM_ENTITY_PRE_UPDATE_PLUGIN_TYPE_ID = "24e45b95-14e6-45bb-9da8-2ac76e7ce809";
    // SlaPostUpdatePlugin
    SlaMainSystemLibraryBase.CUSTOM_ENTITY_POST_UPDATE_PLUGIN_TYPE_ID = "1cd2fe49-b61c-46e2-9a2f-d27237b7973b";
    // fetchXML for retrieve 2 SDK steps for incident plugins
    SlaMainSystemLibraryBase.FETCHXML_SDK_MESSAGE_STEP_INCIDENT_ENTITY = "<fetch version='1.0' output-format='xml-platform' top='2' mapping='logical' distinct='false'>\n              <entity name='sdkmessageprocessingstep' >\n              <attribute name='sdkmessageprocessingstepid' />\n              <attribute name='statecode' />\n              <attribute name='statuscode' />\n                <filter type='and' >\n                  <condition attribute=\"sdkmessageprocessingstepid\" operator=\"in\">\n                    <value>{" + SlaMainSystemLibraryBase.INCIDENT_POST_CREATE_PLUGIN_SDK_MESSAGE_ID + "}</value>\n                    <value>{" + SlaMainSystemLibraryBase.INCIDENT_POST_UPDATE_PLUGIN_SDK_MESSAGE_ID + "}</value>\n                  </condition>\n                </filter>\n              </entity>\n          </fetch>";
    // fetchXML for retrieve 4 SDK steps for global plugins.
    // we are using Plugin type to find SDK messages, as registration is done dynamically
    // so SDK messages ID may be different each time. so fetch using Plugin type id.
    SlaMainSystemLibraryBase.FETCHXML_SDK_MESSAGE_STEP_CUSTOM_ENTITY = "<fetch version='1.0' output-format='xml-platform' top='4' mapping='logical' distinct='false'>\n              <entity name='sdkmessageprocessingstep' >\n              <attribute name='sdkmessageprocessingstepid' />\n              <attribute name='statecode' />\n              <attribute name='statuscode' />\n              <attribute name='eventhandler' />\n                <filter type='and' >\n                  <condition attribute=\"eventhandler\" operator=\"in\">\n                    <value>{" + SlaMainSystemLibraryBase.CUSTOM_ENTITY_PRE_CREATE_PLUGIN_TYPE_ID + "}</value>\n                    <value>{" + SlaMainSystemLibraryBase.CUSTOM_ENTITY_PRE_UPDATE_PLUGIN_TYPE_ID + "}</value>\n                    <value>{" + SlaMainSystemLibraryBase.CUSTOM_ENTITY_POST_CREATE_PLUGIN_TYPE_ID + "}</value>\n                    <value>{" + SlaMainSystemLibraryBase.CUSTOM_ENTITY_POST_UPDATE_PLUGIN_TYPE_ID + "}</value>\n                  </condition>\n                </filter>\n                <link-entity name=\"sdkmessagefilter\" from=\"sdkmessagefilterid\" to=\"sdkmessagefilterid\" link-type=\"inner\">\n                  <filter type=\"and\">\n                    <condition attribute=\"primaryobjecttypecode\" operator=\"eq\" value=\"{0}\"/>\n                  </filter>\n                </link-entity>\n              </entity>\n          </fetch>";
    Sla.SlaMainSystemLibraryBase = SlaMainSystemLibraryBase;
})(Sla || (Sla = {}));
var Sla;
(function (Sla) {
    var Constants = (function () {
        function Constants() {
        }
        return Constants;
    }());
    Constants.SLA_DefaultSLASelectionConfirmDialogText = "SLA_DefaultSLASelectionConfirmDialogText";
    Constants.SLA_DefaultSLASelectionConfirmDialogTitle = "SLA_DefaultSLASelectionConfirmDialogTitle";
    Constants.SLA_DefaultSLAOverrideConfirmDialogText = "SLA_DefaultSLAOverrideConfirmDialogText";
    Constants.SLA_DefaultSLAOverrideConfirmDialogTitle = "SLA_DefaultSLAOverrideConfirmDialogTitle";
    Constants.SLA_SettingInactiveSLAAsDefaultAlertText = "SLA_SettingInactiveSLAAsDefaultAlertText";
    Constants.SLA_SettingInactiveSLAAsDefaultAlertTitle = "SLA_SettingInactiveSLAAsDefaultAlertTitle";
    Constants.SLA_DefaultSLAWarning = "SLA_DefaultSLAWarning";
    Constants.SLA_DefaultSLASetttingInProgress = "SLA_DefaultSLASetttingInProgress";
    Constants.SLA_ErrorResettingDefaultSLA = "SLA_ErrorResettingDefaultSLA";
    Constants.SLA_ErrorSettingNewSLA = "SLA_ErrorSettingNewSLA";
    Constants.SLA_CannotBeEditedInUnifiedClient = "SLA_Cannot_Edit_In_UC";
    Constants.SLA_CannotBeEditedInWebClient = "SLA_Cannot_Edit_In_WC";
    Constants.SLA_SDKMessagingStepNotInActiveState = "SDKMessagingStepNotInActiveState";
    Constants.SLA_WorkflowNotInActiveState = "WorkflowNotInActiveState";
    Constants.SLA_WorkflowOwnerIsDisabled = "WorkflowOwnerIsDisabled";
    Constants.SLA_SLAIsDisabledInSetting = "SLAIsDisabledInSetting";
    Constants.SLA_NoSLASetAsDefault = "NoSLASetAsDefault";
    Constants.SLA_OpenLearnMoreForSetAsDefaultSLA = "OpenLearnMoreForSetAsDefaultSLA";
    Constants.Activate = "SLAKPI_Activate";
    Constants.SLAKPI_RECOMMENDATION_PRIMARY_ENTITY = "SLAKPI_Recommendation_PrimaryEntity";
    Constants.SLA_WebClientDeprecationNotification = "SLA_WebClientDeprecationNotification";
    Constants.SLA_EnvironmentVariableSchemaName = "msdyn_SLAWebClientDeprecationAcknowledge";
    Constants.SLA_EnvironmentVariableDisplayName = "SLA Web Client Deprecation Acknowledge";
    Constants.SLA_ChangedAttribiteNullNotification = "SLA_ChangedAttribiteNullNotification";
    Constants.SLA_RelatedEntitiesNotification = "SLA_RelatedEntitiesNotification";
    Constants.SLA_DisableLegacyCreateSLADialogDepreciationText = "SLA_DisableLegacyCreateSLADialogDepreciationText";
    Constants.SLA_DisableLegacyCreateSLADialogConfirmationText = "SLA_DisableLegacyCreateSLADialogConfirmationText";
    Constants.SLA_WorkingHoursEmptyNotification = "SLAWorkingHoursEmptyNotification";
    Sla.Constants = Constants;
})(Sla || (Sla = {}));
var SlaItem;
(function (SlaItem) {
    var Constants = (function () {
        function Constants() {
        }
        return Constants;
    }());
    Constants.SLAItem_ConfigureActionsGeneralNotification = "SLAItem_ConfigureActionsGeneralNotification";
    Constants.SLAItem_ConfigureActionsSetupNotification = "SLAItem_ConfigureActionsSetupNotification";
    Constants.SLAItem_WarningTimeHigherThanFailureTimeAlert = "SLAItem_WarningTimeHigherThanFailureTimeAlert";
    Constants.SLAItem_SuccessConditionsEmptyAlert = "SLAItem_SuccessConditionsEmptyAlert";
    Constants.SLAItem_PauseConditionsEmptyAlert = "SLAItem_PauseConditionsEmptyAlert";
    Constants.SLAItem_KPIEmptyAlert = "SLAItem_KPIEmptyAlert";
    Constants.SLAItem_Notification_SLA_ActivatedState = "SLAItem_Notification_SLA_ActivatedState";
    Constants.SLAItem_ConditionOnSameAttributeAlert = "SLAItem_ConditionOnSameAttributeAlert";
    Constants.SLAItem_ApplicableAndSuccessSameAttribute = "SLAItem_ApplicableAndSuccessSameAttribute";
    Constants.SLAItem_UnderNotUnderDirectUseError = "SLAItem_UnderNotUnderDirectUseError";
    SlaItem.Constants = Constants;
})(SlaItem || (SlaItem = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sla;
(function (Sla) {
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
    Sla.ResourceStringProvider = ResourceStringProvider;
})(Sla || (Sla = {}));
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
/// <reference path="../../../../ClientUtility/Client/Common/DataManager.ts" />
var Sla;
(function (Sla) {
    var WebClientDeprecationState;
    (function (WebClientDeprecationState) {
        WebClientDeprecationState[WebClientDeprecationState["YetToShow"] = 0] = "YetToShow";
        WebClientDeprecationState[WebClientDeprecationState["YetToAcknowledge"] = 1] = "YetToAcknowledge";
        WebClientDeprecationState[WebClientDeprecationState["Acknowledged"] = 2] = "Acknowledged";
        WebClientDeprecationState[WebClientDeprecationState["Canceled"] = 3] = "Canceled";
    })(WebClientDeprecationState = Sla.WebClientDeprecationState || (Sla.WebClientDeprecationState = {}));
    /**
    * Legacy SLA Deprecation Actions
    */
    var SLAWebClientDeprecationAckDialog = (function () {
        function SLAWebClientDeprecationAckDialog() {
            Sla.Telemetry.setContext(Sla.TelemetryConstants.UCContext, Sla.TelemetryConstants.UCPrefix);
        }
        /**
        * Callback for loading the dialog
        */
        SLAWebClientDeprecationAckDialog.prototype.onLoadAcknowledgeDialog = function () {
            var descriptionControl = Xrm.Page.getControl(SLAWebClientDeprecationAckDialog._description);
            var notificationMessage = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_WebClientDeprecationNotification);
            notificationMessage = notificationMessage.replace("{0}", ClientUtility.DataManager.getMSDocsRedirectBaseURL() + "/fwlink/p/?linkid=2198689");
            descriptionControl.setLabel(notificationMessage);
        };
        /**
        * Callback clicking the create button
        */
        SLAWebClientDeprecationAckDialog.prototype.acknowledgeClick = function () {
            SLAWebClientDeprecationAckDialog.setEnvironmentVariableValue(Sla.Constants.SLA_EnvironmentVariableSchemaName, Sla.Constants.SLA_EnvironmentVariableDisplayName, WebClientDeprecationState.Acknowledged.toString()).then(function () {
                Xrm.Page.ui.close();
            });
        };
        ;
        /**
        * Callback clicking the create button
        */
        SLAWebClientDeprecationAckDialog.prototype.cancelClick = function () {
            SLAWebClientDeprecationAckDialog.setEnvironmentVariableValue(Sla.Constants.SLA_EnvironmentVariableSchemaName, Sla.Constants.SLA_EnvironmentVariableDisplayName, WebClientDeprecationState.Canceled.toString()).then(function () {
                Xrm.Page.ui.close();
            });
        };
        ;
        /**
         * Getting environment variable value
         */
        SLAWebClientDeprecationAckDialog.getEnvironmentVariableValue = function (schemaName) {
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
        SLAWebClientDeprecationAckDialog.setEnvironmentVariableValue = function (schemaName, displayName, value) {
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
                            if (!(envVariableDefinition && envVariableDefinition.entities && envVariableDefinition.entities.length > 0)) return [3 /*break*/, 6];
                            envVaribleDefinitionEntity = envVariableDefinition.entities[0];
                            definitionId = envVaribleDefinitionEntity.environmentvariabledefinitionid;
                            if (!(envVaribleDefinitionEntity.environmentvariabledefinition_environmentvariablevalue.length > 0)) return [3 /*break*/, 3];
                            valueId = envVaribleDefinitionEntity.environmentvariabledefinition_environmentvariablevalue[0].environmentvariablevalueid;
                            return [4 /*yield*/, Xrm.WebApi.updateRecord("environmentvariablevalue", valueId, { "value": value })];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 3:
                            attributes = {
                                "value": value,
                                "EnvironmentVariableDefinitionId@odata.bind": "/environmentvariabledefinitions(" + definitionId + ")"
                            };
                            return [4 /*yield*/, Xrm.WebApi.createRecord("environmentvariablevalue", attributes)];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [3 /*break*/, 9];
                        case 6:
                            attributes = {
                                "schemaname": schemaName,
                                "displayname": displayName,
                                "defaultvalue": "0"
                            };
                            return [4 /*yield*/, Xrm.WebApi.createRecord("environmentvariabledefinition", attributes)];
                        case 7:
                            envVarDefResponse = _a.sent();
                            envVarValAttributes = {
                                "value": value,
                                "EnvironmentVariableDefinitionId@odata.bind": "/environmentvariabledefinitions(" + envVarDefResponse.id + ")"
                            };
                            return [4 /*yield*/, Xrm.WebApi.createRecord("environmentvariablevalue", envVarValAttributes)];
                        case 8:
                            _a.sent();
                            _a.label = 9;
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        SLAWebClientDeprecationAckDialog.isUserHasSystemAdminRole = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isAdminUser_1, userSettings, fetchXml, exception_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            isAdminUser_1 = false;
                            userSettings = Xrm.Utility.getGlobalContext().userSettings;
                            fetchXml = SLAWebClientDeprecationAckDialog.FETCHXML_USER_ROLE_TEMPLATE_ID.replace(/\{0}/g, userSettings.userId);
                            fetchXml = fetchXml.replace(/[\t\n]/gm, "");
                            return [4 /*yield*/, Xrm.WebApi.retrieveMultipleRecords("role", "?fetchXml=" + fetchXml).then(function success(result) {
                                    if (result.entities.length > 0) {
                                        if (!!result.entities.find(function (entity) { return entity._roletemplateid_value === SLAWebClientDeprecationAckDialog._sysAdminRoleTemplateId || entity._roletemplateid_value === SLAWebClientDeprecationAckDialog._sysAdminRoleTemplateId.toLowerCase(); })) {
                                            isAdminUser_1 = true;
                                        }
                                    }
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, isAdminUser_1];
                        case 2:
                            exception_1 = _a.sent();
                            Sla.Telemetry.logError(Sla.CommonSource.SLAWebClientDeprecationNotification, Sla.TelemetryErrors.SLAFailToShowNotificationError, {
                                "Feature": "Alert",
                                "Log": "SLAWebClientDeprecationAckDialog::isUserHasSystemAdminRole:Error in checking user's admin role",
                                "Error": exception_1
                            });
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return SLAWebClientDeprecationAckDialog;
    }());
    SLAWebClientDeprecationAckDialog._description = "description_id";
    SLAWebClientDeprecationAckDialog._sysAdminRoleTemplateId = "627090FF-40A3-4053-8790-584EDC5BE201";
    SLAWebClientDeprecationAckDialog.FETCHXML_USER_ROLE_TEMPLATE_ID = "<fetch version='1.0' distinct='false' no-lock='false' mapping='logical'>\n\t\t\t\t<entity name='role'>\n\t\t\t\t\t<attribute name='roletemplateid' />\n\t\t\t\t\t<link-entity name='systemuserroles' to='roleid' from='roleid' link-type='inner'>\n\t\t\t\t\t\t<filter type='and'>\n\t\t\t\t\t\t\t<condition attribute='systemuserid' operator= 'eq' value='{0}' />\n\t\t\t\t\t\t</filter>\n\t\t\t\t\t</link-entity>\n\t\t\t\t</entity>\n\t\t\t</fetch>";
    Sla.SLAWebClientDeprecationAckDialog = SLAWebClientDeprecationAckDialog;
})(Sla || (Sla = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../../ClientUtility/Client/Common/DataUtil.ts" />
/// <reference path="../../../../ClientUtility/Client/Common/DateValidation.ts" />
/// <reference path="../../../../ClientUtility/Client/Common/EntityNames.ts" />
/// <reference path="../../Common/EntityTypeCodes.ts" />
/// <reference path="../../Common/EntityNames.ts" />
/// <reference path="../../Common/EntityStates.ts" />
/// <reference path="SLAMainSystemLibraryBase.ts" />
/// <reference path="../../Common/ResxConstants.ts" />
/// <reference path="../../Common/ResourceStringProvider.ts" />
/// <reference path="SLAWebClientDeprecationAckDialog.ts" />
/// <reference path="../../../../ClientUtility/Client/Common/DataManager.ts" />
var Sla;
(function (Sla) {
    /**
    * Main web resource library for Sla
    */
    var SlaMainSystemLibraryWebResource = (function (_super) {
        __extends(SlaMainSystemLibraryWebResource, _super);
        function SlaMainSystemLibraryWebResource() {
            var _this = _super.call(this) || this;
            _this._mapOptionSetToAttribute = null;
            _this._mapAttributeToOptionSet = null;
            /**
            * Callbacks for "Applicable From" field changes
            */
            _this.applicableFromPicklistOnchange = function () {
                var applicablefromPickListControl = Xrm.Page.data.entity.attributes.get("applicablefrompicklist");
                var applicablefromControl = Xrm.Page.data.entity.attributes.get("applicablefrom");
                if (!Mscrm.InternalUtilities.JSTypes.isNull(applicablefromPickListControl) && !Mscrm.InternalUtilities.JSTypes.isNull(applicablefromControl)) {
                    var selectedApplicabelForm = applicablefromPickListControl.getValue();
                    !Mscrm.InternalUtilities.JSTypes.isNull(selectedApplicabelForm) &&
                        applicablefromControl.setValue(_this._mapOptionSetToAttribute[selectedApplicabelForm]);
                }
            };
            /**
            * Callbacks for clicking on "Business Hours" field
            */
            _this.businessHoursIdOnclick = function () {
                var oLookup = Xrm.Page.ui.controls.get("businesshoursid");
                oLookup.setParameter("serviceCalendarType", "1");
            };
            /**
            * Callbacks for loading the form
            */
            _this.formOnload = function () {
                var ucTab = Xrm.Page.ui.tabs.getByName("tabUC");
                if (ucTab) {
                    ucTab.setVisible(false); // hide the SLA's UC tab when opening in WC
                }
                var tabUCMigration = Xrm.Page.ui.tabs.getByName("tabUCMigration");
                if (tabUCMigration) {
                    tabUCMigration.setVisible(false); // hide the SLA's UC Migration tab when opening in WC
                }
                var updateApplicablefromPicklist = function (context) {
                    _this.setRequiredLevel();
                    _this.disableApplicableFromPickList();
                    _this.populateApplicableFromPicklist();
                };
                if (_this.isFcbEnabled(_this._fcbSLAEnableProactiveChecks)) {
                    // show web client SLA deprecation notificaiton in UCI if any legacy SLA existed
                    _this.showSLAWebClientDeprecationNotification();
                }
                Xrm.Page.data.addOnLoad(updateApplicablefromPicklist);
                if (Xrm.Page.context.isCrmOnline() && Xrm.Internal.isFeatureEnabled("FCB.SLAV2")) {
                    var objectTypeCode = Xrm.Page.data.entity.attributes.get("objecttypecode");
                    var state = Xrm.Page.data.entity.attributes.get("statecode");
                    if (!Mscrm.InternalUtilities.JSTypes.isNull(objectTypeCode) && state.getValue() === 0) {
                        var OTCvalue = objectTypeCode.getValue();
                        _this.showNotification(OTCvalue);
                    }
                }
                _this.disableOrHideApplicableEntityControl();
                var slaVersionAttribute = Xrm.Page.getAttribute("slaversion");
                var isCreate = Xrm.Page.ui.getFormType() === Xrm.FormType.create;
                if (isCreate) {
                    _this.disableStandardSlaType();
                    var useSlaKpiAttribute = Xrm.Page.data.entity.attributes.get("slatype");
                    var allowPauseResumeAttribute = Xrm.Page.getAttribute("allowpauseresume");
                    allowPauseResumeAttribute.setValue(true);
                    if (useSlaKpiAttribute) {
                        useSlaKpiAttribute.setValue(1);
                    }
                    // Set the WC value in version control
                    if (slaVersionAttribute) {
                        slaVersionAttribute.setValue(100000000);
                    }
                    return;
                }
                // In modes other than the create mode, show notification and disable necessary controls and grids.
                if (slaVersionAttribute && slaVersionAttribute.getValue() == 100000001) {
                    Xrm.Page.ui.setFormNotification(Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_CannotBeEditedInWebClient), "ERROR", "NoEditNotificationWCSLA");
                    _this.disableAllControls();
                }
                // show warning if incident plugin related SDK messages are disabled
                var slaPrimaryentityotc = Xrm.Page.getAttribute("primaryentityotc");
                if (slaPrimaryentityotc != null && slaPrimaryentityotc.getValue() != null && slaPrimaryentityotc.getValue() == 112) {
                    _this.showWarningIfIncidentPluginSDKMessageDisabled();
                }
                else if (slaPrimaryentityotc != null && slaPrimaryentityotc.getValue() != null && slaPrimaryentityotc.getValue() != 112) {
                    // show warning if SLA is active but assocaited plugins SDK are disabled
                    var statecode = Xrm.Page.getAttribute("statecode");
                    if (statecode != null && statecode.getValue() != null && statecode.getValue() == 1) {
                        _this.showWarningIfCustomEntityPluginSDKMessageDisabled(slaPrimaryentityotc.getValue());
                    }
                }
                // show form level warning if SLA is disabled in Service Configuration Settings.
                _this.showWarningIfSLASettingIsDisabled();
            };
            // ----- checking whether FCB is enabled or not -----
            _this.isFcbEnabled = function (fcbName) {
                return Xrm.Internal.isUci() ? Xrm.Internal.isFeatureEnabled(fcbName) : Xrm.Internal.isFeatureEnabled("FCB." + fcbName);
            };
            // show warning notification if SLA Setting is disabled
            _this.showWarningIfSLASettingIsDisabled = function () {
                try {
                    var orgSettings = Xrm.Utility.getGlobalContext().organizationSettings;
                    var organization = {
                        id: orgSettings.organizationId,
                        entityType: "organization"
                    };
                    Xrm.WebApi.retrieveRecord(organization.entityType, organization.id, "?$select=suppresssla").then(function success(result) {
                        var orgRecord = result;
                        if (orgRecord.suppresssla) {
                            Xrm.Page.ui.setFormNotification(Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_SLAIsDisabledInSetting), "WARNING", "SLAIsDisabledInSetting");
                        }
                    }, null);
                }
                catch (exception) {
                    Sla.Telemetry.logError(Sla.CommonSource.SLASettingsDisable, Sla.TelemetryErrors.SLAFailToShowNotificationError, {
                        "Feature": "AutoFix",
                        "Log": "Error in showWarningIfSLASettingIsDisabled - Legacy SLA",
                        "Error": exception
                    });
                }
            };
            // show proactive form notification when we detect any dependency is disabled for legacy/Modern SLA.
            _this.showWarningIfIncidentPluginSDKMessageDisabled = function () {
                try {
                    // check if all require SDK messaging steps are enabled.
                    Xrm.WebApi.retrieveMultipleRecords("sdkmessageprocessingstep", "?fetchXml=" + Sla.SlaMainSystemLibraryUCWebResource.FETCHXML_SDK_MESSAGE_STEP_INCIDENT_ENTITY).then(function success(result) {
                        var allIds = [Sla.SlaMainSystemLibraryUCWebResource.INCIDENT_POST_CREATE_PLUGIN_SDK_MESSAGE_ID, Sla.SlaMainSystemLibraryUCWebResource.INCIDENT_POST_UPDATE_PLUGIN_SDK_MESSAGE_ID];
                        for (var i = 0; i < result.entities.length; i++) {
                            var sdkMessagingStepRecord = result.entities[i];
                            // if its active i.e StateCode 0 for SDK, remove the id.
                            if (sdkMessagingStepRecord.statecode == 0) {
                                var index = allIds.indexOf(sdkMessagingStepRecord.sdkmessageprocessingstepid, 0);
                                if (index > -1) {
                                    allIds.splice(index, 1);
                                }
                            }
                        }
                        // show warning with all inactive SDK Step Ids
                        if (allIds.length > 0) {
                            var notificationMessage = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_SDKMessagingStepNotInActiveState);
                            Xrm.Page.ui.setFormNotification(notificationMessage.replace("{0}", allIds.toString()), "WARNING", "SDKMessagingStepNotInActiveState");
                        }
                    }, null);
                }
                catch (exception) {
                }
            };
            _this.showWarningIfCustomEntityPluginSDKMessageDisabled = function (objectTypeCode) {
                try {
                    var fetchXml = Sla.SlaMainSystemLibraryBase.FETCHXML_SDK_MESSAGE_STEP_CUSTOM_ENTITY.replace(/\{0}/g, objectTypeCode);
                    // check if all require SDK messaging steps are enabled.
                    Xrm.WebApi.retrieveMultipleRecords("sdkmessageprocessingstep", "?fetchXml=" + fetchXml).then(function success(result) {
                        var pluginTypeIds = [Sla.SlaMainSystemLibraryBase.CUSTOM_ENTITY_PRE_CREATE_PLUGIN_TYPE_ID, Sla.SlaMainSystemLibraryBase.CUSTOM_ENTITY_PRE_UPDATE_PLUGIN_TYPE_ID, Sla.SlaMainSystemLibraryBase.CUSTOM_ENTITY_POST_CREATE_PLUGIN_TYPE_ID, Sla.SlaMainSystemLibraryBase.CUSTOM_ENTITY_POST_UPDATE_PLUGIN_TYPE_ID];
                        var sdkMessageProcessingStepIds = [];
                        for (var i = 0; i < result.entities.length; i++) {
                            var sdkMessagingStepRecord = result.entities[i];
                            // if its active i.e StateCode 0 for SDK, remove the id from plugin type list.
                            if (sdkMessagingStepRecord.statecode == 0) {
                                var index = pluginTypeIds.indexOf(sdkMessagingStepRecord._eventhandler_value, 0);
                                if (index > -1) {
                                    pluginTypeIds.splice(index, 1);
                                }
                            }
                            else {
                                // if its not active, add in SDK list.
                                sdkMessageProcessingStepIds.push(sdkMessagingStepRecord.sdkmessageprocessingstepid);
                            }
                        }
                        // show warning with all inactive SDK Step Ids.
                        // if plugin itself not registered, show warning but we may not get SDK id.
                        if (sdkMessageProcessingStepIds.length > 0 || pluginTypeIds.length > 0) {
                            var notificationMessage = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_SDKMessagingStepNotInActiveState);
                            Xrm.Page.ui.setFormNotification(notificationMessage.replace("{0}", sdkMessageProcessingStepIds.toString()), "WARNING", "CustomEntitySDKMessagingStepNotInActiveState");
                        }
                    }, null);
                }
                catch (exception) {
                }
            };
            _this.disableAllControls = function () {
                var controlsToDisable = Xrm.Page.ui.controls.get();
                for (var i in controlsToDisable) {
                    var controlToDisable = controlsToDisable[i];
                    if (controlToDisable.getDisabled && controlToDisable.setDisabled && !controlToDisable.getDisabled()) {
                        controlToDisable.setDisabled(true);
                    }
                }
                // Hide the grid
                Xrm.Page.getControl("SLADetails").setVisible(false);
            };
            _this.showNotification = function (objectTypeCode) {
                Xrm.Internal.messages.shouldDisplaySLALimitNotification(objectTypeCode).then(function (response) {
                    var result = response.result;
                    result &&
                        Xrm.Internal.messages.whoAmI().then(function (responseWhoAmI) {
                            var orgId = responseWhoAmI.organizationId.toString();
                            var columnNames = ["maximumentitieswithactivesla"];
                            Xrm.Internal.messages.retrieve(ClientUtility.EntityNames.Organization, orgId, columnNames).
                                then(function (responseOrganization) {
                                var organization = responseOrganization.entity;
                                var limit = organization.getValue("maximumentitieswithactivesla").toString();
                                var notificationText = String.format(Xrm.Internal.getResourceString("SLA_Limit_Online"), limit);
                                Xrm.Page.ui.setFormNotification(notificationText, "WARNING", "SLALimitNotification");
                            }, Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback);
                        }, Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback);
                }, Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback);
            };
            _this.disableOrHideApplicableEntityControl = function () {
                var objectTypeCode = Xrm.Page.data.entity.attributes.get("objecttypecode");
                if (!Mscrm.InternalUtilities.JSTypes.isNull(objectTypeCode)) {
                    var controls = objectTypeCode.controls;
                    objectTypeCode.setSubmitMode(Xrm.SubmitMode.never);
                    if (Xrm.Internal.isFeatureEnabled("FCB.SLAV2")) {
                        objectTypeCode.setRequiredLevel(Xrm.RequiredLevel.required);
                        controls.forEach(function (control, index) {
                            control.setDisabled(true);
                        });
                    }
                    else {
                        controls.forEach(function (control, index) {
                            control.setVisible(false);
                        });
                    }
                }
            };
            _this.disableStandardSlaType = function () {
                if (Xrm.Internal.isFeatureEnabled(_this.enhancedSlaFcb)) {
                    var objectTypeCode = Xrm.Page.data.entity.attributes.get("objecttypecode");
                    if (!Mscrm.InternalUtilities.JSTypes.isNull(objectTypeCode)) {
                        var OTCvalue = objectTypeCode.getValue();
                        if (OTCvalue !== Sla.EntityTypeCodes.Incident) {
                            var slaTypeControl = Xrm.Page.ui.controls.get("SLAType");
                            var slaTypeAttribute = slaTypeControl.getAttribute();
                            if (!Mscrm.InternalUtilities.JSTypes.isNull(slaTypeAttribute)) {
                                slaTypeAttribute.setValue(1);
                                slaTypeControl.setDisabled(true);
                            }
                        }
                    }
                }
            };
            _this.updateIfSlaActive = function (slaId, entityName, columnNames, isForm, gridControl, records, entityTypeCode) {
                Xrm.Internal.messages.retrieve(Sla.EntityNames.SLA, slaId, columnNames).then(function (retrieveSLAResponse) {
                    var slaRow = retrieveSLAResponse.entity;
                    if (slaRow.hasValue("statecode")) {
                        var columnValue = slaRow.getValue("statecode");
                        var objectTypeCode = slaRow.getValue("objecttypecode");
                        var objectTypeCodeValue = _this._legacyObjectTypeCode;
                        if (!Mscrm.InternalUtilities.JSTypes.isNull(slaRow.getValue("objecttypecode"))) {
                            objectTypeCodeValue = objectTypeCode.get_valueString();
                        }
                        if (columnValue.get_value() === Sla.SLAState.active) {
                            _this.updateSlaIfNoDefaultSlaExists(gridControl, records, entityTypeCode, slaId, entityName, isForm, objectTypeCodeValue);
                        }
                        else {
                            Xrm.Utility.alertDialog(Xrm.Internal.getResourceString("LOCID_SLADEFAULT_INACTIVE_MSG"), null);
                        }
                    }
                }, Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback);
            };
            _this.updateSlaIfNoDefaultSlaExists = function (gridControl, records, entityTypeCode, slaId, entityName, isForm, currentTypeCode) {
                var fetchXml = null;
                var otc = Sla.EntityTypeCodes.Incident;
                if (currentTypeCode !== _this._legacyObjectTypeCode && currentTypeCode !== "112") {
                    otc = Number.parseInvariant(currentTypeCode);
                    fetchXml = "<fetch version='1.0' mapping='logical'><entity name='sla'><attribute name='slaid' /><filter type='and'><condition attribute='isdefault' operator='eq' value='1' /><condition attribute='objecttypecode' operator='eq' value='";
                    fetchXml += CrmEncodeDecode.CrmXmlAttributeEncode(currentTypeCode);
                    fetchXml += "' /></filter></entity></fetch>";
                }
                else {
                    fetchXml = "<fetch version='1.0' mapping='logical'><entity name='sla'><attribute name='slaid' /><filter type='and'><condition attribute='isdefault' operator='eq' value='1' /><filter type='or'><condition attribute='objecttypecode' operator='eq' value='";
                    fetchXml += CrmEncodeDecode.CrmXmlAttributeEncode("112");
                    fetchXml += "' /><condition attribute='objecttypecode' operator='null' /></filter></filter></entity></fetch>";
                }
                var slaEntities = null;
                Xrm.Internal.messages.retrieveMultiple(fetchXml).then(function (retrieveSLAResponse) {
                    slaEntities = retrieveSLAResponse.entityCollection;
                    var defaultSlaId = null;
                    if (slaEntities.get_count() > 0) {
                        defaultSlaId = slaEntities.get_entities()[0].getValue("slaid").toString();
                    }
                    else {
                        defaultSlaId = Mscrm.InternalUtilities._String.Empty;
                    }
                    if (isForm) {
                        _this.updateDefaultSlaByForm(slaId, entityName, defaultSlaId, Xrm.Internal.getEntityDisplayName(Xrm.Internal.getEntityName(otc)));
                    }
                    else {
                        _this.updateDefaultSlaByGrid(gridControl, records, entityTypeCode, slaId, defaultSlaId, Xrm.Internal.getEntityDisplayName(Xrm.Internal.getEntityName(otc)));
                    }
                }, Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback);
            };
            _this.disableApplicableFromPickList = function () {
                var applicableFromHiddenValue = Xrm.Page.data.entity.attributes.get("applicablefrom").getValue();
                if (Mscrm.InternalUtilities.JSTypes.isNull(applicableFromHiddenValue) || !applicableFromHiddenValue.length) {
                    return;
                }
                else {
                    var applicableFromControl = Xrm.Page.ui.controls.get("applicablefrompicklist");
                    applicableFromControl.setDisabled(true);
                }
            };
            _this.setRequiredLevel = function () {
                var requiredFields = "applicablefrompicklist";
                var applicablefromPickListControl = Xrm.Page.data.entity.attributes.get(requiredFields);
                applicablefromPickListControl.setRequiredLevel(Xrm.RequiredLevel.required);
            };
            _this.populateApplicableFromPicklist = function () {
                var entityOTC = Sla.EntityTypeCodes.Incident;
                var objectTypeCode = Xrm.Page.data.entity.attributes.get("objecttypecode");
                if (!Mscrm.InternalUtilities.JSTypes.isNull(objectTypeCode) && !Mscrm.InternalUtilities.JSTypes.isNull(objectTypeCode.getValue())) {
                    entityOTC = objectTypeCode.getValue();
                }
                Xrm.Internal.messages.retrieveAttributeList(entityOTC).then(function (response) {
                    var data = Sys.Serialization.JavaScriptSerializer.deserialize(response.result);
                    var applicableFromPicklistAttribute = Xrm.Page.data.entity.attributes.get("applicablefrompicklist");
                    var applicableFromPicklistControl = Xrm.Page.ui.controls.get("applicablefrompicklist");
                    if (Mscrm.InternalUtilities.JSTypes.isNull(applicableFromPicklistControl) || Mscrm.InternalUtilities.JSTypes.isNull(applicableFromPicklistAttribute)) {
                        return;
                    }
                    applicableFromPicklistAttribute.setSubmitMode(Xrm.SubmitMode.never);
                    applicableFromPicklistAttribute.clearOptions();
                    applicableFromPicklistControl.clearOptions();
                    var newOptions = [];
                    _this._mapOptionSetToAttribute = {};
                    _this._mapAttributeToOptionSet = {};
                    if (!Mscrm.InternalUtilities.JSTypes.isNull(data) && !Mscrm.InternalUtilities.JSTypes.isNull(data["Options"])) {
                        for (var options = data["Options"], i = 0; i < options.length; i++) {
                            var option = options[i], value = option["AttributeLogicalName"], text = option["AttributeDisplayName"], item = new Xrm.OptionSetItem(i, text);
                            newOptions[i] = item;
                            _this._mapAttributeToOptionSet[value] = i;
                            _this._mapOptionSetToAttribute[i.toString()] = value;
                            applicableFromPicklistAttribute.addOption(item);
                            applicableFromPicklistControl.addOption(item);
                        }
                    }
                    var applicableFromAtrribute = Xrm.Page.getAttribute("applicablefrom");
                    if (!Mscrm.InternalUtilities.JSTypes.isNull(applicableFromAtrribute) && !Mscrm.InternalUtilities.JSTypes.isNull(_this._mapAttributeToOptionSet) && !Mscrm.InternalUtilities.JSTypes.isNullOrEmptyString(applicableFromAtrribute.getValue())) {
                        applicableFromPicklistAttribute.setValue(_this._mapAttributeToOptionSet[applicableFromAtrribute.getValue()]);
                    }
                    else {
                        applicableFromPicklistAttribute.setValue(newOptions[0].value);
                        applicableFromAtrribute.setValue(_this._mapOptionSetToAttribute[applicableFromPicklistAttribute.getValue()]);
                    }
                }, function (response) {
                });
            };
            _this.updateDefaultSlaByForm = function (slaId, entityName, defaultSlaId, parentEntity) {
                var dialogOptions = new Xrm.DialogOptions;
                dialogOptions.width = 600;
                dialogOptions.height = 200;
                if (!Mscrm.InternalUtilities.JSTypes.isNullOrEmptyString(defaultSlaId) && entityName.toString() === "9750") {
                    var actionUri = Mscrm.InternalUtilities.GridUtilities.generateStandardActionUri("defaultsla_confirm", Sla.EntityTypeCodes.SLA, 1);
                    actionUri.get_query()["iEntityName"] = parentEntity;
                    actionUri.get_query()["iOldId"] = defaultSlaId;
                    var selectedRecords = new Array(1);
                    selectedRecords[0] = slaId;
                    Xrm.Internal.openDialog(actionUri.toString(), dialogOptions, selectedRecords, null, _this.performRefreshAfterUpdate);
                }
                else {
                    var actionUri = Mscrm.InternalUtilities.GridUtilities.generateStandardActionUri("defaultsla_apply", Sla.EntityTypeCodes.SLA, 1), selectedRecords = new Array(1);
                    selectedRecords[0] = slaId;
                    Xrm.Internal.openDialog(actionUri.toString(), dialogOptions, selectedRecords, null, _this.performRefreshAfterUpdate);
                }
            };
            _this.performRefreshAfterUpdate = function () {
                Xrm.Page.data.refresh(true);
            };
            _this.updateDefaultSlaByGrid = function (gridControl, records, entityTypeCode, slaId, defaultSlaId, parentEntity) {
                var callbackRef = null;
                if (!Mscrm.InternalUtilities.JSTypes.isNullOrEmptyString(defaultSlaId)) {
                    if (defaultSlaId.toUpperCase() === slaId.replace("{", "").replace("}", "").toUpperCase()) {
                        Xrm.Utility.alertDialog(Xrm.Internal.getResourceString("LOCID_SLADEFAULTED_MSG"), null);
                    }
                    else {
                        var actionUri = Mscrm.InternalUtilities.GridUtilities.generateStandardActionUri("defaultsla_confirm", Sla.EntityTypeCodes.SLA, 1);
                        actionUri.get_query()["iEntityName"] = parentEntity;
                        actionUri.get_query()["iOldId"] = defaultSlaId;
                        var selectedRecords = new Array(1);
                        selectedRecords[0] = slaId;
                        Mscrm.InternalUtilities.GridUtilities.executeStandardAction(actionUri, records, 600, 200, callbackRef, selectedRecords);
                    }
                }
                else {
                    var actionUri = Mscrm.InternalUtilities.GridUtilities.generateStandardActionUri("defaultsla_apply", entityTypeCode, 1);
                    var selectedRecords = new Array(1);
                    selectedRecords[0] = slaId;
                    Mscrm.InternalUtilities.GridUtilities.executeStandardAction(actionUri, records, 600, 200, callbackRef, selectedRecords);
                }
            };
            return _this;
        }
        SlaMainSystemLibraryWebResource.prototype.showSLAWebClientDeprecationNotification = function () {
            try {
                var thisPtr_1 = this;
                Xrm.WebApi.retrieveMultipleRecords("sla", "?fetchXml=" + Sla.SlaMainSystemLibraryUCWebResource.FETCHXML_ANY_ACTIVE_LEGACY_SLA).then(function success(result) {
                    if (result.entities.length > 0) {
                        Sla.Telemetry.logInfo(Sla.CommonSource.SLAWebClientDeprecationNotification, {
                            "Feature": "SelfFix",
                            "Log": "Showing legacy SLA deprecation notification in web client form"
                        });
                        var notificationMessage = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_WebClientDeprecationNotification);
                        notificationMessage = notificationMessage.replace("{0}", ClientUtility.DataManager.getMSDocsRedirectBaseURL() + "/fwlink/p/?linkid=2198689");
                        Xrm.Page.ui.setFormNotification(notificationMessage, "WARNING", Sla.CommonSource.SLAWebClientDeprecationNotification);
                        thisPtr_1.openSLAWebClientDeprecationAckDialog();
                    }
                }, function error(error) {
                    Sla.TelemetryErrors.SLAFailToShowNotificationError,
                        {
                            "Feature": "SelfFix",
                            "Log": "SlaMainSystemLibraryWebResource::Error in showSLAWebClientDeprecationNotification",
                            "Error": error
                        };
                });
            }
            catch (exception) {
                Sla.Telemetry.logError(Sla.CommonSource.SLAWebClientDeprecationNotification, Sla.TelemetryErrors.SLAFailToShowNotificationError, {
                    "Feature": "SelfFix",
                    "Log": "SlaMainSystemLibraryWebResource::Error in showSLAWebClientDeprecationNotification",
                    "Error": exception
                });
            }
        };
        SlaMainSystemLibraryWebResource.prototype.openSLAWebClientDeprecationAckDialog = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isUserHasSystemAdminRole, envVariableValue, dailogOptions, exception_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, Sla.SLAWebClientDeprecationAckDialog.isUserHasSystemAdminRole()];
                        case 1:
                            isUserHasSystemAdminRole = _a.sent();
                            if (!isUserHasSystemAdminRole) return [3 /*break*/, 3];
                            return [4 /*yield*/, Sla.SLAWebClientDeprecationAckDialog.getEnvironmentVariableValue(Sla.Constants.SLA_EnvironmentVariableSchemaName)];
                        case 2:
                            envVariableValue = _a.sent();
                            if (envVariableValue != Sla.WebClientDeprecationState.Acknowledged) {
                                dailogOptions = new Xrm.DialogOptions;
                                dailogOptions.height = 180;
                                dailogOptions.width = 600;
                                if (envVariableValue != Sla.WebClientDeprecationState.Canceled && envVariableValue != Sla.WebClientDeprecationState.YetToAcknowledge) {
                                    Sla.SLAWebClientDeprecationAckDialog.setEnvironmentVariableValue(Sla.Constants.SLA_EnvironmentVariableSchemaName, Sla.Constants.SLA_EnvironmentVariableDisplayName, Sla.WebClientDeprecationState.YetToAcknowledge.toString());
                                }
                                Xrm.Dialog.openDialog("SLAWebClientDeprecationAckDialog", dailogOptions, null, null, null);
                            }
                            _a.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            exception_2 = _a.sent();
                            Sla.Telemetry.logError(Sla.CommonSource.SLAFailToShowNotification, Sla.TelemetryErrors.SLAFailToShowNotificationError, {
                                "Feature": "Alert",
                                "Log": "SlaMainSystemLibraryWebResource::openSLAWebClientDeprecationAckDialog:Error in opening SLA web client deprecation acknowledge dialog",
                                "Error": exception_2
                            });
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        return SlaMainSystemLibraryWebResource;
    }(Sla.SlaMainSystemLibraryBase));
    Sla.SlaMainSystemLibraryWebResource = SlaMainSystemLibraryWebResource;
})(Sla || (Sla = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="DataUtil.ts" />
var ClientUtility;
(function (ClientUtility) {
    var ActionFailedHandler = (function () {
        function ActionFailedHandler() {
        }
        ActionFailedHandler.actionFailedCallback = function (response) {
            if (!ClientUtility.DataUtil.isNullOrUndefined(response.errorCode)) {
                // ToDo: undo workaround bug 542808
                //var alertStrings: XrmClientApi.AlertDialogStrings = {
                //    text: response.message
                //};
                var alertStrings = new AlertDialogStrings();
                alertStrings.text = response.message;
                // TODO: Show a more error-oriented dialog (& icon)?
                Xrm.Navigation.openAlertDialog(alertStrings);
            }
        };
        ActionFailedHandler.actionFailedErrorDialog = function (errorResponse) {
            // ToDo: undo workaround when bug 544175 is fixed
            var errorCode = errorResponse ? parseInt(errorResponse.errorCode) || 0 : 0;
            Xrm.Navigation.openErrorDialog({ errorCode: errorCode, message: errorResponse.message });
        };
        return ActionFailedHandler;
    }());
    ClientUtility.ActionFailedHandler = ActionFailedHandler;
    // ToDo: remove when bug 542808 is fixed
    var AlertDialogStrings = (function () {
        function AlertDialogStrings() {
        }
        return AlertDialogStrings;
    }());
    AlertDialogStrings.__typeName = "Xrm.AlertDialogStrings";
})(ClientUtility || (ClientUtility = {}));
/// <reference path="../../../../ClientUtility/Client/Common/DataUtil.ts" />
/// <reference path="../../../../ClientUtility/Client/Common/ActionFailedHandler.ts" />
/// <reference path="../../../../ClientUtility/Client/Common/DateValidation.ts" />
/// <reference path="../../../../ClientUtility/Client/Common/EntityNames.ts" />
/// <reference path="../../Common/EntityTypeCodes.ts" />
/// <reference path="../../Common/EntityNames.ts" />
/// <reference path="../../Common/EntityStates.ts" />
/// <reference path="SLAMainSystemLibraryBase.ts" />
/// <reference path="../../Common/ResxConstants.ts" />
/// <reference path="../../Common/ResourceStringProvider.ts" />
/// <reference path="SLAWebClientDeprecationAckDialog.ts" />
/// <reference path="../../../../ClientUtility/Client/Common/DataManager.ts" />
var Sla;
(function (Sla) {
    /**
     * Main web resource library for Sla
     */
    /// <reference path="SLAMainSystemLibraryBase.ts" />
    var SlaEnums;
    (function (SlaEnums) {
        var NOTIFICATION_TYPE;
        (function (NOTIFICATION_TYPE) {
            NOTIFICATION_TYPE[NOTIFICATION_TYPE["MODERN_SLA_STATIC_FLOW_TYPE"] = 0] = "MODERN_SLA_STATIC_FLOW_TYPE";
            NOTIFICATION_TYPE[NOTIFICATION_TYPE["MODERN_SLA_SDKMESSAGINGSTEPS_TYPE"] = 1] = "MODERN_SLA_SDKMESSAGINGSTEPS_TYPE";
            NOTIFICATION_TYPE[NOTIFICATION_TYPE["MODERN_SLA_WORKFLOW_TYPE"] = 2] = "MODERN_SLA_WORKFLOW_TYPE";
            NOTIFICATION_TYPE[NOTIFICATION_TYPE["SLA_ACTION_WORKFLOWS"] = 3] = "SLA_ACTION_WORKFLOWS";
            NOTIFICATION_TYPE[NOTIFICATION_TYPE["SLA_CUSTOM_TIMECALCULATION_WORKFLOWS"] = 4] = "SLA_CUSTOM_TIMECALCULATION_WORKFLOWS";
            NOTIFICATION_TYPE[NOTIFICATION_TYPE["INCIDENT_SDKMESSAGINGSTEPS_TYPE"] = 5] = "INCIDENT_SDKMESSAGINGSTEPS_TYPE";
            NOTIFICATION_TYPE[NOTIFICATION_TYPE["CUSTOM_ENTITY_SDKMESSAGINGSTEPS_TYPE"] = 6] = "CUSTOM_ENTITY_SDKMESSAGINGSTEPS_TYPE";
            NOTIFICATION_TYPE[NOTIFICATION_TYPE["SLA_PRE_OPERATION_UPDATE_SDK_MESSAGE_ID"] = 7] = "SLA_PRE_OPERATION_UPDATE_SDK_MESSAGE_ID";
            NOTIFICATION_TYPE[NOTIFICATION_TYPE["SLA_CREATE_ACTION_FLOW_SDK_MESSAGE_ID"] = 8] = "SLA_CREATE_ACTION_FLOW_SDK_MESSAGE_ID";
            NOTIFICATION_TYPE[NOTIFICATION_TYPE["SLA_DISABLED_IN_SERVICE_CONFIG"] = 9] = "SLA_DISABLED_IN_SERVICE_CONFIG";
        })(NOTIFICATION_TYPE = SlaEnums.NOTIFICATION_TYPE || (SlaEnums.NOTIFICATION_TYPE = {}));
        ;
    })(SlaEnums = Sla.SlaEnums || (Sla.SlaEnums = {}));
    var SlaMainSystemLibraryUCWebResource = (function (_super) {
        __extends(SlaMainSystemLibraryUCWebResource, _super);
        function SlaMainSystemLibraryUCWebResource() {
            var _this = _super.call(this) || this;
            _this._trackerEntity = null;
            _this._boundEntity = "objecttypecode";
            _this._migrationTabName = "tabUCMigration";
            _this._migrationDetailsControlName = "msdyn_migrationstatus_details";
            _this._toggleValueForOne = "1000001";
            _this._toggleValueForZero = "1000000";
            _this._incompleteStatus = 2;
            _this._migratedStatus = 1;
            _this._notstartedStatus = 0;
            _this.formOnchange = function () {
                _this.handleMigrationTabOnChange();
            };
            _this.formOnsave = function () {
                _this.handleMigrationTabOnSave();
            };
            _this.formOnload = function () {
                if (_this.isFcbEnabled(_this._fcbSLAEnableProactiveChecks)) {
                    SlaMainSystemLibraryUCWebResource.showRecommendationMessage();
                }
                var tab = Xrm.Page.ui.tabs.getByName("{79777963-6d12-4dc3-938c-61a2ab71ae50}");
                if (tab) {
                    tab.setVisible(false); // hide the SLA's WC tab when opening in UC
                }
                var slaVersionAttribute = Xrm.Page.getAttribute("slaversion");
                if (Xrm.Page.ui.getFormType() == 1) {
                    Xrm.Page.getAttribute("applicablefrom").setValue("NA");
                    Xrm.Page.getAttribute("objecttypecode").setValue(0);
                    Xrm.Page.getAttribute("slatype").setValue(1);
                    if (slaVersionAttribute) {
                        slaVersionAttribute.setValue(100000001);
                    }
                    return;
                }
                // handle migration tab and related control data
                _this.handleMigrationTabOnLoad();
                // In modes other than the create mode, show notification and disable necessary controls and grids.
                // If attribute is not present, or value is null or the value is corresponding to webclient, disable the controls
                if (slaVersionAttribute == null || slaVersionAttribute.getValue() == null || slaVersionAttribute.getValue() == 100000000) {
                    Xrm.Page.ui.setFormNotification(Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_CannotBeEditedInUnifiedClient), "INFO", "NoEditNotificationUCSLA");
                    _this.disableAllControls();
                }
                // show warning only for Modern SLA, not for legacy SLA open in UCI interface
                if (slaVersionAttribute != null && slaVersionAttribute.getValue() != null && slaVersionAttribute.getValue() == 100000001) {
                    _this.showWarningIfDependenciesDisabledForModernSLA();
                }
                // show warning if incident plugin related SDK messages are disabled
                var slaPrimaryentityotc = Xrm.Page.getAttribute("primaryentityotc");
                if (slaPrimaryentityotc != null && slaPrimaryentityotc.getValue() != null && slaPrimaryentityotc.getValue() == 112) {
                    _this.showWarningIfIncidentPluginSDKMessageDisabled();
                }
                else if (slaPrimaryentityotc != null && slaPrimaryentityotc.getValue() != null && slaPrimaryentityotc.getValue() != 112) {
                    // show warning if SLA is active but assocaited plugins SDK are disabled
                    var statecode = Xrm.Page.getAttribute("statecode");
                    if (statecode != null && statecode.getValue() != null && statecode.getValue() == 1) {
                        _this.showWarningIfCustomEntityPluginSDKMessageDisabled(slaPrimaryentityotc.getValue());
                    }
                }
                // check FCB 'SLAEnableProactiveChecks' is enabled
                if (_this.isFcbEnabled(_this._fcbSLAEnableProactiveChecks)) {
                    // check if SLA setting is disabled
                    _this.showWarningIfSLASettingIsDisabled();
                    // check if any SLA is set as default for selected SLA enabled entity
                    var statecode = Xrm.Page.getAttribute("statecode");
                    if (statecode != null && statecode.getValue() != null && statecode.getValue() == 1) {
                        _this.showWarningNotificationIfNoSLASetAsDefault();
                    }
                    // show web client SLA deprecation notificaiton in UCI if any legacy SLA existed
                    _this.showSLAWebClientDeprecationNotification();
                }
            };
            // ----- checking whether FCB is enabled or not -----
            _this.isFcbEnabled = function (fcbName) {
                return Xrm.Internal.isUci() ? Xrm.Internal.isFeatureEnabled(fcbName) : Xrm.Internal.isFeatureEnabled("FCB." + fcbName);
            };
            // ----- proactve notification related handling start ------
            _this.logError = function (error, source) {
                console.error("error:" + error + " from source:" + source);
                Sla.Telemetry.logError(source, {
                    "Feature": "SLA",
                    "Log": "Error",
                    "Error": error
                });
            };
            _this.crossCheckifWorkflowsInActive = function (childWorkflowIds, source) {
                var fetchXml = SlaMainSystemLibraryUCWebResource.FETCHXML_SLA_WORKFLOWS.replace(/\{0}/g, "" + childWorkflowIds.length);
                var workflowValues = "";
                for (var i = 0; i < childWorkflowIds.length; i++) {
                    workflowValues = workflowValues + "<value>{" + childWorkflowIds[i] + "}</value>";
                }
                // update the fetchXML with all workflow values
                fetchXml = fetchXml.replace(/\{1}/g, workflowValues);
                ;
                var thisPtr = _this;
                Xrm.WebApi.retrieveMultipleRecords("workflow", "?fetchXml=" + fetchXml).then(function success(result) {
                    var allInactiveWorkflows = [];
                    for (var i = 0; i < result.entities.length; i++) {
                        var workflowEntity = result.entities[i];
                        // find if workflow is inactive
                        if (workflowEntity && workflowEntity.statecode == 0) {
                            allInactiveWorkflows.push(workflowEntity.workflowid);
                        }
                    }
                    // show warning with all inactive SLA workflows
                    if (allInactiveWorkflows.length > 0) {
                        Sla.Telemetry.logInfo(source, {
                            "Feature": "AutoFix",
                            "Log": "Showing warning with all inactive Workflow Ids:" + allInactiveWorkflows.toString()
                        });
                        var notificationType;
                        if (source == Sla.CommonSource.SLAInactiveCustomTimeCalculationWorkflow) {
                            notificationType = SlaEnums.NOTIFICATION_TYPE.SLA_CUSTOM_TIMECALCULATION_WORKFLOWS;
                            thisPtr._customTimeCalculationWorkflowIds = allInactiveWorkflows;
                        }
                        else {
                            notificationType = SlaEnums.NOTIFICATION_TYPE.SLA_ACTION_WORKFLOWS;
                            thisPtr._actionWorkflowIds = allInactiveWorkflows;
                        }
                        var notificationMessage = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_WorkflowNotInActiveState);
                        thisPtr.showAppLevelNotification(notificationType, notificationMessage.replace("{0}", allInactiveWorkflows.toString()));
                    }
                }, function error(error) {
                    thisPtr.logError(error, source);
                });
            };
            _this.crossCheckifWorkflowsOwnerDisabled = function (workflowIds) {
                var thisPtr = _this;
                var fetchXml = SlaMainSystemLibraryUCWebResource.FETCHXML_SLA_WORKFLOW_OWNED_BY_DISABLED_USER.replace(/\{0}/g, "" + workflowIds.length);
                var workflowValues = "";
                for (var i = 0; i < workflowIds.length; i++) {
                    workflowValues = workflowValues + "<value>{" + workflowIds[i] + "}</value>";
                }
                // update the fetchXML with all workflow values
                fetchXml = fetchXml.replace(/\{1}/g, workflowValues);
                ;
                Xrm.WebApi.retrieveMultipleRecords("workflow", "?fetchXml=" + fetchXml).then(function success(result) {
                    var allWorkflowsWithDisabledOwner = [];
                    for (var i = 0; i < result.entities.length; i++) {
                        var workflowEntity = result.entities[i];
                        allWorkflowsWithDisabledOwner.push(workflowEntity.workflowid);
                    }
                    // show warning with all SLA workflows with disabled owners
                    if (allWorkflowsWithDisabledOwner.length > 0) {
                        Sla.Telemetry.logInfo(Sla.CommonSource.SLAInactiveWorkflowOwnerDisabled, {
                            "Feature": "AutoFix",
                            "Log": "Showing warning with all inactive Workflow Ids:" + allWorkflowsWithDisabledOwner.toString()
                        });
                        thisPtr._staticWorkflowIds = allWorkflowsWithDisabledOwner;
                        var notificationMessage = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_WorkflowOwnerIsDisabled);
                        Xrm.Page.ui.setFormNotification(notificationMessage.replace("{0}", allWorkflowsWithDisabledOwner.toString()), "ERROR", "SLA_WorkflowOwnerIsDisabled");
                    }
                }, function error(error) {
                    thisPtr.logError(error, Sla.CommonSource.SLAInactiveWorkflowOwnerDisabled);
                });
            };
            // show proactive notification when we detect if SLA workflow instances owner is disabled
            _this.fetchAllWorkflorsForSlaOrSlaItems = function () {
                try {
                    var thisPtr_2 = _this;
                    var recordId = Xrm.Page.data.entity.getId();
                    var fetchXml = SlaMainSystemLibraryUCWebResource.FETCHXML_SLA_ITEMS.replace(/\{0}/g, recordId);
                    Xrm.WebApi.retrieveMultipleRecords("slaitem", "?fetchXml=" + fetchXml).then(function success(result) {
                        // check 1 :if SLA is active but any of workflow is deactivate
                        // check 2 :if SLA is active but any of workflow owner is disabled or left organization
                        // check 3 :if SLA is active with Custom TC but any of workflow is deactivate
                        var childWorkflowIds = [];
                        var customTimeCalculationWorkflows = [];
                        var slaItemNames = [];
                        var relatedEntitySLAItems = [];
                        var slaItemNamesWithBusinessHours = [];
                        for (var i = 0; i < result.entities.length; i++) {
                            var slaItem = result.entities[i];
                            if (slaItem) {
                                if (slaItem._workflowid_value) {
                                    childWorkflowIds.push(slaItem._workflowid_value);
                                }
                                if (slaItem.msdyn_customtimecalculation && slaItem._msdyn_customtimecalculationworkflowid_value) {
                                    customTimeCalculationWorkflows.push(slaItem._msdyn_customtimecalculationworkflowid_value);
                                }
                                // check if SLA is active and no changedattributelist for slaitem
                                var statecode = Xrm.Page.getAttribute("statecode");
                                if (statecode != null && statecode.getValue() == 1 && (slaItem.changedattributelist == null || slaItem.changedattributelist == "")) {
                                    slaItemNames.push(slaItem.name);
                                }
                                if (thisPtr_2.checkLinkEntityExistsInFetchXML(slaItem.applicablewhenxml) || thisPtr_2.checkLinkEntityExistsInFetchXML(slaItem.successconditionsxml) || thisPtr_2.checkLinkEntityExistsInFetchXML(slaItem.msdyn_pauseconfigurationxml)) {
                                    relatedEntitySLAItems.push(slaItem.name);
                                }
                                // check if SLA item has business calendar associated with it
                                if (slaItem._businesshoursid_value) {
                                    slaItemNamesWithBusinessHours.push({
                                        slaItemName: slaItem.name,
                                        businessHoursId: slaItem._businesshoursid_value
                                    });
                                }
                            }
                        }
                        // check if Business calendar has empty working hours
                        if (slaItemNamesWithBusinessHours.length > 0) {
                            thisPtr_2.showWarningNotificationIfWorkingHoursAreEmpty(slaItemNamesWithBusinessHours);
                        }
                        // check 1 :if SLA is active but any of workflow is deactivate
                        if (childWorkflowIds.length > 0) {
                            thisPtr_2.crossCheckifWorkflowsInActive(childWorkflowIds, Sla.CommonSource.SLAInactiveActionWorkflow);
                        }
                        // check 2 :if SLA is active with but any of Custom TC workflow is deactivate
                        if (customTimeCalculationWorkflows.length > 0) {
                            thisPtr_2.crossCheckifWorkflowsInActive(customTimeCalculationWorkflows, Sla.CommonSource.SLAInactiveCustomTimeCalculationWorkflow);
                        }
                        // check 3 :if SLA is active but any of workflow owner is disabled or left organization
                        // lets include static flow also as part of same check.
                        // TODO : somehow Static flow is giving false alarm, so will coss check and enable later
                        if (childWorkflowIds.length > 0) {
                            thisPtr_2.crossCheckifWorkflowsOwnerDisabled(childWorkflowIds);
                        }
                        else {
                        }
                        // shows form notificaiton if SLA is active and no changedattributelist for slaitem
                        if (slaItemNames.length > 0) {
                            var notificationMessage = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_ChangedAttribiteNullNotification);
                            var slaItems = slaItemNames.join(",");
                            notificationMessage = slaItemNames.length == 1 ? notificationMessage.replace("{0}", "Item " + slaItems) : notificationMessage.replace("{0}", "Items " + slaItems);
                            notificationMessage = notificationMessage.replace("{1}", ClientUtility.DataManager.getMSDocsRedirectBaseURL() + "/fwlink/p/?linkid=2239824");
                            Xrm.Page.ui.setFormNotification(notificationMessage, "WARNING", Sla.CommonSource.SLAChangedAttribiteNullNotification);
                        }
                        if (relatedEntitySLAItems.length > 0) {
                            var notificationMessage = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_RelatedEntitiesNotification);
                            var slaItems = relatedEntitySLAItems.join(",");
                            notificationMessage = relatedEntitySLAItems.length == 1 ? notificationMessage.replace("{0}", slaItems) : notificationMessage.replace("{0}", slaItems).replace("Item", "Items");
                            notificationMessage = notificationMessage.replace("{1}", ClientUtility.DataManager.getMSDocsBaseURL() + "/dynamics365/customer-service/sla-limitations");
                            Xrm.Page.ui.setFormNotification(notificationMessage, "WARNING", Sla.CommonSource.SLARelatedEntitiesNotification);
                        }
                    }, function error(error) {
                        thisPtr_2.logError(error, Sla.CommonSource.SLAInactiveStaticWorkflow);
                    });
                }
                catch (exception) {
                    Sla.Telemetry.logError(Sla.CommonSource.SLAInactiveStaticWorkflow, {
                        "Feature": "SLA",
                        "Log": "Error in showWarningIfSLAWorkflowsOwnedByDisabledUsers",
                        "Error": exception
                    });
                }
            };
            // show notification message if business calendar has empty working hours
            _this.showWarningNotificationIfWorkingHoursAreEmpty = function (slaItemsArray) {
                var thisPtr = _this;
                var slaItemNames = [];
                var promises = slaItemsArray.map(function (item) {
                    var fetchXml = SlaMainSystemLibraryUCWebResource.FETCHXML_CALENDAR_RULES.replace(/\{0}/g, item.businessHoursId);
                    return Xrm.WebApi.retrieveMultipleRecords("calendar", "?fetchXml=" + fetchXml).then(function success(result) {
                        if (result.entities.length === 0) {
                            slaItemNames.push(item.slaItemName);
                        }
                    }, function error(error) {
                        thisPtr.logError(error, Sla.CommonSource.SLAFailToShowNotification);
                    });
                });
                Promise.all(promises).then(function () {
                    if (slaItemNames.length > 0) {
                        var notificationMessage = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_WorkingHoursEmptyNotification);
                        var slaItems = slaItemNames.join(",");
                        notificationMessage = slaItemNames.length === 1 ? notificationMessage.replace("{0}", "Item " + slaItems) : notificationMessage.replace("{0}", "Items " + slaItems);
                        Xrm.Page.ui.setFormNotification(notificationMessage, "WARNING", Sla.CommonSource.SLAWorkingHoursEmptyNotification);
                    }
                });
            };
            // check whether fetch xml contains link-entity or not
            _this.checkLinkEntityExistsInFetchXML = function (fetchXml) {
                if (fetchXml != null && fetchXml.indexOf("link-entity") != -1) {
                    return true;
                }
                else {
                    return false;
                }
            };
            // show proactive notification when we detect static flow or create action flow is disabled
            // If EnableSLAInstanceMonitoringWarningAndExpiryV2Flow is enabled on Customer's org,
            // Then This notification will not be shown as in that org static flow has to be turned off.
            _this.showWarningIfStaticFlowIsDisabled = function () {
                if (_this.getFeatureControlSetting("CS.SLAModernizations", "EnableSLAInstanceMonitoringWarningAndExpiryV2Flow", false)) {
                    return;
                }
                var thisPtr = _this;
                Xrm.WebApi.retrieveMultipleRecords("workflow", "?fetchXml=" + SlaMainSystemLibraryUCWebResource.FETCHXML_STATIC_WORKFLOW_MODERN_SLA).then(function success(result) {
                    var allIds = [SlaMainSystemLibraryUCWebResource.MODERN_SLA_STATIC_WORKFLOW_ID];
                    for (var i = 0; i < result.entities.length; i++) {
                        var wfRecord = result.entities[i];
                        // if its active i.e StateCode 1 for WF, remove the id.
                        if (wfRecord.statecode == 1) {
                            var index = allIds.indexOf(wfRecord.workflowid, 0);
                            if (index > -1) {
                                allIds.splice(index, 1);
                            }
                        }
                    }
                    // show error with all inactive Workflow Ids
                    if (allIds.length > 0) {
                        Sla.Telemetry.logInfo(Sla.CommonSource.SLAInactiveStaticWorkflow, {
                            "Feature": "AutoFix",
                            "Log": "Showing warning with all inactive static Workflow Ids:" + allIds.toString()
                        });
                        thisPtr._staticWorkflowIds = allIds;
                        var notificationMessage = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_WorkflowNotInActiveState);
                        thisPtr.showAppLevelNotification(SlaEnums.NOTIFICATION_TYPE.MODERN_SLA_STATIC_FLOW_TYPE, notificationMessage.replace("{0}", allIds.toString()));
                    }
                    // now check for other workflows. to avoid form load being slow, lets do in serial
                    thisPtr.fetchAllWorkflorsForSlaOrSlaItems();
                }, function error(error) {
                    thisPtr.logError(error, Sla.CommonSource.SLAInactiveStaticWorkflow);
                });
            };
            // show proactive notification when we detect any dependency is disabled for Modern SLA.
            _this.showWarningIfDependenciesDisabledForModernSLA = function () {
                try {
                    // show warning if SLA is active but Static flow is disabled
                    var statecode = Xrm.Page.getAttribute("statecode");
                    if (statecode != null && statecode.getValue() != null && statecode.getValue() == 1) {
                        _this.showWarningIfStaticFlowIsDisabled();
                    }
                    var thisPtr_3 = _this;
                    // check for dependent Custom action.
                    Xrm.WebApi.retrieveMultipleRecords("workflow", "?fetchXml=" + SlaMainSystemLibraryUCWebResource.FETCHXML_WORKFLOW_MODERN_SLA).then(function success(result) {
                        var allIds = [SlaMainSystemLibraryUCWebResource.MANAGE_SLA_INSTANCES_WORKFLOW_ID, SlaMainSystemLibraryUCWebResource.MODERN_SLA_CREATE_ACTION_WORKFLOW_ID];
                        for (var i = 0; i < result.entities.length; i++) {
                            var wfRecord = result.entities[i];
                            // if its active i.e StateCode 1 for WF, remove the id.
                            if (wfRecord.statecode == 1) {
                                var index = allIds.indexOf(wfRecord.workflowid, 0);
                                if (index > -1) {
                                    allIds.splice(index, 1);
                                }
                            }
                        }
                        // show warning with all inactive Workflow Ids
                        if (allIds.length > 0) {
                            Sla.Telemetry.logInfo(Sla.CommonSource.SLAInactiveWorkflows, {
                                "Feature": "AutoFix",
                                "Log": "Showing warning with all inactive Workflow Ids:" + allIds.toString()
                            });
                            thisPtr_3._workflowIds = allIds;
                            var notificationMessage = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_WorkflowNotInActiveState);
                            thisPtr_3.showAppLevelNotification(Sla.SlaEnums.NOTIFICATION_TYPE.MODERN_SLA_WORKFLOW_TYPE, notificationMessage.replace("{0}", allIds.toString()));
                        }
                    }, function error(error) {
                        thisPtr_3.logError(error, Sla.CommonSource.SLAInactiveWorkflows);
                    });
                    // check for related SDK messages/
                    Xrm.WebApi.retrieveMultipleRecords("sdkmessageprocessingstep", "?fetchXml=" + SlaMainSystemLibraryUCWebResource.FETCHXML_SDK_MESSAGE_STEP_MODERN_SLA).then(function success(result) {
                        var allIds = [SlaMainSystemLibraryUCWebResource.MANAGE_SLA_INSTANCES_SDK_MESSAGE_ID, SlaMainSystemLibraryUCWebResource.SLA_KPI_INSTANCE_PRE_CREATE_SDK_MESSAGE_ID, SlaMainSystemLibraryUCWebResource.SLA_KPI_INSTANCE_POST_CREATE_SDK_MESSAGE_ID, SlaMainSystemLibraryUCWebResource.SLA_KPI_INSTANCE_POST_UPDATE_SDK_MESSAGE_ID, SlaMainSystemLibraryUCWebResource.SLA_PRE_OPERATION_UPDATE_SDK_MESSAGE_ID, SlaMainSystemLibraryUCWebResource.SLA_CREATE_ACTION_FLOW_SDK_MESSAGE_ID];
                        for (var i = 0; i < result.entities.length; i++) {
                            var sdkMessagingStepRecord = result.entities[i];
                            // if its active i.e StateCode 0 for SDK, remove the id.
                            if (sdkMessagingStepRecord.statecode == 0) {
                                var index = allIds.indexOf(sdkMessagingStepRecord.sdkmessageprocessingstepid, 0);
                                if (index > -1) {
                                    allIds.splice(index, 1);
                                }
                            }
                        }
                        // show warning with all inactive SDK Step Ids
                        if (allIds.length > 0) {
                            Sla.Telemetry.logInfo(Sla.CommonSource.SLAInactiveSDKStepsPlugins, {
                                "Feature": "AutoFix",
                                "Log": "Showing warning with all inactive SDK Step Ids:" + allIds.toString()
                            });
                            thisPtr_3._sdkMessageStepIds = allIds;
                            var notificationMessage = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_SDKMessagingStepNotInActiveState);
                            thisPtr_3.showAppLevelNotification(SlaEnums.NOTIFICATION_TYPE.MODERN_SLA_SDKMESSAGINGSTEPS_TYPE, notificationMessage.replace("{0}", allIds.toString()));
                        }
                    }, function error(error) {
                        thisPtr_3.logError(error, Sla.CommonSource.SLAInactiveSDKStepsPlugins);
                    });
                }
                catch (exception) {
                    Sla.Telemetry.logError(Sla.CommonSource.SLAFailToShowNotification, Sla.TelemetryErrors.SLAFailToShowNotificationError, {
                        "Feature": "AutoFix",
                        "Log": "Error in showWarningIfDependenciesDisabledForModernSLA",
                        "Error": exception
                    });
                }
            };
            // show proactive App level notification when we detect any dependency is disabled for legacy/Modern SLA.
            _this.showWarningIfIncidentPluginSDKMessageDisabled = function () {
                try {
                    var thisPtr_4 = _this;
                    // check if all require SDK messaging steps are enabled.
                    Xrm.WebApi.retrieveMultipleRecords("sdkmessageprocessingstep", "?fetchXml=" + SlaMainSystemLibraryUCWebResource.FETCHXML_SDK_MESSAGE_STEP_INCIDENT_ENTITY).then(function success(result) {
                        var allIds = [SlaMainSystemLibraryUCWebResource.INCIDENT_POST_CREATE_PLUGIN_SDK_MESSAGE_ID, SlaMainSystemLibraryUCWebResource.INCIDENT_POST_UPDATE_PLUGIN_SDK_MESSAGE_ID];
                        for (var i = 0; i < result.entities.length; i++) {
                            var sdkMessagingStepRecord = result.entities[i];
                            // if its active i.e StateCode 0 for SDK, remove the id.
                            if (sdkMessagingStepRecord.statecode == 0) {
                                var index = allIds.indexOf(sdkMessagingStepRecord.sdkmessageprocessingstepid, 0);
                                if (index > -1) {
                                    allIds.splice(index, 1);
                                }
                            }
                        }
                        // show warning with all inactive SDK Step Ids
                        if (allIds.length > 0) {
                            Sla.Telemetry.logInfo(Sla.CommonSource.SLAInactiveSDKStepsIncident, {
                                "Feature": "AutoFix",
                                "Log": "Showing warning with all inactive SDK Step Ids for Incident:" + allIds.toString()
                            });
                            thisPtr_4._incidentSDKMessageStepIds = allIds;
                            var notificationMessage = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_SDKMessagingStepNotInActiveState);
                            thisPtr_4.showAppLevelNotification(SlaEnums.NOTIFICATION_TYPE.INCIDENT_SDKMESSAGINGSTEPS_TYPE, notificationMessage.replace("{0}", allIds.toString()));
                        }
                    }, function error(error) {
                        thisPtr_4.logError(error, Sla.CommonSource.SLAInactiveSDKStepsIncident);
                    });
                }
                catch (exception) {
                    Sla.Telemetry.logError(Sla.CommonSource.SLAInactiveSDKStepsIncident, Sla.TelemetryErrors.IncidentPluginError, {
                        "Feature": "AutoFix",
                        "Log": "Error in showWarningIfIncidentPluginSDKMessageDisabled",
                        "Error": exception
                    });
                }
            };
            // show proactive App level notification when we detect any dependency is disabled for legacy/Modern SLA.
            _this.showWarningIfCustomEntityPluginSDKMessageDisabled = function (objectTypeCode) {
                try {
                    var thisPtr_5 = _this;
                    var fetchXml = Sla.SlaMainSystemLibraryBase.FETCHXML_SDK_MESSAGE_STEP_CUSTOM_ENTITY.replace(/\{0}/g, objectTypeCode);
                    // check if all require SDK messaging steps are enabled.
                    Xrm.WebApi.retrieveMultipleRecords("sdkmessageprocessingstep", "?fetchXml=" + fetchXml).then(function success(result) {
                        var pluginTypeIds = [Sla.SlaMainSystemLibraryBase.CUSTOM_ENTITY_PRE_CREATE_PLUGIN_TYPE_ID, Sla.SlaMainSystemLibraryBase.CUSTOM_ENTITY_PRE_UPDATE_PLUGIN_TYPE_ID, Sla.SlaMainSystemLibraryBase.CUSTOM_ENTITY_POST_CREATE_PLUGIN_TYPE_ID, Sla.SlaMainSystemLibraryBase.CUSTOM_ENTITY_POST_UPDATE_PLUGIN_TYPE_ID];
                        var sdkMessageProcessingStepIds = [];
                        for (var i = 0; i < result.entities.length; i++) {
                            var sdkMessagingStepRecord = result.entities[i];
                            // if its active i.e StateCode 0 for SDK, remove the id from plugin type list.
                            if (sdkMessagingStepRecord.statecode == 0) {
                                var index = pluginTypeIds.indexOf(sdkMessagingStepRecord._eventhandler_value, 0);
                                if (index > -1) {
                                    pluginTypeIds.splice(index, 1);
                                }
                            }
                            else {
                                // if its not active, add in SDK list.
                                sdkMessageProcessingStepIds.push(sdkMessagingStepRecord.sdkmessageprocessingstepid);
                            }
                        }
                        // show warning with all inactive SDK Step Ids.
                        // if plugin itself not registered, show warning but we may not get SDK id.
                        if (sdkMessageProcessingStepIds.length > 0 || pluginTypeIds.length > 0) {
                            Sla.Telemetry.logInfo(Sla.CommonSource.SLAInactiveSDKStepsCustomEntity, {
                                "Feature": "AutoFix",
                                "Log": "Showing warning with all inactive SDK Step Ids for Custom Entities:" + sdkMessageProcessingStepIds.toString()
                            });
                            thisPtr_5._customEntitySDKMessageStepIds = sdkMessageProcessingStepIds;
                            var notificationMessage = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_SDKMessagingStepNotInActiveState);
                            thisPtr_5.showAppLevelNotification(SlaEnums.NOTIFICATION_TYPE.CUSTOM_ENTITY_SDKMESSAGINGSTEPS_TYPE, notificationMessage.replace("{0}", sdkMessageProcessingStepIds.toString()));
                        }
                    }, function error(error) {
                        thisPtr_5.logError(error, Sla.CommonSource.SLAInactiveSDKStepsCustomEntity);
                    });
                }
                catch (exception) {
                    Sla.Telemetry.logError(Sla.CommonSource.SLAInactiveSDKStepsCustomEntity, Sla.TelemetryErrors.CustomEntityPluginError, {
                        "Feature": "AutoFix",
                        "Log": "Error in showWarningIfCustomEntityPluginSDKMessageDisabled",
                        "Error": exception
                    });
                }
            };
            // show warning notification if SLA Setting is disabled
            _this.showWarningIfSLASettingIsDisabled = function () {
                try {
                    var thisPtr_6 = _this;
                    var orgSettings = Xrm.Utility.getGlobalContext().organizationSettings;
                    var organization = {
                        id: orgSettings.organizationId,
                        entityType: "organization"
                    };
                    Xrm.WebApi.retrieveRecord(organization.entityType, organization.id, "?$select=suppresssla").then(function success(result) {
                        var orgRecord = result;
                        if (orgRecord.suppresssla) {
                            Sla.Telemetry.logInfo(Sla.CommonSource.SLASettingsDisable, {
                                "Feature": "AutoFix",
                                "Log": "Showing warning as SLA Settings is disabled"
                            });
                            var notificationMessage = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_SLAIsDisabledInSetting);
                            thisPtr_6.showAppLevelNotification(SlaEnums.NOTIFICATION_TYPE.SLA_DISABLED_IN_SERVICE_CONFIG, notificationMessage);
                        }
                    }, null);
                }
                catch (exception) {
                    Sla.Telemetry.logError(Sla.CommonSource.SLASettingsDisable, Sla.TelemetryErrors.SLAFailToShowNotificationError, {
                        "Feature": "AutoFix",
                        "Log": "Error in showWarningIfSLASettingIsDisabled",
                        "Error": exception
                    });
                }
            };
            // add global notification if no SLA is being set as default for any SLA enabled entity
            _this.addNotificationIfNoSLASetAsDefault = function (entityNameInSla) {
                var thisPtr = _this;
                var slaPrimaryentityotc = Xrm.Page.getAttribute("primaryentityotc");
                var fetchXml = SlaMainSystemLibraryUCWebResource.FETCHXML_DEFAULT_SLA.replace(/\{0}/g, slaPrimaryentityotc.getValue().toString());
                Xrm.WebApi.retrieveMultipleRecords("sla", "?fetchXml=" + fetchXml).then(function success(result) {
                    if (result.entities.length == 0) {
                        var callbackhandler = void 0;
                        callbackhandler = thisPtr.openLearnMoreForSetAsDefaultSLA;
                        var notificationMessage = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_NoSLASetAsDefault);
                        notificationMessage = notificationMessage.replace("{0}", entityNameInSla);
                        var actionObject = {
                            actionLabel: Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_OpenLearnMoreForSetAsDefaultSLA),
                            eventHandler: callbackhandler
                        };
                        var notification = {
                            type: 2,
                            level: 3,
                            message: notificationMessage,
                            action: actionObject,
                            showCloseButton: true
                        };
                        var XrmApp = Xrm.App;
                        XrmApp.addGlobalNotification(notification).then(function success(result) {
                            Sla.Telemetry.logInfo(Sla.CommonSource.NoSLASetAsDefault, {
                                "Feature": "SelfFix",
                                "Log": "Added notification if no SLA is being set as default."
                            });
                        }, function (error) {
                            thisPtr.logError(error, Sla.CommonSource.NoSLASetAsDefault);
                        });
                    }
                }, function error(error) {
                    thisPtr.logError(error, Sla.CommonSource.NoSLASetAsDefault);
                });
            };
            // show warning notification if no SLA is being set as default for any SLA enabled entity 
            _this.showWarningNotificationIfNoSLASetAsDefault = function () {
                try {
                    var thisPtr = _this;
                    var slaPrimaryentityotc = Xrm.Page.getAttribute("primaryentityotc");
                    if (slaPrimaryentityotc != null) {
                        var retrieveEntityDefinitionsContract = new RetrieveEntityDefinitions("$filter=ObjectTypeCode eq " + slaPrimaryentityotc.getValue().toString(), ["DisplayName"]);
                        Xrm.WebApi.online.execute(retrieveEntityDefinitionsContract).then(function (response) {
                            if (response) {
                                response.json().then(function (jsonResponse) {
                                    var entityNameInSla = jsonResponse &&
                                        jsonResponse.value &&
                                        jsonResponse.value[0] &&
                                        jsonResponse.value[0].DisplayName &&
                                        jsonResponse.value[0].DisplayName.UserLocalizedLabel &&
                                        jsonResponse.value[0].DisplayName.UserLocalizedLabel.Label;
                                    if (entityNameInSla) {
                                        Sla.Telemetry.logInfo(Sla.CommonSource.NoSLASetAsDefault, {
                                            "Feature": "SelfFix",
                                            "Log": "Showing warning if no SLA is being set as default for SLA enabled enity:" + entityNameInSla.toString()
                                        });
                                        thisPtr.addNotificationIfNoSLASetAsDefault(entityNameInSla);
                                    }
                                }, function (error) {
                                    thisPtr.logError(error, Sla.CommonSource.NoSLASetAsDefault);
                                });
                            }
                        }, function (error) {
                            thisPtr.logError(error, Sla.CommonSource.NoSLASetAsDefault);
                        });
                    }
                }
                catch (exception) {
                    Sla.Telemetry.logError(Sla.CommonSource.NoSLASetAsDefault, Sla.TelemetryErrors.SLAFailToShowNotificationError, {
                        "Feature": "SelfFix",
                        "Log": "Error in showWarningNotificationIfNoSLASetAsDefault",
                        "Error": exception
                    });
                }
            };
            // wrapper function to show App level notificaton, supported only in UCI.
            _this.showAppLevelNotification = function (requestType, message) {
                // based on the request, will add the callback handler so that we can track
                var callbackhandler;
                switch (requestType) {
                    case SlaEnums.NOTIFICATION_TYPE.MODERN_SLA_STATIC_FLOW_TYPE:
                        callbackhandler = _this.tryActivatingStaticWorkflow;
                        break;
                    case SlaEnums.NOTIFICATION_TYPE.MODERN_SLA_WORKFLOW_TYPE:
                        callbackhandler = _this.tryActivatingWorkflow;
                        break;
                    case SlaEnums.NOTIFICATION_TYPE.MODERN_SLA_SDKMESSAGINGSTEPS_TYPE:
                        callbackhandler = _this.tryActivatingSDKMessageProcessingSteps;
                        break;
                    case SlaEnums.NOTIFICATION_TYPE.INCIDENT_SDKMESSAGINGSTEPS_TYPE:
                        callbackhandler = _this.tryActivatingIncidentSDKMessageProcessingSteps;
                        break;
                    case SlaEnums.NOTIFICATION_TYPE.CUSTOM_ENTITY_SDKMESSAGINGSTEPS_TYPE:
                        callbackhandler = _this.tryActivatingCustomEntitySDKMessageProcessingSteps;
                        break;
                    case SlaEnums.NOTIFICATION_TYPE.SLA_ACTION_WORKFLOWS:
                        callbackhandler = _this.tryActivatingActionWorkflow;
                        break;
                    case SlaEnums.NOTIFICATION_TYPE.SLA_CUSTOM_TIMECALCULATION_WORKFLOWS:
                        callbackhandler = _this.tryActivatingCustomTimeCalculationWorkflow;
                        break;
                    case SlaEnums.NOTIFICATION_TYPE.SLA_DISABLED_IN_SERVICE_CONFIG:
                        callbackhandler = _this.tryActivatingSLASettingsFromServiceConfig;
                        break;
                    default:
                        return;
                }
                var thisPtr = _this;
                // define action object
                var actionObject = {
                    actionLabel: Sla.ResourceStringProvider.getResourceString(Sla.Constants.Activate),
                    eventHandler: callbackhandler
                };
                // define notification object
                var notification = {
                    type: 2,
                    level: 2,
                    message: message,
                    action: actionObject,
                    showCloseButton: true
                };
                var XrmApp = Xrm.App;
                XrmApp.addGlobalNotification(notification, actionObject, null).then(function success(result) {
                    // we want to track the ID for Notification, so that we can clear if AutoFix works
                    switch (requestType) {
                        case SlaEnums.NOTIFICATION_TYPE.MODERN_SLA_STATIC_FLOW_TYPE:
                            thisPtr._staticWorkflowNotificationId = result;
                            break;
                        case SlaEnums.NOTIFICATION_TYPE.MODERN_SLA_WORKFLOW_TYPE:
                            thisPtr._workflowNotificationId = result;
                            break;
                        case SlaEnums.NOTIFICATION_TYPE.MODERN_SLA_SDKMESSAGINGSTEPS_TYPE:
                            thisPtr._SDKMessageProcessingStepsNotificationId = result;
                            break;
                        case SlaEnums.NOTIFICATION_TYPE.INCIDENT_SDKMESSAGINGSTEPS_TYPE:
                            thisPtr._IncidentSDKMessageProcessingStepsNotificationId = result;
                            break;
                        case SlaEnums.NOTIFICATION_TYPE.CUSTOM_ENTITY_SDKMESSAGINGSTEPS_TYPE:
                            thisPtr._customEntitySDKMessageProcessingStepsNotificationId = result;
                            break;
                        case SlaEnums.NOTIFICATION_TYPE.SLA_ACTION_WORKFLOWS:
                            thisPtr._actionWorkflowNotificationId = result;
                            break;
                        case SlaEnums.NOTIFICATION_TYPE.SLA_CUSTOM_TIMECALCULATION_WORKFLOWS:
                            thisPtr._customTimeCalculationWorkflowNotificationId = result;
                            break;
                        case SlaEnums.NOTIFICATION_TYPE.SLA_DISABLED_IN_SERVICE_CONFIG:
                            thisPtr._disableSLASettingsInServiceConfigNotificationId = result;
                            break;
                        default:
                            break;
                    }
                }, null);
            };
            // this callback wrapper is for Static Flow activation, 
            // as we show this notification only when SLA is active, so define seprately.
            _this.tryActivatingStaticWorkflow = function () {
                _this.tryActivation("workflow", SlaEnums.NOTIFICATION_TYPE.MODERN_SLA_STATIC_FLOW_TYPE, _this._staticWorkflowIds);
            };
            // this callback wrapper is for Workflow dependencies for modern SLA.
            _this.tryActivatingWorkflow = function () {
                _this.tryActivation("workflow", SlaEnums.NOTIFICATION_TYPE.MODERN_SLA_WORKFLOW_TYPE, _this._workflowIds);
            };
            // this callback wrapper is for actionWorkflows dependencies for modern SLA.
            _this.tryActivatingActionWorkflow = function () {
                _this.tryActivation("workflow", SlaEnums.NOTIFICATION_TYPE.SLA_ACTION_WORKFLOWS, _this._actionWorkflowIds);
            };
            // this callback wrapper is for Custom TimeCalculation Workflow dependencies for modern SLA.
            _this.tryActivatingCustomTimeCalculationWorkflow = function () {
                _this.tryActivation("workflow", SlaEnums.NOTIFICATION_TYPE.SLA_CUSTOM_TIMECALCULATION_WORKFLOWS, _this._customTimeCalculationWorkflowIds);
            };
            // this callback wrapper is for SDK dependencies for modern SLA.
            _this.tryActivatingSDKMessageProcessingSteps = function () {
                _this.tryActivation("sdkmessageprocessingstep", SlaEnums.NOTIFICATION_TYPE.MODERN_SLA_SDKMESSAGINGSTEPS_TYPE, _this._sdkMessageStepIds);
            };
            // this callback wrapper is for Incident SDK dependencies for modern SLA.
            _this.tryActivatingIncidentSDKMessageProcessingSteps = function () {
                _this.tryActivation("sdkmessageprocessingstep", SlaEnums.NOTIFICATION_TYPE.INCIDENT_SDKMESSAGINGSTEPS_TYPE, _this._incidentSDKMessageStepIds);
            };
            // this callback wrapper is for Custom entity SDK dependencies for modern/legacy SLA.
            _this.tryActivatingCustomEntitySDKMessageProcessingSteps = function () {
                _this.tryActivation("sdkmessageprocessingstep", SlaEnums.NOTIFICATION_TYPE.CUSTOM_ENTITY_SDKMESSAGINGSTEPS_TYPE, _this._customEntitySDKMessageStepIds);
            };
            // this callback wrapper is for Service Configuration Disable SLA settings dependencies for modern SLA.
            _this.tryActivatingSLASettingsFromServiceConfig = function () {
                try {
                    var thisPtr_7 = _this;
                    var orgSettings = Xrm.Utility.getGlobalContext().organizationSettings;
                    var organization = {
                        id: orgSettings.organizationId,
                        entityType: "organization"
                    };
                    Xrm.WebApi.updateRecord(organization.entityType, organization.id, { suppresssla: false }).then(function () {
                        thisPtr_7.handleUpdateCallback(thisPtr_7, SlaEnums.NOTIFICATION_TYPE.SLA_DISABLED_IN_SERVICE_CONFIG, false, "");
                    }, function (error) {
                        console.log("SLAMainLibraryUC::tryActivatingSLASettingsFromServiceConfig:error:" + error);
                        thisPtr_7.handleUpdateCallback(thisPtr_7, SlaEnums.NOTIFICATION_TYPE.SLA_DISABLED_IN_SERVICE_CONFIG, true, error.message);
                    });
                }
                catch (exception) {
                    Xrm.Navigation.openErrorDialog({ message: exception });
                    Sla.Telemetry.logError(Sla.CommonSource.SLASettingsDisable, {
                        "Feature": "SLA",
                        "Log": "Error in tryActivatingSLASettingsFromServiceConfig",
                        "Error": exception
                    });
                }
            };
            // as we show this notification only when SLA's primary entity has no default SLA set.
            _this.openLearnMoreForSetAsDefaultSLA = function () {
                Xrm.Navigation.openUrl(ClientUtility.DataManager.getMSDocsBaseURL() + "/en-us/dynamics365/customer-service/define-service-level-agreements?tabs=customerserviceadmincenter#set-an-sla-as-the-default");
                Sla.Telemetry.logInfo(Sla.CommonSource.NoSLASetAsDefault, {
                    "Feature": "SelfFix",
                    "Log": "Learn more link was clicked by user to know about default SLA setting."
                });
            };
            // show alert dialog if activation is pass/fail.
            _this.handleUpdateCallback = function (thisPtr, requestType, failed, errormessage) {
                // close the progress dialog.
                Xrm.Utility.closeProgressIndicator();
                // if we show failed dialog, lets not remove notifcation.
                if (failed) {
                    Xrm.Navigation.openErrorDialog({ message: errormessage });
                    return;
                }
                // clear the notificaiton Id if all the updates are successful.
                var XrmApp = Xrm.App;
                switch (requestType) {
                    case SlaEnums.NOTIFICATION_TYPE.MODERN_SLA_STATIC_FLOW_TYPE:
                        XrmApp.clearGlobalNotification(thisPtr._staticWorkflowNotificationId);
                        break;
                    case SlaEnums.NOTIFICATION_TYPE.MODERN_SLA_WORKFLOW_TYPE:
                        XrmApp.clearGlobalNotification(thisPtr._workflowNotificationId);
                        break;
                    case SlaEnums.NOTIFICATION_TYPE.MODERN_SLA_SDKMESSAGINGSTEPS_TYPE:
                        XrmApp.clearGlobalNotification(thisPtr._SDKMessageProcessingStepsNotificationId);
                        break;
                    case SlaEnums.NOTIFICATION_TYPE.INCIDENT_SDKMESSAGINGSTEPS_TYPE:
                        XrmApp.clearGlobalNotification(thisPtr._IncidentSDKMessageProcessingStepsNotificationId);
                        break;
                    case SlaEnums.NOTIFICATION_TYPE.CUSTOM_ENTITY_SDKMESSAGINGSTEPS_TYPE:
                        XrmApp.clearGlobalNotification(thisPtr._customEntitySDKMessageProcessingStepsNotificationId);
                        break;
                    case SlaEnums.NOTIFICATION_TYPE.SLA_ACTION_WORKFLOWS:
                        XrmApp.clearGlobalNotification(thisPtr._actionWorkflowNotificationId);
                        break;
                    case SlaEnums.NOTIFICATION_TYPE.SLA_CUSTOM_TIMECALCULATION_WORKFLOWS:
                        XrmApp.clearGlobalNotification(thisPtr._customTimeCalculationWorkflowNotificationId);
                        break;
                    case SlaEnums.NOTIFICATION_TYPE.SLA_DISABLED_IN_SERVICE_CONFIG:
                        XrmApp.clearGlobalNotification(thisPtr._disableSLASettingsInServiceConfigNotificationId);
                        break;
                    default:
                        break;
                }
            };
            _this.tryActivation = function (entityType, requestType, allIds) {
                // based on workflow and SDK message, use statecode values accordingly. 
                if (entityType == "workflow") {
                    var data = { "statecode": 1, "statuscode": 2 }; // WF on 
                }
                else if (entityType == "sdkmessageprocessingstep") {
                    var data = { "statecode": 0, "statuscode": 1 }; // SDK on 
                }
                else {
                    return;
                }
                var thisPtr = _this;
                var count = 0;
                var failedUpdates = 0;
                var errorMessage = "";
                Xrm.Utility.showProgressIndicator("");
                for (var id in allIds) {
                    Xrm.WebApi.updateRecord(entityType, allIds[id], data).then(function success(result) {
                        count++;
                        if (count == allIds.length) {
                            thisPtr.handleUpdateCallback(thisPtr, requestType, failedUpdates != 0 ? true : false, errorMessage);
                        }
                        Sla.Telemetry.logInfo(Sla.CommonSource.SLAActivationSuccessful, {
                            "Feature": "AutoFix",
                            "Log": "Succesfully activated for requestType:" + SlaEnums.NOTIFICATION_TYPE[requestType] + " for id:" + allIds[id],
                            "Count": count
                        });
                    }, function (error) {
                        count++;
                        failedUpdates++;
                        // for now, lets use the last error message to propogate to end user.
                        errorMessage = error.message;
                        if (count == allIds.length) {
                            thisPtr.handleUpdateCallback(thisPtr, requestType, failedUpdates != 0 ? true : false, errorMessage);
                        }
                        Sla.Telemetry.logError(Sla.CommonSource.SLAActivationFailed, {
                            "Feature": "AutoFix",
                            "Log": "Error in activating for requestType:" + SlaEnums.NOTIFICATION_TYPE[requestType] + " for id:" + allIds[id],
                            "Count": count,
                            "Error": errorMessage
                        });
                    });
                }
            };
            _this.handleMigrationTabOnLoad = function () {
                try {
                    // check if migration tab exists, else return
                    var tabUCMigration = Xrm.Page.ui.tabs.getByName(_this._migrationTabName);
                    if (tabUCMigration == null) {
                        return;
                    }
                    var recordId = Xrm.Page.data.entity.getId();
                    if (recordId == "" || recordId == undefined || recordId == null) {
                        tabUCMigration.setVisible(false);
                        return;
                    }
                    var fetchXmlAttributes = '<attribute name="msdyn_migrationstatus" /> <attribute name="msdyn_migrationtrackerid" />';
                    var fetchXmlHeader = '<fetch version="1.0" mapping="logical" returntotalrecordcount="true"> <entity name="msdyn_migrationtracker">';
                    var callSpecificFilter = recordId ? '<filter type="and"><condition attribute="msdyn_modernslaid" operator="eq" value="' + recordId + '"/><condition attribute="msdyn_migrationtype" operator="eq" value="0"/><condition attribute="msdyn_objecttypecode" operator="eq" value="9750"/></filter>' : null;
                    var fetchXml = fetchXmlHeader + fetchXmlAttributes + callSpecificFilter + '</entity></fetch>';
                    Xrm.WebApi.retrieveMultipleRecords("msdyn_migrationtracker", "?fetchXml=" + fetchXml).then(function (response) {
                        if (response.entities.length == 0) {
                            //console.log("SLAMainLibraryUC::handleMigrationTabOnLoad:No tracker found.");
                            return;
                        }
                        ;
                        _this._trackerEntity = response.entities[0];
                        tabUCMigration.setVisible(true);
                        // update control visibility as per status
                        var migrationStatus = _this._trackerEntity.msdyn_migrationstatus;
                        var migrationStatusDetailsControl = Xrm.Page.getControl(_this._migrationDetailsControlName);
                        // show or hide details pane based on selection
                        if (migrationStatus == _this._migratedStatus) {
                            if (migrationStatusDetailsControl != null) {
                                migrationStatusDetailsControl.setVisible(false);
                            }
                        }
                        else if (migrationStatus == _this._incompleteStatus || migrationStatus == _this._notstartedStatus) {
                            if (migrationStatusDetailsControl != null) {
                                migrationStatusDetailsControl.setVisible(true);
                            }
                        }
                    }, function (error) {
                        console.log("SLAMainLibraryUC::handleMigrationTabOnLoad:error:" + error);
                    });
                }
                catch (exception) {
                    console.log("SLAMainLibraryUC::handleMigrationTabOnLoad:exception:" + exception);
                }
            };
            // ----- migration tab related handling end ------
            _this.disableAllControls = function () {
                var controlsToDisable = Xrm.Page.ui.controls.get();
                for (var i in controlsToDisable) {
                    var controlToDisable = controlsToDisable[i];
                    if (controlToDisable.getDisabled && controlToDisable.setDisabled && !controlToDisable.getDisabled()) {
                        controlToDisable.setDisabled(true);
                    }
                }
                // Hide the grid
                Xrm.Page.getControl("SLADetails").setVisible(false);
                Xrm.Page.getControl("SLAItemsUCI").setVisible(false);
            };
            _this.updateIfSlaActive = function (slaId, entityName, columnNames, isForm, gridControl, records, entityTypeCode) {
                // Caller is sending column names in array. Generating string in order to use Odata
                var cols = "";
                for (var _i = 0, columnNames_1 = columnNames; _i < columnNames_1.length; _i++) {
                    var val = columnNames_1[_i];
                    cols = cols + val + ",";
                }
                var selectQuery = "";
                if (cols.length > 0) {
                    selectQuery = "?$select=" + cols;
                }
                Xrm.WebApi.retrieveRecord(Sla.EntityNames.SLA, slaId, selectQuery).then(function (slarecord) {
                    if (!ClientUtility.DataUtil.isNullOrUndefined(slarecord.statecode)) {
                        if (slarecord.statecode !== Sla.SLAState.active) {
                            var alertStrings = {
                                text: Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_SettingInactiveSLAAsDefaultAlertText),
                                title: Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_SettingInactiveSLAAsDefaultAlertTitle)
                            };
                            Xrm.Navigation.openAlertDialog(alertStrings);
                            return;
                        }
                        var otc = _this._legacyObjectTypeCode;
                        if (!ClientUtility.DataUtil.isNullOrUndefined(slarecord.objecttypecode)) {
                            otc = slarecord.objecttypecode;
                        }
                        _this.updateSlaIfNoDefaultSlaExists(gridControl, records, entityTypeCode, slaId, entityName, isForm, otc);
                    }
                }, ClientUtility.ActionFailedHandler.actionFailedCallback);
            };
            _this.updateSlaIfNoDefaultSlaExists = function (gridControl, records, entityTypeCode, slaId, entityName, isForm, currentTypeCode) {
                var fetchXml = null;
                var otc = Sla.EntityTypeCodes.Incident;
                if (currentTypeCode !== _this._legacyObjectTypeCode && currentTypeCode !== Sla.EntityTypeCodes.Incident.toString()) {
                    otc = currentTypeCode;
                    fetchXml = "<fetch version='1.0' mapping='logical'>" +
                        "<entity name='sla'><attribute name='slaid' />" +
                        "<filter type='and'><condition attribute='isdefault' operator='eq' value='1' />" +
                        "<condition attribute= 'objecttypecode' operator= 'eq' value= '";
                    fetchXml += parent.CrmEncodeDecode.CrmXmlAttributeEncode(currentTypeCode);
                    fetchXml += "' /></filter></entity></fetch>";
                }
                else {
                    fetchXml = "<fetch version='1.0' mapping='logical'>" +
                        "<entity name='sla'><attribute name='slaid' />" +
                        "<filter type='and'>" +
                        "<condition attribute='isdefault' operator= 'eq' value= '1' />" +
                        "<filter type='or'>" +
                        "<condition attribute='objecttypecode' operator='eq' value='";
                    fetchXml += parent.CrmEncodeDecode.CrmXmlAttributeEncode("112");
                    fetchXml += "' /><condition attribute='objecttypecode' operator='null' /></filter></filter></entity></fetch>";
                }
                var slaEntities = null;
                Xrm.WebApi.retrieveMultipleRecords(Sla.EntityNames.SLA, "?fetchXml=" + fetchXml).then(function (response) {
                    slaEntities = response.entities;
                    var defaultSlaId = null;
                    if (slaEntities.length > 0) {
                        defaultSlaId = slaEntities[0].slaid.toString();
                    }
                    else {
                        defaultSlaId = "";
                    }
                    var requestString = "/api/data/v9.0/EntityDefinitions?$select=DisplayName&$filter=ObjectTypeCode eq " + otc.toString();
                    var request = new XMLHttpRequest();
                    var clientUrl = Xrm.Page.context.getClientUrl() + requestString;
                    request.open("GET", clientUrl, true);
                    request.setRequestHeader("OData-MaxVersion", "4.0");
                    request.setRequestHeader("OData-Version", "4.0");
                    request.setRequestHeader("Accept", "application/json");
                    request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                    request.onreadystatechange = function () {
                        if (request.readyState == 4 /* complete */) {
                            request.onreadystatechange = null;
                            var entityNameInSla = "";
                            if (request.status == 200) {
                                var data = JSON.parse(request.response);
                                if (data != null && data.value && data.value.length > 0 && data.value[0].DisplayName && data.value[0].DisplayName.UserLocalizedLabel) {
                                    entityNameInSla = data.value[0].DisplayName.UserLocalizedLabel.Label;
                                }
                            }
                            if (isForm) {
                                _this.updateDefaultSla(slaId, defaultSlaId, entityNameInSla, Xrm.Page.ui);
                            }
                            else {
                                _this.updateDefaultSlaByGrid(gridControl, records, entityTypeCode, slaId, defaultSlaId, entityNameInSla);
                            }
                            Sla.Telemetry.logInfo("SetAsDefaultSLA", {
                                "Feature": "SLA",
                                "Log": "Updated SLA Id " + slaId.toString() + " by setting it as the default SLA."
                            });
                        }
                    };
                    request.send();
                }, ClientUtility.ActionFailedHandler.actionFailedCallback);
            };
            _this.updateDefaultSlaByGrid = function (gridControl, records, entityTypeCode, slaId, defaultSlaId, entityNameInSla) {
                if (!ClientUtility.DataUtil.isNullOrEmptyString(defaultSlaId) && defaultSlaId.toUpperCase() === slaId.toUpperCase()) {
                    Xrm.Navigation.openAlertDialog({
                        text: Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_DefaultSLAWarning)
                    });
                    return;
                }
                _this.updateDefaultSla(slaId, defaultSlaId, entityNameInSla, gridControl);
            };
            _this.updateDefaultSla = function (slaId, defaultSlaId, entityNameInSla, controlToRefresh) {
                var dialogText = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_DefaultSLASelectionConfirmDialogText);
                var dialogTitle = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_DefaultSLASelectionConfirmDialogTitle);
                var defaultSLAExistsNotice = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_DefaultSLAOverrideConfirmDialogText);
                defaultSLAExistsNotice = defaultSLAExistsNotice.replace("{0}", entityNameInSla);
                if (!ClientUtility.DataUtil.isNullOrEmptyString(defaultSlaId)) {
                    dialogText = defaultSLAExistsNotice,
                        dialogTitle = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_DefaultSLAOverrideConfirmDialogTitle);
                }
                var confirmDialogOptions = {
                    title: dialogTitle,
                    text: dialogText
                };
                var confirmOptions = {
                    height: 200,
                    width: 450
                };
                Xrm.Navigation.openConfirmDialog(confirmDialogOptions, confirmOptions).then(function (response) {
                    if (response.confirmed) {
                        if (!ClientUtility.DataUtil.isNullOrEmptyString(defaultSlaId)) {
                            // reset the old one and the set the new one
                            _this.resetOldDefaultSLAsAndSetNew(slaId, defaultSlaId, controlToRefresh);
                        }
                        else {
                            _this.setSLARecordAsDefault(slaId, controlToRefresh);
                        }
                    }
                });
            };
            _this.resetOldDefaultSLAsAndSetNew = function (SLAId, oldDefaultSlaId, controlToRefresh) {
                Xrm.Utility.showProgressIndicator(Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_DefaultSLASetttingInProgress));
                Xrm.WebApi.updateRecord(Sla.EntityNames.SLA, oldDefaultSlaId, {
                    "isdefault": false
                }).then(function (response) {
                    _this.setSLARecordAsDefault(SLAId, controlToRefresh, false);
                }, function (error) {
                    Xrm.Utility.closeProgressIndicator();
                    controlToRefresh && (controlToRefresh.refresh());
                    Xrm.Navigation.openAlertDialog({
                        text: Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_ErrorResettingDefaultSLA)
                    });
                });
            };
            _this.setSLARecordAsDefault = function (SLAId, controlToRefresh, callShowProgress) {
                if (callShowProgress === void 0) { callShowProgress = true; }
                if (callShowProgress) {
                    Xrm.Utility.showProgressIndicator(Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_DefaultSLASetttingInProgress));
                }
                Xrm.WebApi.updateRecord(Sla.EntityNames.SLA, SLAId, {
                    "isdefault": true
                }).then(function (response) {
                    Xrm.Utility.closeProgressIndicator();
                    controlToRefresh && (controlToRefresh.refresh());
                }, function (error) {
                    Xrm.Utility.closeProgressIndicator();
                    controlToRefresh && (controlToRefresh.refresh());
                    Xrm.Navigation.openAlertDialog({
                        text: Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_DefaultSLASetttingInProgress)
                    });
                });
            };
            Sla.Telemetry.setContext(Sla.TelemetryConstants.UCContext, Sla.TelemetryConstants.UCPrefix);
            return _this;
        }
        //---- checking whether FCS is enabled or not
        SlaMainSystemLibraryUCWebResource.prototype.getFeatureControlSetting = function (nameSpace, settingKey, defaultValue) {
            var value = window.Xrm.Utility.getGlobalContext().getFeatureControlSetting(nameSpace, settingKey);
            if (value !== undefined && value !== null) {
                // Found the feature
                return value;
            }
            return defaultValue;
        };
        ;
        SlaMainSystemLibraryUCWebResource.showRecommendationMessage = function () {
            try {
                if (Xrm.Page.ui.getFormType() == 1) {
                    var entityControl = Xrm.Page.getControl('primaryentityotc');
                    entityControl.addNotification({
                        messages: [Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLAKPI_RECOMMENDATION_PRIMARY_ENTITY)],
                        notificationLevel: 'RECOMMENDATION',
                        uniqueId: 'sla_activeslarecommendation',
                        actions: null
                    });
                }
            }
            catch (exception) {
                console.log("Error in adding recommendation message for Primary Entity field.");
            }
        };
        // ----- migration tab related handling start ------
        SlaMainSystemLibraryUCWebResource.prototype.handleMigrationTabOnChange = function () {
            try {
                // check if migration tab exists, else return
                var tabUCMigration = Xrm.Page.ui.tabs.getByName(this._migrationTabName);
                if (tabUCMigration == null) {
                    return;
                }
                var entityAttributeValue = Xrm.Page.getAttribute(this._boundEntity);
                if (entityAttributeValue != null && entityAttributeValue.getValue != null) {
                    console.log("SLAMainLibraryUC:handleMigrationTabOnChange::entityAttributeValue.getValue():" + entityAttributeValue.getValue());
                    var migrationStatusDetailsControl = Xrm.Page.getControl(this._migrationDetailsControlName);
                    // show or hide details pane based on selection
                    if (entityAttributeValue.getValue() == this._toggleValueForOne) {
                        if (migrationStatusDetailsControl != null) {
                            migrationStatusDetailsControl.setVisible(false);
                        }
                        this._trackerEntity.msdyn_migrationstatus = this._incompleteStatus;
                    }
                    else if (entityAttributeValue.getValue() == this._toggleValueForZero) {
                        if (migrationStatusDetailsControl != null) {
                            migrationStatusDetailsControl.setVisible(true);
                        }
                        this._trackerEntity.msdyn_migrationstatus = this._migratedStatus;
                    }
                    else {
                        return;
                    }
                }
            }
            catch (exception) {
                console.log("SLAMainLibraryUC::handleMigrationTabOnSave:exception:" + exception);
            }
        };
        // handle migration control onsave.
        SlaMainSystemLibraryUCWebResource.prototype.handleMigrationTabOnSave = function () {
            try {
                // check if migration tab exists, else return
                var tabUCMigration = Xrm.Page.ui.tabs.getByName("tabUCMigration");
                if (tabUCMigration == null) {
                    return;
                }
                var entityAttributeValue = Xrm.Page.getAttribute(this._boundEntity);
                if (entityAttributeValue != null && entityAttributeValue != undefined && entityAttributeValue.getValue != null) {
                    var newValueOfToggle = -1;
                    console.log("SLAMainLibraryUC:handleMigrationTabOnSave::entityAttributeValue.getValue():" + entityAttributeValue.getValue());
                    if (entityAttributeValue.getValue() == this._toggleValueForOne) {
                        newValueOfToggle = this._migratedStatus;
                    }
                    else if (entityAttributeValue.getValue() == this._toggleValueForZero) {
                        newValueOfToggle = this._incompleteStatus;
                    }
                    else {
                        return;
                    }
                    console.log("SLAMainLibraryUC:handleMigrationTabOnSave::newValueOfToggle:" + newValueOfToggle);
                    var recordId = Xrm.Page.data.entity.getId();
                    // return if record id or tracker is invalid
                    // could be new SLA creation case or manually created UCI SLA
                    if (recordId == "" || recordId == undefined || recordId == null || this._trackerEntity == null || this._trackerEntity == undefined) {
                        return;
                    }
                    var trackerId = this._trackerEntity.msdyn_migrationtrackerid;
                    var oldValueOfToggle = this._trackerEntity.msdyn_migrationstatus;
                    console.log("SLAMainLibraryUC::handleMigrationTabOnSave::oldValueOfToggle:" + oldValueOfToggle);
                    if (oldValueOfToggle == newValueOfToggle) {
                        console.log("SLAMainLibraryUC::handleMigrationTabOnSave::skip update:");
                        return;
                    }
                    Xrm.WebApi.updateRecord("msdyn_migrationtracker", trackerId, {
                        "msdyn_migrationstatus": newValueOfToggle
                    }).then(function (response) {
                        console.log("SLAMainLibraryUC::handleMigrationTabOnSave:" + "Updated");
                    }, function (error) {
                        console.log("SLAMainLibraryUC::handleMigrationTabOnSave:error:" + error);
                    });
                }
            }
            catch (exception) {
                console.log("SLAMainLibraryUC::handleMigrationTabOnSave:exception:" + exception);
            }
        };
        SlaMainSystemLibraryUCWebResource.prototype.showSLAWebClientDeprecationNotification = function () {
            try {
                var thisPtr_8 = this;
                Xrm.WebApi.retrieveMultipleRecords("sla", "?fetchXml=" + SlaMainSystemLibraryUCWebResource.FETCHXML_ANY_ACTIVE_LEGACY_SLA).then(function success(result) {
                    if (result.entities.length > 0) {
                        Sla.Telemetry.logInfo(Sla.CommonSource.SLAWebClientDeprecationNotification, {
                            "Feature": "SelfFix",
                            "Log": "Showing legacy SLA deprecation notification in UCI form"
                        });
                        var notificationMessage = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_WebClientDeprecationNotification);
                        notificationMessage = notificationMessage.replace("{0}", ClientUtility.DataManager.getMSDocsRedirectBaseURL() + "/fwlink/p/?linkid=2198689");
                        Xrm.Page.ui.setFormNotification(notificationMessage, "WARNING", Sla.CommonSource.SLAWebClientDeprecationNotification);
                        thisPtr_8.openSLAWebClientDeprecationAckDialog();
                    }
                }, function error(error) {
                    thisPtr_8.logError(error, Sla.CommonSource.SLAWebClientDeprecationNotification);
                });
            }
            catch (exception) {
                Sla.Telemetry.logError(Sla.CommonSource.SLAWebClientDeprecationNotification, Sla.TelemetryErrors.SLAFailToShowNotificationError, {
                    "Feature": "SelfFix",
                    "Log": "SlaMainSystemLibraryUCWebResource::Error in showSLAWebClientDeprecationNotification",
                    "Error": exception
                });
            }
        };
        SlaMainSystemLibraryUCWebResource.prototype.openSLAWebClientDeprecationAckDialog = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isUserHasSystemAdminRole, envVariableValue, navigationOptions, pageInput, exception_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, Sla.SLAWebClientDeprecationAckDialog.isUserHasSystemAdminRole()];
                        case 1:
                            isUserHasSystemAdminRole = _a.sent();
                            if (!isUserHasSystemAdminRole) return [3 /*break*/, 3];
                            return [4 /*yield*/, Sla.SLAWebClientDeprecationAckDialog.getEnvironmentVariableValue(Sla.Constants.SLA_EnvironmentVariableSchemaName)];
                        case 2:
                            envVariableValue = _a.sent();
                            if (envVariableValue != Sla.WebClientDeprecationState.Acknowledged) {
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
                                if (envVariableValue != Sla.WebClientDeprecationState.Canceled && envVariableValue != Sla.WebClientDeprecationState.YetToAcknowledge) {
                                    Sla.SLAWebClientDeprecationAckDialog.setEnvironmentVariableValue(Sla.Constants.SLA_EnvironmentVariableSchemaName, Sla.Constants.SLA_EnvironmentVariableDisplayName, Sla.WebClientDeprecationState.YetToAcknowledge.toString());
                                }
                                Xrm.Navigation.navigateTo(pageInput, navigationOptions);
                            }
                            _a.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            exception_3 = _a.sent();
                            Sla.Telemetry.logError(Sla.CommonSource.SLAWebClientDeprecationNotification, Sla.TelemetryErrors.SLAFailToShowNotificationError, {
                                "Feature": "Alert",
                                "Log": "SlaMainSystemLibraryUCWebResource::openSLAWebClientDeprecationAckDialog:Error in opening SLA web client deprecation acknowledge dialog",
                                "Error": exception_3
                            });
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        return SlaMainSystemLibraryUCWebResource;
    }(Sla.SlaMainSystemLibraryBase));
    // dependencies for Modern SLA
    SlaMainSystemLibraryUCWebResource.MANAGE_SLA_INSTANCES_WORKFLOW_ID = "dbd9a27c-e3f0-421a-8a4b-92b0abd0749c";
    SlaMainSystemLibraryUCWebResource.MODERN_SLA_STATIC_WORKFLOW_ID = "ee2079d2-a93f-48b5-887a-c54ad830cbe5";
    SlaMainSystemLibraryUCWebResource.MODERN_SLA_CREATE_ACTION_WORKFLOW_ID = "d48ed7a9-4ede-4d21-b745-e1ef728c7a77";
    // require SDK steps.
    SlaMainSystemLibraryUCWebResource.MANAGE_SLA_INSTANCES_SDK_MESSAGE_ID = "494f72d3-fbfa-e911-a81e-000d3a6ed79d";
    SlaMainSystemLibraryUCWebResource.SLA_KPI_INSTANCE_PRE_CREATE_SDK_MESSAGE_ID = "1ee06cce-7636-ea11-a81c-000d3afe04a9";
    SlaMainSystemLibraryUCWebResource.SLA_KPI_INSTANCE_POST_CREATE_SDK_MESSAGE_ID = "0fe2b0c1-31dd-42a2-b433-a5811fb96477";
    SlaMainSystemLibraryUCWebResource.SLA_KPI_INSTANCE_POST_UPDATE_SDK_MESSAGE_ID = "9357d080-24f7-e911-a81e-000d3af997bc";
    SlaMainSystemLibraryUCWebResource.SLA_PRE_OPERATION_UPDATE_SDK_MESSAGE_ID = "2a84f2f6-1e10-ea11-a81c-000d3ac3fbe3";
    SlaMainSystemLibraryUCWebResource.SLA_CREATE_ACTION_FLOW_SDK_MESSAGE_ID = "b535159b-205a-4566-aa21-b0cf12c22abf";
    // fetchXML for retrieve above mentioned 6 SDK steps
    // Note: Update top value if u add a new value in same fetchXML
    SlaMainSystemLibraryUCWebResource.FETCHXML_SDK_MESSAGE_STEP_MODERN_SLA = "<fetch version='1.0' output-format='xml-platform' top='6' mapping='logical' distinct='true'>\n              <entity name='sdkmessageprocessingstep' >\n              <attribute name='sdkmessageprocessingstepid' />\n              <attribute name='statecode' />\n              <attribute name='statuscode' />\n                <filter type='and' >\n                  <condition attribute=\"sdkmessageprocessingstepid\" operator=\"in\">\n                    <value>{" + SlaMainSystemLibraryUCWebResource.MANAGE_SLA_INSTANCES_SDK_MESSAGE_ID + "}</value>\n                    <value>{" + SlaMainSystemLibraryUCWebResource.SLA_KPI_INSTANCE_PRE_CREATE_SDK_MESSAGE_ID + "}</value>\n                    <value>{" + SlaMainSystemLibraryUCWebResource.SLA_KPI_INSTANCE_POST_CREATE_SDK_MESSAGE_ID + "}</value>\n                    <value>{" + SlaMainSystemLibraryUCWebResource.SLA_KPI_INSTANCE_POST_UPDATE_SDK_MESSAGE_ID + "}</value>\n                    <value>{" + SlaMainSystemLibraryUCWebResource.SLA_PRE_OPERATION_UPDATE_SDK_MESSAGE_ID + "}</value>\n                    <value>{" + SlaMainSystemLibraryUCWebResource.SLA_CREATE_ACTION_FLOW_SDK_MESSAGE_ID + "}</value>\n                  </condition>\n                </filter>\n              </entity>\n          </fetch>";
    // fetchXML for retrieve above mentioned 2 wf (custom actions)
    // Note: Update top value if u add a new value in same fetchXML
    SlaMainSystemLibraryUCWebResource.FETCHXML_WORKFLOW_MODERN_SLA = "<fetch version='1.0' output-format='xml-platform' top='2' mapping='logical' distinct='false'>\n              <entity name='workflow' >\n                <attribute name='workflowid' />\n                <attribute name='statecode' />\n                <attribute name='statuscode' />\n                <order attribute='name' descending = 'false' />\n                <filter type='and' >\n                  <condition attribute=\"workflowid\" operator=\"in\">\n                    <value>{" + SlaMainSystemLibraryUCWebResource.MANAGE_SLA_INSTANCES_WORKFLOW_ID + "}</value>\n                    <value>{" + SlaMainSystemLibraryUCWebResource.MODERN_SLA_CREATE_ACTION_WORKFLOW_ID + "}</value>\n                  </condition>\n                </filter>\n              </entity>\n          </fetch>";
    // fetchXML for retrieve SLA Modern Static flow for KPI Instance Monitoring
    // Note: Update top value if u add a new value in same fetchXML        
    SlaMainSystemLibraryUCWebResource.FETCHXML_STATIC_WORKFLOW_MODERN_SLA = "<fetch version='1.0' output-format='xml-platform' top='1' mapping='logical' distinct='false'>\n              <entity name='workflow' >\n                <attribute name='workflowid' />\n                <attribute name='statecode' />\n                <attribute name='statuscode' />\n                <order attribute='name' descending = 'false' />\n                <filter type='and' >\n                  <condition attribute=\"workflowid\" operator=\"in\">\n                    <value>{" + SlaMainSystemLibraryUCWebResource.MODERN_SLA_STATIC_WORKFLOW_ID + "}</value>\n                  </condition>\n                </filter>\n              </entity>\n          </fetch>";
    // fetchXML for retrieve SLA workflow associated with SLA or SLA items
    SlaMainSystemLibraryUCWebResource.FETCHXML_SLA_WORKFLOWS = "<fetch version='1.0' output-format='xml-platform' top='{0}' mapping='logical' distinct='false'>\n                  <entity name='workflow'>\n                    <attribute name='workflowid'/>\n                    <attribute name='statecode'/>\n                    <attribute name='statuscode'/>\n                    <attribute name='ownerid'/>\n                    <attribute name=\"type\"/>\n                    <filter type='and'>\n                     <condition attribute=\"workflowid\" operator=\"in\">\n                        {1}\n                      </condition>\n                    </filter>\n                  </entity>\n                </fetch>";
    // fetchXML for retrieve SLA workflow instances owned by disbaled user
    SlaMainSystemLibraryUCWebResource.FETCHXML_SLA_WORKFLOW_OWNED_BY_DISABLED_USER = "<fetch version='1.0' output-format='xml-platform' top='{0}' mapping='logical' distinct='false'>\n                  <entity name='workflow'>\n                    <attribute name='workflowid'/>\n                    <attribute name='statecode'/>\n                    <attribute name='statuscode'/>\n                    <attribute name='ownerid'/>\n                    <attribute name=\"type\"/>\n                    <filter type='and'>\n                     <condition attribute=\"workflowid\" operator=\"in\">\n                        {1}\n                      </condition>\n                    </filter>\n                    <link-entity name='systemuser' from='systemuserid' to='owninguser' link-type='inner' alias='am'>\n                      <attribute name='fullname'/>\n                      <filter type='and'>\n                        <condition attribute='isdisabled' operator='eq' value='1'/>\n                      </filter>\n                    </link-entity>\n                  </entity>\n                </fetch>";
    // fetchXML for retrieve all SLA items associated with SLA 
    SlaMainSystemLibraryUCWebResource.FETCHXML_SLA_ITEMS = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>\n                  <entity name='slaitem'>\n                    <attribute name='name'/>\n                    <attribute name='slaitemid'/>\n                    <attribute name='workflowid'/>\n                    <attribute name='msdyn_customtimecalculation'/>\n                    <attribute name='msdyn_customtimecalculationworkflowid'/>\n                    <attribute name='changedattributelist'/>\n                    <attribute name='applicablewhenxml'/>\n                    <attribute name='successconditionsxml'/>\n                    <attribute name='msdyn_pauseconfigurationxml'/>\n                    <attribute name='businesshoursid'/>\n                    <filter type='or'>\n                      <condition attribute='slaid' operator='eq' uitype='sla' value='{0}' entityname='ad'/>\n                    </filter>\n                    <link-entity name='sla' from='slaid' to='slaid' link-type='outer' alias='ad'/>\n                  </entity>\n                </fetch>";
    // fetchXML for retrieve default SLA
    SlaMainSystemLibraryUCWebResource.FETCHXML_DEFAULT_SLA = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>\n                <entity name='sla'>\n                    <attribute name='objecttypecode' />\n                    <attribute name='isdefault' />\n                    <filter type='and'>\n                        <condition attribute='isdefault' operator='eq' value='1'/>\n                        <condition attribute='objecttypecode' operator='eq' value='{0}'/>\n                    </filter>\n                </entity>\n            </fetch>";
    // fetchXML for retrieve any active legacy SLAs
    SlaMainSystemLibraryUCWebResource.FETCHXML_ANY_ACTIVE_LEGACY_SLA = "<fetch version=\"1.0\" output-format=\"xml-platform\" top=\"1\" mapping=\"logical\" distinct=\"false\">\n                <entity name=\"sla\">\n                    <attribute name=\"name\" />\n                    <attribute name=\"slaid\" />\n                    <filter type=\"and\">\n                        <condition attribute=\"statecode\" operator=\"eq\" value=\"1\"/>\n                    </filter>\n                    <filter type=\"or\">\n                        <condition attribute=\"slaversion\" operator=\"null\"/>\n                        <condition attribute=\"slaversion\" operator=\"eq\" value=\"100000000\"/>\n                    </filter>\n                </entity>\n            </fetch>";
    // fetchXML to retrieve calendar rules for SLA Items 
    SlaMainSystemLibraryUCWebResource.FETCHXML_CALENDAR_RULES = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>\n            <entity name='calendar'>\n                <filter>\n                    <condition attribute='calendarid' operator='eq' value='{0}'/>\n                </filter>\n                <link-entity name='calendarrule' from='calendarid' to='calendarid' alias='cr'>\n                    <attribute name='calendarid' />\n                </link-entity>\n            </entity>\n        </fetch>";
    Sla.SlaMainSystemLibraryUCWebResource = SlaMainSystemLibraryUCWebResource;
    var RetrieveEntityDefinitions = (function () {
        /**
         * constructor for RetrieveEntityDefinitions
         * @param filter filter for the entity definition e.g.$filter=ObjectTypeCode eq 3
         * @param columns list of columns to be retrieved
         */
        function RetrieveEntityDefinitions(filter, columns) {
            this.filter = filter;
            this.columns = columns;
        }
        RetrieveEntityDefinitions.prototype.getMetadata = function () {
            return {
                boundParameter: undefined,
                parameterTypes: {},
                operationName: "EntityDefinitions",
                operationType: 2 /* CRUD */,
            };
        };
        return RetrieveEntityDefinitions;
    }());
})(Sla || (Sla = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sla;
(function (Sla) {
    /**
    * Dialog for SLA entity creation
    */
    var CreateSlaDialog = (function () {
        function CreateSlaDialog() {
            /**
            * Callback for loading the dialog
            */
            this.onLoadCreateSla = function () {
                if (Xrm.Page.context.client.getClientState() !== Xrm.Constants.ClientStates.online) {
                    Mscrm.InternalUtilities.DialogUtility.showMoCAOfflineError();
                    Xrm.Page.ui.close();
                    return;
                }
                for (var applicableEntityControl = Xrm.Page.getControl(CreateSlaDialog._applicableEntityId), ControlOptions = applicableEntityControl.getAttribute(), Controlitems = ControlOptions.getOptions(), idx = 0; idx < Controlitems.length; ++idx) {
                    var option = Controlitems[idx];
                    applicableEntityControl.removeOption(option.value);
                }
                var AttributOptionSet = Xrm.Page.data.entity.attributes.get(CreateSlaDialog._applicableEntityId);
                var AttributOptions = AttributOptionSet.getOptions();
                AttributOptions.sort(function (o1, o2) {
                    return o1.text.localeCompare(o2.text);
                });
                for (var idx = 0; idx < AttributOptions.length; ++idx) {
                    option = AttributOptions[idx];
                    applicableEntityControl.addOption(option);
                }
                Sys.Debug.assert(!ClientUtility.DataUtil.isNullOrUndefined(applicableEntityControl), "ApplicableEntity_id control cannot be null");
                applicableEntityControl.setVisible(true);
            };
            /**
            * Callback clicking the create button
            */
            this.createSlaClick = function () {
                if (Xrm.Page.context.client.getClientState() !== Xrm.Constants.ClientStates.online) {
                    Mscrm.InternalUtilities.DialogUtility.showMoCAOfflineError();
                    return;
                }
                var applicableentityPickListControl = Xrm.Page.data.entity.attributes.get(CreateSlaDialog._applicableEntityId);
                if (!ClientUtility.DataUtil.isNullOrUndefined(applicableentityPickListControl)) {
                    var entityValue = applicableentityPickListControl.getValue();
                    !ClientUtility.DataUtil.isNullOrUndefined(entityValue) &&
                        Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Mscrm.InternalUtilities.MetadataDrivenDialogConstants.SLASelectedEnity, entityValue);
                }
                var nameControl = Xrm.Page.data.entity.attributes.get(CreateSlaDialog._nameId);
                if (!ClientUtility.DataUtil.isNullOrUndefined(nameControl)) {
                    var name = nameControl.getValue();
                    !ClientUtility.DataUtil.isNullOrUndefined(name) &&
                        Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Mscrm.InternalUtilities.MetadataDrivenDialogConstants.slaName, name);
                }
                Mscrm.InternalUtilities.DialogUtility.setLastButtonClicked(Mscrm.InternalUtilities.MetadataDrivenDialogConstants.DialogOkId);
                Xrm.Page.ui.close();
            };
            /**
            * Callback for changing the associated entity drop down control
            */
            this.onChangeSlaEntity = function () {
                if (Xrm.Page.context.client.getClientState() !== Xrm.Constants.ClientStates.online) {
                    Mscrm.InternalUtilities.DialogUtility.showMoCAOfflineError();
                    return;
                }
            };
        }
        return CreateSlaDialog;
    }());
    CreateSlaDialog._applicableEntityId = "applicableEntity_id";
    CreateSlaDialog._nameId = "name_id";
    Sla.CreateSlaDialog = CreateSlaDialog;
})(Sla || (Sla = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="SLAMainSystemLibraryBase.ts" />
var Sla;
(function (Sla) {
    /**
    * Ribbon command actions for homegrid
    */
    var SlaGridCommandActions = (function () {
        function SlaGridCommandActions(slaMainSystemLibraryBaseInstance) {
            var _this = this;
            this.setAsDefault = function (gridControl, records, entityTypeCode) {
                if (records.length === 1) {
                    var slaId = records[0].Id.toString();
                    var entityName = records[0].TypeCode.toString();
                    var columnNames = ["statecode", "objecttypecode"];
                    _this._slaMainSystemLibraryBaseInstance.updateIfSlaActive(slaId, entityName, columnNames, false, gridControl, records, entityTypeCode);
                }
            };
            this._slaMainSystemLibraryBaseInstance = slaMainSystemLibraryBaseInstance;
        }
        return SlaGridCommandActions;
    }());
    Sla.SlaGridCommandActions = SlaGridCommandActions;
})(Sla || (Sla = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sla;
(function (Sla) {
    /**
    * Dialog for Replacing SLA Create Dialog with deprecation Dialog
    */
    var DisableLegacyCreateSlaDialog = (function () {
        function DisableLegacyCreateSlaDialog() {
        }
        /**
        * Callback for loading the dialog
        */
        DisableLegacyCreateSlaDialog.prototype.onLoadDepreciationDialog = function () {
            var depreciationDescriptionControl = Xrm.Page.getControl(DisableLegacyCreateSlaDialog._depreciation);
            var confirmationDescriptionControl = Xrm.Page.getControl(DisableLegacyCreateSlaDialog._confirmation);
            var depreciationNotificationMessage = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_DisableLegacyCreateSLADialogDepreciationText);
            depreciationNotificationMessage = depreciationNotificationMessage.replace("{0}", "https://learn.microsoft.com/dynamics365/customer-service/deprecations-customer-service#slas-in-web-client-are-deprecated.");
            var confirmationNotificationMessage = Sla.ResourceStringProvider.getResourceString(Sla.Constants.SLA_DisableLegacyCreateSLADialogConfirmationText);
            depreciationDescriptionControl.setLabel(depreciationNotificationMessage);
            confirmationDescriptionControl.setLabel(confirmationNotificationMessage);
        };
        DisableLegacyCreateSlaDialog.prototype.onConfirmClick = function () {
            var globalContext = Xrm.Utility.getGlobalContext();
            var orgUrl = globalContext.getCurrentAppUrl();
            var url = null;
            Xrm.WebApi.retrieveMultipleRecords("appmodules", "?$select=appmoduleid&$filter=uniquename eq 'msdyn_CSAdminCenter'").then(function success(result) {
                if (result && result.entities && result.entities.length > 0) {
                    var appid = result.entities[0].appmoduleid;
                    url = orgUrl + "/main.aspx?appid=" + appid + "&pagetype=entityrecord&etn=sla";
                    var win = window.open(url);
                    win.focus();
                    Xrm.Page.ui.close();
                }
            });
        };
        ;
        return DisableLegacyCreateSlaDialog;
    }());
    DisableLegacyCreateSlaDialog._depreciation = "depreciation_id";
    DisableLegacyCreateSlaDialog._confirmation = "confirmation_id";
    Sla.DisableLegacyCreateSlaDialog = DisableLegacyCreateSlaDialog;
})(Sla || (Sla = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../../ClientUtility/Client/Common/ActionFailedHandler.ts" />
/// <reference path="SLAMainSystemLibraryBase.ts" />
/// <reference path="DisableLegacyCreateSlaDialog.ts" />
var Sla;
(function (Sla) {
    /**
    * Ribbon command actions for entity main form
    */
    var SlaCommandBarActions = (function () {
        function SlaCommandBarActions(slaMainSystemLibraryWebResourceInstance) {
            var _this = this;
            this._isRibbonRefresh = false;
            this._isDefault = false;
            this._createSlaDialogName = "CreateSlaDialog";
            /**
            * Open CreateSlaDialog to create a new record
            */
            this.newRecord = function () { return __awaiter(_this, void 0, void 0, function () {
                var slaUrl, exception_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 6, , 7]);
                            if (Xrm.Internal.isUci()) {
                                Xrm.Utility.openEntityForm(Sla.EntityNames.SLA, null, null);
                                return [2 /*return*/];
                            }
                            if (!Xrm.Internal.isFeatureEnabled(this._slaMainSystemLibraryBaseInstance.enhancedSlaFcb)) return [3 /*break*/, 4];
                            if (!Xrm.Internal.isFeatureEnabled("FCB.DisableLegacySLACreateDialog")) return [3 /*break*/, 2];
                            return [4 /*yield*/, this._retrieveUciSlaUrl()];
                        case 1:
                            slaUrl = _a.sent();
                            if (slaUrl != null && slaUrl != undefined) {
                                this._openLegacyDepreciationDialog();
                            }
                            else {
                                this._openCreateSLADialog();
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            this._openCreateSLADialog();
                            _a.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            Xrm.Utility.openEntityForm(Sla.EntityNames.SLA, null, null);
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            exception_4 = _a.sent();
                            console.log("Exception in creating a new Record" + exception_4);
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            }); };
            /**
            * Determines if an SLA record is default. Used by Ribbon rules
            */
            this.isSlaDefault = function (slaId) {
                var isDefaultAttribute = Xrm.Page.data.entity.attributes.get("isdefault");
                if (!ClientUtility.DataUtil.isNullOrUndefined(isDefaultAttribute)) {
                    _this._isDefault = isDefaultAttribute.getValue();
                }
                else {
                    //Xrm.Internal.messages.retrieve(EntityNames.SLA, slaId, ["isdefault"]).then((retrieveSLAResponse: any) => {
                    Xrm.WebApi.retrieveRecord(Sla.EntityNames.SLA, slaId, "?$select=isdefault").then(function (slarecord) {
                        if (slarecord.isdefault === 1)
                            _this._isDefault = true;
                        else
                            _this._isDefault = false;
                        if (!_this._isRibbonRefresh) {
                            Xrm.Page.ui.refreshRibbon();
                            _this._isRibbonRefresh = true;
                        }
                        else
                            _this._isRibbonRefresh = false;
                    }, ClientUtility.ActionFailedHandler.actionFailedCallback);
                }
                return _this._isDefault;
            };
            /**
            * Set an SLA record to default
            */
            this.setDefaultSla = function (entityId, entityName) {
                var columnNames = ["statecode", "objecttypecode"];
                _this._slaMainSystemLibraryBaseInstance.updateIfSlaActive(entityId, entityName, columnNames, true, undefined, undefined, undefined);
            };
            this._openCreateSLADialog = function () {
                var options = null;
                if (Mscrm.CommandBarActions.isWebClient()) {
                    options = new Xrm.DialogOptions;
                    options.height = Mscrm.InternalUtilities.DialogConfirmStrings.DeactivateGridDialogHeight;
                    options.width = Mscrm.InternalUtilities.DialogConfirmStrings.DeactivateGridDialogWidth;
                }
                Xrm.Dialog.openDialog(_this._createSlaDialogName, options, _this._setDialogArguments(), _this._closeCreateSlaDialogCallback, null);
            };
            this._closeCreateSlaDialogCallback = function (dialogParams, callbackParams) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(dialogParams) && dialogParams[Mscrm.InternalUtilities.MetadataDrivenDialogConstants.LastButtonClicked] === Mscrm.InternalUtilities.MetadataDrivenDialogConstants.DialogOkId) {
                    var slaformarguments = {};
                    slaformarguments["name"] = dialogParams[Mscrm.InternalUtilities.MetadataDrivenDialogConstants.slaName];
                    slaformarguments["objecttypecode"] = dialogParams[Mscrm.InternalUtilities.MetadataDrivenDialogConstants.SLASelectedEnity];
                    slaformarguments["primaryentityotc"] = dialogParams[Mscrm.InternalUtilities.MetadataDrivenDialogConstants.SLASelectedEnity];
                    Xrm.Utility.openEntityForm(Sla.EntityNames.SLA, null, slaformarguments);
                }
            };
            this._setDialogArguments = function () {
                var dialogArguments = {};
                dialogArguments[Mscrm.InternalUtilities.MetadataDrivenDialogConstants.LastButtonClicked] = Mscrm.InternalUtilities.MetadataDrivenDialogConstants.DialogOkId;
                return dialogArguments;
            };
            this._openLegacyDepreciationDialog = function () {
                var dailogOptions = new Xrm.DialogOptions;
                dailogOptions.height = 280;
                dailogOptions.width = 550;
                Xrm.Dialog.openDialog("DisableLegacyCreateSlaDialog", dailogOptions, null, null, null);
            };
            this._retrieveUciSlaUrl = function () { return __awaiter(_this, void 0, void 0, function () {
                var globalContext, orgUrl_1, url_1, exception_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            globalContext = Xrm.Utility.getGlobalContext();
                            orgUrl_1 = globalContext.getCurrentAppUrl();
                            url_1 = null;
                            return [4 /*yield*/, Xrm.WebApi.retrieveMultipleRecords("appmodules", "?$select=appmoduleid&$filter=uniquename eq 'msdyn_CSAdminCenter'").then(function success(result) {
                                    if (result && result.entities && result.entities.length > 0) {
                                        var appid = result.entities[0].appmoduleid;
                                        url_1 = orgUrl_1 + "/main.aspx?appid=" + appid + "&pagetype=entityrecord&etn=sla";
                                    }
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, url_1];
                        case 2:
                            exception_5 = _a.sent();
                            console.log("Exception in retrieving the UCI SLA Entity page." + exception_5);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); };
            this._slaMainSystemLibraryBaseInstance = slaMainSystemLibraryWebResourceInstance;
        }
        return SlaCommandBarActions;
    }());
    Sla.SlaCommandBarActions = SlaCommandBarActions;
})(Sla || (Sla = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sla;
(function (Sla) {
    /**
     * Ribbon command actions for SLA item subgrid
     */
    var SlaSubGridCommandActions = (function () {
        function SlaSubGridCommandActions() {
            this.isTopRowNotSelected = function (gridControl) {
                var allRows = gridControl.getGrid().getRows();
                var selectedRows = gridControl.getGrid().getSelectedRows();
                if (selectedRows.getLength() === 0)
                    return;
                var data = selectedRows.getByIndex(0).getData();
                if (data === null)
                    return;
                var entity = data.getEntity();
                if (entity === null)
                    return;
                var selId = entity._entityId.guid;
                for (var index = 0; index < allRows.getLength(); index++) {
                    var row = allRows.getByIndex(index);
                    if (row !== null) {
                        var rowEntity = row.getData().getEntity();
                        if (rowEntity !== null) {
                            var currentRowId = rowEntity._entityId.guid;
                            if (currentRowId === selId) {
                                return (index !== 0);
                            }
                        }
                    }
                }
            };
            this.isBottomRowNotSelected = function (gridControl) {
                var allRows = gridControl.getGrid().getRows();
                var selectedRows = gridControl.getGrid().getSelectedRows();
                if (selectedRows.getLength() === 0)
                    return;
                var data = selectedRows.getByIndex(0).getData();
                if (data === null)
                    return;
                var entity = data.getEntity();
                if (entity === null)
                    return;
                var selId = entity._entityId.guid;
                for (var index = 0; index < allRows.getLength(); index++) {
                    var row = allRows.getByIndex(index);
                    if (row !== null) {
                        var rowEntity = row.getData().getEntity();
                        if (rowEntity !== null) {
                            var currentRowId = rowEntity._entityId.guid;
                            if (currentRowId === selId) {
                                return (index !== allRows.getLength() - 1);
                            }
                        }
                    }
                }
            };
            this.MoveRecordUp = function (gridEntityName, gridControl, selRecords) {
                var _this = this;
                var startIndex = gridControl.getFetchXml().indexOf("order attribute");
                var endIndex = gridControl.getFetchXml().indexOf("descending");
                var subString = gridControl.getFetchXml().substring(startIndex, endIndex);
                if (subString.indexOf("sequencenumber") === -1) {
                    Xrm.Navigation.openAlertDialog({
                        text: "Unable to move record as grid is in sort mode. Refresh the grid and try again" //todo: replace actual string
                    });
                }
                else {
                    var selRows_1 = [];
                    var prevRows_1 = [];
                    var allRows = gridControl.getGrid().getRows();
                    var selectedRows = gridControl.getGrid().getSelectedRows();
                    if (selectedRows.getLength() === 0)
                        return;
                    var rowData = selectedRows.getByIndex(0);
                    if (rowData === null)
                        return;
                    var entity = rowData.getData().getEntity();
                    if (entity === null)
                        return;
                    var selSequenceNumber_1 = entity.attributes.getByName("sequencenumber").getValue();
                    var selectedIndex = -1;
                    for (var index = 0; index < allRows.getLength(); index++) {
                        var currentRowId = allRows.getByIndex(index).getData().getEntity()._entityId.guid;
                        if (currentRowId === selRecords[0].Id) {
                            selectedIndex = index;
                            break;
                        }
                    }
                    var prevRow = allRows.getByIndex(selectedIndex - 1);
                    var prevSequenceNumber_1 = prevRow.getData().getEntity().attributes.getByName("sequencenumber").getValue();
                    // Iterates through the all grid items and saves the selected grid items sequence number and 
                    // the previous grid items sequence number, since we clicked on move up option.
                    allRows.forEach(function (row, i) {
                        var rowEntity = row.getData().getEntity();
                        if (rowEntity !== null) {
                            var currentRowId = rowEntity._entityId.guid;
                            var currentRowSeqNumber = rowEntity.attributes.getByName("sequencenumber").getValue();
                            if (currentRowSeqNumber == selSequenceNumber_1) {
                                selRows_1.push(currentRowId);
                            }
                            else if (currentRowSeqNumber === prevSequenceNumber_1) {
                                prevRows_1.push(currentRowId);
                            }
                        }
                    });
                    // Using the selected grid item and the previous grid item if it exists, this performs the sequence number update
                    // calls by the swapping the sequence number for each of the grid items.
                    if (selRows_1.length > 0 && prevRows_1.length > 0) {
                        var self_1 = this;
                        selRows_1.forEach(function (recId) {
                            Xrm.WebApi.online.updateRecord(gridEntityName, recId, { sequencenumber: prevSequenceNumber_1 }).then(function () {
                                var _this = this;
                                prevRows_1.forEach(function (recId) {
                                    Xrm.WebApi.online.updateRecord(gridEntityName, recId, { sequencenumber: selSequenceNumber_1 }).then(function () {
                                        gridControl.refresh();
                                    }, _this.SequenceNumberUpdateFailed);
                                });
                            }, _this.SequenceNumberUpdateFailed);
                        });
                    }
                }
            };
            this.SequenceNumberUpdateFailed = function (error) {
                Xrm.Navigation.openErrorDialog({
                    message: "Sequence number update of the item failed. Please try again later."
                });
            };
            this.MoveRecordDown = function (gridEntityName, gridControl, selRecords) {
                var _this = this;
                var startIndex = gridControl.getFetchXml().indexOf("order attribute");
                var endIndex = gridControl.getFetchXml().indexOf("descending");
                var subString = gridControl.getFetchXml().substring(startIndex, endIndex);
                if (subString.indexOf("sequencenumber") == -1) {
                    Xrm.Navigation.openAlertDialog({
                        text: "Unable to move record as grid is in sort mode. Refresh the grid and try again" //todo: replace actual string
                    });
                }
                else {
                    var selRows_2 = [];
                    var nextRows_1 = [];
                    var allRows = gridControl.getGrid().getRows();
                    var selectedRows = gridControl.getGrid().getSelectedRows();
                    if (selectedRows.getLength() === 0)
                        return;
                    var rowData = selectedRows.getByIndex(0);
                    if (rowData === null)
                        return;
                    var entity = rowData.getData().getEntity();
                    if (entity === null)
                        return;
                    var selSequenceNumber_2 = entity.attributes.getByName("sequencenumber").getValue();
                    var selectedIndex = -1;
                    for (var index = 0; index < allRows.getLength(); index++) {
                        var currentRowId = allRows.getByIndex(index).getData().getEntity()._entityId.guid;
                        if (currentRowId === selRecords[0].Id) {
                            selectedIndex = index;
                            break;
                        }
                    }
                    var nextRow = allRows.getByIndex(selectedIndex + 1);
                    var nextSequenceNumber_1 = nextRow.getData().getEntity().attributes.getByName("sequencenumber").getValue();
                    // Iterates through the all grid items and saves the selected grid items sequence number and 
                    // the next grid items sequence number, since we clicked on move down option.
                    allRows.forEach(function (row, i) {
                        var rowEntity = row.getData().getEntity();
                        if (rowEntity !== null) {
                            var currentRowId = rowEntity._entityId.guid;
                            var currentRowSeqNumber = rowEntity.attributes.getByName("sequencenumber").getValue();
                            if (currentRowSeqNumber == selSequenceNumber_2) {
                                selRows_2.push(currentRowId);
                            }
                            else if (currentRowSeqNumber === nextSequenceNumber_1) {
                                nextRows_1.push(currentRowId);
                            }
                        }
                    });
                    // Using the selected grid item and the next grid item if it exists, this performs the sequence number update
                    // calls by the swapping the sequence number for each of the grid items.
                    if (selRows_2.length > 0 && nextRows_1.length > 0) {
                        var self_2 = this;
                        selRows_2.forEach(function (recId) {
                            Xrm.WebApi.online.updateRecord(gridEntityName, recId, { sequencenumber: nextSequenceNumber_1 }).then(function () {
                                var _this = this;
                                nextRows_1.forEach(function (recId) {
                                    Xrm.WebApi.online.updateRecord(gridEntityName, recId, { sequencenumber: selSequenceNumber_2 }).then(function () {
                                        gridControl.refresh();
                                    }, _this.SequenceNumberUpdateFailed);
                                });
                            }, _this.SequenceNumberUpdateFailed);
                        });
                    }
                }
            };
            this.addNewFromSubGridStandard = function (gridEntityName, parentEntityName, parentEntityId, primaryControl, gridControl) {
                // handle legacy grid type code
                if (typeof gridEntityName == "number") {
                    gridEntityName = Xrm.Internal.getEntityName(gridEntityName);
                }
                var formParameters = {};
                var createFrom = { id: parentEntityId, entityType: "sla" };
                var parentControl = gridControl && gridControl.getParentForm ? gridControl.getParentForm() : Xrm.Page;
                var fromEntity = parentControl.data.entity.getEntityReference();
                var pageInput = {
                    pageType: "entityrecord",
                    entityName: "slaitem",
                    createFromEntity: createFrom,
                    data: formParameters
                };
                var options = SlaSubGridCommandActions.GetMainFormDialogOptions();
                var openOptions = {
                    entityName: gridEntityName,
                    createFromEntity: fromEntity
                };
                SlaSubGridCommandActions.LaunchForm(pageInput, options, openOptions, formParameters);
            };
            this.OpenSLAItemRecord = function (gridEntityName, parentEntityName, parentEntityId, primaryControl, gridControl) {
                // handle legacy grid type code
                if (typeof gridEntityName == "number") {
                    gridEntityName = Xrm.Internal.getEntityName(gridEntityName);
                }
                var parentControl = gridControl && gridControl.getParentForm ? gridControl.getParentForm() : Xrm.Page;
                var fromEntity = parentControl.data.entity.getEntityReference();
                // To open slaitem in edit mode
                var slaItemId = gridControl.getGrid().getSelectedRows().get(0).getData().getEntity().getId();
                if (slaItemId[0].startsWith('{')) {
                    slaItemId = slaItemId.slice(1, -1);
                }
                var createFrom = { id: parentEntityId, entityType: "sla" };
                var pageInput = {
                    pageType: "entityrecord",
                    entityName: "slaitem",
                    createFromEntity: createFrom,
                    entityId: slaItemId
                };
                var options = SlaSubGridCommandActions.GetMainFormDialogOptions();
                var openOptions = {
                    entityName: gridEntityName,
                    createFromEntity: fromEntity
                };
                SlaSubGridCommandActions.LaunchForm(pageInput, options, openOptions, {});
            };
        }
        return SlaSubGridCommandActions;
    }());
    SlaSubGridCommandActions.GetMainFormDialogOptions = function () {
        var sizeInput = { value: 80, unit: "%" };
        return {
            entityName: "slaitem",
            showDialog: true,
            hideDialogHeader: true,
            target: 2,
            width: sizeInput,
            position: 2 // Constant used for opening the dialog to the side
        };
    };
    SlaSubGridCommandActions.LaunchForm = function (pageInput, options, openOptions, formParameters) {
        if (Xrm.Internal.isUci()) {
            Xrm.Navigation.navigateTo(pageInput, options)
                .then(function () {
                if (Xrm.Page.getControl("SLAItemsUCI")) {
                    Xrm.Page.data.refresh();
                }
            });
        }
        else {
            Xrm.Navigation.openForm(openOptions, formParameters);
        }
    };
    Sla.SlaSubGridCommandActions = SlaSubGridCommandActions;
})(Sla || (Sla = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="./SlaMainSystemLibraryWebResource.ts" />
/// <reference path="./SlaMainSystemLibraryUCWebResource.ts" />
/// <reference path="./CreateSlaDialog.ts" />
/// <reference path="./SlaGridCommandActions.ts" />
/// <reference path="./SlaCommandBarActions.ts" />
/// <reference path="./SlaSubGridCommandActions.ts" />
/// <reference path="./SLAWebClientDeprecationAckDialog.ts" />
/// <reference path="./DisableLegacyCreateSlaDialog.ts" />
var Sla;
(function (Sla) {
    var SlaLibrary = (function () {
        function SlaLibrary() {
            var global = window;
            var mscrm = global.Mscrm;
            mscrm.CreateSlaDialog = new Sla.CreateSlaDialog();
            mscrm.SLAWebClientDeprecationAckDialog = new Sla.SLAWebClientDeprecationAckDialog();
            mscrm.DisableLegacyCreateSlaDialog = new Sla.DisableLegacyCreateSlaDialog();
            if (Xrm.Internal.isUci()) {
                mscrm.SlaMainSystemLibraryWebResource = new Sla.SlaMainSystemLibraryUCWebResource();
            }
            else {
                mscrm.SlaMainSystemLibraryWebResource = new Sla.SlaMainSystemLibraryWebResource();
            }
            mscrm.SLAGridCommandActions = new Sla.SlaGridCommandActions(mscrm.SlaMainSystemLibraryWebResource);
            mscrm.SLACommandBarActions = new Sla.SlaCommandBarActions(mscrm.SlaMainSystemLibraryWebResource);
            mscrm.SLASubGridCommandBarActions = new Sla.SlaSubGridCommandActions();
            mscrm.applicablefrompicklist_onchange = mscrm.SlaMainSystemLibraryWebResource.applicableFromPicklistOnchange;
            mscrm.businesshoursid_onclick = mscrm.SlaMainSystemLibraryWebResource.businessHoursIdOnclick;
            mscrm.Form_onload = mscrm.SlaMainSystemLibraryWebResource.formOnload;
            mscrm.Form_onsave = mscrm.SlaMainSystemLibraryWebResource.formOnsave;
            mscrm.Form_onchange = mscrm.SlaMainSystemLibraryWebResource.formOnchange;
        }
        return SlaLibrary;
    }());
    SlaLibrary.Instance = new SlaLibrary();
    SlaLibrary.ctor = (function () {
    })();
    Sla.SlaLibrary = SlaLibrary;
})(Sla || (Sla = {}));
//# sourceMappingURL=Sla_main_system_library.js.map