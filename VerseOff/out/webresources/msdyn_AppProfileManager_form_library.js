var ClientRuntime;
(function (ClientRuntime) {
    class GenericFormAttributes {
    }
    GenericFormAttributes.isManaged = "ismanaged";
    GenericFormAttributes.displayName = "msdyn_name";
    GenericFormAttributes.uniqueName = "msdyn_uniquename";
    GenericFormAttributes.timeout = "msdyn_timeout";
    ClientRuntime.GenericFormAttributes = GenericFormAttributes;
    class FormNotificationConstants {
    }
    FormNotificationConstants.WebresourceName = "Localization/CEC_webresource_strings";
    FormNotificationConstants.FormNotificationType = "INFO";
    FormNotificationConstants.FormNotificationId = "F524E496-8DC4-459E-B7AA-7A2955845FDD";
    ClientRuntime.FormNotificationConstants = FormNotificationConstants;
    class GridNotificationConstants {
    }
    GridNotificationConstants.Level = "WARNING";
    GridNotificationConstants.UniqueId = "661eb462-3c63-416f-a21d-b9d99a7d0095"; // A unique identifier for the message that can be used later with clearFormNotification to remove the notification.
    GridNotificationConstants.WarningMessageLocalizationKey = "WARNING_MESSAGE_FOR_ALWAYSRENDER";
    ClientRuntime.GridNotificationConstants = GridNotificationConstants;
    class VoiceWSNotificationConstants {
    }
    VoiceWSNotificationConstants.Level = "INFO";
    VoiceWSNotificationConstants.UniqueId = "96597a0d-a798-4960-b7fe-3abcd48d227a"; // A unique identifier for the message that can be used later with clearFormNotification to remove the notification.
    ClientRuntime.VoiceWSNotificationConstants = VoiceWSNotificationConstants;
    class Entities {
    }
    Entities.ApplicationTabTemplate = "msdyn_applicationtabtemplate";
    Entities.SessionTemplate = "msdyn_sessiontemplate";
    Entities.NotificationTemplate = "msdyn_notificationtemplate";
    Entities.NotificationField = "msdyn_notificationfield";
    ClientRuntime.Entities = Entities;
    class UniqueNameConstants {
    }
    UniqueNameConstants.UNIQUE_NAME_WEBRESOURCEKEY = "UNIQUE_NAME_RECOMMENDATION";
    UniqueNameConstants.RECOMMENDATION = "RECOMMENDATION";
    UniqueNameConstants.UNIQUE_NAME_MESSAGE = "Unique Name";
    UniqueNameConstants.UNIQUE_NAME_PREFIX = "new_";
    ClientRuntime.UniqueNameConstants = UniqueNameConstants;
    class TimeoutConstants {
    }
    TimeoutConstants.TIMEOUT_RECOMMENDATION_TITLE_KEY = "Voice_Timeout_Recommendation_Title";
    TimeoutConstants.TIMEOUT_RECOMMENDATION_DESC_KEY = "Voice_Timeout_Recommendation_Desc";
    TimeoutConstants.RECOMMENDATION = "RECOMMENDATION";
    TimeoutConstants.TIMEOUT_RECOMMENDATION_VALUE = 40;
    ClientRuntime.TimeoutConstants = TimeoutConstants;
})(ClientRuntime || (ClientRuntime = {}));
var ClientRuntime;
(function (ClientRuntime) {
    "use strict";
    class AppProfileManagerFormHandler {
        /**
         * Form on-load event handler
         * Applicable forms: Quick create form and Main form
         * @param executionContext execution context
         */
        onFormLoad(executionContext) {
            this.showReadOnlyNotification(executionContext);
            this.addNotificationToUniqueName(executionContext);
            // For voice notification templates, the timeout needs to be less than 55 seconds(due to ACS limit). 
            // Thus adding a notification to recommend the user to set the timeout to TimeoutConstants.TIMEOUT_RECOMMENDATION_VALUE(40 seconds). 
            this.addNotificationToTimeout(executionContext);
            // in ApplicationTabTemplate form, remove "Custom" page type option for non-preview customer
            // it is handled by FCB.CEC.CustomPage. We need remove this code after Oct release
            this.updatePageTypeOptionSetsInApplicationTabTemplateForm(executionContext);
        }
        /**
         * Editable grid control on change handler.
         * Currently the handler is hooked to the template parameter form (a editable grid control) in application tab template.
         * @param executionContext execution context
         */
        onEditableGridChange(executionContext) {
            const formContext = executionContext && executionContext.getFormContext(); // get the form Context
            const templateParameterAttributes = formContext && formContext.data && formContext.data.entity && formContext.data.entity.attributes; // get the attribute collection from entity msdyn_templateparameter
            const attributeName = templateParameterAttributes && templateParameterAttributes.get("msdyn_name") && templateParameterAttributes.get("msdyn_name").getValue(); // getValue() gets the latest value in a control as the user types characters in a specific text or number column.
            const attributeValue = templateParameterAttributes && templateParameterAttributes.get("msdyn_value") && templateParameterAttributes.get("msdyn_value").getValue();
            // alwaysRender is the only msdyn_templateparameter record we track and we display warning message if its value is set to true.
            if (attributeName && attributeValue && attributeName.toLowerCase() === "alwaysrender") {
                if (attributeValue.toLowerCase() === "true") {
                    formContext.ui.setFormNotification(Xrm.Utility.getResourceString(ClientRuntime.FormNotificationConstants.WebresourceName, ClientRuntime.GridNotificationConstants.WarningMessageLocalizationKey), ClientRuntime.GridNotificationConstants.Level, ClientRuntime.GridNotificationConstants.UniqueId);
                }
                else {
                    formContext.ui.clearFormNotification(ClientRuntime.GridNotificationConstants.UniqueId);
                }
            }
        }
        showReadOnlyNotification(executionContext) {
            const formContext = executionContext.getFormContext();
            const isManagedAttribute = formContext.getAttribute(ClientRuntime.GenericFormAttributes.isManaged);
            if (isManagedAttribute != null && isManagedAttribute.getValue()) {
                formContext.ui.setFormNotification(Xrm.Utility.getResourceString(ClientRuntime.FormNotificationConstants.WebresourceName, formContext.entityReference.entityType), ClientRuntime.FormNotificationConstants.FormNotificationType, ClientRuntime.FormNotificationConstants.FormNotificationId);
            }
        }
        addNotificationToUniqueName(executionContext) {
            const formContext = executionContext.getFormContext();
            const uniqueNameControl = formContext.getControl(ClientRuntime.GenericFormAttributes.uniqueName);
            const uniqueName = formContext.getAttribute(ClientRuntime.GenericFormAttributes.uniqueName);
            if (formContext.ui.getFormType() == 1 &&
                (formContext.entityReference.entityType == ClientRuntime.Entities.ApplicationTabTemplate ||
                    formContext.entityReference.entityType == ClientRuntime.Entities.SessionTemplate ||
                    formContext.entityReference.entityType == ClientRuntime.Entities.NotificationField ||
                    formContext.entityReference.entityType == ClientRuntime.Entities.NotificationTemplate)) {
                const actionCollection = {
                    message: Xrm.Utility.getResourceString(ClientRuntime.FormNotificationConstants.WebresourceName, ClientRuntime.UniqueNameConstants.UNIQUE_NAME_WEBRESOURCEKEY),
                    actions: null
                };
                const that = this;
                actionCollection.actions = [function () {
                        let name = formContext.getAttribute(ClientRuntime.GenericFormAttributes.displayName).getValue() ? formContext.getAttribute(ClientRuntime.GenericFormAttributes.displayName).getValue() : "";
                        name = that.generateUniqueName(name);
                        uniqueName.setValue(ClientRuntime.UniqueNameConstants.UNIQUE_NAME_PREFIX + name);
                        uniqueNameControl.clearNotification(ClientRuntime.GenericFormAttributes.uniqueName);
                        uniqueNameControl.addNotification({
                            messages: [ClientRuntime.UniqueNameConstants.UNIQUE_NAME_MESSAGE],
                            notificationLevel: ClientRuntime.UniqueNameConstants.RECOMMENDATION,
                            uniqueId: ClientRuntime.GenericFormAttributes.uniqueName,
                            actions: [actionCollection]
                        });
                    }];
                uniqueNameControl.addNotification({
                    messages: [ClientRuntime.UniqueNameConstants.UNIQUE_NAME_MESSAGE],
                    notificationLevel: ClientRuntime.UniqueNameConstants.RECOMMENDATION,
                    uniqueId: ClientRuntime.GenericFormAttributes.uniqueName,
                    actions: [actionCollection]
                });
            }
        }
        addNotificationToTimeout(executionContext) {
            const formContext = executionContext.getFormContext();
            const timeoutControl = formContext.getControl(ClientRuntime.GenericFormAttributes.timeout);
            const timeout = formContext.getAttribute(ClientRuntime.GenericFormAttributes.timeout);
            if (formContext.ui.getFormType() == 1 &&
                formContext.entityReference.entityType == ClientRuntime.Entities.NotificationTemplate) {
                const recommendationTitle = Xrm.Utility.getResourceString(ClientRuntime.FormNotificationConstants.WebresourceName, ClientRuntime.TimeoutConstants.TIMEOUT_RECOMMENDATION_TITLE_KEY);
                const actionCollection = {
                    message: Xrm.Utility.getResourceString(ClientRuntime.FormNotificationConstants.WebresourceName, ClientRuntime.TimeoutConstants.TIMEOUT_RECOMMENDATION_DESC_KEY).replace("{0}", ClientRuntime.TimeoutConstants.TIMEOUT_RECOMMENDATION_VALUE.toString()),
                    actions: null
                };
                actionCollection.actions = [function () {
                        timeout.setValue(ClientRuntime.TimeoutConstants.TIMEOUT_RECOMMENDATION_VALUE);
                        timeoutControl.clearNotification(ClientRuntime.GenericFormAttributes.timeout);
                        timeoutControl.addNotification({
                            messages: [recommendationTitle],
                            notificationLevel: ClientRuntime.TimeoutConstants.RECOMMENDATION,
                            uniqueId: ClientRuntime.GenericFormAttributes.timeout,
                            actions: [actionCollection]
                        });
                    }];
                timeoutControl.addNotification({
                    messages: [recommendationTitle],
                    notificationLevel: ClientRuntime.TimeoutConstants.RECOMMENDATION,
                    uniqueId: ClientRuntime.GenericFormAttributes.timeout,
                    actions: [actionCollection]
                });
            }
        }
        // We need remove this code after Oct release
        updatePageTypeOptionSetsInApplicationTabTemplateForm(executionContext) {
            const formContext = executionContext.getFormContext();
            const customPageTypeOptionValue = 509180007;
            const pageTypeControlName = "msdyn_pagetype";
            if (formContext.ui.getFormType() == 1 && formContext.entityReference.entityType == ClientRuntime.Entities.ApplicationTabTemplate) {
                if (!this.isCustomPageEnabled()) {
                    const pageTypeControl = formContext.getControl(pageTypeControlName);
                    if (pageTypeControl) {
                        pageTypeControl.removeOption(customPageTypeOptionValue);
                    }
                }
            }
        }
        // We need remove this code after Oct release
        isCustomPageEnabled() {
            return Xrm && Xrm.Internal.isFeatureEnabled("CEC.CustomPage");
        }
        generateUniqueName(displayName) {
            let name = "";
            const regEx = /^[a-zA-Z0-9_]/;
            if (!regEx.test(displayName)) {
                name = "";
            }
            else {
                name = displayName.replace(/[^a-zA-Z0-9 _]/g, "_").replace(/ +/g, '_').replace(/\@+/g, '_').replace(/\#+/g, '_').replace(/\-+/g, '_').replace(/_+/g, '_').toLowerCase();
            }
            return name;
        }
    }
    // Properties
    AppProfileManagerFormHandler.Instance = new AppProfileManagerFormHandler();
    ClientRuntime.AppProfileManagerFormHandler = AppProfileManagerFormHandler;
})(ClientRuntime || (ClientRuntime = {}));
//# sourceMappingURL=msdyn_AppProfileManager_form_library.js.map