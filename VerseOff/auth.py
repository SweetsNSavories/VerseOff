import msal
import os
import atexit

# Note: In a real enterprise app, you'd load these from a secure config/vault.
# Using placeholders for MVP.
CLIENT_ID = os.getenv("VERSEOFF_CLIENT_ID", "your-client-id-here")
TENANT_ID = os.getenv("VERSEOFF_TENANT_ID", "common") # Or your specific tenant ID
AUTHORITY = f"https://login.microsoftonline.com/{TENANT_ID}"
DATAVERSE_URL = os.getenv("DATAVERSE_URL", "https://your-org.crm.dynamics.com")
SCOPES = [f"{DATAVERSE_URL}/user_impersonation"]

CACHE_FILE = "verseoff_token_cache.bin"

class MsalAuth:
    def __init__(self, org_url: str, client_id: str = None, client_secret: str = None, tenant_id: str = "common"):
        # Fallback to official Microsoft Power Apps CLI client ID if none provided
        self.client_id = client_id if client_id else "51f81489-12ee-4a9e-aaae-a2591f45987d"
        self.client_secret = client_secret
        from urllib.parse import urlparse
        parsed_url = urlparse(org_url.rstrip("/"))
        self.org_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
        self.authority = f"https://login.microsoftonline.com/{tenant_id}"
        
        # If using Client Credentials, scope must be .default
        if self.client_secret:
            self.scopes = [f"{self.org_url}/.default"]
        else:
            self.scopes = [f"{self.org_url}/user_impersonation"]
            
        self.cache_file = "verseoff_token_cache.bin"

    def _save_cache(self, cache):
        if cache.has_state_changed:
            with open(self.cache_file, "w") as f:
                f.write(cache.serialize())

    def get_token(self):
        cache = msal.SerializableTokenCache()
        if os.path.exists(self.cache_file):
            with open(self.cache_file, "r") as f:
                try:
                    cache.deserialize(f.read())
                except Exception as e:
                    print(f"Warning: Could not read token cache: {e}")

        if self.client_secret:
            app = msal.ConfidentialClientApplication(
                self.client_id, 
                authority=self.authority,
                client_credential=self.client_secret,
                token_cache=cache
            )
            result = app.acquire_token_silent(self.scopes, account=None)
            if not result:
                print(f"[MSAL] Acquiring token via Client Credentials for {self.org_url}...")
                result = app.acquire_token_for_client(scopes=self.scopes)
        else:
            app = msal.PublicClientApplication(
                self.client_id, authority=self.authority, token_cache=cache
            )
            accounts = app.get_accounts()
            result = None
            if accounts:
                print(f"[MSAL] Found cached account: {accounts[0].get('username')}. Attempting silent token renewal...")
                result = app.acquire_token_silent(self.scopes, account=accounts[0])
    
            if not result:
                print(f"[MSAL] No valid cached token found. Opening browser for interactive login to {self.org_url}...")
                result = app.acquire_token_interactive(scopes=self.scopes)

        if result and "access_token" in result:
            self._save_cache(cache)
            username = result.get("id_token_claims", {}).get("preferred_username") or "User"
            print(f"[MSAL] Authentication successful for: {username}")
            return result["access_token"]
        else:
            error_desc = result.get('error_description') if result else 'No response from MSAL'
            error_code = result.get('error') if result else 'Unknown'
            print(f"[MSAL Error] {error_code}: {error_desc}")
            raise Exception(f"Authentication failed ({error_code}): {error_desc}")
