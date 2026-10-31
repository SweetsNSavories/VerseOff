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
var IoTConnector;
(function (IoTConnector) {
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
                function class_1() {
                }
                Object.defineProperty(class_1, "ODataEntityName", {
                    get: function () { return "msdyn_iotdevices"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_1, "EntityLogicalName", {
                    get: function () { return "msdyn_iotdevice"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_1, "StatusRegistered", {
                    get: function () { return "192350003"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_1, "StatusInProgress", {
                    get: function () { return "192350002"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_1, "AttributeRegistrationStatus", {
                    get: function () { return "msdyn_registrationstatus"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_1, "AttributeDeviceName", {
                    get: function () { return "msdyn_name"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_1, "AttributeDeviceId", {
                    get: function () { return "msdyn_deviceid"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_1, "AttributeEntityId", {
                    get: function () { return "msdyn_iotdeviceid"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_1, "RegisterAction", {
                    get: function () { return "msdyn_RegisterIoTDevice"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_1, "PullDataAction", {
                    get: function () { return "msdyn_PullDataForIoTDevice"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_1, "IoTHubRegisterAction", {
                    get: function () { return "msdyn_IoTHubRegisterDevice"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_1, "IoTHubPullDeviceDataAction", {
                    get: function () { return "msdyn_IoTHubPullDeviceData"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_1, "IoTRegisterActionHandler", {
                    get: function () { return "msdyn_IoTRegisterActionHandler"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_1, "IoTPullDeviceDataActionHandler", {
                    get: function () { return "msdyn_IoTPullDeviceDataActionHandler"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_1, "IoTProviderInstance", {
                    get: function () { return "msdyn_IoTProviderInstance"; },
                    enumerable: true,
                    configurable: true
                });
                return class_1;
            }());
            Constants.Msdyn_iotprovider = /** @class */ (function () {
                function class_2() {
                }
                Object.defineProperty(class_2, "EntityLogicalName", {
                    get: function () { return "msdyn_iotprovider"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_2, "AttributeId", {
                    get: function () { return "msdyn_iotproviderid"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_2, "ODataEntityName", {
                    get: function () { return "msdyn_iotproviders"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_2, "AttributeRegisterAction", {
                    get: function () { return "msdyn_registeraction"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_2, "AttributePullDeviceDataAction", {
                    get: function () { return "msdyn_pulldevicedataaction"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_2, "IoTHubQueryReadingsAction", {
                    get: function () { return "msdyn_IoTHubQueryDeviceReadings"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_2, "AttributeqQueryDeviceReadingSaction", {
                    get: function () { return "msdyn_querydevicereadingsaction"; },
                    enumerable: true,
                    configurable: true
                });
                return class_2;
            }());
            Constants.Msdyn_iotalert = /** @class */ (function () {
                function class_3() {
                }
                Object.defineProperty(class_3, "ODataEntityName", {
                    get: function () { return "msdyn_iotalerts"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_3, "EntityLogicalName", {
                    get: function () { return "msdyn_iotalert"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_3, "AttributeDeviceId", {
                    get: function () { return "msdyn_deviceid"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_3, "AttributeDevice", {
                    get: function () { return "msdyn_Device"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_3, "AttributeAlertData", {
                    get: function () { return "msdyn_alertdata"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_3, "AttributeAlertType", {
                    get: function () { return "msdyn_alerttype"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_3, "AttributeAlertToken", {
                    get: function () { return "msdyn_alerttoken"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_3, "AttributeAlertTime", {
                    get: function () { return "msdyn_alerttime"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_3, "AttributeAlertURL", {
                    get: function () { return "msdyn_alerturl"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_3, "CustomControlAlertData", {
                    get: function () { return "msdyn_alertdata1"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_3, "AttributeAlertPriorityScore", {
                    get: function () { return "msdyn_alertpriorityscore"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_3, "AttributeAlertPriority", {
                    get: function () { return "msdyn_suggestedpriority"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_3, "CalculatingPriorityValue", {
                    get: function () { return 192350000; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_3, "HighPriorityValue", {
                    get: function () { return 192350001; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_3, "LowPriorityValue", {
                    get: function () { return 192350002; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_3, "SuggestionsSection", {
                    get: function () { return "SuggestionsSection"; },
                    enumerable: true,
                    configurable: true
                });
                return class_3;
            }());
            Constants.Msdyn_iotsettings = /** @class */ (function () {
                function class_4() {
                }
                Object.defineProperty(class_4, "AttributeId", {
                    get: function () { return "76CD1AAA-0DFD-4C17-8915-9DF22EE05137"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_4, "EntityLogicalName", {
                    get: function () { return "msdyn_iotsettings"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_4, "AttributeDefaultProviderInstance", {
                    get: function () { return "msdyn_DefaultIoTProviderInstance"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_4, "AttributeDefaultProviderInstanceLogicalName", {
                    get: function () { return "msdyn_defaultiotproviderinstance"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_4, "AttributeDeploymentAppURL", {
                    get: function () { return "msdyn_deploymentappurl"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_4, "AttributeEnableIoTSuggestions", {
                    get: function () { return "msdyn_enableiotsuggestions"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_4, "ModelStatusSection", {
                    get: function () { return "ModelStatusSection"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_4, "SuggestionTab", {
                    get: function () { return "SuggestionsTab"; },
                    enumerable: true,
                    configurable: true
                });
                return class_4;
            }());
            Constants.Msdyn_iotproviderinstance = /** @class */ (function () {
                function class_5() {
                }
                Object.defineProperty(class_5, "EntityLogicalName", {
                    get: function () { return "msdyn_iotproviderinstance"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_5, "AttributeName", {
                    get: function () { return "msdyn_name"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_5, "AttributeId", {
                    get: function () { return "msdyn_iotproviderinstanceid"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_5, "AttributeTimeSeriesInsightsURL", {
                    get: function () { return "msdyn_timeseriesinsightsurl"; },
                    enumerable: true,
                    configurable: true
                });
                return class_5;
            }());
            Constants.GridIconImagePaths = /** @class */ (function () {
                function class_6() {
                }
                Object.defineProperty(class_6, "HighPriImage", {
                    get: function () { return "msdyn_/IoT/Images/SVG/IoTAlerts/HighPriIcon.svg"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_6, "EmptyImage", {
                    get: function () { return "msdyn_/IoT/Images/SVG/IoTAlerts/EmptyIcon.svg"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_6, "CalculatingImage", {
                    get: function () { return "msdyn_/IoT/Images/SVG/IoTAlerts/CalculatingIcon.svg"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_6, "ParentAlertImage", {
                    get: function () { return "msdyn_/IoT/Images/SVG/IoTAlerts/ParentAlertIcon.svg"; },
                    enumerable: true,
                    configurable: true
                });
                return class_6;
            }());
            Constants.DeviceProperty = /** @class */ (function () {
                function class_7() {
                }
                Object.defineProperty(class_7, "isTagFieldName", {
                    get: function () { return "msdyn_istag"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_7, "propertyFieldName", {
                    get: function () { return "msdyn_property"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_7, "IoTDevicePropertyEntityName", {
                    get: function () { return "msdyn_iotdeviceproperty"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_7, "IoTDeviceCategoryEntityName", {
                    get: function () { return "msdyn_iotdevicecategory"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_7, "AttributeCategory", {
                    get: function () { return "msdyn_devicecategory"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_7, "AttributeCategoryName", {
                    get: function () { return "msdyn_devicecategoryname"; },
                    enumerable: true,
                    configurable: true
                });
                return class_7;
            }());
            Constants.PropertyDefinition = /** @class */ (function () {
                function class_8() {
                }
                Object.defineProperty(class_8, "typeFieldName", {
                    get: function () { return "msdyn_type"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_8, "editableFieldName", {
                    get: function () { return "msdyn_editable"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_8, "visibleFieldName", {
                    get: function () { return "msdyn_visible"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_8, "uciPropsFieldName", {
                    get: function () { return "msdyn_additionalproperties1"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_8, "webPropsFieldName", {
                    get: function () { return "msdyn_additionalproperties"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_8, "childParamsSectionName", {
                    get: function () { return "ChildParameters"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_8, "ObjectTypeOptionSetValue", {
                    get: function () { return 192350001; },
                    enumerable: true,
                    configurable: true
                });
                return class_8;
            }());
            Constants.FieldMappingForm = /** @class */ (function () {
                function class_9() {
                }
                Object.defineProperty(class_9, "AttributeSearchType", {
                    get: function () { return "msdyn_searchtype"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_9, "AttributeDirectOrKeyPath", {
                    get: function () { return "msdyn_directpathorkeypath"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_9, "AttributeValuePath", {
                    get: function () { return "msdyn_valuepath"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_9, "AttributeFieldDataFormat", {
                    get: function () { return "msdyn_fielddataformat"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_9, "FieldDataFormatDirectValue", {
                    get: function () { return 192350000; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_9, "SearchTypeDirectPathValue", {
                    get: function () { return 192350000; },
                    enumerable: true,
                    configurable: true
                });
                return class_9;
            }());
            Constants.IoTSettingsForm = /** @class */ (function () {
                function class_10() {
                }
                Object.defineProperty(class_10, "DeviceDataPullsTab", {
                    get: function () { return "{eddc3ea8-b755-416e-8d97-c3b1fee65aad}"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_10, "DeploymentFieldValue", {
                    get: function () { return "https://iotdeployment.dynamics.com"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_10, "IoTSuggestionsSection", {
                    get: function () { return "SuggestionsSection"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_10, "AttributeEnableIoTSuggestions", {
                    get: function () { return "msdyn_enableiotsuggestions"; },
                    enumerable: true,
                    configurable: true
                });
                return class_10;
            }());
            Constants.DeviceVisualizationConfigurationForm = /** @class */ (function () {
                function class_11() {
                }
                Object.defineProperty(class_11, "OptionsetValueLatest", {
                    get: function () { return 192350002; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_11, "OptionsetValueNone", {
                    get: function () { return 192350000; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_11, "IoTDeviceCategory", {
                    get: function () { return "msdyn_iotdevicecategory"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_11, "IoTDevice", {
                    get: function () { return "msdyn_iotdevice"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_11, "AttributeName", {
                    get: function () { return "msdyn_name"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_11, "Aggregation", {
                    get: function () { return "msdyn_aggregation"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_11, "IoTTimeRangeValue", {
                    get: function () { return "msdyn_timerangevalue"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_11, "IoTTimeRangeType", {
                    get: function () { return "msdyn_timerangetype"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_11, "ConfigurationType", {
                    get: function () { return "msdyn_visualizationconfigurationtype"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_11, "Measurement", {
                    get: function () { return "msdyn_measurement"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_11, "Position", {
                    get: function () { return "msdyn_position"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_11, "ActionName", {
                    get: function () { return "msdyn_actionname"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_11, "DeviceEvent", {
                    get: function () { return "msdyn_deviceevent"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_11, "CaseAction", {
                    get: function () { return "msdyn_GetCaseAggregation"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_11, "AlertAction", {
                    get: function () { return "msdyn_GetIoTAlertAggregation"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_11, "WorkorderAction", {
                    get: function () { return "msdyn_GetWorkOrderAggregation"; },
                    enumerable: true,
                    configurable: true
                });
                return class_11;
            }());
            Constants.WebResource = /** @class */ (function () {
                function class_12() {
                }
                Object.defineProperty(class_12, "ODataEntityName", {
                    get: function () { return "webresourceset"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_12, "AttributeWebResourceId", {
                    get: function () { return "webresourceid"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_12, "AttributeName", {
                    get: function () { return "name"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_12, "AttributeContent", {
                    get: function () { return "content"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_12, "WebResourceName", {
                    get: function () { return "webresource"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_12, "WebResourcesName", {
                    get: function () { return "webresources"; },
                    enumerable: true,
                    configurable: true
                });
                return class_12;
            }());
            Constants.WelcomeDialog = /** @class */ (function () {
                function class_13() {
                }
                Object.defineProperty(class_13, "CFSDeploymentLinkText", {
                    get: function () { return "CFSDeploymentLinkText"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_13, "CFSDeploymentLinkImage", {
                    get: function () { return "CFSDeploymentLinkImage"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_13, "IoTCentralLinkText", {
                    get: function () { return "IoTCentralLinkText"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_13, "IoTCentralLinkImage", {
                    get: function () { return "IoTCentralLinkImage"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_13, "IoTSettingsId", {
                    get: function () { return "76CD1AAA-0DFD-4C17-8915-9DF22EE05137"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_13, "CFSLearnMoreUrl", {
                    get: function () { return "https://docs.microsoft.com/dynamics365/customer-engagement/field-service/connected-field-service"; },
                    enumerable: true,
                    configurable: true
                });
                return class_13;
            }());
            Constants.Connection = /** @class */ (function () {
                function class_14() {
                }
                Object.defineProperty(class_14, "EntityLogicalName", {
                    get: function () { return "connection"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_14, "ODataEntityName", {
                    get: function () { return "connections"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_14, "AttributeRecord1IdValue", {
                    get: function () { return "_record1id_value"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_14, "AttributeRecord2IdValue", {
                    get: function () { return "_record2id_value"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_14, "AttributeRecord2RoleId", {
                    get: function () { return "_record2roleid_value"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_14, "Record1IdValue", {
                    get: function () { return "record1id"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_14, "Record2IdValue", {
                    get: function () { return "record2id"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_14, "Record2RoleIdValue", {
                    get: function () { return "record2roleid"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_14, "IoTRoleId", {
                    get: function () { return "9C86F660-5F5B-E611-810B-00155DBD6A1D"; },
                    enumerable: true,
                    configurable: true
                });
                return class_14;
            }());
            Constants.Dashboard = /** @class */ (function () {
                function class_15() {
                }
                Object.defineProperty(class_15, "IoTSettingsId", {
                    get: function () { return "76CD1AAA-0DFD-4C17-8915-9DF22EE05137"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_15, "GCC", {
                    get: function () { return "crm9"; } // Flag to check for GCC region. Example of GCC org https://contoso.crm9.dynamics.com
                    ,
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_15, "USGovt", {
                    get: function () { return "us"; } // Flag to check for GCCHigh or DoD region. Example of GCC High org https://contoso.crm.microsoftdynamics.us or DoD https://contoso.crm.appsplatform.us
                    ,
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_15, "China", {
                    get: function () { return "cn"; } // Flag to check for China(MoonCake) region. Example of Mooncake org https://contoso.crm.dynamics.cn
                    ,
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_15, "USR", {
                    get: function () { return "microsoft.scloud"; } // Flag to check for USR region. Example of Mooncake org https://contoso.crm.dynamics.microsoft.scloud
                    ,
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_15, "USE", {
                    get: function () { return "eaglex.ic.gov"; } // Flag to check for USE region. Example of Mooncake org https://contoso.crm.dynamics.eaglex.ic.gov
                    ,
                    enumerable: true,
                    configurable: true
                });
                return class_15;
            }());
            Constants.Role = /** @class */ (function () {
                function class_16() {
                }
                Object.defineProperty(class_16, "ODataEntityName", {
                    get: function () { return "roles"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_16, "AttributeRoleTemplateId", {
                    get: function () { return "_roletemplateid_value"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_16, "AttributeRoleId", {
                    get: function () { return "roleid"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_16, "SystemAdminRoleTemplateId", {
                    get: function () { return "627090FF-40A3-4053-8790-584EDC5BE201"; },
                    enumerable: true,
                    configurable: true
                });
                return class_16;
            }());
            Constants.QueryString = /** @class */ (function () {
                function class_17() {
                }
                Object.defineProperty(class_17, "OrgLCID", {
                    get: function () { return "OrgLCID"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_17, "UserLCID", {
                    get: function () { return "UserLCID"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_17, "Id", {
                    get: function () { return "id"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_17, "Orgname", {
                    get: function () { return "orgname"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_17, "Type", {
                    get: function () { return "type"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_17, "Typename", {
                    get: function () { return "typename"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_17, "EntityTypename", {
                    get: function () { return "entityTypeName"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_17, "Data", {
                    get: function () { return "Data"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_17, "WebResourceId", {
                    get: function () { return "WebResourceId"; },
                    enumerable: true,
                    configurable: true
                });
                return class_17;
            }());
            Constants.Azure = /** @class */ (function () {
                function class_18() {
                }
                Object.defineProperty(class_18, "SqlTableName", {
                    get: function () { return "crmioteventsview"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_18, "SqlFieldName", {
                    get: function () { return "deviceid"; },
                    enumerable: true,
                    configurable: true
                });
                return class_18;
            }());
            Constants.FirstPartyIntegration = /** @class */ (function () {
                function class_19() {
                }
                Object.defineProperty(class_19, "Env", {
                    get: function () { return "env"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_19, "Direction", {
                    get: function () { return "direction"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_19, "Mode", {
                    get: function () { return "mode"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_19, "PowerBIUrl", {
                    get: function () { return "powerBIUrl"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_19, "LoginLabel", {
                    get: function () { return "loginLabel"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_19, "LoginText", {
                    get: function () { return "loginText"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_19, "DashboardLabel", {
                    get: function () { return "dashboardLabel"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_19, "TileLabel", {
                    get: function () { return "tileLabel"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_19, "CheckboxLabel", {
                    get: function () { return "checkboxLabel"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_19, "TIEEndpoint", {
                    get: function () { return "https://www.crmdynint-livetie.com"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_19, "INTEndpoint", {
                    get: function () { return "https://www.crmdynint-int.com"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_19, "PRODEndpoint", {
                    get: function () { return "https://www.crmdynint.com"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_19, "PowerBIRuntime", {
                    get: function () { return "/PowerBI/8.2/runtime.html"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_19, "PowerBIConfig", {
                    get: function () { return "/PowerBI/8.2/config.html"; },
                    enumerable: true,
                    configurable: true
                });
                return class_19;
            }());
            Constants.CRMHostNames = /** @class */ (function () {
                function class_20() {
                }
                Object.defineProperty(class_20, "Prod", {
                    get: function () { return "dynamics.com"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_20, "INT", {
                    get: function () { return "dynamics-int.com"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_20, "TIE", {
                    get: function () { return "crmlivetie.com"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_20, "OneBox", {
                    get: function () { return "1boxtest.com"; },
                    enumerable: true,
                    configurable: true
                });
                return class_20;
            }());
            Constants.Env = /** @class */ (function () {
                function class_21() {
                }
                Object.defineProperty(class_21, "Dev", {
                    get: function () { return "dev"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_21, "Ppe", {
                    get: function () { return "ppe"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_21, "Prod", {
                    get: function () { return "prod"; },
                    enumerable: true,
                    configurable: true
                });
                return class_21;
            }());
            Constants.ParamKeys = /** @class */ (function () {
                function class_22() {
                }
                Object.defineProperty(class_22, "tileUrl", {
                    get: function () { return "tileUrl"; },
                    enumerable: true,
                    configurable: true
                });
                return class_22;
            }());
            Constants.ConfigButtons = /** @class */ (function () {
                function class_23() {
                }
                Object.defineProperty(class_23, "SaveButton", {
                    get: function () { return "SaveButton"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_23, "CancelButton", {
                    get: function () { return "CancelButton"; },
                    enumerable: true,
                    configurable: true
                });
                return class_23;
            }());
            Constants.FormConstants = /** @class */ (function () {
                function class_24() {
                }
                Object.defineProperty(class_24, "ConnectedDeviceReadings", {
                    get: function () { return "Connected Device Readings"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_24, "Required", {
                    get: function () { return "required"; },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(class_24, "NotRequired", {
                    get: function () { return "none"; },
                    enumerable: true,
                    configurable: true
                });
                ;
                return class_24;
            }());
            Constants.PostMessageEvents = /** @class */ (function () {
                function class_25() {
                }
                Object.defineProperty(class_25, "TileClickedEvent", {
                    get: function () { return "tileClicked"; },
                    enumerable: true,
                    configurable: true
                });
                return class_25;
            }());
            Constants.MetadataDrivenDialog = /** @class */ (function () {
                function class_26() {
                }
                Object.defineProperty(class_26, "IoTPowerBIConfiguration", {
                    get: function () { return "IoTPowerBIConfiguration"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_26, "Param_PBIConfigUrl", {
                    get: function () { return "param_pbiconfigurl"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_26, "Param_PBISetUrl", {
                    get: function () { return "param_pbiseturl"; },
                    enumerable: true,
                    configurable: true
                });
                return class_26;
            }());
            Constants.WebResourceName = /** @class */ (function () {
                function class_27() {
                }
                Object.defineProperty(class_27, "ConfigData", {
                    get: function () { return "msdyn_/IoT/PowerBI/Scripts/ConfigData.js"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_27, "PowerBIConfiguration", {
                    get: function () { return "msdyn_/IoT/PowerBI/HTML/PowerBIConfiguration.html"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_27, "PowerBIConfigurationLegacy", {
                    get: function () { return "msdyn_/IoT/PowerBI/Legacy/PowerBIConfigurationLegacy.html"; },
                    enumerable: true,
                    configurable: true
                });
                return class_27;
            }());
            Constants.CommandAttributeParameters = /** @class */ (function () {
                function class_28() {
                }
                Object.defineProperty(class_28, "CommandAttributeAlertId", {
                    get: function () { return "param_msdyn_parentalert"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_28, "CommandAttributeAlertName", {
                    get: function () { return "param_msdyn_parentalertname"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_28, "CommandAttributeIoTDeviceName", {
                    get: function () { return "param_msdyn_devicename"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_28, "CommandAttributeIoTDeviceId", {
                    get: function () { return "param_msdyn_device"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_28, "CommandAttributeParentEntityId", {
                    get: function () { return "param_msdyn_parententityid"; },
                    enumerable: true,
                    configurable: true
                });
                return class_28;
            }());
            Constants.CommandMFDParameters = /** @class */ (function () {
                function class_29() {
                }
                Object.defineProperty(class_29, "CommandAttributeIsMFD", {
                    get: function () { return "param_msdyn_isMfd"; },
                    enumerable: true,
                    configurable: true
                });
                return class_29;
            }());
            Constants.CommandViewAttributes = /** @class */ (function () {
                function class_30() {
                }
                Object.defineProperty(class_30, "CommandAttributeMsdynParentAlert", {
                    get: function () { return "msdyn_parentalert"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_30, "CommandAttributeMsdynParentAlertName", {
                    get: function () { return "msdyn_parentalertname"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_30, "CommandAttributeMsdynDevice", {
                    get: function () { return "msdyn_device"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_30, "CommandAttributeMsdynDeviceName", {
                    get: function () { return "msdyn_devicename"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_30, "CommandAttributeMsdynDeviceId", {
                    get: function () { return "msdyn_deviceid"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_30, "CommandAttributeMsdynMessage", {
                    get: function () { return "msdyn_message"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_30, "CommandAttributeMsdynName", {
                    get: function () { return "msdyn_name"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_30, "CommandAttributeMsdynCommand", {
                    get: function () { return "msdyn_command"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_30, "CommandAttributeMsdynCommandReference", {
                    get: function () { return "msdyn_commandreference"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_30, "CommandAttributeMsdynCommandOdataBind", {
                    get: function () { return "msdyn_Command@odata.bind"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_30, "CommandAttributeMsdynParentAlertOdataBind", {
                    get: function () { return "msdyn_ParentAlert@odata.bind"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_30, "CommandAttributeMsdynDeviceOdataBind", {
                    get: function () { return "msdyn_Device@odata.bind"; },
                    enumerable: true,
                    configurable: true
                });
                return class_30;
            }());
            Constants.EntityLogicalNames = /** @class */ (function () {
                function class_31() {
                }
                Object.defineProperty(class_31, "DeviceEntityLogicalName", {
                    get: function () { return "msdyn_iotdevice"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_31, "AlertEntityLogicalName", {
                    get: function () { return "msdyn_iotalert"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_31, "CommandEntityLogicalName", {
                    get: function () { return "msdyn_iotdevicecommand"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_31, "CommandDefinitionEntityLogicalName", {
                    get: function () { return "msdyn_iotdevicecommanddefinition"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_31, "CaseEntityLogicalName", {
                    get: function () { return "incident"; },
                    enumerable: true,
                    configurable: true
                });
                return class_31;
            }());
            Constants.PluralEntityLogicalNames = /** @class */ (function () {
                function class_32() {
                }
                Object.defineProperty(class_32, "DeviceEntityLogicalName", {
                    get: function () { return "msdyn_iotdevices"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_32, "AlertEntityLogicalName", {
                    get: function () { return "msdyn_iotalerts"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_32, "CommandEntityLogicalName", {
                    get: function () { return "msdyn_iotdevicecommands"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_32, "CommandDefinitionEntityLogicalName", {
                    get: function () { return "msdyn_iotdevicecommanddefinitions"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_32, "ConnectionRoleEntityLogicalName", {
                    get: function () { return "connectionroles"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_32, "IoTSettingsEntityLogicalName", {
                    get: function () { return "msdyn_iotsettingses"; },
                    enumerable: true,
                    configurable: true
                });
                return class_32;
            }());
            Constants.GlobalNotificationType = /** @class */ (function () {
                function class_33() {
                }
                Object.defineProperty(class_33, "Toast", {
                    get: function () { return 1; },
                    enumerable: true,
                    configurable: true
                });
                ;
                return class_33;
            }());
            Constants.GlobalNotificationLevel = /** @class */ (function () {
                function class_34() {
                }
                Object.defineProperty(class_34, "Success", {
                    get: function () { return 1; },
                    enumerable: true,
                    configurable: true
                });
                ;
                return class_34;
            }());
            Constants.ConnectDeviceDialog = /** @class */ (function () {
                function class_35() {
                }
                Object.defineProperty(class_35, "DialogName", {
                    get: function () { return "msdyn_ConnectDeviceDialog"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_35, "FieldDialogTitle", {
                    get: function () { return "lbl_connect_device_title"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_35, "FieldMsdynDevice", {
                    get: function () { return "msdyn_device"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_35, "ParamTargetEntityId", {
                    get: function () { return "param_target_entity_id"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_35, "ParamTargetEntityName", {
                    get: function () { return "param_target_entity_name"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_35, "ParamTargetPluralEntityName", {
                    get: function () { return "param_target_entity_plural_name"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_35, "ParamTargetEntityTitle", {
                    get: function () { return "param_target_entity_title"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_35, "ParamIsConnected", {
                    get: function () { return "param_is_connected"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_35, "DeviceCustomViewId", {
                    get: function () { return "{8B04357F-F848-4D16-AD47-288E51AD75E7}"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_35, "ODataRecord2IdValue", {
                    get: function () { return "record2id_" + "msdyn_iotdevice" + "@odata.bind"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_35, "ODataRecord2RoleIdValue", {
                    get: function () { return "record2roleid@odata.bind"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_35, "Record1IdValue", {
                    get: function () { return "record1id"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_35, "Record2IdValue", {
                    get: function () { return "record2id"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_35, "Record2RoleIdValue", {
                    get: function () { return "record2roleid"; },
                    enumerable: true,
                    configurable: true
                });
                return class_35;
            }());
            Constants.TabNames = /** @class */ (function () {
                function class_36() {
                }
                Object.defineProperty(class_36, "DeviceInsightsTab", {
                    get: function () { return "DeviceInsightsTab"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_36, "DeviceFormGeneralTab", {
                    get: function () { return "{1bcff70d-5615-4084-953f-2196583d6e79}"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_36, "CustomerAssetFormGeneralTab", {
                    get: function () { return "{b3f36061-1f16-4bbb-bd74-44fac42c9094}"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_36, "CustomerAssetFormMobileGeneralTab", {
                    get: function () { return "fstab_summary"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_36, "IoTAlertFormGeneralTab", {
                    get: function () { return "{b4d9bb28-1bd1-4896-aa83-a8cd2a781dde}"; },
                    enumerable: true,
                    configurable: true
                });
                return class_36;
            }());
            Constants.SectionNames = /** @class */ (function () {
                function class_37() {
                }
                Object.defineProperty(class_37, "DeviceSummaryVisualizationSection", {
                    get: function () { return "Device Summary Visualization"; },
                    enumerable: true,
                    configurable: true
                });
                return class_37;
            }());
            Constants.IoTSuggestionsDialog = /** @class */ (function () {
                function class_38() {
                }
                Object.defineProperty(class_38, "DialogName", {
                    get: function () { return "msdyn_IoTSuggestionsConfigurationDialog"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_38, "ParamIsProvisionCompleted", {
                    get: function () { return "param_isProvisionCompleted"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_38, "ErrorLabelKey", {
                    get: function () { return "@:errorWhilePerfomingActionTryAgain"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_38, "NoConfirmationDialogLabelKey", {
                    get: function () { return "@:noConfirmationDialog"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_38, "YesConfirmationDialogLabelKey", {
                    get: function () { return "@:yesConfirmationDialog"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_38, "DisableIoTSuggestionsTextLabelKey", {
                    get: function () { return "@:disableIoTSuggestionsText"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_38, "DisableIoTSuggestionsTitleLabelKey", {
                    get: function () { return "@:disableIoTSuggestionsTitle"; },
                    enumerable: true,
                    configurable: true
                });
                return class_38;
            }());
            Constants.IoTCacheKeys = /** @class */ (function () {
                function class_39() {
                }
                Object.defineProperty(class_39, "IsValidEndpoint", {
                    get: function () { return "iot_is_valid_endpoint"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(class_39, "IsIoTProviderInstance", {
                    get: function () { return "iot_is_iot_provider_instance"; },
                    enumerable: true,
                    configurable: true
                });
                return class_39;
            }());
            Constants.PrvReadNamesForEntities = {
                "msdyn_iotdevice": "prvReadmsdyn_iotdevice",
                "msdyn_iotalert": "prvReadmsdyn_iotalert",
                "msdyn_iotprovider": "prvReadmsdyn_iotprovider"
            };
            return Constants;
        }());
        Common.Constants = Constants;
    })(Common = IoTConnector.Common || (IoTConnector.Common = {}));
})(IoTConnector || (IoTConnector = {}));
var IoTConnector;
(function (IoTConnector) {
    var ApiUtils;
    (function (ApiUtils) {
        var ErrorTypes;
        (function (ErrorTypes) {
            ErrorTypes[ErrorTypes["Null"] = 0] = "Null";
        })(ErrorTypes = ApiUtils.ErrorTypes || (ApiUtils.ErrorTypes = {}));
        ApiUtils.ClientMode = {
            Outlook: "Outlook",
            Web: "Web",
            Mobile: "Mobile"
        };
        ApiUtils.ClientState = {
            Online: "Online",
            Offline: "Offline"
        };
        var CrmVersion;
        (function (CrmVersion) {
            CrmVersion[CrmVersion["CRM2011"] = 5] = "CRM2011";
            CrmVersion[CrmVersion["CRM2013"] = 6] = "CRM2013";
            CrmVersion[CrmVersion["CRM2015"] = 7] = "CRM2015";
        })(CrmVersion = ApiUtils.CrmVersion || (ApiUtils.CrmVersion = {}));
    })(ApiUtils = IoTConnector.ApiUtils || (IoTConnector.ApiUtils = {}));
})(IoTConnector || (IoTConnector = {}));
/// <reference path="../../../../../../../IoT/CrmPackage/Scripts/typings/IoT/Libes6/lib.es6.d.ts" />
/// <reference path="../../Utils/ApiUtils/WebApiSDK.ts" />
/// <reference path="Types.ts" />
var IoTConnector;
(function (IoTConnector) {
    var ApiUtils;
    (function (ApiUtils) {
        function IsNotNullAndUndefined(value) {
            return typeof (value) !== "undefined" && value !== null;
        }
        ApiUtils.IsNotNullAndUndefined = IsNotNullAndUndefined;
        function GetGlobalContext() {
            return Xrm.Utility.getGlobalContext();
        }
        ApiUtils.GetGlobalContext = GetGlobalContext;
        function GetClient() {
            var context = GetGlobalContext();
            return context.client.getClient();
        }
        ApiUtils.GetClient = GetClient;
        function GetClientState() {
            var context = GetGlobalContext();
            return context.client.getClientState();
        }
        ApiUtils.GetClientState = GetClientState;
        function isOutlookOffline() {
            return isOutlook() && GetClientState() == ApiUtils.ClientState.Offline;
        }
        ApiUtils.isOutlookOffline = isOutlookOffline;
        function isMobileClientOffline() {
            return GetClientState() == ApiUtils.ClientState.Offline;
        }
        ApiUtils.isMobileClientOffline = isMobileClientOffline;
        function isOutlook() {
            return GetClient() == ApiUtils.ClientMode.Outlook;
        }
        ApiUtils.isOutlook = isOutlook;
        function IsMobile() {
            return GetClient() == ApiUtils.ClientMode.Mobile;
        }
        ApiUtils.IsMobile = IsMobile;
        function OutputError(objectName, errorType) {
            var result = "";
            switch (errorType) {
                case ApiUtils.ErrorTypes.Null: {
                    result = objectName + " is null";
                    break;
                }
            }
            LogMessageInConsole(result);
        }
        ApiUtils.OutputError = OutputError;
        function GetCrmMajorVersion() {
            var majorVersion = '';
            var globalContext = Xrm.Utility.getGlobalContext();
            if (globalContext) {
                var version = globalContext.getVersion();
                if (version) {
                    majorVersion = version.substr(0, 1);
                }
            }
            return majorVersion;
        }
        ApiUtils.GetCrmMajorVersion = GetCrmMajorVersion;
        function GetCrmMajorMinorVersion() {
            var result = '';
            var globalContext = Xrm.Utility.getGlobalContext();
            if (globalContext) {
                var version = globalContext.getVersion();
                if (version) {
                    var versions = version.split('.');
                    if (versions.length >= 2) {
                        result = versions[0] + "." + versions[1];
                    }
                }
            }
            return result;
        }
        ApiUtils.GetCrmMajorMinorVersion = GetCrmMajorMinorVersion;
        function verifyCrmMinimumVersion(minimumVersion) {
            return GetCrmMajorVersion() >= minimumVersion;
        }
        ApiUtils.verifyCrmMinimumVersion = verifyCrmMinimumVersion;
        function GetUserLcid() {
            return GetGlobalContext().getUserLcid();
        }
        ApiUtils.GetUserLcid = GetUserLcid;
        ;
        // Get the Current App Module Unique Name where user is in
        function GetAppModuleUniqueName() {
            return __awaiter(this, void 0, void 0, function () {
                var globalContext;
                return __generator(this, function (_a) {
                    globalContext = GetGlobalContext();
                    return [2 /*return*/, globalContext.getCurrentAppProperties().then(function (appProperties) {
                            var appUniqueName;
                            if (appProperties) {
                                appUniqueName = appProperties["uniqueName"];
                            }
                            return appUniqueName;
                        }, function (error) { LogMessageInConsole(error); })];
                });
            });
        }
        ApiUtils.GetAppModuleUniqueName = GetAppModuleUniqueName;
        ;
        function LogMessageInConsole(message) {
            if (IsNotNullAndUndefined(console) && IsNotNullAndUndefined(console.log)) {
                console.log(message);
            }
        }
        ApiUtils.LogMessageInConsole = LogMessageInConsole;
        ;
        function WarnMessageInConsole(message) {
            if (IsNotNullAndUndefined(console) && IsNotNullAndUndefined(console.warn)) {
                console.warn(message);
            }
        }
        ApiUtils.WarnMessageInConsole = WarnMessageInConsole;
        ;
        function GetODataAttribute(entityLogicalName, attributeName, forOffline) {
            if (IoTConnector.ApiUtils.CrudApiSDK.isOffline(entityLogicalName) || (forOffline == true && IoTConnector.ApiUtils.isMobileClientOffline())) {
                return attributeName;
            }
            return '_' + attributeName + '_value';
        }
        ApiUtils.GetODataAttribute = GetODataAttribute;
        ;
        function ErrorMessageInConsole(message) {
            if (IsNotNullAndUndefined(console) && IsNotNullAndUndefined(console.error)) {
                console.error(message);
            }
        }
        ApiUtils.ErrorMessageInConsole = ErrorMessageInConsole;
        ;
    })(ApiUtils = IoTConnector.ApiUtils || (IoTConnector.ApiUtils = {}));
})(IoTConnector || (IoTConnector = {}));
/// <reference path="../../../../../Scripts/typings/IoT/Localization/Localization.d.ts"/>
/// <reference path="Common.ts"/>
/// <reference path="Types.ts" />
var IoTConnector;
(function (IoTConnector) {
    var ApiUtils;
    (function (ApiUtils) {
        var Fields;
        (function (Fields) {
            function GetField(formContext, field) {
                if (field) {
                    return formContext.getAttribute(field);
                }
                else {
                    return null;
                }
            }
            Fields.GetField = GetField;
            function GetEntityAttribute(formContext, field) {
                if (field) {
                    return formContext.getAttribute(field);
                }
                else {
                    return null;
                }
            }
            Fields.GetEntityAttribute = GetEntityAttribute;
            /**
             * Gets all entity attributes on the form
             * @param formContext Form context
             * @returns a collection of entity attributes
             */
            function GetEntityAttributes(formContext) {
                var attributes = null;
                if (formContext && formContext.data && formContext.data.entity) {
                    attributes = formContext.data.entity.attributes;
                }
                return attributes;
            }
            Fields.GetEntityAttributes = GetEntityAttributes;
            /**
             * this function will check if the passed field is present in the form and accordingly returns true/false
             * @param formContext
             * @param field
             */
            function IsFormControlPresentForField(formContext, field) {
                return ApiUtils.IsNotNullAndUndefined(formContext) && ApiUtils.IsNotNullAndUndefined(Fields.GetControl(formContext, field));
            }
            Fields.IsFormControlPresentForField = IsFormControlPresentForField;
            function GetControl(formContext, field) {
                var controls = formContext.ui.controls;
                return controls.get(field) ||
                    controls.get("header_" + field) ||
                    controls.get("header_process_" + field);
            }
            Fields.GetControl = GetControl;
            function ClearLookup(formContext, field) {
                this.SetValue(formContext, field, null);
            }
            Fields.ClearLookup = ClearLookup;
            function PublishEmptyLookUp(formContext, field) {
                this.SetValue(formContext, field, null);
                Fields.FireOnChange(formContext, field);
            }
            Fields.PublishEmptyLookUp = PublishEmptyLookUp;
            function SetRequired(formContext, field, required) {
                var fieldObject = Fields.GetField(formContext, field);
                if (fieldObject && fieldObject.setRequiredLevel) {
                    switch (required.toString()) {
                        case "true":
                            fieldObject.setRequiredLevel("required");
                            break;
                        case "false":
                            fieldObject.setRequiredLevel("none");
                            break;
                        default:
                            fieldObject.setRequiredLevel("recommended");
                            break;
                    }
                    if (required == false && ApiUtils.verifyCrmMinimumVersion(ApiUtils.CrmVersion.CRM2013)) {
                        Fields.ClearNotifications(formContext, field);
                    }
                }
                else {
                    ApiUtils.OutputError(field, ApiUtils.ErrorTypes.Null);
                }
            }
            Fields.SetRequired = SetRequired;
            /**
             * Set the required level as required if it is required, or set as
             * recommended if it is not required and clear any notifications.
             * @param formContext context of the current page
             * @param fieldName name of the field to be updated
             * @param isRequired sets to recommended if false
             */
            function SetRequiredOrRecommended(formContext, fieldName, isRequired) {
                var fields = Fields;
                var field = fields.GetField(formContext, fieldName);
                if (!field || !field.setRequiredLevel) {
                    ApiUtils.OutputError(fieldName, ApiUtils.ErrorTypes.Null);
                    return;
                }
                if (isRequired) {
                    field.setRequiredLevel("required");
                }
                else {
                    field.setRequiredLevel("recommended");
                    if (fields.IsEmpty(formContext, fieldName)) {
                        field.setValue(null); // reset "is required" notifications
                    }
                    fields.ClearNotifications(formContext, fieldName);
                }
            }
            Fields.SetRequiredOrRecommended = SetRequiredOrRecommended;
            /**
             * Sets field notification
             *
             * @param formContext       context of the current page
             * @param fieldName         name of the field
             * @param localizedStringId the localized string id of the notification message. Also, this is used as the uniqueId of the notification
             */
            function SetNotification(formContext, fieldName, localizedStringId) {
                var fieldControl = Fields.GetControl(formContext, fieldName);
                if (fieldControl) {
                    fieldControl.setNotification(IoTConnector.Localization.Localization.localize(localizedStringId), localizedStringId);
                }
                else {
                    ApiUtils.OutputError(fieldName, ApiUtils.ErrorTypes.Null);
                }
            }
            Fields.SetNotification = SetNotification;
            /**
            * Sets the attribute validity and a notification message.
            * @param formContext       context of the current page
            * @param fieldName         name of the field
            * @param isValid Sets the attribute validity
            * @param localizedStringId Message to be shown
            */
            function SetIsValid(formContext, fieldName, isValid, localizedStringId) {
                var fieldAttribute = formContext.getAttribute(fieldName);
                if (fieldAttribute) {
                    var defaultBlockSaveMessage = fieldName; // Default message
                    if (!isValid) { // setting to block save
                        if (ApiUtils.IsNotNullAndUndefined(localizedStringId)) {
                            defaultBlockSaveMessage = IoTConnector.Localization.Localization.localize(localizedStringId);
                        }
                        else {
                            ApiUtils.LogMessageInConsole("localizedStringId must not be null when setting setIsValid to false for '" + fieldName + "'");
                        }
                    }
                    fieldAttribute.setIsValid(isValid, defaultBlockSaveMessage);
                }
            }
            Fields.SetIsValid = SetIsValid;
            function ClearNotifications(formContext, field) {
                var fieldControl = Fields.GetControl(formContext, field);
                if (fieldControl) {
                    if (fieldControl.clearNotification) {
                        fieldControl.clearNotification();
                    }
                    if (fieldControl.clearValidation) {
                        fieldControl.clearValidation();
                    }
                }
                else {
                    ApiUtils.OutputError(field, ApiUtils.ErrorTypes.Null);
                }
            }
            Fields.ClearNotifications = ClearNotifications;
            function GetType(formContext, field) {
                var fieldObject = Fields.GetField(formContext, field);
                if (fieldObject && fieldObject.getAttributeType) {
                    return fieldObject.getAttributeType();
                }
                else {
                    ApiUtils.OutputError(field, ApiUtils.ErrorTypes.Null);
                }
            }
            Fields.GetType = GetType;
            function GetText(formContext, field) {
                var fieldObject = Fields.GetField(formContext, field);
                if (fieldObject && fieldObject.getText) {
                    return fieldObject.getText();
                }
                else {
                    ApiUtils.OutputError(field, ApiUtils.ErrorTypes.Null);
                }
            }
            Fields.GetText = GetText;
            function GetValue(formContext, field) {
                var fieldObject = Fields.GetField(formContext, field);
                var controlIsValid = true;
                if (ApiUtils.verifyCrmMinimumVersion(ApiUtils.CrmVersion.CRM2013)) {
                    var fieldControl = Fields.GetControl(formContext, field);
                    controlIsValid = fieldControl && fieldControl.get_isValid ? fieldControl.get_isValid() : true;
                }
                if (fieldObject && fieldObject.getValue) {
                    var returnValue = controlIsValid ? fieldObject.getValue() : null;
                    //Object is returning null array when we used "Remove Value" from lookup.
                    if (returnValue != null && returnValue.length == 0)
                        returnValue = null;
                    //typename is no longer available in CRM 7.1.
                    //trying to recreate the typename from entityType
                    if (returnValue != null && fieldObject.getAttributeType() == "lookup") {
                        var _entity = returnValue[0];
                        if ((typeof (_entity.typename) == "undefined" || _entity.typename == null) &&
                            typeof (_entity.entityType) != "undefined" && _entity.entityType != null) {
                            returnValue[0].typename = returnValue[0].entityType;
                        }
                    }
                    return returnValue;
                }
                else {
                    ApiUtils.OutputError(field, ApiUtils.ErrorTypes.Null);
                }
            }
            Fields.GetValue = GetValue;
            function GetInitialValue(formContext, field) {
                var fieldObject = Fields.GetField(formContext, field);
                if (fieldObject && fieldObject.getInitialValue) {
                    return fieldObject.getInitialValue();
                }
                else {
                    ApiUtils.OutputError(field, ApiUtils.ErrorTypes.Null);
                }
            }
            Fields.GetInitialValue = GetInitialValue;
            function GetMaxValue(formContext, field) {
                var fieldObject = Fields.GetField(formContext, field);
                if (fieldObject && fieldObject.getMax) {
                    return fieldObject.getMax();
                }
                else {
                    ApiUtils.OutputError(field, ApiUtils.ErrorTypes.Null);
                }
            }
            Fields.GetMaxValue = GetMaxValue;
            function GetSelectedOption(formContext, field) {
                var fieldObject = Fields.GetField(formContext, field);
                if (fieldObject && fieldObject.getSelectedOption) {
                    return fieldObject.getSelectedOption();
                }
                else {
                    ApiUtils.OutputError(field, ApiUtils.ErrorTypes.Null);
                }
            }
            Fields.GetSelectedOption = GetSelectedOption;
            function SetValue(formContext, field, value) {
                var fieldObject = Fields.GetField(formContext, field);
                var fieldObjectValue = Fields.GetValue(formContext, field);
                var UpdateField = false;
                if (fieldObjectValue == null && value == null)
                    UpdateField = false;
                else if (fieldObjectValue == null)
                    UpdateField = true;
                else if (value == null)
                    UpdateField = true;
                else if (fieldObjectValue !== value)
                    UpdateField = true;
                if (UpdateField == true) {
                    if (fieldObject && fieldObject.setValue) {
                        fieldObject.setValue(value);
                        if (Fields.GetDisabled(formContext, field)) {
                            Fields.SetSubmitMode(formContext, field, 'always');
                        }
                    }
                    else {
                        ApiUtils.OutputError(field, ApiUtils.ErrorTypes.Null);
                    }
                }
            }
            Fields.SetValue = SetValue;
            function PublishValue(formContext, field, value) {
                SetValue(formContext, field, value);
                FireOnChange(formContext, field);
            }
            Fields.PublishValue = PublishValue;
            function SetLookUp(formContext, fieldName, entityLogicalName, idOrObject, name) {
                var nameIsNullOrUndefined = name === null || typeof name === "undefined";
                if (idOrObject !== null && !nameIsNullOrUndefined && idOrObject.length > 0) {
                    Fields.SetLookUpValue(formContext, fieldName, idOrObject, name, entityLogicalName);
                }
                else if (idOrObject !== null && nameIsNullOrUndefined && typeof idOrObject.Id !== "undefined" && idOrObject.Id !== null) {
                    Fields.SetLookUpValue(formContext, fieldName, idOrObject.Id, idOrObject.Name, idOrObject.LogicalName);
                }
                else if (idOrObject !== null && nameIsNullOrUndefined && idOrObject.length > 0 && idOrObject[0] !== null && idOrObject[0].id !== null) {
                    Fields.SetLookUpValue(formContext, fieldName, idOrObject[0].id, idOrObject[0].name, idOrObject[0].typename);
                }
                else {
                    Fields.SetValue(formContext, fieldName, null);
                }
            }
            Fields.SetLookUp = SetLookUp;
            function SetLookUpValue(formContext, field, id, name, entityType, keyValues, values) {
                var fieldObject = Fields.GetField(formContext, field);
                var fieldObjectValue = Fields.GetValue(formContext, field);
                var UpdateField = false;
                if (fieldObjectValue == null && id == null)
                    UpdateField = false;
                else if (fieldObjectValue == null)
                    UpdateField = true;
                else if (fieldObjectValue != null && id != null && fieldObjectValue[0].id.replace(/\{|\}/gi, '').toLowerCase() != id.replace(/\{|\}/gi, '').toLowerCase())
                    UpdateField = true;
                if (UpdateField == true) {
                    if (fieldObject && fieldObject.setValue) {
                        if (id.indexOf('{') == -1 && id.indexOf('}') == -1) {
                            id = '{' + id + '}';
                        }
                        id = id.toUpperCase();
                        var lookup = new Array();
                        lookup[0] = {};
                        lookup[0].id = id;
                        lookup[0].name = name;
                        lookup[0].entityType = entityType;
                        lookup[0].keyValues = keyValues;
                        lookup[0].values = values;
                        fieldObject.setValue(lookup);
                    }
                    else {
                        ApiUtils.OutputError(field, ApiUtils.ErrorTypes.Null);
                    }
                }
            }
            Fields.SetLookUpValue = SetLookUpValue;
            function PublishLookUpValue(formContext, field, id, name, entityType, keyValues, values) {
                Fields.SetLookUpValue(formContext, field, id, name, entityType, keyValues, values);
                Fields.FireOnChange(formContext, field);
            }
            Fields.PublishLookUpValue = PublishLookUpValue;
            /**
             * If the value of field is null or, if it is string, empty/all whitespace
             * @param field
             */
            function IsEmpty(formContext, field) {
                var value = Fields.GetValue(formContext, field);
                return !value || (typeof value == 'string' && value.trim().length == 0);
            }
            Fields.IsEmpty = IsEmpty;
            function IsDirty(formContext, field) {
                var attribute = Fields.GetEntityAttribute(formContext, field);
                if (attribute && attribute.getIsDirty) {
                    return attribute.getIsDirty();
                }
                else {
                    ApiUtils.OutputError(field, ApiUtils.ErrorTypes.Null);
                }
            }
            Fields.IsDirty = IsDirty;
            function DisableField(formContext, field) {
                Fields.SetDisabled(formContext, field, true);
            }
            Fields.DisableField = DisableField;
            function SetDisabled(formContext, field, action) {
                var controlObject = formContext.getControl(field);
                if (controlObject && controlObject.setDisabled) {
                    controlObject.setDisabled(action);
                    var mode = null;
                    if (!action) {
                        mode = 'dirty';
                    }
                    else if (Fields.IsDirty(formContext, field)) {
                        mode = 'always';
                    }
                    Fields.SetSubmitMode(formContext, field, mode);
                }
                else {
                    ApiUtils.OutputError(field, ApiUtils.ErrorTypes.Null);
                }
            }
            Fields.SetDisabled = SetDisabled;
            function GetDisabled(formContext, field) {
                var controlObject = formContext.getControl(field);
                if (controlObject && controlObject.getDisabled) {
                    return controlObject.getDisabled();
                }
                else {
                    ApiUtils.OutputError(field, ApiUtils.ErrorTypes.Null);
                }
            }
            Fields.GetDisabled = GetDisabled;
            function AddOnChange(formContext, field, functionName) {
                var attribute = Fields.GetEntityAttribute(formContext, field);
                // since the API doesn't support checking that a handle is already subscribed
                // for preventing double subscribing - remove previous at first
                if (attribute && attribute.addOnChange) {
                    if (attribute.removeOnChange) {
                        attribute.removeOnChange(functionName);
                    }
                    return attribute.addOnChange(functionName);
                }
                else {
                    ApiUtils.OutputError(field, ApiUtils.ErrorTypes.Null);
                }
            }
            Fields.AddOnChange = AddOnChange;
            function RemoveOnChange(formContext, field, functionName) {
                var attribute = Fields.GetEntityAttribute(formContext, field);
                if (attribute && attribute.removeOnChange) {
                    return attribute.removeOnChange(functionName);
                }
                else {
                    ApiUtils.OutputError(field, ApiUtils.ErrorTypes.Null);
                }
            }
            Fields.RemoveOnChange = RemoveOnChange;
            function FireOnChange(formContext, field) {
                var fieldObject = Fields.GetEntityAttribute(formContext, field);
                if (fieldObject && fieldObject.fireOnChange) {
                    return fieldObject.fireOnChange();
                }
                else {
                    ApiUtils.OutputError(field, ApiUtils.ErrorTypes.Null);
                }
            }
            Fields.FireOnChange = FireOnChange;
            function AddOnSave(formContext, functionName) {
                try {
                    // In some cases, like after a create, the onSave can be added more than once. 
                    // This can lead to loops and performance degradation.
                    // By proactively removing the event before adding, it ensures there is only one from this add action
                    formContext.data.entity.removeOnSave(functionName);
                }
                catch (ex) {
                    // Should never hit this, but adding the warning just in case
                    ApiUtils.WarnMessageInConsole("OnSave event not properly removed: " + ex);
                }
                return formContext.data.entity.addOnSave(functionName);
            }
            Fields.AddOnSave = AddOnSave;
            function SetSubmitMode(formContext, field, mode) {
                var fieldObject = Fields.GetField(formContext, field);
                if (fieldObject && fieldObject.setSubmitMode && mode && mode.length > 0) {
                    fieldObject.setSubmitMode(mode);
                }
                else {
                    ApiUtils.OutputError(field, ApiUtils.ErrorTypes.Null);
                }
            }
            Fields.SetSubmitMode = SetSubmitMode;
            function GetOption(formContext, field, value) {
                var fieldObject = Fields.GetField(formContext, field);
                if (fieldObject && fieldObject.getOption) {
                    return fieldObject.getOption(value);
                }
                else {
                    ApiUtils.OutputError(field, ApiUtils.ErrorTypes.Null);
                }
            }
            Fields.GetOption = GetOption;
            function GetOptions(formContext, field) {
                var fieldObject = Fields.GetField(formContext, field);
                if (fieldObject && fieldObject.getOptions) {
                    return fieldObject.getOptions();
                }
                else {
                    ApiUtils.OutputError(field, ApiUtils.ErrorTypes.Null);
                }
            }
            Fields.GetOptions = GetOptions;
            function GetLookupFieldValue(formContext, attributeName) {
                var value = Fields.GetValue(formContext, attributeName);
                if (value && value.length > 0) {
                    return value[0];
                }
                return value;
            }
            Fields.GetLookupFieldValue = GetLookupFieldValue;
        })(Fields = ApiUtils.Fields || (ApiUtils.Fields = {}));
    })(ApiUtils = IoTConnector.ApiUtils || (IoTConnector.ApiUtils = {}));
})(IoTConnector || (IoTConnector = {}));
/// <reference path="../../../../../../../IoT/CrmPackage/Scripts/typings/IoT/Libes6/lib.es6.d.ts" />
/// <reference path="../../../../../../../IoT/CrmPackage/Scripts/typings/xrm/Crm.ClientApiTypings.1.0.1069-manual/clientapi/XrmClientApi.d.ts" />
/// <reference path="../../../../../Scripts/typings/IoT/Localization/Localization.d.ts"/>
/// <reference path="Common.ts"/>
var IoTConnector;
(function (IoTConnector) {
    var ApiUtils;
    (function (ApiUtils) {
        var Form;
        (function (Form) {
            /* @method SetNotification
                This method is used to show/clear the form notification based on the localizedStringId
               @param
                localizedStringId: The localized string id. This id is used to display the localized message for the notification
                                   It's also used as the notification id for clearing out the message.
                show: Optional value of true/false. It's an indicator used to show or hide/clear the notification message. The default value is true
                notificationType: Optional XrmClientApi.Constants.FormNotificationLevel enum value: "ERROR" | "WARNING" | "INFO". The default value is "ERROR".
                formatFunc: Optional callback value for declaring a formatting function
               @return
                  true if show/clear the notification successfully or false otherise.
            */
            function SetNotification(formContext, localizedStringId, show, notificationType, formatFunc) {
                return __awaiter(this, void 0, void 0, function () {
                    var pageUI, locStr;
                    return __generator(this, function (_a) {
                        if (formContext && formContext.ui) {
                            pageUI = formContext.ui;
                            show = (show != false); // default to true if not set
                            if (show) {
                                notificationType = notificationType || "ERROR"; //Default to "ERROR" if not set
                                locStr = IoTConnector.Localization.Localization.localize(localizedStringId);
                                if (formatFunc) {
                                    locStr = formatFunc(locStr);
                                }
                                return [2 /*return*/, pageUI.setFormNotification(locStr, notificationType, localizedStringId)];
                            }
                            else {
                                return [2 /*return*/, pageUI.clearFormNotification(localizedStringId)];
                            }
                        }
                        else {
                            ApiUtils.LogMessageInConsole("IoTConnector.ApiUtils.Form.SetNotification: no notification was shown/cleared for localizedStringId '" + localizedStringId + "'");
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                    });
                });
            }
            Form.SetNotification = SetNotification;
        })(Form = ApiUtils.Form || (ApiUtils.Form = {}));
    })(ApiUtils = IoTConnector.ApiUtils || (IoTConnector.ApiUtils = {}));
})(IoTConnector || (IoTConnector = {}));
/// <reference path="Fields.ts" />
/// <reference path="Form.ts" />
var IoTConnector;
(function (IoTConnector) {
    var ApiUtils;
    (function (ApiUtils) {
        // AsyncJobTracker to be used for tracking Async Jobs; so we block the Save if Async Jobs are not finished yet.
        var AsyncJobTracker = /** @class */ (function () {
            /**
             * Constructor
             *
             * @param formContext             Form context (optional for now)
             * @param blockSaveAttributeName  An attribute used to block save (using field validation)
             */
            function AsyncJobTracker(formContext, blockSaveAttributeName) {
                this._jobCount = 0;
                this._lastJobRemoved = null;
                this._lastJobAdded = null;
                this._maxExecutionInSecond = 10; // The max number of seconds that an async job should be executed. If it's more than this, then we consider there is an issue
                this._asyncPendingJobsLocalizedId = "@:formNotification_AsyncPendingJobsExist";
                this._asyncLongPendingJobsLocalizedId = "@:formNotification_AsyncLongPendingJobsExist";
                this._blockSaveAttributeName = null;
                if (ApiUtils.IsNotNullAndUndefined(formContext)) {
                    this._defaultFormContext = formContext;
                    if (blockSaveAttributeName) {
                        var blockSaveAttribute = ApiUtils.Fields.GetEntityAttribute(formContext, blockSaveAttributeName);
                        // the input attribute name is valid
                        if (blockSaveAttribute) {
                            this._blockSaveAttributeName = blockSaveAttributeName;
                        }
                    }
                    // Uses the default attribute name
                    if (!this._blockSaveAttributeName) {
                        this._blockSaveAttributeName = this.GetDefaultBlockSaveAttributeName(formContext);
                    }
                }
                else {
                    ApiUtils.OutputError("AsyncJobTracker.formContext", ApiUtils.ErrorTypes.Null);
                }
            }
            /**
             * Adds a job count to the tracker. Should be called before starting an async job
             * This should only be used in conjunction with RemoveJob
             *
             * @param formContext   Form context optional. If null, a default form context will be used.
             */
            AsyncJobTracker.prototype.AddJob = function (formContext) {
                var _formContext = this.GetFormContextOrDefault(formContext);
                this._jobCount++;
                this._lastJobAdded = new Date();
                this.SetBlockSave(_formContext);
            };
            /**
             * Removes a job count from the tracker. Should be called when an sync job is completed
             * This should only be used in conjunction with AddJob
             *
             * @param formContext   Form context optional. If null, a default form context will be used.
             */
            AsyncJobTracker.prototype.RemoveJob = function (formContext) {
                this._jobCount--;
                this._lastJobRemoved = new Date();
                if (!this.HasPendingJobs()) {
                    var _formContext = this.GetFormContextOrDefault(formContext);
                    this.ClearPendingAsyncFormNotification(_formContext);
                    this.SetBlockSave(_formContext, false);
                }
            };
            // Checks if there are still any pending jobs
            AsyncJobTracker.prototype.HasPendingJobs = function () {
                return this._jobCount != 0;
            };
            // Checks if AsyncJobTracker has a default form context
            AsyncJobTracker.prototype.HasDefaultFormContext = function () {
                return ApiUtils.IsNotNullAndUndefined(this._defaultFormContext);
            };
            // Checks if there are still aysnc jobs running longer than expected
            // Note: this method is for internal use only when there are still pending jobs.
            AsyncJobTracker.prototype.HasJobsRunningLongerThanExpected = function () {
                var currentTime = new Date();
                var secondsSinceLastJobAdded = this._lastJobAdded != null ? (currentTime.valueOf() - this._lastJobAdded.valueOf()) / 1000 : -1;
                var secondsSinceLastJobRemoved = this._lastJobRemoved != null ? (currentTime.valueOf() - this._lastJobRemoved.valueOf()) / 1000 : -1;
                return ((secondsSinceLastJobAdded < secondsSinceLastJobRemoved || secondsSinceLastJobRemoved == -1) && secondsSinceLastJobAdded > this._maxExecutionInSecond) || // New job has started more than x seconds but not finished yet
                    (secondsSinceLastJobAdded > secondsSinceLastJobRemoved && secondsSinceLastJobRemoved > this._maxExecutionInSecond); // Last job has completed more than x seconds ago
            };
            // Checks if there are still pending async jobs and displays a form notification to indicate that
            // @param:  showPendingJobsNotification: an optional boolean value to indicate it should show form notifications if there are pending jobs. The default value is true.
            // @return: a boolean value to indicate if there are still pending jobs.
            AsyncJobTracker.prototype.CheckPendingJobs = function (formContext, showPendingJobsNotification) {
                var hasPendingJob = this.HasPendingJobs();
                var _formContext = this.GetFormContextOrDefault(formContext);
                if (hasPendingJob) {
                    showPendingJobsNotification = (showPendingJobsNotification != false); // Defaulting to true if not set
                    if (showPendingJobsNotification) {
                        var notificationLocalizedId = this.HasJobsRunningLongerThanExpected() ? this._asyncLongPendingJobsLocalizedId : this._asyncPendingJobsLocalizedId;
                        this.ClearPendingAsyncFormNotification(_formContext);
                        ApiUtils.Form.SetNotification(_formContext, notificationLocalizedId);
                    }
                }
                else {
                    // Everything looks good. Clear the notifications if exist.
                    this.ClearPendingAsyncFormNotification(_formContext);
                }
                return hasPendingJob;
            };
            /**
             * Gets form context. Use the passed in formContext if not null. Otherwise, use the default formContext
             *
             * @param formContext
             */
            AsyncJobTracker.prototype.GetFormContextOrDefault = function (formContext) {
                return ApiUtils.IsNotNullAndUndefined(formContext) ? formContext : this._defaultFormContext;
            };
            AsyncJobTracker.prototype.ClearPendingAsyncFormNotification = function (formContext) {
                ApiUtils.Form.SetNotification(formContext, this._asyncPendingJobsLocalizedId, false);
                ApiUtils.Form.SetNotification(formContext, this._asyncLongPendingJobsLocalizedId, false);
            };
            /**
             * Gets the default attribute name that is used to block save
             *
             * @param formContext Form context.
             * @returns a default attribute name
             * */
            AsyncJobTracker.prototype.GetDefaultBlockSaveAttributeName = function (formContext) {
                var defaultAttributeName = "ownerid";
                // Gets the list of attributes and select the first one if found
                var attributes = ApiUtils.Fields.GetEntityAttributes(formContext);
                if (attributes) {
                    defaultAttributeName = attributes.get(0).getName();
                }
                return defaultAttributeName;
            };
            /**
             * Sets BlockSave by using setIsValid API
             *
             * @param formContext   Form context
             * @param blockSave     Boolean value to indicate enabling/disable blocking save. Default is true.
             * */
            AsyncJobTracker.prototype.SetBlockSave = function (formContext, blockSave) {
                if (blockSave === void 0) { blockSave = true; }
                if (formContext) {
                    ApiUtils.Fields.SetIsValid(formContext, this._blockSaveAttributeName, !blockSave, this._asyncPendingJobsLocalizedId);
                }
            };
            return AsyncJobTracker;
        }());
        ApiUtils.AsyncJobTracker = AsyncJobTracker;
    })(ApiUtils = IoTConnector.ApiUtils || (IoTConnector.ApiUtils = {}));
})(IoTConnector || (IoTConnector = {}));
/// <reference path="../../../../../../../IoT/CrmPackage/Scripts/typings/IoT/Libes6/lib.es6.d.ts" />
/// <reference path="../../../../../../../IoT/CrmPackage/Scripts/typings/xrm/Crm.ClientApiTypings.1.0.1069-manual/clientapi/XrmClientApi.d.ts" />
/// <reference path="AsyncJobTracker.ts"/>
var IoTConnector;
(function (IoTConnector) {
    var ApiUtils;
    (function (ApiUtils) {
        var CrudApiSDK = /** @class */ (function () {
            function CrudApiSDK() {
            }
            /**
             * Retrieves a record and will only track the async job if there is
             * a callback (error or success) provided. If no callback is needed
             * and await retrieveRecord is intended, use retrieveRecordAsync instead.
             *
             * @param id
             * @param type
             * @param select
             * @param expand
             * @param successCallback
             * @param errorCallback
             * @param formContext
             * @param useAsyncJobTrackerIfAvailable
             */
            CrudApiSDK.retrieveRecord = function (id, type, select, expand, successCallback, errorCallback, formContext, useAsyncJobTrackerIfAvailable) {
                if (useAsyncJobTrackerIfAvailable === void 0) { useAsyncJobTrackerIfAvailable = true; }
                var callbacks = CrudApiSDK.startTrackingAndWrapCallbacks(successCallback, errorCallback, formContext, useAsyncJobTrackerIfAvailable);
                var success = callbacks[0];
                var failure = callbacks[1];
                if (CrudApiSDK.isOffline(type)) {
                    var systemQueryOptions = WebApiSDK.getRetrieveOptionsString(select, expand);
                    return Xrm.WebApi.offline.retrieveRecord(type, id, systemQueryOptions).then(success, failure);
                }
                else {
                    return WebApiSDK.retrieveRecord(id, type, select, expand, success, failure);
                }
            };
            /**
             * Retrieves a record. No async job tracking will occur and will have to
             * be manually tracked by the caller of this function.
             *
             * @param id
             * @param type
             * @param select
             * @param expand
             */
            CrudApiSDK.retrieveRecordAsync = function (id, type, select, expand) {
                return __awaiter(this, void 0, void 0, function () {
                    var systemQueryOptions;
                    return __generator(this, function (_a) {
                        if (CrudApiSDK.isOffline(type)) {
                            systemQueryOptions = WebApiSDK.getRetrieveOptionsString(select, expand);
                            return [2 /*return*/, Xrm.WebApi.offline.retrieveRecord(type, id, systemQueryOptions)];
                        }
                        ;
                        return [2 /*return*/, WebApiSDK.retrieveRecord(id, type, select, expand)];
                    });
                });
            };
            /**
             * Retrieves multiple records and will only track the async job if there is
             * a callback (error or success) provided. If no callback is needed
             * and await retrieveMultipleRecords is intended, use retrieveMultipleRecordsAsync
             * instead.
             *
             * @param type
             * @param options
             * @param successCallback
             * @param errorCallback
             * @param formContext
             * @param useAsyncJobTrackerIfAvailable
             */
            CrudApiSDK.retrieveMultipleRecords = function (type, options, successCallback, errorCallback, formContext, useAsyncJobTrackerIfAvailable) {
                if (useAsyncJobTrackerIfAvailable === void 0) { useAsyncJobTrackerIfAvailable = true; }
                var callbacks = CrudApiSDK.startTrackingAndWrapCallbacks(successCallback, errorCallback, formContext, useAsyncJobTrackerIfAvailable);
                var success = callbacks[0];
                var failure = callbacks[1];
                if (CrudApiSDK.isOffline(type)) {
                    var optionsString = WebApiSDK.getRetrieveMultipleOptionsString(options);
                    return Xrm.WebApi.offline.retrieveMultipleRecords(type, optionsString).then(success, failure);
                }
                else {
                    return WebApiSDK.retrieveMultipleRecords(type, options, success, failure);
                }
            };
            /**
             * Retrieves a record. No async job tracking will occur and will have to
             * be manually tracked by the caller of this function.
             *
             * @param type
             * @param options
             */
            CrudApiSDK.retrieveMultipleRecordsAsync = function (type, options) {
                return __awaiter(this, void 0, void 0, function () {
                    var optionsString;
                    return __generator(this, function (_a) {
                        if (CrudApiSDK.isOffline(type)) {
                            optionsString = WebApiSDK.getRetrieveMultipleOptionsString(options);
                            return [2 /*return*/, Xrm.WebApi.offline.retrieveMultipleRecords(type, optionsString)];
                        }
                        else {
                            return [2 /*return*/, WebApiSDK.retrieveMultipleRecords(type, options)];
                        }
                        return [2 /*return*/];
                    });
                });
            };
            CrudApiSDK.updateRecord = function (id, object, type, successCallback, errorCallback, formContext, useAsyncJobTrackerIfAvailable) {
                if (useAsyncJobTrackerIfAvailable === void 0) { useAsyncJobTrackerIfAvailable = true; }
                // Start tracking an async job
                CrudApiSDK.startTrackingAsyncJob(formContext, useAsyncJobTrackerIfAvailable);
                // Create callbacks that will untrack an async job and execute the original callbacks
                var success = CrudApiSDK.createCallBackWithEndTrackingAsyncJob(formContext, useAsyncJobTrackerIfAvailable, successCallback);
                var failure = CrudApiSDK.createCallBackWithEndTrackingAsyncJob(formContext, useAsyncJobTrackerIfAvailable, errorCallback);
                if (CrudApiSDK.isOffline(type)) {
                    return Xrm.WebApi.offline.updateRecord(type, id, object).then(success, failure);
                }
                else {
                    return WebApiSDK.updateRecord(id, object, type, success, failure);
                }
            };
            CrudApiSDK.createRecord = function (object, type, successCallback, errorCallback, formContext, useAsyncJobTrackerIfAvailable) {
                if (useAsyncJobTrackerIfAvailable === void 0) { useAsyncJobTrackerIfAvailable = true; }
                // Start tracking an async job
                CrudApiSDK.startTrackingAsyncJob(formContext, useAsyncJobTrackerIfAvailable);
                // Create callbacks that will untrack an async job and execute the original callbacks
                var success = CrudApiSDK.createCallBackWithEndTrackingAsyncJob(formContext, useAsyncJobTrackerIfAvailable, successCallback);
                var failure = CrudApiSDK.createCallBackWithEndTrackingAsyncJob(formContext, useAsyncJobTrackerIfAvailable, errorCallback);
                if (CrudApiSDK.isOffline(type)) {
                    return Xrm.WebApi.offline.createRecord(type, object).then(success, failure);
                }
                else {
                    return WebApiSDK.createRecord(type, object, success, failure);
                }
            };
            CrudApiSDK.isOffline = function (entityName) {
                return ApiUtils.GetClientState() === ApiUtils.ClientState.Offline && Xrm.WebApi.offline.isAvailableOffline(entityName);
            };
            CrudApiSDK.isAvailableOffline = function (entityName) {
                return Xrm.WebApi.offline.isAvailableOffline(entityName);
            };
            CrudApiSDK.isNetworkAvailable = function () {
                var globalContext = Xrm.Utility && Xrm.Utility.getGlobalContext();
                var client = globalContext && globalContext.client;
                if (client) {
                    if (client.isNetworkAvailable) {
                        return client.isNetworkAvailable();
                    }
                    else if (client.isOffline) {
                        return client.isOffline();
                    }
                }
                return false;
            };
            CrudApiSDK.adjustLookupAttributeValue = function (data, attributeName) {
                if (data) {
                    var attributeValue = data[attributeName];
                    if (attributeValue) {
                        if (Array.isArray(attributeValue)) {
                            if (attributeValue.length == 0) {
                                data[attributeName] = undefined;
                            }
                            else {
                                data[attributeName] = attributeValue[0];
                            }
                        }
                    }
                }
            };
            CrudApiSDK.adjustNumberAttributeValue = function (data, attributeName) {
                if (data) {
                    var attributeValue = data[attributeName];
                    if (attributeValue) {
                        if (typeof (attributeValue) === "string") {
                            data[attributeName] = JSON.parse(attributeValue);
                        }
                    }
                }
            };
            CrudApiSDK.adjustBooleanAttributeValue = function (data, attributeName) {
                if (data) {
                    var attributeValue = data[attributeName];
                    if (attributeValue) {
                        if (typeof (attributeValue) === "string") {
                            data[attributeName] = JSON.parse(attributeValue);
                        }
                    }
                }
            };
            ;
            CrudApiSDK.adjustAttributeFromValueFieldToObject = function (data, attributeName) {
                var _a;
                if (data) {
                    var valueAttributeName = '_' + attributeName + '_value';
                    data[attributeName] = (_a = {},
                        _a[attributeName] = data[valueAttributeName],
                        _a);
                }
            };
            CrudApiSDK.getFieldNameWithoutValueSuffix = function (column) {
                return column && column.startsWith('_') && column.endsWith('_value')
                    ? column.substring(1).slice(0, -'_value'.length)
                    : column;
            };
            /**
             * Checks if AsyncJobTracker can be used
             *
             * @param formContext
            */
            CrudApiSDK.canUseAsyncJobTracker = function (formContext) {
                // Checks:
                // -If only uses Async Tracker offline 
                // -AsyncJobTracker and formContext are not null
                return (!CrudApiSDK.UseAsyncJobTrackerOfflineOnly || ApiUtils.GetClientState() === ApiUtils.ClientState.Offline) &&
                    ApiUtils.IsNotNullAndUndefined(CrudApiSDK.AsyncJobTracker) &&
                    (ApiUtils.IsNotNullAndUndefined(formContext) || CrudApiSDK.AsyncJobTracker.HasDefaultFormContext());
            };
            /**
             * Starts tracking an async job
             * This should be called before executing an async operation
             *
             * @param formContext                    Form Context
             * @param useAsyncJobTrackerIfAvailable  Boolean value indicates to use AsyncJobTracker if available.
             */
            CrudApiSDK.startTrackingAsyncJob = function (formContext, useAsyncJobTrackerIfAvailable) {
                if (useAsyncJobTrackerIfAvailable && CrudApiSDK.canUseAsyncJobTracker(formContext)) {
                    CrudApiSDK.AsyncJobTracker.AddJob(formContext);
                }
            };
            /**
             * End tracking an async job
             * This should be called after an async operation is completed (either if the operation succeeded or failed)
             *
             * @param formContext                    Form Context
             * @param useAsyncJobTrackerIfAvailable  Boolean value indicates to use AsyncJobTracker if available.
             */
            CrudApiSDK.endTrackingAsyncJob = function (formContext, useAsyncJobTrackerIfAvailable) {
                if (useAsyncJobTrackerIfAvailable && CrudApiSDK.canUseAsyncJobTracker(formContext)) {
                    CrudApiSDK.AsyncJobTracker.RemoveJob(formContext);
                }
            };
            /**
             * Create a new callback method that will execute the endTrackingAsyncJob and call the original callback afterward
             *
             * @param formContext                    Form context
             * @param useAsyncJobTrackerIfAvailable  Boolean value indicate to use AsyncJobTracker if it's available.
             * @param callback                       The original callback
             *
             * @returns a callback method that has an option to untrack an async job
             */
            CrudApiSDK.createCallBackWithEndTrackingAsyncJob = function (formContext, useAsyncJobTrackerIfAvailable, callback) {
                return function (data) {
                    // Untrack an async job by removing a job from AsynJobTracker
                    CrudApiSDK.endTrackingAsyncJob(formContext, useAsyncJobTrackerIfAvailable);
                    // execute the original callback
                    if (callback) {
                        callback(data);
                    }
                };
            };
            /**
             * Starts tracking of the async job and wraps the callbacks in
             * a callback that will end the tracking once the job returns. If
             * the original callbacks are both null, no async job tracking will take
             * place.
             *
             * @param successCallback
             * @param errorCallback
             * @param formContext
             * @param useAsyncJobTrackerIfAvailable
             */
            CrudApiSDK.startTrackingAndWrapCallbacks = function (successCallback, errorCallback, formContext, useAsyncJobTrackerIfAvailable) {
                var success = successCallback;
                var failure = errorCallback;
                if (successCallback || errorCallback) {
                    // Start tracking an async job
                    CrudApiSDK.startTrackingAsyncJob(formContext, useAsyncJobTrackerIfAvailable);
                    // Create callbacks that will untrack an async job and execute the original callbacks
                    success = CrudApiSDK.createCallBackWithEndTrackingAsyncJob(formContext, useAsyncJobTrackerIfAvailable, successCallback);
                    failure = CrudApiSDK.createCallBackWithEndTrackingAsyncJob(formContext, useAsyncJobTrackerIfAvailable, errorCallback);
                }
                return [success, failure];
            };
            CrudApiSDK.UseAsyncJobTrackerOfflineOnly = true;
            return CrudApiSDK;
        }());
        ApiUtils.CrudApiSDK = CrudApiSDK;
        var WebApiSDK = /** @class */ (function () {
            function WebApiSDK() {
            }
            WebApiSDK.retrieveRecord = function (id, type, select, expand, successCallback, errorCallback) {
                ///<summary>
                /// Sends an asynchronous request to retrieve a record.
                ///</summary>
                ///<param name="id" type="String">
                /// A String representing the GUID value for the record to retrieve.
                ///</param>
                WebApiSDK.stringParameterCheck(id, "WebApiSDK.retrieveRecord requires the id parameter is a string.");
                ///<param name="type" type="String">
                /// The Schema Name of the Entity type record to retrieve.
                /// For an Account record, use "Account"
                ///</param>
                WebApiSDK.stringParameterCheck(type, "WebApiSDK.retrieveRecord requires the type parameter is a string.");
                ///<param name="select" type="String">
                /// A String representing the $select OData System Query Option to control which
                /// attributes will be returned. This is a comma separated list of Attribute names that are valid for retrieve.
                /// If null all properties for the record will be returned
                ///</param>
                if (select != null)
                    WebApiSDK.stringParameterCheck(select, "WebApiSDK.retrieveRecord requires the select parameter is a string.");
                ///<param name="expand" type="String">
                /// A String representing the $expand OData System Query Option value to control which
                /// related records are also returned. This is a comma separated list of of up to 6 entity relationship names
                /// If null no expanded related records will be returned.
                ///</param>
                if (expand != null)
                    WebApiSDK.stringParameterCheck(expand, "WebApiSDK.retrieveRecord requires the expand parameter is a string.");
                var systemQueryOptions = WebApiSDK.getRetrieveOptionsString(select, expand);
                var promise = Xrm.WebApi.retrieveRecord(type, id, systemQueryOptions);
                if (successCallback || errorCallback) {
                    return promise.then(successCallback, errorCallback);
                }
                return promise;
            };
            WebApiSDK.retrieveMultipleRecords = function (type, options, successCallback, errorCallback) {
                ///<summary>
                /// Sends an asynchronous request to retrieve records.
                ///</summary>
                ///<param name="type" type="String">
                /// The Schema Name of the Entity type records to retrieve
                /// For an Account record, use "Account"
                ///</param>
                WebApiSDK.stringParameterCheck(type, "WebApiSDK.retrieveMultipleRecords requires the type parameter is a string.");
                ///<param name="options" type="String">
                /// A String representing the OData System Query Options to control the data returned
                /// Do not include the $top option, use the top parameters to set the maximum number of records to return.
                ///</param>
                if (options != null)
                    WebApiSDK.stringParameterCheck(options, "WebApiSDK.retrieveMultipleRecords requires the options parameter is a string.");
                var optionsString = WebApiSDK.getRetrieveMultipleOptionsString(options);
                var promise = Xrm.WebApi.retrieveMultipleRecords(type, optionsString);
                if (successCallback || errorCallback) {
                    return promise.then(successCallback, errorCallback);
                }
                return promise;
            };
            WebApiSDK.updateRecord = function (id, object, type, successCallback, errorCallback) {
                ///<summary>
                /// Sends an asynchronous request to update a record.
                ///</summary>
                ///<param name="id" type="String">
                /// A String representing the GUID value for the record to retrieve.
                ///</param>
                WebApiSDK.stringParameterCheck(id, "WebApiSDK.updateRecord requires the id parameter is a string.");
                ///<param name="object" type="Object">
                /// A JavaScript object with properties corresponding to the Schema Names for
                /// entity attributes that are valid for update operations.
                ///</param>
                WebApiSDK.parameterCheck(object, "WebApiSDK.updateRecord requires the object parameter.");
                ///<param name="type" type="String">
                /// The Schema Name of the Entity type record to retrieve.
                /// For an Account record, use "Account"
                ///</param>
                WebApiSDK.stringParameterCheck(type, "WebApiSDK.updateRecord requires the type parameter is a string.");
                var promise = Xrm.WebApi.updateRecord(type, id, object);
                if (successCallback || errorCallback) {
                    return promise.then(successCallback, errorCallback);
                }
                return promise;
            };
            WebApiSDK.createRecord = function (entityLogicalName, data, successCallback, errorCallback) {
                ///<summary>
                /// Sends an asynchronous request to create a record.
                ///</summary>
                ///<param name="entityLogicalName" type="String">
                /// A String representing the entity logical name.
                ///</param>
                WebApiSDK.stringParameterCheck(entityLogicalName, "WebApiSDK.createRecord requires the entityLogicalName parameter is a string.");
                ///<param name="data" type="Object">
                /// A JavaScript object with properties corresponding to the Schema Names for
                /// entity attributes that are valid for update operations.
                ///</param>
                WebApiSDK.parameterCheck(data, "WebApiSDK.createRecord requires the object parameter.");
                var promise = Xrm.WebApi.createRecord(entityLogicalName, data);
                if (successCallback || errorCallback) {
                    return promise.then(successCallback, errorCallback);
                }
                return promise;
            };
            WebApiSDK.getRetrieveOptionsString = function (select, expand, filter, top, orderby) {
                var optionsString = "";
                if (select || expand) {
                    var systemQueryParameters = new Array();
                    if (select) {
                        systemQueryParameters.push("$select=" + select);
                    }
                    if (expand) {
                        systemQueryParameters.push("$expand=" + expand);
                    }
                    if (filter) {
                        systemQueryParameters.push("$filter=" + filter);
                    }
                    if (top) {
                        systemQueryParameters.push("$top=" + top);
                    }
                    if (orderby) {
                        systemQueryParameters.push("$orderby=" + orderby);
                    }
                    optionsString = "?" + systemQueryParameters.join("&");
                }
                return optionsString;
            };
            WebApiSDK.getRetrieveMultipleOptionsString = function (options) {
                var optionsString = "";
                if (options != null) {
                    if (options.charAt(0) != "?") {
                        optionsString = "?" + options;
                    }
                    else {
                        optionsString = options;
                    }
                }
                return optionsString;
            };
            WebApiSDK.parameterCheck = function (parameter, message) {
                if (typeof parameter === "undefined" || parameter === null) {
                    throw new Error(message);
                }
            };
            WebApiSDK.stringParameterCheck = function (parameter, message) {
                if (typeof parameter != "string") {
                    throw new Error(message);
                }
            };
            WebApiSDK.callbackParameterCheck = function (callbackParameter, message) {
                if (typeof callbackParameter != "function") {
                    throw new Error(message);
                }
            };
            WebApiSDK.getGuidWithBrackets = function (guid) {
                return guid && guid.indexOf("}") < 0 ? "{" + guid + "}" : guid;
            };
            WebApiSDK.getGuidWithoutBrackets = function (guid) {
                return guid && guid.indexOf("}") >= 0 ? guid.substr(1, guid.length - 2) : guid;
            };
            return WebApiSDK;
        }());
        ApiUtils.WebApiSDK = WebApiSDK;
        var WebApiError = /** @class */ (function () {
            function WebApiError() {
            }
            return WebApiError;
        }());
        ApiUtils.WebApiError = WebApiError;
        var WebApiInnerError = /** @class */ (function () {
            function WebApiInnerError() {
            }
            return WebApiInnerError;
        }());
        ApiUtils.WebApiInnerError = WebApiInnerError;
    })(ApiUtils = IoTConnector.ApiUtils || (IoTConnector.ApiUtils = {}));
})(IoTConnector || (IoTConnector = {}));
/*! WARNING! Do not update this file manually! Manual update of this file is not supported and will likely lead to issues. In addition, future solution upgrades wont apply to manually edited files. */
/// <reference path="../../../../Scripts/typings/xrm/xrm.d.ts"/>
/// <reference path="../../../../Scripts/typings/IoT/Libes6/lib.es6.d.ts" />
/// <reference path="ApiUtils/WebApiSDK.ts" />
/// <reference path="ApiUtils/Common.ts" />
/// <reference path="../Common/Constants.ts" />
var IoTConnector;
(function (IoTConnector) {
    var Utils;
    (function (Utils) {
        var ServiceEndpointUtils = /** @class */ (function () {
            function ServiceEndpointUtils() {
            }
            // Determines if there is a valid endpoint and returns boolean Promise of true if valid, otherwise false.
            ServiceEndpointUtils.isValidEndpoint = function () {
                return new Promise(function (resolve, reject) {
                    var isValidEndpoint = ServiceEndpointUtils.GetIsValidEndpointSessionStorage();
                    if (isValidEndpoint != null) {
                        return resolve(isValidEndpoint);
                    }
                    try {
                        if (!IoTConnector.ApiUtils.CrudApiSDK.isNetworkAvailable()) {
                            return resolve(false);
                        }
                        IoTConnector.Utils.ODataUtils.checkIfIoTRelatedEntityRecordExistsFromCustomAction("serviceendpoint", function (hasatleastone) {
                            ServiceEndpointUtils.SetIsValidEndpointSessionStorage(hasatleastone);
                            resolve(hasatleastone);
                        }, function (err) {
                            ServiceEndpointUtils.SetIsValidEndpointSessionStorage(false);
                            resolve(false);
                        });
                    }
                    catch (err) {
                        resolve(false);
                    }
                });
            };
            ;
            ServiceEndpointUtils.isValid = function (data) {
                return data && ServiceEndpointUtils.isPathValid(data["path"]);
            };
            ;
            //Determines if the Path is valid
            ServiceEndpointUtils.isPathValid = function (str) {
                return (str != null && str.trim().length > 0 && str !== ServiceEndpointUtils.LegacyDefaultEndpointPath);
            };
            // Set isValidEndpoint flag in session storage.
            // @param value: boolean value for the flag
            ServiceEndpointUtils.SetIsValidEndpointSessionStorage = function (value) {
                try {
                    sessionStorage.setItem(IoTConnector.Common.Constants.IoTCacheKeys.IsValidEndpoint, JSON.stringify(value));
                }
                catch (e) {
                    // Cannot set sessionStorage, no error to output
                }
            };
            ;
            // Get isValidEndpoint flag from session storage.
            // @returns boolean: boolean value for the flag
            ServiceEndpointUtils.GetIsValidEndpointSessionStorage = function () {
                return JSON.parse(sessionStorage.getItem(IoTConnector.Common.Constants.IoTCacheKeys.IsValidEndpoint));
            };
            ;
            ServiceEndpointUtils.IoTEndpointId = "fadc3b14-a91b-e611-8103-00155dbd6a1d";
            ServiceEndpointUtils.LegacyDefaultEndpointPath = "ks1testcrmf1-crm";
            return ServiceEndpointUtils;
        }());
        Utils.ServiceEndpointUtils = ServiceEndpointUtils;
    })(Utils = IoTConnector.Utils || (IoTConnector.Utils = {}));
})(IoTConnector || (IoTConnector = {}));
/*! WARNING! Do not update this file manually! Manual update of this file is not supported and will likely lead to issues. In addition, future solution upgrades wont apply to manually edited files. */
var IoTConnector;
(function (IoTConnector) {
    var Utils;
    (function (Utils) {
        var ClientUtils = /** @class */ (function () {
            function ClientUtils() {
            }
            // Get the datacenter name - crm, crm2, crm4 etc.
            // Example: Given https://contoso.crm4.dynamics.com, return "crm4".
            ClientUtils.getDataCenterSuffix = function () {
                var suffix = "crm";
                var globalContext = Xrm.Utility.getGlobalContext();
                if (globalContext) {
                    var clientUrl = globalContext.getClientUrl();
                    var startIndex = clientUrl.indexOf(".") + 1;
                    if (startIndex > 0) {
                        var partialUrl = clientUrl.substr(startIndex); // Example: crm4.dynamics.com
                        var length_1 = partialUrl.indexOf(".");
                        if (length_1 > 0) {
                            suffix = partialUrl.substr(0, length_1); // Example: crm4
                        }
                    }
                }
                return suffix;
            };
            // Get the region of CRM org i.e. end of CRM org URL 
            // Example: Given https://contoso.crm.dynamics.cn (mooncake) or https://contoso.crm.microsoftdynamics.us (gcchigh) or https://contoso.crm.appsplatform.us (DoD), return "cn" or "us"
            ClientUtils.getRegion = function () {
                var globalContext = Xrm.Utility.getGlobalContext();
                if (globalContext) {
                    var clientUrl = globalContext.getClientUrl();
                    var startIndex = clientUrl.indexOf(".") + 1; // removing the intial part of url to handle scenario where customer's org url is similar to contosodynamics.crm.dynamics.us
                    if (startIndex > 0) {
                        var partialUrl = clientUrl.substr(startIndex); // Example: crm.dynamics.us (gcchigh) or crm.appsplatform.us (DoD)
                        startIndex = partialUrl.indexOf("dynamics.") + 9;
                        var DoDIndex = partialUrl.indexOf("appsplatform.") + 13;
                        if (startIndex > 0) {
                            return partialUrl.substr(startIndex); // Example: us or cn
                        }
                        else if (DoDIndex > 0) {
                            return partialUrl.substr(DoDIndex); // Example: us
                        }
                    }
                }
            };
            // Get the unique id of the org.
            ClientUtils.getOrgUniqueId = function () {
                var globalContext = Xrm.Utility.getGlobalContext();
                if (globalContext && globalContext.organizationSettings) {
                    return globalContext.organizationSettings.organizationId;
                }
                else {
                    return null;
                }
            };
            return ClientUtils;
        }());
        Utils.ClientUtils = ClientUtils;
    })(Utils = IoTConnector.Utils || (IoTConnector.Utils = {}));
})(IoTConnector || (IoTConnector = {}));
/*! WARNING! Do not update this file manually! Manual update of this file is not supported and will likely lead to issues. In addition, future solution upgrades wont apply to manually edited files. */
/// <reference path="../Common/Constants.ts" />
var IoTConnector;
(function (IoTConnector) {
    var Utils;
    (function (Utils) {
        var ODataUtils = /** @class */ (function () {
            function ODataUtils() {
            }
            Object.defineProperty(ODataUtils, "NoInternetConnectionError", {
                get: function () {
                    return {
                        code: RequestErrorCodes.NoInternetConnection,
                        message: IoTConnector.Localization && IoTConnector.Localization.Localization && IoTConnector.Localization.Localization.localize("@:internetConnectionIsRequiredForAction") ||
                            "Internet connection is required for performing this action."
                    };
                },
                enumerable: true,
                configurable: true
            });
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
                        else if (this.status === 0) {
                            failureCallback({ error: IoTConnector.Utils.ODataUtils.NoInternetConnectionError });
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
            // This function determines if atleast one record exists in msdyn_iotdevice or msdyn_iotalert
            // @param successCallback Success callback function
            // @param failureCallback failure callback function
            // @returns a boolean Promise: true if atleast one record exists in msdyn_iotdevice or msdyn_iotalert, otherwise false
            ODataUtils.checkIfIoTRelatedEntityRecordExistsFromCustomAction = function (entitiesLogicalName, successCallback, failureCallback) {
                // cannot proceed with custom action without  entity logical name, throw error
                if (!entitiesLogicalName) {
                    throw new EvalError('ConstantErrorCodes.generalErrorMessage');
                }
                // parameters passed to the custom action
                var params = {
                    EntitiesLogicalNames: entitiesLogicalName
                };
                if (Xrm.Utility.getGlobalContext().client.getClientState() === "Online") {
                    try {
                        var EntityNamesToCheckPermission_1 = Object.keys(IoTConnector.Common.Constants.PrvReadNamesForEntities);
                        var EntitiesLogicalNames = entitiesLogicalName.split(',');
                        var rolesAndPrivilagesPromise_1 = Xrm.Utility.getGlobalContext().userSettings.getSecurityRolePrivilegesInfo();
                        EntitiesLogicalNames.length > 0 && EntitiesLogicalNames.forEach(function (entityName) {
                            if (EntityNamesToCheckPermission_1.some(function (x) { return x === entityName; })) {
                                rolesAndPrivilagesPromise_1.then(function (roles) {
                                    var permission = Object.keys(roles).map(function (x) { return roles[x].privilegeName; });
                                    if (permission != null && permission.length > 0) {
                                        var permissionIsValid = permission.every(function (value) { return value != undefined; });
                                        var havePermission = permission.some(function (x) { return x === IoTConnector.Common.Constants.getReadPrivilegesForEntity(entityName); });
                                        if (permissionIsValid) {
                                            if (!havePermission) {
                                                successCallback(false);
                                            }
                                            else {
                                                Xrm.WebApi.retrieveMultipleRecords(entityName, "?$top=1&$select=createdon").then(function success(result) {
                                                    if (result.entities.length > 0) {
                                                        successCallback(true);
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
                Utils.ODataUtils.executeRequest("POST", 'msdyn_IoTCheckIfRecordExistsInEntity', params, function (response) {
                    if (response && ('IsRecordExists' in response)) {
                        try {
                            // try to parse the output as json
                            var isRecordExists = response["IsRecordExists"];
                            successCallback(isRecordExists);
                        }
                        catch (e) {
                            console.error(e);
                            failureCallback(new EvalError('ConstantErrorCodes.errorFailCallPlugin'));
                        }
                    }
                    else {
                        failureCallback(new EvalError('ConstantErrorCodes.errorFailCallPlugin'));
                    }
                }, function (err) {
                    failureCallback(new EvalError('ConstantErrorCodes.errorFailCallPlugin'));
                });
            };
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
                var filter = IoTConnector.Common.Constants.WebResource.AttributeName + " eq '" + name + "'";
                var request = this.formatRequest(IoTConnector.Common.Constants.WebResource.ODataEntityName, "", filter, selectFields, "");
                this.executeRequest("GET", request, null, successCallback, failureCallback);
            };
            // Writes the JSON object to the webresource's content (overwrites existing content)
            // id = guid id of webresource
            // jsonObject = JSON object
            // successCallback = Method to be called on success. Takes a string argument that contains the response of the query.
            // failureCallback = Method to be called on failure. Takes a string argument that contains the response of the query.
            ODataUtils.updateWebResource = function (id, jsonObject, successCallback, failureCallback) {
                var request = this.formatRequest(IoTConnector.Common.Constants.WebResource.ODataEntityName, id, "", "", "");
                var webResource = {};
                webResource[IoTConnector.Common.Constants.WebResource.AttributeContent] = btoa(JSON.stringify(jsonObject));
                this.executeRequest("PATCH", request, webResource, successCallback, failureCallback);
            };
            // Publishes xml changes for a webresource
            // id = the webresource guid id
            // successCallback = Method to be called on success. Takes a string argument that contains the response of the query.
            // failureCallback = Method to be called on failure. Takes a string argument that contains the response of the query.
            ODataUtils.publishXml = function (id, successCallback, failureCallback) {
                var webResourceName = IoTConnector.Common.Constants.WebResource.WebResourceName;
                var webResourcesName = IoTConnector.Common.Constants.WebResource.WebResourcesName;
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
                var userRoleFilter = IoTConnector.Common.Constants.Role.AttributeRoleId + " eq " + currentUserRoles.join(" or " + IoTConnector.Common.Constants.Role.AttributeRoleId + " eq ");
                var request = ODataUtils.formatRequest(IoTConnector.Common.Constants.Role.ODataEntityName, "", userRoleFilter, selectFields, "");
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
            ODataUtils.odataEndpointUrl = (typeof (Xrm) === "undefined") ? ODataUtils.parentXrm && ODataUtils.parentXrm.Utility.getGlobalContext().getClientUrl() + '/api/data/v9.0/' : Xrm.Utility.getGlobalContext().getClientUrl() + '/api/data/v9.0/';
            return ODataUtils;
        }());
        Utils.ODataUtils = ODataUtils;
        var RequestErrorCodes;
        (function (RequestErrorCodes) {
            RequestErrorCodes[RequestErrorCodes["NoInternetConnection"] = 1] = "NoInternetConnection";
        })(RequestErrorCodes = Utils.RequestErrorCodes || (Utils.RequestErrorCodes = {}));
    })(Utils = IoTConnector.Utils || (IoTConnector.Utils = {}));
})(IoTConnector || (IoTConnector = {}));
/*! WARNING! Do not update this file manually! Manual update of this file is not supported and will likely lead to issues. In addition, future solution upgrades wont apply to manually edited files. */
var IoTConnector;
(function (IoTConnector) {
    var Models;
    (function (Models) {
        var AlertDeviceInfo = /** @class */ (function () {
            function AlertDeviceInfo() {
                this.alertid = null;
                this.alertname = null;
                this.iotdeviceid = null;
                this.deviceid = null;
                this.iotdevicename = null;
                this.parententityid = null;
            }
            return AlertDeviceInfo;
        }());
        Models.AlertDeviceInfo = AlertDeviceInfo;
    })(Models = IoTConnector.Models || (IoTConnector.Models = {}));
})(IoTConnector || (IoTConnector = {}));
var IoTConnector;
(function (IoTConnector) {
    var Utils;
    (function (Utils) {
        var IoTProviderQueryUtils = /** @class */ (function () {
            function IoTProviderQueryUtils() {
            }
            //FetchXml Query for Device Insights Config Information using AlertId
            //@param alertId: AlertGuid associated with Form
            //@returns fetchXmlquery: Query to fetch config based on alertId
            IoTProviderQueryUtils.getDeviceInsightsConfigFromAlertGuidFetchXml = function (alertId) {
                var fetchXmlQuery = "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
                    "<entity name='msdyn_iotalert'>" +
                    "<attribute name = 'msdyn_iotalertid'/>" +
                    "<filter type = 'and'>" +
                    "<condition attribute = 'msdyn_iotalertid' operator = 'eq' value = '" + alertId + "'/>" +
                    "</filter>" +
                    "<link-entity name = 'msdyn_iotdevice' from = 'msdyn_iotdeviceid' to = 'msdyn_device' link-type='inner' alias = 'iotDevice'>" +
                    "<attribute name='msdyn_iotdeviceid'/>" +
                    "<link-entity name='msdyn_iotproviderinstance' from='msdyn_iotproviderinstanceid' to='msdyn_iotproviderinstance' link-type='inner' alias='providerinstance'>" +
                    "<attribute name = 'msdyn_iotproviderinstanceid'/>" +
                    "<attribute name = 'msdyn_timeseriesinsightsurl'/>" +
                    "<link-entity name = 'msdyn_iotprovider' from = 'msdyn_iotproviderid' to = 'msdyn_iotprovider' link-type='inner' alias = 'provider'>" +
                    "<attribute name = 'msdyn_querydevicereadingsaction'/>" +
                    "</link-entity>" +
                    "</link-entity>" +
                    "</link-entity>" +
                    "</entity>" +
                    "</fetch>";
                return fetchXmlQuery;
            };
            //FetchXml Query for Device Insights Config Information using DeviceId
            //@param deviceId: deviceGuid associated with Form
            //@returns fetchXmlquery: Query to fetch config based on deviceId
            IoTProviderQueryUtils.getDeviceInsightsConfigFromDeviceGuidFetchXml = function (deviceId) {
                var fetchXmlQuery = "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
                    "<entity name='msdyn_iotdevice'>" +
                    "<attribute name = 'msdyn_iotdeviceid'/>" +
                    "<filter type = 'and'>" +
                    "<condition attribute = 'msdyn_iotdeviceid' operator = 'eq' value = '" + deviceId + "'/>" +
                    "</filter>" +
                    "<link-entity name='msdyn_iotproviderinstance' from='msdyn_iotproviderinstanceid' to='msdyn_iotproviderinstance' link-type='inner' alias='providerinstance'>" +
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
            //FetchXml Query for Device Insights Config Information using DeviceId
            //@param deviceId: deviceId associated with Form
            //@returns fetchXmlquery: Query to fetch config based on deviceId
            IoTProviderQueryUtils.getDeviceInsightsConfigFromDeviceIdFetchXml = function (deviceId) {
                var fetchXmlQuery = "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" +
                    "<entity name='msdyn_iotdevice'>" +
                    "<attribute name = 'msdyn_deviceid'/>" +
                    "<filter type = 'and'>" +
                    "<condition attribute = 'msdyn_deviceid' operator = 'eq' value = '" + deviceId + "'/>" +
                    "</filter>" +
                    "<link-entity name='msdyn_iotproviderinstance' from='msdyn_iotproviderinstanceid' to='msdyn_iotproviderinstance' link-type='inner' alias='providerinstance'>" +
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
            return IoTProviderQueryUtils;
        }());
        Utils.IoTProviderQueryUtils = IoTProviderQueryUtils;
    })(Utils = IoTConnector.Utils || (IoTConnector.Utils = {}));
})(IoTConnector || (IoTConnector = {}));
/*! WARNING! Do not update this file manually! Manual update of this file is not supported and will likely lead to issues. In addition, future solution upgrades wont apply to manually edited files. */
/// <reference path="../../../../Scripts/typings/IoT/Localization/Localization.d.ts"/>
/// <reference path="../../../../Scripts/typings/IoT/Libes6/lib.es6.d.ts" />
/// <reference path="../Models/AlertAndDeviceInfo.ts" />
/// <reference path="../Utils/ODataUtils.ts" />
/// <reference path="../Utils/IoTProviderQueryUtils.ts" />
/// <reference path="../Utils/ApiUtils/WebApiSDK.ts" />
/// <reference path="../Common/Constants.ts" />
var IoTConnector;
(function (IoTConnector) {
    var Utils;
    (function (Utils) {
        var FormUtils = /** @class */ (function () {
            function FormUtils() {
            }
            // Checks if the entity is an alert.
            // entityName = the type of the entity. For example, "msdyn_iotalerts" or "msdyn_iotdevices".
            // returns true if the entity is an alert, false otherwise.
            FormUtils.isAlertEntity = function (entityName) {
                return entityName == "msdyn_iotalerts";
            };
            // Checks if the entity exists (is associated).
            // entity = the entity you want to check if it exists (is associated).
            // returns true if is the entity does not exist (is not associated), false otherwise.
            FormUtils.isNullOrEmpty = function (entity) {
                return !(entity && entity.length > 0);
            };
            // Gets the device information associated to the entity.
            // alertAndDeviceInfo = class containing the alert and device information associated to the given entity.
            // entityName = the type of the entity. For example, "msdyn_iotalerts" or "msdyn_iotdevices".
            // entity = the entity you want to get the associated device of.
            FormUtils.populateDeviceInfo = function (alertAndDeviceInfo, entityName, entity) {
                // If there is a device associated.
                // If not, the device fields in alertAndDeviceInfo remain null.
                if (!FormUtils.isNullOrEmpty(entity)) {
                    var AttributeDeviceId = "msdyn_deviceid";
                    var AttributeIoTDeviceId;
                    var AttributeDeviceName;
                    // Depending on type of entity, attribute names differ.
                    if (FormUtils.isAlertEntity(entityName)) {
                        AttributeIoTDeviceId = "_msdyn_device_value";
                        AttributeDeviceName = "msdyn_device_name";
                    }
                    else { // entityName == "msdyn_iotdevices"
                        AttributeIoTDeviceId = "msdyn_iotdeviceid";
                        AttributeDeviceName = "msdyn_name";
                    }
                    alertAndDeviceInfo.deviceid = entity[0][AttributeDeviceId];
                    alertAndDeviceInfo.iotdeviceid = entity[0][AttributeIoTDeviceId];
                    alertAndDeviceInfo.iotdevicename = entity[0][AttributeDeviceName];
                }
            };
            // Gets the alert information associated to the entity.
            // alertAndDeviceInfo = class containing the alert and device information associated to the given entity.
            // alertEntity = the alert entity you want to get associated alert information from.
            // alertReference = reference to the alert containing alert id and alert name.
            FormUtils.populateAlertInfo = function (alertAndDeviceInfo, alertEntity, alertReference) {
                if (alertReference) {
                    alertAndDeviceInfo.alertid = alertReference.Id;
                    alertAndDeviceInfo.alertname = alertReference.Name;
                }
                else if (!FormUtils.isNullOrEmpty(alertEntity)) {
                    var AttributeDescription = "msdyn_description";
                    var AttributeIoTAlertId = "msdyn_iotalertid";
                    alertAndDeviceInfo.alertid = alertEntity[0][AttributeIoTAlertId];
                    alertAndDeviceInfo.alertname = alertEntity[0][AttributeDescription];
                }
            };
            // Retrieves alert and/or device information associated to entity and opens a new command form.
            // entityName = name of entity you are trying to fetch in fetchXML. 
            // fetchXml = the fetchXml used to retrive the alert and/or device associated with the given entity.
            // successCallback = Method to be called on success. Takes a variable containing alert and device information for given entity.
            // failureCallback = Method to be called on failure. Takes a string argument that contains the response of the query.
            // alertReference = reference to the alert containing alert id and alert name.
            FormUtils.getAlertDeviceFromEntity = function (entityName, fetchXml, successCallback, failureCallback, alertReference) {
                IoTConnector.Utils.ODataUtils.executeRequest("GET", IoTConnector.Utils.ODataUtils.formatFetchXml(entityName, fetchXml), "", function (data) {
                    if (data) {
                        var entity = data.value;
                        var alertAndDeviceInfo = new IoTConnector.Models.AlertDeviceInfo();
                        // Ensure entities that require an alert have an alert associated.
                        if (FormUtils.isAlertEntity(entityName) && FormUtils.isNullOrEmpty(entity)) {
                            // If the entity needs an alert and does not have an alert linked to it.
                            Xrm.Navigation.openAlertDialog({ text: IoTConnector.Localization.Localization.localize("@:associateAlertToEntity") }, { height: 300 });
                        }
                        else {
                            if (FormUtils.isAlertEntity(entityName)) {
                                FormUtils.populateAlertInfo(alertAndDeviceInfo, entity);
                            }
                            else {
                                FormUtils.populateAlertInfo(alertAndDeviceInfo, null, alertReference);
                            }
                            FormUtils.populateDeviceInfo(alertAndDeviceInfo, entityName, entity);
                            if (successCallback) {
                                successCallback(alertAndDeviceInfo);
                            }
                        }
                    }
                }, function (err) {
                    try {
                        console.error(err.error.message);
                    }
                    catch (e) {
                        console.error(err);
                    }
                    if (failureCallback) {
                        failureCallback(err);
                    }
                });
            };
            FormUtils.retrieveProvider = function (providerId, select) {
                return new Promise(function (resolve, reject) {
                    IoTConnector.ApiUtils.CrudApiSDK.retrieveRecord(providerId, IoTConnector.Common.Constants.Msdyn_iotprovider.EntityLogicalName, select, null, function (provider) {
                        resolve(provider);
                    }, function (err) {
                        err && IoTConnector.ApiUtils.LogMessageInConsole(err.message);
                        reject(err);
                    });
                });
            };
            FormUtils.retrieveDeviceByDeviceId = function (deviceId, select) {
                return new Promise(function (resolve, reject) {
                    IoTConnector.ApiUtils.CrudApiSDK.retrieveMultipleRecords(IoTConnector.Common.Constants.EntityLogicalNames.DeviceEntityLogicalName, "$select=" + select + "&$filter=" + IoTConnector.Common.Constants.Msdyn_iotdevice.AttributeDeviceId + " eq '" + deviceId + "'", function (data) {
                        if (data && data[0]) {
                            resolve(data[0]);
                        }
                        else {
                            reject();
                        }
                    }, function (err) {
                        err && IoTConnector.ApiUtils.LogMessageInConsole(err.message);
                        reject(err);
                    });
                });
            };
            //Fetch Device Insights Config Information to determine whether to show/hide Device Insights tab
            //@param deviceId: device id
            FormUtils.shouldDeviceInsightsBeVisible = function (deviceId) {
                var _this = this;
                return new Promise(function (resolve) {
                    var iotproviderInstanceField = IoTConnector.ApiUtils.GetODataAttribute(IoTConnector.Common.Constants.EntityLogicalNames.DeviceEntityLogicalName, IoTConnector.Common.Constants.Msdyn_iotproviderinstance.EntityLogicalName);
                    var iotproviderField = IoTConnector.ApiUtils.GetODataAttribute(IoTConnector.Common.Constants.EntityLogicalNames.DeviceEntityLogicalName, IoTConnector.Common.Constants.Msdyn_iotprovider.EntityLogicalName);
                    var expand = IoTConnector.Common.Constants.Msdyn_iotdevice.IoTProviderInstance + "($select=" + IoTConnector.Common.Constants.Msdyn_iotproviderinstance.AttributeTimeSeriesInsightsURL + "," + iotproviderField + ")";
                    IoTConnector.ApiUtils.CrudApiSDK.retrieveRecord(deviceId, IoTConnector.Common.Constants.EntityLogicalNames.DeviceEntityLogicalName, iotproviderInstanceField, expand, function (entity) { return __awaiter(_this, void 0, void 0, function () {
                        var showDeviceInsightsTab, providerInstance, timeseriesUrl, provider, actionName, defaultCustomActionName;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    showDeviceInsightsTab = false;
                                    if (!entity) return [3 /*break*/, 2];
                                    providerInstance = entity[IoTConnector.Common.Constants.Msdyn_iotdevice.IoTProviderInstance];
                                    timeseriesUrl = providerInstance[IoTConnector.Common.Constants.Msdyn_iotproviderinstance.AttributeTimeSeriesInsightsURL] || "";
                                    return [4 /*yield*/, IoTConnector.Utils.FormUtils.retrieveProvider(providerInstance["_msdyn_iotprovider_value"], IoTConnector.Common.Constants.Msdyn_iotprovider.AttributeqQueryDeviceReadingSaction)];
                                case 1:
                                    provider = _a.sent();
                                    actionName = provider[IoTConnector.Common.Constants.Msdyn_iotprovider.AttributeqQueryDeviceReadingSaction] || "";
                                    defaultCustomActionName = IoTConnector.Common.Constants.Msdyn_iotprovider.IoTHubQueryReadingsAction;
                                    //If actionName is same OOB name, then ensure timeseriesUrl is populated OR
                                    //If actionName populated but is not same as OOB, we dont check timeseriesUrl, but show the tab and any missing config will be handled by the 3rd party plugin code
                                    if (actionName !== "" && ((actionName === defaultCustomActionName && timeseriesUrl !== "") || (actionName !== defaultCustomActionName))) {
                                        showDeviceInsightsTab = true;
                                    }
                                    _a.label = 2;
                                case 2:
                                    resolve(showDeviceInsightsTab);
                                    return [2 /*return*/];
                            }
                        });
                    }); }, function (err) {
                        err && IoTConnector.ApiUtils.LogMessageInConsole(err.message);
                        resolve(false);
                    });
                });
            };
            // Check pre validation conditions and show or hide device insights tab based on availabilty of tab, fields (device id or device or alert). 
            // tab = Tab to be shown or hidden
            // guidorid = device guid or alert guid or deviceid.
            // field = can be device ID, device, Alert fields
            // deviceOrAlert = We have different fetchXml queries based on device guid or alert guid or device id sent. This field is used to decide which fetchXml function is to be called.
            FormUtils.preValidateShowHideDeviceInsightsTab = function (tab, guidorid, field, deviceOrAlert) {
                if (tab) {
                    if (field && field.getValue()) {
                        // If we have deviceGuid then proceed with logic to show or hide device insights tab.
                        if (guidorid) {
                            // Show or Hide Device Insights (Preview) tab based on device having iot provider with OOB and TSI deployed
                            // or custom action.
                            IoTConnector.Utils.FormUtils.showHideDeviceInsightsTab(tab, guidorid, deviceOrAlert);
                        }
                        else {
                            tab.setVisible(false);
                        }
                    }
                    else {
                        tab.setVisible(false);
                    }
                }
            };
            // Show or Hide tab if the linked device has a provider with OOB action name and TSI url. 
            // If both exist, then we will show the tab.If it is a 3rd party action name, we will show the tab. If it is OOB action name but no tsi url, then we will hide the tab.
            // tab = Tab to be shown or hidden
            // guidorid = device guid or alert guid or deviceid.
            // deviceOrAlert = We have different fetchXml queries based on device guid or alert guid or device id sent. This field is used to decide which fetchXml function is to be called.
            FormUtils.showHideDeviceInsightsTab = function (tab, guidorid, deviceOrAlert) {
                if (guidorid) {
                    // Device Guid
                    if (deviceOrAlert === IoTConnector.Common.DeviceKeyType.DeviceGuid) {
                        IoTConnector.Utils.FormUtils.shouldDeviceInsightsBeVisible(guidorid).then(function (showDeviceInsights) { return tab.setVisible(showDeviceInsights); });
                    }
                    // Alert Guid
                    else if (deviceOrAlert === IoTConnector.Common.DeviceKeyType.AlertGuid) {
                        //Determine showDeviceInsightsTab based on Device Insights Config
                        var deviceField_1 = IoTConnector.ApiUtils.GetODataAttribute(IoTConnector.Common.Constants.EntityLogicalNames.DeviceEntityLogicalName, IoTConnector.Common.Constants.ConnectDeviceDialog.FieldMsdynDevice);
                        IoTConnector.ApiUtils.CrudApiSDK.retrieveRecord(guidorid, IoTConnector.Common.Constants.Msdyn_iotalert.EntityLogicalName, deviceField_1, null, function (alert) {
                            if (alert && alert[deviceField_1]) {
                                IoTConnector.Utils.FormUtils.shouldDeviceInsightsBeVisible(alert[deviceField_1]).then(function (showDeviceInsights) { return tab.setVisible(showDeviceInsights); });
                            }
                            else {
                                tab.setVisible(false);
                            }
                        }, function (err) {
                            err && IoTConnector.ApiUtils.LogMessageInConsole(err.message);
                            tab.setVisible(false);
                        });
                    }
                    // Device ID
                    else if (deviceOrAlert === IoTConnector.Common.DeviceKeyType.DeviceID) {
                        //Determine showDeviceInsightsTab based on Device Insights Config
                        var IoTdeviceIdField_1 = IoTConnector.Common.Constants.Msdyn_iotdevice.AttributeEntityId;
                        IoTConnector.Utils.FormUtils.retrieveDeviceByDeviceId(guidorid, IoTdeviceIdField_1).then(function (device) {
                            if (device && device[IoTdeviceIdField_1]) {
                                IoTConnector.Utils.FormUtils.shouldDeviceInsightsBeVisible(device[IoTdeviceIdField_1]).then(function (showDeviceInsights) { return tab.setVisible(showDeviceInsights); });
                            }
                            else {
                                tab.setVisible(false);
                            }
                        }, function (err) {
                            tab.setVisible(false);
                        });
                    }
                    else {
                        //Placeholder to implement other fetchXml logic based on the requirement
                        tab.setVisible(false);
                    }
                }
                else {
                    tab.setVisible(false);
                }
            };
            // This method is used to get guid from field lookup.
            // @param field: Field for which we get record's guid
            FormUtils.getGuidFromField = function (field) {
                var fieldValue = field != null ? field.getValue() : null;
                return (fieldValue && fieldValue[0] && fieldValue[0].id) ? fieldValue[0].id : "";
            };
            // This method is used to display/hide fields based on the suggested priority field on Alert Form.
            // @param field: Field for which we want to display/hide
            // @param sugprivalues: Suggested priority values for which to display the field
            FormUtils.displayHideAlertFieldBasedOnSuggestedPriority = function (formContext, field, sugprivalues) {
                if (field) {
                    var alertPriorityField = formContext.getAttribute(IoTConnector.Common.Constants.Msdyn_iotalert.AttributeAlertPriority);
                    var alertPriorityValue = alertPriorityField !== null ? alertPriorityField.getValue() : null;
                    // Check if priority is equal to a value in the list. ex: for priority score, pri needs to be High/Low. for inc type, pri needs to be high
                    var showscore = sugprivalues.indexOf(alertPriorityValue) > -1;
                    field.setVisible(showscore); // Will be false if priority is not in the list of sugprivales. Field will stay hidden.
                }
            };
            // Prevent auto save feature
            FormUtils.preventAutoSave = function (eventArgs) {
                // These enum values are coming from ths documentation: https://docs.microsoft.com/en-us/dynamics365/customerengagement/on-premises/customize/manage-auto-save
                if (eventArgs.getSaveMode() === 70 /* AutoSave */) {
                    eventArgs.preventDefault();
                }
            };
            // Show or Hide Summary visualization section based on field.
            // field = Can be Device or Alert field
            FormUtils.showHideSummaryVisualizationBasedOnField = function (generalTab, field) {
                if (generalTab && generalTab.sections) {
                    var section = generalTab.sections.get(IoTConnector.Common.Constants.SectionNames.DeviceSummaryVisualizationSection);
                    if (section && field && field.getValue()) {
                        section.setVisible(true);
                    }
                    else if (section) {
                        section.setVisible(false);
                    }
                } // else condition not needed as the section is hidden by default.
            };
            FormUtils.setFieldToShow = function (formContext, field, show) {
                if (field == null) {
                    return;
                }
                var fieldControlToShowOrHide = formContext.getControl(field);
                if (fieldControlToShowOrHide) {
                    fieldControlToShowOrHide.setVisible(show);
                }
            };
            FormUtils.lockField = function (formContext, field, toLock) {
                var fieldControlToLock = formContext.getControl(field);
                if (fieldControlToLock) {
                    fieldControlToLock.setDisabled(toLock);
                }
            };
            FormUtils.setFieldToRequired = function (formContext, field, isRequired) {
                if (field == null) {
                    return;
                }
                var attributeToSetRequirement = formContext.getAttribute(field);
                if (attributeToSetRequirement) {
                    attributeToSetRequirement.setRequiredLevel(isRequired ? IoTConnector.Common.Constants.FormConstants.Required : IoTConnector.Common.Constants.FormConstants.NotRequired);
                }
            };
            return FormUtils;
        }());
        Utils.FormUtils = FormUtils;
    })(Utils = IoTConnector.Utils || (IoTConnector.Utils = {}));
})(IoTConnector || (IoTConnector = {}));
/*! WARNING! Do not update this file manually! Manual update of this file is not supported and will likely lead to issues. In addition, future solution upgrades wont apply to manually edited files. */
/// <reference path="../Common/Constants.ts" />
/// <reference path="../Utils/ServiceEndpointUtils.ts" />
/// <reference path="../Utils/ClientUtils.ts" />
/// <reference path="../Utils/ODataUtils.ts" />
/// <reference path="../Utils/FormUtils.ts" />
/// <reference path="../Utils/ApiUtils/Common.ts" />
/// <reference path="../Utils/ApiUtils/WebApiSDK.ts" />
var msdyn = msdyn || {};
msdyn.IoTDeviceForm = msdyn.IoTDeviceForm || {};
msdyn.IoTDeviceForm.DeviceStatus = "DeviceStatusSection";
msdyn.IoTDeviceForm.deviceID = "msdyn_deviceid";
msdyn.IoTDeviceForm.formContext = msdyn.IoTDeviceForm.formContext || {};
msdyn.IoTDeviceForm.onLoad = function (executionContext) {
    msdyn.IoTDeviceForm.formContext = executionContext.getFormContext();
    msdyn.IoTDeviceForm.deviceIDField = msdyn.IoTDeviceForm.formContext.getAttribute(msdyn.IoTDeviceForm.deviceID);
    var generalTab = msdyn.IoTDeviceForm.formContext.ui.tabs.get(0);
    var deviceStatusSection = generalTab ? generalTab.sections.get(msdyn.IoTDeviceForm.DeviceStatus) : null;
    if (msdyn.IoTDeviceForm.formContext.ui.getFormType() !== 1 /* Create */) {
        if (!IoTConnector.ApiUtils.IsMobile()) {
            var powerBISection = generalTab ? generalTab.sections.get(IoTConnector.Common.Constants.FormConstants.ConnectedDeviceReadings) : null;
            powerBISection && powerBISection.setVisible(true);
        }
        IoTConnector.Utils.ServiceEndpointUtils.isValidEndpoint().then(function (isValid) {
            if (!isValid) {
                deviceStatusSection && deviceStatusSection.setVisible(false);
            }
        });
    }
    else {
        deviceStatusSection && deviceStatusSection.setVisible(false);
        // Autopopulate Iot Provider Instance field to the default from IoTSettings (if there is one) for new devices
        var settings = IoTConnector.Common.Constants.Msdyn_iotsettings;
        var instance = IoTConnector.Common.Constants.Msdyn_iotproviderinstance;
        var iotSettingsEntityNamePlural = settings.EntityLogicalName + "es";
        var iotSettingsId = settings.AttributeId;
        var defaultInstanceField_1 = settings.AttributeDefaultProviderInstance;
        var instanceLogicalName_1 = instance.EntityLogicalName;
        var instanceIdField_1 = instance.AttributeId;
        var instanceNameField_1 = instance.AttributeName;
        var select = settings.AttributeDefaultProviderInstance;
        var expand = defaultInstanceField_1 + "($select=" + instanceIdField_1 + "," + instanceNameField_1 + ")";
        var filter = "";
        IoTConnector.Utils.ODataUtils.getEntities(iotSettingsEntityNamePlural, iotSettingsId, filter, select, expand, function (data) {
            if (data && data[defaultInstanceField_1]) {
                var providerInstanceLookup = new Array();
                providerInstanceLookup[0] = {
                    id: data[defaultInstanceField_1][instanceIdField_1],
                    name: data[defaultInstanceField_1][instanceNameField_1],
                    entityType: instanceLogicalName_1
                };
                var instanceAttr = msdyn.IoTDeviceForm.formContext.getAttribute(instanceLogicalName_1);
                if (instanceAttr) {
                    instanceAttr.setValue(providerInstanceLookup);
                }
            }
        }, function (err) {
            if (err && err.error) {
                console.error(err.error.message);
            }
        });
    }
    // Logic to show or hide Device Insights (Preview) tab on form load based on value in Device ID and OOB action name and TSI url.
    msdyn.IoTDeviceForm.ShoworHideDeviceInsights();
    // Logic to show Device Summary Visualization section if Device ID is not empty. If it is empty, this section will be hidden by default.
    msdyn.IoTDeviceForm.ShoworHideDeviceSummaryVisualizationSection();
};
// Show or Hide Device Insights (Preview) tab based on value in Device ID field and device having iot provider with OOB and TSI deployed or custom action name.
msdyn.IoTDeviceForm.ShoworHideDeviceInsights = function () {
    var deviceInsightsTab = msdyn.IoTDeviceForm.formContext.ui.tabs.get(IoTConnector.Common.Constants.TabNames.DeviceInsightsTab);
    var deviceGuid = msdyn.IoTDeviceForm.formContext.data.entity.getId();
    // Show or Hide Device Insights (Preview) tab based on device having iot provider with OOB and TSI deployed
    // or custom action.
    IoTConnector.Utils.FormUtils.preValidateShowHideDeviceInsightsTab(deviceInsightsTab, deviceGuid, msdyn.IoTDeviceForm.deviceIDField, IoTConnector.Common.DeviceKeyType.DeviceGuid);
};
// Logic to show Device Summary Visualization section if Device ID is not empty. If it is empty or user in offline mode, this section will be hidden by default.
msdyn.IoTDeviceForm.ShoworHideDeviceSummaryVisualizationSection = function () {
    var generalTab = msdyn.IoTDeviceForm.formContext.ui.tabs.get(IoTConnector.Common.Constants.TabNames.DeviceFormGeneralTab);
    // If device ID field is available, section is available, device ID has value then we will show this section.
    IoTConnector.Utils.FormUtils.showHideSummaryVisualizationBasedOnField(generalTab, msdyn.IoTDeviceForm.deviceIDField);
};
