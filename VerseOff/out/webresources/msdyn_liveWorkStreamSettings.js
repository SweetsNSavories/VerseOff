/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
"use strict";
var OmniChannelPackage;
(function (OmniChannelPackage) {
    var BasePresences;
    (function (BasePresences) {
        BasePresences[BasePresences["Available"] = 192360000] = "Available";
        BasePresences[BasePresences["Busy"] = 192360001] = "Busy";
        BasePresences[BasePresences["BusyDND"] = 192360002] = "BusyDND";
        BasePresences[BasePresences["Away"] = 192360003] = "Away";
        BasePresences[BasePresences["Offline"] = 192360004] = "Offline";
    })(BasePresences || (BasePresences = {}));
    var PresenceConstants = (function () {
        function PresenceConstants() {
        }
        return PresenceConstants;
    }());
    PresenceConstants.StatusAttributeName = "msdyn_presencestatustext";
    PresenceConstants.BaseStatusAttributeName = "msdyn_basepresencestatus";
    PresenceConstants.BaseStatusAttributeValueName = "msdyn_basepresencestatus_Value";
    PresenceConstants.SystemUserEntityLinkPrefix = "msdyn_defaultpresenceiduser";
    PresenceConstants.AvailableIcon = "msdyn_/Images/Available.svg";
    PresenceConstants.BusyIcon = "msdyn_/Images/Busy.svg";
    PresenceConstants.DNDIcon = "msdyn_/Images/DoNotDisturb.svg";
    PresenceConstants.AwayIcon = "msdyn_/Images/Away.svg";
    PresenceConstants.OfflineIcon = "msdyn_/Images/Offline.svg";
    PresenceConstants.BaseResxFileName = "msdyn_OmnichannelBase";
    PresenceConstants.AvailableTooltipResourceName = "OC_Presence_Available";
    PresenceConstants.BusyTooltipResourceName = "OC_Presence_Busy";
    PresenceConstants.DNDTooltipResourceName = "OC_Presence_DoNotDisturb";
    PresenceConstants.AwayTooltipResourceName = "OC_Presence_Away";
    PresenceConstants.OfflineTooltipResourceName = "OC_Presence_Offline";
    PresenceConstants.BasePresences = BasePresences;
    OmniChannelPackage.PresenceConstants = PresenceConstants;
})(OmniChannelPackage || (OmniChannelPackage = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
///<reference path="../Presence/PresenceConstants.ts" />
var OmniChannelPackage;
(function (OmniChannelPackage) {
    var StreamSourceType;
    (function (StreamSourceType) {
        StreamSourceType[StreamSourceType["LiveChat"] = 192360000] = "LiveChat";
        StreamSourceType[StreamSourceType["CDSEntity"] = 192350000] = "CDSEntity";
        StreamSourceType[StreamSourceType["SMS"] = 192340000] = "SMS";
        StreamSourceType[StreamSourceType["Facebook"] = 192330000] = "Facebook";
        StreamSourceType[StreamSourceType["LINE"] = 192310000] = "LINE";
        StreamSourceType[StreamSourceType["Twitter"] = 192350001] = "Twitter";
        StreamSourceType[StreamSourceType["WeChat"] = 192320000] = "WeChat";
        StreamSourceType[StreamSourceType["WhatsApp"] = 192300000] = "WhatsApp";
        StreamSourceType[StreamSourceType["Custom"] = 192350002] = "Custom";
        StreamSourceType[StreamSourceType["Teams"] = 19241000] = "Teams";
        StreamSourceType[StreamSourceType["Voice"] = 192370000] = "Voice";
        StreamSourceType[StreamSourceType["Video"] = 192380000] = "Video";
        StreamSourceType[StreamSourceType["Cobrowse"] = 192390000] = "Cobrowse";
        StreamSourceType[StreamSourceType["ScreenSharing"] = 192400000] = "ScreenSharing";
        StreamSourceType[StreamSourceType["Line"] = 192310000] = "Line";
        StreamSourceType[StreamSourceType["Telegram"] = 19242000] = "Telegram";
        StreamSourceType[StreamSourceType["Kik"] = 19243000] = "Kik";
        StreamSourceType[StreamSourceType["PhoneCall"] = 192440000] = "PhoneCall";
        StreamSourceType[StreamSourceType["AppleMessagesForBusiness"] = 192450000] = "AppleMessagesForBusiness";
        StreamSourceType[StreamSourceType["GoogleBusinessMessages"] = 192450001] = "GoogleBusinessMessages";
    })(StreamSourceType = OmniChannelPackage.StreamSourceType || (OmniChannelPackage.StreamSourceType = {}));
    var DefaultAutoCloseAfterInactivity;
    (function (DefaultAutoCloseAfterInactivity) {
        DefaultAutoCloseAfterInactivity[DefaultAutoCloseAfterInactivity["LiveChat"] = 5] = "LiveChat";
        DefaultAutoCloseAfterInactivity[DefaultAutoCloseAfterInactivity["CDSEntity"] = 1440] = "CDSEntity";
        DefaultAutoCloseAfterInactivity[DefaultAutoCloseAfterInactivity["SMS"] = 2880] = "SMS";
        DefaultAutoCloseAfterInactivity[DefaultAutoCloseAfterInactivity["Facebook"] = 2880] = "Facebook";
        DefaultAutoCloseAfterInactivity[DefaultAutoCloseAfterInactivity["LINE"] = 2880] = "LINE";
        DefaultAutoCloseAfterInactivity[DefaultAutoCloseAfterInactivity["Twitter"] = 2880] = "Twitter";
        DefaultAutoCloseAfterInactivity[DefaultAutoCloseAfterInactivity["WeChat"] = 2880] = "WeChat";
        DefaultAutoCloseAfterInactivity[DefaultAutoCloseAfterInactivity["WhatsApp"] = 2880] = "WhatsApp";
        DefaultAutoCloseAfterInactivity[DefaultAutoCloseAfterInactivity["Custom"] = 2880] = "Custom";
        DefaultAutoCloseAfterInactivity[DefaultAutoCloseAfterInactivity["Teams"] = 2880] = "Teams";
    })(DefaultAutoCloseAfterInactivity || (DefaultAutoCloseAfterInactivity = {}));
    var DefaultCapacity;
    (function (DefaultCapacity) {
        DefaultCapacity[DefaultCapacity["LiveChat"] = 30] = "LiveChat";
        DefaultCapacity[DefaultCapacity["CDSEntity"] = 30] = "CDSEntity";
        DefaultCapacity[DefaultCapacity["SMS"] = 30] = "SMS";
        DefaultCapacity[DefaultCapacity["Facebook"] = 30] = "Facebook";
        DefaultCapacity[DefaultCapacity["LINE"] = 30] = "LINE";
        DefaultCapacity[DefaultCapacity["Twitter"] = 30] = "Twitter";
        DefaultCapacity[DefaultCapacity["WeChat"] = 30] = "WeChat";
        DefaultCapacity[DefaultCapacity["WhatsApp"] = 30] = "WhatsApp";
        DefaultCapacity[DefaultCapacity["Custom"] = 30] = "Custom";
        DefaultCapacity[DefaultCapacity["Teams"] = 30] = "Teams";
    })(DefaultCapacity || (DefaultCapacity = {}));
    var WorkDistributionModeOptions;
    (function (WorkDistributionModeOptions) {
        WorkDistributionModeOptions[WorkDistributionModeOptions["Push"] = 192350000] = "Push";
        WorkDistributionModeOptions[WorkDistributionModeOptions["Pick"] = 192350001] = "Pick";
    })(WorkDistributionModeOptions || (WorkDistributionModeOptions = {}));
    var OmniChannelLiveWorkStreamConstants = (function () {
        function OmniChannelLiveWorkStreamConstants() {
        }
        return OmniChannelLiveWorkStreamConstants;
    }());
    OmniChannelLiveWorkStreamConstants.AllowedPresences = "msdyn_allowedpresences";
    OmniChannelLiveWorkStreamConstants.StreamSource = "msdyn_streamsource";
    OmniChannelLiveWorkStreamConstants.WorkDistributionMode = "msdyn_workdistributionmode";
    OmniChannelLiveWorkStreamConstants.Notification = "msdyn_notification";
    OmniChannelLiveWorkStreamConstants.EntityConfigRecord = "EntityConfigRecord";
    OmniChannelLiveWorkStreamConstants.AutoCloseAfterInactivity = "msdyn_autocloseafterinactivity";
    OmniChannelLiveWorkStreamConstants.Capacity = "msdyn_capacityrequired";
    OmniChannelLiveWorkStreamConstants.OCBaseSolutionName = "msdyn_OmnichannelBase";
    OmniChannelLiveWorkStreamConstants.ContextVariablesSubGrid = "contextvariables";
    OmniChannelLiveWorkStreamConstants.OCFormNotificationText = "OC_FormNotificationMessageForDSF";
    OmniChannelLiveWorkStreamConstants.OCFormNotificationType = "INFO";
    OmniChannelLiveWorkStreamConstants.OCFormNotificationId = "D667B1F3-7031-4044-86AA-9E432A86F34A";
    OmniChannelLiveWorkStreamConstants.OCFormNotificationRoutingSolutionDepText = "OC_FormNotificationMessageForRoutingSolutionDep";
    OmniChannelLiveWorkStreamConstants.OCRoutingRuleAtERCFormNotificationText = "ConfigureRoutingRulesAtERCNotification";
    OmniChannelLiveWorkStreamConstants.OCFormNotificationIdForRoutingSolutionDep = "D670FB4F-7615-4C6C-8160-9F94D31BEC9F";
    OmniChannelLiveWorkStreamConstants.OCRoutingRuleAtERCFormNotificationId = "3e2cc0a3-af95-4999-9a5e-8c11189bb2a9";
    OmniChannelLiveWorkStreamConstants.Offline = "Offline";
    OmniChannelLiveWorkStreamConstants.BasePresences = OmniChannelPackage.PresenceConstants.BasePresences;
    OmniChannelLiveWorkStreamConstants.StreamSourceType = StreamSourceType;
    OmniChannelLiveWorkStreamConstants.WorkDistributionModeOptions = WorkDistributionModeOptions;
    OmniChannelLiveWorkStreamConstants.DefaultAutoCloseAfterInactivity = DefaultAutoCloseAfterInactivity;
    OmniChannelLiveWorkStreamConstants.DefaultCapacity = DefaultCapacity;
    OmniChannelLiveWorkStreamConstants.EntityRoutingConfiguration = "msdyn_entityroutingconfigurationid";
    OmniChannelLiveWorkStreamConstants.SummaryTab = "tab1_summary";
    OmniChannelLiveWorkStreamConstants.RoutingRuleTab = "RoutingRuleItems";
    OmniChannelLiveWorkStreamConstants.SmartAssistTab = "BotAssistedAgentGuidance";
    OmniChannelLiveWorkStreamConstants.RoutingRuleFwLink = "aka.ms/oehroutecase";
    OmniChannelLiveWorkStreamConstants.EntityStreamSourceOption = 192350000;
    OmniChannelLiveWorkStreamConstants.WDSPushModeOption = 192350000;
    OmniChannelLiveWorkStreamConstants.SmartAssistSolution = "msdyn_smartassist";
    OmniChannelLiveWorkStreamConstants.SessionTemplate = "msdyn_sessiontemplate_default";
    OmniChannelLiveWorkStreamConstants.NotificationTemplateIncomingUnauth = "msdyn_notificationtemplate_incoming_unauth";
    OmniChannelLiveWorkStreamConstants.NotificationTemplateIncomingConsult = "msdyn_notificationtemplate_consult";
    OmniChannelLiveWorkStreamConstants.NotificationTemplateIncomingTransfer = "msdyn_notificationtemplate_transfer";
    OmniChannelLiveWorkStreamConstants.NotificationTemplateIncomingSupervisorAssign = "msdyn_notificationtemplate_supervisorassign";
    OmniChannelLiveWorkStreamConstants.EnableAgentAffinity = "msdyn_enableagentaffinity";
    OmniChannelLiveWorkStreamConstants.AgentAffinityHelpText = "msdyn_enableagentAffinityhelptext";
    // It is not needed to add new StreamSourceType channel references to AgentAffinityChannels
    // Enable aggent affinity logic is mantained in ModernAdmin repo
    OmniChannelLiveWorkStreamConstants.AgentAffinityChannels = [
        OmniChannelLiveWorkStreamConstants.StreamSourceType.SMS,
        OmniChannelLiveWorkStreamConstants.StreamSourceType.Facebook,
        OmniChannelLiveWorkStreamConstants.StreamSourceType.WhatsApp,
        OmniChannelLiveWorkStreamConstants.StreamSourceType.LINE,
        OmniChannelLiveWorkStreamConstants.StreamSourceType.Twitter,
        OmniChannelLiveWorkStreamConstants.StreamSourceType.WeChat,
        OmniChannelLiveWorkStreamConstants.StreamSourceType.Teams
    ];
    OmniChannelPackage.OmniChannelLiveWorkStreamConstants = OmniChannelLiveWorkStreamConstants;
})(OmniChannelPackage || (OmniChannelPackage = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
///<reference path="../TypeDefinitions/libs/XrmClientApi.d.ts"/>
///<reference path="LiveWorkStreamConstants.ts"/>
"use strict";
var OmniChannelPackage;
(function (OmniChannelPackage) {
    var LiveWorkStreamSettings = (function () {
        function LiveWorkStreamSettings() {
            this.isRoutingRuleSolutionInstalled = null;
            this.notificationTemplateIncomingUnauth = null;
            this.notificationTemplateIncomingConsult = null;
            this.notificationTemplateIncomingTransfer = null;
            this.notificationTemplateIncomingSupervisorAssign = null;
            this.offlinePresence = null;
        }
        ;
        LiveWorkStreamSettings.prototype.HideRoutingRuleTabOnStreamSourceSelected = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var streamSource = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSource);
            var streamSourceAttributeValue = streamSource && streamSource.getValue();
            var routingRuleTab = formContext.ui.tabs.get(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.RoutingRuleTab);
            var entityRoutingConfigurationLookup = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.EntityRoutingConfiguration);
            var entityRoutingConfigurationAttributeValue = entityRoutingConfigurationLookup && entityRoutingConfigurationLookup.getValue();
            var entityRoutingConfigurationLookupControl = formContext.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.EntityRoutingConfiguration);
            if (streamSourceAttributeValue) {
                routingRuleTab.setVisible(streamSourceAttributeValue != OmniChannelPackage.OmniChannelLiveWorkStreamConstants.EntityStreamSourceOption);
                entityRoutingConfigurationLookupControl.setVisible(streamSourceAttributeValue == OmniChannelPackage.OmniChannelLiveWorkStreamConstants.EntityStreamSourceOption);
            }
            if (entityRoutingConfigurationAttributeValue && streamSourceAttributeValue == OmniChannelPackage.OmniChannelLiveWorkStreamConstants.EntityStreamSourceOption) {
                var routingRuleNotificationString = Xrm.Utility.getResourceString(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.OCBaseSolutionName, OmniChannelPackage.OmniChannelLiveWorkStreamConstants.OCRoutingRuleAtERCFormNotificationText);
                routingRuleNotificationString = routingRuleNotificationString.replace("{0}", entityRoutingConfigurationAttributeValue[0].name);
                formContext.ui.setFormNotification(routingRuleNotificationString, OmniChannelPackage.OmniChannelLiveWorkStreamConstants.OCFormNotificationType, OmniChannelPackage.OmniChannelLiveWorkStreamConstants.OCRoutingRuleAtERCFormNotificationId);
            }
        };
        LiveWorkStreamSettings.prototype.showCaseRoutingNotifications = function (formContext) {
            if (this.isRoutingRuleSolutionInstalled === false) {
                var dependencyString = Xrm.Utility.getResourceString(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.OCBaseSolutionName, OmniChannelPackage.OmniChannelLiveWorkStreamConstants.OCFormNotificationRoutingSolutionDepText);
                dependencyString = dependencyString.replace("{0}", OmniChannelPackage.OmniChannelLiveWorkStreamConstants.RoutingRuleFwLink);
                formContext.ui.setFormNotification(dependencyString, OmniChannelPackage.OmniChannelLiveWorkStreamConstants.OCFormNotificationType, OmniChannelPackage.OmniChannelLiveWorkStreamConstants.OCFormNotificationIdForRoutingSolutionDep);
            }
        };
        LiveWorkStreamSettings.prototype.hideCaseRoutingNotifications = function (formContext) {
            formContext.ui.clearFormNotification(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.OCFormNotificationIdForRoutingSolutionDep);
            formContext.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSource).clearNotification();
        };
        LiveWorkStreamSettings.prototype.checkRoutingRuleSolutionExistence = function (formContext) {
            var self = this;
            Xrm.WebApi.retrieveMultipleRecords("solution", "?$filter=uniquename eq 'msdynce_RoutingRule'").then(function (result) {
                if (result && result.entities && result.entities.length === 1) {
                    self.isRoutingRuleSolutionInstalled = true;
                }
                else {
                    self.isRoutingRuleSolutionInstalled = false;
                    var streamSource = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSource);
                    var selectedValue = streamSource.getValue();
                    if (selectedValue == OmniChannelPackage.OmniChannelLiveWorkStreamConstants.EntityStreamSourceOption) {
                        self.showCaseRoutingNotifications(formContext);
                    }
                }
            });
        };
        LiveWorkStreamSettings.prototype.checkSmartAssistSolutionExistence = function (formContext) {
            var self = this;
            Xrm.WebApi.retrieveMultipleRecords("solution", "?$filter=uniquename eq '" + OmniChannelPackage.OmniChannelLiveWorkStreamConstants.SmartAssistSolution + "'").then(function (result) {
                if (result && result.entities && result.entities.length === 1) {
                    var smartAssistTab = formContext.ui.tabs.get(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.SmartAssistTab);
                    if (smartAssistTab) {
                        smartAssistTab.setVisible(true);
                    }
                }
            });
        };
        LiveWorkStreamSettings.prototype.showNotificationInForm = function (executionContext) {
            var gridContext = executionContext.getFormContext();
            if (gridContext.formContext) {
                gridContext.formContext.ui.setFormNotification(Xrm.Utility.getResourceString(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.OCBaseSolutionName, OmniChannelPackage.OmniChannelLiveWorkStreamConstants.OCFormNotificationText), OmniChannelPackage.OmniChannelLiveWorkStreamConstants.OCFormNotificationType, OmniChannelPackage.OmniChannelLiveWorkStreamConstants.OCFormNotificationId);
            }
            else {
                gridContext.ui.setFormNotification(Xrm.Utility.getResourceString(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.OCBaseSolutionName, OmniChannelPackage.OmniChannelLiveWorkStreamConstants.OCFormNotificationText), OmniChannelPackage.OmniChannelLiveWorkStreamConstants.OCFormNotificationType, OmniChannelPackage.OmniChannelLiveWorkStreamConstants.OCFormNotificationId);
            }
        };
        LiveWorkStreamSettings.prototype.showHideTemplatesOnFormLoad = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var streamSource = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSource);
            this.notificationTemplateIncomingUnauth = Xrm.Page.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.NotificationTemplateIncomingUnauth);
            this.notificationTemplateIncomingConsult = Xrm.Page.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.NotificationTemplateIncomingConsult);
            this.notificationTemplateIncomingTransfer = Xrm.Page.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.NotificationTemplateIncomingTransfer);
            this.notificationTemplateIncomingSupervisorAssign = Xrm.Page.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.NotificationTemplateIncomingSupervisorAssign);
            var selectedValue = streamSource && streamSource.getValue();
            this.showHideTemplates(selectedValue);
        };
        LiveWorkStreamSettings.prototype.clearNotificationInForm = function (executionContext) {
            var formContext = executionContext.getFormContext();
            formContext.ui.clearFormNotification(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.OCFormNotificationId);
        };
        LiveWorkStreamSettings.prototype.onSaveSetValue = function (executionContext) {
            var formContext = executionContext.getFormContext();
            formContext.ui.setFormNotification(Xrm.Utility.getResourceString(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.OCBaseSolutionName, OmniChannelPackage.OmniChannelLiveWorkStreamConstants.OCFormNotificationText), OmniChannelPackage.OmniChannelLiveWorkStreamConstants.OCFormNotificationType, OmniChannelPackage.OmniChannelLiveWorkStreamConstants.OCFormNotificationId);
            this.HideRoutingRuleTabOnStreamSourceSelected(executionContext);
        };
        LiveWorkStreamSettings.prototype.ClearFormNotificationAndShowSubgridNotificationOnLoad = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var subGridContext = formContext.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.ContextVariablesSubGrid);
            subGridContext.addOnLoad(this.showNotificationInForm);
            this.clearNotificationInForm(executionContext);
        };
        // Called on Form load
        LiveWorkStreamSettings.prototype.OnLiveWorkStreamFormLoaded = function (executionContext) {
            var formContext = executionContext.getFormContext();
            this.showHideOfflinePresence(formContext);
            this.checkSmartAssistSolutionExistence(formContext);
            this.checkRoutingRuleSolutionExistence(formContext);
            this.HideRoutingRuleTabOnStreamSourceSelected(executionContext);
            this.showHideTemplatesOnFormLoad(executionContext);
            //On form load, change the visibility of agent affinity control according to wds mode
            this.SetEnableAgentAffinityVisibility(executionContext);
        };
        LiveWorkStreamSettings.prototype.showHideOfflinePresence = function (formContext) {
            var streamSource = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSource);
            var selectedValue = streamSource && streamSource.getValue();
            var allowedPresences = Xrm.Page.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.AllowedPresences);
            var offlineOption = OmniChannelPackage.OmniChannelLiveWorkStreamConstants.BasePresences[OmniChannelPackage.OmniChannelLiveWorkStreamConstants.Offline];
            var isOfflineOptionSelected = this.isOfflineOptionSelected(allowedPresences, offlineOption);
            if (this.offlinePresence == null) {
                this.offlinePresence = allowedPresences.getAttribute().getOption(offlineOption);
            }
            if (formContext.ui.getFormType() != 1) {
                if (selectedValue != OmniChannelPackage.OmniChannelLiveWorkStreamConstants.EntityStreamSourceOption && !isOfflineOptionSelected) {
                    allowedPresences.removeOption(offlineOption);
                }
            }
            if (formContext.ui.getFormType() == 1) {
                if (selectedValue != OmniChannelPackage.OmniChannelLiveWorkStreamConstants.EntityStreamSourceOption) {
                    allowedPresences.removeOption(offlineOption);
                }
                else {
                    allowedPresences.addOption(this.offlinePresence);
                }
            }
        };
        ;
        LiveWorkStreamSettings.prototype.isOfflineOptionSelected = function (allowedPresences, offlineOption) {
            var selectedOptions = allowedPresences.getAttribute().getSelectedOption();
            if (selectedOptions != null && selectedOptions.find(function (x) { return x.value == offlineOption; })) {
                return true;
            }
            return false;
        };
        LiveWorkStreamSettings.prototype.SetWdsDefaultModeOnStreamSourceSelected = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var streamSource = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSource);
            var workDistributionMode = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.WorkDistributionMode);
            var entityRoutingConfigurationLookupControl = formContext.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.EntityRoutingConfiguration);
            var entityRoutingConfigurationLookup = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.EntityRoutingConfiguration);
            this.notificationTemplateIncomingUnauth = Xrm.Page.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.NotificationTemplateIncomingUnauth);
            this.notificationTemplateIncomingConsult = Xrm.Page.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.NotificationTemplateIncomingConsult);
            this.notificationTemplateIncomingTransfer = Xrm.Page.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.NotificationTemplateIncomingTransfer);
            this.notificationTemplateIncomingSupervisorAssign = Xrm.Page.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.NotificationTemplateIncomingSupervisorAssign);
            workDistributionMode.setValue(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.WDSPushModeOption);
            var selectedValue = streamSource && streamSource.getValue();
            if (selectedValue && selectedValue == OmniChannelPackage.OmniChannelLiveWorkStreamConstants.EntityStreamSourceOption) {
                entityRoutingConfigurationLookupControl.setVisible(true);
                this.showCaseRoutingNotifications(formContext);
            }
            else {
                if (entityRoutingConfigurationLookup != null) {
                    //Clear ERC field if we are switching away from Entity Records stream source
                    entityRoutingConfigurationLookup.setValue(null);
                }
                entityRoutingConfigurationLookupControl.setVisible(false);
                this.hideCaseRoutingNotifications(formContext);
            }
            this.showHideTemplates(selectedValue);
            this.HideRoutingRuleTabOnStreamSourceSelected(executionContext);
            //On WDS mode change, change the visibility of agent affinity control accordingly
            this.SetEnableAgentAffinityVisibility(executionContext);
        };
        LiveWorkStreamSettings.prototype.DisableStreamSourceAndEntityRecordConfigOnceSaved = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var streamSourceAttribute = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSource);
            var streamSourceAttributeValue = streamSourceAttribute && streamSourceAttribute.getValue();
            var entityRoutingConfigurationLookup = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.EntityRoutingConfiguration);
            var entityRoutingConfigurationAttributeValue = entityRoutingConfigurationLookup && entityRoutingConfigurationLookup.getValue();
            var disableStreamSourceAndEntityConfigControl = function () {
                var streamSourceControl = formContext.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSource);
                streamSourceControl.setDisabled(streamSourceAttributeValue != null);
                var entityRoutingConfigurationLookupControl = formContext.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.EntityRoutingConfiguration);
                if (streamSourceAttributeValue == OmniChannelPackage.OmniChannelLiveWorkStreamConstants.EntityStreamSourceOption) {
                    entityRoutingConfigurationLookupControl.setDisabled(entityRoutingConfigurationAttributeValue != null);
                }
            };
            formContext.ui.addOnLoad(disableStreamSourceAndEntityConfigControl);
        };
        LiveWorkStreamSettings.prototype.DisableNotificationOnWDSModeSelected = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var workDistributionMode = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.WorkDistributionMode);
            var notification = formContext.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.Notification);
            var selectedValue = workDistributionMode && workDistributionMode.getValue();
            if (selectedValue) {
                if (selectedValue == "192350001") {
                    notification.setVisible(false);
                }
                else {
                    notification.setVisible(false);
                }
            }
        };
        LiveWorkStreamSettings.prototype.DisableWorkDistributionModeOnceSaved = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var disableWorkDistributionModeControl = function () {
                var streamSourceAttribute = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSource);
                var workDistributionControl = formContext.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.WorkDistributionMode);
                var selectedValue = streamSourceAttribute && streamSourceAttribute.getValue();
                workDistributionControl && workDistributionControl.setDisabled(selectedValue != null);
            };
            formContext.ui.addOnLoad(disableWorkDistributionModeControl);
        };
        LiveWorkStreamSettings.prototype.SetAllowedPresencesOnStreamSourceSelected = function (executionContext) {
            var formContext = executionContext.getFormContext();
            if (formContext.ui.getFormType() != 1)
                return;
            this.showHideOfflinePresence(formContext);
            var allowedPresencesAttribute = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.AllowedPresences);
            if (allowedPresencesAttribute.getValue() != null)
                return;
            var streamSourceAttribute = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSource);
            switch (streamSourceAttribute.getValue()) {
                case OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSourceType["CDSEntity"]:
                    allowedPresencesAttribute.setValue([OmniChannelPackage.OmniChannelLiveWorkStreamConstants.BasePresences["Available"],
                        OmniChannelPackage.OmniChannelLiveWorkStreamConstants.BasePresences["Busy"],
                        OmniChannelPackage.OmniChannelLiveWorkStreamConstants.BasePresences["BusyDND"],
                        OmniChannelPackage.OmniChannelLiveWorkStreamConstants.BasePresences["Away"]]);
                    break;
                default:
                    allowedPresencesAttribute.setValue([OmniChannelPackage.OmniChannelLiveWorkStreamConstants.BasePresences["Available"],
                        OmniChannelPackage.OmniChannelLiveWorkStreamConstants.BasePresences["Busy"]]);
                    break;
            }
        };
        LiveWorkStreamSettings.prototype.onChangeSetAutoCloseAfterInactivity = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var autoCloseAfterInactivityAttribute = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.AutoCloseAfterInactivity);
            var autoCloseAfterInactivityControl = formContext.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.AutoCloseAfterInactivity);
            var streamSource = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSource).getValue();
            var isCDSEntitySelected = streamSource !== null && streamSource === OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSourceType["CDSEntity"];
            //Changed for task 1396480 (decouple SMS and chat references)
            if (isCDSEntitySelected) {
                autoCloseAfterInactivityAttribute.setValue(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.DefaultAutoCloseAfterInactivity["CDSEntity"]);
                autoCloseAfterInactivityControl.setVisible(false);
            }
        };
        LiveWorkStreamSettings.prototype.onLoadSetVisibilityAutoCloseAfterInactivity = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var autoCloseAfterInactivityControl = formContext.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.AutoCloseAfterInactivity);
            var streamSourceAttribute = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSource);
            switch (streamSourceAttribute.getValue()) {
                case OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSourceType["CDSEntity"]:
                    autoCloseAfterInactivityControl.setVisible(false);
                    break;
                default:
                    autoCloseAfterInactivityControl.setVisible(true);
                    break;
            }
        };
        LiveWorkStreamSettings.prototype.HideSecondaryChannels = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var attribute = formContext.getAttribute("msdyn_streamsource");
            if (attribute !== null) {
                attribute.controls.forEach(function (control) {
                    control.removeOption(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSourceType["Voice"]); //Voice
                    control.removeOption(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSourceType["Video"]); //Video
                    control.removeOption(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSourceType["Cobrowse"]); //Cobrowse
                    control.removeOption(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSourceType["ScreenSharing"]); //ScreenSharing
                });
            }
        };
        LiveWorkStreamSettings.prototype.HideBusinessChannels = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var attribute = formContext.getAttribute("msdyn_streamsource");
            if (attribute !== null) {
                attribute.controls.forEach(function (control) {
                    control.removeOption(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSourceType["AppleMessagesForBusiness"]); //AMB
                    control.removeOption(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSourceType["GoogleBusinessMessages"]); //GBM
                });
            }
        };
        LiveWorkStreamSettings.prototype.HideCodeAuthType = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var attribute = formContext.getAttribute("msdyn_authenticationtype");
            if (attribute !== null) {
                attribute.controls.forEach(function (control) {
                    control.removeOption(192350001); //Code flow
                    control.removeOption(192350002); //Gatekeeper Biometric Authentication
                });
            }
        };
        LiveWorkStreamSettings.prototype.HideAuthChannelType = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var attribute = formContext.getAttribute("msdyn_ocauthchanneltype");
            if (attribute !== null) {
                attribute.controls.forEach(function (control) {
                    control.removeOption(192450000); //AMB
                    control.removeOption(192440000); //Voice
                });
            }
        };
        LiveWorkStreamSettings.prototype.SetDefaultCapacityAndAutoCloseDuration = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var autoCloseAfterInactivityAttribute = formContext.getAttribute(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.AutoCloseAfterInactivity);
            var capacityAttribute = formContext.getAttribute(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.Capacity);
            var streamSource = formContext.getAttribute(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSource).getValue();
            var streamSourceKeys = Object.keys(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSourceType);
            var streamSourceName = streamSourceKeys.find(function (key) { return OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSourceType[key] === streamSource; });
            if (typeof streamSourceName === "string") {
                if (autoCloseAfterInactivityAttribute.getValue() === null) {
                    autoCloseAfterInactivityAttribute.setValue(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.DefaultAutoCloseAfterInactivity[streamSourceName]);
                }
                if (capacityAttribute.getValue() === null) {
                    capacityAttribute.setValue(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.DefaultCapacity[streamSourceName]);
                }
            }
        };
        LiveWorkStreamSettings.prototype.setEnableAgentAffinityBasedOnChannel = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var streamSource = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.StreamSource);
            var selectedValue = streamSource && streamSource.getValue();
            var agentAffinity = Xrm.Page.getAttribute(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.EnableAgentAffinity);
            if (selectedValue && (OmniChannelPackage.OmniChannelLiveWorkStreamConstants.AgentAffinityChannels.indexOf(selectedValue) >= 0)) {
                agentAffinity.setValue(true);
            }
            else {
                //off by default
                agentAffinity.setValue(false);
            }
        };
        LiveWorkStreamSettings.prototype.showHideTemplates = function (selectedValue) {
            if (selectedValue && selectedValue == OmniChannelPackage.OmniChannelLiveWorkStreamConstants.EntityStreamSourceOption && this.isTemplateSectionLoaded()) {
                this.notificationTemplateIncomingUnauth.setVisible(false);
                this.notificationTemplateIncomingConsult.setVisible(false);
                this.notificationTemplateIncomingTransfer.setVisible(false);
                this.notificationTemplateIncomingSupervisorAssign.setVisible(false);
            }
            else if (this.isTemplateSectionLoaded()) {
                this.notificationTemplateIncomingUnauth.setVisible(true);
                this.notificationTemplateIncomingConsult.setVisible(true);
                this.notificationTemplateIncomingTransfer.setVisible(true);
                this.notificationTemplateIncomingSupervisorAssign.setVisible(true);
            }
        };
        LiveWorkStreamSettings.prototype.isTemplateSectionLoaded = function () {
            if (this.notificationTemplateIncomingUnauth != null && this.notificationTemplateIncomingConsult != null && this.notificationTemplateIncomingTransfer != null && this.notificationTemplateIncomingSupervisorAssign != null) {
                return true;
            }
            return false;
        };
        LiveWorkStreamSettings.prototype.SetEnableAgentAffinityVisibility = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var workDistributionMode = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.WorkDistributionMode);
            var enableAgentAffinity = formContext.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.EnableAgentAffinity);
            var agentAffinityHelpText = formContext.getControl(OmniChannelPackage.OmniChannelLiveWorkStreamConstants.AgentAffinityHelpText);
            var enableAgentAffinityAttribute = enableAgentAffinity.getAttribute();
            var selectedValue = workDistributionMode && workDistributionMode.getValue();
            if (selectedValue) {
                if (selectedValue == OmniChannelPackage.OmniChannelLiveWorkStreamConstants.WorkDistributionModeOptions.Pick) {
                    enableAgentAffinityAttribute.setValue(false);
                    enableAgentAffinity.setVisible(false);
                    agentAffinityHelpText.setVisible(false);
                }
                else {
                    agentAffinityHelpText.setVisible(true);
                    enableAgentAffinity.setVisible(true);
                }
            }
        };
        return LiveWorkStreamSettings;
    }());
    OmniChannelPackage.LiveWorkStreamSettings = LiveWorkStreamSettings;
    var OmniChannelLiveWorkStream = (function () {
        function OmniChannelLiveWorkStream() {
        }
        return OmniChannelLiveWorkStream;
    }());
    OmniChannelLiveWorkStream.Instance = new LiveWorkStreamSettings();
    OmniChannelPackage.OmniChannelLiveWorkStream = OmniChannelLiveWorkStream;
})(OmniChannelPackage || (OmniChannelPackage = {}));
