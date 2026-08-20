"""
This module provides the Mock XRM JavaScript bridge.
It exposes a Python object to the QJSEngine that mimics the D365 Client API.
"""
from PyQt6.QtCore import QObject, pyqtSlot, pyqtProperty
import logging

logger = logging.getLogger(__name__)

class MockAttribute(QObject):
    def __init__(self, name, widget, widget_type):
        super().__init__()
        self._name = name
        self._widget = widget
        self._type = widget_type

    @pyqtSlot(result=str)
    def getName(self):
        return self._name
        
    @pyqtSlot(result=str)
    def getValue(self):
        if self._type == "text":
            return self._widget.text()
        elif self._type == "picklist":
            return self._widget.currentData()
        # TODO: handle other types (boolean, datetime)
        return ""

    @pyqtSlot(str)
    def setValue(self, value):
        if self._type == "text":
            self._widget.setText(str(value))
        elif self._type == "picklist":
            idx = self._widget.findData(value)
            if idx >= 0:
                self._widget.setCurrentIndex(idx)

class MockControl(QObject):
    def __init__(self, name, widget):
        super().__init__()
        self._name = name
        self._widget = widget
        
    @pyqtSlot(result=str)
    def getName(self):
        return self._name

    @pyqtSlot(bool)
    def setVisible(self, is_visible):
        self._widget.setVisible(is_visible)

    @pyqtSlot(bool)
    def setDisabled(self, is_disabled):
        self._widget.setDisabled(is_disabled)

class MockControlsCollection(QObject):
    def __init__(self, controls_dict):
        super().__init__()
        self.controls = controls_dict
        
    @pyqtSlot(str, result=QObject)
    def get(self, name):
        return self.controls.get(name)

class MockUi(QObject):
    def __init__(self, controls_dict):
        super().__init__()
        self._controls = MockControlsCollection(controls_dict)
        
    @pyqtProperty(QObject)
    def controls(self):
        return self._controls

class MockFormContext(QObject):
    def __init__(self, attributes_dict, controls_dict):
        super().__init__()
        self.attributes = attributes_dict
        self._ui = MockUi(controls_dict)
        
    @pyqtSlot(str, result=QObject)
    def getAttribute(self, name):
        return self.attributes.get(name)

    @pyqtSlot(str, result=QObject)
    def getControl(self, name):
        return self._ui.controls.get(name)
        
    @pyqtProperty(QObject)
    def ui(self):
        return self._ui

class MockExecutionContext(QObject):
    def __init__(self, form_context):
        super().__init__()
        self._form_context = form_context
        
    @pyqtSlot(result=QObject)
    def getFormContext(self):
        return self._form_context

class XrmMock(QObject):
    def __init__(self, form_context):
        super().__init__()
        self._page = form_context
        
    @pyqtProperty(QObject)
    def Page(self):
        # Legacy Xrm.Page support
        return self._page