from unittest.mock import patch

from PyQt6.QtCore import Qt

from VerseOff.generation import ModelDrivenApp
from VerseOff.maker_ui import MakerWizard


def test_maker_authenticates_and_binds_selected_app(qtbot):
    wizard = MakerWizard()
    qtbot.addWidget(wizard)
    wizard.show()

    connection_page = wizard.connection_page
    connection_page.url_input.clear()
    assert not connection_page.connect_btn.isEnabled()
    qtbot.keyClicks(
        connection_page.url_input,
        "https://test.crm.dynamics.com",
    )
    assert connection_page.connect_btn.isEnabled()

    with (
        patch("VerseOff.maker_ui.MsalAuth") as mock_auth,
        patch("VerseOff.maker_ui.MetadataFetcher") as mock_fetcher,
    ):
        mock_auth.return_value.get_token.return_value = "fake-token"
        mock_fetcher.return_value.who_am_i.return_value = {
            "UserId": "user-id"
        }
        mock_fetcher.return_value.get_app_modules.return_value = [
            {
                "appmoduleid": "app-1",
                "appmoduleidunique": "app-unique-1",
                "name": "Field Service",
                "uniquename": "msdyn_FieldService",
                "description": "Field operations",
            }
        ]

        qtbot.mouseClick(
            connection_page.connect_btn,
            Qt.MouseButton.LeftButton,
        )
        qtbot.waitUntil(lambda: wizard.currentId() == 1, timeout=3000)
        qtbot.waitUntil(
            lambda: wizard.app_page.app_combo.count() == 2,
            timeout=3000,
        )

        wizard.app_page.app_combo.setCurrentIndex(1)
        assert wizard.app_page.isComplete()
        assert wizard.app_page.validatePage()

    assert wizard.selected_app == ModelDrivenApp(
        app_module_id="app-1",
        app_module_id_unique="app-unique-1",
        name="Field Service",
        unique_name="msdyn_FieldService",
        description="Field operations",
    )


def test_component_review_uses_checkboxes_and_keeps_bpf_tables(qtbot):
    wizard = MakerWizard()
    qtbot.addWidget(wizard)
    wizard.connection_page.url_input.setText(
        "https://test.crm.dynamics.com"
    )
    wizard.auth_token = "fake-token"
    wizard.selected_app = ModelDrivenApp(
        app_module_id="app-1",
        name="Service App",
    )

    with patch("VerseOff.maker_ui.MetadataFetcher") as mock_fetcher:
        mock_fetcher.return_value.get_entities_for_app.return_value = [
            {
                "LogicalName": "account",
                "DisplayName": {
                    "UserLocalizedLabel": {"Label": "Accounts"}
                },
                "IsAvailableOffline": True,
            },
            {
                "LogicalName": "contact",
                "DisplayName": {
                    "UserLocalizedLabel": {"Label": "Contacts"}
                },
                "IsAvailableOffline": True,
            },
        ]
        mock_fetcher.return_value.get_bpf_definitions_for_app.return_value = {
            "case_process": {
                "primary_entity": "contact",
                "stages": [{"entity": "incident"}],
            }
        }

        wizard.component_page.initializePage()
        qtbot.waitUntil(
            lambda: wizard.component_page.list_widget.count() >= 3,
            timeout=3000,
        )

        page = wizard.component_page
        selected = page.selected_entities()
        assert "account" in selected
        assert "contact" in selected
        assert "incident" in selected
    page.clear_optional()
    assert page.selected_entities() == ["contact", "incident"]

    required_items = [
        page.list_widget.item(index)
        for index in range(page.list_widget.count())
        if page.list_widget.item(index).data(
            int(Qt.ItemDataRole.UserRole) + 1
        )
    ]
    assert {item.data(Qt.ItemDataRole.UserRole) for item in required_items} == {
        "contact",
        "incident",
    }
    assert all(
        not page.list_widget.itemWidget(item).isEnabled()
        for item in required_items
    )


def test_project_settings_uses_selected_app_name(tmp_path, qtbot):
    wizard = MakerWizard()
    qtbot.addWidget(wizard)
    wizard.selected_app = ModelDrivenApp(
        app_module_id="app-1",
        name="Customer Service Workspace",
    )
    page = wizard.settings_page
    page.destination_input.setText(str(tmp_path))
    page.initializePage()

    assert page.project_name_input.text() == "Customer-Service-Workspace"
    assert page.output_dir() == tmp_path / "Customer-Service-Workspace"
