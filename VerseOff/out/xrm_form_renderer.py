import json
import xml.etree.ElementTree as ET
from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QScrollArea, QPushButton,
    QLabel, QLineEdit, QComboBox, QCheckBox, QGroupBox, QTabWidget,
    QMessageBox, QDateTimeEdit, QSpinBox, QDoubleSpinBox, QTableWidget, QTableWidgetItem
)
from PyQt6.QtCore import Qt, QDateTime, QObject, pyqtSlot, pyqtSignal, QUrl
from PyQt6.QtWebEngineWidgets import QWebEngineView
from PyQt6.QtWebChannel import QWebChannel
from db import LocalDatabase
import custom_events
import traceback
import uuid
import asyncio
import inspect

class LookupWidget(QWidget):
    textChanged = pyqtSignal(str)
    
    def __init__(self, renderer, target_entities, parent=None):
        super().__init__(parent)
        self.renderer = renderer
        self.target_entities = target_entities
        self.current_id = None
        self.current_logical_name = None
        
        layout = QHBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        
        self.line_edit = QLineEdit()
        self.line_edit.setReadOnly(True)
        self.line_edit.textChanged.connect(self.textChanged)
        
        self.search_btn = QPushButton("🔍")
        self.search_btn.setFixedWidth(30)
        self.search_btn.clicked.connect(self.open_lookup_dialog)
        
        layout.addWidget(self.line_edit)
        layout.addWidget(self.search_btn)
        
    def setText(self, text):
        self.line_edit.setText(text)
        
    def text(self):
        return self.line_edit.text()
        
    def open_lookup_dialog(self):
        from PyQt6.QtWidgets import QDialog, QVBoxLayout, QHBoxLayout, QLineEdit, QTableWidget, QTableWidgetItem
        dialog = QDialog(self)
        dialog.setWindowTitle("Lookup Record")
        dialog.setMinimumSize(500, 400)
        
        layout = QVBoxLayout(dialog)
        
        search_layout = QHBoxLayout()
        search_bar = QLineEdit()
        search_bar.setPlaceholderText("Quick Find Search...")
        search_layout.addWidget(search_bar)
        
        table = QTableWidget()
        table.setSelectionBehavior(QTableWidget.SelectionBehavior.SelectRows)
        table.setEditTriggers(QTableWidget.EditTrigger.NoEditTriggers)
        
        target_entity = self.target_entities[0] if self.target_entities else None
        if not target_entity:
            return
            
        def load_data(search_string=None):
            try:
                from view_parser import ViewParser
                with LocalDatabase().get_connection() as conn:
                    cursor = conn.cursor()
                    
                    if search_string:
                        cursor.execute("SELECT fetchxml, layoutxml FROM saved_queries WHERE returnedtypecode = ? AND querytype = 4", (target_entity,))
                        view_row = cursor.fetchone()
                        if not view_row:
                            cursor.execute("SELECT fetchxml, layoutxml FROM saved_queries WHERE returnedtypecode = ? AND querytype = 64", (target_entity,))
                            view_row = cursor.fetchone()
                    else:
                        cursor.execute("SELECT fetchxml, layoutxml FROM saved_queries WHERE returnedtypecode = ? AND querytype = 64", (target_entity,))
                        view_row = cursor.fetchone()
                    
                    columns = []
                    query_def = None
                    
                    if view_row:
                        columns = ViewParser.parse_layoutxml(view_row['layoutxml'])
                        query_def = ViewParser.parse_fetchxml(view_row['fetchxml'])
                    
                    if not columns:
                        columns = [{'name': f'{target_entity}id', 'label': 'ID'}, {'name': 'name', 'label': 'Name'}]
                    
                    primary_id_col = f"{target_entity}id"
                    
                    table.setColumnCount(len(columns))
                    table.setHorizontalHeaderLabels([c.get('label', c['name']) for c in columns])
                    
                    if query_def and query_def.get("entity") == target_entity:
                        sql, params = ViewParser.fetchxml_to_sql(query_def, search_string=search_string)
                        cursor.execute(sql, params)
                    else:
                        cursor.execute(f"SELECT * FROM {target_entity}")
                        
                    rows = cursor.fetchall()
                    table.setRowCount(len(rows))
                    
                    for i, row in enumerate(rows):
                        row_dict = dict(row)
                        rec_id = row_dict.get(primary_id_col, "")
                        for j, col in enumerate(columns):
                            val = str(row_dict.get(col['name'], ''))
                            item = QTableWidgetItem(val)
                            if j == 0:
                                item.setData(Qt.ItemDataRole.UserRole, rec_id)
                                display_name = str(row_dict.get('name', rec_id))
                                item.setData(Qt.ItemDataRole.UserRole + 1, display_name)
                            table.setItem(i, j, item)
            except Exception as e:
                print(f"Lookup error: {e}")
                
        search_bar.returnPressed.connect(lambda: load_data(search_bar.text().strip()))
        layout.addLayout(search_layout)
        layout.addWidget(table)
            
        def on_select(item):
            row = item.row()
            first_cell = table.item(row, 0)
            if first_cell:
                self.current_id = first_cell.data(Qt.ItemDataRole.UserRole)
                self.current_logical_name = target_entity
                display_name = first_cell.data(Qt.ItemDataRole.UserRole + 1)
                self.setText(display_name)
            dialog.accept()
            
        table.itemDoubleClicked.connect(on_select)
        
        load_data()
        dialog.exec()

class AssociatedGridWidget(QWidget):
    def __init__(self, target_entity, referencing_attribute, parent_renderer, parent=None):
        super().__init__(parent)
        self.target_entity = target_entity
        self.referencing_attribute = referencing_attribute
        self.parent_renderer = parent_renderer
        
        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        
        self.table = QTableWidget()
        self.table.setSelectionBehavior(QTableWidget.SelectionBehavior.SelectRows)
        self.table.setEditTriggers(QTableWidget.EditTrigger.NoEditTriggers)
        
        layout.addWidget(self.table)
        
    def refresh_data(self):
        parent_id = self.parent_renderer.record_id
        if not parent_id:
            return
            
        try:
            from view_parser import ViewParser
            from db import LocalDatabase
            with LocalDatabase().get_connection() as conn:
                cursor = conn.cursor()
                view_row = None
                try:
                    cursor.execute("SELECT fetchxml, layoutxml FROM saved_queries WHERE returnedtypecode = ? AND querytype = 2", (self.target_entity,))
                    view_row = cursor.fetchone()
                except Exception:
                    pass
                
                columns = []
                query_def = None
                
                if view_row:
                    columns = ViewParser.parse_layoutxml(view_row['layoutxml'])
                    query_def = ViewParser.parse_fetchxml(view_row['fetchxml'])
                
                if not columns:
                    columns = [{'name': f'{self.target_entity}id', 'label': 'ID'}, {'name': 'sync_status', 'label': 'Status'}]
                
                self.table.setColumnCount(len(columns))
                self.table.setHorizontalHeaderLabels([c.get('label', c['name']) for c in columns])
                
                if query_def and query_def.get("entity") == self.target_entity:
                    sql, params = ViewParser.fetchxml_to_sql(query_def, additional_filters={self.referencing_attribute: parent_id})
                    cursor.execute(sql, params)
                else:
                    cursor.execute(f"SELECT * FROM {self.target_entity} WHERE {self.referencing_attribute} = ?", (parent_id,))
                    
                rows = cursor.fetchall()
                self.table.setRowCount(len(rows))
                
                for i, row in enumerate(rows):
                    row_dict = dict(row)
                    for j, col in enumerate(columns):
                        val = str(row_dict.get(col['name'], ''))
                        self.table.setItem(i, j, QTableWidgetItem(val))
        except Exception as e:
            print(f"Associated Grid error: {e}")

class XrmNavigation:
    @staticmethod
    def openAlertDialog(alert_strings, alert_options=None):
        text = alert_strings.get("text", "")
        title = alert_strings.get("title", "Alert")
        
        msg = QMessageBox()
        msg.setIcon(QMessageBox.Icon.Information)
        msg.setWindowTitle(title)
        msg.setText(text)
        msg.exec()
        return True

    @staticmethod
    def openConfirmDialog(confirm_strings, confirm_options=None):
        text = confirm_strings.get("text", "")
        title = confirm_strings.get("title", "Confirm")
        subtitle = confirm_strings.get("subtitle", "")
        
        msg = QMessageBox()
        msg.setIcon(QMessageBox.Icon.Question)
        msg.setWindowTitle(title)
        msg.setText(f"{subtitle}\n\n{text}" if subtitle else text)
        msg.setStandardButtons(QMessageBox.StandardButton.Ok | QMessageBox.StandardButton.Cancel)
        result = msg.exec()
        return type("ConfirmResult", (), {"confirmed": result == QMessageBox.StandardButton.Ok})()

class XrmWebApi:
    @staticmethod
    def retrieveRecord(entity_logical_name, id, options=None):
        with LocalDatabase().get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(f"SELECT data_json FROM {entity_logical_name} WHERE id = ?", (id,))
            row = cursor.fetchone()
            if row:
                return json.loads(row[0])
            raise Exception(f"Record {id} not found in {entity_logical_name}.")

    @staticmethod
    def retrieveMultipleRecords(entity_logical_name, options=None):
        with LocalDatabase().get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(f"SELECT data_json FROM {entity_logical_name}")
            rows = cursor.fetchall()
            entities = [json.loads(r[0]) for r in rows]
            return type("RetrieveMultipleResult", (), {"entities": entities})()

    @staticmethod
    def createRecord(entity_logical_name, data):
        new_id = str(uuid.uuid4())
        with LocalDatabase().get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(f"INSERT INTO {entity_logical_name} (id, data_json, sync_status) VALUES (?, ?, 'PENDING')",
                           (new_id, json.dumps(data)))
            conn.commit()
        return type("CreateResult", (), {"id": new_id, "entityType": entity_logical_name})()

    @staticmethod
    def updateRecord(entity_logical_name, id, data):
        with LocalDatabase().get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(f"SELECT data_json FROM {entity_logical_name} WHERE id = ?", (id,))
            row = cursor.fetchone()
            if not row:
                raise Exception("Record not found.")
            existing = json.loads(row[0])
            existing.update(data)
            
            cursor.execute(f"UPDATE {entity_logical_name} SET data_json = ?, sync_status = 'PENDING' WHERE id = ?",
                           (json.dumps(existing), id))
            conn.commit()
        return type("UpdateResult", (), {"id": id, "entityType": entity_logical_name})()

class PythonGlobalContext:
    def __init__(self):
        self.client = type("Client", (), {
            "getClient": lambda: "Mobile",
            "getClientState": lambda: "Offline",
            "getFormFactor": lambda: 3
        })()
        self.userSettings = type("UserSettings", (), {
            "userId": "{00000000-0000-0000-0000-000000000000}",
            "userName": "Offline User",
            "languageId": 1033,
            "securityRoles": []
        })()
        self.organizationSettings = type("OrganizationSettings", (), {
            "organizationId": "{00000000-0000-0000-0000-000000000000}",
            "uniqueName": "offline_org",
            "languageId": 1033,
            "baseCurrencyId": "{00000000-0000-0000-0000-000000000000}"
        })()

    def getClientUrl(self):
        return "https://offline.localhost"
        
    def getCurrentAppName(self):
        return "VerseOff Offline App"
        
    def getVersion(self):
        return "1.0.0"
        
    def getIsAdmin(self):
        return True

class XrmUtility:
    def __init__(self):
        self._global_context = PythonGlobalContext()
        
    def getGlobalContext(self):
        return self._global_context

class GlobalXrm:
    def __init__(self):
        self.Navigation = XrmNavigation()
        self.WebApi = XrmWebApi()
        self.Utility = XrmUtility()

# Expose globally so executed scripts can just use `Xrm.Navigation...`
import builtins
builtins.Xrm = GlobalXrm()

