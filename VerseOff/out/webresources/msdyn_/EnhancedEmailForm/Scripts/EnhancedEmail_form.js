var EmailEngagement = EmailEngagement || {};

EmailEngagement.EmailEngagementFCB = "FCB.EmailEngagement";
EmailEngagement.FCB_EmailEngagement = "EmailEngagement";

EmailEngagement.isEmailEngagementFCBEnabled = function (isUci) {
  if (isUci) {
    return Xrm.Internal.isFeatureEnabled(EmailEngagement.EmailEngagementFCB) || Xrm.Internal.isFeatureEnabled(EmailEngagement.FCB_EmailEngagement);
  }
  else {
    return Xrm.Internal.isFeatureEnabled(EmailEngagement.EmailEngagementFCB);
  }
};



EmailEngagement.isEmailEngagementEnabledAtOrgLevel = function (form) {
  // Fetching from organization table in case of UCI
  return Xrm.WebApi.online.retrieveRecord("organization", Xrm.Utility.getGlobalContext().organizationSettings.organizationId, "?$select=name,isemailmonitoringallowed")
     .then(function (response) {
          if (response != null) {
            return response.isemailmonitoringallowed;
          }
          else {
            return false;
          }
     }, function (errorResponse) {
          Xrm.Navigation.openAlertDialog({
                        text: errorResponse.message
                    }); 
          return false;
     });
};

EmailEngagement.isEmailEngagementEnabled = function (form, isUci) {
  return EmailEngagement.isEmailEngagementEnabledAtOrgLevel(form).then(function (isEmailMonitoringEnabled) {
    return EmailEngagement.isEmailEngagementFCBEnabled(isUci) && isEmailMonitoringEnabled && Activities.Common.Util.isEmailEngagementActionsFCBEnabled(isUci);
  });
};

EmailEngagement.hideEeTab = function (form) {
    EmailEngagement.isEmailEngagementEnabled(form, Xrm.Internal.isUci()).then(function (isEmailEngagementEnabled) {
        if (isEmailEngagementEnabled) {
          form._eventSource._tabs._collection.Email_Engagement.setVisible(true);
        }
        else{
          form._eventSource._tabs._collection.Email_Engagement.setVisible(false);
		}
      });
};