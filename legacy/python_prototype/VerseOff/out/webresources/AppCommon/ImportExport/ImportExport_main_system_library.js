var ExcelFileType = 3
    , CSVFileType = 0
    , XmlFileType = 1
    , ImportFileUploadDialogOpenTime = "Import.ImportFileUploadDialogOpenTime"
    , ImportDataSettingDialogOpenTime = "Import.ImportDataSettingDialogOpenTime"
    , ImportMappingDialogOpenTime = "Import.ImportMappingDialogOpenTime"
    , dataDelimiter = 0
    , fieldDelimiter = 0
    , isFirstRowHeader = 0
    , propertiesList = ["id_ImportId", "id_ImportFileName", "id_ImportFileId", "id_ImportFileSize", "id_DataDelimiter", "id_FieldDelimiter", "id_IsFirstRowHeader", "id_DataDelimiterTemplate", "id_MapXml", "id_MapChanged", "id_DuplicateDetection", "id_ImportType", "id_DefaultOwner", "id_DefaultOwnerType", "id_HeaderColumnIndexesToBeIgnored"]
    , parameterList = ["id_ImportId", "id_ImportFileName", "id_ImportFileId", "id_ImportFileSize", "id_DataDelimiter", "id_FieldDelimiter", "id_IsFirstRowHeader", "id_DataDelimiterTemplate", "id_MapXml", "id_MapChanged", "id_DuplicateDetection", "id_ImportType", "id_DefaultOwner", "id_DefaultOwnerType", "id_HeaderColumnIndexesToBeIgnored", "id_ImportFileType", "id_EntityLogicalName", "id_UpsertMode", "id_EntityKey", "id_EntityKeyAttributes"]
    , oldMapxml = null
    , customErrorCode = 1234
    , MapNodeIndex = 0
    , EntityMapsNodeIndex = 1
    , EntityMapNodeIndex = 0
    , AttributeMapsNodeIndex = 0
    , PicklistMapsNodeIndex = 4
    , ProcessCodeIndex = 3
    , TargetAttributeNameNodeIndex = 2
    , PickListTargetValueNameNodeIndex = 2
    , PickListTargetValueNodeIndex = 1 
    , appCommonResourceName = "AppCommon/Localization/Languages/AppCommon"
    , activityPointerEntityList = null;
function getFileDetails() {
    var importId = Xrm.Page.data.attributes.get("id_ImportId").getValue()
        , importType = Xrm.Page.data.attributes.get("id_ImportType").getValue()
        , entityLogicalName = Xrm.Page.data.attributes.get("id_EntityLogicalName").getValue()
        , importFileId = Xrm.Page.data.attributes.get("id_ImportFileId").getValue();
    return [importFileId, importType, entityLogicalName, importFileId]
}
function getDialogNameAndTimeSpent(dialogname, isback) {
    result = [];
    previousDialogName = "";
    timeSpentOnPreviousDialog = 0;
    if (isback) {
        if (dialogname == "ImportDataSettings") {
            var startTime = sessionStorage.getItem(ImportMappingDialogOpenTime);
            if (startTime) {
                previousDialogName = "ImportMapping";
                timeSpentOnPreviousDialog = (new Date).getTime() - startTime;
                sessionStorage.removeItem(ImportMappingDialogOpenTime)
            }
        } else if (dialogname == "ImportFileUpload") {
            var startTime = sessionStorage.getItem(ImportDataSettingDialogOpenTime);
            if (startTime) {
                previousDialogName = "ImportDataSettings";
                timeSpentOnPreviousDialog = (new Date).getTime() - startTime;
                sessionStorage.removeItem(ImportDataSettingDialogOpenTime)
            }
        }
    } else if (dialogname == "ImportDataSettings") {
        var startTime = sessionStorage.getItem(ImportFileUploadDialogOpenTime);
        if (startTime) {
            previousDialogName = "ImportFileUpload";
            timeSpentOnPreviousDialog = (new Date).getTime() - startTime;
            sessionStorage.removeItem(ImportFileUploadDialogOpenTime)
        }
    } else if (dialogname == "ImportMapping") {
        var startTime = sessionStorage.getItem(ImportDataSettingDialogOpenTime);
        if (startTime) {
            previousDialogName = "ImportDataSettings";
            timeSpentOnPreviousDialog = (new Date).getTime() - startTime;
            sessionStorage.removeItem(ImportDataSettingDialogOpenTime)
        }
    }
    if (previousDialogName != "") {
        result.push(previousDialogName);
        result.push(timeSpentOnPreviousDialog)
    }
    return result
}
function upsertAttributesRequest() {
    var wizardData = constructPostData(propertiesList)
        , UpsertMode = Xrm.Page.data.attributes.get("id_UpsertMode").getValue()
        , EntityKeyId = Xrm.Page.data.attributes.get("id_EntityKey").getValue();
    function UpdateUpsertAttributesRequest(wizardData, UpsertMode, EntityKeyId) {
        this.WizardDataXml = wizardData;
        this.UpsertModeCode = UpsertMode;
        this.EntityKeyId = EntityKeyId;
        UpdateUpsertAttributesRequest.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {
                    WizardDataXml: {
                        typeName: "Edm.String",
                        structuralProperty: 1
                    },
                    UpsertModeCode: {
                        typeName: "Edm.Int32",
                        structuralProperty: 1
                    },
                    EntityKeyId: {
                        typeName: "Edm.String",
                        structuralProperty: 1
                    }
                },
                operationType: 0,
                operationName: "UpdateUpsertAttributes"
            }
        }
    }
    var updateUpsertAttributesRequest = new UpdateUpsertAttributesRequest(wizardData, UpsertMode, EntityKeyId);
    return updateUpsertAttributesRequest
}
function reviewMapping(data) {
    Xrm.Utility.showProgressIndicator("");
    var params = {};
    populateDelimiterVariables();
    var upsertData = upsertAttributesRequest();
    sdkExecuteHelper(upsertData, function (response) {
        setDefaultOwnerAndCallback(params, updateMapXmlAttributeAndNavigateToMappingTab);
    }, "UpdateUpsertAttributes")
}

function setDefaultOwnerAndCallback(params, callbackFunction) {
    var ownerControl = Xrm.Page.getControl("owner_id");
    var ownerLookupAttribute = Xrm.Page.getAttribute("owner_id");
    if (!IsNullOrUndefined(ownerControl) && !IsNullOrUndefined(ownerLookupAttribute) && ownerLookupAttribute.getValue() != null && ownerLookupAttribute.getValue().length > 0) {
        var selectedOwner = ownerLookupAttribute.getValue()[0];
        params["id_DefaultOwner"] = selectedOwner.id.substring(1, selectedOwner.id.length - 1);
        // set the owner type based on selection as either user or team.
        params["id_DefaultOwnerType"] = selectedOwner.entityType == "systemuser" ? "8" : "9";
        console.log("Selected OwnerId: " + selectedOwner.id);
        callbackFunction(params);
    }
    else {
        var datawhoamI = whoAmIRequest();
        sdkExecuteHelper(datawhoamI, function (response) {
            params["id_DefaultOwner"] = response["UserId"];
            params["id_DefaultOwnerType"] = "8";
            console.log(response["UserId"]);
            callbackFunction(params);
        }, "WhoAmI")
    }
}

