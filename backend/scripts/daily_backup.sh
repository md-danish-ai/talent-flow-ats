#!/usr/bin/env bash
# ===============================================================================================================
# daily_backup.sh - Automated PostgreSQL Database Backup
# ===============================================================================================================
# Backup file format: talent_flow_ats_backup_YYYY-MM-DD_HHMMSS.sql
#
# Features:
#   - PostgreSQL dump via pg_dump (local binary or Docker fallback)
#   - Optional upload to AWS S3
#   - Optional upload to Google Drive via rclone (no progress bars in logs)
#   - Configurable local and cloud backup retention (auto-delete old files)
#   - Standardized minimal logging to backup.log
# ===============================================================================================================

set -euo pipefail

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

# Resolve project root from this script's location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Load configurations from the main .env file if present
if [ -f "$PROJECT_ROOT/.env" ]; then
    ENV_FILE="$PROJECT_ROOT/.env"
elif [ -f "/env/.env" ]; then
    ENV_FILE="/env/.env"
elif [ -f "$SCRIPT_DIR/../.env" ]; then
    ENV_FILE="$SCRIPT_DIR/../.env"
else
    ENV_FILE=""
fi

if [ -n "$ENV_FILE" ]; then
    # shellcheck disable=SC1090
    set -a
    source "$ENV_FILE"
    set +a
fi

# ===============================================================================================================
# CONFIGURATION
# Values can be overridden via environment variables or the .env file
# ===============================================================================================================

# Database connection defaults
: "${DB_HOST:=localhost}"
: "${DB_PORT:=5435}"
: "${DB_NAME:=talent_flow_ats}"
: "${DB_USER:=postgres}"
: "${DB_PASSWORD:=Pass2020NothingSpecial}"

# Local backup directory (absolute path)
BACKUP_DIR="$PROJECT_ROOT/backend/backups"

# Output file: named by date and time
DATE_TAG=$(date +%d-%m-%Y-%H-%M)
BACKUP_FILENAME="talent_flow_ats_backup_${DATE_TAG}.sql"
OUTPUT_FILE="$BACKUP_DIR/$BACKUP_FILENAME"

# Log file for all backup activity
LOG_FILE="$BACKUP_DIR/backup.log"

# Number of days to retain local backups (0 = retain indefinitely)
: "${BACKUP_RETENTION_DAYS:=7}"

# Upload flags - set to "true" in .env to enable
: "${UPLOAD_S3:=false}"
: "${UPLOAD_GDRIVE:=false}"

# AWS S3 configuration
: "${S3_BUCKET_NAME:=}"
: "${S3_PREFIX:=talent-flow-ats/db-backups}"

# Google Drive configuration via rclone
: "${GDRIVE_REMOTE_NAME:=gdrive}"
: "${GDRIVE_FOLDER_PATH:=TalentFlow/Backups}"

# ===============================================================================================================
# HELPER FUNCTIONS
# ===============================================================================================================

mkdir -p "$BACKUP_DIR"

# Standard minimal log output
log_info() {
    local msg="$(date '+%Y-%m-%d %H:%M:%S') ℹ️  [INFO] $*"
    echo "$msg"
    echo "$msg" >> "$LOG_FILE"
}

log_success() {
    local msg="$(date '+%Y-%m-%d %H:%M:%S') ✅  [SUCCESS] $*"
    echo "$msg"
    echo "$msg" >> "$LOG_FILE"
}

log_warning() {
    local msg="$(date '+%Y-%m-%d %H:%M:%S') ⚠️  [WARNING] $*"
    echo "$msg"
    echo "$msg" >> "$LOG_FILE"
}

log_cleanup() {
    local msg="$(date '+%Y-%m-%d %H:%M:%S') 🧹  [CLEANUP] $*"
    echo "$msg"
    echo "$msg" >> "$LOG_FILE"
}

log_error() {
    local msg="$(date '+%Y-%m-%d %H:%M:%S') ❌  [ERROR] $*"
    echo "$msg" >&2
    echo "$msg" >> "$LOG_FILE"
}

# Execute a PostgreSQL tool (psql or pg_dump).
# Tries the local binary first; falls back to the Docker container.
run_db_tool() {
    local tool=$1
    shift

    if command -v "$tool" &> /dev/null; then
        export PGPASSWORD="$DB_PASSWORD"
        "$tool" -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" "$@"
    elif command -v docker &> /dev/null; then
        if docker ps --filter "name=talent-flow-postgres" --format "{{.Names}}" | grep -q "talent-flow-postgres"; then
            docker exec -i talent-flow-postgres "$tool" -U "$DB_USER" -d "$DB_NAME" "$@"
        else
            log_error "PostgreSQL tool '$tool' not found locally and container 'talent-flow-postgres' is not running."
            exit 1
        fi
    else
        log_error "PostgreSQL tool '$tool' not found and Docker is not available."
        exit 1
    fi
}

# ===============================================================================================================
# STEP 1: CREATE BACKUP
# ===============================================================================================================

# Skip pg_dump if today's backup already exists (unlikely in date_time format, but kept for safety)
if [ -f "$OUTPUT_FILE" ]; then
    log_info "Backup already exists: $BACKUP_FILENAME. Skipping pg_dump."