class SaveEventArgs:
    def __init__(self, save_mode=1, entity_reference=None, is_save_success=False, save_error_info=None):
        self._prevent_default = False
        self._prevent_default_on_error = False
        self._disable_async_timeout = False
        self._save_mode = save_mode
        self._entity_reference = entity_reference
        self._is_save_success = is_save_success
        self._save_error_info = save_error_info
        
    def preventDefault(self):
        self._prevent_default = True
        
    def preventDefaultOnError(self):
        self._prevent_default_on_error = True
        
    def isDefaultPrevented(self):
        return self._prevent_default
        
    def getSaveMode(self):
        return self._save_mode

    def disableAsyncTimeout(self):
        self._disable_async_timeout = True
        
    def getEntityReference(self):
        return self._entity_reference

    def getIsSaveSuccess(self):
        return self._is_save_success

    def getSaveErrorInfo(self):
        return self._save_error_info

class PythonExecutionContext:
    def __init__(self, form_context, event_source=None, event_args=None, shared_vars=None):
        self._form_context = form_context
        self._event_source = event_source
        self._event_args = event_args
        self._shared_vars = shared_vars if shared_vars is not None else {}
        self._depth = 1

    def getFormContext(self):
        return self._form_context

    def getEventSource(self):
        return self._event_source

    def getEventArgs(self):
        return self._event_args

    def getSharedVariable(self, key):
        return self._shared_vars.get(key)

    def setSharedVariable(self, key, value):
        self._shared_vars[key] = value

    def getContext(self):
        return builtins.Xrm.Utility.getGlobalContext()
        
    def getDepth(self):
        return self._depth

class PythonCollection:
    """Mock of a Dataverse Collection, supporting .forEach, .get(name), and .get(index)."""
    def __init__(self, items_dict=None, items_list=None):
        self._dict = items_dict if items_dict is not None else {}
        self._list = items_list if items_list is not None else list(self._dict.values())
        
    def get(self, name_or_index=None):
        if name_or_index is None:
            return self._list
        if callable(name_or_index):
            return [item for index, item in enumerate(self._list) if name_or_index(item, index)]
        if isinstance(name_or_index, int):
            if 0 <= name_or_index < len(self._list):
                return self._list[name_or_index]
            return None
        return self._dict.get(name_or_index)
        
    def getLength(self):
        return len(self._list)
        
    def forEach(self, func):
        for index, item in enumerate(self._list):
            func(item, index)

class PythonAttribute:
    def __init__(self, name, widget, renderer):
        self.name = name
        self.widget = widget
        self._renderer = renderer

    def getName(self):
        return self.name

    @property
    def controls(self):
        """Returns a PythonCollection containing the PythonControl mapped to this attribute."""
        if hasattr(self._renderer, "form_context"):
            ctrl = self._renderer.form_context.getControl(self.name)
            if ctrl:
                return PythonCollection(items_list=[ctrl])
        return PythonCollection(items_list=[])

    def addOnChange(self, func):
        self._renderer.register_dynamic_event("onchange", self.name, func)

    def removeOnChange(self, func):
        self._renderer.unregister_dynamic_event("onchange", self.name, func)

    def fireOnChange(self):
        """Programmatically triggers the OnChange event handlers for this attribute."""
        self._renderer._fire_events("onchange", self.name)

    def getValue(self):
        if isinstance(self.widget, QLineEdit):
            return self.widget.text()
        elif isinstance(self.widget, QCheckBox):
            return self.widget.isChecked()
        elif isinstance(self.widget, QComboBox):
            return self.widget.currentData()
        elif isinstance(self.widget, QSpinBox) or isinstance(self.widget, QDoubleSpinBox):
            return self.widget.value()
        elif isinstance(self.widget, LookupWidget):
            if self.widget.current_id:
                return [{"id": self.widget.current_id, "name": self.widget.text(), "entityType": self.widget.current_logical_name}]
            return None
        return None

    def setValue(self, val):
        if isinstance(self.widget, QLineEdit):
            self.widget.setText(str(val))
        elif isinstance(self.widget, QCheckBox):
            self.widget.setChecked(bool(val))
        elif isinstance(self.widget, QComboBox):
            idx = self.widget.findData(val)
            if idx >= 0:
                self.widget.setCurrentIndex(idx)
        elif isinstance(self.widget, QSpinBox) or isinstance(self.widget, QDoubleSpinBox):
            try:
                self.widget.setValue(float(val))
            except ValueError:
                pass
        elif isinstance(self.widget, LookupWidget):
            if val and isinstance(val, list) and len(val) > 0:
                self.widget.current_id = val[0].get("id")
                self.widget.current_logical_name = val[0].get("entityType")
                self.widget.setText(val[0].get("name", ""))
            else:
                self.widget.current_id = None
                self.widget.setText("")
        
        self.widget._is_dirty = True

    def getAttributeType(self):
        if isinstance(self.widget, QLineEdit): return "string"
        elif isinstance(self.widget, QCheckBox): return "boolean"
        elif isinstance(self.widget, QComboBox): return "optionset"
        elif isinstance(self.widget, QSpinBox): return "integer"
        elif isinstance(self.widget, QDoubleSpinBox): return "double"
        elif "Lookup" in type(self.widget).__name__: return "lookup"
        return "string"

    def getFormat(self):
        if isinstance(self.widget, QLineEdit): return "text"
        return "none"

    def getInitialValue(self):
        return getattr(self.widget, "_initial_value", None)

    def getIsDirty(self):
        return getattr(self.widget, "_is_dirty", False)

    def getIsPartyList(self):
        return getattr(self.widget, "_is_party_list", False)

    def getMax(self):
        if isinstance(self.widget, (QSpinBox, QDoubleSpinBox)):
            return self.widget.maximum()
        return None

    def getMin(self):
        if isinstance(self.widget, (QSpinBox, QDoubleSpinBox)):
            return self.widget.minimum()
        return None

    def getMaxLength(self):
        if isinstance(self.widget, QLineEdit):
            # In PyQt, if it's not set, it defaults to 32767
            return self.widget.maxLength()
        return None

    def getOptions(self):
        if isinstance(self.widget, QComboBox):
            opts = []
            for i in range(self.widget.count()):
                opts.append({"text": self.widget.itemText(i), "value": self.widget.itemData(i)})
            return opts
        return []

    def getOption(self, value_or_string):
        for opt in self.getOptions():
            if opt["value"] == value_or_string or opt["text"] == value_or_string:
                return opt
        return None

    def getSelectedOption(self):
        if isinstance(self.widget, QComboBox):
            idx = self.widget.currentIndex()
            if idx >= 0:
                return {"text": self.widget.itemText(idx), "value": self.widget.itemData(idx)}
        return None

    def getText(self):
        if isinstance(self.widget, QComboBox):
            idx = self.widget.currentIndex()
            if idx >= 0:
                return self.widget.itemText(idx)
        return None

    def getPrecision(self):
        if isinstance(self.widget, QDoubleSpinBox):
            return self.widget.decimals()
        elif isinstance(self.widget, QSpinBox):
            return 0
        return None

    def setPrecision(self, value: int):
        if isinstance(self.widget, QDoubleSpinBox):
            self.widget.setDecimals(value)

    def getParent(self):
        if hasattr(self._renderer, "form_context"):
            return self._renderer.form_context.data.entity
        return None

    def getUserPrivilege(self):
        return {"canRead": True, "canUpdate": True, "canCreate": True}

    def isValid(self):
        return getattr(self.widget, "_is_valid", True)

    def setIsValid(self, is_valid: bool, message: str = ""):
        self.widget._is_valid = is_valid
        if not is_valid and hasattr(self._renderer, "set_form_notification"):
            self._renderer.set_form_notification(message, "ERROR", f"attr_valid_{self.name}")
        elif is_valid and hasattr(self._renderer, "clear_form_notification"):
            self._renderer.clear_form_notification(f"attr_valid_{self.name}")

    def getRequiredLevel(self):
        return getattr(self.widget, "_required_level", "none")

    def setRequiredLevel(self, level: str):
        self.widget._required_level = level

    def getSubmitMode(self):
        return getattr(self.widget, "_submit_mode", "dirty")

    def setSubmitMode(self, mode: str):
        self.widget._submit_mode = mode

class PythonControl:
    def __init__(self, name, widget, label_widget, renderer):
        self.name = name
        self.widget = widget
        self.label_widget = label_widget
        self._renderer = renderer

    def getName(self):
        return self.name

    def getLabel(self):
        return self.label_widget.text() if self.label_widget else ""

    def setLabel(self, text):
        if self.label_widget:
            self.label_widget.setText(text)

    def getDisabled(self):
        return not self.widget.isEnabled()

    def setDisabled(self, disabled: bool):
        self.widget.setEnabled(not disabled)
        if self.label_widget:
            self.label_widget.setEnabled(not disabled)

    def getVisible(self):
        return not self.widget.isHidden()

    def setVisible(self, visible: bool):
        self.widget.setHidden(not visible)
        if self.label_widget:
            self.label_widget.setHidden(not visible)

    def setFocus(self):
        self.widget.setFocus()

    def getAttribute(self):
        if hasattr(self._renderer, "form_context"):
            return self._renderer.form_context.getAttribute(self.name)
        return None

    def getControlType(self):
        if isinstance(self.widget, QLineEdit): return "standard"
        elif isinstance(self.widget, QCheckBox): return "standard"
        elif isinstance(self.widget, QComboBox): return "optionset"
        elif isinstance(self.widget, QSpinBox): return "standard"
        elif isinstance(self.widget, QDoubleSpinBox): return "standard"
        elif "Lookup" in type(self.widget).__name__: return "lookup"
        elif isinstance(self.widget, QTableWidget): return "subgrid"
        return "standard"

    def setNotification(self, message, uniqueId):
        self._renderer.set_form_notification(message, "ERROR", f"ctrl_{self.name}_{uniqueId}")

    def addNotification(self, notification_obj: dict):
        uniqueId = notification_obj.get("uniqueId", "default")
        level = notification_obj.get("notificationLevel", "ERROR")
        messages = notification_obj.get("messages", [])
        if messages:
            self._renderer.set_form_notification(messages[0], level, f"ctrl_{self.name}_{uniqueId}")

    def clearNotification(self, uniqueId):
        self._renderer.clear_form_notification(f"ctrl_{self.name}_{uniqueId}")

    def addEventHandler(self, event_name, func):
        self._renderer.register_dynamic_event(event_name.lower(), self.name, func)

    def removeEventHandler(self, event_name, func):
        self._renderer.unregister_dynamic_event(event_name.lower(), self.name, func)

    def addOnOutputChange(self, func):
        self._renderer.register_dynamic_event("onoutputchange", self.name, func)

    def removeOnOutputChange(self, func):
        self._renderer.unregister_dynamic_event("onoutputchange", self.name, func)

    def addOnReadyStateComplete(self, func):
        self._renderer.register_dynamic_event("onreadystatecomplete", self.name, func)

    def removeOnReadyStateComplete(self, func):
        self._renderer.unregister_dynamic_event("onreadystatecomplete", self.name, func)

    def addOnResultOpened(self, func):
        self._renderer.register_dynamic_event("onresultopened", self.name, func)

    def removeOnResultOpened(self, func):
        self._renderer.unregister_dynamic_event("onresultopened", self.name, func)

    def addOnSelection(self, func):
        self._renderer.register_dynamic_event("onselection", self.name, func)

    def removeOnSelection(self, func):
        self._renderer.unregister_dynamic_event("onselection", self.name, func)

    def addOnPostSearch(self, func):
        self._renderer.register_dynamic_event("onpostsearch", self.name, func)

    def removeOnPostSearch(self, func):
        self._renderer.unregister_dynamic_event("onpostsearch", self.name, func)

    def getOutputs(self):
        return getattr(self.widget, "_pcf_outputs", {})

    def getSearchQuery(self):
        return getattr(self.widget, "_kb_search_query", "")

    def setSearchQuery(self, query: str):
        self.widget._kb_search_query = query

    def getSelectedResults(self):
        return getattr(self.widget, "_kb_selected_results", [])

    def openSearchResult(self, resultNumber: int, mode: str = "Inline"):
        if hasattr(self.widget, "openSearchResult"):
            self.widget.openSearchResult(resultNumber, mode)
        else:
            print(f"[KnowledgeBase] Opening result {resultNumber} in {mode} mode.")

    def refresh(self):
        if hasattr(self.widget, "refresh"):
            self.widget.refresh()

    def getTotalResultCount(self):
        return getattr(self.widget, "_kb_total_results", 0)

    def getValue(self):
        widget_type = str(type(self.widget))
        if "QLineEdit" in widget_type:
            return self.widget.text()
        elif "QComboBox" in widget_type:
            return self.widget.currentData()
        elif "QCheckBox" in widget_type:
            return self.widget.isChecked()
        elif "QDateTimeEdit" in widget_type:
            return self.widget.dateTime().toPyDateTime()
        elif "QSpinBox" in widget_type or "QDoubleSpinBox" in widget_type:
            return self.widget.value()
        return None

    def getState(self):
        return getattr(self.widget, "_control_state", 1)

    def getShowTime(self):
        return getattr(self.widget, "_show_time", False)

    def setShowTime(self, show_time: bool):
        self.widget._show_time = show_time
        if "QDateTimeEdit" in str(type(self.widget)):
            if show_time:
                self.widget.setDisplayFormat("MM/dd/yyyy hh:mm a")
            else:
                self.widget.setDisplayFormat("MM/dd/yyyy")

    def getParent(self):
        if hasattr(self._renderer, "form_context"):
            tabs = self._renderer.form_context.ui.tabs
            found_sec = None
            def check_tab(tab, _):
                nonlocal found_sec
                def check_sec(sec, _):
                    nonlocal found_sec
                    if sec.controls.get(self.name) is not None:
                        found_sec = sec
                tab.sections.forEach(check_sec)
            tabs.forEach(check_tab)
            return found_sec
        return None

