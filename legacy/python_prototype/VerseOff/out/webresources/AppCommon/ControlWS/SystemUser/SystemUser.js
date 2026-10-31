var ODataContract;
(function (ODataContract) {
    var AssignAllRecordsTeamRequest = (function () {
        function AssignAllRecordsTeamRequest(oldOwnerId, oldOwnerType, newOwnerId, newOwnerType) {
            this.OldOwnerId = oldOwnerId;
            this.OldOwnerType = oldOwnerType;
            this.NewOwnerId = newOwnerId;
            this.NewOwnerType = newOwnerType;
        }
        AssignAllRecordsTeamRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "OldOwnerId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                    "OldOwnerType": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1,
                    },
                    "NewOwnerId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                    "NewOwnerType": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1,
                    },
                },
                operationName: "AssignAllRecordsTeam",
                operationType: 0,
            };
            return metadata;
        };
        return AssignAllRecordsTeamRequest;
    }());
    ODataContract.AssignAllRecordsTeamRequest = AssignAllRecordsTeamRequest;
})(ODataContract || (ODataContract = {}));
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var DialogConstants = (function () {
            function DialogConstants() {
            }
            return DialogConstants;
        }());
        //Width to be used for all the dialogs.
        DialogConstants.DialogWidth = "300px";
        DialogConstants.ChangeManagerDialogName = "ChangeManager";
        DialogConstants.ReassignDialogName = "ReassignAllRecords";
        DialogConstants.JoinTeamsDialogName = "JoinTeams";
        DialogConstants.ManageUserRolesDialogName = "ManageSystemUserRoles";
        DialogConstants.ManageTeamRolesDialogName = "ManageTeamRoles";
        DialogConstants.AddTeamMembersDialogName = "AddMembers";
        DialogConstants.RemoveTeamMembersDialogName = "RemoveMembers";
        DialogConstants.DialogOkId = "ok_id";
        DialogConstants.OwnerId = "owner_id";
        DialogConstants.OwnerType = "owner_type";
        DialogConstants.EntityId = "entity_id";
        DialogConstants.EntityName = "entity_name";
        DialogConstants.LastButtonClicked = "last_button_clicked";
        DialogConstants.SystemUserViewId = "systemuserview_id";
        DialogConstants.EntityRecords = "entity_records";
        DialogConstants.TargetEntities = "target_entities";
        DialogConstants.RowsData = "rows_data";
        DialogConstants.UserRolesMap = "user_rolesmap";
        DialogConstants.TeamRolesMap = "team_rolesmap";
        DialogConstants.ColumnsDefinition = "columns_definition";
        DialogConstants.TotalRecordsSelected = "total_records_selected";
        DialogConstants.SelectedRecords = "selected_records";
        DialogConstants.ParentId = "parent_id";
        DialogConstants.ChangeManagerControlId = "changemanagercontrol_id";
        DialogConstants.customLabel = "custom_label";
        DialogConstants.ErrorKey_GenericErrorOccurred = "SMBAdvSettings_GenericErrorOccurred";
        AppCommon.DialogConstants = DialogConstants;
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
/// <reference path="../ClientCommon/DialogConstants.ts" />
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        //Contains common utils needed for command handling for Team Management Settings
        var DialogUtils = (function () {
            function DialogUtils() {
            }
            /**
             * function to get value of the control
             * @param uiControlId control id of MDD control
             */
            DialogUtils.GetControlValue = function (uiControlId) {
                var control = Xrm.Page.ui.controls.get(uiControlId);
                if (control) {
                    var controlAttribute = control.getAttribute();
                    if (controlAttribute) {
                        return controlAttribute.getValue();
                    }
                }
            };
            /**
             * function to set the value in control
             * @param uiControlId control id of MDD control
             * @param value value that needs to be set on control
             */
            DialogUtils.SetControlValue = function (uiControlId, value) {
                var control = Xrm.Page.ui.controls.get(uiControlId);
                if (control) {
                    var controlAttribute = control.getAttribute();
                    if (controlAttribute) {
                        controlAttribute.setValue(value);
                    }
                }
            };
            /**
             * function to Disable the control
             * @param uiControl control id of MDD control
             */
            DialogUtils.DisableControl = function (uiControlId) {
                var control = Xrm.Page.ui.controls.get(uiControlId);
                if (control) {
                    control.setDisabled(true);
                }
            };
            /**
             * function to Enable the control
             * @param uiControl control id of MDD control
             */
            DialogUtils.EnableControl = function (uiControlId) {
                var control = Xrm.Page.ui.controls.get(uiControlId);
                if (control) {
                    control.setDisabled(false);
                }
            };
            /**
             * function to set visibility of the control
             * @param uiControl control id of MDD control
             * @param value visibility of the control
             */
            DialogUtils.SetVisible = function (uiControlId, value) {
                var control = Xrm.Page.ui.controls.get(uiControlId);
                if (control) {
                    control.setVisible(value);
                }
            };
            /**
             * Handles an error returned from the server
             * @param error error object thrown by server
             */
            DialogUtils.HandleServerError = function (error) {
                if (DialogUtils.isNullOrUndefined(error)
                    || DialogUtils.isNullOrUndefined(error.errorCode)
                    || error.errorCode == 0
                    || (!DialogUtils.isNullOrUndefined(error.errorCode) && !DialogUtils.isNullOrUndefined(error.message) && error.message == "")) {
                    //when errorCode is 0/null/undefined then we won't get localized error from server, so show generic CRM error
                    //when errorMessage is empty then show generic CRM error
                    DialogUtils.ShowLocalizedErrorByResourceKey(AppCommon.DialogConstants.ErrorKey_GenericErrorOccurred);
                    return;
                }
                console.error("Error : " + error.message);
                var errorDialogOptions = {
                    message: error.message,
                    errorCode: error.errorCode
                };
                Xrm.Navigation.openErrorDialog(errorDialogOptions);
            };
            /**
             * Shows generic error message to user
             * @param message optional message to log error on console
             */
            DialogUtils.ShowGenericError = function (message) {
                if (!DialogUtils.isNullOrUndefined(message)) {
                    console.error(message);
                }
                DialogUtils.ShowLocalizedErrorByResourceKey(AppCommon.DialogConstants.ErrorKey_GenericErrorOccurred);
            };
            /**
             * Retrieves localized string
             * @param key
             */
            DialogUtils.getLocalizedString = function (key) {
                var webResourceName = "AppCommon/Localization/Languages/AppCommon";
                var value = Xrm.Utility.getResourceString(webResourceName, key);
                if (value === undefined || value === null) {
                    value = key;
                }
                return value;
            };
            /**
             * Retrieves localized string for a given key and shows that in an alert dialog
             * @param key resourceKey of AppCommon resx file
             */
            DialogUtils.ShowLocalizedErrorByResourceKey = function (key) {
                var error = DialogUtils.getLocalizedString(key);
                console.error("Error : " + error);
                Xrm.Utility.alertDialog(error);
            };
            /**
             * checks whether object is Null or undefined
             * @param item any object
             */
            DialogUtils.isNullOrUndefined = function (item) {
                if (item == null || item == undefined) {
                    return true;
                }
                else {
                    return false;
                }
            };
            /**
             * Get clienturl
             */
            DialogUtils.getClientUrl = function () {
                return Xrm.Page.context.getClientUrl();
            };
            /**
             * displays error to user using alert dialog
             * @param err error that needs to be displayed
             */
            DialogUtils.handleError = function (err) {
                console.log(err.message);
                Xrm.Utility.alertDialog(err.message);
            };
            /**
             * Gets the businessunit related data of current user
             * returns promise same as Xrm.WebApi.online.retrieveRecord
             */
            DialogUtils.GetCurrentUserBusinessUnitData = function () {
                var userId = Xrm.Page.context.getUserId();
                userId = userId.replace(/[{}]/g, '');
                return Xrm.WebApi.retrieveRecord("systemuser", userId, "?$select=systemuserid&$expand=businessunitid($select=name,businessunitid)");
            };
            DialogUtils.createActionFailedErrorDialog = function (errorResponse) {
                Mscrm.AppCommon.DialogUtils.hideProgressIndicator();
                var errorDialogOptions = {
                    message: errorResponse.message,
                    errorCode: errorResponse.errorCode
                };
                Xrm.Navigation.openErrorDialog(errorDialogOptions);
            };
            DialogUtils.actionFailedCallback = function (response) {
                Mscrm.AppCommon.DialogUtils.hideProgressIndicator();
                DialogUtils.HandleServerError(response);
            };
            DialogUtils.getETC = function (entityName) {
                switch (entityName) {
                    case 'systemuser':
                        return 8;
                    case 'team':
                        return 9;
                }
                throw new Error("Invalid entity: " + entityName);
            };
            DialogUtils.hideProgressIndicator = function () {
                Xrm.Utility.closeProgressIndicator();
            };
            DialogUtils.showProgressIndicator = function (message) {
                if (message == null) {
                    Xrm.Utility.showProgressIndicator();
                }
                else {
                    Xrm.Utility.showProgressIndicator(message);
                }
            };
            DialogUtils.showGlobalNotification = function (message, title) {
                Xrm.UI.addGlobalNotification(1 /* toast */, 1 /* success */, message, title, null);
            };
            DialogUtils.showGlobalNotification_GenericError = function () {
                Xrm.UI.addGlobalNotification(1 /* toast */, 2 /* error */, DialogUtils.getLocalizedString(AppCommon.DialogConstants.ErrorKey_GenericErrorOccurred), "", null);
            };
            return DialogUtils;
        }());
        AppCommon.DialogUtils = DialogUtils;
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../../Controls/FREShell/DataContracts/AssignAllRecordsTeamRequest.ts" />
/// <reference path="../ClientCommon/DialogConstants.ts" />
/// <reference path="../ClientCommon/DialogUtils.ts" />
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var REASSIGNRECORDS = "SystemUser_ReassignAllRecords";
        var REASSIGNRECORDSCLICKED = "SystemUser_ReassignAllRecords Clicked";
        var REASSIGNRECORDSCOMPLETED = "SystemUser_ReassignAllRecords Completed";
        var AssignAllRecordsTeamRequest = ODataContract.AssignAllRecordsTeamRequest;
        var SystemUser_ReassignAllRecords = (function () {
            function SystemUser_ReassignAllRecords() {
                var _this = this;
                this.assignCloseDialog = function (eventContext) {
                    var formContext = eventContext.getFormContext();
                    formContext.ui.close();
                };
                /**
                * Assign Dialog rdoMe onChange function
                */
                this.assignDialogAssignToChange = function (eventContext) {
                    var formContext = eventContext.getFormContext();
                    if (!formContext) {
                        if (Xrm.Page) {
                            formContext = Xrm.Page;
                        }
                        else {
                            // No client API available
                            return;
                        }
                    }
                    var assignTo = formContext.data.attributes.get("rdoMe_id");
                    var assignToLookupControl = formContext.getControl("systemuserview_id");
                    var disableAssignToLookupControl = assignTo.getValue();
                    var assignButton = formContext.getControl(AppCommon.DialogConstants.DialogOkId);
                    if (assignToLookupControl && disableAssignToLookupControl) {
                        assignToLookupControl.setDisabled(false);
                        var lookupValue = assignToLookupControl.getAttribute().getValue();
                        if (assignButton && (!lookupValue || lookupValue.length === 0)) {
                            assignButton.setDisabled(true);
                        }
                    }
                    else {
                        assignToLookupControl.setDisabled(true);
                        if (assignButton) {
                            assignButton.setDisabled(false);
                        }
                    }
                };
                /**
                * Assign Dialog assign click
                */
                this.assignDialogAssignClick = function (eventContext) {
                    var formContext = eventContext.getFormContext();
                    if (!formContext) {
                        if (Xrm.Page) {
                            formContext = Xrm.Page;
                        }
                        else {
                            // No client API available
                            return;
                        }
                    }
                    var ownerId = "";
                    var ownerType = "";
                    var assignTo = formContext.data.attributes.get("rdoMe_id");
                    var assignToLookupControl = formContext.data.attributes.get("systemuserview_id");
                    var disableAssignToLookupControl = assignTo.getValue();
                    if (disableAssignToLookupControl) {
                        var selectedUser = assignToLookupControl.getValue();
                        if (!selectedUser || selectedUser.length === 0) {
                            Xrm.Navigation.openAlertDialog({ text: AppCommon.DialogUtils.getLocalizedString(AppCommon.SystemUserStrings.ErrorStrings) });
                            return;
                        }
                        else {
                            ownerId = selectedUser[0].id;
                            ownerType = selectedUser[0].entityType;
                        }
                    }
                    else {
                        ownerId = formContext.context.getUserId();
                        ownerType = "systemuser";
                    }
                    formContext.data.attributes.get(AppCommon.DialogConstants.OwnerId).setValue(ownerId);
                    formContext.data.attributes.get(AppCommon.DialogConstants.OwnerType).setValue(ownerType);
                    formContext.data.attributes.get(AppCommon.DialogConstants.LastButtonClicked).setValue(AppCommon.DialogConstants.DialogOkId);
                    formContext.ui.close();
                };
                /**
                * Assign dialog lookup on change function
                */
                this.assignDialogSystemUserChange = function (eventContext) {
                    var formContext = eventContext.getFormContext();
                    if (!formContext) {
                        if (Xrm.Page) {
                            formContext = Xrm.Page;
                        }
                        else {
                            // No client API available
                            return;
                        }
                    }
                    var assignToLookupAttribute = formContext.data.attributes.get(AppCommon.DialogConstants.SystemUserViewId);
                    if (assignToLookupAttribute) {
                        var selectedItems = assignToLookupAttribute.getValue();
                        var assignButton = formContext.getControl(AppCommon.DialogConstants.DialogOkId);
                        if (!assignButton) {
                            return;
                        }
                        if (!selectedItems || selectedItems.length === 0) {
                            assignButton.setDisabled(true);
                        }
                        else {
                            assignButton.setDisabled(false);
                        }
                    }
                };
                /**
                * Assign Dialog onload function
                */
                this.assignDialogOnLoad = function (eventContext) {
                    var formContext = eventContext.getFormContext();
                    if (!formContext) {
                        if (Xrm.Page) {
                            formContext = Xrm.Page;
                        }
                        else {
                            // No client API available
                            return;
                        }
                    }
                    var assignTo = formContext.data.attributes.get("rdoMe_id");
                    // Initialize to false
                    if (assignTo) {
                        assignTo.setValue(false);
                    }
                    // Call onChange initially
                    _this.assignDialogAssignToChange(eventContext);
                };
            }
            // Method called when clicking on "Reassign all records" on user/team entity form.
            SystemUser_ReassignAllRecords.prototype.reassignRecordsFromForm = function () {
                SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.USERMANAGEMENT, SmbAppsTelemetryUtility.Controls_EventName.CLICKEDFORMCOMMAND, REASSIGNRECORDS, null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, REASSIGNRECORDSCLICKED, false);
                var id = Xrm.Page.data.entity.getId();
                var entityTypeName = Xrm.Page.data.entity.getEntityName();
                var dialogParams = {};
                dialogParams[AppCommon.DialogConstants.EntityId] = id;
                dialogParams[AppCommon.DialogConstants.EntityName] = entityTypeName;
                dialogParams[AppCommon.DialogConstants.LastButtonClicked] = "";
                dialogParams[AppCommon.DialogConstants.OwnerId] = "";
                dialogParams[AppCommon.DialogConstants.OwnerType] = "";
                var dialogOptions = {
                    position: 2 /* side */,
                    width: AppCommon.DialogConstants.DialogWidth
                };
                Xrm.Navigation.openDialog(AppCommon.DialogConstants.ReassignDialogName, dialogOptions, dialogParams)
                    .then(AppCommon.ReassignAllRecordsCommand.dialogCloseCallback);
            };
            // Method called when clicking on "Reassign all records" on user/team entity grid.
            SystemUser_ReassignAllRecords.prototype.reassignRecordsFromGrid = function (records) {
                SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.USERMANAGEMENT, SmbAppsTelemetryUtility.Controls_EventName.CLICKEDGRIDCOMMAND, REASSIGNRECORDS, null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, REASSIGNRECORDSCLICKED, false);
                if (records && records.length > 0) {
                    var id = records && records[0] ? records[0].Id : null;
                    // removed as part of PR 93124
                    if (id) {
                        id.replace(/[{}]/g, '');
                    }
                    var dialogParams = {};
                    dialogParams[AppCommon.DialogConstants.EntityId] = id;
                    dialogParams[AppCommon.DialogConstants.EntityName] = records[0].TypeName;
                    dialogParams[AppCommon.DialogConstants.LastButtonClicked] = "";
                    dialogParams[AppCommon.DialogConstants.OwnerId] = "";
                    dialogParams[AppCommon.DialogConstants.OwnerType] = "";
                    var dialogOptions = {
                        position: 2 /* side */,
                        width: AppCommon.DialogConstants.DialogWidth
                    };
                    Xrm.Navigation.openDialog(AppCommon.DialogConstants.ReassignDialogName, dialogOptions, dialogParams)
                        .then(AppCommon.ReassignAllRecordsCommand.dialogCloseCallback);
                }
            };
            SystemUser_ReassignAllRecords.prototype.dialogCloseCallback = function (dialogResponse) {
                SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.USERMANAGEMENT, SmbAppsTelemetryUtility.Controls_EventName.CLOSEDCOMMAND, REASSIGNRECORDS, null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, REASSIGNRECORDSCOMPLETED, false);
                if (dialogResponse
                    && dialogResponse.parameters
                    && dialogResponse.parameters[AppCommon.DialogConstants.LastButtonClicked] === AppCommon.DialogConstants.DialogOkId) {
                    // New owner Id
                    var ownerId = {
                        guid: dialogResponse.parameters[AppCommon.DialogConstants.OwnerId].toString()
                    };
                    // Old owner Id
                    var entityId = {
                        guid: dialogResponse.parameters[AppCommon.DialogConstants.EntityId].toString()
                    };
                    // New owner type
                    var ownerType = AppCommon.DialogUtils.getETC(dialogResponse.parameters[AppCommon.DialogConstants.OwnerType].toString());
                    // Old owner type
                    var entityType = AppCommon.DialogUtils.getETC(dialogResponse.parameters[AppCommon.DialogConstants.EntityName].toString());
                    var request = new AssignAllRecordsTeamRequest(entityId, entityType, ownerId, ownerType);
                    AppCommon.DialogUtils.showProgressIndicator(AppCommon.DialogUtils.getLocalizedString(AppCommon.SystemUserStrings.ReassigningRecords));
                    Xrm.WebApi.online.execute(request).then(function (response) {
                        AppCommon.DialogUtils.hideProgressIndicator();
                        console.log(response);
                        // Everything looks OK
                        AppCommon.DialogUtils.showGlobalNotification(AppCommon.DialogUtils.getLocalizedString(AppCommon.SystemUserStrings.SystemUserReassignRecordsSuccessNotification));
                    }, AppCommon.DialogUtils.actionFailedCallback);
                }
            };
            return SystemUser_ReassignAllRecords;
        }());
        AppCommon.ReassignAllRecordsCommand = new SystemUser_ReassignAllRecords();
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
var ODataContract;
(function (ODataContract) {
    var AddMembersTeamRequest = (function () {
        function AddMembersTeamRequest(entity /*Microsoft.Dynamics.CRM.team*/, members) {
            this.entity = entity;
            this.Members = members;
        }
        AddMembersTeamRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.team",
                        "structuralProperty": 5,
                    },
                    "Members": {
                        "typeName": "mscrm.systemuser",
                        "structuralProperty": 4,
                    },
                },
                operationName: "AddMembersTeam",
                operationType: 0,
            };
            return metadata;
        };
        return AddMembersTeamRequest;
    }());
    ODataContract.AddMembersTeamRequest = AddMembersTeamRequest;
})(ODataContract || (ODataContract = {}));
/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../ClientCommon/DialogConstants.ts" />
/// <reference path="../ClientCommon/DialogUtils.ts" />
/// <reference path= "../../Controls/FREShell/DataContracts/AddMembersTeamRequest.ts" />
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var JOINTEAMS = "SystemUser_JoinTeams";
        var JOINTEAMSCLICKED = "SystemUser_JoinTeams Clicked";
        var JOINTEAMSCOMPLETED = "SystemUser_JoinTeams Completed";
        var AddMembersTeamRequest = ODataContract.AddMembersTeamRequest;
        var SystemUser_JoinTeams = (function () {
            function SystemUser_JoinTeams() {
                this.onCancelClick = function (eventContext) {
                    var formContext = eventContext.getFormContext();
                    formContext.ui.close();
                };
                this.onDialogLoad = function (eventContext) {
                    var selectedUsersCount = eventContext.getFormContext().data.attributes.get(AppCommon.DialogConstants.TotalRecordsSelected).getValue();
                    var headerDescription = "";
                    if (selectedUsersCount == 1) {
                        headerDescription = String.format(AppCommon.DialogUtils.getLocalizedString(AppCommon.SystemUserStrings.SystemUserJoinTeamHeaderDescription), selectedUsersCount);
                    }
                    else {
                        headerDescription = String.format(AppCommon.DialogUtils.getLocalizedString(AppCommon.SystemUserStrings.SystemUserJoinTeamPluralHeaderDescription), selectedUsersCount);
                    }
                    eventContext.getFormContext().getControl(AppCommon.SystemUserConstants.HeaderDescription).setLabel(headerDescription);
                };
                this.onJoinTeamsClick = function (eventContext) {
                    var formContext = eventContext.getFormContext();
                    if (!formContext) {
                        if (Xrm.Page) {
                            formContext = Xrm.Page;
                        }
                        else {
                            // No client API available
                            return;
                        }
                    }
                    formContext.data.attributes.get(AppCommon.DialogConstants.LastButtonClicked).setValue(AppCommon.DialogConstants.DialogOkId);
                    formContext.ui.close();
                };
            }
            // Method called when clicking on "Join Teams" on user entity form.
            SystemUser_JoinTeams.prototype.JoinTeamsFromForm = function () {
                SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.USERMANAGEMENT, SmbAppsTelemetryUtility.Controls_EventName.CLICKEDFORMCOMMAND, JOINTEAMS, null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, JOINTEAMSCLICKED, false);
                var dialogParams = {};
                var id = Xrm.Page.data.entity.getId();
                dialogParams[AppCommon.DialogConstants.TargetEntities] = "team";
                dialogParams[AppCommon.DialogConstants.EntityRecords] = "";
                dialogParams[AppCommon.DialogConstants.LastButtonClicked] = "";
                dialogParams[AppCommon.DialogConstants.EntityId] = id;
                dialogParams[AppCommon.DialogConstants.TotalRecordsSelected] = 1;
                dialogParams[AppCommon.DialogConstants.SelectedRecords] = [{ Id: id }];
                var dialogOptions = {
                    position: 2 /* side */,
                    width: AppCommon.DialogConstants.DialogWidth
                };
                Xrm.Navigation.openDialog(AppCommon.DialogConstants.JoinTeamsDialogName, dialogOptions, dialogParams)
                    .then(AppCommon.JoinTeamsCommand.dialogCloseCallback);
            };
            // Method called when clicking on "Join Teams" on user entity grid.
            SystemUser_JoinTeams.prototype.JoinTeamsFromGrid = function (records) {
                SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.USERMANAGEMENT, SmbAppsTelemetryUtility.Controls_EventName.CLICKEDGRIDCOMMAND, JOINTEAMS, null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, JOINTEAMSCLICKED, false);
                if (records && records.length > 0) {
                    var id = records && records[0] ? records[0].Id : null;
                    // removed as part of PR 93124
                    id.replace(/[{}]/g, '');
                    var dialogParams = {};
                    dialogParams[AppCommon.DialogConstants.TargetEntities] = "team";
                    dialogParams[AppCommon.DialogConstants.EntityRecords] = "";
                    dialogParams[AppCommon.DialogConstants.LastButtonClicked] = "";
                    dialogParams[AppCommon.DialogConstants.EntityId] = id;
                    dialogParams[AppCommon.DialogConstants.TotalRecordsSelected] = records.length;
                    dialogParams[AppCommon.DialogConstants.SelectedRecords] = records;
                    var dialogOptions = {
                        position: 2 /* side */,
                        width: AppCommon.DialogConstants.DialogWidth
                    };
                    Xrm.Navigation.openDialog(AppCommon.DialogConstants.JoinTeamsDialogName, dialogOptions, dialogParams)
                        .then(AppCommon.JoinTeamsCommand.dialogCloseCallback);
                }
            };
            SystemUser_JoinTeams.prototype.dialogCloseCallback = function (dialogResponse) {
                SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.USERMANAGEMENT, SmbAppsTelemetryUtility.Controls_EventName.CLOSEDCOMMAND, JOINTEAMS, null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, JOINTEAMSCOMPLETED, false);
                if (dialogResponse
                    && dialogResponse.parameters
                    && dialogResponse.parameters[AppCommon.DialogConstants.LastButtonClicked] === AppCommon.DialogConstants.DialogOkId) {
                    var entityId = dialogResponse.parameters[AppCommon.DialogConstants.EntityId];
                    if (dialogResponse.parameters[AppCommon.DialogConstants.EntityRecords]) {
                        var entityReferences = dialogResponse.parameters[AppCommon.DialogConstants.EntityRecords];
                        var Members = [{ id: entityId, entityType: AppCommon.SystemUserConstants.ENTITY_NAME }];
                        var teamid = "";
                        var addMemberRequests = [];
                        for (var selectedTeam = 0; selectedTeam < entityReferences.length; selectedTeam++) {
                            teamid = entityReferences[selectedTeam].id.toString();
                            var entity = { id: teamid, entityType: AppCommon.SystemUserConstants.TEAM_NAME };
                            var request = new AddMembersTeamRequest(entity, Members);
                            addMemberRequests.push(request);
                        }
                        AppCommon.DialogUtils.showProgressIndicator(AppCommon.DialogUtils.getLocalizedString(AppCommon.SystemUserStrings.ProgressIndicatorMessage));
                        Xrm.WebApi.online.executeMultiple(addMemberRequests).then(function (success) {
                            // Hide progress indicator.
                            AppCommon.DialogUtils.hideProgressIndicator();
                            if (success.every(function (response) { return response.ok; })) {
                                //Everything seems ok
                                AppCommon.DialogUtils.showGlobalNotification(AppCommon.DialogUtils.getLocalizedString(AppCommon.SystemUserStrings.SystemUserJoinTeamsSuccessNotification));
                            }
                            else {
                                SmbAppsTelemetryUtility.TelemetryData.ReportAppComponentFailureTelemetry(null, SmbAppsTelemetryUtility.Controls_PageType.USERMANAGEMENT, success);
                                Xrm.Navigation.openAlertDialog({ text: AppCommon.DialogUtils.getLocalizedString(AppCommon.SystemUserStrings.UnknownErrorMessage) });
                            }
                        }, AppCommon.DialogUtils.actionFailedCallback);
                    }
                }
            };
            return SystemUser_JoinTeams;
        }());
        AppCommon.JoinTeamsCommand = new SystemUser_JoinTeams();
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var FetchXmls = (function () {
            function FetchXmls() {
            }
            return FetchXmls;
        }());
        FetchXmls.GetRoles = "\n\t\t<fetch version=\"1.0\" output-format=\"xml-platform\" mapping=\"logical\" distinct=\"true\">\n\t\t<entity name= \"role\">\n\t\t<attribute name=\"name\"/>\n\t\t<attribute name= \"roleid\"/>{0}</entity></fetch>";
        FetchXmls.GetSystemUserRoles = "\n\t\t<fetch version=\"1.0\" output-format=\"xml-platform\" mapping=\"logical\" distinct=\"true\">\n\t\t\t<entity name=\"systemuser\">\n\t\t\t\t<attribute name=\"systemuserid\"/>\n\t\t\t\t<link-entity name=\"systemuserroles\" from=\"systemuserid\" to=\"systemuserid\" intersect=\"true\" alias=\"systemuserroles\">\n\t\t\t\t<attribute name= \"roleid\"/>\n\t\t\t\t{0}\n\t\t\t\t</link-entity>\n\t\t\t</entity>\n\t\t</fetch>";
        FetchXmls.GetTeamRoles = "\n\t\t<fetch version=\"1.0\" output-format=\"xml-platform\" mapping=\"logical\" distinct=\"true\">\n\t\t\t<entity name=\"team\">\n\t\t\t\t<attribute name=\"teamid\"/>\n\t\t\t\t<link-entity name=\"teamroles\" from=\"teamid\" to=\"teamid\" intersect=\"true\" alias=\"teamroles\">\n\t\t\t\t<attribute name= \"roleid\"/>\n\t\t\t\t{0}\n\t\t\t\t</link-entity>\n\t\t\t</entity>\n\t\t</fetch>";
        FetchXmls.AppModuleRolesLinkEntity = "\n\t\t<link-entity name=\"appmoduleroles\" from=\"roleid\" to=\"roleid\" visible=\"false\">\n\t\t{0}</link-entity>";
        FetchXmls.ANDFilter = "<filter type=\"and\">{0}</filter>";
        FetchXmls.ORFilter = "<filter type=\"or\">{0}</filter>";
        FetchXmls.InOperatorValue = "<value>{0}</value>";
        FetchXmls.AppIdCondition = "<condition attribute=\"appmoduleid\" operator= \"eq\" value= \"{0}\" alias=\"appmoduleroles\"/>";
        FetchXmls.SystemUserIdCondition = "<condition attribute=\"systemuserid\" operator=\"in\">{0}</condition>";
        FetchXmls.TeamIdCondition = "<condition attribute=\"teamid\" operator=\"in\">{0}</condition>";
        FetchXmls.FetchXmlQueryString = "?fetchXml=";
        AppCommon.FetchXmls = FetchXmls;
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
var ODataContract;
(function (ODataContract) {
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
    ODataContract.ODataDisassociateRequest = ODataDisassociateRequest;
})(ODataContract || (ODataContract = {}));
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
/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../ClientCommon/DialogConstants.ts" />
/// <reference path="../ClientCommon/DialogUtils.ts" />
/// <reference path="../ClientCommon/FetchXmls.ts" />
/// <reference path="../../../../../references/external/TypeDefinitions/microsoft.ajax.d.ts" />
/// <reference path="../../Controls/FREShell/DataContracts/DisassociateRoleRequest.ts" />
/// <reference path="../../Controls/FREShell/DataContracts/AssociateRoleRequest.ts" />
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var AssociateRequest = ODataContract.ODataAssociateRequest;
        var DisassociateRequest = ODataContract.ODataDisassociateRequest;
        var MANAGEROLES = "SystemUser_ManageRoles";
        var MANAGEROLESCLICKED = "SystemUser_ManageRoles Clicked";
        var MANAGEROLESCOMPLETED = "SystemUser_ManageRoles Completed";
        var SYSTEMUSER_ROLE_RELATIONSHIP = "systemuserroles_association";
        var SYSTEMUSER_ENTITYNAME = "systemuser";
        var ROLE_ENTITYNAME = "role";
        var SystemUser_ManageRoles = (function () {
            function SystemUser_ManageRoles() {
                this.LoadingData = "Loading data";
                this.checkBoxControlID = "manageroles_cc-manageroles_cc.field-RolesContainer_cb";
                this.onCancelClick = function (eventContext) {
                    var formContext = eventContext.getFormContext();
                    formContext.ui.close();
                };
                this.onDialogLoad = function (eventContext) {
                    var selectedUsersCount = eventContext.getFormContext().data.attributes.get(AppCommon.DialogConstants.TotalRecordsSelected).getValue();
                    var headerDescription = "";
                    if (selectedUsersCount == 1) {
                        headerDescription = String.format(AppCommon.DialogUtils.getLocalizedString(AppCommon.SystemUserStrings.SystemUserManageRolesHeaderDescription), selectedUsersCount);
                    }
                    else {
                        headerDescription = String.format(AppCommon.DialogUtils.getLocalizedString(AppCommon.SystemUserStrings.SystemUserManageRolesPluralHeaderDescription), selectedUsersCount);
                    }
                    eventContext.getFormContext().getControl(AppCommon.SystemUserConstants.SystemUserManageRoles_SelectedRecordsLabel).setLabel(headerDescription);
                };
                this.onOkClick = function (eventContext) {
                    var formContext = eventContext.getFormContext();
                    if (!formContext) {
                        if (Xrm.Page) {
                            formContext = Xrm.Page;
                        }
                        else {
                            // No client API available
                            return;
                        }
                    }
                    formContext.data.attributes.get(AppCommon.DialogConstants.LastButtonClicked).setValue(AppCommon.DialogConstants.DialogOkId);
                    formContext.ui.close();
                };
            }
            // Method called when clicking on "Manage Roles" on user entity form.
            SystemUser_ManageRoles.prototype.ManageRolesFromForm = function () {
                SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.USERMANAGEMENT, SmbAppsTelemetryUtility.Controls_EventName.CLICKEDFORMCOMMAND, MANAGEROLES, null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, MANAGEROLESCLICKED, false);
                var dialogParams = {};
                var id = Xrm.Page.data.entity.getId();
                dialogParams[AppCommon.DialogConstants.SelectedRecords] = [{ Id: id }];
                dialogParams[AppCommon.DialogConstants.TotalRecordsSelected] = 1;
                AppCommon.ManageUserRolesCommand.manageRolesInternal(dialogParams);
            };
            // Method called when clicking on "Manage Roles" on user entity grid.
            SystemUser_ManageRoles.prototype.ManageRolesFromGrid = function (records) {
                SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.USERMANAGEMENT, SmbAppsTelemetryUtility.Controls_EventName.CLICKEDGRIDCOMMAND, MANAGEROLES, null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, MANAGEROLESCLICKED, false);
                if (records && records.length > 0) {
                    var dialogParams = {};
                    dialogParams[AppCommon.DialogConstants.SelectedRecords] = records;
                    dialogParams[AppCommon.DialogConstants.TotalRecordsSelected] = records.length;
                    AppCommon.ManageUserRolesCommand.manageRolesInternal(dialogParams);
                }
            };
            SystemUser_ManageRoles.prototype.manageRolesInternal = function (dialogParams) {
                dialogParams[AppCommon.DialogConstants.LastButtonClicked] = "";
                var selectedRecords = dialogParams[AppCommon.DialogConstants.SelectedRecords];
                var dialogOptions = {
                    position: 2 /* side */,
                    width: AppCommon.DialogConstants.DialogWidth
                };
                this._observeAction = this.observeAction.bind(this);
                this._observeObject = window.top.document.querySelector('#ApplicationShell');
                this.startObservation();
                AppCommon.DialogUtils.showProgressIndicator(AppCommon.ManageUserRolesCommand.LoadingData);
                return AppCommon.ManageUserRolesCommand.getData(selectedRecords)
                    .then(function (response) {
                    AppCommon.DialogUtils.hideProgressIndicator();
                    if (response && response.length && response.length == 2) {
                        // Populate column definitions
                        dialogParams[AppCommon.DialogConstants.ColumnsDefinition] = AppCommon.ManageUserRolesCommand.getColumnDefinitions();
                        // Contains mapping of userId -> Array of RoleIds
                        var userRolesMap_1 = {};
                        // Keeps track of all the roles assigned
                        var assignedRoles_1 = {};
                        // Right now due to bug, the Odata API is returning value with keys like
                        // systemuserroles_0xee_roleid. Putting below code as a workaround for that.
                        // After bug fix keys should be like systemuserroles.roleid
                        var roleIdKey_1 = response[1].entities && response[1].entities.length > 0
                            ? AppCommon.ManageUserRolesCommand.getKeyBeginningWith(response[1].entities[0], "systemuserroles")
                            : "";
                        // response[1] => User roles
                        response[1].entities.forEach(function (value) {
                            userRolesMap_1[value.systemuserid] = userRolesMap_1[value.systemuserid] || [];
                            userRolesMap_1[value.systemuserid].push(value[roleIdKey_1]);
                            assignedRoles_1[value[roleIdKey_1]] = true;
                        });
                        dialogParams[AppCommon.DialogConstants.UserRolesMap] = userRolesMap_1;
                        // If there is only a single user selected, then we need to show corresponding roles as selected
                        var shouldShowRolesAsSelected_1 = selectedRecords.length == 1;
                        // response[0] => Roles Data
                        dialogParams[AppCommon.DialogConstants.RowsData] = response[0].entities.filter(function (value) {
                            if (value.roleid.toLowerCase() === AppCommon.SystemUserConstants.SalesBusinessAppRoleGuid) {
                                return false;
                            }
                            return true;
                        }).map(function (value) {
                            var isSelected = shouldShowRolesAsSelected_1;
                            return {
                                Id: value.roleid,
                                IsSelected: isSelected && assignedRoles_1[value.roleid],
                                CellValues: {
                                    rolename: value.name
                                }
                            };
                        });
                        // We got the data, process and proceed
                        Xrm.Navigation.openDialog(AppCommon.DialogConstants.ManageUserRolesDialogName, dialogOptions, dialogParams)
                            .then(AppCommon.ManageUserRolesCommand.dialogCloseCallback);
                    }
                }, AppCommon.DialogUtils.actionFailedCallback);
            };
            SystemUser_ManageRoles.prototype.getData = function (selectedRecords) {
                return Xrm.Utility.getGlobalContext().getCurrentAppProperties()
                    .then(function (appProperties) {
                    var appId = null;
                    if (appProperties) {
                        appId = appProperties["appId"];
                    }
                    return appId;
                })
                    .then(function (appId) {
                    // process appId -> create requests and return the requests
                    var appIdCondition = AppCommon.ManageUserRolesCommand.buildAppIdConditionXML(appId);
                    var getRolesFetchXML = String.format(AppCommon.FetchXmls.GetRoles, appIdCondition);
                    var getSystemUserRolesFetchXML = String.format(AppCommon.FetchXmls.GetSystemUserRoles, appIdCondition
                        + AppCommon.ManageUserRolesCommand.buildSystemUserIdConditionXML(selectedRecords));
                    var getRolesPromise = Xrm.WebApi.retrieveMultipleRecords(ROLE_ENTITYNAME, AppCommon.FetchXmls.FetchXmlQueryString + getRolesFetchXML);
                    var getSystemUserRolesPromise = Xrm.WebApi.retrieveMultipleRecords(SYSTEMUSER_ENTITYNAME, AppCommon.FetchXmls.FetchXmlQueryString + getSystemUserRolesFetchXML);
                    return window.Promise.all([getRolesPromise, getSystemUserRolesPromise]);
                });
            };
            SystemUser_ManageRoles.prototype.getKeyBeginningWith = function (record, prefix) {
                var matchedKey = "";
                Object.keys(record).forEach(function (key) {
                    if (key.indexOf(prefix) >= 0)
                        matchedKey = key;
                });
                return matchedKey;
            };
            SystemUser_ManageRoles.prototype.buildAppIdConditionXML = function (appId) {
                if (appId) {
                    var appIdConditionXML = String.format(AppCommon.FetchXmls.AppIdCondition, appId);
                    var andFilter = String.format(AppCommon.FetchXmls.ANDFilter, appIdConditionXML);
                    return String.format(AppCommon.FetchXmls.AppModuleRolesLinkEntity, andFilter);
                }
                return "";
            };
            SystemUser_ManageRoles.prototype.buildSystemUserIdConditionXML = function (selectedRecords) {
                var systemUserIds = "";
                selectedRecords.forEach(function (value) {
                    systemUserIds += String.format(AppCommon.FetchXmls.InOperatorValue, value.Id);
                });
                return String.format(AppCommon.FetchXmls.ANDFilter, String.format(AppCommon.FetchXmls.SystemUserIdCondition, systemUserIds) // Wrap up the values in "And" filter tag
                );
            };
            SystemUser_ManageRoles.prototype.getColumnDefinitions = function () {
                return {
                    "rolename": {
                        Name: "rolename",
                        DisplayName: AppCommon.DialogUtils.getLocalizedString(AppCommon.SystemUserStrings.SystemUserManageRolesTableHeader),
                        Width: 200
                    }
                };
            };
            SystemUser_ManageRoles.prototype.dialogCloseCallback = function (dialogResponse) {
                SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.USERMANAGEMENT, SmbAppsTelemetryUtility.Controls_EventName.CLOSEDCOMMAND, MANAGEROLES, null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, MANAGEROLESCOMPLETED, false);
                if (dialogResponse
                    && dialogResponse.parameters
                    && dialogResponse.parameters[AppCommon.DialogConstants.LastButtonClicked] === AppCommon.DialogConstants.DialogOkId) {
                    var selectedRecords = dialogResponse.parameters[AppCommon.DialogConstants.SelectedRecords];
                    if (dialogResponse.parameters[AppCommon.DialogConstants.RowsData]) {
                        var userRolesMap = dialogResponse.parameters[AppCommon.DialogConstants.UserRolesMap];
                        var roles = dialogResponse.parameters[AppCommon.DialogConstants.RowsData];
                        var userIds_1 = [];
                        selectedRecords.forEach(function (item) { return userIds_1.push(item.Id); });
                        var roleIdSelected_1 = [];
                        roles.forEach(function (item) { if (item.IsSelected) {
                            roleIdSelected_1.push(item.Id);
                        } });
                        AppCommon.ManageUserRolesCommand.updateUserRoles(userIds_1, roleIdSelected_1, userRolesMap);
                    }
                }
            };
            SystemUser_ManageRoles.prototype.updateUserRoles = function (userIds, rolesSelected, userRoleMap) {
                var disasscoiateRequests = [];
                var associateRequests = [];
                var allRequests = [];
                for (var userIndex in userIds) {
                    var selectedUserId = userIds[userIndex];
                    selectedUserId = selectedUserId.replace(/[{}]/g, '');
                    // If newRolesSelected and existingRoles are two sets representing the new and current roles of an user
                    // diassociateRolesList = existingRoles - newRolesSelected is the set of roles to be deleted
                    // associateRolesList = newRolesSelected - existingRoles is the set of roles to be inserted
                    var newRolesSelected = rolesSelected;
                    var existingRoles = userRoleMap[selectedUserId.toLowerCase()];
                    var diassociateRolesList = this.minus(existingRoles, newRolesSelected);
                    var associateRolesList = this.minus(newRolesSelected, existingRoles);
                    var targetSystemUser = {
                        id: String(selectedUserId),
                        name: "",
                        entityType: SYSTEMUSER_ENTITYNAME
                    };
                    //make array of required disassociate requests
                    for (var roleIndex in diassociateRolesList) {
                        var roleId = diassociateRolesList[roleIndex];
                        disasscoiateRequests.push(new DisassociateRequest(targetSystemUser, SYSTEMUSER_ROLE_RELATIONSHIP, String(roleId)));
                    }
                    //make array of required associate requests
                    for (var roleIndex in associateRolesList) {
                        var roleId = associateRolesList[roleIndex];
                        var relatedRole = {
                            id: String(roleId),
                            name: "",
                            entityType: ROLE_ENTITYNAME
                        };
                        var relatedEntities = [relatedRole];
                        associateRequests.push(new AssociateRequest(targetSystemUser, SYSTEMUSER_ROLE_RELATIONSHIP, relatedEntities));
                    }
                }
                allRequests = allRequests.concat(associateRequests);
                allRequests = allRequests.concat(disasscoiateRequests);
                if (allRequests.length > 0) {
                    Xrm.WebApi.online.executeMultiple(allRequests)
                        .then(function (responseArray) {
                        AppCommon.DialogUtils.hideProgressIndicator();
                        if (responseArray.every(function (response) { return response.ok; })) {
                            // Everything looks OK
                            AppCommon.DialogUtils.showGlobalNotification(AppCommon.DialogUtils.getLocalizedString(AppCommon.SystemUserStrings.SystemUserManageRolesSuccessNotification));
                        }
                        else {
                            AppCommon.DialogUtils.HandleServerError(responseArray);
                        }
                    }, AppCommon.DialogUtils.actionFailedCallback);
                }
            };
            SystemUser_ManageRoles.prototype.minus = function (a, b) {
                if (AppCommon.DialogUtils.isNullOrUndefined(a)) {
                    return [];
                }
                else if (AppCommon.DialogUtils.isNullOrUndefined(b)) {
                    return a;
                }
                return a.filter(function (e) {
                    return !(b.indexOf(e) > -1);
                });
            };
            SystemUser_ManageRoles.prototype.observeAction = function (mutations) {
                var mutationRecord = mutations[0];
                if (mutationRecord.addedNodes[0] !== undefined && window.top.document.querySelectorAll('[id*="' + this.checkBoxControlID + '"]').length != 0) {
                    window.top.document.getElementById(window.top.document.querySelectorAll('[id*="' + this.checkBoxControlID + '"]')[0].id).focus();
                    this._observer.disconnect();
                }
            };
            SystemUser_ManageRoles.prototype.startObservation = function () {
                var _this = this;
                this._observer = new MutationObserver(function (mutation) { return _this._observeAction(mutation); });
                var config = {
                    childList: true,
                    subtree: true
                };
                this._observer.observe(this._observeObject, config);
            };
            ;
            return SystemUser_ManageRoles;
        }());
        AppCommon.ManageUserRolesCommand = new SystemUser_ManageRoles();
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var RemoveUserFromRecordTeamRequest = (function () {
        function RemoveUserFromRecordTeamRequest(entity /*Microsoft.Dynamics.CRM.systemuser*/, record /*Microsoft.Dynamics.CRM.crmbaseentity*/, teamTemplate /*Microsoft.Dynamics.CRM.teamtemplate*/) {
            this.entity = entity;
            this.Record = record;
            this.TeamTemplate = teamTemplate;
        }
        RemoveUserFromRecordTeamRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.systemuser",
                        "structuralProperty": 5,
                    },
                    "Record": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5,
                    },
                    "TeamTemplate": {
                        "typeName": "Microsoft.Dynamics.CRM.teamtemplate",
                        "structuralProperty": 5,
                    },
                },
                operationName: "RemoveUserFromRecordTeam",
                operationType: 0,
            };
            return metadata;
        };
        return RemoveUserFromRecordTeamRequest;
    }());
    ODataContract.RemoveUserFromRecordTeamRequest = RemoveUserFromRecordTeamRequest;
})(ODataContract || (ODataContract = {}));
/**
 * Used for the enable rule for the access teams feature. This checks whether to show the button.
 */
