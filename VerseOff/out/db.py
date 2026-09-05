import json
import os
import re
import sqlite3
import sys
from pathlib import Path

try:
    from crypto_manager import CryptoManager
except ImportError:
    try:
        from VerseOff.crypto_manager import CryptoManager
    except ImportError:
        CryptoManager = None


ENTITY_NAMES = {
    "account",
    "contact",
    "incident",
    "opportunity",
    "lead",
}
DYNAMIC_TABLES_CREATED = set()
APP_STORAGE_KEY = "00000000-0000-0000-0000-000000000001"
TIMELINE_TEXT_FIELDS = (
    "subject",
    "title",
    "description",
    "notetext",
    "text",
    "message",
    "content",
)
TIMELINE_PARENT_FIELDS = (
    "_regardingobjectid_value",
    "regardingobjectid",
    "_objectid_value",
    "objectid",
)


def _resource_path(filename):
    base_dir = getattr(sys, "_MEIPASS", os.path.dirname(os.path.abspath(__file__)))
    target = os.path.join(base_dir, filename)
    if os.path.exists(target):
        return target
    if filename == "manifest.json":
        for fallback in [
            os.path.join(base_dir, "mock_manifest.json"),
            os.path.join(os.path.dirname(base_dir), "mock_manifest.json"),
            os.path.join(os.path.dirname(base_dir), "manifest.json"),
            os.path.join(os.path.dirname(os.path.dirname(base_dir)), "VerseOff", "mock_manifest.json"),
        ]:
            if os.path.exists(fallback):
                return fallback
    return target


def _default_data_dir():
    configured = os.getenv("VERSEOFF_DATA_DIR")
    if configured:
        return Path(configured)
    base_dir = os.getenv("LOCALAPPDATA")
    if base_dir:
        return Path(base_dir) / "VerseOff" / APP_STORAGE_KEY
    return Path.home() / ".local" / "share" / "VerseOff" / APP_STORAGE_KEY


def _timeline_search_text(data):
    values = []
    for field in TIMELINE_TEXT_FIELDS:
        value = data.get(field)
        if value:
            values.append(re.sub(r"<[^>]+>", " ", str(value)))
    return " ".join(values)


def _timeline_parent_id(data):
    for field in TIMELINE_PARENT_FIELDS:
        value = data.get(field)
        if value:
            return str(value).strip("{}").lower()
    return ""


