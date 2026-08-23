const WindowPosition = {
  Center: 1,
  Inline: 3,
};

const WorkflowCategory = {
  BusinessProcessFlow: 4,
};

const DialogDimensions = {
  Width: 1000,
  Height: 800,
};

const MacrosDialogParams = {
  RecordId: 'record_Id',
};

const MacrosDialogName = 'CreateMacrosMDD_v2';

const MacrosViewGuids = {
  AllMacrosViewGuid: '{012107d2-54d0-e911-a81c-000d3a6e50b0}',
  ActiveMacrosViewGuid: '{46291012-667a-ea11-a811-000d3a8d88aa}',
  InactiveMacrosViewGuid: '{97a5e446-667a-ea11-a811-000d3a8d88aa}',
};

const ProcessesFCBName = 'System.ShowModernProcessesGrid';

function isMacrosView(viewId) {
  if (
    viewId === MacrosViewGuids.AllMacrosViewGuid ||
    viewId === MacrosViewGuids.ActiveMacrosViewGuid ||
    viewId === MacrosViewGuids.InactiveMacrosViewGuid
  ) {
    return true;
  }
  return false;
}

function isShowModernProcessesGridEnabled() {
  let isProcessesFCBOn = false;
  let isUciView = window.Xrm.Internal.isUci();

  // check if the feature flag is enabled for the selected entity 'workflow' and in UCI
  if (isUciView) {
    isProcessesFCBOn = window.Xrm.Internal.isFeatureEnabled(ProcessesFCBName);
    return isProcessesFCBOn;
  }

  return isProcessesFCBOn;
}

function isNewRecordRibbonVisible(selectedControl) {
  const viewId = selectedControl.getViewSelector().getCurrentView().id.toLowerCase();
  return !isMacrosView(viewId);
}

function newRecordHandler() {
  if (isShowModernProcessesGridEnabled()) {
    openNewProcessDialogHandler();
  } else {
    let entityFormOptions = {
      entityName: 'workflow',
    };

    window.Xrm.Navigation.openForm(entityFormOptions); // Calling the handler function for opening processes for legacy view  }
  }
}

function openNewProcessDialogHandler() {
  let hostUrl = new URL(window.Xrm.Utility.getGlobalContext().getClientUrl());
  let createProcessDialogUrl = '';

  if (hostUrl != null && hostUrl.origin != null) {
    createProcessDialogUrl =
      hostUrl.origin + '/sfa/workflow/workflowTemplate/workflowTemplatePage.aspx?origin=&dType=1';
    const createDialogOptions = {
      height: DialogDimensions.Height,
      width: DialogDimensions.Width,
      position: WindowPosition.Center,
    };

    // Opening the Create Process legacy Dialog inline to create process of type (BPF, Workflow, Action, Dialog)
    window.Xrm.Internal.openLegacyWebDialog(createProcessDialogUrl, createDialogOptions, null, null, null);
  }
}

function openRecordHandler(selectedControlSelectedItemReferences, selectedControl) {
  // Get the Current View ID
  let viewSelector = selectedControl.getViewSelector();
  let viewId = viewSelector.getCurrentView().id.toLowerCase();

  // Get the Currently Selected Record ID
  const selectedRecordGuid = selectedControlSelectedItemReferences[0].Id;

  if (isMacrosView(viewId)) {
    openRecordMacrosHandler(selectedRecordGuid); // Calling the handler function for opening macros dialog
  } else if (isShowModernProcessesGridEnabled()) {
    openRecordProcessHandler(selectedControlSelectedItemReferences, selectedControl);
  } else {
    let entityFormOptions = {
      entityName: 'workflow',
      entityId: selectedRecordGuid,
    };

    window.Xrm.Navigation.openForm(entityFormOptions); // Calling the handler function for opening processes for legacy view
  }
}

function openRecordProcessHandler(selectedEntities, gridControl) {
  let hostUrl = new URL(window.Xrm.Utility.getGlobalContext().getClientUrl());
  let selectedRecordId = selectedEntities[0].Id;

  const openDialogOptions = {
    height: DialogDimensions.Height,
    width: DialogDimensions.Width,
    position: WindowPosition.Center,
  };

  if (hostUrl != null && hostUrl.origin != null && selectedRecordId != null) {
    let openProcessDialogUrl = hostUrl.origin + '/sfa/workflow/edit.aspx?id=' + selectedRecordId;
    // fetching the category field value for the selected record
    let selectedRowDetails = gridControl.getGrid().getSelectedRows().get()[0];
    let processesFormContext = selectedRowDetails._ui._formContext;
    let categoryFieldValue = null;

    // Check if processesFormContext is available and get category value
    if (processesFormContext) {
      var categoryAttribute = processesFormContext.getAttribute('category');
      if (categoryAttribute != null) {
        categoryFieldValue = categoryAttribute.getValue();

        if (categoryFieldValue != null && categoryFieldValue === WorkflowCategory.BusinessProcessFlow) {
          window.Xrm.Navigation.openUrl(openProcessDialogUrl, openDialogOptions); // redirection legacy designer as pop-up dialog for Processes of type BPF
        } else {
          window.Xrm.Internal.openLegacyWebDialog(openProcessDialogUrl, openDialogOptions, null, null, null); // redirection inline designer page for Processes of type Workflow, Action, and Dialog
        }
      }
    }
  }
}

function openRecordMacrosHandler(recordId) {
  let vpHeight = window.Xrm.Page.ui.getViewPortHeight();
  let vpWidth = window.Xrm.Page.ui.getViewPortWidth();
  const dialogOptions = {
    width: vpWidth,
    height: vpHeight,
    position: WindowPosition.Inline,
  };

  const dialogParams = {};
  dialogParams[MacrosDialogParams.RecordId] = recordId;
  window.Xrm.Navigation.openDialog(MacrosDialogName, dialogOptions, dialogParams);
}
