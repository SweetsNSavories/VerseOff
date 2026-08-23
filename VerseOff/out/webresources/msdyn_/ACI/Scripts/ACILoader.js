// JavaScript source code

function toggleRISections() {
    var isCrmForWeb = (Xrm.Page.context.client.getClient() !== null && Xrm.Page.context.client.getClient() === "Web")
    if (isCrmForWeb) {
        var relationshipAnalyticsTab = Xrm.Page.ui.tabs.get("RelationshipAnalytics");
        if (relationshipAnalyticsTab) {
            var relationshipAnalyticsSection = relationshipAnalyticsTab.sections.get("RelationshipAnalytics_Mobile");
            if (relationshipAnalyticsSection) {
                relationshipAnalyticsSection.setVisible(false);
            }
        }

    }
    var isCrmforMOCA = (Xrm.Page.context.client.getClient() !== null && Xrm.Page.context.client.getClient().toLowerCase() !== "web")
    if (isCrmforMOCA) {
        var relationshipAnalyticsTabForMoca = Xrm.Page.ui.tabs.get("RelationshipAnalytics");
        if (relationshipAnalyticsTabForMoca) {
            var relationshipAnalyticsSectionFormoca = relationshipAnalyticsTabForMoca.sections.get("RelationshipAnalytics_section_1");
            if (relationshipAnalyticsSectionFormoca) {
                relationshipAnalyticsSectionFormoca.setVisible(false);
            }
        }
    }
}

function checkravisibilityonload(context) {
    showRelationshipTab(Xrm.Internal.isFeatureEnabled("ActivityInsights"), context);
}

function httpPost(url, reqData) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("POST", url, true);
        request.setRequestHeader("Content-Type", "application/json");

        request.onload = () => {
            if (request.readyState == 4 && request.status == 200) {
                if (request.response != null) {
                    resolve(request.responseText);
                }
            } else {
                reject(request.statusText);
            }
        };
        request.send(reqData);
    });
}

function checkAndFocusRelationshipTab(tab) {
    try {
        var queryParams = Xrm.Utility.getGlobalContext().getQueryStringParameters();
        var shouldfocus = queryParams["ratab_focus"];
        if (shouldfocus != undefined && (shouldfocus == true || shouldfocus == "true")) {
            tab.setFocus();
        }
    }
    catch (err) {
        //LogError(err);
    }
}

function showRelationshipTab(isAAEnabled, context) {
    var plgEnabled = Xrm.Utility.getGlobalContext().getFeatureControlSetting("SalesService.RelationshipInsights", "PLG");
    var healthWidgetControl = Xrm.Page.getControl("Healthwidget");
    var relationshipAnalyticsV2Tab = Xrm.Page.ui.tabs.get("RAV2");

    if (healthWidgetControl) {
        healthWidgetControl.setVisible(false);
    }

    if (isAAEnabled) {
        try {
            if (plgEnabled) {
                relationshipAnalyticsV2Tab.setVisible(true);
                checkAndFocusRelationshipTab(relationshipAnalyticsV2Tab);
            }

            const entityType = context.getFormContext().data.entity.getEntityName();
            const form = context.getFormContext();
            const entityId = form.data.entity.getId().replace("{", "").replace("}", "");
            var isDemoData = {
                EntityType: entityType,
                EntityId: entityId,
                FeatureName: "ActivityAnalysis"
            };
            var jsonDemoData = {
                SIParameters: JSON.stringify(isDemoData)
            };
            var reqData = JSON.stringify(jsonDemoData);
            var oDataUri = window.Xrm.Page.context.getClientUrl() + "/api/data/v9.0/msdyn_GetSIFeatureConfiguration()";

            httpPost(oDataUri, reqData).then((data) => {
                // 3 indictes Activated and 7 indicate DeactivationFailed
                if (data !== null) {
                    const jsonData = JSON.parse(unescape(JSON.parse(unescape(data)).FeatureConfiguration.toString()));
                    if (jsonData.Results.IsOrgSettingEnable && ((jsonData.Results.CurrentStatus === 3) || (jsonData.Results.CurrentStatus === 7)) && relationshipAnalyticsV2Tab) {
                        relationshipAnalyticsV2Tab.setVisible(true);
                        checkAndFocusRelationshipTab(relationshipAnalyticsV2Tab);
                    }
                    if (jsonData.Results.IsOrgSettingEnable && ((jsonData.Results.CurrentStatus === 3) || (jsonData.Results.CurrentStatus === 7)) && healthWidgetControl) {
                        healthWidgetControl.setVisible(true);
                    }
                }
                else {
                    //LogError(err);
                }
            }).catch(function (error) {
                //LogError(err);
            });
        }
        catch (err) {
            //LogError(err);
        }
    }

}