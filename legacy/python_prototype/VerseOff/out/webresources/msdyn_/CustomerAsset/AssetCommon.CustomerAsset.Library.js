var AssetCommonUtils;
(function (AssetCommonUtils) {
    var ErrorTypes;
    (function (ErrorTypes) {
        ErrorTypes[ErrorTypes["Null"] = 0] = "Null";
    })(ErrorTypes = AssetCommonUtils.ErrorTypes || (AssetCommonUtils.ErrorTypes = {}));
    var FormType;
    (function (FormType) {
        FormType[FormType["Create"] = 1] = "Create";
        FormType[FormType["Update"] = 2] = "Update";
        FormType[FormType["ReadOnly"] = 3] = "ReadOnly";
        FormType[FormType["Disabled"] = 4] = "Disabled";
        FormType[FormType["BulkEdit"] = 6] = "BulkEdit";
    })(FormType = AssetCommonUtils.FormType || (AssetCommonUtils.FormType = {}));
    AssetCommonUtils.ClientState = {
        Online: "Online",
        Offline: "Offline",
    };
})(AssetCommonUtils || (AssetCommonUtils = {}));
/// <reference path="Types.ts"/>
var AssetCommonUtils;
(function (AssetCommonUtils) {
    var Output;
    (function (Output) {
        function outputError(objectName, errorType) {
            var result = "";
            switch (errorType) {
                case AssetCommonUtils.ErrorTypes.Null: {
                    result = objectName + " is null";
                    break;
                }
            }
            log(result);
        }
        Output.outputError = outputError;
        function log(message) {
            if (typeof console != "undefined" && typeof console.log != "undefined") {
                console.log(message);
            }
        }
        Output.log = log;
        function warn(message) {
            if (typeof console != "undefined" && typeof console.warn != "undefined") {
                console.warn(message);
            }
        }
        Output.warn = warn;
    })(Output = AssetCommonUtils.Output || (AssetCommonUtils.Output = {}));
})(AssetCommonUtils || (AssetCommonUtils = {}));
/// <reference path="Types.ts"/>
var AssetCommonUtils;
(function (AssetCommonUtils) {
    var Object;
    (function (Object) {
        function isNotNullAndUndefined(object) {
            return typeof object !== "undefined" && object !== null;
        }
        Object.isNotNullAndUndefined = isNotNullAndUndefined;
        function isNullOrUndefined(object) {
            return typeof object === "undefined" || object === null;
        }
        Object.isNullOrUndefined = isNullOrUndefined;
    })(Object = AssetCommonUtils.Object || (AssetCommonUtils.Object = {}));
})(AssetCommonUtils || (AssetCommonUtils = {}));
/**
 * DO NOT REFERENCE THE .ts FILE DIRECTLY
 * To consume this
 * 1. reference the generated .d.ts file in ../../../../TypeDefinitions/AssetCommon/Localization/ResourceStringProvider.d.ts.
 * 2. add AssetCommon/Localization/ResourceStringProvider.js as a web resource dependency on the js file that is consuming this.
 */
