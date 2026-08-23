/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 */
const STR_DIRECTORY = 'strings_/MailboxFormValidations';

const ServerProfileConstants = {
  EMAIL_SERVER_PROFILE_ENTITY: 'emailserverprofile',
  SERVER_TYPE: 'servertype',
  SERVER_TYPE_EXCHANGE: [0, 2, 3],
  INCOMING_CREDENTIAL_RETRIEVAL: 'incomingcredentialretrieval',
  GMAIL_OAUTH_CREDENTIAL_RETRIEVAL_METHOD: 5,
  OAUTH_CLIENT_ID: 'oauthclientid',
};

const FormAttributes = {
  EMAIL_SERVER_PROFILE: 'emailserverprofile',
};

const DIALOG_MODE = {
  DIALOG: 1,
  PANEL: 2,
};

const UNSET_SIZE = -1;
const LARGE_PANEL_WIDTH = 800;

const Dialogs = {
  TEST_AND_ENABLE: 'Email.Mailbox.TestAndEnable',
  APPLY_SETTINGS: 'Email.Mailbox.ApplyDefaultSettings',
  REJECT_EMAIL: 'Email.Mailbox.RejectEmail',
  APPROVE_EMAIL: 'Email.Mailbox.ApproveEmail',
  FOLDER_TRACKING_RULES: 'Email.Mailbox.FolderLevelTracking',
};

function createNewForwardMailbox() {
  window.Xrm.Navigation.navigateTo({
    pageType: 'entityrecord',
    entityName: 'mailbox',
    formId: '482b71b2-6cc4-40e2-9396-88e1a3fe97f0',
  });
}

function getSelectedIdsFromGrid(selectedEntities, gridControl) {
  if (selectedEntities?.length > 0) {
    var rows = gridControl.getGrid().getSelectedRows();
    /* Platform bug : The selectedEntities contains repeated selected ids if a user selects all rows => test and enables mailboxes
    => traverses to failed view and traverse back to mailbox view and selects rows*/
    var selectedEntityIds = [];
    for (var index = 0; index < rows.getLength(); index++) {
      var rowEntity = rows.get(index).getData().getEntity();
      selectedEntityIds.push(getIdsFromString(rowEntity.getId()));
    }
  }

  return selectedEntityIds;
}

function canRefreshPage(params, sourceGridControl) {
  const isRefreshRequired = params?.parameters?.['is_refresh_required'];
  if (isRefreshRequired) {
    if (sourceGridControl) {
      sourceGridControl.refresh();
    } else if (window.Xrm.Page && window.Xrm.Page.data) {
      window.Xrm.Page.data.refresh();
    }
  }
}

function openConfigurationDialog(dialogName, selectedEntityIds, gridControl) {
  window.Xrm.Navigation.openDialog(
    dialogName,
    { position: DIALOG_MODE.DIALOG, height: UNSET_SIZE, width: UNSET_SIZE },
    {
      selected_mailboxes: selectedEntityIds.join(','),
      is_operation_from_grid: gridControl != null,
    },
  ).then(function (params) {
    canRefreshPage(params, gridControl);
  });
}

function testAndEnableMailbox(selectedEntities, gridControl) {
  var selectedEntityIds = getSelectedIdsFromGrid(selectedEntities, gridControl);
  openConfigurationDialog(Dialogs.TEST_AND_ENABLE, selectedEntityIds, gridControl);
}

