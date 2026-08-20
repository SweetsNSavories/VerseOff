"""
schema_builder.py
Reads entity attribute metadata from the local SQLite cache (or a JSON manifest)
and dynamically creates per-entity SQLite tables with properly typed columns
that mirror the Dataverse schema.

Usage:
    from schema_builder import create_entity_table, create_all_entity_tables

    # From a manifest dict:
    create_entity_table(entity_def)

    # From the entity_metadata SQLite table:
    create_all_entity_tables()
"""
import json
import logging
import sqlite3
import os

logger = logging.getLogger(__name__)

DB_PATH = "verseoff_cache.db"

# ---------------------------------------------------------------------------
# Dataverse AttributeType → SQLite column type mapping
# ---------------------------------------------------------------------------

DATAVERSE_TO_SQLITE = {
    # Text types → TEXT
    "String": "TEXT",
    "Memo": "TEXT",
    "UniqueIdentifier": "TEXT",
    "Virtual": "TEXT",
    "EntityName": "TEXT",

    # Integer types → INTEGER
    "Integer": "INTEGER",
    "BigInt": "INTEGER",
    "Picklist": "INTEGER",
    "State": "INTEGER",
    "Status": "INTEGER",
    "Boolean": "INTEGER",

    # Decimal types → REAL
    "Decimal": "REAL",
    "Double": "REAL",
    "Money": "REAL",

    # DateTime → TEXT (ISO 8601 strings)
    "DateTime": "TEXT",

    # Lookup types → TEXT (stores GUID)
    "Lookup": "TEXT",
    "Customer": "TEXT",
    "Owner": "TEXT",
    "PartyList": "TEXT",

    # Image / File → BLOB (rarely used offline)
    "Image": "BLOB",
    "File": "BLOB",

    # ManagedProperty → TEXT
    "ManagedProperty": "TEXT",
}

# Internal VerseOff columns appended to every entity table
VERSEOFF_INTERNAL_COLUMNS = [
    ("sync_status", "TEXT DEFAULT 'SYNCED'"),
    ("etag", "TEXT"),
    ("last_modified", "DATETIME DEFAULT CURRENT_TIMESTAMP"),
]


def _sanitize_column_name(name: str) -> str:
    """Ensures column name is safe for SQLite (no special chars)."""
    return "".join(c if c.isalnum() or c == "_" else "_" for c in name.lower())


def _sanitize_table_name(name: str) -> str:
    """Ensures table name is safe for SQLite."""
    return "".join(c if c.isalnum() or c == "_" else "_" for c in name.lower())


def _get_sqlite_type(attribute_type: str) -> str:
    """Maps a Dataverse AttributeType string to a SQLite column type."""
    return DATAVERSE_TO_SQLITE.get(attribute_type, "TEXT")


def build_create_table_sql(entity_def: dict) -> str:
    """
    Generates a CREATE TABLE IF NOT EXISTS SQL statement from an entity definition.

    Args:
        entity_def: Dict containing at minimum:
            - LogicalName: str
            - PrimaryIdAttribute: str
            - attributes: list[dict] with LogicalName and AttributeType

    Returns:
        SQL CREATE TABLE statement string
    """
    logical_name = entity_def.get("LogicalName", "unknown_entity")
    table_name = _sanitize_table_name(logical_name)
    primary_id = entity_def.get("PrimaryIdAttribute", f"{logical_name}id")
    attributes = entity_def.get("attributes", [])

    if not attributes:
        logger.warning(f"No attributes found for entity '{logical_name}'. Skipping.")
        return ""

    columns = []
    seen_columns = set()

    # Primary key column first
    pk_col = _sanitize_column_name(primary_id)
    columns.append(f"    {pk_col} TEXT PRIMARY KEY")
    seen_columns.add(pk_col)

    # Entity attribute columns
    for attr in attributes:
        col_name = _sanitize_column_name(attr.get("LogicalName", ""))
        if not col_name or col_name in seen_columns:
            continue

        attr_type = attr.get("AttributeType", "String")
        # AttributeTypeName is sometimes a dict with Value key
        if isinstance(attr_type, dict):
            attr_type = attr_type.get("Value", "String")

        sqlite_type = _get_sqlite_type(attr_type)
        columns.append(f"    {col_name} {sqlite_type}")
        seen_columns.add(col_name)

    # Append VerseOff internal tracking columns
    for col_name, col_def in VERSEOFF_INTERNAL_COLUMNS:
        if col_name not in seen_columns:
            columns.append(f"    {col_name} {col_def}")
            seen_columns.add(col_name)

    columns_sql = ",\n".join(columns)
    return f"CREATE TABLE IF NOT EXISTS {table_name} (\n{columns_sql}\n);"


