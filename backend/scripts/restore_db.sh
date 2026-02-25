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

BACKUP_DIR="backend/backups"
BACKUP_FILE="$1"

# If no backup file is provided, find the most recent one
if [ -z "$BACKUP_FILE" ]; then
    echo "🔍 No backup file specified. Searching for the most recent backup in '$BACKUP_DIR'..."
    if [ ! -d "$BACKUP_DIR" ]; then
        echo "❌ Error: Backup directory '$BACKUP_DIR' does not exist."
        exit 1
    fi
    
    # Get the latest .sql file by modification time
    LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/*.sql 2>/dev/null | head -n 1)
    
    if [ -z "$LATEST_BACKUP" ]; then
        echo "❌ Error: No SQL backup files found in '$BACKUP_DIR'."
        exit 1
    fi
    BACKUP_FILE="$LATEST_BACKUP"
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file '$BACKUP_FILE' not found."
    exit 1
fi

echo "================================================="
echo "🚀 Starting database restore"
echo "📝 Source: $BACKUP_FILE"
echo "================================================="
echo "DB: $DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
echo "================================================="

# Export password for database tools
export PGPASSWORD="$DB_PASSWORD"

# Restore using psql
echo "🗑️  Truncating all tables in the public schema..."
# Generate and execute truncate statements for all tables
# We skip the alembic_version table to preserve migration state if needed, 
TRUNCATE_CMD=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT 'TRUNCATE TABLE ' || quote_ident(schemaname) || '.' || quote_ident(tablename) || ' CASCADE;' FROM pg_tables WHERE schemaname = 'public' AND tablename != 'alembic_version';")

if [ ! -z "$TRUNCATE_CMD" ]; then
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "$TRUNCATE_CMD" > /dev/null
    echo "✅ Tables truncated."
else
    echo "ℹ️  No tables to truncate."
fi

echo "📥 Inserting data from backup..."
# Restoring in hierarchical order as provided by pg_dump's dependency sorting.
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -q < "$BACKUP_FILE"

echo "================================================="
echo "✅ Database restore completed successfully"
echo "================================================="
