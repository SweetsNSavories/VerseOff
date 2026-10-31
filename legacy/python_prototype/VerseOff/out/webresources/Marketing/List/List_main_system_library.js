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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
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
    var ListExportCommand = (function () {
        function ListExportCommand(xrm, xrmCore) {
            this.xrm = xrm;
            this.xrmCore = xrmCore;
        }
        ListExportCommand.prototype.exportAllMembersStaticXlsx = function (fetchXml, targetRecordTypeCode) {
            return __awaiter(this, void 0, void 0, function () {
                var control, view, viewXml, mergedXml;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!fetchXml) {
                                return [2 /*return*/];
                            }
                            control = this.getGridControl(targetRecordTypeCode);
                            view = control.getViewSelector().getCurrentView();
                            if (!control || !view) {
                                this.reportFailure("exportAllMembersStaticXlsx", [
                                    { name: "error", value: "Could not determine View ID for marketing list target entity" },
                                    { name: "targetRecordCode", value: targetRecordTypeCode }
                                ]);
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.xrm.WebApi.retrieveRecord(Marketing.EntityNames.SavedQuery, view.id, "?$select=fetchxml")];
                        case 1:
                            viewXml = _a.sent();
                            mergedXml = this.mergeXmls(fetchXml, viewXml["fetchxml"]);
                            this.xrmCore.Commands.Export.exportToStandardExcel(view, mergedXml, Marketing.ClientUtil.getEntityName(targetRecordTypeCode), 5, null, control);
                            return [2 /*return*/];
                    }
                });
            });
        };
        ListExportCommand.prototype.mergeXmls = function (fetchXml, viewXml) {
            var xmlDoc = new DOMParser().parseFromString(fetchXml, "text/xml");
            this.removeItemsFromXml(xmlDoc, "attribute");
            this.removeItemsFromXml(xmlDoc, "order");
            var entity = xmlDoc.querySelector("fetch entity");
            this.uniqueAliasForLinkEntity(entity);
            var viewDoc = new DOMParser().parseFromString(viewXml, "text/xml");
            var elements = Marketing.ClientUtil.children(viewDoc.querySelector("fetch entity"));
            for (var it = elements.length - 1; it >= 0; --it) {
                var element = elements[it];
                entity.appendChild(element);
            }
            this.mergeLinkEntities(entity);
            return new XMLSerializer().serializeToString(xmlDoc);
        };
        ListExportCommand.prototype.mergeLinkEntities = function (parent) {
            var collection = parent.querySelectorAll("link-entity");
            var elements = [];
            for (var it = 0; it < collection.length; ++it) {
                var current = collection[it];
                if (current.parentElement === parent) {
                    elements.unshift(collection[it]);
                }
            }
            while (elements.length) {
                var current = elements.pop();
                var alias = current.getAttribute("alias");
                var name_1 = current.getAttribute("name");
                var fromAttribute = current.getAttribute("from");
                var to = current.getAttribute("to");
                var linkType = current.getAttribute("link-type");
                for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                    var element = elements_1[_i];
                    if (name_1 === element.getAttribute("name")
                        && fromAttribute === element.getAttribute("from")
                        && to === element.getAttribute("to")
                        && linkType === element.getAttribute("link-type")) {
                        var children = Marketing.ClientUtil.children(current);
                        for (var it = children.length - 1; it >= 0; --it) {
                            var child = children[it];
                            element.appendChild(child);
                        }
                        current.parentNode.removeChild(current);
                        var conditions = parent.querySelectorAll("condition");
                        var newAlias = element.getAttribute("alias");
                        for (var it = conditions.length - 1; it >= 0; --it) {
                            var condition = conditions[it];
                            if (alias === condition.getAttribute("entityname")) {
                                var conditionParent = condition.parentNode;
                                conditionParent.removeChild(condition);
                                condition.setAttribute("entityname", newAlias);
                                conditionParent.appendChild(condition);
                            }
                        }
                        this.mergeLinkEntities(element);
                        break;
                    }
                }
            }
        };
        ListExportCommand.prototype.uniqueAliasForLinkEntity = function (parent) {
            var collection = parent.querySelectorAll("link-entity");
            var elements = Array.from(collection);
            while (elements.length) {
                var current = elements.pop();
                var conditions = parent.querySelectorAll("condition");
                var newAlias = "a_" + ClientUtility.Guid.newGuid().replace(/\-/g, '');
                var alias = current.getAttribute("alias");
                if (alias) {
                    for (var it = conditions.length - 1; it >= 0; --it) {
                        var condition = conditions[it];
                        if (alias === condition.getAttribute("entityname")) {
                            var conditionParent = condition.parentNode;
                            conditionParent.removeChild(condition);
                            condition.setAttribute("entityname", newAlias);
                            conditionParent.appendChild(condition);
                        }
                    }
                }
                // In nested Link entities the parent wont be same as root parent so find the parent first and update.
                if (parent !== current.parentNode) {
                    var currentParentNode = current.parentNode;
                    currentParentNode.removeChild(current);
                    current.setAttribute("alias", newAlias);
                    currentParentNode.appendChild(current);
                    while (currentParentNode.parentNode !== parent) {
                        currentParentNode = currentParentNode.parentNode;
                    }
                    ;
                    parent.removeChild(currentParentNode);
                    parent.appendChild(currentParentNode);
                }
                else {
                    parent.removeChild(current);
                    current.setAttribute("alias", newAlias);
                    parent.appendChild(current);
                }
            }
        };
        ListExportCommand.prototype.removeItemsFromXml = function (xml, itemsName) {
            var items = xml.getElementsByTagName(itemsName);
            for (var it = items.length - 1; it >= 0; --it) {
                var item = items[it];
                item.parentNode.removeChild(item);
            }
        };
        ListExportCommand.prototype.getGridControl = function (targetRecordTypeCode) {
            var accountsGrid = Marketing.ListUtilities.getListPageMemberGridByCode(Marketing.EntityTypeCodes.Account, false);
            var contactsGrid = Marketing.ListUtilities.getListPageMemberGridByCode(Marketing.EntityTypeCodes.Contact, false);
            var leadsGrid = Marketing.ListUtilities.getListPageMemberGridByCode(Marketing.EntityTypeCodes.Lead, false);
            var accountsGridUCI = Marketing.ListUtilities.getListPageMemberGridByCode(Marketing.EntityTypeCodes.Account, true);
            var contactsGridUCI = Marketing.ListUtilities.getListPageMemberGridByCode(Marketing.EntityTypeCodes.Contact, true);
            var leadsGridUCI = Marketing.ListUtilities.getListPageMemberGridByCode(Marketing.EntityTypeCodes.Lead, true);
            var dynamicAccountControls = Xrm.Page.getControl(Marketing.ListEntityControlNames.dynamicAccountsUci);
            var dynamicContactControls = Xrm.Page.getControl(Marketing.ListEntityControlNames.dynamicContactsUci);
            var dynamicLeadControls = Xrm.Page.getControl(Marketing.ListEntityControlNames.dynamicLeadsUci);
            var targetedRecordType = Marketing.ListUtilities.getListTargetType();
            var isUCI = ClientUtility.ClientUtil.isUCI();
            var isDynamic = !Marketing.List.Commands.isListStatic();
            var control;
            switch (targetedRecordType) {
                case Marketing.EntityTypeCodes.Account:
                    control = isUCI ?
                        isDynamic ? dynamicAccountControls || accountsGridUCI : accountsGridUCI
                        : accountsGrid;
                    break;
                case Marketing.EntityTypeCodes.Contact:
                    control = isUCI ?
                        isDynamic ? dynamicContactControls || contactsGridUCI : contactsGridUCI
                        : contactsGrid;
                    break;
                case Marketing.EntityTypeCodes.Lead:
                    control = isUCI ?
                        isDynamic ? dynamicLeadControls || leadsGridUCI : leadsGridUCI
                        : leadsGrid;
                    break;
            }
            return control;
        };
        ListExportCommand.prototype.reportFailure = function (methodName, parameters) {
            Xrm.Reporting.reportFailure("marketing", new Error("EnterpriseMarketing-Marketing.ListExportStrategy." + methodName), "", parameters);
        };
        return ListExportCommand;
    }());
    Marketing.ListExportCommand = ListExportCommand;
})(Marketing || (Marketing = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Marketing;
(function (Marketing) {
    var ListUtilities = (function () {
        function ListUtilities() {
        }
        ListUtilities.getListPageMemberGridByCode = function (entityTypeCode, isUci) {
            if (isUci === void 0) { isUci = ClientUtility.ClientUtil.isUCI(); }
            var fieldName = "";
            switch (entityTypeCode) {
                case Marketing.EntityTypeCodes.Account:
                    fieldName = "accounts";
                    break;
                case Marketing.EntityTypeCodes.Contact:
                    fieldName = "contacts";
                    break;
                case Marketing.EntityTypeCodes.Lead:
                    fieldName = "leads";
                    break;
                default:
                    return null;
            }
            if (isUci) {
                fieldName += "UCI";
            }
            return Xrm.Page.getControl(fieldName);
        };
        ListUtilities.getListTargetType = function () {
            var memberTypeAttribute = Xrm.Page.getAttribute("createdfromcode");
            return memberTypeAttribute && !ClientUtility.DataUtil.isNullOrUndefined(memberTypeAttribute.getValue()) ?
                memberTypeAttribute.getValue() :
                Marketing.EntityTypeCodes.None;
        };
        return ListUtilities;
    }());
    Marketing.ListUtilities = ListUtilities;
})(Marketing || (Marketing = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Marketing;
(function (Marketing) {
    var selectedOption = 1;
    var allInQuery = 2;
    var errorNone = 1;
    var errorContinue = 2;
    var ListActions = (function () {
        function ListActions() {
            var _this = this;
            this.fetchXml = null;
            this.responseXml = null;
            this.listActionUrl = "";
            this.custParams = "";
            this.errorNumber = "";
            this.selectedMemberIds = [];
            this.errorCode = 0;
            this.errorCount = 0;
            this.returnValue = false;
            // listId parameter is used for backwards compatibility
            this.openManageMembersWizard = function (listMemberType, gridId, listId, width, height) {
                var marketingListId = Xrm.Page.data.entity.getId().toString();
                var parameters = [];
                var parameters = [];
                parameters[0] = listMemberType;
                parameters[1] = gridId;
                parameters[2] = marketingListId;
                var url = Mscrm.GlobalImported.CrmUri.create("/MA/Lists/ListQualificationDlg/dlg_manage_members.aspx");
                var dlgOptions = _this.getDialogOptions(width, height);
                var callbackFunction = Marketing.ClientUtil.createWithParameters(_this, _this.openManageMembersWizardCallback, parameters);
                Xrm.Internal.openDialog(url.toString(), dlgOptions, "Search", null, callbackFunction);
            };
            this.openManageMembersWizardCallback = function (result, listMemberType) {
                if (ClientUtility.DataUtil.isNullOrUndefined(result)) {
                    return;
                }
                switch (result.toString()) {
                    case "0":
                        break;
                    case "1":
                        Marketing.List.CommandActions.addMembersUsingLookup(Xrm.Page.data.entity.getId());
                        break;
                    case "2":
                        /* TODO: The function calls below used to call the function with 4 parameters instead of 3,
                           so the listId in the function ended up having the value of the outer gridId instead of the outer listId.
                           This leads me to believe the code below is dead code. However, fixing it for now. */
                        _this.launchListQualification("lqAdd", listMemberType);
                        break;
                    case "3":
                        _this.launchListQualification("lqRemove", listMemberType);
                        break;
                    case "4":
                        _this.launchListQualification("lqKeep", listMemberType);
                        break;
                }
            };
            this.launchListQualification = function (launchQualificationAction, listMemberType) { return __awaiter(_this, void 0, void 0, function () {
                var listId, fetchXmlTemplate, parameters, url, dlgOptions, callbackFunction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            listId = Xrm.Page.data.entity.getId().toString();
                            if (!ClientUtility.ClientUtil.isUCI()) return [3 /*break*/, 2];
                            fetchXmlTemplate = Marketing.List.ListFetchXmlResultsViewerTemplate;
                            parameters = {
                                param_fetch_xml: fetchXmlTemplate.getFetchXmlStaticList(listMemberType),
                                param_query_entity_type: fetchXmlTemplate.getEntityTypeGivenListMemberType(listMemberType),
                                param_layout_xml: fetchXmlTemplate.getLayoutXmlStaticList(listMemberType),
                                parent: 1,
                                param_invoke_type: launchQualificationAction,
                                param_selected_records: "",
                                entity_id: Xrm.Page.data.entity.getId(),
                                param_isvalid: true
                            };
                            return [4 /*yield*/, Xrm.Navigation.openDialog(Marketing.DialogName.AdvancedFindMembers, this.GenerateManageListDesignOptions(), parameters)];
                        case 1:
                            _a.sent();
                            this.refreshGridUci();
                            return [3 /*break*/, 3];
                        case 2:
                            url = Mscrm.GlobalImported.CrmUri.create("/MA/Lists/ListQualificationDlg/dlg_query_build.aspx");
                            url.get_query()["ListMemberType"] = listMemberType.toString();
                            url.get_query()["ListId"] = listId;
                            url.get_query()["InvokeType"] = launchQualificationAction;
                            dlgOptions = this.getDialogOptions(820, 615);
                            callbackFunction = Marketing.ClientUtil.createWithParameters(this, this.performGridRefresh, [listMemberType]);
                            Xrm.Internal.openDialog(url.toString(), dlgOptions, ["Search"], null, callbackFunction);
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); };
            this.performGridRefresh = function (result, entityTypeCode) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(entityTypeCode)) {
                    if (isOutlookHostedWindow()) {
                        Xrm.Page.data.refresh(true);
                    }
                    else {
                        Xrm.Internal.refreshParentGrid(entityTypeCode, "", "");
                        _this.refreshListOperations();
                    }
                }
            };
            this.validateXmlDocDistinctValue = function (requestFetchXml) {
                var requestFetchXmlDoc = new DOMParser().parseFromString(requestFetchXml, "text/xml");
                var fetchNodeDistinctValue = requestFetchXmlDoc.querySelector("fetch");
                if (fetchNodeDistinctValue != null) {
                    fetchNodeDistinctValue.setAttribute("distinct", "true");
                }
                return new XMLSerializer().serializeToString(requestFetchXmlDoc);
            };
            this.openDynamicListQuery = function (listMemberType) { return __awaiter(_this, void 0, void 0, function () {
                var listId, fetchXmlTemplate, options, parameters, response, url, dlgOptions, callbackFunction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            listId = Xrm.Page.data.entity.getId().toString();
                            if (!ClientUtility.ClientUtil.isUCI()) return [3 /*break*/, 2];
                            fetchXmlTemplate = Marketing.List.ListFetchXmlResultsViewerTemplate;
                            options = {
                                height: 840,
                                width: 1024,
                                position: 1 /* center */
                            };
                            parameters = {
                                param_fetch_xml: this.getCurrentDynamicListQuery(listMemberType),
                                param_query_entity_type: fetchXmlTemplate.getEntityTypeGivenListMemberType(listMemberType),
                                param_layout_xml: fetchXmlTemplate.getLayoutXmlDynamicList(listMemberType),
                                parent: 1,
                                param_selected_records: "",
                                param_canceled: true,
                                entity_id: Xrm.Page.data.entity.getId(),
                                param_isvalid: true
                            };
                            return [4 /*yield*/, Xrm.Navigation.openDialog(Marketing.DialogName.DynamicListMembers, options, parameters)];
                        case 1:
                            response = _a.sent();
                            if (this.isValidUCIManageResponse(response)) {
                                this.processResponseDynamicList(response);
                                this.refreshGridUci();
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            url = Mscrm.GlobalImported.CrmUri.create("/MA/Lists/ListQualificationDlg/dlg_query_build.aspx");
                            url.get_query()["ListMemberType"] = CrmEncodeDecode.CrmUrlEncode(listMemberType.toString());
                            url.get_query()["ListId"] = listId;
                            url.get_query()["InvokeType"] = CrmEncodeDecode.CrmUrlEncode("lqUseQuery");
                            dlgOptions = this.getDialogOptions(820, 615);
                            callbackFunction = Marketing.ClientUtil.createWithParameters(this, this.performGridRefresh, [listMemberType]);
                            Xrm.Internal.openDialog(url.toString(), dlgOptions, "Search", null, callbackFunction);
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); };
            this.processLQAdd = function (sFetchXml, sParams, iSelected, iOption) {
                // Add the records returned by the fetchXml
                if (iOption == allInQuery || iOption == selectedOption) {
                    if (sFetchXml) {
                        _this.fetchXml = sFetchXml;
                    }
                    // Need to construct the _sIds with the selected listmembers in this case
                    if (iOption == selectedOption) {
                        _this.fetchXml = ListActions.removeFiltersFromFetchXml(sFetchXml);
                        sParams = sParams.replace("isDirty=true", "isDirty=false");
                        _this.selectedMemberIds[0] = iSelected.toString();
                    }
                    _this.custParams = sParams + "&iOption=" + CrmEncodeDecode.CrmUrlEncode(iOption.toString());
                    _this.errorCode = errorNone;
                    _this.listActionUrl = Mscrm.GlobalImported.CrmUri.create("/MA/Lists/ListQualificationdlg/dlg_List_add.aspx?").toString();
                    _this.listActionUrl += "?";
                    Xrm.Internal.progress(Xrm.Internal.getResourceString("InProgress_ListAction_Processing_Message"), 0, 350, 150);
                    window.setTimeout(_this.postBackFetch, 50);
                    _this.returnValue = true;
                }
                else {
                    _this.returnValue = false;
                }
            };
            this.performAfterAddtoList = function (result) {
                if (result) {
                    _this.returnValue = true;
                }
                else {
                    _this.returnValue = false;
                }
                Mscrm.Utilities.setReturnValue(_this.returnValue);
                window.setTimeout(closeWindow, 0);
            };
            this.processLQUseQuery = function (fetchXml, paramValue) {
                if (fetchXml) {
                    _this.fetchXml = fetchXml;
                    _this.custParams = paramValue;
                    _this.errorCode = errorNone;
                    _this.listActionUrl = Mscrm.GlobalImported.CrmUri.create("/MA/Lists/ListQualificationDlg/dlg_dynamicList_query.aspx").toString();
                    _this.listActionUrl += "?";
                    Xrm.Internal.progress(Xrm.Internal.getResourceString("InProgress_ListAction_Processing_Message"), 0, 350, 150);
                    window.setTimeout(_this.postBackFetch, 50);
                    _this.returnValue = true;
                }
                else {
                    _this.returnValue = false;
                }
            };
            this.refreshMemberCount = function () {
                var memberCount = "";
                var objMemberCount = Xrm.Page.ui.controls.get("MemberCount");
                if (!ClientUtility.DataUtil.isNullOrUndefined(objMemberCount)) {
                    var listId = Xrm.Page.data.entity.getId();
                    Xrm.WebApi.retrieveRecord(Marketing.EntityNames.List, listId, "?$select=membercount")
                        .then(function (response) {
                        if (response) {
                            var entityDoc = response;
                            if (!ClientUtility.DataUtil.isNullOrEmptyString(entityDoc["membercount"])) {
                                memberCount = entityDoc["membercount"].toString();
                            }
                            objMemberCount.setLabel(memberCount);
                        }
                    }, ClientUtility.ActionFailedHandler.actionFailedCallback);
                }
            };
            this.launchAddToListSimple = function () {
                Marketing.List.CommandActions.addMembersUsingLookup(Xrm.Page.data.entity.getId());
            };
            // listId parameter is used for backwards compatibility
            this.launchAddToListAction = function (lookupItems, listId, member, arrayLength) {
                var marketingListId = Xrm.Page.data.entity.getId();
                var bMakeCall = false;
                if (lookupItems) {
                    if (lookupItems.length > 0) {
                        for (var i = 0; i < lookupItems.length; i++) {
                            arrayLength[i] = lookupItems[i].id;
                        }
                        bMakeCall = true;
                    }
                    if (bMakeCall) {
                        var url = Mscrm.GlobalImported.CrmUri.create("/_grid/cmds/dlg_addtolist.aspx");
                        url.get_query()["autoTrigger"] = 1;
                        url.get_query()["iObjType"] = parseInt(member);
                        url.get_query()["iTotal"] = arrayLength.length.toString();
                        url.get_query()["sIds"] = "";
                        url.get_query()["itemObjectId"] = marketingListId.toString();
                        url.get_query()["itemObjectTypeCode"] = "";
                        var dlgOptions = _this.getDialogOptions(400, 200);
                        var callbackFunction = Marketing.ClientUtil.createWithParameters(_this, _this.performGridRefresh, [member]);
                        Xrm.Internal.openDialog(url.toString(), dlgOptions, arrayLength, null, callbackFunction);
                    }
                }
            };
            this.processLQRemove = function (xml, parameters, selected, option) {
                if (option === selectedOption || option === allInQuery) {
                    if (!ClientUtility.DataUtil.isNullOrUndefined(xml)) {
                        _this.fetchXml = xml;
                    }
                    if (option === selectedOption) {
                        _this.fetchXml = ListActions.removeFiltersFromFetchXml(xml);
                        parameters = parameters.replace("isDirty=true", "isDirty=false");
                        _this.selectedMemberIds[0] = selected.toString();
                    }
                    _this.custParams = parameters + "&iOption=" + CrmEncodeDecode.CrmUrlEncode(option.toString());
                    _this.errorCode = errorNone;
                    _this.errorCount = 0;
                    _this.errorNumber = "";
                    _this.listActionUrl = Mscrm.GlobalImported.CrmUri.create("/MA/Lists/ListQualificationdlg/dlg_List_qualify.aspx").toString();
                    _this.listActionUrl += "?";
                    Xrm.Internal.progress(Xrm.Internal.getResourceString("InProgress_ListAction_Processing_Message"), 0, 350, 150);
                    window.setTimeout(_this.postBackFetch, 50);
                    _this.returnValue = true;
                }
                else {
                    _this.returnValue = false;
                }
            };
            this.processLQKeep = function (fetchxml, param, selected, option) {
                _this.processLQRemove(fetchxml, param, selected, option);
            };
            this.yesCallback = function () {
                _this.returnValue = true;
                Marketing.DialogUtil.closeDialog();
            };
            this.postBackFetch = function () {
                var dialogXml = "";
                if (ClientUtility.DataUtil.isNullOrEmptyString(_this.fetchXml)) {
                    dialogXml = "<node/>";
                }
                else {
                    dialogXml = _this.fetchXml;
                }
                dialogXml = "<root>" + dialogXml + "<Ids>";
                if (!ClientUtility.DataUtil.isNullOrUndefined(_this.selectedMemberIds) && _this.selectedMemberIds.length) {
                    var iLen = _this.selectedMemberIds.length;
                    for (var i = 0; i < iLen; i++) {
                        dialogXml = dialogXml + "<Id>" + _this.selectedMemberIds[i] + "</Id>";
                    }
                }
                dialogXml = dialogXml + "</Ids></root>";
                var submitUrl = _this.listActionUrl + _this.custParams;
                var oUrl = Mscrm.GlobalImported.CrmUri.create(submitUrl);
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open("POST", oUrl.toString(), false);
                Mscrm.Utilities.setResponseTypeToMSXml(xmlhttp);
                SetTokenInHeader(xmlhttp, oUrl);
                xmlhttp.send(dialogXml);
                _this.responseXml = xmlhttp.responseXML;
                _this.wait();
            };
            this.wait = function () {
                var errorDescription = "";
                var iStatus = parseInt(handleXMLErr(_this.responseXml, true).toString());
                if (iStatus.toString() === errorContinue.toString()) {
                    if (!_this.errorCount) {
                        _this.errorCode = iStatus;
                        var errNode = XUI.Xml.SelectSingleNode(_this.responseXml, "/error/code", null);
                        if (ClientUtility.DataUtil.isNullOrUndefined(errNode)) {
                            _this.errorNumber = "0x80004005";
                        }
                        else {
                            _this.errorNumber = XUI.Xml.GetText(errNode);
                        }
                        var descNode = XUI.Xml.SelectSingleNode(_this.responseXml, "/error/description", null);
                        errorDescription = ClientUtility.DataUtil.isNullOrUndefined(descNode) ? "" : XUI.Xml.GetText(descNode);
                    }
                    _this.errorCount++;
                }
                var readyToClose = Promise.resolve();
                if (_this.errorCode.toString() === errorContinue.toString()) {
                    if (_this.errorCount === 1) {
                        readyToClose = readyToClose.then(function () {
                            return Xrm.Navigation.openErrorDialog({
                                message: errorDescription,
                                errorCode: parseInt(_this.errorNumber)
                            });
                        }).then(function () { return undefined; });
                    }
                    else {
                        readyToClose = readyToClose.then(function () {
                            return Marketing.ClientUtil.openAlertDialog({
                                text: Xrm.Internal.getResourceString("MA_Error_Message_Action_MultipleErrorsFound")
                            });
                        }).then(function () { return undefined; });
                    }
                }
                else {
                    _this.returnValue = true;
                }
                readyToClose.then(function () {
                    Mscrm.Utilities.setReturnValue(_this.returnValue);
                    window.setTimeout(closeWindow, 0);
                });
            };
            this.getDialogOptions = function (width, height) {
                var dlgOptions = new Xrm.DialogOptions;
                dlgOptions.height = height;
                dlgOptions.width = width;
                return dlgOptions;
            };
        }
        ListActions.prototype.GenerateManageListDesignOptions = function () {
            return {
                height: 840,
                width: 1024
            };
        };
        ListActions.prototype.getMemberType = function () {
            return Xrm.Page.data.entity.attributes.get("membertype").getValue();
        };
        ListActions.prototype.refreshGridUci = function () {
            var fetchXmlTemplate = Marketing.List.ListFetchXmlResultsViewerTemplate;
            var entityName = fetchXmlTemplate.getEntityTypeGivenListMemberType(this.getMemberType());
            var gridControl = Xrm.Page.getControl(entityName + "sUCI");
            if (gridControl) {
                gridControl.refresh();
            }
            this.refreshListOperations();
        };
        ListActions.prototype.processResponseDynamicList = function (response) {
            var parameters = response.parameters;
            var entity = Xrm.Page.data.entity;
            var requestFetchXml = this.validateXmlDocDistinctValue(parameters.param_fetch_xml);
            entity.attributes.get("query").setValue(requestFetchXml);
            entity.save();
        };
        ListActions.prototype.getCurrentDynamicListQuery = function (listMemberType) {
            var fetchXmlTemplate = Marketing.List.ListFetchXmlResultsViewerTemplate;
            var entity = Xrm.Page.data.entity;
            return ClientUtility.DataUtil.isNullOrUndefined(entity.attributes.get("query").getValue())
                ? fetchXmlTemplate.getFetchXmlDynamicList(listMemberType)
                : entity.attributes.get("query").getValue();
        };
        ListActions.prototype.isValidUCIManageResponse = function (response) {
            var parameters = response.parameters;
            return parameters.param_canceled === false && !ClientUtility.DataUtil.isNullOrUndefined(parameters.param_fetch_xml);
        };
        ListActions.removeFiltersFromFetchXml = function (fetchXml) {
            var xmlDoc = new DOMParser().parseFromString(fetchXml, "text/xml");
            var filters = Array.from(xmlDoc.querySelectorAll("fetch entity filter"));
            for (var _i = 0, filters_1 = filters; _i < filters_1.length; _i++) {
                var filter = filters_1[_i];
                filter.parentNode.removeChild(filter);
            }
            return new XMLSerializer().serializeToString(xmlDoc);
        };
        /**
         * Refreshes the List Operations subgrid, if the corresponding Feature Control Bit (FCB)
         * is enabled.
         */
        ListActions.prototype.refreshListOperations = function () {
            var fcbStatus = Marketing.FCBUtil.IsAddMembersByQueryUsingWorkflowsEnabled();
            if (fcbStatus === true) {
                var listOperationsGrid = Marketing.GetListOperationSubgridControl();
                if (listOperationsGrid) {
                    listOperationsGrid.refresh();
                }
            }
        };
        return ListActions;
    }());
    Marketing.ListActions = ListActions;
})(Marketing || (Marketing = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Marketing;
(function (Marketing) {
    var ListCommands = (function () {
        function ListCommands(listAction, xrm) {
            var _this = this;
            this.listAction = listAction;
            this.xrm = xrm;
            /**
             * Launches a lookup control to add a campaign to a marketing list.
             */
            this.addListToCampaign = function () {
                Xrm.Utility.lookupObjects({
                    entityTypes: ["campaign"],
                    allowMultiSelect: false,
                    defaultEntityType: "campaign"
                }).then(function (lookupItems) {
                    Marketing.List.Commands.addToCampaignAction(lookupItems, Marketing.EntityTypeCodes.List, [Xrm.Page.data.entity.getId()]);
                });
            };
            /**
             * The callback action to add a campaign to a marketing list.
             */
            this.addToCampaignAction = function (lookupItems, iObjType, originatingEntities) {
                var oResult = undefined;
                if (lookupItems && lookupItems.length > 0) {
                    var iX = 475;
                    var iY = 250;
                    var itemObjectId = lookupItems[0].id;
                    var itemObjectTypeCode = iObjType;
                    var oUrl = Mscrm.CrmUri.create("/_grid/cmds/dlg_addtocampaign.aspx?iObjType=" + CrmEncodeDecode.CrmUrlEncode(iObjType) + "&iTotal=" + CrmEncodeDecode.CrmUrlEncode(lookupItems.length) + "&sIds=" + CrmEncodeDecode.CrmUrlEncode(lookupItems) + "&itemObjectId=" + CrmEncodeDecode.CrmUrlEncode(itemObjectId) + "&itemObjectTypeCode=" + CrmEncodeDecode.CrmUrlEncode(itemObjectTypeCode));
                    var crmDialog = new Mscrm.CrmDialog(oUrl, lookupItems, iX, iY, null);
                    crmDialog.show();
                    oResult = false;
                }
                return oResult;
            };
            /**
             * Launches the mail merge dialog.
             */
            this.mailMergeList = function () {
                if (ClientUtility.ClientUtil.isIOSDevice()) {
                    Marketing.ClientUtil.openAlertDialog({
                        text: Marketing.StringProvider.getResourceString("MA.UnsupportedRibbonAction")
                    });
                    return;
                }
                var oUrl = Mscrm.GlobalImported.CrmUri.create("/_grid/cmds/dlg_webmailmerge.aspx?objectTypeCode=" + CrmEncodeDecode.CrmUrlEncode("4300") + "&objectId=" + CrmEncodeDecode.CrmUrlEncode(Xrm.Page.data.entity.getId())), options = new Xrm.DialogOptions;
                options.width = 600;
                options.height = 500;
                Xrm.Internal.openDialog(oUrl.toString(), options, null, null, null);
            };
            this.addQuickCampaignFromSubGrid = function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!ClientUtility.ClientUtil.isUCI()) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.addQuickCampaignFromSubGridForUCI()];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            this.addQuickCampaignFromSubGridForWebClient();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); };
            /**
             * Opens the list case association dialog.
             */
            this.openListCaseAssociation = function (lookupItems, iType, sub, associationName, iRoleOrdinal, parent) {
                if (lookupItems) {
                    var options = {};
                    options.height = 250;
                    options.width = 850;
                    var dialogParams = {};
                    dialogParams["lookupItems"] = lookupItems;
                    dialogParams["iType"] = iType;
                    dialogParams["assocSubValueType"] = sub;
                    dialogParams["associationName"] = associationName;
                    dialogParams["iRoleOrdinal"] = iRoleOrdinal;
                    dialogParams["parent"] = parent;
                    Xrm.Navigation.openDialog(Marketing.DialogName.ListCampaignAssociacion, options, dialogParams);
                }
            };
            /**
             * Executes the list association action
             */
            this.associateListAction = function (lookupItems, typeCode, sub, associationName, iRoleOrdinal, parent) {
                if (lookupItems) {
                    var rolestatus = null;
                    iRoleOrdinal = ClientUtility.DataUtil.isNullOrUndefined(iRoleOrdinal) ? -1 : iRoleOrdinal;
                    rolestatus = iRoleOrdinal.toString() === "-1" ? "false" : iRoleOrdinal.toString() === "2" ? "true" : "false";
                    if (parent) {
                        Xrm.Internal.associateObjects(parent["objectTypeCode"].toString(), parent["id"].toString(), typeCode, lookupItems.items, rolestatus.toString(), sub, associationName, false);
                        Xrm.Internal.refreshParentGrid(typeCode, "", "");
                    }
                }
            };
            /**
             * Checks whether a list is unlocked. (The name is wrong)
             * @returns True when the list is unlocked; false when locked. True when entity is not a list.
             */
            this.isListLocked = function () {
                if (_this.isListForm()) {
                    var lockStatus = Xrm.Page.data.entity.attributes.get("lockstatus");
                    if (ClientUtility.DataUtil.isNull(lockStatus)) {
                        return false;
                    }
                    var isLocked = lockStatus.getValue();
                    return !isLocked;
                }
                return true;
            };
            /**
             * Checks whether the list is active.
             * @returns True for an active list; false for an inactive list.
             */
            this.isListActive = function () {
                var listState = Xrm.Page.data.entity.attributes.get("statecode");
                if (ClientUtility.DataUtil.isNull(listState)) {
                    return false;
                }
                var isActive = listState.getValue();
                return isActive === 0;
            };
            this.isManageMembersStandardEnabled = function () {
                if (ClientUtility.ClientUtil.isUCI()) {
                    // In UCI Manage members is only available for dynamic lists
                    // Static lists have a dedicated menu group
                    return _this.isDynamicList();
                }
                return true;
            };
            this.isManageMembersGroupEnabled = function () {
                if (ClientUtility.ClientUtil.isUCI()) {
                    // In UCI Manage members is only available for dynamic lists
                    // Static lists have a dedicated menu group
                    return !_this.isDynamicList();
                }
                return false;
            };
            /**
             * Checks whether current form is list form.
             * @returns True for a list form; false for a form of type different than list or a homepage grid.
             */
            this.isListForm = function () {
                var entityName = Xrm.Page.data && Xrm.Page.data.entity && Xrm.Page.data.entity.getEntityName();
                return !!entityName && entityName === Marketing.EntityNames.List;
            };
            /**
             * Checks whether all selected marketing lists are of the same type.
             * @returns True for the same type; otherwise, false
             */
            this.selectedListsHaveUniqueType = function (gridControl) {
                // When custom view is used, data about target might not be available, therefore following query might fail. In this case
                // ignore the rule (return true) as there is no clear way how to tell whether the combination is valid or not. Backend validation ensures
                // invalid data is not stored in DB 
                try {
                    var targets_1 = _this.getListItemAttributes(gridControl, 'createdfromcode');
                    return Boolean(targets_1.length && targets_1.every(function (typeCode) { return typeCode === targets_1[0]; }));
                }
                catch (e) {
                    return true;
                }
            };
            /**
            * Checks whether all selected marketing lists are static.
            * @returns True when all lists are static; otherwise, false
            */
            this.selectedListsAreStatic = function (gridControl) {
                // When custom view is used, data about target might not be available, therefore following query might fail. In this case
                // ignore the rule (return true) as there is no clear way how to tell whether the combination is valid or not. Backend validation ensures
                // invalid data is not stored in DB 
                try {
                    var types = _this.getListItemAttributes(gridControl, 'type');
                    // static = 'Static' in WebClient and false in UCI
                    return Boolean(types.length && types.every(function (typeInfo) { return typeInfo === false || _this.checkWebClientListIsStatic(typeInfo); }));
                }
                catch (e) {
                    return true;
                }
            };
            this.localisedStaticWords = ["ثابتة", "Постоянно", "Estàtic", "Statický", "Statisk", "Statisch", "Στατική", "Static", "Estático", "Staatiline",
                "Estatikoa", "Staattinen", "Statique", "Estático", "סטטית", "स्थैतिक", "Statičko", "Statikus",
                "Statis", "Statico", "静的", "Тұрақты", "정적", "Pastovus", "Statiska", "Statik", "Statisk",
                "Statisch", "Statyczna", "Estático", "Estático", "Static", "Статический", "Statické", "Statično",
                "Статично", "Statično", "Statisk", "Static", "คงที่", "Statik", "Статичний", "Tĩnh", "静态", "靜態", "靜態"];
            /**
             * Checks whether the list is static.
             * @returns True for a static list; false for a dynamic list.
             */
            this.isListStatic = function () {
                var isStatic = !_this.isDynamicList();
                return isStatic;
            };
            /**
             * Checks that the entity is not both a list and of type dynamic.
             * @returns True for a static list; false for a dynamic list. True for non-list entity.
             */
            this.isNotDynamicList = function () {
                if (_this.isListForm()) {
                    return _this.isListStatic();
                }
                return true;
            };
            /**
             * Refreshes the quick campaign sub-grid.
             */
            this.refreshMiniCampaign = function (result) {
                if (result) {
                    var quickCampaigns = Xrm.Page.ui.controls.get("QuickCampaigns");
                    if (quickCampaigns != null) {
                        quickCampaigns.refresh();
                    }
                }
            };
            this.refreshMembersGridRibbon = function () {
                ListCommands.refreshGridRibbonIfVisible(Marketing.ListUtilities.getListPageMemberGridByCode(Marketing.EntityTypeCodes.Account));
                ListCommands.refreshGridRibbonIfVisible(Marketing.ListUtilities.getListPageMemberGridByCode(Marketing.EntityTypeCodes.Contact));
                ListCommands.refreshGridRibbonIfVisible(Marketing.ListUtilities.getListPageMemberGridByCode(Marketing.EntityTypeCodes.Lead));
            };
            this.refreshRibbon = function () {
                Xrm.Page.ui.refreshRibbon();
            };
            this.refreshControl = function (gridControl) {
                if (gridControl && gridControl.getVisible()) {
                    gridControl.refresh();
                }
            };
            /**
             * The members grid inside of webclient needs to be refreshed when the user clicks it.
             * Otherwise, the data won't be loaded.
             */
            this.refreshGridsWebClient = function () {
                _this.refreshControl(Marketing.ListUtilities.getListPageMemberGridByCode(Marketing.EntityTypeCodes.Account));
                _this.refreshControl(Marketing.ListUtilities.getListPageMemberGridByCode(Marketing.EntityTypeCodes.Contact));
                _this.refreshControl(Marketing.ListUtilities.getListPageMemberGridByCode(Marketing.EntityTypeCodes.Lead));
            };
            this.initialize = function () {
                var isUCI = ClientUtility.ClientUtil.isUCI();
                if (!isUCI) {
                    var membersTab = ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.ui.tabs.get("members")) ? Xrm.Page.ui.tabs.get("Summary") : Xrm.Page.ui.tabs.get("members");
                    if (!ClientUtility.DataUtil.isNullOrUndefined(membersTab)) {
                        // Add state change for the members tab.
                        membersTab.addTabStateChange(_this.refreshGridsWebClient);
                        // Hide the section which host member grids for uci
                        _this.setSectionVisible(membersTab, "ucimembers", false);
                        // Show the section which host member grids for web
                        _this.setSectionVisible(membersTab, "members", true);
                    }
                }
                _this.setVisibleSubGrid();
            };
            /**
             * Sets the visibility of the sub-grids.
             */
            this.setVisibleSubGrid = function () { return __awaiter(_this, void 0, void 0, function () {
                var isMembersPlugin, accountsGrid, contactsGrid, leadsGrid, accountsGridUCI, contactsGridUCI, leadsGridUCI, dynamicAccountControls, dynamicContactControls, dynamicLeadControls, targetedRecordType, isInCreateMode, isUCI, isDynamicList;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.isDynamicMembersFeatureEnabled()];
                        case 1:
                            isMembersPlugin = _a.sent();
                            accountsGrid = Marketing.ListUtilities.getListPageMemberGridByCode(Marketing.EntityTypeCodes.Account, false);
                            contactsGrid = Marketing.ListUtilities.getListPageMemberGridByCode(Marketing.EntityTypeCodes.Contact, false);
                            leadsGrid = Marketing.ListUtilities.getListPageMemberGridByCode(Marketing.EntityTypeCodes.Lead, false);
                            accountsGridUCI = Marketing.ListUtilities.getListPageMemberGridByCode(Marketing.EntityTypeCodes.Account, true);
                            contactsGridUCI = Marketing.ListUtilities.getListPageMemberGridByCode(Marketing.EntityTypeCodes.Contact, true);
                            leadsGridUCI = Marketing.ListUtilities.getListPageMemberGridByCode(Marketing.EntityTypeCodes.Lead, true);
                            dynamicAccountControls = Xrm.Page.getControl(Marketing.ListEntityControlNames.dynamicAccountsUci);
                            dynamicContactControls = Xrm.Page.getControl(Marketing.ListEntityControlNames.dynamicContactsUci);
                            dynamicLeadControls = Xrm.Page.getControl(Marketing.ListEntityControlNames.dynamicLeadsUci);
                            targetedRecordType = Marketing.ListUtilities.getListTargetType();
                            isInCreateMode = Xrm.Page.ui.getFormType() == 1;
                            isUCI = ClientUtility.ClientUtil.isUCI();
                            if (isMembersPlugin) {
                                // when plugin is enabled, these 3 grids will be used by all web client static/dynamic list
                                ListCommands.setSubgridControlVisibility(accountsGrid, targetedRecordType === Marketing.EntityTypeCodes.Account && !isUCI);
                                ListCommands.setSubgridControlVisibility(contactsGrid, targetedRecordType === Marketing.EntityTypeCodes.Contact && !isUCI);
                                ListCommands.setSubgridControlVisibility(leadsGrid, targetedRecordType === Marketing.EntityTypeCodes.Lead && !isUCI);
                                // when plugin is enabled, these 3 grids will be used by all UCI static/dynamic list
                                ListCommands.setSubgridControlVisibility(accountsGridUCI, targetedRecordType === Marketing.EntityTypeCodes.Account && isUCI);
                                ListCommands.setSubgridControlVisibility(contactsGridUCI, targetedRecordType === Marketing.EntityTypeCodes.Contact && isUCI);
                                ListCommands.setSubgridControlVisibility(leadsGridUCI, targetedRecordType === Marketing.EntityTypeCodes.Lead && isUCI);
                                // when plugin is enabled, these 3 control will not be used
                                ListCommands.setSubgridControlVisibility(dynamicAccountControls, false);
                                ListCommands.setSubgridControlVisibility(dynamicContactControls, false);
                                ListCommands.setSubgridControlVisibility(dynamicLeadControls, false);
                            }
                            else {
                                isDynamicList = this.isDynamicList();
                                // when plugin is disabled, these 3 grids will be used by all web client static/dynamic list
                                ListCommands.setSubgridControlVisibility(accountsGrid, targetedRecordType === Marketing.EntityTypeCodes.Account && !isUCI);
                                ListCommands.setSubgridControlVisibility(contactsGrid, targetedRecordType === Marketing.EntityTypeCodes.Contact && !isUCI);
                                ListCommands.setSubgridControlVisibility(leadsGrid, targetedRecordType === Marketing.EntityTypeCodes.Lead && !isUCI);
                                // when plugin is disabled, these 3 grids will be for static UCI.
                                ListCommands.setSubgridControlVisibility(accountsGridUCI, targetedRecordType === Marketing.EntityTypeCodes.Account && isUCI && !isDynamicList);
                                ListCommands.setSubgridControlVisibility(contactsGridUCI, targetedRecordType === Marketing.EntityTypeCodes.Contact && isUCI && !isDynamicList);
                                ListCommands.setSubgridControlVisibility(leadsGridUCI, targetedRecordType === Marketing.EntityTypeCodes.Lead && isUCI && !isDynamicList);
                                //  // when plugin is disabled, these 3 grids will be for dynamic UCI.
                                ListCommands.setSubgridControlVisibility(dynamicAccountControls, isUCI && isDynamicList && !isInCreateMode && targetedRecordType === Marketing.EntityTypeCodes.Account);
                                ListCommands.setSubgridControlVisibility(dynamicContactControls, isUCI && isDynamicList && !isInCreateMode && targetedRecordType === Marketing.EntityTypeCodes.Contact);
                                ListCommands.setSubgridControlVisibility(dynamicLeadControls, isUCI && isDynamicList && !isInCreateMode && targetedRecordType === Marketing.EntityTypeCodes.Lead);
                            }
                            return [2 /*return*/];
                    }
                });
            }); };
            /**
             * Disables controls according to the list type status.
             */
            this.disableLockStatus = function () {
                _this.disableLockStatusInternal("lockstatus");
                _this.disableLockStatusInternal("header_lockstatus");
            };
            /**
             * Associates a list member to a marketing list.
             */
            this.locAssocObjMember = function (memberType, parentId, parentObjectTypeCode) {
                var parent = _this.getParentObject(parentId, parentObjectTypeCode);
                if (_this.isDynamicList()) {
                    _this.listAction.openDynamicListQuery(memberType);
                }
                else {
                    _this.listAction.openManageMembersWizard(memberType, parent["objectTypeCode"].toString(), parent["id"].toString(), 440, 450);
                }
            };
            /**
             * Associates the list to an account.
             */
            this.locAssocObjAccount = function (typeInfo, sub, associationName, iRoleOrdinal, parentId, parentObjectTypeCode) {
                var parent = _this.getParentObject(parentId, parentObjectTypeCode);
                var lookupOptions = {};
                var lookupTypes;
                switch (typeInfo) {
                    case Marketing.EntityTypeCodes.Campaign:
                        lookupTypes = [Marketing.EntityNames.Campaign];
                        lookupOptions.lookupStyle = Xrm.LookupStyle.single;
                        lookupOptions.lookupTypes = lookupTypes;
                        Xrm.Utility.lookupObjects(lookupOptions).then(function (lookupItems) {
                            var lookupObjects = {};
                            lookupObjects.items = lookupItems;
                            _this.openListCaseAssociation(lookupObjects, typeInfo, sub, associationName, iRoleOrdinal.toString(), parent);
                        });
                        return;
                    case Marketing.EntityTypeCodes.BulkOperation:
                        _this.addQuickCampaignFromSubGrid();
                        return;
                    default:
                        var entityName = Xrm.Internal.getEntityName(typeInfo);
                        lookupTypes = [entityName];
                        lookupOptions.lookupStyle = Xrm.LookupStyle.multi;
                        lookupOptions.lookupTypes = lookupTypes;
                        Xrm.Utility.lookupObjects(lookupOptions).then(function (lookupItems) {
                            var lookupObjects = {};
                            lookupObjects.items = lookupItems;
                            _this.associateListAction(lookupObjects, typeInfo, sub, associationName, iRoleOrdinal, parent);
                        });
                        return;
                }
            };
            /**
             * Launches the manage members form
             */
            this.listActionManageMembersForm = function (form, memberTypeAttribute, typeAttribute) {
                var memberType = -1;
                if (memberTypeAttribute) {
                    memberType = memberTypeAttribute.getValue();
                }
                if (typeAttribute && typeAttribute.getValue()) {
                    _this.listAction.openDynamicListQuery(memberType);
                }
                else {
                    _this.listAction.openManageMembersWizard(memberType, null, Xrm.Page.data.entity.getId(), 440, 450);
                }
            };
            /**
             * Copies the dynamic list to a static one.
             */
            this.copyDynamicListToStatic = function (id) { return __awaiter(_this, void 0, void 0, function () {
                var options, dialogParameters, url, dialogCallback, options;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.xrm.Page.data.entity.getIsDirty()) {
                                Marketing.ClientUtil.openAlertDialog({
                                    text: Marketing.StringProvider.getResourceString("ListForm.Dirty.Message")
                                });
                                return [2 /*return*/];
                            }
                            if (!ClientUtility.ClientUtil.isUCI()) return [3 /*break*/, 2];
                            options = {
                                width: Marketing.DialogSizes.CopyToStaticDialogWidth,
                                height: Marketing.DialogSizes.CopyToStaticDialogHeight,
                                position: 1 /* center */
                            };
                            dialogParameters = {
                                entity_id: id
                            };
                            return [4 /*yield*/, this.xrm.Navigation.openDialog(Marketing.DialogName.SaveListAsStatic, options, dialogParameters)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            url = Mscrm.GlobalImported.CrmUri.create("/MA/Lists/dlg_copytostatic.aspx");
                            dialogCallback = null;
                            options = new this.xrm.DialogOptions();
                            options.width = Marketing.DialogSizes.CopyToStaticDialogWidth;
                            options.height = Marketing.DialogSizes.CopyToStaticDialogHeight;
                            dialogCallback = Mscrm.CommandBarActions.createCallbackFunctionFactory(ListCommands.copyDynamicListToStaticCallback, [id]);
                            this.xrm.Internal.openDialog(url.toString(), options, null, null, dialogCallback);
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); };
            /**
             * Copies the list to another list.
             */
            this.copyTo = function (gridControl, records, entityTypeCode) {
                var lookupOptions = new Xrm.LookupOptions;
                var lookupTypes = [Marketing.EntityNames.List];
                var additionalParams = {};
                additionalParams["listType"] = "static";
                lookupOptions.lookupStyle = "single";
                lookupOptions.lookupTypes = lookupTypes;
                lookupOptions.additionalParams = additionalParams;
                lookupOptions.showNew = true;
                lookupOptions.showProperties = true;
                lookupOptions.defaultViewId = Marketing.List.availableListViewId;
                Xrm.Utility.lookupObjects(lookupOptions).then(function (lookupItems) {
                    _this.takeAction(lookupItems, "copyto", entityTypeCode, records, 400, 250);
                });
            };
            /**
             * Adds the list to a campaign.
             */
            this.addToCampaign = function (gridControl, records, entityTypeCode) {
                var actionName = "addtocampaign";
                var lookupOptions = new Xrm.LookupOptions;
                var lookupTypes = [Marketing.EntityNames.Campaign];
                lookupOptions.lookupStyle = "single";
                lookupOptions.lookupTypes = lookupTypes;
                lookupOptions.showNew = true;
                lookupOptions.showProperties = true;
                Xrm.Utility.lookupObjects(lookupOptions).then(function (lookupItems) {
                    _this.takeAction(lookupItems, actionName, entityTypeCode, records, 475, 250);
                });
            };
            /**
             * Launches the opportunity creation dialog for the selected members (if none is selected, for all).
             */
            this.createOpportunityForMembers = function (gridControl) {
                var entity = Xrm.Page.data.entity;
                var createdFromCodeAttribute = entity.attributes.get(Marketing.ListEntityFieldNames.CreatedFromCode);
                var listMemberType = createdFromCodeAttribute.getValue();
                var members = [];
                if (listMemberType !== Marketing.EntityTypeCodes.Account && listMemberType !== Marketing.EntityTypeCodes.Contact) {
                    Marketing.ClientUtil.openAlertDialog({
                        text: Marketing.StringProvider.getResourceString(ListCommands.invalidTypeForOpportunity)
                    });
                    return;
                }
                if (!gridControl) {
                    var subGrid = Marketing.ListUtilities.getListPageMemberGridByCode(listMemberType);
                    members = ListCommands.getSelectedOrAll(subGrid);
                }
                else {
                    members = ListCommands.getSelectedOrAll(gridControl);
                }
                if (members && members.length > 50) {
                    Marketing.ClientUtil.openAlertDialog({
                        text: Marketing.StringProvider.getResourceString("Members_Convert_opportunity_Error_Message")
                    });
                }
                else {
                    ListCommands.createOpportunity(listMemberType, entity.getId(), "createopportunity", Marketing.EntityTypeCodes.ListMember, members);
                }
            };
            this.isDynamicList = function () {
                var typeAttribute = Xrm.Page.data.entity.attributes.get("type");
                if (typeAttribute) {
                    return typeAttribute.getValue();
                }
                return false;
            };
        }
        ListCommands.prototype.addQuickCampaignFromSubGridForUCI = function () {
            return __awaiter(this, void 0, void 0, function () {
                var transactionCurrency, createdFromOtc, gridFetchXml, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Marketing.TransactionCurrency.getTransactionCurrency("transactioncurrencyid")];
                        case 1:
                            transactionCurrency = _a.sent();
                            createdFromOtc = Xrm.Page.data.entity.attributes.get(Marketing.ListEntityFieldNames.CreatedFromCode).getValue();
                            gridFetchXml = "";
                            return [4 /*yield*/, Marketing.BulkOperation.CreateWizard.open([ClientUtility.Guid.tryCreate(Xrm.Page.data.entity.getId())], Marketing.EntityTypeCodes.List, createdFromOtc, Marketing.QuickCampaignSelectionMode.SelectedRecords, gridFetchXml, transactionCurrency)];
                        case 2:
                            result = _a.sent();
                            ListCommands.refreshMiniCampaign(result);
                            return [2 /*return*/];
                    }
                });
            });
        };
        ListCommands.prototype.addQuickCampaignFromSubGridForWebClient = function () {
            var createdFromOtc = Xrm.Page.data.entity.attributes.get(Marketing.ListEntityFieldNames.CreatedFromCode);
            var oArgs = {
                CreatedFromOtc: createdFromOtc.getValue().toString(),
                GridXml: "",
                Ids: [Xrm.Page.data.entity.getId()],
                MCOption: 1,
                MCOptionTitle: Marketing.StringProvider.getResourceString("MenuItem_Label_MC_SelectedItems"),
                ObjectTypeCode: Marketing.EntityTypeCodes.List,
                SelectedRecords: 1,
                TotalRecords: 1,
            };
            var actionUri = Mscrm.GlobalImported.CrmUri.create("/MA/MiniCampaign/MiniCampaign.aspx");
            var options = new Xrm.DialogOptions();
            options.width = Marketing.DialogSizes.MiniCampaignDialogWidth;
            options.height = Marketing.DialogSizes.MiniCampaignDialogHeight;
            Xrm.Internal.openDialog(actionUri.toString(), options, oArgs, null, ListCommands.refreshMiniCampaign);
        };
        ListCommands.prototype.checkWebClientListIsStatic = function (elementType) {
            return this.localisedStaticWords.indexOf(elementType) !== -1;
        };
        ListCommands.prototype.getListItemAttributes = function (gridControl, attributeName) {
            // Common way working for both web client and UCI
            return gridControl.getGrid().getSelectedRows().get().map(function (row) { return row.getData().entity.attributes.get(attributeName).getValue(); });
        };
        /**
         * Refreshes the quick campaign sub-grid.
         */
        ListCommands.refreshMiniCampaign = function (result) {
            if (result) {
                var quickCampaigns = Xrm.Page.ui.controls.get("QuickCampaigns");
                if (quickCampaigns != null) {
                    quickCampaigns.refresh();
                }
            }
        };
        ListCommands.refreshGridRibbonIfVisible = function (gridControl) {
            if (gridControl && gridControl.getVisible()) {
                gridControl.refreshRibbon();
            }
        };
        /**
         * Sets the visibility of the section.
        */
        ListCommands.prototype.setSectionVisible = function (tab, sectionName, visible) {
            var section = tab.sections.get(sectionName);
            if (!ClientUtility.DataUtil.isNullOrUndefined(section)) {
                section.setVisible(visible);
            }
        };
        /*
         * WebClient: Introduced to fix the problem that Control.setVisibility is being called before the control is being initialized. All grids are visible
         * by default so in this case do not call any methods on the control, otherwise events are not attached properly.
         * UCI: Nothing should be changed, setVisible(...) must be called, otherwise the grids will remain not visible.
         */
        ListCommands.setSubgridControlVisibility = function (subgridControl, makeVisible) {
            if (!subgridControl) {
                return;
            }
            var isUCI = ClientUtility.ClientUtil.isUCI();
            var isVisibleOnPage = subgridControl.getVisible();
            var shouldCallOnWebClientAfterNewSaved = !isUCI && !isVisibleOnPage && makeVisible;
            if ((!makeVisible || isUCI || (shouldCallOnWebClientAfterNewSaved)) && !ClientUtility.DataUtil.isNullOrUndefined(subgridControl)) {
                subgridControl.setVisible(makeVisible);
            }
        };
        ListCommands.prototype.disableLockStatusInternal = function (fieldId) {
            var disableStatus = false;
            var lockStatusControl = Xrm.Page.ui.controls.get(fieldId);
            if (ClientUtility.DataUtil.isNullOrUndefined(lockStatusControl)) {
                return;
            }
            if (this.isDynamicList()) {
                var lockStatusAttribute = Xrm.Page.data.entity.attributes.get(fieldId);
                if (lockStatusAttribute) {
                    lockStatusAttribute.setValue(false);
                }
                lockStatusControl.setDisabled(true);
            }
            else {
                lockStatusControl.setDisabled(false);
            }
        };
        ListCommands.copyDynamicListToStaticCallback = function (isCopy, id) {
            return __awaiter(this, void 0, void 0, function () {
                var startTime, request;
                return __generator(this, function (_a) {
                    if (!isCopy) {
                        return [2 /*return*/];
                    }
                    startTime = performance.now();
                    request = new ODataContract.CopyDynamicListToStaticRequest({
                        id: ClientUtility.Guid.create(id),
                        entityType: Marketing.EntityNames.List
                    });
                    try {
                        new Promise(function (resolve, reject) {
                            window.Xrm.WebApi.online.execute(request).then(function (response) {
                                Xrm.Utility.closeProgressIndicator();
                                if (response != null) {
                                    response.json().then(function (jsonResponse) {
                                        resolve(jsonResponse);
                                    });
                                }
                            }, function (error) {
                                Xrm.Utility.closeProgressIndicator();
                                reject(error);
                            });
                        }).then(function (response) {
                            var responseStaticListId = response.listid.toString();
                            Xrm.Utility.openEntityForm(Marketing.EntityNames.List, responseStaticListId, null);
                            Xrm.Utility.refreshParentGrid({ entityType: Marketing.EntityNames.List, id: responseStaticListId, name: undefined });
                            var endTime = performance.now();
                            var duration = endTime - startTime;
                            Marketing.EMTelemetry.LogInfo(Marketing.TelemetryConstants.MarketingList, "ListCommands", "copyDynamicListToStatic", "Opened copy to static dialog", "Clicked", "CopyDynamicToStatic", [
                                {
                                    name: "sourceDynamicListId",
                                    value: id
                                },
                                {
                                    name: "targetStaticListId",
                                    value: responseStaticListId
                                },
                                {
                                    name: "Duration",
                                    value: duration
                                }
                            ], Marketing.LogType.CustomerIntelligence);
                        }, function (exception) {
                            if (exception.errorCode == 2147809025) {
                                Marketing.ClientUtil.openAlertDialog({ text: ClientUtility.StringUtil.format(Marketing.StringProvider.getResourceString("MA.List.CopyToStatic")) });
                            }
                            else {
                                ClientUtility.ActionFailedHandler.actionFailedCallback(exception);
                                return;
                            }
                        });
                    }
                    catch (error) {
                        ClientUtility.ActionFailedHandler.actionFailedCallback(error);
                        return [2 /*return*/];
                    }
                    return [2 /*return*/];
                });
            });
        };
        ListCommands.prototype.takeAction = function (lookupItems, actionName, entityTypeCode, records, windowWidth, windowHeight) {
            if (ClientUtility.DataUtil.isNullOrUndefined(lookupItems) || !lookupItems.length) {
                return;
            }
            var itemObjectId = lookupItems[0].id;
            var itemObjectTypeCode = lookupItems[0].type.toString();
            var actionUri = Mscrm.InternalUtilities.GridUtilities.generateStandardActionUri(actionName, entityTypeCode, records.length);
            actionUri.get_query()["itemObjectId"] = itemObjectId;
            actionUri.get_query()["itemObjectTypeCode"] = itemObjectTypeCode;
            windowWidth = ClientUtility.DataUtil.isNullOrUndefined(windowWidth) ? 400 : windowWidth;
            windowHeight = ClientUtility.DataUtil.isNullOrUndefined(windowHeight) ? 250 : windowHeight;
            Mscrm.InternalUtilities.GridUtilities.executeStandardAction(actionUri, records, windowWidth, windowHeight, null);
        };
        ListCommands.prototype.getParentObject = function (parentId, parentObjectTypeCode) {
            if ((ClientUtility.DataUtil.isNullOrEmptyString(parentId) || ClientUtility.DataUtil.isNullOrUndefined(parentObjectTypeCode)) && !ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data.entity)) {
                var typeName = Xrm.Page.data.entity.getEntityName();
                parentObjectTypeCode = Xrm.Internal.getEntityCode(typeName);
                parentId = Xrm.Page.data.entity.getId();
            }
            var parameters = {};
            parameters["id"] = parentId;
            parameters["objectTypeCode"] = parentObjectTypeCode;
            return parameters;
        };
        ListCommands.getSelectedOrAll = function (grid) {
            var members = [];
            if (!ClientUtility.DataUtil.isNullOrUndefined(grid)) {
                if (typeof grid.getGrid === "function") {
                    var selectedRecords = grid.getGrid().getSelectedRows();
                    if (ClientUtility.DataUtil.isNullOrUndefined(selectedRecords) || !selectedRecords.getLength()) {
                        selectedRecords = grid.getGrid().getRows();
                    }
                    for (var i = 0; i < selectedRecords.getLength(); i++) {
                        members[i] = selectedRecords.get(i).getData().getEntity().getId();
                    }
                }
                else {
                    members = window.top.dynamicListSelectedRecords;
                }
            }
            return members;
        };
        ListCommands.createOpportunity = function (memberType, parentId, action, parentType, members) {
            if (ClientUtility.DataUtil.isNullOrUndefined(members) || !members.length) {
                Marketing.ClientUtil.openAlertDialog({
                    text: Marketing.StringProvider.getResourceString("MA_Error_Message_Action_NoItemSelected")
                });
                return;
            }
            if (ClientUtility.ClientUtil.isUCI()) {
                var options = {
                    width: Marketing.DialogSizes.CreateOpportunityDialogWidth,
                    height: Marketing.DialogSizes.CreateOpportunityDialogHeight,
                    position: 1 /* center */
                };
                var dialogParameters = {
                    member_type: memberType,
                    members_array: members
                };
                Xrm.Navigation.openDialog(Marketing.DialogName.CreateOpportunity, options, dialogParameters);
            }
            else {
                var dialogOptions = {
                    width: Marketing.DialogSizesLegacy.CreateOpportunityDialogWidth,
                    height: Marketing.DialogSizesLegacy.CreateOpportunityDialogHeight
                };
                var oUrl = Mscrm.GlobalImported.CrmUri.create("/_grid/cmds/dlg_" + CrmEncodeDecode.CrmUrlEncode(action) + ".aspx");
                oUrl.get_query()[ListCommands.objTypeQueryParamName] = memberType;
                oUrl.get_query()[ListCommands.parentIdQueryParamName] = parentId;
                oUrl.get_query()[ListCommands.parentTypeQueryParamName] = parentType;
                oUrl.get_query()[ListCommands.totalQueryParamName] = members.length;
                Xrm.Internal.openDialog(oUrl.toString(), dialogOptions, members, null, null);
            }
        };
        ListCommands.prototype.isNotListMemberForm = function () {
            switch (Xrm.Page.data.entity.getEntityName()) {
                case Marketing.EntityNames.Contact:
                case Marketing.EntityNames.Account:
                case Marketing.EntityNames.Lead:
                    return false;
            }
            return true;
        };
        ;
        ListCommands.prototype.validateForm = function () {
            if (!Xrm.Internal.isUci()) {
                return;
            }
            var missingElements = [];
            this.validateAttribute(Marketing.ListEntityFieldNames.Query, missingElements);
            this.validateAttribute(Marketing.ListEntityFieldNames.MemberType, missingElements);
            this.validateControl(Marketing.ListEntityControlNames.staticAccountsUci, missingElements);
            this.validateControl(Marketing.ListEntityControlNames.staticContactsUci, missingElements);
            this.validateControl(Marketing.ListEntityControlNames.staticLeadsUci, missingElements);
            this.validateControl(Marketing.ListEntityControlNames.dynamicAccountsUci, missingElements);
            this.validateControl(Marketing.ListEntityControlNames.dynamicContactsUci, missingElements);
            this.validateControl(Marketing.ListEntityControlNames.dynamicLeadsUci, missingElements);
            if (missingElements.length) {
                var list = missingElements.join(", ");
                var message = Marketing.ResourceStringProvider.getResourceString(ListCommands.missingElementMessageKey).replace("{0}", list);
                this.xrm.Page.ui.setFormNotification(message, "WARNING", ListCommands.missingElementNotificationId);
            }
        };
        ListCommands.prototype.validateAttribute = function (attribute, missingElements) {
            if (!Xrm.Page.getAttribute(attribute)) {
                missingElements.push("'" + attribute + "'");
            }
        };
        ListCommands.prototype.validateControl = function (control, missingElements) {
            if (!Xrm.Page.getControl(control)) {
                missingElements.push("'" + control + "'");
            }
        };
        ListCommands.prototype.isDynamicMembersFeatureEnabled = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    try {
                        return [2 /*return*/, !!(Xrm.Internal && Xrm.Internal.isFeatureEnabled
                                && (Xrm.Internal.isFeatureEnabled(ListCommands.membersPluginFeatureNameWeb) || Xrm.Internal.isFeatureEnabled(ListCommands.membersPluginFeatureNameUCI))
                                && (Xrm.Internal.isFeatureEnabled(ListCommands.memberSubgridFeatureWeb) || Xrm.Internal.isFeatureEnabled(ListCommands.memberSubgridFeatureUCI)))];
                    }
                    catch (error) {
                        Xrm.Reporting.reportFailure("marketing", new Error("EnterpriseMarketing-Marketing.MemberOperations.FeatureDetection"), "", [
                            { name: "error", value: JSON.stringify(error) }
                        ]);
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/];
                });
            });
        };
        return ListCommands;
    }());
    ListCommands.objTypeQueryParamName = "iObjType";
    ListCommands.parentIdQueryParamName = "sParentId";
    ListCommands.parentTypeQueryParamName = "iParentType";
    ListCommands.totalQueryParamName = "iTotal";
    ListCommands.missingElementMessageKey = "MA.List.ValidateForm.MissingElements";
    ListCommands.membersPluginFeatureNameWeb = "FCB.MarketingListDynamicMembersFeature";
    ListCommands.membersPluginFeatureNameUCI = "MarketingListDynamicMembersFeature";
    ListCommands.memberSubgridFeatureWeb = "FCB.MarketingListMemberSubgridFeature";
    ListCommands.memberSubgridFeatureUCI = "MarketingListMemberSubgridFeature";
    ListCommands.missingElementNotificationId = "MarketingListFormMissingElementsNotification";
    ListCommands.invalidTypeForOpportunity = "MA_Error_Message_Action_NotValidForOpportunity";
    Marketing.ListCommands = ListCommands;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <ListMemberFetchXmlCRUDVersion>2</ListMemberFetchXmlCRUDVersion>
