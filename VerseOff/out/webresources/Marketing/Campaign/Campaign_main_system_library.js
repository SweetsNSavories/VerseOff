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
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../ClientCommon/Marketing_ClientCommon.d.ts" />
var Marketing;
(function (Marketing) {
    var CampaignLibrary = (function () {
        function CampaignLibrary() {
            var _this = this;
            this.newTemplate = function () {
                var parameters = {};
                parameters.template = 1;
                Xrm.Navigation.openForm({ entityName: Marketing.EntityNames.Campaign, useQuickCreateForm: false }, parameters);
            };
            this.copyCampaign = function (campaignId, saveAsTemplate) {
                var request = new ODataContract.CopyCampaignRequest({
                    id: ClientUtility.Guid.create(campaignId),
                    entityType: Marketing.EntityNames.Campaign
                }, saveAsTemplate === 1);
                Xrm.WebApi.online.execute(request).then(function (response) {
                    response.json().then(function (parsedResponse) {
                        Xrm.Navigation.openForm({
                            entityName: Marketing.EntityNames.Campaign,
                            entityId: parsedResponse.campaignid,
                            useQuickCreateForm: false,
                            openInNewWindow: false
                        }, null).then(function (s) {
                            Xrm.Utility.refreshParentGrid({
                                entityType: Marketing.EntityNames.Campaign,
                                id: campaignId,
                                name: ""
                            });
                        });
                    });
                }, ClientUtility.ActionFailedHandler.actionFailedCallback);
            };
            this.doesNotHaveOnlineCampaignActivities = function () {
                return (window.HasOnlineMarketingCampaignActivities === undefined ||
                    window.HasOnlineMarketingCampaignActivities === 0);
            };
            this.priceListIdSetAdditionalParameters = function () {
                var oLookup = Xrm.Page.ui.controls.get("pricelevelid");
                _this.addTransactionCurrencyParam(oLookup);
            };
            this.proposedStartOnChange = function () {
                Marketing.DateValidation.validateStartDateIsSmallerThanEndDate(Xrm.Page.getAttribute("proposedstart"), Xrm.Page.getAttribute("proposedend"), Marketing.StringProvider.getResourceString("MA_Alert_StartDate_GreaterThan_EndDate"), Xrm.Page.getAttribute("proposedstart"));
            };
            this.actualStartOnChange = function () {
                Marketing.DateValidation.validateStartDateIsSmallerThanEndDate(Xrm.Page.getAttribute("actualstart"), Xrm.Page.getAttribute("actualend"), Marketing.StringProvider.getResourceString("MA_Alert_StartDate_GreaterThan_EndDate"), Xrm.Page.getAttribute("actualstart"));
            };
            this.proposedEndOnChange = function () {
                Marketing.DateValidation.validateStartDateIsSmallerThanEndDate(Xrm.Page.getAttribute("proposedstart"), Xrm.Page.getAttribute("proposedend"), Marketing.StringProvider.getResourceString("MA_Alert_EndDate_LessThan_StartDate"), Xrm.Page.getAttribute("proposedend"));
            };
            this.actualEndOnChange = function () {
                Marketing.DateValidation.validateStartDateIsSmallerThanEndDate(Xrm.Page.getAttribute("actualstart"), Xrm.Page.getAttribute("actualend"), Marketing.StringProvider.getResourceString("MA_Alert_EndDate_LessThan_StartDate"), Xrm.Page.getAttribute("actualend"));
            };
            this.formOnLoad = function () {
                CampaignLibrary.initializeForNewTemplate();
            };
            this.locAssocCampaign = function (entityType, assocSubValueType, associationName, roleOrdinal, parentId, parentObjectTypeCode, selectedControl, isSymmetric) { return __awaiter(_this, void 0, void 0, function () {
                var entityName, parent, lookupOptions, lookupItems, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            entityName = Marketing.ClientUtil.getEntityName(entityType);
                            parent = this.getParentObject(parentId, parentObjectTypeCode);
                            lookupOptions = ClientUtility.ClientUtils.isUCI()
                                ? this.getLookupOptions(entityName, parentId)
                                : this.getLookupOptionsLegacy(entityType, entityName, parent);
                            return [4 /*yield*/, Xrm.Utility.lookupObjects(lookupOptions)];
                        case 1:
                            lookupItems = _b.sent();
                            if (!lookupItems || !lookupItems.length) {
                                return [2 /*return*/];
                            }
                            _a = entityType;
                            switch (_a) {
                                case Marketing.EntityTypeCodes.List: return [3 /*break*/, 2];
                            }
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.openListAssociationDialog(lookupItems, entityType, assocSubValueType, associationName, roleOrdinal, parent, selectedControl)];
                        case 3:
                            _b.sent();
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, this.locAssocCampaignAction(lookupItems, entityType, assocSubValueType, associationName, roleOrdinal, parent, selectedControl, isSymmetric)];
                        case 5:
                            _b.sent();
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            }); };
            this.openListAssociationDialog = function (lookupItems, entityType, assocSubValueType, associationName, roleOrdinal, parent, selectedControl) { return __awaiter(_this, void 0, void 0, function () {
                var options, dialogParams;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!ClientUtility.DataUtil.isNullOrUndefined(lookupItems)) return [3 /*break*/, 2];
                            options = {
                                height: Marketing.CampaignConstants.ListCampaignAssociationDialogHeight,
                                width: Marketing.CampaignConstants.ListCampaignAssociationDialogWidth,
                                position: 1 /* center */
                            };
                            dialogParams = {};
                            dialogParams[Marketing.CampaignConstants.LookupItems] = lookupItems;
                            dialogParams[Marketing.CampaignConstants.EntityType] = entityType;
                            dialogParams[Marketing.CampaignConstants.AssociationSubValueType] = assocSubValueType;
                            dialogParams[Marketing.CampaignConstants.AssociationName] = associationName;
                            dialogParams[Marketing.CampaignConstants.RoleOrdinal] = roleOrdinal;
                            dialogParams[Marketing.CampaignConstants.ParentEntity] = parent;
                            return [4 /*yield*/, Xrm.Navigation.openDialog(Marketing.DialogName.ListCampaignAssociacion, options, dialogParams)];
                        case 1:
                            _a.sent();
                            this.refreshAssociatedMarketingListsSubgrid(associationName, entityType, selectedControl);
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); };
            this.openListAssociationDialogResponse = function () {
                var returnValue = ClientUtility.PageUtil.getDataAttributeValue(Marketing.CampaignConstants.AssociationDestination);
                var items = ClientUtility.PageUtil.getDataAttributeValue(Marketing.CampaignConstants.LookupItems);
                var entityType = ClientUtility.PageUtil.getDataAttributeValue(Marketing.CampaignConstants.EntityType);
                if (ClientUtility.DataUtil.isNullOrUndefined(entityType)) {
                    entityType = 4300;
                }
                var assocSubValueType = ClientUtility.PageUtil.getDataAttributeValue(Marketing.CampaignConstants.AssociationSubValueType);
                var associationName = ClientUtility.PageUtil.getDataAttributeValue(Marketing.CampaignConstants.AssociationName);
                var roleOrdinal = ClientUtility.PageUtil.getDataAttributeValue(Marketing.CampaignConstants.RoleOrdinal);
                var parent = ClientUtility.PageUtil.getDataAttributeValue(Marketing.CampaignConstants.ParentEntity);
                _this.performActionAfterListAssociate(returnValue, items, entityType, assocSubValueType, associationName, roleOrdinal, parent);
            };
            this.performActionAfterListAssociate = function (resultValue, lookupItems, entityType, assocSubValueType, associationName, roleOrdinal, parent) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(lookupItems)) {
                    if (ClientUtility.DataUtil.isNullOrUndefined(resultValue)) {
                        lookupItems = null;
                    }
                    if (resultValue) {
                        assocSubValueType = assocSubValueType + "addtoCA";
                    }
                }
                _this.locAssocCampaignAction(lookupItems, entityType, assocSubValueType, associationName, roleOrdinal, parent, null);
            };
            this.locAssocCampaignAction = function (lookupItems, entityType, assocSubValueType, associationName, roleOrdinal, parent, selectedControl, isSymmetric) { return __awaiter(_this, void 0, void 0, function () {
                var errorOccured, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            errorOccured = false;
                            if (!(!ClientUtility.DataUtil.isNullOrUndefined(lookupItems) &&
                                lookupItems.length > 0)) return [3 /*break*/, 4];
                            roleOrdinal = ClientUtility.DataUtil.isNullOrUndefined(roleOrdinal) ? "-1" : roleOrdinal.toString();
                            if (!!ClientUtility.DataUtil.isNullOrUndefined(parent)) return [3 /*break*/, 4];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.associateObjects(lookupItems, entityType, assocSubValueType, roleOrdinal, parent, associationName, isSymmetric)];
                        case 2:
                            _a.sent();
                            this.refreshAssociatedMarketingListsSubgrid(associationName, entityType, selectedControl);
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            if (ClientUtility.ClientUtils.isUCI()) {
                                errorOccured = true;
                                this.closeDialogIfList(entityType);
                            }
                            ClientUtility.ActionFailedHandler.actionFailedCallback(error_1);
                            return [3 /*break*/, 4];
                        case 4:
                            if (!errorOccured) {
                                this.closeDialogIfList(entityType);
                            }
                            return [2 /*return*/];
                    }
                });
            }); };
            this.disassociateItems = function (campaignId, itemsToDisassociate, associationName, entityTypeCodeOfRemovedItems, selectedControl) { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                var entityNameOfRemovedItems, entityMetadata, title, body, strings, options, removing, removeRequests;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (ClientUtility.DataUtil.isNullOrUndefined(itemsToDisassociate) || itemsToDisassociate.length === 0) {
                                return [2 /*return*/];
                            }
                            entityNameOfRemovedItems = Marketing.ClientUtil.getEntityName(entityTypeCodeOfRemovedItems);
                            return [4 /*yield*/, Xrm.Utility.getEntityMetadata(entityNameOfRemovedItems)];
                        case 1:
                            entityMetadata = _a.sent();
                            title = ClientUtility.StringUtil.format(Marketing.StringProvider.getResourceString(CampaignLibrary.CampaignRemoveItemConfirmationTitle), entityMetadata.DisplayName);
                            body = ClientUtility.StringUtil.format(Marketing.StringProvider.getResourceString(CampaignLibrary.CampaignRemoveItemConfirmationBody), itemsToDisassociate.length, itemsToDisassociate.length > 1 ? entityMetadata.DisplayCollectionName : entityMetadata.DisplayName);
                            strings = {
                                title: title,
                                text: body
                            };
                            options = {
                                width: 400,
                                height: 200
                            };
                            return [4 /*yield*/, Xrm.Navigation.openConfirmDialog(strings, options)];
                        case 2:
                            removing = _a.sent();
                            if (removing.confirmed) {
                                removeRequests = itemsToDisassociate.map(function (itemId) { return new ODataContract.RemoveItemCampaignRequest(campaignId, itemId); });
                                Xrm.WebApi.online.executeMultiple(removeRequests)
                                    .then(function () { return _this.refreshAssociatedMarketingListsSubgrid(associationName, entityTypeCodeOfRemovedItems, selectedControl); })
                                    .catch(function (err) {
                                    Xrm.Utility.alertDialog(err.message);
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            }); };
            this.getParentObject = function (parentId, parentObjectTypeCode) {
                if ((ClientUtility.DataUtil.isNullOrEmptyString(parentId) || ClientUtility.DataUtil.isNullOrUndefined(parentObjectTypeCode)) && (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data.entity))) {
                    var typeName = Xrm.Page.data.entity.getEntityName();
                    parentObjectTypeCode = Xrm.Internal.getEntityCode(typeName);
                    parentId = Xrm.Page.data.entity.getId();
                }
                var parameters = {
                    id: parentId,
                    objectTypeCode: parentObjectTypeCode
                };
                return parameters;
            };
            this.associateObjects = function (lookupItems, typeCode, assocSubValueType, roleOrdinal, parent, associationName, isSymmetric) { return __awaiter(_this, void 0, void 0, function () {
                var roleOrdinalActionStatus, addCampaignItemRequests, parentEntityName, parentEntity, _i, lookupItems_1, item, entityName, childEntity, request, error_2, errorMessage, proposedStatusCode, selectCampaignActivities, response, addCampaignActivityItemRequests_1, error_3, errorMessage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (ClientUtility.DataUtil.isNullOrUndefined(lookupItems) ||
                                lookupItems.length === 0) {
                                return [2 /*return*/];
                            }
                            roleOrdinalActionStatus = "2";
                            addCampaignItemRequests = new Array();
                            parentEntityName = Marketing.ClientUtil.getEntityName(parent.objectTypeCode);
                            parentEntity = {
                                id: ClientUtility.Guid.create(parent.id),
                                entityType: parentEntityName
                            };
                            roleOrdinal = ClientUtility.DataUtil.isNullOrUndefined(roleOrdinal) ? "-1" : roleOrdinal;
                            for (_i = 0, lookupItems_1 = lookupItems; _i < lookupItems_1.length; _i++) {
                                item = lookupItems_1[_i];
                                entityName = Marketing.ClientUtil.getEntityName(typeCode);
                                childEntity = {
                                    id: ClientUtility.Guid.create(item.id),
                                    entityType: entityName
                                };
                                if (isSymmetric) {
                                    addCampaignItemRequests.push(new ODataContract.AddItemCampaignRequest(parentEntity, childEntity));
                                    addCampaignItemRequests.push(new ODataContract.AddItemCampaignRequest(childEntity, parentEntity));
                                }
                                else {
                                    request = (roleOrdinal === roleOrdinalActionStatus) ?
                                        new ODataContract.AddItemCampaignRequest(parentEntity, childEntity)
                                        : new ODataContract.AddItemCampaignRequest(childEntity, parentEntity);
                                    addCampaignItemRequests.push(request);
                                }
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Xrm.WebApi.online.executeMultiple(addCampaignItemRequests)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            errorMessage = Marketing.StringProvider.getErrorCodeString(error_2.errorCode);
                            if (errorMessage.indexOf(error_2.errorCode.toString(16)) === -1)
                                error_2.message = errorMessage;
                            throw error_2;
                        case 4:
                            if (!assocSubValueType.endsWith("addtoCA")) return [3 /*break*/, 9];
                            proposedStatusCode = 1;
                            selectCampaignActivities = "?$select=activityid&$filter=_regardingobjectid_value eq " +
                                parentEntity.id +
                                " and statuscode eq " +
                                proposedStatusCode;
                            return [4 /*yield*/, Xrm.WebApi.online.retrieveMultipleRecords(Marketing.EntityNames.CampaignActivity, selectCampaignActivities)];
                        case 5:
                            response = _a.sent();
                            addCampaignActivityItemRequests_1 = new Array();
                            response.entities.forEach(function (campaignActivity) {
                                addCampaignItemRequests.map(function (m) { return m.entity; }).forEach(function (item) {
                                    var campaignActivityId = {
                                        id: ClientUtility.Guid.create(campaignActivity.activityid),
                                        entityType: Marketing.EntityNames.CampaignActivity,
                                        primaryKey: "activityid"
                                    };
                                    addCampaignActivityItemRequests_1.push(new ODataContract.AddItemCampaignActivityRequest(campaignActivityId, item));
                                });
                            });
                            if (!(addCampaignActivityItemRequests_1.length > 0)) return [3 /*break*/, 9];
                            _a.label = 6;
                        case 6:
                            _a.trys.push([6, 8, , 9]);
                            return [4 /*yield*/, Xrm.WebApi.online.executeMultiple(addCampaignActivityItemRequests_1)];
                        case 7:
                            _a.sent();
                            return [3 /*break*/, 9];
                        case 8:
                            error_3 = _a.sent();
                            errorMessage = Marketing.StringProvider.getErrorCodeString(error_3.errorCode);
                            if (errorMessage.indexOf(error_3.errorCode.toString(16)) === -1)
                                error_3.message = errorMessage;
                            throw error_3;
                        case 9: return [2 /*return*/];
                    }
                });
            }); };
            this.addExistingFromSubGridAssociatedSalesLiterature = function (griTypeName, gridControl) { return __awaiter(_this, void 0, void 0, function () {
                var relationship, salesLitetureEntityCode, campaignEntityCode, entity;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            relationship = gridControl.getRelationship();
                            salesLitetureEntityCode = Marketing.EntityTypeCodes.SalesLiterature;
                            campaignEntityCode = Marketing.EntityTypeCodes.Campaign;
                            if (!(ClientUtility.ClientUtils.isUCI() && relationship.name === Marketing.EntityRelationshipNames.CampaignSalesLiterature)) return [3 /*break*/, 2];
                            entity = Xrm.Page.data.entity;
                            return [4 /*yield*/, this.locAssocGeneric(salesLitetureEntityCode, entity.getEntityName(), relationship.name, relationship.roleType, entity.getId(), campaignEntityCode, gridControl)];
                        case 1:
                            _a.sent();
                            gridControl.refresh();
                            return [3 /*break*/, 3];
                        case 2:
                            XrmCore.Commands.AddFromSubGrid.addExistingFromSubGridAssociated.call(XrmCore.Commands.AddFromSubGrid, griTypeName, gridControl);
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); };
            this.addExistingFromSubGridAssociatedProduct = function (griTypeName, gridControl) { return __awaiter(_this, void 0, void 0, function () {
                var relationship, productEntityCode, campaignEntityCode, entity;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            relationship = gridControl.getRelationship();
                            productEntityCode = Marketing.EntityTypeCodes.Product;
                            campaignEntityCode = Marketing.EntityTypeCodes.Campaign;
                            if (!(ClientUtility.ClientUtils.isUCI() && relationship.name === Marketing.EntityRelationshipNames.CampaignProduct)) return [3 /*break*/, 2];
                            entity = Xrm.Page.data.entity;
                            return [4 /*yield*/, this.locAssocGeneric(productEntityCode, entity.getEntityName(), relationship.name, relationship.roleType, entity.getId(), campaignEntityCode, gridControl)];
                        case 1:
                            _a.sent();
                            gridControl.refresh();
                            return [3 /*break*/, 3];
                        case 2:
                            XrmCore.Commands.AddFromSubGrid.addExistingFromSubGridAssociated.call(XrmCore.Commands.AddFromSubGrid, griTypeName, gridControl);
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); };
            this.locAssocGeneric = function (entityType, assocSubValueType, associationName, roleOrdinal, parentId, parentObjectTypeCode, selectedControl, isSymmetric) { return __awaiter(_this, void 0, void 0, function () {
                var entityName, parent, lookupOptions, lookupItems;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            entityName = Marketing.ClientUtil.getEntityName(entityType);
                            parent = this.getParentObject(parentId, parentObjectTypeCode);
                            lookupOptions = ClientUtility.ClientUtils.isUCI()
                                ? this.getLookupOptions(entityName, parentId)
                                : this.getLookupOptionsLegacy(entityType, entityName, parent);
                            return [4 /*yield*/, Xrm.Utility.lookupObjects(lookupOptions)];
                        case 1:
                            lookupItems = _a.sent();
                            if (!lookupItems || !lookupItems.length) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.locAssocCampaignAction(lookupItems, entityType, assocSubValueType, associationName, roleOrdinal, parent, selectedControl, isSymmetric)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); };
            this.addExistingFromSubGridAssociated = function (griTypeName, gridControl) { return __awaiter(_this, void 0, void 0, function () {
                var entityNameAssociateTo, entityNameOfWhatToAssociate, isRelationshipBetweenTwoCampaings, isRelationshipBetweenCampaignAndList, relationship, subType, entity;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            entityNameAssociateTo = gridControl.getEntityName();
                            entityNameOfWhatToAssociate = Xrm.Page.data.entity.getEntityName();
                            isRelationshipBetweenTwoCampaings = this.isRelationshipBetweenTwoCampaigns(entityNameAssociateTo, entityNameOfWhatToAssociate);
                            isRelationshipBetweenCampaignAndList = this.isRelationshipBetweenCampaignAndList(entityNameAssociateTo, entityNameOfWhatToAssociate);
                            relationship = gridControl.getRelationship();
                            if (!((isRelationshipBetweenCampaignAndList && relationship.name === Marketing.EntityRelationshipNames.ListCampaign)
                                || isRelationshipBetweenTwoCampaings)) return [3 /*break*/, 2];
                            subType = CampaignLibrary.TargetListsSubType;
                            entity = Xrm.Page.data.entity;
                            return [4 /*yield*/, this.locAssocCampaign(Marketing.EntityTypeCodes.Campaign, subType, relationship.name, relationship.roleType, entity.getId(), Marketing.ClientUtil.getEntityTypeCode(entity.getEntityName()), gridControl, isRelationshipBetweenTwoCampaings)];
                        case 1:
                            _a.sent();
                            gridControl.refresh();
                            return [3 /*break*/, 3];
                        case 2:
                            XrmCore.Commands.AddFromSubGrid.addExistingFromSubGridAssociated.call(XrmCore.Commands.AddFromSubGrid, griTypeName, gridControl);
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); };
            this.openNewRecord = function (selectedEntityTypeName, selectedControl) {
                var parameters = {};
                parameters["tmpregardingobjectid"] = Xrm.Page.data && Xrm.Page.data.entity && Xrm.Page.data.entity.getId();
                Xrm.Utility.openEntityForm(Marketing.EntityNames.Campaign, null, parameters);
            };
            this.diassociateCampaignFromSubGrid = function (selectedEntityTypeName, selectedControl, firstSelectedItemId) { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                var entityNameAssociateTo, entityNameOfWhatToAssiciate, isRelationshipBetweenTwoCampaigns, entityNameOfRemovedItems, entityMetadata, titleResourceKey, bodyResourceKey, title, text, strings, options, removing, removeRequests, relationship_1, campaignItem_1, removeCampaigns, entitiesToRemove;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            entityNameAssociateTo = selectedControl.getEntityName();
                            entityNameOfWhatToAssiciate = Xrm.Page.data.entity.getEntityName();
                            isRelationshipBetweenTwoCampaigns = this.isRelationshipBetweenTwoCampaigns(entityNameAssociateTo, entityNameOfWhatToAssiciate);
                            if (!((ClientUtility.ClientUtil.isUCI() && this.isRelationshipBetweenCampaignAndList(entityNameAssociateTo, entityNameOfWhatToAssiciate)) || isRelationshipBetweenTwoCampaigns)) return [3 /*break*/, 5];
                            entityNameOfRemovedItems = Marketing.ClientUtil.getEntityName(Marketing.EntityTypeCodes.Campaign);
                            return [4 /*yield*/, Xrm.Utility.getEntityMetadata(entityNameOfRemovedItems)];
                        case 1:
                            entityMetadata = _a.sent();
                            titleResourceKey = (entityNameOfWhatToAssiciate === Marketing.EntityNames.List) ? CampaignLibrary.ListRemoveItemConfirmationTitle : CampaignLibrary.CampaignRemoveItemConfirmationTitle;
                            bodyResourceKey = (entityNameOfWhatToAssiciate === Marketing.EntityNames.List) ? CampaignLibrary.ListRemoveItemConfirmationBody : CampaignLibrary.CampaignRemoveItemConfirmationBody;
                            title = ClientUtility.StringUtil.format(Marketing.StringProvider.getResourceString(titleResourceKey), entityMetadata.DisplayName);
                            text = ClientUtility.StringUtil.format(Marketing.StringProvider.getResourceString(bodyResourceKey), selectedControl.getGrid().getSelectedRows().get().length, selectedControl.getGrid().getSelectedRows().get().length > 1 ? entityMetadata.DisplayCollectionName : entityMetadata.DisplayName);
                            strings = {
                                title: title,
                                text: text
                            };
                            options = {
                                width: Marketing.DialogSizes.AddToCampaignDialogWidth,
                                height: Marketing.DialogSizes.AddToCampaignDialogHeight
                            };
                            return [4 /*yield*/, Xrm.Navigation.openConfirmDialog(strings, options)];
                        case 2:
                            removing = _a.sent();
                            if (!removing.confirmed) return [3 /*break*/, 4];
                            removeRequests = new Array();
                            relationship_1 = selectedControl.getRelationship();
                            campaignItem_1 = {
                                id: this.removeCurlyBrackets(Xrm.Page.data.entity.getId()),
                                entityType: Marketing.CampaignConstants.CampaignItem
                            };
                            removeCampaigns = selectedControl.getGrid().getSelectedRows().get();
                            entitiesToRemove = removeCampaigns.map(function (row) {
                                return {
                                    id: _this.removeCurlyBrackets(row.data.entity.getId()),
                                    entityType: row.data.entity.getEntityName()
                                };
                            });
                            removeRequests = entitiesToRemove.map(function (entity) { return new ODataContract.RemoveItemCampaignRequest(entity, campaignItem_1); });
                            if (isRelationshipBetweenTwoCampaigns) {
                                removeRequests.push.apply(removeRequests, this.getSymmetricRequests(campaignItem_1.id, entitiesToRemove.map(function (e) { return e.id; })));
                            }
                            return [4 /*yield*/, Xrm.WebApi.online.executeMultiple(removeRequests)
                                    .then(function () {
                                    selectedControl.refresh();
                                    _this.refreshAssociatedMarketingListsSubgrid(relationship_1.name, Marketing.EntityTypeCodes.Campaign, selectedControl);
                                })
                                    .catch(function (error) {
                                    ClientUtility.ActionFailedHandler.actionFailedCallback(error);
                                })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            XrmCore.Commands.Disassociate.gridDisassociate.call(XrmCore.Commands.Disassociate, selectedEntityTypeName, selectedControl, firstSelectedItemId);
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            }); };
        }
        CampaignLibrary.prototype.getLookupOptions = function (entityName, parentId) {
            var options = {
                allowMultiSelect: true,
                defaultEntityType: entityName,
                entityTypes: [entityName],
                disableMru: true,
                filters: []
            };
            if (entityName === Marketing.EntityNames.Campaign) {
                options.filters = [
                    {
                        filterXml: "<filter type='and'>" +
                            ("<condition attribute='campaignid' operator='ne' value='" + parentId + "' />") +
                            "</filter>"
                    }
                ];
            }
            return options;
        };
        CampaignLibrary.prototype.getLookupOptionsLegacy = function (entityType, entityName, parent) {
            var lookupOptions = new Xrm.LookupOptions();
            lookupOptions.lookupStyle = Xrm.LookupStyle.multi;
            lookupOptions.lookupTypes = [entityName];
            switch (entityType) {
                case Marketing.EntityTypeCodes.Campaign:
                    lookupOptions.showNew = true;
                    lookupOptions.additionalParams = {
                        currentid: parent.id.toString()
                    };
                    break;
                case Marketing.EntityTypeCodes.List:
                    lookupOptions.showNew = true;
                    break;
            }
            return lookupOptions;
        };
        CampaignLibrary.prototype.closeDialogIfList = function (entityType) {
            if (entityType === Marketing.EntityTypeCodes.List) {
                Marketing.DialogUtil.closeDialog();
            }
        };
        CampaignLibrary.prototype.refreshAssociatedMarketingListsSubgrid = function (associationName, entityType, selectedControl) {
            if (ClientUtility.ClientUtils.isUCI()) {
                if (selectedControl) {
                    selectedControl.refresh();
                }
            }
            else {
                Xrm.Internal.refreshParentGrid(entityType, Marketing.ClientUtil.getEntityName(entityType), "");
            }
        };
        CampaignLibrary.prototype.addTransactionCurrencyParam = function (lookupControl) {
            var lookupObjectId = "";
            var dataValue = null;
            if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data)) {
                var transactionCurrencyId = Xrm.Page.getAttribute("transactioncurrencyid");
                if (!ClientUtility.DataUtil.isNullOrUndefined(transactionCurrencyId)) {
                    dataValue = transactionCurrencyId.getValue();
                }
            }
            if (!ClientUtility.DataUtil.isNullOrUndefined(dataValue)) {
                lookupObjectId = dataValue[0].id;
            }
            var fetchXml = '<filter type="and"><condition attribute="transactioncurrencyid" operator="like" value="';
            fetchXml += CrmEncodeDecode.CrmXmlAttributeEncode(lookupObjectId);
            fetchXml += '"/></filter>';
            lookupControl.addCustomFilter(fetchXml);
        };
        CampaignLibrary.initializeForNewTemplate = function () {
            var isCreate = Xrm.Page.ui.getFormType() === 1 /* Create */;
            if (isCreate) {
                var isNewCampaignTemplate = false;
                var extraQueryStringToken = "extraqs";
                var templateToken = "template";
                var parameters = Xrm.Page.context.getQueryStringParameters();
                if (extraQueryStringToken in parameters) {
                    var extraQueryString = parameters[extraQueryStringToken].toString();
                    isNewCampaignTemplate = extraQueryString.indexOf("template=1") > 0;
                }
                else if (templateToken in parameters) {
                    var templateValue = parameters[templateToken].toString();
                    isNewCampaignTemplate = templateValue === "1";
                }
                var isTurboForm = window.location.href ? window.location.href.indexOf("/form/page.aspx") >= 0 : false;
                if (isTurboForm && document.parentWindow.parent) {
                    isNewCampaignTemplate = CrmEncodeDecode
                        .CrmUrlDecode(document.parentWindow.parent.location.href)
                        .indexOf("template=1") > 0;
                }
                if (isNewCampaignTemplate) {
                    var title = ClientUtility.StringUtil.format(Marketing.StringProvider.getResourceString("Form_Title_New_With_Entity_Display_Name"), Marketing.StringProvider.getResourceString("Object_Singular_CampaignTemplate"));
                    if (ClientUtility.ClientUtils.isUCI()) {
                        Xrm.Page.ui.setFormEntityName(title);
                    }
                    else {
                        Xrm.Internal.setFormEntityName(title);
                    }
                    var attributeName = "istemplate";
                    var fieldName = ClientUtility.StringUtil.format("header_{0}", attributeName);
                    var control = Xrm.Page.ui.controls.get(fieldName);
                    var attributeField = Xrm.Page.getAttribute(attributeName);
                    if (attributeField && control) {
                        control.setDisabled(false);
                        attributeField.setValue(true);
                        control.setDisabled(true);
                    }
                    else if (isTurboForm && attributeField) {
                        attributeField.setValue(true);
                    }
                }
            }
        };
        CampaignLibrary.prototype.hasManyToManyOrReferencialRelationship = function (gridControl) {
            return __awaiter(this, void 0, void 0, function () {
                var relationship;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            relationship = gridControl.getRelationship();
                            if (relationship.relationshipType === 1) {
                                return [2 /*return*/, true];
                            }
                            return [4 /*yield*/, this.checkForReferencialRelationship(relationship)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        CampaignLibrary.prototype.checkForReferencialRelationship = function (relationship) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var baseUrl, relationshipUrl, oDataServiceClient, response, responseObject, relationship_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            baseUrl = Xrm.Utility.getGlobalContext().getClientUrl();
                            relationshipUrl = baseUrl + "/api/data/v9.0/RelationshipDefinitions?$filter=SchemaName eq '" + relationship.name + "'";
                            oDataServiceClient = new Marketing.ODataServiceClient();
                            return [4 /*yield*/, oDataServiceClient.getReq(relationshipUrl)
                                    .catch(function (request) { return _this.reportFailure("isReferencialRelationship", relationshipUrl, request.response); })];
                        case 1:
                            response = _a.sent();
                            if (typeof response === 'string') {
                                try {
                                    if (!ClientUtility.DataUtil.isNullOrUndefined(response)) {
                                        responseObject = JSON.parse(response);
                                        if (!ClientUtility.DataUtil.isNullOrUndefined(responseObject.value)) {
                                            relationship_2 = responseObject.value[0];
                                            return [2 /*return*/, this.isReferencialRelationship(relationship_2)];
                                        }
                                    }
                                }
                                catch (error) {
                                    ClientUtility.ActionFailedHandler.actionFailedCallback(error);
                                    return [2 /*return*/, false];
                                }
                            }
                            return [2 /*return*/, false];
                    }
                });
            });
        };
        CampaignLibrary.prototype.reportFailure = function (methodName, url, result) {
            Xrm.Reporting.reportFailure("marketing", new Error("EnterpriseMarketing-Marketing.MemberOperations." + methodName), "", [
                { name: "url", value: url },
                { name: "error", value: JSON.stringify(result) }
            ]);
        };
        CampaignLibrary.prototype.isReferencialRelationship = function (relationship) {
            var cascadeRelationshipType = new Marketing.CascadingRelationshipType(relationship);
            var relationshipType = cascadeRelationshipType.GetRelationshipType();
            return relationshipType === Marketing.CascadingRelationship.Referential ||
                relationshipType === Marketing.CascadingRelationship.ReferentialRestrictDelete;
        };
        CampaignLibrary.prototype.isRelationshipBetweenCampaignAndList = function (entityNameAssociateTo, entityNameOfWhatToAssociate) {
            return (entityNameAssociateTo === Marketing.EntityNames.Campaign && entityNameOfWhatToAssociate === Marketing.EntityNames.List) ||
                (entityNameOfWhatToAssociate === Marketing.EntityNames.Campaign && entityNameAssociateTo === Marketing.EntityNames.List);
        };
        CampaignLibrary.prototype.isRelationshipBetweenTwoCampaigns = function (entityNameAssociateTo, entityNameOfWhatToAssociate) {
            return entityNameAssociateTo === entityNameOfWhatToAssociate && entityNameAssociateTo === Marketing.EntityNames.Campaign;
        };
        CampaignLibrary.prototype.getSymmetricRequests = function (campaignItemId, entityIdsToRemove) {
            return entityIdsToRemove
                .filter(function (entityId) { return entityId !== campaignItemId; }) // Remove duplicities in case of reflexive relation
                .map(function (entityId) { return new ODataContract.RemoveItemCampaignRequest({ id: campaignItemId, entityType: Marketing.EntityNames.Campaign }, { id: entityId, entityType: Marketing.CampaignConstants.CampaignItem }); });
        };
        CampaignLibrary.prototype.removeCurlyBrackets = function (input) {
            return input.replace(/[{}]/g, "");
        };
        return CampaignLibrary;
    }());
    CampaignLibrary.CampaignRemoveItemConfirmationTitle = "MA.Campaign.RemoveItem.Confirmation.Title";
    CampaignLibrary.CampaignRemoveItemConfirmationBody = "MA.Campaign.RemoveItem.Confirmation.Body";
    CampaignLibrary.TargetListsSubType = "subType=targetCampaigns";
    CampaignLibrary.ListRemoveItemConfirmationTitle = "MA.List.RemoveItem.Confirmation.Title";
    CampaignLibrary.ListRemoveItemConfirmationBody = "MA.List.RemoveItem.Confirmation.Body";
    Marketing.CampaignLibrary = CampaignLibrary;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var ErrorCodes = (function () {
        function ErrorCodes() {
        }
        return ErrorCodes;
    }());
    ErrorCodes.CannotAssociateInactiveItemToCampaign = 2147746564; //80040304
    Marketing.ErrorCodes = ErrorCodes;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var CampaignConstants = (function () {
        function CampaignConstants() {
        }
        return CampaignConstants;
    }());
    CampaignConstants.AssociationDestination = "associationDestination";
    CampaignConstants.LookupItems = "lookup_items";
    CampaignConstants.EntityType = "entity_type";
    CampaignConstants.AssociationSubValueType = "association_sub_value_type";
    CampaignConstants.AssociationName = "association_name";
    CampaignConstants.RoleOrdinal = "role_ordinal";
    CampaignConstants.ParentEntity = "parent_entity";
    CampaignConstants.CampaignItem = "campaignitem";
    CampaignConstants.ListCampaignAssociationDialogWidth = 850;
    CampaignConstants.ListCampaignAssociationDialogHeight = 250;
    Marketing.CampaignConstants = CampaignConstants;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var ODataContract;
