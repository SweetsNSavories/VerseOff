import pytest
from unittest.mock import patch, MagicMock
from VerseOff.auth import MsalAuth

def test_auth_silent_success(tmp_path):
    mock_cache = tmp_path / "mock_cache.bin"
    
    with patch("VerseOff.auth.msal.PublicClientApplication") as mock_pca:
        # Mock pca instance
        pca_instance = mock_pca.return_value
        
        # Mock accounts
        pca_instance.get_accounts.return_value = [{"username": "test@user.com"}]
        
        # Mock silent success
        pca_instance.acquire_token_silent.return_value = {"access_token": "mock_token"}
        
        auth = MsalAuth("https://org.crm.dynamics.com")
        auth.cache_file = str(mock_cache)
        token = auth.get_token()
        
        assert token == "mock_token"
        pca_instance.acquire_token_silent.assert_called_once()
        pca_instance.acquire_token_interactive.assert_not_called()

def test_auth_silent_fail_interactive_success(tmp_path):
    mock_cache = tmp_path / "mock_cache.bin"
    
    with patch("VerseOff.auth.msal.PublicClientApplication") as mock_pca:
        pca_instance = mock_pca.return_value
        
        # Mock accounts but silent fails
        pca_instance.get_accounts.return_value = [{"username": "test@user.com"}]
        pca_instance.acquire_token_silent.return_value = None
        
        # Interactive succeeds
        pca_instance.acquire_token_interactive.return_value = {"access_token": "mock_interactive_token"}
        
        auth = MsalAuth("https://org.crm.dynamics.com")
        auth.cache_file = str(mock_cache)
        token = auth.get_token()
        
        assert token == "mock_interactive_token"
        pca_instance.acquire_token_silent.assert_called_once()
        pca_instance.acquire_token_interactive.assert_called_once()

def test_auth_interactive_fail(tmp_path):
    mock_cache = tmp_path / "mock_cache.bin"
    
    with patch("VerseOff.auth.msal.PublicClientApplication") as mock_pca:
        pca_instance = mock_pca.return_value
        pca_instance.get_accounts.return_value = []
        
        # Interactive fails (e.g. user closes window)
        pca_instance.acquire_token_interactive.return_value = {"error": "user_cancelled"}
        
        auth = MsalAuth("https://org.crm.dynamics.com")
        auth.cache_file = str(mock_cache)
        
        with pytest.raises(Exception, match=r"Authentication failed \(user_cancelled\)"):
            auth.get_token()
