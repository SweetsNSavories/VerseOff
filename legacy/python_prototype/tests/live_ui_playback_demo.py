import os
import sys
import time
from PyQt6.QtWidgets import QApplication, QTableWidgetItem, QLabel
from PyQt6.QtCore import QTimer, Qt

# Add VerseOff and VerseOff/out to path
out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "VerseOff", "out"))
sys.path.insert(0, out_dir)

from main import OfflineApp

def run_visual_playback():
    os.chdir(out_dir)
    app = QApplication(sys.argv)
    
    window = OfflineApp()
    window.resize(1200, 780)
    window.show()
    window.raise_()
    window.activateWindow()

    # Step Banner in the UI
    banner = QLabel("🎬 Starting Live Playback Demo...", parent=window)
    banner.setStyleSheet("background-color: #0f6cbd; color: white; font-weight: bold; font-size: 14px; padding: 8px 16px; border-radius: 6px;")
    banner.move(300, 56)
    banner.resize(550, 36)
    banner.show()

    def step1_select_entity():
        banner.setText("1️⃣ Selecting 'Cases' in SiteMap Navigation Rail...")
        # Select incident
        for i in range(window.nav_tree.topLevelItemCount()):
            grp = window.nav_tree.topLevelItem(i)
            for j in range(grp.childCount()):
                sub = grp.child(j)
                if sub.data(0, Qt.ItemDataRole.UserRole) == "incident":
                    window.nav_tree.setCurrentItem(sub)
                    break

    def step2_populate_and_highlight():
        banner.setText("2️⃣ Quick Find Search: Searching for 'Server Outage'...")
        window.search_bar.setText("Server Outage")
        
        # Populate demo row if empty
        if window.data_grid.rowCount() == 0:
            window.data_grid.setRowCount(3)
            window.data_grid.setColumnCount(4)
            window.data_grid.setHorizontalHeaderLabels(["Case Title", "Customer", "Priority", "Status"])
            
            row1 = [("Enterprise Cloud Server Outage", "incident-demo-01"), ("Contoso Ltd", ""), ("High", ""), ("Active", "")]
            for col_idx, (val, rec_id) in enumerate(row1):
                item = QTableWidgetItem(val)
                if rec_id: item.setData(Qt.ItemDataRole.UserRole, rec_id)
                window.data_grid.setItem(0, col_idx, item)

            row2 = [("VPN Connection dropped", "incident-demo-02"), ("Fabrikam Inc", ""), ("Normal", ""), ("Active", "")]
            for col_idx, (val, rec_id) in enumerate(row2):
                item = QTableWidgetItem(val)
                if rec_id: item.setData(Qt.ItemDataRole.UserRole, rec_id)
                window.data_grid.setItem(1, col_idx, item)

        window.data_grid.selectRow(0)

    def step3_open_record_sdi():
        banner.setText("3️⃣ Double-Clicking Case: Opening Inline SDI Record Form (Zero Popups)...")
        first_item = window.data_grid.item(0, 0)
        rec_id = first_item.data(Qt.ItemDataRole.UserRole) if first_item else "incident-demo-01"
        window.open_form("incident", rec_id)

    def step4_switch_form_tabs():
        banner.setText("4️⃣ Interacting with Form Tabs: Switching to 'Details' & 'Related'...")
        if hasattr(window, "current_form") and window.current_form and window.current_form.tab_widget:
            tab_widget = window.current_form.tab_widget
            if tab_widget.count() > 1:
                tab_widget.setCurrentIndex(1)

    def step5_switch_back_tab():
        if hasattr(window, "current_form") and window.current_form and window.current_form.tab_widget:
            window.current_form.tab_widget.setCurrentIndex(0)
        banner.setText("5️⃣ Editing Case Title: 'Enterprise Cloud Server Outage - RESOLVED'...")
        if hasattr(window, "current_form") and window.current_form:
            title_ctrl = window.current_form.controls.get("title")
            if title_ctrl and hasattr(title_ctrl, "setText"):
                title_ctrl.setText("Enterprise Cloud Server Outage - RESOLVED")

    def step6_save_and_close():
        banner.setText("6️⃣ Clicking 'Save & Close' / '← Back': Returning to HomepageGrid...")
        window.close_form_view()

    def step7_switch_area():
        banner.setText("7️⃣ Switching Area via Area Switcher: Changing to '📊 Analytics & Insights'...")
        for idx in range(window.area_combo.count()):
            if "Analytics" in window.area_combo.itemText(idx):
                window.area_combo.setCurrentIndex(idx)
                break

    def step8_finish():
        banner.setText("✅ Live Automation Complete! Window remains open for your manual exploration.")
        banner.setStyleSheet("background-color: #107c41; color: white; font-weight: bold; font-size: 14px; padding: 8px 16px; border-radius: 6px;")

    # Schedule choreographed steps
    QTimer.singleShot(1500, step1_select_entity)
    QTimer.singleShot(3500, step2_populate_and_highlight)
    QTimer.singleShot(5500, step3_open_record_sdi)
    QTimer.singleShot(7500, step4_switch_form_tabs)
    QTimer.singleShot(9500, step5_switch_back_tab)
    QTimer.singleShot(11500, step6_save_and_close)
    QTimer.singleShot(13500, step7_switch_area)
    QTimer.singleShot(15500, step8_finish)

    sys.exit(app.exec())

if __name__ == "__main__":
    run_visual_playback()
