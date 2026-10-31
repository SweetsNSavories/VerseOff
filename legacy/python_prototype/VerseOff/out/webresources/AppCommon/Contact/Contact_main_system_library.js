/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../../../TypeDefinitions/XrmClientApiGap.d.ts"/>
var AppCommon;
(function (AppCommon) {
    /**
    * UCI compiliant library for Account
    */
    var ContactLibrary = (function () {
        function ContactLibrary() {
            var _this = this;
            this.parentcustomerid_setadditionalparams = function (context) {
                var entityId = Xrm.Page.data.entity.getId();
                if (!ClientUtility.DataUtil.isNullOrEmptyString(entityId)) {
                    var parentLookup = Xrm.Page.ui.controls.get("parentcustomerid");
                    if (!ClientUtility.DataUtil.isNull(parentLookup)) {
                        var fetchXml = '<filter type="and"><condition attribute="contactid" operator="neq" value="';
                        fetchXml += Xrm.Encoding.xmlAttributeEncode(entityId);
                        fetchXml += '"/></filter>';
                        parentLookup.addCustomFilter(fetchXml, "contact");
                    }
                }
            };
            this.form_onload = function () {
                var formType = Xrm.Page.ui.getFormType();
                if (Xrm.Page.context.client.getClient() === Xrm.Constants.ClientNames.mobile) {
                    var subgridEntitlement = Xrm.Page.ui.controls.get("subgrid_Entitlement");
                    if (!ClientUtility.DataUtil.isNull(subgridEntitlement)) {
                        subgridEntitlement.setVisible(false);
                    }
                }
                // Relationship Assistant is only applicable to UClient. It doesn't work in WebClient.
                // Hiding at control level is taken care of CCF infra. However, if RA component ends up being the only
                // control in a section, it shows an empty space in WebClient. Below, client takes care of 
                // "Hiding a section in webclient if contains one and only one component and that is RA"
                if (!_this.isUCI() && !ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.ui.controls.get("ActionCards"))) {
                    if (Xrm.Page.ui.controls.get('ActionCards').getParent().controls.getLength() === 1) {
                        Xrm.Page.ui.controls.get('ActionCards').getParent().setVisible(false);
                    }
                }
                var appSettings = Xrm.Utility.getGlobalContext().getCurrentAppSettings();
                // Check if appSettings object exists and msdyn_DealManagerOptIn has a non-null value
                if (appSettings && appSettings["msdyn_DealManagerOptIn"] != null) {
                }
                else {
                    var section;
                    try {
                        section = Xrm.Page.ui.tabs.get("SUMMARY_TAB").sections.get("Summary_section_6");
                    }
                    catch (sectionError) {
                    }
                    if (section) {
                        try {
                            section.setVisible(false);
                        }
                        catch (setVisibleError) {
                        }
                    }
                    else {
                    }
                }
            };
            var global = window;
            var mscrm = global.Mscrm;
            mscrm.parentcustomerid_setadditionalparams = this.parentcustomerid_setadditionalparams;
        }
        ContactLibrary.prototype.isUCI = function () {
            var global = window;
            var xrm = global.Xrm;
            var result = false;
            if (xrm && xrm.Internal && ClientUtility.DataUtil.hasFunction(xrm.Internal, 'isUci')) {
                result = xrm.Internal.isUci();
            }
            else {
                // fall back to url inspection
                result = window && window.parent && window.parent.location && window.parent.location.href && window.parent.location.href.toLowerCase().indexOf('uclient') !== -1;
            }
            if (result) {
                result = xrm.Internal.isFeatureEnabled("ActionCard");
            }
            return result;
        };
        ;
        return ContactLibrary;
    }());
    AppCommon.ContactLibrary = ContactLibrary;
    ;
})(AppCommon || (AppCommon = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="./UCI/ContactLibrary.ts" />
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var AppCommon;
(function (AppCommon) {
    /**
    * Wrapper class to instantiate either legacy or new UCI compiliant library for Account
    */
    var Contact = (function () {
        function Contact() {
        }
        return Contact;
    }());
    Contact.Instance = new AppCommon.ContactLibrary();
    Contact.ctor = (function () {
    })();
    AppCommon.Contact = Contact;
})(AppCommon || (AppCommon = {}));
//# sourceMappingURL=Contact_main_system_library.js.map