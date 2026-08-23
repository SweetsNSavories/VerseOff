import os
import sys
import logging
import json
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QPushButton, 
    QLabel, QListWidget, QListWidgetItem, QHBoxLayout,
    QSplitter, QTableWidget, QTableWidgetItem, QLineEdit,
    QTreeWidget, QTreeWidgetItem, QTreeWidgetItemIterator,
    QStackedWidget, QMessageBox,
    QToolButton, QMenu, QHeaderView
)
from PyQt6.QtCore import QTimer, QThread, pyqtSignal, Qt, QSize
from PyQt6.QtGui import QPixmap
from db import LocalDatabase
from sync_engine import SyncEngine
from ui_components import FluentComboBox as QComboBox
from view_parser import ViewParser

# Import Dynamic XRM Engine
from xrm_form_renderer import XrmFormRenderer

logger = logging.getLogger(__name__)
SITEMAP_ROUTE_ROLE = int(Qt.ItemDataRole.UserRole) + 1

class SyncWorker(QThread):
    succeeded = pyqtSignal(object)
    error = pyqtSignal(str)

    def __init__(self, config_path, parent=None):
        super().__init__(parent)
        self.config_path = config_path

    def run(self):
        try:
            summary = SyncEngine(self.config_path).sync_all()
            self.succeeded.emit(summary)
        except Exception as e:
            self.error.emit(str(e))

class OfflineApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self._close_after_sync = False
        self.setWindowTitle("Dynamics 365 - Offline Client")
        self.resize(1380, 860)
        self.setMinimumSize(1020, 700)
        
        try:
            self._initialize_core_components()
        except Exception as e:
            logger.critical(f"Fail-Close triggered during initialization: {e}")
            self.show_critical_error(str(e))
            return

    def show_critical_error(self, message):
        msg = QMessageBox(self)
        msg.setIcon(QMessageBox.Icon.Critical)
        msg.setWindowTitle("Critical Initialization Error")
        msg.setText("The application failed to start securely and will close.")
        msg.setInformativeText(message)
        msg.setStandardButtons(QMessageBox.StandardButton.Close)
        msg.exec()
        sys.exit(1)
            
    def _initialize_core_components(self):
        self.db = LocalDatabase()
        resource_dir = getattr(
            sys,
            "_MEIPASS",
            os.path.dirname(os.path.abspath(__file__)),
        )
        self.manifest_path = os.path.join(resource_dir, "manifest.json")
        if not os.path.exists(self.manifest_path):
            raise RuntimeError("Missing required manifest.json file. Application cannot start securely without manifest.")
            
        with open(self.manifest_path, "r", encoding="utf-8") as f:
            self.config = json.load(f)
            
        self.setWindowTitle(f"{self.config.get('app_name', 'Dynamics 365')} - Offline Client")
        
        # Build Entity Display Name Map
        self.display_names = {}
        for ent in self.config.get("entities", []):
            lname = ent.get("LogicalName", "")
            dname = ent.get("DisplayName", {}).get("UserLocalizedLabel", {}).get("Label") or lname.replace("_", " ").title()
            self.display_names[lname] = dname

        self.sitemap_structure = self._define_sitemap_structure()
        self.grid_ribbon_widgets = []
        self.current_area_id = (
            self.sitemap_structure[0]["id"]
            if self.sitemap_structure
            else ""
        )
            
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
                margin: 1px 0px;
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
        interval_sec = max(60, int(self.config.get("sync_interval", 300)))
        self.sync_timer = QTimer(self)
        self.sync_timer.timeout.connect(self.trigger_sync)
        self.sync_timer.start(interval_sec * 1000)
        logger.info(f"Background sync started. Interval: {interval_sec} seconds.")
        if self.config.get("auto_sync_on_start", True):
            QTimer.singleShot(750, self.trigger_sync)

    def _define_sitemap_structure(self):
        """Build navigation from the selected app SiteMap in manifest.json."""
        entity_order = [
            entity.get("LogicalName")
            for entity in self.config.get("entities", [])
            if entity.get("LogicalName")
            and not entity.get("_verseoff_dependency_only")
        ]
        included_entities = {
            entity.get("LogicalName")
            for entity in self.config.get("entities", [])
            if entity.get("LogicalName")
        }
        mapped_entities = set()
        areas = []

        def title_or_fallback(value, fallback, raw_id=None):
            value = str(value or "").strip()
            if not value or value.startswith("$"):
                return fallback
            if raw_id and value.lower() == str(raw_id).lower() and fallback:
                return fallback
            if value.islower() and "_" not in value and " " not in value and fallback:
                return fallback
            return value

        for area_index, source_area in enumerate(
            self.config.get("sitemap", {}).get("areas", [])
        ):
            area_id = source_area.get("id") or f"area_{area_index + 1}"
            area = {
                "id": area_id,
                "title": title_or_fallback(
                    source_area.get("title"),
                    area_id.replace("_", " ").title(),
                    area_id,
                ),
                "groups": [],
            }
            for group_index, source_group in enumerate(
                source_area.get("groups", [])
            ):
                group_id = (
                    source_group.get("id")
                    or f"group_{group_index + 1}"
                )
                group = {
                    "id": group_id,
                    "title": title_or_fallback(
                        source_group.get("title"),
                        group_id.replace("_", " ").title(),
                        group_id,
                    ),
                    "subareas": [],
                }
                for source_subarea in source_group.get("subareas", []):
                    logical_name = source_subarea.get("entity")
                    if logical_name and logical_name not in included_entities:
                        continue
                    subarea = {
                        "id": source_subarea.get("id") or logical_name,
                        "entity": logical_name,
                        "title": title_or_fallback(
                            source_subarea.get("title"),
                            self.display_names.get(
                                logical_name,
                                source_subarea.get("id") or "Navigation item",
                            ),
                            source_subarea.get("id") or logical_name,
                        ),
                        "destination_type": source_subarea.get(
                            "destination_type",
                            "entity" if logical_name else "unsupported",
                        ),
                        "url": source_subarea.get("url", ""),
                        "default_dashboard": source_subarea.get(
                            "default_dashboard",
                            "",
                        ),
                        "available_offline": source_subarea.get(
                            "available_offline",
                            False,
                        ),
                    }
                    group["subareas"].append(subarea)
                    if logical_name:
                        mapped_entities.add(logical_name)
                if group["subareas"]:
                    area["groups"].append(group)
            if area["groups"]:
                areas.append(area)

        additional_entities = [
            logical_name
            for logical_name in entity_order
            if logical_name not in mapped_entities
        ]
        if not areas:
            areas.append({
                "id": "area_tables",
                "title": self.config.get("app_name", "App tables"),
                "groups": [],
            })
        if additional_entities:
            areas[0]["groups"].append({
                "id": "group_additional",
                "title": "Additional tables",
                "subareas": [
                    {
                        "id": logical_name,
                        "entity": logical_name,
                        "title": self.display_names.get(
                            logical_name,
                            logical_name.replace("_", " ").title(),
                        ),
                    }
                    for logical_name in additional_entities
                ],
            })
        return areas

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
        header_layout.setContentsMargins(16, 8, 16, 8)
        
        self.logo_label = QLabel()
        import os
        logo_path = os.path.join(os.path.dirname(__file__), "logo.png")
        if not os.path.exists(logo_path):
            logo_path = os.path.join(os.path.dirname(__file__), "logo.jpg")
        logo_pixmap = QPixmap(logo_path).scaled(32, 32, Qt.AspectRatioMode.KeepAspectRatio, Qt.TransformationMode.SmoothTransformation)
        if not logo_pixmap.isNull():
            self.logo_label.setPixmap(logo_pixmap)
            self.logo_label.setStyleSheet("background: transparent; border: none; margin-right: 6px;")
            header_layout.addWidget(self.logo_label)
        
        brand_label = QLabel("<b>VerseOff</b>")
        brand_label.setStyleSheet("font-size: 16px; font-weight: 700; color: #ffffff;")
        header_layout.addWidget(brand_label)
        
        divider_label = QLabel("|")
        divider_label.setStyleSheet("font-size: 15px; color: #8ab4f8; margin: 0 4px;")
        header_layout.addWidget(divider_label)
        
        # App Selector Dropdown
        self.app_selector = QComboBox()
        self.app_selector.setCursor(Qt.CursorShape.PointingHandCursor)
        self.app_selector.setToolTip("Switch Model-Driven App")
        self.app_selector.setStyleSheet("""
            QComboBox {
                background-color: rgba(255, 255, 255, 0.08);
                color: #ffffff;
                font-size: 14px;
                font-weight: 600;
                border: 1px solid rgba(255, 255, 255, 0.25);
                border-radius: 4px;
                padding: 4px 12px;
                min-width: 220px;
            }
            QComboBox:hover {
                background-color: rgba(255, 255, 255, 0.16);
                border-color: #388bfd;
            }
            QComboBox::drop-down {
                subcontrol-origin: padding;
                subcontrol-position: right center;
                width: 20px;
                border-left: none;
            }
            QComboBox QAbstractItemView {
                background-color: #ffffff;
                color: #201f1e;
                selection-background-color: #edebe9;
                selection-color: #0f6cbd;
                border: 1px solid #d2d0ce;
                padding: 4px;
                outline: none;
                font-size: 13px;
            }
        """)
        
        # Populate available apps
        current_app_name = self.config.get("app_name", "Customer Service Hub")
        available_apps = self.config.get("available_apps", [])
        if not available_apps:
            available_apps = [{"id": self.config.get("app_id"), "name": current_app_name}]
            
        for app_info in available_apps:
            name = app_info.get("name") or app_info.get("uniquename")
            app_id = app_info.get("id") or app_info.get("appmoduleid")
            if name:
                self.app_selector.addItem(f"  {name}", app_id)
                
        # Set active app
        for i in range(self.app_selector.count()):
            if current_app_name.lower() in self.app_selector.itemText(i).lower():
                self.app_selector.setCurrentIndex(i)
                break
                
        self.app_selector.currentIndexChanged.connect(self._on_app_selector_changed)
        header_layout.addWidget(self.app_selector)
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
        
        # 2. Main Content Container (Left SiteMap Rail + Right Content)
        main_content_container = QWidget()
        main_content_layout = QHBoxLayout(main_content_container)
        main_content_layout.setContentsMargins(0, 0, 0, 0)
        main_content_layout.setSpacing(0)
        
        # --- Left Navigation Rail Container (Header with vertical 3-bars toggle + Tree + Bottom Area Switcher) ---
        self.nav_container = QWidget()
        self.nav_container.setObjectName("NavRail")
        nav_layout = QVBoxLayout(self.nav_container)
        nav_layout.setContentsMargins(0, 0, 0, 0)
        nav_layout.setSpacing(0)
        
        # Sitemap Header with Active Area Name & 3 Vertical Lines Collapse Button
        self.sitemap_header = QWidget()
        self.sitemap_header.setFixedHeight(38)
        self.sitemap_header.setStyleSheet(
            "background-color: #f3f2f1; border-bottom: 1px solid #e1dfdd; padding: 0px 4px;"
        )
        self.sitemap_header_layout = QHBoxLayout(self.sitemap_header)
        self.sitemap_header_layout.setContentsMargins(12, 0, 8, 0)
        
        self.sitemap_area_title = QLabel("MY WORK")
        self.sitemap_area_title.setStyleSheet(
            "font-size: 11px; font-weight: 700; color: #605e5c; text-transform: uppercase; letter-spacing: 0.5px;"
        )
        self.sitemap_header_layout.addWidget(self.sitemap_area_title)
        self.sitemap_header_layout.addStretch()
        
        # 3 Vertical Lines (vertical hamburger / collapse icon)
        self.hamburger_btn = QPushButton("❙❙❙")
        self.hamburger_btn.setToolTip("Collapse SiteMap")
        self.hamburger_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        self.hamburger_btn.setStyleSheet("""
            QPushButton {
                background: transparent;
                border: none;
                color: #605e5c;
                font-size: 13px;
                font-weight: 900;
                letter-spacing: -1px;
                padding: 4px 6px;
                border-radius: 4px;
            }
            QPushButton:hover {
                background-color: #edebe9;
                color: #0f6cbd;
            }
        """)
        self.hamburger_btn.clicked.connect(self.toggle_sitemap)
        self.sitemap_header_layout.addWidget(self.hamburger_btn)
        nav_layout.addWidget(self.sitemap_header)
        
        self.nav_tree = QTreeWidget()
        self.nav_tree.setHeaderHidden(True)
        self.nav_tree.header().setSectionResizeMode(0, QHeaderView.ResizeMode.Stretch)
        self.nav_tree.setMinimumWidth(260)
        self.nav_tree.setMaximumWidth(260)
        self.nav_tree.setHorizontalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOff)
        self.nav_tree.setIconSize(QSize(20, 20))
        self.nav_tree.setRootIsDecorated(False)
        self.nav_tree.itemSelectionChanged.connect(self.on_nav_changed)
        nav_layout.addWidget(self.nav_tree)
        
        # Bottom Area Switcher (D365 Model-Driven Pattern)
        self.area_switcher_box = QWidget()
        self.area_switcher_box.setStyleSheet("background-color: #faf9f8; border-top: 1px solid #e1dfdd; padding: 8px;")
        area_switcher_layout = QVBoxLayout(self.area_switcher_box)
        area_switcher_layout.setContentsMargins(0, 0, 0, 0)
        
        self.area_combo = QComboBox()
        self.area_combo.setObjectName("AreaSwitcher")
        for area in self.sitemap_structure:
            self.area_combo.addItem(area.get("title"), area.get("id"))
            
        self.area_combo.currentIndexChanged.connect(self.on_area_switched)
        area_switcher_layout.addWidget(self.area_combo)
        
        nav_layout.addWidget(self.area_switcher_box)
        main_content_layout.addWidget(self.nav_container)
        
        # --- Right Content Pane: Single Document Interface (SDI) with QStackedWidget ---
        self.main_stack = QStackedWidget()
        
        # Page 0: HomepageGrid View
        self.grid_page = QWidget()
        grid_layout = QVBoxLayout(self.grid_page)
        grid_layout.setContentsMargins(12, 10, 12, 12)
        grid_layout.setSpacing(8)
        
        # HomepageGrid Ribbon Command Bar (dynamically populated)
        self.grid_command_bar = QHBoxLayout()
        self.grid_command_bar.setContentsMargins(0, 0, 0, 4)
        self.grid_command_bar.setSpacing(6)
        grid_layout.addLayout(self.grid_command_bar)

        # Top Entity Header & View Selector Bar
        top_view_bar = QHBoxLayout()
        top_view_bar.setContentsMargins(0, 0, 0, 4)
        
        self.entity_header_label = QLabel("<b>Select a table</b>")
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
        grid_layout.addLayout(top_view_bar)
        
        # Homepage Data Grid
        self.data_grid = QTableWidget()
        self.data_grid.itemDoubleClicked.connect(self.open_record_from_grid)
        self.data_grid.itemSelectionChanged.connect(
            self.evaluate_homepage_ribbon_rules
        )
        self.data_grid.setSelectionBehavior(QTableWidget.SelectionBehavior.SelectRows)
        self.data_grid.setEditTriggers(QTableWidget.EditTrigger.NoEditTriggers)
        self.data_grid.setAlternatingRowColors(True)
        self.data_grid.horizontalHeader().setStretchLastSection(True)
        grid_layout.addWidget(self.data_grid)
        
        # Footer (Record Count & Status)
        self.footer_label = QLabel("Showing 0 records")
        self.footer_label.setStyleSheet("color: #605e5c; font-size: 12px; padding: 2px 4px;")
        grid_layout.addWidget(self.footer_label)
        
        self.main_stack.addWidget(self.grid_page)
        
        # Page 1: Inline Form View Container
        self.form_page = QWidget()
        self.form_page_layout = QVBoxLayout(self.form_page)
        self.form_page_layout.setContentsMargins(0, 0, 0, 0)
        self.main_stack.addWidget(self.form_page)

        # Page 2: Preserved online-only SiteMap destination
        self.route_page = QWidget()
        route_layout = QVBoxLayout(self.route_page)
        route_layout.setContentsMargins(32, 32, 32, 32)
        self.route_title = QLabel()
        self.route_title.setStyleSheet(
            "font-size: 20px; font-weight: 600; color: #201f1e;"
        )
        self.route_message = QLabel()
        self.route_message.setWordWrap(True)
        self.route_message.setStyleSheet(
            "font-size: 13px; color: #605e5c; padding-top: 8px;"
        )
        route_layout.addWidget(self.route_title)
        route_layout.addWidget(self.route_message)
        route_layout.addStretch()
        self.main_stack.addWidget(self.route_page)
        
        main_content_layout.addWidget(self.main_stack, 1)
        layout.addWidget(main_content_container)
        
        self.setCentralWidget(central)
        
        if self.current_area_id:
            self.render_active_area_sitemap(self.current_area_id)

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
            
        if hasattr(self, "sitemap_area_title"):
            self.sitemap_area_title.setText(str(area_def.get("title") or "MY WORK").upper())
            
        all_manifest_entities = {e.get("LogicalName"): e for e in self.config.get("entities", [])}
        
        for grp in area_def.get("groups", []):
            # Group Header (Category label in uppercase)
            group_title = grp.get("title") or grp.get("id") or "Tables"
            grp_item = QTreeWidgetItem([group_title.upper()])
            grp_item.setFlags(Qt.ItemFlag.ItemIsEnabled)
            font = grp_item.font(0)
            font.setBold(True)
            font.setPointSize(10)
            grp_item.setFont(0, font)
            grp_item.setForeground(0, Qt.GlobalColor.darkGray)
            
            for sub in grp.get("subareas", []):
                ent_name = sub.get("entity")
                if ent_name in all_manifest_entities:
                    disp_name = (
                        sub.get("title")
                        or self.display_names.get(
                            ent_name,
                            ent_name.replace("_", " ").title(),
                        )
                    )
                    sub_item = QTreeWidgetItem([disp_name])
                    sub_item.setData(0, Qt.ItemDataRole.UserRole, ent_name)
                    
                    # Resolve Icon
                    icon_name = sub.get("vector_icon") or sub.get("icon") or ""
                    if icon_name.startswith("$webresource:"):
                        icon_name = icon_name.split(":", 1)[1]
                    elif icon_name.startswith("/WebResources/"):
                        icon_name = icon_name.split("/", 2)[-1]
                        
                    if icon_name:
                        icon_path = os.path.abspath(os.path.join(
                            os.path.dirname(__file__), "webresources", "webresources", icon_name
                        ))
                        if os.path.exists(icon_path):
                            sub_item.setIcon(0, QIcon(icon_path))
                    
                    grp_item.addChild(sub_item)
                elif not ent_name:
                    sub_item = QTreeWidgetItem([
                        sub.get("title") or sub.get("id") or "Online item"
                    ])
                    sub_item.setData(0, SITEMAP_ROUTE_ROLE, sub)
                    sub_item.setToolTip(
                        0,
                        "This SiteMap destination requires the online "
                        "model-driven app.",
                    )
                    sub_item.setForeground(0, Qt.GlobalColor.darkGray)
                    grp_item.addChild(sub_item)
                    
            if grp_item.childCount() > 0:
                self.nav_tree.addTopLevelItem(grp_item)
                grp_item.setExpanded(True)
                
        # Select first valid subarea to trigger grid load
        self.select_default_nav_item()

    def _on_app_selector_changed(self, index):
        if index < 0 or not hasattr(self, "app_selector"):
            return
        selected_app_id = self.app_selector.itemData(index)
        selected_app_name = self.app_selector.itemText(index).strip()
        logger.info(f"App Selector changed to: {selected_app_name} (ID: {selected_app_id})")
        self.setWindowTitle(f"VerseOff | {selected_app_name} - Offline Client")

    def toggle_sitemap(self):
        self.nav_expanded = getattr(self, "nav_expanded", True)
        self.nav_expanded = not self.nav_expanded
        
        target_width = 260 if self.nav_expanded else 48
        self.nav_tree.setMinimumWidth(target_width)
        self.nav_tree.setMaximumWidth(target_width)
        if hasattr(self, "nav_container"):
            self.nav_container.setMinimumWidth(target_width)
            self.nav_container.setMaximumWidth(target_width)
        if hasattr(self, "sitemap_area_title"):
            self.sitemap_area_title.setVisible(self.nav_expanded)
        if hasattr(self, "sitemap_header_layout"):
            self.sitemap_header_layout.setContentsMargins(
                12 if self.nav_expanded else 4,
                0,
                8 if self.nav_expanded else 4,
                0,
            )
        self.area_switcher_box.setVisible(self.nav_expanded)
        self.hamburger_btn.setToolTip("Collapse SiteMap" if self.nav_expanded else "Expand SiteMap")

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
        if not entity_name:
            route = selected[0].data(0, SITEMAP_ROUTE_ROLE)
            if route:
                title = route.get("title", "Online destination")
                self.route_title.setText(title)
                destination_type = route.get(
                    "destination_type",
                    "online",
                )
                self.route_message.setText(
                    "This "
                    f"{destination_type.replace('_', ' ')} SiteMap item is "
                    "preserved from Dataverse, but it requires the online "
                    "model-driven app and is not interactive offline."
                )
                self.main_stack.setCurrentWidget(self.route_page)
            return
        
        # Switch back to HomepageGrid if currently viewing a record
        self.main_stack.setCurrentIndex(0)
        
        disp_name = self.display_names.get(entity_name, entity_name)
        self.entity_header_label.setText(f"<b>{disp_name}</b>")
        
        # Rebuild HomepageGrid Command Bar
        self.rebuild_homepage_ribbon(entity_name)
        
        # Populate View Selector
        self.view_combo.blockSignals(True)
        self.view_combo.clear()
        
        entity_definition = next(
            (
                entity
                for entity in self.config.get("entities", [])
                if entity.get("LogicalName") == entity_name
            ),
            {},
        )
        views = [
            view
            for view in entity_definition.get("saved_queries", [])
            if view.get("querytype") == 0
        ]
        views.sort(
            key=lambda view: (
                not bool(view.get("isdefault")),
                str(view.get("name") or "").casefold(),
            )
        )
        for view in views:
            self.view_combo.addItem(
                view.get("name") or "Unnamed view",
                view.get("savedqueryid"),
            )
        views_found = len(views)

        # Fallback Standard D365 System Views
        if views_found == 0:
            self.view_combo.addItem(f"Active {disp_name}s", "active_records")
            self.view_combo.addItem(f"All {disp_name}s", "all_records")
            self.view_combo.addItem(f"Inactive {disp_name}s", "inactive_records")
            
        self.view_combo.blockSignals(False)
        self.refresh_grid()

    def rebuild_homepage_ribbon(self, entity_name: str):
        self.grid_ribbon_widgets = []
        while self.grid_command_bar.count():
            item = self.grid_command_bar.takeAt(0)
            widget = item.widget()
            if widget: widget.deleteLater()
                
        ent_def = next((e for e in self.config.get("entities", []) if e.get("LogicalName") == entity_name), None)
        disp_name = self.display_names.get(entity_name, entity_name)
        
        # 1. Primary + New Button
        if entity_name in ("activitypointer", "activity"):
            # For polymorphic activitypointer, show a split/popup toolbutton with all concrete activity types
            new_btn = QToolButton()
            new_btn.setText("＋  New Activity")
            new_btn.setObjectName("PrimaryCmdBtn")
            new_btn.setPopupMode(QToolButton.ToolButtonPopupMode.InstantPopup)
            new_menu = QMenu(self)
            
            activity_entities = [
                ("task", "Task", "📝"),
                ("email", "Email", "✉️"),
                ("phonecall", "Phone Call", "📞"),
                ("appointment", "Appointment", "📅"),
                ("letter", "Letter", "✉️"),
                ("fax", "Fax", "📠"),
            ]
            all_manifest_ents = {e.get("LogicalName"): e for e in self.config.get("entities", [])}
            
            for act_code, act_label, act_icon in activity_entities:
                if act_code in all_manifest_ents or True:
                    action = new_menu.addAction(f"{act_icon}  {act_label}")
                    action.triggered.connect(lambda _, ent=act_code: self.open_form(ent, None))
                    
            new_btn.setMenu(new_menu)
            self.grid_command_bar.addWidget(new_btn)
        else:
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
        
        # Additional HomepageGrid commands from Ribbon XML
        if ent_def:
            ribbon = ent_def.get("ribbon") or {}
            ribbon_buttons = (
                ribbon.get("buttons")
                or ent_def.get("ribbon_buttons", [])
            )
            
            child_buttons_by_parent = {}
            seen = {"New", "Delete", "Refresh", f"New {disp_name}"}
            for btn in ribbon_buttons:
                if btn.get("location_type") == "homepage_grid":
                    pid = btn.get("parent_id", "")
                    lbl = btn.get("label", "")
                    if not lbl: continue
                    if pid == "" and lbl in seen:
                        continue
                    if pid == "": seen.add(lbl)
                    child_buttons_by_parent.setdefault(pid, []).append(btn)

            if child_buttons_by_parent.get(""):
                more_menu = QMenu(self)
                
                def add_menu_items(menu, parent_id):
                    children = sorted(child_buttons_by_parent.get(parent_id, []), key=lambda b: b.get("sequence", 0))
                    for btn in children:
                        lbl = btn.get("label", "")
                        if btn.get("control_type") in ("FlyoutAnchor", "SplitButton"):
                            submenu = menu.addMenu(lbl)
                            submenu.setToolTip(btn.get("tooltip") or "")
                            self.grid_ribbon_widgets.append({"widget": submenu.menuAction(), "data": btn})
                            add_menu_items(submenu, btn["id"])
                        else:
                            action = menu.addAction(lbl)
                            action.setToolTip(btn.get("tooltip") or "")
                            action.triggered.connect(
                                lambda _, data=btn: self.execute_homepage_command(data)
                            )
                            self.grid_ribbon_widgets.append({
                                "widget": action,
                                "data": btn,
                            })
                            
                add_menu_items(more_menu, "")
                
                more_button = QToolButton()
                more_button.setText("More commands")
                more_button.setPopupMode(
                    QToolButton.ToolButtonPopupMode.InstantPopup
                )
                more_button.setMenu(more_menu)
                more_button.setObjectName("CmdBtn")
                self.grid_command_bar.addWidget(more_button)

        self.grid_command_bar.addStretch()
        self.evaluate_homepage_ribbon_rules()

    def _homepage_rule_matches(self, rule):
        rule_type = rule.get("type")
        result = False
        if rule_type == "OrRule":
            result = any(
                self._homepage_rule_matches(child)
                for child in rule.get("children", [])
            )
        elif rule_type in {"AndRule", "And", "Or"}:
            result = all(
                self._homepage_rule_matches(child)
                for child in rule.get("children", [])
            )
        elif rule_type == "SelectionCountRule":
            selected_rows = {
                item.row()
                for item in self.data_grid.selectedItems()
            }
            count = len(selected_rows)
            try:
                minimum = int(rule.get("minimum", 0))
                maximum = int(rule.get("maximum", count))
                result = minimum <= count <= maximum
            except (TypeError, ValueError):
                result = True
        if str(rule.get("invert_result", "false")).lower() == "true":
            return not result
        return result

    def evaluate_homepage_ribbon_rules(self):
        for item in self.grid_ribbon_widgets:
            button = item["widget"]
            metadata = item["data"]
            visible = all(
                self._homepage_rule_matches(rule)
                for rule in metadata.get("display_rules", [])
            )
            enabled = all(
                self._homepage_rule_matches(rule)
                for rule in metadata.get("enable_rules", [])
            )
            button.setVisible(visible)
            button.setEnabled(enabled)

    def execute_homepage_command(self, button_data):
        command_name = str(button_data.get("command") or "")
        if command_name in {
            "Mscrm.HomepageGrid.NewRecord",
            "Mscrm.NewRecordFromGrid",
        }:
            selected = self.nav_tree.selectedItems()
            entity_name = (
                selected[0].data(0, Qt.ItemDataRole.UserRole)
                if selected
                else None
            )
            if entity_name:
                self.open_form(entity_name, None)
            return
        if command_name in {
            "Mscrm.DeleteSelectedRecords",
            "Mscrm.HomepageGrid.Delete",
        }:
            self.on_delete_record_clicked()
            return
        if command_name in {
            "Mscrm.HomepageGrid.Refresh",
            "Mscrm.RefreshGrid",
        }:
            self.refresh_grid()
            return
        QMessageBox.information(
            self,
            "Offline command",
            f"{button_data.get('label') or command_name} is preserved from "
            "Ribbon XML, but its online action is not available offline.",
        )

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
            self.db.queue_delete(entity_name, record_id)
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

        selected_view_id = str(self.view_combo.currentData() or "")
        selected_view = next(
            (
                view
                for view in (ent_def or {}).get("saved_queries", [])
                if str(view.get("savedqueryid") or "").strip("{}").lower()
                == selected_view_id.strip("{}").lower()
            ),
            None,
        )
        query_definition = ViewParser.parse_fetchxml(
            selected_view.get("fetchxml") if selected_view else ""
        )
        columns = ViewParser.parse_layoutxml(
            selected_view.get("layoutxml") if selected_view else ""
        )
        columns = [
            column
            for column in columns
            if not column.get("ishidden")
        ]

        # Build intelligent columns when the selected view has no layout.
        if ent_def and ent_def.get("attributes"):
            attrs = ent_def.get("attributes", [])
            attr_map = {a.get("LogicalName"): a for a in attrs if isinstance(a, dict)}
            if columns:
                for column in columns:
                    attribute = attr_map.get(column["name"], {})
                    if (
                        not column.get("label")
                        or column.get("label") == column["name"]
                    ):
                        column["label"] = (
                            attribute.get("DisplayName", {})
                            .get("UserLocalizedLabel", {})
                            .get("Label")
                            or column["name"].replace("_", " ").title()
                        )
            else:
                candidate_names = [
                    primary_name_attr,
                    "emailaddress1",
                    "telephone1",
                    "jobtitle",
                    "statecode",
                    "statuscode",
                    "createdon",
                    "modifiedon",
                ]
                seen_cols = set()
                for col_name in candidate_names:
                    if col_name in attr_map and col_name not in seen_cols:
                        seen_cols.add(col_name)
                        lbl = (
                            attr_map[col_name]
                            .get("DisplayName", {})
                            .get("UserLocalizedLabel", {})
                            .get("Label")
                            or col_name.replace("_", " ").title()
                        )
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
                    cursor.execute(
                        f"""
                        SELECT id, data_json, sync_status, last_modified
                        FROM {entity_name}
                        WHERE sync_status != 'pending_delete'
                        """
                    )
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

                if selected_view:
                    rows_data = ViewParser.apply_to_records(
                        query_definition,
                        rows_data,
                        search_string=search_string,
                    )
                elif search_string:
                    search_value = search_string.casefold()
                    rows_data = [
                        record
                        for record in rows_data
                        if any(
                            search_value in str(value or "").casefold()
                            for value in record.values()
                        )
                    ]
                elif selected_view_id == "active_records":
                    rows_data = [
                        record
                        for record in rows_data
                        if record.get("statecode") in (None, 0, "0")
                    ]
                elif selected_view_id == "inactive_records":
                    rows_data = [
                        record
                        for record in rows_data
                        if record.get("statecode") not in (None, 0, "0")
                    ]

                # Populate QTableWidget
                self.data_grid.setColumnCount(len(columns))
                
                attr_meta = {a["LogicalName"]: a for a in (ent_def or {}).get("attributes", []) if isinstance(a, dict)}
                headers = []
                for j, c in enumerate(columns):
                    lbl = c.get("label")
                    if not lbl or lbl == c["name"] or "." in lbl:
                        a = attr_meta.get(c["name"])
                        part = c["name"].split(".")[-1]
                        
                        if a and a.get("DisplayName"):
                            disp = a.get("DisplayName", {})
                            ul = disp.get("UserLocalizedLabel")
                            if ul and ul.get("Label"):
                                lbl = ul["Label"]
                            elif disp.get("LocalizedLabels") and disp["LocalizedLabels"][0].get("Label"):
                                lbl = disp["LocalizedLabels"][0]["Label"]
                            else:
                                lbl = part.replace("_", " ").title()
                        else:
                            # If we still have a dot in lbl, it's a raw alias string.
                            if lbl and "." in lbl:
                                part = lbl.split(".")[-1]
                            lbl = part.replace("_", " ").title()
                            # Extra cleanup for common squished words like Emailaddress1 -> Email Address 1
                            lbl = lbl.replace("address", " Address ").replace("1", " 1").strip()
                    headers.append(str(lbl))
                    
                    # Apply column width
                    width = c.get("width")
                    if width:
                        self.data_grid.setColumnWidth(j, int(width) + 20)
                
                self.data_grid.setHorizontalHeaderLabels(headers)
                self.data_grid.horizontalHeader().setStretchLastSection(True)
                self.data_grid.setRowCount(len(rows_data))

                for i, row in enumerate(rows_data):
                    rec_id = row.get(primary_id_attr) or row.get("id") or ""
                    for j, col in enumerate(columns):
                        val = str(row.get(col["name"], ""))
                        formatted_key = (
                            f"{col['name']}@"
                            "OData.Community.Display.V1.FormattedValue"
                        )
                        if formatted_key in row:
                            val = str(row[formatted_key])
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
            if entity_name in ("activitypointer", "activity"):
                # Determine concrete activity type (task, email, phonecall, etc.)
                concrete_type = first_cell.data(Qt.ItemDataRole.UserRole + 2)
                if not concrete_type:
                    try:
                        with self.db.get_connection() as conn:
                            cursor = conn.cursor()
                            cursor.execute("SELECT data_json FROM activitypointer WHERE id = ?", (record_id,))
                            rec = cursor.fetchone()
                            if rec and rec[0]:
                                d = json.loads(rec[0])
                                concrete_type = d.get("activitytypecode")
                    except Exception:
                        pass
                self.open_form(concrete_type or "task", record_id)
            else:
                self.open_form(entity_name, record_id)

    def open_form(self, entity_name, record_id):
        # Clear existing form from form_page_layout
        while self.form_page_layout.count():
            item = self.form_page_layout.takeAt(0)
            widget = item.widget()
            if widget:
                widget.deleteLater()
                
        self.current_form = XrmFormRenderer(self.config, entity_name, record_id, parent=self, on_close=self.close_form_view)
        self.form_page_layout.addWidget(self.current_form)
        self.main_stack.setCurrentIndex(1) # Inline transition to Form View

    def navigate_to_entity(self, entity_name, view_id=None):
        iterator = QTreeWidgetItemIterator(self.nav_tree)
        target = None
        while iterator.value():
            item = iterator.value()
            if item.data(0, Qt.ItemDataRole.UserRole) == entity_name:
                target = item
                break
            iterator += 1
        if target is None:
            raise ValueError(
                f"Table {entity_name!r} is not present in the SiteMap."
            )
        self.nav_tree.setCurrentItem(target)
        self.main_stack.setCurrentIndex(0)
        if view_id and hasattr(self, "view_combo"):
            normalized = str(view_id).strip().strip("{}").lower()
            for index in range(self.view_combo.count()):
                if (
                    str(self.view_combo.itemData(index) or "")
                    .strip()
                    .strip("{}")
                    .lower()
                    == normalized
                ):
                    self.view_combo.setCurrentIndex(index)
                    break
        self.refresh_grid()

    def close_form_view(self):
        self.main_stack.setCurrentIndex(0) # Return to HomepageGrid
        self.refresh_grid()

    def trigger_sync(self):
        if hasattr(self, 'worker') and self.worker.isRunning():
            return # Already syncing
            
        self.sync_btn.setText("Syncing...")
        self.sync_btn.setDisabled(True)
        
        self.worker = SyncWorker(self.manifest_path, self)
        self.worker.succeeded.connect(self.on_sync_finished)
        self.worker.error.connect(self.on_sync_error)
        self.worker.start()

    def on_sync_finished(self, summary):
        self.refresh_grid()
        self.sync_btn.setText("Sync Now")
        self.sync_btn.setDisabled(False)
        logger.info("Autonomous sync cycle completed: %s", summary)
        if self._close_after_sync:
            QTimer.singleShot(0, self.close)

    def on_sync_error(self, error_msg):
        logger.error(f"Sync failed: {error_msg}")
        self.sync_btn.setText("Sync Error")
        self.sync_btn.setDisabled(False)
        if self._close_after_sync:
            QTimer.singleShot(0, self.close)

    def closeEvent(self, event):
        self.sync_timer.stop()
        if hasattr(self, "worker") and self.worker.isRunning():
            self._close_after_sync = True
            self.sync_btn.setText("Closing after sync...")
            self.sync_btn.setDisabled(True)
            event.ignore()
            return
        super().closeEvent(event)

def setup_logging():
    log_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "app.log")
    formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(name)s - %(message)s")
    
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    
    for handler in list(root_logger.handlers):
        root_logger.removeHandler(handler)
        
    file_handler = logging.FileHandler(log_file, mode="a", encoding="utf-8")
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(formatter)
    root_logger.addHandler(file_handler)
    
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)
    root_logger.addHandler(console_handler)
    
    logging.info("=" * 60)
    logging.info("VerseOff application started.")
    logging.info(f"Logging initialized. Output written to: {log_file}")
    logging.info("=" * 60)

def global_exception_handler(exc_type, exc_value, exc_traceback):
    import traceback
    from PyQt6.QtWidgets import QMessageBox
    error_msg = "".join(traceback.format_exception(exc_type, exc_value, exc_traceback))
    logging.critical(f"CRASH: {error_msg}")
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
    setup_logging()
    sys.excepthook = global_exception_handler
    app = SafeApplication(sys.argv)
    window = OfflineApp()
    window.resize(1280, 800)
    window.show()
    window.raise_()
    window.activateWindow()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()