var IoTAssetCommon;
(function (IoTAssetCommon) {
    var ResourceStringProvider = /** @class */ (function () {
        function ResourceStringProvider() {
        }
        /**
         * Returns resource string of the specified key.
         * @param key Resource string key
         * @returns Resource string value
         */
        ResourceStringProvider.getResourceString = function (key) {
            var value = Xrm.Utility.getResourceString(ResourceStringProvider.WebResourceName, key);
            if (value === undefined || value === null) {
                value = key;
            }
            return value;
        };
        ResourceStringProvider.WebResourceName = "msdyn_/IotAssetCommon/Localization/LocalizationXml/LocalizedStrings";
        return ResourceStringProvider;
    }());
    IoTAssetCommon.ResourceStringProvider = ResourceStringProvider;
})(IoTAssetCommon || (IoTAssetCommon = {}));
