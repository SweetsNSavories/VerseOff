/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var OmniChannelPackage;
(function (OmniChannelPackage) {
    var OmniChannelLWSChatConstants = (function () {
        function OmniChannelLWSChatConstants() {
        }
        return OmniChannelLWSChatConstants;
    }());
    OmniChannelLWSChatConstants.StreamSource = "msdyn_streamsource";
    OmniChannelLWSChatConstants.ChatSettings = "chatSettings";
    OmniChannelLWSChatConstants.ChatQuestionsLibrary = "chatQuestionsLibrary";
    OmniChannelLWSChatConstants.LiveChatConfigs = "nav_msdyn_msdyn_liveworkstream_msdyn_livechatconfig_liveworkstreamid";
    OmniChannelLWSChatConstants.ChatQuestions = "nav_msdyn_msdyn_liveworkstream_msdyn_surveyquestion";
    OmniChannelLWSChatConstants.OCRuleItem = "nav_msdyn_liveworkstream_ocruleitem";
    OmniChannelLWSChatConstants.Function = "function";
    OmniChannelLWSChatConstants.AutoCloseAfterInactivity = "msdyn_autocloseafterinactivity";
    OmniChannelLWSChatConstants.LiveChatStreamSourceType = 192360000;
    OmniChannelLWSChatConstants.DefaultAutoCloseAfterInactivity = 5; // minutes
    OmniChannelPackage.OmniChannelLWSChatConstants = OmniChannelLWSChatConstants;
})(OmniChannelPackage || (OmniChannelPackage = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
///<reference path="../TypeDefinitions/libs/XrmClientApi.d.ts"/>
///<reference path="LWSChatConstants.ts"/>
"use strict";
var OmniChannelPackage;
(function (OmniChannelPackage) {
    var LWSChatSettings = (function () {
        function LWSChatSettings() {
        }
        LWSChatSettings.prototype.HideOrShowChatSettingsBasedOnoptionSetValue = function () {
            var chatSettingsTab = Xrm.Page.ui.tabs.get(OmniChannelPackage.OmniChannelLWSChatConstants.ChatSettings);
            var chatQuestionsLibrary = Xrm.Page.ui.tabs.get(OmniChannelPackage.OmniChannelLWSChatConstants.ChatQuestionsLibrary);
            var streamsource = Xrm.Page.getAttribute(OmniChannelPackage.OmniChannelLWSChatConstants.StreamSource).getValue();
            var liveChatConfigs = Xrm.Page.ui.navigation.items.get(OmniChannelPackage.OmniChannelLWSChatConstants.LiveChatConfigs);
            var chatQuestions = Xrm.Page.ui.navigation.items.get(OmniChannelPackage.OmniChannelLWSChatConstants.ChatQuestions);
            var ocRuleItem = Xrm.Page.ui.navigation.items.get(OmniChannelPackage.OmniChannelLWSChatConstants.OCRuleItem);
            this.setControlVisibility(liveChatConfigs, false);
            this.setControlVisibility(chatQuestions, false);
            this.setControlVisibility(ocRuleItem, false);
            if (streamsource != null && streamsource == 192360000) {
                this.setControlVisibility(chatSettingsTab, true);
                this.setControlVisibility(chatQuestionsLibrary, true);
            }
            else {
                this.setControlVisibility(chatSettingsTab, false);
                this.setControlVisibility(chatQuestionsLibrary, false);
            }
        };
        // DefaultAutoCloseAfterInactivity settings for LiveCHat channel added in respect of task-1396480
        LWSChatSettings.prototype.onChangeSetAutoCloseAfterInactivity = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var autoCloseAfterInactivityAttribute = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelLWSChatConstants.AutoCloseAfterInactivity);
            var autoCloseAfterInactivityControl = formContext.getControl(OmniChannelPackage.OmniChannelLWSChatConstants.AutoCloseAfterInactivity);
            var streamSource = formContext.data.entity.attributes.getByName(OmniChannelPackage.OmniChannelLWSChatConstants.StreamSource).getValue();
            var isChatSelected = streamSource !== null && streamSource === OmniChannelPackage.OmniChannelLWSChatConstants.LiveChatStreamSourceType;
            if (isChatSelected && formContext.ui.getFormType() == 1) {
                autoCloseAfterInactivityAttribute.setValue(OmniChannelPackage.OmniChannelLWSChatConstants.DefaultAutoCloseAfterInactivity);
                autoCloseAfterInactivityControl.setVisible(true);
            }
        };
        LWSChatSettings.prototype.setControlVisibility = function (tabControl, show) {
            if (tabControl != null && typeof tabControl.setVisible === OmniChannelPackage.OmniChannelLWSChatConstants.Function) {
                tabControl.setVisible(show);
            }
        };
        return LWSChatSettings;
    }());
    OmniChannelPackage.LWSChatSettings = LWSChatSettings;
    var OmniChannelLWS = (function () {
        function OmniChannelLWS() {
        }
        return OmniChannelLWS;
    }());
    OmniChannelLWS.Instance = new LWSChatSettings();
    OmniChannelPackage.OmniChannelLWS = OmniChannelLWS;
})(OmniChannelPackage || (OmniChannelPackage = {}));
