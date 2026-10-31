import pytest
import os
import sys
import json
from PyQt6.QtCore import Qt
from PyQt6.QtWidgets import QTreeWidgetItemIterator

generated_app_dir = os.path.join(os.path.dirname(__file__), "..", "VerseOff", "out")
sys.path.append(generated_app_dir)

from main import OfflineApp
from db import LocalDatabase

def test_generated_app_initialization(qtbot, tmp_path, monkeypatch):
    """
    Tests that the generated application can initialize successfully,
    create its SQLite database schema from the manifest, and load the UI.
    """
    # Change directory so OfflineApp finds manifest.json
    os.chdir(generated_app_dir)
    
    monkeypatch.setenv("VERSEOFF_DATA_DIR", str(tmp_path / "app-data"))
    app = OfflineApp()
    qtbot.addWidget(app)
    
    # Verify the window title was loaded from the manifest
    assert app.windowTitle() != ""
    
    # Verify the database tables were created successfully
    db = LocalDatabase()
    
    # We can verify it has at least the sync_queue table and entity metadata tables
    with db.get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
    
    assert "sync_queue" in tables
    
    # Check that the main UI layout loaded the sitemap (the nav_tree)
    assert app.nav_tree.topLevelItemCount() > 0
    
    # Assert the first sidebar item is selectable and triggers a view load
    # We find the first subarea item which has data attached
    first_item = None
    iterator = QTreeWidgetItemIterator(app.nav_tree)
    while iterator.value():
        item = iterator.value()
        if item.data(0, Qt.ItemDataRole.UserRole):
            first_item = item
            break
        iterator += 1
        
    assert first_item is not None
    
    # Simulate clicking the first item in the sidebar
    rect = app.nav_tree.visualItemRect(first_item)
    center = rect.center()
    qtbot.mouseClick(app.nav_tree.viewport(), Qt.MouseButton.LeftButton, pos=center)
    
    # Ensure it didn't crash and the data grid exists
    assert app.data_grid is not None

    app.area_combo.setCurrentIndex(1)
    route_item = None
    iterator = QTreeWidgetItemIterator(app.nav_tree)
    while iterator.value():
        item = iterator.value()
        if item.data(0, int(Qt.ItemDataRole.UserRole) + 1):
            route_item = item
            break
        iterator += 1
    if route_item:
        app.nav_tree.setCurrentItem(route_item)
        assert app.main_stack.currentWidget() is app.route_page
        assert "requires the online" in app.route_message.text()
