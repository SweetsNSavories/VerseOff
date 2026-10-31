var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
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
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var IsPdfEnabledForEntityRequest = (function () {
        function IsPdfEnabledForEntityRequest(enityLogicalName) {
            this.PDFSettingsEntityName = enityLogicalName;
        }
        IsPdfEnabledForEntityRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                operationName: "IsPdfEnabledForEntity",
                operationType: 0 /* Action */,
                parameterTypes: {
                    "PDFSettingsEntityName": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1 /* PrimitiveType */,
                    }
                },
            };
            return metadata;
        };
        return IsPdfEnabledForEntityRequest;
    }());
    ODataContract.IsPdfEnabledForEntityRequest = IsPdfEnabledForEntityRequest;
})(ODataContract || (ODataContract = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../../TypeDefinitions/AppCommon/Telemetry/TelemetryLibrary.d.ts" />
/// <reference path="../ClientCommon/Sales_ClientCommon.d.ts" />
/// <reference path="../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="./DataContracts/IsPdfEnabledForEntity.ts" />
var Sales;
(function (Sales) {
    var AdminSettingsWebResource = (function () {
        function AdminSettingsWebResource() {
            var _this = this;
            this.fieldsTobeSelected = [];
            this.salesAdminPDFGenerationSettings = "SalesAdminPDFGenerationSettings";
            this.ispdfgenerationenabledSettingName = "ispdfgenerationenabled";
            this.initPDFGenerationSetting = { "account": false, "contact": false, "lead": false, "opportunity": false, "quote": false, "salesorder": false, "invoice": false };
            this.ispricelistmandatorySettingName = "ispricelistmandatory";
            this.pdfWave2FeatureFCB = "PDF2020Wave2Updates";
            this.pdfWave2PreviewFCB = "October2020Update";
            this.onLoad = function (fieldsTobeSelected) {
                _this.fieldsTobeSelected = fieldsTobeSelected;
                var setHandler = _this.setFormDataMDD;
                if (fieldsTobeSelected.length == 1 && fieldsTobeSelected[0] === _this.ispdfgenerationenabledSettingName) {
                    setHandler = _this.setFormDataMDDForPDFGeneration;
                }
                if (fieldsTobeSelected.length > 0 && fieldsTobeSelected.indexOf(_this.ispricelistmandatorySettingName) > -1) {
                    setHandler = _this.setFormDataMDDForPricelistOptionalAndOthers;
                }
                _this.getRequestPromise("GET", "?$select=" + _this.fieldsTobeSelected.join())
                    .then(function (data) {
                    setHandler(data);
                }, function (err) {
                    _this.handleError(err, false, {});
                });
            };
            this.okAction = function () {
                var getHandler = _this.getFormDataMDD;
                if (_this.fieldsTobeSelected.length == 1 && _this.fieldsTobeSelected[0] === _this.ispdfgenerationenabledSettingName) {
                    getHandler = _this.getFormDataMDDForPDFGeneration;
                }
                if (_this.fieldsTobeSelected.length > 0 && _this.fieldsTobeSelected.indexOf(_this.ispricelistmandatorySettingName) > -1) {
                    getHandler = _this.getFormDataMDDForPricelistOptionalAndOthers;
                }
                var data = getHandler();
                if (!_this.isValid() || Object.keys(data).length === 0)
                    return;
                _this.getRequestPromise("PATCH", data)
                    .then(function (res) {
                    _this.handleSuccess(res, true, data);
                }, function (err) {
                    _this.handleError(err, true, data);
                });
            };
            this.isValid = function () {
                for (var key in _this.fieldsTobeSelected) {
                    var control = Xrm.Page.data.attributes.get(_this.fieldsTobeSelected[key]);
                    if (control != null && !control.isValid())
                        return false;
                }
                return true;
            };
            this.closeDialog = function () {
                Xrm.Page.ui.close();
            };
            this.isPdfCommandEnabled = function (entity) { return __awaiter(_this, void 0, void 0, function () {
                var isPdfSettingEnabled, pdfPromise, hasPDFPromise, settingObject, getPDFSettingForEntityRequest, data, settingObject, settingValue, err_1, data, settingObject, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 12, , 13]);
                            // Verifying saved promise to eliminate duplicate api calls
                            try {
                                isPdfSettingEnabled = sessionStorage.getItem(entity + "_isPdfSettingEnabled");
                                if (isPdfSettingEnabled) {
                                    return [2 /*return*/, Boolean(isPdfSettingEnabled === "true")];
                                }
                            }
                            catch (ex) {
                                Xrm.Reporting.reportFailure("Create PDF & Email As PDF ribbon command load", Error("Error while reading PdfSetting from Session Storage for Existing PDF ribbon command is enabled for entity: " + entity + ". Error: " + ex.Message));
                            }
                            pdfPromise = Mscrm.cachedPdf;
                            if (!pdfPromise) return [3 /*break*/, 3];
                            return [4 /*yield*/, pdfPromise];
                        case 1:
                            hasPDFPromise = _a.sent();
                            return [4 /*yield*/, hasPDFPromise.json()];
                        case 2:
                            settingObject = _a.sent();
                            this.setSessionStorage(entity + "_isPdfSettingEnabled", settingObject["isPdfSettingEnabled"], entity);
                            return [2 /*return*/, settingObject["isPdfSettingEnabled"]];
                        case 3:
                            if (!(Xrm.Internal.isFeatureEnabled(this.pdfWave2PreviewFCB) && Xrm.Internal.isFeatureEnabled(this.pdfWave2FeatureFCB))) return [3 /*break*/, 9];
                            _a.label = 4;
                        case 4:
                            _a.trys.push([4, 7, , 8]);
                            getPDFSettingForEntityRequest = new ODataContract.IsPdfEnabledForEntityRequest(entity);
                            Mscrm.cachedPdf = Xrm.WebApi.online.execute(getPDFSettingForEntityRequest);
                            return [4 /*yield*/, Mscrm.cachedPdf];
                        case 5:
                            data = _a.sent();
                            return [4 /*yield*/, data.json()];
                        case 6:
                            settingObject = _a.sent();
                            settingValue = settingObject["isPdfSettingEnabled"];
                            this.setSessionStorage(entity + "_isPdfSettingEnabled", settingValue, entity);
                            return [2 /*return*/, settingValue];
                        case 7:
                            err_1 = _a.sent();
                            Xrm.Reporting.reportFailure("Create PDF & Email As PDF ribbon command load", Error("Error while evaluating if Existing PDF ribbon command is enabled for entity: " + entity + ". Error: " + err_1.Message));
                            return [2 /*return*/, false];
                        case 8: return [3 /*break*/, 11];
                        case 9: return [4 /*yield*/, this.getRequestPromise("GET", "?$select=" + this.ispdfgenerationenabledSettingName)];
                        case 10:
                            data = _a.sent();
                            settingObject = JSON.parse(data[this.ispdfgenerationenabledSettingName]);
                            if (settingObject != null && settingObject[entity] != null && settingObject[entity])
                                return [2 /*return*/, true];
                            return [2 /*return*/, false];
                        case 11: return [3 /*break*/, 13];
                        case 12:
                            err_2 = _a.sent();
                            Xrm.Reporting.reportFailure("Create PDF & Email As PDF ribbon command loading issue", Error("Error while evaluating if Existing PDF ribbon command is enabled for entity: " + entity + ". Error: " + err_2.Message));
                            return [2 /*return*/, false];
                        case 13: return [2 /*return*/];
                    }
                });
            }); };
            this.setFormDataMDD = function (data) {
                _this.initalData = data;
                for (var key in data) {
                    var control = Xrm.Page.data.attributes.get(key);
                    if (control) {
                        if (_this.isOptionSet(key)) {
                            control.setValue(data[key] ? "1" : "0");
                        }
                        else {
                            control.setValue(data[key]);
                        }
                    }
                }
            };
            this.setFormDataMDDForPricelistOptionalAndOthers = function (data) {
                _this.initalData = data;
                for (var key in data) {
                    var control = Xrm.Page.data.attributes.get(key);
                    if (control) {
                        if (_this.isOptionSet(key)) {
                            if (key == _this.ispricelistmandatorySettingName) {
                                control.setValue(data[key] ? "0" : "1");
                            }
                            else {
                                control.setValue(data[key] ? "1" : "0");
                            }
                        }
                        else {
                            control.setValue(data[key]);
                        }
                    }
                }
            };
            this.setFormDataMDDForPDFGeneration = function (data) {
                _this.initalData = data;
                var settingObject = _this.isPdfSettingObjectEmpty(data) ? _this.initPDFGenerationSetting : JSON.parse(data[_this.ispdfgenerationenabledSettingName]);
                for (var key in settingObject) {
                    var control = Xrm.Page.data.attributes.get(_this.ispdfgenerationenabledSettingName + "_" + key);
                    if (control) {
                        var value = settingObject[key];
                        control.setValue(value);
                    }
                }
            };
            this.isPdfSettingObjectEmpty = function (data) {
                if (data[_this.ispdfgenerationenabledSettingName].trim() === "")
                    return true;
                try {
                    var ispdfgenerationenabledSettingObject = JSON.parse(data[_this.ispdfgenerationenabledSettingName]);
                    if (Object.keys(ispdfgenerationenabledSettingObject).length == 0)
                        return true;
                    else
                        return false;
                }
                catch (e) {
                    return true;
                }
            };
            this.getFormDataMDD = function () {
                var data = {};
                for (var key in _this.fieldsTobeSelected) {
                    var control = Xrm.Page.data.attributes.get(_this.fieldsTobeSelected[key]);
                    if (control != null && control.getValue() != _this.initalData[_this.fieldsTobeSelected[key]]) {
                        // this will work in case of "1"/"0" or true/false as value
                        // these are custom control bind to optionset 
                        // so need to convert value back to boolean
                        if (_this.isOptionSet(_this.fieldsTobeSelected[key])) {
                            data[_this.fieldsTobeSelected[key]] = (control.getValue() === '1' || control.getValue() === true) ? true : false;
                        }
                        else {
                            data[_this.fieldsTobeSelected[key]] = control.getValue();
                        }
                    }
                }
                return data;
            };
            this.getFormDataMDDForPricelistOptionalAndOthers = function () {
                var data = {};
                for (var key in _this.fieldsTobeSelected) {
                    var control = Xrm.Page.data.attributes.get(_this.fieldsTobeSelected[key]);
                    if (_this.fieldsTobeSelected[key] == _this.ispricelistmandatorySettingName) {
                        // since the setting value and control value are negation of each other, verfying by equating the initial data
                        if (control != null && (control.getValue() == _this.initalData[_this.fieldsTobeSelected[key]]) && (_this.isOptionSet(_this.fieldsTobeSelected[key]))) {
                            data[_this.fieldsTobeSelected[key]] = (control.getValue() === '1' || control.getValue() === true) ? false : true;
                        }
                    }
                    else {
                        if (control != null && control.getValue() != _this.initalData[_this.fieldsTobeSelected[key]]) {
                            // this will work in case of "1"/"0" or true/false as value
                            // these are custom control bind to optionset 
                            // so need to convert value back to boolean
                            if (_this.isOptionSet(_this.fieldsTobeSelected[key])) {
                                data[_this.fieldsTobeSelected[key]] = (control.getValue() === '1' || control.getValue() === true) ? true : false;
                            }
                            else {
                                data[_this.fieldsTobeSelected[key]] = control.getValue();
                            }
                        }
                    }
                }
                return data;
            };
            this.getFormDataMDDForPDFGeneration = function () {
                var data = __assign({}, _this.initPDFGenerationSetting);
                var settingObject = _this.isPdfSettingObjectEmpty(_this.initalData) ? _this.initPDFGenerationSetting : JSON.parse(_this.initalData[_this.ispdfgenerationenabledSettingName]);
                for (var key in settingObject) {
                    var control = Xrm.Page.data.attributes.get(_this.ispdfgenerationenabledSettingName + "_" + key);
                    if (control != null) {
                        data[key] = (control.getValue() === '1' || control.getValue() === true) ? true : false;
                    }
                }
                return _a = {}, _a[_this.ispdfgenerationenabledSettingName] = JSON.stringify(data), _a;
                var _a;
            };
        }
        AdminSettingsWebResource.prototype.getRequestPromise = function (method, data) {
            var orgSettings = Xrm.Utility.getGlobalContext().organizationSettings;
            var organization = {
                id: orgSettings.organizationId,
                entityType: Sales.EntityNames.Organization
            };
            switch (method) {
                case "GET":
                    return Xrm.WebApi.retrieveRecord(organization.entityType, organization.id, data);
                case "PATCH":
                    return Xrm.WebApi.updateRecord(organization.entityType, organization.id, data);
            }
        };
        AdminSettingsWebResource.prototype.isOptionSet = function (control) {
            switch (control) {
                case "createproductswithoutparentinactivestate":
                case "useinbuiltrulefordefaultpricelistselection":
                case "oobpricecalculationenabled":
                case "iscontextualemailenabled":
                case "ispricelistmandatory":
                case "isnewaddproductexperienceenabled":
                    return true;
                default:
                    return false;
            }
        };
        AdminSettingsWebResource.prototype.handleError = function (msg, isSave, delta) {
            var alertStrings = {
                text: isSave ? Sales.StringProvider.getResourceString("Admin_Settings_Error_Saving_Data") : Sales.StringProvider.getResourceString("Admin_Settings_Error_Loading_Data")
            };
            Xrm.Navigation.openAlertDialog(alertStrings, null);
        };
        AdminSettingsWebResource.prototype.handleSuccess = function (res, isSave, delta) {
            if (isSave) {
                var telemetryEventParams = [];
                for (var key in delta) {
                    this.initalData[key] = delta[key];
                    telemetryEventParams.push({ name: key, value: delta[key] });
                }
                if (Xrm.UI.addGlobalNotification) {
                    Xrm.UI.addGlobalNotification(1, 1, Sales.StringProvider.getResourceString("Admin_Settings_Saved_Successfully"), null, null, null);
                }
                this.reportSuccess(this.salesAdminPDFGenerationSettings, telemetryEventParams);
            }
        };
        /**
        * Function to log report success telemetry for UCI.
        */
        AdminSettingsWebResource.prototype.reportSuccess = function (componentName, eventParams) {
            if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Reporting)) {
                Xrm.Reporting.reportSuccess(componentName, eventParams);
            }
        };
        /**
        * Function to store data into session
        */
        AdminSettingsWebResource.prototype.setSessionStorage = function (key, value, entity) {
            try {
                sessionStorage.setItem(key, value);
            }
            catch (ex) {
                Xrm.Reporting.reportFailure("setSessionStorage", Error("Error while updating " + key + " to Session Storage for entity: " + entity + ". Error: " + ex.Message));
            }
        };
        return AdminSettingsWebResource;
    }());
    Sales.AdminSettingsWebResource = AdminSettingsWebResource;
})(Sales || (Sales = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="AdminSettingsWebResource.ts" />
var Sales;
(function (Sales) {
    var AdminSettingsLibrary = (function () {
        function AdminSettingsLibrary() {
            var AdminSettings = new Sales.AdminSettingsWebResource();
            var global = window;
            var mscrm = global.Mscrm;
            mscrm.AdminSettings = AdminSettings;
        }
        return AdminSettingsLibrary;
    }());
    Sales.AdminSettingsLibrary = AdminSettingsLibrary;
    var AdminSettings = (function () {
        function AdminSettings() {
        }
        return AdminSettings;
    }());
    AdminSettings.Instance = new AdminSettingsLibrary();
    AdminSettings.ctor = (function () {
        // These are needed on the window because of "general" command bar actions calling hard-coded methods with some conditions
    })();
    Sales.AdminSettings = AdminSettings;
})(Sales || (Sales = {}));