/// <reference path="../../../../ClientUtility/Client/Common/DataContracts/Action/RemoveUserFromRecordTeamRequest.ts" />
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var RemoveUserFromRecordTeamRequest = ODataContract.RemoveUserFromRecordTeamRequest;
        var SystemUser_AccessTeams = (function () {
            function SystemUser_AccessTeams() {
            }
            //returns true if the grid control is enabled for access teams
            SystemUser_AccessTeams.prototype.checkSystemUserGridAccessTeams = function (gridControl) {
                if (gridControl && gridControl.getTeamTemplateId) {
                    var teamTemplateId = gridControl.getTeamTemplateId();
                    return (teamTemplateId !== null && teamTemplateId !== "00000000-0000-0000-0000-000000000000"
                        && teamTemplateId !== "{00000000-0000-0000-0000-000000000000}");
                }
                return false;
            };
            SystemUser_AccessTeams.prototype.removeUserFromAccessTeams = function (recordId, recordType, gridControl, selectedUsers) {
                var removeUserAccessRequests = [];
                var userId = "";
                if (gridControl && gridControl.getTeamTemplateId) {
                    for (var currentUser = 0; currentUser < selectedUsers.length; currentUser++) {
                        if (selectedUsers[currentUser].Id !== null) {
                            userId = selectedUsers[currentUser].Id.replace(/[{}]/g, '');
                            var user = {
                                id: userId,
                                entityType: "systemuser"
                            };
                            var record = {
                                id: recordId,
                                entityType: recordType
                            };
                            var teamTemplate = {
                                id: gridControl.getTeamTemplateId(),
                                entityType: "teamtemplate"
                            };
                            removeUserAccessRequests.push(new RemoveUserFromRecordTeamRequest(user, record, teamTemplate));
                        }
                    }
                    Xrm.WebApi.online.executeMultiple(removeUserAccessRequests).then(function (success) {
                        if (success.every(function (response) { return response.ok; })) {
                            if (gridControl !== null) {
                                gridControl.refresh();
                            }
                        }
                        else {
                            SmbAppsTelemetryUtility.TelemetryData.ReportAppComponentFailureTelemetry(null, SmbAppsTelemetryUtility.Controls_PageType.FORMS, success);
                            Xrm.Navigation.openAlertDialog({ text: AppCommon.DialogUtils.getLocalizedString(AppCommon.SystemUserStrings.UnknownErrorMessage) });
                        }
                    }, AppCommon.DialogUtils.actionFailedCallback);
                }
            };
            return SystemUser_AccessTeams;
        }());
        AppCommon.AccessTeamsCommand = new SystemUser_AccessTeams();
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
var SmbAppsTelemetryUtility;
(function (SmbAppsTelemetryUtility) {
    'use strict';
    /**
    * To format the inner payload for telemetry data according to the event schema
    */
    var TelemetryParameter = (function () {
        function TelemetryParameter() {
        }
        return TelemetryParameter;
    }());
    SmbAppsTelemetryUtility.TelemetryParameter = TelemetryParameter;
    /**
    * To format the outer payload for telemetry data according to the event schema
    */
    var TelemetryPayload = (function () {
        function TelemetryPayload() {
        }
        return TelemetryPayload;
    }());
    SmbAppsTelemetryUtility.TelemetryPayload = TelemetryPayload;
    var Controls_ShellMode;
    (function (Controls_ShellMode) {
        //Basic Shell Mode
        Controls_ShellMode[Controls_ShellMode["BASICSHELLMODE"] = 0] = "BASICSHELLMODE";
        //Advanced Shell Mode
        Controls_ShellMode[Controls_ShellMode["ADVANCEDSHELLMODE"] = 1] = "ADVANCEDSHELLMODE";
        //Stand Alone Page
        Controls_ShellMode[Controls_ShellMode["STANDALONE"] = 2] = "STANDALONE";
    })(Controls_ShellMode = SmbAppsTelemetryUtility.Controls_ShellMode || (SmbAppsTelemetryUtility.Controls_ShellMode = {}));
    /**
     * Enums for Page Types for FRE SMB Sales App
     */
    var Controls_PageType;
    (function (Controls_PageType) {
        //BasicSetup Summary Page
        Controls_PageType[Controls_PageType["BASICSETUPSUMMARY"] = 0] = "BASICSETUPSUMMARY";
        //AppWelcome Page
        Controls_PageType[Controls_PageType["APPWELCOME"] = 1] = "APPWELCOME";
        //Setting Summary Page
        Controls_PageType[Controls_PageType["SETTINGSUMMARY"] = 2] = "SETTINGSUMMARY";
        //Branding and Theming Page
        Controls_PageType[Controls_PageType["BRANDINGANDTHEMING"] = 3] = "BRANDINGANDTHEMING";
        // Fiscal year Page
        Controls_PageType[Controls_PageType["FISCALYEAR"] = 4] = "FISCALYEAR";
        //Email Template Page
        Controls_PageType[Controls_PageType["EMAILTEMPLATE"] = 5] = "EMAILTEMPLATE";
        //Word and Excel Template Page
        Controls_PageType[Controls_PageType["WORDANDEXCELTEMPLATE"] = 6] = "WORDANDEXCELTEMPLATE";
        //Document Storage page
        Controls_PageType[Controls_PageType["DOCUMENTSTORAGE"] = 7] = "DOCUMENTSTORAGE";
        //Quote To cash Page
        Controls_PageType[Controls_PageType["QUOTETOCASH"] = 8] = "QUOTETOCASH";
        //ApplicationManagement Page
        Controls_PageType[Controls_PageType["APPLICATIONMANAGEMENT"] = 9] = "APPLICATIONMANAGEMENT";
        //Sample Data management Page
        Controls_PageType[Controls_PageType["SAMPLEDATAMANAGEMENT"] = 10] = "SAMPLEDATAMANAGEMENT";
        //Duplicate Detection Page
        Controls_PageType[Controls_PageType["DUPLICATEDETECTION"] = 11] = "DUPLICATEDETECTION";
        //User management
        Controls_PageType[Controls_PageType["USERMANAGEMENT"] = 12] = "USERMANAGEMENT";
        //Team management
        Controls_PageType[Controls_PageType["TEAMMANAGEMENT"] = 13] = "TEAMMANAGEMENT";
        //Click To Call Page
        Controls_PageType[Controls_PageType["CLICKTOCALL"] = 14] = "CLICKTOCALL";
        //Product Catalog Page
        Controls_PageType[Controls_PageType["PRODUCTCATALOG"] = 15] = "PRODUCTCATALOG";
        //Leads and Contacts Page
        Controls_PageType[Controls_PageType["LEADANDCONTACT"] = 16] = "LEADANDCONTACT";
        //Import Data Page
        Controls_PageType[Controls_PageType["IMPORTDATA"] = 17] = "IMPORTDATA";
        //Export Data Page
        Controls_PageType[Controls_PageType["EXPORTDATA"] = 18] = "EXPORTDATA";
        //Forms Page
        Controls_PageType[Controls_PageType["FORMS"] = 19] = "FORMS";
        //Views Page
        Controls_PageType[Controls_PageType["VIEWS"] = 20] = "VIEWS";
        //Business process flow Page
        Controls_PageType[Controls_PageType["BUSINESSPROCESSFLOW"] = 21] = "BUSINESSPROCESSFLOW";
        Controls_PageType[Controls_PageType["SETWORKHOUR"] = 22] = "SETWORKHOUR";
    })(Controls_PageType = SmbAppsTelemetryUtility.Controls_PageType || (SmbAppsTelemetryUtility.Controls_PageType = {}));
    /**
     *Enums for  Actions Types associated with FRE Pages
     */
    var Controls_EventName;
    (function (Controls_EventName) {
        //Button is clicked
        Controls_EventName[Controls_EventName["CLICKEDBUTTON"] = 0] = "CLICKEDBUTTON";
        //LINK is Clicked
        Controls_EventName[Controls_EventName["CLICKEDLINK"] = 1] = "CLICKEDLINK";
        //Combobox is clicked
        Controls_EventName[Controls_EventName["CLICKEDCOMBOBOX"] = 2] = "CLICKEDCOMBOBOX";
        //Checkbox is clicked
        Controls_EventName[Controls_EventName["CLICKEDCHECKBOX"] = 3] = "CLICKEDCHECKBOX";
        //Textbox is changes
        Controls_EventName[Controls_EventName["CHANGEDTEXTBOX"] = 4] = "CHANGEDTEXTBOX";
        //FRE page is visited
        Controls_EventName[Controls_EventName["PAGEVISITED"] = 5] = "PAGEVISITED";
        //Error occurs
        Controls_EventName[Controls_EventName["ERROR"] = 6] = "ERROR";
        //If there is a success scenario
        Controls_EventName[Controls_EventName["SUCCESS"] = 7] = "SUCCESS";
        //If an event is Completed
        Controls_EventName[Controls_EventName["COMPLETED"] = 8] = "COMPLETED";
        //If a user is dropped from any page
        Controls_EventName[Controls_EventName["DROPPED"] = 9] = "DROPPED";
        //An upload event
        Controls_EventName[Controls_EventName["UPLOADS"] = 10] = "UPLOADS";
        //Grid Command is Clicked
        Controls_EventName[Controls_EventName["CLICKEDGRIDCOMMAND"] = 11] = "CLICKEDGRIDCOMMAND";
        //Form Command is Clicked
        Controls_EventName[Controls_EventName["CLICKEDFORMCOMMAND"] = 12] = "CLICKEDFORMCOMMAND";
        //Command is Executed
        Controls_EventName[Controls_EventName["CLOSEDCOMMAND"] = 13] = "CLOSEDCOMMAND";
        //Selectbox is clicked
        Controls_EventName[Controls_EventName["CLICKEDSELECTBOX"] = 14] = "CLICKEDSELECTBOX";
    })(Controls_EventName = SmbAppsTelemetryUtility.Controls_EventName || (SmbAppsTelemetryUtility.Controls_EventName = {}));
    /**
     * Class for Telemetry Data for FRE pages
     */
    var TelemetryData = (function () {
        function TelemetryData(context, count, pagetype, eventname, customcontrolname, customcontrolID, customcontrolShellmode, information, isError) {
            this._enableLogging = true;
            this._context = context;
            this._count = count;
            this._pagetype = pagetype;
            this._eventname = eventname;
            this._customcontrolname = customcontrolname;
            this._customcontrolid = customcontrolID;
            this._customcontrolShellmode = customcontrolShellmode;
            this._information = information;
            this._isError = isError;
        }
        /**
         * @function _getMessageString
         * @description Helper function to format the "message" attribute for schema "SMBSalesFREInfo"
         * @returns {string}
         */
        TelemetryData.prototype._getMessageString = function () {
            var message;
            if (this._isError) {
                message = "CC_Name:" + this._customcontrolname + ",CC_ID:" + this._customcontrolid + ",CC_ShellMode:" + this._getShellMode(this._customcontrolShellmode) + ",ErrorType:" + this._information;
            }
            else {
                message = "CC_Name:" + this._customcontrolname + ",CC_ID:" + this._customcontrolid + ",CC_ShellMode:" + this._getShellMode(this._customcontrolShellmode) + ",Message:" + this._information;
            }
            return message;
        };
        /**
         * @function _getsolutionVersion
         * @description Helper function to format the "SolutionVersion" attribute for schema "SMBSalesFREInfo"
         * @returns {string}
         */
        TelemetryData.prototype._getsolutionVersion = function () {
            var solutionApp = "default";
            if (window && window.top && window.top.getGlobalContextObject() && window.top.getGlobalContextObject().getCurrentAppName()._result)
                solutionApp = window.top.getGlobalContextObject().getCurrentAppName()._result;
            return solutionApp;
        };
        /**
         * @function _getPageType
         * @description Return the corrosponding string associated to enum for pagetype.
         * @returns {string}
         * @param {Controls_PageType} pagetype
         */
        TelemetryData.prototype._getPageType = function (pagetype) {
            switch (pagetype) {
                case Controls_PageType.BASICSETUPSUMMARY: return "Basic Setup Summary Page";
                case Controls_PageType.APPLICATIONMANAGEMENT: return "Application Management Page";
                case Controls_PageType.APPWELCOME: return "App Welcome Page";
                case Controls_PageType.BRANDINGANDTHEMING: return "Branding and Theming Page";
                case Controls_PageType.DOCUMENTSTORAGE: return "Document Storage Page";
                case Controls_PageType.EMAILTEMPLATE: return "Email Template Page";
                case Controls_PageType.FISCALYEAR: return "Fiscal Year Page";
                case Controls_PageType.QUOTETOCASH: return "QuoteToCash Page";
                case Controls_PageType.SAMPLEDATAMANAGEMENT: return "Sample Data Management Page";
                case Controls_PageType.SETTINGSUMMARY: return "Setting Summary Page";
                case Controls_PageType.WORDANDEXCELTEMPLATE: return "Word And Excel Document Page";
                case Controls_PageType.DUPLICATEDETECTION: return "Duplicate Detection Page";
                case Controls_PageType.USERMANAGEMENT: return "User Management page";
                case Controls_PageType.TEAMMANAGEMENT: return "Team Management page";
                case Controls_PageType.CLICKTOCALL: return "Click To Call Page";
                case Controls_PageType.PRODUCTCATALOG: return "Product Catalog Page";
                case Controls_PageType.LEADANDCONTACT: return "Leads and Contacts Page";
                case Controls_PageType.IMPORTDATA: return "Import Data Page";
                case Controls_PageType.EXPORTDATA: return "Export Data Page";
                case Controls_PageType.FORMS: return "Forms Page";
                case Controls_PageType.VIEWS: return "Views Page";
                case Controls_PageType.BUSINESSPROCESSFLOW: return "Business process flow Page";
                default: return null;
            }
        };
        /**
         * @function _getShellMode
         * @description Return the corrosponding string associated to enum for Shell.
         * @returns {string}
         * @param {Controls_ShellMode} shellMode
         */
        TelemetryData.prototype._getShellMode = function (shellMode) {
            switch (shellMode) {
                case Controls_ShellMode.ADVANCEDSHELLMODE: return "Advanced Shell";
                case Controls_ShellMode.BASICSHELLMODE: return "Basic Shell";
                case Controls_ShellMode.STANDALONE: return "StandAlone Page";
                default: return null;
            }
        };
        /**
         * @function _getEventName
         * @description Return the corrosponding string associated to enum for eventtype.
         * @returns {string}
         * @param {Controls_EventName} eventname
         */
        TelemetryData.prototype._getEventName = function (eventname) {
            switch (eventname) {
                case Controls_EventName.CHANGEDTEXTBOX: return "Changed TextBox";
                case Controls_EventName.CLICKEDBUTTON: return "Clicked Button";
                case Controls_EventName.CLICKEDCHECKBOX: return "Clicked CheckBox";
                case Controls_EventName.CLICKEDCOMBOBOX: return "Clicked ComboBox";
                case Controls_EventName.CLICKEDSELECTBOX: return "Clicked SelectBox";
                case Controls_EventName.CLICKEDLINK: return "Clicked Link";
                case Controls_EventName.COMPLETED: return "Activity Completed";
                case Controls_EventName.DROPPED: return "Activity Dropped";
                case Controls_EventName.ERROR: return "Error Encountered";
                case Controls_EventName.PAGEVISITED: return "Page Visited";
                case Controls_EventName.SUCCESS: return "Success";
                case Controls_EventName.UPLOADS: return "Uploads";
                case Controls_EventName.CLICKEDGRIDCOMMAND: return "Clicked Grid Command";
                default: return null;
            }
        };
        /**
         * @function _getTelemetryData
         * @description Formats the payload according to schema for telemetry event "SMBSalesFREInfo"
         * @returns {TelemetryPayload}
         */
        TelemetryData.prototype._getTelemetryData = function () {
            var payload = {
                eventName: "SMBFREEventInfo", eventParameters: []
            };
            var para1 = { name: "ActionName", value: this._getEventName(this._eventname) };
            var para2 = { name: "Count", value: this._count };
            var para3 = { name: "Message", value: this._getMessageString() };
            var para4 = { name: "PageName", value: this._getPageType(this._pagetype) };
            var para5 = { name: "SolutionVersion", value: this._getsolutionVersion() };
            payload.eventParameters.push(para1);
            payload.eventParameters.push(para2);
            payload.eventParameters.push(para3);
            payload.eventParameters.push(para4);
            payload.eventParameters.push(para5);
            return payload;
        };
        /**
         * @function ReportEventData
         * @description Logs Telemetry Data
         */
        TelemetryData.ReportEventData = function (context, count, pagetype, eventname, customcontrolname, customcontrolID, customcontrolShellmode, information, isError) {
            var telemetrydata = new TelemetryData(context, count, pagetype, eventname, customcontrolname, customcontrolID, customcontrolShellmode, information, isError);
            try {
                if (telemetrydata._enableLogging) {
                    if (telemetrydata._context != null) {
                        telemetrydata._context.reporting.reportEvent(telemetrydata._getTelemetryData());
                    }
                    else {
                        Xrm.Reporting.reportEvent(telemetrydata._getTelemetryData());
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        };
        TelemetryData.ReportAppComponentFailureTelemetry = function (context, pagetype, err, suggestedMitigation) {
            var telemetryerrordata = new TelemetryData(context, null, pagetype);
            var errorToBeLogged = { message: "" };
            var componentName = "";
            if (typeof err != "object" || err.message == null) {
                errorToBeLogged.message = JSON.stringify(err);
            }
            else {
                errorToBeLogged = err;
            }
            if (telemetryerrordata._pagetype) {
                componentName = telemetryerrordata._getsolutionVersion() + "." + telemetryerrordata._getPageType(telemetryerrordata._pagetype);
            }
            //API
            try {
                if (telemetryerrordata._context != null) {
                    telemetryerrordata._context.reporting.reportFailure(componentName, errorToBeLogged, suggestedMitigation);
                }
                else {
                    Xrm.Reporting.reportFailure(componentName, errorToBeLogged, suggestedMitigation);
                }
            }
            catch (e) {
                console.log(e);
            }
        };
        return TelemetryData;
    }());
    SmbAppsTelemetryUtility.TelemetryData = TelemetryData;
})(SmbAppsTelemetryUtility || (SmbAppsTelemetryUtility = {}));
/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="./ReassignAllRecords.ts" />
/// <reference path="./JoinTeams.ts" />
/// <reference path="./ManageRoles.ts" />
/// <reference path="./AccessTeams.ts" />
/// <reference path="../../Controls/FREShell/Telemetry/TelemetryUtility.ts" />
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var SystemUser = (function () {
            function SystemUser() {
            }
            /**
             * Override Edit Option in command bar to open Edit User Dialog
             * @param records contains an array of grid row objects that are selected
             * @param gridControl contains a handler for grid
             */
            SystemUser.EditSystemUser = function (records, gridControl) {
                if (records && records.length > 0) {
                    var id = records && records[0] ? records[0].Id : null;
                    if (id) {
                        var recordId = records[0].Id;
                        recordId = recordId.replace(/[{}]/g, '');
                        var userId = recordId;
                        SystemUser.openEditUserDialog(userId, gridControl);
                    }
                    else {
                        AppCommon.DialogUtils.handleError(Error(AppCommon.SystemUserConstants.ERROR_IDCANNOTBENULL + "EditSystemUser()"));
                    }
                }
                else {
                    AppCommon.DialogUtils.handleError(Error(AppCommon.SystemUserConstants.ERROR_ACCESSINGRECORDFROMGRID + "EditSystemUser()"));
                }
            };
            /**
             * Opens MDD Dialog which loads CustomControl-EditUserControl
             * @param userId userId of user
             */
            SystemUser.openEditUserDialog = function (userId, gridControl) {
                SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.USERMANAGEMENT, SmbAppsTelemetryUtility.Controls_EventName.CLICKEDGRIDCOMMAND, "EditUser", null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, "EditUser Grid Command Clicked", false);
                var dialogParams = {};
                dialogParams[AppCommon.SystemUserConstants.USERID_FORM_PARAM] = userId;
                var dialogOptions = {};
                dialogOptions.position = 2 /* side */;
                Xrm.Navigation.openDialog(AppCommon.SystemUserConstants.EDIT_USER_MDD_NAME, dialogOptions, dialogParams).then(function (response) {
                    if (!AppCommon.DialogUtils.isNullOrUndefined(gridControl)) {
                        gridControl.refresh();
                    }
                });
            };
            /**
             * Log the error on the console and prompt error to the user
             * @param err error message
             */
            SystemUser.handleError = function (err) {
                console.log(err.message);
                Xrm.Utility.alertDialog(err.message);
            };
            return SystemUser;
        }());
        SystemUser.Reassign = Mscrm.AppCommon.ReassignAllRecordsCommand;
        SystemUser.JoinTeams = Mscrm.AppCommon.JoinTeamsCommand;
        SystemUser.ManageRoles = Mscrm.AppCommon.ManageUserRolesCommand;
        SystemUser.AccessTeams = Mscrm.AppCommon.AccessTeamsCommand;
        AppCommon.SystemUser = SystemUser;
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        var Common;
        (function (Common) {
            'use strict';
            var DocumentTemplateType;
            (function (DocumentTemplateType) {
                DocumentTemplateType[DocumentTemplateType["None"] = 0] = "None";
                DocumentTemplateType[DocumentTemplateType["Excel"] = 1] = "Excel";
                DocumentTemplateType[DocumentTemplateType["Word"] = 2] = "Word";
            })(DocumentTemplateType = Common.DocumentTemplateType || (Common.DocumentTemplateType = {}));
            var Utility = (function () {
                function Utility() {
                }
                /**
                 * Checks whether an object is null.
                 * @param object The object to check.
                 * @returns A flag indicating whether the object is null.
                 */
                Utility.isNull = function (object) {
                    return object === null;
                };
                /**
                 * Checks whether an object is null or undefined.
                 * @param object The object to check.
                 * @returns A flag indicating whether the object is null or undefined.
                 */
                Utility.isNullOrUndefined = function (object) {
                    return object === null || object === undefined;
                };
                /**
                 * Checks whether an object is an undefined, null or empty string.
                 * @param object The object to check.
                 * @returns A flag indicating whether the object is undefined, null or an empty string.
                 */
                Utility.isNullOrEmptyString = function (object) {
                    return Utility.isNullOrUndefined(object) || object === "";
                };
                /**
                * Tries to convert an object to string
                * @param object The object to convert.
                * @returns Returns the object converted to string or the object itself if this is null or undefined.
                */
                Utility.toStringWithNullCheck = function (object) {
                    return Utility.isNullOrUndefined(object) ? object : object.toString();
                };
                Utility.newGuid = function () {
                    return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                };
                /**
                * The method for creating Blob object from base64 content.
                */
                Utility.Base64ToBlob = function (fileContent, fileType) {
                    if (this.isNullOrEmptyString(fileContent))
                        throw new Error("file Content cannot be empty");
                    if (this.isNullOrEmptyString(fileType))
                        throw new Error("file Type cannot be empty");
                    // convert base64 content to raw binary data held in a string
                    var binary = window.atob(fileContent);
                    var binaryLength = binary.length;
                    // create ArrayBuffer with binary length
                    var buffer = new ArrayBuffer(binaryLength);
                    // create 8-bit Array for ArrayBuffer
                    var viewBuffer = new Uint8Array(buffer);
                    // save unicode of binary data into 8-bit Array
                    for (var i = 0; i < binaryLength; i++) {
                        viewBuffer[i] = binary.charCodeAt(i);
                    }
                    return new Blob([buffer], { type: fileType });
                };
                Utility.clickOnTempAnchor = function (url, fileName) {
                    var tempAnchorElement = document.createElement("a");
                    tempAnchorElement.setAttribute("href", url);
                    tempAnchorElement.setAttribute("target", "_blank");
                    tempAnchorElement.setAttribute("download", fileName);
                    document.body.appendChild(tempAnchorElement);
                    tempAnchorElement.click();
                    document.body.removeChild(tempAnchorElement);
                };
                Utility.GetCurrentAppId = function () {
                    if (window && window.top && window.top.location && window.top.location.href) {
                        var currentUrl = window.top.location.href;
                        var index = currentUrl.indexOf("?");
                        var queryString = currentUrl.substring(index + 1, currentUrl.length);
                        var UrlVariables = queryString.split("&");
                        for (var i = 0; i < UrlVariables.length; i++) {
                            var Entry = UrlVariables[i].split("=");
                            var key = Entry.length === 2 ? Entry[0] : null;
                            if (key === "appid") {
                                return Entry[1];
                            }
                        }
                    }
                    return "";
                };
                /**
                 * returns the fetchXML, which can be used to fetch the parkinsolutionID of the app.
                 * @param appId : appId of the App being used.
                 * @param parkingSolutionAppConfigMasterId
                 */
                Utility.GetParkingSolutionIdFetchXML = function (appId, parkingSolutionAppConfigMasterId) {
                    var retFetchXML = "?fetchXml=" + encodeURI("<fetch version=\"1.0\" mapping=\"logical\" distinct=\"true\">\n\t\t\t\t\t <entity name=\"appconfiginstance\">\n\t\t\t\t\t <attribute name=\"value\" />\n\t\t\t\t\t <link-entity name=\"appconfig\" to=\"appconfigid\" from=\"appconfigid\" link-type=\"inner\" >\n\t\t\t\t\t\t <filter type=\"and\">\n\t\t\t\t\t\t\t <condition attribute=\"appmoduleid\" operator=\"eq\" value=\"" + appId + "\"/>\n\t\t\t\t\t\t </filter >\n\t\t\t\t\t </link-entity>\n\t\t\t\t\t <link-entity name=\"solution\" to=\"value\" from=\"solutionid\" link-type=\"inner\"  />\n\t\t\t\t\t <filter type=\"and\">\n\t\t\t\t\t\t<condition attribute=\"appconfigmasterid\" operator=\"eq\" value=\"" + parkingSolutionAppConfigMasterId + "\"/> </filter>\n\t\t\t\t\t </entity>\n\t\t\t\t </fetch>");
                    return retFetchXML;
                };
                Utility.GetCurrentShellMode = function () {
                    if (window && window.top && window.top.location && window.top.location.href) {
                        var currentUrl = window.top.location.href;
                        var index = currentUrl.indexOf("?");
                        var queryString = currentUrl.substring(index + 1, currentUrl.length);
                        var UrlVariables = queryString.split("&");
                        for (var i = 0; i < UrlVariables.length; i++) {
                            var Entry = UrlVariables[i].split("=");
                            var key = Entry.length === 2 ? Entry[0] : null;
                            if (key === "appshellmode") {
                                return Entry[1].toLowerCase();
                            }
                        }
                    }
                    return "";
                };
                Utility.GetFileExtension = function (fileName) {
                    return this.isNullOrEmptyString(fileName) ? fileName
                        : fileName.substr(fileName.lastIndexOf('.') + 1);
                };
                Utility.GetFileNameWithoutExtension = function (fileName) {
                    return this.isNullOrEmptyString(fileName) ? fileName
                        : fileName.substr(0, fileName.lastIndexOf('.'));
                };
                Utility.GetDocumentTemplateType = function (fileExtension) {
                    switch (fileExtension) {
                        case "xlsx":
                            return DocumentTemplateType.Excel;
                        case "docx":
                            return DocumentTemplateType.Word;
                    }
                    return DocumentTemplateType.None;
                };
                Utility.GetFileExtensionForDocument = function (docType) {
                    switch (docType) {
                        case DocumentTemplateType.Excel:
                            return "xlsx";
                        case DocumentTemplateType.Word:
                            return "docx";
                    }
                    return "";
                };
                Utility.EqualsIgnoreCase = function (string1, string2) {
                    var isString1Null = string1 == null;
                    var isString2Null = string2 == null;
                    var isString1Undefined = string1 == undefined;
                    var isString2Undefined = string2 == undefined;
                    if (isString1Null && isString2Null || isString1Undefined && isString2Undefined) {
                        return true;
                    }
                    if (isString1Null != isString2Null || isString1Undefined != isString2Undefined) {
                        return false;
                    }
                    return string1.toUpperCase() === string2.toUpperCase();
                };
                Utility.isNullUndefinedOrWhitespace = function (s) {
                    return s == null || s == undefined || s.trim().length === 0;
                };
                ;
                /**
                 * Parses webapplication endpoint url and returns crmhostname : used for AddNewUserControl, EditUserControl and ApplicationManagementControl
                 */
                Utility.GetCrmHostName = function (webApplicationEndpoint) {
                    /*
                    * Parsing considers following 4 forms of URLs:
                    *   1."https://someorg.crmx.something.com/"
                    *   2."https://someorg.crmx.something.com"
                    *   3."someorg.crmx.something.com"
                    *   4."someorg.crmx.something.com/"
                    * converts into "crmx.something.com"
                    */
                    var currentUrl = webApplicationEndpoint;
                    var matchedStringIndex = currentUrl.indexOf(".");
                    if (matchedStringIndex != -1) {
                        currentUrl = currentUrl.substring(matchedStringIndex + 1);
                        //remove last "/" if there
                        var lastIndex = currentUrl.lastIndexOf("/");
                        if (lastIndex != -1) {
                            currentUrl = currentUrl.substring(0, lastIndex);
                        }
                    }
                    //TODO: throw exception if not able to process the string and catch it when function is called.
                    return currentUrl;
                };
                /**
                 * Detects whether the browser is Safari
                 */
                Utility.IsSafari = function () {
                    var ua = window.navigator.userAgent.toLowerCase();
                    if (ua.indexOf('safari') != -1 && ua.indexOf('chrome') == -1) {
                        return true;
                    }
                    return false;
                };
                /**
                 * Detects whether the iphone or ipad
                 */
                Utility.IsIosDevice = function () {
                    var ua = window.navigator.userAgent.toLowerCase();
                    if (ua.indexOf('iphone') != -1 || ua.indexOf('ipad') != -1) {
                        return true;
                    }
                    return false;
                };
                /**
                 * Detects whether the device is android
                 */
                Utility.IsAndroidDevice = function () {
                    var ua = window.navigator.userAgent.toLowerCase();
                    if (ua.indexOf('android') != -1) {
                        return true;
                    }
                    return false;
                };
                /**
                 * Downloads the file
                 * @param fileName name of the file
                 * @param fileContent content of the file
                 * @param mimeType the mimeType
                 */
                Utility.DownloadFile = function (fileName, fileContent, mimeType) {
                    var file = {
                        fileContent: fileContent,
                        fileName: fileName,
                        mimeType: mimeType
                    };
                    var openMode = { "openMode": 2 };
                    window.Xrm.Navigation.openFile(file, openMode);
                };
                Utility.actionFailedErrorDialog = function (errorResponse) {
                    Xrm.Navigation.openErrorDialog({ errorCode: errorResponse.errorCode, message: errorResponse.message });
                };
                /*
                 ***********************************Constructing Immersive Excel Utilities******************************************************
                */
                /**
                * Generate file name for exported document
                * @param prefix Prefix of the name
                * @param documentType 1: Excel 2: Word
                */
                Utility.generateExportFileName = function (prefix, documentType) {
                    var ext = documentType === 2 ? ".docx" : ".xlsx";
                    if (typeof (Xrm.Utility.getGlobalContext()) != 'undefined'
                        && Xrm.Utility.getGlobalContext() != null
                        && typeof (Xrm.Utility.getGlobalContext().userSettings) != 'undefined'
                        && Xrm.Utility.getGlobalContext().userSettings != null
                        && prefix
                        && prefix.length != 0) {
                        var now = new Date();
                        var datePattern = Xrm.Utility.getGlobalContext().userSettings.dateFormattingInfo.ShortDatePattern;
                        var timePattern = Xrm.Utility.getGlobalContext().userSettings.dateFormattingInfo.LongTimePattern;
                        var dateSeparator = Xrm.Utility.getGlobalContext().userSettings.dateFormattingInfo.DateSeparator;
                        var timeSeparator = Xrm.Utility.getGlobalContext().userSettings.dateFormattingInfo.TimeSeparator;
                        var fileName = prefix + " " + now.format(datePattern) + " " + now.format(timePattern) + ext;
                        fileName = fileName.split(dateSeparator).join("-").split(timeSeparator).join("-");
                        return fileName;
                    }
                    if (prefix && prefix.length != 0) {
                        return "" + prefix + ext;
                    }
                    return "Export" + ext;
                };
                /**
                 * Parses the xml and generates to XMLDocument using JS runtime
                 * @param xml xml represented as string for which we need XMLDocument
                 */
                Utility.ParseXml = function (xml) {
                    if (window.hasOwnProperty("DOMParser")) {
                        var parser = new DOMParser();
                        return parser.parseFromString(xml, "text/xml");
                    }
                    else if (window.hasOwnProperty("ActiveXObject")) {
                        var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM"); // tslint:disable-line:no-any
                        xmlDoc.async = false;
                        xmlDoc.loadXML(xml);
                        return xmlDoc;
                    }
                    return null;
                };
                Utility.getGridAttributes = function () {
                    var gridAttributes = ["sortColumns", "pageNum", "recsPerPage", "dataProvider", "uiProvider", "cols", "max", "refreshAsync", "pagingCookie", "enableMultiSort", "enablePagingWhenOnePage", "refreshCalledFromRefreshButton", "totalrecordcount", "allrecordscounted", "returntotalrecordcount", "getParameters", "parameters", "columns"];
                    return gridAttributes;
                };
                Utility.getGridParameters = function () {
                    var gridParameters = ["autorefresh", "isGridHidden", "isGridFilteringEnabled", "viewid", "viewtype", "RecordsPerPage", "viewTitle", "layoutXml", "otc", "otn", "entitydisplayname", "titleformat", "entitypluraldisplayname", "isWorkflowSupported", "fetchXmlForFilters", "isFetchXmlNotFinal", "effectiveFetchXml", "LayoutStyle", "enableFilters", "isTurboForm"];
                    return gridParameters;
                };
                Utility.getColumnValues = function (layoutXml) {
                    return "";
                };
                Utility.getGridAttributesDefaultValues = function () {
                    var defaultValuesforGridAttributes = {};
                    //Assign Default Values
                    var xmlDocument = Utility.ParseXml(Xrm.Page.data.attributes.get("entity_fetchXml").getValue());
                    var orderNode = xmlDocument;
                    //ToDo
                    defaultValuesforGridAttributes["sortColumns"] = "name:1";
                    defaultValuesforGridAttributes["pageNum"] = "1";
                    defaultValuesforGridAttributes["recsPerPage"] = "50";
                    defaultValuesforGridAttributes["dataProvider"] = "Microsoft.Crm.Application.Platform.Grid.GridDataProviderQueryBuilder";
                    defaultValuesforGridAttributes["uiProvider"] = "Microsoft.Crm.Application.Controls.GridUIProvider";
                    defaultValuesforGridAttributes["Cols"] = "Empty";
                    defaultValuesforGridAttributes["max"] = "-1";
                    defaultValuesforGridAttributes["refreshAsync"] = "false";
                    defaultValuesforGridAttributes["pagingCookie"] = "Empty";
                    defaultValuesforGridAttributes["enableMultiSort"] = "true";
                    defaultValuesforGridAttributes["enablePagingWhenOnePage"] = "true";
                    defaultValuesforGridAttributes["refreshCalledFromRefreshButton"] = "1";
                    defaultValuesforGridAttributes["totalrecordcount"] = Xrm.Page.data.attributes.get("entity_totalRecordCount").getValue();
                    defaultValuesforGridAttributes["allrecordscounted"] = "true";
                    defaultValuesforGridAttributes["returntotalrecordcount"] = "true";
                    defaultValuesforGridAttributes["getParameters"] = "Empty";
                    defaultValuesforGridAttributes["columns"] = Utility.getColumnValues(Xrm.Page.data.attributes.get("entity_layoutXml").getValue());
                    return defaultValuesforGridAttributes;
                };
                Utility.getGridParameterDefaultValues = function () {
                    var defaultValuesforGridParameters = {};
                    var fetchXml = Xrm.Page.data.attributes.get("entity_fetchXml").getValue();
                    var layoutXml = Xrm.Page.data.attributes.get("entity_layoutXml").getValue();
                    var entity_effectiveFetchXml = Xrm.Page.data.attributes.get("entity_fetchXml").getValue();
                    var entity_effectiveLayoutXml = Xrm.Page.data.attributes.get("entity_layoutXml").getValue();
                    //Extracting HTML Decoded Content
                    fetchXml = Utility.unescapeHtml(fetchXml);
                    layoutXml = Utility.unescapeHtml(layoutXml);
                    entity_effectiveFetchXml = Utility.unescapeHtml(entity_effectiveFetchXml);
                    entity_effectiveLayoutXml = Utility.unescapeHtml(entity_effectiveLayoutXml);
                    var entityTypeName = Xrm.Page.data.attributes.get("entity_typeName").getValue();
                    defaultValuesforGridParameters["autorefresh"] = "1";
                    defaultValuesforGridParameters["isGridHidden"] = "false";
                    defaultValuesforGridParameters["isGridFilteringEnabled"] = "1";
                    defaultValuesforGridParameters["viewid"] = Xrm.Page.data.attributes.get("entity_viewId").getValue();
                    defaultValuesforGridParameters["viewtype"] = "1039";
                    defaultValuesforGridParameters["RecordsPerPage"] = "50";
                    defaultValuesforGridParameters["viewTitle"] = encodeURIComponent(Xrm.Page.data.attributes.get("entity_viewName").getValue());
                    defaultValuesforGridParameters["layoutXml"] = layoutXml;
                    defaultValuesforGridParameters["otc"] = Xrm.Page.data.attributes.get("entity_typeCode").getValue().toString();
                    defaultValuesforGridParameters["otn"] = entityTypeName;
                    defaultValuesforGridParameters["entitydisplayname"] = entityTypeName;
                    defaultValuesforGridParameters["titleformat"] = "{0} {1}";
                    defaultValuesforGridParameters["entitypluraldisplayname"] = entityTypeName;
                    defaultValuesforGridParameters["isWorkflowSupported"] = "true";
                    defaultValuesforGridParameters["fetchXmlForFilters"] = entity_effectiveFetchXml;
                    defaultValuesforGridParameters["isFetchXmlNotFinal"] = "False";
                    defaultValuesforGridParameters["effectiveFetchXml"] = entity_effectiveFetchXml;
                    defaultValuesforGridParameters["LayoutStyle"] = "GridList";
                    defaultValuesforGridParameters["enableFilters"] = "1";
                    defaultValuesforGridParameters["isTurboForm"] = "0";
                    defaultValuesforGridParameters["fetchXml"] = fetchXml;
                    return defaultValuesforGridParameters;
                };
                /**
                * Export GridXml parameter
                * @param gridControl The current grid
                * @param entityTypeName The entityTypeName for this grid
                * @param exportType The type of exporting we are doing (static/dynamic/online...)
                */
                Utility.constructGridXml = function () {
                    var gridAttributes = Utility.getGridAttributes();
                    var xmlString = "<grid></grid>";
                    var gridXml = Utility.ParseXml(xmlString);
                    var index = 0;
                    var gridAttributeDefaultValues = Utility.getGridAttributesDefaultValues();
                    var gridParamerterDefaultValues = Utility.getGridParameterDefaultValues();
                    var gridParameters = Utility.getGridParameters();
                    while (index < gridAttributes.length) {
                        var node = gridXml.createElement(gridAttributes[index]);
                        if (gridAttributeDefaultValues[gridAttributes[index]] != "Empty") {
                            node.textContent = gridAttributeDefaultValues[gridAttributes[index]];
                        }
                        index++;
                        gridXml.documentElement.appendChild(node);
                    }
                    var parametersNodeCollection = gridXml.querySelectorAll('grid>parameters');
                    var parameternode = parametersNodeCollection[0];
                    index = 0;
                    while (index < gridAttributes.length) {
                        var nodeparam = gridXml.createElement(gridParameters[index]);
                        nodeparam.textContent = gridParamerterDefaultValues[gridParameters[index]];
                        index++;
                        parameternode.appendChild(nodeparam);
                    }
                    return (new XMLSerializer()).serializeToString(gridXml);
                };
                //HTML Encode Decode
                Utility.unescapeHtml = function (str) {
                    var map = { amp: '&', lt: '<', le: '≤', gt: '>', ge: '≥', quot: '"', '#039': "'" };
                    return str.replace(/&([^;]+);/g, function (m, c) { return map[c] || ''; });
                };
                /**
                 * Export PostData parameter to MDD
                 * @param gridControl The current grid
                 * @param entityTypeName The entityTypeName for this grid
                 * @param exportType The type of exporting we are doing (static/dynamic/online...)
                 */
                Utility.constructPostData = function () {
                    // Construct Grid Xml
                    var postData = "";
                    var exportType = Xrm.Page.data.attributes.get("entity_exportType").getValue();
                    var fetchXml = Xrm.Page.data.attributes.get("entity_fetchXml").getValue();
                    var layoutXml = Xrm.Page.data.attributes.get("entity_layoutXml").getValue();
                    //Extracting HTML Decoded Content
                    fetchXml = Utility.unescapeHtml(fetchXml);
                    layoutXml = Utility.unescapeHtml(layoutXml);
                    //Construct First Parameter - ExportType
                    if (exportType == 2) {
                        postData = postData.concat("exportType=dynamicXlsx&");
                    }
                    else if (exportType == 3) {
                        postData = postData.concat("exportType=pivotXlsx&");
                    }
                    //Construct Second Parameter - GridXml
                    postData = postData.concat("gridXml=" + Utility.unescapeHtml(Utility.constructGridXml()) + "&");
                    //Construct the FetchXml Parameter
                    postData = postData.concat("fetchXml=" + fetchXml + "&");
                    //Construct the LayoutXml
                    postData = postData.concat("layoutXml=" + layoutXml + "&printAllPages=1");
                    return postData;
                };
                return Utility;
            }());
            Common.Utility = Utility;
        })(Common = AppCommon.Common || (AppCommon.Common = {}));
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var SetParentSystemUserRequest = (function () {
        function SetParentSystemUserRequest(entity /*Microsoft.Dynamics.CRM.systemuser*/, parent /*Microsoft.Dynamics.CRM.systemuser*/, keepChildUsers) {
            this.entity = entity;
            this.Parent = parent;
            this.KeepChildUsers = keepChildUsers;
        }
        SetParentSystemUserRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.systemuser",
                        "structuralProperty": 5,
                    },
                    "Parent": {
                        "typeName": "Microsoft.Dynamics.CRM.systemuser",
                        "structuralProperty": 5,
                    },
                    "KeepChildUsers": {
                        "typeName": "Edm.Boolean",
                        "structuralProperty": 1,
                    },
                },
                operationName: "SetParentSystemUser",
                operationType: 0,
            };
            return metadata;
        };
        return SetParentSystemUserRequest;
    }());
    ODataContract.SetParentSystemUserRequest = SetParentSystemUserRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var RemoveParentRequest = (function () {
        function RemoveParentRequest(target /*Microsoft.Dynamics.CRM.systemuser*/) {
            this.Target = target;
        }
        RemoveParentRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "Target": {
                        "typeName": "Microsoft.Dynamics.CRM.systemuser",
                        "structuralProperty": 5,
                    },
                },
                operationName: "RemoveParent",
                operationType: 0,
            };
            return metadata;
        };
        return RemoveParentRequest;
    }());
    ODataContract.RemoveParentRequest = RemoveParentRequest;
})(ODataContract || (ODataContract = {}));
/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../../Controls/FREShell/WebApi/Utility.ts" />
/// <reference path="../../Controls/FREShell/DataContracts/SetParentSystemUserRequest.ts" />
/// <reference path="../../Controls/FREShell/DataContracts/RemoveParentRequest.ts" />
/// <reference path="../ClientCommon/DialogUtils.ts" />
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var SetParentSystemUserRequest = ODataContract.SetParentSystemUserRequest;
        var RemoveParentRequest = ODataContract.RemoveParentRequest;
        var Utility = Mscrm.AppCommon.Common.Utility;
        var CHANGEMANAGER = "SystemUser_ChangeManager";
        var CHANGEMANAGERCLICKED = "SystemUser_ChangeManager Clicked";
        var CHANGEMANAGERCOMPLETED = "SystemUser_ChangeManager Completed";
        var SystemUser_ChangeManager = (function () {
            function SystemUser_ChangeManager() {
            }
            /**
            * Implement Change Manager Option in command bar to open Change Manager Dialog
            * @param records contains an array of grid row objects that are selected
            * @param gridControl contains a handler for grid
            */
            SystemUser_ChangeManager.ChangeManagerFromForm = function () {
                var records = [];
                var record = { Id: Xrm.Page.data.entity.getId() };
                records.push(record);
                SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.USERMANAGEMENT, SmbAppsTelemetryUtility.Controls_EventName.CLICKEDFORMCOMMAND, CHANGEMANAGER, null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, CHANGEMANAGERCLICKED, false);
                SystemUser_ChangeManager.OpenChangeManagerDialog(records);
                // TODO: Refresh Manager field
            };
            /**
            * Implement Change Manager Option in command bar to open Change Manager Dialog
            * @param records contains an array of grid row objects that are selected
            * @param gridControl contains a handler for grid
            */
            SystemUser_ChangeManager.ChangeManagerFromGrid = function (records, gridControl) {
                SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.USERMANAGEMENT, SmbAppsTelemetryUtility.Controls_EventName.CLICKEDGRIDCOMMAND, CHANGEMANAGER, null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, CHANGEMANAGERCLICKED, false);
                SystemUser_ChangeManager.OpenChangeManagerDialog(records, gridControl);
            };
            SystemUser_ChangeManager.OpenChangeManagerDialog = function (records, gridControl) {
                if (gridControl === void 0) { gridControl = undefined; }
                var dialogParams = {};
                dialogParams[AppCommon.DialogConstants.TotalRecordsSelected] = records.length;
                dialogParams[AppCommon.DialogConstants.SelectedRecords] = records;
                dialogParams[AppCommon.DialogConstants.LastButtonClicked] = "";
                dialogParams[AppCommon.DialogConstants.ParentId] = "";
                var dialogOptions = {};
                dialogOptions.position = 2 /* side */;
                dialogOptions.width = AppCommon.DialogConstants.DialogWidth;
                Xrm.Navigation.openDialog(AppCommon.DialogConstants.ChangeManagerDialogName, dialogOptions, dialogParams)
                    .then(function (context) { return SystemUser_ChangeManager.DialogCloseCallback(gridControl, context); });
            };
            SystemUser_ChangeManager.SaveChangeManager = function (eventContext) {
                /* Count of users that were selected before opening dialog */
                var selectedUsersCount = eventContext.getFormContext().data.attributes.get(AppCommon.DialogConstants.TotalRecordsSelected).getValue();
                /* UserId of users that were selected before opening dialog */
                var systemUserControlValue = eventContext.getFormContext().data.attributes.get(AppCommon.DialogConstants.SelectedRecords).getValue();
                /* Retrieve Manager/Parent User Id selected in Lookup and update it as Dialog parameter */
                var changeManagerControlValue = AppCommon.DialogUtils.GetControlValue(AppCommon.DialogConstants.ChangeManagerControlId);
                var parentSystemUserId = "";
                if (!Utility.isNullOrUndefined(changeManagerControlValue) && changeManagerControlValue.length != 0) {
                    parentSystemUserId = changeManagerControlValue[0].id.replace(/[{}]/g, '');
                }
                eventContext.getFormContext().data.attributes.get(AppCommon.DialogConstants.ParentId).setValue(parentSystemUserId);
                eventContext.getFormContext().data.attributes.get(AppCommon.DialogConstants.LastButtonClicked).setValue(AppCommon.DialogConstants.DialogOkId);
                eventContext.getFormContext().ui.close();
            };
            SystemUser_ChangeManager.OnLoadChangeManager = function (eventContext) {
                /* Count of users that were selected before opening dialog */
                var selectedUsersCount = eventContext.getFormContext().data.attributes.get(AppCommon.DialogConstants.TotalRecordsSelected).getValue();
                var headerDescription = "";
                if (selectedUsersCount == 1) {
                    headerDescription = String.format(AppCommon.DialogUtils.getLocalizedString(AppCommon.SystemUserStrings.SystemUserChangeManagerHeaderDescription), selectedUsersCount);
                }
                else {
                    headerDescription = String.format(AppCommon.DialogUtils.getLocalizedString(AppCommon.SystemUserStrings.SystemUserChangeManagerPluralHeaderDescription), selectedUsersCount);
                }
                eventContext.getFormContext().getControl(AppCommon.SystemUserConstants.HeaderDescription).setLabel(headerDescription);
            };
            return SystemUser_ChangeManager;
        }());
        /**
         * Implement Close Callback for Change Manager MDD Dialog
         * @param dialogResponse
         */
        SystemUser_ChangeManager.DialogCloseCallback = function (gridControl, dialogResponse) {
            SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.USERMANAGEMENT, SmbAppsTelemetryUtility.Controls_EventName.CLOSEDCOMMAND, CHANGEMANAGER, null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, CHANGEMANAGERCOMPLETED, false);
            if (dialogResponse
                && dialogResponse.parameters
                && dialogResponse.parameters[AppCommon.DialogConstants.LastButtonClicked] === AppCommon.DialogConstants.DialogOkId) {
                var records = dialogResponse.parameters[AppCommon.DialogConstants.SelectedRecords];
                var parentId = dialogResponse.parameters[AppCommon.DialogConstants.ParentId];
                var parent_1 = { id: parentId, entityType: AppCommon.SystemUserConstants.ENTITY_NAME };
                var userid = "";
                var removeRequests = [];
                var changeRequests = [];
                for (var selectedUser = 0; selectedUser < records.length; selectedUser++) {
                    userid = records[selectedUser].Id.replace(/[{}]/g, '');
                    var entity = { id: userid, entityType: AppCommon.SystemUserConstants.ENTITY_NAME };
                    /* If Manager/Parent is not selected, then RemoveExistingManager*/
                    if (Utility.isNullOrUndefined(parentId) || parentId === "") {
                        var request = new RemoveParentRequest(entity);
                        removeRequests.push(request);
                    }
                    else {
                        var request = new SetParentSystemUserRequest(entity, parent_1, true);
                        changeRequests.push(request);
                    }
                }
                AppCommon.DialogUtils.showProgressIndicator(AppCommon.DialogUtils.getLocalizedString(AppCommon.SystemUserStrings.ProgressIndicatorMessage));
                if (!Utility.isNullOrUndefined(removeRequests) && removeRequests.length > 0) {
                    Xrm.WebApi.online.executeMultiple(removeRequests).then(function (success) {
                        AppCommon.DialogUtils.hideProgressIndicator();
                        if (success.every(function (response) { return response.ok; })) {
                            // Everything looks OK
                            if (gridControl != undefined)
                                gridControl.refresh();
                        }
                        else {
                            SmbAppsTelemetryUtility.TelemetryData.ReportAppComponentFailureTelemetry(null, SmbAppsTelemetryUtility.Controls_PageType.USERMANAGEMENT, success);
                            Xrm.Navigation.openAlertDialog({ text: AppCommon.DialogUtils.getLocalizedString(AppCommon.SystemUserStrings.UnknownErrorMessage) });
                        }
                    }, AppCommon.DialogUtils.actionFailedCallback);
                }
                else {
                    Xrm.WebApi.online.executeMultiple(changeRequests).then(function (success) {
                        AppCommon.DialogUtils.hideProgressIndicator();
                        if (success.every(function (response) { return response.ok; })) {
                            // Everything looks OK
                            if (gridControl != undefined)
                                gridControl.refresh();
                            AppCommon.DialogUtils.showGlobalNotification(AppCommon.DialogUtils.getLocalizedString(AppCommon.SystemUserStrings.SystemUserChangeManagerSuccessNotification));
                        }
                        else {
                            SmbAppsTelemetryUtility.TelemetryData.ReportAppComponentFailureTelemetry(null, SmbAppsTelemetryUtility.Controls_PageType.USERMANAGEMENT, success);
                            Xrm.Navigation.openAlertDialog({ text: AppCommon.DialogUtils.getLocalizedString(AppCommon.SystemUserStrings.UnknownErrorMessage) });
                        }
                    }, AppCommon.DialogUtils.actionFailedCallback);
                }
            }
        };
        SystemUser_ChangeManager.CancelChangeManager = function (eventContext) {
            if (!Utility.isNullOrUndefined(eventContext)) {
                eventContext.getFormContext().ui.close();
            }
        };
        AppCommon.SystemUser_ChangeManager = SystemUser_ChangeManager;
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
///  <reference path="../../../../../packages/Crm.ClientApiTypings.1.0.839/clientapi/XrmClientApi.d.ts" />
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var DisassociateRequest = ODataContract.ODataDisassociateRequest;
        var Utility = Mscrm.AppCommon.Common.Utility;
        var SystemUser_RemoveFromPosition = (function () {
            function SystemUser_RemoveFromPosition() {
            }
            /**
             * Implement Remove user(s) from position in User Subgrid on Position form
             * @param gridControl contains a handler for grid
             * @param selectedUsers contains an array of te grid row objects that are selected (i.e. the Users)
             */
            SystemUser_RemoveFromPosition.RemoveFromPosition = function (positionId, gridControl, selectedUsers) {
                var userDisasscoiateRequests = [];
                var userId = "";
                for (var user = 0; user < selectedUsers.length; user++) {
                    userId = selectedUsers[user].Id.replace(/[{}]/g, '');
                    var targetPosition = { id: positionId, entityType: "position" };
                    userDisasscoiateRequests.push(new DisassociateRequest(targetPosition, "position_users", userId));
                }
                AppCommon.DialogUtils.showProgressIndicator(AppCommon.DialogUtils.getLocalizedString(AppCommon.SystemUserStrings.ProgressIndicatorMessage));
                if (!Utility.isNullOrUndefined(userDisasscoiateRequests) && userDisasscoiateRequests.length > 0) {
                    Xrm.WebApi.online.executeMultiple(userDisasscoiateRequests).then(function (success) {
                        AppCommon.DialogUtils.hideProgressIndicator();
                        if (success.every(function (response) { return response.ok; })) {
                            // Everything looks OK
                            if (gridControl != undefined)
                                gridControl.refresh();
                        }
                        else {
                            SmbAppsTelemetryUtility.TelemetryData.ReportAppComponentFailureTelemetry(null, SmbAppsTelemetryUtility.Controls_PageType.FORMS, success);
                            Xrm.Navigation.openAlertDialog({ text: AppCommon.DialogUtils.getLocalizedString(AppCommon.SystemUserStrings.UnknownErrorMessage) });
                        }
                    }, AppCommon.DialogUtils.actionFailedCallback);
                }
            };
            return SystemUser_RemoveFromPosition;
        }());
        AppCommon.SystemUser_RemoveFromPosition = SystemUser_RemoveFromPosition;
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var SystemUserConstants = (function () {
            function SystemUserConstants() {
            }
            Object.defineProperty(SystemUserConstants, "USERID_FORM_PARAM", {
                get: function () {
                    return "user_id";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserConstants, "DOMAINNAME_FORM_PARAM", {
                get: function () {
                    return "domain_name";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserConstants, "ORGID_FORM_PARAM", {
                get: function () {
                    return "org_id";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserConstants, "CHANGE_MANAGER_ID", {
                get: function () {
                    return "changemanagercontrol_id";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserConstants, "EDIT_USER_MDD_NAME", {
                get: function () {
                    return "SMBEditUserCustomControlMDD";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserConstants, "ENTITY_NAME", {
                get: function () {
                    return "systemuser";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserConstants, "TEAM_NAME", {
                get: function () {
                    return "team";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserConstants, "ERROR_IDCANNOTBENULL", {
                get: function () {
                    return "ID cannot be null.";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserConstants, "ERROR_ACCESSINGRECORDFROMGRID", {
                get: function () {
                    return "Error while accessing record from Grid.";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserConstants, "HeaderDescription", {
                get: function () {
                    return "header_description";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserConstants, "SystemUserManageRoles_SelectedRecordsLabel", {
                get: function () {
                    return "selectedRecords_label";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserConstants, "SalesBusinessAppRoleGuid", {
                get: function () {
                    return 'f7d10f1b-c9fa-3103-af8a-1874d79503fa';
                },
                enumerable: true,
                configurable: true
            });
            return SystemUserConstants;
        }());
        AppCommon.SystemUserConstants = SystemUserConstants;
        var SystemUserStrings = (function () {
            function SystemUserStrings() {
            }
            Object.defineProperty(SystemUserStrings, "ProgressIndicatorMessage", {
                get: function () {
                    return "SMBAdvSettings_ProgressIndicatorMessage";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserStrings, "UnknownErrorMessage", {
                get: function () {
                    return "SMBAdvSettings_UnknownErrorMessage";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserStrings, "ReassigningRecords", {
                get: function () {
                    return "SMBAdvSettings_SystemUser_ReassigningRecords";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserStrings, "ErrorStrings", {
                get: function () {
                    return "SMBAdvSettings_SystemUser_ErrorStrings";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserStrings, "SystemUserNoRecordSelected", {
                get: function () {
                    return "SMBAdvSettings_SystemUser_NoRecordSelected";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserStrings, "SystemUserChangeManagerHeaderDescription", {
                get: function () {
                    return "SMBAdvSettings_SystemUser_ChangeManager_HeaderDescription";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserStrings, "SystemUserChangeManagerPluralHeaderDescription", {
                get: function () {
                    return "SMBAdvSettings_SystemUsers_ChangeManager_HeaderDescription";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserStrings, "SystemUserJoinTeamHeaderDescription", {
                get: function () {
                    return "SMBAdvSettings_SystemUser_JoinTeam_HeaderDescription";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserStrings, "SystemUserJoinTeamPluralHeaderDescription", {
                get: function () {
                    return "SMBAdvSettings_SystemUsers_JoinTeam_HeaderDescription";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserStrings, "SystemUserManageRolesHeaderDescription", {
                get: function () {
                    return "SMBAdvSettings_SystemUser_ManageRoles_HeaderDescription";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserStrings, "SystemUserManageRolesPluralHeaderDescription", {
                get: function () {
                    return "SMBAdvSettings_SystemUsers_ManageRoles_HeaderDescription";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserStrings, "SystemUserManageRolesTableHeader", {
                get: function () {
                    return "SMBAdvSettings_ManageRoles_TableHeader";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserStrings, "SystemUserReassignRecordsHeaderDescription", {
                get: function () {
                    return "SMBAdvSettings_SystemUser_ReassignRecords_HeaderDescription";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserStrings, "SystemUserManageRolesSuccessNotification", {
                get: function () {
                    return "SMBAdvSettings_SystemUser_ManageRoles_SuccessNotification";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserStrings, "SystemUserJoinTeamsSuccessNotification", {
                get: function () {
                    return "SMBAdvSettings_SystemUser_JoinTeams_SuccessNotification";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserStrings, "SystemUserChangeManagerSuccessNotification", {
                get: function () {
                    return "SMBAdvSettings_SystemUser_ChangeManager_SuccessNotification";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemUserStrings, "SystemUserReassignRecordsSuccessNotification", {
                get: function () {
                    return "SMBAdvSettings_SystemUser_ReassignRecords_SuccessNotification";
                },
                enumerable: true,
                configurable: true
            });
            return SystemUserStrings;
        }());
        AppCommon.SystemUserStrings = SystemUserStrings;
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