def create_entity_table(entity_def: dict, db_path: str = None):
    """
    Creates a single entity table in the SQLite database.

    Args:
        entity_def: Entity definition dict with attributes
        db_path: Optional path to SQLite DB (defaults to DB_PATH)
    """
    path = db_path or DB_PATH
    sql = build_create_table_sql(entity_def)
    if not sql:
        return

    logical_name = entity_def.get("LogicalName", "unknown")
    try:
        conn = sqlite3.connect(path)
        cursor = conn.cursor()
        cursor.execute(sql)

        # Schema evolution: check for new columns not yet in the table
        cursor.execute(f"PRAGMA table_info({_sanitize_table_name(logical_name)})")
        existing_cols = {row[1] for row in cursor.fetchall()}

        for attr in entity_def.get("attributes", []):
            col_name = _sanitize_column_name(attr.get("LogicalName", ""))
            if col_name and col_name not in existing_cols:
                attr_type = attr.get("AttributeType", "String")
                if isinstance(attr_type, dict):
                    attr_type = attr_type.get("Value", "String")
                sqlite_type = _get_sqlite_type(attr_type)
                try:
                    cursor.execute(f"ALTER TABLE {_sanitize_table_name(logical_name)} ADD COLUMN {col_name} {sqlite_type}")
                    logger.info(f"Schema evolution: added column '{col_name}' to '{logical_name}'")
                except sqlite3.OperationalError:
                    pass  # Column already exists (race condition guard)

        conn.commit()
        conn.close()
        logger.info(f"Created/verified table for entity '{logical_name}' with {len(entity_def.get('attributes', []))} columns")
    except Exception as e:
        logger.error(f"Failed to create table for '{logical_name}': {e}")


def create_all_entity_tables(db_path: str = None):
    """
    Reads all entity metadata from the entity_metadata SQLite table
    and creates per-entity tables for each one.

    This is called during app initialization after metadata has been synced.
    """
    path = db_path or DB_PATH

    if not os.path.exists(path):
        logger.warning(f"Database not found at {path}. Run init_db() first.")
        return

    try:
        conn = sqlite3.connect(path)
        cursor = conn.cursor()

        # Check if entity_metadata table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='entity_metadata'")
        if not cursor.fetchone():
            logger.warning("entity_metadata table not found. Skipping schema generation.")
            conn.close()
            return

        cursor.execute("SELECT logical_name, metadata FROM entity_metadata")
        rows = cursor.fetchall()
        conn.close()

        if not rows:
            logger.info("No entity metadata found in cache. Skipping schema generation.")
            return

        created_count = 0
        for logical_name, metadata_json in rows:
            try:
                entity_def = json.loads(metadata_json)
                # Ensure LogicalName is set
                if "LogicalName" not in entity_def:
                    entity_def["LogicalName"] = logical_name
                create_entity_table(entity_def, db_path=path)
                created_count += 1
            except json.JSONDecodeError as e:
                logger.warning(f"Invalid JSON for entity '{logical_name}': {e}")

        logger.info(f"Schema generation complete: {created_count} entity tables created/verified.")

    except Exception as e:
        logger.error(f"Failed to generate entity schemas: {e}")


def create_entity_table_from_manifest(manifest_data: dict, db_path: str = None):
    """
    Creates entity tables from a full manifest dict.
    The manifest should contain an 'entities' key with a list of entity definitions.
    """
    path = db_path or DB_PATH
    entities = manifest_data.get("entities", [])

    if not entities:
        logger.warning("No entities found in manifest.")
        return

    for entity_def in entities:
        create_entity_table(entity_def, db_path=path)

    logger.info(f"Created {len(entities)} entity tables from manifest.")


# ---------------------------------------------------------------------------
# CLI entry point for testing
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import sys

    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

    if len(sys.argv) > 1 and sys.argv[1] == "--from-db":
        print(f"Generating entity tables from {DB_PATH}...")
        create_all_entity_tables()
    elif len(sys.argv) > 1:
        # Load from manifest JSON file
        manifest_path = sys.argv[1]
        with open(manifest_path, "r") as f:
            manifest = json.load(f)
        create_entity_table_from_manifest(manifest)
    else:
        # Demo: generate SQL for a sample entity
        sample_entity = {
            "LogicalName": "account",
            "PrimaryIdAttribute": "accountid",
            "attributes": [
                {"LogicalName": "name", "AttributeType": "String"},
                {"LogicalName": "revenue", "AttributeType": "Money"},
                {"LogicalName": "statecode", "AttributeType": "State"},
                {"LogicalName": "statuscode", "AttributeType": "Status"},
                {"LogicalName": "createdon", "AttributeType": "DateTime"},
                {"LogicalName": "modifiedon", "AttributeType": "DateTime"},
                {"LogicalName": "primarycontactid", "AttributeType": "Lookup"},
                {"LogicalName": "numberofemployees", "AttributeType": "Integer"},
                {"LogicalName": "donotphone", "AttributeType": "Boolean"},
                {"LogicalName": "description", "AttributeType": "Memo"},
            ],
        }
        print(build_create_table_sql(sample_entity))
