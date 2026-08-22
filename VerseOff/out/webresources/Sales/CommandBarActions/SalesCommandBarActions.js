var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
/// <reference path="../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var Sales;
(function (Sales) {
    /**
     * Note: Source of this file:
     * https://dynamicscrm.visualstudio.com/OneCRM/_git/CRM.Solutions.AcceleratedSales?path=/shared/Client/omnichannel-sdk/src/LoadSidePaneConversationControl.ts
     */
    var SidePaneConversationControlId = "SidePaneConversationControl";
    /**
     * Handles loading of a side pane for conversation control
     * @param recordName - recordName of the entity/C2
     * @param entityId - UID of the entity/C2
     * @param entityName - entity type of C2
     * @param ownerId - UID of the owner
     * @param conversationId - UID of the record
     * @param parentEventNameForRefresh(Optional) - Parent event name if exists
     * @param stepId(Optional) - stepId if exists
     */
    function loadSidePaneConversationControl(recordName, entityId, entityName, ownerId, conversationId, parentEventNameForRefresh, stepId) {
        if (parentEventNameForRefresh === void 0) { parentEventNameForRefresh = ""; }
        if (stepId === void 0) { stepId = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var params, sidePane, params_1, pane, params_2, error_1, params_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = getBasicParams(entityId, entityName, ownerId, conversationId);
                        params.push({ name: "State", value: "Initiated" });
                        Xrm.Reporting.reportSuccess("SalesCommandBarActions_SidePaneConversationControl", params);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        sidePane = Xrm.App.sidePanes.getPane(SidePaneConversationControlId);
                        if (!sidePane) return [3 /*break*/, 3];
                        // make chat tab visible
                        if (sidePane.hidden === true) {
                            sidePane.hidden = false;
                        }
                        // select the panel
                        sidePane.select();
                        // update the title
                        sidePane.title = recordName;
                        // Expand side pane if collapsed
                        if (Xrm.App.sidePanes.state === 0) {
                            // Collapsed
                            Xrm.App.sidePanes.state = 1; // Expand
                        }
                        params_1 = getBasicParams(entityId, entityName, ownerId, conversationId);
                        params_1.push({ name: "State", value: "ExistingPaneOpened" });
                        Xrm.Reporting.reportSuccess("SalesCommandBarActions_SidePaneConversationControl", params_1);
                        return [4 /*yield*/, navigateToCustomControl(sidePane, recordName, entityId, entityName, ownerId, conversationId, parentEventNameForRefresh, stepId)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                    case 3: return [4 /*yield*/, Xrm.App.sidePanes.createPane({
                            title: recordName,
                            imageSrc: "WebResources/msdyn_SalesOmniChannel/Images/msdyn_SMSIcon.svg",
                            paneId: SidePaneConversationControlId,
                            canClose: true,
                            width: 340,
                            isSelected: true,
                            alwaysRender: true,
                            hideHeader: true,
                        })];
                    case 4:
                        pane = _a.sent();
                        params_2 = getBasicParams(entityId, entityName, ownerId, conversationId);
                        params_2.push({ name: "State", value: "PaneCreated" });
                        Xrm.Reporting.reportSuccess("SalesCommandBarActions_SidePaneConversationControl", params_2);
                        return [4 /*yield*/, navigateToCustomControl(pane, recordName, entityId, entityName, ownerId, conversationId, parentEventNameForRefresh, stepId)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        params_3 = getBasicParams(entityId, entityName, ownerId, conversationId);
                        params_3.push({ name: "State", value: "PaneCreationFailed" });
                        Xrm.Reporting.reportFailure("SalesCommandBarActions_SidePaneConversationControl", error_1, "", params_3);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    Sales.loadSidePaneConversationControl = loadSidePaneConversationControl;
    function navigateToCustomControl(pane, recordName, entityId, entityName, ownerId, conversationId, parentEventNameForRefresh, stepId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2, params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pane.navigate({
                                pageType: "control",
                                controlName: "msdyn_SalesOmniChannel.ConversationControl",
                                data: {
                                    recordName: recordName,
                                    entityId: entityId,
                                    entityName: entityName,
                                    ownerId: ownerId,
                                    conversationId: conversationId,
                                    parentEventNameForRefresh: parentEventNameForRefresh,
                                    stepId: stepId,
                                },
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        params = getBasicParams(entityId, entityName, ownerId, conversationId);
                        params.push({ name: "State", value: "NavigationFailed" });
                        Xrm.Reporting.reportFailure("SalesCommandBarActions_SidePaneConversationControl", error_2, "", params);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function getBasicParams(entityId, entityName, ownerId, conversationId) {
        var params = new Array();
        params.push({ name: "entityId", value: entityId });
        params.push({ name: "entityName", value: entityName });
        params.push({ name: "ownerId", value: ownerId });
        params.push({ name: "conversationId", value: conversationId });
        return params;
    }
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
///<reference path="../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
///<reference path="../../../../TypeDefinitions/AppCommon/Telemetry/TelemetryLibrary.d.ts" />
///<reference path="../../ClientCommon/Sales_ClientCommon.d.ts" />
///<reference path="../../../../TypeDefinitions/AppCommon/ClientCommon/AppCommon_ClientCommon.d.ts" />
///<reference path="../../../../../references/internal/TypeDefinitions/Activities/Activities.d.ts"/>
///<reference path="./LoadSidePaneConversationControl.ts" />
var Sales;
(function (Sales) {
    var PDFButtonType;
    (function (PDFButtonType) {
        PDFButtonType[PDFButtonType["CreatePDF"] = 0] = "CreatePDF";
        PDFButtonType[PDFButtonType["EmailAsPDF"] = 1] = "EmailAsPDF";
    })(PDFButtonType = Sales.PDFButtonType || (Sales.PDFButtonType = {}));
    var CreatePDFDialogDescription;
    (function (CreatePDFDialogDescription) {
        CreatePDFDialogDescription[CreatePDFDialogDescription["Dynamics"] = 0] = "Dynamics";
        CreatePDFDialogDescription[CreatePDFDialogDescription["Sharepoint"] = 1] = "Sharepoint";
    })(CreatePDFDialogDescription = Sales.CreatePDFDialogDescription || (Sales.CreatePDFDialogDescription = {}));
    Sales.InlineEditViews = [
        "{A1FAA578-24AF-4ED6-B36D-47842E7E9B1E}",
        "{01010DE7-749E-4FE6-8037-ACA560A4FCBE}",
        "{9AC6A187-5FB8-445C-914A-3B4A33C0017E}",
        "{CF23F371-4C2E-44DF-BCEF-C8971249BBE0}" //Quote Product Inline Edit View
    ];
    var SalesCommandBarActions = (function () {
        function SalesCommandBarActions() {
            var _this = this;
            this.yesOptionSetValue = true;
            this.templateMap = {};
            this._cache = null;
            this.pdfWave2FeatureFCB = "PDF2020Wave2Updates";
            this.pdfWave2PreviewFCB = "October2020Update";
            this.EmbedcollabSettingAttributeLogicalName = "msdyn_embedcollabteamsintegrationenabled";
            this.CollabSDKEventListenerType = "embedCollabSDKLoaded";
            /**
             * Flag to track whether AddProductsDialog open is requested.
             * This is used to prevent multiple dialogs from opening due to multiple clicks on the AddProducts ribbon button.
             */
            this.isAddProductsDialogOpen = false;
            this.showCreateDiscountListDialog = function () {
                Xrm.Utility.openEntityForm(Sales.EntityNames.DiscountType, null, null);
            };
            /**
             * Locks pricing for SalesOrder or Invoice.
            */
            this.lock = function () {
                Xrm.Page.data.save().then(function () {
                    _this.entityName = Xrm.Page.data.entity.getEntityName();
                    var entityId = Xrm.Page.data.entity.getId();
                    var lockContract = null;
                    switch (_this.entityName) {
                        case Sales.EntityNames.SalesOrder:
                            lockContract = new ODataContract.LockSalesOrderPricingRequest({
                                id: ClientUtility.Guid.create(Xrm.Page.data.entity.getId()),
                                entityType: Sales.EntityNames.SalesOrder,
                            });
                            break;
                        case Sales.EntityNames.Invoice:
                            lockContract = new ODataContract.LockInvoicePricingRequest({
                                id: ClientUtility.Guid.create(Xrm.Page.data.entity.getId()),
                                entityType: Sales.EntityNames.Invoice,
                            });
                            break;
                        default:
                            return;
                    }
                    Xrm.WebApi.online.execute(lockContract).then(function () {
                        Xrm.Utility.openEntityForm(_this.entityName, entityId, { formid: null }, { height: 0, width: 0, openInNewWindow: false });
                    }, ClientUtility.ActionFailedHandler.actionFailedCallback);
                }, ClientUtility.ActionFailedHandler.actionFailedCallback);
            };
            /**
             * Unlocks pricing for SalesOrder or Invoice
             */
            this.unlock = function () {
                Xrm.Page.data.save().then(function () {
                    _this.entityName = Xrm.Page.data.entity.getEntityName();
                    var entityId = Xrm.Page.data.entity.getId();
                    var unlockContract = null;
                    switch (_this.entityName) {
                        case Sales.EntityNames.SalesOrder:
                            unlockContract = new ODataContract.UnlockSalesOrderPricingRequest({ guid: ClientUtility.Guid.create(Xrm.Page.data.entity.getId()) });
                            break;
                        case Sales.EntityNames.Invoice:
                            unlockContract = new ODataContract.UnlockInvoicePricingRequest({ guid: ClientUtility.Guid.create(Xrm.Page.data.entity.getId()) });
                            break;
                        default:
                            return;
                    }
                    Xrm.WebApi.online.execute(unlockContract).then(function () {
                        Xrm.Utility.openEntityForm(_this.entityName, entityId, { formid: null }, { height: 0, width: 0, openInNewWindow: false });
                    }, ClientUtility.ActionFailedHandler.actionFailedCallback);
                }, ClientUtility.ActionFailedHandler.actionFailedCallback);
            };
            this.performActionAfterCloseInvoice = function (newStatus, closedState, invoiceId) {
                if (Xrm.Page.data.entity.getIsDirty()) {
                    ClientUtility.CommandBarActions.setState(invoiceId, Sales.EntityNames.Invoice, closedState, newStatus, false, null, null);
                }
                else {
                    ClientUtility.CommandBarActions.setStateUpdate(invoiceId, Sales.EntityNames.Invoice, closedState, newStatus, false, null, null);
                }
            };
            this.isMobileCompanionApp = function () {
                return Xrm.Page.context.client.getClient() === Xrm.Constants.ClientNames.mobile;
            };
            /**
             * Gets the name from the first element in the lookup attribute
             * @param {string} attribute The attribute identifier
             * @return {string} The name of the of the look up value
             */
            this.getNameFromLookupAttribute = function (attribute) {
                var attributeName = Xrm.Page.data.entity.attributes.get(attribute);
                if (ClientUtility.DataUtil.isNullOrUndefined(attributeName) || ClientUtility.DataUtil.isNullOrEmptyString(attributeName.getValue())) {
                    return "";
                }
                var attributeNameValue = attributeName.getValue();
                if (!attributeNameValue.length) {
                    return "";
                }
                return attributeNameValue[0].name;
            };
            /**
            * Gets the attribute value.
            * Returns value selected by user. In case there is no value given by user,
            * it checks Xrm.Page.data.attributes to obtain attribute value, in case attributename is
            * null or undefined it returns empty string
            *
            * @param {string} attribute The attribute identifier
            * @param {string} attributeValueByUser attribute value provided by user
            * @return {string} Attribute value to set
            */
            this.getAttributeValue = function (attribute, attributeValueByUser) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(attributeValueByUser)) {
                    return attributeValueByUser;
                }
                var attributeName = Xrm.Page.data.entity.attributes.get(attribute);
                return ClientUtility.DataUtil.isNullOrUndefined(attributeName) ? "" : attributeName.getValue();
            };
            /**
             * Handles close of close quote dialog.
             */
            this.onCloseCloseQuoteDialog = function () {
                var closeDate = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsQuoteClose.Date);
                if (ClientUtility.DataUtil.isNullOrUndefined(closeDate.getValue())) {
                    var alert = new ClientUtility.AlertDialogStrings;
                    alert.text = Sales.StringProvider.getResourceString("Web.SFA.opps.dlg_closeopp.aspx_67");
                    Xrm.Navigation.openAlertDialog(alert);
                }
                else {
                    Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsQuoteClose.LastButtonClicked).setValue(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                    Xrm.Page.ui.close();
                }
            };
            /**
             * Closes the current dialog.
             */
            this.dialogClose = function (context) {
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                formContext.data.attributes.get(ClientUtility.MetadataDrivenDialogConstants.paramLastButtonClicked).setValue(ClientUtility.MetadataDrivenDialogConstants.DialogCancelId);
                formContext.ui.close();
            };
            /**
             * Sets the visibility of "Close the associated opportunity" control
             */
            this.onCloseQuoteCreateRevisedChanged = function () {
                _this.setVisibilityCloseQuoteDialogCloseOpportunityControl();
            };
            this.setVisibilityCloseQuoteDialogCloseOpportunityControl = function () {
                var isOpportunityControlVisible = _this.getCloseQuoteDialogCanCloseOpportunity() && _this.getSelectedOptionValueFromOptionSetControl(Sales.MetadataDrivenDialogConstantsQuoteClose.CreateRevisedQuote) !== true;
                _this.setVisibilityOfControl(Sales.MetadataDrivenDialogConstantsQuoteClose.CloseOpportunity, isOpportunityControlVisible);
            };
            this.getCloseQuoteDialogCanCloseOpportunity = function () {
                var attribute = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsQuoteClose.CanCloseOpportunity);
                return attribute.getValue();
            };
            /**
             * Adjusts the given close date to ensure correct date-time interpretation in CRM,
             * particularly for UCI (Unified Client Interface) where Date controls store only the date part (no time).
             *
             * Background:
             * In UCI, date-only fields are interpreted as midnight UTC when sent to the server.
             * This can lead to a one-day offset when displayed to users in different time zones.
             *
             * Logic:
             * 1. Determine the CRM user's timezone offset — from either the custom 'param_timezone' attribute
             *    or from the user’s CRM settings.
             * 2. Create a timezone-adjusted version of the current date (adjustedToday)
             *    by adding both:
             *      - The local system timezone offset (getTimezoneOffset), and
             *      - The CRM user’s timezone offset (timezoneOffsetMinutes).
             * 3. Compare the provided close date (systemCloseDate) with adjustedToday using full date comparison (day, month, and year).
             * 4. If both represent the same calendar day:
             *      - Revert the timezone adjustment on adjustedToday and use that as the final close date.
             *    Otherwise:
             *      - Adjust the systemCloseDate by removing the combined timezone offsets and use that value.
             * 5. For non-UCI (classic UI) clients, return the closeDate as-is.
             *
             * The result ensures that the close date reflects the intended local day when stored and displayed in CRM.
             */
            this.getAdjustedCloseDate = function (closeDate) {
                var actualCloseDate;
                if (Xrm.Internal.isUci()) {
                    var systemCloseDate = closeDate;
                    var paramtimezone = Xrm.Page.data.attributes.get('param_timezone');
                    var timezoneOffsetMinutes = (ClientUtility.DataUtil.isNullOrUndefined(paramtimezone)) ? Xrm.Utility.getGlobalContext().userSettings.getTimeZoneOffsetMinutes() : paramtimezone.getValue();
                    // Create a timezone-adjusted version of today's date for comparison
                    var adjustedToday = new Date();
                    adjustedToday.setMinutes(adjustedToday.getMinutes() + adjustedToday.getTimezoneOffset() + timezoneOffsetMinutes);
                    // Compare full date (day, month, and year) instead of just day of month
                    var isSameDay = systemCloseDate.getDate() === adjustedToday.getDate() && systemCloseDate.getMonth() === adjustedToday.getMonth() && systemCloseDate.getFullYear() === adjustedToday.getFullYear();
                    if (isSameDay) {
                        // If close date is same as today, use adjusted today's date (no offset reversal)
                        var revertedToday = new Date(adjustedToday);
                        revertedToday.setMinutes(revertedToday.getMinutes() - revertedToday.getTimezoneOffset() - timezoneOffsetMinutes);
                        actualCloseDate = revertedToday;
                    }
                    else {
                        // Otherwise adjust the systemCloseDate for timezone offset
                        var adjustedClose = new Date(systemCloseDate);
                        adjustedClose.setMinutes(adjustedClose.getMinutes() - adjustedClose.getTimezoneOffset() - timezoneOffsetMinutes);
                        actualCloseDate = adjustedClose;
                    }
                }
                else {
                    actualCloseDate = closeDate;
                }
                return actualCloseDate;
            };
            /**
             * Close the quote and its associated opportunity.
             */
            this.closeQuoteAndOpportunity = function (newStatus, opportunityStatus, opportunityState, description, closeDate, activityXml, opportunityInfo, createRevision, closeOpportunity) {
                var quoteId = Xrm.Page.data.entity.getId();
                var quoteNumber = Xrm.Page.data.entity.attributes.get('quotenumber').getValue();
                var revision = Xrm.Page.data.entity.attributes.get('revisionnumber').getValue();
                var opportunityInfocopy = JSON.parse(JSON.stringify(opportunityInfo));
                // ToDo: set placeholders in subject        
                _this.closeQuoteAndOpportunityCommon(newStatus, opportunityStatus, opportunityState, description, closeDate, activityXml, opportunityInfo, createRevision, closeOpportunity, quoteId, quoteNumber, revision).then(function (response) {
                    if (closeOpportunity) {
                        _this.winOrLoseOpportunity(opportunityInfocopy, opportunityState, opportunityStatus, createRevision);
                    }
                    else {
                        _this.reviseQuote(createRevision);
                    }
                    _this.showToastMessageOnQuoteActions("Sales_Quote_Closed_ToastNotification");
                }, ClientUtility.ActionFailedHandler.actionFailedCallback);
            };
            this.closeQuoteAndOpportunityCommon = function (newStatus, opportunityStatus, opportunityState, description, closeDate, activityXml, opportunityInfo, createRevision, closeOpportunity, quoteId, quoteNumber, revisionNumber) {
                var progressIndicator = new ClientUtility.ProgressIndicator();
                progressIndicator.show();
                var quoteClose = {};
                quoteClose.actualend = _this.getAdjustedCloseDate(closeDate);
                quoteClose["quoteid@odata.bind"] = "/quotes(" + ClientUtility.Guid.create(quoteId) + ")";
                // ToDo: set placeholders in subject
                quoteClose.subject = Sales.StringProvider.getResourceString("Quote_Closed_Subject");
                quoteClose.description = _this.getAttributeValue("description", description);
                quoteClose.quotenumber = quoteNumber;
                quoteClose.revision = revisionNumber;
                quoteClose["ownerid_quoteclose@odata.bind"] = "/systemusers(" + ClientUtility.Guid.create(Xrm.Page.context.getUserId()) + ")";
                var closeQuoteRequest = new ODataContract.CloseQuoteRequest(quoteClose, newStatus);
                var opportunityInfocopy = JSON.parse(JSON.stringify(opportunityInfo));
                return Xrm.WebApi.online.execute(closeQuoteRequest).then(function (response) {
                    progressIndicator.hide();
                    Promise.resolve(response);
                }, function (error) { progressIndicator.hideOnError(ClientUtility.ActionFailedHandler.actionFailedCallback)(error); });
            };
            this.PerformActionAfterCloseOrder = function (newStatus, closedDate, description, closedState, salesOrderId) {
                var orderClose = {};
                var actualClosedDate = new Date();
                if (!ClientUtility.DataUtil.isNullOrEmptyString(closedDate)) {
                    actualClosedDate = new Date(closedDate);
                    //since the input is Date only, it provides beginning of the day in current timezone
                    //setting actual time in order to have proper conversion to UTC date while sending to server
                    var now = new Date();
                    actualClosedDate.setHours(now.getHours());
                    actualClosedDate.setMinutes(now.getMinutes());
                    actualClosedDate.setSeconds(now.getSeconds());
                }
                orderClose.actualend = actualClosedDate;
                orderClose["@odata.type"] = "#Microsoft.Dynamics.CRM.orderclose";
                orderClose["salesorderid@odata.bind"] = "/salesorders(" + ClientUtility.Guid.create(Xrm.Page.data.entity.getId()) + ")";
                orderClose.description = _this.getAttributeValue("description", description);
                orderClose["ownerid_orderclose@odata.bind"] = "/systemusers(" + ClientUtility.Guid.create(Xrm.Page.context.getUserId()) + ")";
                var orderCloseRequest;
                if (closedState == Sales.SalesOrderState.Fulfilled) {
                    orderCloseRequest = new ODataContract.FulfillSalesOrderRequest(orderClose, newStatus);
                }
                else {
                    orderCloseRequest = new ODataContract.CancelSalesOrderRequest(orderClose, newStatus);
                }
                Xrm.WebApi.online.execute(orderCloseRequest).then(function (responseCloseOrder) {
                    Xrm.Page.data.refresh(true);
                }, ClientUtility.ActionFailedHandler.actionFailedCallback);
            };
            /**
             * Closes the opportunity.
             */
            this.winOrLoseOpportunity = function (opportunityInfo, opportunityState, opportunityStatus, createRevision) {
                var closeOpportunity = {};
                var opportunityId = Xrm.Page.data.entity.attributes.get("opportunityid").getValue()[0].id;
                var actualRevenue = opportunityInfo["actualRevenue"];
                var description = opportunityInfo["description"];
                var subject = _this.getNameFromLookupAttribute("opportunityid");
                var actualEnd = new Date(opportunityInfo["actualEnd"]);
                closeOpportunity["opportunityid@odata.bind"] = "/opportunities(" + ClientUtility.Guid.create(opportunityId) + ")";
                closeOpportunity.actualrevenue = Number(actualRevenue);
                closeOpportunity.description = description;
                closeOpportunity.subject = subject;
                closeOpportunity.actualend = actualEnd;
                if (!ClientUtility.DataUtil.isNullOrUndefined(opportunityInfo.competitor)) {
                    closeOpportunity["competitorid@odata.bind"] = "/competitors(" + ClientUtility.Guid.create(opportunityInfo.competitor[0].id) + ")";
                }
                var request = null;
                if (opportunityState === 1) {
                    request = new ODataContract.WinOpportunityRequest(closeOpportunity, opportunityStatus);
                }
                else {
                    request = new ODataContract.LoseOpportunityRequest(closeOpportunity, opportunityStatus);
                }
                Xrm.WebApi.online.execute(request).then(function (responseCloseOpportunity) {
                    _this.updateOppAndReviseQuote(createRevision, actualRevenue, actualEnd, opportunityId);
                }, ClientUtility.ActionFailedHandler.actionFailedCallback);
            };
            /**
             * Updates the opportunity and revises the quote.
             */
            this.updateOppAndReviseQuote = function (createRevision, actualRevenue, actualEnd, oppId) {
                var opportunity = {};
                opportunity.actualvalue = parseInt(actualRevenue);
                opportunity.actualclosedate = ClientUtility.ODataUtil.getEdmDate(actualEnd);
                Xrm.WebApi.updateRecord(Sales.EntityNames.Opportunity, oppId, opportunity).then(function (response) {
                    _this.reviseQuote(createRevision);
                }, ClientUtility.ActionFailedHandler.actionFailedCallback);
            };
            /**
             * Revises the quote.
             */
            this.reviseQuote = function (createRevision) {
                if (createRevision) {
                    //TODO: see if object or string for guid parameters
                    var reviseQuoteRequest = new ODataContract.ReviseQuoteRequest({ guid: Xrm.Page.data.entity.getId() }, new ODataContract.ColumnSet(true, []));
                    Xrm.WebApi.online.execute(reviseQuoteRequest).then(function (response) {
                        response.json().then(function (jsonResponse) {
                            var revisedQuoteId = jsonResponse.quoteid;
                            if (!ClientUtility.DataUtil.isNullOrUndefined(revisedQuoteId)) {
                                Xrm.Utility.openEntityForm(Sales.EntityNames.Quote, revisedQuoteId, { formid: null }, { height: 0, width: 0, openInNewWindow: false });
                            }
                        });
                    }, ClientUtility.ActionFailedHandler.actionFailedCallback);
                }
                else {
                    Xrm.Utility.openEntityForm(Sales.EntityNames.Quote, Xrm.Page.data.entity.getId(), { formid: null }, { height: 0, width: 0, openInNewWindow: false });
                }
            };
            /**
             * Private method to get the type of button clicked for CPQ PDF feature
             */
            this.getPDFButtonType = function (commandProperties) {
                var sourceControlId = commandProperties["SourceControlId"];
                if (sourceControlId.indexOf("EmailAsPDF") !== -1) {
                    return PDFButtonType.EmailAsPDF;
                }
                return PDFButtonType.CreatePDF;
            };
            /**
             * Handler for populating CreatePDF and EmailAsPDF ribbon button flyouts
             */
            this.generatePDFTemplateFlyout = function (commandProperties, entityTypeName, isForm, gridControl) {
                var buttonType = _this.getPDFButtonType(commandProperties);
                var menuType = "";
                var actionHandler = "";
                if (buttonType == PDFButtonType.CreatePDF) {
                    menuType = "CreatePDF";
                    actionHandler = "Mscrm.Form.CreatePDF.GeneratePDF";
                }
                else {
                    menuType = "EmailAsPDF";
                    actionHandler = "Mscrm.Form.EmailAsPDF.GeneratePDFAndSendEmail";
                }
                var documentType = 2;
                var deferred1 = _this.retrieveSystemDocumentTemplates(entityTypeName, documentType);
                var deferred2 = _this.retrievePersonalDocumentTemplates(entityTypeName, documentType);
                var menu = Promise.all([deferred1, deferred2]).then(function (_a) {
                    var systemTemplates = _a[0], personalTemplates = _a[1];
                    return _this.buildMenu(systemTemplates, personalTemplates, entityTypeName, menuType, actionHandler);
                });
                commandProperties["PopulationXML"] = menu;
                return;
            };
            /**
            * Handler for specific buttons of EmailAsPDF flyout
            */
            this.emailAsPDFCommandHandler = function (commandProperties, entityTypeCode, formContext, selectedRecords) {
                var buttonType = _this.getPDFButtonType(commandProperties);
                _this.commonCommandHandlerCPQPDFFeature(buttonType, commandProperties, entityTypeCode, formContext, selectedRecords);
            };
            /**
            * Handler for specific buttons of CreatePDF flyout
            */
            this.createPDFCommandHandler = function (commandProperties, entityTypeCode, formContext, selectedRecords) {
                var buttonType = _this.getPDFButtonType(commandProperties);
                _this.commonCommandHandlerCPQPDFFeature(buttonType, commandProperties, entityTypeCode, formContext, selectedRecords);
            };
            /**
            * Common private Handler for "CreatePDF" and "EmailAsPDF" buttons of CPQ PDF Feature
            */
            this.commonCommandHandlerCPQPDFFeature = function (buttonType, commandProperties, entityTypeCode, formContext, selectedRecords) { return __awaiter(_this, void 0, void 0, function () {
                var sourceControlId, templateEntityName, templateId, templateRef, recordsString, entityLogicalName, filename, confirmDialogStrings, FCB2020UpdateEnabled, isFCB2020UpdateEnabled, isSharepointDocumentEnabled, createPDFDialogDescriptionDifferentiator;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (typeof selectedRecords === 'string') {
                                selectedRecords = [selectedRecords];
                            }
                            sourceControlId = commandProperties["SourceControlId"];
                            templateEntityName = Sales.EntityNames.DocumentTemplate;
                            if (sourceControlId.indexOf("PersonalTemplate") !== -1) {
                                templateEntityName = Sales.EntityNames.PersonalDocumentTemplate;
                            }
                            templateId = sourceControlId.split(/[. ]+/).pop();
                            templateRef = { id: "{" + templateId + "}", entityType: templateEntityName };
                            recordsString = JSON.stringify(selectedRecords);
                            entityLogicalName = Xrm.Internal.getEntityName(entityTypeCode);
                            filename = this.templateMap[templateId];
                            confirmDialogStrings = { text: undefined };
                            if (!(buttonType == PDFButtonType.CreatePDF)) return [3 /*break*/, 4];
                            FCB2020UpdateEnabled = "April2020Update";
                            isFCB2020UpdateEnabled = Xrm.Internal.isFeatureEnabled(FCB2020UpdateEnabled);
                            if (!isFCB2020UpdateEnabled) return [3 /*break*/, 2];
                            return [4 /*yield*/, SalesCommandBarActions.isSharepointEnabled(entityLogicalName)];
                        case 1:
                            isSharepointDocumentEnabled = _a.sent();
                            createPDFDialogDescriptionDifferentiator = isSharepointDocumentEnabled ? CreatePDFDialogDescription[CreatePDFDialogDescription.Sharepoint] : CreatePDFDialogDescription[CreatePDFDialogDescription.Dynamics];
                            confirmDialogStrings.text = String.format(Sales.StringProvider.getResourceString("Dialog_CreatePDF_Description"), entityLogicalName, createPDFDialogDescriptionDifferentiator);
                            confirmDialogStrings.confirmButtonLabel = Sales.StringProvider.getResourceString("Button_Label_Save");
                            confirmDialogStrings.cancelButtonLabel = Sales.StringProvider.getResourceString("Button_Label_Download");
                            confirmDialogStrings.title = Sales.StringProvider.getResourceString("CreatePDF_Dlg_Title");
                            confirmDialogStrings.subtitle = "";
                            this.openCreatePDFConfirmationDialog(entityTypeCode, formContext, 50, 100, filename, recordsString, templateRef, confirmDialogStrings);
                            return [3 /*break*/, 3];
                        case 2:
                            SalesCommandBarActions.downloadPDFFile(entityTypeCode, templateRef, recordsString, filename);
                            _a.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            this.createEmailEntityWithPDFAttachment(formContext, entityTypeCode, templateRef, recordsString);
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            }); };
            this.openCreatePDFConfirmationDialog = function (entityTypeCode, formContext, dialogWidth, dialogHeight, filename, recordsString, templateRef, confirmDialogStrings) {
                var telemetryParams = new Map();
                var dialogOptions = {
                    height: dialogHeight,
                    width: dialogWidth,
                    position: 1 /* center */
                };
                var entityRecordName;
                var entityId;
                var entityLogicalName = Xrm.Internal.getEntityName(entityTypeCode);
                telemetryParams.set("MethodName", "Sales.SalesCommandBarActions.openCreatePDFConfirmationDialog");
                telemetryParams.set("EntityName", entityLogicalName);
                telemetryParams.set("OperationType", "PDFGeneration.SavePDFToSharePointOrDynamics.CreatePDF.Save");
                Xrm.Navigation.openConfirmDialog(confirmDialogStrings, dialogOptions).then(function (success) {
                    if (success.confirmed == true) {
                        if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data) && !ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data.entity)) {
                            entityId = Xrm.Page.data.entity.getId();
                            telemetryParams.set("EntityId", entityId);
                        }
                        var entityRef_1 = { id: entityId, entityType: entityLogicalName };
                        /**
                        * Check whether SharePoint FCB in organization is enabled
                        * */
                        if (Xrm.Internal.isFeatureEnabled("SharePointS2S")) {
                            var isDocumentManagementEnabled = false;
                            var isEntityTitleAttribute_1;
                            /**
                            * Retrieving IsDocumentManagementEnabled from Entity Metadata
                            * */
                            Xrm.Utility.getEntityMetadata(entityLogicalName).then(function (entityMetadata) {
                                isDocumentManagementEnabled = entityMetadata.IsDocumentManagementEnabled;
                                telemetryParams.set("IsDocumentManagementFlagEnabled", isDocumentManagementEnabled);
                                /**
                                * Check whether SharePoint DocumentManagement for respective entity is enabled
                                * */
                                if (isDocumentManagementEnabled) {
                                    telemetryParams.set("OperationName", "SaveEntityDocumentToSharePoint");
                                    if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data) && !ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data.entity) && !ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data.entity.attributes)) {
                                        telemetryParams.set("Success", "Successfully Saved PDF document to sharepoint for " + entityLogicalName);
                                        isEntityTitleAttribute_1 = Xrm.Page.data.entity.attributes.get(entityMetadata.PrimaryNameAttribute);
                                        if (ClientUtility.DataUtil.isNullOrUndefined(isEntityTitleAttribute_1)) {
                                            Xrm.WebApi.retrieveRecord(entityLogicalName, entityId, "?$select=" + entityMetadata.PrimaryNameAttribute).then(function (response) {
                                                if (!ClientUtility.DataUtil.isNullOrUndefined(response)) {
                                                    entityRecordName = response.fullname;
                                                }
                                                /**
                                                * Save document (pdf) to Sharepoint.
                                                * */
                                                SalesCommandBarActions.saveEntityDocumentToSharePoint(formContext, entityTypeCode, templateRef, recordsString, entityRef_1, entityRecordName, filename);
                                            }, ClientUtility.ActionFailedHandler.actionFailedCallback);
                                            SalesCommandBarActions.logSuccessSaveAndDownloadPDF(telemetryParams);
                                        }
                                        else {
                                            entityRecordName = isEntityTitleAttribute_1 ? isEntityTitleAttribute_1.getValue() : null;
                                            /**
                                            * Save document (pdf) to Sharepoint.
                                            * */
                                            SalesCommandBarActions.saveEntityDocumentToSharePoint(formContext, entityTypeCode, templateRef, recordsString, entityRef_1, entityRecordName, filename);
                                            SalesCommandBarActions.logSuccessSaveAndDownloadPDF(telemetryParams);
                                        }
                                    }
                                }
                                else {
                                    /**
                                     * Save document (pdf) as an attachment to Notes.
                                     * */
                                    var entityRef_2 = { id: entityId, entityType: entityLogicalName };
                                    SalesCommandBarActions.saveEntityDocumentAsAttachmentToNote(formContext, entityTypeCode, templateRef, recordsString, entityRef_2, filename);
                                    telemetryParams.set("EntityId", entityId);
                                    telemetryParams.set("OperationName", "SaveEntityDocumentAsAttachmentToNote");
                                    telemetryParams.set("Success", "Successfully Saved PDF document to Timeline for " + entityLogicalName);
                                    SalesCommandBarActions.logSuccessSaveAndDownloadPDF(telemetryParams);
                                }
                            });
                        }
                        else {
                            /**
                             * Save document (pdf) as an attachment to Notes.
                             * */
                            var entityRef_3 = { id: entityId, entityType: entityLogicalName };
                            SalesCommandBarActions.saveEntityDocumentAsAttachmentToNote(formContext, entityTypeCode, templateRef, recordsString, entityRef_3, filename);
                        }
                        telemetryParams.set("EntityId", entityId);
                        telemetryParams.set("Success", "Successfully Saved PDF document to Timeline for " + entityLogicalName);
                        telemetryParams.set("OperationName", "SaveEntityDocumentAsAttachmentToNote");
                        SalesCommandBarActions.logSuccessSaveAndDownloadPDF(telemetryParams);
                    }
                    else if (success.confirmed == false) {
                        SalesCommandBarActions.downloadPDFFile(entityTypeCode, templateRef, recordsString, filename);
                        telemetryParams.set("EntityId", entityId);
                        telemetryParams.set("OperationType", "PDFGeneration.SavePDFToSharePointOrDynamics.CreatePDF.Download");
                        telemetryParams.set("OperationName", "DownloadPDF");
                        telemetryParams.set("Success", "Successfully Downloaded PDF document for " + entityLogicalName);
                        SalesCommandBarActions.logSuccessSaveAndDownloadPDF(telemetryParams);
                    }
                    else {
                        telemetryParams.set("EntityId", entityId);
                        telemetryParams.set("OperationType", "PDFGeneration.SavePDFToSharePointOrDynamics.CreatePDF.CloseDialog");
                        telemetryParams.set("OperationName", "CloseCreatePDFConfirmationDialog");
                        SalesCommandBarActions.logSuccessSaveAndDownloadPDF(telemetryParams);
                    }
                }, function (error) {
                    entityId = Xrm.Page.data.entity.getId();
                    telemetryParams.set("EntityId", entityId);
                    telemetryParams.set("Error", error.message);
                    telemetryParams.set("OperationType", "PDFGeneration.SavePDFToSharePointOrDynamics");
                    telemetryParams.set("OperationName", "OpenCreatePDFConfirmationDialog");
                    SalesCommandBarActions.logFailureSaveAndDownloadPDF(telemetryParams, "Create PDF -> Xrm.Navigation.openConfirmDialog call failed for " + { entityLogicalName: entityLogicalName });
                });
            };
            /**
            * Private function to attach PDF file in email using CreateEmailWithEntityDocument SDK and open email form.
            */
            this.createEmailEntityWithPDFAttachment = function (formContext, entityTypeCode, templateRef, recordsString) {
                var emailData = _this.getEmailData(formContext);
                var createEmailWithEntityDocumentRequest = new ODataContract.CreateEmailWithEntityDocumentRequest(entityTypeCode, templateRef, recordsString, emailData);
                Xrm.Utility.showProgressIndicator(Sales.StringProvider.getResourceString("Sales_EmailAsPDF"));
                Xrm.WebApi.online.execute(createEmailWithEntityDocumentRequest).then(function (response) {
                    if (response) {
                        response.json().then(function (emailId) {
                            ClientUtility.DialogUtil.hideProgressMessage();
                            if (!ClientUtility.DataUtil.isNullOrUndefined(emailId.id) && emailId.id.length > 0 && emailId.id !== ClientUtility.Guid.Empty) {
                                Xrm.Utility.openEntityForm(Sales.EntityNames.Email, emailId.id);
                                Xrm.Reporting.reportSuccess("createEmailEntityWithPDFAttachment: Success: Successfully opened email form.");
                            }
                            else {
                                Xrm.Reporting.reportFailure("createEmailEntityWithPDFAttachment", Error("Error: Email Id field is null.Cannot open email form."));
                                ClientUtility.ActionFailedHandler.showGenericError("Email Id field is null. Cannot open email form.");
                            }
                        }, function (error) {
                            ClientUtility.DialogUtil.hideProgressMessage();
                            ClientUtility.ActionFailedHandler.actionFailedCallbackForWebAPI(error);
                        });
                    }
                }, function (error) {
                    ClientUtility.DialogUtil.hideProgressMessage();
                    ClientUtility.ActionFailedHandler.actionFailedCallbackForWebAPI(error);
                });
            };
            this.buildMenu = function (systemTemplates, personalTemplates, entityTypeName, menuType, actionHandler) {
                var templates = systemTemplates.concat(personalTemplates);
                var buttonsSystemTemplate = [], buttonsPersonalTemplate = [];
                for (var i = 0; i < templates.length; i++) {
                    _this.templateMap[templates[i].id] = templates[i].name;
                    var tempStr = (templates[i].isSystemTemplate ? "" : "PersonalTemplate");
                    var button = {
                        ControlType: "Button",
                        Id: entityTypeName + "|NoRelationship|Form|Mscrm.Form." + entityTypeName + "." + menuType + ".Menu." + tempStr + menuType + ".Controls." + templates[i].id,
                        Command: entityTypeName + "|NoRelationship|Form|" + actionHandler,
                        Sequence: String(i * 10 + 10),
                        ToolTipDescription: templates[i].name,
                        Alt: templates[i].name,
                        LabelText: templates[i].name,
                        ModernImage: "SystemDocumentTemplates"
                    };
                    if (templates[i].isSystemTemplate)
                        buttonsSystemTemplate.push(button);
                    else
                        buttonsPersonalTemplate.push(button);
                }
                var controlsSystem = {
                    Id: entityTypeName + "|NoRelationship|Form|Mscrm.Form." + entityTypeName + "." + menuType + ".Menu." + menuType + ".Controls",
                    Items: buttonsSystemTemplate
                };
                var menuSectionSystem = {
                    Id: entityTypeName + "|NoRelationship|Form|Mscrm.Form." + entityTypeName + "." + menuType + ".Menu." + menuType,
                    Sequence: 10,
                    DisplayMode: 6,
                    Item: controlsSystem
                };
                var controlsPersonal = {
                    Id: entityTypeName + "|NoRelationship|Form|Mscrm.Form." + entityTypeName + "." + menuType + ".Menu." + menuType + ".Controls",
                    Items: buttonsPersonalTemplate
                };
                var menuSectionPersonal = {
                    Id: entityTypeName + "|NoRelationship|Form|Mscrm.Form." + entityTypeName + "." + menuType + ".Menu." + menuType,
                    Sequence: 10,
                    DisplayMode: 6,
                    Title: Sales.StringProvider.getResourceString("Sales_PersonalTemplates"),
                    Item: controlsPersonal
                };
                var menu = {
                    Id: entityTypeName + "|NoRelationship|Form|Mscrm.Form." + entityTypeName + "." + menuType + ".Menu",
                    MenuSection: [menuSectionSystem, menuSectionPersonal]
                };
                return menu;
            };
            /**
             * check if given SDK is avilable or not
             * @param {string} sdkMessagesId SDK message ID
             */
            this.isSdkAvailable = function (sdkMessagesId) {
                var cachedValue = _this.cache.getValueSaved(sdkMessagesId, Sales.CachedProperties.ReadOnlyKey);
                if (!ClientUtility.DataUtil.isNullOrUndefined(cachedValue)) {
                    return cachedValue;
                }
                var deferred = Xrm.WebApi.online.retrieveRecord("sdkmessage", sdkMessagesId, "?$select=name")
                    .then(function (response) {
                    if (response) {
                        var entityDoc = response;
                        if (!ClientUtility.DataUtil.isNullOrEmptyString(entityDoc["name"])) {
                            _this.cache.setValueIfNotNull(sdkMessagesId, Sales.CachedProperties.ReadOnlyKey, true);
                            return true;
                        }
                        return false;
                    }
                }, function (e) {
                    _this.cache.setValueIfNotNull(sdkMessagesId, Sales.CachedProperties.ReadOnlyKey, false);
                    console.error(e);
                    return false;
                });
                return deferred;
            };
            this.shouldShowCreateAndEmailPDFCommand = function () {
                return Xrm.Utility.getGlobalContext().client.getClient() === Xrm.Constants.ClientNames.mobile;
            };
            /**
            * Get data to populate in the email form.
            */
            this.getEmailData = function (formContext) {
                var emailSubject;
                var emailData = {};
                emailData["@odata.type"] = "Microsoft.Dynamics.CRM.email";
                //Fetch and Populate "Subject" field data
                try {
                    if (formContext.getAttribute("name") != null) {
                        emailSubject = formContext.getAttribute("name").getValue();
                    }
                    else if (formContext.getAttribute("subject") != null) {
                        emailSubject = formContext.getAttribute("subject").getValue();
                    }
                    else if (formContext.data.entity.getEntityName() == Sales.EntityNames.Contact) {
                        emailSubject = formContext.data.entity.getEntityReference().name;
                    }
                    else {
                        console.warn("Warn: There is no 'name' or 'subject' attribute field available on the form");
                    }
                    emailData["subject"] = emailSubject;
                }
                catch (error) {
                    Xrm.Reporting.reportFailure("EmailAsPDF_PopulateSubject", error, "Error: Error while populating 'Name' or 'Subject' field.");
                }
                //Fetch and Populate "To" and "From" field data in the email entity object
                try {
                    //Fetch "From" Field data
                    var userId = formContext.context.userSettings.userId;
                    userId = userId.substring(1, userId.length - 1);
                    var from_FieldData = {};
                    from_FieldData["partyid_systemuser@odata.bind"] = "/systemusers(" + userId + ")";
                    from_FieldData["participationtypemask"] = "1"; //1 is for 'from' field
                    var to_FieldData_1 = {};
                    //Fetch "To" Field data
                    try {
                        if (formContext.getAttribute("customerid") != null) {
                            if (formContext.getAttribute("customerid").getValue() != null) {
                                var potentialCustomerRecordId_1 = formContext.getAttribute("customerid").getValue()[0].id;
                                potentialCustomerRecordId_1 = potentialCustomerRecordId_1.replace(/[{}]/g, '');
                                var potentialCustomerEntityType_1 = formContext.getAttribute("customerid").getValue()[0].entityType;
                                Xrm.Utility.getEntityMetadata(potentialCustomerEntityType_1).then(function (entityMetadata) {
                                    var potentialCustomerEntityPluralName = entityMetadata.EntitySetName;
                                    to_FieldData_1["partyid_" + potentialCustomerEntityType_1 + "@odata.bind"] = "/" + potentialCustomerEntityPluralName + "(" + potentialCustomerRecordId_1 + ")";
                                    to_FieldData_1["participationtypemask"] = "2"; //2 is for 'to' field
                                });
                            }
                            else {
                                console.warn("Warn: Potential Customer field is empty.");
                                Xrm.Reporting.reportSuccess("Warn: Potential Customer field is empty.");
                            }
                        }
                        else {
                            console.warn("Warn: Potential Customer field does not exist.");
                            Xrm.Reporting.reportSuccess("Warn: Potential Customer field does not exist.");
                        }
                    }
                    catch (error) {
                        Xrm.Reporting.reportFailure("EmailAsPDF_PopulateTo", error, "Error: Potential Customer field does not exist.");
                    }
                    emailData["email_activity_parties"] = [
                        from_FieldData, to_FieldData_1
                    ];
                }
                catch (error) {
                    Xrm.Reporting.reportFailure("EmailAsPDF_PopulateFromOrTo", error, "Error: Error while populating 'To and From' field.");
                }
                //Fetch "Regarding" Entity data
                try {
                    var sourceEntityRecordId_1 = formContext.data.entity.getEntityReference().id;
                    sourceEntityRecordId_1 = sourceEntityRecordId_1.replace(/[{}]/g, '');
                    var sourceEntityType_1 = formContext.data.entity.getEntityReference().entityType;
                    Xrm.Utility.getEntityMetadata(sourceEntityType_1).then(function (entityMetadata) {
                        var sourceEntityPluralName = entityMetadata.EntitySetName;
                        emailData["regardingobjectid_" + sourceEntityType_1 + "_email@odata.bind"] = "/" + sourceEntityPluralName + "(" + sourceEntityRecordId_1 + ")";
                    });
                }
                catch (error) {
                    Xrm.Reporting.reportFailure("EmailAsPDF_PopulateRegarding", error, "Error: Error while populating 'Regarding' field.");
                }
                return emailData;
            };
            this.LookupAddress = function () {
                var aoItems = null;
                var sParentID = null;
                if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data.entity.attributes.get("customerid")))
                    aoItems = Xrm.Page.data.entity.attributes.get("customerid").getValue();
                if (ClientUtility.DataUtil.isNullOrUndefined(aoItems)) {
                    var sArg = Xrm.Page.ui.controls.get("customerid").getLabel();
                    Xrm.Utility.alertDialog(ClientUtility.StringUtil.format(Sales.StringProvider.getResourceString("LOCID_PROVIDE_VALUE_ADDRESS"), sArg), null);
                    return;
                }
                var dialogParams = {};
                var willCallLookUp = Xrm.Page.data.entity.attributes.get("willcall");
                dialogParams[Sales.MetadataDrivenDialogConstantsLookUpAddress.DisableShipToCall] = willCallLookUp && willCallLookUp.getValue() ? 1 : 0;
                var cbLookUpAddress = _this.callbackLookUpAddress;
                var dlgDialogBox = { width: 500, height: 450, position: 1 /* center */ };
                sParentID = aoItems[0].id;
                dialogParams[Sales.MetadataDrivenDialogConstantsLookUpAddress.ParentId] = sParentID;
                Xrm.Navigation.openDialog(Sales.DialogName.LookUpAddress, dlgDialogBox, dialogParams).then(cbLookUpAddress);
            };
            this.LookupDetailAddress = function (context) {
                var aoItems = null;
                var sParentID = null;
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                //If Willcall is true, address will decided later, not online. So it must be false.
                if (!ClientUtility.DataUtil.isNullOrUndefined(formContext.data.entity.attributes.get("willcall")) && !formContext.data.entity.attributes.get("willcall").getValue()) {
                    var iHeaderType = "", typeName = formContext.data.entity.getEntityName(), entityId = "";
                    switch (typeName) {
                        case Sales.EntityNames.QuoteDetail:
                            iHeaderType = Sales.EntityNames.Quote;
                            entityId = Sales.MetadataDrivenDialogConstantsLookUpDetailAddress.Quoteid;
                            break;
                        case Sales.EntityNames.SalesOrderDetail:
                            iHeaderType = Sales.EntityNames.SalesOrder;
                            entityId = Sales.MetadataDrivenDialogConstantsLookUpDetailAddress.Salesorderid;
                            break;
                        case Sales.EntityNames.InvoiceDetail:
                            iHeaderType = Sales.EntityNames.Invoice;
                            entityId = Sales.MetadataDrivenDialogConstantsLookUpDetailAddress.Invoiceid;
                            break;
                    }
                    var enttId = formContext.data.entity.attributes.get(entityId);
                    var val = formContext.data.entity.attributes.get(entityId).getValue();
                    if (!ClientUtility.DataUtil.isNullOrUndefined(enttId) && val.length > 0) {
                        Xrm.WebApi.retrieveRecord(iHeaderType, enttId.getValue()[0].id, "?$select=_customerid_value").then(function (result) {
                            var dialogParams = {};
                            var cbLookUpAddress = _this.callbackLookUpDetailAddress;
                            var dlgDialogBox = { width: 500, height: 350, position: 1 /* center */ };
                            dialogParams[Sales.MetadataDrivenDialogConstantsLookUpDetailAddress.ParentId] = result._customerid_value;
                            Xrm.Navigation.openDialog(Sales.DialogName.LookUpDetailAddress, dlgDialogBox, dialogParams).then(cbLookUpAddress);
                        });
                    }
                }
            };
            this.callbackLookUpAddress = function (result) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(result.parameters)) {
                    var lastButtonClicked = result.parameters[Sales.MetadataDrivenDialogConstantsLookUpAddress.LastButtonClicked];
                    if (!ClientUtility.DataUtil.isNullOrUndefined(lastButtonClicked) && lastButtonClicked.toString() === ClientUtility.MetadataDrivenDialogConstants.DialogOkId) {
                        var addressId = ClientUtility.Guid.create(result.parameters[Sales.MetadataDrivenDialogConstantsLookUpAddress.AddressId]);
                        if (!ClientUtility.DataUtil.isNullOrUndefined(addressId)) {
                            var shipTo_1 = result.parameters["shiptoaddress"] == "1" ? true : false;
                            var billTo_1 = result.parameters["billtoaddress"] == "1" ? true : false;
                            Xrm.WebApi.retrieveRecord("customeraddress", addressId).then(function (response) {
                                if (!ClientUtility.DataUtil.isNullOrUndefined(response)) {
                                    _this.setAddressValue(response, shipTo_1, billTo_1);
                                }
                            }, ClientUtility.ActionFailedHandler.actionFailedCallback);
                        }
                    }
                }
            };
            this.callbackLookUpDetailAddress = function (result) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(result.parameters)) {
                    var lastButtonClicked = result.parameters[Sales.MetadataDrivenDialogConstantsLookUpDetailAddress.LastButtonClicked];
                    if (!ClientUtility.DataUtil.isNullOrUndefined(lastButtonClicked) && lastButtonClicked.toString() === ClientUtility.MetadataDrivenDialogConstants.DialogOkId) {
                        var addressId = ClientUtility.Guid.create(result.parameters[Sales.MetadataDrivenDialogConstantsLookUpDetailAddress.AddressId]);
                        if (!ClientUtility.DataUtil.isNullOrUndefined(addressId)) {
                            var columnsToFetch = "?$select=line1,line2,line3,city,stateorprovince,postalcode,country,fax,primarycontactname,telephone1,name,shippingmethodcode,freighttermscode,customeraddressid";
                            Xrm.WebApi.retrieveRecord("customeraddress", addressId, columnsToFetch).then(function (response) {
                                if (!ClientUtility.DataUtil.isNullOrUndefined(response)) {
                                    _this.setDetailAddressValue(response);
                                }
                            }, ClientUtility.ActionFailedHandler.actionFailedCallback);
                        }
                    }
                }
            };
            this.setAddressValue = function (response, shipTo, billTo) {
                if (shipTo) {
                    _this.setValueOfAttribute("shipto_line1", response.line1);
                    _this.setValueOfAttribute("shipto_line2", response.line2);
                    _this.setValueOfAttribute("shipto_line3", response.line3);
                    _this.setValueOfAttribute("shipto_city", response.city);
                    _this.setValueOfAttribute("shipto_stateorprovince", response.stateorprovince);
                    _this.setValueOfAttribute("shipto_postalcode", response.postalcode);
                    _this.setValueOfAttribute("shipto_country", response.country);
                    _this.setValueOfAttribute("shipto_fax", response.fax);
                    _this.setValueOfAttribute("shipto_contactname", response.primarycontactname);
                    _this.setValueOfAttribute("shipto_telephone", response.telephone1);
                    _this.setValueOfAttribute("shipto_name", response.name);
                    _this.setValueOfAttribute("shippingmethodcode", response.shippingmethodcode);
                    _this.setValueOfAttribute("freighttermscode", response.freighttermscode);
                    _this.setValueOfAttribute("shipto_addressid", response.customeraddressid);
                }
                if (billTo) {
                    _this.setValueOfAttribute("billto_line1", response.line1);
                    _this.setValueOfAttribute("billto_line2", response.line2);
                    _this.setValueOfAttribute("billto_line3", response.line3);
                    _this.setValueOfAttribute("billto_city", response.city);
                    _this.setValueOfAttribute("billto_stateorprovince", response.stateorprovince);
                    _this.setValueOfAttribute("billto_postalcode", response.postalcode);
                    _this.setValueOfAttribute("billto_country", response.country);
                    _this.setValueOfAttribute("billto_fax", response.fax);
                    _this.setValueOfAttribute("billto_contactname", response.primarycontactname);
                    _this.setValueOfAttribute("billto_telephone", response.telephone1);
                    _this.setValueOfAttribute("billto_name", response.name);
                    _this.setValueOfAttribute("billto_addressid", response.customeraddressid);
                }
            };
            this.setDetailAddressValue = function (response) {
                _this.setValueOfAttribute("shipto_line1", response.line1);
                _this.setValueOfAttribute("shipto_line2", response.line2);
                _this.setValueOfAttribute("shipto_line3", response.line3);
                _this.setValueOfAttribute("shipto_city", response.city);
                _this.setValueOfAttribute("shipto_stateorprovince", response.stateorprovince);
                _this.setValueOfAttribute("shipto_postalcode", response.postalcode);
                _this.setValueOfAttribute("shipto_country", response.country);
                _this.setValueOfAttribute("shipto_fax", response.fax);
                _this.setValueOfAttribute("shipto_contactname", response.primarycontactname);
                _this.setValueOfAttribute("shipto_telephone", response.telephone1);
                _this.setValueOfAttribute("shipto_name", response.name);
                _this.setValueOfAttribute("shippingmethodcode", response.shippingmethodcode);
                _this.setValueOfAttribute("freighttermscode", response.freighttermscode);
                _this.setValueOfAttribute("shipto_addressid", response.customeraddressid);
            };
            this.setValueOfAttribute = function (attributeName, value) {
                if (Xrm.Page.data.entity.attributes
                    && !ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data.entity.attributes.get(attributeName))) {
                    value = ClientUtility.DataUtil.isUndefined(value) ? null : value;
                    Xrm.Page.data.entity.attributes.get(attributeName).setValue(value);
                }
            };
            this.addFilterWithParent = function (lookup, parentId) {
                var fetchXml = ClientUtility.StringUtil.format('<filter type="and"><condition attribute="parentid" operator="eq" value="{0}"/><filter type="or"><condition attribute="name" operator="not-null"/><condition attribute="composite" operator="not-null"/></filter></filter>', parentId);
                lookup.addCustomFilter(fetchXml);
            };
            this.onLoadLookUpAddressDialog = function (context) {
                var oLookup = Xrm.Page.ui.controls.get("addresslookup");
                var lookUpFilterWithParent = function (context) {
                    var parentId = null;
                    if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data) && !ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data.attributes)) {
                        parentId = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsLookUpAddress.ParentId).getValue();
                        _this.addFilterWithParent(oLookup, parentId);
                    }
                };
                if (!ClientUtility.DataUtil.isNullOrUndefined(oLookup)) {
                    oLookup.addPreSearch(lookUpFilterWithParent);
                }
                var billAttribute = Xrm.Page.data.attributes.get("billtoaddress");
                if (!ClientUtility.DataUtil.isNullOrUndefined(billAttribute)) {
                    billAttribute.setValue("1");
                }
                var shipAttribute = Xrm.Page.data.attributes.get("shiptoaddress");
                if (!ClientUtility.DataUtil.isNullOrUndefined(shipAttribute)) {
                    shipAttribute.setValue("1");
                }
                var okControl = Xrm.Page.ui.controls.get(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                if (!ClientUtility.DataUtil.isNullOrUndefined(okControl)) {
                    okControl.setDisabled(true);
                }
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                var shipToCallAttribute = null;
                if (formContext.data && formContext.data.attributes)
                    shipToCallAttribute = formContext.data.attributes.get(Sales.MetadataDrivenDialogConstantsLookUpAddress.DisableShipToCall);
                if (!ClientUtility.DataUtil.isNullOrUndefined(shipToCallAttribute)) {
                    var shiptoCall = shipToCallAttribute.getValue();
                    if (!ClientUtility.DataUtil.isNullOrUndefined(shiptoCall) && shiptoCall) {
                        var shiptoAddressControl = Xrm.Page.getControl("shiptoaddress");
                        if (!ClientUtility.DataUtil.isNullOrUndefined(shiptoAddressControl)) {
                            if (!ClientUtility.DataUtil.isNullOrUndefined(shipAttribute)) {
                                shipAttribute.setValue("0");
                            }
                            shiptoAddressControl.setDisabled(true);
                        }
                    }
                }
            };
            this.onLoadLookUpDetailAddressDialog = function (context) {
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                var oLookup = formContext.ui.controls.get("addresslookup");
                var lookUpFilterWithParent = function (context) {
                    var parentId = null;
                    if (!ClientUtility.DataUtil.isNullOrUndefined(formContext.data) && !ClientUtility.DataUtil.isNullOrUndefined(formContext.data.attributes)) {
                        parentId = formContext.data.attributes.get(Sales.MetadataDrivenDialogConstantsLookUpDetailAddress.ParentId).getValue();
                        _this.addFilterWithParent(oLookup, parentId);
                    }
                };
                if (!ClientUtility.DataUtil.isNullOrUndefined(oLookup)) {
                    oLookup.addPreSearch(lookUpFilterWithParent);
                }
                var okControl = formContext.ui.controls.get(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                if (!ClientUtility.DataUtil.isNullOrUndefined(okControl)) {
                    okControl.setDisabled(true);
                }
            };
            this.onOkClickLookUpAddressDialog = function () {
                var aoItems = Xrm.Page.data.attributes.get("addresslookup"), scontactID = "", dataValue = null;
                if (!ClientUtility.DataUtil.isNullOrUndefined(aoItems) && !ClientUtility.DataUtil.isNullOrUndefined(aoItems.getValue()) && aoItems.getValue().length > 0) {
                    dataValue = aoItems.getValue();
                    scontactID = dataValue[0].id;
                    var addressAttribute = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsLookUpAddress.AddressId);
                    if (!ClientUtility.DataUtil.isNullOrUndefined(addressAttribute)) {
                        addressAttribute.setValue(scontactID);
                    }
                }
                Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsLookUpAddress.LastButtonClicked).setValue(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                Xrm.Page.ui.close();
            };
            this.onOkClickLookUpDetailAddressDialog = function (context) {
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                var aoItems = formContext.data.attributes.get("addresslookup"), scontactID = "", dataValue = null;
                if (!ClientUtility.DataUtil.isNullOrUndefined(aoItems) && !ClientUtility.DataUtil.isNullOrUndefined(aoItems.getValue()) && aoItems.getValue().length > 0) {
                    dataValue = aoItems.getValue();
                    scontactID = dataValue[0].id;
                    var addressAttribute = formContext.data.attributes.get(Sales.MetadataDrivenDialogConstantsLookUpDetailAddress.AddressId);
                    if (!ClientUtility.DataUtil.isNullOrUndefined(addressAttribute)) {
                        addressAttribute.setValue(scontactID);
                    }
                }
                formContext.data.attributes.get(Sales.MetadataDrivenDialogConstantsLookUpAddress.LastButtonClicked).setValue(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                formContext.ui.close();
            };
            this.onCancelClickLookUpAddressDialog = function () {
                Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsLookUpAddress.LastButtonClicked).setValue(ClientUtility.MetadataDrivenDialogConstants.DialogCancelId);
                Xrm.Page.ui.close();
            };
            this.onCancelClickLookUpDetailAddressDialog = function (context) {
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                formContext.data.attributes.get(Sales.MetadataDrivenDialogConstantsLookUpDetailAddress.LastButtonClicked).setValue(ClientUtility.MetadataDrivenDialogConstants.DialogCancelId);
                formContext.ui.close();
            };
            /**
             * onChange handler to enable OK(Add address) button to true in LookUpControl Dialog
             */
            this.onLookUpAddressOptionsChanged = function () {
                _this._updateOKButtonLookUpAddressDialog();
            };
            this.onLookUpDetailAddressOptionsChanged = function (context) {
                _this._updateOKButtonLookUpDetailAddressDialog(context);
            };
            this._updateOKButtonLookUpAddressDialog = function () {
                var okControl = Xrm.Page.ui.controls.get(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                if (ClientUtility.DataUtil.isNullOrUndefined(okControl)) {
                    return;
                }
                var aoItems = Xrm.Page.data.attributes.get("addresslookup"), scontactID = "", dataValue = null;
                if (!ClientUtility.DataUtil.isNullOrUndefined(aoItems) && !ClientUtility.DataUtil.isNullOrUndefined(aoItems.getValue()) && aoItems.getValue().length > 0) {
                    var billAttribute = Xrm.Page.data.attributes.get("billtoaddress");
                    var shipAttribute = Xrm.Page.data.attributes.get("shiptoaddress");
                    if (!ClientUtility.DataUtil.isNullOrUndefined(billAttribute) && !ClientUtility.DataUtil.isNullOrUndefined(shipAttribute)) {
                        var shipTo = shipAttribute.getValue() == "1" ? true : false;
                        var billTo = billAttribute.getValue() == "1" ? true : false;
                        if (!shipTo && !billTo) {
                            okControl.setDisabled(true); //if both billTo & shipTo not selected, disable OK.
                            return;
                        }
                    }
                    okControl.setDisabled(false);
                }
                else {
                    //if no address is selected, disable OK control
                    okControl.setDisabled(true);
                }
            };
            this._updateOKButtonLookUpDetailAddressDialog = function (context) {
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                var okControl = formContext.ui.controls.get(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                if (ClientUtility.DataUtil.isNullOrUndefined(okControl)) {
                    return;
                }
                var aoItems = formContext.data.attributes.get("addresslookup"), scontactID = "", dataValue = null;
                if (!ClientUtility.DataUtil.isNullOrUndefined(aoItems) && !ClientUtility.DataUtil.isNullOrUndefined(aoItems.getValue()) && aoItems.getValue().length > 0) {
                    okControl.setDisabled(false);
                }
                else {
                    //if no address is selected, disable OK control
                    okControl.setDisabled(true);
                }
            };
            this.onCloseGetProductsDialog = function () {
                var opportunityId = _this.getIdFromLookupAttribute(Sales.MetadataDrivenDialogConstantsGetProducts.OpportunityLookup);
                if (ClientUtility.DataUtil.isNullOrEmptyString(opportunityId)) {
                    return;
                }
                ClientUtility.DialogUtil.setAttributeValue(Sales.MetadataDrivenDialogConstantsGetProducts.OpportunityId, opportunityId);
                var lastButtonClickedAttribute = _this.getPageAttribute(Sales.MetadataDrivenDialogConstantsGetProducts.LastButtonClicked);
                if (!ClientUtility.DataUtil.isNullOrUndefined(lastButtonClickedAttribute)) {
                    lastButtonClickedAttribute.setValue(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                }
                Xrm.Page.ui.close();
            };
            this.getGetProductsOpportunityId = function () {
                var opportunityIdAttribute = _this.getPageAttribute(Sales.MetadataDrivenDialogConstantsGetProducts.OpportunityId);
                return opportunityIdAttribute && opportunityIdAttribute.getValue();
            };
            this.getGetProductsName = function () {
                var nameAttribute = _this.getPageAttribute(Sales.MetadataDrivenDialogConstantsGetProducts.Name);
                return nameAttribute && nameAttribute.getValue();
            };
            this.getProducts = function () {
                Xrm.Page.data.save().then(function () {
                    var aoItems = Xrm.Page.data.entity.attributes.get("opportunityid"), sOppID = "", sOppName = "", dataValue = null;
                    if (!ClientUtility.DataUtil.isNullOrUndefined(aoItems) && !ClientUtility.DataUtil.isNullOrUndefined(aoItems.getValue()) && aoItems.getValue().length > 0) {
                        dataValue = aoItems.getValue();
                        sOppID = dataValue[0].id;
                        sOppName = dataValue[0].name;
                    }
                    else {
                        sOppID = ClientUtility.Guid.Empty;
                    }
                    var transactionCurrencyId = Xrm.Page.data.entity.attributes.get("transactioncurrencyid");
                    if (!ClientUtility.DataUtil.isNullOrUndefined(transactionCurrencyId)) {
                        transactionCurrencyId = Xrm.Page.data.entity.attributes.get("transactioncurrencyid");
                        dataValue = transactionCurrencyId.getValue();
                    }
                    var callBackAfterGetProducts = _this.performActionAfterGetProducts, dlgDialogBox = { width: 500, height: 250, position: 1 /* center */ }, dialogParams = {};
                    dialogParams[Sales.MetadataDrivenDialogConstantsGetProducts.OpportunityId] = sOppID;
                    dialogParams[Sales.MetadataDrivenDialogConstantsGetProducts.Name] = sOppName;
                    dialogParams[Sales.MetadataDrivenDialogConstantsGetProducts.TransactionCurrencyId] = dataValue[0].id;
                    Xrm.Navigation.openDialog(Sales.DialogName.GetProducts, dlgDialogBox, dialogParams).then(callBackAfterGetProducts);
                }, ClientUtility.ActionFailedHandler.actionFailedCallback);
            };
            this.performActionAfterGetProducts = function (result) {
                var lastButtonClicked = result.parameters[Sales.MetadataDrivenDialogConstantsGetProducts.LastButtonClicked];
                if (ClientUtility.DataUtil.isNullOrUndefined(lastButtonClicked) || lastButtonClicked.toString() !== ClientUtility.MetadataDrivenDialogConstants.DialogOkId) {
                    return;
                }
                if (!ClientUtility.DataUtil.isNullOrUndefined(result.parameters)) {
                    var request = null;
                    var opportunity = {};
                    var entity = {};
                    opportunity["id"] = ClientUtility.Guid.create(result.parameters[Sales.MetadataDrivenDialogConstantsGetProducts.OpportunityId]);
                    opportunity["entityType"] = Sales.EntityNames.Opportunity;
                    entity["id"] = ClientUtility.Guid.create(Xrm.Page.data.entity.getId());
                    var typeName = Xrm.Page.data.entity.getEntityName();
                    switch (typeName) {
                        case "quote":
                            entity["entityType"] = Sales.EntityNames.Quote;
                            request = new ODataContract.GetQuoteProductsFromOpportunityRequest(entity, opportunity);
                            Xrm.WebApi.online.execute(request).then(function (response) {
                                Xrm.Page.data.refresh(true);
                                var subGrid = Xrm.Page.getControl("quotedetailsGrid");
                                subGrid.refresh();
                            }, ClientUtility.ActionFailedHandler.actionFailedCallback);
                            break;
                        case "salesorder":
                            entity["entityType"] = Sales.EntityNames.SalesOrder;
                            request = new ODataContract.GetSalesOrderProductsFromOpportunityRequest(entity, opportunity);
                            Xrm.WebApi.online.execute(request).then(function (response) {
                                Xrm.Page.data.refresh(true);
                                var subGrid = Xrm.Page.getControl("salesorderdetailsGrid");
                                subGrid.refresh();
                            }, ClientUtility.ActionFailedHandler.actionFailedCallback);
                            break;
                        case "invoice":
                            entity["entityType"] = Sales.EntityNames.Invoice;
                            request = new ODataContract.GetInvoiceProductsFromOpportunityRequest(entity, opportunity);
                            Xrm.WebApi.online.execute(request).then(function (response) {
                                Xrm.Page.data.refresh(true);
                                var subGrid = Xrm.Page.getControl("invoicedetailsGrid");
                                subGrid.refresh();
                            }, ClientUtility.ActionFailedHandler.actionFailedCallback);
                            break;
                    }
                }
            };
            /**
             * Checks if there is enough priviledge to append to customer.
             * @returns {Promise<boolean>} True if there is enough privledge, false otherwise.
             */
            this.canAppendToCustomer = function () {
                if (ClientUtility.ClientUtil.isMobileOffline()) {
                    return Promise.resolve(false);
                }
                var entityId = Xrm.Page.data.entity.getId();
                if (_this.isAppendPrivilegeCalculated)
                    return Promise.resolve(_this.canAppendCustomer);
                else {
                    var customer = Xrm.Page.data.entity.attributes.get("customerid");
                    if (!ClientUtility.DataUtil.isNullOrUndefined(customer)) {
                        var customerValue = customer.getValue();
                        if (!ClientUtility.DataUtil.isNullOrUndefined(customerValue) && customerValue.length) {
                            return _this.calculateAppendPrivileges().then(function (value) {
                                _this.canAppendCustomer = value;
                                _this.isAppendPrivilegeCalculated = true;
                                return _this.canAppendCustomer;
                            });
                        }
                    }
                }
                return Promise.resolve(false);
            };
            /**
             * On load handler for CloseQuote dialog.
             */
            this.onLoadCloseQuoteDialog = function () {
                _this.initializeDialogLabelsForCloseQuote();
                _this.initializeDateControl(Sales.MetadataDrivenDialogConstantsQuoteClose.Date);
                _this.filterOptionSetValuesFromControl(Sales.EntityNames.Quote, _this.getCloseQuoteDialogClosedState(), Sales.MetadataDrivenDialogConstantsQuoteClose.Reason);
                Xrm.Page.ui.controls.get(Sales.MetadataDrivenDialogConstantsQuoteClose.CreateRevisedQuote).setVisible(true);
                _this.setVisibilityCloseQuoteDialogCloseOpportunityControl();
            };
            // Create Order
            /**
             * onLoad handler for the CreateOrder dialog
             *  - sets localized labels
             *  - initializes date & option set controls
             *  - hides controls that aren't applicable to the current quote
             */
            this.onLoadCreateOrderDialog = function () {
                _this.initializeDateControl(Sales.MetadataDrivenDialogConstantsOrderCreate.Date);
                _this.filterOptionSetValuesFromControl(Sales.EntityNames.Quote, _this.getCreateOrderDialogClosedState(), Sales.MetadataDrivenDialogConstantsOrderCreate.Reason);
                _this.updateCreateOrderDialogUiState();
                var currencyControl = Xrm.Page.data.attributes.get('transactioncurrencyid');
                var quoteAttribute = Xrm.Page.data.attributes.get('param_quoteid');
                if (!ClientUtility.DataUtil.isNullOrUndefined(quoteAttribute) && !ClientUtility.DataUtil.isNullOrUndefined(quoteAttribute.getValue())) {
                    var quoteid = quoteAttribute.getValue();
                    var quoteRetrieveOptions = "?$select=quoteid&$expand=transactioncurrencyid($select=currencyname,currencysymbol,currencyprecision)";
                    Xrm.WebApi.retrieveRecord(Sales.EntityNames.Quote, quoteid, quoteRetrieveOptions).then((function (response) {
                        if (!ClientUtility.DataUtil.isNullOrUndefined(response)) {
                            var quoteRecord = response;
                            if (!ClientUtility.DataUtil.isNullOrUndefined(quoteRecord.transactioncurrencyid) && !ClientUtility.DataUtil.isNullOrUndefined(quoteRecord.transactioncurrencyid.currencyname)) {
                                var transactionCurrencyRecord = quoteRecord.transactioncurrencyid;
                                _this.setCurrencySymbolAndPrecision(transactionCurrencyRecord, currencyControl);
                            }
                        }
                    }).bind(_this), ClientUtility.ActionFailedHandler.actionFailedErrorDialog);
                }
            };
            /**
     * Function to set the currency format and Precision in currency control
     */
            this.setCurrencySymbolAndPrecision = function (transactionCurrencyRecord, currencyControl) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(transactionCurrencyRecord)) {
                    if (!ClientUtility.DataUtil.isNullOrUndefined(currencyControl)) {
                        currencyControl.setValue([{ id: transactionCurrencyRecord.transactioncurrencyid, name: transactionCurrencyRecord.currencyname, entityType: Sales.EntityNames.TransactionCurrency }]);
                    }
                }
            };
            /**
             * onClick handler for the CreateOrder dialog OK button
             *  - sets attriutes based on dialog controls
             *  - closes the dialog
             */
            this.onCloseCreateOrderDialog = function () {
                var reason = _this.getSelectedOptionValueFromOptionSetControl(Sales.MetadataDrivenDialogConstantsOrderCreate.Reason), canCloseOpportunity = _this.getCreateOrderDialogCanCloseOpportunity(), closeOpportunity = canCloseOpportunity
                    && _this.getSelectedOptionValueFromOptionSetControl(Sales.MetadataDrivenDialogConstantsOrderCreate.CloseOpportunity) === _this.yesOptionSetValue, description = _this.getCreateOrderDialogDescription(), reasonDescription = _this.getCreateOrderStatusReasonDescription(), closeDate = _this.getCreateOrderDialogDate(), actualRevenue = 0, useGivenRevenue = closeOpportunity
                    && _this.getSelectedOptionValueFromOptionSetControl(Sales.MetadataDrivenDialogConstantsOrderCreate.CalculateRevenueFromQuote) !== _this.yesOptionSetValue;
                if (useGivenRevenue) {
                    actualRevenue = _this.getCreateOrderDialogActualRevenue();
                }
                ClientUtility.DialogUtil.setAttributeValue(Sales.MetadataDrivenDialogConstantsOrderCreate.Date, closeDate);
                ClientUtility.DialogUtil.setAttributeValue(Sales.MetadataDrivenDialogConstantsOrderCreate.Description, description);
                ClientUtility.DialogUtil.setAttributeValue(Sales.MetadataDrivenDialogConstantsOrderCreate.Reason, reason);
                ClientUtility.DialogUtil.setAttributeValue(Sales.MetadataDrivenDialogConstantsOrderCreate.ReasonDescription, reasonDescription);
                ClientUtility.DialogUtil.setAttributeValue(Sales.MetadataDrivenDialogConstantsOrderCreate.CalculateRevenueFromQuote, !useGivenRevenue);
                ClientUtility.DialogUtil.setAttributeValue(Sales.MetadataDrivenDialogConstantsOrderCreate.CloseOpportunity, closeOpportunity);
                ClientUtility.DialogUtil.setAttributeValue(Sales.MetadataDrivenDialogConstantsOrderCreate.ActualRevenue, actualRevenue);
                Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsOrderCreate.LastButtonClicked).setValue(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                Xrm.Page.ui.close();
            };
            /**
             * onChange handler to hide the controls for closing the related opportunity if closeOpportunity is changed to false; Show them if changed to true
             */
            this.onCreateOrderCloseOpportunityChanged = function () {
                _this.updateCreateOrderDialogUiState();
            };
            /**
             * onChange handler to show the control to provide actual revenue if changed to false; hide if changed to true
             */
            this.onCreateOrderCalculateRevenueFromQuoteChanged = function () {
                _this.updateCreateOrderDialogUiState();
            };
            /**
             * onChange handler to disable the OK button if actualRevenue is required but is blank; enable it otherwise
             */
            this.onCreateOrderActualRevenueChanged = function () {
                _this.updateCreateOrderDialogUiState();
            };
            /**
             * Shows/hides controls and enables/disables OK button based on the options given in the dialog
             */
            this.updateCreateOrderDialogUiState = function () {
                var canCloseOpportunity = _this.getCreateOrderDialogCanCloseOpportunity();
                _this.setVisibilityOfControl(Sales.MetadataDrivenDialogConstantsOrderCreate.CloseOpportunity, canCloseOpportunity);
                var shouldCloseOpportunity = canCloseOpportunity
                    && _this.getSelectedOptionValueFromOptionSetControl(Sales.MetadataDrivenDialogConstantsOrderCreate.CloseOpportunity) === _this.yesOptionSetValue;
                _this.setVisibilityOfControl(Sales.MetadataDrivenDialogConstantsOrderCreate.CalculateRevenueFromQuote, shouldCloseOpportunity);
                var calculateRevenueFromQuote = _this.getSelectedOptionValueFromOptionSetControl(Sales.MetadataDrivenDialogConstantsOrderCreate.CalculateRevenueFromQuote);
                _this.setVisibilityOfControl(Sales.MetadataDrivenDialogConstantsOrderCreate.ActualRevenue, shouldCloseOpportunity && calculateRevenueFromQuote !== _this.yesOptionSetValue);
                var control = Xrm.Page.ui.controls.get(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                if (shouldCloseOpportunity && calculateRevenueFromQuote !== _this.yesOptionSetValue && !_this.getCreateOrderHasActualRevenueValue())
                    control.setDisabled(true);
                else
                    control.setDisabled(false);
            };
            /**
             * Sets the visibility control.
             */
            this.setVisibilityOfControl = function (controlname, disabled) {
                var ctrl = Xrm.Page.ui.controls.get(controlname);
                if (ctrl) {
                    ctrl.setVisible(disabled);
                }
            };
            /**
             * getter for the value of canCloseOpportunity provided by the user
             */
            this.getCreateOrderDialogCanCloseOpportunity = function () {
                var attribute = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsOrderCreate.CanCloseOpportunity);
                return attribute.getValue();
            };
            /**
             * Getters for dialog controls (including hidden controls)
             */
            this.getCreateOrderDialogClosedState = function () {
                var closedStateAttribute = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsOrderCreate.ClosedState);
                return closedStateAttribute.getValue();
            };
            this.getCreateOrderHasActualRevenueValue = function () {
                var actualRevenue = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsOrderCreate.ActualRevenue);
                return !ClientUtility.DataUtil.isNullOrUndefined(actualRevenue) && !ClientUtility.DataUtil.isNullOrUndefined(actualRevenue.getValue());
            };
            this.getCreateOrderDialogDate = function () {
                var closeDateControl = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsOrderCreate.Date);
                return closeDateControl.getValue();
            };
            this.getCreateOrderDialogDescription = function () {
                var descriptionAttribute = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsQuoteClose.Description);
                return descriptionAttribute.getValue();
            };
            this.getCreateOrderDialogActualRevenue = function () {
                var actualRevenue = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsOrderCreate.ActualRevenue);
                return actualRevenue.getValue();
            };
            this.getCreateOrderStatusReasonDescription = function () {
                var statusControl = Xrm.Page.ui.controls.get(Sales.MetadataDrivenDialogConstantsOrderCreate.Reason);
                var options = statusControl.getAttribute();
                return options.getSelectedOption().text;
            };
            /**
             * Creates the order & closes the quote & opportunity
             * @param newStatus the new status for the quote
             * @param newStatusMsg the new statusReason for the quote
             * @param closeDate the close date for the quote
             * @param description the description for the quoteClose
             * @param closeOpportunity whether the opportunity associated with the quote should be closed
             * @param useGivenRevenue whether the user provided revenue in the dialog
             * @param actualRevenue the revenue the user provided in the dialog
             */
            this.performActionAfterAcceptQuote = function (quoteId, newStatus, newStatusMsg, closeDate, description, closeOpportunity, useGivenRevenue, actualRevenue) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(closeDate)) {
                    var commandData = {};
                    var adjustedCloseDate = SalesCommandBarActions.isFCSOn(SalesCommandBarActions.FCSNameSpaceForPriceCalc, SalesCommandBarActions.FCSSettingKeyForDateAdjustmentOnOrderCreation) ? _this.getAdjustedCloseDate(closeDate) : closeDate;
                    commandData["NewStatusCode"] = newStatus;
                    commandData["CloseDate"] = adjustedCloseDate;
                    commandData["Description"] = description;
                    commandData["CloseOpportunity"] = closeOpportunity;
                    commandData["UseRevenue"] = useGivenRevenue;
                    commandData["ActualRevenue"] = actualRevenue;
                    commandData["QuoteId"] = quoteId;
                    var subjectTemplate = Sales.StringProvider.getResourceString("Quote_Won_Subject"), subject = ClientUtility.StringUtil.format(subjectTemplate, newStatusMsg, Xrm.Page.data.entity.attributes.get("quotenumber").getValue(), Sys.CultureInfo.InvariantCulture);
                    _this.winQuoteAndCreateOrder(adjustedCloseDate, commandData, useGivenRevenue, subject);
                }
            };
            /**
             * Creates an order for the quote
             * @param quoteCloseDate the close date of the quote
             * @param commandData the data from the create order dialog
             * @param useGivenRevene whether the related opportunity should be closed with actual or calculated revenue
             * @param subject the subjectx for the CloseQuote entity
             */
            this.winQuoteAndCreateOrder = function (quoteCloseDate, commandData, useGivenRevenue, subject) {
                var columnSet = new ODataContract.ColumnSet(true, []);
                var processInstanceId = Xrm.Page.data.process.getInstanceId() || ClientUtility.Guid.Empty;
                var createOrderRequest = new ODataContract.ConvertQuoteToSalesOrderRequest({ guid: ClientUtility.Guid.create(Xrm.Page.data.entity.getId()) }, columnSet, quoteCloseDate, commandData["NewStatusCode"], subject, commandData["Description"], { id: processInstanceId, entityType: "businessprocessflowinstance" });
                var progressIndicator = new ClientUtility.ProgressIndicator();
                progressIndicator.show();
                Xrm.WebApi.online.execute(createOrderRequest).then(function (response) {
                    response.json().then(function (responseCreateOrder) {
                        var quoteSalesOrderId = responseCreateOrder.salesorderid;
                        if (commandData["CloseOpportunity"]) {
                            var val = Xrm.Page.data.entity.attributes.get("opportunityid").getValue();
                            if (!ClientUtility.DataUtil.isNullOrUndefined(val) && !ClientUtility.DataUtil.isNullOrUndefined(val[0]) && !ClientUtility.DataUtil.isNullOrUndefined(val[0].id)) {
                                var closeOpportunitySubjectTemplate = Sales.StringProvider.getResourceString("Close_Opportunity_Activity_Subject");
                                var activitySubject = ClientUtility.StringUtil.format(closeOpportunitySubjectTemplate, responseCreateOrder.name);
                                var actualRevenue = "";
                                if (useGivenRevenue) {
                                    actualRevenue = commandData["ActualRevenue"].toString();
                                    _this.closeOpportunity(commandData["CloseDate"], val[0].id, activitySubject, actualRevenue, quoteSalesOrderId);
                                }
                                else {
                                    var opportunityId = ClientUtility.Guid.create(val[0].id);
                                    var calculateValueRequest = new ODataContract.CalculateActualValueOpportunityRequest({ id: opportunityId, entityType: Sales.EntityNames.Opportunity });
                                    Xrm.WebApi.online.execute(calculateValueRequest).then(function (response) {
                                        response.json().then(function (responseCalculate) {
                                            actualRevenue = responseCalculate.Value.toString();
                                            _this.closeOpportunity(commandData["CloseDate"], val[0].id, activitySubject, actualRevenue, quoteSalesOrderId);
                                        });
                                    }, function (error) { progressIndicator.hideOnError(ClientUtility.ActionFailedHandler.actionFailedCallback)(error); });
                                }
                            }
                            progressIndicator.hide();
                        }
                        else {
                            if (!ClientUtility.DataUtil.isNullOrEmptyString(quoteSalesOrderId)) {
                                Xrm.Page.data.refresh(true).then(function () {
                                    Xrm.Page.ui.refreshRibbon();
                                    Xrm.Utility.openEntityForm(Sales.EntityNames.SalesOrder, quoteSalesOrderId);
                                }).then(function () { _this.showQuoteToOrderToastMessage(); });
                            }
                            progressIndicator.hide();
                        }
                    });
                }, function (error) {
                    Sales.ClientUtil.addSteps(error).then(function () {
                        progressIndicator.hideOnError(ClientUtility.ActionFailedHandler.actionFailedCallback)(error);
                    });
                });
            };
            /**
            * Displays toast notification on creation of Order from Qutoe
            * Toast notification includes link to navigate to quote from which order was created.
            * @param quoteId the id of the quote that user should be navigated to.
            */
            this.showQuoteToOrderToastMessage = function () {
                if (Xrm.Internal.isUci()) {
                    Xrm.Utility.getEntityMetadata(Sales.EntityNames.SalesOrder).then(function (result) {
                        var toastLabel = Sales.ResourceStringProvider.getResourceString("Sales_ToastNotification_EntityCreation");
                        var toastMessage = String.format(toastLabel, result.DisplayName);
                        if (toastLabel.indexOf("{0}") != 0) {
                            toastMessage = String.format(toastLabel, result.DisplayName.toLowerCase());
                        }
                        Xrm.UI.addGlobalNotification(1 /* toast */, 1 /* success */, toastMessage, null, null, null);
                    });
                }
            };
            /**
             * Displays toast notification actions performed on Qutoe - Activate, Close, Revise
             *
             * @param resourceString the resourceString of the notification message.
             */
            this.showToastMessageOnQuoteActions = function (resourceString) {
                if (Xrm.Internal.isUci()) {
                    Xrm.Utility.getEntityMetadata(Sales.EntityNames.Quote).then(function (result) {
                        var toastLabel = Sales.ResourceStringProvider.getResourceString(resourceString);
                        var toastMessage = String.format(toastLabel, result.DisplayName);
                        if (toastLabel.indexOf("{0}") != 0) {
                            toastMessage = String.format(toastLabel, result.DisplayName.toLowerCase());
                        }
                        Xrm.UI.addGlobalNotification(1 /* toast */, 1 /* success */, toastMessage, null, null, null);
                    });
                }
            };
            /**
             * Closes the given opportunity
             * @param closeDate the date this opportunity was closed
             * @param oppId the guid of the opportunity to close
             * @param activitySubject the subject for the opportunityClose entity
             * @param actualRevenue the actual revenue for the opportunity
             * @param quoteSalesOrderId the guid of the new sales order associated with this opportunity
             */
            this.closeOpportunity = function (closeDate, oppId, activitySubject, actualRevenue, quoteSalesOrderId) {
                var opportunityRecord = {};
                opportunityRecord.actualvalue = parseInt(actualRevenue);
                opportunityRecord.actualclosedate = ClientUtility.ODataUtil.getEdmDate(new Date());
                opportunityRecord.closeprobability = 100;
                Xrm.WebApi.online.updateRecord(Sales.EntityNames.Opportunity, oppId, opportunityRecord).then(function (oppUpdateresponse) {
                    var opportunityCloseRecord = {};
                    opportunityCloseRecord["opportunityid@odata.bind"] = "/opportunities(" + ClientUtility.Guid.create(oppId) + ")";
                    opportunityCloseRecord.actualrevenue = Number(actualRevenue);
                    opportunityCloseRecord.actualend = closeDate || new Date();
                    opportunityCloseRecord.subject = activitySubject;
                    var winOpportunityRequest = new ODataContract.WinOpportunityRequest(opportunityCloseRecord, -1);
                    Xrm.WebApi.online.execute(winOpportunityRequest).then(function (oppOppCloseresponse) {
                        if (!ClientUtility.DataUtil.isNullOrEmptyString(quoteSalesOrderId)) {
                            Xrm.Utility.openEntityForm(Sales.EntityNames.SalesOrder, quoteSalesOrderId);
                            _this.showQuoteToOrderToastMessage();
                        }
                    }, ClientUtility.ActionFailedHandler.actionFailedCallback);
                }, ClientUtility.ActionFailedHandler.actionFailedCallback);
            };
            /**
             * Initializes a date control so that it can be used; sets the value to today's date
             * @param controlName the name of the date control
             */
            this.initializeDateControl = function (controlName) {
                var dateControl = Xrm.Page.getControl(controlName);
                var date = dateControl.getAttribute();
                date.setValue(new Date);
            };
            this.setControlLabelTextFromResourceString = function (controlId, resourceId) {
                var control = Xrm.Page.getControl(controlId);
                if (!ClientUtility.DataUtil.isNullOrUndefined(control)) {
                    control.setLabel(Sales.StringProvider.getResourceString(resourceId));
                }
            };
            /**
             * re-calculates by refreshing the current entity page.
             */
            this.reCalculate = function () {
                // ToDo - Display a proper error message saying form is invalid.
                if (Xrm.Page.data.isValid && !Xrm.Page.data.isValid()) {
                    return;
                }
                Xrm.Page.data.save().then(function () {
                    var recalculatePriceRequest = new ODataContract.RecalculatePriceRequest({ guid: ClientUtility.Guid.create(Xrm.Page.data.entity.getId()) }, Xrm.Page.data.entity.getEntityName());
                    Xrm.WebApi.online.execute(recalculatePriceRequest).then(function (response) {
                        Xrm.Page.data.refresh(false);
                    }, ClientUtility.ActionFailedHandler.actionFailedCallback);
                }, ClientUtility.DialogUtil.actionFailedCallbackForMoca);
            };
            /**
             * On load handler for CloseInvoice dialog.
             */
            this.onLoadCloseInvoiceDialog = function () {
                var closeState = _this.getCloseInvoiceDialogClosedState();
                if (closeState === Sales.InvoiceState.Paid) {
                    _this.initializeDialogLabelsForPaidInvoice();
                }
                else {
                    _this.initializeDialogLabelsForCancelInvoice();
                }
                _this.filterOptionSetValuesFromControl(Sales.EntityNames.Invoice, _this.getCloseInvoiceDialogClosedState(), Sales.MetadataDrivenDialogConstantsInvoiceClose.Reason);
            };
            /**
             * On close Handler for CloseInvoice dialog.
             */
            this.onCloseCloseInvoiceDialog = function () {
                var invoiceId = _this.getCloseInvoiceDialogInvoiceId();
                var closedState = _this.getCloseInvoiceDialogClosedState();
                var reason = _this.getCloseInvoiceDialogReason();
                ClientUtility.DialogUtil.setAttributeValue(Sales.MetadataDrivenDialogConstantsInvoiceClose.ClosedState, closedState);
                ClientUtility.DialogUtil.setAttributeValue(Sales.MetadataDrivenDialogConstantsInvoiceClose.InvoiceId, ClientUtility.Guid.create(invoiceId));
                ClientUtility.DialogUtil.setAttributeValue(Sales.MetadataDrivenDialogConstantsInvoiceClose.Reason, reason.value);
                Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsInvoiceClose.LastButtonClicked).setValue(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                Xrm.Page.ui.close();
            };
            this.initializeDialogLabelsForPaidInvoice = function () {
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsInvoiceClose.DialogTitle, "Dialog_PaidInvoice_Title");
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsInvoiceClose.DialogDescription, "Dialog_PaidInvoice_Description");
            };
            this.initializeDialogLabelsForCancelInvoice = function () {
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsInvoiceClose.DialogTitle, "Dialog_CancelInvoice_Title");
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsInvoiceClose.DialogDescription, "Dialog_CancelInvoice_Description");
            };
            this.getCloseInvoiceDialogReason = function () {
                var statusControl = Xrm.Page.ui.controls.get(Sales.MetadataDrivenDialogConstantsInvoiceClose.Reason);
                var options = statusControl.getAttribute();
                return options.getSelectedOption();
            };
            this.getCloseInvoiceDialogClosedState = function () {
                var closedStateAttribute = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsInvoiceClose.ClosedState);
                return closedStateAttribute.getValue();
            };
            this.getCloseInvoiceDialogInvoiceId = function () {
                var invoiceIdAttribute = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsInvoiceClose.InvoiceId);
                return invoiceIdAttribute.getValue().toString();
            };
            /**
             * Filters an option set control so that only options valid for the given statecode (status) show up
             * @param entityName the name of the entity the option set is associated with
             * @param stateCode the statecode used to filter the options
             * @param controlId the control to filter
             */
            this.filterOptionSetValuesFromControl = function (entityName, stateCode, controlId) {
                if (ClientUtility.ClientUtil.isMobileOffline()) {
                    ClientUtility.DialogUtil.showMoCAOfflineError();
                    return;
                }
                var defaultStatusCode = 1;
                //TODO: offline scenario
                // if (ClientUtility.ClientUtil.isMobileOffline()) {
                //	 defaultStatusCode = Xrm.Utility.retrieveDefaultStatusForState(entityName, stateCode);
                //	 _thisref.filterOptionSetValuesFromControlWithDefault(entityName, stateCode, controlId, defaultStatusCode)
                // }
                //else
                Sales.OptionSetFilter.filterOptionSetValuesFromControl(entityName, stateCode, controlId);
            };
            this.getCloseQuoteDialogClosedState = function () {
                var closedStateAttribute = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsQuoteClose.ClosedState);
                return closedStateAttribute.getValue();
            };
            this.getSelectedOptionValueFromOptionSetControl = function (controlName) {
                var optionSetControl = Xrm.Page.ui.controls.get(controlName);
                return optionSetControl.getAttribute().getValue();
            };
            /**
            * Handler that gets called when Fulfill/Cancel Order Dialog is opened
            */
            this.onLoadCloseOrderDialog = function () {
                var closeState = _this.getCloseOrderDialogClosedState();
                if (closeState === Sales.SalesOrderState.Fulfilled) {
                    _this.initializeDialogLabelsForFulfillOrder();
                }
                else {
                    _this.initializeDialogLabelsForCancelOrder();
                }
                _this.initializeDateControl(Sales.MetadataDrivenDialogConstantsOrderClose.Date);
                _this.filterOptionSetValuesFromControl(Sales.EntityNames.SalesOrder, _this.getCloseOrderDialogClosedState(), Sales.MetadataDrivenDialogConstantsOrderClose.Reason);
            };
            /**
             * Handler that gets called when Fulfill/Cancel Order Dialog is closed
             */
            this.onCloseCloseOrderDialog = function () {
                Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsOrderClose.LastButtonClicked).setValue(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                Xrm.Page.ui.close();
            };
            this.initializeDialogLabelsForCancelOrder = function () {
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsOrderClose.DialogTitle, "Order_Cancel_Dlg_Title");
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsOrderClose.DialogDescription, "Order_Cancel_Dlg_Desc");
                _this.setControlLabelTextFromResourceString(ClientUtility.MetadataDrivenDialogConstants.DialogOkId, "Web.SFA.salesorders.aspx_ConfirmButton.dlg_close");
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsOrderClose.Date, "Web.SFA.salesorders.aspx_50.dlg_close");
            };
            this.initializeDialogLabelsForFulfillOrder = function () {
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsOrderClose.DialogTitle, "Order_Fulfill_Dlg_Title");
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsOrderClose.DialogDescription, "Order_Fulfill_Dlg_Desc");
                _this.setControlLabelTextFromResourceString(ClientUtility.MetadataDrivenDialogConstants.DialogOkId, "Web.SFA.salesorders.aspx_FulfillButton.dlg_close");
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsOrderClose.Date, "Web.SFA.salesorders.aspx_51.dlg_close");
            };
            this.getCloseOrderDialogClosedState = function () {
                var closedStateAttribute = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsOrderClose.ClosedState);
                return closedStateAttribute.getValue();
            };
            this.calculateAppendPrivileges = function () {
                var customer = Xrm.Page.data.entity.attributes.get("customerid");
                if (ClientUtility.DataUtil.isNullOrUndefined(customer))
                    return Promise.resolve(false);
                else {
                    var customerValue = customer.getValue();
                    if (ClientUtility.DataUtil.isNullOrUndefined(customerValue) || !customerValue.length)
                        return Promise.resolve(false);
                    else {
                        var customerLookup = customerValue[0];
                        var target = { entityType: customerLookup.entityType, id: customerLookup.id };
                        var principal = { entityType: "systemuser", id: Xrm.Utility.getGlobalContext().getUserId() };
                        var retrievePrincipalAccessRequest = new ODataContract.RetrievePrincipalAccessRequest(principal, target);
                        return Xrm.WebApi.online.execute(retrievePrincipalAccessRequest).then(function (response) {
                            return response.json().then(function (jsonResponse) {
                                return jsonResponse.AccessRights.indexOf("AppendToAccess") > -1;
                            });
                        });
                    }
                }
            };
            this.addTransactionCurrencyParam = function (lookupControl, transactionCurrencyParamName) {
                var oTransCurId = null;
                var sTransCurId = "";
                var dataValue = null;
                if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data)) {
                    oTransCurId = Xrm.Page.data.attributes.get(transactionCurrencyParamName);
                    if (!ClientUtility.DataUtil.isNullOrUndefined(oTransCurId)) {
                        oTransCurId = Xrm.Page.data.attributes.get(transactionCurrencyParamName);
                        sTransCurId = oTransCurId.getValue();
                    }
                }
                var fetchXml = '<filter type="and"><condition attribute="transactioncurrencyid" operator="like" value="';
                fetchXml += Xrm.Encoding.xmlAttributeEncode(sTransCurId);
                fetchXml += '"/></filter>';
                lookupControl.addCustomFilter(fetchXml);
            };
            this.deactivateDiscountType = function (gridControl, records, entityTypeCode, defaultCloseState, callback) {
                if (!records.length) {
                    Xrm.Navigation.openAlertDialog({ text: Sales.StringProvider.getResourceString("Error_Message_Action_NoItemSelected") });
                    return;
                }
                var options = {
                    width: Sales.DialogConfirmStrings.DeactivateGridDialogWidth,
                    height: Sales.MetadataDrivenDialogConstants.DiscountTypeDeactivateHeight,
                    position: 1 /* center */
                };
                var ids = "", objectSubtype = null, entityName = Xrm.Internal.getEntityName(entityTypeCode);
                _this.openDeactivateDialog(gridControl, records, entityTypeCode, defaultCloseState, callback, options, ids, objectSubtype);
                Xrm.Reporting.reportEvent(ClientUtility.DialogUtil.getDialogTelemetryPayload(ClientUtility.DialogUtil.DialogTelemetryContext.grid, "Deactivate", entityName, false, "Sales"));
            };
            this.openDeactivateDialog = function (gridControl, records, entityTypeCode, defaultCloseState, callback, options, ids, objectSubtype) {
                var action = "deactivate", EntityName = Xrm.Internal.getEntityName(entityTypeCode);
                var selectedRecords = new Array(records.length);
                for (var i = 0; i < records.length; i++) {
                    selectedRecords[i] = { TypeCode: records[i].TypeCode, TypeName: Xrm.Internal.getEntityName(records[i].TypeCode), Id: ClientUtility.Guid.tryCreate(records[i].Id) };
                }
                var dialogParams = {};
                dialogParams[Sales.MetadataDrivenDialogConstants.EntityRrecords] = selectedRecords;
                dialogParams[Sales.MetadataDrivenDialogConstants.ActionName] = Sales.MetadataDrivenDialogConstants.Deactivate;
                dialogParams[ClientUtility.MetadataDrivenDialogConstants.LastButtonClicked] = "";
                dialogParams[ClientUtility.MetadataDrivenDialogConstants.StateId] = -1;
                dialogParams[ClientUtility.MetadataDrivenDialogConstants.StatusId] = -1;
                if (!ClientUtility.DataUtil.isNullOrUndefined(defaultCloseState))
                    dialogParams[Sales.MetadataDrivenDialogConstants.DefaultCloseState] = defaultCloseState.toString();
                var dialogCallbackParams = {};
                dialogCallbackParams[ClientUtility.MetadataDrivenDialogConstants.GridControl] = gridControl;
                if (ClientUtility.CommandBarActions.isWebClient() || Xrm.Page.context.client.getClient() === Xrm.Constants.ClientNames.outlook || Xrm.Page.context.client.getClient() === Xrm.Constants.ClientNames.unifiedServiceDesk) {
                    options.height = Sales.DialogConfirmStrings.DeactivateGridDialogHeight;
                    options.width = Sales.DialogConfirmStrings.DeactivateGridDialogWidth;
                }
                var entityName = Xrm.Internal.getEntityName(entityTypeCode), onClose = function (dialogParams) {
                    ClientUtility.CommandBarActions.closeSetStateDialogFromGridCallback(dialogParams.parameters, dialogCallbackParams, gridControl, callback);
                };
                Xrm.Navigation.openDialog(Sales.DialogName.SetStateDialog, options, dialogParams).then(onClose);
            };
            this.deleteDiscountTypeRecords = function (gridControl, records, entityTypeCode) {
                var useLongHeight = false, dialogWidth = 570, dialogHeight = 205, longDialogHeight = 250, setSubTypes = false, dialogArguments = null, callbackRef = null, entityName = Xrm.Internal.getEntityName(entityTypeCode), confirmDialogStrings = { text: undefined };
                if (records.length <= 0) {
                    Xrm.Navigation.openAlertDialog({ text: String.format(Sales.StringProvider.getResourceString("Error_Message_Action_NoItemSelected")) });
                    return;
                }
                confirmDialogStrings.text = String.format(Sales.StringProvider.getResourceString("Dialog_Delete_Description"), Sales.EntityNames.DiscountType); //TODO get entity display name
                confirmDialogStrings.confirmButtonLabel = Sales.StringProvider.getResourceString("Button_Label_Delete");
                confirmDialogStrings.cancelButtonLabel = Sales.StringProvider.getResourceString("Button_Label_Cancel");
                confirmDialogStrings.title = Sales.StringProvider.getResourceString("Web._grid.cmds.dlg_delete.aspx_26");
                confirmDialogStrings.subtitle = "";
                _this.openDeleteConfirmationDialog(gridControl, records, useLongHeight, dialogWidth, dialogHeight, longDialogHeight, setSubTypes, dialogArguments, callbackRef, entityName, confirmDialogStrings);
                Xrm.Reporting.reportEvent(ClientUtility.DialogUtil.getDialogTelemetryPayload(ClientUtility.DialogUtil.DialogTelemetryContext.grid, "Delete", entityName, false, "Sales"));
            };
            this.openDeleteConfirmationDialog = function (gridControl, records, useLongHeight, dialogWidth, dialogHeight, longDialogHeight, setSubTypes, dialogArguments, callbackRef, entityName, confirmDialogStrings) {
                var dialogOptions = {
                    height: dialogHeight,
                    width: dialogWidth,
                    position: 1 /* center */
                };
                var confirmCallbackFunction = _this.PerformGridDeleteAction, confirmCallbackRef = function (response) { confirmCallbackFunction(response, gridControl, records); };
                Xrm.Navigation.openConfirmDialog(confirmDialogStrings, dialogOptions).then(confirmCallbackRef);
            };
            this.PerformGridDeleteAction = function (returnValue, gridControl, records) {
                if (!returnValue.confirmed)
                    return;
                if (!ClientUtility.DataUtil.isNullOrUndefined(records) && records.length > 0) {
                    ClientUtility.DialogUtil.showProgressMessage();
                    var entityName = Xrm.Internal.getEntityName(records[0].TypeCode);
                    if (ClientUtility.ClientUtil.isMobileOffline() && !Xrm.Mobile.offline.isOfflineEnabled(entityName)) {
                        ClientUtility.DialogUtil.hideProgressMessage();
                        ClientUtility.DialogUtil.showMoCAOfflineError();
                        return;
                    }
                    if (records.length === 1)
                        Xrm.WebApi.online.deleteRecord(entityName, records[0].Id.toString()).then(function (response) {
                            ClientUtility.DialogUtil.hideProgressMessage();
                            if (!ClientUtility.DataUtil.isNullOrUndefined(gridControl)) {
                                gridControl.refresh();
                            }
                        }, ClientUtility.DialogUtil.actionFailedCallbackForMoca);
                    else
                        _this.performChainDelete(records, 0, gridControl, true);
                }
            };
            this.performChainDelete = function (records, currentIndex, gridControl, deletionSuccess) {
                if (currentIndex >= records.length) {
                    ClientUtility.DialogUtil.hideProgressMessage();
                    !deletionSuccess &&
                        ClientUtility.CommandBarActions.openAlertDialogForDeleteMultipleError(gridControl);
                    gridControl.refresh();
                }
                else {
                    var entityReferenceName = records[currentIndex], entityName = Xrm.Internal.getEntityName(entityReferenceName.TypeCode);
                    Xrm.WebApi.online.deleteRecord(entityName, records[currentIndex].Id.toString()).then(function () {
                        _this.performChainDelete(records, currentIndex + 1, gridControl, deletionSuccess);
                    }, function () {
                        _this.performChainDelete(records, currentIndex + 1, gridControl, false);
                    });
                }
            };
            this.performActionAfterDeleteFromGrid = function (returnValue, gridControl, records) {
                if (ClientUtility.CommandBarActions.isMobileCompanionApp() || Xrm.Page.context.client.getClient() === Xrm.Constants.ClientNames.outlook) {
                    gridControl.refresh();
                    return;
                }
                if (!ClientUtility.DataUtil.isNullOrUndefined(returnValue) && returnValue) {
                    if (!ClientUtility.DataUtil.isNullOrUndefined(records) && records.length > 0) {
                        for (var recids = new Array(records.length), i = 0; i < records.length; i++)
                            recids[i] = records[i].Id;
                    }
                    try {
                        gridControl.refresh();
                    }
                    catch ($$e_5) {
                    }
                }
            };
            this.discountTypeBulkEdit = function (gridControl, records, entityTypeCode) {
                if (records.length === 1) {
                    var parameters = {};
                    parameters["rof"] = false;
                    var record = records[0];
                    Xrm.Utility.openEntityForm(record.TypeName, record.Id, parameters);
                }
                else {
                    //Bulk edit is not enabled for discountType
                    var options = {
                        // ToDo: this label does not exist. create new label?
                        message: Sales.StringProvider.getResourceString("notEligibleBulkEdit")
                    };
                    Xrm.Navigation.openErrorDialog(options);
                }
                Xrm.Reporting.reportEvent(ClientUtility.DialogUtil.getDialogTelemetryPayload(ClientUtility.DialogUtil.DialogTelemetryContext.grid, "Edit", Xrm.Internal.getEntityName(entityTypeCode), false, "Sales"));
            };
            this.discontTypeDeletePrimaryEntity = function (action, objectType, objectSubtype, callbackArgumentRef) {
                var id = Xrm.Page.data.entity.getId(), entityName = Xrm.Page.data.entity.getEntityName();
                var x = 450, y = 205, parameters = null;
                var confirmDialogStrings = { text: undefined };
                parameters = [objectType, id];
                var dialogOptions = {
                    height: y,
                    width: x,
                    position: 1 /* center */
                };
                confirmDialogStrings.text = String.format(Sales.StringProvider.getResourceString("Dialog_Delete_Description"), Sales.EntityNames.DiscountType); //TODO get entity display name
                confirmDialogStrings.confirmButtonLabel = Sales.StringProvider.getResourceString("Button_Label_Delete");
                confirmDialogStrings.cancelButtonLabel = Sales.StringProvider.getResourceString("Button_Label_Cancel");
                confirmDialogStrings.title = Sales.StringProvider.getResourceString("Web._grid.cmds.dlg_delete.aspx_26");
                confirmDialogStrings.subtitle = "";
                var confirmCallbackFunction = function (dialogParams) {
                    _this.performDeleteAction(dialogParams, objectType, id);
                };
                Xrm.Navigation.openConfirmDialog(confirmDialogStrings, dialogOptions).then(confirmCallbackFunction);
                Xrm.Reporting.reportEvent(ClientUtility.DialogUtil.getDialogTelemetryPayload(ClientUtility.DialogUtil.DialogTelemetryContext.grid, "Delete", entityName, false, "Sales"));
            };
            this.performDeleteAction = function (result, objectType, recordId) {
                if (!result.confirmed)
                    return;
                if (!ClientUtility.DataUtil.isNullOrEmptyString(recordId)) {
                    var entityName = Xrm.Internal.getEntityName(objectType);
                    ClientUtility.DialogUtil.showProgressMessage();
                    Xrm.WebApi.online.deleteRecord(entityName, recordId).then(function (response) {
                        ClientUtility.DialogUtil.hideProgressMessage();
                        // TODO replace Xrm.Internal.refreshParentGrid
                        //Xrm.Internal.refreshParentGrid(objectType, "", recordId)
                        ClientUtility.CommandBarActions.setFormDirty(false);
                        Xrm.Page.ui.close();
                    }, ClientUtility.DialogUtil.actionFailedCallbackForMoca);
                }
            };
            this.deleteSalesLiteratureItemRecords = function (gridControl, records, entityTypeCode) {
                var useLongHeight = false, dialogWidth = 570, dialogHeight = 205, longDialogHeight = 250, setSubTypes = false, dialogArguments = null, callbackRef = null, entityName = Xrm.Internal.getEntityName(entityTypeCode), confirmDialogStrings = { text: undefined };
                if (records.length <= 0) {
                    Xrm.Navigation.openAlertDialog({ text: String.format(Sales.StringProvider.getResourceString("Error_Message_Action_NoItemSelected")) });
                    return;
                }
                var salesAttachmentLabel = Sales.StringProvider.getResourceString("SalesAttachmentDisplayName");
                confirmDialogStrings.text = String.format(Sales.StringProvider.getResourceString("Dialog_Delete_Description"), salesAttachmentLabel);
                confirmDialogStrings.confirmButtonLabel = Sales.StringProvider.getResourceString("Button_Label_Delete");
                confirmDialogStrings.cancelButtonLabel = Sales.StringProvider.getResourceString("Button_Label_Cancel");
                confirmDialogStrings.title = Sales.StringProvider.getResourceString("Web._grid.cmds.dlg_delete.aspx_26");
                confirmDialogStrings.subtitle = "";
                _this.openDeleteConfirmationDialog(gridControl, records, useLongHeight, dialogWidth, dialogHeight, longDialogHeight, setSubTypes, dialogArguments, callbackRef, entityName, confirmDialogStrings);
                Xrm.Reporting.reportEvent(ClientUtility.DialogUtil.getDialogTelemetryPayload(ClientUtility.DialogUtil.DialogTelemetryContext.grid, "Delete", entityName, false, "Sales"));
            };
            this.getIdFromLookupAttribute = function (attribute) {
                var attributeIdLookup = _this.getPageAttribute(attribute);
                if (ClientUtility.DataUtil.isNullOrUndefined(attributeIdLookup)) {
                    return "";
                }
                var attributeLookupValue = attributeIdLookup.getValue();
                if (ClientUtility.DataUtil.isNullOrUndefined(attributeLookupValue) || attributeLookupValue.length <= 0) {
                    return "";
                }
                return attributeLookupValue[0].id;
            };
            this.convertActivityOnLoad = function (context) {
                _this.convertActivityActions.convertActivityOnLoad(context);
            };
            this.convertActivityClick = function (context) {
                _this.convertActivityActions.convertActivityClick(context);
            };
            this.convertActivityCallback = function (response) {
                _this.convertActivityActions.convertActivityCallback(response);
            };
            this.convertToOpportunityActivity = function (iObjType) {
                _this.convertActivityActions.convertToOpportunityActivity(iObjType);
            };
            this.OrderMode = function (gridEntityName, gridControl) {
                gridControl.refresh();
                //todo: grid reload to initial state
            };
            this.openActivityRecord = function (entityLogicalName, gridControl) {
                var parameters = {};
                if (typeof entityLogicalName === "number") {
                    entityLogicalName = Xrm.Internal.getEntityName(entityLogicalName);
                }
                if (!entityLogicalName)
                    return;
                if (entityLogicalName == "msdyn_salesocmessage") {
                    Sales.loadSidePaneConversationControl("", "", "", "", "");
                    return;
                }
                var openFormOptions = {
                    entityName: entityLogicalName
                };
                ClientUtility.ClientUtil.ValidateCurrentAppModule("msdynce_saleshub").then(function (isSalesHub) {
                    if (isSalesHub) {
                        _this.openActivityRecordAction(gridControl, openFormOptions, parameters, isSalesHub);
                    }
                    else {
                        ClientUtility.ClientUtil.ValidateCurrentAppModule("msdynce_salespro").then(function (isSalesPro) {
                            _this.openActivityRecordAction(gridControl, openFormOptions, parameters, isSalesPro);
                        }, function (error) {
                            // failed to retrieve app metadata -- open default
                            Xrm.Navigation.openForm(openFormOptions, parameters);
                        });
                    }
                }, function (error) {
                    // failed to retrieve app metadata -- open default
                    Xrm.Navigation.openForm(openFormOptions, parameters);
                });
            };
            this.openActivityRecordAction = function (gridControl, openFormOptions, parameters, isSalesHubOrPro) {
                if (Xrm.Internal.isFeatureEnabled("April2020Update") && Xrm.Internal.isFeatureEnabled("ActivityMgmtApril2020Update") && isSalesHubOrPro) {
                    openFormOptions["pageType"] = "entityrecord";
                    // open in MFD/Quick Create
                    window.Xrm.Navigation.navigateTo(openFormOptions, { target: 2, position: 1 }).then(function (response) {
                        gridControl && gridControl.refresh();
                        // log data for Successful launch of MFD on OOB activity Create
                        SalesCommandBarActions.logSuccessActivityMgmt("CreateMFD", openFormOptions.entityName);
                    }, function (error) {
                        // add telemetry logs that navigateTo has failed and fallback to openForm
                        Xrm.Navigation.openForm(openFormOptions, parameters);
                        SalesCommandBarActions.logFailureActivityMgmt("CreateMFD", openFormOptions.entityName);
                    });
                }
                else {
                    //non sales apps -- use library way of opening new records which is present earlier to MFD.
                    XrmCore.Commands.Open.openNewRecord(openFormOptions.entityName, gridControl);
                }
            };
            this.openGridActivityRecord = function (gridControl, records, entityTypeCode) {
                var viewId = "";
                if (gridControl && gridControl.getViewSelector() && gridControl.getViewSelector().getCurrentView() && gridControl.getViewSelector().getCurrentView().id && gridControl.getViewSelector().getCurrentView().id.slice(1, -1)) {
                    viewId = gridControl && gridControl.getViewSelector() && gridControl.getViewSelector().getCurrentView() && gridControl.getViewSelector().getCurrentView().id && gridControl.getViewSelector().getCurrentView().id.slice(1, -1);
                }
                if (records.length == 0 && (viewId.toLowerCase() == 'a6960a25-1a4a-ed11-bba2-000d3a98dd1f' || viewId.toLowerCase() == 'b7a71b36-1a4a-fe22-bba2-111d3a98dd1f')) {
                    // Temporary fix to not show error popup for Conversation views. Actual fix will be made in PowerAppsOneGrid/ModernDataSetGrid- Bug:3163859
                    Xrm.Reporting.reportFailure("SalesCommandBarActions_openGridActivityRecord", Error("Error: Click on look up is not supported yet."));
                    return;
                }
                if (records.length == 1) {
                    var entityDialogOptions = {};
                    entityDialogOptions["entityName"] = records[0].TypeName;
                    // Open a chat window for chat entity records
                    if (entityDialogOptions["entityName"] === Sales.EntityNames.Chat) {
                        _this.openChatWindow(records[0]);
                        return;
                    }
                    entityDialogOptions["entityId"] = records[0].Id;
                    if (entityDialogOptions["entityName"] === "msdyn_ocliveworkitem") {
                        _this.handleConversationRecord(records, gridControl, entityDialogOptions);
                        return;
                    }
                    var recordSetQueryKey_1 = gridControl && gridControl.getRecordSetQueryKey();
                    ClientUtility.ClientUtil.ValidateCurrentAppModule("msdynce_saleshub").then(function (isSalesHub) {
                        if (isSalesHub) {
                            _this.openGridActivityRecordAction(gridControl, records, entityDialogOptions, isSalesHub);
                        }
                        else {
                            ClientUtility.ClientUtil.ValidateCurrentAppModule("msdynce_salespro").then(function (isSalesPro) {
                                _this.openGridActivityRecordAction(gridControl, records, entityDialogOptions, isSalesPro);
                            }, function (error) {
                                // failed to retrieve app metadata -- open default
                                entityDialogOptions["recordSetQueryKey"] = recordSetQueryKey_1;
                                Xrm.Navigation.openForm(entityDialogOptions);
                            });
                        }
                    }, function (error) {
                        // failed to retrieve app metadata -- open default
                        entityDialogOptions["recordSetQueryKey"] = recordSetQueryKey_1;
                        Xrm.Navigation.openForm(entityDialogOptions);
                    });
                }
                else {
                    if (gridControl.getEntityName() == "bulkoperation" && records.length > 1) {
                        var BulkEditNotSupported = "MA.BulkOperation.BulkEditNotSupported";
                        Xrm.Navigation.openAlertDialog({ text: Sales.StringProvider.getResourceString(BulkEditNotSupported) });
                    }
                    else {
                        XrmCore.Commands.BulkEdit.bulkEditRecords(gridControl, records, entityTypeCode);
                    }
                }
            };
            this.handleOpenConversationActivityRecord = function (gridControl, records, entityDialogOptions, isSalesHubOrPro) {
                if (gridControl) {
                    this.openGridActivityRecordAction(gridControl, records, entityDialogOptions, isSalesHubOrPro);
                }
                else {
                    Xrm.Navigation.openForm(entityDialogOptions);
                }
            };
            this.getFetchXmlForSalesLiveWorkItem = function (workitemId) {
                return "<fetch version=\"1.0\" mapping=\"logical\">\n              <entity name=\"msdyn_ocliveworkitem\">\n                <filter type=\"and\">\n                    <condition attribute=\"activityid\" operator=\"eq\" value=\"" + workitemId + "\" />\n                  </filter>\n                <link-entity name=\"msdyn_channelinstance\" alias=\"aa\" link-type=\"inner\" from=\"msdyn_channelinstanceid\" to=\"msdyn_channelinstanceid\">\n                  <filter type=\"and\">\n                    <condition attribute=\"msdyn_consumingapplicationid\" operator=\"eq\" value=\"{38ae5f22-7750-ed11-9562-000d3a8f73e7}\" />\n                  </filter>\n                </link-entity>\n              </entity>\n            </fetch>";
            };
            this.openGridActivityRecordAction = function (gridControl, records, entityDialogOptions, isSalesHubOrPro) {
                var recordSetQueryKey = gridControl && gridControl.getRecordSetQueryKey();
                if (Xrm.Internal.isFeatureEnabled("April2020Update") && Xrm.Internal.isFeatureEnabled("ActivityMgmtApril2020Update") && isSalesHubOrPro) {
                    entityDialogOptions["pageType"] = "entityrecord";
                    // open in MFD/Quick Create
                    window.Xrm.Navigation.navigateTo(entityDialogOptions, { target: 2, position: 1 }).then(function (response) {
                        gridControl && gridControl.refresh();
                        SalesCommandBarActions.logSuccessActivityMgmt("OpenMFD", records[0].TypeName, records[0].Id);
                    }, function (error) {
                        var entityFormOptions = {};
                        entityFormOptions["entityName"] = records[0].TypeName;
                        entityFormOptions["entityId"] = records[0].Id;
                        entityFormOptions["recordSetQueryKey"] = recordSetQueryKey;
                        // add telemetry logs that navigateTo has failed and fallback to openForm
                        Xrm.Navigation.openForm(entityFormOptions);
                        SalesCommandBarActions.logFailureActivityMgmt("OpenMFD", records[0].TypeName, records[0].Id);
                    });
                }
                else {
                    //non sales apps -- open default
                    entityDialogOptions["recordSetQueryKey"] = recordSetQueryKey;
                    Xrm.Navigation.openForm(entityDialogOptions);
                }
            };
            this.isTopRowNotSelected = function (gridControl) {
                var allRows = gridControl.getGrid().getRows();
                var selectedRows = gridControl.getGrid().getSelectedRows();
                if (selectedRows.getLength() === 0)
                    return;
                var data = selectedRows.getByIndex(0).getData();
                if (data === null)
                    return;
                var entity = data.getEntity();
                if (entity === null)
                    return;
                var selId = entity._entityId.guid;
                for (var index = 0; index < allRows.getLength(); index++) {
                    var row = allRows.getByIndex(index);
                    if (row !== null) {
                        var rowEntity = row.getData().getEntity();
                        if (rowEntity !== null) {
                            var currentRowId = rowEntity._entityId.guid;
                            if (currentRowId === selId) {
                                return (index !== 0);
                            }
                        }
                    }
                }
            };
            this.isBottomRowNotSelected = function (gridControl) {
                var allRows = gridControl.getGrid().getRows();
                var selectedRows = gridControl.getGrid().getSelectedRows();
                if (selectedRows.getLength() === 0)
                    return;
                var data = selectedRows.getByIndex(0).getData();
                if (data === null)
                    return;
                var entity = data.getEntity();
                if (entity === null)
                    return;
                var selId = entity._entityId.guid;
                for (var index = 0; index < allRows.getLength(); index++) {
                    var row = allRows.getByIndex(index);
                    if (row !== null) {
                        var rowEntity = row.getData().getEntity();
                        if (rowEntity !== null) {
                            var currentRowId = rowEntity._entityId.guid;
                            if (currentRowId === selId) {
                                return (index !== allRows.getLength() - 1);
                            }
                        }
                    }
                }
            };
            this.isInlineEditView = function (gridControl) {
                var viewSelector = gridControl.getViewSelector();
                if (viewSelector == null)
                    return false;
                var currentViewId = viewSelector.getCurrentView() && viewSelector.getCurrentView().id;
                if (currentViewId == null)
                    return false;
                return Sales.InlineEditViews.filter(function (id) { return id === currentViewId; }).length > 0;
            };
            this.MoveRecordUp = function (gridEntityName, gridControl, selRecords) {
                var startIndex = gridControl.getFetchXml().indexOf("order attribute");
                var endIndex = gridControl.getFetchXml().indexOf("descending");
                var subString = gridControl.getFetchXml().substring(startIndex, endIndex);
                if (subString.indexOf("sequencenumber") === -1) {
                    Xrm.Navigation.openAlertDialog({
                        text: "Unable to move record as grid is in sort mode. Refresh the grid and try again" //todo: replace actual string
                    });
                }
                else {
                    var selRows_1 = [];
                    var prevRows_1 = [];
                    var allRows = gridControl.getGrid().getRows();
                    var selectedRows = gridControl.getGrid().getSelectedRows();
                    if (selectedRows.getLength() === 0)
                        return;
                    var rowData = selectedRows.getByIndex(0);
                    if (rowData === null)
                        return;
                    var entity = rowData.getData().getEntity();
                    if (entity === null)
                        return;
                    var selSequenceNumber_1 = entity.attributes.getByName("sequencenumber").getValue();
                    var selectedIndex = -1;
                    for (var index = 0; index < allRows.getLength(); index++) {
                        var currentRowId = allRows.getByIndex(index).getData().getEntity()._entityId.guid;
                        if (currentRowId === selRecords[0].Id) {
                            selectedIndex = index;
                        }
                    }
                    var prevRow = allRows.getByIndex(selectedIndex - 1);
                    var prevSequenceNumber_1 = prevRow.getData().getEntity().attributes.getByName("sequencenumber").getValue();
                    allRows.forEach(function (row, i) {
                        var rowEntity = row.getData().getEntity();
                        if (rowEntity !== null) {
                            var currentRowId = rowEntity._entityId.guid;
                            var currentRowSeqNumber = rowEntity.attributes.getByName("sequencenumber").getValue();
                            if (currentRowSeqNumber == selSequenceNumber_1) {
                                selRows_1.push(currentRowId);
                            }
                            else if (currentRowSeqNumber === prevSequenceNumber_1) {
                                prevRows_1.push(currentRowId);
                            }
                        }
                    });
                    if (selRows_1.length > 0 && prevRows_1.length > 0) {
                        var self_1 = this;
                        selRows_1.forEach(function (recId) {
                            Xrm.WebApi.online.updateRecord(gridEntityName, recId, { sequencenumber: prevSequenceNumber_1 }).then(function () {
                                prevRows_1.forEach(function (recId) {
                                    Xrm.WebApi.online.updateRecord(gridEntityName, recId, { sequencenumber: selSequenceNumber_1 }).then(function () {
                                        gridControl.refresh();
                                    });
                                });
                            });
                        });
                    }
                }
            };
            this.MoveRecordDown = function (gridEntityName, gridControl, selRecords) {
                var startIndex = gridControl.getFetchXml().indexOf("order attribute");
                var endIndex = gridControl.getFetchXml().indexOf("descending");
                var subString = gridControl.getFetchXml().substring(startIndex, endIndex);
                if (subString.indexOf("sequencenumber") == -1) {
                    Xrm.Navigation.openAlertDialog({
                        text: "Unable to move record as grid is in sort mode. Refresh the grid and try again" //todo: replace actual string
                    });
                }
                else {
                    var selRows_2 = [];
                    var nextRows_1 = [];
                    var allRows = gridControl.getGrid().getRows();
                    var selectedRows = gridControl.getGrid().getSelectedRows();
                    if (selectedRows.getLength() === 0)
                        return;
                    var rowData = selectedRows.getByIndex(0);
                    if (rowData === null)
                        return;
                    var entity = rowData.getData().getEntity();
                    if (entity === null)
                        return;
                    var selSequenceNumber_2 = entity.attributes.getByName("sequencenumber").getValue();
                    var selectedIndex = -1;
                    for (var index = 0; index < allRows.getLength(); index++) {
                        var currentRowId = allRows.getByIndex(index).getData().getEntity()._entityId.guid;
                        if (currentRowId === selRecords[0].Id) {
                            selectedIndex = index;
                        }
                    }
                    var nextRow = allRows.getByIndex(selectedIndex + 1);
                    var nextSequenceNumber_1 = nextRow.getData().getEntity().attributes.getByName("sequencenumber").getValue();
                    allRows.forEach(function (row, i) {
                        var rowEntity = row.getData().getEntity();
                        if (rowEntity !== null) {
                            var currentRowId = rowEntity._entityId.guid;
                            var currentRowSeqNumber = rowEntity.attributes.getByName("sequencenumber").getValue();
                            if (currentRowSeqNumber == selSequenceNumber_2) {
                                selRows_2.push(currentRowId);
                            }
                            else if (currentRowSeqNumber === nextSequenceNumber_1) {
                                nextRows_1.push(currentRowId);
                            }
                        }
                    });
                    if (selRows_2.length > 0 && nextRows_1.length > 0) {
                        var self_2 = this;
                        selRows_2.forEach(function (recId) {
                            Xrm.WebApi.online.updateRecord(gridEntityName, recId, { sequencenumber: nextSequenceNumber_1 }).then(function () {
                                nextRows_1.forEach(function (recId) {
                                    Xrm.WebApi.online.updateRecord(gridEntityName, recId, { sequencenumber: selSequenceNumber_2 }).then(function () {
                                        gridControl.refresh();
                                    });
                                });
                            });
                        });
                    }
                }
            };
            /**
            * To check if the product is exiting or write-in product
            */
            this.isExistingProduct = function () {
                var isProductOverridden = Xrm.Page.getAttribute("isproductoverridden");
                if (!ClientUtility.DataUtil.isNullOrUndefined(isProductOverridden)) {
                    return !isProductOverridden.getValue();
                }
                return true;
            };
            /**
            * To check if the product is exiting or write-in product on OQOI product subgrid
            */
            this.isExistingProductOnSubGrid = function (gridControl) {
                var isExistingProduct = true;
                // The below implementation assumes that the OOB fetch XML is in place,
                // which contains isproductoverridden attribute.
                if (!ClientUtility.DataUtil.isNullOrUndefined(gridControl)) {
                    var selectedRows = gridControl.getGrid().getSelectedRows();
                    if (selectedRows.getLength() != 0) {
                        var data = selectedRows.getByIndex(0).getData();
                        if (!ClientUtility.DataUtil.isNullOrUndefined(data)) {
                            var entity = data.getEntity();
                            if (!ClientUtility.DataUtil.isNullOrUndefined(entity)) {
                                var isProductOverridden = entity.attributes.getByName("isproductoverridden");
                                if (!ClientUtility.DataUtil.isNullOrUndefined(isProductOverridden)) {
                                    isExistingProduct = !isProductOverridden.getValue();
                                }
                            }
                        }
                    }
                }
                return isExistingProduct;
            };
            this.convertActivityActions = new ConvertActivityActions();
        }
        Object.defineProperty(SalesCommandBarActions.prototype, "cache", {
            get: function () {
                if (ClientUtility.DataUtil.isNullOrUndefined(this._cache)) {
                    this._cache = new Sales.CachedProperties();
                }
                return this._cache;
            },
            enumerable: true,
            configurable: true
        });
        ;
        SalesCommandBarActions.isSharepointEnabled = function (entityLogicalName) {
            return __awaiter(this, void 0, void 0, function () {
                var telemetryParams, isDocumentManagementEnabled, entityMetadata, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            telemetryParams = new Map();
                            isDocumentManagementEnabled = false;
                            if (!Xrm.Internal.isFeatureEnabled("SharePointS2S")) return [3 /*break*/, 4];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Xrm.Utility.getEntityMetadata(entityLogicalName)];
                        case 2:
                            entityMetadata = _a.sent();
                            isDocumentManagementEnabled = entityMetadata.IsDocumentManagementEnabled;
                            return [3 /*break*/, 4];
                        case 3:
                            error_3 = _a.sent();
                            telemetryParams.set("MethodName", "Sales.SalesCommandBarActions.isSharepointEnabled");
                            telemetryParams.set("IsDocumentManagementFlagEnabled", isDocumentManagementEnabled);
                            telemetryParams.set("EntityName", entityLogicalName);
                            telemetryParams.set("OperationType", "isSharepointEnabled");
                            telemetryParams.set("Error", error_3.message);
                            SalesCommandBarActions.logFailureSaveAndDownloadPDF(telemetryParams, "GetEntityMetadata call failed for " + { entityLogicalName: entityLogicalName });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, isDocumentManagementEnabled];
                    }
                });
            });
        };
        ;
        SalesCommandBarActions.prototype.retrieveSystemDocumentTemplates = function (entityTypeName, documentType) {
            var entityTypeCode = Xrm.Internal.getEntityCode(entityTypeName);
            var r = new ODataContract.RetrieveDocumentTemplatesRequest(entityTypeCode, documentType, "documenttemplate");
            var deferred = Xrm.WebApi.online.execute(r)
                .then(function (res) {
                return res.json();
            }).then(function (odataResponse) {
                var templates = odataResponse.value;
                var systemTemplates = [];
                for (var i = 0; i < templates.length; i++) {
                    var curT = { id: templates[i].documenttemplateid, name: templates[i].name, isSystemTemplate: true };
                    systemTemplates.push(curT);
                }
                return systemTemplates;
            }, function (error) {
                console.error(error);
            });
            return deferred;
        };
        SalesCommandBarActions.prototype.retrievePersonalDocumentTemplates = function (entityTypeName, documentType) {
            var entityTypeCode = Xrm.Internal.getEntityCode(entityTypeName);
            var fetchXml = "<fetch mapping='logical'> <entity name='personaldocumenttemplate'> <attribute name='personaldocumenttemplateid' /> <attribute name='name' /> <order attribute='createdon' descending='true' /><filter type = 'and'> <condition attribute='associatedentitytypecode' operator='eq' value='" + entityTypeCode + "' /> <condition attribute='documenttype' operator='eq' value='" + documentType + "' /> <condition attribute='status' operator= 'eq' value= '0' /> </filter> </entity> </fetch>";
            var deferred = Xrm.WebApi.online.retrieveMultipleRecords(Sales.EntityNames.PersonalDocumentTemplate, "?fetchXml=" + fetchXml)
                .then(function (response) {
                var personalTemplates = [];
                var templates = response.entities;
                for (var i = 0; i < templates.length; i++) {
                    var curT = { id: templates[i].personaldocumenttemplateid, name: templates[i].name, isSystemTemplate: false };
                    personalTemplates.push(curT);
                }
                return personalTemplates;
            }, function (error) {
                console.error(error);
            });
            return deferred;
        };
        /**
        Get Products dialog
        */
        SalesCommandBarActions.prototype.onLoadGetProductsDialog = function () {
            return __awaiter(this, void 0, void 0, function () {
                var opportunityLookupControl, opportunityLookupAttribute, opportunityLookup, opportunityId, productName;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            opportunityLookupControl = Xrm.Page.getControl(Sales.MetadataDrivenDialogConstantsGetProducts.OpportunityLookup);
                            this.addTransactionCurrencyParam(opportunityLookupControl, Sales.MetadataDrivenDialogConstantsGetProducts.TransactionCurrencyId);
                            return [4 /*yield*/, this.initializeGetProductsDialogLabels(opportunityLookupControl)];
                        case 1:
                            _a.sent();
                            opportunityLookupAttribute = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsGetProducts.OpportunityLookup);
                            opportunityLookup = {};
                            opportunityId = this.getGetProductsOpportunityId();
                            productName = this.getGetProductsName();
                            if (!ClientUtility.DataUtil.isNullOrEmptyString(opportunityId) && !ClientUtility.DataUtil.isNullOrEmptyString(productName)) {
                                opportunityLookup["entityType"] = Sales.EntityNames.Opportunity;
                                opportunityLookup["id"] = opportunityId;
                                opportunityLookup["name"] = productName;
                                opportunityLookupAttribute.setValue([opportunityLookup]);
                            }
                            opportunityLookupAttribute.addOnChange(this.updateGetProductsOkButtonState.bind(this));
                            this.updateGetProductsOkButtonState();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SalesCommandBarActions.prototype.initializeGetProductsDialogLabels = function (opportunityLookupControl) {
            return __awaiter(this, void 0, void 0, function () {
                var entityMetadata, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (ClientUtility.DataUtil.isNullOrUndefined(opportunityLookupControl)) {
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Xrm.Utility.getEntityMetadata(Sales.EntityNames.Opportunity)];
                        case 2:
                            entityMetadata = _a.sent();
                            if (ClientUtility.DataUtil.isNullOrEmptyString(entityMetadata.DisplayName)) {
                                return [2 /*return*/];
                            }
                            opportunityLookupControl.setLabel(entityMetadata.DisplayName);
                            return [3 /*break*/, 4];
                        case 3:
                            error_4 = _a.sent();
                            return [2 /*return*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SalesCommandBarActions.prototype.updateGetProductsOkButtonState = function () {
            var okControl = Xrm.Page.ui.controls.get(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
            if (ClientUtility.DataUtil.isNullOrUndefined(okControl)) {
                return;
            }
            var opportunityId = this.getIdFromLookupAttribute(Sales.MetadataDrivenDialogConstantsGetProducts.OpportunityLookup);
            okControl.setDisabled(ClientUtility.DataUtil.isNullOrEmptyString(opportunityId));
        };
        SalesCommandBarActions.prototype.getPageAttribute = function (attribute) {
            if (ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page)) {
                return null;
            }
            var pageAttribute = Xrm.Page.getAttribute(attribute);
            if (!!pageAttribute) {
                return pageAttribute;
            }
            var dataAttribute = Xrm.Page.data && Xrm.Page.data.attributes
                ? Xrm.Page.data.attributes.get(attribute)
                : null;
            if (!!dataAttribute) {
                return dataAttribute;
            }
            return Xrm.Page.data && Xrm.Page.data.entity && Xrm.Page.data.entity.attributes
                ? Xrm.Page.data.entity.attributes.get(attribute)
                : null;
        };
        SalesCommandBarActions.prototype.initializeDialogLabelsForCloseQuote = function () {
            this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsQuoteClose.Date, "Web.SFA.quotes.dlg_close.aspx_155");
            this.initializeEntityDisplayNameLabelsForCloseQuote();
        };
        SalesCommandBarActions.prototype.initializeEntityDisplayNameLabelsForCloseQuote = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result, quoteDisplayName, quoteDisplayNameLowerCase, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, Xrm.Utility.getEntityMetadata(Sales.EntityNames.Quote)];
                        case 1:
                            result = _a.sent();
                            quoteDisplayName = result.DisplayName;
                            quoteDisplayNameLowerCase = quoteDisplayName.toLocaleLowerCase();
                            this.setControlLabelTextFormatted(Sales.MetadataDrivenDialogConstantsQuoteClose.DialogTitle, "Close_Quote_Dlg_Title", quoteDisplayName);
                            this.setControlLabelTextFormatted(Sales.MetadataDrivenDialogConstantsQuoteClose.DialogDescription, "Close_Quote_Dlg_Desc", quoteDisplayNameLowerCase);
                            this.setControlLabelTextFormatted(Sales.MetadataDrivenDialogConstantsQuoteClose.CreateRevisedQuote, "Close_Quote_Create_Revised", quoteDisplayNameLowerCase);
                            return [3 /*break*/, 3];
                        case 2:
                            error_5 = _a.sent();
                            console.error(error_5);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        SalesCommandBarActions.prototype.setControlLabelTextFormatted = function (controlId, resourceId, displayName) {
            var control = Xrm.Page.getControl(controlId);
            if (!ClientUtility.DataUtil.isNullOrUndefined(control)) {
                var label = Sales.StringProvider.getResourceString(resourceId);
                control.setLabel(String.format(label, displayName));
            }
        };
        SalesCommandBarActions.prototype.openTimelineActivityRecord = function (selectedChatRecord, primaryControl) {
            if (selectedChatRecord.length === 1 && selectedChatRecord[0].Id) {
                var entityDialogOptions = {};
                entityDialogOptions["entityName"] = selectedChatRecord[0].TypeName;
                entityDialogOptions["entityId"] = selectedChatRecord[0].Id;
                this.handleConversationRecord(selectedChatRecord, null, entityDialogOptions);
            }
            else {
                Xrm.Reporting.reportFailure("SalesCommandBarActions_SidePaneConversationControl", Error("Error: Bulk onclick operation not supported"));
            }
        };
        /**
         * Function for retrieving teams chat id for the selected chat activity.
         * @param {string} chatActivityId selected record
         * @returns {Promise<string>} Promise object represents the teams chat id
         */
        SalesCommandBarActions.prototype.getTeamsChatId = function (chatActivityId) {
            return __awaiter(this, void 0, void 0, function () {
                var filter, entity, error_6, errorMessage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filter = "?$select=teamschatid";
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Xrm.WebApi.retrieveRecord(Sales.EntityNames.Chat, chatActivityId, filter)];
                        case 2:
                            entity = _a.sent();
                            return [2 /*return*/, entity["teamschatid"]];
                        case 3:
                            error_6 = _a.sent();
                            errorMessage = "Unable to fetch Teams chat id value";
                            Xrm.Reporting.reportFailure(errorMessage, Error(errorMessage + ("" + error_6)));
                            throw error_6;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * WIP: Open chat window
         * @param {XrmClientApi.Commanding.EntityReference} record selected record
         * @returns
         */
        SalesCommandBarActions.prototype.openChatWindow = function (record) {
            return __awaiter(this, void 0, void 0, function () {
                var uciTeamsClient, teamsChatId, embedClient, conversations, conversation, _a, teamsChatId;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            uciTeamsClient = window.top._UCITeamsClient;
                            if (!(uciTeamsClient && uciTeamsClient.getEmbedClient && record && record.Id)) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.getTeamsChatId(record.Id)];
                        case 1:
                            teamsChatId = _b.sent();
                            if (!teamsChatId) return [3 /*break*/, 5];
                            return [4 /*yield*/, uciTeamsClient.getEmbedClient()];
                        case 2:
                            embedClient = _b.sent();
                            return [4 /*yield*/, embedClient.conversations.get()];
                        case 3:
                            conversations = _b.sent();
                            return [4 /*yield*/, conversations.getConversationById(teamsChatId)];
                        case 4:
                            conversation = _b.sent();
                            conversation.render();
                            return [3 /*break*/, 6];
                        case 5:
                            Xrm.Reporting.reportFailure("openChatWindow", Error("Error: Could not fetch teams chat Id"));
                            _b.label = 6;
                        case 6: return [3 /*break*/, 16];
                        case 7:
                            _a = record && record.Id;
                            if (!_a) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.IsSaleSettingCollaborationEnabled()];
                        case 8:
                            _a = (_b.sent());
                            _b.label = 9;
                        case 9:
                            if (!_a) return [3 /*break*/, 15];
                            return [4 /*yield*/, this.getTeamsChatId(record.Id)];
                        case 10:
                            teamsChatId = _b.sent();
                            if (!teamsChatId) return [3 /*break*/, 13];
                            if (!!window.top.collabSDKClient) return [3 /*break*/, 12];
                            return [4 /*yield*/, this.setSalesCollabSDKClient()];
                        case 11:
                            _b.sent();
                            _b.label = 12;
                        case 12:
                            window.top.collabSDKClient.openChatById(teamsChatId);
                            return [3 /*break*/, 14];
                        case 13:
                            Xrm.Reporting.reportFailure("openChatWindow", Error("Error: Could not fetch teams chat Id"));
                            _b.label = 14;
                        case 14:
                            this.removeCollabSDKEventListener();
                            return [3 /*break*/, 16];
                        case 15:
                            Xrm.Reporting.reportFailure("openChatWindow", Error("Error: UCI teams client not found"));
                            _b.label = 16;
                        case 16: return [2 /*return*/];
                    }
                });
            });
        };
        /*
         * Function for checking If Oct 2023 FCB is enabled
         */
        SalesCommandBarActions.isOct2023FCBOn = function () {
            return Xrm.Internal.isFeatureEnabled("October2023Update");
        };
        /*
         * Function for checking If given FCS is enabled
         */
        SalesCommandBarActions.isFCSOn = function (fcsNamespace, settingKey) {
            var fcsValue = (Xrm.Utility.getGlobalContext()).getFeatureControlSetting(fcsNamespace, settingKey);
            if (fcsValue !== null || fcsValue !== undefined) {
                // Found the feature
                return fcsValue;
            }
            return false;
        };
        /*
        * Function for checking If Default on EmbedAppSetting is enabled
        */
        SalesCommandBarActions.isEmbedAppSettingOn = function () {
            return Xrm.Utility.getGlobalContext().getCurrentAppSetting("msdyn_IsTeamsDynamicsIntegrationEnabled");
        };
        /**
         * Function for checking if teams chat in sales team setting page is enabled.
         */
        SalesCommandBarActions.prototype.IsSaleSettingCollaborationEnabled = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isSalesTeamsChatIntegrationEnabled, msTeamsSettingsV2Response, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            isSalesTeamsChatIntegrationEnabled = false;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            if (!(SalesCommandBarActions.isOct2023FCBOn() && SalesCommandBarActions.isFCSOn(SalesCommandBarActions.FCSNamespaceForTeamsIntegration, SalesCommandBarActions.FCSSettingKeyForTeamsConfig))) return [3 /*break*/, 2];
                            isSalesTeamsChatIntegrationEnabled = SalesCommandBarActions.isEmbedAppSettingOn();
                            return [3 /*break*/, 5];
                        case 2:
                            if (!(this.IsSessionStorageEnabled() &&
                                sessionStorage.getItem(this.EmbedcollabSettingAttributeLogicalName) != null)) return [3 /*break*/, 3];
                            return [2 /*return*/, sessionStorage.getItem(this.EmbedcollabSettingAttributeLogicalName) === "true"];
                        case 3: return [4 /*yield*/, Xrm.WebApi.retrieveMultipleRecords("msdyn_msteamssettingsv2", "?$select=" + this.EmbedcollabSettingAttributeLogicalName)];
                        case 4:
                            msTeamsSettingsV2Response = _a.sent();
                            if (msTeamsSettingsV2Response &&
                                msTeamsSettingsV2Response.entities &&
                                msTeamsSettingsV2Response.entities.length > 0) {
                                isSalesTeamsChatIntegrationEnabled =
                                    msTeamsSettingsV2Response.entities[0].msdyn_embedcollabteamsintegrationenabled;
                            }
                            if (this.IsSessionStorageEnabled()) {
                                sessionStorage.setItem(this.EmbedcollabSettingAttributeLogicalName, isSalesTeamsChatIntegrationEnabled.toString());
                            }
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            err_1 = _a.sent();
                            Xrm.Reporting.reportFailure("Embed collab setting - Retrieve value", Error("Unable to fetch embed-collab setting value" + ("" + err_1.Message)));
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/, isSalesTeamsChatIntegrationEnabled];
                    }
                });
            });
        };
        /**
         * Function for setting sales collab sdk client if not defined.
         */
        SalesCommandBarActions.prototype.setSalesCollabSDKClient = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!window.top.collabSDK) return [3 /*break*/, 1];
                            window.top.addEventListener(this.CollabSDKEventListenerType, this.createSalesCollabSDKClient.bind(this));
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, this.createSalesCollabSDKClient()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Function for creating sales collab sdk client.
         */
        SalesCommandBarActions.prototype.createSalesCollabSDKClient = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, window.top.collabSDK.createSDKClient({ hostCtx: "Chat Activity" }).then(function (clt) {
                                window.top.collabSDKClient = clt;
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Function for checking if session storage is enabled
         */
        SalesCommandBarActions.prototype.IsSessionStorageEnabled = function () {
            return sessionStorage !== null || sessionStorage !== undefined;
        };
        /**
         * Function for removing collab sdk event listener.
         */
        SalesCommandBarActions.prototype.removeCollabSDKEventListener = function () {
            window.top.removeEventListener(this.CollabSDKEventListenerType, this.createSalesCollabSDKClient);
        };
        /**
         * Function for checking if sales SMS create textmessage button is enabled
         */
        SalesCommandBarActions.prototype.CanCreateSalesSmsFromActivity = function () {
            return !!Xrm.Utility.getGlobalContext().getCurrentAppSetting("msdyn_EnableSalesSMSAfterAddingProvider") && !!Xrm.Utility.getGlobalContext().getCurrentAppSetting("msdyn_EnableSMSButtonInActivity");
        };
        SalesCommandBarActions.prototype.handleConversationRecord = function (records, gridControl, entityDialogOptions) {
            var _this = this;
            Xrm.WebApi.retrieveMultipleRecords("msdyn_ocliveworkitem", "?fetchXml=" + this.getFetchXmlForSalesLiveWorkItem(records[0].Id))
                .then(function (response) {
                if (response && response.entities && response.entities.length == 1 && !Xrm.Utility.getGlobalContext().getCurrentAppSetting("msdyn_DisableSMSFeatureInSales")) {
                    var regardingEntityId = response.entities[0]["_regardingobjectid_value"];
                    var regardingEntityName = response.entities[0]["_regardingobjectid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                    var regardingRecordName = response.entities[0]["_regardingobjectid_value@OData.Community.Display.V1.FormattedValue"];
                    var ownerId = response.entities[0]["_ownerid_value"];
                    if (regardingEntityName == "opportunity") {
                        regardingRecordName = "";
                    }
                    if (regardingEntityId && regardingEntityName && ownerId) {
                        Sales.loadSidePaneConversationControl(regardingRecordName, regardingEntityId, regardingEntityName, ownerId, records[0].Id);
                    }
                    else {
                        Xrm.Reporting.reportFailure("SalesCommandBarActions_SidePaneConversationControl", Error("Error: Could not fetch activity's regarding entity attributes"));
                        _this.handleOpenConversationActivityRecord(gridControl, records, entityDialogOptions, false);
                    }
                    return;
                }
                Xrm && Xrm.Reporting && Xrm.Reporting.reportSuccess("SalesCommandBarActions_openGridActivityRecord: condition not satisfied for sales app conversation overrides");
                _this.handleOpenConversationActivityRecord(gridControl, records, entityDialogOptions, false);
            }, function (error) {
                Xrm && Xrm.Reporting && Xrm.Reporting.reportFailure("SalesCommandBarActions_openGridActivityRecord_msdyn_ocliveworkitem_retrieve", error);
                _this.handleOpenConversationActivityRecord(gridControl, records, entityDialogOptions, false);
            });
        };
        SalesCommandBarActions.prototype.showOldAddProductsExperience = function () {
            return !this.isNewAddProductsExperienceEnabled();
        };
        SalesCommandBarActions.prototype.isAndroid = function () {
            var rawValue = window.navigator.userAgent;
            //checks whether the browser is running on Android
            var isAndroid = rawValue.indexOf("Android") !== -1 && window.navigator.appVersion.indexOf("Win") === -1;
            return isAndroid;
        };
        SalesCommandBarActions.prototype.isIPhone_IPad = function () {
            var rawValue = window.navigator.userAgent;
            var isIPhone = rawValue.indexOf("iPhone") !== -1;
            // checks whether the browser is running in iPad
            var isIPad = rawValue.indexOf("iPad") !== -1;
            /*
             IPad pro 9.1 and 9.2 before beta 4 is having external issue with user agent string (TFS 268384) which
             returns "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13B143 OAuth MSAuthHost"
             as raw userAgent value and causes userAgent to identify it as iPhone https://forums.developer.apple.com/thread/25948
             So add additional logic to identify iPad pro with IOS 9.1/9.2 as iPad instead of iPhone
            */
            if (isIPhone && window.navigator.platform === "iPad" && (rawValue.indexOf("9_1") !== -1 || rawValue.indexOf("9_2") !== -1)) {
                isIPhone = false;
                isIPad = true;
            }
            return isIPhone || isIPad ? true : false;
        };
        SalesCommandBarActions.prototype.isNewAddProductsExperienceEnabled = function () {
            var entityName = Xrm.Page.data.entity.getEntityName();
            // Disable Anchanced Add Products Experience in other than OQOI Entities
            if (!(entityName === Sales.EntityNames.Opportunity || entityName === Sales.EntityNames.Quote
                || entityName === Sales.EntityNames.SalesOrder || entityName === Sales.EntityNames.Invoice)) {
                return false;
            }
            var isMobileEnvironment = Xrm.Utility.getGlobalContext().client.getClient() == Xrm.Constants.ClientNames.mobile;
            if (!isMobileEnvironment && ((Xrm.Utility.getGlobalContext().client.getFormFactor() != 1 || this.isAndroid() || this.isIPhone_IPad()))) {
                isMobileEnvironment = true;
            }
            var isOrganizationSettingsEnabled = true;
            var offset = 225;
            var limitedHeight = 300;
            var limitedWidth = 500;
            var pageHeight = Xrm.Page.ui.getViewPortHeight() + offset;
            var pageWidth = Xrm.Page.ui.getViewPortWidth();
            var attributes = Xrm.Utility.getGlobalContext().organizationSettings.attributes;
            if (!ClientUtility.DataUtil.isNullOrUndefined(attributes) &&
                !ClientUtility.DataUtil.isNullOrUndefined(attributes['isnewaddproductexperienceenabled'])) {
                isOrganizationSettingsEnabled = attributes['isnewaddproductexperienceenabled'] == 1 ? true : false;
            }
            return (Xrm.Internal.isUci() &&
                Xrm.Internal.isFeatureEnabled("NewAddProductExperienceEnabled") &&
                isOrganizationSettingsEnabled &&
                (!isMobileEnvironment) && pageHeight > limitedHeight && pageWidth > limitedWidth);
        };
        SalesCommandBarActions.prototype.openAddProductsToOQOIDialog = function (formContext) {
            // below condition to prevent multiple dialogs from opening when button is clicked multiple times
            if (this.isAddProductsDialogOpen)
                return;
            this.isAddProductsDialogOpen = true;
            // Check if the form has dirty changes. If so, trigger save before opening dialog
            if (formContext.data.getIsDirty && formContext.data.getIsDirty()) {
                formContext.data.save().then(this.openAddProductsDialog.bind(this, formContext), this.addProductsDialogOpenErrorHandler.bind(this));
            }
            else {
                this.openAddProductsDialog(formContext);
            }
        };
        SalesCommandBarActions.prototype.openAddProductsDialog = function (formContext) {
            try {
                if (Sales.LineItemUtil.IsPriceListMandatory() &&
                    (formContext.getAttribute('pricelevelid') == null ||
                        formContext.getAttribute('pricelevelid').getValue() == null ||
                        formContext.getAttribute('pricelevelid').getValue().length == 0)) {
                    this.isAddProductsDialogOpen = false;
                    Xrm.Navigation.openAlertDialog({ text: Sales.StringProvider.getResourceString("Web.SFA.quotes.edit.aspx_155") });
                    return;
                }
                else {
                    var dialogParams = {};
                    dialogParams["param_entityName"] = formContext.data.entity.getEntityName();
                    dialogParams["param_recordId"] = formContext.data.entity.getId();
                    dialogParams["param_recordName"] = formContext.data.entity.getPrimaryAttributeValue();
                    var priceLevelAttrVal = formContext.getAttribute('pricelevelid') && formContext.getAttribute('pricelevelid').getValue();
                    if (priceLevelAttrVal && priceLevelAttrVal.length > 0) {
                        dialogParams["param_priceLevelId"] = priceLevelAttrVal[0].id;
                    }
                    if (formContext.getAttribute('ispricelocked')) {
                        dialogParams["param_ispricelocked"] = formContext.getAttribute('ispricelocked').getValue();
                    }
                    var transactionCurrencyAttrVal = formContext.getAttribute('transactioncurrencyid') && formContext.getAttribute('transactioncurrencyid').getValue();
                    if (transactionCurrencyAttrVal && transactionCurrencyAttrVal.length > 0) {
                        dialogParams["param_transactionCurrencyId"] = transactionCurrencyAttrVal[0].id;
                    }
                    var options = null;
                    // Enabling the new experience by default. TODO - Remove the previous version's code
                    var enablePreviewFeatures = true; // Xrm.Internal.isFeatureEnabled("AddProductsPreview");
                    if (enablePreviewFeatures) {
                        options = {
                            position: 1 /* center */,
                            height: "90%",
                            width: "90%" // Using any since string type is not present in the type definition of DialogOptions however UCI supports this internally
                        };
                    }
                    else {
                        options = {
                            position: 2 /* side */,
                            height: 600,
                            width: 650
                        };
                    }
                    //AddProductInOpportunity is the name of the generic dialog  which opens in case of add product experience all OQOI
                    Xrm.Navigation.openDialog("AddProductInOpportunity", options, dialogParams).then(this.onAddProductsDialogOpenResolved.bind(this), this.addProductsDialogOpenErrorHandler.bind(this));
                }
            }
            catch (error) {
                this.addProductsDialogOpenErrorHandler(error);
            }
        };
        SalesCommandBarActions.prototype.onAddProductsDialogOpenResolved = function (context) {
            Xrm.Utility.closeProgressIndicator();
            this.isAddProductsDialogOpen = false;
            //Prevent  products sub grid refresh on Cancel/Close
            if (context.parameters["param_lastButtonClicked"] != undefined && context.parameters["param_lastButtonClicked"] == "ok_id") {
                Xrm.Page.data.refresh();
            }
        };
        SalesCommandBarActions.prototype.addProductsDialogOpenErrorHandler = function (error) {
            this.isAddProductsDialogOpen = false;
            ClientUtility.ActionFailedHandler.actionFailedCallback(error);
        };
        return SalesCommandBarActions;
    }());
    SalesCommandBarActions.FCSNamespaceForTeamsIntegration = "DynamicsTeamsIntegration.TeamsEmbedOP";
    SalesCommandBarActions.FCSSettingKeyForTeamsConfig = "TeamsEmbedAppLevelConfig";
    SalesCommandBarActions.FCSNameSpaceForPriceCalc = "CoreSales.PriceCalculation";
    SalesCommandBarActions.FCSSettingKeyForDateAdjustmentOnOrderCreation = "EnableCloseDateAdjustmentOnOrderCreation";
    /**
    * Private function to download PDF file from server using ExportPDFDocument SDK.
    */
    SalesCommandBarActions.downloadPDFFile = function (entityTypeCode, templateRef, recordsString, filename) {
        var telemetryParams = new Map();
        var entityLogicalName = Xrm.Internal.getEntityName(entityTypeCode);
        telemetryParams.set("MethodName", "Sales.SalesCommandBarActions.downloadPDFFile");
        telemetryParams.set("EntityName", entityLogicalName);
        telemetryParams.set("OperationType", "PDFGeneration.DownloadPDF");
        var openMode = { openMode: 2 /* save */ };
        var exportPDFDocumentRequest = new ODataContract.ExportPDFDocumentRequest(entityTypeCode, templateRef, recordsString);
        Xrm.Utility.showProgressIndicator(Sales.StringProvider.getResourceString("Sales_GeneratePDF"));
        Xrm.WebApi.online.execute(exportPDFDocumentRequest).then(function (response) {
            if (response) {
                response.json().then(function (odataResponse) {
                    ClientUtility.DialogUtil.hideProgressMessage();
                    var pdfFile = {
                        fileContent: odataResponse.PdfFile,
                        fileName: filename + ".pdf",
                        mimeType: "application/pdf"
                    };
                    Xrm.Navigation.openFile(pdfFile, openMode).then(function () {
                        ClientUtility.DialogUtil.showGlobalToastNotification(String.format(Sales.StringProvider.getResourceString("Sales_CreatePDF_Downloaded_Notification"), filename));
                    });
                    telemetryParams.set("SdkName", "ExportPDFDocument");
                    telemetryParams.set("Success", "Successfully Downloaded PDF document for " + entityLogicalName);
                    SalesCommandBarActions.logSuccessSaveAndDownloadPDF(telemetryParams, "PDFGeneration.DownloadPDFFile");
                }, function (error) {
                    ClientUtility.DialogUtil.hideProgressMessage();
                    ClientUtility.ActionFailedHandler.actionFailedCallbackForWebAPI(error);
                });
            }
        }, function (error) {
            ClientUtility.DialogUtil.hideProgressMessage();
            ClientUtility.ActionFailedHandler.actionFailedCallbackForWebAPI(error);
        });
    };
    /**
    * Private function to save PDF file in sharepoint using SaveEntityDocumentToSharePointRequest SDK.
    */
    SalesCommandBarActions.saveEntityDocumentToSharePoint = function (formContext, entityTypeCode, templateRef, recordsString, entityRef, entityRecordName, fileName) {
        var telemetryParams = new Map();
        var saveEntityDocumentToSharePointRequest = new ODataContract.SaveEntityDocumentToSharePointRequest(entityTypeCode, templateRef, recordsString, entityRef, entityRecordName);
        var entityLogicalName = Xrm.Internal.getEntityName(entityTypeCode);
        telemetryParams.set("MethodName", "Sales.SalesCommandBarActions.saveEntityDocumentToSharePoint");
        telemetryParams.set("EntityName", entityLogicalName);
        telemetryParams.set("OperationType", "PDFGeneration.SaveEntityDocumentToSharePoint");
        if (ClientUtility.DataUtil.isNullOrUndefined(entityRecordName)) {
            telemetryParams.set("Error", "PrimaryNameAttribute is null or undefined for " + { entityLogicalName: entityLogicalName });
            SalesCommandBarActions.logFailureSaveAndDownloadPDF(telemetryParams, "PrimaryNameAttribute retrival call failed for " + { entityLogicalName: entityLogicalName }, "PDFGeneration.SaveEntityDocumentToSharePoint");
            return;
        }
        Xrm.Utility.showProgressIndicator(Sales.StringProvider.getResourceString("Sales_CreatePDF_SaveToSharepoint"));
        Xrm.WebApi.online.execute(saveEntityDocumentToSharePointRequest).then(function (response) {
            if (response) {
                response.json().then(function (documentLocationId) {
                    ClientUtility.DialogUtil.hideProgressMessage();
                    if (!ClientUtility.DataUtil.isNullOrUndefined(documentLocationId.id) && documentLocationId.id.length > 0 && documentLocationId.id !== ClientUtility.Guid.Empty) {
                        ClientUtility.DialogUtil.showGlobalToastNotification(String.format(Sales.StringProvider.getResourceString("Sales_CreatePDF_SaveToSharePoint_Notification"), fileName));
                        telemetryParams.set("SdkName", "SaveEntityDocumentToSharePoint");
                        telemetryParams.set("Success", "Successfully Saved PDF document to sharepoint for " + entityLogicalName);
                        SalesCommandBarActions.logSuccessSaveAndDownloadPDF(telemetryParams, "PDFGeneration.SaveEntityDocumentToSharePoint");
                    }
                    else {
                        telemetryParams.set("SharepointDocumentLocationId", documentLocationId);
                        telemetryParams.set("Error", "SharepointDocumentLocationId is null or undefined, hence cannot save document to sharepoint for " + { entityLogicalName: entityLogicalName });
                        SalesCommandBarActions.logFailureSaveAndDownloadPDF(telemetryParams, "SaveEntityDocumentToSharePoint API call failed for " + { entityLogicalName: entityLogicalName }, "PDFGeneration.SaveEntityDocumentToSharePoint");
                        ClientUtility.ActionFailedHandler.showGenericError("Document LocationId is invalid or null. Cannot save document to sharepoint.");
                    }
                }, function (error) {
                    ClientUtility.DialogUtil.hideProgressMessage();
                    ClientUtility.ActionFailedHandler.actionFailedCallbackForWebAPI(error);
                });
            }
        }, function (error) {
            ClientUtility.DialogUtil.hideProgressMessage();
            ClientUtility.ActionFailedHandler.actionFailedCallbackForWebAPI(error);
        });
    };
    /**
    * Private function to attach PDF file in note using SaveEntityDocumentAsAttachmentToNoteRequest SDK.
    */
    SalesCommandBarActions.saveEntityDocumentAsAttachmentToNote = function (formContext, entityTypeCode, templateRef, recordsString, entityRef, filename) {
        var telemetryParams = new Map();
        var entityLogicalName = Xrm.Internal.getEntityName(entityTypeCode);
        telemetryParams.set("MethodName", "Sales.SalesCommandBarActions.saveEntityDocumentAsAttachmentToNote");
        telemetryParams.set("EntityName", entityLogicalName);
        telemetryParams.set("OperationType", "PDFGeneration.SaveEntityDocumentAsAttachmentToNote");
        var saveEntityDocumentAsAttachmentToNoteRequest = new ODataContract.SaveEntityDocumentAsAttachmentToNoteRequest(entityTypeCode, templateRef, recordsString, entityRef);
        Xrm.Utility.showProgressIndicator(Sales.StringProvider.getResourceString("Sales_CreatePDF_AttachPDFToNote"));
        Xrm.WebApi.online.execute(saveEntityDocumentAsAttachmentToNoteRequest).then(function (response) {
            if (response) {
                response.json().then(function (annotationid) {
                    ClientUtility.DialogUtil.hideProgressMessage();
                    if (!ClientUtility.DataUtil.isNullOrUndefined(annotationid.id) && annotationid.id.length > 0 && annotationid.id !== ClientUtility.Guid.Empty) {
                        ClientUtility.DialogUtil.showGlobalToastNotification(String.format(Sales.StringProvider.getResourceString("Sales_CreatePDF_SavePDFAsAttachmentToNote_Notification"), filename));
                        var timelineControl = !ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.ui.controls) ? Xrm.Page.ui.controls.get("Timeline") : null;
                        if (ClientUtility.ClientUtil.isUCI() && !ClientUtility.DataUtil.isNullOrUndefined(timelineControl)) {
                            timelineControl.refresh();
                        }
                        telemetryParams.set("SdkName", "SaveEntityDocumentAsAttachmentToNote");
                        telemetryParams.set("Success", "Successfully Saved PDF document to Timeline for " + entityLogicalName);
                        SalesCommandBarActions.logSuccessSaveAndDownloadPDF(telemetryParams, "PDFGeneration.SaveEntityDocumentAsAttachmentToNote");
                    }
                    else {
                        telemetryParams.set("AnnotationId", annotationid);
                        telemetryParams.set("Error", "AnnotationId is null or undefined, hence cannot save PDF document to Timeline for " + { entityLogicalName: entityLogicalName });
                        SalesCommandBarActions.logFailureSaveAndDownloadPDF(telemetryParams, "SaveEntityDocumentAsAttachmentToNote API call failed for " + { entityLogicalName: entityLogicalName }, "PDFGeneration.SaveEntityDocumentAsAttachmentToNote");
                        ClientUtility.ActionFailedHandler.showGenericError("Annotation Id field is null. Cannot save document to timeline.");
                    }
                }, function (error) {
                    ClientUtility.DialogUtil.hideProgressMessage();
                    ClientUtility.ActionFailedHandler.actionFailedCallbackForWebAPI(error);
                });
            }
        }, function (error) {
            ClientUtility.DialogUtil.hideProgressMessage();
            ClientUtility.ActionFailedHandler.actionFailedCallbackForWebAPI(error);
        });
    };
    SalesCommandBarActions.logSuccessActivityMgmt = function (operationType, entityName, entityId) {
        if (Xrm.Reporting != null) {
            var eventParams = [{ name: "OperationType", value: operationType }, { name: "EntityName", value: entityName }];
            entityId && eventParams.push({ name: "EntityId", value: entityId });
            Xrm.Reporting.reportSuccess("ActivityMgmtApril2020UpdateMFD", eventParams);
        }
    };
    SalesCommandBarActions.logFailureActivityMgmt = function (operationType, entityName, entityId) {
        if (Xrm.Reporting != null) {
            var eventParams = "Failed to Launch " + operationType + " of OOB Activity Type : " + entityName;
            if (entityId) {
                eventParams = eventParams + ("and entityId " + entityId);
            }
            Xrm.Reporting.reportFailure("ActivityMgmtApril2020UpdateMFD", Error(eventParams));
        }
    };
    SalesCommandBarActions.logSuccessSaveAndDownloadPDF = function (params, componentName) {
        try {
            if (Xrm.Reporting != null) {
                var eventParameters = [];
                params.forEach(function (val, key) {
                    eventParameters.push({ name: key, value: val });
                });
                componentName = componentName != null ? componentName : "PDFGenerationApril2020Update";
                Xrm.Reporting.reportSuccess(componentName, eventParameters);
            }
        }
        catch (error) {
            console.log("Telemetry call is failing with", { error: error });
        }
    };
    SalesCommandBarActions.logFailureSaveAndDownloadPDF = function (params, errorMsg, componentName) {
        try {
            if (Xrm.Reporting != null) {
                var eventParameters = [];
                params.forEach(function (val, key) {
                    eventParameters.push({ name: key, value: val });
                });
                componentName = componentName != null ? componentName : "PDFGenerationApril2020Update";
                var suggestedMitigation = "";
                var errorObj = new Error(errorMsg);
                Xrm.Reporting.reportFailure(componentName, errorObj, suggestedMitigation, eventParameters);
            }
        }
        catch (error) {
            console.log("Telemetry call is failing with", { error: error });
        }
    };
    Sales.SalesCommandBarActions = SalesCommandBarActions;
    var ConvertActivityActions = (function () {
        function ConvertActivityActions() {
            var _this = this;
            this.entityName = null;
            this.convertActivityOnLoad = function (context) {
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                var activityTypeAttribute = Xrm.Page.data.attributes.get(ClientUtility.MetadataDrivenDialogConstants.EntityTypeCode);
                if (!ClientUtility.DataUtil.isNullOrUndefined(activityTypeAttribute)) {
                    var activityType = activityTypeAttribute.getValue();
                    var labelControl = Xrm.Page.getControl(Sales.MetadataDrivenDialogConstants.SaveActivityId);
                    if (!ClientUtility.DataUtil.isNullOrUndefined(labelControl)) {
                        if (activityType === Sales.EntityTypeCodes.Email) {
                            labelControl.setLabel(Sales.StringProvider.getResourceString("ConvertActivity_Action_CloseEmail"));
                        }
                        else {
                            labelControl.setLabel(String.format(Sales.StringProvider.getResourceString("ConvertActivity_Action_SaveActivity"), Sales.ClientUtil.getEntityName(activityType)));
                        }
                    }
                }
                if (!ClientUtility.ClientUtil.isMobileOffline() || Xrm.Mobile.offline.isOfflineEnabled(Sales.EntityNames.Lead)) {
                    var entityAttribute = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstants.LeadId);
                    if (!ClientUtility.DataUtil.isNullOrUndefined(entityAttribute)) {
                        var leadId = entityAttribute.getValue();
                        if (!ClientUtility.DataUtil.isNullOrUndefined(leadId) && leadId.length) {
                            var leadLookup = Xrm.Page.getControl(Sales.MetadataDrivenDialogConstants.LeadLookup);
                            if (!ClientUtility.DataUtil.isNullOrUndefined(leadLookup)) {
                                leadLookup.setVisible(true);
                            }
                        }
                    }
                }
                var subjectAttribute = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstants.Subject);
                if (!ClientUtility.DataUtil.isNullOrUndefined(subjectAttribute)) {
                    var subject = subjectAttribute.getValue();
                    if (ClientUtility.DataUtil.isNullOrUndefined(subject) || !subject.length) {
                        var subjectControl = Xrm.Page.getControl(Sales.MetadataDrivenDialogConstants.Subject);
                        if (!ClientUtility.DataUtil.isNullOrUndefined(subjectControl)) {
                            subjectControl.setDisabled(true);
                        }
                    }
                }
                var currencyId = Xrm.Page.ui.controls.get(Sales.MetadataDrivenDialogConstants.CurrencyLookup);
                var currencyLookupValueId = ClientUtility.DialogUtil.getAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.CurrencyId);
                if (ClientUtility.ClientUtil.isMobileOffline()) {
                    ClientUtility.PageUtil.setControlValue(Sales.MetadataDrivenDialogConstants.CurrencyLookup, [Xrm.Utility.getGlobalContext().userSettings.transactionCurrency]);
                }
                else if (!ClientUtility.DataUtil.isNullOrUndefined(currencyLookupValueId)) {
                    Xrm.WebApi.retrieveRecord(Sales.EntityNames.TransactionCurrency, currencyLookupValueId, ClientUtility.ODataUtil.getSelectOption(["currencyname"]))
                        .then((function (retrieveResponse) {
                        var defaultCurrencyLookup = {
                            id: retrieveResponse.transactioncurrencyid,
                            name: retrieveResponse.currencyname,
                            entityType: Sales.EntityNames.TransactionCurrency
                        };
                        ClientUtility.PageUtil.setControlValue(Sales.MetadataDrivenDialogConstants.CurrencyLookup, [defaultCurrencyLookup]);
                    }));
                }
                var currencyIdLookUpChange = function (context) {
                    var currencyLookUpControlValue = ClientUtility.DialogUtil.getControlValue(Sales.MetadataDrivenDialogConstants.CurrencyLookup);
                    if (!ClientUtility.DataUtil.isNullOrUndefined(currencyLookUpControlValue) && !ClientUtility.DataUtil.isNullOrUndefined(currencyLookUpControlValue[0].id)) {
                        _this.addFilter(currencyId, currencyLookUpControlValue[0].id, "transactioncurrencyid");
                    }
                };
                if (!ClientUtility.DataUtil.isNullOrUndefined(currencyId)) {
                    currencyId.addPreSearch(currencyIdLookUpChange);
                }
                var customerId = Xrm.Page.ui.controls.get(Sales.MetadataDrivenDialogConstants.CustomerLookup);
                var customerLookupValue = ClientUtility.DialogUtil.getAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.CustomerId);
                if (!ClientUtility.DataUtil.isNullOrUndefined(customerLookupValue)) {
                    ClientUtility.PageUtil.setControlValue(Sales.MetadataDrivenDialogConstants.CustomerLookup, [customerLookupValue]);
                }
            };
            this.addFilter = function (lookup, lookupValueid, attribute) {
                var idAttribute = attribute ? attribute : "id";
                var fetchXml = ClientUtility.StringUtil.format('<filter type="and"><condition attribute="{0}" operator="eq" value="{1}" /></filter>', idAttribute, lookupValueid);
                lookup.addCustomFilter(fetchXml);
            };
            this.getTransactionCurrency = function (callback) {
                if (ClientUtility.ClientUtil.isMobileOffline()) {
                    //TODO: 409553
                    var currencyValues = Xrm.Utility.getGlobalContext().userSettings.transactionCurrencyId;
                    callback();
                }
                else {
                    var that = _this;
                    var retrieveUserDefaultCurrencyRequest = new ODataContract.RetrieveUserDefaultCurrencyRequest();
                    retrieveUserDefaultCurrencyRequest.entityset = "transactioncurrency";
                    Xrm.WebApi.online.execute(retrieveUserDefaultCurrencyRequest).then(function (r) {
                        r.json().then(function (response) {
                            if (!ClientUtility.DataUtil.isNullOrUndefined(response)) {
                                var currencyValues = response.transactioncurrencyid;
                                callback(currencyValues);
                            }
                        });
                    });
                }
            };
            this.convertActivityClick = function (context) {
                var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
                var entityTypeCode = parseInt(formContext.data.attributes.get(ClientUtility.MetadataDrivenDialogConstants.paramEntityTypeCode).getValue().toString());
                if (ClientUtility.ClientUtil.isMobileOffline()) {
                    _this.entityName = Sales.ClientUtil.getEntityName(entityTypeCode);
                    if (!Xrm.Mobile.offline.isOfflineEnabled(_this.entityName)) {
                        ClientUtility.DialogUtil.showMoCAOfflineError();
                        return;
                    }
                }
                var errorString = { text: "", confirmButtonLabel: "OK" };
                var currency = null;
                var customer = null;
                var campaignId = "";
                var subject = "";
                var entityId = "";
                var ownerId = "";
                var ownerTypeCode = 0;
                var ownerName = "";
                var leadId = "";
                var saveActivity = "false";
                var openNewRecord = "false";
                var entityName = "";
                var typeCode = 0;
                var customerLookup = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstants.CustomerLookup);
                var selectedItem = customerLookup.getValue();
                if (ClientUtility.DataUtil.isNullOrUndefined(selectedItem) || !selectedItem.length) {
                    errorString.text = Sales.StringProvider.getResourceString("Alert_Conv_Act_Customer_Must");
                    Xrm.Navigation.openAlertDialog(errorString, null);
                    return;
                }
                else {
                    customer = selectedItem[0];
                    entityName = selectedItem[0].entityType;
                    typeCode = Sales.ClientUtil.getEntityTypeCodes(entityName);
                }
                var currencyLookup = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstants.CurrencyLookup);
                selectedItem = currencyLookup.getValue();
                if (ClientUtility.DataUtil.isNullOrUndefined(selectedItem) || !selectedItem.length) {
                    errorString.text = Sales.StringProvider.getResourceString("Alert_Conv_Act_Currency_Must");
                    Xrm.Navigation.openAlertDialog(errorString, null);
                    return;
                }
                else {
                    currency = selectedItem[0];
                }
                Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.LastButtonClicked).setValue(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                if (!ClientUtility.DataUtil.isNullOrUndefined(formContext.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.Subject).getValue())) {
                    subject = decodeURIComponent(formContext.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.Subject).getValue().toString());
                }
                entityId = formContext.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.EntityId).getValue().toString();
                ownerId = decodeURIComponent(formContext.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.OwnerId).getValue().toString());
                var ownerType = decodeURIComponent(formContext.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.OwnerType).getValue().toString());
                ownerTypeCode = Sales.ClientUtil.getEntityTypeCodes(ownerType);
                if (!ClientUtility.DataUtil.isNullOrUndefined(formContext.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.OwnerName).getValue())) {
                    ownerName = formContext.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.OwnerName).getValue().toString();
                }
                var saveActivityItemChecked = formContext.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.SaveActivity).getValue();
                if (saveActivityItemChecked) {
                    saveActivity = "true";
                }
                var openNewItemChecked = formContext.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.OpenNewRecord).getValue();
                if (openNewItemChecked) {
                    openNewRecord = "true";
                }
                ClientUtility.DialogUtil.showProgressMessage();
                if (ClientUtility.ClientUtil.isMobileOffline()) {
                    var opportunityRecord = _this.getOpportunityEntityRecord(subject, entityId, entityTypeCode, customer.id, typeCode, ownerId, ownerTypeCode, leadId, currency.id, campaignId, Sales.EntityTypeCodes.Campaign, ownerName);
                    _this.offlineConvertActivity(entityId, entityTypeCode, opportunityRecord, saveActivity, openNewRecord, currency, customer);
                }
                else {
                    var that = _this;
                    _this.convertToOpportunity(function (response) {
                        response.json().then(function (json) {
                            var oppId = json.RecordId.toString();
                            that.postConvertActivity(oppId, saveActivity, openNewRecord);
                        });
                    }, function (response) {
                        ClientUtility.DialogUtil.hideProgressMessage();
                        ClientUtility.ActionFailedHandler.actionFailedCallback(response);
                    }, subject, entityId, entityTypeCode, customer.id, typeCode, ownerId, ownerTypeCode, leadId, currency.id, campaignId, Sales.EntityTypeCodes.Campaign, false, ownerName);
                }
            };
            this.getOpportunityEntityRecord = function (targetEntitySubject, activityId, activityTypeCode, customerId, customerTypeCode, ownerId, ownerTypeCode, leadId, currencyId, campaignId, campaignTypeCode, ownerName) {
                var opportunity = {};
                opportunity["opportunityid"] = ClientUtility.Guid.newGuid();
                opportunity["@odata.type"] = "#Microsoft.Dynamics.CRM.opportunity";
                opportunity["name"] = targetEntitySubject;
                if (customerId) {
                    if (customerTypeCode === Sales.EntityTypeCodes.Account) {
                        opportunity["customerid_account@odata.bind"] = "/accounts(" + ClientUtility.Guid.create(customerId) + ")";
                    }
                    else if (customerTypeCode === Sales.EntityTypeCodes.Contact) {
                        opportunity["customerid_contact@odata.bind"] = "/contacts(" + ClientUtility.Guid.create(customerId) + ")";
                    }
                }
                if (campaignId) {
                    opportunity["campaignid@odata.bind"] = "/campaigns(" + ClientUtility.Guid.create(campaignId) + ")";
                }
                if (currencyId) {
                    opportunity["transactioncurrencyid@odata.bind"] = "/transactioncurrencies(" + ClientUtility.Guid.create(currencyId) + ")";
                }
                if (leadId) {
                    opportunity["originatingleadid@odata.bind"] = "/leads(" + ClientUtility.Guid.create(leadId) + ")";
                }
                if (ownerId && ownerTypeCode == 8) {
                    opportunity["ownerid@odata.bind"] = "/systemusers(" + ClientUtility.Guid.create(decodeURIComponent(ownerId)) + ")";
                }
                if (ownerId && ownerTypeCode == 9) {
                    opportunity["ownerid@odata.bind"] = "/teams(" + ClientUtility.Guid.create(decodeURIComponent(ownerId)) + ")";
                }
                return opportunity;
            };
            this.offlineConvertActivity = function (entityId, entityTypeCode, opportunityRecord, saveActivity, openNewRecord, transactionCurrency, customer) {
                var convertActivityRequest = new ODataContract.ConvertActivityRequest({ guid: entityId }, Sales.ClientUtil.getEntityName(entityTypeCode), opportunityRecord, Sales.EntityNames.Opportunity, false);
                var successCallback = function (response) {
                    response.json().then(function (result) {
                        if (result.createdEntities && result.createdEntities.length > 0) {
                            var newOpportunity = result.createdEntities.find(function (x) { return x.LogicalName = Sales.EntityNames.Opportunity; });
                            if (newOpportunity) {
                                _this.postConvertActivity(newOpportunity.Id, saveActivity, openNewRecord);
                            }
                        }
                    });
                };
                Xrm.WebApi.offline.execute(convertActivityRequest, { "EntityLogicalName": Sales.ClientUtil.getEntityName(entityTypeCode), "transactioncurrencyid": transactionCurrency, "customerid": customer }).then(successCallback, ClientUtility.ActionFailedHandler.actionFailedCallback);
            };
            this.postConvertActivity = function (oppId, saveActivity, openNewRecord) {
                var optyIdAttribute = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.OpportunityId);
                ClientUtility.DialogUtil.setAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.OpportunityId, oppId);
                var saveActivityAttribute = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.SaveActivity);
                ClientUtility.DialogUtil.setAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.SaveActivity, saveActivity);
                var openNewAttribute = Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.OpenNewRecord);
                ClientUtility.DialogUtil.setAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.OpenNewRecord, openNewRecord);
                ClientUtility.DialogUtil.hideProgressMessage();
                Xrm.Page.ui.close();
            };
            this.convertToOpportunity = function (successCallback, errorCallback, targetEntitySubject, activityId, activityTypeCode, customerId, customerTypeCode, ownerId, ownerTypeCode, leadId, currencyId, campaignId, campaignTypeCode, logResponse, ownerName) {
                var opportunityRecord = _this.getOpportunityEntityRecord(targetEntitySubject, activityId, activityTypeCode, customerId, customerTypeCode, ownerId, ownerTypeCode, leadId, currencyId, campaignId, campaignTypeCode, ownerName);
                _this.entityName = Sales.ClientUtil.getEntityName(activityTypeCode);
                var convertActivityRequest = new ODataContract.ConvertActivityRequest({ guid: activityId }, Sales.ClientUtil.getEntityName(activityTypeCode), opportunityRecord, Sales.EntityNames.Opportunity, logResponse);
                Xrm.WebApi.online.execute(convertActivityRequest).then(successCallback, errorCallback);
            };
            // Convert an activity to an opportunity
            this.convertToOpportunityActivity = function (iObjType) {
                // Alert the user if the form is not saved
                if (Xrm.Page.data.entity.getIsDirty()) {
                    Xrm.Navigation.openAlertDialog({
                        text: Sales.StringProvider.getResourceString("ConvActSaveWarning")
                    });
                    // skip the convert to opportunity
                    return false;
                }
                if (Xrm.Page.data.isValid()) {
                    // Get the direction code control
                    var _directionCodeCtrl = Xrm.Page.data.entity.attributes.get("directioncode");
                    var directionCodeVal = true;
                    if (!ClientUtility.DataUtil.isNullOrUndefined(_directionCodeCtrl)) {
                        var directionCodeValue = _directionCodeCtrl.getValue();
                        directionCodeVal = (directionCodeValue === "0" || !directionCodeVal) ? false : true;
                    }
                    var customerItems = null;
                    var secondaryCust = null;
                    var sUrlElement = "";
                    sUrlElement += "activityType=" + encodeURIComponent(iObjType);
                    if (directionCodeVal === true) {
                        var _to = Xrm.Page.data.entity.attributes.get('to');
                        // Outgoing
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_to)) {
                            customerItems = _to.getValue();
                        }
                        if (ClientUtility.DataUtil.isNullOrUndefined(customerItems)) {
                            customerItems = new Array();
                        }
                        var _cc = Xrm.Page.data.entity.attributes.get('cc');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_cc)) {
                            secondaryCust = _cc.getValue();
                            if (!ClientUtility.DataUtil.isNullOrUndefined(secondaryCust)) {
                                for (var i = 0; i < secondaryCust.length; i++) {
                                    customerItems[customerItems.length] = secondaryCust[i];
                                }
                            }
                        }
                        var _bcc = Xrm.Page.data.entity.attributes.get('bcc');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_bcc)) {
                            secondaryCust = _bcc.getValue();
                            if (!ClientUtility.DataUtil.isNullOrUndefined(secondaryCust)) {
                                for (var i = 0; i < secondaryCust.length; i++) {
                                    customerItems[customerItems.length] = secondaryCust[i];
                                }
                            }
                        }
                    }
                    else if (directionCodeVal === false) {
                        // Incoming
                        var _from = Xrm.Page.data.entity.attributes.get('from');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_from)) {
                            customerItems = _from.getValue();
                        }
                    }
                    // Appointment has attendees
                    if (iObjType === Sales.EntityTypeCodes.Appointment || iObjType === Sales.EntityTypeCodes.RecurringAppointmentMaster) {
                        var _requiredattendees = Xrm.Page.data.entity.attributes.get('requiredattendees');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_requiredattendees)) {
                            customerItems = _requiredattendees.getValue();
                        }
                        if (ClientUtility.DataUtil.isNullOrUndefined(customerItems)) {
                            customerItems = new Array();
                        }
                        var _optionalattendees = Xrm.Page.data.entity.attributes.get('optionalattendees');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_optionalattendees)) {
                            secondaryCust = _optionalattendees.getValue();
                            if (!ClientUtility.DataUtil.isNullOrUndefined(secondaryCust)) {
                                for (var i = 0; i < secondaryCust.length; i++) {
                                    customerItems[customerItems.length] = secondaryCust[i];
                                }
                            }
                        }
                    }
                    else if (iObjType === Sales.EntityTypeCodes.Task) {
                        var _regardingobjectid = Xrm.Page.data.entity.attributes.get('regardingobjectid');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_regardingobjectid) && !ClientUtility.DataUtil.isNullOrUndefined(_regardingobjectid.getValue())) {
                            customerItems = _regardingobjectid.getValue();
                        }
                    }
                    // We have to find the first valid customer
                    if (!ClientUtility.DataUtil.isNullOrUndefined(customerItems)) {
                        // call the GetValidcustomer for the first time
                        _this.getValidCustomer(customerItems, sUrlElement, iObjType, 0, "opportunity");
                    }
                }
                _this.refreshParentGrid(iObjType);
            };
            this.refreshParentGrid = function (iObjType) {
                //TODO:
                //Xrm.Internal.refreshParentGrid(iObjType, Sales.ClientUtil.getEntityName(iObjType), "");
            };
            this.getValidCustomer = function (customerItems, sUrlElement, iObjType, customerNo, customerType) {
                if (customerNo === customerItems.length) {
                    return _this.getValidCustomerSuccess(sUrlElement, iObjType, customerItems, customerType, "");
                }
                try {
                    var isValidCustomer = true;
                    // for convert to lead only lead is valid for customer
                    if ((!ClientUtility.DataUtil.isNullOrUndefined(customerType)
                        && customerType === "lead") && (customerItems[customerNo].entityType.toString() !== Sales.EntityTypeCodes.Lead.toString())) {
                        isValidCustomer = false;
                    }
                    // we check for either contact or account for convert to case/opportunity
                    if ((!ClientUtility.DataUtil.isNullOrUndefined(customerType) && customerType !== "lead") &&
                        (customerItems[customerNo].entityType.toString() !== Sales.EntityTypeCodes.Account.toString()
                            && customerItems[customerNo].entityType.toString() !== Sales.EntityTypeCodes.Contact.toString())) {
                        isValidCustomer = false;
                    }
                    if (!isValidCustomer) {
                        return _this.getValidCustomer(customerItems, sUrlElement, iObjType, customerNo + 1, customerType);
                    }
                    if (ClientUtility.ClientUtil.isMobileOffline()) {
                        // Populating the customer attributes in case of moca offline from form data
                        sUrlElement += _this.appendValidCustomerAttributes(customerItems, customerNo, customerType);
                        return _this.getValidCustomerSuccess(sUrlElement, iObjType, customerItems, customerType, "");
                    }
                    else {
                        var columns = new Array();
                        columns[0] = "statecode";
                        var that = _this;
                        Xrm.WebApi.retrieveRecord(Sales.ClientUtil.getEntityName(typeof (customerItems[customerNo].entityType) !== 'number' ? Number.parseInvariant(customerItems[customerNo].entityType) : customerItems[customerNo].entityType), customerItems[customerNo].id, ClientUtility.ODataUtil.getSelectOption(columns)).then(function (response) {
                            if (!ClientUtility.DataUtil.isNullOrUndefined(response)
                                && !ClientUtility.DataUtil.isNullOrUndefined(response.statecode)
                                && response.statecode.toString() === "0"
                                && !ClientUtility.DataUtil.isNullOrUndefined(response.activityid)) {
                                // the customer is active, get the id and find the customer in the list of customerItems with the same Id
                                var id = response.activityid.toString();
                                for (var k = 0; k < customerItems.length; k++) {
                                    if (!ClientUtility.DataUtil.isNullOrUndefined(customerItems[k].id) && customerItems[k].id.toLowerCase().indexOf(id.toLowerCase()) !== -1) {
                                        sUrlElement += that.appendValidCustomerAttributes(customerItems, k, customerType);
                                        return that.getValidCustomerSuccess(sUrlElement, iObjType, customerItems, customerType, "");
                                    }
                                }
                                return that.getValidCustomer(customerItems, sUrlElement, iObjType, customerNo + 1, customerType);
                            }
                            else {
                                // This code is added only to retain the behaviour of CRM2011 where dialog box opens even if contact is inactive
                                // If we have reached here, it means that the customer we looked into was inactive, so go ahead and find the next valid customer
                                return that.getValidCustomer(customerItems, sUrlElement, iObjType, customerNo + 1, customerType);
                            }
                        }, function (response) {
                            // the call failed because of some reason, just increase the number of customers processed and if all customers are processed, call GetValidCustomerSuccess anyways
                            return that.getValidCustomer(customerItems, sUrlElement, iObjType, customerNo + 1, customerType);
                        });
                    }
                }
                catch (e) { }
            };
            this.getValidCustomerSuccess = function (sUrlElement, iObjType, customerItems, customerType, entityId) {
                // the first customerType = "opportunity" denotes that the call has come from opportunity and not form case hence we need to call the GetValidForConvertToOpportunity
                if (customerType === "opportunity") {
                    return _this.getValidForConvertToOpportunity(sUrlElement, iObjType, customerItems);
                }
                else if (customerType === "lead") {
                    return _this.getValidForConvertToOpportunityWithLead(sUrlElement, iObjType);
                }
                _this.refreshParentGrid(iObjType);
            };
            this.appendValidCustomerAttributes = function (customerItems, customerNo, customerType) {
                if (customerType !== "lead") {
                    return ("&customerId=" + encodeURIComponent(customerItems[customerNo].id) +
                        "&customerType=" + encodeURIComponent(customerItems[customerNo].entityType) +
                        "&customerName=" + encodeURIComponent(customerItems[customerNo].name));
                }
                else {
                    return ("&leadId=" + encodeURIComponent(customerItems[customerNo].id) +
                        "&leadName=" + encodeURIComponent(customerItems[customerNo].name));
                }
            };
            this.getValidForConvertToOpportunity = function (sUrlElement, iObjType, customerItems) {
                // if customer has been found customer Id will be set
                if (sUrlElement.indexOf("customerId") === -1) {
                    _this.getValidCustomer(customerItems, sUrlElement, iObjType, 0, "lead");
                }
                else {
                    // customer is already present, no need to add lead anymore we can direct call into lead success
                    _this.getValidForConvertToOpportunityWithLead(sUrlElement, iObjType);
                }
            };
            this.getValidForConvertToOpportunityWithLead = function (sUrlElement, iObjType) {
                var subjectField = "";
                var _subject = Xrm.Page.data.entity.attributes.get("subject");
                if (!ClientUtility.DataUtil.isNullOrUndefined(_subject.getValue())) {
                    subjectField = _subject.getValue();
                }
                var ownerId = "";
                var ownerType = "";
                var ownerCtrl = Xrm.Page.data.entity.attributes.get("ownerid");
                if (!ClientUtility.DataUtil.isNullOrUndefined(ownerCtrl)) {
                    var dataVal = ownerCtrl.getValue();
                    if (dataVal[0]) {
                        ownerId = dataVal[0].id;
                        ownerType = dataVal[0].entityType;
                    }
                }
                sUrlElement += "&subject=" + subjectField;
                sUrlElement += "&ownerId=" + ownerId;
                sUrlElement += "&ownerType=" + ownerType;
                _this.convertActivityPreload(sUrlElement, iObjType);
                _this.refreshParentGrid(iObjType);
            };
            this.convertActivityPreload = function (element, iObjType) {
                _this.entityName = Sales.ClientUtil.getEntityName(parseInt(iObjType));
                if (ClientUtility.ClientUtil.isMobileOffline() &&
                    !Xrm.Mobile.offline.isOfflineEnabled(_this.entityName)) {
                    ClientUtility.DialogUtil.showMoCAOfflineError();
                    return;
                }
                ClientUtility.DialogUtil.showProgressMessage();
                if (ClientUtility.ClientUtil.isMobileOffline()) {
                    var currencyValues = Xrm.Utility.getGlobalContext().userSettings.transactionCurrencyId;
                    _this.convertActivityPreloadWithCurrency(element, iObjType, currencyValues);
                }
                else {
                    var that = _this;
                    var retrieveUserDefaultCurrencyRequest = new ODataContract.RetrieveUserDefaultCurrencyRequest();
                    retrieveUserDefaultCurrencyRequest.entityset = "transactioncurrency";
                    Xrm.WebApi.online.execute(retrieveUserDefaultCurrencyRequest).then(function (r) {
                        r.json().then(function (response) {
                            if (!ClientUtility.DataUtil.isNullOrUndefined(response)) {
                                var currencyValues = response.transactioncurrencyid;
                                that.convertActivityPreloadWithCurrency(element, iObjType, currencyValues);
                            }
                            else {
                                ClientUtility.DialogUtil.hideProgressMessage();
                            }
                        });
                    }, ClientUtility.ActionFailedHandler.actionFailedCallback);
                }
            };
            this.convertActivityPreloadWithCurrency = function (element, iObjType, currencyValues) {
                var dialogParams = {};
                _this.setCurrencyAndCustomerDialogParams(currencyValues, element, dialogParams);
                if (element.indexOf("leadId") !== -1) {
                    var leadId = ClientUtility.CommandBarUtils.getElementValue(element, "leadId");
                    var leadName = ClientUtility.CommandBarUtils.getElementValue(element, "leadName");
                    var leadLookup = {};
                    leadLookup.id = encodeURIComponent(leadId);
                    leadLookup.name = encodeURIComponent(leadName);
                    leadLookup.entityType = Sales.EntityNames.Lead;
                    var leadLookupParams = [];
                    leadLookupParams[0] = leadLookup;
                    dialogParams[Sales.MetadataDrivenDialogConstants.LeadLookup] = leadLookupParams;
                    dialogParams[Sales.MetadataDrivenDialogConstants.LeadId] = encodeURIComponent(leadId);
                }
                _this.setConvertActivityParameterAndLaunchDialog(dialogParams, element, iObjType);
            };
            this.setCurrencyAndCustomerDialogParams = function (currencyValues, element, dialogParams) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(currencyValues)) {
                    dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.CurrencyId] = currencyValues.toString();
                }
                if (element.indexOf("customerId") !== -1) {
                    var customerId = ClientUtility.CommandBarUtils.getElementValue(element, "customerId");
                    var customerName = ClientUtility.CommandBarUtils.getElementValue(element, "customerName");
                    var customerType = ClientUtility.CommandBarUtils.getElementValue(element, "customerType");
                    dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.CustomerId] = {
                        id: decodeURIComponent(customerId),
                        name: decodeURIComponent(customerName),
                        entityType: decodeURIComponent(customerType)
                    };
                }
            };
            this.setConvertActivityParameterAndLaunchDialog = function (dialogParams, element, iObjType) {
                if (element.indexOf("subject") !== -1) {
                    var subject = ClientUtility.CommandBarUtils.getElementValue(element, "subject");
                    dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.Subject] = encodeURIComponent(subject);
                }
                if (element.indexOf("ownerId") !== -1) {
                    var ownerId = ClientUtility.CommandBarUtils.getElementValue(element, "ownerId");
                    var ownerType = ClientUtility.CommandBarUtils.getElementValue(element, "ownerType");
                    var ownerName = "";
                    var ownerCtrl = Xrm.Page.data.entity.attributes.get("ownerid");
                    if (!ClientUtility.DataUtil.isNullOrUndefined(ownerCtrl)) {
                        var selectedItem = ownerCtrl.getValue();
                        if (!ClientUtility.DataUtil.isNullOrUndefined(selectedItem) && selectedItem.length > 0) {
                            ownerName = selectedItem[0].name;
                            dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.OwnerName] = encodeURIComponent(ownerName);
                        }
                    }
                    dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.OwnerId] = ownerId;
                    dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.OwnerType] = ownerType;
                }
                dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.EntityId] = Xrm.Page.data.entity.getId();
                dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.EntityTypeCode] = "" + iObjType;
                dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.OpportunityId] = "";
                dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.SaveActivity] = "false";
                dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.OpenNewRecord] = "false";
                dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.LastButtonClicked] = "";
                ClientUtility.DialogUtil.hideProgressMessage();
                var isLead = element.indexOf("leadId") !== -1;
                var dialogOptions = _this.getConvertToOpportunityDialogOptions(isLead);
                Xrm.Navigation.openDialog(Sales.DialogName.ConvertActivityDialog, dialogOptions, dialogParams)
                    .then(_this.convertActivityCallback, null);
            };
            this.convertActivityCallback = function (response) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(response) && !ClientUtility.DataUtil.isNullOrUndefined(response.parameters)
                    && response.parameters[Sales.MetadataDrivenDialogConstantsConvertActivity.LastButtonClicked] === ClientUtility.MetadataDrivenDialogConstants.DialogOkId) {
                    var oppId = response.parameters[Sales.MetadataDrivenDialogConstantsConvertActivity.OpportunityId];
                    var saveActivity = response.parameters[Sales.MetadataDrivenDialogConstantsConvertActivity.SaveActivity];
                    var openNewRecord = response.parameters[Sales.MetadataDrivenDialogConstantsConvertActivity.OpenNewRecord];
                    _this.convertToOpportunitySuccess(oppId, saveActivity, openNewRecord);
                }
            };
            this.convertToOpportunitySuccess = function (oppId, saveActivity, openNewRecord) {
                if (saveActivity === "false") {
                    if (openNewRecord === "true") {
                        Xrm.Page.data.save();
                        Xrm.Utility.openEntityForm(Sales.EntityNames.Opportunity, oppId);
                    }
                }
                else {
                    if (openNewRecord === "true")
                        _this.markActivityComplete(Xrm.Page.data.entity.getId(), Xrm.Page.data.entity.getEntityName(), false, Sales.EntityNames.Opportunity, oppId);
                    else
                        _this.markActivityComplete(Xrm.Page.data.entity.getId(), Xrm.Page.data.entity.getEntityName(), true, null, null);
                }
                _this.refreshParentGrid$p(Xrm.Page.data.entity.getId(), Xrm.Page.data.entity.getEntityName());
            };
            this.refreshParentGrid$p = function (entityId, entityName) {
                if (entityName) {
                }
            };
            this.getConvertToOpportunityDialogOptions = function (isLead) {
                var height = 400;
                if (isLead) {
                    height += 30;
                }
                if (ClientUtility.CommandBarActions.isWebClient() || Xrm.Page.context.client.getClient() === Xrm.Constants.ClientNames.outlook) {
                    var dialogOptions = { width: 410, height: height, position: 1 /* center */ };
                }
                return dialogOptions;
            };
            this.markActivityComplete = function (entityId, entityName, closeWindow, entityToOpen, entityIdToOpen) {
                // The state code for "closed" for all activities
                var CloseStateCodeForActivities = 1;
                // The completed status for appointment
                var CompletedStatusForAppointment = 3;
                if (entityName != Sales.EntityNames.Appointment) {
                    if (entityName == Sales.EntityNames.SocialActivity) {
                        //-1 is used for default status, for SocialActivity this is configured as 3 i.e. "processsing"
                        //so passing 1 explicitly to have status as "completed"
                        ClientUtility.CommandBarActions.setState(entityId, entityName, CloseStateCodeForActivities, 1, closeWindow, entityToOpen, entityIdToOpen);
                    }
                    else {
                        ClientUtility.CommandBarActions.setState(entityId, entityName, CloseStateCodeForActivities, -1, closeWindow, entityToOpen, entityIdToOpen);
                    }
                }
                else {
                    ClientUtility.CommandBarActions.setState(entityId, entityName, -1, CompletedStatusForAppointment, closeWindow, entityToOpen, entityIdToOpen);
                }
            };
            this.convertToEntityLegacy = function (entityId, saveActivity, openNewRecord, iObjType, targetEntityName) {
                var crmFormCtrl = $find("crmForm");
                if (saveActivity === false) {
                    crmFormCtrl.SubmitCrmForm(1, true, true, false);
                    _this.refreshParentGrid(iObjType);
                }
                else {
                    crmFormCtrl.SubmitCrmForm(58, true, true, false);
                }
                if (openNewRecord && !ClientUtility.DataUtil.isNullOrUndefined(entityId)) {
                    Xrm.Utility.openEntityForm(targetEntityName, entityId);
                }
                _this.refreshParentGrid(iObjType);
            };
        }
        ConvertActivityActions.prototype.dialogClose = function (context) {
            var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
            Xrm.Page.data.attributes.get(ClientUtility.MetadataDrivenDialogConstants.paramLastButtonClicked).setValue(ClientUtility.MetadataDrivenDialogConstants.DialogCancelId);
            formContext.ui.close();
        };
        return ConvertActivityActions;
    }());
    Sales.ConvertActivityActions = ConvertActivityActions;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../../../../TypeDefinitions/AppCommon/Telemetry/TelemetryLibrary.d.ts" />
/// <reference path="../../ClientCommon/Sales_ClientCommon.d.ts" />
var Sales;
(function (Sales) {
    var SalesCommandBarActionsLegacy = (function () {
        function SalesCommandBarActionsLegacy() {
            var _this = this;
            this.defaultQuantityAccuracy = 0;
            this.productQuantityAccuracy = 0;
            this.priceLevelAttributeName = "priceLevelAttributeName";
            this.errorNoParentRecordFound = "No parent record found.";
            this.cancelButtonId = "cancel_id";
            this.resourceButtonCancel = "Button_Label_Cancel";
            this.stateCodeAttributeName = "statecode";
            this.activeRecordStateCode = 0;
            this._cachedProp$p = {};
            this.initializeCachedProperties = function () {
                _this._cachedProp$p = {};
            };
            this.clearCacheOnPageLoad = function () {
                _this._cachedProp$p = {};
            };
            this.setValueIfNotNull = function (productDescription, attributeName, value) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(value)) {
                    _this._cachedProp$p[productDescription + attributeName] = value;
                }
            };
            this.setPrecisionOnControl = function (control, defaultPrecision) {
                !ClientUtility.DataUtil.isNullOrUndefined(control) && control.setPrecision(defaultPrecision);
            };
            this.setValueSaved = function (productDescription, attributeName) {
                var obj = productDescription + attributeName in _this._cachedProp$p ? _this._cachedProp$p[productDescription + attributeName] : null;
                if (!ClientUtility.DataUtil.isNullOrUndefined(obj)) {
                    return obj;
                }
                return null;
            };
            this.isClientOffline = function () {
                return Xrm.Page.context.client.getClientState() === Xrm.ClientState.offline;
            };
            this.getStateCode = function () {
                var attributeValue = _this.getAttributeObjectValue(_this.stateCodeAttributeName);
                if (ClientUtility.DataUtil.isNullOrUndefined(attributeValue)) {
                    return null;
                }
                return attributeValue;
            };
            this.isFeatureEnabled = function (feature) {
                return Xrm.Internal.isFeatureEnabled(feature);
            };
            this.getAttributeObjectValue = function (attributeName) {
                var attribute = Xrm.Page.getAttribute(attributeName);
                if (ClientUtility.DataUtil.isNullOrUndefined(attribute)) {
                    return null;
                }
                return attribute.getValue();
            };
            this.productOverriddenHandler = function () {
                var isProductOverriddenAttributes = Xrm.Page.getAttribute("isproductoverridden");
                var bIsExistingProduct = !isProductOverriddenAttributes.getValue();
                var quantityAttributes = Xrm.Page.getAttribute("quantity");
                var quantityshippedAttributes = Xrm.Page.getAttribute("quantityshipped");
                var quantitybackorderedAttributes = Xrm.Page.getAttribute("quantitybackordered");
                var quantitycancelledAttributes = Xrm.Page.getAttribute("quantitycancelled");
                var productDescription = Xrm.Page.getAttribute("productdescription");
                var pricePerUnit = Xrm.Page.getAttribute("priceperunit");
                var oPriceOverriddenAttributes = Xrm.Page.getAttribute("ispriceoverridden");
                var oProductIdAttributes = Xrm.Page.getAttribute("productid");
                var oUomIdAttributes = Xrm.Page.getAttribute("uomid");
                oProductIdAttributes.setRequiredLevel(bIsExistingProduct ? Xrm.RequiredLevel.required : Xrm.RequiredLevel.none);
                oUomIdAttributes.setRequiredLevel(bIsExistingProduct ? Xrm.RequiredLevel.required : Xrm.RequiredLevel.none);
                productDescription.setRequiredLevel(!bIsExistingProduct ? Xrm.RequiredLevel.required : Xrm.RequiredLevel.none);
                pricePerUnit.setRequiredLevel(!bIsExistingProduct ? Xrm.RequiredLevel.required : Xrm.RequiredLevel.none);
                if (!bIsExistingProduct) {
                    if (ClientUtility.DataUtil.isNullOrEmptyString(Xrm.Page.data.entity.getId())) {
                        var $$dict_C = _this._cachedProp$p;
                        for (var $$key_D in $$dict_C) {
                            var entry = { key: $$key_D, value: $$dict_C[$$key_D] };
                            _this._cachedProp$p[entry.key] = null;
                        }
                    }
                    _this.setValueIfNotNull(oPriceOverriddenAttributes.getName(), "prevDataValue", oPriceOverriddenAttributes.getValue());
                    oPriceOverriddenAttributes.setValue(true);
                    _this.setValueIfNotNull(oProductIdAttributes.getName(), "prevDataValue", oProductIdAttributes.getValue());
                    oProductIdAttributes.setValue(null);
                    _this.setValueIfNotNull(oUomIdAttributes.getName(), "prevDataValue", oUomIdAttributes.getValue());
                    oUomIdAttributes.setValue(null);
                    _this.setPrecisionOnControl(quantityAttributes, _this.defaultQuantityAccuracy);
                    _this.setPrecisionOnControl(quantityshippedAttributes, _this.defaultQuantityAccuracy);
                    _this.setPrecisionOnControl(quantitybackorderedAttributes, _this.defaultQuantityAccuracy);
                    _this.setPrecisionOnControl(quantitycancelledAttributes, _this.defaultQuantityAccuracy);
                    _this.setValueIfNotNull(productDescription.getName(), "prevDataValue", productDescription.getValue());
                    productDescription.setValue(_this.setValueSaved(productDescription.getName(), "prevDataValue"));
                }
                else {
                    _this.setValueIfNotNull(productDescription.getName(), "prevDataValue", productDescription.getValue());
                    productDescription.setValue("");
                    _this.setPrecisionOnControl(quantityAttributes, _this.productQuantityAccuracy);
                    _this.setPrecisionOnControl(quantityshippedAttributes, _this.productQuantityAccuracy);
                    _this.setPrecisionOnControl(quantitybackorderedAttributes, _this.productQuantityAccuracy);
                    _this.setPrecisionOnControl(quantitycancelledAttributes, _this.productQuantityAccuracy);
                    var priceOverrideSavedValue = _this.setValueSaved(oPriceOverriddenAttributes.getName(), "prevDataValue");
                    oPriceOverriddenAttributes.setValue(!ClientUtility.DataUtil.isNullOrUndefined(priceOverrideSavedValue) ? priceOverrideSavedValue : true);
                    oProductIdAttributes.setValue(_this.setValueSaved(oProductIdAttributes.getName(), "prevDataValue"));
                    oUomIdAttributes.setValue(_this.setValueSaved(oUomIdAttributes.getName(), "prevDataValue"));
                }
                _this.updatePriceAttributes(true);
                var productId = Xrm.Page.ui.controls.get("productid");
                productId.setDisabled(!bIsExistingProduct || _this.isControlReadOnly(productId));
                var uomid = Xrm.Page.ui.controls.get("uomid");
                uomid.setDisabled(!bIsExistingProduct || _this.isControlReadOnly(uomid) || !oProductIdAttributes.getValue());
                var productdescription = Xrm.Page.ui.controls.get("productdescription");
                productdescription.setDisabled(bIsExistingProduct || _this.isControlReadOnly(productdescription));
            };
            this.addTransactionCurrencyFilter = function (lookup) {
                var oTransCurId = null, sTransCurId = "", dataValue = null;
                if (Mscrm.InternalUtilities.JSTypes.isNull(Xrm.Page.data)) {
                    return;
                }
                oTransCurId = Xrm.Page.getAttribute("transactioncurrencyid");
                if (!Mscrm.InternalUtilities.JSTypes.isNull(oTransCurId)) {
                    oTransCurId = Xrm.Page.getAttribute("transactioncurrencyid");
                    dataValue = oTransCurId.getValue();
                }
                if (!Mscrm.InternalUtilities.JSTypes.isNull(dataValue)) {
                    sTransCurId = dataValue[0].id;
                }
                var fetchXml = '<filter type="and"><condition attribute="transactioncurrencyid" operator="like" value="';
                fetchXml += CrmEncodeDecode.CrmXmlAttributeEncode(sTransCurId);
                fetchXml += '"/></filter>';
                lookup.addCustomFilter(fetchXml);
            };
            this._getQoiParentEntityName$p = function () {
                var typeName = Xrm.Page.data.entity.getEntityName();
                switch (typeName) {
                    case Sales.EntityNames.OpportunityProduct:
                        typeName = Sales.EntityNames.Opportunity;
                        break;
                    case Sales.EntityNames.InvoiceDetail:
                        typeName = Sales.EntityNames.Invoice;
                        break;
                    case Sales.EntityNames.SalesOrderDetail:
                        typeName = Sales.EntityNames.SalesOrder;
                        break;
                    case Sales.EntityNames.QuoteDetail:
                        typeName = Sales.EntityNames.Quote;
                        break;
                }
                return typeName;
            };
            this.isControlReadOnly = function (control) {
                var ReadOnlyKey = "IsReadOnly";
                var cachedValue = null;
                var isReadOnly = false;
                cachedValue = _this.setValueSaved(control.getName(), ReadOnlyKey);
                if (ClientUtility.DataUtil.isNullOrUndefined(cachedValue)) {
                    isReadOnly = control.getDisabled();
                    _this.setValueIfNotNull(control.getName(), ReadOnlyKey, isReadOnly);
                }
                else {
                    isReadOnly = cachedValue;
                }
                return isReadOnly;
            };
            this.enableDisableShippingAddress = function () {
                var oWillCall = Xrm.Page.getAttribute("willcall"), showControl = !oWillCall.getValue(), cntrlShiptoComposite = Xrm.Page.ui.controls.get("shipto_composite");
                if (!Mscrm.InternalUtilities.JSTypes.isNull(cntrlShiptoComposite)) {
                    cntrlShiptoComposite.setVisible(showControl);
                }
                else {
                    var addressControlNames = ["shipto_name", "shipto_line1", "shipto_line2", "shipto_line3", "shipto_city", "shipto_stateorprovince", "shipto_postalcode", "shipto_country", "shipto_telephone", "shipto_fax", "shipto_freighttermscode", "shipto_contactname"];
                    addressControlNames.forEach(function (addressControlName) {
                        _this._setVisibilityOfControl$p(addressControlName, showControl);
                        _this._setVisibilityOfControl$p("shipto_composite_compositionLinkControl_" + addressControlName, showControl);
                    });
                }
            };
            this.updatePriceAttributes = function (refreshPrice) {
                var isPriceOverridenAttributes = Xrm.Page.getAttribute("ispriceoverridden");
                var isPriceOverride = !ClientUtility.DataUtil.isNullOrUndefined(isPriceOverridenAttributes) ? isPriceOverridenAttributes.getValue() : false;
                var isProductOverriddenAttributes = Xrm.Page.getAttribute("isproductoverridden");
                var isExistingProduct = !isProductOverriddenAttributes.getValue();
                var shipToFaxControl = Xrm.Page.ui.controls.get("shipto_fax");
                var pricePerUnitAttr = Xrm.Page.getAttribute("priceperunit");
                var priceperunitControl = Xrm.Page.ui.controls.get("priceperunit");
                var ispriceoverriddenControl = Xrm.Page.ui.controls.get("ispriceoverridden");
                var isPriceoverriddenReadOnly = _this.isControlReadOnly(ispriceoverriddenControl);
                var typeName = _this._getQoiParentEntityName$p();
                var canOverridePrice = Xrm.Internal.canOverridePriceEngine(typeName);
                if (!canOverridePrice) {
                    var isproductoverriddenControl = Xrm.Page.ui.controls.get("isproductoverridden");
                    _this.disableControl(ispriceoverriddenControl);
                    _this.disableControl(isproductoverriddenControl);
                    _this.disableControl(priceperunitControl);
                }
                else {
                    if (!ClientUtility.DataUtil.isNullOrUndefined(priceperunitControl)) {
                        priceperunitControl.setDisabled(!isPriceOverride);
                    }
                    if (!ClientUtility.DataUtil.isNullOrUndefined(ispriceoverriddenControl)) {
                        ispriceoverriddenControl.setDisabled(isPriceoverriddenReadOnly || !isExistingProduct);
                    }
                }
                if (!isPriceOverride) {
                    _this.setValueIfNotNull(pricePerUnitAttr.getName(), "prevDataValue", pricePerUnitAttr.getValue());
                    var formType = Xrm.Page.ui.getFormType();
                    if (formType === Xrm.FormType.create
                        && Xrm.Page.context.client.getClient() === Xrm.ClientName.mobile) {
                        pricePerUnitAttr.setValue(null);
                    }
                    if (!ClientUtility.DataUtil.isNullOrUndefined(refreshPrice)
                        && !(formType === Xrm.FormType.create
                            && Xrm.Page.context.client.getClient() === Xrm.ClientName.mobile)) {
                        Xrm.Page.data.refresh(true);
                    }
                }
                else {
                    var previousValue = _this.setValueSaved(pricePerUnitAttr.getName(), "prevDataValue");
                    if (!ClientUtility.DataUtil.isNullOrUndefined(previousValue)) {
                        pricePerUnitAttr.setValue(previousValue);
                    }
                }
                if (!ClientUtility.DataUtil.isNullOrUndefined(shipToFaxControl)) {
                    shipToFaxControl.setDisabled(!isPriceOverride);
                    Xrm.Page.getAttribute("priceperunit").setRequiredLevel(isPriceOverride ? Xrm.RequiredLevel.required : Xrm.RequiredLevel.none);
                }
            };
            this.checkPriceAndQuantityNonnegative = function (eventArgs) {
                var quantity = Xrm.Page.getAttribute("quantity").getValue();
                var pricePerUnit = Xrm.Page.getAttribute("priceperunit").getValue();
                if (!ClientUtility.DataUtil.isNullOrUndefined(quantity) && !ClientUtility.DataUtil.isNullOrUndefined(pricePerUnit)) {
                    var quantityValue = parseInt(quantity.toString(), 0);
                    var pricePerUnitValue = parseInt(pricePerUnit.toString(), 0);
                    if (quantityValue < 0 && pricePerUnitValue < 0) {
                        var alertString = _this.isMobileCompanionApp() ? "Web.SFA.QOI.QuantityAndPriceNegativeAlert" : "LOCID_QTY_PRICE_NEGATIVE";
                        Xrm.Utility.alertDialog(Xrm.Internal.getResourceString(alertString), null);
                        eventArgs.preventDefault();
                        return false;
                    }
                }
                return true;
            };
            this.disableControl = function (control) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(control)) {
                    var controlType = control.getControlType();
                    if (controlType !== "iframe" && controlType !== "webresource" && controlType !== "subgrid") {
                        control.setDisabled(true);
                    }
                }
            };
            this._yesOptionSetValue$p = 1;
            this._strtypeName$p = null;
            this._isAppendPrivilegeCalculated$p = false;
            this._canAppendCustomer$p = false;
            this._isBusy$p = false;
            this.LookupAddress = function () {
                var aoItems = null;
                if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data.entity.attributes.get("customerid")))
                    aoItems = Xrm.Page.data.entity.attributes.get("customerid").getValue();
                if (ClientUtility.DataUtil.isNullOrUndefined(aoItems)) {
                    var sArg = Xrm.Page.ui.controls.get("customerid").getLabel();
                    Xrm.Utility.alertDialog(ClientUtility.StringUtil.format(Sales.StringProvider.getResourceString("LOCID_PROVIDE_VALUE_ADDRESS"), sArg), null);
                    return;
                }
                var dialogOptions = new Xrm.DialogOptions;
                dialogOptions.height = 350;
                dialogOptions.width = 500;
                var oUrl = Mscrm.GlobalImported.CrmUri.create("/sfa/quotes/dlg_lookupaddress.aspx");
                oUrl.get_query()["headerForm"] = 1;
                oUrl.get_query()["parentType"] = Xrm.Internal.getEntityCode(aoItems[0].entityType);
                oUrl.get_query()["parentId"] = aoItems[0].id;
                oUrl.get_query()["willCall"] = Xrm.Page.data.entity.attributes.get("willcall").getValue() ? "1" : "0";
                Xrm.Internal.openDialog(oUrl.toString(), dialogOptions, "LookupAddress", null, _this.PerformActionAfterLookupAddress);
            };
            this.LookupDetailAddress = function () {
                if (!Xrm.Page.data.entity.attributes.get("willcall").getValue()) {
                    var iHeaderType = 0, sHeaderId = null, typeName = Xrm.Page.data.entity.getEntityName();
                    switch (typeName) {
                        case Sales.EntityNames.QuoteDetail:
                            iHeaderType = Sales.EntityTypeCodes.Quote;
                            sHeaderId = _this.getIdFromLookupAttribute("quoteid");
                            break;
                        case Sales.EntityNames.SalesOrderDetail:
                            iHeaderType = Sales.EntityTypeCodes.SalesOrder;
                            sHeaderId = _this.getIdFromLookupAttribute("salesorderid");
                            break;
                        case Sales.EntityNames.InvoiceDetail:
                            iHeaderType = Sales.EntityTypeCodes.Invoice;
                            sHeaderId = _this.getIdFromLookupAttribute("invoiceid");
                            break;
                    }
                    var dialogOptions = new Xrm.DialogOptions;
                    dialogOptions.height = 330;
                    dialogOptions.width = 500;
                    var oUrl = Mscrm.GlobalImported.CrmUri.create("/sfa/quotes/dlg_lookupaddress.aspx");
                    oUrl.get_query()["headerForm"] = 0;
                    oUrl.get_query()["headerType"] = iHeaderType;
                    oUrl.get_query()["headerId"] = sHeaderId;
                    Xrm.Internal.openDialog(oUrl.toString(), dialogOptions, "LookupAddress", null, _this.PerformActionAfterLookupDetailAddress);
                }
            };
            this.PerformActionAfterLookupAddress = function (addressDialogResult) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(addressDialogResult)) {
                    _this.setBillTo(addressDialogResult);
                    var typeName = Xrm.Page.data.entity.getEntityName();
                    _this.setShipTo(addressDialogResult, false, typeName);
                }
            };
            this.PerformActionAfterLookupDetailAddress = function (addressDialogResult) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(addressDialogResult)) {
                    var typeName = Xrm.Page.data.entity.getEntityName();
                    _this.setShipTo(addressDialogResult, true, typeName);
                }
            };
            this.setBillTo = function (addressDialogResult) {
                if (addressDialogResult.BillTo) {
                    if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.ui.controls.get("billto_composite"))) {
                        Xrm.Page.data.entity.attributes.get("billto_line1").setValue(addressDialogResult.Address.Line1);
                        Xrm.Page.data.entity.attributes.get("billto_line2").setValue(addressDialogResult.Address.Line2);
                        Xrm.Page.data.entity.attributes.get("billto_line3").setValue(addressDialogResult.Address.Line3);
                        Xrm.Page.data.entity.attributes.get("billto_city").setValue(addressDialogResult.Address.City);
                        Xrm.Page.data.entity.attributes.get("billto_stateorprovince").setValue(addressDialogResult.Address.StateOrProvince);
                        Xrm.Page.data.entity.attributes.get("billto_postalcode").setValue(addressDialogResult.Address.PostalCode);
                        Xrm.Page.data.entity.attributes.get("billto_country").setValue(addressDialogResult.Address.Country);
                        Xrm.Internal.setComposeAddress("billto_", addressDialogResult.Address.Line1, addressDialogResult.Address.Line2, addressDialogResult.Address.Line3, addressDialogResult.Address.City, addressDialogResult.Address.StateOrProvince, addressDialogResult.Address.PostalCode, addressDialogResult.Address.Country);
                    }
                    _this.setValueOfControl("billto_name", addressDialogResult.Address.Name);
                    _this.setValueOfControl("billto_line1", addressDialogResult.Address.Line1);
                    _this.setValueOfControl("billto_line2", addressDialogResult.Address.Line2);
                    _this.setValueOfControl("billto_line3", addressDialogResult.Address.Line3);
                    _this.setValueOfControl("billto_city", addressDialogResult.Address.City);
                    _this.setValueOfControl("billto_stateorprovince", addressDialogResult.Address.StateOrProvince);
                    _this.setValueOfControl("billto_postalcode", addressDialogResult.Address.PostalCode);
                    _this.setValueOfControl("billto_country", addressDialogResult.Address.Country);
                    _this.setValueOfControl("billto_telephone", addressDialogResult.Address.Telephone);
                    _this.setValueOfControl("billto_fax", addressDialogResult.Address.Fax);
                    _this.setValueOfControl("billto_addressid", addressDialogResult.Address.AddressId);
                    _this.setValueOfControl("billto_contactname", addressDialogResult.Address.ContactName);
                }
            };
            this.setShipTo = function (addressDialogResult, isDetail, iObjectType) {
                if (addressDialogResult.ShipTo) {
                    if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.ui.controls.get("shipto_composite"))) {
                        Xrm.Page.data.entity.attributes.get("shipto_line1").setValue(addressDialogResult.Address.Line1);
                        Xrm.Page.data.entity.attributes.get("shipto_line2").setValue(addressDialogResult.Address.Line2);
                        Xrm.Page.data.entity.attributes.get("shipto_line3").setValue(addressDialogResult.Address.Line3);
                        Xrm.Page.data.entity.attributes.get("shipto_city").setValue(addressDialogResult.Address.City);
                        Xrm.Page.data.entity.attributes.get("shipto_stateorprovince").setValue(addressDialogResult.Address.StateOrProvince);
                        Xrm.Page.data.entity.attributes.get("shipto_postalcode").setValue(addressDialogResult.Address.PostalCode);
                        Xrm.Page.data.entity.attributes.get("shipto_country").setValue(addressDialogResult.Address.Country);
                        Xrm.Internal.setComposeAddress("shipto_", addressDialogResult.Address.Line1, addressDialogResult.Address.Line2, addressDialogResult.Address.Line3, addressDialogResult.Address.City, addressDialogResult.Address.StateOrProvince, addressDialogResult.Address.PostalCode, addressDialogResult.Address.Country);
                    }
                    _this.setValueOfControl("shipto_name", addressDialogResult.Address.Name);
                    _this.setValueOfControl("shipto_line1", addressDialogResult.Address.Line1);
                    _this.setValueOfControl("shipto_line2", addressDialogResult.Address.Line2);
                    _this.setValueOfControl("shipto_line3", addressDialogResult.Address.Line3);
                    _this.setValueOfControl("shipto_city", addressDialogResult.Address.City);
                    _this.setValueOfControl("shipto_stateorprovince", addressDialogResult.Address.StateOrProvince);
                    _this.setValueOfControl("shipto_postalcode", addressDialogResult.Address.PostalCode);
                    _this.setValueOfControl("shipto_country", addressDialogResult.Address.Country);
                    _this.setValueOfControl("shipto_telephone", addressDialogResult.Address.Telephone);
                    _this.setValueOfControl("shipto_fax", addressDialogResult.Address.Fax);
                    _this.setValueOfControl("shipto_addressid", addressDialogResult.Address.AddressId);
                    _this.setValueOfControl("shipto_contactname", addressDialogResult.Address.ContactName);
                    if (isDetail) {
                        _this.setValueOfControl("shipto_freighttermscode", "freighttermscode");
                    }
                    else {
                        iObjectType !== "invoice" &&
                            _this.setValueOfControl("freighttermscode", addressDialogResult.Address.FreightTerms.toString());
                        _this.setValueOfControl("shippingmethodcode", addressDialogResult.Address.ShippingMethod.toString());
                    }
                }
            };
            this.setValueOfControl = function (attributeName, value) {
                var attribute = Xrm.Page.data.entity.attributes.get(attributeName);
                if (!ClientUtility.DataUtil.isNullOrUndefined(attribute)) {
                    attribute.setValue(value);
                }
            };
            // added the below functions same as how marketing has made this.
            this.openActivityRecord = function (entityLogicalName, gridControl) {
                XrmCore.Commands.Open.openNewRecord(entityLogicalName, gridControl);
            };
            this.openGridActivityRecord = function (gridControl, records, entityTypeCode) {
                if (gridControl.getEntityName() == "bulkoperation" && records.length > 1) {
                    var BulkEditNotSupported = "MA.BulkOperation.BulkEditNotSupported";
                    Xrm.Navigation.openAlertDialog({ text: Sales.StringProvider.getResourceString(BulkEditNotSupported) });
                }
                else {
                    XrmCore.Commands.BulkEdit.bulkEditRecords(gridControl, records, entityTypeCode);
                }
            };
            // used by Quote.js 
            this.onLoadCloseQuoteDialog = function () {
                _this._initializeDialogLabelsForCloseQuote$p();
                _this.initializeDateControl(Sales.MetadataDrivenDialogConstantsQuoteClose.Date);
                _this.filterOptionSetValuesFromControl(Sales.EntityNames.Quote, _this._getCloseQuoteDialogClosedState$p(), Sales.MetadataDrivenDialogConstantsQuoteClose.Reason);
                _this._setVisibilityOfControl$p(Sales.MetadataDrivenDialogConstantsQuoteClose.CreateRevisedQuote, true);
                _this._setVisibilityCloseQuoteDialogCloseOpportunityControl$p();
            };
            /**
             * Handler that gets called when Fulfill/Cancel Order Dialog is opened
             */
            this.onLoadCloseOrderDialog = function () {
                var SalesOrderStateFulfilled = 3, closeState = _this._getCloseOrderDialogClosedState$p();
                if (closeState === SalesOrderStateFulfilled)
                    _this._initializeDialogLabelsForFulfillOrder$p();
                else
                    _this._initializeDialogLabelsForCancelOrder$p();
                _this._initializeCloseOrderDialogDate$p();
                _this.filterOptionSetValuesFromControl(Sales.EntityNames.SalesOrder, _this._getCloseOrderDialogClosedState$p(), Sales.MetadataDrivenDialogConstantsOrderClose.Reason);
            };
            this._initializeCloseOrderDialogDate$p = function () {
                var closeDateControl = Xrm.Page.getControl(Sales.MetadataDrivenDialogConstantsOrderClose.Date), closeDate = closeDateControl.getAttribute();
                closeDate.setValue(new Date);
            };
            this._initializeDialogLabelsForCancelOrder$p = function () {
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsOrderClose.DialogTitle, "Order_Cancel_Dlg_Title");
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsOrderClose.DialogDescription, "Order_Cancel_Dlg_Desc");
                _this.setControlLabelTextFromResourceString(ClientUtility.MetadataDrivenDialogConstants.DialogOkId, "Web.SFA.salesorders.aspx_ConfirmButton.dlg_close");
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsOrderClose.Date, "Web.SFA.salesorders.aspx_50.dlg_close");
            };
            this._initializeDialogLabelsForFulfillOrder$p = function () {
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsOrderClose.DialogTitle, "Order_Fulfill_Dlg_Title");
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsOrderClose.DialogDescription, "Order_Fulfill_Dlg_Desc");
                _this.setControlLabelTextFromResourceString(ClientUtility.MetadataDrivenDialogConstants.DialogOkId, "Web.SFA.salesorders.aspx_FulfillButton.dlg_close");
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsOrderClose.Date, "Web.SFA.salesorders.aspx_51.dlg_close");
            };
            this._getCloseOrderDialogReason$p = function () {
                var statusControl = Xrm.Page.getControl(Sales.MetadataDrivenDialogConstantsOrderClose.Reason), options = statusControl.getAttribute();
                return options.getSelectedOption().value;
            };
            this._getCloseOrderDialogClosedState$p = function () {
                var closedStateAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsOrderClose.ClosedState);
                return closedStateAttribute.getValue();
            };
            this._getCloseOrderDialogSalesOrderId$p = function () {
                var salesOrderIdAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsOrderClose.SalesId);
                return salesOrderIdAttribute.getValue().toString();
            };
            this._getCloseOrderDialogDescription$p = function () {
                var descriptionAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsOrderClose.Description);
                return descriptionAttribute.getValue();
            };
            this._getCloseOrderDialogDate$p = function () {
                var closeDateControl = Xrm.Page.getControl(Sales.MetadataDrivenDialogConstantsOrderClose.Date);
                return closeDateControl.getAttribute().getValue();
            };
            /**
             * Handler that gets called when Fulfill/Cancel Order Dialog is closed
             */
            this.onCloseCloseOrderDialog = function () {
                var salesOrderId = _this._getCloseOrderDialogSalesOrderId$p(), date = _this._getCloseOrderDialogDate$p(), description = _this._getCloseOrderDialogDescription$p(), closedState = _this._getCloseOrderDialogClosedState$p(), reason = _this._getCloseOrderDialogReason$p();
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsOrderClose.SalesId, salesOrderId);
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsOrderClose.Date, date);
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsOrderClose.Description, description);
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsOrderClose.Reason, reason);
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsOrderClose.ClosedState, closedState.toString());
                Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsOrderClose.LastButtonClicked).setValue(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                Xrm.Page.ui.close();
            };
            /**
             * Method that gets called to cancel/fulfill an order after closing the close order dialog
             * @param newStatus status that the order is changed to
             * @param closedDate date the order is fulfilled or cancelled
             * @param description for this action
             * @param closedState status reason for the change
             * @param salesOrderId id of the salesorder to change
             */
            this.PerformActionAfterCloseOrder = function (newStatus, closedDate, description, closedState, salesOrderId) {
                var fulfilledState = 3, salesOrderEntityRecord = null;
                if (!ClientUtility.DataUtil.isNullOrUndefined(closedDate)) {
                    var attributeTypes = {}, attributeValues = {}, attributeNames = new Array(3), salesorderid = new Xrm.Objects.EntityReference(Sales.EntityNames.SalesOrder, new Microsoft.Crm.Client.Core.Framework.Guid(salesOrderId)), attributeName = "salesorderid";
                    attributeNames[0] = attributeName;
                    attributeTypes[attributeName] = Xrm.Objects.AttributeType.lookup;
                    attributeValues[attributeName] = salesorderid;
                    attributeName = "actualend";
                    attributeNames[1] = attributeName;
                    attributeTypes[attributeName] = Xrm.Objects.AttributeType.dateTime;
                    attributeValues[attributeName] = closedDate;
                    attributeName = "description";
                    attributeNames[2] = attributeName;
                    attributeTypes[attributeName] = Xrm.Objects.AttributeType.string;
                    attributeValues[attributeName] = description;
                    var entityReference = new Xrm.Objects.EntityReference(Sales.EntityNames.OrderClose, Microsoft.Crm.Client.Core.Framework.Guid.get_empty());
                    var salesOrderEntityRecord = new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.EntityRecord(entityReference, attributeValues, attributeTypes, {}, {}, new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.RelatedEntityCollection(new Array(0)));
                    salesOrderEntityRecord.get_changedFieldNames().addRange(attributeNames);
                    Xrm.Page.data.save().then(function (successResponse) {
                        if (!ClientUtility.DataUtil.isNullOrUndefined(salesOrderEntityRecord))
                            if (closedState === fulfilledState) {
                                Xrm.Internal.messages.fulfillSalesOrder(salesOrderEntityRecord, newStatus).then(function (response) {
                                    Xrm.Page.data.refresh(true);
                                }, function (resp) {
                                    Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback(resp);
                                });
                            }
                            else {
                                Xrm.Internal.messages.cancelSalesOrder(salesOrderEntityRecord, newStatus).then(function (response) {
                                    Xrm.Page.data.refresh(true);
                                }, function (resp) {
                                    Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback(resp);
                                });
                            }
                    }, Mscrm.InternalUtilities.ClientApiUtility.operationFailedCallback);
                }
            };
            this.onCloseCloseQuoteDialog = function () {
                var quoteId = _this._getCloseQuoteDialogQuoteId$p(), closeDate = _this._getCloseQuoteDialogDate$p(), description = _this._getCloseQuoteDialogDescription$p(), closedState = _this._getCloseQuoteDialogClosedState$p(), reason = _this.getSelectedOptionValueFromOptionSetControl(Sales.MetadataDrivenDialogConstantsQuoteClose.Reason), createRevisedQuote = _this.getSelectedOptionValueFromOptionSetControl(Sales.MetadataDrivenDialogConstantsQuoteClose.CreateRevisedQuote), closeOpportunity = _this.getSelectedOptionValueFromOptionSetControl(Sales.MetadataDrivenDialogConstantsQuoteClose.CloseOpportunity), opportunityId = _this._getCloseQuoteDialogOpportunityId$p();
                if (ClientUtility.DataUtil.isNullOrUndefined(closeDate)) {
                    var alert = new ClientUtility.AlertDialogStrings;
                    alert.text = Sales.StringProvider.getResourceString("Web.SFA.opps.dlg_closeopp.aspx_67");
                    Xrm.Navigation.openAlertDialog(alert);
                }
                else {
                    var systemCloseDate = closeDate;
                    var timezoneOffsetMinutes = Xrm.Page.data.attributes.get('param_timezone').getValue();
                    closeDate = systemCloseDate.setMinutes(systemCloseDate.getMinutes() - systemCloseDate.getTimezoneOffset() - timezoneOffsetMinutes);
                    Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsQuoteClose.QuoteId, quoteId);
                    Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsQuoteClose.OpportunityId, opportunityId);
                    Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsQuoteClose.Date, closeDate);
                    Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsQuoteClose.Description, description);
                    Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsQuoteClose.ClosedState, closedState.toString());
                    Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsQuoteClose.Reason, reason);
                    Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsQuoteClose.CreateRevisedQuote, createRevisedQuote);
                    Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsQuoteClose.CloseOpportunity, closeOpportunity);
                    Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsQuoteClose.LastButtonClicked).setValue(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                    Xrm.Page.ui.close();
                }
            };
            this.dialogClose = function () {
                Mscrm.InternalUtilities.DialogUtility.closeDialog();
            };
            this.onCloseQuoteCreateRevisedChanged = function () {
                _this._setVisibilityCloseQuoteDialogCloseOpportunityControl$p();
            };
            this._initializeDialogLabelsForCloseQuote$p = function () {
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsQuoteClose.DialogTitle, "Close_Quote_Dlg_Title");
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsQuoteClose.DialogDescription, "Close_Quote_Dlg_Desc");
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsQuoteClose.Date, "Web.SFA.quotes.dlg_close.aspx_155");
            };
            this._setVisibilityCloseQuoteDialogCloseOpportunityControl$p = function () {
                var isOpportunityControlVisible = _this._getCloseQuoteDialogCanCloseOpportunity$p() && _this.getSelectedOptionValueFromOptionSetControl(Sales.MetadataDrivenDialogConstantsQuoteClose.CreateRevisedQuote) !== 1;
                _this._setVisibilityOfControl$p(Sales.MetadataDrivenDialogConstantsQuoteClose.CloseOpportunity, isOpportunityControlVisible);
            };
            this._getCloseQuoteDialogClosedState$p = function () {
                var closedStateAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsQuoteClose.ClosedState);
                return closedStateAttribute.getValue();
            };
            this._getCloseQuoteDialogCanCloseOpportunity$p = function () {
                var attribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsQuoteClose.CanCloseOpportunity);
                return attribute.getValue();
            };
            this._getCloseQuoteDialogQuoteId$p = function () {
                var quoteIdAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsQuoteClose.QuoteId);
                return quoteIdAttribute.getValue().toString();
            };
            this._getCloseQuoteDialogOpportunityId$p = function () {
                var attribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsQuoteClose.OpportunityId);
                return !ClientUtility.DataUtil.isNullOrUndefined(attribute.getValue()) ? attribute.getValue().toString() : null;
            };
            this._getCloseQuoteDialogDescription$p = function () {
                var descriptionAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsQuoteClose.Description);
                return descriptionAttribute.getValue();
            };
            this._getCloseQuoteDialogDate$p = function () {
                var closeDateControl = Xrm.Page.getControl(Sales.MetadataDrivenDialogConstantsQuoteClose.Date);
                return closeDateControl.getAttribute().getValue();
            };
            // Create Order
            /**
             * onLoad handler for the CreateOrder dialog
             *  - sets localized labels
             *  - initializes date & option set controls
             *  - hides controls that aren't applicable to the current quote
             */
            this.onLoadCreateOrderDialog = function () {
                _this._initializeDialogLabelsForCreateOrder$p();
                _this.initializeDateControl(Sales.MetadataDrivenDialogConstantsOrderCreate.Date);
                _this.filterOptionSetValuesFromControl(Sales.EntityNames.Quote, _this._getCreateOrderDialogClosedState$p(), Sales.MetadataDrivenDialogConstantsOrderCreate.Reason);
                _this._updateCreateOrderDialogUiState$p();
                var actualRevenue = Xrm.Page.data.attributes.get('actualrevenue_id');
                var quoteAttribute = Xrm.Page.data.attributes.get('param_quoteid');
                if (!ClientUtility.DataUtil.isNullOrUndefined(quoteAttribute) && !ClientUtility.DataUtil.isNullOrUndefined(quoteAttribute.getValue())) {
                    var quoteid = quoteAttribute.getValue();
                    var quoteRetrieveOptions = "?$select=quoteid&$expand=transactioncurrencyid($select=currencysymbol,currencyprecision)";
                    Xrm.WebApi.retrieveRecord(Sales.EntityNames.Quote, quoteid, quoteRetrieveOptions).then((function (response) {
                        if (!ClientUtility.DataUtil.isNullOrUndefined(response)) {
                            var quoteRecord = response;
                            if (!ClientUtility.DataUtil.isNullOrUndefined(quoteRecord.transactioncurrencyid)) {
                                var transactionCurrencyRecord = quoteRecord.transactioncurrencyid;
                                _this.setCurrencySymbolAndPrecision(transactionCurrencyRecord, actualRevenue);
                            }
                        }
                    }).bind(_this), ClientUtility.ActionFailedHandler.actionFailedErrorDialog);
                }
            };
            //Function to set the currency format and Precision in currency control
            this.setCurrencySymbolAndPrecision = function (transactionCurrencyRecord, actualRevenue) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(transactionCurrencyRecord) && !ClientUtility.DataUtil.isNullOrUndefined(transactionCurrencyRecord.currencysymbol)) {
                    var currencySymbol = transactionCurrencyRecord.currencysymbol;
                    actualRevenue.setCurrencySymbol(currencySymbol);
                }
            };
            /**
             * onClick handler for the CreateOrder dialog OK button
             *  - sets attriutes based on dialog controls
             *  - closes the dialog
             */
            this.onCloseCreateOrderDialog = function () {
                var reason = _this.getSelectedOptionValueFromOptionSetControl(Sales.MetadataDrivenDialogConstantsOrderCreate.Reason), canCloseOpportunity = _this._getCreateOrderDialogCanCloseOpportunity$p(), closeOpportunity = canCloseOpportunity && _this.getSelectedOptionValueFromOptionSetControl(Sales.MetadataDrivenDialogConstantsOrderCreate.CloseOpportunity) === _this._yesOptionSetValue$p, description = _this._getCreateOrderDialogDescription$p(), reasonDescription = _this._getCreateOrderStatusReasonDescription$p(), closeDate = _this._getCreateOrderDialogDate$p(), actualRevenue = "", useGivenRevenue = closeOpportunity && _this.getSelectedOptionValueFromOptionSetControl(Sales.MetadataDrivenDialogConstantsOrderCreate.CalculateRevenueFromQuote) !== _this._yesOptionSetValue$p;
                if (useGivenRevenue)
                    actualRevenue = _this._getCreateOrderDialogActualRevenue$p();
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsOrderCreate.Date, closeDate);
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsOrderCreate.Description, description);
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsOrderCreate.Reason, reason);
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsOrderCreate.ReasonDescription, reasonDescription);
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsOrderCreate.CalculateRevenueFromQuote, !useGivenRevenue ? 1 : 0);
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsOrderCreate.CloseOpportunity, closeOpportunity ? 1 : 0);
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsOrderCreate.ActualRevenue, actualRevenue);
                Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsOrderCreate.LastButtonClicked).setValue(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                Xrm.Page.ui.close();
            };
            /**
             * onChange handler to hide the controls for closing the related opportunity if closeOpportunity is changed to false; Show them if changed to true
             */
            this.onCreateOrderCloseOpportunityChanged = function () {
                _this._updateCreateOrderDialogUiState$p();
            };
            /**
             * onChange handler to show the control to provide actual revenue if changed to false; hide if changed to true
             */
            this.onCreateOrderCalculateRevenueFromQuoteChanged = function () {
                _this._updateCreateOrderDialogUiState$p();
            };
            /**
             * onChange handler to disable the OK button if actualRevenue is required but is blank; enable it otherwise
             */
            this.onCreateOrderActualRevenueChanged = function () {
                _this._updateCreateOrderDialogUiState$p();
            };
            /**
             * Shows/hides controls and enables/disables OK button based on the options given in the dialog
             */
            this._updateCreateOrderDialogUiState$p = function () {
                var canCloseOpportunity = _this._getCreateOrderDialogCanCloseOpportunity$p();
                _this._setVisibilityOfControl$p(Sales.MetadataDrivenDialogConstantsOrderCreate.CloseOpportunity, canCloseOpportunity);
                var shouldCloseOpportunity = canCloseOpportunity && _this.getSelectedOptionValueFromOptionSetControl(Sales.MetadataDrivenDialogConstantsOrderCreate.CloseOpportunity) === _this._yesOptionSetValue$p;
                _this._setVisibilityOfControl$p(Sales.MetadataDrivenDialogConstantsOrderCreate.CalculateRevenueFromQuote, shouldCloseOpportunity);
                _this._setVisibilityOfControl$p(Sales.MetadataDrivenDialogConstantsOrderCreate.ActualRevenue, shouldCloseOpportunity && _this.getSelectedOptionValueFromOptionSetControl(Sales.MetadataDrivenDialogConstantsOrderCreate.CalculateRevenueFromQuote) !== _this._yesOptionSetValue$p);
                var control = Xrm.Page.ui.controls.get(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                if (shouldCloseOpportunity && _this.getSelectedOptionValueFromOptionSetControl(Sales.MetadataDrivenDialogConstantsOrderCreate.CalculateRevenueFromQuote) !== _this._yesOptionSetValue$p && !_this._getCreateOrderHasActualRevenueValue$p())
                    control.setDisabled(true);
                else
                    control.setDisabled(false);
            };
            /**
             * getter for the value of canCloseOpportunity provided by the user
             */
            this._getCreateOrderDialogCanCloseOpportunity$p = function () {
                var attribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsOrderCreate.CanCloseOpportunity);
                return attribute.getValue();
            };
            /**
             * Sets dialog labels to localized strings
             */
            this._initializeDialogLabelsForCreateOrder$p = function () {
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsOrderCreate.DialogTitle, "Accept_Quote_Dlg_Title");
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsOrderCreate.DialogDescription, "Accept_Quote_Dlg_Desc");
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsOrderCreate.Date, "Web.SFA.quotes.aspx_50.dlg_accept");
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsOrderCreate.Description, "Web.SFA.salesorders.aspx_60.dlg_close");
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsOrderCreate.ActualRevenue, "Web.SFA.quotes.aspx_60.dlg_accept");
            };
            /**
             * Getters for dialog controls (including hidden controls)
             */
            this._getCreateOrderDialogClosedState$p = function () {
                var closedStateAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsOrderCreate.ClosedState);
                return closedStateAttribute.getValue();
            };
            this._getCreateOrderHasActualRevenueValue$p = function () {
                var actualRevenueControl = Xrm.Page.getControl(Sales.MetadataDrivenDialogConstantsOrderCreate.ActualRevenue), actualRevenue = actualRevenueControl.getAttribute();
                return !ClientUtility.DataUtil.isNullOrUndefined(actualRevenue) && !ClientUtility.DataUtil.isNullOrUndefined(actualRevenue.getValue());
            };
            this._getCreateOrderDialogDate$p = function () {
                var closeDateControl = Xrm.Page.getControl(Sales.MetadataDrivenDialogConstantsOrderCreate.Date);
                return closeDateControl.getAttribute().getValue();
            };
            this._getCreateOrderDialogDescription$p = function () {
                var descriptionAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsQuoteClose.Description);
                return descriptionAttribute.getValue();
            };
            this._getCreateOrderDialogActualRevenue$p = function () {
                var actualRevenueControl = Xrm.Page.getControl(Sales.MetadataDrivenDialogConstantsOrderCreate.ActualRevenue), actualRevenue = actualRevenueControl.getAttribute();
                return actualRevenue.getValue();
            };
            this._getCreateOrderStatusReasonDescription$p = function () {
                var optionSetControl = Xrm.Page.getControl(Sales.MetadataDrivenDialogConstantsOrderCreate.Reason), options = optionSetControl.getAttribute();
                return options.getSelectedOption().text;
            };
            /**
             * Creates the order & closes the quote & opportunity
             * @param newStatus the new status for the quote
             * @param newStatusMsg the new statusReason for the quote
             * @param closeDate the close date for the quote
             * @param description the description for the quoteClose
             * @param closeOpportunity whether the opportunity associated with the quote should be closed
             * @param useGivenRevenue whether the user provided revenue in the dialog
             * @param actualRevenue the revenue the user provided in the dialog
             */
            this.performActionAfterAcceptQuote = function (newStatus, newStatusMsg, closeDate, description, closeOpportunity, useGivenRevenue, actualRevenue) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(closeDate)) {
                    var commandData = {};
                    commandData["NewStatusCode"] = newStatus;
                    commandData["CloseDate"] = closeDate;
                    commandData["Description"] = description;
                    commandData["CloseOpportunity"] = closeOpportunity;
                    commandData["UseRevenue"] = useGivenRevenue;
                    commandData["ActualRevenue"] = actualRevenue;
                    var subjectTemplate = Xrm.Page.context.client.getClient() === Xrm.ClientName.mobile ? Xrm.Internal.getResourceString("Quote_Won_Subject") : Xrm.Internal.getResourceString("LOCID_QUOTE_WON_SUBJECT"), subject = ClientUtility.StringUtil.format(subjectTemplate, newStatusMsg, Xrm.Page.data.entity.attributes.get("quotenumber").getValue(), Sys.CultureInfo.InvariantCulture);
                    _this._winQuoteAndCreateOrder$p(closeDate, commandData, useGivenRevenue, subject);
                }
            };
            /**
             * Creates an order for the quote
             * @param quoteCloseDate the close date of the quote
             * @param commandData the data from the create order dialog
             * @param useGivenRevene whether the related opportunity should be closed with actual or calculated revenue
             * @param subject the subjectx for the CloseQuote entity
             */
            this._winQuoteAndCreateOrder$p = function (quoteCloseDate, commandData, useGivenRevenue, subject) {
                var columnSet = Microsoft.Crm.Client.Core.Storage.Common.AllColumns.get_instance();
                Xrm.Internal.messages.winQuoteAndCreateOrder(new Microsoft.Crm.Client.Core.Framework.Guid(Xrm.Page.data.entity.getId()), columnSet, quoteCloseDate, commandData["NewStatusCode"], subject, commandData["Description"]).then(function (responseCreateOrder) {
                    var childEntity = responseCreateOrder.entity, quoteSalesOrderId = childEntity.get_identifier().Id.toString();
                    if (commandData["CloseOpportunity"]) {
                        var val = Xrm.Page.data.entity.attributes.get("opportunityid").getValue();
                        if (!ClientUtility.DataUtil.isNullOrUndefined(val) && !ClientUtility.DataUtil.isNullOrUndefined(val[0]) && !ClientUtility.DataUtil.isNullOrUndefined(val[0].id)) {
                            var closeOpportunitySubjectTemplate = Xrm.Page.context.client.getClient() === Xrm.ClientName.mobile ? Xrm.Internal.getResourceString("Close_Opportunity_Activity_Subject") : Xrm.Internal.getResourceString("LOCID_OPPORTUNITY_CLOSED_SUBJECT"), activitySubject = ClientUtility.StringUtil.format(closeOpportunitySubjectTemplate, childEntity.getFieldObjectData("name").toString()), actualRevenue = "";
                            if (useGivenRevenue) {
                                actualRevenue = commandData["ActualRevenue"].toString();
                                _this._closeOpportunity$p(commandData["CloseDate"], val[0].id, activitySubject, actualRevenue, quoteSalesOrderId);
                            }
                            else {
                                Xrm.Internal.messages.calculateActualOpportunityValue(new Microsoft.Crm.Client.Core.Framework.Guid(val[0].id)).then(function (responseCalculate) {
                                    actualRevenue = responseCalculate.value.toString();
                                    _this._closeOpportunity$p(commandData["CloseDate"], val[0].id, activitySubject, actualRevenue, quoteSalesOrderId);
                                }, Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback);
                            }
                        }
                    }
                    else
                        !ClientUtility.DataUtil.isNullOrEmptyString(quoteSalesOrderId) &&
                            Xrm.Utility.openEntityForm(Sales.EntityNames.SalesOrder, quoteSalesOrderId);
                }, Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback);
            };
            /**
             * Closes the given opportunity
             * @param closeDate the date this opportunity was closed
             * @param oppId the guid of the opportunity to close
             * @param activitySubject the subject for the opportunityClose entity
             * @param actualRevenue the actual revenue for the opportunity
             * @param quoteSalesOrderId the guid of the new sales order associated with this opportunity
             */
            this._closeOpportunity$p = function (closeDate, oppId, activitySubject, actualRevenue, quoteSalesOrderId) {
                var oppattributeTypes = {}, oppattributeValues = {}, oppattributeNames = new Array(3), oppattributeName = "actualvalue";
                oppattributeNames[0] = oppattributeName;
                oppattributeTypes[oppattributeName] = Xrm.Objects.AttributeType.money;
                oppattributeValues[oppattributeName] = actualRevenue;
                oppattributeName = "actualclosedate";
                oppattributeNames[1] = oppattributeName;
                oppattributeTypes[oppattributeName] = Xrm.Objects.AttributeType.dateTime;
                oppattributeValues[oppattributeName] = new Date;
                oppattributeName = "closeprobability";
                oppattributeNames[2] = oppattributeName;
                oppattributeTypes[oppattributeName] = Xrm.Objects.AttributeType.integer;
                oppattributeValues[oppattributeName] = 100;
                var oppEntityReference = new Xrm.Objects.EntityReference(Sales.EntityNames.Opportunity, new Microsoft.Crm.Client.Core.Framework.Guid(oppId)), opportunityRecord = new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.EntityRecord(oppEntityReference, oppattributeValues, oppattributeTypes, {}, {}, new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.RelatedEntityCollection(new Array(0)));
                opportunityRecord.get_changedFieldNames().addRange(oppattributeNames);
                Xrm.Internal.messages.update(opportunityRecord).then(function (oppUpdateresponse) {
                    var closeoppattributeTypes = {}, closeoppattributeValues = {}, closeoppattributeNames = new Array(6), closeoppattributeName = "activityid";
                    closeoppattributeNames[0] = closeoppattributeName;
                    closeoppattributeTypes[closeoppattributeName] = Xrm.Objects.AttributeType.uniqueIdentifier;
                    closeoppattributeValues[closeoppattributeName] = Microsoft.Crm.Client.Core.Framework.Guid.newGuid();
                    closeoppattributeName = "opportunityid";
                    closeoppattributeNames[1] = closeoppattributeName;
                    closeoppattributeTypes[closeoppattributeName] = Xrm.Objects.AttributeType.lookup;
                    closeoppattributeValues[closeoppattributeName] = new Xrm.Objects.EntityReference(Sales.EntityNames.Opportunity, new Microsoft.Crm.Client.Core.Framework.Guid(oppId));
                    closeoppattributeName = "actualend";
                    closeoppattributeNames[2] = closeoppattributeName;
                    closeoppattributeTypes[closeoppattributeName] = Xrm.Objects.AttributeType.dateTime;
                    closeoppattributeValues[closeoppattributeName] = closeDate;
                    closeoppattributeName = "subject";
                    closeoppattributeNames[3] = closeoppattributeName;
                    closeoppattributeTypes[closeoppattributeName] = Xrm.Objects.AttributeType.string;
                    closeoppattributeValues[closeoppattributeName] = activitySubject;
                    closeoppattributeName = "actualrevenue";
                    closeoppattributeNames[4] = closeoppattributeName;
                    closeoppattributeTypes[closeoppattributeName] = Xrm.Objects.AttributeType.money;
                    closeoppattributeValues[closeoppattributeName] = actualRevenue;
                    closeoppattributeName = "ownerid";
                    closeoppattributeNames[5] = closeoppattributeName;
                    closeoppattributeTypes[closeoppattributeName] = Xrm.Objects.AttributeType.lookup;
                    var ownerLookup = Xrm.Page.data.entity.attributes.get("ownerid").getValue()[0];
                    closeoppattributeValues[closeoppattributeName] = new Xrm.Objects.EntityReference(ownerLookup.entityType, new Microsoft.Crm.Client.Core.Framework.Guid(ownerLookup.id));
                    var oppCloseEntityReference = new Xrm.Objects.EntityReference(Sales.EntityNames.OpportunityClose, Microsoft.Crm.Client.Core.Framework.Guid.get_empty()), opportunityCloseRecord = new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.EntityRecord(oppCloseEntityReference, closeoppattributeValues, closeoppattributeTypes, {}, {}, new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.RelatedEntityCollection(new Array(0)));
                    opportunityCloseRecord.get_changedFieldNames().addRange(closeoppattributeNames);
                    Xrm.Internal.messages.winOpportunity(opportunityCloseRecord, -1).then(function (oppOppCloseresponse) {
                        !ClientUtility.DataUtil.isNullOrEmptyString(quoteSalesOrderId) &&
                            Xrm.Utility.openEntityForm(Sales.EntityNames.SalesOrder, quoteSalesOrderId);
                    }, Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback);
                }, Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback);
            };
            // Invoice Dialog
            this.onLoadCloseInvoiceDialog = function () {
                var InvoicePaidState = 2, closeState = _this._getCloseInvoiceDialogClosedState$p();
                if (closeState === InvoicePaidState)
                    _this._initializeDialogLabelsForPaidInvoice$p();
                else
                    _this._initializeDialogLabelsForCancelInvoice$p();
                _this.filterOptionSetValuesFromControl(Sales.EntityNames.Invoice, _this._getCloseInvoiceDialogClosedState$p(), Sales.MetadataDrivenDialogConstantsInvoiceClose.Reason);
            };
            this.onCloseCloseInvoiceDialog = function () {
                var invoiceId = _this._getCloseInvoiceDialogInvoiceId$p(), closedState = _this._getCloseInvoiceDialogClosedState$p(), reason = _this._getCloseInvoiceDialogReason$p();
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsInvoiceClose.ClosedState, closedState.toString());
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsInvoiceClose.InvoiceId, invoiceId);
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsInvoiceClose.Reason, reason.toString());
                Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsInvoiceClose.LastButtonClicked).setValue(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                Xrm.Page.ui.close();
            };
            this._initializeDialogLabelsForPaidInvoice$p = function () {
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsInvoiceClose.DialogTitle, "Dialog_PaidInvoice_Title");
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsInvoiceClose.DialogDescription, "Dialog_PaidInvoice_Description");
            };
            this._initializeDialogLabelsForCancelInvoice$p = function () {
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsInvoiceClose.DialogTitle, "Dialog_CancelInvoice_Title");
                _this.setControlLabelTextFromResourceString(Sales.MetadataDrivenDialogConstantsInvoiceClose.DialogDescription, "Dialog_CancelInvoice_Description");
            };
            this._getCloseInvoiceDialogReason$p = function () {
                var statusControl = Xrm.Page.getControl(Sales.MetadataDrivenDialogConstantsInvoiceClose.Reason), options = statusControl.getAttribute();
                return options.getSelectedOption().value;
            };
            this._getCloseInvoiceDialogClosedState$p = function () {
                var closedStateAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsInvoiceClose.ClosedState);
                return closedStateAttribute.getValue();
            };
            this._getCloseInvoiceDialogInvoiceId$p = function () {
                var invoiceIdAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsInvoiceClose.InvoiceId);
                return invoiceIdAttribute.getValue().toString();
            };
            this.lock = function () {
                if (!Xrm.Page.data.getIsValid()) {
                    return;
                }
                _this._strtypeName$p = Xrm.Page.data.entity.getEntityName();
                switch (_this._strtypeName$p) {
                    case "salesorder":
                        Xrm.Internal.messages.lockSalesOrderPricing(Microsoft.Crm.Client.Core.Framework.Guid.tryCreate(Xrm.Page.data.entity.getId())).then(function (response) {
                            Xrm.Utility.openEntityForm(_this._strtypeName$p, Xrm.Page.data.entity.getId(), null);
                        }, Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback);
                        break;
                    case "invoice":
                        Xrm.Internal.messages.lockInvoicePricing(Xrm.Page.data.entity.getId()).then(function (response) {
                            Xrm.Utility.openEntityForm(_this._strtypeName$p, Xrm.Page.data.entity.getId(), null);
                        }, Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback);
                        break;
                    default:
                        break;
                }
            };
            this.unlock = function () {
                if (!Xrm.Page.data.getIsValid()) {
                    return;
                }
                _this._strtypeName$p = Xrm.Page.data.entity.getEntityName();
                switch (_this._strtypeName$p) {
                    case "salesorder":
                        Xrm.Internal.messages.unlockSalesOrderPricing(Microsoft.Crm.Client.Core.Framework.Guid.tryCreate(Xrm.Page.data.entity.getId())).then(function (response) {
                            Xrm.Utility.openEntityForm(_this._strtypeName$p, Xrm.Page.data.entity.getId(), null);
                        }, Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback);
                        break;
                    case "invoice":
                        Xrm.Internal.messages.unlockInvoicePricing(Xrm.Page.data.entity.getId()).then(function (response) {
                            Xrm.Utility.openEntityForm(_this._strtypeName$p, Xrm.Page.data.entity.getId(), null);
                        }, Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback);
                        break;
                    default:
                        break;
                }
            };
            /**
            Get Products dialog
            */
            this.onLoadGetProductsDialog = function () {
                //add transaction currency param to lookup
                var opportunityLookupControl = Xrm.Page.getControl(Sales.MetadataDrivenDialogConstantsGetProducts.OpportunityLookup);
                _this.addTransactionCurrencyParam(opportunityLookupControl, Sales.MetadataDrivenDialogConstantsGetProducts.TransactionCurrencyId);
                //default lookup to opportunity associated with quote
                var opportunityLookupAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsGetProducts.OpportunityLookup);
                var opportunityLookup = {};
                opportunityLookup["entityType"] = Sales.EntityNames.Opportunity;
                opportunityLookup["id"] = _this._getGetProductsOpportunityId$p();
                opportunityLookup["name"] = _this._getGetProductsName$p();
                opportunityLookupAttribute.setValue([opportunityLookup]);
            };
            this.onCloseGetProductsDialog = function () {
                var opportunityId = _this.getIdFromLookupAttribute(Sales.MetadataDrivenDialogConstantsGetProducts.OpportunityLookup);
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsGetProducts.OpportunityId, opportunityId);
                Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsGetProducts.LastButtonClicked).setValue(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                Xrm.Page.ui.close();
            };
            this._getGetProductsOpportunityId$p = function () {
                var opportunityIdAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsGetProducts.OpportunityId);
                return opportunityIdAttribute.getValue();
            };
            this._getGetProductsName$p = function () {
                var nameAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsGetProducts.Name);
                return nameAttribute.getValue();
            };
            this.getProducts = function () {
                if (!Xrm.Page.data.getIsValid()) {
                    return;
                }
                var aoItems = Xrm.Page.getAttribute("opportunityid"), sOppID = "", sOppName = "", dataValue = null;
                if (!ClientUtility.DataUtil.isNullOrUndefined(aoItems) && !ClientUtility.DataUtil.isNullOrUndefined(aoItems.getValue())) {
                    dataValue = aoItems.getValue();
                    sOppID = dataValue[0].id;
                    sOppName = dataValue[0].name;
                }
                var transactionCurrencyId = Xrm.Page.getAttribute("transactioncurrencyid");
                if (!ClientUtility.DataUtil.isNullOrUndefined(transactionCurrencyId)) {
                    dataValue = transactionCurrencyId.getValue();
                }
                var callBackAfterGetProducts = _this.performActionAfterGetProducts, dlgDialogBox = new Xrm.DialogOptions, dialogParams = {};
                dlgDialogBox.width = 400;
                dlgDialogBox.height = 200;
                dialogParams[Sales.MetadataDrivenDialogConstantsGetProducts.OpportunityId] = sOppID;
                dialogParams[Sales.MetadataDrivenDialogConstantsGetProducts.Name] = sOppName;
                dialogParams[Sales.MetadataDrivenDialogConstantsGetProducts.TransactionCurrencyId] = dataValue[0].id;
                Xrm.Dialog.openDialog(Sales.DialogName.GetProducts, dlgDialogBox, dialogParams, callBackAfterGetProducts, null);
            };
            this.performActionAfterGetProducts = function (result) {
                var lastButtonClicked = result[Sales.MetadataDrivenDialogConstantsGetProducts.LastButtonClicked];
                if (ClientUtility.DataUtil.isNullOrUndefined(lastButtonClicked) || lastButtonClicked.toString() !== ClientUtility.MetadataDrivenDialogConstants.DialogOkId) {
                    return;
                }
                if (!ClientUtility.DataUtil.isNullOrUndefined(result)) {
                    var typeName = Xrm.Page.data.entity.getEntityName();
                    switch (typeName) {
                        case "quote":
                            Xrm.Internal.messages.getProductsForQuote(new Microsoft.Crm.Client.Core.Framework.Guid(result[Sales.MetadataDrivenDialogConstantsGetProducts.OpportunityId]), new Microsoft.Crm.Client.Core.Framework.Guid(Xrm.Page.data.entity.getId())).then(function (response) {
                                Xrm.Page.data.refresh(true);
                            }, Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback);
                            break;
                        case "salesorder":
                            Xrm.Internal.messages.getSalesOrderProductsFromOpportunity(Microsoft.Crm.Client.Core.Framework.Guid.tryCreate(result[Sales.MetadataDrivenDialogConstantsGetProducts.OpportunityId]), Microsoft.Crm.Client.Core.Framework.Guid.tryCreate(Xrm.Page.data.entity.getId())).then(function (response) {
                                Xrm.Page.data.refresh(true);
                            }, Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback);
                            break;
                    }
                }
            };
            this.reCalculate = function () {
                if (!Xrm.Page.data.getIsValid()) {
                    return;
                }
                Xrm.Page.data.save().then(function () {
                    var recalculatePriceRequest = new ODataContract.RecalculatePriceRequest({ guid: ClientUtility.Guid.create(Xrm.Page.data.entity.getId()) }, Xrm.Page.data.entity.getEntityName());
                    Xrm.WebApi.online.execute(recalculatePriceRequest).then(function () {
                        Xrm.Page.data.refresh(false);
                    }, ClientUtility.ActionFailedHandler.actionFailedCallback);
                }, Mscrm.InternalUtilities.ClientApiUtility.operationFailedCallback);
            };
            this.setPrevDataValueIfAttributeNotNull = function (attributeName) {
                var attribute = Xrm.Page.data.entity.attributes.get(attributeName);
                if (!ClientUtility.DataUtil.isNull(attribute)) {
                    _this.setValueIfNotNull(attribute.getName(), "prevDataValue", attribute.getValue());
                }
            };
            this.setNumberAttributePrecisionIfNotNull = function (attributeName, value) {
                var attribute = Xrm.Page.data.entity.attributes.get(attributeName);
                if (!ClientUtility.DataUtil.isNull(attribute)) {
                    attribute.setPrecision(value);
                }
            };
            this.canAppendToCustomer = function () {
                var entityId = Xrm.Page.data.entity.getId();
                if (Xrm.Page.context.client.getClientState() !== Xrm.ClientState.online || ClientUtility.DataUtil.isNullOrEmptyString(entityId))
                    return false;
                if (_this._isAppendPrivilegeCalculated$p)
                    return _this._canAppendCustomer$p;
                else {
                    var customer = Xrm.Page.data.entity.attributes.get("customerid");
                    if (!ClientUtility.DataUtil.isNullOrUndefined(customer)) {
                        var customerValue = customer.getValue();
                        !ClientUtility.DataUtil.isNullOrUndefined(customerValue) && customerValue.length &&
                            _this._calculateAppendPrivileges$p(function (value) {
                                _this._canAppendCustomer$p = value;
                                _this._isAppendPrivilegeCalculated$p = true;
                                if (_this._canAppendCustomer$p) {
                                    var readyStateCheckInterval = 0;
                                    readyStateCheckInterval = window.setInterval(function () {
                                        Xrm.Page.ui.refreshRibbon();
                                        window.clearInterval(readyStateCheckInterval);
                                    }, 200);
                                }
                            });
                    }
                }
                return false;
            };
            this._calculateAppendPrivileges$p = function (callbackFunction) {
                var customer = Xrm.Page.data.entity.attributes.get("customerid");
                if (ClientUtility.DataUtil.isNullOrUndefined(customer))
                    callbackFunction(false);
                else {
                    var customerValue = customer.getValue();
                    if (ClientUtility.DataUtil.isNullOrUndefined(customerValue) || !customerValue.length)
                        callbackFunction(false);
                    else {
                        var customerLookup = customerValue[0], target = new Xrm.Objects.EntityReference(customerLookup.entityType, new Microsoft.Crm.Client.Core.Framework.Guid(customerLookup.id), customerLookup.name), principal = new Xrm.Objects.EntityReference("systemuser", new Microsoft.Crm.Client.Core.Framework.Guid(Xrm.Page.context.getUserId()));
                        Xrm.Internal.messages.retrievePrincipalAccess(target, principal).then(function (response) {
                            var retrievePrincipalAccessResponse = response;
                            retrievePrincipalAccessResponse.accessRights & Xrm.Gen.AccessRights.appendToAccess &&
                                callbackFunction(true);
                        }, function () {
                            callbackFunction(false);
                        });
                    }
                }
            };
            this.closeQuoteAndOpportunity = function (newStatus, opportunityStatus, opportunityState, description, closeDate, activityXml, opportunityInfo, createRevision, closeOpportunity) {
                var attributeTypes = {}, attributeValues = {}, attributeNames = new Array(8), attributeName = "activityid";
                attributeNames[0] = attributeName;
                attributeTypes[attributeName] = Xrm.Objects.AttributeType.uniqueIdentifier;
                attributeValues[attributeName] = Microsoft.Crm.Client.Core.Framework.Guid.newGuid();
                attributeName = "actualend";
                attributeNames[1] = attributeName;
                attributeTypes[attributeName] = Xrm.Objects.AttributeType.dateTime;
                attributeValues[attributeName] = closeDate;
                attributeName = "quoteid";
                attributeNames[2] = attributeName;
                attributeTypes[attributeName] = Xrm.Objects.AttributeType.lookup;
                attributeValues[attributeName] = new Xrm.Objects.EntityReference(Sales.EntityNames.Quote, new Microsoft.Crm.Client.Core.Framework.Guid(Xrm.Page.data.entity.getId()));
                attributeName = "subject";
                attributeNames[3] = attributeName;
                attributeTypes[attributeName] = Xrm.Objects.AttributeType.string;
                var subject = Xrm.Page.context.client.getClient() === Xrm.ClientName.mobile ? Xrm.Internal.getResourceString("Quote_Closed_Subject") : Xrm.Internal.getResourceString("LOCID_QUOTE_CLOSED_SUBJECT");
                attributeValues[attributeName] = subject;
                attributeName = "description";
                attributeNames[4] = attributeName;
                attributeTypes[attributeName] = Xrm.Objects.AttributeType.string;
                attributeValues[attributeName] = !ClientUtility.DataUtil.isNullOrUndefined(description) ? description : Xrm.Page.data.entity.attributes.get("description").getValue();
                attributeName = "quotenumber";
                attributeNames[5] = attributeName;
                attributeTypes[attributeName] = Xrm.Objects.AttributeType.string;
                attributeValues[attributeName] = Xrm.Page.data.entity.attributes.get("quotenumber").getValue();
                attributeName = "revision";
                attributeNames[6] = attributeName;
                attributeTypes[attributeName] = Xrm.Objects.AttributeType.integer;
                attributeValues[attributeName] = Xrm.Page.data.entity.attributes.get("revisionnumber").getValue();
                attributeName = "ownerid";
                attributeNames[7] = attributeName;
                attributeTypes[attributeName] = Xrm.Objects.AttributeType.lookup;
                var ownerLookup = Xrm.Page.data.entity.attributes.get("ownerid").getValue()[0];
                attributeValues[attributeName] = new Xrm.Objects.EntityReference(ownerLookup.entityType, new Microsoft.Crm.Client.Core.Framework.Guid(ownerLookup.id));
                var entityReference = new Xrm.Objects.EntityReference(Sales.EntityNames.QuoteClose, Microsoft.Crm.Client.Core.Framework.Guid.get_empty());
                attributeName = "param_timezone";
                attributeNames[8] = attributeName;
                attributeTypes[attributeName] = Xrm.Utility.getGlobalContext().userSettings.getTimeZoneOffsetMinutes();
                var closeQuote = new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.EntityRecord(entityReference, attributeValues, attributeTypes, {}, {}, new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.RelatedEntityCollection(new Array(0)));
                closeQuote.get_changedFieldNames().addRange(attributeNames);
                Xrm.Internal.messages.closeQuote(closeQuote, newStatus).then(function (responseCloseQuote) {
                    if (closeOpportunity)
                        _this._winOrLoseOpportunity$p(opportunityInfo, opportunityState, opportunityStatus, createRevision);
                    else
                        _this._reviseQuote$p(createRevision);
                }, Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback);
            };
            this._winOrLoseOpportunity$p = function (opportunityInfo, opportunityState, opportunityStatus, createRevision) {
                var attributeName, closeOppAttributeTypes = {}, closeOppAattributeValues = {}, closeOppAattributeNames;
                if ("competitor" in opportunityInfo && !ClientUtility.DataUtil.isNullOrEmptyString(opportunityInfo["competitor"]))
                    closeOppAattributeNames = new Array(8);
                else
                    closeOppAattributeNames = new Array(7);
                var actualRevenue = "", actualEnd = new Date, oppId = Microsoft.Crm.Client.Core.Framework.Guid.get_empty(), opportunityName = "";
                if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data.entity.attributes.get("opportunityid").getValue())) {
                    attributeName = "opportunityid";
                    closeOppAattributeNames[0] = attributeName;
                    closeOppAttributeTypes[attributeName] = Xrm.Objects.AttributeType.lookup;
                    closeOppAattributeValues[attributeName] = new Xrm.Objects.EntityReference(Sales.EntityNames.Opportunity, new Microsoft.Crm.Client.Core.Framework.Guid(Xrm.Page.data.entity.attributes.get("opportunityid").getValue()[0].id));
                    oppId = new Microsoft.Crm.Client.Core.Framework.Guid(Xrm.Page.data.entity.attributes.get("opportunityid").getValue()[0].id);
                    opportunityName = _this.getNameFromLookupAttribute("opportunityid");
                }
                attributeName = "description";
                closeOppAattributeNames[1] = attributeName;
                closeOppAttributeTypes[attributeName] = Xrm.Objects.AttributeType.string;
                closeOppAattributeValues[attributeName] = !ClientUtility.DataUtil.isNullOrUndefined(opportunityInfo["description"]) ? opportunityInfo["description"].toString() : null;
                attributeName = "subject";
                closeOppAattributeNames[2] = attributeName;
                closeOppAttributeTypes[attributeName] = Xrm.Objects.AttributeType.string;
                closeOppAattributeValues[attributeName] = !ClientUtility.DataUtil.isNullOrUndefined(opportunityName) ? opportunityName : null;
                attributeName = "actualrevenue";
                closeOppAattributeNames[3] = attributeName;
                closeOppAttributeTypes[attributeName] = Xrm.Objects.AttributeType.money;
                actualRevenue = !ClientUtility.DataUtil.isNullOrUndefined(opportunityInfo["actualRevenue"]) ? opportunityInfo["actualRevenue"].toString() : null;
                closeOppAattributeValues[attributeName] = actualRevenue;
                attributeName = "actualend";
                closeOppAattributeNames[4] = attributeName;
                closeOppAttributeTypes[attributeName] = Xrm.Objects.AttributeType.dateTime;
                if (!ClientUtility.DataUtil.isNullOrUndefined(opportunityInfo["actualEnd"])) {
                    var date;
                    if (_this.isDateTime(opportunityInfo["actualEnd"]))
                        date = opportunityInfo["actualEnd"];
                    else
                        date = Xrm.Internal.parseDate(opportunityInfo["actualEnd"].toString());
                    closeOppAattributeValues[attributeName] = date;
                    actualEnd = date;
                }
                else
                    closeOppAattributeValues[attributeName] = null;
                attributeName = "activityid";
                closeOppAattributeNames[5] = attributeName;
                closeOppAttributeTypes[attributeName] = Xrm.Objects.AttributeType.uniqueIdentifier;
                closeOppAattributeValues[attributeName] = Microsoft.Crm.Client.Core.Framework.Guid.newGuid();
                attributeName = "ownerid";
                closeOppAattributeNames[6] = attributeName;
                closeOppAttributeTypes[attributeName] = Xrm.Objects.AttributeType.lookup;
                var ownerLookup = Xrm.Page.data.entity.attributes.get("ownerid").getValue()[0];
                closeOppAattributeValues[attributeName] = new Xrm.Objects.EntityReference(ownerLookup.entityType, new Microsoft.Crm.Client.Core.Framework.Guid(ownerLookup.id));
                if ("competitor" in opportunityInfo && !ClientUtility.DataUtil.isNullOrEmptyString(opportunityInfo["competitor"])) {
                    attributeName = "competitorid";
                    closeOppAattributeNames[7] = attributeName;
                    closeOppAttributeTypes[attributeName] = Xrm.Objects.AttributeType.lookup;
                    closeOppAattributeValues[attributeName] = new Xrm.Objects.EntityReference(Sales.EntityNames.Opportunity, new Microsoft.Crm.Client.Core.Framework.Guid(opportunityInfo["competitor"].toString()));
                }
                var closeOppReference = new Xrm.Objects.EntityReference(Sales.EntityNames.OpportunityClose, Microsoft.Crm.Client.Core.Framework.Guid.get_empty()), closeOppEntity = new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.EntityRecord(closeOppReference, closeOppAattributeValues, closeOppAttributeTypes, {}, {}, new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.RelatedEntityCollection(new Array(0)));
                closeOppEntity.get_changedFieldNames().addRange(closeOppAattributeNames);
                var OpportunityStateWon = 1;
                if (opportunityState === OpportunityStateWon)
                    Xrm.Internal.messages.winOpportunity(closeOppEntity, opportunityStatus).then(function (responseWinOpportunity) {
                        _this._updateOppAndReviseQuote$p(createRevision, actualRevenue, actualEnd, oppId);
                    }, Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback);
                else
                    Xrm.Internal.messages.loseOpportunity(closeOppEntity, opportunityStatus).then(function (responseWinOpportunity) {
                        _this._updateOppAndReviseQuote$p(createRevision, actualRevenue, actualEnd, oppId);
                    }, Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback);
            };
            this._reviseQuote$p = function (createRevision) {
                var columns = [], columnSet = new Microsoft.Crm.Client.Core.Storage.Common.ColumnSet(columns);
                if (createRevision)
                    Xrm.Internal.messages.reviseQuote(new Microsoft.Crm.Client.Core.Framework.Guid(Xrm.Page.data.entity.getId()), columnSet).then(function (responseReviseQuote) {
                        if (!ClientUtility.DataUtil.isNullOrUndefined(responseReviseQuote.entity))
                            Xrm.Utility.openEntityForm(Sales.EntityNames.Quote, responseReviseQuote.entity.get_identifier().Id.toString());
                        else
                            Xrm.Utility.openEntityForm(Sales.EntityNames.Quote, Xrm.Page.data.entity.getId());
                    }, Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback);
                else {
                    Xrm.Utility.openEntityForm(Sales.EntityNames.Quote, Xrm.Page.data.entity.getId());
                    _this._refreshParentWindow$p();
                }
            };
            this._refreshParentWindow$p = function () {
                var windowOpener = window.top.opener;
                windowOpener != null && windowOpener.Xrm.Page.data != null && windowOpener.Xrm.Page.data.entity != null && windowOpener.Xrm.Page.data.entity.getEntityName() == Sales.EntityNames.Opportunity &&
                    windowOpener.Xrm.Page.data.refresh(true);
            };
            this.getNameFromLookupAttribute = function (attribute) {
                var attributeName = Xrm.Page.data.entity.attributes.get(attribute);
                if (ClientUtility.DataUtil.isNullOrUndefined(attributeName) || ClientUtility.DataUtil.isNullOrEmptyString(attributeName.getValue()))
                    return "";
                var attributeNameValue = attributeName.getValue();
                return attributeNameValue[0].name;
            };
            this.getQuantityDecimal = function (entityName, recordId, productId, uomId, callbackFunction) {
                var uomIdGuid = Microsoft.Crm.Client.Core.Framework.Guid.tryCreate(uomId), productIdGuid = Microsoft.Crm.Client.Core.Framework.Guid.tryCreate(productId), recordIdGuid = Microsoft.Crm.Client.Core.Framework.Guid.tryCreate(recordId);
                if (Mscrm.InternalUtilities.JSTypes.isNull(recordIdGuid))
                    return;
                var target = new Xrm.Objects.EntityReference(entityName, recordIdGuid);
                !Mscrm.InternalUtilities.JSTypes.isNull(uomIdGuid) && !Mscrm.InternalUtilities.JSTypes.isNull(productIdGuid) && !Mscrm.InternalUtilities.JSTypes.isNull(target) &&
                    Xrm.Internal.messages.getQuantityDecimal(target, productIdGuid, uomIdGuid).then(function (response) {
                        callbackFunction(response.quantity);
                    }, function (response) {
                    });
            };
            this._updateOppAndReviseQuote$p = function (createRevision, actualRevenue, actualEnd, oppId) {
                var oppattributeTypes = {}, oppattributeValues = {}, oppattributeNames = new Array(2), oppattributeName = "actualvalue";
                oppattributeNames[0] = oppattributeName;
                oppattributeTypes[oppattributeName] = Xrm.Objects.AttributeType.money;
                oppattributeValues[oppattributeName] = actualRevenue;
                oppattributeName = "actualclosedate";
                oppattributeNames[1] = oppattributeName;
                oppattributeTypes[oppattributeName] = Xrm.Objects.AttributeType.dateTime;
                oppattributeValues[oppattributeName] = actualEnd;
                var oppEntityReference = new Xrm.Objects.EntityReference(Sales.EntityNames.Opportunity, oppId), opportunityRecord = new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.EntityRecord(oppEntityReference, oppattributeValues, oppattributeTypes, {}, {}, new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.RelatedEntityCollection(new Array(0)));
                opportunityRecord.get_changedFieldNames().addRange(oppattributeNames);
                Xrm.Internal.messages.update(opportunityRecord).then(function (oppUpdateresponse) {
                    _this._reviseQuote$p(createRevision);
                }, Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback);
            };
            // Create Discount List
            this.showCreateDiscountListDialog = function () {
                var __this = _this;
                Xrm.Internal.messages.whoAmI().then(function (response) {
                    Xrm.Internal.messages.retrieve(Sales.EntityNames.SystemUser, response.userId.toString(), ["transactioncurrencyid"]).then(function (user) {
                        if (user.entity.hasValue("transactioncurrencyid")) {
                            __this._openCreateDiscountListDialog$p(user.entity.getFieldObjectData("transactioncurrencyid"));
                        }
                        else {
                            Xrm.Internal.messages.retrieve(Sales.EntityNames.Organization, response.organizationId.toString(), ["basecurrencyid"]).then(function (org) {
                                __this._openCreateDiscountListDialog$p(org.entity.getFieldObjectData("basecurrencyid"));
                            });
                        }
                    });
                });
            };
            this._openCreateDiscountListDialog$p = function (transactionCurrencyRef) {
                var dialogOptions = new Xrm.DialogOptions();
                dialogOptions.height = 650;
                dialogOptions.width = 650;
                var dialogParams = {};
                if (transactionCurrencyRef) {
                    dialogParams[Sales.MetadataDrivenDialogConstantsCreateDiscountList.TransactionCurrencyId] = transactionCurrencyRef["id"];
                    dialogParams[Sales.MetadataDrivenDialogConstantsCreateDiscountList.TransactionCurrencyName] = transactionCurrencyRef["name"];
                }
                Xrm.Dialog.openDialog(Sales.DialogName.CreateDiscountList, dialogOptions, dialogParams, _this.performActionAfterCreateDicountList, null);
            };
            this.performActionAfterCreateDicountList = function (dialogParams) {
                var lastButtonClicked = dialogParams[Sales.MetadataDrivenDialogConstantsCreateDiscountList.LastButtonClicked];
                if (ClientUtility.DataUtil.isNullOrUndefined(lastButtonClicked) || lastButtonClicked.toString() !== ClientUtility.MetadataDrivenDialogConstants.DialogOkId) {
                    return;
                }
                var fields = {}, fieldTypes = {}, changedFieldNames = [], transactionCurrencyRef = new Xrm.Objects.EntityReference(Sales.EntityNames.TransactionCurrency, new Microsoft.Crm.Client.Core.Framework.Guid(dialogParams[Sales.MetadataDrivenDialogConstantsCreateDiscountList.TransactionCurrencyId])), discountListGuid = Microsoft.Crm.Client.Core.Framework.Guid.newGuid(), discountListKey = new Xrm.Objects.EntityReference(Sales.EntityNames.DiscountType, discountListGuid), discountList = new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.EntityRecord(discountListKey, fields, fieldTypes, {}, {}, {});
                fields["isamounttype"] = dialogParams[Sales.MetadataDrivenDialogConstantsCreateDiscountList.IsAmountType] === "true";
                fields["name"] = dialogParams[Sales.MetadataDrivenDialogConstantsCreateDiscountList.Name];
                fieldTypes["isamounttype"] = Xrm.Objects.AttributeType.boolean;
                fieldTypes["name"] = Xrm.Objects.AttributeType.string;
                if (dialogParams[Sales.MetadataDrivenDialogConstantsCreateDiscountList.IsAmountType] === "true") {
                    fields["transactioncurrencyid"] = transactionCurrencyRef;
                    fieldTypes["transactioncurrencyid"] = Xrm.Objects.AttributeType.lookup;
                    changedFieldNames = ['isamounttype', 'name', 'transactioncurrencyid'];
                }
                else {
                    changedFieldNames = ['isamounttype', 'name'];
                }
                discountList.get_changedFieldNames().addRange(changedFieldNames);
                Xrm.Internal.messages.create(discountList).then(function (createResponse) {
                    Xrm.Utility.refreshParentGrid({ entityType: Sales.EntityNames.DiscountType, id: createResponse.id, name: undefined });
                    Xrm.Utility.openEntityForm(Sales.EntityNames.DiscountType, createResponse.id.toString());
                }, function (resp) {
                    fields["CRMWRPCToken"] = dialogParams[Sales.MetadataDrivenDialogConstantsCreateDiscountList.CRMWRPCToken];
                    fields["CRMWRPCTokenTimeStamp"] = dialogParams[Sales.MetadataDrivenDialogConstantsCreateDiscountList.CRMWRPCTokenTimeStamp];
                    fields["isamounttype"] = fields["isamounttype"] ? 1 : 0;
                    Xrm.Utility.openEntityForm(Sales.EntityNames.DiscountType, null, fields);
                });
            };
            this.onLoadCreateDiscountListDialog = function () {
                //default lookup to current default currency
                var currencyLookupAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsCreateDiscountList.TransactionCurrency);
                if (currencyLookupAttribute) {
                    var currencyLookup = {};
                    currencyLookup["entityType"] = Sales.EntityNames.TransactionCurrency;
                    currencyLookup["id"] = _this._getCreateDiscountListTransactionCurrencyId$p();
                    currencyLookup["name"] = _this._getCreateDiscountListTransactionCurrencyName$p();
                    currencyLookupAttribute.setValue([currencyLookup]);
                }
                //hide currency control since default is percent not amount
                _this._updateCreateDiscountListDialogUiState$p();
            };
            this.onCloseCreateDiscountListDialog = function () {
                var transactionCurrencyIdAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsCreateDiscountList.TransactionCurrency), discountListname = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsCreateDiscountList.NameId).getValue(), isAmountType = _this._getCreateDiscountListType$p() === Sales.DiscountTypeIsAmountType.Amount;
                if (!ClientUtility.DataUtil.isNullOrUndefined(transactionCurrencyIdAttribute) && !ClientUtility.DataUtil.isNullOrUndefined(transactionCurrencyIdAttribute.getValue()[0].id)) {
                    var attributeValue = transactionCurrencyIdAttribute.getValue()[0].id;
                    var rawguid = attributeValue.rawguid;
                    // if id value is not as dictionary then remove the braces from the guid
                    if (ClientUtility.DataUtil.isNullOrUndefined(rawguid)) {
                        rawguid = attributeValue.toString().replace(/{|}| /gi, "");
                    }
                    Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsCreateDiscountList.TransactionCurrencyId, rawguid);
                }
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsCreateDiscountList.Name, discountListname);
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsCreateDiscountList.IsAmountType, isAmountType.toString());
                var token = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsCreateDiscountList.CRMWRPCToken).getValue(), tokenTimeStamp = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsCreateDiscountList.CRMWRPCTokenTimeStamp).getValue();
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsCreateDiscountList.CRMWRPCToken, token);
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsCreateDiscountList.CRMWRPCTokenTimeStamp, tokenTimeStamp);
                Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsCreateDiscountList.LastButtonClicked).setValue(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                Xrm.Page.ui.close();
            };
            this.onCreateDiscountListDialogTypeChanged = function () {
                _this._updateCreateDiscountListDialogUiState$p();
            };
            this.onCreateDiscountListDialogCurrencyChanged = function () {
                _this._updateCreateDiscountListDialogUiState$p();
            };
            this._getCreateDiscountListType$p = function () {
                var typeAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsCreateDiscountList.Type);
                return typeAttribute.getValue();
            };
            this._getCreateDiscountListTransactionCurrencyId$p = function () {
                var guidAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsCreateDiscountList.TransactionCurrencyId);
                return guidAttribute.getValue();
            };
            this._getCreateDiscountListTransactionCurrencyName$p = function () {
                var nameAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsCreateDiscountList.TransactionCurrencyName);
                return nameAttribute.getValue();
            };
            this._updateCreateDiscountListDialogUiState$p = function () {
                var transactionCurrencyVisible = _this._getCreateDiscountListType$p() !== Sales.DiscountTypeIsAmountType.Percentage;
                _this._setVisibilityOfControl$p(Sales.MetadataDrivenDialogConstantsCreateDiscountList.TransactionCurrency, transactionCurrencyVisible);
                var okButton = Xrm.Page.ui.controls.get(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                var transactionCurrency = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsCreateDiscountList.TransactionCurrency);
                okButton.setDisabled(transactionCurrencyVisible && (ClientUtility.DataUtil.isNullOrUndefined(transactionCurrency) || ClientUtility.DataUtil.isNullOrUndefined(transactionCurrency.getValue())));
            };
            // QOIUtilities.cs
            this.getIdFromLookupAttribute = function (attribute) {
                var attributeId = Xrm.Page.data.entity.attributes.get(attribute);
                if (ClientUtility.DataUtil.isNullOrUndefined(attributeId) || ClientUtility.DataUtil.isNullOrEmptyString(attributeId.getValue()))
                    return "";
                var attributeIdValue = attributeId.getValue();
                return attributeIdValue[0].id;
            };
            /**
             * Initializes a date control so that it can be used; sets the value to today's date
             * @param controlName the name of the date control
             */
            this.initializeDateControl = function (controlName) {
                var dateControl = Xrm.Page.getControl(controlName), date = dateControl.getAttribute();
                date.setValue(new Date);
            };
            /**
             * Filters an option set control so that only options valid for the given statecode (status) show up
             * @param entityName the name of the entity the option set is associated with
             * @param stateCode the statecode used to filter the options
             * @param controlId the control to filter
             */
            this.filterOptionSetValuesFromControl = function (entityName, stateCode, controlId) {
                var _thisref = _this;
                if (Mscrm.InternalUtilities.DialogUtility.isMocaOffline() && !Xrm.Utility.isEntityOfflineSyncEnabled(entityName)) {
                    Mscrm.InternalUtilities.DialogUtility.showMoCAOfflineError();
                    return;
                }
                var defaultStatusCode = 1;
                if (Xrm.Utility.isMocaOffline()) {
                    defaultStatusCode = Xrm.Utility.retrieveDefaultStatusForState(entityName, stateCode);
                    _thisref._filterOptionSetValuesFromControlWithDefault$p(entityName, stateCode, controlId, defaultStatusCode);
                }
                else
                    Xrm.Internal.messages.retrieveDefaultStatusForState(entityName, stateCode).then(function (response) {
                        if (!ClientUtility.DataUtil.isNullOrUndefined(response))
                            defaultStatusCode = response.status;
                        _thisref._filterOptionSetValuesFromControlWithDefault$p(entityName, stateCode, controlId, defaultStatusCode);
                    }, Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback);
            };
            this.addTransactionCurrencyParam = function (lookupControl, transactionCurrencyParamName) {
                var oTransCurId = null;
                var sTransCurId = "";
                var dataValue = null;
                if (!ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data)) {
                    oTransCurId = Xrm.Page.data.entity.attributes.get(transactionCurrencyParamName);
                    if (!ClientUtility.DataUtil.isNullOrUndefined(oTransCurId)) {
                        oTransCurId = Xrm.Page.getAttribute(transactionCurrencyParamName);
                        dataValue = oTransCurId.getValue();
                    }
                }
                if (!ClientUtility.DataUtil.isNullOrUndefined(dataValue)) {
                    sTransCurId = dataValue[0].id;
                }
                var fetchXml = '<filter type="and"><condition attribute="transactioncurrencyid" operator="like" value="';
                fetchXml += CrmEncodeDecode.CrmXmlAttributeEncode(sTransCurId);
                fetchXml += '"/></filter>';
                lookupControl.addCustomFilter(fetchXml);
            };
            this._setVisibilityOfControl$p = function (controlname, bDisabled) {
                var ctrl = Xrm.Page.ui.controls.get(controlname);
                !ClientUtility.DataUtil.isNullOrUndefined(ctrl) &&
                    ctrl.setVisible(bDisabled);
            };
            this.getSelectedOptionValueFromOptionSetControl = function (controlName) {
                var optionSetControl = Xrm.Page.getControl(controlName), options = optionSetControl.getAttribute();
                return options.getSelectedOption().value;
            };
            this.setControlLabelTextFromResourceString = function (controlId, resourceId) {
                var control = Xrm.Page.getControl(controlId);
                !ClientUtility.DataUtil.isNullOrUndefined(control) &&
                    control.setLabel(Xrm.Internal.getResourceString(resourceId));
            };
            this.isPricingLocked = function (entityName, entityId, callbackFunction) {
                if (entityName === Sales.EntityNames.Quote)
                    callbackFunction(false);
                else {
                    var isPriceLockedColumn = "ispricelocked";
                    Xrm.Internal.messages.retrieve(entityName, entityId, [isPriceLockedColumn]).then(function (response) {
                        var entity = response.entity;
                        var priceLocked = false;
                        if (entity.hasValue(isPriceLockedColumn)) {
                            var optionSet = entity.getValue(isPriceLockedColumn);
                            priceLocked = optionSet.getValue("value") === 1;
                        }
                        callbackFunction(priceLocked);
                    }, function (response) {
                    });
                }
            };
            this._filterOptionSetValuesFromControlWithDefault$p = function (entityName, stateCode, controlId, defaultStatusCode) {
                var statusCodeControl = Xrm.Page.getControl(controlId);
                var options = !ClientUtility.DataUtil.isNullOrUndefined(statusCodeControl) ? statusCodeControl.getAttribute() : null;
                var items = !ClientUtility.DataUtil.isNullOrUndefined(options) ? options.getOptions() : null;
                if (!ClientUtility.DataUtil.isNullOrUndefined(items) && items.length > 0) {
                    Xrm.Internal.getStatusOptionsFromStateCode(entityName, stateCode).then(function (statusOptions) {
                        // remove invalid options
                        if (!ClientUtility.DataUtil.isNullOrUndefined(statusOptions) && statusOptions.length >= 1) {
                            for (var i = 0; i < items.length; i++) {
                                var option = items[i];
                                if (statusOptions.indexOf(option.value) < 0) {
                                    statusCodeControl.removeOption(option.value);
                                }
                            }
                        }
                        // set value, if currently unset or invalid
                        var currentValue = options.getValue();
                        if (ClientUtility.DataUtil.isNullOrUndefined(currentValue) ||
                            !ClientUtility.DataUtil.isNullOrUndefined(statusOptions) && statusOptions.indexOf(currentValue) < 0) {
                            options.setValue(defaultStatusCode);
                        }
                    }, function () {
                        return;
                    });
                }
            };
            // TODO : 1. place this function in more generic utility
            //        2. Date.isInstanceOfType(value) add check
            this.isDateTime = function (value) {
                return Object.prototype.toString.call(value) === "[object Date]";
            };
            // SetState.cs
            this.setState = function (entityId, entityName, stateCode, statusCode, closeWindow, entityToOpen, entityIdToOpen) {
                if (ClientUtility.DataUtil.isNullOrUndefined(Xrm.Page.data.entity.getId()))
                    return;
                if (!Xrm.Page.data.getIsValid())
                    return;
                if (typeof statusCode === "undefined")
                    statusCode = -1;
                else if (stateCode === -1) {
                    Xrm.Internal.getStateCodeFromStatusOption(entityName, statusCode).then(function (statusStateCode) {
                        stateCode = statusStateCode;
                        _this._setStateInternal$p(entityId, entityName, stateCode, statusCode, closeWindow, entityToOpen, entityIdToOpen);
                    }, function () {
                        _this._setStateInternal$p(entityId, entityName, stateCode, statusCode, closeWindow, entityToOpen, entityIdToOpen);
                    });
                    return;
                }
                _this._setStateInternal$p(entityId, entityName, stateCode, statusCode, closeWindow, entityToOpen, entityIdToOpen);
            };
            this._setStateInternal$p = function (entityId, entityName, stateCode, statusCode, closeWindow, entityToOpen, entityIdToOpen) {
                var UpdateSuccessCallback = function (saveResponse) {
                    _this.setStateUpdate(entityId, entityName, stateCode, statusCode, closeWindow, entityToOpen, entityIdToOpen);
                }, ErrorCallback = function (saveResponse) {
                    _this._isBusy$p = false;
                };
                if (!_this._isBusy$p) {
                    _this._isBusy$p = true;
                    var saveOptions = {};
                    saveOptions.useSchedulingEngine = false;
                    Xrm.Page.data.save(saveOptions).then(UpdateSuccessCallback, ErrorCallback);
                }
            };
            this.setStateUpdate = function (entityId, entityName, stateCode, statusCode, closeWindow, entityToOpen, entityIdToOpen) {
                if (!entityId || !entityId.length)
                    entityId = Xrm.Page.data.entity.getId();
                if (Xrm.Utility.isMocaOffline()) {
                    var entityReference = new Xrm.Objects.EntityReference(entityName, new Microsoft.Crm.Client.Core.Framework.Guid(entityId)), request = new Xrm.Gen.SetStateRequest(entityReference, stateCode, statusCode, true), successCallback = function () {
                        _this._postSetState$p(entityId, entityName, closeWindow, entityToOpen, entityIdToOpen);
                    };
                    Xrm.Utility.executeNonCudCommand("SetState", entityName, request, successCallback, Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback);
                }
                else {
                    Xrm.WebApi.online.updateRecord(Sales.EntityNames.Invoice, entityId, { statecode: stateCode, statuscode: statusCode }).then(function (setStateResponse) {
                        _this._postSetState$p(entityId, entityName, closeWindow, entityToOpen, entityIdToOpen);
                    }, function (crmResponseError) {
                        _this._isBusy$p = false;
                        Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback(crmResponseError);
                    });
                }
            };
            this._postSetState$p = function (entityId, entityName, closeWindow, entityToOpen, entityIdToOpen) {
                if (typeof closeWindow !== "undefined" && closeWindow) {
                    if (!ClientUtility.DataUtil.isNullOrEmptyString(entityToOpen) && !ClientUtility.DataUtil.isNullOrEmptyString(entityIdToOpen)) {
                        !_this.isMobileCompanionApp() &&
                            Xrm.Page.ui.close();
                        Xrm.Utility.openEntityForm(entityToOpen, entityIdToOpen, null);
                    }
                    else if (Xrm.Internal.isEnabledForInteractionCentric() && Microsoft.Crm.Client.Core.ViewModels.ApplicationShellViewModel.get_instance().get_PrimaryConductor().get_ActiveNavigationStack().get_Count() === 1)
                        Xrm.Page.data.refresh(true);
                    else {
                        _this.refreshParentGrid(entityId, entityName);
                        Xrm.Page.ui.close();
                    }
                    _this._isBusy$p = false;
                    return;
                }
                if (!ClientUtility.DataUtil.isNullOrEmptyString(entityToOpen) && !ClientUtility.DataUtil.isNullOrEmptyString(entityIdToOpen))
                    Xrm.Utility.openEntityForm(entityToOpen, entityIdToOpen, null);
                else {
                    Xrm.Page.data.refresh(true);
                    _this.refreshParentGrid(entityId, entityName);
                    _this.performPageRefresh(true);
                }
                _this._isBusy$p = false;
            };
            this.refreshParentGrid = function (entityId, entityName) {
                if (entityName) {
                    var objectType = Xrm.Internal.getEntityCode(entityName);
                    Xrm.Internal.refreshParentGrid(objectType, "", entityId);
                }
            };
            this.deactivateDiscountType = function (gridControl, records, entityTypeCode, defaultCloseState, callback) {
                if (!records.length) {
                    Xrm.Dialog.openAlertDialog({ text: Xrm.Utility.getResourceString("TODO", "Error_Message_Action_NoItemSelected") });
                    return;
                }
                var options = new Xrm.DialogOptions;
                options.width = Sales.DialogConfirmStrings.DeactivateGridDialogWidth;
                options.height = Sales.MetadataDrivenDialogConstants.DiscountTypeDeactivateHeight;
                var ids = "", objectSubtype = null, entityName = Xrm.Internal.getEntityName(entityTypeCode);
                _this.openDeactivateDialog(gridControl, records, entityTypeCode, defaultCloseState, callback, options, ids, objectSubtype);
                Mscrm.InternalUtilities.MetricsReportingHelper.addTelemetryLog(Mscrm.InternalUtilities.MetricsReportingContext.grid, "Deactivate", entityTypeCode);
            };
            this.openDeactivateDialog = function (gridControl, records, entityTypeCode, defaultCloseState, callback, options, ids, objectSubtype) {
                var action = "deactivate", EntityName = Xrm.Internal.getEntityName(entityTypeCode);
                var selectedRecords = new Array(records.length);
                for (var i = 0; i < records.length; i++) {
                    selectedRecords[i] = { TypeCode: records[i].TypeCode, LogicalName: Xrm.Internal.getEntityName(records[i].TypeCode), Id: new Microsoft.Crm.Client.Core.Framework.Guid(records[i].Id) };
                }
                var dialogParams = {};
                dialogParams[ClientUtility.MetadataDrivenDialogConstants.Records] = _this.serializeSdkEntityReferences(selectedRecords);
                dialogParams[ClientUtility.MetadataDrivenDialogConstants.action] = Sales.MetadataDrivenDialogConstants.Deactivate;
                dialogParams[ClientUtility.MetadataDrivenDialogConstants.LastButtonClicked] = "";
                dialogParams[ClientUtility.MetadataDrivenDialogConstants.StateId] = -1;
                dialogParams[ClientUtility.MetadataDrivenDialogConstants.StatusId] = -1;
                if (!ClientUtility.DataUtil.isNullOrUndefined(defaultCloseState))
                    dialogParams[Sales.MetadataDrivenDialogConstants.DefaultCloseState] = defaultCloseState.toString();
                var dialogCallbackParams = {};
                dialogCallbackParams[ClientUtility.MetadataDrivenDialogConstants.GridControl] = gridControl;
                if (Mscrm.CommandBarActions.isWebClient() || Xrm.Page.context.client.getClient() === Xrm.Constants.ClientNames.outlook || Xrm.Page.context.client.getClient() === Xrm.Constants.ClientNames.unifiedServiceDesk) {
                    options.height = Sales.DialogConfirmStrings.DeactivateGridDialogHeight;
                    options.width = Sales.DialogConfirmStrings.DeactivateGridDialogWidth;
                }
                var __this = _this;
                var entityName = Xrm.Internal.getEntityName(entityTypeCode), onClose = function (dialogParams) {
                    __this.closeSetStateDialogFromGridCallback(dialogParams, dialogCallbackParams, callback);
                };
                Xrm.Dialog.openDialog(Sales.DialogName.SetStateDialog, options, dialogParams, onClose, null);
            };
            //Don't have access to DialogUtil and this was removed from Mscrm.InternalUtilities.DialogUtility
            this.serializeSdkEntityReferences = function (records) {
                return JSON.stringify(_this.getEntityReference(records));
            };
            this.deserializeSdkEntityReferences = function (stringifiedRecords) {
                if (ClientUtility.DataUtil.isNullOrEmptyString(stringifiedRecords))
                    return new Array(0);
                return _this.getEntityReference(JSON.parse(stringifiedRecords));
            };
            this.getEntityReference = function (records) {
                var entities = new Array(0);
                for (var i = 0; i < records.length; i++) {
                    var item = records[i];
                    var entity = {};
                    if (!ClientUtility.DataUtil.isNullOrUndefined(item.Name)) {
                        entity.Name = item.Name;
                    }
                    if (!ClientUtility.DataUtil.isNullOrUndefined(item.Id)) {
                        entity.Id = item.Id.toString();
                    }
                    if (!ClientUtility.DataUtil.isNullOrUndefined(item.TypeName)) {
                        entity.TypeName = item.TypeName;
                    }
                    if (!ClientUtility.DataUtil.isNullOrUndefined(item.TypeCode)) {
                        entity.TypeCode = item.TypeCode;
                    }
                    if (!ClientUtility.DataUtil.isNullOrUndefined(item.LogicalName)) {
                        entity.LogicalName = item.LogicalName;
                    }
                    entities[entities.length] = entity;
                }
                return entities;
            };
            this.deleteDiscountTypeRecords = function (gridControl, records, entityTypeCode) {
                var useLongHeight = false, dialogWidth = 570, dialogHeight = 205, longDialogHeight = 250, setSubTypes = false, dialogArguments = null, callbackRef = null, entityName = Xrm.Internal.getEntityName(entityTypeCode), confirmDialogStrings = new Xrm.ConfirmDialogStrings;
                if (records.length <= 0) {
                    Xrm.Dialog.openAlertDialog({ text: String.format(Xrm.Utility.getResourceString("TODO", "Error_Message_Action_NoItemSelected")) });
                    return;
                }
                confirmDialogStrings.text = String.format(Xrm.Internal.getResourceString("Dialog_Delete_Description"), Sales.EntityNames.DiscountType); //TODO get entity display name
                confirmDialogStrings.confirmButtonLabel = Xrm.Internal.getResourceString("Button_Label_Delete");
                confirmDialogStrings.cancelButtonLabel = Xrm.Internal.getResourceString("Button_Label_Cancel");
                confirmDialogStrings.title = Xrm.Internal.getResourceString("Web._grid.cmds.dlg_delete.aspx_26");
                confirmDialogStrings.subtitle = "";
                _this._openDeleteConfirmationDialog$p(gridControl, records, useLongHeight, dialogWidth, dialogHeight, longDialogHeight, setSubTypes, dialogArguments, callbackRef, entityName, confirmDialogStrings);
                Mscrm.InternalUtilities.MetricsReportingHelper.addTelemetryLog(Mscrm.InternalUtilities.MetricsReportingContext.grid, "Delete", entityTypeCode);
            };
            this._openDeleteConfirmationDialog$p = function (gridControl, records, useLongHeight, dialogWidth, dialogHeight, longDialogHeight, setSubTypes, dialogArguments, callbackRef, entityName, confirmDialogStrings) {
                var dialogOptions = new Xrm.DialogOptions;
                dialogOptions.height = dialogHeight;
                dialogOptions.width = dialogWidth;
                var confirmCallbackFunction = _this.performGridDeleteAction, confirmCallbackRef = function (response) { confirmCallbackFunction(response, gridControl, records); };
                Xrm.Dialog.openConfirmDialog(confirmDialogStrings, dialogOptions, confirmCallbackRef, null);
            };
            this.performGridDeleteAction = function (returnValue, gridControl, records) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(records) && records.length > 0) {
                    Mscrm.InternalUtilities.DialogUtility.showProgressMessage();
                    var entityName = Xrm.Internal.getEntityName(records[0].TypeCode);
                    if (Mscrm.InternalUtilities.DialogUtility.isMocaOffline() && !Xrm.Utility.isEntityOfflineSyncEnabled(entityName)) {
                        Mscrm.InternalUtilities.DialogUtility.hideProgressMessage();
                        Mscrm.InternalUtilities.DialogUtility.showMoCAOfflineError();
                        return;
                    }
                    if (records.length === 1)
                        Xrm.Internal.messages.deleteEntity(entityName, records[0].Id.toString()).then(function (response) {
                            Mscrm.InternalUtilities.DialogUtility.hideProgressMessage();
                            if (!ClientUtility.DataUtil.isNullOrUndefined(gridControl)) {
                                gridControl.refresh();
                            }
                        }, Mscrm.InternalUtilities.DialogUtility.actionFailedCallbackForMoca);
                    else
                        _this._performChainDelete$p(records, 0, gridControl, true);
                }
            };
            this._performChainDelete$p = function (records, currentIndex, gridControl, deletionSuccess) {
                var __this = _this;
                if (currentIndex >= records.length) {
                    Mscrm.InternalUtilities.DialogUtility.hideProgressMessage();
                    !deletionSuccess &&
                        Mscrm.CommandBarActions.openAlertDialogForDeleteMultipleError(gridControl);
                    gridControl.refresh();
                }
                else {
                    var entityReferenceName = records[currentIndex], entityName = Xrm.Internal.getEntityName(entityReferenceName.TypeCode);
                    Xrm.Internal.messages.deleteEntity(entityName, records[currentIndex].Id.toString()).then(function () {
                        __this._performChainDelete$p(records, currentIndex + 1, gridControl, deletionSuccess);
                    }, function () {
                        __this._performChainDelete$p(records, currentIndex + 1, gridControl, false);
                    });
                }
            };
            this.performActionAfterDeleteFromGrid = function (returnValue, gridControl, records) {
                if (Mscrm.CommandBarActions.isMobileCompanionApp() || Xrm.Page.context.client.getClient() === Xrm.Constants.ClientNames.outlook) {
                    gridControl.refresh();
                    return;
                }
                if (!ClientUtility.DataUtil.isNullOrUndefined(returnValue) && returnValue) {
                    if (!ClientUtility.DataUtil.isNullOrUndefined(records) && records.length > 0) {
                        for (var recids = new Array(records.length), i = 0; i < records.length; i++)
                            recids[i] = records[i].Id;
                    }
                    try {
                        gridControl.refresh();
                    }
                    catch ($$e_5) {
                    }
                }
            };
            this.discountTypeBulkEdit = function (gridControl, records, entityTypeCode) {
                if (records.length === 1) {
                    var parameters = {};
                    parameters["rof"] = false;
                    var record = records[0];
                    Xrm.Utility.openEntityForm(record.TypeName, record.Id, parameters);
                }
                else {
                    //Bulk edit is not enabled for discountType
                    var options = new Xrm.AlertDialogStrings;
                    options.text = Xrm.Internal.getResourceString("notEligibleBulkEdit");
                    Xrm.Dialog.openAlertDialog(options);
                }
                Mscrm.InternalUtilities.MetricsReportingHelper.addTelemetryLog(Mscrm.InternalUtilities.MetricsReportingContext.grid, "Edit", entityTypeCode);
            };
            this.discontTypeDeletePrimaryEntity = function (action, objectType, objectSubtype, callbackArgumentRef) {
                var id = Xrm.Page.data.entity.getId(), entityName = Xrm.Page.data.entity.getEntityName();
                var x = 450, y = 205, parameters = null;
                var confirmDialogStrings = new Xrm.ConfirmDialogStrings;
                parameters = [objectType, id];
                var dialogOptions = new Xrm.DialogOptions;
                dialogOptions.height = y;
                dialogOptions.width = x;
                confirmDialogStrings.text = String.format(Xrm.Internal.getResourceString("Dialog_Delete_Description"), Sales.EntityNames.DiscountType); //TODO get entity display name
                confirmDialogStrings.confirmButtonLabel = Xrm.Internal.getResourceString("Button_Label_Delete");
                confirmDialogStrings.cancelButtonLabel = Xrm.Internal.getResourceString("Button_Label_Cancel");
                confirmDialogStrings.title = Xrm.Internal.getResourceString("Web._grid.cmds.dlg_delete.aspx_26");
                confirmDialogStrings.subtitle = "";
                var __this = _this;
                var confirmCallbackFunction = function (dialogParams) {
                    __this.performDeleteAction(dialogParams, objectType, id);
                };
                Xrm.Dialog.openConfirmDialog(confirmDialogStrings, dialogOptions, confirmCallbackFunction, null);
                Mscrm.InternalUtilities.MetricsReportingHelper.addTelemetryLog(0, "Delete", objectType);
            };
            this.performDeleteAction = function (result, objectType, recordId) {
                if (!ClientUtility.DataUtil.isNullOrEmptyString(recordId)) {
                    var entityName = Xrm.Internal.getEntityName(objectType);
                    Mscrm.InternalUtilities.DialogUtility.showProgressMessage();
                    Xrm.Internal.messages.deleteEntity(entityName, recordId).then(function (response) {
                        Mscrm.InternalUtilities.DialogUtility.hideProgressMessage();
                        // TODO replace Xrm.Internal.refreshParentGrid
                        //Xrm.Internal.refreshParentGrid(objectType, "", recordId)
                        Mscrm.CommandBarActions.setFormDirty(false);
                        Xrm.Page.ui.close();
                    }, Mscrm.InternalUtilities.DialogUtility.actionFailedCallbackForMoca);
                }
            };
            this.closeSetStateDialogFromGridCallback = function (dialogParams, callbackParams, callback) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(dialogParams) && dialogParams[ClientUtility.MetadataDrivenDialogConstants.LastButtonClicked] === ClientUtility.MetadataDrivenDialogConstants.DialogOkId) {
                    var gridControl = callbackParams[ClientUtility.MetadataDrivenDialogConstants.GridControl], records = null, recordsAttribute = dialogParams[ClientUtility.MetadataDrivenDialogConstants.Records].toString();
                    Sys.Debug.assert(!ClientUtility.DataUtil.isNullOrUndefined(recordsAttribute) && !ClientUtility.DataUtil.isNullOrEmptyString(recordsAttribute), ClientUtility.MetadataDrivenDialogConstants.Records + " attribute cannot be null");
                    records = _this.deserializeSdkEntityReferences(recordsAttribute);
                    Sys.Debug.assert(!ClientUtility.DataUtil.isNullOrUndefined(records), ClientUtility.MetadataDrivenDialogConstants.Records + " value cannot be null");
                    var entityName, entityId = Microsoft.Crm.Client.Core.Framework.Guid.Empty, selectedState = parseInt(dialogParams[ClientUtility.MetadataDrivenDialogConstants.StateId].toString()), selectedStatus = parseInt(dialogParams[ClientUtility.MetadataDrivenDialogConstants.StatusId].toString());
                    Mscrm.InternalUtilities.DialogUtility.showProgressMessage();
                    if (records.length === 1) {
                        entityName = records[0].LogicalName.toString();
                        entityId = records[0].Id;
                        _this.setStateAndStatus(entityId.toString(), entityName, selectedState, selectedStatus, function (setStateResponse) {
                            Mscrm.InternalUtilities.DialogUtility.hideProgressMessage();
                            !ClientUtility.DataUtil.isNullOrUndefined(gridControl) &&
                                gridControl.refresh();
                            !ClientUtility.DataUtil.isNullOrUndefined(callback) &&
                                callback();
                        }, Mscrm.InternalUtilities.DialogUtility.actionFailedCallbackForMoca);
                    }
                    else
                        _this._performChainSetState$p(records, selectedState, selectedStatus, gridControl, 0, true, callback);
                }
            };
            this.setStateAndStatus = function (entityId, entityName, state, status, successCallback, errorCallback) {
                var attributeValues = { statecode: state, statuscode: status };
                var attributeTypes = { statecode: Xrm.Objects.AttributeType.state, statuscode: Xrm.Objects.AttributeType.status };
                var reference = new Xrm.Objects.EntityReference(entityName, entityId);
                var record = new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.EntityRecord(reference, attributeValues, attributeTypes, {}, {}, new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.RelatedEntityCollection(new Array(0)));
                var onError = errorCallback ? errorCallback : Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback;
                var onSuccess = successCallback ? successCallback : function (response) {
                    Xrm.Page.data.refresh(true).then(function (response) {
                        Xrm.Page.ui.refreshRibbon();
                    }, onError);
                };
                record.get_changedFieldNames().addRange(['statecode', 'statuscode']);
                Xrm.Internal.messages.update(record).then(onSuccess, onError);
            };
            this._performChainSetState$p = function (records, state, status, gridControl, currentIndex, setStateSuccess, onSuccess) {
                if (currentIndex >= records.length) {
                    Mscrm.InternalUtilities.DialogUtility.hideProgressMessage();
                    !setStateSuccess &&
                        _this.openAlertDialogForSetStateMultipleError(gridControl);
                    gridControl.refresh();
                    !ClientUtility.DataUtil.isNullOrUndefined(onSuccess) &&
                        onSuccess();
                }
                else {
                    var __this = _this;
                    var attributeTypes = {}, attributeValues = {};
                    _this.setStateAndStatus(records[currentIndex].Id.toString(), records[currentIndex].LogicalName.toString(), state, status, function () {
                        __this._performChainSetState$p(records, state, status, gridControl, currentIndex + 1, setStateSuccess, onSuccess);
                    }, function () {
                        __this._performChainSetState$p(records, state, status, gridControl, currentIndex + 1, false, onSuccess);
                    });
                }
            };
            this.openAlertDialogForSetStateMultipleError = function (gridControl) {
                var alertDialogStrings = new Xrm.AlertDialogStrings;
                alertDialogStrings.text = Xrm.Utility.getResourceString("TODO", "Error_Message_Action_MultipleErrorsFound");
                Xrm.Dialog.openAlertDialog(alertDialogStrings, null, function () {
                    gridControl.refresh();
                });
            };
            this.openAlertDialogForDeleteMultipleError = function (gridControl) {
                var alertDialogStrings = new Xrm.AlertDialogStrings;
                alertDialogStrings.text = Xrm.Utility.getResourceString("TODO", "Error_Message_Action_MultipleErrorsFound");
                Xrm.Dialog.openAlertDialog(alertDialogStrings, null, function () {
                    gridControl.refresh();
                });
            };
            this.performPageRefresh = function (shouldSaveAndRefresh) {
                if (Xrm.Internal.isEnabledForInteractionCentric())
                    if (shouldSaveAndRefresh)
                        Xrm.Page.data.save().then(function () {
                            _this.performPageDataAndRibbonRefresh();
                        }, Mscrm.InternalUtilities.ClientApiUtility.operationFailedCallback);
                    else
                        _this.performPageDataAndRibbonRefresh();
                else
                    Xrm.Page.data.refresh(true);
            };
            this.performPageDataAndRibbonRefresh = function () {
                Xrm.Page.data.refresh(true).then(function () {
                    Xrm.Page.ui.refreshRibbon();
                }, Mscrm.InternalUtilities.ClientApiUtility.operationFailedCallback);
            };
            this.isMobileCompanionApp = function () {
                return Xrm.Page.context.client.getClient() === Xrm.ClientName.mobile;
            };
            this.deleteSalesLiteratureItemRecords = function (gridControl, records, entityTypeCode) {
                var useLongHeight = false, dialogWidth = 570, dialogHeight = 205, longDialogHeight = 250, setSubTypes = false, dialogArguments = null, callbackRef = null, entityName = Xrm.Internal.getEntityName(entityTypeCode), confirmDialogStrings = new Xrm.ConfirmDialogStrings;
                if (records.length <= 0) {
                    Xrm.Dialog.openAlertDialog({ text: String.format(Xrm.Utility.getResourceString("TODO", "Error_Message_Action_NoItemSelected")) });
                    return;
                }
                var salesAttachmentLabel = Sales.StringProvider.getResourceString("SalesAttachmentDisplayName");
                confirmDialogStrings.text = String.format(Xrm.Internal.getResourceString("Dialog_Delete_Description"), salesAttachmentLabel);
                confirmDialogStrings.confirmButtonLabel = Xrm.Internal.getResourceString("Button_Label_Delete");
                confirmDialogStrings.cancelButtonLabel = Xrm.Internal.getResourceString("Button_Label_Cancel");
                confirmDialogStrings.title = Xrm.Internal.getResourceString("Web._grid.cmds.dlg_delete.aspx_26");
                confirmDialogStrings.subtitle = "";
                _this._openDeleteConfirmationDialog$p(gridControl, records, useLongHeight, dialogWidth, dialogHeight, longDialogHeight, setSubTypes, dialogArguments, callbackRef, entityName, confirmDialogStrings);
                Mscrm.InternalUtilities.MetricsReportingHelper.addTelemetryLog(Mscrm.InternalUtilities.MetricsReportingContext.grid, "Delete", entityTypeCode);
            };
            //Convert Activity
            this.convertActivityOnLoad = function () {
                _this.convertActivityActions.convertActivityOnLoad();
            };
            this.convertActivityClick = function () {
                _this.convertActivityActions.convertActivityClick();
            };
            this.convertActivityCallback = function (dialogParams, callbackParams) {
                _this.convertActivityActions.convertActivityCallback(dialogParams, callbackParams);
            };
            this.convertToOpportunityActivity = function (iObjType) {
                _this.convertActivityActions.convertToOpportunityActivity(iObjType);
            };
            //Contextual Email Actions
            this.shouldShowContextualEmailCommands = function (primaryControl) {
                return _this.contextualEmailActions.shouldShowContextualEmailCommands(primaryControl);
            };
            this.AttachFileAlert = function () {
                // Not supported in web
            };
            this.convertActivityActions = new ConvertActivityActionsLegacy();
            this.contextualEmailActions = new ContextualEmailActionsLegacy();
        }
        return SalesCommandBarActionsLegacy;
    }());
    Sales.SalesCommandBarActionsLegacy = SalesCommandBarActionsLegacy;
    var ConvertActivityActionsLegacy = (function () {
        function ConvertActivityActionsLegacy() {
            var _this = this;
            this.entityName = null;
            this.convertActivityOnLoad = function () {
                var activityTypeAttribute = Xrm.Page.getAttribute(ClientUtility.MetadataDrivenDialogConstants.EntityTypeCode);
                if (!ClientUtility.DataUtil.isNullOrUndefined(activityTypeAttribute)) {
                    var activityType = activityTypeAttribute.getValue();
                    var labelControl = Xrm.Page.getControl(Sales.MetadataDrivenDialogConstants.SaveActivityId);
                    if (!ClientUtility.DataUtil.isNullOrUndefined(labelControl))
                        if (activityType === Sales.EntityTypeCodes.Email)
                            labelControl.setLabel(Xrm.Internal.getResourceString("ConvertActivity_Action_CloseEmail"));
                        else
                            labelControl.setLabel(String.format(Xrm.Internal.getResourceString("ConvertActivity_Action_SaveActivity"), Xrm.Internal.getEntityName(activityType)));
                }
                if (!Xrm.Utility.isMocaOffline() || Xrm.Utility.isEntityOfflineSyncEnabled(Sales.EntityNames.Lead)) {
                    var entityAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstants.LeadId);
                    if (!ClientUtility.DataUtil.isNullOrUndefined(entityAttribute)) {
                        var leadId = entityAttribute.getValue();
                        if (!ClientUtility.DataUtil.isNullOrUndefined(leadId) && leadId.length) {
                            var leadLookup = Xrm.Page.getControl(Sales.MetadataDrivenDialogConstants.LeadLookup);
                            if (!ClientUtility.DataUtil.isNullOrUndefined(leadLookup)) {
                                leadLookup.setVisible(true);
                            }
                        }
                    }
                }
                var subjectAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstants.Subject);
                if (!ClientUtility.DataUtil.isNullOrUndefined(subjectAttribute)) {
                    var subject = subjectAttribute.getValue();
                    if (ClientUtility.DataUtil.isNullOrUndefined(subject) || !subject.length) {
                        var subjectControl = Xrm.Page.getControl(Sales.MetadataDrivenDialogConstants.Subject);
                        if (!ClientUtility.DataUtil.isNullOrUndefined(subjectControl)) {
                            subjectControl.setDisabled(true);
                        }
                    }
                }
                var dialogArgs = Mscrm.InternalUtilities.DialogUtility.getDialogArguments();
                var customerLookupAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstants.CustomerLookup);
                if (!ClientUtility.DataUtil.isNullOrUndefined(customerLookupAttribute)) {
                    var customerLookup = customerLookupAttribute.getValue();
                    if (ClientUtility.DataUtil.isNullOrUndefined(customerLookup)) {
                        if (!ClientUtility.DataUtil.isNullOrUndefined(dialogArgs)) {
                            var customerLookupObj = dialogArgs[Sales.MetadataDrivenDialogConstants.CustomerLookup];
                            customerLookupAttribute.setValue(customerLookupObj);
                        }
                    }
                }
                var currencyLookupAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstants.CurrencyLookup);
                if (!ClientUtility.DataUtil.isNullOrUndefined(currencyLookupAttribute)) {
                    var currencyLookup = currencyLookupAttribute.getValue();
                    if (ClientUtility.DataUtil.isNullOrUndefined(currencyLookup)) {
                        if (!ClientUtility.DataUtil.isNullOrUndefined(dialogArgs)) {
                            var currencyLookupObj = dialogArgs[Sales.MetadataDrivenDialogConstants.CurrencyLookup];
                            currencyLookupAttribute.setValue(currencyLookupObj);
                        }
                    }
                }
            };
            this.convertActivityClick = function () {
                if (Mscrm.InternalUtilities.DialogUtility.isMocaOffline()) {
                    var entityTypeCodeAttribute = Mscrm.InternalUtilities.DialogUtility.getAttributeValue(ClientUtility.MetadataDrivenDialogConstants.EntityTypeCode);
                    _this.entityName = Xrm.Internal.getEntityName(parseInt(entityTypeCodeAttribute).toString());
                    if (!Xrm.Utility.isEntityOfflineSyncEnabled(_this.entityName)) {
                        Mscrm.InternalUtilities.DialogUtility.showMoCAOfflineError();
                        return;
                    }
                }
                var errorString = new Xrm.AlertDialogStrings;
                var customerId = Microsoft.Crm.Client.Core.Framework._String.empty;
                var currencyId = Microsoft.Crm.Client.Core.Framework._String.empty;
                var campaignId = Microsoft.Crm.Client.Core.Framework._String.empty;
                var subject = Microsoft.Crm.Client.Core.Framework._String.empty;
                var entityId = Microsoft.Crm.Client.Core.Framework._String.empty;
                var entityTypeCode = 0;
                var ownerId = Microsoft.Crm.Client.Core.Framework._String.empty;
                var ownerTypeCode = 0;
                var ownerName = Microsoft.Crm.Client.Core.Framework._String.empty;
                var leadId = Microsoft.Crm.Client.Core.Framework._String.empty;
                var saveActivity = "false";
                var openNewRecord = "false";
                var entityName = Microsoft.Crm.Client.Core.Framework._String.empty;
                var typeCode = 0;
                var customerLookup = Xrm.Page.data.entity.attributes.get(Sales.MetadataDrivenDialogConstants.CustomerLookup);
                var selectedItem = customerLookup.getValue();
                if (ClientUtility.DataUtil.isNullOrUndefined(selectedItem) || !selectedItem.length) {
                    errorString.text = Xrm.Internal.getResourceString(Xrm.Internal.getResourceString("Alert_Conv_Act_Customer_Must"));
                    Xrm.Dialog.openAlertDialog(errorString, null, null);
                    return;
                }
                else {
                    customerId = selectedItem[0].id;
                    entityName = selectedItem[0].entityType;
                    typeCode = Xrm.Internal.getEntityCode(entityName);
                }
                var currencyLookup = Xrm.Page.data.entity.attributes.get(Sales.MetadataDrivenDialogConstants.CurrencyLookup);
                selectedItem = currencyLookup.getValue();
                if (ClientUtility.DataUtil.isNullOrUndefined(selectedItem) || !selectedItem.length) {
                    errorString.text = Xrm.Internal.getResourceString(Xrm.Internal.getResourceString("Alert_Conv_Act_Currency_Must"));
                    Xrm.Dialog.openAlertDialog(errorString, null, null);
                    return;
                }
                else {
                    currencyId = selectedItem[0].id;
                }
                Xrm.Page.data.attributes.get(Sales.MetadataDrivenDialogConstantsConvertActivity.LastButtonClicked).setValue(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                if (!ClientUtility.DataUtil.isNull(Mscrm.InternalUtilities.DialogUtility.getAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.Subject))) {
                    subject = Mscrm.InternalUtilities.DialogUtility.getAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.Subject).toString();
                }
                entityId = Mscrm.InternalUtilities.DialogUtility.getAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.EntityId).toString();
                entityTypeCode = parseInt(Mscrm.InternalUtilities.DialogUtility.getAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.EntityTypeCode).toString());
                ownerId = Mscrm.InternalUtilities.DialogUtility.getAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.OwnerId).toString();
                ownerTypeCode = parseInt(Mscrm.InternalUtilities.DialogUtility.getAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.OwnerType).toString());
                if (!ClientUtility.DataUtil.isNullOrUndefined(Mscrm.InternalUtilities.DialogUtility.getAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.OwnerName))) {
                    ownerName = Mscrm.InternalUtilities.DialogUtility.getAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.OwnerName).toString();
                }
                var saveActivityItemChecked = Mscrm.InternalUtilities.DialogUtility.getAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.SaveActivity);
                if (saveActivityItemChecked) {
                    saveActivity = "true";
                }
                var openNewItemChecked = Mscrm.InternalUtilities.DialogUtility.getAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.OpenNewChecked);
                if (openNewItemChecked) {
                    openNewRecord = "true";
                }
                Mscrm.InternalUtilities.DialogUtility.showProgressMessage();
                if (Xrm.Utility.isMocaOffline()) {
                    var opportunityRecord = _this.getOpportunityEntityRecord(subject, entityId, entityTypeCode, customerId, typeCode, ownerId, ownerTypeCode, leadId, currencyId, campaignId, Sales.EntityTypeCodes.Campaign, ownerName);
                    _this.offlineConvertActivity(entityId, entityTypeCode, opportunityRecord, saveActivity, openNewRecord);
                }
                else {
                    var that = _this;
                    _this.convertToOpportunity(function (response) {
                        var oppId = response.recordId.toString();
                        that.postConvertActivity(oppId, saveActivity, openNewRecord);
                    }, function (response) {
                        Mscrm.InternalUtilities.DialogUtility.actionFailedCallbackForMoca(response);
                    }, subject, entityId, entityTypeCode, customerId, typeCode, ownerId, ownerTypeCode, leadId, currencyId, campaignId, Sales.EntityTypeCodes.Campaign, false, ownerName);
                }
            };
            this.getOpportunityEntityRecord = function (targetEntitySubject, activityId, activityTypeCode, customerId, customerTypeCode, ownerId, ownerTypeCode, leadId, currencyId, campaignId, campaignTypeCode, ownerName) {
                var emptyGuidString = Microsoft.Crm.Client.Core.Framework.Guid.get_empty().toString();
                var opportunity = new Xrm.Objects.EntityReference(Sales.EntityNames.Opportunity, Microsoft.Crm.Client.Core.Framework.Guid.get_empty(), targetEntitySubject);
                var fieldValues = {};
                var fieldTypes = {};
                var attributeNames = new Array(0);
                var selectedItem;
                var attributeName = "name";
                fieldValues[attributeName] = targetEntitySubject;
                fieldTypes[attributeName] = Xrm.Objects.AttributeType.string;
                attributeNames[attributeNames.length] = attributeName;
                var isMDDConverted = Mscrm.InternalUtilities.DialogUtility.isMDDConverted("converttoopportunity", Xrm.Internal.getEntityName(activityTypeCode));
                if (!ClientUtility.DataUtil.isNullOrEmptyString(currencyId) && currencyId !== emptyGuidString) {
                    attributeName = "transactioncurrencyid";
                    var currencyEntity = new Xrm.Objects.EntityReference(Sales.EntityNames.TransactionCurrency, new Microsoft.Crm.Client.Core.Framework.Guid(currencyId));
                    if (isMDDConverted) {
                        var currencyLookup = Xrm.Page.data.entity.attributes.get(Sales.MetadataDrivenDialogConstants.CurrencyLookup);
                        selectedItem = currencyLookup.getValue();
                        var currencyName = Microsoft.Crm.Client.Core.Framework._String.empty;
                        if (!ClientUtility.DataUtil.isNullOrUndefined(selectedItem) && selectedItem.length > 0) {
                            currencyName = selectedItem[0].name;
                        }
                        if (!ClientUtility.DataUtil.isNullOrEmptyString(currencyName) && Xrm.Utility.isMocaOffline()) {
                            currencyEntity.Name = currencyName;
                        }
                    }
                    fieldValues[attributeName] = currencyEntity;
                    fieldTypes[attributeName] = Xrm.Objects.AttributeType.lookup;
                    attributeNames[attributeNames.length] = attributeName;
                }
                if (!ClientUtility.DataUtil.isNullOrEmptyString(campaignId) && campaignId !== emptyGuidString
                    && campaignTypeCode === Xrm.Internal.getEntityCode(Sales.EntityNames.Campaign)) {
                    attributeName = "campaignid";
                    var campaignEntity = new Xrm.Objects.EntityReference(campaignTypeCode ? Xrm.Internal.getEntityName(campaignTypeCode) : Sales.EntityNames.Campaign, new Microsoft.Crm.Client.Core.Framework.Guid(campaignId));
                    fieldValues[attributeName] = campaignEntity;
                    fieldTypes[attributeName] = Xrm.Objects.AttributeType.lookup;
                    attributeNames[attributeNames.length] = attributeName;
                }
                if (!ClientUtility.DataUtil.isNullOrEmptyString(leadId) && leadId !== emptyGuidString) {
                    attributeName = "leadid";
                    var leadEntity = new Xrm.Objects.EntityReference(Sales.EntityNames.Lead, new Microsoft.Crm.Client.Core.Framework.Guid(leadId));
                    fieldValues[attributeName] = leadEntity;
                    fieldTypes[attributeName] = Xrm.Objects.AttributeType.lookup;
                    attributeNames[attributeNames.length] = attributeName;
                }
                if (!ClientUtility.DataUtil.isNullOrEmptyString(customerId) && customerId !== emptyGuidString) {
                    attributeName = "customerid";
                    var customer = new Xrm.Objects.EntityReference(Xrm.Internal.getEntityName(customerTypeCode), new Microsoft.Crm.Client.Core.Framework.Guid(customerId));
                    if (isMDDConverted) {
                        var customerLookup = Xrm.Page.data.entity.attributes.get(Sales.MetadataDrivenDialogConstants.CustomerLookup);
                        selectedItem = customerLookup.getValue();
                        var customerName = Microsoft.Crm.Client.Core.Framework._String.empty;
                        if (!ClientUtility.DataUtil.isNullOrUndefined(selectedItem) && selectedItem.length > 0) {
                            customerName = selectedItem[0].name;
                        }
                        if (Xrm.Utility.isMocaOffline()) {
                            if (!ClientUtility.DataUtil.isNullOrEmptyString(customerName)) {
                                customer.Name = customerName;
                            }
                            customer.TypeCode = customerTypeCode;
                        }
                    }
                    fieldValues[attributeName] = customer;
                    fieldTypes[attributeName] = Xrm.Objects.AttributeType.lookup;
                    attributeNames[attributeNames.length] = attributeName;
                }
                if (!ClientUtility.DataUtil.isNullOrEmptyString(ownerId) && ownerId !== emptyGuidString) {
                    attributeName = "ownerid";
                    var owner = new Xrm.Objects.EntityReference(Xrm.Internal.getEntityName(ownerTypeCode), new Microsoft.Crm.Client.Core.Framework.Guid(ownerId));
                    if (isMDDConverted) {
                        owner.Name = ownerName;
                    }
                    fieldValues[attributeName] = owner;
                    fieldTypes[attributeName] = Xrm.Objects.AttributeType.lookup;
                    attributeNames[attributeNames.length] = attributeName;
                }
                var opportunityRecord = new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.EntityRecord(opportunity, fieldValues, fieldTypes, {}, {}, new Microsoft.Crm.Client.Core.Storage.Common.ObjectModel.RelatedEntityCollection(new Array(0)));
                opportunityRecord.get_changedFieldNames().addRange(attributeNames);
                return opportunityRecord;
            };
            this.offlineConvertActivity = function (entityId, entityTypeCode, opportunityRecord, saveActivity, openNewRecord) {
                var request = new Xrm.Gen.ConvertActivityRequest(new Microsoft.Crm.Client.Core.Framework.Guid(entityId), Xrm.Internal.getEntityName(entityTypeCode), opportunityRecord, Sales.EntityNames.Opportunity, false);
                var successCallback = function (entityOperations) {
                    for (var newOpportunity = null, i = 0; i < entityOperations.get_Items().length; i++) {
                        if (entityOperations.get_Items()[i].get_entityType() === Sales.EntityNames.Opportunity) {
                            newOpportunity = entityOperations.get_Items()[i].get_entity();
                            break;
                        }
                    }
                    if (newOpportunity) {
                        var oppId = newOpportunity["opportunityid"].toString();
                        _this.postConvertActivity(oppId, saveActivity, openNewRecord);
                    }
                };
                Xrm.Utility.executeNonCudCommand(Sales.MetadataDrivenDialogConstants.ConvertActivityCommandName, Xrm.Internal.getEntityName(entityTypeCode), request, successCallback, Mscrm.InternalUtilities.DialogUtility.actionFailedCallbackForMoca);
            };
            this.postConvertActivity = function (oppId, saveActivity, openNewRecord) {
                var optyIdAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsConvertActivity.OpportunityId);
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.OpportunityId, oppId);
                var saveActivityAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsConvertActivity.SaveActivity);
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.SaveActivity, saveActivity);
                var openNewAttribute = Xrm.Page.getAttribute(Sales.MetadataDrivenDialogConstantsConvertActivity.OpenNewRecord);
                Mscrm.InternalUtilities.DialogUtility.setAttributeValue(Sales.MetadataDrivenDialogConstantsConvertActivity.OpenNewRecord, openNewRecord);
                Mscrm.InternalUtilities.DialogUtility.hideProgressMessage();
                try {
                    Xrm.Page.ui.close();
                }
                catch (err) {
                }
            };
            this.convertToOpportunity = function (successCallback, errorCallback, targetEntitySubject, activityId, activityTypeCode, customerId, customerTypeCode, ownerId, ownerTypeCode, leadId, currencyId, campaignId, campaignTypeCode, logResponse, ownerName) {
                var opportunityRecord = _this.getOpportunityEntityRecord(targetEntitySubject, activityId, activityTypeCode, customerId, customerTypeCode, ownerId, ownerTypeCode, leadId, currencyId, campaignId, campaignTypeCode, ownerName);
                _this.entityName = Xrm.Internal.getEntityName(activityTypeCode);
                Xrm.Internal.messages.convertActivity(activityId, Xrm.Internal.getEntityName(activityTypeCode), opportunityRecord, Sales.EntityNames.Opportunity, logResponse).then(successCallback, errorCallback);
            };
            // Convert an activity to an opportunity
            this.convertToOpportunityActivity = function (iObjType) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(Mscrm.InlineEditUtilities)) {
                    Mscrm.InlineEditUtilities.tryResetFocusOnActiveControl();
                }
                // Alert the user if the form is not saved
                if (Xrm.Page.data.entity.getIsDirty()) {
                    Mscrm.InternalUtilities._Script.alert(Xrm.Internal.getResourceString('LOCID_CONV_ACT_SAVE_WARNING'));
                    // skip the convert to opportunity
                    return false;
                }
                if (Xrm.Page.data.getIsValid()) {
                    // Get the direction code control
                    var _directionCodeCtrl = Xrm.Page.data.entity.attributes.get("directioncode");
                    var directionCodeVal = true;
                    if (!ClientUtility.DataUtil.isNullOrUndefined(_directionCodeCtrl)) {
                        var directionCodeValue = _directionCodeCtrl.getValue();
                        directionCodeVal = (directionCodeValue === "0" || !directionCodeVal) ? false : true;
                    }
                    var customerItems = null;
                    var secondaryCust = null;
                    var sUrlElement = "";
                    sUrlElement += "activityType=" + CrmEncodeDecode.CrmUrlEncode(iObjType);
                    if (directionCodeVal === true) {
                        var _to = Xrm.Page.data.entity.attributes.get('to');
                        // Outgoing
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_to)) {
                            customerItems = _to.getValue();
                        }
                        if (ClientUtility.DataUtil.isNullOrUndefined(customerItems)) {
                            customerItems = new Array();
                        }
                        var _cc = Xrm.Page.data.entity.attributes.get('cc');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_cc)) {
                            secondaryCust = _cc.getValue();
                            if (!ClientUtility.DataUtil.isNullOrUndefined(secondaryCust)) {
                                for (var i = 0; i < secondaryCust.length; i++) {
                                    customerItems[customerItems.length] = secondaryCust[i];
                                }
                            }
                        }
                        var _bcc = Xrm.Page.data.entity.attributes.get('bcc');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_bcc)) {
                            secondaryCust = _bcc.getValue();
                            if (!ClientUtility.DataUtil.isNullOrUndefined(secondaryCust)) {
                                for (var i = 0; i < secondaryCust.length; i++) {
                                    customerItems[customerItems.length] = secondaryCust[i];
                                }
                            }
                        }
                    }
                    else if (directionCodeVal === false) {
                        // Incoming
                        var _from = Xrm.Page.data.entity.attributes.get('from');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_from)) {
                            customerItems = _from.getValue();
                        }
                    }
                    // Appointment has attendees
                    if (iObjType === Sales.EntityTypeCodes.Appointment || iObjType === Sales.EntityTypeCodes.RecurringAppointmentMaster) {
                        var _requiredattendees = Xrm.Page.data.entity.attributes.get('requiredattendees');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_requiredattendees)) {
                            customerItems = _requiredattendees.getValue();
                        }
                        if (ClientUtility.DataUtil.isNullOrUndefined(customerItems)) {
                            customerItems = new Array();
                        }
                        var _optionalattendees = Xrm.Page.data.entity.attributes.get('optionalattendees');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_optionalattendees)) {
                            secondaryCust = _optionalattendees.getValue();
                            if (!ClientUtility.DataUtil.isNullOrUndefined(secondaryCust)) {
                                for (var i = 0; i < secondaryCust.length; i++) {
                                    customerItems[customerItems.length] = secondaryCust[i];
                                }
                            }
                        }
                    }
                    else if (iObjType === Sales.EntityTypeCodes.Task) {
                        var _regardingobjectid = Xrm.Page.data.entity.attributes.get('regardingobjectid');
                        if (!ClientUtility.DataUtil.isNullOrUndefined(_regardingobjectid) && !ClientUtility.DataUtil.isNullOrUndefined(_regardingobjectid.getValue())) {
                            customerItems = _regardingobjectid.getValue();
                        }
                    }
                    // We have to find the first valid customer
                    if (!ClientUtility.DataUtil.isNullOrUndefined(customerItems)) {
                        // call the GetValidcustomer for the first time
                        _this.GetValidCustomer(customerItems, sUrlElement, iObjType, 0, "opportunity");
                    }
                }
                _this.refreshParentGrid(iObjType);
            };
            this.GetValidCustomer = function (customerItems, sUrlElement, iObjType, customerNo, customerType) {
                if (customerNo === customerItems.length) {
                    return _this.GetValidCustomerSuccess(sUrlElement, iObjType, customerItems, customerType, "");
                }
                try {
                    var isValidCustomer = true;
                    // for convert to lead only lead is valid for customer
                    if ((!ClientUtility.DataUtil.isNullOrUndefined(customerType)
                        && customerType === "lead") && (customerItems[customerNo].type.toString() !== Sales.EntityTypeCodes.Lead.toString())) {
                        isValidCustomer = false;
                    }
                    // we check for either contact or account for convert to case/opportunity
                    if ((!ClientUtility.DataUtil.isNullOrUndefined(customerType) && customerType !== "lead") &&
                        (customerItems[customerNo].type.toString() !== Sales.EntityTypeCodes.Account.toString()
                            && customerItems[customerNo].type.toString() !== Sales.EntityTypeCodes.Contact.toString())) {
                        isValidCustomer = false;
                    }
                    if (!isValidCustomer) {
                        return _this.GetValidCustomer(customerItems, sUrlElement, iObjType, customerNo + 1, customerType);
                    }
                    if (Xrm.Utility.isMocaOffline()) {
                        // Populating the customer attributes in case of moca offline from form data
                        sUrlElement += _this.AppendValidCustomerAttributes(customerItems, customerNo, customerType);
                        return _this.GetValidCustomerSuccess(sUrlElement, iObjType, customerItems, customerType, "");
                    }
                    else {
                        var columns = new Array();
                        columns[0] = "statecode";
                        var that = _this;
                        Xrm.Internal.messages.retrieve(Xrm.Internal.getEntityName(typeof (customerItems[customerNo].type) !== 'number' ? Number.parseInvariant(customerItems[customerNo].type) : customerItems[customerNo].type), customerItems[customerNo].id, columns).then(function (response) {
                            if (typeof (response.entity) !== "undefined"
                                && typeof (response.entity.getObjectData) !== "undefined"
                                && typeof (response.entity.getObjectData().fields) !== "undefined"
                                && typeof (response.entity.getObjectData().fields.statecode) !== "undefined"
                                && typeof (response.entity.getObjectData().fields.statecode.value) !== "undefined"
                                && response.entity.getObjectData().fields.statecode.value.toString() === "0"
                                && typeof (response.entity.get_key) !== "undefined") {
                                // the customer is active, get the id and find the customer in the list of customerItems with the same Id
                                var id = response.entity.get_key().toString();
                                for (var k = 0; k < customerItems.length; k++) {
                                    if (!ClientUtility.DataUtil.isNullOrUndefined(customerItems[k].id) && customerItems[k].id.toLowerCase().indexOf(id.toLowerCase()) !== -1) {
                                        sUrlElement += that.AppendValidCustomerAttributes(customerItems, k, customerType);
                                        return that.GetValidCustomerSuccess(sUrlElement, iObjType, customerItems, customerType, "");
                                    }
                                }
                                // this is a scenario which should not happen in the ideal case, if the customer was active but the id returned was not in the CustomerItems list 
                                // then increase the number of customers processed and call the same function for the next customer in line
                                // surrounded by try catch as fail safe for MoCA
                                try {
                                    Mscrm.CrmDebug.assert(true, "customer with id {0} was not found on the page", id);
                                }
                                catch (e) { }
                                return that.GetValidCustomer(customerItems, sUrlElement, iObjType, customerNo + 1, customerType);
                            }
                            else {
                                // This code is added only to retain the behaviour of CRM2011 where dialog box opens even if contact is inactive
                                // If we have reached here, it means that the customer we looked into was inactive, so go ahead and find the next valid customer
                                return that.GetValidCustomer(customerItems, sUrlElement, iObjType, customerNo + 1, customerType);
                            }
                        }, function (response) {
                            // the call failed because of some reason, just increase the number of customers processed and if all customers are processed, call GetValidCustomerSuccess anyways
                            return that.GetValidCustomer(customerItems, sUrlElement, iObjType, customerNo + 1, customerType);
                        });
                    }
                }
                catch (e) { }
            };
            this.GetValidCustomerSuccess = function (sUrlElement, iObjType, customerItems, customerType, entityId) {
                // the first customerType = "opportunity" denotes that the call has come from opportunity and not form case hence we need to call the GetValidForConvertToOpportunity
                if (customerType === "opportunity") {
                    return _this.GetValidForConvertToOpportunity(sUrlElement, iObjType, customerItems);
                }
                else if (customerType === "lead") {
                    return _this.GetValidForConvertToOpportunityWithLead(sUrlElement, iObjType);
                }
                _this.refreshParentGrid(iObjType);
            };
            this.AppendValidCustomerAttributes = function (customerItems, customerNo, customerType) {
                if (customerType !== "lead") {
                    return ("&customerId=" + CrmEncodeDecode.CrmUrlEncode(customerItems[customerNo].id) +
                        "&customerType=" + CrmEncodeDecode.CrmUrlEncode(customerItems[customerNo].type) +
                        "&customerName=" + CrmEncodeDecode.CrmUrlEncode(customerItems[customerNo].name));
                }
                else {
                    return ("&leadId=" + CrmEncodeDecode.CrmUrlEncode(customerItems[customerNo].id) +
                        "&leadName=" + CrmEncodeDecode.CrmUrlEncode(customerItems[customerNo].name));
                }
            };
            this.GetValidForConvertToOpportunity = function (sUrlElement, iObjType, customerItems) {
                // if customer has been found customer Id will be set
                if (sUrlElement.indexOf("customerId") === -1) {
                    _this.GetValidCustomer(customerItems, sUrlElement, iObjType, 0, "lead");
                }
                else {
                    // customer is already present, no need to add lead anymore we can direct call into lead success
                    _this.GetValidForConvertToOpportunityWithLead(sUrlElement, iObjType);
                }
            };
            this.GetValidForConvertToOpportunityWithLead = function (sUrlElement, iObjType) {
                var subjectField = "";
                var _subject = Xrm.Page.data.entity.attributes.get("subject");
                if (!ClientUtility.DataUtil.isNullOrUndefined(_subject.getValue())) {
                    subjectField = _subject.getValue();
                }
                var ownerId = "";
                var ownerType = "";
                var ownerCtrl = Xrm.Page.data.entity.attributes.get("ownerid");
                if (!ClientUtility.DataUtil.isNullOrUndefined(ownerCtrl)) {
                    var dataVal = ownerCtrl.getValue();
                    ownerId = dataVal[0].id;
                    ownerType = dataVal[0].type;
                }
                sUrlElement += "&subject=" + CrmEncodeDecode.CrmUrlEncode(subjectField);
                sUrlElement += "&ownerId=" + CrmEncodeDecode.CrmUrlEncode(ownerId);
                sUrlElement += "&ownerType=" + CrmEncodeDecode.CrmUrlEncode(ownerType);
                var isMDDConverted = Mscrm.InternalUtilities.DialogUtility.isMDDConverted("converttoopportunity", Xrm.Page.data.entity.getEntityName());
                if (isMDDConverted) {
                    _this.convertActivityPreload(sUrlElement, iObjType);
                }
                else {
                    var isLead = (sUrlElement.indexOf("leadId") !== -1);
                    var dialogOptions = _this.getConvertToOpportunityDialogOptions(isLead);
                    var parameters = new Array();
                    parameters[0] = iObjType;
                    var oUrl = Mscrm.CrmUri.create("/Activities/act_dlgs/convert_activity.aspx?" + sUrlElement);
                    var convertToOppActionCallBack = Mscrm.InternalUtilities.GridUtilities.createCallbackFunctionFactory(_this.convertToOppAction, parameters);
                    Xrm.Internal.openDialog(oUrl.toString(), dialogOptions, null, null, convertToOppActionCallBack);
                }
                _this.refreshParentGrid(iObjType);
            };
            this.convertActivityPreload = function (element, iObjType) {
                _this.entityName = Xrm.Internal.getEntityName(parseInt(iObjType));
                if (Mscrm.InternalUtilities.DialogUtility.isMocaOffline() &&
                    !Xrm.Utility.isEntityOfflineSyncEnabled(_this.entityName)) {
                    Mscrm.InternalUtilities.DialogUtility.showMoCAOfflineError();
                    return;
                }
                Mscrm.InternalUtilities.DialogUtility.showProgressMessage();
                if (Xrm.Utility.isMocaOffline()) {
                    var currencyValues = Xrm.Utility.getDefaultTransactionCurrency();
                    _this.convertActivityPreloadWithCurrency(element, iObjType, currencyValues);
                }
                else {
                    var that = _this;
                    Xrm.Internal.messages.retrieveUserDefaultCurrency().then(function (response) {
                        if (!ClientUtility.DataUtil.isNullOrUndefined(response)) {
                            var currencyValues = response.currency;
                            that.convertActivityPreloadWithCurrency(element, iObjType, currencyValues);
                        }
                        else {
                            Mscrm.InternalUtilities.DialogUtility.hideProgressMessage();
                        }
                    }, Mscrm.InternalUtilities.DialogUtility.actionFailedCallbackForMoca);
                }
            };
            this.convertActivityPreloadWithCurrency = function (element, iObjType, currencyValues) {
                var dialogParams = {};
                var $$t_I;
                _this.setCurrencyAndCustomerDialogParams(currencyValues, element, $$t_I = { val: dialogParams }), dialogParams = $$t_I.val;
                if (element.indexOf("leadId") !== -1) {
                    var leadId = ClientUtility.CommandBarUtils.getElementValue(element, "leadId");
                    var leadName = ClientUtility.CommandBarUtils.getElementValue(element, "leadName");
                    var leadLookup = new Xrm.LookupObject;
                    leadLookup.id = CrmEncodeDecode.CrmUrlDecode(leadId);
                    leadLookup.name = CrmEncodeDecode.CrmUrlDecode(leadName);
                    leadLookup.entityType = Sales.EntityNames.Lead;
                    var leadLookupParams = [];
                    leadLookupParams[0] = leadLookup;
                    dialogParams[Sales.MetadataDrivenDialogConstants.LeadLookup] = leadLookupParams;
                    dialogParams[Sales.MetadataDrivenDialogConstants.LeadId] = CrmEncodeDecode.CrmUrlDecode(leadId);
                }
                _this.setConvertActivityParameterAndLaunchDialog(dialogParams, element, iObjType);
            };
            this.setCurrencyAndCustomerDialogParams = function (currencyValues, element, dialogParams) {
                dialogParams.val = {};
                if (!ClientUtility.DataUtil.isNullOrUndefined(currencyValues)) {
                    var currencyLookup = new Xrm.LookupObject;
                    currencyLookup.id = currencyValues.Id.toString();
                    currencyLookup.name = currencyValues.Name;
                    currencyLookup.entityType = Sales.EntityNames.TransactionCurrency;
                    var currencyLookupParams = [];
                    currencyLookupParams[0] = currencyLookup;
                    dialogParams.val[Sales.MetadataDrivenDialogConstants.CurrencyLookup] = currencyLookupParams;
                }
                if (element.indexOf("customerId") !== -1) {
                    var customerId = ClientUtility.CommandBarUtils.getElementValue(element, "customerId");
                    var customerName = ClientUtility.CommandBarUtils.getElementValue(element, "customerName");
                    var customerType = parseInt(ClientUtility.CommandBarUtils.getElementValue(element, "customerType"), 10);
                    var customerLookup = new Xrm.LookupObject;
                    customerLookup.id = CrmEncodeDecode.CrmUrlDecode(customerId);
                    customerLookup.name = CrmEncodeDecode.CrmUrlDecode(customerName);
                    customerLookup.entityType = Xrm.Internal.getEntityName(customerType);
                    var customerLookupParams = [];
                    customerLookupParams[0] = customerLookup;
                    dialogParams.val[Sales.MetadataDrivenDialogConstants.CustomerLookup] = customerLookupParams;
                }
            };
            this.setConvertActivityParameterAndLaunchDialog = function (dialogParams, element, iObjType) {
                if (element.indexOf("subject") !== -1) {
                    var subject = ClientUtility.CommandBarUtils.getElementValue(element, "subject");
                    dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.Subject] = CrmEncodeDecode.CrmUrlDecode(subject);
                }
                if (element.indexOf("ownerId") !== -1) {
                    var ownerId = ClientUtility.CommandBarUtils.getElementValue(element, "ownerId");
                    var ownerType = ClientUtility.CommandBarUtils.getElementValue(element, "ownerType");
                    var ownerName = "";
                    var ownerCtrl = Xrm.Page.data.entity.attributes.get("ownerid");
                    if (!ClientUtility.DataUtil.isNullOrUndefined(ownerCtrl)) {
                        var selectedItem = ownerCtrl.getValue();
                        if (!ClientUtility.DataUtil.isNullOrUndefined(selectedItem) && selectedItem.length > 0) {
                            ownerName = selectedItem[0].name;
                            dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.OwnerName] = CrmEncodeDecode.CrmUrlDecode(ownerName);
                        }
                    }
                    dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.OwnerId] = CrmEncodeDecode.CrmUrlDecode(ownerId);
                    dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.OwnerType] = CrmEncodeDecode.CrmUrlDecode(ownerType);
                }
                dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.EntityId] = Xrm.Page.data.entity.getId();
                dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.EntityTypeCode] = "" + iObjType;
                dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.OpportunityId] = Microsoft.Crm.Client.Core.Framework._String.empty;
                dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.SaveActivity] = "false";
                dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.OpenNewRecord] = "false";
                dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.LastButtonClicked] = Microsoft.Crm.Client.Core.Framework._String.empty;
                var closeCallback = _this.convertActivityCallback;
                Mscrm.InternalUtilities.DialogUtility.hideProgressMessage();
                var isLead = element.indexOf("leadId") !== -1;
                var dialogOptions = _this.getConvertToOpportunityDialogOptionsWithHeight(isLead, 450);
                Xrm.Dialog.openDialog(Mscrm.InternalUtilities.DialogName.ConvertActivityDialog, dialogOptions, dialogParams, closeCallback, null);
            };
            this.convertActivityCallback = function (dialogParams, callbackParams) {
                if (!ClientUtility.DataUtil.isNullOrUndefined(dialogParams)
                    && dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.LastButtonClicked] === ClientUtility.MetadataDrivenDialogConstants.DialogOkId) {
                    var oppId = dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.OpportunityId];
                    var saveActivity = dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.SaveActivity];
                    var openNewRecord = dialogParams[Sales.MetadataDrivenDialogConstantsConvertActivity.OpenNewRecord];
                    _this.convertToOpportunitySuccess(oppId, saveActivity, openNewRecord);
                }
            };
            this.convertToOpportunitySuccess = function (oppId, saveActivity, openNewRecord) {
                if (saveActivity === "false") {
                    if (openNewRecord === "true") {
                        Xrm.Page.data.save();
                        Xrm.Utility.openEntityForm(Sales.EntityNames.Opportunity, oppId);
                    }
                }
                else {
                    Xrm.Page.data.setFormDirty(false);
                    if (openNewRecord === "true")
                        Mscrm.CommandBarActions.markActivityComplete(Xrm.Page.data.entity.getId(), Xrm.Page.data.entity.getEntityName(), false, Sales.EntityNames.Opportunity, oppId);
                    else
                        Mscrm.CommandBarActions.markActivityComplete(Xrm.Page.data.entity.getId(), Xrm.Page.data.entity.getEntityName(), true, null, null);
                }
                _this.refreshParentGrid(Xrm.Page.data.entity.getId(), Xrm.Page.data.entity.getEntityName());
            };
            this.refreshParentGrid = function (entityId, entityName) {
                if (entityName) {
                    var objectType = Xrm.Internal.getEntityCode(entityName);
                }
                Xrm.Internal.refreshParentGrid(objectType, "", entityId);
            };
            this.getConvertToOpportunityDialogOptions = function (isLead) {
                return _this.getConvertToOpportunityDialogOptionsWithHeight(isLead, 600);
            };
            this.getConvertToOpportunityDialogOptionsWithHeight = function (isLead, blockHeight) {
                var dialogOptions = null;
                if (isLead)
                    blockHeight += 30;
                if (Mscrm.CommandBarActions.isWebClient() || Xrm.Page.context.client.getClient() === Xrm.ClientName.outlook || Xrm.Page.context.client.getClient() === Xrm.Constants.ClientNames.unifiedServiceDesk) {
                    dialogOptions = new Xrm.DialogOptions;
                    dialogOptions.height = blockHeight;
                    dialogOptions.width = 410;
                }
                return dialogOptions;
            };
            this.convertToOppAction = function (objRet, iObjType) {
                if (objRet) {
                    if (Xrm.Page.context.client.getClient() === Xrm.ClientName.outlook &&
                        Xrm.Page.context.client.getClientState() === Xrm.ClientState.offline &&
                        !Mscrm.InternalUtilities.DialogUtility.isMDDConverted("converttoopportunity", Xrm.Page.data.entity.getEntityName())) {
                        var command = new RemoteCommand("ActivitiesWebService", "ConvertActivity");
                        command.SetParameter("activitySubject", Xrm.Page.data.entity.attributes.get("subject").getValue());
                        command.SetParameter("activityId", Xrm.Page.data.entity.getId());
                        command.SetParameter("activityType", iObjType);
                        command.SetParameter("leadId", objRet.LeadId);
                        command.SetParameter("customerId", objRet.CustomerId);
                        command.SetParameter("customerType", objRet.CustomerType);
                        command.SetParameter("currencyId", objRet.CurrencyId);
                        command.SetParameter("campaignId", objRet.CampaignId);
                        command.SetParameter("campaignType", objRet.CampaignType);
                        command.SetParameter("logResponse", objRet.LogResponse);
                        command.SetParameter("ownerId", objRet.ownerId);
                        command.SetParameter("ownerType", objRet.ownerType);
                        var response = command.Execute();
                        response.Success && _this.ConvertToOpportunitySuccess(response, objRet.SaveActivity, objRet.OpenNewRecord, iObjType);
                    }
                    else {
                        try {
                            var activityTypeCode = typeof iObjType !== "number" ? Number.parseInvariant(iObjType) : iObjType, customerTypeCode = typeof objRet.CustomerType !== "number" ? Number.parseInvariant(objRet.CustomerType) : objRet.CustomerType, campaignTypeCode = typeof objRet.CampaignType !== "number" ? Number.parseInvariant(objRet.CampaignType) : objRet.CampaignType, ownerTypeCode = typeof objRet.ownerType !== "number" ? Number.parseInvariant(objRet.ownerType) : objRet.ownerType;
                            _this.convertToOpportunity(function (response) {
                                _this.ConvertToOpportunitySuccess(response, objRet.SaveActivity, objRet.OpenNewRecord, iObjType);
                            }, function (response) {
                                Mscrm.InternalUtilities.ClientApiUtility.actionFailedCallback(response);
                            }, Xrm.Page.data.entity.attributes.get("subject").getValue(), Xrm.Page.data.entity.getId(), activityTypeCode, objRet.CustomerId, customerTypeCode, objRet.ownerId, ownerTypeCode, objRet.LeadId, objRet.CurrencyId, objRet.CampaignId, campaignTypeCode, objRet.LogResponse, "");
                        }
                        catch (e) {
                        }
                    }
                }
            };
            this.ConvertToOpportunitySuccess = function (response, saveActivity, openNewRecord, iObjType) {
                var oppId;
                if (typeof response.ReturnValue !== "undefined") {
                    oppId = response.ReturnValue;
                }
                else {
                    if (typeof response.id !== "undefined") {
                        oppId = response.id;
                    }
                    else {
                        if (typeof response.get_recordId !== "undefined" && typeof response.get_recordId() !== "undefined") {
                            oppId = response.get_recordId().toString();
                        }
                    }
                }
                var _regardingCtrl = Xrm.Page.data.entity.attributes.get("regardingobjectid");
                if (oppId !== "" && !ClientUtility.DataUtil.isNullOrUndefined(_regardingCtrl)) {
                    var itemsArray = [], reg = new Xrm.LookupObject;
                    reg.id = oppId;
                    reg.entityType = Sales.EntityNames.Opportunity;
                    var _subject = Xrm.Page.data.entity.attributes.get("subject");
                    if (!ClientUtility.DataUtil.isNullOrUndefined(_subject))
                        reg.name = _subject.getValue();
                    else
                        reg.name = "";
                    itemsArray.push(reg);
                    _regardingCtrl.setValue(itemsArray);
                }
                if (Mscrm.CommandBarActions.isMobileCompanionApp() || Mscrm.InternalUtilities.Utilities.isRefreshForm()) {
                    if (saveActivity === false)
                        oppId !== "" && !ClientUtility.DataUtil.isNullOrUndefined(_regardingCtrl) &&
                            Xrm.Page.data.save().then(function () {
                                openNewRecord &&
                                    Xrm.Utility.openEntityForm(Sales.EntityNames.Opportunity, oppId);
                            }, Mscrm.InternalUtilities.ClientApiUtility.operationFailedCallback);
                    else {
                        Xrm.Page.data.setFormDirty(false);
                        if (openNewRecord && oppId !== "") {
                            _this.UnsetCheckpointInHistoryManager();
                            Mscrm.CommandBarActions.markActivityComplete(Xrm.Page.data.entity.getId(), Xrm.Page.data.entity.getEntityName(), false, Sales.EntityNames.Opportunity, oppId);
                        }
                        else
                            Mscrm.CommandBarActions.markActivityComplete(Xrm.Page.data.entity.getId(), Xrm.Page.data.entity.getEntityName(), true);
                    }
                    _this.refreshParentGrid(iObjType);
                }
                else
                    _this.convertToEntityLegacy(oppId, saveActivity, openNewRecord, iObjType, Sales.EntityNames.Opportunity);
            };
            this.UnsetCheckpointInHistoryManager = function () {
                if (Mscrm.CommandBarActions.isMobileCompanionApp()) {
                    return;
                }
                Xrm.Internal.preventBrowseBack();
            };
            this.convertToEntityLegacy = function (entityId, saveActivity, openNewRecord, iObjType, targetEntityName) {
                var crmFormCtrl = $find("crmForm");
                if (saveActivity === false) {
                    crmFormCtrl.SubmitCrmForm(1, true, true, false);
                    _this.refreshParentGrid(iObjType);
                }
                else {
                    crmFormCtrl.SubmitCrmForm(58, true, true, false);
                }
                openNewRecord && !ClientUtility.DataUtil.isNullOrUndefined(entityId) && Xrm.Utility.openEntityForm(targetEntityName, entityId);
                _this.refreshParentGrid(iObjType);
            };
        }
        ConvertActivityActionsLegacy.prototype.dialogClose = function () {
            Mscrm.InternalUtilities.DialogUtility.closeDialog();
        };
        return ConvertActivityActionsLegacy;
    }());
    Sales.ConvertActivityActionsLegacy = ConvertActivityActionsLegacy;
    var ContextualEmailActionsLegacy = (function () {
        function ContextualEmailActionsLegacy() {
            /**
            * Enable Rule to Display Commands on Contextual Email form.
            * @param gridControl gridcontrol from which function is called
            */
            this.shouldShowContextualEmailCommands = function (primaryControl) {
                var formContext = primaryControl ? primaryControl.ui.formSelector.getCurrentItem() : Xrm.Page.ui.formSelector.getCurrentItem();
                var formId = formContext.getId();
                return (formId.toLowerCase() == ContextualEmailActionsLegacy.popUpFormId);
            };
        }
        return ContextualEmailActionsLegacy;
    }());
    ContextualEmailActionsLegacy.popUpFormId = "b54ca399-eaa6-45f8-83f2-c268b0021087";
    Sales.ContextualEmailActionsLegacy = ContextualEmailActionsLegacy;
    var LookupAddressDialogResult = (function () {
        function LookupAddressDialogResult() {
            this.ShipTo = false;
            this.BillTo = false;
            this.Address = null;
        }
        return LookupAddressDialogResult;
    }());
    Sales.LookupAddressDialogResult = LookupAddressDialogResult;
    var LookupAddressField = (function () {
        function LookupAddressField() {
            this.AddressId = null;
            this.City = null;
            this.ContactName = null;
            this.Country = null;
            this.Fax = null;
            this.Line1 = null;
            this.Line2 = null;
            this.Line3 = null;
            this.Name = null;
            this.PostalCode = null;
            this.StateOrProvince = null;
            this.Telephone = null;
            this.FreightTerms = 0;
            this.CustomerAddressId = null;
            this.PrimaryContactName = null;
            this.ShippingMethod = 0;
        }
        return LookupAddressField;
    }());
    Sales.LookupAddressField = LookupAddressField;
})(Sales || (Sales = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="UCI/SalesCommandBarActions.ts" />
/// <reference path="./Legacy/SalesCommandBarActionsLegacy.ts" />
var Sales;
(function (Sales) {
    var CommandBarActions = (function () {
        function CommandBarActions() {
        }
        return CommandBarActions;
    }());
    CommandBarActions.Instance = Xrm.Internal.isUci() ? new Sales.SalesCommandBarActions() : new Sales.SalesCommandBarActionsLegacy();
    Sales.CommandBarActions = CommandBarActions;
})(Sales || (Sales = {}));
