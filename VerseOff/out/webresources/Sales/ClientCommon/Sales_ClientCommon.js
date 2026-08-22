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
var Sales;
(function (Sales) {
    var AccessRights = (function () {
        function AccessRights() {
        }
        return AccessRights;
    }());
    Sales.AccessRights = AccessRights;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../../TypeDefinitions/Sales/Localization/ResourceStringProvider.d.ts" />
/*
 * Invokes the ResourceStringProvider if available; otherwise returns *key*.
 * Using this class as a proxy for the ResourceStringProvider that is included per web dependency declaration
 * in order to avoid null reference errors in case the dependency is not loaded for some reason.
 */
var Sales;
(function (Sales) {
    var StringProvider = (function () {
        function StringProvider() {
        }
        StringProvider.getResourceString = function (key) {
            return Sales.ResourceStringProvider ? Sales.ResourceStringProvider.getResourceString(key) : "*" + key + "*";
        };
        return StringProvider;
    }());
    Sales.StringProvider = StringProvider;
})(Sales || (Sales = {}));
var MscrmControls;
(function (MscrmControls) {
    var Sales;
    (function (Sales) {
        var AppExtensions;
        (function (AppExtensions) {
            var AddProducts;
            (function (AddProducts) {
                var Utility;
                (function (Utility) {
                    'use strict';
                    var CommonUtils = (function () {
                        function CommonUtils() {
                        }
                        CommonUtils.getFeatureControlSetting = function (fcsNamespace, settingKey, defaultValue) {
                            var fcsValue = (Xrm.Utility.getGlobalContext()).getFeatureControlSetting(fcsNamespace, settingKey);
                            if (fcsValue !== null && fcsValue !== undefined) {
                                // Found the feature
                                return fcsValue;
                            }
                            return defaultValue;
                        };
                        // Method to retrieve multiple records using Xrm.WebApi
                        CommonUtils.retrieveMultipleRecordsOData = function (entityLogicalName, query) {
                            return Xrm.WebApi.retrieveMultipleRecords(entityLogicalName, query);
                        };
                        CommonUtils.getSkipTokenFromUrl = function (url) {
                            var queryString = url.split("?")[1];
                            if (!queryString)
                                return null;
                            var queryParams = queryString.split("&");
                            for (var _i = 0, queryParams_1 = queryParams; _i < queryParams_1.length; _i++) {
                                var param = queryParams_1[_i];
                                var _a = param.split("="), key = _a[0], valueParts = _a.slice(1);
                                if (key === "$skiptoken") {
                                    // Join the value parts back together and decode the full value
                                    var value = valueParts.join("=");
                                    return value ? decodeURIComponent(value) : null;
                                }
                            }
                            return null;
                        };
                        // Extract paging cookie from XML
                        CommonUtils.extractPagingCookie = function (xml) {
                            if (!xml) {
                                return null;
                            }
                            var regex = /pagingcookie="([^"]*)"/;
                            var match = xml.match(regex);
                            return match ? match[1] : null;
                        };
                        // Double decode a value
                        CommonUtils.doubleDecode = function (value) {
                            try {
                                return decodeURIComponent(decodeURIComponent(value));
                            }
                            catch (e) {
                                return value;
                            }
                        };
                        // XML encode a value
                        CommonUtils.xmlEncode = function (value) {
                            if (!value)
                                return value;
                            return value.replace(/&/g, '&amp;')
                                .replace(/</g, '&lt;')
                                .replace(/>/g, '&gt;')
                                .replace(/"/g, '&quot;')
                                .replace(/'/g, '&apos;');
                        };
                        return CommonUtils;
                    }());
                    Utility.CommonUtils = CommonUtils;
                })(Utility = AddProducts.Utility || (AddProducts.Utility = {}));
            })(AddProducts = AppExtensions.AddProducts || (AppExtensions.AddProducts = {}));
        })(AppExtensions = Sales.AppExtensions || (Sales.AppExtensions = {}));
    })(Sales = MscrmControls.Sales || (MscrmControls.Sales = {}));
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
    /* tslint:disable:crm-force-fields-private */
    var GetDefaultPriceLevelRequest = (function () {
        function GetDefaultPriceLevelRequest(entityName) {
            this.entityset = "pricelevel";
            this.EntityName = entityName;
        }
        GetDefaultPriceLevelRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entityset",
                parameterTypes: {
                    "entityset": {
                        "typeName": "mscrm.pricelevel",
                        "structuralProperty": 4,
                    },
                    "EntityName": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                },
                operationName: "GetDefaultPriceLevel",
                operationType: 1,
            };
            return metadata;
        };
        return GetDefaultPriceLevelRequest;
    }());
    ODataContract.GetDefaultPriceLevelRequest = GetDefaultPriceLevelRequest;
})(ODataContract || (ODataContract = {}));
/// <reference path="../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../DataContracts/Function/GetDefaultPriceLevelRequest.ts" />
var Sales;
(function (Sales) {
    var DefaultPriceListController = (function () {
        function DefaultPriceListController() {
        }
        return DefaultPriceListController;
    }());
    DefaultPriceListController.setDefaultPricelistForUser = function (entityName, priceLevelAttributeName) {
        if (ClientUtility.ClientUtil.isMobileOffline()) {
            return;
        }
        var PriceLevelId = "pricelevelid";
        var PriceLevelName = "name";
        var ResourceStringForInBuiltRuleForPriceList = "USE_INBUILT_RULE_FOR_PRICELIST";
        var defaultPricelistID = "";
        var defaultPricelistIDName = "";
        var lookupItem = { entityType: Sales.EntityNames.PriceLevel, id: null, name: null };
        //make the SDK call to get the default pricelist for the user.
        var priceLevelAttribute = Xrm.Page.data.entity.attributes.get(priceLevelAttributeName);
        //Check if the lookup is already populated with value if not populated the value.
        if (!ClientUtility.DataUtil.isNullOrUndefined(priceLevelAttribute) &&
            (ClientUtility.DataUtil.isNullOrUndefined(priceLevelAttribute.getValue()) || priceLevelAttribute.getValue().length == 0) /*TODO: evaluate why this is here && StringProvider.getResourceString(ResourceStringForInBuiltRuleForPriceList) == "true" */) {
            var request = new ODataContract.GetDefaultPriceLevelRequest(entityName);
            Xrm.WebApi.online.execute(request).then(function (response) {
                return response.json().then(function (priceLevelResponse) {
                    if (!ClientUtility.DataUtil.isNullOrUndefined(priceLevelResponse) && !ClientUtility.DataUtil.isNullOrUndefined(priceLevelResponse.value)) {
                        var priceLevels = priceLevelResponse.value;
                        //if the user has more than one or no pricelevel assocaited with terrority then do nothing.
                        if (priceLevels.length == 1) {
                            var priceLevel = priceLevels[0];
                            defaultPricelistID = priceLevel.pricelevelid;
                            defaultPricelistIDName = priceLevel.name;
                            lookupItem.id = defaultPricelistID;
                            lookupItem.name = defaultPricelistIDName;
                            lookupItem.entityType = Sales.EntityNames.PriceLevel;
                            var lookupItems = [lookupItem];
                            priceLevelAttribute.setValue(lookupItems);
                        }
                    }
                });
                //Check if the response and entitycollection is not null  
            });
        }
    };
    Sales.DefaultPriceListController = DefaultPriceListController;
})(Sales || (Sales = {}));
/// <reference path="../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var Sales;
(function (Sales) {
    var OptionSetFilter = (function () {
        function OptionSetFilter() {
        }
        /**
         * Filters the option statuscode by statecode.
         * @param {string} entityName The entity name.
         * @param {Number} state The state.
         * @param {string} controlId The control id.
         */
        OptionSetFilter.filterOptionSetValuesFromControl = function (entityName, state, controlId) {
            Xrm.Utility.getEntityMetadata(entityName, ["statecode"]).then(function (entityMetadata) {
                var stateAttribute = null;
                if (ClientUtility.DataUtils.isFunction(entityMetadata.Attributes.get)) {
                    stateAttribute = entityMetadata.Attributes.get("statecode");
                }
                else {
                    stateAttribute = entityMetadata.Attributes.statecode;
                }
                var allowedStatusSet = stateAttribute.getStatusValuesForState(state);
                var defaultStatus = stateAttribute.getDefaultStatus(state);
                var optionSetControl = Xrm.Page.ui.controls.get(controlId);
                if (!ClientUtility.DataUtil.isNullOrUndefined(optionSetControl)) {
                    // remove invalid options
                    var options = optionSetControl.getOptions();
                    options.forEach(function (option) {
                        if (allowedStatusSet.indexOf(option.value) === -1) {
                            optionSetControl.removeOption(option.value);
                        }
                    });
                    // set value, if currently unset or invalid
                    var currentValue = optionSetControl.getAttribute().getValue();
                    if (ClientUtility.DataUtil.isNullOrUndefined(currentValue) ||
                        allowedStatusSet.indexOf(currentValue) < 0) {
                        optionSetControl.getAttribute().setValue(defaultStatus);
                    }
                }
            }, ClientUtility.ActionFailedHandler.actionFailedErrorDialog);
        };
        return OptionSetFilter;
    }());
    Sales.OptionSetFilter = OptionSetFilter;
})(Sales || (Sales = {}));
/// <reference path="../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var Sales;
(function (Sales) {
    var ContextualEmailController = (function () {
        function ContextualEmailController() {
        }
        ContextualEmailController.shouldShowDefaultEmailForm = function (context) {
            if (context) {
                var isUci = Xrm.Internal.isUci();
                var formContext = context.getFormContext();
                var formSelector = formContext.ui.formSelector;
                var currentFormId = formSelector.getCurrentItem().getId();
                if (isUci && formContext.ui.getFormType() == 1 /* Create */) {
                    ContextualEmailController.tryApplyTemplateOfRegardingObject(context);
                }
                if (!isUci && currentFormId == this.contextualEmailFormId) {
                    var defaultActiveEmailFormId = this.getDefaultActiveEmailFormId(formSelector);
                    if (defaultActiveEmailFormId !== null) {
                        var emailEntityName = formContext.data.entity.getEntityName();
                        var entityId = formContext.data.entity.getId();
                        var formOptions = {
                            entityName: emailEntityName,
                            formId: defaultActiveEmailFormId,
                            entityId: entityId
                        };
                        Xrm.Navigation.openForm(formOptions);
                    }
                }
                if (isUci) {
                    this.shouldShowEmailEngagementTab(formContext);
                }
            }
        };
        ContextualEmailController.getDefaultActiveEmailFormId = function (formSelector) {
            var defaultFormId = null;
            var availableForms = formSelector.items.get();
            for (var _i = 0, availableForms_1 = availableForms; _i < availableForms_1.length; _i++) {
                var form = availableForms_1[_i];
                var formId = form.getId().toLowerCase();
                // Find any active main form other than Contextual/Enhanced Email form.
                if (formId.indexOf(this.contextualEmailFormId) == -1) {
                    defaultFormId = formId;
                    break;
                }
            }
            return defaultFormId;
        };
        ContextualEmailController.shouldShowEmailEngagementTab = function (formContext) {
            if (Xrm.Internal.isFeatureEnabled(ContextualEmailController.EmailEngagementFCB)) {
                ContextualEmailController.isEmailEngagementEnabledAtOrgLevel(formContext).then(function (isEmailEngagementEnabled) {
                    var emailEngagementTab = formContext.ui.tabs.get(ContextualEmailController.EmailEngagementTabName);
                    if (isEmailEngagementEnabled && emailEngagementTab) {
                        emailEngagementTab.setVisible(true);
                    }
                });
            }
        };
        ContextualEmailController.isEmailEngagementEnabledAtOrgLevel = function (form) {
            // Fetching from organization table in case of UCI
            return Xrm.WebApi.online.retrieveRecord("organization", Xrm.Utility.getGlobalContext().organizationSettings.organizationId, "?$select=name,isemailmonitoringallowed").then(function (response) {
                if (response != null) {
                    return response.isemailmonitoringallowed;
                }
                else {
                    return false;
                }
            });
        };
        /**
         * Function to alert the panel containing the form of subject change.
        */
        ContextualEmailController.NotifyPanelSubjectChange = function (context) {
            try {
                if (context && window.parent) {
                    var formContext = context.getFormContext();
                    var subjectAttribute = formContext.data.entity.attributes.get("subject");
                    var containerFrameElement = window.parent.frameElement;
                    var containerPanelId = containerFrameElement && containerFrameElement.getAttribute("email-popup-id");
                    var activityEntityReference = formContext.data.entity.getEntityReference();
                    // on subject change
                    if (subjectAttribute && containerFrameElement) {
                        var subjectContent = subjectAttribute.getValue();
                        if (subjectContent && containerPanelId) {
                            window.parent.parent.dispatchEvent(new CustomEvent("subjectChangedInPanel", {
                                detail: {
                                    containerPanelId: containerPanelId,
                                    subjectContent: subjectContent
                                }
                            }));
                        }
                    }
                    // on email save , reply, reply all, and forward command actions
                    if (activityEntityReference && activityEntityReference.id && containerFrameElement) {
                        var activityId = activityEntityReference.id.replace(/[{}]/g, '').toLowerCase();
                        if (activityId && containerPanelId) {
                            window.parent.parent.dispatchEvent(new CustomEvent("emailActivityCommandActionsInPanel", {
                                detail: {
                                    containerPanelId: containerPanelId,
                                    activityId: activityId
                                }
                            }));
                        }
                    }
                }
            }
            catch (error) {
                if (Xrm.Reporting) {
                    Xrm.Reporting.reportFailure(ContextualEmailController.name + ContextualEmailController.NotifyPanelSubjectChange, error);
                }
            }
        };
        ContextualEmailController.tryApplyTemplateOfRegardingObject = function (eventContext) {
            var formContext = eventContext.getFormContext();
            var regarding = formContext.getAttribute(ContextualEmailController.regardingobjectAttribute);
            var template = formContext.getAttribute(ContextualEmailController.templateIdAttribute);
            var templateId = null;
            var regardingObjectId = null;
            var regardingObjectType = null;
            if (regarding) {
                var regardingObject = regarding.getValue() ? regarding.getValue()[0] : null;
                regardingObjectId = regardingObject ? regardingObject.id : null;
                regardingObjectType = regardingObject ? regardingObject.entityType : null;
            }
            if (template) {
                var templateObject = template.getValue() ? template.getValue()[0] : null;
                templateId = templateObject ? templateObject.id : null;
            }
            if (templateId && regardingObjectId && regardingObjectType) {
                var req = new ODataContract.InstantiateTemplateRequest(templateId, regardingObjectType, regardingObjectId);
                Xrm.WebApi.online.execute(req).then(function (response) {
                    response.json().then(function (jsonResponse) {
                        if (jsonResponse.value.length == 1) {
                            ContextualEmailController.setAttributeValue(formContext, ContextualEmailController.subjectAttribute, jsonResponse.value[0].subject);
                            ContextualEmailController.setAttributeValue(formContext, ContextualEmailController.descriptionAttribute, jsonResponse.value[0].description);
                            ContextualEmailController.NotifyPanelSubjectChange(eventContext);
                            Xrm && Xrm.Reporting && Xrm.Reporting.reportSuccess(ContextualEmailController.InstantiateTemplateComponentName);
                        }
                    }, function (error) {
                        Xrm && Xrm.Reporting && Xrm.Reporting.reportFailure(ContextualEmailController.InstantiateTemplateComponentName, Error(error.innerror.message));
                    });
                }, function (error) {
                    Xrm && Xrm.Reporting && Xrm.Reporting.reportFailure(ContextualEmailController.InstantiateTemplateComponentName, Error(error.innerror.message));
                });
            }
        };
        ContextualEmailController.setAttributeValue = function (formContext, attributeId, value) {
            var attribute = formContext.getAttribute(attributeId);
            if (attribute != null) {
                attribute.setValue(value);
            }
        };
        ;
        return ContextualEmailController;
    }());
    ContextualEmailController.contextualEmailFormId = "b54ca399-eaa6-45f8-83f2-c268b0021087";
    ContextualEmailController.EmailEngagementFCB = "EmailEngagement";
    ContextualEmailController.EmailEngagementTabName = "EmailEngagementTab";
    ContextualEmailController.NotifyPanelSubjectChangeFailedEvent = "DispatchSubjectChangedInPanelEventFailed";
    ContextualEmailController.subjectAttribute = "subject";
    ContextualEmailController.descriptionAttribute = "description";
    ContextualEmailController.regardingobjectAttribute = "regardingobjectid";
    ContextualEmailController.templateIdAttribute = "templateid";
    ContextualEmailController.InstantiateTemplateComponentName = "ContextualEmailInstantiateTemplateRequest";
    Sales.ContextualEmailController = ContextualEmailController;
})(Sales || (Sales = {}));
/// <reference path="../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var Sales;
(function (Sales) {
    var DocumentsTabController = (function () {
        function DocumentsTabController() {
        }
        DocumentsTabController.shouldShowDocumentsTab = function (context) {
            if (context) {
                var formContext = context.getFormContext();
                var filesTab = formContext.ui.tabs.get(this.DocumentsTabName);
                if (filesTab && !this.isFeatureEnabled(this.October2019FCB)) {
                    filesTab.setVisible(false);
                }
            }
        };
        DocumentsTabController.isFeatureEnabled = function (fcbName) {
            return Xrm.Internal.isUci() ? Xrm.Internal.isFeatureEnabled(fcbName) : Xrm.Internal.isFeatureEnabled("FCB." + fcbName);
        };
        return DocumentsTabController;
    }());
    DocumentsTabController.October2019FCB = "October2019Update";
    DocumentsTabController.DocumentsTabName = "documents_sharepoint";
    Sales.DocumentsTabController = DocumentsTabController;
})(Sales || (Sales = {}));
/// <reference path="../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var Sales;
(function (Sales) {
    var AddressSuggestionsControl = (function () {
        function AddressSuggestionsControl() {
        }
        AddressSuggestionsControl.shouldShowAddressSuggestionsControl = function (context) {
            return __awaiter(this, void 0, void 0, function () {
                var formContext, addressSection, accountMainFormId, isAccountMainForm, addressSuggestionsControlSettings, addressSuggestionsControl, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            if (!context) {
                                return [2 /*return*/];
                            }
                            formContext = context.getFormContext();
                            addressSection = formContext.ui.tabs.get(formContext.data.entity.getEntityName() === "lead" ? this.LeadSummaryTabName : this.SummaryTabName).sections.get(this.AddressSuggestionsControlSectionName);
                            if (addressSection === null || addressSection === undefined) {
                                return [2 /*return*/];
                            }
                            accountMainFormId = "8448b78f-8f42-454e-8e2a-f8196b0419af";
                            isAccountMainForm = formContext.ui.formSelector.getCurrentItem().getId() === accountMainFormId;
                            return [4 /*yield*/, this.getAddressSuggestionsControlSettings()];
                        case 1:
                            addressSuggestionsControlSettings = _a.sent();
                            if (addressSuggestionsControlSettings &&
                                addressSuggestionsControlSettings.areSalesAddressSuggestionsEnabled &&
                                addressSuggestionsControlSettings.enableBingMapsIntegration) {
                                if (isAccountMainForm) {
                                    addressSuggestionsControl = formContext.ui.tabs.get(this.SummaryTabName).sections.get(this.AddressSectionNameInAccountForm).controls.get(this.AddressSuggestionsControlId);
                                    if (addressSuggestionsControl === null || addressSuggestionsControl === undefined) {
                                        addressSection.setVisible(true);
                                        window.Xrm && window.Xrm.Reporting && window.Xrm.Reporting.reportSuccess('Sales.AddressSuggestionsControl', [{ name: "isAddressSuggestionsControlEnabled", value: "true" }, { name: "entityName", value: formContext.data.entity.getEntityName() }]);
                                    }
                                }
                                else {
                                    // This case will handle lead and contact main form.
                                    // For contact this block will only gets executed when field service is not there in the org.
                                    // Because field service also brings this same control on contact main form. So while merging the section name will get overridden.
                                    // Therefore, AddressSuggestionsControlSectionName will be different for contact main form.
                                    addressSection.setVisible(true);
                                    window.Xrm && window.Xrm.Reporting && window.Xrm.Reporting.reportSuccess('Sales.AddressSuggestionsControl', [{ name: "isAddressSuggestionsControlEnabled", value: "true" }, { name: "entityName", value: formContext.data.entity.getEntityName() }]);
                                }
                            }
                            else {
                                window.Xrm && window.Xrm.Reporting && window.Xrm.Reporting.reportFailure('Sales.AddressSuggestionsControl', Error("Address suggestions control settings are not enabled"));
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            window.Xrm && window.Xrm.Reporting && window.Xrm.Reporting.reportFailure("Sales.AddressSuggestionsControl", Error("Error in setting the visibility of address suggestions control section" + ("" + error_1.message)));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        AddressSuggestionsControl.getAddressSuggestionsControlSettings = function () {
            return __awaiter(this, void 0, void 0, function () {
                var areSalesAddressSuggestionsEnabled, enableBingMapsIntegration, addressSuggestionsCacheKey, bingMapsCacheKey, addressSuggestionsCachedResult, bingMapsCachedResult, response, aresalesaddresssuggestionsenabled, enablebingmapsintegration;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            areSalesAddressSuggestionsEnabled = window.Xrm && window.Xrm.Page && window.Xrm.Page.context.organizationSettings.attributes["" + this.AddressSuggestionsEnabledAttributeName];
                            enableBingMapsIntegration = window.Xrm && window.Xrm.Page && window.Xrm.Page.context.organizationSettings.attributes["" + this.BingMapsIntegrationEnabledAttributeName];
                            if (!!areSalesAddressSuggestionsEnabled && !!enableBingMapsIntegration) {
                                return [2 /*return*/, {
                                        "areSalesAddressSuggestionsEnabled": areSalesAddressSuggestionsEnabled,
                                        "enableBingMapsIntegration": enableBingMapsIntegration
                                    }];
                            }
                            addressSuggestionsCacheKey = "AreSalesAddressSuggestionsEnabled";
                            bingMapsCacheKey = "EnableBingMapsIntegration";
                            addressSuggestionsCachedResult = Sales.ClientUtil.getItemFromStorage(addressSuggestionsCacheKey);
                            bingMapsCachedResult = Sales.ClientUtil.getItemFromStorage(bingMapsCacheKey);
                            if (addressSuggestionsCachedResult && bingMapsCachedResult) {
                                return [2 /*return*/, {
                                        "areSalesAddressSuggestionsEnabled": Sales.ClientUtil.safeJsonParse(addressSuggestionsCachedResult),
                                        "enableBingMapsIntegration": Sales.ClientUtil.safeJsonParse(bingMapsCachedResult),
                                    }];
                            }
                            return [4 /*yield*/, Xrm.WebApi.online.retrieveRecord("organization", Xrm.Utility.getGlobalContext().organizationSettings.organizationId, "?$select=" + this.AddressSuggestionsEnabledAttributeName + "," + this.BingMapsIntegrationEnabledAttributeName)];
                        case 1:
                            response = _a.sent();
                            if (response != null) {
                                aresalesaddresssuggestionsenabled = response.aresalesaddresssuggestionsenabled, enablebingmapsintegration = response.enablebingmapsintegration;
                                Sales.ClientUtil.setItemInStorage(addressSuggestionsCacheKey, Sales.ClientUtil.safeJsonStringify(aresalesaddresssuggestionsenabled));
                                Sales.ClientUtil.setItemInStorage(bingMapsCacheKey, Sales.ClientUtil.safeJsonStringify(enablebingmapsintegration));
                                return [2 /*return*/, {
                                        "areSalesAddressSuggestionsEnabled": aresalesaddresssuggestionsenabled,
                                        "enableBingMapsIntegration": enablebingmapsintegration
                                    }];
                            }
                            return [2 /*return*/, {
                                    "areSalesAddressSuggestionsEnabled": false,
                                    "enableBingMapsIntegration": false
                                }];
                    }
                });
            });
        };
        return AddressSuggestionsControl;
    }());
    AddressSuggestionsControl.SummaryTabName = "SUMMARY_TAB";
    AddressSuggestionsControl.LeadSummaryTabName = "Summary";
    AddressSuggestionsControl.AddressSuggestionsControlSectionName = "SUMMARY_TAB_ADDRESSINPUT_SECTION";
    AddressSuggestionsControl.AddressSectionNameInAccountForm = "ADDRESS";
    AddressSuggestionsControl.AddressSuggestionsControlId = "address1_line1";
    AddressSuggestionsControl.AddressSuggestionsEnabledAttributeName = "aresalesaddresssuggestionsenabled";
    AddressSuggestionsControl.BingMapsIntegrationEnabledAttributeName = "enablebingmapsintegration";
    Sales.AddressSuggestionsControl = AddressSuggestionsControl;
})(Sales || (Sales = {}));
/// <reference path="../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var Sales;
(function (Sales) {
    var CommunicationTabController = (function () {
        function CommunicationTabController() {
        }
        CommunicationTabController.shouldShowCommunicationsTab = function (context) {
            if (context) {
                var formContext = context.getFormContext();
                if (!formContext) {
                    return;
                }
                var communicationsTab_1 = formContext.ui &&
                    formContext.ui.tabs &&
                    formContext.ui.tabs.get("tab_communication");
                var leadId = formContext.data &&
                    formContext.data.entity &&
                    formContext.data.entity.getId();
                Xrm &&
                    Xrm.Reporting &&
                    Xrm.Reporting.reportSuccess("Lead.ShowHideCommunicationsTab", [
                        {
                            name: "isCommunicationsTabPresent",
                            value: communicationsTab_1 ? "true" : "false",
                        },
                        { name: "leadId", value: leadId ? leadId : "null" },
                    ]);
                var isFcsEnabled = this.isCIJConsentV2Enabled();
                if (!isFcsEnabled || !communicationsTab_1 || !leadId) {
                    return;
                }
                Xrm.WebApi.retrieveMultipleRecords("msdyn_salesagentrun", "?$filter=_msdyn_regardingid_value eq " + leadId + "&$top=1").then(function (result) {
                    if (result.entities.length > 0) {
                        communicationsTab_1.setVisible(true);
                    }
                    else {
                        communicationsTab_1.setVisible(false);
                    }
                    Xrm &&
                        Xrm.Reporting &&
                        Xrm.Reporting.reportSuccess("Lead.ShowHideCommunicationsTab", [
                            {
                                name: "isCommunicationsTabVisible",
                                value: communicationsTab_1.getVisible().toString(),
                            },
                        ]);
                }, function (error) {
                    Xrm &&
                        Xrm.Reporting &&
                        Xrm.Reporting.reportFailure("Lead.ShowHideCommunicationsTab", error);
                });
            }
        };
        CommunicationTabController.isCIJConsentV2Enabled = function () {
            var fcsNamespace = "SalesService.SQAAutonomous";
            var featureName = "EnableCIJIntegrationForConsentV2";
            var isFcsEnabled = Xrm.Utility.getGlobalContext().getFeatureControlSetting(fcsNamespace, featureName);
            Xrm &&
                Xrm.Reporting &&
                Xrm.Reporting.reportSuccess("Lead.ShowHideCommunicationsTab", [
                    {
                        name: "isFcsEnabled",
                        value: Boolean(isFcsEnabled).toString(),
                    },
                ]);
            return Boolean(isFcsEnabled);
        };
        return CommunicationTabController;
    }());
    Sales.CommunicationTabController = CommunicationTabController;
})(Sales || (Sales = {}));
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
    var CalculateActualValueOpportunityRequest = (function () {
        function CalculateActualValueOpportunityRequest(entity /*Microsoft.Dynamics.CRM.opportunity*/) {
            this.entity = entity;
        }
        CalculateActualValueOpportunityRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.opportunity",
                        "structuralProperty": 5,
                    },
                },
                operationName: "CalculateActualValueOpportunity",
                operationType: 0,
            };
            return metadata;
        };
        return CalculateActualValueOpportunityRequest;
    }());
    ODataContract.CalculateActualValueOpportunityRequest = CalculateActualValueOpportunityRequest;
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
    var CancelSalesOrderRequest = (function () {
        function CancelSalesOrderRequest(orderClose /*Microsoft.Dynamics.CRM.crmbaseentity*/, status) {
            this.OrderClose = orderClose;
            this.Status = status;
        }
        CancelSalesOrderRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "OrderClose": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5,
                    },
                    "Status": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1,
                    },
                },
                operationName: "CancelSalesOrder",
                operationType: 0,
            };
            return metadata;
        };
        return CancelSalesOrderRequest;
    }());
    ODataContract.CancelSalesOrderRequest = CancelSalesOrderRequest;
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
    var CloseQuoteRequest = (function () {
        function CloseQuoteRequest(quoteClose /*Microsoft.Dynamics.CRM.quoteclose*/, status) {
            this.QuoteClose = quoteClose;
            this.Status = status;
        }
        CloseQuoteRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "QuoteClose": {
                        "typeName": "Microsoft.Dynamics.CRM.quoteclose",
                        "structuralProperty": 5,
                    },
                    "Status": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1,
                    },
                },
                operationName: "CloseQuote",
                operationType: 0,
            };
            return metadata;
        };
        return CloseQuoteRequest;
    }());
    ODataContract.CloseQuoteRequest = CloseQuoteRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