else
    # Run ANALYZE to update statistics before checking row counts
    run_db_tool psql -c "ANALYZE;" &> /dev/null || true

    # Fetch row counts silently to calculate metrics
    TABLE_DATA=$(run_db_tool psql -t -c "
        SELECT relname, n_live_tup
        FROM pg_stat_user_tables
        WHERE schemaname = 'public' AND relname != 'alembic_version'
        ORDER BY n_live_tup DESC;" 2>/dev/null || echo "")

    if [ -z "$TABLE_DATA" ]; then
        log_error "Database connection failed or public schema is not initialized."
        exit 1
    fi

    TOTAL_ROWS=0
    TABLE_COUNT=0
    while IFS= read -r line; do
        if [ -n "$line" ]; then
            T_ROWS=$(echo "$line" | cut -d '|' -f2 | xargs)
            TOTAL_ROWS=$((TOTAL_ROWS + T_ROWS))
            TABLE_COUNT=$((TABLE_COUNT + 1))
        fi
    done <<< "$TABLE_DATA"

    if [ "$TOTAL_ROWS" -eq 0 ]; then
        log_info "Skipped backup: All tables in '$DB_NAME' are empty."
        exit 0
    fi

    # Run pg_dump
    if run_db_tool pg_dump \
        -F p \
        --data-only \
        --column-inserts \
        --no-owner \
        --no-privileges \
        -T alembic_version \
        > "$OUTPUT_FILE" 2>/dev/null; then

        BACKUP_SIZE_BYTES=$(wc -c < "$OUTPUT_FILE" | xargs)
        BACKUP_SIZE_KB=$(( BACKUP_SIZE_BYTES / 1024 ))
        log_success "Database backup created: $BACKUP_FILENAME (${BACKUP_SIZE_KB} KB)"
    else
        log_error "pg_dump database export failed."
        exit 1
    fi
fi

# ===============================================================================================================
# STEP 2: UPLOAD TO AWS S3
# ===============================================================================================================

if [ "$UPLOAD_S3" = "true" ]; then
    if [ -z "$S3_BUCKET_NAME" ]; then
        log_warning "S3_BUCKET_NAME is not set in .env. Skipping S3 upload."
    elif ! command -v aws &> /dev/null; then
        log_warning "AWS CLI not found. Skipping S3 upload."
    else
        S3_PATH="s3://${S3_BUCKET_NAME}/${S3_PREFIX}/${BACKUP_FILENAME}"

        if aws s3 cp "$OUTPUT_FILE" "$S3_PATH" \
            --storage-class STANDARD_IA \
            --only-show-errors; then
            log_success "Uploaded to AWS S3"
        else
            log_error "AWS S3 upload failed"
        fi
    fi
fi

# ===============================================================================================================
# STEP 3: UPLOAD TO GOOGLE DRIVE
# ===============================================================================================================

if [ "$UPLOAD_GDRIVE" = "true" ]; then
    if ! command -v rclone &> /dev/null; then
        log_warning "rclone not found. Skipping Google Drive upload."
    else
        GDRIVE_DEST="${GDRIVE_REMOTE_NAME}:${GDRIVE_FOLDER_PATH}"

        # Copy without progress bar to keep cron log files clean
        if rclone copy "$OUTPUT_FILE" "$GDRIVE_DEST" --log-level ERROR; then
            log_success "Uploaded to Google Drive"

            # Clean up old backups on Google Drive
            if [ "$BACKUP_RETENTION_DAYS" -gt 0 ]; then
                # Only log standard errors if cleanup fails, keeping standard run silent
                rclone delete --min-age "${BACKUP_RETENTION_DAYS}d" --include "talent_flow_ats_backup_*.sql" "$GDRIVE_DEST" --log-level ERROR || log_error "Google Drive retention cleanup failed"
            fi
        else
            log_error "Google Drive upload failed"
        fi
    fi
fi

# ===============================================================================================================
# STEP 4: REMOVE OLD LOCAL BACKUPS
# ===============================================================================================================

if [ "$BACKUP_RETENTION_DAYS" -gt 0 ]; then
    PYTHON_BIN="python3"
    if ! command -v python3 &> /dev/null; then
        PYTHON_BIN="python"
    fi

    DELETED_FILES=$("$PYTHON_BIN" -c '
import os, glob, re, sys
from datetime import datetime, timedelta

backup_dir = sys.argv[1]
retention_days = int(sys.argv[2])
cutoff_date = datetime.now() - timedelta(days=retention_days)

deleted = []
for f in glob.glob(os.path.join(backup_dir, "*")):
    filename = os.path.basename(f)
    if filename.endswith(".log"):
        continue
    if " copy" in filename or "(" in filename:
        try:
            os.remove(f)
            deleted.append(filename)
            continue
        except Exception:
            pass
    file_date = None
    match_new = re.search(r"(\d{2}-\d{2}-\d{4})", filename)
    if match_new:
        try:
            file_date = datetime.strptime(match_new.group(1), "%d-%m-%Y")
        except ValueError:
            pass
    else:
        match_old = re.search(r"(\d{4}-\d{2}-\d{2})", filename)
        if match_old:
            try:
                file_date = datetime.strptime(match_old.group(1), "%Y-%m-%d")
            except ValueError:
                pass

    if file_date:
        if file_date.date() <= cutoff_date.date():
            try:
                os.remove(f)
                deleted.append(filename)
            except Exception:
                pass

if deleted:
    print(", ".join(deleted))
else:
    print("")
' "$BACKUP_DIR" "$BACKUP_RETENTION_DAYS" 2>/dev/null || echo "")

    if [ -n "$DELETED_FILES" ]; then
        log_cleanup "Retention cleanup: Removed: $DELETED_FILES"
    else
        log_info "Retention cleanup: No local files older than $BACKUP_RETENTION_DAYS days found."
    fi
fi

# Append separator line to show run completion (writes to cron.log and backup.log)
echo "----------------------------------------------------------------------------------------------------------------------------------------------"
echo "----------------------------------------------------------------------------------------------------------------------------------------------" >> "$LOG_FILE"
