import logging
import os
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlparse

from PyQt6.QtCore import QThread, Qt, QUrl, pyqtSignal
from PyQt6.QtGui import QDesktopServices
from PyQt6.QtWidgets import (
    QApplication,
    QFileDialog,
    QFormLayout,
    QHBoxLayout,
    QInputDialog,
    QLabel,
    QLineEdit,
    QListWidget,
    QListWidgetItem,
    QMessageBox,
    QProgressBar,
    QPushButton,
    QSpinBox,
    QVBoxLayout,
    QWizard,
    QWizardPage,
    QComboBox,
    QCheckBox,
)

try:
    from VerseOff.auth import MsalAuth
    from VerseOff.generation import (
        GenerationRequest,
        ModelDrivenApp,
        SourceProjectBuilder,
        bpf_entity_names,
        normalize_entity_names,
        project_directory_name,
    )
    from VerseOff.metadata_fetcher import MetadataFetcher
    from VerseOff.sitemap_editor_page import SiteMapEditorPage
    from VerseOff.component_selector_page import ComponentSelectorPage
except ImportError:
    from auth import MsalAuth
    from generation import (
        GenerationRequest,
        ModelDrivenApp,
        SourceProjectBuilder,
        bpf_entity_names,
        normalize_entity_names,
        project_directory_name,
    )
    from metadata_fetcher import MetadataFetcher
    from sitemap_editor_page import SiteMapEditorPage
    from component_selector_page import ComponentSelectorPage


logger = logging.getLogger(__name__)
ENTITY_ROLE = int(Qt.ItemDataRole.UserRole)
REQUIRED_ROLE = ENTITY_ROLE + 1


def _display_label(entity: dict) -> str:
    display_name = entity.get("DisplayName") or {}
    localized = display_name.get("UserLocalizedLabel") or {}
    return localized.get("Label") or entity.get("LogicalName") or "Table"


class AuthWorker(QThread):
    authenticated = pyqtSignal(str)
    error = pyqtSignal(str)

    def __init__(self, org_url: str, client_id: str = "", parent=None):
        super().__init__(parent)
        self.org_url = org_url
        self.client_id = client_id

    def run(self):
        try:
            auth = MsalAuth(
                org_url=self.org_url,
                client_id=self.client_id or None,
            )
            token = auth.get_token()
            if not token:
                raise RuntimeError("Microsoft authentication returned no access token.")

            MetadataFetcher(
                self.org_url,
                token,
                use_cache=False,
            ).who_am_i()
            self.authenticated.emit(token)
        except Exception as exc:
            logger.exception("Dataverse authentication failed")
            self.error.emit(str(exc))


class AppFetchWorker(QThread):
    completed = pyqtSignal(object)
    failed = pyqtSignal(str)

    def __init__(self, org_url: str, token: str, parent=None):
        super().__init__(parent)
        self.org_url = org_url
        self.token = token

    def run(self):
        try:
            apps = MetadataFetcher(
                self.org_url,
                self.token,
                use_cache=False,
            ).get_app_modules()
            self.completed.emit(apps)
        except Exception as exc:
            logger.exception("Could not load model-driven apps")
            self.failed.emit(str(exc))


class ComponentFetchWorker(QThread):
    completed = pyqtSignal(object, object)
    failed = pyqtSignal(str)

    def __init__(self, org_url: str, token: str, app_module_id: str, parent=None):
        super().__init__(parent)
        self.org_url = org_url
        self.token = token
        self.app_module_id = app_module_id

    def run(self):
        try:
            fetcher = MetadataFetcher(
                self.org_url,
                self.token,
                use_cache=False,
            )
            entities = fetcher.get_entities_for_app(self.app_module_id)
            bpfs = fetcher.get_bpf_definitions_for_app(self.app_module_id)
            self.completed.emit(entities, bpfs)
        except Exception as exc:
            logger.exception("Could not load app components")
            self.failed.emit(str(exc))


