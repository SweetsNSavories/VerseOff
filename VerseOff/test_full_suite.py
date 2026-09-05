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

# Test account and contact form rendering
manifest_path = "manifest.json"
with open(manifest_path, "r", encoding="utf-8") as f:
    manifest = json.load(f)

# Add mock BPF to account to test BPF UI + flyout interaction
mock_bpf = {
    "processid": "bpf-001",
    "name": "Lead to Opportunity Sales Process",
    "stages": [
        {
            "stageid": "s1",
            "stagename": "Qualify",
            "category": 0,
            "steps": [
                {"stepid": "st1", "description": "Identify Contact", "attribute": "primarycontactid", "required": True},
                {"stepid": "st2", "description": "Budget Confirmed", "attribute": "telephone1", "required": False}
            ]
        },
        {
            "stageid": "s2",
            "stagename": "Develop",
            "category": 1,
            "steps": [
                {"stepid": "st3", "description": "Customer Need", "attribute": "name", "required": True}
            ]
        },
        {
            "stageid": "s3",
            "stagename": "Propose",
            "category": 2,
            "steps": []
        },
        {
            "stageid": "s4",
            "stagename": "Close",
            "category": 3,
            "steps": []
        }
    ]
}

manifest["entities"][0]["bpfs"] = {"Lead to Opportunity Sales Process": mock_bpf}

# Save updated test manifest
with open("manifest.json", "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=4)

print("Testing XrmFormRenderer with BPF...")
account_form = XrmFormRenderer(
    manifest_data=manifest,
    logical_name="account",
    record_id=None
)

print(f" - Account JS Engine active: {getattr(account_form, '_runtime_ready', False)}")
print(f" - BPF widget rendered: {account_form.bpf_widget is not None}")
assert account_form.bpf_widget is not None, "BPF widget should be rendered when BPF is defined"
assert hasattr(account_form, "bpf_stage_panel"), "BPF stage panel should exist"

# Test stage panel toggle and update
account_form.bpf_stage_panel.populate_stage(
    stage_def=mock_bpf["stages"][0],
    stage_idx=0,
    total_stages=4,
    is_active=True
)
print(" - BPF stage flyout successfully updated with steps.")

# Test executing JS event in QJSEngine
if hasattr(account_form, "js_engine"):
    val = account_form.js_engine.evaluate("1 + 1")
    print(f" - QJSEngine evaluated basic arithmetic: 1 + 1 = {val.toInt()}")
    val2 = account_form.js_engine.evaluate("typeof window.Xrm !== 'undefined'")
    print(f" - QJSEngine window.Xrm defined: {val2.toBool()}")

print("\nSUCCESS: All unit and UI component verification passed!")
QTimer.singleShot(200, app.quit)
app.exec()
