/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var OmniChannelPackage;
(function (OmniChannelPackage) {
    var EntityNames = (function () {
        function EntityNames() {
        }
        return EntityNames;
    }());
    EntityNames.SystemUser = "systemuser";
    EntityNames.QueueItem = "queueitem";
    OmniChannelPackage.EntityNames = EntityNames;
    // Constants for metadata value passed
    var Metadata = (function () {
        function Metadata() {
        }
        return Metadata;
    }());
    Metadata.OcLiveWorkItemEntity = "msdyn_ocliveworkitem";
    // Keys for parsing JSON response
    Metadata.guidKey = "guid";
    Metadata.idKey = "Id";
    // Constants
    Metadata.zeroGuid = "00000000-0000-0000-0000-000000000000";
    Metadata.fpiAuthenticationIframeName = "StreamControlFpiIframe";
    // API call
    Metadata.PostRequest = "POST";
    // Pick command constants
    Metadata.pickCommandMessageFilter = "PickCommand";
    Metadata.fpiAppName = "OCApp";
    Metadata.pickCommandName = "Pick";
    Metadata.sessionIdParameter = "SessionId";
    Metadata.aadIdParameter = "ADUserId";
    Metadata.organizationIdParameter = "OrganizationId";
    Metadata.tenantIdParameter = "TenantId";
    Metadata.contentTypeParameter = "Content-Type";
    Metadata.contentTypeValue = "application/json";
    Metadata.pickApiPath = "/wds/pick";
    OmniChannelPackage.Metadata = Metadata;
    // LiveWorkItem entity fields
    var LiveWorkItemEntityFields = (function () {
        function LiveWorkItemEntityFields() {
        }
        return LiveWorkItemEntityFields;
    }());
    LiveWorkItemEntityFields.activityId = "activityId";
    LiveWorkItemEntityFields.subject = "subject";
    LiveWorkItemEntityFields.statecode = "statecode";
    LiveWorkItemEntityFields.channel = "msdyn_channel";
    LiveWorkItemEntityFields.msdyn_activeagentid = "msdyn_activeagentid";
    LiveWorkItemEntityFields.msdyn_liveworkstreamid = "msdyn_liveworkstreamid";
    LiveWorkItemEntityFields.msdyn_latestsessionid = "msdyn_lastsessionid";
    LiveWorkItemEntityFields.statuscode = "statuscode";
    LiveWorkItemEntityFields.queueItem = "msdyn_queueitemid";
    OmniChannelPackage.LiveWorkItemEntityFields = LiveWorkItemEntityFields;
    var ChannelType = (function () {
        function ChannelType() {
        }
        return ChannelType;
    }());
    ChannelType.entityRoutingChannel = "192350000";
    OmniChannelPackage.ChannelType = ChannelType;
    var CCaaSConstants = (function () {
        function CCaaSConstants() {
        }
        return CCaaSConstants;
    }());
    CCaaSConstants.OCNamespace = "Omnichannel.CCaaSAPI";
    CCaaSConstants.CCaaSUIPickFCSName = "CCaaS_UI_EnablePickAPI";
    CCaaSConstants.CCaaSAPIValidSolutionVersion = "1.10.0.22";
    CCaaSConstants.CCaaSApiSolutionSelectQuery = "?$select=uniquename,version&$filter=uniquename eq 'msdyn_OmnichannelCCaaSAPI'";
    OmniChannelPackage.CCaaSConstants = CCaaSConstants;
    var State = (function () {
        function State() {
        }
        return State;
    }());
    /**
     * Definition as per LiveWorkItem entity statecode field
     */
    State.Open = 0;
    State.Active = 1;
    State.Waiting = 2;
    State.Closed = 3;
    State.Wrapup = 4;
    OmniChannelPackage.State = State;
    var ConversationStatusCode = (function () {
        function ConversationStatusCode() {
        }
        return ConversationStatusCode;
    }());
    /**
     * Definition as per LiveWorkItem entity statuscode field
     */
    ConversationStatusCode.Open = 1;
    ConversationStatusCode.Active = 2;
    ConversationStatusCode.Waiting = 3;
    ConversationStatusCode.Closed = 4;
    ConversationStatusCode.Wrapup = 5;
    OmniChannelPackage.ConversationStatusCode = ConversationStatusCode;
    /**
     * List of status codes expected from Pick Post API
     */
    var PickHttpStatusCode = (function () {
        function PickHttpStatusCode() {
        }
        return PickHttpStatusCode;
    }());
    // Success
    PickHttpStatusCode.OK = 200;
    PickHttpStatusCode.Created = 201;
    PickHttpStatusCode.Accepted = 202;
    // Error
    PickHttpStatusCode.Unauthorized = 401;
    PickHttpStatusCode.Conflict = 409;
    PickHttpStatusCode.ServerError = 500;
    OmniChannelPackage.PickHttpStatusCode = PickHttpStatusCode;
    /**
     * List of response codes expected from Pick Post API
     */
    var PickCommandResponseCode = (function () {
        function PickCommandResponseCode() {
        }
        return PickCommandResponseCode;
    }());
    /**
     * Success response code
     */
    PickCommandResponseCode.SuccessfulPick = 10000;
    /**
     * Error codes for which detailed message need to be shown to user
     */
    PickCommandResponseCode.ItemPickedByAnotherAgent = 10001;
    PickCommandResponseCode.ItemNotAvailable = 10002;
    PickCommandResponseCode.MaximumCapacityBreached = 10005;
    PickCommandResponseCode.MaxConcurrencyBreached = 10006;
    /**
     * Error codes for which detailed message need to be shown to user for new codes
     */
    PickCommandResponseCode.NewItemNotAvailable = 404002;
    PickCommandResponseCode.NewItemPickedByAnotherAgent = 409001;
    PickCommandResponseCode.NewMaximumCapacityBreached = 412005;
    PickCommandResponseCode.NewMaxConcurrencyBreached = 412006;
    PickCommandResponseCode.NewPresenceStatusNotAssignable = 412007;
    /**
     * Internal error codes
     */
    PickCommandResponseCode.UnSuccessfulPick_RejectedByPresenceService = 10004;
    PickCommandResponseCode.PresenceStatusNotAssignable = 10007;
    PickCommandResponseCode.WDSPickRequestException = 10008;
    PickCommandResponseCode.UnHandledException = 10009;
    PickCommandResponseCode.UnHandledException_lockUnLockItemException = 10010;
    PickCommandResponseCode.UnHandledException_PresenceService = 10012;
    // Unknown code if response could not be parsed
    PickCommandResponseCode.Unknown = -1;
    OmniChannelPackage.PickCommandResponseCode = PickCommandResponseCode;
    /**
     * Localization Constants
     */
    var LocalizationConstants = (function () {
        function LocalizationConstants() {
        }
        return LocalizationConstants;
    }());
    LocalizationConstants.resxWebResourceName = "msdyn_OmnichannelBase";
    // Localized string id
    LocalizationConstants.OC_PickAuthFailed = "OC_PickAuthFailed";
    LocalizationConstants.OC_PickedByAnotherAgent = "OC_PickedByAnotherAgent";
    LocalizationConstants.OC_PickInternalError = "OC_PickInternalError";
    LocalizationConstants.OC_PickMaxCapacityReached = "OC_PickMaxCapacityReached";
    LocalizationConstants.OC_PickMaxConcurrencyReached = "OC_PickMaxConcurrencyReached";
    LocalizationConstants.OC_PickNotAvailable = "OC_PickNotAvailable";
    LocalizationConstants.OC_PickPresenceError = "OC_PickPresenceError";
    LocalizationConstants.OC_PickSuccess = "OC_PickSuccess";
    LocalizationConstants.OC_OpenSessionFail = "OC_OpenSessionFail";
    LocalizationConstants.OC_OpenFormFail = "OC_OpenFormFail";
    LocalizationConstants.OC_SupervisorOpenRecord = "OC_SupervisorOpenRecord";
    // If localized string is not found
    LocalizationConstants.OC_Undefined = "OC_Undefined";
    OmniChannelPackage.LocalizationConstants = LocalizationConstants;
    /**
     * Post message response structure
     */
    var IFpiPickMessageResponse = (function () {
        function IFpiPickMessageResponse() {
        }
        return IFpiPickMessageResponse;
    }());
    OmniChannelPackage.IFpiPickMessageResponse = IFpiPickMessageResponse;
    /**
     * Post message response text
     */
    var IFpiPickResponse = (function () {
        function IFpiPickResponse() {
        }
        return IFpiPickResponse;
    }());
    OmniChannelPackage.IFpiPickResponse = IFpiPickResponse;
    /**
     * Post message static data structure passed to FPI handler
     */
    var IFpiPickStaticDataResponse = (function () {
        function IFpiPickStaticDataResponse() {
        }
        return IFpiPickStaticDataResponse;
    }());
    OmniChannelPackage.IFpiPickStaticDataResponse = IFpiPickStaticDataResponse;
    /**
     * Service endpoint entity related constants
     */
    var ServiceEndpointConstants = (function () {
        function ServiceEndpointConstants() {
        }
        return ServiceEndpointConstants;
    }());
    ServiceEndpointConstants.serviceEndpointEntityName = "serviceendpoint";
    ServiceEndpointConstants.ocEndpointRecordId = "8af92c33-e748-4b5a-b772-46cba89bb7ac";
    ServiceEndpointConstants.pathPropertyKey = "path";
    ServiceEndpointConstants.namePropertyKey = "name";
    OmniChannelPackage.ServiceEndpointConstants = ServiceEndpointConstants;
    var OmnichannelConfiguration = (function () {
        function OmnichannelConfiguration() {
        }
        return OmnichannelConfiguration;
    }());
    OmnichannelConfiguration.ocConfigurationEntityName = "msdyn_omnichannelconfiguration";
    OmnichannelConfiguration.ocConfigurationRecordId = "d4d91600-6f21-467b-81fe-6757a2791fa1";
    OmnichannelConfiguration.ocAdvanceRoutingQueryString = "?$select=msdyn_enable_advance_entity_routing";
    OmniChannelPackage.OmnichannelConfiguration = OmnichannelConfiguration;
    /**
     * Constants related to Pick request
     */
    var PickRequestConstants = (function () {
        function PickRequestConstants() {
        }
        return PickRequestConstants;
    }());
    PickRequestConstants.sentRequestStatus = "RequestSent";
    OmniChannelPackage.PickRequestConstants = PickRequestConstants;
    /**
     * Constants for Open In Session Command
     */
    var OpenSessionCmdConstants = (function () {
        function OpenSessionCmdConstants() {
        }
        return OpenSessionCmdConstants;
    }());
    OpenSessionCmdConstants.baseCommand = "http://event/?eventname=OpenConversationAsSession";
    OpenSessionCmdConstants.sessionParam = "&OcSessionId=";
    OpenSessionCmdConstants.liveWorkItemParam = "&OcConversationId=";
    OpenSessionCmdConstants.liveWorkStreamParam = "&LiveWorkStreamId=";
    OmniChannelPackage.OpenSessionCmdConstants = OpenSessionCmdConstants;
    /**
     * Context details when command is executed from Agent Dashboard's Stream Control
     */
    var StreamCommandContext = (function () {
        function StreamCommandContext() {
        }
        return StreamCommandContext;
    }());
    StreamCommandContext.controlId = "OCStreamControl";
    OmniChannelPackage.StreamCommandContext = StreamCommandContext;
    /**
     * Context details when command is executed from Conversation Dashboard
     */
    var OcGridCommandContext = (function () {
        function OcGridCommandContext() {
        }
        return OcGridCommandContext;
    }());
    OcGridCommandContext.controlId = "OCSupGridControl";
    OmniChannelPackage.OcGridCommandContext = OcGridCommandContext;
    var FormConstants = (function () {
        function FormConstants() {
        }
        return FormConstants;
    }());
    FormConstants.closedConversationFormId = "136b3800-234b-420c-9d8a-458b61cb2263";
    OmniChannelPackage.FormConstants = FormConstants;
})(OmniChannelPackage || (OmniChannelPackage = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var OmniChannelPackage;
(function (OmniChannelPackage) {
    var OmniChannelLiveWorkStreamSMSConstants = (function () {
        function OmniChannelLiveWorkStreamSMSConstants() {
        }
        return OmniChannelLiveWorkStreamSMSConstants;
    }());
    OmniChannelLiveWorkStreamSMSConstants.LiveWorkStream = "msdyn_liveworkstream";
    OmniChannelLiveWorkStreamSMSConstants.SMSSettings = "smsSettings";
    OmniChannelLiveWorkStreamSMSConstants.SMSNumbers = "smsNumbers";
    OmniChannelLiveWorkStreamSMSConstants.SMSStreamSourceType = 192340000;
    OmniChannelLiveWorkStreamSMSConstants.StreamSource = "msdyn_streamsource";
    OmniChannelLiveWorkStreamSMSConstants.TelesignInboundURLField = "msdyn_telesigninboundurl";
    OmniChannelLiveWorkStreamSMSConstants.TwilioInboundURLField = "msdyn_twilioinboundurl";
    OmniChannelLiveWorkStreamSMSConstants.ApiKey = "msdyn_apikey";
    OmniChannelLiveWorkStreamSMSConstants.LiveWorkStreamId = "msdyn_liveworkstreamId";
    OmniChannelLiveWorkStreamSMSConstants.CustomerId = "msdyn_customerid";
    OmniChannelLiveWorkStreamSMSConstants.ValidateAction = "msdyn_msdyn_ValidateWorkStreamSMSConnection";
    OmniChannelLiveWorkStreamSMSConstants.nameProperty = "name";
    OmniChannelLiveWorkStreamSMSConstants.pathProperty = "path";
    OmniChannelLiveWorkStreamSMSConstants.OCEndpointRecordId = "8af92c33-e748-4b5a-b772-46cba89bb7ac";
    OmniChannelLiveWorkStreamSMSConstants.ServiceEndPoint = "serviceendpoint";
    OmniChannelLiveWorkStreamSMSConstants.SMSConnectionParametersSection = "SMSConnectionParameters";
    OmniChannelLiveWorkStreamSMSConstants.SMSAccountInformationSection = "RESTAPIDetails";
    OmniChannelLiveWorkStreamSMSConstants.MicrosoftFlowSection = "MSFlowOutboundNotifications";
    OmniChannelLiveWorkStreamSMSConstants.AutoCloseAfterInactivity = "msdyn_autocloseafterinactivity";
    OmniChannelLiveWorkStreamSMSConstants.Capacity = "msdyn_capacityrequired";
    OmniChannelLiveWorkStreamSMSConstants.DefaultAutoCloseAfterInactivity = 2880; // minutes
    OmniChannelLiveWorkStreamSMSConstants.DefaultSMSCapacity = 30; // minutes
    OmniChannelLiveWorkStreamSMSConstants.SMSProvider = "msdyn_smsprovider";
    OmniChannelLiveWorkStreamSMSConstants.OCSMSSolutionName = "msdyn_OmnichannelSMS";
    OmniChannelLiveWorkStreamSMSConstants.OCFormNotificationTypeWarning = "WARNING";
    OmniChannelLiveWorkStreamSMSConstants.OCFormNotificationId = "16cce397-b201-483b-8b13-31f2048e70ce";
    OmniChannelLiveWorkStreamSMSConstants.OCFormNotificationSMSProviderWarningText = "OC_FormNotificationMessageForSMSProvider";
    OmniChannelLiveWorkStreamSMSConstants.TwilioAuthTokenLabel = "OC_TwilioAuthTokenLabel";
    OmniChannelLiveWorkStreamSMSConstants.TwilioAccountSIDLabel = "OC_TwilioAccountSIDLabel";
    OmniChannelLiveWorkStreamSMSConstants.TeleSignCustomerIdLabel = "OC_TeleSignCustomerIdLabel";
    OmniChannelLiveWorkStreamSMSConstants.TeleSignApiKeyLabel = "OC_TeleSignApiKeyLabel";
    OmniChannelLiveWorkStreamSMSConstants.TwilioAccountInformationSectionLabel = "OC_TwilioAccountInformationSectionLabel";
    OmniChannelLiveWorkStreamSMSConstants.TeleSignAccountInformationSectionLabel = "OC_TeleSignAccountInformationSectionLabel";
    OmniChannelLiveWorkStreamSMSConstants.TeleSignProvider = 192350000;
    OmniChannelLiveWorkStreamSMSConstants.TwilioProvider = 192350001;
    OmniChannelLiveWorkStreamSMSConstants.Localization = (_a = (function () {
            function class_1() {
            }
            return class_1;
        }()),
        _a.APIKeyInvalid = "LiveWorkStream.APIKeyInvalid",
        _a.CustomerIdInvalid = "LiveWorkStream.CustomerIdInvalid",
        _a.ValidatingMessage = "LiveWorkStream.Validating",
        _a.OCEndpointMissing = "LiveWorkStream.OCEndpointMissing",
        _a);
    OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants = OmniChannelLiveWorkStreamSMSConstants;
    var _a;
})(OmniChannelPackage || (OmniChannelPackage = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var OmniChannelPackage;
(function (OmniChannelPackage) {
    var OmniChannelLiveWorkStreamSMSLocalizationConstants = (function () {
        function OmniChannelLiveWorkStreamSMSLocalizationConstants() {
        }
        return OmniChannelLiveWorkStreamSMSLocalizationConstants;
    }());
    OmniChannelLiveWorkStreamSMSLocalizationConstants.APIKeyInvalid = "LiveWorkStream.APIKeyInvalid";
    OmniChannelLiveWorkStreamSMSLocalizationConstants.CustomerIdInvalid = "LiveWorkStream.CustomerIdInvalid";
    OmniChannelLiveWorkStreamSMSLocalizationConstants.ValidatingMessage = "LiveWorkStream.Validating";
    OmniChannelLiveWorkStreamSMSLocalizationConstants.OCEndpointMissing = "LiveWorkStream.OCEndpointMissing";
    OmniChannelPackage.OmniChannelLiveWorkStreamSMSLocalizationConstants = OmniChannelLiveWorkStreamSMSLocalizationConstants;
})(OmniChannelPackage || (OmniChannelPackage = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
"use strict";
var OmniChannelPackage;
(function (OmniChannelPackage) {
    var TypeUtilities = (function () {
        function TypeUtilities() {
        }
        TypeUtilities.IsNullOrWhitespace = function () {
            var parameters = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                parameters[_i] = arguments[_i];
            }
            if (typeof parameters !== TypeUtilities.Object || parameters.length === 0) {
                return true;
            }
            for (var i = 0; i < parameters.length; ++i) {
                if (typeof parameters[i] !== TypeUtilities.String ||
                    parameters[i].length === 0 ||
                    parameters[i].trim().length === 0) {
                    return true;
                }
            }
            return false;
        };
        TypeUtilities.IsString = function () {
            var parameters = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                parameters[_i] = arguments[_i];
            }
            if (parameters.length === 0) {
                return false;
            }
            for (var i = 0; i < parameters.length; ++i) {
                if (typeof parameters[i] !== TypeUtilities.String) {
                    return false;
                }
            }
            return true;
        };
        TypeUtilities.IsNumber = function () {
            var parameters = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                parameters[_i] = arguments[_i];
            }
            if (parameters.length === 0) {
                return false;
            }
            for (var i = 0; i < parameters.length; ++i) {
                if (typeof parameters[i] !== TypeUtilities.Number) {
                    return false;
                }
            }
            return true;
        };
        TypeUtilities.IsFunction = function () {
            var parameters = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                parameters[_i] = arguments[_i];
            }
            if (parameters.length === 0) {
                return false;
            }
            for (var i = 0; i < parameters.length; ++i) {
                if (typeof parameters[i] !== TypeUtilities.Function) {
                    return false;
                }
            }
            return true;
        };
        TypeUtilities.IsNonNullObject = function () {
            var parameters = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                parameters[_i] = arguments[_i];
            }
            if (parameters.length === 0) {
                return false;
            }
            for (var i = 0; i < parameters.length; ++i) {
                if (typeof parameters[i] !== TypeUtilities.Object || parameters[i] === null) {
                    return false;
                }
            }
            return true;
        };
        return TypeUtilities;
    }());
    TypeUtilities.Function = "function";
    TypeUtilities.Object = "object";
    TypeUtilities.String = "string";
    TypeUtilities.Number = "number";
    OmniChannelPackage.TypeUtilities = TypeUtilities;
})(OmniChannelPackage || (OmniChannelPackage = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
///<reference path="../../TypeDefinitions/OmnichannelBase/TypeDefinitions/libs/XrmClientApi.d.ts"/>
///<reference path="../../OmnichannelBase/Client/TypeUtilities.ts" />
"use strict";
var OmniChannelPackage;
(function (OmniChannelPackage) {
    var Localization = (function () {
        function Localization() {
        }
        // Handles undefined values and catches errors so that we always get a value back
        Localization.GetLocalizedString = function (key) {
            try {
                var result = Xrm.Utility.getResourceString(Localization.WebResourceName, key);
                // If we get back null, return the key value
                return OmniChannelPackage.TypeUtilities.IsNullOrWhitespace(result) ? key : result;
            }
            catch (err) {
                // If we throw an error, return the key value
                return key;
            }
        };
        return Localization;
    }());
    Localization.WebResourceName = "msdyn_OmnichannelSMS";
    OmniChannelPackage.Localization = Localization;
})(OmniChannelPackage || (OmniChannelPackage = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
///<reference path="../../../TypeDefinitions/OmnichannelBase/TypeDefinitions/libs/XrmClientApi.d.ts"/>
///<reference path="../../../OmnichannelBase/Client/CommandBarActions/OmnichannelStreamCommands/Constants.ts"/>
///<reference path="LwsSMSConstants.ts"/>
///<reference path="LwsSMSLocalizationConstants.ts"/>
///<reference path="../Localization.ts"/>
///<reference path="../../../OmnichannelBase/Client/TypeUtilities.ts" />
"use strict";
var OmniChannelPackage;
(function (OmniChannelPackage) {
    var LwsSMSSettings = (function () {
        function LwsSMSSettings() {
        }
        LwsSMSSettings.HideOrShowSMSSettingsBasedOnOptionSetValue = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var smsSettingsTab = formContext.ui.tabs.get(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.SMSSettings);
            var smsNumbersTab = formContext.ui.tabs.get(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.SMSNumbers);
            var streamSource = formContext.data.entity.attributes.get(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.StreamSource).getValue();
            var isSMSSettingsVisible = streamSource !== null && streamSource === OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.SMSStreamSourceType;
            this.setControlVisibility(smsSettingsTab, isSMSSettingsVisible);
            this.setControlVisibility(smsNumbersTab, isSMSSettingsVisible);
            if (isSMSSettingsVisible && formContext.ui.getFormType() === 1) {
                var smsAutoCloseAttribute = formContext.data.entity.attributes.get(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.AutoCloseAfterInactivity);
                var smsCapacityAttribute = formContext.data.entity.attributes.get(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.Capacity);
                var autoCloseAfterInactivityControl = formContext.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.AutoCloseAfterInactivity);
                if (autoCloseAfterInactivityControl !== null)
                    autoCloseAfterInactivityControl.setVisible(isSMSSettingsVisible); // Removed and added from base sol (Task-1396480 fixes)
                if (smsCapacityAttribute !== null)
                    smsCapacityAttribute.setValue(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.DefaultSMSCapacity);
                if (smsAutoCloseAttribute !== null)
                    smsAutoCloseAttribute.setValue(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.DefaultAutoCloseAfterInactivity); // Removed and added from base sol (Task-1396480 fixes)
            }
        };
        LwsSMSSettings.HideOrShowConnectionParametersAndUpdateLabels = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var smsProviderAttribute = formContext.data.entity.attributes.get(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.SMSProvider);
            // Get sections
            var smsSettingsTab = formContext.ui.tabs.get(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.SMSSettings);
            var accountInformationSection = smsSettingsTab.sections.get(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.SMSAccountInformationSection);
            var microsoftFlowSection = smsSettingsTab.sections.get(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.MicrosoftFlowSection);
            // Get fields that need a name change
            var apiKeyControl = formContext.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.ApiKey);
            var customerIdControl = formContext.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.CustomerId);
            if (smsProviderAttribute && smsProviderAttribute.getValue()) {
                switch (smsProviderAttribute.getValue()) {
                    case OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.TwilioProvider: {
                        // display twilio specific settings
                        this.setAccountInfoLabels(apiKeyControl, customerIdControl, accountInformationSection, OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.TwilioAuthTokenLabel, OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.TwilioAccountSIDLabel, OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.TwilioAccountInformationSectionLabel);
                        microsoftFlowSection.setVisible(true);
                        accountInformationSection.setVisible(true);
                        break;
                    }
                    case OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.TeleSignProvider: {
                        // display telesign specific settings
                        this.setAccountInfoLabels(apiKeyControl, customerIdControl, accountInformationSection, OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.TeleSignApiKeyLabel, OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.TeleSignCustomerIdLabel, OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.TeleSignAccountInformationSectionLabel);
                        accountInformationSection.setVisible(true);
                        microsoftFlowSection.setVisible(true);
                        break;
                    }
                    default: {
                        accountInformationSection.setVisible(false);
                        microsoftFlowSection.setVisible(false);
                    }
                }
            }
        };
        // Locks the sms provider field once the workstream form is saved
        LwsSMSSettings.DisableSMSProviderOnceSaved = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var smsProviderAttribute = formContext.data.entity.attributes.get(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.SMSProvider);
            var smsProviderControl = formContext.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.SMSProvider);
            if (smsProviderAttribute !== null && smsProviderAttribute.getValue()) {
                var selectedValue = smsProviderAttribute.getValue();
                smsProviderControl.setDisabled(selectedValue !== null);
            }
        };
        //  Displays a warning message on the workstream form if the sms settings are not filled
        LwsSMSSettings.HideOrShowSMSSettingsWarningNotificationInForm = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var smsProviderAttribute = formContext.data.entity.attributes.get(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.SMSProvider);
            var apiKeyAttribute = formContext.data.entity.attributes.get(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.ApiKey);
            var customerIdAttribute = formContext.data.entity.attributes.get(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.CustomerId);
            var streamSource = formContext.data.entity.attributes.get(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.StreamSource).getValue();
            var isStreamSourceSMS = streamSource !== null && streamSource === OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.SMSStreamSourceType;
            if (isStreamSourceSMS && smsProviderAttribute !== null && apiKeyAttribute !== null && customerIdAttribute !== null) {
                var smsProviderValue = smsProviderAttribute.getValue();
                var clearWarning = smsProviderValue && apiKeyAttribute.getValue() && customerIdAttribute.getValue();
                if (clearWarning) {
                    formContext.ui.clearFormNotification(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.OCFormNotificationId);
                }
                else {
                    formContext.ui.setFormNotification(Xrm.Utility.getResourceString(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.OCSMSSolutionName, OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.OCFormNotificationSMSProviderWarningText), OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.OCFormNotificationTypeWarning, OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.OCFormNotificationId);
                }
            }
        };
        LwsSMSSettings.setDefaultTelesignInboundURL = function (executionContext) {
            var provider = "telesign";
            this.SetDefaultSMSInboundURL(executionContext, OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.TelesignInboundURLField, provider);
        };
        LwsSMSSettings.SetDefaultTwilioInboundURL = function (executionContext) {
            var provider = "twilio";
            this.SetDefaultSMSInboundURL(executionContext, OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.TwilioInboundURLField, provider);
        };
        LwsSMSSettings.DisplayInboundURL = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var twilioInboundUrlControl = formContext.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.TwilioInboundURLField);
            var telesignInboundUrlControl = formContext.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.TelesignInboundURLField);
            var smsSettingsTab = formContext.ui.tabs.get(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.SMSSettings);
            var smsConnectionParametersSection = smsSettingsTab.sections.get(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.SMSConnectionParametersSection);
            var smsProviderAttribute = formContext.data.entity.attributes.get(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.SMSProvider);
            if (smsProviderAttribute !== null && smsProviderAttribute.getValue()) {
                var selectedValue = smsProviderAttribute.getValue();
                // display "Connection parameters" section for Twilio or TeleSign providers
                var isTwilio = selectedValue == OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.TwilioProvider;
                var isTelesign = selectedValue == OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.TeleSignProvider;
                twilioInboundUrlControl.setVisible(isTwilio);
                telesignInboundUrlControl.setVisible(isTelesign);
                smsConnectionParametersSection.setVisible(isTwilio || isTelesign);
            }
            else {
                smsConnectionParametersSection.setVisible(false);
            }
        };
        LwsSMSSettings.SetDefaultSMSInboundURL = function (executionContext, urlFieldName, provider) {
            var formContext = executionContext.getFormContext();
            var inboundURLField = formContext.data.entity.attributes.get(urlFieldName);
            var smsSettingsTab = formContext.ui.tabs.get(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.SMSSettings);
            var displayState = smsSettingsTab.getDisplayState();
            if (displayState !== "expanded") {
                return;
            }
            var smsProviderAttribute = formContext.data.entity.attributes.get(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.SMSProvider);
            if (smsProviderAttribute != null) {
                var selectedValue = smsProviderAttribute.getValue();
                if (!selectedValue) {
                    return;
                }
            }
            var orgId = Xrm.Utility.getGlobalContext().organizationSettings.organizationId;
            try {
                Xrm.WebApi.retrieveRecord(OmniChannelPackage.ServiceEndpointConstants.serviceEndpointEntityName, OmniChannelPackage.ServiceEndpointConstants.ocEndpointRecordId).then(function success(result) {
                    if (result && result.path) {
                        var baseUrl = result.path;
                        if (!OmniChannelPackage.TypeUtilities.IsNullOrWhitespace(baseUrl)) {
                            var url = baseUrl + "/" + provider + "/incoming?orgId=" + orgId;
                            inboundURLField.setValue(url);
                        }
                    }
                }, function failure(error) {
                    LwsSMSSettings.showErrorNotification(OmniChannelPackage.OmniChannelLiveWorkStreamSMSLocalizationConstants.OCEndpointMissing);
                });
            }
            catch (error) {
                LwsSMSSettings.showErrorNotification(OmniChannelPackage.OmniChannelLiveWorkStreamSMSLocalizationConstants.OCEndpointMissing);
            }
        };
        // Finds the first substring match in an array with key to search for with SearchName to find it in.
        LwsSMSSettings.search = function (array, key, searchValue) {
            for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                var value = array_1[_i];
                if (value[key].indexOf(searchValue) !== -1) {
                    return value[key];
                }
            }
        };
        LwsSMSSettings.showErrorNotification = function (key) {
            var errorMessage = Xrm.Utility.getResourceString(OmniChannelPackage.Localization.WebResourceName, key);
            if (OmniChannelPackage.TypeUtilities.IsNullOrWhitespace(errorMessage)) {
                // If we can't find the localized string, use the key.
                errorMessage = key;
            }
            Xrm.Navigation.openErrorDialog({ message: errorMessage });
        };
        LwsSMSSettings.setControlVisibility = function (tabControl, show) {
            if (OmniChannelPackage.TypeUtilities.IsNonNullObject(tabControl) && OmniChannelPackage.TypeUtilities.IsFunction(tabControl.setVisible)) {
                tabControl.setVisible(show);
            }
        };
        LwsSMSSettings.setAccountInfoLabels = function (apiKeyControl, customerIdControl, accountInformationSection, keyLabel, idLabel, accountInfoLabel) {
            apiKeyControl.setLabel(Xrm.Utility.getResourceString(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.OCSMSSolutionName, keyLabel));
            customerIdControl.setLabel(Xrm.Utility.getResourceString(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.OCSMSSolutionName, idLabel));
            accountInformationSection.setLabel(Xrm.Utility.getResourceString(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.OCSMSSolutionName, accountInfoLabel));
        };
        return LwsSMSSettings;
    }());
    OmniChannelPackage.LwsSMSSettings = LwsSMSSettings;
})(OmniChannelPackage || (OmniChannelPackage = {}));
