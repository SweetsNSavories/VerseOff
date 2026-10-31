/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var ProductManagement;
(function (ProductManagement) {
    /**
    * Entity names constants used in Common solution
    */
    var EntityNames = (function () {
        function EntityNames() {
        }
        return EntityNames;
    }());
    EntityNames.Account = "account";
    EntityNames.ActivityParty = "activityparty";
    EntityNames.Connection = "connection";
    EntityNames.ConnectionRole = "connectionrole";
    EntityNames.Contact = "contact";
    EntityNames.DynamicProperty = "dynamicproperty";
    EntityNames.KnowledgeArticle = "knowledgearticle";
    EntityNames.Lead = "lead";
    EntityNames.Organization = "organization";
    EntityNames.Product = "product";
    EntityNames.ProductAssociation = "productassociation";
    EntityNames.PriceLevel = "pricelevel";
    EntityNames.SystemUser = "systemuser";
    EntityNames.TransactionCurrency = "transactioncurrency";
    EntityNames.UoM = "uom";
    EntityNames.UoMSchedule = "uomschedule";
    EntityNames.DynamicPropertyOptionSetItem = "dynamicpropertyoptionsetitem";
    EntityNames.Entitlement = "entitlement";
    EntityNames.InvoiceDetail = "invoicedetail";
    EntityNames.OpportunityProduct = "opportunityproduct";
    EntityNames.QuoteDetail = "quotedetail";
    EntityNames.SalesOrderDetail = "salesorderdetail";
    ProductManagement.EntityNames = EntityNames;
})(ProductManagement || (ProductManagement = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var ProductManagement;
(function (ProductManagement) {
    var MetadataDrivenDialogConstants = (function () {
        function MetadataDrivenDialogConstants() {
        }
        return MetadataDrivenDialogConstants;
    }());
    ProductManagement.MetadataDrivenDialogConstants = MetadataDrivenDialogConstants;
    var DialogName = (function () {
        function DialogName() {
        }
        return DialogName;
    }());
    DialogName.DupWarningDialog = "DupWarningDialog";
    DialogName.SetStateDialog = "SetStateDialog";
    DialogName.ArticleToProductAssociation = "ArticleToProductAssociation";
    ProductManagement.DialogName = DialogName;
})(ProductManagement || (ProductManagement = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var ProductManagement;
(function (ProductManagement) {
    var MetadataDrivenDialogConstantsArticleToProductAssociation = (function () {
        function MetadataDrivenDialogConstantsArticleToProductAssociation() {
        }
        return MetadataDrivenDialogConstantsArticleToProductAssociation;
    }());
    MetadataDrivenDialogConstantsArticleToProductAssociation.EntityId = "knowledgeArticleId";
    MetadataDrivenDialogConstantsArticleToProductAssociation.AssociateEntityId = "associateEntity_id";
    MetadataDrivenDialogConstantsArticleToProductAssociation.RelatedEntityRoleId = "CFFE4A59-CE11-4FCA-B132-5985D3917D26";
    MetadataDrivenDialogConstantsArticleToProductAssociation.PrimaryEntityRoleId = "5A18DFC8-0B8B-40C7-9381-CCE1C485822D";
    MetadataDrivenDialogConstantsArticleToProductAssociation.AssociateProductRoleId = "131F5D06-9F36-4B59-B8B7-A1F7D6C5C5EF";
    MetadataDrivenDialogConstantsArticleToProductAssociation.KnowledgeArticleRoleId = "81BB2655-F19B-42B2-9C4B-D45B84C3F61C";
    MetadataDrivenDialogConstantsArticleToProductAssociation.AssociationType = "associationType";
    MetadataDrivenDialogConstantsArticleToProductAssociation.paramEntityId = "param_knowledgeArticleId";
    MetadataDrivenDialogConstantsArticleToProductAssociation.paramAssociationType = "param_associationType";
    MetadataDrivenDialogConstantsArticleToProductAssociation.ParamStateCode = "param_statecode";
    MetadataDrivenDialogConstantsArticleToProductAssociation.ParamStatusCode = "param_statuscode";
    ProductManagement.MetadataDrivenDialogConstantsArticleToProductAssociation = MetadataDrivenDialogConstantsArticleToProductAssociation;
})(ProductManagement || (ProductManagement = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../../TypeDefinitions/ProductManagement/Localization/ResourceStringProvider.d.ts" />
/*
 * Invokes the ResourceStringProvider if available; otherwise returns *key*.
 * Using this class as a proxy for the ResourceStringProvider that is included per web dependency declaration
 * in order to avoid null reference errors in case the dependency is not loaded for some reason.
 */
var ProductManagement;
(function (ProductManagement) {
    var StringProvider = (function () {
        function StringProvider() {
        }
        StringProvider.getResourceString = function (key) {
            return ProductManagement.ResourceStringProvider ? ProductManagement.ResourceStringProvider.getResourceString(key) : "*" + key + "*";
        };
        return StringProvider;
    }());
    ProductManagement.StringProvider = StringProvider;
})(ProductManagement || (ProductManagement = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
var ProductManagement;
(function (ProductManagement) {
    'use strict';
    /**
    * The name of this event which will be reported to Telemetry pipeline
    */
    var KnowledgeArticleRibbon = "uciknowledgearticleribbonactions";
    var KnowledgeArticleRibbonActions = (function () {
        function KnowledgeArticleRibbonActions(articleId, stateId, statusId, screenWidth, screenHeight, ribbonCommandId) {
            this.eventName = KnowledgeArticleRibbon;
            this.eventParameters = [
                { name: "articleId", value: articleId },
                { name: "stateId", value: stateId },
                { name: "statusId", value: statusId },
                { name: "screenWidth", value: screenWidth },
                { name: "screenHeight", value: screenHeight },
                { name: "ribbonCommandId", value: ribbonCommandId }
            ];
        }
        return KnowledgeArticleRibbonActions;
    }());
    ProductManagement.KnowledgeArticleRibbonActions = KnowledgeArticleRibbonActions;
})(ProductManagement || (ProductManagement = {}));
/// <reference path="TelemetryEvents/KnowledgeArticleRibbonActions.ts" />
var ProductManagement;
(function (ProductManagement) {
    /**
    * Register KnowledgeArticle instance in ClientUtility namespace
    */
    /// <summary>
    /// Defines utilities for Knowledge Article.
    /// </summary>
    var KnowledgeArticleUtility = (function () {
        function KnowledgeArticleUtility() {
        }
        return KnowledgeArticleUtility;
    }());
    /// <summary>
    /// Get the ribbon command id based on stateCode
    /// </summary>
    KnowledgeArticleUtility.getRibbonCommandId = function () {
        return "Mscrm.Form.KnowledgeArticle.RelateProduct";
    };
    /// <summary>
    /// To get the screen dimensions (width x height)
    /// </summary>
    KnowledgeArticleUtility.getScreenDimensions = function () {
        var screenWidth = window.screen.width;
        var screenHeight = window.screen.height;
        var screenDimensions = { width: screenWidth, height: screenHeight };
        return screenDimensions;
    };
    /// <summary>
    /// To report the event to the console
    /// </summary>
    /// <param name="articleId">Knowledge Article Id</param>
    /// <param name="state">State Code</param>
    /// <param name="status">Status code of Knowledge article </param>
    /// <param name="screenWidth">Screen width</param>
    /// <param name="screenHeight">Screen height </param>
    /// <param name="ribbonCommandId">Knowledge Article ribbon command Id </param>
    KnowledgeArticleUtility.reportEvent = function (articleId, state, status, screenWidth, screenHeight, ribbonCommandId) {
        if (!ribbonCommandId) {
            ribbonCommandId = KnowledgeArticleUtility.getRibbonCommandId();
        }
        var event = new ProductManagement.KnowledgeArticleRibbonActions(articleId, state, status, screenWidth, screenHeight, ribbonCommandId);
        Xrm.Reporting.reportEvent(event);
    };
    ProductManagement.KnowledgeArticleUtility = KnowledgeArticleUtility;
})(ProductManagement || (ProductManagement = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../TypeDefinitions/CRM/ClientUtility.d.ts" />
/// <reference path="../Common/EntityNames.ts" />
/// <reference path="../Common/MetadataDrivenDialogConstants.ts" />
/// <reference path="../Common/MetadataDrivenDialogConstantsArticleToProductAssociation.ts" />
/// <reference path="../Localization/Provider/StringProvider.ts" />
/// <reference path="KnowledgeArticleUtility.ts" />
var ProductManagement;
(function (ProductManagement) {
    /**
    * Register KnowledgeArticle instance in ClientUtility namespace
    */
    var KnowledgeArticle = (function () {
        function KnowledgeArticle() {
            var _this = this;
            /*
             * Article to Product Association Dialog
             */
            this.relateProduct = function () {
                var isDirty = Xrm.Page.data.entity.getIsDirty();
                if (isDirty) {
                    Xrm.Page.data.save();
                }
                var options = {
                    height: 500, width: 400, position: 1 /* center */
                };
                var dialogParams = {};
                dialogParams[ProductManagement.MetadataDrivenDialogConstantsArticleToProductAssociation.paramEntityId] = Xrm.Page.data.entity.getId();
                dialogParams[ClientUtility.MetadataDrivenDialogConstants.paramLastButtonClicked] = ClientUtility.MetadataDrivenDialogConstants.DialogCancelId;
                dialogParams[ProductManagement.MetadataDrivenDialogConstantsArticleToProductAssociation.paramAssociationType] = ProductManagement.EntityNames.Product;
                Xrm.Navigation.openDialog(ProductManagement.DialogName.ArticleToProductAssociation, options, dialogParams).then(_this.performActionAfterAssociate);
            };
            this.associate = function () {
                var primaryEntityAttribute = Xrm.Page.data.attributes.get(ProductManagement.MetadataDrivenDialogConstantsArticleToProductAssociation.paramEntityId), associationType = Xrm.Page.data.attributes.get(ProductManagement.MetadataDrivenDialogConstantsArticleToProductAssociation.paramAssociationType), primaryArticleId = primaryEntityAttribute.getValue(), relatedEntityAttribute = Xrm.Page.data.attributes.get(ProductManagement.MetadataDrivenDialogConstantsArticleToProductAssociation.AssociateEntityId), relatedEntityLookup = relatedEntityAttribute.getValue(), association = associationType.getValue();
                if (relatedEntityLookup === null || relatedEntityLookup === []) {
                    var alert = { text: undefined };
                    if (associationType.getValue() === ProductManagement.EntityNames.KnowledgeArticle) {
                        alert.text = ProductManagement.StringProvider.getResourceString("KnowledgeArticle_AssociateArticleArticle_DialogText");
                    }
                    else {
                        alert.text = ProductManagement.StringProvider.getResourceString("KnowledgeArticle_AssociateArticleProduct_DialogText");
                    }
                    var options = { width: 600, height: 150, position: 1 /* center */ };
                    Xrm.Navigation.openAlertDialog(alert, options);
                    return;
                }
                ClientUtility.DialogUtil.setAttributeValue(ProductManagement.MetadataDrivenDialogConstantsArticleToProductAssociation.paramAssociationType, association);
                ClientUtility.DialogUtil.setAttributeValue(ProductManagement.MetadataDrivenDialogConstantsArticleToProductAssociation.paramEntityId, primaryArticleId);
                ClientUtility.DialogUtil.setAttributeValue(ProductManagement.MetadataDrivenDialogConstantsArticleToProductAssociation.AssociateEntityId, relatedEntityLookup);
                ClientUtility.DialogUtil.setLastButtonClicked(ClientUtility.MetadataDrivenDialogConstants.DialogOkId);
                Xrm.Page.ui.close();
            };
            this.performActionAfterAssociate = function (dialogParams) {
                var lastButtonClicked = dialogParams.parameters[ClientUtility.MetadataDrivenDialogConstants.paramLastButtonClicked];
                if (ClientUtility.DataUtil.isNullOrUndefined(lastButtonClicked) || lastButtonClicked.toString() !== ClientUtility.MetadataDrivenDialogConstants.DialogOkId) {
                    return;
                }
                var primaryEntity = { entityType: ProductManagement.EntityNames.KnowledgeArticle, id: dialogParams.parameters[ProductManagement.MetadataDrivenDialogConstantsArticleToProductAssociation.paramEntityId] }, association = dialogParams.parameters[ProductManagement.MetadataDrivenDialogConstantsArticleToProductAssociation.paramAssociationType], relatedEntityLookup = dialogParams.parameters[ProductManagement.MetadataDrivenDialogConstantsArticleToProductAssociation.AssociateEntityId];
                _this.createConnection(association, primaryEntity, relatedEntityLookup);
                Xrm.Page.ui.controls.get("AssociatedProductsGrid").refresh();
            };
            /// <summary>
            /// Is the subgrid Related Products Grid
            /// </summary>
            /// <param name="subGridControl"></param>
            this.isRelatedProductsSubGrid = function (subGridControl) {
                var RelatedProductsViewId = "{BA3387BF-382D-4376-A538-5B02467925D3}";
                if (subGridControl != null && subGridControl != undefined) {
                    var viewId = subGridControl.getViewSelector().getCurrentView().id;
                    return viewId == RelatedProductsViewId;
                }
                return false;
            };
            this.createConnection = function (associationType, primaryEntity, relatedEntityLookup) {
                var record1RoleId = null, record2RoleId = null, relatedEntity = null;
                if (!ClientUtility.DataUtil.isNullOrUndefined(relatedEntityLookup)) {
                    record1RoleId = { entityType: ProductManagement.EntityNames.ConnectionRole, id: ProductManagement.MetadataDrivenDialogConstantsArticleToProductAssociation.KnowledgeArticleRoleId };
                    record2RoleId = { entityType: ProductManagement.EntityNames.ConnectionRole, id: ProductManagement.MetadataDrivenDialogConstantsArticleToProductAssociation.AssociateProductRoleId };
                    relatedEntity = { entityType: ProductManagement.EntityNames.Product, id: relatedEntityLookup[0].id };
                    _this.createConnectionEntityRecord(primaryEntity, relatedEntity, record1RoleId, record2RoleId);
                }
                else {
                    var alert = { text: undefined };
                    if (associationType === ProductManagement.EntityNames.KnowledgeArticle) {
                        alert.text = ProductManagement.StringProvider.getResourceString("KnowledgeArticle_AssociateArticleArticle_DialogText");
                    }
                    else {
                        alert.text = ProductManagement.StringProvider.getResourceString("KnowledgeArticle_AssociateArticleProduct_DialogText");
                    }
                    var options = { width: 600, height: 150, position: 1 /* center */ };
                    Xrm.Navigation.openAlertDialog(alert, options);
                }
            };
            this.createConnectionEntityRecord = function (primaryEntity, relatedEntity, record1RoleId, record2RoleId) {
                var attributeValues = {};
                attributeValues["record1id_knowledgearticle@odata.bind"] = "knowledgearticles(" + ClientUtility.Guid.create(primaryEntity.id) + ")";
                attributeValues["record2id_product@odata.bind"] = "products(" + ClientUtility.Guid.create(relatedEntity.id) + ")";
                attributeValues["record1roleid@odata.bind"] = "connectionroles(" + record1RoleId.id + ")";
                attributeValues["record2roleid@odata.bind"] = "connectionroles(" + record2RoleId.id + ")";
                ClientUtility.DialogUtil.showProgressMessage();
                Xrm.WebApi.online.createRecord(ProductManagement.EntityNames.Connection, attributeValues).then(function (response) {
                    ClientUtility.DialogUtil.hideProgressMessage();
                    // Fire a telemetry event
                    var articleId = primaryEntity.id;
                    var statecode = Xrm.Page.data.entity.attributes.get("statecode").getValue();
                    var statuscode = Xrm.Page.data.entity.attributes.get("statuscode").getValue();
                    var ribbonCommandId = ProductManagement.KnowledgeArticleUtility.getRibbonCommandId();
                    var screenDimensions = ProductManagement.KnowledgeArticleUtility.getScreenDimensions();
                    ProductManagement.KnowledgeArticleUtility.reportEvent(articleId, statecode, statuscode, screenDimensions.width, screenDimensions.height, ribbonCommandId);
                    Xrm.Page.data.refresh(true);
                    Xrm.Page.ui.refreshRibbon();
                }, ClientUtility.DialogUtil.actionFailedCallbackForMoca);
            };
        }
        return KnowledgeArticle;
    }());
    KnowledgeArticle.Instance = new KnowledgeArticle();
    KnowledgeArticle.dialogClose = function (context) {
        var formContext = ClientUtility.DataUtil.isNullOrUndefined(context) ? Xrm.Page : context.getFormContext();
        ClientUtility.DialogUtil.setLastButtonClicked(ClientUtility.MetadataDrivenDialogConstants.DialogCancelId);
        formContext.ui.close();
    };
    KnowledgeArticle.ctor = (function () {
    })();
    ProductManagement.KnowledgeArticle = KnowledgeArticle;
})(ProductManagement || (ProductManagement = {}));
