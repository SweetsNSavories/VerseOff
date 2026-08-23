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
/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
var BookUtils;
(function (BookUtils) {
    'use strict';
    /* tslint:disable:crm-force-fields-private */
    var BookRequest = (function () {
        function BookRequest(target /*Microsoft.Dynamics.CRM.crmbaseentity*/, returnNotifications) {
            this.Target = target;
            this.ReturnNotifications = returnNotifications;
        }
        BookRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "Target": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5,
                    },
                    "ReturnNotifications": {
                        "typeName": "Edm.Boolean",
                        "structuralProperty": 1,
                    },
                },
                operationName: "Book",
                operationType: 0,
            };
            return metadata;
        };
        return BookRequest;
    }());
    BookUtils.BookRequest = BookRequest;
})(BookUtils || (BookUtils = {}));
var BookUtils;
(function (BookUtils) {
    var Constants;
    (function (Constants) {
        var EntityNames;
        (function (EntityNames) {
            EntityNames.ServiceAppointmentEntityType = "Microsoft.Dynamics.CRM.serviceappointment";
            EntityNames.ServiceAppointment = "serviceappointment";
            EntityNames.Service = "service";
            EntityNames.Site = "site";
            EntityNames.Resource = "resource";
            EntityNames.ResourceSpec = "resourcespec";
            EntityNames.AvailableTimes = "availabletimes";
        })(EntityNames = Constants.EntityNames || (Constants.EntityNames = {}));
        var TelemetryConstant;
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
            TelemetryConstant.EventAddAttachmentOctober2020 = "AddAttachmentOctober2020";
            TelemetryConstant.EventPreviewAttachmentOctober2020 = "PreviewAttachmentOctober2020";
            TelemetryConstant.EventDownloadAttachmentOctober2020 = "DownloadAttachmentOctober2020";
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
        var DialogNames;
        (function (DialogNames) {
            DialogNames.ServiceAppointmentConflict = "ServiceAppointmentConflict";
        })(DialogNames = Constants.DialogNames || (Constants.DialogNames = {}));
        var MetadataDrivenDialogConstants;
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
            MetadataDrivenDialogConstants.DefaultLookupName = "default";
            MetadataDrivenDialogConstants.LanguageId = "language_id";
            MetadataDrivenDialogConstants.SaveControlId = "sa_save_id";
            MetadataDrivenDialogConstants.ScheduleControlId = "sa_schedule_id";
            MetadataDrivenDialogConstants.ConflictDialogDescription1ControlId = "sa_description1_id";
            MetadataDrivenDialogConstants.ConflictDialogDescription2ControlId = "sa_description2_id";
            MetadataDrivenDialogConstants.ProgressValue = 40;
            MetadataDrivenDialogConstants.ProgressMinValue = 0;
            MetadataDrivenDialogConstants.ProgressMaxValue = 100;
            MetadataDrivenDialogConstants.DialogOkId = "ok_id";
            MetadataDrivenDialogConstants.DialogCancelId = "sa_cancel_id";
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
        var StatusCode;
        (function (StatusCode) {
            StatusCode[StatusCode["Requested"] = 1] = "Requested";
            StatusCode[StatusCode["Tentative"] = 2] = "Tentative";
            StatusCode[StatusCode["Pending"] = 3] = "Pending";
            StatusCode[StatusCode["Reserved"] = 4] = "Reserved";
            StatusCode[StatusCode["InProgress"] = 6] = "InProgress";
            StatusCode[StatusCode["Arrived"] = 7] = "Arrived";
            StatusCode[StatusCode["Completed"] = 8] = "Completed";
            StatusCode[StatusCode["Canceled"] = 9] = "Canceled";
            StatusCode[StatusCode["NoShow"] = 10] = "NoShow";
        })(StatusCode = Constants.StatusCode || (Constants.StatusCode = {}));
        var StateCode;
        (function (StateCode) {
            StateCode[StateCode["Open"] = 0] = "Open";
            StateCode[StateCode["Close"] = 1] = "Close";
            StateCode[StateCode["Canceled"] = 2] = "Canceled";
            StateCode[StateCode["Scheduled"] = 3] = "Scheduled";
        })(StateCode = Constants.StateCode || (Constants.StateCode = {}));
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
        var DateOptionSet;
        (function (DateOptionSet) {
            DateOptionSet[DateOptionSet["AsSoonAsPossible"] = 1] = "AsSoonAsPossible";
            DateOptionSet[DateOptionSet["SpecificDate"] = 2] = "SpecificDate";
            DateOptionSet[DateOptionSet["RangeOfDates"] = 3] = "RangeOfDates";
            DateOptionSet[DateOptionSet["Today"] = 4] = "Today";
            DateOptionSet[DateOptionSet["Tomorrow"] = 5] = "Tomorrow";
            DateOptionSet[DateOptionSet["ThisWeek"] = 6] = "ThisWeek";
            DateOptionSet[DateOptionSet["NextWeek"] = 7] = "NextWeek";
            DateOptionSet[DateOptionSet["NextMonth"] = 8] = "NextMonth";
        })(DateOptionSet = Constants.DateOptionSet || (Constants.DateOptionSet = {}));
        var TimeOptionSet;
        (function (TimeOptionSet) {
            TimeOptionSet[TimeOptionSet["AnyTime"] = 1] = "AnyTime";
            TimeOptionSet[TimeOptionSet["SpecificTime"] = 2] = "SpecificTime";
            TimeOptionSet[TimeOptionSet["RangeOfTimes"] = 3] = "RangeOfTimes";
            TimeOptionSet[TimeOptionSet["Morning"] = 4] = "Morning";
            TimeOptionSet[TimeOptionSet["Afternoon"] = 5] = "Afternoon";
            TimeOptionSet[TimeOptionSet["Evening"] = 6] = "Evening";
        })(TimeOptionSet = Constants.TimeOptionSet || (Constants.TimeOptionSet = {}));
        var AttributeSubmitModes;
        (function (AttributeSubmitModes) {
            //change this to string enum when upgrading to typecript
            AttributeSubmitModes[AttributeSubmitModes["dirty"] = 0] = "dirty";
            AttributeSubmitModes[AttributeSubmitModes["always"] = 1] = "always";
            AttributeSubmitModes[AttributeSubmitModes["never"] = 2] = "never";
        })(AttributeSubmitModes = Constants.AttributeSubmitModes || (Constants.AttributeSubmitModes = {}));
        var ControlTexts;
        (function (ControlTexts) {
            ControlTexts.UCIFormSaving = "UCI.Form.Saving";
            ControlTexts.IgnoreAndSaveButtonDesc = "Dialog_SchedulingConflict_IgnoreAndSave_Button";
        })(ControlTexts = Constants.ControlTexts || (Constants.ControlTexts = {}));
        var Regex;
        (function (Regex) {
            Regex.RegexNums = "{-?[0-9]+}";
            Regex.RegexFlag = "g";
        })(Regex = Constants.Regex || (Constants.Regex = {}));
        var AttributeTypes;
        (function (AttributeTypes) {
            AttributeTypes.Lookup = "lookup";
            AttributeTypes.MultiSelectOptionSet = "multiselectoptionset";
            AttributeTypes.Datetime = "datetime";
        })(AttributeTypes = Constants.AttributeTypes || (Constants.AttributeTypes = {}));
        var InternalAttributeNames;
        (function (InternalAttributeNames) {
            InternalAttributeNames.SlotRecords = "slotRecords";
            InternalAttributeNames.ResourcesJson = "resourcesJson";
            InternalAttributeNames.SelectedSlot = "selected_slot";
            InternalAttributeNames.SelectedRecord = "selected_record";
        })(InternalAttributeNames = Constants.InternalAttributeNames || (Constants.InternalAttributeNames = {}));
        var AttributeNames;
        (function (AttributeNames) {
            AttributeNames.Resources = "resources";
            AttributeNames.Customers = "customers";
            AttributeNames.Site = "site";
            AttributeNames.SiteId = "siteid";
            AttributeNames.ParticipationTypeMask = "participationtypemask";
            AttributeNames.PartyId = "partyid";
            AttributeNames.ODataBind = "@odata.bind";
            AttributeNames.ODataType = "@odata.type";
            AttributeNames.StateCode = "statecode";
            AttributeNames.StatusCode = "statuscode";
            AttributeNames.ServiceAppointmentActivityParties = "serviceappointment_activity_parties";
            AttributeNames.ScheduledStart = "scheduledstart";
            AttributeNames.ScheduledEnd = "scheduledend";
            AttributeNames.ScheduledDurationMinutes = "scheduleddurationminutes";
            AttributeNames.IsAllDayEvent = "isalldayevent";
            AttributeNames.ServiceId = "serviceid";
            AttributeNames.FooterStateCode = "footer_statecode";
            AttributeNames.Duration = "duration";
            AttributeNames.FindSlotGridControlId = "findSlotGridControl_id";
            AttributeNames.ServiceIds = "service_ids";
            AttributeNames.ServiceIdsReadOnly = "service_ids_read_only";
            AttributeNames.FormAssistantServiceField = "form_assistant_service_id";
            AttributeNames.SiteIds = "site_ids";
            AttributeNames.SiteIdsReadOnly = "site_ids_read_only";
            AttributeNames.AvailableTimesTab = "AvailableTimesTab";
            AttributeNames.FormAssistantTab = "FormAssistantTab";
            AttributeNames.ScheduleTab = "ScheduleTab";
            AttributeNames.ParamServiceId = "param_serviceId";
            AttributeNames.ParamServiceAppointmentId = "param_serviceAppointmentId";
            AttributeNames.ParamSiteId = "param_siteId";
            AttributeNames.ParamResourceId = "param_resourceId";
            AttributeNames.ParamDuration = "param_duration";
            AttributeNames.ParamTargetentities = "param_targetentities";
            AttributeNames.ParamSystemUserEquipments = "systemuser,equipment";
            AttributeNames.ParamSelectedresources = "param_selectedresources";
            AttributeNames.ParamTargetEntitiesCustomers = "param_targetentitiescustomers";
            AttributeNames.ParamAccountContact = "account,contact";
            AttributeNames.ParamSelectedcustomers = "param_selectedcustomers";
            AttributeNames.ParamResourceSpecId = "param_rootResourceSpecId";
            AttributeNames.ServiceActivityScheduleDialog = "ServiceActivityScheduleDialog";
            AttributeNames.Duration1 = "Duration_1";
            AttributeNames.ID = "id";
            AttributeNames.EntityType = "entityType";
            AttributeNames.ObjectTypeCode = "objecttypecode";
            AttributeNames.Name = "name";
            AttributeNames.SelectDate = "SelectDate";
            AttributeNames.StartDate = "StartDate";
            AttributeNames.SpecificDate = "specificdate";
            AttributeNames.SpecificTime = "specifictime";
            AttributeNames.DateWindowStart = "datewindowstart";
            AttributeNames.DateWindowEnd = "datewindowend";
            AttributeNames.DayList = "DayList";
            AttributeNames.SelectTime = "SelectTime";
            AttributeNames.StartTime = "StartTime";
            AttributeNames.TimeWindowStart = "timewindowstart";
            AttributeNames.TimeWindowEnd = "timewindowend";
            AttributeNames.UseDefaultDuration = "UseDefaultDuration";
            AttributeNames.FindAvailableTimesId = "find_available_times_id";
            AttributeNames.FindAvailableTimesFormAssistantId = "find_available_times_form_assistant_id";
            AttributeNames.FormAssistantButtonId = "form_assistant_id";
            AttributeNames.ResourceDetails = "resource_details";
            AttributeNames.RegardingObjectId = "regardingobjectid";
            AttributeNames.ServiceAppointmentDataBind = "serviceappointment@odata.bind";
            AttributeNames.ResourceSpecId = "resourcespecid";
            AttributeNames.Effort = "effort";
            AttributeNames.ActivityId = "activityid";
            AttributeNames.InitialStatusCode = "initialstatuscode";
            AttributeNames.From = "from";
            AttributeNames.To = "to";
            AttributeNames.CC = "cc";
            AttributeNames.BCC = "bcc";
            AttributeNames.RequiredAttendees = "requiredattendees";
            AttributeNames.OptionalAttendees = "optionalattendees";
            AttributeNames.Organizer = "organizer";
            AttributeNames.TransactionCurrencyId = "transactioncurrencyid";
            AttributeNames.AllDayEventDurationInMin = 1440;
            AttributeNames.Subject = "subject";
        })(AttributeNames = Constants.AttributeNames || (Constants.AttributeNames = {}));
        var ParticipationTypeMasks;
        (function (ParticipationTypeMasks) {
            ParticipationTypeMasks.From = 1;
            ParticipationTypeMasks.To = 2;
            ParticipationTypeMasks.CC = 3;
            ParticipationTypeMasks.BCC = 4;
            ParticipationTypeMasks.RequiredAttendees = 5;
            ParticipationTypeMasks.OptionalAttendees = 6;
            ParticipationTypeMasks.Organizer = 7;
            ParticipationTypeMasks.Resource = 10;
            ParticipationTypeMasks.Customer = 11;
        })(ParticipationTypeMasks = Constants.ParticipationTypeMasks || (Constants.ParticipationTypeMasks = {}));
        var NotificationText;
        (function (NotificationText) {
            NotificationText.ServiceAppointmentPrefix = "serviceappointment_scheduling_conflict";
        })(NotificationText = Constants.NotificationText || (Constants.NotificationText = {}));
        var ErrorLevels;
        (function (ErrorLevels) {
            ErrorLevels.Error = "Error";
            ErrorLevels.Warning = "Warning";
            ErrorLevels.Information = "Information";
        })(ErrorLevels = Constants.ErrorLevels || (Constants.ErrorLevels = {}));
        var ServiceActivityDaysOfWeek;
        (function (ServiceActivityDaysOfWeek) {
            ServiceActivityDaysOfWeek[ServiceActivityDaysOfWeek["Sunday"] = 0] = "Sunday";
            ServiceActivityDaysOfWeek[ServiceActivityDaysOfWeek["Monday"] = 1] = "Monday";
            ServiceActivityDaysOfWeek[ServiceActivityDaysOfWeek["Tuesday"] = 2] = "Tuesday";
            ServiceActivityDaysOfWeek[ServiceActivityDaysOfWeek["Wednesday"] = 3] = "Wednesday";
            ServiceActivityDaysOfWeek[ServiceActivityDaysOfWeek["Thursday"] = 4] = "Thursday";
            ServiceActivityDaysOfWeek[ServiceActivityDaysOfWeek["Friday"] = 5] = "Friday";
            ServiceActivityDaysOfWeek[ServiceActivityDaysOfWeek["Saturday"] = 6] = "Saturday";
        })(ServiceActivityDaysOfWeek = Constants.ServiceActivityDaysOfWeek || (Constants.ServiceActivityDaysOfWeek = {}));
        var FCSNamespaces;
        (function (FCSNamespaces) {
            FCSNamespaces.ServiceCalendar = "CS.ServiceCalendar";
        })(FCSNamespaces = Constants.FCSNamespaces || (Constants.FCSNamespaces = {}));
        var FCSNames;
        (function (FCSNames) {
            FCSNames.EnableClientSubjectFieldSanitization = "EnableClientSubjectFieldSanitization";
            FCSNames.EnableTimezoneIndependentFieldSave = "EnableTimezoneIndependentFieldSave";
            FCSNames.EnableAllDayEventBehaviorFix = "EnableAllDayEventBehaviorFix";
        })(FCSNames = Constants.FCSNames || (Constants.FCSNames = {}));
    })(Constants = BookUtils.Constants || (BookUtils.Constants = {}));
})(BookUtils || (BookUtils = {}));
var MscrmControls;
(function (MscrmControls) {
    var FindSlots;
    (function (FindSlots) {
        'use strict';
    })(FindSlots = MscrmControls.FindSlots || (MscrmControls.FindSlots = {}));
})(MscrmControls || (MscrmControls = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="privatereferences.ts"/>
var MscrmControls;
(function (MscrmControls) {
    var FindSlots;
    (function (FindSlots) {
        'use strict';
        var FindSlotGridControl = (function () {
            function FindSlotGridControl() {
                this._context = null;
                this._dataProvider = null;
                this._dataSetRecord = null;
                this._applyStyles = null;
            }
            /**
             * This function should be used for any initial setup necessary for your control.
             * @params context The "Input Bag" containing the parameters and other control metadata.
             * @params notifyOutputchanged The method for this control to notify the framework that it has new outputs
             * @params state The user state for this control set from setState in the last session
             * @params container The div element to draw this control in
             */
            FindSlotGridControl.prototype.init = function (context, notifyOutputChanged, state) {
                this._context = context;
                this._applyStyles = new FindSlots.FindSlotGridControlStyle(context);
            };
            /**
             * This function will recieve an "Input Bag" containing the values currently assigned to the parameters in your manifest
             * It will send down the latest values (static or dynamic) that are assigned as defined by the manifest & customization experience
             * as well as resource, client, and theming info (see mscrm.d.ts)
             * @params context The "Input Bag" as described above
             */
            FindSlotGridControl.prototype.updateView = function (context) {
                //slot records holds the list of records fetch when find available slot button was clicked
                this._dataSetRecord = Xrm.Page.data.attributes[FindSlots.PageAttributes.SlotRecords];
                // dataSetRecords are set to dataProvider to be fetched when grid renders
                this._dataProvider = new FindSlots.FindSlotsRecordsDataProvider(this._dataSetRecord);
                this._dataProvider.setGridColumns(this.retrieveColumns());
                var gridControl = this.createGridControl(this._context);
                return this._context.factory.createElement(FindSlots.DOMId.Container, {
                    key: FindSlots.DOMId.GridContainerId,
                    id: FindSlots.DOMId.GridContainerId,
                    style: this._applyStyles.Container(),
                }, [gridControl]);
            };
            /**
             * Create FindSlotGridControl with custom data provider.
             * @param context
             */
            FindSlotGridControl.prototype.createGridControl = function (context) {
                var properties = {
                    "parameters": {
                        Grid: {
                            Primary: true,
                            //TargetEntityType: Entity.Incident,
                            TargetEntityType: FindSlots.AvailableTimes,
                            DataProvider: this._dataProvider,
                            Columns: this._dataProvider.getColumns(),
                            onRecordsSelected: this.onRecordSelected.bind(this),
                            Type: FindSlots.Grid,
                            DataSetUIOptions: {
                                displayPaging: true,
                                displayIndex: false,
                                displayQuickFind: false,
                                displayCommandBar: false
                            }
                        },
                        EnableGroupBy: {
                            Usage: 1,
                            Static: true,
                            Type: "Enum",
                            Value: "No",
                            Primary: false
                        },
                        EnableFiltering: {
                            Usage: 1,
                            Static: true,
                            Type: "Enum",
                            Value: "No",
                            Primary: false
                        },
                        EnableEditing: {
                            Usage: 1,
                            Static: true,
                            Type: "Enum",
                            Value: "No",
                            Primary: false
                        },
                        HideNestedGridColumnHeader: {
                            Usage: 1,
                            Static: true,
                            Type: "Enum",
                            Value: "No",
                            Primary: false,
                        }
                    }
                };
                return context.factory.createComponent(FindSlots.ReadOnlyGrid, FindSlots.DOMId.GridId, properties);
            };
            /**
             *
             * @param rowIds
             * This function gets called when a row is selected in the custom grid
             */
            FindSlotGridControl.prototype.onRecordSelected = function (rowIds) {
                //make schedule button enabled only when exactly one record is selected in grid
                if (rowIds && rowIds.length != 1) {
                    Xrm.Page.getControl(FindSlots.PageAttributes.BtnScheduleId).setDisabled(true);
                    return;
                }
                Xrm.Page.getControl(FindSlots.PageAttributes.BtnScheduleId).setDisabled(false);
                var records;
                records = this._dataProvider.getRecords();
                var selectedRecord = records.find(function (item) { return item.getRecordId() === rowIds[0]; });
                Xrm.Page.data.attributes[FindSlots.PageAttributes.Selected_Record] = selectedRecord;
            };
            /**
             * Sets the visibilty of LinkActions.
             */
            FindSlotGridControl.prototype.setContainerVisibility = function (containerId, visibility) {
                if (document.getElementById(this._context.accessibility.getUniqueId(containerId))) {
                    document.getElementById(this._context.accessibility.getUniqueId(containerId)).style.display = visibility;
                }
            };
            /**
             * Retrieves the set of columns to be rendered in the grid control.
             */
            FindSlotGridControl.prototype.retrieveColumns = function () {
                var recordId = {
                    name: FindSlots.Columns.ResourcesJson,
                    displayName: FindSlots.Columns.ResourcesJson,
                    dataType: FindSlots.DataTypes.SingleLineText,
                    alias: FindSlots.Columns.ResourcesJson,
                    visualSizeFactor: 250,
                    isHidden: true,
                    isPrimary: true,
                    order: 1,
                    attributes: {
                        format: FindSlots.DataTypes.Text,
                        type: FindSlots.DataTypes.String
                    },
                    validator: null,
                    disableSorting: false
                };
                var resources = {
                    name: FindSlots.Columns.Resources,
                    displayName: FindSlots.Columns.Resources,
                    dataType: FindSlots.DataTypes.SingleLineText,
                    alias: FindSlots.Columns.Resources,
                    visualSizeFactor: 250,
                    isHidden: false,
                    isPrimary: false,
                    order: 2,
                    attributes: {
                        format: FindSlots.DataTypes.Text,
                        type: FindSlots.DataTypes.String
                    },
                    validator: null,
                    disableSorting: false
                };
                var site = {
                    name: FindSlots.Columns.Resources,
                    displayName: FindSlots.Columns.Site,
                    dataType: FindSlots.DataTypes.SingleLineText,
                    alias: FindSlots.Columns.Site,
                    visualSizeFactor: 250,
                    isHidden: false,
                    isPrimary: false,
                    order: 3,
                    attributes: {
                        format: FindSlots.DataTypes.Text,
                        type: FindSlots.DataTypes.String
                    },
                    validator: null,
                    disableSorting: true
                };
                var scheduledStart = {
                    name: FindSlots.Columns.ScheduledStartLocalTime,
                    displayName: FindSlots.Columns.ScheduledStartDisplayName,
                    dataType: FindSlots.DataTypes.SingleLineText,
                    alias: FindSlots.Columns.ScheduledStartLocalTime,
                    visualSizeFactor: 170,
                    isHidden: false,
                    order: 4,
                    attributes: {
                        format: FindSlots.DataTypes.Text,
                        type: FindSlots.DataTypes.String
                    },
                    validator: null,
                    disableSorting: true
                };
                var scheduledEnd = {
                    name: FindSlots.Columns.ScheduledEndLocalTime,
                    displayName: FindSlots.Columns.ScheduledEndDisplayName,
                    dataType: FindSlots.DataTypes.SingleLineText,
                    alias: FindSlots.Columns.ScheduledEndLocalTime,
                    visualSizeFactor: 170,
                    isHidden: false,
                    order: 5,
                    attributes: {
                        format: FindSlots.DataTypes.Text,
                        type: FindSlots.DataTypes.String
                    },
                    validator: null,
                    disableSorting: true
                };
                return [recordId, resources, site, scheduledStart, scheduledEnd];
            };
            /**
             * This function will return an "Output Bag" to the Crm Infrastructure
             * The ouputs will contain a value for each property marked as "input-output"/"bound" in your manifest
             * i.e. if your manifest has a property "value" that is an "input-output", and you want to set that to the local variable "myvalue" you should return:
             * {
             *		value: myvalue
             * };
             * @returns The "Output Bag" containing values to pass to the infrastructure
             */
            FindSlotGridControl.prototype.getOutputs = function () {
                // custom code goes here - remove the line below and return the correct output
                return null;
            };
            /**
             * This function will be called when the control is destroyed
             * It should be used for cleanup and releasing any memory the control is using
             */
            FindSlotGridControl.prototype.destroy = function () {
            };
            return FindSlotGridControl;
        }());
        FindSlots.FindSlotGridControl = FindSlotGridControl;
    })(FindSlots = MscrmControls.FindSlots || (MscrmControls.FindSlots = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var FindSlots;
    (function (FindSlots) {
        'use strict';
        var FindSlotGridControlStyle = (function () {
            function FindSlotGridControlStyle(context) {
                this._TitleLabel = {};
                this._ErrorMessageLabel = {};
                this._Container = {};
                this._LinkIcon = {};
                this._ActionTiltle = {};
                this._ActionContainer = {};
                this._ActionsContainer = {};
                this._TitleContainer = {};
                this._context = context;
            }
            FindSlotGridControlStyle.prototype.Container = function () {
                this._Container = {};
                this._Container["display"] = "flex";
                this._Container["flexDirection"] = "column";
                this._Container["width"] = "100%";
                return this._Container;
            };
            FindSlotGridControlStyle.prototype.TitleLabel = function () {
                this._TitleLabel = {};
                this._TitleLabel["fontFamily"] = this._context.theming.fontfamilies.semibold;
                this._TitleLabel["fontSize"] = this._context.theming.fontsizes.font100;
                this._TitleLabel["color"] = this._context.theming.colors.basecolor.grey.grey7;
                this._TitleLabel["width"] = "30ch";
                return this._TitleLabel;
            };
            FindSlotGridControlStyle.prototype.TitleContainer = function () {
                this._TitleContainer = {};
                this._TitleContainer["marginTop"] = this._context.theming.measures.measure125;
                this._TitleContainer["marginBottom"] = this._context.theming.measures.measure125;
                this._TitleContainer["lineHeight"] = "1.4rem";
                this._TitleContainer["display"] = "inline-flex";
                return this._TitleContainer;
            };
            FindSlotGridControlStyle.prototype.ErrorMessageLabel = function () {
                this._ErrorMessageLabel = {};
                this._ErrorMessageLabel["fontFamily"] = this._context.theming.fontfamilies.regular;
                this._ErrorMessageLabel["fontSize"] = this._context.theming.fontsizes.font100;
                this._ErrorMessageLabel["lineHeight"] = "1.4rem";
                this._ErrorMessageLabel["color"] = this._context.theming.colors.basecolor.grey.grey4;
                return this._ErrorMessageLabel;
            };
            FindSlotGridControlStyle.prototype.ActionIcon = function () {
                this._LinkIcon = {};
                this._LinkIcon["display"] = "inline-flex";
                this._LinkIcon["fontSize"] = "16px";
                this._LinkIcon["paddingRight"] = this._context.theming.measures.measure100;
                this._LinkIcon["paddingLeft"] = this._context.theming.measures.measure100;
                return this._LinkIcon;
            };
            FindSlotGridControlStyle.prototype.ActionTitle = function () {
                this._ActionTiltle = {};
                this._ActionTiltle["fontFamily"] = this._context.theming.fontfamilies.regular;
                this._ActionTiltle["fontSize"] = this._context.theming.fontsizes.font100;
                this._TitleLabel["color"] = this._context.theming.colors.basecolor.grey.grey7;
                this._ActionTiltle["cursor"] = "pointer";
                return this._ActionTiltle;
            };
            FindSlotGridControlStyle.prototype.ActionContainer = function () {
                this._ActionContainer = {};
                this._ActionContainer["display"] = "inline-flex";
                this._ActionContainer["cursor"] = "pointer";
                this._ActionContainer["color"] = "#333333";
                this._ActionContainer[":hover"] = { color: this._context.theming.colors.base.black };
                this._ActionContainer["paddingRight"] = this._context.client.isRTL ? 0 : this._context.theming.measures.measure100;
                this._ActionContainer["paddingLeft"] = this._context.client.isRTL ? this._context.theming.measures.measure100 : 0;
                return this._ActionContainer;
            };
            FindSlotGridControlStyle.prototype.ActionsContainer = function () {
                this._ActionsContainer = {};
                this._ActionsContainer["width"] = "calc(100% - 30ch)";
                this._ActionsContainer["justify-content"] = "flex-end";
                return this._ActionsContainer;
            };
            return FindSlotGridControlStyle;
        }());
        FindSlots.FindSlotGridControlStyle = FindSlotGridControlStyle;
    })(FindSlots = MscrmControls.FindSlots || (MscrmControls.FindSlots = {}));
})(MscrmControls || (MscrmControls = {}));
/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
var MscrmControls;
(function (MscrmControls) {
    var FindSlots;
    (function (FindSlots) {
        'use strict';
        var FindSlotDataSetRecord = (function () {
            function FindSlotDataSetRecord(id, record, logicalName) {
                this._record = {};
                this._id = id;
                this._record = record;
                this._logicalName = logicalName;
            }
            FindSlotDataSetRecord.prototype.getRecordId = function () {
                return this._id;
            };
            FindSlotDataSetRecord.prototype.getValue = function (columnName) {
                return this._record[columnName];
            };
            FindSlotDataSetRecord.prototype.setValue = function (columnName, newValue) {
                throw new Error("Not implemented");
            };
            FindSlotDataSetRecord.prototype.save = function () {
                throw new Error("Not implemented");
            };
            FindSlotDataSetRecord.prototype.getFormattedValue = function (columnName) {
                return this._record[columnName];
            };
            FindSlotDataSetRecord.prototype.isEditable = function (columnName) {
                return window.Promise.resolve(false);
            };
            FindSlotDataSetRecord.prototype.isSecured = function (columnName) {
                return window.Promise.resolve(false);
            };
            FindSlotDataSetRecord.prototype.isReadable = function (columnName) {
                return window.Promise.resolve(true);
            };
            FindSlotDataSetRecord.prototype.getFieldRequiredLevel = function (columnName) {
                return window.Promise.resolve(-1 /* Unknown */);
            };
            FindSlotDataSetRecord.prototype.getAttributes = function (column) {
                return null;
            };
            FindSlotDataSetRecord.prototype.getValidator = function (column) {
                return null;
            };
            FindSlotDataSetRecord.prototype.getNamedReference = function () {
                var _this = this;
                return {
                    Id: {
                        guid: this._id,
                        toString: function () { return _this._id; }
                    },
                    Name: null,
                    LogicalName: this._logicalName
                };
            };
            FindSlotDataSetRecord.prototype.getActivityPartyRecord = function () {
                return null;
            };
            FindSlotDataSetRecord.prototype.getErrorMessage = function () {
                return null;
            };
            FindSlotDataSetRecord.prototype.isDirty = function () {
                return false;
            };
            FindSlotDataSetRecord.prototype.isRecordValid = function () {
                return true;
            };
            FindSlotDataSetRecord.prototype.getNotification = function (columnName) {
                return null;
            };
            FindSlotDataSetRecord.prototype.isValid = function (columnName) {
                return true;
            };
            FindSlotDataSetRecord.prototype.validateAllColumns = function () {
                return null;
            };
            return FindSlotDataSetRecord;
        }());
        FindSlots.FindSlotDataSetRecord = FindSlotDataSetRecord;
    })(FindSlots = MscrmControls.FindSlots || (MscrmControls.FindSlots = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var FindSlots;
    (function (FindSlots) {
        'use strict';
        var FindSlotsRecordsDataProvider = (function () {
            function FindSlotsRecordsDataProvider(records) {
                this._sorting = null;
                this._data_paging = new FindSlots.GridDataSetPaging(this);
                FindSlotsRecordsDataProvider._that = this;
                this._records = records;
            }
            /**
             *  This function gets called when grid renders
             * */
            FindSlotsRecordsDataProvider.prototype.refresh = function () {
                // upon grid render pagination logic loads contents for first page
                var pageNbr = 1;
                return this._data_paging.loadExactPage(pageNbr);
            };
            FindSlotsRecordsDataProvider.prototype.isLoading = function () {
                return this._isLoading;
            };
            FindSlotsRecordsDataProvider.prototype.isError = function () {
                return false;
            };
            FindSlotsRecordsDataProvider.prototype.getErrorMessage = function () {
                return null;
            };
            FindSlotsRecordsDataProvider.prototype.setSorting = function (sorting) {
                this._sorting = sorting;
                this._records = this._records.sort(this.compareDataSetRecord);
            };
            FindSlotsRecordsDataProvider.prototype.compareDataSetRecord = function (a, b) {
                var that = FindSlotsRecordsDataProvider._that;
                if (that._sorting.length == 1) {
                    var columName = that._sorting[0].name;
                    var sortingDirection = that._sorting[0].sortDirection;
                    var firstValue = a.getValue(columName);
                    var secondValue = b.getValue(columName);
                    if (firstValue != undefined && secondValue != undefined)
                        return that.compare(firstValue, secondValue, sortingDirection);
                    else
                        return 0;
                }
                else {
                    return 0;
                }
            };
            FindSlotsRecordsDataProvider.prototype.compare = function (a, b, sortingDirection) {
                var ret;
                if (sortingDirection == 0 /* Ascending */)
                    a > b ? ret = 1 : ret = -1;
                else if (sortingDirection == 1 /* Descending */)
                    a < b ? ret = 1 : ret = -1;
                else
                    ret = 0;
                return ret;
            };
            FindSlotsRecordsDataProvider.prototype.setFiltering = function (filtering) {
                this._filtering = filtering;
            };
            FindSlotsRecordsDataProvider.prototype.getColumns = function () {
                return this._columns || [];
            };
            FindSlotsRecordsDataProvider.prototype.getRecords = function () {
                return this._records;
            };
            FindSlotsRecordsDataProvider.prototype.getPaging = function () {
                return this._data_paging;
            };
            FindSlotsRecordsDataProvider.prototype.save = function (record) {
                throw new Error("Not implemented");
            };
            FindSlotsRecordsDataProvider.prototype.setGridColumns = function (columns) {
                this._columns = columns;
            };
            FindSlotsRecordsDataProvider.prototype.getTitle = function () {
                return FindSlots.ResourceKeys.SimilarCases;
            };
            return FindSlotsRecordsDataProvider;
        }());
        FindSlots.FindSlotsRecordsDataProvider = FindSlotsRecordsDataProvider;
    })(FindSlots = MscrmControls.FindSlots || (MscrmControls.FindSlots = {}));
})(MscrmControls || (MscrmControls = {}));
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
    'use strict';
    /* tslint:disable:crm-force-fields-private */
    var EvaluateSearchRequestContract = (function () {
        function EvaluateSearchRequestContract(ServiceAppointmentId, ServiceId, DateOptionSet, TimeOptionSet, DayList, RequiredResources, SearchWindowStart, SearchWindowEnd, SearchRecurrenceStart, TimeRangeEnd, Duration, Direction, Sites, ResultsCount, _SearchWindowStart, _SearchWindowEnd) {
            this.ServiceAppointmentId = ServiceAppointmentId,
                this.ServiceId = ServiceId,
                this.DateOptionSet = DateOptionSet,
                this.TimeOptionSet = TimeOptionSet,
                this.DayList = DayList,
                this.RequiredResources = RequiredResources,
                this.SearchWindowStart = SearchWindowStart,
                this.SearchWindowEnd = SearchWindowEnd,
                this.SearchRecurrenceStart = SearchRecurrenceStart,
                this.TimeRangeEnd = TimeRangeEnd,
                this.Duration = Duration,
                this.Direction = Direction,
                this.Sites = Sites,
                this.NumberOfResults = ResultsCount,
                this._SearchWindowStart = _SearchWindowStart,
                this._SearchWindowEnd = _SearchWindowEnd;
        }
        EvaluateSearchRequestContract.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {
                    "ServiceAppointmentId": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    },
                    "ServiceId": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    },
                    "DateOptionSet": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1
                    },
                    "TimeOptionSet": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1
                    },
                    "DayList": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    },
                    "RequiredResources": {
                        "typeName": "mscrm.RequiredResource",
                        "structuralProperty": 4
                    },
                    "SearchWindowStart": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    },
                    "SearchWindowEnd": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    },
                    "SearchRecurrenceStart": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1
                    },
                    "TimeRangeEnd": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1
                    },
                    "Duration": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1
                    },
                    "Direction": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1
                    },
                    "Sites": {
                        "typeName": "mscrm.Site",
                        "structuralProperty": 4
                    },
                    "NumberOfResults": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1
                    },
                    "_SearchWindowStart": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    },
                    "_SearchWindowEnd": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    },
                },
                operationType: 0,
                operationName: "_EvaluateSearchRequest"
            };
        };
        return EvaluateSearchRequestContract;
    }());
    ODataContract.EvaluateSearchRequestContract = EvaluateSearchRequestContract;
})(ODataContract || (ODataContract = {}));
var MscrmControls;
(function (MscrmControls) {
    var FindSlots;
    (function (FindSlots) {
        'use strict';
        var Columns;
        (function (Columns) {
            Columns.ModifiedOn = "modifiedon";
            Columns.Title = "title";
            Columns.FormattedModifiedOn = "modifiedon@OData.Community.Display.V1.FormattedValue";
            Columns.Resources = "resources";
            Columns.ScheduledStart = "scheduledstart";
            Columns.ScheduledEnd = "scheduledend";
            Columns.ScheduledStartLocalTime = "scheduledstartlocaltime";
            Columns.ScheduledEndLocalTime = "scheduledendlocaltime";
            Columns.RecordId = "recordId";
            Columns.ResourcesJson = "resourcesJson";
            Columns.ScheduledStartDisplayName = "Scheduled Start";
            Columns.ScheduledEndDisplayName = "Scheduled End";
            Columns.Site = "site";
        })(Columns = FindSlots.Columns || (FindSlots.Columns = {}));
        var DOMId;
        (function (DOMId) {
            DOMId.GridId = "FindSlotsGridControlId";
            DOMId.GridContainerId = "FindSlotsGridContainerId";
            DOMId.Container = "CONTAINER";
        })(DOMId = FindSlots.DOMId || (FindSlots.DOMId = {}));
        var ResourceKeys;
        (function (ResourceKeys) {
            ResourceKeys.SimilarCases = "FindSlots_Label";
        })(ResourceKeys = FindSlots.ResourceKeys || (FindSlots.ResourceKeys = {}));
        var PageAttributes;
        (function (PageAttributes) {
            PageAttributes.BtnScheduleId = "schedule_id";
            PageAttributes.SlotRecords = "slotRecords";
            PageAttributes.Selected_Record = "selected_record";
        })(PageAttributes = FindSlots.PageAttributes || (FindSlots.PageAttributes = {}));
        var DataTypes;
        (function (DataTypes) {
            DataTypes.SingleLineText = "SingleLine.Text";
            DataTypes.DateAndTimeDateAndTime = "DateAndTime.DateAndTime";
            DataTypes.DateTime = "datetime";
            DataTypes.Text = "Text";
            DataTypes.String = "string";
        })(DataTypes = FindSlots.DataTypes || (FindSlots.DataTypes = {}));
        FindSlots.AvailableTimes = "availabletimes";
        FindSlots.Grid = "Grid";
        FindSlots.ReadOnlyGrid = "MscrmControls.Grid.ReadOnlyGrid";
        var AttributeNames;
        (function (AttributeNames) {
            AttributeNames.Resources = "resources";
            AttributeNames.Customers = "customers";
            AttributeNames.Site = "site";
            AttributeNames.SiteId = "siteid";
            AttributeNames.ParticipationTypeMask = "participationtypemask";
            AttributeNames.PartyId = "partyid";
            AttributeNames.ODataBind = "@odata.bind";
            AttributeNames.ODataType = "@odata.type";
            AttributeNames.StateCode = "statecode";
            AttributeNames.StatusCode = "statuscode";
            AttributeNames.ServiceAppointmentActivityParties = "serviceappointment_activity_parties";
            AttributeNames.ScheduledStart = "scheduledstart";
            AttributeNames.ScheduledEnd = "scheduledend";
            AttributeNames.ScheduledDurationMinutes = "scheduleddurationminutes";
            AttributeNames.ServiceId = "serviceid";
            AttributeNames.FooterStateCode = "footer_statecode";
            AttributeNames.Duration = "duration";
            AttributeNames.FindSlotGridControlId = "findSlotGridControl_id";
            AttributeNames.ServiceIds = "service_ids";
            AttributeNames.ServiceIdsReadOnly = "service_ids_read_only";
            AttributeNames.FormAssistantServiceField = "form_assistant_service_id";
            AttributeNames.SiteIds = "site_ids";
            AttributeNames.SiteIdsReadOnly = "site_ids_read_only";
            AttributeNames.AvailableTimesTab = "AvailableTimesTab";
            AttributeNames.FormAssistantTab = "FormAssistantTab";
            AttributeNames.ScheduleTab = "ScheduleTab";
            AttributeNames.ParamServiceId = "param_serviceId";
            AttributeNames.ParamServiceAppointmentId = "param_serviceAppointmentId";
            AttributeNames.ParamSiteId = "param_siteId";
            AttributeNames.ParamResourceId = "param_resourceId";
            AttributeNames.ParamDuration = "param_duration";
            AttributeNames.ParamTargetentities = "param_targetentities";
            AttributeNames.ParamSystemUserEquipments = "systemuser,equipment";
            AttributeNames.ParamSelectedresources = "param_selectedresources";
            AttributeNames.ParamTargetEntitiesCustomers = "param_targetentitiescustomers";
            AttributeNames.ParamAccountContact = "account,contact";
            AttributeNames.ParamSelectedcustomers = "param_selectedcustomers";
            AttributeNames.ParamResourceSpecId = "param_rootResourceSpecId";
            AttributeNames.ServiceActivityScheduleDialog = "ServiceActivityScheduleDialog";
            AttributeNames.Duration1 = "Duration_1";
            AttributeNames.ID = "id";
            AttributeNames.EntityType = "entityType";
            AttributeNames.ObjectTypeCode = "objecttypecode";
            AttributeNames.Name = "name";
            AttributeNames.SelectDate = "SelectDate";
            AttributeNames.StartDate = "StartDate";
            AttributeNames.SpecificDate = "specificdate";
            AttributeNames.SpecificTime = "specifictime";
            AttributeNames.DateWindowStart = "datewindowstart";
            AttributeNames.DateWindowEnd = "datewindowend";
            AttributeNames.DayList = "DayList";
            AttributeNames.SelectTime = "SelectTime";
            AttributeNames.StartTime = "StartTime";
            AttributeNames.TimeWindowStart = "timewindowstart";
            AttributeNames.TimeWindowEnd = "timewindowend";
            AttributeNames.UseDefaultDuration = "UseDefaultDuration";
            AttributeNames.FindAvailableTimesId = "find_available_times_id";
            AttributeNames.FindAvailableTimesFormAssistantId = "find_available_times_form_assistant_id";
            AttributeNames.FormAssistantButtonId = "form_assistant_id";
            AttributeNames.ResourceDetails = "resource_details";
            AttributeNames.RegardingObjectId = "regardingobjectid";
            AttributeNames.ServiceAppointmentDataBind = "serviceappointment@odata.bind";
            AttributeNames.ResourceSpecId = "resourcespecid";
            AttributeNames.Effort = "effort";
            AttributeNames.ActivityId = "activityid";
            AttributeNames.InitialStatusCode = "initialstatuscode";
        })(AttributeNames = FindSlots.AttributeNames || (FindSlots.AttributeNames = {}));
        var DateOptionSet;
        (function (DateOptionSet) {
            DateOptionSet[DateOptionSet["AsSoonAsPossible"] = 1] = "AsSoonAsPossible";
            DateOptionSet[DateOptionSet["SpecificDate"] = 2] = "SpecificDate";
            DateOptionSet[DateOptionSet["RangeOfDates"] = 3] = "RangeOfDates";
            DateOptionSet[DateOptionSet["Today"] = 4] = "Today";
            DateOptionSet[DateOptionSet["Tomorrow"] = 5] = "Tomorrow";
            DateOptionSet[DateOptionSet["ThisWeek"] = 6] = "ThisWeek";
            DateOptionSet[DateOptionSet["NextWeek"] = 7] = "NextWeek";
            DateOptionSet[DateOptionSet["NextMonth"] = 8] = "NextMonth";
        })(DateOptionSet = FindSlots.DateOptionSet || (FindSlots.DateOptionSet = {}));
        var TimeOptionSet;
        (function (TimeOptionSet) {
            TimeOptionSet[TimeOptionSet["AnyTime"] = 1] = "AnyTime";
            TimeOptionSet[TimeOptionSet["SpecificTime"] = 2] = "SpecificTime";
            TimeOptionSet[TimeOptionSet["RangeOfTimes"] = 3] = "RangeOfTimes";
            TimeOptionSet[TimeOptionSet["Morning"] = 4] = "Morning";
            TimeOptionSet[TimeOptionSet["Afternoon"] = 5] = "Afternoon";
            TimeOptionSet[TimeOptionSet["Evening"] = 6] = "Evening";
        })(TimeOptionSet = FindSlots.TimeOptionSet || (FindSlots.TimeOptionSet = {}));
    })(FindSlots = MscrmControls.FindSlots || (MscrmControls.FindSlots = {}));
})(MscrmControls || (MscrmControls = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="privatereferences.ts"/>
/// <reference path="../../WebResources/ServiceClientCommon/DataContracts/Action/EvaluateSearchRequestContract.ts" />
/// <reference path="Constants.ts"/>
/// <reference path="../../../../TypeDefinitions/Service/Localization/Script/ResourceStringProvider.d.ts" />
var MscrmControls;
(function (MscrmControls) {
    var FindSlots;
    (function (FindSlots) {
        'use strict';
        var FindSlotGridControlUtil = (function () {
            function FindSlotGridControlUtil() {
            }
            FindSlotGridControlUtil.prototype.RetrieveAvailableSlots = function (hasClientSideError, todayDate, dataSetRecords, resultsCount, _searchWindowStart, _searchWindowEnd) {
                return __awaiter(this, void 0, void 0, function () {
                    var data, serviceAppointmentId, serviceId, dateOptionSet, timeOptionSet, dayList, requiredResources, searchWindowStart, searchWindowEnd, searchRecurrenceStart, timeRangeEnd, duration, direction, sites, request;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                data = {};
                                data = this.PopulateAppointmentRequestParameters(hasClientSideError, todayDate);
                                serviceAppointmentId = (data.ServiceAppointmentId != undefined) ? data.ServiceAppointmentId : null;
                                serviceId = (data.ServiceId != undefined) ? data.ServiceId : null;
                                dateOptionSet = (data.DateOptionSet != undefined) ? data.DateOptionSet : FindSlots.DateOptionSet.AsSoonAsPossible;
                                timeOptionSet = (data.TimeOptionSet != undefined) ? data.TimeOptionSet : FindSlots.TimeOptionSet.RangeOfTimes;
                                dayList = (data.DayList != undefined) ? data.DayList : null;
                                requiredResources = (data.RequiredResources != undefined) ? data.RequiredResources : null;
                                searchWindowStart = (data.SearchWindowStart != undefined) ? data.SearchWindowStart : null;
                                searchWindowEnd = (data.SearchWindowEnd != undefined) ? data.SearchWindowEnd : null;
                                searchRecurrenceStart = (data.SearchRecurrenceStart != undefined) ? data.SearchRecurrenceStart : null;
                                timeRangeEnd = (data.TimeRangeEnd != undefined) ? data.TimeRangeEnd : null;
                                duration = (data.Duration != undefined) ? data.Duration : null;
                                direction = (data.Direction != undefined) ? data.Direction : 1;
                                sites = (data.Sites != undefined) ? data.Sites : null;
                                request = new ODataContract.EvaluateSearchRequestContract(serviceAppointmentId, serviceId, dateOptionSet, timeOptionSet, dayList, requiredResources, searchWindowStart, searchWindowEnd, searchRecurrenceStart, timeRangeEnd, duration, direction, sites, resultsCount, _searchWindowStart, _searchWindowEnd);
                                return [4 /*yield*/, Xrm.WebApi.online.execute(request).then(function (response) { return response.json(); }).then(function (results) {
                                        var records = results.value;
                                        records.forEach(function (record) {
                                            var data = {};
                                            data[MscrmControls.FindSlots.Columns.ResourcesJson] = record.resourcesJson;
                                            data[MscrmControls.FindSlots.Columns.Resources] = record.resources;
                                            data[MscrmControls.FindSlots.Columns.ScheduledStartLocalTime] = record.scheduledstartlocaltime;
                                            data[MscrmControls.FindSlots.Columns.ScheduledEndLocalTime] = record.scheduledendlocaltime;
                                            data[MscrmControls.FindSlots.Columns.Site] = record.site;
                                            dataSetRecords.push(new MscrmControls.FindSlots.FindSlotDataSetRecord(record.availabletimesid, record, "availabletimes"));
                                        });
                                    })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            };
            FindSlotGridControlUtil.prototype.PopulateAppointmentRequestParameters = function (hasClientSideError, todayDate) {
                var parameters = {};
                var DATE_OPTIONSET = MscrmControls.FindSlots.AttributeNames.SelectDate;
                var DATE_START = MscrmControls.FindSlots.AttributeNames.DateWindowStart;
                var DATE_END = MscrmControls.FindSlots.AttributeNames.DateWindowEnd;
                var SPECIFIC_DATE = MscrmControls.FindSlots.AttributeNames.SpecificDate;
                var DAY_LIST = MscrmControls.FindSlots.AttributeNames.DayList;
                var TIME_OPTIONSET = MscrmControls.FindSlots.AttributeNames.SelectTime;
                var TIME_START = MscrmControls.FindSlots.AttributeNames.TimeWindowStart;
                var TIME_END = MscrmControls.FindSlots.AttributeNames.TimeWindowEnd;
                var SPECIFIC_TIME = MscrmControls.FindSlots.AttributeNames.SpecificTime;
                var serviceAppointmentId = "";
                var serviceId;
                var offset;
                var duration;
                var timeDuration;
                var resource;
                var site;
                if (Xrm.Page.data.attributes.get(MscrmControls.FindSlots.AttributeNames.ParamServiceAppointmentId)) {
                    serviceAppointmentId = Xrm.Page.data.attributes.get(MscrmControls.FindSlots.AttributeNames.ParamServiceAppointmentId).getValue();
                    if (serviceAppointmentId)
                        serviceAppointmentId = serviceAppointmentId.slice(1, -1);
                }
                if (Xrm.Page.getControl(MscrmControls.FindSlots.AttributeNames.ServiceIds)) {
                    serviceId = Xrm.Page.getControl(MscrmControls.FindSlots.AttributeNames.ServiceIds).getAttribute().getValue()[0].id;
                }
                if (Xrm.Page.getControl(MscrmControls.FindSlots.AttributeNames.Duration1)) {
                    duration = Xrm.Page.getControl(MscrmControls.FindSlots.AttributeNames.Duration1).getValue();
                    duration = duration.replace(/,/g, '');
                }
                if (Xrm.Page.getControl(MscrmControls.FindSlots.AttributeNames.SiteIds)) {
                    site = Xrm.Page.getControl(MscrmControls.FindSlots.AttributeNames.SiteIds).getAttribute().getValue();
                    if (site != null) {
                        var siteCollection = new Array();
                        var siteObj = {};
                        siteObj["@odata.type"] = "Microsoft.Dynamics.CRM.site";
                        siteObj["siteid"] = site[0].id;
                        siteObj["name"] = site[0].name;
                        siteCollection.push(siteObj);
                        parameters.Sites = siteCollection;
                    }
                }
                if (Xrm.Page.data.attributes.get(MscrmControls.FindSlots.AttributeNames.ParamSelectedresources) && Xrm.Page.data.attributes.get(MscrmControls.FindSlots.AttributeNames.ParamSelectedresources).getValue() && Xrm.Page.data.attributes.get(MscrmControls.FindSlots.AttributeNames.ParamSelectedresources).getValue().length > 0) {
                    resource = Xrm.Page.data.attributes.get(MscrmControls.FindSlots.AttributeNames.ParamSelectedresources).getValue();
                    var requiredResources = new Array();
                    resource.forEach(function (item) {
                        var resObj = {};
                        resObj["@odata.type"] = "Microsoft.Dynamics.CRM.resource";
                        resObj["resourceid"] = item.id;
                        resObj["name"] = item.name;
                        requiredResources.push(resObj);
                    });
                    parameters.RequiredResources = requiredResources;
                }
                parameters.ServiceAppointmentId = serviceAppointmentId;
                parameters.ServiceId = serviceId;
                parameters.Duration = duration;
                parameters.Direction = 1; //By default forward direction
                var formContext = Xrm.Page;
                if (formContext.getControl(DATE_OPTIONSET) && formContext.getControl(DATE_OPTIONSET).getAttribute()) {
                    var dateOptionSet = formContext.getControl(DATE_OPTIONSET).getAttribute().getValue();
                    parameters.DateOptionSet = dateOptionSet;
                    if (dateOptionSet == MscrmControls.FindSlots.DateOptionSet.SpecificDate) {
                        // Client-side check to ensure the specific date is always current or future date
                        if (formContext.getControl(SPECIFIC_DATE) && formContext.getControl(SPECIFIC_DATE).getAttribute()) {
                            var userTimeZoneOffset = Xrm.Utility.getGlobalContext().userSettings.getTimeZoneOffsetMinutes();
                            var specificDate = formContext.getControl(SPECIFIC_DATE).getAttribute().getValue();
                            var userLocalTimeAsUTCString = new Date(specificDate.getTime() + userTimeZoneOffset * 60000);
                            if (this.IsEndDateInFuture(SPECIFIC_DATE, todayDate))
                                parameters.SearchWindowStart = userLocalTimeAsUTCString;
                            else
                                this.OpenErrorDialog(hasClientSideError, "Alert_ServiceActivity_Include_Future_Dates");
                        }
                    }
                    else if (dateOptionSet == MscrmControls.FindSlots.DateOptionSet.RangeOfDates) {
                        var userTimeZoneOffset = Xrm.Utility.getGlobalContext().userSettings.getTimeZoneOffsetMinutes();
                        if (formContext.getControl(DATE_START) && formContext.getControl(DATE_START).getAttribute()) {
                            if (this.IsNullOrEmpty(DATE_START)) {
                                // Client-side check to ensure either start or end date is populated
                                if (this.IsNullOrEmpty(DATE_END))
                                    this.OpenErrorDialog(hasClientSideError, "Alert_ServiceActivity_Check_StartOrEnd");
                            }
                            else {
                                if (!this.IsNullOrEmpty(DATE_END)) {
                                    // Client-side check to ensure end date >= start date
                                    if (formContext.getControl(DATE_END).getAttribute().getValue() < formContext.getControl(DATE_START).getAttribute().getValue())
                                        this.OpenErrorDialog(hasClientSideError, "Alert_ServiceActivity_Invalid_Date_Range");
                                }
                                var dateWindowStart = formContext.getControl(DATE_START).getAttribute().getValue();
                                var userLocalTimeAsUTCString = new Date(dateWindowStart.getTime() + userTimeZoneOffset * 60000);
                                parameters.SearchWindowStart = userLocalTimeAsUTCString;
                            }
                        }
                        if (formContext.getControl(DATE_END) && formContext.getControl(DATE_END).getAttribute()) {
                            if (!this.IsNullOrEmpty(DATE_END)) {
                                var dateEnd = formContext.getControl(DATE_END).getAttribute().getValue();
                                // Client-side check to ensure the end date is always current or future date
                                if (this.IsEndDateInFuture(DATE_END, todayDate))
                                    parameters.SearchWindowEnd = new Date(dateEnd.getTime() + userTimeZoneOffset * 60000);
                                else
                                    this.OpenErrorDialog(hasClientSideError, "Alert_ServiceActivity_Include_Future_Dates");
                            }
                        }
                        if (formContext.getControl(DAY_LIST) && formContext.getControl(DAY_LIST).getAttribute()) {
                            // Client-side check to ensure atleast one day is chosen from multi-select optionset
                            if (this.IsNullOrEmpty(DAY_LIST))
                                this.OpenErrorDialog(hasClientSideError, "Alert_ServiceActivity_Select_Days");
                            else
                                parameters.DayList = formContext.getControl(DAY_LIST).getAttribute().getValue().toString();
                        }
                    }
                }
                if (formContext.getControl(TIME_OPTIONSET) && formContext.getControl(TIME_OPTIONSET).getAttribute()) {
                    var timeOptionSet = formContext.getControl(TIME_OPTIONSET).getAttribute().getValue();
                    parameters.TimeOptionSet = timeOptionSet;
                    if (timeOptionSet == MscrmControls.FindSlots.TimeOptionSet.SpecificTime) {
                        if (formContext.getControl(SPECIFIC_TIME) && formContext.getControl(SPECIFIC_TIME).getAttribute()) {
                            // Client-side check to ensure input time is in valid format
                            if (!this.IsValidTimeFormat(SPECIFIC_TIME))
                                this.OpenErrorDialog(hasClientSideError, "Alert_ServiceActivity_Invalid_Start_Time");
                            // TODO - this code will not be used since client side error will be thrown
                            if (formContext.getControl(SPECIFIC_TIME).getAttribute().getValue() == null)
                                offset = 480;
                            else {
                                if (formContext.getControl(SPECIFIC_TIME).getAttribute().getValue()) {
                                    offset = parseInt(formContext.getControl(SPECIFIC_TIME).getAttribute().getValue());
                                }
                                if (offset && offset % 30 != 0) {
                                    var minutesToAdd = 30 - (offset % 30);
                                    offset = offset + minutesToAdd;
                                }
                            }
                            parameters.SearchRecurrenceStart = offset;
                        }
                    }
                    else if (timeOptionSet == MscrmControls.FindSlots.TimeOptionSet.RangeOfTimes) {
                        if (formContext.getControl(TIME_START) && formContext.getControl(TIME_START).getAttribute()) {
                            // Client-side check to ensure input time is in valid format
                            if (!this.IsValidTimeFormat(TIME_START))
                                this.OpenErrorDialog(hasClientSideError, "Alert_ServiceActivity_Invalid_Start_Time");
                            if (formContext.getControl(TIME_START).getAttribute().getValue() == null)
                                offset = 480;
                            else {
                                if (formContext.getControl(TIME_START).getAttribute().getValue()) {
                                    offset = parseInt(formContext.getControl(TIME_START).getAttribute().getValue());
                                }
                                if (offset && offset % 30 != 0) {
                                    var minutesToAdd = 30 - (offset % 30);
                                    offset = offset + minutesToAdd;
                                }
                            }
                            parameters.SearchRecurrenceStart = offset;
                        }
                        if (formContext.getControl(TIME_END) && formContext.getControl(TIME_END).getAttribute()) {
                            // Client-side check to ensure input time is in valid format
                            if (!this.IsValidTimeFormat(TIME_END))
                                this.OpenErrorDialog(hasClientSideError, "Alert_ServiceActivity_Invalid_End_Time");
                            if (formContext.getControl(TIME_END).getAttribute().getValue() == null)
                                timeDuration = 540;
                            else {
                                var timeEnd = 0;
                                if (formContext.getControl(TIME_END).getAttribute().getValue()) {
                                    timeEnd = parseInt(formContext.getControl(TIME_END).getAttribute().getValue());
                                }
                                if (timeEnd && timeEnd % 30 != 0) {
                                    var minutesToAdd = 30 - (timeEnd % 30);
                                    timeEnd = timeEnd + minutesToAdd;
                                }
                                // Client-side check to ensure start time <= end time
                                if (timeEnd < offset)
                                    this.OpenErrorDialog(hasClientSideError, "Alert_ServiceActivity_StartTime_Before_EndTime");
                                else
                                    timeDuration = timeEnd - offset;
                            }
                            parameters.TimeRangeEnd = timeDuration;
                        }
                    }
                }
                return parameters;
            };
            FindSlotGridControlUtil.prototype.IsNullOrEmpty = function (control_name) {
                var context = Xrm.Page;
                if (context.getControl(control_name) && context.getControl(control_name).getAttribute())
                    if (context.getControl(control_name).getAttribute().getValue() == null)
                        return 1;
                return 0;
            };
            FindSlotGridControlUtil.prototype.IsEndDateInFuture = function (control_name, todayDate) {
                var context = Xrm.Page;
                var userTimeZoneOffset = Xrm.Utility.getGlobalContext().userSettings.getTimeZoneOffsetMinutes();
                var endDateRange = context.getControl(control_name) && context.getControl(control_name).getAttribute().getValue();
                var endDate = new Date(endDateRange.getTime() + userTimeZoneOffset * 60000);
                var extractDateFromEndDate = new Date(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());
                var extractDateFromTodayDate = new Date(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), todayDate.getUTCDate());
                if (extractDateFromEndDate < extractDateFromTodayDate)
                    return 0;
                return 1;
            };
            FindSlotGridControlUtil.prototype.IsValidTimeFormat = function (control_name) {
                var timeValue = Xrm.Page.getControl(control_name) && Xrm.Page.getControl(control_name).getAttribute().getValue();
                if (timeValue == null)
                    return 0;
                return 1;
            };
            FindSlotGridControlUtil.prototype.OpenErrorDialog = function (hasClientSideError, loc_label) {
                hasClientSideError.isError = 1;
                var errorOptions = {};
                errorOptions.message = CrmService.ResourceStringProvider.getResourceString(loc_label);
                Xrm.Navigation.openErrorDialog(errorOptions);
            };
            return FindSlotGridControlUtil;
        }());
        FindSlots.FindSlotGridControlUtil = FindSlotGridControlUtil;
    })(FindSlots = MscrmControls.FindSlots || (MscrmControls.FindSlots = {}));
})(MscrmControls || (MscrmControls = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="privatereferences.ts"/>
/// <reference path="../../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="../../Controls/FindSlotGridControl/FindSlotGridControlUtil.ts" />
var MscrmControls;
(function (MscrmControls) {
    var FindSlots;
    (function (FindSlots) {
        var GridDataSetPaging = (function () {
            function GridDataSetPaging(dataSetRecordsProvider) {
                this.dataSetRecordsProvider = dataSetRecordsProvider;
                this.currentPage = 1;
                this.previousPage = 0;
                /**
                * Total number of results on the server for the currently applied query.
                */
                this.totalResultCount = 0;
                /**
                 * The number of results per page.
                 */
                this.pageSize = (Xrm && Xrm.Internal && (Xrm.Internal.isFeatureEnabled("October2021Update") || Xrm.Internal.isFeatureEnabled("PaginateServiceActivityFindAvailableTimes"))) ? Xrm.Utility.getGlobalContext().userSettings.pagingLimit : 5;
                /**
                 * Whether the result set can be paged forwards.
                 */
                this.hasNextPage = true;
                /**
                 * Whether the result set can be paged backwards.
                 */
                this.hasPreviousPage = true;
            }
            /**
             * Sets the number of results to return per page on the next data refresh.
             */
            GridDataSetPaging.prototype.setPageSize = function (pageSize) {
                this.pageSize = pageSize;
            };
            /**
             * Request the next page of results to be loaded.
             */
            GridDataSetPaging.prototype.loadNextPage = function () {
            };
            /**
             * Request the previous page of results to be loaded.
             */
            GridDataSetPaging.prototype.loadPreviousPage = function () {
            };
            /**
             * Reload the results from the server, and reset to page 1.
             */
            GridDataSetPaging.prototype.reset = function () {
                this.currentPage = 1;
            };
            GridDataSetPaging.prototype.loadExactPage = function (page) {
                return __awaiter(this, void 0, void 0, function () {
                    var response, hasClientSideError, TODAY_DATE, slotRecords, userTimeZoneOffset, _searchWindowStart, _searchWindowEnd, startDate, endDate, pageStartIndex;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.dataSetRecordsProvider.getRecords()];
                            case 1:
                                response = _a.sent();
                                if (!(Xrm && Xrm.Internal && (Xrm.Internal.isFeatureEnabled("October2021Update") || Xrm.Internal.isFeatureEnabled("PaginateServiceActivityFindAvailableTimes")))) return [3 /*break*/, 4];
                                //get list of total records retrieved when find available button was clicked
                                this.totalResultCount = this.dataSetRecordsProvider.getRecords().length;
                                //Check for Bug 2242321
                                if (this.currentPage == 1 && page == 2 && this.previousPage < 1)
                                    this.previousPage = 1;
                                else if (this.currentPage == 1 && page == 1 && this.previousPage < 1 && this.totalResultCount == this.pageSize)
                                    this.previousPage = 1;
                                this.currentPage = page;
                                this.hasNextPage = this.pageSize * this.currentPage < this.totalResultCount;
                                this.hasPreviousPage = this.currentPage > 1;
                                if (!(page > 1 || (this.currentPage == 1 && this.previousPage > 0))) return [3 /*break*/, 3];
                                hasClientSideError = { isError: 0 };
                                TODAY_DATE = new Date();
                                slotRecords = [];
                                userTimeZoneOffset = Xrm.Utility.getGlobalContext().userSettings.getTimeZoneOffsetMinutes();
                                _searchWindowStart = null;
                                _searchWindowEnd = null;
                                if (this.currentPage == 1) {
                                    _searchWindowStart = null;
                                    _searchWindowEnd = null;
                                }
                                else if (this.currentPage > this.previousPage) {
                                    startDate = new Date(response[response.length - 1].getValue("scheduledstart"));
                                    startDate = new Date(startDate.getTime() + userTimeZoneOffset * 60000);
                                    startDate.setSeconds(startDate.getSeconds() + 1);
                                    _searchWindowStart = startDate;
                                }
                                else if (this.currentPage < this.previousPage) {
                                    endDate = new Date(response[0].getValue("scheduledstart"));
                                    endDate = new Date(endDate.getTime() + userTimeZoneOffset * 60000);
                                    endDate.setSeconds(endDate.getSeconds() - 1);
                                    _searchWindowEnd = endDate;
                                }
                                return [4 /*yield*/, new FindSlots.FindSlotGridControlUtil().RetrieveAvailableSlots(hasClientSideError, TODAY_DATE, slotRecords, this.pageSize, _searchWindowStart, _searchWindowEnd)];
                            case 2:
                                _a.sent();
                                this.totalResultCount = this.currentPage > this.previousPage ? (this.previousPage * this.pageSize) + slotRecords.length : ((this.currentPage - 1) * this.pageSize) + slotRecords.length;
                                this.hasNextPage = this.pageSize * this.currentPage < this.totalResultCount;
                                if (slotRecords.length > this.pageSize) {
                                    if (this.currentPage == 1 || this.currentPage > this.previousPage)
                                        slotRecords.pop();
                                    else if (this.currentPage < this.previousPage)
                                        slotRecords.shift();
                                }
                                this.dataSetRecordsProvider._records = slotRecords;
                                response = slotRecords;
                                _a.label = 3;
                            case 3:
                                if (this.dataSetRecordsProvider.getRecords().length > this.pageSize)
                                    response.pop();
                                this.previousPage = page;
                                return [2 /*return*/, response];
                            case 4:
                                this.currentPage = page;
                                this.totalResultCount = this.dataSetRecordsProvider.getRecords().length;
                                this.hasNextPage = this.pageSize * this.currentPage < this.totalResultCount;
                                this.hasPreviousPage = this.currentPage > 1;
                                pageStartIndex = this.pageSize * (this.currentPage - 1);
                                // slice contents based on page number and page size
                                return [2 /*return*/, response.slice(pageStartIndex, pageStartIndex + this.pageSize)];
                        }
                    });
                });
            };
            GridDataSetPaging.prototype.getCurrentPage = function () {
                return this.currentPage;
            };
            return GridDataSetPaging;
        }());
        GridDataSetPaging.MAX_RECORD_COUNT = 500;
        FindSlots.GridDataSetPaging = GridDataSetPaging;
    })(FindSlots = MscrmControls.FindSlots || (MscrmControls.FindSlots = {}));
})(MscrmControls || (MscrmControls = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="inputsoutputs.g.ts" />
/// <reference path="FindSlotGridControl.ts" />
/// <reference path="FindSlotGridControlStyle.ts" />
/// <reference path="DataProvider/FindSlotDataSetRecord.ts" />
/// <reference path="DataProvider/FindSlotsRecordsDataProvider.ts" />
/// <reference path="GridDataSetPaging.ts" />
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="CommonReferences.ts" /> 
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var ODataContract;
(function (ODataContract) {
    "use strict";
    /* tslint:disable:crm-force-fields-private */
    var LocalTimeFromUtcTimeRequest = (function () {
        function LocalTimeFromUtcTimeRequest(TimeZoneCode, UtcTime) {
            this.TimeZoneCode = TimeZoneCode;
            this.UtcTime = UtcTime;
        }
        LocalTimeFromUtcTimeRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "TimeZoneCode": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1,
                    },
                    "UtcTime": {
                        "typeName": "Edm.DateTime",
                        "structuralProperty": 1,
                    },
                },
                operationName: "LocalTimeFromUtcTime",
                operationType: 1,
            };
            return metadata;
        };
        return LocalTimeFromUtcTimeRequest;
    }());
    ODataContract.LocalTimeFromUtcTimeRequest = LocalTimeFromUtcTimeRequest;
})(ODataContract || (ODataContract = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../Controls/FindSlotGridControl/privatereferences.ts"/>
/// <reference path="../../Controls/FindSlotGridControl/DataProvider/FindSlotDataSetRecord.ts"/>
/// <reference path="../../Controls/FindSlotGridControl/FindSlotGridControl.ts" />
/// <reference path="../../Controls/FindSlotGridControl/Constants.ts"/>
/// <reference path="../ServiceClientCommon/DataContracts/Action/LocalTimeFromUtcTimeRequest.ts" />
/// <reference path="../ServiceClientCommon/DataContracts/Action/EvaluateSearchRequestContract.ts" />
/// <reference path="../../../../TypeDefinitions/Service/Localization/Script/ResourceStringProvider.d.ts" />
var CrmService;
(function (CrmService) {
    'use strict';
    var DynamicdataRetriever = (function () {
        function DynamicdataRetriever() {
        }
        DynamicdataRetriever.prototype.RetrieveAvailableSlots = function (hasClientSideError, todayDate, dataSetRecords, resultsCount, _searchWindowStart, _searchWindowEnd) {
            return __awaiter(this, void 0, void 0, function () {
                var data, serviceAppointmentId, serviceId, dateOptionSet, timeOptionSet, dayList, requiredResources, searchWindowStart, searchWindowEnd, searchRecurrenceStart, timeRangeEnd, duration, direction, sites, request;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            data = {};
                            data = this.PopulateAppointmentRequestParameters(hasClientSideError, todayDate);
                            serviceAppointmentId = (data.ServiceAppointmentId != undefined) ? data.ServiceAppointmentId : null;
                            serviceId = (data.ServiceId != undefined) ? data.ServiceId : null;
                            dateOptionSet = (data.DateOptionSet != undefined) ? data.DateOptionSet : 1;
                            timeOptionSet = (data.TimeOptionSet != undefined) ? data.TimeOptionSet : 3;
                            dayList = (data.DayList != undefined) ? data.DayList : null;
                            requiredResources = (data.RequiredResources != undefined) ? data.RequiredResources : null;
                            searchWindowStart = (data.SearchWindowStart != undefined) ? data.SearchWindowStart : null;
                            searchWindowEnd = (data.SearchWindowEnd != undefined) ? data.SearchWindowEnd : null;
                            searchRecurrenceStart = (data.SearchRecurrenceStart != undefined) ? data.SearchRecurrenceStart : null;
                            timeRangeEnd = (data.TimeRangeEnd != undefined) ? data.TimeRangeEnd : null;
                            duration = (data.Duration != undefined) ? data.Duration : null;
                            direction = (data.Direction != undefined) ? data.Direction : 1;
                            sites = (data.Sites != undefined) ? data.Sites : null;
                            request = new ODataContract.EvaluateSearchRequestContract(serviceAppointmentId, serviceId, dateOptionSet, timeOptionSet, dayList, requiredResources, searchWindowStart, searchWindowEnd, searchRecurrenceStart, timeRangeEnd, duration, direction, sites, resultsCount, _searchWindowStart, _searchWindowEnd);
                            return [4 /*yield*/, Xrm.WebApi.online.execute(request).then(function (response) { return response.json(); }).then(function (results) {
                                    var records = results.value;
                                    records.forEach(function (record) {
                                        var data = {};
                                        data[MscrmControls.FindSlots.Columns.ResourcesJson] = record.resourcesJson;
                                        data[MscrmControls.FindSlots.Columns.Resources] = record.resources;
                                        data[MscrmControls.FindSlots.Columns.ScheduledStartLocalTime] = record.scheduledstartlocaltime;
                                        data[MscrmControls.FindSlots.Columns.ScheduledEndLocalTime] = record.scheduledendlocaltime;
                                        data[MscrmControls.FindSlots.Columns.Site] = record.site;
                                        dataSetRecords.push(new MscrmControls.FindSlots.FindSlotDataSetRecord(record.availabletimesid, record, "availabletimes"));
                                    });
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        DynamicdataRetriever.prototype.PopulateAppointmentRequestParameters = function (hasClientSideError, todayDate) {
            var parameters = {};
            var DATE_OPTIONSET = BookUtils.Constants.AttributeNames.SelectDate;
            var DATE_START = BookUtils.Constants.AttributeNames.DateWindowStart;
            var DATE_END = BookUtils.Constants.AttributeNames.DateWindowEnd;
            var SPECIFIC_DATE = BookUtils.Constants.AttributeNames.SpecificDate;
            var DAY_LIST = BookUtils.Constants.AttributeNames.DayList;
            var TIME_OPTIONSET = BookUtils.Constants.AttributeNames.SelectTime;
            var TIME_START = BookUtils.Constants.AttributeNames.TimeWindowStart;
            var TIME_END = BookUtils.Constants.AttributeNames.TimeWindowEnd;
            var SPECIFIC_TIME = BookUtils.Constants.AttributeNames.SpecificTime;
            var serviceAppointmentId = "";
            var serviceId;
            var offset;
            var duration;
            var timeDuration;
            var resource;
            var site;
            if (Xrm.Page.data.attributes.get(BookUtils.Constants.AttributeNames.ParamServiceAppointmentId)) {
                serviceAppointmentId = Xrm.Page.data.attributes.get(BookUtils.Constants.AttributeNames.ParamServiceAppointmentId).getValue();
                if (serviceAppointmentId)
                    serviceAppointmentId = serviceAppointmentId.slice(1, -1);
            }
            if (Xrm.Page.getControl(BookUtils.Constants.AttributeNames.ServiceIds)) {
                serviceId = Xrm.Page.getControl(BookUtils.Constants.AttributeNames.ServiceIds).getAttribute().getValue()[0].id;
            }
            if (Xrm.Page.getControl(BookUtils.Constants.AttributeNames.Duration1)) {
                duration = Xrm.Page.getControl(BookUtils.Constants.AttributeNames.Duration1).getValue();
                duration = duration.replace(/,/g, '');
            }
            if (Xrm.Page.getControl(BookUtils.Constants.AttributeNames.SiteIds)) {
                site = Xrm.Page.getControl(BookUtils.Constants.AttributeNames.SiteIds).getAttribute().getValue();
                if (site != null) {
                    var siteCollection = new Array();
                    var siteObj = {};
                    siteObj["@odata.type"] = "Microsoft.Dynamics.CRM.site";
                    siteObj["siteid"] = site[0].id;
                    siteObj["name"] = site[0].name;
                    siteCollection.push(siteObj);
                    parameters.Sites = siteCollection;
                }
            }
            if (Xrm.Page.data.attributes.get(BookUtils.Constants.AttributeNames.ParamSelectedresources) && Xrm.Page.data.attributes.get(BookUtils.Constants.AttributeNames.ParamSelectedresources).getValue() && Xrm.Page.data.attributes.get(BookUtils.Constants.AttributeNames.ParamSelectedresources).getValue().length > 0) {
                resource = Xrm.Page.data.attributes.get(BookUtils.Constants.AttributeNames.ParamSelectedresources).getValue();
                var requiredResources = new Array();
                resource.forEach(function (item) {
                    var resObj = {};
                    resObj["@odata.type"] = "Microsoft.Dynamics.CRM.resource";
                    resObj["resourceid"] = item.id;
                    resObj["name"] = item.name;
                    requiredResources.push(resObj);
                });
                parameters.RequiredResources = requiredResources;
            }
            parameters.ServiceAppointmentId = serviceAppointmentId;
            parameters.ServiceId = serviceId;
            parameters.Duration = duration;
            parameters.Direction = 1;
            var formContext = Xrm.Page;
            if (formContext.getControl(DATE_OPTIONSET) && formContext.getControl(DATE_OPTIONSET).getAttribute()) {
                var dateOptionSet = formContext.getControl(DATE_OPTIONSET).getAttribute().getValue();
                parameters.DateOptionSet = dateOptionSet;
                if (dateOptionSet == BookUtils.Constants.DateOptionSet.SpecificDate) {
                    // Client-side check to ensure the specific date is always current or future date
                    if (formContext.getControl(SPECIFIC_DATE) && formContext.getControl(SPECIFIC_DATE).getAttribute()) {
                        var userTimeZoneOffset = Xrm.Utility.getGlobalContext().userSettings.getTimeZoneOffsetMinutes();
                        var specificDate = formContext.getControl(SPECIFIC_DATE).getAttribute().getValue();
                        var userLocalTimeAsUTCString = new Date(specificDate.getTime() + userTimeZoneOffset * 60000);
                        if (this.IsEndDateInFuture(SPECIFIC_DATE, todayDate))
                            parameters.SearchWindowStart = userLocalTimeAsUTCString;
                        else
                            this.OpenErrorDialog(hasClientSideError, "Alert_ServiceActivity_Include_Future_Dates");
                    }
                }
                else if (dateOptionSet == BookUtils.Constants.DateOptionSet.RangeOfDates) {
                    var userTimeZoneOffset = Xrm.Utility.getGlobalContext().userSettings.getTimeZoneOffsetMinutes();
                    if (formContext.getControl(DATE_START) && formContext.getControl(DATE_START).getAttribute()) {
                        if (this.IsNullOrEmpty(DATE_START)) {
                            // Client-side check to ensure either start or end date is populated
                            if (this.IsNullOrEmpty(DATE_END))
                                this.OpenErrorDialog(hasClientSideError, "Alert_ServiceActivity_Check_StartOrEnd");
                        }
                        else {
                            if (!this.IsNullOrEmpty(DATE_END)) {
                                // Client-side check to ensure end date >= start date
                                if (formContext.getControl(DATE_END).getAttribute().getValue() < formContext.getControl(DATE_START).getAttribute().getValue())
                                    this.OpenErrorDialog(hasClientSideError, "Alert_ServiceActivity_Invalid_Date_Range");
                            }
                            var dateWindowStart = formContext.getControl(DATE_START).getAttribute().getValue();
                            var userLocalTimeAsUTCString = new Date(dateWindowStart.getTime() + userTimeZoneOffset * 60000);
                            parameters.SearchWindowStart = userLocalTimeAsUTCString;
                        }
                    }
                    if (formContext.getControl(DATE_END) && formContext.getControl(DATE_END).getAttribute()) {
                        if (!this.IsNullOrEmpty(DATE_END)) {
                            var dateEnd = formContext.getControl(DATE_END).getAttribute().getValue();
                            // Client-side check to ensure the end date is always current or future date
                            if (this.IsEndDateInFuture(DATE_END, todayDate))
                                parameters.SearchWindowEnd = new Date(dateEnd.getTime() + userTimeZoneOffset * 60000);
                            else
                                this.OpenErrorDialog(hasClientSideError, "Alert_ServiceActivity_Include_Future_Dates");
                        }
                    }
                    if (formContext.getControl(DAY_LIST) && formContext.getControl(DAY_LIST).getAttribute()) {
                        // Client-side check to ensure atleast one day is chosen from multi-select optionset
                        if (this.IsNullOrEmpty(DAY_LIST))
                            this.OpenErrorDialog(hasClientSideError, "Alert_ServiceActivity_Select_Days");
                        else
                            parameters.DayList = formContext.getControl(DAY_LIST).getAttribute().getValue().toString();
                    }
                }
            }
            if (formContext.getControl(TIME_OPTIONSET) && formContext.getControl(TIME_OPTIONSET).getAttribute()) {
                var timeOptionSet = formContext.getControl(TIME_OPTIONSET).getAttribute().getValue();
                parameters.TimeOptionSet = timeOptionSet;
                if (timeOptionSet == BookUtils.Constants.TimeOptionSet.SpecificTime) {
                    if (formContext.getControl(SPECIFIC_TIME) && formContext.getControl(SPECIFIC_TIME).getAttribute()) {
                        // Client-side check to ensure input time is in valid format
                        if (!this.IsValidTimeFormat(SPECIFIC_TIME))
                            this.OpenErrorDialog(hasClientSideError, "Alert_ServiceActivity_Invalid_Start_Time");
                        // TODO - this code will not be used since client side error will be thrown
                        if (formContext.getControl(SPECIFIC_TIME).getAttribute().getValue() == null)
                            offset = 480;
                        else {
                            if (formContext.getControl(SPECIFIC_TIME).getAttribute().getValue()) {
                                offset = parseInt(formContext.getControl(SPECIFIC_TIME).getAttribute().getValue());
                            }
                            if (offset && offset % 30 != 0) {
                                var minutesToAdd = 30 - (offset % 30);
                                offset = offset + minutesToAdd;
                            }
                        }
                        parameters.SearchRecurrenceStart = offset;
                    }
                }
                else if (timeOptionSet == BookUtils.Constants.TimeOptionSet.RangeOfTimes) {
                    if (formContext.getControl(TIME_START) && formContext.getControl(TIME_START).getAttribute()) {
                        // Client-side check to ensure input time is in valid format
                        if (!this.IsValidTimeFormat(TIME_START))
                            this.OpenErrorDialog(hasClientSideError, "Alert_ServiceActivity_Invalid_Start_Time");
                        if (formContext.getControl(TIME_START).getAttribute().getValue() == null)
                            offset = 480;
                        else {
                            if (formContext.getControl(TIME_START).getAttribute().getValue()) {
                                offset = parseInt(formContext.getControl(TIME_START).getAttribute().getValue());
                            }
                            if (offset && offset % 30 != 0) {
                                var minutesToAdd = 30 - (offset % 30);
                                offset = offset + minutesToAdd;
                            }
                        }
                        parameters.SearchRecurrenceStart = offset;
                    }
                    if (formContext.getControl(TIME_END) && formContext.getControl(TIME_END).getAttribute()) {
                        // Client-side check to ensure input time is in valid format
                        if (!this.IsValidTimeFormat(TIME_END))
                            this.OpenErrorDialog(hasClientSideError, "Alert_ServiceActivity_Invalid_End_Time");
                        if (formContext.getControl(TIME_END).getAttribute().getValue() == null)
                            timeDuration = 540;
                        else {
                            var timeEnd = 0;
                            if (formContext.getControl(TIME_END).getAttribute().getValue()) {
                                timeEnd = parseInt(formContext.getControl(TIME_END).getAttribute().getValue());
                            }
                            if (timeEnd && timeEnd % 30 != 0) {
                                var minutesToAdd = 30 - (timeEnd % 30);
                                timeEnd = timeEnd + minutesToAdd;
                            }
                            // Client-side check to ensure start time <= end time
                            if (timeEnd < offset)
                                this.OpenErrorDialog(hasClientSideError, "Alert_ServiceActivity_StartTime_Before_EndTime");
                            else
                                timeDuration = timeEnd - offset;
                        }
                        parameters.TimeRangeEnd = timeDuration;
                    }
                }
            }
            return parameters;
        };
        DynamicdataRetriever.prototype.IsNullOrEmpty = function (control_name) {
            var context = Xrm.Page;
            if (context.getControl(control_name) && context.getControl(control_name).getAttribute())
                if (context.getControl(control_name).getAttribute().getValue() == null)
                    return 1;
            return 0;
        };
        DynamicdataRetriever.prototype.IsEndDateInFuture = function (control_name, todayDate) {
            var context = Xrm.Page;
            var userTimeZoneOffset = Xrm.Utility.getGlobalContext().userSettings.getTimeZoneOffsetMinutes();
            var endDateRange = context.getControl(control_name) && context.getControl(control_name).getAttribute().getValue();
            var endDate = new Date(endDateRange.getTime() + userTimeZoneOffset * 60000);
            var extractDateFromEndDate = new Date(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());
            var extractDateFromTodayDate = new Date(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), todayDate.getUTCDate());
            if (extractDateFromEndDate < extractDateFromTodayDate)
                return 0;
            return 1;
        };
        DynamicdataRetriever.prototype.IsValidTimeFormat = function (control_name) {
            var timeValue = Xrm.Page.getControl(control_name) && Xrm.Page.getControl(control_name).getAttribute().getValue();
            if (timeValue == null)
                return 0;
            return 1;
        };
        DynamicdataRetriever.prototype.OpenErrorDialog = function (hasClientSideError, loc_label) {
            hasClientSideError.isError = 1;
            var errorOptions = {};
            errorOptions.message = CrmService.ResourceStringProvider.getResourceString(loc_label);
            Xrm.Navigation.openErrorDialog(errorOptions);
        };
        return DynamicdataRetriever;
    }());
    CrmService.DynamicdataRetriever = DynamicdataRetriever;
})(CrmService || (CrmService = {}));
/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
var BookUtils;
(function (BookUtils) {
    'use strict';
    /* tslint:disable:crm-force-fields-private */
    var RescheduleRequest = (function () {
        function RescheduleRequest(target /*Microsoft.Dynamics.CRM.crmbaseentity*/, returnNotifications) {
            this.Target = target;
            this.ReturnNotifications = returnNotifications;
        }
        RescheduleRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "Target": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5,
                    },
                    "ReturnNotifications": {
                        "typeName": "Edm.Boolean",
                        "structuralProperty": 1,
                    },
                },
                operationName: "Reschedule",
                operationType: 0,
            };
            return metadata;
        };
        return RescheduleRequest;
    }());
    BookUtils.RescheduleRequest = RescheduleRequest;
})(BookUtils || (BookUtils = {}));
/// <reference path="Constants.ts"/>
var BookUtils;
(function (BookUtils) {
    var SchedulingConflictDialog = (function () {
        function SchedulingConflictDialog() {
        }
        /**
         *
         * @param eventContext
         * Loads upon opening of Shceduling Conflig Dialog - Save Ignore, Schedule and Cancel
         */
        SchedulingConflictDialog.onLoad = function (eventContext) {
            var form = eventContext.getFormContext();
            var formAttributes = form.data.attributes;
            var isDraft = formAttributes.get(BookUtils.Constants.MetadataDrivenDialogConstants.ParamIsDraft) && formAttributes.get(BookUtils.Constants.MetadataDrivenDialogConstants.ParamIsDraft).getValue();
            var activityType = formAttributes.get(BookUtils.Constants.MetadataDrivenDialogConstants.ParamActivityType) && formAttributes.get(BookUtils.Constants.MetadataDrivenDialogConstants.ParamActivityType).getValue();
            var notificationData = formAttributes.get(BookUtils.Constants.MetadataDrivenDialogConstants.ParamNotificationsData) && formAttributes.get(BookUtils.Constants.MetadataDrivenDialogConstants.ParamNotificationsData).getValue();
            var saveButtonControl = form.getControl(BookUtils.Constants.MetadataDrivenDialogConstants.SaveControlId);
            if (saveButtonControl) {
                var saveButtonText = CrmService.ResourceStringProvider.getResourceString(BookUtils.Constants.ControlTexts.IgnoreAndSaveButtonDesc);
                saveButtonControl.setLabel(saveButtonText);
            }
            if (notificationData) {
                var notificationJson = JSON.parse(notificationData);
                for (var index = 0; index < notificationJson.length; index++) {
                    var notificationLevel = void 0;
                    var notificationId = BookUtils.Constants.NotificationText.ServiceAppointmentPrefix + index;
                    switch (notificationJson[index].Severity) {
                        case BookUtils.Constants.ErrorLevels.Error:
                            notificationLevel = Xrm.Constants.FormNotificationLevels.error;
                            break;
                        case BookUtils.Constants.ErrorLevels.Warning:
                            notificationLevel = Xrm.Constants.FormNotificationLevels.warning;
                            break;
                        case BookUtils.Constants.ErrorLevels.Information:
                            notificationLevel = Xrm.Constants.FormNotificationLevels.information;
                            break;
                        default:
                            notificationLevel = Xrm.Constants.FormNotificationLevels.error;
                            break;
                    }
                    form.ui.setFormNotification(notificationJson[index].Message, notificationLevel, notificationId);
                }
            }
        };
        ;
        /**
         *
         * @param eventContext
         *
         * Called when IgnoreSave is clicked
         * It captures Save button clicked and closes the current dialog
         */
        SchedulingConflictDialog.onSave = function (eventContext) {
            var attributeId = BookUtils.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked;
            var attributeVal = BookUtils.Constants.MetadataDrivenDialogConstants.SaveControlId;
            var attribute = eventContext.getFormContext().data.attributes.get(attributeId);
            if (attribute != null) {
                attribute.setValue(attributeVal);
            }
            eventContext.getFormContext().ui.close();
        };
        ;
        /**
        *
        * @param eventContext
        *
        * Called when Cancel is clicked
        * It captures Cancel button clicked and closes the current dialog
        */
        SchedulingConflictDialog.closeDialog = function (eventContext) {
            var lastButtonClicked = eventContext.getFormContext().data.attributes.get(BookUtils.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked);
            if (lastButtonClicked != null) {
                lastButtonClicked.setValue(BookUtils.Constants.MetadataDrivenDialogConstants.DialogCancelId);
            }
            eventContext.getFormContext().ui.close();
        };
        ;
        /**
          *
          * @param eventContext
          *
          * Called when Schedule is clicked
          * It captures Schedule button clicked and closes the current dialog
          */
        SchedulingConflictDialog.onSchedule = function (eventContext) {
            var attributeId = BookUtils.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked;
            var attributeVal = BookUtils.Constants.MetadataDrivenDialogConstants.ScheduleControlId;
            var attribute = eventContext.getFormContext().data.attributes.get(attributeId);
            if (attribute != null) {
                attribute.setValue(attributeVal);
            }
            eventContext.getFormContext().ui.close();
        };
        ;
        return SchedulingConflictDialog;
    }());
    BookUtils.SchedulingConflictDialog = SchedulingConflictDialog;
})(BookUtils || (BookUtils = {}));
/// <reference path="../../../../TypeDefinitions/AppCommon/Telemetry/TelemetryLibrary.d.ts" />
/// <reference path="BookRequest.ts"/>
/// <reference path="RescheduleRequest.ts"/>
/// <reference path="Constants.ts"/>
/// <reference path="SchedulingConflictDialog.ts"/>
var BookUtils;
(function (BookUtils) {
    var SchedulingEngine = (function () {
        function SchedulingEngine() {
        }
        /**
         *
         * @param context
         *
         * Book or Reschedule Service Appointment
         */
        SchedulingEngine.BookOrReScheduleServiceAppointment = function (context) {
            SchedulingEngine.SelectedSaveMode = context.getEventArgs().getSaveMode();
            //Display Save In progress indicator
            Xrm.Utility.showProgressIndicator(CrmService.ResourceStringProvider.getResourceString(BookUtils.Constants.ControlTexts.UCIFormSaving));
            return this.BuildEntity(context.getFormContext()).then(function (activity) {
                var activityId = context.getFormContext().data.entity.getId();
                var isRescheduleRequest = activityId && activityId.length > 0;
                var postRequest;
                //check if service appointment needs to be booked or rescheulded
                if (isRescheduleRequest) {
                    activity[BookUtils.Constants.AttributeNames.ActivityId] = activityId;
                    postRequest = new BookUtils.RescheduleRequest(activity, true);
                }
                else {
                    postRequest = new BookUtils.BookRequest(activity, true);
                }
                return Xrm.WebApi.online.execute(postRequest)
                    .then(function (response) {
                    return response.json().then(function (jsonResponse) {
                        SchedulingEngine.HandleBookOrReScheduleResponse(context.getFormContext(), jsonResponse);
                    });
                }, function (error) {
                    SchedulingEngine.DialogActionsErrorCallback(error);
                });
            });
        };
        /**
         *
         * @param formContext
         *
         * Build Service Appointment entity by reading attributes from the context
         */
        SchedulingEngine.BuildEntity = function (formContext) {
            var activity = {};
            var formAttributes = formContext.data.entity.attributes;
            activity[BookUtils.Constants.AttributeNames.ODataType] = BookUtils.Constants.EntityNames.ServiceAppointmentEntityType;
            var activityParties = new Array();
            var resourceDetails = JSON.parse(Xrm.Page.data.attributes.get(BookUtils.Constants.AttributeNames.ResourceDetails).getValue());
            var entitySetNames = {};
            var navigationPropertyNames = {};
            var entityToAttributes = {};
            var stateAttributeMetadata;
            var dateTimeAttributes = {};
            var dateTimeFields = new Array();
            var tzIndependentDateTimeFields = new Array();
            var promisesArray = new Array();
            var enableTzIndependentFieldSaveFCS = this.getFCSValue(BookUtils.Constants.FCSNamespaces.ServiceCalendar, BookUtils.Constants.FCSNames.EnableTimezoneIndependentFieldSave);
            formAttributes.forEach(function (wrapper) {
                var attrType = wrapper.getAttributeType().toString();
                var attrValue = wrapper.getValue();
                if (attrValue) {
                    if (attrType == BookUtils.Constants.AttributeTypes.Lookup) {
                        entityToAttributes[attrValue[0].entityType] = ["EntitySetName"];
                    }
                    if (enableTzIndependentFieldSaveFCS && attrType == BookUtils.Constants.AttributeTypes.Datetime) {
                        var attrName = wrapper.getName();
                        dateTimeFields.push(attrName);
                    }
                }
            });
            var entitiesMetadataPromise = Xrm.Utility.getEntitiesMetadata(entityToAttributes).then(function (entitiesMetadata) {
                entitiesMetadata.forEach(function (entityMetadata) {
                    entitySetNames[entityMetadata.LogicalName] = entityMetadata.EntitySetName;
                });
            }, function (error) {
                return Promise.reject(error);
            });
            var entityName = BookUtils.Constants.EntityNames.ServiceAppointment;
            var navigationMetadataPromise = Xrm.Utility.getEntityMetadata(entityName, ["statecode"]).then(function (result) {
                stateAttributeMetadata = result && result.Attributes && result.Attributes.get(BookUtils.Constants.AttributeNames.StateCode);
                result.ManyToOneRelationships.forEach(function (entity) {
                    if (entity.ReferencingEntity == entityName && result._entityDescriptor.AttributeNames.indexOf(entity.ReferencingAttribute) >= 0) {
                        navigationPropertyNames[entity.ReferencingAttribute] = entity.ReferencingEntityNavigationPropertyName;
                    }
                });
            }, function (error) {
                return Promise.reject(error);
            });
            if (enableTzIndependentFieldSaveFCS) {
                var tzIndependentDateTimeAttrPromise = Xrm.Utility.getEntityMetadata(entityName, dateTimeFields).then(function (result) {
                    dateTimeAttributes = result && result.Attributes;
                    dateTimeAttributes.forEach(function (attr) {
                        if (attr.Behavior == BookUtils.Constants.DateTimeFieldBehavior.TimeZoneIndependent) {
                            tzIndependentDateTimeFields.push(attr.LogicalName);
                        }
                    });
                }, function (error) {
                    return Promise.reject(error);
                });
                promisesArray = [entitiesMetadataPromise, navigationMetadataPromise, tzIndependentDateTimeAttrPromise];
            }
            else {
                promisesArray = [entitiesMetadataPromise, navigationMetadataPromise];
            }
            // iterate over each form attribute and populate them in activity object
            return Promise.all(promisesArray).then(function () {
                formAttributes.forEach(function (wrapper) {
                    var attrType = wrapper.getAttributeType().toString();
                    var attrValue = wrapper.getValue();
                    var attrName = wrapper.getName();
                    var isParticipationType = SchedulingEngine.isParticipationTypeAvailable(attrName);
                    if ((wrapper.getIsDirty() && !isParticipationType) || (isParticipationType && attrValue && attrValue.length > 0)) {
                        if (attrType == BookUtils.Constants.AttributeTypes.Lookup) {
                            if (isParticipationType) {
                                attrValue.forEach(function (item) {
                                    activityParties.push(SchedulingEngine.addParticipationTypeMask(item, resourceDetails, activityParties, attrName));
                                });
                            }
                            else if (attrName == BookUtils.Constants.AttributeNames.RegardingObjectId) {
                                if (attrValue && attrValue.length > 0) {
                                    var item = attrValue[0];
                                    var id = item.id.substring(1, item.id.length - 1);
                                    var entitySetName = entitySetNames[item.entityType] ? entitySetNames[item.entityType] : item.entityType;
                                    activity[BookUtils.Constants.AttributeNames.RegardingObjectId + "_" + item.entityType + "_" + BookUtils.Constants.AttributeNames.ServiceAppointmentDataBind] =
                                        "/" + entitySetName + "(" + id + ")";
                                }
                                else {
                                    activity["_" + attrName + "_value"] = attrValue;
                                }
                            }
                            else {
                                if (attrValue) {
                                    var firstValue = attrValue[0];
                                    var entitySetName = entitySetNames[firstValue.entityType] ? entitySetNames[firstValue.entityType] : firstValue.entityType;
                                    if (navigationPropertyNames && navigationPropertyNames[attrName]) {
                                        activity[navigationPropertyNames[attrName] + BookUtils.Constants.AttributeNames.ODataBind] = "/" + entitySetName + "(" + firstValue.id.substring(1, firstValue.id.length - 1) + ")";
                                    }
                                }
                                else {
                                    activity["_" + attrName + "_value"] = attrValue;
                                }
                            }
                        }
                        else if (attrType == BookUtils.Constants.AttributeTypes.MultiSelectOptionSet && attrValue) {
                            activity[attrName] = attrValue.toString();
                        }
                        else if (enableTzIndependentFieldSaveFCS && attrType == BookUtils.Constants.AttributeTypes.Datetime && attrValue) {
                            if (tzIndependentDateTimeFields.indexOf(attrName) !== -1) {
                                attrValue = new Date(attrValue.getTime() - attrValue.getTimezoneOffset() * 60000);
                                activity[attrName] = attrValue;
                            }
                            else {
                                activity[attrName] = attrValue;
                            }
                        }
                        else {
                            activity[attrName] = attrValue;
                        }
                    }
                });
                if (formContext.getAttribute(BookUtils.Constants.AttributeNames.StateCode)) {
                    activity[BookUtils.Constants.AttributeNames.StateCode] = formContext.getAttribute(BookUtils.Constants.AttributeNames.StateCode).getValue();
                }
                else {
                    activity[BookUtils.Constants.AttributeNames.StateCode] = BookUtils.Constants.StateCode.Open;
                }
                if (formContext.getAttribute(BookUtils.Constants.AttributeNames.StatusCode)) {
                    activity[BookUtils.Constants.AttributeNames.StatusCode] = formContext.getAttribute(BookUtils.Constants.AttributeNames.StatusCode).getValue();
                }
                else {
                    if (!ClientUtility.DataUtil.isNullOrUndefined(stateAttributeMetadata))
                        activity[BookUtils.Constants.AttributeNames.StatusCode] = stateAttributeMetadata && stateAttributeMetadata.getDefaultStatus(activity[BookUtils.Constants.AttributeNames.StateCode]);
                    else {
                        var errorOptions = {};
                        errorOptions.message = CrmService.ResourceStringProvider.getResourceString("Alert_Failed_Updating_ServiceActivity_Status");
                        Xrm.Navigation.openErrorDialog(errorOptions);
                    }
                }
                activity[BookUtils.Constants.AttributeNames.ServiceAppointmentActivityParties] = activityParties;
                return Promise.resolve(activity);
            });
        };
        SchedulingEngine.addParticipationTypeMask = function (item, resourceDetails, activityParties, attrName) {
            var id = item.id.substring(1, item.id.length - 1);
            var entityType = item.entityType;
            var statecode = Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.StateCode).getValue();
            var data = {};
            data[BookUtils.Constants.AttributeNames.ParticipationTypeMask] = SchedulingEngine.getParticipationTypeMask(attrName);
            data[BookUtils.Constants.AttributeNames.PartyId + "_" + entityType + BookUtils.Constants.AttributeNames.ODataBind] = "/" + entityType + "s(" + id + ")";
            // When status is set to Schedule, Effort is not being updated and we are able to see Partially available for the same slot.So we are updating the effort for the shceduled slot.
            if (statecode == BookUtils.Constants.StateCode.Close || statecode == BookUtils.Constants.StateCode.Scheduled) {
                data[BookUtils.Constants.AttributeNames.Effort] = 1;
            }
            if (resourceDetails != null && resourceDetails.length > 0) {
                var resDetails = resourceDetails.find(function (item) { return item.ResourceId.toLowerCase() === id.toLowerCase(); });
                if (resDetails) {
                    data[BookUtils.Constants.AttributeNames.ResourceSpecId + BookUtils.Constants.AttributeNames.ODataBind] = "/" + BookUtils.Constants.EntityNames.ResourceSpec + "s(" + resDetails.ResourceSpecId + ")";
                    data[BookUtils.Constants.AttributeNames.Effort] = resDetails.EffortRequired;
                }
            }
            return data;
        };
        SchedulingEngine.isParticipationTypeAvailable = function (attrName) {
            if (attrName == BookUtils.Constants.AttributeNames.From || attrName == BookUtils.Constants.AttributeNames.To
                || attrName == BookUtils.Constants.AttributeNames.CC || attrName == BookUtils.Constants.AttributeNames.BCC
                || attrName == BookUtils.Constants.AttributeNames.RequiredAttendees || attrName == BookUtils.Constants.AttributeNames.OptionalAttendees
                || attrName == BookUtils.Constants.AttributeNames.Organizer || attrName == BookUtils.Constants.AttributeNames.Resources
                || attrName == BookUtils.Constants.AttributeNames.Customers) {
                return true;
            }
            return false;
        };
        SchedulingEngine.getParticipationTypeMask = function (attrName) {
            var retValue = 0;
            switch (attrName) {
                case BookUtils.Constants.AttributeNames.From:
                    retValue = BookUtils.Constants.ParticipationTypeMasks.From;
                    break;
                case BookUtils.Constants.AttributeNames.To:
                    retValue = BookUtils.Constants.ParticipationTypeMasks.To;
                    break;
                case BookUtils.Constants.AttributeNames.CC:
                    retValue = BookUtils.Constants.ParticipationTypeMasks.CC;
                    break;
                case BookUtils.Constants.AttributeNames.BCC:
                    retValue = BookUtils.Constants.ParticipationTypeMasks.BCC;
                    break;
                case BookUtils.Constants.AttributeNames.RequiredAttendees:
                    retValue = BookUtils.Constants.ParticipationTypeMasks.RequiredAttendees;
                    break;
                case BookUtils.Constants.AttributeNames.OptionalAttendees:
                    retValue = BookUtils.Constants.ParticipationTypeMasks.OptionalAttendees;
                    break;
                case BookUtils.Constants.AttributeNames.Organizer:
                    retValue = BookUtils.Constants.ParticipationTypeMasks.Organizer;
                    break;
                case BookUtils.Constants.AttributeNames.Resources:
                    retValue = BookUtils.Constants.ParticipationTypeMasks.Resource;
                    break;
                case BookUtils.Constants.AttributeNames.Customers:
                    retValue = BookUtils.Constants.ParticipationTypeMasks.Customer;
                    break;
            }
            return retValue;
        };
        SchedulingEngine.HandleBookOrReScheduleResponse = function (formContext, jsonResponse) {
            if (jsonResponse.ValidationResult.ValidationSuccess) {
                SchedulingEngine.HandleSuccessResponse(formContext, jsonResponse.ValidationResult.ActivityId);
            }
            else {
                var notifications = jsonResponse.Notifications ? JSON.stringify(jsonResponse.Notifications) : "";
                //Build notifications if there its empty but there are validation errors
                if (notifications == "[]" && jsonResponse.ValidationResult.TraceInfo) {
                    notifications = SchedulingEngine.convertTraceInfoToNotification(jsonResponse.ValidationResult.TraceInfo.ErrorInfoList);
                }
                // Open Scheduling Conflict Diaglog - "Save And Ignore" and "Schedule" options
                SchedulingEngine.OpenSchedulingConflictDialog(formContext, notifications);
            }
        };
        /**
         *
         * @param errorInfoList
         * Parse Error TraceInfo and build notifications for human readable error formats
         */
        SchedulingEngine.convertTraceInfoToNotification = function (errorInfoList) {
            var notificationArray = new Array();
            errorInfoList.forEach(function (errorInfo) {
                var errorDesc = CrmService.ResourceStringProvider.getResourceString(errorInfo.ErrorCode);
                if (!errorDesc) {
                    errorDesc = "Error in reading localized message text : " + errorInfo.ErrorCode;
                }
                var resourceList = errorInfo.ResourceList;
                if (resourceList) {
                    resourceList.forEach(function (resource) {
                        var notification = {
                            Message: SchedulingEngine.messageFormat(errorDesc, [resource.DisplayName])
                        };
                        notificationArray.push(notification);
                    });
                }
                else {
                    notificationArray.push(errorDesc);
                }
            });
            return JSON.stringify(notificationArray);
        };
        /**
         *
         * @param str
         * @param args
         *
         * Reusable utility for filling placeholders {X} with arguments in message string
         */
        SchedulingEngine.messageFormat = function (str, args) {
            return str.replace(SchedulingEngine.formatRegex, function (item) {
                var intVal = parseInt(item.substring(1, item.length - 1));
                var replace;
                if (intVal >= 0) {
                    replace = args[intVal];
                }
                else if (intVal === -1) {
                    replace = "{";
                }
                else if (intVal === -2) {
                    replace = "}";
                }
                else {
                    replace = "";
                }
                return replace;
            });
        };
        ;
        /**
         *
         * @param formContext
         * @param entityId
         *
         * Handles successful book/reschedule of service appointment
         */
        SchedulingEngine.HandleSuccessResponse = function (formContext, entityId) {
            try {
                var entityName = formContext.data.entity.getEntityName();
                var formParams_1 = {};
                var formAttributes = formContext.data.entity.attributes;
                // iterate over each form parameters and clear them from being dirty
                //this is done to prevent displaying unsaved changes warning when closes service appointment form
                formAttributes.forEach(function (attr) {
                    var attrName = attr.getName(), attrType = attr.getAttributeType(), attrValue = attr.getValue();
                    if (attrName !== "isdraft") {
                        formParams_1[attrName] = attrValue;
                        attr.setSubmitMode(BookUtils.Constants.AttributeSubmitModes[BookUtils.Constants.AttributeSubmitModes.never]);
                    }
                });
                if (formContext.data.attributes.get(BookUtils.Constants.AttributeNames.ResourceDetails)) {
                    formContext.data.attributes.get(BookUtils.Constants.AttributeNames.ResourceDetails).setSubmitMode(BookUtils.Constants.AttributeSubmitModes[BookUtils.Constants.AttributeSubmitModes.never]);
                }
                Xrm.Utility.closeProgressIndicator();
                if (SchedulingEngine.SelectedSaveMode === BookUtils.Constants.SaveMode.saveandclose) {
                    formContext.ui.close();
                }
                else {
                    if (window.history.length > 1) {
                        formContext.ui.close();
                    }
                    var formOptions = {
                        entityName: entityName,
                        entityId: entityId
                    };
                    //We have created a Task (3462461) as part of which we will redesign Create and Update logic in order to better handle save and close functionality.
                    setTimeout(function () {
                        Xrm.Navigation.openForm(formOptions);
                    }, 100);
                }
            }
            catch (exception) {
                Xrm.Utility.closeProgressIndicator();
            }
        };
        /**
         *
         * @param formContext
         * This will mark attributes as dirty to present user that there are unsaved changes
         */
        SchedulingEngine.clearFormAttributeSubmitMode = function (formContext) {
            var formAttributes = formContext.data.entity.attributes;
            formAttributes.forEach(function (wrapper) {
                if (wrapper.getSubmitMode() === BookUtils.Constants.AttributeSubmitModes[BookUtils.Constants.AttributeSubmitModes.never]) {
                    wrapper.setSubmitMode(BookUtils.Constants.AttributeSubmitModes[BookUtils.Constants.AttributeSubmitModes.dirty]);
                }
            });
        };
        SchedulingEngine.DialogActionsErrorCallback = function (errorResponse) {
            Xrm.Utility.closeProgressIndicator();
            Xrm.Navigation.openErrorDialog(errorResponse);
        };
        /**
         *
         * @param formContext
         * @param notification
         *
         * Opens up Scheduling Conflict Diaglog - "Save And Ignore" and "Schedule" options
         */
        SchedulingEngine.OpenSchedulingConflictDialog = function (formContext, notification) {
            var dialogOptions = { height: 300, width: 600, position: 1 /* center */ };
            var dialogParameters = {};
            dialogParameters[BookUtils.Constants.MetadataDrivenDialogConstants.ParamIsDraft] = Xrm.Page.getAttribute("isdraft") != null ? (!Xrm.Page.getAttribute("isdraft").getValue()).toString() : "false";
            dialogParameters[BookUtils.Constants.MetadataDrivenDialogConstants.ParamNotificationsData] = notification;
            dialogParameters[BookUtils.Constants.MetadataDrivenDialogConstants.ParamActivityType] = formContext.data.entity.getEntityName();
            //telemetryItem.traceEventInformation("Opening Conflict Dialog.");
            Xrm.Utility.closeProgressIndicator();
            Xrm.Navigation.openDialog(BookUtils.Constants.DialogNames.ServiceAppointmentConflict, dialogOptions, dialogParameters).then(function (response) {
                // when user click on "Save and Ignore"execute calls to Create/Update Service Appointment
                if (response.parameters[BookUtils.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked] === BookUtils.Constants.MetadataDrivenDialogConstants.SaveControlId) {
                    Xrm.Utility.showProgressIndicator(CrmService.ResourceStringProvider.getResourceString(BookUtils.Constants.ControlTexts.UCIFormSaving));
                    //telemetryItem.traceEventInformation("Saving or Sending conflicting appointment");
                    var entityName = formContext.data.entity.getEntityName();
                    SchedulingEngine.clearFormAttributeSubmitMode(formContext);
                    SchedulingEngine.BuildEntity(formContext).then(function (activity) {
                        var activityId = Xrm.Page.data.entity.getId();
                        if (activityId && activityId.length > 0) {
                            // telemetryItem.traceEventInformation("Updating conflicting record.");
                            Xrm.WebApi.updateRecord(formContext.data.entity.getEntityName(), Xrm.Page.data.entity.getId(), activity).then(function (lookupValue) {
                                var endtime = new Date();
                                // telemetryItem.traceEventCustom("UpdateRequestTime", (endtime.valueOf() - startTime.valueOf()));
                                SchedulingEngine.HandleSuccessResponse(formContext, Xrm.Page.data.entity.getId());
                            }).catch(function (exception) {
                                SchedulingEngine.saveInProgress = false;
                                // making the dirty list set, so as to show the unsaved page to user
                                SchedulingEngine.clearFormAttributeSubmitMode(formContext);
                                //telemetryItem.traceEventError("Error in Updating the record.", exception);
                                SchedulingEngine.DialogActionsErrorCallback(exception);
                            });
                        }
                        else {
                            //telemetryItem.traceEventInformation("Creating conflicting record.");
                            Xrm.WebApi.createRecord(formContext.data.entity.getEntityName(), activity).then(function (createdEntityRef) {
                                var endtime = new Date();
                                //telemetryItem.traceEventCustom("CreateRequestTime", (endtime.valueOf() - startTime.valueOf()));
                                SchedulingEngine.HandleSuccessResponse(formContext, createdEntityRef.id);
                            }).catch(function (exception) {
                                SchedulingEngine.saveInProgress = false;
                                // making the dirty list set, so as to show the unsaved page to user
                                SchedulingEngine.clearFormAttributeSubmitMode(formContext);
                                //telemetryItem.traceEventError("Error in Creating the record.", exception);
                                SchedulingEngine.DialogActionsErrorCallback(exception);
                            });
                        }
                    });
                }
                else if (response.parameters[BookUtils.Constants.MetadataDrivenDialogConstants.ParamLastButtonClicked] === BookUtils.Constants.MetadataDrivenDialogConstants.ScheduleControlId) {
                    Mscrm.Schedule_submit();
                }
                else {
                    // when "Cancel" is clicked
                    //telemetryItem.traceEventInformation("Cancelled Conflict Dialog.");
                    SchedulingEngine.saveInProgress = false;
                    SchedulingEngine.clearFormAttributeSubmitMode(formContext);
                }
            }, function (error) {
                SchedulingEngine.DialogActionsErrorCallback(error);
            });
        };
        /**
         *
         * @param namespaceName
         * @param fcskey
         *
         * Handles FCS value fetch with a given namespace and key
         */
        SchedulingEngine.getFCSValue = function (namespaceName, fcskey) {
            if (window.Xrm && window.Xrm.Page.context) {
                return window.Xrm.Utility.getGlobalContext().getFeatureControlSetting(namespaceName, fcskey);
            }
            return false;
        };
        return SchedulingEngine;
    }());
    SchedulingEngine.formatRegex = new RegExp(BookUtils.Constants.Regex.RegexNums, BookUtils.Constants.Regex.RegexFlag);
    BookUtils.SchedulingEngine = SchedulingEngine;
})(BookUtils || (BookUtils = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var CrmService;
(function (CrmService) {
    'use strict';
    var ServiceAppointmentLegacyLibrary = (function () {
        function ServiceAppointmentLegacyLibrary() {
            var global = window;
            var mscrm = global.Mscrm;
            mscrm.serviceAppointmentMainSystemLibraryWebResource = new ServiceAppointmentLegacyMainSystemLibraryWebResource();
            mscrm.Form_onload = mscrm.serviceAppointmentMainSystemLibraryWebResource.form_onload;
            mscrm.Form_onsave = mscrm.serviceAppointmentMainSystemLibraryWebResource.form_onsave;
            mscrm.serviceid_onchange = mscrm.serviceAppointmentMainSystemLibraryWebResource.serviceid_onchange;
            mscrm.isalldayevent_onchange = mscrm.serviceAppointmentMainSystemLibraryWebResource.isalldayevent_onchange;
        }
        return ServiceAppointmentLegacyLibrary;
    }());
    CrmService.ServiceAppointmentLegacyLibrary = ServiceAppointmentLegacyLibrary;
    var ServiceAppointmentLegacyMainSystemLibraryWebResource = (function () {
        function ServiceAppointmentLegacyMainSystemLibraryWebResource() {
            this.form_onload = function (context) {
                InitCalendar(USER_DATE_FORMATSTRING, USER_DATE_SEPARATOR, USER_DATE_START_DAY, _dCalMinDate);
                _oServiceRetrieveCommand = new RemoteCommand("Service", "Retrieve");
                !Mscrm.InternalUtilities.JSTypes.isNull(location.search.match(/loadDialog=([^&]*)/)) && window.setTimeout("ScheduleActivity($get('crmFormSubmit').crmFormSubmitId.value, ServiceAppointment, !Mscrm.InternalUtilities.JSTypes.isNull(location.search.match(/autoSearch=([^&]*)/)))", 100);
            };
            this.form_onsave = function (context) {
                CustomFormSubmit($find("crmForm"), context.getEventArgs());
            };
            this.serviceid_onchange = function (context) {
                ServiceLookupChanged();
            };
            this.isalldayevent_onchange = function (context) {
                Mscrm.FormControlInputBehavior.GetBehavior("scheduledstart").set_forceSubmit(true);
                Mscrm.FormControlInputBehavior.GetBehavior("scheduledend").set_forceSubmit(true);
            };
        }
        return ServiceAppointmentLegacyMainSystemLibraryWebResource;
    }());
    CrmService.ServiceAppointmentLegacyMainSystemLibraryWebResource = ServiceAppointmentLegacyMainSystemLibraryWebResource;
})(CrmService || (CrmService = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var CrmService;
(function (CrmService) {
    'use strict';
    var DialogName = (function () {
        function DialogName() {
        }
        return DialogName;
    }());
    DialogName.DeleteDialog = "delete";
    DialogName.AssignQueue = "AssignQueue";
    DialogName.AssociateCase = "AssociateCase";
    DialogName.CancelCaseDialog = "CancelCase";
    DialogName.CancelContract = "CancelContract";
    DialogName.ConvertToCaseDialog = "ConvertToCase";
    DialogName.ConvertToKnowledgeArticleDialog = "ConvertToKnowledgeArticle";
    DialogName.CopyContract = "CopyContract";
    DialogName.MergeCase = "MergeCase";
    DialogName.ReactivateCase = "ReactivateCase";
    DialogName.ResolveCase = "ResolveCase";
    DialogName.RouteCase = "routecase";
    DialogName.SetContractCalendar = "SetContractCalendar";
    DialogName.SaveAndRouteCase = "saveandroutecase";
    DialogName.RenewContract = "RenewContract";
    DialogName.SelectContractTemplate = "SelectContractTemplate";
    DialogName.SelectEntitlementTemplate = "SelectEntitlementTemplate";
    DialogName.RenewEntitlement = "RenewEntitlement";
    DialogName.SetDefaultEntitlement = "SetDefaultEntitlement";
    DialogName.MergeSuccessMessage = "MergeSuccessMessage";
    DialogName.CancelEntitlement = "CancelEntitlement";
    DialogName.ResourceResourceGroups = "ResourceResourceGroups";
    DialogName.ResourceServices = "ResourceServices";
    DialogName.SaveAndReRouteDialog = "SaveAndReRouteDialog";
    CrmService.DialogName = DialogName;
})(CrmService || (CrmService = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var CrmService;
(function (CrmService) {
    'use strict';
    var EntityNames = (function () {
        function EntityNames() {
        }
        return EntityNames;
    }());
    EntityNames.Account = "account";
    EntityNames.Appointment = "appointment";
    EntityNames.AttributeMap = "attributemap";
    EntityNames.Connection = "connection";
    EntityNames.ConstraintBasedGroup = "constraintbasedgroup";
    EntityNames.Contact = "contact";
    EntityNames.Contract = "contract";
    EntityNames.ContractDetail = "contractdetail";
    EntityNames.Email = "email";
    EntityNames.Entitlement = "entitlement";
    EntityNames.EntitlementTemplate = "entitlementtemplate";
    EntityNames.EntityMap = "entitymap";
    EntityNames.EnvironmentVariableValue = "environmentvariablevalue";
    EntityNames.Equipment = "equipment";
    EntityNames.Fax = "fax";
    EntityNames.Incident = "incident";
    EntityNames.IncidentResolution = "incidentresolution";
    EntityNames.KnowledgeArticle = "knowledgearticle";
    EntityNames.KnowledgeArticleIncident = "knowledgearticleincident";
    EntityNames.Lead = "lead";
    EntityNames.Letter = "letter";
    EntityNames.Opportunity = "opportunity";
    EntityNames.Organization = "organization";
    EntityNames.Product = "product";
    EntityNames.PhoneCall = "phonecall";
    EntityNames.RecurringAppointmentMaster = "recurringappointmentmaster";
    EntityNames.Resource = "resource";
    EntityNames.ResourceSpec = "resourcespec";
    EntityNames.RoutingRule = "routingrule";
    EntityNames.Site = "site";
    EntityNames.SocialActivity = "socialactivity";
    EntityNames.Subject = "subject";
    EntityNames.Workflow = "workflow";
    EntityNames.UserSettings = "usersettings";
    EntityNames.Service = "service";
    EntityNames.ServiceAppointment = "serviceappointment";
    EntityNames.SystemUser = "systemuser";
    EntityNames.Task = "task";
    EntityNames.TopicModelConfiguration = "topicmodelconfiguration";
    EntityNames.UoMSchedule = "uomschedule";
    EntityNames.UnresolvedAddress = "unresolvedaddress";
    EntityNames.Queue = "queue";
    CrmService.EntityNames = EntityNames;
})(CrmService || (CrmService = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var CrmService;
(function (CrmService) {
    'use strict';
    var EntityTypeCodes;
    (function (EntityTypeCodes) {
        EntityTypeCodes[EntityTypeCodes["Account"] = 1] = "Account";
        EntityTypeCodes[EntityTypeCodes["Appointment"] = 4201] = "Appointment";
        EntityTypeCodes[EntityTypeCodes["Contact"] = 2] = "Contact";
        EntityTypeCodes[EntityTypeCodes["ContractTemplate"] = 2011] = "ContractTemplate";
        EntityTypeCodes[EntityTypeCodes["Email"] = 4202] = "Email";
        EntityTypeCodes[EntityTypeCodes["Entitlement"] = 9700] = "Entitlement";
        EntityTypeCodes[EntityTypeCodes["EntitlementTemplate"] = 9702] = "EntitlementTemplate";
        EntityTypeCodes[EntityTypeCodes["Equipment"] = 4000] = "Equipment";
        EntityTypeCodes[EntityTypeCodes["Fax"] = 4204] = "Fax";
        EntityTypeCodes[EntityTypeCodes["Incident"] = 112] = "Incident";
        EntityTypeCodes[EntityTypeCodes["KnowledgeArticle"] = 9953] = "KnowledgeArticle";
        EntityTypeCodes[EntityTypeCodes["Lead"] = 4] = "Lead";
        EntityTypeCodes[EntityTypeCodes["Letter"] = 4207] = "Letter";
        EntityTypeCodes[EntityTypeCodes["PhoneCall"] = 4210] = "PhoneCall";
        EntityTypeCodes[EntityTypeCodes["Queue"] = 2020] = "Queue";
        EntityTypeCodes[EntityTypeCodes["RecurringAppointmentMaster"] = 4251] = "RecurringAppointmentMaster";
        EntityTypeCodes[EntityTypeCodes["SocialActivity"] = 4216] = "SocialActivity";
        EntityTypeCodes[EntityTypeCodes["Subject"] = 129] = "Subject";
        EntityTypeCodes[EntityTypeCodes["SystemUser"] = 8] = "SystemUser";
        EntityTypeCodes[EntityTypeCodes["Task"] = 4212] = "Task";
        EntityTypeCodes[EntityTypeCodes["UnresolvedAddress"] = 2012] = "UnresolvedAddress";
        EntityTypeCodes[EntityTypeCodes["WebWizard"] = 4800] = "WebWizard";
    })(EntityTypeCodes = CrmService.EntityTypeCodes || (CrmService.EntityTypeCodes = {}));
})(CrmService || (CrmService = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path = "./EntityNames.ts" />
/// <reference path = "./EntityTypeCodes.ts" />
/// <reference path="../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var CrmService;
(function (CrmService) {
    'use strict';
    var ClientUtil = (function () {
        function ClientUtil() {
        }
        ClientUtil.getEntityName = function (entityTypeCode) {
            switch (entityTypeCode) {
                case CrmService.EntityTypeCodes.Appointment:
                    return CrmService.EntityNames.Appointment;
                case CrmService.EntityTypeCodes.Email:
                    return CrmService.EntityNames.Email;
                case CrmService.EntityTypeCodes.Fax:
                    return CrmService.EntityNames.Fax;
                case CrmService.EntityTypeCodes.KnowledgeArticle:
                    return CrmService.EntityNames.KnowledgeArticle;
                case CrmService.EntityTypeCodes.Queue:
                    return CrmService.EntityNames.Queue;
                case CrmService.EntityTypeCodes.Letter:
                    return CrmService.EntityNames.Letter;
                case CrmService.EntityTypeCodes.PhoneCall:
                    return CrmService.EntityNames.PhoneCall;
                case CrmService.EntityTypeCodes.RecurringAppointmentMaster:
                    return CrmService.EntityNames.RecurringAppointmentMaster;
                case CrmService.EntityTypeCodes.Task:
                    return CrmService.EntityNames.Task;
                case CrmService.EntityTypeCodes.Account:
                    return CrmService.EntityNames.Account;
                case CrmService.EntityTypeCodes.Contact:
                    return CrmService.EntityNames.Contact;
                case CrmService.EntityTypeCodes.SocialActivity:
                    return CrmService.EntityNames.SocialActivity;
                case CrmService.EntityTypeCodes.UnresolvedAddress:
                    return CrmService.EntityNames.UnresolvedAddress;
                default:
                    return Xrm.Internal.getEntityName(entityTypeCode);
            }
        };
        ClientUtil.getEntityTypeCodes = function (entityName) {
            var propertyName = null;
            for (var key in CrmService.EntityNames) {
                if (CrmService.EntityNames.hasOwnProperty(key)) {
                    var value = CrmService.EntityNames[key];
                    if (value === entityName) {
                        propertyName = key;
                        break;
                    }
                }
            }
            if (!CrmService.EntityTypeCodes.hasOwnProperty(propertyName)) {
                throw "Not a valid entity name";
            }
            var result = CrmService.EntityTypeCodes[propertyName];
            return result;
        };
        /**
         * Checks whether the code is running on a UCI client.
         * @returns A flag indicating whether the code is running on a UCI client.
         */
        ClientUtil.isUCI = function () {
            var global = window;
            var xrm = global.Xrm;
            var result = false;
            if (xrm && xrm.Internal && ClientUtil.hasFunction(xrm.Internal, 'isUci')) {
                result = xrm.Internal.isUci();
            }
            else {
                // fall back to url inspection
                result = window && window.parent && window.parent.location && window.parent.location.href && window.parent.location.href.toLowerCase().indexOf('uclient') !== -1;
            }
            return result;
        };
        return ClientUtil;
    }());
    ClientUtil.WebResourceName = "";
    ClientUtil.Is_CSS_Installed = function () {
        return new Promise(function (resolve, reject) {
            var optionSetUrl = "/api/data/v9.0/EntityDefinitions(LogicalName='bookingstatus')/Attributes/Microsoft.Dynamics.CRM.PicklistAttributeMetadata?$filter=LogicalName eq 'msdyn_serviceappointmentstatus'&$select=LogicalName";
            var req = new XMLHttpRequest();
            req.open("GET", Xrm.Page.context.getClientUrl() + optionSetUrl, true);
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.onreadystatechange = function () {
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    if (this.status === 200) {
                        var data = JSON.parse(req.response);
                        if (data != null && data.value != null && data.value.length != 0) {
                            resolve(true);
                        }
                        else {
                            resolve(false);
                        }
                    }
                    else {
                        reject();
                    }
                }
            };
            req.send();
        });
    };
    /**
     * Checks if a given object is a function
     * @param object The object check.
     * @returns true if the object is a function; otherwise, false.
     */
    ClientUtil.isFunction = function (object) {
        return !!object && typeof object === 'function';
    };
    /**
     * Checks if a given object has a given function
     * @param object The object check.
     * @param functionName The name of the function to check for.
     * @returns true if the object has a given function; otherwise, false.
     */
    ClientUtil.hasFunction = function (object, functionName) {
        return !!object && functionName && ClientUtil.isFunction(object[functionName]);
    };
    CrmService.ClientUtil = ClientUtil;
})(CrmService || (CrmService = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var CrmService;
(function (CrmService) {
    'use strict';
    var MetadataDrivenDialogConstants = (function () {
        function MetadataDrivenDialogConstants() {
        }
        // Refactor the below getter functions once Link controls support custom client scripts
        // We have to use different keys for UCI and webclient because incident resolution link control rely on the usage of hidden controls
        // Once link control support loading of custom scripts, this can be removed and we can just use queryparameters.
        MetadataDrivenDialogConstants.GetAllotmentsRemaining = function (isUCI) {
            return (isUCI ? this.ParamAllotmentsRemaining : this.AllotmentsRemaining);
        };
        MetadataDrivenDialogConstants.GetIsTimeAllotment = function (isUCI) {
            return (isUCI ? this.ParamIsTimeAllotment : this.IsTimeAllotment);
        };
        MetadataDrivenDialogConstants.GetLastButtonClicked = function (isUCI) {
            return (isUCI ? this.ParamLastButtonClicked : this.LastButtonClicked);
        };
        MetadataDrivenDialogConstants.GetEntityId = function (isUCI) {
            return (isUCI ? this.ParamEntityId : this.EntityId);
        };
        MetadataDrivenDialogConstants.GetTimeSpent = function (isUCI) {
            return (isUCI ? this.ParamTimeSpent : this.TimeSpent);
        };
        return MetadataDrivenDialogConstants;
    }());
    MetadataDrivenDialogConstants.AllotmentsRemaining = "iAllotmentsRemaining";
    MetadataDrivenDialogConstants.AssignQueueEntityName = "entity_name";
    MetadataDrivenDialogConstants.AssignQueueLastButtonClicked = "last_button_clicked";
    MetadataDrivenDialogConstants.AssignQueueRecords = "entity_records";
    MetadataDrivenDialogConstants.AssignQueueSelectedRecordAcount = "selected_records_count";
    MetadataDrivenDialogConstants.AssignQueueShowAssignToMeOption = "show_assign_to_me_option";
    MetadataDrivenDialogConstants.AttributeMapIdDictionary = "attributeMapIdDictionary";
    MetadataDrivenDialogConstants.BillableTime = "billabletime_id";
    MetadataDrivenDialogConstants.BusinessRequiredAttributes = "businessRequiredAttributes";
    MetadataDrivenDialogConstants.CascadeStatusUpdate = "cascadestatusupdate";
    MetadataDrivenDialogConstants.CancelCaseString = "CancelCaseConfirm";
    MetadataDrivenDialogConstants.CaseId = "incidentId";
    MetadataDrivenDialogConstants.CaseSettingsMandatoryFieldsNotSelected = "Web._grid.cmds.dlg_casehierarchy.aspx_6";
    MetadataDrivenDialogConstants.CloseCaseConfirmAllotments = "Case_Resolve_Dlg_Confirm_Allotments";
    MetadataDrivenDialogConstants.CloseCaseConfirmContractDetailState = "Case_Resolve_Dlg_Confirm_ContractDetailState";
    MetadataDrivenDialogConstants.CloseCaseConfirmParent = "Case_Resolve_Dlg_Confirm_Parent";
    MetadataDrivenDialogConstants.CaseResolutionIncidentNotActive = "Case_Resolve_Dlg_Incident_Not_Active";
    MetadataDrivenDialogConstants.IncidentIdNotFound = "No_Incident_Id";
    MetadataDrivenDialogConstants.CloseCaseStringForNullSubject = "Web.CS.cases.dlg_closecase.aspx_50";
    MetadataDrivenDialogConstants.CloseCaseString = "Web.CS.cases.dlg_closecase.aspx_27";
    MetadataDrivenDialogConstants.ContractStateActive = 2;
    MetadataDrivenDialogConstants.ContractDetailStateExpired = 3;
    MetadataDrivenDialogConstants.ContractDetailStateCanceled = 2;
    MetadataDrivenDialogConstants.ConvertToKnowledgeArticleContent = "content_id";
    MetadataDrivenDialogConstants.ConvertToKnowledgeArticleId = "knowledgeArticleId";
    MetadataDrivenDialogConstants.ConvertToKnowledgeArticleOwnerId = "owner_id";
    MetadataDrivenDialogConstants.ConvertToKnowledgeArticleSubjectId = "subject_id";
    MetadataDrivenDialogConstants.ConvertToKnowledgeArticleTitle = "title_id";
    MetadataDrivenDialogConstants.CreateAttributeMaps = "createAttributeMaps";
    MetadataDrivenDialogConstants.CustomerLookup = "customerLookup";
    MetadataDrivenDialogConstants.DefaultStatus = -1;
    MetadataDrivenDialogConstants.DialogOkId = "ok_id";
    MetadataDrivenDialogConstants.DialogCancelId = "cancel_id";
    MetadataDrivenDialogConstants.DialogSetId = "set_id";
    MetadataDrivenDialogConstants.DialogAddId = "add_id";
    MetadataDrivenDialogConstants.EntityId = "entityId";
    MetadataDrivenDialogConstants.EntityMapId = "entitymapid";
    MetadataDrivenDialogConstants.EntityTypeCode = "entityTypeCode";
    MetadataDrivenDialogConstants.ExistingAttributes = "existingAttributes";
    MetadataDrivenDialogConstants.EntitlementDefaultDialogWidth = 1000;
    MetadataDrivenDialogConstants.EntitlementDefaultDialogHeight = 200;
    MetadataDrivenDialogConstants.GridControl = "gridControl";
    MetadataDrivenDialogConstants.IncidentDescription = "incident_description";
    MetadataDrivenDialogConstants.IncidentResolution = "incident_resolution";
    MetadataDrivenDialogConstants.IncidentResolutionDescription = "incidentresolution_description";
    MetadataDrivenDialogConstants.IsTimeAllotment = "bIsTimeAllotment";
    MetadataDrivenDialogConstants.LastButtonClicked = "lastButtonClicked";
    MetadataDrivenDialogConstants.NoValidStatusTransitionAlertTextResourceString = "Web.Record.NoValidStatusReasonTransition03";
    MetadataDrivenDialogConstants.OpenNewId = "cbOpenNew_id";
    MetadataDrivenDialogConstants.OpenNewRecord = "openNewRecord";
    MetadataDrivenDialogConstants.OrganizationId = "organizationid";
    MetadataDrivenDialogConstants.EnvVarDefinitionId = "envVarDefinitionId";
    MetadataDrivenDialogConstants.EnvVarVariableId = "envVarVariableId";
    MetadataDrivenDialogConstants.OwnerId = "ownerId";
    MetadataDrivenDialogConstants.OwnerName = "ownerName";
    MetadataDrivenDialogConstants.OwnerType = "ownerType";
    MetadataDrivenDialogConstants.Remarks = "remarks_id";
    MetadataDrivenDialogConstants.Resolution = "resolution_id";
    MetadataDrivenDialogConstants.ResolutionType = "resolutionType_id";
    MetadataDrivenDialogConstants.ResolveCaseString = "Web._cs.Cases.dlg_ConfirmResolve.aspx_3";
    MetadataDrivenDialogConstants.RestrictStatusUpdate = "restrictstatusupdate";
    MetadataDrivenDialogConstants.SaveActivity = "saveActivity";
    MetadataDrivenDialogConstants.SaveActivityId = "cbSaveActivity_id";
    MetadataDrivenDialogConstants.SelectedAttributes = "cc_selectedAttributes_id";
    MetadataDrivenDialogConstants.SourceAttributeName = "sourceattributename";
    MetadataDrivenDialogConstants.SpecifyClosurePreference = "specifyClosurePreference_id";
    MetadataDrivenDialogConstants.MaxChildCaseNumberControlId = "maxChildCase_id";
    MetadataDrivenDialogConstants.StatusReasonId = "setcasestatus_id";
    MetadataDrivenDialogConstants.StateCode = "statecode";
    MetadataDrivenDialogConstants.StatusCode = "statuscode";
    MetadataDrivenDialogConstants.StatusCodeId = "statusCode_id";
    MetadataDrivenDialogConstants.Subject = "subject";
    MetadataDrivenDialogConstants.SubjectLookup = "subject_id";
    MetadataDrivenDialogConstants.SystemRequiredAttributes = "systemRequiredAttributes";
    MetadataDrivenDialogConstants.TargetAttributeName = "targetattributename";
    MetadataDrivenDialogConstants.TimeSpent = "timeSpent";
    MetadataDrivenDialogConstants.TotalTime = "totaltime_id";
    MetadataDrivenDialogConstants.EntityLogicalName = "entity_logical_name";
    MetadataDrivenDialogConstants.Entity_Id = "entity_id";
    MetadataDrivenDialogConstants.EffectivityCalendar = "effectivity_calendar";
    MetadataDrivenDialogConstants.AttributeEffectivityCalendar = "effectivitycalendar";
    MetadataDrivenDialogConstants.ContractCalendarControl = "cc_ContractCalendar";
    MetadataDrivenDialogConstants.IsReadOnly = "is_read_only";
    MetadataDrivenDialogConstants.Id = "Id";
    MetadataDrivenDialogConstants.ResolveCaseCommandName = "CloseIncident";
    MetadataDrivenDialogConstants.ParamTimeSpent = "param_time_spent";
    MetadataDrivenDialogConstants.ParamIsTimeAllotment = "param_is_time_allotment";
    MetadataDrivenDialogConstants.ParamAllotmentsRemaining = "param_allotments_remaining";
    MetadataDrivenDialogConstants.ParamLastButtonClicked = "param_lastButtonClicked";
    MetadataDrivenDialogConstants.CancelEntitlementTitleId = "lbl_cancelEntitlementDialog";
    MetadataDrivenDialogConstants.CancelEntitlementDescriptionId = "lbl_cancelEntitlementDialogDescription";
    MetadataDrivenDialogConstants.ParamEntityId = "param_entityId";
    MetadataDrivenDialogConstants.ParamEntityRecords = "param_entityRecords";
    MetadataDrivenDialogConstants.ParamEntityType = "param_entityType";
    MetadataDrivenDialogConstants.paramCaseId = "param_incidentId";
    MetadataDrivenDialogConstants.paramCustomerLookup = "param_customerLookup";
    MetadataDrivenDialogConstants.paramSubject = "param_subject";
    MetadataDrivenDialogConstants.paramSaveActivity = "param_saveActivity";
    MetadataDrivenDialogConstants.paramOpenNewRecord = "param_openNewRecord";
    MetadataDrivenDialogConstants.paramEmailSubject = "param_emailSubject";
    MetadataDrivenDialogConstants.paramEmailDescription = "param_emailDescription";
    MetadataDrivenDialogConstants.CancelDateId = "cancelDate_id";
    MetadataDrivenDialogConstants.MergeSuccessDescriptionId = "lbl_mergeSucessMessage";
    MetadataDrivenDialogConstants.MergeSuccessTitleId = "lbl_mergecases";
    MetadataDrivenDialogConstants.ParamResultDescription = "param_result_description";
    MetadataDrivenDialogConstants.ParamRequestType = "param_request_type";
    MetadataDrivenDialogConstants.IncludeCanceledContractLinesId = "includeCanceledContractLines_id";
    MetadataDrivenDialogConstants.ParamRenewedContractId = "param_renewedContractId";
    MetadataDrivenDialogConstants.ParamClonedContractId = "param_clonedContractId";
    MetadataDrivenDialogConstants.ParamConvertToKnowledgeArticleId = "param_knowledgeArticleId";
    MetadataDrivenDialogConstants.ParamIncidentTitle = "param_incident_title";
    MetadataDrivenDialogConstants.ParamIncidentDescription = "param_incident_description";
    MetadataDrivenDialogConstants.ParamIncidentResolution = "param_incident_resolution";
    MetadataDrivenDialogConstants.ParamIncidentResolutionDescription = "param_incidentresolution_description";
    MetadataDrivenDialogConstants.ParamOpenNewRecord = "param_openNewRecord";
    MetadataDrivenDialogConstants.ParamSubjectId = "param_subjectId";
    MetadataDrivenDialogConstants.ParamSubjectName = "param_subjectName";
    MetadataDrivenDialogConstants.ContractTemplateLookup = "contracttemplate_id";
    MetadataDrivenDialogConstants.ContractTemplateId = "contractTemplateId";
    MetadataDrivenDialogConstants.ContractTemplateEntityType = "contractTemplateEntityType";
    MetadataDrivenDialogConstants.EntitlementTemplateLookup = "entitlementtemplate_id";
    MetadataDrivenDialogConstants.EntitlementTemplateId = "entitlementTemplateId";
    MetadataDrivenDialogConstants.EntitlementTemplateEntityType = "entitlementTemplateEntityType";
    MetadataDrivenDialogConstants.PreviousDefaultEntitlementId = "param_previousDefaultEntitlementId";
    MetadataDrivenDialogConstants.CurrentDefaultEntitlementId = "param_currentDefaultEntitlementId";
    MetadataDrivenDialogConstants.DoesDefaultEntitlementExist = "param_doesDefaultEntitlementExist";
    // Button clicks
    MetadataDrivenDialogConstants.Merge = "Merge";
    MetadataDrivenDialogConstants.Set = "Set";
    MetadataDrivenDialogConstants.CancelId = "cancel_id";
    // ClientContextGridControl parameters
    MetadataDrivenDialogConstants.ParamEntityLogicalName = "param_entityLogicalName";
    MetadataDrivenDialogConstants.ParamQueryParameters = "param_queryParameters";
    MetadataDrivenDialogConstants.ParamGridColumns = "param_gridColumns";
    MetadataDrivenDialogConstants.SelectedRecordId = "selectedRecordId";
    // Incident entity properties
    MetadataDrivenDialogConstants.IncidentLogicalName = "incident";
    MetadataDrivenDialogConstants.IncidentId = "incidentid";
    MetadataDrivenDialogConstants.CreatedOn = "createdon";
    MetadataDrivenDialogConstants.PriorityCode = "prioritycode";
    MetadataDrivenDialogConstants.Title = "title";
    MetadataDrivenDialogConstants.ParentCaseId = "parentcaseid";
    MetadataDrivenDialogConstants.CustomerId_Value = "_customerid_value";
    MetadataDrivenDialogConstants.CustomerId = "customerid";
    MetadataDrivenDialogConstants.ParentCaseIdValue = "_parentcaseid_value";
    MetadataDrivenDialogConstants.paramAllAvailableCaseAttributes = "param_allAvailableCaseAttributes";
    MetadataDrivenDialogConstants.paramSystemRequiredAttributes = "param_systemRequiredAttributes";
    MetadataDrivenDialogConstants.paramExistingAttributes = "param_existingAttributes";
    MetadataDrivenDialogConstants.paramAttributeMapIdDictionary = "param_attributeMapIdDictionary";
    MetadataDrivenDialogConstants.paramBusinessRequiredAttributes = "param_businessRequiredAttributes";
    MetadataDrivenDialogConstants.SelectedServiceConfigStatus = "cc_availableValues_id";
    // request types
    MetadataDrivenDialogConstants.RequestTypeMerge = "merge";
    MetadataDrivenDialogConstants.RequestTypeAssociateChild = "associatechild";
    MetadataDrivenDialogConstants.ContractState = {
        draft: 0,
        invoiced: 1,
        active: 2,
        onHold: 3,
        canceled: 4,
        expired: 5
    };
    MetadataDrivenDialogConstants.ContractDetailState = {
        existing: 0,
        renewed: 1,
        canceled: 2,
        expired: 3
    };
    MetadataDrivenDialogConstants.EntitlementState = {
        draft: 0,
        active: 1,
        cancel: 2,
        expire: 3,
        waiting: 4
    };
    MetadataDrivenDialogConstants.AdvancedSimilarityRuleState = {
        active: 0,
        inactive: 1
    };
    MetadataDrivenDialogConstants.IncidentStateCodes = {
        active: 0,
        resolved: 1,
        canceled: 2,
    };
    MetadataDrivenDialogConstants.AccountStateCodes = {
        active: 0,
        inactive: 1
    };
    MetadataDrivenDialogConstants.ContactStateCodes = {
        active: 0,
        inactive: 1
    };
    MetadataDrivenDialogConstants.IotAlertStateCodes = {
        active: 0,
        inactive: 1,
        inprogress: 2,
        closed: 3
    };
    MetadataDrivenDialogConstants.ProductStateCodes = {
        active: 0,
        retired: 1,
        draft: 2
    };
    MetadataDrivenDialogConstants.SocialProfileStateCodes = {
        active: 0,
        inactive: 1
    };
    CrmService.MetadataDrivenDialogConstants = MetadataDrivenDialogConstants;
})(CrmService || (CrmService = {}));
/// <reference path="DialogName.ts" />
/// <reference path="EntityNames.ts" />
/// <reference path="EntityTypeCodes.ts" />
/// <reference path="ClientUtil.ts" />
/// <reference path="MetadataDrivenDialogConstants.ts" /> 
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../DynamicDataRetriever.ts"/>
/// <reference path="../ScheduleEngine.ts"/>
/// <reference path="../../ServiceClientCommon/DataContracts/Action/LocalTimeFromUtcTimeRequest.ts" />
/// <reference path="../Constants.ts"/>
/// <reference path="../../ServiceClientCommon/Service_ClientCommon.ts"/>
var CrmService;
(function (CrmService) {
    'use strict';
    var ServiceAppointmentUCILibrary = (function () {
        function ServiceAppointmentUCILibrary() {
            var global = window;
            var mscrm = global.Mscrm;
            mscrm.serviceAppointmentMainSystemLibraryWebResource = new ServiceAppointmentUCIMainSystemLibraryWebResource();
            mscrm.Form_onload = mscrm.serviceAppointmentMainSystemLibraryWebResource.form_onload;
            mscrm.Form_onsave = mscrm.serviceAppointmentMainSystemLibraryWebResource.form_onsave;
            mscrm.serviceid_onchange = mscrm.serviceAppointmentMainSystemLibraryWebResource.serviceid_onchange;
            mscrm.isalldayevent_onchange = mscrm.serviceAppointmentMainSystemLibraryWebResource.isalldayevent_onchange;
            mscrm.Navigate_to_findAvailableTimes = mscrm.serviceAppointmentMainSystemLibraryWebResource.navigate_to_findAvailableTimes;
            mscrm.Navigate_to_findAvailableTimes_FormAssistant = mscrm.serviceAppointmentMainSystemLibraryWebResource.navigate_to_findAvailableTimes_from_form_assistant;
            mscrm.Navigate_to_formAssistant = mscrm.serviceAppointmentMainSystemLibraryWebResource.navigate_to_form_assistant;
            mscrm.Close_dialog = mscrm.serviceAppointmentMainSystemLibraryWebResource.close_dialog;
            mscrm.Navigate_back = mscrm.serviceAppointmentMainSystemLibraryWebResource.navigate_back;
            mscrm.Navigate_back_FormAssistant = mscrm.serviceAppointmentMainSystemLibraryWebResource.navigate_back_from_form_assistant;
            mscrm.ScheduleDialog_onload = mscrm.serviceAppointmentMainSystemLibraryWebResource.scheduledialog_onload;
            mscrm.OnDateRangeChangeHandler = mscrm.serviceAppointmentMainSystemLibraryWebResource.OnDateRangeChangeHandler;
            mscrm.OnTimeRangeChangeHandler = mscrm.serviceAppointmentMainSystemLibraryWebResource.OnTimeRangeChangeHandler;
            mscrm.OnServiceChangeDialogHandler = mscrm.serviceAppointmentMainSystemLibraryWebResource.OnServiceChangeDialogHandler;
            mscrm.OnDurationChangeDialogHandler = mscrm.serviceAppointmentMainSystemLibraryWebResource.OnDurationChangeDialogHandler;
            mscrm.OnUseDefaultDurationChangeHandler = mscrm.serviceAppointmentMainSystemLibraryWebResource.OnUseDefaultDurationChangeHandler;
            mscrm.Record_submit = mscrm.serviceAppointmentMainSystemLibraryWebResource.record_submit;
            mscrm.Schedule_submit = mscrm.serviceAppointmentMainSystemLibraryWebResource.schedule_submit;
            mscrm.Should_Display_Schedule = mscrm.serviceAppointmentMainSystemLibraryWebResource.Should_Display_Schedule;
        }
        return ServiceAppointmentUCILibrary;
    }());
    CrmService.ServiceAppointmentUCILibrary = ServiceAppointmentUCILibrary;
    var ServiceAppointmentUCIMainSystemLibraryWebResource = (function () {
        function ServiceAppointmentUCIMainSystemLibraryWebResource() {
            var _this = this;
            this.DEFAULT_DURATION = 60;
            this.USER_TIMEZONE_CODE = 92;
            this.CSS_INSTALLED = false;
            this.PREVIOUS_TAB = BookUtils.Constants.AttributeNames.ScheduleTab;
            this.form_onload = function (context) {
                if (_this.AppCommonNullCheck())
                    AppCommon.TelemetryReporter.Instance().PostStartMarker("ServiceWebResources", "ServiceAppointmentUCILibrary", "Form_onload::initiateFormLoad", Xrm.Page.data.entity.getId());
                if (_this.AppCommonNullCheck())
                    AppCommon.TelemetryReporter.Instance().PostEndMarker("ServiceWebResources", "ServiceAppointmentUCILibrary", "Form_onload::initiateFormLoad", Xrm.Page.data.entity.getId());
                var that = _this;
                CrmService.ClientUtil.Is_CSS_Installed().then(function (response) {
                    if (response == true) {
                        that.CSS_INSTALLED = true;
                    }
                    else {
                        var formContext = context.getFormContext();
                        //register on change handlers for start, end time and duration
                        if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledStart))
                            Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledStart).addOnChange(ServiceAppointmentUCIMainSystemLibraryWebResource.ModifyOnScheduledStart);
                        if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledEnd))
                            Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledEnd).addOnChange(ServiceAppointmentUCIMainSystemLibraryWebResource.ModifyOnScheduledEnd);
                        if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes)) {
                            Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes).addOnChange(ServiceAppointmentUCIMainSystemLibraryWebResource.ModifyOnDuration);
                        }
                        if (formContext.getAttribute(BookUtils.Constants.AttributeNames.StateCode))
                            formContext.getAttribute(BookUtils.Constants.AttributeNames.StateCode).addOnChange(that.OnStateChangeHandler);
                        //set default duration to 30 minutes if not already
                        if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes) && !Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes).getValue()) {
                            Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes).setValue(30);
                        }
                        //set the default startdatetime nearest to current time if not set already
                        if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledStart) && !Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledStart).getValue()) {
                            var offset = void 0;
                            if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes)) {
                                offset = Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes).getValue() * 60 * 1000;
                            }
                            else {
                                offset = ServiceAppointmentUCIMainSystemLibraryWebResource.SCHEDULED_DURATION_IN_MINUTES * 60 * 1000;
                            }
                            var startTime = new Date(Math.ceil(new Date().getTime() / offset) * offset);
                            Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledStart).setValue(startTime);
                            //invoke chage in scheduledstart explictly
                            ServiceAppointmentUCIMainSystemLibraryWebResource.ModifyOnScheduledStart();
                        }
                    }
                });
            };
            this.form_onsave = function (context) {
                if (this.serviceAppointmentMainSystemLibraryWebResource.CSS_INSTALLED == false) {
                    var formContext = context.getFormContext();
                    var saveMode = context.getEventArgs().getSaveMode();
                    var isFormDirty = formContext.data.entity.getIsDirty();
                    // Prevent save if form is not dirty
                    if (!isFormDirty)
                        return;
                    // Prevent Autosave of ServiceAppointment
                    if (saveMode == BookUtils.Constants.SaveMode.autosave) {
                        context.getEventArgs().preventDefault();
                    }
                    else {
                        if (ServiceAppointmentUCIMainSystemLibraryWebResource.getFCSValue(BookUtils.Constants.FCSNamespaces.ServiceCalendar, BookUtils.Constants.FCSNames.EnableClientSubjectFieldSanitization)) {
                            if (formContext.getAttribute(BookUtils.Constants.AttributeNames.Subject)) {
                                var subject = formContext.getAttribute(BookUtils.Constants.AttributeNames.Subject).getValue();
                                var sanitizedSubject = ServiceAppointmentUCIMainSystemLibraryWebResource.sanitizeInput(subject);
                                formContext.getAttribute(BookUtils.Constants.AttributeNames.Subject).setValue(sanitizedSubject);
                            }
                        }
                        //This will prevent further operations like Save automatically handled by UCI form Infra
                        context.getEventArgs().preventDefault();
                        BookUtils.SchedulingEngine.BookOrReScheduleServiceAppointment(context);
                    }
                }
            };
            this.serviceid_onchange = function (context) {
                if (this.serviceAppointmentMainSystemLibraryWebResource.CSS_INSTALLED == false) {
                    var serviceId = (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ServiceId) && Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ServiceId).getValue()) ? Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ServiceId).getValue()[0].id : null;
                    if (serviceId == null) {
                        return;
                    }
                    if (Xrm.Page.getControl(BookUtils.Constants.AttributeNames.FooterStateCode)) {
                        Xrm.Page.getControl(BookUtils.Constants.AttributeNames.FooterStateCode).getAttribute().setValue(BookUtils.Constants.StateCode.Scheduled);
                    }
                    if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.StateCode)) {
                        Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.StateCode).setValue(BookUtils.Constants.StateCode.Scheduled);
                    }
                    Xrm.WebApi.online.retrieveRecord(BookUtils.Constants.EntityNames.Service, serviceId.substring(1, serviceId.length - 1), "?$select=duration,initialstatuscode").then(function success(result) {
                        if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes)) {
                            var duration = result[BookUtils.Constants.AttributeNames.Duration];
                            Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes).setValue(duration);
                        }
                        if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.StatusCode)) {
                            var serviceStatusCode = result[BookUtils.Constants.AttributeNames.InitialStatusCode];
                            Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.StatusCode).setValue(serviceStatusCode);
                            Xrm.Utility.getEntityMetadata(BookUtils.Constants.EntityNames.ServiceAppointment, [BookUtils.Constants.AttributeNames.StatusCode]).then(function (entityMetadata) {
                                var statusAttribute = entityMetadata.Attributes.get(BookUtils.Constants.AttributeNames.StatusCode);
                                var stateCode = statusAttribute && statusAttribute.getState(serviceStatusCode);
                                if (Xrm.Page.getControl(BookUtils.Constants.AttributeNames.FooterStateCode)) {
                                    Xrm.Page.getControl(BookUtils.Constants.AttributeNames.FooterStateCode).getAttribute().setValue(stateCode);
                                }
                                if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.StateCode)) {
                                    Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.StateCode).setValue(stateCode);
                                }
                            });
                        }
                        ServiceAppointmentUCIMainSystemLibraryWebResource.ModifyOnDuration();
                    }, function (error) {
                        //setting to default value 30 minutes
                        if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes)) {
                            Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes).setValue(30);
                        }
                    });
                }
            };
            this.isalldayevent_onchange = function (context) {
                if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.IsAllDayEvent) && Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.IsAllDayEvent).getValue()) {
                    if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes)) {
                        Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes).setValue(BookUtils.Constants.AttributeNames.AllDayEventDurationInMin);
                    }
                    else {
                        ServiceAppointmentUCIMainSystemLibraryWebResource.SCHEDULED_DURATION_IN_MINUTES = BookUtils.Constants.AttributeNames.AllDayEventDurationInMin;
                    }
                    if (ServiceAppointmentUCIMainSystemLibraryWebResource.getFCSValue(BookUtils.Constants.FCSNamespaces.ServiceCalendar, BookUtils.Constants.FCSNames.EnableAllDayEventBehaviorFix)) {
                        if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledStart)) {
                            var originalStartDate = new Date(Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledStart).getValue());
                            var originalEndDate = new Date(Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledEnd).getValue());
                            // Create a new start date at midnight in user's timezone
                            var newStartDate = new Date(originalStartDate.getFullYear(), originalStartDate.getMonth(), originalStartDate.getDate(), 0, 0, 0, 0);
                            // Create a new end date - if original end date is already at midnight, keep it; otherwise go to midnight of next day
                            var newEndDate = void 0;
                            if (originalEndDate.getHours() === 0 && originalEndDate.getMinutes() === 0 && originalEndDate.getSeconds() === 0 && originalEndDate.getMilliseconds() === 0) {
                                // Original end date is already at midnight, keep it as is
                                newEndDate = new Date(originalEndDate.getFullYear(), originalEndDate.getMonth(), originalEndDate.getDate(), 0, 0, 0, 0);
                            }
                            else {
                                // Original end date has a time component, move to midnight of next day
                                newEndDate = new Date(originalEndDate.getFullYear(), originalEndDate.getMonth(), originalEndDate.getDate() + 1, 0, 0, 0, 0);
                            }
                            // Set the updated dates
                            Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledStart).setValue(newStartDate);
                            Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledEnd).setValue(newEndDate);
                            // Calculate duration in minutes based on date difference
                            var durationMs = newEndDate.getTime() - newStartDate.getTime();
                            var durationMinutes = Math.round(durationMs / (ServiceAppointmentUCIMainSystemLibraryWebResource.SECONDS_IN_MINUTE * ServiceAppointmentUCIMainSystemLibraryWebResource.MILLISECONDS_IN_SECOND));
                            Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes).setValue(durationMinutes);
                        }
                    }
                    else {
                        if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledStart)) {
                            var startDate = new Date(Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledStart).getValue());
                            var endDate = new Date(Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledEnd).getValue());
                            var startTimezoneOffset = startDate.getTimezoneOffset();
                            var endTimezoneOffset = endDate.getTimezoneOffset();
                            var localStartDate = new Date(startDate.getTime() + (startTimezoneOffset * 60000));
                            var localEndDate = new Date(endDate.getTime() + (endTimezoneOffset * 60000));
                            var localStartDateSetHrs = new Date(localStartDate).setHours(0, 0, 0, 0);
                            var localstartDateSetOffset = new Date(localStartDateSetHrs).setMinutes(-startTimezoneOffset);
                            Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledStart).setValue(new Date(localstartDateSetOffset));
                            if (localStartDate.toDateString() == localEndDate.toDateString()) {
                                Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledEnd).setValue(new Date(endDate.setDate(endDate.getDate() + 1)));
                            }
                            else {
                                var startDate = new Date(Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledStart).getValue());
                                if (!(localEndDate.getHours() == 0 && localEndDate.getMinutes() == 0)) {
                                    Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledEnd).setValue(new Date(endDate.setDate(endDate.getDate() + 1)));
                                }
                            }
                            var duration = Math.abs(endDate.getDate() - startDate.getDate());
                            duration = 60 * 24 * duration;
                            Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes).setValue(duration);
                        }
                    }
                }
                else {
                    if (ServiceAppointmentUCIMainSystemLibraryWebResource.getFCSValue(BookUtils.Constants.FCSNamespaces.ServiceCalendar, BookUtils.Constants.FCSNames.EnableAllDayEventBehaviorFix)) {
                        if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes)) {
                            Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes).setValue(ServiceAppointmentUCIMainSystemLibraryWebResource.DEFAULT_DURATION_IN_MINUTES);
                        }
                    }
                    else {
                        if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes)) {
                            var duration = Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes).getValue();
                            if (duration == BookUtils.Constants.AttributeNames.AllDayEventDurationInMin)
                                Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes).setValue(30);
                        }
                    }
                }
                ServiceAppointmentUCIMainSystemLibraryWebResource.ModifyOnScheduledStart();
            };
            this.navigate_to_form_assistant = function (context) {
                var formContext = context.getFormContext();
                // populate service field
                if (formContext.getControl(BookUtils.Constants.AttributeNames.ServiceIds) && formContext.getControl(BookUtils.Constants.AttributeNames.ServiceIds).getAttribute()) {
                    var serviceId = formContext.getControl(BookUtils.Constants.AttributeNames.ServiceIds).getAttribute().getValue();
                    if (formContext.getControl(BookUtils.Constants.AttributeNames.FormAssistantServiceField) && formContext.getControl(BookUtils.Constants.AttributeNames.FormAssistantServiceField).getAttribute())
                        formContext.getControl(BookUtils.Constants.AttributeNames.FormAssistantServiceField).getAttribute().setValue(serviceId);
                }
                var navigation = Xrm.Page.ui;
                navigation.moveTo(BookUtils.Constants.AttributeNames.FormAssistantTab);
            };
            this.navigate_to_findAvailableTimes = function (context) { return __awaiter(_this, void 0, void 0, function () {
                var formContext, hasClientSideError, slotRecords, resultsCount, response, serviceId, siteId, navigation, lookupOptions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            formContext = context.getFormContext();
                            this.DisableButtons(context, true, null);
                            hasClientSideError = { isError: 0 };
                            slotRecords = [];
                            resultsCount = Xrm.Utility.getGlobalContext().userSettings.pagingLimit;
                            return [4 /*yield*/, new CrmService.DynamicdataRetriever().RetrieveAvailableSlots(hasClientSideError, this.TODAY_DATE, slotRecords, resultsCount, null, null)];
                        case 1:
                            response = _a.sent();
                            if (hasClientSideError.isError) {
                                this.DisableButtons(context, false, null);
                                return [2 /*return*/, Promise.resolve()];
                            }
                            // set the fetch slot to page attribute for later retrieval
                            Xrm.Page.data.attributes[BookUtils.Constants.InternalAttributeNames.SlotRecords] = slotRecords;
                            if (formContext.getControl(BookUtils.Constants.AttributeNames.ServiceIds) && formContext.getControl(BookUtils.Constants.AttributeNames.ServiceIds).getAttribute()) {
                                serviceId = formContext.getControl(BookUtils.Constants.AttributeNames.ServiceIds).getAttribute().getValue();
                                if (formContext.getControl(BookUtils.Constants.AttributeNames.ServiceIdsReadOnly))
                                    formContext.getControl(BookUtils.Constants.AttributeNames.ServiceIdsReadOnly).getAttribute().setValue(serviceId);
                            }
                            if (formContext.getControl(BookUtils.Constants.AttributeNames.SiteIds) && formContext.getControl(BookUtils.Constants.AttributeNames.SiteIds).getAttribute()) {
                                siteId = formContext.getControl(BookUtils.Constants.AttributeNames.SiteIds).getAttribute().getValue();
                                if (formContext.getControl(BookUtils.Constants.AttributeNames.SiteIdsReadOnly))
                                    formContext.getControl(BookUtils.Constants.AttributeNames.SiteIdsReadOnly).getAttribute().setValue(siteId);
                            }
                            this.DisableButtons(context, false, null);
                            navigation = Xrm.Page.ui;
                            navigation.moveTo(BookUtils.Constants.AttributeNames.AvailableTimesTab);
                            lookupOptions = {
                                entityType: BookUtils.Constants.EntityNames.AvailableTimes
                            };
                            Xrm.Utility.refreshParentGrid(lookupOptions);
                            return [2 /*return*/, response];
                    }
                });
            }); };
            this.navigate_to_findAvailableTimes_from_form_assistant = function (context) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // To ensure 'Back' button in Find Available Times comes back to Form Assistant
                    this.PREVIOUS_TAB = BookUtils.Constants.AttributeNames.FormAssistantTab;
                    return [2 /*return*/, this.navigate_to_findAvailableTimes(context)];
                });
            }); };
            this.close_dialog = function (context) {
                Xrm.Page.ui.close();
            };
            this.navigate_back = function (context) {
                var navigation = Xrm.Page.ui;
                if (_this.PREVIOUS_TAB == BookUtils.Constants.AttributeNames.ScheduleTab)
                    navigation.moveTo(BookUtils.Constants.AttributeNames.ScheduleTab);
                else if (_this.PREVIOUS_TAB == BookUtils.Constants.AttributeNames.FormAssistantTab)
                    navigation.moveTo(BookUtils.Constants.AttributeNames.FormAssistantTab);
            };
            this.navigate_back_from_form_assistant = function (context) {
                _this.PREVIOUS_TAB = BookUtils.Constants.AttributeNames.ScheduleTab;
                var navigation = Xrm.Page.ui;
                navigation.moveTo(BookUtils.Constants.AttributeNames.ScheduleTab);
            };
            this.schedule_submit = function (context) {
                var options = { width: "50%", height: "100%", position: 2 /* side */ };
                var dialogParams = _this.setScheduleDialogParameters();
                Xrm.Navigation.openDialog(BookUtils.Constants.AttributeNames.ServiceActivityScheduleDialog, options, dialogParams).then(function (params) {
                    var parameters = params.parameters;
                    if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ServiceId) && parameters[BookUtils.Constants.AttributeNames.ServiceIds]) {
                        var existingServiceId = null;
                        if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ServiceId) != null) {
                            if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ServiceId).getValue() != null) {
                                existingServiceId = Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ServiceId).getValue()[0].id.replace('{', '').replace('}', '').toLowerCase();
                            }
                        }
                        var paramServiceId = null;
                        if (parameters[BookUtils.Constants.AttributeNames.ServiceIds] != null) {
                            if (parameters[BookUtils.Constants.AttributeNames.ServiceIds].length > 0) {
                                paramServiceId = parameters[BookUtils.Constants.AttributeNames.ServiceIds][0].id.replace('{', '').replace('}', '').toLowerCase();
                            }
                        }
                        Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ServiceId).setValue([parameters[BookUtils.Constants.AttributeNames.ServiceIds][0]]);
                        if (existingServiceId != paramServiceId)
                            Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ServiceId).fireOnChange();
                    }
                    if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.SiteId) && parameters[BookUtils.Constants.AttributeNames.SiteIds]) {
                        var existingSiteId = null;
                        if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.SiteId) != null) {
                            if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.SiteId).getValue() != null) {
                                existingSiteId = Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.SiteId).getValue()[0].id.replace('{', '').replace('}', '').toLowerCase();
                            }
                        }
                        var paramSiteId = null;
                        if (parameters[BookUtils.Constants.AttributeNames.SiteIds] != null) {
                            if (parameters[BookUtils.Constants.AttributeNames.SiteIds].length > 0) {
                                paramSiteId = parameters[BookUtils.Constants.AttributeNames.SiteIds][0].id.replace('{', '').replace('}', '').toLowerCase();
                            }
                        }
                        Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.SiteId).setValue([parameters[BookUtils.Constants.AttributeNames.SiteIds][0]]);
                        if (existingSiteId != paramSiteId)
                            Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.SiteId).fireOnChange();
                    }
                    if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Customers) && parameters[BookUtils.Constants.AttributeNames.ParamSelectedcustomers]) {
                        var diffInCustomers = false;
                        var existingCustomers = new Array();
                        if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Customers) != null) {
                            if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Customers).getValue() != null) {
                                for (var i = 0; i < Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Customers).getValue().length; i++) {
                                    existingCustomers[i] = Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Customers).getValue()[i].id.replace('{', '').replace('}', '').toLowerCase();
                                }
                            }
                        }
                        var paramCustomers = new Array();
                        if (parameters[BookUtils.Constants.AttributeNames.ParamSelectedcustomers] != null) {
                            if (parameters[BookUtils.Constants.AttributeNames.ParamSelectedcustomers].length > 0) {
                                for (var i = 0; i < parameters[BookUtils.Constants.AttributeNames.ParamSelectedcustomers].length; i++) {
                                    paramCustomers[i] = parameters[BookUtils.Constants.AttributeNames.ParamSelectedcustomers][i].id.replace('{', '').replace('}', '').toLowerCase();
                                }
                            }
                        }
                        if (existingCustomers.length != paramCustomers.length)
                            diffInCustomers = true;
                        else {
                            for (var i = 0; i < existingCustomers.length; i++) {
                                if (paramCustomers.indexOf(existingCustomers[i]) == -1)
                                    diffInCustomers = true;
                            }
                        }
                        Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Customers).setValue(parameters[BookUtils.Constants.AttributeNames.ParamSelectedcustomers]);
                        if (diffInCustomers)
                            Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Customers).fireOnChange();
                    }
                    //if any slot is selected by user
                    if (parameters[BookUtils.Constants.InternalAttributeNames.SelectedSlot]) {
                        var record = JSON.parse(parameters[BookUtils.Constants.InternalAttributeNames.SelectedSlot]);
                        if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledStart))
                            Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledStart).setValue(new Date(record._record[BookUtils.Constants.AttributeNames.ScheduledStart]));
                        if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledEnd))
                            Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledEnd).setValue(new Date(record._record[BookUtils.Constants.AttributeNames.ScheduledEnd]));
                        var resourceEntities = JSON.parse(record._record[BookUtils.Constants.InternalAttributeNames.ResourcesJson]);
                        var fileteredResources = new Array();
                        var resourceDetails = Array();
                        resourceEntities.forEach(function (res) {
                            var resource = {};
                            resource[BookUtils.Constants.AttributeNames.ID] = "{" + res.ResourceId + "}";
                            resource[BookUtils.Constants.AttributeNames.EntityType] = res.EntityName;
                            resource[BookUtils.Constants.AttributeNames.Name] = res.DisplayName;
                            fileteredResources.push(resource);
                            resourceDetails.push(res);
                        });
                        if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Resources)) {
                            var diffInResources = false;
                            var existingResources = new Array();
                            if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Resources) != null) {
                                if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Resources).getValue() != null) {
                                    for (var i = 0; i < Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Resources).getValue().length; i++) {
                                        existingResources[i] = Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Resources).getValue()[i].id.replace('{', '').replace('}', '').toLowerCase();
                                    }
                                }
                            }
                            var paramResources = new Array();
                            if (fileteredResources != null) {
                                if (fileteredResources.length > 0) {
                                    for (var i = 0; i < fileteredResources.length; i++) {
                                        paramResources[i] = fileteredResources[i].id.replace('{', '').replace('}', '').toLowerCase();
                                    }
                                }
                            }
                            if (existingResources.length != paramResources.length)
                                diffInResources = true;
                            else {
                                for (var i = 0; i < existingResources.length; i++) {
                                    if (paramResources.indexOf(existingResources[i]) == -1)
                                        diffInResources = true;
                                }
                            }
                            Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Resources).setValue(fileteredResources);
                            if (diffInResources)
                                Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Resources).fireOnChange();
                        }
                        if (!parameters[BookUtils.Constants.AttributeNames.SiteIds] && record._record[BookUtils.Constants.AttributeNames.SiteId] && record._record[BookUtils.Constants.AttributeNames.Site]) {
                            var sites = new Array();
                            var siteRecord = {};
                            siteRecord[BookUtils.Constants.AttributeNames.ID] = "{" + record._record[BookUtils.Constants.AttributeNames.SiteId] + "}";
                            siteRecord[BookUtils.Constants.AttributeNames.EntityType] = BookUtils.Constants.EntityNames.Site;
                            siteRecord[BookUtils.Constants.AttributeNames.Name] = record._record[BookUtils.Constants.AttributeNames.Site];
                            sites.push(siteRecord);
                            if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.SiteId)) {
                                var existingSiteId = null;
                                if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.SiteId) != null) {
                                    if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.SiteId).getValue() != null) {
                                        existingSiteId = Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.SiteId).getValue()[0].id.replace('{', '').replace('}', '').toLowerCase();
                                    }
                                }
                                Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.SiteId).setValue(sites);
                                if (existingSiteId != record._record[BookUtils.Constants.AttributeNames.SiteId].toLowerCase())
                                    Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.SiteId).fireOnChange();
                            }
                        }
                        if (Xrm.Page.data.attributes.get(BookUtils.Constants.AttributeNames.ResourceDetails))
                            Xrm.Page.data.attributes.get(BookUtils.Constants.AttributeNames.ResourceDetails).setValue(JSON.stringify(resourceDetails));
                        if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes) && parameters[BookUtils.Constants.AttributeNames.Duration1])
                            Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes).setValue(parameters[BookUtils.Constants.AttributeNames.Duration1]);
                    }
                    else if (parameters[BookUtils.Constants.AttributeNames.ParamSelectedresources] && parameters[BookUtils.Constants.AttributeNames.ParamSelectedresources].length > 0) {
                        //update only when resources were added/updated on schedule page
                        if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Resources)) {
                            var diffInResources = false;
                            var existingResources = new Array();
                            if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Resources) != null) {
                                if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Resources).getValue() != null) {
                                    for (var i = 0; i < Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Resources).getValue().length; i++) {
                                        existingResources[i] = Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Resources).getValue()[i].id.replace('{', '').replace('}', '').toLowerCase();
                                    }
                                }
                            }
                            var paramResources = new Array();
                            if (parameters[BookUtils.Constants.AttributeNames.ParamSelectedresources] != null) {
                                if (parameters[BookUtils.Constants.AttributeNames.ParamSelectedresources].length > 0) {
                                    for (var i = 0; i < parameters[BookUtils.Constants.AttributeNames.ParamSelectedresources].length; i++) {
                                        paramResources[i] = parameters[BookUtils.Constants.AttributeNames.ParamSelectedresources][i].id.replace('{', '').replace('}', '').toLowerCase();
                                    }
                                }
                            }
                            if (existingResources.length != paramResources.length)
                                diffInResources = true;
                            else {
                                for (var i = 0; i < existingResources.length; i++) {
                                    if (paramResources.indexOf(existingResources[i]) == -1)
                                        diffInResources = true;
                                }
                            }
                            Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Resources).setValue(parameters[BookUtils.Constants.AttributeNames.ParamSelectedresources]);
                            if (diffInResources)
                                Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Resources).fireOnChange();
                        }
                    }
                });
            };
            /**
             * When  Schedule button on Schedule Dialog is clicked after slot was selected on grid, it is captured and store in page attribute
             * **/
            this.record_submit = function (context) {
                var record = Xrm.Page.data.attributes[BookUtils.Constants.InternalAttributeNames.SelectedRecord];
                if (Xrm.Page.getControl(BookUtils.Constants.InternalAttributeNames.SelectedSlot))
                    Xrm.Page.getControl(BookUtils.Constants.InternalAttributeNames.SelectedSlot).getAttribute().setValue(JSON.stringify(record));
                Xrm.Page.ui.close();
            };
            this.scheduledialog_onload = function (context) {
                var formContext = context.getFormContext();
                if (formContext.getControl(BookUtils.Constants.InternalAttributeNames.SelectedSlot))
                    formContext.getControl(BookUtils.Constants.InternalAttributeNames.SelectedSlot).setVisible(false);
                if ((Xrm && Xrm.Internal && Xrm.Internal.isFeatureEnabled("FormAssistantForServiceActivity")) && formContext.getControl(BookUtils.Constants.AttributeNames.FormAssistantButtonId)) {
                    formContext.getControl(BookUtils.Constants.AttributeNames.FormAssistantButtonId).setVisible(true);
                }
                var attributes = Xrm.Page.data.attributes;
                // TODO - add nullcheck here
                var serviceId = attributes.get(BookUtils.Constants.AttributeNames.ParamServiceId) && attributes.get(BookUtils.Constants.AttributeNames.ParamServiceId).getValue();
                var siteId = attributes.get(BookUtils.Constants.AttributeNames.ParamSiteId) && attributes.get(BookUtils.Constants.AttributeNames.ParamSiteId).getValue();
                var duration = attributes.get(BookUtils.Constants.AttributeNames.ParamDuration) && attributes.get(BookUtils.Constants.AttributeNames.ParamDuration).getValue();
                if (formContext.getControl(BookUtils.Constants.AttributeNames.Duration1))
                    formContext.getControl(BookUtils.Constants.AttributeNames.Duration1).getAttribute().setValue(duration);
                if (serviceId != null) {
                    var serviceLookupValue = new Array();
                    serviceLookupValue.push(serviceId);
                    if (formContext.getControl(BookUtils.Constants.AttributeNames.ServiceIds))
                        formContext.getControl(BookUtils.Constants.AttributeNames.ServiceIds).getAttribute().setValue(serviceLookupValue);
                    if (formContext.getControl(BookUtils.Constants.AttributeNames.ServiceIdsReadOnly))
                        formContext.getControl(BookUtils.Constants.AttributeNames.ServiceIdsReadOnly).getAttribute().setValue(serviceLookupValue);
                }
                if (siteId != null) {
                    var siteLookupValue = new Array();
                    siteLookupValue.push(siteId);
                    if (formContext.getControl(BookUtils.Constants.AttributeNames.SiteIds).getAttribute())
                        formContext.getControl(BookUtils.Constants.AttributeNames.SiteIds).getAttribute().setValue(siteLookupValue);
                    if (formContext.getControl(BookUtils.Constants.AttributeNames.SiteIdsReadOnly))
                        formContext.getControl(BookUtils.Constants.AttributeNames.SiteIdsReadOnly).getAttribute().setValue(siteLookupValue);
                }
                if (formContext.getControl("DayList"))
                    formContext.getControl("DayList").getAttribute().setValue([0, 1, 2, 3, 4, 5, 6]);
                _this.SetDefaultTimeRange(context);
                _this.GetDefaultDurationFromService(context, serviceId);
                _this.OnDateRangeChangeHandler(context);
                _this.OnTimeRangeChangeHandler(context);
                _this.OnServiceChangeDialogHandler(context);
                _this.OnDurationChangeDialogHandler(context);
                _this.OnUseDefaultDurationChangeHandler(context);
                _this.InitializeWeeklySchedulePicklist(context);
            };
            this.AppCommonNullCheck = function () {
                return ((typeof (AppCommon) !== 'undefined') &&
                    (AppCommon != null && AppCommon != undefined) &&
                    (AppCommon.TelemetryReporter != null && AppCommon.TelemetryReporter != undefined) &&
                    (AppCommon.TelemetryReporter.Instance() != null && AppCommon.TelemetryReporter.Instance() != undefined));
            };
            this.OnDateRangeChangeHandler = function (context) {
                var formContext = context.getFormContext();
                // setting controls' visibility based on optionset values for start date 
                if (formContext.getControl(BookUtils.Constants.AttributeNames.SelectDate) && formContext.getControl(BookUtils.Constants.AttributeNames.SelectDate).getAttribute()) {
                    var selectDate = formContext.getControl(BookUtils.Constants.AttributeNames.SelectDate).getAttribute().getValue();
                    switch (selectDate) {
                        case BookUtils.Constants.DateOptionSet.AsSoonAsPossible:
                        case BookUtils.Constants.DateOptionSet.Today:
                        case BookUtils.Constants.DateOptionSet.Tomorrow:
                        case BookUtils.Constants.DateOptionSet.ThisWeek:
                        case BookUtils.Constants.DateOptionSet.NextWeek:
                        case BookUtils.Constants.DateOptionSet.NextMonth:
                            _this.UpdateControlVisibility(context, BookUtils.Constants.AttributeNames.SpecificDate, false);
                            _this.UpdateControlVisibility(context, BookUtils.Constants.AttributeNames.DateWindowStart, false);
                            _this.UpdateControlVisibility(context, BookUtils.Constants.AttributeNames.DateWindowEnd, false);
                            _this.UpdateControlVisibility(context, BookUtils.Constants.AttributeNames.DayList, false);
                            break;
                        case BookUtils.Constants.DateOptionSet.SpecificDate:
                            _this.UpdateControlVisibility(context, BookUtils.Constants.AttributeNames.SpecificDate, true);
                            _this.UpdateControlVisibility(context, BookUtils.Constants.AttributeNames.DateWindowStart, false);
                            _this.UpdateControlVisibility(context, BookUtils.Constants.AttributeNames.DateWindowEnd, false);
                            _this.UpdateControlVisibility(context, BookUtils.Constants.AttributeNames.DayList, false);
                            break;
                        case BookUtils.Constants.DateOptionSet.RangeOfDates:
                            _this.UpdateControlVisibility(context, BookUtils.Constants.AttributeNames.SpecificDate, false);
                            _this.UpdateControlVisibility(context, BookUtils.Constants.AttributeNames.DateWindowStart, true);
                            _this.UpdateControlVisibility(context, BookUtils.Constants.AttributeNames.DateWindowEnd, true);
                            _this.UpdateControlVisibility(context, BookUtils.Constants.AttributeNames.DayList, true);
                            break;
                    }
                }
            };
            this.OnTimeRangeChangeHandler = function (context) {
                var formContext = context.getFormContext();
                // setting controls' visibility based on optionset values for start time
                if (formContext.getControl(BookUtils.Constants.AttributeNames.SelectTime) && formContext.getControl(BookUtils.Constants.AttributeNames.SelectTime).getAttribute()) {
                    var selectTime = formContext.getControl(BookUtils.Constants.AttributeNames.SelectTime).getAttribute().getValue();
                    switch (selectTime) {
                        case BookUtils.Constants.TimeOptionSet.AnyTime:
                        case BookUtils.Constants.TimeOptionSet.Morning:
                        case BookUtils.Constants.TimeOptionSet.Afternoon:
                        case BookUtils.Constants.TimeOptionSet.Evening:
                            _this.UpdateControlVisibility(context, BookUtils.Constants.AttributeNames.SpecificTime, false);
                            _this.UpdateControlVisibility(context, BookUtils.Constants.AttributeNames.TimeWindowStart, false);
                            _this.UpdateControlVisibility(context, BookUtils.Constants.AttributeNames.TimeWindowEnd, false);
                            break;
                        case BookUtils.Constants.TimeOptionSet.SpecificTime:
                            _this.UpdateControlVisibility(context, BookUtils.Constants.AttributeNames.SpecificTime, true);
                            _this.UpdateControlVisibility(context, BookUtils.Constants.AttributeNames.TimeWindowStart, false);
                            _this.UpdateControlVisibility(context, BookUtils.Constants.AttributeNames.TimeWindowEnd, false);
                            break;
                        case BookUtils.Constants.TimeOptionSet.RangeOfTimes:
                            _this.UpdateControlVisibility(context, BookUtils.Constants.AttributeNames.SpecificTime, false);
                            _this.UpdateControlVisibility(context, BookUtils.Constants.AttributeNames.TimeWindowStart, true);
                            _this.UpdateControlVisibility(context, BookUtils.Constants.AttributeNames.TimeWindowEnd, true);
                            break;
                    }
                }
            };
            this.OnServiceChangeDialogHandler = function (context) {
                var formContext = context.getFormContext();
                var shouldDisableFindAvailableTimes = false;
                var shouldDisableFormAssistant = false;
                if (formContext.getControl(BookUtils.Constants.AttributeNames.ServiceIds) && formContext.getControl(BookUtils.Constants.AttributeNames.ServiceIds).getAttribute()) {
                    var serviceId = formContext.getControl(BookUtils.Constants.AttributeNames.ServiceIds).getAttribute().getValue();
                    if (serviceId == null) {
                        shouldDisableFindAvailableTimes = true;
                        shouldDisableFormAssistant = true;
                    }
                    else
                        _this.GetDefaultDurationFromService(context, serviceId);
                }
                if (formContext.getControl(BookUtils.Constants.AttributeNames.Duration1) && formContext.getControl(BookUtils.Constants.AttributeNames.Duration1).getAttribute()) {
                    var duration = formContext.getControl(BookUtils.Constants.AttributeNames.Duration1).getAttribute().getValue();
                    if (duration == null)
                        shouldDisableFindAvailableTimes = true;
                }
                _this.DisableButtons(context, shouldDisableFindAvailableTimes, shouldDisableFormAssistant);
            };
            this.OnDurationChangeDialogHandler = function (context) {
                var formContext = context.getFormContext();
                var shouldDisableFindAvailableTimes = false;
                if (formContext.getControl(BookUtils.Constants.AttributeNames.Duration1) && formContext.getControl(BookUtils.Constants.AttributeNames.Duration1).getAttribute()) {
                    var duration = formContext.getControl(BookUtils.Constants.AttributeNames.Duration1).getAttribute().getValue();
                    if (duration == null)
                        shouldDisableFindAvailableTimes = true;
                }
                if (formContext.getControl(BookUtils.Constants.AttributeNames.ServiceIds) && formContext.getControl(BookUtils.Constants.AttributeNames.ServiceIds).getAttribute()) {
                    var serviceId = formContext.getControl(BookUtils.Constants.AttributeNames.ServiceIds).getAttribute().getValue();
                    if (serviceId == null)
                        shouldDisableFindAvailableTimes = true;
                }
                _this.DisableButtons(context, shouldDisableFindAvailableTimes, null);
            };
            this.OnUseDefaultDurationChangeHandler = function (context) {
                var formContext = context.getFormContext();
                if (formContext.getControl(BookUtils.Constants.AttributeNames.UseDefaultDuration) && formContext.getControl(BookUtils.Constants.AttributeNames.UseDefaultDuration).getAttribute()) {
                    var useDefaultDuration = formContext.getControl(BookUtils.Constants.AttributeNames.UseDefaultDuration).getAttribute().getValue();
                    if (formContext.getControl(BookUtils.Constants.AttributeNames.Duration1)) {
                        var duration = formContext.getControl(BookUtils.Constants.AttributeNames.Duration1);
                        if (useDefaultDuration) {
                            duration.setDisabled(true);
                            duration.getAttribute().setValue(_this.DEFAULT_DURATION);
                        }
                        else
                            duration.setDisabled(false);
                    }
                }
            };
            this.SetDefaultStatusForState = function (context, stateCode) {
                var formContext = context.getFormContext();
                var defaultStatusCode = -1;
                if (formContext.getAttribute(BookUtils.Constants.AttributeNames.StatusCode)) {
                    Xrm.Utility.getEntityMetadata(BookUtils.Constants.EntityNames.ServiceAppointment, ["statecode"]).then(function (entityMetadata) {
                        var stateAttributeMetadata = entityMetadata.Attributes.get("statecode");
                        if (!ClientUtility.DataUtil.isNullOrUndefined(stateAttributeMetadata)) {
                            defaultStatusCode = stateAttributeMetadata.getDefaultStatus(stateCode);
                            if (!ClientUtility.DataUtil.isNullOrUndefined(defaultStatusCode)) {
                                formContext.getAttribute(BookUtils.Constants.AttributeNames.StatusCode).setValue(defaultStatusCode);
                            }
                        }
                    });
                }
            };
            this.OnStateChangeHandler = function (context) {
                var formContext = context.getFormContext();
                if (formContext.getAttribute(BookUtils.Constants.AttributeNames.StateCode)) {
                    var stateCode = formContext.getAttribute(BookUtils.Constants.AttributeNames.StateCode).getValue();
                    if (!ClientUtility.DataUtil.isNullOrUndefined(stateCode))
                        _this.SetDefaultStatusForState(context, stateCode);
                }
            };
            this.DisableButtons = function (context, shouldDisableFindAvailableTimes, shouldDisableFormAssistant) {
                var formContext = context.getFormContext();
                var findAvailableTimesButton = formContext.getControl(BookUtils.Constants.AttributeNames.FindAvailableTimesId);
                var findAvailableTimesFormAssistantButton = formContext.getControl(BookUtils.Constants.AttributeNames.FindAvailableTimesFormAssistantId);
                if (findAvailableTimesButton)
                    findAvailableTimesButton.setDisabled(shouldDisableFindAvailableTimes);
                if (findAvailableTimesFormAssistantButton)
                    findAvailableTimesFormAssistantButton.setDisabled(shouldDisableFindAvailableTimes);
                var formAssistantButton = formContext.getControl(BookUtils.Constants.AttributeNames.FormAssistantButtonId);
                if (formAssistantButton && shouldDisableFormAssistant != null)
                    formAssistantButton.setDisabled(shouldDisableFormAssistant);
            };
            this.InitializeWeeklySchedulePicklist = function (context) {
                var formContext = context.getFormContext();
                var dayListControl = formContext.getControl(BookUtils.Constants.AttributeNames.DayList);
                var dayList;
                dayList = [CrmService.ResourceStringProvider.getResourceString("Days_Of_Week_Sunday"),
                    CrmService.ResourceStringProvider.getResourceString("Days_Of_Week_Monday"),
                    CrmService.ResourceStringProvider.getResourceString("Days_Of_Week_Tuesday"),
                    CrmService.ResourceStringProvider.getResourceString("Days_Of_Week_Wednesday"),
                    CrmService.ResourceStringProvider.getResourceString("Days_Of_Week_Thursday"),
                    CrmService.ResourceStringProvider.getResourceString("Days_Of_Week_Friday"),
                    CrmService.ResourceStringProvider.getResourceString("Days_Of_Week_Saturday")];
                var daysOfWeek = {};
                for (var count = 0; count < 7; count++)
                    daysOfWeek[count] = dayList[count];
                if (dayListControl) {
                    for (var key in daysOfWeek) {
                        dayListControl.addOption({
                            text: daysOfWeek[key],
                            value: parseInt(key)
                        });
                    }
                    dayListControl.getAttribute().setValue([BookUtils.Constants.ServiceActivityDaysOfWeek.Sunday, BookUtils.Constants.ServiceActivityDaysOfWeek.Monday, BookUtils.Constants.ServiceActivityDaysOfWeek.Tuesday, BookUtils.Constants.ServiceActivityDaysOfWeek.Wednesday, BookUtils.Constants.ServiceActivityDaysOfWeek.Thursday, BookUtils.Constants.ServiceActivityDaysOfWeek.Friday, BookUtils.Constants.ServiceActivityDaysOfWeek.Saturday]);
                }
            };
        }
        ServiceAppointmentUCIMainSystemLibraryWebResource.getFCSValue = function (namespaceName, fcskey) {
            if (window.Xrm && window.Xrm.Page.context) {
                return window.Xrm.Utility.getGlobalContext().getFeatureControlSetting(namespaceName, fcskey);
            }
            return false;
        };
        ServiceAppointmentUCIMainSystemLibraryWebResource.prototype.UpdateControlVisibility = function (context, controlName, isVisible) {
            var control = context.getFormContext().getControl(controlName);
            if (control)
                control.setVisible(isVisible);
        };
        ServiceAppointmentUCIMainSystemLibraryWebResource.prototype.GetDefaultDurationFromService = function (context, serviceId) {
            var formContext = context.getFormContext();
            var that = this;
            var id;
            if (serviceId) {
                id = Array.isArray(serviceId) ? serviceId[0].id : serviceId.id;
                var serverUrl = formContext.context.getClientUrl();
                var oDataEndpointUrl = serverUrl +
                    "/api/data/v9.0/services?$select=duration,_resourcespecid_value&$filter=serviceid eq " + id;
                var request = new XMLHttpRequest();
                request.open("GET", oDataEndpointUrl);
                request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                request.setRequestHeader("Accept", "application/json, text/javascript, */*");
                request.send(null);
                request.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        request.onreadystatechange = null;
                        switch (this.status) {
                            case 200: // Success with content returned in response body.
                            case 204:
                                var retrieved = JSON.parse(request.responseText);
                                if (retrieved.value.length > 0)
                                    that.DEFAULT_DURATION = retrieved.value[0].duration;
                                if (formContext.getControl(BookUtils.Constants.AttributeNames.Duration1) && formContext.getControl(BookUtils.Constants.AttributeNames.UseDefaultDuration) && formContext.getControl(BookUtils.Constants.AttributeNames.UseDefaultDuration).getAttribute().getValue())
                                    formContext.getControl(BookUtils.Constants.AttributeNames.Duration1).getAttribute().setValue(that.DEFAULT_DURATION);
                                if (formContext.data.attributes.get(BookUtils.Constants.AttributeNames.ParamResourceSpecId))
                                    formContext.data.attributes.get(BookUtils.Constants.AttributeNames.ParamResourceSpecId).setValue(retrieved.value[0]._resourcespecid_value);
                                break;
                            default:
                                // All other statuses are unexpected so are treated like errors.
                                var error;
                                try {
                                    error = JSON.parse(request.response).error;
                                }
                                catch (e) {
                                    error = new Error("Unexpected Error");
                                }
                                break;
                        }
                    }
                };
            }
            else {
                this.DEFAULT_DURATION = 60;
                if (formContext.getControl("Duration_1"))
                    formContext.getControl("Duration_1").getAttribute().setValue(this.DEFAULT_DURATION);
            }
        };
        ServiceAppointmentUCIMainSystemLibraryWebResource.prototype.GetUserDefaultWorkHours = function (resourceId) {
            return Xrm.WebApi.retrieveRecord("usersettings", resourceId, "?$select=workdaystarttime,workdaystoptime,timezonecode");
        };
        ServiceAppointmentUCIMainSystemLibraryWebResource.prototype.SetDefaultTimeRange = function (context) {
            var formContext = context.getFormContext();
            var userId = context.getContext().userSettings.userId.slice(1, -1);
            var that = this;
            this.GetUserDefaultWorkHours(userId).then(function (data) {
                if (formContext.getControl(BookUtils.Constants.AttributeNames.SpecificTime) && formContext.getControl(BookUtils.Constants.AttributeNames.SpecificTime).getAttribute()) {
                    if (data["workdaystarttime"]) {
                        var offset = that.ConvertTimeStringToOffset(data["workdaystarttime"]);
                        formContext.getControl(BookUtils.Constants.AttributeNames.SpecificTime).getAttribute().setValue(offset);
                    }
                    else {
                        formContext.getControl(BookUtils.Constants.AttributeNames.SpecificTime).getAttribute().setValue("480");
                    }
                }
                if (formContext.getControl(BookUtils.Constants.AttributeNames.TimeWindowStart) && formContext.getControl(BookUtils.Constants.AttributeNames.TimeWindowStart).getAttribute()) {
                    if (data["workdaystarttime"]) {
                        var offset = that.ConvertTimeStringToOffset(data["workdaystarttime"]);
                        formContext.getControl(BookUtils.Constants.AttributeNames.TimeWindowStart).getAttribute().setValue(offset);
                    }
                    else {
                        formContext.getControl(BookUtils.Constants.AttributeNames.TimeWindowStart).getAttribute().setValue("480");
                    }
                }
                if (formContext.getControl(BookUtils.Constants.AttributeNames.TimeWindowEnd) && formContext.getControl(BookUtils.Constants.AttributeNames.TimeWindowEnd).getAttribute()) {
                    if (data["workdaystoptime"]) {
                        var offset = that.ConvertTimeStringToOffset(data["workdaystoptime"]);
                        formContext.getControl(BookUtils.Constants.AttributeNames.TimeWindowEnd).getAttribute().setValue(offset);
                    }
                    else {
                        formContext.getControl(BookUtils.Constants.AttributeNames.TimeWindowEnd).getAttribute().setValue("1020");
                    }
                }
                that.USER_TIMEZONE_CODE = data["timezonecode"];
                that.GetTimeInLocalTimeZone(that.USER_TIMEZONE_CODE, new Date().toISOString()).then(function (response) {
                    response.json().then(function (localtimejson) {
                        that.TODAY_DATE = new Date(localtimejson["LocalTime"]);
                    });
                });
            });
        };
        ServiceAppointmentUCIMainSystemLibraryWebResource.prototype.ConvertTimeStringToOffset = function (timeString) {
            var hour = 0;
            var minute = 0;
            if (timeString) {
                hour = parseInt(timeString.substring(0, timeString.indexOf(":")));
                minute = parseInt(timeString.substring(timeString.indexOf(":") + 1, timeString.length));
            }
            var offset = hour * 60 + minute;
            return offset.toString();
        };
        ServiceAppointmentUCIMainSystemLibraryWebResource.prototype.GetTimeInLocalTimeZone = function (timeZoneCode, utcTime) {
            var request = new ODataContract.LocalTimeFromUtcTimeRequest(timeZoneCode, utcTime);
            return Xrm.WebApi.online.execute(request);
        };
        ServiceAppointmentUCIMainSystemLibraryWebResource.ModifyOnScheduledStart = function () {
            var duration, scheduledstart;
            if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledStart))
                scheduledstart = new Date(Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledStart).getValue());
            if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes)) {
                duration = Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes).getValue();
            }
            else
                duration = ServiceAppointmentUCIMainSystemLibraryWebResource.SCHEDULED_DURATION_IN_MINUTES;
            if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledEnd))
                Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledEnd).setValue(new Date(scheduledstart.getTime() + duration * 60000));
        };
        ;
        ServiceAppointmentUCIMainSystemLibraryWebResource.ModifyOnDuration = function () {
            ServiceAppointmentUCIMainSystemLibraryWebResource.ModifyOnScheduledStart();
        };
        ;
        ServiceAppointmentUCIMainSystemLibraryWebResource.ModifyOnScheduledEnd = function () {
            var scheduledend, scheduledstart;
            if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledEnd))
                scheduledend = new Date(Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledEnd).getValue());
            if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledStart))
                scheduledstart = new Date(Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledStart).getValue());
            if ((new Date(scheduledend.getTime())) < new Date(scheduledstart.getTime())) {
                Xrm.Navigation.openAlertDialog({ text: String.format(CrmService.ResourceStringProvider.getResourceString("EndTimeLaterThanStartTime")) });
                return;
            }
            if (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes)) {
                Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes).setValue((scheduledend.getTime() - scheduledstart.getTime()) / 60000);
            }
            else
                ServiceAppointmentUCIMainSystemLibraryWebResource.SCHEDULED_DURATION_IN_MINUTES = (scheduledend.getTime() - scheduledstart.getTime()) / 60000;
        };
        ;
        ServiceAppointmentUCIMainSystemLibraryWebResource.prototype.setScheduleDialogParameters = function () {
            var dialogParams = {};
            dialogParams[BookUtils.Constants.AttributeNames.ParamServiceAppointmentId] = Xrm.Page.data.entity.getId();
            dialogParams[BookUtils.Constants.AttributeNames.ParamServiceId] = (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ServiceId) && Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ServiceId).getValue())
                ? Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ServiceId).getValue()[0] : null;
            dialogParams[BookUtils.Constants.AttributeNames.ParamSiteId] = (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.SiteId) && Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.SiteId).getValue())
                ? Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.SiteId).getValue()[0] : null;
            dialogParams[BookUtils.Constants.AttributeNames.ParamResourceId] = (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Resources) && Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Resources).getValue())
                ? Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Resources).getValue() : null;
            dialogParams[BookUtils.Constants.AttributeNames.ParamDuration] = (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes) && Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes).getValue())
                ? Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.ScheduledDurationMinutes).getValue() : ServiceAppointmentUCIMainSystemLibraryWebResource.SCHEDULED_DURATION_IN_MINUTES;
            dialogParams[BookUtils.Constants.AttributeNames.ParamTargetentities] = BookUtils.Constants.AttributeNames.ParamSystemUserEquipments;
            dialogParams[BookUtils.Constants.AttributeNames.ParamSelectedresources] = (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Resources) && Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Resources).getValue())
                ? Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Resources).getValue() : null;
            dialogParams[BookUtils.Constants.AttributeNames.ParamTargetEntitiesCustomers] = BookUtils.Constants.AttributeNames.ParamAccountContact;
            dialogParams[BookUtils.Constants.AttributeNames.ParamSelectedcustomers] = (Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Customers) && Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Customers).getValue())
                ? Xrm.Page.getAttribute(BookUtils.Constants.AttributeNames.Customers).getValue() : null;
            return dialogParams;
        };
        return ServiceAppointmentUCIMainSystemLibraryWebResource;
    }());
    ServiceAppointmentUCIMainSystemLibraryWebResource.SCHEDULED_DURATION_IN_MINUTES = 30;
    ServiceAppointmentUCIMainSystemLibraryWebResource.SECONDS_IN_MINUTE = 60;
    ServiceAppointmentUCIMainSystemLibraryWebResource.MILLISECONDS_IN_SECOND = 1000;
    ServiceAppointmentUCIMainSystemLibraryWebResource.DEFAULT_DURATION_IN_MINUTES = 30;
    ServiceAppointmentUCIMainSystemLibraryWebResource.sanitizeInput = function (input) {
        if (!input || input.length === 0) {
            return input;
        }
        // Define a map of metacharacters and their corresponding replacements
        var metacharacters = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            "'": '&apos;',
            '"': "&quot;"
        };
        // Replace metacharacters with their safe counterparts
        var sanitizedInput = input.replace(/[<>&"'']/g, function (match) { return metacharacters[match]; });
        return sanitizedInput;
    };
    CrmService.ServiceAppointmentUCIMainSystemLibraryWebResource = ServiceAppointmentUCIMainSystemLibraryWebResource;
})(CrmService || (CrmService = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="Legacy/ServiceAppointmentLegacyLibrary.ts" />
/// <reference path="UCI/ServiceAppointmentUCILibrary.ts" />
/// <reference path="../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var CrmService;
(function (CrmService) {
    'use strict';
    var ServiceAppointment = (function () {
        function ServiceAppointment() {
        }
        return ServiceAppointment;
    }());
    ServiceAppointment.ctor = (function () {
        if (Xrm.Internal.isUci()) {
            ServiceAppointment.Instance = new CrmService.ServiceAppointmentUCILibrary();
        }
        else {
            ServiceAppointment.Instance = new CrmService.ServiceAppointmentLegacyLibrary();
        }
    })();
    CrmService.ServiceAppointment = ServiceAppointment;
})(CrmService || (CrmService = {}));
//# sourceMappingURL=ServiceAppointment_main_system_library.js.map