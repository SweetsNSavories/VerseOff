var EmailEngagementForUCI = EmailEngagementForUCI || {};

EmailEngagementForUCI.EmailEngagementFCB = "FCB.EmailEngagement";
EmailEngagementForUCI.FCB_EmailEngagement = "EmailEngagement";

EmailEngagementForUCI.getCloudAttachments = function (entityId) {
  var optionsString = "";
  if (Xrm.Internal.isUci()) {
    optionsString = "?fetchXml=";
  }
  else {
    optionsString = "fetchXml=";
  }
  optionsString = optionsString + "<fetch version='1.0' output-format='xml-platform' mapping='logical'><entity name='activitymimeattachment'>" +
    "<attribute name='filename' /><attribute name='filesize' />" +
    "<attribute name='activitymimeattachmentid' /><attribute name='isfollowed' />" +
    "<attribute name='anonymouslink' />" +
    "<order attribute='filename' descending='false' />" +
    "<filter><condition attribute='objectid' operator = 'eq' value='" + entityId + "'></condition></filter>" +
    "</entity></fetch>";
  return Xrm.WebApi.online.retrieveMultipleRecords("activitymimeattachment", optionsString);
};

EmailEngagementForUCI.attachmentsGridOnLoadForUCI = function (entityId) {
  if (parent == null || parent.document == null) {
    return;
  }
  if (Xrm.Internal.isUci()) {
    EmailEngagementForUCI.getCloudAttachments(entityId).then(function (response) {
      var frameContent = parent.document.querySelector('.fullPageContentEditorFrame');
      if (frameContent.contentWindow) {
        var framedoc = frameContent.contentWindow.document;
      } else {
        return;
      }
      var topElement = framedoc.querySelector('.cke_contents');
      var attachmentElementDiv = framedoc.querySelector("#cloud_attachments") ? framedoc.querySelector("#cloud_attachments") : null;
      if (attachmentElementDiv == null) {
        attachmentElementDiv = parent.document.createElement("div");
        attachmentElementDiv.setAttribute("id", "cloud_attachments");
      }
      var attachments = response.entities;
      if (attachments.length > 0) {
        attachmentElementDiv.innerHTML = "";
        var cloudAttachments = 0;
        var attachment = null;
        for (var _i = 0, attachments_1 = attachments; _i < attachments_1.length; _i++) {
          attachment = attachments_1[_i];
          if (attachment["isfollowed"] == "1") {
            var cloudAttachmentSpan = parent.document.createElement("span");
            cloudAttachmentSpan.setAttribute("class", "ms-crm-cloud-attachment");
            cloudAttachmentSpan.style.padding = "10px";
            cloudAttachmentSpan.style.margin = "0 5px 5px 0";
            cloudAttachmentSpan.style.background = "#eee";
            cloudAttachmentSpan.style.display = "inline-block";
            var fileName = attachment["filename"];
            if (Activities.Common.Util.IsNull(fileName)) {
              fileName = "";
            }
            if (fileName.length > 50) {
              fileName = fileName.substring(0, 47) + "...";
            }
            cloudAttachmentSpan.textContent = fileName;
            attachmentElementDiv.appendChild(cloudAttachmentSpan);
          }
        }
        if (attachmentElementDiv.children.length > 0) {
          if (topElement != undefined && topElement != null) {
            topElement.insertBefore(attachmentElementDiv, topElement.childNodes[0]);
          }
          else {
            EmailEngagementForUCI.observer = new MutationObserver(function (mutations) {
              var topElement = framedoc.querySelector('.cke_contents');
              if (topElement != undefined && topElement != null) {
                topElement.insertBefore(attachmentElementDiv, topElement.childNodes[0]);
                EmailEngagementForUCI.observer.disconnect();
              }
            });
            EmailEngagementForUCI.observer.observe(frameContent.contentDocument.body, {
              childList: true,
              subtree: true,
              attributes: false,
              characterData: false,
            });
          }
          attachmentElementDiv.setAttribute("aria-label", Activities.ClientApi.getResourceString("Followed_Email_Attachments_Tooltip"));
          attachmentElementDiv.setAttribute("title", Activities.ClientApi.getResourceString("Followed_Email_Attachments_Tooltip"));
          attachmentElementDiv.style.padding = "10px 10px 5px 10px";
          attachmentElementDiv.style.borderBottom = "1px solid #ccc";
        }
        else {
          attachmentElementDiv.style.padding = "0px";
          attachmentElementDiv.style.borderBottom = "none";
        }
      }
    });
  }
};

EmailEngagementForUCI.isEmailEngagementEnabledAtOrgLevel = function (form) {
  // Fetching from organization table in case of UCI
  return Xrm.Utility.getGlobalContext().organizationSettings.attributes["isemailmonitoringallowed"];
};

EmailEngagementForUCI.isEmailEngagementFCBEnabled = function (isUci) {
  if (isUci) {
    return Xrm.Internal.isFeatureEnabled(EmailEngagementForUCI.EmailEngagementFCB) || Xrm.Internal.isFeatureEnabled(EmailEngagementForUCI.FCB_EmailEngagement);
  }
  else {
    return Xrm.Internal.isFeatureEnabled(EmailEngagementForUCI.EmailEngagementFCB);
  }
};

EmailEngagementForUCI.isEmailEngagementEnabled = function (form, isUci) {
  if (EmailEngagementForUCI.isEmailEngagementEnabledAtOrgLevel(form)) {
    return EmailEngagementForUCI.isEmailEngagementFCBEnabled(isUci) && Activities.Common.Util.isEmailEngagementActionsFCBEnabled(isUci);
  }
};

EmailEngagementForUCI.attachmentsGridLoaded = function (form) {
  if (Xrm.Internal.isUci() && !Activities.ClientApi.IsMocaOffline()) {
    var stateCode = form.getFormContext().data.entity.attributes.get(Activities.Constants.ControlStateCode) ? form.getFormContext().data.entity.attributes.get(Activities.Constants.ControlStateCode).getValue() : null;
    if (stateCode === 0) {
      if (EmailEngagementForUCI.isEmailEngagementEnabled(form, Xrm.Internal.isUci())) {
        var attachmentsGrid = form.getFormContext().ui.controls.get(Activities.Constants.ControlAttachmentsGrid);
        if (attachmentsGrid != null) {
          attachmentsGrid.addOnLoad(function () {
            setTimeout(function () { EmailEngagementForUCI.attachmentsGridOnLoadForUCI(form.getFormContext().data.entity.getId()); }, 3000);
          });
        }
      }
    }
  }
}
