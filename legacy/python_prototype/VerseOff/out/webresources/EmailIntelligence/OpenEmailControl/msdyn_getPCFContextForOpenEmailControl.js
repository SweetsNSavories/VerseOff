var getPCFContext = window.getPCFContext || {};

(function () {
  "use strict";

  this.initializePCFContext = function (executionContext) {
    var formContext = executionContext.getFormContext();
    var globalContext = Xrm.Utility.getGlobalContext();
    this.copyDataToWindowForPCF(globalContext, formContext);
  };

  this.copyDataToWindowForPCF = function (globalContext, formContext) {
    if (typeof parent["OpenEmailInfo"] === "undefined") {
      parent.OpenEmailInfo = { __namespace: true };
    }

    parent.OpenEmailInfo.formContext = formContext;
    parent.OpenEmailInfo.globalContext = globalContext;
  };
}).call(getPCFContext);