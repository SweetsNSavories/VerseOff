import pytest
import requests_mock
from VerseOff.metadata_fetcher import MetadataFetcher

@pytest.fixture
def mock_env():
    with requests_mock.Mocker() as m:
        fetcher = MetadataFetcher("https://org.crm.dynamics.com", "fake_token")
        yield m, fetcher

def test_get_app_modules(mock_env):
    m, fetcher = mock_env
    
    # Mock /appmodules response
    m.get("https://org.crm.dynamics.com/api/data/v9.2/appmodules", json={
        "value": [
            {
                "appmoduleid": "test-id-1",
                "appmoduleidunique": "unique-id-1",
                "name": "Test App 1"
            }
        ]
    })
    
    apps = fetcher.get_app_modules()
    assert len(apps) == 1
    assert apps[0]["appmoduleid"] == "test-id-1"

def test_get_entities_for_app(mock_env):
    m, fetcher = mock_env
    
    # Mock fetching appmoduleunique
    m.get("https://org.crm.dynamics.com/api/data/v9.2/appmodules(test-app-id)", json={
        "appmoduleidunique": "test-uid-123"
    })
    
    # Mock fetching components
    m.get("https://org.crm.dynamics.com/api/data/v9.2/appmodulecomponents", json={
        "value": [
            {"objectid": "entity-id-1"}
        ]
    })
    
    # Mock fetching EntityDefinition
    m.get("https://org.crm.dynamics.com/api/data/v9.2/EntityDefinitions(entity-id-1)", json={
        "LogicalName": "account",
        "DataProviderId": None # Not virtual
    })
    
    entities = fetcher.get_entities_for_app("test-app-id")
    assert len(entities) == 1
    assert entities[0]["LogicalName"] == "account"

def test_get_sitemap(mock_env):
    m, fetcher = mock_env
    
    # Mock appmoduleidunique
    m.get("https://org.crm.dynamics.com/api/data/v9.2/appmodules(test-app)", json={
        "appmoduleidunique": "uid-sitemap"
    })
    
    # Mock components for sitemap
    m.get("https://org.crm.dynamics.com/api/data/v9.2/appmodulecomponents", json={
        "value": [{"objectid": "sitemap-id"}]
    })
    
    # Mock sitemap XML
    m.get("https://org.crm.dynamics.com/api/data/v9.2/sitemaps(sitemap-id)", json={
        "sitemapxml": "<SiteMap><Area Id='Sales'><Group Id='Accounts'><SubArea Id='account' Entity='account' /></Group></Area></SiteMap>"
    })
    
    sitemap = fetcher.get_app_sitemap("test-app")
    assert len(sitemap["areas"]) == 1
    assert sitemap["areas"][0]["id"] == "Sales"
    assert sitemap["areas"][0]["groups"][0]["id"] == "Accounts"
    assert sitemap["areas"][0]["groups"][0]["subareas"][0]["entity"] == "account"
