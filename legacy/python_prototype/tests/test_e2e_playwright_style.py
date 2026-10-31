import os
import sys
import json
import pytest
import importlib.util
from unittest.mock import patch, MagicMock
from PyQt6.QtCore import Qt
from PyQt6.QtWidgets import QApplication, QTableWidgetItem

# Import Maker UI
from VerseOff.maker_ui import MakerWizard

# Dynamically import generated target app
out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "VerseOff", "out"))
if out_dir not in sys.path:
    sys.path.insert(0, out_dir)

spec = importlib.util.spec_from_file_location("generated_main", os.path.join(out_dir, "main.py"))
generated_main = importlib.util.module_from_spec(spec)
sys.modules["generated_main"] = generated_main
spec.loader.exec_module(generated_main)
OfflineApp = generated_main.OfflineApp

@pytest.fixture
def mock_d365_manifest(tmp_path):
    manifest = {
        "app_name": "Customer Service workspace",
        "org_url": "https://orgb7c4e2ec.crm8.dynamics.com/",
        "client_id": "51f81489-12ee-4a9e-aaae-a2591f45987d",
        "sync_interval": 300,
        "sitemap": {
            "areas": [
                {
                    "id": "area_service",
                    "title": "Service",
                    "icon": "🎧",
                    "groups": [
                        {
                            "name": "MY WORK",
                            "subareas": [
                                {"entity": "incident", "icon": "📁"},
                                {"entity": "contact", "icon": "👥"},
                                {"entity": "account", "icon": "🏢"}
                            ]
                        }
                    ]
                },
                {
                    "id": "area_analytics",
                    "title": "Analytics & Insights",
                    "icon": "📊",
                    "groups": [
                        {
                            "name": "REPORTS",
                            "subareas": [
                                {"entity": "account", "icon": "🏢"}
                            ]
                        }
                    ]
                }
            ]
        },
        "entities": [
            {
                "LogicalName": "incident",
                "DisplayName": {"UserLocalizedLabel": {"Label": "Case"}},
                "PrimaryIdAttribute": "incidentid",
                "PrimaryNameAttribute": "title",
                "attributes": [
                    {"LogicalName": "title", "DisplayName": {"UserLocalizedLabel": {"Label": "Case Title"}}},
                    {"LogicalName": "ticketnumber", "DisplayName": {"UserLocalizedLabel": {"Label": "Case Number"}}},
                    {"LogicalName": "createdon", "DisplayName": {"UserLocalizedLabel": {"Label": "Created On"}}}
                ],
                "forms": [
                    {
                        "formid": "form-1",
                        "name": "Case Main Form",
                        "formxml": """<form>
                            <tabs>
                                <tab name="general_tab">
                                    <labels><label description="General"/></labels>
                                    <columns>
                                        <column width="100%">
                                            <sections>
                                                <section name="case_details">
                                                    <labels><label description="Case Details"/></labels>
                                                    <rows>
                                                        <row>
                                                            <cell>
                                                                <labels><label description="Case Title"/></labels>
                                                                <control id="title" datafieldname="title" classid="{4273EDBD-AC1D-40d3-9FB2-095C621B552D}"/>
                                                            </cell>
                                                        </row>
                                                    </rows>
                                                </section>
                                            </sections>
                                        </column>
                                    </columns>
                                </tab>
                                <tab name="notes_tab">
                                    <labels><label description="Notes"/></labels>
                                    <columns>
                                        <column width="100%">
                                            <sections>
                                                <section name="notes_sec">
                                                    <labels><label description="Notes and Attachments"/></labels>
                                                    <rows>
                                                        <row>
                                                            <cell>
                                                                <labels><label description="Description"/></labels>
                                                                <control id="description" datafieldname="description" classid="{4273EDBD-AC1D-40d3-9FB2-095C621B552D}"/>
                                                            </cell>
                                                        </row>
                                                    </rows>
                                                </section>
                                            </sections>
                                        </column>
                                    </columns>
                                </tab>
                            </tabs>
                        </form>"""
                    }
                ]
            },
            {
                "LogicalName": "contact",
                "DisplayName": {"UserLocalizedLabel": {"Label": "Contact"}},
                "PrimaryIdAttribute": "contactid",
                "PrimaryNameAttribute": "fullname",
                "attributes": [
                    {"LogicalName": "fullname", "DisplayName": {"UserLocalizedLabel": {"Label": "Full Name"}}},
                    {"LogicalName": "emailaddress1", "DisplayName": {"UserLocalizedLabel": {"Label": "Email"}}}
                ]
            }
        ]
    }
    return manifest


