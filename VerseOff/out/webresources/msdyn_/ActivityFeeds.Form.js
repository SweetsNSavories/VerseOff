Type.registerNamespace('ActivityFeeds.Form');

ActivityFeeds.Form.PostRuleConfigurationFormUtils = function ActivityFeeds_Form_PostRuleConfigurationFormUtils() {
}
ActivityFeeds.Form.PostRuleConfigurationFormUtils.hidePostToYammerIfNotConfigured = function ActivityFeeds_Form_PostRuleConfigurationFormUtils$hidePostToYammerIfNotConfigured() {
    if (!window.YAMMER_IS_CONFIGURED_FOR_ORG) {
        ActivityFeeds.Form.PostRuleConfigurationFormUtils.$0(false);
        return;
    }
    var $v_0 = Xrm.Page.data.entity.attributes.get('msdyn_postconfigid').getValue()[0].id;
    var $v_1 = new CrmSoapServiceProxy.CrmSoapService(Xrm.Page.context);
    var $v_2 = String.format('<fetch version=\'1.0\' output-format=\'xml-platform\' mapping=\'logical\' distinct=\'false\'><entity name=\'msdyn_postconfig\'><filter type=\'and\'><condition attribute=\'msdyn_postconfigid\' operator=\'eq\' value=\'{0}\'/></filter><attribute name=\'msdyn_otc\'/><attribute name=\'msdyn_entityname\'/></entity></fetch>', $v_0);
    $v_1.retrieveMultiple($v_2, CrmSoapServiceProxy.ObjectModel.PostConfig).then(function($p1_0) {
        if ($p1_0.entities.length > 0 && ActivityFeeds.Form.PostRuleConfigurationFormUtils.$1(($p1_0.entities[0]).get_entityName())) {
            ActivityFeeds.Form.PostRuleConfigurationFormUtils.$0(true);
        }
        else {
            ActivityFeeds.Form.PostRuleConfigurationFormUtils.$0(false);
        }
    }, function($p1_0) {
    });
}
ActivityFeeds.Form.PostRuleConfigurationFormUtils.$1 = function ActivityFeeds_Form_PostRuleConfigurationFormUtils$$1($p0) {
    return $p0 === 'incident' || $p0 === 'lead' || $p0 === 'opportunity' || $p0 === 'account' || $p0 === 'contact' || $p0 === 'competitor';
}
ActivityFeeds.Form.PostRuleConfigurationFormUtils.$0 = function ActivityFeeds_Form_PostRuleConfigurationFormUtils$$0($p0) {
    Xrm.Page.getControl('msdyn_posttoyammer').setVisible($p0);;
}


ActivityFeeds.Form.CustomizationUtils = function ActivityFeeds_Form_CustomizationUtils() {
}
ActivityFeeds.Form.CustomizationUtils.isRecordWallToBeHidden = function ActivityFeeds_Form_CustomizationUtils$isRecordWallToBeHidden(context) {
    if (ActivityFeeds.Form.CustomizationUtils.isOutlookV4(context) || context.client.getClientState() === 'Offline') {
        return true;
    }
    var $v_0 = Xrm.Page.ui.getFormType();
    if ($v_0 === 1 || $v_0 === 6) {
        return true;
    }
    return false;
}
ActivityFeeds.Form.CustomizationUtils.isOutlookV4 = function ActivityFeeds_Form_CustomizationUtils$isOutlookV4(context) {
    if (context.client.getClient() !== 'Outlook') {
        return false;
    }
    var $v_0 = ActivityFeeds.Form.CustomizationUtils.getCookie('LightClient');
    return !!$v_0 && $v_0.trim() !== '' && $v_0.startsWith('4');
}
ActivityFeeds.Form.CustomizationUtils.getCookie = function ActivityFeeds_Form_CustomizationUtils$getCookie(key, documentCookie) {
    if (typeof(key) === 'undefined' || !key || key === '') {
        return '';
    }
    if (typeof(documentCookie) === 'undefined' || !documentCookie) {
        documentCookie = document.cookie;
    }
    var $v_0 = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)');
    var $v_1 = $v_0.exec(documentCookie);
    if ($v_1 && $v_1.length >= 1) {
        return $v_1[1];
    }
    return '';
}
ActivityFeeds.Form.CustomizationUtils.updateRecordWallRenderingState = function ActivityFeeds_Form_CustomizationUtils$updateRecordWallRenderingState() {
    var $v_0 = Xrm.Page.context;
    var $v_1 = Xrm.Page.ui.tabs.get('tab_recordwall');
    if ($v_1) {
        if (ActivityFeeds.Form.CustomizationUtils.isRecordWallToBeHidden($v_0)) {
            $v_1.setVisible(false);
            var $v_2 = Xrm.Page.ui.tabs.get(1);
            if ($v_2) {
                $v_2.setFocus();
            }
        }
        else {
            if (!$v_1.getVisible()) {
                $v_1.setVisible(true);
            }
        }
    }
}
ActivityFeeds.Form.CustomizationUtils.showNotification = function ActivityFeeds_Form_CustomizationUtils$showNotification(encodedNotificationText) {
    Xrm.Page.ui.setFormNotification(encodedNotificationText, 'WARNING', 'UtilNotification');
}


ActivityFeeds.Form.PostConfigurationFormUtils = function ActivityFeeds_Form_PostConfigurationFormUtils() {
}
ActivityFeeds.Form.PostConfigurationFormUtils.onFormLoad = function ActivityFeeds_Form_PostConfigurationFormUtils$onFormLoad() {
    var $v_0 = Xrm.Page.ui.controls.get('msdyn_entityname');
    var $v_1 = Xrm.Page.ui.controls.get('msdyn_configurewall');
    if ($v_0) {
        if (Xrm.Page.ui.getFormType() !== 1) {
            $v_0.setDisabled(true);
            if (!$v_1.getDisabled() && $v_1.getVisible()) {
                $v_1.setFocus();
            }
        }
    }
    var $v_2 = Xrm.Page.ui.tabs.get('tab_notification');
    if (!IsNull($v_2)) {
        ActivityFeeds.Form.CustomizationUtils.showNotification($v_2.getLabel());
    }
}


ActivityFeeds.Form.PostRuleConfigurationFormUtils.registerClass('ActivityFeeds.Form.PostRuleConfigurationFormUtils');
ActivityFeeds.Form.CustomizationUtils.registerClass('ActivityFeeds.Form.CustomizationUtils');
ActivityFeeds.Form.PostConfigurationFormUtils.registerClass('ActivityFeeds.Form.PostConfigurationFormUtils');
//@ sourceMappingURL=file:///F:/dbs/el/dccm2/target/retail/amd64/bin/ActivityFeeds.Form/net48/.srcmap
