//Method to open share secured field dialog in system user entity page ribbon
function openShareSecuredFieldDialog() {
    Xrm.Navigation.openDialog('ShareSecuredFieldDialog', {
        width: 1000,
        height: 500,
        position: 1
    });
}

//Method to evaluate the condition for the enable rule to show share secured field button
function isSecuredFields() {
    var isSecured = false;
    var cacheKey = systemuser + "_cachedSecureFields";
    var cachedSecureFields = sessionStorage.getItem(cacheKey);

    if (!cachedSecureFields) {
        var attributesURL = Xrm.Utility.getGlobalContext().getClientUrl() +
            "/api/data/v9.1/EntityDefinitions(LogicalName='" + systemuser + "')/Attributes/Microsoft.Dynamics.CRM.AttributeMetadata?$select=IsSecured&$filter=IsSecured eq true";

        var request = new XMLHttpRequest();
        request.open("GET", attributesURL, false);
        request.setRequestHeader("OData-MaxVersion", "4.0");
        request.setRequestHeader("OData-Version", "4.0");
        request.setRequestHeader("Accept", "application/json");
        request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        request.send();

        if (request.status === 200) {
            var data = JSON.parse(request.responseText);
            sessionStorage.setItem(cacheKey, request.responseText);
            if (data && data.value && data.value.length > 0) {
                isSecured = true;
            }
        }
    } else {
        var data = JSON.parse(cachedSecureFields);
        if (data && data.value && data.value.length > 0) {
            isSecured = true;
        }
    }
    return isSecured;
}

function showSecuredFieldButtonBasedOnFCBInUCI() {
  var isVisible = false;
  if (Xrm.Internal.isUci() && Xrm.Page.data.entity.getEntityName() === "systemuser" &&
      Xrm.Internal.isFeatureEnabled("EnableModernShareSecuredFieldsDialog")) {
    isVisible = true;
  }
  return isVisible;
}
