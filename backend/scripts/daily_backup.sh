#!/usr/bin/env bash
# =============================================================
# daily_backup.sh - Automated PostgreSQL Database Backup
# =============================================================
# Backup file format: talent_flow_ats_backup_YYYY-MM-DD.sql
#
# Features:
#   - PostgreSQL dump via pg_dump (local binary or Docker fallback)
#   - Optional upload to AWS S3
#   - Optional upload to Google Drive via rclone
#   - Configurable local backup retention (auto-delete old files)
#   - Timestamped logging to backup.log
#
# Setup:
#   1. Copy .env.backup.example to .env.backup and fill credentials
#   2. chmod +x backend/scripts/daily_backup.sh
#   3. Run setup_backup_cron.sh to register the daily schedule
#
# Manual run (from project root):
#   ./backend/scripts/daily_backup.sh
# =============================================================

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
ENV_FILE="$PROJECT_ROOT/.env"
if [ -f "$ENV_FILE" ]; then
    # shellcheck disable=SC1090
    set -a
    source "$ENV_FILE"
    set +a
fi

# =============================================================
# CONFIGURATION
# Values can be overridden via environment variables or the .env file
# =============================================================

# Database connection defaults
: "${DB_HOST:=localhost}"
: "${DB_PORT:=5435}"
: "${DB_NAME:=talent_flow_ats}"
: "${DB_USER:=postgres}"
: "${DB_PASSWORD:=Pass2020NothingSpecial}"

# Local backup directory (absolute path)
BACKUP_DIR="$PROJECT_ROOT/backend/backups"

# Output file: one backup per day, named by date
DATE_TAG=$(date +%Y-%m-%d)
BACKUP_FILENAME="talent_flow_ats_backup_${DATE_TAG}.sql"
OUTPUT_FILE="$BACKUP_DIR/$BACKUP_FILENAME"

# Log file for all backup activity
LOG_FILE="$BACKUP_DIR/backup.log"

# Number of days to retain local backups (0 = retain indefinitely)
: "${BACKUP_RETENTION_DAYS:=7}"

# Upload flags - set to "true" in .env.backup to enable
: "${UPLOAD_S3:=false}"
: "${UPLOAD_GDRIVE:=false}"

# AWS S3 configuration
# Required in .env.backup: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION
: "${S3_BUCKET_NAME:=}"
: "${S3_PREFIX:=talent-flow-ats/db-backups}"

# Google Drive configuration via rclone
# Required in .env.backup: GDRIVE_REMOTE_NAME (rclone remote name)
: "${GDRIVE_REMOTE_NAME:=gdrive}"
: "${GDRIVE_FOLDER_PATH:=TalentFlow/Backups}"

# =============================================================
# HELPER FUNCTIONS
# =============================================================

mkdir -p "$BACKUP_DIR"

# Write a timestamped message to stdout and the log file
log() {
    local msg="[$(date '+%Y-%m-%d %H:%M:%S')] $*"
    echo "$msg"
    echo "$msg" >> "$LOG_FILE"
}

log_section() {
    log "================================================="
    log "$*"
    log "================================================="
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
            log "ERROR: '$tool' not found locally and container 'talent-flow-postgres' is not running."
            exit 1
        fi
    else
        log "ERROR: '$tool' not found and Docker is not available."
        exit 1
    fi
}

# =============================================================
# STEP 1: CREATE BACKUP
# =============================================================

log_section "Daily DB Backup - $(date '+%A, %d %B %Y')"
log "Backup directory : $BACKUP_DIR"
log "Output file      : $BACKUP_FILENAME"
log "Database         : $DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"

# Skip pg_dump if today's backup already exists; still attempt uploads if enabled
if [ -f "$OUTPUT_FILE" ]; then
    log "Backup for $DATE_TAG already exists ($BACKUP_FILENAME). Skipping pg_dump."
