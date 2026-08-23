/**
 * DO NOT REFERENCE THE .ts FILE DIRECTLY
 * To consume this
 * 1. reference the generated .d.ts file in ../../../../TypeDefinitions/RoutingRule/Localization/ResourceStringProvider.d.ts.
 * 2. add RoutingRule/Localization/ResourceStringProvider.js as a web resource dependency on the js file that is consuming this.
 */
var RoutingRule;
(function (RoutingRule) {
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
        return ResourceStringProvider;
    }());
    ResourceStringProvider.WebResourceName = "RoutingRule/Localization/Languages/RoutingRule";
    RoutingRule.ResourceStringProvider = ResourceStringProvider;
})(RoutingRule || (RoutingRule = {}));
