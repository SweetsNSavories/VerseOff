var OmniChannelPackage;
(function (OmniChannelPackage) {
    var SMSNumberConstants = (function () {
        function SMSNumberConstants() {
        }
        return SMSNumberConstants;
    }());
    SMSNumberConstants.EntityName = "msdyn_smsnumber";
    SMSNumberConstants.NumberAttributeName = "msdyn_number";
    SMSNumberConstants.NumberInvalidNotificationId = "msdyn_number_invalid_notification";
    SMSNumberConstants.NumberRemoveFormattingCharactersRegex = /[^0-9]/gi;
    SMSNumberConstants.NumberLongCodeRegex = /^[0-9]{8,15}$/;
    SMSNumberConstants.NumberTollFreeRegex = /^1[0-9]{7,14}$/;
    SMSNumberConstants.NumberShortCodeRegex = /^[a-z0-9]{3,8}$/i;
    SMSNumberConstants.TypeAttributeName = "msdyn_type";
    SMSNumberConstants.TypeLongCode = 192350000;
    SMSNumberConstants.TypeShortCode = 192350001;
    SMSNumberConstants.TypeTollFree = 192350002;
    SMSNumberConstants.TypeInvalidNotificationId = "msdyn_type_invalid_notification";
    SMSNumberConstants.ProviderAttributeName = "msdyn_provider";
    SMSNumberConstants.ProviderTelesignApp = 192350000;
    SMSNumberConstants.ProviderInvalidNotificationId = "msdyn_provider_invalid_notification";
    SMSNumberConstants.FormattedPhoneNumberAttributeName = "msdyn_formattedphonenumber";
    OmniChannelPackage.SMSNumberConstants = SMSNumberConstants;
})(OmniChannelPackage || (OmniChannelPackage = {}));
var OmniChannelPackage;
(function (OmniChannelPackage) {
    var SMSNumberLocalizationConstants = (function () {
        function SMSNumberLocalizationConstants() {
        }
        return SMSNumberLocalizationConstants;
    }());
    SMSNumberLocalizationConstants.ProviderInvalid = "SMSNumber.ProviderInvalid";
    SMSNumberLocalizationConstants.TypeInvalid = "SMSNumber.TypeInvalid";
    SMSNumberLocalizationConstants.NumberInvalid = "SMSNumber.NumberInvalid";
    SMSNumberLocalizationConstants.TelesignLongCodeInvalid = "SMSNumber.Telesign.LongCodeInvalid";
    SMSNumberLocalizationConstants.TelesignTollFreeInvalid = "SMSNumber.Telesign.TollFreeInvalid";
    SMSNumberLocalizationConstants.TelesignShortCodeInvalid = "SMSNumber.Telesign.ShortCodeInvalid";
    OmniChannelPackage.SMSNumberLocalizationConstants = SMSNumberLocalizationConstants;
})(OmniChannelPackage || (OmniChannelPackage = {}));
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
    OmniChannelLiveWorkStreamSMSConstants.DefaultAutoCloseAfterInactivity = 2880;
    OmniChannelLiveWorkStreamSMSConstants.DefaultSMSCapacity = 30;
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
"use strict";
var OmniChannelPackage;
(function (OmniChannelPackage) {
    var Localization = (function () {
        function Localization() {
        }
        Localization.GetLocalizedString = function (key) {
            try {
                var result = Xrm.Utility.getResourceString(Localization.WebResourceName, key);
                return OmniChannelPackage.TypeUtilities.IsNullOrWhitespace(result) ? key : result;
            }
            catch (err) {
                return key;
            }
        };
        return Localization;
    }());
    Localization.WebResourceName = "msdyn_OmnichannelSMS";
    OmniChannelPackage.Localization = Localization;
})(OmniChannelPackage || (OmniChannelPackage = {}));
"use strict";
var OmniChannelPackage;
(function (OmniChannelPackage) {
    ;
    var SMSConnectionValidation = (function () {
        function SMSConnectionValidation() {
        }
        SMSConnectionValidation.IsStreamSourceSMS = function (control) {
            if (!OmniChannelPackage.TypeUtilities.IsNonNullObject(control) ||
                !OmniChannelPackage.TypeUtilities.IsNonNullObject(control.entityReference) ||
                OmniChannelPackage.TypeUtilities.IsNullOrWhitespace(control.entityReference.entityType) ||
                control.entityReference.entityType !== OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.LiveWorkStream ||
                !OmniChannelPackage.TypeUtilities.IsNonNullObject(control.data) ||
                !OmniChannelPackage.TypeUtilities.IsNonNullObject(control.data.entity) ||
                !OmniChannelPackage.TypeUtilities.IsNonNullObject(control.data.entity.attributes) ||
                !OmniChannelPackage.TypeUtilities.IsFunction(control.data.entity.attributes.getByName)) {
                return false;
            }
            var attribute = control.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.StreamSource);
            return OmniChannelPackage.TypeUtilities.IsNonNullObject(attribute) &&
                OmniChannelPackage.TypeUtilities.IsFunction(attribute.getValue) &&
                attribute.getValue() === OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.SMSStreamSourceType;
        };
        SMSConnectionValidation.IsEntitySMS = function (control) {
            return OmniChannelPackage.TypeUtilities.IsNonNullObject(control) &&
                OmniChannelPackage.TypeUtilities.IsNonNullObject(control.entityReference) &&
                control.entityReference.entityType === OmniChannelPackage.SMSNumberConstants.EntityName;
        };
        SMSConnectionValidation.ValidateSMSConnectionsFromGrid = function (selectedControl) {
            if (!OmniChannelPackage.TypeUtilities.IsNonNullObject(selectedControl) ||
                !OmniChannelPackage.TypeUtilities.IsFunction(selectedControl.getGrid)) {
                return;
            }
            var grid = selectedControl.getGrid();
            if (!OmniChannelPackage.TypeUtilities.IsNonNullObject(grid) ||
                !OmniChannelPackage.TypeUtilities.IsFunction(grid.getSelectedRows)) {
                return;
            }
            var rows = grid.getSelectedRows();
            if (!OmniChannelPackage.TypeUtilities.IsNonNullObject(rows) ||
                !OmniChannelPackage.TypeUtilities.IsFunction(rows.getAll)) {
                return;
            }
            var allRows = rows.getAll();
            if (!Array.isArray(allRows)) {
                return;
            }
            var parentForm;
            if (OmniChannelPackage.TypeUtilities.IsFunction(selectedControl.getParentForm)) {
                parentForm = selectedControl.getParentForm();
            }
            rows.forEach(function (row) { return SMSConnectionValidation.ValidateSMSConnection(row, parentForm); });
        };
        SMSConnectionValidation.ValidateSMSConnection = function (primaryControl, parentForm) {
            if (!SMSConnectionValidation.validateInputs(primaryControl)) {
                return;
            }
            var req = SMSConnectionValidation.createRequest(primaryControl, parentForm);
            var requestPromise = Xrm.WebApi.online.execute(req);
            var validatingMessage = OmniChannelPackage.Localization.GetLocalizedString(OmniChannelPackage.OmniChannelLiveWorkStreamSMSLocalizationConstants.ValidatingMessage);
            if (OmniChannelPackage.TypeUtilities.IsNullOrWhitespace(validatingMessage)) {
                validatingMessage = OmniChannelPackage.OmniChannelLiveWorkStreamSMSLocalizationConstants.ValidatingMessage;
            }
            var infoNotificationPromise = Xrm.UI.addGlobalNotification(1, 4, validatingMessage, validatingMessage, null);
            requestPromise.then(onRequestPromiseComplete, onRequestPromiseFailure);
            function onRequestPromiseComplete(response) {
                response.json().then(onJsonPromiseComplete, onJsonPromiseError);
            }
            function onRequestPromiseFailure(error) {
                var anyError = error;
                var details = error.debugMessage;
                if (OmniChannelPackage.TypeUtilities.IsNonNullObject(anyError.innerror) && !OmniChannelPackage.TypeUtilities.IsNullOrWhitespace(anyError.innerror.stacktrace)) {
                    details = anyError.innerror.stacktrace;
                }
                Xrm.Navigation.openErrorDialog({
                    message: error.message,
                    errorCode: error.errorCode,
                    details: details
                });
            }
            function onJsonPromiseComplete(json) {
                if (!OmniChannelPackage.TypeUtilities.IsNonNullObject(json) || OmniChannelPackage.TypeUtilities.IsNullOrWhitespace(json.Output)) {
                    return;
                }
                var output;
                try {
                    output = JSON.parse(json.Output);
                }
                catch (ex) {
                    Xrm.Navigation.openErrorDialog({
                        message: ex.message,
                        errorCode: undefined,
                        details: ex.stack
                    });
                    return;
                }
                infoNotificationPromise.then(function (id) { return Xrm.UI.clearGlobalNotification(id); });
                if (OmniChannelPackage.TypeUtilities.IsNullOrWhitespace(output.ResultMessageKey)) {
                    return;
                }
                var message = OmniChannelPackage.Localization.GetLocalizedString(output.ResultMessageKey);
                if (OmniChannelPackage.TypeUtilities.IsNullOrWhitespace(message)) {
                    message = output.ResultMessageKey;
                }
                if (!OmniChannelPackage.TypeUtilities.IsNullOrWhitespace(message) && !OmniChannelPackage.TypeUtilities.IsNullOrWhitespace(output.ResultMessageFormatArgumentKey)) {
                    var invalidFormatArgument = OmniChannelPackage.Localization.GetLocalizedString(output.ResultMessageFormatArgumentKey);
                    if (OmniChannelPackage.TypeUtilities.IsNullOrWhitespace(invalidFormatArgument)) {
                        invalidFormatArgument = output.ResultMessageFormatArgumentKey;
                    }
                    message = message.replace(/\{0\}/g, invalidFormatArgument);
                }
                if (output.SMSSentSuccessfully === true) {
                    Xrm.UI.addGlobalNotification(1, 1, message, null, null);
                    return;
                }
                else {
                    Xrm.Navigation.openErrorDialog({
                        message: message,
                        errorCode: undefined,
                        details: output.ErrorDetails
                    });
                }
                if (output.CustomerIdValid === false) {
                    var customerId = primaryControl.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.CustomerId);
                    if (OmniChannelPackage.TypeUtilities.IsNonNullObject(customerId) &&
                        OmniChannelPackage.TypeUtilities.IsFunction(customerId.setNotification)) {
                        var invalidMessage = OmniChannelPackage.Localization.GetLocalizedString(OmniChannelPackage.OmniChannelLiveWorkStreamSMSLocalizationConstants.CustomerIdInvalid);
                        if (OmniChannelPackage.TypeUtilities.IsNullOrWhitespace(invalidMessage)) {
                            invalidMessage = OmniChannelPackage.OmniChannelLiveWorkStreamSMSLocalizationConstants.CustomerIdInvalid;
                        }
                        customerId.setNotification(invalidMessage, SMSConnectionValidation.validationNotificationId);
                        SMSConnectionValidation.validationNotificationsSet = true;
                    }
                }
                if (output.ApiKeyValid === false) {
                    var apiKey = primaryControl.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.ApiKey);
                    if (OmniChannelPackage.TypeUtilities.IsNonNullObject(apiKey) &&
                        OmniChannelPackage.TypeUtilities.IsFunction(apiKey.setNotification)) {
                        var invalidMessage = OmniChannelPackage.Localization.GetLocalizedString(OmniChannelPackage.OmniChannelLiveWorkStreamSMSLocalizationConstants.APIKeyInvalid);
                        if (OmniChannelPackage.TypeUtilities.IsNullOrWhitespace(invalidMessage)) {
                            invalidMessage = OmniChannelPackage.OmniChannelLiveWorkStreamSMSLocalizationConstants.APIKeyInvalid;
                        }
                        apiKey.setNotification(invalidMessage, SMSConnectionValidation.validationNotificationId);
                        SMSConnectionValidation.validationNotificationsSet = true;
                    }
                }
                if (output.SMSNumberValid === false) {
                    var smsNumber = primaryControl.getControl(OmniChannelPackage.SMSNumberConstants.NumberAttributeName);
                    if (OmniChannelPackage.TypeUtilities.IsNonNullObject(smsNumber) &&
                        OmniChannelPackage.TypeUtilities.IsFunction(smsNumber.setNotification) &&
                        primaryControl.data.isValid()) {
                        var invalidMessage = OmniChannelPackage.Localization.GetLocalizedString(OmniChannelPackage.SMSNumberLocalizationConstants.NumberInvalid);
                        if (OmniChannelPackage.TypeUtilities.IsNullOrWhitespace(invalidMessage)) {
                            invalidMessage = OmniChannelPackage.SMSNumberLocalizationConstants.NumberInvalid;
                        }
                        smsNumber.setNotification(invalidMessage, SMSConnectionValidation.validationNotificationId);
                        SMSConnectionValidation.validationNotificationsSet = true;
                    }
                }
            }
            function onJsonPromiseError(error) {
                Xrm.Navigation.openErrorDialog({
                    message: OmniChannelPackage.TypeUtilities.IsString(error) ? error : JSON.stringify(error),
                    errorCode: undefined,
                    details: undefined
                });
            }
        };
        SMSConnectionValidation.ReloadRibbon = function (executionContext) {
            var formContext = executionContext.getFormContext();
            formContext.ui.refreshRibbon();
        };
        SMSConnectionValidation.ClearValidationNotifications = function (executionContext) {
            if (!SMSConnectionValidation.validationNotificationsSet) {
                return;
            }
            var formContext = executionContext.getFormContext();
            clearSingleControl(formContext, OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.StreamSource);
            clearSingleControl(formContext, OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.CustomerId);
            clearSingleControl(formContext, OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.ApiKey);
            clearSingleControl(formContext, OmniChannelPackage.SMSNumberConstants.ProviderAttributeName);
            clearSingleControl(formContext, OmniChannelPackage.SMSNumberConstants.TypeAttributeName);
            clearSingleControl(formContext, OmniChannelPackage.SMSNumberConstants.NumberAttributeName);
            SMSConnectionValidation.validationNotificationsSet = false;
            function clearSingleControl(context, attributeName) {
                var control = context.getControl(attributeName);
                if (OmniChannelPackage.TypeUtilities.IsNonNullObject(control) && OmniChannelPackage.TypeUtilities.IsFunction(control.clearNotification)) {
                    control.clearNotification(SMSConnectionValidation.validationNotificationId);
                }
            }
        };
        SMSConnectionValidation.validateInputs = function (primaryControl) {
            if (!OmniChannelPackage.TypeUtilities.IsNonNullObject(primaryControl) ||
                !OmniChannelPackage.TypeUtilities.IsNonNullObject(primaryControl.entityReference) ||
                !OmniChannelPackage.TypeUtilities.IsNonNullObject(primaryControl.data) ||
                !OmniChannelPackage.TypeUtilities.IsNonNullObject(primaryControl.data.entity) ||
                !OmniChannelPackage.TypeUtilities.IsFunction(primaryControl.data.entity.getId) ||
                OmniChannelPackage.TypeUtilities.IsNullOrWhitespace(primaryControl.data.entity.getId(), primaryControl.entityReference.entityType)) {
                return false;
            }
            return true;
        };
        SMSConnectionValidation.createRequest = function (primaryControl, parent) {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    WorkStreamEntityReference: {
                        structuralProperty: 5,
                        typeName: OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.LiveWorkStream
                    },
                    SMSNumberEntityReference: {
                        structuralProperty: 5,
                        typeName: OmniChannelPackage.SMSNumberConstants.EntityName
                    },
                    Input: {
                        structuralProperty: 1,
                        typeName: "Edm.String"
                    }
                },
                operationName: OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.ValidateAction,
                operationType: 0
            };
            var input = {};
            if (OmniChannelPackage.TypeUtilities.IsNonNullObject(primaryControl.context) && OmniChannelPackage.TypeUtilities.IsFunction(primaryControl.context.getUserLcid, primaryControl.context.getOrgLcid)) {
                var orgLcid = primaryControl.context.getOrgLcid();
                if (!isNaN(orgLcid)) {
                    input.OrgLcid = orgLcid;
                }
            }
            if (OmniChannelPackage.TypeUtilities.IsNonNullObject(primaryControl.context) && OmniChannelPackage.TypeUtilities.IsFunction(primaryControl.context.getUserLcid, primaryControl.context.getUserLcid)) {
                var userLcid = primaryControl.context.getUserLcid();
                if (!isNaN(userLcid)) {
                    input.UserLcid = userLcid;
                }
            }
            var req = {
                getMetadata: function () { return metadata; }
            };
            SMSConnectionValidation.populateEntityInputs(primaryControl, req, input);
            if (primaryControl.entityReference.entityType === OmniChannelPackage.SMSNumberConstants.EntityName &&
                OmniChannelPackage.TypeUtilities.IsNonNullObject(parent) &&
                OmniChannelPackage.TypeUtilities.IsNonNullObject(parent.entityReference) &&
                parent.entityReference.entityType === OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.LiveWorkStream) {
                SMSConnectionValidation.populateEntityInputs(parent, req, input);
            }
            var inputParamaterName = "Input";
            req[inputParamaterName] = JSON.stringify(input);
            return req;
        };
        SMSConnectionValidation.populateEntityInputs = function (control, req, input) {
            var entityType = control.entityReference.entityType;
            var entityReference = {
                entityType: control.entityReference.entityType,
                id: control.entityReference.id
            };
            if (OmniChannelPackage.TypeUtilities.IsNullOrWhitespace(control.entityReference.id) &&
                OmniChannelPackage.TypeUtilities.IsNonNullObject(control.data) &&
                OmniChannelPackage.TypeUtilities.IsNonNullObject(control.data.entity) &&
                OmniChannelPackage.TypeUtilities.IsFunction(control.data.entity.getId)) {
                entityReference.id = control.data.entity.getId();
            }
            var entityKey = entityType === OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.LiveWorkStream ? "WorkStreamEntityReference" : "SMSNumberEntityReference";
            req[entityKey] = entityReference;
            if (!OmniChannelPackage.TypeUtilities.IsNonNullObject(control.data) ||
                !OmniChannelPackage.TypeUtilities.IsNonNullObject(control.data.entity) ||
                !OmniChannelPackage.TypeUtilities.IsFunction(control.data.entity.getIsDirty)) {
                return;
            }
            try {
                if (!control.data.entity.getIsDirty()) {
                    return;
                }
            }
            catch (err) {
                return;
            }
            if (!OmniChannelPackage.TypeUtilities.IsNonNullObject(control.data.entity.attributes) ||
                !OmniChannelPackage.TypeUtilities.IsFunction(control.data.entity.attributes.getAll)) {
                return;
            }
            var attributes = control.data.entity.attributes.getAll();
            if (!Array.isArray(attributes)) {
                return;
            }
            attributes.forEach(function (attribute) {
                if (!OmniChannelPackage.TypeUtilities.IsNonNullObject(attribute) ||
                    !OmniChannelPackage.TypeUtilities.IsFunction(attribute.getIsDirty, attribute.getName, attribute.getValue)) {
                    return;
                }
                try {
                    if (!attribute.getIsDirty()) {
                        return;
                    }
                }
                catch (err) {
                    return;
                }
                var attributeName = attribute.getName();
                if (OmniChannelPackage.TypeUtilities.IsNullOrWhitespace(attributeName)) {
                    return;
                }
                if (entityType === OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.LiveWorkStream) {
                    switch (attributeName) {
                        case OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.StreamSource:
                            input.StreamSource = attribute.getValue();
                            input.StreamSourceSet = true;
                            return;
                        case OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.CustomerId:
                            var customerId = attribute.getValue();
                            input.CustomerId = OmniChannelPackage.TypeUtilities.IsNullOrWhitespace(customerId) ? "" : customerId;
                            return;
                        case OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.ApiKey:
                            var apiKey = attribute.getValue();
                            input.APIKey = OmniChannelPackage.TypeUtilities.IsNullOrWhitespace(apiKey) ? "" : apiKey;
                            return;
                        case OmniChannelPackage.OmniChannelLiveWorkStreamSMSConstants.SMSProvider:
                            input.SMSProvider = attribute.getValue();
                            input.SMSProviderSet = true;
                            return;
                    }
                }
                else {
                    switch (attributeName) {
                        case OmniChannelPackage.SMSNumberConstants.ProviderAttributeName:
                            input.SMSProvider = attribute.getValue();
                            input.SMSProviderSet = true;
                            return;
                        case OmniChannelPackage.SMSNumberConstants.TypeAttributeName:
                            input.SMSNumberType = attribute.getValue();
                            input.SMSNumberTypeSet = true;
                            return;
                        case OmniChannelPackage.SMSNumberConstants.NumberAttributeName:
                            var value = attribute.getValue();
                            input.SMSNumber = OmniChannelPackage.TypeUtilities.IsNullOrWhitespace(value) ? "" : value;
                            return;
                    }
                }
            });
        };
        return SMSConnectionValidation;
    }());
    SMSConnectionValidation.validationNotificationId = "msdyn_smsconnectionvalidation_notificationid";
    SMSConnectionValidation.validationNotificationsSet = false;
    OmniChannelPackage.SMSConnectionValidation = SMSConnectionValidation;
})(OmniChannelPackage || (OmniChannelPackage = {}));