class ConnectionPage(QWizardPage):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setTitle("Connect to Dataverse")
        self.setSubTitle(
            "Authenticate to the environment that contains the model-driven app."
        )

        layout = QVBoxLayout(self)
        form = QFormLayout()

        self.url_input = QLineEdit(os.getenv("DATAVERSE_URL", ""))
        self.url_input.setPlaceholderText("https://yourorg.crm.dynamics.com")
        self.url_input.textChanged.connect(self._validate_input)

        self.client_id_input = QLineEdit(os.getenv("VERSEOFF_CLIENT_ID", ""))
        self.client_id_input.setPlaceholderText(
            "Optional; uses the Microsoft public client when blank"
        )

        form.addRow("Dataverse URL:", self.url_input)
        form.addRow("Entra ID client ID:", self.client_id_input)
        layout.addLayout(form)

        self.connect_btn = QPushButton("Connect and authenticate")
        self.connect_btn.clicked.connect(self.authenticate)
        layout.addWidget(self.connect_btn)

        self.status_label = QLabel("Not connected.")
        self.status_label.setWordWrap(True)
        layout.addWidget(self.status_label)
        layout.addStretch()

        self.registerField("org_url*", self.url_input)
        self.registerField("client_id", self.client_id_input)

        self.auth_token = ""
        self.worker = None
        self._validate_input(self.url_input.text())

    @staticmethod
    def _is_valid_url(value: str) -> bool:
        parsed = urlparse(value.strip())
        return parsed.scheme == "https" and bool(parsed.netloc)

    def _validate_input(self, text: str):
        self.connect_btn.setEnabled(
            self._is_valid_url(text)
            and not (self.worker and self.worker.isRunning())
        )

    def authenticate(self):
        org_url = self.url_input.text().strip()
        if not self._is_valid_url(org_url):
            QMessageBox.warning(
                self,
                "Invalid environment URL",
                "Enter a complete HTTPS Dataverse environment URL.",
            )
            return

        self.connect_btn.setEnabled(False)
        self.status_label.setText(
            "Waiting for Microsoft sign-in and validating Dataverse access..."
        )
        self.worker = AuthWorker(
            org_url,
            self.client_id_input.text().strip(),
            self,
        )
        self.worker.authenticated.connect(self._on_authenticated)
        self.worker.error.connect(self._on_auth_error)
        self.worker.start()

    def _on_authenticated(self, token: str):
        self.auth_token = token
        self.status_label.setText("Connected to Dataverse.")
        self.connect_btn.setEnabled(True)
        wizard = self.wizard()
        if wizard:
            wizard.auth_token = token
            self.completeChanged.emit()
            wizard.next()

    def _on_auth_error(self, error_message: str):
        self.connect_btn.setEnabled(True)
        self.status_label.setText(f"Connection failed: {error_message}")
        QMessageBox.critical(
            self,
            "Dataverse connection failed",
            error_message,
        )

    def isComplete(self):
        return bool(self.auth_token)


