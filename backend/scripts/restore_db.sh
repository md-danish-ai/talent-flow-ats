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
# Note: Since the backup was created with --clean and --if-exists, 
# it will drop existing tables before recreating them.
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" < "$BACKUP_FILE"

echo "================================================="
echo "✅ Database restore completed successfully"
echo "================================================="
