import sys
import os
import logging
from PyQt6.QtWidgets import (
    QApplication, QWizard, QWizardPage, QVBoxLayout, QHBoxLayout, 
    QLabel, QLineEdit, QPushButton, QListWidget, QListWidgetItem,
    QMessageBox, QProgressBar, QComboBox
)
from PyQt6.QtCore import Qt, QThread, pyqtSignal

# Import VerseOff internals
try:
    from VerseOff.auth import MsalAuth
    from VerseOff.metadata_fetcher import MetadataFetcher
    from VerseOff.form_parser import parse_form_xml
    from VerseOff.webresource_fetcher import WebResourceFetcher
    from VerseOff.code_generator import CodeGenerator
except ImportError:
    from auth import MsalAuth
    from metadata_fetcher import MetadataFetcher
    from form_parser import parse_form_xml
    from webresource_fetcher import WebResourceFetcher
    from code_generator import CodeGenerator

logger = logging.getLogger(__name__)

class AuthWorker(QThread):
    authenticated = pyqtSignal(str)
    error = pyqtSignal(str)

    def __init__(self, org_url: str, client_id: str = None):
        super().__init__()
        self.org_url = org_url
        self.client_id = client_id

    def run(self):
        try:
            auth = MsalAuth(org_url=self.org_url, client_id=self.client_id if self.client_id else None)
            token = auth.get_token()
            if token:
                self.authenticated.emit(token)
            else:
                self.error.emit("Authentication failed: No access token returned.")
        except Exception as e:
            self.error.emit(str(e))

class ConnectionPage(QWizardPage):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setTitle("Connect to Dataverse")
        self.setSubTitle("Enter your Dataverse Environment URL and Entra ID Client ID.")

        layout = QVBoxLayout()
        
        self.url_label = QLabel("Dataverse URL (e.g. https://org.crm.dynamics.com):")
        self.url_input = QLineEdit()
        self.url_input.setPlaceholderText("https://org.crm.dynamics.com")
        self.url_input.textChanged.connect(self._validate_input)
        
        self.client_id_label = QLabel("Entra ID Client ID (Optional):")
        self.client_id_input = QLineEdit()
        self.client_id_input.setPlaceholderText("Leave blank for standard Dynamics CRM Public Client ID")
        
        self.connect_btn = QPushButton("Connect & Authenticate")
        self.connect_btn.setEnabled(False)
        self.connect_btn.clicked.connect(self.authenticate)
        
        self.status_label = QLabel("Not connected.")
        
        layout.addWidget(self.url_label)
        layout.addWidget(self.url_input)
        layout.addWidget(self.client_id_label)
        layout.addWidget(self.client_id_input)
        layout.addWidget(self.connect_btn)
        layout.addWidget(self.status_label)
        
        self.setLayout(layout)
        
        # We will register 'org_url' and 'auth_token' as fields
        self.registerField("org_url*", self.url_input)
        self.registerField("client_id", self.client_id_input)
        
        self.auth_token = None
        self.worker = None

    def _validate_input(self, text):
        url = text.strip()
        self.connect_btn.setEnabled(len(url) > 8 and url.startswith("https://"))

    def authenticate(self):
        url = self.url_input.text().strip()
        client_id = self.client_id_input.text().strip()
        if not url:
            QMessageBox.warning(self, "Error", "Dataverse URL is required.")
            return
            
        self.connect_btn.setEnabled(False)
        self.status_label.setText("⏳ Authenticating in browser... Please complete sign-in.")
        
        self.worker = AuthWorker(url, client_id)
        self.worker.authenticated.connect(self._on_authenticated)
        self.worker.error.connect(self._on_auth_error)
        self.worker.start()

    def _on_authenticated(self, token: str):
        self.auth_token = token
        self.status_label.setText("✅ Connected successfully!")
        self.connect_btn.setEnabled(True)
        if self.wizard():
            self.wizard().setProperty("auth_token", self.auth_token)
            self.wizard().setProperty("org_url", self.url_input.text().strip())
            self.completeChanged.emit()
            self.wizard().next()

    def _on_auth_error(self, err_msg: str):
        self.connect_btn.setEnabled(True)
        self.status_label.setText(f"❌ {err_msg}")
        QMessageBox.critical(self, "Authentication Error", f"Failed to authenticate with Dataverse:\n\n{err_msg}")

    def isComplete(self):
        return self.auth_token is not None

