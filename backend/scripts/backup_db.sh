#!/usr/bin/env bash
set -e

# =================================================
# Default local DB config (can be overridden)
# =================================================
: "${DB_HOST:=localhost}"
: "${DB_PORT:=5435}"
: "${DB_NAME:=talent_flow_ats}"
: "${DB_USER:=postgres}"
: "${DB_PASSWORD:=Pass2020NothingSpecial}"

# Directory for backups
BACKUP_DIR="backend/backups"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_FILE="$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

echo "================================================="
echo "🚀 Starting database export"
echo "📝 Target: $OUTPUT_FILE"
echo "================================================="
echo "DB: $DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
echo "================================================="

# Export password for database tools
export PGPASSWORD="$DB_PASSWORD"

# Check if there are any tables in the database
TABLE_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';")
TABLE_COUNT=$(echo "$TABLE_COUNT" | xargs) # trim whitespace

# Check status of tables and count total rows
echo "📊 Checking table data status..."
TABLE_DATA=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "
    SELECT 
        relname as table_name, 
        n_live_tup as row_count 
    FROM pg_stat_user_tables 
    WHERE schemaname = 'public' AND relname != 'alembic_version'
    ORDER BY n_live_tup DESC;")

TOTAL_ROWS=0
while read -r line; do
    if [ ! -z "$line" ]; then
        T_NAME=$(echo "$line" | cut -d '|' -f 1 | xargs)
        T_ROWS=$(echo "$line" | cut -d '|' -f 2 | xargs)
        if [ "$T_ROWS" -eq 0 ]; then
            echo "ℹ️  Table '$T_NAME' is empty."
        else
            echo "✅ Table '$T_NAME' has $T_ROWS rows."
            TOTAL_ROWS=$((TOTAL_ROWS + T_ROWS))
        fi
    fi
done <<< "$TABLE_DATA"

if [ "$TOTAL_ROWS" -eq 0 ]; then
    echo "================================================="
    echo "⏹️  Export skipped: All tables in '$DB_NAME' are empty."
    echo "================================================="
    exit 0
fi

echo "================================================="
echo "📈 Total rows to export: $TOTAL_ROWS"
echo "================================================="

# Run pg_dump
# --data-only: export only data, no schema
# --column-inserts: use INSERT with explicit column names (best for schema variations)
# --no-owner: don't include commands to set ownership
# --no-privileges: don't include commands to set permissions
# -T alembic_version: exclude the migration version table to preserve schema state
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -F p --data-only --column-inserts --no-owner --no-privileges -T alembic_version > "$OUTPUT_FILE"

echo "================================================="
echo "✅ Database export completed successfully"
echo "📁 File: $OUTPUT_FILE"
echo "================================================="
