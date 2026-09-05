import os
import sys
import json
from PyQt6.QtWidgets import QApplication
from PyQt6.QtCore import QTimer

# Ensure out directory is tested
out_dir = os.path.join(os.path.dirname(__file__), "out")
os.chdir(out_dir)
sys.path.insert(0, out_dir)

from main import OfflineApp
from xrm_form_renderer import XrmFormRenderer, StageFlyoutPanel

app = QApplication.instance() or QApplication(sys.argv)
window = OfflineApp()
print("OfflineApp instance initialized cleanly.")

manifest_path = "manifest.json"
with open(manifest_path, "r", encoding="utf-8") as f:
    manifest = json.load(f)

entities = [e.get("LogicalName") for e in manifest.get("entities", [])]
print(f"Entities in manifest ({len(entities)}): {entities}")
assert len(entities) >= 5, "Expected at least 5 entities in manifest"

for ent in entities:
    form_renderer = XrmFormRenderer(
        manifest_data=manifest,
        logical_name=ent,
        record_id=None
    )
    # Verify multi-tab presence
    tab_count = form_renderer.tab_widget.count() if hasattr(form_renderer, "tab_widget") else 0
    tabs = [form_renderer.tab_widget.tabText(i) for i in range(tab_count)] if tab_count else []
    bpf_present = form_renderer.bpf_widget is not None

    print(f"Verified '{ent}':")
    print(f"  - Tabs ({tab_count}): {tabs}")
    print(f"  - Sections rendered: {len(form_renderer.controls)} controls bound")
    print(f"  - BPF Track Bar rendered: {bpf_present}")
    print(f"  - QJSEngine active: {getattr(form_renderer, '_runtime_ready', False)}")

    assert tab_count >= 2, f"Entity '{ent}' should have multiple tabs (got {tab_count})"
    assert len(form_renderer.controls) >= 3, f"Entity '{ent}' should have multiple controls across sections"

print("\nSUCCESS: All 5 entities rendered with rich multi-tab and multi-section layouts!")
QTimer.singleShot(200, app.quit)
app.exec()
