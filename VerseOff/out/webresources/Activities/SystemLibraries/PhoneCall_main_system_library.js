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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var TelemetryLogger;
(function (TelemetryLogger) {
    var TelemetryConstants = (function () {
        function TelemetryConstants() {
        }
        return TelemetryConstants;
    }());
    TelemetryConstants.EventName = "EventName";
    TelemetryConstants.StartTime = "StartTime";
    TelemetryConstants.EndTime = "EndTime";
    TelemetryConstants.ExecutionTime = "ExecutionTime";
    TelemetryConstants.FeatureUsage = "Feature Usage";
    TelemetryConstants.JWT_REGEX = new RegExp(/eyJ[a-zA-Z0-9-_%]+\.eyJ[a-zA-Z0-9-_%]+\.[a-zA-Z0-9-_%]+/g);
    TelemetryConstants.SCRUBBED_PLACEHOLDER = "_scrubbedSensitiveData_";
    var TelemetryItem = (function () {
        function TelemetryItem(componentName, eventName) {
            this._componentName = componentName;
            this._eventName = eventName;
            this._traceInformation = ["Start"];
            this._traceWarning = [];
            this._traceError = [];
            this._traceCustom = {};
            this._event = this.createEvent();
        }
        TelemetryItem.prototype.traceEventInformation = function (message) {
            this._traceInformation.push(message);
        };
        TelemetryItem.prototype.traceEventWarning = function (message) {
            this._traceWarning.push(message);
        };
        TelemetryItem.prototype.traceEventError = function (name, exception) {
            this._traceError.push({ name: name, message: exception });
        };
        TelemetryItem.prototype.traceEventCustom = function (name, value) {
            if (this._traceCustom[name]) {
                this._traceCustom[name].push(value);
            }
            else {
                this._traceCustom[name] = [value];
            }
        };
        TelemetryItem.prototype.traceFeatureUsage = function (name, value) {
            this.traceEventCustom(TelemetryConstants.FeatureUsage, { name: name, value: value });
        };
        TelemetryItem.prototype.report = function () {
            if (!this._event) {
                return;
            }
            this.traceEventInformation("End");
            this.addEventParameter({ name: "Information", value: this._traceInformation });
            this.addEventParameter({ name: "Warnings", value: this._traceWarning });
            this.addEventParameter({ name: "Errors", value: this._traceError });
            for (var key in this._traceCustom) {
                this.addEventParameter({ name: key, value: this._traceCustom[key] });
            }
            this.updateEventExecutionTime();
            if (Xrm && Xrm.Reporting) {
                if (!this._traceError || this._traceError.length == 0) {
                    Xrm.Reporting.reportSuccess(this._componentName, this._event);
                }
                else {
                    Xrm.Reporting.reportFailure(this._componentName, Error(this._eventName), "Review the stacktrace and event context.", this._event);
                }
            }
        };
        TelemetryItem.prototype.scrubJWT = function (dataToBeScrubbed) {
            if (!dataToBeScrubbed) {
                return "";
            }
            if (typeof dataToBeScrubbed !== "string") {
                return "<REDACTED-NOT-A-STRING>";
            }
            if (dataToBeScrubbed.length > 1000000) {
                return "Message too long to sanitize. Length: " + dataToBeScrubbed.length;
            }
            try {
                return dataToBeScrubbed.replace(TelemetryConstants.JWT_REGEX, TelemetryConstants.SCRUBBED_PLACEHOLDER);
            }
            catch (exception) {
                return "Error during scrubJWT";
            }
        };
        TelemetryItem.prototype.createEvent = function () {
            var parameters = [];
            parameters.push({ name: TelemetryConstants.EventName, value: this._eventName });
            parameters.push({ name: TelemetryConstants.StartTime, value: new Date() });
            return parameters;
        };
        TelemetryItem.prototype.addEventParameter = function (parameter) {
            if (this._event != null && parameter.name != null && parameter.value != null) {
                this._event.push(parameter);
            }
        };
        TelemetryItem.prototype.updateEventExecutionTime = function () {
            if (!this._event || this._event.length < 2) {
                return;
            }
            var eventName = this._event[0].value;
            var start = this._event[1].value;
            if (!eventName || !start) {
                return;
            }
            var end = new Date();
            this.addEventParameter({ name: TelemetryConstants.EndTime, value: end });
            this.addEventParameter({ name: TelemetryConstants.ExecutionTime, value: end.valueOf() - start.valueOf() });
        };
        return TelemetryItem;
    }());
    TelemetryLogger.TelemetryItem = TelemetryItem;
})(TelemetryLogger || (TelemetryLogger = {}));
var Activities;
(function (Activities) {
    var ActivityPageHandler = (function () {
        function ActivityPageHandler() {
        }
        ActivityPageHandler.prototype.ActivityPageHandler = function () { };
        ActivityPageHandler.prototype.setDefaultValues = function (form, telemetryItem) {
            if (Activities.Common.Util.IsNewEntityForm(form)) {
                var ownerId = form.data.entity.attributes.get("ownerid");
                try {
                    if (!Activities.Common.Util.IsNull(ownerId) && Activities.Common.Util.IsNull(ownerId.getValue())) {
                        ownerId.setValue(this.getCurrentUser());
                    }
                }
                catch (exception) {
                    telemetryItem.traceEventError("Error setting default value.", exception.message);
                }
            }
        };
        ActivityPageHandler.prototype.getCurrentUser = function () {
            var lookupItems = new Array();
            var userContext = Xrm.Utility.getGlobalContext();
            var item = {
                id: userContext.userSettings.userId,
                name: userContext.userSettings.userName,
                entityType: "systemuser",
            };
            lookupItems.push(item);
            return lookupItems;
        };
        ActivityPageHandler.prototype.setOrganizer = function (form, telemetryItem) {
            try {
                var organizer = form.data.entity.attributes.get("organizer");
                if (!Activities.Common.Util.IsNull(organizer)) {
                    var ownerId = form.data.entity.attributes.get("ownerid");
                    if (!Activities.Common.Util.IsNull(ownerId) && !Activities.Common.Util.IsNull(ownerId.getValue())) {
                        organizer.setValue(ownerId.getValue());
                    }
                    else {
                        organizer.setValue(this.getCurrentUser());
                    }
                }
            }
            catch (exception) {
                telemetryItem.traceEventError("Error setting default value.", exception.message);
            }
        };
        ActivityPageHandler.insertSignature = function (form, signature, description, overwrite) {
            var isRTEv2 = false;
            if (Activities.Common.Util.isRTEV2EmailSignatureHandlingEnabled() && description.getValue()) {
                if (description.getValue().indexOf("ck-content") != -1) {
                    isRTEv2 = true;
                }
            }
            if (isRTEv2) {
                if (Activities.Common.Util.IsNullOrUndefined(description)) {
                    return;
                }
                var descriptionValue = description.getValue() ? description.getValue() : "<div></div>";
                var doc = new DOMParser().parseFromString(descriptionValue, "text/html");
                var newsignatureElement = doc.getElementById("newsignature");
                if (!Activities.Common.Util.IsNullOrUndefined(newsignatureElement)) {
                    overwrite = true;
                    newsignatureElement.id = "signature";
                }
                var signatureElement = doc.getElementById("signature");
                if (Activities.Common.Util.IsNullOrUndefined(signatureElement)) {
                    var signatureDoc = new DOMParser().parseFromString(signature, "text/html");
                    var signatureDivDataWrapper = signatureDoc.querySelector('div[data-wrapper="true"]');
                    var signatureDiv = document.createElement("div");
                    signatureDiv.id = "signature";
                    signatureDiv.appendChild(signatureDivDataWrapper);
                    if (Activities.Common.Util.addDirection()) {
                        var dir = Activities.Common.Util.getDirection();
                        signatureDiv.dir = dir;
                    }
                    if (doc && doc.body && doc.body.lastElementChild) {
                        var extraDiv = document.createElement("div");
                        doc.body.lastElementChild.appendChild(extraDiv);
                        doc.body.lastElementChild.appendChild(signatureDiv);
                    }
                    var emailBodyHtml = doc ? (doc.body ? doc.body.innerHTML : "") : "";
                    descriptionValue = Activities.Common.Util.IsNullOrEmptyString(emailBodyHtml)
                        ? signatureDiv.outerHTML
                        : emailBodyHtml;
                }
                else if (overwrite || Activities.Common.Util.IsNullOrEmptyString(signatureElement.innerHTML)) {
                    signatureElement.innerHTML = signature;
                    signatureElement.style.display = "block";
                    descriptionValue = doc ? (doc.body ? doc.body.innerHTML : "") : "";
                }
                description.setValue(descriptionValue);
            }
            else {
                if (Activities.Common.Util.IsNullOrUndefined(description)) {
                    return;
                }
                var descriptionValue = description.getValue() ? description.getValue() : "<div></div>";
                var doc = new DOMParser().parseFromString(descriptionValue, "text/html");
                var newsignatureElement = doc.getElementById("newsignature");
                if (!Activities.Common.Util.IsNullOrUndefined(newsignatureElement)) {
                    overwrite = true;
                    newsignatureElement.id = "signature";
                }
                var signatureElement = doc.getElementById("signature");
                if (Activities.Common.Util.IsNullOrUndefined(signatureElement)) {
                    var signatureDiv = '<div id="signature">' + signature + "</div>";
                    if (Activities.Common.Util.addDirection()) {
                        var dir = Activities.Common.Util.getDirection();
                        signatureDiv = "<div style=\"direction:" + dir + "\">" + signatureDiv + "</div>";
                    }
                    var emailBodyHtml = doc ? (doc.body ? doc.body.innerHTML : "") : "";
                    descriptionValue = Activities.Common.Util.IsNullOrEmptyString(emailBodyHtml)
                        ? signatureDiv
                        : emailBodyHtml.concat(signatureDiv);
                }
                else if (overwrite || Activities.Common.Util.IsNullOrEmptyString(signatureElement.innerHTML)) {
                    signatureElement.innerHTML = signature;
                    signatureElement.style.display = "block";
                    descriptionValue = doc ? (doc.body ? doc.body.innerHTML : "") : "";
                }
                description.setValue(descriptionValue);
            }
        };
        ActivityPageHandler.isSystemAdmin = function () {
            var context = Xrm.Utility.getGlobalContext();
            var roles = context.userSettings.roles;
            if (!Activities.Common.Util.IsNullOrUndefined(roles) && roles.getLength() > 0) {
                var rolesList = roles.get();
                for (var i = 0; i < rolesList.length; i++) {
                    if (rolesList[i].name == "System Administrator") {
                        return true;
                    }
                }
            }
            return false;
        };
        return ActivityPageHandler;
    }());
    Activities.ActivityPageHandler = ActivityPageHandler;
})(Activities || (Activities = {}));
var Activities;
(function (Activities) {
    var Common;
    (function (Common) {
        var Util;
        (function (Util) {
            function createCallBackFunction(func, parameters) {
                return function (retValue) {
                    parameters.unshift(retValue);
                    return func.apply(null, parameters);
                };
            }
            Util.createCallBackFunction = createCallBackFunction;
            function convertGuidToString(guid) {
                if (guid != null) {
                    guid = guid.replace("{", "").replace("}", "");
                }
                return guid;
            }
            Util.convertGuidToString = convertGuidToString;
            function isExecutionContextMissingAndReport(executionContext, telemetryItem) {
                if (IsNullOrUndefined(executionContext)) {
                    telemetryItem.traceEventError(Activities.Constants.TelemetryConstant.ExecutionContextMissing);
                    telemetryItem.report();
                }
            }
            Util.isExecutionContextMissingAndReport = isExecutionContextMissingAndReport;
            function IsNull(value) {
                return typeof value === "undefined" || typeof value === "unknown" || value == null;
            }
            Util.IsNull = IsNull;
            function IsNotNull(value) {
                return !IsNull(value);
            }
            Util.IsNotNull = IsNotNull;
            function IsNullOrEmptyString(str) {
                return Util.IsNull(str) || str == "";
            }
            Util.IsNullOrEmptyString = IsNullOrEmptyString;
            function IsNullOrUndefined(value) {
                return null == value || typeof value == "undefined";
            }
            Util.IsNullOrUndefined = IsNullOrUndefined;
            function IsNullOrWhiteSpace(value) {
                return Util.IsNullOrEmptyString(value) || value.trim() == "";
            }
            Util.IsNullOrWhiteSpace = IsNullOrWhiteSpace;
            function ShowMoCAOfflineError() {
                Activities.ClientApi.openAlertDialog(Activities.ClientApi.getResourceString("Error_Message_Generic_Mobile_Client_Offline"));
            }
            Util.ShowMoCAOfflineError = ShowMoCAOfflineError;
            function IsNullOrEmptyGuid(guid) {
                return IsNullOrEmptyString(guid) || convertGuidToString(guid) === Activities.Constants.EmptyGuidFormatted;
            }
            Util.IsNullOrEmptyGuid = IsNullOrEmptyGuid;
            function IsNewEntityForm(formContext) {
                return formContext.ui.getFormType() == 1;
            }
            Util.IsNewEntityForm = IsNewEntityForm;
            function GetEntityNames(records) {
                var activityEntityNames = {};
                for (var i = 0; i < records.length; i++) {
                    if (activityEntityNames[records[i].TypeName] == undefined)
                        activityEntityNames[records[i].TypeName] = [];
                }
                return activityEntityNames;
            }
            Util.GetEntityNames = GetEntityNames;
            function CheckIfIsReadOnlyInMobileClient(values) {
                var returnValue = false;
                for (var index = 0; index < values.length; index++) {
                    var value = values[index];
                    if (value["IsReadOnlyInMobileClient"] == true) {
                        returnValue = true;
                        break;
                    }
                }
                if (returnValue) {
                    var errorStrings = {
                        text: Activities.ClientApi.getResourceString("ReadOnlyEntity"),
                        confirmButtonLabel: Activities.ClientApi.getResourceString("Button_Ok"),
                    };
                    Xrm.Navigation.openAlertDialog(errorStrings);
                }
                return returnValue;
            }
            Util.CheckIfIsReadOnlyInMobileClient = CheckIfIsReadOnlyInMobileClient;
            function isOneDriveFCBEnabled(isUci) {
                if (isUci) {
                    return (Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.OneDriveIntegrationFCB) ||
                        Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_OneDriveIntegration));
                }
                else {
                    return Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.OneDriveIntegrationFCB);
                }
            }
            Util.isOneDriveFCBEnabled = isOneDriveFCBEnabled;
            function isEmailEnhancementsFeatureEnabled(featureFCBName) {
                if (Xrm.Internal.isUci()) {
                    return Xrm.Internal.isDisruptiveFeatureEnabled(featureFCBName, Activities.Constants.FCBConstant.April2020UpdateFCB);
                }
                else {
                    return (Xrm.Internal.isFeatureEnabled(featureFCBName) &&
                        Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.April2020UpdateFCB));
                }
            }
            Util.isEmailEnhancementsFeatureEnabled = isEmailEnhancementsFeatureEnabled;
            function isEmailEngagementFCBEnabled(isUci) {
                if (isUci) {
                    return (Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.EmailEngagementFCB) ||
                        Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_EmailEngagement));
                }
                else {
                    return Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.EmailEngagementFCB);
                }
            }
            Util.isEmailEngagementFCBEnabled = isEmailEngagementFCBEnabled;
            function isAllDayEventMidnightFCBEnabled(isUci) {
                if (isUci) {
                    return (Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_AllDayEventInUTCMidnight) ||
                        Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.AllDayEventInUTCMidnight));
                }
                else {
                    return Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_AllDayEventInUTCMidnight);
                }
            }
            Util.isAllDayEventMidnightFCBEnabled = isAllDayEventMidnightFCBEnabled;
            function isSharePointFCBEnabled(isUci) {
                if (isUci) {
                    return (Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.SharePointS2SFCB) ||
                        Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_SharePointS2S));
                }
                else {
                    return Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.SharePointS2SFCB);
                }
            }
            Util.isSharePointFCBEnabled = isSharePointFCBEnabled;
            function isCursorPositionFCBEnabled() {
                if (Xrm.Internal.isUci()) {
                    return Xrm.Internal.isDisruptiveFeatureEnabled(Activities.Constants.FCBConstant.InsertTemplateAtCursorPositionFCB, Activities.Constants.FCBConstant.October2021UpdateFCB);
                }
                return false;
            }
            Util.isCursorPositionFCBEnabled = isCursorPositionFCBEnabled;
            function isRecurrenceUciDialogFCBEnabled() {
                return (Xrm.Internal.isDisruptiveFeatureEnabled(Activities.Constants.FCBConstant.RecurringAppointmentUciFCB, Activities.Constants.FCBConstant.April2021UpdateFCB) ||
                    Xrm.Internal.isDisruptiveFeatureEnabled(Activities.Constants.FCBConstant.FCB_RecurringAppointmentUci, Activities.Constants.FCBConstant.April2021UpdateFCB));
            }
            Util.isRecurrenceUciDialogFCBEnabled = isRecurrenceUciDialogFCBEnabled;
            function isUpdatedDateValueParsingEnabled() {
                return (Xrm.Internal.isUci() &&
                    Xrm.Internal.isDisruptiveFeatureEnabled(Activities.Constants.FCBConstant.UpdateDateValueParsing, Activities.Constants.FCBConstant.October2021UpdateFCB));
            }
            Util.isUpdatedDateValueParsingEnabled = isUpdatedDateValueParsingEnabled;
            function isEmailEngagementAndOneDriveEnabledAtOrgLevel() {
                return (Xrm.Utility.getGlobalContext().organizationSettings.attributes["isonedriveenabled"] &&
                    Xrm.Utility.getGlobalContext().organizationSettings.attributes["isemailmonitoringallowed"]);
            }
            Util.isEmailEngagementAndOneDriveEnabledAtOrgLevel = isEmailEngagementAndOneDriveEnabledAtOrgLevel;
            function isMobile() {
                return Xrm.Utility.getGlobalContext().client.getClient().toString() === "Mobile";
            }
            Util.isMobile = isMobile;
            function isOutlook() {
                return Xrm.Utility.getGlobalContext().client.getClient().toString() === "Outlook";
            }
            Util.isOutlook = isOutlook;
            function isMailApp() {
                var contexts = Xrm && Xrm.ExternalContext ? Xrm.ExternalContext.getAvailableExternalContexts() : null;
                if (contexts && contexts.get("MAIL_CONTEXT")) {
                    return true;
                }
                return false;
            }
            Util.isMailApp = isMailApp;
            function isSendBulkEmailInUciEnabledAtOrgLevel() {
                var attrs = Xrm.Utility.getGlobalContext().organizationSettings.attributes;
                if (IsNullOrUndefined(attrs) || IsNullOrUndefined(attrs["sendbulkemailinuci"])) {
                    return false;
                }
                return attrs["sendbulkemailinuci"] == "1";
            }
            Util.isSendBulkEmailInUciEnabledAtOrgLevel = isSendBulkEmailInUciEnabledAtOrgLevel;
            function resolveSimilarUnresolvedAddresses() {
                var attrs = Xrm.Utility.getGlobalContext().organizationSettings.attributes;
                if (IsNullOrUndefined(attrs) || IsNullOrUndefined(attrs["resolvesimilarunresolvedemailaddress"])) {
                    return true;
                }
                return attrs["resolvesimilarunresolvedemailaddress"] == "1";
            }
            Util.resolveSimilarUnresolvedAddresses = resolveSimilarUnresolvedAddresses;
            function allowUnresolvedPartiesOnEmailSend() {
                var attrs = Xrm.Utility.getGlobalContext().organizationSettings.attributes;
                if (IsNullOrUndefined(attrs) || IsNullOrUndefined(attrs["allowunresolvedpartiesonemailsend"])) {
                    return false;
                }
                return attrs["allowunresolvedpartiesonemailsend"] == "1";
            }
            Util.allowUnresolvedPartiesOnEmailSend = allowUnresolvedPartiesOnEmailSend;
            function orgEmailConnectionChannel() {
                var attrs = Xrm.Utility.getGlobalContext().organizationSettings.attributes;
                if (IsNullOrUndefined(attrs) || IsNullOrUndefined(attrs["emailconnectionchannel"])) {
                    return 0;
                }
                return attrs["emailconnectionchannel"] == "0" ? 0 : 1;
            }
            Util.orgEmailConnectionChannel = orgEmailConnectionChannel;
            function isDocumentManagementEnabled() {
                return Xrm.Utility.getEntityMetadata("email").then(function (res) {
                    return res.IsDocumentManagementEnabled;
                }, function (err) {
                    return false;
                });
            }
            Util.isDocumentManagementEnabled = isDocumentManagementEnabled;
            function isEmailEngagementActionsFCBEnabled(isUci) {
                if (isUci) {
                    return (Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.EmailEngagementActionFCB) ||
                        Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_EmailEngagementAction));
                }
                else {
                    return Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.EmailEngagementActionFCB);
                }
            }
            Util.isEmailEngagementActionsFCBEnabled = isEmailEngagementActionsFCBEnabled;
            function isMailboxDialogFCBEnabled() {
                return (Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.MailboxEnabledDialogFCB) ||
                    Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_MailboxEnabledDialog));
            }
            Util.isMailboxDialogFCBEnabled = isMailboxDialogFCBEnabled;
            function isSafeDescriptionInEmailUCIEnabled() {
                return (Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.SafeDescriptionInEmailUCIFCB) ||
                    Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_SafeDescriptionInEmailUCI));
            }
            Util.isSafeDescriptionInEmailUCIEnabled = isSafeDescriptionInEmailUCIEnabled;
            function isRTEV2EmailSignatureHandlingEnabled() {
                return (Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_ReplaceRTEv1WithRTEv2) &&
                    Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_RTEV2EmailSignatureHandling));
            }
            Util.isRTEV2EmailSignatureHandlingEnabled = isRTEV2EmailSignatureHandlingEnabled;
            function isRTEV2InsertTemplateHandlingEnabled() {
                return (Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_RTEV2InsertTemplateHandling));
            }
            Util.isRTEV2InsertTemplateHandlingEnabled = isRTEV2InsertTemplateHandlingEnabled;
            function isResolveUnknownEmailsFCBEnabled() {
                if (Xrm.Internal.isUci()) {
                    return (!Activities.ClientApi.IsMocaOffline() &&
                        Xrm.Internal.isDisruptiveFeatureEnabled(Activities.Constants.FCBConstant.UnresolvedEmailAddressFeatureFCB, Activities.Constants.FCBConstant.April2020UpdateFCB));
                }
                return false;
            }
            Util.isResolveUnknownEmailsFCBEnabled = isResolveUnknownEmailsFCBEnabled;
            function isDeleteDraftEmailIfNotEditedByUserEnabled() {
                return (Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_DeleteDraftEmailIfNotEditedByUser));
            }
            Util.isDeleteDraftEmailIfNotEditedByUserEnabled = isDeleteDraftEmailIfNotEditedByUserEnabled;
            function enableActivitiesTimeLinePerfImprovement(stage) {
                if (Xrm.Internal.isUci()) {
                    var perfOrgDbOrgSettings = +this.getOrgDbOrgSettingValue(Activities.Constants.PerfConstants.PerfOrgDbOrgSettings, "0");
                    return (perfOrgDbOrgSettings & stage) == stage;
                }
                else {
                    return false;
                }
            }
            Util.enableActivitiesTimeLinePerfImprovement = enableActivitiesTimeLinePerfImprovement;
            function isFCBEnabled(FCBName, ReleaseWaveFCB) {
                if (Xrm.Internal.isUci()) {
                    if (ReleaseWaveFCB != null) {
                        return Xrm.Internal.isDisruptiveFeatureEnabled(FCBName, ReleaseWaveFCB);
                    }
                    return Xrm.Internal.isFeatureEnabled(FCBName);
                }
                return false;
            }
            Util.isFCBEnabled = isFCBEnabled;
            function isFCB_RemoveUpdateFromReplyForwardEmailEnabled() {
                return Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_RemoveUpdateFromReplyForwardEmail);
            }
            Util.isFCB_RemoveUpdateFromReplyForwardEmailEnabled = isFCB_RemoveUpdateFromReplyForwardEmailEnabled;
            function EnableEmailEditInMoca() {
                if (Xrm.Internal.isUci()) {
                    return (!Activities.ClientApi.IsMocaOffline() &&
                        Xrm.Internal.isDisruptiveFeatureEnabled(Activities.Constants.FCBConstant.EnableEmailEditInMocaFCB, Activities.Constants.FCBConstant.October2020UpdateFCB));
                }
                return false;
            }
            Util.EnableEmailEditInMoca = EnableEmailEditInMoca;
            function isEmailTemplatePreviewFeatureOn(xrmPage) {
                var limitedHeight = 400;
                var limitedWidth = 650;
                var offset = 225;
                var pageHeight = xrmPage.ui.getViewPortHeight() + offset;
                var pageWidth = xrmPage.ui.getViewPortWidth() + offset;
                if (Xrm.Internal.isUci()) {
                    return (Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_April2020Update) &&
                        Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_EmailTemplatePreviewEnhancementsEnabled) &&
                        pageHeight > limitedHeight &&
                        pageWidth > limitedWidth);
                }
                return false;
            }
            Util.isEmailTemplatePreviewFeatureOn = isEmailTemplatePreviewFeatureOn;
            function isRTEReadyEventEnableOnSignature() {
                return Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_EnableRTEReadyForDefaultSignature) &&
                    Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_RTEEmitEditorReadyEvent);
            }
            Util.isRTEReadyEventEnableOnSignature = isRTEReadyEventEnableOnSignature;
            function isActivitiesFeatureEnable(featureName, defaultValue) {
                var activitiesFeatureEnableSettings = +this.getOrgDbOrgSettingValue(Activities.Constants.ActivitiesFeature.ActivitiesFeatureOrgDbOrgSettings, defaultValue);
                return (activitiesFeatureEnableSettings & featureName) == featureName;
            }
            Util.isActivitiesFeatureEnable = isActivitiesFeatureEnable;
            function enableInsertSignatureInUCI() {
                if (Xrm.Internal.isUci()) {
                    return this.isActivitiesFeatureEnable(Activities.Constants.ActivitiesFeature.ActivitiesFeatureList.EnableInsertSignatureInUCI, Activities.Constants.OrgSettingsConstant.InsertSignatureFeatureBitValue);
                }
                else {
                    return false;
                }
            }
            Util.enableInsertSignatureInUCI = enableInsertSignatureInUCI;
            function enableDynamicTextForSignature() {
                return Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_October2022Update) &&
                    Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_EnableDynamicTextForEmailSignature);
            }
            Util.enableDynamicTextForSignature = enableDynamicTextForSignature;
            function disableAllControls(executionContext) {
                var formContext = executionContext.getFormContext();
                var controls = formContext && formContext.ui.controls;
                controls &&
                    controls.forEach(function (control) {
                        control.setDisabled(true);
                    });
                var allTabs = formContext && formContext.ui.tabs;
                allTabs &&
                    allTabs.forEach(function (tab) {
                        var allSections = executionContext.getFormContext().ui.tabs.get(tab.getName()).sections;
                        allSections.forEach(function (section) {
                            var allControlsForSection = section.controls;
                            for (var i = 0; i < allControlsForSection.getLength(); i++) {
                                var control = allControlsForSection.getByIndex(i);
                                control.setDisabled(true);
                            }
                        });
                    });
            }
            Util.disableAllControls = disableAllControls;
            function showSpecificSectionOnly(executionContext, tabName, sectionName) {
                var allTabs = executionContext.getFormContext().ui.tabs;
                var BasicTabSections = allTabs.getByName(tabName).sections;
                BasicTabSections.forEach(function (section) {
                    if (section._controlName != sectionName) {
                        section.setVisible(false);
                    }
                });
            }
            Util.showSpecificSectionOnly = showSpecificSectionOnly;
            function addDirection() {
                return Xrm.Internal.isUci() && Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.FCB_EmailRTLDirectionInUCI);
            }
            Util.addDirection = addDirection;
            function getDirection() {
                return Xrm.Utility.getGlobalContext() &&
                    Xrm.Utility.getGlobalContext().userSettings &&
                    Xrm.Utility.getGlobalContext().userSettings.isRTL
                    ? "rtl"
                    : "ltr";
            }
            Util.getDirection = getDirection;
            function getfontSizeStyleString() {
                return "9pt";
            }
            Util.getfontSizeStyleString = getfontSizeStyleString;
            function getfontFamilyStyleString() {
                return "'Segoe UI','Helvetica Neue',sans-serif";
            }
            Util.getfontFamilyStyleString = getfontFamilyStyleString;
            function getOrgDbOrgSettingValue(orgDbOrgSettingName, defaultValue) {
                if (IsNullOrEmptyString(orgDbOrgSettingName) || Activities.ClientApi.IsMocaOffline()) {
                    return defaultValue;
                }
                var xmlParser = new DOMParser();
                if (ActivityHelper.orgDbOrgSettingsXml === undefined) {
                    try {
                        var attrs = Xrm.Utility.getGlobalContext().organizationSettings.attributes;
                        if (Xrm.Internal.isUci()) {
                            if (!IsNullOrUndefined(attrs)) {
                                ActivityHelper.orgDbOrgSettingsXml = attrs["orgdborgsettings"]
                                    ? xmlParser.parseFromString(attrs["orgdborgsettings"], "text/xml")
                                    : null;
                            }
                            else {
                                return defaultValue;
                            }
                        }
                        else {
                            if (!IsNullOrUndefined(attrs)) {
                                ActivityHelper.orgDbOrgSettingsXml = attrs.orgDBOrgSettings
                                    ? xmlParser.parseFromString(attrs.orgDBOrgSettings, "text/xml")
                                    : null;
                            }
                        }
                    }
                    catch (Exception) {
                        return defaultValue;
                    }
                }
                var orgDbOrgSettingsXml = ActivityHelper.orgDbOrgSettingsXml;
                if (Common.Util.IsNullOrUndefined(orgDbOrgSettingsXml) || orgDbOrgSettingsXml.documentElement == null) {
                    return defaultValue;
                }
                var orgDbOrgSettingNode = orgDbOrgSettingsXml.documentElement.getElementsByTagName(orgDbOrgSettingName);
                return orgDbOrgSettingNode == null || orgDbOrgSettingNode.length <= 0
                    ? null
                    : orgDbOrgSettingNode[0].textContent == null
                        ? null
                        : orgDbOrgSettingNode[0].textContent.toLowerCase();
            }
            Util.getOrgDbOrgSettingValue = getOrgDbOrgSettingValue;
            function sendRequest(url, addOdataHeaders, telemetryItem) {
                return new Promise(function (resolve, reject) {
                    var request = new XMLHttpRequest();
                    request.open(Activities.Constants.ApiConstants.HTTPMethods.GET, url);
                    if (addOdataHeaders) {
                        request.setRequestHeader("odata-maxversion", "4.0");
                        request.setRequestHeader("odata-version", "4.0");
                        request.setRequestHeader("prefer", 'odata.include-annotations="*"');
                    }
                    request.onreadystatechange = function () {
                        if (request.readyState === 4) {
                            var responseBodyInAPromise = function () {
                                return Promise.resolve(JSON.parse(request.responseText));
                            };
                            var isSuccess = request.status === 200;
                            resolve({
                                ok: isSuccess,
                                status: request.status,
                                statusText: request.statusText,
                                json: responseBodyInAPromise,
                                text: responseBodyInAPromise,
                                url: url,
                            });
                            reject = function (error) {
                                telemetryItem.traceEventError("Exception occured while executing XHR request: " + error);
                                reject(error);
                            };
                        }
                    };
                    request.send();
                });
            }
            Util.sendRequest = sendRequest;
            function parseJsonResponse(response, telemetryItem) {
                return Promise.resolve().then(function () {
                    if (!response) {
                        telemetryItem.traceEventError("Null response from server for request : " + response.url);
                    }
                    else {
                        var contentTypeHeader = getHttpHeader(response.headers, "Content-Type");
                        if (contentTypeHeader && contentTypeHeader.indexOf("text/html") > -1) {
                            return response.text().then(function (text) {
                                telemetryItem.traceEventError("Server returned an HTML error response: " + text);
                            });
                        }
                        else {
                            return response.json();
                        }
                    }
                });
            }
            Util.parseJsonResponse = parseJsonResponse;
            function getHttpHeader(headers, headerName) {
                if (!headers) {
                    return null;
                }
                var headerValue = headers.get(headerName);
                if (!headerValue) {
                    headerValue = headers.get(headerName.toLowerCase());
                }
                return headerValue;
            }
            function getRelationshipsMetadataForLookups(referencingEntityName, attributeNameValuePairs, telemetryItem, addOwnerFilter, isActivity) {
                if (addOwnerFilter === void 0) { addOwnerFilter = false; }
                if (isActivity === void 0) { isActivity = true; }
                var filterStart = "&$filter=(";
                var filterEnd = ")";
                var referencingEntityFilter = "ReferencingEntity eq '" + referencingEntityName + "'";
                var attributeFilters;
                var filter;
                var url = Xrm.Utility.getGlobalContext().getClientUrl() +
                    "/api/data/v9.0/RelationshipDefinitions/Microsoft.Dynamics.CRM.OneToManyRelationshipMetadata?$select=ReferencingEntityNavigationPropertyName,ReferencingAttribute,ReferencingEntity,ReferencedEntity";
                for (var attributeName in attributeNameValuePairs) {
                    if (IsNullOrUndefined(attributeNameValuePairs[attributeName]) || attributeName === "ownerid") {
                        continue;
                    }
                    var attributeFilter = "(ReferencedEntity eq '" +
                        attributeNameValuePairs[attributeName][0].entityType +
                        "'" +
                        " and ReferencingAttribute eq '" +
                        attributeName +
                        "')";
                    if (IsNullOrUndefined(attributeFilters)) {
                        attributeFilters = attributeFilter;
                    }
                    else {
                        attributeFilters += " or " + attributeFilter;
                    }
                }
                filter = filterStart;
                if (!IsNullOrUndefined(attributeFilters)) {
                    filter += "(" + referencingEntityFilter + " and (" + attributeFilters + "))";
                }
                if (addOwnerFilter) {
                    var referencingEntity = isActivity ? "activitypointer" : referencingEntityName;
                    if (!IsNullOrUndefined(attributeFilters)) {
                        filter += "or ";
                    }
                    filter +=
                        "(ReferencingEntity eq '" +
                            referencingEntity +
                            "' and ReferencedEntity eq 'owner' and ReferencingAttribute eq 'ownerid')";
                }
                filter += filterEnd;
                if (filter.length === "&$filter=()".length) {
                }
                else {
                    url += filter;
                }
                telemetryItem.traceEventInformation("Url for relationship metadata query: " + url);
                return Activities.Common.Util.sendRequest(url, true, telemetryItem);
            }
            Util.getRelationshipsMetadataForLookups = getRelationshipsMetadataForLookups;
            function tryGetErrorMessage(error) {
                if (!IsNullOrUndefined(error.innerror) && !IsNullOrUndefined(error.innerror.message)) {
                    return error.innerror.message;
                }
                else if (!IsNullOrUndefined(error.message)) {
                    return error.message;
                }
                return error;
            }
            Util.tryGetErrorMessage = tryGetErrorMessage;
            function getAttachmentIdsFromEmailBody(body) {
                var mimeAttachmentIds = [];
                if (body) {
                    var downloadUriRegex = /img[^>]+src=[^>]+&attachmentid=(.+?)("|')/gi;
                    var dataAttachmentIdRegex = /img[^>]+data-attachment-id[^>]+?("|')([^'"]+?)("|')/gi;
                    if (!Xrm.Internal.isFeatureEnabled(Activities.Constants.FCBConstant.SSSUseOfficeApiToFilterUnSafeContentFCB)) {
                        dataAttachmentIdRegex = /img[^>]+data-attachment-id[^>]+?("|')?([^'"]+?)(\"|\'|>|\\s)/gi;
                    }
                    var match = void 0;
                    while ((match = downloadUriRegex.exec(body)) != null) {
                        mimeAttachmentIds.push(match[1]);
                    }
                    while ((match = dataAttachmentIdRegex.exec(body)) != null) {
                        mimeAttachmentIds.push(match[2]);
                    }
                }
                return mimeAttachmentIds;
            }
            Util.getAttachmentIdsFromEmailBody = getAttachmentIdsFromEmailBody;
            function getMaskToSameWeekDayMapping(daysOfWeekMask) {
                switch (daysOfWeekMask) {
                    case 1:
                        return Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Sunday;
                    case 2:
                        return Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Monday;
                    case 4:
                        return Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Tuesday;
                    case 8:
                        return Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Wednesday;
                    case 16:
                        return Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Thursday;
                    case 32:
                        return Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Friday;
                    case 64:
                        return Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Saturday;
                    case 65:
                        return Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Weekend;
                    case 62:
                        return Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Weekday;
                    default:
                        return Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Day;
                }
            }
            Util.getMaskToSameWeekDayMapping = getMaskToSameWeekDayMapping;
            function getSameWeekDayToMaskMapping(day) {
                switch (day) {
                    case Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Sunday:
                        return 1;
                    case Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Monday:
                        return 2;
                    case Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Tuesday:
                        return 4;
                    case Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Wednesday:
                        return 8;
                    case Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Thursday:
                        return 16;
                    case Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Friday:
                        return 32;
                    case Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Saturday:
                        return 64;
                    case Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Weekend:
                        return 65;
                    case Activities.Constants.MetadataDrivenDialogConstants.SameWeekDayOptions.Weekday:
                        return 62;
                    default:
                        return 127;
                }
            }
            Util.getSameWeekDayToMaskMapping = getSameWeekDayToMaskMapping;
            function getFeatureControlSetting(namespace, featureName) {
                var fcsValue = (Xrm.Utility.getGlobalContext()).getFeatureControlSetting(namespace, featureName);
                if (!Common.Util.IsNullOrUndefined(fcsValue)) {
                    return fcsValue;
                }
                return false;
            }
            Util.getFeatureControlSetting = getFeatureControlSetting;
            function getPowerPlatformAppSetting(appSettingName) {
                var appSettingValue = (Xrm.Utility.getGlobalContext()).getCurrentAppSetting(appSettingName);
                if (!Common.Util.IsNullOrUndefined(appSettingValue)) {
                    return appSettingValue;
                }
                return false;
            }
            Util.getPowerPlatformAppSetting = getPowerPlatformAppSetting;
            function isCurrentAppMultiSession() {
                var _this = this;
                return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var globalContext;
                    return __generator(this, function (_a) {
                        if (Xrm.App.sessions) {
                            resolve(true);
                        }
                        else {
                            globalContext = Xrm.Utility.getGlobalContext();
                            globalContext.getCurrentAppProperties().then(function success(app) {
                                Xrm.WebApi.retrieveRecord(Activities.Constants.ApiConstants.AppModule, app.appId, "?$select=" + Activities.Constants.ApiConstants.Fields.NavigationType.FieldName).then(function (result) {
                                    if (result.navigationtype == Activities.Constants.ApiConstants.Fields.NavigationType.Type.MultiSession) {
                                        resolve(true);
                                    }
                                    else {
                                        resolve(false);
                                    }
                                }, function errorCallback() {
                                    reject(false);
                                });
                            });
                        }
                        return [2 /*return*/];
                    });
                }); });
            }
            Util.isCurrentAppMultiSession = isCurrentAppMultiSession;
            function isGuardRailValidationSettingsEnabled() {
                var _this = this;
                return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var isGuardRailSettingsEnabled, filterQuery;
                    return __generator(this, function (_a) {
                        isGuardRailSettingsEnabled = sessionStorage.getItem(Activities.Constants.GovernanceAgent.GovernanceAgentEnabledKey);
                        if (isGuardRailSettingsEnabled != null) {
                            resolve(isGuardRailSettingsEnabled === 'true');
                            return [2 /*return*/];
                        }
                        filterQuery = "?$filter=msdyn_governanceagent_statusid eq '" + Activities.Constants.GovernanceAgent.GovernanceSettingsId + "' and " + Activities.Constants.GovernanceAgent.IsEnabled + " eq true&$select=" + Activities.Constants.GovernanceAgent.IsEnabled;
                        Xrm.WebApi.retrieveMultipleRecords(Activities.Constants.GovernanceAgent.GovernanceSettingsName, filterQuery).then(function (result) {
                            if (result && result.entities && result.entities.length > 0) {
                                sessionStorage.setItem(Activities.Constants.GovernanceAgent.GovernanceAgentEnabledKey, 'true');
                                resolve(true);
                            }
                            else {
                                sessionStorage.setItem(Activities.Constants.GovernanceAgent.GovernanceAgentEnabledKey, 'false');
                                resolve(false);
                            }
                        }, function errorCallback(error) {
                            var isPrivilegeError = (error.errorCode === Activities.Constants.ErrorCodes.PrivilegeErrorCode ||
                                error.code === Activities.Constants.ErrorCodes.PrivilegeErrorCode);
                            if (isPrivilegeError) {
                                sessionStorage.setItem(Activities.Constants.GovernanceAgent.GovernanceAgentEnabledKey, 'false');
                            }
                            reject(false);
                        });
                        return [2 /*return*/];
                    });
                }); });
            }
            Util.isGuardRailValidationSettingsEnabled = isGuardRailValidationSettingsEnabled;
            function dataForSensitivityLabelsUsingCustomAction(telemetryItemForSensitivityLabels) {
                var req = new DefaultSensitivityLabels();
                return Xrm.WebApi.execute(req).then(function success(response) {
                    if (response.ok) {
                        return response.json().then(function (data) {
                            if (data) {
                                return data;
                            }
                            else {
                                return null;
                            }
                        });
                    }
                    else {
                        return null;
                    }
                }, function error(error) {
                    telemetryItemForSensitivityLabels.traceEventError("Sensitivity Labels Traces", "Error in executing custom action to get sensitivity label settings: " + error.message);
                    return null;
                });
            }
            Util.dataForSensitivityLabelsUsingCustomAction = dataForSensitivityLabelsUsingCustomAction;
            function getSensitivityLabelWithHighestPriority(defaultLabelIdFromCustomAction, retrievedParentLabelId, telemetryItemForSensitivityLabels) {
                return __awaiter(this, void 0, void 0, function () {
                    var selectFields, queryString, response, matchingLabels, defaultLabel, retrievedLabel, defaultPriority, retrievedPriority, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                selectFields = "sensitivitylabelid,priority,displayname,parentsensitivitylabelid";
                                queryString = "?$select=" + selectFields;
                                return [4 /*yield*/, Xrm.WebApi.retrieveMultipleRecords("sensitivitylabel", queryString)];
                            case 1:
                                response = _a.sent();
                                if (response && response.entities && response.entities.length > 0) {
                                    matchingLabels = response.entities.filter(function (label) {
                                        return label.sensitivitylabelid === defaultLabelIdFromCustomAction ||
                                            label.sensitivitylabelid === retrievedParentLabelId;
                                    });
                                    if (matchingLabels.length === 0) {
                                        return [2 /*return*/, Promise.resolve(undefined)];
                                    }
                                    if (matchingLabels.length === 1) {
                                        return [2 /*return*/, matchingLabels[0]];
                                    }
                                    defaultLabel = matchingLabels.find(function (label) { return label.sensitivitylabelid === defaultLabelIdFromCustomAction; });
                                    retrievedLabel = matchingLabels.find(function (label) { return label.sensitivitylabelid === retrievedParentLabelId; });
                                    defaultPriority = defaultLabel ? (defaultLabel.priority || 0) : 0;
                                    retrievedPriority = retrievedLabel ? (retrievedLabel.priority || 0) : 0;
                                    if (retrievedPriority > defaultPriority) {
                                        return [2 /*return*/, retrievedLabel];
                                    }
                                    else {
                                        return [2 /*return*/, defaultLabel];
                                    }
                                }
                                telemetryItemForSensitivityLabels.traceEventError("Sensitivity Labels Traces", "No sensitivity labels found in the system.");
                                return [2 /*return*/, Promise.resolve(undefined)];
                            case 2:
                                error_1 = _a.sent();
                                telemetryItemForSensitivityLabels.traceEventError("Sensitivity Labels Traces", "Error retrieving sensitivity labels: " + error_1.message);
                                return [2 /*return*/, Promise.resolve(undefined)];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
            Util.getSensitivityLabelWithHighestPriority = getSensitivityLabelWithHighestPriority;
            function getSensitivityLabelDetails(sensitivitylabelId, telemetryItemForSensitivityLabels) {
                return __awaiter(this, void 0, void 0, function () {
                    var filterQuery, selectFields, queryString, response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                filterQuery = "(sensitivitylabelid eq '" + sensitivitylabelId + "')";
                                selectFields = "sensitivitylabelid,priority,displayname,parentsensitivitylabelid";
                                queryString = "?$filter=" + filterQuery + "&$select=" + selectFields + "&$top=1";
                                return [4 /*yield*/, Xrm.WebApi.retrieveMultipleRecords("sensitivitylabel", queryString)];
                            case 1:
                                response = _a.sent();
                                if (response && response.entities && response.entities.length > 0) {
                                    return [2 /*return*/, response.entities[0]];
                                }
                                telemetryItemForSensitivityLabels.traceEventError("Sensitivity Labels Traces", "No sensitivity label found for the given ID - " + sensitivitylabelId);
                                return [2 /*return*/, Promise.resolve(undefined)];
                        }
                    });
                });
            }
            Util.getSensitivityLabelDetails = getSensitivityLabelDetails;
        })(Util = Common.Util || (Common.Util = {}));
        var DefaultSensitivityLabels = (function () {
            function DefaultSensitivityLabels() {
            }
            DefaultSensitivityLabels.prototype.getMetadata = function () {
                var metadata = {
                    boundParameter: undefined,
                    parameterTypes: {},
                    operationType: 0,
                    operationName: "GetPurviewSensitivityPolicySettings",
                };
                return metadata;
            };
            return DefaultSensitivityLabels;
        }());
        Common.DefaultSensitivityLabels = DefaultSensitivityLabels;
        var ActivityHelper = (function () {
            function ActivityHelper() {
            }
            ActivityHelper.setFocusToSubject = function (form, telemetryItem) {
                try {
                    var subjectControl = form.ui.controls.get("subject");
                    subjectControl.setFocus();
                }
                catch (exception) {
                    telemetryItem.traceEventError("Error setting focus to subject control.", exception.message);
                }
            };
            ActivityHelper.setOwner = function (formContext, telemetryItem) {
                var ownerId = formContext.getAttribute("ownerid");
                try {
                    if (Common.Util.IsNotNull(ownerId) &&
                        (Common.Util.IsNullOrUndefined(ownerId.getValue()) || ownerId.getValue().length == 0) &&
                        formContext.ui.getFormType() !== 2) {
                        ownerId.setValue(ActivityHelper.getCurrentUser());
                    }
                }
                catch (exception) {
                    telemetryItem.traceEventError("Error setting owner value.", exception.message);
                }
            };
            ActivityHelper.setOrganizer = function (formContext, telemetryItem) {
                try {
                    var organizer = formContext.getAttribute("organizer");
                    if (organizer &&
                        (Common.Util.IsNullOrUndefined(organizer.getValue()) || organizer.getValue().length == 0) &&
                        formContext.ui.getFormType() !== 2) {
                        var ownerId = formContext.getAttribute("ownerid");
                        if (ownerId && ownerId.getValue()) {
                            telemetryItem.traceEventInformation("Organizer value is set as obtained from the FORM");
                            organizer.setValue(ownerId.getValue());
                        }
                        else {
                            telemetryItem.traceEventInformation("Organizer value is set as current user, since not obtained from the FORM");
                            organizer.setValue(ActivityHelper.getCurrentUser());
                        }
                    }
                }
                catch (exception) {
                    telemetryItem.traceEventError("Error setting organizer value.", exception.message);
                }
            };
            ActivityHelper.getCurrentUser = function () {
                var owner = [];
                owner.push({
                    id: Xrm.Utility.getGlobalContext().userSettings.userId,
                    name: Xrm.Utility.getGlobalContext().userSettings.userName,
                    entityType: "systemuser",
                });
                return owner;
            };
            ActivityHelper.getParticipationTypeMask = function (entityName, columnName) {
                var participationTypeMask = {
                    appointment: { optionalattendees: 6, organizer: 7, requiredattendees: 5, related: 13 },
                    campaignactivity: { partners: 1, from: 1 },
                    campaignresponse: { customer: 11, partner: 11, from: 11 },
                    email: { bcc: 4, cc: 3, from: 1, to: 2 },
                    fax: { from: 1, to: 2 },
                    letter: { bcc: 4, from: 1, to: 2 },
                    phonecall: { from: 1, to: 2, related: 13 },
                    recurringappointmentmaster: { optionalattendees: 6, organizer: 7, requiredattendees: 5, related: 13 },
                    serviceappointment: { customers: 11, resources: 10 },
                };
                var entityMasksTypes = participationTypeMask[entityName];
                if (!entityMasksTypes) {
                    return null;
                }
                return entityMasksTypes[columnName];
            };
            ActivityHelper.convertServerTimeToUserLocalTime = function (datetime) {
                datetime = new Date(datetime);
                if (Xrm.Internal.isUci())
                    datetime.setMinutes(datetime.getMinutes() +
                        datetime.getTimezoneOffset() +
                        Xrm.Utility.getGlobalContext().userSettings.getTimeZoneOffsetMinutes());
                return datetime;
            };
            ActivityHelper.convertUserLocalTimeToServerTime = function (datetime) {
                datetime = new Date(datetime);
                if (Xrm.Internal.isUci())
                    datetime.setMinutes(datetime.getMinutes() -
                        datetime.getTimezoneOffset() -
                        Xrm.Utility.getGlobalContext().userSettings.getTimeZoneOffsetMinutes());
                return datetime;
            };
            ActivityHelper.setAttributeValue = function (eventContext, attributeId, value) {
                var attribute = eventContext
                    .getFormContext()
                    .data.attributes.get(attributeId);
                if (attribute != null) {
                    attribute.setValue(value);
                }
            };
            ActivityHelper.closeDialog = function (eventContext) {
                var lastButtonClicked = eventContext
                    .getFormContext()
                    .data.attributes.get(Activities.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked);
                if (lastButtonClicked != null) {
                    lastButtonClicked.setValue(Activities.Constants.MetadataDrivenDialogConstants.DialogCancelId);
                }
                eventContext.getFormContext().ui.close();
            };
            return ActivityHelper;
        }());
        Common.ActivityHelper = ActivityHelper;
    })(Common = Activities.Common || (Activities.Common = {}));
})(Activities || (Activities = {}));
var Activities;
(function (Activities) {
    var Constants;
    (function (Constants) {
        Constants.EmptyGuid = "{00000000-0000-0000-0000-000000000000}";
        Constants.EmptyGuidFormatted = "00000000-0000-0000-0000-000000000000";
        var ViewGuids;
        (function (ViewGuids) {
            ViewGuids.MyEmailTemplateView = "{4C7BE207-CC89-4BB7-BB61-BBD5076D05C0}";
            ViewGuids.GlobalEmailTemplateView = "{4D5BE2E9-6828-482b-99AA-2387AFED7B37}";
            ViewGuids.AllLanguageEmailTemplateView = "{DAF88706-1DAD-4810-ADC4-1517ED39F575}";
        })(ViewGuids = Constants.ViewGuids || (Constants.ViewGuids = {}));
        var EntityNames;
        (function (EntityNames) {
            EntityNames.Appointment = "appointment";
            EntityNames.ServiceAppointment = "serviceappointment";
            EntityNames.RecurringAppointmentMaster = "recurringappointmentmaster";
            EntityNames.Email = "email";
            EntityNames.Fax = "fax";
            EntityNames.Letter = "letter";
            EntityNames.ActivityMimeAttachment = "activitymimeattachment";
            EntityNames.ActivityPointer = "activitypointer";
            EntityNames.PhoneCall = "phonecall";
            EntityNames.Task = "task";
            EntityNames.Template = "template";
            EntityNames.EmailSignature = "emailsignature";
            EntityNames.SystemUser = "systemuser";
            EntityNames.Contact = "contact";
            EntityNames.Annotation = "annotation";
            EntityNames.UnResolvedAddress = "unresolvedaddress";
            EntityNames.Chat = "chat";
        })(EntityNames = Constants.EntityNames || (Constants.EntityNames = {}));
        var AppSettingsConstant;
        (function (AppSettingsConstant) {
            AppSettingsConstant.FluentThemingPreview = "FluentThemingPreview";
            AppSettingsConstant.EnableAttachmentReminderInEmail = "msdynce_enableattachmentreminderinemail";
        })(AppSettingsConstant = Constants.AppSettingsConstant || (Constants.AppSettingsConstant = {}));
        var OrgSettingsConstant;
        (function (OrgSettingsConstant) {
            OrgSettingsConstant.EnableInsertSignatureInUCI = "EnableInsertSignatureInUCI";
            OrgSettingsConstant.SaveAsDraftOrgSettingName = "AllowSaveAsDraftAppointment";
            OrgSettingsConstant.EnableMailboxDelegationForOutgoingEmail = "EnableMailboxDelegationForOutgoingEmail";
            OrgSettingsConstant.InsertSignatureFeatureBitValue = "1";
        })(OrgSettingsConstant = Constants.OrgSettingsConstant || (Constants.OrgSettingsConstant = {}));
        var FCBConstant;
        (function (FCBConstant) {
            FCBConstant.EmailEngagementFCB = "FCB.EmailEngagement";
            FCBConstant.FCB_EmailEngagement = "EmailEngagement";
            FCBConstant.SharePointS2SFCB = "FCB.SharePointS2S";
            FCBConstant.FCB_SharePointS2S = "SharePointS2S";
            FCBConstant.OneDriveIntegrationFCB = "FCB.OneDriveIntegration";
            FCBConstant.FCB_OneDriveIntegration = "OneDriveIntegration";
            FCBConstant.EmailEngagementActionFCB = "FCB.EmailEngagementComposeForUCI";
            FCBConstant.FCB_EmailEngagementAction = "EmailEngagementComposeForUCI";
            FCBConstant.EditorToolbarApril2020UpdateFCB = "FCB.EditorToolbar2020Update";
            FCBConstant.TemplatePreviewApril2020UpdateFCB = "FCB.TemplatePreview2020Update";
            FCBConstant.InlineImagesData2020UpdateFCB = "FCB.InlineImagesData2020Update";
            FCBConstant.EmailUx2020UpdateFCB = "FCB.EmailUx2020Update";
            FCBConstant.AppointmentSchedulingInUCIFCB = "FCB.AppointmentSchedulingInUCI";
            FCBConstant.FCB_AllDayEventInUTCMidnight = "FCB.IgnoreTimeInAllDayEventStartAndEnd";
            FCBConstant.AllDayEventInUTCMidnight = "IgnoreTimeInAllDayEventStartAndEnd";
            FCBConstant.April2020UpdateFCB = "FCB.April2020Update";
            FCBConstant.FCB_April2020Update = "April2020Update";
            FCBConstant.FCB_EmailTemplatePreviewEnhancementsEnabled = "EmailTemplatePreviewEnhancementsEnabled";
            FCBConstant.UnresolvedEmailAddressFeatureFCB = "FCB.UnresolvedEmailAddressFeature";
            FCBConstant.SendBulkEmailInUci = "SendBulkEmailInUci";
            FCBConstant.FCB_ConvertDeletedPartiesToUnresolvedEmails = "ConvertDeletedPartiesToUnresolvedEmails";
            FCBConstant.October2020UpdateFCB = "FCB.October2020Update";
            FCBConstant.AttachmentPreviewFCB = "FCB.AttachmentPreviewOctober2020Update";
            FCBConstant.MultiAttachmentUploadOctober2020UpdateFCB = "FCB.MultiAttachmentUploadOctober2020Update";
            FCBConstant.SubGridThumbnailOctober2020UpdateFCB = "FCB.SubGridThumbnailOctober2020Update";
            FCBConstant.FCB_SubGridThumbnailOctober2020Update = "SubGridThumbnailOctober2020Update";
            FCBConstant.TemplateUCIDataOctober2020UpdateFCB = "FCB.TemplateUCIDataOctober2020Update";
            FCBConstant.MailboxEnabledDialogFCB = "FCB.MailboxEnabledDialog";
            FCBConstant.FCB_MailboxEnabledDialog = "MailboxEnabledDialog";
            FCBConstant.EnableEmailEditInMocaFCB = "FCB.EnableEmailEditInMoca";
            FCBConstant.AttachFileAutoSaveOctober2020UpdateFCB = "FCB.AttachFileAutoSaveOctober2020Update";
            FCBConstant.FCB_ActivityEditorConfig2020Update = "ActivityEditorConfig2020Update";
            FCBConstant.SafeDescriptionInEmailUCIFCB = "FCB.SafeDescriptionInEmailUCI";
            FCBConstant.FCB_SafeDescriptionInEmailUCI = "SafeDescriptionInEmailUCI";
            FCBConstant.InsertTemplateAutoSaveOctober2020UpdateFCB = "FCB.InsertTemplateAutoSaveOctober2020Update";
            FCBConstant.FCB_EmailRTLDirectionInUCI = "EmailRTLDirectionInUCI";
            FCBConstant.April2021UpdateFCB = "FCB.April2021Update";
            FCBConstant.AddEmailAddressOnReplyFCB = "FCB.AddEmailAddressOnReply";
            FCBConstant.FCB_RecurringAppointmentUci = "RecurringAppointmentOctober2020";
            FCBConstant.RecurringAppointmentUciFCB = "FCB.RecurringAppointmentOctober2020";
            FCBConstant.InsertTemplateAtCursorPositionFCB = "FCB.InsertTemplateAtCursorPosition";
            FCBConstant.UpdateDateValueParsing = "FCB.UpdateDateValueParsing";
            FCBConstant.October2021UpdateFCB = "FCB.October2021Update";
            FCBConstant.October2022UpdateFCB = "FCB.October2022Update";
            FCBConstant.OnlineMeetingFCB = "OnlineTeamsMeeting";
            FCBConstant.April2022UpdateFCB = "April2022Update";
            FCBConstant.FCB_EnableEnhanceEmailTemplateEditor = "EnableEnhanceEmailTemplateEditor";
            FCBConstant.FCB_DisableMarketingEditorInEmailTemplate = "DisableMarketingEditorInEmailTemplate";
            FCBConstant.SSSUseOfficeApiToFilterUnSafeContentFCB = "SSSUseOfficeApiToFilterUnSafeContent";
            FCBConstant.FCB_ApplyEditorSelectionStyle = "ApplyEditorSelectionStyle";
            FCBConstant.FCB_EnableDynamicTextForEmailSignature = "EnableDynamicTextForSignature";
            FCBConstant.FCB_October2022Update = "October2022Update";
            FCBConstant.FCB_RemoveUnresolvedInvalidAddressOnSendEmail = "RemoveUnresolvedInvalidAddressOnSendEmail";
            FCBConstant.EnhancedEmailTemplateDialog = "FCB.EnhancedEmailTemplateDialog";
            FCBConstant.EnhancedEmailApril23 = "FCB.EmailEnhancementApril23";
            FCBConstant.FCB_AddRelatedEntitiesForEmail = "AddRelatedEntitiesForEmail";
            FCBConstant.FCB_April2024Update = "April2024Update";
            FCBConstant.FCB_ShowAttachmentReminderDialogInEmail = "ShowAttachmentReminderDialogInEmail";
            FCBConstant.FCB_RTEV2EmailSignatureHandling = "RTEV2EmailSignatureHandling";
            FCBConstant.FCB_ReplaceRTEv1WithRTEv2 = "ReplaceRTEv1WithRTEv2";
            FCBConstant.FCB_KeepRTEv1ForEmailTemplateAndSignature = "KeepRTEv1ForEmailTemplateAndSignature";
            FCBConstant.FCB_RTEV2InsertTemplateHandling = "RTEV2InsertTemplateHandling";
            FCBConstant.FCB_DeleteDraftEmailIfNotEditedByUser = "DeleteDraftEmailIfNotEditedByUser";
            FCBConstant.FCB_RemoveUpdateFromReplyForwardEmail = "RemoveUpdateFromReplyForwardEmail";
            FCBConstant.FCB_PreserverEmailToken = "PreserverEmailToken";
            FCBConstant.FCB_CopyActualEndDateInEmail = "CopyActualEndDateInEmail";
            FCBConstant.FCB_EnableModernPersonalSettingsDialog = "EnableModernPersonalSettingsDialog";
            FCBConstant.FCB_EnableSanitizationInTemplates = "EnableSanitizationInTemplates";
            FCBConstant.FCB_isDynamicTextinRTEV2Disabled = "isDynamicTextinRTEV2Disabled";
            FCBConstant.FCB_isNewCheckRTEV2UtilityDisabled = "isNewCheckRTEV2UtilityDisabled";
            FCBConstant.FCB_RemoveNameFromEmailReplyHeaderAndDedupEmailId = "RemoveNameFromEmailReplyHeaderAndDedupEmailId";
            FCBConstant.FCB_EnableRTEReadyForDefaultSignature = "EnableRTEReadyForDefaultSignature";
            FCBConstant.FCB_RTEEmitEditorReadyEvent = "RTEEmitEditorReadyEvent";
            FCBConstant.FCB_SensitivitylabelsHandlingInEmailAction = "SensitivitylabelsHandlingInEmailAction";
        })(FCBConstant = Constants.FCBConstant || (Constants.FCBConstant = {}));
        var PerfConstants;
        (function (PerfConstants) {
            PerfConstants.PerfOrgDbOrgSettings = "EnableActivitiesTimeLinePerfImprovement";
            var PerfImprovements;
            (function (PerfImprovements) {
                PerfImprovements[PerfImprovements["FirstStage"] = 1] = "FirstStage";
            })(PerfImprovements = PerfConstants.PerfImprovements || (PerfConstants.PerfImprovements = {}));
        })(PerfConstants = Constants.PerfConstants || (Constants.PerfConstants = {}));
        var EmailFields;
        (function (EmailFields) {
            EmailFields.Related = "related";
        })(EmailFields = Constants.EmailFields || (Constants.EmailFields = {}));
        var AnnotationFields;
        (function (AnnotationFields) {
            AnnotationFields.MimeType = "mimetype";
            AnnotationFields.FileName = "filename";
            AnnotationFields.IsDocument = "isdocument";
            AnnotationFields.DocumentBody = "documentbody";
        })(AnnotationFields = Constants.AnnotationFields || (Constants.AnnotationFields = {}));
        var TelemetryConstant;
        (function (TelemetryConstant) {
            TelemetryConstant.EventName = "EventName";
            TelemetryConstant.StartTime = "StartTime";
            TelemetryConstant.EndTime = "EndTime";
            TelemetryConstant.ExecutionTime = "ExecutionTime";
            TelemetryConstant.EventRefreshParentFromEmailPopup = "refreshParentFromEmailPopup";
            TelemetryConstant.BulkEmail = "bulkemail";
            TelemetryConstant.DeleteDraftEmailIfNotEditedByUser = "DeleteDraftEmailIfNotEditedByUser";
            TelemetryConstant.RecurrenceDialog = "RecurrenceDialog";
            TelemetryConstant.EndSeriesDialog = "EndSeriesDialog";
            TelemetryConstant.UpdateSeriesDialog = "UpdateSeriesDialog";
            TelemetryConstant.EventSend = "Send";
            TelemetryConstant.EventSetFormContextInContextualEmail = "SetFormContextInContextualEmail";
            TelemetryConstant.EventReply = "Reply";
            TelemetryConstant.EventReplyAll = "ReplyAll";
            TelemetryConstant.EventForward = "Forward";
            TelemetryConstant.EventAddAttachment = "AddAttachment";
            TelemetryConstant.EventOpenChatFromTimeline = "OpenChatFromTimeline";
            TelemetryConstant.EventAddAttachmentOctober2020 = "AddAttachmentOctober2020";
            TelemetryConstant.EventPreviewAttachmentOctober2020 = "PreviewAttachmentOctober2020";
            TelemetryConstant.EventDownloadAttachmentOctober2020 = "DownloadAttachmentOctober2020";
            TelemetryConstant.EventLoadAttachmentThumbnail = "LoadAttachmentThumbnailOctober2020";
            TelemetryConstant.EventInsertEmailTemplate = "InsertEmailTemplate";
            TelemetryConstant.EventInsertTemplate = "InsertTemplate";
            TelemetryConstant.EventPreviewTemplate = "PreviewTemplate";
            TelemetryConstant.EventTemplatePreviewInit = "TemplatePreviewInit";
            TelemetryConstant.EventTemplatePreviewUpdateView = "TemplatePreviewUpdateView";
            TelemetryConstant.EventTemplatePreviewDestroy = "TemplatePreviewDestroy";
            TelemetryConstant.EventAppointmentOnLoad = "AppointmentOnLoad";
            TelemetryConstant.EventAppointmentOnlineMeetingCommandChecker = "EventAppointmentOnlineMeetingCommandChecker";
            TelemetryConstant.EventAppointmentOnlineMeetingExceuted = "EventAppointmentOnlineMeetingExceuted";
            TelemetryConstant.EventAppointmentOnlineMeetingAdded = "EventAppointmentOnlineMeetingAdded";
            TelemetryConstant.EventAppointmentOnLoadBulkEdit = "AppointmentOnLoadBulkEdit";
            TelemetryConstant.EventRecurringAppointmentMasterOnLoad = "RecurringAppointmentMasterOnLoad";
            TelemetryConstant.EventRecurringAppointmentMasterOnEndSeriesClick = "RecurringAppointmentMasterOnEndSeriesClick";
            TelemetryConstant.EventEmailOnLoad = "EmailOnLoad";
            TelemetryConstant.EventAutonomousEmailDraftGuardrailViolationNotifications = "AutonomousEmailDraftGuardrailViolationNotifications";
            TelemetryConstant.EventEmailOnSave = "EmailOnSave";
            TelemetryConstant.SensitivityLabelsInEmail = "SensitivityLabelsInEmail";
            TelemetryConstant.EventFaxOnLoad = "FaxOnLoad";
            TelemetryConstant.EventLetterOnLoad = "LetterOnLoad";
            TelemetryConstant.EventPhoneCallOnLoad = "PhoneCallOnLoad";
            TelemetryConstant.EventTaskOnLoad = "TaskOnLoad";
            TelemetryConstant.EventErrorMessage = "ErrorMessage";
            TelemetryConstant.EventWarningMessage = "WarningMessage";
            TelemetryConstant.EventSeriesActionDialogOnLoad = "SeriesActionDialogOnLoad";
            TelemetryConstant.EventAppointmentDeletion = "AppointmentDeletion";
            TelemetryConstant.EventGridAppointmentDeletion = "GridAppointmentDeletion";
            TelemetryConstant.EventUploadFile = "UploadFile";
            TelemetryConstant.EventRemoveAttachment = "RemoveAttachment";
            TelemetryConstant.EventFollowAttachment = "FollowAttachment";
            TelemetryConstant.EventUnFollowAttachment = "UnFollowAttachment";
            TelemetryConstant.EventSelectTemplateRecipientDialogOnLoad = "SelectTemplateRecipientDialog";
            TelemetryConstant.EventApplyEmailTemplateDialogOnLoad = "ApplyEmailTemplateDialogOnLoad";
            TelemetryConstant.EventAttachmentDialogOnLoad = "AttachmentDialogOnLoad";
            TelemetryConstant.EventCommandExceuted = "CommandExceuted";
            TelemetryConstant.EventEntityType = "EntityType";
            TelemetryConstant.EventSourceEntityType = "SourceEntityType";
            TelemetryConstant.EventErrorCount = "ErrorCount";
            TelemetryConstant.EventBulkEmailDialogOnLoad = "BulkEmailDialogOnLoad";
            TelemetryConstant.EventSendBulkEmail = "SendBulkEmail";
            TelemetryConstant.EventBulkEmailLanguageChange = "BulkEmailOnLanguageChange";
            TelemetryConstant.EventBulkEmailTemplateChange = "BulkEmailOnTemplateChange";
            TelemetryConstant.EventBulkEmailSenderChange = "BulkEmailOnSenderChange";
            TelemetryConstant.EventInsertEmailSignatureDialogOnLoad = "InsertEmailSignatureDialogOnLoad";
            TelemetryConstant.EventInsertSignature = "InsertSignature";
            TelemetryConstant.EventIsAllDayOnChange = "IsAllDayEventOnChange";
            TelemetryConstant.EventDirectionCodeOnChange = "DirectionCodeOnChange";
            TelemetryConstant.EventQuickCreateOnChange = "QuickCreateOnSave";
            TelemetryConstant.EventUnresolveEmailAddressLookupDialogOnload = "UnresolveEmailAddressLookupDialogOnload";
            TelemetryConstant.EventRecurrenceDialogOnLoad = "RecurrenceDialogOnLoad";
            TelemetryConstant.EventRecurrenceDialogOnSet = "RecurrenceDialogOnSet";
            TelemetryConstant.EventRecurrenceDialogOnCancel = "RecurrenceDialogOnCancel";
            TelemetryConstant.EventRecurrenceDialogOnEndSeriesClick = "RecurrenceDialogOnEndSeriesClick";
            TelemetryConstant.EventRecurrenceDialogSameDayWeekOnChange = "RecurrenceDialogSameDayWeekOnChange";
            TelemetryConstant.EventRecurrenceDialogRangeEndTypeOnChange = "RecurrenceDialogRangeEndTypeOnChange";
            TelemetryConstant.EventRecurrenceDialogRepeatPatternTypeOnChange = "RecurrenceDialogRepeatPatternTypeOnChange";
            TelemetryConstant.EventRecurrenceDialogEndTimeOnChange = "RecurrenceDialogEndTimeOnChange";
            TelemetryConstant.EventRecurrenceDialogStartTimeOnChange = "RecurrenceDialogStartTimeOnChange";
            TelemetryConstant.EventRecurrenceDialogDurationOnChange = "RecurrenceDialogDurationOnChange";
            TelemetryConstant.EventRecurrenceDialogPatternStartDateOnChange = "RecurrenceDialogPatternStartDateOnChange";
            TelemetryConstant.EventRecurrenceDialogPatternEndDateOnChange = "RecurrenceDialogPatternEndDateOnChange";
            TelemetryConstant.EventEndSeriesDialogOnLoad = "EndSeriesDialogOnLoad";
            TelemetryConstant.EventEndSeriesDialogEndClick = "EndSeriesDialogEndClick";
            TelemetryConstant.EventEndSeriesDialogCancelClick = "EndSeriesDialogCancelClick";
            TelemetryConstant.EventUpdateSeriesDialogOnLoad = "UpdateSeriesDialogOnLoad";
            TelemetryConstant.EventUpdateSeriesDialogOkClick = "UpdateSeriesDialogOkClick";
            TelemetryConstant.EventUpdateSeriesDialogCancelClick = "UpdateSeriesDialogCancelClick";
            TelemetryConstant.EventParameterFileSize = "param_AttachmentFileSize";
            TelemetryConstant.EventParameterFileType = "param_AttachmentFileType";
            TelemetryConstant.EventParameterAttachmentCount = "param_AttachmentCount";
            TelemetryConstant.EventParameterTemplateInserted = "param_TemplateInserted";
            TelemetryConstant.EventParameterTemplateId = "param_TemplateId";
            TelemetryConstant.EventEditRecurrence = "RecurrenceDialog";
            TelemetryConstant.EventEndSeries = "EndSeries";
            TelemetryConstant.EventEditSeries = "EditSeries";
            TelemetryConstant.EventRecurringAppointmentDelete = "RecurringAppointmentDelete";
            TelemetryConstant.EventGridRecurringAppointmentDelete = "EventGridRecurringAppointmentDelete";
            TelemetryConstant.RecurrenceDialogAction = "RecurrenceDialogAction";
            TelemetryConstant.FromAppointment = "FromAppointment";
            TelemetryConstant.EndSeriesDialogAction = "EndSeriesDialogAction";
            TelemetryConstant.EnablePerfImprovements = "EnablePerfImprovements";
            TelemetryConstant.UseSchedulingEngine = "UseSchedulingEngine";
            TelemetryConstant.EventAppointmentOnSave = "AppointmentOnSave";
            TelemetryConstant.EventRecurrinAppointmentOnSave = "RecurrinAppointmentOnSave";
            TelemetryConstant.EventBPFNavigationOnAppointmentForm = "BPFNavigationOnAppointmentForm";
            TelemetryConstant.ExecutionContextMissing = "Execution context is missing from the handler";
            TelemetryConstant.TemplatePreviewClicked = "TemplatePreviewClicked";
            TelemetryConstant.EventAnnotationFileDownload = "NoteFileNameClicked";
            TelemetryConstant.EventNoteAttachmentControlUpdateView = "NoteAttachmentControlUpdateView";
            TelemetryConstant.EventNoteRegardingControlUpdateView = "NoteRegardingControlUpdateView";
            TelemetryConstant.EventNoteNavigateToRegarding = "NoteNavigateToRegarding";
            TelemetryConstant.EventNoteRegardingControlInit = "NoteRegardingControlInit";
            TelemetryConstant.AnnotationOnLoad = "AnnotationOnLoad";
            TelemetryConstant.EventRecurrenceDialogRepeatOnChange = "RecurrenceDialogRepeatOnChange";
            TelemetryConstant.EventEmailTemplateOnLoad = "EmailTemplateOnLoad";
            TelemetryConstant.EventSave = "Save";
            TelemetryConstant.EventInsertDynamicText = "InsertDynamicText";
            TelemetryConstant.EventCreateOrConvertToTemplate = "CreateOrConvertToTemplate";
            TelemetryConstant.EmailTemplate = "email.template";
            TelemetryConstant.TemplateDefaultView = "TemplateDefaultView";
            TelemetryConstant.EventSelectTemplate = "SelectTemplate";
            TelemetryConstant.PersistingFilterFeatureEnabled = "PersistingFilterFeatureEnabled";
            TelemetryConstant.EnableEmailTemplateViews = "EnableEmailTemplateViews";
            TelemetryConstant.SkipSelectRecordDialog = "SkipSelectRecordDialog";
            TelemetryConstant.RecordFieldName = "Record Field Name";
            TelemetryConstant.DownloadEmailAsAttachment = "DownloadEmailAsAttachment";
        })(TelemetryConstant = Constants.TelemetryConstant || (Constants.TelemetryConstant = {}));
        var DialogNames;
        (function (DialogNames) {
            DialogNames.ApplyEmailTemplate = "ApplyEmailTemplate";
            DialogNames.SelectTemplateRecipient = "SelectTemplateRecipient";
            DialogNames.UpdateAttachment = "UpdateAttachment";
            DialogNames.InsertSignature = "InsertSignature";
            DialogNames.AppointmentSchedulingConflict = "AppointmentSchedulingConflict";
            DialogNames.EmailTemplatePreview = "EmailTemplateDialog";
            DialogNames.LearnMoreDialog = "LearnMoreDialog";
            DialogNames.EmailTemplateInsertDialogFromEmail = "NewEmailTemplateDialog";
            DialogNames.EnhancedEmailTemplateInsertDialogFromEmail = "EnhancedEmailTemplateDialog";
        })(DialogNames = Constants.DialogNames || (Constants.DialogNames = {}));
        var MetadataDrivenDialogConstants;
        (function (MetadataDrivenDialogConstants) {
            MetadataDrivenDialogConstants.EmailSignatureEntityName = "emailsignature";
            MetadataDrivenDialogConstants.EmailEntityName = "email";
            MetadataDrivenDialogConstants.TemplateEntityName = "template";
            MetadataDrivenDialogConstants.SubjectAttribute = "subject";
            MetadataDrivenDialogConstants.DescriptionAttribute = "description";
            MetadataDrivenDialogConstants.IsOnlineMeeting = "isonlinemeeting";
            MetadataDrivenDialogConstants.OnlineMeetingType = "onlinemeetingtype";
            MetadataDrivenDialogConstants.OnlineMeetingJoinUrl = "onlinemeetingjoinurl";
            MetadataDrivenDialogConstants.ParamLastButtonClicked = "param_lastButtonClicked";
            MetadataDrivenDialogConstants.ParamEntityId = "param_entityId";
            MetadataDrivenDialogConstants.ParamEmailFormData = "param_emailFormData";
            MetadataDrivenDialogConstants.ParamEntityType = "param_entityType";
            MetadataDrivenDialogConstants.ParamEmailSubject = "param_emailsubject";
            MetadataDrivenDialogConstants.ParamEmailDescription = "param_emaildescription";
            MetadataDrivenDialogConstants.ParamTemplateId = "param_templateId";
            MetadataDrivenDialogConstants.ParamEmailEntityId = "param_id";
            MetadataDrivenDialogConstants.ParamSignatureText = "param_signaturetext";
            MetadataDrivenDialogConstants.ParamOwnerId = "param_ownerId";
            MetadataDrivenDialogConstants.ParamSenderId = "param_senderId";
            MetadataDrivenDialogConstants.ParamSenderType = "param_sendertype";
            MetadataDrivenDialogConstants.ParamIsDraft = "param_isDraft";
            MetadataDrivenDialogConstants.ParamNotificationsData = "param_notificationsData";
            MetadataDrivenDialogConstants.ParamActivityType = "param_activityType";
            MetadataDrivenDialogConstants.RecipientNames = "name";
            MetadataDrivenDialogConstants.KeyPresent = "KeyPresent";
            MetadataDrivenDialogConstants.EmailFormData = "emailFormData";
            MetadataDrivenDialogConstants.EmailEntityType = "entityType";
            MetadataDrivenDialogConstants.EmailEntityId = "id";
            MetadataDrivenDialogConstants.EntityTypeCode = "entityTypeCode";
            MetadataDrivenDialogConstants.LastButtonClicked = "lastButtonClicked";
            MetadataDrivenDialogConstants.EmailSubject = "emailsubject";
            MetadataDrivenDialogConstants.TemplateId = "templateId";
            MetadataDrivenDialogConstants.EntityType = "type";
            MetadataDrivenDialogConstants.SelectControlName = "select_id";
            MetadataDrivenDialogConstants.SendControlName = "send_id";
            MetadataDrivenDialogConstants.TemplatePreviewControlName = "template_preview";
            MetadataDrivenDialogConstants.TemplateInsertDataControlName = "template_insert_data";
            MetadataDrivenDialogConstants.BulkEmailSenderControlName = "sender_id";
            MetadataDrivenDialogConstants.BulkEmailSelectedRecordsParam = "param_selectedRecords";
            MetadataDrivenDialogConstants.BulkEmailRecipientsControlName = "recipients";
            MetadataDrivenDialogConstants.GridControl = "param_gridControl";
            MetadataDrivenDialogConstants.PreviewControlName = "preview_id";
            MetadataDrivenDialogConstants.EntityId = "entityId";
            MetadataDrivenDialogConstants.EntityTypeInfo = "entityTypeInfo";
            MetadataDrivenDialogConstants.FieldControlName = "fieldname_id";
            MetadataDrivenDialogConstants.RecordControlName = "record_id";
            MetadataDrivenDialogConstants.ControlNullError = " control cannot be null";
            MetadataDrivenDialogConstants.EmailTemplateControlName = "emailtemplates_id";
            MetadataDrivenDialogConstants.DefaultLookupName = "default";
            MetadataDrivenDialogConstants.LanguageId = "language_id";
            MetadataDrivenDialogConstants.SaveControlId = "save_id";
            MetadataDrivenDialogConstants.ConflictDialogDescription1ControlId = "description1_id";
            MetadataDrivenDialogConstants.ConflictDialogDescription2ControlId = "description2_id";
            MetadataDrivenDialogConstants.ProgressValue = 40;
            MetadataDrivenDialogConstants.ProgressMinValue = 0;
            MetadataDrivenDialogConstants.ProgressMaxValue = 100;
            MetadataDrivenDialogConstants.DialogOkId = "ok_id";
            MetadataDrivenDialogConstants.DialogCancelId = "cancel_id";
            MetadataDrivenDialogConstants.AttachementSubGridControl = "attachmentsGrid";
            MetadataDrivenDialogConstants.EmailSignatureControl = "signatures_id";
            MetadataDrivenDialogConstants.UnresolvedAddress = "unresolvedaddress";
            MetadataDrivenDialogConstants.Required = "requiredattendees";
            MetadataDrivenDialogConstants.Optional = "optionalattendees";
            MetadataDrivenDialogConstants.DialogInsertId = "insert_id";
            MetadataDrivenDialogConstants.From = "from";
            MetadataDrivenDialogConstants.To = "to";
            MetadataDrivenDialogConstants.Cc = "cc";
            MetadataDrivenDialogConstants.Bcc = "bcc";
            MetadataDrivenDialogConstants.ParamPrimaryText = "param_primarytext";
            MetadataDrivenDialogConstants.ParamTitleText = "param_titletext";
            MetadataDrivenDialogConstants.ParamLearnMoreButtonLabel = "param_learnMoreLabel";
            MetadataDrivenDialogConstants.ParamContinueButtonLabel = "param_continueLabel";
            MetadataDrivenDialogConstants.ControlTitle = "title_id";
            MetadataDrivenDialogConstants.ControlPrimaryText = "primarytext_id";
            MetadataDrivenDialogConstants.ControlLearnMoreButton = "learnmore_id";
            MetadataDrivenDialogConstants.ControlContinueButton = "continue_id";
            MetadataDrivenDialogConstants.ParamRepeatValue = "param_repeatValue";
            MetadataDrivenDialogConstants.ParamEveryFieldValue = "param_everyFieldValue";
            MetadataDrivenDialogConstants.ParamReturnValueRecurring = "param_returnValueRecurring";
            MetadataDrivenDialogConstants.ParamRadioOptionsList = "param_radioOptionsList";
            MetadataDrivenDialogConstants.ParamIsVertical = "param_isVertical";
            MetadataDrivenDialogConstants.ParamControlLabel = "param_controlLabel";
            MetadataDrivenDialogConstants.ParamSameSelectedValue = "param_sameselectedvalue";
            MetadataDrivenDialogConstants.ParamDaysOfWeekMask = "param_daysofweekmask";
            MetadataDrivenDialogConstants.RecurStartTimeControl = "starttime_id";
            MetadataDrivenDialogConstants.RecurEndTimeControl = "endtime_id";
            MetadataDrivenDialogConstants.RecurDurationControl = "duration_id";
            MetadataDrivenDialogConstants.RecurRepeatPatternControl = "repeat_id";
            MetadataDrivenDialogConstants.RecurDaysOfWeekControl = "daysofweek_id";
            MetadataDrivenDialogConstants.RecurSameRadioControl = "sameradios_id";
            MetadataDrivenDialogConstants.RecurSameWeekWeekControl = "sameweekweek_id";
            MetadataDrivenDialogConstants.RecurSameWeekDayControl = "sameweekday_id";
            MetadataDrivenDialogConstants.RecurSameDayDayControl = "samedayday_id";
            MetadataDrivenDialogConstants.RecurYearlyMonthControl = "yearlymonth_id";
            MetadataDrivenDialogConstants.RecurEveryControl = "every_id";
            MetadataDrivenDialogConstants.RecurRangeStartControl = "rangestart_id";
            MetadataDrivenDialogConstants.RecurRangeEndTypeControl = "endspicklist_id";
            MetadataDrivenDialogConstants.RecurOccurrenceControl = "totaloccurences_id";
            MetadataDrivenDialogConstants.RecurRangeEndDateControl = "enddate_id";
            MetadataDrivenDialogConstants.RecurSetButton = "set_id";
            MetadataDrivenDialogConstants.RecurEndSeriesButton = "endseries_id";
            MetadataDrivenDialogConstants.RecurCancelButton = "cancel_id";
            MetadataDrivenDialogConstants.RecurSeriesIdParam = "param_seriesid";
            MetadataDrivenDialogConstants.ParamEndSeries_RadioOptions = "param_options";
            MetadataDrivenDialogConstants.ParamEndSeries_SelectedValue = "param_selectedValue";
            MetadataDrivenDialogConstants.ControlEndSeries_TopLabel = "toplabel_id";
            MetadataDrivenDialogConstants.ControlEndSeries_EndDate = "enddate_id";
            MetadataDrivenDialogConstants.ControlEndSeries_ChoiceLabel = "choicelabel_id";
            MetadataDrivenDialogConstants.ControlEndSeries_RadioOptions = "radiooptions_id";
            MetadataDrivenDialogConstants.EndSeriesDialogEndButton = "endbutton_id";
            MetadataDrivenDialogConstants.EndSeriesDialogCancelButton = "cancelbutton_id";
            MetadataDrivenDialogConstants.ParamEndSeries_SeriesId = "param_seriesid";
            MetadataDrivenDialogConstants.ControlUpdateSeries_TopLabel = "toplabel_id";
            MetadataDrivenDialogConstants.ControlUpdateSeries_FirstLabel = "firsttext_id";
            MetadataDrivenDialogConstants.ControlUpdateSeries_SecondLabel = "secondtext_id";
            MetadataDrivenDialogConstants.UpdateSeriesDialogOkButton = "okupdatebutton_id";
            MetadataDrivenDialogConstants.UpdateSeriesDialogCancelButton = "cancelupdatebutton_id";
            var RepeatPattern;
            (function (RepeatPattern) {
                RepeatPattern[RepeatPattern["Daily"] = 0] = "Daily";
                RepeatPattern[RepeatPattern["Weekly"] = 1] = "Weekly";
                RepeatPattern[RepeatPattern["Monthly"] = 2] = "Monthly";
                RepeatPattern[RepeatPattern["Yearly"] = 3] = "Yearly";
            })(RepeatPattern = MetadataDrivenDialogConstants.RepeatPattern || (MetadataDrivenDialogConstants.RepeatPattern = {}));
            var RangeEndType;
            (function (RangeEndType) {
                RangeEndType[RangeEndType["Never"] = 1] = "Never";
                RangeEndType[RangeEndType["ByNoOfOccurrences"] = 2] = "ByNoOfOccurrences";
                RangeEndType[RangeEndType["ByEndDate"] = 3] = "ByEndDate";
            })(RangeEndType = MetadataDrivenDialogConstants.RangeEndType || (MetadataDrivenDialogConstants.RangeEndType = {}));
            var SameRadioOption;
            (function (SameRadioOption) {
                SameRadioOption[SameRadioOption["Day"] = 1] = "Day";
                SameRadioOption[SameRadioOption["Week"] = 2] = "Week";
            })(SameRadioOption = MetadataDrivenDialogConstants.SameRadioOption || (MetadataDrivenDialogConstants.SameRadioOption = {}));
            var SameWeekWeekInstance;
            (function (SameWeekWeekInstance) {
                SameWeekWeekInstance[SameWeekWeekInstance["First"] = 1] = "First";
                SameWeekWeekInstance[SameWeekWeekInstance["Second"] = 2] = "Second";
                SameWeekWeekInstance[SameWeekWeekInstance["Third"] = 3] = "Third";
                SameWeekWeekInstance[SameWeekWeekInstance["Fourth"] = 4] = "Fourth";
                SameWeekWeekInstance[SameWeekWeekInstance["Last"] = 5] = "Last";
            })(SameWeekWeekInstance = MetadataDrivenDialogConstants.SameWeekWeekInstance || (MetadataDrivenDialogConstants.SameWeekWeekInstance = {}));
            var SameWeekDayOptions;
            (function (SameWeekDayOptions) {
                SameWeekDayOptions[SameWeekDayOptions["Day"] = 0] = "Day";
                SameWeekDayOptions[SameWeekDayOptions["Weekday"] = 1] = "Weekday";
                SameWeekDayOptions[SameWeekDayOptions["Weekend"] = 2] = "Weekend";
                SameWeekDayOptions[SameWeekDayOptions["Sunday"] = 3] = "Sunday";
                SameWeekDayOptions[SameWeekDayOptions["Monday"] = 4] = "Monday";
                SameWeekDayOptions[SameWeekDayOptions["Tuesday"] = 5] = "Tuesday";
                SameWeekDayOptions[SameWeekDayOptions["Wednesday"] = 6] = "Wednesday";
                SameWeekDayOptions[SameWeekDayOptions["Thursday"] = 7] = "Thursday";
                SameWeekDayOptions[SameWeekDayOptions["Friday"] = 8] = "Friday";
                SameWeekDayOptions[SameWeekDayOptions["Saturday"] = 9] = "Saturday";
            })(SameWeekDayOptions = MetadataDrivenDialogConstants.SameWeekDayOptions || (MetadataDrivenDialogConstants.SameWeekDayOptions = {}));
        })(MetadataDrivenDialogConstants = Constants.MetadataDrivenDialogConstants || (Constants.MetadataDrivenDialogConstants = {}));
        var HtmlTags;
        (function (HtmlTags) {
            HtmlTags.Div = "div";
            HtmlTags.Paragraph = "p";
            HtmlTags.Img = "img";
            HtmlTags.Iframe = "iframe";
        })(HtmlTags = Constants.HtmlTags || (Constants.HtmlTags = {}));
        var HtmlTagSelectors;
        (function (HtmlTagSelectors) {
            HtmlTagSelectors.DialogMainDiv = "div[data-preview-id={0}]";
            HtmlTagSelectors.DialogHeaderDiv = "div[data-id=dialogHeader]";
            HtmlTagSelectors.DialogFooterDiv = "div[data-id=dialogFooter]";
        })(HtmlTagSelectors = Constants.HtmlTagSelectors || (Constants.HtmlTagSelectors = {}));
        var HtmlAttributes;
        (function (HtmlAttributes) {
            HtmlAttributes.Src = "src";
            HtmlAttributes.Base64Template = "data:{0};base64,{1}";
        })(HtmlAttributes = Constants.HtmlAttributes || (Constants.HtmlAttributes = {}));
        var HtmlStyles;
        (function (HtmlStyles) {
            HtmlStyles.Hidden = "hidden";
            HtmlStyles.OneHundredPercent = "100%";
            HtmlStyles.Zero = "0";
            HtmlStyles.Auto = "auto";
            HtmlStyles.Pixel = "px";
            HtmlStyles.Center = "center";
            HtmlStyles.None = "none";
            HtmlStyles.InlineFlex = "inline-flex";
            HtmlStyles.FlexDirectionColumn = "column";
            HtmlStyles.FontWeight600 = "600";
            HtmlStyles.FontSize18 = "18px";
        })(HtmlStyles = Constants.HtmlStyles || (Constants.HtmlStyles = {}));
        var ActivitiesFeature;
        (function (ActivitiesFeature) {
            ActivitiesFeature.ActivitiesFeatureOrgDbOrgSettings = "EnableActivitiesFeatures";
            var ActivitiesFeatureList;
            (function (ActivitiesFeatureList) {
                ActivitiesFeatureList[ActivitiesFeatureList["EnableInsertSignatureInUCI"] = 1] = "EnableInsertSignatureInUCI";
            })(ActivitiesFeatureList = ActivitiesFeature.ActivitiesFeatureList || (ActivitiesFeature.ActivitiesFeatureList = {}));
        })(ActivitiesFeature = Constants.ActivitiesFeature || (Constants.ActivitiesFeature = {}));
        var AppointmentStatusCode;
        (function (AppointmentStatusCode) {
            AppointmentStatusCode[AppointmentStatusCode["busy"] = 5] = "busy";
        })(AppointmentStatusCode = Constants.AppointmentStatusCode || (Constants.AppointmentStatusCode = {}));
        var AppointmentStateCode;
        (function (AppointmentStateCode) {
            AppointmentStateCode[AppointmentStateCode["open"] = 0] = "open";
            AppointmentStateCode[AppointmentStateCode["completed"] = 1] = "completed";
            AppointmentStateCode[AppointmentStateCode["canceled"] = 2] = "canceled";
            AppointmentStateCode[AppointmentStateCode["scheduled"] = 3] = "scheduled";
        })(AppointmentStateCode = Constants.AppointmentStateCode || (Constants.AppointmentStateCode = {}));
        var SaveMode;
        (function (SaveMode) {
            SaveMode[SaveMode["save"] = 1] = "save";
            SaveMode[SaveMode["saveandclose"] = 2] = "saveandclose";
            SaveMode[SaveMode["deactivate"] = 5] = "deactivate";
            SaveMode[SaveMode["saveascompleted"] = 58] = "saveascompleted";
            SaveMode[SaveMode["autosave"] = 70] = "autosave";
        })(SaveMode = Constants.SaveMode || (Constants.SaveMode = {}));
        var DateTimeFieldBehavior;
        (function (DateTimeFieldBehavior) {
            DateTimeFieldBehavior[DateTimeFieldBehavior["None"] = 0] = "None";
            DateTimeFieldBehavior[DateTimeFieldBehavior["UserLocal"] = 1] = "UserLocal";
            DateTimeFieldBehavior[DateTimeFieldBehavior["DateOnly"] = 2] = "DateOnly";
            DateTimeFieldBehavior[DateTimeFieldBehavior["TimeZoneIndependent"] = 3] = "TimeZoneIndependent";
        })(DateTimeFieldBehavior = Constants.DateTimeFieldBehavior || (Constants.DateTimeFieldBehavior = {}));
        var AttributeSubmitModes;
        (function (AttributeSubmitModes) {
            AttributeSubmitModes[AttributeSubmitModes["dirty"] = 0] = "dirty";
            AttributeSubmitModes[AttributeSubmitModes["always"] = 1] = "always";
            AttributeSubmitModes[AttributeSubmitModes["never"] = 2] = "never";
        })(AttributeSubmitModes = Constants.AttributeSubmitModes || (Constants.AttributeSubmitModes = {}));
        var AttributeRequiredLevel;
        (function (AttributeRequiredLevel) {
            AttributeRequiredLevel.None = "none";
            AttributeRequiredLevel.Required = "required";
            AttributeRequiredLevel.Recommended = "recommended";
        })(AttributeRequiredLevel = Constants.AttributeRequiredLevel || (Constants.AttributeRequiredLevel = {}));
        var FormNotificationLevel;
        (function (FormNotificationLevel) {
            FormNotificationLevel.Error = "ERROR";
            FormNotificationLevel.Warning = "WARNING";
            FormNotificationLevel.Info = "INFO";
        })(FormNotificationLevel = Constants.FormNotificationLevel || (Constants.FormNotificationLevel = {}));
        var Templates;
        (function (Templates) {
            Templates.SafeHtml = "safehtml";
            Templates.SubjectSafeHtml = "subjectsafehtml";
            Templates.Subject = "subject";
            Templates.Description = "description";
            Templates.IsEnhancedEditorEnabled = "isenhancededitorenabled";
            Templates.EnahancedEditorHtml = "enahancededitorhtml";
            Templates.InsertDataDialog = "EmailTemplateInsertDataValue";
            Templates.CreateTemplateDialog = "CreateTemplateDialog";
            Templates.ConvertEmailToTemplateDialog = "ConvertEmailToTemplateDialog";
            Templates.TemplateNameId = "templateNameId";
            Templates.PermissionLevelId = "permissionLevelId";
            Templates.LanguageId = "languageId";
            Templates.EmailSubjectWarningId = "emailSubjectWarningId";
            Templates.ParamCategory = "param_category";
            Templates.ParamSubject = "param_subject";
            Templates.ParamBody = "param_body";
            Templates.ParamEmailId = "param_emailId";
            Templates.ParamTemplateRecord = "param_templateRecord";
            Templates.RequiredFieldsErrorMessage = "RequiredFieldsErrorMessage";
            Templates.ConvertingEmailToTemplateProgressMessage = "ConvertingEmailToTemplateProgressMessage";
            Templates.CopyingAttachmentsToTemplateMessage = "CopyingAttachmentsToTemplateMessage";
            Templates.CreatingTemplateProgressMessage = "CreatingTemplateProgressMessage";
            Templates.ErrorCreateTemplate = "ErrorCreateTemplate";
            Templates.ErrorCopyAttachmentsToTemplate = "ErrorCopyAttachmentsToTemplate";
            Templates.ErrorRetrievingAttachmentsForTemplate = "ErrorRetrievingAttachmentsForTemplate";
            Templates.WarningEmailSubjectLengthMessage = "WarningEmailSubjectLengthMessage";
            Templates.CreateOrgEmailTemplatesPrivilegeId = "01750f14-3320-49cc-a7d1-52502cdcd16d";
            Templates.Header_Ownerid = "header_ownerid";
            Templates.TemplateTypeCode = "templatetypecode";
            Templates.ValidEmailSubjectLength = 800;
            Templates.templateFormCkeditorControl = {
                RichTextEditor: "Rich text editor",
                ActivityEditor: false,
            };
            Templates.RemoveLabel = "InsertDataRemoveButtonLabel";
            Templates.MoveUpLabel = "InsertDataMoveUpButtonLabel";
            Templates.MoveDownLabel = "InsertDataMoveDownButtonLabel";
            Templates.iconDics = {
                InsertDataRemoveButtonLabel: 7,
                InsertDataMoveUpButtonLabel: 58,
                InsertDataMoveDownButtonLabel: 59,
            };
            Templates.BlankTemplateBase64 = "/9j/4AAQSkZJRgABAQEAYABgAAD/4RCgRXhpZgAATU0AKgAAAAgABAE7AAIAAAAPAAAISodpAAQAAAABAAAIWpydAAEAAAAeAAAQeuocAAcAAAgMAAAAPgAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAENoYW50YWwgTXVydGh5AAAAAeocAAcAAAgMAAAIbAAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQwBoAGEAbgB0AGEAbAAgAE0AdQByAHQAaAB5AAAA/+EKZ2h0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4NCjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iPjxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iLz48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+PGRjOmNyZWF0b3I+PHJkZjpTZXEgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOmxpPkNoYW50YWwgTXVydGh5PC9yZGY6bGk+PC9yZGY6U2VxPg0KCQkJPC9kYzpjcmVhdG9yPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0ndyc/Pv/bAEMABwUFBgUEBwYFBggHBwgKEQsKCQkKFQ8QDBEYFRoZGBUYFxseJyEbHSUdFxgiLiIlKCkrLCsaIC8zLyoyJyorKv/bAEMBBwgICgkKFAsLFCocGBwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKv/AABEIASoBLwMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APpGiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKK5DW/ir4M8OavNpes6z9mvIMeZF9lmfbkZHKoR0PrQB19FcD/wALw+Hn/Qw/+SVx/wDG6P8AheHw8/6GH/ySuP8A43QB31FcD/wvD4ef9DD/AOSVx/8AG6P+F4fDz/oYf/JK4/8AjdAHfUVwP/C8Ph5/0MP/AJJXH/xuj/heHw8/6GH/AMkrj/43QB31FcJB8a/h9cXEcMfiFQ8jBVL2s6Lk+rFAAPcnFd0rB1DIQysMgg5BFAC0UUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABXyF8bP+Su6x9Y//Ra19e18hfGz/krusfWP/wBFrTQmbOn/ALPPizUdNtr2DUNGWO5iWVA88oYBhkZxH15qx/wzZ4w/6CWif9/5v/jVfQ/hX/kT9I/68of/AEAVq0XCx8x/8M2eMP8AoJaJ/wB/5v8A41R/wzZ4w/6CWif9/wCb/wCNV9OUUXYWPmP/AIZs8Yf9BLRP+/8AN/8AGqP+GbPGH/QS0T/v/N/8ar6coouwsfDninw3eeEvEdzoupSQS3Ntt3vbsShyoPBIB7+leo/B34xHRGh8O+KZy2msQlrducm2PZWP9z3/AIfp05T42f8AJXdY+sf/AKLWtHx58JZ9D8N2HiXQVkn02e1ikuovvNbMVBLe6E9+1MR9VqwdQyEMrDIIOQRS182/B34xHRGh8O+KZy2msQlrducm2PZWP9z3/h+nT6RVg6hkIZWGQQcgipKFooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK+QvjZ/yV3WPrH/AOi1r69r5C+Nn/JXdY+sf/otaaEz6o8K/wDIn6R/15Q/+gCtWsrwr/yJ+kf9eUP/AKAK1aQwooooAKKKKAPkL42f8ld1j6x/+i1r6m8MxpL4L0qOVFdHsIlZWGQwKDIIr5Z+Nn/JXdY+sf8A6LWo7X4z+PrKzhtbXXtkMCCONfscB2qBgDJTPSq6EnT/ABg+D7+G5Jdf8NQs+kOd09uoybQnuP8AY/l9KsfB34xHRGh8O+KZy2msQlrducm2PZWP9z3/AIfp05OT42fECWNo5deV0cFWVrG3IYHqCPLrhZJDLK0jbQzEk7VCjn0A4H0FAH3urB1DIQysMgg5BFLXhn7O/jLVNSW78OahJ9otbKAS20jnLxjdjZnuvPHp9OnudSUFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFfIXxs/5K7rH1j/8ARa19e18hfGz/AJK7rH1j/wDRa00Jn1R4V/5E/SP+vKH/ANAFatZXhX/kT9I/68of/QBWrSGFFFFABRRRQBkX3hHw3qd493qXh/Sru5kxvmuLKOR2wMcsVyar/wDCBeD/APoVNE/8F0P/AMTW/RQBgf8ACBeD/wDoVNE/8F0P/wATXD/GHwl4c0z4Xapd6b4f0uzuUMeya3so43XMig4YDIr1evP/AI3/APJItW+sX/oxaYjyz9mn/kcNW/68h/6GK+k6+bP2af8AkcNW/wCvIf8AoYr6Toe4IKKKKQwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvkL42f8ld1j6x/+i1r69r5C+Nn/JXdY+sf/otaaEz6o8K/8ifpH/XlD/6AK1ayvCv/ACJ+kf8AXlD/AOgCtWkMKKKKACiiigAooooAK8/+N/8AySLVvrF/6MWvQK8/+N//ACSLVvrF/wCjFoA8s/Zp/wCRw1b/AK8h/wChivpOvmz9mn/kcNW/68h/6GK+k6b3EgooopDCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK+QvjZ/wAld1j6x/8Aota+va+QvjZ/yV3WPrH/AOi1poTPqjwr/wAifpH/AF5Q/wDoArVrK8K/8ifpH/XlD/6AK1aQwooooAKKKKACiiigArz/AON//JItW+sX/oxa9Arz/wCN/wDySLVvrF/6MWgDyz9mn/kcNW/68h/6GK+k6+bP2af+Rw1b/ryH/oYr6TpvcSCiiikMKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAr5C+Nn/JXdY+sf/ota+va+QvjZ/yV3WPrH/6LWmhM+qPCv/In6R/15Q/+gCtWsrwr/wAifpH/AF5Q/wDoArVpDCiiigAooooAKKKKACvP/jf/AMki1b6xf+jFr0CvP/jf/wAki1b6xf8AoxaAPLP2af8AkcNW/wCvIf8AoYr6Tr5s/Zp/5HDVv+vIf+hivpOm9xIKKKKQwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvkL42f8AJXdY+sf/AKLWvr2vnL4o/Crxn4j+I2papo2jfabOcp5cv2qFN2EAPDOD1HpTQmet+G/HHhSDwrpUU/ifRo5I7OJXR9QiDKQgyCC3BrT/AOE98H/9DXon/gxh/wDiq+Yv+FH/ABD/AOhe/wDJ23/+OUf8KP8AiH/0L3/k7b//ABynZAfTv/Ce+D/+hr0T/wAGMP8A8VR/wnvg/wD6GvRP/BjD/wDFV8xf8KP+If8A0L3/AJO2/wD8co/4Uf8AEP8A6F7/AMnbf/45RZAfTv8Awnvg/wD6GvRP/BjD/wDFUf8ACe+D/wDoa9E/8GMP/wAVXzF/wo/4h/8AQvf+Ttv/APHKP+FH/EP/AKF7/wAnbf8A+OUWQH07/wAJ74P/AOhr0T/wYw//ABVH/Ce+D/8Aoa9E/wDBjD/8VXzF/wAKP+If/Qvf+Ttv/wDHKP8AhR/xD/6F7/ydt/8A45RZAfTv/Ce+D/8Aoa9E/wDBjD/8VXD/ABh8W+HNT+F2qWmm+INLvLlzHsht72OR2xIpOFBya8a/4Uf8Q/8AoXv/ACdt/wD45R/wo/4h/wDQvf8Ak7b/APxyiyA6n9mn/kcNW/68h/6GK+k68R+B/wAPfE/g/wASajdeI9M+xwzWojjb7RFJltwOMIxPSvbqTBBRRRSGFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//9k=";
            Templates.defaultFieldPlaceHolder = "---";
            Templates.defaultTextLabel = "InsertDataDefaultTextLabel";
            Templates.recordTypeLabel = "InsertDataRecordTypeLabel";
            Templates.fieldNameLabel = "InsertDataFieldNameLabel";
            Templates.addDataFieldLabel = "InsertDataAddDataFieldButtonLabel";
            Templates.CommonWebResource = "Activities/Resources/Activities";
            Templates.RTEdefaultWebResource = "msdyn_/RichTextEditorControl/RTEGlobalConfiguration.json";
            Templates.malformedDefaultValue = "malformedDefaultValue";
            Templates.subjectSafeHtmlNotification = "subjectsafehtml_RequiredFieldMustBeFilledIn";
            Templates.RequiredFieldMustBeFilledIn = "RequiredFieldMustBeFilledIn";
            Templates.RetrieveRecordTypeComponent = "TemplateInsertDataControl_RetrieveRecordType";
            Templates.RetrieveFieldNameComponent = "TemplateInsertDataControl_RetrieveFieldName";
            Templates.NotFocusedOnSubjectOrBody = "NotFocusedOnSubjectOrBody";
            Templates.nodeType = {
                ELEMENT_NODE: 1,
                TEXT_NODE: 3,
            };
        })(Templates = Constants.Templates || (Constants.Templates = {}));
        var keyboardEvent;
        (function (keyboardEvent) {
            keyboardEvent.keyCode = {
                ArrowRight: "ArrowRight",
                ArrowLeft: "ArrowLeft",
                ArrowUp: "ArrowUp",
                ArrowDown: "ArrowDown",
                Backspace: "Backspace",
                Delete: "Delete",
            };
        })(keyboardEvent = Constants.keyboardEvent || (Constants.keyboardEvent = {}));
        var MailBoxConstants;
        (function (MailBoxConstants) {
            MailBoxConstants.OutgoingEmailDeliveryMethod = "outgoingemaildeliverymethod";
            MailBoxConstants.EnabledForOutgoingEmail = "enabledforoutgoingemail";
            MailBoxConstants.OutgoingEmailStatus = "outgoingemailstatus";
            var MailboxAccessStatus;
            (function (MailboxAccessStatus) {
                MailboxAccessStatus[MailboxAccessStatus["NotRun"] = 0] = "NotRun";
                MailboxAccessStatus[MailboxAccessStatus["Success"] = 1] = "Success";
                MailboxAccessStatus[MailboxAccessStatus["Failure"] = 2] = "Failure";
            })(MailboxAccessStatus = MailBoxConstants.MailboxAccessStatus || (MailBoxConstants.MailboxAccessStatus = {}));
            var EmailDeliveryMethod;
            (function (EmailDeliveryMethod) {
                EmailDeliveryMethod[EmailDeliveryMethod["Unset"] = -1] = "Unset";
                EmailDeliveryMethod[EmailDeliveryMethod["None"] = 0] = "None";
                EmailDeliveryMethod[EmailDeliveryMethod["OutlookClient"] = 1] = "OutlookClient";
                EmailDeliveryMethod[EmailDeliveryMethod["EmailRouter"] = 2] = "EmailRouter";
                EmailDeliveryMethod[EmailDeliveryMethod["ForwardMailbox"] = 3] = "ForwardMailbox";
            })(EmailDeliveryMethod = MailBoxConstants.EmailDeliveryMethod || (MailBoxConstants.EmailDeliveryMethod = {}));
            var EmailConnectionChannel;
            (function (EmailConnectionChannel) {
                EmailConnectionChannel[EmailConnectionChannel["SSS"] = 0] = "SSS";
                EmailConnectionChannel[EmailConnectionChannel["Router"] = 1] = "Router";
            })(EmailConnectionChannel = MailBoxConstants.EmailConnectionChannel || (MailBoxConstants.EmailConnectionChannel = {}));
        })(MailBoxConstants = Constants.MailBoxConstants || (Constants.MailBoxConstants = {}));
        var NotificationIds;
        (function (NotificationIds) {
            NotificationIds.unresolvedEmailNotificationID = "unresolvedEmailNotSupported";
            NotificationIds.invalidAddressNotificationId = "invalidAddressNotSupported";
        })(NotificationIds = Constants.NotificationIds || (Constants.NotificationIds = {}));
        var UnEditedDraftEmailDeleteSessionStorageKeys;
        (function (UnEditedDraftEmailDeleteSessionStorageKeys) {
            UnEditedDraftEmailDeleteSessionStorageKeys.EMAILID = "draftEmailDelete_emailId_";
            UnEditedDraftEmailDeleteSessionStorageKeys.NOTIFICATIONID = "draftEmailDelete_notificationId_";
            UnEditedDraftEmailDeleteSessionStorageKeys.DELETEHANDLERID = "draftEmailDelete_deleteHandlerId_";
        })(UnEditedDraftEmailDeleteSessionStorageKeys = Constants.UnEditedDraftEmailDeleteSessionStorageKeys || (Constants.UnEditedDraftEmailDeleteSessionStorageKeys = {}));
        var SensitivityLabelsSessionStorageKeys;
        (function (SensitivityLabelsSessionStorageKeys) {
            SensitivityLabelsSessionStorageKeys.dataForSensitivityLabels = "msdyn_dataForSensitivityLabels";
            SensitivityLabelsSessionStorageKeys.sensitivityLabelsSettingvalue = "msdyn_sensitivityLabelsSettingvalue";
        })(SensitivityLabelsSessionStorageKeys = Constants.SensitivityLabelsSessionStorageKeys || (Constants.SensitivityLabelsSessionStorageKeys = {}));
        var ExpiryTime;
        (function (ExpiryTime) {
            ExpiryTime.ExpiryTimeForSensitivityLabelsSessionStorageInMS = 3600000;
        })(ExpiryTime = Constants.ExpiryTime || (Constants.ExpiryTime = {}));
        var ApiConstants;
        (function (ApiConstants) {
            ApiConstants.AppModule = "appmodule";
            ApiConstants.HTTPMethods = {
                GET: "GET",
                DELETE: "DELETE"
            };
            ApiConstants.Fields = {
                NavigationType: {
                    FieldName: "navigationtype", Type: { SingleSession: 0, MultiSession: 1 }
                }
            };
        })(ApiConstants = Constants.ApiConstants || (Constants.ApiConstants = {}));
        var Actions;
        (function (Actions) {
            Actions.DownloadEmailAsAttachment = "_Downloademailasattachment";
        })(Actions = Constants.Actions || (Constants.Actions = {}));
        var GovernanceAgent;
        (function (GovernanceAgent) {
            GovernanceAgent.ScenarioName = "Human";
            GovernanceAgent.EmailChannelCode = 192350000;
            GovernanceAgent.LogAndBlockDetection = 192350001;
            GovernanceAgent.GovernanceAgentEnabledKey = "GovernanceAgentEnabled";
            GovernanceAgent.GovernanceSettingsName = "msdyn_governanceagent_status";
            GovernanceAgent.GovernanceSettingsId = "fed6c57c-5840-44c6-a789-5fedc7986dc2";
            GovernanceAgent.IsEnabled = "msdyn_isenabled";
            GovernanceAgent.FCSNamespace = "CopilotAgents.GovernanceAgentIntelligence";
            GovernanceAgent.GuardRailFCS = "EnableGuardRailValidation";
            GovernanceAgent.GuardrailShadowModeFCS = "EnableGuardRailShadowMode";
            GovernanceAgent.EMPTY_GUID = "00000000-0000-0000-0000-000000000000";
            GovernanceAgent.FormNotificationScenarioName = "GovernanceGuardRailValidation";
            GovernanceAgent.GuardrailFeedbackDialogName = "GuardrailFeedbackDialog";
            GovernanceAgent.DialogParamFailedGuardrailNames = "param_FailedGuardrailNames";
            GovernanceAgent.DialogParamViolationReasons = "param_ViolationReasons";
            GovernanceAgent.DialogParamEmailId = "param_EmailId";
            GovernanceAgent.DialogParamViolationItems = "param_ViolationItems";
            GovernanceAgent.DialogParamGuardrailExecutionContext = "param_GuardrailExecutionContext";
            GovernanceAgent.DialogParamUserAction = "param_UserAction";
            GovernanceAgent.DialogParamAttachmentSkippedReasons = "param_AttachmentSkippedReasons";
            GovernanceAgent.AttachmentValidationSkippedRuleName = "Attachment Validation Skipped";
            GovernanceAgent.AttachmentSkippedReasonSize = "size";
            GovernanceAgent.AttachmentSkippedReasonCount = "count";
        })(GovernanceAgent = Constants.GovernanceAgent || (Constants.GovernanceAgent = {}));
        var ErrorCodes;
        (function (ErrorCodes) {
            ErrorCodes.PrivilegeErrorCode = 2147746336;
        })(ErrorCodes = Constants.ErrorCodes || (Constants.ErrorCodes = {}));
    })(Constants = Activities.Constants || (Activities.Constants = {}));
})(Activities || (Activities = {}));
var Activities;
(function (Activities) {
    var ClientApi;
    (function (ClientApi) {
        ClientApi.IsUci = Xrm.Internal.isUci();
        function getResourceString(key) {
            try {
                var value = ClientApi.ClientApiAbstracts.Instance().getResourceString(key);
                return value;
            }
            catch (exception) {
                return key;
            }
        }
        ClientApi.getResourceString = getResourceString;
        function getFormUIForRibbon(form) {
            return ClientApi.ClientApiAbstracts.Instance().getFormUi(form);
        }
        ClientApi.getFormUIForRibbon = getFormUIForRibbon;
        function getFormDataForRibbon(form) {
            return ClientApi.ClientApiAbstracts.Instance().getFormData(form);
        }
        ClientApi.getFormDataForRibbon = getFormDataForRibbon;
        var ErrorMessageIdPrefix = "Error_Message_0x";
        var Generic_Error_Mesage = "Generic_ErrorMessage";
        var GenericErrorDialogKey = "Error_In_Dialog_Open";
        function getHexErrorCode(errorCode) {
            var code = errorCode;
            if (code < 0) {
                code = (code + 0xffffffff + 1);
            }
            return code.toString(16).toLowerCase();
        }
        function getErrorMessageKey(errorCode) {
            return ErrorMessageIdPrefix + getHexErrorCode(errorCode);
        }
        function getErrorMessage(errorCode) {
            var completeErrorCode = getErrorMessageKey(errorCode);
            var errorMessage = ClientApi.ClientApiAbstracts.Instance().getResourceString(completeErrorCode);
            if (Activities.Common.Util.IsNullOrEmptyString(errorMessage) || errorMessage === completeErrorCode) {
                return null;
            }
            else {
                return errorMessage;
            }
        }
        function removeRawFromErrorResponse(response) {
            if (response && response.raw) {
                var raw = response.raw, rest = __rest(response, ["raw"]);
                return rest;
            }
            return response;
        }
        ClientApi.removeRawFromErrorResponse = removeRawFromErrorResponse;
        function dialogActionRawFailedCallback(response, telemetryitem) {
            if (!Activities.Common.Util.IsNullOrUndefined(telemetryitem)) {
                var purgedResponse = removeRawFromErrorResponse(response);
                telemetryitem.traceEventError("Error in dialog action.", telemetryitem.scrubJWT(purgedResponse));
                telemetryitem.report();
            }
            try {
                var errorMessage = response.message;
                var jsonResponse = response.raw && JSON.parse(response.raw);
                if (!Activities.Common.Util.IsNullOrUndefined(errorMessage) &&
                    errorMessage.indexOf("{0}") != -1 &&
                    !Activities.Common.Util.IsNullOrUndefined(jsonResponse) &&
                    !Activities.Common.Util.IsNullOrUndefined(jsonResponse._errorFault) &&
                    !Activities.Common.Util.IsNullOrUndefined(jsonResponse._errorFault._annotations)) {
                    var i = 0;
                    while (i < 10) {
                        if (errorMessage.indexOf("{" + i + "}") != -1) {
                            var param = jsonResponse._errorFault._annotations["@Microsoft.PowerApps.CDS.ErrorDetails." + i];
                            if (!Activities.Common.Util.IsNullOrUndefined(param)) {
                                errorMessage = errorMessage.replace("{" + i + "}", param);
                            }
                        }
                        else {
                            break;
                        }
                        i++;
                    }
                }
                var options = {
                    errorCode: response.errorCode,
                    message: errorMessage,
                };
                Xrm.Navigation.openErrorDialog(options);
            }
            catch (exception) {
                Xrm.Navigation.openErrorDialog(response);
            }
        }
        ClientApi.dialogActionRawFailedCallback = dialogActionRawFailedCallback;
        function dialogActionFailedCallback(response, telemetryitem) {
            if (!Activities.Common.Util.IsNullOrUndefined(telemetryitem)) {
                var purgedResponse = removeRawFromErrorResponse(response);
                telemetryitem.traceEventError("Error in dialog action.", purgedResponse);
                telemetryitem.report();
            }
            Xrm.Navigation.openErrorDialog(response);
        }
        ClientApi.dialogActionFailedCallback = dialogActionFailedCallback;
        function dialogOpenFailedCallback(response, telemetryitem) {
            var genericErrorMessage = getResourceString(GenericErrorDialogKey);
            if (!Activities.Common.Util.IsNullOrUndefined(telemetryitem)) {
                telemetryitem.traceEventError("Error opening dialog.", response);
                telemetryitem.report();
            }
            openAlertDialog(genericErrorMessage);
        }
        ClientApi.dialogOpenFailedCallback = dialogOpenFailedCallback;
        function openDialogFailedCallback(response) {
            var genericErrorMessage = getResourceString(GenericErrorDialogKey);
            openAlertDialog(genericErrorMessage);
        }
        ClientApi.openDialogFailedCallback = openDialogFailedCallback;
        function IsMocaOffline() {
            return IsMobileClient() && IsOffline();
        }
        ClientApi.IsMocaOffline = IsMocaOffline;
        function IsOffline() {
            return Xrm.Utility.getGlobalContext().client.getClientState() == Xrm.Constants.ClientStates.offline;
        }
        ClientApi.IsOffline = IsOffline;
        function IsMobileClient() {
            return Xrm.Utility.getGlobalContext().client.getClient() == Xrm.Constants.ClientNames.mobile;
        }
        ClientApi.IsMobileClient = IsMobileClient;
        function IsOutlookClient() {
            return Xrm.Utility.getGlobalContext().client.getClient() == Xrm.Constants.ClientNames.outlook;
        }
        ClientApi.IsOutlookClient = IsOutlookClient;
        function getWindowCenter() {
            return ClientApi.ClientApiAbstracts.Instance().WindowPositionCenter;
        }
        ClientApi.getWindowCenter = getWindowCenter;
        function openAlertDialog(text) {
            return ClientApi.ClientApiAbstracts.Instance().openAlertDialog(text);
        }
        ClientApi.openAlertDialog = openAlertDialog;
        function openDialog(name, options, parameters) {
            return ClientApi.ClientApiAbstracts.Instance().openDialog(name, options, parameters);
        }
        ClientApi.openDialog = openDialog;
        function openConfirmDialog(confirmStrings, options) {
            return ClientApi.ClientApiAbstracts.Instance().openConfirmDialog(confirmStrings, options);
        }
        ClientApi.openConfirmDialog = openConfirmDialog;
        function retrieveRecord(entityName, recordId, options) {
            if (ClientApi.IsMocaOffline()) {
                return Xrm.WebApi.offline.retrieveRecord(entityName, recordId, options);
            }
            else {
                return Xrm.WebApi.online.retrieveRecord(entityName, recordId, options);
            }
        }
        ClientApi.retrieveRecord = retrieveRecord;
        var CommonWebResource = "Activities/Resources/Activities";
        var ClientApiAbstracts = (function () {
            function ClientApiAbstracts() {
                this.WindowPositionCenter = 1;
            }
            ClientApiAbstracts.Instance = function () {
                if (this._clientApi != null) {
                    return this._clientApi;
                }
                if (Xrm.Internal.isUci()) {
                    ClientApiAbstracts._clientApi = new UClientApi();
                }
                else {
                    this._clientApi = new WebClientApi();
                }
                return this._clientApi;
            };
            ClientApiAbstracts.prototype.getResourceString = function (key, webResourceName) {
                if (webResourceName === void 0) { webResourceName = CommonWebResource; }
                return Xrm.Utility.getResourceString(webResourceName, key);
            };
            ClientApiAbstracts.prototype.openAlertDialog = function (text) {
                return Xrm.Navigation.openAlertDialog({ text: text }, null);
            };
            ClientApiAbstracts.prototype.openDialog = function (name, options, parameters) {
                return Xrm.Navigation.openDialog(name, options, parameters);
            };
            ClientApiAbstracts.prototype.openConfirmDialog = function (confirmStrings, options) {
                return Xrm.Navigation.openConfirmDialog(confirmStrings, options);
            };
            return ClientApiAbstracts;
        }());
        ClientApiAbstracts._clientApi = null;
        ClientApi.ClientApiAbstracts = ClientApiAbstracts;
        var UClientApi = (function (_super) {
            __extends(UClientApi, _super);
            function UClientApi() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            UClientApi.prototype.getFormData = function (form) {
                return form.data;
            };
            UClientApi.prototype.getFormUi = function (form) {
                return form.ui;
            };
            return UClientApi;
        }(ClientApiAbstracts));
        var WebClientApi = (function (_super) {
            __extends(WebClientApi, _super);
            function WebClientApi() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            WebClientApi.prototype.getFormData = function (form) {
                return Xrm.Page.data;
            };
            WebClientApi.prototype.getFormUi = function (form) {
                return Xrm.Page.ui;
            };
            return WebClientApi;
        }(ClientApiAbstracts));
    })(ClientApi = Activities.ClientApi || (Activities.ClientApi = {}));
})(Activities || (Activities = {}));
var Activities;
(function (Activities) {
    var PhoneCall = (function () {
        function PhoneCall() {
        }
        PhoneCall.Form_onload = function (executionContext) {
            var telemetryItem = new TelemetryLogger.TelemetryItem(Activities.Constants.EntityNames.PhoneCall, Activities.Constants.TelemetryConstant.EventPhoneCallOnLoad);
            var phoneCallHandler = new Activities.PhoneCallPageHandler();
            Activities.Common.Util.isExecutionContextMissingAndReport(executionContext, telemetryItem);
            phoneCallHandler.setDefaultValues(executionContext.getFormContext(), telemetryItem);
            telemetryItem.report();
        };
        PhoneCall.directionCodeOnChange = function (executionContext) {
            var telemetryItem = new TelemetryLogger.TelemetryItem(Activities.Constants.EntityNames.PhoneCall, Activities.Constants.TelemetryConstant.EventDirectionCodeOnChange);
            Activities.Common.Util.isExecutionContextMissingAndReport(executionContext, telemetryItem);
            var xrmPage = executionContext.getFormContext();
            var oLookUpA = (xrmPage.data.entity.attributes.get("from"));
            var oLookUpB = (xrmPage.data.entity.attributes.get("to"));
            PhoneCall.swapLookups(executionContext, oLookUpA, oLookUpB, telemetryItem);
            telemetryItem.report();
        };
        PhoneCall.swapLookups = function (executionContext, oLookupA, oLookupB, telemetryItem) {
            var xrmPage = executionContext.getFormContext();
            var swapStyle = "single";
            var aoLookupAItems = oLookupA.getValue();
            var aoLookupBItems = oLookupB.getValue();
            var isTrimRequired = false;
            var result = true;
            if (!Activities.Common.Util.IsNull(aoLookupAItems) &&
                aoLookupAItems.length > 1 &&
                !Activities.Common.Util.IsNull(aoLookupBItems) &&
                aoLookupBItems.length > 1) {
                swapStyle = "multi";
            }
            telemetryItem.traceEventInformation("Swap style is " + swapStyle);
            if (swapStyle == "single" &&
                ((!Activities.Common.Util.IsNull(aoLookupAItems) && aoLookupAItems.length > 1) ||
                    (!Activities.Common.Util.IsNull(aoLookupBItems) && aoLookupBItems.length > 1))) {
                telemetryItem.traceEventInformation("Trim required");
                isTrimRequired = true;
                var dialogOptions = {
                    height: 250,
                    width: 350,
                    position: Activities.ClientApi.getWindowCenter(),
                };
                var swapDialogStrings = {
                    title: Activities.ClientApi.getResourceString("Activity_ConfirmSwap_Title"),
                    subtitle: Activities.ClientApi.getResourceString("Activity_ConfirmSwap_Description"),
                    text: Activities.ClientApi.getResourceString("Web.Activities.dlg_confirm_swap.aspx_27") +
                        "\n" +
                        Activities.ClientApi.getResourceString("Web.Activities.dlg_confirm_swap.aspx_30"),
                    confirmButtonLabel: Activities.ClientApi.getResourceString("Activity_ConfirmSwap_OkButton"),
                    cancelButtonLabel: Activities.ClientApi.getResourceString("Button_Label_Cancel"),
                };
                Activities.ClientApi.openConfirmDialog(swapDialogStrings, dialogOptions).then(function (response) {
                    if (response.confirmed) {
                        telemetryItem.traceEventInformation("Trim confirmed");
                        PhoneCall.swapLookupValues(true, isTrimRequired, oLookupA, oLookupB);
                    }
                    else {
                        telemetryItem.traceEventInformation("Trim denied. Resetting direction values");
                        PhoneCall.resetDirectionValues(executionContext);
                    }
                }, null);
                return;
            }
            telemetryItem.traceEventInformation("Trim not required. Swapping.");
            PhoneCall.swapLookupValues(result, isTrimRequired, oLookupA, oLookupB);
        };
        PhoneCall.swapLookupValues = function (result, isTrimRequired, lookupA, lookupB) {
            var lookupAItems = lookupA.getValue(), lookupBItems = lookupB.getValue();
            if (lookupAItems == null) {
                lookupAItems = [];
            }
            if (lookupBItems == null) {
                lookupBItems = [];
            }
            if (isTrimRequired) {
                lookupAItems = PhoneCall.trimLookup(lookupAItems);
                lookupBItems = PhoneCall.trimLookup(lookupBItems);
            }
            lookupA.setValue(lookupBItems);
            lookupB.setValue(lookupAItems);
        };
        PhoneCall.trimLookup = function (lookupItems) {
            if (lookupItems.length > 1) {
                var returnItem = new Array();
                returnItem.push(lookupItems[0]);
                return returnItem;
            }
            else
                return lookupItems;
        };
        PhoneCall.resetDirectionValues = function (executionContext) {
            var directionCode = executionContext.getFormContext().getAttribute("directioncode");
            if (!Activities.Common.Util.IsNull(directionCode)) {
                directionCode.setValue(!directionCode.getValue());
            }
        };
        return PhoneCall;
    }());
    Activities.PhoneCall = PhoneCall;
})(Activities || (Activities = {}));
var Activities;
(function (Activities) {
    var PhoneCallPageHandler = (function (_super) {
        __extends(PhoneCallPageHandler, _super);
        function PhoneCallPageHandler() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._actualDuration = 30;
            _this._defaultPriority = 1;
            return _this;
        }
        PhoneCallPageHandler.prototype.setDefaultValues = function (xrmPage, telemetryItem) {
            _super.prototype.setDefaultValues.call(this, xrmPage, telemetryItem);
            if (!Activities.Common.Util.IsNewEntityForm(xrmPage)) {
                return;
            }
            var directionCode = xrmPage.data.entity.attributes.get("directioncode");
            if (!Activities.Common.Util.IsNull(directionCode)) {
                var currentUser = this.getCurrentUser();
                if (Activities.Common.Util.IsNull(directionCode.getValue()) || directionCode.getValue()) {
                    this.setParty(xrmPage, "from", currentUser, telemetryItem);
                }
                else {
                    this.setParty(xrmPage, "to", currentUser, telemetryItem);
                }
            }
            this.setActualDurationIfNull(xrmPage, telemetryItem);
            this.setDefaultPriority(xrmPage, telemetryItem);
        };
        PhoneCallPageHandler.prototype.setParty = function (xrmPage, attributeName, currentUser, telemetryItem) {
            try {
                var party = (xrmPage.data.entity.attributes.get(attributeName));
                if (!Activities.Common.Util.IsNull(party)) {
                    party.setValue(currentUser);
                    telemetryItem.traceEventInformation("Party value set.");
                }
            }
            catch (exception) {
                telemetryItem.traceEventError("Error setting party value.", exception.message);
            }
        };
        PhoneCallPageHandler.prototype.setActualDurationIfNull = function (xrmPage, telemetryItem) {
            var actualDuration = (xrmPage.data.entity.attributes.get("actualdurationminutes"));
            if (!Activities.Common.Util.IsNull(actualDuration) && Activities.Common.Util.IsNull(actualDuration.getValue())) {
                actualDuration.setValue(this._actualDuration);
                telemetryItem.traceEventInformation("Duration value set.");
            }
        };
        PhoneCallPageHandler.prototype.setDefaultPriority = function (xrmPage, telemetryItem) {
            var priorityAttribute = xrmPage.data.entity.attributes.get("prioritycode");
            if (!Activities.Common.Util.IsNull(priorityAttribute) &&
                Activities.Common.Util.IsNull(priorityAttribute.getValue())) {
                priorityAttribute.setValue(this._defaultPriority);
                telemetryItem.traceEventInformation("Priority value set.");
            }
        };
        return PhoneCallPageHandler;
    }(Activities.ActivityPageHandler));
    Activities.PhoneCallPageHandler = PhoneCallPageHandler;
})(Activities || (Activities = {}));
//# sourceMappingURL=PhoneCall.js.map