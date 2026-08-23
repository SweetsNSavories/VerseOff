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
    'use strict';
    /* tslint:disable:crm-force-fields-private */
    var msdyn_RetrieveEnvironmentVariableValueForCS = (function () {
        function msdyn_RetrieveEnvironmentVariableValueForCS(msdyn_EnvironmentVariableName) {
            this.msdyn_EnvironmentVariableName = msdyn_EnvironmentVariableName;
        }
        msdyn_RetrieveEnvironmentVariableValueForCS.prototype.getMetadata = function () {
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
        return msdyn_RetrieveEnvironmentVariableValueForCS;
    }());
    ODataContract.msdyn_RetrieveEnvironmentVariableValueForCS = msdyn_RetrieveEnvironmentVariableValueForCS;
})(ODataContract || (ODataContract = {}));
var ODataContract;
(function (ODataContract) {
    'use strict';
    /* tslint:disable:crm-force-fields-private */
    var UpsertEnvironmentVariable = (function () {
        function UpsertEnvironmentVariable(SchemaName, Type, Value) {
            this.SchemaName = SchemaName;
            this.Type = Type;
            this.Value = Value;
        }
        UpsertEnvironmentVariable.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "",
                parameterTypes: {
                    SchemaName: {
                        typeName: 'Edm.String',
                        structuralProperty: 1
                    },
                    Type: {
                        typeName: 'Edm.Int32',
                        structuralProperty: 1
                    },
                    Value: {
                        typeName: 'Edm.String',
                        structuralProperty: 1
                    }
                },
                operationType: 0,
                operationName: 'UpsertEnvironmentVariable'
            };
            return metadata;
        };
        return UpsertEnvironmentVariable;
    }());
    ODataContract.UpsertEnvironmentVariable = UpsertEnvironmentVariable;
})(ODataContract || (ODataContract = {}));
/// <reference path="../../../TypeDefinitions/AutomaticRecordCreation/TypeDefinitions/XrmServiceWebClientApi.d.ts" />
/// <reference path="../../Common/DataContracts/RetrieveEnvironmentVariableValueForCS.ts" />
/// <reference path="../../Common/DataContracts/UpsertEnvironmentVariableRequest.ts" />
var ARC;
(function (ARC) {
    var stringParamType = 100000000;
    var ARCCommandBarActions = (function () {
        function ARCCommandBarActions() {
        }
        ARCCommandBarActions.IsModernRule = function () {
            if (Xrm.Page.data.entity.getId()) {
                return !!Xrm.Page.data.entity.attributes.getByName("convertruletype").getValue();
            }
            else {
                return true; // new rules created in UCI context are always modern rules
            }
        };
        ;
        ARCCommandBarActions.DisableControlsIfNotHavePermissions = function (context) {
            var _this = this;
            var fetchXML = "<fetch top=\"1\" distinct=\"true\" >\n                    <entity name=\"privilege\" >\n                        <attribute name=\"privilegeid\" />\n                        <filter type=\"and\" >\n                            <condition attribute=\"name\" operator=\"eq\" value=\"" + ARCCommandBarActions.modifyEnvironmentVariableDefinitionsPrivilegeName + "\" />\n                        </filter>\n                    </entity>\n                </fetch>";
            Xrm.WebApi.retrieveMultipleRecords("privilege", "?fetchXml=" + encodeURIComponent(fetchXML)).then(function (result) {
                if (result && result.entities && result.entities.length > 0 && result.entities[0]["privilegeid"]) {
                    var privilegeId = result.entities[0]["privilegeid"];
                    var userId = context.getFormContext().context.userSettings.userId.slice(1, -1);
                    _this.checkPrivilege(userId).then(function (result) {
                        if (result.RolePrivileges.length == 0) {
                            ARCCommandBarActions.DisableControls(context);
                        }
                    }).catch(function () {
                        ARCCommandBarActions.DisableControls(context);
                    });
                }
                else {
                    ARCCommandBarActions.DisableControls(context);
                }
            }, function () {
                ARCCommandBarActions.DisableControls(context);
            });
        };
        ARCCommandBarActions.DisableControls = function (context) {
            var formContext = context.getFormContext();
            formContext.getControl("toggleShowSuccesses").setDisabled(true);
            formContext.getControl("toggleShowFailures").setDisabled(true);
            formContext.getControl("toggleShowSkips").setDisabled(true);
            formContext.getControl("save_id").setDisabled(true);
        };
        ARCCommandBarActions.OpenFailedToSaveErrorNotification = function (context) {
            context.getFormContext().ui.close();
            var webResourceName = "AutomaticRecordCreation/Localization/Languages/AutomaticRecordCreation";
            var confirmStrings = {
                title: Xrm.Utility.getResourceString(webResourceName, "ActivityMonitorOptions_SaveError_title"),
                subtitle: Xrm.Utility.getResourceString(webResourceName, "ActivityMonitorOptions_SaveError_subtitle"),
                text: Xrm.Utility.getResourceString(webResourceName, "ActivityMonitorOptions_SaveError_text"),
                confirmButtonLabel: Xrm.Utility.getResourceString(webResourceName, "ActivityMonitorOptions_SaveError_confirmButton"),
                cancelButtonLabel: Xrm.Utility.getResourceString(webResourceName, "ActivityMonitorOptions_SaveError_cancelButton")
            };
            var confirmOptions = { height: 380, width: 550 };
            Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions)
                .then(function (success) {
                if (success.confirmed) {
                    ARCCommandBarActions.OpenMonitorOptionsDialog();
                }
            });
        };
        ARCCommandBarActions.OpenFailedToLoadErrorNotification = function (context) {
            context.getFormContext().ui.close();
            var webResourceName = "AutomaticRecordCreation/Localization/Languages/AutomaticRecordCreation";
            var confirmStrings = {
                title: Xrm.Utility.getResourceString(webResourceName, "ActivityMonitorOptions_LoadError_title"),
                subtitle: Xrm.Utility.getResourceString(webResourceName, "ActivityMonitorOptions_LoadError_subtitle"),
                text: Xrm.Utility.getResourceString(webResourceName, "ActivityMonitorOptions_LoadError_text"),
                confirmButtonLabel: Xrm.Utility.getResourceString(webResourceName, "ActivityMonitorOptions_LoadError_confirmButton"),
                cancelButtonLabel: Xrm.Utility.getResourceString(webResourceName, "ActivityMonitorOptions_LoadError_cancelButton")
            };
            var confirmOptions = { height: 380, width: 550 };
            Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions)
                .then(function (success) {
                if (success.confirmed) {
                    ARCCommandBarActions.OpenMonitorOptionsDialog();
                }
            });
        };
        ARCCommandBarActions.EnableRemoveButtonOnQueueSubgrid = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isMultiQueueWithQueueItemTriggerEnabled, convertruleid, exception_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, ARC.ARCMainSystemLibraryWebResource.isMultiQueueWithQueueItemTriggerEnabled()];
                        case 1:
                            isMultiQueueWithQueueItemTriggerEnabled = _a.sent();
                            if (isMultiQueueWithQueueItemTriggerEnabled) {
                                convertruleid = Xrm.Page.getAttribute("convertruleid");
                                if (convertruleid == null || convertruleid.getValue() == null) {
                                    return [2 /*return*/, true];
                                }
                                return [2 /*return*/, Xrm.WebApi.retrieveRecord('convertrule', convertruleid.getValue(), "?$select=statecode").then(function (convertrule) {
                                        if (convertrule != null) {
                                            if (convertrule.statecode === 1) {
                                                return false;
                                            }
                                        }
                                        return true;
                                    })];
                            }
                            else {
                                // If ECS is off, enable the remove button on queue subgrid.
                                return [2 /*return*/, true];
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            exception_1 = _a.sent();
                            console.log("ARCMainSystemLibraryWebResource::EnableActivateButtonOnConvertRuleFormRibbon:exception:" + exception_1);
                            return [2 /*return*/, true];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // Function to enable/disable the activate button on the Convert Rule form ribbon based on the state of the rule and the queue scope.
        ARCCommandBarActions.EnableActivateButtonOnConvertRuleFormRibbon = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isMultiQueueWithQueueItemTriggerEnabled_1, convertruleid, queueScope_1, exception_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, ARC.ARCMainSystemLibraryWebResource.isMultiQueueWithQueueItemTriggerEnabled()];
                        case 1:
                            isMultiQueueWithQueueItemTriggerEnabled_1 = _a.sent();
                            convertruleid = Xrm.Page.getAttribute("convertruleid").getValue();
                            queueScope_1 = Xrm.Page.getAttribute("queuescope");
                            return [2 /*return*/, Xrm.WebApi.retrieveRecord('convertrule', convertruleid, "?$select=statecode").then(function (convertrule) {
                                    // Disable the activate button on convert rule form ribbon for existing active convert rule.
                                    if (convertrule.statecode === 1) {
                                        return false;
                                    }
                                    if (!isMultiQueueWithQueueItemTriggerEnabled_1) {
                                        // Disable the activate button on convert rule form ribbon for active and inactive multi-queue rules when ECS is off.
                                        if (queueScope_1 != null && queueScope_1.getValue() != null && queueScope_1.getValue() == "1") {
                                            return false;
                                        }
                                    }
                                    return true;
                                })];
                        case 2:
                            exception_2 = _a.sent();
                            console.log("ARCMainSystemLibraryWebResource::EnableActivateButtonOnConvertRuleFormRibbon:exception:" + exception_2);
                            return [2 /*return*/, true];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // Function to enable/disable the activate button on the Convert Rule homepage view ribbon based on the state of the rule and the queue scope
        ARCCommandBarActions.EnableActivateButtonOnConvertRuleHomepageViewRibbon = function (selRecords) {
            return __awaiter(this, void 0, void 0, function () {
                var isMultiQueueWithQueueItemTriggerEnabled, index, convertrule, exception_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 6, , 7]);
                            return [4 /*yield*/, ARC.ARCMainSystemLibraryWebResource.isMultiQueueWithQueueItemTriggerEnabled()];
                        case 1:
                            isMultiQueueWithQueueItemTriggerEnabled = _a.sent();
                            index = 0;
                            _a.label = 2;
                        case 2:
                            if (!(index < selRecords.length)) return [3 /*break*/, 5];
                            return [4 /*yield*/, Xrm.WebApi.retrieveRecord('convertrule', selRecords[index].Id, "?$select=statecode, queuescope")];
                        case 3:
                            convertrule = _a.sent();
                            if (!isMultiQueueWithQueueItemTriggerEnabled) {
                                // Disable the activate button on convert rule homepage view ribbon for active and inactive multi-queue rules when ECS is off.
                                if (convertrule.queuescope != null && convertrule.queuescope == "1") {
                                    return [2 /*return*/, false];
                                }
                            }
                            _a.label = 4;
                        case 4:
                            index++;
                            return [3 /*break*/, 2];
                        case 5: return [2 /*return*/, true];
                        case 6:
                            exception_3 = _a.sent();
                            console.log("ARCMainSystemLibraryWebResource::EnableActivateButtonOnConvertRuleHomepageViewRibbon:exception:" + exception_3);
                            return [2 /*return*/, true];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        return ARCCommandBarActions;
    }());
    ARCCommandBarActions.FailEnvVarSchemaName = "msdyn_ArcActivityMonitorForFailedScenarios";
    ARCCommandBarActions.SkipEnvVarSchemaName = "msdyn_ArcActivityMonitorForSkippedScenarios";
    ARCCommandBarActions.SuccEnvVarSchemaName = "msdyn_ArcActivityMonitorForSuccessScenarios";
    ARCCommandBarActions.UciARCFormId = "2c8955c5-133b-423f-bb72-01880111bbfd";
    ARCCommandBarActions.LegacyARCFormId = "f54c3b3c-4385-41a2-b61e-35dee0b858db";
    ARCCommandBarActions.modifyEnvironmentVariableDefinitionsPrivilegeName = "prvWriteEnvironmentVariableDefinition";
    ARCCommandBarActions.IsRuleInactive = function (primaryItemId) {
        var statecode = Xrm.Page.data.entity.attributes.getByName("statecode");
        if (statecode) {
            return !statecode.getValue();
        }
        if (!primaryItemId) {
            return false;
        }
        return Xrm.WebApi.retrieveRecord('convertruleitem', primaryItemId, "?$select=_convertruleid_value").then(function (convertruleitem) {
            return Xrm.WebApi.retrieveRecord('convertrule', convertruleitem._convertruleid_value, "?$select=statecode").then(function (convertrule) {
                return !convertrule.statecode;
            });
        });
    };
    ARCCommandBarActions.isTopRowNotSelected = function (gridControl) {
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
        var pageNumber = ARCCommandBarActions.GetAttributeValueFromFetchXml(gridControl, "page");
        for (var index = 0; index < allRows.getLength(); index++) {
            var row = allRows.getByIndex(index);
            if (row !== null) {
                var rowEntity = row.getData().getEntity();
                if (rowEntity !== null) {
                    var currentRowId = rowEntity._entityId.guid;
                    if (currentRowId === selId) {
                        return (index !== 0 || pageNumber !== 1);
                    }
                }
            }
        }
    };
    ARCCommandBarActions.isBottomRowNotSelected = function (gridControl) {
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
        var totalRecCount = gridControl.getGrid().getTotalRecordCount();
        var pageNumber = ARCCommandBarActions.GetAttributeValueFromFetchXml(gridControl, "page");
        var recordCount = ARCCommandBarActions.GetAttributeValueFromFetchXml(gridControl, "count");
        for (var index = 0; index < allRows.getLength(); index++) {
            var row = allRows.getByIndex(index);
            if (row !== null) {
                var rowEntity = row.getData().getEntity();
                if (rowEntity !== null) {
                    var currentRowId = rowEntity._entityId.guid;
                    if (currentRowId === selId) {
                        return (totalRecCount > (pageNumber * recordCount) || allRows.getLength() - 1 !== index);
                    }
                }
            }
        }
    };
    ARCCommandBarActions.GetAttributeValueFromFetchXml = function (gridControl, attribute) {
        var xmlDocument = (new DOMParser()).parseFromString(gridControl.getFetchXml(), "text/xml");
        if (xmlDocument.documentElement.attributes != null && xmlDocument.documentElement.attributes.length > 0) {
            return parseInt(xmlDocument.documentElement.attributes.getNamedItem(attribute).nodeValue);
        }
    };
    ARCCommandBarActions.CreateNewRuleItemAsMFD = function (gridControl) {
        var convertruleId = Xrm.Page.data.entity.attributes.getByName("convertruleid").getValue();
        convertruleId = Array.isArray(convertruleId) ? convertruleId[0].id : convertruleId;
        var createFrom = { id: convertruleId, entityType: "convertrule" };
        var pageInput = {
            pageType: "entityrecord",
            entityName: "convertruleitem",
            createFromEntity: createFrom,
            formType: 2 /* Update */
        };
        var options = {
            entityName: "convertruleitem",
            showDialog: true,
            hideDialogHeader: true,
            target: 2,
            width: window.parent.innerWidth,
            height: 800,
            position: 2
        };
        Xrm.Navigation.navigateTo(pageInput, options).then(function (_) { return gridControl && gridControl.refresh && gridControl.refresh(); });
    };
    ARCCommandBarActions.EditRuleItemAsMFD = function (selectedRuleItems, gridControl) {
        var convertRuleItemId = selectedRuleItems[0].Id;
        var convertruleId = Xrm.Page.data.entity.attributes.getByName("convertruleid").getValue();
        convertruleId = Array.isArray(convertruleId) ? convertruleId[0].id : convertruleId;
        var createFrom = { id: convertruleId, entityType: "convertrule" };
        var pageInput = {
            pageType: "entityrecord",
            entityName: "convertruleitem",
            createFromEntity: createFrom,
            entityId: convertRuleItemId,
            formType: 2 /* Update */
        };
        var options = {
            entityName: "convertruleitem",
            showDialog: true,
            hideDialogHeader: true,
            target: 2,
            width: window.parent.innerWidth,
            height: 800,
            position: 2
        };
        Xrm.Navigation.navigateTo(pageInput, options).then(function (_) { return gridControl && gridControl.refresh && gridControl.refresh(); });
    };
    ARCCommandBarActions.OpenActivityMonitor = function () {
        var pageInput = {
            pageType: "entitylist",
            entityName: "activitymonitor"
        };
        Xrm.Navigation.navigateTo(pageInput);
    };
    ARCCommandBarActions.OpenActivityMonitorRecord = function (selectedAtivityMonitors, showInDialog) {
        var activityMonitorId = selectedAtivityMonitors[0].Id;
        var pageInput = {
            pageType: "entityrecord",
            entityName: "activitymonitor",
            entityId: activityMonitorId,
            formType: 2 /* Update */
        };
        var options = {};
        if (!!showInDialog) {
            options = {
                entityName: "activitymonitor",
                showDialog: true,
                hideDialogHeader: true,
                target: 2,
                width: window.parent.innerWidth,
                height: 800,
                position: 2
            };
        }
        Xrm.Navigation.navigateTo(pageInput, options);
    };
    ARCCommandBarActions.OpenAutomaticRecordCreation = function () {
        var pageInput = {
            pageType: "entitylist",
            entityName: "convertrule"
        };
        Xrm.Navigation.navigateTo(pageInput);
    };
    ARCCommandBarActions.OpenMonitorOptionsDialog = function () {
        var dialogOptions = {
            width: 550,
            height: 380,
            position: 1 /* center */
        };
        // Can perhaps use to auto-set the checkboxes to what the environment variables actually are?
        var dialogParams = {};
        Xrm.Navigation.openDialog("ActivityMonitorOptionsDialog", dialogOptions, dialogParams);
    };
    ARCCommandBarActions.checkPrivilege = function (userId) {
        return new Promise(function (resolve, reject) {
            var url = Xrm.Page.context.getClientUrl();
            var res;
            var req = new XMLHttpRequest();
            req.open("GET", url + "/api/data/v9.0/systemusers(" + userId + ")/Microsoft.Dynamics.CRM.RetrieveUserPrivilegeByPrivilegeName(PrivilegeName='prvWriteEnvironmentVariableDefinition')");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    req.onreadystatechange = null;
                    if (this.status == 200 || this.status == 204) {
                        res = JSON.parse(this.response);
                        resolve(res);
                    }
                    else {
                        reject();
                    }
                }
            };
            req.send(window.JSON.stringify());
        });
    };
    ARCCommandBarActions.OnMonitorOptionsDialogLoad = function (context) {
        // Check if user has permissions and disable toggles if not.
        ARCCommandBarActions.DisableControlsIfNotHavePermissions(context);
        ARCCommandBarActions.GetEnvironmentVariables().then(function (envVarResponses) {
            var failResponse = envVarResponses[0];
            var skipResponse = envVarResponses[1];
            var succResponse = envVarResponses[2];
            failResponse.json().then(function (jsonResponse) {
                var failOffOrOn = jsonResponse.msdyn_EnvironmentVariableValue;
                Xrm.Page.data.attributes.get("toggleShowFailures").setValueInternal(failOffOrOn);
            });
            skipResponse.json().then(function (jsonResponse) {
                var skipOffOrOn = jsonResponse.msdyn_EnvironmentVariableValue;
                Xrm.Page.data.attributes.get("toggleShowSkips").setValueInternal(skipOffOrOn);
            });
            succResponse.json().then(function (jsonResponse) {
                var succOffOrOn = jsonResponse.msdyn_EnvironmentVariableValue;
                Xrm.Page.data.attributes.get("toggleShowSuccesses").setValueInternal(succOffOrOn);
            });
        }, function () {
            ARCCommandBarActions.OpenFailedToLoadErrorNotification(context);
        });
    };
    ARCCommandBarActions.OnMonitorOptionsDialogCancel = function (context) {
        context.getFormContext().ui.close();
    };
    ARCCommandBarActions.OnMonitorOptionsDialogSave = function (context) {
        var toggleShowSuccessesValue = Xrm.Page.data.attributes.get("toggleShowSuccesses").getValue() ? "1" : "0";
        var toggleShowFailuresValue = Xrm.Page.data.attributes.get("toggleShowFailures").getValue() ? "1" : "0";
        var toggleShowSkipsValue = Xrm.Page.data.attributes.get("toggleShowSkips").getValue() ? "1" : "0";
        ARCCommandBarActions.UpdateOrCreateEnvVariableValues(toggleShowSuccessesValue, toggleShowFailuresValue, toggleShowSkipsValue, context);
        context.getFormContext().ui.close();
    };
    ARCCommandBarActions.UpdateOrCreateEnvVariableValues = function (succValue, failValue, skipValue, context) {
        ARCCommandBarActions.GetEnvironmentVariables().then(function (envVars) {
            var failResponse = envVars[0];
            var skipResponse = envVars[1];
            var succResponse = envVars[2];
            failResponse.json().then(function (jsonResponse) {
                ARCCommandBarActions.UpdateOrCreateEnvVariableValuesHelper(ARCCommandBarActions.FailEnvVarSchemaName, jsonResponse.msdyn_EnvironmentVariableValue, failValue);
            });
            skipResponse.json().then(function (jsonResponse) {
                ARCCommandBarActions.UpdateOrCreateEnvVariableValuesHelper(ARCCommandBarActions.SkipEnvVarSchemaName, jsonResponse.msdyn_EnvironmentVariableValue, skipValue);
            });
            succResponse.json().then(function (jsonResponse) {
                ARCCommandBarActions.UpdateOrCreateEnvVariableValuesHelper(ARCCommandBarActions.SuccEnvVarSchemaName, jsonResponse.msdyn_EnvironmentVariableValue, succValue);
            });
        }, function () {
            ARCCommandBarActions.OpenFailedToSaveErrorNotification(context);
        });
    };
    ARCCommandBarActions.UpdateOrCreateEnvVariableValuesHelper = function (envVarName, currEnvVarValue, newEnvVarValue) {
        var upsertEnvVarRequest = new ODataContract.UpsertEnvironmentVariable(envVarName, stringParamType, newEnvVarValue);
        Xrm.WebApi.online.execute(upsertEnvVarRequest);
    };
    /**
     * @returns A promise of a list of the three monitor option environment variables, in alphabetic order (failed, skipped, success)
     * Each entity has defaultvalue, schemaname, environmentvariabledefinitionid, and possibly variableValueId and variableValue
     **/
    ARCCommandBarActions.GetEnvironmentVariables = function () {
        var failedScenarioEnvVarValueRequest = new ODataContract.msdyn_RetrieveEnvironmentVariableValueForCS(ARCCommandBarActions.FailEnvVarSchemaName);
        var skippedScenarioEnvVarValueRequest = new ODataContract.msdyn_RetrieveEnvironmentVariableValueForCS(ARCCommandBarActions.SkipEnvVarSchemaName);
        var successScenarioEnvVarValueRequest = new ODataContract.msdyn_RetrieveEnvironmentVariableValueForCS(ARCCommandBarActions.SuccEnvVarSchemaName);
        return Xrm.WebApi.online.executeMultiple([failedScenarioEnvVarValueRequest, skippedScenarioEnvVarValueRequest, successScenarioEnvVarValueRequest]);
    };
    ARCCommandBarActions.CancelRuleItem = function () {
        Xrm.Page.ui.close();
    };
    ARCCommandBarActions.CloseActivityMonitor = function () {
        Xrm.Page.ui.close();
    };
    ARCCommandBarActions.OpenRecord = function (entityTypeCode, gridControl) {
        var formOptions;
        if (entityTypeCode == 'convertrule') {
            if (Xrm.Internal.isUci()) {
                formOptions = {
                    entityName: entityTypeCode,
                    formId: ARCCommandBarActions.UciARCFormId,
                    entityId: ''
                };
            }
            else {
                formOptions = {
                    entityName: entityTypeCode,
                    formId: ARCCommandBarActions.LegacyARCFormId,
                    entityId: ''
                };
            }
            Xrm.Navigation.openForm(formOptions);
        }
        return;
    };
    ARCCommandBarActions.MoveRecordUp = function (gridEntityName, gridControl, selRecords) {
        ARCCommandBarActions.MoveRecordHelper(gridEntityName, gridControl, selRecords, -1);
    };
    ARCCommandBarActions.MoveRecordDown = function (gridEntityName, gridControl, selRecords) {
        ARCCommandBarActions.MoveRecordHelper(gridEntityName, gridControl, selRecords, 1);
    };
    ARCCommandBarActions.MoveRecordHelper = function (gridEntityName, gridControl, selRecords, targetIndexDirection) {
        var startIndex = gridControl.getFetchXml().indexOf("order attribute");
        var endIndex = gridControl.getFetchXml().indexOf("descending");
        var subString = gridControl.getFetchXml().substring(startIndex, endIndex);
        if (subString.indexOf("sequencenumber") == -1) {
            Xrm.Navigation.openAlertDialog({
                text: "Unable to move record as grid is in sort mode. Refresh the grid and try again" //todo: replace actual string
            });
        }
        else {
            var selRows_1 = [];
            var targetRows_1 = [];
            var allRows = gridControl.getGrid().getRows();
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
            var selectedIndex_1 = -1;
            for (var index = 0; index < allRows.getLength(); index++) {
                var currentRowId = allRows.getByIndex(index).getData().getEntity()._entityId.guid;
                if (currentRowId === selRecords[0].Id) {
                    selectedIndex_1 = index;
                }
            }
            var targetSequenceNumber = 0;
            if (allRows.getLength() === selectedIndex_1 + targetIndexDirection || selectedIndex_1 + targetIndexDirection === -1) {
                var convertRuleId = Xrm.Page.getAttribute("convertruleid").getValue();
                var fetchXml = "<fetch>\n                        <entity name=\"convertruleitem\">\n                            <attribute name=\"name\" />\n                            <attribute name=\"convertruleitemid\" />\n                            <attribute name=\"sequencenumber\" />\n                            <order attribute=\"sequencenumber\" descending=\"false\" />\n                            <filter type=\"and\">\n                                <condition attribute=\"convertruleid\" operator=\"eq\" uitype=\"convertrule\" value=\"" + convertRuleId + "\" />\n                            </filter>\n                        </entity></fetch>";
                Xrm.WebApi.retrieveMultipleRecords("convertruleitem", "?fetchXml=" + encodeURIComponent(fetchXml)).then(function (result) {
                    selRows_1.push(allRows.getByIndex(selectedIndex_1).getData().getEntity()._entityId.guid);
                    var pageNumber = ARCCommandBarActions.GetAttributeValueFromFetchXml(gridControl, "page");
                    var recordCount = ARCCommandBarActions.GetAttributeValueFromFetchXml(gridControl, "count");
                    if (targetIndexDirection === -1) {
                        selectedIndex_1 = ((pageNumber - 1) * recordCount) + targetIndexDirection;
                    }
                    else {
                        selectedIndex_1 = pageNumber * recordCount;
                    }
                    targetRows_1.push(result.entities[selectedIndex_1]["convertruleitemid"]);
                    targetSequenceNumber = result.entities[selectedIndex_1]["sequencenumber"];
                    ARCCommandBarActions.UpdateSequenceNumber(gridEntityName, gridControl, selRows_1, targetRows_1, selSequenceNumber_1, targetSequenceNumber);
                });
            }
            else {
                var targetRow = allRows.getByIndex(selectedIndex_1 + targetIndexDirection);
                targetSequenceNumber = targetRow.getData().getEntity().attributes.getByName("sequencenumber").getValue();
                allRows.forEach(function (row, i) {
                    var rowEntity = row.getData().getEntity();
                    if (rowEntity !== null) {
                        var currentRowId = rowEntity._entityId.guid;
                        var currentRowSeqNumber = rowEntity.attributes.getByName("sequencenumber").getValue();
                        if (currentRowSeqNumber == selSequenceNumber_1) {
                            selRows_1.push(currentRowId);
                        }
                        else if (currentRowSeqNumber === targetSequenceNumber) {
                            targetRows_1.push(currentRowId);
                        }
                    }
                });
                ARCCommandBarActions.UpdateSequenceNumber(gridEntityName, gridControl, selRows_1, targetRows_1, selSequenceNumber_1, targetSequenceNumber);
            }
        }
    };
    ARCCommandBarActions.UpdateSequenceNumber = function (gridEntityName, gridControl, sourceRows, targetRows, selSequenceNumber, targetSequenceNumber) {
        if (sourceRows.length > 0 && targetRows.length > 0) {
            sourceRows.forEach(function (recId) {
                Xrm.WebApi.online.updateRecord(gridEntityName, recId, { sequencenumber: targetSequenceNumber }).then(function () {
                    targetRows.forEach(function (recId) {
                        Xrm.WebApi.online.updateRecord(gridEntityName, recId, { sequencenumber: selSequenceNumber }).then(function () {
                            gridControl.refresh();
                        });
                    });
                });
            });
        }
    };
    ARC.ARCCommandBarActions = ARCCommandBarActions;
})(ARC || (ARC = {}));
var ARC;
(function (ARC) {
    var ARCRuleItemMainSystemLibrary = (function () {
        function ARCRuleItemMainSystemLibrary() {
        }
        ;
        return ARCRuleItemMainSystemLibrary;
    }());
    ARCRuleItemMainSystemLibrary.ArcPrimaryCreateControlId = "arc_primary_create_control";
    ARCRuleItemMainSystemLibrary.isModernRule = true;
    ARCRuleItemMainSystemLibrary.RuleItemForm_onload = function () {
        Xrm.Page.getControl("arc_condition_config_control").setVisible(true);
        var convertruleid = Xrm.Page.getAttribute("convertruleid").getValue();
        var isNewRuleItem = !Xrm.Page.data.entity.getId();
        if (!isNewRuleItem) {
            Xrm.Page.getControl(ARCRuleItemMainSystemLibrary.ArcPrimaryCreateControlId).setDisabled(true);
        }
        return Xrm.WebApi.retrieveRecord('convertrule', convertruleid[0].id, "?$select=convertruletype,statecode").then(function (convertrule) {
            if (convertrule.statecode === 1) {
                ARC.ARCMainSystemLibraryWebResource.changeDisableAllControls(true);
            }
            if (!convertrule.hasOwnProperty("convertruletype") || !convertrule.convertruletype) {
                ARCRuleItemMainSystemLibrary.isModernRule = false;
                ARC.ARCMainSystemLibraryWebResource.changeDisableAllControls(true);
                Xrm.Page.ui.tabs.getByName("ConditionBuilder").sections.get("Actions_To_Take").setVisible(false);
            }
        });
    };
    ARCRuleItemMainSystemLibrary.Form_convertruleitemNameOnChange = function () {
        var name = Xrm.Page.getAttribute("name").getValue();
        if (name && name.length < 3) {
            Xrm.Page.getControl("name").setNotification(ARC.ResourceStringProvider.getResourceString("Name_Length_Error"));
        }
        else {
            Xrm.Page.getControl("name").clearNotification();
        }
    };
    ARCRuleItemMainSystemLibrary.RuleItemForm_onsave = function () {
        Xrm.Page.getControl(ARCRuleItemMainSystemLibrary.ArcPrimaryCreateControlId).setDisabled(true);
        if (!Xrm.Internal.isUci() || !ARCRuleItemMainSystemLibrary.isModernRule) {
            return Promise.reject(undefined);
        }
        else {
            var nameControl = Xrm.Page.getControl("name");
            var name_1 = nameControl.getValue();
            if (name_1 && name_1.length < 3) {
                nameControl.setNotification(ARC.ResourceStringProvider.getResourceString("Name_Length_Error"));
                return Promise.reject(undefined);
            }
        }
    };
    ARC.ARCRuleItemMainSystemLibrary = ARCRuleItemMainSystemLibrary;
})(ARC || (ARC = {}));
/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
var Mscrm;
(function (Mscrm) {
    var SharedUtils;
    (function (SharedUtils_1) {
        var SharedUtils = (function () {
            function SharedUtils() {
            }
            SharedUtils.rawGuidToFormattedGuid = function (rawGuid) {
                return rawGuid.substr(0, 8) + "-" + rawGuid.substr(8, 4) + "-" + rawGuid.substr(12, 4) + "-" + rawGuid.substr(16, 4) + "-" + rawGuid.substr(20);
            };
            SharedUtils.initializeLockedSourceOrPrimaryEntityOptionSet = function (entityName, rawGuid, attributeName) {
                return Xrm.WebApi.retrieveRecord(entityName, SharedUtils.rawGuidToFormattedGuid(rawGuid), "?$select=" + attributeName).then(function (entity) {
                    var logicalName = entityName == "convertrule" ? entity.sourcechanneltypecode : entity.primarycreateentitylogicalname;
                    if (logicalName) {
                        var retrieveDisplayNameUri = Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.0/EntityDefinitions(LogicalName='" + logicalName + "')" + "?$select=DisplayName,ObjectTypeCode";
                        return window.fetch(retrieveDisplayNameUri).then(function (retrieveDisplayNameResult) {
                            return retrieveDisplayNameResult.json().then(function (retrieveDisplayNameResponse) {
                                return {
                                    Value: retrieveDisplayNameResponse.ObjectTypeCode,
                                    Label: retrieveDisplayNameResponse.DisplayName.UserLocalizedLabel.Label
                                };
                            });
                        });
                    }
                    else {
                        return undefined;
                    }
                });
            };
            SharedUtils.getOrganizationGeo = function () {
                var organizationGeoName = "";
                var organizationSettings = null;
                var xrm = window.Xrm;
                if (xrm && xrm.Utility && xrm.Utility.getGlobalContext()) {
                    organizationSettings = xrm.Utility.getGlobalContext().organizationSettings;
                }
                if (organizationSettings) {
                    organizationGeoName = organizationSettings.organizationGeo;
                    if (organizationGeoName && organizationGeoName.toUpperCase() === "NA") {
                        organizationGeoName = organizationSettings.isSovereignCloud ? "GCC" : organizationGeoName;
                    }
                }
                return organizationGeoName;
            };
            SharedUtils.getMSDocsRedirectBaseURL = function () {
                var currentGeo = this.getOrganizationGeo();
                var docBaseURL = currentGeo === "USR" ? "https://aka.microsoft.scloud" :
                    currentGeo === "USE" ? "https://aka.eaglex.ic.gov" :
                        "https://go.microsoft.com";
                return docBaseURL;
            };
            return SharedUtils;
        }());
        SharedUtils_1.SharedUtils = SharedUtils;
    })(SharedUtils = Mscrm.SharedUtils || (Mscrm.SharedUtils = {}));
})(Mscrm || (Mscrm = {}));
/// <reference path="../../../TypeDefinitions/AutomaticRecordCreation/Localization/ResourceStringProvider.d.ts" />
/// <reference path="../Controls/Shared/SharedUtils.ts" />
var ARC;
(function (ARC) {
    var WebClientDeprecationState;
    (function (WebClientDeprecationState) {
        WebClientDeprecationState[WebClientDeprecationState["YetToShow"] = 0] = "YetToShow";
        WebClientDeprecationState[WebClientDeprecationState["YetToAcknowledge"] = 1] = "YetToAcknowledge";
        WebClientDeprecationState[WebClientDeprecationState["Acknowledged"] = 2] = "Acknowledged";
        WebClientDeprecationState[WebClientDeprecationState["Canceled"] = 3] = "Canceled";
    })(WebClientDeprecationState = ARC.WebClientDeprecationState || (ARC.WebClientDeprecationState = {}));
    /**
    * Legacy ARC Deprecation Actions - Web Client
    */
    var ARCWebClientDeprecationAckDialog = (function () {
        function ARCWebClientDeprecationAckDialog() {
        }
        /**
        * Callback for loading the dialog
        */
        ARCWebClientDeprecationAckDialog.onLoadAcknowledgeDialog = function () {
            var descriptionControl = Xrm.Page.getControl(ARCWebClientDeprecationAckDialog._description);
            var notificationMessage = ARC.ResourceStringProvider.getResourceString(ARCWebClientDeprecationAckDialog._webClientDeprecationNotificationResourceName);
            notificationMessage = notificationMessage.replace("{0}", ARCWebClientDeprecationAckDialog._migrationLink);
            descriptionControl.setLabel(notificationMessage);
        };
        /**
        * Callback clicking the create button
        */
        ARCWebClientDeprecationAckDialog.acknowledgeClick = function () {
            ARCWebClientDeprecationAckDialog.setEnvironmentVariableValue(ARCWebClientDeprecationAckDialog._environmentVariableSchemaName, ARCWebClientDeprecationAckDialog._environmentVariableDisplayName, WebClientDeprecationState.Acknowledged.toString()).then(function () {
                Xrm.Page.ui.close();
            });
        };
        ;
        /**
        * Callback clicking the create button
        */
        ARCWebClientDeprecationAckDialog.cancelClick = function () {
            ARCWebClientDeprecationAckDialog.setEnvironmentVariableValue(ARCWebClientDeprecationAckDialog._environmentVariableSchemaName, ARCWebClientDeprecationAckDialog._environmentVariableDisplayName, WebClientDeprecationState.Canceled.toString()).then(function () {
                Xrm.Page.ui.close();
            });
        };
        ;
        /**
         * Getting environment variable value
         */
        ARCWebClientDeprecationAckDialog.getEnvironmentVariableValue = function (schemaName) {
            return __awaiter(this, void 0, void 0, function () {
                var envVaribleValue, envVaribaleDefinition, envVaribleDefinitionEntity;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            envVaribleValue = null;
                            return [4 /*yield*/, Xrm.WebApi.retrieveMultipleRecords("environmentvariabledefinition", "?$top=1" +
                                    "&$select=environmentvariabledefinitionid,defaultvalue" +
                                    "&$expand=environmentvariabledefinition_environmentvariablevalue($select=value)" +
                                    ("&$filter=schemaname eq '" + schemaName + "'"))];
                        case 1:
                            envVaribaleDefinition = _a.sent();
                            if (envVaribaleDefinition && envVaribaleDefinition.entities && envVaribaleDefinition.entities.length > 0) {
                                envVaribleDefinitionEntity = envVaribaleDefinition.entities[0];
                                // Use the default value only if no related values
                                envVaribleValue = envVaribleDefinitionEntity.defaultvalue;
                                // Get the related value if provided
                                if (envVaribleDefinitionEntity.environmentvariabledefinition_environmentvariablevalue.length > 0) {
                                    envVaribleValue = envVaribleDefinitionEntity.environmentvariabledefinition_environmentvariablevalue[0].value;
                                }
                            }
                            return [2 /*return*/, envVaribleValue];
                    }
                });
            });
        };
        /**
         * Creating\Setting environment variable value
         */
        ARCWebClientDeprecationAckDialog.setEnvironmentVariableValue = function (schemaName, displayName, value) {
            return __awaiter(this, void 0, void 0, function () {
                var envVariableDefinition, envVaribleDefinitionEntity, definitionId, valueId, attributes, attributes;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Xrm.WebApi.retrieveMultipleRecords("environmentvariabledefinition", "?$top=1" +
                                "&$select=environmentvariabledefinitionid" +
                                "&$expand=environmentvariabledefinition_environmentvariablevalue($select=environmentvariablevalueid)" +
                                ("&$filter=schemaname eq '" + schemaName + "'"))];
                        case 1:
                            envVariableDefinition = _a.sent();
                            if (!(envVariableDefinition && envVariableDefinition.entities && envVariableDefinition.entities.length > 0)) return [3 /*break*/, 6];
                            envVaribleDefinitionEntity = envVariableDefinition.entities[0];
                            definitionId = envVaribleDefinitionEntity.environmentvariabledefinitionid;
                            if (!(envVaribleDefinitionEntity.environmentvariabledefinition_environmentvariablevalue.length > 0)) return [3 /*break*/, 3];
                            valueId = envVaribleDefinitionEntity.environmentvariabledefinition_environmentvariablevalue[0].environmentvariablevalueid;
                            return [4 /*yield*/, Xrm.WebApi.updateRecord("environmentvariablevalue", valueId, { "value": value })];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 3:
                            attributes = {
                                "value": value,
                                "EnvironmentVariableDefinitionId@odata.bind": "/environmentvariabledefinitions(" + definitionId + ")"
                            };
                            return [4 /*yield*/, Xrm.WebApi.createRecord("environmentvariablevalue", attributes)];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [3 /*break*/, 8];
                        case 6:
                            attributes = {
                                "schemaname": schemaName,
                                "displayname": displayName,
                                "environmentvariabledefinition_environmentvariablevalue": [
                                    {
                                        "value": value
                                    }
                                ]
                            };
                            return [4 /*yield*/, Xrm.WebApi.createRecord("environmentvariabledefinition", attributes)];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        ARCWebClientDeprecationAckDialog.isUserHasSystemAdminRole = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isAdminUser_1, userSettings, fetchXml, exception_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            isAdminUser_1 = false;
                            userSettings = Xrm.Utility.getGlobalContext().userSettings;
                            fetchXml = ARCWebClientDeprecationAckDialog.FETCHXML_USER_ROLE_TEMPLATE_ID.replace(/\{0}/g, userSettings.userId);
                            fetchXml = fetchXml.replace(/[\t\n]/gm, "");
                            return [4 /*yield*/, Xrm.WebApi.retrieveMultipleRecords("role", "?fetchXml=" + fetchXml).then(function success(result) {
                                    if (result.entities.length > 0) {
                                        if (!!result.entities.find(function (entity) { return entity._roletemplateid_value === ARCWebClientDeprecationAckDialog._sysAdminRoleTemplateId || entity._roletemplateid_value === ARCWebClientDeprecationAckDialog._sysAdminRoleTemplateId.toLowerCase(); })) {
                                            isAdminUser_1 = true;
                                        }
                                    }
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, isAdminUser_1];
                        case 2:
                            exception_4 = _a.sent();
                            console.log("ARCWebClientDeprecationAckDialog::isUserHasSystemAdminRole:exception:" + exception_4);
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return ARCWebClientDeprecationAckDialog;
    }());
    ARCWebClientDeprecationAckDialog._description = "description_id";
    ARCWebClientDeprecationAckDialog._sysAdminRoleTemplateId = "627090FF-40A3-4053-8790-584EDC5BE201";
    ARCWebClientDeprecationAckDialog._webClientDeprecationNotificationResourceName = "WebClientDeprecationNotification";
    ARCWebClientDeprecationAckDialog._migrationLink = Mscrm.SharedUtils.SharedUtils.getMSDocsRedirectBaseURL() + "/fwlink/p/?linkid=2198689";
    ARCWebClientDeprecationAckDialog._environmentVariableSchemaName = "msdyn_ArcWebClientDeprecationAcknowledge";
    ARCWebClientDeprecationAckDialog._environmentVariableDisplayName = "ARC Web Client Deprecation Acknowledge";
    ARCWebClientDeprecationAckDialog.FETCHXML_USER_ROLE_TEMPLATE_ID = "<fetch version='1.0' distinct='false' no-lock='false' mapping='logical'>\n\t\t\t\t<entity name='role'>\n\t\t\t\t\t<attribute name='roletemplateid' />\n\t\t\t\t\t<link-entity name='systemuserroles' to='roleid' from='roleid' link-type='inner'>\n\t\t\t\t\t\t<filter type='and'>\n\t\t\t\t\t\t\t<condition attribute='systemuserid' operator= 'eq' value='{0}' />\n\t\t\t\t\t\t</filter>\n\t\t\t\t\t</link-entity>\n\t\t\t\t</entity>\n\t\t\t</fetch>";
    ARC.ARCWebClientDeprecationAckDialog = ARCWebClientDeprecationAckDialog;
})(ARC || (ARC = {}));
var ARC;
(function (ARC) {
    var Constants = (function () {
        function Constants() {
        }
        return Constants;
    }());
    Constants._activityMonitorRecommendationFCSNamespace = "CS.AutomaticRecordCreationBase";
    Constants._activityMonitorRecommendationFCSKey = "EnableActivityMonitorRecommendation";
    Constants._generalTabName = "General";
    Constants._actionsSectionName = "Actions";
    ARC.Constants = Constants;
})(ARC || (ARC = {}));
/// <reference path="./Constants.ts" />
var ARC;
(function (ARC) {
    var ARCActivityMonitorMainSystemLibrary = (function () {
        function ARCActivityMonitorMainSystemLibrary() {
        }
        ;
        return ARCActivityMonitorMainSystemLibrary;
    }());
    ARCActivityMonitorMainSystemLibrary.Form_onload = function () {
        var activityMonitorRecommendation_FCS = Xrm.Utility.getGlobalContext().getFeatureControlSetting(ARC.Constants._activityMonitorRecommendationFCSNamespace, ARC.Constants._activityMonitorRecommendationFCSKey);
        // show 'Actions' tab when activity monitor recommendation FCS is true.
        if (activityMonitorRecommendation_FCS === true) {
            var GeneralTabSections = Xrm.Page.ui.tabs.getByName(ARC.Constants._generalTabName).sections;
            GeneralTabSections.getByName(ARC.Constants._actionsSectionName).setVisible(true);
        }
    };
    ARC.ARCActivityMonitorMainSystemLibrary = ARCActivityMonitorMainSystemLibrary;
})(ARC || (ARC = {}));
/// <reference path="../../../TypeDefinitions/AutomaticRecordCreation/Localization/ResourceStringProvider.d.ts" />
/// <reference path="ARCCommandBarActions.ts" />
/// <reference path="ARCRuleItemMainSystemLibrary.ts" />
/// <reference path="ARCWebClientDeprecationAckDialog.ts" />
/// <reference path="ARCActivityMonitorMainSystemLibrary.ts" />
/// <reference path="../Controls/Shared/SharedUtils.ts" />
var ARC;
(function (ARC) {
    var _this = this;
    var Email = 2;
    var ARCMainSystemLibraryWebResource = (function () {
        function ARCMainSystemLibraryWebResource() {
        }
        ;
        ARCMainSystemLibraryWebResource.focusOnTab = function () {
            var formContext = Xrm.Page.ui.formContext;
            var getTabName = formContext.data.attributes.get("tab_name");
            var setTab = null;
            if (getTabName != undefined) {
                setTab = getTabName.getValue();
            }
            // Focus on query string parameter tab
            if (setTab != null && formContext.ui.tabs.get(setTab) != null) {
                formContext.ui.tabs.get(setTab).setFocus();
            }
        };
        ARCMainSystemLibraryWebResource.showWebClientDeprecationAckDialog = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    Xrm.WebApi.retrieveMultipleRecords("convertrule", "?$top=1&$filter=convertruletype ne true and statecode eq 1").then(function succeeded(response) {
                        return __awaiter(this, void 0, void 0, function () {
                            var isUserHasSystemAdminRole, envVariableValue, dialogOptions, exception_5;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(response && response.entities.length > 0)) return [3 /*break*/, 6];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 5, , 6]);
                                        return [4 /*yield*/, ARC.ARCWebClientDeprecationAckDialog.isUserHasSystemAdminRole()];
                                    case 2:
                                        isUserHasSystemAdminRole = _a.sent();
                                        if (!isUserHasSystemAdminRole) return [3 /*break*/, 4];
                                        return [4 /*yield*/, ARC.ARCWebClientDeprecationAckDialog.getEnvironmentVariableValue(ARC.ARCWebClientDeprecationAckDialog._environmentVariableSchemaName)];
                                    case 3:
                                        envVariableValue = _a.sent();
                                        if (envVariableValue != ARC.WebClientDeprecationState.Acknowledged) {
                                            if (envVariableValue != ARC.WebClientDeprecationState.Canceled) {
                                                ARC.ARCWebClientDeprecationAckDialog.setEnvironmentVariableValue(ARC.ARCWebClientDeprecationAckDialog._environmentVariableSchemaName, ARC.ARCWebClientDeprecationAckDialog._environmentVariableDisplayName, ARC.WebClientDeprecationState.YetToAcknowledge.toString());
                                            }
                                            dialogOptions = {
                                                height: 200,
                                                width: 600
                                            };
                                            Xrm.Dialog.openDialog("ARCWebClientDeprecationAckDialog", dialogOptions, null, null, null);
                                        }
                                        _a.label = 4;
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        exception_5 = _a.sent();
                                        console.log("ARCMainSystemLibraryWebResource::showWebClientDeprecationAckDialog:exception:" + exception_5);
                                        return [3 /*break*/, 6];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        });
                    }, function (error) {
                        console.log("ARCMainSystemLibraryWebResource::showWebClientDeprecationAckDialog:exception:" + error);
                    });
                    return [2 /*return*/];
                });
            });
        };
        //Xrm.Dialog.openDialog doesn't exist in UCI
        ARCMainSystemLibraryWebResource.showWebClientDeprecationAckDialogUCI = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    Xrm.WebApi.retrieveMultipleRecords("convertrule", "?$top=1&$filter=convertruletype ne true and statecode eq 1").then(function succeeded(response) {
                        return __awaiter(this, void 0, void 0, function () {
                            var isUserHasSystemAdminRole, envVariableValue, navigationOptions, pageInput, exception_6;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(response && response.entities.length > 0)) return [3 /*break*/, 6];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 5, , 6]);
                                        return [4 /*yield*/, ARC.ARCWebClientDeprecationAckDialog.isUserHasSystemAdminRole()];
                                    case 2:
                                        isUserHasSystemAdminRole = _a.sent();
                                        if (!isUserHasSystemAdminRole) return [3 /*break*/, 4];
                                        return [4 /*yield*/, ARC.ARCWebClientDeprecationAckDialog.getEnvironmentVariableValue(ARC.ARCWebClientDeprecationAckDialog._environmentVariableSchemaName)];
                                    case 3:
                                        envVariableValue = _a.sent();
                                        if (envVariableValue != ARC.WebClientDeprecationState.Acknowledged) {
                                            navigationOptions = {
                                                target: 2,
                                                position: 1,
                                                width: { value: 600, unit: "px" },
                                                height: { value: 200, unit: "px" }
                                            };
                                            pageInput = {
                                                pageType: "webresource",
                                                webresourceName: "AutomaticRecordCreation/ARCWebClientDeprecationAckDialog.html",
                                            };
                                            if (envVariableValue != ARC.WebClientDeprecationState.Canceled && envVariableValue != ARC.WebClientDeprecationState.YetToAcknowledge) {
                                                ARC.ARCWebClientDeprecationAckDialog.setEnvironmentVariableValue(ARC.ARCWebClientDeprecationAckDialog._environmentVariableSchemaName, ARC.ARCWebClientDeprecationAckDialog._environmentVariableDisplayName, ARC.WebClientDeprecationState.YetToAcknowledge.toString());
                                            }
                                            Xrm.Navigation.navigateTo(pageInput, navigationOptions);
                                        }
                                        _a.label = 4;
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        exception_6 = _a.sent();
                                        console.log("ARCMainSystemLibraryWebResource::showWebClientDeprecationAckDialogUCI:exception:" + exception_6);
                                        return [3 /*break*/, 6];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        });
                    }, function (error) {
                        console.log("ARCMainSystemLibraryWebResource::showWebClientDeprecationAckDialogUCI:exception:" + error);
                    });
                    return [2 /*return*/];
                });
            });
        };
        ARCMainSystemLibraryWebResource.changeDisableAllControls = function (disable) {
            var allTabs = Xrm.Page.ui.tabs;
            allTabs.forEach(function (tab) {
                var allSections = Xrm.Page.ui.tabs.get(tab.getName()).sections;
                allSections.forEach(function (section) {
                    var allControlsForSection = section.controls;
                    for (var i = 0; i < allControlsForSection.getLength(); i++) {
                        var control = allControlsForSection.getByIndex(i);
                        control.setDisabled(disable);
                    }
                });
            });
        };
        ARCMainSystemLibraryWebResource.hideSectionsForLegacyRule = function () {
            var BasicTabSections = Xrm.Page.ui.tabs.getByName("Basic").sections;
            BasicTabSections.forEach(function (section) {
                if (section._controlName != "Details") {
                    section.setVisible(false);
                }
            });
            Xrm.Page.ui.tabs.getByName("Advanced").setVisible(false);
        };
        // handle migration control onsave.
        ARCMainSystemLibraryWebResource.handleMigrationTabOnSave = function () {
            try {
                // check if migration section exists, else return
                var tabUCMigration = Xrm.Page.ui.tabs.getByName(ARCMainSystemLibraryWebResource._migrationTabName);
                if (tabUCMigration == null) {
                    return;
                }
                var entityAttributeValue = Xrm.Page.getAttribute(ARCMainSystemLibraryWebResource._boundEntity);
                if (entityAttributeValue != null && entityAttributeValue != undefined && entityAttributeValue.getValue != null) {
                    var newValueOfToggle = -1;
                    if (entityAttributeValue.getValue() == ARCMainSystemLibraryWebResource._toggleValueForOne) {
                        newValueOfToggle = 1;
                    }
                    else if (entityAttributeValue.getValue() == ARCMainSystemLibraryWebResource._toggleValueForZero) {
                        newValueOfToggle = 2;
                    }
                    else {
                        return;
                    }
                    var recordId = Xrm.Page.data.entity.getId();
                    // return if record id or tracker is invalid
                    // could be new ARC creation case or manually created UCI ARC
                    if (recordId == "" || recordId == undefined || recordId == null || ARCMainSystemLibraryWebResource._trackerEntity == null || ARCMainSystemLibraryWebResource._trackerEntity == undefined) {
                        return;
                    }
                    var trackerId = ARCMainSystemLibraryWebResource._trackerEntity.msdyn_migrationtrackerid;
                    var oldValueOfToggle = ARCMainSystemLibraryWebResource._trackerEntity.msdyn_migrationstatus;
                    if (oldValueOfToggle == newValueOfToggle) {
                        return;
                    }
                    Xrm.WebApi.updateRecord("msdyn_migrationtracker", trackerId, {
                        "msdyn_migrationstatus": newValueOfToggle
                    }).then(function (response) {
                        console.log("ARCMainSystemLibraryWebResource::handleMigrationTabOnSave:" + "Updated");
                        ARCMainSystemLibraryWebResource._trackerEntity.msdyn_migrationstatus = newValueOfToggle;
                        var migrationStatusDetailsControl = Xrm.Page.getControl(ARCMainSystemLibraryWebResource._migrationDetailsControlName);
                        // show or hide details pane based on selection
                        if (migrationStatusDetailsControl != null) {
                            if (newValueOfToggle == (ARCMainSystemLibraryWebResource._toggleValueForOne ? 1 : 0)) {
                                migrationStatusDetailsControl.setVisible(false);
                            }
                            else if (newValueOfToggle == (ARCMainSystemLibraryWebResource._toggleValueForZero ? 1 : 0)) {
                                migrationStatusDetailsControl.setVisible(true);
                            }
                        }
                    }, function (error) {
                        console.log("ARCMainSystemLibraryWebResource::handleMigrationTabOnSave:error:" + error);
                        Xrm.Navigation.openAlertDialog({ text: error.message }, { height: 250, width: 300 });
                    });
                }
            }
            catch (exception) {
                console.log("ARCMainSystemLibraryWebResource::handleMigrationTabOnSave:exception:" + exception);
            }
        };
        // ----- migration tab related handling end ------
        ARCMainSystemLibraryWebResource.isMultiQueueWithQueueItemTriggerEnabled = function () {
            return __awaiter(this, void 0, void 0, function () {
                var url, body, response, jsonResponse, settingValue, exception_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            url = ARCMainSystemLibraryWebResource._getFeatureEnabledState;
                            body = {
                                FeatureName: ARCMainSystemLibraryWebResource._ecsMultiQueueWithQueueItemTrigger,
                            };
                            return [4 /*yield*/, fetch(url, {
                                    method: "POST",
                                    body: JSON.stringify(body),
                                    headers: {
                                        Accept: "application/json",
                                        "Content-Type": "application/json",
                                    },
                                })];
                        case 1:
                            response = _a.sent();
                            if (!(response.status === 200)) return [3 /*break*/, 3];
                            return [4 /*yield*/, response.json()];
                        case 2:
                            jsonResponse = _a.sent();
                            settingValue = jsonResponse.IsFeatureEnabled;
                            return [2 /*return*/, settingValue === true];
                        case 3: return [2 /*return*/, false];
                        case 4:
                            exception_7 = _a.sent();
                            console.log("ARCMainSystemLibraryWebResource:isMultiQueueWithQueueItemTriggerEnabled:exception:" + exception_7);
                            return [2 /*return*/, false];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        return ARCMainSystemLibraryWebResource;
    }());
    ARCMainSystemLibraryWebResource._trackerEntity = null;
    ARCMainSystemLibraryWebResource._boundEntity = "convertruletype";
    ARCMainSystemLibraryWebResource._migrationDetailsControlName = "msdyn_migrationstatus_details";
    ARCMainSystemLibraryWebResource._toggleValueForOne = true;
    ARCMainSystemLibraryWebResource._toggleValueForZero = false;
    ARCMainSystemLibraryWebResource._migrationTabName = "tabUCMigrationDetail";
    ARCMainSystemLibraryWebResource._isLegacyRule = false;
    ARCMainSystemLibraryWebResource._webClientDeprecationNotificationResourceName = "WebClientDeprecationNotification";
    ARCMainSystemLibraryWebResource._migrationLink = Mscrm.SharedUtils.SharedUtils.getMSDocsRedirectBaseURL() + "/fwlink/p/?linkid=2198689";
    ARCMainSystemLibraryWebResource._getFeatureEnabledState = "api/data/v9.2/GetFeatureEnabledState";
    ARCMainSystemLibraryWebResource._ecsMultiQueueWithQueueItemTrigger = "MultiQueueWithQueueItemTrigger";
    ARCMainSystemLibraryWebResource.Form_onload = function () {
        var convertruleid = Xrm.Page.getAttribute("convertruleid").getValue();
        if (Xrm.Internal.isUci()) {
            ARCMainSystemLibraryWebResource.sourcechanneltypecode_onchange();
            //Legacy rule will have convertruletype as null or false.
            ARCMainSystemLibraryWebResource._isLegacyRule = !Xrm.Page.getAttribute("convertruletype").getValue();
            if (convertruleid == null) {
                Xrm.Page.getAttribute("convertruletype").setValue(true);
            }
            else if (ARCMainSystemLibraryWebResource._isLegacyRule) {
                //lock all controls if legacy rule
                Xrm.Page.ui.setFormNotification(ARC.ResourceStringProvider.getResourceString("Legacy_Rule_Edit_Info"), "INFO", "Legacy_Rule_Edit_Info");
                ARCMainSystemLibraryWebResource.changeDisableAllControls(true);
                ARCMainSystemLibraryWebResource.hideSectionsForLegacyRule();
            }
            ARCMainSystemLibraryWebResource.handleMigrationTabOnLoad();
            //ARCMainSystemLibraryWebResource.ConvertRuleType_onchange();
            //Prevent creation of legacy rules in UCI
            Xrm.Page.getControl("convertruletype").setDisabled(true);
        }
        ARCMainSystemLibraryWebResource.showWebClientDeprecationNotification();
        ARCMainSystemLibraryWebResource.showWebClientDeprecationAckDialogUCI();
        ARCMainSystemLibraryWebResource.QueueScope_onchange();
        ARCMainSystemLibraryWebResource.AllowUnknownSender_onchange();
        ARCMainSystemLibraryWebResource.CheckIfResolved_onchange();
        ARCMainSystemLibraryWebResource.SendAutomaticResponse_onchange();
        var activityMonitorRecommendation_FCS = Xrm.Utility.getGlobalContext().getFeatureControlSetting(ARC.Constants._activityMonitorRecommendationFCSNamespace, ARC.Constants._activityMonitorRecommendationFCSKey);
        // check if query string parameter is passed when activity monitor recommendation FCS is true.
        if (activityMonitorRecommendation_FCS === true) {
            ARCMainSystemLibraryWebResource.focusOnTab();
        }
    };
    ARCMainSystemLibraryWebResource.showWebClientDeprecationNotification = function () {
        //only show if have at least one active legacy rule
        Xrm.WebApi.retrieveMultipleRecords("convertrule", "?$top=1&$filter=convertruletype ne true and statecode eq 1").then(function succeeded(response) {
            if (response && response.entities.length > 0) {
                try {
                    var message = ARC.ResourceStringProvider.getResourceString(ARCMainSystemLibraryWebResource._webClientDeprecationNotificationResourceName)
                        .replace("{0}", ARCMainSystemLibraryWebResource._migrationLink);
                    Xrm.Page.ui.setFormNotification(message, "WARNING", "ARC_WebClientDeprecationNotification");
                }
                catch (exception) {
                    console.log("ARCMainSystemLibraryWebResource::showWebClientDeprecationNotification:exception:" + exception);
                }
            }
        }, function (error) {
            console.log("ARCMainSystemLibraryWebResource::showWebClientDeprecationNotification:exception:" + error);
        });
    };
    ARCMainSystemLibraryWebResource.showWebClientDeprecationDialog = function () {
        var isLegacyRule = !Xrm.Page.getAttribute("convertruletype").getValue();
        var isCreate = Xrm.Page.ui.getFormType() === Xrm.FormType.create;
        if (isLegacyRule && isCreate) {
            try {
                var alertStrings = { text: ARC.ResourceStringProvider.getResourceString(ARCMainSystemLibraryWebResource._webClientDeprecationNotificationResourceName)
                        .replace("{0}", ARCMainSystemLibraryWebResource._migrationLink) };
                var alertOptions = { height: 200, width: 500 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
            }
            catch (exception) {
                console.log("ARCMainSystemLibraryWebResource::showWebClientDeprecationDialog:exception:" + exception);
            }
        }
    };
    ARCMainSystemLibraryWebResource.Form_convertruleNameOnChange = function () {
        var name = Xrm.Page.getAttribute("name").getValue();
        if (name && name.length < 3) {
            Xrm.Page.getControl("name").setNotification(ARC.ResourceStringProvider.getResourceString("Name_Length_Error"));
        }
        else {
            Xrm.Page.getControl("name").clearNotification();
        }
    };
    ARCMainSystemLibraryWebResource.Form_onsave = function () {
        var name = Xrm.Page.getAttribute("name").getValue();
        if (name && name.length < 3) {
            Xrm.Page.getControl("name").setNotification(ARC.ResourceStringProvider.getResourceString("Name_Length_Error"));
        }
        else {
            Xrm.Page.getControl("name").clearNotification();
            var sourcechanneltypecode = Xrm.Page.getAttribute("sourcechanneltypecode").getValue();
            if (sourcechanneltypecode !== 'email') {
                Xrm.Page.getAttribute("sendautomaticresponse").setValue(false);
                Xrm.Page.getAttribute("responsetemplateid").setValue(null);
                Xrm.Page.getAttribute("allowunknownsender").setValue(false);
                Xrm.Page.getAttribute("senderresolutionoption").setValue(0);
                Xrm.Page.getAttribute("checkactiveentitlement").setValue(false);
                Xrm.Page.getAttribute("checkifresolved").setValue(false);
                Xrm.Page.getAttribute("resolvedsince").setValue(null);
            }
        }
        if (Xrm.Internal.isUci() && !(ARCMainSystemLibraryWebResource._isLegacyRule)) {
            ARCMainSystemLibraryWebResource.handleMigrationTabOnSave();
            Xrm.Page.getAttribute("convertruletype").setValue(true);
        }
    };
    ARCMainSystemLibraryWebResource.sourcechanneltypecode_onchange = function () {
        var sourcechanneltypecode = Xrm.Page.getAttribute("sourcechanneltypecode").getValue();
        switch (sourcechanneltypecode) {
            case "email":
                Xrm.Page.getControl("SendAutomaticResponse").setVisible(true);
                Xrm.Page.getControl("AllowUnknownSender").setVisible(true);
                Xrm.Page.getControl("MultiRuleQueues").setVisible(true);
                Xrm.Page.getControl("CheckActiveEntitlement").setVisible(true);
                Xrm.Page.getControl("CheckIfResolved").setVisible(true);
                ARCMainSystemLibraryWebResource.AllowUnknownSender_onchange();
                ARCMainSystemLibraryWebResource.QueueScope_onchange();
                ARCMainSystemLibraryWebResource.CheckIfResolved_onchange();
                ARCMainSystemLibraryWebResource.SendAutomaticResponse_onchange();
                break;
            default:
                Xrm.Page.getControl("SendAutomaticResponse").setVisible(false);
                Xrm.Page.getControl("ResponseTemplateId").setVisible(false);
                Xrm.Page.getControl("AllowUnknownSender").setVisible(false);
                Xrm.Page.getControl("MultiRuleQueues").setVisible(false);
                Xrm.Page.getControl("SenderResolutionOption").setVisible(false);
                Xrm.Page.getAttribute("senderresolutionoption").setRequiredLevel("none");
                Xrm.Page.getControl("CheckActiveEntitlement").setVisible(false);
                Xrm.Page.getControl("CheckIfResolved").setVisible(false);
                Xrm.Page.getControl("ResolvedSince").setVisible(false);
                break;
        }
        ARCMainSystemLibraryWebResource.toggleRequiredFields();
    };
    ARCMainSystemLibraryWebResource.QueueScope_onchange = function () { return __awaiter(_this, void 0, void 0, function () {
        var isMultiQueueWithQueueItemTriggerEnabled, queueScope, queueScope;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ARCMainSystemLibraryWebResource.isMultiQueueWithQueueItemTriggerEnabled()];
                case 1:
                    isMultiQueueWithQueueItemTriggerEnabled = _a.sent();
                    if (isMultiQueueWithQueueItemTriggerEnabled) {
                        queueScope = Xrm.Page.getAttribute("queuescope");
                        // Behavior for pre-existing ARC rules when ECS is on
                        if (queueScope == null || queueScope.getValue() == null) {
                            Xrm.Page.getControl("queueid").setVisible(true);
                            Xrm.Page.getControl("MultiRuleQueues").setVisible(false);
                            Xrm.Page.getControl("queuescope").setVisible(false);
                        }
                        else if (queueScope != null && queueScope.getValue() == "0") {
                            Xrm.Page.getControl("queueid").setVisible(true);
                            Xrm.Page.getControl("queuescope").setVisible(true);
                            Xrm.Page.getControl("MultiRuleQueues").setVisible(false);
                        }
                        else {
                            Xrm.Page.getControl("queueid").setVisible(false);
                            Xrm.Page.getControl("queuescope").setVisible(true);
                            Xrm.Page.getControl("MultiRuleQueues").setVisible(true);
                        }
                    }
                    else {
                        queueScope = Xrm.Page.getAttribute("queuescope");
                        // Behavior for single queue ARC rules when ECS is off
                        if (queueScope == null || queueScope.getValue() == null || queueScope.getValue() == "0") {
                            Xrm.Page.getControl("queueid").setVisible(true);
                            Xrm.Page.getControl("MultiRuleQueues").setVisible(false);
                            Xrm.Page.getControl("queuescope").setVisible(false);
                        }
                        else {
                            Xrm.Page.getControl("queueid").setVisible(false);
                            Xrm.Page.getControl("MultiRuleQueues").setVisible(true);
                            Xrm.Page.getControl("queuescope").setVisible(true);
                            ARCMainSystemLibraryWebResource.changeDisableAllControls(true);
                        }
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    ARCMainSystemLibraryWebResource.AllowUnknownSender_onchange = function () {
        var AllowUnknownSender = Xrm.Page.getAttribute("allowunknownsender").getValue();
        if (AllowUnknownSender) {
            Xrm.Page.getControl("SenderResolutionOption").setVisible(true);
            Xrm.Page.getAttribute("senderresolutionoption").setRequiredLevel("required");
        }
        else {
            Xrm.Page.getControl("SenderResolutionOption").setVisible(false);
            Xrm.Page.getAttribute("senderresolutionoption").setValue(0);
            Xrm.Page.getAttribute("senderresolutionoption").setRequiredLevel("none");
        }
    };
    ARCMainSystemLibraryWebResource.CheckIfResolved_onchange = function () {
        var CheckIfResolved = Xrm.Page.getAttribute("checkifresolved").getValue();
        if (CheckIfResolved) {
            Xrm.Page.getControl("ResolvedSince").setVisible(true);
        }
        else {
            Xrm.Page.getControl("ResolvedSince").setVisible(false);
        }
    };
    ARCMainSystemLibraryWebResource.SendAutomaticResponse_onchange = function () {
        var SendAutomaticResponse = Xrm.Page.getAttribute("sendautomaticresponse").getValue();
        if (SendAutomaticResponse) {
            Xrm.Page.getControl("ResponseTemplateId").setVisible(true);
        }
        else {
            Xrm.Page.getControl("ResponseTemplateId").setVisible(false);
        }
        ARCMainSystemLibraryWebResource.toggleRequiredFields();
    };
    ARCMainSystemLibraryWebResource.openUCIForm = function () {
        var options = {
            entityName: "convertruleitem",
            entityId: "",
            formId: "95ab3b9c-f36f-457a-8879-71c74472eeee",
        };
        var param = {
            ConvertRuleId: Xrm.Page.getAttribute("convertruleid").getValue(),
        };
        Xrm.Navigation.openForm(options, param);
    };
    ARCMainSystemLibraryWebResource.displayCurrentStateIcon = function (rowData, userLCID) {
        var str = JSON.parse(rowData);
        var statuscode = str.currentstate_Value;
        var imgName = "";
        var currentstatevalue = str.currentstate;
        switch (parseInt(statuscode, 10)) {
            case 0:
            case 1:
                imgName = "AutomaticRecordCreation/_imgs/Green.svg";
                break;
            case 2:
                imgName = "AutomaticRecordCreation/_imgs/Red.svg";
                break;
            case 3:
                imgName = "AutomaticRecordCreation/_imgs/Grey.svg";
                break;
            default:
                imgName = "";
                break;
        }
        var resultarray = [imgName, currentstatevalue];
        return resultarray;
    };
    // ----- migration tab related handling start ------
    ARCMainSystemLibraryWebResource.handleMigrationTabOnLoad = function () {
        try {
            // check if migration tab exists, else return
            var tabUCMigration = Xrm.Page.ui.tabs.getByName(ARCMainSystemLibraryWebResource._migrationTabName);
            if (tabUCMigration == null) {
                return;
            }
            var recordId = Xrm.Page.data.entity.getId();
            if (recordId == "" || recordId == undefined || recordId == null) {
                tabUCMigration.setVisible(false);
                return;
            }
            var entityAttributeValue = Xrm.Page.getAttribute(ARCMainSystemLibraryWebResource._boundEntity);
            if (entityAttributeValue != null && entityAttributeValue.getValue != null) {
                var migrationStatusDetailsControl = Xrm.Page.getControl(ARCMainSystemLibraryWebResource._migrationDetailsControlName);
                // show or hide details pane based on selection
                if (migrationStatusDetailsControl != null) {
                    if (entityAttributeValue.getValue() == ARCMainSystemLibraryWebResource._toggleValueForOne) {
                        migrationStatusDetailsControl.setVisible(false);
                    }
                }
            }
            var fetchXmlAttributes = '<attribute name="msdyn_migrationstatus" /> <attribute name="msdyn_migrationtrackerid" />';
            var fetchXmlHeader = '<fetch version="1.0" mapping="logical" returntotalrecordcount="true"> <entity name="msdyn_migrationtracker">';
            var callSpecificFilter = recordId ? '<filter type="and"><condition attribute="msdyn_modernconvertruleid" operator="eq" value="' + recordId + '"/><condition attribute="msdyn_objecttypecode" operator="eq" value="9300"/></filter>' : null;
            var fetchXml = fetchXmlHeader + fetchXmlAttributes + callSpecificFilter + '</entity></fetch>';
            Xrm.WebApi.retrieveMultipleRecords("msdyn_migrationtracker", "?fetchXml=" + fetchXml).then(function (response) {
                if (response.entities.length == 0) {
                    tabUCMigration.setVisible(false);
                    return;
                }
                ;
                ARCMainSystemLibraryWebResource._trackerEntity = response.entities[0];
                tabUCMigration.setVisible(true);
                if (ARCMainSystemLibraryWebResource._trackerEntity.msdyn_migrationstatus == ARCMainSystemLibraryWebResource._toggleValueForOne) {
                    migrationStatusDetailsControl.setVisible(false);
                }
                else {
                    migrationStatusDetailsControl.setVisible(true);
                }
            }, function (error) {
                console.log("ARCMainSystemLibraryWebResource::handleMigrationTabOnLoad:error:" + error);
            });
        }
        catch (exception) {
            console.log("ARCMainSystemLibraryWebResource::handleMigrationTabOnLoad:exception:" + exception);
        }
    };
    ARCMainSystemLibraryWebResource.ConvertRuleType_onchange = function () {
        try {
            // check if migration tab exists, else return
            var tabUCMigration = Xrm.Page.ui.tabs.getByName(ARCMainSystemLibraryWebResource._migrationTabName);
            if (tabUCMigration == null) {
                return;
            }
            var recordId = Xrm.Page.data.entity.getId();
            if (recordId == "" || recordId == undefined || recordId == null) {
                tabUCMigration.setVisible(false);
                return;
            }
            var entityAttributeValue = Xrm.Page.getAttribute(ARCMainSystemLibraryWebResource._boundEntity);
            if (entityAttributeValue != null && entityAttributeValue.getValue != null) {
                var migrationStatusDetailsControl = Xrm.Page.getControl(ARCMainSystemLibraryWebResource._migrationDetailsControlName);
                // show or hide details pane based on selection
                if (migrationStatusDetailsControl != null) {
                    if (entityAttributeValue.getValue() == ARCMainSystemLibraryWebResource._toggleValueForOne) {
                        migrationStatusDetailsControl.setVisible(false);
                        ARCMainSystemLibraryWebResource._trackerEntity.msdyn_migrationstatus = 2;
                    }
                    else if (entityAttributeValue.getValue() == ARCMainSystemLibraryWebResource._toggleValueForZero) {
                        migrationStatusDetailsControl.setVisible(true);
                        ARCMainSystemLibraryWebResource._trackerEntity.msdyn_migrationstatus = 1;
                    }
                }
            }
        }
        catch (exception) {
            console.log("ARCMainSystemLibraryWebResource::ConvertRuleType_onchange:exception:" + exception);
        }
    };
    ARCMainSystemLibraryWebResource.toggleRequiredFields = function () {
        var sourcechanneltypecode = Xrm.Page.getAttribute("sourcechanneltypecode").getValue();
        if (sourcechanneltypecode == "email") {
            //syntax for setting required level of controls bound to data fields differs from unbound controls on dialog 
            Xrm.Page.getControl("ResponseTemplateId").getAttribute().setRequiredLevel(!!(Xrm.Page.getAttribute("sendautomaticresponse").getValue()) ?
                Xrm.Constants.AttributeRequiredLevels.required :
                Xrm.Constants.AttributeRequiredLevels.none);
        }
    };
    ARC.ARCMainSystemLibraryWebResource = ARCMainSystemLibraryWebResource;
})(ARC || (ARC = {}));
//# sourceMappingURL=ARC_main_system_library.js.map