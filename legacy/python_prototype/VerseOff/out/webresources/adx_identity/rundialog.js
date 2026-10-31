(function() {
Develop1_RibbonCommands_runDialogGrid = function(ids, objectTypeCode, dialogId) {
    if ((ids == null) || (!ids.length)) {
        alert(window.LOCID_ACTION_NOITEMSELECTED);
        return;
    }
    if (ids.length > 1) {
        alert(window.LOCID_GRID_TOO_MANY_RECORDS_IWF);
        return;
    }
    var rundialog = Mscrm.CrmUri.create('/cs/dialog/rundialog.aspx');
    rundialog.get_query()['DialogId'] = dialogId;
    rundialog.get_query()['ObjectId'] = ids[0];
    rundialog.get_query()['EntityName'] = objectTypeCode;
    window.open(rundialog,null,"width=615, height=480");
}
Develop1_RibbonCommands_runDialogForm = function(objectTypeCode, dialogId) {
    var primaryEntityId = Xrm.Page.data.entity.getId();
    var rundialog = Mscrm.CrmUri.create('/cs/dialog/rundialog.aspx');
    rundialog.get_query()['DialogId'] = dialogId;
    rundialog.get_query()['ObjectId'] = primaryEntityId;
    rundialog.get_query()['EntityName'] = objectTypeCode;
    window.open(rundialog,null,"width=615, height=480");
}

Contact_RibbonCommands_runPasswordFlowForm = function() {
    var primaryEntityId = Xrm.Page.data.entity.getId();
    Xrm.Navigation.openTaskFlow("adx_change_password", {primaryEntityContext: {id:primaryEntityId, entityType: "contact"}}) 
}

Contact_RibbonCommands_runPasswordFlowGrid = function(ids) {
    if ((ids == null) || (!ids.length)) {
        Xrm.Utility.alertDialog(window.LOCID_ACTION_NOITEMSELECTED);
        return;
    }
    if (ids.length > 1) {
        Xrm.Utility.alertDialog(window.LOCID_GRID_TOO_MANY_RECORDS_IWF);
        return;
    }    
    Xrm.Navigation.openTaskFlow("adx_change_password", {primaryEntityContext: {id:ids[0], entityType: "contact"}}) 
}

open_change_password_dialog_form = function() {
    var contactId =  Xrm.Page.data.entity.getId();
    Xrm.Navigation.openDialog("adx_Change_Password_MDD", {}, {adx_contactId: contactId.slice(1,contactId.length-1)});
}

open_change_password_dialog_grid = function(ids) {
    if ((ids == null) || (!ids.length)) {
        Xrm.Utility.alertDialog(window.LOCID_ACTION_NOITEMSELECTED);
        return;
    }
    if (ids.length > 1) {
        Xrm.Utility.alertDialog(window.LOCID_GRID_TOO_MANY_RECORDS_IWF);
        return;
    }  
    Xrm.Navigation.openDialog("adx_Change_Password_MDD", {}, {adx_contactId: ids[0]});
}

next_tab = function(eventContext) {
    var formContext = eventContext.getFormContext();
    formContext.ui.moveTo(Xrm.Page.ui.getDefaultNextPageName());
}

previous_tab = function(eventContext) {
    var formContext = eventContext.getFormContext();
    formContext.ui.movePrevious();
}

prepareRequest = function(id){
    var request = new XMLHttpRequest();
    var url = Xrm.Page.context.getClientUrl();
    request.open("PATCH", url + "/api/data/v9.0/contacts(" + id + ")" , true);
    request.setRequestHeader("Accept", "application/json");
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("OData-MaxVersion", "4.0");
    request.setRequestHeader("OData-Version", "4.0");
    return request;
}

send_request = function(req, data, formContext) {
    req.onreadystatechange = function () {
        if (req.readyState === 4) {
            Xrm.Utility.closeProgressIndicator();
            if (req.status >= 200 && req.status < 300) {
                var success_tab = "{9565e4d9-ae1b-4162-a21a-42530fbed1c9}"
                formContext.ui.moveTo(success_tab);
            } else {
                var error_tab = "{6ced1427-604c-481b-9cfa-4a3607e05f25}";
                formContext.ui.moveTo(error_tab);
            }
        }
    };
    Xrm.Utility.showProgressIndicator();
    req.send(JSON.stringify(data));
}

new_password_next_check = function(eventContext) {
    var formContext = eventContext.getFormContext();
    var newPassword = formContext.ui.controls.get("adx_identity_newpassword").getAttribute().getValue();

    if (!newPassword) {
        // Move to page 2
        next_tab(eventContext);
    } else {
        // Move to page 3
        var id = formContext.data.attributes.get("adx_contactId").getValue();
        var req = prepareRequest(id);
        var data = {
            adx_identity_newpassword: newPassword
        };
        send_request(req, data, formContext);
    }
}

remove_password_next_check = function(eventContext) {
    var formContext = eventContext.getFormContext();
    var confirmRemovePassword = formContext.ui.controls.get("adx_confirmremovepassword").getAttribute().getValue();

    if (!confirmRemovePassword) {
        // Move to page 4
        var close_tab = "{d9fd3a3c-189d-4aa4-93ee-8eae4d3b8f7b}"
        var formContext = eventContext.getFormContext();
        formContext.ui.moveTo(close_tab);
    } else {
        // Move to page 3
        var id = formContext.data.attributes.get("adx_contactId").getValue();
        var req = prepareRequest(id);
        var data = {
            adx_confirmremovepassword: true
        };
        send_request(req, data, formContext);
    }
}

close_dialog = function(eventContext) {
    var formContext = eventContext.getFormContext();
    formContext.ui.close();
}
})();