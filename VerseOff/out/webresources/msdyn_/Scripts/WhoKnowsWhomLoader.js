function checkWKWVisibility(context) {
    var controlId = '';
    var entityName = context.getFormContext().entityReference.entityType;
    if (entityName == 'lead') {
        controlId = 'cc_1673878245253'
    }
    else if (entityname = 'contact') {
        controlId = 'cc_1673873754954'
    }
    var wkwControl = context.getFormContext().ui.controls.get(controlId);
    if(wkwControl){
        var wkwSection = wkwControl.getParent();
        if(wkwSection) {
            var WkwDataverseFcs = Xrm.Utility.getGlobalContext().getFeatureControlSetting("SalesService.WhoKnowsWhom", "WkwUXUseDataverseFCB");
            var WkwPlgFCS = Xrm.Utility.getGlobalContext().getFeatureControlSetting("SalesService.RelationshipInsights", "PLG");
            if (WkwDataverseFcs || WkwPlgFCS) {
                wkwSection.setVisible(true);
            }
        }
    }
}