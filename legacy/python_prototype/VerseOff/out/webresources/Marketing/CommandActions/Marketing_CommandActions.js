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
var Marketing;
(function (Marketing) {
    var CommandActionsConstants;
    (function (CommandActionsConstants) {
        var LocalizationKeys = (function () {
            function LocalizationKeys() {
            }
            return LocalizationKeys;
        }());
        LocalizationKeys.MiniCampaign = {
            CanNotRun: {
                On: {
                    Associated: "MiniCampaign_CanNotRun_On_Associated",
                    InactiveList: "MiniCampaign_CanNotRun_On_InactiveList"
                }
            },
            AllItems: {
                NoRecordReturned: "MiniCampaign_AllItems_NoRecordReturned"
            },
            SelectedItems: {
                TooManyRecords: "MiniCampaign_SelectedItems_TooManyRecords"
            },
            MenuItem: {
                Label: {
                    SelectedItems: "MenuItem_Label_MC_SelectedItems",
                    AllItemsOnPage: "MenuItem_Label_MC_AllItemsOnPage",
                    AllItemsOnAllPages: "MenuItem_Label_MC_AllItemsOnAllPages"
                }
            }
        };
        LocalizationKeys.List = {
            Action: {
                ListsLocked: "Lists_Action_ListsLocked"
            },
        };
        CommandActionsConstants.LocalizationKeys = LocalizationKeys;
    })(CommandActionsConstants = Marketing.CommandActionsConstants || (Marketing.CommandActionsConstants = {}));
})(Marketing || (Marketing = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../TypeDefinitions/AppCommon/ClientCommon/AppCommon_ClientCommon.d.ts" />
var Marketing;
(function (Marketing) {
    var LocalizationKeys = Marketing.CommandActionsConstants.LocalizationKeys;
    var MarketingCommandActions = (function () {
        function MarketingCommandActions() {
            var _this = this;
            this.bulkDelete = function (gridControl) {
                var wizardUrl = Mscrm.CrmUri.create("/WebWizard/WizardContainer.aspx?WizardId=A50E9478-8EC9-45ab-B927-FDFFF64A0729");
                if (!ClientUtility.DataUtil.isNullOrUndefined(gridControl)) {
                    var otc = gridControl.GetParameter("otc"), wizardInput = "";
                    if (!ClientUtility.DataUtil.isNullOrUndefined(otc)) {
                        wizardInput = otc;
                        var viewId = gridControl.GetParameter("viewid"), viewType = gridControl.GetParameter("viewtype");
                        if (!ClientUtility.DataUtil.isNullOrEmptyString(viewId) && !ClientUtility.DataUtil.isNullOrEmptyString((viewType))) {
                            wizardInput = wizardInput + "," + viewType + "," + viewId;
                        }
                        wizardUrl.get_query()["WizardInput"] = wizardInput;
                    }
                }
                var dialogOptions = new Xrm.DialogOptions;
                dialogOptions.width = 700;
                dialogOptions.height = 520;
                Xrm.Internal.openDialog(wizardUrl.toString(), dialogOptions, null, null, null);
            };
            this.sendBulkEmail = function (gridControl, recordIds, entityTypeCode, totalRecordCount) {
                if (recordIds.length > 0) {
                    var actionUri = Mscrm.GlobalImported.CrmUri.create("/_grid/cmds/dlg_bulkemail.aspx");
                    actionUri.get_query()["bulkemail"] = "true";
                    actionUri.get_query()["multiPage"] = "false";
                    actionUri.get_query()["objectTypeCode"] = entityTypeCode;
                    var dialogOptions = new Xrm.DialogOptions;
                    dialogOptions.width = 600;
                    dialogOptions.height = 620;
                    Xrm.Internal.openDialog(actionUri.toString(), dialogOptions, null, null, null);
                }
                else {
                    Xrm.Navigation.openAlertDialog({
                        text: Xrm.Internal.getResourceString("LOCID_EMAIL_NORECORDS_MSG")
                    });
                }
            };
            this.deactivateCampaigns = function (gridControl, records, entityTypeCode) { return __awaiter(_this, void 0, void 0, function () {
                var numInvalidRecords, validRecords, i, selectCampaignActivities, response, record, options, multipleCampaignDeactivateError, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 7, , 8]);
                            numInvalidRecords = 0;
                            validRecords = [];
                            Xrm.Utility.showProgressIndicator(Marketing.StringProvider.getResourceString(Marketing.MessageKeys.MsgProcessingDialog));
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < records.length)) return [3 /*break*/, 4];
                            selectCampaignActivities = "?$select=activityid&$top=1&$filter=_regardingobjectid_value eq " + ClientUtility.Guid.create(records[i]) + " and statecode eq 0 and statuscode ne 5 and statuscode ne 6";
                            return [4 /*yield*/, Xrm.WebApi.retrieveMultipleRecords(Marketing.EntityNames.CampaignActivity, selectCampaignActivities)];
                        case 2:
                            response = _a.sent();
                            if (response.entities.length > 0) {
                                numInvalidRecords++;
                            }
                            else {
                                record = {
                                    Id: records[i],
                                    TypeCode: Marketing.EntityTypeCodes.Campaign,
                                    TypeName: Marketing.EntityNames.Campaign
                                };
                                validRecords.push(record);
                            }
                            _a.label = 3;
                        case 3:
                            i++;
                            return [3 /*break*/, 1];
                        case 4:
                            Xrm.Utility.closeProgressIndicator();
                            if (!(numInvalidRecords > 0)) return [3 /*break*/, 6];
                            options = {
                                position: 1 /* center */,
                                width: Marketing.DialogSizes.DeactivateAlertDialogWidth,
                                height: Marketing.DialogSizes.DeactivateAlertDialogHeight
                            };
                            multipleCampaignDeactivateError = ClientUtility.StringUtil.format(Marketing.StringProvider.getResourceString("MA.Campaign.MultipleCampaignsDeactivateError"), numInvalidRecords.toString());
                            return [4 /*yield*/, Marketing.ClientUtil.openAlertDialog({ text: multipleCampaignDeactivateError }, options)];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6:
                            if (validRecords.length > 0) {
                                XrmCore.Commands.Deactivate.deactivateRecords(gridControl, validRecords, Marketing.EntityNames.Campaign);
                            }
                            return [3 /*break*/, 8];
                        case 7:
                            error_1 = _a.sent();
                            ClientUtility.ActionFailedHandler.actionFailedCallback(error_1);
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/];
                    }
                });
            }); };
            this.deactivateCampaign = function (entityId, gridControl, result, gridView) {
                if (gridView === void 0) { gridView = false; }
                return __awaiter(_this, void 0, void 0, function () {
                    var selectCampaignActivities, response, options, campaignDeactivateError, record, error_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                selectCampaignActivities = "?$select=activityid&$top=1&$filter=_regardingobjectid_value eq " + ClientUtility.Guid.create(entityId) + " and statecode eq 0 and statuscode ne 5 and statuscode ne 6";
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 8, , 9]);
                                return [4 /*yield*/, Xrm.WebApi.retrieveMultipleRecords(Marketing.EntityNames.CampaignActivity, selectCampaignActivities)];
                            case 2:
                                response = _a.sent();
                                if (!(response.entities.length > 0)) return [3 /*break*/, 6];
                                if (!result) return [3 /*break*/, 3];
                                result.hasError = true;
                                return [3 /*break*/, 5];
                            case 3:
                                options = {
                                    position: 1 /* center */,
                                    width: Marketing.DialogSizes.DeactivateAlertDialogWidth,
                                    height: Marketing.DialogSizes.DeactivateAlertDialogHeight
                                };
                                campaignDeactivateError = Marketing.StringProvider.getResourceString("MA.Campaign.DeactivateError");
                                return [4 /*yield*/, Marketing.ClientUtil.openAlertDialog({ text: campaignDeactivateError }, options)];
                            case 4:
                                _a.sent();
                                _a.label = 5;
                            case 5: return [3 /*break*/, 7];
                            case 6:
                                Xrm.SaveMode = 5 /* Deactivate */;
                                if (gridView) {
                                    record = {
                                        Id: entityId,
                                        TypeCode: Marketing.EntityTypeCodes.Campaign,
                                        TypeName: Marketing.EntityNames.Campaign
                                    };
                                    XrmCore.Commands.Deactivate.deactivateRecords(gridControl, [record], Marketing.EntityNames.Campaign);
                                }
                                else {
                                    XrmCore.Commands.ChangeState.changeState(Marketing.CampaignActivityActionNames.Deactivate, entityId, Marketing.EntityNames.Campaign);
                                }
                                _a.label = 7;
                            case 7: return [3 /*break*/, 9];
                            case 8:
                                error_2 = _a.sent();
                                ClientUtility.ActionFailedHandler.actionFailedCallback(error_2);
                                return [3 /*break*/, 9];
                            case 9: return [2 /*return*/];
                        }
                    });
                });
            };
            this.quickCampaignAllPages = function (gridControl, selectedRecordIds, entityTypeCode) {
                var totalRecordsCount = gridControl.getGrid().getTotalRecordCount();
                if (totalRecordsCount === 0) {
                    Marketing.ClientUtil.alert(LocalizationKeys.MiniCampaign.AllItems.NoRecordReturned);
                }
                else {
                    _this.runMiniCampaign(gridControl, selectedRecordIds, entityTypeCode, totalRecordsCount, Marketing.QuickCampaignSelectionMode.AllPages, entityTypeCode);
                }
            };
            this.quickCampaignCurrentPage = function (gridControl, selectedRecordIds, entityTypeCode) {
                var totalRecordsCount = gridControl.getGrid().getTotalRecordCount();
                if (totalRecordsCount === 0) {
                    Marketing.ClientUtil.alert(LocalizationKeys.MiniCampaign.AllItems.NoRecordReturned);
                }
                else {
                    _this.runMiniCampaign(gridControl, selectedRecordIds, entityTypeCode, totalRecordsCount, Marketing.QuickCampaignSelectionMode.CurrentPage, entityTypeCode);
                }
            };
            this.quickCampaignSelectedItems = function (gridControl, records, entityTypeCode, totalRecordCount) {
                if (ClientUtility.DataUtil.isNullOrUndefined(totalRecordCount)) {
                    totalRecordCount = gridControl.getGrid().getTotalRecordCount();
                }
                if (entityTypeCode !== Marketing.EntityTypeCodes.List) {
                    _this.runMiniCampaign(gridControl, records, entityTypeCode, totalRecordCount, Marketing.QuickCampaignSelectionMode.SelectedRecords, entityTypeCode);
                    return;
                }
                if (records.length === 0) {
                    return;
                }
                if (records.length > 1) {
                    Marketing.ClientUtil.alert(LocalizationKeys.MiniCampaign.SelectedItems.TooManyRecords);
                    return;
                }
                var getListEntityRequest = "?$select=" + Marketing.ListEntityFieldNames.StateCode + "," + Marketing.ListEntityFieldNames.MemberType;
                Xrm.WebApi.retrieveRecord(Marketing.EntityNames.List, records[0], getListEntityRequest)
                    .then(function (listEntity) {
                    if (ClientUtility.DataUtil.isNullOrUndefined(listEntity)) {
                        return;
                    }
                    var stateCodeValue = listEntity[Marketing.ListEntityFieldNames.StateCode];
                    if (stateCodeValue && stateCodeValue.toString() === "1") {
                        Marketing.ClientUtil.alert(LocalizationKeys.MiniCampaign.CanNotRun.On.InactiveList);
                    }
                    else {
                        var memberTypeValue = listEntity[Marketing.ListEntityFieldNames.MemberType];
                        if (memberTypeValue) {
                            var memberTypeOtc = parseInt(memberTypeValue, 10);
                            _this.runMiniCampaign(gridControl, records, entityTypeCode, totalRecordCount, Marketing.QuickCampaignSelectionMode.SelectedRecords, memberTypeOtc);
                        }
                    }
                }, ClientUtility.ActionFailedHandler.actionFailedCallback);
            };
            this.promoteToResponse = function (createFromType) { return __awaiter(_this, void 0, void 0, function () {
                var error_3, parameters, regardingAttributeValue, _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, Xrm.Page.data.save()];
                        case 1:
                            _d.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _d.sent();
                            return [2 /*return*/, ClientUtility.ActionFailedHandler.actionFailedCallback(error_3)];
                        case 3:
                            parameters = {};
                            parameters[MarketingCommandActions.CreateFromId] = Xrm.Page.data.entity.getId();
                            parameters[MarketingCommandActions.CreateFromType] = createFromType;
                            if (!ClientUtility.ClientUtil.isUCI()) return [3 /*break*/, 8];
                            parameters[Marketing.CampaignResponseConstants.action] = Marketing.CampaignResponseAction.Promote;
                            parameters[Marketing.CampaignResponseConstants.customer] = this.getCustomer(createFromType);
                            parameters[Marketing.CampaignResponseConstants.prioritycode] = ClientUtility.PageUtil.getAttributeValue(Marketing.ActivityEntityFieldNames.PriorityCode);
                            parameters[Marketing.CampaignResponseConstants.subject] = ClientUtility.PageUtil.getAttributeValue(Marketing.ActivityEntityFieldNames.Subject);
                            parameters[Marketing.CampaignResponseConstants.originatingActivityId] = [{
                                    id: Xrm.Page.data.entity.getId(),
                                    entityType: Xrm.Page.data.entity.getEntityName(),
                                    name: Xrm.Page.data.entity.getPrimaryAttributeValue()
                                }];
                            regardingAttributeValue = ClientUtility.PageUtil.getAttributeValue(Marketing.ActivityEntityFieldNames.RegardingObjectid);
                            _a = parameters;
                            _b = Marketing.CampaignResponseConstants.regardingobjectid;
                            if (!(regardingAttributeValue[0].entityType === Marketing.EntityNames.BulkOperation)) return [3 /*break*/, 4];
                            _c = regardingAttributeValue;
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, this.getRegardingCampaignFromActivity(regardingAttributeValue)];
                        case 5:
                            _c = _d.sent();
                            _d.label = 6;
                        case 6:
                            _a[_b] = _c;
                            return [4 /*yield*/, Xrm.Navigation.openForm({ entityName: Marketing.EntityNames.CampaignResponse, useQuickCreateForm: false }, parameters)];
                        case 7:
                            _d.sent();
                            return [3 /*break*/, 9];
                        case 8:
                            Xrm.Utility.openEntityForm(Marketing.EntityNames.CampaignResponse, "", parameters);
                            _d.label = 9;
                        case 9: return [2 /*return*/];
                    }
                });
            }); };
            this.convertActivity = function (activityId, activityEntityName, targetEntity, targetEntityName, createCampaignResponse) {
                var request = new ODataContract.ConvertActivityRequest(activityId, activityEntityName, targetEntity, targetEntityName, createCampaignResponse);
                request.ActivityId = activityId;
                request.ActivityEntityName = activityEntityName;
                request.TargetEntity = targetEntity;
                request.TargetEntityName = targetEntityName;
                request.CreateCampaignResponse = createCampaignResponse;
                Xrm.WebApi.execute(request).then(function () { Xrm.Page.data.refresh(true); });
            };
            this.addCurrentItemToList = function (entityTypeCode) {
                var recordId = Xrm.Page.data.entity.getId();
                var records = [{ Id: recordId }];
                _this.addToListInternal(records, entityTypeCode);
            };
            this.addToList = function (gridControl, records, entityTypeCode) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (typeof (entityTypeCode) === 'string') {
                                entityTypeCode = Number.parseInt(entityTypeCode);
                            }
                            if (!records.length) {
                                this.reportFailure("addMembersUsingLookup", [
                                    { name: "reason", value: "No entity is selected" },
                                ]);
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.addToListInternal(records, entityTypeCode)];
                        case 1:
                            _a.sent();
                            gridControl.refresh();
                            return [2 /*return*/];
                    }
                });
            }); };
            this.isNotTemplate = function () {
                return (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data.getEntity().attributes.get('istemplate'))) ? !Xrm.Page.data.getEntity().attributes.get('istemplate').getValue() : true;
            };
            this.addToListInternal = function (records, entityTypeCode) { return __awaiter(_this, void 0, void 0, function () {
                var entityTypeName, lookupOptions, values, members, listIds, _i, values_1, value;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            entityTypeName = Marketing.ClientUtil.getEntityName(entityTypeCode);
                            lookupOptions = this.getListLookupOptions(entityTypeCode);
                            return [4 /*yield*/, Xrm.Utility.lookupObjects(lookupOptions)];
                        case 1:
                            values = _a.sent();
                            members = records.map(function (record) {
                                return {
                                    id: record.Id,
                                    entityType: entityTypeName
                                };
                            });
                            listIds = [];
                            for (_i = 0, values_1 = values; _i < values_1.length; _i++) {
                                value = values_1[_i];
                                listIds.push(value.id);
                            }
                            return [4 /*yield*/, Marketing.MemberOperations.addListMembers(listIds, members, entityTypeName)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); };
            this.setListPropertiesAndMakeCall = function (lookupItems, actionUri, gridControl, records, entityTypeCode) {
                if (ClientUtility.DataUtil.isNullOrUndefined(lookupItems) || lookupItems.items.length === 0) {
                    return;
                }
                _this.performListAddition(lookupItems.items[0].id, lookupItems.items[0].type, actionUri, gridControl, records, entityTypeCode);
            };
            this.performGridRefresh = function (result, entityTypeCode) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(entityTypeCode)) {
                    if (isOutlookHostedWindow()) {
                        if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data)) {
                            Xrm.Page.data.refresh(true);
                        }
                    }
                    else {
                        Xrm.Internal.refreshParentGrid(entityTypeCode, "", "");
                    }
                }
            };
            this.canPromoteActivityToResponse = function () {
                return MarketingCommandActions.CheckPromoteOption();
            };
        }
        MarketingCommandActions.prototype.runMiniCampaign = function (gridControl, entitiesIds, entityTypeCode, totalRecordCount, selectionMode, createdFromOtc) {
            if (ClientUtility.ClientUtil.isUCI()) {
                this.runMiniCampaignForUCI(gridControl, entitiesIds, entityTypeCode, createdFromOtc, selectionMode);
            }
            else {
                this.runMiniCampaignForWebClient(gridControl, entitiesIds, entityTypeCode, totalRecordCount, selectionMode, createdFromOtc);
            }
        };
        MarketingCommandActions.prototype.runMiniCampaignForUCI = function (gridControl, entitiesIds, entityTypeCode, memberTypeCode, selectionMode) {
            return __awaiter(this, void 0, void 0, function () {
                var transactionCurrency;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Marketing.TransactionCurrency.getTransactionCurrency("transactioncurrencyid")];
                        case 1:
                            transactionCurrency = _a.sent();
                            return [4 /*yield*/, Marketing.BulkOperation.CreateWizard.open(entitiesIds, entityTypeCode, memberTypeCode, selectionMode, gridControl.getFetchXml(), transactionCurrency)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        MarketingCommandActions.prototype.runMiniCampaignForWebClient = function (gridControl, selectedRecords, entityTypeCode, totalRecordCount, selectionMode, createdFromOtc) {
            var dialogParameters = {};
            dialogParameters[MarketingCommandActions.TotalRecordsDialogParamName] = totalRecordCount;
            dialogParameters[MarketingCommandActions.SelectedRecordsDialogParamName] = selectedRecords.length;
            dialogParameters[MarketingCommandActions.ObjectTypeCodeDialogParamName] = entityTypeCode;
            dialogParameters[MarketingCommandActions.MCOptionDialogParamName] = selectionMode;
            dialogParameters[MarketingCommandActions.CreatedFromOtcDialogParamName] = createdFromOtc;
            switch (selectionMode) {
                case Marketing.QuickCampaignSelectionMode.SelectedRecords:
                    dialogParameters[MarketingCommandActions.MCOptionTitleDialogParamName] = Marketing.StringProvider.getResourceString(LocalizationKeys.MiniCampaign.MenuItem.Label.SelectedItems);
                    dialogParameters[MarketingCommandActions.IdsDialogParamName] = selectedRecords;
                    dialogParameters[MarketingCommandActions.GridXmlDialogParamName] = "";
                    break;
                case Marketing.QuickCampaignSelectionMode.CurrentPage:
                    dialogParameters[MarketingCommandActions.MCOptionTitleDialogParamName] = Marketing.StringProvider.getResourceString(LocalizationKeys.MiniCampaign.MenuItem.Label.AllItemsOnPage);
                    dialogParameters[MarketingCommandActions.IdsDialogParamName] = selectedRecords;
                    dialogParameters[MarketingCommandActions.GridXmlDialogParamName] = "";
                    break;
                case Marketing.QuickCampaignSelectionMode.AllPages:
                    dialogParameters[MarketingCommandActions.MCOptionTitleDialogParamName] = Marketing.StringProvider.getResourceString(LocalizationKeys.MiniCampaign.MenuItem.Label.AllItemsOnAllPages);
                    dialogParameters[MarketingCommandActions.IdsDialogParamName] = "";
                    dialogParameters[MarketingCommandActions.GridXmlDialogParamName] = gridControl.getFetchXml();
                    break;
                default:
                    Xrm.Internal.reportToWatson("Invalid option value passed to RunMiniCampaign().", window.location.href, 0, true, null, 0, false);
                    break;
            }
            var actionUri = "/MA/MiniCampaign/MiniCampaign.aspx";
            var dialogOptions = new Xrm.DialogOptions();
            dialogOptions.height = Marketing.DialogSizes.RunMiniCampaignHeight;
            dialogOptions.width = Marketing.DialogSizes.RunMiniCampaignWidth;
            Xrm.Internal.openDialog(actionUri.toString(), dialogOptions, dialogParameters, null, null);
        };
        MarketingCommandActions.prototype.getCustomer = function (createFromType) {
            switch (createFromType) {
                case Marketing.EntityTypeCodes.Appointment:
                    return ClientUtility.PageUtil.getAttributeValue(Marketing.AppointmentEntityFieldNames.RequiredAttendees);
                case Marketing.EntityTypeCodes.Email:
                case Marketing.EntityTypeCodes.Fax:
                case Marketing.EntityTypeCodes.Letter:
                case Marketing.EntityTypeCodes.PhoneCall:
                    var directionCode = ClientUtility.PageUtil.getAttributeValue(MarketingCommandActions.DirectionCodePageAttribute);
                    var directionIncoming = ClientUtility.DataUtil.isNullOrUndefined(directionCode) ? false : !directionCode;
                    var customer = [];
                    if (directionIncoming) {
                        customer = ClientUtility.PageUtil.getAttributeValue(Marketing.ActivityEntityFieldNames.From);
                    }
                    else {
                        customer = ClientUtility.PageUtil.getAttributeValue(Marketing.ActivityEntityFieldNames.To);
                    }
                    return customer;
                default:
                    this.reportFailure("getCustomer", [{ name: "reason", value: "Unsupported customer type" }]);
                    return null;
            }
        };
        MarketingCommandActions.prototype.getRegardingCampaignFromActivity = function (regardingAttributeValues) {
            return __awaiter(this, void 0, void 0, function () {
                var regardingAttributeValue, regardingPropertyName, requestOptions, campaignActivityEntity, logicalNamePropertyName, displayNamePropertyName, campaignId, campaignLogicalName, campaignDisplayName;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!regardingAttributeValues || regardingAttributeValues.length === 0) {
                                return [2 /*return*/, []];
                            }
                            regardingAttributeValue = regardingAttributeValues[0];
                            if (!Xrm.Utility.isActivityType(regardingAttributeValue.entityType)) return [3 /*break*/, 2];
                            regardingPropertyName = "_regardingobjectid_value";
                            requestOptions = ClientUtility.ODataUtil.getSelectOption([regardingPropertyName]);
                            return [4 /*yield*/, Xrm.WebApi.online.retrieveRecord(regardingAttributeValue.entityType, regardingAttributeValue.id, requestOptions)];
                        case 1:
                            campaignActivityEntity = _a.sent();
                            if (!campaignActivityEntity) {
                                this.reportFailure("getRegardingCampaignFromActivity", [{ name: "reason", value: "Regarding campaign not found" }]);
                                return [2 /*return*/, null];
                            }
                            logicalNamePropertyName = regardingPropertyName + Marketing.OData.LogicalNameSuffix;
                            displayNamePropertyName = regardingPropertyName + Marketing.OData.DisplayNameSuffix;
                            campaignId = campaignActivityEntity[regardingPropertyName];
                            campaignLogicalName = campaignActivityEntity[logicalNamePropertyName];
                            campaignDisplayName = campaignActivityEntity[displayNamePropertyName];
                            if (!campaignId || !campaignLogicalName) {
                                this.reportFailure("getRegardingCampaignFromActivity", [
                                    { name: "reason", value: "Regarding campaign has missing attributes" },
                                    { name: "campaignId", value: campaignId },
                                    { name: "campaignLogicalName", value: campaignLogicalName }
                                ]);
                                return [2 /*return*/, null];
                            }
                            regardingAttributeValue = {
                                id: campaignId,
                                entityType: campaignLogicalName,
                                name: campaignDisplayName
                            };
                            _a.label = 2;
                        case 2: return [2 /*return*/, [regardingAttributeValue]];
                    }
                });
            });
        };
        MarketingCommandActions.prototype.getListLookupOptions = function (entityTypeCode) {
            var lookupTypes = [Marketing.EntityNames.List];
            return {
                allowMultiSelect: true,
                entityTypes: lookupTypes,
                disableMru: true,
                defaultEntityType: Marketing.EntityNames.List,
                showNew: true,
                filters: [
                    {
                        filterXml: "<filter type='and'>" +
                            ("<condition attribute='membertype' operator='eq' value='" + entityTypeCode + "' />") +
                            "<condition attribute='type' operator='eq' value='false' />" +
                            "<condition attribute='lockstatus' operator='eq' value='false' />" +
                            "</filter>"
                    }
                ],
                additionalParams: (_a = {},
                    _a[Marketing.ListLookupParameters.ListType] = "static",
                    _a[Marketing.ListLookupParameters.MemberTypeCode] = entityTypeCode,
                    _a)
            };
            var _a;
        };
        MarketingCommandActions.prototype.getListLookupOptionsForMultipleEntities = function (entityTypeCodes) {
            if (ClientUtility.ClientUtils.isUCI()) {
                return this.getListLookupOptionsForMultipleEntitiesUCI(entityTypeCodes);
            }
            else {
                return this.getListLookupOptionsForMultipleEntitiesLegacy(entityTypeCodes);
            }
        };
        MarketingCommandActions.prototype.getListLookupOptionsForMultipleEntitiesLegacy = function (entityTypeCodes) {
            return {
                allowMultiSelect: true,
                entityTypes: [Marketing.EntityNames.List],
                defaultEntityType: Marketing.EntityNames.List,
                disableMru: true,
                showNew: true,
                customFilters: [encodeURIComponent("<filter type=\"and\">" + MarketingCommandActions.getMemberTypeCondition(new Set(entityTypeCodes)) + "<condition attribute=\"lockstatus\" operator=\"eq\" value=\"false\" /></filter>")],
                customFilterTypes: [Marketing.EntityNames.List],
                additionalParams: (_a = {},
                    _a[Marketing.ListLookupParameters.ListType] = "static",
                    _a)
            };
            var _a;
        };
        MarketingCommandActions.prototype.getListLookupOptionsForMultipleEntitiesUCI = function (entityTypeCodes) {
            return {
                allowMultiSelect: true,
                lookupStyle: "multi",
                entityTypes: [Marketing.EntityNames.List],
                disableMru: true,
                defaultEntityType: Marketing.EntityNames.List,
                showNew: true,
                filters: [
                    {
                        filterXml: "<filter type='and'>" +
                            MarketingCommandActions.getMemberTypeCondition(new Set(entityTypeCodes)) +
                            "<condition attribute='type' operator='eq' value='false' />" +
                            "<condition attribute='lockstatus' operator='eq' value='false' />" +
                            "</filter>"
                    }
                ],
                additionalParams: (_a = {},
                    _a[Marketing.ListLookupParameters.ListType] = "static",
                    _a)
            };
            var _a;
        };
        MarketingCommandActions.getMemberTypeCondition = function (entityTypeCode) {
            if (entityTypeCode.size == 1) {
                var obj = entityTypeCode.values().next();
                return "<condition attribute='createdfromcode' operator='eq' value='" + obj.value + "' />";
            }
            else {
                var res = "<condition attribute='createdfromcode' operator='in'>";
                entityTypeCode.forEach(function (code) {
                    res += "<value>" + code + "</value>";
                });
                res += "</condition>";
                return res;
            }
        };
        MarketingCommandActions.prototype.performListAddition = function (itemObjectId, itemObjectTypeCode, actionUri, gridControl, records, entityTypeCode) {
            actionUri.get_query()["iObjType"] = entityTypeCode;
            actionUri.get_query()["iTotal"] = records.length;
            actionUri.get_query()["itemObjectId"] = itemObjectId;
            actionUri.get_query()["itemObjectTypeCode"] = itemObjectTypeCode;
            var dlgOptions = new Xrm.DialogOptions;
            dlgOptions.height = 200;
            dlgOptions.width = 400;
            var callbackFunction = Marketing.ClientUtil.createWithParameters(this, this.performGridRefresh, [entityTypeCode]);
            Xrm.Internal.openDialog(actionUri.toString(), dlgOptions, records, null, callbackFunction);
        };
        MarketingCommandActions.prototype.showButtonForListEntityOnly = function (selectedEntityTypeName, primaryEntityTypeName) {
            if (primaryEntityTypeName === "list") {
                var targetEntityCode = Xrm.Page.data.entity.attributes.get("membertype").getValue();
                var targetEntityName = Marketing.ClientUtil.getEntityName(targetEntityCode);
                return selectedEntityTypeName === targetEntityName;
            }
            else {
                return false;
            }
        };
        MarketingCommandActions.prototype.showButtonForListEntityOnlyWebClient = function (selectedEntityTypeName, primaryEntityTypeName, gridControl) {
            //if selectedEntityTypeName is null then it's for the landing page members section --> show the button
            if (primaryEntityTypeName === "list" && selectedEntityTypeName !== null) {
                var relationshipName = gridControl.getRelationshipName();
                var targetEntityCode = Xrm.Page.data.entity.attributes.get("membertype").getValue();
                var targetEntityName = Marketing.ClientUtil.getEntityName(targetEntityCode);
                switch (relationshipName) {
                    case Marketing.EntityRelationshipNames.ListLead: return targetEntityName == Marketing.EntityNames.Lead;
                    case Marketing.EntityRelationshipNames.ListContact: return targetEntityName == Marketing.EntityNames.Contact;
                    case Marketing.EntityRelationshipNames.ListAccount: return targetEntityName == Marketing.EntityNames.Account;
                    default: return true;
                }
            }
            else {
                return true;
            }
        };
        MarketingCommandActions.CheckPromoteOption = function () {
            if (!MarketingCommandActions.isPromoteToResponseEnabled()) {
                return false;
            }
            var directionCode = ClientUtility.PageUtil.getAttributeValue(MarketingCommandActions.DirectionCodePageAttribute);
            var directionIncoming = ClientUtility.DataUtil.isNullOrUndefined(directionCode) ? false : !directionCode;
            var fromParties = ClientUtility.PageUtil.getAttributeValue(MarketingCommandActions.FromPageAttribute);
            var regardingObjectId = ClientUtility.PageUtil.getAttributeValue(MarketingCommandActions.RegardingObjectIdPageAttribute);
            var requiredAttendees = ClientUtility.PageUtil.getAttributeValue(MarketingCommandActions.RequiredAttendeesPageAttribute);
            var toParties = ClientUtility.PageUtil.getAttributeValue(MarketingCommandActions.ToPageAttribute);
            var parties = null;
            if (directionIncoming) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(fromParties)) {
                    parties = fromParties;
                }
            }
            else if (!ClientUtility.DataUtil.isNullOrUndefined(toParties)) {
                parties = toParties;
            }
            var entityName = Xrm.Page.data.entity.getEntityName();
            if (entityName === Marketing.EntityNames.Appointment && !ClientUtility.DataUtil.isNullOrUndefined(requiredAttendees)) {
                parties = requiredAttendees;
            }
            var promoteConditionParty = MarketingCommandActions.getPromoteConditionParty(parties);
            var promoteRegardingStatus = MarketingCommandActions.getPromoteRegardingCondition(regardingObjectId);
            return promoteConditionParty && promoteRegardingStatus;
        };
        ;
        MarketingCommandActions.isPromoteToResponseEnabled = function () {
            var entityName = Xrm.Page.data.entity.getEntityName();
            return entityName === Marketing.EntityNames.Appointment ||
                entityName === Marketing.EntityNames.RecurringAppointmentMaster ||
                entityName === Marketing.EntityNames.PhoneCall ||
                entityName === Marketing.EntityNames.Letter ||
                entityName === Marketing.EntityNames.Fax ||
                entityName === Marketing.EntityNames.Email;
        };
        ;
        MarketingCommandActions.getPromoteConditionParty = function (parties) {
            var promoteConditionParty = false;
            if (!ClientUtility.DataUtil.isNullOrUndefined(parties) && parties.length === 1) {
                var party = parties[0];
                if (!ClientUtility.DataUtil.isNullOrUndefined(party)) {
                    promoteConditionParty =
                        party.entityType === Marketing.EntityNames.Account ||
                            party.entityType === Marketing.EntityNames.Contact ||
                            party.entityType === Marketing.EntityNames.Lead;
                }
            }
            return promoteConditionParty;
        };
        ;
        MarketingCommandActions.getPromoteRegardingCondition = function (regarding) {
            if (!ClientUtility.DataUtil.isNullOrUndefined(regarding) && regarding.length === 1) {
                var regardingParty = regarding[0];
                if (!ClientUtility.DataUtil.isNullOrUndefined(regardingParty)) {
                    return regardingParty.entityType === Marketing.EntityNames.Campaign ||
                        regardingParty.entityType === Marketing.EntityNames.CampaignActivity ||
                        regardingParty.entityType === Marketing.EntityNames.BulkOperation;
                }
            }
            return false;
        };
        ;
        MarketingCommandActions.prototype.reportFailure = function (methodName, parameters) {
            Xrm.Reporting.reportFailure("marketing", new Error("EnterpriseMarketing-Marketing.ListCommandAction." + methodName), "", parameters);
        };
        ;
        return MarketingCommandActions;
    }());
    MarketingCommandActions.DirectionCodePageAttribute = "directioncode";
    MarketingCommandActions.FromPageAttribute = "from";
    MarketingCommandActions.RegardingObjectIdPageAttribute = "regardingobjectid";
    MarketingCommandActions.RequiredAttendeesPageAttribute = "requiredattendees";
    MarketingCommandActions.ToPageAttribute = "to";
    MarketingCommandActions.TotalRecordsDialogParamName = "TotalRecords";
    MarketingCommandActions.SelectedRecordsDialogParamName = "SelectedRecords";
    MarketingCommandActions.ObjectTypeCodeDialogParamName = "ObjectTypeCode";
    MarketingCommandActions.MCOptionDialogParamName = "MCOption";
    MarketingCommandActions.CreatedFromOtcDialogParamName = "CreatedFromOtc";
    MarketingCommandActions.MCOptionTitleDialogParamName = "MCOptionTitle";
    MarketingCommandActions.IdsDialogParamName = "Ids";
    MarketingCommandActions.GridXmlDialogParamName = "GridXml";
    MarketingCommandActions.CreateFromType = "_CreateFromType";
    MarketingCommandActions.CreateFromId = "_CreateFromId";
    Marketing.MarketingCommandActions = MarketingCommandActions;
})(Marketing || (Marketing = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../ClientCommon/Marketing_ClientCommon.d.ts" />
/// <reference path="../BulkOperation/BulkOperation_main_system_library.d.ts" />
/// <reference path="Constants/LocalizationKeys.ts" />
/// <reference path="MarketingCommandActions.ts" />
var Marketing;
(function (Marketing) {
    var CommandActions = (function () {
        function CommandActions() {
        }
        return CommandActions;
    }());
    CommandActions.Instance = new Marketing.MarketingCommandActions();
    Marketing.CommandActions = CommandActions;
})(Marketing || (Marketing = {}));