class PythonProcess:
    def __init__(self, renderer):
        self._renderer = renderer
        
    def addOnProcessStatusChange(self, func):
        self._renderer.register_dynamic_event("onprocessstatuschange", None, func)
        
    def removeOnProcessStatusChange(self, func):
        self._renderer.unregister_dynamic_event("onprocessstatuschange", None, func)

    def addOnPreProcessStatusChange(self, func):
        self._renderer.register_dynamic_event("onpreprocessstatuschange", None, func)
        
    def removeOnPreProcessStatusChange(self, func):
        self._renderer.unregister_dynamic_event("onpreprocessstatuschange", None, func)

    def addOnPreStageChange(self, func):
        self._renderer.register_dynamic_event("onprestagechange", None, func)
        
    def removeOnPreStageChange(self, func):
        self._renderer.unregister_dynamic_event("onprestagechange", None, func)

    def addOnStageChange(self, func):
        self._renderer.register_dynamic_event("onstagechange", None, func)
        
    def removeOnStageChange(self, func):
        self._renderer.unregister_dynamic_event("onstagechange", None, func)

    def addOnStageSelected(self, func):
        self._renderer.register_dynamic_event("onstageselected", None, func)
        
    def removeOnStageSelected(self, func):
        self._renderer.unregister_dynamic_event("onstageselected", None, func)

class PythonGridEntity:
    def __init__(self, entity_name, record_id, primary_val):
        self.entity_name = entity_name
        self.record_id = record_id
        self.primary_val = primary_val

    def getEntityName(self):
        return self.entity_name

    def getEntityReference(self):
        return {
            "entityType": self.entity_name,
            "id": self.record_id,
            "name": self.primary_val
        }

    def getPrimaryAttributeValue(self):
        return self.primary_val

class PythonGridRowData:
    def __init__(self, entity):
        self._entity = entity

    def getEntity(self):
        return self._entity

class PythonGridRow:
    def __init__(self, row_data):
        self._data = row_data

    def getData(self):
        return self._data

class PythonGrid:
    def __init__(self, table_widget):
        self.table_widget = table_widget
        
        # Build mock data based on UI (MVP)
        rows_dict = {}
        for row_idx in range(self.table_widget.rowCount()):
            # Mocking extracting data from the table
            entity_name = "mock_entity"
            record_id = f"mock-uuid-{row_idx}"
            primary_val = self.table_widget.item(row_idx, 0).text() if self.table_widget.item(row_idx, 0) else f"Row {row_idx}"
            
            ent = PythonGridEntity(entity_name, record_id, primary_val)
            row_data = PythonGridRowData(ent)
            rows_dict[str(row_idx)] = PythonGridRow(row_data)
            
        self.rows_collection = PythonCollection(items_dict=rows_dict)

    def getRows(self):
        return self.rows_collection

    def getSelectedRows(self):
        # In a real scenario, map PyQt selectedIndexes to our collection. 
        # For MVP, return all rows as "selected" if requested
        return self.rows_collection

    def getTotalRecordCount(self):
        return self.table_widget.rowCount()

class PythonGridControl(PythonControl):
    def __init__(self, name, widget, label_widget, renderer):
        super().__init__(name, widget, label_widget, renderer)
        self._grid = PythonGrid(self.widget)

    def getGrid(self):
        return self._grid

    def addOnChange(self, func):
        self._renderer.register_dynamic_event("onchange", self.name, func)

    def removeOnChange(self, func):
        self._renderer.unregister_dynamic_event("onchange", self.name, func)

    def addOnRecordSelect(self, func):
        self._renderer.register_dynamic_event("onrecordselect", self.name, func)

    def removeOnRecordSelect(self, func):
        self._renderer.unregister_dynamic_event("onrecordselect", self.name, func)

    def addOnSave(self, func):
        self._renderer.register_dynamic_event("gridonsave", self.name, func)

    def removeOnSave(self, func):
        self._renderer.unregister_dynamic_event("gridonsave", self.name, func)

    def addOnLoad(self, func):
        self._renderer.register_dynamic_event("gridonload", self.name, func)

    def removeOnLoad(self, func):
        self._renderer.unregister_dynamic_event("gridonload", self.name, func)

class PythonLookupControl(PythonControl):
    def __init__(self, name, widget, label_widget, renderer):
        super().__init__(name, widget, label_widget, renderer)
        # Offline representation of dynamic lookup filters
        self.widget._custom_filters = []

    def addOnLookupTagClick(self, func):
        self._renderer.register_dynamic_event("onlookuptagclick", self.name, func)

    def removeOnLookupTagClick(self, func):
        self._renderer.unregister_dynamic_event("onlookuptagclick", self.name, func)

    def addPreSearch(self, func):
        self._renderer.register_dynamic_event("presearch", self.name, func)

    def removePreSearch(self, func):
        self._renderer.unregister_dynamic_event("presearch", self.name, func)

    def addCustomFilter(self, fetch_xml_filter, entity_logical_name=None):
        # We append this to the widget's internal filter list so the popup dialog can evaluate it
        self.widget._custom_filters.append({
            "filter": fetch_xml_filter,
            "entity": entity_logical_name
        })

    def addCustomView(self, view_id, entity_name, view_display_name, fetch_xml, layout_xml, is_default):
        if not hasattr(self.widget, "_custom_views"):
            self.widget._custom_views = []
        self.widget._custom_views.append({
            "viewId": view_id,
            "entityName": entity_name,
            "viewDisplayName": view_display_name,
            "fetchXml": fetch_xml,
            "layoutXml": layout_xml,
            "isDefault": is_default
        })

    def getDefaultView(self):
        return getattr(self.widget, "_default_view", "")

    def setDefaultView(self, view_id: str):
        self.widget._default_view = view_id

    def getEntityTypes(self):
        return getattr(self.widget, "_entity_types", [])

    def setEntityTypes(self, entity_logical_names: list):
        self.widget._entity_types = entity_logical_names

class PythonOptionSetControl(PythonControl):
    def addOption(self, option_obj, index=None):
        if isinstance(self.widget, QComboBox):
            text = option_obj.get("text", "")
            value = option_obj.get("value", None)
            if index is not None and index >= 0 and index <= self.widget.count():
                self.widget.insertItem(index, text, userData=value)
            else:
                self.widget.addItem(text, userData=value)

    def clearOptions(self):
        if isinstance(self.widget, QComboBox):
            self.widget.clear()

    def removeOption(self, value):
        if isinstance(self.widget, QComboBox):
            idx = self.widget.findData(value)
            if idx >= 0:
                self.widget.removeItem(idx)

    def getOptions(self):
        opts = []
        if isinstance(self.widget, QComboBox):
            for i in range(self.widget.count()):
                opts.append({"text": self.widget.itemText(i), "value": self.widget.itemData(i)})
        return opts

class PythonIFrameControl(PythonControl):
    def __init__(self, name, widget, label_widget, renderer):
        super().__init__(name, widget, label_widget, renderer)
        self._custom_data = ""

    def getContentWindow(self):
        # In PyQt, QWebEngineView acts as the frame.
        # We return the page object which allows running javascript natively against the DOM.
        if "QWebEngineView" in str(type(self.widget)):
            return self.widget.page()
        return None

    def getData(self):
        return self._custom_data

    def setData(self, value: str):
        self._custom_data = value

    def getInitialUrl(self):
        return getattr(self.widget, "_initial_url", "")

    def getObject(self):
        return self.widget

    def getSrc(self):
        if hasattr(self.widget, "url"):
            return self.widget.url().toString()
        return ""

    def setSrc(self, url: str):
        if hasattr(self.widget, "setUrl"):
            from PyQt6.QtCore import QUrl
            self.widget.setUrl(QUrl(url))

class PythonSection:
    def __init__(self, name, label, groupbox, controls_dict):
        self.name = name
        self._label = label
        self.groupbox = groupbox
        self.controls = PythonCollection(items_dict=controls_dict)
        
    def getName(self):
        return self.name
        
    def getLabel(self):
        return self._label
        
    def setLabel(self, label):
        if self.groupbox:
            self.groupbox.setTitle(label)
        self._label = label

    def getParent(self):
        return type("MockParent", (), {"getName": lambda: "tab"})()

    def getVisible(self):
        if self.groupbox:
            return self.groupbox.isVisible()
        return True
        
    def setVisible(self, is_visible):
        if self.groupbox:
            self.groupbox.setVisible(is_visible)

class PythonTab:
    def __init__(self, name, label, tab_widget, tab_index, sections_dict, renderer):
        self.name = name
        self._label = label
        self.tab_widget = tab_widget
        self.tab_index = tab_index
        self.sections = PythonCollection(items_dict=sections_dict)
        self._renderer = renderer
        
    def getName(self):
        return self.name
        
    def getLabel(self):
        return self._label

    def getVisible(self):
        if self.tab_widget:
            return self.tab_widget.isTabVisible(self.tab_index)
        return True
        
    def setVisible(self, is_visible):
        if self.tab_widget:
            self.tab_widget.setTabVisible(self.tab_index, is_visible)

    def setLabel(self, label):
        if self.tab_widget:
            self.tab_widget.setTabText(self.tab_index, label)
        self._label = label

    def getParent(self):
        return type("MockParent", (), {"getName": lambda: "ui"})()

    def getDisplayState(self):
        return "expanded"

    def setDisplayState(self, state):
        pass

    def setFocus(self):
        if self.tab_widget:
            self.tab_widget.setCurrentIndex(self.tab_index)

    def getContentType(self):
        return getattr(self, "_content_type", "data")

    def setContentType(self, contentType):
        self._content_type = contentType

    def addTabStateChange(self, func):
        self._renderer.register_dynamic_event("tabstatechange", self.name, func)

    def removeTabStateChange(self, func):
        self._renderer.unregister_dynamic_event("tabstatechange", self.name, func)

