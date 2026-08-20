import os
import sqlite3
import json
import logging

logger = logging.getLogger(__name__)

class LocalDatabase:
    def __init__(self, db_path=None):
        if db_path is None:
            self.db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "verseoff_local.db")
        else:
            self.db_path = db_path
        self._init_db()

    def get_connection(self):
        return sqlite3.connect(self.db_path)

    def _init_db(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            # Entities generated from manifest
            # Table: msdyn_dataanalyticsreport_ksinsights
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS msdyn_dataanalyticsreport_ksinsights (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: queueitem
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS queueitem (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: msdyn_swarm
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS msdyn_swarm (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: msdyn_ocliveworkitem
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS msdyn_ocliveworkitem (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: msdyn_evaluationplan
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS msdyn_evaluationplan (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: msdyn_dataanalyticsreport_ur_recordrouting_rt
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS msdyn_dataanalyticsreport_ur_recordrouting_rt (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: msdyn_dataanalyticsreport_email
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS msdyn_dataanalyticsreport_email (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: msdyn_dataanalyticsreport_csrmanager
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS msdyn_dataanalyticsreport_csrmanager (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: knowledgearticle
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS knowledgearticle (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: template
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS template (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: msdyn_dataanalyticsreport_oc_rt
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS msdyn_dataanalyticsreport_oc_rt (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: msdyn_evaluationcriteria
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS msdyn_evaluationcriteria (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: msdyn_evaluation
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS msdyn_evaluation (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: serviceappointment
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS serviceappointment (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: msdyn_dataanalyticsreport_ocmodern
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS msdyn_dataanalyticsreport_ocmodern (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: msdyn_dataanalyticsreport_copilot
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS msdyn_dataanalyticsreport_copilot (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: account
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS account (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: emailsignature
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS emailsignature (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: socialprofile
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS socialprofile (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: msdyn_dataanalyticsreport_mc
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS msdyn_dataanalyticsreport_mc (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: msdyn_dataanalyticsreport_oc
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS msdyn_dataanalyticsreport_oc (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: activitypointer
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS activitypointer (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: msdyn_customerasset
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS msdyn_customerasset (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: contact
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS contact (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: msdyn_screenrecording
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS msdyn_screenrecording (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: incident
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS incident (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: msdyn_iotalert
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS msdyn_iotalert (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: routingrule
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS routingrule (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: routingruleitem
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS routingruleitem (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: convertrule
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS convertrule (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: convertruleitem
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS convertruleitem (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: sla
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS sla (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: slaitem
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS slaitem (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: slakpiinstance
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS slakpiinstance (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: entitlement
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS entitlement (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: entitlementchannel
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS entitlementchannel (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            # Table: entitlementtemplate
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS entitlementtemplate (
                    id TEXT PRIMARY KEY,
                    data_json TEXT,
                    sync_status TEXT DEFAULT 'synced',  -- 'synced', 'pending_update', 'pending_create', 'rejected', 'conflict'
                    sync_error TEXT,
                    last_modified TEXT
                )
            ''')
            
            # System tables
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS _sync_state (
                    entity_name TEXT PRIMARY KEY,
                    last_sync_time TEXT
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS saved_queries (
                    savedqueryid TEXT PRIMARY KEY,
                    name TEXT,
                    returnedtypecode TEXT,
                    fetchxml TEXT,
                    layoutxml TEXT
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS sync_queue (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    entity_name TEXT,
                    record_id TEXT,
                    operation TEXT,
                    data_json TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()

    def get_record(self, entity_name, record_id):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(f"SELECT data_json, sync_status, sync_error FROM {entity_name} WHERE id = ?", (record_id,))
            row = cursor.fetchone()
            if row:
                data = json.loads(row[0])
                data['_sync_status'] = row[1]
                data['_sync_error'] = row[2]
                return data
            return None

    def upsert_record(self, entity_name, record_id, data, sync_status='synced', sync_error=None):
        data_json = json.dumps(data)
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(f'''
                INSERT INTO {entity_name} (id, data_json, sync_status, sync_error)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    data_json=excluded.data_json,
                    sync_status=excluded.sync_status,
                    sync_error=excluded.sync_error
            ''', (record_id, data_json, sync_status, sync_error))
            conn.commit()

    def get_pending_records(self, entity_name):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(f"SELECT id, data_json, sync_status FROM {entity_name} WHERE sync_status IN ('pending_update', 'pending_create')")
            return [{"id": row[0], "data": json.loads(row[1]), "status": row[2]} for row in cursor.fetchall()]