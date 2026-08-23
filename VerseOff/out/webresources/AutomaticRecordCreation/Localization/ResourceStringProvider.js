/**
 * DO NOT REFERENCE THE .ts FILE DIRECTLY
 * To consume this
 * 1. reference the generated .d.ts file in ../../../../TypeDefinitions/AutomaticRecordCreation/Localization/ResourceStringProvider.d.ts.
 * 2. add AutomaticRecordCreation/Localization/ResourceStringProvider.js as a web resource dependency on the js file that is consuming this.
 */
var ARC;
(function (ARC) {
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
    ResourceStringProvider.WebResourceName = "AutomaticRecordCreation/Localization/Languages/AutomaticRecordCreation";
    ARC.ResourceStringProvider = ResourceStringProvider;
})(ARC || (ARC = {}));