var AssetCommon;
(function (AssetCommon) {
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
        ResourceStringProvider.WebResourceName = "msdyn_/AssetCommon/ClientResources/AssetCommon";
        return ResourceStringProvider;
    }());
    AssetCommon.ResourceStringProvider = ResourceStringProvider;
})(AssetCommon || (AssetCommon = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="../ResourceStringProvider.ts" />
/*
 * Invokes the ResourceStringProvider if available; otherwise returns *key*.
 * Using this class as a proxy for the ResourceStringProvider that is included per web dependency declaration
 * in order to avoid null reference errors in case the dependency is not loaded for some reason.
 */
var AssetCommon;
(function (AssetCommon) {
    var StringProvider = /** @class */ (function () {
        function StringProvider() {
        }
        StringProvider.getResourceString = function (key) {
            return AssetCommon.ResourceStringProvider
                ? AssetCommon.ResourceStringProvider.getResourceString(key)
                : "*".concat(key, "*");
        };
        return StringProvider;
    }());
    AssetCommon.StringProvider = StringProvider;
})(AssetCommon || (AssetCommon = {}));
/// <reference path="Output.ts"/>
/// <reference path="Object.ts"/>
/// <reference path="Types.ts"/>
/// <reference path="../Localization/Provider/StringProvider.ts"/>
var AssetCommonUtils;
(function (AssetCommonUtils) {
    var Form;
    (function (Form) {
        function getField(formContext, field) {
            if (field) {
                return formContext.getAttribute(field);
            }
            else {
                return null;
            }
        }
        Form.getField = getField;
        /**
         * Gets form context. Use the passed in formContext if not null. Otherwise, use the default formContext
         *
         * @param formContext
         */
        function getFormContextOrDefault(formContext) {
            return AssetCommonUtils.Object.isNotNullAndUndefined(formContext)
                ? formContext
                : this._defaultFormContext;
        }
        Form.getFormContextOrDefault = getFormContextOrDefault;
        function setNotification(formContext, localizedStringId, show, notificationType, formatFunc) {
            if (formContext && formContext.ui) {
                var pageUI = formContext.ui;
                show = show != false; // default to true if not set
                if (show) {
                    notificationType =
                        notificationType ||
                            "ERROR" /* XrmClientApi.Constants.FormNotificationLevel.ERROR */; //Default to "ERROR" if not set
                    var locStr = AssetCommon.StringProvider.getResourceString(localizedStringId);
                    if (formatFunc) {
                        locStr = formatFunc(locStr);
                    }
                    return pageUI.setFormNotification(locStr, notificationType, localizedStringId);
                }
                else {
                    return pageUI.clearFormNotification(localizedStringId);
                }
            }
            else {
                AssetCommonUtils.Output.log("AssetCommonUtils.Form.SetNotification: no notification was shown/cleared for localizedStringId '" +
                    localizedStringId +
                    "'");
                return false;
            }
        }
        Form.setNotification = setNotification;
        function getEntityAttribute(formContext, field) {
            if (field) {
                return formContext.getAttribute(field);
            }
            else {
                return null;
            }
        }
        Form.getEntityAttribute = getEntityAttribute;
        /**
         * Gets all entity attributes on the form
         * @param formContext Form context
         * @returns a collection of entity attributes
         */
        function getEntityAttributes(formContext) {
            var attributes = null;
            if (formContext && formContext.data && formContext.data.entity) {
                attributes = formContext.data.entity.attributes;
            }
            return attributes;
        }
        Form.getEntityAttributes = getEntityAttributes;
        function getControl(formContext, field) {
            var controls = formContext.ui.controls;
            return (controls.get(field) ||
                controls.get("header_" + field) ||
                controls.get("header_process_" + field));
        }
        Form.getControl = getControl;
        function clearLookup(formContext, field) {
            AssetCommonUtils.Form.setValue(formContext, field, null);
        }
        Form.clearLookup = clearLookup;
        function publishEmptyLookUp(formContext, field) {
            AssetCommonUtils.Form.setValue(formContext, field, null);
            AssetCommonUtils.Form.fireOnChange(formContext, field);
        }
        Form.publishEmptyLookUp = publishEmptyLookUp;
        function getRequiredLevelOfField(formContext, field) {
            var control = AssetCommonUtils.Form.getControl(formContext, field);
            if (control) {
                var attribute = control.getAttribute();
                var requiredLevel = attribute.getRequiredLevel();
                switch (requiredLevel) {
                    case "required":
                        return true;
                    case "none":
                        return false;
                    case "recommended":
                        return "recommended";
                }
            }
            return false;
        }
        Form.getRequiredLevelOfField = getRequiredLevelOfField;
        function setRequired(formContext, field, required) {
            var fieldObject = AssetCommonUtils.Form.getField(formContext, field);
            if (fieldObject && fieldObject.setRequiredLevel) {
                switch (required.toString()) {
                    case "true":
                        fieldObject.setRequiredLevel("required");
                        break;
                    case "false":
                        fieldObject.setRequiredLevel("none");
                        break;
                    default:
                        fieldObject.setRequiredLevel("recommended");
                        break;
                }
                if (required == false) {
                    AssetCommonUtils.Form.clearNotifications(formContext, field);
                }
            }
            else {
                AssetCommonUtils.Output.outputError(field, AssetCommonUtils.ErrorTypes.Null);
            }
        }
        Form.setRequired = setRequired;
        /**
         * Set the required level as required if it is required, or set as
         * recommended if it is not required and clear any notifications.
         * @param formContext context of the current page
         * @param fieldName name of the field to be updated
         * @param isRequired sets to recommended if false
         */
        function setRequiredOrRecommended(formContext, fieldName, isRequired) {
            var fields = AssetCommonUtils.Form;
            var field = fields.getField(formContext, fieldName);
            if (!field || !field.setRequiredLevel) {
                AssetCommonUtils.Output.outputError(fieldName, AssetCommonUtils.ErrorTypes.Null);
                return;
            }
            if (isRequired) {
                field.setRequiredLevel("required");
            }
            else {
                field.setRequiredLevel("recommended");
                if (fields.isEmpty(formContext, fieldName)) {
                    field.setValue(null); // reset "is required" notifications
                }
                fields.clearNotifications(formContext, fieldName);
            }
        }
        Form.setRequiredOrRecommended = setRequiredOrRecommended;
        function setVisible(formContext, fieldName, isVisible) {
            var fields = AssetCommonUtils.Form;
            var control = fields.getControl(formContext, fieldName);
            if (!control || !control.setVisible) {
                AssetCommonUtils.Output.outputError(fieldName, AssetCommonUtils.ErrorTypes.Null);
                return;
            }
            control.setVisible(isVisible);
        }
        Form.setVisible = setVisible;
        /**
         * Sets field notification with a localized value
         *
         * @param formContext       context of the current page
         * @param fieldName         name of the field
         * @param localizedStringId the localized string id of the notification message. Also, this is used as the uniqueId of the notification
         */
        function setNotificationLocalized(formContext, fieldName, localizedStringId) {
            var fieldControl = AssetCommonUtils.Form.getControl(formContext, fieldName);
            if (fieldControl) {
                var message = AssetCommon.StringProvider.getResourceString(localizedStringId);
                fieldControl.setNotification(message, localizedStringId);
            }
            else {
                AssetCommonUtils.Output.outputError(fieldName, AssetCommonUtils.ErrorTypes.Null);
            }
        }
        Form.setNotificationLocalized = setNotificationLocalized;
        /**
         * Sets the attribute validity and a notification message.
         * @param formContext       context of the current page
         * @param fieldName         name of the field
         * @param isValid Sets the attribute validity
         * @param localizedStringId Message to be shown
         */
        function setIsValid(formContext, fieldName, isValid, localizedStringId) {
            var fieldAttribute = formContext.getAttribute(fieldName);
            if (fieldAttribute) {
                var defaultBlockSaveMessage = fieldName; // Default message
                if (!isValid) {
                    // setting to block save
                    if (AssetCommonUtils.Object.isNotNullAndUndefined(localizedStringId)) {
                        defaultBlockSaveMessage =
                            AssetCommon.StringProvider.getResourceString(localizedStringId);
                    }
                    else {
                        AssetCommonUtils.Output.log("localizedStringId must not be null when setting setIsValid to false for '" +
                            fieldName +
                            "'");
                    }
                }
                fieldAttribute.setIsValid(isValid, defaultBlockSaveMessage);
            }
        }
        Form.setIsValid = setIsValid;
        function clearNotifications(formContext, field) {
            var fieldControl = AssetCommonUtils.Form.getControl(formContext, field);
            if (fieldControl) {
                if (fieldControl.clearNotification) {
                    fieldControl.clearNotification();
                }
                if (fieldControl.clearValidation) {
                    fieldControl.clearValidation();
                }
            }
            else {
                AssetCommonUtils.Output.outputError(field, AssetCommonUtils.ErrorTypes.Null);
            }
        }
        Form.clearNotifications = clearNotifications;
        function clearNotification(formContext, field, notificationId) {
            var fieldControl = AssetCommonUtils.Form.getControl(formContext, field);
            if (fieldControl) {
                if (fieldControl.clearNotification) {
                    fieldControl.clearNotification(notificationId);
                }
            }
            else {
                AssetCommonUtils.Output.outputError(field, AssetCommonUtils.ErrorTypes.Null);
            }
        }
        Form.clearNotification = clearNotification;
        function getType(formContext, field) {
            var fieldObject = AssetCommonUtils.Form.getField(formContext, field);
            if (fieldObject && fieldObject.getAttributeType) {
                return fieldObject.getAttributeType();
            }
            else {
                AssetCommonUtils.Output.outputError(field, AssetCommonUtils.ErrorTypes.Null);
            }
        }
        Form.getType = getType;
        function getText(formContext, field) {
            var fieldObject = AssetCommonUtils.Form.getField(formContext, field);
            if (fieldObject && fieldObject.getText) {
                return fieldObject.getText();
            }
            else {
                AssetCommonUtils.Output.outputError(field, AssetCommonUtils.ErrorTypes.Null);
            }
        }
        Form.getText = getText;
        function getValue(formContext, field) {
            var fieldObject = AssetCommonUtils.Form.getField(formContext, field);
            var fieldControl = AssetCommonUtils.Form.getControl(formContext, field);
            var controlIsValid = fieldControl && fieldControl.get_isValid
                ? fieldControl.get_isValid()
                : true;
            if (fieldObject && fieldObject.getValue) {
                var returnValue = controlIsValid ? fieldObject.getValue() : null;
                //Object is returning null array when we used "Remove Value" from lookup.
                if (returnValue != null && returnValue.length == 0)
                    returnValue = null;
                //typename is no longer available in CRM 7.1.
                //trying to recreate the typename from entityType
                if (returnValue != null && fieldObject.getAttributeType() == "lookup") {
                    var _entity = returnValue[0];
                    if ((typeof _entity.typename == "undefined" ||
                        _entity.typename == null) &&
                        typeof _entity.entityType != "undefined" &&
                        _entity.entityType != null) {
                        returnValue[0].typename = returnValue[0].entityType;
                    }
                }
                return returnValue;
            }
            else {
                AssetCommonUtils.Output.outputError(field, AssetCommonUtils.ErrorTypes.Null);
            }
        }
        Form.getValue = getValue;
        function hasValue(formContext, field) {
            return AssetCommonUtils.Object.isNotNullAndUndefined(getValue(formContext, field));
        }
        Form.hasValue = hasValue;
        function getInitialValue(formContext, field) {
            var fieldObject = AssetCommonUtils.Form.getField(formContext, field);
            if (fieldObject && fieldObject.getInitialValue) {
                return fieldObject.getInitialValue();
            }
            else {
                AssetCommonUtils.Output.outputError(field, AssetCommonUtils.ErrorTypes.Null);
            }
        }
        Form.getInitialValue = getInitialValue;
        function getMaxValue(formContext, field) {
            var fieldObject = AssetCommonUtils.Form.getField(formContext, field);
            if (fieldObject && fieldObject.getMax) {
                return fieldObject.getMax();
            }
            else {
                AssetCommonUtils.Output.outputError(field, AssetCommonUtils.ErrorTypes.Null);
            }
        }
        Form.getMaxValue = getMaxValue;
        function getSelectedOption(formContext, field) {
            var fieldObject = AssetCommonUtils.Form.getField(formContext, field);
            if (fieldObject && fieldObject.getSelectedOption) {
                return fieldObject.getSelectedOption();
            }
            else {
                AssetCommonUtils.Output.outputError(field, AssetCommonUtils.ErrorTypes.Null);
            }
        }
        Form.getSelectedOption = getSelectedOption;
        function setValue(formContext, field, value) {
            var fieldObject = AssetCommonUtils.Form.getField(formContext, field);
            var fieldObjectValue = AssetCommonUtils.Form.getValue(formContext, field);
            var UpdateField = false;
            if (fieldObjectValue == null && value == null)
                UpdateField = false;
            else if (fieldObjectValue == null)
                UpdateField = true;
            else if (value == null)
                UpdateField = true;
            else if (fieldObjectValue !== value)
                UpdateField = true;
            if (UpdateField == true) {
                if (fieldObject && fieldObject.setValue) {
                    fieldObject.setValue(value);
                    if (AssetCommonUtils.Form.getDisabled(formContext, field)) {
                        AssetCommonUtils.Form.setSubmitMode(formContext, field, "always");
                    }
                }
                else {
                    AssetCommonUtils.Output.outputError(field, AssetCommonUtils.ErrorTypes.Null);
                }
            }
        }
        Form.setValue = setValue;
        function publishValue(formContext, field, value) {
            setValue(formContext, field, value);
            fireOnChange(formContext, field);
        }
        Form.publishValue = publishValue;
        function setLookUp(formContext, fieldName, entityLogicalName, idOrObject, name) {
            var nameIsNullOrUndefined = name === null || typeof name === "undefined";
            if (idOrObject !== null &&
                !nameIsNullOrUndefined &&
                idOrObject.length > 0) {
                AssetCommonUtils.Form.setLookUpValue(formContext, fieldName, idOrObject, name, entityLogicalName);
            }
            else if (idOrObject !== null &&
                nameIsNullOrUndefined &&
                typeof idOrObject.Id !== "undefined" &&
                idOrObject.Id !== null) {
                AssetCommonUtils.Form.setLookUpValue(formContext, fieldName, idOrObject.Id, idOrObject.Name, idOrObject.LogicalName);
            }
            else if (idOrObject !== null &&
                nameIsNullOrUndefined &&
                idOrObject.length > 0 &&
                idOrObject[0] !== null &&
                idOrObject[0].id !== null) {
                AssetCommonUtils.Form.setLookUpValue(formContext, fieldName, idOrObject[0].id, idOrObject[0].name, idOrObject[0].typename);
            }
            else {
                AssetCommonUtils.Form.setValue(formContext, fieldName, null);
            }
        }
        Form.setLookUp = setLookUp;
        function setLookUpValue(formContext, field, id, name, entityType, keyValues, values) {
            var fieldObject = AssetCommonUtils.Form.getField(formContext, field);
            var fieldObjectValue = AssetCommonUtils.Form.getValue(formContext, field);
            var UpdateField = false;
            if (fieldObjectValue == null && id == null)
                UpdateField = false;
            else if (fieldObjectValue == null)
                UpdateField = true;
            else if (fieldObjectValue != null &&
                id != null &&
                fieldObjectValue[0].id.replace(/\{|\}/gi, "").toLowerCase() !=
                    id.replace(/\{|\}/gi, "").toLowerCase())
                UpdateField = true;
            if (UpdateField == true) {
                if (fieldObject && fieldObject.setValue) {
                    if (id.indexOf("{") == -1 && id.indexOf("}") == -1) {
                        id = "{" + id + "}";
                    }
                    id = id.toUpperCase();
                    var lookup = new Array();
                    lookup[0] = {};
                    lookup[0].id = id;
                    lookup[0].name = name;
                    lookup[0].entityType = entityType;
                    lookup[0].keyValues = keyValues;
                    lookup[0].values = values;
                    fieldObject.setValue(lookup);
                }
                else {
                    AssetCommonUtils.Output.outputError(field, AssetCommonUtils.ErrorTypes.Null);
                }
            }
        }
        Form.setLookUpValue = setLookUpValue;
        function publishLookUpValue(formContext, field, id, name, entityType, keyValues, values) {
            AssetCommonUtils.Form.setLookUpValue(formContext, field, id, name, entityType, keyValues, values);
            AssetCommonUtils.Form.fireOnChange(formContext, field);
        }
        Form.publishLookUpValue = publishLookUpValue;
        /**
         * If the value of field is null or, if it is string, empty/all whitespace
         * @param field
         */
        function isEmpty(formContext, field) {
            var value = AssetCommonUtils.Form.getValue(formContext, field);
            return !value || (typeof value == "string" && value.trim().length == 0);
        }
        Form.isEmpty = isEmpty;
        function isDirty(formContext, field) {
            var attribute = AssetCommonUtils.Form.getEntityAttribute(formContext, field);
            if (attribute && attribute.getIsDirty) {
                return attribute.getIsDirty();
            }
            else {
                AssetCommonUtils.Output.outputError(field, AssetCommonUtils.ErrorTypes.Null);
            }
        }
        Form.isDirty = isDirty;
        function disableField(formContext, field) {
            AssetCommonUtils.Form.setDisabled(formContext, field, true);
        }
        Form.disableField = disableField;
        function setDisabled(formContext, field, action) {
            var controlObject = formContext.getControl(field);
            if (controlObject && controlObject.setDisabled) {
                controlObject.setDisabled(action);
                var mode = null;
                if (!action) {
                    mode = "dirty";
                }
                else if (AssetCommonUtils.Form.isDirty(formContext, field)) {
                    mode = "always";
                }
                AssetCommonUtils.Form.setSubmitMode(formContext, field, mode);
            }
            else {
                AssetCommonUtils.Output.outputError(field, AssetCommonUtils.ErrorTypes.Null);
            }
        }
        Form.setDisabled = setDisabled;
        function getDisabled(formContext, field) {
            var controlObject = formContext.getControl(field);
            if (controlObject && controlObject.getDisabled) {
                return controlObject.getDisabled();
            }
            else {
                AssetCommonUtils.Output.outputError(field, AssetCommonUtils.ErrorTypes.Null);
            }
        }
        Form.getDisabled = getDisabled;
        function addOnChange(formContext, field, functionName) {
            var attribute = AssetCommonUtils.Form.getEntityAttribute(formContext, field);
            // since the API doesn't support checking that a handle is already subscribed
            // for preventing double subscribing - remove previous at first
            if (attribute && attribute.addOnChange) {
                if (attribute.removeOnChange) {
                    attribute.removeOnChange(functionName);
                }
                return attribute.addOnChange(functionName);
            }
            else {
                AssetCommonUtils.Output.outputError(field, AssetCommonUtils.ErrorTypes.Null);
            }
        }
        Form.addOnChange = addOnChange;
        function removeOnChange(formContext, field, functionName) {
            var attribute = AssetCommonUtils.Form.getEntityAttribute(formContext, field);
            if (attribute && attribute.removeOnChange) {
                return attribute.removeOnChange(functionName);
            }
            else {
                AssetCommonUtils.Output.outputError(field, AssetCommonUtils.ErrorTypes.Null);
            }
        }
        Form.removeOnChange = removeOnChange;
        function fireOnChange(formContext, field) {
            var fieldObject = AssetCommonUtils.Form.getEntityAttribute(formContext, field);
            if (fieldObject && fieldObject.fireOnChange) {
                return fieldObject.fireOnChange();
            }
            else {
                AssetCommonUtils.Output.outputError(field, AssetCommonUtils.ErrorTypes.Null);
            }
        }
        Form.fireOnChange = fireOnChange;
        function addOnSave(formContext, functionName) {
            try {
                // In some cases, like after a create, the onSave can be added more than once.
                // This can lead to loops and performance degradation.
                // By proactively removing the event before adding, it ensures there is only one from this add action
                formContext.data.entity.removeOnSave(functionName);
            }
            catch (ex) {
                // Should never hit this, but adding the warning just in case
                AssetCommonUtils.Output.warn("OnSave event not properly removed: " + ex);
            }
            return formContext.data.entity.addOnSave(functionName);
        }
        Form.addOnSave = addOnSave;
        function AddOnPostSave(formContext, functionName) {
            try {
                formContext.data.entity.removeOnPostSave(functionName);
            }
            catch (ex) {
                AssetCommonUtils.Output.warn("OnPostSave event not properly removed: " + ex);
            }
            return formContext.data.entity.addOnPostSave(functionName);
        }
        Form.AddOnPostSave = AddOnPostSave;
        function setSubmitMode(formContext, field, mode) {
            var fieldObject = AssetCommonUtils.Form.getField(formContext, field);
            if (fieldObject && fieldObject.setSubmitMode && mode && mode.length > 0) {
                fieldObject.setSubmitMode(mode);
            }
            else {
                AssetCommonUtils.Output.outputError(field, AssetCommonUtils.ErrorTypes.Null);
            }
        }
        Form.setSubmitMode = setSubmitMode;
        function getOption(formContext, field, value) {
            var fieldObject = AssetCommonUtils.Form.getField(formContext, field);
            if (fieldObject && fieldObject.getOption) {
                return fieldObject.getOption(value);
            }
            else {
                AssetCommonUtils.Output.outputError(field, AssetCommonUtils.ErrorTypes.Null);
            }
        }
        Form.getOption = getOption;
        function getOptions(formContext, field) {
            var fieldObject = AssetCommonUtils.Form.getField(formContext, field);
            if (fieldObject && fieldObject.getOptions) {
                return fieldObject.getOptions();
            }
            else {
                AssetCommonUtils.Output.outputError(field, AssetCommonUtils.ErrorTypes.Null);
            }
        }
        Form.getOptions = getOptions;
        function getLookupFieldValue(formContext, attributeName) {
            var value = AssetCommonUtils.Form.getValue(formContext, attributeName);
            if (value && value.length > 0) {
                return value[0];
            }
            return value;
        }
        Form.getLookupFieldValue = getLookupFieldValue;
        function getFormType(formContext) {
            if (formContext && formContext.ui) {
                return formContext.ui.getFormType();
            }
            else {
                AssetCommonUtils.Output.outputError("formContext.ui", AssetCommonUtils.ErrorTypes.Null);
            }
        }
        Form.getFormType = getFormType;
        function isFormType(formContext, formType) {
            return getFormType(formContext) === formType;
        }
        Form.isFormType = isFormType;
    })(Form = AssetCommonUtils.Form || (AssetCommonUtils.Form = {}));
})(AssetCommonUtils || (AssetCommonUtils = {}));
var AssetCommonUtils;
(function (AssetCommonUtils) {
    var Guid;
    (function (Guid) {
        function NewGuid() {
            var GenerateFourParts = function () {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            };
            return ("{" +
                GenerateFourParts() +
                GenerateFourParts() +
                "-" +
                GenerateFourParts() +
                "-" +
                GenerateFourParts() +
                "-" +
                GenerateFourParts() +
                "-" +
                GenerateFourParts() +
                GenerateFourParts() +
                GenerateFourParts() +
                "}");
        }
        Guid.NewGuid = NewGuid;
        function getGuidWithoutBrackets(guid) {
            return guid && guid.indexOf("}") >= 0
                ? guid.substr(1, guid.length - 2)
                : guid;
        }
        Guid.getGuidWithoutBrackets = getGuidWithoutBrackets;
        /*
         * Generate a random uuid.
         *
         * USAGE: Math.uuid(length, radix)
         *   length - the desired number of characters
         *   radix  - the number of allowable values for each character.
         *
         * EXAMPLES:
         *   // No arguments  - returns RFC4122, version 4 ID
         *   >>> Math.uuid()
         *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
         *
         *   // One argument - returns ID of the specified length
         *   >>> Math.uuid(15)     // 15 character ID (default base=62)
         *   "VcydxgltxrVZSTV"
         *
         *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
         *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
         *   "01001010"
         *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
         *   "47473046"
         *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
         *   "098F4D35"
         */
        function GUID(len, radix) {
            // Private array of chars to use
            var CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
            var chars = CHARS, uuid = [], rnd = Math.random;
            radix = radix || chars.length;
            if (len) {
                // Compact form
                for (var i = 0; i < len; i++)
                    uuid[i] = chars[0 | (rnd() * radix)];
            }
            else {
                // rfc4122, version 4 form
                var r;
                // rfc4122 requires these characters
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
                uuid[14] = "4";
                // Fill in random data.  At i==19 set the high bits of clock sequence as
                // per rfc4122, sec. 4.1.5
                for (var i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | (rnd() * 16);
                        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r & 0xf];
                    }
                }
            }
            return uuid.join("");
        }
        Guid.GUID = GUID;
    })(Guid = AssetCommonUtils.Guid || (AssetCommonUtils.Guid = {}));
})(AssetCommonUtils || (AssetCommonUtils = {}));
var AssetCommonUtils;
(function (AssetCommonUtils) {
    var Visibility;
    (function (Visibility) {
        function GetTab(form, tab) {
            return form.ui.tabs.get(tab);
        }
        Visibility.GetTab = GetTab;
    })(Visibility = AssetCommonUtils.Visibility || (AssetCommonUtils.Visibility = {}));
})(AssetCommonUtils || (AssetCommonUtils = {}));
/// <reference path="Form.ts" />
var AssetCommonUtils;
(function (AssetCommonUtils) {
    // AsyncJobTracker to be used for tracking Async Jobs; so we block the Save if Async Jobs are not finished yet.
    var AsyncJobTracker = /** @class */ (function () {
        /**
         * Constructor
         *
         * @param formContext             Form context (optional for now)
         * @param blockSaveAttributeName  An attribute used to block save (using field validation)
         */
        function AsyncJobTracker(formContext, blockSaveAttributeName) {
            this._jobCount = 0;
            this._lastJobRemoved = null;
            this._lastJobAdded = null;
            this._maxExecutionInSecond = 10; // The max number of seconds that an async job should be executed. If it's more than this, then we consider there is an issue
            this._asyncPendingJobsLocalizedId = "FormNotification_AsyncPendingJobsExist";
            this._asyncLongPendingJobsLocalizedId = "FormNotification_AsyncLongPendingJobsExist";
            this._blockSaveAttributeName = null;
            if (AssetCommonUtils.Object.isNotNullAndUndefined(formContext)) {
                this._defaultFormContext = formContext;
                if (blockSaveAttributeName) {
                    var blockSaveAttribute = AssetCommonUtils.Form.getEntityAttribute(formContext, blockSaveAttributeName);
                    // the input attribute name is valid
                    if (blockSaveAttribute) {
                        this._blockSaveAttributeName = blockSaveAttributeName;
                    }
                }
                // Uses the default attribute name
                if (!this._blockSaveAttributeName) {
                    this._blockSaveAttributeName =
                        this.getDefaultBlockSaveAttributeName(formContext);
                }
            }
            else {
                AssetCommonUtils.Output.outputError("AsyncJobTracker.formContext", AssetCommonUtils.ErrorTypes.Null);
            }
        }
        /**
         * Gets the default attribute name that is used to block save
         *
         * @param formContext Form context.
         * @returns a default attribute name
         * */
        AsyncJobTracker.prototype.getDefaultBlockSaveAttributeName = function (formContext) {
            var defaultAttributeName = "ownerid";
            // Gets the list of attributes and select the first one if found
            var attributes = AssetCommonUtils.Form.getEntityAttributes(formContext);
            if (attributes) {
                defaultAttributeName = attributes.get(0).getName();
            }
            return defaultAttributeName;
        };
        /**
         * Adds a job count to the tracker. Should be called before starting an async job
         * This should only be used in conjunction with RemoveJob
         *
         * @param formContext   Form context optional. If null, a default form context will be used.
         */
        AsyncJobTracker.prototype.addJob = function (formContext) {
            var _formContext = AssetCommonUtils.Form.getFormContextOrDefault(formContext);
            this._jobCount++;
            this._lastJobAdded = new Date();
            this.setBlockSave(_formContext);
        };
        /**
         * Removes a job count from the tracker. Should be called when an sync job is completed
         * This should only be used in conjunction with AddJob
         *
         * @param formContext   Form context optional. If null, a default form context will be used.
         */
        AsyncJobTracker.prototype.removeJob = function (formContext) {
            this._jobCount--;
            this._lastJobRemoved = new Date();
            if (!this.HasPendingJobs()) {
                var _formContext = AssetCommonUtils.Form.getFormContextOrDefault(formContext);
                this.clearPendingAsyncFormNotification(_formContext);
                this.setBlockSave(_formContext, false);
            }
        };
        // Checks if AsyncJobTracker has a default form context
        AsyncJobTracker.prototype.hasDefaultFormContext = function () {
            return AssetCommonUtils.Object.isNotNullAndUndefined(this._defaultFormContext);
        };
        // Checks if there are still any pending jobs
        AsyncJobTracker.prototype.HasPendingJobs = function () {
            return this._jobCount != 0;
        };
        AsyncJobTracker.prototype.clearPendingAsyncFormNotification = function (formContext) {
            AssetCommonUtils.Form.setNotification(formContext, this._asyncPendingJobsLocalizedId, false);
            AssetCommonUtils.Form.setNotification(formContext, this._asyncLongPendingJobsLocalizedId, false);
        };
        /**
         * Sets BlockSave by using setIsValid API
         *
         * @param formContext   Form context
         * @param blockSave     Boolean value to indicate enabling/disable blocking save. Default is true.
         * */
        AsyncJobTracker.prototype.setBlockSave = function (formContext, blockSave) {
            if (blockSave === void 0) { blockSave = true; }
            if (formContext) {
                AssetCommonUtils.Form.setIsValid(formContext, this._blockSaveAttributeName, !blockSave, this._asyncPendingJobsLocalizedId);
            }
        };
        return AsyncJobTracker;
    }());
    AssetCommonUtils.AsyncJobTracker = AsyncJobTracker;
})(AssetCommonUtils || (AssetCommonUtils = {}));
/*! WARNING! Do not update this file manually! Manual update of this file is not supported and will likely lead to issues. In addition, future solution upgrades wont apply to manually edited files. */
/// <reference path="Types.ts" />
/// <reference path="AsyncJobTracker.ts" />
var AssetCommon;
(function (AssetCommon) {
    var CrudApiSDK = /** @class */ (function () {
        function CrudApiSDK() {
        }
        CrudApiSDK.isOffline = function () {
            var context = Xrm.Utility.getGlobalContext();
            var clientState = context.client.getClientState();
            return clientState === AssetCommonUtils.ClientState.Offline;
        };
        CrudApiSDK.getGuidWithoutBrackets = function (guid) {
            return guid && guid.indexOf("}") >= 0
                ? guid.substr(1, guid.length - 2)
                : guid;
        };
        /** @method GetODataAttribute
         *   - Gets the OData attribute name based on the entity enabled for offline or not
         * @param  {string}     entityLogicalName
         * @param  {string}     attributeName
         * @param  {boolean}    forOffline     This will force the attribute name to be formatted for offline regardless if the entity is enabled for offline or not
         *                                     This parameter is optional with default value of false
         */
        CrudApiSDK.getODataAttribute = function (entityLogicalName, attributeName, forOffline) {
            if ((AssetCommon.CrudApiSDK.isAvailableOffline(entityLogicalName) &&
                AssetCommon.CrudApiSDK.isOffline()) ||
                (forOffline == true && AssetCommon.CrudApiSDK.isMobileClientOffline())) {
                return attributeName;
            }
            return "_" + attributeName + "_value";
        };
        CrudApiSDK.isMobileClientOffline = function () {
            var context = Xrm.Utility.getGlobalContext();
            var clientState = context.client.getClientState();
            return clientState == AssetCommonUtils.ClientState.Offline;
        };
        CrudApiSDK.isAvailableOffline = function (entityName) {
            return Xrm.WebApi.offline.isAvailableOffline(entityName);
        };
        /**
         * Retrieves a record and will only track the async job if there is
         * a callback (error or success) provided. If no callback is needed
         * and await retrieveRecord is intended, use retrieveRecordAsync instead.
         *
         * @param id
         * @param type
         * @param select
         * @param expand
         * @param successCallback
         * @param errorCallback
         * @param formContext
         * @param useAsyncJobTrackerIfAvailable
         */
        CrudApiSDK.retrieveRecord = function (id, type, select, expand, filter, successCallback, errorCallback, formContext, useAsyncJobTrackerIfAvailable) {
            if (useAsyncJobTrackerIfAvailable === void 0) { useAsyncJobTrackerIfAvailable = true; }
            var callbacks = CrudApiSDK.startTrackingAndWrapCallbacks(successCallback, errorCallback, formContext, useAsyncJobTrackerIfAvailable);
            var success = callbacks[0];
            var failure = callbacks[1];
            var systemQueryOptions = CrudApiSDK.getRetrieveOptionsString(select, expand, filter);
            if (CrudApiSDK.isOffline() && CrudApiSDK.isAvailableOffline(type)) {
                return Xrm.WebApi.offline
                    .retrieveRecord(type, id, systemQueryOptions)
                    .then(success, failure);
            }
            else {
                return Xrm.WebApi.retrieveRecord(type, id, systemQueryOptions).then(success, failure);
            }
        };
        /**
         * Retrieves multiple records and will only track the async job if there is
         * a callback (error or success) provided. If no callback is needed
         * and await retrieveMultipleRecords is intended, use retrieveMultipleRecordsAsync
         * instead.
         *
         * @param type
         * @param options
         * @param successCallback
         * @param errorCallback
         * @param formContext
         * @param useAsyncJobTrackerIfAvailable
         */
        CrudApiSDK.retrieveMultipleRecords = function (type, options, successCallback, errorCallback, formContext, useAsyncJobTrackerIfAvailable) {
            if (useAsyncJobTrackerIfAvailable === void 0) { useAsyncJobTrackerIfAvailable = true; }
            var callbacks = CrudApiSDK.startTrackingAndWrapCallbacks(successCallback, errorCallback, formContext, useAsyncJobTrackerIfAvailable);
            var success = callbacks[0];
            var failure = callbacks[1];
            if (CrudApiSDK.isOffline() && CrudApiSDK.isAvailableOffline(type)) {
                var optionsString = CrudApiSDK.getRetrieveMultipleOptionsString(options);
                return Xrm.WebApi.offline
                    .retrieveMultipleRecords(type, optionsString)
                    .then(success, failure);
            }
            else {
                return Xrm.WebApi.retrieveMultipleRecords(type, options).then(success, failure);
            }
        };
        CrudApiSDK.getRetrieveMultipleOptionsString = function (options) {
            var optionsString = "";
            if (options != null) {
                if (options.charAt(0) != "?") {
                    optionsString = "?" + options;
                }
                else {
                    optionsString = options;
                }
            }
            return optionsString;
        };
        /**
         * Starts tracking of the async job and wraps the callbacks in
         * a callback that will end the tracking once the job returns. If
         * the original callbacks are both null, no async job tracking will take
         * place.
         *
         * @param successCallback
         * @param errorCallback
         * @param formContext
         * @param useAsyncJobTrackerIfAvailable
         */
        CrudApiSDK.startTrackingAndWrapCallbacks = function (successCallback, errorCallback, formContext, useAsyncJobTrackerIfAvailable) {
            var success = successCallback;
            var failure = errorCallback;
            if (successCallback || errorCallback) {
                // Start tracking an async job
                CrudApiSDK.startTrackingAsyncJob(formContext, useAsyncJobTrackerIfAvailable);
                // Create callbacks that will untrack an async job and execute the original callbacks
                success = CrudApiSDK.createCallBackWithEndTrackingAsyncJob(formContext, useAsyncJobTrackerIfAvailable, successCallback);
                failure = CrudApiSDK.createCallBackWithEndTrackingAsyncJob(formContext, useAsyncJobTrackerIfAvailable, errorCallback);
            }
            return [success, failure];
        };
        /**
         * Starts tracking an async job
         * This should be called before executing an async operation
         *
         * @param formContext                    Form Context
         * @param useAsyncJobTrackerIfAvailable  Boolean value indicates to use AsyncJobTracker if available.
         */
        CrudApiSDK.startTrackingAsyncJob = function (formContext, useAsyncJobTrackerIfAvailable) {
            if (useAsyncJobTrackerIfAvailable &&
                CrudApiSDK.canUseAsyncJobTracker(formContext)) {
                CrudApiSDK.AsyncJobTracker.addJob(formContext);
            }
        };
        /**
         * End tracking an async job
         * This should be called after an async operation is completed (either if the operation succeeded or failed)
         *
         * @param formContext                    Form Context
         * @param useAsyncJobTrackerIfAvailable  Boolean value indicates to use AsyncJobTracker if available.
         */
        CrudApiSDK.endTrackingAsyncJob = function (formContext, useAsyncJobTrackerIfAvailable) {
            if (useAsyncJobTrackerIfAvailable &&
                CrudApiSDK.canUseAsyncJobTracker(formContext)) {
                CrudApiSDK.AsyncJobTracker.removeJob(formContext);
            }
        };
        /**
         * Checks if AsyncJobTracker can be used
         *
         * @param formContext
         */
        CrudApiSDK.canUseAsyncJobTracker = function (formContext) {
            // Checks:
            // -If only uses Async Tracker offline
            // -AsyncJobTracker and formContext are not null
            return ((!CrudApiSDK.UseAsyncJobTrackerOfflineOnly ||
                AssetCommon.CrudApiSDK.isOffline()) &&
                AssetCommonUtils.Object.isNotNullAndUndefined(CrudApiSDK.AsyncJobTracker) &&
                (AssetCommonUtils.Object.isNotNullAndUndefined(formContext) ||
                    CrudApiSDK.AsyncJobTracker.hasDefaultFormContext()));
        };
        /**
         * Create a new callback method that will execute the endTrackingAsyncJob and call the original callback afterward
         *
         * @param formContext                    Form context
         * @param useAsyncJobTrackerIfAvailable  Boolean value indicate to use AsyncJobTracker if it's available.
         * @param callback                       The original callback
         *
         * @returns a callback method that has an option to untrack an async job
         */
        CrudApiSDK.createCallBackWithEndTrackingAsyncJob = function (formContext, useAsyncJobTrackerIfAvailable, callback) {
            return function (data) {
                // Untrack an async job by removing a job from AsynJobTracker
                CrudApiSDK.endTrackingAsyncJob(formContext, useAsyncJobTrackerIfAvailable);
                // execute the original callback
                if (callback) {
                    callback(data);
                }
            };
        };
        CrudApiSDK.getRetrieveOptionsString = function (select, expand, filter, top, orderby) {
            var optionsString = "";
            if (select != null || expand != null) {
                var systemQueryParameters = new Array();
                if (select != null) {
                    systemQueryParameters.push("$select=" + select);
                }
                if (expand != null) {
                    systemQueryParameters.push("$expand=" + expand);
                }
                if (filter) {
                    systemQueryParameters.push("$filter=" + filter);
                }
                if (top) {
                    systemQueryParameters.push("$top=" + top);
                }
                if (orderby) {
                    systemQueryParameters.push("$orderby=" + orderby);
                }
                optionsString = "?".concat(systemQueryParameters.join("&"));
            }
            return optionsString;
        };
        CrudApiSDK.UseAsyncJobTrackerOfflineOnly = true;
        return CrudApiSDK;
    }());
    AssetCommon.CrudApiSDK = CrudApiSDK;
    var WebApiError = /** @class */ (function () {
        function WebApiError() {
        }
        return WebApiError;
    }());
    AssetCommon.WebApiError = WebApiError;
    var WebApiInnerError = /** @class */ (function () {
        function WebApiInnerError() {
        }
        return WebApiInnerError;
    }());
    AssetCommon.WebApiInnerError = WebApiInnerError;
})(AssetCommon || (AssetCommon = {}));
/// <reference path="../../Utilities/Form.ts" />
/// <reference path="../../Utilities/Guid.ts" />
/// <reference path="../../Utilities/Object.ts" />
/// <reference path="../../Utilities/Types.ts" />
/// <reference path="../../Utilities/Visibility.ts" />
/// <reference path="../../Utilities/WebApiSDK.ts" />
var CustomerAssetFormController = /** @class */ (function () {
    function CustomerAssetFormController(form) {
        this.AssetsAndLocationsTabNames = [
            "AssetHierarchy",
            "fstab_AssetHierarchy",
        ];
        this.SummaryTabName = "{b3f36061-1f16-4bbb-bd74-44fac42c9094}";
        this.KnowledgeSectionName = "knowledgesection";
        this.PropertiesTabName = "PropertyLogsTab";
        this.form = form;
    }
    CustomerAssetFormController.prototype.init = function () {
        this.HideAssetAndLocationsTabs();
        this.HideKnowledgeSectionIfCreateForm();
        this.HidePropertiesTabs();
        AssetCommonUtils.Form.AddOnPostSave(this.form, this.HideKnowledgeSectionIfCreateForm.bind(this));
        return this;
    };
    CustomerAssetFormController.prototype.refresh = function () {
        this.HideAssetAndLocationsTabs();
        this.HidePropertiesTabs();
        return this;
    };
    CustomerAssetFormController.prototype.HideKnowledgeSectionIfCreateForm = function () {
        var summaryTab = this.form.ui.tabs.get(this.SummaryTabName);
        if (AssetCommonUtils.Object.isNotNullAndUndefined(summaryTab)) {
            var knowledgeSection = summaryTab.sections.get(this.KnowledgeSectionName);
            if (AssetCommonUtils.Object.isNotNullAndUndefined(knowledgeSection)) {
                var isCreate = this.isCreateForm();
                knowledgeSection.setVisible(!isCreate);
            }
        }
    };
    CustomerAssetFormController.prototype.HideAssetAndLocationsTabs = function () {
        var isCreate = this.isCreateForm();
        for (var _i = 0, _a = this.AssetsAndLocationsTabNames; _i < _a.length; _i++) {
            var tabName = _a[_i];
            var assetsAndLocationsTab = AssetCommonUtils.Visibility.GetTab(this.form, tabName);
            assetsAndLocationsTab &&
                assetsAndLocationsTab.getVisible() &&
                assetsAndLocationsTab.setVisible(!isCreate);
        }
    };
    CustomerAssetFormController.prototype.HidePropertiesTabs = function () {
        var isCreate = this.isCreateForm();
        var propertiesTabName = AssetCommonUtils.Visibility.GetTab(this.form, this.PropertiesTabName);
        if (propertiesTabName && propertiesTabName.getVisible()) {
            propertiesTabName.setVisible(!isCreate);
        }
    };
    CustomerAssetFormController.prototype.isCreateForm = function () {
        return AssetCommonUtils.Form.isFormType(this.form, AssetCommonUtils.FormType.Create);
    };
    return CustomerAssetFormController;
}());
/// <reference path="AssetCommon.CustomerAssetFormController.ts"/>
var AssetCommon;
(function (AssetCommon) {
    var CustomerAsset = /** @class */ (function () {
        function CustomerAsset() {
        }
        CustomerAsset.OnLoad = function (eventContext) {
            if (!CustomerAsset.FormController) {
                // New Form
                CustomerAsset.FormController = new CustomerAssetFormController(eventContext.getFormContext()).init();
            }
            else {
                // A create form transitioning to an update should refresh all the controls.
                CustomerAsset.FormController.refresh();
            }
        };
        return CustomerAsset;
    }());
    AssetCommon.CustomerAsset = CustomerAsset;
})(AssetCommon || (AssetCommon = {}));
