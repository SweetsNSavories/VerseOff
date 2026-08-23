var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Microsoft;
(function (Microsoft) {
    var ProductivityMacros;
    (function (ProductivityMacros) {
        var MacrosDataLayer;
        (function (MacrosDataLayer) {
            var FPIHelper = /** @class */ (function () {
                function FPIHelper(isMock) {
                    FPIHelper.isAuthenticated = false;
                    FPIHelper.isMock = isMock;
                    FPIHelper.iFrameExists = false;
                    FPIHelper.authenticationFailure = false;
                    FPIHelper.requestMap = new MacrosDataLayer.RequestMap();
                    FPIHelper.HelperID = MacrosDataLayer.Utils.newGuid();
                    FPIHelper.OCEndPoint = new MacrosDataLayer.OCEndpoint(isMock);
                    FPIHelper.orgId = FPIHelper.getOrgId();
                    FPIHelper.pendingRequests = new Array();
                    if (MacrosDataLayer.Utils.isNullUndefinedorEmpty(window.omnichannelRequestStatus)) {
                        window.omnichannelRequestStatus = {};
                    }
                    if (MacrosDataLayer.Utils.isNullUndefinedorEmpty(FPIHelper.svcMap)) {
                        FPIHelper.OCEndPoint.retrieveOcEndpoint().then(function (endpoints) {
                            FPIHelper.svcMap = endpoints;
                            FPIHelper.ocBaseURL = endpoints.get(MacrosDataLayer.FPIConstants.OCBASEURLFIELD);
                            FPIHelper.fpiURL = endpoints.get(MacrosDataLayer.FPIConstants.OCFPIURLFIELD);
                            FPIHelper.startAuthentication();
                        }, function (error) {
                            //TODO: add telemetry.
                            console.log("Error retrieving OcEndpoint: " + error);
                        });
                    }
                    else {
                        FPIHelper.startAuthentication();
                    }
                }
                FPIHelper.getTenantId = function () {
                    try {
                        var tenantId = window.top.Xrm.Utility.getGlobalContext().organizationSettings.organizationTenant;
                        if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(tenantId)) {
                            return tenantId;
                        }
                    }
                    catch (error) {
                        return MacrosDataLayer.Utils.EMPTY_GUID;
                    }
                    return MacrosDataLayer.Utils.EMPTY_GUID;
                };
                FPIHelper.getAgentId = function () {
                    try {
                        var agentId = window.top.Xrm.Utility.getGlobalContext().userSettings.userId;
                        if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(agentId)) {
                            return agentId;
                        }
                    }
                    catch (error) {
                        return MacrosDataLayer.Utils.EMPTY_GUID;
                    }
                    return MacrosDataLayer.Utils.EMPTY_GUID;
                };
                FPIHelper.getOrgId = function () {
                    try {
                        var orgId = window.top.Xrm.Utility.getGlobalContext().organizationSettings.organizationId;
                        if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(orgId)) {
                            return orgId;
                        }
                    }
                    catch (error) {
                        return MacrosDataLayer.Utils.EMPTY_GUID;
                    }
                    return MacrosDataLayer.Utils.EMPTY_GUID;
                };
                /**
                 * Creates iframe if it does not exist, and queries it using STATUS message if it does to authenticate
                 */
                FPIHelper.startAuthentication = function () {
                    FPIHelper.addEventListener();
                    if (FPIHelper.doesIFrameExist()) {
                        FPIHelper.iFrameExists = true;
                        FPIHelper.queryAuthenticationStatus();
                    }
                    else {
                        FPIHelper.addFPIIframe();
                    }
                };
                FPIHelper.doesIFrameExist = function () {
                    // Validate FpiIframe DOM element
                    var fpiFrame = window.top.document.getElementById(MacrosDataLayer.FPIConstants.IFRAMEID);
                    if (MacrosDataLayer.Utils.isNullUndefinedorEmpty(fpiFrame)) {
                        return false;
                    }
                    return true;
                };
                /**
                 * Event listener for messages from FPI iframe
                 */
                FPIHelper.addEventListener = function () {
                    window.top.addEventListener(MacrosDataLayer.FPIConstants.FPIMESSAGE_EVENTNAME, FPIHelper.fpiCallBack.bind(this));
                };
                FPIHelper.getFPIUrlQueryParams = function () {
                    var queryParams = MacrosDataLayer.FPIConstants.FPI_COMPONENT_URL_PARAMETER;
                    queryParams = queryParams + "&orgId=" + FPIHelper.orgId;
                    queryParams = queryParams + "&tenantId=" + FPIHelper.getTenantId();
                    queryParams = queryParams + "&agentId=" + FPIHelper.getAgentId();
                    return queryParams;
                };
                /**
                 * Adds FPI Iframe to DOM
                 */
                FPIHelper.addFPIIframe = function () {
                    var FpiIframe = window.top.document.createElement("iframe");
                    FpiIframe.id = MacrosDataLayer.FPIConstants.IFRAMEID;
                    FpiIframe.title = MacrosDataLayer.FPIConstants.IFRAMETITLE;
                    FpiIframe.src = FPIHelper.fpiURL + this.getFPIUrlQueryParams();
                    FpiIframe.style.display = "none";
                    FpiIframe.onload = FPIHelper.fpiIframeExistsVerify.bind(this);
                    window.top.document.body.appendChild(FpiIframe);
                    FPIHelper.iFrameExists = true;
                };
                /**
                 * Queries FPI iframe if authenticated to return a tokenacquired event or begin authentication if not authenticated
                 */
                FPIHelper.queryAuthenticationStatus = function () {
                    var message = FPIHelper.createFPIRequestMessage(MacrosDataLayer.RequestTypes.STATUS, "", null, {});
                    FPIHelper.sendMessage(message);
                };
                FPIHelper.fpiIframeExistsVerify = function () {
                    if (!FPIHelper.doesIFrameExist()) {
                        FPIHelper.iFrameExists = false;
                    }
                };
                /**
                 * Function for dataResponse Success Handling
                 */
                FPIHelper.dataResponseSuccessHandling = function (event) {
                    var requestId = event.data.staticData.requestId;
                    if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(requestId)) {
                        var response = event.data.responseData;
                        try {
                            FPIHelper.requestMap.getRequestMapValue(requestId).resolve(response);
                            FPIHelper.requestMap.deleteFromRequestMap(requestId);
                            var map = window.omnichannelRequestStatus[event.data.staticData.consumerId];
                            map.set(event.data.staticData.requestId, event.data.transactionid);
                        }
                        catch (error) {
                            console.log("Error Success response handling : " + error);
                        }
                    }
                    else {
                        FPIHelper.handleInvalidRequestID(requestId);
                    }
                };
                /**
                * Function for dataResponse Failure Handling
                */
                FPIHelper.dataResponseFailureHandling = function (event) {
                    var requestId = event.data.staticData.requestId;
                    if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(requestId)) {
                        try {
                            FPIHelper.requestMap.getRequestMapValue(requestId).reject(event.data.responseData);
                            // Log failure with details
                            var statusCode = -1;
                            if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(event.data.statusCode)) {
                                statusCode = event.data.statusCode;
                            }
                            var additionalDetails = "status: " + statusCode;
                            FPIHelper.requestMap.deleteFromRequestMap(requestId);
                            var map = window.omnichannelRequestStatus[event.data.staticData.consumerId];
                            map.set(event.data.staticData.requestId, event.data.transactionid);
                        }
                        catch (error) {
                            console.log("Error failure response handling : " + error);
                        }
                    }
                    else {
                        FPIHelper.handleInvalidRequestID(requestId);
                    }
                };
                /*
                 * Invalid request Id Handler
                 */
                FPIHelper.handleInvalidRequestID = function (requestId) {
                    FPIHelper.requestMap.deleteFromRequestMap(requestId);
                };
                /**
                 * Method to process FPI Post response
                 * @param event Sent by FPI iframe with data
                 */
                FPIHelper.processIframeData = function (event) {
                    if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(event.data)) {
                        if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(event.data.staticData)) {
                            if (event.data.staticData.HelperID !== FPIHelper.HelperID)
                                return;
                            else {
                                // Do processing for this control instance based on isFailure and responseData
                                if (event.data.isFailure === false && event.data.statusCode === 200) {
                                    FPIHelper.dataResponseSuccessHandling(event);
                                }
                                else {
                                    // Log to (window as any).omnichannelRequestStatus and telemetry with transaction id
                                    // Call failure handler
                                    FPIHelper.dataResponseFailureHandling(event);
                                }
                            }
                        }
                    }
                };
                /**
                 * Sets authenticated status to true, returns any authentication promises, and fires pending requests
                 */
                FPIHelper.handleAuthSucess = function () {
                    FPIHelper.isAuthenticated = true;
                    if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(FPIHelper.authenticationQuery)) {
                        FPIHelper.authenticationQuery.resolve(true);
                    }
                    while (FPIHelper.pendingRequests.length > 0) {
                        var message = FPIHelper.pendingRequests.pop();
                        message = FPIHelper.addOCBaseURL(message);
                        message = FPIHelper.addOrgIDHeader(message);
                        FPIHelper.sendMessage(message);
                    }
                };
                FPIHelper.handleAuthFailure = function (statusText) {
                    FPIHelper.authenticationFailure = true;
                    if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(FPIHelper.authenticationQuery)) {
                        FPIHelper.authenticationQuery.resolve(false);
                    }
                    while (FPIHelper.pendingRequests.length > 0) {
                        var message = FPIHelper.pendingRequests.pop();
                        var requestId = message.staticData.requestId;
                        try {
                            var authFailureResponse = new MacrosDataLayer.FPIAuthenticationFailureResponse();
                            FPIHelper.requestMap.getRequestMapValue(requestId).reject(authFailureResponse);
                            FPIHelper.requestMap.deleteFromRequestMap(requestId);
                        }
                        catch (error) {
                            console.log("Error handling auth failure : " + error);
                        }
                    }
                };
                /**
                 * Callback method for message event
                 * @param event Message sent by FPI Iframe
                 */
                FPIHelper.fpiCallBack = function (event) {
                    if (MacrosDataLayer.Utils.isNullUndefinedorEmpty(event.data) || !MacrosDataLayer.Utils.isFPIApp(event, MacrosDataLayer.FPIConstants.IFRAME_APPNAME)) {
                        return;
                    }
                    if (MacrosDataLayer.Utils.isTokenAcquired(event, MacrosDataLayer.FPIConstants.IFRAMEID, MacrosDataLayer.FPIConstants.IFRAME_APPNAME)) //Authentication successful and token is acquired
                     {
                        this.handleAuthSucess();
                    }
                    else {
                        /* Process GET/POST Response
                         * Token is acquired and received response back to the control
                         */
                        if (FPIHelper.isAuthenticated) {
                            FPIHelper.processIframeData(event);
                        }
                        else if (MacrosDataLayer.Utils.isAuthFailure(event, MacrosDataLayer.FPIConstants.IFRAME_APPNAME)) {
                            this.handleAuthFailure(event.data.responseText);
                        }
                    }
                };
                /**
                 * Ensures constructor has been called and instance available
                 */
                FPIHelper.getInstance = function (isMock) {
                    if (MacrosDataLayer.Utils.isNullUndefinedorEmpty(FPIHelper.instance)) {
                        FPIHelper.instance = new FPIHelper(isMock);
                    }
                    return FPIHelper.instance;
                };
                /**
                 * Creates FPI request message
                 * @param method method name of the request
                 * @param url url for the request
                 * @param payload payload for the request
                 * @param orgId orgId
                 * @param staticData staticData to be included in message
                 */
                FPIHelper.createFPIRequestMessage = function (method, url, payload, staticData) {
                    var message = new MacrosDataLayer.FPIRequestMessage();
                    message.url = url;
                    message.payload = payload;
                    message.requestType = method;
                    message.staticData = staticData;
                    message.header = { "OrganizationId": FPIHelper.orgId };
                    return message;
                };
                /**
                 * Posts message on FPI Iframe
                 * @param message message to be posted
                 */
                FPIHelper.sendMessage = function (message) {
                    try {
                        if (MacrosDataLayer.Utils.isNullUndefinedorEmpty(window.omnichannelRequestStatus[message.staticData.consumerId])) {
                            window.omnichannelRequestStatus[message.staticData.consumerId] = new Map();
                        }
                        var map = window.omnichannelRequestStatus[message.staticData.consumerId];
                        if (map.size >= 10) {
                            map.delete(map.keys().next().value);
                        }
                        map.set(message.staticData.requestId, "Pending");
                    }
                    catch (error) {
                        //TODO: add telemetry.
                        console.log("Error sending message : " + error);
                    }
                    var fpiFrame = window.top.document.getElementById(MacrosDataLayer.FPIConstants.IFRAMEID);
                    if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(fpiFrame)) {
                        // Post message on FPI Iframe
                        console.log("Message sent to FPI");
                        fpiFrame.contentWindow.postMessage(message, "*");
                    }
                    else {
                        console.log("FPIIframe is not defined : ");
                    }
                };
                /**
                 * Ability for consumer to manually authenticate or wait for authentication
                 * Returns a promise that resolved to true if authenticated and false if auth failure
                 */
                FPIHelper.authenticate = function () {
                    if (FPIHelper.isAuthenticated && FPIHelper.iFrameExists) {
                        return Promise.resolve(true);
                    }
                    if (FPIHelper.authenticationFailure) {
                        return Promise.resolve(false);
                    }
                    var authenticationPromise;
                    if (MacrosDataLayer.Utils.isNullUndefinedorEmpty(window.$) || MacrosDataLayer.Utils.isNullUndefinedorEmpty(window.$.Deferred())) {
                        authenticationPromise = window.top.$.Deferred();
                    }
                    else {
                        authenticationPromise = window.$.Deferred();
                    }
                    FPIHelper.authenticationQuery = authenticationPromise;
                    return FPIHelper.authenticationQuery;
                };
                FPIHelper.addOCBaseURL = function (message) {
                    if (FPIHelper.isMock === true) {
                        return message;
                    }
                    if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(FPIHelper.ocBaseURL)) {
                        message.url = FPIHelper.ocBaseURL + message.url;
                        return message;
                    }
                    return message;
                };
                FPIHelper.addOrgIDHeader = function (message) {
                    if (MacrosDataLayer.Utils.isNullUndefinedorEmpty(message.header)) {
                        message.header = { "OrganizationId": FPIHelper.orgId };
                    }
                    else {
                        if (typeof message.header === "object") {
                            message.header.OrganizationId = FPIHelper.orgId;
                        }
                    }
                    return message;
                };
                /**
                 * Makes a request via FPI iframe
                 * @param message FPIRequestMessage object - does not need organization ID in headers or base URL in URL
                 * @param requestId For logging - needs to match staticData.requestId
                 */
                FPIHelper.makeFPIRequest = function (message, requestId) {
                    var dataPromise;
                    if (MacrosDataLayer.Utils.isNullUndefinedorEmpty(window.$) || MacrosDataLayer.Utils.isNullUndefinedorEmpty(window.$.Deferred)) {
                        dataPromise = window.top.$.Deferred();
                    }
                    else {
                        dataPromise = window.$.Deferred();
                    }
                    if (message && message.staticData && message.staticData.requestId && message.staticData.requestId === requestId && FPIHelper.authenticationFailure === false) {
                        message.staticData.HelperID = FPIHelper.HelperID;
                        FPIHelper.requestMap.addToRequestMap(message.staticData.requestId, dataPromise);
                        if (FPIHelper.isAuthenticated) {
                            message = FPIHelper.addOCBaseURL(message);
                            message = FPIHelper.addOrgIDHeader(message);
                            FPIHelper.sendMessage(message);
                        }
                        else {
                            FPIHelper.pendingRequests.push(message);
                        }
                        return dataPromise;
                    }
                    else if (!(message && message.staticData && message.staticData.requestId && message.staticData.requestId === requestId)) {
                        return dataPromise.reject("Static data must contain requestId property");
                    }
                    else {
                        var authFailureResponse = new MacrosDataLayer.FPIAuthenticationFailureResponse();
                        return dataPromise.reject(authFailureResponse);
                    }
                };
                FPIHelper.instance = null;
                return FPIHelper;
            }());
            MacrosDataLayer.FPIHelper = FPIHelper;
        })(MacrosDataLayer = ProductivityMacros.MacrosDataLayer || (ProductivityMacros.MacrosDataLayer = {}));
    })(ProductivityMacros = Microsoft.ProductivityMacros || (Microsoft.ProductivityMacros = {}));
})(Microsoft || (Microsoft = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Microsoft;
(function (Microsoft) {
    var ProductivityMacros;
    (function (ProductivityMacros) {
        var MacrosDataLayer;
        (function (MacrosDataLayer) {
            var CCAFPIHelper = /** @class */ (function () {
                function CCAFPIHelper() {
                    CCAFPIHelper.isAuthenticated = false;
                    CCAFPIHelper.iFrameExists = false;
                    CCAFPIHelper.authenticationFailure = false;
                    CCAFPIHelper.requestMap = new MacrosDataLayer.RequestMap();
                    CCAFPIHelper.HelperID = MacrosDataLayer.Utils.newGuid();
                    CCAFPIHelper.orgId = CCAFPIHelper.getOrgId();
                    CCAFPIHelper.pendingRequests = new Array();
                    CCAFPIHelper.startAuthentication();
                }
                CCAFPIHelper.getOrgId = function () {
                    try {
                        var orgId = window.top.Xrm.Utility.getGlobalContext().organizationSettings.organizationId;
                        if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(orgId)) {
                            return orgId;
                        }
                    }
                    catch (error) {
                        return MacrosDataLayer.Utils.EMPTY_GUID;
                    }
                    return MacrosDataLayer.Utils.EMPTY_GUID;
                };
                /**
                 * Creates iframe if it does not exist, and queries it using STATUS message if it does to authenticate
                 */
                CCAFPIHelper.startAuthentication = function () {
                    CCAFPIHelper.addEventListener();
                    if (CCAFPIHelper.doesIFrameExist()) {
                        CCAFPIHelper.iFrameExists = true;
                        CCAFPIHelper.queryAuthenticationStatus();
                    }
                    else {
                        CCAFPIHelper.addFPIIframe();
                    }
                };
                CCAFPIHelper.doesIFrameExist = function () {
                    // Validate FpiIframe DOM element
                    var fpiFrame = window.top.document.getElementById(MacrosDataLayer.FPIConstants.CCAIFRAMEID);
                    if (MacrosDataLayer.Utils.isNullUndefinedorEmpty(fpiFrame)) {
                        return false;
                    }
                    return true;
                };
                /**
                 * Event listener for messages from FPI iframe
                 */
                CCAFPIHelper.addEventListener = function () {
                    window.top.addEventListener(MacrosDataLayer.FPIConstants.FPIMESSAGE_EVENTNAME, CCAFPIHelper.fpiCallBack.bind(this));
                };
                CCAFPIHelper.getIslandUrl = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var action, _xrm, response, jsonResponse, firstPartyEndpoint, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    action = {
                                        getMetadata: function () {
                                            return {
                                                boundParameter: undefined,
                                                operationName: "msdyn_getIslandUrl",
                                                operationType: 0,
                                                parameterTypes: {},
                                            };
                                        },
                                    };
                                    _xrm = window.Xrm;
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 4, , 5]);
                                    return [4 /*yield*/, _xrm.WebApi.online.execute(action)];
                                case 2:
                                    response = _a.sent();
                                    return [4 /*yield*/, response.json()];
                                case 3:
                                    jsonResponse = _a.sent();
                                    firstPartyEndpoint = jsonResponse.Result.toLowerCase();
                                    return [2 /*return*/, firstPartyEndpoint];
                                case 4:
                                    error_1 = _a.sent();
                                    MacrosDataLayer.Utils.XrmReportFailure("CCAFPIHelper", error_1, "", [
                                        { name: "getIslandUrl", value: "getIslandUrl failed" }
                                    ]);
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    });
                };
                /**
                 * Adds FPI Iframe to DOM
                 */
                CCAFPIHelper.addFPIIframe = function () {
                    try {
                        CCAFPIHelper.getIslandUrl().then(function (firstPartyEndpoint) {
                            var FpiIframe = window.top.document.createElement("iframe");
                            FpiIframe.id = MacrosDataLayer.FPIConstants.CCAIFRAMEID;
                            FpiIframe.name = MacrosDataLayer.FPIConstants.CCAIFRAMEID;
                            FpiIframe.title = MacrosDataLayer.FPIConstants.CCAIFRAMETITLE;
                            FpiIframe.src = firstPartyEndpoint + "/macro/index.html";
                            FpiIframe.style.display = "none";
                            FpiIframe.onload = CCAFPIHelper.fpiIframeExistsVerify.bind(this);
                            window.top.document.body.appendChild(FpiIframe);
                            CCAFPIHelper.iFrameExists = true;
                        });
                    }
                    catch (error) {
                        MacrosDataLayer.Utils.XrmReportFailure("CCAFPIHelper", error, "", [
                            { name: "addFPIIFrame", value: "Failed to add CCA FPI IFrame to DOM" }
                        ]);
                    }
                };
                /**
                 * Queries FPI iframe if authenticated to return a tokenacquired event or begin authentication if not authenticated
                 */
                CCAFPIHelper.queryAuthenticationStatus = function () {
                    var message = CCAFPIHelper.createFPIRequestMessage(MacrosDataLayer.RequestTypes.STATUS, "", null, {});
                    CCAFPIHelper.sendMessage(message);
                };
                CCAFPIHelper.fpiIframeExistsVerify = function () {
                    if (!CCAFPIHelper.doesIFrameExist()) {
                        CCAFPIHelper.iFrameExists = false;
                    }
                };
                /**
                 * Function for dataResponse Success Handling
                 */
                CCAFPIHelper.dataResponseSuccessHandling = function (event) {
                    var requestId = event.data.staticData.requestId;
                    if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(requestId)) {
                        var response = event.data.responseData;
                        try {
                            CCAFPIHelper.requestMap.getRequestMapValue(requestId).resolve(response);
                            CCAFPIHelper.requestMap.deleteFromRequestMap(requestId);
                        }
                        catch (error) {
                            MacrosDataLayer.Utils.XrmReportFailure("CCAFPIHelper", error, "", [
                                { name: "dataResponseSuccessHandling", value: "Data Response Success handling for Request Id: " + event.data.staticData.requestId + " failed with Status: " + event.data.statusText }
                            ]);
                        }
                    }
                    else {
                        CCAFPIHelper.handleInvalidRequestID(requestId);
                    }
                };
                /**
                * Function for dataResponse Failure Handling
                */
                CCAFPIHelper.dataResponseFailureHandling = function (event) {
                    var requestId = event.data.staticData.requestId;
                    if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(requestId)) {
                        try {
                            CCAFPIHelper.requestMap.getRequestMapValue(requestId).reject(event.data.responseData);
                            // Log failure with details
                            var statusCode = -1;
                            if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(event.data.statusCode)) {
                                statusCode = event.data.statusCode;
                            }
                            var additionalDetails = "status: " + statusCode;
                            CCAFPIHelper.requestMap.deleteFromRequestMap(requestId);
                        }
                        catch (error) {
                            MacrosDataLayer.Utils.XrmReportFailure("CCAFPIHelper", error, "", [
                                { name: "dataResponseFailureHandling", value: "Data Response Failure handling for Request Id: " + event.data.staticData.requestId + " failed with Status: " + event.data.statusText }
                            ]);
                        }
                    }
                    else {
                        CCAFPIHelper.handleInvalidRequestID(requestId);
                    }
                };
                /*
                 * Invalid request Id Handler
                 */
                CCAFPIHelper.handleInvalidRequestID = function (requestId) {
                    CCAFPIHelper.requestMap.deleteFromRequestMap(requestId);
                };
                /**
                 * Method to process FPI Post response
                 * @param event Sent by FPI iframe with data
                 */
                CCAFPIHelper.processIframeData = function (event) {
                    if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(event.data)) {
                        if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(event.data.staticData)) {
                            if (event.data.staticData.HelperID !== CCAFPIHelper.HelperID)
                                return;
                            else {
                                // Do processing for this control instance based on isFailure and responseData
                                if (event.data.isFailure === false && event.data.statusCode === 200) {
                                    CCAFPIHelper.dataResponseSuccessHandling(event);
                                }
                                else {
                                    // Call failure handler
                                    CCAFPIHelper.dataResponseFailureHandling(event);
                                }
                            }
                        }
                    }
                };
                /**
                 * Sets authenticated status to true, returns any authentication promises, and fires pending requests
                 */
                CCAFPIHelper.handleAuthSucess = function () {
                    MacrosDataLayer.Utils.XrmReportEvent("CCAFPIHelper", [
                        { name: "handleAuthSuccess", value: "Authentication Successful" }
                    ]);
                    CCAFPIHelper.isAuthenticated = true;
                    if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(CCAFPIHelper.authenticationQuery)) {
                        CCAFPIHelper.authenticationQuery.resolve(true);
                    }
                    while (CCAFPIHelper.pendingRequests.length > 0) {
                        var message = CCAFPIHelper.pendingRequests.pop();
                        CCAFPIHelper.sendMessage(message);
                    }
                };
                CCAFPIHelper.handleAuthFailure = function (statusText) {
                    MacrosDataLayer.Utils.XrmReportEvent("CCAFPIHelper", [
                        { name: "handleAuthFailure", value: "Authentication Failed with Status: " + statusText }
                    ]);
                    CCAFPIHelper.authenticationFailure = true;
                    if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(CCAFPIHelper.authenticationQuery)) {
                        CCAFPIHelper.authenticationQuery.resolve(false);
                    }
                    while (CCAFPIHelper.pendingRequests.length > 0) {
                        var message = CCAFPIHelper.pendingRequests.pop();
                        var requestId = message.staticData.requestId;
                        try {
                            var authFailureResponse = new MacrosDataLayer.FPIAuthenticationFailureResponse();
                            CCAFPIHelper.requestMap.getRequestMapValue(requestId).reject(authFailureResponse);
                            CCAFPIHelper.requestMap.deleteFromRequestMap(requestId);
                        }
                        catch (error) {
                            MacrosDataLayer.Utils.XrmReportFailure("CCAFPIHelper", error, "", [
                                { name: "handleAuthFailure", value: "Error handling Auth Failure" }
                            ]);
                        }
                    }
                };
                /**
                 * Callback method for message event
                 * @param event Message sent by FPI Iframe
                 */
                CCAFPIHelper.fpiCallBack = function (event) {
                    CCAFPIHelper.convertResponseMessage(event);
                    if (MacrosDataLayer.Utils.isNullUndefinedorEmpty(event.data) || !MacrosDataLayer.Utils.isFPIApp(event, MacrosDataLayer.FPIConstants.CCAIFRAMEAPPNAME)) {
                        return;
                    }
                    if (MacrosDataLayer.Utils.isTokenAcquired(event, MacrosDataLayer.FPIConstants.CCAIFRAMEID, MacrosDataLayer.FPIConstants.CCAIFRAMEAPPNAME)) //Authentication successful and token is acquired
                     {
                        this.handleAuthSucess();
                    }
                    else {
                        /* Process GET/POST Response
                         * Token is acquired and received response back to the control
                         */
                        if (CCAFPIHelper.isAuthenticated) {
                            CCAFPIHelper.processIframeData(event);
                        }
                        else if (MacrosDataLayer.Utils.isAuthFailure(event, MacrosDataLayer.FPIConstants.CCAIFRAMEAPPNAME)) {
                            this.handleAuthFailure(event.data.responseText);
                        }
                    }
                };
                /**
                 * Ensures constructor has been called and instance available
                 */
                CCAFPIHelper.getInstance = function () {
                    if (MacrosDataLayer.Utils.isNullUndefinedorEmpty(CCAFPIHelper.instance)) {
                        CCAFPIHelper.instance = new CCAFPIHelper();
                    }
                    return CCAFPIHelper.instance;
                };
                /**
                 * Creates FPI request message
                 * @param method method name of the request
                 * @param url url for the request
                 * @param payload payload for the request
                 * @param orgId orgId
                 * @param staticData staticData to be included in message
                 */
                CCAFPIHelper.createFPIRequestMessage = function (method, url, payload, staticData) {
                    var message = new MacrosDataLayer.CCAFPIRequestMessage();
                    message.url = url;
                    message.payload = payload;
                    message.requestType = method;
                    message.staticData = staticData;
                    message.header = { OrganizationId: CCAFPIHelper.orgId };
                    return message;
                };
                /**
                 * Posts message on FPI Iframe
                 * @param message message to be posted
                 */
                CCAFPIHelper.sendMessage = function (message) {
                    var fpiFrame = window.top.document.getElementById(MacrosDataLayer.FPIConstants.CCAIFRAMEID);
                    if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(fpiFrame)) {
                        MacrosDataLayer.Utils.XrmReportEvent("CCAFPIHelper", [
                            { name: "sendMessage", value: "Message sent to FPI: " + message.requestType }
                        ]);
                        // Post message on FPI Iframe
                        fpiFrame.contentWindow.postMessage(CCAFPIHelper.convertRequestMessage(message), fpiFrame.src);
                    }
                    else {
                        MacrosDataLayer.Utils.XrmReportEvent("CCAFPIHelper", [
                            { name: "sendMessage", value: "CCA FPIIframe is not defined" }
                        ]);
                    }
                };
                /**
                 * Ability for consumer to manually authenticate or wait for authentication
                 * Returns a promise that resolved to true if authenticated and false if auth failure
                 */
                CCAFPIHelper.authenticate = function () {
                    if (CCAFPIHelper.isAuthenticated && CCAFPIHelper.iFrameExists) {
                        return Promise.resolve(true);
                    }
                    if (CCAFPIHelper.authenticationFailure) {
                        return Promise.resolve(false);
                    }
                    var authenticationPromise;
                    if (MacrosDataLayer.Utils.isNullUndefinedorEmpty(window.$) || MacrosDataLayer.Utils.isNullUndefinedorEmpty(window.$.Deferred())) {
                        authenticationPromise = window.top.$.Deferred();
                    }
                    else {
                        authenticationPromise = window.$.Deferred();
                    }
                    CCAFPIHelper.authenticationQuery = authenticationPromise;
                    return CCAFPIHelper.authenticationQuery;
                };
                /**
                 * Makes a request via FPI iframe
                 * @param message CCAFPIRequestMessage object - does not need organization ID in headers or base URL in URL
                 * @param requestId For logging - needs to match staticData.requestId
                 */
                CCAFPIHelper.prototype.makeFPIRequest = function (message, requestId) {
                    var dataPromise;
                    if (MacrosDataLayer.Utils.isNullUndefinedorEmpty(window.$) || MacrosDataLayer.Utils.isNullUndefinedorEmpty(window.$.Deferred)) {
                        dataPromise = window.top.$.Deferred();
                    }
                    else {
                        dataPromise = window.$.Deferred();
                    }
                    if (message && message.staticData && message.staticData.requestId && message.staticData.requestId === requestId && CCAFPIHelper.authenticationFailure === false) {
                        message.staticData.HelperID = CCAFPIHelper.HelperID;
                        CCAFPIHelper.requestMap.addToRequestMap(message.staticData.requestId, dataPromise);
                        var ccaFPIIFrame = window.top.document.getElementById(MacrosDataLayer.FPIConstants.CCAIFRAMEID);
                        if (MacrosDataLayer.Utils.isNullUndefinedorEmpty(ccaFPIIFrame)) {
                            CCAFPIHelper.pendingRequests.push(message);
                        }
                        else {
                            CCAFPIHelper.sendMessage(message);
                        }
                        return dataPromise;
                    }
                    else if (!(message && message.staticData && message.staticData.requestId && message.staticData.requestId === requestId)) {
                        return dataPromise.reject("Static data must contain requestId property");
                    }
                    else {
                        var authFailureResponse = new MacrosDataLayer.FPIAuthenticationFailureResponse();
                        return dataPromise.reject(authFailureResponse);
                    }
                };
                CCAFPIHelper.convertRequestMessage = function (message) {
                    var data = new MacrosDataLayer.FpiRequestMessageEventData();
                    data.apiUrl = message.url;
                    data.resourceUri = message.resource;
                    data.methodType = message.requestType;
                    data.postdata = message.payload;
                    data.additionalHeaders = message.header;
                    data.fpiClientId = message.fpiClientId;
                    var eventData = new MacrosDataLayer.FpiRequestMessageEvent();
                    eventData.method = message.requestType === MacrosDataLayer.RequestTypes.STATUS ? MacrosDataLayer.FPIConstants.QUERY_FPI_STATUS : MacrosDataLayer.FPIConstants.EXTERNAL_REST_ODATA_API;
                    eventData.windowPostMessageProxy = message.staticData;
                    eventData.data = data;
                    return eventData;
                };
                CCAFPIHelper.convertResponseMessage = function (messageEvent) {
                    var data = messageEvent.data;
                    if (!data) {
                        return;
                    }
                    if (CCAFPIHelper.isStatusResponse(data)) {
                        var authenticationMessage = messageEvent.data;
                        authenticationMessage.isFailure = !!data.error;
                        authenticationMessage.senderApp = MacrosDataLayer.FPIConstants.CCAIFRAMEAPPNAME;
                        authenticationMessage.responseData = {
                            tokenAcquired: true,
                            componentId: MacrosDataLayer.FPIConstants.CCAIFRAMEID,
                            responseText: "",
                        };
                        return;
                    }
                    if (data.error) {
                        var failureResponseMessage = messageEvent.data;
                        failureResponseMessage.staticData = data.windowPostMessageProxy;
                        failureResponseMessage.isFailure = !!data.error;
                        failureResponseMessage.statusCode = data.responseData && data.responseData.status;
                        failureResponseMessage.senderApp = MacrosDataLayer.FPIConstants.CCAIFRAMEAPPNAME;
                        failureResponseMessage.statusText = data.responseData && data.responseData.statusText;
                        failureResponseMessage.transactionid = null;
                        failureResponseMessage.responseData = { responseText: data.error };
                    }
                    else {
                        var successResponseMessage = messageEvent.data;
                        successResponseMessage.staticData = data.windowPostMessageProxy;
                        successResponseMessage.senderApp = MacrosDataLayer.FPIConstants.CCAIFRAMEAPPNAME;
                        successResponseMessage.statusText = data.responseData && data.responseData.statusText;
                        successResponseMessage.transactionid = null;
                        successResponseMessage.isFailure = !!data.error;
                        successResponseMessage.statusCode = data.responseData && data.responseData.status;
                        successResponseMessage.responseData = data.data;
                    }
                };
                CCAFPIHelper.isStatusResponse = function (data) {
                    return data.key === MacrosDataLayer.FPIConstants.QUERY_FPI_STATUS;
                };
                CCAFPIHelper.instance = null;
                return CCAFPIHelper;
            }());
            MacrosDataLayer.CCAFPIHelper = CCAFPIHelper;
        })(MacrosDataLayer = ProductivityMacros.MacrosDataLayer || (ProductivityMacros.MacrosDataLayer = {}));
    })(ProductivityMacros = Microsoft.ProductivityMacros || (Microsoft.ProductivityMacros = {}));
})(Microsoft || (Microsoft = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Microsoft;
(function (Microsoft) {
    var ProductivityMacros;
    (function (ProductivityMacros) {
        var MacrosDataLayer;
        (function (MacrosDataLayer) {
            var FlowClient = /** @class */ (function () {
                /**
                 *
                 * @param fpiHelper FPI Helper
                 */
                function FlowClient() {
                    this.fpiHelper = MacrosDataLayer.CCAFPIHelper.getInstance();
                    this.organizationSettings = MacrosDataLayer.OrganizationSettings.instance;
                    this.environmentContext = new EnvironmentContext();
                    this.environmentContext.organizationId = this.organizationSettings.originalOrganizationSettings.organizationId;
                    this.environmentContext.organizationName = this.organizationSettings.originalOrganizationSettings.uniqueName;
                    this.setFlowApiConfiguration(this.organizationSettings.geoName);
                }
                FlowClient.prototype.getGeoName = function () {
                    var organizationGeoName = "";
                    if (this.organizationSettings) {
                        organizationGeoName = this.organizationSettings.geoName;
                        if (organizationGeoName && organizationGeoName.toUpperCase() === "NA") {
                            organizationGeoName = this.organizationSettings.isSovereignCloud ? "GCC" : organizationGeoName;
                        }
                    }
                    return organizationGeoName;
                };
                // According to AAD Guidance by PACS, the FPAs need to be partitioned per cluster category.
                // Currently the apps available for FPI are either NonProd(Test, Preprod) or Prod Public (Which will be the default app).
                // This needs to be enhanced once FPAs are created for soverign clouds.
                FlowClient.prototype.getFPIClientId = function () {
                    var geoName = this.getGeoName().toUpperCase();
                    switch (geoName) {
                        case MacrosDataLayer.FPIConstants.GeoTST:
                        case MacrosDataLayer.FPIConstants.GeoTIP:
                        case MacrosDataLayer.FPIConstants.GeoGCC:
                            return MacrosDataLayer.FirstPartyAppClientIdMap[geoName];
                        default:
                            return MacrosDataLayer.FirstPartyAppClientIdMap[MacrosDataLayer.FPIConstants.GeoPublic];
                    }
                };
                FlowClient.prototype.setFlowApiConfiguration = function (geoName) {
                    var setting = MacrosDataLayer.FlowGeoSettings[geoName.toUpperCase()] || MacrosDataLayer.FlowGeoSettings[MacrosDataLayer.GeoNames.DEFAULT];
                    this.environmentContext.apiBaseUri = setting.endpoint;
                    this.environmentContext.resourceIdentifier = setting.resource;
                };
                FlowClient.prototype.getEnvironment = function (requestContext) {
                    return __awaiter(this, void 0, void 0, function () {
                        var message;
                        return __generator(this, function (_a) {
                            MacrosDataLayer.Utils.XrmReportEvent("FlowClient", [
                                { name: "getEnvironment", value: "getEnvironment API Called" },
                                { name: "Request ID", value: requestContext.requestId }
                            ]);
                            message = new MacrosDataLayer.CCAFPIRequestMessage();
                            message.requestType = MacrosDataLayer.RequestTypes.POST;
                            message.url = this.environmentContext.apiBaseUri + "/providers/Microsoft.Flow/getOrCreateLinkedEnvironment?api-version=" + FlowClient.apiVersion;
                            message.payload = JSON.stringify({
                                resourceId: this.environmentContext.organizationId,
                                type: "Dynamics365Instance"
                            });
                            message.header = FlowClient.defaultHeader;
                            message.resource = this.environmentContext.resourceIdentifier;
                            message.staticData = requestContext;
                            message.fpiClientId = this.getFPIClientId();
                            return [2 /*return*/, this.fpiHelper.makeFPIRequest(message, requestContext.requestId)];
                        });
                    });
                };
                FlowClient.prototype.getFlows = function (entityName, requestContext) {
                    return __awaiter(this, void 0, void 0, function () {
                        var environment, environmentId, url, message;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    MacrosDataLayer.Utils.XrmReportEvent("FlowClient", [
                                        { name: "getFlows", value: "getFlows API Called" },
                                        { name: "Request ID", value: requestContext.requestId },
                                        { name: "Entity Name", value: entityName }
                                    ]);
                                    return [4 /*yield*/, this.getEnvironment(requestContext)];
                                case 1:
                                    environment = _a.sent();
                                    environmentId = environment.name;
                                    url = this.environmentContext.apiBaseUri + "/providers/Microsoft.Flow/environments/" + environmentId + "/flows?$filter="
                                        + ("operations/any(operation: operation/commondataservice.organization eq 'default.cds' and operation/commondataservice.entity eq '" + entityName + "') and properties/definitionSummary/triggers/any(t: t/type eq 'request')+or+")
                                        + ("operations/any(operation: operation/dynamics.organization eq '" + this.environmentContext.organizationName + "' and operation/dynamics.entity eq '" + entityName + "') and properties/definitionSummary/triggers/any(t: t/type eq 'request')+or+")
                                        + ("operations/any(operation: operation/commondataservice.organization eq '" + this.environmentContext.organizationName + "' and operation/commondataservice.entity eq '" + entityName + "') and properties/definitionSummary/triggers/any(t: t/type eq 'request')")
                                        + ("&api-version=" + FlowClient.apiVersion);
                                    message = new MacrosDataLayer.CCAFPIRequestMessage();
                                    message.requestType = MacrosDataLayer.RequestTypes.GET;
                                    message.url = url;
                                    message.header = FlowClient.defaultHeader;
                                    message.resource = this.environmentContext.resourceIdentifier;
                                    message.staticData = requestContext;
                                    message.fpiClientId = this.getFPIClientId();
                                    return [2 /*return*/, this.fpiHelper.makeFPIRequest(message, requestContext.requestId)];
                            }
                        });
                    });
                };
                FlowClient.defaultHeader = { "Content-Type": "application/json", "Cache-Control": "no-cache", "Pragma": "no-cache" };
                FlowClient.apiVersion = "2016-11-01";
                return FlowClient;
            }());
            MacrosDataLayer.FlowClient = FlowClient;
            var FlowRequestContext = /** @class */ (function () {
                function FlowRequestContext(consumerId, requestId) {
                    this.consumerId = consumerId;
                    this.requestId = requestId;
                }
                return FlowRequestContext;
            }());
            MacrosDataLayer.FlowRequestContext = FlowRequestContext;
            var EnvironmentContext = /** @class */ (function () {
                function EnvironmentContext() {
                }
                return EnvironmentContext;
            }());
        })(MacrosDataLayer = ProductivityMacros.MacrosDataLayer || (ProductivityMacros.MacrosDataLayer = {}));
    })(ProductivityMacros = Microsoft.ProductivityMacros || (Microsoft.ProductivityMacros = {}));
})(Microsoft || (Microsoft = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Microsoft;
(function (Microsoft) {
    var ProductivityMacros;
    (function (ProductivityMacros) {
        var MacrosDataLayer;
        (function (MacrosDataLayer) {
            var FPIRequestMessage = /** @class */ (function () {
                function FPIRequestMessage() {
                }
                return FPIRequestMessage;
            }());
            MacrosDataLayer.FPIRequestMessage = FPIRequestMessage;
            var AdditionalRequestHeaders = /** @class */ (function () {
                function AdditionalRequestHeaders() {
                }
                return AdditionalRequestHeaders;
            }());
            MacrosDataLayer.AdditionalRequestHeaders = AdditionalRequestHeaders;
            var FPIAuthenticationFailureResponse = /** @class */ (function () {
                function FPIAuthenticationFailureResponse() {
                    this.responseCode = MacrosDataLayer.FPIConstants.AUTH_FAILED_STATUS_CODE;
                    this.responseText = MacrosDataLayer.FPIConstants.AUTH_FAILED_STATUS_MESSAGE;
                }
                return FPIAuthenticationFailureResponse;
            }());
            MacrosDataLayer.FPIAuthenticationFailureResponse = FPIAuthenticationFailureResponse;
            var FpiRequestMessageEventData = /** @class */ (function () {
                function FpiRequestMessageEventData() {
                }
                return FpiRequestMessageEventData;
            }());
            MacrosDataLayer.FpiRequestMessageEventData = FpiRequestMessageEventData;
            var FpiRequestMessageEvent = /** @class */ (function () {
                function FpiRequestMessageEvent() {
                }
                return FpiRequestMessageEvent;
            }());
            MacrosDataLayer.FpiRequestMessageEvent = FpiRequestMessageEvent;
            var FpiResponseMessageEvent = /** @class */ (function () {
                function FpiResponseMessageEvent() {
                }
                return FpiResponseMessageEvent;
            }());
            MacrosDataLayer.FpiResponseMessageEvent = FpiResponseMessageEvent;
        })(MacrosDataLayer = ProductivityMacros.MacrosDataLayer || (ProductivityMacros.MacrosDataLayer = {}));
    })(ProductivityMacros = Microsoft.ProductivityMacros || (Microsoft.ProductivityMacros = {}));
})(Microsoft || (Microsoft = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Microsoft;
(function (Microsoft) {
    var ProductivityMacros;
    (function (ProductivityMacros) {
        var MacrosDataLayer;
        (function (MacrosDataLayer) {
            var CCAFPIRequestMessage = /** @class */ (function () {
                function CCAFPIRequestMessage() {
                }
                return CCAFPIRequestMessage;
            }());
            MacrosDataLayer.CCAFPIRequestMessage = CCAFPIRequestMessage;
        })(MacrosDataLayer = ProductivityMacros.MacrosDataLayer || (ProductivityMacros.MacrosDataLayer = {}));
    })(ProductivityMacros = Microsoft.ProductivityMacros || (Microsoft.ProductivityMacros = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Microsoft;
(function (Microsoft) {
    var ProductivityMacros;
    (function (ProductivityMacros) {
        var MacrosDataLayer;
        (function (MacrosDataLayer) {
            var DataHelper = /** @class */ (function () {
                function DataHelper(isMock) {
                    DataHelper.isMock = isMock ? isMock : false;
                    DataHelper.FPIHelper = MacrosDataLayer.FPIHelper.getInstance(isMock);
                    DataHelper.isAuthenticated = false;
                    DataHelper.consumersList = new Array();
                    DataHelper.entityMetadataMap = {};
                    MacrosDataLayer.FPIHelper.authenticate().then(function (status) {
                        DataHelper.isAuthenticated = status;
                    });
                }
                /**
                 * To be called when a new consumer initializes itself
                 * @param consumerId Preferably unique identification of consumer in telemetry
                 */
                DataHelper.registerConsumer = function (consumerId) {
                    if (DataHelper.consumersList.indexOf(consumerId) === -1) {
                        DataHelper.consumersList.push(consumerId);
                    }
                    else {
                        //TODO: add telemetry.
                    }
                };
                /**
                 * To be called when a new consumer destroys itself
                 * @param consumerId Previously passed identification of consumer in telemetry
                 */
                DataHelper.deRegisterConsumer = function (consumerId) {
                    var index = DataHelper.consumersList.indexOf(consumerId);
                    if (index > 0) {
                        DataHelper.consumersList.splice(index, 1);
                    }
                    if (DataHelper.consumersList.length === 0) {
                        // Handle no consumers alive scenario destroy resources
                    }
                };
                /**
                 * Initializes DataHelper and returns instance reference
                 */
                DataHelper.getInstance = function (isMock) {
                    if (MacrosDataLayer.Utils.isNullUndefinedorEmpty(DataHelper.instance)) {
                        DataHelper.instance = new DataHelper(isMock);
                    }
                    return DataHelper.instance;
                };
                DataHelper.sendFinishedMessage = function (message) {
                    if (message.staticData && message.staticData.consumerId && message.staticData.requestId) {
                        if (DataHelper.consumersList.indexOf(message.staticData.consumerId) === -1) {
                            DataHelper.registerConsumer(message.staticData.consumerId);
                        }
                        return MacrosDataLayer.FPIHelper.makeFPIRequest(message, message.staticData.requestId);
                    }
                };
                return DataHelper;
            }());
            MacrosDataLayer.DataHelper = DataHelper;
        })(MacrosDataLayer = ProductivityMacros.MacrosDataLayer || (ProductivityMacros.MacrosDataLayer = {}));
    })(ProductivityMacros = Microsoft.ProductivityMacros || (Microsoft.ProductivityMacros = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Microsoft;
(function (Microsoft) {
    var ProductivityMacros;
    (function (ProductivityMacros) {
        var MacrosDataLayer;
        (function (MacrosDataLayer) {
            var CCADataHelper = /** @class */ (function () {
                function CCADataHelper() {
                    CCADataHelper.consumersList = new Array();
                    this.flowClient = new MacrosDataLayer.FlowClient();
                }
                /**
                 * To be called when a new consumer initializes itself
                 * @param consumerId Preferably unique identification of consumer in telemetry
                 */
                CCADataHelper.registerConsumer = function (consumerId) {
                    if (CCADataHelper.consumersList.indexOf(consumerId) === -1) {
                        CCADataHelper.consumersList.push(consumerId);
                    }
                };
                /**
                 * Initializes DataHelper and returns instance reference
                 */
                CCADataHelper.getInstance = function () {
                    if (MacrosDataLayer.Utils.isNullUndefinedorEmpty(CCADataHelper.instance)) {
                        CCADataHelper.instance = new CCADataHelper();
                    }
                    return CCADataHelper.instance;
                };
                Object.defineProperty(CCADataHelper.prototype, "FlowClient", {
                    get: function () {
                        return this.flowClient;
                    },
                    enumerable: true,
                    configurable: true
                });
                return CCADataHelper;
            }());
            MacrosDataLayer.CCADataHelper = CCADataHelper;
        })(MacrosDataLayer = ProductivityMacros.MacrosDataLayer || (ProductivityMacros.MacrosDataLayer = {}));
    })(ProductivityMacros = Microsoft.ProductivityMacros || (Microsoft.ProductivityMacros = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var ProductivityMacros;
    (function (ProductivityMacros) {
        var MacrosDataLayer;
        (function (MacrosDataLayer) {
            var RequestMap = /** @class */ (function () {
                function RequestMap() {
                    this.requestMap = {};
                }
                /**
                 * Utility function to add value into RequestMap
                 * @param requestId Id of the request to be added in the request map
                 * @param value Promise added to the request map
                 */
                RequestMap.prototype.addToRequestMap = function (requestId, value) {
                    if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(requestId)) {
                        this.requestMap[requestId] = value;
                    }
                };
                /**
                 * Gets Promise for given request id
                 * @param requestId
                 */
                RequestMap.prototype.getRequestMapValue = function (requestId) {
                    if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(requestId) && !MacrosDataLayer.Utils.isNullUndefinedorEmpty(this.requestMap[requestId])) {
                        return this.requestMap[requestId];
                    }
                    else {
                        return new Error("Key not present in dictionary");
                    }
                };
                /**
                 * Utility function to delete entry from  RequestMap
                 */
                RequestMap.prototype.deleteFromRequestMap = function (requestId) {
                    if (!MacrosDataLayer.Utils.isNullUndefinedorEmpty(requestId) && !MacrosDataLayer.Utils.isNullUndefinedorEmpty(this.requestMap[requestId])) {
                        delete this.requestMap[requestId];
                    }
                };
                return RequestMap;
            }());
            MacrosDataLayer.RequestMap = RequestMap;
        })(MacrosDataLayer = ProductivityMacros.MacrosDataLayer || (ProductivityMacros.MacrosDataLayer = {}));
    })(ProductivityMacros = Microsoft.ProductivityMacros || (Microsoft.ProductivityMacros = {}));
})(Microsoft || (Microsoft = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Microsoft;
(function (Microsoft) {
    var ProductivityMacros;
    (function (ProductivityMacros) {
        var MacrosDataLayer;
        (function (MacrosDataLayer) {
            var _a;
            var FPIConstants = /** @class */ (function () {
                function FPIConstants() {
                }
                FPIConstants.IFRAMEID = "OCFPIIframe";
                FPIConstants.CCAIFRAMEID = "CCAFPIIframe";
                FPIConstants.EMPTYGUID = "00000000-0000-0000-0000-000000000000";
                FPIConstants.FPIMESSAGE_EVENTNAME = "message";
                FPIConstants.IFRAMETITLE = "OmniChannelFPI_IFrame";
                FPIConstants.CCAIFRAMETITLE = "CCAFPI_IFrame";
                FPIConstants.IFRAME_APPNAME = "OCApp";
                FPIConstants.CCAIFRAMEAPPNAME = "CCAApp";
                FPIConstants.OCBASEURLFIELD = "ocBaseUrl";
                FPIConstants.OCFPIURLFIELD = "ocFPIUrl";
                FPIConstants.AUTH_FAILED_STATUS_MESSAGE = "Authentication failure";
                FPIConstants.AUTH_FAILED_STATUS_CODE = 401;
                FPIConstants.FPI_COMPONENT_URL_PARAMETER = "&componentId=" + FPIConstants.IFRAMEID;
                FPIConstants.QUERY_FPI_STATUS = "QueryFpiStatus";
                FPIConstants.EXTERNAL_REST_ODATA_API = "ExternalRESTOdataApi";
                FPIConstants.GeoTST = "TST";
                FPIConstants.GeoTIP = "TIP";
                FPIConstants.GeoPublic = "PROD";
                FPIConstants.GeoGCC = "GCC";
                return FPIConstants;
            }());
            MacrosDataLayer.FPIConstants = FPIConstants;
            var RequestTypes = /** @class */ (function () {
                function RequestTypes() {
                }
                RequestTypes.GET = "GET";
                RequestTypes.PUT = "PUT";
                RequestTypes.POST = "POST";
                RequestTypes.DELETE = "DELETE";
                RequestTypes.STATUS = "STATUS";
                return RequestTypes;
            }());
            MacrosDataLayer.RequestTypes = RequestTypes;
            var EndpointConstants = /** @class */ (function () {
                function EndpointConstants() {
                }
                EndpointConstants.setPublicFPIUrlMap = function () {
                    EndpointConstants.publicFPIUrlMap.set("DEV", "https://fpi-dev.oc.crmlivetie.com/fpi/OmniChannel/9.0/Runtime.html?");
                    EndpointConstants.publicFPIUrlMap.set("INT", "https://fpi.oc.crmlivetie.com/fpi/OmniChannel/9.0/Runtime.html?");
                    EndpointConstants.publicFPIUrlMap.set("TEST", "https://fpi.oc.crmlivetie.com/fpi/OmniChannel/9.0/Runtime.html?");
                    EndpointConstants.publicFPIUrlMap.set("PPE", "https://fpi.omnichannelengagementhub.com/fpi/OmniChannel/9.0/Runtime.html?");
                    EndpointConstants.publicFPIUrlMap.set("PROD", "https://fpi.omnichannelengagementhub.com/fpi/OmniChannel/9.0/Runtime.html?");
                };
                EndpointConstants.setFairfaxFPIUrlMap = function () {
                    EndpointConstants.fairfaxFPIUrlMap.set("DEV", "https://omnichanneltestauthservice.azurewebsites.us/OmniChannel/9.0/Runtime.html?");
                    EndpointConstants.fairfaxFPIUrlMap.set("INT", "https://omnichanneltestauthservice.azurewebsites.us/OmniChannel/9.0/Runtime.html?");
                    EndpointConstants.fairfaxFPIUrlMap.set("TEST", "https://omnichanneltestauthservice.azurewebsites.us/OmniChannel/9.0/Runtime.html?");
                    EndpointConstants.fairfaxFPIUrlMap.set("PPE", "https://oc-auth.azurewebsites.us/OmniChannel/9.0/Runtime.html?");
                    EndpointConstants.fairfaxFPIUrlMap.set("PROD", "https://oc-auth.azurewebsites.us/OmniChannel/9.0/Runtime.html?");
                };
                EndpointConstants.setPublicFPI_MSALUrlMap = function () {
                    EndpointConstants.publicFPI_MSALUrlMap
                        .set("DEV", "https://fpi-dev.oc.crmlivetie.com/fpi/OmniChannel/9.0/Runtime_Msal.html?")
                        .set("INT", "https://fpi.oc.crmlivetie.com/fpi/OmniChannel/9.0/Runtime_Msal.html?")
                        .set("TEST", "https://fpi.oc.crmlivetie.com/fpi/OmniChannel/9.0/Runtime_Msal.html?")
                        .set("PPE", "https://ocfpippe.blob.core.windows.net/fpi/OmniChannel/9.0/Runtime_Msal.html?")
                        .set("PROD", "https://fpi.omnichannelengagementhub.com/fpi/OmniChannel/9.0/Runtime_Msal.html?");
                };
                EndpointConstants.setFairfaxFPI_MSALUrlMap = function () {
                    EndpointConstants.fairfaxFPI_MSALUrlMap
                        .set("DEV", "https://omnichanneltestauthservice.azurewebsites.us/OmniChannel/9.0/Runtime_Msal.html?")
                        .set("INT", "https://omnichanneltestauthservice.azurewebsites.us/OmniChannel/9.0/Runtime_Msal.html?")
                        .set("TEST", "https://omnichanneltestauthservice.azurewebsites.us/OmniChannel/9.0/Runtime_Msal.html?")
                        .set("PPE", "https://oc-auth.azurewebsites.us/OmniChannel/9.0/Runtime_Msal.html?")
                        .set("PROD", "https://oc-auth.azurewebsites.us/OmniChannel/9.0/Runtime_Msal.html?");
                };
                //public static readonly mooncakeFPIUrlMap = new Map()  //Not deployed yet, to be updated after deployment. If common deployment for all GCC, will be a copy of fairfaxFPIUrlMap
                EndpointConstants.getFPIURLMap = function (cloudType) {
                    if (this.publicFPIUrlMap.size == 0) {
                        this.setPublicFPIUrlMap();
                    }
                    if (this.fairfaxFPIUrlMap.size == 0) {
                        this.setFairfaxFPIUrlMap();
                    }
                    if (this.publicFPI_MSALUrlMap.size == 0) {
                        this.setPublicFPI_MSALUrlMap();
                    }
                    if (this.fairfaxFPI_MSALUrlMap.size == 0) {
                        this.setFairfaxFPI_MSALUrlMap();
                    }
                    var msal_fcb = false;
                    try {
                        msal_fcb = Xrm.Utility.getGlobalContext().getFeatureControlSetting(EndpointConstants.ocMsalFCBNamespace, EndpointConstants.ocMsalFCBKey);
                    }
                    catch (e) {
                        console.log("Couldn't fetch msal bit : ", e);
                    }
                    var urls = msal_fcb ?
                        [this.fairfaxFPI_MSALUrlMap, this.publicFPI_MSALUrlMap] :
                        [this.fairfaxFPIUrlMap, this.publicFPIUrlMap];
                    if (cloudType === null || cloudType === undefined) {
                        return urls[1];
                    }
                    switch (cloudType.toLowerCase()) {
                        case EndpointConstants.fairfaxString:
                            return urls[0];
                        case EndpointConstants.publicString:
                        default:
                            return urls[1];
                    }
                };
                EndpointConstants.endpointEntityName = "serviceendpoint";
                EndpointConstants.ocEndpointRecordId = "8af92c33-e748-4b5a-b772-46cba89bb7ac";
                EndpointConstants.pathPropertyKey = "path";
                EndpointConstants.namePropertyKey = "name";
                EndpointConstants.descriptionPropertyKey = "description";
                EndpointConstants.telemetryContext = "OmniChannelEndpoint";
                EndpointConstants.emptyString = "";
                EndpointConstants.publicString = "public";
                EndpointConstants.fairfaxString = "fairfax";
                EndpointConstants.PRODEnvKey = "PROD";
                EndpointConstants.namespaceDeploymentKey = "solutionnamespace";
                EndpointConstants.PublicDeploymentTypeKey = "default";
                // Service endpoint Map Keys
                EndpointConstants.ocBaseUrlKey = "ocBaseUrl";
                EndpointConstants.ocFPIUrlKey = "ocFPIUrl";
                EndpointConstants.ocDeploymentTypeKey = "ocDeploymentType";
                EndpointConstants.ocEndpointNameKey = "ocEndpointName";
                EndpointConstants.ocMsalFCBNamespace = "Omnichannel.Msal";
                EndpointConstants.ocMsalFCBKey = "EnableOcMsalFCS";
                EndpointConstants.publicFPIUrlMap = new Map();
                EndpointConstants.fairfaxFPIUrlMap = new Map();
                EndpointConstants.publicFPI_MSALUrlMap = new Map();
                EndpointConstants.fairfaxFPI_MSALUrlMap = new Map();
                return EndpointConstants;
            }());
            MacrosDataLayer.EndpointConstants = EndpointConstants;
            var GeoNames = /** @class */ (function () {
                function GeoNames() {
                }
                GeoNames.TIP = "TIP";
                GeoNames.GCC = "GCC";
                GeoNames.USG = "USG";
                GeoNames.CHN = "CHN";
                GeoNames.DEFAULT = "";
                return GeoNames;
            }());
            MacrosDataLayer.GeoNames = GeoNames;
            /**
             * https://dynamicscrm.visualstudio.com/First%20Party%20Integrations/_git/First%20Party%20Integrations?path=%2Fsrc%2FIntegrations%2FIntegrations%2FMicrosoftFlows%2F9.0%2FFlowApp.js&_a=contents&version=GBv2
             */
            MacrosDataLayer.FlowGeoSettings = (_a = {},
                _a[GeoNames.TIP] = { endpoint: "https://tip1.api.flow.microsoft.com", resource: "https://service.flow.microsoft.com/" },
                _a[GeoNames.GCC] = { endpoint: "https://gov.api.flow.microsoft.us", resource: "https://gov.service.flow.microsoft.us/" },
                _a[GeoNames.USG] = { endpoint: "https://high.api.flow.microsoft.us", resource: "https://high.service.flow.microsoft.us/" },
                _a[GeoNames.CHN] = { endpoint: "https://api.powerautomate.cn", resource: "https://service.powerautomate.cn/" },
                _a[GeoNames.DEFAULT] = { endpoint: "https://api.flow.microsoft.com", resource: "https://service.flow.microsoft.com/" },
                _a);
            MacrosDataLayer.FirstPartyAppClientIdMap = {
                TST: "05e35c2f-3024-4630-b69f-0c923aacf335",
                TIP: "0f736588-e86d-4347-abe9-c03aebe194f1",
                PROD: "7b0b21dd-2525-47ce-a525-fff16dd327de",
                GCC: "a0adb293-a410-438f-95b3-651034878d04"
            };
        })(MacrosDataLayer = ProductivityMacros.MacrosDataLayer || (ProductivityMacros.MacrosDataLayer = {}));
    })(ProductivityMacros = Microsoft.ProductivityMacros || (Microsoft.ProductivityMacros = {}));
})(Microsoft || (Microsoft = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Microsoft;
(function (Microsoft) {
    var ProductivityMacros;
    (function (ProductivityMacros) {
        var MacrosDataLayer;
        (function (MacrosDataLayer) {
            var Utils = /** @class */ (function () {
                function Utils() {
                }
                Utils.newGuid = function () {
                    return Utils.getRandomGuidSubstr(null) + Utils.getRandomGuidSubstr(true)
                        + Utils.getRandomGuidSubstr(true) + Utils.getRandomGuidSubstr(null);
                };
                Utils.getRandomGuidSubstr = function (s) {
                    var p = (Math.random().toString(16) + "000000000").substr(2, 8);
                    return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
                };
                Utils.isNullUndefinedorEmpty = function (variable) {
                    if (variable === null || variable === undefined || variable === "") {
                        return true;
                    }
                    return false;
                };
                Utils.isFPIApp = function (event, appName) {
                    if (!Utils.isNullUndefinedorEmpty(event.data)) {
                        if (event.data.senderApp === appName) {
                            return true;
                        }
                    }
                    // Returns false if senderApp is undefined or not FPI App
                    return false;
                };
                /*
                * Returns true if FPI token acquired flag is set
                * @params event FPI callback event
                */
                Utils.isTokenAcquired = function (event, iFrameId, appName) {
                    if (Utils.isFPIApp(event, appName)) {
                        if (!Utils.isNullUndefinedorEmpty(event.data) &&
                            !Utils.isNullUndefinedorEmpty(event.data.responseData) &&
                            (event.data.responseData.tokenAcquired === true) &&
                            !Utils.isNullUndefinedorEmpty(event.data.responseData.componentId) &&
                            (event.data.responseData.componentId.toLowerCase() === iFrameId.toLowerCase())) {
                            return true;
                        }
                    }
                    return false;
                };
                /*
                 * Returns true if FPI token authentication failed
                 * @params event FPI callback event
                 */
                Utils.isAuthFailure = function (event, appName) {
                    if (Utils.isFPIApp(event, appName)) {
                        if (!Utils.isNullUndefinedorEmpty(event.data) &&
                            !Utils.isNullUndefinedorEmpty(event.data.responseData) &&
                            (event.data.responseData.tokenAcquired === false) &&
                            (event.data.isFailure === true)) {
                            return true;
                        }
                    }
                    return false;
                };
                /**
                * Generate new guid
                */
                Utils.generateNewGuid = function () {
                    // possible hex chars for a guid
                    var hexChars = "0123456789abcdef";
                    var guidSize = 36;
                    var guidString = "";
                    for (var i = 0; i < guidSize; i++) {
                        if (i === 14) {
                            // bits 12-15 set to 0010 - indicates version number of UUID RFC
                            guidString += "4";
                        }
                        else if (i === 8 || i === 13 || i === 18 || i === 23) {
                            // Dashes at 8, 13, 18, 23 (count begins at 0)
                            guidString += "-";
                        }
                        else if (i === 19) {
                            // bits 6-7 are reserved to zero and one resp.
                            var n = Math.floor(Math.random() * 0x10);
                            guidString += hexChars.substr((n & 0x3) | 0x8, 1);
                        }
                        else {
                            guidString += hexChars.substr(Math.floor(Math.random() * 0x10), 1);
                        }
                    }
                    return guidString;
                };
                Utils.XrmReportEvent = function (eventName, eventParameters) {
                    if (Xrm && Xrm.Reporting) {
                        Xrm.Reporting.reportEvent({ eventName: eventName, eventParameters: eventParameters });
                    }
                };
                Utils.XrmReportFailure = function (componentName, error, suggestedMitigation, params) {
                    if (Xrm && Xrm.Reporting) {
                        Xrm.Reporting.reportFailure(componentName, error, suggestedMitigation, params);
                    }
                };
                Utils.EMPTY_GUID = MacrosDataLayer.FPIConstants.EMPTYGUID;
                return Utils;
            }());
            MacrosDataLayer.Utils = Utils;
        })(MacrosDataLayer = ProductivityMacros.MacrosDataLayer || (ProductivityMacros.MacrosDataLayer = {}));
    })(ProductivityMacros = Microsoft.ProductivityMacros || (Microsoft.ProductivityMacros = {}));
})(Microsoft || (Microsoft = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Microsoft;
(function (Microsoft) {
    var ProductivityMacros;
    (function (ProductivityMacros) {
        var MacrosDataLayer;
        (function (MacrosDataLayer) {
            var OrganizationSettings = /** @class */ (function () {
                function OrganizationSettings() {
                    this.organizationSettings = window.top.Xrm.Utility
                        .getGlobalContext()
                        .organizationSettings;
                }
                Object.defineProperty(OrganizationSettings, "instance", {
                    get: function () {
                        if (!OrganizationSettings.singletoneInstance) {
                            OrganizationSettings.singletoneInstance = new OrganizationSettings();
                        }
                        return OrganizationSettings.singletoneInstance;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(OrganizationSettings.prototype, "geoName", {
                    get: function () {
                        var organizationGeoName = "";
                        var organizationSettings = this.organizationSettings;
                        if (organizationSettings) {
                            organizationGeoName = organizationSettings.organizationGeo;
                            if (organizationGeoName && organizationGeoName.toUpperCase() === "NA") {
                                organizationGeoName = organizationSettings.isSovereignCloud ? "GCC" : organizationGeoName;
                            }
                        }
                        return organizationGeoName;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(OrganizationSettings.prototype, "originalOrganizationSettings", {
                    get: function () {
                        return this.organizationSettings;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(OrganizationSettings.prototype, "isSovereignCloud", {
                    get: function () {
                        return this.organizationSettings.isSovereignCloud;
                    },
                    enumerable: true,
                    configurable: true
                });
                return OrganizationSettings;
            }());
            MacrosDataLayer.OrganizationSettings = OrganizationSettings;
        })(MacrosDataLayer = ProductivityMacros.MacrosDataLayer || (ProductivityMacros.MacrosDataLayer = {}));
    })(ProductivityMacros = Microsoft.ProductivityMacros || (Microsoft.ProductivityMacros = {}));
})(Microsoft || (Microsoft = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var Microsoft;
(function (Microsoft) {
    var ProductivityMacros;
    (function (ProductivityMacros) {
        var MacrosDataLayer;
        (function (MacrosDataLayer) {
            var OCEndpoint = /** @class */ (function () {
                /**
                 * Default constructor
                 * @param context Control context
                 * @param controlName Name of the Omnichannel custom control - Will be used in telemetry
                 */
                function OCEndpoint(isMock) {
                    if (MacrosDataLayer.Utils.isNullUndefinedorEmpty(isMock)) {
                        this.isMock = false;
                    }
                    else {
                        this.isMock = isMock;
                    }
                    var fpiURL = this.appendParamterstoURL(MacrosDataLayer.EndpointConstants.getFPIURLMap(MacrosDataLayer.EndpointConstants.publicString).get(MacrosDataLayer.EndpointConstants.PRODEnvKey), MacrosDataLayer.EndpointConstants.PRODEnvKey.toLowerCase(), MacrosDataLayer.EndpointConstants.publicString, false);
                    this.svcMap = new Map()
                        .set(MacrosDataLayer.EndpointConstants.ocEndpointNameKey, MacrosDataLayer.EndpointConstants.emptyString)
                        .set(MacrosDataLayer.EndpointConstants.ocBaseUrlKey, MacrosDataLayer.EndpointConstants.emptyString)
                        .set(MacrosDataLayer.EndpointConstants.ocFPIUrlKey, fpiURL)
                        .set(MacrosDataLayer.EndpointConstants.ocDeploymentTypeKey, MacrosDataLayer.EndpointConstants.emptyString)
                        .set(MacrosDataLayer.EndpointConstants.namespaceDeploymentKey, MacrosDataLayer.EndpointConstants.publicString);
                }
                OCEndpoint.prototype.appendParamterstoURL = function (url, env, cloudtype, isMock) {
                    if (isMock === true) {
                        return url + "env=" + env + "&cloudtype=" + cloudtype + "&mock=" + isMock;
                    }
                    return url + "env=" + env + "&cloudtype=" + cloudtype;
                };
                /**
                 * Getter for Service endpoint Map
                 */
                OCEndpoint.prototype.getSvcMap = function () {
                    return this.svcMap;
                };
                /*
                * Utility function: Returns empty string if given string is null or undefined or empty
                * Else it returns the same string
                * @param val value to be validated
                */
                OCEndpoint.prototype.getValue = function (val) {
                    if (MacrosDataLayer.Utils.isNullUndefinedorEmpty(val)) {
                        return MacrosDataLayer.EndpointConstants.emptyString;
                    }
                    return val;
                };
                /**
                 * Hepler method to set FPI url based on environment type.
                 * @param env Environment type DEV, INT, PPE, PROD.
                 */
                OCEndpoint.prototype.setOcFPIUrl = function () {
                    var env = this.svcMap.get(MacrosDataLayer.EndpointConstants.ocDeploymentTypeKey);
                    var cloudType = this.svcMap.get(MacrosDataLayer.EndpointConstants.namespaceDeploymentKey);
                    var FPIUrlMap = MacrosDataLayer.EndpointConstants.getFPIURLMap(cloudType);
                    if (MacrosDataLayer.Utils.isNullUndefinedorEmpty(env)) {
                        //TODO: add telemetry.
                    }
                    else {
                        if (FPIUrlMap.has(env.toUpperCase())) {
                            var url = FPIUrlMap.get(env.toUpperCase());
                            url = this.appendParamterstoURL(url, env, cloudType, this.isMock);
                            this.svcMap.set(MacrosDataLayer.EndpointConstants.ocFPIUrlKey, url);
                        }
                    }
                };
                /**
                 * Retrieve oc endpoint Url
                 */
                OCEndpoint.prototype.retrieveOcEndpoint = function () {
                    var _this = this;
                    var retrieveRecordPromise = new Promise(function (resolve, reject) {
                        _this.svcMap.set(MacrosDataLayer.EndpointConstants.ocDeploymentTypeKey, MacrosDataLayer.EndpointConstants.PRODEnvKey);
                        _this.svcMap.set(MacrosDataLayer.EndpointConstants.namespaceDeploymentKey, MacrosDataLayer.OrganizationSettings.instance.isSovereignCloud ? MacrosDataLayer.EndpointConstants.fairfaxString : MacrosDataLayer.EndpointConstants.publicString);
                        _this.setOcFPIUrl();
                        resolve(_this.svcMap);
                    });
                    return retrieveRecordPromise;
                };
                return OCEndpoint;
            }());
            MacrosDataLayer.OCEndpoint = OCEndpoint;
        })(MacrosDataLayer = ProductivityMacros.MacrosDataLayer || (ProductivityMacros.MacrosDataLayer = {}));
    })(ProductivityMacros = Microsoft.ProductivityMacros || (Microsoft.ProductivityMacros = {}));
})(Microsoft || (Microsoft = {}));
