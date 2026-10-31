import pytest
from VerseOff.schema_builder import build_create_table_sql

def test_build_create_table_sql():
    entity_def = {
        "LogicalName": "account",
        "PrimaryIdAttribute": "accountid",
        "attributes": [
            {"LogicalName": "accountid", "AttributeType": "Uniqueidentifier"},
            {"LogicalName": "name", "AttributeType": "String"},
            {"LogicalName": "revenue", "AttributeType": "Money"}
        ]
    }
    
    sql = build_create_table_sql(entity_def)
    
    assert "CREATE TABLE IF NOT EXISTS account" in sql
    assert "accountid TEXT PRIMARY KEY" in sql
    assert "name TEXT" in sql
    assert "revenue REAL" in sql
    
    # Internal VerseOff columns
    assert "sync_status TEXT DEFAULT 'SYNCED'" in sql
    assert "etag TEXT" in sql
    assert "last_modified DATETIME" in sql
