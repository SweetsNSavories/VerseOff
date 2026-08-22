var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable @typescript-eslint/no-namespace */
var LinkedInExtensions;
(function (LinkedInExtensions) {
    var HierarchyViewer;
    (function (HierarchyViewer) {
        HierarchyViewer.isHierarchyViewerEnabled = function () { return true; };
        HierarchyViewer.isHierarchyViewerV2Enabled = function () { return true; };
        HierarchyViewer.hierarchyViewerReportSuccess = function (componentName, props) {
            if (localStorage.getItem('HierarchyViewerConsoleLogging') === 'true') {
                console.log(componentName, props);
            }
            Xrm.Reporting.reportSuccess(componentName, Object.entries(props || {}).map(function (_a) {
                var name = _a[0], value = _a[1];
                return ({ name: name, value: value });
            }));
        };
        HierarchyViewer.hierarchyViewerReportFailure = function (componentName, error, props) {
            if (localStorage.getItem('HierarchyViewerConsoleLogging') === 'true') {
                console.error(componentName, error, props);
            }
            Xrm.Reporting.reportFailure(componentName, error, 
            /*suggestedMitigation*/ null, Object.entries(props || {}).map(function (_a) {
                var name = _a[0], value = _a[1];
                return ({ name: name, value: value });
            }));
        };
        var hierarchyRecordsCacheKey = 'HierarchyViewer.Common.hierarchyRecordsCache';
        var hierarchyRecordsCacheExpiry = 1000 * 60 * 5;
        var hierarchyRecordsCache = {
            configs: [],
            lastUpdated: 0,
            expiry: 0
        };
        function getHierarchyRecords() {
            return __awaiter(this, void 0, void 0, function () {
                var start, cacheString, parsed, result, configs, _i, _a, record, id, msdyn_configuration, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            start = Date.now();
                            try {
                                cacheString = localStorage.getItem(hierarchyRecordsCacheKey);
                                if (cacheString) {
                                    parsed = JSON.parse(cacheString);
                                    if (typeof parsed.expiry == 'number' &&
                                        typeof parsed.lastUpdated == 'number' &&
                                        parsed.lastUpdated > hierarchyRecordsCache.lastUpdated &&
                                        Array.isArray(parsed.configs)) {
                                        hierarchyRecordsCache = parsed;
                                    }
                                }
                            }
                            catch (_c) {
                                // Ignore
                            }
                            if (!(hierarchyRecordsCache.expiry <= start)) return [3 /*break*/, 4];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Xrm.WebApi.retrieveMultipleRecords('msdyn_hierarchyconfiguration', '?$select=msdyn_hierarchyconfigurationid,msdyn_configuration&$filter=statuscode eq 2')];
                        case 2:
                            result = _b.sent();
                            HierarchyViewer.hierarchyViewerReportSuccess('HierarchyViewer.RibbonRules.getHierarchyRecords', {
                                message: 'Successfully queried active hierarchy config records',
                                count: result.entities.length,
                                ids: result.entities.map(function (_) { return _.msdyn_hierarchyconfigurationid; }).toString(),
                                duration: Date.now() - start
                            });
                            configs = [];
                            for (_i = 0, _a = result.entities; _i < _a.length; _i++) {
                                record = _a[_i];
                                id = record.msdyn_hierarchyconfigurationid, msdyn_configuration = record.msdyn_configuration;
                                if (msdyn_configuration) {
                                    try {
                                        configs.push({
                                            id: id,
                                            config: JSON.parse(msdyn_configuration)
                                        });
                                    }
                                    catch (error) {
                                        HierarchyViewer.hierarchyViewerReportFailure('HierarchyViewer.RibbonRules.getHierarchyRecords.parseRecord', error, { id: id });
                                    }
                                }
                            }
                            hierarchyRecordsCache = {
                                configs: configs,
                                lastUpdated: start,
                                expiry: start + hierarchyRecordsCacheExpiry
                            };
                            try {
                                localStorage.setItem(hierarchyRecordsCacheKey, JSON.stringify(hierarchyRecordsCache));
                            }
                            catch (_d) {
                                // Ignore
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _b.sent();
                            HierarchyViewer.hierarchyViewerReportFailure('HierarchyViewer.RibbonRules.getHierarchyRecords', error_1, {
                                duration: Date.now() - start
                            });
                            throw error_1;
                        case 4:
                            HierarchyViewer.hierarchyViewerReportSuccess('HierarchyViewer.RibbonRules.getHierarchyRecords', {
                                message: 'Returning list of active hierarchy config records',
                                count: hierarchyRecordsCache.configs.length,
                                ids: hierarchyRecordsCache.configs.map(function (_) { return _.id; }).toString(),
                                duration: Date.now() - start,
                                cacheLastUpdated: hierarchyRecordsCache.lastUpdated,
                                cacheExpiry: hierarchyRecordsCache.expiry
                            });
                            return [2 /*return*/, hierarchyRecordsCache.configs];
                    }
                });
            });
        }
        HierarchyViewer.getHierarchyRecords = getHierarchyRecords;
        function resetHierarchyRecordsCache() {
            hierarchyRecordsCache = {
                configs: [],
                lastUpdated: Date.now(),
                expiry: 0
            };
            try {
                localStorage.setItem(hierarchyRecordsCacheKey, JSON.stringify(hierarchyRecordsCache));
            }
            catch (_a) {
                // Ignore
            }
        }
        HierarchyViewer.resetHierarchyRecordsCache = resetHierarchyRecordsCache;
    })(HierarchyViewer = LinkedInExtensions.HierarchyViewer || (LinkedInExtensions.HierarchyViewer = {}));
})(LinkedInExtensions || (LinkedInExtensions = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable @typescript-eslint/no-namespace */
/// <reference path="HierarchyViewer.Common.ts" />
var LinkedInExtensions;
(function (LinkedInExtensions) {
    var HierarchyViewer;
    (function (HierarchyViewer) {
        var FormHandlers;
        (function (FormHandlers) {
            var hierarchyNameMissing = 'HierarchyConfiguration_HierarchyNameMissing';
            var hierarchyNameMaxLength = 200;
            var hierarchyNameTooLong = 'HierarchyConfiguration_HierarchyNameTooLong';
            var hierarchyConfigurationMissing = 'HierarchyConfiguration_HierarchyConfigurationMissing';
            var ValidationErrorKeys = {
                MissingEntity: 'HierarchyConfiguration_ValidationErrorMissingEntity',
                MissingForm: 'HierarchyConfiguration_ValidationErrorMissingForm',
                MissingSidePaneForm: 'HierarchyConfiguration_ValidationErrorMissingSidePaneForm',
                MissingRelationship: 'HierarchyConfiguration_ValidationErrorMissingRelationship',
                MissingRelationshipOneTableInConfiguration: 'HierarchyConfiguration_ValidationErrorMissingRelationshipOneTableInConfiguration',
                MissingRelationshipAttribute: 'HierarchyConfiguration_ValidationErrorMissingRelationshipAttribute',
                InvalidStructure: 'HierarchyConfiguration_ValidationErrorInvalidStructure'
            };
            var isAutoSave = function (eventArgs) {
                var _a;
                var saveMode = eventArgs.getSaveMode();
                // Check if this is an Autosave, or is a SaveAndClose due to navigating away from the form without saving.
                return (saveMode === 70 /* SaveMode.AutoSave */ ||
                    (saveMode === 2 /* SaveMode.SaveAndClose */ &&
                        // As an exception, detect if the user is clicking "Save and Continue" button in the unsaved changes dialog.
                        !((_a = parent === null || parent === void 0 ? void 0 : parent.document) === null || _a === void 0 ? void 0 : _a.querySelector('[id*="modalDialogContentContainer"]'))));
            };
            FormHandlers.onSaveHierarchyRecord = function (eventContext) {
                var _a, _b, _c;
                var eventArgs = eventContext.getEventArgs();
                var formContext = eventContext.getFormContext();
                var name = (_a = formContext.getAttribute('msdyn_name')) === null || _a === void 0 ? void 0 : _a.getValue();
                var hierarchyConfig = (_b = formContext.getAttribute('msdyn_configuration')) === null || _b === void 0 ? void 0 : _b.getValue();
                var hierarchyId = formContext.data.entity.getId();
                var statusCode = (_c = formContext.getAttribute('statuscode')) === null || _c === void 0 ? void 0 : _c.getValue();
                if (statusCode === 2 /* HierarchyStatusCode.Published */ && isAutoSave(eventArgs)) {
                    // Disable auto-save and save on navigation for published hierarchy configs.
                    eventArgs.preventDefault();
                    return;
                }
                // 1. Name is missing
                if (!name) {
                    eventArgs.preventDefault();
                    showError(hierarchyNameMissing);
                    return;
                }
                // 2. Name too long
                if (name.length > hierarchyNameMaxLength) {
                    eventArgs.preventDefault();
                    showError(hierarchyNameTooLong);
                    return;
                }
                // Clear name-related errors
                clearErrors([hierarchyNameMissing, hierarchyNameTooLong]);
                // 3. Hierarchy config is missing
                if (!hierarchyConfig) {
                    eventArgs.preventDefault();
                    showError(hierarchyConfigurationMissing);
                    return;
                }
                // Clear config-related error
                clearErrors([hierarchyConfigurationMissing]);
                // 4. Run detailed validation
                var _d = validateHierarchyConfig(hierarchyConfig), validationResult = _d.validationResult, parsedConfig = _d.parsedConfig;
                if (validationResult) {
                    clearErrors(Object.values(ValidationErrorKeys));
                    eventArgs.preventDefault();
                    showError(validationResult);
                    return;
                }
                // Clear validation error and report success
                clearErrors(Object.values(ValidationErrorKeys));
                var _e = getHierarchySummary(parsedConfig), nodesCount = _e.nodesCount, relationshipTypes = _e.relationshipTypes;
                HierarchyViewer.hierarchyViewerReportSuccess('msdyn_Mscrm.Form.msdyn_HierarchyViewer.Save', {
                    scenario: 'onSaveHierarchyRecord',
                    hierarchyId: hierarchyId,
                    entityType: parsedConfig === null || parsedConfig === void 0 ? void 0 : parsedConfig.entityType,
                    nodesCount: nodesCount,
                    relationshipTypes: JSON.stringify(relationshipTypes)
                });
                // Reset the hierarchy records cache.
                HierarchyViewer.resetHierarchyRecordsCache();
                // Helper methods
                function showError(id) {
                    formContext.ui.setFormNotification(LinkedInExtensions.ResourceStringProvider.getResourceString(id), 'ERROR', id);
                    HierarchyViewer.hierarchyViewerReportFailure('msdyn_Mscrm.Form.msdyn_HierarchyViewer.Save', id, {
                        scenario: 'onSaveHierarchyRecord',
                        hierarchyName: name
                    });
                }
                function clearErrors(ids) {
                    ids.forEach(function (id) { return formContext.ui.clearFormNotification(id); });
                }
            };
            var validateHierarchyConfig = function (recordConfig) {
                try {
                    var config = JSON.parse(recordConfig);
                    var validationError = validateRootConfig(config);
                    if (validationError) {
                        throw new Error(validationError);
                    }
                    return { validationResult: null, parsedConfig: config };
                }
                catch (e) {
                    return { validationResult: e.message, parsedConfig: null };
                }
            };
            var validateRootConfig = function (config) {
                return validateBaseCardConfig(config, true) || validateBranchList(config.branches);
            };
            var validateBranchList = function (branches) {
                if (!branches) {
                    return ValidationErrorKeys.InvalidStructure;
                }
                for (var _i = 0, branches_1 = branches; _i < branches_1.length; _i++) {
                    var branch = branches_1[_i];
                    var result = validateBranchConfig(branch) || validateBranchList(branch.branches);
                    if (result) {
                        return result;
                    }
                }
                return null;
            };
            var validateBranchConfig = function (config) {
                return validateBaseCardConfig(config) || validateRelationship(config.relationship);
            };
            var validateBaseCardConfig = function (config, isRootConfig) {
                if (!(config === null || config === void 0 ? void 0 : config.entityType)) {
                    return ValidationErrorKeys.MissingEntity;
                }
                else if (!config.cardFormId) {
                    return ValidationErrorKeys.MissingForm;
                }
                else if (!config.sidePaneFormId) {
                    return ValidationErrorKeys.MissingSidePaneForm;
                }
                else if (!config.branches) {
                    return ValidationErrorKeys.InvalidStructure;
                }
                else if (config.selfReferentialRelationship) {
                    if (config.selfReferentialRelationship.type !== '1-to-n') {
                        return ValidationErrorKeys.MissingRelationship;
                    }
                    if (!config.selfReferentialRelationship.referencingAttribute) {
                        return ValidationErrorKeys.MissingRelationshipAttribute;
                    }
                }
                else if (isRootConfig && !config.selfReferentialRelationship && !config.branches.length) {
                    return ValidationErrorKeys.MissingRelationshipOneTableInConfiguration;
                }
                return null;
            };
            var validateRelationship = function (relationship) {
                switch (relationship === null || relationship === void 0 ? void 0 : relationship.type) {
                    case '1-to-n':
                    case 'n-to-1':
                        if (!relationship.referencingAttribute) {
                            return ValidationErrorKeys.MissingRelationshipAttribute;
                        }
                        break;
                    case 'n-to-n':
                    case 'dataverseConnection':
                    case 'customConnection':
                        if (!relationship.intersectEntityName ||
                            !relationship.parentEntityIntersectAttribute ||
                            !relationship.thisEntityIntersectAttribute) {
                            return ValidationErrorKeys.MissingRelationship;
                        }
                        break;
                    default:
                        return ValidationErrorKeys.MissingRelationship;
                }
                return null;
            };
            var getHierarchySummary = function (rootConfig) {
                var _a, _b;
                var count = 1; // count root node
                var types = {};
                if (rootConfig.selfReferentialRelationship) {
                    types['selfReferentialRelationship'] = 1;
                }
                var stack = __spreadArray([], rootConfig.branches, true);
                while (stack.length > 0) {
                    var node = stack.pop();
                    if (!node)
                        continue;
                    count++;
                    var relType = (_a = node.relationship) === null || _a === void 0 ? void 0 : _a.type;
                    if (relType) {
                        types[relType] = (types[relType] || 0) + 1;
                    }
                    if (node.selfReferentialRelationship) {
                        types['selfReferentialRelationship'] = (types['selfReferentialRelationship'] || 0) + 1;
                    }
                    // push child branches
                    if ((_b = node.branches) === null || _b === void 0 ? void 0 : _b.length) {
                        stack.push.apply(stack, node.branches);
                    }
                }
                return { nodesCount: count, relationshipTypes: types };
            };
        })(FormHandlers = HierarchyViewer.FormHandlers || (HierarchyViewer.FormHandlers = {}));
    })(HierarchyViewer = LinkedInExtensions.HierarchyViewer || (LinkedInExtensions.HierarchyViewer = {}));
})(LinkedInExtensions || (LinkedInExtensions = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable @typescript-eslint/no-namespace */
/// <reference path="HierarchyViewer.Common.ts" />
var LinkedInExtensions;
(function (LinkedInExtensions) {
    var HierarchyViewer;
    (function (HierarchyViewer) {
        var RibbonActions;
        (function (RibbonActions) {
            var _this = this;
            RibbonActions.formPreviewHierarchyConfiguration = function (_primaryControl, hierarchyId) {
                HierarchyViewer.hierarchyViewerReportSuccess('HierarchyViewer.RibbonActions.formPreviewHierarchyConfiguration', {
                    hierarchyId: hierarchyId
                });
                return navigateToHierarchyViewer({
                    hierarchyId: hierarchyId,
                    isPreview: true
                });
            };
            RibbonActions.formShowHierarchyViewer = function (_primaryControl, entityType, id) {
                HierarchyViewer.hierarchyViewerReportSuccess('HierarchyViewer.RibbonActions.formShowHierarchyViewer', {
                    entityType: entityType,
                    id: id
                });
                return navigateToHierarchyViewer({
                    highlightedRecord: { entityType: entityType, id: id }
                });
            };
            RibbonActions.gridShowHierarchyViewer = function (_selectedControl, entityType, id) {
                HierarchyViewer.hierarchyViewerReportSuccess('HierarchyViewer.RibbonActions.gridShowHierarchyViewer', {
                    entityType: entityType,
                    id: id
                });
                return navigateToHierarchyViewer({
                    highlightedRecord: { entityType: entityType, id: id }
                });
            };
            var navigateToHierarchyViewer = function (data) {
                var HierarchyViewerControlName = 'MscrmControls.HierarchyViewer.HierarchyViewer';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return Xrm.Navigation.navigateTo({
                    pageType: 'control',
                    controlName: HierarchyViewerControlName,
                    data: data
                });
            };
            RibbonActions.formPublishHierarchyConfiguration = function (primaryControl, entityId) {
                return formUpdateHierarchyConfigurationState('LinkedInExtensions.HierarchyViewer.RibbonActions.formPublishHierarchyConfiguration', primaryControl, entityId, 0 /* HierarchyStateCode.Active */, 2 /* HierarchyStatusCode.Published */, LinkedInExtensions.ResourceStringProvider.getResourceString('HierarchyConfiguration_PublishHierarchyTitle'), LinkedInExtensions.ResourceStringProvider.getResourceString('HierarchyConfiguration_PublishHierarchyText'), LinkedInExtensions.ResourceStringProvider.getResourceString('HierarchyConfiguration_PublishHierarchyProgress'));
            };
            RibbonActions.formUnpublishHierarchyConfiguration = function (primaryControl, entityId) {
                return formUpdateHierarchyConfigurationState('LinkedInExtensions.HierarchyViewer.RibbonActions.formUnpublishHierarchyConfiguration', primaryControl, entityId, 0 /* HierarchyStateCode.Active */, 1 /* HierarchyStatusCode.Draft */, LinkedInExtensions.ResourceStringProvider.getResourceString('HierarchyConfiguration_UnpublishHierarchyTitle'), LinkedInExtensions.ResourceStringProvider.getResourceString('HierarchyConfiguration_UnpublishHierarchyText'), LinkedInExtensions.ResourceStringProvider.getResourceString('HierarchyConfiguration_UnpublishHierarchyProgress'));
            };
            RibbonActions.gridPublishHierarchyConfigurations = function (selectedControl, selectedItemIds) {
                return gridUpdateHierarchyConfigurationStates('LinkedInExtensions.HierarchyViewer.RibbonActions.gridPublishHierarchyConfigurations', selectedControl, selectedItemIds, 0 /* HierarchyStateCode.Active */, 2 /* HierarchyStatusCode.Published */, LinkedInExtensions.ResourceStringProvider.getResourceString('HierarchyConfiguration_PublishHierarchiesTitle'), LinkedInExtensions.ResourceStringProvider.getResourceString('HierarchyConfiguration_PublishHierarchiesText'), LinkedInExtensions.ResourceStringProvider.getResourceString('HierarchyConfiguration_PublishHierarchiesProgress'));
            };
            RibbonActions.gridUnpublishHierarchyConfigurations = function (selectedControl, selectedItemIds) {
                return gridUpdateHierarchyConfigurationStates('LinkedInExtensions.HierarchyViewer.RibbonActions.gridUnpublishHierarchyConfigurations', selectedControl, selectedItemIds, 0 /* HierarchyStateCode.Active */, 1 /* HierarchyStatusCode.Draft */, LinkedInExtensions.ResourceStringProvider.getResourceString('HierarchyConfiguration_UnpublishHierarchiesTitle'), LinkedInExtensions.ResourceStringProvider.getResourceString('HierarchyConfiguration_UnpublishHierarchiesText'), LinkedInExtensions.ResourceStringProvider.getResourceString('HierarchyConfiguration_UnpublishHierarchiesProgress'));
            };
            var formUpdateHierarchyConfigurationState = function (componentName, primaryControl, entityId, statecode, statuscode, confirmationTitle, confirmationText, progressMessage) { return __awaiter(_this, void 0, void 0, function () {
                var formContext, result, start, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            formContext = primaryControl;
                            HierarchyViewer.hierarchyViewerReportSuccess(componentName, {
                                step: 'confirm',
                                message: 'opening confirmation dialog for formUpdateHierarchyConfigurationState',
                                entityId: entityId,
                                statecode: statecode,
                                statuscode: statuscode
                            });
                            return [4 /*yield*/, Xrm.Navigation.openConfirmDialog({
                                    title: confirmationTitle,
                                    text: confirmationText
                                }, { height: 200, width: 450 })];
                        case 1:
                            result = _a.sent();
                            if (!result.confirmed) {
                                HierarchyViewer.hierarchyViewerReportSuccess(componentName, {
                                    step: 'cancel',
                                    message: 'user cancelled status update',
                                    entityId: entityId,
                                    statecode: statecode,
                                    statuscode: statuscode
                                });
                                return [2 /*return*/];
                            }
                            HierarchyViewer.hierarchyViewerReportSuccess(componentName, {
                                step: 'confirmed',
                                message: 'user confirmed status update',
                                entityId: entityId,
                                statecode: statecode,
                                statuscode: statuscode
                            });
                            start = Date.now();
                            return [4 /*yield*/, formContext.data.save()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 6, 7, 8]);
                            Xrm.Utility.showProgressIndicator(progressMessage);
                            return [4 /*yield*/, Xrm.WebApi.updateRecord('msdyn_hierarchyconfiguration', entityId, {
                                    statecode: statecode,
                                    statuscode: statuscode
                                })];
                        case 4:
                            _a.sent();
                            // Reset the hierarchy records cache.
                            HierarchyViewer.resetHierarchyRecordsCache();
                            return [4 /*yield*/, formContext.data.refresh(true)];
                        case 5:
                            _a.sent();
                            HierarchyViewer.hierarchyViewerReportSuccess(componentName, {
                                step: 'done',
                                message: 'done updating HierarchyViewer state',
                                entityId: entityId,
                                statecode: statecode,
                                statuscode: statuscode,
                                duration: Date.now() - start
                            });
                            return [3 /*break*/, 8];
                        case 6:
                            error_2 = _a.sent();
                            HierarchyViewer.hierarchyViewerReportFailure(componentName, error_2, {
                                entityId: entityId,
                                statecode: statecode,
                                statuscode: statuscode,
                                duration: Date.now() - start
                            });
                            // Reset the hierarchy records cache.
                            HierarchyViewer.resetHierarchyRecordsCache();
                            return [3 /*break*/, 8];
                        case 7:
                            Xrm.Utility.closeProgressIndicator();
                            return [7 /*endfinally*/];
                        case 8: return [2 /*return*/];
                    }
                });
            }); };
            var gridUpdateHierarchyConfigurationStates = function (componentName, selectedControl, selectedItemIds, statecode, statuscode, confirmationTitle, confirmationText, progressMessage) { return __awaiter(_this, void 0, void 0, function () {
                var result, start, _i, selectedItemIds_1, entityId, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            HierarchyViewer.hierarchyViewerReportSuccess(componentName, {
                                step: 'confirm',
                                message: 'opening confirmation dialog for gridUpdateHierarchyConfigurationStates',
                                count: selectedItemIds.length,
                                selectedItemIds: JSON.stringify(selectedItemIds),
                                statecode: statecode,
                                statuscode: statuscode
                            });
                            return [4 /*yield*/, Xrm.Navigation.openConfirmDialog({
                                    title: confirmationTitle,
                                    text: confirmationText
                                }, { height: 200, width: 450 })];
                        case 1:
                            result = _a.sent();
                            if (!result.confirmed) {
                                HierarchyViewer.hierarchyViewerReportSuccess(componentName, {
                                    step: 'cancel',
                                    message: 'user cancelled status update',
                                    count: selectedItemIds.length,
                                    selectedItemIds: JSON.stringify(selectedItemIds),
                                    statecode: statecode,
                                    statuscode: statuscode
                                });
                                return [2 /*return*/];
                            }
                            HierarchyViewer.hierarchyViewerReportSuccess(componentName, {
                                step: 'confirmed',
                                message: 'user confirmed status update',
                                count: selectedItemIds.length,
                                selectedItemIds: JSON.stringify(selectedItemIds),
                                statecode: statecode,
                                statuscode: statuscode
                            });
                            start = Date.now();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 7, 8, 9]);
                            Xrm.Utility.showProgressIndicator(progressMessage);
                            _i = 0, selectedItemIds_1 = selectedItemIds;
                            _a.label = 3;
                        case 3:
                            if (!(_i < selectedItemIds_1.length)) return [3 /*break*/, 6];
                            entityId = selectedItemIds_1[_i];
                            return [4 /*yield*/, Xrm.WebApi.updateRecord('msdyn_hierarchyconfiguration', entityId, {
                                    statecode: statecode,
                                    statuscode: statuscode
                                })];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 3];
                        case 6:
                            // Reset the hierarchy records cache.
                            HierarchyViewer.resetHierarchyRecordsCache();
                            selectedControl.refresh();
                            HierarchyViewer.hierarchyViewerReportSuccess(componentName, {
                                step: 'done',
                                message: 'done updating HierarchyViewer states',
                                count: selectedItemIds.length,
                                selectedItemIds: JSON.stringify(selectedItemIds),
                                statecode: statecode,
                                statuscode: statuscode,
                                duration: Date.now() - start
                            });
                            return [3 /*break*/, 9];
                        case 7:
                            error_3 = _a.sent();
                            HierarchyViewer.hierarchyViewerReportFailure(componentName, error_3, {
                                count: selectedItemIds.length,
                                selectedItemIds: JSON.stringify(selectedItemIds),
                                statecode: statecode,
                                statuscode: statuscode,
                                duration: Date.now() - start
                            });
                            // Reset the hierarchy records cache.
                            HierarchyViewer.resetHierarchyRecordsCache();
                            return [3 /*break*/, 9];
                        case 8:
                            Xrm.Utility.closeProgressIndicator();
                            return [7 /*endfinally*/];
                        case 9: return [2 /*return*/];
                    }
                });
            }); };
        })(RibbonActions = HierarchyViewer.RibbonActions || (HierarchyViewer.RibbonActions = {}));
    })(HierarchyViewer = LinkedInExtensions.HierarchyViewer || (LinkedInExtensions.HierarchyViewer = {}));
})(LinkedInExtensions || (LinkedInExtensions = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable @typescript-eslint/no-namespace */
/// <reference path="HierarchyViewer.Common.ts" />
var LinkedInExtensions;
(function (LinkedInExtensions) {
    var HierarchyViewer;
    (function (HierarchyViewer) {
        var RibbonRules;
        (function (RibbonRules) {
            var _this = this;
            RibbonRules.formStateCodeIs = function (primaryControl, expectedStateCode) {
                var _a, _b;
                var formContext = primaryControl;
                var stateCode = (_a = formContext.getAttribute('statecode')) === null || _a === void 0 ? void 0 : _a.getValue();
                var statusCode = (_b = formContext.getAttribute('statuscode')) === null || _b === void 0 ? void 0 : _b.getValue();
                var result = stateCode === expectedStateCode;
                HierarchyViewer.hierarchyViewerReportSuccess('HierarchyViewer.RibbonRules.formStateCodeIs', {
                    stateCode: stateCode,
                    statusCode: statusCode,
                    expectedStateCode: expectedStateCode,
                    result: result
                });
                return result;
            };
            RibbonRules.formStatusCodeIs = function (primaryControl, expectedStatusCode) {
                var _a, _b;
                var formContext = primaryControl;
                var stateCode = (_a = formContext.getAttribute('statecode')) === null || _a === void 0 ? void 0 : _a.getValue();
                var statusCode = (_b = formContext.getAttribute('statuscode')) === null || _b === void 0 ? void 0 : _b.getValue();
                var result = statusCode === expectedStatusCode;
                HierarchyViewer.hierarchyViewerReportSuccess('HierarchyViewer.RibbonRules.formStatusCodeIs', {
                    stateCode: stateCode,
                    statusCode: statusCode,
                    expectedStatusCode: expectedStatusCode,
                    result: result
                });
                return result;
            };
            RibbonRules.formShowHierarchyViewerButton = function (_primaryControl, primaryEntityTypeName, firstPrimaryEntityItemId) {
                return showHierarchyViewerButton('HierarchyViewer.RibbonRules.formShowHierarchyViewerButton', primaryEntityTypeName, firstPrimaryEntityItemId);
            };
            RibbonRules.gridShowHierarchyViewerButton = function (_selectedControl, selectedEntityTypeName, selectedControlSelectedItemId) {
                return showHierarchyViewerButton('HierarchyViewer.RibbonRules.gridShowHierarchyViewerButton', selectedEntityTypeName, selectedControlSelectedItemId);
            };
            var showHierarchyViewerButton = function (componentName, entityType, recordId) { return __awaiter(_this, void 0, void 0, function () {
                var start, hierarchyRecords, _i, hierarchyRecords_1, _a, config, id, branchIdx, error_4;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            start = Date.now();
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, HierarchyViewer.getHierarchyRecords()];
                        case 2:
                            hierarchyRecords = _b.sent();
                            for (_i = 0, hierarchyRecords_1 = hierarchyRecords; _i < hierarchyRecords_1.length; _i++) {
                                _a = hierarchyRecords_1[_i], config = _a.config, id = _a.id;
                                if (!config) {
                                    continue;
                                }
                                if (entityType === config.entityType) {
                                    HierarchyViewer.hierarchyViewerReportSuccess(componentName, {
                                        message: 'Successfully found matching hierarchy config record',
                                        hierarchyCount: hierarchyRecords.length,
                                        hierarchyIds: hierarchyRecords.map(function (_) { return _.id; }).toString(),
                                        entityType: entityType,
                                        recordId: recordId,
                                        hierarchyId: id,
                                        root: true,
                                        duration: Date.now() - start
                                    });
                                    return [2 /*return*/, true];
                                }
                                branchIdx = config.branches.findIndex(function (branch) { return branch.entityType === entityType; });
                                if (branchIdx !== -1) {
                                    HierarchyViewer.hierarchyViewerReportSuccess(componentName, {
                                        message: 'Successfully found matching hierarchy config record',
                                        hierarchyCount: hierarchyRecords.length,
                                        hierarchyIds: hierarchyRecords.map(function (_) { return _.id; }).toString(),
                                        entityType: entityType,
                                        recordId: recordId,
                                        hierarchyId: id,
                                        root: false,
                                        branchIdx: branchIdx,
                                        duration: Date.now() - start
                                    });
                                    return [2 /*return*/, true];
                                }
                            }
                            HierarchyViewer.hierarchyViewerReportSuccess(componentName, {
                                message: 'No matching hierarchy config record found',
                                hierarchyCount: hierarchyRecords.length,
                                hierarchyIds: hierarchyRecords.map(function (_) { return _.id; }).toString(),
                                entityType: entityType,
                                recordId: recordId,
                                duration: Date.now() - start
                            });
                            return [2 /*return*/, false];
                        case 3:
                            error_4 = _b.sent();
                            HierarchyViewer.hierarchyViewerReportFailure(componentName, error_4, {
                                entityType: entityType,
                                recordId: recordId,
                                duration: Date.now() - start
                            });
                            return [2 /*return*/, false];
                        case 4: return [2 /*return*/];
                    }
                });
            }); };
        })(RibbonRules = HierarchyViewer.RibbonRules || (HierarchyViewer.RibbonRules = {}));
    })(HierarchyViewer = LinkedInExtensions.HierarchyViewer || (LinkedInExtensions.HierarchyViewer = {}));
})(LinkedInExtensions || (LinkedInExtensions = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable @typescript-eslint/no-namespace */
/// <reference path="../Localization/msdyn_LinkedInExtensionsResourceProvider.d.ts" />
/// <reference path="HierarchyViewer.Types.d.ts" />
/// <reference path="HierarchyViewer.Common.ts" />
/// <reference path="HierarchyViewer.FormHandlers.ts" />
/// <reference path="HierarchyViewer.RibbonActions.ts" />
/// <reference path="HierarchyViewer.RibbonRules.ts" />
//# sourceMappingURL=msdyn_HierarchyViewer.js.map