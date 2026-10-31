var OmniChannelPackage;
(function (OmniChannelPackage) {
    var CCIDialog = (function () {
        function CCIDialog() {
        }
        CCIDialog.onLoad = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var name = this.getAttributeValue(formContext, this.Paramaters.UserNameParameterName);
            Xrm.Page.getControl(this.Controls.BotName).setLabel("Name: " + (name || 'unknown'));
        };
        CCIDialog.saveChanges = function (executionContext) {
            var _this = this;
            var queuesGrid = Xrm.Page.getControl(this.Controls.QueuesGrid).getGrid();
            var userId = this.getAttributeValue(executionContext.getFormContext(), this.Paramaters.UserIdParameterName).replace(/[{}]/g, "");
            var webAPIUri = "" + Xrm.Utility.getGlobalContext().getClientUrl() + this.RequestConstants.WebAPIPath;
            if (queuesGrid) {
                queuesGrid.getSelectedRows().forEach(function (queueRec) {
                    if (queueRec && queueRec.getData() && queueRec.getData().getEntity()) {
                        var queueId = queueRec.getData().getEntity()._entityId.guid;
                        if (queueId) {
                            var data = {
                                "@odata.context": webAPIUri + "/$metadata#$ref",
                                "@odata.id": _this.RequestConstants.QueueEntitiesName + "(" + queueId + ")"
                            };
                            var requestUri = webAPIUri + "/" + _this.RequestConstants.SystemUserEntitiesName + "(" + userId + ")/" + _this.RequestConstants.UserToQueuesRelationshipName + "/$ref";
                            _this.sendRequest("POST", requestUri, data);
                        }
                    }
                });
                if (queuesGrid.getSelectedRows().getLength() > 0) {
                    window.parent.location.reload();
                }
            }
            Xrm.Page.ui.close();
        };
        CCIDialog.onClickCancel = function () {
            Xrm.Page.ui.close();
        };
        CCIDialog.isNewQueueButtonEnabled = function () {
            if (this.isCCIDialogForm()) {
                return false;
            }
            return true;
        };
        CCIDialog.isCCIDialogForm = function () {
            if (Xrm.Page.ui.formSelector) {
                var formSelector = Xrm.Page.ui.formSelector;
                var formId = formSelector._formId.guid;
                return this.CCIDialogForm[formId] || false;
            }
            return false;
        };
        CCIDialog.getAttributeValue = function (formContext, attributeName) {
            if (formContext && formContext.data && formContext.data.attributes) {
                return formContext.data.attributes.get(attributeName).getValue();
            }
            return null;
        };
        CCIDialog.sendRequest = function (action, uri, data) {
            return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest();
                request.open(action, encodeURI(uri), true);
                request.setRequestHeader("OData-MaxVersion", "4.0");
                request.setRequestHeader("OData-Version", "4.0");
                request.setRequestHeader("Accept", "application/json");
                request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                request.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        request.onreadystatechange = null;
                        switch (this.status) {
                            case 200:
                            case 201:
                            case 204:
                                resolve(request.response);
                                break;
                            default:
                                var error;
                                try {
                                    error = JSON.parse(request.response).error;
                                }
                                catch (e) {
                                    error = new Error("Unexpected Error");
                                }
                                reject(error);
                                break;
                        }
                    }
                };
                request.send(JSON.stringify(data));
            });
        };
        ;
        return CCIDialog;
    }());
    CCIDialog.Controls = {
        BotName: 'lbl_botName',
        BotDescription: 'lbl_botDescription',
        QueuesGrid: "Active Queues"
    };
    CCIDialog.Paramaters = {
        UserIdParameterName: 'param_BotUserId',
        UserNameParameterName: 'param_BotUserName',
        UserDescriptionParameterName: 'param_BotUserDescription'
    };
    CCIDialog.RequestConstants = {
        WebAPIPath: "/api/data/v9.0",
        UserToQueuesRelationshipName: "queuemembership_association",
        SystemUserEntitiesName: "systemusers",
        QueueEntitiesName: "queues"
    };
    CCIDialog.CCIDialogForm = {
        '0de70318-7805-4ef0-9758-cf45544e91ed': true
    };
    OmniChannelPackage.CCIDialog = CCIDialog;
})(OmniChannelPackage || (OmniChannelPackage = {}));
