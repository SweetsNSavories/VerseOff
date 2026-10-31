import sqlite3
conn = sqlite3.connect("verseoff_cache.db")
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [r[0] for r in cursor.fetchall()]
print("Tables:", tables)
for t in tables:
    cursor.execute(f"PRAGMA table_info({t})")
    cols = [(r[1], r[2]) for r in cursor.fetchall()]
    print(f"\n  {t}: {len(cols)} columns")
    for name, typ in cols[:5]:
        print(f"    - {name} ({typ})")
    if len(cols) > 5:
        print(f"    ... and {len(cols)-5} more")
conn.close()