class PythonUIContext:
    def __init__(self, renderer):
        self._renderer = renderer
        
        # Build global controls collection
        ctrls_dict = {}
        for name, widget in self._renderer.controls.items():
            lbl = self._renderer.control_labels.get(name)
            
            # Identify Lookup Controls based on metadata
            attr_meta = next((a for a in self._renderer.entity_def.get("attributes", []) if a["LogicalName"] == name), None)
            is_lookup = attr_meta.get("AttributeType") == "Lookup" if attr_meta else False

            if isinstance(widget, QTableWidget):
                ctrls_dict[name] = PythonGridControl(name, widget, lbl, self._renderer)
            elif is_lookup:
                ctrls_dict[name] = PythonLookupControl(name, widget, lbl, self._renderer)
            elif isinstance(widget, QComboBox):
                ctrls_dict[name] = PythonOptionSetControl(name, widget, lbl, self._renderer)
            elif "QWebEngineView" in str(type(widget)):
                ctrls_dict[name] = PythonIFrameControl(name, widget, lbl, self._renderer)
            else:
                ctrls_dict[name] = PythonControl(name, widget, lbl, self._renderer)
        self.controls = PythonCollection(items_dict=ctrls_dict)
        
        # Build tabs hierarchy
        tabs_dict = {}
        for tab_name, tab_data in self._renderer.ui_hierarchy.get("tabs", {}).items():
            sections_dict = {}
            for sec_name, sec_data in tab_data.get("sections", {}).items():
                sec_ctrls = { c_name: ctrls_dict[c_name] for c_name in sec_data.get("controls", []) if c_name in ctrls_dict }
                sections_dict[sec_name] = PythonSection(sec_name, sec_data["label"], sec_data["groupbox"], sec_ctrls)
            
            tabs_dict[tab_name] = PythonTab(tab_name, tab_data["label"], self._renderer.tab_widget, tab_data["index"], sections_dict, self._renderer)
        self.tabs = PythonCollection(items_dict=tabs_dict)

        # Mock remaining UI collections
        mock_form_item = type("FormItem", (), {
            "getId": lambda: "mock-form-1",
            "getLabel": lambda: "Offline Form",
            "navigate": lambda: None,
            "getVisible": lambda: True,
            "setVisible": lambda visible: None
        })()
        self.formSelector = type("FormSelector", (), {
            "items": PythonCollection(items_list=[mock_form_item]),
            "getCurrentItem": lambda: mock_form_item
        })()
        
        mock_nav_item = type("NavigationItem", (), {
            "getId": lambda: "mock-nav-1",
            "getLabel": lambda: "Offline Navigation",
            "setLabel": lambda label: None,
            "getVisible": lambda: True,
            "setVisible": lambda visible: None,
            "setFocus": lambda: None
        })()
        
        self.navigation = type("Navigation", (), {
            "items": PythonCollection(items_list=[mock_nav_item])
        })()
        
        self.process = type("UIProcess", (), {
            "getDisplayState": lambda: "expanded",
            "setDisplayState": lambda state: None,
            "getVisible": lambda: True,
            "setVisible": lambda visible: None,
            "reflow": lambda: None
        })()
        
        self.headerSection = type("HeaderSection", (), {
            "getBodyVisible": lambda: True,
            "setBodyVisible": lambda visible: None,
            "getCommandBarVisible": lambda: True,
            "setCommandBarVisible": lambda visible: None,
            "getTabNavigatorVisible": lambda: True,
            "setTabNavigatorVisible": lambda visible: None
        })()
        
        mock_quick_form = type("QuickViewControl", (), {
            "getControl": lambda name: None,
            "getControlType": lambda: "quickform",
            "getDisabled": lambda: False,
            "getLabel": lambda: "Mock Quick View",
            "getName": lambda: "mock_quick_view",
            "getParent": lambda: None,
            "getVisible": lambda: True,
            "isLoaded": lambda: True,
            "refresh": lambda: None,
            "setDisabled": lambda disabled: None,
            "setFocus": lambda: None,
            "setLabel": lambda label: None,
            "setVisible": lambda visible: None
        })()
        
        self.quickForms = PythonCollection(items_list=[mock_quick_form])

    def addOnLoad(self, func):
        self._renderer.register_dynamic_event("onload", None, func)

    def removeOnLoad(self, func):
        self._renderer.unregister_dynamic_event("onload", None, func)
        
    def addLoaded(self, func):
        self._renderer.register_dynamic_event("formloaded", None, func)

    def removeLoaded(self, func):
        self._renderer.unregister_dynamic_event("formloaded", None, func)

    def setFormNotification(self, message, level, uniqueId):
        self._renderer.set_form_notification(message, level, uniqueId)

    def clearFormNotification(self, uniqueId):
        self._renderer.clear_form_notification(uniqueId)
        
    def close(self):
        self._renderer.close()
        
    def refreshRibbon(self):
        self._renderer.evaluate_ribbon_rules()
        
    def getFormType(self):
        # 1 = Create, 2 = Update
        return 2 if self._renderer.record_id else 1

    def getViewPortHeight(self):
        return getattr(self._renderer, "height", lambda: 1080)()

    def getViewPortWidth(self):
        return getattr(self._renderer, "width", lambda: 1920)()

class PythonProcessStep:
    def __init__(self, name, required, attribute_name):
        self._name = name
        self._required = required
        self._attribute_name = attribute_name

    def getAttribute(self):
        return self._attribute_name

    def getName(self):
        return self._name

    def isRequired(self):
        return self._required

    def getProgress(self):
        return getattr(self, "_progress", 0)

    def setProgress(self, stepProgress, message=""):
        self._progress = stepProgress
        return "success"

class PythonProcessStage:
    def __init__(self, stage_id, name, status, category, steps_list, entity_name):
        self._id = stage_id
        self._name = name
        self._status = status
        self._category = category
        self._steps = PythonCollection(items_list=steps_list)
        self._entity_name = entity_name

    def getCategory(self):
        return self._category

    def getEntityName(self):
        return self._entity_name

    def getId(self):
        return self._id

    def getName(self):
        return self._name

    def getStatus(self):
        return self._status

    def getSteps(self):
        return self._steps

    def getNavigationBehavior(self):
        return type("NavigationBehavior", (), {
            "allowCreateNew": lambda: False
        })()

class PythonProcessInstance:
    def __init__(self, process_id, name, stages_list, is_rendered):
        self._id = process_id
        self._name = name
        self._stages = PythonCollection(items_list=stages_list)
        self._is_rendered = is_rendered

    def getId(self):
        return self._id

    def getName(self):
        return self._name

    def getStages(self):
        return self._stages

    def isRendered(self):
        return self._is_rendered

class PythonProcess:
    def __init__(self, renderer):
        self._renderer = renderer
        
        # Build mock hierarchy
        mock_step = PythonProcessStep("Mock Step", False, "mock_attribute")
        self._mock_stage = PythonProcessStage("mock-stage-1", "Offline Stage", "active", 0, [mock_step], renderer.logical_name)
        self._mock_process = PythonProcessInstance("mock-process-1", "Offline Flow", [self._mock_stage], True)
        
        self._active_process = self._mock_process
        self._active_stage = self._mock_stage
        self._status = "active"

    def getActiveProcess(self):
        return self._active_process

    def setActiveProcess(self, process_id, callback=None):
        if callback:
            callback("success")

    def getActivePath(self):
        return self._active_process.getStages()

    def getActiveStage(self):
        return self._active_stage

    def getSelectedStage(self):
        # In our offline mock, we just return the active stage since there is no UI ribbon to select other stages
        return self._active_stage

    def setActiveStage(self, stage_id, callback=None):
        if callback:
            callback("success")

    def getEnabledProcesses(self, callback):
        callback({self._active_process.getId(): self._active_process.getName()})

    def getProcessInstances(self, callback):
        callback({self._active_process.getId(): self._active_process.getName()})

    def setActiveProcessInstance(self, process_instance_id, callback=None):
        if callback:
            callback("success")

    def getInstanceId(self):
        return "mock-instance-1"

    def getInstanceName(self):
        return self._active_process.getName()

    def getStatus(self):
        return self._status

    def setStatus(self, status, callback=None):
        self._status = status
        if callback:
            callback("success")

    def moveNext(self, callback=None):
        if callback:
            callback("success")

    def movePrevious(self, callback=None):
        if callback:
            callback("success")

    def addOnStageChange(self, func):
        self._renderer.register_dynamic_event("onstagechange", None, func)

    def removeOnStageChange(self, func):
        self._renderer.unregister_dynamic_event("onstagechange", None, func)

    def addOnStageSelected(self, func):
        self._renderer.register_dynamic_event("onstageselected", None, func)

    def removeOnStageSelected(self, func):
        self._renderer.unregister_dynamic_event("onstageselected", None, func)

    def addOnPreProcessStatusChange(self, func):
        self._renderer.register_dynamic_event("onpreprocessstatuschange", None, func)

    def removeOnPreProcessStatusChange(self, func):
        self._renderer.unregister_dynamic_event("onpreprocessstatuschange", None, func)

    def addOnPreStageChange(self, func):
        self._renderer.register_dynamic_event("onprestagechange", None, func)

    def removeOnPreStageChange(self, func):
        self._renderer.unregister_dynamic_event("onprestagechange", None, func)

    def addOnProcessStatusChange(self, func):
        self._renderer.register_dynamic_event("onprocessstatuschange", None, func)

    def removeOnProcessStatusChange(self, func):
        self._renderer.unregister_dynamic_event("onprocessstatuschange", None, func)

class PythonFormContext:
    """Mock of the D365 formContext API."""
    def __init__(self, renderer):
        self._renderer = renderer
        
        # Build data.entity
        attrs_dict = {}
        for name, widget in self._renderer.controls.items():
            attrs_dict[name] = PythonAttribute(name, widget, self._renderer)
            
        entity_obj = type("Entity", (), {
            "attributes": PythonCollection(items_dict=attrs_dict),
            "save": self._renderer.save_record,
            "getId": lambda: self._renderer.record_id,
            "getEntityName": lambda: self._renderer.logical_name,
            "addOnSave": lambda func: self._renderer.register_dynamic_event("onsave", None, func),
            "removeOnSave": lambda func: self._renderer.unregister_dynamic_event("onsave", None, func),
            "addOnPostSave": lambda func: self._renderer.register_dynamic_event("postsave", None, func),
            "removeOnPostSave": lambda func: self._renderer.unregister_dynamic_event("postsave", None, func),
            "getDataXml": lambda: "<xml>Mock XML representing offline SQLite row</xml>",
            "getEntityReference": lambda: {"entityType": self._renderer.logical_name, "id": self._renderer.record_id, "name": "Offline Record"},
            "getIsDirty": lambda: any([a.getIsDirty() for a in attrs_dict.values()]),
            "getPrimaryAttributeValue": lambda: "Mock Primary Name Value",
            "isValid": lambda: all([a.isValid() for a in attrs_dict.values()])
        })
        self.data = type("Data", (), {
            "entity": entity_obj,
            "process": PythonProcess(self._renderer),
            "attributes": PythonCollection(items_dict=attrs_dict), # Shortcut
            "addOnLoad": lambda func: self._renderer.register_dynamic_event("dataonload", None, func),
            "removeOnLoad": lambda func: self._renderer.unregister_dynamic_event("dataonload", None, func),
            "refresh": self._renderer.refresh_data,
            "save": lambda saveOptions=None: self._renderer.save_record(),
            "isValid": lambda: all([a.isValid() for a in attrs_dict.values()]),
            "getIsDirty": lambda: any([a.getIsDirty() for a in attrs_dict.values()])
        })()
        
        # Build ui namespace
        self.ui = PythonUIContext(self._renderer)
        
        # Attach back to renderer so attributes can fetch their UI controls
        self._renderer.form_context = self
        
    def getAttribute(self, logical_name):
        return self.data.entity.attributes.get(logical_name)

    def getControl(self, logical_name):
        return self.ui.controls.get(logical_name)

