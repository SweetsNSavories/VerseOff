import json
import subprocess
from pathlib import Path


def test_documented_client_api_surface_is_exposed_and_gated():
    bridge_path = (
        Path(__file__).resolve().parents[1]
        / "VerseOff"
        / "verseoff_bridge.js"
    )
    script = r"""
const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync(__BRIDGE_PATH__, 'utf8');
const context = { console, Promise, setTimeout, clearTimeout };
context.window = context;
context.globalThis = context;
vm.runInNewContext(src, context);
context.initializeVerseOffState({
  attributes: {
    name: {
      value: 'Acme',
      initialValue: 'Acme',
      submitMode: 'dirty',
      requiredLevel: 'required',
      type: 'string',
      isEntityAttribute: true,
      dirty: false,
      maxLength: 100,
      userPrivilege: {
        canRead: true,
        canUpdate: true,
        canCreate: true
      }
    },
    new_mode: {
      value: 'compact',
      initialValue: 'compact',
      submitMode: 'never',
      requiredLevel: 'none',
      type: 'safestring',
      isEntityAttribute: false,
      dirty: false
    }
  },
  controls: {
    name: { type: 'standard', visible: true, disabled: false },
    Contacts: { type: 'subgrid', visible: true, disabled: false }
  },
  grids: {
    Contacts: {
      entityName: 'contact',
      rows: [],
      selectedIds: [],
      totalRecordCount: 0,
      viewSelectorVisible: true
    }
  },
  entity: {
    logicalName: 'account',
    id: 'account-id',
    primaryName: 'Acme'
  },
  queryParameters: { new_mode: 'compact' },
  process: {
    processes: [{
      id: 'process-1',
      name: 'Process',
      stages: [
        { id: 'stage-1', name: 'One', steps: [] },
        { id: 'stage-2', name: 'Two', steps: [] }
      ]
    }],
    activeProcessId: 'process-1',
    activeStageId: 'stage-1',
    selectedStageId: 'stage-1'
  },
  ui: {
    tabs: {
      general: {
        label: 'General',
        visible: true,
        displayState: 'expanded',
        sections: {
          details: {
            label: 'Details',
            visible: true,
            controls: ['name']
          }
        }
      }
    },
    forms: [{ id: 'form-id', label: 'Main', visible: true }],
    activeFormId: 'form-id',
    navigation: [],
    process: { visible: true, displayState: 'expanded' },
    headerSection: {
      bodyVisible: true,
      commandBarVisible: true,
      tabNavigatorVisible: true
    }
  },
  context: {
    clientUrl: 'https://org.crm.dynamics.com',
    user: {
      id: 'user-id',
      name: 'Ada',
      languageId: 1033,
      roles: []
    },
    organization: {
      id: 'org-id',
      uniqueName: 'org',
      languageId: 1033
    },
    app: {
      id: 'app-id',
      displayName: 'App',
      uniqueName: 'app'
    },
    client: {
      client: 'Web',
      state: 'Offline',
      formFactor: 1,
      networkAvailable: false
    }
  }
});

function requireMethods(object, methods, label) {
  methods.forEach(function(name) {
    if (typeof object[name] !== 'function') {
      throw new Error(label + '.' + name + ' is missing');
    }
  });
}

requireMethods(context.formContext.data, [
  'addOnLoad', 'removeOnLoad', 'getIsDirty', 'isValid', 'refresh', 'save'
], 'formContext.data');
requireMethods(context.formContext.data.entity, [
  'addOnSave', 'removeOnSave', 'addOnPostSave', 'removeOnPostSave',
  'getDataXml', 'getEntityName', 'getEntityReference', 'getId',
  'getIsDirty', 'getPrimaryAttributeValue', 'isValid', 'save'
], 'formContext.data.entity');
requireMethods(context.formContext.data.process, [
  'addOnPreProcessStatusChange', 'removeOnPreProcessStatusChange',
  'addOnProcessStatusChange', 'removeOnProcessStatusChange',
  'addOnPreStageChange', 'removeOnPreStageChange',
  'addOnStageChange', 'removeOnStageChange',
  'addOnStageSelected', 'removeOnStageSelected',
  'getActiveProcess', 'getActiveStage', 'getSelectedStage',
  'getActivePath', 'setActiveProcess', 'setActiveStage',
  'moveNext', 'movePrevious', 'getEnabledProcesses',
  'getProcessInstances', 'setActiveProcessInstance'
], 'formContext.data.process');
requireMethods(context.formContext.ui, [
  'addOnLoad', 'removeOnLoad', 'addLoaded', 'removeLoaded',
  'setFormNotification', 'clearFormNotification', 'close',
  'getFormType', 'getViewPortHeight', 'getViewPortWidth',
  'refreshRibbon', 'setFormEntityName'
], 'formContext.ui');

const attribute = context.formContext.getAttribute('name');
requireMethods(attribute, [
  'addOnChange', 'removeOnChange', 'fireOnChange', 'getAttributeType',
  'getFormat', 'getInitialValue', 'getIsDirty', 'getName', 'getParent',
  'getRequiredLevel', 'setRequiredLevel', 'getSubmitMode',
  'setSubmitMode', 'getUserPrivilege', 'getValue', 'setValue',
  'isValid', 'setIsValid', 'getOptions', 'getOption',
  'getSelectedOption', 'getText', 'getMax', 'getMin',
  'getPrecision', 'setPrecision', 'getMaxLength'
], 'attribute');
if (context.formContext.data.attributes.get('new_mode').getValue() !==
    'compact') {
  throw new Error('form parameter collection mismatch');
}
if (context.formContext.data.entity.attributes.get('new_mode') !== null) {
  throw new Error('form parameter leaked into entity attributes');
}

const control = context.formContext.getControl('name');
requireMethods(control, [
  'getName', 'getLabel', 'setLabel', 'getVisible', 'setVisible',
  'getDisabled', 'setDisabled', 'getControlType', 'getAttribute',
  'getParent', 'setFocus', 'refresh', 'addNotification',
  'setNotification', 'clearNotification', 'getOutputs'
], 'control');
const grid = context.formContext.getControl('Contacts');
requireMethods(grid, [
  'getEntityName', 'getFetchXml', 'getGrid', 'getGridType',
  'getRelationship', 'getViewSelector', 'openRelatedGrid',
  'refreshRibbon', 'addOnLoad', 'removeOnLoad',
  'addOnRecordSelect', 'removeOnRecordSelect',
  'addOnSave', 'removeOnSave'
], 'grid');
requireMethods(grid.getGrid(), [
  'getRows', 'getSelectedRows', 'getTotalRecordCount'
], 'grid.getGrid()');

const tab = context.formContext.ui.tabs.get('general');
requireMethods(tab, [
  'addTabStateChange', 'removeTabStateChange', 'getContentType',
  'setContentType', 'getDisplayState', 'setDisplayState',
  'getLabel', 'setLabel', 'getName', 'getParent',
  'getVisible', 'setVisible', 'setFocus'
], 'tab');
const section = tab.sections.get('details');
requireMethods(section, [
  'getName', 'getLabel', 'setLabel', 'getParent',
  'getVisible', 'setVisible'
], 'section');
if (section.controls.get('name') !== control) {
  throw new Error('section control collection mismatch');
}

['App', 'Copilot', 'Device', 'Encoding', 'Navigation', 'Panel',
 'Utility', 'WebApi'].forEach(function(namespace) {
  if (!context.Xrm[namespace]) {
    throw new Error('Xrm.' + namespace + ' is missing');
  }
});
requireMethods(context.Xrm.Navigation, [
  'navigateTo', 'openAlertDialog', 'openConfirmDialog',
  'openErrorDialog', 'openFile', 'openForm', 'openUrl',
  'openWebResource'
], 'Xrm.Navigation');
requireMethods(context.Xrm.Utility, [
  'closeProgressIndicator', 'getAllowedStatusTransitions',
  'getEntityMetadata', 'getEntityMainFormDescriptor',
  'getGlobalContext', 'getLearningPathAttributeName',
  'getPageContext', 'getResourceString', 'invokeProcessAction',
  'lookupObjects', 'refreshParentGrid', 'showProgressIndicator'
], 'Xrm.Utility');
requireMethods(context.Xrm.WebApi, [
  'createRecord', 'deleteRecord', 'retrieveRecord',
  'retrieveMultipleRecords', 'updateRecord', 'isAvailableOffline',
  'execute', 'executeMultiple'
], 'Xrm.WebApi');

if (context.Xrm.Encoding.htmlEncode('<x>') !== '&lt;x&gt;') {
  throw new Error('HTML encoding mismatch');
}
if (context.Xrm.Copilot.isM365CopilotEnabled() !== false) {
  throw new Error('Copilot gate mismatch');
}
if (context.GetGlobalContext().getClientUrl() !==
    'https://org.crm.dynamics.com') {
  throw new Error('global context mismatch');
}
if (context.Xrm.Utility.getPageContext().input.entityName !== 'account') {
  throw new Error('page context mismatch');
}

(async function() {
  context.formContext.data.process.addOnPreStageChange(
    function(executionContext) {
      executionContext.getEventArgs().preventDefault();
    }
  );
  const stageStatus = await new Promise(function(resolve) {
    context.formContext.data.process.moveNext(resolve);
  });
  if (stageStatus !== 'preventDefault' ||
      context.formContext.data.process.getActiveStage().getId() !==
        'stage-1') {
    throw new Error('pre-stage cancellation failed');
  }
  let rejected = false;
  try {
    await context.Xrm.WebApi.online.retrieveRecord(
      'account',
      'account-id'
    );
  } catch (error) {
    rejected = error.name === 'VerseOffUnsupportedClientApiError';
  }
  if (!rejected) {
    throw new Error('online WebApi did not fail closed');
  }
  console.log('client-api-surface-ok');
})().catch(function(error) {
  console.error(error);
  process.exit(1);
});
""".replace("__BRIDGE_PATH__", json.dumps(str(bridge_path)))

    result = subprocess.run(
        ["node", "-e", script],
        capture_output=True,
        text=True,
        timeout=30,
    )
    assert result.returncode == 0, result.stderr
    assert "client-api-surface-ok" in result.stdout
