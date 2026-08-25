#!/usr/bin/env python3
import os
import sys

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app.database.db import engine

SYNC_SQL = """
DO $$
DECLARE
    r RECORD;
    m_id BIGINT;
    seq_name TEXT;
    updated_count INT := 0;
BEGIN
    FOR r IN (
        SELECT 
            table_schema,
            table_name, 
            column_name, 
            column_default
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND (
            column_default LIKE 'nextval(%'
            OR identity_generation IS NOT NULL
          )
        ORDER BY table_name, column_name
    ) LOOP
        seq_name := pg_get_serial_sequence(format('%I.%I', r.table_schema, r.table_name), r.column_name);
        IF seq_name IS NULL AND r.column_default LIKE 'nextval(%' THEN
            seq_name := substring(r.column_default FROM '''([^'']+)''');
        END IF;

        IF seq_name IS NOT NULL THEN
            EXECUTE format('SELECT MAX(%I) FROM %I.%I', r.column_name, r.table_schema, r.table_name) INTO m_id;
            IF m_id IS NOT NULL THEN
                EXECUTE format('SELECT setval(%L, %s, true)', seq_name, m_id);
                RAISE NOTICE '✓ Synced sequence % for %.% (max_id: %)', seq_name, r.table_schema, r.table_name, m_id;
            ELSE
                EXECUTE format('SELECT setval(%L, 1, false)', seq_name);
                RAISE NOTICE '✓ Reset sequence % for empty table %.%', seq_name, r.table_schema, r.table_name;
            END IF;
            updated_count := updated_count + 1;
        END IF;
    END LOOP;
    RAISE NOTICE 'Successfully synchronized % sequence(s).', updated_count;
END $$;
"""


def main():
    print("=" * 60)
    print("🔄 Synchronizing PostgreSQL Sequences...")
    print("=" * 60)
    with engine.connect() as conn:
        conn.execute(text(SYNC_SQL))
        conn.commit()
    print("✅ All PostgreSQL sequences synchronized successfully!")


if __name__ == "__main__":
    main()
