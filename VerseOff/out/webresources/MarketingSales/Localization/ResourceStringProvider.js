/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/* DO NOT REFERENCE THE .ts FILE DIRECTLY
  * To consume this
  * 1. reference the generated .d.ts file in ../../../../TypeDefinitions/MarketingSales/Localization/ResourceStringProvider.d.ts.
  * 2. add CRM/Localization/ResourceStringProvider.js as a web resource dependency on the js file that is consuming this.
  *
  * This file loads the resx resource as a web resource dependency.
*/
var MarketingSales;
(function (MarketingSales) {
    var ResourceStringProvider = (function () {
        function ResourceStringProvider() {
        }
        ResourceStringProvider.getResourceString = function (key) {
            var value = Xrm.Utility.getResourceString(ResourceStringProvider.WebResourceName, key);
            return (value === undefined || value === null) ? key : value;
        };
        return ResourceStringProvider;
    }());
    ResourceStringProvider.WebResourceName = 'MarketingSales/Localization/Languages/MarketingSales';
    MarketingSales.ResourceStringProvider = ResourceStringProvider;
})(MarketingSales || (MarketingSales = {}));
