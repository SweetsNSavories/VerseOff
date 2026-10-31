import sqlite3
import os

DB_PATH = "verseoff_cache.db"

def get_db_connection(db_path: str = None):
    """Returns a SQLite connection with Row factory for dict-like access."""
    path = db_path or DB_PATH
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes the local SQLite database for offline caching."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create a table for cached records (fallback for entities without metadata)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS cached_records (
        id TEXT PRIMARY KEY,
        entity_name TEXT NOT NULL,
        data_json TEXT NOT NULL,
        sync_status TEXT DEFAULT 'pending',
        last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
        priority_score INTEGER DEFAULT 0,
        source TEXT DEFAULT 'dataverse'
    )
    ''')
    
    # Create a table for UI Form metadata cache
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS form_metadata_cache (
        form_id TEXT PRIMARY KEY,
        entity_name TEXT NOT NULL,
        form_xml TEXT NOT NULL,
        parsed_ui_hints TEXT
    )
    ''')
    
    # Create a table for Entity metadata cache
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS entity_metadata (
        logical_name TEXT PRIMARY KEY,
        metadata TEXT NOT NULL
    )
    ''')

    # Create a table for Entity Relationships
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS entity_relationships (
        relationship_name TEXT PRIMARY KEY,
        relationship_type TEXT NOT NULL,
        referenced_entity TEXT NOT NULL,
        referencing_entity TEXT NOT NULL,
        referenced_attribute TEXT,
        referencing_attribute TEXT,
        relationship_role TEXT,
        cascade_assign TEXT,
        cascade_delete TEXT,
        cascade_merge TEXT,
        cascade_reparent TEXT,
        cascade_share TEXT,
        cascade_unshare TEXT,
        metadata_json TEXT
    )
    ''')

    # Create a table for Entity Field Mappings
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS entity_field_mappings (
        mapping_id TEXT PRIMARY KEY,
        relationship_name TEXT NOT NULL,
        source_entity TEXT NOT NULL,
        target_entity TEXT NOT NULL,
        source_attribute TEXT NOT NULL,
        target_attribute TEXT NOT NULL,
        mapping_type TEXT DEFAULT 'auto',
        FOREIGN KEY (relationship_name) REFERENCES entity_relationships(relationship_name)
    )
    ''')

    # Create a table for SavedQueries (System Views)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS saved_queries (
        savedqueryid TEXT PRIMARY KEY,
        entity_name TEXT NOT NULL,
        name TEXT NOT NULL,
        query_type INTEGER,
        fetchxml TEXT,
        layoutxml TEXT,
        is_default INTEGER DEFAULT 0,
        is_quickfind INTEGER DEFAULT 0,
        returnedtypecode TEXT,
        description TEXT
    )
    ''')
    
    conn.commit()
    conn.close()

    # Generate per-entity typed tables from cached metadata
    try:
        from schema_builder import create_all_entity_tables
        create_all_entity_tables()
    except Exception as e:
        print(f"Note: Schema generation skipped ({e})")

if __name__ == "__main__":
    init_db()
    print(f"Initialized database at {os.path.abspath(DB_PATH)}")