class VerseOffBridge(QObject):
    def __init__(self, renderer):
        super().__init__()
        self.renderer = renderer

    @pyqtSlot(str, str)
    def updateFieldFromJS(self, field_name, value):
        # Update PyQt widget without triggering a loop back to JS
        if field_name in self.renderer.controls:
            widget = self.renderer.controls[field_name]
            widget.blockSignals(True)
            if isinstance(widget, QLineEdit):
                widget.setText(value)
            elif isinstance(widget, QComboBox):
                idx = widget.findData(value)
                if idx >= 0:
                    widget.setCurrentIndex(idx)
            elif isinstance(widget, QCheckBox):
                widget.setChecked(str(value).lower() == "true")
            widget.blockSignals(False)

    @pyqtSlot()
    def triggerSaveFromJS(self):
        self.renderer.save_record()

    @pyqtSlot(str, bool)
    def setControlVisibleFromJS(self, control_name, is_visible):
        if control_name in self.renderer.controls:
            self.renderer.controls[control_name].setVisible(is_visible)
            if control_name in self.renderer.control_labels:
                self.renderer.control_labels[control_name].setVisible(is_visible)

    @pyqtSlot(str, bool)
    def setControlDisabledFromJS(self, control_name, is_disabled):
        if control_name in self.renderer.controls:
            self.renderer.controls[control_name].setDisabled(is_disabled)

    @pyqtSlot(str, str, str)
    def setFormNotificationFromJS(self, msg, level, id):
        self.renderer.set_form_notification(msg, level, id)

    @pyqtSlot(str)
    def clearFormNotificationFromJS(self, id):
        self.renderer.clear_form_notification(id)

    @pyqtSlot(str)
    def showAlertFromJS(self, msg):
        from PyQt6.QtWidgets import QMessageBox
        QMessageBox.information(self.renderer, "Dataverse Alert", msg)

    @pyqtSlot(str, result=bool)
    def showConfirmFromJS(self, msg):
        from PyQt6.QtWidgets import QMessageBox
        reply = QMessageBox.question(self.renderer, "Dataverse Confirm", msg, QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No)
        return reply == QMessageBox.StandardButton.Yes

    @pyqtSlot(str)
    def showErrorFromJS(self, msg):
        from PyQt6.QtWidgets import QMessageBox
        QMessageBox.critical(self.renderer, "Dataverse Error", msg)

    @pyqtSlot(str, str)
    def openFileFromJS(self, file_name, file_content_base64):
        import tempfile
        import os
        import base64
        import subprocess
        import sys
        
        try:
            temp_dir = tempfile.gettempdir()
            file_path = os.path.join(temp_dir, file_name)
            
            with open(file_path, "wb") as f:
                f.write(base64.b64decode(file_content_base64))
                
            if os.name == 'nt':
                os.startfile(file_path)
            else:
                subprocess.call(('open' if sys.platform == 'darwin' else 'xdg-open', file_path))
        except Exception as e:
            from PyQt6.QtWidgets import QMessageBox
            QMessageBox.critical(self.renderer, "File Error", f"Failed to open file natively: {e}")

    @pyqtSlot(str, str)
    def openFormFromJS(self, entity_name, record_id):
        try:
            if not hasattr(self.renderer, "child_forms"):
                self.renderer.child_forms = []
                
            new_form = XrmFormRenderer(
                manifest_data=self.renderer.manifest_data,
                logical_name=entity_name,
                record_id=record_id if record_id else None
            )
            new_form.show()
            self.renderer.child_forms.append(new_form)
        except Exception as e:
            from PyQt6.QtWidgets import QMessageBox
            QMessageBox.critical(self.renderer, "Error", f"Failed to open form: {e}")

    @pyqtSlot(str)
    def openUrlFromJS(self, url):
        import webbrowser
        try:
            webbrowser.open(url)
        except Exception as e:
            from PyQt6.QtWidgets import QMessageBox
            QMessageBox.critical(self.renderer, "URL Error", f"Failed to open URL natively: {e}")

    @pyqtSlot(str, str)
    def openWebResourceFromJS(self, web_resource_name, data):
        from PyQt6.QtWidgets import QMessageBox
        QMessageBox.information(
            self.renderer, 
            "Dataverse Web Resource", 
            f"Mocking Web Resource Dialog\n\nName: {web_resource_name}\nData: {data}"
        )

    @pyqtSlot(str, str)
    def loadPanelFromJS(self, url, title):
        from PyQt6.QtWidgets import QMessageBox
        QMessageBox.information(
            self.renderer, 
            "Xrm.Panel", 
            f"Mocking Panel Load\n\nTitle: {title}\nURL: {url}"
        )

    @pyqtSlot(str)
    def showProgressFromJS(self, msg):
        print(f"Xrm.Utility Progress: {msg}")

    @pyqtSlot()
    def closeProgressFromJS(self):
        print("Xrm.Utility Progress Closed")

    @pyqtSlot(str, result=str)
    def lookupObjectsFromJS(self, entity_types):
        import json
        mock_selection = [{"id": "{1234}", "name": "Mock Selection", "entityType": entity_types.split(",")[0] if entity_types else "account"}]
        return json.dumps(mock_selection)

    @pyqtSlot(str, result=str)
    def getEntityMetadataFromJS(self, entity_name):
        import json
        from db import LocalDatabase
        try:
            with LocalDatabase().get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT metadata FROM entity_metadata WHERE logical_name = ?", (entity_name,))
                row = cursor.fetchone()
                if row and row[0]:
                    return row[0]
        except Exception as e:
            print(f"Error fetching metadata from JS bridge: {e}")
        return "{}"

    @pyqtSlot(str, str, result=str)
    def getEntityMainFormDescriptorFromJS(self, entity_name, form_id):
        import json
        from db import LocalDatabase
        try:
            with LocalDatabase().get_connection() as conn:
                cursor = conn.cursor()
                if form_id:
                    cursor.execute("SELECT parsed_ui_hints FROM form_metadata_cache WHERE form_id = ?", (form_id,))
                else:
                    cursor.execute("SELECT parsed_ui_hints FROM form_metadata_cache WHERE entity_name = ?", (entity_name,))
                row = cursor.fetchone()
                if row and row[0]:
                    return row[0]
        except Exception as e:
            print(f"Error fetching form descriptor from JS bridge: {e}")
        return "{}"

    @pyqtSlot(str)
    def refreshParentGridFromJS(self, options_str):
        print(f"Xrm.Utility: refreshParentGrid called with options: {options_str}")

    @pyqtSlot(str, str, result=str)
    def webApiCreateFromJS(self, entity_name, data_json):
        import uuid
        import json
        from db import LocalDatabase
        try:
            record_id = str(uuid.uuid4())
            with LocalDatabase().get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO cached_records (id, entity_name, data_json, sync_status) VALUES (?, ?, ?, ?)",
                    (record_id, entity_name, data_json, 'pending')
                )
            return json.dumps({"id": record_id, "entityType": entity_name})
        except Exception as e:
            print(f"Error in webApiCreate: {e}")
            return json.dumps({"error": str(e)})

    @pyqtSlot(str, str, str, result=str)
    def webApiRetrieveFromJS(self, entity_name, record_id, options):
        import json
        from db import LocalDatabase
        try:
            with LocalDatabase().get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT data_json FROM cached_records WHERE id = ?", (record_id.replace('{', '').replace('}', ''),))
                row = cursor.fetchone()
                if row:
                    return row[0]
            return json.dumps({"error": "Record not found"})
        except Exception as e:
            return json.dumps({"error": str(e)})

    @pyqtSlot(str, str, str, result=str)
    def webApiUpdateFromJS(self, entity_name, record_id, data_json):
        import json
        from db import LocalDatabase
        try:
            clean_id = record_id.replace('{', '').replace('}', '')
            with LocalDatabase().get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT data_json FROM cached_records WHERE id = ?", (clean_id,))
                row = cursor.fetchone()
                if row:
                    existing_data = json.loads(row[0])
                    new_data = json.loads(data_json)
                    existing_data.update(new_data)
                    merged_json = json.dumps(existing_data)
                    cursor.execute(
                        "UPDATE cached_records SET data_json = ?, sync_status = 'pending' WHERE id = ?",
                        (merged_json, clean_id)
                    )
                    return json.dumps({"id": clean_id, "entityType": entity_name})
            return json.dumps({"error": "Record not found"})
        except Exception as e:
            return json.dumps({"error": str(e)})

    @pyqtSlot(str, str, result=str)
    def webApiDeleteFromJS(self, entity_name, record_id):
        import json
        from db import LocalDatabase
        try:
            clean_id = record_id.replace('{', '').replace('}', '')
            with LocalDatabase().get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("DELETE FROM cached_records WHERE id = ?", (clean_id,))
            return json.dumps({"id": clean_id, "entityType": entity_name, "deleted": True})
        except Exception as e:
            return json.dumps({"error": str(e)})

    @pyqtSlot(str, str, result=str)
    def webApiRetrieveMultipleFromJS(self, entity_name, options):
        import json
        from db import LocalDatabase
        try:
            with LocalDatabase().get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT data_json FROM cached_records WHERE entity_name = ?", (entity_name,))
                rows = cursor.fetchall()
                results = [json.loads(row[0]) for row in rows]
                return json.dumps({"entities": results})
        except Exception as e:
            return json.dumps({"error": str(e)})

    @pyqtSlot(str, str)
    def navigateToFromJS(self, page_type, entity_name):
        from PyQt6.QtWidgets import QMessageBox
        QMessageBox.information(self.renderer, "Xrm.Navigation", f"Mocking navigation to {page_type}: {entity_name}")

