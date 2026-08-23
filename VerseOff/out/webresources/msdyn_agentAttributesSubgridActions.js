var AgentGroupManager;
(function (AgentGroupManager) {
    var AgentLanguageDialogActions = (function () {
        function AgentLanguageDialogActions() {
        }
        AgentLanguageDialogActions.onAddExistingRegionClicked = function (primaryControl, selectedControl) {
            AgentLanguageDialogActions.openDialog(primaryControl, selectedControl, "region");
        };
        AgentLanguageDialogActions.onAddExistingLanguageClicked = function (primaryControl, selectedControl) {
            AgentLanguageDialogActions.openDialog(primaryControl, selectedControl, "language");
        };
        AgentLanguageDialogActions.openDialog = function (primaryControl, selectedControl, dialogType) {
            var dialogOptions = {
                width: 500,
                position: 2
            };
            var dialogParameters = {
                attribute_name: dialogType,
                user_id: primaryControl._entityReference.id.guid
            };
            Xrm.Navigation.openDialog(AgentLanguageDialogActions.dialogName, dialogOptions, dialogParameters).then(function () {
                selectedControl.refresh();
            });
        };
        AgentLanguageDialogActions.dialogName = "HierarchicalDropDownLanguageAndRegion";
        return AgentLanguageDialogActions;
    }());
    AgentGroupManager.AgentLanguageDialogActions = AgentLanguageDialogActions;
    var SubgridActions = (function () {
        function SubgridActions() {
        }
        SubgridActions.DisplayLangAndRegionSections = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var globalContext = (Xrm && Xrm.Utility && Xrm.Utility.getGlobalContext) ? Xrm.Utility.getGlobalContext() : null;
            var fcsValue = (globalContext && typeof globalContext.getFeatureControlSetting === 'function' ? globalContext.getFeatureControlSetting(SubgridActions.FCSKey, SubgridActions.FCSFeatureName) : false) || false;
            var omnichannelTab = formContext.ui.tabs.get("Omnichannel_TAB");
            if (omnichannelTab) {
                var languageSection = omnichannelTab.sections.get("Section_Language");
                var regionSection = omnichannelTab.sections.get("Section_Region");
                if (languageSection) {
                    languageSection.setVisible(fcsValue);
                }
                if (regionSection) {
                    regionSection.setVisible(fcsValue);
                }
            }
        };
        SubgridActions.FCSKey = "CS.ServiceManagementForRecordRouting";
        SubgridActions.FCSFeatureName = "EnableIntentBasedRouting";
        return SubgridActions;
    }());
    AgentGroupManager.SubgridActions = SubgridActions;
})(AgentGroupManager || (AgentGroupManager = {}));
