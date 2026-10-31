var OCBaseURBase;
(function (OCBaseURBase) {
    var ResourceStringProvider = (function () {
        function ResourceStringProvider() {
        }
        ResourceStringProvider.getResourceString = function (key) {
            var value = Xrm.Utility.getResourceString(ResourceStringProvider.WebResourceName, key);
            if (value === undefined || value === null) {
                value = key;
            }
            return value;
        };
        ResourceStringProvider.WebResourceName = "msdyn_Localization/Languages/OCBaseURBase";
        return ResourceStringProvider;
    }());
    OCBaseURBase.ResourceStringProvider = ResourceStringProvider;
})(OCBaseURBase || (OCBaseURBase = {}));
var OCBaseURBase;
(function (OCBaseURBase) {
    var StringProvider = (function () {
        function StringProvider() {
        }
        StringProvider.getResourceString = function (key) {
            return OCBaseURBase.ResourceStringProvider ? OCBaseURBase.ResourceStringProvider.getResourceString(key) : "*" + key + "*";
        };
        return StringProvider;
    }());
    OCBaseURBase.StringProvider = StringProvider;
})(OCBaseURBase || (OCBaseURBase = {}));
var OCBaseURBase;
(function (OCBaseURBase) {
    var msdyn_DiagnosticsCommandBarActions = (function () {
        function msdyn_DiagnosticsCommandBarActions() {
        }
        msdyn_DiagnosticsCommandBarActions.EnableDisableDiagnosticsOnLoad = function (eventContext) {
            var form = eventContext.getFormContext();
            var DialogTitleControl = form.getControl(msdyn_DiagnosticsCommandBarActions.EnableDisableDialogTitleControl);
            var attributes = form && form.data && form.data.attributes;
            var isEnableDialog = attributes && attributes.get(msdyn_DiagnosticsCommandBarActions.IsEnableDialogFormParam).getValue();
            if (isEnableDialog == null) {
            }
            else if (isEnableDialog) {
                DialogTitleControl.setLabel(OCBaseURBase.StringProvider.getResourceString(msdyn_DiagnosticsCommandBarActions.EnableDiagnosticTitleText));
            }
            else {
                DialogTitleControl.setLabel(OCBaseURBase.StringProvider.getResourceString(msdyn_DiagnosticsCommandBarActions.DisableDiagnosticTitleText));
            }
        };
        msdyn_DiagnosticsCommandBarActions.IsEnableDialogFormParam = "param_is_enable_dialog";
        msdyn_DiagnosticsCommandBarActions.OCConfigurationGuid = "d4d91600-6f21-467b-81fe-6757a2791fa1";
        msdyn_DiagnosticsCommandBarActions.EnableDiagnosticTitleText = "enableDiagnosticsTitleText";
        msdyn_DiagnosticsCommandBarActions.DisableDiagnosticTitleText = "disableDiagnosticsTitleText";
        msdyn_DiagnosticsCommandBarActions.EnableDisableDialogTitleControl = "lbl_enabledisablediagnostics";
        msdyn_DiagnosticsCommandBarActions.EnableDisableDialogName = "EnableDisableDiagnosticsDialog";
        msdyn_DiagnosticsCommandBarActions.OpenEnableDisableDiagnosticsDialog = function (isEnableCommand) {
            var dialogOptions = {
                width: 550,
                height: 380,
                position: 1
            };
            var dialogParams = {
                param_is_enable_dialog: isEnableCommand
            };
            Xrm.Navigation.openDialog(msdyn_DiagnosticsCommandBarActions.EnableDisableDialogName, dialogOptions, dialogParams);
        };
        msdyn_DiagnosticsCommandBarActions.IsDiagnosticsEnabled = function () {
            return Xrm.WebApi.retrieveRecord("msdyn_omnichannelconfiguration", msdyn_DiagnosticsCommandBarActions.OCConfigurationGuid, "?$select=msdyn_enable_unified_routing_diagnostic").then(function (configurationEntity) {
                if (configurationEntity.msdyn_enable_unified_routing_diagnostic != null) {
                    return configurationEntity.msdyn_enable_unified_routing_diagnostic;
                }
                return false;
            });
        };
        msdyn_DiagnosticsCommandBarActions.OnYesClick = function (context) {
            var form = context.getFormContext();
            var attributes = form && form.data && form.data.attributes;
            var isEnableDialog = attributes && attributes.get(msdyn_DiagnosticsCommandBarActions.IsEnableDialogFormParam).getValue();
            if (isEnableDialog != null) {
                Xrm.WebApi.updateRecord("msdyn_omnichannelconfiguration", msdyn_DiagnosticsCommandBarActions.OCConfigurationGuid, {
                    "msdyn_enable_unified_routing_diagnostic": isEnableDialog
                }).then(function () {
                    context.getFormContext().ui.refreshRibbon(true);
                    context.getFormContext().ui.close();
                });
            }
        };
        msdyn_DiagnosticsCommandBarActions.CloseDialog = function (context) {
            context.getFormContext().ui.close();
        };
        return msdyn_DiagnosticsCommandBarActions;
    }());
    OCBaseURBase.msdyn_DiagnosticsCommandBarActions = msdyn_DiagnosticsCommandBarActions;
})(OCBaseURBase || (OCBaseURBase = {}));
