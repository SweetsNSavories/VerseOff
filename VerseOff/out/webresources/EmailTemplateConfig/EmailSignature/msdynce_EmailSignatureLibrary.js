var CrmService;
(function (CrmService) {
    var EmailSignatureLibrary = /** @class */ (function () {
        function EmailSignatureLibrary() {
        }
        EmailSignatureLibrary.Load = function (executionContext) {
            try {
                var formContext = executionContext.getFormContext();
                var entityControl = formContext.getControl("emailsignature");
                if (entityControl != null && entityControl != undefined) {
                    var value = Xrm.Utility.getResourceString(EmailSignatureLibrary.WebResourceName, "EmailSignature_Recommendation_Msg");
                    if (value != null && value != undefined) {
                        entityControl.addNotification({
                            messages: [value],
                            notificationLevel: 'RECOMMENDATION',
                            uniqueId: 'queue_emailsignaturerecommendation',
                            actions: null
                        });
                    }
                }
            }
            catch (exception) {
                console.log("Error in adding recommendation message for Email Signature field.");
            }
        };
        EmailSignatureLibrary.insertDynamicText = function (executionContext) {
            var dynamicTextForEmailSignatureSetting = Xrm.Utility.getGlobalContext().getCurrentAppSetting("msdynce_enabledynamictextforemailsignature");
            var isEnableDynamicTextForSignature = Xrm.Internal.isFeatureEnabled(this.FCB_EnableDynamicTextForSignature);
            if (dynamicTextForEmailSignatureSetting != null && dynamicTextForEmailSignatureSetting != undefined && dynamicTextForEmailSignatureSetting == true && isEnableDynamicTextForSignature == true) {
                var templateTypeAttribute = "systemuser";
                Activities.Template.initializeDynamicText(templateTypeAttribute, executionContext);
            }
        };
        EmailSignatureLibrary.IsEmailSignatureSettingEnabled = function () {
            var dynamicTextForEmailSignatureSetting = Xrm.Utility.getGlobalContext().getCurrentAppSetting("msdynce_enabledynamictextforemailsignature");
            return dynamicTextForEmailSignatureSetting;
        };
        EmailSignatureLibrary.WebResourceName = "Localization/Languages/EmailStrings";
        EmailSignatureLibrary.FCB_EnableDynamicTextForSignature = "EnableDynamicTextForSignature";
        return EmailSignatureLibrary;
    }());
    CrmService.EmailSignatureLibrary = EmailSignatureLibrary;
})(CrmService || (CrmService = {}));
//# sourceMappingURL=msdynce_EmailSignatureLibrary.js.map