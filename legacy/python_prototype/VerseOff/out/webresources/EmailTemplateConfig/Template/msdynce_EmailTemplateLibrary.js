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
/// <reference path="./dompurify.d.ts" />
var CrmService;
(function (CrmService) {
    var EmailTemplateLibrary = /** @class */ (function () {
        function EmailTemplateLibrary() {
        }
        EmailTemplateLibrary.Load = function (executionContext) {
            var formContext = executionContext.getFormContext();
            this.formContext = formContext;
            var isEnableEnhanceEmailTemplateEditor = Xrm.Internal.isFeatureEnabled(EmailTemplateLibrary.FCB_EnableEnhanceEmailTemplateEditor);
            if (!Xrm.Internal.isFeatureEnabled(this.FCB_DisableMarketingEditorInEmailTemplate) && isEnableEnhanceEmailTemplateEditor) {
                var isEnhancedEditorEnabled = formContext.data.entity.attributes.get(this.IsEnhancedEditorEnabled).getValue();
                if (isEnhancedEditorEnabled) {
                    //Hiding for old template editor and 
                    formContext.ui.tabs.get(this.attachmentTab) && formContext.ui.tabs.get(this.attachmentTab).setVisible(true);
                    formContext.ui.tabs.get(this.enhanceEditorTab) && formContext.ui.tabs.get(this.enhanceEditorTab).setVisible(true);
                    formContext.getControl(this.SafeHtml) && formContext.getControl(this.SafeHtml).setVisible(false);
                    formContext.getControl("attachmentsGrid") && formContext.getControl("attachmentsGrid").setVisible(false);
                    formContext.ui.tabs.get(this.templateTab) && formContext.ui.tabs.get(this.templateTab).sections.get("Template editor")
                        && formContext.ui.tabs.get(this.templateTab).sections.get("Template editor").setLabel("");
                    localStorage.setItem("eeNewCanvas", "true");
                    localStorage.setItem("eeNewCanvasDecorators", "true");
                }
                else {
                    formContext.ui.tabs.get(this.attachmentTab) && formContext.ui.tabs.get(this.attachmentTab).setVisible(false);
                    formContext.ui.tabs.get(this.enhanceEditorTab) && formContext.ui.tabs.get(this.enhanceEditorTab).setVisible(false);
                    formContext.getControl(this.SafeHtml) && formContext.getControl(this.SafeHtml).setVisible(true);
                    formContext.getControl("attachmentsGrid") && formContext.getControl("attachmentsGrid").setVisible(true);
                }
            }
            else {
                formContext.ui.tabs.get(this.attachmentTab) && formContext.ui.tabs.get(this.attachmentTab).setVisible(false);
                formContext.ui.tabs.get(this.enhanceEditorTab) && formContext.ui.tabs.get(this.enhanceEditorTab).setVisible(false);
                formContext.getControl(this.SafeHtml) && formContext.getControl(this.SafeHtml).setVisible(true);
                formContext.getControl("attachmentsGrid") && formContext.getControl("attachmentsGrid").setVisible(true);
            }
            // Subject RTE CKEDITOR and body Activity editor CKEDITOR are in different frames
            if (Xrm && Xrm.Internal && Xrm.Internal.isFeatureEnabled(EmailTemplateLibrary.FCB_EnableTemplateCopilotPrompts)) {
                var _this = this;
                this.editorTimer = setTimeout(this.RegisterCkeditorEvents, this.editorTimeout, _this, executionContext.getFormContext());
            }
        };
        /**
        * setTimeout to make sure both CKEDITOR are found and register focus, blur, and selectionChange event on each of them
        * @param executionContext
        */
        EmailTemplateLibrary.RegisterCkeditorEvents = function (_this, formContext) {
            var rowId = 0;
            // Assigning tempate object when calling this method from Email Signature library as editorTimeout is not defined
            if (_this.editorTimeout == undefined) {
                _this = this;
            }
            // Class name for both ckeditor iframe is "fullPageContentEditorFrame"
            var fullPageContentEditorFrame = window.top.document.getElementsByClassName("fullPageContentEditorFrame");
            //Registering events for both the frames
            CrmService.EmailTemplateLibrary.registerEventsForAllFrames(_this, formContext, fullPageContentEditorFrame);
            //ckeditor5 stuffs
            if (EmailTemplateLibrary.checkisRTEV2EnabledForDynamicText()) {
                EmailTemplateLibrary.ckeditor5 = true;
                EmailTemplateLibrary.initializeCKEditor5Instances(_this, formContext);
            }
            if (Xrm && Xrm.Internal && Xrm.Internal.isFeatureEnabled(EmailTemplateLibrary.FCB_EnableEnhanceEmailTemplateEditor)) {
                // Class name for marketing editor is "emailEditorCanvasFrame editor-control-layout"
                var emailEditorCanvasFrame = window.top.document.getElementsByClassName("emailEditorCanvasFrame editor-control-layout");
                if (emailEditorCanvasFrame && emailEditorCanvasFrame.length > 0) {
                    EmailTemplateLibrary.ckeditor5 = false;
                }
                CrmService.EmailTemplateLibrary.registerEventsForAllFrames(_this, formContext, emailEditorCanvasFrame);
                _this.editorTimer = setTimeout(_this.RegisterCkeditorEvents, _this.editorTimeout, _this, formContext);
            }
            else {
                if (_this.ckeditorMap.size === _this.numberOfCkeditor) {
                    if (_this.editorTimer) {
                        clearTimeout(_this.editorTimer);
                        _this.editorTimer = null;
                    }
                }
                else {
                    _this.editorTimer = setTimeout(_this.RegisterCkeditorEvents, _this.editorTimeout, _this, formContext);
                }
            }
        };
        EmailTemplateLibrary.registerEventsForAllFrames = function (_this, formContext, frames) {
            var rowId = 0;
            while (rowId < frames.length) {
                var currentFrameElement = frames[rowId];
                var currentFrame = currentFrameElement.contentWindow;
                if (currentFrame.CKEDITOR) {
                    // Current logic in ckeditor.js is creating one instance per CKEDITOR per window frame.
                    var ckeditor = currentFrame.CKEDITOR;
                    var ckeditorKeys = Object.keys(ckeditor.instances);
                    ckeditorKeys.map(function (ckeditorKey) {
                        _this.addEventListenerToCKEditor(currentFrameElement.contentWindow.document.getElementById(ckeditorKey), 'keydown');
                        var editor = ckeditor.instances[ckeditorKey];
                        if (editor) { // Rich text control
                            var mappedEditor = _this.ckeditorMap.get(ckeditorKey);
                            if (!mappedEditor) {
                                _this.ckeditorMap.set(ckeditorKey, ckeditorKey);
                                editor.on('focus', function (event) {
                                    if (_this.editableSlugElement && !_this.insertInProgress) {
                                        _this.editableSlugElement.setAttribute("contenteditable", "false");
                                    }
                                    _this.latestFocusedEditor = event.editor;
                                    formContext.ui.clearFormNotification(this.NotFocusedOnSubjectOrBody);
                                });
                                editor.on('blur', function () {
                                    if (_this.editableSlugElement && !_this.insertInProgress) {
                                        _this.editableSlugElement.setAttribute("contenteditable", "false");
                                    }
                                });
                                editor.on('selectionChange', function (event) {
                                    _this.latestFocusedEditor = event.editor;
                                    if (!_this.insertInProgress) {
                                        _this.onSelectionChange(_this, event.editor);
                                    }
                                });
                                editor.on('destroy', function (event) {
                                    _this.ckeditorMap.delete(event.editor.name);
                                    if (_this.latestFocusedEditor && _this.latestFocusedEditor.name === event.editor.name) {
                                        _this.latestFocusedEditor = null;
                                    }
                                });
                            }
                        }
                    });
                }
                rowId++;
            }
        };
        EmailTemplateLibrary.addEventListenerToCKEditor = function (element, eventType) {
            if (!element.hasEventListener || !element.hasEventListener[eventType]) {
                // If no listener exists, create the tracker object if it doesn't exist
                if (!element.hasEventListener) {
                    element.hasEventListener = {};
                }
                // Set the tracker for this event type to true
                element.hasEventListener[eventType] = true;
                element.addEventListener(eventType, function (event) {
                    if (event.key === EmailTemplateLibrary.Backspace) {
                        EmailTemplateLibrary.isBackspace = true;
                    }
                });
            }
        };
        /**
         * If selection is within a data slug, select the entire slug data span element
         * @param _this
         * @param editor
         */
        EmailTemplateLibrary.onSelectionChange = function (_this, editor) {
            var _this_1 = this;
            //CKEditor5
            if (_this.ckeditor5) {
                var isTemplateWithSpanElement_1 = Xrm.Internal.isFeatureEnabled(EmailTemplateLibrary.FCB_CopilotEmailTemplateWithSpanElementFCB);
                if (_this.editableSlugElement && !_this.ckeditor5) {
                    _this.editableSlugElement.setAttribute("contenteditable", "false");
                }
                var viewDocument = null;
                if (editor && editor.editing && editor.editing.view && editor.editing.view.document) {
                    viewDocument = editor.editing.view.document;
                }
                if (viewDocument) {
                    var selection = viewDocument.selection;
                    if (selection) {
                        var position = selection.getFirstPosition();
                        if (position && position.parent && position.parent.parent) {
                            var parentElement = position.parent.parent;
                            if (isTemplateWithSpanElement_1 && selection.getLastPosition().parent.previousSibling && EmailTemplateLibrary.isLeftArrowClick) {
                                EmailTemplateLibrary.isLeftArrowClick = false;
                                parentElement = selection.getLastPosition().parent.previousSibling.getChild(0);
                            }
                            var cursorPositionHtmlElement_1 = editor.editing.view.domConverter.viewToDom(parentElement);
                            if ((cursorPositionHtmlElement_1 && cursorPositionHtmlElement_1.classList) && cursorPositionHtmlElement_1.classList.contains(EmailTemplateLibrary.DataCopilotPromptClass)) {
                                _this.editableSlugElement = cursorPositionHtmlElement_1;
                                var dataSlugNode_1 = null;
                                editor.model.change(function (writer) {
                                    var position = editor.model.document.selection.getFirstPosition();
                                    var nodeBefore = position.nodeBefore;
                                    var nodeAfter = position.nodeAfter;
                                    if (!isTemplateWithSpanElement_1) {
                                        if (!nodeAfter && !nodeBefore) {
                                            var dataSlugNode_2 = position.textNode;
                                            if (dataSlugNode_2) {
                                                var range_1 = writer.createRangeOn(dataSlugNode_2.parent, 'on');
                                                writer.setSelection(range_1);
                                            }
                                        }
                                    }
                                    else {
                                        if (!nodeAfter && !nodeBefore) {
                                            dataSlugNode_1 = position.textNode;
                                            _this_1.selectIfDataCopilotPrompt(dataSlugNode_1, writer);
                                        }
                                        else if (!nodeAfter && nodeBefore) { //left arrow
                                            dataSlugNode_1 = position.nodeBefore;
                                            _this_1.selectIfDataCopilotPrompt(dataSlugNode_1, writer);
                                        }
                                        else if (nodeAfter && !nodeBefore) { //right arrow
                                            dataSlugNode_1 = position.nodeAfter;
                                            _this_1.selectIfDataCopilotPrompt(dataSlugNode_1, writer);
                                        }
                                        else if (nodeBefore.hasAttribute && nodeBefore.hasAttribute('htmlSpan')) {
                                            dataSlugNode_1 = position.nodeBefore;
                                            _this_1.selectIfDataCopilotPrompt(dataSlugNode_1, writer);
                                        }
                                        else if (nodeAfter.hasAttribute && nodeAfter.hasAttribute('htmlSpan')) {
                                            dataSlugNode_1 = position.nodeAfter;
                                            _this_1.selectIfDataCopilotPrompt(dataSlugNode_1, writer);
                                        }
                                    }
                                });
                                var currentSelection_1 = editor.model.document.selection.getFirstRange();
                                var isDataCopilotPromptPresentInDataSlugOrHTMLElement = void 0;
                                if (!isTemplateWithSpanElement_1) {
                                    isDataCopilotPromptPresentInDataSlugOrHTMLElement = cursorPositionHtmlElement_1.classList.contains(EmailTemplateLibrary.DataCopilotPromptClass);
                                }
                                else {
                                    isDataCopilotPromptPresentInDataSlugOrHTMLElement = (!!dataSlugNode_1 && !!dataSlugNode_1.getAttribute('htmlSpan') && dataSlugNode_1.getAttribute('htmlSpan').classes.includes(EmailTemplateLibrary.DataCopilotPromptClass));
                                }
                                if (isDataCopilotPromptPresentInDataSlugOrHTMLElement) {
                                    var options = {
                                        width: 550,
                                        height: 510,
                                        position: 1 // center
                                    };
                                    var dialogParams = {};
                                    dialogParams["param_insertCopilotPromptsControlOutput"] = this.editableSlugElement ? EmailTemplateLibrary.extractValues(this.editableSlugElement.outerText) : "";
                                    var dataAltText = EmailTemplateLibrary.extractDataAltTextFromOuterHTML(this.editableSlugElement.outerHTML);
                                    dialogParams["param_insertCopilotPromptsAltTextOutput"] = dataAltText ? dataAltText : "";
                                    dialogParams["param_lastButton_clicked"] = undefined;
                                    var isKnowledgeSourceEnabled = EmailTemplateLibrary.extractUseKnowledgeValueFromOuterHTML(this.editableSlugElement.outerHTML);
                                    dialogParams["param_isKnowledgSourcesEnabled"] = isKnowledgeSourceEnabled ? isKnowledgeSourceEnabled : false;
                                    dialogParams["param_insertCopilotPromptsIdValue"] = this.editableSlugElement ? this.extractIdFromOuterHTML(this.editableSlugElement.outerHTML) : "";
                                    var isPromptElementDiv = EmailTemplateLibrary.isCopilotPromptElementDiv(this.editableSlugElement.outerHTML);
                                    dialogParams["param_isPromptContentElementDiv"] = isPromptElementDiv ? isPromptElementDiv : false;
                                    var dataAltTextStyle = EmailTemplateLibrary.extractDataAltTextStyleFromOuterHTML(this.editableSlugElement.outerHTML);
                                    dialogParams["param_insertCopilotPromptsAltTextStyle"] = dataAltTextStyle ? dataAltTextStyle : "";
                                    _this.insertInProgress = true;
                                    var isInsertCopilotPromptsLimit = false;
                                    var currentId_1 = this.extractIdFromOuterHTML(this.editableSlugElement.outerHTML);
                                    Xrm.Navigation.openDialog(EmailTemplateLibrary.InsertCopilotPromptsDialog, options, dialogParams).then(function (response) {
                                        isInsertCopilotPromptsLimit = _this_1.isLimitCopilotPrompts(editor, true, response, currentId_1);
                                        if (response.parameters.param_lastButton_clicked == EmailTemplateLibrary.DialogInsertId && !isInsertCopilotPromptsLimit) {
                                            var slugString = response.parameters.param_insertCopilotPromptsControlOutput;
                                            if (Xrm && Xrm.Internal && Xrm.Internal.isFeatureEnabled(EmailTemplateLibrary.FCB_ApplyEditorSelectionStyle)) {
                                                if (editor.sourceElement) {
                                                    var selectedStyle = editor.sourceElement.getAttribute("style");
                                                    var cssObject = _this.cssStringToObject(selectedStyle);
                                                    cssObject.height = 'auto';
                                                    var cssString = '';
                                                    for (var key in cssObject) {
                                                        if (cssObject.hasOwnProperty(key)) {
                                                            var cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                                                            cssString += cssKey + ": " + cssObject[key] + "; ";
                                                        }
                                                    }
                                                    selectedStyle = cssString.replace(/"/g, '').trim();
                                                    var styleIndex = slugString.indexOf('style=');
                                                    if (selectedStyle && styleIndex > 0) {
                                                        slugString = slugString.slice(0, styleIndex + 7) + selectedStyle + slugString.slice(styleIndex + 7);
                                                    }
                                                }
                                            }
                                            var dataTransferObject = {};
                                            //we are doing this because of the bug - - Bug 2781837, old data transfer object does not have getFilesCount, which fails
                                            if (window && window.top && window.top.CKEDITOR && window.top.CKEDITOR.plugins && window.top.CKEDITOR.plugins.clipboard) {
                                                dataTransferObject = new window.top.CKEDITOR.plugins.clipboard.dataTransfer();
                                            }
                                            dataTransferObject.getData = function (key) { return slugString; };
                                            dataTransferObject.getTransferType = function (key) { return 3; };
                                            dataTransferObject.slugString = slugString;
                                            dataTransferObject.getFilesCount = function () { return 0; };
                                            var eventData = {
                                                dataTransfer: dataTransferObject
                                            };
                                            try {
                                                // Make data slug element editable for unblocking paste event
                                                if (_this.editableSlugElement && !_this.ckeditor5) {
                                                    _this.editableSlugElement.setAttribute("contenteditable", "true");
                                                }
                                                editor.model.change(function (writer) {
                                                    var viewFragment = editor.data.processor.toView(eventData.dataTransfer.getData());
                                                    var modelFragment = editor.data.toModel(viewFragment);
                                                    //Insert the model fragment into the editor at the selection
                                                    editor.model.insertContent(modelFragment, currentSelection_1);
                                                });
                                                _this.insertInProgress = false;
                                            }
                                            catch (e) {
                                                console.log(e);
                                                // Fall back is paste event failed
                                                if (_this.editableSlugElement) {
                                                    _this.editableSlugElement.setAttribute("contenteditable", "false");
                                                }
                                                _this.insertInProgress = false;
                                            }
                                        }
                                        else {
                                            _this.insertInProgress = false;
                                        }
                                    }, function () {
                                        _this.insertInProgress = false;
                                    });
                                }
                            }
                        }
                    }
                }
            }
            //CKEditor4 
            else {
                if (_this.editableSlugElement) {
                    _this.editableSlugElement.setAttribute("contenteditable", "false");
                }
                var cursorPositionEditorElement = editor.getSelection();
                _this.editableSlugElement = undefined;
                if (cursorPositionEditorElement) {
                    cursorPositionEditorElement = cursorPositionEditorElement.getStartElement();
                    if (cursorPositionEditorElement) {
                        var cursorPositionHtmlElement = cursorPositionEditorElement.$;
                        if (cursorPositionHtmlElement) {
                            _this.registerKeyDownEvent(_this, editor);
                            _this.registerKeyUpEvent(_this, editor);
                            if (cursorPositionHtmlElement.classList.contains("datacopilotprompt")) {
                                _this.editableSlugElement = cursorPositionHtmlElement;
                                var range = editor.createRange();
                                range.selectNodeContents(cursorPositionEditorElement);
                                editor.getSelection().selectRanges([range]);
                                if (_this.editableSlugElement.classList.contains("datacopilotprompt")) {
                                    var options = {
                                        width: 550,
                                        height: 510,
                                        position: 1 // center
                                    };
                                    var dialogParams = {};
                                    dialogParams["param_insertCopilotPromptsControlOutput"] = this.editableSlugElement ? this.editableSlugElement.outerText : "";
                                    var dataAltText = EmailTemplateLibrary.extractDataAltTextFromOuterHTML(this.editableSlugElement.outerHTML);
                                    dialogParams["param_insertCopilotPromptsAltTextOutput"] = dataAltText ? dataAltText : "";
                                    dialogParams["param_lastButton_clicked"] = undefined;
                                    var isKnowledgeSourceEnabled = EmailTemplateLibrary.extractUseKnowledgeValueFromOuterHTML(this.editableSlugElement.outerHTML);
                                    dialogParams["param_isKnowledgSourcesEnabled"] = isKnowledgeSourceEnabled ? isKnowledgeSourceEnabled : false;
                                    var dataAltTextStyle = EmailTemplateLibrary.extractDataAltTextStyleFromOuterHTML(this.editableSlugElement.outerHTML);
                                    dialogParams["param_insertCopilotPromptsAltTextStyle"] = dataAltTextStyle ? dataAltTextStyle : "";
                                    _this.insertInProgress = true;
                                    var isInsertCopilotPromptsLimit = false;
                                    if (!this.isBackspace) {
                                        Xrm.Navigation.openDialog(EmailTemplateLibrary.InsertCopilotPromptsDialog, options, dialogParams).then(function (response) {
                                            isInsertCopilotPromptsLimit = _this_1.isLimitCopilotPrompts(editor, true, response);
                                            if (response.parameters.param_lastButton_clicked == EmailTemplateLibrary.DialogInsertId) {
                                                var slugString = response.parameters.param_insertCopilotPromptsControlOutput;
                                                if (Xrm && Xrm.Internal && Xrm.Internal.isFeatureEnabled(EmailTemplateLibrary.FCB_ApplyEditorSelectionStyle)) {
                                                    if (editor.getSelection() && editor.getSelection().getStartElement()) {
                                                        var selectedStyle = editor.getSelection().getStartElement().getAttribute("style");
                                                        var styleIndex = slugString.indexOf('style=');
                                                        if (selectedStyle && styleIndex > 0) {
                                                            slugString = slugString.slice(0, styleIndex + 7) + selectedStyle + slugString.slice(styleIndex + 7);
                                                        }
                                                    }
                                                }
                                                var dataTransferObject = {};
                                                //we are doing this because of the bug - - Bug 2781837, old data transfer object does not have getFilesCount, which fails
                                                if (window && window.top && window.top.CKEDITOR && window.top.CKEDITOR.plugins && window.top.CKEDITOR.plugins.clipboard) {
                                                    dataTransferObject = new window.top.CKEDITOR.plugins.clipboard.dataTransfer();
                                                }
                                                dataTransferObject.getData = function (key) { return slugString; };
                                                dataTransferObject.getTransferType = function (key) { return 3; };
                                                dataTransferObject.slugString = slugString;
                                                dataTransferObject.getFilesCount = function () { return 0; };
                                                var eventData = {
                                                    dataTransfer: dataTransferObject
                                                };
                                                var cursorPositionHtmlElementparentNode = cursorPositionHtmlElement.parentNode;
                                                var newNode = cursorPositionHtmlElement.cloneNode(true);
                                                var newElement = document.createElement('span');
                                                newElement.id = 'testID';
                                                cursorPositionHtmlElementparentNode.insertBefore(newElement, cursorPositionHtmlElement);
                                                // const dummySpan = document.createElement('span');
                                                // cursorPositionHtmlElementparentNode.insertBefore(dummySpan, cursorPositionHtmlElement);
                                                try {
                                                    if (_this.editableSlugElement) {
                                                        _this.editableSlugElement.setAttribute("contenteditable", "true");
                                                    }
                                                    cursorPositionHtmlElement.remove();
                                                    editor.fire("paste", eventData);
                                                    _this.insertInProgress = false;
                                                }
                                                catch (e) {
                                                    console.log(e);
                                                    cursorPositionHtmlElementparentNode.insertBefore(cursorPositionHtmlElement, newElement);
                                                    // Fall back is paste event failed
                                                    if (_this.editableSlugElement) {
                                                        _this.editableSlugElement.setAttribute("contenteditable", "false");
                                                    }
                                                    _this.insertInProgress = false;
                                                }
                                                finally {
                                                    newElement.remove();
                                                }
                                            }
                                            else {
                                                var slugString_1 = '<span></span>';
                                                var dataTransferObject = {};
                                                dataTransferObject.getData = function (key) { return slugString_1; };
                                                dataTransferObject.getTransferType = function (key) { return 3; };
                                                dataTransferObject.slugString = slugString_1;
                                                dataTransferObject.getFilesCount = function () { return 0; };
                                                var eventData_1 = {
                                                    dataTransfer: dataTransferObject
                                                };
                                                try {
                                                    editor.fire("paste", eventData_1);
                                                }
                                                catch (e) {
                                                    console.log(e);
                                                }
                                                finally {
                                                    _this.insertInProgress = false;
                                                }
                                            }
                                        }, function () {
                                            _this.insertInProgress = false;
                                        });
                                    }
                                    else {
                                        this.isBackspace = false;
                                        var cursorPositionHtmlElementparentNode = cursorPositionHtmlElement.parentNode;
                                        cursorPositionHtmlElement.remove();
                                        cursorPositionHtmlElementparentNode.focus();
                                        _this.insertInProgress = false;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        EmailTemplateLibrary.selectIfDataCopilotPrompt = function (node, writer) {
            if (!node)
                return;
            var htmlSpan = node.getAttribute && node.getAttribute('htmlSpan');
            if (htmlSpan && htmlSpan.classes && htmlSpan.classes.includes(EmailTemplateLibrary.DataCopilotPromptClass)) {
                var range = writer.createRangeOn(node, 'on');
                writer.setSelection(range);
            }
            else if (node.parent && node.parent.hasAttribute('htmlDivAttributes')) { //div element
                var range = writer.createRangeOn(node.parent, 'on');
                writer.setSelection(range);
            }
        };
        EmailTemplateLibrary.registerKeyDownEvent = function (_this, editor) {
            editor.editable().once('keydown', function (event) {
                if (event.data.$.code == EmailTemplateLibrary.ArrowRight ||
                    event.data.$.code == EmailTemplateLibrary.ArrowLeft ||
                    event.data.$.code == EmailTemplateLibrary.ArrowUp ||
                    event.data.$.code == EmailTemplateLibrary.ArrowDown ||
                    event.data.$.code == EmailTemplateLibrary.Backspace) {
                    if (_this.editableSlugElement) {
                        // Set conteneditable to true to allow deleting the data-slug and moving cursor out
                        _this.editableSlugElement.setAttribute("contenteditable", "true");
                        _this.registerKeyUpEvent(_this, editor);
                    }
                }
                else {
                    if (_this.editableSlugElement) {
                        _this.editableSlugElement.setAttribute("contenteditable", "false");
                        _this.registerKeyDownEvent(_this, editor);
                    }
                }
            });
        };
        EmailTemplateLibrary.registerKeyUpEvent = function (_this, editor) {
            editor.editable().once('keyup', function (event) {
                var cursorPositionEditorElement = editor.getSelection();
                var selectedRanges = cursorPositionEditorElement ? cursorPositionEditorElement.getRanges() : null;
                if (selectedRanges) {
                    cursorPositionEditorElement = cursorPositionEditorElement.getStartElement();
                    if (selectedRanges[0].collapsed && cursorPositionEditorElement.type == EmailTemplateLibrary.nodeType.ELEMENT_NODE && cursorPositionEditorElement.hasClass(EmailTemplateLibrary.DataCopilotPromptClass)) {
                        if (event.data.$.code == EmailTemplateLibrary.ArrowRight) {
                            var range = editor.createRange();
                            var nextNode = cursorPositionEditorElement.getNext();
                            // When cursorPositionEditorElement is the last child element of its parent element
                            if (!cursorPositionEditorElement.hasNext()) {
                                // Append an empty node into its parent node, so nextNode will be this empty node
                                var emptyNode = document.createTextNode('\uFEFF');
                                cursorPositionEditorElement.getParent().$.appendChild(emptyNode);
                                nextNode = cursorPositionEditorElement.getNext();
                            }
                            // When the next node of cursorPositionEditorElement is also a data slug span element
                            else if (nextNode.type == EmailTemplateLibrary.nodeType.ELEMENT_NODE && (nextNode.hasClass(EmailTemplateLibrary.DataCopilotPromptClass) || nextNode.$.nodeName == "BR") && selectedRanges[0].collapsed) {
                                // Insert an empty node in between the cursorPositionEditorElement and next data slug span element node, so now the nextNode will be the empty node
                                var emptyNode = document.createTextNode('\uFEFF');
                                cursorPositionEditorElement.getParent().$.insertBefore(emptyNode, nextNode.$);
                                nextNode = cursorPositionEditorElement.getNext();
                            }
                            // If cursorPositionEditorElement is neither the last child element of its parent element or its next node if not a data slug span element, ex: a text node
                            // nextNode will be whatever node that is following cursorPositionEditorElement
                            range.selectNodeContents(nextNode);
                            range.endOffset = 0;
                            range.startOffset = 0;
                            range.collapsed = true;
                            editor.getSelection().selectRanges([range]);
                        }
                        else if (event.data.$.code == EmailTemplateLibrary.ArrowLeft) {
                            var range = editor.createRange();
                            var prevNode = cursorPositionEditorElement.getPrevious();
                            if (!cursorPositionEditorElement.hasPrevious() ||
                                (prevNode.type == EmailTemplateLibrary.nodeType.ELEMENT_NODE && prevNode.hasClass(EmailTemplateLibrary.DataCopilotPromptClass) && selectedRanges[0].collapsed)) {
                                var emptyNode = document.createTextNode('\uFEFF');
                                var cursorPositionNode = cursorPositionEditorElement.$;
                                cursorPositionEditorElement.getParent().$.insertBefore(emptyNode, cursorPositionNode);
                                prevNode = cursorPositionEditorElement.getPrevious();
                                range.selectNodeContents(prevNode);
                                editor.getSelection().selectRanges([range]);
                            }
                        }
                    }
                }
                // Change contenteditable back to false after moving cursor outside of span during keyup event
                if (_this.editableSlugElement) {
                    _this.editableSlugElement.setAttribute("contenteditable", "false");
                    _this.registerKeyDownEvent(_this, editor);
                }
            });
        };
        EmailTemplateLibrary.registerEventsForAllCKEDITOR5 = function (_this, formContext, allCkeditorElement) {
            var rowId = 0;
            var isTemplateWithSpanElement = Xrm.Internal.isFeatureEnabled(EmailTemplateLibrary.FCB_CopilotEmailTemplateWithSpanElementFCB);
            while (rowId < allCkeditorElement.length) {
                var currentCkeditorElement = allCkeditorElement[rowId];
                var ckeditor = currentCkeditorElement.ckeditorInstance;
                if (!ckeditor && currentCkeditorElement.matches("td.ck-editor__editable.ck-editor__nested-editable")) { //in case of prompt inside table
                    ckeditor = currentCkeditorElement.closest(".ck-content").ckeditorInstance;
                }
                if (ckeditor) {
                    var ckeditorKey = currentCkeditorElement.id || ckeditor.id;
                    if (!_this.ckeditorMap.has(ckeditorKey) || (_this.ckeditorMap.has(ckeditorKey) && currentCkeditorElement.matches("td.ck-editor__editable.ck-editor__nested-editable"))) {
                        _this.ckeditorMap.set(ckeditorKey, ckeditorKey);
                        //ckeditor5 has different implementation than ckeditor4 for event registering
                        ckeditor.editing.view.document.on('focus', function (event, data) {
                            if (_this.editableSlugElement && !_this.insertInProgress) {
                                _this.editableSlugElement.setAttribute("contenteditable", "false");
                            }
                            _this.latestFocusedEditor = data.domEvent.currentTarget.ckeditorInstance;
                            formContext.ui.clearFormNotification(EmailTemplateLibrary.NotFocusedOnSubjectOrBody);
                        });
                        ckeditor.editing.view.document.on('blur', function () {
                            if (_this.editableSlugElement && !_this.insertInProgress) {
                                _this.editableSlugElement.setAttribute("contenteditable", "false");
                            }
                            // Set error notification on subject control if subject is empty, clear notification on subject control otherwise
                            _this.validateSubjectSafeHtml(formContext);
                        });
                        ckeditor.editing.view.document.on('selectionChange', function (event, data) {
                            var activeElement = data.domSelection.focusNode.ownerDocument.activeElement;
                            if (activeElement) {
                                // get editor instance
                                _this.latestFocusedEditor = activeElement.closest(".ck-content").ckeditorInstance;
                            }
                            if (!_this.insertInProgress && _this.latestFocusedEditor) {
                                _this.onSelectionChange(_this, _this.latestFocusedEditor);
                            }
                        });
                        if (isTemplateWithSpanElement) {
                            ckeditor.editing.view.document.on('keyup', function (event, data) {
                                _this.onKeyUp(_this, data.domEvent.currentTarget.ckeditorInstance, data);
                            });
                            ckeditor.editing.view.document.on('keydown', function (event, data) {
                                _this.onKeyDown(_this, data.domEvent.currentTarget.ckeditorInstance, data);
                            });
                        }
                        // there is no data args in destroy event and it is registered and fired same as ckeditor4
                        ckeditor.on('destroy', function (event) {
                            //deregistering the events
                            ckeditor.editing.view.document.off('focus');
                            ckeditor.editing.view.document.off('blur');
                            ckeditor.editing.view.document.off('selectionChange');
                            _this.ckeditorMap.delete(ckeditorKey);
                            if (_this.latestFocusedEditor && _this.latestFocusedEditor === ckeditor) {
                                _this.latestFocusedEditor = null;
                            }
                        });
                    }
                }
                rowId++;
            }
        };
        EmailTemplateLibrary.onKeyUp = function (_this, ckeditor, data) {
            if (ckeditor && data && ckeditor.model) {
                if (_this.editableSlugElement) {
                    _this.editableSlugElement.setAttribute("contenteditable", "false");
                }
                ckeditor.model.change(function (writer) {
                    var position = ckeditor.model.document.selection.getFirstPosition();
                    var keyCode = data.domEvent.code;
                    var targetNode = null;
                    if (keyCode === 'Backspace') {
                        targetNode = position.nodeBefore;
                    }
                    if (keyCode === 'ArrowLeft') {
                        if (_this.insertInProgress) {
                            return;
                        }
                        EmailTemplateLibrary.isLeftArrowClick = true;
                        _this.onSelectionChange(_this, ckeditor);
                    }
                    if (targetNode !== null) {
                        var htmlSpanValue = targetNode.getAttribute('htmlSpan');
                        if (htmlSpanValue && htmlSpanValue.classes && htmlSpanValue.classes.includes(EmailTemplateLibrary.DataCopilotPromptClass)) {
                            writer.setSelection(writer.createRangeOn(targetNode));
                        }
                    }
                });
            }
        };
        EmailTemplateLibrary.onKeyDown = function (_this, ckeditor, data) {
            if (ckeditor && data && ckeditor.model) {
                if (_this.editableSlugElement) {
                    _this.editableSlugElement.setAttribute("contenteditable", "false");
                }
                ckeditor.model.change(function (writer) {
                    var position = ckeditor.model.document.selection.getFirstPosition();
                    var keyCode = data.domEvent.code;
                    var targetNode = null;
                    if (keyCode === 'Delete') {
                        targetNode = position.nodeAfter;
                    }
                    if (targetNode !== null) {
                        var htmlSpanValue = targetNode.getAttribute('htmlSpan');
                        if (htmlSpanValue && htmlSpanValue.classes && htmlSpanValue.classes.includes(EmailTemplateLibrary.DataCopilotPromptClass)) {
                            writer.setSelection(writer.createRangeOn(targetNode));
                        }
                    }
                });
            }
        };
        EmailTemplateLibrary.initializeCKEditor5Instances = function (_this, formContext) {
            //getting all the elements which contains ckeditor5
            var allCkeditorElements = window.top.document.querySelectorAll('.ck-editor__editable');
            //resgistering all the ckeditor5 instance
            CrmService.EmailTemplateLibrary.registerEventsForAllCKEDITOR5(_this, formContext, allCkeditorElements);
        };
        EmailTemplateLibrary.checkisRTEV2EnabledForDynamicText = function () {
            var isDynamicTextinRTEV2Disabled = Xrm.Internal.isFeatureEnabled(EmailTemplateLibrary.FCB_isDynamicTextinRTEV2Disabled);
            //fcb for rtev2 Enable check
            //fcb Check
            var isRTEV2Disabled = Xrm.Internal.isFeatureEnabled(EmailTemplateLibrary.FCB_KeepRTEv1ForEmailTemplateAndSignature);
            // if there is already a template and to check if there is RTEV2 or not.
            var checkRTEV2Utility = false;
            var parentWindow = parent.window;
            if (parentWindow && parentWindow.getRTEv2EditorUtility) {
                checkRTEV2Utility = true;
            }
            return (!isDynamicTextinRTEV2Disabled && !isRTEV2Disabled && checkRTEV2Utility);
        };
        /**
         * On click handler for "Insert copilot prompts" button
         */
        EmailTemplateLibrary.insertPromptButtonClick = function () {
            var _this_1 = this;
            if (this.latestFocusedEditor == undefined || this.latestFocusedEditor == null) {
                var ErrorText = Xrm.Utility.getResourceString(EmailTemplateLibrary.WebResourceName, "UnableToInsertCopilotPrompts");
                this.formContext.ui.setFormNotification(ErrorText, Xrm.Constants.FormNotificationLevels.error, this.NotFocusedOnSubjectOrBody);
            }
            else if (this.ckeditor5 && this.latestFocusedEditor.sourceElement && this.latestFocusedEditor.sourceElement.ariaLabel === this.RICH_TEXT_EDITOR_CONTROL_TEMPLATE_SUBJECT) {
                var ErrorText = Xrm.Utility.getResourceString(EmailTemplateLibrary.WebResourceName, "UnableToInsertCopilotPromptsInSubject");
                this.formContext.ui.setFormNotification(ErrorText, Xrm.Constants.FormNotificationLevels.error, this.NotFocusedOnSubjectOrBody);
            }
            else {
                var options = {
                    width: 550,
                    height: 510,
                    position: 1 // center
                };
                var dialogParams = {};
                dialogParams["param_insertCopilotPromptsControlOutput"] = "";
                dialogParams["param_insertCopilotPromptsAltTextOutput"] = "";
                dialogParams["param_lastButton_clicked"] = undefined;
                dialogParams["param_isKnowledgSourcesEnabled"] = false;
                dialogParams["param_insertCopilotPromptsIdValue"] = "";
                dialogParams["param_isPromptContentElementDiv"] = Xrm.Internal.isFeatureEnabled(EmailTemplateLibrary.FCB_CopilotEmailTemplateWithSpanElementFCB) ? false : true;
                dialogParams["param_insertCopilotPromptsAltTextStyle"] = "";
                var editor = this.latestFocusedEditor;
                var _this = this;
                this.insertInProgress = true;
                var isInsertCopilotPromptsLimit = false;
                isInsertCopilotPromptsLimit = this.isLimitCopilotPrompts(editor, false);
                var isLimitReached = isInsertCopilotPromptsLimit ? true : false;
                this.insertInProgress = isLimitReached ? false : true;
                !isLimitReached && Xrm.Navigation.openDialog(this.InsertCopilotPromptsDialog, options, dialogParams).then(function (response) {
                    isInsertCopilotPromptsLimit = _this_1.isLimitCopilotPrompts(editor, false, response);
                    if (response.parameters.param_lastButton_clicked == _this_1.DialogInsertId && !isInsertCopilotPromptsLimit) {
                        var slugString = response.parameters.param_insertCopilotPromptsControlOutput;
                        var isDynamicTextinRTEV2Disabled = Xrm.Internal.isFeatureEnabled(EmailTemplateLibrary.FCB_isDynamicTextinRTEV2Disabled);
                        if (Xrm && Xrm.Internal && Xrm.Internal.isFeatureEnabled(EmailTemplateLibrary.FCB_ApplyEditorSelectionStyle)) {
                            if (editor.getSelection && editor.getSelection() && editor.getSelection().getStartElement()) {
                                var selectedStyle = editor.getSelection().getStartElement().getAttribute("style");
                                var styleIndex = slugString.indexOf('style=');
                                if (selectedStyle && styleIndex > 0) {
                                    slugString = slugString.slice(0, styleIndex + 7) + selectedStyle + slugString.slice(styleIndex + 7);
                                }
                            }
                            else if (!isDynamicTextinRTEV2Disabled && _this.ckeditor5) { //ckeditor5
                                if (editor.sourceElement) {
                                    var selectedStyle = editor.sourceElement.getAttribute("style");
                                    var cssObject = _this.cssStringToObject(selectedStyle);
                                    cssObject.height = 'auto';
                                    var cssString = '';
                                    for (var key in cssObject) {
                                        if (cssObject.hasOwnProperty(key)) {
                                            var cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                                            cssString += cssKey + ": " + cssObject[key] + "; ";
                                        }
                                    }
                                    selectedStyle = cssString.replace(/"/g, '').trim();
                                    var styleIndex = slugString.indexOf('style=');
                                    if (selectedStyle && styleIndex > 0) {
                                        slugString = slugString.slice(0, styleIndex + 7) + selectedStyle + slugString.slice(styleIndex + 7);
                                    }
                                }
                            }
                        }
                        var dataTransferObject = {};
                        //we are doing this because of the bug - - Bug 2781837, old data transfer object does not have getFilesCount, which fails
                        if (window && window.top && window.top.CKEDITOR && window.top.CKEDITOR.plugins && window.top.CKEDITOR.plugins.clipboard) {
                            dataTransferObject = new window.top.CKEDITOR.plugins.clipboard.dataTransfer();
                        }
                        dataTransferObject.getData = function (key) { return slugString; };
                        dataTransferObject.getTransferType = function (key) { return 3; };
                        dataTransferObject.slugString = slugString;
                        dataTransferObject.getFilesCount = function () { return 0; };
                        var eventData = {
                            dataTransfer: dataTransferObject
                        };
                        try {
                            // Make data slug element editable for unblocking paste event
                            if (_this.editableSlugElement) {
                                _this.editableSlugElement.setAttribute("contenteditable", "true");
                            }
                            //ckeditor4
                            if (!_this.ckeditor5) {
                                if (editor.getSelection() && editor.getSelection().getStartElement()) {
                                    editor.fire("paste", eventData);
                                }
                            }
                            else { //ckeditor5
                                editor.model.change(function (writer) {
                                    var isTemplateWithSpanElement = Xrm.Internal.isFeatureEnabled(EmailTemplateLibrary.FCB_CopilotEmailTemplateWithSpanElementFCB);
                                    var selection = editor.model.document.selection;
                                    var firstPosition = selection.getFirstPosition();
                                    if (isTemplateWithSpanElement) {
                                        if (firstPosition && firstPosition.parent && !firstPosition.parent.nextSibling) {
                                            //Insert an extra line at the end.
                                            var root = editor.model.document.getRoot();
                                            var lastChild = root.getChild(root.childCount - 1);
                                            var emptyParagraph = writer.createElement('paragraph');
                                            editor.model.insertContent(emptyParagraph, writer.createPositionAfter(lastChild));
                                        }
                                        var leadingSpacer = writer.createText('\uFEFF');
                                        editor.model.insertContent(leadingSpacer, firstPosition);
                                        var rawHtml = eventData.dataTransfer.getData();
                                        // Pre-wrap the HTML with non-breaking spaces
                                        var wrappedHtml = rawHtml + "\uFEFF\u200A";
                                        // Convert to model and insert
                                        var viewFragmentSpan = editor.data.processor.toView(wrappedHtml);
                                        var modelFragmentSpan = editor.data.toModel(viewFragmentSpan);
                                        // Insert using the built-in method
                                        var positionAfterSpacer = firstPosition.getShiftedBy(1);
                                        editor.model.insertContent(modelFragmentSpan, positionAfterSpacer);
                                    }
                                    else {
                                        if (firstPosition && firstPosition.parent && !firstPosition.parent.nextSibling) {
                                            //Insert an extra line at the end.
                                            var root_1 = editor.model.document.getRoot();
                                            var lastChild_1 = root_1.getChild(root_1.childCount - 1);
                                            var emptyParagraph_1 = writer.createElement('paragraph');
                                            editor.model.insertContent(emptyParagraph_1, writer.createPositionAfter(lastChild_1));
                                        }
                                        var viewFragment = editor.data.processor.toView(eventData.dataTransfer.getData());
                                        var modelFragment = editor.data.toModel(viewFragment);
                                        //Insert the model fragment into the editor at the selection
                                        editor.model.insertContent(modelFragment, editor.model.document.selection);
                                    }
                                });
                            }
                            _this.insertInProgress = false;
                        }
                        catch (e) {
                            console.log(e);
                            _this.insertInProgress = false;
                        }
                    }
                    else {
                        _this.insertInProgress = false;
                    }
                }, function () {
                    _this.insertInProgress = false;
                });
            }
        };
        ;
        EmailTemplateLibrary.extractValues = function (htmlString) {
            var regex = /{-.*?-}/g;
            var matches = htmlString.match(regex);
            return matches ? matches.join(' ') : '';
        };
        ;
        /**
         * Securely parses an untrusted HTML string for read-only inspection.
         * DOMParser builds an inert document: images are not fetched and script
         * / event handlers (onerror, onload, ...) never execute, which removes
         * the live-document innerHTML sink that allowed reflected XSS via
         * attacker-controlled dialog parameters (MSRC 129745, [HC-MS-SDL]). The
         * returned element supports querySelector / getElementsByClassName like
         * the legacy detached-div, so callers only read attributes - never
         * render this markup. Call sites use this only when
         * isSecureHtmlParsingEnabled() is true; the FCB-off path keeps the
         * unchanged legacy innerHTML behaviour.
         */
        EmailTemplateLibrary.secureParseHtml = function (html) {
            // Prefer DOMPurify when it is loaded and usable: it strips active
            // content (script / on* handlers / javascript: URLs) while keeping the
            // data-* / class attributes the prompt inspection reads (DOMPurify keeps
            // data-* by default). RETURN_DOM hands back an inert detached <body> the
            // callers only read from - no innerHTML sink.
            //
            // DOMPurify is wrapped in try/catch because inside the InsertCopilotPrompts
            // inline dialog (a separate frame/realm) DOMPurify's cached TrustedTypePolicy
            // can become "no longer runnable", making sanitize() throw
            // ("Failed to execute 'createHTML' on 'TrustedTypePolicy'"). On that failure -
            // or when the global is not present - fall back to the inert DOMParser body,
            // which never touches Trusted Types and is equally safe for read-only
            // inspection, so the XSS fix stays active either way
            // (fail-secure, MSRC 129745, [HC-MS-SDL]).
            if (typeof DOMPurify !== 'undefined' && DOMPurify) {
                try {
                    return DOMPurify.sanitize(html || '', { RETURN_DOM: true });
                }
                catch (e) {
                    return new DOMParser().parseFromString(html || '', 'text/html').body;
                }
            }
            return new DOMParser().parseFromString(html || '', 'text/html').body;
        };
        ;
        /**
         * Returns whether secure (inert) HTML parsing is enabled. Fails secure:
         * defaults to true if the feature API is unavailable so the XSS fix
         * stays active even when the FCB cannot be read.
         */
        EmailTemplateLibrary.isSecureHtmlParsingEnabled = function () {
            try {
                // Secure-by-default: the fix is active unless the FCB is explicitly
                // disabled. Matches the PCF EmailTemplateCopilotWrapper gate so both
                // surfaces agree on secure-by-default (MSRC 129745, [HC-MS-SDL]).
                return Xrm.Internal.isFeatureEnabled(EmailTemplateLibrary.FCB_EnableSecureHtmlParsingInEmailTemplate) !== false;
            }
            catch (e) {
                return true;
            }
        };
        ;
        /**
         * Single choke point for turning an untrusted HTML string into an element
         * that callers only READ from (querySelector / getAttribute) - never
         * render. When the FCB is on it returns the inert DOMParser body
         * (MSRC 129745, [HC-MS-SDL]: no script/resource execution); when off it
         * preserves the unchanged legacy detached-div innerHTML behaviour. Routing
         * every call site through here keeps the security decision in one place so
         * a future edit cannot leave some paths on the legacy innerHTML sink.
         */
        EmailTemplateLibrary.parseHtmlForInspection = function (html) {
            if (EmailTemplateLibrary.isSecureHtmlParsingEnabled()) {
                return EmailTemplateLibrary.secureParseHtml(html);
            }
            // Legacy behaviour (FCB off) - unchanged.
            var legacyDiv = document.createElement('div');
            legacyDiv.innerHTML = html;
            return legacyDiv;
        };
        ;
        EmailTemplateLibrary.isLimitCopilotPrompts = function (editor, isChange, response, currentId) {
            var htmlString = editor.getData();
            var tempDiv = EmailTemplateLibrary.parseHtmlForInspection(htmlString);
            var datacopilotpromptDivs = tempDiv.getElementsByClassName(EmailTemplateLibrary.DataCopilotPromptClass);
            var hasDataUseKnowledgeTrue = false;
            var knowledgeElementId = undefined;
            for (var i = 0; i < datacopilotpromptDivs.length; i++) {
                if (datacopilotpromptDivs[i].getAttribute('data-use-knowledge') === 'true') {
                    hasDataUseKnowledgeTrue = true;
                    knowledgeElementId = datacopilotpromptDivs[i].getAttribute('id');
                    break;
                }
            }
            var val = Xrm.Utility.getGlobalContext().getCurrentAppSetting("msdynce_insertcopilotpromptconfig");
            var newElementHasDataUseKnowledgeTrue = response ? response.parameters.param_insertCopilotPromptsControlOutput.includes('data-use-knowledge="true"') : false;
            var currentPromptLimit = isChange ? datacopilotpromptDivs.length - 1 : datacopilotpromptDivs.length;
            if (currentPromptLimit >= val) {
                var copilotPromptExceedingErrorMessage = Xrm.Utility.getResourceString(EmailTemplateLibrary.WebResourceName, "CopilotPrompts_Exceeding_Msg");
                copilotPromptExceedingErrorMessage = EmailTemplateLibrary.formatString(copilotPromptExceedingErrorMessage, val.toString());
                var alertStrings = { confirmButtonLabel: "OK", text: copilotPromptExceedingErrorMessage, title: "Alert" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
                return true;
            }
            else if (newElementHasDataUseKnowledgeTrue && hasDataUseKnowledgeTrue && !isChange) {
                var knowledgeErrorMessage = Xrm.Utility.getResourceString(EmailTemplateLibrary.WebResourceName, "CopilotPromptsKnowledgeSource_Exceeding_Msg");
                var alertStrings = { confirmButtonLabel: "OK", text: knowledgeErrorMessage, title: "Alert" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
                return true;
            }
            else if (isChange && hasDataUseKnowledgeTrue && newElementHasDataUseKnowledgeTrue && (currentId != knowledgeElementId)) {
                var knowledgeErrorMessage = Xrm.Utility.getResourceString(EmailTemplateLibrary.WebResourceName, "CopilotPromptsKnowledgeSource_Exceeding_Msg");
                var alertStrings = { confirmButtonLabel: "OK", text: knowledgeErrorMessage, title: "Alert" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
                return true;
            }
        };
        EmailTemplateLibrary.formatString = function (str) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return str.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] !== 'undefined' ? args[number] : match;
            });
        };
        EmailTemplateLibrary.cssStringToObject = function (cssString) {
            var cssObject = {};
            var rules = cssString.split(';');
            rules.forEach(function (rule) {
                if (rule.trim()) {
                    var _a = rule.split(':'), property = _a[0], value = _a[1];
                    cssObject[property.trim()] = value.trim();
                }
            });
            return cssObject;
        };
        /**
         * On submit handler for dialog
         * @param eventContext
         */
        EmailTemplateLibrary.insertPromptDialogSubmitClick = function (eventContext) {
            var paramLastButtonClicked = eventContext.getFormContext().data.attributes.get('param_lastButton_clicked');
            if (paramLastButtonClicked) {
                paramLastButtonClicked.setValue(this.DialogInsertId);
            }
            var page = eventContext.getFormContext();
            page.ui.close();
        };
        /**
         * On close handler for dialog
         * @param eventContext
         */
        EmailTemplateLibrary.insertPromptDialogCancelClick = function (eventContext) {
            var paramLastButtonClicked = eventContext.getFormContext().data.attributes.get('param_lastButton_clicked');
            if (paramLastButtonClicked) {
                paramLastButtonClicked.setValue(this.DialogCancelId);
            }
            var page = eventContext.getFormContext();
            page.ui.close();
        };
        EmailTemplateLibrary.extractDataAltTextFromOuterHTML = function (outerHTML) {
            // Extract the data-alt-text attribute of the <div> or <span> element
            var element = EmailTemplateLibrary.extractPromptContentElement(outerHTML);
            if (element) {
                return element.getAttribute('data-alt-text');
            }
            return null;
        };
        EmailTemplateLibrary.extractDataAltTextStyleFromOuterHTML = function (outerHTML) {
            // Extract the data-alt-text-format attribute of the <div> or <span> element
            var element = EmailTemplateLibrary.extractPromptContentElement(outerHTML);
            if (element) {
                return element.getAttribute('data-alt-text-format');
            }
            return null;
        };
        EmailTemplateLibrary.extractUseKnowledgeValueFromOuterHTML = function (outerHTML) {
            // Extract the data-use-knowledge attribute of the <div> or <span> element
            var element = EmailTemplateLibrary.extractPromptContentElement(outerHTML);
            if (element) {
                return element.getAttribute('data-use-knowledge');
            }
            return null;
        };
        EmailTemplateLibrary.extractIdFromOuterHTML = function (outerHTML) {
            // Extract the id attribute of the <div> element
            var element = EmailTemplateLibrary.extractPromptContentElement(outerHTML);
            if (element) {
                return element.getAttribute('id');
            }
            return null;
        };
        EmailTemplateLibrary.extractPromptContentElement = function (outerHTML) {
            var tempDiv = EmailTemplateLibrary.parseHtmlForInspection(outerHTML);
            var isTemplateWithSpanElement = Xrm.Internal.isFeatureEnabled(EmailTemplateLibrary.FCB_CopilotEmailTemplateWithSpanElementFCB);
            if (isTemplateWithSpanElement) {
                var divElement = tempDiv.querySelector('div');
                if (divElement) {
                    return divElement;
                }
                // If no div is found, then check for the span element
                var spanElement = tempDiv.querySelector('span');
                if (spanElement) {
                    return spanElement;
                }
            }
            else {
                var divElement = tempDiv.querySelector('div');
                if (divElement) {
                    return divElement;
                }
            }
            return null;
        };
        /**
         * Adds an onOutputChange handler to an output attribute.
         * @param eventContext The event context.
         * @param attributeName The attribute name.
         * @param handler The handler to add.
         * @remarks This method also removes a registered handler, if one exists to prevent double registering.
         */
        EmailTemplateLibrary.addOnChangeHandler = function (eventContext, attributeName, handler) {
            var formContext = eventContext.getFormContext();
            var attribute = formContext.data.attributes.get(attributeName);
            var value = attribute.getValue();
            var isTemplateWithSpanElement = Xrm.Internal.isFeatureEnabled(EmailTemplateLibrary.FCB_CopilotEmailTemplateWithSpanElementFCB);
            if (attributeName === 'param_insertCopilotPromptsAltTextOutput') {
                // Check if the value is a non-empty string for alt text
                if (typeof value === 'string' && value.trim() !== '') {
                    EmailTemplateLibrary.isCopilotPromptAltTextInputEmpty = false;
                    if (EmailTemplateLibrary.isCopilotPromptInputEmpty === false) { //enable ok button only if both alt text and copilot prompt input value are not empty
                        formContext.getControl("ok_id").setDisabled(false);
                    }
                }
                else {
                    EmailTemplateLibrary.isCopilotPromptAltTextInputEmpty = true;
                    formContext.getControl("ok_id").setDisabled(true);
                }
            }
            else if (attributeName === 'param_insertCopilotPromptsControlOutput') {
                if (value) {
                    var tempDiv = EmailTemplateLibrary.parseHtmlForInspection(value);
                    // Extract the data-value attribute of the <div> element
                    var copilotElement = 0;
                    if (isTemplateWithSpanElement) {
                        copilotElement = tempDiv.querySelector('div');
                        if (!copilotElement) { //if existing div prompt.
                            copilotElement = tempDiv.querySelector('span');
                        }
                    }
                    else {
                        copilotElement = tempDiv.querySelector('div');
                    }
                    var dataValue = copilotElement ? copilotElement.getAttribute('data-value') || '' : '';
                    // Check if the data-value attribute is a non-empty string
                    if (dataValue.trim() !== '') {
                        EmailTemplateLibrary.isCopilotPromptInputEmpty = false;
                        if (EmailTemplateLibrary.isCopilotPromptAltTextInputEmpty === false) { //enable ok button only if both alt text and copilot prompt input value are not empty
                            formContext.getControl("ok_id").setDisabled(false);
                        }
                    }
                    else {
                        EmailTemplateLibrary.isCopilotPromptInputEmpty = true;
                        formContext.getControl("ok_id").setDisabled(true);
                    }
                }
                else {
                    EmailTemplateLibrary.isCopilotPromptInputEmpty = true;
                    formContext.getControl("ok_id").setDisabled(true);
                }
            }
            if (attribute) {
                attribute.removeOnChange(handler);
                attribute.addOnChange(handler);
            }
        };
        //handler to handle the change in alt text output
        EmailTemplateLibrary.controlAltTextOutputChangeHandler = function (eventContext) {
            var formContext = eventContext.getFormContext();
            var promptAltText = formContext.data.attributes.get('param_insertCopilotPromptsAltTextOutput').getValue();
            if (promptAltText && promptAltText.trim() !== '') {
                EmailTemplateLibrary.isCopilotPromptAltTextInputEmpty = false;
                if (EmailTemplateLibrary.isCopilotPromptInputEmpty === false) { //enable ok button only if both alt text and copilot prompt input value are not empty
                    formContext.getControl("ok_id").setDisabled(false);
                }
            }
            else {
                EmailTemplateLibrary.isCopilotPromptAltTextInputEmpty = true;
                formContext.getControl("ok_id").setDisabled(true);
            }
        };
        //handler to handle the change in copilot prompt output value
        EmailTemplateLibrary.controlPromptOutputChangeHandler = function (eventContext) {
            var formContext = eventContext.getFormContext();
            var copilotPromptInput = formContext.data.attributes.get('param_insertCopilotPromptsControlOutput').getValue();
            var isTemplateWithSpanElement = Xrm.Internal.isFeatureEnabled(EmailTemplateLibrary.FCB_CopilotEmailTemplateWithSpanElementFCB);
            if (copilotPromptInput) {
                var tempDiv = EmailTemplateLibrary.parseHtmlForInspection(copilotPromptInput);
                // Extract the data-value attribute of the <div> or <span> element
                var copilotElement = 0;
                if (isTemplateWithSpanElement) {
                    copilotElement = tempDiv.querySelector('div');
                    if (!copilotElement) { //if existing div prompt.
                        copilotElement = tempDiv.querySelector('span');
                    }
                }
                else {
                    copilotElement = tempDiv.querySelector('div');
                }
                var dataValue = copilotElement ? copilotElement.getAttribute('data-value') || '' : '';
                // Check if the data-value attribute is a non-empty string
                if (dataValue.trim() !== '') {
                    EmailTemplateLibrary.isCopilotPromptInputEmpty = false;
                    if (EmailTemplateLibrary.isCopilotPromptAltTextInputEmpty === false) { //enable ok button only if both alt text and copilot prompt input value are not empty
                        formContext.getControl("ok_id").setDisabled(false);
                    }
                }
                else {
                    EmailTemplateLibrary.isCopilotPromptInputEmpty = true;
                    formContext.getControl("ok_id").setDisabled(true);
                }
            }
            else {
                EmailTemplateLibrary.isCopilotPromptInputEmpty = true;
                formContext.getControl("ok_id").setDisabled(true);
            }
        };
        /**
         * On load handler for dialog
         * @param eventContext
         */
        EmailTemplateLibrary.insertPromptDialogOnLoad = function (eventContext) {
            this.addOnChangeHandler(eventContext, "param_insertCopilotPromptsAltTextOutput", this.controlAltTextOutputChangeHandler);
            this.addOnChangeHandler(eventContext, "param_insertCopilotPromptsControlOutput", this.controlPromptOutputChangeHandler);
        };
        /**
         * On click handler for "Update Copilot Recommendation" button
         */
        EmailTemplateLibrary.copilotBulkUpdateButtonClick = function (gridControl, records, entityTypeCode) {
            var options = {
                width: 300,
                height: 250,
                position: 1 // center
            };
            var dialogParams = {};
            Xrm.Navigation.openDialog(EmailTemplateLibrary.BulkUpdateCopilotRecommendedTemplatesOptionDialog, options, dialogParams).then(function (response) {
                if (response.parameters.param_lastButton_clicked == EmailTemplateLibrary.BulkUpdateCopilotRecommendationDialogInsertId) {
                    if (response.parameters.param_selectedOption === undefined) {
                        return;
                    }
                    var attributeValue_1 = parseInt(response.parameters.param_selectedOption);
                    // Iterate through all record IDs and update the attribute
                    records.forEach(function (record) {
                        var recordId = record.Id;
                        try {
                            // payload to update the optionset attribute
                            var payload = {
                                includetemplateforcopilotrecommendation: attributeValue_1
                            };
                            Xrm.WebApi.updateRecord("template", recordId, payload)
                                .then(function () {
                                //do nothing
                            })
                                .catch(function (error) {
                                console.error("Failed to update template record with ID: " + recordId, error);
                            });
                        }
                        catch (error) {
                            console.error("Error updating template record with ID: " + recordId, error);
                        }
                    });
                }
            });
        };
        ;
        /**
         * On submit handler for dialog
         * @param eventContext
         */
        EmailTemplateLibrary.bulkUpdateCopilotRecommendedTemplateDialogSubmitClick = function (eventContext) {
            var paramLastButtonClicked = eventContext.getFormContext().data.attributes.get('param_lastButton_clicked');
            if (paramLastButtonClicked) {
                paramLastButtonClicked.setValue(EmailTemplateLibrary.BulkUpdateCopilotRecommendationDialogInsertId);
            }
            var page = eventContext.getFormContext();
            page.ui.close();
        };
        /**
         * On close handler for dialog
         * @param eventContext
         */
        EmailTemplateLibrary.bulkUpdateCopilotRecommendedTemplateDialogCancelClick = function (eventContext) {
            var paramLastButtonClicked = eventContext.getFormContext().data.attributes.get('param_lastButton_clicked');
            if (paramLastButtonClicked) {
                paramLastButtonClicked.setValue(EmailTemplateLibrary.DialogCancelId);
            }
            var page = eventContext.getFormContext();
            page.ui.close();
        };
        EmailTemplateLibrary.SendEmailTestRunDialogOnLoad = function (eventContext) {
            var formContext = eventContext.getFormContext();
            // Get the current logged-in user
            var userId = Xrm.Utility.getGlobalContext().userSettings.userId;
            var userName = Xrm.Utility.getGlobalContext().userSettings.userName;
            // Set the logged-in user as the default value for the "to" field
            var toAttribute = formContext.getAttribute("to");
            if (toAttribute && userId) {
                var userLookup = [{
                        id: userId,
                        name: userName,
                        entityType: "systemuser"
                    }];
                toAttribute.setValue(userLookup);
            }
            // Handle dynamic lookup visibility - show only ONE lookup at a time
            var allowedEntityTypeParam = formContext.getAttribute("param_allowedEntityType");
            var allowedEntityType = allowedEntityTypeParam ? allowedEntityTypeParam.getValue() : null;
            // Define specific entity lookup controls mapping
            var entityLookupControls = {
                "account": "account_lookup",
                "contact": "contact_lookup",
                "lead": "lead_lookup",
                "opportunity": "opportunity_lookup"
            };
            // All lookup control IDs
            var allLookupControlIds = ["regarding_id", "account_lookup", "contact_lookup", "lead_lookup", "opportunity_lookup"];
            // Determine which lookup to show
            var activeLookupId = "regarding_id"; // Default to regarding
            if (allowedEntityType && allowedEntityType.trim() !== "") {
                var entityType = allowedEntityType.trim().toLowerCase();
                // If parameter matches a specific entity, use its lookup; otherwise use regarding
                if (entityLookupControls[entityType]) {
                    activeLookupId = entityLookupControls[entityType];
                }
            }
            // Show only the active lookup, hide all others
            EmailTemplateLibrary.showOnlyThisLookup(formContext, activeLookupId, allLookupControlIds);
        };
        /**
         * Shows only the specified lookup control and hides all others
         * @param formContext Form context
         * @param activeControlId The control ID to show
         * @param allControlIds Array of all lookup control IDs
         */
        EmailTemplateLibrary.showOnlyThisLookup = function (formContext, activeControlId, allControlIds) {
            for (var _i = 0, allControlIds_1 = allControlIds; _i < allControlIds_1.length; _i++) {
                var controlId = allControlIds_1[_i];
                var control = formContext.getControl(controlId);
                var attribute = formContext.getAttribute(controlId);
                if (controlId === activeControlId) {
                    // Show this control
                    if (control) {
                        control.setVisible(true);
                    }
                    if (attribute) {
                        attribute.setRequiredLevel("required");
                    }
                }
                else {
                    // Hide this control
                    if (control) {
                        control.setVisible(false);
                    }
                    if (attribute) {
                        attribute.setRequiredLevel("none");
                        attribute.setValue(null); // Clear value
                    }
                }
            }
        };
        EmailTemplateLibrary.getEntitySetName = function (logicalName) {
            // Map common entity types to their set names
            var entitySetMap = {
                "systemuser": "systemusers",
                "contact": "contacts",
                "account": "accounts",
                "lead": "leads",
                "opportunity": "opportunities",
                "incident": "incidents",
                "quote": "quotes",
                "salesorder": "salesorders",
                "invoice": "invoices"
            };
            return entitySetMap[logicalName] || (logicalName + "s");
        };
        EmailTemplateLibrary.OnSelectFromSendEmailTestRunDialog = function (eventContext) {
            var formContext = eventContext.getFormContext();
            var templateIdAttribute = formContext.getAttribute("param_templateId");
            var templateId = templateIdAttribute ? templateIdAttribute.getValue() : null;
            // Set to null if empty string
            if (templateId === '') {
                templateId = null;
            }
            // Get param_options for conditional logic
            var optionsAttribute = formContext.getAttribute("param_options");
            var optionsValue = optionsAttribute ? optionsAttribute.getValue() : null;
            // Set to null if empty string
            if (optionsValue === '') {
                optionsValue = null;
            }
            // Get values from the dialog fields - find the visible lookup
            var regardingAttribute = null;
            var regardingValue = null;
            var allLookupControlIds = [
                "regarding_id",
                "account_lookup",
                "contact_lookup",
                "lead_lookup",
                "opportunity_lookup"
            ];
            // Find which lookup is visible
            for (var _i = 0, allLookupControlIds_1 = allLookupControlIds; _i < allLookupControlIds_1.length; _i++) {
                var controlId = allLookupControlIds_1[_i];
                var control = formContext.getControl(controlId);
                if (control && control.getVisible()) {
                    regardingAttribute = formContext.getAttribute(controlId);
                    regardingValue = regardingAttribute ? regardingAttribute.getValue() : null;
                    break;
                }
            }
            // Validate we have a regarding value
            if (!regardingValue || regardingValue.length === 0) {
                var missingRegardingMessage = "Please select a record in the Preview for field.";
                Xrm.Navigation.openErrorDialog({ message: missingRegardingMessage });
                return;
            }
            var toAttribute = formContext.getAttribute("to");
            var toValue = toAttribute ? toAttribute.getValue() : null;
            var regardingValueWithBrackets = (regardingValue && regardingValue.length > 0) ? regardingAttribute.getValue()[0].id : null;
            var toValueWithBrackets = (toValue && toValue.length > 0) ? toAttribute.getValue()[0].id : null;
            var regardingEntityId = regardingValueWithBrackets ? regardingValueWithBrackets.replace(/[{}]/g, '') : null;
            var toEntityId = toValueWithBrackets ? toValueWithBrackets.replace(/[{}]/g, '') : null;
            var regardingEntity = regardingValue[0];
            var regardingEntityType = regardingEntity.entityType;
            var regardingEntityIdField = regardingEntityType + "id";
            // Regarding: account entity (typed)
            var Regarding = {
                "@odata.type": "Microsoft.Dynamics.CRM." + regardingEntityType
            };
            Regarding[regardingEntityIdField] = regardingEntityId;
            // Get the current logged-in user for FROM party
            var currentUserId = Xrm.Utility.getGlobalContext().userSettings.userId;
            var currentUserIdClean = currentUserId.replace(/[{}]/g, '');
            // Build activity parties array - FROM (current user) and TO (from dialog)
            var activityParties = [
                // FROM party (current logged-in user)
                {
                    "partyid_systemuser@odata.bind": "/systemusers(" + currentUserIdClean + ")",
                    "participationtypemask": 1
                }
            ];
            // Add TO parties from the dialog field
            if (toValue) {
                toValue.forEach(function (toEntity) {
                    var _a;
                    var toEntityType = toEntity.entityType;
                    var toEntityId = toEntity.id.replace(/[{}]/g, '');
                    var toBindingProperty = "partyid_" + toEntityType + "@odata.bind";
                    var toEntitySetName = toEntityType === "systemuser" ? "systemusers" :
                        toEntityType === "contact" ? "contacts" :
                            toEntityType + "s"; // This is not needed mostly. But for safer end added here.
                    activityParties.push((_a = {},
                        _a[toBindingProperty] = "/" + toEntitySetName + "(" + toEntityId + ")",
                        _a["participationtypemask"] = 2,
                        _a));
                });
            }
            // Check if param_options has a value
            if (optionsValue) {
                // Show progress indicator
                Xrm.Utility.showProgressIndicator(Xrm.Utility.getResourceString(EmailTemplateLibrary.WebResourceName, "email_sending_msg_test_run"));
                // Parse the JSON to extract subject, description, and attachmentIds
                var subjectHTML = "";
                var descriptionHTML = "";
                var attachmentIds_1 = [];
                try {
                    var contentJson = JSON.parse(optionsValue);
                    subjectHTML = contentJson.subject || "";
                    descriptionHTML = contentJson.description || "";
                    attachmentIds_1 = contentJson.attachmentIds || [];
                }
                catch (error) {
                    Xrm.Utility.closeProgressIndicator();
                    var parseErrorMessage = Xrm.Utility.getResourceString(EmailTemplateLibrary.WebResourceName, "parse_options_json_failed_error_msg");
                    Xrm.Navigation.openErrorDialog({ message: parseErrorMessage + ": " + error });
                    return;
                }
                // Call InstantiateHtmlRequest with SubjectHTML and BodyHTML
                var instantiateRequest = new CrmService.InstantiateHtmlRequest(regardingEntityType, new window.top.Guid(regardingEntityId), subjectHTML, descriptionHTML);
                Xrm.WebApi.online.execute(instantiateRequest)
                    .then(function (response) {
                    if (response && response.ok) {
                        return response.json();
                    }
                    throw new Error(Xrm.Utility.getResourceString(EmailTemplateLibrary.WebResourceName, "instantiate_html_request_failed_error_msg"));
                })
                    .then(function (result) {
                    // STEP 2: Parse the EntityCollection response
                    if (result.value.length == 1) {
                        var instantiatedEmail = result.value[0];
                        var renderedSubject = instantiatedEmail.subject || "";
                        var renderedBody = instantiatedEmail.description || "";
                        // STEP 3: Build email data
                        var emailData_1 = {
                            subject: renderedSubject,
                            description: renderedBody,
                            email_activity_parties: activityParties
                        };
                        // STEP 3.5: If attachments exist, fetch them and include in email data for deep insert
                        // Deep insert creates email + attachments in a single transaction
                        if (attachmentIds_1 && attachmentIds_1.length > 0) {
                            return EmailTemplateLibrary.fetchAttachmentData(attachmentIds_1)
                                .then(function (attachmentDataList) {
                                if (attachmentDataList && attachmentDataList.length === attachmentIds_1.length) {
                                    // Calculate total attachment size in MB
                                    var totalAttachmentSizeInBytes = attachmentDataList.reduce(function (sum, attachment) {
                                        return sum + (attachment["filesize"] || 0);
                                    }, 0);
                                    var totalAttachmentSizeInMB = totalAttachmentSizeInBytes / (1024 * 1024);
                                    // If attachments exceed 5 MB, update progress indicator
                                    if (totalAttachmentSizeInMB > 5.0) {
                                        Xrm.Utility.closeProgressIndicator();
                                        Xrm.Utility.showProgressIndicator(Xrm.Utility.getResourceString(EmailTemplateLibrary.WebResourceName, "email_sending_large_attachment_msg"));
                                    }
                                    // Add attachments to email data using navigation property for deep insert
                                    // This creates email + all attachments in a single atomic transaction
                                    emailData_1.email_activity_mime_attachment = attachmentDataList.map(function (attachment) { return ({
                                        activitysubject: attachment["activitysubject"],
                                        body: attachment["body"],
                                        filename: attachment["filename"],
                                        mimetype: attachment["mimetype"],
                                        attachmentcontentid: attachment["attachmentcontentid"],
                                        objecttypecode: "email"
                                    }); });
                                    return Xrm.WebApi.createRecord("email", emailData_1);
                                }
                                else {
                                    // Fail if not all attachments were fetched - throw to stop promise chain
                                    throw new Error(Xrm.Utility.getResourceString(EmailTemplateLibrary.WebResourceName, "attachment_fetch_failed_error_msg") || "Failed to fetch attachments.");
                                }
                            });
                        }
                        else {
                            // No attachments - just create email
                            return Xrm.WebApi.createRecord("email", emailData_1);
                        }
                    }
                    else {
                        throw new Error(Xrm.Utility.getResourceString(EmailTemplateLibrary.WebResourceName, "instantiate_html_no_content_error_msg"));
                    }
                })
                    .then(function (emailResult) {
                    // STEP 4: Send the email
                    var sendRequest = new CrmService.SendEmailRequest(emailResult.id, true);
                    var responseDataAttribute = formContext.getAttribute("param_emailResponse");
                    if (responseDataAttribute) {
                        responseDataAttribute.setValue(emailResult.id);
                    }
                    return Xrm.WebApi.online.execute(sendRequest);
                })
                    .then(function (sendResponse) {
                    // STEP 5: Handle success
                    Xrm.Utility.closeProgressIndicator();
                    var emailSentSuccessfullyMessage = Xrm.Utility.getResourceString(EmailTemplateLibrary.WebResourceName, "email_sent_successfully_msg");
                    Xrm.App.addGlobalNotification({
                        type: 1,
                        level: 1,
                        message: emailSentSuccessfullyMessage,
                        showCloseButton: true
                    });
                    formContext.ui.close();
                })
                    .catch(function (error) {
                    // STEP 6: Handle errors
                    Xrm.Utility.closeProgressIndicator();
                    var errorMessage = Xrm.Utility.getResourceString(EmailTemplateLibrary.WebResourceName, "email_sending_error_msg_test_run");
                    // Provide more specific error context if available
                    if (error.message) {
                        errorMessage = error.message;
                    }
                    else if (error.raw) {
                        errorMessage = error.raw;
                    }
                    Xrm.Navigation.openErrorDialog({ message: errorMessage });
                });
            }
            else if (templateId) {
                // Show progress indicator
                Xrm.Utility.showProgressIndicator(Xrm.Utility.getResourceString(EmailTemplateLibrary.WebResourceName, "email_sending_msg"));
                // Use SendEmailFromTemplateRequest with templateId
                var Target = {
                    "@odata.type": "Microsoft.Dynamics.CRM.email",
                    "email_activity_parties": activityParties
                };
                templateId = new window.top.Guid(templateId);
                var sendEmailFromTemplateRequest = new CrmService.SendEmailFromTemplateRequest(templateId, Regarding, Target);
                Xrm.WebApi.online.execute(sendEmailFromTemplateRequest).then(function (response) {
                    if (response && response.ok) {
                        response.json().then(function (odataResponse) {
                            var emailId = odataResponse.activityid;
                            var responseDataAttribute = formContext.getAttribute("param_emailResponse");
                            if (responseDataAttribute) {
                                responseDataAttribute.setValue(emailId);
                            }
                            // Update email to remove regarding field
                            var updateData = {
                                "_regardingobjectid_value": null
                            };
                            return Xrm.WebApi.updateRecord("email", emailId, updateData);
                        }).then(function () {
                            Xrm.Utility.closeProgressIndicator();
                            var emailSentSuccessfullyMessage = Xrm.Utility.getResourceString(EmailTemplateLibrary.WebResourceName, "email_sent_successfully_msg");
                            Xrm.App.addGlobalNotification({
                                type: 1,
                                level: 1,
                                message: emailSentSuccessfullyMessage,
                                showCloseButton: true
                            });
                            formContext.ui.close();
                        }).catch(function (updateError) {
                            // Handle update error but don't fail the entire flow since email was already sent
                            console.error("Failed to update regarding field:", updateError);
                            Xrm.Utility.closeProgressIndicator();
                            var emailSentSuccessfullyMessage = Xrm.Utility.getResourceString(EmailTemplateLibrary.WebResourceName, "email_sent_successfully_msg");
                            Xrm.App.addGlobalNotification({
                                type: 1,
                                level: 1,
                                message: emailSentSuccessfullyMessage,
                                showCloseButton: true
                            });
                            formContext.ui.close();
                        });
                    }
                    else {
                        Xrm.Utility.closeProgressIndicator();
                        var errorMessage = Xrm.Utility.getResourceString(EmailTemplateLibrary.WebResourceName, "email_sending_error_msg");
                        Xrm.Navigation.openErrorDialog({ message: errorMessage });
                    }
                }).catch(function (error) {
                    Xrm.Utility.closeProgressIndicator();
                    var errorMessage = Xrm.Utility.getResourceString(EmailTemplateLibrary.WebResourceName, "email_sending_error_msg");
                    if (error.message) {
                        errorMessage = error.message;
                    }
                    Xrm.Navigation.openErrorDialog({ message: errorMessage });
                });
                return;
            }
            else {
                var missingParamsMessage = Xrm.Utility.getResourceString(EmailTemplateLibrary.WebResourceName, "missing_params_error_msg");
                Xrm.Navigation.openErrorDialog({ message: missingParamsMessage });
                return;
            }
        };
        EmailTemplateLibrary.OnCancelFromSendEmailTestRunDialog = function (eventContext) {
            var formContext = eventContext.getFormContext();
            formContext.ui.close();
        };
        EmailTemplateLibrary.OnRegardingChange = function (eventContext) {
            var formContext = eventContext.getFormContext();
            EmailTemplateLibrary.ValidateAndEnableSelectButton(formContext);
        };
        EmailTemplateLibrary.OnToFieldChange = function (eventContext) {
            var formContext = eventContext.getFormContext();
            EmailTemplateLibrary.ValidateAndEnableSelectButton(formContext);
        };
        EmailTemplateLibrary.OnSpecificEntityLookupChange = function (eventContext) {
            var formContext = eventContext.getFormContext();
            EmailTemplateLibrary.ValidateAndEnableSelectButton(formContext);
        };
        EmailTemplateLibrary.ValidateAndEnableSelectButton = function (formContext) {
            var regardingValue = null;
            // List of all possible lookup controls
            var allLookupControlIds = [
                "regarding_id",
                "account_lookup",
                "contact_lookup",
                "lead_lookup",
                "opportunity_lookup"
            ];
            // Find the visible lookup and get its value
            for (var _i = 0, allLookupControlIds_2 = allLookupControlIds; _i < allLookupControlIds_2.length; _i++) {
                var controlId = allLookupControlIds_2[_i];
                var control = formContext.getControl(controlId);
                if (control && control.getVisible()) {
                    var attribute = formContext.getAttribute(controlId);
                    regardingValue = attribute ? attribute.getValue() : null;
                    break; // Only one lookup is visible at a time
                }
            }
            var toValue = formContext.getAttribute("to").getValue();
            var selectButton = formContext.getControl("select_id");
            if (selectButton) {
                if (regardingValue && regardingValue.length > 0 && toValue && toValue.length > 0) {
                    selectButton.setDisabled(false);
                }
                else {
                    selectButton.setDisabled(true);
                }
            }
        };
        ;
        /**
         * Fetches attachment data from source attachment IDs for deep insert.
         * @param attachmentIds Array of activitymimeattachment IDs to fetch
         * @returns Promise that resolves with array of attachment data
         */
        EmailTemplateLibrary.fetchAttachmentData = function (attachmentIds) {
            return __awaiter(this, void 0, void 0, function () {
                var validIds, filterConditions, fetchQuery, response, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!attachmentIds || attachmentIds.length === 0) {
                                return [2 /*return*/, Promise.resolve([])];
                            }
                            validIds = attachmentIds
                                .filter(function (id) { return id != null && id !== undefined && id !== ''; })
                                .map(function (id) { return String(id).replace(/[{}]/g, ''); });
                            if (validIds.length === 0) {
                                return [2 /*return*/, Promise.resolve([])];
                            }
                            filterConditions = validIds.map(function (id) {
                                return "activitymimeattachmentid eq " + id;
                            }).join(' or ');
                            fetchQuery = "?$filter=" + filterConditions + "&$select=activitysubject,body,filename,mimetype,attachmentcontentid,filesize";
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Xrm.WebApi.online.retrieveMultipleRecords("activitymimeattachment", fetchQuery)];
                        case 2:
                            response = _a.sent();
                            return [2 /*return*/, response && response.entities ? response.entities : []];
                        case 3:
                            error_1 = _a.sent();
                            return [2 /*return*/, []];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        EmailTemplateLibrary.FCB_EnableEnhanceEmailTemplateEditor = "EnableEnhanceEmailTemplateEditor";
        EmailTemplateLibrary.FCB_DisableMarketingEditorInEmailTemplate = "DisableMarketingEditorInEmailTemplate";
        EmailTemplateLibrary.attachmentTab = "Attachment_tab";
        EmailTemplateLibrary.enhanceEditorTab = "Enhance_Editor_tab";
        EmailTemplateLibrary.templateTab = "Template";
        EmailTemplateLibrary.IsEnhancedEditorEnabled = "isenhancededitorenabled";
        EmailTemplateLibrary.SafeHtml = "safehtml";
        EmailTemplateLibrary.RICH_TEXT_EDITOR_CONTROL_TEMPLATE_SUBJECT = 'Rich Text Editor Control template subjectsafehtml';
        EmailTemplateLibrary.NotFocusedOnSubjectOrBody = "NotFocusedOnSubjectOrBody";
        EmailTemplateLibrary.InsertCopilotPromptsDialog = "InsertCopilotPromptsDialog";
        EmailTemplateLibrary.DialogInsertId = "InsertCopilotPromptsSubmit";
        EmailTemplateLibrary.FCB_KeepRTEv1ForEmailTemplateAndSignature = "KeepRTEv1ForEmailTemplateAndSignature";
        EmailTemplateLibrary.FCB_ApplyEditorSelectionStyle = "ApplyEditorSelectionStyle";
        EmailTemplateLibrary.FCB_isDynamicTextinRTEV2Disabled = "isDynamicTextinRTEV2Disabled";
        EmailTemplateLibrary.FCB_EnableTemplateCopilotPrompts = "EnableTemplateCopilotPrompts";
        EmailTemplateLibrary.FCB_EnableSecureHtmlParsingInEmailTemplate = "EnableSecureHtmlParsingInEmailTemplate";
        EmailTemplateLibrary.DialogCancelId = "cancel_id";
        EmailTemplateLibrary.ArrowRight = "ArrowRight";
        EmailTemplateLibrary.ArrowLeft = "ArrowLeft";
        EmailTemplateLibrary.ArrowUp = "ArrowUp";
        EmailTemplateLibrary.ArrowDown = "ArrowDown";
        EmailTemplateLibrary.Backspace = "Backspace";
        EmailTemplateLibrary.nodeType = {
            ELEMENT_NODE: 1,
            TEXT_NODE: 3,
        };
        EmailTemplateLibrary.WebResourceName = "Localization/Languages/EmailStrings";
        EmailTemplateLibrary.ckeditorMap = new Map();
        EmailTemplateLibrary.editorTimeout = 500;
        EmailTemplateLibrary.numberOfCkeditor = 2;
        EmailTemplateLibrary.isBackspace = false;
        EmailTemplateLibrary.ckeditor5 = false;
        EmailTemplateLibrary.insertInProgress = false;
        EmailTemplateLibrary.isCopilotPromptInputEmpty = true;
        EmailTemplateLibrary.isCopilotPromptAltTextInputEmpty = true;
        EmailTemplateLibrary.FCB_CopilotEmailTemplateWithSpanElementFCB = "CopilotEmailTemplateWithSpanElement";
        EmailTemplateLibrary.isLeftArrowClick = false;
        EmailTemplateLibrary.DataCopilotPromptClass = "datacopilotprompt";
        EmailTemplateLibrary.BulkUpdateCopilotRecommendedTemplatesOptionDialog = "BulkUpdateCopilotRecommendedTemplatesOptionDialog";
        EmailTemplateLibrary.BulkUpdateCopilotRecommendationDialogInsertId = "BulkUpdateCopilotTemplatesSubmit";
        EmailTemplateLibrary.extractIdFromSlug = function (slug) {
            var idMatch = slug.match(/id=(\w+)/);
            return idMatch ? idMatch[1] : "";
        };
        EmailTemplateLibrary.isCopilotPromptElementDiv = function (outerHTML) {
            var tempDiv = EmailTemplateLibrary.parseHtmlForInspection(outerHTML);
            var divElement = tempDiv.querySelector('div');
            if (divElement) {
                return true;
            }
            return false;
        };
        return EmailTemplateLibrary;
    }());
    CrmService.EmailTemplateLibrary = EmailTemplateLibrary;
})(CrmService || (CrmService = {}));
var CrmService;
(function (CrmService) {
    var SendEmailFromTemplateRequest = /** @class */ (function () {
        function SendEmailFromTemplateRequest(templateId, regarding /*Microsoft.Dynamics.CRM.crmbaseentity*/, target /*Microsoft.Dynamics.CRM.crmbaseentity*/) {
            this.TemplateId = templateId;
            this.Regarding = regarding;
            this.Target = target;
        }
        SendEmailFromTemplateRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "TemplateId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                    "Regarding": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5,
                    },
                    "Target": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5,
                    },
                },
                operationName: "SendEmailFromTemplate",
                operationType: 0,
            };
            return metadata;
        };
        return SendEmailFromTemplateRequest;
    }());
    CrmService.SendEmailFromTemplateRequest = SendEmailFromTemplateRequest;
})(CrmService || (CrmService = {}));
var CrmService;
(function (CrmService) {
    var InstantiateHtmlRequest = /** @class */ (function () {
        function InstantiateHtmlRequest(objectType, objectId, subjectHTML, bodyHTML) {
            this.ObjectType = objectType;
            this.ObjectId = objectId;
            this.SubjectHTML = subjectHTML;
            this.BodyHTML = bodyHTML;
        }
        InstantiateHtmlRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "ObjectType": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "ObjectId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                    "SubjectHTML": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "BodyHTML": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                },
                operationName: "InstantiateHtmlContent",
                operationType: 0,
            };
            return metadata;
        };
        return InstantiateHtmlRequest;
    }());
    CrmService.InstantiateHtmlRequest = InstantiateHtmlRequest;
})(CrmService || (CrmService = {}));
var CrmService;
(function (CrmService) {
    var SendEmailRequest = /** @class */ (function () {
        function SendEmailRequest(emailId, issueSend) {
            if (issueSend === void 0) { issueSend = true; }
            this.entity = { activityid: "{" + emailId.replace(/[{}]/g, "") + "}" };
            this.IssueSend = issueSend;
        }
        SendEmailRequest.prototype.getMetadata = function () {
            var emailIdClean = this.entity.activityid.replace(/[{}]/g, "");
            var metadata = {
                operationName: "emails(" + emailIdClean + ")/Microsoft.Dynamics.CRM.SendEmail",
                operationType: 0,
                boundParameter: "",
                parameterTypes: {
                    entity: {
                        typeName: "Microsoft.Dynamics.CRM.email",
                        structuralProperty: 5
                    },
                    IssueSend: {
                        typeName: "Edm.Boolean",
                        structuralProperty: 1
                    }
                }
            };
            return metadata;
        };
        return SendEmailRequest;
    }());
    CrmService.SendEmailRequest = SendEmailRequest;
})(CrmService || (CrmService = {}));
//# sourceMappingURL=msdynce_EmailTemplateLibrary.js.map