else
    log "Checking table row counts..."
    TABLE_DATA=$(run_db_tool psql -t -c "
        SELECT relname, n_live_tup
        FROM pg_stat_user_tables
        WHERE schemaname = 'public' AND relname != 'alembic_version'
        ORDER BY n_live_tup DESC;")

    TOTAL_ROWS=0
    while IFS= read -r line; do
        if [ -n "$line" ]; then
            T_NAME=$(echo "$line" | cut -d '|' -f1 | xargs)
            T_ROWS=$(echo "$line" | cut -d '|' -f2 | xargs)
            if [ "$T_ROWS" -gt 0 ]; then
                log "  $T_NAME: $T_ROWS rows"
                TOTAL_ROWS=$((TOTAL_ROWS + T_ROWS))
            else
                log "  $T_NAME: empty"
            fi
        fi
    done <<< "$TABLE_DATA"

    if [ "$TOTAL_ROWS" -eq 0 ]; then
        log "All tables are empty. Skipping backup."
        exit 0
    fi

    log "Total rows to export: $TOTAL_ROWS"
    log "Running pg_dump..."

    run_db_tool pg_dump \
        -F p \
        --data-only \
        --column-inserts \
        --no-owner \
        --no-privileges \
        -T alembic_version \
        > "$OUTPUT_FILE"

    # wc -c is portable across Mac, Linux, and Windows Git Bash
    BACKUP_SIZE_BYTES=$(wc -c < "$OUTPUT_FILE" | xargs)
    BACKUP_SIZE_KB=$(( BACKUP_SIZE_BYTES / 1024 ))
    log "Backup created: $BACKUP_FILENAME (${BACKUP_SIZE_KB} KB)"
fi

# =============================================================
# STEP 2: UPLOAD TO AWS S3
# =============================================================

if [ "$UPLOAD_S3" = "true" ]; then
    log_section "Uploading to AWS S3"

    if [ -z "$S3_BUCKET_NAME" ]; then
        log "ERROR: S3_BUCKET_NAME is not set in .env.backup. Skipping S3 upload."
    elif ! command -v aws &> /dev/null; then
        log "ERROR: AWS CLI not found. Install with: pip install awscli"
        log "       Then configure credentials: aws configure"
    else
        S3_PATH="s3://${S3_BUCKET_NAME}/${S3_PREFIX}/${BACKUP_FILENAME}"
        log "Uploading to: $S3_PATH"

        if aws s3 cp "$OUTPUT_FILE" "$S3_PATH" \
            --storage-class STANDARD_IA \
            --only-show-errors; then
            log "S3 upload successful: $S3_PATH"
        else
            log "ERROR: S3 upload failed. Verify AWS credentials and bucket permissions."
        fi
    fi
fi

# =============================================================
# STEP 3: UPLOAD TO GOOGLE DRIVE
# =============================================================

if [ "$UPLOAD_GDRIVE" = "true" ]; then
    log_section "Uploading to Google Drive"

    if ! command -v rclone &> /dev/null; then
        log "ERROR: rclone not found."
        log "  Mac / Linux : brew install rclone  or  https://rclone.org/downloads/"
        log "  Windows     : winget install Rclone.Rclone  or  https://rclone.org/downloads/"
        log "  Configure   : rclone config  (select Google Drive)"
        log "  Then set GDRIVE_REMOTE_NAME in .env.backup"
    else
        GDRIVE_DEST="${GDRIVE_REMOTE_NAME}:${GDRIVE_FOLDER_PATH}"
        log "Uploading to: $GDRIVE_DEST/$BACKUP_FILENAME"

        if rclone copy "$OUTPUT_FILE" "$GDRIVE_DEST" \
            --progress \
            --log-level ERROR; then
            log "Google Drive upload successful."
        else
            log "ERROR: Google Drive upload failed. Run 'rclone config' to verify the remote."
        fi
    fi
fi

# =============================================================
# STEP 4: REMOVE OLD LOCAL BACKUPS
# =============================================================

if [ "$BACKUP_RETENTION_DAYS" -gt 0 ]; then
    log_section "Removing backups older than $BACKUP_RETENTION_DAYS days"
    DELETED_COUNT=0

    while IFS= read -r old_file; do
        log "  Deleting: $(basename "$old_file")"
        rm -f "$old_file"
        DELETED_COUNT=$((DELETED_COUNT + 1))
    done < <(find "$BACKUP_DIR" -name "talent_flow_ats_backup_*.sql" -mtime +"$BACKUP_RETENTION_DAYS" 2>/dev/null)

    if [ "$DELETED_COUNT" -eq 0 ]; then
        log "No old backups to remove."
    else
        log "Removed $DELETED_COUNT old backup file(s)."
    fi
fi

# =============================================================
log_section "Backup complete: $BACKUP_FILENAME"
