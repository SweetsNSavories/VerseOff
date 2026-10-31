var Yammer;
(function (Yammer) {
    var Util;
    (function (Util) {
        var TelemetryConstants;
        (function (TelemetryConstants) {
            TelemetryConstants.EventName = "YammerEventName";
            TelemetryConstants.StartTime = "StartTime";
            TelemetryConstants.EndTime = "EndTime";
            TelemetryConstants.ExecutionTime = "ExecutionTime";
            TelemetryConstants.EventErrorCount = "ErrorCount";
            TelemetryConstants.EventErrorMessage = "ErrorMessage";
        })(TelemetryConstants = Util.TelemetryConstants || (Util.TelemetryConstants = {}));
    })(Util = Yammer.Util || (Yammer.Util = {}));
})(Yammer || (Yammer = {}));
var Yammer;
(function (Yammer) {
    var Util;
    (function (Util) {
        var TelemetryHelper = (function () {
            function TelemetryHelper() {
            }
            TelemetryHelper.createEvent = function (eventName) {
                var event = new Util.YammerEvent();
                var eventParameters = new Array();
                TelemetryHelper.addEventParameter(event, Util.TelemetryConstants.EventName, eventName);
                event.eventName = eventName;
                var startTime = new Date();
                TelemetryHelper.addEventParameter(event, Util.TelemetryConstants.StartTime, startTime);
                event.startTime = startTime;
                event.errorCount = 0;
                event.eventParameters = eventParameters;
                return event;
            };
            TelemetryHelper.addEventParameter = function (event, name, value) {
                try {
                    if (!Util.IsNull(event) && !Util.IsNull(event.eventName) && !Util.IsNull(event.eventParameters) && !Util.IsNull(name)) {
                        if (!Util.IsNull(value)) {
                            var item = {
                                name: name,
                                value: value
                            };
                            event.eventParameters.push(item);
                        }
                        else {
                            var item = {
                                name: name + "_Time",
                                value: new Date()
                            };
                            event.eventParameters.push(item);
                        }
                    }
                }
                catch (Exception) {
                    console.assert(false, Exception.message);
                }
            };
            TelemetryHelper.report = function (componentName, name, value) {
                if (Util.IsNull(componentName)) {
                    return false;
                }
                try {
                    var yammerEvent = TelemetryHelper.createEvent(componentName);
                    if (!Util.IsNull(name)) {
                        TelemetryHelper.addEventParameter(yammerEvent, name, value);
                    }
                    TelemetryHelper.reportEvent(yammerEvent);
                }
                catch (Exception) {
                    console.assert(false, Exception.message);
                }
            };
            TelemetryHelper.updateEventExecutionTime = function (event) {
                if (Util.IsNull(event)) {
                    return false;
                }
                var currentEventName = event.eventName;
                var start = event.startTime;
                var end = new Date();
                try {
                    if (Util.IsNull(currentEventName) || Util.IsNull(start) || Util.IsNull(event.eventParameters)) {
                        return false;
                    }
                    TelemetryHelper.addEventParameter(event, Util.TelemetryConstants.EndTime, end);
                    TelemetryHelper.addEventParameter(event, Util.TelemetryConstants.ExecutionTime, (end.valueOf() - start.valueOf()));
                    TelemetryHelper.addEventParameter(event, Util.TelemetryConstants.EventErrorCount, event.errorCount);
                    return true;
                }
                catch (Exception) {
                    console.assert(false, Exception.message);
                    return false;
                }
            };
            TelemetryHelper.reportErrorEvent = function (componentName, value) {
                if (Yammer.Util.IsNull(componentName)) {
                    return false;
                }
                try {
                    var yammerEvent = TelemetryHelper.createEvent(componentName);
                    if (!Yammer.Util.IsNull(value)) {
                        TelemetryHelper.addError(yammerEvent, value);
                    }
                    else {
                        TelemetryHelper.addError(yammerEvent, "An Error occured");
                    }
                    TelemetryHelper.reportEvent(yammerEvent);
                }
                catch (Exception) {
                    console.assert(false, Exception.message);
                }
            };
            TelemetryHelper.addError = function (event, value) {
                var errorCount = 0;
                try {
                    if (!Util.IsNull(event) && !Util.IsNull(event.eventParameters)) {
                        var errorCount_1 = event.errorCount;
                        event.errorCount = errorCount_1 + 1;
                        TelemetryHelper.addEventParameter(event, Util.TelemetryConstants.EventErrorMessage + (errorCount_1 + 1), value);
                    }
                }
                catch (Exception) {
                    console.assert(false, Exception.message);
                }
            };
            TelemetryHelper.isErrorEvent = function (event) {
                try {
                    if (!Util.IsNull(event) && !Util.IsNull(event.errorCount)) {
                        return event.errorCount > 0;
                    }
                }
                catch (Exception) {
                    console.assert(false, Exception.message);
                }
                return false;
            };
            TelemetryHelper.reportEvent = function (event) {
                if (Util.IsNull(event) && Util.IsNull(event.eventParameters)) {
                    return;
                }
                try {
                    if (Xrm && Xrm.Reporting) {
                        TelemetryHelper.updateEventExecutionTime(event);
                        if (!TelemetryHelper.isErrorEvent(event)) {
                            Xrm.Reporting.reportSuccess(event.eventName, event.eventParameters);
                        }
                        else {
                            Xrm.Reporting.reportFailure(event.eventName, Error(event.eventName), "Check the stacktrace", event.eventParameters);
                        }
                    }
                }
                catch (Exception) {
                    console.assert(false, Exception.message);
                }
            };
            return TelemetryHelper;
        }());
        Util.TelemetryHelper = TelemetryHelper;
    })(Util = Yammer.Util || (Yammer.Util = {}));
})(Yammer || (Yammer = {}));
var Yammer;
(function (Yammer) {
    var Util;
    (function (Util) {
        function IsNull(value) {
            return typeof (value) === 'undefined' || typeof (value) === 'unknown' || value === null;
        }
        Util.IsNull = IsNull;
    })(Util = Yammer.Util || (Yammer.Util = {}));
})(Yammer || (Yammer = {}));
var Yammer;
(function (Yammer) {
    var Util;
    (function (Util) {
        var YammerEvent = (function () {
            function YammerEvent() {
            }
            return YammerEvent;
        }());
        Util.YammerEvent = YammerEvent;
    })(Util = Yammer.Util || (Yammer.Util = {}));
})(Yammer || (Yammer = {}));
var Yammer;
(function (Yammer) {
    'use strict';
    var Dialog = (function () {
        function Dialog() {
        }
        Dialog.onLoad = function (eventContext) {
            var formContext = eventContext.getFormContext();
            var processingMessage = Xrm.Utility.getResourceString(Yammer.Constants.CommonWebResource, Yammer.Constants.Resx_Processing);
            Xrm.Utility.showProgressIndicator(processingMessage);
            var feedType = Dialog.getFeedType(formContext);
            var promises = Dialog.createPromises(formContext, feedType);
            Promise.all(promises).then(function (values) {
                Xrm.Utility.closeProgressIndicator();
                Dialog.refreshControl(formContext, values, feedType);
            }, function (fail) {
                Xrm.Utility.closeProgressIndicator();
                Yammer.Util.TelemetryHelper.reportErrorEvent(Dialog.EventShowYammerCommand, "Error while retrieve User Information and follow check for Entity : " + fail);
                formContext.data.attributes.get(Yammer.Constants.Param_ErrorCode).setValue(Yammer.Constants.Resx_GenericErrorCode);
            });
        };
        Dialog.refreshControl = function (formContext, values, feedType) {
            var systemUser = values[0];
            formContext.data.attributes.get(Yammer.Constants.Param_DomainName).setValue(Dialog.getEmailAddresses(systemUser));
            formContext.data.attributes.get(Yammer.Constants.Param_YammerUserId).setValue("" + systemUser[Yammer.Constants.SystemUser_YammerUserId]);
            formContext.data.attributes.get(Yammer.Constants.Param_YammerEmailAddress).setValue(systemUser[Yammer.Constants.SystemUser_YammerEmailAddress]);
            if (Dialog.isOpenGraphFeed(feedType) && Dialog.isYammerInPrivateMode(formContext)) {
                var postFollowed = 0;
                var yammerPostState = 0;
                var postFollowSet = values[1];
                if (!Yammer.Util.IsNull(postFollowSet) && !Yammer.Util.IsNull(postFollowSet.entities) && postFollowSet.entities.length > 0) {
                    postFollowed = 1;
                    yammerPostState = postFollowSet.entities[0][Yammer.Constants.PostFollow_YammerPostState];
                }
                formContext.data.attributes.get(Yammer.Constants.Param_PostFollowed).setValue("" + postFollowed);
                formContext.data.attributes.get(Yammer.Constants.Param_YammerPostState).setValue("" + yammerPostState);
            }
        };
        Dialog.isYammerInPrivateMode = function (formContext) {
            return Dialog.getYammerPostMethod(formContext) === Yammer.Constants.YammerPostMethod_Private;
        };
        Dialog.getYammerPostMethod = function (formContext) {
            if (!Yammer.Util.IsNull(formContext.data.attributes.get(Yammer.Constants.Param_YammerPostMethod))) {
                try {
                    return parseInt(formContext.data.attributes.get(Yammer.Constants.Param_YammerPostMethod).getValue());
                }
                catch (Exception) {
                }
            }
            return 0;
        };
        Dialog.getEmailAddresses = function (systemUser) {
            var domainNameJson = [];
            domainNameJson[0] = systemUser[Yammer.Constants.SystemUser_WindowsLiveId];
            domainNameJson[1] = systemUser[Yammer.Constants.SystemUser_InternalEmailAddress];
            domainNameJson[2] = systemUser[Yammer.Constants.SystemUser_PersonalEmailAddress];
            domainNameJson[3] = systemUser[Yammer.Constants.SystemUser_MobileAlertEmail];
            return JSON.stringify(domainNameJson);
        };
        Dialog.getFeedType = function (formContext) {
            var feedType = null;
            try {
                feedType = formContext.data.attributes.get(Yammer.Constants.Param_FeedType).getValue();
            }
            catch (Exception) {
                Yammer.Util.TelemetryHelper.reportErrorEvent(Dialog.EventShowYammerCommand, "Received exception while retrieving feed type value of Dialog param");
                formContext.data.attributes.get(Yammer.Constants.Param_ErrorCode).setValue(Yammer.Constants.Resx_GenericErrorCode);
            }
            if (Yammer.Util.IsNull(feedType)) {
                Yammer.Util.TelemetryHelper.report(Dialog.EventShowYammerCommand, "Feed Type Value is not set in the Dialog param");
                formContext.data.attributes.get(Yammer.Constants.Param_ErrorCode).setValue(Yammer.Constants.Resx_GenericErrorCode);
            }
            return feedType;
        };
        Dialog.createPromises = function (formContext, feedType) {
            var promises = [];
            var userId = Xrm.Utility.getGlobalContext().userSettings.userId;
            var systemUser = Xrm.WebApi.retrieveRecord(Yammer.Constants.Entity_SystemUser, userId, Yammer.Constants.Fetch_YammerSystemUserDetails);
            promises.push(systemUser);
            if (Dialog.isOpenGraphFeed(feedType)) {
                var regardingObjectId = Dialog.formatGuid(formContext.data.attributes.get(Yammer.Constants.Param_EntityId).getValue());
                var fetchXml = Dialog.getFetchPostFollowXml(regardingObjectId, userId);
                var postFollowSet = Xrm.WebApi.retrieveMultipleRecords(Yammer.Constants.Entity_PostFollow, fetchXml);
                promises.push(postFollowSet);
            }
            return promises;
        };
        Dialog.isOpenGraphFeed = function (feedType) {
            return feedType === Yammer.Constants.FeedType_OpenGraph;
        };
        Dialog.formatGuid = function (entityId) {
            if (entityId[0] === "{" && entityId[entityId.length - 1] === "}") {
                entityId = entityId.slice(1, -1);
            }
            else if (entityId[0] === "{") {
                entityId = entityId.slice(1);
            }
            else if (entityId[entityId.length - 1] === "}") {
                entityId = entityId.slice(0, -1);
            }
            return entityId;
        };
        Dialog.getFetchPostFollowXml = function (regardingObjectId, ownerId) {
            var fetchXml = "?$filter=" + Yammer.Constants.PostFollow_RegardingObjectId + " eq " + regardingObjectId + " and " + Yammer.Constants.PostFollow_OwnerId + " eq " + Dialog.formatGuid(ownerId);
            return fetchXml;
        };
        return Dialog;
    }());
    Dialog.EventShowYammerCommand = "Yammer.Commands.showYammer";
    Yammer.Dialog = Dialog;
})(Yammer || (Yammer = {}));
var Yammer;
(function (Yammer) {
    'use strict';
    var Commands = (function () {
        function Commands() {
        }
        Commands.yammer = function (formContext) {
            var globalContext = Xrm.Utility.getGlobalContext();
            var userId = globalContext.userSettings.userId;
            var orgId = globalContext.organizationSettings.organizationId;
            var currentEntity = formContext.data.entity;
            Xrm.WebApi.retrieveRecord(Yammer.Constants.Entity_Organization, orgId, Yammer.Constants.Fetch_YammerOrgDetails).then(function (org) {
                Commands.openYammerDialog(formContext, Yammer.Constants.FeedType_OpenGraph, org[Yammer.Constants.Organization_YammerNetworkPermalink], org[Yammer.Constants.Organization_YammerGroupid], org[Yammer.Constants.Organization_YammerPostMethod]);
            }, function (fail) {
                Yammer.Commands.openYammerAlertDialog(Yammer.Constants.Resx_GenericErrorCode);
            });
        };
        Commands.openYammerDialog = function (formContext, feedType, yammerNetwork, yammerGroupId, yammerPostMethod) {
            var dialogOptions = {
                height: 2000,
                width: 500,
                position: 2
            };
            var dialogParams = {
                param_feedType: feedType,
                param_yammerNetwork: yammerNetwork,
                param_yammerGroupId: yammerGroupId,
                param_entityId: formContext.data.entity.getId(),
                param_entityType: formContext.data.entity.getEntityName(),
                param_entityName: formContext.data.entity.getPrimaryAttributeValue(),
                param_yammerPostMethod: yammerPostMethod
            };
            Xrm.Navigation.openDialog(Yammer.Commands.YammerDialog, dialogOptions, dialogParams).then(function (success) { }, function (error) {
                Yammer.Util.TelemetryHelper.reportErrorEvent(Commands.EventShowYammerCommand, "Error while opening Yammer Dialog: " + error);
            });
        };
        Commands.openYammerAlertDialog = function (errorCode) {
            var dialogOptions = {
                height: 2000,
                width: 500,
                position: 2
            };
            var dialogParams = {
                param_errorCode: errorCode
            };
            Xrm.Navigation.openDialog(Yammer.Commands.YammerDialog, dialogOptions, dialogParams).then(function (success) { }, function (error) {
                Yammer.Util.TelemetryHelper.reportErrorEvent(Commands.EventShowYammerCommand, "Error while opening Dialog for Error: " + error);
            });
        };
        return Commands;
    }());
    Commands.EventShowYammerCommand = "Yammer.Commands.showYammer";
    Commands.YammerDialog = "YammerDialog";
    Yammer.Commands = Commands;
})(Yammer || (Yammer = {}));
var Yammer;
(function (Yammer) {
    'use strict';
    var Constants;
    (function (Constants) {
        Constants.Entity_SystemUser = "systemuser";
        Constants.Entity_Organization = "organization";
        Constants.Entity_PostFollow = "postfollow";
        Constants.Entity_PostConfig = "msdyn_postconfig";
        Constants.SystemUser_SystemUserId = "systemuserid";
        Constants.SystemUser_YammerEmailAddress = "yammeremailaddress";
        Constants.SystemUser_YammerUserId = "yammeruserid";
        Constants.SystemUser_WindowsLiveId = "windowsliveid";
        Constants.SystemUser_InternalEmailAddress = "internalemailaddress";
        Constants.SystemUser_PersonalEmailAddress = "personalemailaddress";
        Constants.SystemUser_MobileAlertEmail = "mobilealertemail";
        Constants.Organization_YammerNetworkPermalink = "yammernetworkpermalink";
        Constants.Organization_YammerGroupid = "yammergroupid";
        Constants.Organization_YammerOAuthAccessTokenExpired = "yammeroauthaccesstokenexpired";
        Constants.Organization_YammerPostMethod = "yammerpostmethod";
        Constants.Fetch_YammerOrgDetails = "?$select=" + Constants.Organization_YammerNetworkPermalink + "," + Constants.Organization_YammerGroupid + "," + Constants.Organization_YammerOAuthAccessTokenExpired + "," + Constants.Organization_YammerPostMethod;
        Constants.Fetch_YammerSystemUserDetails = "?$select=" + Constants.SystemUser_YammerUserId + "," + Constants.SystemUser_YammerEmailAddress + "," + Constants.SystemUser_SystemUserId + "," + Constants.SystemUser_WindowsLiveId + "," + Constants.SystemUser_InternalEmailAddress + "," + Constants.SystemUser_PersonalEmailAddress + "," + Constants.SystemUser_MobileAlertEmail;
        Constants.PostFollow_YammerPostState = "yammerpoststate";
        Constants.PostFollow_PostFollowId = "postfollowid";
        Constants.PostFollow_RegardingObjectId = "_regardingobjectid_value";
        Constants.PostFollow_OwnerId = "_ownerid_value";
        Constants.YammerPostMethod_Private = 1;
        Constants.YammerPostState_Followed = 1;
        Constants.Param_FeedType = "param_feedType";
        Constants.Param_YammerNetwork = "param_yammerNetwork";
        Constants.Param_YammerGroupId = "param_yammerGroupId";
        Constants.Param_YammerUserId = "param_yammerUserId";
        Constants.Param_YammerEmailAddress = "param_yammerEmailAddress";
        Constants.Param_DomainName = "param_domainName";
        Constants.Param_ErrorCode = "param_errorCode";
        Constants.Param_PostFollowed = "param_postFollowed";
        Constants.Param_YammerPostState = "param_yammerPostState";
        Constants.Param_EntityId = "param_entityId";
        Constants.Param_YammerPostMethod = "param_yammerPostMethod";
        Constants.FeedType_OpenGraph = "open-graph";
        Constants.FeedType_Group = "group";
        Constants.CommonWebResource = "msdyn_/Resources/YammerIntegration";
        Constants.Resx_GenericErrorCode = "YammerIntegration_Error_Text";
        Constants.Resx_UserLoginMismatch = "Error_Message_0x8004b016";
        Constants.Resx_Processing = "Msg_Progress_MOCA_Dialog";
        Constants.FCB_YammerPostsOnUCI = "YammerPostsOnUCI";
    })(Constants = Yammer.Constants || (Yammer.Constants = {}));
})(Yammer || (Yammer = {}));
var Yammer;
(function (Yammer) {
    'use strict';
    var Rules = (function () {
        function Rules() {
        }
        Rules.showYammer = function (formContext, entityLogicalName) {
            Yammer.Util.TelemetryHelper.report(Rules.EventShowYammerRule, "Rule showYammer execution started");
            if (!(Rules.YammerEnabledForOrg === null || Rules.YammerEnabledForOrg === undefined)) {
                return Rules.YammerEnabledForOrg;
            }
            else {
                if (Rules.isBrowser() && Rules.isCrmOnline() && Rules.isUCI() && Rules.isYammerPostsOnUCIEnabled() && Rules.isSystemUserEntity(entityLogicalName)) {
                    if (Xrm.Utility.getGlobalContext().organizationSettings.isYammerConfigured) {
                        return Rules.isActivityWallEnabled(entityLogicalName).then(function (resp) {
                            if (resp) {
                                Yammer.Util.TelemetryHelper.report(Rules.EventShowYammerRule, "Rule showYammer returns true");
                                Rules.YammerEnabledForOrg = true;
                                return true;
                            }
                            else {
                                Yammer.Util.TelemetryHelper.report(Rules.EventShowYammerRule, "ActivityWall not enabled for the entity");
                                Rules.YammerEnabledForOrg = false;
                                return false;
                            }
                        });
                    }
                    else {
                        Yammer.Util.TelemetryHelper.report(Rules.EventShowYammerRule, "Yammer not enabled for the organization");
                        Rules.YammerEnabledForOrg = false;
                        return false;
                    }
                }
                else {
                    Yammer.Util.TelemetryHelper.report(Rules.EventShowYammerRule, "Rule showYammer returns false");
                    Rules.YammerEnabledForOrg = false;
                    return false;
                }
            }
        };
        Rules.isYammerPostsOnUCIEnabled = function () {
            var YammerPostsOnUCIEnabled = Xrm.Internal.isFeatureEnabled(Yammer.Constants.FCB_YammerPostsOnUCI);
            return YammerPostsOnUCIEnabled;
        };
        Rules.isCrmOnline = function () {
            var isCrmOnPremises = Xrm.Utility.getGlobalContext().isOnPremises();
            return !isCrmOnPremises;
        };
        Rules.isUCI = function () {
            return Xrm.Internal.isUci();
        };
        Rules.isBrowser = function () {
            var formFactor = Xrm.Utility.getGlobalContext().client.getFormFactor();
            return (formFactor === 1);
        };
        Rules.isSystemUserEntity = function (entityLogicalName) {
            if ((entityLogicalName === Yammer.Constants.Entity_SystemUser) || (entityLogicalName === Yammer.Constants.Entity_PostConfig)) {
                return false;
            }
            else {
                return true;
            }
        };
        Rules.isActivityWallEnabled = function (entityLogicalName) {
            var fetchXml = "<fetch mapping='logical'> <entity name='msdyn_postconfig'> <attribute name='msdyn_configurewall' /> <attribute name='msdyn_entityname' /> <filter type='and'> <condition attribute='msdyn_entityname' operator='eq' value='" + entityLogicalName + "' /> </filter> </entity> </fetch>";
            var isActivityWallEnabled = Xrm.WebApi.retrieveMultipleRecords("msdyn_postconfig", "?fetchXml=" + fetchXml).then(function (response) {
                if (response.entities[0]["msdyn_configurewall"] === true) {
                    return true;
                }
                else {
                    return false;
                }
            }, function (error) {
                Yammer.Util.TelemetryHelper.reportErrorEvent(Rules.EventShowYammerRule, "Received Network error while checking for ActivityWall enabled for the entity");
                return false;
            });
            return isActivityWallEnabled;
        };
        return Rules;
    }());
    Rules.EventShowYammerRule = "Yammer.Rules.showYammer";
    Yammer.Rules = Rules;
})(Yammer || (Yammer = {}));
//# sourceMappingURL=Yammer.js.map