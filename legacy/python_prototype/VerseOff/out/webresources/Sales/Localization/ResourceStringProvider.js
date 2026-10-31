/**
 * DO NOT REFERENCE THE .ts FILE DIRECTLY
 * To consume this
 * 1. reference the generated .d.ts file in ../../../../TypeDefinitions/Sales/Localization/ResourceStringProvider.d.ts.
 * 2. add Sales/Localization/ResourceStringProvider.js as a web resource dependency on the js file that is consuming this.
 */
var Sales;
(function (Sales) {
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
    ResourceStringProvider.WebResourceName = "Sales/Localization/Languages/Sales";
    Sales.ResourceStringProvider = ResourceStringProvider;
})(Sales || (Sales = {}));