/// <reference path="../../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var ConvertQuoteToSalesOrderRequest = (function () {
        function ConvertQuoteToSalesOrderRequest(quoteId, columnSet, quoteCloseDate /*Edm.DateTimeOffset*/, quoteCloseStatus, quoteCloseSubject, quoteCloseDescription, processInstanceId /*Microsoft.Dynamics.CRM.crmbaseentity*/) {
            this.QuoteId = quoteId;
            this.ColumnSet = columnSet;
            this.QuoteCloseDate = quoteCloseDate;
            this.QuoteCloseStatus = quoteCloseStatus;
            this.QuoteCloseSubject = quoteCloseSubject;
            this.QuoteCloseDescription = quoteCloseDescription;
            this.ProcessInstanceId = processInstanceId;
        }
        ConvertQuoteToSalesOrderRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "QuoteId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                    "ColumnSet": {
                        "typeName": "Microsoft.Dynamics.CRM.ColumnSet",
                        "structuralProperty": 2,
                    },
                    "QuoteCloseDate": {
                        "typeName": "Edm.DateTimeOffset",
                        "structuralProperty": 1,
                    },
                    "QuoteCloseStatus": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1,
                    },
                    "QuoteCloseSubject": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "QuoteCloseDescription": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "ProcessInstanceId": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5,
                    },
                },
                operationName: "ConvertQuoteToSalesOrder",
                operationType: 0,
            };
            return metadata;
        };
        return ConvertQuoteToSalesOrderRequest;
    }());
    ODataContract.ConvertQuoteToSalesOrderRequest = ConvertQuoteToSalesOrderRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