function getIdsFromString(str) {
  const regex = /\{([^}]+)\}/g;
  let matches = [];
  let match;
  while ((match = regex.exec(str)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

function getValueForControl(controlName, formContext) {
  var value = null;
  try {
    value = formContext.getControl(controlName).getAttribute().getValue();
  } finally {
    return value;
  }
}

function testAndEnableMailboxFromForm(mailboxId) {
  openConfigurationDialog(Dialogs.TEST_AND_ENABLE, getIdsFromString(mailboxId));
}

function applyDefaultEmailSettings(selectedEntities, gridControl) {
  const selectedEntityIds = getSelectedIdsFromGrid(selectedEntities, gridControl);
  openConfigurationDialog(Dialogs.APPLY_SETTINGS, selectedEntityIds, gridControl);
}

function applyDefaultSettingsFromForm(mailboxId) {
  openConfigurationDialog(Dialogs.APPLY_SETTINGS, getIdsFromString(mailboxId));
}

function approveEmail(selectedEntities, gridControl) {
  const selectedEntityIds = getSelectedIdsFromGrid(selectedEntities, gridControl);
  openConfigurationDialog(Dialogs.APPROVE_EMAIL, selectedEntityIds, gridControl);
}

function approveEmailFromForm(mailboxId) {
  openConfigurationDialog(Dialogs.APPROVE_EMAIL, getIdsFromString(mailboxId));
}

function rejectEmail(selectedEntities, gridControl) {
  const selectedEntityIds = getSelectedIdsFromGrid(selectedEntities, gridControl);
  openConfigurationDialog(Dialogs.REJECT_EMAIL, selectedEntityIds, gridControl);
}

function rejectEmailFromForm(mailboxId) {
  openConfigurationDialog(Dialogs.REJECT_EMAIL, getIdsFromString(mailboxId));
}

function navigateToMailboxModernForm(mailboxId) {
  window.Xrm.Navigation.navigateTo({
    pageType: 'entityrecord',
    entityName: 'mailbox',
    formId: '482b71b2-6cc4-40e2-9396-88e1a3fe97f0',
    entityId: mailboxId,
  });
}

function openRecordItem(selectedEntities) {
  if (Array.isArray(selectedEntities) && selectedEntities.length > 0) {
    navigateToMailboxModernForm(selectedEntities[0]?.Id);
  }
}

async function getIsForwardMailboxEnabled() {
  const tagToMatch = 'HideNewForwardMailboxButton';

  // fetch organization settings HideNewForwardMailboxButton
  const orgSettingsXml = window.Xrm.Utility.getGlobalContext().organizationSettings.attributes.orgdborgsettings;
  const parser = new DOMParser();
  const doc = parser.parseFromString(orgSettingsXml, 'application/xml');
  const requiredNode = doc.querySelector(tagToMatch);
  const isForwardMailboxDisabledInOrg = requiredNode === null ? true : requiredNode?.textContent === 'true';

  // fetch forward mailboxes count
  const response = await window.Xrm.WebApi.retrieveMultipleRecords(
    'mailbox',
    '?$filter=isforwardmailbox eq true&$top=1',
  );
  const forwardMailboxCount = response.entities.length;

  return !isForwardMailboxDisabledInOrg || forwardMailboxCount > 0;
}

function openFolderTrackingPanel(mailboxId) {
  window.Xrm.Navigation.openDialog(
    Dialogs.FOLDER_TRACKING_RULES,
    { position: DIALOG_MODE.PANEL, height: UNSET_SIZE, width: LARGE_PANEL_WIDTH },
    {
      selected_mailbox_id: getIdsFromString(mailboxId)[0],
    },
  );
}

function getFalse() {
  return false;
}

function isGmailOauthConfigured(emailServerProfileEntity) {
  return (
    emailServerProfileEntity[ServerProfileConstants.INCOMING_CREDENTIAL_RETRIEVAL] ===
    ServerProfileConstants.GMAIL_OAUTH_CREDENTIAL_RETRIEVAL_METHOD
  );
}

async function isGmailSeverProfile(formContext) {
  const emailServerProfileEntity = await getEmailServerProfile(formContext);
  if (emailServerProfileEntity) {
    return isGmailOauthConfigured(emailServerProfileEntity);
  }

  return false;
}

function isEmailServerProfileExchange(emailServerProfile) {
  return ServerProfileConstants.SERVER_TYPE_EXCHANGE.includes(emailServerProfile[ServerProfileConstants.SERVER_TYPE]);
}

async function getEmailServerProfile(formContext) {
  const emailServerProfileAttribute = getAttribute(formContext, FormAttributes.EMAIL_SERVER_PROFILE);
  const emailServerProfileValues = emailServerProfileAttribute.getValue();
  if (emailServerProfileValues && emailServerProfileValues[0]) {
    const emailServerProfileId = getIdsFromString(emailServerProfileValues[0].id)[0];
    if (emailServerProfileId) {
      return window.Xrm.WebApi.online.retrieveRecord(
        ServerProfileConstants.EMAIL_SERVER_PROFILE_ENTITY,
        emailServerProfileId,
      );
    }
  }

  return null;
}

async function getIsFolderLevelTrackingCommandEnabled(formContext) {
  const emailServerProfileEntity = await getEmailServerProfile(formContext);
  if (emailServerProfileEntity) {
    return isEmailServerProfileExchange(emailServerProfileEntity);
  }

  return false;
}

function updateAuthToken(mailboxId, clientId) {
  const client = google.accounts.oauth2.initCodeClient({
    client_id: clientId,
    scope: 'https://mail.google.com',
    ux_mode: 'popup',
    callback: (response) => {
      const clientUrl = window.Xrm.Utility.getGlobalContext().getClientUrl();
      const serviceEndpoint = `${clientUrl}/api/data/v9.0/ExchangeGmailAuthorizationCode`;
      const body = {
        AuthCode: response.code,
        MailboxId: mailboxId,
      };
      fetch(serviceEndpoint, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'X-Requested-With': 'XmlHttpRequest',
        },
      });
    },
  });

  client.requestCode();
}

