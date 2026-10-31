/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var AgentScriptPackage;
(function (AgentScriptPackage) {
    "use strict";
    /**
     * Fields for AgentScriptStep entity
     */
    var AgentScriptStepEntity = /** @class */ (function () {
        function AgentScriptStepEntity() {
        }
        AgentScriptStepEntity.msdyn_actiontype = "msdyn_actiontype";
        AgentScriptStepEntity.msdyn_macroactionid = "msdyn_macroactionid";
        AgentScriptStepEntity.msdyn_routeactionid = "msdyn_routeactionid";
        AgentScriptStepEntity.msdyn_textinstruction = "msdyn_textinstruction";
        AgentScriptStepEntity.msdyn_description = "msdyn_description";
        return AgentScriptStepEntity;
    }());
    AgentScriptPackage.AgentScriptStepEntity = AgentScriptStepEntity;
    /**
     * Option set values for action type fields
     */
    var AgentScriptStepActionType = /** @class */ (function () {
        function AgentScriptStepActionType() {
        }
        AgentScriptStepActionType.TextAction = 192350000;
        AgentScriptStepActionType.MacroAction = 192350001;
        AgentScriptStepActionType.RouteAction = 192350002;
        AgentScriptStepActionType.Undefined = null;
        return AgentScriptStepActionType;
    }());
    AgentScriptPackage.AgentScriptStepActionType = AgentScriptStepActionType;
    /**
     * General constants
     */
    var Constants = /** @class */ (function () {
        function Constants() {
        }
        Constants.RequiredLevel = "required";
        Constants.OptionalLevel = "none";
        Constants.RecordIdParam = "record_Id";
        Constants.CreateMacrosDialog = "CreateMacrosMDD_v2";
        Constants.USRGeo = "USR";
        Constants.USEGeo = "USE";
        return Constants;
    }());
    AgentScriptPackage.Constants = Constants;
})(AgentScriptPackage || (AgentScriptPackage = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
///<reference path="Constants.ts" />
///<reference path="../../../../references/internal/TypeDefinitions/XrmClientApi.d.ts" />
///<reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
var AgentScriptPackage;
(function (AgentScriptPackage) {
    "use strict";
    var AgentScriptStepFormScript = /** @class */ (function () {
        function AgentScriptStepFormScript() {
        }
        /**
         * Form on-load event handler
         * Applicable forms: Quick create form and Main form
         * @param executionContext execution context
         */
        AgentScriptStepFormScript.prototype.onFormLoad = function (executionContext) {
            var resetValue = false;
            var formContext = executionContext.getFormContext();
            var formtype = formContext.ui.getFormType();
            this.removeMacroActionIfGeoIsBlocked(formContext);
            var actionTypeAttribute = formContext.getAttribute(AgentScriptPackage.AgentScriptStepEntity.msdyn_actiontype);
            var actionTypeValue = actionTypeAttribute.getValue();
            if (formtype == 1 /* Create */) {
                // For quick create form, reset route action field value which is set because of relationship mappings
                var routeActionAttribute = formContext.getAttribute(AgentScriptPackage.AgentScriptStepEntity.msdyn_routeactionid);
                routeActionAttribute.setValue(null);
                resetValue = true;
            }
            // Set action fields based on action type values
            this.setActionFields(executionContext, actionTypeValue, resetValue);
            // Set navigation for macro lookup 
            formContext.getControl(AgentScriptPackage.AgentScriptStepEntity.msdyn_macroactionid).addOnLookupTagClick(this.openMacroRecord);
        };
        /**
         * Remove macro action option if geo is blocked. Currently, macro action is not supported in GCC.
         * @param formContext
         */
        AgentScriptStepFormScript.prototype.removeMacroActionIfGeoIsBlocked = function (formContext) {
            var macroOptionValue = AgentScriptPackage.AgentScriptStepActionType.MacroAction;
            var actionTypeControl = formContext.getControl(AgentScriptPackage.AgentScriptStepEntity.msdyn_actiontype);
            if (this.isGeoBlocked()) {
                actionTypeControl.removeOption(macroOptionValue);
            }
        };
        AgentScriptStepFormScript.prototype.openMacroRecord = function (executionContext) {
            executionContext.getEventArgs().preventDefault();
            // Get the Currently Selected Record ID
            var selectedRecordGuid = executionContext.getFormContext().getAttribute(AgentScriptPackage.AgentScriptStepEntity.msdyn_macroactionid).getValue()[0].id;
            var vpHeight = window.top.Xrm.Page.ui.getViewPortHeight();
            var vpWidth = window.top.Xrm.Page.ui.getViewPortWidth();
            var dialogOptions = {
                width: vpWidth, height: vpHeight, position: 3 /* inline */
            };
            var dialogParams = {};
            dialogParams[AgentScriptPackage.Constants.RecordIdParam] = selectedRecordGuid;
            Xrm.Navigation.openDialog(AgentScriptPackage.Constants.CreateMacrosDialog, dialogOptions, dialogParams);
        };
        /**
         * Set various step action fields based on action type field selection
         * @param executionContext execution context
         * @param currentSelectedAction current selected action type
         * @param formType form type
         */
        AgentScriptStepFormScript.prototype.setActionFields = function (executionContext, currentSelectedAction, resetValue) {
            this.setTextActionComponents(executionContext, currentSelectedAction == AgentScriptPackage.AgentScriptStepActionType.TextAction, resetValue);
            this.setMacroActionComponents(executionContext, currentSelectedAction == AgentScriptPackage.AgentScriptStepActionType.MacroAction, resetValue);
            this.setRouteActionComponents(executionContext, currentSelectedAction == AgentScriptPackage.AgentScriptStepActionType.RouteAction, resetValue);
            this.setDescriptionFieldState(executionContext, currentSelectedAction, resetValue);
        };
        /**
         * Check if the organization is in a blocked Geo
         * @returns
         */
        AgentScriptStepFormScript.prototype.isGeoBlocked = function () {
            var organizationSettings = Xrm.Utility.getGlobalContext().organizationSettings;
            return organizationSettings.organizationGeo === AgentScriptPackage.Constants.USEGeo || organizationSettings.organizationGeo === AgentScriptPackage.Constants.USRGeo;
        };
        /**
         * ActionType attribute on-change handler
         * Applicable forms: Quick create form and Main form
         * @param executionContext execution context
         */
        AgentScriptStepFormScript.prototype.onActionTypeChange = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var formtype = formContext.ui.getFormType();
            var actionTypeAttribute = formContext.getAttribute(AgentScriptPackage.AgentScriptStepEntity.msdyn_actiontype);
            var actionTypeValue = actionTypeAttribute.getValue();
            this.setActionFields(executionContext, actionTypeValue, true);
        };
        /**
         * Set visibility state, required level for components related to text action fields
         * @param executionContext execution context
         * @param visibilityState field visibility state
         * @param formType form type
         */
        AgentScriptStepFormScript.prototype.setTextActionComponents = function (executionContext, visibilityState, resetValue) {
            var formContext = executionContext.getFormContext();
            var textActionAttribute = formContext.getAttribute(AgentScriptPackage.AgentScriptStepEntity.msdyn_textinstruction);
            var textActionControl = formContext.getControl(AgentScriptPackage.AgentScriptStepEntity.msdyn_textinstruction);
            textActionControl.setVisible(visibilityState);
            if (resetValue) {
                textActionAttribute.setValue(null);
            }
            this.setAttributeLevel(textActionAttribute, visibilityState);
        };
        /**
         * Set visility state, required level for components related to macro action fields
         * @param executionContext execution context
         * @param visibilityState visibility state
         * @param formType form type
         */
        AgentScriptStepFormScript.prototype.setMacroActionComponents = function (executionContext, visibilityState, resetValue) {
            var formContext = executionContext.getFormContext();
            var macroActionAttribute = formContext.getAttribute(AgentScriptPackage.AgentScriptStepEntity.msdyn_macroactionid);
            var macroActionControl = formContext.getControl(AgentScriptPackage.AgentScriptStepEntity.msdyn_macroactionid);
            macroActionControl.setVisible(visibilityState);
            if (resetValue) {
                macroActionAttribute.setValue(null);
            }
            this.setAttributeLevel(macroActionAttribute, visibilityState);
        };
        /**
         * Set visibility state, required level for components related to route action fields
         * @param executionContext execution context
         * @param visibilityState visibility state
         * @param formType form type
         */
        AgentScriptStepFormScript.prototype.setRouteActionComponents = function (executionContext, visibilityState, resetValue) {
            var formContext = executionContext.getFormContext();
            var routeActionAttribute = formContext.getAttribute(AgentScriptPackage.AgentScriptStepEntity.msdyn_routeactionid);
            var routeActionControl = formContext.getControl(AgentScriptPackage.AgentScriptStepEntity.msdyn_routeactionid);
            routeActionControl.setVisible(visibilityState);
            if (resetValue) {
                routeActionAttribute.setValue(null);
            }
            this.setAttributeLevel(routeActionAttribute, visibilityState);
        };
        /**
         * Set required level for the attribute based on visibility state
         * @param attribute attribute
         * @param visibilityState visibility state on the form
         */
        AgentScriptStepFormScript.prototype.setAttributeLevel = function (attribute, visibilityState) {
            if (this.isNullOrUndefined(attribute)) {
                // ToDo: Add Telemetry
                return;
            }
            var requiredLevel = visibilityState ? AgentScriptPackage.Constants.RequiredLevel : AgentScriptPackage.Constants.OptionalLevel;
            attribute.setRequiredLevel(requiredLevel);
        };
        /**
         * Set description field based on selected action type
         * @param executionContext execution context
         * @param actionType action type for the step
         * @param resetValue if resetting the value is required
         */
        AgentScriptStepFormScript.prototype.setDescriptionFieldState = function (executionContext, actionType, resetValue) {
            var formContext = executionContext.getFormContext();
            var descriptionControl = formContext.getControl(AgentScriptPackage.AgentScriptStepEntity.msdyn_description);
            var descriptionAttribute = formContext.getAttribute(AgentScriptPackage.AgentScriptStepEntity.msdyn_description);
            var visibilityState = !(actionType == AgentScriptPackage.AgentScriptStepActionType.TextAction);
            descriptionControl.setVisible(visibilityState);
            if (resetValue) {
                descriptionAttribute.setValue(null);
            }
        };
        /**
         * Form on-save event handler
         * Applicable forms: Quick create form and Main form
         * @param executionContext execution context
         */
        AgentScriptStepFormScript.prototype.onFormSave = function (executionContext) {
            // Placeholder for form save handling
        };
        /**
         * Returns true if object is null or undefined
         * @param object input parameter
         */
        AgentScriptStepFormScript.prototype.isNullOrUndefined = function (object) {
            return typeof object == "undefined" || object == null;
        };
        // Properties
        AgentScriptStepFormScript.Instance = new AgentScriptStepFormScript();
        return AgentScriptStepFormScript;
    }());
    AgentScriptPackage.AgentScriptStepFormScript = AgentScriptStepFormScript;
})(AgentScriptPackage || (AgentScriptPackage = {}));
