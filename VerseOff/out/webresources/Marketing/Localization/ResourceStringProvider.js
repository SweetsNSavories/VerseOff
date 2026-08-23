/**
 * DO NOT REFERENCE THE .ts FILE DIRECTLY
 * To consume this
 * 1. reference the generated .d.ts file in ../../../../TypeDefinitions/Marketing/Localization/ResourceStringProvider.d.ts.
 * 2. add Marketing/Localization/ResourceStringProvider.js as a web resource dependency on the js file that is consuming this.
 */
var Marketing;
(function (Marketing) {
    var ResourceStringProvider = (function () {
        function ResourceStringProvider() {
        }
        ResourceStringProvider.getResourceString = function (key) {
            var value = Xrm.Utility.getResourceString(ResourceStringProvider.WebResourceName, key);
            if (value === undefined || value === null) {
                value = Xrm.Utility.getResourceString(ResourceStringProvider.WebResourceUniversalName, key);
                if (value === undefined || value === null) {
                    value = key;
                }
            }
            return value;
        };
        ResourceStringProvider.getErrorCodeString = function (errorCode) {
            var key = (errorCode < 0 ? -errorCode : errorCode).toString(16);
            return this.getResourceString(key);
        };
        ResourceStringProvider.getErrorMessageString = function (key) {
            return this.getResourceString(key);
        };
        return ResourceStringProvider;
    }());
    ResourceStringProvider.WebResourceName = "Marketing/Localization/Languages/Marketing";
    ResourceStringProvider.WebResourceUniversalName = "Marketing/Localization/Languages/Marketing.resx";
    Marketing.ResourceStringProvider = ResourceStringProvider;
})(Marketing || (Marketing = {}));
