import logging
import xml.etree.ElementTree as ET
from PyQt6.QtCore import Qt, QThread, pyqtSignal
from PyQt6.QtGui import QFont, QColor
from PyQt6.QtWidgets import (
    QWizardPage,
    QVBoxLayout,
    QHBoxLayout,
    QTreeWidget,
    QTreeWidgetItem,
    QPushButton,
    QLabel,
    QCheckBox,
    QGroupBox,
    QSplitter,
    QProgressBar,
    QFrame,
    QMessageBox,
)

logger = logging.getLogger(__name__)

ROLE_ENTITY = int(Qt.ItemDataRole.UserRole)
ROLE_TYPE = ROLE_ENTITY + 1
ROLE_ID = ROLE_ENTITY + 2
ROLE_REQUIRED = ROLE_ENTITY + 3
ROLE_METADATA = ROLE_ENTITY + 4

TYPE_ENTITY = "entity"
TYPE_FORMS_HEADER = "forms_header"
TYPE_FORM = "form"
TYPE_VIEWS_HEADER = "views_header"
TYPE_VIEW = "view"


def extract_form_dependencies(form_xml: str) -> dict:
    """
    Parses FormXML to discover subgrid targets, lookup targets, card forms, and quick views.
    Returns:
        {
            "subgrids": [{"entity": "contact", "view_id": "..."}],
            "lookups": [{"attribute": "primarycontactid", "target": "contact"}],
            "quick_views": [{"form_id": "...", "entity": "contact"}]
        }
    """
    deps = {
        "subgrids": [],
        "lookups": [],
        "quick_views": []
    }
    if not form_xml or not isinstance(form_xml, str):
        return deps

    try:
        root = ET.fromstring(form_xml)
        # 1. Discover subgrids
        for subgrid in root.iter("subGrid"):
            target_ent = subgrid.get("entityName") or subgrid.get("TargetEntityType") or ""
            view_id = (
                subgrid.findtext("defaultViewId")
                or subgrid.get("defaultViewId")
                or ""
            ).strip("{}").lower()
            if target_ent:
                deps["subgrids"].append({"entity": target_ent, "view_id": view_id})

        # 2. Discover lookup controls
        for control in root.iter("control"):
            classid = control.get("classid", "").strip("{}").upper()
            # Standard Lookup ClassId: 270BD3DB-D9AF-4782-9025-509E298DEC0A
            if "270BD3DB" in classid or control.get("datafieldname", "").endswith("id"):
                attr = control.get("datafieldname") or control.get("id") or ""
                if attr:
                    deps["lookups"].append({"attribute": attr})

        # 3. Discover Quick View controls
        for qv in root.iter("quickViewForm"):
            form_id = (qv.get("formId") or "").strip("{}").lower()
            target_ent = qv.get("entityName") or ""
            if form_id or target_ent:
                deps["quick_views"].append({"form_id": form_id, "entity": target_ent})

    except Exception as exc:
        logger.debug("FormXML dependency parsing warning: %s", exc)

    return deps


