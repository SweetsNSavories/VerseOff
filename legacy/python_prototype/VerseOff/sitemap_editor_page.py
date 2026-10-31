import copy
import logging
from PyQt6.QtCore import Qt
from PyQt6.QtGui import QIcon, QFont
from PyQt6.QtWidgets import (
    QWizardPage,
    QVBoxLayout,
    QHBoxLayout,
    QTreeWidget,
    QTreeWidgetItem,
    QPushButton,
    QLabel,
    QLineEdit,
    QComboBox,
    QInputDialog,
    QMessageBox,
    QGroupBox,
    QSplitter,
    QFrame,
)

logger = logging.getLogger(__name__)

ITEM_TYPE_AREA = "Area"
ITEM_TYPE_GROUP = "Group"
ITEM_TYPE_SUBAREA = "SubArea"

ROLE_ITEM_TYPE = int(Qt.ItemDataRole.UserRole)
ROLE_ITEM_DATA = ROLE_ITEM_TYPE + 1


class SiteMapEditorPage(QWizardPage):
    """
    Interactive SiteMap Editor Page in VerseOff Maker Studio.
    Allows makers to visually customize Areas, Groups, and Subareas (adding,
    deleting, renaming, reordering, and re-binding entities).
    """

    def __init__(self, parent=None):
        super().__init__(parent)
        self.setTitle("Customize SiteMap Navigation")
        self.setSubTitle(
            "Modify areas, groups, and subareas. Add custom navigation items or reorder the sitemap structure."
        )

        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(12, 10, 12, 10)
        main_layout.setSpacing(10)

        splitter = QSplitter(Qt.Orientation.Horizontal)

        # Left Column: Tree + Action Toolbar
        left_container = QFrame()
        left_layout = QVBoxLayout(left_container)
        left_layout.setContentsMargins(0, 0, 0, 0)
        left_layout.setSpacing(8)

        toolbar = QHBoxLayout()
        toolbar.setSpacing(6)

        self.add_area_btn = QPushButton("+ Area")
        self.add_area_btn.setToolTip("Add a new top-level Area")
        self.add_area_btn.clicked.connect(self._add_area)

        self.add_group_btn = QPushButton("+ Group")
        self.add_group_btn.setToolTip("Add a Group under selected Area")
        self.add_group_btn.clicked.connect(self._add_group)

        self.add_subarea_btn = QPushButton("+ Subarea")
        self.add_subarea_btn.setToolTip("Add a Subarea / Table under selected Group")
        self.add_subarea_btn.clicked.connect(self._add_subarea)

        self.move_up_btn = QPushButton("▲ Up")
        self.move_up_btn.setToolTip("Move selected item up")
        self.move_up_btn.clicked.connect(self._move_up)

        self.move_down_btn = QPushButton("▼ Down")
        self.move_down_btn.setToolTip("Move selected item down")
        self.move_down_btn.clicked.connect(self._move_down)

        self.delete_btn = QPushButton("✕ Delete")
        self.delete_btn.setStyleSheet("color: #d13438; font-weight: 500;")
        self.delete_btn.setToolTip("Delete selected item")
        self.delete_btn.clicked.connect(self._delete_item)

        toolbar.addWidget(self.add_area_btn)
        toolbar.addWidget(self.add_group_btn)
        toolbar.addWidget(self.add_subarea_btn)
        toolbar.addWidget(self.move_up_btn)
        toolbar.addWidget(self.move_down_btn)
        toolbar.addWidget(self.delete_btn)
        toolbar.addStretch()
        left_layout.addLayout(toolbar)

        self.tree = QTreeWidget()
        self.tree.setHeaderLabels(["SiteMap Navigation Hierarchy"])
        self.tree.itemSelectionChanged.connect(self._on_tree_selection_changed)
        self.tree.setStyleSheet("""
            QTreeWidget {
                border: 1px solid #d2d0ce;
                border-radius: 4px;
                background-color: #ffffff;
                font-size: 13px;
                padding: 4px;
            }
            QTreeWidget::item {
                padding: 4px 6px;
            }
            QTreeWidget::item:selected {
                background-color: #edebe9;
                color: #0f6cbd;
            }
        """)
        left_layout.addWidget(self.tree)
        splitter.addWidget(left_container)

        # Right Column: Item Properties Editor
        self.properties_box = QGroupBox("Selected Item Properties")
        prop_layout = QVBoxLayout(self.properties_box)
        prop_layout.setContentsMargins(12, 12, 12, 12)
        prop_layout.setSpacing(10)

        self.item_type_label = QLabel("<b>Select an item from the tree to edit</b>")
        self.item_type_label.setStyleSheet("color: #605e5c;")
        prop_layout.addWidget(self.item_type_label)

        # Title Field
        title_row = QHBoxLayout()
        title_row.addWidget(QLabel("Title / Label:"))
        self.title_input = QLineEdit()
        self.title_input.textChanged.connect(self._on_title_changed)
        title_row.addWidget(self.title_input)
        prop_layout.addLayout(title_row)

        # ID Field
        id_row = QHBoxLayout()
        id_row.addWidget(QLabel("Unique ID:"))
        self.id_input = QLineEdit()
        self.id_input.textChanged.connect(self._on_id_changed)
        id_row.addWidget(self.id_input)
        prop_layout.addLayout(id_row)

        # Subarea Entity Binding
        self.entity_row = QHBoxLayout()
        self.entity_label = QLabel("Bound Table:")
        self.entity_combo = QComboBox()
        self.entity_combo.currentIndexChanged.connect(self._on_entity_changed)
        self.entity_row.addWidget(self.entity_label)
        self.entity_row.addWidget(self.entity_combo)
        prop_layout.addLayout(self.entity_row)

        # Reset button
        self.reset_btn = QPushButton("Reset to Original SiteMap")
        self.reset_btn.setStyleSheet("color: #a4262c;")
        self.reset_btn.clicked.connect(self._reset_sitemap)
        prop_layout.addStretch()
        prop_layout.addWidget(self.reset_btn)

        splitter.addWidget(self.properties_box)
        splitter.setSizes([380, 260])
        main_layout.addWidget(splitter)

        self.raw_sitemap = {}
        self.available_entities = []
        self._loaded_app_id = ""

    def initializePage(self):
        wizard = self.wizard()
        if not wizard or not wizard.selected_app:
            return

        app_id = wizard.selected_app.app_module_id
        if self._loaded_app_id == app_id and self.tree.topLevelItemCount() > 0:
            return

        self._loaded_app_id = app_id
        self._load_data()

    def _load_data(self):
        wizard = self.wizard()
        self.tree.clear()

        # Fetch entities for dropdown
        self.available_entities = getattr(wizard, "available_entities_list", None)
        if not self.available_entities and wizard and getattr(wizard, "selected_app", None):
            try:
                from VerseOff.metadata_fetcher import MetadataFetcher
            except ImportError:
                from metadata_fetcher import MetadataFetcher
            try:
                org_url = wizard.field("org_url") or getattr(wizard, "org_url", "")
                token = getattr(wizard, "auth_token", "")
                fetcher = MetadataFetcher(org_url, token)
                app_id = wizard.selected_app.app_module_id
                self.available_entities = fetcher.get_entities_for_app(app_id)
                wizard.available_entities_list = self.available_entities
            except Exception as exc:
                logger.warning(f"Could not load entities for sitemap dropdown: {exc}")
                self.available_entities = []

        self.entity_combo.blockSignals(True)
        self.entity_combo.clear()
        self.entity_combo.addItem("(None / Online URL)", "")
        for ent in sorted(self.available_entities or [], key=lambda e: e.get("LogicalName", "")):
            lname = ent.get("LogicalName")
            disp = ent.get("DisplayName", {}).get("UserLocalizedLabel", {}).get("Label") or lname
            self.entity_combo.addItem(f"{disp} ({lname})", lname)
        self.entity_combo.blockSignals(False)

        # Load SiteMap from wizard or fetch actual sitemap live/cache
        self.raw_sitemap = copy.deepcopy(getattr(wizard, "sitemap_data", None))
        if not self.raw_sitemap and wizard and getattr(wizard, "selected_app", None):
            try:
                from VerseOff.metadata_fetcher import MetadataFetcher
            except ImportError:
                from metadata_fetcher import MetadataFetcher
            try:
                org_url = wizard.field("org_url") or getattr(wizard, "org_url", "")
                token = getattr(wizard, "auth_token", "")
                fetcher = MetadataFetcher(org_url, token)
                app_id = wizard.selected_app.app_module_id
                self.raw_sitemap = fetcher.get_app_sitemap(app_id)
                wizard.sitemap_data = self.raw_sitemap
            except Exception as exc:
                logger.error(f"Could not fetch sitemap for app: {exc}")
                self.raw_sitemap = {"areas": []}

        self._populate_tree_from_sitemap(self.raw_sitemap or {})
        self._on_tree_selection_changed()

    def _populate_tree_from_sitemap(self, sitemap_data: dict):
        self.tree.clear()
        areas = sitemap_data.get("areas", [])
        for area in areas:
            area_title = area.get("title") or area.get("id") or "Area"
            area_item = QTreeWidgetItem([f"🌐 Area: {area_title}"])
            area_item.setData(0, ROLE_ITEM_TYPE, ITEM_TYPE_AREA)
            area_item.setData(0, ROLE_ITEM_DATA, area)
            font = area_item.font(0)
            font.setBold(True)
            area_item.setFont(0, font)

            for group in area.get("groups", []):
                group_title = group.get("title") or group.get("id") or "Group"
                group_item = QTreeWidgetItem([f"📁 Group: {group_title}"])
                group_item.setData(0, ROLE_ITEM_TYPE, ITEM_TYPE_GROUP)
                group_item.setData(0, ROLE_ITEM_DATA, group)

                for sub in group.get("subareas", []):
                    sub_title = sub.get("title") or sub.get("id") or sub.get("entity") or "SubArea"
                    ent_str = f" [Table: {sub.get('entity')}]" if sub.get("entity") else ""
                    sub_item = QTreeWidgetItem([f"📄 {sub_title}{ent_str}"])
                    sub_item.setData(0, ROLE_ITEM_TYPE, ITEM_TYPE_SUBAREA)
                    sub_item.setData(0, ROLE_ITEM_DATA, sub)
                    group_item.addChild(sub_item)

                area_item.addChild(group_item)
                group_item.setExpanded(True)

            self.tree.addTopLevelItem(area_item)
            area_item.setExpanded(True)

        if self.tree.topLevelItemCount() > 0:
            self.tree.setCurrentItem(self.tree.topLevelItem(0))

    def _on_tree_selection_changed(self):
        items = self.tree.selectedItems()
        if not items:
            self.properties_box.setEnabled(False)
            self.item_type_label.setText("<b>Select an item from the tree to edit</b>")
            self.title_input.clear()
            self.id_input.clear()
            self.entity_combo.setCurrentIndex(0)
            return

        self.properties_box.setEnabled(True)
        item = items[0]
        item_type = item.data(0, ROLE_ITEM_TYPE)
        data = item.data(0, ROLE_ITEM_DATA) or {}

        self.item_type_label.setText(f"<b>Editing {item_type}:</b> {data.get('title') or data.get('id') or ''}")
        
        self.title_input.blockSignals(True)
        self.title_input.setText(str(data.get("title") or ""))
        self.title_input.blockSignals(False)

        self.id_input.blockSignals(True)
        self.id_input.setText(str(data.get("id") or ""))
        self.id_input.blockSignals(False)

        is_subarea = item_type == ITEM_TYPE_SUBAREA
        self.entity_label.setVisible(is_subarea)
        self.entity_combo.setVisible(is_subarea)

        if is_subarea:
            cur_entity = data.get("entity") or ""
            self.entity_combo.blockSignals(True)
            index = self.entity_combo.findData(cur_entity)
            self.entity_combo.setCurrentIndex(index if index >= 0 else 0)
            self.entity_combo.blockSignals(False)

    def _on_title_changed(self, new_title: str):
        items = self.tree.selectedItems()
        if not items: return
        item = items[0]
        data = item.data(0, ROLE_ITEM_DATA) or {}
        data["title"] = new_title
        item.setData(0, ROLE_ITEM_DATA, data)
        self._update_item_display_text(item)

    def _on_id_changed(self, new_id: str):
        items = self.tree.selectedItems()
        if not items: return
        item = items[0]
        data = item.data(0, ROLE_ITEM_DATA) or {}
        data["id"] = new_id
        item.setData(0, ROLE_ITEM_DATA, data)
        self._update_item_display_text(item)

    def _on_entity_changed(self, index: int):
        items = self.tree.selectedItems()
        if not items: return
        item = items[0]
        if item.data(0, ROLE_ITEM_TYPE) != ITEM_TYPE_SUBAREA: return
        data = item.data(0, ROLE_ITEM_DATA) or {}
        selected_ent = self.entity_combo.itemData(index) or ""
        data["entity"] = selected_ent
        item.setData(0, ROLE_ITEM_DATA, data)
        self._update_item_display_text(item)

    def _update_item_display_text(self, item: QTreeWidgetItem):
        item_type = item.data(0, ROLE_ITEM_TYPE)
        data = item.data(0, ROLE_ITEM_DATA) or {}
        title = data.get("title") or data.get("id") or "Untitled"
        if item_type == ITEM_TYPE_AREA:
            item.setText(0, f"🌐 Area: {title}")
        elif item_type == ITEM_TYPE_GROUP:
            item.setText(0, f"📁 Group: {title}")
        elif item_type == ITEM_TYPE_SUBAREA:
            ent_str = f" [Table: {data.get('entity')}]" if data.get("entity") else ""
            item.setText(0, f"📄 {title}{ent_str}")

    def _add_area(self):
        title, ok = QInputDialog.getText(self, "Add Area", "Enter Area title:")
        if not ok or not title.strip(): return
        clean_title = title.strip()
        new_area = {
            "id": f"Area_{clean_title.replace(' ', '_')}",
            "title": clean_title,
            "groups": []
        }
        item = QTreeWidgetItem([f"🌐 Area: {clean_title}"])
        item.setData(0, ROLE_ITEM_TYPE, ITEM_TYPE_AREA)
        item.setData(0, ROLE_ITEM_DATA, new_area)
        font = item.font(0)
        font.setBold(True)
        item.setFont(0, font)
        self.tree.addTopLevelItem(item)
        self.tree.setCurrentItem(item)

    def _add_group(self):
        selected = self.tree.selectedItems()
        if not selected:
            QMessageBox.information(self, "Select Area", "Please select an Area first to add a Group.")
            return
        cur_item = selected[0]
        area_item = cur_item if cur_item.data(0, ROLE_ITEM_TYPE) == ITEM_TYPE_AREA else cur_item.parent()
        if not area_item or area_item.data(0, ROLE_ITEM_TYPE) != ITEM_TYPE_AREA:
            area_item = self.tree.topLevelItem(0)

        title, ok = QInputDialog.getText(self, "Add Group", "Enter Group title:")
        if not ok or not title.strip(): return
        clean_title = title.strip()
        new_group = {
            "id": f"Group_{clean_title.replace(' ', '_')}",
            "title": clean_title,
            "subareas": []
        }
        item = QTreeWidgetItem([f"📁 Group: {clean_title}"])
        item.setData(0, ROLE_ITEM_TYPE, ITEM_TYPE_GROUP)
        item.setData(0, ROLE_ITEM_DATA, new_group)
        area_item.addChild(item)
        area_item.setExpanded(True)
        self.tree.setCurrentItem(item)

    def _add_subarea(self):
        selected = self.tree.selectedItems()
        if not selected:
            QMessageBox.information(self, "Select Group", "Please select a Group first to add a Subarea.")
            return
        cur_item = selected[0]
        group_item = None
        if cur_item.data(0, ROLE_ITEM_TYPE) == ITEM_TYPE_GROUP:
            group_item = cur_item
        elif cur_item.data(0, ROLE_ITEM_TYPE) == ITEM_TYPE_SUBAREA:
            group_item = cur_item.parent()
        elif cur_item.data(0, ROLE_ITEM_TYPE) == ITEM_TYPE_AREA and cur_item.childCount() > 0:
            group_item = cur_item.child(0)

        if not group_item:
            QMessageBox.warning(self, "No Group", "Please create and select a Group inside an Area first.")
            return

        title, ok = QInputDialog.getText(self, "Add Subarea", "Enter Subarea title:")
        if not ok or not title.strip(): return
        clean_title = title.strip()
        new_sub = {
            "id": f"SubArea_{clean_title.replace(' ', '_')}",
            "title": clean_title,
            "entity": ""
        }
        item = QTreeWidgetItem([f"📄 {clean_title}"])
        item.setData(0, ROLE_ITEM_TYPE, ITEM_TYPE_SUBAREA)
        item.setData(0, ROLE_ITEM_DATA, new_sub)
        group_item.addChild(item)
        group_item.setExpanded(True)
        self.tree.setCurrentItem(item)

    def _delete_item(self):
        selected = self.tree.selectedItems()
        if not selected: return
        item = selected[0]
        parent = item.parent()
        if parent:
            parent.removeChild(item)
        else:
            index = self.tree.indexOfTopLevelItem(item)
            self.tree.takeTopLevelItem(index)
        self._on_tree_selection_changed()

    def _move_up(self):
        selected = self.tree.selectedItems()
        if not selected: return
        item = selected[0]
        parent = item.parent()
        if parent:
            idx = parent.indexOfChild(item)
            if idx > 0:
                parent.takeChild(idx)
                parent.insertChild(idx - 1, item)
                self.tree.setCurrentItem(item)
        else:
            idx = self.tree.indexOfTopLevelItem(item)
            if idx > 0:
                self.tree.takeTopLevelItem(idx)
                self.tree.insertTopLevelItem(idx - 1, item)
                self.tree.setCurrentItem(item)

    def _move_down(self):
        selected = self.tree.selectedItems()
        if not selected: return
        item = selected[0]
        parent = item.parent()
        if parent:
            idx = parent.indexOfChild(item)
            if idx < parent.childCount() - 1:
                parent.takeChild(idx)
                parent.insertChild(idx + 1, item)
                self.tree.setCurrentItem(item)
        else:
            idx = self.tree.indexOfTopLevelItem(item)
            if idx < self.tree.topLevelItemCount() - 1:
                self.tree.takeTopLevelItem(idx)
                self.tree.insertTopLevelItem(idx + 1, item)
                self.tree.setCurrentItem(item)

    def _reset_sitemap(self):
        reply = QMessageBox.question(
            self,
            "Reset SiteMap",
            "Are you sure you want to discard all changes and reload the original SiteMap from Dataverse?",
            QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No
        )
        if reply == QMessageBox.StandardButton.Yes:
            self._populate_tree_from_sitemap(self.raw_sitemap)

    def export_modified_sitemap(self) -> dict:
        """Serializes current tree state into canonical SiteMap dictionary."""
        areas = []
        for i in range(self.tree.topLevelItemCount()):
            area_item = self.tree.topLevelItem(i)
            area_data = dict(area_item.data(0, ROLE_ITEM_DATA) or {})
            groups = []
            for j in range(area_item.childCount()):
                group_item = area_item.child(j)
                group_data = dict(group_item.data(0, ROLE_ITEM_DATA) or {})
                subareas = []
                for k in range(group_item.childCount()):
                    sub_item = group_item.child(k)
                    sub_data = dict(sub_item.data(0, ROLE_ITEM_DATA) or {})
                    subareas.append(sub_data)
                group_data["subareas"] = subareas
                groups.append(group_data)
            area_data["groups"] = groups
            areas.append(area_data)

        return {"areas": areas}

    def validatePage(self):
        modified_sitemap = self.export_modified_sitemap()
        wizard = self.wizard()
        wizard.modified_sitemap = modified_sitemap
        
        # Collect entities added directly in the sitemap
        sitemap_entities = set()
        for area in modified_sitemap.get("areas", []):
            for grp in area.get("groups", []):
                for sub in grp.get("subareas", []):
                    ent = sub.get("entity")
                    if ent:
                        sitemap_entities.add(ent)
        wizard.sitemap_entities = list(sitemap_entities)
        return True
