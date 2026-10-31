var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var LinkedInExtensions;
(function (LinkedInExtensions) {
    var Guid = /** @class */ (function () {
        function Guid(guidValue) {
            this._guid = guidValue.replace('{', '').replace('}', '').toLowerCase();
        }
        Object.defineProperty(Guid.prototype, "guid", {
            get: function () {
                return this._guid;
            },
            enumerable: false,
            configurable: true
        });
        Guid.isValidGuid = function (str) {
            if (str) {
                var guidRegexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
                return guidRegexExp.test(str);
            }
            return false;
        };
        return Guid;
    }());
    LinkedInExtensions.Guid = Guid;
})(LinkedInExtensions || (LinkedInExtensions = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var LinkedInExtensions;
(function (LinkedInExtensions) {
    function safeJsonParse(json) {
        try {
            return JSON.parse(json);
        }
        catch (error) {
            return undefined;
        }
    }
    LinkedInExtensions.safeJsonParse = safeJsonParse;
    function safeJsonStringify(json) {
        try {
            return JSON.stringify(json);
        }
        catch (error) {
            return '';
        }
    }
    LinkedInExtensions.safeJsonStringify = safeJsonStringify;
})(LinkedInExtensions || (LinkedInExtensions = {}));
var LinkedInExtensions;
(function (LinkedInExtensions) {
    var LocalStorage = /** @class */ (function () {
        function LocalStorage() {
        }
        LocalStorage.getItem = function (key) {
            try {
                return localStorage.getItem(key);
            }
            catch (_a) {
                return undefined;
            }
        };
        LocalStorage.setItem = function (key, value) {
            try {
                localStorage.setItem(key, value);
                return true;
            }
            catch (_a) {
                return false;
            }
        };
        return LocalStorage;
    }());
    LinkedInExtensions.LocalStorage = LocalStorage;
})(LinkedInExtensions || (LinkedInExtensions = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var LinkedInExtensions;
(function (LinkedInExtensions) {
    var OrgChartAccountConstants = /** @class */ (function () {
        function OrgChartAccountConstants() {
        }
        OrgChartAccountConstants.LastModifiedOnKey = 'OrgChartV2.LastModifiedOnKey';
        OrgChartAccountConstants.OrgChartNodesCountKey = 'OrgChartV2.OrgChartNodesCountKey';
        OrgChartAccountConstants.OrgChartModifiedNotificationId = "OrgChartModifiedNotificationId";
        OrgChartAccountConstants.OrgChartModifiedNotificationText = "OrgChartModifiedNotificationText";
        OrgChartAccountConstants.OpenOrgChartActionLabel = "OpenOrgChartActionLabel";
        OrgChartAccountConstants.DismissActionLabel = "DismissActionLabel";
        OrgChartAccountConstants.FormLoadBufferTime = 15000;
        OrgChartAccountConstants.AuditEntityName = "audit";
        return OrgChartAccountConstants;
    }());
    LinkedInExtensions.OrgChartAccountConstants = OrgChartAccountConstants;
})(LinkedInExtensions || (LinkedInExtensions = {}));
var LinkedInExtensionDataContracts;
(function (LinkedInExtensionDataContracts) {
    var OrgChartNodeOperations;
    (function (OrgChartNodeOperations) {
        OrgChartNodeOperations["OrgChartModifiedData"] = "OrgChartModifiedData";
    })(OrgChartNodeOperations = LinkedInExtensionDataContracts.OrgChartNodeOperations || (LinkedInExtensionDataContracts.OrgChartNodeOperations = {}));
    var OrgChartNodeCRUDPluginRequest = /** @class */ (function () {
        function OrgChartNodeCRUDPluginRequest(apiType, apiPayLoad) {
            this.ApiType = apiType;
            this.ApiPayLoad = apiPayLoad;
        }
        OrgChartNodeCRUDPluginRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: '',
                parameterTypes: {
                    ApiType: {
                        typeName: 'Edm.String',
                        structuralProperty: 1 /* ODataStructuralProperty.PrimitiveType */
                    },
                    ApiPayLoad: {
                        typeName: 'Edm.String',
                        structuralProperty: 1 /* ODataStructuralProperty.PrimitiveType */
                    }
                },
                operationName: 'msdyn_OrgChartNodeCRUDPlugin',
                operationType: 0
            };
            return metadata;
        };
        return OrgChartNodeCRUDPluginRequest;
    }());
    LinkedInExtensionDataContracts.OrgChartNodeCRUDPluginRequest = OrgChartNodeCRUDPluginRequest;
})(LinkedInExtensionDataContracts || (LinkedInExtensionDataContracts = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../../../../TypeDefinitions/AppCommon/ControlWS/ClientCommon/ClientCommon.d.ts" />
/// <reference path="../../Localization/msdyn_LinkedInExtensionsResourceProvider.d.ts" />
/// <reference path="../../Common/CommonUtils.ts" />
/// <reference path="../../Common/DataContracts/EnableHierarchicalRelationship.ts" />
/// <reference path="../../OrgChart/OrgChartUtils.ts"/>
/// <reference path="../../Common/Utils/Guid.ts"/>
/// <reference path="../../Common/Utils/jsonUtils.ts"/>
/// <reference path="../../Common/hooks/useLocalStorage.ts"/>
/// <reference path="Constants.ts"/>
/// <reference path="../../Common/DataContracts/OrgChartNodeCRUDPluginRequest.ts"/>
var LinkedInExtensions;
(function (LinkedInExtensions) {
    var AccountLibrary = /** @class */ (function () {
        function AccountLibrary() {
        }
        AccountLibrary.prototype.ViewOrgChart = function () {
            if (Xrm.Page.data === null || Xrm.Page.data.entity === null) {
                return;
            }
            var accountId = Xrm.Page.data.entity.getId();
            var accountName = Xrm.Page.data.entity.attributes.get("name") ? Xrm.Page.data.entity.attributes.get("name").getValue() : "";
            LinkedInExtensions.OrgChartUtils.ValidateAndOpenOrgChart(accountId, accountName);
        };
        AccountLibrary.prototype.ViewOrgChartFromGrid = function (selectedItemReferences) {
            if (selectedItemReferences === null) {
                return;
            }
            var accountId = selectedItemReferences[0].Id;
            var accountName = selectedItemReferences[0].Name;
            LinkedInExtensions.OrgChartUtils.ValidateAndOpenOrgChart(accountId, accountName);
        };
        AccountLibrary.prototype.handleOrgChartModifiedNotification = function (context) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    setTimeout(function () {
                        AccountLibrary.checkOrgChartModifiedNotification(context);
                    }, LinkedInExtensions.OrgChartAccountConstants.FormLoadBufferTime);
                    return [2 /*return*/];
                });
            });
        };
        AccountLibrary.checkOrgChartModifiedNotification = function (context) {
            var _a, _b, _c, _d, _e;
            return __awaiter(this, void 0, void 0, function () {
                var formContext, accountId, globalContext, currentUserId, lastLoginTimeResponse, error_1, lastLoginTimeOfCurrentUser, accountNameField, accountName, apiPayLoad, orgChartModifiedDataRequest, lastModifiedOn, orgChartNodesCount, orgChartModifiedDataResponse, orgChartModifiedDataResponseJson, orgChartModifiedDataResult, error_2, notificationText;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            formContext = context.getFormContext();
                            accountId = new LinkedInExtensions.Guid((_b = (_a = formContext === null || formContext === void 0 ? void 0 : formContext.data) === null || _a === void 0 ? void 0 : _a.entity) === null || _b === void 0 ? void 0 : _b.getId()).guid;
                            if (!accountId) return [3 /*break*/, 10];
                            globalContext = Xrm.Utility.getGlobalContext();
                            currentUserId = new LinkedInExtensions.Guid(globalContext.userSettings.userId).guid;
                            lastLoginTimeResponse = null;
                            _f.label = 1;
                        case 1:
                            _f.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, AccountLibrary.getLastLoginTime(currentUserId)];
                        case 2:
                            lastLoginTimeResponse = _f.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _f.sent();
                            // TODO:- Log Telemetry
                            return [2 /*return*/];
                        case 4:
                            lastLoginTimeOfCurrentUser = null;
                            if (((_c = lastLoginTimeResponse === null || lastLoginTimeResponse === void 0 ? void 0 : lastLoginTimeResponse.entities) === null || _c === void 0 ? void 0 : _c.length) > 1) {
                                lastLoginTimeOfCurrentUser = lastLoginTimeResponse.entities[1].createdon;
                            }
                            accountNameField = (_e = (_d = formContext === null || formContext === void 0 ? void 0 : formContext.data) === null || _d === void 0 ? void 0 : _d.entity) === null || _e === void 0 ? void 0 : _e.attributes.get("name");
                            accountName = accountNameField === null || accountNameField === void 0 ? void 0 : accountNameField.getValue();
                            apiPayLoad = LinkedInExtensions.safeJsonStringify({
                                accountId: accountId,
                                currentUserId: currentUserId,
                                lastLoginTimeOfCurrentUser: lastLoginTimeOfCurrentUser
                            });
                            orgChartModifiedDataRequest = new LinkedInExtensionDataContracts
                                .OrgChartNodeCRUDPluginRequest(LinkedInExtensionDataContracts.OrgChartNodeOperations.OrgChartModifiedData, apiPayLoad);
                            lastModifiedOn = void 0, orgChartNodesCount = void 0;
                            _f.label = 5;
                        case 5:
                            _f.trys.push([5, 8, , 9]);
                            return [4 /*yield*/, Xrm.WebApi.online.execute(orgChartModifiedDataRequest)];
                        case 6:
                            orgChartModifiedDataResponse = _f.sent();
                            return [4 /*yield*/, (orgChartModifiedDataResponse === null || orgChartModifiedDataResponse === void 0 ? void 0 : orgChartModifiedDataResponse.json())];
                        case 7:
                            orgChartModifiedDataResponseJson = _f.sent();
                            orgChartModifiedDataResult = LinkedInExtensions.safeJsonParse(orgChartModifiedDataResponseJson === null || orgChartModifiedDataResponseJson === void 0 ? void 0 : orgChartModifiedDataResponseJson.Result);
                            lastModifiedOn = (orgChartModifiedDataResult.LastModifiedOn).toString();
                            orgChartNodesCount = (orgChartModifiedDataResult.OrgChartNodesCount).toString();
                            return [3 /*break*/, 9];
                        case 8:
                            error_2 = _f.sent();
                            // TODO:- Log telemetry
                            return [2 /*return*/];
                        case 9:
                            notificationText = LinkedInExtensions.ResourceStringProvider.formatString(LinkedInExtensions.ResourceStringProvider.getResourceString(LinkedInExtensions.OrgChartAccountConstants.OrgChartModifiedNotificationText), accountName);
                            if (AccountLibrary.checkLastModifiedOn(lastModifiedOn, accountId) ||
                                AccountLibrary.checkOrgChartNodesCount(orgChartNodesCount, accountId)) {
                                AccountLibrary.displayFormNotification(formContext, accountId, accountName, notificationText);
                            }
                            _f.label = 10;
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        AccountLibrary.checkLastModifiedOn = function (lastModifiedOn, accountId) {
            if (lastModifiedOn && lastModifiedOn !== "") {
                var lastModifiedOnLocal = LinkedInExtensions.LocalStorage.getItem(LinkedInExtensions.OrgChartAccountConstants.LastModifiedOnKey + accountId);
                LinkedInExtensions.LocalStorage.setItem(LinkedInExtensions.OrgChartAccountConstants.LastModifiedOnKey + accountId, lastModifiedOn);
                if (lastModifiedOnLocal && (lastModifiedOnLocal < lastModifiedOn)) {
                    return true;
                }
            }
            return false;
        };
        AccountLibrary.checkOrgChartNodesCount = function (orgChartNodesCount, accountId) {
            if (orgChartNodesCount && orgChartNodesCount !== "-1") {
                var orgChartNodesCountOnLocal = LinkedInExtensions.LocalStorage.getItem(LinkedInExtensions.OrgChartAccountConstants.OrgChartNodesCountKey + accountId);
                LinkedInExtensions.LocalStorage.setItem(LinkedInExtensions.OrgChartAccountConstants.OrgChartNodesCountKey + accountId, orgChartNodesCount);
                if (orgChartNodesCountOnLocal && (orgChartNodesCountOnLocal !== orgChartNodesCount)) {
                    return true;
                }
            }
            return false;
        };
        AccountLibrary.displayFormNotification = function (formContext, accountId, accountName, notificationText) {
            return __awaiter(this, void 0, void 0, function () {
                var openOrgChartActionLabel, dismissActionLabel, actionButtons;
                return __generator(this, function (_a) {
                    openOrgChartActionLabel = LinkedInExtensions.ResourceStringProvider.getResourceString(LinkedInExtensions.OrgChartAccountConstants.OpenOrgChartActionLabel);
                    dismissActionLabel = LinkedInExtensions.ResourceStringProvider.getResourceString(LinkedInExtensions.OrgChartAccountConstants.DismissActionLabel);
                    actionButtons = [{
                            Label: openOrgChartActionLabel,
                            Handler: function () {
                                LinkedInExtensions.OrgChartUtils.ValidateAndOpenOrgChart(accountId, accountName);
                                formContext.ui.clearFormNotification(LinkedInExtensions.OrgChartAccountConstants.OrgChartModifiedNotificationId);
                            }
                        }, {
                            Label: dismissActionLabel,
                            Handler: function () {
                                formContext.ui.clearFormNotification(LinkedInExtensions.OrgChartAccountConstants.OrgChartModifiedNotificationId);
                            }
                        }];
                    try {
                        formContext.ui.setFormNotification(notificationText, "INFO", LinkedInExtensions.OrgChartAccountConstants.OrgChartModifiedNotificationId, actionButtons);
                    }
                    catch (error) {
                        // TODO:- Add telemetry
                        return [2 /*return*/];
                    }
                    return [2 /*return*/];
                });
            });
        };
        /**
         *
         * @param userId - The id of the user
         */
        AccountLibrary.getLastLoginTime = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var fetchXmlForLastLoginWithUserId;
                return __generator(this, function (_a) {
                    fetchXmlForLastLoginWithUserId = LinkedInExtensions.formatString(LinkedInExtensions.FetchXMLStrings.RetrieveLastLoginTime, userId);
                    return [2 /*return*/, Xrm.WebApi.online.retrieveMultipleRecords(LinkedInExtensions.OrgChartAccountConstants.AuditEntityName, "?fetchXml=" + fetchXmlForLastLoginWithUserId)];
                });
            });
        };
        return AccountLibrary;
    }());
    LinkedInExtensions.AccountLibrary = AccountLibrary;
})(LinkedInExtensions || (LinkedInExtensions = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="./UCI/AccountLibrary.ts" />
var LinkedInExtensions;
(function (LinkedInExtensions) {
    /**
    * Wrapper class to instantiate either legacy or new UCI compiliant library for Account
    */
    var Account = /** @class */ (function () {
        function Account() {
        }
        Account.Instance = new LinkedInExtensions.AccountLibrary();
        Account.ctor = (function () {
        })();
        return Account;
    }());
    LinkedInExtensions.Account = Account;
})(LinkedInExtensions || (LinkedInExtensions = {}));
//# sourceMappingURL=LinkedInExtensions_Account.js.map