function updateMapXmlAttributeAndNavigateToMappingTab(params) {
    var mapXml = Xrm.Page.data.attributes.get("id_MapXml");
    if (mapXml.getValue() == null || mapXml.getValue() == "") {
        var datamap = getImportMapXml(propertiesList);
        sdkExecuteHelper(datamap, function (response) {
            params["id_MapXml"] = response["importMapXml"];
            sessionStorage.setItem("ForceReload", "true");
            oldMapxml = params["id_MapXml"];
            console.log(response["importMapXml"]);
            Xrm.Utility.closeProgressIndicator();
            openDialog("ImportMapping", 700, 800, params, false)
        }, "GetImportMapXml")
    } else {
        console.log(mapXml.getValue());
        Xrm.Utility.closeProgressIndicator();
        openDialog("ImportMapping", 700, 800, params, false)
    }
}
function importFileUploadOnLoad() {
    var importFileType = Xrm.Page.data.attributes.get("id_ImportFileType")
        , fileType = ExcelFileType;
    var entityName = Xrm.Page.data.attributes.get("id_EntityLogicalName").getValue();

    if (importFileType != null && importFileType.getValue() != null) {
        fileType = importFileType.getValue();
    }
    var header = Xrm.Page.ui.controls.get("formheader");
    if (fileType == ExcelFileType) {
        header.setLabel(Xrm.Utility.getResourceString(appCommonResourceName, "ImportExport_Label_ImportFromExcel"));
    }
    else if (fileType == CSVFileType) {
        header.setLabel(Xrm.Utility.getResourceString(appCommonResourceName, "ImportExport_Label_ImportFromCSV"));
    }
    else if (fileType == XmlFileType) {
        header.setLabel(Xrm.Utility.getResourceString(appCommonResourceName, "ImportExport_Label_ImportFromXML"));
    }
    var activityPointerTypeControl = Xrm.Page.ui.controls.get("activityPointerType");
    if (activityPointerTypeControl != null) {
        if (entityName == "activitypointer") {
            getActivityPointerTypeEntities(activityPointerTypeControl);
        }
        else {
            activityPointerTypeControl.setVisible(false);
        }
    }
    setCurrentUserAsOwner();
    sessionStorage.setItem(ImportFileUploadDialogOpenTime, (new Date).getTime())
}
function setCurrentUserAsOwner() {
    var ownerControl = Xrm.Page.ui.controls.get("owner_id");
    var ownerLookupAttribute = Xrm.Page.getAttribute("owner_id");
    if (ownerControl != null && Xrm.Utility.getGlobalContext() != null && Xrm.Utility.getGlobalContext().userSettings != null) {
        var owner = [];
        owner.push({
            id: Xrm.Utility.getGlobalContext().userSettings.userId,
            name: Xrm.Utility.getGlobalContext().userSettings.userName,
            entityType: "systemuser"
        });
        ownerLookupAttribute.setValue(owner);
    }
}
function importSettingsOnLoad(data) {
    sessionStorage.setItem(ImportDataSettingDialogOpenTime, (new Date).getTime());
    var importFileType = Xrm.Page.data.attributes.get("id_ImportFileType")
        , fileType = ExcelFileType;
    if (importFileType != null)
        fileType = importFileType.getValue()
}
function importMappingOnLoad() {
    var importFileType = Xrm.Page.data.attributes.get("id_ImportFileType");
    sessionStorage.setItem(ImportMappingDialogOpenTime, (new Date).getTime());
    var fileType = ExcelFileType;
    if (importFileType != null)
        fileType = importFileType.getValue()
}
function importFileUploadClose(context) {
    var startTime = sessionStorage.getItem(ImportFileUploadDialogOpenTime);
    if (startTime) {
        var fileParams = getFileDetails();
        Xrm.Reporting.reportSuccess("Import.ImportFileUpload.TimeSpent", [{
            name: "Direction",
            value: "Back"
        }, {
            name: "TimeSpent",
            value: (new Date).getTime() - startTime
        }, {
            name: "ImportFileId",
            value: fileParams[0]
        }, {
            name: "ImportType",
            value: fileParams[1]
        }, {
            name: "EntityLogicalName",
            value: fileParams[2]
        }]);
        sessionStorage.removeItem(ImportFileUploadDialogOpenTime)
    }
    Xrm.Page.ui.close()
}
function bytesToSize(bytes) {
    var sizes = [Xrm.Utility.getResourceString(appCommonResourceName, "ImportExport_Label_FileSizeInBytes"), Xrm.Utility.getResourceString(appCommonResourceName, "ImportExport_Label_FileSizeInKB"), Xrm.Utility.getResourceString(appCommonResourceName, "ImportExport_Label_FileSizeInMB"), Xrm.Utility.getResourceString(appCommonResourceName, "ImportExport_Label_FileSizeInGB"), Xrm.Utility.getResourceString(appCommonResourceName, "ImportExport_Label_FileSizeInTB")];
    if (bytes == 0)
        return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i]
}
function isValidFile(importfileTypeExpected, importfileTypeUploaded) {
    if (importfileTypeUploaded == undefined)
        return false;
    if (importfileTypeExpected == 0) {
        if (importfileTypeUploaded.toLowerCase() == "csv")
            return true
    }
    else if (importfileTypeExpected == 3) {
        if (importfileTypeUploaded.toLowerCase() == "xlsx")
            return true;
    }
    else if (importfileTypeExpected == 1) {
        if (importfileTypeUploaded.toLowerCase() == "xml")
            return true;
    }
    return false;
}
function IsNullOrUndefined(object) {
    return object === null || object === undefined;
}
function uploadfile(context) {
    Xrm.Utility.showProgressIndicator("");
    var showDuplicates = Xrm.Page.context.organizationSettings.attributes.isduplicatedetectionenabled;
    var importfileType = Xrm.Page.data.attributes.get("id_ImportFileType").getValue();
    if (!IsNullOrUndefined(showDuplicates) && !IsNullOrUndefined(importfileType)) {
        //default tab name for xlsx(3)
        var tabName = "Import Data Template tab";
        //tab name for csv(0) and xml(1)
        if (importfileType == 0 || importfileType == 1) {
            tabName = "Import Data tab";
        }
        var basicTabSections = Xrm.Page.ui.tabs.getByName(tabName).sections;
        basicTabSections.forEach(function (section) {
            if (section._controlName == "Duplicate Data Settings For XLSX" || section._controlName == "Duplicate Data Settings For CSV") {
                (showDuplicates == 1) ? section.setVisible(true) : section.setVisible(false);
            }
        });
    }
    var fileContent = Xrm.Page.data.attributes.get("importfile_id").getValue()
        , fileName = Xrm.Page.data.attributes.get("id_ImportFileName").getValue()
        , importfileTypeExpected = Xrm.Page.data.attributes.get("id_ImportFileType").getValue()
        , importfileTypeUploaded = /[.]/.exec(fileName) ? /[^.]+$/.exec(fileName)[0] : undefined
        , isValidFileType = isValidFile(importfileTypeExpected, importfileTypeUploaded)
        , isFileContentValid = Xrm.Page.data.attributes.get("importfile_id").isValid();

    // Validate if Activity Type is selected in case the Grid is ActivityPointer grid
    var activityTypeControl = Xrm.Page.ui.controls.get("activityPointerType");
    if (activityTypeControl != null && activityTypeControl.getVisible()) {
        var selectedEntityOTC = activityTypeControl.getAttribute().getValue();
        if (selectedEntityOTC == null || selectedEntityOTC == 0) {
            return logErrorTelemetryAndShowErrorDialogAnd("ImportExport_library.uploadfile", "Import.NoActivityTypeError", "ImportExport_Label_NoActivityTypeSelected", "");
        }
        entityLogicalName = activityPointerEntityList[selectedEntityOTC];
        if (entityLogicalName != null) {
            Xrm.Page.data.attributes.get("id_EntityLogicalName").setValue(entityLogicalName);
        }
    }
    if (fileName == null || fileName == undefined || fileName == "") {
        return logErrorTelemetryAndShowErrorDialogAnd("ImportExport_library.uploadfile", "Import.NoFileError", "ImportExport_Label_NoFileSelected", "");
    }
    if (isValidFileType == false) {
        return logErrorTelemetryAndShowErrorDialogAnd("ImportExport_library.uploadfile", "Import.InvalidFileFormatError", "ImportExport_Label_InvalidFileFormat", "");
    }
    if (isFileContentValid == false) {
        return logErrorTelemetryAndShowErrorDialogAnd("ImportExport_library.uploadfile", "Import.FileSizeMaxLimitExceeded", "ImportExport_Label_FileSizeMaxLimitExceeded", "");
    }
    if (fileContent == null || fileContent == undefined || fileContent == "") {
        return logErrorTelemetryAndShowErrorDialogAnd("ImportExport_library.uploadfile", "Import.EmptyFileError", "ImportExport_Label_NoDataInFile", "");
    }

    function ImportFileUploadRequest(fileContent, fileName) {
        this.FileContent = fileContent;
        this.FileName = fileName;
        ImportFileUploadRequest.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {
                    FileContent: {
                        typeName: "Edm.String",
                        structuralProperty: 1
                    },
                    FileName: {
                        typeName: "Edm.String",
                        structuralProperty: 1
                    }
                },
                operationType: 0,
                operationName: "ImportFileUpload"
            }
        }
    }
    var importFileUploadRequest = new ImportFileUploadRequest(fileContent, fileName)
        , fileType = Xrm.Page.data.attributes.get("id_ImportFileType").getValue()
        , entityLogicalName = Xrm.Page.data.attributes.get("id_EntityLogicalName").getValue()
        , params = {};
    sdkExecuteHelper(importFileUploadRequest, function (data) {
        params["id_DataDelimiter"] = data.DataDelimiter.toString();
        params["id_FieldDelimiter"] = data.DataDelimiter.toString();
        params["id_DataDelimiterTemplate"] = data.DataDelimiter.toString();
        params["id_IsFirstRowHeader"] = true;
        params["id_HeaderColumnIndexesToBeIgnored"] = data.HeaderColumnIndexesToBeIgnoredCsv;
        params["id_ImportFileId"] = data.ImportFileId;
        params["id_ImportId"] = data.ImportId;
        params["id_ImportType"] = data.ImportType;
        params["id_ImportFileSize"] = bytesToSize(.75 * fileContent.length);

        if (fileType == ExcelFileType)
            if (data.EntityLogicalName != null)
                if (data.EntityLogicalName != entityLogicalName) {
                    var entityLabel = Xrm.Page.data.attributes.get("id_EntityLabel")
                        , entityLabelValue = "";
                    if (entityLabel != null) {
                        entityLabelValue = entityLabel.getValue();
                        if (entityLabelValue != null) {
                            return logErrorTelemetryAndShowErrorDialogAnd("ImportExport_library.uploadfile", "Import.FileTypeError", "ImportExport_Label_InvalidFileSubmitted", entityLabelValue);
                        }
                        else
                            Xrm.Utility.getEntityMetadata(entityLogicalName).then(function (responsedata) {
                                if (responsedata != null)
                                    entityLabelValue = responsedata.DisplayName;
                                return logErrorTelemetryAndShowErrorDialogAnd("ImportExport_library.uploadfile", "Import.FileTypeError", "ImportExport_Label_InvalidFileSubmitted", entityLabelValue);
                            }, function (error) {
                                return logErrorTelemetryAndShowErrorDialogAnd("ImportExport_library.uploadfile", "Import.FileTypeError", "ImportExport_Label_InvalidFileSubmitted", entityLabelValue);
                            });
                    }
                    else {
                        return logErrorTelemetryAndShowErrorDialogAnd("ImportExport_library.uploadfile", "Import.FileTypeError", "ImportExport_Label_InvalidFileSubmitted", entityLabelValue);
                    }
                    return
                }
        Xrm.Reporting.reportSuccess("Import.FileUpload", [{
            name: "ImportFileId",
            value: params["id_ImportFileId"]
        }, {
            name: "ImportType",
            value: params["id_ImportType"]
        }, {
            name: "ImportFileSize",
            value: params["id_ImportFileSize"]
        }, {
            name: "EntityLogicalName",
            value: Xrm.Page.data.attributes.get("id_EntityLogicalName").getValue()
        }]);
        Xrm.Utility.closeProgressIndicator();
        openDialog("ImportDataSettings", 600, 600, params, false)
    }, "fileUploadData")
}

