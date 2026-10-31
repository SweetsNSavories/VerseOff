/// <reference path="references/TypeDefinitions/XrmClientApi/XrmClassicWebClientApi.d.ts" />
/// <reference path="references/TypeDefinitions/XrmClientApi/XrmClientApiCommand.d.ts" />
/// <reference path="references/TypeDefinitions/XrmClientApi/XrmClientApiGap.d.ts" />
/// <reference path="references/TypeDefinitions/XrmClientApi/XrmInternalApi.d.ts" />
var EmailEngagement;
(function (EmailEngagement) {
    class AddAttachment {
        /// <summary>
        /// Method to check if Follow feature for attachment can be enabled or not
        /// </summary>
        static isFollowAttachmentShown(isUci) {
            if (EmailEngagement.Common.Util.isEmailEngagementAndOneDriveEnabledAtOrgLevel()) {
                const deferred = EmailEngagement.Common.Util.isDocumentManagementEnabled()
                    .then((response) => {
                    if (response) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }, (e) => {
                    console.error(e);
                    return false;
                });
                return deferred;
            }
            else {
                return false;
            }
        }
        // Buttons Handlers
        static followAttachment(formContext, activityMimeAttachmentId) {
            let temeletryItem = new TelemetryLogger.TelemetryItem(EmailEngagement.Constants.EntityNames.ActivityMimeAttachment, EmailEngagement.Constants.TelemetryConstant.EventFollowAttachment);
            if (activityMimeAttachmentId != null) {
                var FollowEmailAttachmentRequest = new Activities.FollowEmailAttachmentRequest(activityMimeAttachmentId);
                return AddAttachment.handleSingleAttachmentFollow(temeletryItem, FollowEmailAttachmentRequest);
            }
        }
        ;
        static unFollowAttachment(formContext, activityMimeAttachmentId) {
            let telemetryItem = new TelemetryLogger.TelemetryItem(EmailEngagement.Constants.EntityNames.ActivityMimeAttachment, EmailEngagement.Constants.TelemetryConstant.EventUnFollowAttachment);
            if (activityMimeAttachmentId != null) {
                var UnfollowEmailAttachmentRequest = new Activities.UnfollowEmailAttachmentRequest(activityMimeAttachmentId);
                return AddAttachment.handleSingleAttachmentFollow(telemetryItem, UnfollowEmailAttachmentRequest);
            }
        }
        ;
        static handleSingleAttachmentFollow(telemetryItem, attachmentRequest) {
            let attachReq = Xrm.WebApi.online.execute(attachmentRequest);
            attachReq.then(function (response) {
                telemetryItem.report();
            }, function (error) {
                telemetryItem.traceEventError("Error while unfollowing.", error.innerror.message);
                telemetryItem.report();
                Xrm.Navigation.openErrorDialog(error);
            });
            return attachReq;
        }
        static followAttachments(formContext, gridControl, records) {
            if (records && records.length > 0) {
                const promises = [];
                // follow each of the selected attachments
                records.forEach(record => {
                    promises.push(AddAttachment.followAttachment(formContext, record.Id));
                });
                Promise.all(promises)
                    .then(() => {
                    gridControl.refresh();
                })
                    .catch((errorResponse) => {
                    // an error occurred while trying to follow the attachment(s)
                    Xrm.Navigation.openAlertDialog({
                        text: errorResponse.message
                    });
                });
            }
        }
        static unFollowAttachments(formContext, gridControl, records) {
            if (records && records.length > 0) {
                const promises = [];
                // unfollow each of the selected attachments
                records.forEach(record => {
                    promises.push(AddAttachment.unFollowAttachment(formContext, record.Id));
                });
                Promise.all(promises)
                    .then(() => {
                    gridControl.refresh();
                })
                    .catch((errorResponse) => {
                    // an error occurred while trying to unfollow the attachment(s)
                    Xrm.Navigation.openAlertDialog({
                        text: errorResponse.message
                    });
                });
            }
        }
        // Enable rules if both followed and unfollowed attachments are clicked.
        static atleastOneAttachmentUnfollowed(formContext, gridControl, records) {
            if (records && records.length > 0) {
                let isShown = false;
                gridControl.getGrid().getSelectedRows().forEach(record => {
                    let entity = record.getData().getEntity();
                    let isFollowed = entity.attributes.getByName("isfollowed").getValue();
                    if (!isFollowed) {
                        isShown = true;
                    }
                });
                return isShown;
            }
            return false;
        }
        static atleastOneAttachmentfollowed(formContext, gridControl, records) {
            if (records && records.length > 0) {
                let isShown = false;
                gridControl.getGrid().getSelectedRows().forEach(record => {
                    let entity = record.getData().getEntity();
                    let isFollowed = entity.attributes.getByName("isfollowed").getValue();
                    if (isFollowed) {
                        isShown = true;
                    }
                });
                return isShown;
            }
            return false;
        }
    }
    EmailEngagement.AddAttachment = AddAttachment;
})(EmailEngagement || (EmailEngagement = {}));
var EmailEngagement;
(function (EmailEngagement) {
    let Common;
    (function (Common) {
        let Util;
        (function (Util) {
            let AttachmentDialogConstants;
            (function (AttachmentDialogConstants) {
                AttachmentDialogConstants.AddAttachmentToActivityDialogName = "AddAttachmentToActivity";
                AttachmentDialogConstants.AttachmentBodyKey = "body";
                AttachmentDialogConstants.AttachmentFileNameKey = "filename";
                AttachmentDialogConstants.AttachmentFileSizeKey = "filesize";
                AttachmentDialogConstants.AttachmentMimeTypeKey = "mimetype";
                AttachmentDialogConstants.AttachmentIsFollowedKey = "isfollowed";
                AttachmentDialogConstants.AttachmentParentEntityEmailLogicalName = "email";
                AttachmentDialogConstants.AttachmentParentEntityAppointmentLogicalName = "appointment";
                AttachmentDialogConstants.ButtonAttachId = "ok_id";
                AttachmentDialogConstants.ButtonCloseId = "cancel_id";
                AttachmentDialogConstants.ButtonOk = "Button_Ok";
                AttachmentDialogConstants.ButtonRemoveId = "remove_id";
                AttachmentDialogConstants.ButtonFollowId = "follow_id";
                AttachmentDialogConstants.ButtonUnFollowId = "donot_follow_id";
                AttachmentDialogConstants.ConfirmAttachmentRemoval = "ConfirmAttachmentRemoval";
                AttachmentDialogConstants.EmptyFile = "EmptyFile";
                AttachmentDialogConstants.FileNameLengthExceeded = "FileNameLengthExceeded";
                AttachmentDialogConstants.FileNotFound = "FileNotFound";
                AttachmentDialogConstants.FileSizeExceeded = "FileSizeExceeded";
                AttachmentDialogConstants.GenericError = "Generic_ErrorMessage";
                AttachmentDialogConstants.InvalidFileExtension = "InvalidFileExtension";
                AttachmentDialogConstants.NonEditableDialog = "NonEditableDialog";
                AttachmentDialogConstants.OrganizationEntityColumnBlockedAttachments = "blockedattachments";
                AttachmentDialogConstants.OrganizationEntityColumnMaxUploadFileSize = "maxuploadfilesize";
                AttachmentDialogConstants.OrganizationEntityLogicalName = "organization";
                AttachmentDialogConstants.OrganizationEntityQuery = "?$select=blockedattachments,maxuploadfilesize";
                AttachmentDialogConstants.ParameterAttachmentId = "param_attachmentId";
                AttachmentDialogConstants.ParameterEntityId = "param_entityId";
                AttachmentDialogConstants.ParameterFileContent = "param_AttachmentFileContent";
                AttachmentDialogConstants.ParameterFileMode = "param_AttachmentFileMode";
                AttachmentDialogConstants.ParameterFileName = "param_AttachmentFileName";
                AttachmentDialogConstants.ParameterFileSize = "param_AttachmentFileSize";
                AttachmentDialogConstants.ParameterFileType = "param_AttachmentFileType";
                AttachmentDialogConstants.ParameterIsFollowed = "param_AttachmentIsFollowed";
                AttachmentDialogConstants.ParameterIsEmailFollowed = "param_IsEmailFollowed";
                AttachmentDialogConstants.ParameterEntityName = "param_EntityName";
                AttachmentDialogConstants.ParameterParentEntityLogicalName = "param_entityName";
                AttachmentDialogConstants.RemovedAttachmentConfirmation = "RemovedAttachmentConfirmation";
                AttachmentDialogConstants.UnsavedChanges = "UnsavedChanges";
                AttachmentDialogConstants.UnsupportedAttachment = "UnsupportedAttachment";
                AttachmentDialogConstants.NewAttachmentFormDescription = "New_Attachment_Form_Description";
                AttachmentDialogConstants.ExistingAttachmentFormDescription = "Existing_Attachment_Form_Description";
                AttachmentDialogConstants.NewAttachmentLabelMessage = "New_Attachment_Label_Message";
                AttachmentDialogConstants.IsEmailFollowed = "isemailfollowed";
            })(AttachmentDialogConstants = Util.AttachmentDialogConstants || (Util.AttachmentDialogConstants = {}));
        })(Util = Common.Util || (Common.Util = {}));
    })(Common = EmailEngagement.Common || (EmailEngagement.Common = {}));
})(EmailEngagement || (EmailEngagement = {}));
var EmailEngagement;
(function (EmailEngagement) {
    let ClientApi;
    (function (ClientApi) {
        ClientApi.IsUci = Xrm.Internal.isUci();
        function getResourceString(key) {
            return ClientApi.ClientApiAbstracts.Instance().getResourceString(key);
        }
        ClientApi.getResourceString = getResourceString;
        //To be moved to Common
        function getFormUIForRibbon(form) {
            return ClientApi.ClientApiAbstracts.Instance().getFormUi(form);
        }
        ClientApi.getFormUIForRibbon = getFormUIForRibbon;
        function getFormDataForRibbon(form) {
            return ClientApi.ClientApiAbstracts.Instance().getFormData(form);
        }
        ClientApi.getFormDataForRibbon = getFormDataForRibbon;
        /// <summary>
        /// Error message resource id prefix
        /// </summary>
        const ErrorMessageIdPrefix = "Error_Message_0x";
        const Generic_Error_Mesage = "Generic_ErrorMessage";
        const GenericErrorDialogKey = "Error_In_Dialog_Open";
        /// <summary>
        /// string of hex format error code
        /// </summary>
        /// <param name="errorCode">The error code </param>
        /// <returns>hex format error code</returns>
        function getHexErrorCode(errorCode) {
            let code = errorCode;
            if (code < 0) {
                // Handle negative decimal values 
                code = (code + 0xFFFFFFFF + 1);
            }
            //Converting the Hex string to lower case to maintain the convention
            return code.toString(16).toLowerCase();
        }
        function getErrorMessageKey(errorCode) {
            return ErrorMessageIdPrefix + getHexErrorCode(errorCode);
        }
        function getErrorMessage(errorCode) {
            let completeErrorCode = getErrorMessageKey(errorCode);
            let errorMessage = ClientApi.ClientApiAbstracts.Instance().getResourceString(completeErrorCode);
            if (EmailEngagement.Common.Util.IsNullOrEmptyString(errorMessage) || errorMessage === completeErrorCode) {
                return null;
            }
            else {
                return errorMessage;
            }
        }
        function dialogActionFailedCallback(response, telemetryitem) {
            if (!EmailEngagement.Common.Util.IsNullOrUndefined(telemetryitem)) {
                telemetryitem.traceEventError("Error in dialog action.", response);
                telemetryitem.report();
            }
            Xrm.Navigation.openErrorDialog(response);
        }
        ClientApi.dialogActionFailedCallback = dialogActionFailedCallback;
        function dialogOpenFailedCallback(response, telemetryitem) {
            let genericErrorMessage = getResourceString(GenericErrorDialogKey);
            if (!EmailEngagement.Common.Util.IsNullOrUndefined(telemetryitem)) {
                telemetryitem.traceEventError("Error opening dialog.", response);
                telemetryitem.report();
            }
            openAlertDialog(genericErrorMessage);
        }
        ClientApi.dialogOpenFailedCallback = dialogOpenFailedCallback;
        function openDialogFailedCallback(response) {
            let genericErrorMessage = getResourceString(GenericErrorDialogKey);
            openAlertDialog(genericErrorMessage);
        }
        ClientApi.openDialogFailedCallback = openDialogFailedCallback;
        function IsMocaOffline() {
            return IsMobileClient() &&
                Xrm.Utility.getGlobalContext().client.getClientState() == Xrm.Constants.ClientStates.offline;
        }
        ClientApi.IsMocaOffline = IsMocaOffline;
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
        // Web resource names for getResources
        const CommonWebResource = "Activities/Resources/Activities";
        class ClientApiAbstracts {
            constructor() {
                this.WindowPositionCenter = 1 /* center */;
            }
            static Instance() {
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
            }
            getResourceString(key, webResourceName = CommonWebResource) {
                return Xrm.Utility.getResourceString(webResourceName, key);
            }
            openAlertDialog(text) {
                return Xrm.Navigation.openAlertDialog({ "text": text }, null);
            }
            openDialog(name, options, parameters) {
                return Xrm.Navigation.openDialog(name, options, parameters);
            }
            openConfirmDialog(confirmStrings, options) {
                return Xrm.Navigation.openConfirmDialog(confirmStrings, options);
            }
        }
        ClientApiAbstracts._clientApi = null;
        ClientApi.ClientApiAbstracts = ClientApiAbstracts;
        class UClientApi extends ClientApiAbstracts {
            getFormData(form) {
                return form.data;
            }
            getFormUi(form) {
                return form.ui;
            }
        }
        class WebClientApi extends ClientApiAbstracts {
            getFormData(form) {
                return Xrm.Page.data;
            }
            getFormUi(form) {
                return Xrm.Page.ui;
            }
        }
    })(ClientApi = EmailEngagement.ClientApi || (EmailEngagement.ClientApi = {}));
})(EmailEngagement || (EmailEngagement = {}));
var EmailEngagement;
(function (EmailEngagement) {
    let Constants;
    (function (Constants) {
        /// <summary>
        /// Empty Guid String
        /// </summary>
        Constants.EmptyGuid = "{00000000-0000-0000-0000-000000000000}";
        /// <summary>
        /// Empty Guid in String format
        /// </summary>
        Constants.EmptyGuidFormatted = "00000000-0000-0000-0000-000000000000";
        let ViewGuids;
        (function (ViewGuids) {
            //Guid reference values here : src/AppCommon/Data/Database/Metadata/Template/savedqueries.xml
            ViewGuids.MyEmailTemplateView = "{4C7BE207-CC89-4BB7-BB61-BBD5076D05C0}";
            ViewGuids.GlobalEmailTemplateView = "{4D5BE2E9-6828-482b-99AA-2387AFED7B37}";
            ViewGuids.AllLanguageEmailTemplateView = "{DAF88706-1DAD-4810-ADC4-1517ED39F575}";
        })(ViewGuids = Constants.ViewGuids || (Constants.ViewGuids = {}));
        let EntityNames;
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
        })(EntityNames = Constants.EntityNames || (Constants.EntityNames = {}));
        let OrgSettingsConstant;
        (function (OrgSettingsConstant) {
            OrgSettingsConstant.EnableInsertSignatureInUCI = "EnableInsertSignatureInUCI";
            OrgSettingsConstant.SaveAsDraftOrgSettingName = "AllowSaveAsDraftAppointment";
            // EnableActivitiesFeatures values for different features. the values are in the powers of 2 starting with 1 (2 power 0)
            OrgSettingsConstant.InsertSignatureFeatureBitValue = "1";
        })(OrgSettingsConstant = Constants.OrgSettingsConstant || (Constants.OrgSettingsConstant = {}));
        //PLEASE TAKE CARE TO FOLLOW THE CONVENTION ON NAMING FOR THE BELOW FCB CONSTANTS
        // if the fcb string has "FCB." prefix, the constant should have FCB as its suffix
        //if the fcb string does not have the FCB. prefix, the constant should have "FCB_" as its prefix
        // Xrm.Internal.IsFeatureEnabled behaves differently between web and UCI
        // for web it honors "FCB." prefix, In UCI it expects without "FCB." prefix.
        // isDisruptive is only for uci works with "FCB." prefix
        let FCBConstant;
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
            FCBConstant.April2020UpdateFCB = "FCB.April2020Update";
            FCBConstant.FCB_April2020Update = "April2020Update";
            FCBConstant.FCB_EmailTemplatePreviewEnhancementsEnabled = "EmailTemplatePreviewEnhancementsEnabled";
            FCBConstant.UnresolvedEmailAddressFeatureFCB = "FCB.UnresolvedEmailAddressFeature";
            FCBConstant.SendBulkEmailInUci = "SendBulkEmailInUci";
            FCBConstant.FCB_ConvertDeletedPartiesToUnresolvedEmails = "ConvertDeletedPartiesToUnresolvedEmails";
            FCBConstant.AnnotationApril2020Update = "FCB.AnnotationApril2020Update";
        })(FCBConstant = Constants.FCBConstant || (Constants.FCBConstant = {}));
        let PerfConstants;
        (function (PerfConstants) {
            PerfConstants.PerfOrgDbOrgSettings = "EnableActivitiesTimeLinePerfImprovement";
            let PerfImprovements;
            (function (PerfImprovements) {
                PerfImprovements[PerfImprovements["FirstStage"] = 1] = "FirstStage";
            })(PerfImprovements = PerfConstants.PerfImprovements || (PerfConstants.PerfImprovements = {}));
        })(PerfConstants = Constants.PerfConstants || (Constants.PerfConstants = {}));
        let AnnotationFields;
        (function (AnnotationFields) {
            AnnotationFields.MimeType = "mimetype";
            AnnotationFields.FileName = "filename";
            AnnotationFields.IsDocument = "isdocument";
            AnnotationFields.DocumentBody = "documentbody";
        })(AnnotationFields = Constants.AnnotationFields || (Constants.AnnotationFields = {}));
        let TelemetryConstant;
        (function (TelemetryConstant) {
            TelemetryConstant.EventName = "EventName";
            TelemetryConstant.StartTime = "StartTime";
            TelemetryConstant.EndTime = "EndTime";
            TelemetryConstant.ExecutionTime = "ExecutionTime";
            TelemetryConstant.BulkEmail = "bulkemail";
            TelemetryConstant.EventSend = "Send";
            TelemetryConstant.EventReply = "Reply";
            TelemetryConstant.EventReplyAll = "ReplyAll";
            TelemetryConstant.EventForward = "Forward";
            TelemetryConstant.EventAddAttachment = "AddAttachment";
            TelemetryConstant.EventInsertEmailTemplate = "InsertEmailTemplate";
            TelemetryConstant.EventInsertTemplate = "InsertTemplate";
            TelemetryConstant.EventPreviewTemplate = "PreviewTemplate";
            TelemetryConstant.EventTemplatePreviewInit = "TemplatePreviewInit";
            TelemetryConstant.EventTemplatePreviewUpdateView = "TemplatePreviewUpdateView";
            TelemetryConstant.EventTemplatePreviewDestroy = "TemplatePreviewDestroy";
            TelemetryConstant.EventAppointmentOnLoad = "AppointmentOnLoad";
            TelemetryConstant.EventRecurringAppointmentMasterOnLoad = "RecurringAppointmentMasterOnLoad";
            TelemetryConstant.EventEmailOnLoad = "EmailOnLoad";
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
            TelemetryConstant.RecurrinAppointmentOnSave = "RecurrinAppointmentOnSave";
            TelemetryConstant.EventBPFNavigationOnAppointmentForm = "BPFNavigationOnAppointmentForm";
            TelemetryConstant.ExecutionContextMissing = "Execution context is missing from the handler";
            TelemetryConstant.TemplatePreviewClicked = "TemplatePreviewClicked";
            TelemetryConstant.EventAnnotationFileDownload = "NoteFileNameClicked";
            TelemetryConstant.EventNoteAttachmentControlUpdateView = "NoteAttachmentControlUpdateView";
            TelemetryConstant.EventNoteRegardingControlUpdateView = "NoteRegardingControlUpdateView";
            TelemetryConstant.EventNoteNavigateToRegarding = "NoteNavigateToRegarding";
            TelemetryConstant.EventNoteRegardingControlInit = "NoteRegardingControlInit";
        })(TelemetryConstant = Constants.TelemetryConstant || (Constants.TelemetryConstant = {}));
        let DialogNames;
        (function (DialogNames) {
            DialogNames.ApplyEmailTemplate = "ApplyEmailTemplate";
            DialogNames.SelectTemplateRecipient = "SelectTemplateRecipient";
            DialogNames.UpdateAttachment = "UpdateAttachment";
            DialogNames.InsertSignature = "InsertSignature";
            DialogNames.AppointmentSchedulingConflict = "AppointmentSchedulingConflict";
            DialogNames.EmailTemplatePreview = "EmailTemplateDialog";
        })(DialogNames = Constants.DialogNames || (Constants.DialogNames = {}));
        let MetadataDrivenDialogConstants;
        (function (MetadataDrivenDialogConstants) {
            // Entity Names
            MetadataDrivenDialogConstants.EmailSignatureEntityName = "emailsignature";
            MetadataDrivenDialogConstants.EmailEntityName = "email";
            MetadataDrivenDialogConstants.TemplateEntityName = "template";
            // Attribute Names
            MetadataDrivenDialogConstants.SubjectAttribute = "subject";
            MetadataDrivenDialogConstants.DescriptionAttribute = "description";
            // Insert Email Template Dialog parameters.
            MetadataDrivenDialogConstants.ParamLastButtonClicked = "param_lastButtonClicked";
            MetadataDrivenDialogConstants.ParamEntityId = "param_entityId";
            MetadataDrivenDialogConstants.ParamEmailFormData = "param_emailFormData";
            MetadataDrivenDialogConstants.ParamEntityType = "param_entityType";
            MetadataDrivenDialogConstants.ParamEmailSubject = "param_emailsubject";
            MetadataDrivenDialogConstants.ParamEmailDescription = "param_emaildescription";
            MetadataDrivenDialogConstants.ParamTemplateId = "param_templateId";
            MetadataDrivenDialogConstants.ParamEmailEntityId = "param_id";
            // Insert Signature dialog parameters.
            MetadataDrivenDialogConstants.ParamSignatureText = "param_signaturetext";
            MetadataDrivenDialogConstants.ParamOwnerId = "param_ownerId";
            // Scheduling Conflict Dialog Constants
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
            MetadataDrivenDialogConstants.AnnotationFileName = "filename";
            MetadataDrivenDialogConstants.AnnotationFileNameAttachmentControl = "filenameattachment";
            MetadataDrivenDialogConstants.AnnotationDocumentAttachedControl = "documentattached";
            MetadataDrivenDialogConstants.AnnotationFileSize = "filesize";
            MetadataDrivenDialogConstants.AnnotationRegardingObjectControl = "regardingobject";
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
            //lookup names
            MetadataDrivenDialogConstants.From = 'from';
            MetadataDrivenDialogConstants.To = 'to';
            MetadataDrivenDialogConstants.Cc = 'cc';
            MetadataDrivenDialogConstants.Bcc = 'bcc';
        })(MetadataDrivenDialogConstants = Constants.MetadataDrivenDialogConstants || (Constants.MetadataDrivenDialogConstants = {}));
        // The order of these should be same as defined in FeatureList dictionary defined in PackageTemplate.cs
        let ActivitiesFeature;
        (function (ActivitiesFeature) {
            ActivitiesFeature.ActivitiesFeatureOrgDbOrgSettings = "EnableActivitiesFeatures";
            let ActivitiesFeatureList;
            (function (ActivitiesFeatureList) {
                ActivitiesFeatureList[ActivitiesFeatureList["EnableInsertSignatureInUCI"] = 1] = "EnableInsertSignatureInUCI";
            })(ActivitiesFeatureList = ActivitiesFeature.ActivitiesFeatureList || (ActivitiesFeature.ActivitiesFeatureList = {}));
        })(ActivitiesFeature = Constants.ActivitiesFeature || (Constants.ActivitiesFeature = {}));
        let AppointmentStatusCode;
        (function (AppointmentStatusCode) {
            AppointmentStatusCode[AppointmentStatusCode["busy"] = 5] = "busy";
        })(AppointmentStatusCode = Constants.AppointmentStatusCode || (Constants.AppointmentStatusCode = {}));
        let AppointmentStateCode;
        (function (AppointmentStateCode) {
            AppointmentStateCode[AppointmentStateCode["open"] = 0] = "open";
            AppointmentStateCode[AppointmentStateCode["completed"] = 1] = "completed";
            AppointmentStateCode[AppointmentStateCode["canceled"] = 2] = "canceled";
            AppointmentStateCode[AppointmentStateCode["scheduled"] = 3] = "scheduled";
        })(AppointmentStateCode = Constants.AppointmentStateCode || (Constants.AppointmentStateCode = {}));
        let SaveMode;
        (function (SaveMode) {
            SaveMode[SaveMode["save"] = 1] = "save";
            SaveMode[SaveMode["saveandclose"] = 2] = "saveandclose";
            SaveMode[SaveMode["deactivate"] = 5] = "deactivate";
            SaveMode[SaveMode["saveascompleted"] = 58] = "saveascompleted";
        })(SaveMode = Constants.SaveMode || (Constants.SaveMode = {}));
        let DateTimeFieldBehavior;
        (function (DateTimeFieldBehavior) {
            DateTimeFieldBehavior[DateTimeFieldBehavior["None"] = 0] = "None";
            DateTimeFieldBehavior[DateTimeFieldBehavior["UserLocal"] = 1] = "UserLocal";
            DateTimeFieldBehavior[DateTimeFieldBehavior["DateOnly"] = 2] = "DateOnly";
            DateTimeFieldBehavior[DateTimeFieldBehavior["TimeZoneIndependent"] = 3] = "TimeZoneIndependent";
        })(DateTimeFieldBehavior = Constants.DateTimeFieldBehavior || (Constants.DateTimeFieldBehavior = {}));
        let AttributeSubmitModes;
        (function (AttributeSubmitModes) {
            //change this to string enum when upgrading to typecript
            AttributeSubmitModes[AttributeSubmitModes["dirty"] = 0] = "dirty";
            AttributeSubmitModes[AttributeSubmitModes["always"] = 1] = "always";
            AttributeSubmitModes[AttributeSubmitModes["never"] = 2] = "never";
        })(AttributeSubmitModes = Constants.AttributeSubmitModes || (Constants.AttributeSubmitModes = {}));
    })(Constants = EmailEngagement.Constants || (EmailEngagement.Constants = {}));
})(EmailEngagement || (EmailEngagement = {}));
var Activities;
(function (Activities) {
    ///// <summary>
    ///// Follow Attachment Request
    ///// </summary>
    class FollowEmailAttachmentRequest {
        constructor(ActivityMimeAttachmentId) {
            this.ActivityMimeAttachmentId = null;
            this.ActivityMimeAttachmentId = null;
            this.ActivityMimeAttachmentId = ActivityMimeAttachmentId;
        }
        getMetadata() {
            const metadata = {
                boundParameter: null,
                parameterTypes: {
                    "ActivityMimeAttachmentId": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    }
                },
                operationName: "FollowEmailAttachment",
                operationType: 0,
            };
            return metadata;
        }
    }
    Activities.FollowEmailAttachmentRequest = FollowEmailAttachmentRequest;
})(Activities || (Activities = {}));
var TelemetryLogger;
(function (TelemetryLogger) {
    class TelemetryConstants {
    }
    TelemetryConstants.EventName = "EventName";
    TelemetryConstants.StartTime = "StartTime";
    TelemetryConstants.EndTime = "EndTime";
    TelemetryConstants.ExecutionTime = "ExecutionTime";
    TelemetryConstants.FeatureUsage = "Feature Usage";
    class TelemetryItem {
        constructor(componentName, eventName) {
            this._componentName = componentName;
            this._eventName = eventName;
            this._traceInformation = ["Start"];
            this._traceWarning = [];
            this._traceError = [];
            this._traceCustom = {};
            this._event = this.createEvent();
        }
        traceEventInformation(message) {
            this._traceInformation.push(message);
        }
        traceEventWarning(message) {
            this._traceWarning.push(message);
        }
        traceEventError(name, exception) {
            this._traceError.push({ name: name, message: exception });
        }
        traceEventCustom(name, value) {
            if (this._traceCustom[name]) {
                this._traceCustom[name].push(value);
            }
            else {
                this._traceCustom[name] = [value];
            }
        }
        traceFeatureUsage(name, value) {
            this.traceEventCustom(TelemetryConstants.FeatureUsage, { name, value });
        }
        report() {
            if (!this._event) {
                return;
            }
            this.traceEventInformation("End");
            this.addEventParameter({ name: "Information", value: this._traceInformation });
            this.addEventParameter({ name: "Warnings", value: this._traceWarning });
            this.addEventParameter({ name: "Errors", value: this._traceError });
            for (let key in this._traceCustom) {
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
        }
        createEvent() {
            const parameters = [];
            parameters.push({ name: TelemetryConstants.EventName, value: this._eventName });
            parameters.push({ name: TelemetryConstants.StartTime, value: new Date() });
            return parameters;
        }
        addEventParameter(parameter) {
            if (this._event != null && parameter.name != null && parameter.value != null) {
                this._event.push(parameter);
            }
        }
        updateEventExecutionTime() {
            if (!this._event || this._event.length < 2) {
                return;
            }
            const eventName = this._event[0].value;
            const start = this._event[1].value;
            if (!eventName || !start) {
                return;
            }
            let end = new Date();
            this.addEventParameter({ name: TelemetryConstants.EndTime, value: end });
            this.addEventParameter({ name: TelemetryConstants.ExecutionTime, value: (end.valueOf() - start.valueOf()) });
        }
    }
    TelemetryLogger.TelemetryItem = TelemetryItem;
})(TelemetryLogger || (TelemetryLogger = {}));
var Activities;
(function (Activities) {
    ///// <summary>
    ///// UnFollow Attachment Request
    ///// </summary>
    class UnfollowEmailAttachmentRequest {
        constructor(ActivityMimeAttachmentId) {
            this.ActivityMimeAttachmentId = null;
            this.ActivityMimeAttachmentId = null;
            this.ActivityMimeAttachmentId = ActivityMimeAttachmentId;
        }
        getMetadata() {
            const metadata = {
                boundParameter: null,
                parameterTypes: {
                    "ActivityMimeAttachmentId": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    }
                },
                operationName: "UnfollowEmailAttachment",
                operationType: 0,
            };
            return metadata;
        }
    }
    Activities.UnfollowEmailAttachmentRequest = UnfollowEmailAttachmentRequest;
})(Activities || (Activities = {}));
var EmailEngagement;
(function (EmailEngagement) {
    let Common;
    (function (Common) {
        let Util;
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
                    telemetryItem.traceEventError(EmailEngagement.Constants.TelemetryConstant.ExecutionContextMissing);
                    telemetryItem.report();
                }
            }
            Util.isExecutionContextMissingAndReport = isExecutionContextMissingAndReport;
            function IsNull(value) {
                return typeof (value) === 'undefined' || typeof (value) === 'unknown' || value == null;
            }
            Util.IsNull = IsNull;
            function IsNotNull(value) {
                return !IsNull(value);
            }
            Util.IsNotNull = IsNotNull;
            function IsNullOrEmptyString(str) {
                return Util.IsNull(str) || (str == '');
            }
            Util.IsNullOrEmptyString = IsNullOrEmptyString;
            function IsNullOrUndefined(value) {
                return null == value || typeof (value) == 'undefined';
            }
            Util.IsNullOrUndefined = IsNullOrUndefined;
            function IsNullOrWhiteSpace(value) {
                return Util.IsNullOrEmptyString(value) || value.trim() == '';
            }
            Util.IsNullOrWhiteSpace = IsNullOrWhiteSpace;
            function ShowMoCAOfflineError() {
                EmailEngagement.ClientApi.openAlertDialog(EmailEngagement.ClientApi.getResourceString("Error_Message_Generic_Mobile_Client_Offline"));
            }
            Util.ShowMoCAOfflineError = ShowMoCAOfflineError;
            function IsNullOrEmptyGuid(guid) {
                return IsNullOrEmptyString(guid) ||
                    convertGuidToString(guid) === EmailEngagement.Constants.EmptyGuidFormatted;
            }
            Util.IsNullOrEmptyGuid = IsNullOrEmptyGuid;
            function IsNewEntityForm(formContext) {
                return formContext.ui.getFormType() == 1 /* Create */;
            }
            Util.IsNewEntityForm = IsNewEntityForm;
            function GetEntityNames(records) {
                let activityEntityNames = {};
                for (let i = 0; i < records.length; i++) {
                    if (activityEntityNames[records[i].TypeName] == undefined)
                        activityEntityNames[records[i].TypeName] = [];
                }
                return activityEntityNames;
            }
            Util.GetEntityNames = GetEntityNames;
            function CheckIfIsReadOnlyInMobileClient(values) {
                let returnValue = false;
                for (let index = 0; index < values.length; index++) {
                    var value = values[index];
                    if (value["IsReadOnlyInMobileClient"] == true) {
                        returnValue = true;
                        break;
                    }
                }
                if (returnValue) {
                    let errorStrings = {
                        text: EmailEngagement.ClientApi.getResourceString("ReadOnlyEntity"),
                        confirmButtonLabel: EmailEngagement.ClientApi.getResourceString("Button_Ok")
                    };
                    Xrm.Navigation.openAlertDialog(errorStrings);
                }
                return returnValue;
            }
            Util.CheckIfIsReadOnlyInMobileClient = CheckIfIsReadOnlyInMobileClient;
            function isOneDriveFCBEnabled(isUci) {
                if (isUci) {
                    return Xrm.Internal.isFeatureEnabled(EmailEngagement.Constants.FCBConstant.OneDriveIntegrationFCB) || Xrm.Internal.isFeatureEnabled(EmailEngagement.Constants.FCBConstant.FCB_OneDriveIntegration);
                }
                else {
                    return Xrm.Internal.isFeatureEnabled(EmailEngagement.Constants.FCBConstant.OneDriveIntegrationFCB);
                }
            }
            Util.isOneDriveFCBEnabled = isOneDriveFCBEnabled;
            function isEmailEnhancementsFeatureEnabled(featureFCBName) {
                if (Xrm.Internal.isUci()) {
                    return Xrm.Internal.isDisruptiveFeatureEnabled(featureFCBName, EmailEngagement.Constants.FCBConstant.April2020UpdateFCB);
                }
                else {
                    return Xrm.Internal.isFeatureEnabled(featureFCBName) && Xrm.Internal.isFeatureEnabled(EmailEngagement.Constants.FCBConstant.April2020UpdateFCB);
                }
            }
            Util.isEmailEnhancementsFeatureEnabled = isEmailEnhancementsFeatureEnabled;
            function isEmailEngagementFCBEnabled(isUci) {
                if (isUci) {
                    return Xrm.Internal.isFeatureEnabled(EmailEngagement.Constants.FCBConstant.EmailEngagementFCB) || Xrm.Internal.isFeatureEnabled(EmailEngagement.Constants.FCBConstant.FCB_EmailEngagement);
                }
                else {
                    return Xrm.Internal.isFeatureEnabled(EmailEngagement.Constants.FCBConstant.EmailEngagementFCB);
                }
            }
            Util.isEmailEngagementFCBEnabled = isEmailEngagementFCBEnabled;
            function isSharePointFCBEnabled(isUci) {
                if (isUci) {
                    return Xrm.Internal.isFeatureEnabled(EmailEngagement.Constants.FCBConstant.SharePointS2SFCB) || Xrm.Internal.isFeatureEnabled(EmailEngagement.Constants.FCBConstant.FCB_SharePointS2S);
                }
                else {
                    return Xrm.Internal.isFeatureEnabled(EmailEngagement.Constants.FCBConstant.SharePointS2SFCB);
                }
            }
            Util.isSharePointFCBEnabled = isSharePointFCBEnabled;
            function isEmailEngagementAndOneDriveEnabledAtOrgLevel() {
                return Xrm.Utility.getGlobalContext().organizationSettings.attributes["isonedriveenabled"] && Xrm.Utility.getGlobalContext().organizationSettings.attributes["isemailmonitoringallowed"];
            }
            Util.isEmailEngagementAndOneDriveEnabledAtOrgLevel = isEmailEngagementAndOneDriveEnabledAtOrgLevel;
            function isSendBulkEmailInUciEnabledAtOrgLevel() {
                let attrs = Xrm.Utility.getGlobalContext().organizationSettings.attributes;
                if (IsNullOrUndefined(attrs) || IsNullOrUndefined(attrs["sendbulkemailinuci"])) {
                    return false;
                }
                return attrs["sendbulkemailinuci"] == "1";
            }
            Util.isSendBulkEmailInUciEnabledAtOrgLevel = isSendBulkEmailInUciEnabledAtOrgLevel;
            function resolveSimilarUnresolvedAddresses() {
                let attrs = Xrm.Utility.getGlobalContext().organizationSettings.attributes;
                if (IsNullOrUndefined(attrs) || IsNullOrUndefined(attrs["resolvesimilarunresolvedemailaddress"])) {
                    return true; //the default value of this setting is 1.
                }
                return attrs["resolvesimilarunresolvedemailaddress"] == "1";
            }
            Util.resolveSimilarUnresolvedAddresses = resolveSimilarUnresolvedAddresses;
            function allowUnresolvedPartiesOnEmailSend() {
                let attrs = Xrm.Utility.getGlobalContext().organizationSettings.attributes;
                if (IsNullOrUndefined(attrs) || IsNullOrUndefined(attrs["allowunresolvedpartiesonemailsend"])) {
                    return false; //the default value of this setting is 0.
                }
                return attrs["allowunresolvedpartiesonemailsend"] == "1";
            }
            Util.allowUnresolvedPartiesOnEmailSend = allowUnresolvedPartiesOnEmailSend;
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
                    return Xrm.Internal.isFeatureEnabled(EmailEngagement.Constants.FCBConstant.EmailEngagementActionFCB) || Xrm.Internal.isFeatureEnabled(EmailEngagement.Constants.FCBConstant.FCB_EmailEngagementAction);
                }
                else {
                    return Xrm.Internal.isFeatureEnabled(EmailEngagement.Constants.FCBConstant.EmailEngagementActionFCB);
                }
            }
            Util.isEmailEngagementActionsFCBEnabled = isEmailEngagementActionsFCBEnabled;
            function isAnnotation2020UpdateFCBEnabled() {
                if (Xrm.Internal.isUci()) {
                    return Xrm.Internal.isDisruptiveFeatureEnabled(EmailEngagement.Constants.FCBConstant.AnnotationApril2020Update, EmailEngagement.Constants.FCBConstant.April2020UpdateFCB);
                }
                return false;
            }
            Util.isAnnotation2020UpdateFCBEnabled = isAnnotation2020UpdateFCBEnabled;
            function isResolveUnknownEmailsFCBEnabled() {
                if (Xrm.Internal.isUci()) {
                    return !EmailEngagement.ClientApi.IsMocaOffline() && Xrm.Internal.isDisruptiveFeatureEnabled(EmailEngagement.Constants.FCBConstant.UnresolvedEmailAddressFeatureFCB, EmailEngagement.Constants.FCBConstant.April2020UpdateFCB);
                }
                return false;
            }
            Util.isResolveUnknownEmailsFCBEnabled = isResolveUnknownEmailsFCBEnabled;
            function enableActivitiesTimeLinePerfImprovement(stage) {
                // The perf improvement will retrun false in case of webclient and will return value based on bitmask value set in case of UCI
                if (Xrm.Internal.isUci()) {
                    let perfOrgDbOrgSettings = +this.getOrgDbOrgSettingValue(EmailEngagement.Constants.PerfConstants.PerfOrgDbOrgSettings, "0");
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
            function isEmailTemplatePreviewFeatureOn(xrmPage) {
                let limitedHeight = 400;
                let limitedWidth = 650;
                // Bug1645736 : The new dialog doesn't render above 110% defaults to older dialog.
                // viewport corresponds to the body of the form and does not include the navigation, header, footer or form assistant areas of the page
                // So adding offset value
                let offset = 225;
                let pageHeight = xrmPage.ui.getViewPortHeight() + offset;
                let pageWidth = xrmPage.ui.getViewPortWidth() + offset;
                if (Xrm.Internal.isUci()) {
                    return Xrm.Internal.isFeatureEnabled(EmailEngagement.Constants.FCBConstant.FCB_April2020Update)
                        && Xrm.Internal.isFeatureEnabled(EmailEngagement.Constants.FCBConstant.FCB_EmailTemplatePreviewEnhancementsEnabled)
                        && pageHeight > limitedHeight && pageWidth > limitedWidth;
                }
                return false;
            }
            Util.isEmailTemplatePreviewFeatureOn = isEmailTemplatePreviewFeatureOn;
            function isActivitiesFeatureEnable(featureName, defaultValue) {
                let activitiesFeatureEnableSettings = +this.getOrgDbOrgSettingValue(EmailEngagement.Constants.ActivitiesFeature.ActivitiesFeatureOrgDbOrgSettings, defaultValue);
                return (activitiesFeatureEnableSettings & featureName) == featureName;
            }
            Util.isActivitiesFeatureEnable = isActivitiesFeatureEnable;
            function enableInsertSignatureInUCI() {
                // This function will return true in case the insert signature feature is enabled in UCI and false in all other scenarios
                if (Xrm.Internal.isUci()) {
                    return this.isActivitiesFeatureEnable(EmailEngagement.Constants.ActivitiesFeature.ActivitiesFeatureList.EnableInsertSignatureInUCI, EmailEngagement.Constants.OrgSettingsConstant.InsertSignatureFeatureBitValue);
                }
                else {
                    return false;
                }
            }
            Util.enableInsertSignatureInUCI = enableInsertSignatureInUCI;
            /**
             * get the orgDbOrgSetting value if it exists. Required a dependency on the organization entity's orgDbOrgSetting attribute
             * returns false if offline as it can't be assumed that organization entity is available for offline
             * @param orgDbOrgSettingName the orgDbOrgSetting name
             * @param defaultValue the default value to return if the setting is not available
             */
            function getOrgDbOrgSettingValue(orgDbOrgSettingName, defaultValue) {
                if (IsNullOrEmptyString(orgDbOrgSettingName) || EmailEngagement.ClientApi.IsMocaOffline()) {
                    return defaultValue;
                }
                let xmlParser = new DOMParser();
                if (ActivityHelper.orgDbOrgSettingsXml === undefined) {
                    try {
                        let attrs = Xrm.Utility.getGlobalContext().organizationSettings.attributes;
                        if (Xrm.Internal.isUci()) {
                            // Check if the attrs is populated or not
                            if (!IsNullOrUndefined(attrs)) {
                                ActivityHelper.orgDbOrgSettingsXml = attrs["orgdborgsettings"] ? xmlParser.parseFromString(attrs["orgdborgsettings"], "text/xml") : null;
                            }
                            else {
                                // if for some reason we are not getting the organizationSettings attributes, then return the default value.
                                return defaultValue;
                            }
                        }
                        else {
                            if (!IsNullOrUndefined(attrs)) {
                                ActivityHelper.orgDbOrgSettingsXml = attrs.orgDBOrgSettings ? xmlParser.parseFromString(attrs.orgDBOrgSettings, "text/xml") : null;
                            }
                        }
                    }
                    catch (Exception) {
                        return defaultValue;
                    }
                }
                let orgDbOrgSettingsXml = ActivityHelper.orgDbOrgSettingsXml;
                if (Common.Util.IsNullOrUndefined(orgDbOrgSettingsXml) || orgDbOrgSettingsXml.documentElement == null) {
                    return defaultValue;
                }
                var orgDbOrgSettingNode = orgDbOrgSettingsXml.documentElement.getElementsByTagName(orgDbOrgSettingName);
                return orgDbOrgSettingNode == null || orgDbOrgSettingNode.length <= 0 ? null : (orgDbOrgSettingNode[0].textContent == null ? null : orgDbOrgSettingNode[0].textContent.toLowerCase());
            }
            Util.getOrgDbOrgSettingValue = getOrgDbOrgSettingValue;
            // XHR wrapped in a promise
            function sendRequest(url, addOdataHeaders, telemetryItem) {
                return new Promise((resolve, reject) => {
                    const request = new XMLHttpRequest();
                    request.open("GET", url); //change it to POST or get?
                    if (addOdataHeaders) {
                        request.setRequestHeader("odata-maxversion", "4.0");
                        request.setRequestHeader("odata-version", "4.0");
                        request.setRequestHeader("prefer", 'odata.include-annotations="*"');
                    }
                    request.onreadystatechange = () => {
                        // Mimic Fetch Response object when ready state is 4.
                        if (request.readyState === 4) {
                            const responseBodyInAPromise = () => {
                                return Promise.resolve(JSON.parse(request.responseText));
                            };
                            const isSuccess = request.status === 200;
                            resolve({
                                ok: isSuccess,
                                status: request.status,
                                statusText: request.statusText,
                                json: responseBodyInAPromise,
                                text: responseBodyInAPromise,
                                url: url,
                            });
                            reject = error => {
                                telemetryItem.traceEventError("Exception occured while executing XHR request: " + error);
                                reject(error);
                            };
                        }
                    };
                    request.send();
                });
            }
            Util.sendRequest = sendRequest;
            // function to parse json response.
            function parseJsonResponse(response, telemetryItem) {
                return Promise.resolve().then(() => {
                    if (!response) {
                        telemetryItem.traceEventError("Null response from server for request : " + response.url);
                    }
                    else {
                        const contentTypeHeader = getHttpHeader(response.headers, "Content-Type");
                        if (contentTypeHeader && contentTypeHeader.indexOf("text/html") > -1) {
                            return response.text().then(text => {
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
                let headerValue = headers.get(headerName);
                if (!headerValue) {
                    headerValue = headers.get(headerName.toLowerCase());
                }
                return headerValue;
            }
            /**
         * Prepares an XHR request to retrieve relationships metadata for list of lookup attributes.
         * Note: Even though this method generically handles for ownerid attribute as well, but currently we are not passing fetching the relationship metadata for ownerid attribute.
         * @param attributeNames the list of lookup attributes.
         * @param telemetryItem telemetry item.
         * @param addOwnerFilter adds the owner attribute filter in the url.
         * @param isActivity true if the referencing entity is an activity otherwise false.
         */
            function getRelationshipsMetadataForLookups(referencingEntityName, attributeNameValuePairs, telemetryItem, addOwnerFilter = false, isActivity = true) {
                var filterStart = "&$filter=(";
                var filterEnd = ")";
                var referencingEntityFilter = "ReferencingEntity eq '" + referencingEntityName + "'";
                var attributeFilters;
                var filter;
                var url = Xrm.Utility.getGlobalContext().getClientUrl()
                    + "/api/data/v9.0/RelationshipDefinitions/Microsoft.Dynamics.CRM.OneToManyRelationshipMetadata?$select=ReferencingEntityNavigationPropertyName,ReferencingAttribute,ReferencingEntity,ReferencedEntity";
                // Create attribute filters
                for (const attributeName in attributeNameValuePairs) {
                    if (IsNullOrUndefined(attributeNameValuePairs[attributeName]) || attributeName === "ownerid") {
                        continue;
                    }
                    var attributeFilter = "(ReferencedEntity eq '" + attributeNameValuePairs[attributeName][0].entityType + "'"
                        + " and ReferencingAttribute eq '" + attributeName + "')";
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
                // for ownerid attribute the refereced entity is "owner" and not systemuser or team, hence the hardcoding for referenced entity.
                // also for activities to owner relationship the referenceing entity is the activitypointer entity.
                if (addOwnerFilter) {
                    var referencingEntity = isActivity ? "activitypointer" : referencingEntityName;
                    if (!IsNullOrUndefined(attributeFilters)) {
                        filter += "or ";
                    }
                    filter += "(ReferencingEntity eq '" + referencingEntity + "' and ReferencedEntity eq 'owner' and ReferencingAttribute eq 'ownerid')";
                }
                filter += filterEnd;
                if (filter.length === "&$filter=()".length) {
                    // todo: skip making this network call. Since its some work to mock the response object keeping this for future work.
                    // for now just don't add the filter to the url.
                }
                else {
                    var url = url + filter;
                }
                telemetryItem.traceEventInformation("Url for relationship metadata query: " + url);
                return Activities.Common.Util.sendRequest(url, true, telemetryItem);
            }
            Util.getRelationshipsMetadataForLookups = getRelationshipsMetadataForLookups;
            /**
             * returns the error or inner error message
         * @param error the error.
         */
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
            /**
            * Gets AttachmentId from email body
            * @param body email body which would be html with image tags
            */
            function getAttachmentIdsFromEmailBody(body) {
                let mimeAttachmentIds = [];
                if (body) {
                    // get id's from download.aspx uri's && data-attachment-id attributes
                    var downloadUriRegex = /img[^>]+src=[^>]+&attachmentid=(.+?)("|')/gi;
                    var dataAttachmentIdRegex = /img[^>]+data-attachment-id[^>]+?("|')([^'"]+?)("|')/gi;
                    let match;
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
        })(Util = Common.Util || (Common.Util = {}));
        class ActivityHelper {
            static setFocusToSubject(form, telemetryItem) {
                try {
                    let subjectControl = form.ui.controls.get("subject");
                    subjectControl.setFocus();
                }
                catch (exception) {
                    telemetryItem.traceEventError("Error setting focus to subject control.", exception.message);
                }
            }
            static setOwner(formContext, telemetryItem) {
                let ownerId = formContext.getAttribute("ownerid");
                try {
                    if (Common.Util.IsNotNull(ownerId) && (Common.Util.IsNullOrUndefined(ownerId.getValue()) || ownerId.getValue().length == 0)
                        && formContext.ui.getFormType() !== 2 /* Update */) {
                        ownerId.setValue(ActivityHelper.getCurrentUser());
                    }
                }
                catch (exception) {
                    telemetryItem.traceEventError("Error setting owner value.", exception.message);
                }
            }
            static setOrganizer(formContext, telemetryItem) {
                try {
                    let organizer = formContext.getAttribute("organizer");
                    if ((organizer) && (Common.Util.IsNullOrUndefined(organizer.getValue()) || organizer.getValue().length == 0)
                        && formContext.ui.getFormType() !== 2 /* Update */) {
                        let ownerId = formContext.getAttribute("ownerid");
                        if ((ownerId) && (ownerId.getValue())) {
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
            }
            static getCurrentUser() {
                let owner = [];
                owner.push({
                    id: Xrm.Utility.getGlobalContext().userSettings.userId,
                    name: Xrm.Utility.getGlobalContext().userSettings.userName,
                    entityType: "systemuser"
                });
                return owner;
            }
            static getParticipationTypeMask(entityName, columnName) {
                let participationTypeMask = {
                    "appointment": { "optionalattendees": 6, "organizer": 7, "requiredattendees": 5 },
                    "campaignactivity": { "partners": 1, "from": 1 },
                    "campaignresponse": { "customer": 11, "partner": 11, "from": 11 },
                    "email": { "bcc": 4, "cc": 3, "from": 1, "to": 2 },
                    "fax": { "from": 1, "to": 2 },
                    "letter": { "bcc": 4, "from": 1, "to": 2 },
                    "phonecall": { "from": 1, "to": 2 },
                    "recurringappointmentmaster": { "optionalattendees": 6, "organizer": 7, "requiredattendees": 5 },
                    "serviceappointment": { "customers": 11, "resources": 10 }
                };
                const entityMasksTypes = participationTypeMask[entityName];
                if (!entityMasksTypes) {
                    return null;
                }
                return entityMasksTypes[columnName];
            }
            static convertServerTimeToUserLocalTime(datetime) {
                datetime = new Date(datetime);
                if (Xrm.Internal.isUci())
                    datetime.setMinutes(datetime.getMinutes() + datetime.getTimezoneOffset() + Xrm.Utility.getGlobalContext().userSettings.getTimeZoneOffsetMinutes());
                return datetime;
            }
            static convertUserLocalTimeToServerTime(datetime) {
                datetime = new Date(datetime);
                if (Xrm.Internal.isUci())
                    datetime.setMinutes(datetime.getMinutes() - datetime.getTimezoneOffset() - Xrm.Utility.getGlobalContext().userSettings.getTimeZoneOffsetMinutes());
                return datetime;
            }
            static setAttributeValue(eventContext, attributeId, value) {
                var attribute = eventContext.getFormContext().data.attributes.get(attributeId);
                if (attribute != null) {
                    attribute.setValue(value);
                }
            }
            ;
            static closeDialog(eventContext) {
                var lastButtonClicked = eventContext.getFormContext().data.attributes.get(EmailEngagement.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked);
                if (lastButtonClicked != null) {
                    lastButtonClicked.setValue(EmailEngagement.Constants.MetadataDrivenDialogConstants.DialogCancelId);
                }
                eventContext.getFormContext().ui.close();
            }
            ;
        }
        Common.ActivityHelper = ActivityHelper;
    })(Common = EmailEngagement.Common || (EmailEngagement.Common = {}));
})(EmailEngagement || (EmailEngagement = {}));
//# sourceMappingURL=AttachmentControl.js.map