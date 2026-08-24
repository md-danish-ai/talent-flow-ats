#!/usr/bin/env bash
# ===============================================================================================================
# sync_db_sequences.sh - Standalone script to synchronize PostgreSQL sequences with MAX(id)
# ===============================================================================================================
# 100% Independent: Does NOT require any external SQL files or extra dependencies.
#
# Fixes:
#   (psycopg2.errors.UniqueViolation) duplicate key value violates unique constraint "*_pkey"
#
# Usage:
#   ./backend/scripts/sync_db_sequences.sh
#
# Or with custom credentials (e.g. for production):
#   DB_HOST="localhost" DB_PORT="5432" DB_USER="postgres" DB_PASSWORD="secretpassword" DB_NAME="talent_flow_ats" ./backend/scripts/sync_db_sequences.sh
# ===============================================================================================================

set -e

# Detect OS
OS_TYPE="$(uname -s 2>/dev/null || echo 'Windows')"
case "$OS_TYPE" in
    Darwin*)              OS="mac"     ;;
    Linux*)               OS="linux"   ;;
    MINGW*|MSYS*|CYGWIN*) OS="windows" ;;
    *)                    OS="windows" ;;
esac

# Extend PATH
if [ "$OS" = "mac" ]; then
    export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:$PATH"
elif [ "$OS" = "linux" ]; then
    export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"
fi

# Configuration Defaults
: "${DB_HOST:=localhost}"
: "${DB_PORT:=9600}"
: "${DB_NAME:=talent_flow_ats}"
: "${DB_USER:=postgres}"
: "${DB_PASSWORD:=Pass2020NothingSpecial}"
: "${DB_CONTAINER:=talent-flow-postgres}"

SQL_QUERY=$(cat << 'EOF'
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
        -- Retrieve sequence name
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
    RAISE NOTICE '=======================================================';
    RAISE NOTICE 'Successfully synchronized % sequence(s).', updated_count;
    RAISE NOTICE '=======================================================';
END $$;
EOF
)

echo "==================================================================================================="
echo "🔄 Synchronizing PostgreSQL Database Sequences"
echo "  Database  : $DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
echo "  Container : $DB_CONTAINER"
echo "  Platform  : $OS"
echo "==================================================================================================="

if command -v psql &> /dev/null && PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" &> /dev/null; then
    echo "⚡ Running via local psql client..."
    export PGPASSWORD="$DB_PASSWORD"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "$SQL_QUERY"
elif command -v docker &> /dev/null; then
    if docker ps --filter "name=$DB_CONTAINER" --format "{{.Names}}" | grep -q "$DB_CONTAINER"; then
        echo "🐳 Running via Docker container '$DB_CONTAINER'..."
        docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -c "$SQL_QUERY"
    else
        echo "❌ ERROR: Local psql failed to connect and Docker container '$DB_CONTAINER' is not running."
        echo "   Please start the database or check your connection settings."
        exit 1
    fi
else
    echo "❌ ERROR: Neither local 'psql' nor 'docker' is accessible."
    exit 1
fi

echo "==================================================================================================="
echo "✅ All database sequences have been synchronized successfully!"
echo "==================================================================================================="
