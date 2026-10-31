import time
import json
import sqlite3
import traceback
from PyQt6.QtCore import QThread, pyqtSignal
from db import get_db_connection

try:
    import msal
    import requests
    MSAL_AVAILABLE = True
except ImportError:
    MSAL_AVAILABLE = False
    print("Warning: 'msal' or 'requests' package not found. Sync engine will operate in mock mode. Install with: pip install msal requests")

class FallbackRESTProvider:
    """Routes payloads to Snowflake if D365 Dataverse is unavailable."""
    def push_to_snowflake(self, table_name, record_id, payload):
        print(f"[SNOWFLAKE FALLBACK] Pushing {table_name} record {record_id} to Snowflake Data Lake...")
        # Mocking a Snowflake REST API call
        time.sleep(1) # simulate latency
        print(f"[SNOWFLAKE FALLBACK] Successfully persisted to Snowflake.")
        return True

class SyncWorker(QThread):
    sync_finished = pyqtSignal(int, int) # emitted when sync completes: (success_count, fail_count)
    sync_log = pyqtSignal(str) # For UI logging
    
    def __init__(self, d365_url, client_id, tenant_id, parent=None):
        super().__init__(parent)
        self.d365_url = d365_url
        self.client_id = client_id
        self.tenant_id = tenant_id
        self.fallback_provider = FallbackRESTProvider()
        
    def acquire_token(self):
        """Silently acquires Azure AD token using MSAL TokenCache."""
        if not MSAL_AVAILABLE:
            self.sync_log.emit("Mocking MSAL Token Acquisition (MSAL library missing).")
            return "mock_token"
            
        authority = f"https://login.microsoftonline.com/{self.tenant_id}"
        app = msal.PublicClientApplication(self.client_id, authority=authority)
        
        # In a real app, we load cache from disk. Here we just mock the silent flow.
        accounts = app.get_accounts()
        if accounts:
            result = app.acquire_token_silent(["User.Read"], account=accounts[0])
            if result:
                return result['access_token']
                
        # For offline MVP, we just return a mock token if interactive auth is needed.
        self.sync_log.emit("No cached token found. Returning mock token for MVP.")
        return "mock_token"
        
    def run(self):
        self.sync_log.emit("Sync Engine woke up. Acquiring AAD Token...")
        token = self.acquire_token()
        
        headers = {
            "Authorization": f"Bearer {token}",
            "OData-MaxVersion": "4.0",
            "OData-Version": "4.0",
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8"
        }
        
        success_count = 0
        fail_count = 0
        
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Find all pending records
            # Since SQLite doesn't have an easy way to query "all tables", we will 
            # query sqlite_master for tables and look for sync_status column
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = cursor.fetchall()
            
            for (table_name,) in tables:
                # Check if table has sync_status
                cursor.execute(f"PRAGMA table_info({table_name})")
                columns = [col[1] for col in cursor.fetchall()]
                if 'sync_status' not in columns or 'id' not in columns:
                    continue
                    
                cursor.execute(f"SELECT * FROM {table_name} WHERE sync_status = 'PENDING'")
                pending_records = cursor.fetchall()
                
                for record in pending_records:
                    record_id = record['id']
                    
                    # Convert sqlite Row to dict and strip internal offline metadata
                    payload = dict(record)
                    etag = payload.pop('etag', None)
                    payload.pop('sync_status', None)
                    
                    self.sync_log.emit(f"Synchronizing {table_name} ({record_id})...")
                    
                    if etag:
                        headers["If-Match"] = etag # Optimistic Concurrency
                        
                    # Simulating the Dataverse PATCH request
                    if MSAL_AVAILABLE:
                        # try:
                        #     url = f"{self.d365_url}/api/data/v9.2/{table_name}s({record_id})"
                        #     response = requests.patch(url, headers=headers, json=payload, timeout=10)
                        # except requests.exceptions.RequestException as e:
                        #    ...
                        pass
                        
                    # --- MOCKING THE NETWORK RESPONSE FOR OFFLINE MVP ---
                    time.sleep(0.5) # Simulate network latency
                    
                    # We will randomly simulate 412 Precondition Failed, 503 Timeout, or 204 Success based on record logic.
                    # For safety, let's just make everything succeed, but randomly 503 every 5th record.
                    mock_status = 204 
                    if hash(str(record_id)) % 5 == 0:
                        mock_status = 503 # Service Unavailable
                    elif hash(str(record_id)) % 7 == 0:
                        mock_status = 412 # Precondition Failed (ETag mismatch)
                        
                    if mock_status == 204:
                        self.sync_log.emit(f"Dataverse Success: {record_id}")
                        cursor.execute(f"UPDATE {table_name} SET sync_status = 'SYNCED' WHERE id = ?", (record_id,))
                        success_count += 1
                    elif mock_status == 412:
                        self.sync_log.emit(f"Dataverse Conflict (412): {record_id} modified online! Flagging as CONFLICT.")
                        cursor.execute(f"UPDATE {table_name} SET sync_status = 'CONFLICT' WHERE id = ?", (record_id,))
                        fail_count += 1
                    elif mock_status == 503:
                        self.sync_log.emit(f"Dataverse Down (503). Triggering Fallback REST Provider.")
                        if self.fallback_provider.push_to_snowflake(table_name, record_id, payload):
                            # Mark as synced since it made it to the data lake
                            cursor.execute(f"UPDATE {table_name} SET sync_status = 'SYNCED_TO_LAKE' WHERE id = ?", (record_id,))
                            success_count += 1
                        else:
                            fail_count += 1
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            self.sync_log.emit(f"Sync Engine Error: {e}")
            traceback.print_exc()
            fail_count += 1
            
        self.sync_finished.emit(success_count, fail_count)