function logErrorTelemetryAndShowErrorDialogAnd(functionName, eventName, errorMessageString, entityLabel) {
    var messageResourceString = "";
    if (entityLabel == "") {
        messageResourceString = Xrm.Utility.getResourceString(appCommonResourceName, errorMessageString);
    }
    else {
        messageResourceString = String.format(Xrm.Utility.getResourceString(appCommonResourceName, errorMessageString), entityLabel);
    }

    fileParams = getFileDetails();
    var errorMessage = {
        message: messageResourceString
    }
    Xrm.Reporting.reportFailure(eventName, errorMessage, "", [{
        name: "FunctionName",
        value: functionName
    }, {
        name: "Error",
        value: errorMessage
    }, {
        name: "EntityLogicalName",
        value: fileParams[2]
    }, {
        name: "ImportId",
        value: fileParams[0]
    }, {
        name: "ImportType",
        value: fileParams[1]
    }]);
    Xrm.Utility.closeProgressIndicator();
    Xrm.Navigation.openErrorDialog({
        errorCode: customErrorCode,
        message: messageResourceString
    });
    return
}
function importSettingsBack(data) {
    openDialog("ImportFileUpload", 600, 600, null, true)
}
function openDialog(dialogname, width, height, dialogParams, isback) {
    var params = dialogParams == null ? {} : dialogParams
        , previousDialogData = getDialogNameAndTimeSpent(dialogname, isback);
    if (previousDialogData.length == 2) {
        var fileParams = getFileDetails();
        Xrm.Reporting.reportSuccess("Import." + previousDialogData[0] + ".TimeSpent", [{
            name: "Direction",
            value: isback ? "Back" : "Forward"
        }, {
            name: "TimeSpent",
            value: previousDialogData[1]
        }, {
            name: "ImportFileId",
            value: fileParams[0]
        }, {
            name: "ImportType",
            value: fileParams[1]
        }, {
            name: "EntityLogicalName",
            value: fileParams[2]
        }])
    }
    for (var i = 0; i < parameterList.length; i++)
        if (params[parameterList[i]] == null && Xrm.Page.data.attributes.get(parameterList[i]) != null && Xrm.Page.data.attributes.get(parameterList[i]).getValue() != null)
            params[parameterList[i]] = Xrm.Page.data.attributes.get(parameterList[i]).getValue();
    var isMultipage = Xrm.Page.ui.tabs.getAll().length > 1;
    if (isMultipage) {
        for (key in dialogParams)
            if (Xrm.Page.data.attributes.get(key) != null)
                if (Xrm.Page.data.attributes.get(key).getAttributeType() == "string")
                    Xrm.Page.data.attributes.get(key).setValue(dialogParams[key].toString());
                else
                    Xrm.Page.data.attributes.get(key).setValue(dialogParams[key]);
        var importFileType = Xrm.Page.data.attributes.get("id_ImportFileType");
        if (importFileType != null && importFileType.getValue() != null)
            fileType = importFileType.getValue();
        if (isback)
            if (fileType == ExcelFileType) {
                dialogname == "ImportDataSettings" && Xrm.Page.ui.moveTo("Import Data Template tab");
                dialogname == "ImportFileUpload" && Xrm.Page.ui.moveTo("Import File Upload tab")
            } else {
                dialogname == "ImportFileUpload" && Xrm.Page.data.attributes.get("id_MapXml").setValue(null);
                Xrm.Page.ui.movePrevious()
            }
        else if (fileType == ExcelFileType) {
            dialogname == "ImportDataSettings" && Xrm.Page.ui.moveTo("Import Data Template tab");
            dialogname == "ImportMapping" && Xrm.Page.ui.moveTo("Import mapping tab")
        } else
            Xrm.Page.ui.moveTo(Xrm.Page.ui.taskProcess.getDefaultNextPageName());
        return
    }
    Xrm.Page.ui.close();
    Xrm.Navigation.openDialog(dialogname, {
        width: width,
        height: height,
        position: 2
    }, params)
}
function backToDelimiter(data) {
    openDialog("ImportDataSettings", 600, 600, null, true)
}
function datasettingssubmitImportJob() {
    var params = {};
    Xrm.Page.data.attributes.get("id_DataDelimiterTemplate").getValue() != null && Xrm.Page.data.attributes.get("id_DataDelimiter").setValue(Xrm.Page.data.attributes.get("id_DataDelimiterTemplate").getValue());
    Xrm.Page.data.attributes.get("id_IsMandatoryFieldValid").setValue("true");
    var upsertData = upsertAttributesRequest();
    sdkExecuteHelper(upsertData, function (response) {
        setDefaultOwnerAndCallback(params, updateMapXmlAndSubmitImportJob);
    }, "UpdateUpsertAttributes")
}
function updateMapXmlAndSubmitImportJob(params) {
    Xrm.Page.data.attributes.get("id_DefaultOwner").setValue(params["id_DefaultOwner"]);
    Xrm.Page.data.attributes.get("id_DefaultOwnerType").setValue(params["id_DefaultOwnerType"]);
    var mapXml = Xrm.Page.data.attributes.get("id_MapXml");
    if (mapXml.getValue() == null || mapXml.getValue() == "") {
        var datamap = getImportMapXml(propertiesList);
        sdkExecuteHelper(datamap, function (response) {
            params["id_MapXml"] = response["importMapXml"];
            oldMapxml = params["id_MapXml"];
            console.log(response["importMapXml"]);
            Xrm.Page.data.attributes.get("id_MapXml").setValue(oldMapxml);
            submitImportJob()
        }, "GetImportMapXml")
    } else {
        console.log(mapXml.getValue());
        submitImportJob()
    }
}
function SubmitData(mapxml) {
    Xrm.Utility.showProgressIndicator("");
    hasMapChanged(mapxml);
    var importWizardData = constructPostData(propertiesList);
    function SubmitImportJobRequest(importWizardData) {
        this.ImportWizardXml = importWizardData;
        SubmitImportJobRequest.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {
                    ImportWizardXml: {
                        typeName: "Edm.String",
                        structuralProperty: 1
                    }
                },
                operationType: 0,
                operationName: "SubmitImportJob"
            }
        }
    }
    var submitImportJobRequest = new SubmitImportJobRequest(importWizardData);
    sdkExecuteHelper(submitImportJobRequest, function (data) {
        Xrm.Reporting.reportSuccess("Import.FileSubmit", [{
            name: "ImportFileId",
            value: Xrm.Page.data.attributes.get("id_ImportFileId").getValue()
        }]);
        console.log(data);
        var importMapName = Xrm.Page.data.attributes.get("id_ImportMapName").getValue();
        importMapName != null && Xrm.WebApi.updateRecord("importmap", data["ImportStatus"], {
            name: importMapName.trim(),
            importmaptype: 1
        });
        Xrm.Utility.closeProgressIndicator();
        next_tab()
    }, "SubmitImportJob");
    var startTime = sessionStorage.getItem(ImportMappingDialogOpenTime);
    if (startTime) {
        var fileParams = getFileDetails();
        Xrm.Reporting.reportSuccess("Import.ImportMapping.TimeSpent", [{
            name: "Direction",
            value: "Forward"
        }, {
            name: "TimeSpent",
            value: (new Date).getTime() - startTime
        }, {
            name: "ImportFileId",
            value: fileParams[0]
        }, {
            name: "ImportType",
            value: fileParams[1]
        }, {
            name: "EntityLogicalName",
            value: fileParams[2]
        }]);
        sessionStorage.removeItem(ImportMappingDialogOpenTime)
    }    
}
function finalsubmitImportJob(mapxml) {    
    var isMandatoryFieldValid = Xrm.Page.data.attributes.get("id_IsMandatoryFieldValid").getValue()
        , mapxml = Xrm.Page.data.attributes.get("id_MapXml").getValue()
        , pos = mapxml.search("Unmapped");
    if (pos >= 0 || isMandatoryFieldValid == false) {
        var importFileType = Xrm.Page.data.attributes.get("id_ImportFileType")
            , confirmDialogOptions = {
                height: 220,
                width: 600
            }
            , confirmationDialogText = null;
        if (pos >= 0 && isMandatoryFieldValid == false)
            confirmationDialogText = Xrm.Utility.getResourceString(appCommonResourceName, "ImportExport_Label_MandatoryAndOptionalUnmappedFieldConfimationDialog");
        else if (pos >= 0)
            confirmationDialogText = Xrm.Utility.getResourceString(appCommonResourceName, "ImportExport_Label_OptionalUnmappedFieldConfimationDialog");
        else if (isMandatoryFieldValid == false)
            confirmationDialogText = Xrm.Utility.getResourceString(appCommonResourceName, "ImportExport_Label_MandatoryUnmappedFieldConfimationDialog");
        var confirmDialogStrings = {
            title: Xrm.Utility.getResourceString(appCommonResourceName, "ImportExport_Label_UnmappedFieldConfimationDialogTitle"),
            text: confirmationDialogText,
            confirmButtonLabel: Xrm.Utility.getResourceString(appCommonResourceName, "ImportExport_Label_Confirm"),
            cancelButtonLabel: Xrm.Utility.getResourceString(appCommonResourceName, "ImportExport_Label_Cancel")
        };
        Xrm.Navigation.openConfirmDialog(confirmDialogStrings, confirmDialogOptions).then(function (response) {
            if (response.confirmed) {
                var msg = "All the fields in the entity are not mapped, Ignoring the UnMapped Fields and Submitting the Data"
                    , fileParams = getFileDetails();
                Xrm.Reporting.reportSuccess("Import.ImportMapping", [{
                    name: "FunctionName",
                    value: "ImportExport_library.finalsubmitImportJob"
                }, {
                    name: "IgnoreUnmappedEntities/Fields",
                    value: msg
                }, {
                    name: "EntityLogicalName",
                    value: fileParams[2]
                }, {
                    name: "ImportId",
                    value: fileParams[0]
                }, {
                    name: "ImportType",
                    value: fileParams[1]
                }]);
                SubmitData(mapxml)
            }
        }, function (err) {
            if (fileType == ExcelFileType) {
                params = {};
                Xrm.Utility.closeProgressIndicator();
                openDialog("ImportMapping", 700, 800, params, false)
            } else
                return
        })
    } else
        SubmitData(mapxml)
}
function submitImportJob(data) {
    var mapxml = Xrm.Page.data.attributes.get("id_MapXml").getValue();
    if (mapxml.search("<ProcessCode>Create</ProcessCode>") > -1 && mapxml.search("<PicklistMaps>") > -1)
        insertPickListValues(mapxml);
    else
        finalsubmitImportJob(mapxml)
}
function getImportMapXml(propertiesList) {
    var mapXml = Xrm.Page.data.attributes.get("id_MapXml")
        , importFileType = Xrm.Page.data.attributes.get("id_ImportFileType")
        , fileType = ExcelFileType;
    if (importFileType != null)
        fileType = importFileType.getValue();
    var wizardDataXml = mapXml.getValue() == null && (fileType == CSVFileType || fileType == XmlFileType) ? constructPostData(propertiesList, constructMapXml()) : constructPostData(propertiesList);
    function GetImportMapXmlRequest(importWizardData) {
        this.wizardDataXml = importWizardData;
        GetImportMapXmlRequest.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {
                    wizardDataXml: {
                        typeName: "Edm.String",
                        structuralProperty: 1
                    }
                },
                operationType: 0,
                operationName: "GetImportMapXml"
            }
        }
    }
    var getImportMapXmlRequest = new GetImportMapXmlRequest(wizardDataXml);
    return getImportMapXmlRequest
}
function whoAmIRequest() {
    function WhoAmIReq() {
        WhoAmIReq.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {},
                operationType: 1,
                operationName: "WhoAmI"
            }
        }
    }
    var whoAmI = new WhoAmIReq;
    return whoAmI
}
function sdkExecute(sdkRequest) {
    return Xrm.WebApi.online.execute(sdkRequest).then(function (response) {
        if (response.ok)
            return response.json()
    }, function (err) {
        throw err
    })
}
function sdkExecuteWrapper(sdkRequest, callback, callbackerror, sdkName) {
    sdkExecute(sdkRequest).then(function (response) {
        callback(response)
    }, function (err) {
        callbackerror(err)
    })
}
function sdkExecuteHelper(sdkRequest, callback, sdkName) {
    var fileParams = getFileDetails();
    sdkExecuteWrapper(sdkRequest, function (response) {
        Xrm.Reporting.reportSuccess("Import.SDKExecuteSuccess", [{
            name: "SdkName",
            value: sdkName
        }, {
            name: "EntityLogicalName",
            value: fileParams[2]
        }, {
            name: "ImportId",
            value: fileParams[0]
        }, {
            name: "ImportFileId",
            value: fileParams[3]
        }, {
            name: "ImportType",
            value: fileParams[1]
        }]);
        callback(response)
    }, function (err) {
        var errorMessage;
            if (err.message) {
                if (err.code == "2147746336" || err.code == "2147746708") {
                    errorMessage = formatDataMappingErrorMessage(err);
                }
                else {
                    errorMessage = err.message;
                }
            }
            else if (err.innerror && err.innerror.message) {
                errorMessage = err.innerror.message;
            }
            else {
                errorMessage = Xrm.Utility.getResourceString(appCommonResourceName, "ImportExport_Label_UnknownFailures");
            }
        Xrm.Navigation.openErrorDialog({
            errorCode: err.errorCode,
            message: errorMessage
        });
        Xrm.Reporting.reportFailure("Import.SDKExecuteError", err, "", [{
            name: "SdkName",
            value: sdkName
        }, {
            name: "Error",
            value: errorMessage
        }, {
            name: "EntityLogicalName",
            value: fileParams[2]
        }, {
            name: "ImportId",
            value: fileParams[0]
        }, {
            name: "ImportType",
            value: fileParams[1]
        }
        ]);
        Xrm.Utility.closeProgressIndicator();
    }, sdkName)
}