class LocalDatabase:
    _INITIALIZED_PATHS = set()

    def __init__(self, db_path=None):
        if db_path is None:
            data_dir = _default_data_dir()
            data_dir.mkdir(parents=True, exist_ok=True)
            self.db_path = str(data_dir / "verseoff_local.db")
            resolved_dir = str(data_dir)
        else:
            self.db_path = str(db_path)
            resolved_dir = os.path.dirname(os.path.abspath(self.db_path))

        if CryptoManager:
            self.crypto = CryptoManager.get_instance(resolved_dir)
        else:
            self.crypto = None

        if self.db_path not in LocalDatabase._INITIALIZED_PATHS:
            self._init_db()
            LocalDatabase._INITIALIZED_PATHS.add(self.db_path)

    def _serialize_data(self, data: dict) -> str:
        if self.crypto:
            return self.crypto.encrypt_dict(data)
        return json.dumps(data, ensure_ascii=False)

    def _deserialize_data(self, payload_str: str) -> dict:
        if not payload_str:
            return {}
        if self.crypto:
            try:
                return self.crypto.decrypt_dict(payload_str)
            except Exception:
                pass
        try:
            return json.loads(payload_str)
        except Exception:
            return {}

    def secure_wipe(self):
        """Zeroizes encryption keys and securely wipes database contents."""
        if self.crypto:
            self.crypto.secure_wipe()
        with self.get_connection() as conn:
            for entity in ENTITY_NAMES:
                try:
                    conn.execute(f"DELETE FROM {entity}")
                except Exception:
                    pass
            conn.commit()
        conn = self.get_connection()
        try:
            conn.isolation_level = None
            conn.execute("VACUUM")
        except Exception:
            pass
        finally:
            conn.close()

    def _validate_entity_name(self, entity_name):
        if not re.match(r"^[a-zA-Z0-9_]+$", entity_name):
            raise ValueError(f"Invalid entity name: {entity_name}")

    def _ensure_table(self, conn, entity_name):
        if entity_name in ENTITY_NAMES or entity_name in DYNAMIC_TABLES_CREATED:
            return
        conn.execute(f"""
            CREATE TABLE IF NOT EXISTS {entity_name} (
                id TEXT PRIMARY KEY,
                data_json TEXT NOT NULL,
                sync_status TEXT NOT NULL DEFAULT 'synced',
                sync_error TEXT,
                last_modified TEXT
            )
        """)
        DYNAMIC_TABLES_CREATED.add(entity_name)

    def get_connection(self):
        connection = sqlite3.connect(self.db_path, timeout=30)
        connection.row_factory = sqlite3.Row
        return connection

    def _init_db(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS account (
                    id TEXT PRIMARY KEY,
                    data_json TEXT NOT NULL,
                    sync_status TEXT NOT NULL DEFAULT 'synced',
                    sync_error TEXT,
                    last_modified TEXT
                )
            """)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS contact (
                    id TEXT PRIMARY KEY,
                    data_json TEXT NOT NULL,
                    sync_status TEXT NOT NULL DEFAULT 'synced',
                    sync_error TEXT,
                    last_modified TEXT
                )
            """)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS incident (
                    id TEXT PRIMARY KEY,
                    data_json TEXT NOT NULL,
                    sync_status TEXT NOT NULL DEFAULT 'synced',
                    sync_error TEXT,
                    last_modified TEXT
                )
            """)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS opportunity (
                    id TEXT PRIMARY KEY,
                    data_json TEXT NOT NULL,
                    sync_status TEXT NOT NULL DEFAULT 'synced',
                    sync_error TEXT,
                    last_modified TEXT
                )
            """)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS lead (
                    id TEXT PRIMARY KEY,
                    data_json TEXT NOT NULL,
                    sync_status TEXT NOT NULL DEFAULT 'synced',
                    sync_error TEXT,
                    last_modified TEXT
                )
            """)

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS _sync_state (
                    entity_name TEXT PRIMARY KEY,
                    last_sync_time TEXT,
                    delta_link TEXT
                )
            """)
            sync_state_columns = {
                row["name"]
                for row in cursor.execute("PRAGMA table_info(_sync_state)")
            }
            if "delta_link" not in sync_state_columns:
                cursor.execute(
                    "ALTER TABLE _sync_state ADD COLUMN delta_link TEXT"
                )

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS saved_queries (
                    savedqueryid TEXT PRIMARY KEY,
                    name TEXT,
                    returnedtypecode TEXT,
                    querytype INTEGER,
                    isdefault INTEGER,
                    fetchxml TEXT,
                    layoutxml TEXT
                )
            """)

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS sync_queue (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    entity_name TEXT,
                    record_id TEXT,
                    operation TEXT,
                    data_json TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS _timeline_preferences (
                    timeline_id TEXT NOT NULL,
                    parent_entity TEXT NOT NULL,
                    settings_json TEXT NOT NULL,
                    updated_on DATETIME DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (timeline_id, parent_entity)
                )
            """)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS _timeline_pins (
                    timeline_id TEXT NOT NULL,
                    entity_name TEXT NOT NULL,
                    record_id TEXT NOT NULL,
                    pinned_on DATETIME DEFAULT CURRENT_TIMESTAMP,
                    expires_on DATETIME,
                    PRIMARY KEY (timeline_id, entity_name, record_id)
                )
            """)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS _timeline_actions (
                    action_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timeline_id TEXT NOT NULL,
                    entity_name TEXT NOT NULL,
                    record_id TEXT,
                    action_name TEXT NOT NULL,
                    payload_json TEXT NOT NULL,
                    status TEXT NOT NULL DEFAULT 'pending',
                    error TEXT,
                    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_on DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS _timeline_attachments (
                    attachment_key TEXT PRIMARY KEY,
                    parent_entity TEXT NOT NULL,
                    parent_id TEXT NOT NULL,
                    file_name TEXT NOT NULL,
                    mime_type TEXT,
                    file_size INTEGER NOT NULL,
                    checksum TEXT,
                    transfer_status TEXT NOT NULL DEFAULT 'local',
                    local_path TEXT,
                    error TEXT
                )
            """)
            cursor.execute("""
                CREATE VIRTUAL TABLE IF NOT EXISTS _timeline_search
                USING fts5(
                    entity_name UNINDEXED,
                    record_id UNINDEXED,
                    parent_id UNINDEXED,
                    record_type UNINDEXED,
                    visible_text
                )
            """)

            self._seed_saved_queries(cursor)
            self._seed_timeline_search(cursor)
            conn.commit()

    @staticmethod
    def _seed_saved_queries(cursor):
        manifest_path = _resource_path("manifest.json")
        with open(manifest_path, "r", encoding="utf-8") as manifest_file:
            manifest = json.load(manifest_file)
        for entity in manifest.get("entities", []):
            for query in entity.get("saved_queries", []):
                query_id = query.get("savedqueryid")
                if not query_id:
                    continue
                cursor.execute(
                    """
                    INSERT INTO saved_queries (
                        savedqueryid, name, returnedtypecode, querytype,
                        isdefault, fetchxml, layoutxml
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(savedqueryid) DO UPDATE SET
                        name=excluded.name,
                        returnedtypecode=excluded.returnedtypecode,
                        querytype=excluded.querytype,
                        isdefault=excluded.isdefault,
                        fetchxml=excluded.fetchxml,
                        layoutxml=excluded.layoutxml
                    """,
                    (
                        query_id,
                        query.get("name"),
                        query.get("returnedtypecode")
                        or entity.get("LogicalName"),
                        query.get("querytype"),
                        int(bool(query.get("isdefault"))),
                        query.get("fetchxml"),
                        query.get("layoutxml"),
                    ),
                )

    @staticmethod
    def _index_timeline_record(
        connection,
        entity_name,
        record_id,
        data,
    ):
        connection.execute(
            """
            DELETE FROM _timeline_search
            WHERE entity_name = ? AND record_id = ?
            """,
            (entity_name, record_id),
        )
        visible_text = _timeline_search_text(data)
        parent_id = _timeline_parent_id(data)
        if visible_text or parent_id:
            connection.execute(
                """
                INSERT INTO _timeline_search (
                    entity_name, record_id, parent_id,
                    record_type, visible_text
                )
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    entity_name,
                    record_id,
                    parent_id,
                    entity_name,
                    visible_text,
                ),
            )

    @classmethod
    def _seed_timeline_search(cls, cursor):
        for entity_name in ENTITY_NAMES:
            rows = cursor.execute(
                f"SELECT id, data_json FROM {entity_name}"
            ).fetchall()
            for row in rows:
                try:
                    payload = row["data_json"]
                    if CryptoManager:
                        data = CryptoManager.get_instance().decrypt_dict(payload)
                    else:
                        data = json.loads(payload)
                except Exception:
                    continue
                cls._index_timeline_record(
                    cursor.connection,
                    entity_name,
                    row["id"],
                    data,
                )

    def get_record(self, entity_name, record_id):
        self._validate_entity_name(entity_name)
        with self.get_connection() as conn:
            self._ensure_table(conn, entity_name)
            row = conn.execute(
                f"""
                SELECT data_json, sync_status, sync_error
                FROM {entity_name}
                WHERE id = ?
                """,
                (record_id,),
            ).fetchone()
        if not row:
            return None
        data = self._deserialize_data(row["data_json"])
        data["_sync_status"] = row["sync_status"]
        data["_sync_error"] = row["sync_error"]
        return data

    def upsert_record(
        self,
        entity_name,
        record_id,
        data,
        sync_status="synced",
        sync_error=None,
    ):
        self._validate_entity_name(entity_name)
        data_json = self._serialize_data(data)
        last_modified = data.get("modifiedon")
        with self.get_connection() as conn:
            conn.execute(
                f"""
                INSERT INTO {entity_name} (
                    id, data_json, sync_status, sync_error, last_modified
                )
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    data_json=excluded.data_json,
                    sync_status=excluded.sync_status,
                    sync_error=excluded.sync_error,
                    last_modified=excluded.last_modified
                """,
                (
                    record_id,
                    data_json,
                    sync_status,
                    sync_error,
                    last_modified,
                ),
            )
            self._index_timeline_record(
                conn,
                entity_name,
                record_id,
                data,
            )
            conn.commit()

    def upsert_remote_record(self, entity_name, record_id, data):
        self._validate_entity_name(entity_name)
        with self.get_connection() as conn:
            self._ensure_table(conn, entity_name)
            current = conn.execute(
                f"SELECT sync_status FROM {entity_name} WHERE id = ?",
                (record_id,),
            ).fetchone()
            if current and current["sync_status"] in {
                "pending_create",
                "pending_update",
                "conflict",
            }:
                return False
            conn.execute(
                f"""
                INSERT INTO {entity_name} (
                    id, data_json, sync_status, sync_error, last_modified
                )
                VALUES (?, ?, 'synced', NULL, ?)
                ON CONFLICT(id) DO UPDATE SET
                    data_json=excluded.data_json,
                    sync_status='synced',
                    sync_error=NULL,
                    last_modified=excluded.last_modified
                """,
                (
                    record_id,
                    self._serialize_data(data),
                    data.get("modifiedon"),
                ),
            )
            self._index_timeline_record(
                conn,
                entity_name,
                record_id,
                data,
            )
            conn.commit()
        return True

    def delete_remote_record(self, entity_name, record_id):
        self._validate_entity_name(entity_name)
        with self.get_connection() as conn:
            self._ensure_table(conn, entity_name)
            current = conn.execute(
                f"SELECT sync_status FROM {entity_name} WHERE id = ?",
                (record_id,),
            ).fetchone()
            if not current:
                return True
            if current["sync_status"] != "synced":
                return False
            conn.execute(
                f"DELETE FROM {entity_name} WHERE id = ?",
                (record_id,),
            )
            conn.execute(
                """
                DELETE FROM _timeline_search
                WHERE entity_name = ? AND record_id = ?
                """,
                (entity_name, record_id),
            )
            conn.commit()
        return True

    def get_pending_records(self, entity_name):
        self._validate_entity_name(entity_name)
        with self.get_connection() as conn:
            self._ensure_table(conn, entity_name)
            rows = conn.execute(
                f"""
                SELECT id, data_json, sync_status
                FROM {entity_name}
                WHERE sync_status IN (
                    'pending_update',
                    'pending_create',
                    'pending_delete'
                )
                """
            ).fetchall()
        return [
            {
                "id": row["id"],
                "data": self._deserialize_data(row["data_json"]),
                "status": row["sync_status"],
            }
            for row in rows
        ]

    def queue_delete(self, entity_name, record_id):
        self._validate_entity_name(entity_name)
        with self.get_connection() as conn:
            self._ensure_table(conn, entity_name)
            current = conn.execute(
                f"SELECT sync_status FROM {entity_name} WHERE id = ?",
                (record_id,),
            ).fetchone()
            if not current:
                return False
            if current["sync_status"] == "pending_create":
                conn.execute(
                    f"DELETE FROM {entity_name} WHERE id = ?",
                    (record_id,),
                )
                conn.execute(
                    """
                    DELETE FROM _timeline_search
                    WHERE entity_name = ? AND record_id = ?
                    """,
                    (entity_name, record_id),
                )
            else:
                conn.execute(
                    f"""
                    UPDATE {entity_name}
                    SET sync_status = 'pending_delete', sync_error = NULL
                    WHERE id = ?
                    """,
                    (record_id,),
                )
            conn.commit()
        return True

    def remove_record(self, entity_name, record_id):
        self._validate_entity_name(entity_name)
        with self.get_connection() as conn:
            conn.execute(
                f"DELETE FROM {entity_name} WHERE id = ?",
                (record_id,),
            )
            conn.execute(
                """
                DELETE FROM _timeline_search
                WHERE entity_name = ? AND record_id = ?
                """,
                (entity_name, record_id),
            )
            conn.commit()

    def set_record_sync_status(
        self,
        entity_name,
        record_id,
        status,
        error=None,
    ):
        self._validate_entity_name(entity_name)
        with self.get_connection() as conn:
            conn.execute(
                f"""
                UPDATE {entity_name}
                SET sync_status = ?, sync_error = ?
                WHERE id = ?
                """,
                (status, error, record_id),
            )
            conn.commit()

    def get_delta_link(self, entity_name):
        with self.get_connection() as conn:
            row = conn.execute(
                """
                SELECT delta_link
                FROM _sync_state
                WHERE entity_name = ?
                """,
                (entity_name,),
            ).fetchone()
        return row["delta_link"] if row else None

    def set_delta_link(self, entity_name, delta_link):
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT INTO _sync_state (
                    entity_name, last_sync_time, delta_link
                )
                VALUES (?, CURRENT_TIMESTAMP, ?)
                ON CONFLICT(entity_name) DO UPDATE SET
                    last_sync_time=CURRENT_TIMESTAMP,
                    delta_link=excluded.delta_link
                """,
                (entity_name, delta_link),
            )
            conn.commit()

    def list_records(self, entity_name, include_deleted=False):
        self._validate_entity_name(entity_name)
        where_clause = (
            ""
            if include_deleted
            else "WHERE sync_status != 'pending_delete'"
        )
        with self.get_connection() as conn:
            rows = conn.execute(
                f"""
                SELECT id, data_json, sync_status, sync_error, last_modified
                FROM {entity_name}
                {where_clause}
                """
            ).fetchall()
        records = []
        for row in rows:
            try:
                data = self._deserialize_data(row["data_json"])
            except Exception:
                continue
            data.setdefault("id", row["id"])
            data["_sync_status"] = row["sync_status"]
            data["_sync_error"] = row["sync_error"]
            data["_last_modified"] = row["last_modified"]
            records.append(data)
        return records

    def search_timeline_record_ids(self, parent_id, query):
        normalized_parent = str(parent_id or "").strip("{}").lower()
        search_query = " ".join(
            token + "*"
            for token in re.findall(r"[\w]+", str(query or ""))
        )
        if not search_query:
            return set()
        with self.get_connection() as conn:
            rows = conn.execute(
                """
                SELECT entity_name, record_id
                FROM _timeline_search
                WHERE parent_id = ? AND _timeline_search MATCH ?
                """,
                (normalized_parent, search_query),
            ).fetchall()
        return {
            (row["entity_name"], row["record_id"])
            for row in rows
        }

    def get_timeline_preferences(self, timeline_id, parent_entity):
        with self.get_connection() as conn:
            row = conn.execute(
                """
                SELECT settings_json
                FROM _timeline_preferences
                WHERE timeline_id = ? AND parent_entity = ?
                """,
                (timeline_id, parent_entity),
            ).fetchone()
        if not row:
            return {}
        try:
            return self._deserialize_data(row["settings_json"])
        except Exception:
            return {}

    def set_timeline_preferences(
        self,
        timeline_id,
        parent_entity,
        settings,
    ):
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT INTO _timeline_preferences (
                    timeline_id, parent_entity, settings_json, updated_on
                )
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(timeline_id, parent_entity) DO UPDATE SET
                    settings_json=excluded.settings_json,
                    updated_on=CURRENT_TIMESTAMP
                """,
                (
                    timeline_id,
                    parent_entity,
                    self._serialize_data(settings),
                ),
            )
            conn.commit()

    def get_timeline_pins(self, timeline_id):
        with self.get_connection() as conn:
            conn.execute(
                """
                DELETE FROM _timeline_pins
                WHERE expires_on IS NOT NULL
                  AND expires_on <= CURRENT_TIMESTAMP
                """
            )
            rows = conn.execute(
                """
                SELECT entity_name, record_id
                FROM _timeline_pins
                WHERE timeline_id = ?
                ORDER BY pinned_on DESC
                """,
                (timeline_id,),
            ).fetchall()
            conn.commit()
        return {
            (row["entity_name"], row["record_id"])
            for row in rows
        }

    def set_timeline_pin(
        self,
        timeline_id,
        entity_name,
        record_id,
        pinned,
    ):
        with self.get_connection() as conn:
            if pinned:
                count = conn.execute(
                    """
                    SELECT COUNT(*) AS count
                    FROM _timeline_pins
                    WHERE timeline_id = ?
                    """,
                    (timeline_id,),
                ).fetchone()["count"]
                if count >= 15:
                    raise ValueError(
                        "A Timeline can contain at most 15 pinned records."
                    )
                conn.execute(
                    """
                    INSERT INTO _timeline_pins (
                        timeline_id, entity_name, record_id, expires_on
                    )
                    VALUES (
                        ?, ?, ?,
                        datetime('now', '+1 year')
                    )
                    ON CONFLICT(
                        timeline_id, entity_name, record_id
                    ) DO UPDATE SET
                        pinned_on=CURRENT_TIMESTAMP,
                        expires_on=datetime('now', '+1 year')
                    """,
                    (timeline_id, entity_name, record_id),
                )
            else:
                conn.execute(
                    """
                    DELETE FROM _timeline_pins
                    WHERE timeline_id = ?
                      AND entity_name = ?
                      AND record_id = ?
                    """,
                    (timeline_id, entity_name, record_id),
                )
            conn.commit()

    def queue_timeline_action(
        self,
        timeline_id,
        entity_name,
        record_id,
        action_name,
        payload=None,
    ):
        with self.get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO _timeline_actions (
                    timeline_id, entity_name, record_id,
                    action_name, payload_json
                )
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    timeline_id,
                    entity_name,
                    record_id,
                    action_name,
                    self._serialize_data(payload or {}),
                ),
            )
            conn.commit()
            return cursor.lastrowid

    def list_timeline_actions(self, status="pending"):
        with self.get_connection() as conn:
            rows = conn.execute(
                """
                SELECT *
                FROM _timeline_actions
                WHERE status = ?
                ORDER BY action_id
                """,
                (status,),
            ).fetchall()
        actions = []
        for row in rows:
            item = dict(row)
            if "payload_json" in item:
                item["payload"] = self._deserialize_data(item["payload_json"])
            actions.append(item)
        return actions

    def set_timeline_action_status(
        self,
        action_id,
        status,
        error=None,
    ):
        with self.get_connection() as conn:
            conn.execute(
                """
                UPDATE _timeline_actions
                SET status = ?, error = ?, updated_on = CURRENT_TIMESTAMP
                WHERE action_id = ?
                """,
                (status, error, action_id),
            )
            conn.commit()