class AppSelectionPage(QWizardPage):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setTitle("Select a model-driven app")
        self.setSubTitle(
            "The generated source project will use this app's tables, SiteMap, "
            "forms, views, ribbons, and business processes."
        )

        layout = QVBoxLayout(self)
        toolbar = QHBoxLayout()
        self.fetch_btn = QPushButton("Refresh apps")
        self.fetch_btn.clicked.connect(self.fetch_apps)
        toolbar.addWidget(self.fetch_btn)
        toolbar.addStretch()
        layout.addLayout(toolbar)

        layout.addWidget(QLabel("Available model-driven apps:"))
        self.app_combo = QComboBox()
        self.app_combo.currentIndexChanged.connect(self._on_selection_changed)
        layout.addWidget(self.app_combo)

        self.description_label = QLabel()
        self.description_label.setWordWrap(True)
        self.description_label.setStyleSheet("color: #605e5c; padding: 8px 0;")
        layout.addWidget(self.description_label)

        self.status_label = QLabel()
        self.status_label.setWordWrap(True)
        layout.addWidget(self.status_label)
        layout.addStretch()

        self.worker = None

    def initializePage(self):
        if self.app_combo.count() == 0:
            self.fetch_apps()

    def fetch_apps(self):
        wizard = self.wizard()
        if not wizard or not wizard.auth_token:
            self.status_label.setText(
                "Return to the connection page and authenticate first."
            )
            return
        if self.worker and self.worker.isRunning():
            return

        self.app_combo.clear()
        self.fetch_btn.setEnabled(False)
        self.status_label.setText("Loading model-driven apps...")
        self.worker = AppFetchWorker(
            wizard.field("org_url"),
            wizard.auth_token,
            self,
        )
        self.worker.completed.connect(self._on_apps_loaded)
        self.worker.failed.connect(self._on_apps_failed)
        self.worker.start()
        self.completeChanged.emit()

    def _on_apps_loaded(self, apps: list[dict]):
        valid_apps = []
        for app in apps:
            try:
                ModelDrivenApp.from_metadata(app)
                valid_apps.append(app)
            except ValueError:
                logger.warning("Ignoring an app with incomplete metadata: %r", app)

        valid_apps.sort(
            key=lambda app: str(app.get("name") or app.get("uniquename")).casefold()
        )
        self.app_combo.addItem("Select an app...", None)
        for app in valid_apps:
            name = app.get("name") or app.get("uniquename")
            unique_name = app.get("uniquename")
            label = f"{name} ({unique_name})" if unique_name else name
            self.app_combo.addItem(label, app)

        self.fetch_btn.setEnabled(True)
        if valid_apps:
            self.status_label.setText(
                f"Found {len(valid_apps)} model-driven app(s)."
            )
        else:
            self.status_label.setText(
                "No model-driven apps were returned for this environment."
            )
        self.completeChanged.emit()

    def _on_apps_failed(self, error_message: str):
        self.fetch_btn.setEnabled(True)
        self.status_label.setText(f"Could not load apps: {error_message}")
        QMessageBox.critical(self, "Could not load apps", error_message)
        self.completeChanged.emit()

    def _on_selection_changed(self):
        app = self.selected_app_metadata()
        if app:
            description = app.get("description") or "No app description is available."
            self.description_label.setText(description)
        else:
            self.description_label.clear()
        self.completeChanged.emit()

    def selected_app_metadata(self) -> dict | None:
        app = self.app_combo.currentData()
        return app if isinstance(app, dict) else None

    def validatePage(self):
        app_metadata = self.selected_app_metadata()
        if not app_metadata:
            return False
        selected_app = ModelDrivenApp.from_metadata(app_metadata)
        wizard = self.wizard()
        wizard.selected_app = selected_app
        wizard.selected_app_metadata = app_metadata
        return True

    def isComplete(self):
        return (
            self.selected_app_metadata() is not None
            and not (self.worker and self.worker.isRunning())
        )


