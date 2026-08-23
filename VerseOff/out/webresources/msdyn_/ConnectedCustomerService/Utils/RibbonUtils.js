/*! WARNING! Do not update this file manually! Manual update of this file is not supported and will likely lead to issues. In addition, future solution upgrades wont apply to manually edited files. */
var msdyn = msdyn || {};
msdyn.RibbonUtils = msdyn.RibbonUtils || {};
msdyn.RibbonUtils.CCS = msdyn.RibbonUtils.CCS || {};
msdyn.RibbonUtils.CCS.isNullOrEmpty = function (entity) {
    return !(entity && entity.length > 0);
};
// Used for the onChange event of a field on form.
// executionFormContext = the execution form context of the form.
msdyn.RibbonUtils.CCS.refreshRibbonFnFromExecutionFormContext = function (executionFormContext) {
    executionFormContext.getFormContext().ui.refreshRibbon(false);
};
msdyn.RibbonUtils.CCS.checkPrivilege = function (userId, privilegeName) {
    return new Promise(function (resolve, reject) {
        var url = Xrm.Page.context.getClientUrl();
        var res;
        var req = new XMLHttpRequest();
        req.open("GET", url + "/api/data/v9.0/systemusers(" + userId + ")/Microsoft.Dynamics.CRM.RetrieveUserPrivilegeByPrivilegeName(PrivilegeName='" + privilegeName + "')");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 200 || this.status == 204) {
                    res = JSON.parse(this.response);
                    resolve(res);
                }
                else {
                    reject();
                }
            }
        };
        req.send(window.JSON.stringify());
    });
};
