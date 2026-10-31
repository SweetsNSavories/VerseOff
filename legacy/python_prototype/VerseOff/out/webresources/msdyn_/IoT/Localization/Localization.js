/*! WARNING! Do not update this file manually! Manual update of this file is not supported and will likely lead to issues. In addition, future solution upgrades wont apply to manually edited files. */
/// <reference path="../../../../Scripts/typings/xrm/xrm.d.ts"/>
// the culture info object stores culture specific information by LCID.
var cultureInfo = {};
cultureInfo.defaultLocaleId = '1033';
cultureInfo.cultures = {
    '1025': { name: 'Arabic (Saudi Arabia)', locale: 'ar-SA', momentLocale: 'ar-sa', wijmoLocale: 'ar_UAE', isRTL: true },
    '1028': { name: 'Chinese (Taiwan)', locale: 'zh-TW', momentLocale: 'zh-tw', wijmoLocale: 'zh_TW ', isRTL: false },
    '1030': { name: 'Danish', locale: 'da-DK', momentLocale: 'da', wijmoLocale: 'da', isRTL: false },
    '1031': { name: 'German', locale: 'de-DE', momentLocale: 'de', wijmoLocale: 'de', isRTL: false },
    '1032': { name: 'Greek', locale: 'el-GR', momentLocale: 'el', wijmoLocale: 'el', isRTL: false },
    '1033': { name: 'English', locale: 'en-US', momentLocale: 'en', wijmoLocale: 'en', isRTL: false },
    '1035': { name: 'Finnish', locale: 'fi-FI', momentLocale: 'fi', wijmoLocale: 'fi', isRTL: false },
    '1036': { name: 'French', locale: 'fr-FR', momentLocale: 'fr', wijmoLocale: 'fr', isRTL: false },
    '1037': { name: 'Hebrew', locale: 'he-IL', momentLocale: 'he', wijmoLocale: 'he', isRTL: true },
    '1040': { name: 'Italian', locale: 'it-IT', momentLocale: 'it', wijmoLocale: 'it', isRTL: false },
    '1041': { name: 'Japanese', locale: 'ja-JP', momentLocale: 'ja', wijmoLocale: 'ja', isRTL: false },
    '1043': { name: 'Dutch (Netherlands)', locale: 'nl-NL', momentLocale: 'nl', wijmoLocale: 'nl', isRTL: false },
    '1044': { name: 'Norwegian (Bokmal)', locale: 'nb-NO', momentLocale: 'nb', wijmoLocale: 'no', isRTL: false },
    '1045': { name: 'Polish', locale: 'pl-PL', momentLocale: 'pl', wijmoLocale: 'pl', isRTL: false },
    '1049': { name: 'Russian', locale: 'ru-RU', momentLocale: 'ru', wijmoLocale: 'ru', isRTL: false },
    '1053': { name: 'Swedish', locale: 'sv-SE', momentLocale: 'sw', wijmoLocale: 'sv', isRTL: false },
    '1054': { name: 'Thai', locale: 'th-TH', momentLocale: 'th', wijmoLocale: 'th', isRTL: false },
    '1055': { name: 'Turkish', locale: 'tr-TR', momentLocale: 'tr', wijmoLocale: 'tr', isRTL: false },
    '2052': { name: 'Chinese (People\'s Republic of China)', locale: 'zh-CN', momentLocale: 'zh-cn', wijmoLocale: 'zh', isRTL: false },
    '2070': { name: 'Portugese', locale: 'pt-PT', momentLocale: 'pt', wijmoLocale: 'pt', isRTL: false },
    '3082': { name: 'Spanish (Modern)', locale: 'es-ES', momentLocale: 'es', wijmoLocale: 'es', isRTL: false },
};
// gets the current locale Id
cultureInfo.localeId = function () {
    var localeId = null;
    var xrm = Xrm || top.Xrm;
    if (typeof xrm !== 'undefined') {
        localeId = xrm.Utility.getGlobalContext().userSettings.languageId;
    }
    // Fallback to English-US in case a localized resource file does not exist
    return localeId ? localeId.toString() : cultureInfo.defaultLocaleId;
};
// returns the 'locale' property for the specified locale Id if given; 
// otherwise the 'locale' for the current locale Id.
cultureInfo.locale = function (localeId) {
    return cultureInfo._cultureProperty(localeId, 'locale');
};
// returns the 'momentLocale' property for the specified locale Id if given; 
// otherwise the 'momentLocale' for the current locale Id.
cultureInfo.momentLocale = function (localeId) {
    return cultureInfo._cultureProperty(localeId, 'momentLocale');
};
// returns the 'wijmoLocale' property for the specified locale Id if given; 
// otherwise the 'wijmoLocale' for the current locale Id.
cultureInfo.wijmoLocale = function (localeId) {
    return cultureInfo._cultureProperty(localeId, 'wijmoLocale');
};
// returns true, if the given locale Id is a right-to-left locale; otherwise, false.
// if no locale Id is given, checks the current locale Id,
cultureInfo.isRTL = function (localeId) {
    return cultureInfo._cultureProperty(localeId, 'isRTL');
};
// returns the name for the given locale Id; if no locale Id is given, the name for the current locale Id.
cultureInfo.name = function (localeId) {
    return cultureInfo._cultureProperty(localeId, 'name');
};
// private implementation
// returns the culture object for the given locale Idl or the current locale Id if no locale Id is given.
// if no culture object is defined for the locale Id, then the culture object for the default locale Id is returned.
cultureInfo._culture = function (localeId) {
    var id = (localeId || cultureInfo.localeId()).toString();
    return id && cultureInfo.cultures.hasOwnProperty(id) ? cultureInfo.cultures[id] : cultureInfo.cultures[cultureInfo.defaultLocaleId];
};
// returns the property with the given name from the culture with the specified locale Id
cultureInfo._cultureProperty = function (localeId, propertyName) {
    return cultureInfo._culture(localeId)[propertyName];
};
/*! WARNING! Do not update this file manually! Manual update of this file is not supported and will likely lead to issues. In addition, future solution upgrades wont apply to manually edited files. */
/// <reference path="../CultureInfo.ts" />
var IoTConnector;
(function (IoTConnector) {
    var Localization;
    (function (Localization_1) {
        var Localization = /** @class */ (function () {
            function Localization() {
            }
            // Returns the locale ID
            Localization.localeId = function () {
                return cultureInfo.localeId();
            };
            Localization.getLCID = function () {
                return cultureInfo.localeId();
            };
            // Returns T/F if the current locale ID is a RTL script
            Localization.isLocaleRTL = function () {
                return cultureInfo.isRTL(Localization.localeId());
            };
            ;
            // Replaces all labels in a string, where each label ID is preceded by '@:'.
            // Label IDs can be escaped by a prepending a '\', which case they won't be resolved and the '\' will be removed.
            Localization.localize = function (stringToLocalize) {
                var labelIdPattern = /((^|[^\\])\\)?@:\w+/igm;
                var _this = this;
                function replaceIdForLabel(id) {
                    var label;
                    if (id.charAt(0) !== '@') {
                        // User added the escape character and didn't escape it, so we skip label resolution and return the label ID without the '\'
                        label = id.substring(1);
                    }
                    else {
                        // Resolve the label. We remove the first 2 chars of the label ID, from '@:'
                        if (typeof (Xrm) === "undefined") {
                            Xrm = parent.Xrm;
                        }
                        label = Xrm.Utility.getResourceString(_this.labelsWebResourceName, id.substring(2)) || id;
                    }
                    return label;
                }
                return stringToLocalize.replace(labelIdPattern, replaceIdForLabel);
            };
            ;
            // Formats a given string, replacing '{n}', where n is an integer starting from 0, with the string 
            // passed in n-th position after the original string. All the input strings are localized, having the 
            // label IDs resolved into their corresponding labels.
            // Example: localization.format("This is a {0} @:id", "label") will return "This is a label ID",
            // assuming the entry for label ID 'id" is 'ID'.
            Localization.format = function () {
                var strings = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    strings[_i] = arguments[_i];
                }
                var placeholderPattern = /{\d+}/gm;
                var originalString = Localization.localize(strings[0]);
                function replacePlaceholderForString(placeholder) {
                    var result;
                    // We add one to the position to account for the originating string itself, the 1st parameter.
                    var position = parseInt(placeholder.replace(/{|}/, '')) + 1;
                    if (position < strings.length) {
                        result = Localization.localize(strings[position]);
                    }
                    else {
                        result = placeholder;
                    }
                    return result;
                }
                return originalString.replace(placeholderPattern, replacePlaceholderForString);
            };
            ;
            Localization.setLocalizedInnerHTML = function (elementId, labelId) {
                try {
                    document.getElementById(elementId).innerHTML = Localization.localize(labelId);
                }
                catch (e) { }
            };
            // Web resource containing the labels
            Localization.labelsWebResourceName = "msdyn_/IoT/Localization/LocalizationXml/LocalizedStrings";
            return Localization;
        }());
        Localization_1.Localization = Localization;
    })(Localization = IoTConnector.Localization || (IoTConnector.Localization = {}));
})(IoTConnector || (IoTConnector = {}));
