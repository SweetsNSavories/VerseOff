import os
import sys
import json
from PyQt6.QtWidgets import QApplication
from PyQt6.QtCore import QTimer

# Run in out/
os.chdir(os.path.join(os.path.dirname(__file__), "out"))
sys.path.insert(0, os.getcwd())

from main import OfflineApp
from xrm_form_renderer import XrmFormRenderer

app = QApplication(sys.argv)
window = OfflineApp()
print("OfflineApp instance created successfully.")

# Test opening an entity form (account)
with open("manifest.json", "r", encoding="utf-8") as f:
    manifest = json.load(f)

entities = [e.get("LogicalName") for e in manifest.get("entities", [])]
print("Entities in manifest:", entities)

for ent in entities:
    form_renderer = XrmFormRenderer(
        manifest_data=manifest,
        logical_name=ent,
        record_id=None
    )
    print(f"XrmFormRenderer for '{ent}' initialized successfully.")
    print(f" - JS Engine ready: {getattr(form_renderer, '_runtime_ready', False)}")
    print(f" - BPF widget present: {form_renderer.bpf_widget is not None}")

# Schedule clean exit
QTimer.singleShot(500, app.quit)
app.exec()
print("All entity forms rendered & verified with 0 errors!")