class ComponentReviewPage(QWizardPage):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setTitle("Review app tables")
        self.setSubTitle(
            "Choose the tables to include. Tables required by an app business "
            "process are always generated."
        )

        layout = QVBoxLayout(self)
        toolbar = QHBoxLayout()
        self.add_btn = QPushButton("Add table")
        self.add_btn.clicked.connect(self.add_entity)
        self.select_all_btn = QPushButton("Select all")
        self.select_all_btn.clicked.connect(self.select_all)
        self.clear_btn = QPushButton("Clear optional")
        self.clear_btn.clicked.connect(self.clear_optional)
        toolbar.addWidget(self.add_btn)
        toolbar.addWidget(self.select_all_btn)
        toolbar.addWidget(self.clear_btn)
        toolbar.addStretch()
        layout.addLayout(toolbar)

        self.list_widget = QListWidget()
        self.list_widget.itemChanged.connect(lambda _: self.completeChanged.emit())
        layout.addWidget(self.list_widget)

        self.status_label = QLabel()
        self.status_label.setWordWrap(True)
        layout.addWidget(self.status_label)

        self.worker = None
        self.bpf_definitions = {}
        self._loaded_app_id = ""

    def initializePage(self):
        wizard = self.wizard()
        selected_app = wizard.selected_app
        if not selected_app:
            self.status_label.setText("Select a model-driven app first.")
            return
        if (
            self._loaded_app_id == selected_app.app_module_id
            and self.list_widget.count()
        ):
            return
        if self.worker and self.worker.isRunning():
            return

        self.list_widget.clear()
        self.status_label.setText("Loading the selected app's tables...")
        self.add_btn.setEnabled(False)
        self.worker = ComponentFetchWorker(
            wizard.field("org_url"),
            wizard.auth_token,
            selected_app.app_module_id,
            self,
        )
        self.worker.completed.connect(self._on_components_loaded)
        self.worker.failed.connect(self._on_components_failed)
        self.worker.start()
        self.completeChanged.emit()

    def _on_components_loaded(self, entities: list[dict], bpfs: dict):
        self.bpf_definitions = bpfs
        required_entities = set(bpf_entity_names(bpfs))
        entity_map = {
            entity.get("LogicalName"): entity
            for entity in entities
            if entity.get("LogicalName")
        }
        all_names = list(entity_map)

        # Add required entities from BPFs
        for logical_name in required_entities:
            if logical_name not in all_names:
                all_names.append(logical_name)

        # Inject core D365 CE entities unconditionally
        core_ce_entities = {
            "account", "contact", "lead", "opportunity", "incident", 
            "systemuser", "team", "businessunit", "activitypointer", 
            "task", "email", "phonecall", "appointment", "letter",
            "queue", "queueitem", "mailbox", "role",
            "sla", "slakpiinstance", "routingrule", "routingruleitem",
            "convertrule", "convertruleitem", "entitlement"
        }
        for core_name in core_ce_entities:
            if core_name not in all_names:
                all_names.append(core_name)

        # Sort alphabetically by logical name for a cleaner list
        all_names.sort()

        for logical_name in all_names:
            entity = entity_map.get(logical_name, {"LogicalName": logical_name})
            label = _display_label(entity)
            annotations = []
            if logical_name in required_entities:
                annotations.append("required by business process")
            if entity.get("IsAvailableOffline") is False:
                annotations.append("Dataverse offline flag is disabled")
            suffix = f" - {', '.join(annotations)}" if annotations else ""

            item = QListWidgetItem()
            item.setData(ENTITY_ROLE, logical_name)
            item.setData(REQUIRED_ROLE, logical_name in required_entities)
            self.list_widget.addItem(item)
            
            cb = QCheckBox(f"{label} ({logical_name}){suffix}")
            cb.setChecked(True)
            if logical_name in required_entities:
                cb.setEnabled(False)
            cb.stateChanged.connect(lambda _: self.completeChanged.emit())
            self.list_widget.setItemWidget(item, cb)

        self._loaded_app_id = self.wizard().selected_app.app_module_id
        self.add_btn.setEnabled(True)
        self.status_label.setText(
            f"{self.list_widget.count()} table(s) are available for generation."
        )
        self.completeChanged.emit()

    def _on_components_failed(self, error_message: str):
        self.add_btn.setEnabled(True)
        self.status_label.setText(f"Could not load app tables: {error_message}")
        QMessageBox.critical(self, "Could not load app tables", error_message)
        self.completeChanged.emit()

    def add_entity(self):
        logical_name, accepted = QInputDialog.getText(
            self,
            "Add a Dataverse table",
            "Table logical name (for example, account):",
        )
        if not accepted:
            return
        try:
            normalized = normalize_entity_names([logical_name])
        except ValueError as exc:
            QMessageBox.warning(self, "Invalid logical name", str(exc))
            return
        if not normalized:
            return

        logical_name = normalized[0]
        for index in range(self.list_widget.count()):
            item = self.list_widget.item(index)
            if item.data(ENTITY_ROLE) == logical_name:
                widget = self.list_widget.itemWidget(item)
                if widget and isinstance(widget, QCheckBox):
                    widget.setChecked(True)
                else:
                    item.setCheckState(Qt.CheckState.Checked)
                self.list_widget.scrollToItem(item)
                return

        item = QListWidgetItem()
        item.setData(ENTITY_ROLE, logical_name)
        item.setData(REQUIRED_ROLE, False)
        self.list_widget.addItem(item)
        
        cb = QCheckBox(f"{logical_name} (manually added)")
        cb.setChecked(True)
        cb.stateChanged.connect(lambda _: self.completeChanged.emit())
        self.list_widget.setItemWidget(item, cb)
        
        self.completeChanged.emit()

    def select_all(self):
        for index in range(self.list_widget.count()):
            item = self.list_widget.item(index)
            widget = self.list_widget.itemWidget(item)
            if widget and isinstance(widget, QCheckBox):
                widget.setChecked(True)
            else:
                item.setCheckState(Qt.CheckState.Checked)

    def clear_optional(self):
        for index in range(self.list_widget.count()):
            item = self.list_widget.item(index)
            if not item.data(REQUIRED_ROLE):
                widget = self.list_widget.itemWidget(item)
                if widget and isinstance(widget, QCheckBox):
                    widget.setChecked(False)
                else:
                    item.setCheckState(Qt.CheckState.Unchecked)

    def selected_entities(self) -> list[str]:
        selected = []
        for index in range(self.list_widget.count()):
            item = self.list_widget.item(index)
            widget = self.list_widget.itemWidget(item)
            if widget and isinstance(widget, QCheckBox):
                if widget.isChecked():
                    selected.append(item.data(ENTITY_ROLE))
            elif item.checkState() == Qt.CheckState.Checked:
                selected.append(item.data(ENTITY_ROLE))
        return selected

    def validatePage(self):
        if not self.selected_entities():
            return False
        wizard = self.wizard()
        wizard.selected_entities = self.selected_entities()
        wizard.bpf_definitions = self.bpf_definitions
        return True

    def isComplete(self):
        return (
            bool(self.selected_entities())
            and not (self.worker and self.worker.isRunning())
        )