class AppSelectionPage(QWizardPage):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setTitle("Select Model-Driven App")
        self.setSubTitle("Choose the Model-Driven App to take offline.")
        
        layout = QVBoxLayout()
        
        self.fetch_btn = QPushButton("Fetch Apps")
        self.fetch_btn.clicked.connect(self.fetch_apps)
        
        self.app_combo = QComboBox()
        self.app_combo.currentIndexChanged.connect(self.completeChanged)
        
        self.list_widget = QListWidget()
        self.list_widget.itemSelectionChanged.connect(self.completeChanged)
        
        layout.addWidget(self.fetch_btn)
        layout.addWidget(QLabel("Available Model-Driven Apps:"))
        layout.addWidget(self.app_combo)
        layout.addWidget(self.list_widget)
        self.setLayout(layout)

    def initializePage(self):
        self.fetch_apps()

    def fetch_apps(self):
        url = self.wizard().field("org_url")
        token = self.wizard().property("auth_token")
        
        if not token:
            return
            
        self.list_widget.clear()
        self.app_combo.clear()
        self.fetch_btn.setText("Fetching...")
        self.fetch_btn.setDisabled(True)
        QApplication.processEvents()
        
        try:
            fetcher = MetadataFetcher(url, token)
            apps = fetcher.get_app_modules()
            for app in apps:
                app_name = app.get('name', 'App')
                app_id = app.get('appmoduleid')
                item = QListWidgetItem(f"{app_name} ({app.get('uniquename', '')})")
                item.setData(Qt.ItemDataRole.UserRole, app_id)
                self.list_widget.addItem(item)
                self.app_combo.addItem(app_name, app_id)
                
            if self.list_widget.count() > 0:
                self.list_widget.setCurrentRow(0)
        except Exception as e:
            QMessageBox.critical(self, "Error", str(e))
        finally:
            self.fetch_btn.setText("Fetch Apps")
            self.fetch_btn.setDisabled(False)

    def isComplete(self):
        return len(self.list_widget.selectedItems()) > 0 or self.app_combo.count() > 0

class ComponentReviewPage(QWizardPage):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setTitle("Review Offline Components")
        self.setSubTitle("These entities were found in your App. Uncheck any you don't want, or manually add others.")
        
        layout = QVBoxLayout()
        
        self.add_btn = QPushButton("Add Additional Entity")
        self.add_btn.clicked.connect(self.add_entity)
        
        self.list_widget = QListWidget()
        # Enable multiple selection so they can uncheck
        self.list_widget.setSelectionMode(QListWidget.SelectionMode.MultiSelection)
        self.list_widget.itemSelectionChanged.connect(self.completeChanged)
        
        layout.addWidget(self.add_btn)
        layout.addWidget(self.list_widget)
        self.setLayout(layout)

    def initializePage(self):
        self.list_widget.clear()
        url = self.wizard().field("org_url")
        token = self.wizard().property("auth_token")
        
        app_page = self.wizard().page(1)
        if not app_page.list_widget.selectedItems():
            return
            
        app_module_id = app_page.list_widget.selectedItems()[0].data(Qt.ItemDataRole.UserRole)
        self.wizard().setProperty("app_module_id", app_module_id)
        
        try:
            fetcher = MetadataFetcher(url, token)
            entities = fetcher.get_entities_for_app(app_module_id)
            for ent in entities:
                logical_name = ent.get('LogicalName')
                if not logical_name: continue
                item = QListWidgetItem(f"{logical_name} (Included in App)")
                item.setData(Qt.ItemDataRole.UserRole, logical_name)
                self.list_widget.addItem(item)
                item.setSelected(True)
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Failed to load app entities: {e}")

    def add_entity(self):
        import PyQt6.QtWidgets as QtWidgets
        text, ok = QtWidgets.QInputDialog.getText(self, "Add Entity", "Enter logical name (e.g. account):")
        if ok and text:
            item = QListWidgetItem(f"{text} (Manually Added)")
            item.setData(Qt.ItemDataRole.UserRole, text)
            self.list_widget.addItem(item)
            item.setSelected(True)

    def isComplete(self):
        return len(self.list_widget.selectedItems()) > 0

