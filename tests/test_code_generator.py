import pytest
import os
from unittest.mock import patch, MagicMock
from VerseOff.code_generator import CodeGenerator

@pytest.fixture
def dummy_manifest():
    return {
        "app_name": "Test App",
        "org_url": "https://test.crm.dynamics.com",
        "client_id": "test-client-id",
        "sync_interval": 300,
        "entities": [
            {
                "LogicalName": "account",
                "DisplayName": {"UserLocalizedLabel": {"Label": "Account"}},
                "EntitySetName": "accounts",
                "PrimaryIdAttribute": "accountid",
                "PrimaryNameAttribute": "name",
                "IsAvailableOffline": True
            }
        ],
        "sitemap": {
            "areas": [
                {
                    "id": "Sales",
                    "title": "Sales Area",
                    "groups": [
                        {
                            "id": "Customers",
                            "title": "Customers",
                            "subareas": [
                                {"id": "account", "title": "Accounts", "entity": "account"}
                            ]
                        }
                    ]
                }
            ]
        },
        "bpfs": {}
    }

def test_code_generator_success(tmp_path, dummy_manifest):
    out_dir = str(tmp_path / "GeneratedApp")
    
    # We must patch the Jinja Environment or we can just let it render!
    # Let's let it actually render since Jinja templates are locally available!
    # Wait, the templates are in VerseOff/templates relative to the code_generator.py location.
    
    gen = CodeGenerator(out_dir)
    gen.generate(dummy_manifest)
    
    # Check that it created the files
    assert os.path.exists(os.path.join(out_dir, "main.py"))
    assert os.path.exists(os.path.join(out_dir, "db.py"))
    # Check that manifest was saved
    assert os.path.exists(os.path.join(out_dir, "manifest.json"))
    
    # Check main.py content
    with open(os.path.join(out_dir, "main.py"), "r") as f:
        content = f.read()
        assert "class OfflineApp(QMainWindow)" in content
        assert "Accounts" in content
