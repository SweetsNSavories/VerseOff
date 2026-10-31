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
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var AppCommon;
(function (AppCommon) {
    var Commands;
    (function (Commands) {
        /**
         * Parameters defined in the AssignQueue dialog.
         */
        var AssignQueueParams = (function () {
            function AssignQueueParams() {
            }
            return AssignQueueParams;
        }());
        AssignQueueParams.EntityName = "entity_name";
        AssignQueueParams.LastButtonClicked = "last_button_clicked";
        AssignQueueParams.Records = "entity_records";
        AssignQueueParams.SelectedRecordsCount = "selected_records_count";
        AssignQueueParams.EntityId = "entity_id";
        AssignQueueParams.OwnerId = "owner_id";
        AssignQueueParams.OwnerType = "owner_type";
        AssignQueueParams.ShowAssignToMeOption = "show_assign_to_me_option";
        AssignQueueParams.AssignRequest = "assign_request";
        //legacy params: currently the assign command calls legacy code for web client which expects
        //these param names. Cleanup pending bug 561110 (moving assign command to solution).
        AssignQueueParams.legacyEntityName = "entityName";
        AssignQueueParams.legacyLastButtonClicked = "lastButtonClicked";
        AssignQueueParams.legacyRecords = "records";
        AssignQueueParams.legacySelectedRecordsCount = "selectedRecordsCount";
        AssignQueueParams.legacyEntityId = "entityId";
        AssignQueueParams.legacyOwnerId = "ownerId";
        AssignQueueParams.legacyOwnerType = "ownerType";
        /**
         * User-exposed controls in the AssignQueue dialog.
         */
        var AssignQueueControls = (function () {
            function AssignQueueControls() {
            }
            return AssignQueueControls;
        }());
        AssignQueueControls.DialogLabel = "label_DialogDescription";
        AssignQueueControls.SystemUserViewId = "systemuserview_id";
        AssignQueueControls.AssignTomeOption = "rdoMe_id";
        AssignQueueControls.CancelButton = "cancel_id";
        AssignQueueControls.OkButton = "ok_id";
        /**
         * Handles events from the AssignQueue dialog.
         */
        var AssignQueueLibrary = (function () {
            function AssignQueueLibrary() {
                var _this = this;
                /**
                 *  On load function for the dialog.
                 */
                this.assignQueueOnLoad = function (context) {
                    var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                    var selectedRecordsCountControl = null;
                    if (Xrm.Internal.isUci()) {
                        selectedRecordsCountControl = formContext.data.attributes.get(AssignQueueParams.SelectedRecordsCount);
                    }
                    else {
                        selectedRecordsCountControl = formContext.data.attributes.get(AssignQueueParams.legacySelectedRecordsCount);
                    }
                    if (AppCommon.ResourceStringProvider && selectedRecordsCountControl && selectedRecordsCountControl.getValue()) {
                        var selectedRecordsCount = +selectedRecordsCountControl.getValue();
                        var dialogDescription = "";
                        if (selectedRecordsCount === 1) {
                            dialogDescription = AppCommon.ResourceStringProvider.getResourceString("Dialog_AssignQueue_Description_Single");
                        }
                        else if (selectedRecordsCount > 1) {
                            dialogDescription = AppCommon.ResourceStringProvider.getResourceString("Dialog_AssignQueue_Description_Plural");
                        }
                        dialogDescription = ClientUtility.StringUtil.format(dialogDescription, selectedRecordsCount);
                        var labelControl = formContext.getControl(AssignQueueControls.DialogLabel);
                        labelControl && labelControl.setLabel(dialogDescription);
                    }
                    var showAssignToMeControl = formContext.data.attributes.get(AssignQueueParams.ShowAssignToMeOption);
                    var showAssignToMe = showAssignToMeControl && showAssignToMeControl.getValue() === true;
                    if (showAssignToMe) {
                        // When "assign to" is displayed, "user or team" is disabled since the default option is "me" for the assign to control.
                        var assignToLookupControl = formContext.getControl(AssignQueueControls.SystemUserViewId);
                        assignToLookupControl.setDisabled(true);
                    }
                    else {
                        var assignToMeControl = formContext.getControl(AssignQueueControls.AssignTomeOption);
                        assignToMeControl.setVisible(false);
                    }
                };
                this.assignQueueDialogAssignToChange = function (context) {
                    var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                    var assignToControl = formContext.data.attributes.get(AssignQueueControls.AssignTomeOption);
                    var assignToUserOrTeam = assignToControl.getValue();
                    var assignToLookupControl = formContext.getControl(AssignQueueControls.SystemUserViewId);
                    var assignButton = formContext.getControl(AssignQueueControls.OkButton);
                    if (assignToLookupControl) {
                        if (assignToUserOrTeam) {
                            // If "Assign to" is set to "User or team", enable "User or team" lookup 
                            assignToLookupControl.setDisabled(false);
                        }
                        else {
                            // If "Assign to" is set to "Me", disable "User or team" lookup and clear value if it was already populated
                            assignToLookupControl.setDisabled(true);
                            assignToLookupControl.getAttribute().setValue(null);
                        }
                        if (assignButton) {
                            // Hide the assign if the option is "team or user" and there is not value.
                            var hideAssign = assignToUserOrTeam && !assignToLookupControl.getAttribute().getValue();
                            assignButton.setDisabled(hideAssign);
                        }
                    }
                    else if (assignButton) {
                        assignButton.setDisabled(false);
                    }
                };
                this.assignQueueClick = function (context) {
                    var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                    var ownerId = "";
                    var ownerType = "";
                    var assignToUser = true;
                    var assignTo = formContext.data.attributes.get(AssignQueueControls.AssignTomeOption);
                    var selectedItems = assignTo.getValue();
                    var assignToLookupControl = formContext.data.attributes.get(AssignQueueControls.SystemUserViewId);
                    var assignToMeControl = formContext.getControl(AssignQueueControls.AssignTomeOption);
                    // Assign to me isn't available, or assign to user or team was selected
                    if (selectedItems || !assignToMeControl.getVisible()) {
                        var selectedUser = assignToLookupControl.getValue();
                        if (!selectedUser || !selectedUser.length) {
                            var errorText = AppCommon.ResourceStringProvider.getResourceString("AssignToQueue_noSelectedUser");
                            ClientUtility.DialogUtil.openAlertDialog(errorText);
                            return;
                        }
                        else {
                            var userEntityRef = selectedUser[0];
                            ownerId = userEntityRef.id;
                            var typeName = userEntityRef.entityName ? userEntityRef.entityName : userEntityRef.entityType;
                            if (typeName === AppCommon.EntityNames.SystemUser) {
                                ownerType = AppCommon.EntityNames.SystemUser;
                            }
                            else {
                                ownerType = AppCommon.EntityNames.Team;
                            }
                        }
                    }
                    else {
                        ownerId = formContext.context.getUserId();
                        ownerType = AppCommon.EntityNames.SystemUser;
                    }
                    ClientUtility.DialogUtil.setAttributeValue(AssignQueueParams.OwnerId, ownerId);
                    ClientUtility.DialogUtil.setAttributeValue(AssignQueueParams.OwnerType, ownerType);
                    ClientUtility.DialogUtil.setAttributeValue(AssignQueueParams.LastButtonClicked, AssignQueueControls.OkButton);
                    //TODO: cleanup pending bug 561110
                    ClientUtility.DialogUtil.setAttributeValue(AssignQueueParams.legacyOwnerId, ownerId);
                    ClientUtility.DialogUtil.setAttributeValue(AssignQueueParams.legacyOwnerType, ownerType);
                    ClientUtility.DialogUtil.setAttributeValue(AssignQueueParams.legacyLastButtonClicked, AssignQueueControls.OkButton);
                    if (ownerId && ownerType) {
                        var entityId = null;
                        // In webclient, formContext.data.attributes.get() returns non-null object for both EntityId and legacyEntityId attributes
                        // though only AssignQueueParams.legacyEntityId attribute contains the value. So we need to do getValue() on both the attributes.
                        // Else we need to check based on Webclient vs UCI client.
                        if (formContext.data.attributes.get(AssignQueueParams.EntityId)) {
                            entityId = formContext.data.attributes.get(AssignQueueParams.EntityId).getValue();
                        }
                        if (!entityId && formContext.data.attributes.get(AssignQueueParams.legacyEntityId)) {
                            entityId = formContext.data.attributes.get(AssignQueueParams.legacyEntityId).getValue();
                        }
                        var entityName = null;
                        if (formContext.data.attributes.get(AssignQueueParams.EntityName)) {
                            entityName = formContext.data.attributes.get(AssignQueueParams.EntityName).getValue();
                        }
                        if (!entityName && formContext.data.attributes.get(AssignQueueParams.legacyEntityName)) {
                            entityName = formContext.data.attributes.get(AssignQueueParams.legacyEntityName).getValue();
                        }
                        var records = void 0;
                        if (entityId && entityName) {
                            var record = {
                                TypeName: entityName,
                                Id: entityId
                            };
                            records = [record];
                        }
                        else {
                            var recordsEntityRefs = formContext.data.attributes.get(AssignQueueParams.Records).getValue();
                            records = ClientUtility.DialogUtil.deserializeSdkEntityReferences(recordsEntityRefs);
                        }
                        _this.sendAssignQueue(ownerId, ownerType, records, function () { return formContext.ui.close(); }, function () { return formContext.ui.close(); });
                    }
                    else {
                        formContext.ui.close();
                    }
                };
                this.sendAssignQueue = function (ownerId, ownerType, records, onSuccess, onError) {
                    if (Xrm.Utility.getGlobalContext().client.getClientState() === Xrm.Constants.ClientStates.offline) {
                        ClientUtility.DialogUtil.showMoCAOfflineError();
                        return onError({});
                    }
                    ClientUtility.DialogUtil.showProgressMessage();
                    var updatedGridControl = null;
                    var assignBatch = records.map(function (record) {
                        var target = {
                            entityType: record.TypeName,
                            id: record.Id
                        };
                        var assignee = {
                            entityType: ownerType,
                            id: ownerId
                        };
                        var assignRequest = new ODataContract.AssignRequest(target, assignee);
                        return assignRequest;
                    });
                    Xrm.WebApi.online.executeMultiple(assignBatch).then(function (success) {
                        ClientUtility.DialogUtil.hideProgressMessage();
                        ClientUtility.DialogUtil.setAttributeValue(AssignQueueParams.AssignRequest, true);
                        onSuccess();
                    }, function (message) {
                        ClientUtility.DialogUtil.hideProgressMessage();
                        ClientUtility.DialogUtil.setAttributeValue(AssignQueueParams.AssignRequest, true);
                        var errorDialogPromise = ClientUtility.DialogUtil.actionFailedCallbackForMoca(message);
                        errorDialogPromise.then(onError);
                    });
                };
                this.closeDialog = function (context) {
                    var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                    ClientUtility.DialogUtil.setAttributeValue(AssignQueueParams.LastButtonClicked, AssignQueueControls.CancelButton);
                    //TODO: cleanup pending bug 561110
                    ClientUtility.DialogUtil.setAttributeValue(AssignQueueParams.legacyLastButtonClicked, AssignQueueControls.CancelButton);
                    formContext.ui.close();
                };
                this.assignDialogSystemUserChange = function (context) {
                    var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                    var assignToLookupAttribute = formContext.data.attributes.get(AssignQueueControls.SystemUserViewId);
                    if (assignToLookupAttribute) {
                        var selectedItems = assignToLookupAttribute.getValue();
                        var assignButton = formContext.getControl(AssignQueueControls.OkButton);
                        if (!assignButton) {
                            return;
                        }
                        if (!selectedItems || !selectedItems.length) {
                            assignButton.setDisabled(true);
                        }
                        else {
                            assignButton.setDisabled(false);
                        }
                    }
                };
            }
            return AssignQueueLibrary;
        }());
        Commands.AssignQueueLibrary = AssignQueueLibrary;
    })(Commands = AppCommon.Commands || (AppCommon.Commands = {}));
})(AppCommon || (AppCommon = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var AppCommon;
(function (AppCommon) {
    var DialogConstants = (function () {
        function DialogConstants() {
        }
        return DialogConstants;
    }());
    DialogConstants.AssignTomeOption = "rdoMe_id";
    DialogConstants.BusinessQueuesLookupId = "businessqueues_id";
    DialogConstants.Msdyn_AddToQueueDialogViewSelection = "msdyn_addtoqueuedialogviewselection";
    DialogConstants.Msdyn_RouteToQueueItemDialogViewSelection = "msdyn_routequeueitemdialogviewselection";
    DialogConstants.DialogCancelId = "cancel_id";
    DialogConstants.DialogOkId = "ok_id";
    DialogConstants.OwnerId = "owner_id";
    DialogConstants.OwnerType = "owner_type";
    DialogConstants.QueueItemAssignedToUserText = "lbl_assignedtouser";
    DialogConstants.QueueItemAssignedToQueueText = "lbl_addtoqueue";
    DialogConstants.QueueItemRouteHeaderText = "lbl_headerdescription";
    DialogConstants.QueueItemRemovalDenialText = "lbl_removaldenial";
    DialogConstants.QueueItemQueueLookupId = "crmQueueLookupControl_id";
    DialogConstants.QueueItemRemoveId = "chkBoxRemoveItem_id";
    DialogConstants.QueueItemRouteToId = "routeto_id";
    DialogConstants.QueueItemUserLookupId = "crmUserLookupControl_id";
    DialogConstants.SelectedRecordsCount = "selected_records_count";
    DialogConstants.ShowAssignToMeOption = "show_assign_to_me_option";
    DialogConstants.SystemUserViewId = "systemuserview_id";
    DialogConstants.LastButtonClicked = "last_button_clicked";
    DialogConstants.QueueLookup = 'queueid';
    DialogConstants.WorkedByLookup = 'workerid';
    DialogConstants.LastButtonClickedParam = "param_lastButtonClicked";
    DialogConstants.RecordsParam = "param_records";
    DialogConstants.CalendarName = "Schedule_Name";
    DialogConstants.CalendarDescription = "Schedule_Description";
    DialogConstants.CalendarHeader = "Schedule_header";
    DialogConstants.CalendarGrid = "Calendar_Grid";
    DialogConstants.CalendarType = "Calendar_Type";
    DialogConstants.CalendarRecord = "Calendar_Record";
    DialogConstants.CalendarFormName = "name";
    DialogConstants.CalendarFormDescription = "description";
    DialogConstants.Customer_Service_Schedule_View_Id = "F4D446E0-3749-4BA4-9C85-EAB861EAFDFC";
    DialogConstants.Holiday_Schedule_View_Id = "06453A1D-9288-4F0E-9351-819D619ECB5F";
    DialogConstants.CustomerServiceScheduleType = "1";
    DialogConstants.HolidayScheduleType = "2";
    DialogConstants.MDD_CSS_PARAM_WeeklyScheduleControl_Input = "weeklyScheduleControl_Input";
    DialogConstants.MDD_PARAM_Calendar_Id_Input = "calendar_Id";
    DialogConstants.MDD_CSS_PARAM_Calendar_ShareControl_Input = "calendarShareControl_Input";
    DialogConstants.MDD_CSS_PARAM_WeeklyScheduleControl_Output = "weeklyScheduleControl_Output";
    DialogConstants.MDD_CSS_PARAM_CustomerServiceSchedule_Status = "customerServiceSchedule_Status";
    DialogConstants.MDD_CSS_PARAM_SetWorkHourControl_Input = "setWorkHourControl_Input";
    DialogConstants.MDD_CSS_PARAM_SetWorkHourControl_Output = "setWorkHourControl_Output";
    DialogConstants.MDD_CSS_PARAM_DeleteWeeklyScheduleStatus_Output = "deleteWeeklyScheduleStatus_Output";
    DialogConstants.MDD_CSS_Dialog_CalendarRule_Warning = "CalendarRule_Warning";
    DialogConstants.MDD_CSS_SaveButton_Id = "savecalendarrule_id";
    DialogConstants.MDD_CSS_SaveAndCloseButton_Id = "saveandclosecalendarrule_id";
    DialogConstants.MDD_SetWorkHours_OKButton_Id = "oktimesheetdetails_id";
    DialogConstants.MDD_CSS_PARAM_HolidayListControl_Input = "holidayListControl_Input";
    DialogConstants.MDD_HS_DoneButtonId = "save_id";
    DialogConstants.MDD_HolidayItem_Param_State = "holidayItem_state";
    DialogConstants.MDD_HolidayItem_Param_Calendar_Id = "calendar_id";
    DialogConstants.MDD_HolidayItem_Param_CalendarRule_Id = "calendarRule_id";
    DialogConstants.ErrorMsg_Dialog_Load_Failed = "Error_DialogLoadFailed";
    DialogConstants.ErrorMsg_Dialog_Save_Failed = "Error_DialogSaveFailed";
    DialogConstants.BusinessClosureSitemapDialogId = "4ebdaadb-ded5-482d-a705-853d7239995d";
    DialogConstants.MDD_BusinessClosureItem_Param_State = "holidayItem_state";
    DialogConstants.MDD_BusinessClosureItem_Param_Calendar_Id = "calendar_id";
    DialogConstants.MDD_BusinessClosureItem_Param_CalendarRule_Id = "calendarRule_id";
    DialogConstants.MDD_Subheader02 = "Dialog_BusinessClosureItem_MDD_Subheader02";
    DialogConstants.PrvReadCalendar = 'dd33f286-fbc2-455b-bfb2-a1d8c3e420fc';
    DialogConstants.PrvWriteCalendar = '6c21bd41-8a34-4a01-ad17-4f706ddf6f70';
    DialogConstants.PrvDeleteCalendar = '09de2ca3-16f1-415f-a04e-45cb7e238a19';
    DialogConstants.BusinessClosureHelpUrl = "https://go.microsoft.com/fwlink/?linkid=2010874";
    DialogConstants.SLA_WebClientDeprecationNotification = "SLA_WebClientDeprecationNotification";
    DialogConstants.SLA_FCBEnableProactiveChecks = "SLAEnableProactiveChecks";
    DialogConstants.SLA_EnvironmentVariableSchemaName = "msdyn_SLAWebClientDeprecationAcknowledge";
    DialogConstants.SLA_EnvironmentVariableDisplayName = "SLA Web Client Deprecation Acknowledge";
    DialogConstants.SysAdminRoleTemplateId = "627090FF-40A3-4053-8790-584EDC5BE201";
    // QueueItem constants for Dialog
    DialogConstants.EntitySystemUser = "systemuser";
    DialogConstants.EntityQueueItem = "queueitem";
    DialogConstants.PrivateQueueViewName = "QueueItem_Private_Queue_LookUp";
    DialogConstants.QueueItem_FetchXml = "<fetch version='1.0' mapping='logical'>" +
        "<entity name='systemuser'>'+'<order attribute='fullname' descending='false' />" +
        "<attribute name='systemuserid' /><attribute name='fullname' />" +
        "<link-entity name='queuemembership' from='systemuserid' to='systemuserid' alias='QueueMembers'>" +
        "<filter type='and'>" +
        "<condition attribute='queueid' operator='eq' value='{0}' />" +
        "</filter>" +
        "</link-entity>" +
        "<filter type='and'>" +
        "<condition attribute='isdisabled' operator = 'eq' value = '0' />" +
        "</filter>" +
        "</entity>" +
        "</fetch>";
    DialogConstants.QueueItem_LayoutXml = "<grid name='systemuser' object='8' jump='name' select='1' icon='1' preview='0'>" +
        "<row name='systemuser' id='systemuserid'>" +
        "<cell name='fullname' width='300' />" +
        "<cell name='systemuserid' width='0' isHidden='1'/>" +
        "</row>" +
        "</grid>";
    DialogConstants.QueueItemsRoutedViaUR_FetchXml = "<fetch top='1' version='1.0' mapping='logical'>" +
        "<entity name='queueitem' >" +
        "<attribute name='queueitemid' />" +
        "<filter>" +
        "<condition attribute='msdyn_liveworkstreamid' operator='not-null' />" +
        "<condition attribute='queueitemid' operator='in' uitype='queueitem' >" +
        "{0}" +
        "</condition>" +
        "</filter>" +
        "</entity>" +
        "</fetch>";
    DialogConstants.EntityQueueFilter = "<filter type=\"or\"><condition attribute = \"msdyn_queuetype\" operator = \"eq\" value = \"192350001\" /><condition attribute=\"msdyn_queuetype\" operator = \"null\" /></filter>";
    DialogConstants.QueueLookupAttribute = "_queueid_value";
    DialogConstants.QueueLookupAttributeName = "_queueid_value@OData.Community.Display.V1.FormattedValue";
    // fetchXML for retrieve any active legacy SLAs
    DialogConstants.FETCHXML_ANY_ACTIVE_LEGACY_SLA = "<fetch version=\"1.0\" output-format=\"xml-platform\" top=\"1\" mapping=\"logical\" distinct=\"false\">\n                <entity name=\"sla\">\n                    <attribute name=\"name\" />\n                    <attribute name=\"slaid\" />\n                    <filter type=\"and\">\n                        <condition attribute=\"statecode\" operator=\"eq\" value=\"1\"/>\n                    </filter>\n                    <filter type=\"or\">\n                        <condition attribute=\"slaversion\" operator=\"null\"/>\n                        <condition attribute=\"slaversion\" operator=\"eq\" value=\"100000000\"/>\n                    </filter>                    \n                </entity>\n            </fetch>";
    // fetchXML for retrieve current user's role templates
    DialogConstants.FETCHXML_USER_ROLE_TEMPLATE_ID = "<fetch version='1.0' distinct='false' no-lock='false' mapping='logical'>\n\t\t\t\t<entity name='role'>\n\t\t\t\t\t<attribute name='roletemplateid' />\n\t\t\t\t\t<link-entity name='systemuserroles' to='roleid' from='roleid' link-type='inner'>\n\t\t\t\t\t\t<filter type='and'>\n\t\t\t\t\t\t\t<condition attribute='systemuserid' operator= 'eq' value='{0}' />\n\t\t\t\t\t\t</filter>\n\t\t\t\t\t</link-entity>\n\t\t\t\t</entity>\n\t\t\t</fetch>";
    AppCommon.DialogConstants = DialogConstants;
    var DialogName = (function () {
        function DialogName() {
        }
        return DialogName;
    }());
    DialogName.AddToQueueDialog = "AddToQueue";
    DialogName.CreateOrUpdateCustomerServiceScheduleRule = "CreateOrUpdateCustomerServiceScheduleRule";
    DialogName.CreateOrUpdateHolidayItem = "CreateOrUpdateHolidayItem";
    DialogName.CreateOrUpdateBusinessClosureItem = "CreateOrUpdateBusinessClosure";
    AppCommon.DialogName = DialogName;
    /**
    * SLA web client deprecation states
    */
    var SLAWebClientDeprecationState;
    (function (SLAWebClientDeprecationState) {
        SLAWebClientDeprecationState[SLAWebClientDeprecationState["YetToShow"] = 0] = "YetToShow";
        SLAWebClientDeprecationState[SLAWebClientDeprecationState["YetToAcknowledge"] = 1] = "YetToAcknowledge";
        SLAWebClientDeprecationState[SLAWebClientDeprecationState["Acknowledged"] = 2] = "Acknowledged";
        SLAWebClientDeprecationState[SLAWebClientDeprecationState["Canceled"] = 3] = "Canceled";
    })(SLAWebClientDeprecationState = AppCommon.SLAWebClientDeprecationState || (AppCommon.SLAWebClientDeprecationState = {}));
})(AppCommon || (AppCommon = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var AppCommon;
(function (AppCommon) {
    var EntityNames = (function () {
        function EntityNames() {
        }
        return EntityNames;
    }());
    EntityNames.Account = "account";
    EntityNames.Contact = "contact";
    EntityNames.CustomerAddress = "customeraddress";
    EntityNames.ConvertRule = "convertrule";
    EntityNames.Mailbox = "mailbox";
    EntityNames.Queue = "queue";
    EntityNames.QueueItem = "queueitem";
    EntityNames.SystemUser = "systemuser";
    EntityNames.Team = "team";
    EntityNames.Territory = "territory";
    EntityNames.CalendarRule = "calendarrule";
    EntityNames.Goal = "goal";
    EntityNames.Metric = "metric";
    EntityNames.RollupField = "rollupfield";
    EntityNames.GoalRollupQuery = "goalrollupquery";
    EntityNames.Calendar = "calendar";
    EntityNames.Connection = "connection";
    AppCommon.EntityNames = EntityNames;
    var EntityTypeCode = (function () {
        function EntityTypeCode() {
        }
        return EntityTypeCode;
    }());
    EntityTypeCode.SystemUser = 8;
    EntityTypeCode.Team = 9;
    EntityTypeCode.SocialActivity = 4216;
    EntityTypeCode.Email = 4202;
    EntityTypeCode.Queue = 2020;
    AppCommon.EntityTypeCode = EntityTypeCode;
})(AppCommon || (AppCommon = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../ClientCommon/DialogConstants.ts" />
/// <reference path="../ClientCommon/EntityNames.ts" />
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../../TypeDefinitions/AppCommon/Localization/ResourceStringProvider.d.ts" />
var AppCommon;
(function (AppCommon) {
    var Commands;
    (function (Commands) {
        var QueueItemDetailsOTCSessionKey = "EntityOTCinfo"; // session variable used for get or set ObjectTypeCode
        var QueueCommandsLibrary = (function () {
            function QueueCommandsLibrary() {
                var _this = this;
                /**
                 * Call to open dialog for form to add current entity to a queue
                 * @param objectType number|string describe a parameter string for modern support of entityTypeName calling. Number for legacy support of objectTypeCode calling
                 */
                this.AddRecordToQueue = function (objectType) {
                    var entityName = "";
                    if (typeof objectType === "number") {
                        entityName = Xrm.Internal.getEntityName(objectType);
                    }
                    else if (typeof objectType === "string") {
                        entityName = objectType;
                    }
                    var records = [];
                    //Prepare entity records and pass as dialog param which is common for both grid and form 
                    var entityReference = {
                        Id: Xrm.Page.data.entity.getId(),
                        TypeName: entityName
                    };
                    records = [
                        entityReference
                    ];
                    var dialogParams = {};
                    dialogParams[AppCommon.DialogConstants.RecordsParam] = JSON.stringify(records);
                    dialogParams[AppCommon.DialogConstants.LastButtonClickedParam] = AppCommon.DialogConstants.DialogOkId;
                    var options = {};
                    options.height = 240;
                    options.width = 450;
                    Xrm.Navigation.openDialog(AppCommon.DialogName.AddToQueueDialog, options, dialogParams).then(_this.AddToQueueCommandBarDialogCloseCallback());
                };
                this.AddToQueueOnLoad = function (context) {
                    var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                    if (ClientUtility.ClientUtil.isUCI()) {
                        var addToQueueDialogView = Xrm.Utility.getGlobalContext().getCurrentAppSetting(AppCommon.DialogConstants.Msdyn_AddToQueueDialogViewSelection);
                        var queueLookUpControl_1 = formContext.getControl(AppCommon.DialogConstants.BusinessQueuesLookupId);
                        if (addToQueueDialogView != null && addToQueueDialogView != undefined) {
                            queueLookUpControl_1 && queueLookUpControl_1.setDefaultView(addToQueueDialogView);
                        }
                        var isAddToQueueDialogEnhancementsEnabled = ClientUtility.ClientUtil.isUCI() && Xrm && Xrm.Internal && Xrm.Internal.isFeatureEnabled("EnableAddToQueueDialogEnhancements");
                        if (isAddToQueueDialogEnhancementsEnabled == true) {
                            Xrm.Utility.getEntityMetadata(AppCommon.EntityNames.Queue).then(function (response) {
                                if (response && response._entityDescriptor && response._entityDescriptor.AttributeNames.indexOf("msdyn_queuetype") >= 0) {
                                    // msdyn_queuetype attribute is present in org. We can add the pre-search filter
                                    queueLookUpControl_1 && queueLookUpControl_1.addPreSearch(QueueCommandsLibrary.entityQueueCustomFilter);
                                }
                            }).catch(function (error) {
                                console.log("Error in retrieving queue entity metadata: " + error);
                            });
                            // Pre-populate chosen queue for add to queue dialog
                            var selectedRecords = formContext.data.attributes.get(AppCommon.DialogConstants.RecordsParam);
                            if (selectedRecords && selectedRecords.getValue()) {
                                var selectedRecordCount = JSON.parse(selectedRecords.getValue()).length;
                                if (selectedRecordCount === 1) {
                                    var objectId_1 = JSON.parse(selectedRecords.getValue())[0].Id;
                                    if (Xrm.Internal.isFeatureEnabled("EntityQueueItemDetailChangeAddedObjecttypecode")) {
                                        var entityName = JSON.parse(selectedRecords.getValue())[0].TypeName;
                                        _this.getEntityOTCinfo(entityName).then(function (ObjectTypeCode) {
                                            Xrm.WebApi.retrieveMultipleRecords(AppCommon.EntityNames.QueueItem, "?$select=queueitemid,_queueid_value&$filter=statecode eq 0 and objecttypecode eq " + ObjectTypeCode + " and _objectid_value eq " + ClientUtility.Guid.create(objectId_1)).then(function (queueItemsResponse) {
                                                _this.populateQueueLookup(formContext, queueItemsResponse);
                                            }, ClientUtility.ActionFailedHandler.actionFailedErrorDialog);
                                        });
                                    }
                                    else {
                                        Xrm.WebApi.retrieveMultipleRecords(AppCommon.EntityNames.QueueItem, "?$select=queueitemid,_queueid_value&$filter=statecode eq 0 and _objectid_value eq " + ClientUtility.Guid.create(objectId_1)).then(function (queueItemsResponse) {
                                            _this.populateQueueLookup(formContext, queueItemsResponse);
                                        }, ClientUtility.ActionFailedHandler.actionFailedErrorDialog);
                                    }
                                }
                            }
                        }
                    }
                };
                this.populateQueueLookup = function (formContext, queueItemsResponse) {
                    var queueItems = queueItemsResponse.entities;
                    if (queueItems && queueItems.length === 1) {
                        var queueItem = queueItems[0];
                        var queueLookupValue = [{ entityType: AppCommon.EntityNames.Queue, id: queueItem[AppCommon.DialogConstants.QueueLookupAttribute], name: queueItem[AppCommon.DialogConstants.QueueLookupAttributeName] }];
                        if (formContext.getControl(AppCommon.DialogConstants.BusinessQueuesLookupId))
                            formContext.getControl(AppCommon.DialogConstants.BusinessQueuesLookupId).getAttribute().setValue(queueLookupValue);
                    }
                };
                /**
                 * Open a dialog to add to a queue the records that are passed in
                 * @param gridControl Grid control
                 * @param records Reference to the records for this action
                 * @param entityTypeCode Entity type code of the grid (doesn't used in that function)
                 */
                this.AddGridRecordsToQueue = function (gridControl, records, entityType) {
                    var selectedRecords = [];
                    //Update the EntityReference Array as selectedRecords doesn't contain required information/data.
                    for (var i in records) {
                        var record = records[i];
                        var entityName = record.TypeName;
                        if (!entityName) {
                            entityName = Xrm.Internal.getEntityName(parseInt(record.TypeCode));
                        }
                        var entityReference = {
                            Id: record.Id,
                            TypeName: entityName
                        };
                        selectedRecords.push(entityReference);
                    }
                    var dialogParams = {};
                    dialogParams[AppCommon.DialogConstants.RecordsParam] = JSON.stringify(selectedRecords);
                    dialogParams[AppCommon.DialogConstants.LastButtonClickedParam] = AppCommon.DialogConstants.DialogOkId;
                    var dialogOptions = {};
                    dialogOptions.height = 240;
                    dialogOptions.width = 450;
                    Xrm.Navigation.openDialog(AppCommon.DialogName.AddToQueueDialog, dialogOptions, dialogParams).then(function (context) { return _this.AddToQueueGridCommandDialogCloseCallback(gridControl, context); });
                };
                this.AddToQueueGridCommandDialogCloseCallback = function (_gridControl, callbackParams) {
                    var constants = AppCommon.DialogConstants;
                    if (_gridControl && _gridControl.refresh && callbackParams.parameters[constants.LastButtonClickedParam] && callbackParams.parameters[constants.LastButtonClickedParam] === constants.DialogOkId) {
                        _gridControl.refresh();
                    }
                };
                // Dialog callbacks
                this.addToQueueDialogAddClick = function (context) {
                    var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                    ClientUtility.DialogUtil.setLastButtonClicked(AppCommon.DialogConstants.DialogOkId);
                    var businessQueueLookup = formContext.data.attributes.get(AppCommon.DialogConstants.BusinessQueuesLookupId);
                    if (!businessQueueLookup)
                        return;
                    var selectedItems = businessQueueLookup.getValue();
                    if (!selectedItems || selectedItems.length === 0) {
                        var errorMessage = AppCommon.ResourceStringProvider.getResourceString("AddToQueueDialog_NoQueueSelected");
                        ClientUtility.DialogUtil.openAlertDialog(errorMessage);
                    }
                    else {
                        var queueId = selectedItems[0].id.replace("{", "").replace("}", "");
                        var recordsEntityRefs = formContext.data.attributes.get(AppCommon.DialogConstants.RecordsParam).getValue();
                        var records = ClientUtility.DialogUtil.deserializeSdkEntityReferences(recordsEntityRefs);
                        _this.sendAddToQueueRequest(queueId, records);
                    }
                };
                this.closeDialog = function (context) {
                    var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                    ClientUtility.DialogUtil.setLastButtonClicked(AppCommon.DialogConstants.DialogCancelId);
                    formContext.ui.close();
                };
                this.addToQueueDialogQueueChange = function (context) {
                    var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                    var businessQueueLookup = formContext.data.attributes.get(AppCommon.DialogConstants.BusinessQueuesLookupId);
                    if (!businessQueueLookup) {
                        return;
                    }
                    var selectedItems = businessQueueLookup.getValue(), dialogOk = formContext.getControl(AppCommon.DialogConstants.DialogOkId);
                    if (!dialogOk) {
                        return;
                    }
                    if (!selectedItems || !selectedItems.length) {
                        dialogOk.setDisabled(true);
                    }
                    else {
                        dialogOk.setDisabled(false);
                    }
                };
                /// <summary>
                /// Method to display a form with queue details of an entity.
                /// </summary>
                /// <param name="objectId">the objectId</param>
                this.entityQueueItemDetail = function (objectId) {
                    if (Xrm.Internal.isFeatureEnabled("EntityQueueItemDetailChangeAddedObjecttypecode")) {
                        var entityName = Xrm.Page.data.entity.getEntityName();
                        _this.getEntityOTCinfo(entityName).then(function (ObjectTypeCode) {
                            Xrm.WebApi.retrieveMultipleRecords(AppCommon.EntityNames.QueueItem, "?$select=queueitemid&$filter=statecode eq 0 and objecttypecode eq " + ObjectTypeCode + " and _objectid_value eq " + ClientUtility.Guid.create(objectId)).then(function (queueItemsResponse) {
                                _this.openQueueItemForm(queueItemsResponse);
                            }, ClientUtility.ActionFailedHandler.actionFailedErrorDialog);
                        });
                    }
                    else {
                        Xrm.WebApi.retrieveMultipleRecords(AppCommon.EntityNames.QueueItem, "?$select=queueitemid&$filter=statecode eq 0 and _objectid_value eq " + ClientUtility.Guid.create(objectId)).then(function (queueItemsResponse) {
                            _this.openQueueItemForm(queueItemsResponse);
                        }, ClientUtility.ActionFailedHandler.actionFailedErrorDialog);
                    }
                };
                this.getEntityOTCinfo = function (entityName) { return __awaiter(_this, void 0, void 0, function () {
                    var sessionData, entityOTCInfo, entityMetadata;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                sessionData = sessionStorage && sessionStorage.getItem(QueueItemDetailsOTCSessionKey);
                                entityOTCInfo = sessionData ? JSON.parse(sessionData) : {};
                                if (entityName in entityOTCInfo) {
                                    return [2 /*return*/, Promise.resolve(entityOTCInfo[entityName])];
                                }
                                return [4 /*yield*/, Xrm.Utility.getEntityMetadata(entityName, ["ObjectTypeCode"])];
                            case 1:
                                entityMetadata = _a.sent();
                                entityOTCInfo[entityName] = entityMetadata.ObjectTypeCode;
                                sessionStorage && sessionStorage.setItem(QueueItemDetailsOTCSessionKey, JSON.stringify(entityOTCInfo));
                                return [2 /*return*/, Promise.resolve(entityMetadata.ObjectTypeCode)];
                        }
                    });
                }); };
                this.openQueueItemForm = function (queueItemsResponse) {
                    var queueItems = queueItemsResponse.entities;
                    if (queueItems.length === 1) {
                        var queueItem = queueItemsResponse.entities[0];
                        if (ClientUtility.ClientUtil.isUCI() && Xrm.Internal.isFeatureEnabled('OpenQueueItemDetailsInlineInUCI') && Xrm.Internal.isFeatureEnabled('October2020Update')) {
                            var mfdType = 2;
                            var pageInput = { pageType: "entityrecord", entityId: queueItem['queueitemid'], entityName: AppCommon.EntityNames.QueueItem, formType: mfdType };
                            var options = {
                                entityName: AppCommon.EntityNames.QueueItem,
                                showDialog: true,
                                hideDialogHeader: true,
                                target: 2,
                                width: 600,
                                position: 2 /* right */
                            };
                            Xrm.Navigation.navigateTo(pageInput, options);
                        }
                        else {
                            Xrm.Utility.openEntityForm(AppCommon.EntityNames.QueueItem, queueItem['queueitemid'], null);
                        }
                    }
                    else if (queueItemsResponse.entities.length > 1) {
                        ClientUtility.DialogUtil.openAlertDialog(AppCommon.ResourceStringProvider.getResourceString("RECORD_ADDED_TO_MULTIPLE_QUEUES"), true);
                    }
                    else {
                        ClientUtility.DialogUtil.openAlertDialog(AppCommon.ResourceStringProvider.getResourceString("RECORD_ADDED_TO_NO_QUEUE"), true);
                    }
                };
                this.sendAddToQueueRequest = function (queueId, records) {
                    if (records.length === 1) {
                        ClientUtility.DialogUtil.showProgressMessage();
                        var targetEntity = records[0];
                        var request = _this.createAddToQueueRequest(queueId, targetEntity);
                        Xrm.WebApi.online.execute(request).then(function (response) {
                            ClientUtility.DialogUtil.hideProgressMessage();
                            Xrm.Page.ui.close();
                        }, ClientUtility.DialogUtil.actionFailedCallbackForMoca);
                    }
                    else {
                        _this.addToQueueMultipleRecords(queueId, records);
                    }
                };
                this.addToQueueMultipleRecords = function (queueId, records) {
                    ClientUtility.DialogUtil.showProgressMessage();
                    // 	Because of timeout issue while executing bunch of records, 
                    // 	so splitting the batch into multiple arrays of 100
                    var max_queue_batch_size = 100;
                    var addQueuePromise = [];
                    // splits the records into batches and then execute it.
                    while (records.length > 0) {
                        var recordsBatch = records.splice(0, max_queue_batch_size);
                        addQueuePromise.push(_this.executeMultipleBatchOfQueueRecords(queueId, recordsBatch));
                    }
                    Promise.all(addQueuePromise).then(function (allResponses) {
                        ClientUtility.DialogUtil.hideProgressMessage();
                        var responses = [].concat.apply([], allResponses);
                        if (responses.every(function (response) { return response.ok; })) {
                        }
                        else {
                            _this.openAlertDialogForAssignMultipleError();
                            return;
                        }
                        Xrm.Page.ui.close();
                    }, function (response) {
                        ClientUtility.DialogUtil.hideProgressMessage();
                        ClientUtility.DialogUtil.actionFailedCallbackForMoca(response);
                    });
                };
                this.executeMultipleBatchOfQueueRecords = function (queueId, records) {
                    // Creates the AddToQueue request and then execute those request for given records
                    var requests = new Array();
                    for (var i = 0; i < records.length; i++) {
                        var newRequest = _this.createAddToQueueRequest(queueId, records[i]);
                        requests.push(newRequest);
                    }
                    return Xrm.WebApi.online.executeMultiple(requests);
                };
                this.createAddToQueueRequest = function (queueId, record) {
                    var queueRef = {
                        id: queueId,
                        entityType: "queue"
                    };
                    var entityRef = {
                        entityType: record.TypeName,
                        id: record.Id
                    };
                    var request = new ODataContract.AddToQueueRequest(queueRef, entityRef, null, null);
                    // We need to remove those properties since the service does not accept a null value.
                    delete request.SourceQueue;
                    delete request.QueueItemProperties;
                    return request;
                };
                this.openAlertDialogForAssignMultipleError = function () {
                    var alertDialogText = AppCommon.ResourceStringProvider.getResourceString("Error_Message_Action_MultipleErrorsFound");
                    ClientUtility.DialogUtil.openAlertDialog(alertDialogText);
                };
            }
            QueueCommandsLibrary.entityQueueCustomFilter = function (eventContext) {
                var formContext = eventContext.getFormContext();
                var queueLookUpControl = formContext.getControl(AppCommon.DialogConstants.BusinessQueuesLookupId);
                // Filter for entity type queues only
                var entityQueueFilter = AppCommon.DialogConstants.EntityQueueFilter;
                queueLookUpControl && queueLookUpControl.addCustomFilter(entityQueueFilter, AppCommon.EntityNames.Queue);
            };
            /**
             * Creates the callback for the assign queue dialog for command bar action
             * It should refresh data with saving on dialo OK button click
             */
            QueueCommandsLibrary.prototype.AddToQueueCommandBarDialogCloseCallback = function () {
                return function (callbackParams) {
                    var constants = AppCommon.DialogConstants;
                    if (callbackParams.parameters[constants.LastButtonClickedParam] && callbackParams.parameters[constants.LastButtonClickedParam] === constants.DialogOkId) {
                        var client = Xrm.Utility.getGlobalContext().client.getClient();
                        if (client === Xrm.Constants.ClientNames.web || callbackParams.parameters[constants.LastButtonClickedParam] == constants.DialogOkId) {
                            Xrm.Page.data.refresh(true);
                        }
                    }
                };
            };
            return QueueCommandsLibrary;
        }());
        Commands.QueueCommandsLibrary = QueueCommandsLibrary;
    })(Commands = AppCommon.Commands || (AppCommon.Commands = {}));
})(AppCommon || (AppCommon = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="AssignQueueLibrary.ts" />
/// <reference path="QueueCommandsLibrary.ts" />
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var AppCommon;
(function (AppCommon) {
    var Commands;
    (function (Commands) {
        Commands.Queue = new Commands.QueueCommandsLibrary();
        Commands.AssignQueue = new Commands.AssignQueueLibrary();
    })(Commands = AppCommon.Commands || (AppCommon.Commands = {}));
})(AppCommon || (AppCommon = {}));
//# sourceMappingURL=QueueCommands.js.map