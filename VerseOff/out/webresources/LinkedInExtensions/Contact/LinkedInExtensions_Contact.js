/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var LinkedInExtensions;
(function (LinkedInExtensions) {
    var OrgChartResourceConstants = /** @class */ (function () {
        function OrgChartResourceConstants() {
        }
        OrgChartResourceConstants.ContactHierarchyMissingAlertMsg = "Error_Message_for_Hierarchical_Relationship_Not_Enabled";
        OrgChartResourceConstants.LoadingOrgChartMsg = "Loading_Org_Chart";
        OrgChartResourceConstants.NoLongerInOrgRaCardToastMsg = "NoLonger_InOrgRaCard_ToastMsg";
        OrgChartResourceConstants.OrgChartUpdatedSuccessfully = "OrgChart_Updated_Successfully";
        OrgChartResourceConstants.SavingMessage = "Saving_Message";
        OrgChartResourceConstants.ContactDetailsHeader = "Contact_Details";
        OrgChartResourceConstants.NoLongerInOrgUpdated = "No_Longer_In_Org_Updated";
        OrgChartResourceConstants.IgnoreOrgChangeDlgTitle = "Ignore_Org_Change_Dlg_Title";
        OrgChartResourceConstants.IgnoreOrgChangeDlgText = "Ignore_Org_Change_Dlg_Text";
        OrgChartResourceConstants.IgnoreOrgChangeDlgLabel = "Ignore_Org_Change_Dlg_Label";
        OrgChartResourceConstants.IgnoreOrgChangeDlgConfirm = "Ignore_Org_Change_Dlg_Confirm";
        OrgChartResourceConstants.NoLongerInOrgHeader = "No_Longer_In_Org_header";
        OrgChartResourceConstants.EnableOrgChartV2SettingName = 'msdyn_EnableOrgChart';
        OrgChartResourceConstants.RelationshipHealthSidePaneText = 'Relationship_Health_Side_Pane_Text';
        return OrgChartResourceConstants;
    }());
    LinkedInExtensions.OrgChartResourceConstants = OrgChartResourceConstants;
    var FetchXMLStrings = /** @class */ (function () {
        function FetchXMLStrings() {
        }
        FetchXMLStrings.RetrieveLastLoginTime = "<fetch version=\"1.0\" output-format=\"xml-platform\" mapping=\"logical\" top=\"2\">\n\t\t\t<entity name=\"audit\">\n\t\t\t\t<attribute name=\"objecttypecode\"/>\n\t\t\t\t<attribute name=\"operation\"/>\n\t\t\t\t<attribute name=\"createdon\"/>\n\t\t\t\t<attribute name=\"action\"/>\n\t\t\t\t<attribute name=\"objectid\"/>\n\t\t\t\t<order attribute=\"createdon\" descending=\"true\"/>\n\t\t\t\t<filter type='and'>\n\t\t\t\t\t<condition attribute='action' operator='eq' value='64' />\n\t\t\t\t\t<condition attribute='objecttypecode' operator='eq' value='8'/>\n\t\t\t\t\t<condition attribute='objectid' operator='eq' value='{0}'/>\n\t\t\t\t</filter>\n\t\t\t</entity>\n\t\t</fetch>";
        return FetchXMLStrings;
    }());
    LinkedInExtensions.FetchXMLStrings = FetchXMLStrings;
    /**
     *
     * @param {string} source - The source string
     * @param {...any} args - The arguments to replace
     */
    function formatString(source) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var placeholderPattern = /{\d+}/gm;
        /**
         *
         * @param {any} placeholder - The placeholder to replace
         */
        function replacePlaceholder(placeholder) {
            var position = parseInt(placeholder.replace(/{|}/g, ""));
            return position < args.length ? args[position] : placeholder;
        }
        return source.replace(placeholderPattern, replacePlaceholder);
    }
    LinkedInExtensions.formatString = formatString;
})(LinkedInExtensions || (LinkedInExtensions = {}));
var LinkedInExtensionDataContracts;
(function (LinkedInExtensionDataContracts) {
    /* tslint:disable:crm-force-fields-private */
    var EnableHierarchicalRelationship = /** @class */ (function () {
        function EnableHierarchicalRelationship(EntityLogicalName, RelationshipSchemaName, LookupAttributeSchemaName) {
            this.EntityLogicalName = EntityLogicalName;
            this.RelationshipSchemaName = RelationshipSchemaName;
            this.LookupAttributeSchemaName = LookupAttributeSchemaName;
        }
        EnableHierarchicalRelationship.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "EntityLogicalName": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "RelationshipSchemaName": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "LookupAttributeSchemaName": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                },
                operationName: "EnableHierarchicalRelationship",
                operationType: 0,
            };
            return metadata;
        };
        return EnableHierarchicalRelationship;
    }());
    LinkedInExtensionDataContracts.EnableHierarchicalRelationship = EnableHierarchicalRelationship;
})(LinkedInExtensionDataContracts || (LinkedInExtensionDataContracts = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var LinkedInExtensions;
(function (LinkedInExtensions) {
    var OrgChartContactConstants = /** @class */ (function () {
        function OrgChartContactConstants() {
        }
        OrgChartContactConstants.AccountEntityName = "account";
        OrgChartContactConstants.AccountFetchErrorMessage = "AccountFetchErrorMessage";
        OrgChartContactConstants.AccountFetchErrorTitle = "AccountFetchErrorTitle";
        OrgChartContactConstants.AccountFetchQuery = "?$expand=parentcustomerid_account";
        OrgChartContactConstants.ContactEntityName = "contact";
        OrgChartContactConstants.InvalidAccountIdAlertMessage = "InvalidAccountIdAlertMessage";
        OrgChartContactConstants.InvalidAccountIdAlertTitle = "InvalidAccountIdAlertTitle";
        OrgChartContactConstants.InvalidAccountIdConfirmButtonLabel = "InvalidAccountIdConfirmButtonLabel";
        return OrgChartContactConstants;
    }());
    LinkedInExtensions.OrgChartContactConstants = OrgChartContactConstants;
})(LinkedInExtensions || (LinkedInExtensions = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../../../TypeDefinitions/AppCommon/ControlWS/ClientCommon/ClientCommon.d.ts" />
/// <reference path="../Localization/msdyn_LinkedInExtensionsResourceProvider.d.ts" />
/// <reference path="../Common/CommonUtils.ts" />
/// <reference path="../Common/DataContracts/EnableHierarchicalRelationship.ts" />
var LinkedInExtensions;
(function (LinkedInExtensions) {
    /**
    * UCI compiliant library for OrgChart
    */
    var OrgChartControlName = 'LinkedInExtensionControls.OrgChart.OrgChartControl';
    var OrgChartV2ControlName = 'MscrmControls.OrgChartV2.OrgChartControl';
    /**
    * Page type for full page custom control
    */
    var CustomControlPageType = 'control';
    var entity = "contact";
    var relationshipSchemaName = "contact_parent_contact";
    var lookupAttrSchemaName = "parent_contactid";
    var OrgChartUtils = /** @class */ (function () {
        function OrgChartUtils() {
        }
        OrgChartUtils.getFeatureControlSetting = function (namespace, settingKey, defaultValue) {
            var fcsValue = (Xrm.Utility.getGlobalContext()).getFeatureControlSetting(namespace, settingKey);
            if (fcsValue !== null && fcsValue !== undefined) {
                // Found the feature
                return fcsValue;
            }
            return defaultValue;
        };
        OrgChartUtils.ValidateAndOpenOrgChart = function (accountId, accountName, originContactId) {
            var _this = this;
            var enableHierarchicalRelationReq = new LinkedInExtensionDataContracts.EnableHierarchicalRelationship(entity, relationshipSchemaName, lookupAttrSchemaName);
            Xrm.Utility.showProgressIndicator(LinkedInExtensions.ResourceStringProvider.getResourceString(LinkedInExtensions.OrgChartResourceConstants.LoadingOrgChartMsg));
            return Xrm.WebApi.online.execute(enableHierarchicalRelationReq).then(function (response) {
                Xrm.Utility.closeProgressIndicator();
                if (response !== null) {
                    response.json().then(function (sdkResult) {
                        if (sdkResult !== null) {
                            var referencingAttributeName = sdkResult.Result;
                            if (referencingAttributeName !== null) {
                                var isOctober2023FCBEnabled = Xrm && Xrm.Internal && Xrm.Internal.isFeatureEnabled('October2023Update');
                                var isOrgChartV2Enabled = Xrm.Utility.getGlobalContext().getCurrentAppSettings()[LinkedInExtensions.OrgChartResourceConstants.EnableOrgChartV2SettingName];
                                if (isOctober2023FCBEnabled || isOrgChartV2Enabled) {
                                    _this.navigateToOrgChartV2(accountId, accountName, originContactId, referencingAttributeName);
                                }
                                else {
                                    _this.navigateToOrgChart(accountId, accountName, referencingAttributeName);
                                }
                            }
                            else {
                                Xrm.Navigation.openAlertDialog({ text: LinkedInExtensions.ResourceStringProvider.getResourceString(LinkedInExtensions.OrgChartResourceConstants.ContactHierarchyMissingAlertMsg) });
                            }
                        }
                        else {
                            Xrm.Navigation.openAlertDialog({ text: LinkedInExtensions.ResourceStringProvider.getResourceString(LinkedInExtensions.OrgChartResourceConstants.ContactHierarchyMissingAlertMsg) });
                        }
                    });
                }
                else {
                    Xrm.Navigation.openAlertDialog({ text: LinkedInExtensions.ResourceStringProvider.getResourceString(LinkedInExtensions.OrgChartResourceConstants.ContactHierarchyMissingAlertMsg) });
                }
            }, function () {
                Xrm.Utility.closeProgressIndicator();
                // we weren't able to create the hierarchical relationship, fall back to showing the alert dialog.
                Xrm.Navigation.openAlertDialog({ text: LinkedInExtensions.ResourceStringProvider.getResourceString(LinkedInExtensions.OrgChartResourceConstants.ContactHierarchyMissingAlertMsg) });
            });
        };
        OrgChartUtils.navigateToOrgChart = function (accountId, accountName, ReferencingAttribute) {
            // TODO : Remove this assigning of Xrm.Navigation to navigation variable when latest typing's package is uptaken
            var navigation = Xrm.Navigation;
            var dataInput = {
                AccountId: accountId,
                AccountName: accountName,
                ReferencingAttribute: ReferencingAttribute
            };
            var controlInput = {
                pageType: CustomControlPageType,
                controlName: OrgChartControlName,
                data: dataInput
            };
            navigation.navigateTo(controlInput);
        };
        ;
        OrgChartUtils.navigateToOrgChartV2 = function (accountId, accountName, originContactId, referencingAttribute) {
            // TODO : Remove this assigning of Xrm.Navigation to navigation variable when latest typing's package is uptaken
            var navigation = Xrm.Navigation;
            var dataInput = {
                AccountId: accountId,
                AccountName: accountName,
                OriginContactId: originContactId,
                ReferencingAttribute: referencingAttribute
            };
            var controlInput = {
                pageType: CustomControlPageType,
                controlName: OrgChartV2ControlName,
                data: dataInput
            };
            navigation.navigateTo(controlInput);
        };
        ;
        return OrgChartUtils;
    }());
    LinkedInExtensions.OrgChartUtils = OrgChartUtils;
})(LinkedInExtensions || (LinkedInExtensions = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../../../../TypeDefinitions/AppCommon/ControlWS/ClientCommon/ClientCommon.d.ts" />
/// <reference path="../../Localization/msdyn_LinkedInExtensionsResourceProvider.d.ts" />
/// <reference path="../../Common/CommonUtils.ts" />
/// <reference path="../../Common/DataContracts/EnableHierarchicalRelationship.ts" />
/// <reference path="Constants.ts"/>
/// <reference path="../../OrgChart/OrgChartUtils.ts"/>
var LinkedInExtensions;
(function (LinkedInExtensions) {
    var ContactLibrary = /** @class */ (function () {
        function ContactLibrary() {
            this.FCS_EnableOrgChartButtonForContact = "EnableOrgChartV2";
            this.FCS_OrgChartNamespace = "DynamicsLinkedInExtensions.OrgChart";
        }
        ContactLibrary.prototype.isOrgChartEnabledForContact = function () {
            return LinkedInExtensions.OrgChartUtils.getFeatureControlSetting(this.FCS_OrgChartNamespace, this.FCS_EnableOrgChartButtonForContact, false);
        };
        ContactLibrary.prototype.ValidateAndDisplay = function (accountId, accountName, originContactId) {
            if (accountId) {
                LinkedInExtensions.OrgChartUtils.ValidateAndOpenOrgChart(accountId, accountName, originContactId);
            }
            else {
                Xrm.Navigation.openAlertDialog({
                    title: LinkedInExtensions.ResourceStringProvider.getResourceString(LinkedInExtensions.OrgChartContactConstants.InvalidAccountIdAlertTitle),
                    text: LinkedInExtensions.ResourceStringProvider.getResourceString(LinkedInExtensions.OrgChartContactConstants.InvalidAccountIdAlertMessage),
                    confirmButtonLabel: LinkedInExtensions.ResourceStringProvider.getResourceString(LinkedInExtensions.OrgChartContactConstants.InvalidAccountIdConfirmButtonLabel)
                });
            }
        };
        ContactLibrary.prototype.ViewOrgChart = function () {
            if (Xrm.Page.data === null || Xrm.Page.data.entity === null || Xrm.Page.data.entity.attributes === null) {
                return;
            }
            var parentAccountData = Xrm.Page.data.entity.attributes.get("parentcustomerid") ?
                Xrm.Page.data.entity.attributes.get("parentcustomerid").getValue() :
                null;
            var accountId = null;
            var accountName = null;
            var contactId = null;
            if (parentAccountData && parentAccountData[0] &&
                parentAccountData[0].entityType === LinkedInExtensions.OrgChartContactConstants.AccountEntityName) {
                accountId = parentAccountData[0].id;
                accountName = parentAccountData[0].name;
                contactId = Xrm.Page.data && Xrm.Page.data.entity && Xrm.Page.data.entity.getId();
            }
            this.ValidateAndDisplay(accountId, accountName, contactId !== null && contactId !== void 0 ? contactId : undefined);
        };
        ContactLibrary.prototype.ViewOrgChartFromGrid = function (selectedItemReferences) {
            var _this = this;
            if (selectedItemReferences === null) {
                return;
            }
            var contactId = selectedItemReferences[0].Id;
            var accountId = null;
            var accountName = null;
            Xrm.WebApi.retrieveRecord(LinkedInExtensions.OrgChartContactConstants.ContactEntityName, contactId, LinkedInExtensions.OrgChartContactConstants.AccountFetchQuery).then(function (retrievedAccount) {
                var parentAccountData = retrievedAccount && retrievedAccount.parentcustomerid_account ?
                    retrievedAccount.parentcustomerid_account :
                    null;
                accountId = parentAccountData && parentAccountData.accountid ? parentAccountData.accountid :
                    null;
                accountName = parentAccountData && parentAccountData.name ? parentAccountData.name :
                    null;
                _this.ValidateAndDisplay(accountId, accountName, contactId);
            }, function () {
                Xrm.Navigation.openAlertDialog({
                    title: LinkedInExtensions.ResourceStringProvider.getResourceString(LinkedInExtensions.OrgChartContactConstants.AccountFetchErrorTitle),
                    text: LinkedInExtensions.ResourceStringProvider.getResourceString(LinkedInExtensions.OrgChartContactConstants.AccountFetchErrorMessage)
                });
            });
        };
        return ContactLibrary;
    }());
    LinkedInExtensions.ContactLibrary = ContactLibrary;
})(LinkedInExtensions || (LinkedInExtensions = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="./UCI/ContactLibrary.ts" />
var LinkedInExtensions;
(function (LinkedInExtensions) {
    /**
    * Wrapper class to instantiate either legacy or new UCI compiliant library for Contact
    */
    var Contact = /** @class */ (function () {
        function Contact() {
        }
        Contact.Instance = new LinkedInExtensions.ContactLibrary();
        Contact.ctor = (function () {
        })();
        return Contact;
    }());
    LinkedInExtensions.Contact = Contact;
})(LinkedInExtensions || (LinkedInExtensions = {}));
//# sourceMappingURL=LinkedInExtensions_Contact.js.map