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
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        /**
         * Contains constants & erros related to TeamManagement commands
         */
        var AddTeamConstants = (function () {
            function AddTeamConstants() {
            }
            Object.defineProperty(AddTeamConstants, "MDD_ADDTEAM_TEAMNAME_CONTROL", {
                //Constants for AddTeam Command
                get: function () {
                    return "teamName_id";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AddTeamConstants, "MDD_ADDTEAM_BUSINESSUNITNAME_CONTROL", {
                get: function () {
                    return "businessUnitName_id";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AddTeamConstants, "MDD_ADDTEAM_TEAMDESCRIPTION_CONTROL", {
                get: function () {
                    return "teamDescription_id";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AddTeamConstants, "MDD_ADDTEAM_TEAMADMINISTRATOR_CONTROL", {
                get: function () {
                    return "teamAdministrator_id";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AddTeamConstants, "MDD_ADDTEAM_ADDBUTTON_CONTROL", {
                get: function () {
                    return "add_id";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AddTeamConstants, "MDD_ADDTEAM_SAVESUCCESS_PARAM", {
                get: function () {
                    return "save_success";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AddTeamConstants, "MDD_ADDTEAM_BUSINESSUNITDATA_PARAM", {
                get: function () {
                    return "businessUnit_data";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AddTeamConstants, "BUSINESSUNITDATA_QUERY", {
                get: function () {
                    return "?$select=systemuserid&$expand=businessunitid($select=name,businessunitid)";
                },
                enumerable: true,
                configurable: true
            });
            return AddTeamConstants;
        }());
        AppCommon.AddTeamConstants = AddTeamConstants;
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
/// <reference path="../ClientCommon/DialogUtils.ts" />
/// <reference path="./AddTeamConstants.ts" />
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        /**
         * Contains methods for SMBAddNewTeam MDD
         */
        var Team_AddTeam = (function () {
            function Team_AddTeam() {
            }
            /**
             * Add button click handler for MDD SMBAddNewTeam
             */
            Team_AddTeam.prototype.AddButtonClickHandler = function (eventContext) {
                try {
                    var businessUnitData = eventContext.getFormContext().data.attributes.get(AppCommon.AddTeamConstants.MDD_ADDTEAM_BUSINESSUNITDATA_PARAM).getValue();
                    var teamNameControlValue = AppCommon.DialogUtils.GetControlValue(AppCommon.AddTeamConstants.MDD_ADDTEAM_TEAMNAME_CONTROL);
                    var teamDescriptionControlValue = AppCommon.DialogUtils.GetControlValue(AppCommon.AddTeamConstants.MDD_ADDTEAM_TEAMDESCRIPTION_CONTROL);
                    var teamAdministratorControlValue = AppCommon.DialogUtils.GetControlValue(AppCommon.AddTeamConstants.MDD_ADDTEAM_TEAMADMINISTRATOR_CONTROL);
                    var teamAdministratorId = null;
                    if (!AppCommon.DialogUtils.isNullOrUndefined(teamAdministratorControlValue) && teamAdministratorControlValue.length > 0) {
                        //when user has selected administrator for new team
                        if (!AppCommon.DialogUtils.isNullOrUndefined(teamAdministratorControlValue[0].id)) {
                            teamAdministratorId = teamAdministratorControlValue[0].id.replace(/[{}]/g, '');
                        }
                    }
                    AppCommon.AddTeamCommand.CreateNewTeam(eventContext, teamNameControlValue, businessUnitData.businessunitid, teamDescriptionControlValue, teamAdministratorId);
                }
                catch (e) {
                    AppCommon.DialogUtils.ShowGenericError(e);
                }
            };
            /**
             * Creates new team record
             * @param eventContext eventContext of MDD
             * @param teamName Name of the team
             * @param businessUnitId Businessunitid of the team
             * @param teamDescripition Description of the team
             * @param teamAdministratorId AdministratorId of the team
             */
            Team_AddTeam.prototype.CreateNewTeam = function (eventContext, teamName, businessUnitId, teamDescripition, teamAdministratorId) {
                try {
                    var teamEntity = {};
                    teamEntity["name"] = teamName;
                    teamEntity["businessunitid@odata.bind"] = "/businessunits(" + businessUnitId + ")";
                    if (!AppCommon.DialogUtils.isNullOrUndefined(teamDescripition)) {
                        teamEntity["description"] = teamDescripition;
                    }
                    if (!AppCommon.DialogUtils.isNullOrUndefined(teamAdministratorId)) {
                        teamEntity["administratorid@odata.bind"] = "/systemusers(" + teamAdministratorId + ")";
                    }
                    teamEntity["teamtype"] = 0; //Only team of type=owner(0) is allowed in SMB
                    Xrm.WebApi.createRecord("team", teamEntity).then(function (response) {
                        eventContext.getFormContext().data.attributes.get(AppCommon.AddTeamConstants.MDD_ADDTEAM_SAVESUCCESS_PARAM).setValue(true); //set the parameter value for customcontrol to read and show notification
                        Xrm.Page.ui.close(); //close dialog
                    }, function (error) {
                        SmbAppsTelemetryUtility.TelemetryData.ReportAppComponentFailureTelemetry(null, SmbAppsTelemetryUtility.Controls_PageType.TEAMMANAGEMENT, error);
                        AppCommon.DialogUtils.HandleServerError(error);
                    });
                }
                catch (e) {
                    SmbAppsTelemetryUtility.TelemetryData.ReportAppComponentFailureTelemetry(null, SmbAppsTelemetryUtility.Controls_PageType.TEAMMANAGEMENT, e);
                    AppCommon.DialogUtils.ShowGenericError(e);
                }
            };
            /**
             * OnLoad handler for MDD SMBAddNewTeam
             */
            Team_AddTeam.prototype.OnLoadHandler = function (eventContext) {
                AppCommon.DialogUtils.DisableControl(AppCommon.AddTeamConstants.MDD_ADDTEAM_BUSINESSUNITNAME_CONTROL);
                //Enable all the controls on MDD SMBADDTeam
                AppCommon.DialogUtils.SetVisible(AppCommon.AddTeamConstants.MDD_ADDTEAM_TEAMNAME_CONTROL, true);
                AppCommon.DialogUtils.SetVisible(AppCommon.AddTeamConstants.MDD_ADDTEAM_BUSINESSUNITNAME_CONTROL, true);
                AppCommon.DialogUtils.SetVisible(AppCommon.AddTeamConstants.MDD_ADDTEAM_TEAMDESCRIPTION_CONTROL, true);
                AppCommon.DialogUtils.SetVisible(AppCommon.AddTeamConstants.MDD_ADDTEAM_TEAMADMINISTRATOR_CONTROL, true);
                AppCommon.DialogUtils.SetVisible(AppCommon.AddTeamConstants.MDD_ADDTEAM_ADDBUTTON_CONTROL, true);
                //fetch businessunit name and set in the control
                AppCommon.DialogUtils.GetCurrentUserBusinessUnitData().then(function (response) {
                    try {
                        var businessUnitData = response.businessunitid;
                        eventContext.getFormContext().data.attributes.get(AppCommon.AddTeamConstants.MDD_ADDTEAM_BUSINESSUNITDATA_PARAM).setValue(businessUnitData);
                        AppCommon.DialogUtils.SetControlValue(AppCommon.AddTeamConstants.MDD_ADDTEAM_BUSINESSUNITNAME_CONTROL, businessUnitData.name);
                    }
                    catch (e) {
                        AppCommon.DialogUtils.ShowGenericError(e);
                    }
                }, function (error) {
                    AppCommon.DialogUtils.HandleServerError(error);
                    Xrm.Page.ui.close(); //close dialog
                });
            };
            return Team_AddTeam;
        }());
        AppCommon.AddTeamCommand = new Team_AddTeam();
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        /**
         * Contains constants & erros related to EditTeam command
         */
        var EditTeamConstants = (function () {
            function EditTeamConstants() {
            }
            Object.defineProperty(EditTeamConstants, "EDITTEAM_MDD_NAME", {
                //Constants for EditTeam Command
                get: function () {
                    return "SMBEditTeam";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditTeamConstants, "EDITTEAM_MDD_DIALOG_PARAM_TEAMID", {
                get: function () {
                    return "team_id";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditTeamConstants, "EDITTEAM_MDD_DIALOG_PARAM_BUSINESSUNIT_DATA", {
                get: function () {
                    return "businessUnit_data";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditTeamConstants, "EDITTEAM_MDD_DIALOG_PARAM_TEAM_DATA", {
                get: function () {
                    return "team_data";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditTeamConstants, "EDITTEAM_MDD_DIALOG_PARAM_ADMINISTRATOR_DATA", {
                get: function () {
                    return "administrator_data";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditTeamConstants, "TEAMNAME_CONTROL", {
                get: function () {
                    return "teamName_id";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditTeamConstants, "BUSINESSUNITNAME_CONTROL", {
                get: function () {
                    return "businessUnitName_id";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditTeamConstants, "TEAMDESCRIPTION_CONTROL", {
                get: function () {
                    return "teamDescription_id";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditTeamConstants, "TEAMADMINISTRATOR_CONTROL", {
                get: function () {
                    return "teamAdministrator_id";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditTeamConstants, "CLOSEBUTTON_CONTROL", {
                get: function () {
                    return "close_id";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditTeamConstants, "DONEBUTTON_CONTROL", {
                get: function () {
                    return "done_id";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditTeamConstants, "TEAMDATA_QUERY", {
                get: function () {
                    return "?$select=name,description&$expand=businessunitid($select=name,businessunitid),administratorid($select=firstname,lastname,systemuserid)";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditTeamConstants, "EDITTEAM_UPDATESUCCESSFUL_NOTIFICATION", {
                get: function () {
                    return "EditTeam_UpdateSuccessful_Notification";
                },
                enumerable: true,
                configurable: true
            });
            return EditTeamConstants;
        }());
        AppCommon.EditTeamConstants = EditTeamConstants;
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
/// <reference path="../ClientCommon/DialogUtils.ts" />
/// <reference path="./EditTeamConstants.ts" />
/// <reference path="../../Controls/FREShell/Telemetry/TelemetryUtility.ts" />
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        /**
         * Contains methods for SMBEditTeam MDD
         */
        var Team_EditTeam = (function () {
            function Team_EditTeam() {
            }
            /**
             * Override Edit Option in command bar to open Edit Team Dialog
             * @param records contains an array of grid row objects that are selected
             * @param gridControl contains a handler for grid
             */
            Team_EditTeam.prototype.EditTeamGridButtonHandler = function (records, gridControl) {
                try {
                    if (!AppCommon.DialogUtils.isNullOrUndefined(records)) {
                        var recordId = records[0].Id;
                        var selectedTeamId = recordId.replace(/[{}]/g, '');
                        AppCommon.DialogUtils.showProgressIndicator(AppCommon.DialogUtils.getLocalizedString(AppCommon.TeamStrings.ProgressIndicatorMessage));
                        AppCommon.EditTeamCommand.GetTeamData(selectedTeamId).then(function (response) {
                            var businessUnitData = response.businessunitid;
                            var teamData = { name: response.name, description: response.description, teamid: response.teamid };
                            var administratorData = response.administratorid;
                            AppCommon.DialogUtils.hideProgressIndicator();
                            AppCommon.EditTeamCommand.openEditTeamDialog(selectedTeamId, businessUnitData, teamData, administratorData, gridControl);
                        }, function (error) {
                            SmbAppsTelemetryUtility.TelemetryData.ReportAppComponentFailureTelemetry(null, SmbAppsTelemetryUtility.Controls_PageType.TEAMMANAGEMENT, error);
                            AppCommon.DialogUtils.hideProgressIndicator();
                            AppCommon.DialogUtils.HandleServerError(error);
                            Xrm.Page.ui.close(); //close dialog
                        });
                    }
                    else {
                        AppCommon.DialogUtils.ShowGenericError();
                    }
                }
                catch (e) {
                    AppCommon.DialogUtils.ShowGenericError(e);
                    SmbAppsTelemetryUtility.TelemetryData.ReportAppComponentFailureTelemetry(null, SmbAppsTelemetryUtility.Controls_PageType.TEAMMANAGEMENT, e);
                }
            };
            /**
             * Opens MDD Dialog EditTeam
             * @param userId userId of user
             */
            Team_EditTeam.prototype.openEditTeamDialog = function (teamId, businessUnitData, teamData, administratorData, gridControl) {
                SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.TEAMMANAGEMENT, SmbAppsTelemetryUtility.Controls_EventName.CLICKEDGRIDCOMMAND, "EditTeam", null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, "EditTeam Grid Command Clicked", false);
                try {
                    var dialogParams = {};
                    dialogParams[AppCommon.EditTeamConstants.EDITTEAM_MDD_DIALOG_PARAM_TEAMID] = teamId;
                    dialogParams[AppCommon.EditTeamConstants.EDITTEAM_MDD_DIALOG_PARAM_BUSINESSUNIT_DATA] = businessUnitData;
                    dialogParams[AppCommon.EditTeamConstants.EDITTEAM_MDD_DIALOG_PARAM_TEAM_DATA] = teamData;
                    dialogParams[AppCommon.EditTeamConstants.EDITTEAM_MDD_DIALOG_PARAM_ADMINISTRATOR_DATA] = administratorData;
                    var dialogOptions = {};
                    dialogOptions.position = 2 /* side */;
                    Xrm.Navigation.openDialog(AppCommon.EditTeamConstants.EDITTEAM_MDD_NAME, dialogOptions, dialogParams).then(function (response) {
                        if (!AppCommon.DialogUtils.isNullOrUndefined(gridControl)) {
                            gridControl.refresh();
                        }
                    }, function (error) {
                        SmbAppsTelemetryUtility.TelemetryData.ReportAppComponentFailureTelemetry(null, SmbAppsTelemetryUtility.Controls_PageType.TEAMMANAGEMENT, error);
                        AppCommon.DialogUtils.HandleServerError(error);
                    });
                }
                catch (e) {
                    SmbAppsTelemetryUtility.TelemetryData.ReportAppComponentFailureTelemetry(null, SmbAppsTelemetryUtility.Controls_PageType.TEAMMANAGEMENT, e);
                    AppCommon.DialogUtils.ShowGenericError(e);
                }
            };
            /**
             * OnLoad handler for MDD SMBEditTeam
             */
            Team_EditTeam.prototype.OnLoadHandler = function (eventContext) {
                try {
                    //get the selected teamid from MDD formparameters
                    var businessUnitData = eventContext.getFormContext().data.attributes.get(AppCommon.EditTeamConstants.EDITTEAM_MDD_DIALOG_PARAM_BUSINESSUNIT_DATA).getValue();
                    var teamData = eventContext.getFormContext().data.attributes.get(AppCommon.EditTeamConstants.EDITTEAM_MDD_DIALOG_PARAM_TEAM_DATA).getValue();
                    var administratorData = eventContext.getFormContext().data.attributes.get(AppCommon.EditTeamConstants.EDITTEAM_MDD_DIALOG_PARAM_ADMINISTRATOR_DATA).getValue();
                    //set the values(teamdata) in controls
                    AppCommon.DialogUtils.SetControlValue(AppCommon.EditTeamConstants.TEAMNAME_CONTROL, teamData.name);
                    AppCommon.DialogUtils.SetControlValue(AppCommon.EditTeamConstants.BUSINESSUNITNAME_CONTROL, businessUnitData.name);
                    AppCommon.DialogUtils.DisableControl(AppCommon.EditTeamConstants.BUSINESSUNITNAME_CONTROL); //Disable team description control as it should not be editable
                    if (!AppCommon.DialogUtils.isNullOrUndefined(teamData.description)) {
                        AppCommon.DialogUtils.SetControlValue(AppCommon.EditTeamConstants.TEAMDESCRIPTION_CONTROL, teamData.description);
                    }
                    if (!AppCommon.DialogUtils.isNullOrUndefined(administratorData)
                        && !AppCommon.DialogUtils.isNullOrUndefined(administratorData.systemuserid)) {
                        var teamAdmin = new Array();
                        teamAdmin[0] = new Object();
                        teamAdmin[0].id = administratorData.systemuserid;
                        teamAdmin[0].name = administratorData.firstname + " " + administratorData.lastname;
                        teamAdmin[0].entityType = "systemuser";
                        AppCommon.DialogUtils.SetControlValue(AppCommon.EditTeamConstants.TEAMADMINISTRATOR_CONTROL, teamAdmin);
                    }
                    //Enable all the controls on MDD SMBEditTeam
                    AppCommon.DialogUtils.SetVisible(AppCommon.EditTeamConstants.TEAMNAME_CONTROL, true);
                    AppCommon.DialogUtils.SetVisible(AppCommon.EditTeamConstants.BUSINESSUNITNAME_CONTROL, true);
                    AppCommon.DialogUtils.SetVisible(AppCommon.EditTeamConstants.TEAMDESCRIPTION_CONTROL, true);
                    AppCommon.DialogUtils.SetVisible(AppCommon.EditTeamConstants.TEAMADMINISTRATOR_CONTROL, true);
                    AppCommon.DialogUtils.SetVisible(AppCommon.EditTeamConstants.CLOSEBUTTON_CONTROL, true);
                    AppCommon.DialogUtils.SetVisible(AppCommon.EditTeamConstants.DONEBUTTON_CONTROL, true);
                }
                catch (e) {
                    SmbAppsTelemetryUtility.TelemetryData.ReportAppComponentFailureTelemetry(null, SmbAppsTelemetryUtility.Controls_PageType.TEAMMANAGEMENT, e);
                    AppCommon.DialogUtils.ShowGenericError(e);
                }
            };
            /**
             * OnClick handler for Close button on MDD SMBEditTeam
             */
            Team_EditTeam.prototype.CloseButtonClickHandler = function (eventContext) {
                try {
                    Xrm.Page.ui.close(); //close dialog
                }
                catch (e) {
                    SmbAppsTelemetryUtility.TelemetryData.ReportAppComponentFailureTelemetry(null, SmbAppsTelemetryUtility.Controls_PageType.TEAMMANAGEMENT, e);
                    AppCommon.DialogUtils.ShowGenericError(e);
                }
            };
            /**
             * OnClick handler for Done button on MDD SMBEditTeam
             */
            Team_EditTeam.prototype.DoneButtonClickHandler = function (eventContext) {
                try {
                    var businessUnitData = eventContext.getFormContext().data.attributes.get(AppCommon.EditTeamConstants.EDITTEAM_MDD_DIALOG_PARAM_BUSINESSUNIT_DATA).getValue();
                    var oldTeamData = eventContext.getFormContext().data.attributes.get(AppCommon.EditTeamConstants.EDITTEAM_MDD_DIALOG_PARAM_TEAM_DATA).getValue();
                    var teamNameControlValue = AppCommon.DialogUtils.GetControlValue(AppCommon.EditTeamConstants.TEAMNAME_CONTROL);
                    var teamDescriptionControlValue = AppCommon.DialogUtils.GetControlValue(AppCommon.EditTeamConstants.TEAMDESCRIPTION_CONTROL);
                    var teamAdministratorControlValue = AppCommon.DialogUtils.GetControlValue(AppCommon.EditTeamConstants.TEAMADMINISTRATOR_CONTROL);
                    var teamAdministratorId = null;
                    if (!AppCommon.DialogUtils.isNullOrUndefined(teamAdministratorControlValue) && teamAdministratorControlValue.length > 0) {
                        //when user has selected administrator for team
                        if (!AppCommon.DialogUtils.isNullOrUndefined(teamAdministratorControlValue[0].id)) {
                            teamAdministratorId = teamAdministratorControlValue[0].id.replace(/[{}]/g, '');
                        }
                    }
                    AppCommon.EditTeamCommand.UpdateTeam(oldTeamData.teamid, teamNameControlValue, businessUnitData.businessunitid, teamDescriptionControlValue, teamAdministratorId);
                }
                catch (e) {
                    SmbAppsTelemetryUtility.TelemetryData.ReportAppComponentFailureTelemetry(null, SmbAppsTelemetryUtility.Controls_PageType.TEAMMANAGEMENT, e);
                    AppCommon.DialogUtils.ShowGenericError(e);
                }
            };
            /**
             * Updates team record
             * @param teamId teamid of the team
             * @param teamName Name of the team
             * @param businessUnitId Businessunitid of the team
             * @param teamDescripition Description of the team
             * @param teamAdministratorId AdministratorId of the team
             */
            Team_EditTeam.prototype.UpdateTeam = function (teamId, teamName, businessUnitId, teamDescripition, teamAdministratorId) {
                try {
                    var teamEntity = {};
                    teamEntity["name"] = teamName;
                    teamEntity["businessunitid@odata.bind"] = "/businessunits(" + businessUnitId + ")";
                    if (!AppCommon.DialogUtils.isNullOrUndefined(teamDescripition)) {
                        teamEntity["description"] = teamDescripition;
                    }
                    if (!AppCommon.DialogUtils.isNullOrUndefined(teamAdministratorId)) {
                        teamEntity["administratorid@odata.bind"] = "/systemusers(" + teamAdministratorId + ")";
                    }
                    Xrm.WebApi.updateRecord("team", teamId, teamEntity).then(function (response) {
                        AppCommon.DialogUtils.showGlobalNotification(AppCommon.DialogUtils.getLocalizedString(AppCommon.EditTeamConstants.EDITTEAM_UPDATESUCCESSFUL_NOTIFICATION));
                        Xrm.Page.ui.close(); //close dialog
                    }, function (error) {
                        SmbAppsTelemetryUtility.TelemetryData.ReportAppComponentFailureTelemetry(null, SmbAppsTelemetryUtility.Controls_PageType.TEAMMANAGEMENT, error);
                        AppCommon.DialogUtils.HandleServerError(error);
                    });
                }
                catch (e) {
                    SmbAppsTelemetryUtility.TelemetryData.ReportAppComponentFailureTelemetry(null, SmbAppsTelemetryUtility.Controls_PageType.TEAMMANAGEMENT, e);
                    AppCommon.DialogUtils.ShowGenericError(e);
                }
            };
            /**
             * Gets the data related to team
             * returns promise same as Xrm.WebApi.online.retrieveRecord
             */
            Team_EditTeam.prototype.GetTeamData = function (teamId) {
                return Xrm.WebApi.retrieveRecord("team", teamId, AppCommon.EditTeamConstants.TEAMDATA_QUERY);
            };
            return Team_EditTeam;
        }());
        AppCommon.EditTeamCommand = new Team_EditTeam();
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
        var MANAGEROLES = "Team_ManageRoles";
        var MANAGEROLESCLICKED = "Team_ManageRoles Clicked";
        var MANAGEROLESCOMPLETED = "Team_ManageRoles Completed";
        var TEAM_ROLE_RELATIONSHIP = "teamroles_association";
        var TEAM_ENTITYNAME = "team";
        var ROLE_ENTITYNAME = "role";
        var Team_ManageRoles = (function () {
            function Team_ManageRoles() {
                this.LoadingData = "Loading data";
                this.checkBoxControlID = "manageroles_cc-manageroles_cc.field-RolesContainer_cb";
                this.onCancelClick = function (eventContext) {
                    var formContext = eventContext.getFormContext();
                    formContext.ui.close();
                };
                this.onDialogLoad = function (eventContext) {
                    var selectedTeamsCount = eventContext.getFormContext().data.attributes.get(AppCommon.DialogConstants.TotalRecordsSelected).getValue();
                    var headerDescription = "";
                    if (selectedTeamsCount == 1) {
                        headerDescription = String.format(AppCommon.DialogUtils.getLocalizedString(AppCommon.TeamStrings.TeamManageRolesHeaderDescription), selectedTeamsCount);
                    }
                    else {
                        headerDescription = String.format(AppCommon.DialogUtils.getLocalizedString(AppCommon.TeamStrings.TeamManageRolesPluralHeaderDescription), selectedTeamsCount);
                    }
                    eventContext.getFormContext().getControl(AppCommon.TeamConstants.Team_SelectedRecordsLabel).setLabel(headerDescription);
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
            // Method called when clicking on "Manage Roles" on Team entity form.
            Team_ManageRoles.prototype.ManageRolesFromForm = function () {
                SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.TEAMMANAGEMENT, SmbAppsTelemetryUtility.Controls_EventName.CLICKEDFORMCOMMAND, MANAGEROLES, null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, MANAGEROLESCLICKED, false);
                var dialogParams = {};
                var id = Xrm.Page.data.entity.getId();
                var records = [{ Id: id.substring(1, 37).toLowerCase() }];
                dialogParams[AppCommon.DialogConstants.SelectedRecords] = records;
                dialogParams[AppCommon.DialogConstants.RowsData] = "";
                dialogParams[AppCommon.DialogConstants.ColumnsDefinition] = "";
                dialogParams[AppCommon.DialogConstants.LastButtonClicked] = "";
                dialogParams[AppCommon.DialogConstants.TotalRecordsSelected] = 1;
                var dialogOptions = {
                    position: 2 /* side */,
                    width: AppCommon.DialogConstants.DialogWidth
                };
                AppCommon.ManageTeamRolesCommand.manageRolesInternal(dialogParams);
            };
            // Method called when clicking on "Manage Roles" on Team entity grid.
            Team_ManageRoles.prototype.ManageRolesFromGrid = function (records) {
                SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.TEAMMANAGEMENT, SmbAppsTelemetryUtility.Controls_EventName.CLICKEDGRIDCOMMAND, MANAGEROLES, null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, MANAGEROLESCLICKED, false);
                if (records && records.length > 0) {
                    var dialogParams = {};
                    dialogParams[AppCommon.DialogConstants.SelectedRecords] = records;
                    dialogParams[AppCommon.DialogConstants.RowsData] = "";
                    dialogParams[AppCommon.DialogConstants.ColumnsDefinition] = "";
                    dialogParams[AppCommon.DialogConstants.LastButtonClicked] = "";
                    dialogParams[AppCommon.DialogConstants.TotalRecordsSelected] = records.length;
                    var dialogOptions = {
                        position: 2 /* side */,
                        width: AppCommon.DialogConstants.DialogWidth
                    };
                    AppCommon.ManageTeamRolesCommand.manageRolesInternal(dialogParams);
                }
            };
            Team_ManageRoles.prototype.manageRolesInternal = function (dialogParams) {
                var selectedRecords = dialogParams[AppCommon.DialogConstants.SelectedRecords];
                var dialogOptions = {
                    position: 2 /* side */,
                    width: AppCommon.DialogConstants.DialogWidth
                };
                this._observeAction = this.observeAction.bind(this);
                this._observeObject = window.top.document.querySelector('#ApplicationShell');
                this.startObservation();
                AppCommon.DialogUtils.showProgressIndicator(AppCommon.ManageTeamRolesCommand.LoadingData);
                return AppCommon.ManageTeamRolesCommand.getData(selectedRecords)
                    .then(function (response) {
                    AppCommon.DialogUtils.hideProgressIndicator();
                    if (response && response.length && response.length == 2) {
                        // Populate column definitions
                        dialogParams[AppCommon.DialogConstants.ColumnsDefinition] = AppCommon.ManageTeamRolesCommand.getColumnDefinitions();
                        // Contains mapping of teamId -> Array of RoleIds
                        var teamRolesMap_1 = {};
                        // Keeps track of all the roles assigned
                        var assignedRoles_1 = {};
                        // Right now due to bug, the Odata API is returning value with keys like
                        // teamroles_0xee_roleid. Putting below code as a workaround for that.
                        // After bug fix keys should be like teamroles.roleid
                        var roleIdKey_1 = response[1].entities && response[1].entities.length > 0
                            ? AppCommon.ManageTeamRolesCommand.getKeyBeginningWith(response[1].entities[0], "teamroles")
                            : "";
                        // response[1] => Team roles
                        response[1].entities.forEach(function (value) {
                            teamRolesMap_1[value.teamid] = teamRolesMap_1[value.teamid] || [];
                            teamRolesMap_1[value.teamid].push(value[roleIdKey_1]);
                            assignedRoles_1[value[roleIdKey_1]] = true;
                        });
                        dialogParams[AppCommon.DialogConstants.TeamRolesMap] = teamRolesMap_1;
                        // If there is only a single team selected, then we need to show corresponding roles as selected
                        var shouldShowRolesAsSelected_1 = selectedRecords.length == 1;
                        // response[0] => Roles Data
                        dialogParams[AppCommon.DialogConstants.RowsData] = response[0].entities.filter(function (value) {
                            if (value.roleid.toLowerCase() === AppCommon.TeamConstants.SalesBusinessAppRoleGuid) {
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
                        Xrm.Navigation.openDialog(AppCommon.DialogConstants.ManageTeamRolesDialogName, dialogOptions, dialogParams)
                            .then(AppCommon.ManageTeamRolesCommand.dialogCloseCallback);
                    }
                }, AppCommon.DialogUtils.actionFailedCallback);
            };
            Team_ManageRoles.prototype.getData = function (selectedRecords) {
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
                    var appIdCondition = AppCommon.ManageTeamRolesCommand.buildAppIdConditionXML(appId);
                    var getRolesFetchXML = String.format(AppCommon.FetchXmls.GetRoles, appIdCondition);
                    var getTeamRolesFetchXML = String.format(AppCommon.FetchXmls.GetTeamRoles, appIdCondition
                        + AppCommon.ManageTeamRolesCommand.buildTeamIdConditionXML(selectedRecords));
                    var getRolesPromise = Xrm.WebApi.retrieveMultipleRecords(ROLE_ENTITYNAME, AppCommon.FetchXmls.FetchXmlQueryString + getRolesFetchXML);
                    var getTeamRolesPromise = Xrm.WebApi.retrieveMultipleRecords(TEAM_ENTITYNAME, AppCommon.FetchXmls.FetchXmlQueryString + getTeamRolesFetchXML);
                    return window.Promise.all([getRolesPromise, getTeamRolesPromise]);
                });
            };
            Team_ManageRoles.prototype.getKeyBeginningWith = function (record, prefix) {
                var matchedKey = "";
                Object.keys(record).forEach(function (key) {
                    if (key.indexOf(prefix) >= 0)
                        matchedKey = key;
                });
                return matchedKey;
            };
            Team_ManageRoles.prototype.buildAppIdConditionXML = function (appId) {
                if (appId) {
                    var appIdConditionXML = String.format(AppCommon.FetchXmls.AppIdCondition, appId);
                    var andFilter = String.format(AppCommon.FetchXmls.ANDFilter, appIdConditionXML);
                    return String.format(AppCommon.FetchXmls.AppModuleRolesLinkEntity, andFilter);
                }
                return "";
            };
            Team_ManageRoles.prototype.buildTeamIdConditionXML = function (selectedRecords) {
                var teamIds = "";
                selectedRecords.forEach(function (value) {
                    teamIds += String.format(AppCommon.FetchXmls.InOperatorValue, value.Id);
                });
                return String.format(AppCommon.FetchXmls.ANDFilter, String.format(AppCommon.FetchXmls.TeamIdCondition, teamIds) // Wrap up the values in "And" filter tag
                );
            };
            Team_ManageRoles.prototype.getColumnDefinitions = function () {
                return {
                    "rolename": {
                        Name: "rolename",
                        DisplayName: AppCommon.DialogUtils.getLocalizedString(AppCommon.TeamStrings.TeamManageRolesTableHeader),
                        Width: 200
                    }
                };
            };
            Team_ManageRoles.prototype.dialogCloseCallback = function (dialogResponse) {
                SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.TEAMMANAGEMENT, SmbAppsTelemetryUtility.Controls_EventName.CLOSEDCOMMAND, MANAGEROLES, null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, MANAGEROLESCOMPLETED, false);
                if (dialogResponse
                    && dialogResponse.parameters
                    && dialogResponse.parameters[AppCommon.DialogConstants.LastButtonClicked] === AppCommon.DialogConstants.DialogOkId) {
                    var selectedRecords = dialogResponse.parameters[AppCommon.DialogConstants.SelectedRecords];
                    if (dialogResponse.parameters[AppCommon.DialogConstants.RowsData]) {
                        var roles = dialogResponse.parameters[AppCommon.DialogConstants.RowsData];
                        var teamRolesMap = dialogResponse.parameters[AppCommon.DialogConstants.TeamRolesMap];
                        var teamIds_1 = [];
                        selectedRecords.forEach(function (item) { return teamIds_1.push(item.Id); });
                        var roleIdSelected_1 = [];
                        roles.forEach(function (item) { if (item.IsSelected) {
                            roleIdSelected_1.push(item.Id);
                        } });
                        AppCommon.ManageTeamRolesCommand.updateTeamRoles(teamIds_1, roleIdSelected_1, teamRolesMap);
                    }
                }
            };
            Team_ManageRoles.prototype.updateTeamRoles = function (teamIds, rolesSelected, teamRoleMap) {
                var disasscoiateRequests = [];
                var associateRequests = [];
                var allRequests = [];
                for (var teamIndex in teamIds) {
                    var selectedTeamId = teamIds[teamIndex];
                    // If newRolesSelected and existingRoles are two sets representing the new and current roles of a Team
                    // diassociateRolesList = existingRoles - newRolesSelected is the set of roles to be deleted
                    // associateRolesList = newRolesSelected - existingRoles is the set of roles to be inserted
                    var newRolesSelected = rolesSelected;
                    var existingRoles = teamRoleMap[selectedTeamId];
                    var diassociateRolesList = this.minus(existingRoles, newRolesSelected);
                    var associateRolesList = this.minus(newRolesSelected, existingRoles);
                    var targetTeam = {
                        id: String(selectedTeamId),
                        name: "",
                        entityType: TEAM_ENTITYNAME
                    };
                    //make array of required disassociate requests
                    for (var roleIndex in diassociateRolesList) {
                        var roleId = diassociateRolesList[roleIndex];
                        disasscoiateRequests.push(new DisassociateRequest(targetTeam, TEAM_ROLE_RELATIONSHIP, String(roleId)));
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
                        associateRequests.push(new AssociateRequest(targetTeam, TEAM_ROLE_RELATIONSHIP, relatedEntities));
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
                            AppCommon.DialogUtils.showGlobalNotification(AppCommon.DialogUtils.getLocalizedString(AppCommon.TeamStrings.TeamManageRolesSuccessNotification));
                        }
                        else {
                            AppCommon.DialogUtils.HandleServerError(responseArray);
                        }
                    }, AppCommon.DialogUtils.actionFailedCallback);
                }
            };
            Team_ManageRoles.prototype.minus = function (a, b) {
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
            Team_ManageRoles.prototype.observeAction = function (mutations) {
                var mutationRecord = mutations[0];
                if (mutationRecord.addedNodes[0] !== undefined && window.top.document.querySelectorAll('[id*="' + this.checkBoxControlID + '"]').length != 0) {
                    window.top.document.getElementById(window.top.document.querySelectorAll('[id*="' + this.checkBoxControlID + '"]')[0].id).focus();
                    this._observer.disconnect();
                }
            };
            Team_ManageRoles.prototype.startObservation = function () {
                var _this = this;
                this._observer = new MutationObserver(function (mutation) { return _this._observeAction(mutation); });
                var config = {
                    childList: true,
                    subtree: true
                };
                this._observer.observe(this._observeObject, config);
            };
            ;
            return Team_ManageRoles;
        }());
        AppCommon.ManageTeamRolesCommand = new Team_ManageRoles();
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
        var AddMembersTeamRequest = ODataContract.AddMembersTeamRequest;
        var ADDMEMBERS = "Team_AddMembers";
        var ADDMEMBERSCLICKED = "Team_AddMembers Clicked";
        var ADDMEMBERSCOMPLETED = "Team_AddMembers Completed";
        var Team_AddMembers = (function () {
            function Team_AddMembers() {
                this.onCancelClick = function (eventContext) {
                    var formContext = eventContext.getFormContext();
                    formContext.ui.close();
                };
                this.onDialogLoad = function (eventContext) {
                    var selectedTeamsCount = eventContext.getFormContext().data.attributes.get(AppCommon.DialogConstants.TotalRecordsSelected).getValue();
                    var headerDescription = "";
                    if (selectedTeamsCount == 1) {
                        headerDescription = String.format(AppCommon.DialogUtils.getLocalizedString(AppCommon.TeamStrings.TeamAddMembersHeaderDescription), selectedTeamsCount);
                    }
                    else {
                        headerDescription = String.format(AppCommon.DialogUtils.getLocalizedString(AppCommon.TeamStrings.TeamAddMembersPluralHeaderDescription), selectedTeamsCount);
                    }
                    eventContext.getFormContext().getControl(AppCommon.TeamConstants.Team_SelectedRecordsLabel).setLabel(headerDescription);
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
            // Method called when clicking on "Join Teams" on user entity form.
            // Method called when clicking on "Add Members" on team entity grid.
            Team_AddMembers.prototype.AddMembersFromGrid = function (records) {
                SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.TEAMMANAGEMENT, SmbAppsTelemetryUtility.Controls_EventName.CLICKEDGRIDCOMMAND, ADDMEMBERS, null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, ADDMEMBERSCLICKED, false);
                if (records && records.length > 0) {
                    var dialogParams = {};
                    dialogParams[AppCommon.DialogConstants.TargetEntities] = "systemuser";
                    dialogParams[AppCommon.DialogConstants.EntityRecords] = "";
                    dialogParams[AppCommon.DialogConstants.LastButtonClicked] = "";
                    dialogParams[AppCommon.DialogConstants.SelectedRecords] = records;
                    dialogParams[AppCommon.DialogConstants.TotalRecordsSelected] = records.length;
                    dialogParams[AppCommon.DialogConstants.customLabel] = AppCommon.DialogUtils.getLocalizedString(AppCommon.TeamStrings.TeamUsersLabel);
                    var dialogOptions = {
                        position: 2 /* side */,
                        width: AppCommon.DialogConstants.DialogWidth
                    };
                    Xrm.Navigation.openDialog(AppCommon.DialogConstants.AddTeamMembersDialogName, dialogOptions, dialogParams)
                        .then(AppCommon.AddMembersCommand.dialogCloseCallback);
                }
            };
            Team_AddMembers.prototype.dialogCloseCallback = function (dialogResponse) {
                SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.TEAMMANAGEMENT, SmbAppsTelemetryUtility.Controls_EventName.CLOSEDCOMMAND, ADDMEMBERS, null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, ADDMEMBERSCOMPLETED, false);
                if (dialogResponse
                    && dialogResponse.parameters
                    && dialogResponse.parameters[AppCommon.DialogConstants.LastButtonClicked] === AppCommon.DialogConstants.DialogOkId) {
                    // teams selected initially by the user
                    var selectedTeams = dialogResponse.parameters[AppCommon.DialogConstants.SelectedRecords];
                    // members selected by the user that are meant to be added to current team
                    var membersToAdd = dialogResponse.parameters[AppCommon.DialogConstants.EntityRecords];
                    var requestsToExecute_1 = [];
                    if (selectedTeams && membersToAdd) {
                        var members_1 = membersToAdd.map(function (member) {
                            return { id: member.id, entityType: member.entityName };
                        });
                        selectedTeams.forEach(function (team) {
                            requestsToExecute_1.push(new AddMembersTeamRequest({ id: team.Id, entityType: team.TypeName }, members_1));
                        });
                        AppCommon.DialogUtils.showProgressIndicator(AppCommon.DialogUtils.getLocalizedString(AppCommon.TeamStrings.ProgressIndicatorMessage));
                        Xrm.WebApi.online.executeMultiple(requestsToExecute_1).then(function (success) {
                            // Hide progress indicator.
                            AppCommon.DialogUtils.hideProgressIndicator();
                            if (success.every(function (response) { return response.ok; })) {
                                // Everything looks OK
                                AppCommon.DialogUtils.showGlobalNotification(AppCommon.DialogUtils.getLocalizedString(AppCommon.TeamStrings.TeamAddMembersSuccessNotification));
                            }
                            else {
                                SmbAppsTelemetryUtility.TelemetryData.ReportAppComponentFailureTelemetry(null, SmbAppsTelemetryUtility.Controls_PageType.USERMANAGEMENT, success);
                                Xrm.Navigation.openAlertDialog({ text: AppCommon.DialogUtils.getLocalizedString(AppCommon.TeamStrings.UnknownErrorMessage) });
                            }
                        }, AppCommon.DialogUtils.actionFailedCallback);
                    }
                }
            };
            return Team_AddMembers;
        }());
        AppCommon.AddMembersCommand = new Team_AddMembers();
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
/* tslint:disable:crm-force-fields-private */
var ODataContract;
(function (ODataContract) {
    var RemoveMembersTeamRequest = (function () {
        function RemoveMembersTeamRequest(entity /*Microsoft.Dynamics.CRM.team*/, members) {
            this.entity = entity;
            this.Members = members;
        }
        RemoveMembersTeamRequest.prototype.getMetadata = function () {
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
                operationName: "RemoveMembersTeam",
                operationType: 0,
            };
            return metadata;
        };
        return RemoveMembersTeamRequest;
    }());
    ODataContract.RemoveMembersTeamRequest = RemoveMembersTeamRequest;
})(ODataContract || (ODataContract = {}));
/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../ClientCommon/DialogConstants.ts" />
/// <reference path="../ClientCommon/DialogUtils.ts" />
/// <reference path= "../../Controls/FREShell/DataContracts/RemoveMembersTeamRequest.ts" />
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var RemoveMembersTeamRequest = ODataContract.RemoveMembersTeamRequest;
        var REMOVEMEMBERS = "Team_RemoveMembers";
        var REMOVEMEMBERSCLICKED = "Team_RemoveMembers Clicked";
        var REMOVEMEMBERSCOMPLETED = "Team_RemoveMembers Completed";
        var Team_RemoveMembers = (function () {
            function Team_RemoveMembers() {
                this.onCancelClick = function (eventContext) {
                    var formContext = eventContext.getFormContext();
                    formContext.ui.close();
                };
                this.onDialogLoad = function (eventContext) {
                    var selectedTeamsCount = eventContext.getFormContext().data.attributes.get(AppCommon.DialogConstants.TotalRecordsSelected).getValue();
                    var headerDescription;
                    if (selectedTeamsCount == 1) {
                        headerDescription = String.format(AppCommon.DialogUtils.getLocalizedString(AppCommon.TeamStrings.TeamRemoveOneMembersHeaderDescription), selectedTeamsCount);
                    }
                    else {
                        headerDescription = String.format(AppCommon.DialogUtils.getLocalizedString(AppCommon.TeamStrings.TeamRemoveMultipleMembersHeaderDescription), selectedTeamsCount);
                    }
                    eventContext.getFormContext().getControl(AppCommon.TeamConstants.Team_SelectedRecordsLabel).setLabel(headerDescription);
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
            // Method called when clicking on "Remove Members" on team entity grid.
            Team_RemoveMembers.prototype.RemoveMembersFromGrid = function (records) {
                SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.TEAMMANAGEMENT, SmbAppsTelemetryUtility.Controls_EventName.CLICKEDGRIDCOMMAND, REMOVEMEMBERS, null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, REMOVEMEMBERSCLICKED, false);
                if (records && records.length > 0) {
                    var dialogParams = {};
                    dialogParams[AppCommon.DialogConstants.TargetEntities] = "systemuser";
                    dialogParams[AppCommon.DialogConstants.EntityRecords] = "";
                    dialogParams[AppCommon.DialogConstants.LastButtonClicked] = "";
                    dialogParams[AppCommon.DialogConstants.SelectedRecords] = records;
                    dialogParams[AppCommon.DialogConstants.TotalRecordsSelected] = records.length;
                    dialogParams[AppCommon.DialogConstants.customLabel] = AppCommon.DialogUtils.getLocalizedString(AppCommon.TeamStrings.TeamUsersLabel);
                    var dialogOptions = {
                        position: 2 /* side */,
                        width: AppCommon.DialogConstants.DialogWidth
                    };
                    Xrm.Navigation.openDialog(AppCommon.DialogConstants.RemoveTeamMembersDialogName, dialogOptions, dialogParams)
                        .then(AppCommon.RemoveMembersCommand.dialogCloseCallback);
                }
            };
            Team_RemoveMembers.prototype.dialogCloseCallback = function (dialogResponse) {
                SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.TEAMMANAGEMENT, SmbAppsTelemetryUtility.Controls_EventName.CLOSEDCOMMAND, REMOVEMEMBERS, null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, REMOVEMEMBERSCOMPLETED, false);
                if (dialogResponse
                    && dialogResponse.parameters
                    && dialogResponse.parameters[AppCommon.DialogConstants.LastButtonClicked] === AppCommon.DialogConstants.DialogOkId) {
                    //TODO: Ensure that user selects atleast one record else disable Ok button.
                    var selectedTeams = dialogResponse.parameters[AppCommon.DialogConstants.SelectedRecords];
                    var membersToRemove = dialogResponse.parameters[AppCommon.DialogConstants.EntityRecords];
                    var requestsToExecute_2 = [];
                    if (selectedTeams && membersToRemove) {
                        var members_2 = membersToRemove.map(function (member) {
                            return { id: member.id, entityType: member.entityName };
                        });
                        selectedTeams.forEach(function (team) {
                            requestsToExecute_2.push(new RemoveMembersTeamRequest({ id: team.Id, entityType: team.TypeName }, members_2));
                        });
                        AppCommon.DialogUtils.showProgressIndicator(AppCommon.DialogUtils.getLocalizedString(AppCommon.TeamStrings.ProgressIndicatorMessage));
                        Xrm.WebApi.online.executeMultiple(requestsToExecute_2).then(function (success) {
                            // Hide progress indicator.
                            AppCommon.DialogUtils.hideProgressIndicator();
                            if (success.every(function (response) { return response.ok; })) {
                                // Everything looks OK
                                AppCommon.DialogUtils.showGlobalNotification(AppCommon.DialogUtils.getLocalizedString(AppCommon.TeamStrings.TeamRemoveMembersSuccessNotification));
                            }
                            else {
                                SmbAppsTelemetryUtility.TelemetryData.ReportAppComponentFailureTelemetry(null, SmbAppsTelemetryUtility.Controls_PageType.TEAMMANAGEMENT, success);
                                Xrm.Navigation.openAlertDialog({ text: AppCommon.DialogUtils.getLocalizedString(AppCommon.TeamStrings.UnknownErrorMessage) });
                            }
                        }, AppCommon.DialogUtils.actionFailedCallback);
                    }
                }
            };
            return Team_RemoveMembers;
        }());
        AppCommon.RemoveMembersCommand = new Team_RemoveMembers();
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var TeamConstants = (function () {
            function TeamConstants() {
            }
            Object.defineProperty(TeamConstants, "Team_SelectedRecordsLabel", {
                get: function () {
                    return "selectedRecords_label";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TeamConstants, "SalesBusinessAppRoleGuid", {
                get: function () {
                    return 'f7d10f1b-c9fa-3103-af8a-1874d79503fa';
                },
                enumerable: true,
                configurable: true
            });
            return TeamConstants;
        }());
        AppCommon.TeamConstants = TeamConstants;
        var TeamStrings = (function () {
            function TeamStrings() {
            }
            Object.defineProperty(TeamStrings, "ProgressIndicatorMessage", {
                get: function () {
                    return "SMBAdvSettings_ProgressIndicatorMessage";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TeamStrings, "UnknownErrorMessage", {
                get: function () {
                    return "SMBAdvSettings_UnknownErrorMessage";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TeamStrings, "ErrorStrings", {
                get: function () {
                    return "SMBAdvSettings_Team_ErrorStrings";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TeamStrings, "ReassigningRecords", {
                get: function () {
                    return "SMBAdvSettings_SystemUser_ReassigningRecords";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TeamStrings, "TeamManageRolesHeaderDescription", {
                get: function () {
                    return "SMBAdvSettings_Team_ManageRoles_HeaderDescription";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TeamStrings, "TeamManageRolesPluralHeaderDescription", {
                get: function () {
                    return "SMBAdvSettings_Teams_ManageRoles_HeaderDescription";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TeamStrings, "TeamManageRolesTableHeader", {
                get: function () {
                    return "SMBAdvSettings_ManageRoles_TableHeader";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TeamStrings, "TeamAddMembersHeaderDescription", {
                get: function () {
                    return "SMBAdvSettings_Team_AddMembers_HeaderDescription";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TeamStrings, "TeamAddMembersPluralHeaderDescription", {
                get: function () {
                    return "SMBAdvSettings_Teams_AddMembers_HeaderDescription";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TeamStrings, "TeamRemoveOneMembersHeaderDescription", {
                get: function () {
                    return "SMBAdvSettings_Team_RemoveMembers_HeaderDescription";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TeamStrings, "TeamRemoveMultipleMembersHeaderDescription", {
                get: function () {
                    return "SMBAdvSettings_Team_RemoveMultipleMembers_HeaderDescription";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TeamStrings, "TeamReassignRecordsHeaderDescription", {
                get: function () {
                    return "SMBAdvSettings_Team_ReassignRecords_HeaderDescription";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TeamStrings, "TeamManageRolesSuccessNotification", {
                get: function () {
                    return "SMBAdvSettings_Team_ManageRoles_SuccessNotification";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TeamStrings, "TeamAddMembersSuccessNotification", {
                get: function () {
                    return "SMBAdvSettings_Team_AddMembers_SuccessNotification";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TeamStrings, "TeamRemoveMembersSuccessNotification", {
                get: function () {
                    return "SMBAdvSettings_Team_RemoveMembers_SuccessNotification";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TeamStrings, "TeamReassignRecordsSuccessNotification", {
                get: function () {
                    return "SMBAdvSettings_Team_ReassignRecords_SuccessNotification";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TeamStrings, "TeamUsersLabel", {
                get: function () {
                    return "TeamManagement_Users_Label";
                },
                enumerable: true,
                configurable: true
            });
            return TeamStrings;
        }());
        AppCommon.TeamStrings = TeamStrings;
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
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
/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../../Controls/FREShell/DataContracts/AssignAllRecordsTeamRequest.ts" />
/// <reference path="../ClientCommon/DialogConstants.ts" />
/// <reference path="../ClientCommon/DialogUtils.ts" />
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var REASSIGNRECORDS = "Team_ReassignAllRecords";
        var REASSIGNRECORDSCLICKED = "Team_ReassignAllRecords Clicked";
        var REASSIGNRECORDSCOMPLETED = "Team_ReassignAllRecords Completed";
        var AssignAllRecordsTeamRequest = ODataContract.AssignAllRecordsTeamRequest;
        var Team_ReassignAllRecords = (function () {
            function Team_ReassignAllRecords() {
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
                    var assignToLookupControl = formContext.getControl("teamview_id");
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
                    var assignToLookupControl = formContext.data.attributes.get("teamview_id");
                    var disableAssignToLookupControl = assignTo.getValue();
                    if (disableAssignToLookupControl) {
                        var selectedTeam = assignToLookupControl.getValue();
                        if (!selectedTeam || selectedTeam.length === 0) {
                            Xrm.Navigation.openAlertDialog({ text: AppCommon.DialogUtils.getLocalizedString(AppCommon.TeamStrings.ErrorStrings) });
                            return;
                        }
                        else {
                            ownerId = selectedTeam[0].id;
                            ownerType = selectedTeam[0].entityType;
                        }
                    }
                    else {
                        ownerId = formContext.context.getUserId();
                        ownerType = "team";
                    }
                    formContext.data.attributes.get(AppCommon.DialogConstants.OwnerId).setValue(ownerId);
                    formContext.data.attributes.get(AppCommon.DialogConstants.OwnerType).setValue(ownerType);
                    formContext.data.attributes.get(AppCommon.DialogConstants.LastButtonClicked).setValue(AppCommon.DialogConstants.DialogOkId);
                    formContext.ui.close();
                };
                /**
                * Assign dialog lookup on change function
                */
                this.assignDialogTeamChange = function (eventContext) {
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
            // Method called when clicking on "Reassign all records" on team entity form.
            Team_ReassignAllRecords.prototype.reassignRecordsFromForm = function () {
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
            Team_ReassignAllRecords.prototype.reassignRecordsFromGrid = function (records) {
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
            Team_ReassignAllRecords.prototype.dialogCloseCallback = function (dialogResponse) {
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
                    AppCommon.DialogUtils.showProgressIndicator(AppCommon.DialogUtils.getLocalizedString(AppCommon.TeamStrings.ReassigningRecords));
                    Xrm.WebApi.online.execute(request).then(function (response) {
                        AppCommon.DialogUtils.hideProgressIndicator();
                        console.log(response);
                        // Everything looks OK
                        AppCommon.DialogUtils.showGlobalNotification(AppCommon.DialogUtils.getLocalizedString(AppCommon.TeamStrings.TeamReassignRecordsSuccessNotification));
                    }, AppCommon.DialogUtils.actionFailedCallback);
                }
            };
            return Team_ReassignAllRecords;
        }());
        AppCommon.ReassignAllRecordsCommand = new Team_ReassignAllRecords();
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
/// <reference path="./AddTeam.ts" />
/// <reference path="./EditTeam.ts" />
/// <reference path="./ManageRoles.ts" />
/// <reference path="./AddMembers.ts" />
/// <reference path="./RemoveMembers.ts" />
/// <reference path="./TeamConstants.ts" />
/// <reference path="./ReassignAllRecords.ts" />
/// <reference path="../../Controls/FREShell/Telemetry/TelemetryUtility.ts" />
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var Team = (function () {
            function Team() {
            }
            return Team;
        }());
        Team.AddTeam = Mscrm.AppCommon.AddTeamCommand;
        Team.EditTeam = Mscrm.AppCommon.EditTeamCommand;
        Team.ManageRoles = Mscrm.AppCommon.ManageTeamRolesCommand;
        Team.AddMembers = Mscrm.AppCommon.AddMembersCommand;
        Team.RemoveMembers = Mscrm.AppCommon.RemoveMembersCommand;
        Team.Reassign = Mscrm.AppCommon.ReassignAllRecordsCommand;
        AppCommon.Team = Team;
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