/// <reference path="../../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var ConvertSalesOrderToInvoiceRequest = (function () {
        function ConvertSalesOrderToInvoiceRequest() {
        }
        ConvertSalesOrderToInvoiceRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                operationName: "ConvertSalesOrderToInvoice",
                operationType: 0 /* Action */,
                parameterTypes: {
                    "SalesOrderId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1 /* PrimitiveType */,
                    },
                    "ColumnSet": {
                        "typeName": "Microsoft.Dynamics.CRM.ColumnSet",
                        "structuralProperty": 2 /* ComplexType */,
                    },
                    "ProcessInstanceId": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5 /* EntityType */,
                    },
                },
            };
            return metadata;
        };
        return ConvertSalesOrderToInvoiceRequest;
    }());
    ODataContract.ConvertSalesOrderToInvoiceRequest = ConvertSalesOrderToInvoiceRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
/* tslint:disable:crm-file-name-pascal-case */
/* tslint:disable:crm-force-fields-private */
var ODataContract;
(function (ODataContract) {
    var CreateProductsRequest = (function () {
        function CreateProductsRequest() {
        }
        CreateProductsRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "Entities": {
                        "typeName": "mscrm.crmbaseentity",
                        "structuralProperty": 4 /* Collection */,
                    },
                    "ParentEntity": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5 /* EntityType */,
                    },
                },
                operationName: "CreateProducts",
                operationType: 0 /* Action */,
            };
            return metadata;
        };
        return CreateProductsRequest;
    }());
    ODataContract.CreateProductsRequest = CreateProductsRequest;
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
    var FulfillSalesOrderRequest = (function () {
        function FulfillSalesOrderRequest(orderClose /*Microsoft.Dynamics.CRM.orderclose*/, status) {
            this.OrderClose = orderClose;
            this.Status = status;
        }
        FulfillSalesOrderRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entityset",
                parameterTypes: {
                    "entityset": {
                        "typeName": "mscrm.salesorder",
                        "structuralProperty": 4,
                    },
                    "OrderClose": {
                        "typeName": "Microsoft.Dynamics.CRM.orderclose",
                        "structuralProperty": 5,
                    },
                    "Status": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1,
                    },
                },
                operationName: "FulfillSalesOrder",
                operationType: 0,
            };
            return metadata;
        };
        return FulfillSalesOrderRequest;
    }());
    ODataContract.FulfillSalesOrderRequest = FulfillSalesOrderRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
/// <reference path="../../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var GenerateQuoteFromOpportunityRequest = (function () {
        function GenerateQuoteFromOpportunityRequest() {
        }
        GenerateQuoteFromOpportunityRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                operationName: "GenerateQuoteFromOpportunity",
                operationType: 0,
                parameterTypes: {
                    "OpportunityId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1 /* PrimitiveType */,
                    },
                    "ColumnSet": {
                        "typeName": "Microsoft.Dynamics.CRM.ColumnSet",
                        "structuralProperty": 2 /* ComplexType */,
                    },
                    "ProcessInstanceId": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5 /* EntityType */,
                    },
                },
            };
            return metadata;
        };
        return GenerateQuoteFromOpportunityRequest;
    }());
    ODataContract.GenerateQuoteFromOpportunityRequest = GenerateQuoteFromOpportunityRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
/// <reference path="../../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var GenerateSalesOrderFromOpportunityRequest = (function () {
        function GenerateSalesOrderFromOpportunityRequest() {
        }
        GenerateSalesOrderFromOpportunityRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                operationName: "GenerateSalesOrderFromOpportunity",
                operationType: 0,
                parameterTypes: {
                    "OpportunityId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1 /* PrimitiveType */,
                    },
                    "ColumnSet": {
                        "typeName": "Microsoft.Dynamics.CRM.ColumnSet",
                        "structuralProperty": 2 /* ComplexType */,
                    },
                    "ProcessInstanceId": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5 /* EntityType */,
                    },
                },
            };
            return metadata;
        };
        return GenerateSalesOrderFromOpportunityRequest;
    }());
    ODataContract.GenerateSalesOrderFromOpportunityRequest = GenerateSalesOrderFromOpportunityRequest;
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
    var GetInvoiceProductsFromOpportunityRequest = (function () {
        function GetInvoiceProductsFromOpportunityRequest(entity /*Microsoft.Dynamics.CRM.invoice*/, opportunity /*Microsoft.Dynamics.CRM.opportunity*/) {
            this.entity = entity;
            this.Opportunity = opportunity;
        }
        GetInvoiceProductsFromOpportunityRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.invoice",
                        "structuralProperty": 5,
                    },
                    "Opportunity": {
                        "typeName": "Microsoft.Dynamics.CRM.opportunity",
                        "structuralProperty": 5,
                    },
                },
                operationName: "GetInvoiceProductsFromOpportunity",
                operationType: 0,
            };
            return metadata;
        };
        return GetInvoiceProductsFromOpportunityRequest;
    }());
    ODataContract.GetInvoiceProductsFromOpportunityRequest = GetInvoiceProductsFromOpportunityRequest;
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
    var GetQuoteProductsFromOpportunityRequest = (function () {
        function GetQuoteProductsFromOpportunityRequest(entity /*Microsoft.Dynamics.CRM.quote*/, opportunity /*Microsoft.Dynamics.CRM.opportunity*/) {
            this.entity = entity;
            this.Opportunity = opportunity;
        }
        GetQuoteProductsFromOpportunityRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.quote",
                        "structuralProperty": 5,
                    },
                    "Opportunity": {
                        "typeName": "Microsoft.Dynamics.CRM.opportunity",
                        "structuralProperty": 5,
                    },
                },
                operationName: "GetQuoteProductsFromOpportunity",
                operationType: 0,
            };
            return metadata;
        };
        return GetQuoteProductsFromOpportunityRequest;
    }());
    ODataContract.GetQuoteProductsFromOpportunityRequest = GetQuoteProductsFromOpportunityRequest;
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
    var GetSalesOrderProductsFromOpportunityRequest = (function () {
        function GetSalesOrderProductsFromOpportunityRequest(entity /*Microsoft.Dynamics.CRM.salesorder*/, opportunity /*Microsoft.Dynamics.CRM.opportunity*/) {
            this.entity = entity;
            this.Opportunity = opportunity;
        }
        GetSalesOrderProductsFromOpportunityRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.salesorder",
                        "structuralProperty": 5,
                    },
                    "Opportunity": {
                        "typeName": "Microsoft.Dynamics.CRM.opportunity",
                        "structuralProperty": 5,
                    },
                },
                operationName: "GetSalesOrderProductsFromOpportunity",
                operationType: 0,
            };
            return metadata;
        };
        return GetSalesOrderProductsFromOpportunityRequest;
    }());
    ODataContract.GetSalesOrderProductsFromOpportunityRequest = GetSalesOrderProductsFromOpportunityRequest;
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
    var LockInvoicePricingRequest = (function () {
        function LockInvoicePricingRequest(entity /*Microsoft.Dynamics.CRM.invoice*/) {
            this.entity = entity;
        }
        LockInvoicePricingRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.invoice",
                        "structuralProperty": 5,
                    },
                },
                operationName: "LockInvoicePricing",
                operationType: 0,
            };
            return metadata;
        };
        return LockInvoicePricingRequest;
    }());
    ODataContract.LockInvoicePricingRequest = LockInvoicePricingRequest;
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
    var LockSalesOrderPricingRequest = (function () {
        function LockSalesOrderPricingRequest(entity /*Microsoft.Dynamics.CRM.salesorder*/) {
            this.entity = entity;
        }
        LockSalesOrderPricingRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.salesorder",
                        "structuralProperty": 5,
                    },
                },
                operationName: "LockSalesOrderPricing",
                operationType: 0,
            };
            return metadata;
        };
        return LockSalesOrderPricingRequest;
    }());
    ODataContract.LockSalesOrderPricingRequest = LockSalesOrderPricingRequest;
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
    var LoseOpportunityRequest = (function () {
        function LoseOpportunityRequest(opportunityClose /*Microsoft.Dynamics.CRM.opportunityclose*/, status) {
            this.OpportunityClose = opportunityClose;
            this.Status = status;
        }
        LoseOpportunityRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "OpportunityClose": {
                        "typeName": "Microsoft.Dynamics.CRM.opportunityclose",
                        "structuralProperty": 5,
                    },
                    "Status": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1,
                    },
                },
                operationName: "LoseOpportunity",
                operationType: 0,
            };
            return metadata;
        };
        return LoseOpportunityRequest;
    }());
    ODataContract.LoseOpportunityRequest = LoseOpportunityRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
