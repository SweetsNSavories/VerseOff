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
    var BulkOperationConstants = (function () {
        function BulkOperationConstants() {
        }
        return BulkOperationConstants;
    }());
    BulkOperationConstants.ActivityId = "activity_id";
    BulkOperationConstants.FormValues = "form_values";
    BulkOperationConstants.AddToQueue = "add_to_queue";
    BulkOperationConstants.ActivityTypeId = "activity_type_id";
    BulkOperationConstants.EntityIds = "entity_ids";
    BulkOperationConstants.EntityTypeCode = "entity_type_code";
    BulkOperationConstants.FetchXml = "fetch_xml";
    BulkOperationConstants.IsEmailActivityFormParameter = "is_email_activity";
    BulkOperationConstants.TargetedRecordTypeCode = "targetedrecordtypecode";
    BulkOperationConstants.OwnerId = "owner_id";
    BulkOperationConstants.OwnershipOption = "ownership_option";
    BulkOperationConstants.QueueId = "queue_id";
    BulkOperationConstants.QuickCampaignName = "quick_campaign_name";
    BulkOperationConstants.SelectedRecordsCount = "selected_records_count";
    BulkOperationConstants.SelectionMode = "selection_mode";
    BulkOperationConstants.SendEmail = "send_email";
    BulkOperationConstants.SummaryTabActivityId = "summary_tab_activity_id";
    BulkOperationConstants.SummaryTabNameId = "summary_tab_name_id";
    BulkOperationConstants.SummaryTabOwnerId = "summary_tab_owner_id";
    BulkOperationConstants.SummaryTabScopeId = "summary_tab_scope_id";
    BulkOperationConstants.ActivityTypesUrl = "/api/data/v9.0/EntityDefinitions?$select=ObjectTypeCode,DisplayName&$filter=LogicalName eq 'phonecall' "
        + "or LogicalName eq 'appointment' or LogicalName eq 'letter' or LogicalName eq 'fax' or LogicalName eq 'email'";
    Marketing.BulkOperationConstants = BulkOperationConstants;
    var QuickCampaignTabNames = (function () {
        function QuickCampaignTabNames() {
        }
        return QuickCampaignTabNames;
    }());
    QuickCampaignTabNames.Appointment = "appointment_tab";
    QuickCampaignTabNames.Email = "email_tab";
    QuickCampaignTabNames.Fax = "fax_tab";
    QuickCampaignTabNames.Letter = "letter_tab";
    QuickCampaignTabNames.PhoneCall = "phone_call_tab";
    QuickCampaignTabNames.Start = "start_tab";
    QuickCampaignTabNames.Summary = "summary_tab";
    QuickCampaignTabNames.Name = "name_tab";
    QuickCampaignTabNames.ActivityType = "activity_type_tab";
    Marketing.QuickCampaignTabNames = QuickCampaignTabNames;
    var QuickCampaignSelectionMode;
    (function (QuickCampaignSelectionMode) {
        QuickCampaignSelectionMode[QuickCampaignSelectionMode["SelectedRecords"] = 1] = "SelectedRecords";
        QuickCampaignSelectionMode[QuickCampaignSelectionMode["CurrentPage"] = 2] = "CurrentPage";
        QuickCampaignSelectionMode[QuickCampaignSelectionMode["AllPages"] = 3] = "AllPages";
    })(QuickCampaignSelectionMode = Marketing.QuickCampaignSelectionMode || (Marketing.QuickCampaignSelectionMode = {}));
    var OwnershipOption;
    (function (OwnershipOption) {
        OwnershipOption[OwnershipOption["UserOrTeam"] = 0] = "UserOrTeam";
        OwnershipOption[OwnershipOption["Record"] = 1] = "Record";
        OwnershipOption[OwnershipOption["Me"] = 2] = "Me";
    })(OwnershipOption = Marketing.OwnershipOption || (Marketing.OwnershipOption = {}));
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var BulkOperationLibrary = (function () {
        function BulkOperationLibrary() {
            var _this = this;
            this.formOnLoad = function () {
                _this.setVisibleSubgrid();
                _this.setTabsVisibility();
            };
        }
        BulkOperationLibrary.prototype.setTabsVisibility = function () {
            if (!ClientUtility.ClientUtil.isUCI()) {
                // These are duplicates that need to be removed in web-client
                this.setPageNavigationItemVisibility("navRelationshipActivities", false);
                this.setPageNavigationItemVisibility("navRelationshipBulkOperationLogs", false);
            }
            // These are new tabs created from the new N2N relationships between bulkoperation and accounts/contacts/leads.
            // They won't work in WebClient without changes in CRM, and in UCI, we show the members tab instead
            this.setPageNavigationItemVisibility("navQCRelatedAccounts", false);
            this.setPageNavigationItemVisibility("navQCRelatedContacts", false);
            this.setPageNavigationItemVisibility("navQCRelatedLeads", false);
        };
        BulkOperationLibrary.prototype.setPageNavigationItemVisibility = function (itemName, visibility) {
            if (!ClientUtility.DataUtil.isNullOrUndefined(itemName)) {
                var item = Xrm.Page.ui.navigation.items.get(itemName);
                if (!ClientUtility.DataUtil.isNullOrUndefined(item)) {
                    item.setVisible(visibility);
                }
            }
        };
        BulkOperationLibrary.prototype.setVisibleSubgrid = function () {
            var selectedAccountsSubgrid = Xrm.Page.ui.controls.get(Marketing.SelectedMembersSubgridNames.SelectedAccounts);
            var selectedContactsSubgrid = Xrm.Page.ui.controls.get(Marketing.SelectedMembersSubgridNames.SelectedContacts);
            var selectedLeadsSubgrid = Xrm.Page.ui.controls.get(Marketing.SelectedMembersSubgridNames.SelectedLeads);
            var excludedAccountsSubgrid = Xrm.Page.ui.controls.get(Marketing.SelectedMembersSubgridNames.ExcludedAccounts);
            var excludedContactsSubgrid = Xrm.Page.ui.controls.get(Marketing.SelectedMembersSubgridNames.ExcludedContacts);
            var excludedLeadsSubgrid = Xrm.Page.ui.controls.get(Marketing.SelectedMembersSubgridNames.ExcludedLeads);
            var targetedRecordTypeAttribute = Xrm.Page.getAttribute(Marketing.BulkOperationConstants.TargetedRecordTypeCode);
            var memberTypeValue = !ClientUtility.DataUtil.isNullOrUndefined(targetedRecordTypeAttribute)
                ? targetedRecordTypeAttribute.getValue()
                : null;
            if (!ClientUtility.DataUtil.isNullOrUndefined(memberTypeValue)) {
                var targetedRecordType = parseInt(memberTypeValue.toString(), 10);
                var accountsRowVisibility = targetedRecordType === Marketing.EntityTypeCodes.Account;
                var contactsRowVisibility = targetedRecordType === Marketing.EntityTypeCodes.Contact;
                var leadsRowVisibility = targetedRecordType === Marketing.EntityTypeCodes.Lead;
                selectedAccountsSubgrid && this.setVisibility(selectedAccountsSubgrid, accountsRowVisibility);
                selectedContactsSubgrid && this.setVisibility(selectedContactsSubgrid, contactsRowVisibility);
                selectedLeadsSubgrid && this.setVisibility(selectedLeadsSubgrid, leadsRowVisibility);
                excludedAccountsSubgrid && this.setVisibility(excludedAccountsSubgrid, accountsRowVisibility);
                excludedContactsSubgrid && this.setVisibility(excludedContactsSubgrid, contactsRowVisibility);
                excludedLeadsSubgrid && this.setVisibility(excludedLeadsSubgrid, leadsRowVisibility);
            }
            this.setVisibleSubgridDeprecated();
        };
        // TODO: remove when old Quick Campaign form is deleted
        BulkOperationLibrary.prototype.setVisibleSubgridDeprecated = function () {
            var accountsSubgrid = Xrm.Page.ui.controls.get("accounts");
            var contactsSubgrid = Xrm.Page.ui.controls.get("contacts");
            var leadsSubgrid = Xrm.Page.ui.controls.get("leads");
            var accountsSubgridUCI = Xrm.Page.ui.controls.get("accounts_uci");
            var contactsSubgridUCI = Xrm.Page.ui.controls.get("contacts_uci");
            var leadsSubgridUCI = Xrm.Page.ui.controls.get("leads_uci");
            var accountsSubgridExcludedUCI = Xrm.Page.ui.controls.get("excluded_accounts_uci");
            var contactsSubgridExcludedUCI = Xrm.Page.ui.controls.get("excluded_contacts_uci");
            var leadsSubgridExcludedUCI = Xrm.Page.ui.controls.get("excluded_leads_uci");
            var targetedRecordTypeAttribute = Xrm.Page.getAttribute(Marketing.BulkOperationConstants.TargetedRecordTypeCode);
            var memberTypeValue = !ClientUtility.DataUtil.isNullOrUndefined(targetedRecordTypeAttribute)
                ? targetedRecordTypeAttribute.getValue()
                : null;
            if (!ClientUtility.DataUtil.isNullOrUndefined(memberTypeValue)) {
                var targetedRecordType = parseInt(memberTypeValue.toString(), 10);
                var accountsRowVisibility = targetedRecordType === Marketing.EntityTypeCodes.Account;
                var contactsRowVisibility = targetedRecordType === Marketing.EntityTypeCodes.Contact;
                var leadsRowVisibility = targetedRecordType === Marketing.EntityTypeCodes.Lead;
                var isUCI = ClientUtility.ClientUtil.isUCI();
                accountsSubgridUCI && this.setVisibility(accountsSubgridUCI, accountsRowVisibility && isUCI);
                contactsSubgridUCI && this.setVisibility(contactsSubgridUCI, contactsRowVisibility && isUCI);
                leadsSubgridUCI && this.setVisibility(leadsSubgridUCI, leadsRowVisibility && isUCI);
                accountsSubgrid && this.setVisibility(accountsSubgrid, accountsRowVisibility && !isUCI);
                contactsSubgrid && this.setVisibility(contactsSubgrid, contactsRowVisibility && !isUCI);
                leadsSubgrid && this.setVisibility(leadsSubgrid, leadsRowVisibility && !isUCI);
                accountsSubgridExcludedUCI && this.setVisibility(accountsSubgridExcludedUCI, accountsRowVisibility);
                contactsSubgridExcludedUCI && this.setVisibility(contactsSubgridExcludedUCI, contactsRowVisibility);
                leadsSubgridExcludedUCI && this.setVisibility(leadsSubgridExcludedUCI, leadsRowVisibility);
            }
        };
        BulkOperationLibrary.prototype.setVisibility = function (control, visible) {
            if (control) {
                control.setVisible(visible);
            }
        };
        return BulkOperationLibrary;
    }());
    Marketing.BulkOperationLibrary = BulkOperationLibrary;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var BulkOperationWizard;
    (function (BulkOperationWizard) {
        var Field = (function () {
            function Field() {
            }
            Object.defineProperty(Field, "activityTypeId", {
                get: function () {
                    return Marketing.Controls.getValue(Marketing.BulkOperationConstants.ActivityTypeId);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Field, "entitiesIds", {
                get: function () {
                    return Marketing.Controls.getValue(Marketing.BulkOperationConstants.EntityIds);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Field, "entityTypeCode", {
                get: function () {
                    return Marketing.Controls.getValue(Marketing.BulkOperationConstants.EntityTypeCode);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Field, "selectedTemplateId", {
                get: function () {
                    return Marketing.Controls.getValue(Marketing.NewEmailsDialog.SelectedTemplateId);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Field, "targetOption", {
                get: function () {
                    return Marketing.Controls.getValue(Marketing.BulkOperationConstants.SelectionMode);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Field, "fetchXml", {
                get: function () {
                    return Marketing.Controls.getValue(Marketing.BulkOperationConstants.FetchXml);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Field, "activityType", {
                get: function () {
                    return Marketing.Controls.getValue(Marketing.BulkOperationConstants.ActivityTypeId);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Field, "quickCampaignName", {
                get: function () {
                    return Marketing.Controls.getValue(Marketing.BulkOperationConstants.QuickCampaignName);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Field, "sendEmail", {
                get: function () {
                    return Marketing.Controls.getValue(Marketing.BulkOperationConstants.SendEmail);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Field, "ownerId", {
                get: function () {
                    return Marketing.Controls.getValue(Marketing.BulkOperationConstants.OwnerId);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Field, "addToQueue", {
                get: function () {
                    return Marketing.Controls.getValue(Marketing.BulkOperationConstants.AddToQueue);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Field, "queueId", {
                get: function () {
                    return Marketing.Controls.getValue(Marketing.BulkOperationConstants.QueueId);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Field, "ownershipOption", {
                get: function () {
                    return Marketing.Controls.getValue(Marketing.BulkOperationConstants.OwnershipOption);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Field, "selectedRecordsCount", {
                get: function () {
                    return Marketing.Controls.getValue(Marketing.BulkOperationConstants.SelectedRecordsCount);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Field, "selectionMode", {
                get: function () {
                    return Marketing.Controls.getValue(Marketing.BulkOperationConstants.SelectionMode);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Field, "isEmailActivityFormParameter", {
                set: function (value) {
                    Marketing.Controls.setValue(Marketing.BulkOperationConstants.IsEmailActivityFormParameter, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Field, "formId", {
                set: function (value) {
                    Marketing.Controls.setValue(Marketing.NewEmailsDialog.FromId, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Field, "activityId", {
                set: function (value) {
                    Marketing.Controls.setValue(Marketing.BulkOperationConstants.ActivityId, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Field, "formValues", {
                get: function () {
                    return Marketing.Controls.getValue(Marketing.BulkOperationConstants.FormValues);
                },
                enumerable: true,
                configurable: true
            });
            return Field;
        }());
        BulkOperationWizard.Field = Field;
    })(BulkOperationWizard = Marketing.BulkOperationWizard || (Marketing.BulkOperationWizard = {}));
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var BulkOperationWizard;
    (function (BulkOperationWizard) {
        var Field = BulkOperationWizard.Field;
        var Ownership = (function () {
            function Ownership() {
            }
            Ownership.getOwner = function (ownerReference) {
                if (ownerReference === void 0) { ownerReference = Field.ownerId; }
                return BulkOperationWizard.Utils.getEntityReference(ownerReference);
            };
            Ownership.getOwnershipOption = function (ownershipOption) {
                if (ownershipOption === void 0) { ownershipOption = Field.ownershipOption; }
                // this converter required because of different set is used for distribution and for quick campaign
                // but the set itself baked into control and fit to distribution scenario
                switch (ownershipOption) {
                    case ODataContract.PropagationOwnershipOptions.None:
                        return Marketing.OwnershipOption.UserOrTeam;
                    case ODataContract.PropagationOwnershipOptions.Caller:
                        return Marketing.OwnershipOption.Me;
                    case ODataContract.PropagationOwnershipOptions.ListMemberOwner:
                        return Marketing.OwnershipOption.Record;
                    default:
                        throw new Error("Unknown ownership option was used.");
                }
            };
            Ownership.getOwnershipDisplayName = function (ownershipOption, ownerReference) {
                switch (ownershipOption) {
                    case Marketing.OwnershipOption.UserOrTeam:
                        return ownerReference.Name;
                    case Marketing.OwnershipOption.Record:
                        return Marketing.StringProvider.getResourceString(Marketing.BulkOperationCreateWizard.RecordOwnershipOptionResource);
                    case Marketing.OwnershipOption.Me:
                        return Marketing.StringProvider.getResourceString(Marketing.BulkOperationCreateWizard.MeOwnershipOptionResource);
                    default:
                        throw new Error("Unknown ownership option was used.");
                }
            };
            return Ownership;
        }());
        BulkOperationWizard.Ownership = Ownership;
    })(BulkOperationWizard = Marketing.BulkOperationWizard || (Marketing.BulkOperationWizard = {}));
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var BulkOperationWizard;
    (function (BulkOperationWizard) {
        var Field = BulkOperationWizard.Field;
        var Utils = (function () {
            function Utils() {
            }
            Utils.convertEntityIdsListToString = function (ids) {
                return ids.reduce(function (acc, id) { return acc += "{" + id + "},"; }, "").slice(0, -1);
            };
            Utils.getQueue = function (queueReference) {
                if (queueReference === void 0) { queueReference = Field.queueId; }
                return Utils.getEntityReference(queueReference);
            };
            Utils.getEntityReference = function (entityReference) {
                if (ClientUtility.DataUtil.isNull(entityReference)) {
                    return {
                        id: ClientUtility.Guid.Empty,
                        entityType: Marketing.EntityNames.SystemUser
                    };
                }
                return {
                    id: entityReference.Id.toString(),
                    entityType: entityReference.LogicalName
                };
            };
            Utils.getSelectedActivityXml = function (activityEntityTypeCode, encoder) {
                if (encoder === void 0) { encoder = Xrm.Encoding.xmlEncode.bind(Xrm.Encoding); }
                var creator = Marketing.ActivityCreation.getActivityCreator(activityEntityTypeCode);
                var clearedXml = Marketing.Xml.removeWhitespaces(creator.activityXml);
                var escapedAndCleared = encoder(clearedXml);
                return escapedAndCleared;
            };
            Utils.getTabNameByActivityTypeCode = function (typeCode) {
                switch (typeCode) {
                    case Marketing.EntityTypeCodes.PhoneCall:
                        return Marketing.QuickCampaignTabNames.PhoneCall;
                    case Marketing.EntityTypeCodes.Appointment:
                        return Marketing.QuickCampaignTabNames.Appointment;
                    case Marketing.EntityTypeCodes.Letter:
                        return Marketing.QuickCampaignTabNames.Letter;
                    case Marketing.EntityTypeCodes.Fax:
                        return Marketing.QuickCampaignTabNames.Fax;
                    case Marketing.EntityTypeCodes.Email:
                        return Marketing.QuickCampaignTabNames.Email;
                    default:
                        throw new Error("Activity type code is not supported");
                }
            };
            Utils.getCurrentUser = function () {
                return {
                    Id: ClientUtility.Guid.tryCreate(Xrm.Page.context.getUserId()),
                    LogicalName: Marketing.EntityNames.SystemUser,
                    Name: Xrm.Page.context.getUserName(),
                };
            };
            return Utils;
        }());
        BulkOperationWizard.Utils = Utils;
    })(BulkOperationWizard = Marketing.BulkOperationWizard || (Marketing.BulkOperationWizard = {}));
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var BulkOperationWizard;
    (function (BulkOperationWizard) {
        var Field = BulkOperationWizard.Field;
        var Ownership = BulkOperationWizard.Ownership;
        var DialogManager = (function () {
            function DialogManager() {
            }
            DialogManager.populateEndTabSummary = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var entityMetadata;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                DialogManager.setValueToTheLabelPlaceholder(Marketing.BulkOperationCreateWizard.NameTemplateResource, Marketing.BulkOperationConstants.SummaryTabNameId, Field.quickCampaignName);
                                return [4 /*yield*/, Xrm.Utility.getEntityMetadata(Marketing.ClientUtil.getEntityName(Field.activityTypeId))];
                            case 1:
                                entityMetadata = _a.sent();
                                DialogManager.setValueToTheLabelPlaceholder(Marketing.BulkOperationCreateWizard.ActivityTemplateResource, Marketing.BulkOperationConstants.SummaryTabActivityId, entityMetadata.DisplayName);
                                DialogManager.setValueToTheLabelPlaceholder(DialogManager.getScopedTemplateResource(Field.selectionMode), Marketing.BulkOperationConstants.SummaryTabScopeId, Field.selectedRecordsCount);
                                DialogManager.setValueToTheLabelPlaceholder(Marketing.BulkOperationCreateWizard.OwnerTemplateResource, Marketing.BulkOperationConstants.SummaryTabOwnerId, Ownership.getOwnershipDisplayName(Ownership.getOwnershipOption(), Field.ownerId));
                                return [2 /*return*/];
                        }
                    });
                });
            };
            DialogManager.populateActivityData = function () {
                if (Field.activityTypeId === Marketing.EntityTypeCodes.Email) {
                    var ownershipOption = Ownership.getOwnershipOption();
                    switch (ownershipOption) {
                        case Marketing.OwnershipOption.UserOrTeam:
                            var ownerReference = Field.ownerId;
                            if (ownerReference.LogicalName != "team") {
                                Field.formId = [{
                                        id: ownerReference.Id,
                                        entityType: ownerReference.LogicalName,
                                        name: ownerReference.Name
                                    }];
                            }
                            else {
                                var currentUserReference_1 = BulkOperationWizard.Utils.getCurrentUser();
                                Field.formId = [{
                                        id: currentUserReference_1.Id,
                                        entityType: currentUserReference_1.LogicalName,
                                        name: currentUserReference_1.Name
                                    }];
                            }
                            break;
                        case Marketing.OwnershipOption.Record:
                            Field.formId = null;
                            break;
                        case Marketing.OwnershipOption.Me:
                            var currentUserReference = BulkOperationWizard.Utils.getCurrentUser();
                            Field.formId = [{
                                    id: currentUserReference.Id,
                                    entityType: currentUserReference.LogicalName,
                                    name: currentUserReference.Name
                                }];
                            break;
                    }
                }
            };
            DialogManager.getScopedTemplateResource = function (selectionMode) {
                switch (selectionMode) {
                    case Marketing.QuickCampaignSelectionMode.SelectedRecords:
                        return Marketing.BulkOperationCreateWizard.SelectedRecordsScopeTemplateResource;
                    case Marketing.QuickCampaignSelectionMode.CurrentPage:
                        return Marketing.BulkOperationCreateWizard.CurrentPageScopeTemplateResource;
                    case Marketing.QuickCampaignSelectionMode.AllPages:
                        return Marketing.BulkOperationCreateWizard.AllPagesScopeTemplateResource;
                    default:
                        throw new Error("Unkwnown selection mode.");
                }
            };
            DialogManager.setValueToTheLabelPlaceholder = function (templateResource, labelId, value) {
                Xrm.Page.ui.controls.get(labelId)
                    .setLabel(Marketing.StringProvider.getResourceString(templateResource)
                    .replace("{0}", value.toString()));
            };
            return DialogManager;
        }());
        BulkOperationWizard.DialogManager = DialogManager;
    })(BulkOperationWizard = Marketing.BulkOperationWizard || (Marketing.BulkOperationWizard = {}));
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var BulkOperationWizard;
    (function (BulkOperationWizard) {
        var Field = BulkOperationWizard.Field;
        var NameTab = (function () {
            function NameTab() {
            }
            NameTab.validate = function (messages) {
                if (ClientUtility.DataUtil.isNullOrWhiteSpace(Field.quickCampaignName)) {
                    messages.push(Marketing.StringProvider.getResourceString(Marketing.BulkOperationCreateWizard.QuickCampaignNameRequired));
                }
            };
            return NameTab;
        }());
        BulkOperationWizard.NameTab = NameTab;
    })(BulkOperationWizard = Marketing.BulkOperationWizard || (Marketing.BulkOperationWizard = {}));
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var BulkOperationWizard;
    (function (BulkOperationWizard) {
        var Field = BulkOperationWizard.Field;
        var Ownership = BulkOperationWizard.Ownership;
        var ActivityTypeTab = (function () {
            function ActivityTypeTab() {
            }
            ActivityTypeTab.validate = function (messages) {
                if (ClientUtility.DataUtil.isNullOrWhiteSpace(Field.activityTypeId)) {
                    messages.push(Marketing.StringProvider.getResourceString(Marketing.BulkOperationCreateWizard.ActivityTypeRequired));
                }
                if (Ownership.getOwnershipOption() === Marketing.OwnershipOption.UserOrTeam
                    && ClientUtility.DataUtil.isNullOrWhiteSpace(Field.ownerId)) {
                    messages.push(Marketing.StringProvider.getResourceString(Marketing.MessageKeys.OwnerRequired));
                }
                if (Field.addToQueue
                    && ClientUtility.DataUtil.isNullOrWhiteSpace(Field.queueId)) {
                    messages.push(Marketing.StringProvider.getResourceString(Marketing.MessageKeys.QueueRequired));
                }
            };
            return ActivityTypeTab;
        }());
        BulkOperationWizard.ActivityTypeTab = ActivityTypeTab;
    })(BulkOperationWizard = Marketing.BulkOperationWizard || (Marketing.BulkOperationWizard = {}));
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var BulkOperationWizard;
    (function (BulkOperationWizard) {
        var Field = BulkOperationWizard.Field;
        var ActivityCreatorTab = (function () {
            function ActivityCreatorTab() {
            }
            ActivityCreatorTab.validate = function (messages) {
                return __awaiter(this, void 0, void 0, function () {
                    var result, err;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, Marketing.ActivityCreation.getActivityCreator(Field.activityTypeId).validateActivity()];
                            case 1:
                                result = _a.sent();
                                err = result.messages;
                                if (!ClientUtility.DataUtil.isNullOrEmptyString(err)) {
                                    messages.push(err);
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            };
            return ActivityCreatorTab;
        }());
        BulkOperationWizard.ActivityCreatorTab = ActivityCreatorTab;
    })(BulkOperationWizard = Marketing.BulkOperationWizard || (Marketing.BulkOperationWizard = {}));
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var Field = Marketing.BulkOperationWizard.Field;
    var Ownership = Marketing.BulkOperationWizard.Ownership;
    var Utils = Marketing.BulkOperationWizard.Utils;
    var NameTab = Marketing.BulkOperationWizard.NameTab;
    var ActivityTypeTab = Marketing.BulkOperationWizard.ActivityTypeTab;
    var ActivityCreatorTab = Marketing.BulkOperationWizard.ActivityCreatorTab;
    var DialogManager = Marketing.BulkOperationWizard.DialogManager;
    var BulkOperationCreateWizard = (function () {
        function BulkOperationCreateWizard() {
            var _this = this;
            this.currentTabName = Marketing.QuickCampaignTabNames.Start;
            this.clicked = false;
            this.onBackClicked = function (tabName) {
                _this.moveTo(tabName);
            };
            this.onContinueClicked = function (tabName) { return __awaiter(_this, void 0, void 0, function () {
                var validationResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.isValid()];
                        case 1:
                            validationResult = _a.sent();
                            if (!validationResult.valid) {
                                return [2 /*return*/, Marketing.ClientUtil.alert(validationResult.messages)];
                            }
                            this.moveTo(tabName);
                            return [2 /*return*/];
                    }
                });
            }); };
            this.onContinueWithActivityClicked = function () { return __awaiter(_this, void 0, void 0, function () {
                var validationResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.isValid()];
                        case 1:
                            validationResult = _a.sent();
                            if (!validationResult.valid) {
                                return [2 /*return*/, Marketing.ClientUtil.alert(validationResult.messages)];
                            }
                            Field.activityId = Field.activityTypeId;
                            this.moveTo(Utils.getTabNameByActivityTypeCode(Field.activityTypeId));
                            DialogManager.populateActivityData();
                            return [2 /*return*/];
                    }
                });
            }); };
            this.onContinueWithSummaryClicked = function () { return __awaiter(_this, void 0, void 0, function () {
                var validationResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.isValid()];
                        case 1:
                            validationResult = _a.sent();
                            if (!validationResult.valid) {
                                return [2 /*return*/, Marketing.ClientUtil.alert(validationResult.messages)];
                            }
                            Xrm.Page.ui.moveTo(Marketing.QuickCampaignTabNames.Summary);
                            return [4 /*yield*/, DialogManager.populateEndTabSummary()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); };
            this.isValid = function () { return __awaiter(_this, void 0, void 0, function () {
                var messages, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            messages = [];
                            _a = this.currentTabName;
                            switch (_a) {
                                case Marketing.QuickCampaignTabNames.Name: return [3 /*break*/, 1];
                                case Marketing.QuickCampaignTabNames.ActivityType: return [3 /*break*/, 2];
                                case Marketing.QuickCampaignTabNames.Appointment: return [3 /*break*/, 3];
                                case Marketing.QuickCampaignTabNames.Email: return [3 /*break*/, 3];
                                case Marketing.QuickCampaignTabNames.Fax: return [3 /*break*/, 3];
                                case Marketing.QuickCampaignTabNames.Letter: return [3 /*break*/, 3];
                                case Marketing.QuickCampaignTabNames.PhoneCall: return [3 /*break*/, 3];
                            }
                            return [3 /*break*/, 5];
                        case 1:
                            NameTab.validate(messages);
                            return [3 /*break*/, 5];
                        case 2:
                            ActivityTypeTab.validate(messages);
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, ActivityCreatorTab.validate(messages)];
                        case 4:
                            _b.sent();
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/, {
                                valid: messages.length === 0,
                                messages: messages.join("\n"),
                            }];
                    }
                });
            }); };
        }
        BulkOperationCreateWizard.prototype.open = function (entityIds, entityTypeCode, memberTypeCode, selectionMode, fetchXml, transactionCurrency) {
            return __awaiter(this, void 0, void 0, function () {
                var entityIdsString, options, parameters, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            Marketing.Guard.required(entityIds, "entityIds");
                            Marketing.Guard.required(entityTypeCode, "entityTypeCode");
                            Marketing.Guard.required(selectionMode, "selectionMode");
                            Marketing.Guard.required(transactionCurrency, "transactionCurrency");
                            entityIdsString = null;
                            switch (selectionMode) {
                                case Marketing.QuickCampaignSelectionMode.SelectedRecords:
                                case Marketing.QuickCampaignSelectionMode.CurrentPage:
                                    Marketing.Guard.notEmpty(entityIds, "entityIds");
                                    entityIdsString = Utils.convertEntityIdsListToString(entityIds);
                                    fetchXml = null;
                                    break;
                                case Marketing.QuickCampaignSelectionMode.AllPages:
                                    Marketing.Guard.required(fetchXml, "fetchXml");
                                    break;
                                default:
                                    throw new Error("Unknown selection mode was used.");
                            }
                            options = {
                                height: Marketing.DialogSizes.CreateQuickCampaignHeight,
                                width: Marketing.DialogSizes.CreateQuickCampaignWidth,
                                position: 1 /* center */,
                            };
                            parameters = (_a = {},
                                _a[Marketing.BulkOperationConstants.EntityIds] = entityIdsString,
                                _a[Marketing.BulkOperationConstants.EntityTypeCode] = entityTypeCode,
                                _a[Marketing.BulkOperationConstants.FetchXml] = fetchXml,
                                _a[Marketing.BulkOperationConstants.SelectedRecordsCount] = entityIds.length,
                                _a[Marketing.BulkOperationConstants.SelectionMode] = selectionMode,
                                _a[Marketing.NewActivityDialog.AssociatedListsMemberTypes] = Marketing.ClientUtil.getEntityName(entityTypeCode === Marketing.EntityTypeCodes.List ? memberTypeCode : entityTypeCode),
                                _a[Marketing.NewActivityDialog.TransactionCurrency] = transactionCurrency,
                                _a);
                            return [4 /*yield*/, Xrm.Navigation.openDialog(Marketing.DialogName.CreateQuickCampaign, options, parameters)];
                        case 1: return [2 /*return*/, _b.sent()];
                    }
                });
            });
        };
        BulkOperationCreateWizard.prototype.onCancelClicked = function () {
            Marketing.DialogUtil.closeDialog();
        };
        BulkOperationCreateWizard.prototype.onCreateClicked = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!this.clicked) return [3 /*break*/, 2];
                            // All calls that get scheduled while we wait for createQuickCampaign below will be ignored
                            // as clicked is set to true
                            this.clicked = true;
                            Xrm.Utility.showProgressIndicator(Marketing.StringProvider.getResourceString(Marketing.MessageKeys.MsgProcessingDialog));
                            return [4 /*yield*/, BulkOperationCreateWizard.createQuickCampaign()];
                        case 1:
                            if (_a.sent()) {
                                Xrm.Utility.closeProgressIndicator();
                                Marketing.DialogUtil.closeDialogAsOk();
                            }
                            else {
                                // Set clicked to false as the dialog will still be open and the create button should now be active
                                this.clicked = false;
                                Xrm.Utility.closeProgressIndicator();
                            }
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        BulkOperationCreateWizard.prototype.onActivityTypeChanged = function () {
            BulkOperationCreateWizard.setSendEmailVisibilityForOwnershipPropagationControl();
        };
        BulkOperationCreateWizard.prototype.moveTo = function (tabName) {
            Xrm.Page.ui.moveTo(tabName);
            this.currentTabName = tabName;
        };
        BulkOperationCreateWizard.setSendEmailVisibilityForOwnershipPropagationControl = function () {
            Field.isEmailActivityFormParameter = Field.activityTypeId === Marketing.EntityTypeCodes.Email ? 1 : 0;
        };
        BulkOperationCreateWizard.createQuickCampaign = function () {
            return __awaiter(this, void 0, void 0, function () {
                var startTime, fetchXml, ownerId, createMiniCampaignRequest, createMiniCampaignResponse, errorResponse_1, endTime, duration;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            startTime = performance.now();
                            fetchXml = Field.fetchXml;
                            ownerId = Ownership.getOwner();
                            createMiniCampaignRequest = new ODataContract.CreateMiniCampaignRequest({
                                activitiesOwnerOption: Ownership.getOwnershipOption(),
                                activityXml: Utils.getSelectedActivityXml(Field.activityType),
                                fetchXml: fetchXml ? Xrm.Encoding.xmlEncode(fetchXml) : "",
                                miniCampaignForTypeCode: Field.entityTypeCode,
                                miniCampaignName: Field.quickCampaignName,
                                miniCampaignType: Field.activityType.toString(),
                                ownerId: {
                                    guid: ownerId.id
                                },
                                ownerTypeCode: Marketing.ClientUtil.getEntityTypeCode(ownerId.entityType),
                                postWorkflowEvent: true,
                                queueId: {
                                    guid: Utils.getQueue().id
                                },
                                sendEmail: Field.sendEmail || false,
                                targetIds: Field.entitiesIds || "",
                                targetOption: Field.targetOption,
                                templateId: {
                                    guid: Field.selectedTemplateId || ClientUtility.Guid.Empty
                                },
                            });
                            createMiniCampaignResponse = null;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 8]);
                            return [4 /*yield*/, Xrm.WebApi.online.execute(createMiniCampaignRequest)];
                        case 2:
                            createMiniCampaignResponse = _a.sent();
                            return [3 /*break*/, 8];
                        case 3:
                            errorResponse_1 = _a.sent();
                            if (!(Field.sendEmail && errorResponse_1.message === BulkOperationCreateWizard.StringLengthTooLongStr)) return [3 /*break*/, 5];
                            return [4 /*yield*/, Marketing.ClientUtil.openAlertDialog({ text: Marketing.StringProvider.getResourceString(BulkOperationCreateWizard.StringLengthTooLongErrorMessage) })];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, ClientUtility.ActionFailedHandler.actionFailedCallback(errorResponse_1)];
                        case 6:
                            _a.sent();
                            _a.label = 7;
                        case 7: return [2 /*return*/, false];
                        case 8:
                            if (!!createMiniCampaignResponse.ok) return [3 /*break*/, 10];
                            return [4 /*yield*/, Marketing.ClientUtil.openAlertDialog({ text: BulkOperationCreateWizard.CreationWasUnsuccessful })];
                        case 9:
                            _a.sent();
                            return [2 /*return*/, false];
                        case 10:
                            endTime = performance.now();
                            duration = endTime - startTime;
                            Marketing.EMTelemetry.LogInfo(Marketing.TelemetryConstants.CampaignActivity, "BulkOperationCreateWizard", "createQuickCampaign", "Create Quick campaign", "Clicked", "", [
                                {
                                    name: "OwnerShipOption",
                                    value: createMiniCampaignRequest.ActivitiesOwnerOption
                                },
                                {
                                    name: "ActivityTypeName",
                                    value: Marketing.ClientUtil.getEntityName(Field.activityType)
                                },
                                {
                                    name: "OwnershipOption",
                                    value: createMiniCampaignRequest.ActivitiesOwnerOption
                                },
                                {
                                    name: "OwnerId",
                                    value: ownerId.id
                                },
                                {
                                    name: "QueueId",
                                    value: Utils.getQueue().id
                                },
                                {
                                    name: "SendEmail",
                                    value: createMiniCampaignRequest.sendEmail
                                },
                                {
                                    name: "TargetIds",
                                    value: createMiniCampaignRequest.TargetIds
                                },
                                {
                                    name: "TargetOption",
                                    value: createMiniCampaignRequest.TargetOption
                                },
                                {
                                    name: "Duration",
                                    value: duration
                                }
                            ], Marketing.LogType.CustomerIntelligence);
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        /**
        * This method load the activity type entities optionset to activity type control
        */
        BulkOperationCreateWizard.prototype.onLoadActivityType = function () {
            var _this = this;
            var fetchEntitiesUrl = Xrm.Utility.getGlobalContext().prependOrgName(Marketing.BulkOperationConstants.ActivityTypesUrl);
            var activityTypeContol = Xrm.Page.getControl(Marketing.BulkOperationConstants.ActivityTypeId);
            if (activityTypeContol) {
                this.sendRequest(fetchEntitiesUrl).then(function (data) {
                    var entities = data.value;
                    if (entities && entities.length > 0) {
                        activityTypeContol.clearOptions();
                    }
                    for (var index = 0; index < entities.length; index++) {
                        var currentEntity = entities[index];
                        if (_this.validateEntity(currentEntity)) {
                            activityTypeContol.addOption({
                                text: currentEntity.DisplayName.UserLocalizedLabel.Label,
                                value: currentEntity.ObjectTypeCode
                            });
                        }
                    }
                }, function (error) {
                    ClientUtility.ActionFailedHandler.actionFailedCallback(error);
                });
            }
        };
        /**
        * This method validates the entity that was being passed to it
        * @param entity The "Input Bag" containing the parameters and other control metadata.
        *.@returns the boolean value
        */
        BulkOperationCreateWizard.prototype.validateEntity = function (entity) {
            if (entity != null && entity.DisplayName != null && entity.DisplayName.LocalizedLabels != null && entity.DisplayName.LocalizedLabels.length > 0) {
                return true;
            }
            else {
                return false;
            }
        };
        /**
        * This method is used to send request with the specified url
        * @param url The url paramemer.
        */
        BulkOperationCreateWizard.prototype.sendRequest = function (url) {
            return window.parent.$.ajax({
                url: encodeURI(url),
                type: 'GET',
                async: true,
                contentType: "application/json",
                dataType: "json",
            });
        };
        return BulkOperationCreateWizard;
    }());
    BulkOperationCreateWizard.CreationWasUnsuccessful = "MA.QuickCampaign.CreationWasUnsuccessful";
    BulkOperationCreateWizard.NameTemplateResource = "MA.QuickCampaign.Name";
    BulkOperationCreateWizard.ActivityTemplateResource = "MA.QuickCampaign.Activity";
    BulkOperationCreateWizard.SelectedRecordsScopeTemplateResource = "MA.QuickCampaign.Scope.SelectedRecords";
    BulkOperationCreateWizard.CurrentPageScopeTemplateResource = "MA.QuickCampaign.Scope.CurrentPage";
    BulkOperationCreateWizard.AllPagesScopeTemplateResource = "MA.QuickCampaign.Scope.AllPages";
    BulkOperationCreateWizard.OwnerTemplateResource = "MA.QuickCampaign.Owner";
    BulkOperationCreateWizard.RecordOwnershipOptionResource = "MA.OwnershipOption.Record";
    BulkOperationCreateWizard.MeOwnershipOptionResource = "MA.OwnershipOption.Me";
    BulkOperationCreateWizard.FillRequiredFields = "MA.QuickCampaign.FillRequiredFields";
    BulkOperationCreateWizard.QuickCampaignNameRequired = "MA.QuickCampaign.QuickCampaignNameRequired";
    BulkOperationCreateWizard.ActivityTypeRequired = "MA.QuickCampaign.ActivityTypeRequired";
    BulkOperationCreateWizard.StringLengthTooLongStr = "A validation error occurred.  The length of the 'parameters' attribute of the 'bulkoperation' entity exceeded the maximum allowed length of '100000'.";
    BulkOperationCreateWizard.StringLengthTooLongErrorMessage = "MA.BulkOperation.ContentTooLarge";
    Marketing.BulkOperationCreateWizard = BulkOperationCreateWizard;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Marketing;
(function (Marketing) {
    var SelectedMembersSubgridNames = (function () {
        function SelectedMembersSubgridNames() {
        }
        return SelectedMembersSubgridNames;
    }());
    SelectedMembersSubgridNames.SelectedAccounts = "selected_accounts";
    SelectedMembersSubgridNames.SelectedContacts = "selected_contacts";
    SelectedMembersSubgridNames.SelectedLeads = "selected_leads";
    SelectedMembersSubgridNames.ExcludedAccounts = "excluded_accounts";
    SelectedMembersSubgridNames.ExcludedContacts = "excluded_contacts";
    SelectedMembersSubgridNames.ExcludedLeads = "excluded_leads";
    Marketing.SelectedMembersSubgridNames = SelectedMembersSubgridNames;
})(Marketing || (Marketing = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var ODataContract;
(function (ODataContract) {
    var CreateMiniCampaignRequest = (function () {
        function CreateMiniCampaignRequest(parameters) {
            this.ActivitiesOwnerOption = parameters.activitiesOwnerOption;
            this.ActivityXml = parameters.activityXml;
            this.FetchXml = parameters.fetchXml;
            this.MiniCampaignForTypeCode = parameters.miniCampaignForTypeCode;
            this.MiniCampaignName = parameters.miniCampaignName;
            this.MiniCampaignType = parameters.miniCampaignType;
            this.OwnerId = parameters.ownerId;
            this.OwnerTypeCode = parameters.ownerTypeCode;
            this.PostWorkflowEvent = parameters.postWorkflowEvent;
            this.QueueId = parameters.queueId;
            this.TargetIds = parameters.targetIds;
            this.TargetOption = parameters.targetOption;
            this.TemplateId = parameters.templateId;
            this.sendEmail = parameters.sendEmail;
        }
        CreateMiniCampaignRequest.prototype.getMetadata = function () {
            var metadata = {
                parameterTypes: {
                    MiniCampaignForTypeCode: {
                        typeName: Marketing.EntityFullTypeNames.Int32,
                        structuralProperty: 1 /* PrimitiveType */,
                    },
                    TemplateId: {
                        typeName: Marketing.EntityFullTypeNames.Guid,
                        structuralProperty: 1 /* PrimitiveType */,
                    },
                    TargetOption: {
                        typeName: Marketing.EntityFullTypeNames.Int32,
                        structuralProperty: 1 /* PrimitiveType */,
                    },
                    TargetIds: {
                        typeName: Marketing.EntityFullTypeNames.String,
                        structuralProperty: 1 /* PrimitiveType */,
                    },
                    FetchXml: {
                        typeName: Marketing.EntityFullTypeNames.String,
                        structuralProperty: 1 /* PrimitiveType */,
                    },
                    MiniCampaignType: {
                        typeName: Marketing.EntityFullTypeNames.String,
                        structuralProperty: 1 /* PrimitiveType */,
                    },
                    ActivitiesOwnerOption: {
                        typeName: Marketing.EntityFullTypeNames.Int32,
                        structuralProperty: 1 /* PrimitiveType */,
                    },
                    ActivityXml: {
                        typeName: Marketing.EntityFullTypeNames.String,
                        structuralProperty: 1 /* PrimitiveType */,
                    },
                    MiniCampaignName: {
                        typeName: Marketing.EntityFullTypeNames.String,
                        structuralProperty: 1 /* PrimitiveType */,
                    },
                    PostWorkflowEvent: {
                        typeName: Marketing.EntityFullTypeNames.Boolean,
                        structuralProperty: 1 /* PrimitiveType */,
                    },
                    OwnerId: {
                        typeName: Marketing.EntityFullTypeNames.Guid,
                        structuralProperty: 1 /* PrimitiveType */,
                    },
                    OwnerTypeCode: {
                        typeName: Marketing.EntityFullTypeNames.Int32,
                        structuralProperty: 1 /* PrimitiveType */,
                    },
                    sendEmail: {
                        typeName: Marketing.EntityFullTypeNames.Boolean,
                        structuralProperty: 1 /* PrimitiveType */,
                    },
                    QueueId: {
                        typeName: Marketing.EntityFullTypeNames.Guid,
                        structuralProperty: 1 /* PrimitiveType */,
                    },
                },
                operationName: "CreateMiniCampaign",
                operationType: 0 /* Action */,
            };
            return metadata;
        };
        return CreateMiniCampaignRequest;
    }());
    ODataContract.CreateMiniCampaignRequest = CreateMiniCampaignRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../ActivityCreation/Marketing_ActivityCreation.d.ts" />
/// <reference path="../ClientCommon/Marketing_ClientCommon.d.ts" />
/// <reference path="BulkOperationConstants.ts" />
/// <reference path="BulkOperationLibrary.ts" />
/// <reference path="Wizard/Field.ts" />
/// <reference path="Wizard/Ownership.ts" />
/// <reference path="Wizard/Utils.ts" />
/// <reference path="Wizard/DialogManager.ts" />
/// <reference path="Wizard/NameTab.ts" />
/// <reference path="Wizard/ActivityTypeTab.ts" />
/// <reference path="Wizard/ActivityCreatorTab.ts" />
/// <reference path="BulkOperationCreateWizard.ts" />
/// <reference path="Constants/SelectedMembersSubgridNames.ts" />
/// <reference path="Contracts/CreateMiniCampaignRequest.ts" />
var Marketing;
(function (Marketing) {
    var BulkOperation = (function () {
        function BulkOperation() {
        }
        return BulkOperation;
    }());
    BulkOperation.Instance = new Marketing.BulkOperationLibrary();
    BulkOperation.CreateWizard = new Marketing.BulkOperationCreateWizard();
    Marketing.BulkOperation = BulkOperation;
})(Marketing || (Marketing = {}));