function formatDataMappingErrorMessage(error) {
    var errorMessage = (error.innerror && error.innerror.message) ? error.innerror.message : error.message;
    if (error.raw) {
        try {
            var errRawParsed_err = JSON.parse(JSON.parse(error.raw)._errorFault._responseText);
            if (error.code == "2147746336") {
                var param1 = errRawParsed_err.error["@Microsoft.PowerApps.CDS.ErrorDetails.0"];
                var param2 = errRawParsed_err.error["@Microsoft.PowerApps.CDS.ErrorDetails.1"];
                errorMessage = String.format(Xrm.Utility.getResourceString(appCommonResourceName, "ImportExport_Label_PreviligeError"), param1, param2);
            }
            else if (error.code == "2147746708") {
                var param1 = errRawParsed_err.error["@Microsoft.PowerApps.CDS.ErrorDetails.targetentity"];
                var param2 = errRawParsed_err.error["@Microsoft.PowerApps.CDS.ErrorDetails.targetattribute"];
                errorMessage = String.format(Xrm.Utility.getResourceString(appCommonResourceName, "ImportExport_Label_TargetAttributeInvalidForMap"), param1, param2);
            }
        }
        catch (err) {
            console.log("Error Occured: " + err);
        }
    }
    else {
        //ideally this should never be hit
        errorMessage = Xrm.Utility.getResourceString(appCommonResourceName, "ImportExport_Label_UnknownFailures");
    }
    return errorMessage;
}

