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
var AppCommon;
(function (AppCommon) {
    'use strict';
    var ContextualEmailConstants = (function () {
        function ContextualEmailConstants() {
        }
        return ContextualEmailConstants;
    }());
    // Email form
    ContextualEmailConstants.BulkEmailFormId = "5e0f2e7e-df92-eb11-b1ac-00224802b8a3";
    ContextualEmailConstants.EmailTabName = "Email";
    ContextualEmailConstants.EmailMainSectionName = "Email_MainSection";
    ContextualEmailConstants.EmailPreviewSectionName = "Email_PreviewSection";
    ContextualEmailConstants.TemplateIdAttributeName = "templateid";
    ContextualEmailConstants.SubjectAttributeName = "subject";
    ContextualEmailConstants.DescriptionAttributeName = "description";
    ContextualEmailConstants.PreviewSubjectControlId = "previewsubject";
    ContextualEmailConstants.PreviewDescriptionControlId = "previewdescription";
    ContextualEmailConstants.SubjectControlId = "subject";
    ContextualEmailConstants.DescriptionControlId = "description";
    ContextualEmailConstants.RegardingObjectIdAttributeName = "regardingobjectid";
    ContextualEmailConstants.ToAttributeName = "to";
    ContextualEmailConstants.RecipientListAttributeName = "msdyn_recipientlist";
    // Email template
    ContextualEmailConstants.TemplateEntityName = "template";
    ContextualEmailConstants.RetrieveTemplateOptionalQuery = "?$select=subjectsafehtml,safehtml";
    // Entity
    ContextualEmailConstants.LookupLogicalName = "@Microsoft.Dynamics.CRM.lookuplogicalname";
    ContextualEmailConstants.SystemUserEntityName = "systemuser";
    ContextualEmailConstants.BulkEmailDataParams = "bulkEmailDataParams";
    AppCommon.ContextualEmailConstants = ContextualEmailConstants;
})(AppCommon || (AppCommon = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var SendBulkEmailRequest = (function () {
        function SendBulkEmailRequest(selectedEntities) {
            this.SelectedEntities = selectedEntities;
        }
        SendBulkEmailRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "SelectedEntities": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1 /* PrimitiveType */,
                    },
                },
                operationName: "SendBulkEmail",
                operationType: 0,
            };
            return metadata;
        };
        return SendBulkEmailRequest;
    }());
    ODataContract.SendBulkEmailRequest = SendBulkEmailRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var ScheduleBulkMailRequest = (function () {
        function ScheduleBulkMailRequest(selectedEntities) {
            this.SelectedEntities = selectedEntities;
        }
        ScheduleBulkMailRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "SelectedEntities": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1 /* PrimitiveType */,
                    },
                },
                operationName: "ScheduleBulkEmail",
                operationType: 0,
            };
            return metadata;
        };
        return ScheduleBulkMailRequest;
    }());
    ODataContract.ScheduleBulkMailRequest = ScheduleBulkMailRequest;
})(ODataContract || (ODataContract = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var AppCommon;
(function (AppCommon) {
    var ContextualEmailTelemetryReporter = (function () {
        function ContextualEmailTelemetryReporter() {
        }
        ContextualEmailTelemetryReporter.getDataParams = function (paramsArray) {
            var data = {};
            data["scenario"] = "Contextual Email";
            if (paramsArray) {
                paramsArray.forEach(function (param) {
                    data[param.name] = param.value;
                });
            }
            return data;
        };
        ContextualEmailTelemetryReporter.ReportComponentSuccess = function (context, methodName, action, actionOn, message, paramsArray) {
            try {
                // push data to SITraceCIEvent
                ContextualEmailTelemetryReporter.SITelemetryLogger && ContextualEmailTelemetryReporter.SITelemetryLogger.ReportUserAction({
                    context: context,
                    methodName: methodName,
                    action: action,
                    actionOn: actionOn,
                    message: message,
                    customControlId: ContextualEmailTelemetryReporter.controlName,
                    area: ContextualEmailTelemetryReporter.Area,
                    data: ContextualEmailTelemetryReporter.getDataParams()
                });
            }
            catch (ex) {
                ContextualEmailTelemetryReporter.reportUCIError(context, ex);
            }
        };
        ContextualEmailTelemetryReporter.ReportInfo = function (context, methodName, action, actionOn, message, paramsArray) {
            try {
                // push data to SITraceBIEvent
                ContextualEmailTelemetryReporter.SITelemetryLogger && ContextualEmailTelemetryReporter.SITelemetryLogger.ReportInfo({
                    context: context,
                    methodName: methodName,
                    action: action,
                    actionOn: actionOn,
                    message: message,
                    customControlId: ContextualEmailTelemetryReporter.controlName,
                    area: ContextualEmailTelemetryReporter.Area,
                    data: ContextualEmailTelemetryReporter.getDataParams(paramsArray)
                });
            }
            catch (ex) {
                ContextualEmailTelemetryReporter.reportUCIError(context, ex);
            }
        };
        ContextualEmailTelemetryReporter.ReportError = function (context, methodName, message, action, actionOn, paramsArray) {
            try {
                // push data to SITraceEvent
                ContextualEmailTelemetryReporter.SITelemetryLogger && ContextualEmailTelemetryReporter.SITelemetryLogger.ReportError({
                    context: context,
                    methodName: methodName,
                    message: message,
                    action: action,
                    actionOn: actionOn,
                    customControlId: ContextualEmailTelemetryReporter.controlName,
                    area: ContextualEmailTelemetryReporter.Area,
                    data: ContextualEmailTelemetryReporter.getDataParams(paramsArray)
                });
            }
            catch (ex) {
                ContextualEmailTelemetryReporter.reportUCIError(context, ex);
            }
        };
        ContextualEmailTelemetryReporter.reportUCIError = function (context, error) {
            try {
                context.reporting.reportFailure(ContextualEmailTelemetryReporter.controlName, Error(JSON.stringify(error)));
            }
            catch (ex) {
                console.error(ex);
            }
        };
        return ContextualEmailTelemetryReporter;
    }());
    ContextualEmailTelemetryReporter.Area = "Usability Improvements";
    ContextualEmailTelemetryReporter.controlName = "ContextualEmailControl";
    ContextualEmailTelemetryReporter.initialize = (function () {
        try {
            ContextualEmailTelemetryReporter.SITelemetryLogger = SIClientUtilityLogger && SIClientUtilityLogger.Telemetry ? SIClientUtilityLogger.Telemetry : null;
        }
        catch (ex) {
            console.error(ex);
        }
    })();
    AppCommon.ContextualEmailTelemetryReporter = ContextualEmailTelemetryReporter;
})(AppCommon || (AppCommon = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="./DataContracts/SendBulkMailRequest.ts" />
/// <reference path="./DataContracts/ScheduleBulkMailRequest.ts" />
/// <reference path="./Reporter.ts" />
/// <reference path="../../../TypeDefinitions/AppCommon/Localization/ResourceStringProvider.d.ts" />
/// <reference path="../../Client/Controls/ContextualEmailPopupManager/libs/PopupManager.d.ts" />
/// <reference path="../../Client/Controls/ContextualEmailPopupManager/TypeDefinitions/jsPanel.d.ts" />
var AppCommon;
(function (AppCommon) {
    "use strict";
    var ContextualBulkEmail = (function () {
        function ContextualBulkEmail() {
        }
        return ContextualBulkEmail;
    }());
    ContextualBulkEmail.isPreviewMode = false;
    // hiding email header section and apply default template on load event handler
    ContextualBulkEmail.onBulkEmailFormLoad = function (context) {
        var customActionStartTime = new Date();
        var formContext = context.getFormContext();
        if (ContextualBulkEmail.IsBulkEmailForm(formContext)) {
            ContextualBulkEmail.emailDataParams = ContextualBulkEmail.GetEmailDataParams();
            var globalContext = Xrm.Utility.getGlobalContext();
            var telemetryParams = [];
            telemetryParams.push({ name: "isBulkEmailMode", value: ContextualBulkEmail.emailDataParams && ContextualBulkEmail.emailDataParams.isbulkmode });
            if (ContextualBulkEmail.IsBulkMode()) {
                var formUi = formContext.ui;
                // TODO update version of Crm.ClientApiTypings to refer latest version of XrmClientApi.d.ts to use addOnPostSave which was added in later versions
                formContext.data.entity.addOnPostSave(ContextualBulkEmail.FormOnPostSave);
                if (formUi) {
                    telemetryParams.push({ name: "formId", value: formContext.ui.formSelector.getCurrentItem().getId() });
                    telemetryParams.push({ name: "formType", value: formContext.ui.getFormType() });
                    telemetryParams.push({ name: "isPreviewMode", value: ContextualBulkEmail.isPreviewMode });
                    if (formContext.ui.getFormType() == 1 /* Create */) {
                        telemetryParams.push({ name: "emailDataParams", value: JSON.stringify(ContextualBulkEmail.emailDataParams) });
                        ContextualBulkEmail.ApplyDefaultTemplate(formContext);
                        ContextualBulkEmail.SetRecipientList(formContext);
                        formUi.headerSection.setBodyVisible(false);
                        formUi.headerSection.setTabNavigatorVisible(false);
                        formUi.footerSection.setVisible(false);
                        var formControls = formUi.controls;
                        if (formControls) {
                            if (ContextualBulkEmail.IsPreviewMode(formContext)) {
                                formContext.ui.tabs.get(AppCommon.ContextualEmailConstants.EmailTabName).sections.get(AppCommon.ContextualEmailConstants.EmailMainSectionName).setVisible(false);
                                formContext.ui.tabs.get(AppCommon.ContextualEmailConstants.EmailTabName).sections.get(AppCommon.ContextualEmailConstants.EmailPreviewSectionName).setVisible(true);
                            }
                            else {
                                formContext.ui.tabs.get(AppCommon.ContextualEmailConstants.EmailTabName).sections.get(AppCommon.ContextualEmailConstants.EmailPreviewSectionName).setVisible(false);
                                formContext.ui.tabs.get(AppCommon.ContextualEmailConstants.EmailTabName).sections.get(AppCommon.ContextualEmailConstants.EmailMainSectionName).setVisible(true);
                            }
                        }
                    }
                }
                var duration = new Date().getTime() - customActionStartTime.getTime();
                telemetryParams.push({ name: "duration(in milliseconds)", value: duration });
                AppCommon.ContextualEmailTelemetryReporter.ReportInfo(globalContext, "onBulkEmailFormLoad", "bulkEmailFormLoad", "bulkEmailForm", null, telemetryParams);
            }
            else {
                AppCommon.ContextualEmailTelemetryReporter.ReportInfo(globalContext, "onBulkEmailFormLoad", "bulkEmailFormLoad", "bulkEmailForm", "Bulk email form opened directly outside of bulk mode", telemetryParams);
                var formNotificationMessage = AppCommon.ResourceStringProvider.getResourceString("ContextualBulkEmail_Form_Notification_Message");
                formContext.ui.setFormNotification(formNotificationMessage, "WARNING", "bulkEmailFormOpenedDirectly");
                formContext.ui.tabs.get(AppCommon.ContextualEmailConstants.EmailTabName).sections.get(AppCommon.ContextualEmailConstants.EmailMainSectionName).setVisible(false);
                formContext.ui.tabs.get(AppCommon.ContextualEmailConstants.EmailTabName).sections.get(AppCommon.ContextualEmailConstants.EmailPreviewSectionName).setVisible(false);
            }
        }
    };
    ContextualBulkEmail.SetPreviewMode = function (formContext) {
        return __awaiter(this, void 0, void 0, function () {
            var globalContext, telemetryParams, subjectAttribute, descriptionAttribute, entityType, entityId, entityName, mailSubject, parsedValues, previewSubject, previewDescription, subjectControl, bodyControl, regardingLookupValue, toLookupValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ContextualBulkEmail.isPreviewMode = true;
                        globalContext = Xrm.Utility.getGlobalContext();
                        telemetryParams = [];
                        AppCommon.ContextualEmailTelemetryReporter.ReportInfo(globalContext, "SetPreviewMode", "bulkEmailPreviewButtonClicked", "bulkEmailForm", "Bulk email preview button clicked");
                        telemetryParams.push({ name: "isPreviewMode", value: ContextualBulkEmail.isPreviewMode });
                        subjectAttribute = formContext.getAttribute(AppCommon.ContextualEmailConstants.SubjectAttributeName);
                        if (subjectAttribute != null) {
                            ContextualBulkEmail.mailSubject = subjectAttribute.getValue();
                        }
                        descriptionAttribute = formContext.getAttribute(AppCommon.ContextualEmailConstants.DescriptionAttributeName);
                        if (descriptionAttribute != null) {
                            ContextualBulkEmail.mailDescription = descriptionAttribute.getValue();
                        }
                        if (!(ContextualBulkEmail.emailDataParams &&
                            ContextualBulkEmail.emailDataParams.selectedrecords &&
                            ContextualBulkEmail.emailDataParams.selectedrecords.length > 0 &&
                            ContextualBulkEmail.emailDataParams.selectedrecords[0].to &&
                            ContextualBulkEmail.emailDataParams.selectedrecords[0].associatedrecord)) return [3 /*break*/, 2];
                        entityType = ContextualBulkEmail.emailDataParams.selectedrecords[0].associatedrecord.entityType;
                        entityId = ContextualBulkEmail.emailDataParams.selectedrecords[0].associatedrecord.id;
                        entityName = ContextualBulkEmail.emailDataParams.selectedrecords[0].associatedrecord.name;
                        mailSubject = AppCommon.ContextualEmailUtils.sanitizeHTML(ContextualBulkEmail.mailSubject ? ContextualBulkEmail.mailSubject : ContextualBulkEmail.mailSubjectInHtml);
                        return [4 /*yield*/, AppCommon.ContextualBulkEmailTemplate.ParseDataFieldsForPreview(mailSubject, ContextualBulkEmail.mailDescription, entityType, entityId)];
                    case 1:
                        parsedValues = _a.sent();
                        if (parsedValues && parsedValues.length > 0) {
                            previewSubject = parsedValues[0];
                            previewDescription = parsedValues[1];
                            subjectControl = formContext.ui.controls.get(AppCommon.ContextualEmailConstants.PreviewSubjectControlId);
                            subjectControl.getAttribute().setValue(AppCommon.ContextualEmailUtils.convertHtmlToPlainText(previewSubject));
                            bodyControl = formContext.ui.controls.get(AppCommon.ContextualEmailConstants.PreviewDescriptionControlId);
                            bodyControl.getAttribute().setValue(previewDescription);
                        }
                        regardingLookupValue = new Array();
                        regardingLookupValue[0] = new Object();
                        regardingLookupValue[0].id = entityId;
                        regardingLookupValue[0].name = entityName;
                        regardingLookupValue[0].entityType = entityType;
                        formContext.data.entity.attributes.get(AppCommon.ContextualEmailConstants.RegardingObjectIdAttributeName).setValue(regardingLookupValue);
                        toLookupValue = new Array();
                        toLookupValue[0] = new Object();
                        toLookupValue[0].id = ContextualBulkEmail.emailDataParams.selectedrecords[0].to.id;
                        ;
                        toLookupValue[0].name = ContextualBulkEmail.emailDataParams.selectedrecords[0].to.name;
                        ;
                        toLookupValue[0].entityType = ContextualBulkEmail.emailDataParams.selectedrecords[0].to.entityType;
                        ;
                        formContext.data.entity.attributes.get(AppCommon.ContextualEmailConstants.ToAttributeName).setValue(toLookupValue);
                        formContext.ui.tabs.get(AppCommon.ContextualEmailConstants.EmailTabName).sections.get(AppCommon.ContextualEmailConstants.EmailMainSectionName).setVisible(false);
                        formContext.ui.tabs.get(AppCommon.ContextualEmailConstants.EmailTabName).sections.get(AppCommon.ContextualEmailConstants.EmailPreviewSectionName).setVisible(true);
                        formContext.ui.refreshRibbon();
                        _a.label = 2;
                    case 2:
                        AppCommon.ContextualEmailTelemetryReporter.ReportInfo(globalContext, "SetPreviewMode", "setPreviewMode", "bulkEmailForm", "Set to preview mode", telemetryParams);
                        return [2 /*return*/];
                }
            });
        });
    };
    ContextualBulkEmail.SetEditMode = function (formContext) {
        ContextualBulkEmail.isPreviewMode = false;
        var globalContext = Xrm.Utility.getGlobalContext();
        var telemetryParams = [];
        AppCommon.ContextualEmailTelemetryReporter.ReportInfo(globalContext, "SetEditMode", "bulkEmailClosePreviewButtonClicked", "bulkEmailForm", "Bulk email close preview button clicked");
        telemetryParams.push({ name: "isPreviewMode", value: ContextualBulkEmail.isPreviewMode });
        var subjectControl = formContext.ui.controls.get(AppCommon.ContextualEmailConstants.SubjectControlId);
        subjectControl.getAttribute().setValue(ContextualBulkEmail.mailSubject);
        var bodyControl = formContext.ui.controls.get(AppCommon.ContextualEmailConstants.DescriptionControlId);
        bodyControl.getAttribute().setValue(ContextualBulkEmail.mailDescription);
        formContext.ui.tabs.get(AppCommon.ContextualEmailConstants.EmailTabName).sections.get(AppCommon.ContextualEmailConstants.EmailPreviewSectionName).setVisible(false);
        formContext.ui.tabs.get(AppCommon.ContextualEmailConstants.EmailTabName).sections.get(AppCommon.ContextualEmailConstants.EmailMainSectionName).setVisible(true);
        formContext.ui.refreshRibbon();
        AppCommon.ContextualEmailTelemetryReporter.ReportInfo(globalContext, "SetEditMode", "setEditMode", "bulkEmailForm", "Set to edit mode", telemetryParams);
    };
    ContextualBulkEmail.ScheduleOnClickHandler = function (eventContext) {
        return __awaiter(this, void 0, void 0, function () {
            var globalContext, telemetryParams, formContext, attribute, paramScheduleDateAttribute, paramScheduleDateAttributeValue, paramScheduleTimeAttribute, paramScheduleTimeAttributeValue, targetDate, paramEmailScheduleDateTimeAttribute, selectDateTimeMessage;
            return __generator(this, function (_a) {
                globalContext = Xrm.Utility.getGlobalContext();
                telemetryParams = [];
                formContext = eventContext.getFormContext();
                attribute = formContext.data.attributes.get("param_lastButtonClicked");
                attribute.setValue("ok_id");
                paramScheduleDateAttribute = formContext.data.attributes.get("params_scheduledate");
                paramScheduleDateAttributeValue = paramScheduleDateAttribute.getValue();
                paramScheduleTimeAttribute = formContext.data.attributes.get("params_scheduletime");
                paramScheduleTimeAttributeValue = paramScheduleTimeAttribute.getValue();
                if (paramScheduleDateAttributeValue && paramScheduleTimeAttributeValue) {
                    targetDate = new Date(paramScheduleDateAttributeValue);
                    targetDate.setMinutes(paramScheduleDateAttributeValue.getMinutes() + Number(paramScheduleTimeAttributeValue));
                    paramEmailScheduleDateTimeAttribute = formContext.data.attributes.get("param_emailscheduledatetime");
                    paramEmailScheduleDateTimeAttribute.setValue(targetDate.toString());
                    formContext.ui.close();
                    telemetryParams.push({ name: "scheduleDateTime", value: targetDate.toString() });
                    AppCommon.ContextualEmailTelemetryReporter.ReportInfo(globalContext, "ScheduleOnClickHandler", "bulkEmailSchedule", "bulkEmailForm", "Send later dialog schedule button clicked", telemetryParams);
                }
                else {
                    selectDateTimeMessage = AppCommon.ResourceStringProvider.getResourceString("ContextualBulkEmail_Schedule_DateAndTime_Message");
                    formContext.ui.setFormNotification(selectDateTimeMessage, "WARNING", "selectDateAndTimeToProceed");
                    AppCommon.ContextualEmailTelemetryReporter.ReportInfo(globalContext, "ScheduleOnClickHandler", "bulkEmailSchedule", "bulkEmailForm", "Please select date and time", telemetryParams);
                }
                return [2 /*return*/];
            });
        });
    };
    ContextualBulkEmail.SendLaterDialogOnLoad = function (formContext) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    ContextualBulkEmail.CancelOnClickHandler = function (eventContext) {
        return __awaiter(this, void 0, void 0, function () {
            var globalContext, formContext, attribute;
            return __generator(this, function (_a) {
                globalContext = Xrm.Utility.getGlobalContext();
                formContext = eventContext.getFormContext();
                attribute = formContext.data.attributes.get("param_lastButtonClicked");
                attribute.setValue("cancel_id");
                formContext.ui.close();
                AppCommon.ContextualEmailTelemetryReporter.ReportInfo(globalContext, "CancelOnClickHandler", "bulkEmailSchedule", "bulkEmailForm", "Send later dialog cancel button clicked");
                return [2 /*return*/];
            });
        });
    };
    ContextualBulkEmail.Schedule = function (formContext) {
        return __awaiter(this, void 0, void 0, function () {
            var customActionStartTime, globalContext, telemetryParams, params, emailScheduleDateTime, schedulingBulkEmailMessage, scheduleBulkEmailRequestParam, scheduleBulkEmailRequest, response, duration, responseData, scheduleBulkEmailResponse, scheduleFailedMessage, error_1, scheduleFailedMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customActionStartTime = new Date();
                        globalContext = Xrm.Utility.getGlobalContext();
                        telemetryParams = [];
                        AppCommon.ContextualEmailTelemetryReporter.ReportInfo(globalContext, "Schedule", "bulkEmailScheduleButtonClicked", "bulkEmailForm", "Bulk email schedule button clicked");
                        return [4 /*yield*/, Xrm.Navigation.openDialog("BulkEmailSendLaterDialog", { position: 1, height: 290, width: 480 })];
                    case 1:
                        params = _a.sent();
                        if (!(params && params["parameters"] && params["parameters"].param_lastButtonClicked == "ok_id")) return [3 /*break*/, 10];
                        emailScheduleDateTime = new Date(params["parameters"]["param_emailscheduledatetime"]);
                        telemetryParams.push({ name: "scheduleDateTime", value: emailScheduleDateTime.toString() });
                        if (!formContext.data.entity.getIsDirty()) return [3 /*break*/, 3];
                        return [4 /*yield*/, formContext.data.save()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        schedulingBulkEmailMessage = AppCommon.ResourceStringProvider.getResourceString("ContextualBulkEmail_Schedule_InProgress_Message");
                        Xrm.Utility.showProgressIndicator(schedulingBulkEmailMessage);
                        scheduleBulkEmailRequestParam = ContextualBulkEmail.getBulkEmailRequestParam(formContext, "ScheduleBulkEmail");
                        scheduleBulkEmailRequestParam.DelayedEmailSendTime = emailScheduleDateTime;
                        scheduleBulkEmailRequest = new ODataContract.ScheduleBulkMailRequest(JSON.stringify(scheduleBulkEmailRequestParam));
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 9, , 10]);
                        return [4 /*yield*/, Xrm.WebApi.online.execute(scheduleBulkEmailRequest)];
                    case 5:
                        response = _a.sent();
                        Xrm.Utility.closeProgressIndicator();
                        if (!response.ok) return [3 /*break*/, 7];
                        duration = new Date().getTime() - customActionStartTime.getTime();
                        console.log("ScheduleBulkEmail plugin execution time (in milliseconds) - " + duration);
                        telemetryParams.push({ name: "duration(in milliseconds)", value: duration });
                        return [4 /*yield*/, response.json()];
                    case 6:
                        responseData = _a.sent();
                        scheduleBulkEmailResponse = JSON.parse(responseData.Response);
                        if (scheduleBulkEmailResponse.EmailRecordsResponse.Results.length > 0 &&
                            scheduleBulkEmailResponse.EmailRecordsResponse.Results[0].Key.toLowerCase() === "isfaulted") {
                            if (!scheduleBulkEmailResponse.EmailRecordsResponse.Results[0].Value) {
                                telemetryParams.push({ name: "isfaulted", value: false });
                                ContextualBulkEmail.RaiseCompletedEvent(ContextualBulkEmail.emailDataParams.selectedrecords, scheduleBulkEmailResponse.EmailRecordsResponse.Results[1].Value, false, "ScheduleBulkEmail");
                            }
                            else {
                                telemetryParams.push({ name: "isfaulted", value: true });
                                ContextualBulkEmail.RaiseCompletedEvent(ContextualBulkEmail.emailDataParams.selectedrecords, scheduleBulkEmailResponse.Results[1].Value, true, "ScheduleBulkEmail");
                            }
                        }
                        ContextualBulkEmail.ClearEmailDataParams();
                        ContextualBulkEmail.CloseEmailPopup();
                        AppCommon.ContextualEmailTelemetryReporter.ReportInfo(globalContext, "Schedule", "bulkEmailSchedule", "bulkEmailForm", "Bulk emails have been scheduled", telemetryParams);
                        return [3 /*break*/, 8];
                    case 7:
                        scheduleFailedMessage = AppCommon.ResourceStringProvider.getResourceString("ContextualBulkEmail_Schedule_Failed_Message");
                        formContext.ui.setFormNotification(scheduleFailedMessage, "ERROR", "bulkEmailScheduleFailedMessage");
                        telemetryParams.push({ name: "response", value: JSON.stringify(response) });
                        AppCommon.ContextualEmailTelemetryReporter.ReportError(globalContext, "Schedule", "bulkEmailSchedule", "bulkEmailForm", response.statusText, telemetryParams);
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_1 = _a.sent();
                        Xrm.Utility.closeProgressIndicator();
                        scheduleFailedMessage = AppCommon.ResourceStringProvider.getResourceString("ContextualBulkEmail_Schedule_Failed_Message");
                        formContext.ui.setFormNotification(scheduleFailedMessage, "ERROR", "bulkEmailScheduleFailedMessage");
                        telemetryParams.push({ name: "error", value: JSON.stringify(error_1) });
                        AppCommon.ContextualEmailTelemetryReporter.ReportError(globalContext, "Schedule", "bulkEmailSchedule", "bulkEmailForm", error_1.message, telemetryParams);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    ContextualBulkEmail.SendToAll = function (formContext) {
        return __awaiter(this, void 0, void 0, function () {
            var customActionStartTime, globalContext, telemetryParams, sendingBulkEmailMessage, sendBulkEmailRequestParam, isSkipDeleteEnabled, sendBulkEmailRequest, response, duration, responseData, sendBulkEmailResponse, deleteError_1, sendFailedMessage, error_2, sendFailedMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customActionStartTime = new Date();
                        globalContext = Xrm.Utility.getGlobalContext();
                        telemetryParams = [];
                        AppCommon.ContextualEmailTelemetryReporter.ReportInfo(globalContext, "SendToAll", "bulkEmailSendButtonClicked", "bulkEmailForm", "Bulk email send to all button clicked");
                        if (!formContext.data.entity.getIsDirty()) return [3 /*break*/, 2];
                        return [4 /*yield*/, formContext.data.save()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        sendingBulkEmailMessage = AppCommon.ResourceStringProvider.getResourceString("ContextualBulkEmail_Send_InProgress_Message");
                        Xrm.Utility.showProgressIndicator(sendingBulkEmailMessage);
                        sendBulkEmailRequestParam = ContextualBulkEmail.getBulkEmailRequestParam(formContext, "SendBulkEmail");
                        isSkipDeleteEnabled = Xrm.Utility.getGlobalContext().getFeatureControlSetting("CoreSales.DigitalSelling", "SkipDeleteFromBackend");
                        if (isSkipDeleteEnabled) {
                            sendBulkEmailRequestParam.SkipDelete = true;
                            telemetryParams.push({ name: "skipdelete", value: true });
                        }
                        sendBulkEmailRequest = new ODataContract.SendBulkEmailRequest(JSON.stringify(sendBulkEmailRequestParam));
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 12, , 13]);
                        return [4 /*yield*/, Xrm.WebApi.online.execute(sendBulkEmailRequest)];
                    case 4:
                        response = _a.sent();
                        Xrm.Utility.closeProgressIndicator();
                        if (!response.ok) return [3 /*break*/, 10];
                        duration = new Date().getTime() - customActionStartTime.getTime();
                        console.log("SendBulkEmail plugin execution time (in milliseconds) - " + duration);
                        telemetryParams.push({ name: "duration(in milliseconds)", value: duration });
                        return [4 /*yield*/, response.json()];
                    case 5:
                        responseData = _a.sent();
                        sendBulkEmailResponse = JSON.parse(responseData.Response);
                        if (!(isSkipDeleteEnabled &&
                            sendBulkEmailResponse.SavedEmailEntityRecordId &&
                            sendBulkEmailResponse.SavedEmailEntityRecordId !== "00000000-0000-0000-0000-000000000000")) return [3 /*break*/, 9];
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, Xrm.WebApi.deleteRecord("email", sendBulkEmailResponse.SavedEmailEntityRecordId)];
                    case 7:
                        _a.sent();
                        telemetryParams.push({ name: "savedEmailDeleted", value: true });
                        telemetryParams.push({ name: "deletedEmailId", value: sendBulkEmailResponse.SavedEmailEntityRecordId });
                        return [3 /*break*/, 9];
                    case 8:
                        deleteError_1 = _a.sent();
                        telemetryParams.push({ name: "savedEmailDeleteError", value: JSON.stringify(deleteError_1) });
                        AppCommon.ContextualEmailTelemetryReporter.ReportError(globalContext, "SendToAll", "deleteSavedEmail", "bulkEmailForm", deleteError_1.message, telemetryParams);
                        return [3 /*break*/, 9];
                    case 9:
                        if (sendBulkEmailResponse.SendEmailResult.Results.length > 0 &&
                            sendBulkEmailResponse.SendEmailResult.Results[0].Key.toLowerCase() === "isfaulted") {
                            if (!sendBulkEmailResponse.SendEmailResult.Results[0].Value) {
                                telemetryParams.push({ name: "isfaulted", value: false });
                                ContextualBulkEmail.RaiseCompletedEvent(ContextualBulkEmail.emailDataParams.selectedrecords, sendBulkEmailResponse.SendEmailResult.Results[1].Value, false, "SendBulkEmail");
                            }
                            else {
                                telemetryParams.push({ name: "isfaulted", value: true });
                                ContextualBulkEmail.RaiseCompletedEvent(ContextualBulkEmail.emailDataParams.selectedrecords, sendBulkEmailResponse.SendEmailResult.Results[1].Value, true, "SendBulkEmail");
                            }
                        }
                        ContextualBulkEmail.ClearEmailDataParams();
                        ContextualBulkEmail.CloseEmailPopup();
                        AppCommon.ContextualEmailTelemetryReporter.ReportInfo(globalContext, "SendToAll", "bulkEmailSend", "bulkEmailForm", "Bulk emails have been sent", telemetryParams);
                        return [3 /*break*/, 11];
                    case 10:
                        sendFailedMessage = AppCommon.ResourceStringProvider.getResourceString("ContextualBulkEmail_Send_Failed_Message");
                        formContext.ui.setFormNotification(sendFailedMessage, "ERROR", "bulkEmailSendFailedMessage");
                        telemetryParams.push({ name: "response", value: JSON.stringify(response) });
                        AppCommon.ContextualEmailTelemetryReporter.ReportError(globalContext, "SendToAll", "bulkEmailSend", "bulkEmailForm", response.statusText, telemetryParams);
                        _a.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        error_2 = _a.sent();
                        Xrm.Utility.closeProgressIndicator();
                        sendFailedMessage = AppCommon.ResourceStringProvider.getResourceString("ContextualBulkEmail_Send_Failed_Message");
                        formContext.ui.setFormNotification(sendFailedMessage, "ERROR", "bulkEmailSendFailedMessage");
                        telemetryParams.push({ name: "error", value: JSON.stringify(error_2) });
                        AppCommon.ContextualEmailTelemetryReporter.ReportError(globalContext, "SendToAll", "bulkEmailSend", "bulkEmailForm", error_2.message, telemetryParams);
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    ContextualBulkEmail.ChangeTemplate = function (formContext) {
        return __awaiter(this, void 0, void 0, function () {
            var globalContext, telemetryParams, entityType_1;
            return __generator(this, function (_a) {
                globalContext = Xrm.Utility.getGlobalContext();
                telemetryParams = [];
                AppCommon.ContextualEmailTelemetryReporter.ReportInfo(globalContext, "ChangeTemplate", "bulkEmailChangeTemplateButtonClicked", "bulkEmailForm", "Bulk email change template button clicked");
                if (ContextualBulkEmail.emailDataParams &&
                    ContextualBulkEmail.emailDataParams.selectedrecords &&
                    ContextualBulkEmail.emailDataParams.selectedrecords.length > 0) {
                    entityType_1 = ContextualBulkEmail.emailDataParams.selectedrecords[0].to.entityType;
                    Xrm.Utility.getEntityMetadata(entityType_1).then(function (entityMetadata) {
                        var dialogparameters = {};
                        var options = {
                            height: 610,
                            width: 720
                        };
                        var dialogParams = {
                            entityId: null,
                            entityType: entityType_1,
                            entityOtc: entityMetadata.ObjectTypeCode,
                            preSelectTemplateId: null
                        };
                        dialogparameters["param_emailFormData"] = JSON.stringify(dialogParams);
                        Xrm.Navigation.openDialog("EmailTemplateDialog", options, dialogparameters).then(function (params) {
                            if (params["parameters"].param_lastButtonClicked === "select_id") {
                                var templateid = params["parameters"].param_templateId;
                                ContextualBulkEmail.ApplyDefaultTemplateInternal(formContext, templateid, true);
                                telemetryParams.push({ name: "templateId", value: templateid });
                                AppCommon.ContextualEmailTelemetryReporter.ReportInfo(globalContext, "ChangeTemplate", "bulkEmailChangeTemplate", "bulkEmailForm", "Bulk email template has been changed", telemetryParams);
                            }
                        });
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    ContextualBulkEmail.getBulkEmailRequestParam = function (formContext, operationType) {
        var descriptionAttribute = formContext.getAttribute(AppCommon.ContextualEmailConstants.DescriptionAttributeName);
        if (descriptionAttribute != null && !ContextualBulkEmail.isPreviewMode) {
            // In preview mode, skip reading from form attribute to preserve the original template with dynamic placeholders.
            // The mailDescription was already stored in SetPreviewMode with unresolved template tokens (e.g., {{contact.firstname}}),
            // which allows the server to resolve each recipient's values individually.
            ContextualBulkEmail.mailDescription = descriptionAttribute.getValue();
        }
        var subjectAttribute = formContext.getAttribute(AppCommon.ContextualEmailConstants.SubjectAttributeName);
        if (subjectAttribute != null) {
            ContextualBulkEmail.mailSubjectInHtml = subjectAttribute.getValue();
        }
        var bulkEmailRequestParam = {
            SavedEmailEntityRecordId: ContextualBulkEmail.savedEmailEntityId ? ContextualBulkEmail.savedEmailEntityId : undefined,
            MailSubject: ContextualBulkEmail.mailSubjectInHtml,
            MailDescription: AppCommon.ContextualBulkEmailTemplate.RemoveBackgroundColorOfSlug(ContextualBulkEmail.mailDescription),
            OperationType: operationType
        };
        bulkEmailRequestParam.SelectedRecords = [];
        for (var i = 0; i < (ContextualBulkEmail.emailDataParams && ContextualBulkEmail.emailDataParams.selectedrecords.length); i++) {
            if (ContextualBulkEmail.emailDataParams.selectedrecords[i]
                && ContextualBulkEmail.emailDataParams.selectedrecords[i].to
                && ContextualBulkEmail.emailDataParams.selectedrecords[i].associatedrecord) {
                var selectedRecord = {};
                selectedRecord.EntityType = ContextualBulkEmail.emailDataParams.selectedrecords[i].to.entityType;
                selectedRecord.EntityRecordId = ContextualBulkEmail.emailDataParams.selectedrecords[i].to.id;
                selectedRecord.EntityRecordName = ContextualBulkEmail.emailDataParams.selectedrecords[i].to.name;
                selectedRecord.AssociatedEntityType = ContextualBulkEmail.emailDataParams.selectedrecords[i].associatedrecord.entityType;
                selectedRecord.AssociatedEntityRecordId = ContextualBulkEmail.emailDataParams.selectedrecords[i].associatedrecord.id;
                selectedRecord.AssociatedEntityRecordName = ContextualBulkEmail.emailDataParams.selectedrecords[i].associatedrecord.name;
                if (ContextualBulkEmail.emailDataParams.selectedrecords[i].activityid) {
                    selectedRecord.EmailActivityId = ContextualBulkEmail.emailDataParams.selectedrecords[i].activityid;
                }
                bulkEmailRequestParam.SelectedRecords.push(selectedRecord);
            }
        }
        return bulkEmailRequestParam;
    };
    ContextualBulkEmail.ResetContent = function (formContext) {
        var subjectControl = formContext.ui.controls.get(AppCommon.ContextualEmailConstants.SubjectControlId);
        subjectControl.getAttribute().setValue(ContextualBulkEmail.mailSubjectOrg);
        var bodyControl = formContext.ui.controls.get(AppCommon.ContextualEmailConstants.DescriptionControlId);
        bodyControl.getAttribute().setValue(ContextualBulkEmail.mailDescriptionOrg);
        var globalContext = Xrm.Utility.getGlobalContext();
        AppCommon.ContextualEmailTelemetryReporter.ReportInfo(globalContext, "ResetContent", "bulkEmailResetContent", "bulkEmailForm", "Bulk email reset content button clicked");
    };
    ContextualBulkEmail.SetRecipientList = function (formContext) {
        var recipients = "";
        for (var i = 0; i < (ContextualBulkEmail.emailDataParams && ContextualBulkEmail.emailDataParams.selectedrecords.length); i++) {
            if (ContextualBulkEmail.emailDataParams.selectedrecords[i].to) {
                recipients += ContextualBulkEmail.emailDataParams.selectedrecords[i].to.name;
                recipients += "; ";
            }
        }
        var recipientListAttribute = formContext.getAttribute(AppCommon.ContextualEmailConstants.RecipientListAttributeName);
        if (recipientListAttribute) {
            recipientListAttribute.setValue(recipients);
        }
    };
    ContextualBulkEmail.RaiseCompletedEvent = function (selectedRecords, responses, isFaulted, operationType) {
        var selectedRecordsWithResponses = [];
        for (var i = 0; i < selectedRecords.length; i++) {
            var selectedRecordWithResponse = {};
            selectedRecordWithResponse.entityType = selectedRecords[i].to.entityType;
            selectedRecordWithResponse.id = selectedRecords[i].to.id;
            selectedRecordWithResponse.name = selectedRecords[i].to.name;
            selectedRecordWithResponse.response = responses[i];
            selectedRecordsWithResponses.push(selectedRecordWithResponse);
        }
        var event = new CustomEvent("BulkEmailEventInvoked", {
            detail: {
                isFaulted: isFaulted,
                operationType: operationType,
                responses: selectedRecordsWithResponses
            }
        });
        var globalContext = Xrm.Utility.getGlobalContext();
        var telemetryParams = [];
        telemetryParams.push({ name: "eventPayload", value: JSON.stringify(event.detail) });
        AppCommon.ContextualEmailTelemetryReporter.ReportInfo(globalContext, "RaiseCompletedEvent", "BulkEmailEventInvoked", "bulkEmailForm", "Bulk email complete event raised", telemetryParams);
        window.top.dispatchEvent(event);
    };
    ContextualBulkEmail.FormOnPostSave = function (context) {
        var eventArgs = context.getEventArgs();
        if (eventArgs && eventArgs.getIsSaveSuccess()) {
            var savedEmailEntity = eventArgs.getEntityReference();
            ContextualBulkEmail.savedEmailEntityId = savedEmailEntity && AppCommon.ContextualEmailUtils.formatGuid(eventArgs.getEntityReference().id);
        }
    };
    ContextualBulkEmail.ApplyDefaultTemplate = function (formContext) {
        return __awaiter(this, void 0, void 0, function () {
            var templateId;
            return __generator(this, function (_a) {
                if (ContextualBulkEmail.emailDataParams) {
                    templateId = ContextualBulkEmail.emailDataParams.templateid;
                    ContextualBulkEmail.ApplyDefaultTemplateInternal(formContext, templateId, false);
                }
                return [2 /*return*/];
            });
        });
    };
    ContextualBulkEmail.ApplyDefaultTemplateInternal = function (formContext, templateId, overwrite) {
        return __awaiter(this, void 0, void 0, function () {
            var globalContext, telemetryParams, templateRecord, subjectAttribute, descriptionAttribute, description, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        globalContext = Xrm.Utility.getGlobalContext();
                        telemetryParams = [];
                        telemetryParams.push({ name: "templateId", value: templateId });
                        if (!templateId) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Xrm.WebApi.online.retrieveRecord(AppCommon.ContextualEmailConstants.TemplateEntityName, templateId, AppCommon.ContextualEmailConstants.RetrieveTemplateOptionalQuery)];
                    case 2:
                        templateRecord = _a.sent();
                        subjectAttribute = formContext.getAttribute(AppCommon.ContextualEmailConstants.SubjectAttributeName);
                        if (subjectAttribute) {
                            ContextualBulkEmail.mailSubjectInHtml = templateRecord.subjectsafehtml;
                            ContextualBulkEmail.mailSubjectOrg = AppCommon.ContextualEmailUtils.convertHtmlToPlainText(templateRecord.subjectsafehtml);
                            subjectAttribute.setValue(AppCommon.ContextualEmailUtils.convertHtmlToPlainText(templateRecord.subjectsafehtml));
                            subjectAttribute.fireOnChange();
                        }
                        descriptionAttribute = formContext.getAttribute(AppCommon.ContextualEmailConstants.DescriptionAttributeName);
                        if (descriptionAttribute) {
                            description = templateRecord.safehtml;
                            if (!overwrite && descriptionAttribute.getValue()) {
                                description = description + descriptionAttribute.getValue();
                            }
                            ContextualBulkEmail.mailDescriptionOrg = description;
                            descriptionAttribute.setValue(description);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        telemetryParams.push({ name: "error", value: JSON.stringify(error_3) });
                        AppCommon.ContextualEmailTelemetryReporter.ReportError(globalContext, "ApplyDefaultTemplateInternal", "ApplyDefaultTemplate", "bulkEmailForm", error_3.message, telemetryParams);
                        return [3 /*break*/, 4];
                    case 4:
                        AppCommon.ContextualEmailTelemetryReporter.ReportInfo(globalContext, "ApplyDefaultTemplateInternal", "ApplyDefaultTemplate", "bulkEmailForm", null, telemetryParams);
                        return [2 /*return*/];
                }
            });
        });
    };
    ContextualBulkEmail.IsPreviewMode = function (context) {
        return ContextualBulkEmail.isPreviewMode;
    };
    ContextualBulkEmail.IsBulkEmailForm = function (formContext) {
        var currentFormId = formContext && formContext.ui && formContext.ui.formSelector && formContext.ui.formSelector.getCurrentItem() && formContext.ui.formSelector.getCurrentItem().getId();
        var isFCSEnabled = Xrm.Utility.getGlobalContext().getFeatureControlSetting("CoreSales.DigitalSelling", "HidePreviewButtonInBulkEmail"); // Todo: we made chnages related to security issue , remove this check once we not receive any regression.
        if (currentFormId === AppCommon.ContextualEmailConstants.BulkEmailFormId && !isFCSEnabled) {
            return true;
        }
        return false;
    };
    ContextualBulkEmail.IsBulkMode = function () {
        if (ContextualBulkEmail.emailDataParams && ContextualBulkEmail.emailDataParams.isbulkmode) {
            return true;
        }
        return false;
    };
    ContextualBulkEmail.GetEmailDataParams = function () {
        try {
            return window && window.localStorage
                && window.localStorage.getItem(AppCommon.ContextualEmailConstants.BulkEmailDataParams)
                && JSON.parse(window.localStorage.getItem(AppCommon.ContextualEmailConstants.BulkEmailDataParams));
        }
        catch (error) {
            var globalContext = Xrm.Utility.getGlobalContext();
            var telemetryParams = [];
            telemetryParams.push({ name: "error", value: JSON.stringify(error) });
            AppCommon.ContextualEmailTelemetryReporter.ReportError(globalContext, "GetEmailDataParams", "bulkEmailFormLoad", "bulkEmailForm", error.message, telemetryParams);
            return null;
        }
    };
    ContextualBulkEmail.ClearEmailDataParams = function () {
        window && window.localStorage && window.localStorage.removeItem(AppCommon.ContextualEmailConstants.BulkEmailDataParams);
    };
    ContextualBulkEmail.CloseEmailPopup = function () {
        // PopupManagerState is loaded in webresrouce at root level window
        var popupManagerStateInstance = window
            && window.parent.parent
            && window.parent.parent.MscrmControls
            && window.parent.parent.MscrmControls.AppCommon
            && window.parent.parent.MscrmControls.AppCommon.ContextualEmail
            && window.parent.parent.MscrmControls.AppCommon.ContextualEmail.PopupManagerState
            && window.parent.parent.MscrmControls.AppCommon.ContextualEmail.PopupManagerState.Instance;
        var popupDictionary = popupManagerStateInstance && popupManagerStateInstance.PopupsDictionary;
        if (popupDictionary) {
            for (var popup in popupDictionary) {
                if (popupDictionary.hasOwnProperty(popup)
                    && popupDictionary[popup]
                    && popupDictionary[popup].createParams
                    && popupDictionary[popup].createParams.dataParams
                    && popupDictionary[popup].createParams.dataParams["isbulkmode"]) {
                    popupDictionary[popup].closeConfirmed = true;
                    popupDictionary[popup].popup.close();
                }
            }
        }
    };
    AppCommon.ContextualBulkEmail = ContextualBulkEmail;
})(AppCommon || (AppCommon = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var AppCommon;
(function (AppCommon) {
    "use strict";
    var DataFieldRegex = /{![\w\s.]+:[\w\s.]+(\/@[\w\s.]+)?;[\w\s.]*}/g; // to find slugs from template e.g. {!lead:last name;Valued Customer} or {!lead:ownerid/@name;a salesperson}
    var DataFieldSplitRegex = /[\w\s.]+/g; // to split individual slugs to extract entity, attribute, related entity field, default value 
    var DataFieldSlugsBackgroundRegex = /(<span[^>]*style="[^"]*?)background-color:[^;]+;?([^"]*">.*?<span class="dataslug".*?<\/span>.*?<\/span>)/g; // to find all parent spans and remove the background color
    var DataSlugBackgroundColorRegex = /(<span[^>]*class="dataslug"[^>]*style="[^"]*?)background-color:\s*[^;"]+;?\s*([^"]*")/gi; // to remove only background-color from dataslug spans
    var ContextualBulkEmailTemplate = (function () {
        function ContextualBulkEmailTemplate() {
        }
        ContextualBulkEmailTemplate.RemoveBackgroundColorOfSlug = function (body) {
            // Remove background-color from parent spans wrapping dataslug
            body = body.replace(DataFieldSlugsBackgroundRegex, '$1$2');
            // Remove only background-color from dataslug spans directly, preserving other styles
            body = body.replace(DataSlugBackgroundColorRegex, '$1$2');
            return body;
        };
        return ContextualBulkEmailTemplate;
    }());
    ContextualBulkEmailTemplate.entityRecordsCache = new Map();
    ContextualBulkEmailTemplate.ParseDataFieldsForPreview = function (subject, body, entityType, entityId) {
        return __awaiter(this, void 0, void 0, function () {
            var globalContext, telemetryParams, entityRecord, subjectOut, bodyOut, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        globalContext = Xrm.Utility.getGlobalContext();
                        telemetryParams = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, ContextualBulkEmailTemplate.GetEntityRecord(entityType, entityId)];
                    case 2:
                        entityRecord = _a.sent();
                        return [4 /*yield*/, ContextualBulkEmailTemplate.ParseDataFields(subject, entityRecord)];
                    case 3:
                        subjectOut = _a.sent();
                        return [4 /*yield*/, ContextualBulkEmailTemplate.ParseDataFields(body, entityRecord)];
                    case 4:
                        bodyOut = _a.sent();
                        bodyOut = ContextualBulkEmailTemplate.RemoveBackgroundColorOfSlug(bodyOut);
                        return [2 /*return*/, [subjectOut, bodyOut]];
                    case 5:
                        ex_1 = _a.sent();
                        telemetryParams.push({ name: "error", value: JSON.stringify(ex_1) });
                        AppCommon.ContextualEmailTelemetryReporter.ReportError(globalContext, "ParseDataFieldsForPreview", "bulkEmailPreview", "bulkEmailForm", ex_1.statusText, telemetryParams);
                        return [2 /*return*/, []];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ContextualBulkEmailTemplate.GetEntityRecord = function (entityType, entityId, queryFilter) {
        return __awaiter(this, void 0, void 0, function () {
            var entityRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!ContextualBulkEmailTemplate.entityRecordsCache.get(entityId)) return [3 /*break*/, 1];
                        entityRecord = ContextualBulkEmailTemplate.entityRecordsCache.get(entityId);
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, Xrm.WebApi.retrieveRecord(entityType, entityId)];
                    case 2:
                        entityRecord = _a.sent();
                        ContextualBulkEmailTemplate.entityRecordsCache.set(entityId, entityRecord);
                        _a.label = 3;
                    case 3: return [2 /*return*/, entityRecord];
                }
            });
        });
    };
    ContextualBulkEmailTemplate.ParseDataFields = function (content, entityRecord) {
        return __awaiter(this, void 0, void 0, function () {
            var matches, match, index, actualEntityAttributeValue, _i, matches_1, match, dataField, entityName, fieldName, relatedEntityField, defaultValue, fieldMatches, fieldMatch, i, val, value, currentUserId, entityRecord_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        matches = [];
                        while (true) {
                            match = DataFieldRegex.exec(content);
                            if (match === null) {
                                break;
                            }
                            matches.push(match[0]);
                        }
                        index = 0;
                        actualEntityAttributeValue = "";
                        _i = 0, matches_1 = matches;
                        _a.label = 1;
                    case 1:
                        if (!(_i < matches_1.length)) return [3 /*break*/, 9];
                        match = matches_1[_i];
                        if (!(match !== undefined)) return [3 /*break*/, 7];
                        dataField = match;
                        entityName = "";
                        fieldName = "";
                        relatedEntityField = "";
                        defaultValue = "";
                        fieldMatches = [];
                        while (true) {
                            fieldMatch = DataFieldSplitRegex.exec(dataField);
                            if (fieldMatch === null) {
                                break;
                            }
                            fieldMatches.push(fieldMatch[0]);
                        }
                        for (i = 0; i < fieldMatches.length; i++) {
                            val = fieldMatches[i];
                            switch (i) {
                                case 0:
                                    entityName = val;
                                    break;
                                case 1:
                                    fieldName = val;
                                    break;
                                case 2:
                                    if (fieldMatches.length > 3) {
                                        relatedEntityField = val;
                                    }
                                    else {
                                        defaultValue = val;
                                    }
                                    break;
                                case 3:
                                    if (fieldMatches.length > 3) {
                                        defaultValue = val;
                                    }
                                    else {
                                        relatedEntityField = val;
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                        if (index % 2 == 0) {
                            actualEntityAttributeValue = "";
                        }
                        value = "";
                        if (!(entityName.toLowerCase() === AppCommon.ContextualEmailConstants.SystemUserEntityName)) return [3 /*break*/, 3];
                        currentUserId = AppCommon.ContextualEmailUtils.formatGuid(Xrm.Utility.getGlobalContext().userSettings.userId);
                        return [4 /*yield*/, ContextualBulkEmailTemplate.GetEntityRecord(entityName, currentUserId)];
                    case 2:
                        entityRecord_1 = _a.sent();
                        value = entityRecord_1[fieldName];
                        return [3 /*break*/, 6];
                    case 3:
                        if (!(relatedEntityField === null || relatedEntityField === "")) return [3 /*break*/, 4];
                        value = entityRecord[fieldName];
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, ContextualBulkEmailTemplate.FetchEntityValueByRetrieve(entityRecord, fieldName, relatedEntityField)];
                    case 5:
                        value = _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!value) {
                            actualEntityAttributeValue = actualEntityAttributeValue ? actualEntityAttributeValue : defaultValue;
                        }
                        else {
                            actualEntityAttributeValue = value;
                        }
                        content = content.replace(dataField, actualEntityAttributeValue);
                        _a.label = 7;
                    case 7:
                        index++;
                        _a.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 1];
                    case 9: return [2 /*return*/, content];
                }
            });
        });
    };
    ContextualBulkEmailTemplate.FetchEntityValueByRetrieve = function (entity, fieldName, relatedEntityFieldName) {
        return __awaiter(this, void 0, void 0, function () {
            var globalContext, telemetryParams, entityId, entityName, entityRecord, ex_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        globalContext = Xrm.Utility.getGlobalContext();
                        telemetryParams = [];
                        if (fieldName === 'ownerid' && relatedEntityFieldName === 'name') {
                            relatedEntityFieldName = 'fullname';
                        }
                        entityId = entity["_" + fieldName + "_value"];
                        if (!(entityId !== undefined)) return [3 /*break*/, 5];
                        entityName = entity["_" + fieldName + "_value" + AppCommon.ContextualEmailConstants.LookupLogicalName];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, ContextualBulkEmailTemplate.GetEntityRecord(entityName, entityId, "?$select=" + relatedEntityFieldName)];
                    case 2:
                        entityRecord = _a.sent();
                        return [2 /*return*/, entityRecord[relatedEntityFieldName]];
                    case 3:
                        ex_2 = _a.sent();
                        telemetryParams.push({ name: "error", value: JSON.stringify(ex_2) });
                        AppCommon.ContextualEmailTelemetryReporter.ReportError(globalContext, "FetchEntityValueByRetrieve", "bulkEmailPreview", "bulkEmailForm", ex_2.statusText, telemetryParams);
                        return [2 /*return*/, ""];
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, ""];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AppCommon.ContextualBulkEmailTemplate = ContextualBulkEmailTemplate;
})(AppCommon || (AppCommon = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var AppCommon;
(function (AppCommon) {
    'use strict';
    var ContextualEmail = (function () {
        function ContextualEmail() {
        }
        // Dialog on load event handler
        ContextualEmail.onLoadMaximumPopupsAlertDialog = function (context) {
            var formContext = context.getFormContext();
            var noOfMaxPopups = Xrm.Page.data.attributes.get("param_maximumpopupsalert").getValue();
            var alertTitleControl = formContext.getControl("lbl_maximumpopupsalerttitle");
            var alertTitle = alertTitleControl.getLabel();
            alertTitleControl.setLabel(String.format(alertTitle, noOfMaxPopups));
        };
        return ContextualEmail;
    }());
    AppCommon.ContextualEmail = ContextualEmail;
})(AppCommon || (AppCommon = {}));
var AppCommon;
(function (AppCommon) {
    'use strict';
    var ContextualEmailUtils = (function () {
        function ContextualEmailUtils() {
        }
        ContextualEmailUtils.formatGuid = function (id) {
            if (id && id.length > 0 && typeof id === "string") {
                if (id.charAt(0) == "{") {
                    id = id.substr(1);
                }
                if (id.charAt(id.length - 1) == '}') {
                    id = id.substr(0, id.length - 1);
                }
            }
            return id;
        };
        ContextualEmailUtils.IsNullOrUndefined = function (object) {
            return typeof object == "undefined" || object == null;
        };
        ContextualEmailUtils.convertHtmlToPlainText = function (htmlString) {
            var tempDivElement = document.createElement("div");
            tempDivElement.innerHTML = htmlString;
            return tempDivElement.textContent || tempDivElement.innerText || "";
        };
        ContextualEmailUtils.sanitizeHTML = function (str) {
            if (str) {
                return str
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#39;");
            }
            return str;
        };
        return ContextualEmailUtils;
    }());
    AppCommon.ContextualEmailUtils = ContextualEmailUtils;
})(AppCommon || (AppCommon = {}));
/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="../../../TypeDefinitions/mscrm.d.ts" />
//Only for UCI logs
var SIClientUtilityLogger;
(function (SIClientUtilityLogger) {
    ;
    var SITraceBIEventName = "SITraceBIEvent";
    var SITraceCIEventName = "SITraceCIEvent";
    var SITraceEventName = "SITraceEvent";
    var Telemetry = (function () {
        function Telemetry() {
        }
        // for example - values for FCB, org settings, user settings, etc.
        Telemetry.ReportInfo = function (params) {
            Telemetry.ReportLog(SITraceBIEventName, params);
        };
        // for example - values for user clicks, accept t&c etc.
        Telemetry.ReportUserAction = function (params) {
            Telemetry.ReportLog(SITraceCIEventName, params);
        };
        //log warnings 
        Telemetry.ReportWarning = function (params) {
            Telemetry.ReportLog(SITraceEventName, params, 2 /* Warning */);
        };
        //log errors
        Telemetry.ReportError = function (params) {
            Telemetry.ReportLog(SITraceEventName, params, 1 /* Error */);
        };
        Telemetry.ReportLog = function (eventName, params, level) {
            try {
                var reporting_1 = params && params.context && params.context.reporting ? params.context.reporting :
                    (Xrm && Xrm.Reporting ? Xrm.Reporting : null);
                var globalContext_1 = Xrm && Xrm.Utility && Xrm.Utility.getGlobalContext();
                globalContext_1 && globalContext_1.getCurrentAppName && globalContext_1.getCurrentAppName().then(function (appName) {
                    var applicationEvent = new Event(params.source, globalContext_1 && globalContext_1.organizationSettings &&
                        globalContext_1.organizationSettings.attributes && globalContext_1.organizationSettings.attributes['organizationId'], params.area, eventName, appName, params.action, params.actionOn, params.methodName, params.message, params.data, params.customControlId, level);
                    reporting_1 && reporting_1.reportEvent && reporting_1.reportEvent(applicationEvent);
                });
            }
            catch (ex) {
                console.error(ex);
            }
        };
        return Telemetry;
    }());
    SIClientUtilityLogger.Telemetry = Telemetry;
    var EventParameter = (function () {
        function EventParameter(name, value) {
            this.name = name;
            this.value = value;
        }
        return EventParameter;
    }());
    var Event = (function () {
        function Event(source, orgId, area, eventName, appName, action, actionOn, methodName, message, data, customControlId, level) {
            this.eventParameters = [];
            this.eventName = eventName;
            source && this.addEventParameter("Source", source);
            orgId && this.addEventParameter("OrgId", orgId);
            area && this.addEventParameter("Area", area);
            appName && this.addEventParameter("appName", appName);
            action && this.addEventParameter("Action", action);
            actionOn && this.addEventParameter("ActionOn", actionOn);
            methodName && this.addEventParameter("MethodName", methodName);
            message && this.addEventParameter("Message", message);
            data && this.addEventParameter("Data", this.SafeJsonStringify(data));
            customControlId && this.addEventParameter("CustomControlId", customControlId);
            level && this.addEventParameter("Level", level);
        }
        Event.prototype.addEventParameter = function (parameterName, value) {
            var event = new EventParameter(parameterName, value);
            this.eventParameters.push(event);
        };
        Event.prototype.SafeJsonStringify = function (data) {
            {
                try {
                    return JSON.stringify(data);
                }
                catch (ex) {
                    console.error(ex);
                    return "";
                }
            }
        };
        return Event;
    }());
})(SIClientUtilityLogger || (SIClientUtilityLogger = {}));
