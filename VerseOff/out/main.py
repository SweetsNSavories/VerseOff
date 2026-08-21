import os
import sys
import logging
import json
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QPushButton, 
    QLabel, QListWidget, QListWidgetItem, QHBoxLayout,
    QSplitter, QComboBox, QTableWidget, QTableWidgetItem, QLineEdit,
    QTreeWidget, QTreeWidgetItem
)
from PyQt6.QtCore import QTimer, QThread, pyqtSignal, Qt
from db import LocalDatabase
from sync_engine import SyncEngine

# Import Dynamic XRM Engine
from xrm_form_renderer import XrmFormRenderer

logger = logging.getLogger(__name__)

class SyncWorker(QThread):
    finished = pyqtSignal()
    error = pyqtSignal(str)

    def run(self):
        try:
            sync = SyncEngine()
            sync.sync_all()
            self.finished.emit()
        except Exception as e:
            self.error.emit(str(e))

class OfflineApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.db = LocalDatabase()
        manifest_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "manifest.json")
        with open(manifest_path, "r", encoding="utf-8") as f:
            self.config = json.load(f)
            
        self.setWindowTitle(f"{self.config.get('app_name', 'Dynamics 365')} - Offline Client")
        self.resize(1380, 860)
        self.setMinimumSize(1020, 700)
        
        # Build Entity Display Name Map
        self.display_names = {}
        for ent in self.config.get("entities", []):
            lname = ent.get("LogicalName", "")
            dname = ent.get("DisplayName", {}).get("UserLocalizedLabel", {}).get("Label") or lname.replace("_", " ").title()
            self.display_names[lname] = dname

        # Current active Area (D365 SiteMap displays only ONE area at a time)
        self.current_area_id = "area_service"
        self.sitemap_structure = self._define_sitemap_structure()
            
        # Apply Modern Microsoft Dynamics 365 / Fluent 2 Theme
        self.setStyleSheet("""
            QMainWindow {
                background-color: #f8f9fa;
            }
            QWidget {
                font-family: 'Segoe UI', 'Aptos', sans-serif;
                font-size: 13px;
                color: #201f1e;
            }
            /* Top App Header */
            #AppHeader {
                background-color: #002050;
                color: #ffffff;
                padding: 4px 12px;
            }
            #AppHeader QLabel {
                color: #ffffff;
            }
            /* Left Navigation Rail */
            #NavRail {
                background-color: #ffffff;
                border-right: 1px solid #e1dfdd;
            }
            QTreeWidget {
                background-color: #ffffff;
                border: none;
                padding: 8px 4px;
            }
            QTreeWidget::item {
                padding: 7px 10px;
                border-radius: 4px;
                margin: 1px 4px;
                color: #323130;
            }
            QTreeWidget::item:selected {
                background-color: #e0eef9;
                color: #0f6cbd;
                font-weight: 600;
                border-left: 3px solid #0f6cbd;
            }
            QTreeWidget::item:hover:!selected {
                background-color: #f3f2f1;
            }
            /* Area Switcher Button */
            #AreaSwitcher {
                background-color: #faf9f8;
                border: 1px solid #e1dfdd;
                border-radius: 4px;
                padding: 8px 12px;
                text-align: left;
                font-weight: 600;
                color: #323130;
            }
            #AreaSwitcher:hover {
                background-color: #edebe9;
                border-color: #0f6cbd;
            }
            /* HomepageGrid Command Bar */
            #CommandBar {
                background-color: #ffffff;
                border-bottom: 1px solid #e1dfdd;
                padding: 4px 8px;
            }
            #PrimaryCmdBtn {
                background-color: #0f6cbd;
                color: #ffffff;
                font-weight: 600;
                border: 1px solid #0f6cbd;
                border-radius: 4px;
                padding: 6px 16px;
            }
            #PrimaryCmdBtn:hover {
                background-color: #115ea3;
            }
            #CmdBtn {
                background-color: #ffffff;
                border: 1px solid #d1d1d1;
                border-radius: 4px;
                padding: 6px 12px;
                font-weight: 500;
                color: #323130;
            }
            #CmdBtn:hover {
                background-color: #f3f2f1;
                border-color: #8a8886;
            }
            /* Table Grid */
            QTableWidget {
                background-color: #ffffff;
                border: 1px solid #e1dfdd;
                border-radius: 6px;
                gridline-color: #f3f2f1;
                selection-background-color: #cce4f7;
                selection-color: #000000;
            }
            QTableWidget::item {
                padding: 8px 10px;
                border-bottom: 1px solid #f3f2f1;
            }
            QHeaderView::section {
                background-color: #faf9f8;
                color: #323130;
                font-weight: 600;
                font-size: 12px;
                padding: 9px 10px;
                border: none;
                border-bottom: 2px solid #edebe9;
            }
            QComboBox, QLineEdit {
                background-color: #ffffff;
                border: 1px solid #d1d1d1;
                border-radius: 4px;
                padding: 5px 8px;
            }
            QComboBox:focus, QLineEdit:focus {
                border: 2px solid #0f6cbd;
            }
            QSplitter::handle {
                background-color: #edebe9;
                width: 1px;
            }
        """)
        
        self.init_ui()
        self.init_background_sync()

    def init_background_sync(self):
        # Configured sync interval (default 1800 seconds = 30 minutes)
        interval_sec = self.config.get("sync_interval", 1800)
        self.sync_timer = QTimer(self)
        self.sync_timer.timeout.connect(self.trigger_sync)
        self.sync_timer.start(interval_sec * 1000)
        logger.info(f"Background sync started. Interval: {interval_sec} seconds.")

    def _define_sitemap_structure(self):
        """Constructs Model-Driven SiteMap Areas and Groups compliant with D365 SiteMap.xsd."""
        return [
            {
                "id": "area_service",
                "title": "Service",
                "icon": "🎧",
                "groups": [
                    {
                        "name": "CUSTOMERS",
                        "subareas": [
                            {"entity": "contact", "icon": "👤"},
                            {"entity": "account", "icon": "🏢"}
                        ]
                    },
                    {
                        "name": "SERVICE & OPERATIONS",
                        "subareas": [
                            {"entity": "incident", "icon": "📋"},
                            {"entity": "msdyn_swarm", "icon": "🤝"},
                            {"entity": "msdyn_ocliveworkitem", "icon": "💬"},
                            {"entity": "queueitem", "icon": "📥"},
                            {"entity": "activitypointer", "icon": "📅"},
                            {"entity": "socialprofile", "icon": "🌐"},
                            {"entity": "serviceappointment", "icon": "⏱️"},
                            {"entity": "msdyn_customerasset", "icon": "📦"},
                            {"entity": "msdyn_iotalert", "icon": "🔔"}
                        ]
                    },
                    {
                        "name": "KNOWLEDGE MANAGEMENT",
                        "subareas": [
                            {"entity": "knowledgearticle", "icon": "📚"},
                            {"entity": "template", "icon": "📑"},
                            {"entity": "emailsignature", "icon": "✍️"}
                        ]
                    }
                ]
            },
            {
                "id": "area_analytics",
                "title": "Analytics & Insights",
                "icon": "📊",
                "groups": [
                    {
                        "name": "HISTORICAL & COPILOT ANALYTICS",
                        "subareas": [
                            {"entity": "msdyn_dataanalyticsreport_csrmanager", "icon": "📈"},
                            {"entity": "msdyn_dataanalyticsreport_copilot", "icon": "✨"},
                            {"entity": "msdyn_dataanalyticsreport_ksinsights", "icon": "💡"},
                            {"entity": "msdyn_dataanalyticsreport_oc", "icon": "📊"},
                            {"entity": "msdyn_dataanalyticsreport_ocmodern", "icon": "📉"},
                            {"entity": "msdyn_dataanalyticsreport_email", "icon": "✉️"},
                            {"entity": "msdyn_dataanalyticsreport_mc", "icon": "⚙️"}
                        ]
                    },
                    {
                        "name": "REAL-TIME ROUTING",
                        "subareas": [
                            {"entity": "msdyn_dataanalyticsreport_oc_rt", "icon": "⚡"},
                            {"entity": "msdyn_dataanalyticsreport_ur_recordrouting_rt", "icon": "🔀"}
                        ]
                    }
                ]
            },
            {
                "id": "area_management",
                "title": "Service Management",
                "icon": "⚙️",
                "groups": [
                    {
                        "name": "SERVICE LEVEL AGREEMENTS (SLAS)",
                        "subareas": [
                            {"entity": "sla", "icon": "⏱️"},
                            {"entity": "slaitem", "icon": "📌"},
                            {"entity": "slakpiinstance", "icon": "🎯"}
                        ]
                    },
                    {
                        "name": "ROUTING & CASE CREATION",
                        "subareas": [
                            {"entity": "routingrule", "icon": "🔀"},
                            {"entity": "routingruleitem", "icon": "🏷️"},
                            {"entity": "convertrule", "icon": "🔄"},
                            {"entity": "convertruleitem", "icon": "📋"}
                        ]
                    },
                    {
                        "name": "ENTITLEMENTS",
                        "subareas": [
                            {"entity": "entitlement", "icon": "📜"},
                            {"entity": "entitlementchannel", "icon": "📡"},
                            {"entity": "entitlementtemplate", "icon": "📑"}
                        ]
                    }
                ]
            },
            {
                "id": "area_quality",
                "title": "Quality & Evaluation",
                "icon": "⭐",
                "groups": [
                    {
                        "name": "AGENT EVALUATIONS",
                        "subareas": [
                            {"entity": "msdyn_evaluation", "icon": "📝"},
                            {"entity": "msdyn_evaluationplan", "icon": "📋"},
                            {"entity": "msdyn_evaluationcriteria", "icon": "✔️"},
                            {"entity": "msdyn_screenrecording", "icon": "🎥"}
                        ]
                    }
                ]
            }
        ]

    def init_ui(self):
        central = QWidget()
        layout = QVBoxLayout(central)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)
        
        # 1. Top Global D365 Brand Header
        header_widget = QWidget()
        header_widget.setObjectName("AppHeader")
        header_widget.setFixedHeight(48)
        header_layout = QHBoxLayout(header_widget)
        header_layout.setContentsMargins(16, 0, 16, 0)
        header_layout.setSpacing(12)
        
        waffle_icon = QLabel("<b>:::</b>")
        waffle_icon.setStyleSheet("font-size: 18px; color: #ffffff;")
        
        title_label = QLabel(f"<b>Dynamics 365</b> &nbsp;|&nbsp; <span style='color: #cce4f7;'>{self.config.get('app_name', 'Customer Service workspace')}</span>")
        title_label.setStyleSheet("font-size: 14px;")
        
        header_layout.addWidget(waffle_icon)
        header_layout.addWidget(title_label)
        header_layout.addStretch()
        
        # Global Quick Find Search in Top Header
        top_search = QLineEdit()
        top_search.setPlaceholderText("🔍 Search this app...")
        top_search.setFixedWidth(280)
        top_search.setStyleSheet("background-color: #ffffff; color: #201f1e; border: none; border-radius: 4px; padding: 4px 10px;")
        header_layout.addWidget(top_search)
        
        # Sync Action
        self.sync_btn = QPushButton("⚡ Sync with Cloud")
        self.sync_btn.setStyleSheet("background-color: #0f6cbd; color: #ffffff; font-weight: 600; border: none; border-radius: 4px; padding: 5px 14px;")
        self.sync_btn.clicked.connect(self.trigger_sync)
        header_layout.addWidget(self.sync_btn)
        
        # User profile badge
        user_badge = QLabel("👤 Offline User")
        user_badge.setStyleSheet("color: #ffffff; font-weight: 500; padding-left: 8px;")
        header_layout.addWidget(user_badge)
        
        layout.addWidget(header_widget)
        
        # 2. Main Content Splitter (Left SiteMap Rail + Right HomepageGrid)
        splitter = QSplitter(Qt.Orientation.Horizontal)
        
        # --- Left Navigation Rail Container (Tree + Bottom Area Switcher) ---
        nav_container = QWidget()
        nav_container.setObjectName("NavRail")
        nav_layout = QVBoxLayout(nav_container)
        nav_layout.setContentsMargins(0, 0, 0, 0)
        nav_layout.setSpacing(0)
        
        self.nav_tree = QTreeWidget()
        self.nav_tree.setHeaderHidden(True)
        self.nav_tree.setMinimumWidth(260)
        self.nav_tree.itemSelectionChanged.connect(self.on_nav_changed)
        nav_layout.addWidget(self.nav_tree)
        
        # Bottom Area Switcher (D365 Model-Driven Pattern)
        area_switcher_box = QWidget()
        area_switcher_box.setStyleSheet("background-color: #faf9f8; border-top: 1px solid #e1dfdd; padding: 8px;")
        area_switcher_layout = QVBoxLayout(area_switcher_box)
        area_switcher_layout.setContentsMargins(0, 0, 0, 0)
        
        area_label = QLabel("<small style='color: #605e5c; font-weight: bold;'>CHANGE AREA</small>")
        self.area_combo = QComboBox()
        self.area_combo.setObjectName("AreaSwitcher")
        for area in self.sitemap_structure:
            self.area_combo.addItem(f"{area.get('icon', '📁')}  {area.get('title')}", area.get('id'))
            
        self.area_combo.currentIndexChanged.connect(self.on_area_switched)
        area_switcher_layout.addWidget(area_label)
        area_switcher_layout.addWidget(self.area_combo)
        
        nav_layout.addWidget(area_switcher_box)
        splitter.addWidget(nav_container)
        
        # --- Right Content Pane (Views + HomepageGrid Command Bar + Table) ---
        right_widget = QWidget()
        right_layout = QVBoxLayout(right_widget)
        right_layout.setContentsMargins(12, 10, 12, 12)
        right_layout.setSpacing(8)
        
        # Top Entity Header & View Selector Bar
        top_view_bar = QHBoxLayout()
        top_view_bar.setContentsMargins(0, 0, 0, 4)
        
        self.entity_header_label = QLabel("<b>Contacts</b>")
        self.entity_header_label.setStyleSheet("font-size: 18px; color: #201f1e; font-weight: 600;")
        
        self.view_combo = QComboBox()
        self.view_combo.setMinimumWidth(260)
        self.view_combo.currentIndexChanged.connect(self.refresh_grid)
        
        self.search_bar = QLineEdit()
        self.search_bar.setPlaceholderText("🔍 Quick Find Search...")
        self.search_bar.setMinimumWidth(240)
        self.search_bar.returnPressed.connect(self.do_quick_find)
        
        top_view_bar.addWidget(self.entity_header_label)
        top_view_bar.addWidget(self.view_combo)
        top_view_bar.addStretch()
        top_view_bar.addWidget(self.search_bar)
        right_layout.addLayout(top_view_bar)
        
        # HomepageGrid Ribbon Command Bar (dynamically populated)
        self.grid_command_bar = QHBoxLayout()
        self.grid_command_bar.setContentsMargins(0, 0, 0, 4)
        self.grid_command_bar.setSpacing(6)
        right_layout.addLayout(self.grid_command_bar)
        
        # Homepage Data Grid
        self.data_grid = QTableWidget()
        self.data_grid.itemDoubleClicked.connect(self.open_record_from_grid)
        self.data_grid.setSelectionBehavior(QTableWidget.SelectionBehavior.SelectRows)
        self.data_grid.setEditTriggers(QTableWidget.EditTrigger.NoEditTriggers)
        self.data_grid.setAlternatingRowColors(True)
        self.data_grid.horizontalHeader().setStretchLastSection(True)
        right_layout.addWidget(self.data_grid)
        
        # Footer (Record Count & Status)
        self.footer_label = QLabel("Showing 0 records")
        self.footer_label.setStyleSheet("color: #605e5c; font-size: 12px; padding: 2px 4px;")
        right_layout.addWidget(self.footer_label)
        
        splitter.addWidget(right_widget)
        splitter.setStretchFactor(1, 4)
        layout.addWidget(splitter)
        
        self.setCentralWidget(central)
        
        # Initial Render for Default Area (Service)
        self.render_active_area_sitemap("area_service")

    def on_area_switched(self):
        area_id = self.area_combo.currentData()
        if area_id:
            self.render_active_area_sitemap(area_id)

    def render_active_area_sitemap(self, area_id: str):
        """Renders ONLY the groups and subareas belonging to the active selected Area."""
        self.current_area_id = area_id
        self.nav_tree.clear()
        
        area_def = next((a for a in self.sitemap_structure if a.get("id") == area_id), None)
        if not area_def:
            return
            
        all_manifest_entities = {e.get("LogicalName"): e for e in self.config.get("entities", [])}
        
        for grp in area_def.get("groups", []):
            # Group Header (Category label in uppercase)
            grp_item = QTreeWidgetItem([grp.get("name")])
            grp_item.setFlags(Qt.ItemFlag.ItemIsEnabled)
            font = grp_item.font(0)
            font.setBold(True)
            font.setPointSize(10)
            grp_item.setFont(0, font)
            grp_item.setForeground(0, Qt.GlobalColor.darkGray)
            
            for sub in grp.get("subareas", []):
                ent_name = sub.get("entity")
                if ent_name in all_manifest_entities:
                    disp_name = self.display_names.get(ent_name, ent_name.replace("_", " ").title())
                    sub_icon = sub.get("icon", "📄")
                    sub_item = QTreeWidgetItem([f"{sub_icon}  {disp_name}"])
                    sub_item.setData(0, Qt.ItemDataRole.UserRole, ent_name)
                    grp_item.addChild(sub_item)
                    
            if grp_item.childCount() > 0:
                self.nav_tree.addTopLevelItem(grp_item)
                grp_item.setExpanded(True)
                
        # Select first valid subarea to trigger grid load
        self.select_default_nav_item()

    def select_default_nav_item(self):
        for i in range(self.nav_tree.topLevelItemCount()):
            grp_item = self.nav_tree.topLevelItem(i)
            if grp_item.childCount() > 0:
                self.nav_tree.setCurrentItem(grp_item.child(0))
                break

    def on_nav_changed(self):
        selected = self.nav_tree.selectedItems()
        if not selected: return
        entity_name = selected[0].data(0, Qt.ItemDataRole.UserRole)
        if not entity_name: return # Group clicked
        
        disp_name = self.display_names.get(entity_name, entity_name)
        self.entity_header_label.setText(f"<b>{disp_name}</b>")
        
        # Rebuild HomepageGrid Command Bar
        self.rebuild_homepage_ribbon(entity_name)
        
        # Populate View Selector
        self.view_combo.blockSignals(True)
        self.view_combo.clear()
        
        views_found = 0
        try:
            with self.db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT savedqueryid, name FROM saved_queries WHERE returnedtypecode = ?", (entity_name,))
                views = cursor.fetchall()
                for v in views:
                    self.view_combo.addItem(v[1], v[0])
                    views_found += 1
        except Exception as e:
            logger.debug(f"Could not query saved_queries: {e}")

        # Fallback Standard D365 System Views
        if views_found == 0:
            self.view_combo.addItem(f"Active {disp_name}s", "active_records")
            self.view_combo.addItem(f"All {disp_name}s", "all_records")
            self.view_combo.addItem(f"Inactive {disp_name}s", "inactive_records")
            
        self.view_combo.blockSignals(False)
        self.refresh_grid()

    def rebuild_homepage_ribbon(self, entity_name: str):
        while self.grid_command_bar.count():
            item = self.grid_command_bar.takeAt(0)
            widget = item.widget()
            if widget: widget.deleteLater()
                
        ent_def = next((e for e in self.config.get("entities", []) if e.get("LogicalName") == entity_name), None)
        disp_name = self.display_names.get(entity_name, entity_name)
        
        # 1. Primary + New Button
        new_btn = QPushButton(f"＋  New {disp_name}")
        new_btn.setObjectName("PrimaryCmdBtn")
        new_btn.clicked.connect(lambda: self.open_form(entity_name, None))
        self.grid_command_bar.addWidget(new_btn)
        
        # 2. Delete Button
        delete_btn = QPushButton("🗑  Delete")
        delete_btn.setObjectName("CmdBtn")
        delete_btn.clicked.connect(self.on_delete_record_clicked)
        self.grid_command_bar.addWidget(delete_btn)
        
        # 3. Refresh Button
        refresh_btn = QPushButton("↻  Refresh")
        refresh_btn.setObjectName("CmdBtn")
        refresh_btn.clicked.connect(lambda: self.refresh_grid())
        self.grid_command_bar.addWidget(refresh_btn)
        
        # 4. Standard D365 Homepage Grid actions
        assign_btn = QPushButton("👥  Assign")
        assign_btn.setObjectName("CmdBtn")
        assign_btn.clicked.connect(lambda: logger.info("Assign action triggered"))
        self.grid_command_bar.addWidget(assign_btn)
        
        export_btn = QPushButton("📤  Export to Excel")
        export_btn.setObjectName("CmdBtn")
        export_btn.clicked.connect(lambda: logger.info("Export action triggered"))
        self.grid_command_bar.addWidget(export_btn)
        
        # Custom Homepage Ribbon buttons if defined in metadata
        if ent_def:
            ribbon_buttons = ent_def.get("ribbon_buttons", [])
            seen = {"New", "Delete", "Refresh", "Assign", "Export", f"New {disp_name}"}
            for btn in ribbon_buttons:
                if btn.get("location_type") == "homepage_grid":
                    lbl = btn.get("label", "")
                    if not lbl or lbl in seen: continue
                    seen.add(lbl)
                    
                    cmd_btn = QPushButton(lbl)
                    cmd_btn.setObjectName("CmdBtn")
                    cmd_btn.clicked.connect(lambda _, cmd=btn.get("command"): logger.info(f"Executed command: {cmd}"))
                    self.grid_command_bar.addWidget(cmd_btn)
                    
        self.grid_command_bar.addStretch()

    def on_delete_record_clicked(self):
        selected_nav = self.nav_tree.selectedItems()
        if not selected_nav: return
        entity_name = selected_nav[0].data(0, Qt.ItemDataRole.UserRole)
        if not entity_name: return

        selected_items = self.data_grid.selectedItems()
        if not selected_items: return
        row = selected_items[0].row()
        first_cell = self.data_grid.item(row, 0)
        if not first_cell: return
        record_id = first_cell.data(Qt.ItemDataRole.UserRole)
        if not record_id: return

        from PyQt6.QtWidgets import QMessageBox
        disp_name = self.display_names.get(entity_name, entity_name)
        reply = QMessageBox.question(
            self, 
            "Confirm Delete", 
            f"Are you sure you want to delete this {disp_name} record offline?",
            QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No
        )
        if reply == QMessageBox.StandardButton.Yes:
            with self.db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(f"DELETE FROM {entity_name} WHERE id = ?", (record_id,))
                conn.commit()
            self.refresh_grid()

    def do_quick_find(self):
        search_text = self.search_bar.text().strip()
        self.refresh_grid(search_string=search_text)

    def refresh_grid(self, search_string=None):
        selected_nav = self.nav_tree.selectedItems()
        if not selected_nav: return
        entity_name = selected_nav[0].data(0, Qt.ItemDataRole.UserRole)
        if not entity_name: return
        
        ent_def = next((e for e in self.config.get("entities", []) if e.get("LogicalName") == entity_name), None)
        primary_id_attr = (ent_def.get("PrimaryIdAttribute") if ent_def else None) or f"{entity_name}id"
        primary_name_attr = (ent_def.get("PrimaryNameAttribute") if ent_def else None) or "name"
        
        # Build intelligent default columns for the entity
        columns = []
        if ent_def and ent_def.get("attributes"):
            attrs = ent_def.get("attributes", [])
            attr_map = {a.get("LogicalName"): a for a in attrs if isinstance(a, dict)}
            
            candidate_names = [primary_name_attr, "emailaddress1", "telephone1", "jobtitle", "statecode", "statuscode", "createdon", "modifiedon"]
            seen_cols = set()
            for col_name in candidate_names:
                if col_name in attr_map and col_name not in seen_cols:
                    seen_cols.add(col_name)
                    lbl = attr_map[col_name].get("DisplayName", {}).get("UserLocalizedLabel", {}).get("Label") or col_name.replace("_", " ").title()
                    columns.append({"name": col_name, "label": lbl})
                    
            if not columns:
                columns = [
                    {"name": primary_name_attr, "label": primary_name_attr.replace("_", " ").title()},
                    {"name": "sync_status", "label": "Sync Status"},
                    {"name": "last_modified", "label": "Modified On"}
                ]
        else:
            columns = [
                {"name": primary_name_attr, "label": "Name"},
                {"name": "sync_status", "label": "Sync Status"},
                {"name": "last_modified", "label": "Modified On"}
            ]

        try:
            with self.db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(f"PRAGMA table_info({entity_name})")
                table_cols = [r[1] for r in cursor.fetchall()]
                
                rows_data = []
                if "data_json" in table_cols:
                    cursor.execute(f"SELECT id, data_json, sync_status, last_modified FROM {entity_name}")
                    for rec in cursor.fetchall():
                        rec_id, data_str, status, mod_on = rec
                        try:
                            item_data = json.loads(data_str) if data_str else {}
                        except Exception:
                            item_data = {}
                        item_data["id"] = rec_id
                        item_data[primary_id_attr] = rec_id
                        item_data["sync_status"] = status
                        item_data["last_modified"] = mod_on
                        rows_data.append(item_data)
                elif table_cols:
                    cursor.execute(f"SELECT * FROM {entity_name}")
                    col_names = [description[0] for description in cursor.description]
                    for rec in cursor.fetchall():
                        rows_data.append(dict(zip(col_names, rec)))

                if search_string:
                    s_lower = search_string.lower()
                    filtered = []
                    for r in rows_data:
                        if any(s_lower in str(v).lower() for v in r.values()):
                            filtered.append(r)
                    rows_data = filtered

                # Populate QTableWidget
                self.data_grid.setColumnCount(len(columns))
                self.data_grid.setHorizontalHeaderLabels([c.get("label", c["name"]) for c in columns])
                self.data_grid.setRowCount(len(rows_data))

                for i, row in enumerate(rows_data):
                    rec_id = row.get(primary_id_attr) or row.get("id") or ""
                    for j, col in enumerate(columns):
                        val = str(row.get(col["name"], ""))
                        if val == "None": val = ""
                        item = QTableWidgetItem(val)
                        if j == 0:
                            item.setData(Qt.ItemDataRole.UserRole, rec_id)
                        self.data_grid.setItem(i, j, item)
                        
                self.footer_label.setText(f"Showing {len(rows_data)} record{'s' if len(rows_data) != 1 else ''}")
                        
        except Exception as e:
            logger.error(f"Error loading homepage grid: {e}")

    def open_record_from_grid(self, item):
        row = item.row()
        first_cell = self.data_grid.item(row, 0)
        if not first_cell: return
        
        record_id = first_cell.data(Qt.ItemDataRole.UserRole)
        
        selected_nav = self.nav_tree.selectedItems()
        if not selected_nav: return
        entity_name = selected_nav[0].data(0, Qt.ItemDataRole.UserRole)
        
        if record_id:
            self.open_form(entity_name, record_id)

    def open_form(self, entity_name, record_id):
        self.current_form = XrmFormRenderer(self.config, entity_name, record_id)
        self.current_form.show()
        self.current_form.raise_()
        self.current_form.activateWindow()

    def trigger_sync(self):
        if hasattr(self, 'worker') and self.worker.isRunning():
            return # Already syncing
            
        self.sync_btn.setText("Syncing...")
        self.sync_btn.setDisabled(True)
        
        self.worker = SyncWorker()
        self.worker.finished.connect(self.on_sync_finished)
        self.worker.error.connect(self.on_sync_error)
        self.worker.start()

    def on_sync_finished(self):
        self.refresh_grid()
        self.sync_btn.setText("Sync Now")
        self.sync_btn.setDisabled(False)
        logger.info("Autonomous sync cycle completed.")

    def on_sync_error(self, error_msg):
        logger.error(f"Sync failed: {error_msg}")
        self.sync_btn.setText("Sync Error")
        self.sync_btn.setDisabled(False)