function constructPostData(propertiesList, mapXml) {
    var importFileType = Xrm.Page.data.attributes.get("id_ImportFileType");
    if (importFileType != null && importFileType.getValue() != null)
        fileType = importFileType.getValue();
    for (var postData = '<?xml version="1.0"?><ImportWizardData>', i = 0; i < propertiesList.length; i++) {
        var property = propertiesList[i];
        if (Xrm.Page.data.attributes.get(property) != null) {
            var propertyValue = Xrm.Page.data.attributes.get(property).getValue();

            // If File Name contains '&' then replace it with '&amp;'
            if (property == "id_ImportFileName" && propertyValue != null)
                propertyValue = propertyValue.replace(/&(?!amp;)/g, "&amp;");

            if (propertyValue == null)
                if (property == "id_MapXml" && mapXml != null)
                    propertyValue = mapXml;
                else if (property == "id_DuplicateDetection")
                    if (fileType == ExcelFileType && Xrm.Page.getControl("allowDuplicatesInXlsx") != null && Xrm.Page.getControl("allowDuplicatesInXlsx").getAttribute() != null)
                        propertyValue = Xrm.Page.getControl("allowDuplicatesInXlsx").getAttribute().getValue() == 0 ? true : false;
                    else if (fileType == CSVFileType && Xrm.Page.getControl("allowDuplicatesInCSV") != null && Xrm.Page.getControl("allowDuplicatesInCSV").getAttribute() != null)
                        propertyValue = Xrm.Page.getControl("allowDuplicatesInCSV").getAttribute().getValue() == 0 ? true : false;
                    else
                        propertyValue = true;
                else
                    continue;
            postData = postData + "<" + property.substring(3) + ">" + propertyValue + "</" + property.substring(3) + ">"
        }
    }
    postData = postData + "</ImportWizardData>";
    postData = postData.replace(/\"/g, '"');
    return postData
}
function populateDelimiterVariables() {
    var dataDelimiterAttribute = Xrm.Page.data.attributes.get("id_DataDelimiter")
        , fieldDelimiterAttribute = Xrm.Page.data.attributes.get("id_FieldDelimiter")
        , isFirstRowHeaderAttribute = Xrm.Page.data.attributes.get("id_IsFirstRowHeader");
    if (dataDelimiterAttribute != null && dataDelimiterAttribute.getValue() != null && dataDelimiterAttribute.getValue() != dataDelimiter) {
        dataDelimiter = dataDelimiterAttribute.getValue();
        Xrm.Page.data.attributes.get("id_MapXml").setValue(null)
    }
    if (fieldDelimiterAttribute != null && fieldDelimiterAttribute.getValue() != null && fieldDelimiterAttribute.getValue() != fieldDelimiter) {
        fieldDelimiter = fieldDelimiterAttribute.getValue();
        Xrm.Page.data.attributes.get("id_MapXml").setValue(null)
    }
    if (isFirstRowHeaderAttribute != null && isFirstRowHeaderAttribute.getValue() != null && isFirstRowHeaderAttribute.getValue() != isFirstRowHeader) {
        isFirstRowHeader = isFirstRowHeaderAttribute.getValue();
        Xrm.Page.data.attributes.get("id_MapXml").setValue(null)
    }
}
function constructMapXml() {
    var date = new Date
        , dateTimeTicks = date.getTime() * 1e4 + 6.21355968e17
        , inputFileName = Xrm.Page.data.attributes.get("id_ImportFileName").getValue()
        , sourceEntityName = inputFileName.substr(0, inputFileName.lastIndexOf(".")) || inputFileName
        , targetEntityName = Xrm.Page.data.attributes.get("id_EntityLogicalName").getValue()
        , mapXml = '<Map Name="Modified_Automatic Mapping (' + dateTimeTicks + ')" Source="Import">\t\t\t<Description>Data map created automatically using the map settings specified during an import.</Description>\t\t\t<EntityMaps>\t\t\t\t<EntityMap InputFileName="' + inputFileName + '" InputFileId="file_1" SourceEntityName="' + sourceEntityName + '" ProcessCode="Process" TargetEntityName="' + targetEntityName + '"/>\t\t\t</EntityMaps>\t\t</Map>';
    return mapXml
}
function next_tab() {
    var importFileType = Xrm.Page.data.attributes.get("id_ImportFileType");
    if (importFileType != null && importFileType.getValue() != null)
        fileType = importFileType.getValue();
    if (fileType == ExcelFileType)
        Xrm.Page.ui.moveTo("Import Finish tab");
    else
        Xrm.Page.ui.moveTo(Xrm.Page.ui.taskProcess.getDefaultNextPageName())
}
function close_dialog(data) {
    Xrm.Page.ui.close()
}
function hasMapChanged(mapxml) {
    if (mapxml.localeCompare(oldMapxml) != 0)
        Xrm.Page.data.attributes.get("id_MapChanged").setValue("true");
    else
        Xrm.Page.data.attributes.get("id_MapChanged").setValue("false")
}
function XMLToString(xmlData) {
    var xmlString;
    if (window.ActiveXObject)
        xmlString = xmlData.xml;
    else
        xmlString = (new XMLSerializer).serializeToString(xmlData);
    return xmlString
}
function StringToXML(oString) {
    if (window.ActiveXObject) {
        var oXML = new ActiveXObject("Microsoft.XMLDOM");
        oXML.loadXML(oString);
        return oXML
    } else
        return (new DOMParser).parseFromString(oString, "text/xml")
}
function GetGuid() {
    var Guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0
            , v = c == "x" ? r : r & 3 | 8;
        return v.toString(16)
    });
    return Guid
}
function GetInsertOptionValue(optionSetName, attributeLogicalName, entityLogicalName, value, label, description, parentvalues, solutionUniqueName) {
    function InsertOptionValueRequest(optionSetName, attributeLogicalName, entityLogicalName, value, label, description, parentvalues, solutionUniqueName) {
        this.OptionSetName = optionSetName;
        this.AttributeLogicalName = attributeLogicalName;
        this.EntityLogicalName = entityLogicalName;
        this.Value = value;
        this.Label = label;
        this.Description = description;
        this.ParentValues = parentvalues;
        this.SolutionUniqueName = solutionUniqueName;
        InsertOptionValueRequest.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {
                    OptionSetName: {
                        typeName: "Edm.String",
                        structuralProperty: 1
                    },
                    AttributeLogicalName: {
                        typeName: "Edm.String",
                        structuralProperty: 1
                    },
                    EntityLogicalName: {
                        typeName: "Edm.String",
                        structuralProperty: 1
                    },
                    Value: {
                        typeName: "Edm.Int32",
                        structuralProperty: 1
                    },
                    Label: {
                        typeName: "Microsoft.Dynamics.CRM.Label",
                        structuralProperty: 2
                    },
                    Description: {
                        typeName: "Microsoft.Dynamics.CRM.Label",
                        structuralProperty: 2
                    },
                    ParentValues: {
                        typeName: "Edm.Int32",
                        structuralProperty: 4
                    },
                    SolutionUniqueName: {
                        typeName: "Edm.String",
                        structuralProperty: 1
                    }
                },
                operationType: 0,
                operationName: "InsertOptionValue"
            }
        }
    }
    var insertOptionValueRequest = new InsertOptionValueRequest(optionSetName, attributeLogicalName, entityLogicalName, value, label, description, parentvalues, solutionUniqueName);
    return insertOptionValueRequest
}
function GetLocalizedLabel(label, languageCode, isManaged, metadataId, hasChanged) {
    function LocalizedLabelRequest(Label, LanguageCode, IsManaged, MetadataId, HasChanged) {
        this.Label = label;
        this.LanguageCode = languageCode;
        this.IsManaged = isManaged;
        this.MetadataId = metadataId;
        this.HasChanged = hasChanged;
        LocalizedLabelRequest.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {
                    Label: {
                        typeName: "Edm.String",
                        structuralProperty: 1
                    },
                    LanguageCode: {
                        typeName: "Edm.Int32",
                        structuralProperty: 1
                    },
                    IsManaged: {
                        typeName: "Edm.Boolean",
                        structuralProperty: 1
                    },
                    MetadataId: {
                        typeName: "Edm.String",
                        structuralProperty: 1
                    },
                    HasChanged: {
                        typeName: "Edm.Boolean",
                        structuralProperty: 1
                    }
                },
                operationType: null,
                operationName: null
            }
        }
    }
    var localizedlabelrequest = new LocalizedLabelRequest(label, languageCode, isManaged, metadataId, hasChanged);
    return localizedlabelrequest
}
function GetLabel(locLabels, userLabel) {
    function LabelRequest(locLabels, userLabel) {
        this.LocalizedLabels = locLabels;
        this.UserLocalizedLabel = userLabel;
        LabelRequest.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {
                    LocalizedLabels: {
                        typeName: "Microsoft.Dynamics.CRM.LocalizedLabel",
                        structuralProperty: 4
                    },
                    UserLocalizedLabel: {
                        typeName: "Microsoft.Dynamics.CRM.LocalizedLabel",
                        structuralProperty: 2
                    },
                    operationType: null,
                    operationName: null
                }
            }
        }
    }
    var labelrequest = new LabelRequest(locLabels, userLabel);
    return labelrequest
}
function insertPickListValues(mapXML) {
    var entity = Xrm.Page.data.attributes.get("id_EntityLogicalName").getValue(),
        LanguageCode = Xrm.Page.context.getOrgLcid(), IsManaged = true, MetadataId = GetGuid(), HasChanged = false,
        picklistvalue = [], attributename = [], k = 0,
        mapxml = StringToXML(mapXML),
        AttributeMaps = mapxml.getElementsByTagName("AttributeMaps")[0];
    if (IsNullOrUndefined(AttributeMaps)) {
        console.log("No AttributeMaps found");
        return;
    }
    for (var i = 0; i < AttributeMaps.childElementCount; i++) {
        var node = AttributeMaps.childNodes[i];
        var targetAttributeNode = node.getElementsByTagName("TargetAttributeName")[0];
        var picklistMaps = node.getElementsByTagName("PicklistMaps")[0];
        if (!IsNullOrUndefined(targetAttributeNode) && !IsNullOrUndefined(picklistMaps))
            for (var j = 0; j < picklistMaps.childElementCount; j++) {
                var processCodeNode = picklistMaps.childNodes[j].getElementsByTagName("ProcessCode")[0];
                var targetValueName = picklistMaps.childNodes[j].getElementsByTagName("TargetValueName")[0];
                if (!IsNullOrUndefined(targetValueName) && !IsNullOrUndefined(processCodeNode) && processCodeNode.textContent == "Create") {
                    attributename[k] = targetAttributeNode.textContent;
                    picklistvalue[k] = targetValueName.textContent;
                    k++
                }
            }
    }
    console.log(picklistvalue);
    console.log(attributename);
    for (var InsertOptionValueRequests = [], i = 0; i < picklistvalue.length; i++) {
        var HasChanged = false
            , localizedLabel = GetLocalizedLabel(picklistvalue[i], LanguageCode, IsManaged, MetadataId, HasChanged);
        localizedLabels = [];
        localizedLabels.push(localizedLabel);
        var lbl = GetLabel(localizedLabels, localizedLabel)
            , descrip = GetLabel(localizedLabels, localizedLabel)
            , parentvalues = [];
        InsertOptionValueRequests[i] = GetInsertOptionValue("", attributename[i], entity, null, lbl, descrip, parentvalues, "Default")
    }
    sdkExecuteMultipleHelper(InsertOptionValueRequests, function (response) {
        console.log(response);
        var k = 0, mapxml = StringToXML(Xrm.Page.data.attributes.get("id_MapXml").getValue()),
            AttributeMaps = mapxml.getElementsByTagName("AttributeMaps")[0];
        for (var i = 0; i < AttributeMaps.childElementCount; i++) {
            var node = AttributeMaps.childNodes[i];
            var picklistMaps = node.getElementsByTagName("PicklistMaps")[0];
            if (!IsNullOrUndefined(picklistMaps))
                for (var j = 0; j < picklistMaps.childElementCount; j++) {
                    var processCodeNode = picklistMaps.childNodes[j].getElementsByTagName("ProcessCode")[0];
                    if (!IsNullOrUndefined(processCodeNode) && processCodeNode.textContent == "Create") {
                        picklistMaps.childNodes[j].getElementsByTagName("TargetValue")[0].textContent = response[k].NewOptionValue;
                        processCodeNode.textContent = "Process";
                        k++
                    }
                }
            AttributeMaps.childNodes[i] = node
        }
        Xrm.Page.data.attributes.get("id_MapXml").setValue(XMLToString(mapxml));
        finalsubmitImportJob(Xrm.Page.data.attributes.get("id_MapXml").getValue())
    }, "GetInsertOptionValue", true)
}
function sdkExecuteMultipleHelper(sdkRequest, callback, sdkName, getFileDetail) {
    if (getFileDetail)
        var fileParams = getFileDetails();
    sdkExecuteMultiple(sdkRequest, getFileDetail).then(function (response) {
        getFileDetail && Xrm.Reporting.reportSuccess("Import.SDKExecuteSuccess", [{
            name: "SdkName",
            value: sdkName
        }, {
            name: "EntityLogicalName",
            value: fileParams[2]
        }, {
            name: "ImportId",
            value: fileParams[0]
        }, {
            name: "ImportFileId",
            value: fileParams[3]
        }, {
            name: "ImportType",
            value: fileParams[1]
        }]);
        for (var isBoolean, errorMessage, i = 0; i < response.length; i++)
            if (response[i].error) {
                isBoolean = true;
                if (response[i].error.innerror && response[i].error.innerror.message && response[i].error.innerror.message != null && response[i].error.innerror.message != "")
                    errorMessage = response[i].error.innerror.message;
                else if (response[i].error.message && response[i].error.message != null && response[i].error.message != "")
                    errorMessage = response[i].error.message;
                else
                    errorMessage = Xrm.Utility.getResourceString(appCommonResourceName, "ImportExport_Label_UnknownFailures")
            }
        if (isBoolean)
            Xrm.Navigation.openErrorDialog({
                errorCode: customErrorCode,
                message: errorMessage
            });
        else
            callback(response)
    }, function (err) {
        var errorMessage;
        if (err.innerror && err.innerror.message && err.innerror.message != null && err.innerror.message != "")
            errorMessage = err.innerror.message;
        else if (err.message && err.message != null && err.message != "")
            errorMessage = err.message;
        else
            errorMessage = Xrm.Utility.getResourceString(appCommonResourceName, "ImportExport_Label_UnknownFailures");
        Xrm.Navigation.openErrorDialog({
            errorCode: err.errorCode,
            message: errorMessage
        });
        getFileDetail && Xrm.Reporting.reportFailure("Import.SDKExecuteError", err, "", [{
            name: "SdkName",
            value: sdkName
        }, {
            name: "Error",
            value: err.innerror.message
        }, {
            name: "EntityLogicalName",
            value: fileParams[2]
        }, {
            name: "ImportId",
            value: fileParams[0]
        }, {
            name: "ImportType",
            value: fileParams[1]
        }])
    })
}
function sdkExecuteMultiple(sdkRequest, getFileDetail) {
    return Xrm.WebApi.online.executeMultiple(sdkRequest).then(function (responses) {
        if (responses)
            return Promise.all(responses.map(function (r) {
                return r.json()
            }))
    }, function (err) {
        throw err
    })
}

