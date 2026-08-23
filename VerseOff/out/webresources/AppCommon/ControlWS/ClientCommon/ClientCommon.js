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
    var RetrieveTenantAdminPermissionsRequest = (function () {
        function RetrieveTenantAdminPermissionsRequest() {
        }
        RetrieveTenantAdminPermissionsRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {},
                operationName: "RetrieveTenantAdminPermissions",
                operationType: 1,
            };
            return metadata;
        };
        return RetrieveTenantAdminPermissionsRequest;
    }());
    ODataContract.RetrieveTenantAdminPermissionsRequest = RetrieveTenantAdminPermissionsRequest;
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
    var RetrieveUserPrivilegesRequest = (function () {
        function RetrieveUserPrivilegesRequest(entity /*Microsoft.Dynamics.CRM.systemuser*/) {
            this.entity = entity;
        }
        RetrieveUserPrivilegesRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.systemuser",
                        "structuralProperty": 5,
                    },
                },
                operationName: "RetrieveUserPrivileges",
                operationType: 1,
            };
            return metadata;
        };
        return RetrieveUserPrivilegesRequest;
    }());
    ODataContract.RetrieveUserPrivilegesRequest = RetrieveUserPrivilegesRequest;
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
/// <reference path="../../../../../references/internal/TypeDefinitions/XrmClientApi/XrmClassicWebClientApi.d.ts" />
/// <reference path="../../Controls/FREShell/DataContracts/RetrieveTenantAdminPermissionsRequest.ts" />
/// <reference path="../../Controls/FREShell/DataContracts/RetrieveUserPrivilegesRequest.ts" />
/// <reference path="../clientcommon/dialogutils.ts" />
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var RetrieveTenantAdminPermissionsRequest = ODataContract.RetrieveTenantAdminPermissionsRequest;
        var RetrieveUserPrivilegesRequest = ODataContract.RetrieveUserPrivilegesRequest;
        var TeamType;
        (function (TeamType) {
            TeamType[TeamType["Owner"] = 0] = "Owner";
            TeamType[TeamType["Access"] = 1] = "Access";
        })(TeamType || (TeamType = {}));
        var RibbonRules = (function () {
            function RibbonRules() {
            }
            RibbonRules.ShowDownloadTemplateButton = function () {
                return true;
            };
            RibbonRules.IsUClient = function () {
                var global = window;
                var xrm = global.Xrm;
                var result = false;
                if (xrm && xrm.Internal && xrm.Internal.isUci) {
                    result = xrm.Internal.isUci();
                }
                else {
                    // fall back to url inspection
                    result = window && window.parent
                        && window.parent.location
                        && window.parent.location.href
                        && window.parent.location.href.toLowerCase().indexOf("uclient") !== -1;
                }
                return result;
            };
            RibbonRules.IsAppCommonControlPage = function () {
                var result = false;
                // return true if current url format matches appcommon smb control pages' url 
                result = window && window.parent
                    && window.parent.location
                    && window.parent.location.href
                    && window.parent.location.href.toLowerCase().indexOf("controlname=mscrmcontrols.appcommon.") !== -1;
                return result;
            };
            RibbonRules.IsSalesProControlPage = function () {
                var result = false;
                // return true if current url format matches appcommon salespro control pages' url 
                result = window && window.parent
                    && window.parent.location
                    && window.parent.location.href
                    && window.parent.location.href.toLowerCase().indexOf("controlname=mscrmcontrols.salespro.") !== -1;
                return result;
            };
            /// <summary>
            /// Checks the current role has Assign Privileges.
            /// </summary>
            /// <returns>true if it is role is assign, false otherwise</returns>
            RibbonRules.CheckRoleHasAssignPrivilege = function () {
                if (false == RibbonRules.retrieveUserPrivilegesAPICalled) {
                    var userId = Xrm.Page.context.getUserId();
                    userId = userId.replace(/[{}]/g, '');
                    var sourceEntity = { id: userId, entityType: "systemuser" };
                    var that = this;
                    var retrieveUserPrivilegesRequest = new RetrieveUserPrivilegesRequest(sourceEntity);
                    return Xrm.WebApi.online.execute(retrieveUserPrivilegesRequest).then(function (response) {
                        if (response) {
                            return response.json().then(function (jsonResponse) {
                                /*
                                Sample format of JSON retrived by the OData call
                                {
                                "@odata.context":"http://<machine>/<org>/api/data/v9.0/$metadata#Microsoft.Dynamics.CRM.RetrieveUserPrivilegesResponse",
                                "RolePrivileges":
                                    [
                                        {"Depth":"Global","PrivilegeId":"0011cc28-36a4-4b1c-8c25-d0c516ddb4bc","BusinessUnitId":"45fd3737-274d-e711-80ea-00155d36101c"},
                                        {"Depth":"Global","PrivilegeId":"003d8a0f-c230-411c-a993-cc0a8aeaac96","BusinessUnitId":"45fd3737-274d-e711-80ea-00155d36101c"},
                                        ...
                                    ]
                                }
                                */
                                try {
                                    if (jsonResponse) {
                                        var rolePrivileges = jsonResponse.RolePrivileges;
                                        RibbonRules.retrieveUserPrivilegesAPICalled = true;
                                        for (var index in rolePrivileges) {
                                            var permissionObject = rolePrivileges[index];
                                            //check if user has create permission on team entity
                                            //"836D6C7B-CF1D-47F0-8021-8E41091C489C" is for prvAssignRole permission
                                            var privilegeID = permissionObject["PrivilegeId"];
                                            if (privilegeID == "836d6c7b-cf1d-47f0-8021-8e41091c489c") {
                                                RibbonRules.hasAssignRolePermission = true;
                                                return true;
                                            }
                                        }
                                    }
                                }
                                catch (e) {
                                    console.error("EnableRule CheckRoleHasAssignPrivilege execution failed due to : incorrect jsonResponse from WebAPI request RetrieveUserPrivilegesRequest API.");
                                    return false;
                                }
                            });
                        }
                    }, function (error) {
                        console.error("EnableRule CheckRoleHasAssignPrivilege execution failed due to : WebAPI request failed for RetrieveUserPrivilegesRequest API.");
                        RibbonRules.hasAssignRolePermission = false;
                        RibbonRules.retrieveUserPrivilegesAPICalled = false;
                        return false;
                    });
                }
                else
                    return RibbonRules.hasAssignRolePermission;
            };
            /// <summary>
            /// Specifies if the ribbon commands for team of owner type should be enabled
            /// </summary>
            /// <param name="gridControl">Grid control instance</param>
            /// <returns>true if the commands should be enabled</returns>
            RibbonRules.EnableOwnerTeamCommands = function (gridControl) {
                var result = false;
                if (!AppCommon.DialogUtils.isNullOrUndefined(gridControl)) {
                    for (var i = 0; i < gridControl.getGrid().getTotalRecordCount(); ++i) {
                        var currentRow = gridControl.getGrid().getSelectedRows().get(i);
                        if (!AppCommon.DialogUtils.isNullOrUndefined(currentRow)) {
                            var teamTypeAttribute = currentRow.getData().getEntity().attributes.getByName("teamtype");
                            if (!AppCommon.DialogUtils.isNullOrUndefined(teamTypeAttribute) && teamTypeAttribute.getInitialValue() === TeamType.Owner) {
                                result = true;
                                break;
                            }
                        }
                    }
                }
                return result;
            };
            /// <summary>
            /// Checks if the team type is of Owner
            /// </summary>
            /// <returns>true if it is owner type, false otherwise</returns>
            RibbonRules.IsTeamTypeOwnerType = function () {
                if (Xrm.Page) {
                    var teamTypeValue = Xrm.Page.getAttribute("teamtype").getValue();
                    if (TeamType.Owner == teamTypeValue) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            };
            RibbonRules.IsInAppCustomizationSystemView = function () {
                var isInAppCustomizationContext = false;
                if (window && window.parent
                    && window.parent.location
                    && window.parent.location.href
                    && window.parent.location.href.toLowerCase().indexOf("mscrmcontrols.appcommon.systemview.systemviewctrl") != -1) {
                    isInAppCustomizationContext = true;
                }
                return isInAppCustomizationContext;
            };
            RibbonRules.CheckTenantAdminPermissions = function () {
                if (!AppCommon.DialogUtils.isNullOrUndefined(RibbonRules.retrieveTenantAdminPermissionsAPICalled)) {
                    if (!AppCommon.DialogUtils.isNullOrUndefined(RibbonRules.isTenantManaged)
                        && !AppCommon.DialogUtils.isNullOrUndefined(RibbonRules.isCurrentUserTenantAdmin)
                        && RibbonRules.isTenantManaged
                        && RibbonRules.isCurrentUserTenantAdmin) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                var retrieveTenantAdminPermissionsRequest = new RetrieveTenantAdminPermissionsRequest();
                Xrm.WebApi.online.execute(retrieveTenantAdminPermissionsRequest).then(function (response) {
                    if (response) {
                        response.json().then(function (jsonResponse) {
                            /*
                            Sample format of JSON retrived by the OData call
                            {
                                {
                                    "@odata.context": "http://<machine>/<org>/api/data/v9.0/$metadata#Microsoft.Dynamics.CRM.RetrieveTenantAdminPermissionsResponse",
                                    "AdminPermissions": "{\"isCurrentUserTenantAdmin\":\"true\",\"isTenantManaged\":\"true\"}"
                                }
                            }
                            */
                            try {
                                var parsedResponse = JSON.parse(jsonResponse["AdminPermissions"]);
                                if (parsedResponse["isCurrentUserTenantAdmin"].toLowerCase() == "true") {
                                    RibbonRules.isCurrentUserTenantAdmin = true;
                                }
                                else {
                                    RibbonRules.isCurrentUserTenantAdmin = false;
                                }
                                if (parsedResponse["isTenantManaged"].toLowerCase() == "true") {
                                    RibbonRules.isTenantManaged = true;
                                }
                                else {
                                    RibbonRules.isTenantManaged = false;
                                }
                                if (RibbonRules.isCurrentUserTenantAdmin && RibbonRules.isTenantManaged) {
                                    RibbonRules.retrieveTenantAdminPermissionsAPICalled = true;
                                    return true;
                                }
                            }
                            catch (e) {
                                console.error(e);
                            }
                            finally {
                                RibbonRules.retrieveTenantAdminPermissionsAPICalled = true;
                                return false;
                            }
                        });
                    }
                }, function (error) {
                    console.error("EnableRule CheckTenantAdminPermissions execution failed due to : WebAPI request failed for RetrieveTenantAdminPermissions API.");
                    RibbonRules.retrieveTenantAdminPermissionsAPICalled = true;
                    return false;
                });
                RibbonRules.retrieveTenantAdminPermissionsAPICalled = true;
                return false;
            };
            return RibbonRules;
        }());
        RibbonRules.retrieveUserPrivilegesAPICalled = false;
        RibbonRules.hasAssignRolePermission = false;
        AppCommon.RibbonRules = RibbonRules;
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
