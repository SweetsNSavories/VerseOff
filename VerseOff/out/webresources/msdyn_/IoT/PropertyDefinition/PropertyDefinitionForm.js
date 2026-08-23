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
/*! WARNING! Do not update this file manually! Manual update of this file is not supported and will likely lead to issues. In addition, future solution upgrades wont apply to manually edited files. */
/// <reference path="../../../../Scripts/typings/xrm/xrm.d.ts"/>
/// <reference path="../Utils/ClientUtils.ts" />
/// <reference path="../Common/Constants.ts"/>
var msdyn = msdyn || {};
msdyn.PropertyDefinitionForm = msdyn.PropertyDefinitionForm || {};
msdyn.PropertyDefinitionForm.formContext = msdyn.PropertyDefinitionForm.formContext || {};
// must be fired onLoad of form
msdyn.PropertyDefinitionForm.onTypeChange = function (executionContext) {
    msdyn.PropertyDefinitionForm.formContext = executionContext.getFormContext();
    var typeField = msdyn.PropertyDefinitionForm.formContext.getAttribute(IoTConnector.Common.Constants.PropertyDefinition.typeFieldName);
    var type = typeField.getValue();
    // If object type, show the child parameters subgrid and hide the editable, visible and props fields as they will be set on child params.
    setVisibility(type && type === (IoTConnector.Common.Constants.PropertyDefinition.ObjectTypeOptionSetValue));
    function setVisibility(isObject) {
        var editableFieldControl = msdyn.PropertyDefinitionForm.formContext.getControl(IoTConnector.Common.Constants.PropertyDefinition.editableFieldName);
        var visibleFieldControl = msdyn.PropertyDefinitionForm.formContext.getControl(IoTConnector.Common.Constants.PropertyDefinition.visibleFieldName);
        var uciPropsFieldControl = msdyn.PropertyDefinitionForm.formContext.getControl(IoTConnector.Common.Constants.PropertyDefinition.uciPropsFieldName);
        var childParamsSection = msdyn.PropertyDefinitionForm.formContext.ui.tabs.get("General").sections.get(IoTConnector.Common.Constants.PropertyDefinition.childParamsSectionName);
        childParamsSection.setVisible(isObject);
        editableFieldControl.setVisible(!isObject);
        visibleFieldControl.setVisible(!isObject);
        uciPropsFieldControl.setVisible(!isObject);
    }
};
