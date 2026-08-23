var LinkedInExtensions;
(function (LinkedInExtensions) {
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
        ResourceStringProvider.WebResourceName = "LinkedInExtensions/Localization/Languages/msdyn_LinkedInExtensions";
        ResourceStringProvider.formatString = function (str) {
            var val = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                val[_i - 1] = arguments[_i];
            }
            if (str && val) {
                for (var index = 0; index < val.length; index++) {
                    str = str.replace("{".concat(index, "}"), val[index]);
                }
            }
            return str;
        };
        return ResourceStringProvider;
    }());
    LinkedInExtensions.ResourceStringProvider = ResourceStringProvider;
})(LinkedInExtensions || (LinkedInExtensions = {}));
//# sourceMappingURL=msdyn_LinkedInExtensionsResourceProvider.js.map