var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        var Common;
        (function (Common) {
            'use strict';
            var DocumentTemplateType;
            (function (DocumentTemplateType) {
                DocumentTemplateType[DocumentTemplateType["None"] = 0] = "None";
                DocumentTemplateType[DocumentTemplateType["Excel"] = 1] = "Excel";
                DocumentTemplateType[DocumentTemplateType["Word"] = 2] = "Word";
            })(DocumentTemplateType = Common.DocumentTemplateType || (Common.DocumentTemplateType = {}));
            var Utility = (function () {
                function Utility() {
                }
                /**
                 * Checks whether an object is null.
                 * @param object The object to check.
                 * @returns A flag indicating whether the object is null.
                 */
                Utility.isNull = function (object) {
                    return object === null;
                };
                /**
                 * Checks whether an object is null or undefined.
                 * @param object The object to check.
                 * @returns A flag indicating whether the object is null or undefined.
                 */
                Utility.isNullOrUndefined = function (object) {
                    return object === null || object === undefined;
                };
                /**
                 * Checks whether an object is an undefined, null or empty string.
                 * @param object The object to check.
                 * @returns A flag indicating whether the object is undefined, null or an empty string.
                 */
                Utility.isNullOrEmptyString = function (object) {
                    return Utility.isNullOrUndefined(object) || object === "";
                };
                /**
                * Tries to convert an object to string
                * @param object The object to convert.
                * @returns Returns the object converted to string or the object itself if this is null or undefined.
                */
                Utility.toStringWithNullCheck = function (object) {
                    return Utility.isNullOrUndefined(object) ? object : object.toString();
                };
                Utility.newGuid = function () {
                    return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                };
                /**
                * The method for creating Blob object from base64 content.
                */
                Utility.Base64ToBlob = function (fileContent, fileType) {
                    if (this.isNullOrEmptyString(fileContent))
                        throw new Error("file Content cannot be empty");
                    if (this.isNullOrEmptyString(fileType))
                        throw new Error("file Type cannot be empty");
                    // convert base64 content to raw binary data held in a string
                    var binary = window.atob(fileContent);
                    var binaryLength = binary.length;
                    // create ArrayBuffer with binary length
                    var buffer = new ArrayBuffer(binaryLength);
                    // create 8-bit Array for ArrayBuffer
                    var viewBuffer = new Uint8Array(buffer);
                    // save unicode of binary data into 8-bit Array
                    for (var i = 0; i < binaryLength; i++) {
                        viewBuffer[i] = binary.charCodeAt(i);
                    }
                    return new Blob([buffer], { type: fileType });
                };
                Utility.clickOnTempAnchor = function (url, fileName) {
                    var tempAnchorElement = document.createElement("a");
                    tempAnchorElement.setAttribute("href", url);
                    tempAnchorElement.setAttribute("target", "_blank");
                    tempAnchorElement.setAttribute("download", fileName);
                    document.body.appendChild(tempAnchorElement);
                    tempAnchorElement.click();
                    document.body.removeChild(tempAnchorElement);
                };
                Utility.GetCurrentAppId = function () {
                    if (window && window.top && window.top.location && window.top.location.href) {
                        var currentUrl = window.top.location.href;
                        var index = currentUrl.indexOf("?");
                        var queryString = currentUrl.substring(index + 1, currentUrl.length);
                        var UrlVariables = queryString.split("&");
                        for (var i = 0; i < UrlVariables.length; i++) {
                            var Entry = UrlVariables[i].split("=");
                            var key = Entry.length === 2 ? Entry[0] : null;
                            if (key === "appid") {
                                return Entry[1];
                            }
                        }
                    }
                    return "";
                };
                /**
                 * returns the fetchXML, which can be used to fetch the parkinsolutionID of the app.
                 * @param appId : appId of the App being used.
                 * @param parkingSolutionAppConfigMasterId
                 */
                Utility.GetParkingSolutionIdFetchXML = function (appId, parkingSolutionAppConfigMasterId) {
                    var retFetchXML = "?fetchXml=" + encodeURI("<fetch version=\"1.0\" mapping=\"logical\" distinct=\"true\">\n\t\t\t\t\t <entity name=\"appconfiginstance\">\n\t\t\t\t\t <attribute name=\"value\" />\n\t\t\t\t\t <link-entity name=\"appconfig\" to=\"appconfigid\" from=\"appconfigid\" link-type=\"inner\" >\n\t\t\t\t\t\t <filter type=\"and\">\n\t\t\t\t\t\t\t <condition attribute=\"appmoduleid\" operator=\"eq\" value=\"" + appId + "\"/>\n\t\t\t\t\t\t </filter >\n\t\t\t\t\t </link-entity>\n\t\t\t\t\t <link-entity name=\"solution\" to=\"value\" from=\"solutionid\" link-type=\"inner\"  />\n\t\t\t\t\t <filter type=\"and\">\n\t\t\t\t\t\t<condition attribute=\"appconfigmasterid\" operator=\"eq\" value=\"" + parkingSolutionAppConfigMasterId + "\"/> </filter>\n\t\t\t\t\t </entity>\n\t\t\t\t </fetch>");
                    return retFetchXML;
                };
                Utility.GetCurrentShellMode = function () {
                    if (window && window.top && window.top.location && window.top.location.href) {
                        var currentUrl = window.top.location.href;
                        var index = currentUrl.indexOf("?");
                        var queryString = currentUrl.substring(index + 1, currentUrl.length);
                        var UrlVariables = queryString.split("&");
                        for (var i = 0; i < UrlVariables.length; i++) {
                            var Entry = UrlVariables[i].split("=");
                            var key = Entry.length === 2 ? Entry[0] : null;
                            if (key === "appshellmode") {
                                return Entry[1].toLowerCase();
                            }
                        }
                    }
                    return "";
                };
                Utility.GetFileExtension = function (fileName) {
                    return this.isNullOrEmptyString(fileName) ? fileName
                        : fileName.substr(fileName.lastIndexOf('.') + 1);
                };
                Utility.GetFileNameWithoutExtension = function (fileName) {
                    return this.isNullOrEmptyString(fileName) ? fileName
                        : fileName.substr(0, fileName.lastIndexOf('.'));
                };
                Utility.GetDocumentTemplateType = function (fileExtension) {
                    switch (fileExtension) {
                        case "xlsx":
                            return DocumentTemplateType.Excel;
                        case "docx":
                            return DocumentTemplateType.Word;
                    }
                    return DocumentTemplateType.None;
                };
                Utility.GetFileExtensionForDocument = function (docType) {
                    switch (docType) {
                        case DocumentTemplateType.Excel:
                            return "xlsx";
                        case DocumentTemplateType.Word:
                            return "docx";
                    }
                    return "";
                };
                Utility.EqualsIgnoreCase = function (string1, string2) {
                    var isString1Null = string1 == null;
                    var isString2Null = string2 == null;
                    var isString1Undefined = string1 == undefined;
                    var isString2Undefined = string2 == undefined;
                    if (isString1Null && isString2Null || isString1Undefined && isString2Undefined) {
                        return true;
                    }
                    if (isString1Null != isString2Null || isString1Undefined != isString2Undefined) {
                        return false;
                    }
                    return string1.toUpperCase() === string2.toUpperCase();
                };
                Utility.isNullUndefinedOrWhitespace = function (s) {
                    return s == null || s == undefined || s.trim().length === 0;
                };
                ;
                /**
                 * Parses webapplication endpoint url and returns crmhostname : used for AddNewUserControl, EditUserControl and ApplicationManagementControl
                 */
                Utility.GetCrmHostName = function (webApplicationEndpoint) {
                    /*
                    * Parsing considers following 4 forms of URLs:
                    *   1."https://someorg.crmx.something.com/"
                    *   2."https://someorg.crmx.something.com"
                    *   3."someorg.crmx.something.com"
                    *   4."someorg.crmx.something.com/"
                    * converts into "crmx.something.com"
                    */
                    var currentUrl = webApplicationEndpoint;
                    var matchedStringIndex = currentUrl.indexOf(".");
                    if (matchedStringIndex != -1) {
                        currentUrl = currentUrl.substring(matchedStringIndex + 1);
                        //remove last "/" if there
                        var lastIndex = currentUrl.lastIndexOf("/");
                        if (lastIndex != -1) {
                            currentUrl = currentUrl.substring(0, lastIndex);
                        }
                    }
                    //TODO: throw exception if not able to process the string and catch it when function is called.
                    return currentUrl;
                };
                /**
                 * Detects whether the browser is Safari
                 */
                Utility.IsSafari = function () {
                    var ua = window.navigator.userAgent.toLowerCase();
                    if (ua.indexOf('safari') != -1 && ua.indexOf('chrome') == -1) {
                        return true;
                    }
                    return false;
                };
                /**
                 * Detects whether the iphone or ipad
                 */
                Utility.IsIosDevice = function () {
                    var ua = window.navigator.userAgent.toLowerCase();
                    if (ua.indexOf('iphone') != -1 || ua.indexOf('ipad') != -1) {
                        return true;
                    }
                    return false;
                };
                /**
                 * Detects whether the device is android
                 */
                Utility.IsAndroidDevice = function () {
                    var ua = window.navigator.userAgent.toLowerCase();
                    if (ua.indexOf('android') != -1) {
                        return true;
                    }
                    return false;
                };
                /**
                 * Downloads the file
                 * @param fileName name of the file
                 * @param fileContent content of the file
                 * @param mimeType the mimeType
                 */
                Utility.DownloadFile = function (fileName, fileContent, mimeType) {
                    var file = {
                        fileContent: fileContent,
                        fileName: fileName,
                        mimeType: mimeType
                    };
                    var openMode = { "openMode": 2 };
                    window.Xrm.Navigation.openFile(file, openMode);
                };
                Utility.actionFailedErrorDialog = function (errorResponse) {
                    Xrm.Navigation.openErrorDialog({ errorCode: errorResponse.errorCode, message: errorResponse.message });
                };
                /*
                 ***********************************Constructing Immersive Excel Utilities******************************************************
                */
                /**
                * Generate file name for exported document
                * @param prefix Prefix of the name
                * @param documentType 1: Excel 2: Word
                */
                Utility.generateExportFileName = function (prefix, documentType) {
                    var ext = documentType === 2 ? ".docx" : ".xlsx";
                    if (typeof (Xrm.Utility.getGlobalContext()) != 'undefined'
                        && Xrm.Utility.getGlobalContext() != null
                        && typeof (Xrm.Utility.getGlobalContext().userSettings) != 'undefined'
                        && Xrm.Utility.getGlobalContext().userSettings != null
                        && prefix
                        && prefix.length != 0) {
                        var now = new Date();
                        var datePattern = Xrm.Utility.getGlobalContext().userSettings.dateFormattingInfo.ShortDatePattern;
                        var timePattern = Xrm.Utility.getGlobalContext().userSettings.dateFormattingInfo.LongTimePattern;
                        var dateSeparator = Xrm.Utility.getGlobalContext().userSettings.dateFormattingInfo.DateSeparator;
                        var timeSeparator = Xrm.Utility.getGlobalContext().userSettings.dateFormattingInfo.TimeSeparator;
                        var fileName = prefix + " " + now.format(datePattern) + " " + now.format(timePattern) + ext;
                        fileName = fileName.split(dateSeparator).join("-").split(timeSeparator).join("-");
                        return fileName;
                    }
                    if (prefix && prefix.length != 0) {
                        return "" + prefix + ext;
                    }
                    return "Export" + ext;
                };
                /**
                 * Parses the xml and generates to XMLDocument using JS runtime
                 * @param xml xml represented as string for which we need XMLDocument
                 */
                Utility.ParseXml = function (xml) {
                    if (window.hasOwnProperty("DOMParser")) {
                        var parser = new DOMParser();
                        return parser.parseFromString(xml, "text/xml");
                    }
                    else if (window.hasOwnProperty("ActiveXObject")) {
                        var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM"); // tslint:disable-line:no-any
                        xmlDoc.async = false;
                        xmlDoc.loadXML(xml);
                        return xmlDoc;
                    }
                    return null;
                };
                Utility.getGridAttributes = function () {
                    var gridAttributes = ["sortColumns", "pageNum", "recsPerPage", "dataProvider", "uiProvider", "cols", "max", "refreshAsync", "pagingCookie", "enableMultiSort", "enablePagingWhenOnePage", "refreshCalledFromRefreshButton", "totalrecordcount", "allrecordscounted", "returntotalrecordcount", "getParameters", "parameters", "columns"];
                    return gridAttributes;
                };
                Utility.getGridParameters = function () {
                    var gridParameters = ["autorefresh", "isGridHidden", "isGridFilteringEnabled", "viewid", "viewtype", "RecordsPerPage", "viewTitle", "layoutXml", "otc", "otn", "entitydisplayname", "titleformat", "entitypluraldisplayname", "isWorkflowSupported", "fetchXmlForFilters", "isFetchXmlNotFinal", "effectiveFetchXml", "LayoutStyle", "enableFilters", "isTurboForm"];
                    return gridParameters;
                };
                Utility.getColumnValues = function (layoutXml) {
                    return "";
                };
                Utility.getGridAttributesDefaultValues = function () {
                    var defaultValuesforGridAttributes = {};
                    //Assign Default Values
                    var xmlDocument = Utility.ParseXml(Xrm.Page.data.attributes.get("entity_fetchXml").getValue());
                    var orderNode = xmlDocument;
                    //ToDo
                    defaultValuesforGridAttributes["sortColumns"] = "name:1";
                    defaultValuesforGridAttributes["pageNum"] = "1";
                    defaultValuesforGridAttributes["recsPerPage"] = "50";
                    defaultValuesforGridAttributes["dataProvider"] = "Microsoft.Crm.Application.Platform.Grid.GridDataProviderQueryBuilder";
                    defaultValuesforGridAttributes["uiProvider"] = "Microsoft.Crm.Application.Controls.GridUIProvider";
                    defaultValuesforGridAttributes["Cols"] = "Empty";
                    defaultValuesforGridAttributes["max"] = "-1";
                    defaultValuesforGridAttributes["refreshAsync"] = "false";
                    defaultValuesforGridAttributes["pagingCookie"] = "Empty";
                    defaultValuesforGridAttributes["enableMultiSort"] = "true";
                    defaultValuesforGridAttributes["enablePagingWhenOnePage"] = "true";
                    defaultValuesforGridAttributes["refreshCalledFromRefreshButton"] = "1";
                    defaultValuesforGridAttributes["totalrecordcount"] = Xrm.Page.data.attributes.get("entity_totalRecordCount").getValue();
                    defaultValuesforGridAttributes["allrecordscounted"] = "true";
                    defaultValuesforGridAttributes["returntotalrecordcount"] = "true";
                    defaultValuesforGridAttributes["getParameters"] = "Empty";
                    defaultValuesforGridAttributes["columns"] = Utility.getColumnValues(Xrm.Page.data.attributes.get("entity_layoutXml").getValue());
                    return defaultValuesforGridAttributes;
                };
                Utility.getGridParameterDefaultValues = function () {
                    var defaultValuesforGridParameters = {};
                    var fetchXml = Xrm.Page.data.attributes.get("entity_fetchXml").getValue();
                    var layoutXml = Xrm.Page.data.attributes.get("entity_layoutXml").getValue();
                    var entity_effectiveFetchXml = Xrm.Page.data.attributes.get("entity_fetchXml").getValue();
                    var entity_effectiveLayoutXml = Xrm.Page.data.attributes.get("entity_layoutXml").getValue();
                    //Extracting HTML Decoded Content
                    fetchXml = Utility.unescapeHtml(fetchXml);
                    layoutXml = Utility.unescapeHtml(layoutXml);
                    entity_effectiveFetchXml = Utility.unescapeHtml(entity_effectiveFetchXml);
                    entity_effectiveLayoutXml = Utility.unescapeHtml(entity_effectiveLayoutXml);
                    var entityTypeName = Xrm.Page.data.attributes.get("entity_typeName").getValue();
                    defaultValuesforGridParameters["autorefresh"] = "1";
                    defaultValuesforGridParameters["isGridHidden"] = "false";
                    defaultValuesforGridParameters["isGridFilteringEnabled"] = "1";
                    defaultValuesforGridParameters["viewid"] = Xrm.Page.data.attributes.get("entity_viewId").getValue();
                    defaultValuesforGridParameters["viewtype"] = "1039";
                    defaultValuesforGridParameters["RecordsPerPage"] = "50";
                    defaultValuesforGridParameters["viewTitle"] = encodeURIComponent(Xrm.Page.data.attributes.get("entity_viewName").getValue());
                    defaultValuesforGridParameters["layoutXml"] = layoutXml;
                    defaultValuesforGridParameters["otc"] = Xrm.Page.data.attributes.get("entity_typeCode").getValue().toString();
                    defaultValuesforGridParameters["otn"] = entityTypeName;
                    defaultValuesforGridParameters["entitydisplayname"] = entityTypeName;
                    defaultValuesforGridParameters["titleformat"] = "{0} {1}";
                    defaultValuesforGridParameters["entitypluraldisplayname"] = entityTypeName;
                    defaultValuesforGridParameters["isWorkflowSupported"] = "true";
                    defaultValuesforGridParameters["fetchXmlForFilters"] = entity_effectiveFetchXml;
                    defaultValuesforGridParameters["isFetchXmlNotFinal"] = "False";
                    defaultValuesforGridParameters["effectiveFetchXml"] = entity_effectiveFetchXml;
                    defaultValuesforGridParameters["LayoutStyle"] = "GridList";
                    defaultValuesforGridParameters["enableFilters"] = "1";
                    defaultValuesforGridParameters["isTurboForm"] = "0";
                    defaultValuesforGridParameters["fetchXml"] = fetchXml;
                    return defaultValuesforGridParameters;
                };
                /**
                * Export GridXml parameter
                * @param gridControl The current grid
                * @param entityTypeName The entityTypeName for this grid
                * @param exportType The type of exporting we are doing (static/dynamic/online...)
                */
                Utility.constructGridXml = function () {
                    var gridAttributes = Utility.getGridAttributes();
                    var xmlString = "<grid></grid>";
                    var gridXml = Utility.ParseXml(xmlString);
                    var index = 0;
                    var gridAttributeDefaultValues = Utility.getGridAttributesDefaultValues();
                    var gridParamerterDefaultValues = Utility.getGridParameterDefaultValues();
                    var gridParameters = Utility.getGridParameters();
                    while (index < gridAttributes.length) {
                        var node = gridXml.createElement(gridAttributes[index]);
                        if (gridAttributeDefaultValues[gridAttributes[index]] != "Empty") {
                            node.textContent = gridAttributeDefaultValues[gridAttributes[index]];
                        }
                        index++;
                        gridXml.documentElement.appendChild(node);
                    }
                    var parametersNodeCollection = gridXml.querySelectorAll('grid>parameters');
                    var parameternode = parametersNodeCollection[0];
                    index = 0;
                    while (index < gridAttributes.length) {
                        var nodeparam = gridXml.createElement(gridParameters[index]);
                        nodeparam.textContent = gridParamerterDefaultValues[gridParameters[index]];
                        index++;
                        parameternode.appendChild(nodeparam);
                    }
                    return (new XMLSerializer()).serializeToString(gridXml);
                };
                //HTML Encode Decode
                Utility.unescapeHtml = function (str) {
                    var map = { amp: '&', lt: '<', le: '≤', gt: '>', ge: '≥', quot: '"', '#039': "'" };
                    return str.replace(/&([^;]+);/g, function (m, c) { return map[c] || ''; });
                };
                /**
                 * Export PostData parameter to MDD
                 * @param gridControl The current grid
                 * @param entityTypeName The entityTypeName for this grid
                 * @param exportType The type of exporting we are doing (static/dynamic/online...)
                 */
                Utility.constructPostData = function () {
                    // Construct Grid Xml
                    var postData = "";
                    var exportType = Xrm.Page.data.attributes.get("entity_exportType").getValue();
                    var fetchXml = Xrm.Page.data.attributes.get("entity_fetchXml").getValue();
                    var layoutXml = Xrm.Page.data.attributes.get("entity_layoutXml").getValue();
                    //Extracting HTML Decoded Content
                    fetchXml = Utility.unescapeHtml(fetchXml);
                    layoutXml = Utility.unescapeHtml(layoutXml);
                    //Construct First Parameter - ExportType
                    if (exportType == 2) {
                        postData = postData.concat("exportType=dynamicXlsx&");
                    }
                    else if (exportType == 3) {
                        postData = postData.concat("exportType=pivotXlsx&");
                    }
                    //Construct Second Parameter - GridXml
                    postData = postData.concat("gridXml=" + Utility.unescapeHtml(Utility.constructGridXml()) + "&");
                    //Construct the FetchXml Parameter
                    postData = postData.concat("fetchXml=" + fetchXml + "&");
                    //Construct the LayoutXml
                    postData = postData.concat("layoutXml=" + layoutXml + "&printAllPages=1");
                    return postData;
                };
                return Utility;
            }());
            Common.Utility = Utility;
        })(Common = AppCommon.Common || (AppCommon.Common = {}));
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
var SmbAppsTelemetryUtility;
(function (SmbAppsTelemetryUtility) {
    'use strict';
    /**
    * To format the inner payload for telemetry data according to the event schema
    */
    var TelemetryParameter = (function () {
        function TelemetryParameter() {
        }
        return TelemetryParameter;
    }());
    SmbAppsTelemetryUtility.TelemetryParameter = TelemetryParameter;
    /**
    * To format the outer payload for telemetry data according to the event schema
    */
    var TelemetryPayload = (function () {
        function TelemetryPayload() {
        }
        return TelemetryPayload;
    }());
    SmbAppsTelemetryUtility.TelemetryPayload = TelemetryPayload;
    var Controls_ShellMode;
    (function (Controls_ShellMode) {
        //Basic Shell Mode
        Controls_ShellMode[Controls_ShellMode["BASICSHELLMODE"] = 0] = "BASICSHELLMODE";
        //Advanced Shell Mode
        Controls_ShellMode[Controls_ShellMode["ADVANCEDSHELLMODE"] = 1] = "ADVANCEDSHELLMODE";
        //Stand Alone Page
        Controls_ShellMode[Controls_ShellMode["STANDALONE"] = 2] = "STANDALONE";
    })(Controls_ShellMode = SmbAppsTelemetryUtility.Controls_ShellMode || (SmbAppsTelemetryUtility.Controls_ShellMode = {}));
    /**
     * Enums for Page Types for FRE SMB Sales App
     */
    var Controls_PageType;
    (function (Controls_PageType) {
        //BasicSetup Summary Page
        Controls_PageType[Controls_PageType["BASICSETUPSUMMARY"] = 0] = "BASICSETUPSUMMARY";
        //AppWelcome Page
        Controls_PageType[Controls_PageType["APPWELCOME"] = 1] = "APPWELCOME";
        //Setting Summary Page
        Controls_PageType[Controls_PageType["SETTINGSUMMARY"] = 2] = "SETTINGSUMMARY";
        //Branding and Theming Page
        Controls_PageType[Controls_PageType["BRANDINGANDTHEMING"] = 3] = "BRANDINGANDTHEMING";
        // Fiscal year Page
        Controls_PageType[Controls_PageType["FISCALYEAR"] = 4] = "FISCALYEAR";
        //Email Template Page
        Controls_PageType[Controls_PageType["EMAILTEMPLATE"] = 5] = "EMAILTEMPLATE";
        //Word and Excel Template Page
        Controls_PageType[Controls_PageType["WORDANDEXCELTEMPLATE"] = 6] = "WORDANDEXCELTEMPLATE";
        //Document Storage page
        Controls_PageType[Controls_PageType["DOCUMENTSTORAGE"] = 7] = "DOCUMENTSTORAGE";
        //Quote To cash Page
        Controls_PageType[Controls_PageType["QUOTETOCASH"] = 8] = "QUOTETOCASH";
        //ApplicationManagement Page
        Controls_PageType[Controls_PageType["APPLICATIONMANAGEMENT"] = 9] = "APPLICATIONMANAGEMENT";
        //Sample Data management Page
        Controls_PageType[Controls_PageType["SAMPLEDATAMANAGEMENT"] = 10] = "SAMPLEDATAMANAGEMENT";
        //Duplicate Detection Page
        Controls_PageType[Controls_PageType["DUPLICATEDETECTION"] = 11] = "DUPLICATEDETECTION";
        //User management
        Controls_PageType[Controls_PageType["USERMANAGEMENT"] = 12] = "USERMANAGEMENT";
        //Team management
        Controls_PageType[Controls_PageType["TEAMMANAGEMENT"] = 13] = "TEAMMANAGEMENT";
        //Click To Call Page
        Controls_PageType[Controls_PageType["CLICKTOCALL"] = 14] = "CLICKTOCALL";
        //Product Catalog Page
        Controls_PageType[Controls_PageType["PRODUCTCATALOG"] = 15] = "PRODUCTCATALOG";
        //Leads and Contacts Page
        Controls_PageType[Controls_PageType["LEADANDCONTACT"] = 16] = "LEADANDCONTACT";
        //Import Data Page
        Controls_PageType[Controls_PageType["IMPORTDATA"] = 17] = "IMPORTDATA";
        //Export Data Page
        Controls_PageType[Controls_PageType["EXPORTDATA"] = 18] = "EXPORTDATA";
        //Forms Page
        Controls_PageType[Controls_PageType["FORMS"] = 19] = "FORMS";
        //Views Page
        Controls_PageType[Controls_PageType["VIEWS"] = 20] = "VIEWS";
        //Business process flow Page
        Controls_PageType[Controls_PageType["BUSINESSPROCESSFLOW"] = 21] = "BUSINESSPROCESSFLOW";
        Controls_PageType[Controls_PageType["SETWORKHOUR"] = 22] = "SETWORKHOUR";
    })(Controls_PageType = SmbAppsTelemetryUtility.Controls_PageType || (SmbAppsTelemetryUtility.Controls_PageType = {}));
    /**
     *Enums for  Actions Types associated with FRE Pages
     */
    var Controls_EventName;
    (function (Controls_EventName) {
        //Button is clicked
        Controls_EventName[Controls_EventName["CLICKEDBUTTON"] = 0] = "CLICKEDBUTTON";
        //LINK is Clicked
        Controls_EventName[Controls_EventName["CLICKEDLINK"] = 1] = "CLICKEDLINK";
        //Combobox is clicked
        Controls_EventName[Controls_EventName["CLICKEDCOMBOBOX"] = 2] = "CLICKEDCOMBOBOX";
        //Checkbox is clicked
        Controls_EventName[Controls_EventName["CLICKEDCHECKBOX"] = 3] = "CLICKEDCHECKBOX";
        //Textbox is changes
        Controls_EventName[Controls_EventName["CHANGEDTEXTBOX"] = 4] = "CHANGEDTEXTBOX";
        //FRE page is visited
        Controls_EventName[Controls_EventName["PAGEVISITED"] = 5] = "PAGEVISITED";
        //Error occurs
        Controls_EventName[Controls_EventName["ERROR"] = 6] = "ERROR";
        //If there is a success scenario
        Controls_EventName[Controls_EventName["SUCCESS"] = 7] = "SUCCESS";
        //If an event is Completed
        Controls_EventName[Controls_EventName["COMPLETED"] = 8] = "COMPLETED";
        //If a user is dropped from any page
        Controls_EventName[Controls_EventName["DROPPED"] = 9] = "DROPPED";
        //An upload event
        Controls_EventName[Controls_EventName["UPLOADS"] = 10] = "UPLOADS";
        //Grid Command is Clicked
        Controls_EventName[Controls_EventName["CLICKEDGRIDCOMMAND"] = 11] = "CLICKEDGRIDCOMMAND";
        //Form Command is Clicked
        Controls_EventName[Controls_EventName["CLICKEDFORMCOMMAND"] = 12] = "CLICKEDFORMCOMMAND";
        //Command is Executed
        Controls_EventName[Controls_EventName["CLOSEDCOMMAND"] = 13] = "CLOSEDCOMMAND";
        //Selectbox is clicked
        Controls_EventName[Controls_EventName["CLICKEDSELECTBOX"] = 14] = "CLICKEDSELECTBOX";
    })(Controls_EventName = SmbAppsTelemetryUtility.Controls_EventName || (SmbAppsTelemetryUtility.Controls_EventName = {}));
    /**
     * Class for Telemetry Data for FRE pages
     */
    var TelemetryData = (function () {
        function TelemetryData(context, count, pagetype, eventname, customcontrolname, customcontrolID, customcontrolShellmode, information, isError) {
            this._enableLogging = true;
            this._context = context;
            this._count = count;
            this._pagetype = pagetype;
            this._eventname = eventname;
            this._customcontrolname = customcontrolname;
            this._customcontrolid = customcontrolID;
            this._customcontrolShellmode = customcontrolShellmode;
            this._information = information;
            this._isError = isError;
        }
        /**
         * @function _getMessageString
         * @description Helper function to format the "message" attribute for schema "SMBSalesFREInfo"
         * @returns {string}
         */
        TelemetryData.prototype._getMessageString = function () {
            var message;
            if (this._isError) {
                message = "CC_Name:" + this._customcontrolname + ",CC_ID:" + this._customcontrolid + ",CC_ShellMode:" + this._getShellMode(this._customcontrolShellmode) + ",ErrorType:" + this._information;
            }
            else {
                message = "CC_Name:" + this._customcontrolname + ",CC_ID:" + this._customcontrolid + ",CC_ShellMode:" + this._getShellMode(this._customcontrolShellmode) + ",Message:" + this._information;
            }
            return message;
        };
        /**
         * @function _getsolutionVersion
         * @description Helper function to format the "SolutionVersion" attribute for schema "SMBSalesFREInfo"
         * @returns {string}
         */
        TelemetryData.prototype._getsolutionVersion = function () {
            var solutionApp = "default";
            if (window && window.top && window.top.getGlobalContextObject() && window.top.getGlobalContextObject().getCurrentAppName()._result)
                solutionApp = window.top.getGlobalContextObject().getCurrentAppName()._result;
            return solutionApp;
        };
        /**
         * @function _getPageType
         * @description Return the corrosponding string associated to enum for pagetype.
         * @returns {string}
         * @param {Controls_PageType} pagetype
         */
        TelemetryData.prototype._getPageType = function (pagetype) {
            switch (pagetype) {
                case Controls_PageType.BASICSETUPSUMMARY: return "Basic Setup Summary Page";
                case Controls_PageType.APPLICATIONMANAGEMENT: return "Application Management Page";
                case Controls_PageType.APPWELCOME: return "App Welcome Page";
                case Controls_PageType.BRANDINGANDTHEMING: return "Branding and Theming Page";
                case Controls_PageType.DOCUMENTSTORAGE: return "Document Storage Page";
                case Controls_PageType.EMAILTEMPLATE: return "Email Template Page";
                case Controls_PageType.FISCALYEAR: return "Fiscal Year Page";
                case Controls_PageType.QUOTETOCASH: return "QuoteToCash Page";
                case Controls_PageType.SAMPLEDATAMANAGEMENT: return "Sample Data Management Page";
                case Controls_PageType.SETTINGSUMMARY: return "Setting Summary Page";
                case Controls_PageType.WORDANDEXCELTEMPLATE: return "Word And Excel Document Page";
                case Controls_PageType.DUPLICATEDETECTION: return "Duplicate Detection Page";
                case Controls_PageType.USERMANAGEMENT: return "User Management page";
                case Controls_PageType.TEAMMANAGEMENT: return "Team Management page";
                case Controls_PageType.CLICKTOCALL: return "Click To Call Page";
                case Controls_PageType.PRODUCTCATALOG: return "Product Catalog Page";
                case Controls_PageType.LEADANDCONTACT: return "Leads and Contacts Page";
                case Controls_PageType.IMPORTDATA: return "Import Data Page";
                case Controls_PageType.EXPORTDATA: return "Export Data Page";
                case Controls_PageType.FORMS: return "Forms Page";
                case Controls_PageType.VIEWS: return "Views Page";
                case Controls_PageType.BUSINESSPROCESSFLOW: return "Business process flow Page";
                default: return null;
            }
        };
        /**
         * @function _getShellMode
         * @description Return the corrosponding string associated to enum for Shell.
         * @returns {string}
         * @param {Controls_ShellMode} shellMode
         */
        TelemetryData.prototype._getShellMode = function (shellMode) {
            switch (shellMode) {
                case Controls_ShellMode.ADVANCEDSHELLMODE: return "Advanced Shell";
                case Controls_ShellMode.BASICSHELLMODE: return "Basic Shell";
                case Controls_ShellMode.STANDALONE: return "StandAlone Page";
                default: return null;
            }
        };
        /**
         * @function _getEventName
         * @description Return the corrosponding string associated to enum for eventtype.
         * @returns {string}
         * @param {Controls_EventName} eventname
         */
        TelemetryData.prototype._getEventName = function (eventname) {
            switch (eventname) {
                case Controls_EventName.CHANGEDTEXTBOX: return "Changed TextBox";
                case Controls_EventName.CLICKEDBUTTON: return "Clicked Button";
                case Controls_EventName.CLICKEDCHECKBOX: return "Clicked CheckBox";
                case Controls_EventName.CLICKEDCOMBOBOX: return "Clicked ComboBox";
                case Controls_EventName.CLICKEDSELECTBOX: return "Clicked SelectBox";
                case Controls_EventName.CLICKEDLINK: return "Clicked Link";
                case Controls_EventName.COMPLETED: return "Activity Completed";
                case Controls_EventName.DROPPED: return "Activity Dropped";
                case Controls_EventName.ERROR: return "Error Encountered";
                case Controls_EventName.PAGEVISITED: return "Page Visited";
                case Controls_EventName.SUCCESS: return "Success";
                case Controls_EventName.UPLOADS: return "Uploads";
                case Controls_EventName.CLICKEDGRIDCOMMAND: return "Clicked Grid Command";
                default: return null;
            }
        };
        /**
         * @function _getTelemetryData
         * @description Formats the payload according to schema for telemetry event "SMBSalesFREInfo"
         * @returns {TelemetryPayload}
         */
        TelemetryData.prototype._getTelemetryData = function () {
            var payload = {
                eventName: "SMBFREEventInfo", eventParameters: []
            };
            var para1 = { name: "ActionName", value: this._getEventName(this._eventname) };
            var para2 = { name: "Count", value: this._count };
            var para3 = { name: "Message", value: this._getMessageString() };
            var para4 = { name: "PageName", value: this._getPageType(this._pagetype) };
            var para5 = { name: "SolutionVersion", value: this._getsolutionVersion() };
            payload.eventParameters.push(para1);
            payload.eventParameters.push(para2);
            payload.eventParameters.push(para3);
            payload.eventParameters.push(para4);
            payload.eventParameters.push(para5);
            return payload;
        };
        /**
         * @function ReportEventData
         * @description Logs Telemetry Data
         */
        TelemetryData.ReportEventData = function (context, count, pagetype, eventname, customcontrolname, customcontrolID, customcontrolShellmode, information, isError) {
            var telemetrydata = new TelemetryData(context, count, pagetype, eventname, customcontrolname, customcontrolID, customcontrolShellmode, information, isError);
            try {
                if (telemetrydata._enableLogging) {
                    if (telemetrydata._context != null) {
                        telemetrydata._context.reporting.reportEvent(telemetrydata._getTelemetryData());
                    }
                    else {
                        Xrm.Reporting.reportEvent(telemetrydata._getTelemetryData());
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        };
        TelemetryData.ReportAppComponentFailureTelemetry = function (context, pagetype, err, suggestedMitigation) {
            var telemetryerrordata = new TelemetryData(context, null, pagetype);
            var errorToBeLogged = { message: "" };
            var componentName = "";
            if (typeof err != "object" || err.message == null) {
                errorToBeLogged.message = JSON.stringify(err);
            }
            else {
                errorToBeLogged = err;
            }
            if (telemetryerrordata._pagetype) {
                componentName = telemetryerrordata._getsolutionVersion() + "." + telemetryerrordata._getPageType(telemetryerrordata._pagetype);
            }
            //API
            try {
                if (telemetryerrordata._context != null) {
                    telemetryerrordata._context.reporting.reportFailure(componentName, errorToBeLogged, suggestedMitigation);
                }
                else {
                    Xrm.Reporting.reportFailure(componentName, errorToBeLogged, suggestedMitigation);
                }
            }
            catch (e) {
                console.log(e);
            }
        };
        return TelemetryData;
    }());
    SmbAppsTelemetryUtility.TelemetryData = TelemetryData;
})(SmbAppsTelemetryUtility || (SmbAppsTelemetryUtility = {}));
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
/// <reference path="../../../../../TypeDefinitions/mscrm.d.ts" />
var ODataContract;
(function (ODataContract) {
    var ODataUpdateRequest = (function () {
        function ODataUpdateRequest(etn, id, payload) {
            this.etn = etn;
            this.id = id;
            this.payload = payload;
        }
        ODataUpdateRequest.prototype.getMetadata = function () {
            return {
                boundParameter: undefined,
                parameterTypes: {},
                operationName: "Update",
                operationType: 2,
            };
        };
        return ODataUpdateRequest;
    }());
    ODataContract.ODataUpdateRequest = ODataUpdateRequest;
})(ODataContract || (ODataContract = {}));
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var DialogConstants = (function () {
            function DialogConstants() {
            }
            return DialogConstants;
        }());
        //Width to be used for all the dialogs.
        DialogConstants.DialogWidth = "300px";
        DialogConstants.ChangeManagerDialogName = "ChangeManager";
        DialogConstants.ReassignDialogName = "ReassignAllRecords";
        DialogConstants.JoinTeamsDialogName = "JoinTeams";
        DialogConstants.ManageUserRolesDialogName = "ManageSystemUserRoles";
        DialogConstants.ManageTeamRolesDialogName = "ManageTeamRoles";
        DialogConstants.AddTeamMembersDialogName = "AddMembers";
        DialogConstants.RemoveTeamMembersDialogName = "RemoveMembers";
        DialogConstants.DialogOkId = "ok_id";
        DialogConstants.OwnerId = "owner_id";
        DialogConstants.OwnerType = "owner_type";
        DialogConstants.EntityId = "entity_id";
        DialogConstants.EntityName = "entity_name";
        DialogConstants.LastButtonClicked = "last_button_clicked";
        DialogConstants.SystemUserViewId = "systemuserview_id";
        DialogConstants.EntityRecords = "entity_records";
        DialogConstants.TargetEntities = "target_entities";
        DialogConstants.RowsData = "rows_data";
        DialogConstants.UserRolesMap = "user_rolesmap";
        DialogConstants.TeamRolesMap = "team_rolesmap";
        DialogConstants.ColumnsDefinition = "columns_definition";
        DialogConstants.TotalRecordsSelected = "total_records_selected";
        DialogConstants.SelectedRecords = "selected_records";
        DialogConstants.ParentId = "parent_id";
        DialogConstants.ChangeManagerControlId = "changemanagercontrol_id";
        DialogConstants.customLabel = "custom_label";
        DialogConstants.ErrorKey_GenericErrorOccurred = "SMBAdvSettings_GenericErrorOccurred";
        AppCommon.DialogConstants = DialogConstants;
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
/// <reference path="../ClientCommon/DialogConstants.ts" />
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        //Contains common utils needed for command handling for Team Management Settings
        var DialogUtils = (function () {
            function DialogUtils() {
            }
            /**
             * function to get value of the control
             * @param uiControlId control id of MDD control
             */
            DialogUtils.GetControlValue = function (uiControlId) {
                var control = Xrm.Page.ui.controls.get(uiControlId);
                if (control) {
                    var controlAttribute = control.getAttribute();
                    if (controlAttribute) {
                        return controlAttribute.getValue();
                    }
                }
            };
            /**
             * function to set the value in control
             * @param uiControlId control id of MDD control
             * @param value value that needs to be set on control
             */
            DialogUtils.SetControlValue = function (uiControlId, value) {
                var control = Xrm.Page.ui.controls.get(uiControlId);
                if (control) {
                    var controlAttribute = control.getAttribute();
                    if (controlAttribute) {
                        controlAttribute.setValue(value);
                    }
                }
            };
            /**
             * function to Disable the control
             * @param uiControl control id of MDD control
             */
            DialogUtils.DisableControl = function (uiControlId) {
                var control = Xrm.Page.ui.controls.get(uiControlId);
                if (control) {
                    control.setDisabled(true);
                }
            };
            /**
             * function to Enable the control
             * @param uiControl control id of MDD control
             */
            DialogUtils.EnableControl = function (uiControlId) {
                var control = Xrm.Page.ui.controls.get(uiControlId);
                if (control) {
                    control.setDisabled(false);
                }
            };
            /**
             * function to set visibility of the control
             * @param uiControl control id of MDD control
             * @param value visibility of the control
             */
            DialogUtils.SetVisible = function (uiControlId, value) {
                var control = Xrm.Page.ui.controls.get(uiControlId);
                if (control) {
                    control.setVisible(value);
                }
            };
            /**
             * Handles an error returned from the server
             * @param error error object thrown by server
             */
            DialogUtils.HandleServerError = function (error) {
                if (DialogUtils.isNullOrUndefined(error)
                    || DialogUtils.isNullOrUndefined(error.errorCode)
                    || error.errorCode == 0
                    || (!DialogUtils.isNullOrUndefined(error.errorCode) && !DialogUtils.isNullOrUndefined(error.message) && error.message == "")) {
                    //when errorCode is 0/null/undefined then we won't get localized error from server, so show generic CRM error
                    //when errorMessage is empty then show generic CRM error
                    DialogUtils.ShowLocalizedErrorByResourceKey(AppCommon.DialogConstants.ErrorKey_GenericErrorOccurred);
                    return;
                }
                console.error("Error : " + error.message);
                var errorDialogOptions = {
                    message: error.message,
                    errorCode: error.errorCode
                };
                Xrm.Navigation.openErrorDialog(errorDialogOptions);
            };
            /**
             * Shows generic error message to user
             * @param message optional message to log error on console
             */
            DialogUtils.ShowGenericError = function (message) {
                if (!DialogUtils.isNullOrUndefined(message)) {
                    console.error(message);
                }
                DialogUtils.ShowLocalizedErrorByResourceKey(AppCommon.DialogConstants.ErrorKey_GenericErrorOccurred);
            };
            /**
             * Retrieves localized string
             * @param key
             */
            DialogUtils.getLocalizedString = function (key) {
                var webResourceName = "AppCommon/Localization/Languages/AppCommon";
                var value = Xrm.Utility.getResourceString(webResourceName, key);
                if (value === undefined || value === null) {
                    value = key;
                }
                return value;
            };
            /**
             * Retrieves localized string for a given key and shows that in an alert dialog
             * @param key resourceKey of AppCommon resx file
             */
            DialogUtils.ShowLocalizedErrorByResourceKey = function (key) {
                var error = DialogUtils.getLocalizedString(key);
                console.error("Error : " + error);
                Xrm.Utility.alertDialog(error);
            };
            /**
             * checks whether object is Null or undefined
             * @param item any object
             */
            DialogUtils.isNullOrUndefined = function (item) {
                if (item == null || item == undefined) {
                    return true;
                }
                else {
                    return false;
                }
            };
            /**
             * Get clienturl
             */
            DialogUtils.getClientUrl = function () {
                return Xrm.Page.context.getClientUrl();
            };
            /**
             * displays error to user using alert dialog
             * @param err error that needs to be displayed
             */
            DialogUtils.handleError = function (err) {
                console.log(err.message);
                Xrm.Utility.alertDialog(err.message);
            };
            /**
             * Gets the businessunit related data of current user
             * returns promise same as Xrm.WebApi.online.retrieveRecord
             */
            DialogUtils.GetCurrentUserBusinessUnitData = function () {
                var userId = Xrm.Page.context.getUserId();
                userId = userId.replace(/[{}]/g, '');
                return Xrm.WebApi.retrieveRecord("systemuser", userId, "?$select=systemuserid&$expand=businessunitid($select=name,businessunitid)");
            };
            DialogUtils.createActionFailedErrorDialog = function (errorResponse) {
                Mscrm.AppCommon.DialogUtils.hideProgressIndicator();
                var errorDialogOptions = {
                    message: errorResponse.message,
                    errorCode: errorResponse.errorCode
                };
                Xrm.Navigation.openErrorDialog(errorDialogOptions);
            };
            DialogUtils.actionFailedCallback = function (response) {
                Mscrm.AppCommon.DialogUtils.hideProgressIndicator();
                DialogUtils.HandleServerError(response);
            };
            DialogUtils.getETC = function (entityName) {
                switch (entityName) {
                    case 'systemuser':
                        return 8;
                    case 'team':
                        return 9;
                }
                throw new Error("Invalid entity: " + entityName);
            };
            DialogUtils.hideProgressIndicator = function () {
                Xrm.Utility.closeProgressIndicator();
            };
            DialogUtils.showProgressIndicator = function (message) {
                if (message == null) {
                    Xrm.Utility.showProgressIndicator();
                }
                else {
                    Xrm.Utility.showProgressIndicator(message);
                }
            };
            DialogUtils.showGlobalNotification = function (message, title) {
                Xrm.UI.addGlobalNotification(1 /* toast */, 1 /* success */, message, title, null);
            };
            DialogUtils.showGlobalNotification_GenericError = function () {
                Xrm.UI.addGlobalNotification(1 /* toast */, 2 /* error */, DialogUtils.getLocalizedString(AppCommon.DialogConstants.ErrorKey_GenericErrorOccurred), "", null);
            };
            return DialogUtils;
        }());
        AppCommon.DialogUtils = DialogUtils;
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
///<reference path="./GridRecord.ts"/>
///<reference path="../../Controls/FREShell/DataContracts/ODataUpdateRequest.ts"/>
/// <reference path="../ClientCommon/DialogUtils.ts" />
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var StateCode;
        (function (StateCode) {
            StateCode[StateCode["Deactivate"] = 0] = "Deactivate";
            StateCode[StateCode["Activate"] = 1] = "Activate";
        })(StateCode = AppCommon.StateCode || (AppCommon.StateCode = {}));
        var ODataUpdateRequest = ODataContract.ODataUpdateRequest;
        var GridCommands = (function () {
            function GridCommands() {
            }
            GridCommands.UpdateStateCodeOfRecords = function (statecode, records, gridControl) {
                var updateEntity = {};
                updateEntity["statecode"] = statecode;
                var requestsToExecute = [];
                var record;
                // Creating the requests
                for (var _i = 0, records_1 = records; _i < records_1.length; _i++) {
                    record = records_1[_i];
                    record.Id = record.Id.replace(/[{}]/g, '');
                    requestsToExecute.push(new ODataUpdateRequest(record.TypeName, record.Id, updateEntity));
                }
                AppCommon.DialogUtils.showProgressIndicator();
                // Executing the requests
                Xrm.WebApi.online.executeMultiple(requestsToExecute).then(function (success) {
                    if (success.every(function (response) { return response.ok; })) {
                        AppCommon.DialogUtils.hideProgressIndicator();
                        gridControl.refresh();
                    }
                    else {
                        AppCommon.DialogUtils.hideProgressIndicator();
                        Xrm.Navigation.openAlertDialog({
                            text: AppCommon.DialogUtils.getLocalizedString(Constants.ActionOnMultipleRecordsFailed)
                        });
                    }
                }, AppCommon.DialogUtils.actionFailedCallback);
            };
            return GridCommands;
        }());
        AppCommon.GridCommands = GridCommands;
        var Constants = (function () {
            function Constants() {
            }
            Object.defineProperty(Constants, "ActionOnMultipleRecordsFailed", {
                get: function () {
                    return "SMBAdvSettings_ActionOnMultipleRecordsFailed";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Constants, "ActivatedBPFDeletionError", {
                get: function () {
                    return "SMBAdvSettings_ActivatedBPFDeletionError";
                },
                enumerable: true,
                configurable: true
            });
            return Constants;
        }());
        AppCommon.Constants = Constants;
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
/// <reference path="../../../../../TypeDefinitions/mscrm.d.ts" />
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var RemoveAppComponentsRequest = (function () {
        function RemoveAppComponentsRequest(appId, components) {
            this.AppId = appId;
            this.Components = components;
        }
        RemoveAppComponentsRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "AppId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                    "Components": {
                        "typeName": "mscrm.crmbaseentity",
                        "structuralProperty": 4,
                    },
                },
                operationName: "RemoveAppComponents",
                operationType: 0,
            };
            return metadata;
        };
        return RemoveAppComponentsRequest;
    }());
    ODataContract.RemoveAppComponentsRequest = RemoveAppComponentsRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var PublishXmlRequest = (function () {
        function PublishXmlRequest(parameterXml) {
            this.ParameterXml = parameterXml;
        }
        PublishXmlRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "ParameterXml": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                },
                operationName: "PublishXml",
                operationType: 0,
            };
            return metadata;
        };
        return PublishXmlRequest;
    }());
    ODataContract.PublishXmlRequest = PublishXmlRequest;
})(ODataContract || (ODataContract = {}));
///<reference path="./GridRecord.ts"/>
/// <reference path= "../../Controls/FREShell/DataContracts/RemoveAppComponentsRequest.ts" />
/// <reference path= "../../Controls/FREShell/DataContracts/PublishXmlRequest.ts" />
/// <reference path="../../Controls/FREShell/WebApi/Utility.ts" />
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        var DeleteComponentGridCommand = (function () {
            function DeleteComponentGridCommand() {
            }
            /**
             * DeleteComponentAsync is used to delete component belonging to current app
             * @param record: It takes record of type GridRecord
             * @returns It returs async promise which can be used to success or failure of the deletion action
             * @prevalidation It is advisable to deactivate the record before deletion of record is initiated.
            */
            DeleteComponentGridCommand.DeleteComponentAsync = function (record) {
                record.Id = record.Id.replace(/[{}]/g, '');
                var retPromise = new Promise(function (resolve, reject) {
                    DeleteComponentGridCommand.RemoveFromAppComponentAsync(record)
                        .then(function () {
                        DeleteComponentGridCommand.PublishTheCurrentAppAsync()
                            .then(function () {
                            DeleteComponentGridCommand.RemoveFromEntityAsync(record)
                                .then(function (successResponse) { resolve(successResponse); }, function (errorResponse) { reject(errorResponse); });
                        }, function (errorResponse) { reject(errorResponse); });
                    }, function (errorResponse) { reject(errorResponse); });
                });
                return retPromise;
            };
            //Step 1: Removing foreign key reference from AppComponent entity.
            DeleteComponentGridCommand.RemoveFromAppComponentAsync = function (record) {
                var appId = Mscrm.AppCommon.Common.Utility.GetCurrentAppId();
                var removeAPPComponentContract = new ODataContract.RemoveAppComponentsRequest({ guid: appId }, [{ id: record.Id, entityType: record.TypeName }]);
                return Xrm.WebApi.online.execute(removeAPPComponentContract);
            };
            //Step2: Publishing the current app.
            DeleteComponentGridCommand.PublishTheCurrentAppAsync = function () {
                var appId = Mscrm.AppCommon.Common.Utility.GetCurrentAppId();
                var ParameterXml = "<importexportxml><appmodules><appmodule>{" + appId + "}</appmodule></appmodules></importexportxml>";
                var publishXmlRequestDataContract = new ODataContract.PublishXmlRequest(ParameterXml);
                return Xrm.WebApi.online.execute(publishXmlRequestDataContract);
            };
            //Step3:Removing primary key reference from entity.
            DeleteComponentGridCommand.RemoveFromEntityAsync = function (record) {
                return Xrm.WebApi.deleteRecord(record.TypeName, record.Id);
            };
            return DeleteComponentGridCommand;
        }());
        AppCommon.DeleteComponentGridCommand = DeleteComponentGridCommand;
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../../Controls/FREShell/WebApi/Utility.ts" />
/// <reference path="../../Controls/FREShell/Telemetry/TelemetryUtility.ts" />
/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../CommonGridCommands/ActivateDeactivate.ts"/>
/// <reference path="../CommonGridCommands/DeleteComponent.ts"/>
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var RetrieveTenantAdminPermissionsRequest = (function () {
        function RetrieveTenantAdminPermissionsRequest() {
        }
        RetrieveTenantAdminPermissionsRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {},
                operationName: "RetrieveTenantAdminPermissions",
                operationType: 1,
            };
            return metadata;
        };
        return RetrieveTenantAdminPermissionsRequest;
    }());
    ODataContract.RetrieveTenantAdminPermissionsRequest = RetrieveTenantAdminPermissionsRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var RetrieveUserPrivilegesRequest = (function () {
        function RetrieveUserPrivilegesRequest(entity /*Microsoft.Dynamics.CRM.systemuser*/) {
            this.entity = entity;
        }
        RetrieveUserPrivilegesRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.systemuser",
                        "structuralProperty": 5,
                    },
                },
                operationName: "RetrieveUserPrivileges",
                operationType: 1,
            };
            return metadata;
        };
        return RetrieveUserPrivilegesRequest;
    }());
    ODataContract.RetrieveUserPrivilegesRequest = RetrieveUserPrivilegesRequest;
})(ODataContract || (ODataContract = {}));
/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../../../../../references/internal/TypeDefinitions/XrmClientApi/XrmClassicWebClientApi.d.ts" />
/// <reference path="../../Controls/FREShell/DataContracts/RetrieveTenantAdminPermissionsRequest.ts" />
/// <reference path="../../Controls/FREShell/DataContracts/RetrieveUserPrivilegesRequest.ts" />
/// <reference path="../clientcommon/dialogutils.ts" />
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var RetrieveTenantAdminPermissionsRequest = ODataContract.RetrieveTenantAdminPermissionsRequest;
        var RetrieveUserPrivilegesRequest = ODataContract.RetrieveUserPrivilegesRequest;
        var TeamType;
        (function (TeamType) {
            TeamType[TeamType["Owner"] = 0] = "Owner";
            TeamType[TeamType["Access"] = 1] = "Access";
        })(TeamType || (TeamType = {}));
        var RibbonRules = (function () {
            function RibbonRules() {
            }
            RibbonRules.ShowDownloadTemplateButton = function () {
                return true;
            };
            RibbonRules.IsUClient = function () {
                var global = window;
                var xrm = global.Xrm;
                var result = false;
                if (xrm && xrm.Internal && xrm.Internal.isUci) {
                    result = xrm.Internal.isUci();
                }
                else {
                    // fall back to url inspection
                    result = window && window.parent
                        && window.parent.location
                        && window.parent.location.href
                        && window.parent.location.href.toLowerCase().indexOf("uclient") !== -1;
                }
                return result;
            };
            RibbonRules.IsAppCommonControlPage = function () {
                var result = false;
                // return true if current url format matches appcommon smb control pages' url 
                result = window && window.parent
                    && window.parent.location
                    && window.parent.location.href
                    && window.parent.location.href.toLowerCase().indexOf("controlname=mscrmcontrols.appcommon.") !== -1;
                return result;
            };
            RibbonRules.IsSalesProControlPage = function () {
                var result = false;
                // return true if current url format matches appcommon salespro control pages' url 
                result = window && window.parent
                    && window.parent.location
                    && window.parent.location.href
                    && window.parent.location.href.toLowerCase().indexOf("controlname=mscrmcontrols.salespro.") !== -1;
                return result;
            };
            /// <summary>
            /// Checks the current role has Assign Privileges.
            /// </summary>
            /// <returns>true if it is role is assign, false otherwise</returns>
            RibbonRules.CheckRoleHasAssignPrivilege = function () {
                if (false == RibbonRules.retrieveUserPrivilegesAPICalled) {
                    var userId = Xrm.Page.context.getUserId();
                    userId = userId.replace(/[{}]/g, '');
                    var sourceEntity = { id: userId, entityType: "systemuser" };
                    var that = this;
                    var retrieveUserPrivilegesRequest = new RetrieveUserPrivilegesRequest(sourceEntity);
                    return Xrm.WebApi.online.execute(retrieveUserPrivilegesRequest).then(function (response) {
                        if (response) {
                            return response.json().then(function (jsonResponse) {
                                /*
                                Sample format of JSON retrived by the OData call
                                {
                                "@odata.context":"http://<machine>/<org>/api/data/v9.0/$metadata#Microsoft.Dynamics.CRM.RetrieveUserPrivilegesResponse",
                                "RolePrivileges":
                                    [
                                        {"Depth":"Global","PrivilegeId":"0011cc28-36a4-4b1c-8c25-d0c516ddb4bc","BusinessUnitId":"45fd3737-274d-e711-80ea-00155d36101c"},
                                        {"Depth":"Global","PrivilegeId":"003d8a0f-c230-411c-a993-cc0a8aeaac96","BusinessUnitId":"45fd3737-274d-e711-80ea-00155d36101c"},
                                        ...
                                    ]
                                }
                                */
                                try {
                                    if (jsonResponse) {
                                        var rolePrivileges = jsonResponse.RolePrivileges;
                                        RibbonRules.retrieveUserPrivilegesAPICalled = true;
                                        for (var index in rolePrivileges) {
                                            var permissionObject = rolePrivileges[index];
                                            //check if user has create permission on team entity
                                            //"836D6C7B-CF1D-47F0-8021-8E41091C489C" is for prvAssignRole permission
                                            var privilegeID = permissionObject["PrivilegeId"];
                                            if (privilegeID == "836d6c7b-cf1d-47f0-8021-8e41091c489c") {
                                                RibbonRules.hasAssignRolePermission = true;
                                                return true;
                                            }
                                        }
                                    }
                                }
                                catch (e) {
                                    console.error("EnableRule CheckRoleHasAssignPrivilege execution failed due to : incorrect jsonResponse from WebAPI request RetrieveUserPrivilegesRequest API.");
                                    return false;
                                }
                            });
                        }
                    }, function (error) {
                        console.error("EnableRule CheckRoleHasAssignPrivilege execution failed due to : WebAPI request failed for RetrieveUserPrivilegesRequest API.");
                        RibbonRules.hasAssignRolePermission = false;
                        RibbonRules.retrieveUserPrivilegesAPICalled = false;
                        return false;
                    });
                }
                else
                    return RibbonRules.hasAssignRolePermission;
            };
            /// <summary>
            /// Specifies if the ribbon commands for team of owner type should be enabled
            /// </summary>
            /// <param name="gridControl">Grid control instance</param>
            /// <returns>true if the commands should be enabled</returns>
            RibbonRules.EnableOwnerTeamCommands = function (gridControl) {
                var result = false;
                if (!AppCommon.DialogUtils.isNullOrUndefined(gridControl)) {
                    for (var i = 0; i < gridControl.getGrid().getTotalRecordCount(); ++i) {
                        var currentRow = gridControl.getGrid().getSelectedRows().get(i);
                        if (!AppCommon.DialogUtils.isNullOrUndefined(currentRow)) {
                            var teamTypeAttribute = currentRow.getData().getEntity().attributes.getByName("teamtype");
                            if (!AppCommon.DialogUtils.isNullOrUndefined(teamTypeAttribute) && teamTypeAttribute.getInitialValue() === TeamType.Owner) {
                                result = true;
                                break;
                            }
                        }
                    }
                }
                return result;
            };
            /// <summary>
            /// Checks if the team type is of Owner
            /// </summary>
            /// <returns>true if it is owner type, false otherwise</returns>
            RibbonRules.IsTeamTypeOwnerType = function () {
                if (Xrm.Page) {
                    var teamTypeValue = Xrm.Page.getAttribute("teamtype").getValue();
                    if (TeamType.Owner == teamTypeValue) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            };
            RibbonRules.IsInAppCustomizationSystemView = function () {
                var isInAppCustomizationContext = false;
                if (window && window.parent
                    && window.parent.location
                    && window.parent.location.href
                    && window.parent.location.href.toLowerCase().indexOf("mscrmcontrols.appcommon.systemview.systemviewctrl") != -1) {
                    isInAppCustomizationContext = true;
                }
                return isInAppCustomizationContext;
            };
            RibbonRules.CheckTenantAdminPermissions = function () {
                if (!AppCommon.DialogUtils.isNullOrUndefined(RibbonRules.retrieveTenantAdminPermissionsAPICalled)) {
                    if (!AppCommon.DialogUtils.isNullOrUndefined(RibbonRules.isTenantManaged)
                        && !AppCommon.DialogUtils.isNullOrUndefined(RibbonRules.isCurrentUserTenantAdmin)
                        && RibbonRules.isTenantManaged
                        && RibbonRules.isCurrentUserTenantAdmin) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                var retrieveTenantAdminPermissionsRequest = new RetrieveTenantAdminPermissionsRequest();
                Xrm.WebApi.online.execute(retrieveTenantAdminPermissionsRequest).then(function (response) {
                    if (response) {
                        response.json().then(function (jsonResponse) {
                            /*
                            Sample format of JSON retrived by the OData call
                            {
                                {
                                    "@odata.context": "http://<machine>/<org>/api/data/v9.0/$metadata#Microsoft.Dynamics.CRM.RetrieveTenantAdminPermissionsResponse",
                                    "AdminPermissions": "{\"isCurrentUserTenantAdmin\":\"true\",\"isTenantManaged\":\"true\"}"
                                }
                            }
                            */
                            try {
                                var parsedResponse = JSON.parse(jsonResponse["AdminPermissions"]);
                                if (parsedResponse["isCurrentUserTenantAdmin"].toLowerCase() == "true") {
                                    RibbonRules.isCurrentUserTenantAdmin = true;
                                }
                                else {
                                    RibbonRules.isCurrentUserTenantAdmin = false;
                                }
                                if (parsedResponse["isTenantManaged"].toLowerCase() == "true") {
                                    RibbonRules.isTenantManaged = true;
                                }
                                else {
                                    RibbonRules.isTenantManaged = false;
                                }
                                if (RibbonRules.isCurrentUserTenantAdmin && RibbonRules.isTenantManaged) {
                                    RibbonRules.retrieveTenantAdminPermissionsAPICalled = true;
                                    return true;
                                }
                            }
                            catch (e) {
                                console.error(e);
                            }
                            finally {
                                RibbonRules.retrieveTenantAdminPermissionsAPICalled = true;
                                return false;
                            }
                        });
                    }
                }, function (error) {
                    console.error("EnableRule CheckTenantAdminPermissions execution failed due to : WebAPI request failed for RetrieveTenantAdminPermissions API.");
                    RibbonRules.retrieveTenantAdminPermissionsAPICalled = true;
                    return false;
                });
                RibbonRules.retrieveTenantAdminPermissionsAPICalled = true;
                return false;
            };
            return RibbonRules;
        }());
        RibbonRules.retrieveUserPrivilegesAPICalled = false;
        RibbonRules.hasAssignRolePermission = false;
        AppCommon.RibbonRules = RibbonRules;
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
/// <reference path="privatereferences.ts"/>
/// <reference path="../../Controls/FREShell/Telemetry/TelemetryUtility.ts" />
/// <reference path="../clientcommon/RibbonRules.ts" />
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        /**
         * Contains methods for SMBEditBPF
         */
        var BPF_EditBPF = (function () {
            function BPF_EditBPF() {
            }
            // Override Edit Option in command bar to open BPF Designer
            // @param {records} contains an array of grid row objects that are selected
            // @param {gridControl} contains a handler for grid
            BPF_EditBPF.prototype.EditBPFWorkflow = function (records, gridControl) {
                try {
                    // Though edit option will be visible only when sigle record is selected
                    // Error handling has been done for uncertainity
                    if (records.length != 1) {
                        AppCommon.DialogUtils.ShowGenericError(AppCommon.BPFCustomizerErrors.MultipleRecordSelected + "EditBPFWorkflow()");
                        return;
                    }
                    var recordId = records[0].Id;
                    recordId = recordId.replace(/[{}]/g, '');
                    BPF_EditBPF.getBPFDesignerURLAsync(recordId, BPF_EditBPF.openBPFDesignerURL)
                        .then(function (designerURL) { return BPF_EditBPF.openBPFDesignerURL(designerURL); })
                        .catch(function (reason) { return BPF_EditBPF.handleError(reason); });
                    // Description : Number of BPF Edits
                    AppCommon.BPFTelemetry.EditBPF();
                }
                catch (e) {
                    BPF_EditBPF.handleError(e);
                }
            };
            // Returns the promise which can be used to detect whether the designer URL is available or not.
            BPF_EditBPF.getBPFDesignerURLAsync = function (workflowId, successCallBack) {
                var designerURL;
                if (BPF_EditBPF._APPId == "") {
                    BPF_EditBPF._APPId = Mscrm.AppCommon.Common.Utility.GetCurrentAppId();
                }
                if (BPF_EditBPF._ParkingSolutionId == "") {
                    return BPF_EditBPF.getParkingSolutionIdAsync()
                        .then(function (response) {
                        if (Mscrm.AppCommon.Common.Utility.isNullOrUndefined(response) ||
                            Mscrm.AppCommon.Common.Utility.isNullOrUndefined(response.entities) ||
                            (response.entities.length != 1))
                            BPF_EditBPF._ParkingSolutionId = AppCommon.BPFEditConstants.DEFAULT_SOLUTIONID;
                        else
                            BPF_EditBPF._ParkingSolutionId = response.entities[0].value;
                        designerURL = BPF_EditBPF.generateBPFDesignerURL(workflowId, BPF_EditBPF._APPId, BPF_EditBPF._ParkingSolutionId);
                        return designerURL;
                    });
                }
                else {
                    designerURL = BPF_EditBPF.generateBPFDesignerURL(workflowId, BPF_EditBPF._APPId, BPF_EditBPF._ParkingSolutionId);
                    var retPromise = window.Promise.resolve(designerURL);
                    return retPromise;
                }
            };
            // Returns the promise, which can be used to verify whether the parking solution Id is available or not.
            BPF_EditBPF.getParkingSolutionIdAsync = function () {
                var appId;
                if (BPF_EditBPF._APPId == "")
                    appId = Mscrm.AppCommon.Common.Utility.GetCurrentAppId();
                else
                    appId = BPF_EditBPF._APPId;
                var fetchXML = Mscrm.AppCommon.Common.Utility.GetParkingSolutionIdFetchXML(appId, AppCommon.BPFEditConstants.PARKINGSOLUTION_APPCONFIGMASTERID);
                var retParkingSolutionPromise = Xrm.WebApi.retrieveMultipleRecords(AppCommon.BPFEditConstants.APPCONFIGINSTANCE, fetchXML);
                return retParkingSolutionPromise;
            };
            BPF_EditBPF.generateBPFDesignerURL = function (workflowId, appId, parkingSolutionId) {
                return BPF_EditBPF.getClientUrl() + "/Tools/ProcessControl/UnifiedProcessDesigner.aspx?id=" + workflowId +
                    "&appid=" + appId +
                    "&parkingsolutionId=" + parkingSolutionId;
            };
            BPF_EditBPF.openBPFDesignerURL = function (designerURL) {
                if (AppCommon.RibbonRules.IsSalesProControlPage() != true) {
                    var width = 1200;
                    var height = 700;
                    if (window && window.top && window.top.innerWidth) {
                        width = window.top.innerWidth;
                    }
                    if (window && window.top && window.top.innerHeight) {
                        height = window.top.innerHeight;
                    }
                    window.open(designerURL, "", "width=" + width + ",height=" + height + ",resizable=1");
                }
                else {
                    window.open(designerURL, "_blank");
                }
            };
            BPF_EditBPF.getClientUrl = function () {
                return Xrm.Page.context.getClientUrl();
            };
            BPF_EditBPF.handleError = function (err) {
                SmbAppsTelemetryUtility.TelemetryData.ReportAppComponentFailureTelemetry(null, SmbAppsTelemetryUtility.Controls_PageType.BUSINESSPROCESSFLOW, err);
                console.log(err.message);
                Xrm.Utility.alertDialog(err.message);
            };
            return BPF_EditBPF;
        }());
        BPF_EditBPF._APPId = "";
        BPF_EditBPF._ParkingSolutionId = "";
        AppCommon.EditBPFCommand = new BPF_EditBPF();
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
/// <reference path="privatereferences.ts"/>
/// <reference path="../../Controls/FREShell/Telemetry/TelemetryUtility.ts" />
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        var BPF_DeleteBPF = (function () {
            function BPF_DeleteBPF() {
            }
            // @param {records} contains an array of grid row objects that are selected
            // @param {gridControl} contains a handler for grid
            BPF_DeleteBPF.prototype.DeleteBPFWorkflow = function (records, gridControl) {
                if (records.length != 1) {
                    AppCommon.DialogUtils.ShowGenericError(AppCommon.BPFCustomizerErrors.MultipleRecordSelected);
                    return;
                }
                var record;
                for (var _i = 0, records_2 = records; _i < records_2.length; _i++) {
                    record = records_2[_i];
                    record.Id = record.Id.replace(/[{}]/g, '');
                    Xrm.WebApi.online.retrieveRecord(record.TypeName, record.Id)
                        .then(function (response) {
                        // If BPF is deactivated
                        if ((response["statecode"]) == 0) {
                            AppCommon.DialogUtils.showProgressIndicator();
                            AppCommon.DeleteComponentGridCommand.DeleteComponentAsync(record)
                                .then(function () {
                                AppCommon.DialogUtils.hideProgressIndicator();
                                gridControl.refresh();
                            })
                                .catch(function (errorResponse) {
                                AppCommon.DialogUtils.hideProgressIndicator();
                                Xrm.Navigation.openErrorDialog(errorResponse);
                            });
                        }
                        else {
                            SmbAppsTelemetryUtility.TelemetryData.ReportAppComponentFailureTelemetry(null, SmbAppsTelemetryUtility.Controls_PageType.BUSINESSPROCESSFLOW, response);
                            Xrm.Navigation.openAlertDialog({
                                text: AppCommon.DialogUtils.getLocalizedString(AppCommon.Constants.ActivatedBPFDeletionError)
                            });
                        }
                    }, function (errorResponse) {
                        SmbAppsTelemetryUtility.TelemetryData.ReportAppComponentFailureTelemetry(null, SmbAppsTelemetryUtility.Controls_PageType.BUSINESSPROCESSFLOW, errorResponse);
                        Xrm.Navigation.openAlertDialog({
                            text: errorResponse
                        });
                    });
                }
            };
            return BPF_DeleteBPF;
        }());
        AppCommon.DeleteBPFCommand = new BPF_DeleteBPF();
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var BPF_ActivateBPF = (function () {
            function BPF_ActivateBPF() {
            }
            // @param {records} contains an array of grid row objects that are selected
            // @param {gridControl} contains a handler for grid
            BPF_ActivateBPF.prototype.ActivateBPFWorkflow = function (records, gridControl) {
                if (records.length == 0) {
                    AppCommon.DialogUtils.ShowGenericError(AppCommon.BPFCustomizerErrors.NoRecordSelected);
                    return;
                }
                AppCommon.GridCommands.UpdateStateCodeOfRecords(AppCommon.StateCode.Activate, records, gridControl);
            };
            BPF_ActivateBPF.prototype.IsBPFActivated = function (selectedrecords) {
                if (selectedrecords.length === 1) {
                    var bpfActivated = Xrm.WebApi.retrieveRecord(selectedrecords[0].TypeName, selectedrecords[0].Id, '?$select=statuscode').then(function (result) {
                        return result.statuscode == 2;
                    }, function (error) {
                        return false;
                    });
                    return bpfActivated;
                }
                else {
                    return true;
                }
            };
            return BPF_ActivateBPF;
        }());
        AppCommon.ActivateBPFCommand = new BPF_ActivateBPF();
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        var BPF_DeactivateBPF = (function () {
            function BPF_DeactivateBPF() {
            }
            // @param {records} contains an array of grid row objects that are selected
            // @param {gridControl} contains a handler for grid
            BPF_DeactivateBPF.prototype.DeactivateBPFWorkflow = function (records, gridControl) {
                if (records.length == 0) {
                    AppCommon.DialogUtils.ShowGenericError(AppCommon.BPFCustomizerErrors.NoRecordSelected);
                    return;
                }
                AppCommon.GridCommands.UpdateStateCodeOfRecords(AppCommon.StateCode.Deactivate, records, gridControl);
            };
            BPF_DeactivateBPF.prototype.IsBPFDeactivated = function (selectedrecords) {
                if (selectedrecords.length === 1) {
                    var bpfDeactivated = Xrm.WebApi.retrieveRecord(selectedrecords[0].TypeName, selectedrecords[0].Id, '?$select=statuscode').then(function (result) {
                        return result.statuscode == 1;
                    }, function (error) {
                        return false;
                    });
                    return bpfDeactivated;
                }
                else {
                    return true;
                }
            };
            return BPF_DeactivateBPF;
        }());
        AppCommon.DeactivateBPFCommand = new BPF_DeactivateBPF();
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
/// <reference path="./EditBPF.ts"/>
/// <reference path="./DeleteBPF.ts"/>
/// <reference path="./ActivateBPF.ts"/>
/// <reference path="./DeactivateBPF.ts"/>
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var BPF = (function () {
            function BPF() {
            }
            return BPF;
        }());
        BPF.EditBPF = Mscrm.AppCommon.EditBPFCommand;
        BPF.DeleteBPF = Mscrm.AppCommon.DeleteBPFCommand;
        BPF.ActivateBPF = Mscrm.AppCommon.ActivateBPFCommand;
        BPF.DeactivateBPF = Mscrm.AppCommon.DeactivateBPFCommand;
        AppCommon.BPF = BPF;
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
var Mscrm;
(function (Mscrm) {
    var AppCommon;
    (function (AppCommon) {
        'use strict';
        var BPFEditConstants = (function () {
            function BPFEditConstants() {
            }
            Object.defineProperty(BPFEditConstants, "DEFAULT_SOLUTIONID", {
                // The SolutionID is available in every environment of the CRM.
                get: function () {
                    return "fd140aaf-4df4-11dd-bd17-0019b9312238";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BPFEditConstants, "PARKINGSOLUTION_APPCONFIGMASTERID", {
                get: function () {
                    return "bcb82bb9-1ae9-424a-9207-bdcb35ec0a25";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BPFEditConstants, "APPCONFIGINSTANCE", {
                get: function () {
                    return "appconfiginstance";
                },
                enumerable: true,
                configurable: true
            });
            return BPFEditConstants;
        }());
        AppCommon.BPFEditConstants = BPFEditConstants;
        var BPFEntity = (function () {
            function BPFEntity() {
            }
            Object.defineProperty(BPFEntity, "WORKFLOW", {
                get: function () {
                    return "workflow";
                },
                enumerable: true,
                configurable: true
            });
            return BPFEntity;
        }());
        AppCommon.BPFEntity = BPFEntity;
        var BPFTelemetry = (function () {
            function BPFTelemetry() {
            }
            BPFTelemetry.EditBPF = function () {
                // Description : Number of BPF Edits 
                SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.BUSINESSPROCESSFLOW, SmbAppsTelemetryUtility.Controls_EventName.CLICKEDGRIDCOMMAND, "BPFCustomizerPage", null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, "EditBPF Grid Command Clicked", false);
            };
            BPFTelemetry.DeleteBPF = function () {
                // Description :  Number times BPF Deleted
                SmbAppsTelemetryUtility.TelemetryData.ReportEventData(null, 1, SmbAppsTelemetryUtility.Controls_PageType.BUSINESSPROCESSFLOW, SmbAppsTelemetryUtility.Controls_EventName.CLICKEDGRIDCOMMAND, "BPFCustomizerPage", null, SmbAppsTelemetryUtility.Controls_ShellMode.ADVANCEDSHELLMODE, "DeleteBPF Grid Command Clicked", false);
            };
            return BPFTelemetry;
        }());
        AppCommon.BPFTelemetry = BPFTelemetry;
        var BPFCustomizerErrors = (function () {
            function BPFCustomizerErrors() {
            }
            Object.defineProperty(BPFCustomizerErrors, "NoRecordSelected", {
                get: function () {
                    return "No Record Selected:";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BPFCustomizerErrors, "MultipleRecordSelected", {
                get: function () {
                    return "Multiple Record Selected:";
                },
                enumerable: true,
                configurable: true
            });
            return BPFCustomizerErrors;
        }());
        AppCommon.BPFCustomizerErrors = BPFCustomizerErrors;
    })(AppCommon = Mscrm.AppCommon || (Mscrm.AppCommon = {}));
})(Mscrm || (Mscrm = {}));