function importFromXML(gridControl, entityTypeName) {
    var params = {};
    params["id_ImportFileType"] = 1;
    params["id_EntityLogicalName"] = entityTypeName;
    if (entityTypeName == "activitypointer" && gridControl.getEntityName() != null)
        params["id_EntityLogicalName"] = gridControl.getEntityName();
    Xrm.Navigation.openDialog("ImportWizard", {
        width: 512,
        height: 600,
        position: 2
    }, params);
    Xrm.Reporting.reportSuccess("Import.SMBImportLaunchRequest", [{
        name: "Dialogname",
        value: "ImportWizard"
    }, {
        name: "Source",
        value: "EntityGrid"
    }, {
        name: "EntityLogicalName",
        value: entityTypeName
    }, {
        name: "ImportFileType",
        value: 0
    }])
}

function getActivityPointerTypeEntities(activityPointerTypeControl) {
    if (activityPointerTypeControl != null && activityPointerEntityList == null) {
        Xrm.Utility.showProgressIndicator("");
        // Fetch the activity pointer entities which are allowed to Import and not BPF entities.
        var baseUrl = Xrm.Page.context.getClientUrl()
            , requesturl = baseUrl + "/api/data/v9.0/EntityDefinitions?$filter=IsActivity eq true and IsImportable eq true and IsBPFEntity eq false&$select=ObjectTypeCode,LogicalName,DisplayName,IsVisibleInMobileClient"
            , data = null;
        window.parent.$.ajax({
            url: requesturl,
            async: true,
            dataType: "json",
            success: function (response) {
                data = response;
                if (data != null && data.value != null) {
                    activityPointerEntityList = {};
                    activityPointerTypeControl.clearOptions();
                    //Filter the activities that are configured for UCI
                    var uciEnabledActivityEntities = data.value.filter(function (item) {
                        return item.IsVisibleInMobileClient.Value || item.IsVisibleInMobileClient.CanBeChanged;
                    });
                    //Sort activity entities based on display name
                    uciEnabledActivityEntities.sort(compare);
                    //Add activity entities to control
                    uciEnabledActivityEntities.forEach(function (entity) {
                        var option = {};
                        option.value = entity.ObjectTypeCode;
                        option.text = entity.DisplayName.UserLocalizedLabel.Label;
                        option.label = entity.DisplayName.UserLocalizedLabel.Label;
                        activityPointerTypeControl.addOption(option);
                        activityPointerEntityList[entity.ObjectTypeCode] = entity.LogicalName;
                    });
                    activityPointerTypeControl.setVisible(true);
                }
                Xrm.Utility.closeProgressIndicator();
            },
            error: function () {
                Xrm.Utility.closeProgressIndicator();
                Xrm.Navigation.openAlertDialog(Xrm.Utility.getResourceString(appCommonResourceName, "ImportExport_ActivityEntitiesRetrieveError"));
            }
        });
    }
}

