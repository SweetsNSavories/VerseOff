var OfficeProductivity;
(function (OfficeProductivity) {
    "use strict";
    /**
     * File for common constants in Ribbon Rules and Ribbon Commands.
     */
    var Constants;
    (function (Constants) {
        /**
         * Feature Constant.
         */
        var FeatureConstant;
        (function (FeatureConstant) {
            FeatureConstant.OrgSettingMSTeamsIntegrationEnabled = "ismsteamsenabled";
        })(FeatureConstant = Constants.FeatureConstant || (Constants.FeatureConstant = {}));
        /**
         * Feature Control Setting (FCS) Constants.
         */
        var FcsNames;
        (function (FcsNames) {
            FcsNames.MSTeamsChannelCollaborationNamespace = "DynamicsTeamsIntegration.TeamsChannelCollaboration";
            FcsNames.DisableChannelIntegrationFCS = "DisableChannelIntegration";
        })(FcsNames = Constants.FcsNames || (Constants.FcsNames = {}));
        /**
         * Telemetry Constants.
         */
        var TelemetryConstant;
        (function (TelemetryConstant) {
            TelemetryConstant.EventName = "EventName";
            TelemetryConstant.StartTime = "StartTime";
            TelemetryConstant.EndTime = "EndTime";
            TelemetryConstant.ExecutionTime = "ExecutionTime";
            TelemetryConstant.EventErrorCount = "ErrorCount";
            TelemetryConstant.EventErrorMessage = "ErrorMessage";
            TelemetryConstant.NoLinkedRecords = "NumberOfLinkedRecords";
            TelemetryConstant.OpenedDialogType = "DialogType";
            TelemetryConstant.MultiChannel = "MultiChannel";
            TelemetryConstant.NoChannel = "NoChannel";
            /* Event Constants */
            TelemetryConstant.EventTeamsButtonClicked = "MsTeamsIntegration.GetStartedButtonClicked";
            TelemetryConstant.EventTeamsCommandClicked = "MsTeamsIntegration.CollaborationRibbonCommandClicked";
            TelemetryConstant.EventTeamsLearnMoreLinkClicked = "MsTeamsIntegration.LearnMoreLinkClicked";
            TelemetryConstant.EventTeamsGridItemClicked = "MsTeamsIntegration.MultiChannelGridItemClicked";
            TelemetryConstant.ComponentName = "ComponentName";
            TelemetryConstant.NoChannelMdd = "NoChannelMDD";
        })(TelemetryConstant = Constants.TelemetryConstant || (Constants.TelemetryConstant = {}));
    })(Constants = OfficeProductivity.Constants || (OfficeProductivity.Constants = {}));
})(OfficeProductivity || (OfficeProductivity = {}));
var OfficeProductivity;
(function (OfficeProductivity) {
    "use strict";
    var DialogUtility = (function () {
        function DialogUtility() {
        }
        DialogUtility.showDialog = function (isMultiChannel, entityId, entityName, entityTypeCode, entitiesLength, telemetryEvent, ownerShipType, teamsRecordDetails) {
            if (!isMultiChannel) {
                this.setupNoChannelDialog(entityId, entityName, entityTypeCode, ownerShipType);
            }
            else {
                this.setupMultiChannelDialog(entityId, entityName, entityTypeCode, entitiesLength, ownerShipType, teamsRecordDetails);
            }
            Xrm.Navigation.openDialog(this.dialogName, this.dialogOptions, this.dialogParams).catch(OfficeProductivity.Util.CreateErrorResponseHandler(telemetryEvent, OfficeProductivity.Util.getResourceString(OfficeProductivity.Constants.ResourceKeys.ClientGenericErrorMessage), "Failed to open dialog"));
        };
        DialogUtility.setupNoChannelDialog = function (entityId, entityName, entityTypeCode, ownerShipType) {
            this.dialogName = OfficeProductivity.Constants.DialogNames.NoChannelLinkedDialogName;
            this.dialogOptions = {
                height: 723,
                width: 700,
                position: 1 /* center */,
            };
            this.dialogParams[OfficeProductivity.Constants.DialogParameters.ParamEntityTypeCode] = entityTypeCode.toString();
            this.dialogParams[OfficeProductivity.Constants.DialogParameters.ParamEntityId] = entityId;
            this.dialogParams[OfficeProductivity.Constants.DialogParameters.ParamEntityName] = entityName;
            this.dialogParams[OfficeProductivity.Constants.DialogParameters.ParamPreviousTabId] =
                OfficeProductivity.Constants.TabNames.NoChannelGetStartedInTeamsTabId;
            this.dialogParams[OfficeProductivity.Constants.DialogParameters.ParamOwnershipType] = ownerShipType;
            this.dialogParams[OfficeProductivity.Constants.DialogParameters.ParamNextTabId] =
                OfficeProductivity.Constants.TabNames.MSTeamsCompositeControlTabIdNoChannel;
        };
        DialogUtility.setupMultiChannelDialog = function (entityId, entityName, entityTypeCode, entitiesLength, ownerShipType, teamsRecordDetails) {
            var dialogHeight = 723;
            this.dialogName = OfficeProductivity.Constants.DialogNames.MultiChannelLinkedDialogName;
            this.dialogOptions = {
                width: 700,
                height: dialogHeight,
                position: 1 /* center */,
            };
            this.dialogParams[OfficeProductivity.Constants.DialogParameters.ParamEntityTypeCode] = entityTypeCode.toString();
            this.dialogParams[OfficeProductivity.Constants.DialogParameters.ParamEntityId] = entityId;
            this.dialogParams[OfficeProductivity.Constants.DialogParameters.ParamEntityName] = entityName;
            this.dialogParams[OfficeProductivity.Constants.DialogParameters.ParamPreviousTabId] =
                OfficeProductivity.Constants.TabNames.MultiChannelGetStartedInTeamsTabId;
            this.dialogParams[OfficeProductivity.Constants.DialogParameters.ParamOwnershipType] = ownerShipType;
            this.dialogParams[OfficeProductivity.Constants.DialogParameters.ParamTeamsRecord] = JSON.stringify(teamsRecordDetails);
            this.dialogParams[OfficeProductivity.Constants.DialogParameters.ParamNextTabId] =
                OfficeProductivity.Constants.TabNames.MSTeamsCompositeControlTabIdNestedLink;
        };
        /**
         * Function used to move to Previous page
         * @param eventContext input to this method of type formcontext
         */
        DialogUtility.CloseDialog = function (eventContext) {
            var context = eventContext.getFormContext();
            context.ui.close();
        };
        return DialogUtility;
    }());
    DialogUtility.dialogParams = {};
    OfficeProductivity.DialogUtility = DialogUtility;
})(OfficeProductivity || (OfficeProductivity = {}));
var OfficeProductivity;
(function (OfficeProductivity) {
    "use strict";
    /**
     * File for keeping constants specific to Ribbon Commands.
     */
    var Constants;
    (function (Constants) {
        /**
         * Attribute names.
         */
        var AttributeNames;
        (function (AttributeNames) {
            AttributeNames.TeamName = "msdyn_teamname";
            AttributeNames.ChannelId = "msdyn_channelid";
            AttributeNames.ChannelType = "msdyn_channeltype";
            AttributeNames.GroupId = "msdyn_groupid";
            AttributeNames.TenantId = "msdyn_tenantid";
            AttributeNames.ContentUrl = "msdyn_contenturl";
            AttributeNames.WebUrl = "msdyn_weburl";
            AttributeNames.AppId = "msdyn_appid";
            AttributeNames.PipedEntityID = "msdyn_pipedentityid";
            AttributeNames.ChannelName = "msdyn_channelname";
        })(AttributeNames = Constants.AttributeNames || (Constants.AttributeNames = {}));
        var CollabSpacesAttributesNames;
        (function (CollabSpacesAttributesNames) {
            CollabSpacesAttributesNames.Id = "msdyn_collabspaceteamassociationid";
            CollabSpacesAttributesNames.CrmRecordId = "msdyn_crmrecordid";
            CollabSpacesAttributesNames.CrmRecordType = "msdyn_crmrecordtype";
            CollabSpacesAttributesNames.CrmType = "msdyn_crmtype";
            CollabSpacesAttributesNames.TeamWebUrl = "msdyn_teamweburl";
            CollabSpacesAttributesNames.DataJson = "msdyn_data";
            CollabSpacesAttributesNames.TeamName = "msdyn_name";
            CollabSpacesAttributesNames.TeamId = "msdyn_teamid";
            CollabSpacesAttributesNames.Version = "msdyn_dataversion";
            CollabSpacesAttributesNames.CreatedOn = "createdon";
            CollabSpacesAttributesNames.ModifiedOn = "modifiedon";
        })(CollabSpacesAttributesNames = Constants.CollabSpacesAttributesNames || (Constants.CollabSpacesAttributesNames = {}));
        /**
         * Control names on dialog/form.
         */
        var Controls;
        (function (Controls) {
            Controls.MultiChannelDialogGridControl = "teamscollaboration_grid";
        })(Controls = Constants.Controls || (Constants.Controls = {}));
        /**
         * Names of the dialogs.
         */
        var DialogNames;
        (function (DialogNames) {
            DialogNames.NoChannelLinkedDialogName = "NoChannelMDD";
            DialogNames.MultiChannelLinkedDialogName = "MsTeamsMultiChannelDialog";
        })(DialogNames = Constants.DialogNames || (Constants.DialogNames = {}));
        /**
         * Parameters to be passed to dialogs.
         */
        var DialogParameters;
        (function (DialogParameters) {
            DialogParameters.ParamEntityName = "param_entityName";
            DialogParameters.ParamEntityId = "param_entityId";
            DialogParameters.ParamEntityTypeCode = "param_entityTypeCode";
            DialogParameters.ParamPreviousTabId = "param_previousTabId";
            DialogParameters.ParamOwnershipType = "param_ownerShipType";
            DialogParameters.ParamTeamsRecord = "param_teamsRecord";
            DialogParameters.ParamNextTabId = "param_nextTabId";
        })(DialogParameters = Constants.DialogParameters || (Constants.DialogParameters = {}));
        /**
         * Logical entity names.
         */
        var EntityNames;
        (function (EntityNames) {
            EntityNames.TeamsCollaborationEntity = "msdyn_teamscollaboration";
            EntityNames.CollabSpaceTeamsAssociationsEntity = "msdyn_collabspaceteamassociation";
        })(EntityNames = Constants.EntityNames || (Constants.EntityNames = {}));
        /**
         * Keys for strings in OfficeProductivity.1033.resx.
         */
        var ResourceKeys;
        (function (ResourceKeys) {
            ResourceKeys.ClientGenericErrorMessage = "ClientGenericErrorMessage";
        })(ResourceKeys = Constants.ResourceKeys || (Constants.ResourceKeys = {}));
        /**
         * Names of the Tabs/Screen.
         */
        var TabNames;
        (function (TabNames) {
            TabNames.GetStartedInTeamsTab = "GetStartedInTeamsTab";
            TabNames.SelectTeamTab = "SelectTeamTab";
            TabNames.SelectChannelTab = "SelectChannelTab";
            TabNames.CreateTeamTab = "CreateTeamTab";
            TabNames.MSTeamsCompositeControlTabIdNoChannel = "{660bf336-8f74-4ce4-8288-4c8b14a7a069}";
            TabNames.MSTeamsCompositeControlTabIdNestedLink = "{8fbc7d0f-725e-4b1c-aa98-8dd1172fd678}";
            TabNames.NoChannelGetStartedInTeamsTabId = "{a67a475d-2e57-49ab-8d62-28140b0a0e8f}";
            TabNames.MultiChannelGetStartedInTeamsTabId = "{A7C3E8C5-6520-45AB-8E91-CA7D449BA573}";
        })(TabNames = Constants.TabNames || (Constants.TabNames = {}));
        var FcbNames;
        (function (FcbNames) {
            FcbNames.ShowVivaSalesChannelsInLegacyScenarios = "ShowVivaSalesChannelsInLegacyScenarios";
        })(FcbNames = Constants.FcbNames || (Constants.FcbNames = {}));
    })(Constants = OfficeProductivity.Constants || (OfficeProductivity.Constants = {}));
})(OfficeProductivity || (OfficeProductivity = {}));
var OfficeProductivity;
(function (OfficeProductivity) {
    "use strict";
    /**
     * Utility class for web resources
     */
    var Util = (function () {
        function Util() {
        }
        /**
         * Creates a delegate method for error handling with current Telemtry event
         * @param event
         * @param message
         */
        Util.CreateErrorResponseHandler = function (event, clientMessage, debugMessage, suggestedMitigation) {
            return function (error) {
                if (event) {
                    var errorMessage = JSON.stringify(error);
                    OfficeProductivity.Telemetry.addErrorEventParameter(event, errorMessage);
                    OfficeProductivity.Telemetry.reportErrorEvent(event, debugMessage, suggestedMitigation);
                }
                Util.HanldeErrorResponse(error, clientMessage);
            };
        };
        /**
         * Generic handler for error response in SDK call to Dynaimcs server
         * @param error
         */
        Util.HanldeErrorResponse = function (error, clientMessage) {
            if (clientMessage) {
                error.message = clientMessage;
            }
            Xrm.Navigation.openErrorDialog(error);
        };
        /**
         * Format GUID to be used in Xrm SDK calls
         * @param id GUID to be formatted
         */
        Util.FormatId = function (id) {
            if (id) {
                id = id.replace("{", "").replace("}", "");
            }
            return id;
        };
        /**
         * Wrapper for getting resource string from OfficeProductivity.<lcid>.resx files
         * The <lcid> is picked up based on user/org setting
         * @param key The key of the resource string to be fetched
         * @param webResourceName (optional) the name of resx file in which the key is present
         *			The name should be without <lcid>.resx suffix. It will be handled by this function
         */
        Util.getResourceString = function (key, webResourceName) {
            if (webResourceName === void 0) { webResourceName = Util.CommonWebResource; }
            return Xrm.Utility.getResourceString(webResourceName, key);
        };
        /**
         * Utility to check if the Feature MS Teams INtegration turned on at ORG level
         * returns true if org setting is 1
         * */
        Util.IsMSTeamsIntegrationEnabledAtOrgLevel = function () {
            return Xrm.Utility.getGlobalContext().organizationSettings.attributes[OfficeProductivity.Constants.FeatureConstant.OrgSettingMSTeamsIntegrationEnabled] == 0
                ? false
                : true;
        };
        return Util;
    }());
    Util.CommonWebResource = "msdyn_/OfficeProductivity/Resources/OfficeProductivity";
    OfficeProductivity.Util = Util;
})(OfficeProductivity || (OfficeProductivity = {}));
var OfficeProductivity;
(function (OfficeProductivity) {
    "use strict";
    var MultiChannelDialog = (function () {
        function MultiChannelDialog() {
        }
        /**
         * On load function for Multi channel dialog
         * Sets the filter of regarding object & type code on Grid
         * @param eventContext
         */
        MultiChannelDialog.OnLoad = function (eventContext) {
            var formContext = eventContext.getFormContext();
            var entityId = (formContext.data.attributes.get(OfficeProductivity.Constants.DialogParameters.ParamEntityId)).getValue();
            var entityName = (formContext.data.attributes.get(OfficeProductivity.Constants.DialogParameters.ParamEntityName)).getValue();
            var gridControl = formContext.getControl(OfficeProductivity.Constants.Controls.MultiChannelDialogGridControl);
            //TODO: Need to remove this code and related code
            //this.setGridParameters(entityId, entityName, gridControl);
        };
        MultiChannelDialog.setGridParameters = function (entityId, entityName, gridControl) {
            var filterXml = '<filter type="and">' +
                ("<condition attribute=\"regardingobjectid\" operator=\"eq\" value=\"" + OfficeProductivity.Util.FormatId(entityId) + "\" />") +
                ("<condition attribute=\"regardingobjecttypename\" operator=\"eq\" value=\"" + entityName + "\" />") +
                "</filter>";
            gridControl.setFilterXml(filterXml);
            gridControl.refresh();
        };
        /**
         * Handler for button
         * Takes user to MS teams with deep link of Dynamics app
         * @param eventContext
         */
        MultiChannelDialog.OpenDynamicsAppInMsTeams = function (eventContext) {
            // add telemtery event to report this activity
            var telemetryEvent = OfficeProductivity.Telemetry.createEvent(OfficeProductivity.Constants.TelemetryConstant.EventTeamsButtonClicked);
            OfficeProductivity.Telemetry.addEventParameter(telemetryEvent, OfficeProductivity.Constants.TelemetryConstant.ComponentName, OfficeProductivity.Constants.TelemetryConstant.NoChannelMdd);
            OfficeProductivity.Telemetry.reportActivityEvent(telemetryEvent, OfficeProductivity.Constants.TelemetryConstant.EventTeamsButtonClicked);
            // TODO: read APP ID from webresource/Geo DB
            Xrm.Navigation.openUrl("https://teams.microsoft.com/l/app/cd2d8695-bdc9-4d8e-9620-cc963ed81f41");
            OfficeProductivity.DialogUtility.CloseDialog(eventContext);
        };
        return MultiChannelDialog;
    }());
    OfficeProductivity.MultiChannelDialog = MultiChannelDialog;
})(OfficeProductivity || (OfficeProductivity = {}));
var OfficeProductivity;
(function (OfficeProductivity) {
    "use strict";
    /**
     * Class for implemenation of ribbon commands
     */
    var RibbonCommands = (function () {
        function RibbonCommands() {
        }
        /**
         * Ribbon command to show MS teams integration dialog
         * @param formContext
         */
        RibbonCommands.showMSTeamsCollaborateDialog = function (formContext, entityTypeCode) {
            var telemetryEvent = OfficeProductivity.Telemetry.createEvent(OfficeProductivity.Constants.TelemetryConstant.EventTeamsCommandClicked);
            var entityId = OfficeProductivity.Util.FormatId(formContext.data.entity.getId());
            var entityName = formContext.data.entity.getEntityName();
            var promises = [];
            promises.push(Xrm.Utility.getEntityMetadata(formContext.data.entity.getEntityName()));
            promises.push(Xrm.WebApi.retrieveMultipleRecords(OfficeProductivity.Constants.EntityNames.TeamsCollaborationEntity, "?$filter=regardingobjectid eq " + entityId + " and regardingobjecttypename eq '" + entityName + "'" +
                ("&$select=msdyn_teamscollaborationid,\n\t\t\t\t" + OfficeProductivity.Constants.AttributeNames.ChannelName + ",\n\t\t\t\t" + OfficeProductivity.Constants.AttributeNames.TeamName + ",\n\t\t\t\t" + OfficeProductivity.Constants.AttributeNames.ChannelId + ",\n\t\t\t\t" + OfficeProductivity.Constants.AttributeNames.ChannelType + ",\n\t\t\t\t" + OfficeProductivity.Constants.AttributeNames.TenantId + ",\n\t\t\t\t" + OfficeProductivity.Constants.AttributeNames.GroupId + ",\n\t\t\t\t" + OfficeProductivity.Constants.AttributeNames.ContentUrl + ",\n\t\t\t\t" + OfficeProductivity.Constants.AttributeNames.WebUrl + ",\n\t\t\t\t" + OfficeProductivity.Constants.AttributeNames.AppId + ",\n\t\t\t\t" + OfficeProductivity.Constants.AttributeNames.PipedEntityID)));
            var showSales = Xrm.Internal.isFeatureEnabled(OfficeProductivity.Constants.FcbNames.ShowVivaSalesChannelsInLegacyScenarios);
            if (showSales) {
                promises.push(this.getSalesEntities(entityId, entityName, telemetryEvent));
            }
            Promise.all(promises)
                .then(function (values) {
                var isMultiChannel = false;
                var entityOwnerShipType = values[0].OwnershipType;
                var entities = values[1].entities;
                if (values.length > 2) {
                    entities = entities.concat(values[2]);
                }
                var entitiesLength = entities.length;
                if (entities.length > 0) {
                    // If multilple entities are linked
                    isMultiChannel = true;
                }
                OfficeProductivity.DialogUtility.showDialog(isMultiChannel, entityId, entityName, entityTypeCode, entitiesLength, telemetryEvent, entityOwnerShipType, entities);
                OfficeProductivity.Telemetry.addEventParameter(telemetryEvent, OfficeProductivity.Constants.TelemetryConstant.NoLinkedRecords, entitiesLength);
                OfficeProductivity.Telemetry.addEventParameter(telemetryEvent, OfficeProductivity.Constants.TelemetryConstant.OpenedDialogType, isMultiChannel
                    ? OfficeProductivity.Constants.TelemetryConstant.MultiChannel
                    : OfficeProductivity.Constants.TelemetryConstant.NoChannel);
                OfficeProductivity.Telemetry.reportActivityEvent(telemetryEvent, OfficeProductivity.Constants.TelemetryConstant.EventTeamsCommandClicked);
            })
                .catch(OfficeProductivity.Util.CreateErrorResponseHandler(telemetryEvent, OfficeProductivity.Util.getResourceString(OfficeProductivity.Constants.ResourceKeys.ClientGenericErrorMessage), "Failed to fetch records linked to entity"));
        };
        /**
         * Open MS teams channel corresponding to collaboration record in Teams app
         * Work around implementation which fetches record from database since gridControl is coming as undefined
         * @param entityIds
         * @param gridControl
         */
        RibbonCommands.TeamsCollaborationOpenRecord = function (entityIds, gridControl) {
            var entityId = OfficeProductivity.Util.FormatId(entityIds[0]);
            // add telemtery event to report this activity
            var telemetryEvent = OfficeProductivity.Telemetry.createEvent(OfficeProductivity.Constants.TelemetryConstant.EventTeamsGridItemClicked);
            // Implementation should look like following commented out text
            /**
             * let rows: XrmClientApi.Collection.ItemCollection<XrmClientApi.Grid.GridRow> = gridControl.getGrid().getRows();
             * let selectedRow: any = rows.get(entityId);
             * let rowAttributes: XrmClientApi.Collection.ItemCollection<XrmClientApi.Attributes.Attribute> = selectedRow.data.entity.attributes;
             * let channelId: string = encodeURIComponent(rowAttributes.get(Constants.AttributeNames.ChannelId).getValue());
             * let tenantId: string = encodeURIComponent(rowAttributes.get(Constants.AttributeNames.TenantId).getValue());
             * let groupId: string = encodeURIComponent(rowAttributes.get(Constants.AttributeNames.GroupId).getValue());
             */
            // Instead retrieving record from Database and using the attributes
            Xrm.WebApi.retrieveRecord(OfficeProductivity.Constants.EntityNames.TeamsCollaborationEntity, entityId, "?$select=" + OfficeProductivity.Constants.AttributeNames.ChannelId + "," + OfficeProductivity.Constants.AttributeNames.TenantId + "," + OfficeProductivity.Constants.AttributeNames.GroupId + "," + OfficeProductivity.Constants.AttributeNames.ChannelName)
                .then(function (entity) {
                var channelId = encodeURIComponent(entity[OfficeProductivity.Constants.AttributeNames.ChannelId]);
                var tenantId = encodeURIComponent(entity[OfficeProductivity.Constants.AttributeNames.TenantId]);
                var groupId = encodeURIComponent(entity[OfficeProductivity.Constants.AttributeNames.GroupId]);
                var channelName = encodeURIComponent(entity[OfficeProductivity.Constants.AttributeNames.ChannelName]);
                var channelDeepLink = "https://teams.microsoft.com/l/channel/" + channelId + "/" + channelName + "?groupId=" + groupId + "&tenantId=" + tenantId;
                OfficeProductivity.Telemetry.reportActivityEvent(telemetryEvent, OfficeProductivity.Constants.TelemetryConstant.EventTeamsGridItemClicked);
                Xrm.Navigation.openUrl(channelDeepLink);
            })
                .catch(OfficeProductivity.Util.CreateErrorResponseHandler(telemetryEvent, OfficeProductivity.Util.getResourceString(OfficeProductivity.Constants.ResourceKeys.ClientGenericErrorMessage), "Failed to fetch record to open"));
        };
        /**
         * Ribbon command to show MS teams integration dialog
         * @param formContext
         */
        RibbonCommands.showMSTeamsViewCollaborateDialog = function (formContext) {
            var telemetryEvent = OfficeProductivity.Telemetry.createEvent(OfficeProductivity.Constants.TelemetryConstant.EventTeamsCommandClicked);
            var viewId = OfficeProductivity.Util.FormatId(formContext.getViewSelector().getCurrentView().id);
            var viewType = formContext.getEntityName(); // "savedquery";
            var entityTypeCode = 1039;
            var view = formContext.getViewSelector().getCurrentView().entityType; //value for the view can be either "savedquery" or "userquery"
            if (view === "userquery") {
                entityTypeCode = 4230;
            }
            var promises = [];
            promises.push(Xrm.Utility.getEntityMetadata(formContext.getViewSelector().getCurrentView().entityType));
            promises.push(Xrm.WebApi.retrieveMultipleRecords(OfficeProductivity.Constants.EntityNames.TeamsCollaborationEntity, "?$filter=regardingobjectid eq " + viewId + " and regardingobjecttypecode eq " + entityTypeCode +
                ("&$select=msdyn_teamscollaborationid," + OfficeProductivity.Constants.AttributeNames.ChannelName + "," + OfficeProductivity.Constants.AttributeNames.TeamName + "," + OfficeProductivity.Constants.AttributeNames.ChannelId + "," + OfficeProductivity.Constants.AttributeNames.TenantId + "," + OfficeProductivity.Constants.AttributeNames.GroupId + "," + OfficeProductivity.Constants.AttributeNames.ContentUrl + "," + OfficeProductivity.Constants.AttributeNames.WebUrl + "," + OfficeProductivity.Constants.AttributeNames.AppId + "," + OfficeProductivity.Constants.AttributeNames.PipedEntityID)));
            var showSales = Xrm.Internal.isFeatureEnabled(OfficeProductivity.Constants.FcbNames.ShowVivaSalesChannelsInLegacyScenarios);
            if (showSales) {
                promises.push(this.getSalesEntities(viewId, "" + entityTypeCode, telemetryEvent));
            }
            Promise.all(promises)
                .then(function (values) {
                var isMultiChannel = false;
                var entityOwnerShipType = values[0].OwnershipType;
                var entities = values[1].entities;
                if (values.length > 2) {
                    entities = entities.concat(values[2]);
                }
                var entitiesLength = entities.length;
                if (entities.length > 0) {
                    // If multilple entities are linked
                    isMultiChannel = true;
                }
                OfficeProductivity.DialogUtility.showDialog(isMultiChannel, viewId, viewType, entityTypeCode, entitiesLength, telemetryEvent, entityOwnerShipType, entities);
                OfficeProductivity.Telemetry.addEventParameter(telemetryEvent, OfficeProductivity.Constants.TelemetryConstant.NoLinkedRecords, entitiesLength);
                OfficeProductivity.Telemetry.addEventParameter(telemetryEvent, OfficeProductivity.Constants.TelemetryConstant.OpenedDialogType, isMultiChannel
                    ? OfficeProductivity.Constants.TelemetryConstant.MultiChannel
                    : OfficeProductivity.Constants.TelemetryConstant.NoChannel);
                OfficeProductivity.Telemetry.reportActivityEvent(telemetryEvent, OfficeProductivity.Constants.TelemetryConstant.EventTeamsCommandClicked);
            })
                .catch(OfficeProductivity.Util.CreateErrorResponseHandler(telemetryEvent, OfficeProductivity.Util.getResourceString(OfficeProductivity.Constants.ResourceKeys.ClientGenericErrorMessage), "Failed to fetch records linked to entity"));
        };
        RibbonCommands.getSalesEntities = function (recordId, recordType, telemetryEvent) {
            var _this = this;
            return Xrm.WebApi.retrieveMultipleRecords(OfficeProductivity.Constants.EntityNames.CollabSpaceTeamsAssociationsEntity, "?$filter=" + OfficeProductivity.Constants.CollabSpacesAttributesNames.CrmRecordId + " eq " + recordId + " and " + OfficeProductivity.Constants.CollabSpacesAttributesNames.CrmRecordType + " eq '" + recordType + "'" +
                ("&$select=" + OfficeProductivity.Constants.CollabSpacesAttributesNames.Id + ",\n                " + OfficeProductivity.Constants.CollabSpacesAttributesNames.DataJson + ",\n                " + OfficeProductivity.Constants.CollabSpacesAttributesNames.TeamId + ",\n                " + OfficeProductivity.Constants.CollabSpacesAttributesNames.TeamName + ",\n                " + OfficeProductivity.Constants.CollabSpacesAttributesNames.TeamWebUrl + ",\n                " + OfficeProductivity.Constants.CollabSpacesAttributesNames.Version))
                .then(function (response) {
                return response.entities.map(function (salesEntity) {
                    return _this.mapV2EntityToTeamsRecord(salesEntity);
                });
            })
                .catch(function () {
                OfficeProductivity.Telemetry.addErrorEventParameter(telemetryEvent, OfficeProductivity.Util.getResourceString(OfficeProductivity.Constants.ResourceKeys.ClientGenericErrorMessage));
                OfficeProductivity.Telemetry.reportErrorEvent(telemetryEvent, "Failed to get Sales collaboration entities", "Ensure Sales is installed or disabled the ShowVivaSalesChannelsInLegacyScenarios feature flag");
                return [];
            });
        };
        RibbonCommands.mapV2EntityToTeamsRecord = function (v2Entity) {
            var entity = {};
            var data = JSON.parse(v2Entity["msdyn_data"]);
            var channelId = "";
            var channelName = "";
            var deeplinkUrl = "";
            var channelType = "";
            if (data && data.PrimaryChannel) {
                if (data.PrimaryChannel.id) {
                    channelId = data.PrimaryChannel.Id;
                }
                if (data.PrimaryChannel.Name) {
                    channelName = data.PrimaryChannel.Name;
                }
                if (data.PrimaryChannel.WebUrl) {
                    deeplinkUrl = data.PrimaryChannel.WebUrl;
                }
                if (data.PrimaryChannel.MembershipType) {
                    channelType = data.PrimaryChannel.MembershipType;
                }
            }
            entity["msdyn_teamscollaborationid"] = v2Entity["msdyn_collabspaceteamassociationId"];
            entity["msdyn_teamname"] = v2Entity["msdyn_name"];
            entity["msdyn_channelid"] = channelId;
            entity["msdyn_channeltype"] = channelType;
            entity["msdyn_groupid"] = ""; // not needed, this only appears to be used for deeplinks
            entity["msdyn_tenantid"] = ""; // not needed, this only appears to be used for deeplinks
            entity["msdyn_contenturl"] = ""; // not needed, this only appears to be used for deeplinks
            entity["msdyn_weburl"] = v2Entity["msdyn_teamweburl"];
            entity["msdyn_appid"] = ""; // not needed, this only appears to be used for deeplinks
            entity["msdyn_pipedentityid"] = ""; // not needed, this only appears to be used for deeplinks
            entity["msdyn_channelname"] = channelName;
            entity["isSales"] = true;
            entity["deeplinkUrl"] = deeplinkUrl;
            return entity;
        };
        return RibbonCommands;
    }());
    OfficeProductivity.RibbonCommands = RibbonCommands;
})(OfficeProductivity || (OfficeProductivity = {}));
var OfficeProductivity;
(function (OfficeProductivity) {
    "use strict";
    /**
     * Utility class for web resources
     */
    var Telemetry = (function () {
        function Telemetry() {
        }
        /**
         * Returns if the value is null
         */
        Telemetry.isNull = function (value) {
            return typeof value === "undefined" || value == null;
        };
        /**
         * Returns if the value is not null
         */
        Telemetry.isNotNull = function (value) {
            return !Telemetry.isNull(value);
        };
        /**
         * Creates Xrm telemtery event with given event name
         */
        Telemetry.createEvent = function (eventName) {
            var event = new Array();
            Telemetry.addEventParameter(event, OfficeProductivity.Constants.TelemetryConstant.EventName, eventName);
            Telemetry.addEventParameter(event, OfficeProductivity.Constants.TelemetryConstant.StartTime, new Date());
            Telemetry.addEventParameter(event, OfficeProductivity.Constants.TelemetryConstant.EventErrorCount, 0);
            return event;
        };
        /**
         * Utility method to add parameters to given telemetry event
         */
        Telemetry.addEventParameter = function (event, name, value) {
            try {
                if (event != null && name != null && value != null) {
                    var item = {
                        name: name,
                        value: value,
                    };
                    event.push(item);
                }
            }
            catch (Exception) {
                console.assert(false, Exception.message);
            }
        };
        /**
         * Utility to log telemetry events
         */
        Telemetry.reportEvent = function (event) {
            if (event == null) {
                return;
            }
            var currentEventName = null;
            var start = null;
            var end = new Date();
            try {
                var item = null;
                for (var _i = 0, event_1 = event; _i < event_1.length; _i++) {
                    item = event_1[_i];
                    if (OfficeProductivity.Constants.TelemetryConstant.EventName != null &&
                        OfficeProductivity.Constants.TelemetryConstant.EventName == item.name) {
                        currentEventName = item.value;
                    }
                    else if (OfficeProductivity.Constants.TelemetryConstant.StartTime != null &&
                        OfficeProductivity.Constants.TelemetryConstant.StartTime == item.name) {
                        start = item.value;
                    }
                }
                if (currentEventName == null || start == null) {
                    return;
                }
                Telemetry.addEventParameter(event, OfficeProductivity.Constants.TelemetryConstant.EndTime, end);
                Telemetry.addEventParameter(event, OfficeProductivity.Constants.TelemetryConstant.ExecutionTime, end.valueOf() - start.valueOf());
                var endTime = {
                    eventName: currentEventName,
                    eventParameters: event,
                };
                if (Xrm && Xrm.Reporting) {
                    Xrm.Reporting.reportEvent(endTime);
                }
            }
            catch (Exception) {
                console.assert(false, Exception.message);
            }
        };
        /**
         * Update the execution time of the event
         */
        Telemetry.updateEventExecutionTime = function (event) {
            if (Telemetry.isNull(event)) {
                return;
            }
            var currentEventName = null;
            var start = null;
            var end = new Date();
            try {
                var item = null;
                for (var _i = 0, event_2 = event; _i < event_2.length; _i++) {
                    item = event_2[_i];
                    if (OfficeProductivity.Constants.TelemetryConstant.EventName != null &&
                        OfficeProductivity.Constants.TelemetryConstant.EventName == item.name) {
                        currentEventName = item.value;
                    }
                    else if (Telemetry.isNotNull(OfficeProductivity.Constants.TelemetryConstant.StartTime) &&
                        OfficeProductivity.Constants.TelemetryConstant.StartTime == item.name) {
                        start = item.value;
                    }
                }
                if (Telemetry.isNull(currentEventName) || Telemetry.isNull(start)) {
                    return;
                }
                Telemetry.addEventParameter(event, OfficeProductivity.Constants.TelemetryConstant.EndTime, end);
                Telemetry.addEventParameter(event, OfficeProductivity.Constants.TelemetryConstant.ExecutionTime, end.valueOf() - start.valueOf());
                return event;
            }
            catch (Exception) {
                console.assert(false, Exception.message);
            }
        };
        /**
         * Updates the event parametrs in case of error
         */
        Telemetry.addErrorEventParameter = function (event, value) {
            var errorCount = 0;
            try {
                if (Telemetry.isNotNull(event) && event.length != 0) {
                    var item = null;
                    for (var _i = 0, event_3 = event; _i < event_3.length; _i++) {
                        item = event_3[_i];
                        if (item.name == OfficeProductivity.Constants.TelemetryConstant.EventErrorCount) {
                            errorCount = parseInt(item.value.toString());
                            item.value = errorCount + 1;
                        }
                    }
                }
                if (Telemetry.isNotNull(event) && Telemetry.isNotNull(value)) {
                    var item = {
                        name: OfficeProductivity.Constants.TelemetryConstant.EventErrorMessage + (errorCount + 1),
                        value: value,
                    };
                    event.push(item);
                }
            }
            catch (Exception) {
                console.assert(false, Exception.message);
            }
        };
        /**
         * Utility to check if event ran into error
         */
        Telemetry.findErrorEventParameter = function (event) {
            try {
                if (Telemetry.isNotNull(event) && event.length != 0) {
                    var item = null;
                    for (var _i = 0, event_4 = event; _i < event_4.length; _i++) {
                        item = event_4[_i];
                        if (item.name == OfficeProductivity.Constants.TelemetryConstant.EventErrorCount) {
                            if (item.value != 0) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                        else {
                            continue;
                        }
                    }
                }
                return false;
            }
            catch (Exception) {
                console.assert(false, Exception.message);
            }
        };
        /**
         * Used to report the telemetry event for a component
         */
        Telemetry.reportActivityEvent = function (telemetryEvent, componentName) {
            if (Telemetry.isNull(telemetryEvent)) {
                return;
            }
            if (Xrm && Xrm.Reporting) {
                if (!Telemetry.findErrorEventParameter(telemetryEvent)) {
                    Xrm.Reporting.reportSuccess(componentName, Telemetry.updateEventExecutionTime(telemetryEvent));
                }
                else {
                    Xrm.Reporting.reportFailure(componentName, Error(componentName), "Check the stacktrace", Telemetry.updateEventExecutionTime(telemetryEvent));
                }
            }
        };
        /**
         * Reports an error event
         * @param telemetryEvent
         * @param debugMessage
         */
        Telemetry.reportErrorEvent = function (telemetryEvent, debugMessage, suggestedMitigation) {
            if (Telemetry.isNull(telemetryEvent)) {
                return;
            }
            if (Xrm && Xrm.Reporting) {
                var componentName = void 0;
                var item = void 0;
                for (var _i = 0, telemetryEvent_1 = telemetryEvent; _i < telemetryEvent_1.length; _i++) {
                    item = telemetryEvent_1[_i];
                    if (OfficeProductivity.Constants.TelemetryConstant.EventName == item.name) {
                        componentName = item.value;
                    }
                }
                if (!debugMessage) {
                    debugMessage = componentName;
                }
                if (!suggestedMitigation) {
                    suggestedMitigation = "No suggested mitigation";
                }
                Xrm.Reporting.reportFailure(componentName, Error(debugMessage), suggestedMitigation, Telemetry.updateEventExecutionTime(telemetryEvent));
            }
        };
        return Telemetry;
    }());
    OfficeProductivity.Telemetry = Telemetry;
})(OfficeProductivity || (OfficeProductivity = {}));
//# sourceMappingURL=OfficeProductivity_RibbonCommands.js.map