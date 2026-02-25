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

if [ "$TABLE_COUNT" -eq 0 ]; then
    echo "================================================="
    echo "ℹ️  No tables found in the database '$DB_NAME'."
    echo "⏹️  Export skipped as there is no data to backup."
    echo "================================================="
    exit 0
fi

# Run pg_dump
# -O: no owner info
# -x: no privilege info
# --clean: include DROP TABLE statements
# --if-exists: used with --clean
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -F p --clean --if-exists > "$OUTPUT_FILE"

echo "================================================="
echo "✅ Database export completed successfully"
echo "📁 File: $OUTPUT_FILE"
echo "================================================="
