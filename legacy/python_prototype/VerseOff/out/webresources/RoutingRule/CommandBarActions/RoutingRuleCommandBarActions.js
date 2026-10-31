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
var RoutingRule;
(function (RoutingRule) {
    var Constants = (function () {
        function Constants() {
        }
        return Constants;
    }());
    Constants.MoveRoutingRuleItemDialogName = "MoveRoutingRuleItem";
    Constants.RoutingRuleSetSaveAsDialogName = "RoutingRuleSetSaveAs";
    Constants.CustomFilterOnRuleItem = "<filter type='and'><condition attribute='routingruleid' operator='eq' uitype='routingrule' value='{0}' /><condition attribute='routingruleitemid' operator='ne' uitype='routingruleitem' value='{1}' /></filter>";
    // filter draft.
    Constants.CustomFilterOnRoutingRuleSet = "<filter type='and'><condition attribute='routingruleid' operator='ne' uitype='routingrule' value='{0}' /></filter>";
    RoutingRule.Constants = Constants;
    var MoveRuleItemParameters = (function () {
        function MoveRuleItemParameters() {
        }
        return MoveRuleItemParameters;
    }());
    MoveRuleItemParameters.param_RoutingRuleId = "param_RoutingRuleId";
    MoveRuleItemParameters.param_SelectedRuleItemId = "param_SelectedRuleItemId";
    MoveRuleItemParameters.param_SelectedRuleItemName = "param_SelectedRuleItemName";
    MoveRuleItemParameters.param_IsMoveBefore = "param_IsMoveBefore";
    MoveRuleItemParameters.param_IsRefreshNeeded = "param_IsRefreshNeeded";
    RoutingRule.MoveRuleItemParameters = MoveRuleItemParameters;
    var RoutingRuleSaveAsParameters = (function () {
        function RoutingRuleSaveAsParameters() {
        }
        return RoutingRuleSaveAsParameters;
    }());
    RoutingRuleSaveAsParameters.param_RoutingRuleSetIdToClone = "param_RoutingRuleSetIdToClone";
    RoutingRuleSaveAsParameters.param_IsRefreshNeeded = "param_IsRefreshNeeded";
    RoutingRuleSaveAsParameters.param_RoutingRuleSetName = "param_RoutingRuleSetName";
    RoutingRule.RoutingRuleSaveAsParameters = RoutingRuleSaveAsParameters;
    var MoveRuleItemDialogControls = (function () {
        function MoveRuleItemDialogControls() {
        }
        return MoveRuleItemDialogControls;
    }());
    MoveRuleItemDialogControls.ruleItemSelector = "ruleItemSelector";
    MoveRuleItemDialogControls.description = "description";
    MoveRuleItemDialogControls.formheader = "formheader";
    RoutingRule.MoveRuleItemDialogControls = MoveRuleItemDialogControls;
    var RoutingRuleSaveAsDialogControls = (function () {
        function RoutingRuleSaveAsDialogControls() {
        }
        return RoutingRuleSaveAsDialogControls;
    }());
    RoutingRuleSaveAsDialogControls.takeBackup = "takeBackup";
    RoutingRuleSaveAsDialogControls.routingRuleSetToOverwriteSelector = "routingRuleSetToOverwriteSelector";
    RoutingRuleSaveAsDialogControls.routingRuleSetCopyName = "routingRuleSetCopyName";
    RoutingRuleSaveAsDialogControls.copyType = "copyType";
    RoutingRuleSaveAsDialogControls.okayButton = "okayButton";
    RoutingRule.RoutingRuleSaveAsDialogControls = RoutingRuleSaveAsDialogControls;
    var RoutingRuleSaveAsType;
    (function (RoutingRuleSaveAsType) {
        RoutingRuleSaveAsType[RoutingRuleSaveAsType["CreateNewRecord"] = 0] = "CreateNewRecord";
        RoutingRuleSaveAsType[RoutingRuleSaveAsType["OverwriteAnotherRuleSet"] = 1] = "OverwriteAnotherRuleSet";
    })(RoutingRuleSaveAsType = RoutingRule.RoutingRuleSaveAsType || (RoutingRule.RoutingRuleSaveAsType = {}));
    var Utility = (function () {
        function Utility() {
        }
        Utility.showErrorDialog = function (error) {
            var errDialogOptions = {};
            Xrm.Utility.closeProgressIndicator();
            errDialogOptions.message = error.message;
            if (error.innerror) {
                errDialogOptions.details = error.innerror.message + "\n" + error.innerror.stacktrace;
            }
            Xrm.Navigation.openErrorDialog(errDialogOptions);
        };
        return Utility;
    }());
    RoutingRule.Utility = Utility;
})(RoutingRule || (RoutingRule = {}));
/// <reference path="../../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../../../../TypeDefinitions/mscrm.d.ts" />
var RoutingRule;
(function (RoutingRule) {
    var RoutingRuleSetValidation = (function () {
        /// <summary>
        /// Initializes a new instance of the RoutingRuleSetValidation class.
        /// </summary>
        /// <param name="RoutingRuleSet">The routing rule set (entity reference) to be validated</param>
        function RoutingRuleSetValidation(RoutingRuleSet) {
            this.RoutingRuleSet = RoutingRuleSet;
        }
        RoutingRuleSetValidation.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "RoutingRuleSet": {
                        typeName: "Microsoft.Dynamics.CRM.routingrule",
                        structuralProperty: 5
                    }
                },
                operationName: "_RoutingRuleSetValidation",
                operationType: 0
            };
            return metadata;
        };
        return RoutingRuleSetValidation;
    }());
    RoutingRule.RoutingRuleSetValidation = RoutingRuleSetValidation;
})(RoutingRule || (RoutingRule = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var RoutingRule;
(function (RoutingRule) {
    /* tslint:disable:crm-force-fields-private */
    var IsAdvancedUnifiedRoutingEnabledRequest = (function () {
        function IsAdvancedUnifiedRoutingEnabledRequest() {
        }
        IsAdvancedUnifiedRoutingEnabledRequest.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: null,
                operationName: "msdyn_IsAdvancedUnifiedRoutingEnabled",
                operationType: 0,
            };
        };
        return IsAdvancedUnifiedRoutingEnabledRequest;
    }());
    RoutingRule.IsAdvancedUnifiedRoutingEnabledRequest = IsAdvancedUnifiedRoutingEnabledRequest;
})(RoutingRule || (RoutingRule = {}));
var RoutingRule;
(function (RoutingRule) {
    var RetrieveEnvironmentVariableValueForRR = (function () {
        function RetrieveEnvironmentVariableValueForRR(msdyn_EnvironmentVariableName) {
            this.msdyn_EnvironmentVariableName = msdyn_EnvironmentVariableName;
        }
        RetrieveEnvironmentVariableValueForRR.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "",
                parameterTypes: {
                    msdyn_EnvironmentVariableName: {
                        typeName: 'Edm.String',
                        structuralProperty: 1
                    }
                },
                operationType: 0,
                operationName: 'msdyn_RetrieveEnvironmentVariableValueForCS'
            };
            return metadata;
        };
        return RetrieveEnvironmentVariableValueForRR;
    }());
    RoutingRule.RetrieveEnvironmentVariableValueForRR = RetrieveEnvironmentVariableValueForRR;
})(RoutingRule || (RoutingRule = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../../../../TypeDefinitions/RoutingRule/Localization/ResourceStringProvider.d.ts" />
/// <reference path="DialogHandlers/Utility/Constants.ts" />
/// <reference path="ODataContracts/RoutingRuleSetValidation.ts" />
/// <reference path="ODataContracts/IsAdvancedUnifiedRoutingEnabledRequest.ts" />
/// <reference path="ODataContracts/RetrieveEnvironmentVariableValueForRR.ts" />
var RoutingRule;
(function (RoutingRule) {
    var ACTIVATE_DIALOG = "RoutingRuleSetAcivateDialog";
    var DEACTIVATE_DIALOG = "RoutingRuleSetDeactivateDialog";
    var LAST_BUTTON_CLICKED = "param_lastButtonClicked";
    var OK_BUTTON = "ok_id";
    var CANCEL_BUTTON = "cancel_id";
    var RoutingRuleCommandBarActions = (function () {
        function RoutingRuleCommandBarActions() {
            var _this = this;
            this.isTopRowNotSelected = function (gridControl) {
                var allRows = gridControl.getGrid().getRows();
                var selectedRows = gridControl.getGrid().getSelectedRows();
                if (selectedRows.getLength() === 0)
                    return;
                var data = selectedRows.getByIndex(0).getData();
                if (data === null)
                    return;
                var entity = data.getEntity();
                if (entity === null)
                    return;
                var selId = entity._entityId.guid;
                for (var index = 0; index < allRows.getLength(); index++) {
                    var row = allRows.getByIndex(index);
                    if (row !== null) {
                        var rowEntity = row.getData().getEntity();
                        if (rowEntity !== null) {
                            var currentRowId = rowEntity._entityId.guid;
                            if (currentRowId === selId) {
                                return (index !== 0);
                            }
                        }
                    }
                }
            };
            this.isBottomRowNotSelected = function (gridControl) {
                var allRows = gridControl.getGrid().getRows();
                var selectedRows = gridControl.getGrid().getSelectedRows();
                if (selectedRows.getLength() === 0)
                    return;
                var data = selectedRows.getByIndex(0).getData();
                if (data === null)
                    return;
                var entity = data.getEntity();
                if (entity === null)
                    return;
                var selId = entity._entityId.guid;
                for (var index = 0; index < allRows.getLength(); index++) {
                    var row = allRows.getByIndex(index);
                    if (row !== null) {
                        var rowEntity = row.getData().getEntity();
                        if (rowEntity !== null) {
                            var currentRowId = rowEntity._entityId.guid;
                            if (currentRowId === selId) {
                                return (index !== allRows.getLength() - 1);
                            }
                        }
                    }
                }
            };
            this.MoveRecordUp = function (gridEntityName, gridControl, selRecords) {
                var startIndex = gridControl.getFetchXml().indexOf("order attribute");
                var endIndex = gridControl.getFetchXml().indexOf("descending");
                var subString = gridControl.getFetchXml().substring(startIndex, endIndex);
                if (subString.indexOf("sequencenumber") === -1) {
                    Xrm.Navigation.openAlertDialog({
                        text: "Unable to move record as grid is in sort mode. Refresh the grid and try again" //todo: replace actual string
                    });
                }
                else {
                    var selRows_1 = [];
                    var prevRows_1 = [];
                    var allRows = gridControl.getGrid().getRows(true);
                    var selectedRows = gridControl.getGrid().getSelectedRows();
                    if (selectedRows.getLength() === 0)
                        return;
                    var rowData = selectedRows.getByIndex(0);
                    if (rowData === null)
                        return;
                    var entity = rowData.getData().getEntity();
                    if (entity === null)
                        return;
                    var selSequenceNumber_1 = entity.attributes.getByName("sequencenumber").getValue();
                    var selectedIndex = -1;
                    for (var index = 0; index < allRows.getLength(); index++) {
                        var currentRowId = allRows.getByIndex(index).getData().getEntity()._entityId.guid;
                        if (currentRowId === selRecords[0].Id) {
                            selectedIndex = index;
                        }
                    }
                    var prevRow = allRows.getByIndex(selectedIndex - 1);
                    var prevSequenceNumber_1 = prevRow.getData().getEntity().attributes.getByName("sequencenumber").getValue();
                    allRows.forEach(function (row, i) {
                        var rowEntity = row.getData().getEntity();
                        if (rowEntity !== null) {
                            var currentRowId = rowEntity._entityId.guid;
                            var currentRowSeqNumber = rowEntity.attributes.getByName("sequencenumber").getValue();
                            if (currentRowSeqNumber == selSequenceNumber_1) {
                                selRows_1.push(currentRowId);
                            }
                            else if (currentRowSeqNumber === prevSequenceNumber_1) {
                                prevRows_1.push(currentRowId);
                            }
                        }
                    });
                    if (selRows_1.length > 0 && prevRows_1.length > 0) {
                        var self_1 = this;
                        selRows_1.forEach(function (recId) {
                            Xrm.WebApi.online.updateRecord(gridEntityName, recId, { sequencenumber: prevSequenceNumber_1 }).then(function () {
                                prevRows_1.forEach(function (recId) {
                                    Xrm.WebApi.online.updateRecord(gridEntityName, recId, { sequencenumber: selSequenceNumber_1 }).then(function () {
                                        gridControl.refresh();
                                    });
                                });
                            });
                        });
                    }
                }
            };
            this.MoveRecordDown = function (gridEntityName, gridControl, selRecords) {
                var startIndex = gridControl.getFetchXml().indexOf("order attribute");
                var endIndex = gridControl.getFetchXml().indexOf("descending");
                var subString = gridControl.getFetchXml().substring(startIndex, endIndex);
                if (subString.indexOf("sequencenumber") == -1) {
                    Xrm.Navigation.openAlertDialog({
                        text: "Unable to move record as grid is in sort mode. Refresh the grid and try again" //todo: replace actual string
                    });
                }
                else {
                    var selRows_2 = [];
                    var nextRows_1 = [];
                    var allRows = gridControl.getGrid().getRows(true);
                    var selectedRows = gridControl.getGrid().getSelectedRows();
                    if (selectedRows.getLength() === 0)
                        return;
                    var rowData = selectedRows.getByIndex(0);
                    if (rowData === null)
                        return;
                    var entity = rowData.getData().getEntity();
                    if (entity === null)
                        return;
                    var selSequenceNumber_2 = entity.attributes.getByName("sequencenumber").getValue();
                    var selectedIndex = -1;
                    for (var index = 0; index < allRows.getLength(); index++) {
                        var currentRowId = allRows.getByIndex(index).getData().getEntity()._entityId.guid;
                        if (currentRowId === selRecords[0].Id) {
                            selectedIndex = index;
                        }
                    }
                    var nextRow = allRows.getByIndex(selectedIndex + 1);
                    var nextSequenceNumber_1 = nextRow.getData().getEntity().attributes.getByName("sequencenumber").getValue();
                    allRows.forEach(function (row, i) {
                        var rowEntity = row.getData().getEntity();
                        if (rowEntity !== null) {
                            var currentRowId = rowEntity._entityId.guid;
                            var currentRowSeqNumber = rowEntity.attributes.getByName("sequencenumber").getValue();
                            if (currentRowSeqNumber == selSequenceNumber_2) {
                                selRows_2.push(currentRowId);
                            }
                            else if (currentRowSeqNumber === nextSequenceNumber_1) {
                                nextRows_1.push(currentRowId);
                            }
                        }
                    });
                    if (selRows_2.length > 0 && nextRows_1.length > 0) {
                        var self_2 = this;
                        selRows_2.forEach(function (recId) {
                            Xrm.WebApi.online.updateRecord(gridEntityName, recId, { sequencenumber: nextSequenceNumber_1 }).then(function () {
                                nextRows_1.forEach(function (recId) {
                                    Xrm.WebApi.online.updateRecord(gridEntityName, recId, { sequencenumber: selSequenceNumber_2 }).then(function () {
                                        gridControl.refresh();
                                    });
                                });
                            });
                        });
                    }
                }
            };
            this.addNewFromSubGridStandard = function (gridEntityName, parentEntityName, parentEntityId, primaryControl, gridControl) {
                // handle legacy grid type code
                if (typeof gridEntityName == "number") {
                    gridEntityName = Xrm.Internal.getEntityName(gridEntityName);
                }
                var formParameters = {};
                formParameters["param_parentEntityId"] = parentEntityId;
                var attributeEntityLogicalName = Xrm.Page.getAttribute("msdyn_entitylogicalname");
                if (attributeEntityLogicalName && (!ClientUtility.DataUtil.isNullOrUndefined(attributeEntityLogicalName.getValue()))) {
                    formParameters["param_parentAttributeEntityLogicalName"] = attributeEntityLogicalName.getValue();
                }
                else {
                    formParameters["param_parentAttributeEntityLogicalName"] = "incident";
                }
                if (Xrm.Internal.isUci()) {
                    var createFrom = { id: parentEntityId, entityType: "routingrule" };
                    var sizeInput = { value: 80, unit: "%" };
                    var pageInput = {
                        pageType: "entityrecord",
                        entityName: "routingruleitem",
                        createFromEntity: createFrom,
                        data: formParameters
                    };
                    var options = {
                        entityName: "routingruleitem",
                        showDialog: true,
                        hideDialogHeader: true,
                        target: 2,
                        width: sizeInput,
                        position: 2 /* side */
                    };
                    Xrm.Navigation.navigateTo(pageInput, options).then(this.createRuleItemMFDCloseCallback);
                }
                else {
                    var parentControl = gridControl && gridControl.getParentForm ? gridControl.getParentForm() : Xrm.Page;
                    var fromEntity = parentControl.data.entity.getEntityReference();
                    var openOptions = {
                        entityName: gridEntityName,
                        createFromEntity: fromEntity
                    };
                    Xrm.Navigation.openForm(openOptions, formParameters);
                }
            };
            this.openRecord = function (gridEntityName, parentEntityName, parentEntityId, primaryControl, gridControl) {
                // handle legacy grid type code
                if (typeof gridEntityName == "number") {
                    gridEntityName = Xrm.Internal.getEntityName(gridEntityName);
                }
                // To open rule item in edit mode
                var ruleItemId = gridControl.getGrid().getSelectedRows().get(0).getData().getEntity().getId();
                if (ruleItemId[0].startsWith('{')) {
                    ruleItemId = ruleItemId.slice(1, -1);
                }
                var formParameters = {};
                formParameters["param_parentEntityId"] = parentEntityId;
                var attributeEntityLogicalName = Xrm.Page.getAttribute("msdyn_entitylogicalname");
                if (attributeEntityLogicalName && (!ClientUtility.DataUtil.isNullOrUndefined(attributeEntityLogicalName.getValue()))) {
                    formParameters["param_parentAttributeEntityLogicalName"] = attributeEntityLogicalName.getValue();
                }
                else {
                    formParameters["param_parentAttributeEntityLogicalName"] = "incident";
                }
                if (Xrm.Internal.isUci()) {
                    var createFrom = { id: parentEntityId, entityType: "routingrule" };
                    var sizeInput = { value: 70, unit: "%" };
                    var pageInput = {
                        pageType: "entityrecord",
                        entityName: "routingruleitem",
                        createFromEntity: createFrom,
                        entityId: ruleItemId
                    };
                    var options = {
                        entityName: "routingruleitem",
                        showDialog: true,
                        hideDialogHeader: true,
                        target: 2,
                        width: sizeInput,
                        position: 2 /* side */
                    };
                    Xrm.Navigation.navigateTo(pageInput, options).then(_this.createRuleItemMFDCloseCallback);
                }
                else {
                    var parentControl = gridControl && gridControl.getParentForm ? gridControl.getParentForm() : Xrm.Page;
                    var fromEntity = parentControl.data.entity.getEntityReference();
                    var openOptions = {
                        entityName: gridEntityName,
                        createFromEntity: fromEntity
                    };
                    Xrm.Navigation.openForm(openOptions, formParameters);
                }
            };
            this.closeMainFormDialog = function () {
                Xrm.Page.ui.close();
            };
            this.IsRoutingRuleSetInactive = function () {
                if (Xrm.Page.ui.getFormType() != 1 /* Create */) {
                    var ruleItemId = ClientUtility.Guid.tryCreate(Xrm.Page.data.entity.getId());
                    var fetchQuery = ClientUtility.StringUtil.format("?fetchXml=<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'><entity name='routingruleitem'><filter type='and'><condition attribute='routingruleitemid' operator='eq' value='{0}'/></filter><link-entity name='routingrule' from='routingruleid' to='routingruleid' link-type='inner'><filter type='and'><condition attribute='statecode' operator='eq' value='1'/></filter></link-entity></entity></fetch>", ruleItemId);
                    return Xrm.WebApi.retrieveMultipleRecords("routingruleitem", fetchQuery).then(function (routingRuleResponse) {
                        if (routingRuleResponse && routingRuleResponse.entities && routingRuleResponse.entities.length == 1) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }, ClientUtility.ActionFailedHandler.actionFailedCallback);
                }
            };
            this.createRuleItemMFDCloseCallback = function (savedEntity) {
                if (savedEntity) {
                    Xrm.Page.data.refresh(false);
                }
            };
            this.IsNoOfRuleItemsMoreThanOne = function (gridControl) {
                return gridControl && gridControl.getGrid() && gridControl.getGrid().getRows() && (gridControl.getGrid().getRows().getLength() > 1);
            };
            this.IsNotInQuickFindView = function (gridControl) {
                if (!this.isUXEnhancementsFCBEnabled()) {
                    return true;
                }
                var fetchXmlInUse = gridControl.getFetchXml();
                if (fetchXmlInUse) {
                    return fetchXmlInUse.indexOf("<filter type=\"or\" isquickfindfields=\"1\">") == -1;
                }
                return true;
            };
            /// Based on clients , FCB and Environment variable, calls activation directly or does validate and then activate
            this.ValidateAndActivateRoutingRuleFromGrid = function (SelectedControl, SelectedControlSelectedItemReferences, SelectedEntityTypeCode) {
                if (!SelectedControlSelectedItemReferences || SelectedControlSelectedItemReferences.length == 0 || SelectedControlSelectedItemReferences.length > 1) {
                    return;
                }
                // If UCI and FCB Off, call the activate function from app common.
                // If UCI and FCB on, validate and then call activate.
                if (!Xrm.Internal.isUci()) {
                    _this.InvokeBaseActivateFunctionForGrid(SelectedControl, SelectedControlSelectedItemReferences, SelectedEntityTypeCode);
                }
                else {
                    var routingRuleId = SelectedControlSelectedItemReferences && SelectedControlSelectedItemReferences[0] && SelectedControlSelectedItemReferences[0].Id;
                    var entityName = SelectedControl && SelectedControl.getEntityName();
                    var envVariableFetchRequest = new RoutingRule.RetrieveEnvironmentVariableValueForRR("msdyn_ValidateRoutingRuleBeforeActivation");
                    Xrm.WebApi.online.execute(envVariableFetchRequest).then(function (response) {
                        if (response.status == 200) {
                            response.json().then(function (result) {
                                if (result.msdyn_EnvironmentVariableValue && result.msdyn_EnvironmentVariableValue.toString().toLowerCase() == "yes") {
                                    _this.ValiateRoutingRuleSetAndInvokeCallBackFunction(routingRuleId, _this.openActivateRoutingRuleDialogFromGrid.bind(_this, routingRuleId, entityName, SelectedControl));
                                    return;
                                }
                                else {
                                    _this.openActivateRoutingRuleDialogFromGrid(routingRuleId, entityName, SelectedControl);
                                }
                            }, function (error) {
                                _this.openActivateRoutingRuleDialogFromGrid(routingRuleId, entityName, SelectedControl);
                            });
                        }
                        else {
                            _this.openActivateRoutingRuleDialogFromGrid(routingRuleId, entityName, SelectedControl);
                        }
                    }, function (error) {
                        _this.openActivateRoutingRuleDialogFromGrid(routingRuleId, entityName, SelectedControl);
                    });
                }
            };
            /// Based on clients , FCB and Environment variable, calls activation directly or does validate and then activate
            this.ValidateAndActivateRoutingRuleFromForm = function (FirstPrimaryItemId, PrimaryEntityTypeName) {
                if (!Xrm.Internal.isUci()) {
                    _this.InvokeBaseActivateFunctionForForm(FirstPrimaryItemId, PrimaryEntityTypeName);
                }
                else {
                    var envVariableFetchRequest = new RoutingRule.RetrieveEnvironmentVariableValueForRR("msdyn_ValidateRoutingRuleBeforeActivation");
                    Xrm.WebApi.online.execute(envVariableFetchRequest).then(function (response) {
                        if (response.status == 200) {
                            response.json().then(function (result) {
                                if (result.msdyn_EnvironmentVariableValue && result.msdyn_EnvironmentVariableValue.toString().toLowerCase() == "yes") {
                                    _this.ValiateRoutingRuleSetAndInvokeCallBackFunction(FirstPrimaryItemId, _this.openActivateRoutingRuleDialogFromForm.bind(_this, FirstPrimaryItemId, PrimaryEntityTypeName));
                                    return;
                                }
                                else {
                                    _this.openActivateRoutingRuleDialogFromForm(FirstPrimaryItemId, PrimaryEntityTypeName);
                                }
                            }, function (error) {
                                _this.openActivateRoutingRuleDialogFromForm(FirstPrimaryItemId, PrimaryEntityTypeName);
                            });
                        }
                        else {
                            _this.openActivateRoutingRuleDialogFromForm(FirstPrimaryItemId, PrimaryEntityTypeName);
                        }
                    }, function (error) {
                        _this.openActivateRoutingRuleDialogFromForm(FirstPrimaryItemId, PrimaryEntityTypeName);
                    });
                }
            };
            this.okButtonClick = function () {
                Xrm.Page.data.attributes.get(LAST_BUTTON_CLICKED).setValue(OK_BUTTON);
                Xrm.Page.ui.close();
            };
            this.cancelButtonClick = function () {
                Xrm.Page.data.attributes.get(LAST_BUTTON_CLICKED).setValue(CANCEL_BUTTON);
                Xrm.Page.ui.close();
            };
            this.activateStateDialogOnload = function () { return __awaiter(_this, void 0, void 0, function () {
                var localeString, localeHeaderString, res, response, result, localeString, exception_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 6, , 7]);
                            if (!Xrm.Internal.isFeatureEnabled("HierarchicalRoutingRule")) return [3 /*break*/, 1];
                            localeString = String.format(RoutingRule.ResourceStringProvider.getResourceString('ACTIVATE_ROUTINGRULE_DIALOG_HRR_ENABLED'));
                            this.setLabel('lbl_activatestatemessage', localeString);
                            localeHeaderString = String.format(RoutingRule.ResourceStringProvider.getResourceString('ACTIVATE_ROUTINGRULE_DIALOG_HEADER_HRR_ENABLED'));
                            this.setLabel('lbl_activateslaheader', localeHeaderString);
                            return [3 /*break*/, 5];
                        case 1: return [4 /*yield*/, Xrm.WebApi.retrieveMultipleRecords("workflow", "?$select=uniquename&$filter=category eq 3 and uniquename eq 'IsAdvancedUnifiedRoutingEnabled'")];
                        case 2:
                            res = _a.sent();
                            if (!(res && res.entities.length >= 1)) return [3 /*break*/, 5];
                            return [4 /*yield*/, Xrm.WebApi.online.execute(new RoutingRule.IsAdvancedUnifiedRoutingEnabledRequest())];
                        case 3:
                            response = _a.sent();
                            return [4 /*yield*/, response.json()];
                        case 4:
                            result = _a.sent();
                            if (result && result.IsAdvancedUnifiedRoutingEnabled) {
                                localeString = String.format(RoutingRule.ResourceStringProvider.getResourceString('ACTIVATE_ROUTINGRULE_DIALOG_UR_ENABLED'));
                                this.setLabel('lbl_activatestatemessage', localeString);
                            }
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            exception_1 = _a.sent();
                            return [2 /*return*/];
                        case 7: return [2 /*return*/];
                    }
                });
            }); };
            this.DeactivateRoutingRuleFromForm = function (FirstPrimaryItemId, PrimaryEntityTypeName) {
                if (Xrm.Internal.isUci()) {
                    var state_1 = {
                        statecode: 0,
                        statuscode: 1
                    };
                    Xrm.Navigation.openDialog(DEACTIVATE_DIALOG, _this.getDiaglogOptions()).then(function (dialogParams) {
                        if (dialogParams.parameters[LAST_BUTTON_CLICKED] === OK_BUTTON) {
                            ClientUtility.DialogUtil.showProgressMessage();
                            Xrm.WebApi.updateRecord(PrimaryEntityTypeName, FirstPrimaryItemId, state_1).then(function () {
                                ClientUtility.DialogUtil.hideProgressMessage();
                                Xrm.Page.ui.refresh();
                            }, ClientUtility.DialogUtil.actionFailedCallbackForMoca);
                        }
                    });
                }
                else {
                    _this.InvokeBaseDeactivateFunctionForForm(FirstPrimaryItemId, PrimaryEntityTypeName);
                }
            };
            this.DeactivateRoutingRuleFromGrid = function (SelectedControl, SelectedControlSelectedItemReferences, SelectedEntityTypeCode) {
                if (Xrm.Internal.isUci()) {
                    var state_2 = {
                        statecode: 0,
                        statuscode: 1
                    };
                    Xrm.Navigation.openDialog(DEACTIVATE_DIALOG, _this.getDiaglogOptions()).then(function (dialogParams) {
                        if (dialogParams.parameters[LAST_BUTTON_CLICKED] === OK_BUTTON) {
                            ClientUtility.DialogUtil.showProgressMessage();
                            var routingRuleId = SelectedControlSelectedItemReferences && SelectedControlSelectedItemReferences[0] && SelectedControlSelectedItemReferences[0].Id;
                            var entityName = SelectedControl && SelectedControl.getEntityName();
                            Xrm.WebApi.updateRecord(entityName, routingRuleId, state_2).then(function () {
                                ClientUtility.DialogUtil.hideProgressMessage();
                                SelectedControl.refresh();
                            }, ClientUtility.DialogUtil.actionFailedCallbackForMoca);
                        }
                    });
                }
                else {
                    _this.InvokeBaseDeactivateFunctionForGrid(SelectedControl, SelectedControlSelectedItemReferences, SelectedEntityTypeCode);
                }
            };
            this.openActivateRoutingRuleDialogFromForm = function (FirstPrimaryItemId, PrimaryEntityTypeName) {
                var state = {
                    statecode: 1,
                    statuscode: 2
                };
                Xrm.Navigation.openDialog(ACTIVATE_DIALOG, _this.getDiaglogOptions()).then(function (dialogParams) {
                    if (dialogParams.parameters[LAST_BUTTON_CLICKED] === OK_BUTTON) {
                        ClientUtility.DialogUtil.showProgressMessage();
                        Xrm.WebApi.updateRecord(PrimaryEntityTypeName, FirstPrimaryItemId, state).then(function () {
                            ClientUtility.DialogUtil.hideProgressMessage();
                            Xrm.Page.ui.refresh();
                        }, ClientUtility.DialogUtil.actionFailedCallbackForMoca);
                    }
                });
            };
            this.openActivateRoutingRuleDialogFromGrid = function (FirstPrimaryItemId, PrimaryEntityTypeName, control) {
                var state = {
                    statecode: 1,
                    statuscode: 2
                };
                Xrm.Navigation.openDialog(ACTIVATE_DIALOG, _this.getDiaglogOptions()).then(function (dialogParams) {
                    if (dialogParams.parameters[LAST_BUTTON_CLICKED] === OK_BUTTON) {
                        ClientUtility.DialogUtil.showProgressMessage();
                        Xrm.WebApi.updateRecord(PrimaryEntityTypeName, FirstPrimaryItemId, state).then(function () {
                            ClientUtility.DialogUtil.hideProgressMessage();
                            control.refresh();
                        }, ClientUtility.DialogUtil.actionFailedCallbackForMoca);
                    }
                });
            };
            this.getDiaglogOptions = function () {
                var dialogOptions = {
                    width: 500,
                    height: 250,
                    position: 1 /* center */
                };
                return dialogOptions;
            };
            this.InvokeBaseActivateFunctionForGrid = function (SelectedControl, SelectedControlSelectedItemReferences, SelectedEntityTypeCode) {
                XrmCore && XrmCore.Commands &&
                    XrmCore.Commands.Activate && XrmCore.Commands.Activate.activateRecordsLegacy &&
                    XrmCore.Commands.Activate.activateRecordsLegacy(SelectedControl, SelectedControlSelectedItemReferences, SelectedEntityTypeCode);
            };
            this.InvokeBaseActivateFunctionForForm = function (FirstPrimaryItemId, PrimaryEntityTypeName) {
                XrmCore && XrmCore.Commands &&
                    XrmCore.Commands.Activate && XrmCore.Commands.Activate.activateRecordsLegacy &&
                    XrmCore.Commands.Activate.activatePrimaryRecord(FirstPrimaryItemId, PrimaryEntityTypeName);
            };
            this.InvokeBaseDeactivateFunctionForForm = function (FirstPrimaryItemId, PrimaryEntityTypeName) {
                XrmCore && XrmCore.Commands &&
                    XrmCore.Commands.Deactivate && XrmCore.Commands.Deactivate.deactivateRecordsLegacy &&
                    XrmCore.Commands.Deactivate.deactivatePrimaryRecord(FirstPrimaryItemId, PrimaryEntityTypeName);
            };
            this.InvokeBaseDeactivateFunctionForGrid = function (SelectedControl, SelectedControlSelectedItemReferences, SelectedEntityTypeCode) {
                XrmCore && XrmCore.Commands &&
                    XrmCore.Commands.Deactivate && XrmCore.Commands.Deactivate.deactivateRecordsLegacy &&
                    XrmCore.Commands.Deactivate.deactivateRecordsLegacy(SelectedControl, SelectedControlSelectedItemReferences, SelectedEntityTypeCode);
            };
            this.ValiateRoutingRuleSetAndInvokeCallBackFunction = function (routingRuleSetId, callbackFunctionOnNoValidationErrors) {
                if (!routingRuleSetId.startsWith("{")) {
                    routingRuleSetId = "{" + routingRuleSetId + "}";
                }
                var routingRuleSetObj = {};
                routingRuleSetObj["@odata.type"] = "Microsoft.Dynamics.CRM.routingrule";
                routingRuleSetObj.routingruleid = routingRuleSetId;
                var validationRequest = new RoutingRule.RoutingRuleSetValidation(routingRuleSetObj);
                Xrm.WebApi.online.execute(validationRequest).then(function (response) {
                    if (response.status == 200) {
                        response.json().then(function (result) {
                            if (ClientUtility.DataUtil.isNullOrEmptyString(result.ValidationMessageToDownload)) {
                                callbackFunctionOnNoValidationErrors();
                            }
                            else {
                                var errorDialogOptions = {};
                                errorDialogOptions.message = result.ValidationMessageToDisplay;
                                errorDialogOptions.details = result.ValidationMessageToDownload;
                                Xrm.Navigation.openErrorDialog(errorDialogOptions);
                            }
                        });
                    }
                    else {
                        callbackFunctionOnNoValidationErrors();
                    }
                }, function (error) {
                    callbackFunctionOnNoValidationErrors();
                });
            };
            this.CloneActionHandlerFromForm = function (FirstPrimaryItemId, PrimaryControl) {
                if (!_this.isUXEnhancementsFCBEnabled()) {
                    var errorDialogOptions = {};
                    errorDialogOptions.message = RoutingRule.ResourceStringProvider.getResourceString("ERROR_RR_UX_ENHANCEMENTS_FEATURE_OFF");
                    Xrm.Navigation.openErrorDialog(errorDialogOptions);
                    return;
                }
                var options = { "width": 530, "height": 400, "position": 1 };
                var parameters = {};
                parameters[RoutingRule.RoutingRuleSaveAsParameters.param_RoutingRuleSetIdToClone] = FirstPrimaryItemId;
                var currentRoutingRuleSetName = PrimaryControl.getAttribute("name").getValue();
                parameters[RoutingRule.RoutingRuleSaveAsParameters.param_RoutingRuleSetName] = currentRoutingRuleSetName;
                Xrm.Navigation.openDialog(RoutingRule.Constants.RoutingRuleSetSaveAsDialogName, options, parameters);
            };
            this.isUXEnhancementsFCBEnabled = function () {
                if (Xrm.Internal.isUci()) {
                    return Xrm.Internal.isFeatureEnabled("RoutingRuleUXEnhancements");
                }
                else {
                    return Xrm.Internal.isFeatureEnabled("FCB.RoutingRuleUXEnhancements");
                }
            };
            this.MoveRuleItem = function (gridEntityName, gridControl, selectedRecords, isBefore) {
                if (selectedRecords.length == 0) {
                    return;
                }
                if (!_this.isUXEnhancementsFCBEnabled()) {
                    var errorDialogOptions = {};
                    errorDialogOptions.message = RoutingRule.ResourceStringProvider.getResourceString("ERROR_RR_UX_ENHANCEMENTS_FEATURE_OFF");
                    Xrm.Navigation.openErrorDialog(errorDialogOptions);
                    return;
                }
                var selectedRows = gridControl.getGrid().getSelectedRows();
                var routingRuleSetLookUp = selectedRows.getByIndex(0).getAttribute("routingruleid").getValue();
                var options = { "width": 512, "height": 300, "position": 1 };
                var parameters = {};
                parameters[RoutingRule.MoveRuleItemParameters.param_RoutingRuleId] = routingRuleSetLookUp[0].id;
                parameters[RoutingRule.MoveRuleItemParameters.param_SelectedRuleItemId] = selectedRecords[0].Id;
                parameters[RoutingRule.MoveRuleItemParameters.param_IsMoveBefore] = isBefore;
                parameters[RoutingRule.MoveRuleItemParameters.param_IsRefreshNeeded] = false;
                parameters[RoutingRule.MoveRuleItemParameters.param_SelectedRuleItemName] = selectedRecords[0].Name;
                Xrm.Navigation.openDialog(RoutingRule.Constants.MoveRoutingRuleItemDialogName, options, parameters).then(function (result) {
                    if (result.parameters[RoutingRule.MoveRuleItemParameters.param_IsRefreshNeeded]) {
                        gridControl.refresh();
                    }
                });
            };
        }
        RoutingRuleCommandBarActions.prototype.setLabel = function (controlString, localeString) {
            var control = Xrm.Page.ui.controls.get(controlString);
            control ? control.setLabel(localeString) : console.log("control is null");
        };
        return RoutingRuleCommandBarActions;
    }());
    RoutingRule.RoutingRuleCommandBarActions = RoutingRuleCommandBarActions;
})(RoutingRule || (RoutingRule = {}));
/// <reference path="../../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../../../../TypeDefinitions/mscrm.d.ts" />
var RoutingRule;
(function (RoutingRule) {
    var CloneRoutingRuleSet = (function () {
        /// <summary>
        /// Initializes a new instance of the CloneRoutingRuleSet class.
        /// </summary>
        /// <param name="RoutingRuleSetIdToClone">The Id of the routing rule set to be cloned</param>
        /// <param name="Options">Option value containing info about backup and copy's record name</param>
        /// <param name="RoutingRuleSetIdToOverwrite">The id of routing rule set to overwrite.applicable only when we want to overwrite an existing ruleset</param>
        function CloneRoutingRuleSet(RoutingRuleSetIdToClone, Options, RoutingRuleSetIdToOverwrite) {
            this.RoutingRuleSetIdToClone = RoutingRuleSetIdToClone;
            if (RoutingRuleSetIdToOverwrite) {
                this.RoutingRuleSetIdToOverwrite = RoutingRuleSetIdToOverwrite;
            }
            this.Options = Options;
        }
        CloneRoutingRuleSet.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "RoutingRuleSetIdToClone": {
                        typeName: "Microsoft.Dynamics.CRM.routingrule",
                        structuralProperty: 5
                    },
                    "RoutingRuleSetIdToOverwrite": {
                        typeName: "Microsoft.Dynamics.CRM.routingrule",
                        structuralProperty: 5
                    },
                    "Options": {
                        typeName: "Edm.String",
                        "structuralProperty": 1
                    }
                },
                operationName: "_CloneRoutingRuleSet",
                operationType: 0
            };
            return metadata;
        };
        return CloneRoutingRuleSet;
    }());
    RoutingRule.CloneRoutingRuleSet = CloneRoutingRuleSet;
})(RoutingRule || (RoutingRule = {}));
/// <reference path="../../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../../../../TypeDefinitions/RoutingRule/Localization/ResourceStringProvider.d.ts" />
var RoutingRule;
(function (RoutingRule) {
    /** Common helper methods used from dialog handlers */
    var DialogHelperMethods = (function () {
        function DialogHelperMethods() {
        }
        DialogHelperMethods.setDisablePropertiesOnLookup = function (lookupControl) {
            lookupControl.controlDescriptor.Parameters.IsInlineNewEnabled = "false";
            lookupControl.controlDescriptor.Parameters.DisableViewPicker = "true";
            lookupControl.controlDescriptor.Parameters.DisableMru = true;
        };
        DialogHelperMethods.getDialogParameterValue = function (formContext, parameterName) {
            return formContext.data.attributes.get(parameterName).getValue();
        };
        return DialogHelperMethods;
    }());
    DialogHelperMethods.enableOkayButtonOnValue = function (context, valueControlName) {
        var value = context._formContext.data.attributes.getByName(valueControlName).getValue();
        var okayButton = context._formContext.getControl("okayButton");
        if (value) {
            okayButton.setDisabled(false);
        }
        else {
            okayButton.setDisabled(true);
        }
    };
    DialogHelperMethods.addFilterForLookUp = function (filterString, entityName, control) {
        control.addCustomFilter(filterString, entityName);
    };
    DialogHelperMethods.closeProgessDialogAndMDD = function (formcontext) {
        Xrm.Utility.closeProgressIndicator();
        formcontext.ui.close();
    };
    RoutingRule.DialogHelperMethods = DialogHelperMethods;
})(RoutingRule || (RoutingRule = {}));
/// <reference path="../../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../../../../TypeDefinitions/RoutingRule/Localization/ResourceStringProvider.d.ts" />
/// <reference path="../ODataContracts/CloneRoutingRuleSet.ts" />
/// <reference path="Utility/Constants.ts" />
/// <reference path="DialogHelperMethods.ts" />
var RoutingRule;
(function (RoutingRule) {
    /** onclick,onload and onchange handlers on RoutingRuleSetSaveAs Dialog */
    var RoutingRuleSetSaveAsDialogHandlers = (function () {
        function RoutingRuleSetSaveAsDialogHandlers() {
            var _this = this;
            this.onLoadHandlerRoutingRuleSaveAs = function (context) {
                var formContext = context._formContext;
                var routingRuleSetCopyName = context._formContext.getControl(RoutingRule.RoutingRuleSaveAsDialogControls.routingRuleSetCopyName);
                var originalRecordName = RoutingRule.DialogHelperMethods.getDialogParameterValue(formContext, RoutingRule.RoutingRuleSaveAsParameters.param_RoutingRuleSetName);
                var copyRecordName = _this.getCloneRecordName(originalRecordName);
                routingRuleSetCopyName.getAttribute(RoutingRule.RoutingRuleSaveAsDialogControls.routingRuleSetCopyName).setValue(copyRecordName);
            };
            this.onChangeCopyType = function (context) {
                var formContext = context._formContext;
                var copyType = context._formContext.data.attributes.getByName(RoutingRule.RoutingRuleSaveAsDialogControls.copyType).getValue();
                var okayButton = context._formContext.getControl(RoutingRule.RoutingRuleSaveAsDialogControls.okayButton);
                // if create New is chosen now, reset the old values selected during overwrite
                if (copyType == RoutingRule.RoutingRuleSaveAsType.CreateNewRecord) {
                    _this.resetOverwriteRelatedControls(formContext);
                    if (okayButton) {
                        okayButton.setDisabled(false);
                    }
                }
                // if Overwrite chosen, reset the old values selected during create new option.
                if (copyType == RoutingRule.RoutingRuleSaveAsType.OverwriteAnotherRuleSet) {
                    _this.resetCreateNewRelatedControls(formContext);
                    var notificationString = RoutingRule.ResourceStringProvider.getResourceString("SAVEAS_OVERWRITE_WARNING_MESSAGE");
                    context._formContext.ui.setFormNotification(notificationString, "INFO", "InfoOnOverwrite");
                    var takeBackUpControl = context._formContext.getControl(RoutingRule.RoutingRuleSaveAsDialogControls.takeBackup);
                    takeBackUpControl.getAttribute().setValue("1");
                    _this.addCustomFilterForRoutingRuleSelector(formContext);
                    if (okayButton) {
                        okayButton.setDisabled(true);
                    }
                }
            };
            this.onChangeCopyRecordNameControl = function (context) {
                RoutingRule.DialogHelperMethods.enableOkayButtonOnValue(context, RoutingRule.RoutingRuleSaveAsDialogControls.routingRuleSetCopyName);
            };
            this.onChangeRoutingRuleSetSelector = function (context) {
                RoutingRule.DialogHelperMethods.enableOkayButtonOnValue(context, RoutingRule.RoutingRuleSaveAsDialogControls.routingRuleSetToOverwriteSelector);
            };
            this.onClickOkayButtonSaveAs = function (context) {
                var formContext = context._formContext;
                var copyType = formContext.getControl(RoutingRule.RoutingRuleSaveAsDialogControls.copyType);
                var isOverWrite = copyType.getAttribute().getValue() == 1;
                var rulesetIdToClone = RoutingRule.DialogHelperMethods.getDialogParameterValue(formContext, RoutingRule.RoutingRuleSaveAsParameters.param_RoutingRuleSetIdToClone);
                var request;
                if (isOverWrite) {
                    request = _this.generateCloneRequestForOverwriteOption(formContext, rulesetIdToClone);
                }
                else {
                    request = _this.generateCloneRequestForCreateNewOption(formContext, rulesetIdToClone);
                }
                if (request == null) {
                    return;
                }
                var progressMsg = RoutingRule.ResourceStringProvider.getResourceString("IN_PROGRESS_MESSAGE");
                Xrm.Utility.showProgressIndicator(progressMsg);
                Xrm.WebApi.online.execute(request).then(function (response) {
                    RoutingRule.DialogHelperMethods.closeProgessDialogAndMDD(formContext);
                    if (response.status == 200) {
                        response.json().then(function (result) {
                            _this.navigateToRoutingRuleRecord(result.RoutingRuleSetCopyRecordId);
                        });
                    }
                    else {
                        var errDialogOptions = {};
                        errDialogOptions.message = RoutingRule.ResourceStringProvider.getResourceString("GENERIC_ERROR");
                        RoutingRule.DialogHelperMethods.closeProgessDialogAndMDD(formContext);
                        Xrm.Navigation.openErrorDialog(errDialogOptions);
                    }
                }, function (error) {
                    RoutingRule.DialogHelperMethods.closeProgessDialogAndMDD(formContext);
                    RoutingRule.Utility.showErrorDialog(error);
                });
            };
            this.getCloneRecordName = function (originalRoutingRuleSetName) {
                var prefix = RoutingRule.ResourceStringProvider.getResourceString("SAVEAS_DIALOG_NEWRECORDNAME_PREFIX");
                var finalName = prefix + "_" + originalRoutingRuleSetName;
                if (finalName.length > 100) {
                    finalName = finalName.substr(0, 100);
                }
                return finalName;
            };
            this.resetOverwriteRelatedControls = function (formcontext) {
                var routingRuleSetToOverwriteSelector = formcontext.getControl(RoutingRule.RoutingRuleSaveAsDialogControls.routingRuleSetToOverwriteSelector);
                formcontext.ui.clearFormNotification("InfoOnOverwrite");
                // reset the values for older selection
                if (routingRuleSetToOverwriteSelector) {
                    routingRuleSetToOverwriteSelector.getAttribute().setValue(null);
                }
                formcontext.ui.tabs.get("general").sections.get("OverwriteRecordSection").setVisible(false);
                formcontext.ui.tabs.get("general").sections.get("createNewRecordSection").setVisible(true);
            };
            this.resetCreateNewRelatedControls = function (formcontext) {
                var originalRecordName = RoutingRule.DialogHelperMethods.getDialogParameterValue(formcontext, RoutingRule.RoutingRuleSaveAsParameters.param_RoutingRuleSetName);
                var copyRecordName = _this.getCloneRecordName(originalRecordName);
                formcontext.data.attributes.get(RoutingRule.RoutingRuleSaveAsDialogControls.routingRuleSetCopyName).setValue(copyRecordName);
                formcontext.ui.tabs.get("general").sections.get("createNewRecordSection").setVisible(false);
                formcontext.ui.tabs.get("general").sections.get("OverwriteRecordSection").setVisible(true);
            };
            this.addCustomFilterForRoutingRuleSelector = function (formContext) {
                var routingRuleSetToOverwriteSelector = formContext.getControl(RoutingRule.RoutingRuleSaveAsDialogControls.routingRuleSetToOverwriteSelector);
                RoutingRule.DialogHelperMethods.setDisablePropertiesOnLookup(routingRuleSetToOverwriteSelector);
                var excludeRRSetId = RoutingRule.DialogHelperMethods.getDialogParameterValue(formContext, RoutingRule.RoutingRuleSaveAsParameters.param_RoutingRuleSetIdToClone);
                var fetchXmlFilter = RoutingRule.Constants.CustomFilterOnRoutingRuleSet.replace("{0}", excludeRRSetId);
                routingRuleSetToOverwriteSelector.addPreSearch(RoutingRule.DialogHelperMethods.addFilterForLookUp.bind(_this, fetchXmlFilter, "routingrule", routingRuleSetToOverwriteSelector));
            };
            this.generateCloneRequestForCreateNewOption = function (formContext, rulesetIdToClone) {
                var cloneOptions = {};
                var rulesetIdToCloneObj = {};
                rulesetIdToCloneObj["@odata.type"] = "Microsoft.Dynamics.CRM.routingrule";
                rulesetIdToCloneObj.routingruleid = rulesetIdToClone;
                var routingRuleSetCopyName = formContext.getControl(RoutingRule.RoutingRuleSaveAsDialogControls.routingRuleSetCopyName);
                if (routingRuleSetCopyName.getAttribute().getValue()) {
                    cloneOptions.RecordCopyName = routingRuleSetCopyName.getAttribute().getValue();
                }
                else {
                    cloneOptions.RecordCopyName = _this.getCloneRecordName(formContext.data.attributes(RoutingRule.RoutingRuleSaveAsParameters.param_RoutingRuleSetName).getValue());
                }
                return new RoutingRule.CloneRoutingRuleSet(rulesetIdToCloneObj, JSON.stringify(cloneOptions));
            };
            this.generateCloneRequestForOverwriteOption = function (formContext, rulesetIdToClone) {
                var cloneOptions = {};
                var rulesetIdToCloneObj = {};
                rulesetIdToCloneObj["@odata.type"] = "Microsoft.Dynamics.CRM.routingrule";
                rulesetIdToCloneObj.routingruleid = rulesetIdToClone;
                var takeBackup = formContext.getControl(RoutingRule.RoutingRuleSaveAsDialogControls.takeBackup).getAttribute().getValue();
                cloneOptions.ShouldTakeBackup = (takeBackup == 1) ? "true" : "false";
                var rrSetToOverWriteLookupValue = formContext.getControl(RoutingRule.RoutingRuleSaveAsDialogControls.routingRuleSetToOverwriteSelector).getAttribute().getValue();
                var errDialogOptions = {};
                errDialogOptions.message = RoutingRule.ResourceStringProvider.getResourceString("MISSING_ROUTINGRULE_LOOKUPVALUE");
                if (!rrSetToOverWriteLookupValue || rrSetToOverWriteLookupValue.length != 1) {
                    Xrm.Navigation.openErrorDialog(errDialogOptions);
                    return null;
                }
                var rrSetIdToOverWrite = rrSetToOverWriteLookupValue[0].id;
                rrSetIdToOverWrite = rrSetIdToOverWrite.substr(1, rrSetIdToOverWrite.length - 2); // curly
                var rulesetIdToOverWriteObj = {};
                rulesetIdToOverWriteObj["@odata.type"] = "Microsoft.Dynamics.CRM.routingrule";
                rulesetIdToOverWriteObj.routingruleid = rrSetIdToOverWrite;
                return new RoutingRule.CloneRoutingRuleSet(rulesetIdToCloneObj, JSON.stringify(cloneOptions), rulesetIdToOverWriteObj);
            };
            this.navigateToRoutingRuleRecord = function (recordId) {
                var entityFormOptions = {};
                entityFormOptions["entityName"] = "routingrule";
                entityFormOptions["entityId"] = recordId;
                // Open the form.
                Xrm.Navigation.openForm(entityFormOptions);
            };
        }
        return RoutingRuleSetSaveAsDialogHandlers;
    }());
    RoutingRule.RoutingRuleSetSaveAsDialogHandlers = RoutingRuleSetSaveAsDialogHandlers;
})(RoutingRule || (RoutingRule = {}));
/// <reference path="../../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../../../../TypeDefinitions/mscrm.d.ts" />
var RoutingRule;
(function (RoutingRule) {
    var MoveRoutingRuleItemAt = (function () {
        /// <summary>
        /// Initializes a new instance of the MoveRoutingRuleItemAt class.
        /// </summary>
        /// <param name="RoutingRuleSetId">The Id of the routing rule set under which rule items are available</param>
        /// <param name="RoutingRuleItemIdToMove">The rule item id to be moved</param>
        /// <param name="TargetRoutingRuleItemId">The rule item against which RoutingRuleItemIdToMove should be moved</param>
        /// <param name="IsBefore">Whether rule item should be moved before or after another rule item</param>
        function MoveRoutingRuleItemAt(RoutingRuleSetId, RoutingRuleItemIdToMove, TargetRoutingRuleItemId, IsBefore) {
            this.RoutingRuleSetId = RoutingRuleSetId;
            this.RoutingRuleItemIdToMove = RoutingRuleItemIdToMove;
            this.TargetRoutingRuleItemId = TargetRoutingRuleItemId;
            this.IsBefore = IsBefore;
        }
        MoveRoutingRuleItemAt.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "RoutingRuleSetId": {
                        typeName: "Microsoft.Dynamics.CRM.routingrule",
                        structuralProperty: 5
                    },
                    "RoutingRuleItemIdToMove": {
                        "typeName": "Microsoft.Dynamics.CRM.routingruleitem",
                        "structuralProperty": 5
                    },
                    "TargetRoutingRuleItemId": {
                        "typeName": "Microsoft.Dynamics.CRM.routingruleitem",
                        "structuralProperty": 5
                    },
                    "IsBefore": {
                        "typeName": "Edm.Boolean",
                        "structuralProperty": 1
                    }
                },
                operationType: 0,
                operationName: "_MoveRoutingRuleItemAt"
            };
            return metadata;
        };
        return MoveRoutingRuleItemAt;
    }());
    RoutingRule.MoveRoutingRuleItemAt = MoveRoutingRuleItemAt;
})(RoutingRule || (RoutingRule = {}));
/// <reference path="../../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../../../../TypeDefinitions/RoutingRule/Localization/ResourceStringProvider.d.ts" />
/// <reference path="../ODataContracts/MoveRoutingRuleItemAt.ts" />
/// <reference path="Utility/Constants.ts" />
/// <reference path="DialogHelperMethods.ts" />
var RoutingRule;
(function (RoutingRule) {
    /** onclick,onload and onchange handlers on MoveRoutingRuleItem Dialog */
    var MoveRoutingRuleItemDialogHandlers = (function () {
        function MoveRoutingRuleItemDialogHandlers() {
            var _this = this;
            this.onLoadHandlerMoveRuleItem = function (context) {
                var formContext = context._formContext;
                var isBefore = RoutingRule.DialogHelperMethods.getDialogParameterValue(formContext, RoutingRule.MoveRuleItemParameters.param_IsMoveBefore);
                _this.setDialogTitleAndDescription(isBefore, formContext);
                _this.addCustomFilterForRuleItemLookup(formContext);
            };
            this.onChangeRuleItemSelector = function (context) {
                RoutingRule.DialogHelperMethods.enableOkayButtonOnValue(context, RoutingRule.MoveRuleItemDialogControls.ruleItemSelector);
            };
            this.onClickOkayButtonMoveRuleItem = function (context) {
                var formcontext = context._formContext;
                var targetRRitemId = _this.getRuleItemIdSelectedInDialog(formcontext);
                if (targetRRitemId == null) {
                    Xrm.Navigation.openErrorDialog({ message: RoutingRule.ResourceStringProvider.getResourceString("MISSING_RULEITEM_LOOKUPVALUE") });
                    return;
                }
                var rrSetId = RoutingRule.DialogHelperMethods.getDialogParameterValue(formcontext, RoutingRule.MoveRuleItemParameters.param_RoutingRuleId);
                rrSetId = rrSetId.substr(1, rrSetId.length - 2); // remove curly braces
                var ruleItemSelectedInGrid = RoutingRule.DialogHelperMethods.getDialogParameterValue(formcontext, RoutingRule.MoveRuleItemParameters.param_SelectedRuleItemId);
                var isBefore = RoutingRule.DialogHelperMethods.getDialogParameterValue(formcontext, RoutingRule.MoveRuleItemParameters.param_IsMoveBefore);
                var request = _this.generateMoveRoutingRuleItemRequestObject(rrSetId, ruleItemSelectedInGrid, targetRRitemId, isBefore);
                var progressMsg = RoutingRule.ResourceStringProvider.getResourceString("IN_PROGRESS_MESSAGE");
                Xrm.Utility.showProgressIndicator(progressMsg);
                Xrm.WebApi.online.execute(request).then(function (value) {
                    formcontext.data.attributes.get(RoutingRule.MoveRuleItemParameters.param_IsRefreshNeeded).setValue(true);
                    RoutingRule.DialogHelperMethods.closeProgessDialogAndMDD(formcontext);
                }, function (error) {
                    RoutingRule.DialogHelperMethods.closeProgessDialogAndMDD(formcontext);
                    RoutingRule.Utility.showErrorDialog(error);
                });
            };
            this.setDialogTitleAndDescription = function (isMoveBefore, formContext) {
                var title;
                var description;
                if (isMoveBefore) {
                    title = RoutingRule.ResourceStringProvider.getResourceString("MOVE_BEFORE_RULEITEM_DIALOG_TITLE");
                    description = RoutingRule.ResourceStringProvider.getResourceString("MOVE_BEFORE_RULEITEM_DIALOG_DESC");
                }
                else {
                    title = RoutingRule.ResourceStringProvider.getResourceString("MOVE_AFTER_RULEITEM_DIALOG_TITLE");
                    description = RoutingRule.ResourceStringProvider.getResourceString("MOVE_AFTER_RULEITEM_DIALOG_DESC");
                }
                var rrItemName = RoutingRule.DialogHelperMethods.getDialogParameterValue(formContext, RoutingRule.MoveRuleItemParameters.param_SelectedRuleItemName);
                description = description.replace("{0}", rrItemName);
                formContext.getControl(RoutingRule.MoveRuleItemDialogControls.formheader).setLabel(title);
                formContext.getControl(RoutingRule.MoveRuleItemDialogControls.description).setLabel(description);
            };
            this.addCustomFilterForRuleItemLookup = function (formContext) {
                var rrSetId = RoutingRule.DialogHelperMethods.getDialogParameterValue(formContext, RoutingRule.MoveRuleItemParameters.param_RoutingRuleId);
                var rrItemId = RoutingRule.DialogHelperMethods.getDialogParameterValue(formContext, RoutingRule.MoveRuleItemParameters.param_SelectedRuleItemId);
                // adding custom search filter to remove currently selected rule item
                // and also to filter rule items under the selected routing rule set.
                var fetchXmlFilter = RoutingRule.Constants.CustomFilterOnRuleItem.replace("{0}", rrSetId);
                fetchXmlFilter = fetchXmlFilter.replace("{1}", "{" + rrItemId + "}");
                var ruleItemLookup = formContext.getControl(RoutingRule.MoveRuleItemDialogControls.ruleItemSelector);
                RoutingRule.DialogHelperMethods.setDisablePropertiesOnLookup(ruleItemLookup);
                ruleItemLookup.addPreSearch(RoutingRule.DialogHelperMethods.addFilterForLookUp.bind(_this, fetchXmlFilter, "routingruleitem", ruleItemLookup));
            };
            this.generateMoveRoutingRuleItemRequestObject = function (routingRuleSetId, ruleItemIdSelectedInGrid, targetRuleItemId, isBefore) {
                var selectedRuleSet = {};
                selectedRuleSet["@odata.type"] = "Microsoft.Dynamics.CRM.routingrule";
                selectedRuleSet.routingruleid = routingRuleSetId;
                var ruleItemToBeMoved = {};
                ruleItemToBeMoved["@odata.type"] = "Microsoft.Dynamics.CRM.routingruleitem";
                ruleItemToBeMoved.routingruleitemid = ruleItemIdSelectedInGrid;
                var targetRuleItem = {};
                targetRuleItem["@odata.type"] = "Microsoft.Dynamics.CRM.routingruleitem";
                targetRuleItem.routingruleitemid = targetRuleItemId;
                return new RoutingRule.MoveRoutingRuleItemAt(selectedRuleSet, ruleItemToBeMoved, targetRuleItem, isBefore);
            };
            this.getRuleItemIdSelectedInDialog = function (formcontext) {
                var ruleItemLookup = formcontext.getControl(RoutingRule.MoveRuleItemDialogControls.ruleItemSelector);
                var ruleItemLookupValue = ruleItemLookup.getAttribute().getValue();
                if (ruleItemLookupValue.length != 1) {
                    return null;
                }
                var ruleItemIdSelectedInDialog = ruleItemLookupValue[0].id;
                ruleItemIdSelectedInDialog = ruleItemIdSelectedInDialog.substr(1, ruleItemIdSelectedInDialog.length - 2); // remove curly braces
                return ruleItemIdSelectedInDialog;
            };
        }
        return MoveRoutingRuleItemDialogHandlers;
    }());
    RoutingRule.MoveRoutingRuleItemDialogHandlers = MoveRoutingRuleItemDialogHandlers;
})(RoutingRule || (RoutingRule = {}));
/// <reference path="RoutingRuleSetSaveAsDialogHandlers.ts" />
/// <reference path="MoveRoutingRuleItemDialogHandlers.ts" />
var RoutingRule;
(function (RoutingRule) {
    /** Class that holds all dialog handlers for dialog opened from command bar action and sub grid action*/
    var DialogHandlers = (function () {
        function DialogHandlers() {
            this.MoveRuleItem = new RoutingRule.MoveRoutingRuleItemDialogHandlers();
            this.RoutingRuleSaveAs = new RoutingRule.RoutingRuleSetSaveAsDialogHandlers();
            this.onClickCancelButton = function (context) {
                var formcontext = context._formContext;
                if (formcontext.data.attributes.get("param_IsRefreshNeeded")) {
                    formcontext.data.attributes.get("param_IsRefreshNeeded").setValue(false);
                }
                formcontext.ui.close();
            };
        }
        return DialogHandlers;
    }());
    RoutingRule.DialogHandlers = DialogHandlers;
})(RoutingRule || (RoutingRule = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="UCI/RoutingRuleCommandBarActions.ts" />
///  <reference path="UCI/DialogHandlers/DialogHandlers.ts" />
var RoutingRule;
(function (RoutingRule) {
    var CommandBarActions = (function () {
        function CommandBarActions() {
        }
        return CommandBarActions;
    }());
    CommandBarActions.ctor = (function () {
        CommandBarActions.Instance = new RoutingRule.RoutingRuleCommandBarActions();
        CommandBarActions.DialogHandlers = new RoutingRule.DialogHandlers();
    })();
    RoutingRule.CommandBarActions = CommandBarActions;
})(RoutingRule || (RoutingRule = {}));
