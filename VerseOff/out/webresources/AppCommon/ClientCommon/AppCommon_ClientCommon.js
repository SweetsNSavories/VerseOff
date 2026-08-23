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
var AppCommon;
(function (AppCommon) {
    var EntityTypeCodes;
    (function (EntityTypeCodes) {
        EntityTypeCodes[EntityTypeCodes["Territory"] = 2013] = "Territory";
    })(EntityTypeCodes = AppCommon.EntityTypeCodes || (AppCommon.EntityTypeCodes = {}));
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
///<reference path="EntityNames.ts" />
///<reference path="EntityTypeCodes.ts" />
///<reference path="DialogConstants.ts" /> 
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="../../../TypeDefinitions/AppCommon/Localization/ResourceStringProvider.d.ts" />
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var AppCommon;
(function (AppCommon) {
    var DialogActions = (function () {
        function DialogActions() {
        }
        /**
         * Method to evaluate whether to show share secured button in ribbon
         */
        DialogActions.showShareSecuredFieldsButton = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isSecuredFieldPresent, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, DialogActions.hasSecuredFields()];
                        case 1:
                            isSecuredFieldPresent = _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            isSecuredFieldPresent = false;
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/, isSecuredFieldPresent];
                    }
                });
            });
        };
        /**
         * Method to check whether entity has any secured field
         */
        DialogActions.hasSecuredFields = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isSecured, data, entityName, cacheKey, cachedSecureFields, attributesURL, request;
                return __generator(this, function (_a) {
                    isSecured = false;
                    entityName = Xrm.Page.data.entity.getEntityName();
                    cacheKey = entityName.concat("_", "cachedSecureFields");
                    cachedSecureFields = sessionStorage.getItem(cacheKey);
                    if (!cachedSecureFields) {
                        attributesURL = "/api/data/v9.1/EntityDefinitions(LogicalName='" + entityName + "')/Attributes/Microsoft.Dynamics.CRM.AttributeMetadata?$select=IsSecured&$filter=IsSecured eq true";
                        request = new XMLHttpRequest();
                        request.open("GET", attributesURL);
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                request.onload = function () {
                                    if (request.readyState === 4 && request.status === 200) {
                                        sessionStorage && sessionStorage.setItem(cacheKey, request.responseText);
                                        if (request.responseText) {
                                            data = JSON.parse(request.responseText);
                                            if (data && data.value && data.value.length > 0) {
                                                isSecured = true;
                                            }
                                        }
                                        resolve(isSecured);
                                    }
                                    else {
                                        reject(false);
                                    }
                                };
                                request.onerror = function () {
                                    reject(false);
                                };
                                request.send(null);
                            })];
                    }
                    else {
                        data = JSON.parse(cachedSecureFields);
                        if (data && data.value && data.value.length > 0) {
                            isSecured = true;
                        }
                        return [2 /*return*/, isSecured];
                    }
                    return [2 /*return*/];
                });
            });
        };
        /**
         * Method to Shared Secured Field button in UCi
         */
        //Xrm.Internal.isDisruptiveFeatureEnabled("FCB.EnableGrantPermissionOnUCI") 
        DialogActions.showSecuredFieldButtonInUCI = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isVisible;
                return __generator(this, function (_a) {
                    isVisible = false;
                    if (ClientUtility.ClientUtil.isUCI() && Xrm.Internal.isDisruptiveFeatureEnabled("FCB.EnableGrantPermissionOnUCI", "FCB.October2021Update")) {
                        isVisible = true;
                    }
                    return [2 /*return*/, isVisible];
                });
            });
        };
        /**
         *  Checking whether FCB is enabled or not
         */
        DialogActions.isFcbEnabled = function (fcbName) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, Xrm.Internal.isUci() ? Xrm.Internal.isFeatureEnabled(fcbName) : Xrm.Internal.isFeatureEnabled("FCB." + fcbName)];
                });
            });
        };
        /**
         *  Show web client SLA deprecation notificaiton in calendar if any legacy SLA existed
         */
        DialogActions.showSLAWebClientDeprecationNotification = function (formContext) {
            return __awaiter(this, void 0, void 0, function () {
                var thisPtr;
                return __generator(this, function (_a) {
                    thisPtr = this;
                    Xrm.WebApi.retrieveMultipleRecords("sla", "?fetchXml=" + AppCommon.DialogConstants.FETCHXML_ANY_ACTIVE_LEGACY_SLA).then(function success(result) {
                        if (result.entities.length > 0) {
                            var notificationMessage = AppCommon.ResourceStringProvider.getResourceString(AppCommon.DialogConstants.SLA_WebClientDeprecationNotification);
                            notificationMessage = notificationMessage.replace("{0}", "https://go.microsoft.com/fwlink/p/?linkid=2198689");
                            formContext.ui.setFormNotification(notificationMessage, "WARNING", "SLAWebClientDeprecationNotification");
                            thisPtr.openSLAWebClientDeprecationAckDialog();
                        }
                    }, function error(error) {
                        var errMessage = "Failed at showSLAWebClientDeprecationNotification function in CalendarLibrary.";
                        this.actionFailedCallback(errMessage, error);
                    });
                    return [2 /*return*/];
                });
            });
        };
        /**
         * Open SLA web client deprecation acknowledge dialog
         */
        DialogActions.openSLAWebClientDeprecationAckDialog = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isUserHasSystemAdminRole, envVariableSchemaName, envVariableDisplayName, envVariableValue, navigationOptions, pageInput;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.isUserHasSystemAdminRole()];
                        case 1:
                            isUserHasSystemAdminRole = _a.sent();
                            if (!isUserHasSystemAdminRole) return [3 /*break*/, 3];
                            envVariableSchemaName = AppCommon.DialogConstants.SLA_EnvironmentVariableSchemaName;
                            envVariableDisplayName = AppCommon.DialogConstants.SLA_EnvironmentVariableDisplayName;
                            return [4 /*yield*/, this.getEnvironmentVariableValue(envVariableSchemaName)];
                        case 2:
                            envVariableValue = _a.sent();
                            if (envVariableValue != AppCommon.SLAWebClientDeprecationState.Acknowledged) {
                                navigationOptions = {
                                    target: 2,
                                    position: 1,
                                    width: { value: 600, unit: "px" },
                                    height: { value: 200, unit: "px" }
                                };
                                pageInput = {
                                    pageType: "webresource",
                                    webresourceName: "AppCommon/Calendar/msdyn_SLAWebClientDeprecationAckDialog.html",
                                };
                                if (envVariableValue != AppCommon.SLAWebClientDeprecationState.Canceled && envVariableValue != AppCommon.SLAWebClientDeprecationState.YetToAcknowledge) {
                                    this.setEnvironmentVariableValue(envVariableSchemaName, envVariableDisplayName, AppCommon.SLAWebClientDeprecationState.YetToAcknowledge.toString());
                                }
                                Xrm.Navigation.navigateTo(pageInput, navigationOptions);
                            }
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * isUserHasSystemAdminRole
         */
        DialogActions.isUserHasSystemAdminRole = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isAdminUser_1, userSettings, fetchXml, exception_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            isAdminUser_1 = false;
                            userSettings = Xrm.Utility.getGlobalContext().userSettings;
                            fetchXml = AppCommon.DialogConstants.FETCHXML_USER_ROLE_TEMPLATE_ID.replace(/\{0}/g, userSettings.userId);
                            fetchXml = fetchXml.replace(/[\t\n]/gm, "");
                            return [4 /*yield*/, Xrm.WebApi.retrieveMultipleRecords("role", "?fetchXml=" + fetchXml).then(function success(result) {
                                    if (result.entities.length > 0) {
                                        if (!!result.entities.find(function (entity) { return entity._roletemplateid_value === AppCommon.DialogConstants.SysAdminRoleTemplateId || entity._roletemplateid_value === AppCommon.DialogConstants.SysAdminRoleTemplateId.toLowerCase(); })) {
                                            isAdminUser_1 = true;
                                        }
                                    }
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, isAdminUser_1];
                        case 2:
                            exception_1 = _a.sent();
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Getting environment variable value
         */
        DialogActions.getEnvironmentVariableValue = function (schemaName) {
            return __awaiter(this, void 0, void 0, function () {
                var envVaribleValue, envVaribaleDefinition, envVaribleDefinitionValues;
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
                                envVaribleDefinitionValues = envVaribaleDefinition.entities[0];
                                // Use the default value only if no related values
                                envVaribleValue = envVaribleDefinitionValues.defaultvalue;
                                // Get the related value if provided
                                if (envVaribleDefinitionValues.environmentvariabledefinition_environmentvariablevalue.length > 0) {
                                    envVaribleValue = envVaribleDefinitionValues.environmentvariabledefinition_environmentvariablevalue[0].value;
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
        DialogActions.setEnvironmentVariableValue = function (schemaName, displayName, value) {
            return __awaiter(this, void 0, void 0, function () {
                var envVariableDefinition, envVariableDefinitionValues, definitionId, valueId, attributes, attributes, envVarDefResponse, envVarValAttributes;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Xrm.WebApi.retrieveMultipleRecords("environmentvariabledefinition", "?$top=1" +
                                "&$select=environmentvariabledefinitionid" +
                                "&$expand=environmentvariabledefinition_environmentvariablevalue($select=environmentvariablevalueid)" +
                                ("&$filter=schemaname eq '" + schemaName + "'"))];
                        case 1:
                            envVariableDefinition = _a.sent();
                            if (!(envVariableDefinition && envVariableDefinition.entities && envVariableDefinition.entities.length > 0)) return [3 /*break*/, 2];
                            envVariableDefinitionValues = envVariableDefinition.entities[0];
                            definitionId = envVariableDefinitionValues.environmentvariabledefinitionid;
                            if (envVariableDefinitionValues.environmentvariabledefinition_environmentvariablevalue.length > 0) {
                                valueId = envVariableDefinitionValues.environmentvariabledefinition_environmentvariablevalue[0].environmentvariablevalueid;
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
        return DialogActions;
    }());
    /**
     * Method to close the Dialog
     * @param context form context
     */
    DialogActions.CloseDialog = function (context) {
        var formContext;
        if (context == null || context == undefined) {
            formContext = Xrm.Page;
        }
        else {
            formContext = context.getFormContext();
        }
        formContext.ui.close();
    };
    AppCommon.DialogActions = DialogActions;
})(AppCommon || (AppCommon = {}));
