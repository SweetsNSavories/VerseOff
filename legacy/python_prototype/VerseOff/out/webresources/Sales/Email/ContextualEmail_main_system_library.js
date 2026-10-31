var Sales;
(function (Sales) {
    var Emails;
    (function (Emails) {
        var Util;
        (function (Util) {
            var AttachmentDialogConstants;
            (function (AttachmentDialogConstants) {
                AttachmentDialogConstants.AddAttachmentToEmailDialogName = "AddAttachmentToEmail";
                AttachmentDialogConstants.AttachmentParentEntityEmailLogicalName = "email";
                AttachmentDialogConstants.ParameterAttachmentId = "param_attachmentId";
                AttachmentDialogConstants.ParameterEntityId = "param_entityId";
                AttachmentDialogConstants.ParameterFileMode = "param_AttachmentFileMode";
                AttachmentDialogConstants.ParameterIsEmailFollowed = "param_IsEmailFollowed";
                AttachmentDialogConstants.ParameterEntityName = "param_EntityName";
                AttachmentDialogConstants.ParameterParentEntityLogicalName = "param_entityName";
                AttachmentDialogConstants.IsEmailFollowed = "isemailfollowed";
            })(AttachmentDialogConstants = Util.AttachmentDialogConstants || (Util.AttachmentDialogConstants = {}));
        })(Util = Emails.Util || (Emails.Util = {}));
    })(Emails = Sales.Emails || (Sales.Emails = {}));
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
///<reference path="../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../UCI/AttachmentConstants.ts" />
///<reference path="../../../../../references/internal/TypeDefinitions/Activities/Activities.d.ts"/>
var Sales;
(function (Sales) {
    var EmailLibrary = (function () {
        function EmailLibrary() {
            /**
            * Enable Rule to Display Commands on Contextual Email form.
            * @param gridControl gridcontrol from which function is called
            */
            this.shouldShowContextualEmailCommands = function (primaryControl) {
                return ContextualEmailActions.shouldShowContextualEmailCommands(primaryControl);
            };
            this.AttachFileAlert = function (primaryControl) {
                ContextualEmailActions.AttachFileAlert(primaryControl);
            };
            this.saveAndAttachFile = function (context) {
                ContextualEmailActions.saveAndAttachFile(context);
            };
            /**
             * Closes the current dialog.
             */
            this.dialogClose = function (context) {
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                formContext.data.attributes.get(ClientUtility.MetadataDrivenDialogConstants.paramLastButtonClicked).setValue(ClientUtility.MetadataDrivenDialogConstants.DialogCancelId);
                formContext.ui.close();
            };
        }
        /// <summary>
        /// Opens MDD Dialog for attachment
        /// </summary>
        //Attach from Ribbon
        EmailLibrary.prototype.openAddAttachmentDialogFormCommand = function (form, primaryRecordId, attachmentsGridName) {
            ContextualEmailActions.openAddAttachmentDialogFormCommand(form, primaryRecordId, attachmentsGridName);
        };
        ;
        return EmailLibrary;
    }());
    Sales.EmailLibrary = EmailLibrary;
    var ContextualEmailActions = (function () {
        function ContextualEmailActions() {
        }
        ContextualEmailActions.openAddAttachmentDialogFormCommand = function (form, primaryRecordId, attachmentsGridName) {
            if (Xrm.Internal.isFeatureEnabled(ContextualEmailActions.ContextualEmailFileUpload) && ContextualEmailActions.shouldShowContextualEmailCommands(form)) {
                var dialogParams = {};
                var isUci = Xrm.Internal.isUci();
                var subGridControl = form.getControl(attachmentsGridName);
                var entityName = subGridControl.formContext.data.entity.getEntityName();
                dialogParams[Sales.Emails.Util.AttachmentDialogConstants.ParameterEntityName] = entityName;
                if (ContextualEmailActions.isEmailEngagementFCBEnabled(isUci) && ContextualEmailActions.isEmailEngagementActionsFCBEnabled(isUci))
                    ContextualEmailActions.addEmailFollowStatusToDialogParams(entityName, subGridControl, dialogParams);
                ContextualEmailActions.openDialog(dialogParams, primaryRecordId, null, ContextualEmailActions.AttachmentReadMode, subGridControl);
            }
            else {
                Activities.AddAttachment.openAddAttachmentDialogFormCommand(form, primaryRecordId, attachmentsGridName);
            }
        };
        ;
        ContextualEmailActions.isEmailEngagementFCBEnabled = function (isUci) {
            if (isUci) {
                return Xrm.Internal.isFeatureEnabled(ContextualEmailActions.EmailEngagementFCB) || Xrm.Internal.isFeatureEnabled(ContextualEmailActions.FCB_EmailEngagement);
            }
            else {
                return Xrm.Internal.isFeatureEnabled(ContextualEmailActions.EmailEngagementFCB);
            }
        };
        ContextualEmailActions.isEmailEngagementActionsFCBEnabled = function (isUci) {
            if (isUci) {
                return Xrm.Internal.isFeatureEnabled(ContextualEmailActions.EmailEngagementActionFCB) || Xrm.Internal.isFeatureEnabled(ContextualEmailActions.FCB_EmailEngagementAction);
            }
            else {
                return Xrm.Internal.isFeatureEnabled(ContextualEmailActions.EmailEngagementActionFCB);
            }
        };
        /// <summary>
        /// Opens new/edit Dialog based on params
        /// </summary>
        ContextualEmailActions.openDialog = function (dialogParams, entityId, attachmentId, attachmentReadMode, gridControl) {
            if (dialogParams === void 0) { dialogParams = {}; }
            dialogParams[Sales.Emails.Util.AttachmentDialogConstants.ParameterEntityId] = entityId;
            dialogParams[Sales.Emails.Util.AttachmentDialogConstants.ParameterAttachmentId] = attachmentId;
            dialogParams[Sales.Emails.Util.AttachmentDialogConstants.ParameterParentEntityLogicalName] = Xrm.Page.data.entity.getEntityName();
            dialogParams[Sales.Emails.Util.AttachmentDialogConstants.ParameterFileMode] = attachmentReadMode;
            var dialogOptions = {
                height: 305,
                width: 420,
                position: 1 /* center */,
            };
            Xrm.Navigation.openDialog(Sales.Emails.Util.AttachmentDialogConstants.AddAttachmentToEmailDialogName, dialogOptions, dialogParams).then(function () {
                ContextualEmailActions.reportSuccess(Sales.Emails.Util.AttachmentDialogConstants.AddAttachmentToEmailDialogName);
                if (gridControl != null)
                    gridControl.refresh();
            }, function (errorResponse) {
                ContextualEmailActions.reportFailure(Sales.Emails.Util.AttachmentDialogConstants.AddAttachmentToEmailDialogName, errorResponse);
                ContextualEmailActions.dialogActionFailedCallback(errorResponse);
                if (gridControl != null)
                    gridControl.refresh();
            });
        };
        ContextualEmailActions.dialogActionFailedCallback = function (response) {
            Xrm.Navigation.openErrorDialog(response);
        };
        // Adds Email Follow status to dialog params if the entity is email
        ContextualEmailActions.addEmailFollowStatusToDialogParams = function (entityName, subGridControl, dialogParams) {
            if (entityName === Sales.Emails.Util.AttachmentDialogConstants.AttachmentParentEntityEmailLogicalName) {
                var emailFollowStatus = subGridControl.formContext.data.entity.attributes.get(Sales.Emails.Util.AttachmentDialogConstants.IsEmailFollowed) ? subGridControl.formContext.data.entity.attributes.get(Sales.Emails.Util.AttachmentDialogConstants.IsEmailFollowed).getValue() : false;
                dialogParams[Sales.Emails.Util.AttachmentDialogConstants.ParameterIsEmailFollowed] = emailFollowStatus;
            }
        };
        return ContextualEmailActions;
    }());
    ContextualEmailActions.popUpFormId = "b54ca399-eaa6-45f8-83f2-c268b0021087";
    ContextualEmailActions.AttachFileAlertDialogName = "AttachFileAlert";
    ContextualEmailActions.AttachmentGridName = "attachmentsGrid";
    ContextualEmailActions.SaveAndOpenAttachmentDialog = "SaveAndOpenAttachmentDialog";
    ContextualEmailActions.AttachmentReadMode = "1";
    ContextualEmailActions.ContextualEmailFileUpload = "ContextualEmailFileUpload";
    ContextualEmailActions.EmailEngagementFCB = "FCB.EmailEngagement";
    ContextualEmailActions.FCB_EmailEngagement = "EmailEngagement";
    ContextualEmailActions.EmailEngagementActionFCB = "FCB.EmailEngagementComposeForUCI";
    ContextualEmailActions.FCB_EmailEngagementAction = "EmailEngagementComposeForUCI";
    /**
    * Enable Rule to Display Commands on Contextual Email form.
    * @param gridControl gridcontrol from which function is called
    */
    ContextualEmailActions.shouldShowContextualEmailCommands = function (primaryControl) {
        if (Xrm.Internal.isUci()) {
            var formContext = primaryControl && primaryControl.ui && primaryControl.ui.formSelector ? primaryControl.ui.formSelector.getCurrentItem() :
                Xrm.Page.ui && Xrm.Page.ui.formSelector ? Xrm.Page.ui.formSelector.getCurrentItem() : null;
            if (formContext) {
                var formId = formContext.getId();
                return (formId.toLowerCase() == ContextualEmailActions.popUpFormId);
            }
        }
        return false;
    };
    /**
     * Method to display alert when Email is in  create state
     */
    ContextualEmailActions.AttachFileAlert = function (primaryControl) {
        var formContext = primaryControl ? primaryControl.ui.formContext : Xrm.Page;
        ContextualEmailActions.reportSuccess(ContextualEmailActions.AttachFileAlertDialogName);
        Xrm.Navigation.openDialog(ContextualEmailActions.AttachFileAlertDialogName).then(function (response) {
            if (response.parameters[ClientUtility.MetadataDrivenDialogConstants.paramLastButtonClicked] == ContextualEmailActions.SaveAndOpenAttachmentDialog) {
                ContextualEmailActions.reportSuccess(ContextualEmailActions.SaveAndOpenAttachmentDialog);
                formContext.data.save().then(function (response) {
                    ContextualEmailActions.openAddAttachmentDialogFormCommand(formContext, response.savedEntityReference.id, ContextualEmailActions.AttachmentGridName);
                }, function (error) {
                    ContextualEmailActions.reportFailure(ContextualEmailActions.SaveAndOpenAttachmentDialog, error);
                });
            }
        }, function (error) {
            ContextualEmailActions.reportFailure(ContextualEmailActions.AttachFileAlertDialogName, error);
        });
    };
    /**
     * Method to save the Email record and opens the Attachment dialog.
     */
    ContextualEmailActions.saveAndAttachFile = function (context) {
        var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
        formContext.data.attributes.get(ClientUtility.MetadataDrivenDialogConstants.paramLastButtonClicked).setValue(ContextualEmailActions.SaveAndOpenAttachmentDialog);
        formContext.ui.close();
    };
    /**
    * Function to log report success telemetry for Contextual Email - UCI.
    */
    ContextualEmailActions.reportSuccess = function (componentName, eventParams) {
        if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Reporting)) {
            if (eventParams) {
                Xrm.Reporting.reportSuccess(ContextualEmailActions.name + componentName, eventParams);
            }
            else {
                Xrm.Reporting.reportSuccess(ContextualEmailActions.name + componentName);
            }
        }
    };
    /**
    * Function to log report failure telemetry for Contextual Email - UCI.
    */
    ContextualEmailActions.reportFailure = function (componentName, error) {
        if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Reporting)) {
            Xrm.Reporting.reportFailure(ContextualEmailActions.name + componentName, error);
        }
    };
    Sales.ContextualEmailActions = ContextualEmailActions;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="UCI/EmailLibrary.ts" />
var Sales;
(function (Sales) {
    var Email = (function () {
        function Email() {
        }
        return Email;
    }());
    Email.Instance = new Sales.EmailLibrary();
    Email.ctor = (function () {
        // These are needed on the window because of "general" command bar actions calling hard-coded methods with some conditions
    })();
    Sales.Email = Email;
})(Sales || (Sales = {}));