class XrmFormRenderer(QWidget):
    def __init__(self, manifest_data: dict, logical_name: str, record_id: str = None, parent=None, form_id: str = None, is_quick_view: bool = False, on_close=None):
        super().__init__(parent)
        self.manifest = manifest_data
        self.logical_name = logical_name
        self.record_id = record_id
        self.form_events = custom_events
        self.form_id = form_id
        self.is_quick_view = is_quick_view
        self.on_close = on_close
        
        self.entity_def = next((e for e in self.manifest.get("entities", []) if e.get("LogicalName") == logical_name), None)
        if not self.entity_def:
            raise ValueError(f"Entity {logical_name} not found in manifest.")
            
        self.primary_id_attr = self.entity_def.get("primary_id", "id")
        
        self.controls = {} # Stores references to the generated PyQt widgets
        self.control_labels = {} # Stores references to the PyQt QLabel widgets
        self.ui_hierarchy = {"tabs": {}} # Stores the tree of Tabs -> Sections -> Controls
        self.tab_widget = None # Will store the QTabWidget
        self.ribbon_widgets = [] # Stores { "widget": QPushButton, "data": btn_data }

        self.notifications = {} # Stores uniqueId -> QLabel
        
        # Event Registries
        self._form_events_map = {"onload": [], "onsave": [], "onchange": []}
        self._dynamic_events_map = {"onload": [], "onsave": [], "onchange": {}, "postsave": [], "dataonload": [], "tabstatechange": {}, "formloaded": []}
        self.shared_variables = {} # For Execution Context shared variables

        # Build UI
        self.init_ui()
        
        # Init QWebEngineView and bridge
        self.init_browser_bridge()
        
        # Evaluate ribbon initial state
        self.evaluate_ribbon_rules()
        
        # Run custom post_load hook
        self._run_post_load()

    def init_browser_bridge(self):
        self.browser = QWebEngineView()
        self.channel = QWebChannel()
        self.bridge = VerseOffBridge(self)
        self.channel.registerObject("pyBridge", self.bridge)
        self.browser.page().setWebChannel(self.channel)
        
        # Load an empty page with qwebchannel.js and our mock
        import tempfile
        import os
        html_content = """
        <html>
        <head>
            <script src="qrc:///qtwebchannel/qwebchannel.js"></script>
            <script src="file:///{bridge_path}"></script>
            <script>
                new QWebChannel(qt.webChannelTransport, function(channel) {
                    window.pyBridge = channel.objects.pyBridge;
                    console.log("Bridge connected");
                    
                    // Fire OnLoad once connected
                    if (window.pendingOnLoads) {
                        window.pendingOnLoads.forEach(f => f());
                    }
                });
            </script>
        </head>
        <body>VerseOff Invisible Bridge Engine</body>
        </html>
        """
        bridge_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "verseoff_bridge.js")).replace("\\", "/")
        fd, temp_path = tempfile.mkstemp(suffix=".html")
        with os.fdopen(fd, "w") as f:
            f.write(html_content.replace("{bridge_path}", bridge_path))
            
        self.browser.setUrl(QUrl.fromLocalFile(temp_path))

    def handle_close(self):
        if self.on_close:
            self.on_close()
        else:
            self.close()

    def save_and_close(self):
        self.save_record()
        self.handle_close()

    def save_and_new(self):
        self.save_record()
        # Reset form for new record
        self.record_id = None
        for name, widget in self.controls.items():
            if hasattr(widget, "clear"):
                widget.clear()
            elif isinstance(widget, QCheckBox):
                widget.setChecked(False)

    def init_ui(self):
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(6)
        
        disp_name = self.entity_def.get("DisplayName", {}).get("UserLocalizedLabel", {}).get("Label") or self.entity_def.get("display_name") or self.logical_name.capitalize()
        self.setWindowTitle(f"{disp_name} - Dynamics 365")
        
        # --- Top Breadcrumb / Record Title & Command Bar Container ---
        top_bar = QWidget()
        top_bar.setStyleSheet("background-color: #ffffff; border-bottom: 1px solid #e1dfdd; padding: 6px 10px;")
        top_bar_layout = QVBoxLayout(top_bar)
        top_bar_layout.setContentsMargins(0, 0, 0, 0)
        top_bar_layout.setSpacing(4)
        
        # Breadcrumb row
        breadcrumb_row = QHBoxLayout()
        back_btn = QPushButton(f"←  Back to {disp_name}s")
        back_btn.setStyleSheet("background: transparent; border: none; color: #0f6cbd; font-weight: 600; font-size: 13px; padding: 2px 6px;")
        back_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        back_btn.clicked.connect(self.handle_close)
        
        rec_title = QLabel(f"<b>{disp_name}</b>: <span style='color: #605e5c;'>{'New Record' if not self.record_id else self.record_id[:8] + '...'}</span>")
        rec_title.setStyleSheet("font-size: 14px; color: #201f1e;")
        
        breadcrumb_row.addWidget(back_btn)
        breadcrumb_row.addWidget(QLabel("|"))
        breadcrumb_row.addWidget(rec_title)
        breadcrumb_row.addStretch()
        top_bar_layout.addLayout(breadcrumb_row)
        
        # Command Bar (Ribbon)
        cmd_layout = QHBoxLayout()
        cmd_layout.setContentsMargins(0, 4, 0, 0)
        cmd_layout.setSpacing(6)
        
        # Standard primary buttons
        save_btn = QPushButton("💾  Save")
        save_btn.setStyleSheet("background-color: #0f6cbd; color: white; font-weight: 600; padding: 6px 14px; border-radius: 4px; border: 1px solid #0f6cbd;")
        save_btn.clicked.connect(self.save_record)
        cmd_layout.addWidget(save_btn)
        
        save_close_btn = QPushButton("💾  Save & Close")
        save_close_btn.setStyleSheet("background-color: #ffffff; border: 1px solid #d1d1d1; font-weight: 500; padding: 6px 12px; border-radius: 4px;")
        save_close_btn.clicked.connect(self.save_and_close)
        cmd_layout.addWidget(save_close_btn)
        
        save_new_btn = QPushButton("＋  Save & New")
        save_new_btn.setStyleSheet("background-color: #ffffff; border: 1px solid #d1d1d1; font-weight: 500; padding: 6px 12px; border-radius: 4px;")
        save_new_btn.clicked.connect(self.save_and_new)
        cmd_layout.addWidget(save_new_btn)
        
        delete_btn = QPushButton("🗑  Delete")
        delete_btn.setStyleSheet("background-color: #ffffff; border: 1px solid #d1d1d1; font-weight: 500; padding: 6px 12px; border-radius: 4px;")
        delete_btn.clicked.connect(self.handle_close)
        cmd_layout.addWidget(delete_btn)
        
        refresh_btn = QPushButton("↻  Refresh")
        refresh_btn.setStyleSheet("background-color: #ffffff; border: 1px solid #d1d1d1; font-weight: 500; padding: 6px 12px; border-radius: 4px;")
        refresh_btn.clicked.connect(lambda: self.load_data() if self.record_id else None)
        cmd_layout.addWidget(refresh_btn)
        
        cmd_layout.addStretch()
        top_bar_layout.addLayout(cmd_layout)
        main_layout.addWidget(top_bar)

        # --- Notifications Bar ---
        self.notifications_layout = QVBoxLayout()
        main_layout.addLayout(self.notifications_layout)

        # --- Business Process Flow (BPF) ---
        bpf_layout = self._create_bpf_ui()
        if bpf_layout:
            main_layout.addLayout(bpf_layout)
            
        # --- Form Header (Metrics) ---
        self.header_layout = QHBoxLayout()
        self.header_layout.addStretch() # Right-align the header fields
        main_layout.addLayout(self.header_layout)

        # --- Form Body ---
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        form_container = QWidget()
        self.form_layout = QVBoxLayout()

        # Parse FormXML
        forms = self.entity_def.get("forms", [])
        if forms and forms[0].get("formxml"):
            # Try to parse the raw FormXML string if available
            self._render_from_xml(forms[0].get("formxml"))
        else:
            # Fallback to the pre-parsed JSON structure if formxml isn't raw
            self._render_from_json(forms[0])
            
        # Hook Ribbon ValueRules to widget signals for real-time evaluation
        for item in self.ribbon_widgets:
            rules = item["data"].get("display_rules", []) + item["data"].get("enable_rules", [])
            for rule in rules:
                if rule.get("type") == "ValueRule" and rule.get("field"):
                    field = rule.get("field")
                    if field in self.controls:
                        ctrl = self.controls[field]
                        if isinstance(ctrl, QLineEdit):
                            ctrl.textChanged.connect(lambda _, f=field: self.evaluate_ribbon_rules())
                        elif isinstance(ctrl, QComboBox):
                            ctrl.currentIndexChanged.connect(lambda _, f=field: self.evaluate_ribbon_rules())
                        elif isinstance(ctrl, QCheckBox):
                            ctrl.stateChanged.connect(lambda _, f=field: self.evaluate_ribbon_rules())
                        elif isinstance(ctrl, QSpinBox) or isinstance(ctrl, QDoubleSpinBox):
                            ctrl.valueChanged.connect(lambda _, f=field: self.evaluate_ribbon_rules())

        form_container.setLayout(self.form_layout)
        scroll.setWidget(form_container)
        main_layout.addWidget(scroll)

        self.setLayout(main_layout)

    def _render_from_xml(self, formxml_str: str):
        """Parses D365 FormXML at runtime to build the UI."""
        try:
            root = ET.fromstring(formxml_str)
            
            # --- Render Header ---
            header_node = root.find(".//header/tabs")
            if header_node is not None:
                for cell in header_node.findall(".//cell"):
                    control_elem = cell.find("control")
                    if control_elem is not None:
                        data_field = control_elem.get("datafieldname")
                        class_id = control_elem.get("classid")
                        ctrl_label = self._get_label_from_xml(cell.find("labels")) or data_field
                        
                        if data_field:
                            # Header fields are stacked vertically (Label over Value)
                            field_layout = QVBoxLayout()
                            lbl = QLabel(f"<small style='color: #605e5c;'>{ctrl_label}</small>")
                            widget = self._create_widget_for_field(data_field, class_id, control_elem=control_elem)
                            widget.setEnabled(False) # Header fields read-only for MVP
                            widget.setStyleSheet("border: none; background: transparent; font-weight: bold; font-size: 14px;")
                            self.controls[data_field] = widget
                            
                            field_layout.addWidget(lbl)
                            field_layout.addWidget(widget)
                            self.header_layout.addLayout(field_layout)
                            
                            # Add vertical separator line
                            vline = QLabel("|")
                            vline.setStyleSheet("color: #c8c6c4; margin-left: 10px; margin-right: 10px;")
                            self.header_layout.addWidget(vline)

            # --- Render Body ---
            # D365 FormXML stores tabs directly under <form>, NOT under a <body> wrapper
            body_node = root.find(".//body/tabs")
            if body_node is None:
                # Fallback: tabs directly under <form> root (standard D365 layout)
                body_node = root.find("tabs")
            if body_node is None:
                # Last resort: search anywhere
                body_node = root.find(".//tabs")
            if body_node is None:
                self.form_layout.addWidget(QLabel("No body tabs found in FormXML"))
                return

            # Fetch form metadata (if form_id is specified, try to find that specific form, otherwise fallback to main)
            forms = self.entity_def.get("forms", [])
            form_def = None
            if self.form_id:
                form_def = next((f for f in forms if f["formid"] == self.form_id), None)
            
            if not form_def:
                form_def = forms[0] if forms else None
                
            if not form_def:
                self.form_layout.addWidget(QLabel(f"No forms defined for entity {self.logical_name}."))
                return

            xml_content = form_def.get("formxmlmanaged") or form_def.get("formxml")
            self.tab_widget = QTabWidget()
            self.tab_widget.setStyleSheet("""
                QTabWidget::pane {
                    border: none;
                    background-color: transparent;
                }
                QTabBar::tab {
                    background: transparent;
                    border: none;
                    border-bottom: 3px solid transparent;
                    padding: 8px 18px;
                    font-weight: 600;
                    font-size: 13px;
                    color: #605e5c;
                }
                QTabBar::tab:selected {
                    color: #0f6cbd;
                    border-bottom: 3px solid #0f6cbd;
                }
                QTabBar::tab:hover:!selected {
                    color: #201f1e;
                    background-color: #f3f2f1;
                    border-radius: 4px 4px 0 0;
                }
            """)
            tab_index_counter = 0
            
            for tab_elem in body_node.findall("tab"):
                tab_name = tab_elem.get("name", f"tab_{tab_index_counter}")
                tab_label = self._get_label_from_xml(tab_elem.find("labels")) or tab_name
                tab_page = QWidget()
                tab_layout = QVBoxLayout(tab_page)
                tab_layout.setContentsMargins(6, 10, 6, 10)
                tab_layout.setSpacing(12)
                
                self.ui_hierarchy["tabs"][tab_name] = {
                    "label": tab_label,
                    "index": tab_index_counter,
                    "sections": {}
                }
                
                # Sections
                columns_node = tab_elem.find("columns")
                if columns_node is not None:
                    for column_elem in columns_node.findall("column"):
                        sections_node = column_elem.find("sections")
                        if sections_node is not None:
                            for section_elem in sections_node.findall("section"):
                                sec_name = section_elem.get("name", "section_auto")
                                sec_label = self._get_label_from_xml(section_elem.find("labels")) or sec_name
                                group_box = QGroupBox(sec_label.upper())
                                group_box.setStyleSheet("""
                                    QGroupBox {
                                        background-color: #ffffff;
                                        border: 1px solid #e1dfdd;
                                        border-radius: 6px;
                                        margin-top: 14px;
                                        font-weight: 700;
                                        font-size: 11px;
                                        color: #605e5c;
                                        padding: 14px 12px 10px 12px;
                                    }
                                    QGroupBox::title {
                                        subcontrol-origin: margin;
                                        subcontrol-position: top left;
                                        padding: 0 6px;
                                        left: 12px;
                                        background-color: #f8f9fa;
                                    }
                                """)
                                group_layout = QVBoxLayout()
                                group_layout.setContentsMargins(8, 8, 8, 8)
                                group_layout.setSpacing(8)
                                
                                sec_controls_list = []
                                self.ui_hierarchy["tabs"][tab_name]["sections"][sec_name] = {
                                    "label": sec_label,
                                    "groupbox": group_box,
                                    "controls": sec_controls_list
                                }
                                
                                rows_node = section_elem.find("rows")
                                if rows_node is not None:
                                    for row_elem in rows_node.findall("row"):
                                        row_layout = QHBoxLayout()
                                        row_layout.setSpacing(10)
                                        for cell_elem in row_elem.findall("cell"):
                                            control_elem = cell_elem.find("control")
                                            if control_elem is not None:
                                                data_field = control_elem.get("datafieldname") or control_elem.get("id")
                                                class_id = control_elem.get("classid")
                                                ctrl_label = self._get_label_from_xml(cell_elem.find("labels")) or data_field
                                                
                                                if data_field:
                                                    lbl_widget = QLabel(ctrl_label)
                                                    lbl_widget.setFixedWidth(130)
                                                    lbl_widget.setStyleSheet("color: #605e5c; font-weight: 500;")
                                                    row_layout.addWidget(lbl_widget)
                                                    self.control_labels[data_field] = lbl_widget
                                                    
                                                    target_entity = None
                                                    view_id = None
                                                    quick_form_id = None
                                                    if class_id and class_id.lower() == "{e7a81278-8635-4d9e-8d4d-59480b391c5b}":
                                                        params_node = control_elem.find("parameters")
                                                        if params_node is not None:
                                                            target_elem = params_node.find("TargetEntityType")
                                                            if target_elem is not None:
                                                                target_entity = target_elem.text
                                                            view_elem = params_node.find("ViewId")
                                                            if view_elem is not None:
                                                                view_id = view_elem.text
                                                    elif class_id and class_id.lower() == "{5c5600e0-1d6e-4205-a272-be80da87fd42}":
                                                        # Quick View
                                                        params_node = control_elem.find("parameters")
                                                        if params_node is not None:
                                                            qforms_node = params_node.find("QuickForms")
                                                            if qforms_node is not None and qforms_node.text:
                                                                try:
                                                                    qf_root = ET.fromstring(qforms_node.text)
                                                                    qf_id_elem = qf_root.find(".//QuickFormId")
                                                                    if qf_id_elem is not None:
                                                                        quick_form_id = qf_id_elem.text
                                                                        target_entity = qf_id_elem.get("entityname")
                                                                except: pass
                                                        
                                                        if not target_entity and data_field:
                                                            targets = self.entity_def.get("lookup_targets", {}).get(data_field, [])
                                                            if targets: target_entity = targets[0]

                                                    widget = self._create_widget_for_field(data_field, class_id, target_entity=target_entity, view_id=view_id, quick_form_id=quick_form_id, control_elem=control_elem)
                                                    self.controls[data_field] = widget
                                                    row_layout.addWidget(widget)
                                                    sec_controls_list.append(data_field)
                                                    
                                        group_layout.addLayout(row_layout)
                                        
                                group_box.setLayout(group_layout)
                                tab_layout.addWidget(group_box)
                                
                tab_layout.addStretch()
                self.tab_widget.addTab(tab_page, tab_label)
                tab_index_counter += 1
                
            # Add "Related" tab
            related_tab = QWidget()
            related_layout = QVBoxLayout(related_tab)
            
            related_tabs = QTabWidget()
            relationships = self.entity_def.get("relationships", {}).get("one_to_many", [])
            
            self.associated_grids = []
            if relationships:
                for rel in relationships:
                    target_entity = rel.get("ReferencingEntity")
                    ref_attr = rel.get("ReferencingAttribute")
                    if not target_entity or not ref_attr: continue
                    
                    sub_tab = QWidget()
                    sub_layout = QVBoxLayout(sub_tab)
                    
                    grid = AssociatedGridWidget(target_entity, ref_attr, self)
                    self.associated_grids.append(grid)
                    sub_layout.addWidget(grid)
                    
                    related_tabs.addTab(sub_tab, target_entity.capitalize())
                    
                related_layout.addWidget(related_tabs)
                self.tab_widget.addTab(related_tab, "Related")
                
            self.tab_widget.currentChanged.connect(self._on_tab_changed)
            self.form_layout.addWidget(self.tab_widget)
            
            # --- Parse Form Events (OnLoad, OnSave, OnChange) ---
            events_node = root.find(".//events")
            if events_node is not None:
                for evt in events_node.findall("event"):
                    evt_name = evt.get("name", "").lower()
                    for handler in evt.findall(".//Handler"):
                        self._form_events_map.setdefault(evt_name, []).append({
                            "function": handler.get("functionName"),
                            "library": handler.get("libraryName"),
                            "pass_context": handler.get("passExecutionContext", "false").lower() == "true",
                            "control": evt.get("attribute") # For OnChange events
                        })
            
            # Wire up PyQt Signals for OnChange events
            for field_name, widget in self.controls.items():
                if isinstance(widget, QLineEdit):
                    widget.editingFinished.connect(lambda f=field_name: self._fire_events("onchange", f))
                elif isinstance(widget, QComboBox):
                    widget.currentIndexChanged.connect(lambda _, f=field_name: self._fire_events("onchange", f))
                elif isinstance(widget, QCheckBox):
                    widget.stateChanged.connect(lambda _, f=field_name: self._fire_events("onchange", f))
                elif isinstance(widget, QSpinBox) or isinstance(widget, QDoubleSpinBox):
                    widget.editingFinished.connect(lambda f=field_name: self._fire_events("onchange", f))
                elif isinstance(widget, QTableWidget):
                    widget.cellChanged.connect(lambda r, c, f=field_name: self._fire_events("onchange", f))
                    widget.itemSelectionChanged.connect(lambda f=field_name: self._fire_events("onrecordselect", f))
                    widget.currentCellChanged.connect(
                        lambda curr_r, curr_c, prev_r, prev_c, f=field_name: 
                            self._fire_events("gridonsave", f) if curr_r != prev_r and prev_r >= 0 else None
                    )

            # Load Data
            if self.record_id:
                self.load_data()
                
        except Exception as e:
            self.form_layout.addWidget(QLabel(f"Error parsing FormXML: {e}"))

    def _create_bpf_ui(self) -> QHBoxLayout:
        """Dynamically renders the BPF chevron progress bar if an active BPF exists."""
        # Find if any BPF applies to this entity
        bpfs = self.manifest.get("bpfs", {})
        active_bpf = None
        for bpf_name, bpf_def in bpfs.items():
            if bpf_def.get("primary_entity") == self.logical_name:
                active_bpf = bpf_def
                break
                
        if not active_bpf:
            return None
            
        bpf_layout = QHBoxLayout()
        bpf_layout.setContentsMargins(0, 10, 0, 10)
        bpf_layout.setSpacing(0)
        
        # In a real scenario, we'd query the specific BPF table (e.g. leadtoopportunitysalesprocess) 
        # to find the active stage. For this engine MVP, we render all stages linearly.
        stages = active_bpf.get("stages", [])
        
        for idx, stage in enumerate(stages):
            btn = QPushButton(f"{stage.get('name', 'Stage')} ")
            # Styling to simulate a chevron
            btn.setStyleSheet("""
                QPushButton {
                    background-color: #f3f2f1;
                    border: 1px solid #c8c6c4;
                    padding: 8px 15px;
                    margin: 0px;
                    border-radius: 0px;
                    font-weight: bold;
                    color: #323130;
                }
                QPushButton:hover { background-color: #e1dfdd; }
            """)
            
            # If this stage belongs to a different entity, show a visual indicator
            if stage.get("entity") != self.logical_name:
                btn.setText(f"{btn.text()} ({stage.get('entity')})")
                btn.setStyleSheet(btn.styleSheet().replace("color: #323130;", "color: #0078d4;"))
                
            btn.clicked.connect(lambda _, s=stage.get('name'): self._fire_events("onstageselected", s))
            bpf_layout.addWidget(btn)
            
            # Add chevron separator except for last item
            if idx < len(stages) - 1:
                sep = QLabel(" > ")
                sep.setStyleSheet("font-weight: bold; color: #a19f9d; padding: 0px 5px;")
                bpf_layout.addWidget(sep)
                
        bpf_layout.addStretch()
        return bpf_layout

    def _render_from_json(self, form_dict: dict):
        """Fallback to simple JSON structure if XML isn't available."""
        tab_widget = QTabWidget()
        for tab in form_dict.get("tabs", []):
            tab_page = QWidget()
            tab_layout = QVBoxLayout(tab_page)
            for section in tab.get("sections", []):
                group_box = QGroupBox(section.get("label", "Section"))
                group_layout = QVBoxLayout()
                for control in section.get("controls", []):
                    attr_name = control.get("attribute")
                    if not attr_name: continue
                    
                    row = QHBoxLayout()
                    row.addWidget(QLabel(f"{control.get('label')}:"))
                    widget = self._create_widget_for_field(attr_name, "")
                    self.controls[attr_name] = widget
                    row.addWidget(widget)
                    group_layout.addLayout(row)
                group_box.setLayout(group_layout)
                tab_layout.addWidget(group_box)
            tab_layout.addStretch()
            tab_widget.addTab(tab_page, tab.get("label", "Tab"))
        self.form_layout.addWidget(tab_widget)
        
        if self.record_id:
            self.load_data()

    def _get_label_from_xml(self, labels_node):
        if labels_node is not None:
            label_elem = labels_node.find("label")
            if label_elem is not None:
                return label_elem.get("description")
        return None

    def _create_widget_for_field(self, field_name: str, class_id: str, target_entity: str = None, view_id: str = None, quick_form_id: str = None, control_elem=None) -> QWidget:
        # Detect Web Resources
        if class_id and class_id.lower() == "{fd2a7985-3187-444e-a0e2-63b716fbd9d7}":
            browser = QWebEngineView()
            wr_url = ""
            if control_elem is not None:
                params_node = control_elem.find("parameters")
                if params_node is not None:
                    url_elem = params_node.find("Url")
                    if url_elem is not None and url_elem.text:
                        wr_url = url_elem.text
                        
            if wr_url:
                # Mock local rendering of the web resource. Note: For offline use, 
                # we would map this to the locally downloaded .js/.html file
                browser.setHtml(f"<html><body><h4>Web Resource: {wr_url}</h4></body></html>")
            else:
                browser.setHtml("<html><body><h4>Web Resource</h4></body></html>")
            
            # Mount the Xrm Object!
            browser.page().setWebChannel(self.channel)
            return browser
            
        # Detect PCF Custom Controls (Translation Registry)
        if control_elem is not None:
            custom_ctrl = control_node = control_elem.find(".//customControl")
            if custom_ctrl is not None:
                pcf_name = custom_ctrl.get("name", "")
                PCF_MAP = {
                    "MscrmControls.FieldControls.ToggleControl": QCheckBox(),
                    "MscrmControls.Slider.SliderControl": QSpinBox(),
                    "MscrmControls.OptionSet.OptionSetControl": QComboBox(),
                    "MscrmControls.FieldControls.RatingControl": QSpinBox()
                }
                if pcf_name in PCF_MAP:
                    widget = PCF_MAP[pcf_name]
                    if isinstance(widget, QSpinBox):
                        widget.setRange(-2147483648, 2147483647)
                    return widget
                    
        # Detect Subgrids by D365 class ID
        if class_id and class_id.lower() == "{e7a81278-8635-4d9e-8d4d-59480b391c5b}":
            table = QTableWidget()
            
            if target_entity:
                import sqlite3
                import json
                try:
                    from view_parser import ViewParser
                except ImportError:
                    ViewParser = None

                try:
                    cache_db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "verseoff_cache.db")
                    conn = sqlite3.connect(cache_db_path)
                    conn.row_factory = sqlite3.Row
                    cursor = conn.cursor()
                    
                    columns = []
                    query_def = None
                    
                    # Try to fetch View metadata
                    if view_id and ViewParser:
                        # Clean up GUID format if needed
                        clean_view_id = view_id.strip("{}").lower()
                        cursor.execute("SELECT fetchxml, layoutxml FROM saved_queries WHERE savedqueryid = ?", (clean_view_id,))
                        view_row = cursor.fetchone()
                        
                        if view_row:
                            columns = ViewParser.parse_layoutxml(view_row['layoutxml'])
                            query_def = ViewParser.parse_fetchxml(view_row['fetchxml'])
                            
                    # Fallback columns if none parsed
                    if not columns:
                        columns = [
                            {'name': f"{target_entity}id", 'label': 'ID'},
                            {'name': 'statecode', 'label': 'Status'}
                        ]
                        
                    # Set up table header
                    table.setColumnCount(len(columns))
                    table.setHorizontalHeaderLabels([c.get('label', c['name']) for c in columns])
                    
                    # Try to query using FetchXML translation
                    if query_def and query_def.get("entity") == target_entity and ViewParser:
                        sql, params = ViewParser.fetchxml_to_sql(query_def)
                        cursor.execute(sql, params)
                    else:
                        # Fallback query if no valid view found
                        cursor.execute(f"SELECT * FROM {target_entity}")
                        
                    rows = cursor.fetchall()
                    table.setRowCount(len(rows))
                    
                    for i, row in enumerate(rows):
                        row_dict = dict(row)
                        # Ensure we populate the specific columns from the view
                        for j, col in enumerate(columns):
                            val = str(row_dict.get(col['name'], ''))
                            table.setItem(i, j, QTableWidgetItem(val))
                            
                    conn.close()
                except Exception as e:
                    print(f"Error loading subgrid data for {target_entity} (View {view_id}): {e}")
                    table.setRowCount(0)
            else:
                table.setRowCount(0)
                
            table.setMinimumHeight(150)
            return table
            
        # Detect Quick View Form by D365 class ID
        if class_id and class_id.lower() == "{5c5600e0-1d6e-4205-a272-be80da87fd42}":
            if not target_entity:
                return QLabel("Quick View Error: No target entity specified.")
                
            group = QGroupBox(f"Quick View: {target_entity}")
            layout = QVBoxLayout(group)
            layout.setContentsMargins(0, 0, 0, 0)
            
            nested_form = XrmFormRenderer(
                manifest_data=self.manifest,
                logical_name=target_entity,
                record_id=None, # Loaded later
                parent=self,
                form_id=quick_form_id,
                is_quick_view=True
            )
            # Make the nested form non-interactive
            nested_form.setEnabled(False)
            
            # Store reference so we can update its record_id later when the parent's lookup changes
            # Wait, in VerseOff MVP we just render it. We'll add dynamic update later.
            layout.addWidget(nested_form)
            return group
            
        # Find attribute metadata
        attr_meta = next((a for a in self.entity_def.get("attributes", []) if a["LogicalName"] == field_name), None)
        attr_type = attr_meta.get("AttributeType", "String") if attr_meta else "String"
        
        if attr_type == "Boolean":
            return QCheckBox()
        elif attr_type in ["Picklist", "State", "Status"]:
            combo = QComboBox()
            # Populate options
            options = self.entity_def.get("option_sets", {}).get(field_name, [])
            for opt in options:
                combo.addItem(opt["label"], opt["value"])
            return combo
        elif attr_type == "Integer":
            spin = QSpinBox()
            spin.setRange(-2147483648, 2147483647)
            return spin
        elif attr_type in ["Decimal", "Double", "Money"]:
            spin = QDoubleSpinBox()
            spin.setRange(-999999999, 999999999)
            return spin
        elif attr_type == "DateTime":
            return QDateTimeEdit(QDateTime.currentDateTime())
        elif attr_type in ["Lookup", "Customer", "Owner"]:
            targets = self.entity_def.get("lookup_targets", {}).get(field_name, [])
            return LookupWidget(self, targets)
        else:
            return QLineEdit()

    def _populate_data(self):
        conn = LocalDatabase().get_connection()
        cursor = conn.cursor()
        cursor.execute(f"SELECT * FROM {self.logical_name} WHERE id = ?", (self.record_id,))
        row = cursor.fetchone()
        conn.close()

        if row:
            for field, widget in self.controls.items():
                if field in row.keys():
                    val = row[field]
                    if val is None:
                        continue
                    if isinstance(widget, QLineEdit):
                        widget.setText(str(val))
                    elif isinstance(widget, QCheckBox):
                        widget.setChecked(bool(val))
                    elif isinstance(widget, QComboBox):
                        idx = widget.findData(val)
                        if idx >= 0:
                            widget.setCurrentIndex(idx)
                    elif isinstance(widget, QSpinBox) or isinstance(widget, QDoubleSpinBox):
                        try:
                            widget.setValue(float(val))
                        except ValueError:
                            pass
                            
        # Refresh any associated grids in the Related tab
        if hasattr(self, 'associated_grids'):
            for grid in self.associated_grids:
                grid.refresh_data()
                            
        # Snapshot initial values and reset dirty flags
        for field, widget in self.controls.items():
            widget._is_dirty = False
            if isinstance(widget, QLineEdit):
                widget._initial_value = widget.text()
            elif isinstance(widget, QCheckBox):
                widget._initial_value = widget.isChecked()
            elif isinstance(widget, QComboBox):
                widget._initial_value = widget.currentData()
            elif isinstance(widget, QSpinBox) or isinstance(widget, QDoubleSpinBox):
                widget._initial_value = widget.value()
                            
        # Re-evaluate rules after data load
        self.evaluate_ribbon_rules()

    def load_data(self):
        self._populate_data()
        
        # Fire OnLoad events from FormXML
        self._fire_events("onload")
        
        # Fire Data OnLoad dynamic events
        self._fire_events("dataonload")
        
        # Fire Form Loaded event (post-load)
        self._fire_events("formloaded")

    def refresh_data(self, save=False):
        """Programmatically fetches latest database values and fires dataonload."""
        if save:
            self.save_record()
        else:
            self._populate_data()
            self._fire_events("dataonload")

    def _on_tab_changed(self, index):
        tab_name = self.tab_widget.tabText(index) # Simplistic lookup for MVP
        self._fire_events("tabstatechange", tab_name)

    def register_dynamic_event(self, event_name: str, key: str, func):
        if event_name in ["onchange", "tabstatechange", "onrecordselect", "gridonsave", "onlookuptagclick", "presearch", "onoutputchange", "onprocessstatuschange", "onstagechange", "onstageselected", "onpreprocessstatuschange", "onprestagechange", "onreadystatecomplete", "onresultopened", "onselection", "onpostsearch", "gridonload"]:
            self._dynamic_events_map.setdefault(event_name, {}).setdefault(key, []).append(func)
        else:
            self._dynamic_events_map.setdefault(event_name, []).append(func)

    def unregister_dynamic_event(self, event_name: str, key: str, func):
        try:
            if event_name in ["onchange", "tabstatechange", "onrecordselect", "gridonsave", "onlookuptagclick", "presearch", "onoutputchange", "onprocessstatuschange", "onstagechange", "onstageselected", "onpreprocessstatuschange", "onprestagechange", "onreadystatecomplete", "onresultopened", "onselection", "onpostsearch", "gridonload"]:
                self._dynamic_events_map[event_name][key].remove(func)
            else:
                self._dynamic_events_map[event_name].remove(func)
        except (ValueError, KeyError):
            pass

    def _fire_events(self, event_name: str, control_name: str = None, save_mode: int = 1, is_save_success: bool = False, save_error_info: dict = None) -> bool:
        """Executes custom Python logic mapped from D365 FormXML events. 
        Returns True if preventDefault() was called during an onsave event."""
        
        # Helper to run event handlers
        def event_runner(handlers):
            for evt in handlers:
                if hasattr(self.form_events, evt.get("function", "")):
                    try:
                        func = getattr(self.form_events, evt["function"])
                        # Handle async and context
                        res = func(exec_context) if evt.get("pass_context") else func()
                        if inspect.isawaitable(res):
                            asyncio.run(res)
                    except Exception as e:
                        traceback.print_exc()

        handlers = self._form_events_map.get(event_name, [])
        if control_name:
            handlers = [e for e in handlers if e.get("control") == control_name]
        
        # Run bridge JS if exists
        if hasattr(self, "browser"):
             self.browser.page().runJavaScript(f"if(window.executeJsEvent) window.executeJsEvent('{event_name}', '{control_name}');")

        event_runner(handlers)
        
        # Execute registered Python dynamics
        context = PythonFormContext(self)
        prevented = False
        
        # Setup event args/source based on event type
        event_args = None
        if event_name == "onsave":
            entity_ref = {
                "entityType": getattr(self, "logical_name", ""), 
                "id": getattr(self, "record_id", ""), 
                "name": "Offline Record"
            }
            event_args = SaveEventArgs(save_mode=save_mode, entity_reference=entity_ref)
        elif event_name == "postsave":
            event_args = SaveEventArgs(save_mode=save_mode, is_save_success=is_save_success, save_error_info=save_error_info)
            
        event_source = None
        if control_name and event_name != "tabstatechange":
            event_source = context.getAttribute(control_name) or context.getControl(control_name)
            
        exec_context = PythonExecutionContext(
            form_context=context,
            event_source=event_source,
            event_args=event_args,
            shared_vars=self.shared_variables
        )
        
        return prevented

    def evaluate_ribbon_rules(self):
        """Evaluates DisplayRules and EnableRules against the current form state."""
        current_state = "Existing" if self.record_id else "Create"
        
        for item in self.ribbon_widgets:
            widget = item["widget"]
            btn_data = item["data"]
            
            # Default to true unless a rule explicitly fails
            should_display = True
            should_enable = True
            
            # Evaluate Display Rules
            for rule in btn_data.get("display_rules", []):
                if rule["type"] == "FormStateRule":
                    if rule.get("state") != current_state:
                        should_display = False
                        break
                elif rule["type"] == "ValueRule":
                    field = rule.get("field")
                    target_val = rule.get("value")
                    if field in self.controls:
                        ctrl = self.controls[field]
                        current_val = None
                        if isinstance(ctrl, QLineEdit):
                            current_val = ctrl.text()
                        elif isinstance(ctrl, QComboBox):
                            current_val = str(ctrl.currentData())
                        if current_val != target_val:
                            should_display = False
                            break
                            
            # Evaluate Enable Rules
            for rule in btn_data.get("enable_rules", []):
                if rule["type"] == "FormStateRule":
                    if rule.get("state") != current_state:
                        should_enable = False
                        break
                elif rule["type"] == "ValueRule":
                    field = rule.get("field")
                    target_val = rule.get("value")
                    if field in self.controls:
                        ctrl = self.controls[field]
                        current_val = None
                        if isinstance(ctrl, QLineEdit):
                            current_val = ctrl.text()
                        elif isinstance(ctrl, QComboBox):
                            current_val = str(ctrl.currentData())
                        if current_val != target_val:
                            should_enable = False
                            break

            widget.setVisible(should_display)
            widget.setEnabled(should_enable)

    def execute_ribbon_command(self, command_name: str):
        if "SaveAndClose" in command_name or command_name == "Mscrm.SaveAndClosePrimary":
            self.save_record(save_mode=2)
        elif "Save" in command_name or command_name == "Mscrm.SavePrimary":
            self.save_record(save_mode=1)
        else:
            QMessageBox.information(self, "Command", f"Ribbon Command executed: {command_name}")

    def save_record(self, save_mode: int = 1):
        # Fire OnSave events passing the explicit save mode
        is_prevented = self._fire_events("onsave", save_mode=save_mode)
        if is_prevented:
            return
            
        data_to_save = {}
        for field, widget in self.controls.items():
            if isinstance(widget, QLineEdit):
                data_to_save[field] = widget.text()
            elif isinstance(widget, QCheckBox):
                data_to_save[field] = widget.isChecked()
            elif isinstance(widget, QComboBox):
                data_to_save[field] = widget.currentData()
            elif isinstance(widget, QSpinBox) or isinstance(widget, QDoubleSpinBox):
                data_to_save[field] = widget.value()

        save_success = False
        try:
            with LocalDatabase().get_connection() as conn:
                cursor = conn.cursor()
                if self.record_id:
                    cursor.execute(
                        f"UPDATE {self.logical_name} SET data_json = ?, sync_status = 'PENDING' WHERE {self.primary_id_attr} = ?",
                        (json.dumps(data_to_save), self.record_id)
                    )
                else:
                    new_id = str(uuid.uuid4())
                    cursor.execute(
                        f"INSERT INTO {self.logical_name} ({self.primary_id_attr}, data_json, sync_status) VALUES (?, ?, 'PENDING')",
                        (new_id, json.dumps(data_to_save))
                    )
                    self.record_id = new_id
                conn.commit()
            
            save_success = True
            QMessageBox.information(self, "Success", "Record saved to local cache (Sync Pending).")
            
            if save_mode == 2:
                self.close()
                
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Failed to save record locally:\n{e}")
            self._fire_events("postsave", save_mode=save_mode, is_save_success=False, save_error_info={"errorCode": -1, "message": str(e)})
            return
            
        try:
            self.form_events.post_save(self.logical_name, self.record_id)
        except Exception as e:
            print(f"Post-save hook error: {e}")
            
        self._populate_data()
        self._fire_events("dataonload")
        
        # Fire custom PostSave event
        self._fire_events("postsave", save_mode=save_mode, is_save_success=save_success)

    def _run_post_load(self):
        try:
            self.form_events.post_load(self.logical_name, self.controls)
        except Exception as e:
            print(f"Custom Event Error in post_load: {e}")