/// <reference path="../../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var ReviseQuoteRequest = (function () {
        //TODO: See if guid is of object or string.
        function ReviseQuoteRequest(quoteId, columnSet) {
            this.QuoteId = quoteId;
            this.ColumnSet = columnSet;
        }
        ReviseQuoteRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "QuoteId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                    "ColumnSet": {
                        "typeName": "Microsoft.Dynamics.CRM.ColumnSet",
                        "structuralProperty": 2,
                    },
                },
                operationName: "ReviseQuote",
                operationType: 0,
            };
            return metadata;
        };
        return ReviseQuoteRequest;
    }());
    ODataContract.ReviseQuoteRequest = ReviseQuoteRequest;
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
    var UnlockInvoicePricingRequest = (function () {
        function UnlockInvoicePricingRequest(invoiceId) {
            this.InvoiceId = invoiceId;
        }
        UnlockInvoicePricingRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "InvoiceId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                },
                operationName: "UnlockInvoicePricing",
                operationType: 0,
            };
            return metadata;
        };
        return UnlockInvoicePricingRequest;
    }());
    ODataContract.UnlockInvoicePricingRequest = UnlockInvoicePricingRequest;
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
    var UnlockSalesOrderPricingRequest = (function () {
        function UnlockSalesOrderPricingRequest(salesOrderId) {
            this.SalesOrderId = salesOrderId;
        }
        UnlockSalesOrderPricingRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "SalesOrderId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                },
                operationName: "UnlockSalesOrderPricing",
                operationType: 0,
            };
            return metadata;
        };
        return UnlockSalesOrderPricingRequest;
    }());
    ODataContract.UnlockSalesOrderPricingRequest = UnlockSalesOrderPricingRequest;
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
    var WinOpportunityRequest = (function () {
        function WinOpportunityRequest(opportunityClose /*Microsoft.Dynamics.CRM.opportunityclose*/, status) {
            this.OpportunityClose = opportunityClose;
            this.Status = status;
        }
        WinOpportunityRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "OpportunityClose": {
                        "typeName": "Microsoft.Dynamics.CRM.opportunityclose",
                        "structuralProperty": 5,
                    },
                    "Status": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1,
                    },
                },
                operationName: "WinOpportunity",
                operationType: 0,
            };
            return metadata;
        };
        return WinOpportunityRequest;
    }());
    ODataContract.WinOpportunityRequest = WinOpportunityRequest;
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
    var WinQuoteRequest = (function () {
        function WinQuoteRequest(quoteClose /*Microsoft.Dynamics.CRM.quoteclose*/, status) {
            this.QuoteClose = quoteClose;
            this.Status = status;
        }
        WinQuoteRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "QuoteClose": {
                        "typeName": "Microsoft.Dynamics.CRM.quoteclose",
                        "structuralProperty": 5,
                    },
                    "Status": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1,
                    },
                },
                operationName: "WinQuote",
                operationType: 0,
            };
            return metadata;
        };
        return WinQuoteRequest;
    }());
    ODataContract.WinQuoteRequest = WinQuoteRequest;
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
    var CreateEmailWithEntityDocumentRequest = (function () {
        function CreateEmailWithEntityDocumentRequest(entityTypeCode, selectedTemplate, selectedRecords, emailEntityData) {
            this.EntityTypeCode = entityTypeCode;
            this.SelectedTemplate = selectedTemplate;
            this.SelectedRecords = selectedRecords;
            this.EmailEntity = emailEntityData;
        }
        CreateEmailWithEntityDocumentRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                operationName: "CreateEmailWithEntityDocument",
                operationType: 0 /* Action */,
                parameterTypes: {
                    "EntityTypeCode": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1 /* PrimitiveType */,
                    },
                    "SelectedTemplate": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5 /* EntityType */,
                    },
                    "SelectedRecords": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1 /* PrimitiveType */,
                    },
                    "EmailEntity": {
                        "typeName": "Microsoft.Dynamics.CRM.email",
                        "structuralProperty": 5 /* EntityType */,
                    },
                },
            };
            return metadata;
        };
        return CreateEmailWithEntityDocumentRequest;
    }());
    ODataContract.CreateEmailWithEntityDocumentRequest = CreateEmailWithEntityDocumentRequest;
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
    var SaveEntityDocumentAsAttachmentToNoteRequest = (function () {
        function SaveEntityDocumentAsAttachmentToNoteRequest(entityTypeCode, selectedTemplate, selectedRecords, selectedEntity) {
            this.EntityTypeCode = entityTypeCode;
            this.SelectedTemplate = selectedTemplate;
            this.SelectedRecords = selectedRecords;
            this.SelectedEntity = selectedEntity;
        }
        SaveEntityDocumentAsAttachmentToNoteRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                operationName: "SaveEntityDocumentAsAttachmentToNote",
                operationType: 0 /* Action */,
                parameterTypes: {
                    "EntityTypeCode": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1 /* PrimitiveType */,
                    },
                    "SelectedTemplate": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5 /* EntityType */,
                    },
                    "SelectedRecords": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1 /* PrimitiveType */,
                    },
                    "SelectedEntity": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5 /* EntityType */,
                    },
                },
            };
            return metadata;
        };
        return SaveEntityDocumentAsAttachmentToNoteRequest;
    }());
    ODataContract.SaveEntityDocumentAsAttachmentToNoteRequest = SaveEntityDocumentAsAttachmentToNoteRequest;
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
    var SaveEntityDocumentToSharePointRequest = (function () {
        function SaveEntityDocumentToSharePointRequest(entityTypeCode, selectedTemplate, selectedRecords, selectedEntity, entityName) {
            this.EntityTypeCode = entityTypeCode;
            this.SelectedTemplate = selectedTemplate;
            this.SelectedRecords = selectedRecords;
            this.SelectedEntity = selectedEntity;
            this.EntityName = entityName;
        }
        SaveEntityDocumentToSharePointRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                operationName: "SaveEntityDocumentToSharePoint",
                operationType: 0 /* Action */,
                parameterTypes: {
                    "EntityTypeCode": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1 /* PrimitiveType */,
                    },
                    "SelectedTemplate": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5 /* EntityType */,
                    },
                    "SelectedRecords": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1 /* PrimitiveType */,
                    },
                    "SelectedEntity": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5 /* EntityType */,
                    },
                    "EntityName": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1 /* PrimitiveType */,
                    },
                },
            };
            return metadata;
        };
        return SaveEntityDocumentToSharePointRequest;
    }());
    ODataContract.SaveEntityDocumentToSharePointRequest = SaveEntityDocumentToSharePointRequest;
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
    var InstantiateTemplateRequest = (function () {
        function InstantiateTemplateRequest(templateId, objectType, objectId) {
            this.TemplateId = templateId;
            this.ObjectType = objectType;
            this.ObjectId = objectId;
        }
        InstantiateTemplateRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "TemplateId": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "ObjectType": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "ObjectId": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                },
                operationName: "InstantiateTemplate",
                operationType: 0,
            };
            return metadata;
        };
        return InstantiateTemplateRequest;
    }());
    ODataContract.InstantiateTemplateRequest = InstantiateTemplateRequest;
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
    var RetrieveEntityDefinitions = (function () {
        /**
         * constructor for ODataRetrieveEntityDefinitions
         * @param filter filter for the entity definition e.g.$filter=ObjectTypeCode eq 3
         * @param columns list of columns to be retrieved
         */
        function RetrieveEntityDefinitions(filter, columns) {
            this.filter = filter;
            this.columns = columns;
        }
        RetrieveEntityDefinitions.prototype.getMetadata = function () {
            return {
                boundParameter: undefined,
                parameterTypes: {},
                operationName: "EntityDefinitions",
                operationType: 2,
            };
        };
        return RetrieveEntityDefinitions;
    }());
    ODataContract.RetrieveEntityDefinitions = RetrieveEntityDefinitions;
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
    var CanCloseOpportunityRequest = (function () {
        function CanCloseOpportunityRequest(opportunity /*Microsoft.Dynamics.CRM.opportunity*/, quote /*Microsoft.Dynamics.CRM.quote*/, newStatus) {
            this.Opportunity = opportunity;
            this.Quote = quote;
            this.NewStatus = newStatus;
        }
        CanCloseOpportunityRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "Opportunity": {
                        "typeName": "Microsoft.Dynamics.CRM.opportunity",
                        "structuralProperty": 5,
                    },
                    "Quote": {
                        "typeName": "Microsoft.Dynamics.CRM.quote",
                        "structuralProperty": 5,
                    },
                    "NewStatus": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1,
                    },
                },
                operationName: "CanCloseOpportunity",
                operationType: 1,
            };
            return metadata;
        };
        return CanCloseOpportunityRequest;
    }());
    ODataContract.CanCloseOpportunityRequest = CanCloseOpportunityRequest;
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
    var GetActualDateRequest = (function () {
        function GetActualDateRequest(date) {
            this.Date = date;
        }
        GetActualDateRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "Date": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                },
                operationName: "GetActualDate",
                operationType: 1,
            };
            return metadata;
        };
        return GetActualDateRequest;
    }());
    ODataContract.GetActualDateRequest = GetActualDateRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
