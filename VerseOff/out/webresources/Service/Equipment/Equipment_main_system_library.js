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
/// <reference path="../../ServiceClientCommon/Service_ClientCommon.ts" />
/// <reference path="../../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../../../../TypeDefinitions/Service/Localization/Script/ResourceStringProvider.d.ts" />
var CrmService;
(function (CrmService) {
    'use strict';
    var _this = this;
    var workhoursTabName = "workhours";
    var calendarIdField = "calendarid";
    var EquipmentLegacyLibrary = (function () {
        function EquipmentLegacyLibrary() {
            this.form_onload = function (executionContext) {
                CrmService.ClientUtil.Is_CSS_Installed().then(function (response) {
                    if (!response) {
                        if (!CrmService.ClientUtil.isUCI()) {
                            EquipmentLegacyLibrary.SetWorkHoursTabVisibility(false);
                        }
                        else {
                            if (executionContext.getFormContext().ui.getFormType() === 1 /* Create */) {
                                EquipmentLegacyLibrary.SetWorkHoursTabVisibility(false);
                                EquipmentLegacyLibrary.SetTimeZone();
                            }
                            else {
                                EquipmentLegacyLibrary.SetWorkHoursTabVisibility(true);
                            }
                        }
                    }
                });
            };
        }
        ;
        return EquipmentLegacyLibrary;
    }());
    EquipmentLegacyLibrary.SetWorkHoursTabVisibility = function (isVisible) {
        if (Xrm.Page.ui && Xrm.Page.ui.tabs && Xrm.Page.ui.tabs.get(workhoursTabName)) {
            Xrm.Page.ui.tabs.get(workhoursTabName).setVisible(isVisible);
        }
        if (!isVisible && Xrm.Page.data && Xrm.Page.data.entity && Xrm.Page.data.entity.attributes.get(calendarIdField)) {
            Xrm.Page.data.entity.attributes.get(calendarIdField).setRequiredLevel("none");
        }
    };
    EquipmentLegacyLibrary.SetTimeZone = function () { return __awaiter(_this, void 0, void 0, function () {
        var userId, url, userTimeZoneCode, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = Xrm.Page.context.getUserId();
                    url = Xrm.Page.context.getClientUrl() + "/api/data/v9.0/usersettingscollection?$filter=systemuserid eq '" + userId + "'&$select=timezonecode";
                    return [4 /*yield*/, (function () {
                            return new Promise(function () {
                                var request = new XMLHttpRequest();
                                request.open("GET", encodeURI(url), true);
                                request.setRequestHeader("OData-MaxVersion", "4.0");
                                request.setRequestHeader("OData-Version", "4.0");
                                request.setRequestHeader("Accept", "application/json");
                                request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                                request.onreadystatechange = function () {
                                    if (this.readyState == 4) {
                                        request.onreadystatechange = null;
                                        if (request.status == 200) {
                                            var data = JSON.parse(request.response);
                                            userTimeZoneCode = data.value[0]["timezonecode"];
                                            if (Xrm.Page.getAttribute("timezonecode")) {
                                                Xrm.Page.getAttribute("timezonecode").setValue(userTimeZoneCode);
                                            }
                                        }
                                    }
                                };
                                request.send();
                            });
                        })()];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
            }
        });
    }); };
    CrmService.EquipmentLegacyLibrary = EquipmentLegacyLibrary;
    var EquipmentLegacyCommandBarActions = (function () {
        function EquipmentLegacyCommandBarActions() {
            this.openWorkHoursPage = function (primaryControl, equipmentId) {
                CrmService.ClientUtil.Is_CSS_Installed().then(function (response) {
                    if (!response) {
                        var entityTypeCode = CrmService.EntityTypeCodes.Equipment;
                        var urlBase = Xrm.Utility.getGlobalContext().getClientUrl() + "/biz/users/monthlyCalendar.aspx";
                        var url = '';
                        if (ClientUtility.ClientUtil.isUCI()) {
                            if (primaryControl && primaryControl.ui && primaryControl.ui.tabs) {
                                primaryControl.ui.tabs.get("workhours").setFocus();
                            }
                            else {
                                var options = {
                                    entityName: "equipment",
                                    entityId: equipmentId.replace(/{/g, "").replace(/}/g, "").toLowerCase()
                                };
                                var parameters = {
                                    tab_0: "workhours"
                                };
                                Xrm.Navigation.openForm(options, parameters);
                            }
                        }
                        else {
                            url = String.format("{0}?oId={1}&oType={2}", urlBase, equipmentId, entityTypeCode);
                            window.open(url, '_blank', 'width=1300,height=700');
                        }
                    }
                });
            };
        }
        return EquipmentLegacyCommandBarActions;
    }());
    CrmService.EquipmentLegacyCommandBarActions = EquipmentLegacyCommandBarActions;
})(CrmService || (CrmService = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="./Legacy/EquipmentLegacyLibrary.ts" />
var CrmService;
(function (CrmService) {
    'use strict';
    var Equipment = (function () {
        function Equipment() {
        }
        return Equipment;
    }());
    Equipment.CommandBarActions = new CrmService.EquipmentLegacyCommandBarActions();
    Equipment.Instance = new CrmService.EquipmentLegacyLibrary();
    Equipment.ctor = (function () {
        // This needed on the window because of "general" command bar actions calling hard-coded methods with some conditions
    })();
    CrmService.Equipment = Equipment;
})(CrmService || (CrmService = {}));
//# sourceMappingURL=Equipment_main_system_library.js.map