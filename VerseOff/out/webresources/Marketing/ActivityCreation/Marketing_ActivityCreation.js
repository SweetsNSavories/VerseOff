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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var CampaignActivityActionNames = (function () {
        function CampaignActivityActionNames() {
        }
        return CampaignActivityActionNames;
    }());
    CampaignActivityActionNames.Activate = "activate";
    CampaignActivityActionNames.Deactivate = "deactivate";
    CampaignActivityActionNames.EmailViaMailMerge = "emailviamailmerge";
    CampaignActivityActionNames.Empty = "";
    CampaignActivityActionNames.FaxViaMailMerge = "faxviamailmerge";
    CampaignActivityActionNames.LetterViaMailMerge = "letterviamailmerge";
    CampaignActivityActionNames.ListAppointment = "listappointment";
    CampaignActivityActionNames.ListEmail = "listemail";
    CampaignActivityActionNames.ListFax = "listfax";
    CampaignActivityActionNames.ListLetter = "listletter";
    CampaignActivityActionNames.ListPhone = "listphone";
    CampaignActivityActionNames.EmailViaMailMergeOff = "emailviamailmergeoff";
    CampaignActivityActionNames.InvalidChannel = "invalidchannel";
    CampaignActivityActionNames.InvalidMailMergeChannel = "invalidmailmergechannel";
    CampaignActivityActionNames.NoChannel = "nochannel";
    CampaignActivityActionNames.NoChannelField = "nochannelfield";
    CampaignActivityActionNames.NoListAssociated = "nolistassociated";
    Marketing.CampaignActivityActionNames = CampaignActivityActionNames;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var Default = (function () {
        function Default() {
        }
        return Default;
    }());
    Default.DurationMinutes = 30;
    Default.DueDays = 10;
    Marketing.Default = Default;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    /**
     * Represents mapping between dialogs' names and other types.
     */
    var DialogNameMap = (function () {
        function DialogNameMap() {
        }
        return DialogNameMap;
    }());
    /**
     * Returns a dialog name associated with given action name.
     * @param {string} action on which to perform the search.
     * @returns {string} associated @see DialogName.
     * @throws {Error} if unknown action was used for resolving dialog name.
     */
    DialogNameMap.getDialogName = function (action) {
        switch (action) {
            case Marketing.CampaignActivityActionNames.ListFax: return Marketing.DialogName.NewFaxesForDistributeCampaignActivity;
            case Marketing.CampaignActivityActionNames.ListEmail: return Marketing.DialogName.NewEmailsForDistributeCampaignActivity;
            case Marketing.CampaignActivityActionNames.ListLetter: return Marketing.DialogName.NewLettersForDistributeCampaignActivity;
            case Marketing.CampaignActivityActionNames.ListPhone: return Marketing.DialogName.NewPhoneCallsForDistributeCampaignActivity;
            case Marketing.CampaignActivityActionNames.ListAppointment: return Marketing.DialogName.NewAppointmentsForDistributeCampaignActivity;
            default: throw new Error("Unknown action was used for resolving dialog name. Use another action or add new action->dialogName mapping.");
        }
    };
    Marketing.DialogNameMap = DialogNameMap;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    /**
     * Represents mapping between entities' names and other types.
     */
    var EntityNameMap = (function () {
        function EntityNameMap() {
        }
        return EntityNameMap;
    }());
    /**
     * Returns an entity name associated with given action name.
     * @param {string} action on which to perform the search.
     * @returns {string} associated @see EntityNames.
     * @throws {Error} if unknown action was used for resolving entity name.
     */
    EntityNameMap.getEntityName = function (action) {
        switch (action) {
            case Marketing.CampaignActivityActionNames.ListFax: return Marketing.EntityNames.Fax;
            case Marketing.CampaignActivityActionNames.ListEmail: return Marketing.EntityNames.Email;
            case Marketing.CampaignActivityActionNames.ListPhone: return Marketing.EntityNames.PhoneCall;
            case Marketing.CampaignActivityActionNames.ListLetter: return Marketing.EntityNames.Letter;
            case Marketing.CampaignActivityActionNames.ListAppointment: return Marketing.EntityNames.Appointment;
            default: throw new Error("Unknown action was used for resolving entity name. Use another action or add new action->entityName mapping.");
        }
    };
    Marketing.EntityNameMap = EntityNameMap;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var NewActivityDialog = (function () {
        function NewActivityDialog() {
            var _this = this;
            this.onConfirmClicked = function () {
                var activityDataSerialized = JSON.stringify(_this.Activity);
                Marketing.Controls.setValue(NewActivityDialog.ActivitySerialized, activityDataSerialized);
            };
        }
        NewActivityDialog.prototype.getCampaignObjective = function () {
            return __awaiter(this, void 0, void 0, function () {
                var entityIdAttribute, entityIdValue, campaignActivity, campaign;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            entityIdAttribute = Xrm.Page.data.attributes.get("entity_id");
                            if (!entityIdAttribute)
                                return [2 /*return*/, null];
                            entityIdValue = entityIdAttribute.getValue() && entityIdAttribute.getValue().id;
                            if (!entityIdValue || entityIdValue === "")
                                return [2 /*return*/, null];
                            return [4 /*yield*/, Xrm.WebApi.retrieveRecord(Marketing.EntityNames.CampaignActivity, entityIdValue)];
                        case 1:
                            campaignActivity = _a.sent();
                            if (!campaignActivity._regardingobjectid_value || campaignActivity._regardingobjectid_value === "")
                                return [2 /*return*/, null];
                            return [4 /*yield*/, Xrm.WebApi.retrieveRecord(Marketing.EntityNames.Campaign, campaignActivity._regardingobjectid_value)];
                        case 2:
                            campaign = _a.sent();
                            return [2 /*return*/, campaign.objective || null];
                    }
                });
            });
        };
        return NewActivityDialog;
    }());
    NewActivityDialog.ActionName = "action_name";
    NewActivityDialog.ActivitySerialized = "activity_serialized";
    NewActivityDialog.AssociatedListsMemberTypes = "activity_type";
    NewActivityDialog.EntityId = "entity_id";
    NewActivityDialog.TransactionCurrency = "transaction_currency";
    NewActivityDialog.ChannelName = "channel_name";
    NewActivityDialog.HeaderTitle = "dialog_header_title";
    NewActivityDialog.SubTitle = "dialog_subtitle";
    NewActivityDialog.CampaignDistributionTitle = "Campaign_Distribution_Dialog_Title";
    NewActivityDialog.CampaignDistributionDescription = "Campaign_Distribution_Dialog_Description";
    NewActivityDialog.SubjectRequired = "MA.Activity.SubjectRequired";
    Marketing.NewActivityDialog = NewActivityDialog;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var NewAppointmentsDialog = (function (_super) {
        __extends(NewAppointmentsDialog, _super);
        function NewAppointmentsDialog() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.onDialogLoaded = function () { return __awaiter(_this, void 0, void 0, function () {
                var channelName, now, objective;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Marketing.Controls.setValue(NewAppointmentsDialog.ScheduledDurationMinutesId, Marketing.Default.DurationMinutes);
                            channelName = ClientUtility.PageUtil.getDataAttributeValue(Marketing.NewActivityDialog.ChannelName);
                            if (channelName != null) {
                                Xrm.Page.ui.controls.get(Marketing.NewActivityDialog.HeaderTitle).setLabel(ClientUtility.StringUtil.format(Marketing.StringProvider.getResourceString(Marketing.NewActivityDialog.CampaignDistributionTitle), channelName));
                                Xrm.Page.ui.controls.get(Marketing.NewActivityDialog.SubTitle).setLabel(ClientUtility.StringUtil.format(Marketing.StringProvider.getResourceString(Marketing.NewActivityDialog.CampaignDistributionDescription), channelName));
                            }
                            NewAppointmentsDialog.DefaultAllDayDurationMinutes = Marketing.DateHelper.HoursPerDay * Marketing.DateHelper.MinutesPerHour;
                            now = new Date();
                            this.setDefaultStartTime(now);
                            this.setDefaultEndTime(now);
                            return [4 /*yield*/, this.getCampaignObjective()];
                        case 1:
                            objective = _a.sent();
                            if (objective) {
                                Marketing.Controls.setValue(NewAppointmentsDialog.DescriptionId, objective);
                            }
                            return [2 /*return*/];
                    }
                });
            }); };
            _this.onAllDayEventChanged = function () {
                var allDayEvent = Marketing.Controls.getValue(NewAppointmentsDialog.AllDayEventId);
                _this.setStartTimeFormat(!allDayEvent);
                _this.setEndTimeFormat(!allDayEvent);
                _this.setDurationTime(allDayEvent);
            };
            _this.onActualDurationMinutesChanged = function () {
                _this.recalculateEndTime();
                _this.refreshAllDayEvent();
                _this.handleprogressButton(false);
            };
            _this.onStartTimeChanged = function () {
                if (_this.validateStartDateIsSmallerThanEndDate()) {
                    _this.handleprogressButton(false);
                    _this.recalculateEndTime();
                }
                else {
                    _this.handleprogressButton(true);
                }
            };
            _this.onEndTimeChanged = function () {
                if (_this.validateStartDateIsSmallerThanEndDate()) {
                    _this.handleprogressButton(false);
                    _this.recalculateDuration();
                }
                else {
                    _this.handleprogressButton(true);
                }
            };
            _this.handleprogressButton = function (value) {
                Marketing.Controls.getControl(NewAppointmentsDialog.DistributionId) && Marketing.Controls.getControl(NewAppointmentsDialog.DistributionId).setDisabled(value);
                Marketing.Controls.getControl(NewAppointmentsDialog.NextId) && Marketing.Controls.getControl(NewAppointmentsDialog.NextId).setDisabled(value);
            };
            return _this;
        }
        NewAppointmentsDialog.prototype.validateActivity = function () {
            return __awaiter(this, void 0, void 0, function () {
                var messages, subject, scheduledStart, scheduledEnd, controlMessages;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            messages = [];
                            subject = Marketing.Controls.getValue(NewAppointmentsDialog.SubjectId);
                            if (ClientUtility.DataUtil.isNullOrWhiteSpace(subject)) {
                                messages.push(Marketing.StringProvider.getResourceString(NewAppointmentsDialog.SubjectRequired));
                            }
                            scheduledStart = Marketing.Controls.getValue(NewAppointmentsDialog.StartTimeId);
                            if (ClientUtility.DataUtil.isNullOrUndefined(scheduledStart)) {
                                messages.push(Marketing.StringProvider.getResourceString(NewAppointmentsDialog.StartTimeRequired));
                            }
                            scheduledEnd = Marketing.Controls.getValue(NewAppointmentsDialog.EndTimeId);
                            if (ClientUtility.DataUtil.isNullOrUndefined(scheduledEnd)) {
                                messages.push(Marketing.StringProvider.getResourceString(NewAppointmentsDialog.EndTimeRequired));
                            }
                            return [4 /*yield*/, Marketing.ClientUtil.validateActivity(Marketing.EntityTypeCodes.Appointment)];
                        case 1:
                            controlMessages = (_a.sent()).messages;
                            if (!ClientUtility.DataUtil.isNullOrEmptyString(controlMessages)) {
                                messages.push(controlMessages);
                            }
                            return [2 /*return*/, {
                                    valid: messages.length === 0,
                                    messages: messages.join("\n")
                                }];
                    }
                });
            });
        };
        Object.defineProperty(NewAppointmentsDialog.prototype, "activityXml", {
            get: function () {
                var description = Marketing.Controls.getValue(NewAppointmentsDialog.DescriptionId);
                var priorityCode = Marketing.Controls.getValue(NewAppointmentsDialog.PriorityCodeId);
                var isAllDayEvent = Marketing.Controls.getValue(NewAppointmentsDialog.AllDayEventId);
                var location = Marketing.Controls.getValue(NewAppointmentsDialog.LocationControlId);
                var scheduledDurationMinutes = Marketing.Controls.getValue(NewAppointmentsDialog.ScheduledDurationMinutesId) || 0;
                var scheduledEnd = Marketing.Controls.getValue(NewAppointmentsDialog.EndTimeId);
                var scheduledStart = Marketing.Controls.getValue(NewAppointmentsDialog.StartTimeId);
                var subject = Marketing.Controls.getValue(NewAppointmentsDialog.SubjectId);
                var transactionCurrency = Marketing.Controls.getValue(Marketing.NewActivityDialog.TransactionCurrency);
                var formValues = JSON.parse(Marketing.Controls.getValue(Marketing.ClientUtil.AppointmentFormValues));
                var scheduledEndIso = !ClientUtility.DataUtil.isNullOrUndefined(scheduledEnd) ? scheduledEnd.toISOString() : "";
                var scheduledStartIso = !ClientUtility.DataUtil.isNullOrUndefined(scheduledStart) ? scheduledStart.toISOString() : "";
                var encodedDescription = !ClientUtility.DataUtil.isNullOrUndefined(description) ? Xrm.Encoding.xmlEncode(description) : "";
                var encodedSubject = !ClientUtility.DataUtil.isNullOrUndefined(subject) ? Xrm.Encoding.xmlEncode(subject) : "";
                var encodedLocation = !ClientUtility.DataUtil.isNullOrUndefined(location) ? Xrm.Encoding.xmlEncode(location) : "";
                var formXml = "";
                if (formValues && formValues.length > 0) {
                    for (var i = 0; i < formValues.length; i++) {
                        var logicalName = formValues[i].logicalName;
                        var value = formValues[i].value;
                        if (!ClientUtility.DataUtil.isNullOrEmptyString(value)) {
                            if (typeof (value) === "object") {
                                if (value.length > 0) {
                                    var typeCode = Xrm.Internal.getEntityCode(value[0]._etn);
                                    formXml = formXml + ("<" + logicalName + " name=\"" + value[0]._name + "\" type=\"" + typeCode + "\">{" + value[0]._id + "}</" + logicalName + ">");
                                }
                            }
                            else {
                                formXml = formXml + ("<" + logicalName + ">" + value + "</" + logicalName + ">");
                            }
                        }
                    }
                }
                return "\n                    <appointment>\n                        <activitytypecode name=\"Appointment\">" + Marketing.EntityTypeCodes.Appointment + "</activitytypecode>\n                        <attachmenterrors name=\"\">0</attachmenterrors>\n                        <description>" + encodedDescription + "</description>\n                        <isalldayevent>" + isAllDayEvent + "</isalldayevent>\n                        <isbilled name=\"False\">false</isbilled>\n                        <ismapiprivate name=\"False\">false</ismapiprivate>\n                        <isregularactivity name=\"False\">false</isregularactivity>\n                        <isworkflowcreated name=\"False\">false</isworkflowcreated>\n                        <location>" + encodedLocation + "</location>\n                        <prioritycode>" + priorityCode + "</prioritycode>\n                        <scheduleddurationminutes>" + scheduledDurationMinutes + "</scheduleddurationminutes>\n                        <scheduledstart>" + scheduledStartIso + "</scheduledstart>\n                        <scheduledend>" + scheduledEndIso + "</scheduledend>                       \n                        <subject>" + encodedSubject + "</subject>\n                        <transactioncurrencyid name=\"" + transactionCurrency.name + "\" type=\"" + Marketing.EntityTypeCodes.TransactionCurrency + "\">" + transactionCurrency.id + "</transactioncurrencyid>\n                        " + formXml + "\n                    </appointment>";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NewAppointmentsDialog.prototype, "Activity", {
            get: function () {
                return _a = {},
                    _a[Marketing.OData.TypeFieldName] = "" + Marketing.OData.TypeFieldValuePrefix + Marketing.EntityNames.Appointment,
                    _a[Marketing.ActivityEntityFieldNames.ActivityId] = ClientUtility.Guid.newGuid(),
                    _a[Marketing.ActivityEntityFieldNames.Description] = Marketing.Controls.getValue(NewAppointmentsDialog.DescriptionId),
                    _a[Marketing.ActivityEntityFieldNames.IsMapIPrivate] = false,
                    _a[Marketing.ActivityEntityFieldNames.IsRegularActivity] = false,
                    _a[Marketing.ActivityEntityFieldNames.PriorityCode] = Marketing.Controls.getValue(NewAppointmentsDialog.PriorityCodeId),
                    _a[Marketing.ActivityEntityFieldNames.ScheduledDurationMinutes] = Marketing.Controls.getValue(NewAppointmentsDialog.ScheduledDurationMinutesId),
                    _a[Marketing.ActivityEntityFieldNames.ScheduledEnd] = Marketing.Controls.getValue(NewAppointmentsDialog.EndTimeId),
                    _a[Marketing.ActivityEntityFieldNames.ScheduledStart] = Marketing.Controls.getValue(NewAppointmentsDialog.StartTimeId),
                    _a[Marketing.ActivityEntityFieldNames.StateCode] = 0 /* Open */,
                    _a[Marketing.ActivityEntityFieldNames.Subject] = Marketing.Controls.getValue(NewAppointmentsDialog.SubjectId),
                    _a[Marketing.AppointmentEntityFieldNames.IsAllDayEvent] = Marketing.Controls.getValue(NewAppointmentsDialog.AllDayEventId),
                    _a[Marketing.AppointmentEntityFieldNames.Location] = Marketing.Controls.getValue(NewAppointmentsDialog.LocationControlId),
                    _a;
                var _a;
            },
            enumerable: true,
            configurable: true
        });
        NewAppointmentsDialog.prototype.setDefaultStartTime = function (now) {
            Marketing.Controls.setValue(NewAppointmentsDialog.StartTimeId, now);
        };
        NewAppointmentsDialog.prototype.setDefaultEndTime = function (now) {
            Marketing.Controls.setValue(NewAppointmentsDialog.EndTimeId, Marketing.DateHelper.addMinutes(now, Marketing.Default.DurationMinutes));
        };
        NewAppointmentsDialog.prototype.setStartTimeFormat = function (showTime) {
            Marketing.Controls.getControl(NewAppointmentsDialog.StartTimeId).setShowTime(showTime);
        };
        NewAppointmentsDialog.prototype.setEndTimeFormat = function (showTime) {
            Marketing.Controls.getControl(NewAppointmentsDialog.EndTimeId).setShowTime(showTime);
        };
        NewAppointmentsDialog.prototype.setDurationTime = function (wholeDays) {
            var durationMinutes = wholeDays
                ? NewAppointmentsDialog.DefaultAllDayDurationMinutes
                : Marketing.Default.DurationMinutes;
            Marketing.Controls.setValue(NewAppointmentsDialog.ScheduledDurationMinutesId, durationMinutes);
        };
        NewAppointmentsDialog.prototype.recalculateDuration = function () {
            var startTime = Marketing.Controls.getValue(NewAppointmentsDialog.StartTimeId);
            var endTime = Marketing.Controls.getValue(NewAppointmentsDialog.EndTimeId);
            if (startTime && endTime) {
                var durationMilliseconds = endTime.getTime() - startTime.getTime();
                var durationMinutes = Math.floor(durationMilliseconds / (Marketing.DateHelper.MillisecondsPerSecond * Marketing.DateHelper.SecondsPerMinute));
                Marketing.Controls.setValue(NewAppointmentsDialog.ScheduledDurationMinutesId, durationMinutes);
            }
        };
        NewAppointmentsDialog.prototype.recalculateEndTime = function () {
            var actualDurationMinutes = Marketing.Controls.getValue(NewAppointmentsDialog.ScheduledDurationMinutesId);
            var startTime = Marketing.Controls.getValue(NewAppointmentsDialog.StartTimeId);
            var duratiomMilliseconds = actualDurationMinutes * Marketing.DateHelper.SecondsPerMinute * Marketing.DateHelper.MillisecondsPerSecond;
            var startTimeMilliseconds = +startTime;
            var newEndTime = new Date(startTimeMilliseconds + duratiomMilliseconds);
            Marketing.Controls.setValue(NewAppointmentsDialog.EndTimeId, newEndTime);
        };
        NewAppointmentsDialog.prototype.refreshAllDayEvent = function () {
            var allDayEvent = Marketing.Controls.getValue(NewAppointmentsDialog.AllDayEventId);
            if (!allDayEvent) {
                return;
            }
            var actualDurationMinutes = Marketing.Controls.getValue(NewAppointmentsDialog.ScheduledDurationMinutesId);
            var totalMinutesInTheDay = Marketing.DateHelper.HoursPerDay * Marketing.DateHelper.MinutesPerHour;
            var dayRemainder = actualDurationMinutes % totalMinutesInTheDay;
            allDayEvent = dayRemainder === 0;
            Marketing.Controls.setValue(NewAppointmentsDialog.AllDayEventId, allDayEvent);
        };
        NewAppointmentsDialog.prototype.validateStartDateIsSmallerThanEndDate = function () {
            var startTime = Marketing.Controls.getAttribute(NewAppointmentsDialog.StartTimeId);
            var endTime = Marketing.Controls.getAttribute(NewAppointmentsDialog.EndTimeId);
            var message = Marketing.StringProvider.getResourceString(NewAppointmentsDialog.StartDateGreaterThanEndDate);
            return Marketing.DateValidation.validateStartDateIsSmallerThanEndDate(startTime, endTime, message, endTime);
        };
        return NewAppointmentsDialog;
    }(Marketing.NewActivityDialog));
    NewAppointmentsDialog.Prefix = "appointment";
    NewAppointmentsDialog.ScheduledDurationMinutesId = NewAppointmentsDialog.Prefix + "_actual_duration_minutes";
    NewAppointmentsDialog.DescriptionId = NewAppointmentsDialog.Prefix + "_description";
    NewAppointmentsDialog.SubjectId = NewAppointmentsDialog.Prefix + "_subject";
    NewAppointmentsDialog.AllDayEventId = NewAppointmentsDialog.Prefix + "_all_day_event";
    NewAppointmentsDialog.EndTimeId = NewAppointmentsDialog.Prefix + "_end_time";
    NewAppointmentsDialog.LocationControlId = NewAppointmentsDialog.Prefix + "_location";
    NewAppointmentsDialog.StartTimeId = NewAppointmentsDialog.Prefix + "_start_time";
    NewAppointmentsDialog.PriorityCodeId = NewAppointmentsDialog.Prefix + "_priority_code";
    NewAppointmentsDialog.StartDateGreaterThanEndDate = "MA_Alert_StartDate_GreaterThan_EndDate";
    NewAppointmentsDialog.StartTimeRequired = "MA.Activity.StartTimeRequired";
    NewAppointmentsDialog.EndTimeRequired = "MA.Activity.EndTimeRequired";
    NewAppointmentsDialog.DistributionId = "distribute_id";
    NewAppointmentsDialog.NextId = NewAppointmentsDialog.Prefix + "_tab_continue_id";
    Marketing.NewAppointmentsDialog = NewAppointmentsDialog;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var NewEmailsDialog = (function (_super) {
        __extends(NewEmailsDialog, _super);
        function NewEmailsDialog() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.onUseTemplateChanged = function () {
                var useTemplate = Marketing.Controls.getValue(NewEmailsDialog.UseTemplateId);
                _this.disableSubject(useTemplate);
                _this.disableEmailEditor(useTemplate);
                _this.disableSelectTemplate(!useTemplate);
            };
            _this.onDialogLoaded = function () { return __awaiter(_this, void 0, void 0, function () {
                var channelName, objective;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Marketing.Controls.setValue(NewEmailsDialog.ActualDurationMinutesId, Marketing.Default.DurationMinutes);
                            Marketing.Controls.setValue(NewEmailsDialog.ScheduledEndId, null);
                            channelName = ClientUtility.PageUtil.getDataAttributeValue(Marketing.NewActivityDialog.ChannelName);
                            if (channelName != null) {
                                Xrm.Page.ui.controls.get(Marketing.NewActivityDialog.HeaderTitle).setLabel(ClientUtility.StringUtil.format(Marketing.StringProvider.getResourceString(Marketing.NewActivityDialog.CampaignDistributionTitle), channelName));
                                Xrm.Page.ui.controls.get(Marketing.NewActivityDialog.SubTitle).setLabel(ClientUtility.StringUtil.format(Marketing.StringProvider.getResourceString(Marketing.NewActivityDialog.CampaignDistributionDescription), channelName));
                            }
                            return [4 /*yield*/, this.getCampaignObjective()];
                        case 1:
                            objective = _a.sent();
                            if (objective) {
                                Marketing.Controls.setValue(NewEmailsDialog.DescriptionId, objective);
                            }
                            return [2 /*return*/];
                    }
                });
            }); };
            return _this;
        }
        NewEmailsDialog.prototype.validateActivity = function () {
            return __awaiter(this, void 0, void 0, function () {
                var messages, subject, useTemplate, selectedTemplate, controlMessages;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            messages = [];
                            subject = Marketing.Controls.getValue(NewEmailsDialog.SubjectId);
                            useTemplate = Marketing.Controls.getValue(NewEmailsDialog.UseTemplateId);
                            selectedTemplate = Marketing.Controls.getValue(NewEmailsDialog.SelectedTemplateId);
                            if (!useTemplate && ClientUtility.DataUtil.isNullOrWhiteSpace(subject)) {
                                messages.push(Marketing.StringProvider.getResourceString(Marketing.NewActivityDialog.SubjectRequired));
                            }
                            if (useTemplate && ClientUtility.DataUtil.isNullOrWhiteSpace(selectedTemplate)) {
                                messages.push(Marketing.StringProvider.getResourceString(NewEmailsDialog.TemplateRequired));
                            }
                            return [4 /*yield*/, Marketing.ClientUtil.validateActivity(Marketing.EntityTypeCodes.Email)];
                        case 1:
                            controlMessages = (_a.sent()).messages;
                            if (!ClientUtility.DataUtil.isNullOrEmptyString(controlMessages)) {
                                messages.push(controlMessages);
                            }
                            return [2 /*return*/, {
                                    valid: messages.length === 0,
                                    messages: messages.join("\n")
                                }];
                    }
                });
            });
        };
        Object.defineProperty(NewEmailsDialog.prototype, "activityXml", {
            get: function () {
                var actualDurationMinutes = Marketing.Controls.getValue(NewEmailsDialog.ActualDurationMinutesId) || 0;
                var description = Marketing.Controls.getValue(NewEmailsDialog.DescriptionId);
                var fromInfo = Marketing.Controls.getValue(NewEmailsDialog.FromId);
                var priorityCode = Marketing.Controls.getValue(NewEmailsDialog.PriorityCodeId);
                var scheduledEnd = Marketing.Controls.getValue(NewEmailsDialog.ScheduledEndId);
                var subject = Marketing.Controls.getValue(NewEmailsDialog.SubjectId);
                var transactionCurrency = Marketing.Controls.getValue(Marketing.NewActivityDialog.TransactionCurrency);
                var formValues = JSON.parse(Marketing.Controls.getValue(Marketing.ClientUtil.EmailFormValues));
                var scheduledEndIso = !ClientUtility.DataUtil.isNullOrUndefined(scheduledEnd) ? scheduledEnd.toISOString() : "";
                var encodedDescription = !ClientUtility.DataUtil.isNullOrUndefined(description) ? Xrm.Encoding.xmlEncode(description) : "";
                var encodedSubject = !ClientUtility.DataUtil.isNullOrUndefined(subject) ? Xrm.Encoding.xmlEncode(subject) : "";
                var fromInfoName = (!ClientUtility.DataUtil.isNullOrUndefined(fromInfo) && fromInfo.length > 0 && !ClientUtility.DataUtil.isNullOrUndefined(fromInfo[0].name)) ? Xrm.Encoding.xmlEncode(fromInfo[0].name) : "";
                var fromSection = fromInfo && fromInfo.length
                    ? "<from>\n                    <activityparty>\n                        <partyid name=\"" + fromInfoName + "\" type=\"" + Marketing.ClientUtil.getEntityTypeCode(fromInfo[0].entityType) + "\">" + fromInfo[0].id + "</partyid>\n                    </activityparty>\n                  </from>"
                    : "";
                var formXml = "";
                if (formValues && formValues.length > 0) {
                    for (var i = 0; i < formValues.length; i++) {
                        var logicalName = formValues[i].logicalName;
                        var value = formValues[i].value;
                        if (!ClientUtility.DataUtil.isNullOrEmptyString(value)) {
                            if (typeof (value) === "object") {
                                if (value.length > 0) {
                                    var typeCode = Xrm.Internal.getEntityCode(value[0]._etn);
                                    formXml = formXml + ("<" + logicalName + " name=\"" + value[0]._name + "\" type=\"" + typeCode + "\">{" + value[0]._id + "}</" + logicalName + ">");
                                }
                            }
                            else {
                                formXml = formXml + ("<" + logicalName + ">" + value + "</" + logicalName + ">");
                            }
                        }
                    }
                }
                return "\n                <email>\n                    " + fromSection + "\n                    <activitytypecode name=\"Email\">" + Marketing.EntityTypeCodes.Email + "</activitytypecode>\n                    <actualdurationminutes>" + actualDurationMinutes + "</actualdurationminutes>\n                    <description>" + encodedDescription + "</description>\n                    <directioncode>true</directioncode>\n                    <isregularactivity name=\"False\">false</isregularactivity>\n                    <isworkflowcreated name=\"False\">false</isworkflowcreated>\n                    <prioritycode>" + priorityCode + "</prioritycode>\n                    <scheduledend>" + scheduledEndIso + "</scheduledend>\n                    <subject>" + encodedSubject + "</subject>\n                    <transactioncurrencyid name=\"" + transactionCurrency.name + "\" type=\"" + Marketing.EntityTypeCodes.TransactionCurrency + "\">" + transactionCurrency.id + "</transactioncurrencyid>\n                    <emailremindertype name=\"\">0</emailremindertype>\n                    <isemailfollowed name=\"False\">false</isemailfollowed>\n                    <isemailreminderset name=\"False\">false</isemailreminderset>\n                    <followemailuserpreference name=\"False\">false</followemailuserpreference>\n                    <notifications name=\"\">0</notifications>\n                    <deliveryreceiptrequested name=\"False\">false</deliveryreceiptrequested>\n                    <emailreminderstatus name=\"\">0</emailreminderstatus>\n                    <correlationmethod name=\"\">0</correlationmethod>\n                    <compressed name=\"False\">false</compressed>\n                    <readreceiptrequested name=\"False\">false</readreceiptrequested>\n                    <deliveryprioritycode name=\"\">1</deliveryprioritycode>\n                    " + formXml + "\n                </email>";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NewEmailsDialog.prototype, "Activity", {
            get: function () {
                var fromList = Marketing.Controls.getValue(NewEmailsDialog.FromId);
                var emailActivityParties = (ClientUtility.DataUtil.isNullOrUndefined(fromList) || fromList.length === 0) ? [] : fromList.map(function (f) {
                    return (_a = {},
                        _a["partyid_" + f.entityType + "@odata.bind"] = "/" + Marketing.EntityNames.pluralized(f.entityType) + "(" + ClientUtility.Guid.tryCreate(f.id) + ")",
                        _a[Marketing.EmailEntityFieldNames.ParticipationTypeMask] = 1 /* Sender */,
                        _a);
                    var _a;
                });
                return _a = {},
                    _a[Marketing.OData.TypeFieldName] = "" + Marketing.OData.TypeFieldValuePrefix + Marketing.EntityNames.Email,
                    _a[Marketing.ActivityEntityFieldNames.ActivityId] = ClientUtility.Guid.newGuid(),
                    _a[Marketing.ActivityEntityFieldNames.ActualDurationMinutes] = Marketing.Controls.getValue(NewEmailsDialog.ActualDurationMinutesId),
                    _a[Marketing.ActivityEntityFieldNames.Description] = Marketing.Controls.getValue(NewEmailsDialog.DescriptionId),
                    _a[Marketing.ActivityEntityFieldNames.DirectionCode] = Marketing.ActivityDirectionCode.Outgoing,
                    _a[Marketing.ActivityEntityFieldNames.IsRegularActivity] = false,
                    _a[Marketing.ActivityEntityFieldNames.PriorityCode] = Marketing.Controls.getValue(NewEmailsDialog.PriorityCodeId),
                    _a[Marketing.ActivityEntityFieldNames.ScheduledEnd] = Marketing.Controls.getValue(NewEmailsDialog.ScheduledEndId),
                    _a[Marketing.ActivityEntityFieldNames.StateCode] = 0 /* Open */,
                    _a[Marketing.ActivityEntityFieldNames.StatusCode] = 1 /* Draft */,
                    _a[Marketing.ActivityEntityFieldNames.Subject] = Marketing.Controls.getValue(NewEmailsDialog.SubjectId),
                    _a[Marketing.EmailEntityFieldNames.Compressed] = false,
                    _a[Marketing.EmailEntityFieldNames.CorrelationMethod] = 0 /* None */,
                    _a[Marketing.EmailEntityFieldNames.DeliveryReceiptRequested] = false,
                    _a[Marketing.EmailEntityFieldNames.EmailActivityParties] = emailActivityParties,
                    _a[Marketing.EmailEntityFieldNames.EmailReminderStatus] = 0 /* NotSet */,
                    _a[Marketing.EmailEntityFieldNames.EmailReminderType] = 0 /* IfIDoNotReceiveAReplyBy */,
                    _a[Marketing.EmailEntityFieldNames.FollowEmailUserPreference] = false,
                    _a[Marketing.EmailEntityFieldNames.IsEmailFollowed] = false,
                    _a[Marketing.EmailEntityFieldNames.IsEmailReminderSet] = false,
                    _a[Marketing.EmailEntityFieldNames.ReadReceiptRequested] = false,
                    _a;
                var _a;
            },
            enumerable: true,
            configurable: true
        });
        NewEmailsDialog.prototype.disableSubject = function (disabled) {
            Marketing.Controls.setRequired(NewEmailsDialog.SubjectId, !disabled);
            Marketing.Controls.getControl(NewEmailsDialog.SubjectId).setDisabled(disabled);
        };
        NewEmailsDialog.prototype.disableEmailEditor = function (disabled) {
            Marketing.Controls.getControl(NewEmailsDialog.DescriptionCustomControlId).setDisabled(disabled);
        };
        NewEmailsDialog.prototype.disableSelectTemplate = function (disabled) {
            Marketing.Controls.getControl(NewEmailsDialog.SelectEmailTemplateId).setDisabled(disabled);
            if (disabled) {
                Marketing.Controls.setValue(NewEmailsDialog.SelectEmailTemplateId, null);
                Marketing.Controls.setValue(NewEmailsDialog.SelectedTemplateId, null);
            }
        };
        NewEmailsDialog.getCurrentUser = function () {
            return {
                id: ClientUtility.Guid.tryCreate(Xrm.Page.context.getUserId()),
                entityType: Marketing.EntityNames.SystemUser,
                name: Xrm.Page.context.getUserName(),
            };
        };
        return NewEmailsDialog;
    }(Marketing.NewActivityDialog));
    NewEmailsDialog.Prefix = "email";
    NewEmailsDialog.ActualDurationMinutesId = NewEmailsDialog.Prefix + "_actual_duration_minutes";
    NewEmailsDialog.PriorityCodeId = NewEmailsDialog.Prefix + "_priority_code";
    NewEmailsDialog.ScheduledEndId = NewEmailsDialog.Prefix + "_scheduled_end";
    NewEmailsDialog.SubjectId = NewEmailsDialog.Prefix + "_subject";
    NewEmailsDialog.DescriptionCustomControlId = NewEmailsDialog.Prefix + "_description_cc";
    NewEmailsDialog.DescriptionId = NewEmailsDialog.Prefix + "_description";
    NewEmailsDialog.FromId = NewEmailsDialog.Prefix + "_from";
    NewEmailsDialog.SelectEmailTemplateId = NewEmailsDialog.Prefix + "_select_template_button_cc";
    NewEmailsDialog.SelectedTemplateId = NewEmailsDialog.Prefix + "_selected_template_id";
    NewEmailsDialog.UseTemplateId = NewEmailsDialog.Prefix + "_use_template";
    NewEmailsDialog.TemplateRequired = "MA.Activity.TemplateRequired";
    Marketing.NewEmailsDialog = NewEmailsDialog;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var NewFaxesDialog = (function (_super) {
        __extends(NewFaxesDialog, _super);
        function NewFaxesDialog() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.onDialogLoaded = function () { return __awaiter(_this, void 0, void 0, function () {
                var channelName, objective;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Marketing.Controls.setValue(NewFaxesDialog.ActualDurationMinutesId, Marketing.Default.DurationMinutes);
                            Marketing.Controls.setValue(NewFaxesDialog.ScheduledEndId, null);
                            channelName = ClientUtility.PageUtil.getDataAttributeValue(Marketing.NewActivityDialog.ChannelName);
                            if (channelName != null) {
                                Xrm.Page.ui.controls.get(Marketing.NewActivityDialog.HeaderTitle).setLabel(ClientUtility.StringUtil.format(Marketing.StringProvider.getResourceString(Marketing.NewActivityDialog.CampaignDistributionTitle), channelName));
                                Xrm.Page.ui.controls.get(Marketing.NewActivityDialog.SubTitle).setLabel(ClientUtility.StringUtil.format(Marketing.StringProvider.getResourceString(Marketing.NewActivityDialog.CampaignDistributionDescription), channelName));
                            }
                            return [4 /*yield*/, this.getCampaignObjective()];
                        case 1:
                            objective = _a.sent();
                            if (objective) {
                                Marketing.Controls.setValue(NewFaxesDialog.DescriptionId, objective);
                            }
                            return [2 /*return*/];
                    }
                });
            }); };
            return _this;
        }
        NewFaxesDialog.prototype.validateActivity = function () {
            return __awaiter(this, void 0, void 0, function () {
                var messages, subject, controlMessages;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            messages = [];
                            subject = Marketing.Controls.getValue(NewFaxesDialog.SubjectId);
                            if (ClientUtility.DataUtil.isNullOrWhiteSpace(subject)) {
                                messages.push(Marketing.StringProvider.getResourceString(Marketing.NewActivityDialog.SubjectRequired));
                            }
                            return [4 /*yield*/, Marketing.ClientUtil.validateActivity(Marketing.EntityTypeCodes.Fax)];
                        case 1:
                            controlMessages = (_a.sent()).messages;
                            if (!ClientUtility.DataUtil.isNullOrEmptyString(controlMessages)) {
                                messages.push(controlMessages);
                            }
                            return [2 /*return*/, {
                                    valid: messages.length === 0,
                                    messages: messages.join("\n")
                                }];
                    }
                });
            });
        };
        Object.defineProperty(NewFaxesDialog.prototype, "activityXml", {
            get: function () {
                var actualDurationMinutes = Marketing.Controls.getValue(NewFaxesDialog.ActualDurationMinutesId) || 0;
                var description = Marketing.Controls.getValue(NewFaxesDialog.DescriptionId);
                var priorityCode = Marketing.Controls.getValue(NewFaxesDialog.PriorityCodeId);
                var scheduledEnd = Marketing.Controls.getValue(NewFaxesDialog.ScheduledEndId);
                var subject = Marketing.Controls.getValue(NewFaxesDialog.SubjectId);
                var transactionCurrency = Marketing.Controls.getValue(Marketing.NewActivityDialog.TransactionCurrency);
                var formValues = JSON.parse(Marketing.Controls.getValue(Marketing.ClientUtil.FaxFormValues));
                var scheduledEndIso = !ClientUtility.DataUtil.isNullOrUndefined(scheduledEnd) ? scheduledEnd.toISOString() : "";
                var encodedDescription = !ClientUtility.DataUtil.isNullOrUndefined(description) ? Xrm.Encoding.xmlEncode(description) : "";
                var encodedSubject = !ClientUtility.DataUtil.isNullOrUndefined(subject) ? Xrm.Encoding.xmlEncode(subject) : "";
                var formXml = "";
                if (formValues && formValues.length > 0) {
                    for (var i = 0; i < formValues.length; i++) {
                        var logicalName = formValues[i].logicalName;
                        var value = formValues[i].value;
                        if (!ClientUtility.DataUtil.isNullOrEmptyString(value)) {
                            if (typeof (value) === "object") {
                                if (value.length > 0) {
                                    var typeCode = Xrm.Internal.getEntityCode(value[0]._etn);
                                    formXml = formXml + ("<" + logicalName + " name=\"" + value[0]._name + "\" type=\"" + typeCode + "\">{" + value[0]._id + "}</" + logicalName + ">");
                                }
                            }
                            else {
                                formXml = formXml + ("<" + logicalName + ">" + value + "</" + logicalName + ">");
                            }
                        }
                    }
                }
                return "\n                <fax>\n                    <activitytypecode name=\"Fax\">" + Marketing.EntityTypeCodes.Fax + "</activitytypecode>\n                    <actualdurationminutes>" + actualDurationMinutes + "</actualdurationminutes>\n                    <description>" + encodedDescription + "</description>\n                    <directioncode>true</directioncode>\n                    <isbilled name=\"False\">false</isbilled>\n                    <isregularactivity name=\"False\">false</isregularactivity>\n                    <isworkflowcreated name=\"False\">false</isworkflowcreated>\n                    <prioritycode>" + priorityCode + "</prioritycode>\n                    <scheduledend>" + scheduledEndIso + "</scheduledend>                    \n                    <subject>" + encodedSubject + "</subject>\n                    <transactioncurrencyid name=\"" + transactionCurrency.name + "\" type=\"" + Marketing.EntityTypeCodes.TransactionCurrency + "\">" + transactionCurrency.id + "</transactioncurrencyid>\n                    " + formXml + "\n                </fax>";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NewFaxesDialog.prototype, "Activity", {
            get: function () {
                return _a = {},
                    _a[Marketing.OData.TypeFieldName] = "" + Marketing.OData.TypeFieldValuePrefix + Marketing.EntityNames.Fax,
                    _a[Marketing.ActivityEntityFieldNames.ActivityId] = ClientUtility.Guid.newGuid(),
                    _a[Marketing.ActivityEntityFieldNames.ActualDurationMinutes] = Marketing.Controls.getValue(NewFaxesDialog.ActualDurationMinutesId),
                    _a[Marketing.ActivityEntityFieldNames.Description] = Marketing.Controls.getValue(NewFaxesDialog.DescriptionId),
                    _a[Marketing.ActivityEntityFieldNames.DirectionCode] = Marketing.ActivityDirectionCode.Outgoing,
                    _a[Marketing.ActivityEntityFieldNames.IsRegularActivity] = false,
                    _a[Marketing.ActivityEntityFieldNames.PriorityCode] = Marketing.Controls.getValue(NewFaxesDialog.PriorityCodeId),
                    _a[Marketing.ActivityEntityFieldNames.ScheduledEnd] = Marketing.Controls.getValue(NewFaxesDialog.ScheduledEndId),
                    _a[Marketing.ActivityEntityFieldNames.StateCode] = 0 /* Open */,
                    _a[Marketing.ActivityEntityFieldNames.StatusCode] = 1 /* Open */,
                    _a[Marketing.ActivityEntityFieldNames.Subject] = Marketing.Controls.getValue(NewFaxesDialog.SubjectId),
                    _a;
                var _a;
            },
            enumerable: true,
            configurable: true
        });
        return NewFaxesDialog;
    }(Marketing.NewActivityDialog));
    NewFaxesDialog.Prefix = "fax";
    NewFaxesDialog.ActualDurationMinutesId = NewFaxesDialog.Prefix + "_actual_duration_minutes";
    NewFaxesDialog.DescriptionId = NewFaxesDialog.Prefix + "_description";
    NewFaxesDialog.PriorityCodeId = NewFaxesDialog.Prefix + "_priority_code";
    NewFaxesDialog.ScheduledEndId = NewFaxesDialog.Prefix + "_scheduled_end";
    NewFaxesDialog.SubjectId = NewFaxesDialog.Prefix + "_subject";
    Marketing.NewFaxesDialog = NewFaxesDialog;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var NewLettersDialog = (function (_super) {
        __extends(NewLettersDialog, _super);
        function NewLettersDialog() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.onDialogLoaded = function () { return __awaiter(_this, void 0, void 0, function () {
                var channelName, objective;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Marketing.Controls.setValue(NewLettersDialog.ActualDurationMinutesId, Marketing.Default.DurationMinutes);
                            Marketing.Controls.setValue(NewLettersDialog.ScheduledEndId, null);
                            channelName = ClientUtility.PageUtil.getDataAttributeValue(Marketing.NewActivityDialog.ChannelName);
                            if (channelName != null) {
                                Xrm.Page.ui.controls.get(Marketing.NewActivityDialog.HeaderTitle).setLabel(ClientUtility.StringUtil.format(Marketing.StringProvider.getResourceString(Marketing.NewActivityDialog.CampaignDistributionTitle), channelName));
                                Xrm.Page.ui.controls.get(Marketing.NewActivityDialog.SubTitle).setLabel(ClientUtility.StringUtil.format(Marketing.StringProvider.getResourceString(Marketing.NewActivityDialog.CampaignDistributionDescription), channelName));
                            }
                            return [4 /*yield*/, this.getCampaignObjective()];
                        case 1:
                            objective = _a.sent();
                            if (objective) {
                                Marketing.Controls.setValue(NewLettersDialog.DescriptionId, objective);
                            }
                            return [2 /*return*/];
                    }
                });
            }); };
            return _this;
        }
        NewLettersDialog.prototype.validateActivity = function () {
            return __awaiter(this, void 0, void 0, function () {
                var messages, subject, controlMessages;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            messages = [];
                            subject = Marketing.Controls.getValue(NewLettersDialog.SubjectId);
                            if (ClientUtility.DataUtil.isNullOrWhiteSpace(subject)) {
                                messages.push(Marketing.StringProvider.getResourceString(Marketing.NewActivityDialog.SubjectRequired));
                            }
                            return [4 /*yield*/, Marketing.ClientUtil.validateActivity(Marketing.EntityTypeCodes.Letter)];
                        case 1:
                            controlMessages = (_a.sent()).messages;
                            if (!ClientUtility.DataUtil.isNullOrEmptyString(controlMessages)) {
                                messages.push(controlMessages);
                            }
                            return [2 /*return*/, {
                                    valid: messages.length === 0,
                                    messages: messages.join("\n")
                                }];
                    }
                });
            });
        };
        Object.defineProperty(NewLettersDialog.prototype, "activityXml", {
            get: function () {
                var actualDurationMinutes = Marketing.Controls.getValue(NewLettersDialog.ActualDurationMinutesId) || 0;
                var description = Marketing.Controls.getValue(NewLettersDialog.DescriptionId);
                var priorityCode = Marketing.Controls.getValue(NewLettersDialog.PriorityCodeId);
                var scheduledEnd = Marketing.Controls.getValue(NewLettersDialog.ScheduledEndId);
                var subject = Marketing.Controls.getValue(NewLettersDialog.SubjectId);
                var transactionCurrency = Marketing.Controls.getValue(Marketing.NewActivityDialog.TransactionCurrency);
                var formValues = JSON.parse(Marketing.Controls.getValue(Marketing.ClientUtil.LetterFormValues));
                var scheduledEndIso = !ClientUtility.DataUtil.isNullOrUndefined(scheduledEnd) ? scheduledEnd.toISOString() : "";
                var encodedDescription = !ClientUtility.DataUtil.isNullOrUndefined(description) ? Xrm.Encoding.xmlEncode(description) : "";
                var encodedSubject = !ClientUtility.DataUtil.isNullOrUndefined(subject) ? Xrm.Encoding.xmlEncode(subject) : "";
                var formXml = "";
                if (formValues && formValues.length > 0) {
                    for (var i = 0; i < formValues.length; i++) {
                        var logicalName = formValues[i].logicalName;
                        var value = formValues[i].value;
                        if (!ClientUtility.DataUtil.isNullOrEmptyString(value)) {
                            if (typeof (value) === "object") {
                                if (value.length > 0) {
                                    var typeCode = Xrm.Internal.getEntityCode(value[0]._etn);
                                    formXml = formXml + ("<" + logicalName + " name=\"" + value[0]._name + "\" type=\"" + typeCode + "\">{" + value[0]._id + "}</" + logicalName + ">");
                                }
                            }
                            else {
                                formXml = formXml + ("<" + logicalName + ">" + value + "</" + logicalName + ">");
                            }
                        }
                    }
                }
                return "\n                <letter>\n                    <activitytypecode name=\"Letter\">" + Marketing.EntityTypeCodes.Letter + "</activitytypecode>\n                    <actualdurationminutes>" + actualDurationMinutes + "</actualdurationminutes>\n                    <description>" + encodedDescription + "</description>\n                    <directioncode>true</directioncode>\n                    <isbilled name=\"False\">false</isbilled>\n                    <isregularactivity name=\"False\">false</isregularactivity>\n                    <isworkflowcreated name=\"False\">false</isworkflowcreated>\n                    <prioritycode>" + priorityCode + "</prioritycode>\n                    <scheduledend>" + scheduledEndIso + "</scheduledend>                  \n                    <subject>" + encodedSubject + "</subject>\n                    <transactioncurrencyid name=\"" + transactionCurrency.name + "\" type=\"" + Marketing.EntityTypeCodes.TransactionCurrency + "\">" + transactionCurrency.id + "</transactioncurrencyid>\n                    " + formXml + "\n                </letter>";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NewLettersDialog.prototype, "Activity", {
            get: function () {
                return _a = {},
                    _a[Marketing.OData.TypeFieldName] = "" + Marketing.OData.TypeFieldValuePrefix + Marketing.EntityNames.Letter,
                    _a[Marketing.ActivityEntityFieldNames.ActivityId] = ClientUtility.Guid.newGuid(),
                    _a[Marketing.ActivityEntityFieldNames.ActualDurationMinutes] = Marketing.Controls.getValue(NewLettersDialog.ActualDurationMinutesId),
                    _a[Marketing.ActivityEntityFieldNames.Description] = Marketing.Controls.getValue(NewLettersDialog.DescriptionId),
                    _a[Marketing.ActivityEntityFieldNames.DirectionCode] = Marketing.ActivityDirectionCode.Outgoing,
                    _a[Marketing.ActivityEntityFieldNames.IsRegularActivity] = false,
                    _a[Marketing.ActivityEntityFieldNames.PriorityCode] = Marketing.Controls.getValue(NewLettersDialog.PriorityCodeId),
                    _a[Marketing.ActivityEntityFieldNames.ScheduledEnd] = Marketing.Controls.getValue(NewLettersDialog.ScheduledEndId),
                    _a[Marketing.ActivityEntityFieldNames.StateCode] = 0 /* Open */,
                    _a[Marketing.ActivityEntityFieldNames.StatusCode] = 2 /* Draft */,
                    _a[Marketing.ActivityEntityFieldNames.Subject] = Marketing.Controls.getValue(NewLettersDialog.SubjectId),
                    _a;
                var _a;
            },
            enumerable: true,
            configurable: true
        });
        return NewLettersDialog;
    }(Marketing.NewActivityDialog));
    NewLettersDialog.Prefix = "letter";
    NewLettersDialog.ActualDurationMinutesId = NewLettersDialog.Prefix + "_actual_duration_minutes";
    NewLettersDialog.DescriptionId = NewLettersDialog.Prefix + "_description";
    NewLettersDialog.PriorityCodeId = NewLettersDialog.Prefix + "_priority_code";
    NewLettersDialog.ScheduledEndId = NewLettersDialog.Prefix + "_scheduled_end";
    NewLettersDialog.SubjectId = NewLettersDialog.Prefix + "_subject";
    Marketing.NewLettersDialog = NewLettersDialog;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var NewPhoneCallsDialog = (function (_super) {
        __extends(NewPhoneCallsDialog, _super);
        function NewPhoneCallsDialog() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.onDialogLoaded = function () { return __awaiter(_this, void 0, void 0, function () {
                var channelName, objective;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Marketing.Controls.setValue(NewPhoneCallsDialog.ActualDurationMinutesId, Marketing.Default.DurationMinutes);
                            Marketing.Controls.setValue(NewPhoneCallsDialog.ScheduledEndId, null);
                            channelName = ClientUtility.PageUtil.getDataAttributeValue(Marketing.NewActivityDialog.ChannelName);
                            if (channelName != null) {
                                Xrm.Page.ui.controls.get(Marketing.NewActivityDialog.HeaderTitle).setLabel(ClientUtility.StringUtil.format(Marketing.StringProvider.getResourceString(Marketing.NewActivityDialog.CampaignDistributionTitle), channelName));
                                Xrm.Page.ui.controls.get(Marketing.NewActivityDialog.SubTitle).setLabel(ClientUtility.StringUtil.format(Marketing.StringProvider.getResourceString(Marketing.NewActivityDialog.CampaignDistributionDescription), channelName));
                            }
                            return [4 /*yield*/, this.getCampaignObjective()];
                        case 1:
                            objective = _a.sent();
                            if (objective) {
                                Marketing.Controls.setValue(NewPhoneCallsDialog.DescriptionId, objective);
                            }
                            return [2 /*return*/];
                    }
                });
            }); };
            return _this;
        }
        NewPhoneCallsDialog.prototype.validateActivity = function () {
            return __awaiter(this, void 0, void 0, function () {
                var messages, subject, controlMessages;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            messages = [];
                            subject = Marketing.Controls.getValue(NewPhoneCallsDialog.SubjectId);
                            if (ClientUtility.DataUtil.isNullOrWhiteSpace(subject)) {
                                messages.push(Marketing.StringProvider.getResourceString(Marketing.NewActivityDialog.SubjectRequired));
                            }
                            return [4 /*yield*/, Marketing.ClientUtil.validateActivity(Marketing.EntityTypeCodes.PhoneCall)];
                        case 1:
                            controlMessages = (_a.sent()).messages;
                            if (!ClientUtility.DataUtil.isNullOrEmptyString(controlMessages)) {
                                messages.push(controlMessages);
                            }
                            return [2 /*return*/, {
                                    valid: messages.length === 0,
                                    messages: messages.join("\n")
                                }];
                    }
                });
            });
        };
        Object.defineProperty(NewPhoneCallsDialog.prototype, "activityXml", {
            get: function () {
                var actualDurationMinutes = Marketing.Controls.getValue(NewPhoneCallsDialog.ActualDurationMinutesId) || 0;
                var description = Marketing.Controls.getValue(NewPhoneCallsDialog.DescriptionId);
                var priorityCode = Marketing.Controls.getValue(NewPhoneCallsDialog.PriorityCodeId);
                var scheduledEnd = Marketing.Controls.getValue(NewPhoneCallsDialog.ScheduledEndId);
                var subject = Marketing.Controls.getValue(NewPhoneCallsDialog.SubjectId);
                var transactionCurrency = Marketing.Controls.getValue(Marketing.NewActivityDialog.TransactionCurrency);
                var formValues = JSON.parse(Marketing.Controls.getValue(Marketing.ClientUtil.PhoneCallFormValues));
                var scheduledEndIso = !ClientUtility.DataUtil.isNullOrUndefined(scheduledEnd) ? scheduledEnd.toISOString() : "";
                var encodedDescription = !ClientUtility.DataUtil.isNullOrUndefined(description) ? Xrm.Encoding.xmlEncode(description) : "";
                var encodedSubject = !ClientUtility.DataUtil.isNullOrUndefined(subject) ? Xrm.Encoding.xmlEncode(subject) : "";
                var formXml = "";
                if (formValues && formValues.length > 0) {
                    for (var i = 0; i < formValues.length; i++) {
                        var logicalName = formValues[i].logicalName;
                        var value = formValues[i].value;
                        if (!ClientUtility.DataUtil.isNullOrEmptyString(value)) {
                            if (typeof (value) === "object") {
                                if (value.length > 0) {
                                    var typeCode = Xrm.Internal.getEntityCode(value[0]._etn);
                                    formXml = formXml + ("<" + logicalName + " name=\"" + value[0]._name + "\" type=\"" + typeCode + "\">{" + value[0]._id + "}</" + logicalName + ">");
                                }
                            }
                            else {
                                formXml = formXml + ("<" + logicalName + ">" + value + "</" + logicalName + ">");
                            }
                        }
                    }
                }
                return "\n                <phonecall>\n                    <activitytypecode name=\"Phone Call\">" + Marketing.EntityTypeCodes.PhoneCall + "</activitytypecode>\n                    <actualdurationminutes>" + actualDurationMinutes + "</actualdurationminutes>\n                    <description>" + encodedDescription + "</description>\n                    <directioncode>true</directioncode>\n                    <isbilled name=\"False\">false</isbilled>\n                    <isregularactivity name=\"False\">false</isregularactivity>\n                    <isworkflowcreated name=\"False\">false</isworkflowcreated>\n                    <leftvoicemail name=\"False\">false</leftvoicemail>\n                    <prioritycode>" + priorityCode + "</prioritycode>\n                    <scheduledend>" + scheduledEndIso + "</scheduledend>\n                    <subject>" + encodedSubject + "</subject>\n                    <transactioncurrencyid name=\"" + transactionCurrency.name + "\" type=\"" + Marketing.EntityTypeCodes.TransactionCurrency + "\">" + transactionCurrency.id + "</transactioncurrencyid>\n                    " + formXml + "\n                </phonecall>";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NewPhoneCallsDialog.prototype, "Activity", {
            get: function () {
                return _a = {},
                    _a[Marketing.OData.TypeFieldName] = "" + Marketing.OData.TypeFieldValuePrefix + Marketing.EntityNames.PhoneCall,
                    _a[Marketing.ActivityEntityFieldNames.ActivityId] = ClientUtility.Guid.newGuid(),
                    _a[Marketing.ActivityEntityFieldNames.ActualDurationMinutes] = Marketing.Controls.getValue(NewPhoneCallsDialog.ActualDurationMinutesId),
                    _a[Marketing.ActivityEntityFieldNames.Description] = Marketing.Controls.getValue(NewPhoneCallsDialog.DescriptionId),
                    _a[Marketing.ActivityEntityFieldNames.DirectionCode] = Marketing.ActivityDirectionCode.Outgoing,
                    _a[Marketing.ActivityEntityFieldNames.IsRegularActivity] = false,
                    _a[Marketing.ActivityEntityFieldNames.PriorityCode] = Marketing.Controls.getValue(NewPhoneCallsDialog.PriorityCodeId),
                    _a[Marketing.ActivityEntityFieldNames.ScheduledEnd] = Marketing.Controls.getValue(NewPhoneCallsDialog.ScheduledEndId),
                    _a[Marketing.ActivityEntityFieldNames.Subject] = Marketing.Controls.getValue(NewPhoneCallsDialog.SubjectId),
                    _a;
                var _a;
            },
            enumerable: true,
            configurable: true
        });
        return NewPhoneCallsDialog;
    }(Marketing.NewActivityDialog));
    NewPhoneCallsDialog.Prefix = "phonecall";
    NewPhoneCallsDialog.ActualDurationMinutesId = NewPhoneCallsDialog.Prefix + "_actual_duration_minutes";
    NewPhoneCallsDialog.DescriptionId = NewPhoneCallsDialog.Prefix + "_description";
    NewPhoneCallsDialog.PriorityCodeId = NewPhoneCallsDialog.Prefix + "_priority_code";
    NewPhoneCallsDialog.ScheduledEndId = NewPhoneCallsDialog.Prefix + "_scheduled_end";
    NewPhoneCallsDialog.SubjectId = NewPhoneCallsDialog.Prefix + "_subject";
    Marketing.NewPhoneCallsDialog = NewPhoneCallsDialog;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="../ClientCommon/Marketing_ClientCommon.d.ts" />
