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
/// <reference path="../../../TypeDefinitions/AppCommon/Localization/ResourceStringProvider.d.ts" />
var AppCommon;
(function (AppCommon) {
    var QueueItemUtils = (function () {
        function QueueItemUtils() {
        }
        Object.defineProperty(QueueItemUtils, "FETCHXML_QUEUEITEMS_BY_ID", {
            get: function () {
                return "\n\t\t\t\t<fetch version=\"1.0\" output-format=\"xml-platform\" mapping=\"logical\" distinct=\"true\">\n\t\t\t\t\t<entity name= \"queueitem\">\n                    <attribute name=\"queueid\"/>\n                    <attribute name=\"queueitemid\"/>\n\t\t\t\t\t\t<filter type=\"and\">\n\t\t\t\t\t\t\t<condition attribute=\"queueitemid\" operator=\"in\">{0}</condition>\n\t\t\t\t\t\t</filter>\n\t\t\t\t\t</entity>\n\t\t\t\t</fetch>";
            },
            enumerable: true,
            configurable: true
        });
        QueueItemUtils.BuildQueueItemsConditionXML = function (queueItemList) {
            var queueItemIds = "";
            queueItemList.forEach(function (value) {
                queueItemIds += String.format(AppCommon.QueueItemUtils.InOperatorValue, value);
            });
            return queueItemIds;
        };
        QueueItemUtils.areQueueItemsRoutedViaUnifiedRouting = function (formContext, recordsParameter) {
            return __awaiter(this, void 0, void 0, function () {
                var records, recordsAttribute, recordsJson, selectedQueueItems, i, paramString_1, queueItemsRoutedViaUR_FetchXml;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            records = [];
                            recordsAttribute = formContext.data.attributes.get(recordsParameter);
                            if (!recordsAttribute) return [3 /*break*/, 3];
                            recordsJson = recordsAttribute.getValue();
                            records = JSON.parse(recordsJson);
                            if (!(records.length > 0)) return [3 /*break*/, 2];
                            selectedQueueItems = new Set();
                            for (i = 0; i < records.length; i++) {
                                selectedQueueItems.add(records[i].Id.toString());
                            }
                            paramString_1 = "";
                            selectedQueueItems.forEach(function (queueItemId) {
                                paramString_1 = paramString_1 + ("<value>" + queueItemId + "</value>");
                            });
                            queueItemsRoutedViaUR_FetchXml = String.format(AppCommon.DialogConstants.QueueItemsRoutedViaUR_FetchXml, paramString_1);
                            queueItemsRoutedViaUR_FetchXml = "?fetchXml=" + encodeURIComponent(queueItemsRoutedViaUR_FetchXml);
                            return [4 /*yield*/, this.getUnifiedRouting_RoutedQueueItems(queueItemsRoutedViaUR_FetchXml)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [2 /*return*/, false];
                        case 3: return [2 /*return*/, false];
                    }
                });
            });
        };
        QueueItemUtils.getUnifiedRouting_RoutedQueueItems = function (queueItemsRoutedViaUR_FetchXml) {
            return __awaiter(this, void 0, void 0, function () {
                var routedViaUnifiedRoutingFlag, promise;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            routedViaUnifiedRoutingFlag = false;
                            promise = new Promise(function (resolve, reject) {
                                Xrm.WebApi.retrieveMultipleRecords(AppCommon.DialogConstants.EntityQueueItem, queueItemsRoutedViaUR_FetchXml).then(function (response) {
                                    if (response.entities.length > 0) {
                                        resolve(true);
                                    }
                                    else {
                                        resolve(false);
                                    }
                                }, function (_error) {
                                    reject(false);
                                });
                            });
                            return [4 /*yield*/, promise];
                        case 1:
                            routedViaUnifiedRoutingFlag = _a.sent();
                            return [2 /*return*/, routedViaUnifiedRoutingFlag];
                    }
                });
            });
        };
        return QueueItemUtils;
    }());
    QueueItemUtils.setQueueItemIdToEachRecord = function (record, currentRow) {
        var queueItemId = "";
        var queueId = "";
        var rowAttributes = null;
        // Since it depends on the grid being used, we check both APIs
        if (!ClientUtility.ClientUtil.isUCI()) {
            rowAttributes = currentRow.getData().attributes || currentRow.getData().getEntity().getAttributes();
        }
        else {
            rowAttributes = currentRow.getData().getEntity().attributes;
        }
        if (rowAttributes) {
            var allAttributes = rowAttributes.getAll();
            for (var j = 0; j < allAttributes.length; ++j) {
                var rowAttribute = allAttributes[j];
                if (rowAttribute.getName() === "queueitemid" || (!ClientUtility.ClientUtil.isUCI() ? (rowAttribute.getKey() === "queueitemid") : false)) {
                    queueItemId = rowAttribute.getValue();
                }
                if (rowAttribute.getName() === "queueid") {
                    var rowAttributeValue = rowAttribute.getValue();
                    if (rowAttributeValue.length > 0) {
                        queueId = rowAttributeValue[0]['id'];
                    }
                }
            }
            if (queueId) {
                record.QueueId = queueId;
            }
            if (queueItemId) {
                record.Id = queueItemId;
            }
        }
        record.TypeCode = 2029;
    };
    QueueItemUtils.fetchOrSetQueueItemIdToEachRecord = function (gridControl, records, callBackLaunchDialog) {
        var selectedRecordList = [];
        records.forEach(function (record) {
            var currentRow = gridControl.getGrid().getRows().get(record.Id);
            if (ClientUtility.DataUtil.isNullOrUndefined(currentRow)) {
                selectedRecordList.push(record.Id);
            }
            else {
                QueueItemUtils.setQueueItemIdToEachRecord(record, currentRow);
            }
        });
        if (selectedRecordList.length > 0) {
            AppCommon.QueueItemUtils.GetQueueItemsIdList(selectedRecordList).then(function (queueItemsResponse) {
                if (queueItemsResponse.entities) {
                    var queueItemMap_1 = new Map(queueItemsResponse.entities.map(function (queueItem) { return [queueItem.queueitemid, queueItem]; }));
                    records.forEach(function (record) {
                        var mappedQueueItem = queueItemMap_1.get(record.Id);
                        if (mappedQueueItem) {
                            record.QueueId = mappedQueueItem._queueid_value;
                            record.TypeCode = 2029;
                        }
                    });
                }
                callBackLaunchDialog(gridControl, records);
            });
        }
        else {
            callBackLaunchDialog(gridControl, records);
        }
    };
    QueueItemUtils.OpenAlertDialogForMultipleError = function (closeUI) {
        var alertDialogStrings = { text: undefined };
        alertDialogStrings.text = QueueItemUtils.GetLabel("Error_Message_Action_MultipleErrorsFound");
        Xrm.Navigation.openAlertDialog(alertDialogStrings, null).then(function () {
            if (closeUI && Xrm.Page.ui) {
                Xrm.Page.ui.close();
            }
        });
    };
    QueueItemUtils.GetLabel = function (labelId) {
        if (AppCommon.ResourceStringProvider) {
            return AppCommon.ResourceStringProvider.getResourceString(labelId);
        }
        else {
            return labelId;
        }
    };
    QueueItemUtils.InOperatorValue = "<value>{0}</value>";
    QueueItemUtils.FetchXmlQueryString = "?fetchXml=";
    QueueItemUtils.GetQueueItemsIdList = function (queueItemList) {
        var inCondition = AppCommon.QueueItemUtils.BuildQueueItemsConditionXML(queueItemList);
        var getQueueItemFetchXml = String.format(AppCommon.QueueItemUtils.FETCHXML_QUEUEITEMS_BY_ID, inCondition);
        var getQueueItemPromise = Xrm.WebApi.retrieveMultipleRecords(AppCommon.EntityNames.QueueItem, AppCommon.QueueItemUtils.FetchXmlQueryString + getQueueItemFetchXml);
        return getQueueItemPromise;
    };
    AppCommon.QueueItemUtils = QueueItemUtils;
})(AppCommon || (AppCommon = {}));
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
    var msdyn_ApplyRoutingRuleEntityRecordRequest = (function () {
        function msdyn_ApplyRoutingRuleEntityRecordRequest(target /*Microsoft.Dynamics.CRM.crmbaseentity*/) {
            this.Target = target;
        }
        msdyn_ApplyRoutingRuleEntityRecordRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "Target": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5,
                    },
                },
                operationName: "msdyn_ApplyRoutingRuleEntityRecord",
                operationType: 0,
            };
            return metadata;
        };
        return msdyn_ApplyRoutingRuleEntityRecordRequest;
    }());
    ODataContract.msdyn_ApplyRoutingRuleEntityRecordRequest = msdyn_ApplyRoutingRuleEntityRecordRequest;
})(ODataContract || (ODataContract = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../ClientCommon/DialogConstants.ts" />
/// <reference path="../ClientCommon/EntityNames.ts" />
/// <reference path="./QueueItemUtils.ts" />
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../../TypeDefinitions/AppCommon/Localization/ResourceStringProvider.d.ts" />
/// <reference path="../ClientCommon/DataContracts/Action/msdyn_ApplyRoutingRuleEntityRecordRequest.ts" />
var AppCommon;
(function (AppCommon) {
    var QueueItemPickParams = (function () {
        function QueueItemPickParams() {
        }
        return QueueItemPickParams;
    }());
    QueueItemPickParams.EntityRecords = "entity_records";
    QueueItemPickParams.LastButtonClicked = "param_lastButtonClicked";
    QueueItemPickParams.QueueItemGridControl = "param_gridControl";
    var QueueItemPickControlNames = (function () {
        function QueueItemPickControlNames() {
        }
        return QueueItemPickControlNames;
    }());
    QueueItemPickControlNames.OkButton = "ok_id";
    QueueItemPickControlNames.CancelButton = "cancel_id";
    QueueItemPickControlNames.RemoveQueueItemPickId = "checkboxpick_id";
    QueueItemPickControlNames.QueueItemPickHeaderText = "lbl_headerdescription";
    var QueueItemSaveAndRouteParams = (function () {
        function QueueItemSaveAndRouteParams() {
        }
        return QueueItemSaveAndRouteParams;
    }());
    QueueItemSaveAndRouteParams.EntityRecords = "entity_records";
    QueueItemSaveAndRouteParams.LastButtonClicked = "param_lastButtonClicked";
    var QueueItemSaveAndRouteControlNames = (function () {
        function QueueItemSaveAndRouteControlNames() {
        }
        return QueueItemSaveAndRouteControlNames;
    }());
    QueueItemSaveAndRouteControlNames.OkButton = "ok_id";
    QueueItemSaveAndRouteControlNames.CancelButton = "cancel_id";
    /**
     * Handles the "Pick" functionality from queue items grid, opening the dialog and handling its events.
     */
    var QueueItemPickLibrary = (function () {
        function QueueItemPickLibrary() {
            /**
             * Opens the "pick" dialog for the queue item.
             */
            var _this = this;
            this.OpenQueueItemPickDialog = function (gridControl, records, entityTypeCode) {
                if (!ClientUtility.CommandBarActions.isMobileCompanionApp()) {
                    AppCommon.QueueItemUtils.fetchOrSetQueueItemIdToEachRecord(gridControl, records, _this.LaunchQueueItemPickDialog);
                }
                else {
                    _this.LaunchQueueItemPickDialog(gridControl, records);
                }
            };
            this.LaunchQueueItemPickDialog = function (gridControl, records) {
                var dialogParams = {};
                var isFCSEnabled = _this.getFeatureControlSetting("CS.QueueItemPick", "EnableSaveAndRouteForPickFailure", false);
                if (isFCSEnabled) {
                    dialogParams[QueueItemPickParams.QueueItemGridControl] = gridControl;
                }
                dialogParams[QueueItemPickParams.EntityRecords] = JSON.stringify(records.map(function (etn) {
                    return { TypeName: AppCommon.EntityNames.QueueItem, Id: etn["Id"], Name: etn["Name"] };
                }));
                var callbackParams = {};
                Xrm.Navigation.openDialog("QueueItemPick", { height: 350, width: 550, position: 1 /* center */ }, dialogParams).then(function (context) { return _this.DialogCloseCallback(gridControl, context); });
            };
            this.DialogCloseCallback = function (_gridControl, callbackParams) {
                if (_gridControl &&
                    _gridControl.refresh &&
                    callbackParams.parameters[QueueItemPickParams.LastButtonClicked] === QueueItemPickControlNames.OkButton) {
                    _gridControl.refresh();
                }
            };
            this.DialogCloseSaveAndRouteCallback = function (_gridControl, callbackParams) {
                if (_gridControl &&
                    _gridControl.refresh &&
                    callbackParams.parameters[QueueItemSaveAndRouteParams.LastButtonClicked] === QueueItemSaveAndRouteControlNames.OkButton) {
                    _gridControl.refresh();
                }
            };
            /**
             * Handler for the "ok" button on the dialog. The pick request is sent to the server based on the user's selection.
             */
            this.QueueItemDialogPickClick = function (context) {
                if (ClientUtility.ClientUtil.isMobileOffline()) {
                    ClientUtility.DialogUtil.showMoCAOfflineError();
                    return;
                }
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                ClientUtility.DialogUtil.setAttributeValue(QueueItemPickParams.LastButtonClicked, QueueItemPickControlNames.OkButton, formContext);
                var recordsAttribute = formContext.data.attributes.get(QueueItemPickParams.EntityRecords);
                if (recordsAttribute) {
                    var removeQueueItemChecked = formContext.data.attributes.get(QueueItemPickControlNames.RemoveQueueItemPickId);
                    var removeQueueItem_1 = false;
                    if (removeQueueItemChecked.getValue()) {
                        removeQueueItem_1 = true;
                    }
                    var recordsString = recordsAttribute.getValue();
                    var records = JSON.parse(recordsString);
                    ClientUtility.DialogUtil.showProgressMessage();
                    var systemUserReference_1 = {
                        id: formContext.context.getUserId(),
                        entityType: AppCommon.EntityNames.SystemUser
                    };
                    var pickRequests_1 = records.map(function (entity) {
                        var entityRef = {
                            entityType: entity.TypeName,
                            id: ClientUtility.Guid.create(entity.Id)
                        };
                        var request = new ODataContract.PickFromQueueRequest(entityRef, systemUserReference_1, removeQueueItem_1);
                        return request;
                    });
                    Xrm.WebApi.online.executeMultiple(pickRequests_1).then(function (results) {
                        ClientUtility.DialogUtil.hideProgressMessage();
                        formContext.ui.close();
                    }, function (errorResponse) {
                        var isFCSEnabled = _this.getFeatureControlSetting("CS.QueueItemPick", "EnableSaveAndRouteForPickFailure", false);
                        if (isFCSEnabled) {
                            if (pickRequests_1.length > 1) {
                                var errorCode = errorResponse["errorCode"];
                                var errorString = AppCommon.ResourceStringProvider.getResourceString("Dialog_QueueItemPick_MutliPick_Error");
                                var errorMessage = { errorCode: errorCode, message: errorString };
                                AppsTelemetryLib.AppsTelemetryUtility.reportData("QueueItemPick", "Service", "QueueItem", "QueueItemPick", null, { "Scenario": "QueueItemMultiPick", "ErrorCode": errorCode, "ErrorMessage": errorResponse.Message });
                                ClientUtility.DialogUtil.actionFailedCallbackForMoca(errorMessage);
                            }
                            else {
                                AppsTelemetryLib.AppsTelemetryUtility.reportData("QueueItemPick", "Service", "QueueItem", "QueueItemPick", null, { "Scenario": "QueueItemSinglePick", "ErrorCode": errorCode, "ErrorMessage": errorResponse.Message });
                                _this.ValidateResponseAndShowError(context, errorResponse);
                            }
                        }
                        else {
                            ClientUtility.DialogUtil.actionFailedCallbackForMoca(errorResponse);
                        }
                    });
                }
            };
            /**
             * Handler of the "cancel" button, which just closes the dialog.
             */
            this.CloseDialog = function (context) {
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                ClientUtility.DialogUtil.setAttributeValue(QueueItemPickParams.LastButtonClicked, QueueItemPickControlNames.CancelButton);
                formContext.ui.close();
            };
            this.CloseDialogSaveAndRouteErrorPick = function (context) {
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                AppsTelemetryLib.AppsTelemetryUtility.reportData("QueueSaveAndRouteCancel", "Service", "QueueItem", "QueueItemPick", null, { "Scenario": "SaveAndRouteOnPickFailureCanceled" });
                ClientUtility.DialogUtil.setAttributeValue(QueueItemSaveAndRouteParams.LastButtonClicked, QueueItemSaveAndRouteControlNames.CancelButton);
                formContext.ui.close();
            };
            /**
             * On load event handler, to customize the dialog experience based on the input.
             */
            this.QueueItemDialogPickOnLoad = function (context) {
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                var removeQueueItemChecked = formContext.ui.controls.get(QueueItemPickControlNames.RemoveQueueItemPickId);
                var queueItemRemovalDenialText = formContext.ui.controls.get(AppCommon.DialogConstants.QueueItemRemovalDenialText);
                var queueItemRemovalControlVisibilitySetting = function () {
                    if (removeQueueItemChecked) {
                        removeQueueItemChecked.setVisible(true);
                        removeQueueItemChecked.setFocus();
                    }
                };
                if (queueItemRemovalDenialText) {
                    if (removeQueueItemChecked) {
                        removeQueueItemChecked.setVisible(false);
                    }
                    queueItemRemovalDenialText.setVisible(false);
                    AppCommon.QueueItemUtils.areQueueItemsRoutedViaUnifiedRouting(formContext, QueueItemPickParams.EntityRecords).then(function (areQueueItemsRoutedViaUnifiedRouting) {
                        if (areQueueItemsRoutedViaUnifiedRouting) {
                            !ClientUtility.DataUtil.isNullOrUndefined(queueItemRemovalDenialText) && queueItemRemovalDenialText.setVisible(true);
                            if (!ClientUtility.DataUtil.isNullOrUndefined(removeQueueItemChecked)) {
                                formContext.data.attributes.get(QueueItemPickControlNames.RemoveQueueItemPickId).setValue(false);
                                removeQueueItemChecked.setDisabled(true);
                                removeQueueItemChecked.setVisible(true);
                            }
                        }
                        else {
                            queueItemRemovalControlVisibilitySetting();
                        }
                    }, function (_error) {
                        queueItemRemovalControlVisibilitySetting();
                    });
                }
                else {
                    queueItemRemovalControlVisibilitySetting();
                }
                var recordsAttribute = formContext.data.attributes.get(QueueItemPickParams.EntityRecords);
                if (recordsAttribute) {
                    var recordsString = recordsAttribute.getValue();
                    var records = JSON.parse(recordsString);
                    var labelControl = formContext.ui.controls.get(QueueItemPickControlNames.QueueItemPickHeaderText);
                    if (labelControl) {
                        if (records.length === 1) {
                            labelControl.setLabel(AppCommon.ResourceStringProvider.getResourceString("Dialog_QueueItemPick_Description_Single"));
                        }
                        else {
                            var label = AppCommon.ResourceStringProvider.getResourceString("Dialog_QueueItemPick_Description_Plural");
                            var formattedLabel = ClientUtility.StringUtil.format(label, records.length);
                            labelControl.setLabel(formattedLabel);
                        }
                    }
                }
            };
            /**
             * Validate the response to either show "Save & Route" dialog or generic error.
             */
            this.ValidateResponseAndShowError = function (context, errorCode) {
                var LWIQISyncErrorCode = "2147761766";
                if (LWIQISyncErrorCode == errorCode["errorCode"]) {
                    _this.LaunchSaveAndRouteDialog(context);
                }
                else {
                    ClientUtility.DialogUtil.actionFailedCallbackForMoca(errorCode);
                }
            };
            /**
             * Launches "Save & Route" dialog when there is an error in pick of queue item.
             */
            this.LaunchSaveAndRouteDialog = function (context) {
                var dialogParams = {};
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                ClientUtility.DialogUtil.hideProgressMessage();
                formContext.ui.close();
                var gridControl = formContext.data.attributes.get(QueueItemPickParams.QueueItemGridControl).getValue();
                var selectedRows = gridControl && gridControl.getGrid() && gridControl.getGrid().getSelectedRows();
                var selectedRowData = selectedRows && selectedRows.get(0) && selectedRows.get(0).getData();
                var selectedEntity = selectedRowData && selectedRowData.getEntity();
                var selectedEntityAtrributes = selectedEntity && selectedEntity.attributes;
                var objectIdAttribute = selectedEntityAtrributes && selectedEntityAtrributes.getByName("objectid");
                var objectId = objectIdAttribute && objectIdAttribute.getValue();
                if (objectId != null) {
                    var records = [{ TypeName: AppCommon.EntityNames.QueueItem, EntityType: objectId[0].entityType, EntityID: objectId[0].id, EntityName: objectId[0].name }];
                    dialogParams[QueueItemSaveAndRouteParams.EntityRecords] = JSON.stringify(records);
                }
                Xrm.Navigation.openDialog("SaveAndRouteForPickFailure", { height: 350, width: 550, position: 1 /* center */ }, dialogParams).then(function (context) { return _this.DialogCloseSaveAndRouteCallback(gridControl, context); });
            };
            /**
             * Handler of the "Save & Route" button, which re-routes the queue item.
             */
            this.SaveAndRouteClick = function (context) {
                ClientUtility.DialogUtil.showProgressMessage();
                AppsTelemetryLib.AppsTelemetryUtility.reportData("QueueSaveAndRoute", "Service", "QueueItem", "QueueItemPick", null, { "Scenario": "SaveAndRouteForPickFailure" });
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                ClientUtility.DialogUtil.setAttributeValue(QueueItemSaveAndRouteParams.LastButtonClicked, QueueItemSaveAndRouteControlNames.OkButton, formContext);
                var recordsAttribute = formContext.data.attributes.get(QueueItemSaveAndRouteParams.EntityRecords);
                if (recordsAttribute) {
                    var records = JSON.parse(recordsAttribute.getValue());
                    var pickedItems = records.map(function (entity) {
                        var entityRef = {
                            entityType: entity.EntityType,
                            id: entity.EntityID
                        };
                        var request = new ODataContract.msdyn_ApplyRoutingRuleEntityRecordRequest(entityRef);
                        return request;
                    });
                    Xrm.WebApi.online.executeMultiple(pickedItems).then(function (results) {
                        ClientUtility.DialogUtil.hideProgressMessage();
                        formContext.ui.close();
                    }, ClientUtility.DialogUtil.actionFailedCallbackForMoca);
                }
                else {
                    ClientUtility.DialogUtil.actionFailedCallbackForMoca;
                }
            };
            /*
             * Gets the feature control setting value
             */
            this.getFeatureControlSetting = function (nameSpace, settingKey, defaultValue) {
                if (ClientUtility.ClientUtil.isUCI()) {
                    var value = Xrm.Utility.getGlobalContext().getFeatureControlSetting(nameSpace, settingKey);
                    if (value !== undefined && value !== null) {
                        return value;
                    }
                }
                return defaultValue;
            };
        }
        return QueueItemPickLibrary;
    }());
    AppCommon.QueueItemPickLibrary = QueueItemPickLibrary;
})(AppCommon || (AppCommon = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="./QueueItemUtils.ts" />
/// <reference path="../ClientCommon/EntityNames.ts" />
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../../TypeDefinitions/AppCommon/Localization/ResourceStringProvider.d.ts" />
var AppCommon;
(function (AppCommon) {
    /**
     * Handles the "Release" functionality from queue items grid, opening the dialog and handling its events.
     */
    var QueueItemReleaseLibrary = (function () {
        function QueueItemReleaseLibrary() {
            var _this = this;
            /**
             * Resolves a label ID to a string. This is a workaround for the case where the framework does load the ResourceStringProvider
             */
            this.GetLabel = function (labelId) {
                if (AppCommon.ResourceStringProvider) {
                    return AppCommon.ResourceStringProvider.getResourceString(labelId);
                }
                else {
                    return labelId;
                }
            };
            this.OpenQueueItemReleaseDialog = function (gridControl, records, entityTypeCode) {
                if (!ClientUtility.CommandBarActions.isMobileCompanionApp()) {
                    AppCommon.QueueItemUtils.fetchOrSetQueueItemIdToEachRecord(gridControl, records, _this.LaunchQueueItemReleaseDialog);
                }
                else {
                    _this.LaunchQueueItemReleaseDialog(gridControl, records);
                }
            };
            this.LaunchQueueItemReleaseDialog = function (gridControl, records) {
                var options = {
                    width: 450,
                    height: 200,
                    position: 1 /* center */
                };
                var confirmDialogStrings = {
                    text: _this.GetLabel("Dialog_QueueItemRelease_Label_Single"),
                    title: _this.GetLabel("Dialog_QueueItemRelease_Title"),
                    confirmButtonLabel: _this.GetLabel("Button_Label_Release"),
                    cancelButtonLabel: _this.GetLabel("Button_Label_Cancel")
                };
                if (records.length == 1) {
                    confirmDialogStrings.subtitle = _this.GetLabel("Dialog_QueueItemReleaseNew_Description_Single");
                }
                else {
                    var labelText = _this.GetLabel("Dialog_QueueItemReleaseNew_Description_Plural");
                    confirmDialogStrings.subtitle = ClientUtility.StringUtil.format(labelText, records.length);
                }
                Xrm.Navigation.openConfirmDialog(confirmDialogStrings, options).then(function (result) { return _this.PerformReleaseAction(result, gridControl, records.map(function (etn) {
                    return { TypeName: AppCommon.EntityNames.QueueItem, Id: etn["Id"], Name: etn["Name"] };
                })); });
            };
            /**
             * This callback function that releases the queueitem to the queue.
             * @param returnValue callback return value
             * @param gridControl The grid control
             * @param records The records to be released from the queue.
             */
            this.PerformReleaseAction = function (returnValue, gridControl, records) {
                /// when user clicks Cancel then for web client returnValue.confirmed is undefined. For uci returnValue.confirmed is false
                if (!returnValue || !returnValue.confirmed) {
                    return;
                }
                if (ClientUtility.ClientUtil.isMobileOffline()) {
                    ClientUtility.DialogUtil.showMoCAOfflineError();
                    return;
                }
                ClientUtility.DialogUtil.showProgressMessage();
                var requests = records.map(function (etn) {
                    var entityRef = {
                        id: ClientUtility.Guid.create(etn.Id),
                        entityType: etn.TypeName
                    };
                    var req = new ODataContract.ReleaseToQueueRequest(entityRef);
                    return req;
                });
                Xrm.WebApi.online.executeMultiple(requests).then(function (successMessage) {
                    ClientUtility.DialogUtil.hideProgressMessage();
                    if (gridControl) {
                        gridControl.refresh();
                    }
                }, ClientUtility.DialogUtil.actionFailedCallbackForMoca);
            };
        }
        return QueueItemReleaseLibrary;
    }());
    AppCommon.QueueItemReleaseLibrary = QueueItemReleaseLibrary;
})(AppCommon || (AppCommon = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="./QueueItemUtils.ts" />
/// <reference path="../ClientCommon/EntityNames.ts" />
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../../TypeDefinitions/AppCommon/Localization/ResourceStringProvider.d.ts" />
var AppCommon;
(function (AppCommon) {
    /**
     * Handles the "Release" functionality from queue items grid, opening the dialog and handling its events.
     */
    var QueueItemRemoveLibrary = (function () {
        function QueueItemRemoveLibrary() {
            var _this = this;
            /**
             * Resolves a label ID to a string. This is a workaround for the case where the framework does load the ResourceStringProvider
             */
            this.GetLabel = function (labelId) {
                if (AppCommon.ResourceStringProvider) {
                    return AppCommon.ResourceStringProvider.getResourceString(labelId);
                }
                else {
                    return labelId;
                }
            };
            this.OpenQueueItemRemoveDialog = function (gridControl, records, entityTypeCode) {
                if (!ClientUtility.CommandBarActions.isMobileCompanionApp()) {
                    AppCommon.QueueItemUtils.fetchOrSetQueueItemIdToEachRecord(gridControl, records, _this.LaunchQueueItemRemoveDialog);
                }
                else {
                    _this.LaunchQueueItemRemoveDialog(gridControl, records);
                }
            };
            this.LaunchQueueItemRemoveDialog = function (gridControl, records) {
                var options = {
                    width: 450,
                    height: 200,
                    position: 1 /* center */
                };
                var dialogText;
                if (records.length == 1) {
                    dialogText = _this.GetLabel("Dialog_QueueItemRemoveNew_Description_Single");
                }
                else {
                    dialogText = _this.GetLabel("Dialog_QueueItemRemoveNew_Description_Plural");
                    dialogText = ClientUtility.StringUtil.format(dialogText, records.length);
                }
                var confirmDialogStrings = {
                    text: dialogText,
                    title: _this.GetLabel("Dialog_QueueItemRemove_Title"),
                    confirmButtonLabel: _this.GetLabel("Button_Label_Remove"),
                    cancelButtonLabel: _this.GetLabel("Button_Label_Cancel")
                };
                Xrm.Navigation.openConfirmDialog(confirmDialogStrings, options).then(function (result) {
                    if (result.confirmed) {
                        _this.PerformRemoveAction(result, gridControl, records.map(function (etn) {
                            return { TypeName: AppCommon.EntityNames.QueueItem, Id: etn["Id"], Name: etn["Name"] };
                        }));
                    }
                });
            };
            /**
             * This callback function that removes the queueitem from the queue.
             * @param returnValue callback return value
             * @param gridControl The grid control
             * @param records The records to be released from the queue.
             */
            this.PerformRemoveAction = function (returnValue, gridControl, records) {
                if (ClientUtility.ClientUtil.isMobileOffline()) {
                    ClientUtility.DialogUtil.showMoCAOfflineError();
                    return;
                }
                ClientUtility.DialogUtil.showProgressMessage();
                // Ensure records array is unique
                var uniqueRecords = records.filter(function (record, index, self) {
                    return index === self.findIndex(function (t) { return (t.Id === record.Id); });
                });
                var requests = uniqueRecords.map(function (etn) {
                    var entityRef = {
                        id: ClientUtility.Guid.create(etn.Id),
                        entityType: etn.TypeName
                    };
                    var req = new ODataContract.RemoveFromQueueRequest(entityRef);
                    return req;
                });
                if (requests.length > 1) {
                    Xrm.WebApi.online.executeMultiple(requests).then(function (response) {
                        ClientUtility.DialogUtil.hideProgressMessage();
                        response.forEach(function (executeMultipleResponseItem) {
                            if (!executeMultipleResponseItem.ok) {
                                _this.OpenAlertDialogForMultipleError(false);
                                return;
                            }
                        });
                        if (gridControl) {
                            gridControl.refresh();
                        }
                    }, ClientUtility.DialogUtil.actionFailedCallbackForMoca);
                }
                else if (requests.length == 1) {
                    Xrm.WebApi.online.execute(requests[0]).then(function (response) {
                        ClientUtility.DialogUtil.hideProgressMessage();
                        if (gridControl) {
                            gridControl.refresh();
                        }
                    }, ClientUtility.DialogUtil.actionFailedCallbackForMoca);
                }
            };
            this.OpenAlertDialogForMultipleError = function (isQueueitemPick) {
                var alertDialogStrings = { text: undefined };
                alertDialogStrings.text = _this.GetLabel(("Error_Message_Action_MultipleErrorsFound"));
                Xrm.Navigation.openAlertDialog(alertDialogStrings, null).then(function () {
                    if (isQueueitemPick && Xrm.Page.ui) {
                        Xrm.Page.ui.close();
                    }
                });
            };
        }
        return QueueItemRemoveLibrary;
    }());
    AppCommon.QueueItemRemoveLibrary = QueueItemRemoveLibrary;
})(AppCommon || (AppCommon = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../ClientCommon/DialogConstants.ts" />
/// <reference path="../ClientCommon/EntityNames.ts" />
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../../TypeDefinitions/AppCommon/Localization/ResourceStringProvider.d.ts" />
/// <reference path="QueueItemUtils.ts" />
/// <reference path="QueueItemPickLibrary.ts" />
/// <reference path="QueueItemReleaseLibrary.ts" />
/// <reference path="QueueItemRemoveLibrary.ts" />
var AppCommon;
(function (AppCommon) {
    var workedByFilterViewGuid = "{ba048d14-a840-4073-a7e9-f99d53bd15e5}";
    var QueueItemCommandsLibrary = (function () {
        function QueueItemCommandsLibrary() {
            var _this = this;
            this.OpenQueueItemRoutingDialog = function (gridControl, records, entityTypeCode) {
                if (!ClientUtility.CommandBarActions.isMobileCompanionApp()) {
                    AppCommon.QueueItemUtils.fetchOrSetQueueItemIdToEachRecord(gridControl, records, _this.LaunchQueueItemRoutingDialog);
                }
                else {
                    _this.LaunchQueueItemRoutingDialog(gridControl, records);
                }
            };
            this.LaunchQueueItemRoutingDialog = function (gridControl, records) {
                var dialogOptions = {};
                dialogOptions.height = 340;
                dialogOptions.width = 500;
                var dialogParams = {};
                dialogParams[AppCommon.DialogConstants.RecordsParam] = JSON.stringify(records);
                var callbackParams = {};
                Xrm.Navigation.openDialog("RouteQueuedItem", dialogOptions, dialogParams).then(function (context) { return _this.queueItemDialogCloseCallback(gridControl, context); });
            };
            this.OpenFormForItemInQueue = function (records, entityTypeCode, gridControl) {
                if (!records || !records.length) {
                    return;
                }
                var queueItemId;
                var recordSetQueryKey = gridControl && gridControl.getRecordSetQueryKey();
                if (ClientUtility.ClientUtil.isUCI()) {
                    if (Xrm.Internal.isFeatureEnabled("QueueItemUCINavigation")) {
                        var selectedRows = gridControl && gridControl.getGrid() && gridControl.getGrid().getSelectedRows();
                        var selectedRowData = selectedRows && selectedRows.get(0) && selectedRows.get(0).getData();
                        var selectedEntity = selectedRowData && selectedRowData.getEntity();
                        var selectedEntityAtrributes = selectedEntity && selectedEntity.attributes;
                        var objectIdAttribute = selectedEntityAtrributes && selectedEntityAtrributes.getByName("objectid");
                        var objectId = objectIdAttribute && objectIdAttribute.getValue();
                        if (objectId) {
                            _this.OpenForm(objectId[0].id, objectId[0].entityType, recordSetQueryKey);
                            return;
                        }
                    }
                    queueItemId = records[0].Id;
                }
                else {
                    if (gridControl) {
                        var webGridControl = gridControl, gridRows = webGridControl.GetRecordsFromInnerGrid(true), currentRow = gridRows[0], rowElement = currentRow[3]; // in web client grid control, the row element will be availble in the 4th element of array
                        if (rowElement) {
                            queueItemId = rowElement.getAttribute("queueitemid");
                        }
                        else {
                            queueItemId = records[0].Id;
                        }
                    }
                    else {
                        queueItemId = records[0].Id;
                    }
                }
                var selector = "?$select=_objectid_value,objecttypecode";
                Xrm.WebApi.retrieveRecord(AppCommon.EntityNames.QueueItem, queueItemId, selector).then(function (entity) {
                    var entityId = entity["_objectid_value"];
                    var entityName = entity["_objectid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                    _this.OpenForm(entityId, entityName, recordSetQueryKey);
                }, function (reason) {
                    // If we can't retrieve the entity for some reason, revert to open the queue item form.
                    _this.OpenForm(queueItemId, AppCommon.EntityNames.QueueItem, recordSetQueryKey);
                });
            };
            this.OpenQueueItemDetailsForm = function (gridControl, records) {
                if (!(records) || !(records.length > 0) || records.length !== 1) {
                    return;
                }
                var queueItemId;
                var isUCI = ClientUtility.ClientUtil.isUCI();
                if (isUCI) {
                    queueItemId = records[0].Id;
                }
                else {
                    var webGridControl = gridControl, gridRows = webGridControl.GetRecordsFromInnerGrid(true), currentRow = gridRows[0], rowElement = currentRow[3]; // in web client grid control, the row element will be availble in the 4th element of array
                    if (rowElement) {
                        queueItemId = rowElement.getAttribute("queueitemid");
                    }
                }
                if (isUCI && Xrm.Internal.isFeatureEnabled('OpenQueueItemDetailsInlineInUCI') && Xrm.Internal.isFeatureEnabled('October2020Update')) {
                    var mainFormType = 2;
                    var pageInput = { pageType: "entityrecord", entityId: queueItemId, entityName: AppCommon.EntityNames.QueueItem, formType: mainFormType };
                    var options = {
                        entityName: AppCommon.EntityNames.QueueItem,
                        showDialog: true,
                        hideDialogHeader: true,
                        target: 2,
                        width: 600,
                        height: 600,
                        position: 2 /* right */
                    };
                    Xrm.Navigation.navigateTo(pageInput, options).then(function (_) { return gridControl && gridControl.refresh && gridControl.refresh(); });
                }
                else {
                    var formOptions = {
                        entityId: queueItemId,
                        entityName: AppCommon.EntityNames.QueueItem,
                        openInNewWindow: true
                    };
                    Xrm.Navigation.openForm(formOptions);
                }
            };
            this.QueueItemDetailsAsMfdEnabled = function () {
                return ClientUtility.ClientUtil.isUCI() && Xrm.Internal.isFeatureEnabled('OpenQueueItemDetailsInlineInUCI') && Xrm.Internal.isFeatureEnabled('October2020Update');
            };
            /** Callback functions */
            this.queueItemDialogRouteClick = function (context) {
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                if (ClientUtility.ClientUtil.isMobileOffline()) {
                    ClientUtility.DialogUtil.showMoCAOfflineError();
                    return;
                }
                ClientUtility.DialogUtil.setLastButtonClicked(AppCommon.DialogConstants.DialogOkId);
                var userSelected = false;
                var routeToSelected = formContext.data.attributes.get(AppCommon.DialogConstants.QueueItemRouteToId);
                var removeQueueItem = false;
                if (routeToSelected.getValue()) {
                    userSelected = true;
                }
                var routeToEntityReference = null;
                if (userSelected) {
                    routeToEntityReference = _this.getRouteToUserEntityReference(formContext);
                    var removeQueueItemChecked = formContext.data.attributes.get(AppCommon.DialogConstants.QueueItemRemoveId);
                    if (removeQueueItemChecked.getValue()) {
                        removeQueueItem = true;
                    }
                }
                else {
                    routeToEntityReference = _this.getRouteToQueueEntityReference(formContext);
                }
                var recordsAttribute = formContext.data.attributes.get(AppCommon.DialogConstants.RecordsParam);
                if (recordsAttribute) {
                    var recordsJson = recordsAttribute.getValue();
                    var records = JSON.parse(recordsJson);
                    _this.sendBatchRouteRequest(routeToEntityReference, records, removeQueueItem, function () {
                        Xrm.Page.ui.close();
                    });
                }
            };
            this.queueItemDialogRouteToChange = function (context) {
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                var routeToSelected = formContext.data.attributes.get(AppCommon.DialogConstants.QueueItemRouteToId), removeQueueItemChecked = formContext.getControl(AppCommon.DialogConstants.QueueItemRemoveId), crmQueueLookup = formContext.getControl(AppCommon.DialogConstants.QueueItemQueueLookupId), crmUserLookup = formContext.getControl(AppCommon.DialogConstants.QueueItemUserLookupId), queueAssignedToQueueText = formContext.getControl(AppCommon.DialogConstants.QueueItemAssignedToQueueText), queueAssignedToUserText = formContext.getControl(AppCommon.DialogConstants.QueueItemAssignedToUserText), queueItemRemovalDenialText = formContext.getControl(AppCommon.DialogConstants.QueueItemRemovalDenialText);
                if (routeToSelected.getValue()) {
                    !ClientUtility.DataUtil.isNullOrUndefined(crmQueueLookup) && crmQueueLookup.setVisible(false);
                    !ClientUtility.DataUtil.isNullOrUndefined(queueAssignedToQueueText) && queueAssignedToQueueText.setVisible(false);
                    !ClientUtility.DataUtil.isNullOrUndefined(queueAssignedToUserText) && queueAssignedToUserText.setVisible(true);
                    AppCommon.QueueItemUtils.areQueueItemsRoutedViaUnifiedRouting(formContext, AppCommon.DialogConstants.RecordsParam).then(function (areQueueItemsRoutedViaUnifiedRouting) {
                        if (areQueueItemsRoutedViaUnifiedRouting) {
                            !ClientUtility.DataUtil.isNullOrUndefined(queueItemRemovalDenialText) && queueItemRemovalDenialText.setVisible(true);
                            if (!ClientUtility.DataUtil.isNullOrUndefined(removeQueueItemChecked)) {
                                formContext.data.attributes.get(AppCommon.DialogConstants.QueueItemRemoveId).setValue(false);
                                removeQueueItemChecked.setDisabled(true);
                                removeQueueItemChecked.setVisible(true);
                            }
                            !ClientUtility.DataUtil.isNullOrUndefined(crmUserLookup) && crmUserLookup.setVisible(true);
                        }
                        else {
                            _this.setControlsForSelectingUserAndTeam(queueItemRemovalDenialText, removeQueueItemChecked, crmUserLookup);
                        }
                    }, function (_error) {
                        _this.setControlsForSelectingUserAndTeam(queueItemRemovalDenialText, removeQueueItemChecked, crmUserLookup);
                    });
                }
                else {
                    !ClientUtility.DataUtil.isNullOrUndefined(queueAssignedToUserText) && queueAssignedToUserText.setVisible(false);
                    !ClientUtility.DataUtil.isNullOrUndefined(queueItemRemovalDenialText) && queueItemRemovalDenialText.setVisible(false);
                    !ClientUtility.DataUtil.isNullOrUndefined(removeQueueItemChecked) && removeQueueItemChecked.setVisible(false);
                    !ClientUtility.DataUtil.isNullOrUndefined(crmUserLookup) && crmUserLookup.setVisible(false);
                    !ClientUtility.DataUtil.isNullOrUndefined(queueAssignedToQueueText) && queueAssignedToQueueText.setVisible(true);
                    !ClientUtility.DataUtil.isNullOrUndefined(crmQueueLookup) && crmQueueLookup.setVisible(true);
                }
            };
            this.queueItemDialogRouteOnLoad = function (context) {
                var records = [];
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                var routeToSelected = formContext.ui.controls.get(AppCommon.DialogConstants.QueueItemRouteToId);
                if (routeToSelected) {
                    routeToSelected.setFocus();
                }
                var recordsAttribute = formContext.data.attributes.get(AppCommon.DialogConstants.RecordsParam);
                if (recordsAttribute) {
                    var recordsJson = recordsAttribute.getValue();
                    records = JSON.parse(recordsJson);
                    var labelControl = formContext.ui.controls.get(AppCommon.DialogConstants.QueueItemRouteHeaderText);
                    if (labelControl && AppCommon.ResourceStringProvider) {
                        var labelText = "";
                        if (records.length === 1) {
                            labelText = AppCommon.ResourceStringProvider.getResourceString("Dialog_QueueItemRoute_Description_Single");
                        }
                        else {
                            labelText = AppCommon.ResourceStringProvider.getResourceString("Dialog_QueueItemRoute_Description_Plural");
                            labelText = ClientUtility.StringUtil.format(labelText, records.length);
                        }
                        if (labelText) {
                            labelControl.setLabel(labelText);
                        }
                    }
                }
                var queueItemRemovalDenialText = formContext.ui.controls.get(AppCommon.DialogConstants.QueueItemRemovalDenialText);
                if (queueItemRemovalDenialText) {
                    queueItemRemovalDenialText.setVisible(false);
                }
                var removeQueueItemChecked = formContext.ui.controls.get(AppCommon.DialogConstants.QueueItemRemoveId);
                if (removeQueueItemChecked) {
                    removeQueueItemChecked.setVisible(false);
                }
                var queueAssignedToUserText = formContext.ui.controls.get(AppCommon.DialogConstants.QueueItemAssignedToUserText);
                if (queueAssignedToUserText) {
                    queueAssignedToUserText.setVisible(false);
                }
                var crmUserLookup = formContext.ui.controls.get(AppCommon.DialogConstants.QueueItemUserLookupId);
                if (crmUserLookup) {
                    crmUserLookup.setVisible(false);
                    if (records && records.length == 1) {
                        _this.addCustomViewForQueueItem(formContext, crmUserLookup);
                    }
                }
                if (ClientUtility.ClientUtil.isUCI()) {
                    var queueLookupViewSelection = Xrm.Utility.getGlobalContext().getCurrentAppSetting(AppCommon.DialogConstants.Msdyn_RouteToQueueItemDialogViewSelection);
                    if (queueLookupViewSelection != null && queueLookupViewSelection != undefined) {
                        var routeToQueueLookUpControl = formContext.getControl(AppCommon.DialogConstants.QueueItemQueueLookupId);
                        routeToQueueLookUpControl && routeToQueueLookUpControl.setDefaultView(queueLookupViewSelection);
                    }
                }
            };
            this.closeMainFormDialog = function () {
                Xrm.Page.ui.close();
            };
            this.onLoadQueueItemDetailsForm = function (context) {
                var isAddToQueueDialogEnhancementsEnabled = ClientUtility.ClientUtil.isUCI() && Xrm && Xrm.Internal && Xrm.Internal.isFeatureEnabled("EnableAddToQueueDialogEnhancements");
                if (isAddToQueueDialogEnhancementsEnabled == true) {
                    var formContext_1 = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                    var queueLookup = formContext_1.getControl(AppCommon.DialogConstants.QueueLookup);
                    if (queueLookup && queueLookup.getAttribute().getValue() && queueLookup.getAttribute().getValue().length) {
                        var queueid_1 = queueLookup.getAttribute().getValue()[0].id;
                        Xrm.WebApi.retrieveRecord(AppCommon.EntityNames.Queue, queueid_1, "?$select=queueviewtype").then(function (response) {
                            // Filter worked by field to show only members of private queue
                            if (response && response.queueviewtype === 1) {
                                var fetchXml = String.format(AppCommon.DialogConstants.QueueItem_FetchXml, queueid_1);
                                var customViewName = AppCommon.ResourceStringProvider.getResourceString(AppCommon.DialogConstants.PrivateQueueViewName);
                                var workedByLookup = formContext_1.ui.controls.get(AppCommon.DialogConstants.WorkedByLookup);
                                workedByLookup && workedByLookup.addCustomView(workedByFilterViewGuid, AppCommon.DialogConstants.EntitySystemUser, customViewName, fetchXml, AppCommon.DialogConstants.QueueItem_LayoutXml, true);
                            }
                        });
                    }
                }
            };
            this.setControlsForSelectingUserAndTeam = function (queueItemRemovalDenialText, removeQueueItemChecked, crmUserLookup) {
                !ClientUtility.DataUtil.isNullOrUndefined(queueItemRemovalDenialText) && queueItemRemovalDenialText.setVisible(false);
                !ClientUtility.DataUtil.isNullOrUndefined(removeQueueItemChecked) && removeQueueItemChecked.setDisabled(false);
                !ClientUtility.DataUtil.isNullOrUndefined(removeQueueItemChecked) && removeQueueItemChecked.setVisible(true);
                !ClientUtility.DataUtil.isNullOrUndefined(crmUserLookup) && crmUserLookup.setVisible(true);
            };
            this.queueItemDialogRouteLookupChange = function (context) {
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                var routeToSelected = formContext.data.attributes.get(AppCommon.DialogConstants.QueueItemRouteToId);
                var lookup = null;
                if (routeToSelected.getValue()) {
                    lookup = formContext.data.attributes.get(AppCommon.DialogConstants.QueueItemUserLookupId);
                }
                else {
                    lookup = formContext.data.attributes.get(AppCommon.DialogConstants.QueueItemQueueLookupId);
                }
                if (lookup) {
                    var selectedItems = lookup.getValue(), dialogOk = formContext.getControl(AppCommon.DialogConstants.DialogOkId);
                    if (!dialogOk) {
                        return;
                    }
                    if (!selectedItems || !selectedItems.length) {
                        dialogOk.setDisabled(true);
                    }
                    else {
                        dialogOk.setDisabled(false);
                    }
                }
            };
            this.sendBatchRouteRequest = function (routeToEntityReference, records, removeQueueItem, completionCallback) {
                // Ensure records array is unique
                var uniqueRecords = records.filter(function (record, index, self) {
                    return index === self.findIndex(function (t) { return (t.Id === record.Id); });
                });
                ClientUtility.DialogUtil.showProgressMessage();
                var routeRequests = uniqueRecords.map(function (etn) {
                    var entityRef = {
                        id: ClientUtility.Guid.create(etn.Id),
                        entityType: etn.TypeName
                    };
                    return new ODataContract.RouteToRequest(routeToEntityReference, entityRef);
                });
                Xrm.WebApi.online.executeMultiple(routeRequests).then(function (response) {
                    if (response.length !== uniqueRecords.length) {
                        AppCommon.QueueItemUtils.OpenAlertDialogForMultipleError(false);
                        completionCallback();
                        ClientUtility.DialogUtil.hideProgressMessage();
                        return;
                    }
                    if (removeQueueItem) {
                        var trimmedRecords = records.filter(function (item, index) {
                            return response[index].ok === true;
                        });
                        var removeRequests = trimmedRecords.map(function (etn) {
                            var entityRef = {
                                id: ClientUtility.Guid.create(etn.Id),
                                entityType: etn.TypeName
                            };
                            return new ODataContract.RemoveFromQueueRequest(entityRef);
                        });
                        Xrm.WebApi.online.executeMultiple(removeRequests).then(function (response) {
                            if (response.some(function (executeMultipleResponseItem) { return !executeMultipleResponseItem.ok; })) {
                                AppCommon.QueueItemUtils.OpenAlertDialogForMultipleError(false);
                            }
                            completionCallback();
                            ClientUtility.DialogUtil.hideProgressMessage();
                        }, ClientUtility.DialogUtil.actionFailedCallbackForMoca);
                    }
                    else {
                        completionCallback();
                        ClientUtility.DialogUtil.hideProgressMessage();
                    }
                }, ClientUtility.DialogUtil.actionFailedCallbackForMoca);
            };
            /** Prepare the RouteTo entity reference for user/team. */
            this.getRouteToUserEntityReference = function (formContext) {
                var routeToEntityReference = null;
                var userLookup = formContext.data.attributes.get(AppCommon.DialogConstants.QueueItemUserLookupId);
                if (userLookup) {
                    var selectedItems = userLookup.getValue();
                    var workerId = selectedItems[0].id;
                    var workerType = selectedItems[0].entityType;
                    if (workerId && workerType) {
                        routeToEntityReference =
                            {
                                id: workerId,
                                entityType: workerType
                            };
                    }
                }
                return routeToEntityReference;
            };
            /** Prepare the RouteTo entity reference for a queue. */
            this.getRouteToQueueEntityReference = function (formContext) {
                var routeToEntityReference = null;
                var queueLookup = formContext.data.attributes.get(AppCommon.DialogConstants.QueueItemQueueLookupId);
                if (queueLookup) {
                    var selectedItems = queueLookup.getValue();
                    var queueId = selectedItems[0].id;
                    routeToEntityReference = {
                        entityType: AppCommon.EntityNames.Queue,
                        id: queueId
                    };
                }
                return routeToEntityReference;
            };
            this.queueItemDialogCloseCallback = function (_gridControl, callbackParams) {
                var constants = AppCommon.DialogConstants;
                if (_gridControl && _gridControl.refresh && callbackParams.parameters[constants.LastButtonClickedParam] && callbackParams.parameters[constants.LastButtonClickedParam] === constants.DialogOkId) {
                    _gridControl.refresh();
                }
            };
            this.addCustomViewForQueueItem = function (formContext, queueUserLookup) {
                var viewGuid = "{abc5d973-aac3-428e-9e1d-e43478f9ee56}";
                var queueRecord = JSON.parse(formContext.data.attributes.get(AppCommon.DialogConstants.RecordsParam).getValue());
                if (queueRecord.length > 0) {
                    var queueId_1 = queueRecord[0].QueueId;
                    if (queueId_1) {
                        var URLQueueId = queueId_1.replace(/[{}]/g, '');
                        var selector = "?$select=queueviewtype";
                        Xrm.WebApi.online.retrieveRecord(AppCommon.EntityNames.Queue, URLQueueId, selector).then(function (entityData) {
                            if (entityData["queueviewtype"] == 1) {
                                var fetchXml = String.format(AppCommon.DialogConstants.QueueItem_FetchXml, queueId_1);
                                var customViewName = AppCommon.ResourceStringProvider.getResourceString(AppCommon.DialogConstants.PrivateQueueViewName);
                                queueUserLookup.addCustomView(viewGuid, AppCommon.DialogConstants.EntitySystemUser, customViewName, fetchXml, AppCommon.DialogConstants.QueueItem_LayoutXml, true);
                            }
                        }, ClientUtility.DialogUtil.actionFailedCallbackForMoca);
                    }
                }
            };
        }
        QueueItemCommandsLibrary.prototype.OpenForm = function (entityIdParam, entityNameParam, recordSetQueryKey) {
            //Need to pass the name as 'recordSetQueryKey' always as it's been consumed in UC repo. in order to work with Record Set Navigator. Consuming line: https://dynamicscrm.visualstudio.com/OneCRM/_git/CRM.Client.UnifiedClient?path=%2Fsrc%2Ffeatures%2Fclientapi%2Fsrc%2FClientAPI%2FApi%2FXrmNavigation.ts&version=GBmaster
            var entityFormOptions = {
                entityId: entityIdParam,
                entityName: entityNameParam,
                recordSetQueryKey: recordSetQueryKey
            };
            Xrm.Navigation.openForm(entityFormOptions);
        };
        return QueueItemCommandsLibrary;
    }());
    AppCommon.QueueItemCommandBarActions = new QueueItemCommandsLibrary();
    AppCommon.QueueItemPick = new AppCommon.QueueItemPickLibrary();
    AppCommon.QueueItemRelease = new AppCommon.QueueItemReleaseLibrary();
    AppCommon.QueueItemRemove = new AppCommon.QueueItemRemoveLibrary();
})(AppCommon || (AppCommon = {}));
//# sourceMappingURL=QueueItem.js.map