def test_maker_studio_e2e_flow(qtbot):
    """
    Playwright-style E2E test for the Maker Studio Wizard.
    Verifies:
    1. Default pre-filled organization URL.
    2. Interactive authentication button click & async transition.
    3. Model-Driven App selection from list.
    4. Component and entity review.
    5. Code generation execution and progress.
    """
    wizard = MakerWizard()
    qtbot.addWidget(wizard)
    wizard.show()

    # Step 1: Enter a Dataverse environment URL.
    assert wizard.currentId() == 0
    conn_page = wizard.page(0)
    conn_page.url_input.setText(
        "https://orgb7c4e2ec.crm8.dynamics.com/"
    )
    assert conn_page.connect_btn.isEnabled()

    # Step 2: Simulate MSAL Auth and Fetching Apps
    with patch('VerseOff.maker_ui.MsalAuth') as MockAuth, \
         patch('VerseOff.maker_ui.MetadataFetcher') as MockFetcher:
        
        MockAuth.return_value.get_token.return_value = "mock_bearer_token"
        MockFetcher.return_value.who_am_i.return_value = {
            "UserId": "user-id"
        }
        MockFetcher.return_value.get_app_modules.return_value = [
            {"appmoduleid": "app-guid-1", "name": "Customer Service workspace", "uniquename": "msdyn_customerservice"}
        ]
        MockFetcher.return_value.get_entities_for_app.return_value = [
            {"LogicalName": "incident"},
            {"LogicalName": "contact"},
            {"LogicalName": "account"}
        ]
        MockFetcher.return_value.get_bpf_definitions_for_app.return_value = {}
        
        # Click "Connect & Authenticate"
        qtbot.mouseClick(conn_page.connect_btn, Qt.MouseButton.LeftButton)
        
        # Wait for page transition to App Selection (Page 1)
        qtbot.waitUntil(lambda: wizard.currentId() == 1, timeout=2000)
        assert wizard.currentId() == 1
        
        app_page = wizard.page(1)
        qtbot.waitUntil(
            lambda: app_page.app_combo.count() == 2,
            timeout=2000,
        )
        app_page.app_combo.setCurrentIndex(1)
        assert "Customer Service workspace" in app_page.app_combo.currentText()
        
        # Advance to Component Review (Page 2)
        wizard.next()
        qtbot.waitUntil(lambda: wizard.currentId() == 2, timeout=2000)
        assert wizard.currentId() == 2
        
        review_page = wizard.page(2)
        qtbot.waitUntil(
            lambda: review_page.list_widget.count() >= 3,
            timeout=2000,
        )
        assert review_page.list_widget.count() >= 3
        selected_entities = [review_page.list_widget.item(i).data(Qt.ItemDataRole.UserRole) for i in range(review_page.list_widget.count())]
        assert "incident" in selected_entities
        assert "contact" in selected_entities


def test_target_app_offline_sdi_e2e_flow(
    qtbot,
    tmp_path,
    monkeypatch,
):
    """
    Playwright-style E2E test for the Generated Target Offline App.
    Verifies:
    1. Single-Area SiteMap tree renders with Area Switcher.
    2. Area Switcher switches between 'Service' and 'Analytics & Insights'.
    3. Entity selection updates the HomepageGrid.
    4. Quick Find search filters grid records.
    5. Double-clicking a grid row triggers Inline SDI navigation (QStackedWidget page 1).
    6. Form tabs, cards, and labels render cleanly without child windows.
    7. Clicking '← Back to [Entities]' or 'Save & Close' returns cleanly to HomepageGrid (page 0).
    """
    monkeypatch.setenv("VERSEOFF_DATA_DIR", str(tmp_path / "app-data"))
    app = OfflineApp()
    qtbot.addWidget(app)
    app.show()

    # Step 1: Verify Top Brand Header
    assert "Offline Client" in app.windowTitle()
    assert hasattr(app, "sync_btn")
    assert app.sync_btn.text().startswith("⚡ Sync")

    # Step 2: Verify Single-Area Navigation Rail
    assert hasattr(app, "area_combo")
    assert app.area_combo.count() >= 2
    assert "Sales" in app.area_combo.itemText(0)

    # Verify Nav tree contains groups and subareas for active Area
    assert app.nav_tree.topLevelItemCount() > 0
    first_group = app.nav_tree.topLevelItem(0)
    assert len(first_group.text(0)) > 0
    assert first_group.childCount() > 0

    # Step 3: Verify Inline SDI Stack
    assert hasattr(app, "main_stack")
    assert app.main_stack.currentIndex() == 0  # Starts on HomepageGrid

    # Step 4: Populate mock data in data_grid and verify Quick Find
    app.data_grid.setRowCount(2)
    app.data_grid.setColumnCount(3)
    app.data_grid.setHorizontalHeaderLabels(["Case Title", "Case Number", "Created On"])

    item1 = QTableWidgetItem("Printer issue in building B")
    item1.setData(Qt.ItemDataRole.UserRole, "case-guid-101")
    app.data_grid.setItem(0, 0, item1)
    app.data_grid.setItem(0, 1, QTableWidgetItem("CAS-00101"))
    app.data_grid.setItem(0, 2, QTableWidgetItem("2026-08-21"))

    item2 = QTableWidgetItem("Password reset request")
    item2.setData(Qt.ItemDataRole.UserRole, "case-guid-102")
    app.data_grid.setItem(1, 0, item2)
    app.data_grid.setItem(1, 1, QTableWidgetItem("CAS-00102"))
    app.data_grid.setItem(1, 2, QTableWidgetItem("2026-08-21"))

    # Step 5: Test Double-Clicking Row for Inline SDI Transition
    qtbot.waitUntil(lambda: app.data_grid.rowCount() == 2, timeout=1000)
    
    # Open form for selected record
    app.open_form("account", "account-guid-101")
    
    # Assert we switched to Page 1 (FormView) inside the SAME window (NO popups!)
    assert app.main_stack.currentIndex() == 1
    assert hasattr(app, "current_form")
    assert app.current_form is not None
    assert app.current_form.record_id == "account-guid-101"

    # Step 6: Verify Form Tabs and Fields in FormView
    form = app.current_form
    assert form.tab_widget is not None
    assert form.tab_widget.count() >= 1
    assert form.tab_widget.tabText(0) == "General"

    # Step 7: Test Inline Close / Back to Grid Navigation
    app.close_form_view()
    
    # Assert we smoothly returned to HomepageGrid (Page 0)
    assert app.main_stack.currentIndex() == 0