/// <reference path="CampaignActivityActionNames.ts"/>
/// <reference path="DefaultControlValues.ts"/>
/// <reference path="DialogNameMap.ts"/>
/// <reference path="EntityNameMap.ts"/>
/// <reference path="NewActivityDialog.ts"/>
/// <reference path="NewAppointmentsDialog.ts"/>
/// <reference path="NewEmailsDialog.ts"/>
/// <reference path="NewFaxesDialog.ts"/>
/// <reference path="NewLettersDialog.ts"/>
/// <reference path="NewPhoneCallsDialog.ts"/>
var Marketing;
(function (Marketing) {
    /* tslint:disable:crm-force-fields-private */
    var ActivityCreation = (function () {
        function ActivityCreation() {
        }
        ActivityCreation.getActivityCreator = function (activityEntityTypeCode) {
            switch (activityEntityTypeCode) {
                case Marketing.EntityTypeCodes.Appointment: return ActivityCreation.NewAppointments;
                case Marketing.EntityTypeCodes.Email: return ActivityCreation.NewEmails;
                case Marketing.EntityTypeCodes.Fax: return ActivityCreation.NewFaxes;
                case Marketing.EntityTypeCodes.Letter: return ActivityCreation.NewLetters;
                case Marketing.EntityTypeCodes.PhoneCall: return ActivityCreation.NewPhoneCalls;
                default: throw Error("Unknown activity entity type code.");
            }
        };
        return ActivityCreation;
    }());
    ActivityCreation.NewAppointments = new Marketing.NewAppointmentsDialog();
    ActivityCreation.NewEmails = new Marketing.NewEmailsDialog();
    ActivityCreation.NewFaxes = new Marketing.NewFaxesDialog();
    ActivityCreation.NewLetters = new Marketing.NewLettersDialog();
    ActivityCreation.NewPhoneCalls = new Marketing.NewPhoneCallsDialog();
    Marketing.ActivityCreation = ActivityCreation;
})(Marketing || (Marketing = {}));
