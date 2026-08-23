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
/// <reference path="../ServiceClientCommon/EntityTypeCodes.ts" />
/// <reference path="../ServiceClientCommon/EntityNames.ts" />
/// <reference path="../ServiceClientCommon/ClientUtil.ts" />
var CrmService;
(function (CrmService) {
    'use strict';
    var KnowledgeArticleIncidentActions = (function () {
        function KnowledgeArticleIncidentActions() {
        }
        return KnowledgeArticleIncidentActions;
    }());
    KnowledgeArticleIncidentActions.KnowledgeArticleIncidentAction = function (records, entityTypeCode) {
        if (!records || !records.length) {
            return;
        }
        //selected record
        var selectedRecordId = records[0].Id;
        //navigate method
        var navigateForm = function (entityId, entityName) {
            var formOptions = {
                entityId: entityId,
                entityName: entityName
            };
            Xrm.Navigation.openForm(formOptions);
        };
        //check if knowledge article
        if (Xrm.Page.data.entity.getEntityName() == CrmService.EntityNames.KnowledgeArticle) {
            var selector = "?$select=_incidentid_value";
            Xrm.WebApi.retrieveRecord(CrmService.EntityNames.KnowledgeArticleIncident, selectedRecordId, selector).then(function (entity) {
                var entityId = entity["_incidentid_value"];
                var entityName = CrmService.EntityNames.Incident;
                navigateForm(entityId, entityName);
            }, function (reason) {
                // If we can't retrieve the entity for some reason, revert to open the queue item form.
                navigateForm(selectedRecordId, CrmService.EntityNames.KnowledgeArticleIncident);
            });
        }
        else if (Xrm.Page.data.entity.getEntityName() == CrmService.EntityNames.Incident && Xrm.Internal.isFeatureEnabled("October2021Update")) {
            var selector = "?$select=_knowledgearticleid_value";
            Xrm.WebApi.retrieveRecord(CrmService.EntityNames.KnowledgeArticleIncident, selectedRecordId, selector).then(function (entity) {
                var entityId = entity["_knowledgearticleid_value"];
                var entityName = CrmService.EntityNames.KnowledgeArticle;
                navigateForm(entityId, entityName);
            }, function (reason) {
                // If we can't retrieve the entity for some reason, revert to open the queue item form.
                navigateForm(selectedRecordId, CrmService.EntityNames.KnowledgeArticleIncident);
            });
        }
        else {
            var entityId = selectedRecordId;
            var entityName = CrmService.ClientUtil.getEntityName(parseInt(entityTypeCode)).toString();
            navigateForm(entityId, entityName);
        }
    };
    KnowledgeArticleIncidentActions.ctor = (function () {
        var global = window;
        var mscrm = global.Mscrm;
        mscrm.KnowledgeArticleIncidentAction = KnowledgeArticleIncidentActions.KnowledgeArticleIncidentAction;
    })();
    CrmService.KnowledgeArticleIncidentActions = KnowledgeArticleIncidentActions;
})(CrmService || (CrmService = {}));
//# sourceMappingURL=KnowledgeArticleIncident_main_system_library.js.map