function compare(a, b) {
    const displayName_a = a.DisplayName.UserLocalizedLabel.Label;
    const displayName_b = b.DisplayName.UserLocalizedLabel.Label;

    var comparison = 0;
    if (displayName_a > displayName_b) {
        comparison = 1;
    } else if (displayName_a < displayName_b) {
        comparison = -1;
    }
    return comparison;
}

function getCustomError() {
    try {
        //reading the customized error xml file
        var serverUrl = Xrm.Page.context.getClientUrl();
        var xmlPath = serverUrl + "/WebResources/AppCommon/ImportExport/CustomExportErrors.xml";
        var xmlDoc;
        window.parent.$.ajax({
            type: "GET",
            async: false,
            url: xmlPath,
            dataType: "xml",
            success: function (response) {
                if (response != null) 
                    xmlDoc = response;
            },
            error: function (xhr, textStatus, errorMsg) {
                console.log("Unable to Parse Xml;" + errorMsg);
            }
        });
        return xmlDoc;
    }
    catch(err) {
        console.log("Error Occured;" + err);
    }
}

function ExportErrorRowDownload(importlogrecordNameHeader, recordcollection, isExportErrorCustomizationEnabled) {
    var uniqueLogs = {};
    var lineNumbers = new Array();
    var counter = 0;
    var customErrors;
    var errorCodeMap = new Map();
    if (isExportErrorCustomizationEnabled) {
        var customErrorxml = getCustomError();
        if (!IsNullOrUndefined(customErrorxml) && customErrorxml !== '') {
            customErrors = customErrorxml.getElementsByTagName("CustomErrors")[0];
            for (var i = 0; i < customErrors.children.length; i++) {
                var node = customErrors.children[i];
                if (!IsNullOrUndefined(node)) {
                    if (!errorCodeMap.has(node.getElementsByTagName("ErrorCode")[0].innerHTML))
                        errorCodeMap.set(node.getElementsByTagName("ErrorCode")[0].innerHTML, node.getElementsByTagName("Description")[0].innerHTML);
                }

            }
        }

    }

    for (count = 0; count < recordcollection.entities.length; count++) {
        if (lineNumbers.lastIndexOf(recordcollection.entities[count].linenumber) === -1) {
            lineNumbers.push(recordcollection.entities[count].linenumber);
           
            // All customizations need to go here 
            if (isExportErrorCustomizationEnabled) {               
                var subList = recordcollection.entities.filter(function (item) {
                    return item["_importdataid_value"] === recordcollection.entities[count]["_importdataid_value"]
                });
                var errorLog = '';

                for (subCount = 0; subCount < subList.length; subCount++) {
                    var errorNumber = subList[subCount].errornumber;
                    var errorDescription = '';
                    if (!IsNullOrUndefined(errorCodeMap.get(errorNumber.toString()))) errorDescription = errorCodeMap.get(errorNumber.toString());
                    if (errorDescription === '') errorDescription = errorNumber;
                    errorLog = errorLog.concat(errorDescription);
                    if (!IsNullOrUndefined(subList[subCount].additionalinfo) && subList[subCount].additionalinfo !== '') {
                        var addInfo = subList[subCount].additionalinfo.replace(',', ' ');
                        errorLog = errorLog.concat(" :", addInfo);
                    }
                    if (!IsNullOrUndefined(subList[subCount].headercolumn) && !IsNullOrUndefined(subList[subCount].columnvalue) && (subList[subCount].headercolumn !== '') && (subList[subCount].columnvalue !== ''))
                        errorLog = errorLog.concat(" : Column = ", subList[subCount].headercolumn, " & Value =  ", subList[subCount].columnvalue, ";");
                }

                recordcollection.entities[count]["_importdataid_value@OData.Community.Display.V1.FormattedValue"] +=  "," + errorLog;
            }
            uniqueLogs[counter++] = recordcollection.entities[count]["_importdataid_value@OData.Community.Display.V1.FormattedValue"];
        }
    } 

    var isUTFCorrectionEnabled = Xrm.Internal.isFeatureEnabled("UTFCorrection");
    var errorFileName = importlogrecordNameHeader.name + " - Errors";
    errorFileName = errorFileName.replace(/[./\\:*?"|<>]/g, " ");
    errorFileName = errorFileName + ".csv";
    var content = importlogrecordNameHeader.headerrow;
    for (count = 0; count < counter; count++) {
        content = content + "\n" + uniqueLogs[count];
    }    
    if(isUTFCorrectionEnabled)
    {
         content = "\uFEFF" + content;
    }
    var file = {
        fileContent: btoa(unescape(encodeURIComponent(content))),
        fileName: errorFileName,
        mimeType: "application/csv"
    };
    Xrm.Reporting.reportSuccess("exportErrors");
    Xrm.Navigation.openFile(file, {
        openMode: 2
    });
}

//Export Error Functionality on Subgrid
function exportErrors(importFileId, gridRecordsNumber) {
    var file
    importFileId = importFileId.slice(1, -1);
    Xrm.WebApi.retrieveRecord("importfile", importFileId, "?$select=name,headerrow").then(function (response) {        
        var isExportErrorCustomizationEnabled = Xrm.Internal.isFeatureEnabled("ExcelLogEnableExportErrorFields");
        if (isExportErrorCustomizationEnabled) {
            response.headerrow = response.headerrow.concat(',"Errorlogs"');
        }
        var fetchXml = createImportDataFetchXml(importFileId, isExportErrorCustomizationEnabled);
        Xrm.WebApi.retrieveMultipleRecords("importlog", fetchXml).then(function (collection) {
            if (collection != null && collection.entities.length > 0) {
                this.ExportErrorRowDownload(response, collection, isExportErrorCustomizationEnabled);
            }
            else {
                var alert = {
                    text: Xrm.Utility.getResourceString(appCommonResourceName, "ImportExport_Label_NoErrorRowsFoundInThisImport")
                };
                Xrm.Navigation.openAlertDialog(alert);
                return;
            }
        });
    });
}

function createImportDataFetchXml(importFileId, isExportErrorCustomizationEnabled) {
    var fetchXml = "?fetchXml=<fetch version='1.0' mapping='logical' distinct='false'>"
        + "<entity name= 'importlog'>"
        + "<attribute name='importdataidname' />"
        + "<attribute name='linenumber' />"
        + "<attribute name='importdataid' />"
        + "<attribute name='importlogid' /> ";

    if (isExportErrorCustomizationEnabled) {
        fetchXml += "<attribute name='errornumber' />" + "<attribute name='additionalinfo' /> <attribute name='headercolumn' /> <attribute name='columnvalue' /> ";
    }

    fetchXml += "<link-entity name='importfile' from='importfileid' to='importfileid' alias='importfile2' link-type='inner'>"
        + "<filter type='and'>"
        + "<condition attribute='importfileid' operator='eq' value='" + importFileId + "' />"
        + "</filter>"
        + "<link-entity name='import' from='importid' to='importid' alias='import3' link-type='inner'>"
        + "</link-entity>"
        + "</link-entity>"
        + "<order attribute='linenumber' descending='false' />"
        + "<order attribute='importlogid' descending='false' />"
        + "<order attribute='importfileid' descending='false' />"
        + "</entity>"
        + "</fetch>";

    return fetchXml;
}

function navigateToImports() {
    Xrm.Navigation.navigateTo({ pageType: "entitylist", entityName: "importfile" }, { target: 3 });
}