/* tslint:disable:crm-force-fields-private */
var ODataContract;
(function (ODataContract) {
    var GetQuantityDecimalRequest = (function () {
        function GetQuantityDecimalRequest() {
        }
        GetQuantityDecimalRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                operationName: "GetQuantityDecimal",
                operationType: 1,
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.salesorder",
                        "structuralProperty": 5 /* EntityType */,
                    },
                    "Product": {
                        "typeName": "Microsoft.Dynamics.CRM.product",
                        "structuralProperty": 5 /* EntityType */,
                    },
                    "UoM": {
                        "typeName": "Microsoft.Dynamics.CRM.uom",
                        "structuralProperty": 5 /* EntityType */,
                    },
                },
            };
            return metadata;
        };
        return GetQuantityDecimalRequest;
    }());
    ODataContract.GetQuantityDecimalRequest = GetQuantityDecimalRequest;
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
    var RetrieveAppComponentsRequest = (function () {
        function RetrieveAppComponentsRequest(appModuleId) {
            this.AppModuleId = appModuleId;
        }
        RetrieveAppComponentsRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "AppModuleId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                },
                operationName: "RetrieveAppComponents",
                operationType: 1,
            };
            return metadata;
        };
        return RetrieveAppComponentsRequest;
    }());
    ODataContract.RetrieveAppComponentsRequest = RetrieveAppComponentsRequest;
})(ODataContract || (ODataContract = {}));
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var RetrieveDefaultStatusForStateRequest = (function () {
        function RetrieveDefaultStatusForStateRequest(entityName, state) {
            this.EntityName = entityName;
            this.State = state;
        }
        RetrieveDefaultStatusForStateRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "EntityName": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "State": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1,
                    }
                },
                operationName: "RetrieveDefaultStatusForState",
                operationType: 1,
            };
            return metadata;
        };
        return RetrieveDefaultStatusForStateRequest;
    }());
    ODataContract.RetrieveDefaultStatusForStateRequest = RetrieveDefaultStatusForStateRequest;
})(ODataContract || (ODataContract = {}));
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var RetrieveDocumentTemplatesRequest = (function () {
        function RetrieveDocumentTemplatesRequest(entityTypeCode, documentType, entityset) {
            this.EntityTypeCode = entityTypeCode;
            this.DocumentType = documentType;
            this.entityset = entityset;
        }
        RetrieveDocumentTemplatesRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entityset",
                parameterTypes: {
                    "entityset": {
                        "typeName": "mscrm.documenttemplate",
                        "structuralProperty": 4
                    },
                    "EntityTypeCode": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1
                    },
                    "DocumentType": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1
                    }
                },
                operationName: "RetrieveDocumentTemplates",
                operationType: 1
            };
            return metadata;
        };
        return RetrieveDocumentTemplatesRequest;
    }());
    ODataContract.RetrieveDocumentTemplatesRequest = RetrieveDocumentTemplatesRequest;
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
    var UserPrivilegeRequest = (function () {
        function UserPrivilegeRequest(entity, privilege) {
            this.entity = entity;
            this.PrivilegeId = privilege;
        }
        UserPrivilegeRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.systemuser",
                        "structuralProperty": 5,
                    },
                    "PrivilegeId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                },
                operationName: "RetrieveUserPrivilegeByPrivilegeId",
                operationType: 1,
            };
            return metadata;
        };
        return UserPrivilegeRequest;
    }());
    ODataContract.UserPrivilegeRequest = UserPrivilegeRequest;
})(ODataContract || (ODataContract = {}));
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var ExportPDFDocumentRequest = (function () {
        function ExportPDFDocumentRequest(entityTypeCode, selectedTemplate /*Microsoft.Dynamics.CRM.crmbaseentity*/, selectedRecords) {
            this.EntityTypeCode = entityTypeCode;
            this.SelectedTemplate = selectedTemplate;
            this.SelectedRecords = selectedRecords;
        }
        ExportPDFDocumentRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "EntityTypeCode": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1
                    },
                    "SelectedTemplate": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5
                    },
                    "SelectedRecords": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    }
                },
                operationName: "ExportPdfDocument",
                operationType: 0
            };
            return metadata;
        };
        return ExportPDFDocumentRequest;
    }());
    ODataContract.ExportPDFDocumentRequest = ExportPDFDocumentRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
/// <reference path="../../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var GenerateInvoiceFromOpportunityRequest = (function () {
        function GenerateInvoiceFromOpportunityRequest() {
        }
        GenerateInvoiceFromOpportunityRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                operationName: "GenerateInvoiceFromOpportunity",
                operationType: 0,
                parameterTypes: {
                    "OpportunityId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1 /* PrimitiveType */,
                    },
                    "ColumnSet": {
                        "typeName": "Microsoft.Dynamics.CRM.ColumnSet",
                        "structuralProperty": 2 /* ComplexType */,
                    },
                    "ProcessInstanceId": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5 /* EntityType */,
                    },
                },
            };
            return metadata;
        };
        return GenerateInvoiceFromOpportunityRequest;
    }());
    ODataContract.GenerateInvoiceFromOpportunityRequest = GenerateInvoiceFromOpportunityRequest;
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
    var RecalculatePriceRequest = (function () {
        function RecalculatePriceRequest(entityId, entityLogicalName) {
            this.entityId = entityId;
            this.entityLogicalName = entityLogicalName;
        }
        RecalculatePriceRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "entityId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1 /* PrimitiveType */,
                    },
                    "entityLogicalName": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                },
                operationName: "RecalculatePrice",
                operationType: 0,
            };
            return metadata;
        };
        return RecalculatePriceRequest;
    }());
    ODataContract.RecalculatePriceRequest = RecalculatePriceRequest;
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
    var DeleteOQOILineWithSkipPricingCalculationRequest = (function () {
        function DeleteOQOILineWithSkipPricingCalculationRequest(entityId, entityLogicalName) {
            this.entityId = entityId;
            this.entityLogicalName = entityLogicalName;
        }
        DeleteOQOILineWithSkipPricingCalculationRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "entityId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1 /* PrimitiveType */,
                    },
                    "entityLogicalName": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                },
                operationName: "DeleteOQOILineWithSkipPricingCalculation",
                operationType: 0,
            };
            return metadata;
        };
        return DeleteOQOILineWithSkipPricingCalculationRequest;
    }());
    ODataContract.DeleteOQOILineWithSkipPricingCalculationRequest = DeleteOQOILineWithSkipPricingCalculationRequest;
})(ODataContract || (ODataContract = {}));
var Sales;
(function (Sales) {
    var DialogConfirmStrings = (function () {
        function DialogConfirmStrings() {
        }
        return DialogConfirmStrings;
    }());
    DialogConfirmStrings.ActivateGridDialogHeight = 250;
    DialogConfirmStrings.ActivateGridDialogWidth = 600;
    DialogConfirmStrings.DeactivateGridDialogHeight = 250;
    DialogConfirmStrings.DeactivateGridDialogWidth = 600;
    Sales.DialogConfirmStrings = DialogConfirmStrings;
})(Sales || (Sales = {}));
///<reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var Sales;
(function (Sales) {
    var CachedProperties = (function () {
        function CachedProperties() {
            var _this = this;
            this.cachedProp = {};
            this.clearCacheOnPageLoad = function () {
                _this.cachedProp = {};
            };
            this.unset = function (attributeName, description) {
                delete _this.cachedProp[description + attributeName];
            };
            this.setValueIfNotNull = function (attributeName, description, value) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(value)) {
                    _this.cachedProp[description + attributeName] = value;
                }
            };
            this.setValue = function (attributeName, description, attributeValue) {
                _this.cachedProp[description + attributeName] = attributeValue;
            };
            this.getValueSaved = function (attributeName, description) {
                var obj = (description + attributeName) in _this.cachedProp ? _this.cachedProp[description + attributeName] : null;
                if (!ClientUtility.DataUtil.isNullOrUndefined(obj)) {
                    return obj;
                }
                return null;
            };
            this.setPrevDataValueIfAttributeNotNull = function (attributeName) {
                var attribute = Xrm.Page.data.entity.attributes.get(attributeName);
                if (!ClientUtility.DataUtil.isNullOrUndefined(attribute)) {
                    _this.setValueIfNotNull(attribute.getName(), CachedProperties.PrevDataValue, attribute.getValue());
                }
            };
        }
        return CachedProperties;
    }());
    CachedProperties.PrevDataValue = "prevDataValue";
    CachedProperties.ReadOnlyKey = "IsReadOnly";
    Sales.CachedProperties = CachedProperties;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sales;
