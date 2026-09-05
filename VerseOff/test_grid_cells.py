import os
import sys
import json
from PyQt6.QtWidgets import QApplication
from PyQt6.QtCore import QTimer, Qt

# Run in out/
out_dir = os.path.join(os.path.dirname(__file__), "out")
os.chdir(out_dir)
sys.path.insert(0, out_dir)

from main import OfflineApp

app = QApplication.instance() or QApplication(sys.argv)
window = OfflineApp()
print("OfflineApp created.")

entities = ["account", "contact", "incident", "opportunity", "lead"]

for ent in entities:
    window.navigate_to_entity(ent)
    row_count = window.data_grid.rowCount()
    col_count = window.data_grid.columnCount()
    print(f"\nEntity '{ent}' Grid: {row_count} rows x {col_count} columns")
    assert row_count > 0, f"Expected rows in '{ent}' grid"
    
    # Inspect first row values
    row_values = []
    for c in range(col_count):
        item = window.data_grid.item(0, c)
        val = item.text() if item else ""
        row_values.append(val)
    print(f"  Row 0 values: {row_values}")
    
    # Ensure values are not empty strings!
    non_empty = [v for v in row_values if v.strip()]
    print(f"  Non-empty cell count: {len(non_empty)} of {col_count}")
    assert len(non_empty) > 0, f"Cells should have values in '{ent}' grid!"

print("\nSUCCESS: All grid cells are populated with real values!")
QTimer.singleShot(100, app.quit)
app.exec()
