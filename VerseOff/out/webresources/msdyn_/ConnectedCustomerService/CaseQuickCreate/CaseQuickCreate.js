var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
/*! WARNING! Do not update this file manually! Manual update of this file is not supported and will likely lead to issues. In addition, future solution upgrades wont apply to manually edited files. */
var CCS;
(function (CCS) {
    var Common;
    (function (Common) {
        var Constants = /** @class */ (function () {
            function Constants() {
            }
            Constants.IoTCacheKeys = /** @class */ (function () {
                function class_1() {
                }
                Object.defineProperty(class_1, "AtLeastOneDeviceOrAlertExist", {
                    get: function () { return "has_at_least_one_device_or_alert"; },
                    enumerable: true,
                    configurable: true
                });
                return class_1;
            }());
            Constants.CaseOriginConstants = /** @class */ (function () {
                function class_2() {
                }
                Object.defineProperty(class_2, "CaseOriginCodeFieldName", {
                    get: function () { return "caseorigincode"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_2, "IotCaseOriginCodeValue", {
                    get: function () { return 700610000; },
                    enumerable: true,
                    configurable: true
                });
                return class_2;
            }());
            Constants.Dashboard = /** @class */ (function () {
                function class_3() {
                }
                Object.defineProperty(class_3, "IotDeploymentLink", {
                    get: function () { return "https://iotdeployment.dynamics.com"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_3, "IotCentralLink", {
                    get: function () { return "https://go.microsoft.com/fwlink/?linkid=2115241"; },
                    enumerable: true,
                    configurable: true
                });
                return class_3;
            }());
            Constants.TelemetryConstants = /** @class */ (function () {
                function class_4() {
                }
                Object.defineProperty(class_4, "ClientName", {
                    get: function () { return "ConnectedCustomerService"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_4, "setContextName", {
                    get: function () { return "ConnectedCustomerService"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_4, "setContextPrefixName", {
                    get: function () { return "msdyn.ConnectedCustomerService"; },
                    enumerable: true,
                    configurable: true
                });
                return class_4;
            }());
            return Constants;
        }());
        Common.Constants = Constants;
    })(Common = CCS.Common || (CCS.Common = {}));
})(CCS || (CCS = {}));
/*! WARNING! Do not update this file manually! Manual update of this file is not supported and will likely lead to issues. In addition, future solution upgrades wont apply to manually edited files. */
var CCSRef;
(function (CCSRef) {
    var Common;
    (function (Common) {
        var DeviceKeyType;
        (function (DeviceKeyType) {
            DeviceKeyType["DeviceGuid"] = "DeviceGuid";
            DeviceKeyType["AlertGuid"] = "AlertGuid";
            DeviceKeyType["DeviceID"] = "DeviceID";
        })(DeviceKeyType = Common.DeviceKeyType || (Common.DeviceKeyType = {}));
        var Constants = /** @class */ (function () {
            function Constants() {
            }
            Constants.getReadPrivilegesForEntity = function (entityName) {
                return this.PrvReadNamesForEntities[entityName];
            };
            Constants.Msdyn_iotdevice = /** @class */ (function () {
                function class_5() {
                }
                Object.defineProperty(class_5, "ODataEntityName", {
                    get: function () { return "msdyn_iotdevices"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_5, "EntityLogicalName", {
                    get: function () { return "msdyn_iotdevice"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_5, "StatusRegistered", {
                    get: function () { return "192350003"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_5, "StatusInProgress", {
                    get: function () { return "192350002"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_5, "AttributeRegistrationStatus", {
                    get: function () { return "msdyn_registrationstatus"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_5, "AttributeDeviceName", {
                    get: function () { return "msdyn_name"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_5, "AttributeDeviceId", {
                    get: function () { return "msdyn_deviceid"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_5, "AttributeEntityId", {
                    get: function () { return "msdyn_iotdeviceid"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_5, "RegisterAction", {
                    get: function () { return "msdyn_RegisterIoTDevice"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_5, "PullDataAction", {
                    get: function () { return "msdyn_PullDataForIoTDevice"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_5, "IoTHubRegisterAction", {
                    get: function () { return "msdyn_IoTHubRegisterDevice"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_5, "IoTHubPullDeviceDataAction", {
                    get: function () { return "msdyn_IoTHubPullDeviceData"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_5, "IoTRegisterActionHandler", {
                    get: function () { return "msdyn_IoTRegisterActionHandler"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_5, "IoTPullDeviceDataActionHandler", {
                    get: function () { return "msdyn_IoTPullDeviceDataActionHandler"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_5, "IoTProviderInstance", {
                    get: function () { return "msdyn_IoTProviderInstance"; },
                    enumerable: true,
                    configurable: true
                });
                return class_5;
            }());
            Constants.Msdyn_iotprovider = /** @class */ (function () {
                function class_6() {
                }
                Object.defineProperty(class_6, "EntityLogicalName", {
                    get: function () { return "msdyn_iotprovider"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_6, "AttributeId", {
                    get: function () { return "msdyn_iotproviderid"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_6, "ODataEntityName", {
                    get: function () { return "msdyn_iotproviders"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_6, "AttributeRegisterAction", {
                    get: function () { return "msdyn_registeraction"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_6, "AttributePullDeviceDataAction", {
                    get: function () { return "msdyn_pulldevicedataaction"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_6, "IoTHubQueryReadingsAction", {
                    get: function () { return "msdyn_IoTHubQueryDeviceReadings"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_6, "AttributeqQueryDeviceReadingSaction", {
                    get: function () { return "msdyn_querydevicereadingsaction"; },
                    enumerable: true,
                    configurable: true
                });
                return class_6;
            }());
            Constants.Msdyn_iotalert = /** @class */ (function () {
                function class_7() {
                }
                Object.defineProperty(class_7, "ODataEntityName", {
                    get: function () { return "msdyn_iotalerts"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_7, "EntityLogicalName", {
                    get: function () { return "msdyn_iotalert"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_7, "AttributeDeviceId", {
                    get: function () { return "msdyn_deviceid"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_7, "AttributeDevice", {
                    get: function () { return "msdyn_Device"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_7, "AttributeAlertData", {
                    get: function () { return "msdyn_alertdata"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_7, "AttributeAlertType", {
                    get: function () { return "msdyn_alerttype"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_7, "AttributeAlertToken", {
                    get: function () { return "msdyn_alerttoken"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_7, "AttributeAlertTime", {
                    get: function () { return "msdyn_alerttime"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_7, "AttributeAlertURL", {
                    get: function () { return "msdyn_alerturl"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_7, "CustomControlAlertData", {
                    get: function () { return "msdyn_alertdata1"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_7, "AttributeAlertPriorityScore", {
                    get: function () { return "msdyn_alertpriorityscore"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_7, "AttributeAlertPriority", {
                    get: function () { return "msdyn_suggestedpriority"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_7, "CalculatingPriorityValue", {
                    get: function () { return 192350000; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_7, "HighPriorityValue", {
                    get: function () { return 192350001; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_7, "LowPriorityValue", {
                    get: function () { return 192350002; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_7, "SuggestionsSection", {
                    get: function () { return "SuggestionsSection"; },
                    enumerable: true,
                    configurable: true
                });
                return class_7;
            }());
            Constants.Msdyn_iotsettings = /** @class */ (function () {
                function class_8() {
                }
                Object.defineProperty(class_8, "AttributeId", {
                    get: function () { return "76CD1AAA-0DFD-4C17-8915-9DF22EE05137"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_8, "EntityLogicalName", {
                    get: function () { return "msdyn_iotsettings"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_8, "AttributeDefaultProviderInstance", {
                    get: function () { return "msdyn_DefaultIoTProviderInstance"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_8, "AttributeDefaultProviderInstanceLogicalName", {
                    get: function () { return "msdyn_defaultiotproviderinstance"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_8, "AttributeDeploymentAppURL", {
                    get: function () { return "msdyn_deploymentappurl"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_8, "AttributeEnableIoTSuggestions", {
                    get: function () { return "msdyn_enableiotsuggestions"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_8, "ModelStatusSection", {
                    get: function () { return "ModelStatusSection"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_8, "SuggestionTab", {
                    get: function () { return "SuggestionsTab"; },
                    enumerable: true,
                    configurable: true
                });
                return class_8;
            }());
            Constants.Msdyn_iotproviderinstance = /** @class */ (function () {
                function class_9() {
                }
                Object.defineProperty(class_9, "EntityLogicalName", {
                    get: function () { return "msdyn_iotproviderinstance"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_9, "AttributeName", {
                    get: function () { return "msdyn_name"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_9, "AttributeId", {
                    get: function () { return "msdyn_iotproviderinstanceid"; },
                    enumerable: true,
                    configurable: true
                });
                return class_9;
            }());
            Constants.GridIconImagePaths = /** @class */ (function () {
                function class_10() {
                }
                Object.defineProperty(class_10, "HighPriImage", {
                    get: function () { return "msdyn_/IoT/Images/SVG/IoTAlerts/HighPriIcon.svg"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_10, "EmptyImage", {
                    get: function () { return "msdyn_/IoT/Images/SVG/IoTAlerts/EmptyIcon.svg"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_10, "CalculatingImage", {
                    get: function () { return "msdyn_/IoT/Images/SVG/IoTAlerts/CalculatingIcon.svg"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_10, "ParentAlertImage", {
                    get: function () { return "msdyn_/IoT/Images/SVG/IoTAlerts/ParentAlertIcon.svg"; },
                    enumerable: true,
                    configurable: true
                });
                return class_10;
            }());
            Constants.DeviceProperty = /** @class */ (function () {
                function class_11() {
                }
                Object.defineProperty(class_11, "isTagFieldName", {
                    get: function () { return "msdyn_istag"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_11, "propertyFieldName", {
                    get: function () { return "msdyn_property"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_11, "IoTDevicePropertyEntityName", {
                    get: function () { return "msdyn_iotdeviceproperty"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_11, "IoTDeviceCategoryEntityName", {
                    get: function () { return "msdyn_iotdevicecategory"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_11, "AttributeCategory", {
                    get: function () { return "msdyn_devicecategory"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_11, "AttributeCategoryName", {
                    get: function () { return "msdyn_devicecategoryname"; },
                    enumerable: true,
                    configurable: true
                });
                return class_11;
            }());
            Constants.PropertyDefinition = /** @class */ (function () {
                function class_12() {
                }
                Object.defineProperty(class_12, "typeFieldName", {
                    get: function () { return "msdyn_type"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_12, "editableFieldName", {
                    get: function () { return "msdyn_editable"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_12, "visibleFieldName", {
                    get: function () { return "msdyn_visible"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_12, "uciPropsFieldName", {
                    get: function () { return "msdyn_additionalproperties1"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_12, "webPropsFieldName", {
                    get: function () { return "msdyn_additionalproperties"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_12, "childParamsSectionName", {
                    get: function () { return "ChildParameters"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_12, "ObjectTypeOptionSetValue", {
                    get: function () { return 192350001; },
                    enumerable: true,
                    configurable: true
                });
                return class_12;
            }());
            Constants.FieldMappingForm = /** @class */ (function () {
                function class_13() {
                }
                Object.defineProperty(class_13, "AttributeSearchType", {
                    get: function () { return "msdyn_searchtype"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_13, "AttributeDirectOrKeyPath", {
                    get: function () { return "msdyn_directpathorkeypath"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_13, "AttributeValuePath", {
                    get: function () { return "msdyn_valuepath"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_13, "AttributeFieldDataFormat", {
                    get: function () { return "msdyn_fielddataformat"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_13, "FieldDataFormatDirectValue", {
                    get: function () { return 192350000; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_13, "SearchTypeDirectPathValue", {
                    get: function () { return 192350000; },
                    enumerable: true,
                    configurable: true
                });
                return class_13;
            }());
            Constants.IoTSettingsForm = /** @class */ (function () {
                function class_14() {
                }
                Object.defineProperty(class_14, "DeviceDataPullsTab", {
                    get: function () { return "{eddc3ea8-b755-416e-8d97-c3b1fee65aad}"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_14, "DeploymentFieldValue", {
                    get: function () { return "https://iotdeployment.dynamics.com"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_14, "IoTSuggestionsSection", {
                    get: function () { return "SuggestionsSection"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_14, "AttributeEnableIoTSuggestions", {
                    get: function () { return "msdyn_enableiotsuggestions"; },
                    enumerable: true,
                    configurable: true
                });
                return class_14;
            }());
            Constants.DeviceVisualizationConfigurationForm = /** @class */ (function () {
                function class_15() {
                }
                Object.defineProperty(class_15, "OptionsetValueLatest", {
                    get: function () { return 192350002; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_15, "OptionsetValueNone", {
                    get: function () { return 192350000; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_15, "IoTDeviceCategory", {
                    get: function () { return "msdyn_iotdevicecategory"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_15, "IoTDevice", {
                    get: function () { return "msdyn_iotdevice"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_15, "AttributeName", {
                    get: function () { return "msdyn_name"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_15, "Aggregation", {
                    get: function () { return "msdyn_aggregation"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_15, "IoTTimeRangeValue", {
                    get: function () { return "msdyn_timerangevalue"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_15, "IoTTimeRangeType", {
                    get: function () { return "msdyn_timerangetype"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_15, "ConfigurationType", {
                    get: function () { return "msdyn_visualizationconfigurationtype"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_15, "Measurement", {
                    get: function () { return "msdyn_measurement"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_15, "Position", {
                    get: function () { return "msdyn_position"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_15, "ActionName", {
                    get: function () { return "msdyn_actionname"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_15, "DeviceEvent", {
                    get: function () { return "msdyn_deviceevent"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_15, "CaseAction", {
                    get: function () { return "msdyn_GetCaseAggregation"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_15, "AlertAction", {
                    get: function () { return "msdyn_GetIoTAlertAggregation"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_15, "WorkorderAction", {
                    get: function () { return "msdyn_GetWorkOrderAggregation"; },
                    enumerable: true,
                    configurable: true
                });
                return class_15;
            }());
            Constants.WebResource = /** @class */ (function () {
                function class_16() {
                }
                Object.defineProperty(class_16, "ODataEntityName", {
                    get: function () { return "webresourceset"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_16, "AttributeWebResourceId", {
                    get: function () { return "webresourceid"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_16, "AttributeName", {
                    get: function () { return "name"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_16, "AttributeContent", {
                    get: function () { return "content"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_16, "WebResourceName", {
                    get: function () { return "webresource"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_16, "WebResourcesName", {
                    get: function () { return "webresources"; },
                    enumerable: true,
                    configurable: true
                });
                return class_16;
            }());
            Constants.WelcomeDialog = /** @class */ (function () {
                function class_17() {
                }
                Object.defineProperty(class_17, "CFSDeploymentLinkText", {
                    get: function () { return "CFSDeploymentLinkText"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_17, "CFSDeploymentLinkImage", {
                    get: function () { return "CFSDeploymentLinkImage"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_17, "IoTCentralLinkText", {
                    get: function () { return "IoTCentralLinkText"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_17, "IoTCentralLinkImage", {
                    get: function () { return "IoTCentralLinkImage"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_17, "IoTSettingsId", {
                    get: function () { return "76CD1AAA-0DFD-4C17-8915-9DF22EE05137"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_17, "CFSLearnMoreUrl", {
                    get: function () { return "https://docs.microsoft.com/dynamics365/customer-engagement/field-service/connected-field-service"; },
                    enumerable: true,
                    configurable: true
                });
                return class_17;
            }());
            Constants.Connection = /** @class */ (function () {
                function class_18() {
                }
                Object.defineProperty(class_18, "EntityLogicalName", {
                    get: function () { return "connection"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_18, "ODataEntityName", {
                    get: function () { return "connections"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_18, "AttributeRecord1IdValue", {
                    get: function () { return "_record1id_value"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_18, "AttributeRecord2IdValue", {
                    get: function () { return "_record2id_value"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_18, "AttributeRecord2RoleId", {
                    get: function () { return "_record2roleid_value"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_18, "Record1IdValue", {
                    get: function () { return "record1id"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_18, "Record2IdValue", {
                    get: function () { return "record2id"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_18, "Record2RoleIdValue", {
                    get: function () { return "record2roleid"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_18, "IoTRoleId", {
                    get: function () { return "9C86F660-5F5B-E611-810B-00155DBD6A1D"; },
                    enumerable: true,
                    configurable: true
                });
                return class_18;
            }());
            Constants.Dashboard = /** @class */ (function () {
                function class_19() {
                }
                Object.defineProperty(class_19, "IoTSettingsId", {
                    get: function () { return "76CD1AAA-0DFD-4C17-8915-9DF22EE05137"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_19, "GCC", {
                    get: function () { return "crm9"; } // Flag to check for GCC region. Example of GCC org https://contoso.crm9.dynamics.com
                    ,
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_19, "USGovt", {
                    get: function () { return "us"; } // Flag to check for GCCHigh or DoD region. Example of GCC High org https://contoso.crm.microsoftdynamics.us or DoD https://contoso.crm.appsplatform.us
                    ,
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_19, "China", {
                    get: function () { return "cn"; } // Flag to check for China(MoonCake) region. Example of Mooncake org https://contoso.crm.dynamics.cn
                    ,
                    enumerable: true,
                    configurable: true
                });
                return class_19;
            }());
            Constants.Role = /** @class */ (function () {
                function class_20() {
                }
                Object.defineProperty(class_20, "ODataEntityName", {
                    get: function () { return "roles"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_20, "AttributeRoleTemplateId", {
                    get: function () { return "_roletemplateid_value"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_20, "AttributeRoleId", {
                    get: function () { return "roleid"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_20, "SystemAdminRoleTemplateId", {
                    get: function () { return "627090FF-40A3-4053-8790-584EDC5BE201"; },
                    enumerable: true,
                    configurable: true
                });
                return class_20;
            }());
            Constants.QueryString = /** @class */ (function () {
                function class_21() {
                }
                Object.defineProperty(class_21, "OrgLCID", {
                    get: function () { return "OrgLCID"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_21, "UserLCID", {
                    get: function () { return "UserLCID"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_21, "Id", {
                    get: function () { return "id"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_21, "Orgname", {
                    get: function () { return "orgname"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_21, "Type", {
                    get: function () { return "type"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_21, "Typename", {
                    get: function () { return "typename"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_21, "EntityTypename", {
                    get: function () { return "entityTypeName"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_21, "Data", {
                    get: function () { return "Data"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_21, "WebResourceId", {
                    get: function () { return "WebResourceId"; },
                    enumerable: true,
                    configurable: true
                });
                return class_21;
            }());
            Constants.Azure = /** @class */ (function () {
                function class_22() {
                }
                Object.defineProperty(class_22, "SqlTableName", {
                    get: function () { return "crmioteventsview"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_22, "SqlFieldName", {
                    get: function () { return "deviceid"; },
                    enumerable: true,
                    configurable: true
                });
                return class_22;
            }());
            Constants.FirstPartyIntegration = /** @class */ (function () {
                function class_23() {
                }
                Object.defineProperty(class_23, "Env", {
                    get: function () { return "env"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_23, "Direction", {
                    get: function () { return "direction"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_23, "Mode", {
                    get: function () { return "mode"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_23, "PowerBIUrl", {
                    get: function () { return "powerBIUrl"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_23, "LoginLabel", {
                    get: function () { return "loginLabel"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_23, "LoginText", {
                    get: function () { return "loginText"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_23, "DashboardLabel", {
                    get: function () { return "dashboardLabel"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_23, "TileLabel", {
                    get: function () { return "tileLabel"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_23, "CheckboxLabel", {
                    get: function () { return "checkboxLabel"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_23, "TIEEndpoint", {
                    get: function () { return "https://www.crmdynint-livetie.com"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_23, "INTEndpoint", {
                    get: function () { return "https://www.crmdynint-int.com"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_23, "PRODEndpoint", {
                    get: function () { return "https://www.crmdynint.com"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_23, "PowerBIRuntime", {
                    get: function () { return "/PowerBI/8.2/runtime.html"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_23, "PowerBIConfig", {
                    get: function () { return "/PowerBI/8.2/config.html"; },
                    enumerable: true,
                    configurable: true
                });
                return class_23;
            }());
            Constants.CRMHostNames = /** @class */ (function () {
                function class_24() {
                }
                Object.defineProperty(class_24, "Prod", {
                    get: function () { return "dynamics.com"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_24, "INT", {
                    get: function () { return "dynamics-int.com"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_24, "TIE", {
                    get: function () { return "crmlivetie.com"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_24, "OneBox", {
                    get: function () { return "1boxtest.com"; },
                    enumerable: true,
                    configurable: true
                });
                return class_24;
            }());
            Constants.Env = /** @class */ (function () {
                function class_25() {
                }
                Object.defineProperty(class_25, "Dev", {
                    get: function () { return "dev"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_25, "Ppe", {
                    get: function () { return "ppe"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_25, "Prod", {
                    get: function () { return "prod"; },
                    enumerable: true,
                    configurable: true
                });
                return class_25;
            }());
            Constants.ParamKeys = /** @class */ (function () {
                function class_26() {
                }
                Object.defineProperty(class_26, "tileUrl", {
                    get: function () { return "tileUrl"; },
                    enumerable: true,
                    configurable: true
                });
                return class_26;
            }());
            Constants.ConfigButtons = /** @class */ (function () {
                function class_27() {
                }
                Object.defineProperty(class_27, "SaveButton", {
                    get: function () { return "SaveButton"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_27, "CancelButton", {
                    get: function () { return "CancelButton"; },
                    enumerable: true,
                    configurable: true
                });
                return class_27;
            }());
            Constants.FormConstants = /** @class */ (function () {
                function class_28() {
                }
                Object.defineProperty(class_28, "ConnectedDeviceReadings", {
                    get: function () { return "Connected Device Readings"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_28, "Required", {
                    get: function () { return "required"; },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(class_28, "NotRequired", {
                    get: function () { return "none"; },
                    enumerable: true,
                    configurable: true
                });
                ;
                return class_28;
            }());
            Constants.PostMessageEvents = /** @class */ (function () {
                function class_29() {
                }
                Object.defineProperty(class_29, "TileClickedEvent", {
                    get: function () { return "tileClicked"; },
                    enumerable: true,
                    configurable: true
                });
                return class_29;
            }());
            Constants.MetadataDrivenDialog = /** @class */ (function () {
                function class_30() {
                }
                Object.defineProperty(class_30, "IoTPowerBIConfiguration", {
                    get: function () { return "IoTPowerBIConfiguration"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_30, "Param_PBIConfigUrl", {
                    get: function () { return "param_pbiconfigurl"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_30, "Param_PBISetUrl", {
                    get: function () { return "param_pbiseturl"; },
                    enumerable: true,
                    configurable: true
                });
                return class_30;
            }());
            Constants.WebResourceName = /** @class */ (function () {
                function class_31() {
                }
                Object.defineProperty(class_31, "ConfigData", {
                    get: function () { return "msdyn_/IoT/PowerBI/Scripts/ConfigData.js"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_31, "PowerBIConfiguration", {
                    get: function () { return "msdyn_/IoT/PowerBI/HTML/PowerBIConfiguration.html"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_31, "PowerBIConfigurationLegacy", {
                    get: function () { return "msdyn_/IoT/PowerBI/Legacy/PowerBIConfigurationLegacy.html"; },
                    enumerable: true,
                    configurable: true
                });
                return class_31;
            }());
            Constants.CommandAttributeParameters = /** @class */ (function () {
                function class_32() {
                }
                Object.defineProperty(class_32, "CommandAttributeAlertId", {
                    get: function () { return "param_msdyn_parentalert"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_32, "CommandAttributeAlertName", {
                    get: function () { return "param_msdyn_parentalertname"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_32, "CommandAttributeIoTDeviceName", {
                    get: function () { return "param_msdyn_devicename"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_32, "CommandAttributeIoTDeviceId", {
                    get: function () { return "param_msdyn_device"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_32, "CommandAttributeParentEntityId", {
                    get: function () { return "param_msdyn_parententityid"; },
                    enumerable: true,
                    configurable: true
                });
                return class_32;
            }());
            Constants.CommandMFDParameters = /** @class */ (function () {
                function class_33() {
                }
                Object.defineProperty(class_33, "CommandAttributeIsMFD", {
                    get: function () { return "param_msdyn_isMfd"; },
                    enumerable: true,
                    configurable: true
                });
                return class_33;
            }());
            Constants.CommandViewAttributes = /** @class */ (function () {
                function class_34() {
                }
                Object.defineProperty(class_34, "CommandAttributeMsdynParentAlert", {
                    get: function () { return "msdyn_parentalert"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_34, "CommandAttributeMsdynParentAlertName", {
                    get: function () { return "msdyn_parentalertname"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_34, "CommandAttributeMsdynDevice", {
                    get: function () { return "msdyn_device"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_34, "CommandAttributeMsdynDeviceName", {
                    get: function () { return "msdyn_devicename"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_34, "CommandAttributeMsdynDeviceId", {
                    get: function () { return "msdyn_deviceid"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_34, "CommandAttributeMsdynMessage", {
                    get: function () { return "msdyn_message"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_34, "CommandAttributeMsdynName", {
                    get: function () { return "msdyn_name"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_34, "CommandAttributeMsdynCommand", {
                    get: function () { return "msdyn_command"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_34, "CommandAttributeMsdynCommandReference", {
                    get: function () { return "msdyn_commandreference"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_34, "CommandAttributeMsdynCommandOdataBind", {
                    get: function () { return "msdyn_Command@odata.bind"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_34, "CommandAttributeMsdynParentAlertOdataBind", {
                    get: function () { return "msdyn_ParentAlert@odata.bind"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_34, "CommandAttributeMsdynDeviceOdataBind", {
                    get: function () { return "msdyn_Device@odata.bind"; },
                    enumerable: true,
                    configurable: true
                });
                return class_34;
            }());
            Constants.EntityLogicalNames = /** @class */ (function () {
                function class_35() {
                }
                Object.defineProperty(class_35, "DeviceEntityLogicalName", {
                    get: function () { return "msdyn_iotdevice"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_35, "AlertEntityLogicalName", {
                    get: function () { return "msdyn_iotalert"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_35, "CommandEntityLogicalName", {
                    get: function () { return "msdyn_iotdevicecommand"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_35, "CommandDefinitionEntityLogicalName", {
                    get: function () { return "msdyn_iotdevicecommanddefinition"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_35, "CaseEntityLogicalName", {
                    get: function () { return "incident"; },
                    enumerable: true,
                    configurable: true
                });
                return class_35;
            }());
            Constants.PluralEntityLogicalNames = /** @class */ (function () {
                function class_36() {
                }
                Object.defineProperty(class_36, "DeviceEntityLogicalName", {
                    get: function () { return "msdyn_iotdevices"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_36, "AlertEntityLogicalName", {
                    get: function () { return "msdyn_iotalerts"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_36, "CommandEntityLogicalName", {
                    get: function () { return "msdyn_iotdevicecommands"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_36, "CommandDefinitionEntityLogicalName", {
                    get: function () { return "msdyn_iotdevicecommanddefinitions"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_36, "ConnectionRoleEntityLogicalName", {
                    get: function () { return "connectionroles"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_36, "IoTSettingsEntityLogicalName", {
                    get: function () { return "msdyn_iotsettingses"; },
                    enumerable: true,
                    configurable: true
                });
                return class_36;
            }());
            Constants.GlobalNotificationType = /** @class */ (function () {
                function class_37() {
                }
                Object.defineProperty(class_37, "Toast", {
                    get: function () { return 1; },
                    enumerable: true,
                    configurable: true
                });
                ;
                return class_37;
            }());
            Constants.GlobalNotificationLevel = /** @class */ (function () {
                function class_38() {
                }
                Object.defineProperty(class_38, "Success", {
                    get: function () { return 1; },
                    enumerable: true,
                    configurable: true
                });
                ;
                return class_38;
            }());
            Constants.ConnectDeviceDialog = /** @class */ (function () {
                function class_39() {
                }
                Object.defineProperty(class_39, "DialogName", {
                    get: function () { return "msdyn_ConnectDeviceDialog"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_39, "FieldDialogTitle", {
                    get: function () { return "lbl_connect_device_title"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_39, "FieldMsdynDevice", {
                    get: function () { return "msdyn_device"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_39, "ParamTargetEntityId", {
                    get: function () { return "param_target_entity_id"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_39, "ParamTargetEntityName", {
                    get: function () { return "param_target_entity_name"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_39, "ParamTargetPluralEntityName", {
                    get: function () { return "param_target_entity_plural_name"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_39, "ParamTargetEntityTitle", {
                    get: function () { return "param_target_entity_title"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_39, "ParamIsConnected", {
                    get: function () { return "param_is_connected"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_39, "DeviceCustomViewId", {
                    get: function () { return "{8B04357F-F848-4D16-AD47-288E51AD75E7}"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_39, "ODataRecord2IdValue", {
                    get: function () { return "record2id_" + "msdyn_iotdevice" + "@odata.bind"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_39, "ODataRecord2RoleIdValue", {
                    get: function () { return "record2roleid@odata.bind"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_39, "Record1IdValue", {
                    get: function () { return "record1id"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_39, "Record2IdValue", {
                    get: function () { return "record2id"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_39, "Record2RoleIdValue", {
                    get: function () { return "record2roleid"; },
                    enumerable: true,
                    configurable: true
                });
                return class_39;
            }());
            Constants.TabNames = /** @class */ (function () {
                function class_40() {
                }
                Object.defineProperty(class_40, "DeviceInsightsTab", {
                    get: function () { return "DeviceInsightsTab"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_40, "DeviceFormGeneralTab", {
                    get: function () { return "{1bcff70d-5615-4084-953f-2196583d6e79}"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_40, "CustomerAssetFormGeneralTab", {
                    get: function () { return "{b3f36061-1f16-4bbb-bd74-44fac42c9094}"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_40, "CustomerAssetFormMobileGeneralTab", {
                    get: function () { return "fstab_summary"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_40, "IoTAlertFormGeneralTab", {
                    get: function () { return "{b4d9bb28-1bd1-4896-aa83-a8cd2a781dde}"; },
                    enumerable: true,
                    configurable: true
                });
                return class_40;
            }());
            Constants.SectionNames = /** @class */ (function () {
                function class_41() {
                }
                Object.defineProperty(class_41, "DeviceSummaryVisualizationSection", {
                    get: function () { return "Device Summary Visualization"; },
                    enumerable: true,
                    configurable: true
                });
                return class_41;
            }());
            Constants.IoTSuggestionsDialog = /** @class */ (function () {
                function class_42() {
                }
                Object.defineProperty(class_42, "DialogName", {
                    get: function () { return "msdyn_IoTSuggestionsConfigurationDialog"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_42, "ParamIsProvisionCompleted", {
                    get: function () { return "param_isProvisionCompleted"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_42, "ErrorLabelKey", {
                    get: function () { return "@:errorWhilePerfomingActionTryAgain"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_42, "NoConfirmationDialogLabelKey", {
                    get: function () { return "@:noConfirmationDialog"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_42, "YesConfirmationDialogLabelKey", {
                    get: function () { return "@:yesConfirmationDialog"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_42, "DisableIoTSuggestionsTextLabelKey", {
                    get: function () { return "@:disableIoTSuggestionsText"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_42, "DisableIoTSuggestionsTitleLabelKey", {
                    get: function () { return "@:disableIoTSuggestionsTitle"; },
                    enumerable: true,
                    configurable: true
                });
                return class_42;
            }());
            Constants.IoTCacheKeys = /** @class */ (function () {
                function class_43() {
                }
                Object.defineProperty(class_43, "IsValidEndpoint", {
                    get: function () { return "iot_is_valid_endpoint"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_43, "IsIoTProviderInstance", {
                    get: function () { return "iot_is_iot_provider_instance"; },
                    enumerable: true,
                    configurable: true
                });
                return class_43;
            }());
            Constants.PrvReadNamesForEntities = {
                "msdyn_iotdevice": "prvReadmsdyn_iotdevice",
                "msdyn_iotalert": "prvReadmsdyn_iotalert",
                "msdyn_iotprovider": "prvReadmsdyn_iotprovider"
            };
            return Constants;
        }());
        Common.Constants = Constants;
    })(Common = CCSRef.Common || (CCSRef.Common = {}));
})(CCSRef || (CCSRef = {}));
/*! WARNING! Do not update this file manually! Manual update of this file is not supported and will likely lead to issues. In addition, future solution upgrades wont apply to manually edited files. */
/// <reference path="../Common/Constants.ts" />
var CCSRef;
(function (CCSRef) {
    var Utils;
    (function (Utils) {
        var ODataUtils = /** @class */ (function () {
            function ODataUtils() {
            }
            // Executes a CRM Request
            // httpRequest = HTTP method. Ex. "GET" or "POST"
            // crmRequest = CRM request
            // E.g.: "msdyn_RegisterIoTDevice" for a global action. 
            // E.g.: "msdyn_iotalerts(B635DCB3-4F28-E611-8106-00155DBD6A1E)/Microsoft.Dynamics.CRM.msdyn_ParentIoTAlerts" for a bound action.
            // requestParams = List of arguments for the request contained in JSON object.
            // successCallback = Method to be called on success. Takes a string argument that contains the response of the query.
            // failureCallback = Method to be called on failure. Takes a string argument that contains the response of the query.
            ODataUtils.executeRequest = function (httpRequest, crmRequest, requestParams, successCallback, failureCallback) {
                var endpoint = this.odataEndpointUrl + crmRequest;
                var request = new XMLHttpRequest();
                request.open(httpRequest, endpoint, true);
                request.setRequestHeader("Accept", "application/json");
                request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                request.setRequestHeader("OData-MaxVersion", "4.0");
                request.setRequestHeader("OData-Version", "4.0");
                var _this = this;
                request.onreadystatechange = function () {
                    // https://msdn.microsoft.com/en-us/library/gg334279.aspx describes the values.
                    if (this.readyState == 4) // On Complete.
                     {
                        request.onreadystatechange = null;
                        if (this.status == 204 || this.status == 200) {
                            if (successCallback) {
                                successCallback(_this.parseJSON(this.response));
                            }
                        }
                        else if (this.status == 403) {
                            try {
                                var parsedResponse = _this.parseJSON(this.response);
                                if (parsedResponse.error.message.includes("is missing") && parsedResponse.error.message.includes("privilege")) {
                                    console.info("logged in user doesn't have required permission on this entity");
                                    failureCallback(parsedResponse);
                                }
                                else {
                                    failureCallback(parsedResponse);
                                }
                            }
                            catch (_a) {
                                failureCallback(this.response);
                            }
                        }
                        else {
                            if (failureCallback) {
                                failureCallback(_this.parseJSON(this.response));
                            }
                        }
                    }
                };
                if (requestParams) {
                    request.send(JSON.stringify(requestParams));
                }
                else {
                    request.send();
                }
            };
            ;
            // Retrieves entities
            // oDataEntityName = the OData name of the entity
            // entityId = the Id of the entity (optional)
            // filter = query filter (optional)
            // selectFields = comma separated list of fields to retrieve, ex "name,content" (optional)
            // relatedFields = related entity fields to retrieved (optional): ex. primarycontactid($select=contactid,fullname)
            // successCallback = Method to be called on success. Takes a string argument that contains the response of the query.
            // failureCallback = Method to be called on failure. Takes a string argument that contains the response of the query.
            ODataUtils.getEntities = function (oDataEntityName, entityId, filter, selectFields, relatedFields, successCallback, failureCallback) {
                var request = this.formatRequest(oDataEntityName, entityId, filter, selectFields, relatedFields);
                this.executeRequest("GET", request, null, successCallback, failureCallback);
            };
            ;
            // Updates entities
            // oDataEntityName = the OData name of the entity
            // entityId = the Id of the entity (optional)
            // body = json payload for the patch operation
            // successCallback = Method to be called on success. Takes a string argument that contains the response of the query.
            // failureCallback = Method to be called on failure. Takes a string argument that contains the response of the query.
            ODataUtils.patchEntity = function (oDataEntityName, entityId, body, successCallback, failureCallback) {
                var request = this.formatRequest(oDataEntityName, entityId, null, null, null);
                this.executeRequest("PATCH", request, body, successCallback, failureCallback);
            };
            ;
            // Retrieves the number of entities that exist of the given type
            // oDataEntityName = the OData name of the entity
            // successCallback = Method to be called on success. Takes an integer argument that contains the response of the query.
            // failureCallback = Method to be called on failure. Takes an integer argument that contains the response of the query.
            ODataUtils.getEntityCount = function (oDataEntityName, successCallback, failureCallback) {
                var request = this.formatRequest(oDataEntityName, "", "", "", "", "$count=true");
                this.executeRequest("GET", request, null, function (result) {
                    if (result != null) {
                        successCallback(result["@odata.count"]);
                    }
                    else {
                        successCallback(0);
                    }
                }, function (err) {
                    failureCallback(err);
                });
            };
            ;
            // Formats fetchXml for CRM web API calls
            // entityName = The target entity name in CRM Odata format. Ex. accounts
            // fetch = The fetchxml
            ODataUtils.formatFetchXml = function (entityName, fetch) {
                return entityName + "?fetchXml=" + encodeURIComponent(fetch);
            };
            // Retrieves webresource
            // name = name of webresource, ex: "msdyn_/IoT/PowerBI/Scripts/ConfigData.js"
            // selectFields = comma separated list of fields to retrieve, ex "name,content" (optional)
            // successCallback = Method to be called on success. Takes a string argument that contains the response of the query.
            // failureCallback = Method to be called on failure. Takes a string argument that contains the response of the query.
            ODataUtils.getWebResource = function (name, selectFields, successCallback, failureCallback) {
                var filter = CCSRef.Common.Constants.WebResource.AttributeName + " eq '" + name + "'";
                var request = this.formatRequest(CCSRef.Common.Constants.WebResource.ODataEntityName, "", filter, selectFields, "");
                this.executeRequest("GET", request, null, successCallback, failureCallback);
            };
            // Writes the JSON object to the webresource's content (overwrites existing content)
            // id = guid id of webresource
            // jsonObject = JSON object
            // successCallback = Method to be called on success. Takes a string argument that contains the response of the query.
            // failureCallback = Method to be called on failure. Takes a string argument that contains the response of the query.
            ODataUtils.updateWebResource = function (id, jsonObject, successCallback, failureCallback) {
                var request = this.formatRequest(CCSRef.Common.Constants.WebResource.ODataEntityName, id, "", "", "");
                var webResource = {};
                webResource[CCSRef.Common.Constants.WebResource.AttributeContent] = btoa(JSON.stringify(jsonObject));
                this.executeRequest("PATCH", request, webResource, successCallback, failureCallback);
            };
            // Publishes xml changes for a webresource
            // id = the webresource guid id
            // successCallback = Method to be called on success. Takes a string argument that contains the response of the query.
            // failureCallback = Method to be called on failure. Takes a string argument that contains the response of the query.
            ODataUtils.publishXml = function (id, successCallback, failureCallback) {
                var webResourceName = CCSRef.Common.Constants.WebResource.WebResourceName;
                var webResourcesName = CCSRef.Common.Constants.WebResource.WebResourcesName;
                var parameterxml = {
                    ParameterXml: "<importexportxml><" + webResourcesName + "><" + webResourceName + ">{" + id + "}</" + webResourceName + "></" + webResourcesName + "></importexportxml>"
                };
                this.executeRequest("POST", "PublishXml", parameterxml, successCallback, failureCallback);
            };
            // Retrieves the current users roles
            // selectFields = comma separated list of fields to retrieve, ex "name,content" (optional)
            // successCallback = Method to be called on success. Takes a string argument that contains the response of the query.
            // failureCallback = Method to be called on failure. Takes a string argument that contains the response of the query.
            ODataUtils.getUserRoles = function (selectFields, successCallback, failureCallback) {
                var currentUserRoles = Xrm.Utility.getGlobalContext().userSettings.securityRoles;
                var userRoleFilter = CCSRef.Common.Constants.Role.AttributeRoleId + " eq " + currentUserRoles.join(" or " + CCSRef.Common.Constants.Role.AttributeRoleId + " eq ");
                var request = ODataUtils.formatRequest(CCSRef.Common.Constants.Role.ODataEntityName, "", userRoleFilter, selectFields, "");
                this.executeRequest("GET", request, null, successCallback, failureCallback);
            };
            // Removes the last character of a string if it is a "/"
            ODataUtils.removeTrailingSlash = function (url) {
                return url.replace(/\/$/, "");
            };
            ODataUtils.formatRequest = function (oDataEntityName, entityId, filter, selectFields, relatedFields, functions) {
                var request = entityId ? oDataEntityName + "(" + entityId + ")" : oDataEntityName;
                var params = [];
                if (filter) {
                    params.push("$filter=" + filter);
                }
                if (selectFields) {
                    params.push("$select=" + selectFields);
                }
                if (relatedFields) {
                    params.push("$expand=" + relatedFields);
                }
                if (functions) {
                    params.push(functions);
                }
                if (params.length > 0) {
                    request = request + "?" + params.join("&");
                }
                return request;
            };
            ODataUtils.parseJSON = function (json) {
                var result = null;
                if (json) {
                    try {
                        result = JSON.parse(json);
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
                return result;
            };
            ;
            ODataUtils.parentXrm = (typeof (Xrm) === "undefined") ? parent.Xrm : null;
            ODataUtils.odataEndpointUrl = (typeof (Xrm) === "undefined") ? ODataUtils.parentXrm.Page.context.getClientUrl() + '/api/data/v9.0/' : Xrm.Utility.getGlobalContext().getClientUrl() + '/api/data/v9.0/';
            return ODataUtils;
        }());
        Utils.ODataUtils = ODataUtils;
    })(Utils = CCSRef.Utils || (CCSRef.Utils = {}));
})(CCSRef || (CCSRef = {}));
/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
var CCS;
(function (CCS) {
    var Common;
    (function (Common) {
        Common.CommonParameters = {
            Error: 'Error',
            Info: 'Info',
            Marker: 'Marker',
            Warning: 'Warning',
            Source: 'Source',
            Parameters: 'Parameters',
        };
        var Telemetry = /** @class */ (function () {
            function Telemetry() {
            }
            /**
             * Set context which is included in all log output.
             * @param name name of the current context
             */
            Telemetry.setContext = function (name, prefixName) {
                Telemetry._contextName = name;
                Telemetry._prefixName = prefixName;
                Telemetry._enableConsoleLog = false;
            };
            /**
             * Log an error event
             * @param source Telemetry source
             * @param error Telemetry error
             * @param params Telemetry params
             */
            Telemetry.logError = function (source, error, params) {
                var _a;
                var errorParam;
                if (error instanceof Error) {
                    var name_1 = error.name, message = error.message;
                    errorParam = { name: name_1, message: message };
                }
                else if (typeof error === 'string') {
                    errorParam = error;
                }
                else {
                    errorParam = __assign({}, error);
                }
                var errorMarker = (_a = {},
                    _a[Common.CommonParameters.Source] = source,
                    _a[Common.CommonParameters.Error] = errorParam,
                    _a[Common.CommonParameters.Parameters] = params,
                    _a);
                Telemetry.logInternal(Common.CommonParameters.Error, errorMarker)();
            };
            /**
             * Log a warning event
             * @param source Telemetry source
             * @param warning Telemetry warning
             * @param params Telemetry params
             */
            Telemetry.logWarning = function (source, warning, params) {
                var _a;
                var warningParam;
                if (typeof warning === 'string') {
                    warningParam = warning;
                }
                else {
                    warningParam = __assign({}, warning);
                }
                var warningMarker = (_a = {},
                    _a[Common.CommonParameters.Source] = source,
                    _a[Common.CommonParameters.Warning] = warningParam,
                    _a[Common.CommonParameters.Parameters] = params,
                    _a);
                Telemetry.logInternal(Common.CommonParameters.Warning, warningMarker)();
            };
            /**
             * Log an informational event
             * @param source Telemetry source
             * @param info Telemetry informational
             * @param params Telemetry params
             */
            Telemetry.logInfo = function (source, info, params) {
                var _a;
                var infoParam;
                if (typeof info === 'string') {
                    infoParam = info;
                }
                else {
                    infoParam = __assign({}, info);
                }
                var infoMarker = (_a = {},
                    _a[Common.CommonParameters.Source] = source,
                    _a[Common.CommonParameters.Info] = infoParam,
                    _a[Common.CommonParameters.Parameters] = params,
                    _a);
                Telemetry.logInternal(Common.CommonParameters.Info, infoMarker)();
            };
            /**
             * Logs duration marker
             * @param source
             * @param params
             */
            Telemetry.startTimer = function (source, params) {
                var _a;
                var marker = (_a = {},
                    _a[Common.CommonParameters.Source] = source,
                    _a[Common.CommonParameters.Parameters] = params,
                    _a);
                return Telemetry.logInternal(Common.CommonParameters.Marker, marker);
            };
            /**
             * Internal method to log the event to UCI
             * @param name Event name
             * @param parameters Event params
             */
            Telemetry.logInternal = function (name, parameters) {
                CCS.Common.Telemetry.setContext(CCS.Common.Constants.TelemetryConstants.setContextName, CCS.Common.Constants.TelemetryConstants.setContextPrefixName);
                // Safety in case the UCI context doesn't contain telemetry
                // infrastructure.     
                if (!Xrm.Internal || !Xrm.Internal.createPerformanceStopwatch) {
                    return function () { };
                }
                if (Telemetry._enableConsoleLog && parameters) {
                    // TODO: Add Telemetry
                }
                var context = Telemetry._contextName || '';
                var fullName = Telemetry._prefixName + "." + context + "." + name;
                var stop = Xrm.Internal.createPerformanceStopwatch(fullName, parameters);
                return function (endParameters) {
                    stop(endParameters);
                };
            };
            return Telemetry;
        }());
        Common.Telemetry = Telemetry;
    })(Common = CCS.Common || (CCS.Common = {}));
})(CCS || (CCS = {}));
/*! WARNING! Do not update this file manually! Manual update of this file is not supported and will likely lead to issues. In addition, future solution upgrades wont apply to manually edited files. */
/// <reference path="Common/Constants.ts" />
/// <reference path="../../Package/IoT/CrmPackage/WebResources/msdyn_/IoT/Utils/ODataUtils.ts" />
/// <reference path="../Utils/Common/Telemetry.ts" />
var CCS;
(function (CCS) {
    var Utils;
    (function (Utils) {
        var _this = this;
        var CCSIndicatorUtils = /** @class */ (function () {
            function CCSIndicatorUtils() {
            }
            // This function determines whether or not IoT is in use by the org
            CCSIndicatorUtils.iotIsActive = function () {
                return new Promise(function (resolve, reject) {
                    var atLeastOneDeviceOrAlertExist = CCS.Utils.CCSIndicatorUtils.GetAlertDeviceExistSessionStorage();
                    if (atLeastOneDeviceOrAlertExist != null) {
                        resolve(atLeastOneDeviceOrAlertExist);
                    }
                    else {
                        CCS.Utils.CCSIndicatorUtils.checkIfIoTDeviceOrAlertFromCustomAction().then(function (hasAtLeastOne) {
                            CCS.Utils.CCSIndicatorUtils.SetAlertDeviceExistSessionStorage(hasAtLeastOne);
                            resolve(hasAtLeastOne);
                        }, function (err) {
                            CCS.Common.Telemetry.logError('CCSIndicator', 'iotIsActive', {
                                Control: CCS.Common.Constants.TelemetryConstants.ClientName,
                                Error: err
                            });
                            reject(err);
                        });
                    }
                });
            };
            ;
            // Set at least one alert or device exists flag in session storage.
            // @param value: boolean value for the flag
            CCSIndicatorUtils.SetAlertDeviceExistSessionStorage = function (value) {
                try {
                    sessionStorage.setItem(CCS.Common.Constants.IoTCacheKeys.AtLeastOneDeviceOrAlertExist, JSON.stringify(value));
                }
                catch (e) {
                    // Cannot set sessionStorage, no error to output
                }
            };
            ;
            // Get at least one alert or device exists flag from session storage.
            // @returns boolean: boolean value for the flag
            CCSIndicatorUtils.GetAlertDeviceExistSessionStorage = function () {
                return JSON.parse(sessionStorage.getItem(CCS.Common.Constants.IoTCacheKeys.AtLeastOneDeviceOrAlertExist));
            };
            ;
            // Is the current app module CustomerServiceHub
            // @returns boolean: boolean value for the flag
            CCSIndicatorUtils.isCSHApp = function () {
                return new Promise(function (resolve, reject) {
                    var globalContext = Xrm.Utility.getGlobalContext();
                    globalContext.getCurrentAppProperties().then(function (response) {
                        var appUniqueName = response.uniqueName;
                        if (appUniqueName === "Customerservicehub") {
                            resolve(true);
                        }
                        resolve(false);
                    }, function (err) {
                        CCS.Common.Telemetry.logError('CCSIndicator', 'isCSHApp', {
                            Control: CCS.Common.Constants.TelemetryConstants.ClientName,
                            Error: err
                        });
                        reject(false);
                    });
                });
            };
            ;
            CCSIndicatorUtils.getIoTDevicesFromAssetFetchXml = function (assetId) {
                var connectedDeviceRole = "{9C86F660-5F5B-E611-810B-00155DBD6A1D}";
                var fetchXml = "<fetch> " +
                    "<entity name='msdyn_iotdevice'> " + // Device.
                    "<attribute name='msdyn_iotdeviceid'/> " +
                    "<link-entity name='connection' " + // Connection.
                    "from='record2id' " +
                    "to='msdyn_iotdeviceid' " +
                    "link-type='inner' " +
                    "alias='connection'> " +
                    "<attribute name='record1id'/> " +
                    "<attribute name='record2id'/> " +
                    "<attribute name='record2roleid'/> " +
                    "</link-entity> " +
                    "<filter type='and'> " +
                    "<condition entityname='connection' " + // Filter on asset.
                    "attribute='record1id' " +
                    "operator='eq' " +
                    "value='" + assetId + "'/> " +
                    "<condition entityname='connection' " + // Filter on connected device role.
                    "attribute='record2roleid' " +
                    "operator='eq' " +
                    "value='" + connectedDeviceRole + "'/> " +
                    "</filter> " +
                    "</entity> " +
                    "</fetch>";
                return fetchXml;
            };
            CCSIndicatorUtils.getAssetsFromCaseFetchXml = function (caseId) {
                var fetchXml = "<fetch>" +
                    "<entity name='msdyn_customerasset' >" +
                    "<attribute name='msdyn_customerassetid' />" +
                    "<attribute name='msdyn_name' />" +
                    "<link-entity name='msdyn_incident_msdyn_customerasset' " +
                    "from='msdyn_customerassetid' " + " to='msdyn_customerassetid' " +
                    " link-type='inner' " +
                    " intersect='true' >" +
                    "<link-entity name='incident' " +
                    "from='incidentid' " +
                    "to='incidentid' " +
                    "link-type='inner' >" +
                    "<attribute name='accountidname' />" +
                    "<attribute name='title' />" +
                    "<filter>" +
                    "<condition attribute='incidentid' " +
                    "operator='eq' " +
                    "value='" + caseId + "' />" +
                    "</filter>" +
                    "</link-entity>" +
                    "</link-entity>" +
                    "</entity>" +
                    "</fetch>";
                return fetchXml;
            };
            CCSIndicatorUtils.shouldDeviceInsightsBeVisible = function (entityName, fetchXmlQuery) {
                return new Promise(function (resolve, reject) {
                    CCSRef.Utils.ODataUtils.executeRequest("GET", CCSRef.Utils.ODataUtils.formatFetchXml(entityName, fetchXmlQuery), "", function (deviceInsightsconfigData) {
                        var showDeviceInsightsTab = false;
                        var actionName = "";
                        var timeseriesUrl = "";
                        if (deviceInsightsconfigData && deviceInsightsconfigData.value && deviceInsightsconfigData.value[0]) {
                            actionName = deviceInsightsconfigData.value[0]["provider.msdyn_querydevicereadingsaction"] ? deviceInsightsconfigData.value[0]["provider.msdyn_querydevicereadingsaction"] : "";
                            timeseriesUrl = deviceInsightsconfigData.value[0]["providerinstance.msdyn_timeseriesinsightsurl"] ? deviceInsightsconfigData.value[0]["providerinstance.msdyn_timeseriesinsightsurl"] : "";
                            var defaultCustomActionName = CCSRef.Common.Constants.Msdyn_iotprovider.IoTHubQueryReadingsAction;
                            //If actionName is same OOB name, then ensure timeseriesUrl is populated OR
                            //If actionName populated but is not same as OOB, we dont check timeseriesUrl, but show the tab and any missing config will be handled by the 3rd party plugin code
                            if (actionName !== "" && ((actionName === defaultCustomActionName && timeseriesUrl !== "") || (actionName !== defaultCustomActionName))) {
                                showDeviceInsightsTab = true;
                            }
                        }
                        resolve(showDeviceInsightsTab);
                    }, function (err) {
                        try {
                            CCS.Common.Telemetry.logError('CCSIndicator', 'isCSHApp', {
                                Control: CCS.Common.Constants.TelemetryConstants.ClientName,
                                Error: err
                            });
                            reject(err.error.message);
                        }
                        catch (e) {
                            CCS.Common.Telemetry.logError('CCSIndicator', 'isCSHApp', {
                                Control: CCS.Common.Constants.TelemetryConstants.ClientName,
                                Error: err
                            });
                        }
                    });
                });
            };
            //FetchXml Query for Device Insights Config Information using IoTSettings
            //@returns fetchXmlquery: Query to fetch config based on iotsettings
            CCSIndicatorUtils.getDeviceInsightsConfigFromIoTSettingsFetchXml = function () {
                var fetchXmlQuery = "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
                    "<entity name='msdyn_iotsettings'>" +
                    "<attribute name = 'msdyn_defaultiotproviderinstance'/>" +
                    "<link-entity name='msdyn_iotproviderinstance' from='msdyn_iotproviderinstanceid' to='msdyn_defaultiotproviderinstance' link-type='inner' alias='providerinstance'>" +
                    "<attribute name = 'msdyn_iotproviderinstanceid'/>" +
                    "<attribute name = 'msdyn_timeseriesinsightsurl'/>" +
                    "<link-entity name = 'msdyn_iotprovider' from = 'msdyn_iotproviderid' to = 'msdyn_iotprovider' link-type='inner' alias = 'provider'>" +
                    "<attribute name = 'msdyn_querydevicereadingsaction'/>" +
                    "</link-entity>" +
                    "</link-entity>" +
                    "</entity>" +
                    "</fetch>";
                return fetchXmlQuery;
            };
            // This function determines if atleast one record exists in msdyn_iotdevice or msdyn_iotalert
            // @param successCallback Success callback function
            // @param failureCallback failure callback function
            // @returns a boolean Promise: true if atleast one record exists in msdyn_iotdevice or msdyn_iotalert, otherwise false
            CCSIndicatorUtils.checkIfIoTDeviceOrAlertFromCustomAction = function () { return __awaiter(_this, void 0, void 0, function () {
                var entitiesLogicalName, params;
                return __generator(this, function (_a) {
                    entitiesLogicalName = 'msdyn_iotdevice,msdyn_iotalert';
                    params = {
                        EntitiesLogicalNames: entitiesLogicalName
                    };
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            CCSRef.Utils.ODataUtils.executeRequest("POST", 'msdyn_IoTCheckIfRecordExistsInEntity', params, function (response) {
                                if (response && ('IsRecordExists' in response)) {
                                    var isRecordExists = response["IsRecordExists"];
                                    resolve(isRecordExists);
                                }
                                else {
                                    reject(new EvalError('ConstantErrorCodes.errorFailCallPlugin'));
                                }
                            }, function (err) {
                                reject(err.error);
                            });
                        })];
                });
            }); };
            return CCSIndicatorUtils;
        }());
        Utils.CCSIndicatorUtils = CCSIndicatorUtils;
    })(Utils = CCS.Utils || (CCS.Utils = {}));
})(CCS || (CCS = {}));
/*! WARNING! Do not update this file manually! Manual update of this file is not supported and will likely lead to issues. In addition, future solution upgrades wont apply to manually edited files. */
/// <reference path="../Utils/CCSIndicatorUtils.ts" />
/// <reference path="../Utils/Common/Constants.ts" />
/// <reference path="../../Package/IoT/CrmPackage/WebResources/msdyn_/IoT/Utils/ODataUtils.ts" />
/// <reference path="../../Package/IoT/CrmPackage/WebResources/msdyn_/IoT/Common/Constants.ts" />
/// <reference path="../Utils/Common/Telemetry.ts" />
var msdyn = msdyn || {};
msdyn.CCS = msdyn.CCS || {};
msdyn.CCS.caseQuickCreate = msdyn.CCS.caseQuickCreate || {};
msdyn.CCS.caseQuickCreate.alertFieldName = "msdyn_iotalert";
msdyn.CCS.caseQuickCreate.customerFieldName = "customerid";
msdyn.CCS.caseQuickCreate.customerEntityName = "account";
msdyn.CCS.caseQuickCreate.caseTitle = "title";
msdyn.CCS.caseQuickCreate.formContext = null;
msdyn.CCS.caseQuickCreate.onLoadQuickCreate = function (executionContext) {
    msdyn.CCS.caseQuickCreate.formContext = executionContext.getFormContext();
    // The customer account is automatically set from alert only when new case is created, and this logic is skipped if it is not a new case.
    // Get alert description and populate it in case title.
    var alertField = msdyn.CCS.caseQuickCreate.formContext.getAttribute(msdyn.CCS.caseQuickCreate.alertFieldName);
    if (msdyn.CCS.caseQuickCreate.formContext.ui.getFormType() === 1 /* Create */) {
        var alert = alertField !== null ? alertField.getValue() : null;
        msdyn.CCS.caseQuickCreate.setCustomerField(alert);
        msdyn.CCS.caseQuickCreate.setCaseTitleField(alert);
        msdyn.CCS.caseQuickCreate.setCaseOriginField(alert);
    }
    if (alertField) {
        msdyn.CCS.caseQuickCreate.displayHideIoTAlertField(alertField);
    }
};
// Show IoT Alert field if IoT is being used.
msdyn.CCS.caseQuickCreate.displayHideIoTAlertField = function (alertField) {
    if (msdyn.CCS.caseQuickCreate.formContext.data && msdyn.CCS.caseQuickCreate.formContext.data.attributes) {
        var hideAlertFieldQueryParam = msdyn.CCS.caseQuickCreate.formContext.data.attributes.getByName("CCS_hide_iot_alert");
        var hideAlertFieldAsPerQueryParams = hideAlertFieldQueryParam !== null ? hideAlertFieldQueryParam.getValue() : false;
        CCS.Utils.CCSIndicatorUtils.iotIsActive().then(function (isActive) {
            alertField.controls.forEach(function (alertControl) {
                var showAlertField = !hideAlertFieldAsPerQueryParams && isActive;
                if (alertControl) {
                    alertControl.setVisible(showAlertField);
                }
            });
        }, function (error) {
            CCS.Common.Telemetry.logError('CaseQuickCreate', 'displayHideIoTAlertField', {
                Control: CCS.Common.Constants.TelemetryConstants.ClientName,
                Error: error
            });
        });
    }
    else {
        // Hide alert field for web client
        alertField.controls.forEach(function (alertControl) {
            if (alertControl) {
                alertControl.setVisible(false);
            }
        });
    }
};
msdyn.CCS.caseQuickCreate.getAccountFromIoTDeviceFetchXml = function (alertId) {
    var fetchXml = "<fetch> " +
        "<entity name='account'> " +
        "<attribute name='accountid'/> " +
        "<attribute name='name'/> " +
        "<link-entity name = 'msdyn_iotdevice' from = 'msdyn_account' to = 'accountid' > " +
        "<link-entity name = 'msdyn_iotalert' from = 'msdyn_device' to = 'msdyn_iotdeviceid' > " +
        "<filter type='and' > " +
        "<condition attribute='msdyn_iotalertid' operator = 'eq' value = '" + alertId + "' />" +
        "</filter> " +
        "</link-entity> " +
        "</link-entity> " +
        "</entity> " +
        "</fetch>";
    return fetchXml;
};
msdyn.CCS.caseQuickCreate.getAccountFromAssetFetchXml = function (alertId) {
    var fetchXml = "<fetch> " +
        "<entity name='account'> " +
        "<attribute name='accountid'/> " +
        "<attribute name='name'/> " +
        "<link-entity name = 'msdyn_customerasset' from = 'msdyn_account' to = 'accountid' > " +
        "<link-entity name = 'msdyn_iotalert' from = 'msdyn_customerasset' to = 'msdyn_customerassetid' > " +
        "<filter type='and' > " +
        "<condition attribute='msdyn_iotalertid' operator = 'eq' value = '" + alertId + "' />" +
        "</filter> " +
        "</link-entity> " +
        "</link-entity> " +
        "</entity> " +
        "</fetch>";
    return fetchXml;
};
// Default the customer field from device.
msdyn.CCS.caseQuickCreate.setCustomerField = function (alert) {
    var self = msdyn.CCS.caseQuickCreate;
    var customerField = msdyn.CCS.caseQuickCreate.formContext.getAttribute(msdyn.CCS.caseQuickCreate.customerFieldName);
    var customer = customerField !== null ? customerField.getValue() : null;
    // If customer field is not set, default it from device account if device has account
    if (customer === null && customerField !== null) {
        if (alert !== null) {
            var alertid_1 = alert[0].id;
            Xrm.WebApi.retrieveMultipleRecords("account", "?fetchXml=" + self.getAccountFromIoTDeviceFetchXml(alertid_1)).then(function (data) {
                if (data.entities.length == 1) {
                    msdyn.CCS.caseQuickCreate.setCustomerFieldValue(data.entities, customerField);
                }
                else {
                    Xrm.WebApi.retrieveMultipleRecords("account", "?fetchXml=" + self.getAccountFromAssetFetchXml(alertid_1)).then(function (data) {
                        if (data) {
                            msdyn.CCS.caseQuickCreate.setCustomerFieldValue(data.entities, customerField);
                        }
                    }, function (err) {
                        CCS.Common.Telemetry.logInfo('CaseQuickCreate', 'setCustomerField', {
                            Control: CCS.Common.Constants.TelemetryConstants.ClientName,
                            Error: err.message
                        });
                    });
                }
            }, function (err) {
                CCS.Common.Telemetry.logInfo('CaseQuickCreate', 'setCustomerField', {
                    Control: CCS.Common.Constants.TelemetryConstants.ClientName,
                    Error: err.message
                });
            });
        }
    }
};
msdyn.CCS.caseQuickCreate.setCustomerFieldValue = function (accounts, customerField) {
    if (accounts && accounts.length > 0) {
        var accountId = accounts[0]["accountid"];
        var accountName = accounts[0]["name"];
        customerField.setValue([{
                id: accountId,
                name: accountName,
                entityType: msdyn.CCS.caseQuickCreate.customerEntityName
            }]);
    }
};
// Set case origin value to IoT
msdyn.CCS.caseQuickCreate.setCaseOriginField = function (alert) {
    if (alert !== null) {
        var caseOriginField = msdyn.CCS.caseQuickCreate.formContext.getAttribute(CCS.Common.Constants.CaseOriginConstants.CaseOriginCodeFieldName);
        if (caseOriginField !== null) {
            caseOriginField.setValue(CCS.Common.Constants.CaseOriginConstants.IotCaseOriginCodeValue);
        }
    }
};
// Set IoT alert description value to Case title field. 
msdyn.CCS.caseQuickCreate.setCaseTitleField = function (alert) {
    if (alert !== null) {
        var caseTitleField = msdyn.CCS.caseQuickCreate.formContext.getAttribute(msdyn.CCS.caseQuickCreate.caseTitle);
        var caseTitle = caseTitleField !== null ? caseTitleField.getValue() : null;
        // Check if the case title field does not have value. If yes, then pass the IoT alert value to it.
        if (caseTitle === null && caseTitleField !== null) {
            caseTitleField.setValue(alert[0].name);
        }
    }
};
