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
var OmniChannelPackage;
(function (OmniChannelPackage) {
    var OmniChannelUserConstants = (function () {
        function OmniChannelUserConstants() {
        }
        return OmniChannelUserConstants;
    }());
    OmniChannelUserConstants.AvailablePresenceRecordId = "f523f628-c07a-e811-8162-000d3aa11f50";
    OmniChannelUserConstants.AvaialblePresenceRecordName = "Available";
    OmniChannelUserConstants.Capacity = "msdyn_capacity";
    OmniChannelUserConstants.DefaultCapacityValue = 100;
    OmniChannelUserConstants.DefaultPresence = "msdyn_defaultpresenceiduser";
    OmniChannelUserConstants.DefaultPresenceControl = "default_presence_user";
    OmniChannelUserConstants.Presence = "msdyn_presence";
    OmniChannelUserConstants.RecordMissingMessage = "Could not assign default presence because presence records have not been imported";
    OmniChannelUserConstants.OCBaseSolutionName = "msdyn_OmnichannelBase";
    OmniChannelUserConstants.OCFormNotificationText = "OC_FormNotificationMessageForDSF";
    OmniChannelUserConstants.OCFormNotificationType = "INFO";
    OmniChannelUserConstants.OCFormNotificationId = "4335521A-4DCB-41BE-8C81-EA6DC79AC459";
    OmniChannelUserConstants.OCProvisioningPowerPlatformSetting = "msdyn_IsCCaaSProvisioned";
    OmniChannelUserConstants.URProvisioningPowerPlatformSetting = "msdyn_IsCCaaSURProvisioned";
    OmniChannelUserConstants.OCTabInSystemUserForm = "Omnichannel_TAB";
    OmniChannelUserConstants.LiveEngagementQueuesSubGrid = "LiveEngagementQueues";
    OmniChannelPackage.OmniChannelUserConstants = OmniChannelUserConstants;
})(OmniChannelPackage || (OmniChannelPackage = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
///<reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts"/>
///<reference path="../TypeDefinitions/libs/XrmClientApi.d.ts"/>
///<reference path="../../../../references/internal/TypeDefinitions/XrmClientApi/XrmClientApiInternal.d.ts"/>
///<reference path="UserConstants.ts"/>
"use strict";
var OmniChannelPackage;
(function (OmniChannelPackage) {
    var UserSettings = (function () {
        function UserSettings() {
        }
        UserSettings.prototype.retrieveFeatureControlSettingValue = function (nameSpace, featureControl) {
            return __awaiter(this, void 0, void 0, function () {
                var settingValue, parameters, retrieveFeatureControlSettingRequest, promise;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            settingValue = false;
                            parameters = {};
                            parameters.NamespaceValue = nameSpace;
                            parameters.FeatureControlName = featureControl;
                            retrieveFeatureControlSettingRequest = {
                                NamespaceValue: parameters.NamespaceValue,
                                FeatureControlName: parameters.FeatureControlName,
                                getMetadata: function () {
                                    return {
                                        boundParameter: null,
                                        parameterTypes: {
                                            "NamespaceValue": {
                                                "typeName": "Edm.String",
                                                "structuralProperty": 1
                                            },
                                            "FeatureControlName": {
                                                "typeName": "Edm.String",
                                                "structuralProperty": 1
                                            }
                                        },
                                        operationType: 0,
                                        operationName: "RetrieveFeatureControlSetting"
                                    };
                                }
                            };
                            promise = new Promise(function (resolve, reject) {
                                Xrm.WebApi.online.execute(retrieveFeatureControlSettingRequest).then(function success(result) {
                                    if (result.ok) {
                                        result.json().then(function (a) { console.log(a); });
                                        result.json().then(function (settingObject) {
                                            if (settingObject.FeatureControlSetting != null) {
                                                if (settingObject.FeatureControlSetting.Value.Value === true) {
                                                    resolve(true);
                                                }
                                                else {
                                                    resolve(false);
                                                }
                                            }
                                            else {
                                                resolve(false);
                                            }
                                        });
                                    }
                                    else {
                                        resolve(false);
                                    }
                                }, function (_error) {
                                    reject(false);
                                });
                            });
                            return [4 /*yield*/, promise];
                        case 1:
                            settingValue = _a.sent();
                            return [2 /*return*/, settingValue];
                    }
                });
            });
        };
        UserSettings.prototype.retrieveSettingValue = function (settingName) {
            return __awaiter(this, void 0, void 0, function () {
                var settingValue, parameters, retrieveSettingRequest, promise;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            settingValue = false;
                            parameters = {};
                            parameters.SettingName = settingName;
                            retrieveSettingRequest = {
                                SettingName: parameters.SettingName,
                                getMetadata: function () {
                                    return {
                                        boundParameter: "",
                                        parameterTypes: {
                                            "SettingName": {
                                                "typeName": "Edm.String",
                                                "structuralProperty": 1
                                            }
                                        },
                                        operationType: 1,
                                        operationName: "RetrieveSetting"
                                    };
                                }
                            };
                            promise = new Promise(function (resolve, reject) {
                                Xrm.WebApi.online.execute(retrieveSettingRequest).then(function (response) {
                                    if (response.ok) {
                                        response.json().then(function (settingObject) {
                                            if (settingObject.SettingDetail.Value === 'True') {
                                                resolve(true);
                                            }
                                            else {
                                                resolve(false);
                                            }
                                        });
                                    }
                                    else {
                                        resolve(false);
                                    }
                                }, function (_error) {
                                    reject(false);
                                });
                            });
                            return [4 /*yield*/, promise];
                        case 1:
                            settingValue = _a.sent();
                            return [2 /*return*/, settingValue];
                    }
                });
            });
        };
        //Function to hide or show Omnichannel Tab in system user form based on whether OC/UR is provisioned or not.
        UserSettings.prototype.HideOrShowOmnichannelTab = function (executionContext) {
            var _this = this;
            if (Xrm.Internal.isUci()) {
                var isFCSEnabled = Xrm.Utility.getGlobalContext().getFeatureControlSetting("Omnichannel.OmnichannelForUnifiedRouting", "UtilizePowerPlatformSettingsForOmichannelProvisioningStatus");
                if (isFCSEnabled == null || isFCSEnabled == false)
                    return;
            }
            else {
                this.retrieveFeatureControlSettingValue("Omnichannel.OmnichannelForUnifiedRouting", "UtilizePowerPlatformSettingsForOmichannelProvisioningStatus").then(function (isFCSEnabled) {
                    if (isFCSEnabled == false) {
                        return;
                    }
                }, function (_error) {
                    return;
                });
            }
            var formContext = executionContext.getFormContext();
            var cCaaS_setting = false;
            var cCaaSUR_setting = false;
            var tabs = formContext.ui.tabs.get();
            for (var indx = 0; indx < tabs.length; indx++) {
                var tab = tabs[indx];
                if (tab.getName() == OmniChannelPackage.OmniChannelUserConstants.OCTabInSystemUserForm) {
                    if (Xrm.Internal.isUci()) {
                        var ocFlag = Xrm.Utility.getGlobalContext().getCurrentAppSetting(OmniChannelPackage.OmniChannelUserConstants.OCProvisioningPowerPlatformSetting);
                        if (ocFlag != null) {
                            cCaaS_setting = ocFlag;
                            if (cCaaS_setting == true) {
                                formContext.ui.tabs.get(OmniChannelPackage.OmniChannelUserConstants.OCTabInSystemUserForm).setVisible(true);
                                return;
                            }
                            else {
                                var urFlag = Xrm.Utility.getGlobalContext().getCurrentAppSetting(OmniChannelPackage.OmniChannelUserConstants.URProvisioningPowerPlatformSetting);
                                if (urFlag != null) {
                                    cCaaSUR_setting = urFlag;
                                    if (cCaaSUR_setting == true) {
                                        formContext.ui.tabs.get(OmniChannelPackage.OmniChannelUserConstants.OCTabInSystemUserForm).setVisible(true);
                                        return;
                                    }
                                    else {
                                        formContext.ui.tabs.get(OmniChannelPackage.OmniChannelUserConstants.OCTabInSystemUserForm).setVisible(false);
                                    }
                                }
                                else {
                                    formContext.ui.tabs.get(OmniChannelPackage.OmniChannelUserConstants.OCTabInSystemUserForm).setVisible(false);
                                }
                            }
                        }
                        else {
                            var urFlag = Xrm.Utility.getGlobalContext().getCurrentAppSetting(OmniChannelPackage.OmniChannelUserConstants.URProvisioningPowerPlatformSetting);
                            if (urFlag != null) {
                                cCaaSUR_setting = urFlag;
                                if (cCaaSUR_setting == true) {
                                    formContext.ui.tabs.get(OmniChannelPackage.OmniChannelUserConstants.OCTabInSystemUserForm).setVisible(true);
                                    return;
                                }
                                else {
                                    formContext.ui.tabs.get(OmniChannelPackage.OmniChannelUserConstants.OCTabInSystemUserForm).setVisible(false);
                                }
                            }
                            else {
                                formContext.ui.tabs.get(OmniChannelPackage.OmniChannelUserConstants.OCTabInSystemUserForm).setVisible(false);
                            }
                        }
                        formContext.ui.tabs.get(OmniChannelPackage.OmniChannelUserConstants.OCTabInSystemUserForm).setVisible(false);
                        break;
                    }
                    else {
                        this.retrieveSettingValue(OmniChannelPackage.OmniChannelUserConstants.OCProvisioningPowerPlatformSetting).then(function (isCCaaSProvisioned) {
                            if (isCCaaSProvisioned) {
                                formContext.ui.tabs.get(OmniChannelPackage.OmniChannelUserConstants.OCTabInSystemUserForm).setVisible(true);
                            }
                            else {
                                _this.retrieveSettingValue(OmniChannelPackage.OmniChannelUserConstants.URProvisioningPowerPlatformSetting).then(function (isCCaaSURProvisioned) {
                                    if (isCCaaSURProvisioned) {
                                        formContext.ui.tabs.get(OmniChannelPackage.OmniChannelUserConstants.OCTabInSystemUserForm).setVisible(true);
                                    }
                                    else {
                                        formContext.ui.tabs.get(OmniChannelPackage.OmniChannelUserConstants.OCTabInSystemUserForm).setVisible(false);
                                    }
                                }, function (_error) {
                                    formContext.ui.tabs.get(OmniChannelPackage.OmniChannelUserConstants.OCTabInSystemUserForm).setVisible(false);
                                });
                            }
                        }, function (_error) {
                            formContext.ui.tabs.get(OmniChannelPackage.OmniChannelUserConstants.OCTabInSystemUserForm).setVisible(false);
                        });
                    }
                }
            }
        };
        UserSettings.prototype.showNotificationInForm = function (executionContext) {
            var gridContext = executionContext.getFormContext();
            if (gridContext.formContext) {
                gridContext.formContext.ui.setFormNotification(Xrm.Utility.getResourceString(OmniChannelPackage.OmniChannelUserConstants.OCBaseSolutionName, OmniChannelPackage.OmniChannelUserConstants.OCFormNotificationText), OmniChannelPackage.OmniChannelUserConstants.OCFormNotificationType, OmniChannelPackage.OmniChannelUserConstants.OCFormNotificationId);
            }
            else {
                gridContext.ui.setFormNotification(Xrm.Utility.getResourceString(OmniChannelPackage.OmniChannelUserConstants.OCBaseSolutionName, OmniChannelPackage.OmniChannelUserConstants.OCFormNotificationText), OmniChannelPackage.OmniChannelUserConstants.OCFormNotificationType, OmniChannelPackage.OmniChannelUserConstants.OCFormNotificationId);
            }
        };
        UserSettings.prototype.clearNotificationInForm = function (executionContext) {
            var formContext = executionContext.getFormContext();
            formContext.ui.clearFormNotification(OmniChannelPackage.OmniChannelUserConstants.OCFormNotificationId);
        };
        UserSettings.prototype.onLoadSetValue = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var subGridContext = formContext.getControl(OmniChannelPackage.OmniChannelUserConstants.LiveEngagementQueuesSubGrid);
            if (subGridContext != null) {
                subGridContext.addOnLoad(this.showNotificationInForm);
            }
            this.clearNotificationInForm(executionContext);
        };
        UserSettings.prototype.SetDefaultCapacityAndDefaultPresence = function (executionContext) {
            var isFCSEnabled = false;
            if (Xrm.Internal.isUci()) {
                isFCSEnabled = Xrm.Utility.getGlobalContext().getFeatureControlSetting("Omnichannel.OmnichannelForUnifiedRouting", "UtilizePowerPlatformSettingsForOmichannelProvisioningStatus");
            }
            if (isFCSEnabled == true) {
                var cCaaS_setting = false;
                var cCaaSUR_setting = false;
                var ocFlag = Xrm.Utility.getGlobalContext().getCurrentAppSetting(OmniChannelPackage.OmniChannelUserConstants.OCProvisioningPowerPlatformSetting);
                if (ocFlag != null) {
                    cCaaS_setting = ocFlag;
                }
                var urFlag = Xrm.Utility.getGlobalContext().getCurrentAppSetting(OmniChannelPackage.OmniChannelUserConstants.URProvisioningPowerPlatformSetting);
                if (urFlag != null) {
                    cCaaSUR_setting = urFlag;
                }
                if (cCaaS_setting == false && cCaaSUR_setting == false)
                    return;
            }
            var formContext = executionContext.getFormContext();
            var default_capacity = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelUserConstants.Capacity);
            var defaultCapacityControl = formContext.getControl(OmniChannelPackage.OmniChannelUserConstants.Capacity);
            if (default_capacity != null && defaultCapacityControl != null) {
                if (default_capacity.getValue() == null && !defaultCapacityControl.getDisabled()) {
                    default_capacity.setValue(OmniChannelPackage.OmniChannelUserConstants.DefaultCapacityValue);
                }
            }
            var default_presence = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelUserConstants.DefaultPresence);
            var defaultPresenceControl = this.GetDefaultPresenceControl(formContext);
            if (default_presence == null || defaultPresenceControl == null) {
                return;
            }
            if (default_presence.getValue() == null && !defaultPresenceControl.getDisabled()) {
                Xrm.WebApi.retrieveRecord(OmniChannelPackage.OmniChannelUserConstants.Presence, OmniChannelPackage.OmniChannelUserConstants.AvailablePresenceRecordId).then(function success(result) {
                    var value = new Array();
                    value[0] = new Object();
                    value[0].id = OmniChannelPackage.OmniChannelUserConstants.AvailablePresenceRecordId;
                    value[0].name = OmniChannelPackage.OmniChannelUserConstants.AvaialblePresenceRecordName;
                    value[0].entityType = OmniChannelPackage.OmniChannelUserConstants.Presence;
                    default_presence.setValue(value);
                }, function (error) {
                    //TODO: add telemetry.
                });
            }
        };
        //the default presence control right now has a different control id and datafieldname this is causing issue as stated in bug:https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2157282/
        //if a customer deletes this field and adds it back the control is get by "msdyn_defaultpresenceiduser"(datafieldname) otherwise it is get by "default_presence_user"(id)
        //updating id is not supported via patch solution in update scenario hence adding this 
        UserSettings.prototype.GetDefaultPresenceControl = function (formContext) {
            var defaultPresenceControl = formContext.getControl(OmniChannelPackage.OmniChannelUserConstants.DefaultPresenceControl);
            if (!defaultPresenceControl) {
                //if this is null this could mean the control was removed and added back try getting control via datafieldname
                defaultPresenceControl = formContext.getControl(OmniChannelPackage.OmniChannelUserConstants.DefaultPresence);
            }
            return defaultPresenceControl;
        };
        return UserSettings;
    }());
    OmniChannelPackage.UserSettings = UserSettings;
    var OmniChannelUser = (function () {
        function OmniChannelUser() {
        }
        return OmniChannelUser;
    }());
    OmniChannelUser.Instance = new UserSettings();
    OmniChannelPackage.OmniChannelUser = OmniChannelUser;
})(OmniChannelPackage || (OmniChannelPackage = {}));
