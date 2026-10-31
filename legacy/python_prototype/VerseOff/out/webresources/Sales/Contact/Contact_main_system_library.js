/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sales;
(function (Sales) {
    var BCUtils = (function () {
        function BCUtils() {
        }
        BCUtils.reportSuccess = function (componentName, eventParams) {
            if (!this.isNullOrUndefined(Xrm.Reporting)) {
                Xrm.Reporting.reportSuccess(componentName, eventParams);
            }
        };
        BCUtils.reportFailure = function (componentName, eventParams) {
            if (!this.isNullOrUndefined(Xrm.Reporting)) {
                Xrm.Reporting.reportFailure(componentName, eventParams);
            }
        };
        BCUtils.isNullOrUndefined = function (object) {
            return object === null || object === undefined;
        };
        BCUtils.isNullOrEmptyString = function (object) {
            return this.isNullOrUndefined(object) || object === "";
        };
        BCUtils.isUCI = function () {
            var global = window;
            var xrm = global.Xrm;
            return xrm && xrm.Internal && xrm.Internal.isUci();
        };
        BCUtils.TrySetAttributeSubmitMode = function (context, attributeName, mode) {
            var formContext = context.getFormContext();
            if (!this.isNullOrUndefined(formContext)) {
                var attribute = formContext.getAttribute(attributeName);
                if (!this.isNullOrUndefined(attribute)) {
                    attribute.setSubmitMode(mode);
                }
            }
        };
        BCUtils.GetAttributeValue = function (context, attributeName, defaultValue) {
            if (defaultValue === void 0) { defaultValue = ""; }
            var formContext = context.getFormContext();
            if (!this.isNullOrUndefined(formContext)) {
                var attribute = formContext.getAttribute(attributeName);
                if (!this.isNullOrUndefined(attribute)) {
                    return attribute.getValue();
                }
            }
            return defaultValue;
        };
        BCUtils.IsControlPresent = function (context, controlName) {
            var formContext = context.getFormContext();
            if (!this.isNullOrUndefined(formContext)) {
                var control = formContext.getControl(controlName);
                if (!this.isNullOrUndefined(control)) {
                    return true;
                }
            }
            return false;
        };
        BCUtils.TrySetVisibilityOfSection = function (context, tabName, sectionName, visible) {
            if (this.IsSectionPresent(context, tabName, sectionName)) {
                var formContext = context.getFormContext();
                var parentTab = formContext.ui.tabs.get(tabName);
                var section = parentTab.sections.get(sectionName);
                section.setVisible(visible);
            }
        };
        BCUtils.IsSectionPresent = function (context, tabName, sectionName) {
            var formContext = context.getFormContext();
            if (!BCUtils.isNullOrUndefined(formContext)) {
                var parentTab = formContext.ui.tabs.get(tabName);
                if (!BCUtils.isNullOrUndefined(parentTab)) {
                    var section = parentTab.sections.get(sectionName);
                    if (!BCUtils.isNullOrUndefined(section)) {
                        return true;
                    }
                }
            }
            return false;
        };
        BCUtils.TrySetVisibilityOfControl = function (context, controlName, visible) {
            if (this.IsControlPresent(context, controlName)) {
                var formContext = context.getFormContext();
                formContext.getControl(controlName).setVisible(visible);
            }
        };
        BCUtils.IsControlAvailable = function (context, controlName) {
            if (this.IsControlPresent(context, controlName)) {
                var formContext = context.getFormContext();
                if (!this.isNullOrUndefined(formContext)) {
                    var control = formContext.getControl(controlName);
                    if (control && control.getControlType() != Sales.BusinessCardScannerLibrary.AttributeStandardControlType) {
                        return true;
                    }
                }
            }
            return false;
        };
        return BCUtils;
    }());
    Sales.BCUtils = BCUtils;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Sales;
(function (Sales) {
    var IsPAIEnabledRequest = (function () {
        function IsPAIEnabledRequest() {
        }
        IsPAIEnabledRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {},
                operationName: "IsPaiEnabled",
                operationType: 0,
            };
            return metadata;
        };
        return IsPAIEnabledRequest;
    }());
    Sales.IsPAIEnabledRequest = IsPAIEnabledRequest;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="BCUtils.ts" />
/// <reference path="IsPAIEnabledRequest.ts" />
/// <reference path="../../../TypeDefinitions/Sales/Localization/ResourceStringProvider.d.ts" />
var Sales;
(function (Sales) {
    var BusinessCardScannerLibrary = (function () {
        function BusinessCardScannerLibrary() {
        }
        BusinessCardScannerLibrary.IsBusinessCardAvailable = function () {
            if (!Sales.BCUtils.isUCI()) {
                return Promise.reject("Not UCI");
            }
            if (false == Xrm.Internal.isFeatureEnabled(this.FCBOctober2019Update)) {
                return Promise.reject("FCB.October2019Update Not Enabled");
            }
            var orgSettings = Xrm.Utility.getGlobalContext().organizationSettings.attributes;
            if (Sales.BCUtils.isNullOrUndefined(orgSettings) ||
                Sales.BCUtils.isNullOrUndefined(orgSettings[this.OrgSettingIsPAIEnabled]) ||
                orgSettings[this.OrgSettingIsPAIEnabled] == false) {
                return Promise.reject("Orgsetting Not Found or disabled");
            }
            // This is a workaround as of now because below FCB is not coming to UC and hence 
            // In this case we will make call to server to know status of the feature enablement
            // If the FCB is true, we don't need to make server call(this will be the case when bug is fixed)
            if (true == Xrm.Internal.isFeatureEnabled(this.FCBPAIEnabled)) {
                return Promise.resolve();
            }
            var promise = new Promise(function (resolve, reject) {
                Xrm.WebApi.online.execute(new Sales.IsPAIEnabledRequest()).then(function (response) {
                    response.json().then(function (json) {
                        var status = json.ispaienabled;
                        status == true ? resolve() : reject("Disabled via FCB.EnablePAI");
                    });
                }).catch(function (error) { reject(error); });
            });
            return promise;
        };
        BusinessCardScannerLibrary.SetAdvancedCustomizations = function (value) {
            var attribute = Xrm.Page.data.entity.attributes.get(this.AttributeBusinessCardProperties);
            if (!Sales.BCUtils.isNullOrUndefined(attribute)) {
                attribute.setValue(JSON.stringify(value));
            }
        };
        BusinessCardScannerLibrary.ApplyBusinessCardConfigOptions = function () {
            var attribute = Xrm.Page.data.entity.attributes.get(this.AttributeBusinessCard);
            var orgSettings = Xrm.Utility.getGlobalContext().organizationSettings.attributes;
            if (Sales.BCUtils.isNullOrUndefined(attribute) ||
                Sales.BCUtils.isNullOrUndefined(orgSettings) ||
                Sales.BCUtils.isNullOrUndefined(orgSettings[this.OrgSettingBusinessCardOptions]))
                return;
            try {
                var options = JSON.parse(orgSettings[this.OrgSettingBusinessCardOptions]);
                if (!Sales.BCUtils.isNullOrUndefined(options.StoreBusinessCardImage) && options.StoreBusinessCardImage == "false") {
                    attribute.setSubmitMode("never");
                }
            }
            catch (ex) {
                var eventSource = this.TelemetrySource;
                var eventParams = [
                    { name: "TrySetBusinessCardAttributeModeException", value: ex.message },
                ];
                Sales.BCUtils.reportFailure(eventSource, eventParams);
            }
        };
        BusinessCardScannerLibrary.GetResourceString = function (key) {
            var value = Sales.ResourceStringProvider.getResourceString(key);
            return Sales.BCUtils.isNullOrUndefined(value) ? key : value;
        };
        return BusinessCardScannerLibrary;
    }());
    BusinessCardScannerLibrary.FCBOctober2019Update = "October2019Update";
    BusinessCardScannerLibrary.FCBPAIEnabled = "EnablePAI";
    BusinessCardScannerLibrary.OrgSettingIsPAIEnabled = "ispaienabled";
    BusinessCardScannerLibrary.OrgSettingBusinessCardOptions = "businesscardoptions";
    BusinessCardScannerLibrary.AttributeBusinessCard = "businesscard";
    BusinessCardScannerLibrary.AttributeBusinessCardProperties = "businesscardattributes";
    BusinessCardScannerLibrary.TelemetrySource = "BusinessCardScanner";
    BusinessCardScannerLibrary.SubmitModeNever = "never";
    BusinessCardScannerLibrary.SubmitModeDirty = "dirty";
    BusinessCardScannerLibrary.AttributeStandardControlType = "standard";
    Sales.BusinessCardScannerLibrary = BusinessCardScannerLibrary;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../BusinessCardScanner/BusinessCardLibrary.ts" />
/// <reference path="../../BusinessCardScanner/BCUtils.ts" />
var Sales;
(function (Sales) {
    var ContactLibrary = (function () {
        function ContactLibrary() {
            var _this = this;
            this.AttributeBusinessCard = Sales.BusinessCardScannerLibrary.AttributeBusinessCard;
            this.AttributeBusinessCardProperties = Sales.BusinessCardScannerLibrary.AttributeBusinessCardProperties;
            this.SubmitModeNever = Sales.BusinessCardScannerLibrary.SubmitModeNever;
            this.SubmitModeDirty = Sales.BusinessCardScannerLibrary.SubmitModeDirty;
            this.TelemetrySource = Sales.BusinessCardScannerLibrary.TelemetrySource;
            this.SectionBusinessCard = "BusinessCard";
            this.TabSummary = "SUMMARY_TAB";
            this.Entity = "Contact";
            this.ButtonText = "Sales_BusinessCardScanner_ButtonText";
            this.ButtonHeight = "35px";
            this.ButtonWidth = "100%";
            this.Form_onload = function (context) {
                var formContext = context.getFormContext();
                if (formContext.ui.getFormType() == 2 /* Update */
                    && Sales.BCUtils.IsSectionPresent(context, _this.TabSummary, _this.SectionBusinessCard)
                    && !Sales.BCUtils.isNullOrEmptyString(Sales.BCUtils.GetAttributeValue(context, _this.AttributeBusinessCard))) {
                    Sales.BusinessCardScannerLibrary.IsBusinessCardAvailable().then(function () {
                        var properties = {
                            ImageDisplayed: true,
                            IsReadOnly: true,
                            Text: "",
                            Height: "",
                            Width: ""
                        };
                        Sales.BusinessCardScannerLibrary.SetAdvancedCustomizations(properties);
                        // Set submit mode of attribute holding advancedCustomizations to never else it will make the form dirty
                        Sales.BCUtils.TrySetAttributeSubmitMode(context, _this.AttributeBusinessCardProperties, _this.SubmitModeNever);
                        Sales.BCUtils.TrySetVisibilityOfSection(context, _this.TabSummary, _this.SectionBusinessCard, true);
                        formContext.data.entity.addOnSave(function () {
                            Sales.BCUtils.TrySetAttributeSubmitMode(context, _this.AttributeBusinessCardProperties, _this.SubmitModeDirty);
                        });
                    }).catch(function (rejectReason) {
                        var eventParams = [
                            { name: "BusinessCardNotAvailable", value: rejectReason },
                            { name: "Entity", value: _this.Entity }
                        ];
                        Sales.BCUtils.reportFailure(_this.TelemetrySource, eventParams);
                    });
                }
            };
            this.Quick_Form_onload = function (context) {
                if (Sales.BCUtils.IsControlAvailable(context, _this.AttributeBusinessCard)) {
                    Sales.BusinessCardScannerLibrary.IsBusinessCardAvailable().then(function () {
                        var properties = {
                            ImageDisplayed: false,
                            IsReadOnly: false,
                            Text: Sales.BusinessCardScannerLibrary.GetResourceString(_this.ButtonText),
                            Height: _this.ButtonHeight,
                            Width: _this.ButtonWidth
                        };
                        Sales.BusinessCardScannerLibrary.SetAdvancedCustomizations(properties);
                        Sales.BusinessCardScannerLibrary.ApplyBusinessCardConfigOptions();
                        Sales.BCUtils.TrySetAttributeSubmitMode(context, _this.AttributeBusinessCardProperties, _this.SubmitModeNever);
                        Sales.BCUtils.TrySetVisibilityOfControl(context, _this.AttributeBusinessCard, true);
                    }).catch(function (rejectReason) {
                        var eventParams = [
                            { name: "BusinessCardNotAvailable", value: rejectReason },
                            { name: "Entity", value: _this.Entity }
                        ];
                        Sales.BCUtils.reportFailure(_this.TelemetrySource, eventParams);
                    });
                }
            };
            this.BusinessCard_OnChange = function (context) {
                if (!Sales.BCUtils.isNullOrEmptyString(Sales.BCUtils.GetAttributeValue(context, _this.AttributeBusinessCard))) {
                    var properties = {
                        ImageDisplayed: true,
                        IsReadOnly: false,
                        Text: Sales.BusinessCardScannerLibrary.GetResourceString(_this.ButtonText),
                        Height: "",
                        Width: ""
                    };
                    Sales.BusinessCardScannerLibrary.SetAdvancedCustomizations(properties);
                }
            };
        }
        return ContactLibrary;
    }());
    Sales.ContactLibrary = ContactLibrary;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="UCI/ContactLibrary.ts" />
var Sales;
(function (Sales) {
    var Contact = (function () {
        function Contact() {
        }
        return Contact;
    }());
    Contact.Instance = new Sales.ContactLibrary();
    Contact.ctor = (function () {
        // These are needed on the window because of "general" command bar actions calling hard-coded methods with some conditions
    })();
    Sales.Contact = Contact;
})(Sales || (Sales = {}));
