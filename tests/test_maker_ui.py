import pytest
from PyQt6.QtCore import Qt
from unittest.mock import patch, MagicMock

# Import the UI components
from VerseOff.maker_ui import MakerWizard

def test_maker_wizard_headless_navigation(qtbot):
    """
    Tests the MakerWizard UI headlessly by simulating clicks
    and mocking out the actual Dataverse/MSAL network calls.
    """
    # 1. Initialize the UI and register it with qtbot
    wizard = MakerWizard()
    qtbot.addWidget(wizard)
    wizard.show()
    
    # Assert we start on the first page
    assert wizard.currentId() == 0
    
    # 2. Test input validation on the Welcome Page
    welcome_page = wizard.page(0)
    
    # Clearing the URL disables the button
    welcome_page.url_input.clear()
    assert not welcome_page.connect_btn.isEnabled()
    
    # Type into the URL box using qtbot
    qtbot.keyClicks(welcome_page.url_input, "https://orgb7c4e2ec.crm8.dynamics.com/")
    
    # The button should now be enabled
    assert welcome_page.connect_btn.isEnabled()
    
    # 3. Mock the Auth and Metadata fetching so it doesn't open a browser
    with patch('VerseOff.maker_ui.MsalAuth') as MockAuth, \
         patch('VerseOff.maker_ui.MetadataFetcher') as MockFetcher:
             
        # Setup mock token
        MockAuth.return_value.get_token.return_value = "fake_token_123"
        
        # Setup mock app modules returned by the fetcher
        MockFetcher.return_value.get_app_modules.return_value = [
            {"appmoduleid": "app-1", "name": "Test Field Service App"}
        ]
        
        # 4. Simulate clicking the "Connect" button
        qtbot.mouseClick(welcome_page.connect_btn, Qt.MouseButton.LeftButton)
        
        # Wait for the UI thread to process the signals and transition pages
        qtbot.waitUntil(lambda: wizard.currentId() == 1, timeout=2000)
        
        # 5. Verify we successfully reached the App Selection page
        assert wizard.currentId() == 1
        
        # Verify the mock data populated the combobox
        app_page = wizard.page(1)
        assert app_page.app_combo.count() == 1
        assert app_page.app_combo.currentText() == "Test Field Service App"
