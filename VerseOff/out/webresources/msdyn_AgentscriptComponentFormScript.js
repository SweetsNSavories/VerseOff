/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
///<reference path="../../../../references/internal/TypeDefinitions/XrmClientApi.d.ts" />
///<reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
var AgentScriptPackage;
(function (AgentScriptPackage) {
    "use strict";
    /**
     * Form event handlers for Agent script entity
     */
    var AgentscriptFormScript = /** @class */ (function () {
        function AgentscriptFormScript() {
        }
        /**
         * Form onload handler for agent script entity main form
         * @param executionContext execution context
         */
        AgentscriptFormScript.prototype.onFormLoad = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var languageAttribute = formContext.getAttribute(AgentScriptEntity.msdyn_language);
            var languageControl = formContext.getControl(AgentScriptEntity.msdyn_language);
            var languageOptions = languageControl.getOptions();
            if (this.isNullOrUndefined(languageOptions)) {
                // ToDo: Telemetry
                return;
            }
            var length = languageOptions.length;
            if (length <= 1) {
                // ToDo: Telemetry
                return;
            }
            if (this.isNullOrUndefined(languageAttribute.getValue())) {
                /** Set default language as user's language if inside of languageOption,
                otherwise, choose index 1 in list as index 0 is empty string */
                var userLanguage_1 = Xrm.Utility.getGlobalContext().userSettings.languageId;
                var foundLanguageOption = languageOptions.find(function (option) { return option.value == userLanguage_1; });
                var languageOption = foundLanguageOption || languageOptions[1];
                languageAttribute.setValue(languageOption.value);
            }
        };
        // Returns true if object is null or undefined
        AgentscriptFormScript.prototype.isNullOrUndefined = function (object) {
            return typeof object == "undefined" || object == null;
        };
        // Properties
        AgentscriptFormScript.Instance = new AgentscriptFormScript();
        return AgentscriptFormScript;
    }());
    AgentScriptPackage.AgentscriptFormScript = AgentscriptFormScript;
    /**
     * Attributes for agent script entity
     */
    var AgentScriptEntity = /** @class */ (function () {
        function AgentScriptEntity() {
        }
        AgentScriptEntity.msdyn_language = "msdyn_language";
        return AgentScriptEntity;
    }());
    AgentScriptPackage.AgentScriptEntity = AgentScriptEntity;
})(AgentScriptPackage || (AgentScriptPackage = {}));