class ProjectSettingsPage(QWizardPage):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setTitle("Choose the source project destination")
        self.setSubTitle(
            "VerseOff will create a complete Python source project in this folder."
        )

        layout = QVBoxLayout(self)
        form = QFormLayout()

        self.project_name_input = QLineEdit()
        self.project_name_input.textChanged.connect(self._update_preview)
        form.addRow("Project folder name:", self.project_name_input)

        destination_row = QHBoxLayout()
        self.destination_input = QLineEdit(
            str(Path.home() / "VerseOffProjects")
        )
        self.destination_input.textChanged.connect(self._update_preview)
        browse_btn = QPushButton("Browse...")
        browse_btn.clicked.connect(self.browse)
        destination_row.addWidget(self.destination_input)
        destination_row.addWidget(browse_btn)
        form.addRow("Parent folder:", destination_row)

        self.sync_interval_input = QSpinBox()
        self.sync_interval_input.setRange(60, 86400)
        self.sync_interval_input.setValue(300)
        self.sync_interval_input.setSuffix(" seconds")
        form.addRow("Background sync interval:", self.sync_interval_input)

        self.metadata_workers_input = QSpinBox()
        self.metadata_workers_input.setRange(1, 8)
        self.metadata_workers_input.setValue(4)
        self.metadata_workers_input.setToolTip(
            "Bounded parallel Dataverse metadata requests. "
            "Four is recommended to avoid throttling."
        )
        form.addRow("Metadata download workers:", self.metadata_workers_input)

        self.download_full_schema_checkbox = QCheckBox(
            "Download Complete Graph Schema Topology & Metadata in SQLite (Recommended)"
        )
        self.download_full_schema_checkbox.setChecked(True)
        form.addRow("Schema Strategy:", self.download_full_schema_checkbox)
        layout.addLayout(form)

        self.preview_label = QLabel()
        self.preview_label.setWordWrap(True)
        self.preview_label.setStyleSheet(
            "background: #f3f2f1; border: 1px solid #d2d0ce; "
            "border-radius: 4px; padding: 10px;"
        )
        layout.addWidget(self.preview_label)
        layout.addStretch()

        self._app_module_id = ""

    def initializePage(self):
        selected_app = self.wizard().selected_app
        if selected_app and self._app_module_id != selected_app.app_module_id:
            self.project_name_input.setText(
                project_directory_name(selected_app.name)
            )
            self._app_module_id = selected_app.app_module_id
        self._update_preview()

    def browse(self):
        selected = QFileDialog.getExistingDirectory(
            self,
            "Choose the parent folder for generated projects",
            self.destination_input.text() or str(Path.home()),
        )
        if selected:
            self.destination_input.setText(selected)

    def output_dir(self) -> Path:
        parent = Path(self.destination_input.text().strip()).expanduser()
        name = project_directory_name(self.project_name_input.text())
        return parent / name

    def _update_preview(self):
        project_name = self.project_name_input.text().strip()
        parent = self.destination_input.text().strip()
        if not project_name or not parent:
            self.preview_label.setText(
                "Enter a project folder name and a parent folder."
            )
        else:
            output_dir = self.output_dir()
            note = (
                "<br><small>An existing project will be updated; "
                "custom_events.py and data_providers.py are preserved.</small>"
                if output_dir.exists()
                else ""
            )
            self.preview_label.setText(
                f"<b>Source project:</b><br><code>{output_dir}</code>{note}"
            )
        self.completeChanged.emit()

    def validatePage(self):
        if not self.isComplete():
            return False
        wizard = self.wizard()
        wizard.output_dir = self.output_dir()
        wizard.sync_interval = self.sync_interval_input.value()
        wizard.metadata_workers = self.metadata_workers_input.value()
        wizard.download_full_schema = self.download_full_schema_checkbox.isChecked()
        return True

    def isComplete(self):
        return bool(
            self.project_name_input.text().strip()
            and self.destination_input.text().strip()
        )


