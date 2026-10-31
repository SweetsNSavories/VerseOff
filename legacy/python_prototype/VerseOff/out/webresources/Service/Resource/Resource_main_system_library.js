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
/// <reference path="../../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../ServiceClientCommon/EntityTypeCodes.ts" />
/// <reference path="../../ServiceClientCommon/EntityNames.ts" />
/// <reference path="../../ServiceClientCommon/DialogName.ts" />
/// <reference path="../../../../../TypeDefinitions/Service/Localization/Script/ResourceStringProvider.d.ts" />
var CrmService;
(function (CrmService) {
    'use strict';
    var ResourceLegacyLibrary = (function () {
        function ResourceLegacyLibrary() {
            var global = window;
            var mscrm = global.Mscrm;
            mscrm.manageResourceLegacy = new ResourceLegacyMainSystemLibraryWebResource();
            mscrm.addResources = mscrm.manageResourceLegacy.addResources;
            mscrm.removeResources = mscrm.manageResourceLegacy.removeResources;
        }
        return ResourceLegacyLibrary;
    }());
    CrmService.ResourceLegacyLibrary = ResourceLegacyLibrary;
    var ResourceLegacyMainSystemLibraryWebResource = (function () {
        function ResourceLegacyMainSystemLibraryWebResource() {
            var _this = this;
            this.addResources = function (gridControl) {
                var siteId = Xrm.Page.data.entity.getId();
                _this.AddMembers(gridControl, siteId);
            };
            this.removeResources = function (gridControl, records) {
                var siteId = Xrm.Page.data.entity.getId();
                _this.RemoveMembers(gridControl, records, siteId);
            };
            this.AddMembers = function (gridControl, siteId) {
                if (!siteId) {
                    return;
                }
                var oTypesToAdd = CrmService.EntityTypeCodes.SystemUser + "," + CrmService.EntityTypeCodes.Equipment;
                var parameters = [gridControl, siteId];
                var callbackFunctionObject = Mscrm.Utilities.createCallbackFunctionObject("performActionAfterLookUpAddMember", _this, parameters, false);
                LookupObjectsWithCallback(callbackFunctionObject, null, "multi", oTypesToAdd, 0);
            };
            this.performActionAfterLookUpAddMember = function (retval, gridControl, siteId) {
                if (!retval || retval.items.length === 0) {
                    // No members selected
                    return;
                }
                else {
                    var updateRecords = [];
                    var attributeValues = {};
                    var attributeTypes = {};
                    attributeValues["siteid"] = new Xrm.Objects.EntityReference(CrmService.EntityNames.Site, siteId);
                    attributeTypes["siteid"] = Xrm.Objects.AttributeType.lookup;
                    for (var i = 0; i < retval.items.length; i++) {
                        if (retval.items[i].type == CrmService.EntityTypeCodes.Equipment) {
                            var equipmentEntityReference = new Xrm.Objects.EntityReference(CrmService.EntityNames.Equipment, retval.items[i].id);
                            var equipmentRecord = new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.EntityRecord(equipmentEntityReference, attributeValues, attributeTypes, {}, {}, new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.RelatedEntityCollection(new Array(0)));
                            equipmentRecord.get_changedFieldNames().addRange(['siteid']);
                            updateRecords.push(equipmentRecord);
                        }
                        else if (retval.items[i].type == CrmService.EntityTypeCodes.SystemUser) {
                            var systemUserEntityReference = new Xrm.Objects.EntityReference(CrmService.EntityNames.SystemUser, retval.items[i].id);
                            var systemUserRecord = new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.EntityRecord(systemUserEntityReference, attributeValues, attributeTypes, {}, {}, new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.RelatedEntityCollection(new Array(0)));
                            systemUserRecord.get_changedFieldNames().addRange(['siteid']);
                            updateRecords.push(systemUserRecord);
                        }
                    }
                    Xrm.Internal.messages.updateMultiple(updateRecords).then(function (response) {
                        if (!Mscrm.InternalUtilities.JSTypes.isNull(gridControl)) {
                            gridControl.refresh();
                        }
                    });
                }
            };
            this.RemoveMembers = function (gridControl, records, siteId) {
                if (records.length > 0) {
                    var confirmDialogStrings = new Xrm.ConfirmDialogStrings;
                    confirmDialogStrings.title = CrmService.ResourceStringProvider.getResourceString("Dialog_RemoveSiteMembers_Title");
                    if (records.length === 1) {
                        confirmDialogStrings.subtitle = CrmService.ResourceStringProvider.getResourceString("Dialog_RemoveSiteMember_Description");
                    }
                    else {
                        confirmDialogStrings.subtitle = ClientUtility.StringUtil.format(CrmService.ResourceStringProvider.getResourceString("Dialog_RemoveSiteMembers_Description"), records.length);
                    }
                    confirmDialogStrings.confirmButtonLabel = CrmService.ResourceStringProvider.getResourceString("Button_Label_OK");
                    confirmDialogStrings.cancelButtonLabel = CrmService.ResourceStringProvider.getResourceString("Button_Label_Cancel");
                    confirmDialogStrings.text = CrmService.ResourceStringProvider.getResourceString("Dialog_RemoveSiteMember_Confirmation");
                    var options = new Xrm.DialogOptions;
                    options.height = 250;
                    options.width = 500;
                    var dialogCallback = Mscrm.InternalUtilities.GridUtilities.createCallbackFunctionFactory(_this.performActionAfterRemoveMembers, [gridControl, records]);
                    Xrm.Dialog.openConfirmDialog(confirmDialogStrings, options, dialogCallback, null);
                }
                else {
                    var alertDialogStrings = new Xrm.AlertDialogStrings;
                    alertDialogStrings.text = CrmService.ResourceStringProvider.getResourceString("LOCID_ACTION_NOITEMSELECTED");
                    Xrm.Dialog.openAlertDialog(alertDialogStrings, null, null);
                }
            };
            this.performActionAfterRemoveMembers = function (returnValue, gridControl, records) {
                var updateRecords = [];
                var attributeValues = {};
                var attributeTypes = {};
                attributeValues["siteid"] = null;
                attributeTypes["siteid"] = Xrm.Objects.AttributeType.lookup;
                for (var i = 0; i < records.length; i++) {
                    if (records[i].TypeCode == CrmService.EntityTypeCodes.Equipment) {
                        var equipmentEntityReference = new Xrm.Objects.EntityReference(CrmService.EntityNames.Equipment, records[i].Id.toString());
                        var equipmentRecord = new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.EntityRecord(equipmentEntityReference, attributeValues, attributeTypes, {}, {}, new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.RelatedEntityCollection(new Array(0)));
                        equipmentRecord.get_changedFieldNames().addRange(['siteid']);
                        updateRecords.push(equipmentRecord);
                    }
                    else if (records[i].TypeCode == CrmService.EntityTypeCodes.SystemUser) {
                        var userEntityReference = new Xrm.Objects.EntityReference(CrmService.EntityNames.SystemUser, records[i].Id.toString());
                        var userRecord = new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.EntityRecord(userEntityReference, attributeValues, attributeTypes, {}, {}, new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.RelatedEntityCollection(new Array(0)));
                        userRecord.get_changedFieldNames().addRange(['siteid']);
                        updateRecords.push(userRecord);
                    }
                }
                Xrm.Internal.messages.updateMultiple(updateRecords).then(function (response) {
                    if (!Mscrm.InternalUtilities.JSTypes.isNull(gridControl)) {
                        gridControl.refresh();
                    }
                });
            };
        }
        return ResourceLegacyMainSystemLibraryWebResource;
    }());
    CrmService.ResourceLegacyMainSystemLibraryWebResource = ResourceLegacyMainSystemLibraryWebResource;
    var ResourceLegacyCommandBarActions = (function () {
        function ResourceLegacyCommandBarActions() {
            var _this = this;
            this.openResourceGroupsDialog = function () {
                var options = new Xrm.DialogOptions;
                options.height = 520;
                options.width = 520;
                var dialogParams = {};
                dialogParams[ClientUtility.MetadataDrivenDialogConstants.paramEntityId] = Xrm.Page.data.entity.getId();
                Xrm.Dialog.openDialog(CrmService.DialogName.ResourceResourceGroups, options, dialogParams);
            };
            this.ResourceGroupsDialogOnLoad = function () {
                _this._executeRetrieveRequestWhenGridLoaded("ResourceGroupsGrid", _this._executeRetrieveByResourceResourceGroupRequest);
            };
            this._executeRetrieveRequestWhenGridLoaded = function (controlName, requestMethod) {
                var gridControl = Xrm.Page.getControl(controlName);
                // Wait for grid control to load
                if (Mscrm.InternalUtilities.JSTypes.isNull(gridControl)) {
                    window.setTimeout(function () {
                        _this._executeRetrieveRequestWhenGridLoaded(controlName, requestMethod);
                    }, 10);
                    return;
                }
                // Hide grid till data is loading
                gridControl.setVisible(false);
                requestMethod();
            };
            this._executeRetrieveByResourceResourceGroupRequest = function () {
                var resourceIdAttribute = Xrm.Page.getAttribute(ClientUtility.MetadataDrivenDialogConstants.paramEntityId);
                if (!Mscrm.InternalUtilities.JSTypes.isNull(resourceIdAttribute)) {
                    var request = "";
                    request += "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                    request += "  <s:Body>";
                    request += "    <Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
                    request += "      <request i:type=\"b:RetrieveByResourceResourceGroupRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\" xmlns:b=\"http://schemas.microsoft.com/crm/2011/Contracts\">";
                    request += "        <a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
                    request += "          <a:KeyValuePairOfstringanyType>";
                    request += "            <c:key>ResourceId</c:key>";
                    request += "            <c:value i:type=\"d:guid\"  xmlns:d=\"http://schemas.microsoft.com/2003/10/Serialization/\">" + _this._xmlEncode(resourceIdAttribute.getValue().replace(/[{}]/g, "")) + "</c:value>";
                    request += "          </a:KeyValuePairOfstringanyType>";
                    request += "          <a:KeyValuePairOfstringanyType>";
                    request += "            <c:key>Query</c:key>";
                    request += "            <c:value i:type=\"a:QueryExpression\">";
                    request += "                <a:ColumnSet>";
                    request += "                  <a:AllColumns>false</a:AllColumns>";
                    request += "                  <a:Columns xmlns:e=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\" >";
                    request += "                    <e:string>resourcegroupid</e:string>";
                    request += "                  </a:Columns>";
                    request += "                </a:ColumnSet>";
                    request += "                <a:Criteria>";
                    request += "                  <a:Conditions>";
                    request += "                    <a:ConditionExpression>";
                    request += "                      <a:AttributeName>objecttypecode</a:AttributeName>";
                    request += "                      <a:Operator>Equal</a:Operator>";
                    request += "                      <a:Values xmlns:f=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\">";
                    request += "                        <f:anyType i:type=\"g:int\" xmlns:g=\"http://www.w3.org/2001/XMLSchema\">4007</f:anyType>"; //ConstraintBasedGroup
                    request += "                      </a:Values>";
                    request += "                    </a:ConditionExpression>";
                    request += "                    <a:ConditionExpression>";
                    request += "                      <a:AttributeName>grouptypecode</a:AttributeName>";
                    request += "                      <a:Operator>NotEqual</a:Operator>";
                    request += "                      <a:Values xmlns:f=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\">";
                    request += "                        <f:anyType i:type=\"g:int\" xmlns:g=\"http://www.w3.org/2001/XMLSchema\">2</f:anyType>"; //Implicit
                    request += "                      </a:Values>";
                    request += "                    </a:ConditionExpression>";
                    request += "                  </a:Conditions>";
                    request += "                  <a:FilterOperator>And</a:FilterOperator>";
                    request += "                  <a:Filters />";
                    request += "                </a:Criteria>";
                    request += "                <a:Distinct>false</a:Distinct>";
                    request += "                <a:EntityName>resourcegroup</a:EntityName>";
                    request += "                <a:LinkEntities />";
                    request += "                <a:Orders />";
                    request += "                <a:PageInfo>";
                    request += "                  <a:Count>0</a:Count>";
                    request += "                  <a:PageNumber>0</a:PageNumber>";
                    request += "                  <a:PagingCookie i:nil=\"true\" />";
                    request += "                  <a:ReturnTotalRecordCount>false</a:ReturnTotalRecordCount>";
                    request += "                </a:PageInfo>";
                    request += "                <a:NoLock>false</a:NoLock>";
                    request += "            </c:value>";
                    request += "          </a:KeyValuePairOfstringanyType>";
                    request += "        </a:Parameters>";
                    request += "        <a:RequestId i:nil=\"true\" />";
                    request += "        <a:RequestName>RetrieveByResourceResourceGroup</a:RequestName>";
                    request += "      </request>";
                    request += "    </Execute>";
                    request += "  </s:Body>";
                    request += "</s:Envelope>";
                    var req_1 = new XMLHttpRequest();
                    var clientUrl = Xrm.Page.context.getClientUrl() + "/XRMServices/2011/Organization.svc/web";
                    req_1.open("POST", clientUrl, true);
                    req_1.setRequestHeader("Accept", "application/xml, text/xml, */*");
                    req_1.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
                    req_1.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
                    req_1.onreadystatechange = function () {
                        _this._processRetrieveByResourceResourceGroupResponse(req_1);
                    };
                    req_1.send(request);
                }
            };
            this._processRetrieveByResourceResourceGroupResponse = function (req) {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        // Build array of resource group Id filters
                        var recordIdFilters = [];
                        var entities = _this._getEntitiesFromResponse(req.responseXML);
                        if (entities.length === 0) {
                            recordIdFilters[0] = "<condition attribute='constraintbasedgroupid' operator='null' />";
                        }
                        else {
                            for (var i = 0; i < entities.length; i++) {
                                for (var j = 0; j < entities[i].childNodes.length; j++) {
                                    if (entities[i].childNodes[j].localName == "Id") {
                                        recordIdFilters[i] = "<condition attribute='constraintbasedgroupid' operator='eq' uitype='constraintbasedgroup' value='{" + entities[i].childNodes[j].textContent + "}' />";
                                        break;
                                    }
                                }
                            }
                        }
                        // Perform the grid refresh
                        _this._refreshResourceGroupsGrid(recordIdFilters);
                    }
                }
            };
            this._refreshResourceGroupsGrid = function (recordIdFilters) {
                // Build fetch XML
                var fetchXml = "<fetch version='1.0' mapping='logical'>" +
                    "	<entity name='constraintbasedgroup'>" +
                    "		<attribute name='name' />" +
                    "		<order attribute='name' descending='false' />" +
                    "		<filter type='or'>" +
                    recordIdFilters.join("") +
                    "		</filter>" +
                    "		<attribute name='businessunitid' />" +
                    "		<attribute name='constraintbasedgroupid' />" +
                    "		<attribute name='grouptypecode' />" +
                    "		<filter type='or'>" +
                    "		    <condition attribute='grouptypecode' operator='ne' value='2' />" +
                    "		</filter>" +
                    "	</entity>" +
                    "</fetch>";
                // Refresh the grid
                var resourceGroupsGridGontrol = Xrm.Page.getControl("ResourceGroupsGrid");
                resourceGroupsGridGontrol.getGrid().setParameter("fetchXml", fetchXml);
                resourceGroupsGridGontrol.refresh();
                resourceGroupsGridGontrol.setVisible(true);
            };
            this.JoinGroup = function () {
                var resourceIdAttribute = Xrm.Page.getAttribute(ClientUtility.MetadataDrivenDialogConstants.paramEntityId);
                if (!Mscrm.InternalUtilities.JSTypes.isNull(resourceIdAttribute)) {
                    var global = window;
                    var lookupSelectionStatus = "multi";
                    var oTypesToAdd = "4007";
                    var parameters = new Array(resourceIdAttribute.getValue());
                    var callbackFunctionObject = global.parent.Mscrm.Utilities.createCallbackFunctionObject("performActionAfterLookUpSelect", _this, parameters, false);
                    global.parent.LookupObjectsWithCallback(callbackFunctionObject, null, lookupSelectionStatus, oTypesToAdd, 0);
                }
            };
            this.performActionAfterLookUpSelect = function (retval, resourceId) {
                var resourceGroupIds = "";
                if (!retval || retval.items.length === 0) {
                    // No resource group selected
                    return false;
                }
                else {
                    // Concatenate selected resource group IDs
                    for (var i = 0; i < retval.items.length; i++) {
                        resourceGroupIds += retval.items[i].id + ";";
                    }
                    // Trim the trailing semi-colon off of the string
                    resourceGroupIds = resourceGroupIds.substr(0, resourceGroupIds.length - 1);
                    // Execute join resource group request then refresh the grid
                    _this._executeJoinResourceGroupRequest(resourceId, resourceGroupIds);
                }
            };
            this._executeJoinResourceGroupRequest = function (resourceId, resourceGroupIds) {
                var request = "";
                request += "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                request += "  <s:Body>";
                request += "    <Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
                request += "      <request xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">";
                request += "        <a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
                request += "          <a:KeyValuePairOfstringanyType>";
                request += "            <b:key>Target</b:key>";
                request += "            <b:value i:type=\"a:EntityReference\">";
                request += "              <a:Id>" + _this._xmlEncode(resourceId) + "</a:Id>";
                request += "              <a:LogicalName>resource</a:LogicalName>";
                request += "              <a:Name i:nil=\"true\" />";
                request += "            </b:value>";
                request += "          </a:KeyValuePairOfstringanyType>";
                request += "          <a:KeyValuePairOfstringanyType>",
                    request += "            <b:key>ResourceGroups</b:key>",
                    request += "            <b:value i:type=\"c:string\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + _this._xmlEncode(resourceGroupIds) + "</b:value>",
                    request += "          </a:KeyValuePairOfstringanyType>",
                    request += "        </a:Parameters>";
                request += "        <a:RequestId i:nil=\"true\" />";
                request += "        <a:RequestName>JoinResourceGroup</a:RequestName>";
                request += "      </request>";
                request += "    </Execute>";
                request += "  </s:Body>";
                request += "</s:Envelope>";
                var req = new XMLHttpRequest();
                var clientUrl = Xrm.Page.context.getClientUrl() + "/XRMServices/2011/Organization.svc/web";
                req.open("POST", clientUrl, true);
                req.setRequestHeader("Accept", "application/xml, text/xml, */*");
                req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
                req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
                req.onreadystatechange = function () {
                    _this._processJoinResourceGroupResponse(req);
                };
                req.send(request);
            };
            this._processJoinResourceGroupResponse = function (req) {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        // Retrieve associated resource groups and refresh the grid
                        _this._executeRetrieveByResourceResourceGroupRequest();
                    }
                }
            };
            this.DepartGroup = function () {
                var resourceGroupsGridControl = Xrm.Page.getControl("ResourceGroupsGrid");
                if (!Mscrm.InternalUtilities.JSTypes.isNull(resourceGroupsGridControl)) {
                    if (resourceGroupsGridControl.getGrid().getSelectedRows().getLength() == 1) {
                        var resourceIdAttribute = Xrm.Page.getAttribute(ClientUtility.MetadataDrivenDialogConstants.paramEntityId);
                        if (!Mscrm.InternalUtilities.JSTypes.isNull(resourceIdAttribute)) {
                            _this._executeDepartResourceGroupRequest(resourceIdAttribute.getValue(), resourceGroupsGridControl.getGrid().getSelectedRows().get(0).data.entity.getId());
                        }
                    }
                }
            };
            this._executeDepartResourceGroupRequest = function (resourceId, resourceGroupId) {
                var request = "";
                request += "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                request += "  <s:Body>";
                request += "    <Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
                request += "      <request xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">";
                request += "        <a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
                request += "          <a:KeyValuePairOfstringanyType>";
                request += "            <b:key>Target</b:key>";
                request += "            <b:value i:type=\"a:EntityReference\">";
                request += "              <a:Id>" + _this._xmlEncode(resourceId) + "</a:Id>";
                request += "              <a:LogicalName>resource</a:LogicalName>";
                request += "              <a:Name i:nil=\"true\" />";
                request += "            </b:value>";
                request += "          </a:KeyValuePairOfstringanyType>";
                request += "          <a:KeyValuePairOfstringanyType>",
                    request += "            <b:key>ResourceGroup</b:key>",
                    request += "            <b:value i:type=\"c:guid\" xmlns:c=\"http://schemas.microsoft.com/2003/10/Serialization/\">" + _this._xmlEncode(resourceGroupId.replace(/[{}]/g, "")) + "</b:value>";
                request += "          </a:KeyValuePairOfstringanyType>",
                    request += "        </a:Parameters>";
                request += "        <a:RequestId i:nil=\"true\" />";
                request += "        <a:RequestName>DepartResourceGroup</a:RequestName>";
                request += "      </request>";
                request += "    </Execute>";
                request += "  </s:Body>";
                request += "</s:Envelope>";
                var req = new XMLHttpRequest();
                var clientUrl = Xrm.Page.context.getClientUrl() + "/XRMServices/2011/Organization.svc/web";
                req.open("POST", clientUrl, true);
                req.setRequestHeader("Accept", "application/xml, text/xml, */*");
                req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
                req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
                req.onreadystatechange = function () {
                    _this._processDepartResourceGroupResponse(req);
                };
                req.send(request);
            };
            this._processDepartResourceGroupResponse = function (req) {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        // Retrieve associated resource groups and refresh the grid
                        _this._executeRetrieveByResourceResourceGroupRequest();
                    }
                }
            };
            this.openServicesDialog = function () {
                var options = new Xrm.DialogOptions;
                options.height = 520;
                options.width = 520;
                var dialogParams = {};
                dialogParams[ClientUtility.MetadataDrivenDialogConstants.paramEntityId] = Xrm.Page.data.entity.getId();
                Xrm.Dialog.openDialog(CrmService.DialogName.ResourceServices, options, dialogParams);
            };
            this.ServicesDialogOnLoad = function () {
                _this._executeRetrieveRequestWhenGridLoaded("ServicesGrid", _this._executeRetrieveByResourcesServiceRequest);
            };
            this._executeRetrieveByResourcesServiceRequest = function () {
                var resourceIdAttribute = Xrm.Page.getAttribute(ClientUtility.MetadataDrivenDialogConstants.paramEntityId);
                if (!Mscrm.InternalUtilities.JSTypes.isNull(resourceIdAttribute)) {
                    var request = "";
                    request += "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
                    request += "  <s:Body>";
                    request += "    <Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
                    request += "      <request i:type=\"b:RetrieveByResourcesServiceRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\" xmlns:b=\"http://schemas.microsoft.com/crm/2011/Contracts\">";
                    request += "        <a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
                    request += "          <a:KeyValuePairOfstringanyType>";
                    request += "            <c:key>ResourceIds</c:key>";
                    request += "            <c:value xmlns:d=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\" i:type=\"d:ArrayOfguid\">";
                    request += "              <d:guid>" + _this._xmlEncode(resourceIdAttribute.getValue().replace(/[{}]/g, "")) + "</d:guid>";
                    request += "            </c:value>";
                    request += "          </a:KeyValuePairOfstringanyType>";
                    request += "          <a:KeyValuePairOfstringanyType>";
                    request += "            <c:key>Query</c:key>";
                    request += "            <c:value i:type=\"a:QueryExpression\">";
                    request += "                <a:ColumnSet>";
                    request += "                  <a:AllColumns>false</a:AllColumns>";
                    request += "                  <a:Columns xmlns:e=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\" >";
                    request += "                    <e:string>serviceid</e:string>";
                    request += "                  </a:Columns>";
                    request += "                </a:ColumnSet>";
                    request += "                <a:Criteria>";
                    request += "                  <a:Conditions />";
                    request += "                  <a:FilterOperator>And</a:FilterOperator>";
                    request += "                  <a:Filters />";
                    request += "                </a:Criteria>";
                    request += "                <a:Distinct>false</a:Distinct>";
                    request += "                <a:EntityName>service</a:EntityName>";
                    request += "                <a:LinkEntities />";
                    request += "                <a:Orders />";
                    request += "                <a:PageInfo>";
                    request += "                  <a:Count>0</a:Count>";
                    request += "                  <a:PageNumber>0</a:PageNumber>";
                    request += "                  <a:PagingCookie i:nil=\"true\" />";
                    request += "                  <a:ReturnTotalRecordCount>false</a:ReturnTotalRecordCount>";
                    request += "                </a:PageInfo>";
                    request += "                <a:NoLock>false</a:NoLock>";
                    request += "            </c:value>";
                    request += "          </a:KeyValuePairOfstringanyType>";
                    request += "        </a:Parameters>";
                    request += "        <a:RequestId i:nil=\"true\" />";
                    request += "        <a:RequestName>RetrieveByResourcesService</a:RequestName>";
                    request += "      </request>";
                    request += "    </Execute>";
                    request += "  </s:Body>";
                    request += "</s:Envelope>";
                    var req_2 = new XMLHttpRequest();
                    var clientUrl = Xrm.Page.context.getClientUrl() + "/XRMServices/2011/Organization.svc/web";
                    req_2.open("POST", clientUrl, true);
                    req_2.setRequestHeader("Accept", "application/xml, text/xml, */*");
                    req_2.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
                    req_2.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
                    req_2.onreadystatechange = function () {
                        _this._processRetrieveByResourcesServiceResponse(req_2);
                    };
                    req_2.send(request);
                }
            };
            this._processRetrieveByResourcesServiceResponse = function (req) {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        // Build array of service Id filters
                        var recordIdFilters = [];
                        var entities = _this._getEntitiesFromResponse(req.responseXML);
                        if (entities.length === 0) {
                            recordIdFilters[0] = "<condition attribute='serviceid' operator='null' />";
                        }
                        else {
                            for (var i = 0; i < entities.length; i++) {
                                for (var j = 0; j < entities[i].childNodes.length; j++) {
                                    if (entities[i].childNodes[j].localName == "Id") {
                                        recordIdFilters[i] = "<condition attribute='serviceid' operator='eq' uitype='service' value='{" + entities[i].childNodes[j].textContent + "}' />";
                                        break;
                                    }
                                }
                            }
                        }
                        // Perform the grid refresh
                        _this._refreshServicesGrid(recordIdFilters);
                    }
                }
            };
            this._refreshServicesGrid = function (recordIdFilters) {
                // Build fetch XML
                var fetchXml = "<fetch version='1.0' mapping='logical'>" +
                    "	<entity name='service'>" +
                    "		<order attribute='name' descending='false' />" +
                    "		<filter type='or'>" +
                    recordIdFilters.join("") +
                    "		</filter>" +
                    "		<filter type='or'>" +
                    "		    <condition attribute='isschedulable' operator='eq' value='1' />" +
                    "		</filter>" +
                    "		<attribute name='serviceid' />" +
                    "		<attribute name='name' />" +
                    "	</entity>" +
                    "</fetch>";
                // Refresh the grid
                var servicesGridGontrol = Xrm.Page.getControl("ServicesGrid");
                servicesGridGontrol.getGrid().setParameter("fetchXml", fetchXml);
                servicesGridGontrol.refresh();
                servicesGridGontrol.setVisible(true);
            };
            this._getEntitiesFromResponse = function (responseXml) {
                var entities = responseXml.getElementsByTagName("Entity");
                if (entities.length === 0) {
                    entities = responseXml.getElementsByTagName("a:Entity");
                }
                return entities;
            };
            this._xmlEncode = function (strInput) {
                var c;
                var XmlEncode = '';
                if (strInput == null) {
                    return null;
                }
                if (strInput == '') {
                    return '';
                }
                for (var cnt = 0; cnt < strInput.length; cnt++) {
                    c = strInput.charCodeAt(cnt);
                    if (((c > 96) && (c < 123)) ||
                        ((c > 64) && (c < 91)) ||
                        (c == 32) ||
                        ((c > 47) && (c < 58)) ||
                        (c == 46) ||
                        (c == 44) ||
                        (c == 45) ||
                        (c == 95)) {
                        XmlEncode = XmlEncode + String.fromCharCode(c);
                    }
                    else {
                        XmlEncode = XmlEncode + '&#' + c + ';';
                    }
                }
                return XmlEncode;
            };
        }
        return ResourceLegacyCommandBarActions;
    }());
    CrmService.ResourceLegacyCommandBarActions = ResourceLegacyCommandBarActions;
    var ResourceLegacyGridCommandActions = (function () {
        function ResourceLegacyGridCommandActions() {
        }
        return ResourceLegacyGridCommandActions;
    }());
    CrmService.ResourceLegacyGridCommandActions = ResourceLegacyGridCommandActions;
})(CrmService || (CrmService = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="./Legacy/ResourceLegacyLibrary.ts" />
var CrmService;
(function (CrmService) {
    'use strict';
    var Resource = (function () {
        function Resource() {
        }
        return Resource;
    }());
    Resource.CommandBarActions = new CrmService.ResourceLegacyCommandBarActions();
    Resource.GridCommandActions = new CrmService.ResourceLegacyGridCommandActions();
    Resource.Instance = new CrmService.ResourceLegacyLibrary();
    Resource.ctor = (function () {
    })();
    CrmService.Resource = Resource;
})(CrmService || (CrmService = {}));
//# sourceMappingURL=Resource_main_system_library.js.map