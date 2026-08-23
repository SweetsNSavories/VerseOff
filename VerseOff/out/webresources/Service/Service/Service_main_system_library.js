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
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    'use strict';
    /* tslint:disable:crm-force-fields-private */
    var SaveServiceTreeDataContract = (function () {
        function SaveServiceTreeDataContract(parameters) {
            this.RootNodeId = parameters.RootNodeId || '';
            this.ResourceRuleList = parameters.ResourceRuleList || null;
        }
        SaveServiceTreeDataContract.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {
                    "RootNodeId": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "ResourceRuleList": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                },
                operationType: 0,
                operationName: "_SaveServiceTreeData"
            };
        };
        return SaveServiceTreeDataContract;
    }());
    ODataContract.SaveServiceTreeDataContract = SaveServiceTreeDataContract;
})(ODataContract || (ODataContract = {}));
/**
*@license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../ServiceClientCommon/EntityNames.ts" />
/// <reference path="../../ServiceClientCommon/Service_ClientCommon.ts" />
/// <reference path="../../../../../TypeDefinitions/Service/Localization/Script/ResourceStringProvider.d.ts" />
/// <reference path="../../ServiceClientCommon/DataContracts/Action/SaveServiceTreeDataContract.ts" />
var CrmService;
(function (CrmService) {
    'use strict';
    var ServiceConfigControlLibraryWebResource = (function () {
        function ServiceConfigControlLibraryWebResource() {
            this.on_loadSelectionRuleDialog = function (context) {
                var formContext = context.getFormContext();
                var selectedNode = formContext.data.attributes.get("selected_node").getValue();
                var showSelectionSite = formContext.data.attributes.get('show_selection_site').getValue();
                var dialogLabel = formContext.data.attributes.get('dialog_label').getValue();
                var isEditOperation = formContext.data.attributes.get('is_edit_operation').getValue();
                var formData = {
                    quantityReq: selectedNode.quantityReq,
                    description: selectedNode.description,
                    selectionSite: selectedNode.selectionSite,
                    selectionCriteria: selectedNode.selectionCriteria,
                    capacityReq: selectedNode.capacityReq,
                };
                if (isEditOperation) {
                    formContext.getControl('lbl_header').setLabel(dialogLabel);
                    formContext.getControl('quantity_req_id').getAttribute().setValue(formData.quantityReq);
                    formContext.getControl('Selectionrule_description').getAttribute().setValue(formData.description);
                    formContext.getControl('selection_site').getAttribute().setValue(formData.selectionSite);
                    formContext.getControl('selection_criteria').getAttribute().setValue(formData.selectionCriteria);
                    formContext.getControl('capacity_req').getAttribute().setValue(formData.capacityReq);
                    formContext.getControl('selection_site').setVisible(showSelectionSite);
                }
                else {
                    formContext.getControl('lbl_header').setLabel(dialogLabel);
                    formContext.getControl('quantity_req_id').getAttribute().setValue(1); // default value
                    formContext.getControl('capacity_req').getAttribute().setValue(1);
                    formContext.getControl('selection_site').setVisible(false);
                }
            };
            this.save_selectionRule = function (context) {
                var formContext = context.getFormContext();
                formContext.data.attributes.get("last_button_clicked").setValue("ok_id");
                Xrm.Page.ui.close();
            };
            this.cancel_dialog = function (context) {
                var formContext = context.getFormContext();
                formContext.data.attributes.get("last_button_clicked").setValue("cancel_id");
                Xrm.Page.ui.close();
            };
            this.on_loadSaveResourceSelectionDialog = function (context) {
                var formContext = context.getFormContext();
                formContext.getControl('resource_group_name').setVisible(false);
            };
            this.on_saveResourceSelectionDialogSave = function (context) {
                var formContext = context.getFormContext();
                formContext.data.attributes.get("last_button_clicked").setValue("ok_id");
                Xrm.Page.ui.close();
            };
            this.on_saveSelectionOptionValueChange = function (context) {
                var formContext = context.getFormContext();
                if (formContext && formContext.getControl('save_selection')) {
                    var isSaveSelectionTrue = formContext.getControl('save_selection').getAttribute().getValue();
                    formContext.getControl('resource_group_name').setVisible(isSaveSelectionTrue);
                    var resourceGroupName = formContext.getControl('resource_group_name').getAttribute().getValue();
                    if (isSaveSelectionTrue == true && (resourceGroupName == null || resourceGroupName.length == 0))
                        formContext.getControl('ok_id').setDisabled(true);
                    else
                        formContext.getControl('ok_id').setDisabled(false);
                }
            };
            this.on_resourceGroupNameInputChange = function (context) {
                var formContext = context.getFormContext();
                if (formContext && formContext.getControl('resource_group_name')) {
                    var resourceGroupName = formContext.getControl('resource_group_name').getAttribute().getValue();
                    if (resourceGroupName != null && (resourceGroupName.trim()).length > 0)
                        formContext.getControl('ok_id').setDisabled(false);
                    else
                        formContext.getControl('ok_id').setDisabled(true);
                }
            };
        }
        return ServiceConfigControlLibraryWebResource;
    }());
    CrmService.ServiceConfigControlLibraryWebResource = ServiceConfigControlLibraryWebResource;
    var ServiceLegacyLibrary = (function () {
        function ServiceLegacyLibrary() {
            var serviceMainSystemLibraryWebResource = new ServiceMainSystemLibraryWebResource();
            var ServiceLegacyCommandBarActions = new CrmService.ServiceLegacyCommandBarActions();
            var serviceConfigControlLibraryWebResource = new ServiceConfigControlLibraryWebResource();
            var global = window;
            var mscrm = global.Mscrm;
            mscrm.dialog_onLoad = serviceConfigControlLibraryWebResource.on_loadSelectionRuleDialog;
            mscrm.dialog_saveSelectionRule = serviceConfigControlLibraryWebResource.save_selectionRule;
            mscrm.dialog_cancel = serviceConfigControlLibraryWebResource.cancel_dialog;
            mscrm.on_loadSaveResourceSelection = serviceConfigControlLibraryWebResource.on_loadSaveResourceSelectionDialog;
            mscrm.on_saveResourceSelectionDialogSave = serviceConfigControlLibraryWebResource.on_saveResourceSelectionDialogSave;
            mscrm.saveSelection_valueChange = serviceConfigControlLibraryWebResource.on_saveSelectionOptionValueChange;
            mscrm.resourceGroupName_inputChange = serviceConfigControlLibraryWebResource.on_resourceGroupNameInputChange;
            mscrm.Form_onload = serviceMainSystemLibraryWebResource.Form_onload;
            mscrm.Form_onsave = serviceMainSystemLibraryWebResource.Form_onsave;
        }
        return ServiceLegacyLibrary;
    }());
    CrmService.ServiceLegacyLibrary = ServiceLegacyLibrary;
    var ServiceMainSystemLibraryWebResource = (function () {
        function ServiceMainSystemLibraryWebResource() {
            var _this = this;
            this.Form_onload = function () {
                if (Xrm.Page.context.client.getClientState() !== Xrm.Constants.ClientStates.online) {
                    var requiredResourcesTab = Xrm.Page.ui.tabs.get("required resources");
                    !ClientUtility.DataUtil.isNull(requiredResourcesTab) && requiredResourcesTab.setVisible(false);
                }
                if (!ClientUtility.ClientUtil.isUCI()) {
                    Xrm.Page.ui.tabs.get("required_resources_uci").setVisible(false);
                    var general = Xrm.Page.ui.tabs.get("general");
                    if (general && general.sections.get("scheduling_uci")) {
                        general.sections.get("scheduling_uci").setVisible(false);
                    }
                }
                // Make resourcespecid, duration, granularity, and anchoroffset as optional; their values will be set on save using values from aspx 
                var resourcespecidAttribute = Xrm.Page.getAttribute("resourcespecid");
                if (!ClientUtility.DataUtil.isNull(resourcespecidAttribute)) {
                    resourcespecidAttribute.setRequiredLevel("none");
                }
                var durationAttribute = Xrm.Page.getAttribute("duration");
                if (!ClientUtility.DataUtil.isNull(durationAttribute)) {
                    durationAttribute.setRequiredLevel("none");
                }
                var granularityAttribute = Xrm.Page.getAttribute("granularity");
                if (!ClientUtility.DataUtil.isNull(granularityAttribute)) {
                    granularityAttribute.setRequiredLevel("none");
                }
                var anchoroffsetAttribute = Xrm.Page.getAttribute("anchoroffset");
                if (!ClientUtility.DataUtil.isNull(anchoroffsetAttribute)) {
                    anchoroffsetAttribute.setRequiredLevel("none");
                }
                // For disabling the controls in the aspx
                var formType = Xrm.Page.ui.getFormType();
                var readOnly = "1";
                if (formType == 1 /*Xrm.FormType.create*/ || formType == 2 /*Xrm.FormType.update*/) {
                    readOnly = "0";
                }
                var resourcespecid = null;
                // Set parameters for required resources aspx
                var ruleTreeIFrameControl = Xrm.Page.getControl("IFRAME_RuleTree");
                if (!ClientUtility.DataUtil.isNull(ruleTreeIFrameControl) && !ClientUtility.ClientUtil.isUCI()) {
                    var ruleTreeUrl = Mscrm.CrmUri.create("/SM/ResourceSpecs/edit.aspx");
                    var resourcespecids = null;
                    if (!ClientUtility.DataUtil.isNull(resourcespecidAttribute))
                        resourcespecids = resourcespecidAttribute.getValue();
                    if (!ClientUtility.DataUtil.isNull(resourcespecids))
                        resourcespecid = resourcespecids[0];
                    if (!ClientUtility.DataUtil.isNull(resourcespecid))
                        ruleTreeUrl.get_query()["resourceSpecId"] = resourcespecid.id;
                    ruleTreeUrl.get_query()["readonly"] = readOnly;
                    ruleTreeIFrameControl.setSrc(ruleTreeUrl.toString());
                }
                // Set parameters for scheduling resources aspx
                var schedulingIFrameControl = Xrm.Page.getControl("IFRAME_Scheduling");
                if (!ClientUtility.DataUtil.isNull(schedulingIFrameControl) && !ClientUtility.ClientUtil.isUCI()) {
                    var schedulingUrl = Mscrm.CrmUri.create("/SM/services/scheduling.aspx");
                    var durationValue = null;
                    if (!ClientUtility.DataUtil.isNull(durationAttribute))
                        durationValue = durationAttribute.getValue();
                    if (!ClientUtility.DataUtil.isNull(durationValue)) {
                        schedulingUrl.get_query()["paramduration"] = durationValue;
                    }
                    var granularityValue = null;
                    if (!ClientUtility.DataUtil.isNull(granularityAttribute))
                        granularityValue = granularityAttribute.getValue();
                    if (!ClientUtility.DataUtil.isNull(granularityValue)) {
                        schedulingUrl.get_query()["paramgranularity"] = parseInt(granularityValue.replace("FREQ=MINUTELY;INTERVAL=", "").replace(";", ""), 10);
                    }
                    var anchoroffsetValue = null;
                    if (!ClientUtility.DataUtil.isNull(anchoroffsetAttribute))
                        anchoroffsetValue = anchoroffsetAttribute.getValue();
                    if (!ClientUtility.DataUtil.isNull(anchoroffsetValue)) {
                        schedulingUrl.get_query()["paramanchoroffset"] = anchoroffsetValue;
                    }
                    schedulingUrl.get_query()["readonly"] = readOnly;
                    schedulingIFrameControl.setSrc(schedulingUrl.toString());
                }
                if (ClientUtility.ClientUtil.isUCI()) {
                    var that_1 = _this;
                    if (!ClientUtility.DataUtil.isNull(schedulingIFrameControl)) {
                        schedulingIFrameControl.setVisible(false);
                    }
                    CrmService.ClientUtil.Is_CSS_Installed().then(function (response) {
                        if (response == true) {
                            that_1.isCSSInstalled = true;
                        }
                        else {
                            that_1.isCSSInstalled = false;
                            if (ClientUtility.ClientUtil.isUCI()) {
                                if (!ClientUtility.DataUtil.isNull(Xrm.Page.ui.tabs.get("required resources"))) {
                                    Xrm.Page.ui.tabs.get("required resources").setVisible(false);
                                }
                                if (!ClientUtility.DataUtil.isNull(Xrm.Page.ui.tabs.get("required_resources_uci"))) {
                                    Xrm.Page.ui.tabs.get("required_resources_uci").setVisible(true);
                                }
                                if (!ClientUtility.DataUtil.isNull(durationAttribute)) {
                                    if (ClientUtility.DataUtil.isNull(durationAttribute.getValue())) {
                                        durationAttribute.setValue(60);
                                    }
                                }
                                if (!ClientUtility.DataUtil.isNull(granularityAttribute)) {
                                    if (ClientUtility.DataUtil.isNull(granularityAttribute.getValue())) {
                                        granularityAttribute.setValue("FREQ=MINUTELY;INTERVAL=15;");
                                    }
                                }
                                if (!ClientUtility.DataUtil.isNull(anchoroffsetAttribute)) {
                                    if (ClientUtility.DataUtil.isNull(anchoroffsetAttribute.getValue())) {
                                        anchoroffsetAttribute.setValue(480);
                                    }
                                }
                            }
                        }
                    });
                }
                if (formType != 1 /*Xrm.FormType.create*/) {
                    var LEGACY_SCHEDULING_ENGINE = 0;
                    var schedulingEngine = LEGACY_SCHEDULING_ENGINE; // legacy                
                    var ATTR_SCHEDULING_ENGINE = "msdyn_SchedulingEngine";
                    // Get the scheduling engine used by the service
                    if (Xrm.Page.getAttribute(ATTR_SCHEDULING_ENGINE) != null) {
                        schedulingEngine = Xrm.Page.getAttribute(ATTR_SCHEDULING_ENGINE).getValue();
                    }
                    // Get resourcespec id 
                    if (!ClientUtility.DataUtil.isNull(resourcespecidAttribute)) {
                        var resourceSpecids = resourcespecidAttribute.getValue();
                        if (!ClientUtility.DataUtil.isNull(resourceSpecids) && resourceSpecids.length > 0) {
                            resourcespecid = resourceSpecids[0];
                        }
                    }
                    // Validate only for services using legacy engine
                    if (!ClientUtility.DataUtil.isNull(resourcespecid) && schedulingEngine == LEGACY_SCHEDULING_ENGINE) {
                        var id = resourcespecid.id;
                        if (id.startsWith('{')) {
                            id = id.slice(1, -1);
                        }
                        Xrm.WebApi.retrieveRecord(CrmService.EntityNames.ResourceSpec, id, ClientUtility.ODataUtil.getSelectOption(["groupobjectid"]))
                            .then(function (resourcespecresponse) {
                            var groupobjectid = resourcespecresponse["groupobjectid"];
                            if (!ClientUtility.DataUtil.isNull(groupobjectid)) {
                                Xrm.WebApi.retrieveRecord(CrmService.EntityNames.ConstraintBasedGroup, groupobjectid, ClientUtility.ODataUtil.getSelectOption(["constraints"]))
                                    .then(function (resourcegroupresponse) {
                                    var constraints = resourcegroupresponse["constraints"];
                                    if (_this.isConstraintsEmpty(constraints)) {
                                        Xrm.Navigation.openAlertDialog({ text: CrmService.ResourceStringProvider.getResourceString("Resource_Selection_Notification") }, { height: 200, width: 600 });
                                    }
                                }, ClientUtility.ActionFailedHandler.actionFailedCallback);
                            }
                        }, ClientUtility.ActionFailedHandler.actionFailedCallback);
                    }
                }
            };
            this.isConstraintsEmpty = function (constraints) {
                var parser;
                var xmlDoc;
                if (window.DOMParser) {
                    parser = new DOMParser();
                    xmlDoc = parser.parseFromString(constraints, "text/xml");
                }
                if (!ClientUtility.DataUtil.isNull(xmlDoc.getElementsByTagName("Body")[0])
                    && !ClientUtility.DataUtil.isNull(xmlDoc.getElementsByTagName("Body")[0].childNodes[0])) {
                    var value = xmlDoc.getElementsByTagName("Body")[0].childNodes[0].nodeValue;
                    return value === 'false';
                }
                return false;
            };
            this.saveRuleTree = function () {
                return new Promise(function (resolve, reject) {
                    var rootNodeId = Xrm.Page.data.attributes.get("root_node");
                    var rulesList = Xrm.Page.data.attributes.get("rule_map");
                    var serviceId = Xrm.Page.data.entity.getId();
                    //Execute request passing the input parameter of the action
                    var parameters = {};
                    if (rootNodeId == null) {
                        // If service is existing and rule tree not changed, do not call save custom action
                        if (serviceId != null && serviceId.length > 0) {
                            // Root node value is null since rule tree didn't get initialized
                            var resSpecAttribute = Xrm.Page.data.entity.attributes.get("resourcespecid");
                            if (resSpecAttribute != null && resSpecAttribute.getValue() != null) {
                                rootNodeId = resSpecAttribute.getValue()[0].id;
                            }
                            resolve(rootNodeId);
                        }
                        else {
                            // Required parameter, hence only non null value are accepted
                            parameters["RootNodeId"] = "";
                        }
                    }
                    else {
                        parameters["RootNodeId"] = rootNodeId;
                    }
                    parameters["ResourceRuleList"] = JSON.stringify(rulesList);
                    var request = new ODataContract.SaveServiceTreeDataContract(parameters);
                    Xrm.WebApi.online.execute(request).then(function (response) {
                        response.json().then(function (jsonResponse) {
                            resolve(jsonResponse.UpdatedRootNode);
                        });
                    }, function (err) {
                        err.json().then(function (jsonResponse) {
                            var errorDialogOptions = {};
                            errorDialogOptions.message = jsonResponse.error;
                            Xrm.Navigation.openErrorDialog(errorDialogOptions);
                        });
                    });
                });
            };
            this.Form_onsave = function (executionContext) { return __awaiter(_this, void 0, void 0, function () {
                var rootResourceSpecId, resourcespecidAttribute, error_1, ruleTree, ruleTreeControlObject, sRootResourceSpecId, resourcespecidAttribute;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(ClientUtility.ClientUtil.isUCI() && !this.isCSSInstalled)) return [3 /*break*/, 5];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.saveRuleTree()];
                        case 2:
                            rootResourceSpecId = _a.sent();
                            if (!ClientUtility.DataUtil.isNullOrUndefined(rootResourceSpecId)) {
                                resourcespecidAttribute = Xrm.Page.getAttribute("resourcespecid");
                                if (!ClientUtility.DataUtil.isNullOrUndefined(resourcespecidAttribute)) {
                                    resourcespecidAttribute.setValue([{ id: rootResourceSpecId, name: "", entityType: "resourcespec" }]);
                                }
                            }
                            this.setValues();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            Xrm.Navigation.openErrorDialog(error_1);
                            return [3 /*break*/, 4];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            ruleTree = Xrm.Page.getControl("IFRAME_RuleTree");
                            if (ruleTree != null) {
                                ruleTreeControlObject = ruleTree.getObject();
                                if (!ClientUtility.DataUtil.isNullOrUndefined(ruleTreeControlObject)) {
                                    sRootResourceSpecId = ruleTreeControlObject.contentWindow.Save();
                                    if (!ClientUtility.DataUtil.isNullOrUndefined(sRootResourceSpecId)) {
                                        resourcespecidAttribute = Xrm.Page.getAttribute("resourcespecid");
                                        if (!ClientUtility.DataUtil.isNullOrUndefined(resourcespecidAttribute)) {
                                            resourcespecidAttribute.setValue([{ id: sRootResourceSpecId, name: "", entityType: "resourcespec" }]);
                                        }
                                    }
                                }
                            }
                            this.setValues();
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            }); };
            this.setValues = function () {
                // Set duration, granularity and anchor offset
                var scheduling = Xrm.Page.getControl("IFRAME_Scheduling");
                if (!ClientUtility.DataUtil.isNullOrUndefined(scheduling)) {
                    var schedulingControlObject = scheduling.getObject();
                    if (!ClientUtility.DataUtil.isNullOrUndefined(schedulingControlObject)) {
                        if (typeof schedulingControlObject.contentWindow.GetDurationValue !== "undefined" &&
                            typeof schedulingControlObject.contentWindow.GetGranularityValue !== "undefined" &&
                            typeof schedulingControlObject.contentWindow.GetAnchorOffsetValue !== "undefined") {
                            var durationValue = schedulingControlObject.contentWindow.GetDurationValue();
                            if (!ClientUtility.DataUtil.isNullOrUndefined(durationValue)) {
                                var durationAttribute = Xrm.Page.getAttribute("duration");
                                if (!ClientUtility.DataUtil.isNullOrUndefined(durationAttribute)) {
                                    durationAttribute.setValue(durationValue);
                                }
                            }
                            var granularityValue = schedulingControlObject.contentWindow.GetGranularityValue();
                            if (!ClientUtility.DataUtil.isNullOrUndefined(granularityValue)) {
                                var granularityAttribute = Xrm.Page.getAttribute("granularity");
                                if (!ClientUtility.DataUtil.isNullOrUndefined(granularityAttribute)) {
                                    granularityAttribute.setValue(ClientUtility.StringUtil.format("FREQ=MINUTELY;INTERVAL={0};", granularityValue));
                                }
                            }
                            var anchoroffsetValue = schedulingControlObject.contentWindow.GetAnchorOffsetValue();
                            if (!ClientUtility.DataUtil.isNullOrUndefined(anchoroffsetValue)) {
                                var anchoroffsetAttribute = Xrm.Page.getAttribute("anchoroffset");
                                if (!ClientUtility.DataUtil.isNullOrUndefined(anchoroffsetAttribute)) {
                                    // get minutes and ignore the date since we are getting this from a datetime control showing time only.
                                    anchoroffsetAttribute.setValue(anchoroffsetValue.getHours() * 60 + anchoroffsetValue.getMinutes());
                                }
                            }
                        }
                    }
                }
                //Setting Default values
                var clientUrl = Xrm.Page.context.getClientUrl();
                var requestUri = clientUrl + "/api/data/v9.0";
                _this.asyncHttpRequest(requestUri, 'GET').then(function (result) {
                    var index = result.indexOf("msdyn_servicescheduling");
                    if (index >= 0) {
                        if (ClientUtility.ClientUtil.isUCI()) {
                            requestUri = clientUrl + "/api/data/v9.0/msdyn_servicescheduling?$select=msdyn_dummyresourcespecid";
                            _this.asyncHttpRequest(requestUri, 'GET').then(function (result) {
                                _this.SetDefaultValueForUCI(result);
                            });
                        }
                    }
                });
                if (ClientUtility.ClientUtil.isUCI() && !_this.isCSSInstalled) {
                    // Close progress indicator started above
                    Xrm.Utility.closeProgressIndicator();
                }
            };
            this.asyncHttpRequest = function (url, method) {
                return new Promise(function (resolve, reject) {
                    var request = new XMLHttpRequest();
                    request.onreadystatechange = function () {
                        if (request.readyState === XMLHttpRequest.DONE) {
                            if (request.status === 200) {
                                resolve(request.responseText);
                            }
                            else {
                                reject(Error(request.statusText));
                            }
                        }
                    };
                    request.open(method, url);
                    request.setRequestHeader("OData-MaxVersion", "4.0");
                    request.setRequestHeader("OData-Version", "4.0");
                    request.setRequestHeader("Accept", "application/json");
                    request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                    request.send();
                });
            };
            this.SetDefaultValueForUCI = function (response) {
                var resourcespecidAttribute = Xrm.Page.getAttribute("resourcespecid");
                var responseJSON = JSON.parse(response);
                var resourcespecid = responseJSON.value[0].msdyn_dummyresourcespecid;
                resourcespecidAttribute.setValue([{ id: resourcespecid, name: "", entityType: "resourcespec" }]);
                var durationAttribute = Xrm.Page.getAttribute("duration");
                durationAttribute.setValue(60);
                var granularityAttribute = Xrm.Page.getAttribute("granularity");
                granularityAttribute.setValue(ClientUtility.StringUtil.format("FREQ=MINUTELY;INTERVAL={0};", 15));
                var anchoroffsetAttribute = Xrm.Page.getAttribute("anchoroffset");
                anchoroffsetAttribute.setValue(480); //default value for anchoroffset 8*60 = 480 implies 8AM
            };
            this.isCSSInstalled = false;
        }
        return ServiceMainSystemLibraryWebResource;
    }());
    CrmService.ServiceMainSystemLibraryWebResource = ServiceMainSystemLibraryWebResource;
    var ServiceLegacyCommandBarActions = (function () {
        function ServiceLegacyCommandBarActions() {
            var _this = this;
            this.deactivate = function (primaryControl) {
                _this.canServiceBeDeactivated().then(function (allowDeactivate) {
                    if (allowDeactivate == true || !ClientUtility.ClientUtil.isUCI()) {
                        var confirmDialogOptions = _this.setSchedulableConfirmDialogOptions();
                        var callbackFunction = _this.setSchedulableConfirmDialogCallback;
                        _this.deactivateConfirmDialogStrings(1).then(function (confirmDialogStrings) {
                            Xrm.Navigation.openConfirmDialog(confirmDialogStrings, confirmDialogOptions).then(function (result) {
                                if (result.confirmed) {
                                    callbackFunction(false, primaryControl);
                                }
                            });
                        });
                    }
                    else {
                        var alert = new ClientUtility.AlertDialogStrings;
                        alert.text = CrmService.ResourceStringProvider.getResourceString("Error_Message_Deactivate_Service");
                        Xrm.Navigation.openAlertDialog(alert);
                    }
                });
            };
            this.activate = function (primaryControl) {
                var confirmDialogOptions = _this.setSchedulableConfirmDialogOptions();
                var callbackFunction = _this.setSchedulableConfirmDialogCallback;
                _this.activateConfirmDialogStrings(1).then(function (confirmDialogStrings) {
                    Xrm.Navigation.openConfirmDialog(confirmDialogStrings, confirmDialogOptions).then(function (result) {
                        if (result.confirmed) {
                            callbackFunction(true, primaryControl);
                        }
                    });
                });
            };
            this.deactivateConfirmDialogStrings = function (count) {
                var entityName = CrmService.EntityNames.Service;
                var displayName = ClientUtility.DataUtil.EmptyString;
                return Xrm.Utility.getEntityMetadata(entityName).then(function (entityMetadata) {
                    displayName = entityMetadata.DisplayName;
                    if (count > 1) {
                        displayName = entityMetadata.DisplayCollectionName;
                    }
                    var confirmDialogStrings = {
                        title: ClientUtility.StringUtil.format(CrmService.ResourceStringProvider.getResourceString("Dialog_Deactivate_Title"), displayName),
                        text: ClientUtility.StringUtil.format(CrmService.ResourceStringProvider.getResourceString("Web._grid.cmds.dlg_deactivate.aspx_55"), displayName),
                        subtitle: ClientUtility.StringUtil.format(CrmService.ResourceStringProvider.getResourceString("Dialog_Deactivate_Description"), count, displayName),
                        confirmButtonLabel: CrmService.ResourceStringProvider.getResourceString("Button_Label_Deactivate"),
                        cancelButtonLabel: CrmService.ResourceStringProvider.getResourceString("Button_Label_Cancel"),
                    };
                    return confirmDialogStrings;
                });
            };
            this.activateConfirmDialogStrings = function (count) {
                var entityName = CrmService.EntityNames.Service;
                var displayName = ClientUtility.DataUtil.EmptyString;
                return Xrm.Utility.getEntityMetadata(entityName).then(function (entityMetadata) {
                    displayName = entityMetadata.DisplayName;
                    if (count > 1) {
                        displayName = entityMetadata.DisplayCollectionName;
                    }
                    var confirmDialogStrings = {
                        title: ClientUtility.StringUtil.format(CrmService.ResourceStringProvider.getResourceString("Dialog_Activate_Title"), displayName),
                        text: ClientUtility.StringUtil.format(CrmService.ResourceStringProvider.getResourceString("Web._grid.cmds.dlg_activate.aspx_55"), displayName, CrmService.ResourceStringProvider.getResourceString("Dialog_Label_Active")),
                        subtitle: ClientUtility.StringUtil.format(CrmService.ResourceStringProvider.getResourceString("Dialog_Activate_Description_Activate"), count, displayName),
                        confirmButtonLabel: CrmService.ResourceStringProvider.getResourceString("Button_Label_Activate"),
                        cancelButtonLabel: CrmService.ResourceStringProvider.getResourceString("Button_Label_Cancel"),
                    };
                    return confirmDialogStrings;
                });
            };
            this.setSchedulableConfirmDialogOptions = function () {
                var confirmDialogOptions = {
                    height: 200,
                    width: 610
                };
                return confirmDialogOptions;
            };
            this.setSchedulableConfirmDialogCallback = function (isSchedulable, executionContext) {
                executionContext.data.save()
                    .then(function () {
                    _this.setSchedulable(Xrm.Page.data.entity.getId(), isSchedulable).then(function () {
                        Xrm.Page.data.refresh(true).then(function () {
                            Xrm.Page.ui.refreshRibbon();
                        });
                    }, ClientUtility.ActionFailedHandler.actionFailedCallback);
                }, function (errorResponse) {
                    return;
                });
            };
            this.setSchedulable = function (id, isSchedulable) {
                var entityRecord = {};
                entityRecord.isschedulable = isSchedulable;
                return Xrm.WebApi.updateRecord(CrmService.EntityNames.Service, id, entityRecord);
            };
            this.canServiceBeDeactivated = function () {
                var serviceId = Xrm.Page.data.entity.getId();
                var fetchXml = "<fetch mapping = 'logical' > <entity name='serviceappointment' > <attribute name='activityid' /> <filter type='and' > <filter><condition attribute='serviceid' operator = 'eq' value ='" + serviceId + "' /> </filter>      <filter type='or'>          <condition attribute='statecode' operator='eq' value='0' /> <condition attribute='statecode' operator = 'eq' value = '3' /> </filter>    </filter > </entity></fetch> ";
                return Xrm.WebApi.retrieveMultipleRecords(CrmService.EntityNames.ServiceAppointment, "?fetchXml=" + fetchXml).then(function (response) {
                    if (response && response.entities.length > 0) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }, ClientUtility.ActionFailedHandler.actionFailedCallback);
            };
        }
        return ServiceLegacyCommandBarActions;
    }());
    CrmService.ServiceLegacyCommandBarActions = ServiceLegacyCommandBarActions;
    var ServiceLegacyGridCommandActions = (function () {
        function ServiceLegacyGridCommandActions(serviceCommandBarActions) {
            var _this = this;
            this.serviceCommandBarActions = null;
            this.deactivate = function (gridControl, records, entityTypeCode) {
                _this.serviceCommandBarActions.deactivateConfirmDialogStrings(records.length).then(function (confirmDialogStrings) {
                    _this.openSetSchedulableConfirmDialog(gridControl, records, false, confirmDialogStrings, _this.serviceCommandBarActions.setSchedulableConfirmDialogOptions());
                });
            };
            this.activate = function (gridControl, records, entityTypeCode) {
                _this.serviceCommandBarActions.activateConfirmDialogStrings(records.length).then(function (confirmDialogStrings) {
                    _this.openSetSchedulableConfirmDialog(gridControl, records, true, confirmDialogStrings, _this.serviceCommandBarActions.setSchedulableConfirmDialogOptions());
                });
            };
            this.openSetSchedulableConfirmDialog = function (gridControl, records, isSchedulable, confirmDialogStrings, options) {
                if (ClientUtility.DataUtil.isNull(records) || !records.length) {
                    var alertDialogStrings = new ClientUtility.AlertDialogStrings;
                    alertDialogStrings.text = CrmService.ResourceStringProvider.getResourceString("Error_Message_Action_NoItemSelected");
                    Xrm.Navigation.openAlertDialog(alertDialogStrings);
                    return;
                }
                var callbackFunction = _this.setSchedulableConfirmDialogCallback;
                Xrm.Navigation.openConfirmDialog(confirmDialogStrings, options).then(function (result) {
                    if (result.confirmed) {
                        callbackFunction(gridControl, records, isSchedulable);
                    }
                });
            };
            this.setSchedulableConfirmDialogCallback = function (gridControl, records, isSchedulable) {
                ClientUtility.DialogUtil.showProgressMessage();
                if (records.length === 1) {
                    var entityId = records[0].Id;
                    _this.serviceCommandBarActions.setSchedulable(entityId, isSchedulable)
                        .then(function (updateResposne) {
                        ClientUtility.DialogUtil.hideProgressMessage();
                        !ClientUtility.DataUtil.isNull(gridControl) &&
                            gridControl.refresh();
                    }, ClientUtility.DialogUtil.actionFailedCallbackForMoca);
                }
                else {
                    _this.performChainSetSchedulable(records, isSchedulable, gridControl, 0, true);
                }
            };
            this.performChainSetSchedulable = function (records, isSchedulable, gridControl, currentIndex, setSchedulableSuccess) {
                if (currentIndex >= records.length) {
                    ClientUtility.DialogUtil.hideProgressMessage();
                    !setSchedulableSuccess &&
                        ClientUtility.CommandBarActions.openAlertDialogForSetStateMultipleError(gridControl);
                    gridControl.refresh();
                }
                else
                    _this.serviceCommandBarActions.setSchedulable(records[currentIndex].Id, isSchedulable)
                        .then(function (successParameter) {
                        _this.performChainSetSchedulable(records, isSchedulable, gridControl, currentIndex + 1, setSchedulableSuccess);
                    }, function (errorParameter) {
                        _this.performChainSetSchedulable(records, isSchedulable, gridControl, currentIndex + 1, false);
                    });
            };
            this.serviceCommandBarActions = serviceCommandBarActions;
        }
        return ServiceLegacyGridCommandActions;
    }());
    CrmService.ServiceLegacyGridCommandActions = ServiceLegacyGridCommandActions;
})(CrmService || (CrmService = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
///<reference path="Legacy/ServiceLegacyLibrary.ts" />
var CrmService;
(function (CrmService) {
    'use strict';
    var Service = (function () {
        function Service() {
        }
        return Service;
    }());
    Service.CommandBarActions = new CrmService.ServiceLegacyCommandBarActions();
    Service.GridCommandActions = new CrmService.ServiceLegacyGridCommandActions(Service.CommandBarActions);
    Service.Instance = new CrmService.ServiceLegacyLibrary();
    Service.ctor = (function () {
        // These are needed on the window because of "general" command bar actions calling hard-coded methods with some conditions
    })();
    CrmService.Service = Service;
})(CrmService || (CrmService = {}));
//# sourceMappingURL=Service_main_system_library.js.map