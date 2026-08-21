import sys
import os
import logging
from PyQt6.QtWidgets import (
    QApplication, QWizard, QWizardPage, QVBoxLayout, QHBoxLayout, 
    QLabel, QLineEdit, QPushButton, QListWidget, QListWidgetItem,
    QMessageBox, QProgressBar, QComboBox
)
from PyQt6.QtCore import Qt

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

    def _validate_input(self, text):
        url = text.strip()
        self.connect_btn.setEnabled(len(url) > 8 and url.startswith("https://"))

    def authenticate(self):
        url = self.url_input.text().strip()
        client_id = self.client_id_input.text().strip()
        if not url:
            QMessageBox.warning(self, "Error", "Dataverse URL is required.")
            return
            
        self.status_label.setText("Authenticating...")
        QApplication.processEvents()
        
        try:
            auth = MsalAuth(org_url=url, client_id=client_id if client_id else None)
            self.auth_token = auth.get_token()
            if self.auth_token:
                self.status_label.setText("Connected successfully!")
                self.wizard().setProperty("auth_token", self.auth_token)
                self.completeChanged.emit()
                # Advance to app selection
                if self.wizard():
                    self.wizard().next()
            else:
                self.status_label.setText("Authentication failed.")
        except Exception as e:
            self.status_label.setText(f"Error: {e}")

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

class GenerationPage(QWizardPage):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setTitle("Generate App")
        self.setSubTitle("Generating your offline Python application.")
        
        layout = QVBoxLayout()
        self.progress = QProgressBar()
        self.status = QLabel("Ready to generate.")
        
        layout.addWidget(self.status)
        layout.addWidget(self.progress)
        self.setLayout(layout)

    def initializePage(self):
        url = self.wizard().field("org_url")
        token = self.wizard().property("auth_token")
        app_module_id = self.wizard().property("app_module_id")
        
        # Get selected entities from ComponentReviewPage
        review_page = self.wizard().page(2)
        selected_entities = [item.data(Qt.ItemDataRole.UserRole) for item in review_page.list_widget.selectedItems()]
        
        self.progress.setMaximum(len(selected_entities) + 2)
        self.progress.setValue(0)
        
        try:
            from metadata_fetcher import MetadataFetcher
            from code_generator import CodeGenerator
            
            fetcher = MetadataFetcher(url, token)
            manifest = {
                "app_name": "VerseOff Generated App",
                "org_url": url,
                "client_id": self.wizard().field("client_id"),
                "sync_interval": 300,
                "entities": [],
                "bpfs": fetcher.get_bpf_definitions_for_app(app_module_id) if app_module_id else {},
                "sitemap": fetcher.get_app_sitemap(app_module_id) if app_module_id else {"areas": []}
            }
            
            app_name_from_wizard = self.wizard().property("app_name") or "Custom App"
            
            # Write a log of intention to disk before beginning the heavy fetch
            log_path = os.path.join(os.getcwd(), "generation_log.txt")
            with open(log_path, "w", encoding="utf-8") as lf:
                lf.write(f"--- VerseOff Generation Log ---\n")
                lf.write(f"Target App: {app_name_from_wizard}\n")
                lf.write(f"Environment: {url}\n")
                lf.write(f"Total Entities to Fetch: {len(selected_entities)}\n\n")
                lf.write("Entities:\n")
                for e in selected_entities:
                    lf.write(f" - {e}\n")
                lf.write("\nFetching in progress...\n")
                
            step = 1
            for logical_name in selected_entities:
                self.status.setText(f"Fetching metadata for {logical_name}...")
                QApplication.processEvents()
                
                ent_def = fetcher.get_entity_definition(logical_name)
                manifest["entities"].append(ent_def)
                
                self.progress.setValue(step)
                step += 1
                
            self.status.setText("Generating application...")
            QApplication.processEvents()
            
            # Default to VerseOff/out directory
            out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out")
            generator = CodeGenerator(out_dir)
            generator.generate(manifest)
            
            self.progress.setValue(step + 1)
            self.status.setText(f"Generation complete! App saved to {out_dir}")
            
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Generation failed: {e}")
            self.status.setText("Failed.")

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
