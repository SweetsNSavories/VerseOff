/* eslint no-restricted-globals: 0 */
function HideButtonInDialogOnly() {
    // Checking if it's a dialog
    var isDialog = parent?.Xrm?.Page?.ui?.isDialog();
    // Hiding button if it's in a dialog and showing button in grid view
    return !isDialog;
}

function ShowOnlyInModernPersonalSettingsDialog() {
    // Checking if it's dialog
    var isDialog = parent?.Xrm?.Page?.ui?.isDialog();
    // showing button if it's in dialog and hiding button in homepage grid
    return isDialog;
}

// Email Signature New button - to open new record form in new window
function OpenNewSignatureFormInNewWindow(selectedEntityTypeName) {
    var recordUrl = Xrm.Utility.getGlobalContext().getClientUrl() + "/main.aspx?etn=" + selectedEntityTypeName + "&pagetype=entityrecord&navbar=off";
    OpenInNewWindow(recordUrl);
}

// Edit button - to open edit form in new window
function openEditFormInNewWindow(selectedItemIds, selectedEntityTypeName) {
    if (selectedItemIds && selectedItemIds.length > 0) {
        var recordId = selectedItemIds[0];
        var recordUrl = Xrm.Utility.getGlobalContext().getClientUrl() + "/main.aspx?etn=" + selectedEntityTypeName + "&id=" + recordId + "&pagetype=entityrecord&navbar=off";
        OpenInNewWindow(recordUrl);
    }
}

function OpenInNewWindow(recordUrl) {
    window.open(recordUrl, '_blank', 'resizable=yes,scrollbars=yes,status=yes');
    return;
}