var Marketing;
(function (Marketing) {
    var ListMembers = (function () {
        function ListMembers() {
        }
        ListMembers.copyToList = function (gridControl, sourceLists) {
            return __awaiter(this, void 0, void 0, function () {
                var startTime, listTypes, targetLists, copyConfirmation, lists, endTime, duration;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            startTime = performance.now();
                            return [4 /*yield*/, ListMembers.getSelectedListTypes(gridControl)];
                        case 1:
                            listTypes = _a.sent();
                            if (ClientUtility.DataUtil.isNullOrUndefined(listTypes)) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, ListMembers.selectTargetLists(listTypes)];
                        case 2:
                            targetLists = _a.sent();
                            if (!targetLists || targetLists.length == 0) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, ListMembers.openConfirmCopyToDialog()];
                        case 3:
                            copyConfirmation = _a.sent();
                            if (!copyConfirmation.confirmed) {
                                return [2 /*return*/];
                            }
                            lists = sourceLists.map(function (list) { return { id: list.Id, entityType: list.TypeName }; });
                            return [4 /*yield*/, Marketing.MemberOperations.copyListMembers(lists, targetLists)];
                        case 4:
                            _a.sent();
                            endTime = performance.now();
                            duration = endTime - startTime;
                            Marketing.EMTelemetry.LogInfo(Marketing.TelemetryConstants.MarketingList, "ListMembers", "CopyToList", "Copy the selected marketing lists to add their members to another marketing list.", "Clicked", "Mscrm.CopyListToMarketingList", [
                                {
                                    name: "sourceSelectedListsCount",
                                    value: sourceLists.length
                                },
                                {
                                    name: "sourceSelectedLists",
                                    value: sourceLists.map(function (list) { return list.Id; }).toString()
                                },
                                {
                                    name: "targeSelectedListsCount",
                                    value: targetLists.length
                                },
                                {
                                    name: "targeSelectedLists",
                                    value: targetLists.map(function (list) { return list.id; }).toString()
                                },
                                {
                                    name: "Duration",
                                    value: duration
                                }
                            ], Marketing.LogType.CustomerIntelligence);
                            return [2 /*return*/];
                    }
                });
            });
        };
        ListMembers.getSelectedListTypes = function (gridControl) {
            return __awaiter(this, void 0, void 0, function () {
                var res, index, row, entity, entityType;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            res = [];
                            index = 0;
                            _a.label = 1;
                        case 1:
                            if (!(index < gridControl.getGrid().getSelectedRows().getLength())) return [3 /*break*/, 4];
                            row = gridControl.getGrid().getSelectedRows().get(index);
                            entity = row && row.getData().entity || null;
                            if (!!ClientUtility.DataUtil.isNullOrUndefined(entity)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.getType(entity)];
                        case 2:
                            entityType = _a.sent();
                            res.push(entityType);
                            _a.label = 3;
                        case 3:
                            index++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, res];
                    }
                });
            });
        };
        ListMembers.getType = function (entity) {
            return __awaiter(this, void 0, void 0, function () {
                var createdfromcode, entityId, record;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            createdfromcode = entity.attributes.get('createdfromcode');
                            if (!ClientUtility.DataUtil.isNullOrUndefined(createdfromcode)) return [3 /*break*/, 2];
                            entityId = null;
                            if (ClientUtility.DataUtil.isNullOrUndefined(entity.getId())) {
                                entityId = entity.getEntityReference().id;
                            }
                            else {
                                entityId = entity.getId();
                            }
                            return [4 /*yield*/, Xrm.WebApi.retrieveRecord(Marketing.EntityNames.List, entityId)];
                        case 1:
                            record = _a.sent();
                            return [2 /*return*/, parseInt(record.createdfromcode)];
                        case 2: return [2 /*return*/, parseInt(createdfromcode.getValue())];
                    }
                });
            });
        };
        ListMembers.selectTargetLists = function (listTypes) {
            return __awaiter(this, void 0, void 0, function () {
                var selectTargetListLookupOptions, selectedTargetLists, res_1, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            selectTargetListLookupOptions = __assign({}, Marketing.CommandActions.Instance.getListLookupOptionsForMultipleEntities(listTypes), { defaultViewId: Marketing.ListViewIds.BasicMarketingLists });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Xrm.Utility.lookupObjects(selectTargetListLookupOptions)];
                        case 2:
                            selectedTargetLists = _a.sent();
                            res_1 = [];
                            selectedTargetLists.forEach(function (list) {
                                res_1.push({
                                    id: list.id,
                                    entityType: list.entityType || list.typename
                                });
                            });
                            return [2 /*return*/, res_1];
                        case 3:
                            e_1 = _a.sent();
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ListMembers.openConfirmCopyToDialog = function () {
            return __awaiter(this, void 0, void 0, function () {
                var confirmDialogOptions, confirmDialogStrings;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            confirmDialogOptions = {
                                height: Marketing.DialogSizes.CopyToDialogHeight,
                                width: Marketing.DialogSizes.CopyToDialogWidth,
                            };
                            confirmDialogStrings = {
                                title: Marketing.StringProvider.getResourceString(ListMembers.MAListCopyToConfirmationTitleKey),
                                subtitle: Marketing.StringProvider.getResourceString(ListMembers.MAListCopyToConfirmationSubTitleKey),
                                text: Marketing.StringProvider.getResourceString(ListMembers.MAListCopyToConfirmationBodyKey),
                            };
                            return [4 /*yield*/, Xrm.Navigation.openConfirmDialog(confirmDialogStrings, confirmDialogOptions)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        return ListMembers;
    }());
    ListMembers.MAListCopyToConfirmationTitleKey = "MA.List.CopyTo.Confirmation.Title";
    ListMembers.MAListCopyToConfirmationSubTitleKey = "MA.List.CopyTo.Confirmation.SubTitle";
    ListMembers.MAListCopyToConfirmationBodyKey = "MA.List.CopyTo.Confirmation.Body";
    Marketing.ListMembers = ListMembers;
})(Marketing || (Marketing = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Marketing;
(function (Marketing) {
    var ListCommandAction = (function () {
        /**
         * Creates an instance of ListCommandAction
         * @param listCommands The list commands
         * @param listActions The list actions
         * @param getODataServiceClient The factory method for creating a service client (to defer creation of odata service client until ClientCommon library is loaded in web client)
         */
        function ListCommandAction(listCommands, listActions, getODataServiceClient) {
            var _this = this;
            this.listCommands = listCommands;
            this.listActions = listActions;
            this.getODataServiceClient = getODataServiceClient;
            this.targetListsSubType = "subType=targetLists";
            this.addListToCampaign = function () {
                _this.listCommands.addListToCampaign();
            };
            this.createMiniCampaign = function () {
                _this.listCommands.addQuickCampaignFromSubGrid();
            };
            this.mailMergeList = function () {
                _this.listCommands.mailMergeList();
            };
            this.manageMembersForm = function (form) {
                _this.listCommands.listActionManageMembersForm(form, Xrm.Page.getAttribute("createdfromcode"), Xrm.Page.getAttribute("type"));
            };
            this.copyDynamicListToStatic = function (id) {
                return _this.listCommands.copyDynamicListToStatic(id);
            };
            this.createOpportunityForMembers = function (gridControl) {
                _this.listCommands.createOpportunityForMembers(gridControl);
            };
            this.copyTo = function (gridControl, records, entityTypeCode) {
                _this.listCommands.copyTo(gridControl, records, entityTypeCode);
            };
            this.addToCampaign = function (gridControl, records, entityTypeCode) {
                _this.listCommands.addToCampaign(gridControl, records, entityTypeCode);
            };
            this.addExistingFromSubGridAssociated = function (typeName, gridControl) {
                var entityNameAssociateTo = gridControl.getEntityName();
                var entityNameOfWhatToAssociate = Xrm.Page.data.entity.getEntityName();
                if (entityNameAssociateTo === Marketing.EntityNames.List) {
                    switch (entityNameOfWhatToAssociate) {
                        case Marketing.EntityNames.Campaign: {
                            var relationship = gridControl.getRelationship();
                            if (relationship.name === Marketing.EntityRelationshipNames.ListCampaign) {
                                var functionHandler = Marketing.CampaignCommonLibrary.locAssocCampaign;
                                functionHandler(Marketing.EntityTypeCodes.List, _this.targetListsSubType, relationship.name, relationship.roleType.toString(), Xrm.Page.data.entity.getId(), Marketing.EntityTypeCodes.Campaign, gridControl);
                            }
                            else {
                                XrmCore.Commands.AddFromSubGrid.addExistingFromSubGridAssociated.call(XrmCore.Commands.AddFromSubGrid, typeName, gridControl);
                            }
                            break;
                        }
                        case Marketing.EntityNames.CampaignActivity: {
                            var relationship = gridControl.getRelationship();
                            var functionHandler = Marketing.CampaignActivityCommonLibrary.locAssocObjCampaignActivity;
                            functionHandler(Marketing.EntityTypeCodes.List, _this.targetListsSubType, relationship.name, relationship.roleType.toString(), Xrm.Page.data.entity.getId(), Marketing.EntityTypeCodes.CampaignActivity, gridControl);
                            break;
                        }
                        case Marketing.EntityNames.Contact:
                        case Marketing.EntityNames.Account:
                        case Marketing.EntityNames.Lead: {
                            var entityTypeCode = Xrm.Internal.getEntityCode(Xrm.Page.data.entity.getEntityName());
                            var entities = [{ Id: Xrm.Page.data.entity.getId(), TypeCode: entityTypeCode }];
                            Marketing.CommandActions.Instance.addToList(gridControl, entities, entityTypeCode);
                            break;
                        }
                        default:
                            XrmCore.Commands.AddFromSubGrid.addExistingFromSubGridAssociated.call(XrmCore.Commands.AddFromSubGrid, typeName, gridControl);
                    }
                }
                else {
                    XrmCore.Commands.AddFromSubGrid.addExistingFromSubGridAssociated.call(XrmCore.Commands.AddFromSubGrid, typeName, gridControl);
                }
            };
            this.addMembersUsingLookup = function (listId) {
                var listTypeAttribute = Xrm.Page.getAttribute("type");
                // Execute only for static list
                if (listTypeAttribute && !listTypeAttribute.getValue()) {
                    var targetedRecordType = Marketing.ListUtilities.getListTargetType();
                    var gridControl = Marketing.ListUtilities.getListPageMemberGridByCode(targetedRecordType);
                    if (!gridControl) {
                        _this.reportFailure("addMembersUsingLookup", [
                            { name: "reason", value: "Grid control not found" },
                        ]);
                    }
                    var entityName = Marketing.ClientUtil.getEntityName(targetedRecordType);
                    if (!entityName) {
                        _this.reportFailure("addMembersUsingLookup", [
                            { name: "targetedRecordType", value: targetedRecordType },
                            { name: "reason", value: "Not supported record type" },
                        ]);
                    }
                    _this.addMembers(gridControl, entityName, listId);
                }
                else {
                    _this.reportFailure("addMembersUsingLookup", [
                        { name: "reason", value: "Not supported list type" }
                    ]);
                }
            };
            this.addMembersUsingAdvancedFind = function () {
                var listType = Xrm.Page.getAttribute("createdfromcode").getValue();
                _this.listActions.launchListQualification("lqAdd", listType);
            };
            this.removeMembersUsingAdvancedFind = function () {
                var listType = Xrm.Page.getAttribute("createdfromcode").getValue();
                _this.listActions.launchListQualification("lqRemove", listType);
            };
            this.evaluateMembersUsingAdvancedFind = function () {
                var listType = Xrm.Page.getAttribute("createdfromcode").getValue();
                _this.listActions.launchListQualification("lqKeep", listType);
            };
            this.deleteListFromSubgrid = function (selectedEntityTypeName, selectedControl, firstSelectedItemId, records) {
                window.XrmCore.Commands.Delete.deleteRecords(selectedControl, records, selectedEntityTypeName);
            };
            this.subgridNotInAdvanceFind = function () {
                return !ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data);
            };
            this.disassociateListFromSubGrid = function (selectedEntityTypeName, selectedControl, firstSelectedItemId) { return __awaiter(_this, void 0, void 0, function () {
                var entityNameAssociateTo, relationship, entityNameOfWhatToAssiciate, _a, campaignId, selectedLists, campaignActivityId, selectedLists, selectedItems, filter, odataQuery, lists, lockedLists, i, list;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            entityNameAssociateTo = selectedControl.getEntityName();
                            relationship = selectedControl.getRelationship();
                            entityNameOfWhatToAssiciate = Xrm.Page.data.entity.getEntityName();
                            if (!this.isEnterpriseMarketingListRelationShip(entityNameAssociateTo, relationship.name)) return [3 /*break*/, 9];
                            _a = entityNameOfWhatToAssiciate;
                            switch (_a) {
                                case Marketing.EntityNames.Campaign: return [3 /*break*/, 1];
                                case Marketing.EntityNames.CampaignActivity: return [3 /*break*/, 3];
                                case Marketing.EntityNames.Account: return [3 /*break*/, 5];
                                case Marketing.EntityNames.Contact: return [3 /*break*/, 5];
                                case Marketing.EntityNames.Lead: return [3 /*break*/, 5];
                            }
                            return [3 /*break*/, 7];
                        case 1:
                            campaignId = {
                                id: Xrm.Page.data.entity.getId(),
                                entityType: Marketing.EntityNames.Campaign
                            };
                            selectedLists = selectedControl.getGrid().getSelectedRows().get().map(function (row) { return ({
                                id: row.data.entity.getId(),
                                entityType: Marketing.EntityNames.CampaignItem
                            }); });
                            return [4 /*yield*/, Marketing.Campaign.Instance.disassociateItems(campaignId, selectedLists, relationship.name, Marketing.EntityTypeCodes.List, selectedControl)];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 3:
                            campaignActivityId = {
                                id: Xrm.Page.data.entity.getId(),
                                entityType: Marketing.EntityNames.CampaignActivity
                            };
                            selectedLists = selectedControl.getGrid().getSelectedRows().get().map(function (row) { return ({
                                id: row.data.entity.getId(),
                                entityType: Marketing.EntityNames.CampaignActivityItem
                            }); });
                            return [4 /*yield*/, Marketing.CampaignActivity.Instance.disassociateItems(campaignActivityId, selectedLists, relationship.name, Marketing.EntityTypeCodes.List, selectedControl)];
                        case 4:
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 5:
                            selectedItems = selectedControl.getGrid().getSelectedRows().get();
                            filter = selectedItems.map(function (item) { return "listid eq (" + item.data.entity.getId() + ")"; }).join(" or ");
                            odataQuery = "?$select=listid,listname,lockstatus&$filter=" + filter;
                            return [4 /*yield*/, Xrm.WebApi.online.retrieveMultipleRecords(Marketing.EntityNames.List, odataQuery)];
                        case 6:
                            lists = _b.sent();
                            lockedLists = [];
                            for (i = 0; i < lists.entities.length; i++) {
                                list = lists.entities[i];
                                if (list.lockstatus) {
                                    lockedLists.push(list.listname);
                                }
                            }
                            if (lockedLists.length > 0) {
                                Marketing.ClientUtil.alert(String.format(Marketing.StringProvider.getResourceString(Marketing.CommandActionsConstants.LocalizationKeys.List.Action.ListsLocked), lockedLists.join(", ")));
                            }
                            else {
                                XrmCore.Commands.Disassociate.gridDisassociate.call(XrmCore.Commands.Disassociate, selectedEntityTypeName, selectedControl, firstSelectedItemId);
                            }
                            return [3 /*break*/, 8];
                        case 7:
                            XrmCore.Commands.Disassociate.gridDisassociate.call(XrmCore.Commands.Disassociate, selectedEntityTypeName, selectedControl, firstSelectedItemId);
                            _b.label = 8;
                        case 8: return [3 /*break*/, 10];
                        case 9:
                            XrmCore.Commands.Disassociate.gridDisassociate.call(XrmCore.Commands.Disassociate, selectedEntityTypeName, selectedControl, firstSelectedItemId);
                            _b.label = 10;
                        case 10: return [2 /*return*/];
                    }
                });
            }); };
            this.isACLFormAndOffline = function (gridTypeCode, gridControl) {
                var enable = true;
                if (Xrm.Page.context.client.getClientState() === "Offline") {
                    if (!gridControl) {
                        return false;
                    }
                    var relationshipName = "";
                    var divGridParams = gridControl.getElementById("divGridParams");
                    if (divGridParams && divGridParams.getElementById) {
                        relationshipName = divGridParams.getElementById("relName");
                    }
                    if (gridTypeCode === Marketing.EntityTypeCodes.List) {
                        switch (relationshipName) {
                            case "listlead_association":
                            case "listcontact_association":
                            case "listaccount_association":
                                enable = false;
                                break;
                            default:
                                break;
                        }
                    }
                }
                return enable;
            };
            this.isAccountOrContactMemberType = function (objectTypeCode) {
                var listMemberTypeAttribute = Xrm.Page.getAttribute("createdfromcode");
                if (!listMemberTypeAttribute) {
                    return false;
                }
                var listMemberType = !objectTypeCode ? listMemberTypeAttribute.getValue() : objectTypeCode;
                if (listMemberType === Marketing.EntityTypeCodes.Account || listMemberType === Marketing.EntityTypeCodes.Contact) {
                    return true;
                }
                return false;
            };
            this.addMembers = function (gridControl, entityTypeName, objectId) { return __awaiter(_this, void 0, void 0, function () {
                var values, members, startTime, endTime, duration;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Xrm.Utility.lookupObjects({
                                allowMultiSelect: true,
                                defaultEntityType: entityTypeName,
                                entityTypes: [entityTypeName],
                                disableMru: true,
                                showNew: true,
                                filters: []
                            })];
                        case 1:
                            values = _a.sent();
                            members = this.map(values, function (value) {
                                return {
                                    id: value.id,
                                    entityType: entityTypeName
                                };
                            });
                            startTime = performance.now();
                            return [4 /*yield*/, Marketing.MemberOperations.addListMembers([objectId], members, entityTypeName)];
                        case 2:
                            _a.sent();
                            gridControl.refresh();
                            endTime = performance.now();
                            duration = endTime - startTime;
                            Marketing.EMTelemetry.LogInfo(Marketing.TelemetryConstants.ManageMembers, "ListCommandAction", "AddMembers", "Add members to marketing list using lookup", "Clicked", "Mscrm.AddUsingLookup", [
                                {
                                    name: "ListId",
                                    value: objectId
                                },
                                {
                                    name: "MembersType",
                                    value: entityTypeName
                                },
                                {
                                    name: "MembersCount",
                                    value: members.length
                                },
                                {
                                    name: "Duration",
                                    value: duration
                                }
                            ], Marketing.LogType.CustomerIntelligence);
                            return [2 /*return*/];
                    }
                });
            }); };
            this.removeMembers = function (gridControl, recordIds, entityTypeName, objectId) { return __awaiter(_this, void 0, void 0, function () {
                var entityId, listFetchXmlResultsViewerTemplate, targetedRecordTypeCode, memberType_1, members;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(recordIds && recordIds.length > 0)) return [3 /*break*/, 2];
                            entityId = objectId.slice(1, -1);
                            listFetchXmlResultsViewerTemplate = new Marketing.ListFetchXmlResultsViewerTemplate();
                            targetedRecordTypeCode = Marketing.ListUtilities.getListTargetType();
                            memberType_1 = listFetchXmlResultsViewerTemplate.getEntityTypeGivenListMemberType(targetedRecordTypeCode);
                            members = this.map(recordIds, function (id) {
                                return {
                                    id: id,
                                    entityType: memberType_1
                                };
                            });
                            return [4 /*yield*/, Marketing.MemberOperations.removeListMembers([entityId], members, memberType_1)];
                        case 1:
                            _a.sent();
                            gridControl.refresh();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); };
            this.manageMembers = function (gridControl, records, entityTypeCode, objectId, form) {
                var typeAttribute = Xrm.Page.getAttribute("type");
                if (typeAttribute.getValue()) {
                    _this.listActions.openDynamicListQuery(entityTypeCode);
                }
                else {
                    _this.listActions.openManageMembersWizard(entityTypeCode, objectId, null, 440, 450);
                }
            };
            this.copyListMembers = function (gridControl, records, entityTypeCode, objectId) { return __awaiter(_this, void 0, void 0, function () {
                var listId, entityTypeName, values, marketingList, membersWithIds;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            listId = Xrm.Page.data.entity.getId();
                            entityTypeName = Marketing.ClientUtil.getEntityName(entityTypeCode);
                            return [4 /*yield*/, Xrm.Utility.lookupObjects(this.getListLookupOptions(entityTypeCode, listId))];
                        case 1:
                            values = _a.sent();
                            if (ClientUtility.DataUtil.isNullOrUndefined(values) || values.length === 0) {
                                return [2 /*return*/];
                            }
                            marketingList = values[0];
                            membersWithIds = records.map(function (item) { return ({ id: item.Id, entityType: Marketing.EntityNames.ListMember }); });
                            return [4 /*yield*/, Marketing.MemberOperations.addListMembers([marketingList.id], membersWithIds, entityTypeName)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); };
            this.getListLookupOptions = function (entityTypeCode, listId) {
                var lookupTypes = [Marketing.EntityNames.List];
                return {
                    allowMultiSelect: false,
                    entityTypes: lookupTypes,
                    disableMru: true,
                    defaultEntityType: Marketing.EntityNames.List,
                    showNew: true,
                    showProperties: true,
                    filters: [
                        {
                            filterXml: "<filter type='and'>" +
                                ("<condition attribute='membertype' operator='eq' value='" + entityTypeCode + "' />") +
                                "<condition attribute='type' operator='eq' value='false' />" +
                                "<condition attribute='lockstatus' operator='eq' value='false' />" +
                                ("<condition attribute='listid' operator='neq' value='" + listId + "' />") +
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
            this.addExistingMemberFromSubGridAssociated = function (gridTypeCode, gridControl) {
                _this.listCommands.locAssocObjMember(gridTypeCode, null, null);
            };
            this.addToCampaignCommand = function (gridControl, records, entityTypeCode) {
                var actionName = "addtocampaign";
                var lookupOptions = new Xrm.LookupOptions;
                var lookupTypes = [Marketing.EntityNames.Campaign];
                lookupOptions.lookupStyle = Xrm.LookupStyle.single;
                lookupOptions.lookupTypes = lookupTypes;
                lookupOptions.showNew = true;
                lookupOptions.showProperties = true;
                Xrm.Utility.lookupObjects(lookupOptions).then(function (lookupItems) {
                    var windowWidth = 400;
                    var windowHeight = 250;
                    if (ClientUtility.DataUtil.isNullOrUndefined(lookupItems) || lookupItems.length === 0) {
                        return;
                    }
                    var itemObjectId = lookupItems[0].id;
                    var itemObjectTypeCode = lookupItems[0].type.toString();
                    var actionUri = Mscrm.InternalUtilities.GridUtilities.generateStandardActionUri(actionName, entityTypeCode, records.length);
                    actionUri.get_query()["itemObjectId"] = itemObjectId;
                    actionUri.get_query()["itemObjectTypeCode"] = itemObjectTypeCode;
                    Mscrm.InternalUtilities.GridUtilities.executeStandardAction(actionUri, records, windowWidth, windowHeight, null);
                });
            };
            this.copyToListAction = function (lookupItems, iObjType, a, sIds, iX, iY, sCustParams) {
                if (lookupItems && lookupItems.items.length > 0) {
                    var itemObjectId = lookupItems.items[0].id;
                    var itemObjectTypeCode = lookupItems.items[0].type;
                    var crmDialog = new Mscrm.CrmDialog(Mscrm.CrmUri.create("/_grid/cmds/dlg_addtolist.aspx?iObjType=" + CrmEncodeDecode.CrmUrlEncode(iObjType) + "&autoTrigger=1" + "&iTotal=" + CrmEncodeDecode.CrmUrlEncode(a.length) + "&sIds=" + CrmEncodeDecode.CrmUrlEncode(sIds) + sCustParams + "&itemObjectId=" + CrmEncodeDecode.CrmUrlEncode(itemObjectId) + "&itemObjectTypeCode=" + CrmEncodeDecode.CrmUrlEncode(itemObjectTypeCode)), a, iX, iY, null);
                    return crmDialog.show();
                }
                return null;
            };
            this.exportAllMembersStaticXlsx = function () {
                var queryAttribute = Xrm.Page.getAttribute("query");
                if (!queryAttribute) {
                    _this.reportFailure("exportAllMembersStaticXlsx", [
                        { name: "error", value: "Failed to export because required field Query is missing on the page." }
                    ]);
                    return;
                }
                var targetedRecordTypeCode = Marketing.ListUtilities.getListTargetType();
                if (targetedRecordTypeCode == Marketing.EntityTypeCodes.None) {
                    _this.reportFailure("exportAllMembersStaticXlsx", [
                        { name: "error", value: "Failed to export because targetedRecordTypeCode could not be determined." }
                    ]);
                    return;
                }
                var listExportCommand = new Marketing.ListExportCommand(Xrm, XrmCore);
                listExportCommand.exportAllMembersStaticXlsx(queryAttribute.getValue(), Marketing.ListUtilities.getListTargetType());
            };
            this.gridDisassociateListMember = function (typeName, gridControl, firstSelectedItemId) {
                var lockStatus = Xrm.Page.data.entity.attributes.get("lockstatus");
                if (!ClientUtility.DataUtil.isNull(lockStatus) && lockStatus.getValue()) {
                    Marketing.ClientUtil.openAlertDialog({
                        text: Marketing.StringProvider.getResourceString("List_Action_ListLocked")
                    });
                }
                else if (!_this.listCommands.isListStatic()) {
                    Marketing.ClientUtil.openAlertDialog({
                        text: Marketing.StringProvider.getResourceString("List_Action_ListDynamic")
                    });
                }
                else {
                    XrmCore.Commands.Disassociate.gridDisassociate(typeName, gridControl, firstSelectedItemId);
                }
            };
        }
        ListCommandAction.prototype.getSafeFunction = function (functionName) {
            return window[functionName] || window.parent[functionName];
        };
        ;
        ListCommandAction.prototype.addExistingFromSubGrid = function (gridTypeName, gridControl) {
            return __awaiter(this, void 0, void 0, function () {
                var relationshipName, pageEntityName, values, targetTeam, request;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!ClientUtility.ClientUtil.isUCI()) {
                                return [2 /*return*/, XrmCore.Commands.AddFromSubGrid.addExistingFromSubGridStandard(gridTypeName, gridControl)];
                            }
                            relationshipName = gridControl.getRelationship().name;
                            pageEntityName = Xrm.Page.data.entity.getEntityName();
                            return [4 /*yield*/, Xrm.Utility.lookupObjects({
                                    allowMultiSelect: true,
                                    defaultEntityType: Marketing.EntityNames.List,
                                    entityTypes: [Marketing.EntityNames.List],
                                    disableMru: false,
                                    showNew: false,
                                    filters: []
                                })];
                        case 1:
                            values = _a.sent();
                            if (!values || !values.length) {
                                return [2 /*return*/];
                            }
                            targetTeam = {
                                id: String(Xrm.Page.data.entity.getId()),
                                name: "",
                                entityType: pageEntityName
                            };
                            request = new ODataContract.ODataAssociateRequest(targetTeam, relationshipName, values);
                            return [4 /*yield*/, Xrm.WebApi.online.execute(request)
                                    .catch(function (err) {
                                    Xrm.Utility.alertDialog(err.message);
                                })];
                        case 2:
                            _a.sent();
                            gridControl.refresh();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ListCommandAction.prototype.isEnterpriseMarketingListRelationShip = function (entityNameAssociateTo, relationshipName) {
            return entityNameAssociateTo === Marketing.EntityNames.List && ClientUtility.ClientUtil.isUCI() && Marketing.EntityRelationshipNames.EnterpriseMarketingListRelationships.indexOf(relationshipName) !== -1;
        };
        /*
         * WebClient as an issue on IE.
         * The polyfill for map for arrays returned by lookup is freed when returning.
         * So this implementation has to be used until WebClient support is droped.
         */
        ListCommandAction.prototype.map = function (array, mapper) {
            var result = [];
            for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                var element = array_1[_i];
                result.push(mapper(element));
            }
            return result;
        };
        ListCommandAction.prototype.copyToList = function (gridControl, sourceLists) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Marketing.ListMembers.copyToList(gridControl, sourceLists)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ListCommandAction.getSelected = function (sGridName) {
            var targetGrid = window.$find(sGridName);
            var selectedRecords;
            var index;
            if (targetGrid.get_innerGrid && typeof targetGrid.get_innerGrid === "function") {
                var innerGrid = targetGrid.get_innerGrid();
                if (innerGrid) {
                    selectedRecords = innerGrid.get_selectedRecords();
                    var backCompatArray = new Array(selectedRecords.length);
                    for (index = 0; index < selectedRecords.length; index++) {
                        backCompatArray[index] = selectedRecords[index][0];
                    }
                    return backCompatArray;
                }
            }
            selectedRecords = targetGrid.get_selectedRecords();
            var idArray = new Array(selectedRecords.length);
            for (index = 0; index < selectedRecords.length; index++) {
                idArray[index] = selectedRecords[index].Id;
            }
            return idArray;
        };
        ;
        ListCommandAction.prototype.reportFailure = function (methodName, parameters) {
            Xrm.Reporting.reportFailure("marketing", new Error("EnterpriseMarketing-Marketing.ListCommandAction." + methodName), "", parameters);
        };
        return ListCommandAction;
    }());
    ListCommandAction.iX = 400;
    ListCommandAction.iY = 200;
    Marketing.ListCommandAction = ListCommandAction;
})(Marketing || (Marketing = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Marketing;
(function (Marketing) {
    var ListLibrary = (function () {
        function ListLibrary(listCommands) {
            var _this = this;
            this.listTypeOnChange = function () {
                _this.listCommands.disableLockStatus();
            };
            this.createdFromCodeOnChange = function () {
                _this.listCommands.setVisibleSubGrid();
            };
            this.formOnLoad = function () {
                _this.listCommands.validateForm();
                Xrm.Page.data.addOnLoad(_this.listCommands.initialize);
                _this.listCommands.disableLockStatus();
            };
            this.lockStatusOnChange = function () {
                _this.listCommands.refreshMembersGridRibbon();
                _this.listCommands.refreshRibbon();
            };
            this.listCommands = listCommands;
        }
        return ListLibrary;
    }());
    Marketing.ListLibrary = ListLibrary;
})(Marketing || (Marketing = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Marketing;
(function (Marketing) {
    var CopyDynamicToStaticDialog = (function () {
        function CopyDynamicToStaticDialog() {
        }
        CopyDynamicToStaticDialog.prototype.onOkClicked = function () {
            return __awaiter(this, void 0, void 0, function () {
                var notificationObj, id;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Marketing.DialogUtil.closeDialog();
                            Xrm.Utility.showProgressIndicator("");
                            notificationObj = {
                                type: 1,
                                level: 4,
                                message: ClientUtility.StringUtil.format(Marketing.StringProvider.getResourceString("MA.List.CopyToStatic.ProcessingMessage")),
                                showCloseButton: true
                            };
                            window.Xrm.App.addGlobalNotification(notificationObj);
                            id = ClientUtility.PageUtil.getDataAttributeValue("entity_id");
                            return [4 /*yield*/, Marketing.ListCommands.copyDynamicListToStaticCallback(true, id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return CopyDynamicToStaticDialog;
    }());
    Marketing.CopyDynamicToStaticDialog = CopyDynamicToStaticDialog;
})(Marketing || (Marketing = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Marketing;
(function (Marketing) {
    var CreateOpportunitiesDialog = (function () {
        function CreateOpportunitiesDialog() {
        }
        CreateOpportunitiesDialog.prototype.createOpportunities = function () {
            return __awaiter(this, void 0, void 0, function () {
                var startTime, validationResult, memberType, membersArray, topic, contact, account, budgetAmount, estimatedRevenue, estimatedCloseDate, customerNeed, formValues, responses, _i, membersArray_1, id, entity, promisesArray, valueArray, schemaNameArray, i, logicalName, schemaName, value, response, i, endTime, duration, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 7, , 8]);
                            startTime = performance.now();
                            return [4 /*yield*/, this.validateActivity()];
                        case 1:
                            validationResult = _a.sent();
                            if (!validationResult.valid) {
                                return [2 /*return*/, Marketing.ClientUtil.alert(validationResult.messages)];
                            }
                            Xrm.Utility.showProgressIndicator("");
                            memberType = ClientUtility.PageUtil.getDataAttributeValue(Marketing.ConvertToOpportunityDialogParameters.MemberType);
                            membersArray = ClientUtility.PageUtil.getDataAttributeValue(Marketing.ConvertToOpportunityDialogParameters.MembersArray);
                            topic = ClientUtility.PageUtil.getDataAttributeValue(Marketing.ConvertToOpportunityDialogParameters.Topic);
                            contact = ClientUtility.PageUtil.getDataAttributeValue(Marketing.ConvertToOpportunityDialogParameters.ContactId);
                            account = ClientUtility.PageUtil.getDataAttributeValue(Marketing.ConvertToOpportunityDialogParameters.AccountId);
                            budgetAmount = ClientUtility.PageUtil.getDataAttributeValue(Marketing.ConvertToOpportunityDialogParameters.BudgetAmount);
                            estimatedRevenue = ClientUtility.PageUtil.getDataAttributeValue(Marketing.ConvertToOpportunityDialogParameters.EstimatedRevenue);
                            estimatedCloseDate = ClientUtility.PageUtil.getDataAttributeValue(Marketing.ConvertToOpportunityDialogParameters.EstimatedCloseDate);
                            customerNeed = ClientUtility.PageUtil.getDataAttributeValue(Marketing.ConvertToOpportunityDialogParameters.CustomerNeed);
                            formValues = JSON.parse(ClientUtility.PageUtil.getDataAttributeValue(Marketing.ConvertToOpportunityDialogParameters.FormValues));
                            responses = [];
                            _i = 0, membersArray_1 = membersArray;
                            _a.label = 2;
                        case 2:
                            if (!(_i < membersArray_1.length)) return [3 /*break*/, 5];
                            id = membersArray_1[_i];
                            entity = {};
                            entity[Marketing.OpportunityEntityFieldNames.Name] = topic;
                            if (estimatedCloseDate) {
                                entity[Marketing.OpportunityEntityFieldNames.EstimatedCloseDate] = Marketing.DateHelper.convertToEdmDateFormat(estimatedCloseDate);
                            }
                            entity[Marketing.OpportunityEntityFieldNames.BudgetAmmount] = budgetAmount;
                            entity[Marketing.OpportunityEntityFieldNames.EstimatedValue] = estimatedRevenue;
                            entity[Marketing.OpportunityEntityFieldNames.CustomerNeed] = customerNeed;
                            if (memberType === Marketing.EntityTypeCodes.Contact) {
                                entity["" + Marketing.OpportunityEntityFieldNames.ParentContactId + Marketing.OData.Bind] = "/" + Marketing.EntityNamesPluralized.Contacts + "(" + ClientUtility.Guid.create(id) + ")";
                                if (account) {
                                    entity["" + Marketing.OpportunityEntityFieldNames.ParentAccountId + Marketing.OData.Bind] = "/" + Marketing.EntityNamesPluralized.Accounts + "(" + ClientUtility.Guid.create(account[0].id) + ")";
                                }
                            }
                            else {
                                entity["" + Marketing.OpportunityEntityFieldNames.ParentAccountId + Marketing.OData.Bind] = "/" + Marketing.EntityNamesPluralized.Accounts + "(" + ClientUtility.Guid.create(id) + ")";
                                if (contact) {
                                    entity["" + Marketing.OpportunityEntityFieldNames.ParentContactId + Marketing.OData.Bind] = "/" + Marketing.EntityNamesPluralized.Contacts + "(" + ClientUtility.Guid.create(contact[0].id) + ")";
                                }
                            }
                            promisesArray = [];
                            valueArray = [];
                            schemaNameArray = [];
                            if (formValues && formValues.length > 0) {
                                for (i = 0; i < formValues.length; i++) {
                                    logicalName = formValues[i].logicalName;
                                    schemaName = !ClientUtility.DataUtil.isNullOrEmptyString(formValues[i].schemaName) ? formValues[i].schemaName : "";
                                    value = formValues[i].value;
                                    if (!ClientUtility.DataUtil.isNullOrEmptyString(value)) {
                                        if (typeof (value) === "object") {
                                            if (value.length > 0) {
                                                promisesArray.push(Xrm.Utility.getEntityMetadata(value[0]._etn));
                                                valueArray.push(value);
                                                schemaNameArray.push(schemaName);
                                            }
                                        }
                                        else {
                                            entity[logicalName] = value;
                                        }
                                    }
                                }
                            }
                            return [4 /*yield*/, Promise.all(promisesArray)];
                        case 3:
                            response = _a.sent();
                            for (i = 0; i < response.length; i++) {
                                entity[schemaNameArray[i] + "@odata.bind"] = "/" + response[i]._entitySetName + "(" + valueArray[i][0]._id + ")";
                                entity[schemaNameArray[i] + "@OData.Community.Display.V1.FormattedValue"] = "" + valueArray[i][0]._name;
                            }
                            responses.push(Xrm.WebApi.online.createRecord(Marketing.EntityNames.Opportunity, entity));
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [4 /*yield*/, Promise.all(responses)];
                        case 6:
                            _a.sent();
                            Xrm.Utility.closeProgressIndicator();
                            Marketing.DialogUtil.closeDialog();
                            endTime = performance.now();
                            duration = endTime - startTime;
                            Marketing.EMTelemetry.LogInfo(Marketing.TelemetryConstants.CreateOpportunity, "CreateOpportunitiesDialog", "createOpportunities", "Create an opportunit for marketing list members", "Clicked", "Mscrm.CreateOpportunityForMembers", [
                                {
                                    name: "MembersType",
                                    value: memberType
                                },
                                {
                                    name: "MembersCount",
                                    value: membersArray.length
                                },
                                {
                                    name: "Duration",
                                    value: duration
                                }
                            ], Marketing.LogType.CustomerIntelligence);
                            return [3 /*break*/, 8];
                        case 7:
                            error_1 = _a.sent();
                            ClientUtility.ActionFailedHandler.actionFailedCallback(error_1);
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        CreateOpportunitiesDialog.prototype.validateActivity = function () {
            return __awaiter(this, void 0, void 0, function () {
                var messages, topic, controlMessages;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            messages = [];
                            topic = ClientUtility.PageUtil.getDataAttributeValue(Marketing.ConvertToOpportunityDialogParameters.Topic);
                            if (ClientUtility.DataUtil.isNullOrWhiteSpace(topic)) {
                                messages.push(Marketing.StringProvider.getResourceString(CreateOpportunitiesDialog.TopicRequired));
                            }
                            return [4 /*yield*/, Marketing.ClientUtil.validateActivity(Marketing.EntityTypeCodes.Opportunity)];
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
        return CreateOpportunitiesDialog;
    }());
    CreateOpportunitiesDialog.TopicRequired = "MA.Activity.TopicRequired";
    Marketing.CreateOpportunitiesDialog = CreateOpportunitiesDialog;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var ManageListBase = (function () {
        function ManageListBase() {
        }
        ManageListBase.prototype.getAttributeValue = function (attributeName) {
            return Xrm.Page.data.attributes.get(attributeName).getValue();
        };
        ManageListBase.prototype.setAttributeValue = function (attributeName, value) {
            Xrm.Page.data.attributes.get(attributeName).setValue(value);
        };
        ManageListBase.prototype.getListId = function () {
            return this.getAttributeValue(ManageListBase.EntityId);
        };
        ManageListBase.prototype.getListMemberName = function () {
            return this.getAttributeValue(ManageListBase.ParamQueryEntityType);
        };
        ManageListBase.prototype.getListMemberType = function () {
            return Marketing.List.ListFetchXmlResultsViewerTemplate.GetListMemberTypeGivenListMemberName(this.getListMemberName());
        };
        ManageListBase.prototype.getFetchXml = function () {
            return this.getAttributeValue(ManageListBase.ParamFetchXml);
        };
        ManageListBase.prototype.setFetchXml = function (fetchXml) {
            this.setAttributeValue(ManageListBase.ParamFetchXml, fetchXml);
        };
        ManageListBase.prototype.getIsValid = function () {
            return this.getAttributeValue(ManageListBase.ParamIsValid);
        };
        ManageListBase.prototype.getLookForEntityControl = function () {
            return Xrm.Page.getControl(ManageListBase.LookForEntityId);
        };
        ManageListBase.prototype.getSavedQueryControl = function () {
            return Xrm.Page.getControl(ManageListBase.SavedQueryId);
        };
        ManageListBase.prototype.getInvokeType = function () {
            return this.getAttributeValue(ManageListBase.ParamInvokeType);
        };
        ManageListBase.prototype.getParamLayoutXml = function () {
            return this.getAttributeValue(ManageListBase.ParamLayoutXml);
        };
        ManageListBase.prototype.setParamLayoutXml = function (LayoutXml) {
            this.setAttributeValue(ManageListBase.ParamLayoutXml, LayoutXml);
        };
        ManageListBase.prototype.getParamFetchXml = function () {
            return this.getAttributeValue(ManageListBase.ParamFetchXml);
        };
        ManageListBase.prototype.setParamFetchXml = function (fetchXml) {
            this.setAttributeValue(ManageListBase.ParamFetchXml, fetchXml);
        };
        ManageListBase.prototype.getLookForEntity = function () {
            return this.getAttributeValue(ManageListBase.LookForEntityId);
        };
        ManageListBase.prototype.setLookForEntity = function (value) {
            this.setAttributeValue(ManageListBase.LookForEntityId, value);
        };
        ManageListBase.prototype.getQueryEntityType = function () {
            return this.getAttributeValue(ManageListBase.ParamQueryEntityType);
        };
        ManageListBase.prototype.getSavedQueryId = function () {
            return this.getAttributeValue(ManageListBase.SavedQueryId);
        };
        return ManageListBase;
    }());
    ManageListBase.FetchXml = "fetchxml";
    ManageListBase.LayoutXml = "layoutxml";
    ManageListBase.ContactsUCIPopup = "contactsUCIPopup";
    ManageListBase.QueryEditorUC = "queryeditor_uc";
    ManageListBase.LookForEntityId = "look_for_entity_id";
    ManageListBase.SavedQueryId = "saved_query_id";
    ManageListBase.NextId = "next_id";
    ManageListBase.BackId = "back_id";
    ManageListBase.LqUseQueryId = "lqUseQuery_id";
    ManageListBase.ParamQueryEntityType = "param_query_entity_type";
    ManageListBase.ParamFetchXml = "param_fetch_xml";
    ManageListBase.ParamCanceled = "param_canceled";
    ManageListBase.ParamIsValid = "param_isvalid";
    ManageListBase.ParamValidationErrorMessage = "param_validationerrormessage";
    ManageListBase.SavedQueries = "savedqueries";
    ManageListBase.UserQueries = "userqueries";
    ManageListBase.ParamLayoutXml = "param_layout_xml";
    ManageListBase.ParamSelectedRecords = "param_selected_records";
    ManageListBase.EntityId = "entity_id";
    ManageListBase.ParamInvokeType = "param_invoke_type";
    ManageListBase.SubheaderId = "subheader_id";
    ManageListBase.HeaderId = "header_id";
    ManageListBase.Account = "account";
    ManageListBase.Contact = "contact";
    ManageListBase.Lead = "lead";
    ManageListBase.AccountStringResource = "MA.Generic.Account";
    ManageListBase.ContactStringResource = "MA.Generic.Contact";
    ManageListBase.LeadStringResource = "MA.Generic.Lead";
    ManageListBase.RowCount = "row_count";
    ManageListBase.MustSelectRecords = "MA.List.MustSelectRecords";
    Marketing.ManageListBase = ManageListBase;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var ManageStaticListDialog = (function (_super) {
        __extends(ManageStaticListDialog, _super);
        function ManageStaticListDialog() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.ENTITY_NAME = "list";
            _this.GENERIC_REMOVE_LABEL = "MA.Generic.Remove.Title";
            _this.GENERIC_ADD_LABEL = "MA.Generic.Add.Title";
            _this.GENERIC_EVALUATE_LABEL = "MA.Generic.Evaluate.Title";
            _this.LIST_REMOVE_SUB_LABEL = "MA.List.Manage.Remove.SubLabel";
            _this.LIST_ADD_SUB_LABEL = "MA.List.Manage.Add.SubLabel";
            _this.LIST_EVALUATE_SUB_LABEL = "MA.List.Manage.Evaluate.SubLabel";
            _this.needMoreTime = false;
            _this.timeout = 9000;
            _this.labels = ["lqAdd", "lqRemove", "lqKeep"];
            _this.fetchColumnNames = ["name", "fetchxml", "layoutxml"];
            _this.promiseTimeout = function (ms, promise) { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                var timeout;
                return __generator(this, function (_a) {
                    timeout = new Promise(function (resolve, reject) {
                        var id = setTimeout(function () {
                            clearTimeout(id);
                            _this.needMoreTime = true;
                            //TODO: log telemetry
                            resolve("");
                        }, ms);
                    });
                    // Returns a race between our timeout and the passed in promise
                    return [2 /*return*/, Promise.race([
                            promise,
                            timeout
                        ])];
                });
            }); };
            return _this;
        }
        ManageStaticListDialog.prototype.next = function () {
            var isQueryValid = Xrm.Page.data.attributes.get(Marketing.ManageListBase.ParamIsValid).getValue();
            var validationErrorMessage = Xrm.Page.data.attributes.get(Marketing.ManageListBase.ParamValidationErrorMessage).getValue();
            if (!isQueryValid) {
                Marketing.ClientUtil.openAlertDialog({ text: validationErrorMessage });
                return;
            }
            if (!ClientUtility.DataUtil.isNullOrUndefined(this.getLookForEntity())) {
                if (this.isRemove() || this.isKeep()) {
                    var enrichedFetchXml = Marketing.List.QueryBuilderHelper.IncludeFilterList(this.getFetchXml(), this.getListId(), this.getListMemberName());
                    this.setFetchXml(enrichedFetchXml);
                }
                Xrm.Page.ui.moveTo("confirm_tab");
                var isManageMembersGridAlignmentEnabled = !(Xrm.Utility.getGlobalContext().getFeatureControlSetting("SalesService.EnterpriseMarketing", "DisableWindowEventsForManageMembersGridAlignment"));
                isManageMembersGridAlignmentEnabled && setTimeout(function () {
                    var event = new CustomEvent('MarketingFetchXmlViewerEvent', {
                        detail: { message: 'MarketingFetchXmlViewerEvent' }
                    });
                    window && window.top && window.top.dispatchEvent(event);
                }, 1000);
            }
        };
        ManageStaticListDialog.prototype.back = function () {
            if (this.isRemove() || this.isKeep()) {
                var enrichedFetchXml = Marketing.List.QueryBuilderHelper.RemoveFilterList(this.getFetchXml(), this.getListId(), this.getListMemberName());
                this.setFetchXml(enrichedFetchXml);
            }
            Xrm.Page.ui.moveTo("query_tab");
        };
        ManageStaticListDialog.prototype.addAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                var startTime, entityIdAttribute, entityId, fetchXmlAttribute, fetchXml, endTime, duration;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            startTime = performance.now();
                            entityIdAttribute = Xrm.Page.data.attributes.get(Marketing.ManageListBase.EntityId);
                            entityId = entityIdAttribute.getValue().slice(1, -1);
                            this.needMoreTime = false;
                            fetchXmlAttribute = Xrm.Page.data.attributes.get(Marketing.ManageListBase.ParamFetchXml);
                            fetchXml = fetchXmlAttribute.getValue();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, , 3, 4]);
                            return [4 /*yield*/, this.promiseTimeout(this.timeout, Marketing.MemberOperations.addListMembersByFetchXml(entityId, fetchXml, new Marketing.ODataServiceClient()))];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            this.showNotificationAndfinalizeDialog();
                            endTime = performance.now();
                            duration = endTime - startTime;
                            Marketing.EMTelemetry.LogInfo(Marketing.TelemetryConstants.ManageMembers, "ManageStaticListDialog", "addAll", "Add members to marketing list using Advance find", "Clicked", "Mscrm.AddUsingAdvancedFind", [
                                {
                                    name: "ListId",
                                    value: entityId
                                },
                                {
                                    name: "MembersType",
                                    value: this.getListMemberName()
                                },
                                {
                                    name: "Duration",
                                    value: duration
                                }
                            ], Marketing.LogType.CustomerIntelligence);
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ManageStaticListDialog.prototype.showNotificationAndfinalizeDialog = function () {
            var _this = this;
            if (this.needMoreTime) {
                setTimeout(function () {
                    var notificationObj = {
                        type: 1,
                        level: 4,
                        message: "The action is being processed, please wait for a minute and refresh the grid.",
                        showCloseButton: true
                    };
                    window.Xrm.App.addGlobalNotification(notificationObj);
                    _this.finalizeDialog();
                }, 10000);
            }
            else {
                this.finalizeDialog();
            }
        };
        ManageStaticListDialog.prototype.validSelected = function () {
            var selectedRecordsAttribute = Xrm.Page.data.attributes.get(Marketing.ManageListBase.ParamSelectedRecords);
            var selectedRecordsString = selectedRecordsAttribute.getValue();
            if (selectedRecordsString && selectedRecordsString !== "") {
                var selectedRecords = JSON.parse(selectedRecordsString);
                return selectedRecords.length > 0;
            }
            return false;
        };
        ManageStaticListDialog.prototype.showInvalidSelectedMessage = function () {
            Marketing.ClientUtil.openAlertDialog({ text: Marketing.StringProvider.getResourceString(Marketing.ManageListBase.MustSelectRecords) });
        };
        ManageStaticListDialog.prototype.addSelected = function () {
            return __awaiter(this, void 0, void 0, function () {
                var startTime, entityIdAttribute, entityId, selectedRecordsAttribute, selectedRecordsString, selectedRecords, memberType_2, members, endTime, duration;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            startTime = performance.now();
                            if (!this.validSelected()) {
                                this.showInvalidSelectedMessage();
                                return [2 /*return*/];
                            }
                            entityIdAttribute = Xrm.Page.data.attributes.get(Marketing.ManageListBase.EntityId);
                            entityId = entityIdAttribute.getValue().slice(1, -1);
                            selectedRecordsAttribute = Xrm.Page.data.attributes.get(Marketing.ManageListBase.ParamSelectedRecords);
                            selectedRecordsString = selectedRecordsAttribute.getValue();
                            if (!(selectedRecordsString && selectedRecordsString !== "")) return [3 /*break*/, 5];
                            selectedRecords = JSON.parse(selectedRecordsString);
                            memberType_2 = this.getQueryEntityType();
                            members = selectedRecords.map(function (record) {
                                return {
                                    id: record.Id,
                                    entityType: memberType_2
                                };
                            });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, , 3, 4]);
                            return [4 /*yield*/, Marketing.MemberOperations.addListMembers([entityId], members, memberType_2)];
                        case 2:
                            _a.sent();
                            endTime = performance.now();
                            duration = endTime - startTime;
                            Marketing.EMTelemetry.LogInfo(Marketing.TelemetryConstants.ManageMembers, "ManageStaticListDialog.ts", "addSelected", "Add members to marketing list using Advance find", "Clicked", "Mscrm.AddUsingAdvancedFind", [
                                {
                                    name: "ListId",
                                    value: entityId
                                },
                                {
                                    name: "MembersType",
                                    value: memberType_2
                                },
                                {
                                    name: "MembersCount",
                                    value: members.length
                                },
                                {
                                    name: "Duration",
                                    value: duration
                                }
                            ], Marketing.LogType.CustomerIntelligence);
                            return [3 /*break*/, 4];
                        case 3:
                            this.finalizeDialog();
                            return [7 /*endfinally*/];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            this.finalizeDialog();
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        ManageStaticListDialog.prototype.removeSelected = function () {
            return __awaiter(this, void 0, void 0, function () {
                var startTime, entityIdAttribute, entityId, selectedRecordsAttribute, selectedRecordsString, selectedRecords, memberType, members, endTime, duration;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            startTime = performance.now();
                            if (!this.validSelected()) {
                                this.showInvalidSelectedMessage();
                                return [2 /*return*/];
                            }
                            entityIdAttribute = Xrm.Page.data.attributes.get(Marketing.ManageListBase.EntityId);
                            entityId = entityIdAttribute.getValue().slice(1, -1);
                            selectedRecordsAttribute = Xrm.Page.data.attributes.get(Marketing.ManageListBase.ParamSelectedRecords);
                            selectedRecordsString = selectedRecordsAttribute.getValue();
                            selectedRecords = JSON.parse(selectedRecordsString);
                            memberType = this.getQueryEntityType();
                            members = selectedRecords.map(function (record) {
                                return {
                                    id: record.Id,
                                    entityType: memberType
                                };
                            });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, , 3, 4]);
                            return [4 /*yield*/, Marketing.MemberOperations.removeListMembers([entityId], members, memberType)];
                        case 2:
                            _a.sent();
                            endTime = performance.now();
                            duration = endTime - startTime;
                            Marketing.EMTelemetry.LogInfo(Marketing.TelemetryConstants.ManageMembers, "ManageStaticListDialog.ts", "removeSelected", "Remove members to marketing list using Advance find", "Clicked", "Mscrm.RemoveUsingAdvancedFind", [
                                {
                                    name: "ListId",
                                    value: entityId
                                },
                                {
                                    name: "MembersType",
                                    value: memberType
                                },
                                {
                                    name: "MembersCount",
                                    value: members.length
                                },
                                {
                                    name: "Duration",
                                    value: duration
                                }
                            ], Marketing.LogType.CustomerIntelligence);
                            return [3 /*break*/, 4];
                        case 3:
                            this.finalizeDialog();
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ManageStaticListDialog.prototype.keepSelected = function () {
            return __awaiter(this, void 0, void 0, function () {
                var startTime, entityIdAttribute, entityId, selectedRecordsAttribute, selectedRecordsString, selectedRecords, memberType, membersIds, request, endTime, duration;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            startTime = performance.now();
                            if (!this.validSelected()) {
                                this.showInvalidSelectedMessage();
                                return [2 /*return*/];
                            }
                            entityIdAttribute = Xrm.Page.data.attributes.get(Marketing.ManageListBase.EntityId);
                            entityId = entityIdAttribute.getValue().slice(1, -1);
                            selectedRecordsAttribute = Xrm.Page.data.attributes.get(Marketing.ManageListBase.ParamSelectedRecords);
                            selectedRecordsString = selectedRecordsAttribute.getValue();
                            selectedRecords = JSON.parse(selectedRecordsString);
                            memberType = this.getQueryEntityType();
                            membersIds = selectedRecords.map(function (record) {
                                return _a = {},
                                    _a["@odata.type"] = "Microsoft.Dynamics.CRM." + memberType,
                                    _a[memberType + "id"] = record.Id,
                                    _a;
                                var _a;
                            });
                            request = new ODataContract.QualifyMemberListRequest({ id: entityId, entityType: this.ENTITY_NAME }, membersIds, true);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, , 3, 4]);
                            Xrm.Utility.showProgressIndicator(Marketing.StringProvider.getResourceString(Marketing.MessageKeys.MsgProcessingWaitLongDialog));
                            return [4 /*yield*/, Xrm.WebApi.online.execute(request).catch(function (error) { ClientUtility.ActionFailedHandler.actionFailedCallback(error); })];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            this.finalizeDialog();
                            endTime = performance.now();
                            duration = endTime - startTime;
                            Marketing.EMTelemetry.LogInfo(Marketing.TelemetryConstants.ManageMembers, "ManageStaticListDialog.ts", "keepSelected", "Evaluate members of marketing list using Advance find", "Clicked", "Mscrm.EvaluateUsingAdvancedFind", [
                                {
                                    name: "ListId",
                                    value: entityId
                                },
                                {
                                    name: "MembersType",
                                    value: memberType
                                },
                                {
                                    name: "MembersCount",
                                    value: membersIds.length
                                },
                                {
                                    name: "Duration",
                                    value: duration
                                }
                            ], Marketing.LogType.CustomerIntelligence);
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ManageStaticListDialog.prototype.keepAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                var startTime, entityIdAttribute, entityId, fetchXmlAttribute, fetchXml, request, endTime, duration;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            startTime = performance.now();
                            entityIdAttribute = Xrm.Page.data.attributes.get(Marketing.ManageListBase.EntityId);
                            entityId = entityIdAttribute.getValue().slice(1, -1);
                            fetchXmlAttribute = Xrm.Page.data.attributes.get(Marketing.ManageListBase.ParamFetchXml);
                            fetchXml = fetchXmlAttribute.getValue();
                            this.needMoreTime = false;
                            request = new ODataContract.RemoveMembersByFetchXmlListRequest({ id: entityId, entityType: this.ENTITY_NAME }, fetchXml, true);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, , 3, 4]);
                            Xrm.Utility.showProgressIndicator(Marketing.StringProvider.getResourceString(Marketing.MessageKeys.MsgProcessingWaitLongDialog));
                            return [4 /*yield*/, this.promiseTimeout(this.timeout, Xrm.WebApi.online.execute(request).catch(function (error) { ClientUtility.ActionFailedHandler.actionFailedCallback(error); }))];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            this.showNotificationAndfinalizeDialog();
                            endTime = performance.now();
                            duration = endTime - startTime;
                            Marketing.EMTelemetry.LogInfo(Marketing.TelemetryConstants.ManageMembers, "ManageStaticListDialog.ts", "keepAll", "Evaluate members of marketing list using Advance find", "Clicked", "Mscrm.EvaluateUsingAdvancedFind", [
                                {
                                    name: "ListId",
                                    value: entityId
                                },
                                {
                                    name: "MembersType",
                                    value: this.getListMemberName()
                                },
                                {
                                    name: "Duration",
                                    value: duration
                                }
                            ], Marketing.LogType.CustomerIntelligence);
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ManageStaticListDialog.prototype.finalizeDialog = function () {
            Xrm.Utility.closeProgressIndicator();
            Marketing.DialogUtil.closeDialog();
        };
        ManageStaticListDialog.prototype.removeAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                var startTime, entityIdAttribute, entityId, fetchXmlAttribute, fetchXml, request, endTime, duration;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            startTime = performance.now();
                            entityIdAttribute = Xrm.Page.data.attributes.get(Marketing.ManageListBase.EntityId);
                            entityId = entityIdAttribute.getValue().slice(1, -1);
                            fetchXmlAttribute = Xrm.Page.data.attributes.get(Marketing.ManageListBase.ParamFetchXml);
                            fetchXml = fetchXmlAttribute.getValue();
                            request = new ODataContract.RemoveMembersByFetchXmlListRequest({ id: entityId, entityType: this.ENTITY_NAME }, fetchXml, false);
                            this.needMoreTime = false;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, , 3, 4]);
                            Xrm.Utility.showProgressIndicator(Marketing.StringProvider.getResourceString(Marketing.MessageKeys.MsgProcessingWaitLongDialog));
                            return [4 /*yield*/, this.promiseTimeout(this.timeout, Xrm.WebApi.online.execute(request).catch(function (error) { ClientUtility.ActionFailedHandler.actionFailedCallback(error); }))];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            this.showNotificationAndfinalizeDialog();
                            endTime = performance.now();
                            duration = endTime - startTime;
                            Marketing.EMTelemetry.LogInfo(Marketing.TelemetryConstants.ManageMembers, "ManageStaticListDialog.ts", "removeAll", "Remove members to marketing list using Advance find", "Clicked", "Mscrm.RemoveUsingAdvancedFind", [
                                {
                                    name: "ListId",
                                    value: entityId
                                },
                                {
                                    name: "MembersType",
                                    value: this.getListMemberName()
                                },
                                {
                                    name: "Duration",
                                    value: duration
                                }
                            ], Marketing.LogType.CustomerIntelligence);
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ManageStaticListDialog.prototype.GetLabelOperation = function (invokeType) {
            if (invokeType === "lqAdd") {
                return Marketing.StringProvider.getResourceString(this.GENERIC_ADD_LABEL);
            }
            if (invokeType === "lqRemove") {
                return Marketing.StringProvider.getResourceString(this.GENERIC_REMOVE_LABEL);
            }
            if (invokeType === "lqKeep") {
                return Marketing.StringProvider.getResourceString(this.GENERIC_EVALUATE_LABEL);
            }
        };
        ManageStaticListDialog.prototype.GetSublabelOperation = function (invokeType) {
            if (invokeType === "lqAdd") {
                return Marketing.StringProvider.getResourceString(this.LIST_ADD_SUB_LABEL);
            }
            if (invokeType === "lqRemove") {
                return Marketing.StringProvider.getResourceString(this.LIST_REMOVE_SUB_LABEL);
            }
            if (invokeType === "lqKeep") {
                return Marketing.StringProvider.getResourceString(this.LIST_EVALUATE_SUB_LABEL);
            }
        };
        ManageStaticListDialog.prototype.setControlsVisibility = function () {
            var invokeType = Xrm.Page.data.attributes
                .get(Marketing.ManageListBase.ParamInvokeType)
                .getValue();
            for (var _i = 0, _a = this.labels; _i < _a.length; _i++) {
                var label = _a[_i];
                Xrm.Page.ui.controls.get(label + "_all_id").setVisible(label === invokeType);
                Xrm.Page.ui.controls.get(label + "_selected_id").setVisible(label === invokeType);
            }
        };
        ManageStaticListDialog.prototype.load = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.setControlsVisibility();
                    this.ChangeTitleAccording(this.getInvokeType());
                    this.GetSavedQueries().then(function () { });
                    return [2 /*return*/];
                });
            });
        };
        ManageStaticListDialog.prototype.getFetchAndlayoutXml = function () {
            var selectedElement = this.getSavedQueryId();
            if (ClientUtility.DataUtil.isNullOrUndefined(selectedElement)) {
                var fetchXmlTemplate = Marketing.List.ListFetchXmlResultsViewerTemplate;
                return {
                    fetchXml: fetchXmlTemplate.getFetchXmlStaticList(this.getListMemberType()),
                    layoutXml: fetchXmlTemplate.getLayoutXmlStaticList(this.getListMemberType())
                };
            }
            else {
                return {
                    fetchXml: this.queryItems[selectedElement][Marketing.ManageListBase.FetchXml],
                    layoutXml: this.queryItems[selectedElement][Marketing.ManageListBase.LayoutXml]
                };
            }
        };
        ManageStaticListDialog.prototype.QueryChanged = function () {
            var fetchAndLayoutXml = this.getFetchAndlayoutXml();
            this.setParamFetchXml(Marketing.List.QueryBuilderHelper.SanitizeFetchXml(fetchAndLayoutXml.fetchXml));
            this.setParamLayoutXml(fetchAndLayoutXml.layoutXml);
        };
        ManageStaticListDialog.prototype.ChangeTitleAccording = function (invokeType) {
            this.ChangeLabel(Marketing.ManageListBase.HeaderId, this.GetLabelOperation(invokeType));
            this.ChangeLabel(Marketing.ManageListBase.SubheaderId, this.GetSublabelOperation(invokeType));
        };
        ManageStaticListDialog.prototype.ChangeLabel = function (controlId, message) {
            var labelControl = Xrm.Page.ui.controls.get(controlId);
            var labelFormat = labelControl.getLabel();
            labelControl.setLabel(labelFormat.replace("{0}", message));
        };
        ManageStaticListDialog.prototype.isRemove = function () {
            return this.getInvokeType() === "lqRemove";
        };
        ManageStaticListDialog.prototype.isKeep = function () {
            return this.getInvokeType() === "lqKeep";
        };
        ManageStaticListDialog.prototype.cleanFilters = function () {
            this.getLookForEntityControl().clearOptions();
            this.getSavedQueryControl().clearOptions();
        };
        ManageStaticListDialog.prototype.addUserQueries = function (savedQueries) {
            return __awaiter(this, void 0, void 0, function () {
                var userQueries;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Marketing.MemberOperations.getQueries(this.getListMemberName(), Marketing.EntityNames.UserQuery, this.fetchColumnNames)];
                        case 1:
                            userQueries = _a.sent();
                            this.loadToComboBox(savedQueries, userQueries);
                            return [2 /*return*/];
                    }
                });
            });
        };
        ManageStaticListDialog.prototype.GetSavedQueries = function () {
            return __awaiter(this, void 0, void 0, function () {
                var savedQueries;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.queryItems = [];
                            this.cleanFilters();
                            this.ConfigureDefaultFilterEntity();
                            return [4 /*yield*/, Marketing.MemberOperations.getQueries(this.getListMemberName(), Marketing.EntityNames.SavedQuery, this.fetchColumnNames)];
                        case 1:
                            savedQueries = _a.sent();
                            return [4 /*yield*/, this.addUserQueries(savedQueries)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ManageStaticListDialog.prototype.ConfigureDefaultFilterEntity = function () {
            this.getLookForEntityControl().addOption({
                value: this.getListMemberType(),
                text: Marketing.StringProvider.getResourceString(Marketing.List.ListFetchXmlResultsViewerTemplate.GetListMemberResourceString(this.getListMemberName()))
            });
            Xrm.Page.data.attributes.get(Marketing.ManageListBase.LookForEntityId).setValue(this.getListMemberType());
        };
        ManageStaticListDialog.prototype.loadToComboBox = function (savedQueries, userQueries) {
            var savedQueriesCombo = this.getSavedQueryControl();
            var compareMethod = function (a, b) {
                if (a.name.toLowerCase() > b.name.toLowerCase()) {
                    return 1;
                }
                else if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return -1;
                }
                return 0;
            };
            this.queryItems = savedQueries
                .sort(compareMethod)
                .concat(userQueries.sort(compareMethod));
            this.queryItems.forEach(function (query, index) {
                savedQueriesCombo.addOption({ value: index, text: query.name });
            });
        };
        return ManageStaticListDialog;
    }(Marketing.ManageListBase));
    Marketing.ManageStaticListDialog = ManageStaticListDialog;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var ManageDynamicListDialog = (function (_super) {
        __extends(ManageDynamicListDialog, _super);
        function ManageDynamicListDialog() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.fetchColumnNames = ["name", "fetchxml", "layoutxml"];
            return _this;
        }
        ManageDynamicListDialog.prototype.load = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.GetSavedQueries().then(function () { });
                    return [2 /*return*/];
                });
            });
        };
        ManageDynamicListDialog.prototype.next = function () {
            var lookForValue = this.getLookForEntity();
            var isQueryValid = Xrm.Page.data.attributes.get(Marketing.ManageListBase.ParamIsValid).getValue();
            var validationErrorMessage = Xrm.Page.data.attributes.get(Marketing.ManageListBase.ParamValidationErrorMessage).getValue();
            if (!isQueryValid) {
                Marketing.ClientUtil.openAlertDialog({ text: validationErrorMessage });
                return;
            }
            if (!ClientUtility.DataUtil.isNullOrUndefined(lookForValue)) {
                Xrm.Page.ui.moveTo("confirm_tab");
                var isManageMembersGridAlignmentEnabled = !(Xrm.Utility.getGlobalContext().getFeatureControlSetting("SalesService.EnterpriseMarketing", "DisableWindowEventsForManageMembersGridAlignment"));
                isManageMembersGridAlignmentEnabled && setTimeout(function () {
                    var event = new CustomEvent('MarketingFetchXmlViewerEvent', {
                        detail: { message: 'MarketingFetchXmlViewerEvent' }
                    });
                    window && window.top && window.top.dispatchEvent(event);
                }, 1000);
            }
        };
        ManageDynamicListDialog.prototype.back = function () {
            Xrm.Page.ui.moveTo("query_tab");
        };
        ManageDynamicListDialog.prototype.save = function () {
            Xrm.Page.data.attributes.get(Marketing.ManageListBase.ParamCanceled).setValue(false);
            Marketing.DialogUtil.closeDialog();
        };
        ManageDynamicListDialog.prototype.getFetchAndlayoutXml = function () {
            var selectedElement = this.getSavedQueryId();
            if (ClientUtility.DataUtil.isNullOrUndefined(selectedElement)) {
                var fetchXmlTemplate = Marketing.List.ListFetchXmlResultsViewerTemplate;
                return {
                    fetchXml: fetchXmlTemplate.getFetchXmlDynamicList(this.getListMemberType()),
                    layoutXml: fetchXmlTemplate.getLayoutXmlDynamicList(this.getListMemberType())
                };
            }
            else {
                return {
                    fetchXml: this.queryItems[selectedElement][Marketing.ManageListBase.FetchXml],
                    layoutXml: this.queryItems[selectedElement][Marketing.ManageListBase.LayoutXml]
                };
            }
        };
        ManageDynamicListDialog.prototype.QueryChanged = function () {
            var fetchAndLayoutXml = this.getFetchAndlayoutXml();
            Xrm.Page.data.attributes.get(Marketing.ManageListBase.ParamCanceled).setValue(false);
            this.setParamFetchXml(Marketing.List.QueryBuilderHelper.SanitizeFetchXml(fetchAndLayoutXml.fetchXml));
            this.setParamLayoutXml(fetchAndLayoutXml.layoutXml);
        };
        ManageDynamicListDialog.prototype.cleanFilters = function () {
            this.getLookForEntityControl().clearOptions();
            this.getSavedQueryControl().clearOptions();
        };
        ManageDynamicListDialog.prototype.addUserQueries = function (savedQueries) {
            return __awaiter(this, void 0, void 0, function () {
                var userQueries;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Marketing.MemberOperations.getQueries(this.getListMemberName(), Marketing.EntityNames.UserQuery, this.fetchColumnNames)];
                        case 1:
                            userQueries = _a.sent();
                            this.loadToComboBox(savedQueries, userQueries);
                            return [2 /*return*/];
                    }
                });
            });
        };
        ManageDynamicListDialog.prototype.GetSavedQueries = function () {
            return __awaiter(this, void 0, void 0, function () {
                var savedQueries;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.queryItems = [];
                            this.cleanFilters();
                            this.ConfigureDefaultFilterEntity();
                            return [4 /*yield*/, Marketing.MemberOperations.getQueries(this.getListMemberName(), Marketing.EntityNames.SavedQuery, this.fetchColumnNames)];
                        case 1:
                            savedQueries = _a.sent();
                            return [4 /*yield*/, this.addUserQueries(savedQueries)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ManageDynamicListDialog.prototype.ConfigureDefaultFilterEntity = function () {
            this.getLookForEntityControl().addOption({
                value: this.getListMemberType(),
                text: Marketing.StringProvider.getResourceString(Marketing.List.ListFetchXmlResultsViewerTemplate.GetListMemberResourceString(this.getListMemberName()))
            });
            Xrm.Page.data.attributes.get(Marketing.ManageListBase.LookForEntityId).setValue(this.getListMemberType());
        };
        ManageDynamicListDialog.prototype.loadToComboBox = function (savedQueries, userQueries) {
            var savedQueriesCombo = this.getSavedQueryControl();
            var compareMethod = function (a, b) {
                if (a.name.toLowerCase() > b.name.toLowerCase()) {
                    return 1;
                }
                else if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return -1;
                }
                return 0;
            };
            this.queryItems = savedQueries
                .sort(compareMethod)
                .concat(userQueries.sort(compareMethod));
            this.queryItems.forEach(function (query, index) {
                savedQueriesCombo.addOption({ value: index, text: query.name });
            });
        };
        return ManageDynamicListDialog;
    }(Marketing.ManageListBase));
    Marketing.ManageDynamicListDialog = ManageDynamicListDialog;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var ListFetchXmlResultsViewerTemplate = (function () {
        function ListFetchXmlResultsViewerTemplate() {
        }
        ListFetchXmlResultsViewerTemplate.prototype.getFetchXmlStaticList = function (listMemberType) {
            switch (listMemberType) {
                case Marketing.EntityTypeCodes.Account:
                    return "<fetch version=\"1.0\" output-format=\"xml-platform\" mapping=\"logical\" distinct=\"true\"><entity name=\"account\"><attribute name=\"name\" /><attribute name=\"telephone1\" /><attribute name=\"accountid\" /><attribute name=\"primarycontactid\"/><order attribute=\"name\" descending=\"false\" /></entity></fetch>";
                case Marketing.EntityTypeCodes.Contact:
                    return "<fetch version=\"1.0\" output-format=\"xml-platform\" mapping=\"logical\" distinct=\"true\"><entity name=\"contact\"><attribute name=\"fullname\" /><attribute name=\"telephone1\" /><attribute name=\"contactid\" /><order attribute=\"fullname\" descending=\"false\" /></entity></fetch>";
                case Marketing.EntityTypeCodes.Lead:
                    return "<fetch version=\"1.0\" output-format=\"xml-platform\" mapping=\"logical\" distinct=\"true\"><entity name=\"lead\"><attribute name=\"fullname\" /><attribute name=\"companyname\" /><attribute name=\"telephone1\" /><attribute name=\"leadid\" /><order attribute=\"fullname\" descending=\"false\" /><order attribute=\"leadid\" descending=\"false\" /></entity></fetch>";
            }
        };
        ListFetchXmlResultsViewerTemplate.prototype.getLayoutXmlStaticList = function (listMemberType) {
            switch (listMemberType) {
                case Marketing.EntityTypeCodes.Account:
                    return "<grid name=\"resultset\" object=\"2\" jump=\"name\" select=\"1\" icon=\"1\" preview=\"1\"><row name=\"result\" id=\"accountid\"><cell name=\"name\" width=\"300\" /><cell name=\"primarycontactid\" width=\"125\" /><cell name=\"telephone1\" width=\"125\" /></row></grid>";
                case Marketing.EntityTypeCodes.Contact:
                    return "<grid name=\"resultset\" object=\"2\" jump=\"fullname\" select=\"1\" icon=\"1\" preview=\"1\"><row name=\"result\" id=\"contactid\"><cell name=\"fullname\" width=\"300\" /><cell name=\"telephone1\" width=\"125\" /></row></grid>";
                case Marketing.EntityTypeCodes.Lead:
                    return "<grid name=\"resultset\" object=\"2\" jump=\"name\" select=\"1\" icon=\"1\" preview=\"1\"><row name=\"result\" id=\"leadid\"><cell name=\"fullname\" width=\"300\" /><cell name=\"companyname\" width=\"125\" /><cell name=\"telephone1\" width=\"125\" /></row></grid>";
            }
        };
        ListFetchXmlResultsViewerTemplate.prototype.getFetchXmlDynamicList = function (listMemberType) {
            switch (listMemberType) {
                case Marketing.EntityTypeCodes.Account:
                    return "<fetch version=\"1.0\" output-format=\"xml-platform\" mapping=\"logical\" distinct=\"true\"><entity name=\"account\"><attribute name=\"name\" /><attribute name=\"telephone1\" /><attribute name=\"accountid\" /><attribute name=\"primarycontactid\"/><order attribute=\"name\" descending=\"false\" /></entity></fetch>";
                case Marketing.EntityTypeCodes.Contact:
                    return "<fetch version=\"1.0\" output-format=\"xml-platform\" mapping=\"logical\" distinct=\"true\"><entity name=\"contact\"><attribute name=\"fullname\" /><attribute name=\"telephone1\" /><attribute name=\"contactid\" /><order attribute=\"fullname\" descending=\"false\" /></entity></fetch>";
                case Marketing.EntityTypeCodes.Lead:
                    return "<fetch version=\"1.0\" output-format=\"xml-platform\" mapping=\"logical\" distinct=\"true\"><entity name=\"lead\"><attribute name=\"fullname\" /><attribute name=\"subject\" /><attribute name=\"leadid\" /><order attribute=\"fullname\" descending=\"false\" /><order attribute=\"leadid\" descending=\"false\" /></entity></fetch>";
            }
        };
        ListFetchXmlResultsViewerTemplate.prototype.getLayoutXmlDynamicList = function (listMemberType) {
            switch (listMemberType) {
                case Marketing.EntityTypeCodes.Account:
                    return "<grid name=\"resultset\" object=\"2\" jump=\"name\" select=\"1\" icon=\"1\" preview=\"1\"><row name=\"result\" id=\"accountid\"><cell name=\"name\" width=\"300\" /><cell name=\"primarycontactid\" width=\"125\" /><cell name=\"telephone1\" width=\"125\" /></row></grid>";
                case Marketing.EntityTypeCodes.Contact:
                    return "<grid name=\"resultset\" object=\"2\" jump=\"fullname\" select=\"1\" icon=\"1\" preview=\"1\"><row name=\"result\" id=\"contactid\"><cell name=\"fullname\" width=\"300\" /><cell name=\"telephone1\" width=\"125\" /></row></grid>";
                case Marketing.EntityTypeCodes.Lead:
                    return "<grid name=\"resultset\" object=\"2\" jump=\"name\" select=\"1\" icon=\"1\" preview=\"1\"><row name=\"result\" id=\"leadid\"><cell name=\"fullname\" width=\"300\" /><cell name=\"subject\" width=\"125\" /></row></grid>";
            }
        };
        ListFetchXmlResultsViewerTemplate.prototype.generateAdditionFilterForLink = function (listId, entityName) {
            var linkEntityXml = "<link-entity name=\"listmember\" from=\"entityid\" to=\"" + entityName + "id\" alias=\"internalMarketingList\">";
            var filterCondition = "<filter type=\"and\" >" +
                ("<condition attribute=\"listid\" operator=\"eq\" value=\"" + listId + "\" />") +
                "</filter> </link-entity>";
            return "" + linkEntityXml + filterCondition;
        };
        ListFetchXmlResultsViewerTemplate.prototype.includeFilterList = function (fetchXml, listId, entityName) {
            var regexToReplace = /<\/entity>/gi;
            return fetchXml.replace(regexToReplace, this.generateAdditionFilterForLink(listId, entityName) + "</entity>");
        };
        ListFetchXmlResultsViewerTemplate.prototype.removeFilterList = function (fetchXml, listId, entityName) {
            return fetchXml.replace(this.generateAdditionFilterForLink(listId, entityName) + "</entity>", "</entity>");
        };
        ListFetchXmlResultsViewerTemplate.prototype.getEntityTypeGivenListMemberType = function (listMemberType) {
            switch (listMemberType) {
                case Marketing.EntityTypeCodes.Account:
                    return "account";
                case Marketing.EntityTypeCodes.Contact:
                    return "contact";
                case Marketing.EntityTypeCodes.Lead:
                    return "lead";
            }
        };
        ListFetchXmlResultsViewerTemplate.prototype.GetListMemberTypeGivenListMemberName = function (listMemberName) {
            switch (listMemberName) {
                case Marketing.EntityNames.Account:
                    return Marketing.EntityTypeCodes.Account;
                case Marketing.EntityNames.Contact:
                    return Marketing.EntityTypeCodes.Contact;
                case Marketing.EntityNames.Lead:
                    return Marketing.EntityTypeCodes.Lead;
            }
        };
        ListFetchXmlResultsViewerTemplate.prototype.GetListMemberResourceString = function (listMemberName) {
            switch (listMemberName) {
                case Marketing.ManageListBase.Account:
                    return Marketing.ManageListBase.AccountStringResource;
                case Marketing.ManageListBase.Contact:
                    return Marketing.ManageListBase.ContactStringResource;
                case Marketing.ManageListBase.Lead:
                    return Marketing.ManageListBase.LeadStringResource;
            }
        };
        return ListFetchXmlResultsViewerTemplate;
    }());
    Marketing.ListFetchXmlResultsViewerTemplate = ListFetchXmlResultsViewerTemplate;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var QueryBuilderHelper = (function () {
        function QueryBuilderHelper() {
        }
        QueryBuilderHelper.prototype.SanitizeFetchXml = function (fetchXml) {
            fetchXml = this.AddAndConditionInFilter(fetchXml);
            return fetchXml;
        };
        QueryBuilderHelper.prototype.AddAndConditionInFilter = function (fetchXml) {
            return fetchXml.replace("<filter>", '<filter type="and">');
        };
        // Include link with list attribute
        QueryBuilderHelper.prototype.IncludeFilterList = function (fetchXml, listId, listMemberName) {
            var listFetchXmlResultsViewerTemplate = new Marketing.ListFetchXmlResultsViewerTemplate();
            var enrichedFetchXml = listFetchXmlResultsViewerTemplate.includeFilterList(fetchXml, listId, listMemberName);
            return enrichedFetchXml;
        };
        // Remove link with list attribute
        QueryBuilderHelper.prototype.RemoveFilterList = function (fetchXml, listId, listMemberName) {
            var listFetchXmlResultsViewerTemplate = new Marketing.ListFetchXmlResultsViewerTemplate();
            var enrichedFetchXml = listFetchXmlResultsViewerTemplate.removeFilterList(fetchXml, listId, listMemberName);
            return enrichedFetchXml;
        };
        return QueryBuilderHelper;
    }());
    Marketing.QueryBuilderHelper = QueryBuilderHelper;
})(Marketing || (Marketing = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../BulkOperation/BulkOperation_main_system_library.d.ts" />
/// <reference path="../Campaign/Campaign_main_system_library.d.ts" />
/// <reference path="../CampaignActivity/CampaignActivity_main_system_library.d.ts" />
/// <reference path="../ClientCommon/Marketing_ClientCommon.d.ts" />
/// <reference path="../CommandActions/Marketing_CommandActions.d.ts" />
/// <reference path="Models/IManageMemberParameters.ts" />
/// <reference path="ListExportCommand.ts" />
/// <reference path="ListUtilities.ts" />
/// <reference path="ListActions.ts" />
/// <reference path="ListCommands.ts" />
/// <reference path="ListMembers.ts" />
/// <reference path="ListCommandAction.ts" />
/// <reference path="ListLibrary.ts" />
/// <reference path="CopyDynamicToStaticDialog.ts" />
/// <reference path="CreateOpportunitiesDialog.ts" />
/// <reference path="ManageMembersDialogs/ManageListBase.ts" />
/// <reference path="ManageMembersDialogs/ManageStaticListDialog.ts" />
/// <reference path="ManageMembersDialogs/ManageDynamicListDialog.ts" />
/// <reference path="ListFetchXmlResultsViewerTemplate.ts" />
/// <reference path="ManageMembersDialogs/QueryBuilderHelper.ts" />
var Marketing;
(function (Marketing) {
    var List = (function () {
        function List() {
        }
        List.getAvailableListViewId = function () {
            return Marketing.ListViewIds.BasicMarketingLists;
        };
        return List;
    }());
    List.Actions = new Marketing.ListActions();
    List.Commands = new Marketing.ListCommands(List.Actions, window.Xrm);
    List.CommandActions = new Marketing.ListCommandAction(List.Commands, List.Actions, function () { return new Marketing.ODataServiceClient(); });
    List.Instance = new Marketing.ListLibrary(List.Commands);
    List.CopyDynamicToStaticDialog = new Marketing.CopyDynamicToStaticDialog();
    List.ManageStaticListDialog = new Marketing.ManageStaticListDialog();
    List.ManageDynamicListDialog = new Marketing.ManageDynamicListDialog();
    List.QueryBuilderHelper = new Marketing.QueryBuilderHelper();
    List.CreateOpportunitiesDialog = new Marketing.CreateOpportunitiesDialog();
    List.ListFetchXmlResultsViewerTemplate = new Marketing.ListFetchXmlResultsViewerTemplate();
    List.ManageListBase = new Marketing.ManageListBase();
    List.availableListViewId = "577EA96E-B1F6-499b-98A7-ABB5BE8233F9";
    List.ctor = (function () {
        // These are needed on the window because of "general" command bar actions calling hard-coded methods with some conditions
        window.locAssocObjMember = List.Commands.locAssocObjMember;
        window.locAssocObjAccount = List.Commands.locAssocObjAccount;
    })();
    Marketing.List = List;
})(Marketing || (Marketing = {}));
