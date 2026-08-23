/**
 * DO NOT REFERENCE THE .ts FILE DIRECTLY
 * To consume this
 * 1. reference the generated .d.ts file in ../../../../TypeDefinitions/OCBaseURBase/Localization/ResourceStringProvider.d.ts.
 * 2. add msdyn_Localization/ResourceStringProvider.js as a web resource dependency on the js file that is consuming this.
 */
var OCBaseURBase;
(function (OCBaseURBase) {
    var ResourceStringProvider = /** @class */ (function () {
        function ResourceStringProvider() {
        }
        ResourceStringProvider.getResourceString = function (key) {
            var value = Xrm.Utility.getResourceString(ResourceStringProvider.WebResourceName, key);
            if (value === undefined || value === null) {
                value = key;
            }
            return value;
        };
        ResourceStringProvider.WebResourceName = "msdyn_Localization/Languages/OCBaseURBase";
        return ResourceStringProvider;
    }());
    OCBaseURBase.ResourceStringProvider = ResourceStringProvider;
})(OCBaseURBase || (OCBaseURBase = {}));
