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
/// <reference path="../../../../TypeDefinitions/Marketing/Localization/ResourceStringProvider.d.ts" />
/*
 * Invokes the ResourceStringProvider if available; otherwise returns *key*.
 * Using this class as a proxy for the ResourceStringProvider that is included per web dependency declaration
 * in order to avoid null reference errors in case the dependency is not loaded for some reason.
 */
var Marketing;
(function (Marketing) {
    var StringProvider = (function () {
        function StringProvider() {
        }
        StringProvider.getResourceString = function (key) {
            return Marketing.ResourceStringProvider ? Marketing.ResourceStringProvider.getResourceString(key) : "*" + key + "*";
        };
        StringProvider.getErrorCodeString = function (errorCode) {
            return Marketing.ResourceStringProvider ? Marketing.ResourceStringProvider.getErrorCodeString(errorCode) : "*" + (errorCode < 0 ? -errorCode : errorCode).toString(16) + "*";
        };
        StringProvider.getErrorMessageString = function (key) {
            return Marketing.ResourceStringProvider ? Marketing.ResourceStringProvider.getErrorMessageString(key) : "*" + key + "*";
        };
        return StringProvider;
    }());
    Marketing.StringProvider = StringProvider;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var ODataContract;
(function (ODataContract) {
    var AddListMembersListRequest = (function () {
        function AddListMembersListRequest(List, Members, membersType) {
            this.List = List;
            this.Members = Members;
            this.getMetadata = function () {
                return {
                    parameterTypes: {
                        List: {
                            typeName: Marketing.EntityFullTypeNames.List,
                            structuralProperty: 5 /* EntityType */,
                        },
                        Members: {
                            typeName: membersType,
                            structuralProperty: 4 /* Collection */,
                        }
                    },
                    operationName: "AddListMembersList",
                    operationType: 0 /* Action */
                };
            };
        }
        return AddListMembersListRequest;
    }());
    ODataContract.AddListMembersListRequest = AddListMembersListRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var ODataContract;
(function (ODataContract) {
    var CopyMembersListRequest = (function () {
        function CopyMembersListRequest(sourceList, targetList) {
            this.entity = sourceList;
            this.TargetList = targetList;
        }
        CopyMembersListRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    entity: {
                        typeName: Marketing.EntityFullTypeNames.List,
                        structuralProperty: 5 /* EntityType */,
                    },
                    TargetList: {
                        typeName: Marketing.EntityFullTypeNames.List,
                        structuralProperty: 5 /* EntityType */,
                    }
                },
                operationName: "CopyMembersList",
                operationType: 0 /* Action */
            };
            return metadata;
        };
        return CopyMembersListRequest;
    }());
    ODataContract.CopyMembersListRequest = CopyMembersListRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var ODataContract;
(function (ODataContract) {
    var ODataAssociateRequest = (function () {
        function ODataAssociateRequest(target, relationship, relatedEntities) {
            this.target = target;
            this.relationship = relationship;
            this.relatedEntities = relatedEntities;
        }
        ODataAssociateRequest.prototype.getMetadata = function () {
            return {
                boundParameter: "target",
                parameterTypes: {
                    "target": {
                        "typeName": "mscrm.crmbaseentity",
                        "structuralProperty": 5 /* EntityType */,
                    },
                    "relationship": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1 /* PrimitiveType */,
                    },
                    "relatedEntities": {
                        "typeName": "mscrm.crmbaseentity",
                        "structuralProperty": 4 /* Collection */,
                    },
                },
                operationName: "Associate",
                operationType: 2,
            };
        };
        return ODataAssociateRequest;
    }());
    ODataContract.ODataAssociateRequest = ODataAssociateRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var ODataContract;
(function (ODataContract) {
    var QualifyMemberListRequest = (function () {
        function QualifyMemberListRequest(list, ListMember, OverrideorRemove) {
            this.entity = list;
            this.ListMember = ListMember;
            this.OverrideorRemove = OverrideorRemove;
        }
        QualifyMemberListRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    entity: {
                        typeName: Marketing.EntityFullTypeNames.List,
                        structuralProperty: 5 /* EntityType */
                    },
                    ListMember: {
                        typeName: Marketing.EntityFullTypeNames.List,
                        structuralProperty: 4 /* Collection */
                    },
                    OverrideorRemove: {
                        typeName: Marketing.EntityFullTypeNames.Boolean,
                        structuralProperty: 1 /* PrimitiveType */
                    }
                },
                operationName: "QualifyMemberList",
                operationType: 0 /* Action */
            };
            return metadata;
        };
        return QualifyMemberListRequest;
    }());
    ODataContract.QualifyMemberListRequest = QualifyMemberListRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var ODataContract;
(function (ODataContract) {
    var RemoveMembersByFetchXmlListRequest = (function () {
        function RemoveMembersByFetchXmlListRequest(list, fetchXml, keepReturned) {
            this.entity = list;
            this.FetchXml = fetchXml;
            this.KeepReturned = keepReturned;
        }
        RemoveMembersByFetchXmlListRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    entity: {
                        typeName: Marketing.EntityFullTypeNames.List,
                        structuralProperty: 5 /* EntityType */
                    },
                    FetchXml: {
                        typeName: Marketing.EntityFullTypeNames.String,
                        structuralProperty: 1 /* PrimitiveType */
                    },
                    KeepReturned: {
                        typeName: Marketing.EntityFullTypeNames.Boolean,
                        structuralProperty: 1 /* PrimitiveType */
                    }
                },
                operationName: "RemoveMembersByFetchXmlList",
                operationType: 0 /* Action */
            };
            return metadata;
        };
        return RemoveMembersByFetchXmlListRequest;
    }());
    ODataContract.RemoveMembersByFetchXmlListRequest = RemoveMembersByFetchXmlListRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var ODataContract;
(function (ODataContract) {
    var RemoveMembersByIdsRequest = (function () {
        function RemoveMembersByIdsRequest(List, Members, membersType) {
            this.List = List;
            this.Members = Members;
            this.getMetadata = function () {
                return {
                    parameterTypes: {
                        List: {
                            typeName: Marketing.EntityFullTypeNames.List,
                            structuralProperty: 5 /* EntityType */
                        },
                        Members: {
                            typeName: membersType,
                            structuralProperty: 4 /* Collection */
                        }
                    },
                    operationName: "RemoveListMembersList",
                    operationType: 0 /* Action */
                };
            };
        }
        return RemoveMembersByIdsRequest;
    }());
    ODataContract.RemoveMembersByIdsRequest = RemoveMembersByIdsRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var ActivityDirectionCode = (function () {
        function ActivityDirectionCode() {
        }
        return ActivityDirectionCode;
    }());
    ActivityDirectionCode.Incoming = false;
    ActivityDirectionCode.Outgoing = true;
    Marketing.ActivityDirectionCode = ActivityDirectionCode;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var ActivityEntityFieldNames = (function () {
        function ActivityEntityFieldNames() {
        }
        return ActivityEntityFieldNames;
    }());
    ActivityEntityFieldNames.ActivityId = "activityid";
    ActivityEntityFieldNames.ActualDurationMinutes = "actualdurationminutes";
    ActivityEntityFieldNames.Description = "description";
    ActivityEntityFieldNames.DirectionCode = "directioncode";
    ActivityEntityFieldNames.IsBilled = "isbilled";
    ActivityEntityFieldNames.IsMapIPrivate = "ismapiprivate";
    ActivityEntityFieldNames.IsRegularActivity = "isregularactivity";
    ActivityEntityFieldNames.IsWorkflowCreated = "isworkflowcreated";
    ActivityEntityFieldNames.PriorityCode = "prioritycode";
    ActivityEntityFieldNames.ScheduledDurationMinutes = "scheduleddurationminutes";
    ActivityEntityFieldNames.ScheduledEnd = "scheduledend";
    ActivityEntityFieldNames.ScheduledStart = "scheduledstart";
    ActivityEntityFieldNames.StateCode = "statecode";
    ActivityEntityFieldNames.StatusCode = "statuscode";
    ActivityEntityFieldNames.Subject = "subject";
    ActivityEntityFieldNames.RegardingObjectid = "regardingobjectid";
    ActivityEntityFieldNames.To = "to";
    ActivityEntityFieldNames.From = "from";
    Marketing.ActivityEntityFieldNames = ActivityEntityFieldNames;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var AppointmentEntityFieldNames = (function () {
        function AppointmentEntityFieldNames() {
        }
        return AppointmentEntityFieldNames;
    }());
    AppointmentEntityFieldNames.IsAllDayEvent = "isalldayevent";
    AppointmentEntityFieldNames.Location = "location";
    AppointmentEntityFieldNames.RequiredAttendees = "requiredattendees";
    Marketing.AppointmentEntityFieldNames = AppointmentEntityFieldNames;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var EmailEntityFieldNames = (function () {
        function EmailEntityFieldNames() {
        }
        return EmailEntityFieldNames;
    }());
    EmailEntityFieldNames.Compressed = "compressed";
    EmailEntityFieldNames.CorrelationMethod = "correlationmethod";
    EmailEntityFieldNames.DeliveryReceiptRequested = "deliveryreceiptrequested";
    EmailEntityFieldNames.EmailActivityParties = "email_activity_parties";
    EmailEntityFieldNames.EmailReminderStatus = "emailreminderstatus";
    EmailEntityFieldNames.EmailReminderType = "emailremindertype";
    EmailEntityFieldNames.FollowEmailUserPreference = "followemailuserpreference";
    EmailEntityFieldNames.IsEmailFollowed = "isemailfollowed";
    EmailEntityFieldNames.IsEmailReminderSet = "isemailreminderset";
    EmailEntityFieldNames.Notifications = "notifications";
    EmailEntityFieldNames.ReadReceiptRequested = "readreceiptrequested";
    EmailEntityFieldNames.TemplateId = "templateid";
    EmailEntityFieldNames.ParticipationTypeMask = "participationtypemask";
    Marketing.EmailEntityFieldNames = EmailEntityFieldNames;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var ActivityPartyEntityFieldNames = (function () {
        function ActivityPartyEntityFieldNames() {
        }
        return ActivityPartyEntityFieldNames;
    }());
    ActivityPartyEntityFieldNames.FirstName = "firstname";
    ActivityPartyEntityFieldNames.LastName = "lastname";
    ActivityPartyEntityFieldNames.Email = "emailaddress1";
    Marketing.ActivityPartyEntityFieldNames = ActivityPartyEntityFieldNames;
})(Marketing || (Marketing = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Marketing;
(function (Marketing) {
    var _this = this;
    var CampaignCommonLibrary = (function () {
        function CampaignCommonLibrary() {
        }
        CampaignCommonLibrary.getLookupOptions = function (entityName, parentId) {
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
        CampaignCommonLibrary.getLookupOptionsLegacy = function (entityType, entityName, parent) {
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
        CampaignCommonLibrary.refreshAssociatedMarketingListsSubgrid = function (associationName, entityType, selectedControl) {
            if (ClientUtility.ClientUtils.isUCI()) {
                if (selectedControl) {
                    selectedControl.refresh();
                }
            }
            else {
                Xrm.Internal.refreshParentGrid(entityType, Marketing.ClientUtil.getEntityName(entityType), "");
            }
        };
        CampaignCommonLibrary.closeDialogIfList = function (entityType) {
            if (entityType === Marketing.EntityTypeCodes.List) {
                Marketing.DialogUtil.closeDialog();
            }
        };
        return CampaignCommonLibrary;
    }());
    CampaignCommonLibrary.locAssocCampaign = function (entityType, assocSubValueType, associationName, roleOrdinal, parentId, parentObjectTypeCode, selectedControl, isSymmetric) { return __awaiter(_this, void 0, void 0, function () {
        var entityName, parent, lookupOptions, lookupItems, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    entityName = Marketing.ClientUtil.getEntityName(entityType);
                    parent = CampaignCommonLibrary.getParentObject(parentId, parentObjectTypeCode);
                    lookupOptions = ClientUtility.ClientUtils.isUCI()
                        ? CampaignCommonLibrary.getLookupOptions(entityName, parentId)
                        : CampaignCommonLibrary.getLookupOptionsLegacy(entityType, entityName, parent);
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
                case 2: return [4 /*yield*/, CampaignCommonLibrary.openListAssociationDialog(lookupItems, entityType, assocSubValueType, associationName, roleOrdinal, parent, selectedControl)];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, CampaignCommonLibrary.locAssocCampaignAction(lookupItems, entityType, assocSubValueType, associationName, roleOrdinal, parent, selectedControl, isSymmetric)];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    CampaignCommonLibrary.getParentObject = function (parentId, parentObjectTypeCode) {
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
    CampaignCommonLibrary.openListAssociationDialog = function (lookupItems, entityType, assocSubValueType, associationName, roleOrdinal, parent, selectedControl) { return __awaiter(_this, void 0, void 0, function () {
        var options, dialogParams;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!ClientUtility.DataUtil.isNullOrUndefined(lookupItems)) return [3 /*break*/, 2];
                    options = {
                        height: Marketing.CampaignCommonConstants.ListCampaignAssociationDialogHeight,
                        width: Marketing.CampaignCommonConstants.ListCampaignAssociationDialogWidth,
                        position: 1 /* center */
                    };
                    dialogParams = {};
                    dialogParams[Marketing.CampaignCommonConstants.LookupItems] = lookupItems;
                    dialogParams[Marketing.CampaignCommonConstants.EntityType] = entityType;
                    dialogParams[Marketing.CampaignCommonConstants.AssociationSubValueType] = assocSubValueType;
                    dialogParams[Marketing.CampaignCommonConstants.AssociationName] = associationName;
                    dialogParams[Marketing.CampaignCommonConstants.RoleOrdinal] = roleOrdinal;
                    dialogParams[Marketing.CampaignCommonConstants.ParentEntity] = parent;
                    return [4 /*yield*/, Xrm.Navigation.openDialog(Marketing.DialogName.ListCampaignAssociacion, options, dialogParams)];
                case 1:
                    _a.sent();
                    CampaignCommonLibrary.refreshAssociatedMarketingListsSubgrid(associationName, entityType, selectedControl);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    CampaignCommonLibrary.locAssocCampaignAction = function (lookupItems, entityType, assocSubValueType, associationName, roleOrdinal, parent, selectedControl, isSymmetric) { return __awaiter(_this, void 0, void 0, function () {
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
                    return [4 /*yield*/, CampaignCommonLibrary.associateObjects(lookupItems, entityType, assocSubValueType, roleOrdinal, parent, associationName, isSymmetric)];
                case 2:
                    _a.sent();
                    CampaignCommonLibrary.refreshAssociatedMarketingListsSubgrid(associationName, entityType, selectedControl);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    if (ClientUtility.ClientUtils.isUCI()) {
                        errorOccured = true;
                        CampaignCommonLibrary.closeDialogIfList(entityType);
                    }
                    ClientUtility.ActionFailedHandler.actionFailedCallback(error_1);
                    return [3 /*break*/, 4];
                case 4:
                    if (!errorOccured) {
                        CampaignCommonLibrary.closeDialogIfList(entityType);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    CampaignCommonLibrary.associateObjects = function (lookupItems, typeCode, assocSubValueType, roleOrdinal, parent, associationName, isSymmetric) { return __awaiter(_this, void 0, void 0, function () {
        var roleOrdinalActionStatus, addCampaignItemRequests, parentEntityName, parentEntity, _i, lookupItems_1, item, entityName, childEntity, request, error_2, proposedStatusCode, selectCampaignActivities, response, addCampaignActivityItemRequests_1;
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
                    error_2.message = Marketing.StringProvider.getErrorCodeString(error_2.errorCode);
                    throw error_2;
                case 4:
                    if (!assocSubValueType.endsWith("addtoCA")) return [3 /*break*/, 7];
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
                    if (!(addCampaignActivityItemRequests_1.length > 0)) return [3 /*break*/, 7];
                    return [4 /*yield*/, Xrm.WebApi.online.executeMultiple(addCampaignActivityItemRequests_1)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    }); };
    Marketing.CampaignCommonLibrary = CampaignCommonLibrary;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var CampaignCommonConstants = (function () {
        function CampaignCommonConstants() {
        }
        return CampaignCommonConstants;
    }());
    CampaignCommonConstants.AssociationDestination = "associationDestination";
    CampaignCommonConstants.LookupItems = "lookup_items";
    CampaignCommonConstants.EntityType = "entity_type";
    CampaignCommonConstants.AssociationSubValueType = "association_sub_value_type";
    CampaignCommonConstants.AssociationName = "association_name";
    CampaignCommonConstants.RoleOrdinal = "role_ordinal";
    CampaignCommonConstants.ParentEntity = "parent_entity";
    CampaignCommonConstants.CampaignItem = "campaignitem";
    CampaignCommonConstants.ListCampaignAssociationDialogWidth = 850;
    CampaignCommonConstants.ListCampaignAssociationDialogHeight = 250;
    Marketing.CampaignCommonConstants = CampaignCommonConstants;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var CampaignActivityState;
    (function (CampaignActivityState) {
        CampaignActivityState[CampaignActivityState["Open"] = 0] = "Open";
        CampaignActivityState[CampaignActivityState["Closed"] = 1] = "Closed";
        CampaignActivityState[CampaignActivityState["Canceled"] = 2] = "Canceled";
    })(CampaignActivityState = Marketing.CampaignActivityState || (Marketing.CampaignActivityState = {}));
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var CampaignActivityCommonConstants = (function () {
        function CampaignActivityCommonConstants() {
        }
        return CampaignActivityCommonConstants;
    }());
    CampaignActivityCommonConstants.RegardingObjectId = "regardingobjectid";
    Marketing.CampaignActivityCommonConstants = CampaignActivityCommonConstants;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var CampaignActivityEntityFieldNames = (function () {
        function CampaignActivityEntityFieldNames() {
        }
        return CampaignActivityEntityFieldNames;
    }());
    CampaignActivityEntityFieldNames.StatusCode = "statuscode";
    Marketing.CampaignActivityEntityFieldNames = CampaignActivityEntityFieldNames;
})(Marketing || (Marketing = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Marketing;
(function (Marketing) {
    var _this = this;
    var CampaignActivityCommonLibrary = (function () {
        function CampaignActivityCommonLibrary() {
        }
        CampaignActivityCommonLibrary.getRegardingCampaignId = function () {
            var regardingObjectId = ClientUtility.PageUtil.getAttributeValue(Marketing.CampaignActivityCommonConstants.RegardingObjectId);
            return ClientUtility.Guid.create(regardingObjectId[0].id);
        };
        CampaignActivityCommonLibrary.getListsWithEntityIdsFilter = function (lists) {
            if (lists.length > 0) {
                var condition_1 = function (id) { return "<condition attribute='" + Marketing.ListEntityFieldNames.ListId + "' operator='eq' value='" + id + "' />"; };
                var conditionsBuilder = function (acc, item) {
                    return acc + condition_1(item[Marketing.CampaignItemEntityFieldNames.EntityId]);
                };
                var conditions = lists.reduce(conditionsBuilder, "");
                return "<filter type='or'>" + conditions + "</filter>";
            }
            else {
                var conditions = "<condition attribute='" + Marketing.ListEntityFieldNames.ListId + "' operator='eq' value='00000000-0000-0000-0000-000000000000' />";
                return "<filter type='or'>" + conditions + "</filter>";
            }
        };
        CampaignActivityCommonLibrary.getAddListToCampaignActivityLookupOptions = function (entityName, viewId, additionalProperties) {
            if (additionalProperties === void 0) { additionalProperties = {}; }
            var lookupOptions = {};
            var t = Xrm.LookupObject;
            if (ClientUtility.ClientUtil.isUCI()) {
                lookupOptions = {
                    allowMultiSelect: true,
                    defaultEntityType: entityName,
                    entityTypes: [entityName],
                };
            }
            else {
                lookupOptions = {
                    dataProviderOverride: "",
                    lookupStyle: Xrm.LookupStyle.multi,
                    lookupTypes: [entityName],
                    defaultViewId: viewId
                };
            }
            Object.keys(additionalProperties).forEach(function (k) {
                lookupOptions[k] = additionalProperties[k];
            });
            return lookupOptions;
        };
        CampaignActivityCommonLibrary.associateList = function (selectedList, roleOrdinal, parentEntity, entityTypeCode) {
            return __awaiter(this, void 0, void 0, function () {
                var childEntity, temp, request;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            childEntity = {
                                entityType: Marketing.ClientUtil.getEntityName(entityTypeCode),
                                id: ClientUtility.Guid.tryCreate(selectedList.id)
                            };
                            if (roleOrdinal === "2") {
                                temp = parentEntity;
                                parentEntity = childEntity;
                                childEntity = temp;
                            }
                            request = new ODataContract.AddItemCampaignActivityRequest({ id: parentEntity.id, entityType: "campaignactivity", primaryKey: "activityid" }, { id: childEntity.id, entityType: childEntity.entityType });
                            return [4 /*yield*/, Xrm.WebApi.online.execute(request)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        CampaignActivityCommonLibrary.refreshAssociatedMarketingListsSubgrid = function (associationName, entityType, selectedControl) {
            if (ClientUtility.ClientUtils.isUCI()) {
                if (selectedControl != null) {
                    selectedControl.refresh();
                }
            }
            else {
                Xrm.Internal.refreshParentGrid(entityType, Marketing.ClientUtil.getEntityName(entityType), "");
            }
        };
        return CampaignActivityCommonLibrary;
    }());
    CampaignActivityCommonLibrary.locAssocObjCampaignActivity = function (entityTypeCode, subType, associationName, roleOrdinal, parentId, parentObjectTypeCode, selectedControl) { return __awaiter(_this, void 0, void 0, function () {
        var parent, selectListsLookupOptions, entityName, _a, viewId, lists, additionalParams, selectedLists, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    parent = CampaignActivityCommonLibrary.getParentObject(parentId, parentObjectTypeCode);
                    selectListsLookupOptions = {};
                    entityName = Xrm.Internal.getEntityName(entityTypeCode);
                    _a = entityTypeCode;
                    switch (_a) {
                        case Marketing.EntityTypeCodes.List: return [3 /*break*/, 1];
                    }
                    return [3 /*break*/, 3];
                case 1:
                    viewId = Marketing.ListViewIds.ListsForCampaign;
                    return [4 /*yield*/, CampaignActivityCommonLibrary.getListsForCampaignActivity()];
                case 2:
                    lists = _b.sent();
                    additionalParams = {
                        additionalParams: { campaignActivityId: parentId },
                        disableViewPicker: true,
                        showProperties: true,
                        disableMru: true,
                        filters: [{
                                filterXml: CampaignActivityCommonLibrary.getListsWithEntityIdsFilter(lists),
                                entityLogicalName: entityName
                            }],
                    };
                    selectListsLookupOptions = CampaignActivityCommonLibrary.getAddListToCampaignActivityLookupOptions(entityName, viewId, additionalParams);
                    return [3 /*break*/, 4];
                case 3:
                    selectListsLookupOptions = CampaignActivityCommonLibrary.getAddListToCampaignActivityLookupOptions(entityName, viewId);
                    return [3 /*break*/, 4];
                case 4:
                    _b.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, Xrm.Utility.lookupObjects(selectListsLookupOptions)];
                case 5:
                    selectedLists = _b.sent();
                    CampaignActivityCommonLibrary.associateCampaignActivityAction(selectedLists, entityTypeCode, associationName, roleOrdinal, parent, selectedControl);
                    return [3 /*break*/, 7];
                case 6:
                    error_3 = _b.sent();
                    // Rejecting the promise on dialog closing, error is undefined in this case
                    if (!ClientUtility.DataUtil.isNullOrUndefined(error_3)) {
                        ClientUtility.ActionFailedHandler.actionFailedCallback(error_3);
                    }
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    CampaignActivityCommonLibrary.getParentObject = function (parentId, parentObjectTypeCode) {
        if ((ClientUtility.DataUtil.isNullOrEmptyString(parentId) ||
            ClientUtility.DataUtil.isNullOrUndefined(parentObjectTypeCode)) &&
            !ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data.entity)) {
            var typeName = Xrm.Page.data.entity.getEntityName();
            parentObjectTypeCode = Xrm.Internal.getEntityCode(typeName);
            parentId = Xrm.Page.data.entity.getId();
        }
        var parameters = [parentId, parentObjectTypeCode];
        return parameters;
    };
    CampaignActivityCommonLibrary.getListsForCampaignActivity = function () { return __awaiter(_this, void 0, void 0, function () {
        var campaignId, entityIdFieldName, campaignIdFieldName, selectCampaignActivities, records;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    campaignId = CampaignActivityCommonLibrary.getRegardingCampaignId();
                    entityIdFieldName = Marketing.CampaignItemEntityFieldNames.EntityId;
                    campaignIdFieldName = Marketing.CampaignItemODataFieldNames.CampaignId;
                    selectCampaignActivities = "?$select=" + entityIdFieldName + "&$filter=" + campaignIdFieldName + " eq " + campaignId;
                    return [4 /*yield*/, Xrm.WebApi.online.retrieveMultipleRecords(Marketing.EntityNames.CampaignItem, selectCampaignActivities)];
                case 1:
                    records = _a.sent();
                    return [2 /*return*/, records.entities];
            }
        });
    }); };
    CampaignActivityCommonLibrary.associateCampaignActivityAction = function (selectedLists, entityTypeCode, associationName, roleOrdinal, parent, selectedControl) { return __awaiter(_this, void 0, void 0, function () {
        var startTime, parentEntity, lastException, _i, selectedLists_1, selectedList, ex_1, endTime, duration, lists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(selectedLists && selectedLists.length > 0)) return [3 /*break*/, 7];
                    startTime = performance.now();
                    roleOrdinal = ClientUtility.DataUtil.isNullOrUndefined(roleOrdinal) ? "-1" : roleOrdinal;
                    parentEntity = {
                        entityType: Marketing.ClientUtil.getEntityName(parent[1]),
                        id: ClientUtility.Guid.create(parent[0].toString())
                    };
                    _i = 0, selectedLists_1 = selectedLists;
                    _a.label = 1;
                case 1:
                    if (!(_i < selectedLists_1.length)) return [3 /*break*/, 6];
                    selectedList = selectedLists_1[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, CampaignActivityCommonLibrary.associateList(selectedList, roleOrdinal, parentEntity, entityTypeCode)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    ex_1 = _a.sent();
                    //In order to avoid multiple error dialogs for each failure, only sending last exception thrown
                    lastException = ex_1;
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    if (!ClientUtility.DataUtil.isNullOrUndefined(lastException)) {
                        ClientUtility.ActionFailedHandler.actionFailedCallback(lastException);
                    }
                    CampaignActivityCommonLibrary.refreshAssociatedMarketingListsSubgrid(associationName, entityTypeCode, selectedControl);
                    endTime = performance.now();
                    duration = endTime - startTime;
                    lists = selectedLists;
                    Marketing.EMTelemetry.LogInfo(Marketing.TelemetryConstants.CampaignActivity, "CampaignActivityCommonLibrary", "associateCampaignActivityAction", "Add lists to Campaign Activity", "Clicked", "Mscrm.AddExistingRecordFromSubGridAssociated", [
                        {
                            name: "CampaignActivityId",
                            value: parentEntity.id
                        },
                        {
                            name: "SelectedListsCount",
                            value: selectedLists.length
                        },
                        {
                            name: "SelectedLists",
                            value: lists.map(function (list) { return list.id; }).toString()
                        },
                        {
                            name: "Duration",
                            value: duration
                        }
                    ], Marketing.LogType.CustomerIntelligence);
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    }); };
    Marketing.CampaignActivityCommonLibrary = CampaignActivityCommonLibrary;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var CampaignActivityItemEntityFieldNames = (function () {
        function CampaignActivityItemEntityFieldNames() {
        }
        return CampaignActivityItemEntityFieldNames;
    }());
    CampaignActivityItemEntityFieldNames.ItemId = "itemid";
    Marketing.CampaignActivityItemEntityFieldNames = CampaignActivityItemEntityFieldNames;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var CampaignItemEntityFieldNames = (function () {
        function CampaignItemEntityFieldNames() {
        }
        return CampaignItemEntityFieldNames;
    }());
    CampaignItemEntityFieldNames.EntityId = "entityid";
    Marketing.CampaignItemEntityFieldNames = CampaignItemEntityFieldNames;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var CampaignItemODataFieldNames = (function () {
        function CampaignItemODataFieldNames() {
        }
        return CampaignItemODataFieldNames;
    }());
    CampaignItemODataFieldNames.CampaignId = "_campaignid_value";
    Marketing.CampaignItemODataFieldNames = CampaignItemODataFieldNames;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var CampaignResponseAction;
    (function (CampaignResponseAction) {
        CampaignResponseAction[CampaignResponseAction["Promote"] = 0] = "Promote";
    })(CampaignResponseAction = Marketing.CampaignResponseAction || (Marketing.CampaignResponseAction = {}));
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var CampaignResponseChannelOptionSetValues;
    (function (CampaignResponseChannelOptionSetValues) {
        CampaignResponseChannelOptionSetValues[CampaignResponseChannelOptionSetValues["None"] = -1] = "None";
        CampaignResponseChannelOptionSetValues[CampaignResponseChannelOptionSetValues["Email"] = 1] = "Email";
        CampaignResponseChannelOptionSetValues[CampaignResponseChannelOptionSetValues["Phone"] = 2] = "Phone";
        CampaignResponseChannelOptionSetValues[CampaignResponseChannelOptionSetValues["Fax"] = 3] = "Fax";
        CampaignResponseChannelOptionSetValues[CampaignResponseChannelOptionSetValues["Letter"] = 4] = "Letter";
        CampaignResponseChannelOptionSetValues[CampaignResponseChannelOptionSetValues["Appointment"] = 5] = "Appointment";
        CampaignResponseChannelOptionSetValues[CampaignResponseChannelOptionSetValues["Others"] = 6] = "Others";
    })(CampaignResponseChannelOptionSetValues = Marketing.CampaignResponseChannelOptionSetValues || (Marketing.CampaignResponseChannelOptionSetValues = {}));
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var CampaignResponseConstants = (function () {
        function CampaignResponseConstants() {
        }
        return CampaignResponseConstants;
    }());
    CampaignResponseConstants.action = "action";
    CampaignResponseConstants.activityid = "activityid";
    CampaignResponseConstants.campaignResponse = "campaignresponse";
    CampaignResponseConstants.channeltypecode = "channeltypecode";
    CampaignResponseConstants.companyname = "companyname";
    CampaignResponseConstants.createFromId = "_CreateFromId";
    CampaignResponseConstants.createFromType = "_CreateFromType";
    CampaignResponseConstants.customer = "customer";
    CampaignResponseConstants.emailaddress = "emailaddress";
    CampaignResponseConstants.firstname = "firstname";
    CampaignResponseConstants.lastname = "lastname";
    CampaignResponseConstants.originatingActivityId = "originatingactivityid";
    CampaignResponseConstants.parentRecordId = "pId";
    CampaignResponseConstants.parentRecordName = "pName";
    CampaignResponseConstants.parentRecordType = "pType";
    CampaignResponseConstants.parentRecordIdUCI = "parentrecordid";
    CampaignResponseConstants.parentRecordNameUCI = "parentrecordname";
    CampaignResponseConstants.parentRecordTypeUCI = "parentrecordtype";
    CampaignResponseConstants.prioritycode = "prioritycode";
    CampaignResponseConstants.receivedon = "receivedon";
    CampaignResponseConstants.regardingobjectid = "regardingobjectid";
    CampaignResponseConstants.statecode = "statecode";
    CampaignResponseConstants.subject = "subject";
    CampaignResponseConstants.telephone = "telephone";
    CampaignResponseConstants.yomicompanyname = "yomicompanyname";
    CampaignResponseConstants.yomifirstname = "yomifirstname";
    CampaignResponseConstants.yomilastname = "yomilastname";
    Marketing.CampaignResponseConstants = CampaignResponseConstants;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var CampaignResponseState;
    (function (CampaignResponseState) {
        CampaignResponseState[CampaignResponseState["Open"] = 0] = "Open";
        CampaignResponseState[CampaignResponseState["Closed"] = 1] = "Closed";
        CampaignResponseState[CampaignResponseState["Canceled"] = 2] = "Canceled";
    })(CampaignResponseState = Marketing.CampaignResponseState || (Marketing.CampaignResponseState = {}));
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var CheckboxState;
    (function (CheckboxState) {
        CheckboxState[CheckboxState["Off"] = 0] = "Off";
        CheckboxState[CheckboxState["On"] = 1] = "On";
    })(CheckboxState = Marketing.CheckboxState || (Marketing.CheckboxState = {}));
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var ClientUtil = (function () {
        function ClientUtil() {
        }
        ClientUtil.getEntityName = function (entityTypeCode) {
            switch (entityTypeCode) {
                case Marketing.EntityTypeCodes.Account: return Marketing.EntityNames.Account;
                case Marketing.EntityTypeCodes.Appointment: return Marketing.EntityNames.Appointment;
                case Marketing.EntityTypeCodes.BulkOperation: return Marketing.EntityNames.BulkOperation;
                case Marketing.EntityTypeCodes.Campaign: return Marketing.EntityNames.Campaign;
                case Marketing.EntityTypeCodes.CampaignActivity: return Marketing.EntityNames.CampaignActivity;
                case Marketing.EntityTypeCodes.CampaignResponse: return Marketing.EntityNames.CampaignResponse;
                case Marketing.EntityTypeCodes.Contact: return Marketing.EntityNames.Contact;
                case Marketing.EntityTypeCodes.Email: return Marketing.EntityNames.Email;
                case Marketing.EntityTypeCodes.Fax: return Marketing.EntityNames.Fax;
                case Marketing.EntityTypeCodes.Lead: return Marketing.EntityNames.Lead;
                case Marketing.EntityTypeCodes.Letter: return Marketing.EntityNames.Letter;
                case Marketing.EntityTypeCodes.List: return Marketing.EntityNames.List;
                case Marketing.EntityTypeCodes.ListMember: return Marketing.EntityNames.ListMember;
                case Marketing.EntityTypeCodes.Opportunity: return Marketing.EntityNames.Opportunity;
                case Marketing.EntityTypeCodes.PhoneCall: return Marketing.EntityNames.PhoneCall;
                case Marketing.EntityTypeCodes.Product: return Marketing.EntityNames.Product;
                case Marketing.EntityTypeCodes.Queue: return Marketing.EntityNames.Queue;
                case Marketing.EntityTypeCodes.Quote: return Marketing.EntityNames.Quote;
                case Marketing.EntityTypeCodes.SalesLiterature: return Marketing.EntityNames.SalesLiterature;
                case Marketing.EntityTypeCodes.SalesOrder: return Marketing.EntityNames.SalesOrder;
                case Marketing.EntityTypeCodes.SystemUser: return Marketing.EntityNames.SystemUser;
                case Marketing.EntityTypeCodes.Team: return Marketing.EntityNames.Team;
                case Marketing.EntityTypeCodes.TransactionCurrency: return Marketing.EntityNames.TransactionCurrency;
                case Marketing.EntityTypeCodes.None: return null;
                default: return Xrm.Internal.getEntityName(entityTypeCode);
            }
        };
        ClientUtil.getEntityTypeCode = function (entityName) {
            switch (entityName) {
                case Marketing.EntityNames.Account: return Marketing.EntityTypeCodes.Account;
                case Marketing.EntityNames.Appointment: return Marketing.EntityTypeCodes.Appointment;
                case Marketing.EntityNames.BulkOperation: return Marketing.EntityTypeCodes.BulkOperation;
                case Marketing.EntityNames.Campaign: return Marketing.EntityTypeCodes.Campaign;
                case Marketing.EntityNames.CampaignActivity: return Marketing.EntityTypeCodes.CampaignActivity;
                case Marketing.EntityNames.CampaignResponse: return Marketing.EntityTypeCodes.CampaignResponse;
                case Marketing.EntityNames.Contact: return Marketing.EntityTypeCodes.Contact;
                case Marketing.EntityNames.Email: return Marketing.EntityTypeCodes.Email;
                case Marketing.EntityNames.Fax: return Marketing.EntityTypeCodes.Fax;
                case Marketing.EntityNames.Lead: return Marketing.EntityTypeCodes.Lead;
                case Marketing.EntityNames.Letter: return Marketing.EntityTypeCodes.Letter;
                case Marketing.EntityNames.List: return Marketing.EntityTypeCodes.List;
                case Marketing.EntityNames.ListMember: return Marketing.EntityTypeCodes.ListMember;
                case Marketing.EntityNames.Opportunity: return Marketing.EntityTypeCodes.Opportunity;
                case Marketing.EntityNames.PhoneCall: return Marketing.EntityTypeCodes.PhoneCall;
                case Marketing.EntityNames.Product: return Marketing.EntityTypeCodes.Product;
                case Marketing.EntityNames.Quote: return Marketing.EntityTypeCodes.Quote;
                case Marketing.EntityNames.Queue: return Marketing.EntityTypeCodes.Queue;
                case Marketing.EntityNames.SalesLiterature: return Marketing.EntityTypeCodes.SalesLiterature;
                case Marketing.EntityNames.SalesOrder: return Marketing.EntityTypeCodes.SalesOrder;
                case Marketing.EntityNames.SystemUser: return Marketing.EntityTypeCodes.SystemUser;
                case Marketing.EntityNames.Team: return Marketing.EntityTypeCodes.Team;
                case Marketing.EntityNames.TransactionCurrency: return Marketing.EntityTypeCodes.TransactionCurrency;
                case Marketing.EntityNames.None: return null;
            }
        };
        ClientUtil.enforceStateTransitions = function (entityName) {
            var isMobileClient = Xrm.Page.context.client.getClient() === Xrm.Constants.ClientNames.mobile;
            if (isMobileClient) {
                switch (entityName) {
                    case Marketing.EntityNames.CampaignResponse:
                        return false;
                    default:
                        throw new Error("Not a valid entity type");
                }
            }
            return false;
        };
        ClientUtil.isOutlookHosted = function () {
            return Xrm.Page.context.client.getClient() === Xrm.Constants.ClientNames.outlook;
        };
        ClientUtil.isUCI = function () {
            return ClientUtility.ClientUtil.isUCI();
        };
        ClientUtil.openAlertDialog = function (alertDialogStrings, options) {
            if (ClientUtility.ClientUtil.isUCI()) {
                if (options) {
                    return Xrm.Navigation.openAlertDialog(alertDialogStrings, options);
                }
                else {
                    return Xrm.Navigation.openAlertDialog(alertDialogStrings);
                }
            }
            // For WebClient, we have to use the Xrm.AlertDialogStrings type
            var wrappedAlertDialogStrings = new Xrm.AlertDialogStrings();
            wrappedAlertDialogStrings.text = alertDialogStrings.text;
            wrappedAlertDialogStrings.confirmButtonLabel = alertDialogStrings.confirmButtonLabel;
            if (options) {
                return Xrm.Navigation.openAlertDialog(wrappedAlertDialogStrings, options);
            }
            else {
                return Xrm.Navigation.openAlertDialog(wrappedAlertDialogStrings);
            }
        };
        ClientUtil.alert = function (key) {
            ClientUtil.openAlertDialog({ text: Marketing.StringProvider.getResourceString(key) });
        };
        ClientUtil.createWithParameters = function (object, func, parameters) {
            return function (retValue) {
                parameters.unshift(retValue);
                return func.apply(object, parameters);
            };
        };
        /**
         * This method fixes the issue in IE where .children is not available.
         */
        ClientUtil.children = function (element) {
            if (!!element.children) {
                return element.children;
            }
            var nodes = element.childNodes;
            var children = [];
            for (var it = nodes.length - 1; it >= 0; --it) {
                var node = nodes[it];
                if (node.nodeType === 1) {
                    children.push(node);
                }
            }
            return children;
        };
        ClientUtil.getDefaultAttributesList = function () {
            return {
                "appointment": ["prioritycode", "subject", "location", "isalldayevent", "scheduledstart", "scheduledend", "scheduleddurationminutes", "description", "modifiedon", "createdon",
                    "exchangerate", "modifiedby", "createdby", "owningteam", "owninguser", "createdonbehalfby", "modifiedonbehalfby", "optionalattendees", "organizer",
                    "requiredattendees", "versionnumber", "regardingobjectid", "activityid", "activitytypecode", "attachmentcount", "attachmenterrors", "importsequencenumber",
                    "instancetypecode", "ismapiprivate", "isunsafe", "modifiedfieldsmask", "overriddencreatedon", "ownerid", "owningbusinessunit", "processid", "seriesid",
                    "slainvokedid", "statecode", "statuscode"],
                "email": ["prioritycode", "scheduledend", "sender", "subject", "actualdurationminutes", "from", "to", "cc", "bcc", "createdby", "modifiedby", "createdon",
                    "modifiedon", "owningteam", "owninguser", "createdonbehalfby", "modifiedonbehalfby", "versionnumber", "exchangerate", "regardingobjectid", "emailsendername",
                    "activitytypecode", "attachmentcount", "attachmentopencount", "correlationmethod", "emailreminderstatus", "emailsender", "inreplyto", "isemailfollowed", "isemailreminderset",
                    "isunsafe", "linksclickedcount", "onholdtime", "opencount", "overriddencreatedon", "ownerid", "owningbusinessunit", "postponeemailprocessinguntil", "processid", "replycount",
                    "scheduleddurationminutes", "sendermailboxid", "sendersaccount", "senton", "serviceid", "slainvokedid", "statecode", "statuscode", "templateid", "actualstart", "actualend"],
                "fax": ["prioritycode", "scheduledend", "subject", "description", "actualdurationminutes", "createdonbehalfby", "modifiedonbehalfby", "modifiedon", "createdon",
                    "owningteam", "owninguser", "createdby", "modifiedby", "from", "to", "versionnumber", "exchangerate", "regardingobjectid", "activitytypecode", "onholdtime", "overriddencreatedon",
                    "ownerid", "owningbusinessunit", "processid", "scheduleddurationminutes", "serviceid", "slainvokedid", "statecode", "statuscode", "stageid"],
                "letter": ["prioritycode", "scheduledend", "subject", "description", "actualdurationminutes", "createdon", "modifiedon", "modifiedonbehalfby", "createdonbehalfby",
                    "createdby", "modifiedby", "owninguser", "owningteam", "from", "to", "cc", "bcc", "versionnumber", "exchangerate", "regardingobjectid", "activitytypecode", "onholdtime", "overriddencreatedon",
                    "ownerid", "owningbusinessunit", "processid", "scheduleddurationminutes", "serviceid", "slainvokedid", "statecode", "statuscode", "stageid"],
                "phonecall": ["prioritycode", "scheduledend", "subject", "description", "actualdurationminutes", "createdon", "modifiedon", "modifiedonbehalfby", "createdonbehalfby", "owninguser",
                    "owningteam", "createdby", "modifiedby", "from", "to", "versionnumber", "exchangerate", "regardingobjectid", "activitytypecode", "onholdtime", "overriddencreatedon",
                    "ownerid", "owningbusinessunit", "processid", "scheduleddurationminutes", "serviceid", "slainvokedid", "statecode", "statuscode"],
                "opportunity": ["name", "budgetamount", "parentcontactid", "estimatedvalue", "accountid", "estimatedclosedate", "customerneed", "createdon", "modifiedon", "owningteam", "owninguser",
                    "createdby", "modifiedby", "modifiedonbehalfby", "createdonbehalfby", "versionnumber", "exchangerate", "actualvalue_base", "budgetamount_base", "captureproposalfeedbackname",
                    "discountamount_base", "estimatedvalue_base", "freightamount_base", "onholdtime", "opportunityid", "overriddencreatedon", "ownerid", "owningbusinessunit", "processid",
                    "slainvokedid", "statecode", "statuscode", "stageid", "stepid", "timespentbymeonemailandmeetings", "totalamount", "totalamount_base", "totalamountlessfreight",
                    "totalamountlessfreight_base", "totaldiscountamount", "totaldiscountamount_base", "totallineitemamount", "totallineitemamount_base", "totallineitemdiscountamount",
                    "totallineitemdiscountamount_base", "totaltax", "totaltax_base"]
            };
        };
        /**
         * Helper function used to make an Odata web request
         * @param url
         */
        ClientUtil.getODataRequest = function (url) {
            return window.parent.$.ajax({
                url: url,
                type: 'GET',
                async: true,
                beforeSend: function (request) {
                    request.setRequestHeader("OData-MaxVersion", "4.0");
                    request.setRequestHeader("OData-Version", "4.0");
                    request.setRequestHeader("Accept", "application/json");
                    request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                }
            });
        };
        ClientUtil.retrieveAttributes = function (entityName) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var attributeFetchUrl, url, attributeUrl;
                return __generator(this, function (_a) {
                    attributeFetchUrl = "/api/data/v9.0/marketingformdisplayattributesset?$filter=entitylogicalname eq '{0}' &$select=displayattributelist";
                    url = String.format(attributeFetchUrl, entityName);
                    attributeUrl = Xrm.Page.context.getClientUrl() + url;
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            _this.getODataRequest(attributeUrl).then(function (response) {
                                if (response && response.value && response.value.length > 0 && response.value[0].displayattributelist) {
                                    var attributeFetchedResult = JSON.parse(response.value[0].displayattributelist);
                                    var defaultAttributes = ClientUtil.getDefaultAttributesList();
                                    var staticAttributes = defaultAttributes[entityName];
                                    var uniqueAttributes = [];
                                    for (var _i = 0, attributeFetchedResult_1 = attributeFetchedResult; _i < attributeFetchedResult_1.length; _i++) {
                                        var value = attributeFetchedResult_1[_i];
                                        if (staticAttributes.indexOf(value) === -1) {
                                            uniqueAttributes.push(value.toLowerCase());
                                        }
                                    }
                                    attributeFetchedResult = uniqueAttributes;
                                    var selectUrl = "&$select=LogicalName,DisplayName,RequiredLevel";
                                    var filterURL = "";
                                    var fetchUrl = "/api/data/v9.0/EntityDefinitions(LogicalName='" + entityName + "')/Attributes?$filter=";
                                    var firstAttributeAdded = false;
                                    for (var index in attributeFetchedResult) {
                                        if (firstAttributeAdded) {
                                            filterURL = filterURL + ("or LogicalName eq '" + attributeFetchedResult[index] + "' ");
                                        }
                                        else {
                                            filterURL = filterURL + (" LogicalName eq '" + attributeFetchedResult[index] + "' ");
                                            firstAttributeAdded = true;
                                        }
                                    }
                                    fetchUrl = fetchUrl + filterURL + selectUrl;
                                    return resolve(fetchUrl);
                                }
                                return resolve(null);
                            }, function (errorResponse) {
                                return resolve(null);
                            });
                        })];
                });
            });
        };
        ClientUtil.retrieveAttributesMetadata = function (fetchUrl) {
            return __awaiter(this, void 0, void 0, function () {
                var attributeMetadataUrl;
                return __generator(this, function (_a) {
                    attributeMetadataUrl = Xrm.Page.context.getClientUrl() + fetchUrl;
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            ClientUtil.getODataRequest(attributeMetadataUrl).then(function (response) {
                                resolve(response);
                            });
                        })];
                });
            });
        };
        ClientUtil.AddActivityDataValidationMessages = function (attributes) {
            var messages = [];
            attributes.forEach(function (attribute) {
                if (attribute.validationErrorMessage) {
                    messages.push(attribute.validationErrorMessage);
                }
            });
            return messages;
        };
        ClientUtil.validateActivity = function (entityTypeCode) {
            return __awaiter(this, void 0, void 0, function () {
                var messages, formValueName, formValues, isFCBEnabled, i, value, isRequired, displayName, isRequiredMessage;
                return __generator(this, function (_a) {
                    messages = [];
                    formValueName = ClientUtil.getEntityFormValueNameByEntityTypeCode(entityTypeCode);
                    formValues = JSON.parse(Marketing.Controls.getValue(formValueName));
                    isFCBEnabled = Marketing.FCBUtil.IsCustomizedMarketingFormEnabled();
                    messages = ClientUtil.AddActivityDataValidationMessages(ClientUtility.DataUtil.isNullOrEmptyString(formValues) ? [] : formValues);
                    if (isFCBEnabled && (ClientUtility.DataUtil.isNullOrEmptyString(formValues) || formValues.length == 0)) {
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                ClientUtil.retrieveAttributes(ClientUtil.getEntityName(entityTypeCode)).then(function (response) {
                                    var fetchUrl = response;
                                    if (!ClientUtility.DataUtil.isNullOrEmptyString(fetchUrl)) {
                                        ClientUtil.retrieveAttributesMetadata(fetchUrl).then(function (response) {
                                            var result = response;
                                            if (result && result.value && result.value.length > 0) {
                                                for (var i = 0; i < result.value.length; i++) {
                                                    var isRequired = result.value[i].RequiredLevel.Value == "ApplicationRequired" ? true : false;
                                                    var displayName = result.value[i].DisplayName.UserLocalizedLabel ? result.value[i].DisplayName.UserLocalizedLabel.Label : "";
                                                    if (isRequired) {
                                                        var isRequiredMessage = ClientUtility.StringUtil.format(Marketing.StringProvider.getResourceString(ClientUtil.IsRequired), displayName);
                                                        messages.push(isRequiredMessage);
                                                    }
                                                }
                                            }
                                            return resolve({
                                                messages: messages.join("\n")
                                            });
                                        });
                                    }
                                    else {
                                        return resolve({
                                            messages: ""
                                        });
                                    }
                                });
                            })];
                    }
                    else if (formValues && formValues.length > 0) {
                        for (i = 0; i < formValues.length; i++) {
                            value = formValues[i].value;
                            isRequired = formValues[i].isRequired;
                            displayName = formValues[i].displayName;
                            if (isRequired) {
                                isRequiredMessage = ClientUtility.StringUtil.format(Marketing.StringProvider.getResourceString(ClientUtil.IsRequired), displayName);
                                if (typeof (value) === "object") {
                                    if (ClientUtility.DataUtil.isNullOrEmptyString(value) || value.length === 0) {
                                        messages.push(isRequiredMessage);
                                    }
                                }
                                else if (ClientUtility.DataUtil.isNullOrEmptyString(value)) {
                                    messages.push(isRequiredMessage);
                                }
                            }
                        }
                        return [2 /*return*/, Promise.resolve({
                                messages: messages.join("\n")
                            })];
                    }
                    else {
                        return [2 /*return*/, Promise.resolve({
                                messages: ""
                            })];
                    }
                    return [2 /*return*/];
                });
            });
        };
        ClientUtil.getEntityFormValueNameByEntityTypeCode = function (typeCode) {
            switch (typeCode) {
                case Marketing.EntityTypeCodes.PhoneCall:
                    return ClientUtil.PhoneCallFormValues;
                case Marketing.EntityTypeCodes.Appointment:
                    return ClientUtil.AppointmentFormValues;
                case Marketing.EntityTypeCodes.Letter:
                    return ClientUtil.LetterFormValues;
                case Marketing.EntityTypeCodes.Fax:
                    return ClientUtil.FaxFormValues;
                case Marketing.EntityTypeCodes.Email:
                    return ClientUtil.EmailFormValues;
                case Marketing.EntityTypeCodes.Opportunity:
                    return ClientUtil.OpportunityFormValues;
                default:
                    throw new Error("Activity type code is not supported");
            }
        };
        return ClientUtil;
    }());
    ClientUtil.IsRequired = "MA.Activity.IsRequired";
    ClientUtil.PhoneCallFormValues = "form_values_phonecall";
    ClientUtil.LetterFormValues = "form_values_letter";
    ClientUtil.FaxFormValues = "form_values_fax";
    ClientUtil.AppointmentFormValues = "form_values_appointment";
    ClientUtil.EmailFormValues = "form_values_email";
    ClientUtil.OpportunityFormValues = "form_values";
    Marketing.ClientUtil = ClientUtil;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var Collections = (function () {
        function Collections() {
        }
        Collections.distinct = function (v, i, s) {
            return s.indexOf(v) === i;
        };
        return Collections;
    }());
    Marketing.Collections = Collections;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var Controls = (function () {
        function Controls() {
        }
        Controls.getControl = function (id) {
            var subjectAttribute = Xrm.Page.data.attributes.get(id);
            var subjectControls = subjectAttribute ? subjectAttribute.controls : null;
            return subjectControls ? subjectControls.get(0) : null;
        };
        Controls.getAttribute = function (id) {
            return Xrm.Page.data.attributes.get(id);
        };
        Controls.getValue = function (id) {
            return Xrm.Page.data.attributes.get(id).getValue();
        };
        Controls.setValue = function (id, value) {
            Xrm.Page.data.attributes.get(id).setValue(value);
        };
        Controls.setRequired = function (id, required) {
            Xrm.Page.data.attributes.get(id).setRequiredLevel(required ? "required" : "none");
        };
        return Controls;
    }());
    Marketing.Controls = Controls;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var DateHelper = (function () {
        function DateHelper() {
        }
        DateHelper.addDays = function (date, days) {
            var newDate = new Date(date);
            newDate.setDate(newDate.getDate() + days);
            return newDate;
        };
        DateHelper.addMinutes = function (date, minutes) {
            var newDate = new Date(date);
            newDate.setTime(newDate.getTime() + minutes * 60000);
            return newDate;
        };
        DateHelper.convertToEdmDateFormat = function (date) {
            return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);
        };
        return DateHelper;
    }());
    DateHelper.HoursPerDay = 24;
    DateHelper.MinutesPerHour = 60;
    DateHelper.SecondsPerMinute = 60;
    DateHelper.MillisecondsPerSecond = 1000;
    Marketing.DateHelper = DateHelper;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var DateValidation = (function () {
        function DateValidation() {
        }
        DateValidation.validateStartDateIsSmallerThanEndDate = function (oStartDate, oEndDate, errorMessage, oDateToClear) {
            var startDate = oStartDate.getValue();
            var endDate = oEndDate.getValue();
            if (startDate && endDate && endDate < startDate) {
                var alertStrings = {
                    text: errorMessage
                };
                Marketing.ClientUtil.openAlertDialog(alertStrings);
                return false;
            }
            else if (startDate == null || endDate == null) {
                return false;
            }
            return true;
        };
        return DateValidation;
    }());
    Marketing.DateValidation = DateValidation;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    /**
     * Provides functionality related to dialogs.
     *
     */
    var DialogUtil = (function () {
        function DialogUtil() {
        }
        /**
         * Closes the current dialog.
         *
         */
        DialogUtil.closeDialog = function () {
            var page = Xrm.Page;
            if (page && page.ui) {
                page.ui.close();
            }
        };
        /**
         * Sets dialog form parameter as OK and closes the current dialog.
         */
        DialogUtil.closeDialogAsOk = function () {
            ClientUtility.DialogUtil.setLastButtonClicked(Marketing.MetadataDrivenDialogConstants.OkButton);
            DialogUtil.closeDialog();
        };
        /**
         * Returns whether dialog was closed by clicking OK button.
         */
        DialogUtil.isOk = function (dialogResponse) {
            return dialogResponse.parameters[DialogUtil.LastButtonClickedParam] ===
                Marketing.MetadataDrivenDialogConstants.OkButton;
        };
        /**
         * Disables user interaction with a dialog and provides a visual indicator that the dialog is loading.
         * This is necessary in order to prevent users from interacting with dialogs while operations triggered by those dialogs are in progress.
         * @param dialogWindow           The dialog window for which the loading element should be retrieved.
         * @remarks This function is only supported for WebClient and on pages with a single dialog.
         *
         */
        DialogUtil.disableDialogUserInteraction = function (dialogWindow) {
            if (dialogWindow === void 0) { dialogWindow = window; }
            var dialogLoadingElement = DialogUtil.getDialogLoadingElement(dialogWindow);
            if (dialogLoadingElement) {
                try {
                    dialogLoadingElement.style.removeProperty("display");
                }
                catch (e) {
                    var newDialogLoadingElement = DialogUtil.replaceElementWithDuplicate(dialogLoadingElement);
                    if (newDialogLoadingElement) {
                        newDialogLoadingElement.style.removeProperty("display");
                    }
                }
            }
        };
        /**
         * Enables user interaction with a dialog and removes the visual indicator that the dialog is loading.
         * @param dialogWindow           The dialog window for which the loading element should be retrieved.
         * @remarks This function is only supported for WebClient and on pages with a single dialog.
         *
         */
        DialogUtil.enableDialogUserInteraction = function (dialogWindow) {
            if (dialogWindow === void 0) { dialogWindow = window; }
            var dialogLoadingElement = DialogUtil.getDialogLoadingElement(dialogWindow);
            if (dialogLoadingElement) {
                try {
                    dialogLoadingElement.style.display = "none";
                }
                catch (e) {
                    var newDialogLoadingElement = DialogUtil.replaceElementWithDuplicate(dialogLoadingElement);
                    if (newDialogLoadingElement) {
                        newDialogLoadingElement.style.display = "none";
                    }
                }
            }
        };
        /**
         * Gets the HTML element associated with a dialog frame which can be used to determine if the dialog has finished rendering.
         * This is part of a workaround solution which requires waiting for a dialog to finish rendering in order to perform certain interactions.
         * @param dialogWindow           The dialog window for which the loading element should be retrieved.
         * @param nodeSearchDistance     The maximum node distance to the parent of the loading element.
         * @returns {HTMLElement}        The HTML element associated with the dialog frame.
         *
         */
        DialogUtil.getDialogLoadingElement = function (dialogWindow, nodeSearchDistance) {
            if (dialogWindow === void 0) { dialogWindow = window; }
            if (nodeSearchDistance === void 0) { nodeSearchDistance = DialogUtil.LoadingElementMaximumNodeDistance; }
            if (dialogWindow) {
                var currentDepth = 0;
                var currentWindow = dialogWindow;
                while (currentDepth < nodeSearchDistance) {
                    if (!currentWindow) {
                        return null;
                    }
                    var currentDocument = currentWindow.document;
                    if (currentDocument) {
                        var loadingElement = currentDocument.getElementById("DialogLoadingDiv");
                        if (loadingElement) {
                            return loadingElement;
                        }
                    }
                    currentWindow = currentWindow.parent;
                    currentDepth = currentDepth + 1;
                }
            }
            return null;
        };
        /**
         * Replaces the HTML element with its duplicate.
         * This is a workaround for IE11, which throws 'Permission denied' on accessing style of elements created from a recently closed iframe.
         * @param element                The element to be replaced.
         * @returns {HTMLElement}        The actual HTML element after replace.
         *
         */
        DialogUtil.replaceElementWithDuplicate = function (element) {
            var parent = element.parentNode;
            var duplicate = element.cloneNode(true);
            parent.replaceChild(duplicate, element);
            return duplicate;
        };
        /**
         * Invokes an action when the specified condition is met, or when the timeout is exceeded.
         *
         * @param condition              The condition which needs to be met before the action is invoked.
         * @param successAction          The action to invoke when the condition is met.
         * @param timeoutAction          The action to invoke when the timeout is exceeded.
         *
         */
        DialogUtil.invokeActionWhenConditionIsMet = function (condition, successAction, timeoutAction) {
            var timeElapsed = 0;
            var intervalId = setInterval(function () {
                if (condition()) {
                    clearInterval(intervalId);
                    if (successAction) {
                        successAction();
                    }
                }
                else if (timeElapsed > DialogUtil.Timeout) {
                    clearInterval(intervalId);
                    if (timeoutAction) {
                        timeoutAction();
                    }
                }
                timeElapsed = timeElapsed + DialogUtil.RefreshInterval;
            }, DialogUtil.RefreshInterval);
        };
        return DialogUtil;
    }());
    /**
     * The refresh interval in milliseconds.
     *
     */
    DialogUtil.RefreshInterval = 10;
    /**
     * The timeout in milliseconds.
     *
     */
    DialogUtil.Timeout = 60000;
    /**
     * The maximum node distance to the parent of the loading element.
     *
     */
    DialogUtil.LoadingElementMaximumNodeDistance = 5;
    /**
     * Parameter that contains last clicked button ID in MDD.
     *
     */
    DialogUtil.LastButtonClickedParam = "param_lastButtonClicked";
    Marketing.DialogUtil = DialogUtil;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var EntityFullTypeNames = (function () {
        function EntityFullTypeNames() {
        }
        EntityFullTypeNames.GetCollection = function (entityFullTypeName) {
            return "Collection" + entityFullTypeName;
        };
        return EntityFullTypeNames;
    }());
    EntityFullTypeNames.Boolean = "Edm.Boolean";
    EntityFullTypeNames.Campaign = "Microsoft.Dynamics.CRM.campaign";
    EntityFullTypeNames.CampaignActivity = "Microsoft.Dynamics.CRM.campaignactivity";
    EntityFullTypeNames.CampaignActivityItem = "Microsoft.Dynamics.CRM.campaignactivityitem";
    EntityFullTypeNames.CampaignItem = "Microsoft.Dynamics.CRM.campaignitem";
    EntityFullTypeNames.CampaignResponse = "Microsoft.Dynamics.CRM.campaignresponse";
    EntityFullTypeNames.CrmBaseEntity = "Microsoft.Dynamics.CRM.crmbaseentity";
    EntityFullTypeNames.Int32 = "Edm.Int32";
    EntityFullTypeNames.List = "Microsoft.Dynamics.CRM.list";
    EntityFullTypeNames.String = "Edm.String";
    EntityFullTypeNames.Guid = "Edm.Guid";
    EntityFullTypeNames.TransactionCurrency = "Microsoft.Dynamics.CRM.transactioncurrency";
    Marketing.EntityFullTypeNames = EntityFullTypeNames;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var EntityNames = (function () {
        function EntityNames() {
        }
        EntityNames.pluralized = function (entityName) {
            return EntityNames.entitySetNameMap[entityName];
        };
        Object.defineProperty(EntityNames, "entitySetNameMap", {
            get: function () {
                var entitySetNameMap = (_a = {},
                    _a[EntityNames.Account] = "accounts",
                    _a[EntityNames.Appointment] = "appointments",
                    _a[EntityNames.BulkOperation] = "bulkoperations",
                    _a[EntityNames.CampaignActivityItem] = "campaignactivityitems",
                    _a[EntityNames.CampaignActivity] = "campaignactivities",
                    _a[EntityNames.CampaignResponse] = "campaignresponses",
                    _a[EntityNames.Campaign] = "campaigns",
                    _a[EntityNames.Contact] = "contacts",
                    _a[EntityNames.Email] = "emails",
                    _a[EntityNames.Fax] = "faxes",
                    _a[EntityNames.Lead] = "leads",
                    _a[EntityNames.Letter] = "letters",
                    _a[EntityNames.ListMember] = "listmembers",
                    _a[EntityNames.List] = "lists",
                    _a[EntityNames.None] = "none",
                    _a[EntityNames.Opportunity] = "opportunities",
                    _a[EntityNames.Organization] = "organizations",
                    _a[EntityNames.PhoneCall] = "phonecalls",
                    _a[EntityNames.Product] = "products",
                    _a[EntityNames.Queue] = "queues",
                    _a[EntityNames.Quote] = "quotes",
                    _a[EntityNames.RecurringAppointmentMaster] = "recurringappointmentmasters",
                    _a[EntityNames.SalesLiterature] = "salesliteratures",
                    _a[EntityNames.SalesOrder] = "salesorders",
                    _a[EntityNames.SocialActivity] = "socialactivities",
                    _a[EntityNames.SystemUser] = "systemusers",
                    _a[EntityNames.Team] = "teams",
                    _a[EntityNames.Template] = "templates",
                    _a[EntityNames.TransactionCurrency] = "transactioncurrencies",
                    _a);
                return entitySetNameMap;
                var _a;
            },
            enumerable: true,
            configurable: true
        });
        return EntityNames;
    }());
    EntityNames.Account = "account";
    EntityNames.Appointment = "appointment";
    EntityNames.BulkOperation = "bulkoperation";
    EntityNames.Campaign = "campaign";
    EntityNames.CampaignActivity = "campaignactivity";
    EntityNames.CampaignActivityItem = "campaignactivityitem";
    EntityNames.CampaignItem = "campaignitem";
    EntityNames.CampaignResponse = "campaignresponse";
    EntityNames.Contact = "contact";
    EntityNames.Email = "email";
    EntityNames.Fax = "fax";
    EntityNames.Lead = "lead";
    EntityNames.Letter = "letter";
    EntityNames.List = "list";
    EntityNames.ListMember = "listmember";
    EntityNames.None = "none";
    EntityNames.Opportunity = "opportunity";
    EntityNames.Organization = "organization";
    EntityNames.PhoneCall = "phonecall";
    EntityNames.Product = "product";
    EntityNames.Queue = "queue";
    EntityNames.Quote = "quote";
    EntityNames.RecurringAppointmentMaster = "recurringappointmentmaster";
    EntityNames.SalesLiterature = "salesliterature";
    EntityNames.SalesOrder = "salesorder";
    EntityNames.SocialActivity = "socialactivity";
    EntityNames.SystemUser = "systemuser";
    EntityNames.Team = "team";
    EntityNames.Template = "template";
    EntityNames.TransactionCurrency = "transactioncurrency";
    EntityNames.SavedQuery = "savedquery";
    EntityNames.UserQuery = "userquery";
    Marketing.EntityNames = EntityNames;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var EntityNamesPluralized = (function () {
        function EntityNamesPluralized() {
        }
        return EntityNamesPluralized;
    }());
    EntityNamesPluralized.Accounts = "accounts";
    EntityNamesPluralized.Contacts = "contacts";
    EntityNamesPluralized.Leads = "leads";
    Marketing.EntityNamesPluralized = EntityNamesPluralized;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var EntityRelationshipNames = (function () {
        function EntityRelationshipNames() {
        }
        return EntityRelationshipNames;
    }());
    EntityRelationshipNames.ListAccount = "listaccount_association";
    EntityRelationshipNames.ListContact = "listcontact_association";
    EntityRelationshipNames.ListLead = "listlead_association";
    EntityRelationshipNames.ListCampaign = "campaignlist_association";
    EntityRelationshipNames.ListCampaignActivity = "campaignactivitylist_association";
    EntityRelationshipNames.CampaignSalesLiterature = "campaignsalesliterature_association";
    EntityRelationshipNames.CampaignProduct = "campaignproduct_association";
    EntityRelationshipNames.EnterpriseMarketingListRelationships = [EntityRelationshipNames.ListCampaign, EntityRelationshipNames.ListCampaignActivity, EntityRelationshipNames.ListAccount, EntityRelationshipNames.ListContact, EntityRelationshipNames.ListLead];
    Marketing.EntityRelationshipNames = EntityRelationshipNames;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var EntityTypeCodes;
    (function (EntityTypeCodes) {
        EntityTypeCodes[EntityTypeCodes["None"] = -1] = "None";
        EntityTypeCodes[EntityTypeCodes["Account"] = 1] = "Account";
        EntityTypeCodes[EntityTypeCodes["Appointment"] = 4201] = "Appointment";
        EntityTypeCodes[EntityTypeCodes["BulkOperation"] = 4406] = "BulkOperation";
        EntityTypeCodes[EntityTypeCodes["Campaign"] = 4400] = "Campaign";
        EntityTypeCodes[EntityTypeCodes["CampaignActivity"] = 4402] = "CampaignActivity";
        EntityTypeCodes[EntityTypeCodes["CampaignResponse"] = 4401] = "CampaignResponse";
        EntityTypeCodes[EntityTypeCodes["Contact"] = 2] = "Contact";
        EntityTypeCodes[EntityTypeCodes["Email"] = 4202] = "Email";
        EntityTypeCodes[EntityTypeCodes["Fax"] = 4204] = "Fax";
        EntityTypeCodes[EntityTypeCodes["Lead"] = 4] = "Lead";
        EntityTypeCodes[EntityTypeCodes["Letter"] = 4207] = "Letter";
        EntityTypeCodes[EntityTypeCodes["List"] = 4300] = "List";
        EntityTypeCodes[EntityTypeCodes["ListMember"] = 4301] = "ListMember";
        EntityTypeCodes[EntityTypeCodes["Opportunity"] = 3] = "Opportunity";
        EntityTypeCodes[EntityTypeCodes["PhoneCall"] = 4210] = "PhoneCall";
        EntityTypeCodes[EntityTypeCodes["Product"] = 1024] = "Product";
        EntityTypeCodes[EntityTypeCodes["Queue"] = 2020] = "Queue";
        EntityTypeCodes[EntityTypeCodes["Quote"] = 1084] = "Quote";
        EntityTypeCodes[EntityTypeCodes["SalesLiterature"] = 1038] = "SalesLiterature";
        EntityTypeCodes[EntityTypeCodes["SalesOrder"] = 1088] = "SalesOrder";
        EntityTypeCodes[EntityTypeCodes["SystemUser"] = 8] = "SystemUser";
        EntityTypeCodes[EntityTypeCodes["Team"] = 9] = "Team";
        EntityTypeCodes[EntityTypeCodes["TransactionCurrency"] = 9105] = "TransactionCurrency";
    })(EntityTypeCodes = Marketing.EntityTypeCodes || (Marketing.EntityTypeCodes = {}));
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var FCBUtil = (function () {
        function FCBUtil() {
        }
        /**
         * Returns a value indicating whether or not the feature is enabled.
         */
        FCBUtil.IsAddMembersByQueryUsingWorkflowsEnabled = function () {
            return Xrm.Internal.isFeatureEnabled("FCB.ListOperationWorkflowAddMembersUsingQueryFeature") ||
                Xrm.Internal.isFeatureEnabled("ListOperationWorkflowAddMembersUsingQueryFeature");
        };
        /**
         * Returns a value indicating whether or not the Customized Marketing Form feature is enabled.
         */
        FCBUtil.IsCustomizedMarketingFormEnabled = function () {
            return Xrm.Internal.isFeatureEnabled("AllowCustomizedMarketingForm");
        };
        return FCBUtil;
    }());
    Marketing.FCBUtil = FCBUtil;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var GridConstants = (function () {
        function GridConstants() {
        }
        return GridConstants;
    }());
    GridConstants.Otc = "otc";
    GridConstants.ViewId = "viewid";
    GridConstants.ViewType = "viewtype";
    Marketing.GridConstants = GridConstants;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    /**
     * Provides shortcuts for validating inbound contracts.
     */
    var Guard = (function () {
        function Guard() {
        }
        /**
         * Checks that provided value is present.
         * @param value stands for value to be checked.
         * @param name stands for the name of the parameter to be checked. It will be used for thrown message.
         * @throws Error if value is missing.
         */
        Guard.required = function (value, name) {
            if ((typeof value === "string" && ClientUtility.DataUtil.isNullOrWhiteSpace(value)) ||
                ClientUtility.DataUtil.isNullOrUndefined(value)) {
                throw new Error(name + " is required.");
            }
        };
        /**
         * Checks that provided collection contains any items.
         * @param collection stands for collection to be checked.
         * @param name stands for the name of the parameter to be checked. It will be used for thrown message.
         * @throws Error if collection is empty.
         */
        Guard.notEmpty = function (collection, name) {
            if (collection.length === 0) {
                throw new Error(name + " shouldn't be empty.");
            }
        };
        return Guard;
    }());
    Marketing.Guard = Guard;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    /**
     * Provides methods to show help.
     */
    var Help = (function () {
        function Help() {
        }
        /**
         * Open new tab with help for Campaign Activity Distribution dialog.
         */
        Help.loadHelpForDialog = function () {
            var helpUrl = this.defaultHelpPageURLForCampaignActivityDistribution;
            Xrm.Navigation.openUrl(helpUrl);
        };
        return Help;
    }());
    Help.defaultHelpPageURLForCampaignActivityDistribution = "https://go.microsoft.com/fwlink/?linkid=2199000";
    Marketing.Help = Help;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var LeadState;
    (function (LeadState) {
        LeadState[LeadState["Open"] = 0] = "Open";
        LeadState[LeadState["Qualified"] = 1] = "Qualified";
        LeadState[LeadState["Disqualified"] = 2] = "Disqualified";
    })(LeadState = Marketing.LeadState || (Marketing.LeadState = {}));
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var LeadStatus;
    (function (LeadStatus) {
        LeadStatus[LeadStatus["New"] = 1] = "New";
        LeadStatus[LeadStatus["Contacted"] = 2] = "Contacted";
        LeadStatus[LeadStatus["Qualified"] = 3] = "Qualified";
        LeadStatus[LeadStatus["Lost"] = 4] = "Lost";
        LeadStatus[LeadStatus["CannotContact"] = 5] = "CannotContact";
        LeadStatus[LeadStatus["NoLongerInterested"] = 6] = "NoLongerInterested";
        LeadStatus[LeadStatus["Canceled"] = 7] = "Canceled";
    })(LeadStatus = Marketing.LeadStatus || (Marketing.LeadStatus = {}));
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var ListEntityControlNames = (function () {
        function ListEntityControlNames() {
        }
        return ListEntityControlNames;
    }());
    ListEntityControlNames.accounts = "accounts";
    ListEntityControlNames.contacts = "contacts";
    ListEntityControlNames.leads = "leads";
    ListEntityControlNames.staticAccountsUci = "accountsUCI";
    ListEntityControlNames.staticContactsUci = "contactsUCI";
    ListEntityControlNames.staticLeadsUci = "leadsUCI";
    ListEntityControlNames.dynamicAccountsUci = "dynamic_accounts";
    ListEntityControlNames.dynamicContactsUci = "dynamic_contacts";
    ListEntityControlNames.dynamicLeadsUci = "dynamic_leads";
    Marketing.ListEntityControlNames = ListEntityControlNames;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var ListEntityFieldNames = (function () {
        function ListEntityFieldNames() {
        }
        return ListEntityFieldNames;
    }());
    ListEntityFieldNames.CreatedFromCode = "createdfromcode";
    ListEntityFieldNames.ListId = "listid";
    ListEntityFieldNames.MemberCount = "membercount";
    ListEntityFieldNames.MemberType = "membertype";
    ListEntityFieldNames.Query = "query";
    ListEntityFieldNames.StateCode = "statecode";
    ListEntityFieldNames.Type = "type";
    Marketing.ListEntityFieldNames = ListEntityFieldNames;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var ListViewIds = (function () {
        function ListViewIds() {
        }
        return ListViewIds;
    }());
    ListViewIds.ListsForCampaign = "B4E49A57-0229-4087-837C-45E1BDD7DD38";
    ListViewIds.BasicMarketingLists = "577EA96E-B1F6-499b-98A7-ABB5BE8233F9";
    Marketing.ListViewIds = ListViewIds;
})(Marketing || (Marketing = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Marketing;
(function (Marketing) {
    var MemberOperations = (function () {
        function MemberOperations() {
        }
        MemberOperations.addListMembers = function (listIds, members, membersType) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var requests, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            requests = listIds.map(function (listId) { return new ODataContract.AddListMembersListRequest({
                                entityType: Marketing.EntityNames.List,
                                id: _this.safeGuid(listId)
                            }, MemberOperations.removeDuplicates(members), membersType); });
                            return [4 /*yield*/, MemberOperations.executeRequests(requests)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_4 = _a.sent();
                            ClientUtility.ActionFailedHandler.actionFailedCallback(error_4);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        MemberOperations.copyListMembers = function (sourceListIds, targetListIds) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var requests_1, srcIds_1, targetIds, listTypeMap_1, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            requests_1 = [];
                            srcIds_1 = sourceListIds.map(function (entityId) { return _this.safeEntityId(entityId); });
                            targetIds = targetListIds.map(function (entityId) { return _this.safeEntityId(entityId); });
                            return [4 /*yield*/, this.mapMarketingListsToTypes(srcIds_1.concat(targetIds))];
                        case 1:
                            listTypeMap_1 = _a.sent();
                            targetIds.forEach(function (target) {
                                requests_1.push.apply(requests_1, srcIds_1.filter(function (source) {
                                    return source.id.toLowerCase() !== target.id.toLowerCase() && listTypeMap_1[source.id.toLowerCase()] === listTypeMap_1[target.id.toLowerCase()];
                                }).map(function (source) {
                                    return new ODataContract.CopyMembersListRequest(source, target);
                                }));
                            });
                            return [4 /*yield*/, MemberOperations.executeRequests(requests_1)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_5 = _a.sent();
                            ClientUtility.ActionFailedHandler.actionFailedCallback(error_5);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        MemberOperations.addListMembersByFetchXml = function (listId, fetchXml, oDataServiceClient) {
            return __awaiter(this, void 0, void 0, function () {
                var url, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            url = Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.0/AddMembersByFetchXmlList";
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            this.showProgressIndicator();
                            return [4 /*yield*/, oDataServiceClient.postReq(url, {
                                    ListId: this.safeGuid(listId),
                                    FetchXml: fetchXml
                                })];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            e_1 = _a.sent();
                            MemberOperations.reportFailure("AddMembersByFetchXmlList", url, e_1);
                            ClientUtility.ActionFailedHandler.actionFailedCallback(e_1);
                            return [3 /*break*/, 5];
                        case 4:
                            this.closeProgressIndicator();
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        MemberOperations.qualifyListMembers = function (listId, members, OverrideorRemove, oDataServiceClient) {
            return __awaiter(this, void 0, void 0, function () {
                var url, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            url = Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.0/QualifyMemberList";
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            this.showProgressIndicator();
                            return [4 /*yield*/, oDataServiceClient.postReq(url, {
                                    ListId: {
                                        guid: this.safeGuid(listId)
                                    },
                                    MemberIds: members,
                                    OverrideorRemove: OverrideorRemove
                                })];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            e_2 = _a.sent();
                            MemberOperations.reportFailure("QualifyMemberList", url, e_2);
                            ClientUtility.ActionFailedHandler.actionFailedCallback(e_2);
                            return [3 /*break*/, 5];
                        case 4:
                            this.closeProgressIndicator();
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        MemberOperations.removeListMembers = function (listIds, members, membersType) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var requests, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            requests = listIds.map(function (listId) { return new ODataContract.RemoveMembersByIdsRequest({
                                entityType: Marketing.EntityNames.List,
                                id: _this.safeGuid(listId)
                            }, MemberOperations.removeDuplicates(members), membersType); });
                            return [4 /*yield*/, MemberOperations.executeRequests(requests)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_6 = _a.sent();
                            ClientUtility.ActionFailedHandler.actionFailedCallback(error_6);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        MemberOperations.removeDuplicates = function (entities) {
            var _this = this;
            var safeEntities = entities.map(function (entity) { return _this.safeEntityId(entity); }).filter(function (entity) { return !!entity; });
            var entityIds = safeEntities.map(function (entity) { return entity.id; });
            return safeEntities.filter(function (entity, idx) { return entityIds.indexOf(entity.id) === idx; });
        };
        MemberOperations.reportFailure = function (methodName, url, result) {
            if (Marketing.ClientUtil.isUCI()) {
                Xrm.Reporting.reportFailure("marketing", new Error("EnterpriseMarketing-Marketing.MemberOperations." + methodName), "", [
                    { name: "url", value: url },
                    { name: "error", value: JSON.stringify(result) }
                ]);
            }
            else {
                var error = (typeof result === "string") ? JSON.parse(result) : { error: { message: result.message, code: result.errorCode } };
                Xrm.Navigation.openErrorDialog({
                    message: error.error.message,
                    errorCode: parseInt(error.error.code)
                });
            }
            return null;
        };
        MemberOperations.safeEntityId = function (entity) {
            if (!entity || !entity.id || !entity.entityType) {
                return null;
            }
            return {
                id: this.safeGuid(entity.id),
                entityType: entity.entityType
            };
        };
        MemberOperations.safeGuid = function (guid) {
            if (!guid) {
                return null;
            }
            return guid.replace('{', '').replace('}', '');
        };
        MemberOperations.getQueries = function (entityName, endpointName, fetchColumns) {
            return __awaiter(this, void 0, void 0, function () {
                var retrieveOptions, transformResponseString, response, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            retrieveOptions = "?$filter=returnedtypecode eq '" + entityName + "' and statecode eq 0 and querytype eq 0 and fetchxml ne null and layoutxml ne null";
                            if (fetchColumns && fetchColumns.length > 0) {
                                retrieveOptions = retrieveOptions + ("&$select=" + fetchColumns.join(','));
                            }
                            transformResponseString = function (response) {
                                try {
                                    if (response) {
                                        if (!ClientUtility.DataUtil.isNullOrUndefined(response.entities)) {
                                            return response.entities;
                                        }
                                    }
                                }
                                catch (error) {
                                    ClientUtility.ActionFailedHandler.actionFailedCallback(error);
                                }
                                return [];
                            };
                            return [4 /*yield*/, Xrm.WebApi.retrieveMultipleRecords(endpointName, retrieveOptions)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, transformResponseString(response)];
                        case 2:
                            error_7 = _a.sent();
                            ClientUtility.ActionFailedHandler.actionFailedCallback(error_7);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        MemberOperations.executeRequests = function (requests) {
            return __awaiter(this, void 0, void 0, function () {
                var responses, _a, _b, _c, e_3, operationName;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 13, 14, 15]);
                            this.showProgressIndicator();
                            _a = requests.length;
                            switch (_a) {
                                case 0: return [3 /*break*/, 1];
                                case 1: return [3 /*break*/, 2];
                            }
                            return [3 /*break*/, 7];
                        case 1: return [3 /*break*/, 12];
                        case 2:
                            if (!Xrm.WebApi.execute) return [3 /*break*/, 4];
                            return [4 /*yield*/, Xrm.WebApi.execute(requests[0])];
                        case 3:
                            responses = [
                                _d.sent()
                            ];
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, Xrm.WebApi.online.execute(requests[0])];
                        case 5:
                            responses = [
                                _d.sent()
                            ];
                            _d.label = 6;
                        case 6: return [3 /*break*/, 12];
                        case 7:
                            if (!Xrm.WebApi.executeMultiple) return [3 /*break*/, 9];
                            return [4 /*yield*/, Xrm.WebApi.executeMultiple(requests)];
                        case 8:
                            responses = _d.sent();
                            return [3 /*break*/, 11];
                        case 9: return [4 /*yield*/, Xrm.WebApi.online.executeMultiple(requests)];
                        case 10:
                            responses = _d.sent();
                            _d.label = 11;
                        case 11: return [3 /*break*/, 12];
                        case 12: return [3 /*break*/, 15];
                        case 13:
                            e_3 = _d.sent();
                            operationName = requests.length > 0 ? requests[0].getMetadata().operationName : "";
                            MemberOperations.reportFailure(operationName, operationName, e_3);
                            throw e_3;
                        case 14:
                            this.closeProgressIndicator();
                            return [7 /*endfinally*/];
                        case 15: return [2 /*return*/, !responses ? [] : responses.map(function (response) { return response.body && response.body.toString(); })];
                    }
                });
            });
        };
        MemberOperations.showProgressIndicator = function () {
            Xrm.Utility.showProgressIndicator(Marketing.StringProvider.getResourceString(Marketing.MessageKeys.MsgProcessingWaitLongDialog));
        };
        MemberOperations.closeProgressIndicator = function () {
            Xrm.Utility.closeProgressIndicator();
            var isUCI = ClientUtility.ClientUtil.isUCI();
            var isInCreateMode = !!Xrm.Page.ui && !!Xrm.Page.ui.getFormType && Xrm.Page.ui.getFormType() == 1;
            if (isUCI && isInCreateMode) {
                Marketing.DialogUtil.closeDialog();
            }
        };
        /*
         * Maps MarketingList id to its MemberType - MarketingList.listid => MarletingList.createdcreatedfromcode.
         *
         * @returns Object containing mapping between list id and its member type (Contact, Account, Lead)
         */
        MemberOperations.mapMarketingListsToTypes = function (listIds) {
            return __awaiter(this, void 0, void 0, function () {
                var all, lists, listRetrieveOptions, response, res_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            all = listIds.filter(function (item, index) { return listIds.indexOf(item) === index; });
                            lists = all
                                .map(function (listId) { return Marketing.ListEntityFieldNames.ListId + " eq " + listId.id; })
                                .join(" or ");
                            listRetrieveOptions = "?$select=listid,createdfromcode&$filter=" + lists;
                            return [4 /*yield*/, Xrm.WebApi.retrieveMultipleRecords(Marketing.EntityNames.List, listRetrieveOptions)];
                        case 1:
                            response = _a.sent();
                            if (response.entities.length > 0) {
                                res_1 = {};
                                response.entities.forEach(function (e) { return res_1[e.listid] = e.createdfromcode; });
                                return [2 /*return*/, res_1];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        return MemberOperations;
    }());
    Marketing.MemberOperations = MemberOperations;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var QualifyListMembersDialogParameters = (function () {
        function QualifyListMembersDialogParameters() {
        }
        return QualifyListMembersDialogParameters;
    }());
    QualifyListMembersDialogParameters.ActionName = "action_name";
    QualifyListMembersDialogParameters.BackToQueryButtonId = "back_to_query_id";
    QualifyListMembersDialogParameters.BackToQueryState = "back_to_query_state";
    QualifyListMembersDialogParameters.FetchXml = "fetch_xml";
    QualifyListMembersDialogParameters.HandleSelected = "handle_selected";
    QualifyListMembersDialogParameters.MarketingListId = "marketing_list_id";
    QualifyListMembersDialogParameters.MemberType = "member_type";
    QualifyListMembersDialogParameters.PageToRender = "page_to_render";
    QualifyListMembersDialogParameters.QualifyListMembersContract = "selected_members";
    QualifyListMembersDialogParameters.ReadyForQualification = "ready_for_qualification";
    Marketing.QualifyListMembersDialogParameters = QualifyListMembersDialogParameters;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var QualifyListMembersPages = (function () {
        function QualifyListMembersPages() {
        }
        return QualifyListMembersPages;
    }());
    QualifyListMembersPages.ResultPage = "resultPage";
    QualifyListMembersPages.QueryBuilderPage = "queryBuilderPage";
    QualifyListMembersPages.ProgressWheel = "progressWheelPage";
    Marketing.QualifyListMembersPages = QualifyListMembersPages;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var ListLookupParameters = (function () {
        function ListLookupParameters() {
        }
        return ListLookupParameters;
    }());
    ListLookupParameters.MemberTypeCode = "membertypecode";
    ListLookupParameters.ListType = "listType";
    ListLookupParameters.CustomFilters = "customFilters";
    ListLookupParameters.CustomFilterTypes = "customFilterTypes";
    Marketing.ListLookupParameters = ListLookupParameters;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    /**
     * Controls visibility of the List Operations subgrid based on an Feature Control Bit (FCB)
     * status.
     */
    function ShowHideListOperationsSection() {
        var fcbStatus = Marketing.FCBUtil.IsAddMembersByQueryUsingWorkflowsEnabled();
        var listOperationsSubgrid = GetListOperationSubgridControl();
        if (listOperationsSubgrid) {
            listOperationsSubgrid.setVisible(fcbStatus);
            var parentControl = listOperationsSubgrid.getParent();
            // We also need to hide the parent in WebClient to hide the section.
            // In UCI, just hiding the subgrid is enough to hide the whole section.
            if (ClientUtility.ClientUtil.isUCI() === false &&
                parentControl) {
                parentControl.setVisible(fcbStatus);
            }
        }
    }
    Marketing.ShowHideListOperationsSection = ShowHideListOperationsSection;
    /**
     * Returns the list operations subgrid by looking at the current page controls list.
     */
    function GetListOperationSubgridControl() {
        return Xrm.Page.getControl("ListOperationsSubGrid");
    }
    Marketing.GetListOperationSubgridControl = GetListOperationSubgridControl;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var MessageKeys = (function () {
        function MessageKeys() {
        }
        return MessageKeys;
    }());
    MessageKeys.OwnerRequired = "MA.OwnerRequired";
    MessageKeys.QueueRequired = "MA.QueueRequired";
    MessageKeys.MsgProcessingDialog = "Msg_Processing_Dialog";
    MessageKeys.MsgProcessingWaitLongDialog = "Msg_Processing_Wait_Long_Dialog";
    Marketing.MessageKeys = MessageKeys;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    /* tslint:disable:max-classes-per-file */
    /* tslint:disable:crm-force-fields-private */
    var MetadataDrivenDialogConstants = (function () {
        function MetadataDrivenDialogConstants() {
        }
        return MetadataDrivenDialogConstants;
    }());
    MetadataDrivenDialogConstants.Action = "action";
    MetadataDrivenDialogConstants.ActionFormParameter = "action_name";
    MetadataDrivenDialogConstants.CancelButton = "cancel_id";
    MetadataDrivenDialogConstants.CommaSeperator = ",";
    MetadataDrivenDialogConstants.DefaultIndex = 0;
    MetadataDrivenDialogConstants.EntityId = "entity_id";
    MetadataDrivenDialogConstants.EntityTypeCode = "entity_type_code";
    MetadataDrivenDialogConstants.FirstIndex = 1;
    MetadataDrivenDialogConstants.InitialEndDateFormParameter = "initial_end_date";
    MetadataDrivenDialogConstants.InitialStartDateFormParameter = "initial_start_date";
    MetadataDrivenDialogConstants.LastButtonClicked = "lastButtonClicked";
    MetadataDrivenDialogConstants.LastButtonClickedFormParameter = "last_button_clicked";
    MetadataDrivenDialogConstants.NewLeadId = "new_lead_id";
    MetadataDrivenDialogConstants.OkButton = "ok_id";
    MetadataDrivenDialogConstants.OpenNew = "open_new";
    MetadataDrivenDialogConstants.PartyEntityType = "party_entity_type";
    MetadataDrivenDialogConstants.PartyId = "party_id";
    MetadataDrivenDialogConstants.PartyName = "party_name";
    MetadataDrivenDialogConstants.QualifyLeadCommandName = "QualifyLead";
    MetadataDrivenDialogConstants.Records = "records";
    MetadataDrivenDialogConstants.RecordsFormParameter = "entity_records";
    MetadataDrivenDialogConstants.SaveActivity = "save_activity";
    MetadataDrivenDialogConstants.SetState = "SetState";
    MetadataDrivenDialogConstants.StateId = "state_id";
    MetadataDrivenDialogConstants.StatusId = "status_id";
    MetadataDrivenDialogConstants.Subject = "lead_subject";
    Marketing.MetadataDrivenDialogConstants = MetadataDrivenDialogConstants;
    var DialogName = (function () {
        function DialogName() {
        }
        return DialogName;
    }());
    DialogName.ActivityDistributionOwnershipPropagation = "ActivityDistributionOwnershipPropagation";
    DialogName.AddListMembersToDynamicList = "AddListMembersToDynamicList";
    DialogName.AddListMembersUsingAdvancedFind = "AddListMembersUsingAdvancedFind";
    DialogName.AddToQueue = "AddToQueue";
    DialogName.ApplyEmailTemplate = "ApplyEmailTemplate";
    DialogName.Assign = "Assign";
    DialogName.AssignQueue = "AssignQueue";
    DialogName.AssociateCase = "AssociateCase";
    DialogName.CancelCase = "CancelCase";
    DialogName.CloseCampaignActivity = "CloseCampaignActivityDialog";
    DialogName.CloseInvoice = "InvoiceClose";
    DialogName.CloseOpportunity = "CloseOpportunity";
    DialogName.CloseOrder = "CloseOrder";
    DialogName.CloseQuote = "CloseQuote";
    DialogName.ConvertActivity = "ConvertActivity";
    DialogName.ConvertActivityToLead = "ConvertActivityToLead";
    DialogName.ConvertToCase = "ConvertToCase";
    DialogName.ConvertToKnowledgeArticle = "ConvertToKnowledgeArticle";
    DialogName.CreateOpportunity = "CreateOpportunity";
    DialogName.CreateOrder = "CreateOrder";
    DialogName.CreateQuickCampaign = "CreateQuickCampaign";
    DialogName.CreateSla = "CreateSlaDialog";
    DialogName.Delete = "delete";
    DialogName.DocumentSuggestions = "DocumentSuggestions";
    DialogName.DupWarning = "DupWarning";
    DialogName.EvaluateListMembersUsingAdvancedFind = "EvaluateListMembersUsingAdvancedFind";
    DialogName.ListCampaignAssociacion = "list_campaign_association";
    DialogName.AdvancedFindMembers = "advanced_find_members";
    DialogName.DynamicListMembers = "dynamiclist_queryfind";
    DialogName.Lookup = "Lookup";
    DialogName.ManageListMembers = "ManageListMembers";
    DialogName.MergeCase = "MergeCase";
    DialogName.NewAppointmentsForDistributeCampaignActivity = "NewAppointmentsForDistributeCampaignActivity";
    DialogName.NewEmailsForDistributeCampaignActivity = "NewEmailsForDistributeCampaignActivity";
    DialogName.NewFaxesForDistributeCampaignActivity = "NewFaxesForDistributeCampaignActivity";
    DialogName.NewLettersForDistributeCampaignActivity = "NewLettersForDistributeCampaignActivity";
    DialogName.NewPhoneCallsForDistributeCampaignActivity = "NewPhoneCallsForDistributeCampaignActivity";
    DialogName.OtherDocumentSuggestions = "OtherDocumentSuggestions";
    DialogName.QueueItemPick = "QueueItemPick";
    DialogName.ReactivateCase = "ReactivateCase";
    DialogName.RecommendedDocument = "RecommendedDocument";
    DialogName.RemoveListMembersUsingAdvancedFind = "RemoveListMembersUsingAdvancedFind";
    DialogName.ResolveCase = "ResolveCase";
    DialogName.RouteCase = "routecase";
    DialogName.RouteQueuedItem = "RouteQueuedItem";
    DialogName.SaveAndRouteCase = "saveandroutecase";
    DialogName.SaveListAsStatic = "SaveListAsStatic";
    DialogName.SelectEmailTemplate = "SelectEmailTemplate";
    DialogName.SelectTemplateRecipient = "SelectTemplateRecipient";
    DialogName.SeriesAction = "SeriesActionDialog";
    DialogName.SetRegarding = "SetRegarding";
    DialogName.SetState = "SetStateDialog";
    DialogName.UpdateAttachment = "UpdateAttachment";
    Marketing.DialogName = DialogName;
    var DialogSizes = (function () {
        function DialogSizes() {
        }
        return DialogSizes;
    }());
    DialogSizes.ActivateGridDialogHeight = 250;
    DialogSizes.ActivateGridDialogWidth = 600;
    DialogSizes.ActivityDistributionOwnershipPropagationDialogHeight = 500;
    DialogSizes.ActivityDistributionOwnershipPropagationDialogWidth = 500;
    DialogSizes.AddToCampaignDialogHeight = 250;
    DialogSizes.AddToCampaignDialogWidth = 475;
    DialogSizes.BulkDeleteHeight = 520;
    DialogSizes.BulkDeleteWidth = 700;
    DialogSizes.CampaignActivityCloseDialogHeight = 330;
    DialogSizes.CampaignActivityCloseDialogWidth = 600;
    DialogSizes.CompletePhoneCallDialogHeight = 250;
    DialogSizes.CompletePhoneCallDialogWidth = 600;
    DialogSizes.ConvertToLeadHeight = 600;
    DialogSizes.ConvertToLeadWidth = 410;
    DialogSizes.CopyToDialogHeight = 300;
    DialogSizes.CopyToDialogWidth = 400;
    DialogSizes.CopyToStaticDialogHeight = 200;
    DialogSizes.CopyToStaticDialogWidth = 450;
    DialogSizes.CreateOpportunityDialogHeight = 800;
    DialogSizes.CreateOpportunityDialogWidth = 550;
    DialogSizes.CreateQuickCampaignHeight = 570;
    DialogSizes.CreateQuickCampaignWidth = 770;
    DialogSizes.DeactivateFormDialogHeight = 250;
    DialogSizes.DeactivateFormDialogWidth = 420;
    DialogSizes.DeactivateGridDialogHeight = 250;
    DialogSizes.DeactivateGridDialogWidth = 600;
    DialogSizes.DeactivateAlertDialogHeight = 220;
    DialogSizes.DeactivateAlertDialogWidth = 400;
    DialogSizes.ListCampaighAssociationDialogHeight = 250;
    DialogSizes.ListCampaighAssociationDialogWidth = 850;
    DialogSizes.MailMergeDialogHeight = 500;
    DialogSizes.MailMergeDialogWidth = 600;
    DialogSizes.MiniCampaignDialogHeight = 570;
    DialogSizes.MiniCampaignDialogWidth = 770;
    DialogSizes.NewActivityDialogHeight = 600;
    DialogSizes.NewActivityDialogWidth = 850;
    DialogSizes.OpenManageMembersWizardHeight = 450;
    DialogSizes.OpenManageMembersWizardWidth = 440;
    DialogSizes.QualifyListMemberDialogHeight = 615;
    DialogSizes.QualifyListMemberDialogWidth = 820;
    DialogSizes.QueueItemReleaseDialogHeight = 200;
    DialogSizes.QueueItemReleaseDialogWidth = 450;
    DialogSizes.QueueItemRemoveDialogHeight = 200;
    DialogSizes.QueueItemRemoveDialogWidth = 450;
    DialogSizes.RunMiniCampaignHeight = 570;
    DialogSizes.RunMiniCampaignWidth = 770;
    DialogSizes.SendBulkEmailHeight = 620;
    DialogSizes.SendBulkEmailWidth = 600;
    Marketing.DialogSizes = DialogSizes;
    var DialogSizesLegacy = (function () {
        function DialogSizesLegacy() {
        }
        return DialogSizesLegacy;
    }());
    DialogSizesLegacy.CreateOpportunityDialogHeight = 550;
    DialogSizesLegacy.CreateOpportunityDialogWidth = 800;
    DialogSizesLegacy.ConvertToLeadHeight = 390;
    DialogSizesLegacy.ConvertToLeadWidth = 410;
    DialogSizesLegacy.CopyToDialogHeight = 250;
    DialogSizesLegacy.CopyToDialogWidth = 400;
    DialogSizesLegacy.ConfirmCopyToListWidth = 400;
    DialogSizesLegacy.ConfirmCopyToListHeight = 200;
    DialogSizesLegacy.ConfirmDeleteListMembersWidth = 450;
    DialogSizesLegacy.ConfirmDeleteListMembersHeight = 200;
    Marketing.DialogSizesLegacy = DialogSizesLegacy;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var OData = (function () {
        function OData() {
        }
        return OData;
    }());
    OData.Bind = "@odata.bind";
    OData.TypeFieldName = "@odata.type";
    OData.TypeFieldValuePrefix = "Microsoft.Dynamics.CRM.";
    OData.LogicalNameSuffix = "@Microsoft.Dynamics.CRM.lookuplogicalname";
    OData.DisplayNameSuffix = "@OData.Community.Display.V1.FormattedValue";
    Marketing.OData = OData;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var ConvertToOpportunityDialogParameters = (function () {
        function ConvertToOpportunityDialogParameters() {
        }
        return ConvertToOpportunityDialogParameters;
    }());
    ConvertToOpportunityDialogParameters.MemberType = "member_type";
    ConvertToOpportunityDialogParameters.MembersArray = "members_array";
    ConvertToOpportunityDialogParameters.Topic = "topic_id";
    ConvertToOpportunityDialogParameters.ContactId = "contact_id";
    ConvertToOpportunityDialogParameters.AccountId = "account_id";
    ConvertToOpportunityDialogParameters.BudgetAmount = "budget_amount_id";
    ConvertToOpportunityDialogParameters.EstimatedRevenue = "estimated_revenue_id";
    ConvertToOpportunityDialogParameters.EstimatedCloseDate = "estimated_close_date_id";
    ConvertToOpportunityDialogParameters.CustomerNeed = "customer_need_id";
    ConvertToOpportunityDialogParameters.FormValues = "form_values";
    Marketing.ConvertToOpportunityDialogParameters = ConvertToOpportunityDialogParameters;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var OpportunityEntityFieldNames = (function () {
        function OpportunityEntityFieldNames() {
        }
        return OpportunityEntityFieldNames;
    }());
    OpportunityEntityFieldNames.Name = "name";
    OpportunityEntityFieldNames.EstimatedCloseDate = "estimatedclosedate";
    OpportunityEntityFieldNames.BudgetAmmount = "budgetamount";
    OpportunityEntityFieldNames.EstimatedValue = "estimatedvalue";
    OpportunityEntityFieldNames.CustomerNeed = "customerneed";
    OpportunityEntityFieldNames.ParentContactId = "parentcontactid";
    OpportunityEntityFieldNames.ParentAccountId = "parentaccountid";
    Marketing.OpportunityEntityFieldNames = OpportunityEntityFieldNames;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var Xml = (function () {
        function Xml() {
        }
        Xml.removeWhitespaces = function (xml) {
            var keys = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                keys[_i - 1] = arguments[_i];
            }
            return xml.replace(/>\s*/g, ">").replace(/\s*</g, "<").replace("\n", "");
        };
        return Xml;
    }());
    Marketing.Xml = Xml;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var TransactionCurrency = (function () {
        function TransactionCurrency() {
        }
        /**
         * Gets the default currency for the user
         * @param systemUserId The user Id.
         */
        TransactionCurrency.getDefaultTransactionCurrencyId = function (systemUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var transactionCurrencyIdAttributeName, organizationIdAttributeName, baseCurrencyIdValueAttributeName, organizationCurrency, baseCurrency;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transactionCurrencyIdAttributeName = "transactioncurrencyid";
                            organizationIdAttributeName = "organizationid";
                            baseCurrencyIdValueAttributeName = "_basecurrencyid_value";
                            return [4 /*yield*/, Xrm.WebApi.retrieveRecord(Marketing.EntityNames.SystemUser, systemUserId, ClientUtility.ODataUtil.getSelectOption([transactionCurrencyIdAttributeName, organizationIdAttributeName]))];
                        case 1:
                            organizationCurrency = _a.sent();
                            if (!!ClientUtility.DataUtil.isNullOrUndefined(organizationCurrency)) return [3 /*break*/, 4];
                            if (!(ClientUtility.DataUtil.isNullOrUndefined(organizationCurrency[transactionCurrencyIdAttributeName]) &&
                                !ClientUtility.DataUtil.isNullOrUndefined(organizationCurrency[organizationIdAttributeName]))) return [3 /*break*/, 3];
                            return [4 /*yield*/, Xrm.WebApi.retrieveRecord(Marketing.EntityNames.Organization, organizationCurrency[organizationIdAttributeName], ClientUtility.ODataUtil.getSelectOption([baseCurrencyIdValueAttributeName]))];
                        case 2:
                            baseCurrency = _a.sent();
                            return [2 /*return*/, baseCurrency[baseCurrencyIdValueAttributeName]];
                        case 3: return [2 /*return*/, organizationCurrency[transactionCurrencyIdAttributeName]];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Gets the currency from the given attribute or the default currency for the current user.
         * @param attributeName The currency attribute name.
         */
        TransactionCurrency.getTransactionCurrency = function (attributeName) {
            return __awaiter(this, void 0, void 0, function () {
                var transactionCurrencyIdAttribute, transactionCurrencyId, transactionCurrencyIdAttributeValue, userId, currencyNameAttributeName, transactionCurrencyRecord, currencyName;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transactionCurrencyIdAttribute = Xrm.Page.getAttribute(attributeName);
                            transactionCurrencyId = null;
                            if (!ClientUtility.DataUtil.isNullOrUndefined(transactionCurrencyIdAttribute)) {
                                transactionCurrencyIdAttributeValue = transactionCurrencyIdAttribute.getValue();
                                if (!ClientUtility.DataUtil.isNullOrUndefined(transactionCurrencyIdAttributeValue) &&
                                    transactionCurrencyIdAttributeValue.length > 0) {
                                    transactionCurrencyId = transactionCurrencyIdAttributeValue[0].id;
                                }
                            }
                            if (!ClientUtility.DataUtil.isNullOrUndefined(transactionCurrencyId)) return [3 /*break*/, 2];
                            userId = Xrm.Page.context.getUserId();
                            return [4 /*yield*/, Marketing.TransactionCurrency.getDefaultTransactionCurrencyId(userId)];
                        case 1:
                            transactionCurrencyId = _a.sent();
                            _a.label = 2;
                        case 2:
                            currencyNameAttributeName = "currencyname";
                            return [4 /*yield*/, Xrm.WebApi.retrieveRecord(Marketing.EntityNames.TransactionCurrency, transactionCurrencyId, ClientUtility.ODataUtil.getSelectOption([currencyNameAttributeName]))];
                        case 3:
                            transactionCurrencyRecord = _a.sent();
                            currencyName = "";
                            if (!ClientUtility.DataUtil.isNullOrUndefined(transactionCurrencyRecord[currencyNameAttributeName])) {
                                currencyName = transactionCurrencyRecord[currencyNameAttributeName].toString();
                            }
                            return [2 /*return*/, {
                                    entityType: Marketing.EntityNames.TransactionCurrency,
                                    id: transactionCurrencyId,
                                    name: currencyName,
                                }];
                    }
                });
            });
        };
        return TransactionCurrency;
    }());
    Marketing.TransactionCurrency = TransactionCurrency;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var PrivilegeNames = (function () {
        function PrivilegeNames() {
        }
        return PrivilegeNames;
    }());
    PrivilegeNames.ReadLead = "prvReadLead";
    PrivilegeNames.CreateLead = "prvCreateLead";
    PrivilegeNames.CreateOpportunity = "prvCreateOpportunity";
    PrivilegeNames.CreateOrder = "prvCreateOrder";
    PrivilegeNames.CreateQuote = "prvCreateQuote";
    PrivilegeNames.CreateAccount = "prvCreateAccount";
    PrivilegeNames.CreateContact = "prvCreateContact";
    Marketing.PrivilegeNames = PrivilegeNames;
})(Marketing || (Marketing = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Marketing;
(function (Marketing) {
    var ODataServiceClient = (function () {
        function ODataServiceClient() {
        }
        ODataServiceClient.prototype.postReq = function (url, requestBody) {
            return new Promise(function (success, reject) {
                var request = new XMLHttpRequest();
                request.open("post", url);
                request.setRequestHeader("Accept", "application/json");
                request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                request.setRequestHeader("OData-MaxVersion", "4.0");
                request.setRequestHeader("OData-Version", "4.0");
                request.onreadystatechange = function () {
                    if (request.readyState === 4) {
                        request.onreadystatechange = null;
                        var status = request.status;
                        if (status >= 200 && status < 300) {
                            success(request.response);
                        }
                        else {
                            reject(request.response);
                        }
                    }
                };
                request.send(JSON.stringify(requestBody));
            });
        };
        ODataServiceClient.prototype.getReq = function (url) {
            return new Promise(function (success, reject) {
                var request = new XMLHttpRequest();
                request.open("GET", url);
                request.onreadystatechange = function () {
                    if (request.readyState === 4) {
                        request.onreadystatechange = null;
                        var status = request.status;
                        if (status >= 200 && status < 300) {
                            success(request.response);
                        }
                        else {
                            reject(request.response);
                        }
                    }
                };
                request.send();
            });
        };
        return ODataServiceClient;
    }());
    Marketing.ODataServiceClient = ODataServiceClient;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var Promises = (function () {
        function Promises() {
        }
        Promises.promiseAll = function (promises) {
            var results = [];
            return promises.reduce(function (acc, promise) { return acc.then(function () { return promise; }).then(function (r) { return results.push(r); }); }, Promise.resolve()).then(function () { return results; });
        };
        return Promises;
    }());
    Marketing.Promises = Promises;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var Marketing;
(function (Marketing) {
    var CascadingRelationshipType = (function () {
        function CascadingRelationshipType(relationship) {
            if (!ClientUtility.DataUtil.isNullOrUndefined(relationship.CascadeConfiguration)) {
                this.Assign = relationship.CascadeConfiguration.Assign;
                this.Delete = relationship.CascadeConfiguration.Delete;
                this.Merge = relationship.CascadeConfiguration.Merge;
                this.Reparent = relationship.CascadeConfiguration.Reparent;
                this.RollupView = relationship.CascadeConfiguration.RollupView;
                this.Share = relationship.CascadeConfiguration.Share;
                this.Unshare = relationship.CascadeConfiguration.Unshare;
            }
            else {
                /// If no Cascade Configuration is provided, by default it will be considered as "Referential"
                this.Assign = CascadingRelationshipType.NoCascade;
                this.Delete = CascadingRelationshipType.RemoveLink;
                this.Merge = CascadingRelationshipType.Cascade;
                this.Reparent = CascadingRelationshipType.NoCascade;
                this.RollupView = CascadingRelationshipType.NoCascade;
                this.Share = CascadingRelationshipType.NoCascade;
                this.Unshare = CascadingRelationshipType.NoCascade;
                this.ReferencingEntity = CascadingRelationshipType.NoCascade;
            }
            this.IsCustomRelationship = relationship.IsCustomRelationship;
            this.ReferencingEntity = relationship.ReferencingEntity;
        }
        CascadingRelationshipType.prototype.GetRelationshipType = function () {
            /**
             * The logic below has been implemented from the code file called "SystemCustomizationUtility.cs"
             * in CRM repo
             **/
            // For parental relationships, all actions are cascading
            if (this.Share === CascadingRelationshipType.Cascade &&
                this.Unshare === CascadingRelationshipType.Cascade &&
                this.Assign === CascadingRelationshipType.Cascade &&
                this.Reparent === CascadingRelationshipType.Cascade &&
                this.Delete === CascadingRelationshipType.Cascade) {
                return CascadingRelationship.Parental;
            }
            // For referential relationships, no actions are cascading
            // and delete removes link
            // For referential relationships, delete can also be Cascade None
            // if referencing entity is virtual entity
            if (this.Share === CascadingRelationshipType.NoCascade &&
                this.Unshare === CascadingRelationshipType.NoCascade &&
                this.Assign === CascadingRelationshipType.NoCascade &&
                this.Reparent === CascadingRelationshipType.NoCascade &&
                (this.Delete === CascadingRelationshipType.RemoveLink ||
                    this.Delete === CascadingRelationshipType.NoCascade) &&
                this.Merge === CascadingRelationshipType.Cascade) {
                return CascadingRelationship.Referential;
            }
            // For referential relationships with restricted delete,
            // no actions are cascading and delete is restricted
            if (this.Share === CascadingRelationshipType.NoCascade &&
                this.Unshare === CascadingRelationshipType.NoCascade &&
                this.Assign === CascadingRelationshipType.NoCascade &&
                this.Reparent === CascadingRelationshipType.NoCascade &&
                this.Delete === CascadingRelationshipType.Restrict &&
                this.Merge === CascadingRelationshipType.Cascade) {
                return CascadingRelationship.ReferentialRestrictDelete;
            }
            else if (this.IsCustomRelationship) {
                return CascadingRelationship.ConfigurableCascading;
            }
            else {
                return CascadingRelationship.None;
            }
        };
        return CascadingRelationshipType;
    }());
    CascadingRelationshipType.Cascade = 'Cascade';
    CascadingRelationshipType.NoCascade = 'NoCascade';
    CascadingRelationshipType.RemoveLink = 'RemoveLink';
    CascadingRelationshipType.Restrict = 'Restrict';
    Marketing.CascadingRelationshipType = CascadingRelationshipType;
    var CascadingRelationship;
    (function (CascadingRelationship) {
        CascadingRelationship[CascadingRelationship["Parental"] = 0] = "Parental";
        CascadingRelationship[CascadingRelationship["ConfigurableCascading"] = 1] = "ConfigurableCascading";
        CascadingRelationship[CascadingRelationship["Referential"] = 2] = "Referential";
        CascadingRelationship[CascadingRelationship["ReferentialRestrictDelete"] = 3] = "ReferentialRestrictDelete";
        CascadingRelationship[CascadingRelationship["None"] = 4] = "None";
    })(CascadingRelationship = Marketing.CascadingRelationship || (Marketing.CascadingRelationship = {}));
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var EMTelemetry = (function () {
        function EMTelemetry() {
        }
        Object.defineProperty(EMTelemetry, "Logger", {
            get: function () {
                if (!this.logger) {
                    this.logger = new Marketing.UCILogger(); // TODO : Add a factory class to provide appropriate logger if more loggers are added in future.
                }
                return this.logger;
            },
            enumerable: true,
            configurable: true
        });
        EMTelemetry.LogInfo = function (featureName, source, methodName, message, action, actionOn, data, type) {
            if (type === void 0) { type = Marketing.LogType.Default; }
            EMTelemetry.Logger.LogInfo(Marketing.TelemetryConstants.EnterpriseMarketing, featureName, source, methodName, message, action, actionOn, data, type);
        };
        EMTelemetry.LogError = function (featureName, source, methodName, error, mitigation, action, actionOn, data, type) {
            if (type === void 0) { type = Marketing.LogType.Default; }
            EMTelemetry.Logger.LogError(Marketing.TelemetryConstants.EnterpriseMarketing, featureName, source, methodName, error, mitigation, action, actionOn, data, type);
        };
        return EMTelemetry;
    }());
    Marketing.EMTelemetry = EMTelemetry;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var UCILogger = (function () {
        function UCILogger() {
        }
        UCILogger.prototype.LogInfo = function (area, featureName, source, methodName, message, action, actionOn, data, type) {
            if (Xrm && Xrm.Reporting) {
                var componentName = area + "." + featureName + "." + methodName;
                var parameters = this.extractParameters(source, message, action, actionOn, data, type);
                Xrm.Reporting.reportSuccess(componentName, parameters);
            }
        };
        UCILogger.prototype.LogError = function (area, featureName, source, methodName, error, mitigation, action, actionOn, data, type) {
            if (Xrm && Xrm.Reporting) {
                var componentName = area + "." + featureName + "." + methodName;
                var parameters = this.extractParameters(source, null, action, actionOn, data, type);
                Xrm.Reporting.reportFailure(componentName, error, mitigation, parameters);
            }
        };
        UCILogger.prototype.extractParameters = function (source, message, action, actionOn, data, type) {
            var params = data ? data : new Array();
            if (source) {
                params.push({
                    name: Marketing.TelemetryConstants.SourceParameter,
                    value: source
                });
            }
            if (message) {
                params.push({
                    name: Marketing.TelemetryConstants.MessageParameter,
                    value: message
                });
            }
            if (action) {
                params.push({
                    name: Marketing.TelemetryConstants.ActionParameter,
                    value: action
                });
            }
            if (actionOn) {
                params.push({
                    name: Marketing.TelemetryConstants.ActionOnParameter,
                    value: actionOn
                });
            }
            if (type) {
                params.push({
                    name: Marketing.TelemetryConstants.TypeParameter,
                    value: type
                });
            }
            return params;
        };
        return UCILogger;
    }());
    Marketing.UCILogger = UCILogger;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var TelemetryConstants = (function () {
        function TelemetryConstants() {
        }
        return TelemetryConstants;
    }());
    TelemetryConstants.EnterpriseMarketing = "EnterpriseMarketing";
    TelemetryConstants.MarketingList = "MarketingList";
    TelemetryConstants.ManageMembers = "ManageMembers";
    TelemetryConstants.Campaign = "Campaign";
    TelemetryConstants.CampaignActivity = "CampaignActivity";
    TelemetryConstants.QuickCampaign = "QuickCampaign";
    TelemetryConstants.CreateOpportunity = "CreateOpportunity";
    TelemetryConstants.ActionParameter = "Action";
    TelemetryConstants.ActionOnParameter = "ActionOn";
    TelemetryConstants.MessageParameter = "Message";
    TelemetryConstants.SourceParameter = "Source";
    TelemetryConstants.TypeParameter = "Type";
    Marketing.TelemetryConstants = TelemetryConstants;
    var LogType;
    (function (LogType) {
        LogType[LogType["Default"] = 0] = "Default";
        LogType[LogType["CustomerIntelligence"] = 1] = "CustomerIntelligence";
        LogType[LogType["BusinessIntelligence"] = 2] = "BusinessIntelligence";
    })(LogType = Marketing.LogType || (Marketing.LogType = {}));
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../Localization/Provider/StringProvider.ts" />
/// <reference path="Contracts/AddListMembersListRequest.ts" />
/// <reference path="Contracts/CopyMembersListRequest.ts" />
/// <reference path="Contracts/ODataAssociateRequest.ts" />
/// <reference path="Contracts/QualifyMemberListRequest.ts" />
/// <reference path="Contracts/RemoveMembersByFetchXmlListRequest.ts" />
/// <reference path="Contracts/RemoveMembersByIdsRequest.ts" />
/// <reference path="Activity/ActivityEntityCodes.ts" />
/// <reference path="Activity/ActivityEntityFieldNames.ts" />
/// <reference path="Activity/Appointment/AppointmentEntityCodes.ts" />
/// <reference path="Activity/Appointment/AppointmentEntityFieldNames.ts" />
/// <reference path="Activity/Email/EmailEntityCodes.ts" />
/// <reference path="Activity/Email/EmailEntityFieldNames.ts" />
/// <reference path="Activity/Fax/FaxEntityCodes.ts" />
/// <reference path="Activity/Letter/LetterEntityCodes.ts" />
/// <reference path="ActivityParty/ActivityPartyEntityFieldNames.ts" />
/// <reference path="Campaign/CampaignCommonLibrary.ts" />
/// <reference path="Campaign/CampaignCommonConstants.ts" />
/// <reference path="CampaignActivity/CampaignActivityEntityCodes.ts" />
/// <reference path="CampaignActivity/CampaignActivityCommonConstants.ts" />
/// <reference path="CampaignActivity/CampaignActivityEntityFieldNames.ts" />
/// <reference path="CampaignActivity/CampaignActivityCommonLibrary.ts" />
/// <reference path="CampaignActivityItem/CampaignActivityItemEntityFieldNames.ts" />
/// <reference path="CampaignItem/CampaignItemEntityFieldNames.ts" />
/// <reference path="CampaignItem/CampaignItemODataFieldNames.ts" />
/// <reference path="CampaignResponse/CampaignResponseAction.ts" />
/// <reference path="CampaignResponse/CampaignResponseChannelOptionSetValues.ts" />
/// <reference path="CampaignResponse/CampaignResponseConstants.ts" />
/// <reference path="CampaignResponse/CampaignResponseState.ts" />
/// <reference path="CheckboxState.ts" />
/// <reference path="ClientUtil.ts" />
/// <reference path="Collections.ts"/>
/// <reference path="Controls.ts"/>
/// <reference path="DateHelper.ts"/>
/// <reference path="DateValidation.ts" />
/// <reference path="DialogUtil.ts" />
/// <reference path="EntityFullTypeNames.ts" />
/// <reference path="EntityId.ts" />
/// <reference path="EntityNames.ts" />
/// <reference path="EntityNamesPluralized.ts" />
/// <reference path="EntityRelationshipNames.ts" />
/// <reference path="EntityTypeCodes.ts" />
/// <reference path="FCBUtil.ts" />
/// <reference path="Grid/GridConstants.ts" />
/// <reference path="Guard.ts" />
/// <reference path="Help.ts" />
/// <reference path="ILookupControlItem.ts" />
/// <reference path="LeadState.ts" />
/// <reference path="LeadStatus.ts" />
/// <reference path="List/ListEntityControlNames.ts" />
/// <reference path="List/ListEntityFieldNames.ts" />
/// <reference path="List/ListViewIds.ts" />
/// <reference path="List/MemberOperations.ts" />
/// <reference path="List/QualifyListMembersDialogParameters.ts" />
/// <reference path="List/QualifyListMembersPages.ts" />
/// <reference path="ListLookupParameters.ts" />
/// <reference path="ListOperation/ListOperationUtils.ts" />
/// <reference path="MessageKeys.ts" />
/// <reference path="MetadataDrivenDialogConstants.ts" />
/// <reference path="OData.ts" />
/// <reference path="Opportunity/ConvertToOpportunityDialogParameters.ts" />
/// <reference path="Opportunity/OpportunityEntityFieldNames.ts" />
/// <reference path="Strings.ts" />
/// <reference path="TransactionCurrency.ts" />
/// <reference path="PrivilegeNames.ts" />
/// <reference path="IServiceClient.ts" />
/// <reference path="ODataServiceClient.ts" />
/// <reference path="Promises.ts" />
/// <reference path="CascadingRelationshipType.ts" />
/// <reference path="Telemetry/EMTelemetry.ts" />
/// <reference path="Telemetry/ILogger.ts" />
/// <reference path="Telemetry/UCILogger.ts" />
/// <reference path="Telemetry/TelemetryConstants.ts" />
