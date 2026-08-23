/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var AnyEntityRoutingRule;
(function (AnyEntityRoutingRule) {
    var RoutingRuleSetLibrary = (function () {
        function RoutingRuleSetLibrary() {
            var global = window;
            var mscrm = global.Mscrm;
            mscrm.routingRuleSetLibraryWebResource = new RoutingRuleSetLibraryWebResource();
            mscrm.Form_onload = mscrm.routingRuleSetLibraryWebResource.Form_onload;
        }
        return RoutingRuleSetLibrary;
    }());
    AnyEntityRoutingRule.RoutingRuleSetLibrary = RoutingRuleSetLibrary;
    var RoutingRuleSetLibraryWebResource = (function () {
        function RoutingRuleSetLibraryWebResource() {
            this.Form_onload = function () {
                var entityControl = Xrm.Page.getControl("msdyn_entitylogicalname");
                if (entityControl) {
                    if (Xrm.Internal.isFeatureEnabled("April2021Update") || !Xrm.Internal.isFeatureEnabled("AnyEntityRoutingRule")) {
                        entityControl.setVisible(false);
                    }
                    else {
                        var entityAttr = Xrm.Page.getAttribute("msdyn_entitylogicalname");
                        if (entityAttr) {
                            entityAttr.setRequiredLevel("required");
                        }
                    }
                }
            };
        }
        return RoutingRuleSetLibraryWebResource;
    }());
    AnyEntityRoutingRule.RoutingRuleSetLibraryWebResource = RoutingRuleSetLibraryWebResource;
})(AnyEntityRoutingRule || (AnyEntityRoutingRule = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var AnyEntityRoutingRule;
(function (AnyEntityRoutingRule) {
    var RoutingRuleSetLegacyLibrary = (function () {
        function RoutingRuleSetLegacyLibrary() {
            var global = window;
            var mscrm = global.Mscrm;
            mscrm.routingRuleSetLegacyLibraryWebResource = new RoutingRuleSetLegacyLibraryWebResource();
            mscrm.Form_onload = mscrm.routingRuleSetLegacyLibraryWebResource.Form_onload;
        }
        return RoutingRuleSetLegacyLibrary;
    }());
    AnyEntityRoutingRule.RoutingRuleSetLegacyLibrary = RoutingRuleSetLegacyLibrary;
    var RoutingRuleSetLegacyLibraryWebResource = (function () {
        function RoutingRuleSetLegacyLibraryWebResource() {
            this.Form_onload = function () {
                var entityControl = Xrm.Page.getControl("msdyn_entitylogicalname");
                if (entityControl) {
                    entityControl.setVisible(false);
                }
            };
        }
        return RoutingRuleSetLegacyLibraryWebResource;
    }());
    AnyEntityRoutingRule.RoutingRuleSetLegacyLibraryWebResource = RoutingRuleSetLegacyLibraryWebResource;
})(AnyEntityRoutingRule || (AnyEntityRoutingRule = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="UCI/RoutingRuleSetLibrary.ts" />
/// <reference path="Legacy/RoutingRuleSetLegacyLibrary.ts"/>
var AnyEntityRoutingRule;
(function (AnyEntityRoutingRule) {
    'use strict';
    var RoutingRuleSet = (function () {
        function RoutingRuleSet() {
        }
        return RoutingRuleSet;
    }());
    RoutingRuleSet.ctor = (function () {
        if (Xrm.Internal.isUci()) {
            RoutingRuleSet.Instance = new AnyEntityRoutingRule.RoutingRuleSetLibrary();
        }
        else {
            RoutingRuleSet.Instance = new AnyEntityRoutingRule.RoutingRuleSetLegacyLibrary();
        }
    })();
    AnyEntityRoutingRule.RoutingRuleSet = RoutingRuleSet;
})(AnyEntityRoutingRule || (AnyEntityRoutingRule = {}));
//# sourceMappingURL=RoutingRuleSet_main_system_library.js.map