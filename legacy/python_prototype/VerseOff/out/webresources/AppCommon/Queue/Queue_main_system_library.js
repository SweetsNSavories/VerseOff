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
var ODataContract;
(function (ODataContract) {
    var UpdateRequest = (function () {
        function UpdateRequest(etn, id, payload) {
            this.etn = etn;
            this.id = id;
            this.payload = payload;
        }
        UpdateRequest.prototype.getMetadata = function () {
            return {
                boundParameter: undefined,
                parameterTypes: {},
                operationName: "Update",
                operationType: 2,
            };
        };
        return UpdateRequest;
    }());
    ODataContract.UpdateRequest = UpdateRequest;
})(ODataContract || (ODataContract = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
///<reference path="../../../ClientUtility/Client/Common/DataContracts/Action/UpdateRequest.ts"/>
/// <reference path="../../../TypeDefinitions/AppCommon/Localization/ResourceStringProvider.d.ts" />
///<reference path="../ClientCommon/EntityNames.ts"/>
var AppCommon;
(function (AppCommon) {
    var UpdateRequest = ODataContract.UpdateRequest;
    var QueueGridCommandActions = (function () {
        function QueueGridCommandActions() {
            var _this = this;
            this.approveEmail = function (gridControl, selectedQueues) {
                if (selectedQueues && selectedQueues.length > 0) {
                    if (!ClientUtility.ClientUtil.isUCI()) {
                        // open legacy aspx dialog in web client
                        _this.handleApproveEmailForWebClient(gridControl, selectedQueues);
                    }
                    else {
                        var dialogOptions = {
                            width: 500,
                            height: 250,
                            position: 1 /* center */
                        };
                        var dialogParams = {};
                        dialogParams["param_gridControl"] = gridControl;
                        dialogParams["param_selectedQueues"] = selectedQueues;
                        dialogParams["param_isGrid"] = true;
                        Xrm.Navigation.openDialog("ApproveEmail", dialogOptions, dialogParams).then(_this.handleApproveMail);
                    }
                }
            };
            /*
             * On Load method for Reject email
             */
            this.rejectMailOnLoad = function (context) {
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                if (formContext && formContext.data.attributes.get("param_isGrid")
                    && formContext.data.attributes.get("param_isGrid").getValue() && formContext.data.attributes.get("param_selectedQueues")) {
                    var records = formContext.data.attributes.get("param_selectedQueues").getValue();
                    if (records && records.length === 1) {
                        _this.approveRejectResxHelper(records.length, QueueGridCommandActions.Reject_Email_Label, QueueGridCommandActions.Reject_Email_Single);
                    }
                    else if (records && records.length > 1) {
                        _this.approveRejectResxHelper(records.length, QueueGridCommandActions.Reject_Email_Label, QueueGridCommandActions.Reject_Email_Plural);
                    }
                }
                else if (formContext && formContext.data.attributes.get("param_isGrid")
                    && !formContext.data.attributes.get("param_isGrid").getValue()) {
                    _this.approveRejectResxHelper(1, QueueGridCommandActions.Reject_Email_Label, QueueGridCommandActions.Reject_Email_Single);
                }
            };
            /*
             * On Load method for Approve email
             */
            this.approveMailOnLoad = function (context) {
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                if (formContext && formContext.data.attributes.get("param_isGrid")
                    && formContext.data.attributes.get("param_isGrid").getValue() && formContext.data.attributes.get("param_selectedQueues")) {
                    var records = formContext.data.attributes.get("param_selectedQueues").getValue();
                    if (records && records.length === 1) {
                        _this.approveRejectResxHelper(records.length, QueueGridCommandActions.Approve_Email_Label, QueueGridCommandActions.Approve_Email_Single);
                    }
                    else if (records && records.length > 1) {
                        _this.approveRejectResxHelper(records.length, QueueGridCommandActions.Approve_Email_Label, QueueGridCommandActions.Approve_Email_Plural);
                    }
                }
                else if (formContext && formContext.data.attributes.get("param_isGrid")
                    && !formContext.data.attributes.get("param_isGrid").getValue()) {
                    _this.approveRejectResxHelper(1, QueueGridCommandActions.Approve_Email_Label, QueueGridCommandActions.Approve_Email_Plural);
                }
            };
            /*
             * On Load method for Approve email Helper
             */
            this.approveRejectResxHelper = function (recordLength, labelId, labelTextId) {
                var labelControl = Xrm.Page.ui.controls.get(labelId);
                if (labelControl && AppCommon.ResourceStringProvider) {
                    var labelText = AppCommon.ResourceStringProvider.getResourceString(labelTextId);
                    labelText = ClientUtility.StringUtil.format(labelText, recordLength);
                    if (labelText) {
                        labelControl.setLabel(labelText);
                    }
                }
            };
            /*
             * Apply changes for Queue Approve email dialog Helper
             */
            this.handleApproveOrRejectEmailHelper = function () {
                ClientUtility.DialogUtil.setLastButtonClicked(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                Xrm.Page.ui.close();
            };
            /*
             * Apply changes for Queue Approve email dialog
             */
            this.handleApproveMail = function (dialogParams) {
                if (dialogParams
                    && dialogParams.parameters
                    && dialogParams.parameters["param_isGrid"]
                    && dialogParams.parameters[QueueGridCommandActions.DialogParamLastButtonClicked] === ClientUtility.MetadataDrivenDialogConstants.DialogOkId) {
                    var gridControl = dialogParams.parameters["param_gridControl"];
                    var selectedQueues = dialogParams.parameters["param_selectedQueues"];
                    _this.handleApproveOrRejectEmail(gridControl, selectedQueues, true);
                }
                else if (dialogParams
                    && dialogParams.parameters
                    && !dialogParams.parameters["param_isGrid"]
                    && dialogParams.parameters[QueueGridCommandActions.DialogParamLastButtonClicked] === ClientUtility.MetadataDrivenDialogConstants.DialogOkId) {
                    var action = dialogParams.parameters["param_action"];
                    var objectType = dialogParams.parameters["param_objectType"];
                    _this.HandleApproveOrRejectEmailByAction(action, objectType);
                }
            };
            /*
             * Apply changes for Queue Reject email dialog Helper
             */
            this.handleRejectMail = function (dialogParams) {
                if (dialogParams
                    && dialogParams.parameters
                    && dialogParams.parameters["param_isGrid"]
                    && dialogParams.parameters[QueueGridCommandActions.DialogParamLastButtonClicked] === ClientUtility.MetadataDrivenDialogConstants.DialogOkId) {
                    var gridControl = dialogParams.parameters["param_gridControl"];
                    var selectedQueues = dialogParams.parameters["param_selectedQueues"];
                    _this.handleApproveOrRejectEmail(gridControl, selectedQueues, false);
                }
                else if (dialogParams
                    && dialogParams.parameters
                    && !dialogParams.parameters["param_isGrid"]
                    && dialogParams.parameters[QueueGridCommandActions.DialogParamLastButtonClicked] === ClientUtility.MetadataDrivenDialogConstants.DialogOkId) {
                    var action = dialogParams.parameters["param_action"];
                    var objectType = dialogParams.parameters["param_objectType"];
                    _this.HandleApproveOrRejectEmailByAction(action, objectType);
                }
            };
            /*
             * Apply changes for Queue Reject email dialog Helper
             */
            this.dialogClose = function () {
                var formContext = Xrm.Page;
                ClientUtility.DialogUtil.setLastButtonClicked(ClientUtility.MetadataDrivenDialogConstants.DialogCancelId);
                formContext.ui.close();
            };
            /*
             * Apply changes for Queue Reject email dialog Helper
             */
            this.helpLink = function () {
                var currentLCID = Xrm.Page.context.getUserLcid();
                var en_us = 1033; // Locale id for english language
                var hexCodeOfLink = currentLCID ? currentLCID.toString(16) : en_us.toString(16);
                var url = QueueGridCommandActions.privacyLink + "&clcid=" + "0x" + hexCodeOfLink;
                var win = window.open(url, '_blank');
                win.focus();
            };
            this.handlePostApproveEmail = function (result, gridControl) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(result)) {
                    gridControl.refresh();
                }
            };
            this.rejectEmail = function (gridControl, selectedQueues) {
                if (selectedQueues && selectedQueues.length > 0) {
                    if (!ClientUtility.ClientUtil.isUCI()) {
                        var dialogstrings = _this.GetRejectEmailConfirmDialogStrings(selectedQueues.length);
                        Xrm.Navigation.openConfirmDialog(dialogstrings).then(function (result) {
                            if (result.confirmed) {
                                _this.handleApproveOrRejectEmail(gridControl, selectedQueues, false);
                            }
                        });
                    }
                    else {
                        var dialogOptions = {
                            width: 500,
                            height: 250,
                            position: 1 /* center */
                        };
                        var dialogParams = {};
                        dialogParams["param_gridControl"] = gridControl;
                        dialogParams["param_selectedQueues"] = selectedQueues;
                        dialogParams["param_isGrid"] = true;
                        Xrm.Navigation.openDialog("RejectEmail", dialogOptions, dialogParams).then(_this.handleRejectMail);
                    }
                }
            };
            this.handleApproveOrRejectEmail = function (gridControl, selectedQueues, approve) {
                if (selectedQueues && selectedQueues.length > 0) {
                    //Create a batch of update requests for updating emailrouteraccessapproval
                    var updateEntity = {};
                    updateEntity["emailrouteraccessapproval"] = approve ? 1 : 3;
                    // Create the requests
                    var requests = selectedQueues.map(function (selectedQueue) {
                        return new UpdateRequest(AppCommon.EntityNames.Queue, ClientUtility.Guid.create(selectedQueue.Id), updateEntity);
                    });
                    ClientUtility.DialogUtil.showProgressMessage();
                    Xrm.WebApi.online.executeMultiple(requests).then(function (responses) {
                        ClientUtility.DialogUtil.hideProgressMessage();
                        if (responses.every(function (response) { return response.ok; })) {
                            if (gridControl) {
                                gridControl.refresh();
                            }
                        }
                        else {
                            // Show a generic error in case the action was not completed for one of the items.
                            _this.openAlertDialogForMultipleError();
                        }
                    }, ClientUtility.DialogUtil.actionFailedCallbackForMoca);
                }
            };
            this.openAlertDialogForMultipleError = function () {
                var alertDialogStrings = { text: "" };
                alertDialogStrings.text = AppCommon.ResourceStringProvider.getResourceString("Error_Message_Action_MultipleErrorsFound");
                Xrm.Navigation.openAlertDialog(alertDialogStrings, null);
            };
            this.GetRejectEmailConfirmDialogStrings = function (selectedQueuesCount) {
                var dialogstrings = {
                    title: "",
                    subtitle: "",
                    text: ""
                };
                dialogstrings.title = AppCommon.ResourceStringProvider.getResourceString("Dialog_RejectEmail_Title");
                if (selectedQueuesCount == 1) {
                    dialogstrings.subtitle = ClientUtility.StringUtil.format(AppCommon.ResourceStringProvider.getResourceString("Dialog_RejectEmail_Description_Single"), selectedQueuesCount);
                }
                else {
                    dialogstrings.subtitle = ClientUtility.StringUtil.format(AppCommon.ResourceStringProvider.getResourceString("Dialog_RejectEmail_Description_Plural"), selectedQueuesCount);
                }
                dialogstrings.text = AppCommon.ResourceStringProvider.getResourceString("Dialog_RejectEmail_Text");
                return dialogstrings;
            };
            this.HandleApproveOrRejectEmailByAction = function (action, objectType) {
                var updateEntity = {};
                updateEntity["emailrouteraccessapproval"] = (action == "approve_emailaddress") ? 1 : 3;
                // Create the requests
                var request = new UpdateRequest(AppCommon.EntityNames.Queue, ClientUtility.Guid.create(Xrm.Page.data.entity.getId()), updateEntity);
                ClientUtility.DialogUtil.showProgressMessage();
                Xrm.WebApi.online.execute(request).then(function (response) {
                    ClientUtility.DialogUtil.hideProgressMessage();
                    if (response.ok) {
                        Xrm.Page.data.refresh();
                    }
                    else {
                        // Show a generic error in case the action was not completed for one of the items.
                        _this.openAlertDialogForMultipleError();
                    }
                }, ClientUtility.DialogUtil.actionFailedCallbackForMoca);
            };
        }
        QueueGridCommandActions.prototype.handleApproveEmailForWebClient = function (gridControl, selectedQueues) {
            var actionUri = Mscrm.GlobalImported.CrmUri.create(String.format("/_grid/cmds/dlg_{0}.aspx", encodeURIComponent("approve_emailaddress")));
            actionUri.get_query()["iObjType"] = AppCommon.EntityTypeCode.Queue;
            actionUri.get_query()["iTotal"] = selectedQueues.length;
            actionUri.get_query()["customAction"] = "approveemail";
            var ids = [];
            selectedQueues.forEach(function (queue) {
                ids.push(queue.Id);
            });
            actionUri.get_query()["sIds"] = ids.join();
            var dialogOptions = {
                width: 500,
                height: 250,
                position: 1 /* center */
            };
            var callbackRef = ClientUtility.DialogUtil.createCallbackFunctionFactory(this.handlePostApproveEmail, gridControl, selectedQueues, true);
            Xrm.Internal.openDialog(actionUri.toString(), dialogOptions, ids, null, callbackRef);
        };
        return QueueGridCommandActions;
    }());
    QueueGridCommandActions.DialogParamLastButtonClicked = "param_lastButtonClicked";
    QueueGridCommandActions.privacyLink = "http://go.microsoft.com/fwlink/?LinkID=521839";
    QueueGridCommandActions.Approve_Email_Label = "lbl_approveemailmessage";
    QueueGridCommandActions.Reject_Email_Label = "lbl_rejectemailmessage";
    QueueGridCommandActions.Approve_Email_Single = "Dialog_ApproveEmail_Description_Single";
    QueueGridCommandActions.Reject_Email_Single = "Dialog_RejectEmail_Description_Single";
    QueueGridCommandActions.Approve_Email_Plural = "Dialog_ApproveEmail_Description_Plural";
    QueueGridCommandActions.Reject_Email_Plural = "Dialog_RejectEmail_Description_Plural";
    AppCommon.QueueGridCommandActions = QueueGridCommandActions;
})(AppCommon || (AppCommon = {}));
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
///<reference path="../ClientCommon/EntityNames.ts"/>
///<reference path="../../../ClientUtility/Client/Common/DataContracts/Action/UpdateRequest.ts"/>
///<reference path="QueueGridCommandActions.ts"/>
var AppCommon;
(function (AppCommon) {
    var QueueCommandActions = (function () {
        function QueueCommandActions() {
            var _this = this;
            this.launchMailboxFromForm = function () {
                var lookup = Xrm.Page.data.entity.attributes.get("defaultmailbox");
                if (!ClientUtility.DataUtil.isNullOrUndefined(lookup) && Object.getType(lookup).toString() === "undefined")
                    return;
                _this._launchMailbox(lookup.getValue()[0].id);
            };
            this._launchMailbox = function (mailboxId) {
                //Overriding default behavior for open record in UCI. The open mailbox command in UCI would open the legacy web client form in a separate tab.
                if (Xrm.Internal.isUci()) {
                    var mailboxUrl = "/main.aspx?etc=9606&extraqs=%3fetc%3d9606%26id%3d" + mailboxId + "&pagetype=entityrecord";
                    window.open(mailboxUrl, "_blank");
                }
                else {
                    Xrm.Utility.openEntityForm(AppCommon.EntityNames.Mailbox, mailboxId, null);
                }
            };
            this.openConvertRule = function (sourceTypeCode) {
                var convertRuleID = null;
                var queueId = Xrm.Page.data.entity.getId();
                if (queueId) {
                    var sourceChannelTypeCode_1 = (sourceTypeCode === 1) ? AppCommon.EntityTypeCode.SocialActivity : AppCommon.EntityTypeCode.Email;
                    ;
                    var fetchXml = "?fetchXml=<fetch version='1.0' mapping='logical'><entity name='convertrule'><attribute name='convertruleid' /><order attribute='modifiedon' descending='true' /><filter type='and'><condition attribute='queueid' operator='eq' value='" + queueId + "' /><condition attribute='sourcechanneltypecode' operator='eq' value='" + sourceChannelTypeCode_1 + "' /></filter></entity></fetch>";
                    var convertRuleIds_1 = null;
                    Xrm.WebApi.retrieveMultipleRecords(AppCommon.EntityNames.ConvertRule, fetchXml).then(function (response) {
                        convertRuleIds_1 = response.entities;
                        if (convertRuleIds_1 && convertRuleIds_1.length > 0) {
                            convertRuleID = convertRuleIds_1[0].convertruleid.toString();
                        }
                        // Handcraft the web client URL that needs to be opened for UCI.
                        if (ClientUtility.ClientUtil.isUCI()) {
                            var extraParams = "?etc=9300&sourcechanneltypecode=" + sourceChannelTypeCode_1 + "&";
                            // Existing rule scenario
                            if (convertRuleID && convertRuleID.length > 1) {
                                extraParams += "id=" + convertRuleID;
                            }
                            else {
                                // New rule scenario
                                extraParams += "_CreateFromId=" + queueId + "&_CreateFromType=2020";
                            }
                            var convertRuleUrl = "/main.aspx?etc=9300&extraqs=" + encodeURIComponent(extraParams) + "&pagetype=entityrecord";
                            window.open(convertRuleUrl, "_blank");
                        }
                        else {
                            var options = {};
                            options.openInNewWindow = true;
                            var parameters = {};
                            // Existing rule scenario
                            if (convertRuleID && convertRuleID.length > 1) {
                                parameters["id"] = convertRuleID;
                            }
                            else {
                                // New rule scenario
                                parameters["_CreateFromId"] = queueId;
                                parameters["_CreateFromType"] = AppCommon.EntityTypeCode.Queue;
                            }
                            parameters["sourcechanneltypecode"] = sourceChannelTypeCode_1;
                            Xrm.Utility.openEntityForm(AppCommon.EntityNames.ConvertRule, "", parameters, options);
                        }
                    }, function (resp) {
                        return;
                    });
                }
            };
            this.approveOrRejectEmail = function (action, objectType) {
                if (action === "reject_emailaddress") {
                    if (!ClientUtility.ClientUtil.isUCI()) {
                        var dialogstrings_1 = _this.queueGridCommandInstance.GetRejectEmailConfirmDialogStrings(1);
                        Xrm.Page.data.save().then(function () {
                            Xrm.Navigation.openConfirmDialog(dialogstrings_1).then(function (result) {
                                if (result.confirmed) {
                                    _this.queueGridCommandInstance.HandleApproveOrRejectEmailByAction(action, objectType);
                                }
                            });
                        });
                    }
                    else {
                        var dialogOptions = {
                            width: 500,
                            height: 250,
                            position: 1 /* center */
                        };
                        var dialogParams = {};
                        dialogParams["param_action"] = action;
                        dialogParams["param_objectType"] = objectType;
                        dialogParams["param_isGrid"] = false;
                        Xrm.Navigation.openDialog("RejectEmail", dialogOptions, dialogParams).then(_this.queueGridCommandInstance.handleRejectMail);
                    }
                }
                else if (action === "approve_emailaddress") {
                    if (!ClientUtility.ClientUtil.isUCI()) {
                        // open legacy aspx dialog in web client
                        _this.handleApproveEmailForWebClient(action, objectType);
                    }
                    else {
                        var dialogOptions = {
                            width: 500,
                            height: 250,
                            position: 1 /* center */
                        };
                        var dialogParams = {};
                        dialogParams["param_action"] = action;
                        dialogParams["param_objectType"] = objectType;
                        dialogParams["param_isGrid"] = false;
                        Xrm.Navigation.openDialog("ApproveEmail", dialogOptions, dialogParams).then(_this.queueGridCommandInstance.handleApproveMail);
                    }
                }
            };
            this.handlePostApproveEmail = function (result) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(result)) {
                    Xrm.Page.data.refresh();
                }
            };
            this.queueGridCommandInstance = new AppCommon.QueueGridCommandActions();
        }
        QueueCommandActions.prototype.handleApproveEmailForWebClient = function (action, objectType) {
            var _this = this;
            Xrm.Page.data.save().then(function () {
                var actionUri = Mscrm.GlobalImported.CrmUri.create(String.format("/_grid/cmds/dlg_{0}.aspx", encodeURIComponent("approve_emailaddress")));
                actionUri.get_query()["iObjType"] = AppCommon.EntityTypeCode.Queue;
                actionUri.get_query()["iTotal"] = 1;
                actionUri.get_query()["customAction"] = "approveemail";
                var ids = [Xrm.Page.data.entity.getId()];
                actionUri.get_query()["sIds"] = ids.join();
                var dialogOptions = {
                    width: 500,
                    height: 250,
                    position: 1 /* center */
                };
                var callbackRef = ClientUtility.DialogUtil.createCallbackFunctionFactory(_this.handlePostApproveEmail, action, objectType);
                Xrm.Internal.openDialog(actionUri.toString(), dialogOptions, ids, null, callbackRef);
            });
        };
        return QueueCommandActions;
    }());
    AppCommon.QueueCommandActions = QueueCommandActions;
})(AppCommon || (AppCommon = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var AppCommon;
(function (AppCommon) {
    var QueueMainSystemLibraryWebResource = (function () {
        function QueueMainSystemLibraryWebResource() {
            var _this = this;
            this.QueueForm_onSave = function () {
            };
            this.QueueForm_onLoad = function () {
                _this.QueueViewType_onChange();
            };
            this.QueueViewType_onChange = function () {
                var queueviewtypeControl = Xrm.Page.data.entity.attributes.get("queueviewtype");
                var tab = Xrm.Page.ui.tabs.get("general");
                if (!ClientUtility.DataUtil.isNullOrEmptyString(tab)) {
                    var sections = tab.sections;
                    var queuememberSubgridSection = sections.get("QueueMembers");
                    var queueMemberPublicQueueMessageSection = sections.get("QueueMembersNoRecord");
                    if (!queueviewtypeControl.getValue()
                        && !ClientUtility.DataUtil.isNullOrEmptyString(queuememberSubgridSection)
                        && !ClientUtility.DataUtil.isNullOrEmptyString(queueMemberPublicQueueMessageSection)) {
                        queuememberSubgridSection.setVisible(false);
                        queueMemberPublicQueueMessageSection.setVisible(true);
                    }
                    else if (!ClientUtility.DataUtil.isNullOrEmptyString(queuememberSubgridSection)
                        && !ClientUtility.DataUtil.isNullOrEmptyString(queueMemberPublicQueueMessageSection)) {
                        queuememberSubgridSection.setVisible(true);
                        queueMemberPublicQueueMessageSection.setVisible(false);
                    }
                }
            };
        }
        return QueueMainSystemLibraryWebResource;
    }());
    AppCommon.QueueMainSystemLibraryWebResource = QueueMainSystemLibraryWebResource;
})(AppCommon || (AppCommon = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="QueueCommandActions.ts" />
/// <reference path="QueueGridCommandActions.ts" />
/// <reference path="QueueMainSystemLibraryWebResource.ts" />
var AppCommon;
(function (AppCommon) {
    var QueueLibrary = (function () {
        function QueueLibrary() {
            var queueMainSystemLibraryWebResource = new AppCommon.QueueMainSystemLibraryWebResource(); // form logic
            var queueGridCommandActions = new AppCommon.QueueGridCommandActions(); // queue grid commands
            var queueCommandActions = new AppCommon.QueueCommandActions(); // queue form commands
            var global = window;
            var mscrm = global.Mscrm;
            mscrm.QueueGridCommandActions = queueGridCommandActions;
            mscrm.QueueMainSystemLibraryWebResource = queueMainSystemLibraryWebResource;
            mscrm.QueueCommandActions = queueCommandActions;
            mscrm.Form_onload = queueMainSystemLibraryWebResource.QueueForm_onLoad;
            mscrm.Form_onsave = queueMainSystemLibraryWebResource.QueueForm_onSave;
            mscrm.queueviewtype_onchange = queueMainSystemLibraryWebResource.QueueViewType_onChange;
        }
        return QueueLibrary;
    }());
    AppCommon.QueueLibrary = QueueLibrary;
    var Queue = (function () {
        function Queue() {
        }
        return Queue;
    }());
    // Below line will create an object of QueueLibrary and logic in cons. will run initializing all other object.
    Queue.Instance = new QueueLibrary();
    Queue.ctor = (function () {
    })();
    AppCommon.Queue = Queue;
})(AppCommon || (AppCommon = {}));
//# sourceMappingURL=Queue_main_system_library.js.map