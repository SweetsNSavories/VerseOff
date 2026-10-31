/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/**
* Telemetry library that takes dynamic parameter lists as event parameters in addition to fixed required parameters relavent to classify verticals association with Entities
* and pushes to crminsightsdev.cloudapp.net endpoint.  All one needs to do is Register your telemetry event with InsightsEndpoint repo (Events.xml and MdsConfig-CloudService.xml
* and start pushing event data using below APIs
*
* Sample calls for the APIs - caller : non-custom control eg: Ribbon commands
* AppsTelemetryUtility.reportData(EventList.EntitlementEvent, ModuleList.service, EntityList.entitlement, "Activation", null, { "CurrentState": "Activate", "UpdateMode": "Mouse"})
* AppsTelemetryUtility.reportData("CSHEntitlements", "Service", "Entitlement", "Deactivate", null, { "CurrentState": "Inactive", "UpdateMode": "KeyBoard"})
* Similarly ReportSuccess and Report Failure calls using either Enums (preferred) or string values.
* AppsTelemetryUtility.reportSuccess(EventList.EntitlementEvent, ModuleList.service, EntityList.entitlement, "TestAction", null, { "CurrentState": "Activate", "UpdateMode": "Mouse"})
* AppsTelemetryUtility.reportFailure(EventList.EntitlementEvent, ModuleList.service, EntityList.entitlement, "TestAction", null, { "CurrentState": "Activate", "UpdateMode": "Mouse"})
*
* Sample calls for the APIs - caller Custom Controls
* AppsTelemetryUtility.ReportSuccess(EventList.SubjectEvent, ModuleList.service, EntityList.CSSEvent, "AddBreak", this.context, {"Duration": 30, "Timezone": "PST"});
* AppsTelemetryUtility.ReportFailure("CSH_Subject", "Service", "Subject", "AddChild", this.context, {"name": "myRegarding", "parent": "myEntity"});
*
* In above samples for non-custom control calls, null is expected to be passed as part of event call for two reasons 1. Generic API for custom & non-custom control
*/
var CrmService;
(function (CrmService) {
    'use strict';
    /**
    * To format the outer payload for telemetry data according to the event schema
    */
    var TelemetryPayload = (function () {
        function TelemetryPayload() {
        }
        return TelemetryPayload;
    }());
    CrmService.TelemetryPayload = TelemetryPayload;
    /**
    * To format the inner payload for telemetry data according to the event schema
    */
    var TelemetryParameter = (function () {
        function TelemetryParameter() {
        }
        return TelemetryParameter;
    }());
    CrmService.TelemetryParameter = TelemetryParameter;
    /**
    * Declaring this key value pair to make it easy for callers
    */
    var ExtraParams = (function () {
        function ExtraParams() {
        }
        return ExtraParams;
    }());
    CrmService.ExtraParams = ExtraParams;
    /**
    * ENUMs tracking EventTypes
    */
    var EventTypes = (function () {
        function EventTypes() {
        }
        return EventTypes;
    }());
    EventTypes.Success = "Success";
    EventTypes.Failure = "Failure";
    EventTypes.EventData = "EventData";
    CrmService.EventTypes = EventTypes;
    /**
    * ENUMs tracking Vertical Events. Callers of Client Telemetry APIs can use ENUMs to pass required parameters
    * Currently listed with registered Customer Service Module List
    */
    var EventList = (function () {
        function EventList() {
        }
        return EventList;
    }());
    EventList.QueueEvent = "CSHQueues";
    EventList.RoutingRuleEvent = "CSHRoutingRules";
    EventList.ARCEvent = "CSHAutoRecordCreation";
    EventList.SubjectEvent = "CSHSubject";
    EventList.HSEvent = "CSHHolidaySchedule";
    EventList.CSSEvent = "CSHCustomerServiceSchedule";
    EventList.SettingsEvent = "CSHSettings";
    EventList.EntitlementEvent = "CSHEntitlements";
    EventList.IncidentEvent = "CSHIncident";
    EventList.EventAgnostic = "CSHMisc";
    CrmService.EventList = EventList;
    /**
    * ENUMs tracking Vertical/Module List
    */
    var ModuleList = (function () {
        function ModuleList() {
        }
        return ModuleList;
    }());
    ModuleList.service = "Service";
    ModuleList.sales = "Sales";
    ModuleList.marketing = "Marketing";
    ModuleList.verticalAgnostic = "VerticalAgnostic";
    CrmService.ModuleList = ModuleList;
    /**
    * ENUMs tracking Entity List
    * Currently listing entities list part of Customer Service Module shipping in Enterprise Release
    */
    var EntityList = (function () {
        function EntityList() {
        }
        return EntityList;
    }());
    EntityList.queue = "Queue";
    EntityList.queueItem = "QueueItem";
    EntityList.convertRule = "ConvertRule";
    EntityList.convertRuleItem = "ConvertRuleItem";
    EntityList.routingRule = "RoutingRule";
    EntityList.routingRuleItem = "RoutingRuleItem";
    EntityList.entitlement = "Entitlement";
    EntityList.entitlementTemplate = "EntitlementTemplate";
    EntityList.sla = "SLA";
    EntityList.slaItem = "SLAItem";
    EntityList.calendar = "Calendar";
    EntityList.calendarRule = "CalendarRule";
    EntityList.subject = "Subject";
    EntityList.attributemap = "AttributeMap";
    EntityList.organization = "organization";
    EntityList.incident = "Incident";
    CrmService.EntityList = EntityList;
    /**
    * ENUMs tracking Action
    */
    var Action = (function () {
        function Action() {
        }
        return Action;
    }());
    Action.create = "Create";
    Action.update = "Update";
    Action.retrieve = "Retrieve";
    Action.delete = "Delete";
    Action.clickedGridCommand = "ClickedGridCommand";
    CrmService.Action = Action;
    var AppsTelemetryUtility = (function () {
        function AppsTelemetryUtility() {
        }
        /**
        * @function reportEventData send telemetry data to the crminsightsdev.cloudapp.net endpoint.
        * @description send telemetry data to the telemetry endpoint.
        * @param appName - service / sales / any other XRM based app
        * @param context -  A reference to the context of custom entity; null for non-custom entity calls
        */
        AppsTelemetryUtility.reportData = function (eventName, appName, entityName, actionName, context, eventSpecificParams) {
            var telemetrydata = AppsTelemetryUtility.getTelemetryData(eventName, EventTypes.EventData, appName, entityName, actionName, context, eventSpecificParams);
            // Async calls be made to reportEvent call and error scenarios are expected to be handled within reportEvent infra
            if (context != null && context.reporting != null) {
                context.reporting.reportEvent(telemetrydata);
            }
            else {
                Xrm.Reporting.reportEvent(telemetrydata);
            }
        };
        ;
        AppsTelemetryUtility.reportFailure = function (eventName, appName, entityName, actionName, context, eventSpecificParams) {
            var telemetrydata = AppsTelemetryUtility.getTelemetryData(eventName, EventTypes.Failure, appName, entityName, actionName, context, eventSpecificParams);
            if (context != null && context.reporting != null) {
                context.reporting.reportEvent(telemetrydata);
            }
            else {
                Xrm.Reporting.reportEvent(telemetrydata);
            }
        };
        ;
        AppsTelemetryUtility.reportError = function (eventName, appName, entityName, actionName, context, errorMessage, errorTrace) {
            var eventSpecificParams = {};
            eventSpecificParams["errorMessage"] = errorMessage;
            eventSpecificParams["errorTrace"] = errorTrace ? JSON.stringify(errorTrace, Object.getOwnPropertyNames(errorTrace)) : "";
            AppsTelemetryUtility.reportFailure(eventName, appName, entityName, actionName, context, eventSpecificParams);
        };
        ;
        AppsTelemetryUtility.reportSuccess = function (eventName, appName, entityName, actionName, context, eventSpecificParams) {
            var telemetrydata = AppsTelemetryUtility.getTelemetryData(eventName, EventTypes.Success, appName, entityName, actionName, context, eventSpecificParams);
            if (context != null && context.reporting != null) {
                context.reporting.reportEvent(telemetrydata);
            }
            else {
                Xrm.Reporting.reportEvent(telemetrydata);
            }
        };
        ;
        AppsTelemetryUtility.getTelemetryData = function (_eventName, _telemetryDatatype, _appName, _entityName, _actionName, _context, _eventSpecificParams) {
            var payload = {
                eventName: _eventName,
                eventParameters: []
            };
            var para1 = { name: "EventType", value: _telemetryDatatype };
            var para2 = { name: "appName", value: _appName };
            var para3 = { name: "entityName", value: _entityName };
            var para4 = { name: "actionName", value: _actionName };
            var para5 = { name: "context", value: _context };
            payload.eventParameters.push(para1);
            payload.eventParameters.push(para2);
            payload.eventParameters.push(para3);
            payload.eventParameters.push(para4);
            payload.eventParameters.push(para5);
            var mKeys = Object.keys(_eventSpecificParams);
            for (var mk in mKeys) {
                var tParam = { name: mKeys[mk], value: _eventSpecificParams[mKeys[mk]] };
                payload.eventParameters.push(tParam);
            }
            return payload;
        };
        return AppsTelemetryUtility;
    }());
    CrmService.AppsTelemetryUtility = AppsTelemetryUtility;
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
    var ContractAllotmentTypeCode = (function () {
        function ContractAllotmentTypeCode() {
            this.time = 2;
            this.coverageDates = 3;
        }
        return ContractAllotmentTypeCode;
    }());
    CrmService.ContractAllotmentTypeCode = ContractAllotmentTypeCode;
})(CrmService || (CrmService = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var CrmService;
(function (CrmService) {
    'use strict';
    var PreviousDateTimeValues = (function () {
        function PreviousDateTimeValues() {
            var _this = this;
            this.get_activeOnDate = function () {
                return _this._activeOnDate$p$0;
            };
            this.set_activeOnDate = function (value) {
                _this._activeOnDate$p$0 = value;
                return value;
            };
            this.get_expireOnDate = function () {
                return _this._expireOnDate$p$0;
            };
            this.set_expireOnDate = function (value) {
                _this._expireOnDate$p$0 = value;
                return value;
            };
        }
        return PreviousDateTimeValues;
    }());
    CrmService.PreviousDateTimeValues = PreviousDateTimeValues;
    var PreviousBillingDateTimeValues = (function () {
        function PreviousBillingDateTimeValues() {
            var _this = this;
            this.get_billingStartOnDate = function () {
                return _this._billingStartOnDate$p$0;
            };
            this.set_billingStartOnDate = function (value) {
                _this._billingStartOnDate$p$0 = value;
                return value;
            };
            this.get_billingEndOnDate = function () {
                return _this._billingEndOnDate$p$0;
            };
            this.set_billingEndOnDate = function (value) {
                _this._billingEndOnDate$p$0 = value;
                return value;
            };
        }
        return PreviousBillingDateTimeValues;
    }());
    CrmService.PreviousBillingDateTimeValues = PreviousBillingDateTimeValues;
})(CrmService || (CrmService = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var CrmService;
(function (CrmService) {
    'use strict';
    var DateType = (function () {
        function DateType() {
        }
        return DateType;
    }());
    DateType.ActiveOn = "activeon";
    DateType.ActualStart = "actualstart";
    DateType.BeginDate = "begindate";
    DateType.ProposedStart = "proposedstart";
    DateType.ScheduledStart = "scheduledstart";
    DateType.ValidFromDate = "validfromdate";
    DateType.BillingStartOn = "billingstarton";
    CrmService.DateType = DateType;
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
    var CancelCaseDialogResult = (function () {
        function CancelCaseDialogResult() {
        }
        return CancelCaseDialogResult;
    }());
    CrmService.CancelCaseDialogResult = CancelCaseDialogResult;
    var ResolveCaseDialogResult = (function () {
        function ResolveCaseDialogResult() {
        }
        return ResolveCaseDialogResult;
    }());
    CrmService.ResolveCaseDialogResult = ResolveCaseDialogResult;
})(CrmService || (CrmService = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var CrmService;
(function (CrmService) {
    'use strict';
    var EntitlementState;
    (function (EntitlementState) {
        EntitlementState[EntitlementState["draft"] = 0] = "draft";
        EntitlementState[EntitlementState["active"] = 1] = "active";
        EntitlementState[EntitlementState["cancelled"] = 2] = "cancelled";
        EntitlementState[EntitlementState["expired"] = 3] = "expired";
        EntitlementState[EntitlementState["waiting"] = 4] = "waiting";
    })(EntitlementState = CrmService.EntitlementState || (CrmService.EntitlementState = {}));
})(CrmService || (CrmService = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var CrmService;
(function (CrmService) {
    'use strict';
    var IncidentOriginCode;
    (function (IncidentOriginCode) {
        IncidentOriginCode[IncidentOriginCode["phoneCall"] = 1] = "phoneCall";
        IncidentOriginCode[IncidentOriginCode["email"] = 2] = "email";
        IncidentOriginCode[IncidentOriginCode["webWizard"] = 3] = "webWizard";
        IncidentOriginCode[IncidentOriginCode["unspecified"] = -1] = "unspecified";
    })(IncidentOriginCode = CrmService.IncidentOriginCode || (CrmService.IncidentOriginCode = {}));
    ;
    var DoNotDecrementStatus;
    (function (DoNotDecrementStatus) {
        DoNotDecrementStatus[DoNotDecrementStatus["decrementedAlreadyStopped"] = 1] = "decrementedAlreadyStopped";
        DoNotDecrementStatus[DoNotDecrementStatus["decrementPrevention"] = 2] = "decrementPrevention";
        DoNotDecrementStatus[DoNotDecrementStatus["decrementPreventionForFuture"] = 3] = "decrementPreventionForFuture";
        DoNotDecrementStatus[DoNotDecrementStatus["decrementWhenEntitlementAssociated"] = 4] = "decrementWhenEntitlementAssociated";
    })(DoNotDecrementStatus = CrmService.DoNotDecrementStatus || (CrmService.DoNotDecrementStatus = {}));
    ;
    var IncidentState;
    (function (IncidentState) {
        IncidentState[IncidentState["active"] = 0] = "active";
        IncidentState[IncidentState["closed"] = 1] = "closed";
        IncidentState[IncidentState["canceled"] = 2] = "canceled";
        IncidentState[IncidentState["resolved"] = 5] = "resolved";
    })(IncidentState = CrmService.IncidentState || (CrmService.IncidentState = {}));
    ;
    var _formState;
    (function (_formState) {
        _formState[_formState["active"] = 0] = "active";
        _formState[_formState["resolved"] = 1] = "resolved";
        _formState[_formState["canceled"] = 2] = "canceled";
    })(_formState = CrmService._formState || (CrmService._formState = {}));
    ;
    var ThemeType;
    (function (ThemeType) {
        ThemeType[ThemeType["Outlook15White"] = 0] = "Outlook15White";
    })(ThemeType = CrmService.ThemeType || (CrmService.ThemeType = {}));
    ;
    var _knowledgeUsage;
    (function (_knowledgeUsage) {
        _knowledgeUsage[_knowledgeUsage["reference"] = 1] = "reference";
        _knowledgeUsage[_knowledgeUsage["solution"] = 2] = "solution";
        _knowledgeUsage[_knowledgeUsage["source"] = 3] = "source";
    })(_knowledgeUsage = CrmService._knowledgeUsage || (CrmService._knowledgeUsage = {}));
    ;
    var WatermarkValidity;
    (function (WatermarkValidity) {
        WatermarkValidity[WatermarkValidity["AppCommonUndefined"] = 0] = "AppCommonUndefined";
        WatermarkValidity[WatermarkValidity["XrmEntityDefined"] = 1] = "XrmEntityDefined";
        WatermarkValidity[WatermarkValidity["XrmEntityUndefined"] = 2] = "XrmEntityUndefined";
    })(WatermarkValidity = CrmService.WatermarkValidity || (CrmService.WatermarkValidity = {}));
    ;
    var IncidentResolutionMode;
    (function (IncidentResolutionMode) {
        IncidentResolutionMode[IncidentResolutionMode["MDD"] = 1] = "MDD";
        IncidentResolutionMode[IncidentResolutionMode["MFD"] = 2] = "MFD";
        IncidentResolutionMode[IncidentResolutionMode["QuickCreate"] = 3] = "QuickCreate";
    })(IncidentResolutionMode = CrmService.IncidentResolutionMode || (CrmService.IncidentResolutionMode = {}));
    ;
    var IncidentUpdateAfterResolutionMode;
    (function (IncidentUpdateAfterResolutionMode) {
        IncidentUpdateAfterResolutionMode[IncidentUpdateAfterResolutionMode["DontAllowUpdates"] = 0] = "DontAllowUpdates";
        IncidentUpdateAfterResolutionMode[IncidentUpdateAfterResolutionMode["ResolvedCases"] = 1] = "ResolvedCases";
        IncidentUpdateAfterResolutionMode[IncidentUpdateAfterResolutionMode["CanceledCases"] = 2] = "CanceledCases";
        IncidentUpdateAfterResolutionMode[IncidentUpdateAfterResolutionMode["ResolvedandCanceledCases"] = 3] = "ResolvedandCanceledCases";
    })(IncidentUpdateAfterResolutionMode = CrmService.IncidentUpdateAfterResolutionMode || (CrmService.IncidentUpdateAfterResolutionMode = {}));
    ;
    var IncidentShouldValidatePrimaryContactValue;
    (function (IncidentShouldValidatePrimaryContactValue) {
        IncidentShouldValidatePrimaryContactValue[IncidentShouldValidatePrimaryContactValue["Unrestricted"] = 0] = "Unrestricted";
        IncidentShouldValidatePrimaryContactValue[IncidentShouldValidatePrimaryContactValue["Default"] = 1] = "Default";
        IncidentShouldValidatePrimaryContactValue[IncidentShouldValidatePrimaryContactValue["Balanced"] = 2] = "Balanced";
    })(IncidentShouldValidatePrimaryContactValue = CrmService.IncidentShouldValidatePrimaryContactValue || (CrmService.IncidentShouldValidatePrimaryContactValue = {}));
})(CrmService || (CrmService = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="ClientUtil.ts" />
var CrmService;
(function (CrmService) {
    'use strict';
    var LegacyUtils = (function () {
        function LegacyUtils() {
        }
        LegacyUtils.getIdFromLookupAttribute = function (attribute) {
            var attributeId = Xrm.Page.data.entity.attributes.get(attribute);
            if (ClientUtility.DataUtil.isNullOrUndefined(attributeId) || ClientUtility.DataUtil.isNullOrEmptyString(attributeId.getValue()))
                return "";
            var attributeIdValue = attributeId.getValue();
            return attributeIdValue[0].id;
        };
        ;
        ///<summary>
        /// Disables all the form fields that can be disabled on the form.
        ///</summary>
        LegacyUtils.disableFormFields = function () {
            LegacyUtils.enableDisableFormFields(true, null);
        };
        ;
        ///<summary>
        /// Enable all the form fields except for the given field
        ///</summary>
        LegacyUtils.enableFormFieldsExceptForFieldName = function (exceptionFieldName) {
            LegacyUtils.enableDisableFormFields(false, exceptionFieldName);
        };
        ;
        ///<summary>
        /// Private function used for enable and disable form field
        ///</summary>
        LegacyUtils.enableDisableFormFields = function (isDisable, exceptionFieldName) {
            if (Xrm.Page.ui) {
                Xrm.Page.ui.controls.forEach(function (control) {
                    if (control) {
                        var controlType = control.getControlType();
                        if (controlType
                            && controlType !== "iframe"
                            && controlType !== "webresource"
                            && controlType !== "subgrid"
                            && LegacyUtils.isFunction(control.setDisabled)
                            && exceptionFieldName !== control.getName()) {
                            control.setDisabled(isDisable);
                        }
                    }
                });
            }
        };
        ;
        LegacyUtils.isFunction = function (object) {
            return !!object && typeof object === "function";
        };
        ;
        return LegacyUtils;
    }());
    LegacyUtils.formatDurationValue = function (value) {
        var returnValue = null, Epsilon = 1e-8, minutes = value;
        if (!isNaN(minutes)) {
            if (minutes < 60) {
                var minutesToDisplay = String.localeFormat("{0:N0}", minutes);
                if (ClientUtility.DataUtil.isNullOrUndefined(minutesToDisplay) || !minutesToDisplay.length)
                    return null;
                if (minutes === 1)
                    returnValue = ClientUtility.StringUtil.format(Xrm.Utility.getResourceString(CrmService.ClientUtil.WebResourceName, "AppDurationControl_Minute"), minutesToDisplay);
                else
                    returnValue = ClientUtility.StringUtil.format(Xrm.Utility.getResourceString(CrmService.ClientUtil.WebResourceName, "AppDurationControl_Minutes"), minutesToDisplay);
            }
            else if (minutes >= 60 && minutes < 1440) {
                var hours = minutes / 60, hoursToDisplay = String.localeFormat("{0:N2}", hours);
                if (Math.abs(hours % 1) <= Epsilon || Math.abs(hours % 1 - 1) <= Epsilon)
                    hoursToDisplay = String.localeFormat("{0:N0}", hours);
                if (ClientUtility.DataUtil.isNullOrUndefined(hoursToDisplay) || !hoursToDisplay.length)
                    return null;
                if (hours === 1)
                    returnValue = ClientUtility.StringUtil.format(Xrm.Utility.getResourceString(CrmService.ClientUtil.WebResourceName, "AppDurationControl_Hour"), hoursToDisplay);
                else
                    returnValue = ClientUtility.StringUtil.format(Xrm.Utility.getResourceString(CrmService.ClientUtil.WebResourceName, "AppDurationControl_Hours"), hoursToDisplay);
            }
            else if (minutes >= 1440) {
                var hours = minutes / 60, days = hours / 24, daysToDisplay = String.localeFormat("{0:N2}", days);
                if (Math.abs(days % 1) <= Epsilon || Math.abs(days % 1 - 1) <= Epsilon)
                    daysToDisplay = String.localeFormat("{0:N0}", days);
                if (ClientUtility.DataUtil.isNullOrUndefined(daysToDisplay) || !daysToDisplay.length)
                    return null;
                if (days === 1)
                    returnValue = ClientUtility.StringUtil.format(Xrm.Utility.getResourceString(CrmService.ClientUtil.WebResourceName, "AppDurationControl_Day"), daysToDisplay);
                else
                    returnValue = ClientUtility.StringUtil.format(Xrm.Utility.getResourceString(CrmService.ClientUtil.WebResourceName, "AppDurationControl_Days"), daysToDisplay);
            }
        }
        else
            returnValue = value.toLocaleString();
        return returnValue;
    };
    CrmService.LegacyUtils = LegacyUtils;
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
    var ResourcesAddUpdateActionRequest = (function () {
        function ResourcesAddUpdateActionRequest(ResourceGroupId, NewlyAddedResources, ResourceGroupsToAdd) {
            this.ResourceGroupId = ResourceGroupId;
            this.NewlyAddedResources = NewlyAddedResources;
            this.ResourceGroupsToAdd = ResourceGroupsToAdd;
        }
        ResourcesAddUpdateActionRequest.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {
                    "ResourceGroupId": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    },
                    "NewlyAddedResources": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    },
                    "ResourceGroupsToAdd": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    }
                },
                operationName: "_ResourcesAddUpdateAction",
                operationType: 0,
            };
        };
        return ResourcesAddUpdateActionRequest;
    }());
    ODataContract.ResourcesAddUpdateActionRequest = ResourcesAddUpdateActionRequest;
})(ODataContract || (ODataContract = {}));
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
    var ResourcesRemoveUpdateActionRequest = (function () {
        function ResourcesRemoveUpdateActionRequest(ResourceGroupId, ResourcesToBeRemoved) {
            this.ResourceGroupId = ResourceGroupId;
            this.ResourcesToBeRemoved = ResourcesToBeRemoved;
        }
        ResourcesRemoveUpdateActionRequest.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {
                    "ResourceGroupId": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    },
                    "ResourcesToBeRemoved": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    }
                },
                operationName: "_ResourcesRemoveUpdateAction",
                operationType: 0,
            };
        };
        return ResourcesRemoveUpdateActionRequest;
    }());
    ODataContract.ResourcesRemoveUpdateActionRequest = ResourcesRemoveUpdateActionRequest;
})(ODataContract || (ODataContract = {}));
/// <reference path="DialogName.ts" />
/// <reference path="EntityNames.ts" />
/// <reference path="EntityTypeCodes.ts" />
/// <reference path="ClientUtil.ts" />
/// <reference path="MetadataDrivenDialogConstants.ts" /> 
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var CrmService;
(function (CrmService) {
    'use strict';
    var ValidStatusReasonTransitions;
    (function (ValidStatusReasonTransitions) {
        ValidStatusReasonTransitions[ValidStatusReasonTransitions["noValidStatusTransition"] = 1] = "noValidStatusTransition";
        ValidStatusReasonTransitions[ValidStatusReasonTransitions["activeActivities"] = 2] = "activeActivities";
        ValidStatusReasonTransitions[ValidStatusReasonTransitions["noErrors"] = 3] = "noErrors";
        ValidStatusReasonTransitions[ValidStatusReasonTransitions["errors"] = 4] = "errors";
        ValidStatusReasonTransitions[ValidStatusReasonTransitions["activeSwarms"] = 5] = "activeSwarms";
        ValidStatusReasonTransitions[ValidStatusReasonTransitions["activeRecords"] = 6] = "activeRecords";
    })(ValidStatusReasonTransitions = CrmService.ValidStatusReasonTransitions || (CrmService.ValidStatusReasonTransitions = {}));
    ;
})(CrmService || (CrmService = {}));