class GeneratorWorker(QThread):
    progress_step = pyqtSignal(int, int, str)
    completed = pyqtSignal(str)
    failed = pyqtSignal(str)

    def __init__(
        self,
        request: GenerationRequest,
        builder: SourceProjectBuilder | None = None,
        parent=None,
    ):
        super().__init__(parent)
        self.request = request
        self.builder = builder or SourceProjectBuilder()

    def run(self):
        try:
            result = self.builder.generate(
                self.request,
                progress=lambda current, total, status: self.progress_step.emit(
                    current,
                    total,
                    status,
                ),
            )
            self.completed.emit(str(result.output_dir))
        except Exception as exc:
            logger.exception("Source project generation failed")
            self.failed.emit(str(exc))


class GenerationPage(QWizardPage):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setTitle("Generate the target application")
        self.setSubTitle(
            "VerseOff is extracting the selected app and writing its source project."
        )

        layout = QVBoxLayout(self)
        self.status = QLabel("Ready to generate.")
        self.status.setWordWrap(True)
        layout.addWidget(self.status)

        self.progress = QProgressBar()
        layout.addWidget(self.progress)

        actions = QHBoxLayout()
        self.open_folder_btn = QPushButton("Open source folder")
        self.open_folder_btn.clicked.connect(self.open_source_folder)
        self.open_folder_btn.setVisible(False)
        self.launch_btn = QPushButton("Run generated app")
        self.launch_btn.clicked.connect(self.launch_target_app)
        self.launch_btn.setVisible(False)
        actions.addWidget(self.open_folder_btn)
        actions.addWidget(self.launch_btn)
        actions.addStretch()
        layout.addLayout(actions)
        layout.addStretch()

        self.is_done = False
        self.worker = None
        self.output_dir = None
        self._generation_key = None

    def initializePage(self):
        wizard = self.wizard()
        request = GenerationRequest(
            org_url=wizard.field("org_url"),
            auth_token=wizard.auth_token,
            selected_app=wizard.selected_app,
            entity_names=tuple(wizard.selected_entities),
            output_dir=wizard.output_dir,
            client_id=wizard.field("client_id"),
            sync_interval=wizard.sync_interval,
            max_workers=wizard.metadata_workers,
            bpf_definitions=wizard.bpf_definitions,
            modified_sitemap=getattr(wizard, "modified_sitemap", None),
            selected_components=getattr(wizard, "selected_components", None),
            full_schema_topology=getattr(wizard, "download_full_schema", True),
        )
        generation_key = (
            request.org_url,
            request.selected_app.app_module_id,
            tuple(request.entity_names),
            str(request.output_dir),
            request.sync_interval,
            request.max_workers,
        )
        if (
            generation_key == self._generation_key
            and (self.is_done or (self.worker and self.worker.isRunning()))
        ):
            return

        self._generation_key = generation_key
        self.is_done = False
        self.output_dir = None
        self.open_folder_btn.setVisible(False)
        self.launch_btn.setVisible(False)
        self.progress.setRange(0, len(request.entity_names) + 2)
        self.progress.setValue(0)
        self.status.setText("Starting source generation...")
        self.worker = GeneratorWorker(request, parent=self)
        self.worker.progress_step.connect(self._on_progress)
        self.worker.completed.connect(self._on_completed)
        self.worker.failed.connect(self._on_failed)
        self.worker.start()
        self.completeChanged.emit()

    def _on_progress(self, current: int, total: int, text: str):
        self.progress.setRange(0, total)
        self.progress.setValue(current)
        self.status.setText(text)

    def _on_completed(self, output_dir: str):
        self.is_done = True
        self.output_dir = Path(output_dir)
        self.progress.setValue(self.progress.maximum())
        self.status.setText(
            "<b>Source project generated successfully.</b><br>"
            f"<code>{self.output_dir}</code>"
        )
        self.open_folder_btn.setVisible(True)
        self.launch_btn.setVisible(True)
        self.completeChanged.emit()

    def _on_failed(self, error_message: str):
        self.is_done = False
        self.status.setText(f"Generation failed: {error_message}")
        QMessageBox.critical(
            self,
            "Source generation failed",
            error_message,
        )
        self.completeChanged.emit()

    def open_source_folder(self):
        if self.output_dir:
            QDesktopServices.openUrl(QUrl.fromLocalFile(str(self.output_dir)))

    def launch_target_app(self):
        if not self.output_dir:
            return
        main_path = self.output_dir / "main.py"
        if not main_path.exists():
            QMessageBox.critical(
                self,
                "Generated app not found",
                f"The generated entry point does not exist:\n{main_path}",
            )
            return
        try:
            subprocess.Popen(
                [sys.executable, str(main_path)],
                cwd=str(self.output_dir),
            )
        except OSError as exc:
            logger.exception("Could not launch generated app")
            QMessageBox.critical(self, "Could not launch app", str(exc))

    def isComplete(self):
        return self.is_done