(function (Sales) {
    var EntityNames = (function () {
        function EntityNames() {
        }
        return EntityNames;
    }());
    EntityNames.Account = "account";
    EntityNames.ActivityMimeAttachment = "activitymimeattachment";
    EntityNames.Appointment = "appointment";
    EntityNames.Contact = "contact";
    EntityNames.Campaign = "campaign";
    EntityNames.CampaignActivity = "campaignactivity";
    EntityNames.CampaignResponse = "campaignresponse";
    EntityNames.Chat = "chat";
    EntityNames.Competitor = "competitor";
    EntityNames.DiscountType = "discounttype";
    EntityNames.Email = "email";
    EntityNames.Fax = "fax";
    EntityNames.Invoice = "invoice";
    EntityNames.InvoiceDetail = "invoicedetail";
    EntityNames.Lead = "lead";
    EntityNames.Letter = "letter";
    EntityNames.List = "list";
    EntityNames.None = "none";
    EntityNames.Organization = "organization";
    EntityNames.Opportunity = "opportunity";
    EntityNames.OpportunityClose = "opportunityclose";
    EntityNames.OpportunityProduct = "opportunityproduct";
    EntityNames.OrderClose = "orderclose";
    EntityNames.PhoneCall = "phonecall";
    EntityNames.PriceLevel = "pricelevel";
    EntityNames.Product = "product";
    EntityNames.ProductPriceLevel = "productpricelevel";
    EntityNames.Quote = "quote";
    EntityNames.QuoteClose = "quoteclose";
    EntityNames.QuoteDetail = "quotedetail";
    EntityNames.RecurringAppointmentMaster = "recurringappointmentmaster";
    EntityNames.SalesLiterature = "salesliterature";
    EntityNames.SalesLiteratureItem = "salesliteratureitem";
    EntityNames.SalesOrder = "salesorder";
    EntityNames.SalesOrderDetail = "salesorderdetail";
    EntityNames.SocialActivity = "socialactivity";
    EntityNames.SystemUser = "systemuser";
    EntityNames.Task = "task";
    EntityNames.TransactionCurrency = "transactioncurrency";
    EntityNames.UoM = "uom";
    EntityNames.PersonalDocumentTemplate = "personaldocumenttemplate";
    EntityNames.DocumentTemplate = "documenttemplate";
    Sales.EntityNames = EntityNames;
})(Sales || (Sales = {}));
var Sales;
(function (Sales) {
    var EntityTypeCodes;
    (function (EntityTypeCodes) {
        EntityTypeCodes[EntityTypeCodes["Account"] = 1] = "Account";
        EntityTypeCodes[EntityTypeCodes["Annotation"] = 5] = "Annotation";
        EntityTypeCodes[EntityTypeCodes["Appointment"] = 4201] = "Appointment";
        EntityTypeCodes[EntityTypeCodes["Campaign"] = 4400] = "Campaign";
        EntityTypeCodes[EntityTypeCodes["CampaignResponse"] = 4401] = "CampaignResponse";
        EntityTypeCodes[EntityTypeCodes["Contact"] = 2] = "Contact";
        EntityTypeCodes[EntityTypeCodes["Email"] = 4202] = "Email";
        EntityTypeCodes[EntityTypeCodes["Fax"] = 4204] = "Fax";
        EntityTypeCodes[EntityTypeCodes["Invoice"] = 1090] = "Invoice";
        EntityTypeCodes[EntityTypeCodes["InvoiceDetail"] = 1091] = "InvoiceDetail";
        EntityTypeCodes[EntityTypeCodes["Lead"] = 4] = "Lead";
        EntityTypeCodes[EntityTypeCodes["Letter"] = 4207] = "Letter";
        EntityTypeCodes[EntityTypeCodes["List"] = 4300] = "List";
        EntityTypeCodes[EntityTypeCodes["ListMember"] = 4301] = "ListMember";
        EntityTypeCodes[EntityTypeCodes["Opportunity"] = 3] = "Opportunity";
        EntityTypeCodes[EntityTypeCodes["OpportunityProduct"] = 1083] = "OpportunityProduct";
        EntityTypeCodes[EntityTypeCodes["PhoneCall"] = 4210] = "PhoneCall";
        EntityTypeCodes[EntityTypeCodes["Quote"] = 1084] = "Quote";
        EntityTypeCodes[EntityTypeCodes["QuoteDetail"] = 1085] = "QuoteDetail";
        EntityTypeCodes[EntityTypeCodes["RecurringAppointmentMaster"] = 4251] = "RecurringAppointmentMaster";
        EntityTypeCodes[EntityTypeCodes["SalesLiteratureItem"] = 1070] = "SalesLiteratureItem";
        EntityTypeCodes[EntityTypeCodes["SalesOrder"] = 1088] = "SalesOrder";
        EntityTypeCodes[EntityTypeCodes["SalesOrderDetail"] = 1089] = "SalesOrderDetail";
        EntityTypeCodes[EntityTypeCodes["SystemUser"] = 8] = "SystemUser";
        EntityTypeCodes[EntityTypeCodes["Task"] = 4212] = "Task";
        EntityTypeCodes[EntityTypeCodes["Territory"] = 2013] = "Territory";
    })(EntityTypeCodes = Sales.EntityTypeCodes || (Sales.EntityTypeCodes = {}));
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="./EntityNames.ts" />
/// <reference path="./EntityTypeCodes.ts" />
var Sales;
(function (Sales) {
    var ClientUtil = (function () {
        function ClientUtil() {
        }
        ClientUtil.getEntityName = function (entityTypeCode) {
            var propertyName = Sales.EntityTypeCodes[entityTypeCode];
            var errorMessage = "Not a valid entity type code";
            if (propertyName) {
                if (!Sales.EntityNames.hasOwnProperty(propertyName)) {
                    throw errorMessage;
                }
                else {
                    return Sales.EntityNames[propertyName];
                }
            }
            else {
                var result = Xrm.Internal.getEntityName(entityTypeCode);
                if (!result) {
                    throw errorMessage;
                }
                else {
                    return result;
                }
            }
        };
        ClientUtil.getEntityTypeCodes = function (entityName) {
            var propertyName = null;
            var errorMessage = "Not a valid entity name";
            for (var key in Sales.EntityNames) {
                if (Sales.EntityNames.hasOwnProperty(key)) {
                    var value = Sales.EntityNames[key];
                    if (value === entityName) {
                        propertyName = key;
                        break;
                    }
                }
            }
            if (propertyName) {
                if (!Sales.EntityTypeCodes.hasOwnProperty(propertyName)) {
                    throw errorMessage;
                }
                else {
                    var result = Sales.EntityTypeCodes[propertyName];
                    return result;
                }
            }
            else {
                var result = Xrm.Internal.getEntityCode(entityName);
                if (!result) {
                    throw errorMessage;
                }
                else {
                    return result;
                }
            }
        };
        ClientUtil.toTitleCase = function (str) {
            return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        };
        ClientUtil.safeJsonParse = function (json) {
            try {
                return JSON.parse(json);
            }
            catch (error) {
                return undefined;
            }
        };
        ClientUtil.safeJsonStringify = function (json) {
            try {
                return JSON.stringify(json);
            }
            catch (error) {
                return "";
            }
        };
        ClientUtil.getItemFromStorage = function (key, useLocalStorage) {
            try {
                if (useLocalStorage) {
                    return localStorage.getItem(key);
                }
                else {
                    return sessionStorage.getItem(key);
                }
            }
            catch (error) {
                window.Xrm && window.Xrm.Reporting && window.Xrm.Reporting.reportFailure("Sales.ClientUtil", Error("Error getting the " + key + " value from " + (useLocalStorage ? "local" : "session") + " storage + " + error.message));
                return null;
            }
        };
        ClientUtil.setItemInStorage = function (key, value, useLocalStorage) {
            try {
                if (useLocalStorage) {
                    localStorage.setItem(key, value);
                }
                else {
                    sessionStorage.setItem(key, value);
                }
            }
            catch (error) {
                window.Xrm && window.Xrm.Reporting && window.Xrm.Reporting.reportFailure("Sales.ClientUtil", Error("Error setting the " + key + " value in " + (useLocalStorage ? "local" : "session") + " storage + " + error.message));
            }
        };
        return ClientUtil;
    }());
    ClientUtil.SalesLiteAppName = "msdynce_salesbusiness";
    ClientUtil.addSteps = function (errorResponse) {
        var component = "SalesClientUtil";
        return new Promise(function (resolve, reject) {
            var columnList = ["LogicalName", "DisplayName"];
            var filter = "$filter=LogicalName eq 'quote' or LogicalName eq 'salesorder' or LogicalName eq 'salesorderdetail' " +
                "or LogicalName eq 'invoice' or LogicalName eq 'invoicedetail' or LogicalName eq 'product' " +
                "or LogicalName eq 'contact' or LogicalName eq 'sharepointdocument' or LogicalName eq 'account'";
            var fetchEntityReq = new ODataContract.RetrieveEntityDefinitions(filter, columnList);
            Xrm.WebApi.online.execute(fetchEntityReq).then(function (response) {
                response.json().then(function (jsonResponse) {
                    try {
                        var responseList = jsonResponse["value"];
                        var logicalNameMap = {};
                        for (var i = 0; i < responseList.length; i++) {
                            var logicalName = responseList[i]["LogicalName"];
                            var displayName = responseList[i]["DisplayName"]["UserLocalizedLabel"]["Label"];
                            logicalNameMap[logicalName] = displayName;
                        }
                        // TODO: replace this code once UCI has proper support for annotations
                        var parsedError = JSON.parse(JSON.parse(errorResponse.raw)._error)["error"];
                        var parsedSteps = JSON.parse(parsedError["@Microsoft.PowerApps.CDS.ErrorDetails.StepErrorDetails"]);
                        var localizedSteps = [];
                        for (var i = 0; i < parsedSteps.length; i++) {
                            var message = Sales.ResourceStringProvider.getResourceString(parsedSteps[i]['id']);
                            var parsedMessage = Sales.ClientUtil.parseMessage(message, logicalNameMap);
                            var status = parsedSteps[i]['status'];
                            localizedSteps.push({
                                message: parsedMessage,
                                status: status
                            });
                        }
                        errorResponse.steps = localizedSteps;
                    }
                    catch (error) {
                        Xrm.Reporting.reportFailure(component, error);
                    }
                    resolve();
                }, function (error) {
                    Xrm.Reporting.reportFailure(component, error);
                    resolve();
                });
            }, function (error) {
                Xrm.Reporting.reportFailure(component, error);
                resolve();
            });
        });
    };
    // replaces the placehodler text {lead} with mapping present in logicalNameMap
    ClientUtil.parseMessage = function (rawMessage, logicalNameMap) {
        var matches = rawMessage.match(/\{(.*?)\}/g);
        if (matches) {
            for (var i = 0; i < matches.length; i++) {
                var submatch = matches[i];
                var name = submatch.substring(1, submatch.length - 1);
                rawMessage = rawMessage.replace(submatch, logicalNameMap[name]);
            }
        }
        return rawMessage;
    };
    Sales.ClientUtil = ClientUtil;
})(Sales || (Sales = {}));
var Sales;
(function (Sales) {
    // <summary>
    // Close Quote Status
    // </summary>
    var CloseQuoteStatus;
    (function (CloseQuoteStatus) {
        CloseQuoteStatus[CloseQuoteStatus["Lost"] = 5] = "Lost";
        CloseQuoteStatus[CloseQuoteStatus["Canceled"] = 6] = "Canceled";
        CloseQuoteStatus[CloseQuoteStatus["Revised"] = 7] = "Revised";
    })(CloseQuoteStatus = Sales.CloseQuoteStatus || (Sales.CloseQuoteStatus = {}));
})(Sales || (Sales = {}));
var Sales;
(function (Sales) {
    var DialogName = (function () {
        function DialogName() {
        }
        return DialogName;
    }());
    DialogName.AcceptQuote = "AcceptQuote";
    DialogName.CloseInvoice = "InvoiceClose";
    DialogName.CloseOpportunity = "CloseOpportunity";
    DialogName.CloseOrder = "CloseOrder";
    DialogName.CloseQuote = "CloseQuote";
    DialogName.CreateDiscountList = "CreateDiscountList";
    DialogName.CreateOrder = "CreateOrder";
    DialogName.GetProducts = "GetProducts";
    DialogName.LookUpAddress = "LookUpAddress";
    DialogName.LookUpDetailAddress = "LookUpDetailAddress";
    DialogName.ConvertActivityDialog = "ConvertActivity";
    DialogName.SetStateDialog = "SetStateDialog";
    Sales.DialogName = DialogName;
})(Sales || (Sales = {}));
var Sales;
(function (Sales) {
    var DiscountTypeIsAmountType;
    (function (DiscountTypeIsAmountType) {
        DiscountTypeIsAmountType[DiscountTypeIsAmountType["Percentage"] = 0] = "Percentage";
        DiscountTypeIsAmountType[DiscountTypeIsAmountType["Amount"] = 1] = "Amount";
    })(DiscountTypeIsAmountType = Sales.DiscountTypeIsAmountType || (Sales.DiscountTypeIsAmountType = {}));
})(Sales || (Sales = {}));
var Sales;
(function (Sales) {
    var InvoiceState;
    (function (InvoiceState) {
        InvoiceState[InvoiceState["Active"] = 0] = "Active";
        InvoiceState[InvoiceState["Closed"] = 1] = "Closed";
        InvoiceState[InvoiceState["Paid"] = 2] = "Paid";
        InvoiceState[InvoiceState["Canceled"] = 3] = "Canceled";
    })(InvoiceState = Sales.InvoiceState || (Sales.InvoiceState = {}));
})(Sales || (Sales = {}));
///<reference path="./EntityNames.ts" />
var Sales;
(function (Sales) {
    /**
     * Utilities for Sales line items.
     */
    var LineItemUtil = (function () {
        function LineItemUtil() {
        }
        /**
         * Returns false only if FCB is enabled, runtime is UCI and  organization setting is set to false otherwise true.
         */
        LineItemUtil.IsPriceListMandatory = function () {
            // This code is not making any server calls so no need to cache the setting value
            var isPriceListMandatory = true;
            var isFeatureEnabled = ClientUtility.ClientUtil.isUCI() && Xrm.Internal.isFeatureEnabled(this.FCBMakePriceListNonMandatory) &&
                Xrm.Internal.isFeatureEnabled(this.FCBOctober2019Update);
            // If FCB is enabled and runtime is UCI, let us get the organization setting
            if (isFeatureEnabled) {
                var attribs = Xrm.Utility.getGlobalContext().organizationSettings.attributes;
                if (!ClientUtility.DataUtil.isNullOrUndefined(attribs) &&
                    !ClientUtility.DataUtil.isNullOrUndefined(attribs[this.IsPriceListMandatoryOrgSetting])) {
                    isPriceListMandatory = Xrm.Utility.getGlobalContext().organizationSettings.attributes[this.IsPriceListMandatoryOrgSetting] == 0 ? false : true;
                }
            }
            return isPriceListMandatory;
        };
        return LineItemUtil;
    }());
    LineItemUtil.FCBMakePriceListNonMandatory = "MakePriceListNonMandatory";
    LineItemUtil.FCBOctober2019Update = "October2019Update";
    LineItemUtil.IsPriceListMandatoryOrgSetting = "ispricelistmandatory";
    /**
     * Retrieves line item entity name from line item metadata.
     * @param {string} entityName Line item name.
     * @param {boolean} isCustomLineItem Is it a custom line item.
     * @param {any} lineItemMetadata The line item metadata.
     * @return {string} The line item entity name.
     */
    LineItemUtil.getLineItemEntityName = function (entityName, isCustomLineItem, lineItemMetadata) {
        if (isCustomLineItem) {
            return lineItemMetadata.entityName;
        }
        switch (entityName) {
            case Sales.EntityNames.Opportunity:
                return Sales.EntityNames.OpportunityProduct;
            case Sales.EntityNames.Quote:
                return Sales.EntityNames.QuoteDetail;
            case Sales.EntityNames.SalesOrder:
                return Sales.EntityNames.SalesOrderDetail;
            case Sales.EntityNames.Invoice:
                return Sales.EntityNames.InvoiceDetail;
            default:
                return null;
        }
    };
    /**
     * Checks if entity is a custom line item.
     * @param {string} entityName.
     * @return {boolean} Returns true if entity is a custom line item. False otherwise.
     */
    LineItemUtil.isCustomLineItemEntity = function (entityName) {
        switch (entityName.toLowerCase()) {
            case Sales.EntityNames.InvoiceDetail:
            case Sales.EntityNames.OpportunityProduct:
            case Sales.EntityNames.QuoteDetail:
            case Sales.EntityNames.SalesOrderDetail:
                return false;
            default:
                return true;
        }
    };
    Sales.LineItemUtil = LineItemUtil;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sales;
(function (Sales) {
    // TODO: Remove this class once object lookup becomes available in the WebClient.
    var LookupObjects = (function () {
        function LookupObjects() {
            this.items = null;
        }
        return LookupObjects;
    }());
    Sales.LookupObjects = LookupObjects;
})(Sales || (Sales = {}));
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var Sales;
(function (Sales) {
    var Messages = (function () {
        function Messages() {
        }
        Messages.setState = function (entityName, entityId, stateCode, statusCode, successCallback) {
            Xrm.WebApi.updateRecord(entityName, entityId, {
                statecode: stateCode,
                statuscode: statusCode
            }).then(successCallback, ClientUtility.ActionFailedHandler.actionFailedCallback);
        };
        return Messages;
    }());
    Sales.Messages = Messages;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sales;
(function (Sales) {
    var MetadataDrivenDialogConstants = (function () {
        function MetadataDrivenDialogConstants() {
        }
        return MetadataDrivenDialogConstants;
    }());
    MetadataDrivenDialogConstants.OpportunityId = "opportunityId";
    MetadataDrivenDialogConstants.DiscountTypeDeactivateHeight = 200;
    MetadataDrivenDialogConstants.Deactivate = "deactivate";
    MetadataDrivenDialogConstants.DefaultCloseState = "defaultCloseState";
    MetadataDrivenDialogConstants.ConvertActivityCommandName = "ConvertActivity";
    MetadataDrivenDialogConstants.CurrencyLookup = "currencyLookup";
    MetadataDrivenDialogConstants.CustomerLookup = "customerLookup";
    MetadataDrivenDialogConstants.LeadId = "leadId";
    MetadataDrivenDialogConstants.LeadLookup = "leadLookup";
    MetadataDrivenDialogConstants.LogResponseId = "cbLogResponse_id";
    MetadataDrivenDialogConstants.OpenNewId = "cbOpenNew_id";
    MetadataDrivenDialogConstants.OpenNewRecord = "openNewRecord";
    MetadataDrivenDialogConstants.SaveActivity = "saveActivity";
    MetadataDrivenDialogConstants.SaveActivityId = "cbSaveActivity_id";
    MetadataDrivenDialogConstants.Subject = "subject";
    MetadataDrivenDialogConstants.ActionName = "action_name";
    MetadataDrivenDialogConstants.EntityRrecords = "entity_records";
    Sales.MetadataDrivenDialogConstants = MetadataDrivenDialogConstants;
})(Sales || (Sales = {}));
var Sales;
(function (Sales) {
    var MetadataDrivenDialogConstantsConvertActivity = (function () {
        function MetadataDrivenDialogConstantsConvertActivity() {
        }
        return MetadataDrivenDialogConstantsConvertActivity;
    }());
    MetadataDrivenDialogConstantsConvertActivity.EntityId = "param_entityId";
    MetadataDrivenDialogConstantsConvertActivity.EntityTypeCode = "param_entityTypeCode";
    MetadataDrivenDialogConstantsConvertActivity.LeadId = "param_leadId";
    MetadataDrivenDialogConstantsConvertActivity.Subject = "param_subject";
    MetadataDrivenDialogConstantsConvertActivity.OpenNewRecord = "param_openNewRecord";
    MetadataDrivenDialogConstantsConvertActivity.OpportunityId = "param_opportunityId";
    MetadataDrivenDialogConstantsConvertActivity.OwnerId = "param_ownerId";
    MetadataDrivenDialogConstantsConvertActivity.OwnerName = "param_ownerName";
    MetadataDrivenDialogConstantsConvertActivity.OwnerType = "param_ownerType";
    MetadataDrivenDialogConstantsConvertActivity.SaveActivity = "param_saveActivity";
    MetadataDrivenDialogConstantsConvertActivity.LastButtonClicked = "param_lastButtonClicked";
    MetadataDrivenDialogConstantsConvertActivity.OpenNewChecked = "cbOpenNew_id";
    MetadataDrivenDialogConstantsConvertActivity.CurrencyId = "param_currencyId";
    MetadataDrivenDialogConstantsConvertActivity.CustomerId = "param_customerId";
    Sales.MetadataDrivenDialogConstantsConvertActivity = MetadataDrivenDialogConstantsConvertActivity;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sales;
(function (Sales) {
    var MetadataDrivenDialogConstantsCreateDiscountList = (function () {
        function MetadataDrivenDialogConstantsCreateDiscountList() {
        }
        return MetadataDrivenDialogConstantsCreateDiscountList;
    }());
    MetadataDrivenDialogConstantsCreateDiscountList.Name = "param_name";
    MetadataDrivenDialogConstantsCreateDiscountList.IsAmountType = "param_isamounttype";
    MetadataDrivenDialogConstantsCreateDiscountList.TransactionCurrencyId = "param_transactioncurrencyid";
    MetadataDrivenDialogConstantsCreateDiscountList.TransactionCurrencyName = "param_transactioncurrencyname";
    MetadataDrivenDialogConstantsCreateDiscountList.NameId = "creatediscountlistname_id";
    MetadataDrivenDialogConstantsCreateDiscountList.Type = "creatediscountlisttype_id";
    MetadataDrivenDialogConstantsCreateDiscountList.TransactionCurrency = "creatediscountlistcurrency_id";
    MetadataDrivenDialogConstantsCreateDiscountList.LastButtonClicked = "param_lastButtonClicked";
    MetadataDrivenDialogConstantsCreateDiscountList.CRMWRPCToken = "param_crmwrpctoken";
    MetadataDrivenDialogConstantsCreateDiscountList.CRMWRPCTokenTimeStamp = "param_crmwrpctokentimestamp";
    Sales.MetadataDrivenDialogConstantsCreateDiscountList = MetadataDrivenDialogConstantsCreateDiscountList;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sales;
(function (Sales) {
    var MetadataDrivenDialogConstantsGetProducts = (function () {
        function MetadataDrivenDialogConstantsGetProducts() {
        }
        return MetadataDrivenDialogConstantsGetProducts;
    }());
    MetadataDrivenDialogConstantsGetProducts.OpportunityId = "param_opportunityid";
    MetadataDrivenDialogConstantsGetProducts.Name = "param_name";
    MetadataDrivenDialogConstantsGetProducts.TransactionCurrencyId = "param_transactioncurrencyid";
    MetadataDrivenDialogConstantsGetProducts.DialogTitle = "lbl_getproducts";
    MetadataDrivenDialogConstantsGetProducts.DialogDescription = "lbl_getproductsdescription";
    MetadataDrivenDialogConstantsGetProducts.OpportunityLookup = "opportunity_id";
    MetadataDrivenDialogConstantsGetProducts.LastButtonClicked = "param_lastButtonClicked";
    Sales.MetadataDrivenDialogConstantsGetProducts = MetadataDrivenDialogConstantsGetProducts;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sales;
(function (Sales) {
    var MetadataDrivenDialogConstantsLookUpAddress = (function () {
        function MetadataDrivenDialogConstantsLookUpAddress() {
        }
        return MetadataDrivenDialogConstantsLookUpAddress;
    }());
    MetadataDrivenDialogConstantsLookUpAddress.ParentId = "param_parentId";
    MetadataDrivenDialogConstantsLookUpAddress.AddressId = "param_addressId";
    MetadataDrivenDialogConstantsLookUpAddress.LastButtonClicked = "param_lastButtonClicked";
    MetadataDrivenDialogConstantsLookUpAddress.DisableShipToCall = "param_disableShipToCall";
    Sales.MetadataDrivenDialogConstantsLookUpAddress = MetadataDrivenDialogConstantsLookUpAddress;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sales;
(function (Sales) {
    var MetadataDrivenDialogConstantsLookUpDetailAddress = (function () {
        function MetadataDrivenDialogConstantsLookUpDetailAddress() {
        }
        return MetadataDrivenDialogConstantsLookUpDetailAddress;
    }());
    MetadataDrivenDialogConstantsLookUpDetailAddress.ParentId = "param_parentId";
    MetadataDrivenDialogConstantsLookUpDetailAddress.AddressId = "param_addressId";
    MetadataDrivenDialogConstantsLookUpDetailAddress.LastButtonClicked = "param_lastButtonClicked";
    MetadataDrivenDialogConstantsLookUpDetailAddress.Quoteid = "quoteid";
    MetadataDrivenDialogConstantsLookUpDetailAddress.Salesorderid = "salesorderid";
    MetadataDrivenDialogConstantsLookUpDetailAddress.Invoiceid = "invoiceid";
    Sales.MetadataDrivenDialogConstantsLookUpDetailAddress = MetadataDrivenDialogConstantsLookUpDetailAddress;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sales;
(function (Sales) {
    var MetadataDrivenDialogConstantsInvoiceClose = (function () {
        function MetadataDrivenDialogConstantsInvoiceClose() {
        }
        return MetadataDrivenDialogConstantsInvoiceClose;
    }());
    MetadataDrivenDialogConstantsInvoiceClose.InvoiceId = "param_invoiceid";
    MetadataDrivenDialogConstantsInvoiceClose.ClosedState = "param_closedstate";
    MetadataDrivenDialogConstantsInvoiceClose.DialogTitle = "lbl_closeinvoice";
    MetadataDrivenDialogConstantsInvoiceClose.DialogDescription = "lbl_closeinvoicedescription";
    MetadataDrivenDialogConstantsInvoiceClose.Reason = "closeinvoicestatusreason_id";
    MetadataDrivenDialogConstantsInvoiceClose.LastButtonClicked = "param_lastButtonClicked";
    Sales.MetadataDrivenDialogConstantsInvoiceClose = MetadataDrivenDialogConstantsInvoiceClose;
})(Sales || (Sales = {}));
var Sales;
(function (Sales) {
    var MetadataDrivenDialogConstantsOpportunityClose = (function () {
        function MetadataDrivenDialogConstantsOpportunityClose() {
        }
        return MetadataDrivenDialogConstantsOpportunityClose;
    }());
    MetadataDrivenDialogConstantsOpportunityClose.ActualRevenueId = "actualrevenue_id";
    MetadataDrivenDialogConstantsOpportunityClose.Caller = "param_caller";
    MetadataDrivenDialogConstantsOpportunityClose.CallerParameters = "param_callerparameters";
    MetadataDrivenDialogConstantsOpportunityClose.CompetitorId = "competitor_id";
    MetadataDrivenDialogConstantsOpportunityClose.CloseDateId = "closedate_id";
    MetadataDrivenDialogConstantsOpportunityClose.DescriptionId = "description_id";
    MetadataDrivenDialogConstantsOpportunityClose.DescriptionMaxLength = 2000;
    MetadataDrivenDialogConstantsOpportunityClose.EntityName = "entityName";
    MetadataDrivenDialogConstantsOpportunityClose.GridControl = "gridControl";
    MetadataDrivenDialogConstantsOpportunityClose.HideCompetitorField = "param_hideCompetitorField";
    MetadataDrivenDialogConstantsOpportunityClose.LabelSubtitle = "lbl_closedescription";
    MetadataDrivenDialogConstantsOpportunityClose.LastButtonClicked = "param_lastButtonClicked";
    MetadataDrivenDialogConstantsOpportunityClose.OpportunityId = "param_opportunityId";
    MetadataDrivenDialogConstantsOpportunityClose.OpportunityName = "param_opportunityName";
    MetadataDrivenDialogConstantsOpportunityClose.OpportunityStatusReasonId = "statusreason_id";
    MetadataDrivenDialogConstantsOpportunityClose.TransactionCurrencyId = "transactioncurrencyid";
    MetadataDrivenDialogConstantsOpportunityClose.Won = "param_won";
    MetadataDrivenDialogConstantsOpportunityClose.TimeZoneOffsetMinutes = "param_timezone";
    MetadataDrivenDialogConstantsOpportunityClose.QuoteDialogResponse = "quoteDialogParameters";
    Sales.MetadataDrivenDialogConstantsOpportunityClose = MetadataDrivenDialogConstantsOpportunityClose;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sales;
(function (Sales) {
    var MetadataDrivenDialogConstantsOrderClose = (function () {
        function MetadataDrivenDialogConstantsOrderClose() {
        }
        return MetadataDrivenDialogConstantsOrderClose;
    }());
    MetadataDrivenDialogConstantsOrderClose.SalesId = "param_salesorderid";
    MetadataDrivenDialogConstantsOrderClose.ClosedState = "param_closedstate";
    MetadataDrivenDialogConstantsOrderClose.DialogTitle = "lbl_closeorder";
    MetadataDrivenDialogConstantsOrderClose.DialogDescription = "lbl_closeorderdescription";
    MetadataDrivenDialogConstantsOrderClose.Reason = "closeorderstatusreason_id";
    MetadataDrivenDialogConstantsOrderClose.Date = "closeorderdate_id";
    MetadataDrivenDialogConstantsOrderClose.Description = "description_id";
    MetadataDrivenDialogConstantsOrderClose.LastButtonClicked = "param_lastButtonClicked";
    Sales.MetadataDrivenDialogConstantsOrderClose = MetadataDrivenDialogConstantsOrderClose;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sales;
(function (Sales) {
    var MetadataDrivenDialogConstantsOrderCreate = (function () {
        function MetadataDrivenDialogConstantsOrderCreate() {
        }
        return MetadataDrivenDialogConstantsOrderCreate;
    }());
    MetadataDrivenDialogConstantsOrderCreate.QuoteId = "param_quoteid";
    MetadataDrivenDialogConstantsOrderCreate.OpportunityId = "param_opportunityid";
    MetadataDrivenDialogConstantsOrderCreate.ClosedState = "param_closedstate";
    MetadataDrivenDialogConstantsOrderCreate.DialogTitle = "lbl_createorder";
    MetadataDrivenDialogConstantsOrderCreate.DialogDescription = "lbl_createorderdescription";
    MetadataDrivenDialogConstantsOrderCreate.Reason = "createorderstatusreason_id";
    MetadataDrivenDialogConstantsOrderCreate.ReasonDescription = "param_createorderstatusreasondescription_id";
    MetadataDrivenDialogConstantsOrderCreate.Date = "createorderdate_id";
    MetadataDrivenDialogConstantsOrderCreate.CloseOpportunity = "createordercloseopportunity_id";
    MetadataDrivenDialogConstantsOrderCreate.CalculateRevenueFromQuote = "createordercalcrevenue_id";
    MetadataDrivenDialogConstantsOrderCreate.ActualRevenue = "actualrevenue_id";
    MetadataDrivenDialogConstantsOrderCreate.Description = "description_id";
    MetadataDrivenDialogConstantsOrderCreate.CanCloseOpportunity = "param_cancloseopportunity";
    MetadataDrivenDialogConstantsOrderCreate.LastButtonClicked = "param_lastButtonClicked";
    Sales.MetadataDrivenDialogConstantsOrderCreate = MetadataDrivenDialogConstantsOrderCreate;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sales;
(function (Sales) {
    var MetadataDrivenDialogConstantsQuoteClose = (function () {
        function MetadataDrivenDialogConstantsQuoteClose() {
        }
        return MetadataDrivenDialogConstantsQuoteClose;
    }());
    MetadataDrivenDialogConstantsQuoteClose.QuoteId = "param_quoteid";
    MetadataDrivenDialogConstantsQuoteClose.CanCloseOpportunity = "param_cancloseopportunity";
    MetadataDrivenDialogConstantsQuoteClose.OpportunityId = "param_opportunityid";
    MetadataDrivenDialogConstantsQuoteClose.ClosedState = "param_closedstate";
    MetadataDrivenDialogConstantsQuoteClose.DialogTitle = "lbl_closequote";
    MetadataDrivenDialogConstantsQuoteClose.DialogDescription = "lbl_closequotedescription";
    MetadataDrivenDialogConstantsQuoteClose.Reason = "closequotestatusreason_id";
    MetadataDrivenDialogConstantsQuoteClose.Date = "closequotedate_id";
    MetadataDrivenDialogConstantsQuoteClose.Description = "description_id";
    MetadataDrivenDialogConstantsQuoteClose.CreateRevisedQuote = "closequotecreaterevisedquote_id";
    MetadataDrivenDialogConstantsQuoteClose.CloseOpportunity = "closequotecloseopportunity_id";
    MetadataDrivenDialogConstantsQuoteClose.LastButtonClicked = "param_lastButtonClicked";
    MetadataDrivenDialogConstantsQuoteClose.TimeZoneOffsetMinutes = "param_timezone";
    Sales.MetadataDrivenDialogConstantsQuoteClose = MetadataDrivenDialogConstantsQuoteClose;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sales;
(function (Sales) {
    var OpportunityState;
    (function (OpportunityState) {
        OpportunityState[OpportunityState["Open"] = 0] = "Open";
        OpportunityState[OpportunityState["Won"] = 1] = "Won";
        OpportunityState[OpportunityState["Lost"] = 2] = "Lost";
    })(OpportunityState = Sales.OpportunityState || (Sales.OpportunityState = {}));
    ;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sales;
(function (Sales) {
    var QuoteState;
    (function (QuoteState) {
        QuoteState[QuoteState["Draft"] = 0] = "Draft";
        QuoteState[QuoteState["Active"] = 1] = "Active";
        QuoteState[QuoteState["Won"] = 2] = "Won";
        QuoteState[QuoteState["Closed"] = 3] = "Closed";
    })(QuoteState = Sales.QuoteState || (Sales.QuoteState = {}));
    ;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sales;
(function (Sales) {
    var ProductTypeImage = (function () {
        function ProductTypeImage() {
        }
        /**
         * Method to return ProductType image url
         * @param dataJson: Json object for product record
         * @returns Relative webresource ImageUrl.
         */
        ProductTypeImage.getProductTypeImageUrl = function (dataJson) {
            var data = JSON.parse(dataJson);
            var imgurl = "";
            if (data && data.isproductoverridden_Value) {
                var productTypeCodeAttrValue = data.producttypecode_Value;
                if (productTypeCodeAttrValue == 1) {
                    //Product
                    var isProductOverRiddenAttrValue = data.isproductoverridden_Value._val;
                    if (isProductOverRiddenAttrValue == 0) {
                        //Existing product
                        imgurl = "Sales/_imgs/productgrid/Product.svg";
                    }
                    else if (isProductOverRiddenAttrValue == 1) {
                        //Write-In product
                        imgurl = "Sales/_imgs/productgrid/WriteInProduct.svg";
                    }
                }
                else if (productTypeCodeAttrValue == 2) {
                    //Bundle
                    imgurl = "Sales/_imgs/productgrid/Bundle.svg";
                }
                else if (productTypeCodeAttrValue == 3 || productTypeCodeAttrValue == 4) {
                    //Existing required/optional bundle product
                    imgurl = "Sales/_imgs/productgrid/Product.svg";
                }
            }
            var resultarray = (imgurl === "") ? [] : [imgurl];
            return resultarray;
        };
        return ProductTypeImage;
    }());
    Sales.ProductTypeImage = ProductTypeImage;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sales;
(function (Sales) {
    var ProductConfigStatusTypeImage = (function () {
        function ProductConfigStatusTypeImage() {
        }
        /**
         * Method to return ProductConfigStatusType image url
         * @param dataJson: Json object for product record
         * @returns Relative webresource ImageUrl.
         */
        ProductConfigStatusTypeImage.getProductConfigStatusTypeImageUrl = function (dataJson) {
            var imgurl = "";
            if (dataJson.indexOf("propertyconfigurationstatus_Value") > -1) {
                var status_1 = "\"propertyconfigurationstatus_Value\"";
                var statusValue = dataJson.substr(dataJson.indexOf(status_1) + status_1.length + 1, 1);
                if (statusValue == "0") {
                    //Edit state
                    imgurl = "Sales/_imgs/productgrid/CompletedSolid.svg";
                }
                else if (statusValue == "1") {
                    //Rectify state
                    imgurl = "Sales/_imgs/productgrid/StatusErrorFull.svg";
                }
                else if (statusValue == "2") {
                    //Not Configured state
                    imgurl = "Sales/_imgs/productgrid/Placeholder.svg";
                }
            }
            var resultarray = [imgurl];
            return resultarray;
        };
        return ProductConfigStatusTypeImage;
    }());
    Sales.ProductConfigStatusTypeImage = ProductConfigStatusTypeImage;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sales;
(function (Sales) {
    var SalesOrderState;
    (function (SalesOrderState) {
        SalesOrderState[SalesOrderState["Active"] = 0] = "Active";
        SalesOrderState[SalesOrderState["Submitted"] = 1] = "Submitted";
        SalesOrderState[SalesOrderState["Canceled"] = 2] = "Canceled";
        SalesOrderState[SalesOrderState["Fulfilled"] = 3] = "Fulfilled";
        SalesOrderState[SalesOrderState["Invoiced"] = 4] = "Invoiced";
        SalesOrderState[SalesOrderState["FulfilledOrActive"] = 5] = "FulfilledOrActive";
    })(SalesOrderState = Sales.SalesOrderState || (Sales.SalesOrderState = {}));
})(Sales || (Sales = {}));
/// <reference path="AccessRights.ts" />
/// <reference path="../Localization/Provider/StringProvider.ts" />
/// <reference path="../Controls/AddOQOIProducts/Utility/CommonUtils.ts" />
/// <reference path="Controllers/DefaultPriceList.ts" />
/// <reference path="Controllers/OptionSetFilter.ts" />
/// <reference path="Controllers/ContextualEmailController.ts" />
/// <reference path="Controllers/DocumentsTabController.ts" />
/// <reference path="Controllers/AddressSuggestionsControl.ts" />
/// <reference path="Controllers/CommunicationTabController.ts" />
/// <reference path="DataContracts/Action/CalculateActualValueOpportunityRequest.ts" />
/// <reference path="DataContracts/Action/CancelSalesOrderRequest.ts" />
/// <reference path="DataContracts/Action/CloseQuoteRequest.ts" />
/// <reference path="DataContracts/Action/ConvertQuoteToSalesOrderRequest.ts" />
/// <reference path="DataContracts/Action/ConvertSalesOrderToInvoiceRequest.ts" />
/// <reference path="DataContracts/Action/CreateProductsRequest.ts" />
/// <reference path="DataContracts/Action/FulfillSalesOrderRequest.ts" />
/// <reference path="DataContracts/Action/GenerateQuoteFromOpportunityRequest.ts" />
/// <reference path="DataContracts/Action/GenerateSalesOrderFromOpportunityRequest.ts" />
/// <reference path="DataContracts/Action/GetInvoiceProductsFromOpportunityRequest.ts" />
/// <reference path="DataContracts/Action/GetQuoteProductsFromOpportunityRequest.ts" />
/// <reference path="DataContracts/Action/GetSalesOrderProductsFromOpportunityRequest.ts" />
/// <reference path="DataContracts/Action/LockInvoicePricingRequest.ts" />
/// <reference path="DataContracts/Action/LockSalesOrderPricingRequest.ts" />
/// <reference path="DataContracts/Action/LoseOpportunityRequest.ts" />
/// <reference path="DataContracts/Action/ReviseQuoteRequest.ts" />
/// <reference path="DataContracts/Action/UnlockInvoicePricingRequest.ts" />
/// <reference path="DataContracts/Action/UnlockSalesOrderPricingRequest.ts" />
/// <reference path="DataContracts/Action/WinOpportunityRequest.ts" />
/// <reference path="DataContracts/Action/WinQuoteRequest.ts" />
/// <reference path="DataContracts/Action/CreateEmailWithEntityDocumentRequest.ts" />
/// <reference path="DataContracts/Action/SaveEntityDocumentAsAttachmentToNoteRequest.ts" />
/// <reference path="DataContracts/Action/SaveEntityDocumentToSharePointRequest.ts" />
/// <reference path="DataContracts/Action/InstantiateTemplateRequest.ts" />
/// <reference path="DataContracts/Action/RetrieveEntityDefinitions.ts" />
/// <reference path="DataContracts/Function/CanCloseOpportunityRequest.ts" />
/// <reference path="DataContracts/Function/GetActualDateRequest.ts" />
/// <reference path="DataContracts/Function/GetDefaultPriceLevelRequest.ts" />
/// <reference path="DataContracts/Function/GetQuantityDecimalRequest.ts" />
/// <reference path="DataContracts/Function/RetrieveAppComponentsRequest.ts" />
/// <reference path="DataContracts/Function/RetrieveDefaultStatusForStateRequest.ts" />
/// <reference path="DataContracts/Function/RetrieveDocumentTemplatesRequest.ts" />
/// <reference path="DataContracts/Function/UserPrivilegeRequest.ts" />
/// <reference path="DataContracts/Function/ExportPDFDocumentRequest.ts" />
/// <reference path="DataContracts/Action/GenerateInvoiceFromOpportunityRequest.ts" />
/// <reference path="DataContracts/Action/RecalculatePriceRequest.ts" />
/// <reference path="DataContracts/Action/DeleteOQOILineWithSkipPricingCalculationRequest.ts" />
/// <reference path="DialogConfirmStrings.ts" />
/// <reference path="CachedProperties.ts" />
/// <reference path="ClientUtil.ts" />
/// <reference path="CloseQuoteStatus.ts" />
/// <reference path="DialogName.ts" />
/// <reference path="DiscountTypeIsAmountType.ts" />
/// <reference path="EntityNames.ts" />
/// <reference path="EntityTypeCodes.ts" />
/// <reference path="InvoiceState.ts" />
/// <reference path="LineItemUtil.ts" />
/// <reference path="LookupObjects.ts" />
/// <reference path="Messages.ts" />
/// <reference path="MetadataDrivenDialogConstants.ts" />
/// <reference path="MetadataDrivenDialogConstantsConvertActivity.ts" />
/// <reference path="MetadataDrivenDialogConstantsCreateDiscountList.ts" />
/// <reference path="MetadataDrivenDialogConstantsGetProducts.ts" />
/// <reference path="MetadataDrivenDialogConstantsLookUpAddress.ts" />
/// <reference path="MetadataDrivenDialogConstantsLookUpDetailAddress.ts" />
/// <reference path="MetadataDrivenDialogConstantsInvoiceClose.ts" />
/// <reference path="MetadataDrivenDialogConstantsOpportunityClose.ts" />
/// <reference path="MetadataDrivenDialogConstantsOrderClose.ts" />
/// <reference path="MetadataDrivenDialogConstantsOrderCreate.ts" />
/// <reference path="MetadataDrivenDialogConstantsQuoteClose.ts" />
/// <reference path="OpportunityState.ts" />
/// <reference path="QuoteState.ts" />
/// <reference path="ProductTypeImageUrl.ts" />
/// <reference path="ProductConfigStatusTypeImageUrl.ts" />
/// <reference path="SalesOrderState.ts" />
/// <reference path="SalesOrderState.ts" /> 
