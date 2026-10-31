/*! WARNING! Do not update this file manually! Manual update of this file is not supported and will likely lead to issues. In addition, future solution upgrades wont apply to manually edited files. */
/// <reference path="ODataUtils.ts" />
var IoTConnector;
(function (IoTConnector) {
    var Utils;
    (function (Utils) {
        var SuggestionsUtils = /** @class */ (function () {
            function SuggestionsUtils() {
            }
            // Determines if IoT Suggestions is enabled and returns boolean Promise of true if valid, otherwise false.
            SuggestionsUtils.isSuggestionsEnabled = function () {
                var settings = IoTConnector.Common.Constants.Msdyn_iotsettings;
                var iotSettingsEntityNamePlural = settings.EntityLogicalName + "es";
                var iotSettingsId = settings.AttributeId;
                var enableIoTSuggestionsField = settings.AttributeEnableIoTSuggestions;
                var filter = "";
                var expand = "";
                return new Promise(function (resolve, reject) {
                    IoTConnector.Utils.ODataUtils.getEntities(iotSettingsEntityNamePlural, iotSettingsId, filter, enableIoTSuggestionsField, expand, function (data) {
                        resolve((data && data[enableIoTSuggestionsField]) === true);
                    }, function (err) {
                        try {
                            console.error(err.error.message);
                        }
                        catch (e) {
                            console.error(err);
                        }
                        reject(err);
                    });
                });
            };
            return SuggestionsUtils;
        }());
        Utils.SuggestionsUtils = SuggestionsUtils;
    })(Utils = IoTConnector.Utils || (IoTConnector.Utils = {}));
})(IoTConnector || (IoTConnector = {}));