def global_exception_handler(exc_type, exc_value, exc_traceback):
    import traceback
    from PyQt6.QtWidgets import QMessageBox
    error_msg = "".join(traceback.format_exception(exc_type, exc_value, exc_traceback))
    logging.error(f"CRASH: {error_msg}")
    try:
        msg_box = QMessageBox()
        msg_box.setIcon(QMessageBox.Icon.Critical)
        msg_box.setWindowTitle("Critical Application Error")
        msg_box.setText("An unexpected error occurred!")
        msg_box.setDetailedText(error_msg)
        msg_box.exec()
    except Exception:
        pass


class SafeApplication(QApplication):
    def notify(self, receiver, event):
        try:
            return super().notify(receiver, event)
        except Exception as e:
            import traceback
            from PyQt6.QtWidgets import QMessageBox
            import logging
            error_msg = "".join(traceback.format_exception(type(e), e, e.__traceback__))
            logging.error(f"CRASH PREVENTED: {error_msg}")
            try:
                msg_box = QMessageBox()
                msg_box.setIcon(QMessageBox.Icon.Critical)
                msg_box.setWindowTitle("Application Error")
                msg_box.setText("An unexpected error occurred, but the application was kept alive.")
                msg_box.setDetailedText(error_msg)
                msg_box.exec()
            except:
                pass
            return False

def main():
    try:
        import ctypes
        ctypes.windll.shell32.SetCurrentProcessExplicitAppUserModelID("verseoff.dynamics.offline.app")
    except Exception:
        pass
    sys.excepthook = global_exception_handler
    logging.basicConfig(level=logging.INFO)
    app = SafeApplication(sys.argv)
    window = OfflineApp()
    window.resize(1280, 800)
    window.show()
    window.raise_()
    window.activateWindow()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()