class GeneratorWorker(QThread):
    progress_step = pyqtSignal(int, int, str) # current, total, status_text
    completed = pyqtSignal(str)
    failed = pyqtSignal(str)

    def __init__(self, url: str, token: str, app_module_id: str, client_id: str, selected_entities: list, app_name: str):
        super().__init__()
        self.url = url
        self.token = token
        self.app_module_id = app_module_id
        self.client_id = client_id
        self.selected_entities = selected_entities
        self.app_name = app_name

    def run(self):
        try:
            from VerseOff.metadata_fetcher import MetadataFetcher
            from VerseOff.code_generator import CodeGenerator
        except ImportError:
            from metadata_fetcher import MetadataFetcher
            from code_generator import CodeGenerator

        try:
            total_steps = len(self.selected_entities) + 3
            self.progress_step.emit(1, total_steps, "Fetching SiteMap and Business Process Flows...")
            
            fetcher = MetadataFetcher(self.url, self.token)
            bpfs = fetcher.get_bpf_definitions_for_app(self.app_module_id) if self.app_module_id else {}
            sitemap = fetcher.get_app_sitemap(self.app_module_id) if self.app_module_id else {"areas": []}

            manifest = {
                "app_name": self.app_name or "Dynamics 365 Offline",
                "org_url": self.url,
                "client_id": self.client_id,
                "sync_interval": 300,
                "entities": [],
                "bpfs": bpfs,
                "sitemap": sitemap
            }

            # Write generation log
            log_path = os.path.join(os.getcwd(), "generation_log.txt")
            with open(log_path, "w", encoding="utf-8") as lf:
                lf.write(f"--- VerseOff Generation Log ---\n")
                lf.write(f"Target App: {self.app_name}\n")
                lf.write(f"Environment: {self.url}\n")
                lf.write(f"Total Entities to Fetch: {len(self.selected_entities)}\n\n")
                for e in self.selected_entities:
                    lf.write(f" - {e}\n")

            step = 2
            for logical_name in self.selected_entities:
                self.progress_step.emit(step, total_steps, f"Extracting metadata & FormXML for '{logical_name}'...")
                ent_def = fetcher.get_entity_definition(logical_name)
                manifest["entities"].append(ent_def)
                step += 1

            self.progress_step.emit(step, total_steps, "Generating target Python code and database schemas...")
            out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out")
            os.makedirs(out_dir, exist_ok=True)
            
            # Save manifest.json to out directory
            manifest_file = os.path.join(out_dir, "manifest.json")
            with open(manifest_file, "w", encoding="utf-8") as f:
                json.dump(manifest, f, indent=2, ensure_ascii=False)

            # Generate app code
            generator = CodeGenerator(out_dir)
            generator.generate(manifest)

            self.progress_step.emit(total_steps, total_steps, f"Generation complete! Saved to {out_dir}")
            self.completed.emit(out_dir)
        except Exception as e:
            self.failed.emit(str(e))

class GenerationPage(QWizardPage):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setTitle("Generate Offline Client")
        self.setSubTitle("Building your standalone offline Dynamics 365 application.")
        
        layout = QVBoxLayout()
        layout.setSpacing(12)
        
        self.status = QLabel("Ready to generate.")
        self.status.setStyleSheet("font-size: 13px; color: #323130;")
        
        self.progress = QProgressBar()
        self.progress.setStyleSheet("QProgressBar { border: 1px solid #d1d1d1; border-radius: 4px; text-align: center; } QProgressBar::chunk { background-color: #0f6cbd; }")
        
        self.launch_btn = QPushButton("🚀 Launch Generated Offline Client")
        self.launch_btn.setStyleSheet("background-color: #107c41; color: white; font-weight: bold; padding: 10px; font-size: 14px; border-radius: 4px;")
        self.launch_btn.setVisible(False)
        self.launch_btn.clicked.connect(self.launch_target_app)
        
        layout.addWidget(self.status)
        layout.addWidget(self.progress)
        layout.addWidget(self.launch_btn)
        self.setLayout(layout)
        
        self.is_done = False
        self.worker = None

    def initializePage(self):
        url = self.wizard().field("org_url")
        token = self.wizard().property("auth_token")
        app_module_id = self.wizard().property("app_module_id")
        app_name = self.wizard().property("app_name") or "Dynamics 365 Customer Service"
        client_id = self.wizard().field("client_id")
        
        review_page = self.wizard().page(2)
        selected_entities = [item.data(Qt.ItemDataRole.UserRole) for item in review_page.list_widget.selectedItems()]
        
        self.progress.setMaximum(len(selected_entities) + 3)
        self.progress.setValue(0)
        self.launch_btn.setVisible(False)
        self.is_done = False
        
        self.worker = GeneratorWorker(url, token, app_module_id, client_id, selected_entities, app_name)
        self.worker.progress_step.connect(self._on_progress)
        self.worker.completed.connect(self._on_completed)
        self.worker.failed.connect(self._on_failed)
        self.worker.start()

    def _on_progress(self, current: int, total: int, text: str):
        self.progress.setMaximum(total)
        self.progress.setValue(current)
        self.status.setText(f"⏳ {text}")

    def _on_completed(self, out_dir: str):
        self.is_done = True
        self.status.setText(f"✅ <b>Application successfully generated!</b><br>Saved to: <code>{out_dir}</code>")
        self.launch_btn.setVisible(True)
        self.completeChanged.emit()

    def _on_failed(self, error_msg: str):
        self.status.setText(f"❌ Generation failed: {error_msg}")
        QMessageBox.critical(self, "Generation Error", f"Failed to generate application:\n\n{error_msg}")

    def launch_target_app(self):
        import subprocess
        out_main = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out", "main.py")
        subprocess.Popen([sys.executable, out_main])

    def isComplete(self):
        return self.is_done

class MakerWizard(QWizard):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("VerseOff Maker")
        self.setMinimumSize(600, 400)
        
        self.addPage(ConnectionPage())
        self.addPage(AppSelectionPage())
        self.addPage(ComponentReviewPage())
        self.addPage(GenerationPage())

def main():
    app = QApplication(sys.argv)
    wizard = MakerWizard()
    wizard.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main()