async function signInToGmail(entityId, formContext) {
  try {
    const mailboxId = getIdsFromString(entityId)[0];
    const emailServerProfile = await getEmailServerProfile(formContext);

    if (isGmailOauthConfigured(emailServerProfile)) {
      const oauthClientId = emailServerProfile[ServerProfileConstants.OAUTH_CLIENT_ID];
      updateAuthToken(mailboxId, oauthClientId);
    }
  } catch (error) {
    window.Xrm.Reporting.reportFailure('Mailbox.signInToGmail', error, '', {});
    const errorMessage = window.Xrm.Utility.getResourceString(STR_DIRECTORY, 'Mailbox.SignInToGmail.Error');
    window.Xrm.Navigation.openErrorDialog({ message: errorMessage });
  }
}

async function getMailboxIdBySystemUser(systemUserIds) {
  const valueFilter = systemUserIds.map((systemUserId) => `<value>${systemUserId}</value>`).join('');
  const fetchXml = `<fetch>
            <entity name="systemuser">
                <link-entity name='mailbox'
                  from='regardingobjectid'
                  to='systemuserid'
                  link-type='inner'
                  alias='mb'>
                  <attribute name="mailboxid" />
                </link-entity>
                <filter type="and">
                  <condition attribute="systemuserid" operator="in">
                      ${valueFilter}
                  </condition>
                </filter>
            </entity>
          </fetch>`;

  const response = await window.Xrm.WebApi.retrieveMultipleRecords('systemuser', `?fetchXml=${fetchXml}`);
  return response.entities.map((entity) => entity['mb.mailboxid']);
}

async function approveOrRejectSystemUserEmail(selectedEntities, gridControl, isApprove) {
  let dialogString = isApprove ? Dialogs.APPROVE_EMAIL : Dialogs.REJECT_EMAIL;
  const selectedEntitiesIds = getSelectedIdsFromGrid(selectedEntities, gridControl);
  if (!selectedEntitiesIds || selectedEntitiesIds.length === 0) {
    return;
  }

  const mailboxIds = await getMailboxIdBySystemUser(selectedEntitiesIds);
  if (mailboxIds && mailboxIds.length > 0) {
    openConfigurationDialog(dialogString, mailboxIds, gridControl);
  }
}

