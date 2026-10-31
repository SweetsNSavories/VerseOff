/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var MarketingSales;
(function (MarketingSales) {
    var MetadataDrivenDialogConstants = (function () {
        function MetadataDrivenDialogConstants() {
        }
        return MetadataDrivenDialogConstants;
    }());
    MetadataDrivenDialogConstants.CampaignLookup = "campaignassociatedview_id";
    MetadataDrivenDialogConstants.LogResponseId = "cbLogResponse_id";
    MetadataDrivenDialogConstants.QualifyLeadCommandName = "QualifyLead";
    MetadataDrivenDialogConstants.QualifyStatus = "qualifyStatus";
    MetadataDrivenDialogConstants.paramQualifyStatus = "param_qualifyStatus";
    MetadataDrivenDialogConstants.ParentAccountName = "parentAccountName";
    MetadataDrivenDialogConstants.ParentAccountId = "parentAccountId";
    MetadataDrivenDialogConstants.ParentAccountLookupId = "parentAccountLookup_id";
    MetadataDrivenDialogConstants.ParentContactName = "parentContactName";
    MetadataDrivenDialogConstants.ParentContactId = "parentContactId";
    MetadataDrivenDialogConstants.ParentContactLookupId = "parentContactLookup_id";
    MetadataDrivenDialogConstants.paramParentAccountId = "param_parentAccountId";
    MetadataDrivenDialogConstants.paramParentAccountName = "param_parentAccountName";
    MetadataDrivenDialogConstants.paramParentContactId = "param_parentContactId";
    MetadataDrivenDialogConstants.paramParentContactName = "param_parentContactName";
    MetadataDrivenDialogConstants.paramTransactionCurrencyId = "param_transactioncurrencyid";
    // Constants for lead qualifcation
    MetadataDrivenDialogConstants.paramIsLeadQualificationInProgress = "param_isLeadQualificationInProgress";
    MetadataDrivenDialogConstants.requestParamQualifyLeadV2 = "param_entityReferenceSetV2Request";
    MetadataDrivenDialogConstants.responseParamQualifyLeadV2 = "param_entityReferenceSetV2Response";
    MetadataDrivenDialogConstants.showQualifiedLeadCopilotSummary = "param_showCopilotSummary";
    MetadataDrivenDialogConstants.isCopilotSummaryEnabled = "param_isCopilotSummaryEnabled";
    MetadataDrivenDialogConstants.paramQualifyLead = "param_qualifyLeadParam";
    //Constants for convert to lead MDD from email entity
    MetadataDrivenDialogConstants.firstName = "firstName";
    MetadataDrivenDialogConstants.paramFirstName = "param_firstName";
    MetadataDrivenDialogConstants.lastName = "lastName";
    MetadataDrivenDialogConstants.paramLastName = "param_lastName";
    MetadataDrivenDialogConstants.company = "company";
    MetadataDrivenDialogConstants.paramCompany = "param_company";
    MetadataDrivenDialogConstants.email = "email";
    MetadataDrivenDialogConstants.paramEmail = "param_email";
    MetadataDrivenDialogConstants.paramEntityId = "param_entityId";
    MetadataDrivenDialogConstants.paramEntityTypeCode = "param_entityTypeCode";
    MetadataDrivenDialogConstants.paramSubject = "param_subject";
    MetadataDrivenDialogConstants.paramSaveActivty = "param_saveActivity";
    MetadataDrivenDialogConstants.SaveActivityControlId = "cbSaveActivity_id";
    MetadataDrivenDialogConstants.paramOpenNewRecord = "param_openNewRecord";
    MetadataDrivenDialogConstants.OpenNewRecordControlId = "cbOpenNew_id";
    MetadataDrivenDialogConstants.paramLeadId = "param_leadId";
    MetadataDrivenDialogConstants.paramProcessInstanceId = "param_processInstanceId";
    MetadataDrivenDialogConstants.paramLastButtonClicked = "param_lastButtonClicked";
    MetadataDrivenDialogConstants.paramOwnerId = "param_ownerId";
    MetadataDrivenDialogConstants.lastButtonClicked = "lastButtonClicked";
    MetadataDrivenDialogConstants.paramEmailAddress = "param_emailAddress";
    //Convert Lead Options Dialog
    MetadataDrivenDialogConstants.isGrid = "isGrid";
    MetadataDrivenDialogConstants.paramIsGrid = "param_isGrid";
    MetadataDrivenDialogConstants.paramRecordCount = "param_recordCount";
    MetadataDrivenDialogConstants.contactFlag = "contact_flag";
    MetadataDrivenDialogConstants.accountFlag = "account_flag";
    MetadataDrivenDialogConstants.opportunityFlag = "opportunity_flag";
    MetadataDrivenDialogConstants.qualifyLead = "qualify_lead";
    MetadataDrivenDialogConstants.description = "description";
    MetadataDrivenDialogConstants.notification = "notification";
    MetadataDrivenDialogConstants.information = "information";
    MetadataDrivenDialogConstants.error = "error";
    MetadataDrivenDialogConstants.marketingSalesModule = "MarketingSales";
    MetadataDrivenDialogConstants.duplicateAccount = "entity_record_account";
    MetadataDrivenDialogConstants.duplicateContact = "entity_record_contact";
    MetadataDrivenDialogConstants.duplicateContactId = "selected_Record_contact";
    MetadataDrivenDialogConstants.duplicateAccountId = "selected_Record_account";
    MetadataDrivenDialogConstants.april2021Update = "April2021Update";
    MarketingSales.MetadataDrivenDialogConstants = MetadataDrivenDialogConstants;
    var DialogName = (function () {
        function DialogName() {
        }
        return DialogName;
    }());
    DialogName.DupWarningDialog = "DupWarningDialog";
    DialogName.convertLeadDialog = "ConvertLeadDialog";
    DialogName.convertLeadDialogV2 = "ConvertLeadDialogV2";
    DialogName.DuplicateQualifyLeadDialog = "DuplicateQualifyLeadDialog";
    MarketingSales.DialogName = DialogName;
})(MarketingSales || (MarketingSales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var MarketingSales;
(function (MarketingSales) {
    var EntityNames = (function () {
        function EntityNames() {
        }
        return EntityNames;
    }());
    EntityNames.Account = "account";
    EntityNames.Appointment = "appointment";
    // ToDo: this should be in Marketing; avoiding that dependency for now, 
    // since Marketing does not use ClassicWeb / UCI type definitions yet; which 
    // would cause compile issues.
    EntityNames.BulkOperation = "bulkoperation";
    EntityNames.Campaign = "campaign";
    EntityNames.CampaignActivity = "campaignactivity";
    EntityNames.CampaignResponse = "campaignresponse";
    EntityNames.Contact = "contact";
    EntityNames.Email = "email";
    EntityNames.Fax = "fax";
    // ToDo: this should be in Marketing; avoiding that dependency for now, 
    // since Marketing does not use ClassicWeb / UCI type definitions yet; which 
    // would cause compile issues.
    EntityNames.Lead = "lead";
    EntityNames.Letter = "letter";
    EntityNames.Organization = "organization";
    EntityNames.PhoneCall = "phonecall";
    EntityNames.RecurringAppointmentMaster = "recurringappointmentmaster";
    EntityNames.SystemUser = "systemuser";
    EntityNames.Task = "task";
    EntityNames.TransactionCurrency = "transactioncurrency";
    EntityNames.UnresolvedAddress = "unresolvedaddress";
    EntityNames.Opportunity = "opportunity";
    EntityNames.AgentUsage = "msdyn_salesagentusage";
    MarketingSales.EntityNames = EntityNames;
})(MarketingSales || (MarketingSales = {}));
var MarketingSales;
(function (MarketingSales) {
    var EntityTypeCodes;
    (function (EntityTypeCodes) {
        EntityTypeCodes[EntityTypeCodes["Appointment"] = 4201] = "Appointment";
        EntityTypeCodes[EntityTypeCodes["Campaign"] = 4400] = "Campaign";
        EntityTypeCodes[EntityTypeCodes["CampaignResponse"] = 4401] = "CampaignResponse";
        EntityTypeCodes[EntityTypeCodes["BulkOperation"] = 4406] = "BulkOperation";
        EntityTypeCodes[EntityTypeCodes["CampaignActivity"] = 4402] = "CampaignActivity";
        EntityTypeCodes[EntityTypeCodes["Email"] = 4202] = "Email";
        EntityTypeCodes[EntityTypeCodes["Fax"] = 4204] = "Fax";
        EntityTypeCodes[EntityTypeCodes["Letter"] = 4207] = "Letter";
        EntityTypeCodes[EntityTypeCodes["PhoneCall"] = 4210] = "PhoneCall";
        EntityTypeCodes[EntityTypeCodes["RecurringAppointmentMaster"] = 4251] = "RecurringAppointmentMaster";
        EntityTypeCodes[EntityTypeCodes["SystemUser"] = 8] = "SystemUser";
        EntityTypeCodes[EntityTypeCodes["Task"] = 4212] = "Task";
    })(EntityTypeCodes = MarketingSales.EntityTypeCodes || (MarketingSales.EntityTypeCodes = {}));
})(MarketingSales || (MarketingSales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../../TypeDefinitions/MarketingSales/Localization/ResourceStringProvider.d.ts" />
/*
 * Invokes the ResourceStringProvider if available; otherwise returns *key*.
 * Using this class as a proxy for the ResourceStringProvider that is included per web dependency declaration
 * in order to avoid null reference errors in case the dependency is not loaded for some reason.
 */
var MarketingSales;
(function (MarketingSales) {
    var StringProvider = (function () {
        function StringProvider() {
        }
        StringProvider.getResourceString = function (key) {
            return MarketingSales.ResourceStringProvider ? MarketingSales.ResourceStringProvider.getResourceString(key) : "*" + key + "*";
        };
        return StringProvider;
    }());
    MarketingSales.StringProvider = StringProvider;
})(MarketingSales || (MarketingSales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../../TypeDefinitions/Sales/ClientCommon/Sales_ClientCommon.d.ts" />
/// <reference path="../../ClientCommon/MetadataDrivenDialogConstants.ts" />
/// <reference path="../../ClientCommon/EntityNames.ts" />
/// <reference path="../../ClientCommon/EntityTypeCodes.ts" />
/// <reference path="../../Localization/Provider/StringProvider.ts" />
/// <reference path="../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../../../TypeDefinitions/Sales/CommandBarActions/SalesCommandBarActions.d.ts" />
/// <reference path="../../../../TypeDefinitions/AppCommon/ClientCommon/AppCommon_ClientCommon.d.ts" />
var MarketingSales;
(function (MarketingSales) {
    var MarketingSalesCommandBarActions = (function () {
        function MarketingSalesCommandBarActions() {
            var _this = this;
            this.entityName = null;
            this.convertActivityOnLoad = function (context) {
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                if (ClientUtility.ClientUtil.isMobileOffline() && !Xrm.Mobile.offline.isOfflineEnabled(MarketingSales.EntityNames.Campaign)) {
                    var logResponseCampaignControl = Xrm.Page.getControl(Sales.MetadataDrivenDialogConstants.LogResponseId);
                    logResponseCampaignControl.setDisabled(true);
                    var campaignLookup = Xrm.Page.getControl(MarketingSales.MetadataDrivenDialogConstants.CampaignLookup);
                    campaignLookup.setDisabled(true);
                }
                _this.salesCommandActions.convertActivityOnLoad(context);
            };
            this.prefillControlfromParameter = function (control, value) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(value)) {
                    ClientUtility.PageUtil.setControlValue(control, value);
                }
            };
            this.convertLeadOnLoad = function (context) {
                var firstNameValue = ClientUtility.DialogUtil.getAttributeValue(MarketingSales.MetadataDrivenDialogConstants.paramFirstName);
                _this.prefillControlfromParameter(MarketingSales.MetadataDrivenDialogConstants.firstName, firstNameValue);
                var lastNameValue = ClientUtility.DialogUtil.getAttributeValue(MarketingSales.MetadataDrivenDialogConstants.paramLastName);
                _this.prefillControlfromParameter(MarketingSales.MetadataDrivenDialogConstants.lastName, lastNameValue);
                var companyValue = ClientUtility.DialogUtil.getAttributeValue(MarketingSales.MetadataDrivenDialogConstants.paramCompany);
                _this.prefillControlfromParameter(MarketingSales.MetadataDrivenDialogConstants.company, companyValue);
                var emailValue = ClientUtility.DialogUtil.getAttributeValue(MarketingSales.MetadataDrivenDialogConstants.paramEmail);
                _this.prefillControlfromParameter(MarketingSales.MetadataDrivenDialogConstants.email, emailValue);
            };
            this.getTransactionCurrency = function (callback) {
                if (ClientUtility.ClientUtil.isMobileOffline()) {
                    var currencyValues = Xrm.Utility.getGlobalContext().userSettings.transactionCurrencyId;
                    callback(currencyValues);
                }
                else {
                    var that = _this;
                    var retrieveUserDefaultCurrencyRequest = new ODataContract.RetrieveUserDefaultCurrencyRequest();
                    retrieveUserDefaultCurrencyRequest.entityset = "transactioncurrency";
                    Xrm.WebApi.online.execute(retrieveUserDefaultCurrencyRequest).then(function (r) {
                        r.json().then(function (response) {
                            if (!ClientUtility.DataUtil.isNullOrUndefined(response)) {
                                var currencyValues = response.transactioncurrencyid;
                                callback(currencyValues);
                            }
                        });
                    });
                }
            };
            this.convertActivityClick = function (context) {
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                var entityTypeCode = parseInt(formContext.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.EntityTypeCode).getValue().toString());
                if (ClientUtility.ClientUtil.isMobileOffline()) {
                    _this.entityName = Xrm.Internal.getEntityName(entityTypeCode);
                    if (!Xrm.Mobile.offline.isOfflineEnabled(_this.entityName)) {
                        ClientUtility.DialogUtil.showMoCAOfflineError();
                        return;
                    }
                }
                var errorString = { text: "", confirmButtonLabel: "OK" };
                var customer = null;
                var currency = null;
                var campaignId = "";
                var campaignTypeCode = 0;
                var subject = "";
                var entityId = "";
                var ownerId = "";
                var ownerTypeCode = 0;
                var ownerName = "";
                var leadId = "";
                var saveActivity = "false";
                var openNewRecord = "false";
                var entityName = "";
                var typeCode = 0;
                var customerLookup = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstants.CustomerLookup);
                var selectedItem = !ClientUtility.DataUtil.isNullOrUndefined(customerLookup) ? customerLookup.getValue() : null;
                if (ClientUtility.DataUtil.isNullOrUndefined(selectedItem) || !selectedItem.length) {
                    errorString.text = MarketingSales.StringProvider.getResourceString("Alert_Conv_Act_Customer_Must");
                    Xrm.Navigation.openAlertDialog(errorString, null);
                    return;
                }
                else {
                    customer = selectedItem[0];
                    entityName = selectedItem[0].entityType;
                    typeCode = Sales.ClientUtil.getEntityTypeCodes(entityName);
                }
                var currencyLookup = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstants.CurrencyLookup);
                selectedItem = !ClientUtility.DataUtil.isNullOrUndefined(currencyLookup) ? currencyLookup.getValue() : null;
                if (ClientUtility.DataUtil.isNullOrUndefined(selectedItem) || !selectedItem.length) {
                    errorString.text = MarketingSales.StringProvider.getResourceString("Alert_Conv_Act_Currency_Must");
                    Xrm.Navigation.openAlertDialog(errorString, null);
                    return;
                }
                else {
                    currency = selectedItem[0];
                }
                var logResponseItemChecked = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstants.LogResponseId);
                var logResponse = logResponseItemChecked.getValue();
                if (logResponse) {
                    var campaignAlertLookup = Xrm.Page.data.attributes.get(MarketingSales.MetadataDrivenDialogConstants.CampaignLookup);
                    var selectedItem = campaignAlertLookup.getValue();
                    if (ClientUtility.DataUtil.isNullOrUndefined(selectedItem) || !selectedItem.length) {
                        errorString.text = MarketingSales.StringProvider.getResourceString("Alert_Conv_Act_Campaign_Must");
                        Xrm.Navigation.openAlertDialog(errorString, null);
                        return;
                    }
                }
                Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.LastButtonClicked).setValue(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                var campaignLookup = Xrm.Page.data.attributes.get(MarketingSales.MetadataDrivenDialogConstants.CampaignLookup);
                selectedItem = !ClientUtility.DataUtil.isNullOrUndefined(campaignLookup) ? campaignLookup.getValue() : null;
                if (!ClientUtility.DataUtil.isNullOrUndefined(selectedItem) && selectedItem.length) {
                    campaignId = selectedItem[0].id;
                    campaignTypeCode = ClientUtility.EntityUtils.getEntityTypeCode(selectedItem[0].entityType, MarketingSales.EntityNames, MarketingSales.EntityTypeCodes);
                }
                if (!ClientUtility.DataUtil.isNullOrUndefined(formContext.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.Subject).getValue())) {
                    subject = decodeURIComponent(formContext.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.Subject).getValue().toString());
                }
                entityId = formContext.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.EntityId).getValue().toString();
                ownerId = decodeURIComponent(formContext.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.OwnerId).getValue().toString());
                var ownerType = decodeURIComponent(formContext.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.OwnerType).getValue().toString());
                if (!ClientUtility.DataUtil.isNullOrUndefined(formContext.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.OwnerName).getValue())) {
                    ownerName = formContext.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.OwnerName).getValue().toString();
                }
                var saveActivityItemChecked = formContext.data.attributes.get(Sales.MetadataDrivenDialogConstants.SaveActivityId).getValue();
                if (saveActivityItemChecked) {
                    saveActivity = "true";
                }
                var openNewItemChecked = formContext.data.attributes.get(Sales.MetadataDrivenDialogConstants.OpenNewId).getValue();
                if (openNewItemChecked) {
                    openNewRecord = "true";
                }
                ClientUtility.DialogUtil.showProgressMessage();
                if (ClientUtility.ClientUtil.isMobileOffline()) {
                    var opportunityRecord = _this.getOpportunityEntityRecord(subject, entityId, entityTypeCode, customer.id, typeCode, ownerId, ownerType, leadId, currency.id, campaignId, MarketingSales.EntityTypeCodes.Campaign, ownerName);
                    _this.salesCommandActions.offlineConvertActivity(entityId, entityTypeCode, opportunityRecord, saveActivity, openNewRecord, currency, customer);
                }
                else {
                    var that = _this;
                    _this.convertToOpportunity(function (response) {
                        response.json().then(function (json) {
                            var oppId = json.RecordId.toString();
                            that.salesCommandActions.postConvertActivity(oppId, saveActivity, openNewRecord);
                        });
                    }, function (response) {
                        ClientUtility.DialogUtil.hideProgressMessage();
                        ClientUtility.ActionFailedHandler.actionFailedCallback(response);
                    }, subject, entityId, entityTypeCode, customer.id, typeCode, ownerId, ownerType, leadId, currency.id, campaignId, campaignTypeCode, logResponse, ownerName);
                }
            };
            this.getOpportunityEntityRecord = function (targetEntitySubject, activityId, activityTypeCode, customerId, customerTypeCode, ownerId, ownerType, leadId, currencyId, campaignId, campaignTypeCode, ownerName) {
                var opportunity = {};
                opportunity["opportunityid"] = ClientUtility.Guid.newGuid();
                opportunity["@odata.type"] = "#Microsoft.Dynamics.CRM.opportunity";
                opportunity["name"] = targetEntitySubject;
                if (customerId) {
                    if (customerTypeCode === Sales.EntityTypeCodes.Account) {
                        opportunity["customerid_account@odata.bind"] = "/accounts(" + ClientUtility.Guid.create(customerId) + ")";
                    }
                    else if (customerTypeCode === Sales.EntityTypeCodes.Contact) {
                        opportunity["customerid_contact@odata.bind"] = "/contacts(" + ClientUtility.Guid.create(customerId) + ")";
                    }
                }
                if (campaignId) {
                    opportunity["campaignid@odata.bind"] = "/campaigns(" + ClientUtility.Guid.create(campaignId) + ")";
                }
                if (currencyId) {
                    opportunity["transactioncurrencyid@odata.bind"] = "/transactioncurrencies(" + ClientUtility.Guid.create(currencyId) + ")";
                }
                if (leadId) {
                    opportunity["originatingleadid@odata.bind"] = "/leads(" + ClientUtility.Guid.create(leadId) + ")";
                }
                if (ownerId && ownerType == "systemuser") {
                    opportunity["ownerid@odata.bind"] = "/systemusers(" + ClientUtility.Guid.create(decodeURIComponent(ownerId)) + ")";
                }
                if (ownerId && ownerType == "team") {
                    opportunity["ownerid@odata.bind"] = "/teams(" + ClientUtility.Guid.create(decodeURIComponent(ownerId)) + ")";
                }
                return opportunity;
            };
            this.convertToOpportunity = function (successCallback, errorCallback, targetEntitySubject, activityId, activityTypeCode, customerId, customerTypeCode, ownerId, ownerType, leadId, currencyId, campaignId, campaignTypeCode, logResponse, ownerName) {
                var opportunityRecord = _this.getOpportunityEntityRecord(targetEntitySubject, activityId, activityTypeCode, customerId, customerTypeCode, ownerId, ownerType, leadId, currencyId, campaignId, campaignTypeCode, ownerName);
                _this.entityName = Xrm.Internal.getEntityName(activityTypeCode);
                var convertActivityRequest = new ODataContract.ConvertActivityRequest({ guid: activityId }, Xrm.Internal.getEntityName(activityTypeCode), opportunityRecord, Sales.EntityNames.Opportunity, logResponse);
                Xrm.WebApi.online.execute(convertActivityRequest).then(successCallback, errorCallback);
            };
            this.setRelatedCampaign = function () {
                var closedCampaignResponse = Xrm.Page.data.attributes.get("cbLogResponse_id");
                var relatedCampaign = Xrm.Page.data.attributes.get("campaignassociatedview_id");
                if (!ClientUtility.DataUtil.isNullOrUndefined(closedCampaignResponse) &&
                    !ClientUtility.DataUtil.isNullOrUndefined(relatedCampaign))
                    if (closedCampaignResponse.getValue()) {
                        relatedCampaign.setRequiredLevel(Xrm.Constants.AttributeRequiredLevels.required);
                    }
                    else {
                        relatedCampaign.setRequiredLevel(Xrm.Constants.AttributeRequiredLevels.none);
                    }
            };
            // Convert an activity to an opportunity
            this.convertToOpportunityActivity = function (iObjType) {
                // Alert the user if the form is not saved
                if (Xrm.Page.data.entity.getIsDirty()) {
                    Xrm.Navigation.openAlertDialog({
                        text: MarketingSales.StringProvider.getResourceString("ConvActSaveWarning")
                    });
                    // skip the convert to opportunity
                    return false;
                }
                if (Xrm.Page.data.isValid()) {
                    // Get the direction code control
                    var _directionCodeCtrl = Xrm.Page.data.entity.attributes.get("directioncode");
                    var directionCodeVal = true;
                    if (!ClientUtility.DataUtil.isNullOrUndefined(_directionCodeCtrl)) {
                        var directionCodeValue = _directionCodeCtrl.getValue();
                        directionCodeVal = (directionCodeValue === "0" || !directionCodeValue) ? false : true;
                    }
                    var customerItems = null;
                    var secondaryCust = null;
                    var sUrlElement = "";
                    sUrlElement += "activityType=" + encodeURIComponent(iObjType);
                    if (directionCodeVal === true) {
                        var _to = Xrm.Page.data.entity.attributes.get('to');
                        // Outgoing
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_to)) {
                            customerItems = _to.getValue();
                        }
                        if (ClientUtility.DataUtil.isNullOrUndefined(customerItems)) {
                            customerItems = new Array();
                        }
                        var _cc = Xrm.Page.data.entity.attributes.get('cc');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_cc)) {
                            secondaryCust = _cc.getValue();
                            if (!ClientUtility.DataUtil.isNullOrUndefined(secondaryCust)) {
                                for (var i = 0; i < secondaryCust.length; i++) {
                                    customerItems[customerItems.length] = secondaryCust[i];
                                }
                            }
                        }
                        var _bcc = Xrm.Page.data.entity.attributes.get('bcc');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_bcc)) {
                            secondaryCust = _bcc.getValue();
                            if (!ClientUtility.DataUtil.isNullOrUndefined(secondaryCust)) {
                                for (var i = 0; i < secondaryCust.length; i++) {
                                    customerItems[customerItems.length] = secondaryCust[i];
                                }
                            }
                        }
                    }
                    else if (directionCodeVal === false) {
                        // Incoming
                        var _from = Xrm.Page.data.entity.attributes.get('from');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_from)) {
                            customerItems = _from.getValue();
                        }
                    }
                    // Appointment has attendees
                    if (iObjType === Sales.EntityTypeCodes.Appointment || iObjType === Sales.EntityTypeCodes.RecurringAppointmentMaster) {
                        var _requiredattendees = Xrm.Page.data.entity.attributes.get('requiredattendees');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_requiredattendees)) {
                            customerItems = _requiredattendees.getValue();
                        }
                        if (ClientUtility.DataUtil.isNullOrUndefined(customerItems)) {
                            customerItems = new Array();
                        }
                        var _optionalattendees = Xrm.Page.data.entity.attributes.get('optionalattendees');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_optionalattendees)) {
                            secondaryCust = _optionalattendees.getValue();
                            if (!ClientUtility.DataUtil.isNullOrUndefined(secondaryCust)) {
                                for (var i = 0; i < secondaryCust.length; i++) {
                                    customerItems[customerItems.length] = secondaryCust[i];
                                }
                            }
                        }
                    }
                    else if (iObjType === Sales.EntityTypeCodes.Task) {
                        var _regardingobjectid = Xrm.Page.data.entity.attributes.get('regardingobjectid');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_regardingobjectid) && !ClientUtility.DataUtil.isNullOrUndefined(_regardingobjectid.getValue())) {
                            customerItems = _regardingobjectid.getValue();
                        }
                    }
                    // We have to find the first valid customer
                    if (!ClientUtility.DataUtil.isNullOrUndefined(customerItems)) {
                        // call the GetValidcustomer for the first time
                        _this.getValidCustomer(customerItems, sUrlElement, iObjType, 0, "opportunity");
                    }
                }
                _this.salesCommandActions.refreshParentGrid(iObjType);
            };
            this.getValidCustomer = function (customerItems, sUrlElement, iObjType, customerNo, customerType) {
                if (customerNo === customerItems.length) {
                    return _this.getValidCustomerSuccess(sUrlElement, iObjType, customerItems, customerType, "");
                }
                try {
                    var isValidCustomer = true;
                    // for convert to lead only lead is valid for customer
                    if ((!ClientUtility.DataUtil.isNullOrUndefined(customerType)
                        && customerType === "lead") && (customerItems[customerNo].entityType !== Sales.EntityNames.Lead)) {
                        isValidCustomer = false;
                    }
                    // we check for either contact or account for convert to case/opportunity
                    if ((!ClientUtility.DataUtil.isNullOrUndefined(customerType) && customerType !== "lead") &&
                        (customerItems[customerNo].entityType !== Sales.EntityNames.Account
                            && customerItems[customerNo].entityType !== Sales.EntityNames.Contact)) {
                        isValidCustomer = false;
                    }
                    if (!isValidCustomer) {
                        return _this.getValidCustomer(customerItems, sUrlElement, iObjType, customerNo + 1, customerType);
                    }
                    if (ClientUtility.ClientUtil.isMobileOffline()) {
                        // Populating the customer attributes in case of moca offline from form data
                        sUrlElement += _this.salesCommandActions.appendValidCustomerAttributes(customerItems, customerNo, customerType);
                        return _this.getValidCustomerSuccess(sUrlElement, iObjType, customerItems, customerType, "");
                    }
                    else {
                        Xrm.WebApi.retrieveRecord(customerItems[customerNo].entityType, customerItems[customerNo].id, ClientUtility.ODataUtil.getSelectOption(['statecode'])).then(function (response) {
                            if (!ClientUtility.DataUtil.isNullOrUndefined(response)) {
                                if (!ClientUtility.DataUtil.isNullOrUndefined(response.statecode) && response.statecode.toString() === '0') {
                                    // the customer is active
                                    sUrlElement += _this.salesCommandActions.appendValidCustomerAttributes(customerItems, customerNo, customerType);
                                    return _this.getValidCustomerSuccess(sUrlElement, iObjType, customerItems, customerType, "");
                                }
                                return _this.getValidCustomer(customerItems, sUrlElement, iObjType, customerNo + 1, customerType);
                            }
                            else {
                                // This code is added only to retain the behaviour of CRM2011 where dialog box opens even if contact is inactive
                                // If we have reached here, it means that the customer we looked into was inactive, so go ahead and find the next valid customer
                                return _this.getValidCustomer(customerItems, sUrlElement, iObjType, customerNo + 1, customerType);
                            }
                        }, function (response) {
                            // the call failed because of some reason, just increase the number of customers processed and if all customers are processed, call GetValidCustomerSuccess anyways
                            return _this.getValidCustomer(customerItems, sUrlElement, iObjType, customerNo + 1, customerType);
                        });
                    }
                }
                catch (e) { }
            };
            this.getValidCustomerSuccess = function (sUrlElement, iObjType, customerItems, customerType, entityId) {
                // the first customerType = "opportunity" denotes that the call has come from opportunity and not form case hence we need to call the GetValidForConvertToOpportunity
                if (customerType === "opportunity") {
                    return _this.getValidForConvertToOpportunity(sUrlElement, iObjType, customerItems);
                }
                else if (customerType === "lead") {
                    return _this.getValidForConvertToOpportunityWithLead(sUrlElement, iObjType);
                }
                _this.salesCommandActions.refreshParentGrid(iObjType);
            };
            this.getValidForConvertToOpportunity = function (sUrlElement, iObjType, customerItems) {
                // if customer has been found customer Id will be set
                if (sUrlElement.indexOf("customerId") === -1) {
                    _this.getValidCustomer(customerItems, sUrlElement, iObjType, 0, "lead");
                }
                else {
                    // customer is already present, no need to add lead anymore we can direct call into lead success
                    _this.getValidForConvertToOpportunityWithLead(sUrlElement, iObjType);
                }
            };
            this.getValidForConvertToOpportunityWithLead = function (sUrlElement, iObjType) {
                // Get the regarding object control
                var regardingCtrl = Xrm.Page.data.entity.attributes.get('regardingobjectid');
                if (!ClientUtility.DataUtil.isNullOrUndefined(regardingCtrl)) {
                    // Get the regarding items
                    var regardingItems = regardingCtrl.getValue();
                    // Make sure there is only one regarding
                    if (!ClientUtility.DataUtil.isNullOrUndefined(regardingItems) && regardingItems.length === 1) {
                        // Only CampaignActivity and Quick-Campaign (BulkOperation) types pass the campaign information
                        if ((regardingItems[0].entityType === MarketingSales.EntityNames.CampaignActivity) ||
                            (regardingItems[0].entityType === MarketingSales.EntityNames.BulkOperation)) {
                            sUrlElement += "&campaignId=" + encodeURIComponent(regardingItems[0].id) +
                                "&campaignType=" + encodeURIComponent(regardingItems[0].entityType) +
                                "&campaignName=" + encodeURIComponent(regardingItems[0].name);
                        }
                    }
                }
                var subjectField = "";
                var _subject = Xrm.Page.data.entity.attributes.get("subject");
                if (!ClientUtility.DataUtil.isNullOrUndefined(_subject.getValue())) {
                    subjectField = _subject.getValue();
                }
                var ownerId = "";
                var ownerType = "";
                var ownerCtrl = Xrm.Page.data.entity.attributes.get("ownerid");
                if (!ClientUtility.DataUtil.isNullOrUndefined(ownerCtrl)) {
                    var dataVal = ownerCtrl.getValue();
                    if (dataVal[0]) {
                        ownerId = dataVal[0].id;
                        ownerType = dataVal[0].entityType;
                    }
                }
                sUrlElement += "&subject=" + subjectField;
                sUrlElement += "&ownerId=" + ownerId;
                sUrlElement += "&ownerType=" + ownerType;
                _this.convertActivityPreload(sUrlElement, iObjType);
                _this.salesCommandActions.refreshParentGrid(iObjType);
            };
            this.convertActivityPreload = function (element, iObjType) {
                _this.entityName = Xrm.Internal.getEntityName(parseInt(iObjType));
                if (ClientUtility.ClientUtil.isMobileOffline() &&
                    !Xrm.Mobile.offline.isOfflineEnabled(_this.entityName)) {
                    ClientUtility.DialogUtil.showMoCAOfflineError();
                    return;
                }
                ClientUtility.DialogUtil.showProgressMessage();
                if (ClientUtility.ClientUtil.isMobileOffline()) {
                    var currencyValues = Xrm.Utility.getGlobalContext().userSettings.transactionCurrencyId;
                    _this.convertActivityPreloadWithCurrency(element, iObjType, currencyValues);
                }
                else {
                    var that = _this;
                    var retrieveUserDefaultCurrencyRequest = new ODataContract.RetrieveUserDefaultCurrencyRequest();
                    retrieveUserDefaultCurrencyRequest.entityset = "transactioncurrency";
                    Xrm.WebApi.online.execute(retrieveUserDefaultCurrencyRequest).then(function (r) {
                        r.json().then(function (response) {
                            if (!ClientUtility.DataUtil.isNullOrUndefined(response)) {
                                var currencyValues = response.transactioncurrencyid;
                                that.convertActivityPreloadWithCurrency(element, iObjType, currencyValues);
                            }
                            else {
                                ClientUtility.DialogUtil.hideProgressMessage();
                            }
                        });
                    }, function (response) {
                        ClientUtility.DialogUtil.hideProgressMessage();
                        ClientUtility.ActionFailedHandler.actionFailedCallback(response);
                    });
                }
            };
            this.convertActivityPreloadWithCurrency = function (element, iObjType, currencyValues) {
                var dialogParams = {};
                _this.salesCommandActions.setCurrencyAndCustomerDialogParams(currencyValues, element, dialogParams);
                if (element.indexOf("leadId") !== -1) {
                    var leadId = ClientUtility.CommandBarUtils.getElementValue(element, "leadId");
                    var leadName = ClientUtility.CommandBarUtils.getElementValue(element, "leadName");
                    var leadLookup = {};
                    leadLookup.id = decodeURIComponent(leadId);
                    leadLookup.name = decodeURIComponent(leadName);
                    leadLookup.entityType = MarketingSales.EntityNames.Lead;
                    var leadLookupParams = [];
                    leadLookupParams[0] = leadLookup;
                    dialogParams[Sales.MetadataDrivenDialogConstants.LeadLookup] = leadLookupParams;
                    dialogParams[Sales.MetadataDrivenDialogConstants.LeadId] = decodeURIComponent(leadId);
                }
                if (element.indexOf("campaignId") !== -1) {
                    var campaignActivityId = decodeURIComponent(ClientUtility.CommandBarUtils.getElementValue(element, "campaignId").toString());
                    var tableName = decodeURIComponent(ClientUtility.CommandBarUtils.getElementValue(element, "campaignType"));
                    var columns = ['_regardingobjectid_value'];
                    Xrm.WebApi.retrieveRecord(tableName, campaignActivityId, ClientUtility.ODataUtil.getSelectOption(columns)).then(function (retrieveResponse) {
                        if (!ClientUtility.DataUtil.isNullOrUndefined(retrieveResponse)) {
                            if (!ClientUtility.DataUtil.isNullOrUndefined(retrieveResponse[columns[0]])) {
                                var campaignId = retrieveResponse[columns[0]];
                                var campaignName = retrieveResponse[columns[0] + '@OData.Community.Display.V1.FormattedValue'];
                                var campaignLookup = {};
                                campaignLookup.id = campaignId;
                                campaignLookup.name = campaignName;
                                campaignLookup.entityType = tableName;
                                dialogParams[MarketingSales.MetadataDrivenDialogConstants.CampaignLookup] = [];
                            }
                            _this.salesCommandActions.setConvertActivityParameterAndLaunchDialog(dialogParams, element, iObjType);
                        }
                        else {
                            ClientUtility.DialogUtil.hideProgressMessage();
                        }
                    }, ClientUtility.ActionFailedHandler.actionFailedCallback);
                }
                else
                    _this.salesCommandActions.setConvertActivityParameterAndLaunchDialog(dialogParams, element, iObjType);
            };
            this.dialogClose = function (context) {
                _this.salesCommandActions.dialogClose(context);
            };
            this.convertToLeadActivity = function (iObjType) {
                if (Xrm.Page.data.entity.getIsDirty()) {
                    Xrm.Navigation.openAlertDialog({
                        text: MarketingSales.StringProvider.getResourceString("ConvActSaveWarning")
                    });
                    return false;
                }
                if (ClientUtility.ClientUtil.isMobileOffline()) {
                    return;
                }
                if (Xrm.Page.data.isValid()) {
                    var customerItems = null;
                    var customer = null;
                    if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data.entity.attributes.get("directioncode"))) {
                        if (Xrm.Page.data.entity.attributes.get("directioncode").getValue()) {
                            // Outgoing emails
                            var _to = Xrm.Page.data.entity.attributes.get('to');
                            if (!ClientUtility.DataUtil.isNullOrUndefined(_to)) {
                                customerItems = _to.getValue();
                                if (!ClientUtility.DataUtil.isNullOrUndefined(customerItems) && customerItems.length > 0)
                                    customer = customerItems[0];
                            }
                            var _cc = Xrm.Page.data.entity.attributes.get('cc');
                            if (!ClientUtility.DataUtil.isNullOrUndefined(_cc) && ClientUtility.DataUtil.isNullOrUndefined(customer)) {
                                customerItems = _cc.getValue();
                                if (!ClientUtility.DataUtil.isNullOrUndefined(customerItems) && customerItems.length > 0)
                                    customer = customerItems[0];
                            }
                            var _bcc = Xrm.Page.data.entity.attributes.get('bcc');
                            if (!ClientUtility.DataUtil.isNullOrUndefined(_bcc) && ClientUtility.DataUtil.isNullOrUndefined(customer)) {
                                customerItems = _bcc.getValue();
                                if (!ClientUtility.DataUtil.isNullOrUndefined(customerItems) && customerItems.length > 0)
                                    customer = customerItems[0];
                            }
                        }
                        else {
                            //Incoming emails
                            var _from = Xrm.Page.data.entity.attributes.get('from');
                            if (!ClientUtility.DataUtil.isNullOrUndefined(_from)) {
                                customerItems = _from.getValue();
                                if (!ClientUtility.DataUtil.isNullOrUndefined(customerItems) && customerItems.length > 0)
                                    customer = customerItems[0];
                            }
                        }
                    }
                    if (!ClientUtility.DataUtil.isNullOrUndefined(customer)) {
                        if (customer.entityType === MarketingSales.EntityNames.Account
                            || customer.entityType === MarketingSales.EntityNames.Contact
                            || customer.entityType === MarketingSales.EntityNames.Lead
                            || customer.entityType === MarketingSales.EntityNames.SystemUser) {
                            var optionArray = new Array();
                            switch (customer.entityType) {
                                case MarketingSales.EntityNames.Account:
                                    optionArray = ['name', 'emailaddress1', 'emailaddress2', 'emailaddress3'];
                                    break;
                                case MarketingSales.EntityNames.Contact:
                                    optionArray = ['firstname', 'lastname', 'emailaddress1', 'emailaddress2', 'emailaddress3'];
                                    break;
                                case MarketingSales.EntityNames.Lead:
                                    optionArray = ['firstname', 'lastname', 'emailaddress1', 'emailaddress2', 'emailaddress3'];
                                    break;
                                case MarketingSales.EntityNames.SystemUser:
                                    optionArray = ['firstname', 'lastname', 'internalemailaddress'];
                                    break;
                            }
                            Xrm.WebApi.retrieveRecord(customer.entityType, customer.id, ClientUtility.ODataUtil.getSelectOption(optionArray)).then(function (response) {
                                if (!ClientUtility.DataUtil.isNullOrUndefined(response)) {
                                    var dialogParams = {};
                                    if (!ClientUtility.DataUtil.isNullOrUndefined(response.name)) {
                                        dialogParams[MarketingSales.MetadataDrivenDialogConstants.paramLastName] = response.name;
                                    }
                                    if (!ClientUtility.DataUtil.isNullOrUndefined(response.firstname)) {
                                        dialogParams[MarketingSales.MetadataDrivenDialogConstants.paramFirstName] = response.firstname;
                                    }
                                    if (!ClientUtility.DataUtil.isNullOrUndefined(response.lastname)) {
                                        dialogParams[MarketingSales.MetadataDrivenDialogConstants.paramLastName] = response.lastname;
                                    }
                                    if (!ClientUtility.DataUtil.isNullOrUndefined(response.emailaddress1)) {
                                        dialogParams[MarketingSales.MetadataDrivenDialogConstants.paramEmail] = response.emailaddress1;
                                    }
                                    else if (!ClientUtility.DataUtil.isNullOrUndefined(response.emailaddress2)) {
                                        dialogParams[MarketingSales.MetadataDrivenDialogConstants.paramEmail] = response.emailaddress2;
                                    }
                                    else if (!ClientUtility.DataUtil.isNullOrUndefined(response.emailaddress3)) {
                                        dialogParams[MarketingSales.MetadataDrivenDialogConstants.paramEmail] = response.emailaddress3;
                                    }
                                    else if (!ClientUtility.DataUtil.isNullOrUndefined(response.internalemailaddress)) {
                                        dialogParams[MarketingSales.MetadataDrivenDialogConstants.paramEmail] = response.internalemailaddress;
                                    }
                                    _this.setConvertToLeadDialogParameter(dialogParams, iObjType);
                                }
                            });
                        }
                        else {
                            var dialogParams = {};
                            if (customer.entityType === MarketingSales.EntityNames.UnresolvedAddress) {
                                dialogParams[MarketingSales.MetadataDrivenDialogConstants.paramEmail] = customer.name;
                            }
                            _this.setConvertToLeadDialogParameter(dialogParams, iObjType);
                        }
                    }
                    else {
                        var dialogParams = {};
                        _this.setConvertToLeadDialogParameter(dialogParams, iObjType);
                    }
                }
            };
            this.setConvertToLeadDialogParameter = function (dialogParams, iObjType) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.context)) {
                    dialogParams[MarketingSales.MetadataDrivenDialogConstants.paramOwnerId] = Xrm.Page.context.getUserId();
                }
                dialogParams[MarketingSales.MetadataDrivenDialogConstants.paramEntityId] = Xrm.Page.data.entity.getId();
                if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data.entity.attributes.get("subject"))) {
                    dialogParams[MarketingSales.MetadataDrivenDialogConstants.paramSubject] = Xrm.Page.data.entity.attributes.get("subject").getValue();
                }
                dialogParams[MarketingSales.MetadataDrivenDialogConstants.paramEntityTypeCode] = "" + iObjType;
                var dlgDialogBox = { width: 500, height: 450, position: 1 /* center */ };
                Xrm.Navigation.openDialog("ConvertEmailToLead", dlgDialogBox, dialogParams)
                    .then(_this.convertActivityCallback, null);
            };
            this.convertActivityCallback = function (response) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(response)
                    && !ClientUtility.DataUtil.isNullOrUndefined(response.parameters)
                    && response.parameters[MarketingSales.MetadataDrivenDialogConstants.paramLastButtonClicked] === ClientUtility.MetadataDrivenDialogConstants.DialogOkId) {
                    var leadId = response.parameters[MarketingSales.MetadataDrivenDialogConstants.paramLeadId];
                    var saveActivity = response.parameters[MarketingSales.MetadataDrivenDialogConstants.paramSaveActivty];
                    var openNewRecord = response.parameters[MarketingSales.MetadataDrivenDialogConstants.paramOpenNewRecord];
                    var previousContext = _this;
                    if (leadId !== "") {
                        var emailEntity = {};
                        emailEntity["regardingobjectid_lead@odata.bind"] = "/leads(" + ClientUtility.Guid.create(leadId) + ")";
                        emailEntity["@odata.type"] = "#Microsoft.Dynamics.CRM.email";
                        Xrm.WebApi.updateRecord(MarketingSales.EntityNames.Email, ClientUtility.StringUtil.trimBraces(Xrm.Page.data.entity.getId()), emailEntity).then(function () {
                            if (saveActivity === "false") {
                                if (openNewRecord === "true") {
                                    Xrm.Page.data.refresh(false).then(function (Response) {
                                        Xrm.Utility.openEntityForm(Sales.EntityNames.Lead, leadId);
                                    }, ClientUtility.ActionFailedHandler.actionFailedCallback);
                                }
                            }
                            else {
                                if (openNewRecord === "true")
                                    previousContext.markActivityComplete(Xrm.Page.data.entity.getId(), Xrm.Page.data.entity.getEntityName(), false, Sales.EntityNames.Lead, leadId);
                                else
                                    previousContext.markActivityComplete(Xrm.Page.data.entity.getId(), Xrm.Page.data.entity.getEntityName(), true, null, null);
                            }
                        }, ClientUtility.ActionFailedHandler.actionFailedCallback);
                    }
                }
            };
            this.markActivityComplete = function (entityId, entityName, closeWindow, entityToOpen, entityIdToOpen) {
                // The state code for "closed" for all activities
                var CloseStateCodeForActivities = 1;
                // The completed status for appointment
                var CompletedStatusForAppointment = 3;
                if (entityName !== Sales.EntityNames.Appointment) {
                    if (entityName === Sales.EntityNames.SocialActivity) {
                        //-1 is used for default status, for SocialActivity this is configured as 3 i.e. "processsing"
                        //so passing 1 explicitly to have status as "completed"
                        ClientUtility.CommandBarActions.setState(entityId, entityName, CloseStateCodeForActivities, 1, closeWindow, entityToOpen, entityIdToOpen);
                    }
                    else {
                        ClientUtility.CommandBarActions.setState(entityId, entityName, CloseStateCodeForActivities, -1, closeWindow, entityToOpen, entityIdToOpen);
                    }
                }
                else {
                    ClientUtility.CommandBarActions.setState(entityId, entityName, -1, CompletedStatusForAppointment, closeWindow, entityToOpen, entityIdToOpen);
                }
            };
            this.convertLeadClick = function (context) {
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                var entityTypeCode = parseInt(formContext.data.attributes.get(MarketingSales.MetadataDrivenDialogConstants.paramEntityTypeCode).getValue().toString());
                if (ClientUtility.ClientUtil.isMobileOffline()) {
                    _this.entityName = Xrm.Internal.getEntityName(entityTypeCode);
                    if (!Xrm.Mobile.offline.isOfflineEnabled(_this.entityName)) {
                        ClientUtility.DialogUtil.showMoCAOfflineError();
                        return;
                    }
                }
                var subject = "";
                var entityId = "";
                var saveActivity = "false";
                var openNewRecord = "false";
                var firstName = "";
                var lastName = "";
                var company = "";
                var email = "";
                var ownerId = "";
                var currencyId = "";
                firstName = formContext.data.attributes.get(MarketingSales.MetadataDrivenDialogConstants.firstName).getValue();
                lastName = formContext.data.attributes.get(MarketingSales.MetadataDrivenDialogConstants.lastName).getValue();
                if (!_this.validate(lastName, MarketingSales.StringProvider.getResourceString("ErrorMessage_Convert_Lead_lastName"))) {
                    return;
                }
                company = formContext.data.attributes.get(MarketingSales.MetadataDrivenDialogConstants.company).getValue();
                email = formContext.data.attributes.get(MarketingSales.MetadataDrivenDialogConstants.email).getValue();
                if (!_this.validate(email, MarketingSales.StringProvider.getResourceString("ErrorMessage_Convert_Lead_email"))) {
                    return;
                }
                // Set default Currency to the converted lead
                if (!ClientUtility.DataUtil.isNullOrUndefined(formContext.context) && !ClientUtility.DataUtil.isNullOrUndefined(formContext.context.userSettings)
                    && !ClientUtility.DataUtil.isNullOrUndefined(formContext.context.userSettings.transactionCurrencyId)) {
                    currencyId = formContext.context.userSettings.transactionCurrencyId;
                }
                entityId = formContext.data.attributes.get(MarketingSales.MetadataDrivenDialogConstants.paramEntityId).getValue().toString();
                var saveActivityItemChecked = formContext.data.attributes.get(MarketingSales.MetadataDrivenDialogConstants.SaveActivityControlId).getValue();
                if (saveActivityItemChecked) {
                    saveActivity = "true";
                }
                var openNewItemChecked = formContext.data.attributes.get(MarketingSales.MetadataDrivenDialogConstants.OpenNewRecordControlId).getValue();
                if (openNewItemChecked) {
                    openNewRecord = "true";
                }
                var subjectValue = formContext.data.attributes.get(MarketingSales.MetadataDrivenDialogConstants.paramSubject).getValue();
                if (!ClientUtility.DataUtil.isNullOrUndefined(subjectValue))
                    subject = subjectValue.toString();
                ownerId = formContext.data.attributes.get(MarketingSales.MetadataDrivenDialogConstants.paramOwnerId).getValue().toString();
                ClientUtility.DialogUtil.showProgressMessage();
                var previousContext = _this;
                _this.convertToLead(function (response) {
                    var leadId = response.id.toString();
                    previousContext.postConvertLeadActivity(leadId, saveActivity, openNewRecord);
                }, function (response) {
                    ClientUtility.DialogUtil.hideProgressMessage();
                    ClientUtility.ActionFailedHandler.actionFailedCallback(response);
                }, subject, entityId, entityTypeCode, firstName, lastName, email, company, ownerId, currencyId);
            };
            this.validate = function (value, errorMsg) {
                if (ClientUtility.DataUtil.isNullOrUndefined(value) || !value.length) {
                    var errorString = { text: errorMsg, confirmButtonLabel: MarketingSales.StringProvider.getResourceString("Dialog_Button_Ok") };
                    Xrm.Navigation.openAlertDialog(errorString, null);
                    return false;
                }
                else
                    return true;
            };
            this.convertToLead = function (successCallback, errorCallback, targetEntitySubject, activityid, activityTypeCode, firstName, lastName, email, company, ownerId, currencyId) {
                var leadRecord = _this.getLeadRecord(targetEntitySubject, firstName, lastName, email, company, ownerId, currencyId);
                _this.entityName = Xrm.Internal.getEntityName(activityTypeCode);
                Xrm.WebApi.createRecord(Sales.EntityNames.Lead, leadRecord).then(successCallback, errorCallback);
            };
            this.getLeadRecord = function (targetEntitySubject, firstName, lastName, email, company, ownerId, currencyId) {
                var lead = { "@odata.type": "#Microsoft.Dynamics.CRM.lead", };
                lead['leadid'] = ClientUtility.Guid.newGuid();
                lead['subject'] = targetEntitySubject;
                lead['firstname'] = firstName;
                lead['lastname'] = lastName;
                lead['emailaddress1'] = email;
                lead['companyname'] = company;
                if (ownerId) {
                    lead["ownerid@odata.bind"] = "/systemusers(" + ClientUtility.Guid.create(decodeURIComponent(ownerId)) + ")";
                }
                if (currencyId) {
                    lead["transactioncurrencyid@odata.bind"] = "/transactioncurrencies(" + ClientUtility.Guid.create(currencyId) + ")";
                }
                return lead;
            };
            this.postConvertLeadActivity = function (leadId, saveActivity, openNewRecord) {
                ClientUtility.DialogUtil.setAttributeValue(MarketingSales.MetadataDrivenDialogConstants.paramLeadId, leadId);
                ClientUtility.DialogUtil.setAttributeValue(MarketingSales.MetadataDrivenDialogConstants.paramSaveActivty, saveActivity);
                ClientUtility.DialogUtil.setAttributeValue(MarketingSales.MetadataDrivenDialogConstants.paramOpenNewRecord, openNewRecord);
                ClientUtility.DialogUtil.setAttributeValue(MarketingSales.MetadataDrivenDialogConstants.paramLastButtonClicked, ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                ClientUtility.DialogUtil.hideProgressMessage();
                Xrm.Page.ui.close();
            };
        }
        Object.defineProperty(MarketingSalesCommandBarActions.prototype, "salesCommandActions", {
            get: function () {
                if (ClientUtility.DataUtil.isNullOrUndefined(this._salesCommandActions)) {
                    this._salesCommandActions = new Sales.ConvertActivityActions();
                }
                return this._salesCommandActions;
            },
            enumerable: true,
            configurable: true
        });
        MarketingSalesCommandBarActions.prototype.convertLeadCloseDialog = function (context) {
            var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
            ClientUtility.DialogUtil.setAttributeValue(MarketingSales.MetadataDrivenDialogConstants.paramLastButtonClicked, ClientUtility.MetadataDrivenDialogConstants.DialogCancelId);
            formContext.ui.close();
        };
        return MarketingSalesCommandBarActions;
    }());
    MarketingSales.MarketingSalesCommandBarActions = MarketingSalesCommandBarActions;
})(MarketingSales || (MarketingSales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../../TypeDefinitions/Sales/ClientCommon/Sales_ClientCommon.d.ts" />
/// <reference path="../../ClientCommon/MetadataDrivenDialogConstants.ts" />
/// <reference path="../../ClientCommon/EntityNames.ts" />
/// <reference path="../../ClientCommon/EntityTypeCodes.ts" />
/// <reference path="../../Localization/Provider/StringProvider.ts" />
/// <reference path="../../../../TypeDefinitions/Sales/CommandBarActions/SalesCommandBarActions.d.ts" />
var MarketingSales;
(function (MarketingSales) {
    var MarketingSalesCommandBarActionsLegacy = (function () {
        function MarketingSalesCommandBarActionsLegacy() {
            var _this = this;
            this.entityName = null;
            this.convertActivityOnLoad = function () {
                if (Xrm.Utility.isMocaOffline() && !Xrm.Utility.isEntityOfflineSyncEnabled(MarketingSales.EntityNames.Campaign)) {
                    var logResponseCampaignControl = Xrm.Page.getControl(MarketingSales.MetadataDrivenDialogConstants.LogResponseId);
                    logResponseCampaignControl.setDisabled(true);
                    var campaignLookup = Xrm.Page.getControl(MarketingSales.MetadataDrivenDialogConstants.CampaignLookup);
                    campaignLookup.setDisabled(true);
                }
                _this.salesCommandActions.convertActivityOnLoad();
            };
            this.convertActivityClick = function () {
                if (Mscrm.InternalUtilities.DialogUtility.isMocaOffline()) {
                    var entityTypeCodeAttribute = Mscrm.InternalUtilities.DialogUtility.getAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.EntityTypeCode);
                    _this.entityName = Xrm.Internal.getEntityName(parseInt(entityTypeCodeAttribute).toString());
                    if (!Xrm.Utility.isEntityOfflineSyncEnabled(_this.entityName)) {
                        Mscrm.InternalUtilities.DialogUtility.showMoCAOfflineError();
                        return;
                    }
                }
                var errorString = new Xrm.AlertDialogStrings;
                var customerId = Microsoft.Crm.Client.Core.Framework._String.empty;
                var currencyId = Microsoft.Crm.Client.Core.Framework._String.empty;
                var campaignId = Microsoft.Crm.Client.Core.Framework._String.empty;
                var subject = Microsoft.Crm.Client.Core.Framework._String.empty;
                var entityId = Microsoft.Crm.Client.Core.Framework._String.empty;
                var entityTypeCode = 0;
                var ownerId = Microsoft.Crm.Client.Core.Framework._String.empty;
                var ownerTypeCode = 0;
                var ownerName = Microsoft.Crm.Client.Core.Framework._String.empty;
                var leadId = Microsoft.Crm.Client.Core.Framework._String.empty;
                var saveActivity = "false";
                var openNewRecord = "false";
                var entityName = Microsoft.Crm.Client.Core.Framework._String.empty;
                var typeCode = 0;
                var customerLookup = Xrm.Page.data.entity.attributes.get(Sales.MetadataDrivenDialogConstants.CustomerLookup);
                var selectedItem = customerLookup.getValue();
                if (ClientUtility.DataUtil.isNullOrUndefined(selectedItem) || !selectedItem.length) {
                    errorString.text = MarketingSales.StringProvider.getResourceString("Alert_Conv_Act_Customer_Must");
                    Xrm.Dialog.openAlertDialog(errorString, null, null);
                    return;
                }
                else {
                    customerId = selectedItem[0].id;
                    entityName = selectedItem[0].entityType;
                    typeCode = Xrm.Internal.getEntityCode(entityName);
                }
                var currencyLookup = Xrm.Page.data.entity.attributes.get(Sales.MetadataDrivenDialogConstants.CurrencyLookup);
                selectedItem = currencyLookup.getValue();
                if (ClientUtility.DataUtil.isNullOrUndefined(selectedItem) || !selectedItem.length) {
                    errorString.text = MarketingSales.StringProvider.getResourceString("Alert_Conv_Act_Currency_Must");
                    Xrm.Dialog.openAlertDialog(errorString, null, null);
                    return;
                }
                else {
                    currencyId = selectedItem[0].id;
                }
                var logResponseItemChecked = Xrm.Page.getAttribute(MarketingSales.MetadataDrivenDialogConstants.LogResponseId);
                var logResponse = logResponseItemChecked.getValue();
                if (logResponse) {
                    var campaignAlertLookup = Xrm.Page.data.entity.attributes.get(MarketingSales.MetadataDrivenDialogConstants.CampaignLookup);
                    selectedItem = campaignAlertLookup.getValue();
                    if (ClientUtility.DataUtil.isNullOrUndefined(selectedItem) || !selectedItem.length) {
                        errorString.text = MarketingSales.StringProvider.getResourceString("Alert_Conv_Act_Campaign_Must");
                        Xrm.Dialog.openAlertDialog(errorString, null, null);
                        return;
                    }
                }
                Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.LastButtonClicked).setValue(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                var campaignLookup = Xrm.Page.data.entity.attributes.get(MarketingSales.MetadataDrivenDialogConstants.CampaignLookup);
                selectedItem = campaignLookup.getValue();
                if (!ClientUtility.DataUtil.isNullOrUndefined(selectedItem) && selectedItem.length) {
                    campaignId = selectedItem[0].id;
                }
                if (!ClientUtility.DataUtil.isNullOrUndefined(Mscrm.InternalUtilities.DialogUtility.getAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.Subject))) {
                    subject = Mscrm.InternalUtilities.DialogUtility.getAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.Subject).toString();
                }
                entityId = Mscrm.InternalUtilities.DialogUtility.getAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.EntityId).toString();
                entityTypeCode = parseInt(Mscrm.InternalUtilities.DialogUtility.getAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.EntityTypeCode).toString());
                ownerId = Mscrm.InternalUtilities.DialogUtility.getAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.OwnerId).toString();
                ownerTypeCode = parseInt(Mscrm.InternalUtilities.DialogUtility.getAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.OwnerType).toString());
                if (!ClientUtility.DataUtil.isNullOrUndefined(Mscrm.InternalUtilities.DialogUtility.getAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.OwnerName))) {
                    ownerName = Mscrm.InternalUtilities.DialogUtility.getAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.OwnerName).toString();
                }
                var saveActivityItemChecked = Mscrm.InternalUtilities.DialogUtility.getAttributeValue(Sales.MetadataDrivenDialogConstants.SaveActivityId);
                if (saveActivityItemChecked) {
                    saveActivity = "true";
                }
                var openNewItemChecked = Mscrm.InternalUtilities.DialogUtility.getAttributeValue(Sales.MetadataDrivenDialogConstants.OpenNewId);
                if (openNewItemChecked) {
                    openNewRecord = "true";
                }
                Mscrm.InternalUtilities.DialogUtility.showProgressMessage();
                if (Xrm.Utility.isMocaOffline()) {
                    var opportunityRecord = _this.getOpportunityEntityRecord(subject, entityId, entityTypeCode, customerId, typeCode, ownerId, ownerTypeCode, leadId, currencyId, campaignId, MarketingSales.EntityTypeCodes.Campaign, ownerName);
                    _this.salesCommandActions.offlineConvertActivity(entityId, entityTypeCode, opportunityRecord, saveActivity, openNewRecord);
                }
                else {
                    var that = _this;
                    _this.convertToOpportunity(function (response) {
                        var oppId = response.recordId.toString();
                        that.salesCommandActions.postConvertActivity(oppId, saveActivity, openNewRecord);
                    }, function (response) {
                        Mscrm.InternalUtilities.DialogUtility.actionFailedCallbackForMoca(response);
                    }, subject, entityId, entityTypeCode, customerId, typeCode, ownerId, ownerTypeCode, leadId, currencyId, campaignId, MarketingSales.EntityTypeCodes.Campaign, logResponse, ownerName);
                }
            };
            this.getOpportunityEntityRecord = function (targetEntitySubject, activityId, activityTypeCode, customerId, customerTypeCode, ownerId, ownerTypeCode, leadId, currencyId, campaignId, campaignTypeCode, ownerName) {
                var emptyGuidString = Microsoft.Crm.Client.Core.Framework.Guid.get_empty().toString();
                var opportunity = new Xrm.Objects.EntityReference(Sales.EntityNames.Opportunity, Microsoft.Crm.Client.Core.Framework.Guid.get_empty(), targetEntitySubject);
                var fieldValues = {};
                var fieldTypes = {};
                var attributeNames = new Array(0);
                var selectedItem;
                var attributeName = "name";
                fieldValues[attributeName] = targetEntitySubject;
                fieldTypes[attributeName] = Xrm.Objects.AttributeType.string;
                attributeNames[attributeNames.length] = attributeName;
                var isMDDConverted = Mscrm.InternalUtilities.DialogUtility.isMDDConverted("converttoopportunity", Xrm.Internal.getEntityName(activityTypeCode));
                if (!ClientUtility.DataUtil.isNullOrEmptyString(currencyId) && currencyId !== emptyGuidString) {
                    attributeName = "transactioncurrencyid";
                    var currencyEntity = new Xrm.Objects.EntityReference(Sales.EntityNames.TransactionCurrency, new Microsoft.Crm.Client.Core.Framework.Guid(currencyId));
                    if (isMDDConverted) {
                        var currencyLookup = Xrm.Page.data.entity.attributes.get(Sales.MetadataDrivenDialogConstants.CurrencyLookup);
                        selectedItem = currencyLookup.getValue();
                        var currencyName = Microsoft.Crm.Client.Core.Framework._String.empty;
                        if (!ClientUtility.DataUtil.isNullOrUndefined(selectedItem) && selectedItem.length > 0) {
                            currencyName = selectedItem[0].name;
                        }
                        if (!ClientUtility.DataUtil.isNullOrEmptyString(currencyName) && Xrm.Utility.isMocaOffline()) {
                            currencyEntity.Name = currencyName;
                        }
                    }
                    fieldValues[attributeName] = currencyEntity;
                    fieldTypes[attributeName] = Xrm.Objects.AttributeType.lookup;
                    attributeNames[attributeNames.length] = attributeName;
                }
                if (!ClientUtility.DataUtil.isNullOrEmptyString(campaignId) && campaignId !== emptyGuidString
                    && campaignTypeCode === Xrm.Internal.getEntityCode(MarketingSales.EntityNames.Campaign)) {
                    attributeName = "campaignid";
                    var campaignEntity = new Xrm.Objects.EntityReference(campaignTypeCode ? Xrm.Internal.getEntityName(campaignTypeCode) : MarketingSales.EntityNames.Campaign, new Microsoft.Crm.Client.Core.Framework.Guid(campaignId));
                    fieldValues[attributeName] = campaignEntity;
                    fieldTypes[attributeName] = Xrm.Objects.AttributeType.lookup;
                    attributeNames[attributeNames.length] = attributeName;
                }
                if (!ClientUtility.DataUtil.isNullOrEmptyString(leadId) && leadId !== emptyGuidString) {
                    attributeName = "leadid";
                    var leadEntity = new Xrm.Objects.EntityReference(MarketingSales.EntityNames.Lead, new Microsoft.Crm.Client.Core.Framework.Guid(leadId));
                    fieldValues[attributeName] = leadEntity;
                    fieldTypes[attributeName] = Xrm.Objects.AttributeType.lookup;
                    attributeNames[attributeNames.length] = attributeName;
                }
                if (!ClientUtility.DataUtil.isNullOrEmptyString(customerId) && customerId !== emptyGuidString) {
                    attributeName = "customerid";
                    var customer = new Xrm.Objects.EntityReference(Xrm.Internal.getEntityName(customerTypeCode), new Microsoft.Crm.Client.Core.Framework.Guid(customerId));
                    if (isMDDConverted) {
                        var customerLookup = Xrm.Page.data.entity.attributes.get(Sales.MetadataDrivenDialogConstants.CustomerLookup);
                        selectedItem = customerLookup.getValue();
                        var customerName = Microsoft.Crm.Client.Core.Framework._String.empty;
                        if (!ClientUtility.DataUtil.isNullOrUndefined(selectedItem) && selectedItem.length > 0) {
                            customerName = selectedItem[0].name;
                        }
                        if (Xrm.Utility.isMocaOffline()) {
                            if (!ClientUtility.DataUtil.isNullOrEmptyString(customerName)) {
                                customer.Name = customerName;
                            }
                            customer.TypeCode = customerTypeCode;
                        }
                    }
                    fieldValues[attributeName] = customer;
                    fieldTypes[attributeName] = Xrm.Objects.AttributeType.lookup;
                    attributeNames[attributeNames.length] = attributeName;
                }
                if (!ClientUtility.DataUtil.isNullOrEmptyString(ownerId) && ownerId !== emptyGuidString) {
                    attributeName = "ownerid";
                    var owner = new Xrm.Objects.EntityReference(Xrm.Internal.getEntityName(ownerTypeCode), new Microsoft.Crm.Client.Core.Framework.Guid(ownerId));
                    if (isMDDConverted) {
                        owner.Name = ownerName;
                    }
                    fieldValues[attributeName] = owner;
                    fieldTypes[attributeName] = Xrm.Objects.AttributeType.lookup;
                    attributeNames[attributeNames.length] = attributeName;
                }
                var opportunityRecord = new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.EntityRecord(opportunity, fieldValues, fieldTypes, {}, {}, new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.RelatedEntityCollection(new Array(0)));
                opportunityRecord.get_changedFieldNames().addRange(attributeNames);
                return opportunityRecord;
            };
            this.convertToOpportunity = function (successCallback, errorCallback, targetEntitySubject, activityId, activityTypeCode, customerId, customerTypeCode, ownerId, ownerTypeCode, leadId, currencyId, campaignId, campaignTypeCode, logResponse, ownerName) {
                var opportunityRecord = _this.getOpportunityEntityRecord(targetEntitySubject, activityId, activityTypeCode, customerId, customerTypeCode, ownerId, ownerTypeCode, leadId, currencyId, campaignId, campaignTypeCode, ownerName);
                _this.entityName = Xrm.Internal.getEntityName(activityTypeCode);
                Xrm.Internal.messages.convertActivity(activityId, Xrm.Internal.getEntityName(activityTypeCode), opportunityRecord, Sales.EntityNames.Opportunity, logResponse).then(successCallback, errorCallback);
            };
            this.setRelatedCampaign = function () {
                var closedCampaignResponse = Xrm.Page.getAttribute("cbLogResponse_id");
                var relatedCampaign = Xrm.Page.getAttribute("campaignassociatedview_id");
                if (!ClientUtility.DataUtil.isNullOrUndefined(closedCampaignResponse) &&
                    !ClientUtility.DataUtil.isNullOrUndefined(relatedCampaign))
                    if (closedCampaignResponse.getValue()) {
                        relatedCampaign.setRequiredLevel(Xrm.RequiredLevel.required);
                    }
                    else {
                        relatedCampaign.setRequiredLevel(Xrm.RequiredLevel.none);
                    }
            };
            // Convert an activity to an opportunity
            this.convertToOpportunityActivity = function (iObjType) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(Mscrm.InlineEditUtilities)) {
                    Mscrm.InlineEditUtilities.tryResetFocusOnActiveControl();
                }
                // Alert the user if the form is not saved
                if (Xrm.Page.data.entity.getIsDirty()) {
                    Mscrm.InternalUtilities._Script.alert(Xrm.Internal.getResourceString('LOCID_CONV_ACT_SAVE_WARNING'));
                    // skip the convert to opportunity
                    return false;
                }
                if (Xrm.Page.data.getIsValid()) {
                    // Get the direction code control
                    var _directionCodeCtrl = Xrm.Page.data.entity.attributes.get("directioncode");
                    var directionCodeVal = true;
                    if (!ClientUtility.DataUtil.isNullOrUndefined(_directionCodeCtrl)) {
                        var directionCodeValue = _directionCodeCtrl.getValue();
                        directionCodeVal = (directionCodeValue === "0" || !directionCodeValue) ? false : true;
                    }
                    var customerItems = null;
                    var secondaryCust = null;
                    var sUrlElement = "";
                    sUrlElement += "activityType=" + CrmEncodeDecode.CrmUrlEncode(iObjType);
                    if (directionCodeVal === true) {
                        var _to = Xrm.Page.data.entity.attributes.get('to');
                        // Outgoing
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_to)) {
                            customerItems = _to.getValue();
                        }
                        if (ClientUtility.DataUtil.isNullOrUndefined(customerItems)) {
                            customerItems = new Array();
                        }
                        var _cc = Xrm.Page.data.entity.attributes.get('cc');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_cc)) {
                            secondaryCust = _cc.getValue();
                            if (!ClientUtility.DataUtil.isNullOrUndefined(secondaryCust)) {
                                for (var i = 0; i < secondaryCust.length; i++) {
                                    customerItems[customerItems.length] = secondaryCust[i];
                                }
                            }
                        }
                        var _bcc = Xrm.Page.data.entity.attributes.get('bcc');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_bcc)) {
                            secondaryCust = _bcc.getValue();
                            if (!ClientUtility.DataUtil.isNullOrUndefined(secondaryCust)) {
                                for (var i = 0; i < secondaryCust.length; i++) {
                                    customerItems[customerItems.length] = secondaryCust[i];
                                }
                            }
                        }
                    }
                    else if (directionCodeVal === false) {
                        // Incoming
                        var _from = Xrm.Page.data.entity.attributes.get('from');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_from)) {
                            customerItems = _from.getValue();
                        }
                    }
                    // Appointment has attendees
                    if (iObjType === Sales.EntityTypeCodes.Appointment || iObjType === Sales.EntityTypeCodes.RecurringAppointmentMaster) {
                        var _requiredattendees = Xrm.Page.data.entity.attributes.get('requiredattendees');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_requiredattendees)) {
                            customerItems = _requiredattendees.getValue();
                        }
                        if (ClientUtility.DataUtil.isNullOrUndefined(customerItems)) {
                            customerItems = new Array();
                        }
                        var _optionalattendees = Xrm.Page.data.entity.attributes.get('optionalattendees');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_optionalattendees)) {
                            secondaryCust = _optionalattendees.getValue();
                            if (!ClientUtility.DataUtil.isNullOrUndefined(secondaryCust)) {
                                for (var i = 0; i < secondaryCust.length; i++) {
                                    customerItems[customerItems.length] = secondaryCust[i];
                                }
                            }
                        }
                    }
                    else if (iObjType === Sales.EntityTypeCodes.Task) {
                        var _regardingobjectid = Xrm.Page.data.entity.attributes.get('regardingobjectid');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_regardingobjectid) && !ClientUtility.DataUtil.isNullOrUndefined(_regardingobjectid.getValue())) {
                            customerItems = _regardingobjectid.getValue();
                        }
                    }
                    // We have to find the first valid customer
                    if (!ClientUtility.DataUtil.isNullOrUndefined(customerItems)) {
                        // call the GetValidcustomer for the first time
                        _this.GetValidCustomer(customerItems, sUrlElement, iObjType, 0, "opportunity");
                    }
                }
                _this.salesCommandActions.refreshParentGrid(iObjType);
            };
            this.GetValidCustomer = function (customerItems, sUrlElement, iObjType, customerNo, customerType) {
                if (customerNo === customerItems.length) {
                    return _this.GetValidCustomerSuccess(sUrlElement, iObjType, customerItems, customerType, "");
                }
                try {
                    var isValidCustomer = true;
                    // for convert to lead only lead is valid for customer
                    if ((!ClientUtility.DataUtil.isNullOrUndefined(customerType)
                        && customerType === "lead") && (customerItems[customerNo].type.toString() !== Sales.EntityTypeCodes.Lead.toString())) {
                        isValidCustomer = false;
                    }
                    // we check for either contact or account for convert to case/opportunity
                    if ((!ClientUtility.DataUtil.isNullOrUndefined(customerType) && customerType !== "lead") &&
                        (customerItems[customerNo].type.toString() !== Sales.EntityTypeCodes.Account.toString()
                            && customerItems[customerNo].type.toString() !== Sales.EntityTypeCodes.Contact.toString())) {
                        isValidCustomer = false;
                    }
                    if (!isValidCustomer) {
                        return _this.GetValidCustomer(customerItems, sUrlElement, iObjType, customerNo + 1, customerType);
                    }
                    if (Xrm.Utility.isMocaOffline()) {
                        // Populating the customer attributes in case of moca offline from form data
                        sUrlElement += _this.salesCommandActions.AppendValidCustomerAttributes(customerItems, customerNo, customerType);
                        return _this.GetValidCustomerSuccess(sUrlElement, iObjType, customerItems, customerType, "");
                    }
                    else {
                        var columns = new Array();
                        columns[0] = "statecode";
                        var that = _this;
                        Xrm.Internal.messages.retrieve(Xrm.Internal.getEntityName(typeof (customerItems[customerNo].type) !== 'number' ? Number.parseInvariant(customerItems[customerNo].type) : customerItems[customerNo].type), customerItems[customerNo].id, columns).then(function (response) {
                            if (typeof (response.entity) !== "undefined"
                                && typeof (response.entity.getObjectData) !== "undefined"
                                && typeof (response.entity.getObjectData().fields) !== "undefined"
                                && typeof (response.entity.getObjectData().fields.statecode) !== "undefined"
                                && typeof (response.entity.getObjectData().fields.statecode.value) !== "undefined"
                                && response.entity.getObjectData().fields.statecode.value.toString() === "0"
                                && typeof (response.entity.get_key) !== "undefined") {
                                // the customer is active, get the id and find the customer in the list of customerItems with the same Id
                                var id = response.entity.get_key().toString();
                                for (var k = 0; k < customerItems.length; k++) {
                                    if (!ClientUtility.DataUtil.isNullOrUndefined(customerItems[k].id) && customerItems[k].id.toLowerCase().indexOf(id.toLowerCase()) !== -1) {
                                        sUrlElement += that.salesCommandActions.AppendValidCustomerAttributes(customerItems, k, customerType);
                                        return that.GetValidCustomerSuccess(sUrlElement, iObjType, customerItems, customerType, "");
                                    }
                                }
                                // this is a scenario which should not happen in the ideal case, if the customer was active but the id returned was not in the CustomerItems list 
                                // then increase the number of customers processed and call the same function for the next customer in line
                                // surrounded by try catch as fail safe for MoCA
                                try {
                                    Mscrm.CrmDebug.assert(true, "customer with id {0} was not found on the page", id);
                                }
                                catch (e) { }
                                return that.GetValidCustomer(customerItems, sUrlElement, iObjType, customerNo + 1, customerType);
                            }
                            else {
                                // This code is added only to retain the behaviour of CRM2011 where dialog box opens even if contact is inactive
                                // If we have reached here, it means that the customer we looked into was inactive, so go ahead and find the next valid customer
                                return that.GetValidCustomer(customerItems, sUrlElement, iObjType, customerNo + 1, customerType);
                            }
                        }, function (response) {
                            // the call failed because of some reason, just increase the number of customers processed and if all customers are processed, call GetValidCustomerSuccess anyways
                            return that.GetValidCustomer(customerItems, sUrlElement, iObjType, customerNo + 1, customerType);
                        });
                    }
                }
                catch (e) { }
            };
            this.GetValidCustomerSuccess = function (sUrlElement, iObjType, customerItems, customerType, entityId) {
                // the first customerType = "opportunity" denotes that the call has come from opportunity and not form case hence we need to call the GetValidForConvertToOpportunity
                if (customerType === "opportunity") {
                    return _this.GetValidForConvertToOpportunity(sUrlElement, iObjType, customerItems);
                }
                else if (customerType === "lead") {
                    return _this.GetValidForConvertToOpportunityWithLead(sUrlElement, iObjType);
                }
                _this.salesCommandActions.refreshParentGrid(iObjType);
            };
            this.GetValidForConvertToOpportunity = function (sUrlElement, iObjType, customerItems) {
                // if customer has been found customer Id will be set
                if (sUrlElement.indexOf("customerId") === -1) {
                    _this.GetValidCustomer(customerItems, sUrlElement, iObjType, 0, "lead");
                }
                else {
                    // customer is already present, no need to add lead anymore we can direct call into lead success
                    _this.GetValidForConvertToOpportunityWithLead(sUrlElement, iObjType);
                }
            };
            this.GetValidForConvertToOpportunityWithLead = function (sUrlElement, iObjType) {
                // Get the regarding object control
                var regardingCtrl = Xrm.Page.data.entity.attributes.get('regardingobjectid');
                if (!ClientUtility.DataUtil.isNullOrUndefined(regardingCtrl)) {
                    // Get the regarding items
                    var regardingItems = regardingCtrl.getValue();
                    // Make sure there is only one regarding
                    if (!ClientUtility.DataUtil.isNullOrUndefined(regardingItems) && regardingItems.length === 1) {
                        // Only CampaignActivity and Quick-Campaign (BulkOperation) types pass the campaign information
                        if ((regardingItems[0].type.toString() === MarketingSales.EntityTypeCodes.CampaignActivity.toString()) ||
                            (regardingItems[0].type.toString() === MarketingSales.EntityTypeCodes.BulkOperation.toString())) {
                            sUrlElement += "&campaignId=" + CrmEncodeDecode.CrmUrlEncode(regardingItems[0].id) +
                                "&campaignType=" + CrmEncodeDecode.CrmUrlEncode(regardingItems[0].type) +
                                "&campaignName=" + CrmEncodeDecode.CrmUrlEncode(regardingItems[0].name);
                        }
                    }
                }
                var subjectField = "";
                var _subject = Xrm.Page.data.entity.attributes.get("subject");
                if (!ClientUtility.DataUtil.isNullOrUndefined(_subject.getValue())) {
                    subjectField = _subject.getValue();
                }
                var ownerId = "";
                var ownerType = "";
                var ownerCtrl = Xrm.Page.data.entity.attributes.get("ownerid");
                if (!ClientUtility.DataUtil.isNullOrUndefined(ownerCtrl)) {
                    var dataVal = ownerCtrl.getValue();
                    ownerId = dataVal[0].id;
                    ownerType = dataVal[0].type;
                }
                sUrlElement += "&subject=" + CrmEncodeDecode.CrmUrlEncode(subjectField);
                sUrlElement += "&ownerId=" + CrmEncodeDecode.CrmUrlEncode(ownerId);
                sUrlElement += "&ownerType=" + CrmEncodeDecode.CrmUrlEncode(ownerType);
                var isMDDConverted = Mscrm.InternalUtilities.DialogUtility.isMDDConverted("converttoopportunity", Xrm.Page.data.entity.getEntityName());
                if (isMDDConverted) {
                    _this.convertActivityPreload(sUrlElement, iObjType);
                }
                else {
                    var isLead = (sUrlElement.indexOf("leadId") !== -1);
                    var dialogOptions = _this.salesCommandActions.getConvertToOpportunityDialogOptionsWithHeight(isLead, 370);
                    var parameters = new Array();
                    parameters[0] = iObjType;
                    var oUrl = Mscrm.CrmUri.create("/Activities/act_dlgs/convert_activity.aspx?" + sUrlElement);
                    var convertToOppActionCallBack = Mscrm.InternalUtilities.GridUtilities.createCallbackFunctionFactory(_this.salesCommandActions.convertToOppAction, parameters);
                    Xrm.Internal.openDialog(oUrl.toString(), dialogOptions, null, null, convertToOppActionCallBack);
                }
                _this.salesCommandActions.refreshParentGrid(iObjType);
            };
            this.convertActivityPreload = function (element, iObjType) {
                _this.entityName = Xrm.Internal.getEntityName(parseInt(iObjType));
                if (Mscrm.InternalUtilities.DialogUtility.isMocaOffline() &&
                    !Xrm.Utility.isEntityOfflineSyncEnabled(_this.entityName)) {
                    Mscrm.InternalUtilities.DialogUtility.showMoCAOfflineError();
                    return;
                }
                Mscrm.InternalUtilities.DialogUtility.showProgressMessage();
                if (Xrm.Utility.isMocaOffline()) {
                    var currencyValues = Xrm.Utility.getDefaultTransactionCurrency();
                    _this.convertActivityPreloadWithCurrency(element, iObjType, currencyValues);
                }
                else {
                    var that = _this;
                    Xrm.Internal.messages.retrieveUserDefaultCurrency().then(function (response) {
                        if (!ClientUtility.DataUtil.isNullOrUndefined(response)) {
                            var currencyValues = response.currency;
                            that.convertActivityPreloadWithCurrency(element, iObjType, currencyValues);
                        }
                        else {
                            Mscrm.InternalUtilities.DialogUtility.hideProgressMessage();
                        }
                    }, Mscrm.InternalUtilities.DialogUtility.actionFailedCallbackForMoca);
                }
            };
            this.convertActivityPreloadWithCurrency = function (element, iObjType, currencyValues) {
                var dialogParams = {};
                var $$t_I;
                _this.salesCommandActions.setCurrencyAndCustomerDialogParams(currencyValues, element, $$t_I = { val: dialogParams }), dialogParams = $$t_I.val;
                if (element.indexOf("leadId") !== -1) {
                    var leadId = ClientUtility.CommandBarUtils.getElementValue(element, "leadId");
                    var leadName = ClientUtility.CommandBarUtils.getElementValue(element, "leadName");
                    var leadLookup = new Xrm.LookupObject;
                    leadLookup.id = CrmEncodeDecode.CrmUrlDecode(leadId);
                    leadLookup.name = CrmEncodeDecode.CrmUrlDecode(leadName);
                    leadLookup.entityType = MarketingSales.EntityNames.Lead;
                    var leadLookupParams = [];
                    leadLookupParams[0] = leadLookup;
                    dialogParams[Sales.MetadataDrivenDialogConstants.LeadLookup] = leadLookupParams;
                    dialogParams[Sales.MetadataDrivenDialogConstants.LeadId] = CrmEncodeDecode.CrmUrlDecode(leadId);
                }
                if (element.indexOf("campaignId") !== -1) {
                    var campaignActivityId = CrmEncodeDecode.CrmUrlDecode(ClientUtility.CommandBarUtils.getElementValue(element, "campaignId").toString()), tableName = "", columns = ["regardingobjectid"];
                    if (ClientUtility.CommandBarUtils.getElementValue(element, "campaignType").toString() === "4406")
                        tableName = "bulkoperation";
                    else
                        tableName = "campaignactivity";
                    Xrm.Internal.messages.retrieve(tableName, campaignActivityId, columns).then(function (retrieveResponse) {
                        if (!ClientUtility.DataUtil.isNullOrUndefined(retrieveResponse)) {
                            var responseEntity = retrieveResponse.entity;
                            if (!ClientUtility.DataUtil.isNullOrUndefined(responseEntity)) {
                                var attributeLookup = responseEntity.getValue("regardingobjectid");
                                if (!ClientUtility.DataUtil.isNullOrUndefined(attributeLookup)) {
                                    var campaignId = attributeLookup.Id.toString(), campaignName = attributeLookup.Name.toString(), campaignLookup = new Xrm.LookupObject;
                                    campaignLookup.id = CrmEncodeDecode.CrmUrlDecode(campaignId);
                                    campaignLookup.name = CrmEncodeDecode.CrmUrlDecode(campaignName);
                                    campaignLookup.entityType = ClientUtility.CommandBarUtils.getElementValue(element, "campaignType").toString() === "4406" ? MarketingSales.EntityNames.BulkOperation : MarketingSales.EntityNames.Campaign;
                                    var campaignLookupParams = [];
                                    campaignLookupParams[0] = {};
                                    dialogParams[Mscrm.InternalUtilities.MetadataDrivenDialogConstants.CampaignLookup] = campaignLookupParams;
                                }
                                _this.salesCommandActions.setConvertActivityParameterAndLaunchDialog(dialogParams, element, iObjType);
                            }
                            else
                                Mscrm.InternalUtilities.DialogUtility.hideProgressMessage();
                        }
                    }, Mscrm.InternalUtilities.DialogUtility.actionFailedCallbackForMoca);
                }
                else
                    _this.salesCommandActions.setConvertActivityParameterAndLaunchDialog(dialogParams, element, iObjType);
            };
        }
        Object.defineProperty(MarketingSalesCommandBarActionsLegacy.prototype, "salesCommandActions", {
            get: function () {
                if (ClientUtility.DataUtil.isNullOrUndefined(this._salesCommandActions)) {
                    this._salesCommandActions = new Sales.ConvertActivityActionsLegacy();
                }
                return this._salesCommandActions;
            },
            enumerable: true,
            configurable: true
        });
        MarketingSalesCommandBarActionsLegacy.prototype.dialogClose = function () {
            this.salesCommandActions.dialogClose();
        };
        return MarketingSalesCommandBarActionsLegacy;
    }());
    MarketingSales.MarketingSalesCommandBarActionsLegacy = MarketingSalesCommandBarActionsLegacy;
})(MarketingSales || (MarketingSales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="UCI/MarketingSalesCommandBarActions.ts" />
/// <reference path="./Legacy/MarketingSalesCommandBarActionsLegacy.ts" />
var MarketingSales;
(function (MarketingSales) {
    var CommandBarActions = (function () {
        function CommandBarActions() {
        }
        return CommandBarActions;
    }());
    CommandBarActions.Instance = Xrm.Internal.isUci() ? new MarketingSales.MarketingSalesCommandBarActions() : new MarketingSales.MarketingSalesCommandBarActionsLegacy();
    MarketingSales.CommandBarActions = CommandBarActions;
})(MarketingSales || (MarketingSales = {}));