class MakerWizard(QWizard):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("VerseOff Maker")
        self.setWizardStyle(QWizard.WizardStyle.ModernStyle)
        self.setMinimumSize(800, 600)
        self.setOption(QWizard.WizardOption.NoBackButtonOnStartPage)
        self.setOption(QWizard.WizardOption.NoCancelButtonOnLastPage)

        self.auth_token = ""
        self.selected_app = None
        self.selected_app_metadata = None
        self.selected_entities = []
        self.bpf_definitions = {}
        self.modified_sitemap = None
        self.selected_components = None
        self.download_full_schema = True
        self.output_dir = None
        self.sync_interval = 300
        self.metadata_workers = 4

        self.connection_page = ConnectionPage()
        self.app_page = AppSelectionPage()
        self.sitemap_page = SiteMapEditorPage()
        self.component_page = ComponentSelectorPage()
        self.settings_page = ProjectSettingsPage()
        self.generation_page = GenerationPage()

        self.addPage(self.connection_page)
        self.addPage(self.app_page)
        self.addPage(self.sitemap_page)
        self.addPage(self.component_page)
        self.addPage(self.settings_page)
        self.addPage(self.generation_page)

    def closeEvent(self, event):
        workers = [
            self.connection_page.worker,
            self.app_page.worker,
            self.component_page.worker,
            self.generation_page.worker,
        ]
        if any(worker and worker.isRunning() for worker in workers):
            QMessageBox.information(
                self,
                "Operation in progress",
                "Wait for the current VerseOff operation to finish before closing.",
            )
            event.ignore()
            return
        super().closeEvent(event)


def main():
    app = QApplication(sys.argv)
    wizard = MakerWizard()
    wizard.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main()