(function (ODataContract) {
    var RemoveItemCampaignRequest = (function () {
        function RemoveItemCampaignRequest(entity, campaignItem) {
            this.entity = entity;
            this.CampaignItem = campaignItem;
        }
        RemoveItemCampaignRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    entity: {
                        typeName: Marketing.EntityFullTypeNames.Campaign,
                        structuralProperty: 5 /* EntityType */,
                    },
                    CampaignItem: {
                        typeName: Marketing.EntityFullTypeNames.CampaignItem,
                        structuralProperty: 5 /* EntityType */,
                    }
                },
                operationName: "RemoveItemCampaign",
                operationType: 0 /* Action */
            };
            return metadata;
        };
        return RemoveItemCampaignRequest;
    }());
    ODataContract.RemoveItemCampaignRequest = RemoveItemCampaignRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="CampaignLibrary.ts" />
/// <reference path="ErrorCodes.ts"/>
/// <reference path="CampaignConstants.ts"/>
/// <reference path="Contracts/RemoveItemCampaignRequest.ts"/>
var Marketing;
(function (Marketing) {
    var Campaign = (function () {
        function Campaign() {
        }
        return Campaign;
    }());
    Campaign.Instance = new Marketing.CampaignLibrary();
    Marketing.Campaign = Campaign;
})(Marketing || (Marketing = {}));
