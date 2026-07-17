#!/usr/bin/env bash
# ===============================================================================================================
# restore_db.sh - PostgreSQL Database Restore
# ===============================================================================================================
# Compatible with: Mac, Linux, Windows (Git Bash / WSL)
#
# Resolves circular foreign-key constraint errors by temporarily
# disabling FK trigger checks via session_replication_role.
# Requires superuser privileges (default postgres user qualifies).
#
# Usage (from project root):
#   ./backend/scripts/restore_db.sh                     # restore most recent backup
#   ./backend/scripts/restore_db.sh path/to/file.sql    # restore specific file
# ===============================================================================================================

set -e

# Detect the current operating system
OS_TYPE="$(uname -s 2>/dev/null || echo 'Windows')"
case "$OS_TYPE" in
    Darwin*)              OS="mac"     ;;
    Linux*)               OS="linux"   ;;
    MINGW*|MSYS*|CYGWIN*) OS="windows" ;;
    *)                    OS="windows" ;;
esac

# Extend PATH with platform-specific binary locations
if [ "$OS" = "mac" ]; then
    export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:$PATH"
elif [ "$OS" = "linux" ]; then
    export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"
fi
# Windows (Git Bash / WSL): PATH is already configured by the shell

# ===============================================================================================================
# CONFIGURATION
# ===============================================================================================================
: "${DB_HOST:=localhost}"
: "${DB_PORT:=5435}"
: "${DB_NAME:=talent_flow_ats}"
: "${DB_USER:=postgres}"
: "${DB_PASSWORD:=Pass2020NothingSpecial}"

# Resolve project root from this script's location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BACKUP_DIR="$PROJECT_ROOT/backend/backups"

BACKUP_FILE="${1:-}"

# ===============================================================================================================
# LOCATE BACKUP FILE
# ===============================================================================================================
if [ -z "$BACKUP_FILE" ]; then
    echo "No backup file specified. Searching for the most recent backup..."

    if [ ! -d "$BACKUP_DIR" ]; then
        echo "ERROR: Backup directory '$BACKUP_DIR' does not exist."
        exit 1
    fi

    # Sort by filename (YYYY-MM-DD in name ensures lexicographic = chronological order).
    # Avoids ls -t which behaves inconsistently across platforms.
    LATEST_BACKUP=$(find "$BACKUP_DIR" -maxdepth 1 -name "talent_flow_ats_backup_*.sql" \
        2>/dev/null \
        | sort -r \
        | head -n 1)

    if [ -z "$LATEST_BACKUP" ]; then
        echo "ERROR: No backup files found in '$BACKUP_DIR'."
        exit 1
    fi

    BACKUP_FILE="$LATEST_BACKUP"
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "ERROR: Backup file '$BACKUP_FILE' not found."
    exit 1
fi

# ===============================================================================================================
# HELPER: run_psql
# Executes psql using the local binary if available,
# otherwise falls back to the running Docker container.
# ===============================================================================================================
run_psql() {
    if command -v psql &> /dev/null; then
        export PGPASSWORD="$DB_PASSWORD"
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" "$@"
    elif command -v docker &> /dev/null; then
        if docker ps --filter "name=talent-flow-postgres" --format "{{.Names}}" | grep -q "talent-flow-postgres"; then
            docker exec -i talent-flow-postgres psql -U "$DB_USER" -d "$DB_NAME" "$@"
        else
            echo "ERROR: Container 'talent-flow-postgres' is not running."
            echo "       Start it with: docker compose up -d db"
            exit 1
        fi
    else
        echo "ERROR: psql not found and Docker is not available."
        echo "       Install PostgreSQL client tools or start Docker."
        exit 1
    fi
}

echo "==================================================================================================="
echo "Database Restore"
echo "  Source   : $(basename "$BACKUP_FILE")"
echo "  Database : $DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
echo "  Platform : $OS"
echo "==================================================================================================="

# ===============================================================================================================
# STEP 1: TRUNCATE ALL TABLES
# Uses CASCADE to handle foreign-key dependencies in any order.
# The alembic_version table is excluded to preserve migration state.
# ===============================================================================================================
echo "Truncating all public tables..."

TRUNCATE_CMD=$(run_psql -t -c "
    SELECT 'TRUNCATE TABLE ' || quote_ident(schemaname) || '.' || quote_ident(tablename) || ' CASCADE;'
    FROM pg_tables
    WHERE schemaname = 'public' AND tablename != 'alembic_version';")

if [ -n "$(echo "$TRUNCATE_CMD" | xargs)" ]; then
    run_psql -c "$TRUNCATE_CMD" > /dev/null
    echo "Tables truncated."
else
    echo "No tables found to truncate."
fi

# ===============================================================================================================
# STEP 2: RESTORE DATA
#
# SET session_replication_role = replica disables FK trigger
# checks for the duration of this session, which avoids INSERT
# order conflicts caused by circular foreign-key references
# (e.g. self-referencing columns on the users table).
#
# The setting is automatically reset when the transaction ends.
# Requires: PostgreSQL 9.5+, superuser privileges.
# ===============================================================================================================
echo "Inserting data from backup..."

if command -v psql &> /dev/null; then
    export PGPASSWORD="$DB_PASSWORD"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
        --single-transaction \
        -v ON_ERROR_STOP=1 \
        -c "SET session_replication_role = replica;" \
        -f "$BACKUP_FILE" \
        -c "SET session_replication_role = DEFAULT;"

elif command -v docker &> /dev/null; then
    if docker ps --filter "name=talent-flow-postgres" --format "{{.Names}}" | grep -q "talent-flow-postgres"; then
        docker exec -i talent-flow-postgres psql \
            -U "$DB_USER" -d "$DB_NAME" \
            --single-transaction \
            -v ON_ERROR_STOP=1 \
            -c "SET session_replication_role = replica;" \
            -f - \
            -c "SET session_replication_role = DEFAULT;" \
            < "$BACKUP_FILE"
    else
        echo "ERROR: Container 'talent-flow-postgres' is not running."
        exit 1
    fi
fi

echo "==================================================================================================="
echo "Restore completed successfully."
echo "==================================================================================================="
