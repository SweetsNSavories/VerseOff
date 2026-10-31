"use strict";
var OmniChannelPackage;
(function (OmniChannelPackage) {
    var BasePresences;
    (function (BasePresences) {
        BasePresences[BasePresences["Available"] = 192360000] = "Available";
        BasePresences[BasePresences["Busy"] = 192360001] = "Busy";
        BasePresences[BasePresences["BusyDND"] = 192360002] = "BusyDND";
        BasePresences[BasePresences["Away"] = 192360003] = "Away";
        BasePresences[BasePresences["Offline"] = 192360004] = "Offline";
    })(BasePresences || (BasePresences = {}));
    var PresenceConstants = (function () {
        function PresenceConstants() {
        }
        return PresenceConstants;
    }());
    PresenceConstants.StatusAttributeName = "msdyn_presencestatustext";
    PresenceConstants.BaseStatusAttributeName = "msdyn_basepresencestatus";
    PresenceConstants.BaseStatusAttributeValueName = "msdyn_basepresencestatus_Value";
    PresenceConstants.SystemUserEntityLinkPrefix = "msdyn_defaultpresenceiduser";
    PresenceConstants.AvailableIcon = "msdyn_/Images/Available.svg";
    PresenceConstants.BusyIcon = "msdyn_/Images/Busy.svg";
    PresenceConstants.DNDIcon = "msdyn_/Images/DoNotDisturb.svg";
    PresenceConstants.AwayIcon = "msdyn_/Images/Away.svg";
    PresenceConstants.OfflineIcon = "msdyn_/Images/Offline.svg";
    PresenceConstants.BaseResxFileName = "msdyn_OmnichannelBase";
    PresenceConstants.AvailableTooltipResourceName = "OC_Presence_Available";
    PresenceConstants.BusyTooltipResourceName = "OC_Presence_Busy";
    PresenceConstants.DNDTooltipResourceName = "OC_Presence_DoNotDisturb";
    PresenceConstants.AwayTooltipResourceName = "OC_Presence_Away";
    PresenceConstants.OfflineTooltipResourceName = "OC_Presence_Offline";
    PresenceConstants.BasePresences = BasePresences;
    OmniChannelPackage.PresenceConstants = PresenceConstants;
})(OmniChannelPackage || (OmniChannelPackage = {}));
"use strict";
var OmniChannelPackage;
(function (OmniChannelPackage) {
    var Presence = (function () {
        function Presence() {
        }
        Presence.GetPresenceIcon = function (rowData) {
            return Presence.getIcon(rowData, OmniChannelPackage.PresenceConstants.BaseStatusAttributeValueName);
        };
        Presence.GetSystemUserDefaultPresenceIcon = function (rowData) {
            return Presence.getIcon(rowData, OmniChannelPackage.PresenceConstants.SystemUserEntityLinkPrefix + "." + OmniChannelPackage.PresenceConstants.BaseStatusAttributeValueName);
        };
        Presence.ForceDependencyResolution = function () {
            return false;
        };
        Presence.getIcon = function (rowData, presenceAttributeName) {
            if (typeof rowData !== "string" || rowData.length === 0) {
                return ["", ""];
            }
            var data = JSON.parse(rowData);
            var presenceValue;
            switch (typeof data[presenceAttributeName]) {
                case "number":
                    presenceValue = data[presenceAttributeName];
                    break;
                case "string":
                    presenceValue = parseInt(data[presenceAttributeName], 10);
                    break;
            }
            switch (presenceValue) {
                default: return ["", ""];
                case OmniChannelPackage.PresenceConstants.BasePresences.Available: return [OmniChannelPackage.PresenceConstants.AvailableIcon, Presence.getResourceString(OmniChannelPackage.PresenceConstants.AvailableTooltipResourceName)];
                case OmniChannelPackage.PresenceConstants.BasePresences.Busy: return [OmniChannelPackage.PresenceConstants.BusyIcon, Presence.getResourceString(OmniChannelPackage.PresenceConstants.BusyTooltipResourceName)];
                case OmniChannelPackage.PresenceConstants.BasePresences.BusyDND: return [OmniChannelPackage.PresenceConstants.DNDIcon, Presence.getResourceString(OmniChannelPackage.PresenceConstants.DNDTooltipResourceName)];
                case OmniChannelPackage.PresenceConstants.BasePresences.Away: return [OmniChannelPackage.PresenceConstants.AwayIcon, Presence.getResourceString(OmniChannelPackage.PresenceConstants.AwayTooltipResourceName)];
                case OmniChannelPackage.PresenceConstants.BasePresences.Offline: return [OmniChannelPackage.PresenceConstants.OfflineIcon, Presence.getResourceString(OmniChannelPackage.PresenceConstants.OfflineTooltipResourceName)];
            }
        };
        Presence.getResourceString = function (key) {
            if (!window.hasOwnProperty("Xrm")) {
                if (window.parent.hasOwnProperty("Xrm")) {
                    window.Xrm = window.parent.Xrm;
                }
                else {
                    return key;
                }
            }
            try {
                return Xrm.Utility.getResourceString(OmniChannelPackage.PresenceConstants.BaseResxFileName, key);
            }
            catch (err) {
                return key;
            }
        };
        return Presence;
    }());
    OmniChannelPackage.Presence = Presence;
})(OmniChannelPackage || (OmniChannelPackage = {}));
