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
///<reference path="../LiveWorkStream/LiveWorkStreamConstants.ts" />
"use strict";
var OmniChannelPackage;
(function (OmniChannelPackage) {
    var QueueConstants = (function () {
        function QueueConstants() {
        }
        return QueueConstants;
    }());
    QueueConstants.IsOmnichannelQueue = "msdyn_isomnichannelqueue";
    QueueConstants.QueueViewType = "queueviewtype";
    QueueConstants.QueueType = "msdyn_queuetype";
    QueueConstants.OCBaseSolutionName = "msdyn_OmnichannelBase";
    QueueConstants.OCFormNotificationText = "OC_FormNotificationMessageForDSF";
    QueueConstants.OCFormNotificationType = "INFO";
    QueueConstants.OCFormNotificationId = "769421F3-E844-4A09-8496-FF1778628118";
    QueueConstants.AgentsSubGrid = "Agents";
    QueueConstants.IsOmnichannelQueueQueryString = "?$select=msdyn_isomnichannelqueue";
    QueueConstants.QueueEntity = "queue";
    QueueConstants.QueueUcFormId = "6ed25386-e3ec-4e2b-bc5e-6a2a7803c8f3";
    QueueConstants.QueueHubFormId = "1e60384f-3826-479e-8c62-d6c0ebbcc151";
    QueueConstants.OCProvisioningPowerPlatformSetting = "msdyn_IsCCaaSProvisioned";
    QueueConstants.URProvisioningPowerPlatformSetting = "msdyn_IsCCaaSURProvisioned";
    OmniChannelPackage.QueueConstants = QueueConstants;
    var QueueType;
    (function (QueueType) {
        QueueType[QueueType["DigitalMessaging"] = 192350000] = "DigitalMessaging";
        QueueType[QueueType["Entity"] = 192350001] = "Entity";
        QueueType[QueueType["PhoneCall"] = 192350002] = "PhoneCall";
    })(QueueType = OmniChannelPackage.QueueType || (OmniChannelPackage.QueueType = {}));
    function getQueueType(channel) {
        switch (channel) {
            case OmniChannelPackage.StreamSourceType.CDSEntity:
                return QueueType.Entity;
            case OmniChannelPackage.StreamSourceType.SMS: // SMS
            case OmniChannelPackage.StreamSourceType.LiveChat: // Live Chat
            case OmniChannelPackage.StreamSourceType.Facebook: // Facebook
            case OmniChannelPackage.StreamSourceType.Line: // LINE
            case OmniChannelPackage.StreamSourceType.WhatsApp: // Whatsapp
            case OmniChannelPackage.StreamSourceType.WeChat: // Wechat
            case OmniChannelPackage.StreamSourceType.Twitter: // Twitter
            case OmniChannelPackage.StreamSourceType.Kik:
            case OmniChannelPackage.StreamSourceType.Teams:
            case OmniChannelPackage.StreamSourceType.Telegram:
            case OmniChannelPackage.StreamSourceType.AppleMessagesForBusiness:
            case OmniChannelPackage.StreamSourceType.GoogleBusinessMessages:
            case OmniChannelPackage.StreamSourceType.Custom:
                return QueueType.DigitalMessaging;
            case OmniChannelPackage.StreamSourceType.PhoneCall:
                return QueueType.PhoneCall;
            default:
                return null;
        }
        ;
    }
    OmniChannelPackage.getQueueType = getQueueType;
})(OmniChannelPackage || (OmniChannelPackage = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
///<reference path="../TypeDefinitions/libs/XrmClientApi.d.ts"/>
///<reference path="QueueConstants.ts"/>
///<reference path="../../../../references/internal/TypeDefinitions/XrmClientApi/XrmClientApiInternal.d.ts"/>
///<reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
"use strict";
var OmniChannelPackage;
(function (OmniChannelPackage) {
    var QueueSettings = (function () {
        function QueueSettings() {
            var _this = this;
            this.openRecord = function (records, primaryEntityTypeCode) {
                var queueOtc = "2020";
                if (primaryEntityTypeCode == queueOtc) {
                    var uCFormOptions_1 = {
                        entityId: records[0],
                        entityName: OmniChannelPackage.QueueConstants.QueueEntity,
                        formId: OmniChannelPackage.QueueConstants.QueueUcFormId
                    };
                    _this.isUnifiedRoutingQueue(records[0]).then(function (isUnifiedRoutingQueue) {
                        if (isUnifiedRoutingQueue) {
                            var hubFormOptions = {
                                entityId: records[0],
                                entityName: OmniChannelPackage.QueueConstants.QueueEntity,
                                formId: OmniChannelPackage.QueueConstants.QueueHubFormId
                            };
                            Xrm.Navigation.openForm(hubFormOptions);
                        }
                        else {
                            Xrm.Navigation.openForm(uCFormOptions_1);
                        }
                    })["catch"](function (err) {
                        Xrm.Navigation.openForm(uCFormOptions_1);
                    });
                }
                return;
            };
            this.openNewRecord = function (entityTypeCode) {
                var queueOtc = "2020";
                if (!entityTypeCode)
                    return;
                if (entityTypeCode == queueOtc) {
                    var openOptions = {
                        entityName: OmniChannelPackage.QueueConstants.QueueEntity,
                        formId: OmniChannelPackage.QueueConstants.QueueUcFormId
                    };
                    Xrm.Navigation.openForm(openOptions);
                }
                return;
            };
        }
        QueueSettings.prototype.lockIsOmnichannelQueueToggleInCDSQueueForm = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var isOmnichannelQueue = formContext.data.entity.attributes.getByName(OmniChannelPackage.QueueConstants.IsOmnichannelQueue);
            var isOmnichannelQueueControl = formContext.getControl(OmniChannelPackage.QueueConstants.IsOmnichannelQueue);
            var isOmnichannelQueueValue = isOmnichannelQueue && isOmnichannelQueue.getValue();
            if (isOmnichannelQueueValue != null) {
                isOmnichannelQueueControl.setDisabled(isOmnichannelQueueValue);
            }
        };
        QueueSettings.prototype.setDefaultQueueTypeInCDSQueueForm = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var queuetypeAttribute = formContext.data.entity.attributes.getByName(OmniChannelPackage.QueueConstants.QueueType);
            var formInCreateMode = (formContext.ui.getFormType() == 1);
            if (formInCreateMode) {
                queuetypeAttribute.setValue(OmniChannelPackage.QueueType.Entity);
            }
        };
        QueueSettings.prototype.showNotificationInForm = function (executionContext) {
            var gridContext = executionContext.getFormContext();
            if (gridContext.formContext) {
                gridContext.formContext.ui.setFormNotification(Xrm.Utility.getResourceString(OmniChannelPackage.QueueConstants.OCBaseSolutionName, OmniChannelPackage.QueueConstants.OCFormNotificationText), OmniChannelPackage.QueueConstants.OCFormNotificationType, OmniChannelPackage.QueueConstants.OCFormNotificationId);
            }
            else {
                gridContext.ui.setFormNotification(Xrm.Utility.getResourceString(OmniChannelPackage.QueueConstants.OCBaseSolutionName, OmniChannelPackage.QueueConstants.OCFormNotificationText), OmniChannelPackage.QueueConstants.OCFormNotificationType, OmniChannelPackage.QueueConstants.OCFormNotificationId);
            }
        };
        QueueSettings.prototype.clearNotificationInForm = function (executionContext) {
            var formContext = executionContext.getFormContext();
            formContext.ui.clearFormNotification(OmniChannelPackage.QueueConstants.OCFormNotificationId);
        };
        QueueSettings.prototype.disableQueuetypeOnceSaved = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var formInUpdateMode = (formContext.ui.getFormType() == 2);
            var disablequeuetypeControl = function () {
                var queuetypeControl = formContext.getControl(OmniChannelPackage.QueueConstants.QueueType);
                if (queuetypeControl != null && formInUpdateMode) {
                    queuetypeControl.setDisabled(true);
                }
            };
            formContext.data.addOnLoad(disablequeuetypeControl);
        };
        QueueSettings.prototype.onLoadSetValue = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var isFCSEnabled = false;
            var cCaaS_setting = false;
            var cCaaSUR_setting = false;
            if (Xrm.Internal.isUci()) {
                isFCSEnabled = Xrm.Utility.getGlobalContext().getFeatureControlSetting("Omnichannel.OmnichannelForUnifiedRouting", "UtilizePowerPlatformSettingsForOmichannelProvisioningStatus");
            }
            if (isFCSEnabled == true) {
                var ocFlag = Xrm.Utility.getGlobalContext().getCurrentAppSetting(OmniChannelPackage.QueueConstants.OCProvisioningPowerPlatformSetting);
                if (ocFlag != null) {
                    cCaaS_setting = ocFlag;
                }
                var urFlag = Xrm.Utility.getGlobalContext().getCurrentAppSetting(OmniChannelPackage.QueueConstants.URProvisioningPowerPlatformSetting);
                if (urFlag != null) {
                    cCaaSUR_setting = urFlag;
                }
            }
            var isOmnichannelQueue = formContext.data.entity.attributes.getByName(OmniChannelPackage.QueueConstants.IsOmnichannelQueue);
            if (isOmnichannelQueue.getValue() != null && (cCaaS_setting == true || cCaaSUR_setting == true)) {
                isOmnichannelQueue.setValue(true);
            }
            var queueViewType = formContext.data.entity.attributes.getByName(OmniChannelPackage.QueueConstants.QueueViewType);
            if (queueViewType.getValue() != null && (cCaaS_setting == true || cCaaSUR_setting == true)) {
                queueViewType.setValue(1);
            }
            var subGridContext = formContext.getControl(OmniChannelPackage.QueueConstants.AgentsSubGrid);
            subGridContext.addOnLoad(this.showNotificationInForm);
            this.clearNotificationInForm(executionContext);
            this.disableQueuetypeOnceSaved(executionContext);
        };
        QueueSettings.prototype.onSaveSetValue = function (executionContext) {
            var formContext = executionContext.getFormContext();
            formContext.ui.setFormNotification(Xrm.Utility.getResourceString(OmniChannelPackage.QueueConstants.OCBaseSolutionName, OmniChannelPackage.QueueConstants.OCFormNotificationText), OmniChannelPackage.QueueConstants.OCFormNotificationType, OmniChannelPackage.QueueConstants.OCFormNotificationId);
        };
        QueueSettings.prototype.onCDSQueueLoadSetValue = function (executionContext) {
            this.lockIsOmnichannelQueueToggleInCDSQueueForm(executionContext);
            this.disableQueuetypeOnceSaved(executionContext);
            this.setDefaultQueueTypeInCDSQueueForm(executionContext);
        };
        QueueSettings.prototype.onCDSQueueSaveSetValue = function (executionContext) {
            this.lockIsOmnichannelQueueToggleInCDSQueueForm(executionContext);
            this.disableQueuetypeOnceSaved(executionContext);
        };
        QueueSettings.prototype.isUnifiedRoutingQueue = function (recordId) {
            return new Promise(function (resolve, reject) {
                Xrm.WebApi.retrieveRecord(OmniChannelPackage.QueueConstants.QueueEntity, recordId, OmniChannelPackage.QueueConstants.IsOmnichannelQueueQueryString).then(function (response) {
                    resolve(response.msdyn_isomnichannelqueue);
                }, function (error) {
                    reject(false);
                });
            });
        };
        return QueueSettings;
    }());
    OmniChannelPackage.QueueSettings = QueueSettings;
    var Queue = (function () {
        function Queue() {
        }
        return Queue;
    }());
    Queue.Instance = new QueueSettings();
    OmniChannelPackage.Queue = Queue;
})(OmniChannelPackage || (OmniChannelPackage = {}));