async function openMailboxFromSystemUserGrid(selectedEntities, gridControl) {
  const selectedEntitiesIds = getSelectedIdsFromGrid(selectedEntities, gridControl);
  const mailboxIds = await getMailboxIdBySystemUser(selectedEntitiesIds);
  if (mailboxIds && mailboxIds.length > 0) {
    navigateToMailboxModernForm(mailboxIds[0]);
  }
}

async function approveEmailFromSystemUserForm(systemUserId) {
  const systemUserIds = getIdsFromString(systemUserId);
  const mailboxIds = await getMailboxIdBySystemUser(systemUserIds);
  openConfigurationDialog(Dialogs.APPROVE_EMAIL, mailboxIds);
}

async function rejectEmailFromSystemUserForm(systemUserId) {
  const systemUserIds = getIdsFromString(systemUserId);
  const mailboxIds = await getMailboxIdBySystemUser(systemUserIds);
  openConfigurationDialog(Dialogs.REJECT_EMAIL, mailboxIds);
}

async function openMailboxFromSystemUserForm(systemUserId) {
  const systemUserIds = getIdsFromString(systemUserId);
  const mailboxIds = await getMailboxIdBySystemUser(systemUserIds);
  if (mailboxIds && mailboxIds.length > 0) {
    navigateToMailboxModernForm(mailboxIds[0]);
  }
}

async function getMailboxIdByQueue(queueIds) {
  const valueFilter = queueIds.map((queueId) => `<value>${queueId}</value>`).join('');
  const fetchXml = `<fetch>
            <entity name="queue">
                <link-entity name='mailbox'
                  from='regardingobjectid'
                  to='queueid'
                  link-type='inner'
                  alias='mb'>
                  <attribute name="mailboxid" />
                </link-entity>
                <filter type="and">
                  <condition attribute="queueid" operator="in">
                      ${valueFilter}
                  </condition>
                </filter>
            </entity>
          </fetch>`;

  const response = await window.Xrm.WebApi.retrieveMultipleRecords('queue', `?fetchXml=${fetchXml}`);
  return response.entities.map((entity) => entity['mb.mailboxid']);
}
async function approveEmailFromQueueForm(queueId) {
  const queueIds = getIdsFromString(queueId);
  const mailboxIds = await getMailboxIdByQueue(queueIds);
  openConfigurationDialog(Dialogs.APPROVE_EMAIL, mailboxIds);
}

async function rejectEmailFromQueueForm(queueId) {
  const queueIds = getIdsFromString(queueId);
  const mailboxIds = await getMailboxIdByQueue(queueIds);
  openConfigurationDialog(Dialogs.REJECT_EMAIL, mailboxIds);
}

async function approveEmailFromQueueGrid(selectedEntities, gridControl) {
  const queueIds = getSelectedIdsFromGrid(selectedEntities, gridControl);
  const mailboxIds = await getMailboxIdByQueue(queueIds);
  openConfigurationDialog(Dialogs.APPROVE_EMAIL, mailboxIds, gridControl);
}

async function rejectEmailFromQueueGrid(selectedEntities, gridControl) {
  const queueIds = getSelectedIdsFromGrid(selectedEntities, gridControl);
  const mailboxIds = await getMailboxIdByQueue(queueIds);
  openConfigurationDialog(Dialogs.REJECT_EMAIL, mailboxIds, gridControl);
}

async function openMailboxFromQueueGrid(selectedEntities, gridControl) {
  const queueIds = getSelectedIdsFromGrid(selectedEntities, gridControl);
  const mailboxIds = await getMailboxIdByQueue(queueIds);
  if (mailboxIds && mailboxIds.length > 0) {
    navigateToMailboxModernForm(mailboxIds[0]);
  }
}

async function openMailboxFromQueueForm(queueId) {
  const queueIds = getIdsFromString(queueId);
  const mailboxIds = await getMailboxIdByQueue(queueIds);
  if (mailboxIds && mailboxIds.length > 0) {
    navigateToMailboxModernForm(mailboxIds[0]);
  }
}

module.exports = {
  getIsForwardMailboxEnabled,
};
