/*! WARNING! Do not update this file manually! Manual update of this file is not supported and will likely lead to issues. In addition, future solution upgrades wont apply to manually edited files. */
/// <reference path="../../../../Scripts/typings/xrm/xrm.d.ts"/>
/// <reference path="ClientUtils.ts" />
var msdyn = msdyn || {};
msdyn.IoT = msdyn.IoT || {};
msdyn.IoT.openFlowTemplates = function () {
    var dialogWidth = 900;
    var dialogHeight = 750;
    var options = {
        width: dialogWidth,
        height: dialogHeight,
        position: 1 //center
    };
    var baseFlowTemplatesURL = "https://flow.microsoft.com/en-us/widgets/templates/?q=iot%20cds&pagesize=5&destination=details";
    var dialogParams = {};
    dialogParams["param_flowTemplatesURL"] = baseFlowTemplatesURL;
    var orgUniqueName = getOrgUniqueName();
    var suffix = IoTConnector.Utils.ClientUtils.getDataCenterSuffix();
    if (orgUniqueName && suffix) {
        dialogParams["param_flowTemplatesURL"] = baseFlowTemplatesURL + "&parameters.dynamicscrmonline.organizationName=" + orgUniqueName + "." + suffix;
    }
    Xrm.Navigation.openDialog("IoTFlows", options, dialogParams);
    // Get the unique name of the org.
    function getOrgUniqueName() {
        var globalContext = Xrm.Utility.getGlobalContext();
        if (globalContext && globalContext.organizationSettings) {
            return globalContext.organizationSettings.uniqueName;
        }
        else {
            return null;
        }
    }
};