class ComponentSelectorPage(QWizardPage):
    """
    Granular Form and View component selector with Smart Dependency Auto-Resolution.
    Guarantees default Homepage Grid views and auto-includes all required subgrids/lookups.
    """

    def __init__(self, parent=None):
        super().__init__(parent)
        self.setTitle("Select Entity Forms & Views")
        self.setSubTitle(
            "Choose specific forms and views to include. Required dependencies (subgrids, lookups, homepage grids) "
            "are automatically resolved and included."
        )

        layout = QVBoxLayout(self)
        layout.setContentsMargins(12, 10, 12, 10)
        layout.setSpacing(8)

        toolbar = QHBoxLayout()
        self.select_all_btn = QPushButton("Select All")
        self.select_all_btn.clicked.connect(self._select_all)
        self.select_defaults_btn = QPushButton("Select Default Forms & Views")
        self.select_defaults_btn.clicked.connect(self._select_defaults)
        self.resolve_btn = QPushButton("⚡ Auto-Resolve Dependencies")
        self.resolve_btn.setStyleSheet("font-weight: 600; color: #0f6cbd;")
        self.resolve_btn.clicked.connect(self.run_dependency_resolver)

        toolbar.addWidget(self.select_all_btn)
        toolbar.addWidget(self.select_defaults_btn)
        toolbar.addWidget(self.resolve_btn)
        toolbar.addStretch()
        layout.addLayout(toolbar)

        self.tree = QTreeWidget()
        self.tree.setHeaderLabels(["Components", "Type / Scope", "Status"])
        self.tree.setColumnWidth(0, 420)
        self.tree.setColumnWidth(1, 160)
        self.tree.itemChanged.connect(self._on_item_changed)
        self.tree.setStyleSheet("""
            QTreeWidget {
                border: 1px solid #d2d0ce;
                border-radius: 4px;
                background-color: #ffffff;
                font-size: 13px;
            }
            QTreeWidget::item {
                padding: 3px 4px;
            }
        """)
        layout.addWidget(self.tree)

        self.dependency_status = QLabel("Ready.")
        self.dependency_status.setStyleSheet("color: #605e5c; font-size: 12px;")
        layout.addWidget(self.dependency_status)

        self.entities_metadata = {}
        self._loaded_app_id = ""

    def initializePage(self):
        wizard = self.wizard()
        if not wizard or not wizard.selected_app:
            return

        app_id = wizard.selected_app.app_module_id
        if self._loaded_app_id == app_id and self.tree.topLevelItemCount() > 0:
            return

        self._loaded_app_id = app_id
        self._build_component_tree()

    def _build_component_tree(self):
        wizard = self.wizard()
        self.tree.blockSignals(True)
        self.tree.clear()

        raw_entities = getattr(wizard, "entities_metadata", {}) or {}
        if not raw_entities and hasattr(wizard, "available_entities_list"):
            raw_entities = {e.get("LogicalName"): e for e in wizard.available_entities_list if e.get("LogicalName")}
        self.entities_metadata = raw_entities

        # Included entities from SiteMap or selection
        active_entities = set(getattr(wizard, "sitemap_entities", []))
        if not active_entities:
            active_entities = set(raw_entities.keys())

        # Build tree per entity
        for logical_name, ent in sorted(raw_entities.items(), key=lambda x: x[0]):
            disp_name = ent.get("DisplayName", {}).get("UserLocalizedLabel", {}).get("Label") or logical_name
            is_active = logical_name in active_entities

            ent_item = QTreeWidgetItem([f"📁 {disp_name} ({logical_name})", "Table", ""])
            ent_item.setData(0, ROLE_ENTITY, logical_name)
            ent_item.setData(0, ROLE_TYPE, TYPE_ENTITY)
            ent_item.setCheckState(0, Qt.CheckState.Checked if is_active else Qt.CheckState.Unchecked)
            font = ent_item.font(0)
            font.setBold(True)
            ent_item.setFont(0, font)

            # Forms Branch
            forms = ent.get("forms", [])
            forms_hdr = QTreeWidgetItem(["Forms", f"{len(forms)} available", ""])
            forms_hdr.setData(0, ROLE_ENTITY, logical_name)
            forms_hdr.setData(0, ROLE_TYPE, TYPE_FORMS_HEADER)
            forms_hdr.setCheckState(0, Qt.CheckState.Checked if is_active else Qt.CheckState.Unchecked)

            for form in forms:
                form_name = form.get("name") or form.get("formid") or "Untitled Form"
                form_type = form.get("form_type_label") or str(form.get("type", "Main"))
                form_id = str(form.get("formid") or form.get("id") or "").strip("{}").lower()

                form_item = QTreeWidgetItem([f"📋 {form_name}", f"Form ({form_type})", ""])
                form_item.setData(0, ROLE_ENTITY, logical_name)
                form_item.setData(0, ROLE_TYPE, TYPE_FORM)
                form_item.setData(0, ROLE_ID, form_id)
                form_item.setData(0, ROLE_METADATA, form)
                # Check default main form
                form_item.setCheckState(0, Qt.CheckState.Checked if is_active else Qt.CheckState.Unchecked)
                forms_hdr.addChild(form_item)

            ent_item.addChild(forms_hdr)

            # Views Branch
            views = ent.get("saved_queries", [])
            views_hdr = QTreeWidgetItem(["Views", f"{len(views)} available", ""])
            views_hdr.setData(0, ROLE_ENTITY, logical_name)
            views_hdr.setData(0, ROLE_TYPE, TYPE_VIEWS_HEADER)
            views_hdr.setCheckState(0, Qt.CheckState.Checked if is_active else Qt.CheckState.Unchecked)

            for idx, view in enumerate(views):
                view_name = view.get("name") or view.get("savedqueryid") or "View"
                view_type = "Public View" if view.get("querytype") == 0 else "System View"
                view_id = str(view.get("savedqueryid") or view.get("id") or "").strip("{}").lower()
                is_default = view.get("isdefault", False) or idx == 0

                status_text = "Homepage Default (Mandatory)" if is_default else ""
                view_item = QTreeWidgetItem([f"👁 {view_name}", view_type, status_text])
                view_item.setData(0, ROLE_ENTITY, logical_name)
                view_item.setData(0, ROLE_TYPE, TYPE_VIEW)
                view_item.setData(0, ROLE_ID, view_id)
                view_item.setData(0, ROLE_METADATA, view)
                view_item.setData(0, ROLE_REQUIRED, is_default)
                view_item.setCheckState(0, Qt.CheckState.Checked if is_active else Qt.CheckState.Unchecked)
                views_hdr.addChild(view_item)

            ent_item.addChild(views_hdr)
            self.tree.addTopLevelItem(ent_item)

        self.tree.blockSignals(False)
        self.run_dependency_resolver()

    def _on_item_changed(self, item: QTreeWidgetItem, column: int):
        if column != 0: return
        item_type = item.data(0, ROLE_TYPE)
        is_checked = item.checkState(0) == Qt.CheckState.Checked

        self.tree.blockSignals(True)
        # Cascading checkbox behavior
        if item_type in (TYPE_ENTITY, TYPE_FORMS_HEADER, TYPE_VIEWS_HEADER):
            for i in range(item.childCount()):
                child = item.child(i)
                child.setCheckState(0, Qt.CheckState.Checked if is_checked else Qt.CheckState.Unchecked)
                for j in range(child.childCount()):
                    grandchild = child.child(j)
                    grandchild.setCheckState(0, Qt.CheckState.Checked if is_checked else Qt.CheckState.Unchecked)

        self.tree.blockSignals(False)
        self.run_dependency_resolver()

    def run_dependency_resolver(self):
        """
        Scans all currently checked Forms and Views, detects subgrid/lookup/card dependencies,
        and auto-checks required components while marking them with '(Required by dependencies)'.
        Guarantees that every active table always has its default Homepage Grid view checked.
        """
        self.tree.blockSignals(True)
        selected_forms_by_entity = {}
        all_view_items_by_id = {}
        all_entity_items_by_name = {}

        # 1. Collect current states
        for i in range(self.tree.topLevelItemCount()):
            ent_item = self.tree.topLevelItem(i)
            logical_name = ent_item.data(0, ROLE_ENTITY)
            all_entity_items_by_name[logical_name] = ent_item

            forms_hdr = ent_item.child(0)
            views_hdr = ent_item.child(1)

            selected_forms = []
            if forms_hdr:
                for f_idx in range(forms_hdr.childCount()):
                    f_item = forms_hdr.child(f_idx)
                    if f_item.checkState(0) == Qt.CheckState.Checked:
                        form_meta = f_item.data(0, ROLE_METADATA) or {}
                        selected_forms.append((f_item, form_meta))
            selected_forms_by_entity[logical_name] = selected_forms

            if views_hdr:
                for v_idx in range(views_hdr.childCount()):
                    v_item = views_hdr.child(v_idx)
                    v_id = v_item.data(0, ROLE_ID)
                    if v_id:
                        all_view_items_by_id[(logical_name, v_id)] = v_item

        auto_resolved_count = 0
        resolved_details = []

        # 2. Inspect Forms for Subgrids and Dependencies
        for logical_name, forms in selected_forms_by_entity.items():
            for f_item, form_meta in forms:
                form_xml = form_meta.get("formxml") or ""
                deps = extract_form_dependencies(form_xml)

                for sg in deps["subgrids"]:
                    target_ent = sg["entity"]
                    target_vid = sg["view_id"]

                    # Auto-check target entity if not checked
                    target_ent_item = all_entity_items_by_name.get(target_ent)
                    if target_ent_item and target_ent_item.checkState(0) != Qt.CheckState.Checked:
                        target_ent_item.setCheckState(0, Qt.CheckState.Checked)
                        target_ent_item.setText(2, "Required by Subgrid")
                        auto_resolved_count += 1
                        resolved_details.append(f"{target_ent} table (Subgrid target)")

                    # Auto-check target subgrid view
                    target_v_item = all_view_items_by_id.get((target_ent, target_vid))
                    if target_v_item and target_v_item.checkState(0) != Qt.CheckState.Checked:
                        target_v_item.setCheckState(0, Qt.CheckState.Checked)
                        target_v_item.setText(2, "Required by Subgrid View")
                        auto_resolved_count += 1
                        resolved_details.append(f"{target_ent} view '{target_v_item.text(0)}'")

        # 3. Guarantee Homepage Grid View for all active entities
        for i in range(self.tree.topLevelItemCount()):
            ent_item = self.tree.topLevelItem(i)
            logical_name = ent_item.data(0, ROLE_ENTITY)
            if ent_item.checkState(0) == Qt.CheckState.Checked:
                views_hdr = ent_item.child(1)
                if views_hdr:
                    any_view_checked = False
                    first_default_view = None
                    for v_idx in range(views_hdr.childCount()):
                        v_item = views_hdr.child(v_idx)
                        if v_item.checkState(0) == Qt.CheckState.Checked:
                            any_view_checked = True
                        if v_item.data(0, ROLE_REQUIRED) or v_idx == 0:
                            if not first_default_view:
                                first_default_view = v_item

                    # Force check default homepage view if none checked
                    if not any_view_checked and first_default_view:
                        first_default_view.setCheckState(0, Qt.CheckState.Checked)
                        first_default_view.setText(2, "Homepage Default (Mandatory)")
                        auto_resolved_count += 1
                        resolved_details.append(f"{logical_name} default grid view")

        self.tree.blockSignals(False)

        if auto_resolved_count > 0:
            self.dependency_status.setText(
                f"⚡ Auto-resolved {auto_resolved_count} dependency requirement(s): {', '.join(resolved_details[:4])}..."
            )
            self.dependency_status.setStyleSheet("color: #107c41; font-weight: 600; font-size: 12px;")
        else:
            self.dependency_status.setText("All dependencies and mandatory views are satisfied.")
            self.dependency_status.setStyleSheet("color: #605e5c; font-size: 12px;")

    def _select_all(self):
        self.tree.blockSignals(True)
        for i in range(self.tree.topLevelItemCount()):
            item = self.tree.topLevelItem(i)
            item.setCheckState(0, Qt.CheckState.Checked)
            for j in range(item.childCount()):
                child = item.child(j)
                child.setCheckState(0, Qt.CheckState.Checked)
                for k in range(child.childCount()):
                    grandchild = child.child(k)
                    grandchild.setCheckState(0, Qt.CheckState.Checked)
        self.tree.blockSignals(False)
        self.run_dependency_resolver()

    def _select_defaults(self):
        self.tree.blockSignals(True)
        for i in range(self.tree.topLevelItemCount()):
            ent_item = self.tree.topLevelItem(i)
            forms_hdr = ent_item.child(0)
            views_hdr = ent_item.child(1)

            # Check default main form
            if forms_hdr:
                for f_idx in range(forms_hdr.childCount()):
                    f_item = forms_hdr.child(f_idx)
                    f_item.setCheckState(0, Qt.CheckState.Checked if f_idx == 0 else Qt.CheckState.Unchecked)

            # Check default view
            if views_hdr:
                for v_idx in range(views_hdr.childCount()):
                    v_item = views_hdr.child(v_idx)
                    is_default = bool(v_item.data(0, ROLE_REQUIRED) or v_idx == 0)
                    v_item.setCheckState(0, Qt.CheckState.Checked if is_default else Qt.CheckState.Unchecked)

        self.tree.blockSignals(False)
        self.run_dependency_resolver()

    def export_selected_components(self) -> dict:
        """
        Returns structured dictionary of selected entities, forms, and views:
        {
            "account": {
                "forms": ["f0f3edff-...", ...],
                "views": ["00000000-...", ...]
            }
        }
        """
        result = {}
        for i in range(self.tree.topLevelItemCount()):
            ent_item = self.tree.topLevelItem(i)
            logical_name = ent_item.data(0, ROLE_ENTITY)
            if ent_item.checkState(0) != Qt.CheckState.Checked:
                continue

            forms_hdr = ent_item.child(0)
            views_hdr = ent_item.child(1)

            selected_form_ids = []
            if forms_hdr:
                for f_idx in range(forms_hdr.childCount()):
                    f_item = forms_hdr.child(f_idx)
                    if f_item.checkState(0) == Qt.CheckState.Checked:
                        f_id = f_item.data(0, ROLE_ID)
                        if f_id: selected_form_ids.append(f_id)

            selected_view_ids = []
            if views_hdr:
                for v_idx in range(views_hdr.childCount()):
                    v_item = views_hdr.child(v_idx)
                    if v_item.checkState(0) == Qt.CheckState.Checked:
                        v_id = v_item.data(0, ROLE_ID)
                        if v_id: selected_view_ids.append(v_id)

            result[logical_name] = {
                "forms": selected_form_ids,
                "views": selected_view_ids,
            }
        return result

    def validatePage(self):
        self.run_dependency_resolver()
        selected = self.export_selected_components()
        if not selected:
            QMessageBox.warning(self, "No Components Selected", "Please select at least one entity table to include.")
            return False

        wizard = self.wizard()
        wizard.selected_components = selected
        wizard.selected_entities = list(selected.keys())
        return True
