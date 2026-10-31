var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var ClientUtility;
(function (ClientUtility) {
    var DataUtil = (function () {
        function DataUtil() {
        }
        /**
         * Checks whether an object is null.
         * @param object The object to check.
         * @returns A flag indicating whether the object is null.
         */
        DataUtil.isNull = function (object) {
            return object === null;
        };
        /**
         * Checks whether an object is undefined.
         * @param object The object to check.
         * @returns A flag indicating whether the object is undefined.
         */
        DataUtil.isUndefined = function (object) {
            return object === undefined;
        };
        /**
         * Checks whether an object is null or undefined.
         * @param object The object to check.
         * @returns A flag indicating whether the object is null or undefined.
         */
        DataUtil.isNullOrUndefined = function (object) {
            return object === null || object === undefined;
        };
        /**
         * Checks whether an object is an undefined, null or empty string.
         * @param object The object to check.
         * @returns A flag indicating whether the object is undefined, null or an empty string.
         */
        DataUtil.isNullOrEmptyString = function (object) {
            return DataUtil.isNullOrUndefined(object) || object === "";
        };
        /**
         * Checks whether an object is an null, an empty or whitespace string.
         * @param object The object to check.
         * @returns A Boolean value indicating whether the object is null, an empty or whitespace string.
         */
        DataUtil.isNullOrWhiteSpace = function (value) {
            return DataUtil.isNullOrEmptyString(value) || (DataUtil.isString(value) && value.trim() == "");
        };
        /**
         * Tries to convert an object to string
         * @param object The object to convert.
         * @returns Returns the object converted to string or the object itself if this is null or undefined.
         */
        DataUtil.toStringWithNullCheck = function (object) {
            return DataUtil.isNullOrUndefined(object) ? object : object.toString();
        };
        /**
         * Checks if a given object is a string
         * @param object The object check.
         * @returns true if the object is a string; otherwise, false.
         */
        DataUtil.isString = function (object) {
            return typeof object === 'string' || object instanceof String;
        };
        return DataUtil;
    }());
    DataUtil.EmptyString = "";
    /**
     * Checks if a given object is a function
     * @param object The object check.
     * @returns true if the object is a function; otherwise, false.
     */
    DataUtil.isFunction = function (object) {
        return !!object && typeof object === 'function';
    };
    /**
     * Checks if a given object has a given function
     * @param object The object check.
     * @param functionName The name of the function to check for.
     * @returns true if the object has a given function; otherwise, false.
     */
    DataUtil.hasFunction = function (object, functionName) {
        return !!object && functionName && DataUtil.isFunction(object[functionName]);
    };
    ClientUtility.DataUtil = DataUtil;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var ClientUtility;
(function (ClientUtility) {
    var DataUtils = (function () {
        function DataUtils() {
        }
        return DataUtils;
    }());
    /**
     * Checks if a given object is a function
     * @param object The object check.
     * @returns true if the object is a function; otherwise, false.
     */
    DataUtils.isFunction = function (object) {
        return !!object && typeof object === 'function';
    };
    /**
     * Checks if a given object has a given function
     * @param object The object check.
     * @param functionName The name of the function to check for.
     * @returns true if the object has a given function; otherwise, false.
     */
    DataUtils.hasFunction = function (object, functionName) {
        return !!object && functionName && DataUtils.isFunction(object[functionName]);
    };
    ClientUtility.DataUtils = DataUtils;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="DataUtils.ts" />
var ClientUtility;
(function (ClientUtility) {
    var ClientUtils = (function () {
        function ClientUtils() {
        }
        /**
         * Checks whether the code is running on a UCI client.
         * @returns A flag indicating whether the code is running on a UCI client.
         */
        ClientUtils.isUCI = function () {
            var global = window;
            var xrm = global.Xrm;
            var result = false;
            if (xrm && xrm.Internal && ClientUtility.DataUtils.hasFunction(xrm.Internal, 'isUci')) {
                result = xrm.Internal.isUci();
            }
            else {
                // fall back to url inspection
                result = window && window.parent && window.parent.location && window.parent.location.href && window.parent.location.href.toLowerCase().indexOf('uclient') !== -1;
            }
            return result;
        };
        return ClientUtils;
    }());
    ClientUtility.ClientUtils = ClientUtils;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var ClientUtility;
(function (ClientUtility) {
    var MetadataDrivenDialogConstants = (function () {
        function MetadataDrivenDialogConstants() {
        }
        return MetadataDrivenDialogConstants;
    }());
    MetadataDrivenDialogConstants.action = "action";
    MetadataDrivenDialogConstants.activate = "activate";
    MetadataDrivenDialogConstants.commaSeperator = ",";
    MetadataDrivenDialogConstants.defaultIndex = 0;
    MetadataDrivenDialogConstants.DialogCancelId = "cancel_id";
    MetadataDrivenDialogConstants.DialogOkId = "ok_id";
    MetadataDrivenDialogConstants.EntityId = "entityId";
    MetadataDrivenDialogConstants.EntityName = "entityName";
    MetadataDrivenDialogConstants.EntityTypeCode = "entityTypeCode";
    MetadataDrivenDialogConstants.firstIndex = 1;
    MetadataDrivenDialogConstants.GridControl = "gridControl";
    MetadataDrivenDialogConstants.LastButtonClicked = "lastButtonClicked";
    MetadataDrivenDialogConstants.Records = "records";
    MetadataDrivenDialogConstants.SetState = "SetState";
    MetadataDrivenDialogConstants.StateId = "state_id";
    MetadataDrivenDialogConstants.StatusId = "status_id";
    MetadataDrivenDialogConstants.paramEntityName = "param_entityName";
    MetadataDrivenDialogConstants.paramEntityId = "param_entityId";
    MetadataDrivenDialogConstants.paramEntityTypeCode = "param_entityTypeCode";
    MetadataDrivenDialogConstants.paramLastButtonClicked = "param_lastButtonClicked";
    MetadataDrivenDialogConstants.paramOwnerId = "param_ownerId";
    MetadataDrivenDialogConstants.paramOwnerName = "param_ownerName";
    MetadataDrivenDialogConstants.paramOwnerType = "param_ownerType";
    MetadataDrivenDialogConstants.paramRecords = "param_records";
    MetadataDrivenDialogConstants.paramMerge = "Merge";
    MetadataDrivenDialogConstants.paramUpdate = "Update";
    MetadataDrivenDialogConstants.paramGrid = "Grid";
    MetadataDrivenDialogConstants.lead = "lead";
    MetadataDrivenDialogConstants.april2021Update = "April2021Update";
    ClientUtility.MetadataDrivenDialogConstants = MetadataDrivenDialogConstants;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var ClientUtility;
(function (ClientUtility) {
    var TelemetryReporter = (function () {
        function TelemetryReporter() {
        }
        TelemetryReporter.CreateTelemetryParametersDictionary = function (moduleName, componentName, functionName, eventType, eventDetails) {
            var parameters = {};
            parameters["moduleName"] = moduleName;
            parameters["componentName"] = componentName;
            parameters["functionName"] = functionName;
            parameters["eventType"] = eventType;
            parameters["eventDetails"] = eventDetails;
            return parameters;
        };
        TelemetryReporter.getDataParams = function (paramsArray) {
            var data = {};
            if (paramsArray) {
                paramsArray.forEach(function (param) {
                    data[param.name] = param.value;
                });
            }
            return data;
        };
        Object.defineProperty(TelemetryReporter, "SILogger", {
            get: function () {
                try {
                    TelemetryReporter.SITelemetryLogger = SIClientUtilityLogger && SIClientUtilityLogger.Telemetry ? SIClientUtilityLogger.Telemetry : null;
                }
                catch (ex) {
                    console.error(ex);
                }
                return TelemetryReporter.SITelemetryLogger;
            },
            enumerable: true,
            configurable: true
        });
        TelemetryReporter.ReportComponentSuccess = function (context, scenario, methodName, componentName, action, actionOn, message, paramsArray) {
            try {
                // push data to SITraceCIEvent
                TelemetryReporter.SILogger && TelemetryReporter.SILogger.ReportUserAction({
                    context: context,
                    methodName: methodName,
                    action: action,
                    actionOn: actionOn,
                    message: message,
                    area: TelemetryReporter.Area,
                    data: __assign({}, TelemetryReporter.getDataParams(paramsArray), { scenario: scenario })
                });
            }
            catch (ex) {
                TelemetryReporter.reportUCIError(componentName + "." + methodName, ex);
            }
        };
        TelemetryReporter.ReportInfo = function (context, methodName, componentName, action, actionOn, message, enableUCILogging, paramsArray) {
            if (enableUCILogging === void 0) { enableUCILogging = false; }
            try {
                // push data to SITraceBIEvent
                TelemetryReporter.SILogger && TelemetryReporter.SILogger.ReportInfo({
                    context: context,
                    methodName: methodName,
                    action: action,
                    actionOn: actionOn,
                    message: message,
                    area: TelemetryReporter.Area,
                    data: __assign({}, TelemetryReporter.getDataParams(paramsArray), { componentName: componentName })
                });
                // push data to uciMonitorSuccess
                if (enableUCILogging) {
                    Xrm.Reporting.reportSuccess(componentName + "." + methodName, paramsArray);
                }
            }
            catch (ex) {
                TelemetryReporter.reportUCIError(componentName + "." + methodName, ex);
            }
        };
        TelemetryReporter.ReportWarning = function (context, methodName, componentName, action, actionOn, message, paramsArray) {
            try {
                // push data to SITraceEvent
                TelemetryReporter.SILogger && TelemetryReporter.SILogger.ReportWarning({
                    context: context,
                    methodName: methodName,
                    action: action,
                    actionOn: actionOn,
                    message: message,
                    area: TelemetryReporter.Area,
                    data: __assign({}, TelemetryReporter.getDataParams(paramsArray), { componentName: componentName })
                });
            }
            catch (ex) {
                TelemetryReporter.reportUCIError(componentName + "." + methodName, ex);
            }
        };
        TelemetryReporter.ReportError = function (context, methodName, message, componentName, action, actionOn, paramsArray) {
            try {
                // push data to SITraceEvent
                TelemetryReporter.SILogger && TelemetryReporter.SILogger.ReportError({
                    context: context,
                    methodName: methodName,
                    message: message,
                    action: action,
                    actionOn: actionOn,
                    area: TelemetryReporter.Area,
                    data: __assign({}, TelemetryReporter.getDataParams(paramsArray), { componentName: componentName })
                });
            }
            catch (ex) {
                TelemetryReporter.reportUCIError(componentName + "." + methodName, ex);
            }
        };
        TelemetryReporter.reportUCIError = function (componentName, error) {
            try {
                Xrm.Reporting.reportFailure(componentName, Error(JSON.stringify(error)));
            }
            catch (ex) {
                console.error(ex);
            }
        };
        TelemetryReporter.LogExecutionTelemetryForWeb = function (eventName, parameters) {
            try {
                Xrm.Internal.addMetric(eventName, parameters);
            }
            catch (e) {
                console.error(e);
            }
        };
        return TelemetryReporter;
    }());
    TelemetryReporter.mergeDialogModuleName = "mergeDialog";
    TelemetryReporter.Area = "Merge Records UCI";
    ClientUtility.TelemetryReporter = TelemetryReporter;
})(ClientUtility || (ClientUtility = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var ODataContract;
(function (ODataContract) {
    var RetrieveUserPrivilegeByPrivilegeNameRequest = (function () {
        function RetrieveUserPrivilegeByPrivilegeNameRequest(entity /*Microsoft.Dynamics.CRM.crmbaseentity*/, privilegeName) {
            this.entity = entity;
            this.PrivilegeName = privilegeName;
        }
        RetrieveUserPrivilegeByPrivilegeNameRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "mscrm.systemuser",
                        "structuralProperty": 5
                    },
                    "PrivilegeName": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1
                    }
                },
                operationName: "RetrieveUserPrivilegeByPrivilegeName",
                operationType: 1
            };
            return metadata;
        };
        return RetrieveUserPrivilegeByPrivilegeNameRequest;
    }());
    ODataContract.RetrieveUserPrivilegeByPrivilegeNameRequest = RetrieveUserPrivilegeByPrivilegeNameRequest;
})(ODataContract || (ODataContract = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="DataUtil.ts" />
/// <reference path="Utils.NoClientApi/ClientUtils.ts" />
/// <reference path="MetadataDrivenDialogConstants.ts" />
/// <reference path="../../../ClientUtility/Client/MergeRecords/Reporter.ts" />
/// <reference path="../Common/DataContracts/Function/RetrieveUserPrivilegeByPrivilegeNameRequest.ts" />
var ClientUtility;
(function (ClientUtility) {
    var paramMergeButton = "merge_button";
    var paramMergeMyRecordGrid = "merge_MyRecord_Grid";
    var paramSelectedRecordId = "selected_Record_Id";
    var paramEntityRecord = "entity_record";
    var paramMatchingEntityName = "matching_Entity_Name";
    var mergeRecordsDialog = "MergeRecordsDialog";
    var odataType = "@odata.type";
    var microsoftDynamicCRM = "#Microsoft.Dynamics.CRM.";
    var paramDialogHeaderLabel = "label_manageDuplicates_Description";
    var paramIgnoreAndSave = "ignore_save";
    var ClientUtil = (function () {
        function ClientUtil() {
        }
        /**
         * Checks whether the client is mobile.
         * @returns A flag indicating whether the client is mobile.
         */
        ClientUtil.isMobile = function () {
            return Xrm.Utility.getGlobalContext().client.getClient() === Xrm.Constants.ClientNames.mobile;
        };
        /**
         * Checks whether the mobile device is offline.
         * @returns A flag indicating whether the mobile device is offline.
         */
        ClientUtil.isMobileOffline = function () {
            // TODO: Consider adding a check for the org Setting for offline enabled
            return (Xrm.Utility.getGlobalContext().client.getClient() === Xrm.Constants.ClientNames.mobile &&
                Xrm.Utility.getGlobalContext().client.getClientState() === Xrm.Constants.ClientStates.offline) || ClientUtil.isBrowserOffline();
        };
        /**
        * Checks whether the browser is offline.
        * @returns A flag indicating whether browser is offline.
        */
        ClientUtil.isBrowserOffline = function () {
            return (ClientUtil.isUCI() &&
                Xrm.Internal.isFeatureEnabled('BrowserOfflineEnabledForTest') &&
                Xrm.Utility.getGlobalContext().client.getClientState() === Xrm.Constants.ClientStates.offline &&
                Xrm.Utility.getGlobalContext().client.getClient() === Xrm.Constants.ClientNames.web);
        };
        /**
         * Checks whether it is outlook client.
         * @returns A flag indicating it is outlook client
         */
        ClientUtil.isOutlook = function () {
            return Xrm.Utility.getGlobalContext().client.getClient() === Xrm.Constants.ClientNames.outlook;
        };
        /**
         * Checks whether the code is running on an iOS device (iPhone, iPad).
         * @returns A flag indicating whether the code is running on iOS.
         */
        ClientUtil.isIOSDevice = function () {
            var uaString = navigator.userAgent;
            if (ClientUtility.DataUtil.isNullOrUndefined(uaString)) {
                return false;
            }
            uaString = uaString.toLowerCase();
            return uaString !== "" && uaString.search("ipad|ipod|iphone") > -1;
        };
        /**
         * Checks whether the code is running on a UCI client.
         * @returns A flag indicating whether the code is running on a UCI client.
         */
        ClientUtil.isUCI = function () {
            return ClientUtility.ClientUtils.isUCI();
        };
        /**
         * Validates whether the current app module is same as the input app module name.
         * @returns A flag indicating the result of above decision.
         */
        ClientUtil.ValidateCurrentAppModule = function (appNameToValidate) {
            if (!this.isUCI() || appNameToValidate == null || appNameToValidate == "") {
                return false;
            }
            if (Xrm.Page.context == null || Xrm.Page.context.getCurrentAppProperties == null) {
                Xrm && Xrm.Reporting && Xrm.Reporting.reportFailure("ClientUtil_ValidateCurrentAppModule", Error("Null/undefined Xrm.Page.context/getCurrentAppProperties"));
                return false;
            }
            return Xrm.Page.context.getCurrentAppProperties()
                .then(function (response) {
                if (response != null && response.uniqueName != null) {
                    return response.uniqueName.toLowerCase() == appNameToValidate.toLowerCase();
                }
                Xrm && Xrm.Reporting && Xrm.Reporting.reportFailure("ClientUtil_ValidateCurrentAppModule", Error("Null/undefined response/uniqueName"));
                return false;
            }, function (errResponse) {
                Xrm && Xrm.Reporting && Xrm.Reporting.reportFailure("ClientUtil_ValidateCurrentAppModule", errResponse);
                return false;
            });
        };
        /**
         * This is odata call for entity data fetch request.
         * */
        ClientUtil.getEntityRecord = function (context, entityName, entityId) {
            return new Promise(function (resolve, reject) {
                Xrm.WebApi.online.retrieveRecord(entityName, entityId).then(function (response) {
                    if (response) {
                        resolve(response);
                    }
                }, function (error) {
                    reject(null);
                    ClientUtility.TelemetryReporter.ReportError(context, "getEntityRecord", error.message, mergeRecordsDialog);
                });
            });
        };
        ClientUtil.duplicateDetectionAdminSettings = function () {
            try {
                if (this.isApril2021UpdateEnabled()) {
                    return true;
                }
                else {
                    var attributes = Xrm.Utility.getGlobalContext().organizationSettings.attributes;
                    var params = {};
                    var duplicateDialogoptions = null;
                    if (ClientUtility.DataUtil.isNullOrUndefined(attributes)) {
                        return false; //By default should return false
                    }
                    if (ClientUtil.isUCI() && !ClientUtility.DataUtil.isNullOrUndefined(attributes["qualifyleadadditionaloptions"])) {
                        if (attributes["qualifyleadadditionaloptions"] && attributes["qualifyleadadditionaloptions"].length >= 0)
                            duplicateDialogoptions = JSON.parse(attributes["qualifyleadadditionaloptions"]);
                    }
                    else if (!ClientUtility.DataUtil.isNullOrUndefined(attributes["qualifyLeadAdditionalOptions"]) && attributes["qualifyLeadAdditionalOptions"] != "{}") {
                        if (attributes["qualifyLeadAdditionalOptions"] && attributes["qualifyLeadAdditionalOptions"].length >= 0)
                            duplicateDialogoptions = JSON.parse(attributes["qualifyLeadAdditionalOptions"]);
                    }
                    if (duplicateDialogoptions) {
                        params["DuplicateDetectionMerge"] = duplicateDialogoptions["DuplicateDetectionMerge"] ? duplicateDialogoptions["DuplicateDetectionMerge"] : "false";
                        var duplicateDetectionMerge = params ? params["DuplicateDetectionMerge"] === "true" : false;
                        ClientUtility.TelemetryReporter.ReportInfo(null, "duplicateDetectionAdminSettings", mergeRecordsDialog, null, null, "DuplicateDetectionMerge :" + duplicateDetectionMerge, true);
                        return duplicateDetectionMerge;
                    }
                    else
                        return false;
                }
            }
            catch (e) {
                ClientUtility.TelemetryReporter.ReportError(null, "duplicateDetectionAdminSettings", JSON.stringify(Error("Error fetching admin settings for duplicate and merge. : " + e)), mergeRecordsDialog);
                return false; //By default should return false
            }
        };
        ;
        ClientUtil.isApril2021UpdateEnabled = function () {
            if (ClientUtil.isUCI()) {
                return Xrm.Internal.isFeatureEnabled(ClientUtility.MetadataDrivenDialogConstants.april2021Update);
            }
            else
                return false;
        };
        ClientUtil.isClientOnline = function () {
            //If application is offline do not show merge button on form
            if ((Xrm.Utility.getGlobalContext().client.getClientState() === Xrm.Constants.ClientStates.online)) {
                return true;
            }
            return false;
        };
        ClientUtil.validateAndLaunchMergeDialog = function (gridControl, SelectedControlSelectedItemReferences, SelectedEntityTypeName) {
            if (SelectedControlSelectedItemReferences && SelectedEntityTypeName) {
                var dlgDialogBox = { width: 800, height: 600, position: 1 /* center */ };
                var dialogParams = {};
                dialogParams["entity_type"] = SelectedEntityTypeName;
                dialogParams["entity_record"] = SelectedControlSelectedItemReferences[0].Id;
                if (SelectedControlSelectedItemReferences.length > 1)
                    dialogParams["entity_record2"] = SelectedControlSelectedItemReferences[1].Id;
                dialogParams["param_MergeFlag"] = ClientUtility.MetadataDrivenDialogConstants.paramGrid;
                Xrm.Navigation.openDialog(mergeRecordsDialog, dlgDialogBox, dialogParams).then(function (response) {
                    if (response && response.parameters && response.parameters["param_lastButtonClicked"] === "merge_completed")
                        gridControl && gridControl.refresh();
                });
            }
        };
        //Display rule definition for Mobile etc devices. IF admin settings are true and isOnline true
        //then "Merge" command button will be visible.
        ClientUtil.ValidateSettingsForModernDevice = function () {
            if (ClientUtil.isMobile()) {
                return (ClientUtil.isClientOnline() && ClientUtil.duplicateDetectionAdminSettings());
            }
            else
                return true;
        };
        return ClientUtil;
    }());
    ClientUtil.outlook = "Outlook";
    ClientUtil.web = "Web";
    ClientUtil.mobile = "Mobile";
    ClientUtil.offline = "Offline";
    /**
     * This handler is invoked when there is change in selected record of Grid.
     * If single record is selected, enable "Merge" Button else disable it.
     */
    ClientUtil.selectedRecordChange = function (context) {
        var formContext = context && context.getFormContext();
        if (!formContext)
            return;
        var entityType = formContext && formContext.data.attributes.get(paramEntityRecord).getValue() &&
            formContext.data.attributes.get(paramEntityRecord).getValue()[odataType];
        try {
            var mergeBtn = formContext.getControl(paramMergeButton);
            var ignoreAndSaveBtn = formContext.getControl(paramIgnoreAndSave);
            var matchingEntityName = formContext.data.attributes.get(paramMatchingEntityName);
            var matchingEntityNameValue = null;
            var selectedRecordArray = ClientUtil._getSelectedRecords(formContext);
            matchingEntityNameValue = matchingEntityName && matchingEntityName.getValue() && JSON.parse(matchingEntityName.getValue());
            var result = entityType && entityType.replace(microsoftDynamicCRM, "");
            if (mergeBtn) {
                if (Array.isArray(selectedRecordArray) && selectedRecordArray.length == 1) {
                    mergeBtn.setDisabled(matchingEntityNameValue !== result);
                    ignoreAndSaveBtn.setDisabled(true);
                }
                else {
                    mergeBtn.setDisabled(true);
                    ignoreAndSaveBtn.setDisabled(false);
                }
            }
        }
        catch (error) {
            ClientUtility.TelemetryReporter.ReportError(context, "selectedRecordChange", JSON.stringify(Error("Error occurred while selecting record from grid. : " + error)), mergeRecordsDialog);
        }
    };
    /**
    * This handler is invoked when on click of "Merge" button from duplicate detection dialog.
    */
    ClientUtil.mergeButtonClickHandller = function (context) {
        var formContext = context && context.getFormContext();
        var record2 = formContext.data.attributes.get(paramEntityRecord).getValue(); //subordinate record
        var result = record2 && record2[odataType];
        var entityType = result && result.replace(microsoftDynamicCRM, "");
        if (!formContext)
            return;
        ClientUtility.TelemetryReporter.ReportInfo(context, "mergeButtonClickHandller", mergeRecordsDialog, null, null, "Duplicate Detection dialog : Merge button clicked", true);
        var selectedRecordArray = ClientUtil._getSelectedRecords(formContext);
        if (Array.isArray(selectedRecordArray) && selectedRecordArray.length > 0) {
            var dlgDialogBox_1 = { width: 800, height: 600, position: 1 /* center */ };
            var dialogParams_1 = {};
            dialogParams_1["entity_type"] = entityType && entityType;
            dialogParams_1["entity_record"] = selectedRecordArray[0];
            dialogParams_1["entity_record2"] = record2;
            if (record2) {
                //When Duplicate Dialog is launched for "lead" entity with new record it has id which is bug.
                //To over come this bug , retrieving db snapshot for record if its lead record and checking,
                // if record is new or existing.
                if (record2[entityType + "id"] && entityType === ClientUtility.MetadataDrivenDialogConstants.lead) {
                    ClientUtil.getEntityRecord(context, entityType, record2[entityType + "id"]).then(function (response) {
                        if (response)
                            dialogParams_1["param_MergeFlag"] = ClientUtility.MetadataDrivenDialogConstants.paramMerge;
                        Xrm.Navigation.openDialog(mergeRecordsDialog, dlgDialogBox_1, dialogParams_1).then((ClientUtil.closeDupWarningDialogCallback));
                    }, function (error) {
                        delete record2[entityType + "id"];
                        dialogParams_1["entity_record2"] = record2;
                        dialogParams_1["param_MergeFlag"] = ClientUtility.MetadataDrivenDialogConstants.paramUpdate;
                        Xrm.Navigation.openDialog(mergeRecordsDialog, dlgDialogBox_1, dialogParams_1).then((ClientUtil.closeDupWarningDialogCallback));
                    });
                }
                else {
                    if (record2[entityType + "id"])
                        dialogParams_1["param_MergeFlag"] = ClientUtility.MetadataDrivenDialogConstants.paramMerge;
                    else
                        dialogParams_1["param_MergeFlag"] = ClientUtility.MetadataDrivenDialogConstants.paramUpdate;
                    Xrm.Navigation.openDialog(mergeRecordsDialog, dlgDialogBox_1, dialogParams_1).then((ClientUtil.closeDupWarningDialogCallback));
                }
            }
        }
        else {
            ClientUtility.TelemetryReporter.ReportError(context, "mergeButtonClickHandller", "No records are selected to launch merge dialog.", mergeRecordsDialog);
        }
    };
    ClientUtil.closeDupWarningDialogCallback = function (dialogParams) {
        if (dialogParams &&
            dialogParams.parameters &&
            dialogParams.parameters["param_lastButtonClicked"] === "merge_completed") {
            var lastButtonClicked = Xrm.Page.data.attributes.get("param_lastButtonClicked");
            if (lastButtonClicked) {
                lastButtonClicked.setValue("merge_done");
            }
            Xrm.Page.ui.close();
        }
    };
    ClientUtil.duplicateDialogOnLoad = function (context) {
        try {
            var formContext = context && context.getFormContext();
            var mergeBtn_1 = formContext && formContext.getControl(paramMergeButton);
            var mergeMyRecordGrid = formContext.getControl(paramMergeMyRecordGrid);
            var dialogHeader = formContext.getControl(paramDialogHeaderLabel);
            var mergeEnabledEntitiesArr = ["account", "contact", "lead"];
            if (!mergeBtn_1 || !formContext)
                return;
            var entityType = formContext.data.attributes.get(paramEntityRecord).getValue() &&
                formContext.data.attributes.get(paramEntityRecord).getValue()[odataType];
            entityType = entityType && entityType.replace(microsoftDynamicCRM, "");
            var userId = formContext.context.getUserId();
            var sourceEntity = { id: userId, entityType: "systemuser" };
            var privilegeName_1 = "prvMerge";
            var getMergePrivilegesRequest = new ODataContract.RetrieveUserPrivilegeByPrivilegeNameRequest(sourceEntity, privilegeName_1);
            //If entity type is account/contact/lead "Merge" Button will be visible else not
            if (entityType) {
                if (ClientUtil.isClientOnline() && ClientUtil.duplicateDetectionAdminSettings() && (mergeEnabledEntitiesArr.indexOf(entityType) > -1)) {
                    mergeBtn_1.setVisible(true);
                    // Initially, Merge button is disabled until user selects a record to merge with (See `selectedRecordChange`)
                    mergeBtn_1.setDisabled(true);
                    Xrm.WebApi.online.execute(getMergePrivilegesRequest).then(function (response) {
                        if (response) {
                            response.json().then(function (result) {
                                if (!result.RolePrivileges.some(function (role) { return role["PrivilegeName"] === privilegeName_1; })) {
                                    mergeBtn_1.setVisible(false);
                                }
                            });
                        }
                    })
                        .catch(function (error) {
                        ClientUtility.TelemetryReporter.ReportError(context, "getMergePrivilegesRequest", JSON.stringify(Error("Error retrieving merge privilege. : " + error)), mergeRecordsDialog);
                    });
                    mergeMyRecordGrid.setVisible(true);
                    dialogHeader.setVisible(false);
                }
                else {
                    mergeBtn_1.setVisible(false);
                    mergeMyRecordGrid.setVisible(false);
                    dialogHeader.setVisible(true);
                }
            }
        }
        catch (error) {
            ClientUtility.TelemetryReporter.ReportError(context, "duplicateDialogOnLoad", JSON.stringify(Error("Error loading duplicate detection dialog. : " + error)), mergeRecordsDialog);
        }
    };
    ClientUtil._getSelectedRecords = function (formContext) {
        var selectedRecordAttribute = formContext && formContext.data.attributes.get(paramSelectedRecordId);
        return selectedRecordAttribute && selectedRecordAttribute.getValue() ? JSON.parse(selectedRecordAttribute.getValue()) : [];
    };
    ClientUtil.launchUCIMergeDialog = function (gridControl, SelectedControlSelectedItemReferences, SelectedEntityTypeName) {
        ClientUtility.TelemetryReporter.ReportInfo(null, "launchUCIMergeDialog", mergeRecordsDialog, null, null, "Entity Grid : Merge ribbon button clicked", true);
        try {
            var adminSettings = ClientUtil.duplicateDetectionAdminSettings();
            if (ClientUtil.isUCI() && adminSettings) {
                ClientUtil.validateAndLaunchMergeDialog(gridControl, SelectedControlSelectedItemReferences, SelectedEntityTypeName);
            }
            else if (!ClientUtil.isUCI() || !adminSettings) {
                XrmCore.Commands.Merge.mergeRecords(gridControl, SelectedControlSelectedItemReferences, SelectedEntityTypeName);
            }
        }
        catch (error) {
            ClientUtility.TelemetryReporter.ReportError(null, "launchUCIMergeDialog", JSON.stringify(Error("Error launching merge dialog. : " + error)), mergeRecordsDialog);
        }
    };
    ClientUtility.ClientUtil = ClientUtil;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var AppCommon;
(function (AppCommon) {
    var EntityNames = (function () {
        function EntityNames() {
        }
        return EntityNames;
    }());
    EntityNames.Account = "account";
    EntityNames.Contact = "contact";
    EntityNames.CustomerAddress = "customeraddress";
    EntityNames.ConvertRule = "convertrule";
    EntityNames.Mailbox = "mailbox";
    EntityNames.Queue = "queue";
    EntityNames.QueueItem = "queueitem";
    EntityNames.SystemUser = "systemuser";
    EntityNames.Team = "team";
    EntityNames.Territory = "territory";
    EntityNames.CalendarRule = "calendarrule";
    EntityNames.Goal = "goal";
    EntityNames.Metric = "metric";
    EntityNames.RollupField = "rollupfield";
    EntityNames.GoalRollupQuery = "goalrollupquery";
    EntityNames.Calendar = "calendar";
    EntityNames.Connection = "connection";
    AppCommon.EntityNames = EntityNames;
    var EntityTypeCode = (function () {
        function EntityTypeCode() {
        }
        return EntityTypeCode;
    }());
    EntityTypeCode.SystemUser = 8;
    EntityTypeCode.Team = 9;
    EntityTypeCode.SocialActivity = 4216;
    EntityTypeCode.Email = 4202;
    EntityTypeCode.Queue = 2020;
    AppCommon.EntityTypeCode = EntityTypeCode;
})(AppCommon || (AppCommon = {}));
var AppCommon;
(function (AppCommon) {
    var EntityTypeCodes;
    (function (EntityTypeCodes) {
        EntityTypeCodes[EntityTypeCodes["Territory"] = 2013] = "Territory";
    })(EntityTypeCodes = AppCommon.EntityTypeCodes || (AppCommon.EntityTypeCodes = {}));
})(AppCommon || (AppCommon = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../ClientCommon/EntityNames.ts" />
/// <reference path="../../ClientCommon/EntityTypeCodes.ts" />
/// <reference path="../../../../ClientUtility/Client/Common/DataUtil.ts" />
var AppCommon;
(function (AppCommon) {
    var TerritoryLibraryLegacy = (function () {
        function TerritoryLibraryLegacy() {
            this.territoryFormOnLoad = function () {
                var territoryTab = Xrm.Page.ui.tabs.get("subterritories_tab");
                var parentId = Xrm.Page.getControl('parentterritoryid');
                if (Xrm.Internal.isFeatureEnabled('FCB.October2019Update')) {
                    if (!ClientUtility.DataUtil.isNullOrUndefined(parentId)) {
                        parentId.setVisible(true);
                    }
                    if (!ClientUtility.DataUtil.isNullOrUndefined(territoryTab)) {
                        territoryTab.setVisible(true);
                    }
                }
            };
            var mscrm = window.Mscrm;
            mscrm.managerid_setadditionalparams = function (context) {
                var sTerritoryId = "";
                if ($get('crmFormSubmit') != null) {
                    sTerritoryId = $get('crmFormSubmit').crmFormSubmitId.value;
                }
                else {
                    sTerritoryId = Xrm.Page.entityReference.id;
                }
                var fetchXml = '<filter type="and"><condition attribute="currentid" operator="eq" value="' + sTerritoryId + '"/><condition attribute="currentObjectType" operator="eq" value="' + AppCommon.EntityTypeCodes.Territory + '"/></filter>';
                var lookupControl = Xrm.Page.ui.controls.get("managerid");
                lookupControl.addCustomFilter(fetchXml, AppCommon.EntityNames.Territory);
            };
        }
        return TerritoryLibraryLegacy;
    }());
    AppCommon.TerritoryLibraryLegacy = TerritoryLibraryLegacy;
})(AppCommon || (AppCommon = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="DataUtil.ts" />
var ClientUtility;
(function (ClientUtility) {
    var Guid = (function () {
        function Guid() {
        }
        Guid.create = function (guidValue) {
            var rawGuidValue = Guid.getRawGuid(guidValue);
            // TODO: throw argument out of range if rawGuid is null
            return Guid.getFormattedGuid(rawGuidValue);
        };
        Guid.tryCreate = function (guidValue) {
            var rawGuidValue = Guid.getRawGuid(guidValue);
            if (ClientUtility.DataUtil.isNullOrEmptyString(rawGuidValue)) {
                return Guid.Empty;
            }
            return Guid.getFormattedGuid(rawGuidValue);
        };
        Guid.getFormattedGuid = function (rawGuidValue) {
            var formattedGuidValue = rawGuidValue.substring(0, 8) +
                "-" +
                rawGuidValue.substring(8, 12) +
                "-" +
                rawGuidValue.substring(12, 16) +
                "-" +
                rawGuidValue.substring(16, 20) +
                "-" +
                rawGuidValue.substring(20, 32);
            return formattedGuidValue;
        };
        Guid.getRawGuid = function (guidValue) {
            if (ClientUtility.DataUtil.isNullOrEmptyString(guidValue)) {
                return null;
            }
            var parsedValue = guidValue.replace('{', '').replace('}', '').replace(new RegExp('-', 'g'), '').toLowerCase();
            if (Guid.HyphenGuidVerifierPattern.test(parsedValue) || Guid.BraceAndHyphenGuidVerifierPattern.test(parsedValue)) {
                return parsedValue.replace(Guid.GuidStripperPattern, "");
            }
            else if (Guid.ContiguousGuidVerifierPattern.test(parsedValue)) {
                return parsedValue;
            }
            return null;
        };
        Guid.formatToUpper = function (sourceGuid) {
            if (ClientUtility.DataUtil.isNullOrUndefined(sourceGuid)) {
                return sourceGuid;
            }
            // pattern only recognizes lower case
            sourceGuid = sourceGuid.toLowerCase();
            if (Guid.BraceAndHyphenGuidVerifierPattern.test(sourceGuid)) {
                return sourceGuid.toUpperCase();
            }
            else {
                return String.format("{{{0}}}", sourceGuid.toUpperCase());
            }
        };
        //TODO: Replace this with the core implementation
        Guid.newGuid = function () {
            var HexChars = '0123456789abcdef';
            var GuidSize = 36;
            var sGuid = new Sys.StringBuilder();
            for (var i = 0; i < GuidSize; i++) {
                if (i === 14) {
                    sGuid.append('4');
                    continue;
                }
                if (i === 8 || i === 13 || i === 18 || i === 23) {
                    sGuid.append('-');
                    continue;
                }
                if (i === 19) {
                    var n = Math.floor(Math.random() * 16);
                    HexChars.substr(n & 3 | 8, 1);
                }
                sGuid.append(HexChars.substr(Math.floor(Math.random() * 16), 1));
            }
            return sGuid.toString();
        };
        return Guid;
    }());
    Guid.Empty = "00000000-0000-0000-0000-000000000000";
    Guid.HyphenGuidVerifierPattern = new RegExp("^(\\d|[a-f]){8}-(\\d|[a-f]){4}-(\\d|[a-f]){4}-(\\d|[a-f]){4}-(\\d|[a-f]){12}$");
    Guid.BraceAndHyphenGuidVerifierPattern = new RegExp("^\{(\\d|[a-f]){8}-(\\d|[a-f]){4}-(\\d|[a-f]){4}-(\\d|[a-f]){4}-(\\d|[a-f]){12}\}$");
    Guid.ContiguousGuidVerifierPattern = new RegExp("^(\\d|[a-f]){32}$");
    Guid.GuidStripperPattern = new RegExp("{|}", "g");
    ClientUtility.Guid = Guid;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../ClientCommon/EntityNames.ts" />
/// <reference path="../../ClientCommon/EntityTypeCodes.ts" />
/// <reference path="../../../../TypeDefinitions/AppCommon/Localization/ResourceStringProvider.d.ts" />
/// <reference path="../../../../ClientUtility/Client/Common/Guid.ts" />
/// <reference path="../../../../ClientUtility/Client/Common/DataUtil.ts" />
var AppCommon;
(function (AppCommon) {
    var TerritoryLibrary = (function () {
        function TerritoryLibrary() {
            this.territoryFormOnLoad = function () {
                var territoryTab = Xrm.Page.ui.tabs.get("subterritories_tab");
                var parentId = Xrm.Page.ui.controls.get('parentterritoryid');
                if (Xrm.Internal.isFeatureEnabled('October2019Update')) {
                    if (!ClientUtility.DataUtil.isNullOrUndefined(parentId)) {
                        parentId.setVisible(true);
                    }
                    if (!ClientUtility.DataUtil.isNullOrUndefined(territoryTab)) {
                        territoryTab.setVisible(true);
                    }
                }
            };
            var mscrm = window.Mscrm;
            mscrm.managerid_setadditionalparams = function (context) {
                // do nothing.
            };
            mscrm.territoryAddExistingMember = function (grid) {
                var global = window;
                var xrmCore = global.XrmCore;
                xrmCore.Commands.AddFromSubGrid.addExistingFromSubGridStandard(AppCommon.EntityTypeCode.SystemUser, grid);
            };
            mscrm.territoryRemoveMember = function (objectId, gridControl, records) {
                var confirmDialogStrings = new Object({
                    "title": AppCommon.ResourceStringProvider.getResourceString("Dialog_Title_RemoveUsers"),
                    "text": String.format(AppCommon.ResourceStringProvider.getResourceString("Dialog_Description_RemoveUsers"), records.length),
                    "confirmButtonLabel": AppCommon.ResourceStringProvider.getResourceString("Dialog_RemoveButton_Label_RemoveUsers")
                });
                window.Xrm.Navigation.openConfirmDialog(confirmDialogStrings, null).then(function (response) {
                    var _this = this;
                    if (response.confirmed) {
                        var territoryId_1 = ClientUtility.Guid.tryCreate(Xrm.Page.data.entity.getId());
                        var managerIdAttribute = Xrm.Page.data.entity.attributes.get('managerid');
                        var managerIdAttributeValues = managerIdAttribute ? managerIdAttribute.getValue() : null;
                        var managerid_1 = managerIdAttributeValues && managerIdAttributeValues.length !== 0 ? ClientUtility.Guid.tryCreate((managerIdAttributeValues[0]).id) : ClientUtility.Guid.Empty;
                        var disassociateRequests_1 = [];
                        records.map(function (value, index) {
                            var userId = ClientUtility.Guid.tryCreate(value.Id);
                            var targetTerritory = {
                                id: territoryId_1,
                                name: "",
                                entityType: AppCommon.EntityNames.Territory
                            };
                            var territoryDisassociateRequest = new ODataDisassociateRequest(targetTerritory, "territory_system_users", userId);
                            if (managerid_1 === userId) {
                                var targetUser = {
                                    id: managerid_1,
                                    name: "",
                                    entityType: AppCommon.EntityNames.SystemUser
                                };
                                // Executing in a transaction
                                disassociateRequests_1.push([territoryDisassociateRequest, new ODataDisassociateRequest(targetUser, "system_user_territories", territoryId_1)]);
                            }
                            else {
                                disassociateRequests_1.push(territoryDisassociateRequest);
                            }
                        });
                        Xrm.WebApi.online.executeMultiple(disassociateRequests_1).then(function () { gridControl.refresh(); }, function () {
                            window.Xrm.Navigation.openAlertDialog({
                                "text": String.format(AppCommon.ResourceStringProvider.getResourceString("AlertDialog_Text_RemoveUsers_Failure"), _this.status, _this.statusText, _this.responseText)
                            });
                        });
                    }
                });
            };
        }
        return TerritoryLibrary;
    }());
    AppCommon.TerritoryLibrary = TerritoryLibrary;
    var ODataDisassociateRequest = (function () {
        function ODataDisassociateRequest(target, relationship, relatedEntityId) {
            this.target = target;
            this.relationship = relationship;
            this.relatedEntityId = relatedEntityId || null;
        }
        ODataDisassociateRequest.prototype.getMetadata = function () {
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
                    "relatedEntityId": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1 /* PrimitiveType */,
                    },
                },
                operationName: "Disassociate",
                operationType: 2,
            };
        };
        return ODataDisassociateRequest;
    }());
})(AppCommon || (AppCommon = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../ClientUtility/Client/Common/ClientUtil.ts" />
/// <reference path="./Legacy/TerritoryLibraryLegacy.ts" />
/// <reference path="./UCI/TerritoryLibrary.ts" />
/// <reference path="../../../ClientUtility/Client/Common/Utils.NoClientApi/ClientUtils.ts" />
var AppCommon;
(function (AppCommon) {
    /**
    * Wrapper class to instantiate library for Territory
    */
    var Territory = (function () {
        function Territory() {
        }
        return Territory;
    }());
    Territory.Instance = ClientUtility.ClientUtil.isUCI() ? new AppCommon.TerritoryLibrary() : new AppCommon.TerritoryLibraryLegacy();
    Territory.ctor = (function () {
        // These are needed on the window because of "general" command bar actions calling hard-coded methods with some conditions
    })();
    AppCommon.Territory = Territory;
})(AppCommon || (AppCommon = {}));
