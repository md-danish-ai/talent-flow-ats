#!/usr/bin/env bash
# =============================================================
# setup_backup_cron.sh - Daily Backup Scheduler Registration
# =============================================================
# Mac / Linux : Registers a crontab entry to run daily_backup.sh
# Windows     : Prints the equivalent Task Scheduler commands
#               (crontab is not available on Windows)
#
# Usage (from project root):
#   chmod +x backend/scripts/setup_backup_cron.sh
#   ./backend/scripts/setup_backup_cron.sh
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

# Resolve project root from this script's location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BACKUP_SCRIPT="$PROJECT_ROOT/backend/scripts/daily_backup.sh"
LOG_FILE="$PROJECT_ROOT/backend/backups/cron.log"

# Schedule time: default 00:00 (midnight) daily (override via environment)
CRON_HOUR=${CRON_HOUR:-0}
CRON_MIN=${CRON_MIN:-0}

echo "================================================="
echo "Talent Flow ATS - Daily Backup Scheduler"
echo "  Platform : $OS"
echo "  Script   : $BACKUP_SCRIPT"
echo "  Schedule : Daily at ${CRON_HOUR}:$(printf '%02d' $CRON_MIN)"
echo "================================================="

# =============================================================
# WINDOWS: Task Scheduler
# crontab is not available on Windows. Print the equivalent
# PowerShell commands for manual execution in an elevated terminal.
# =============================================================
if [ "$OS" = "windows" ]; then
    echo ""
    echo "crontab is not available on Windows."
    echo "Run the following commands in an elevated PowerShell terminal:"
    echo ""

    WIN_BASH=$(command -v bash 2>/dev/null || echo "C:\\Program Files\\Git\\bin\\bash.exe")

    echo "  \$action = New-ScheduledTaskAction \\"
    echo "    -Execute \"$WIN_BASH\" \\"
    echo "    -Argument \"-c '$BACKUP_SCRIPT >> $LOG_FILE 2>&1'\""
    echo ""
    echo "  \$trigger = New-ScheduledTaskTrigger -Daily -At \"02:00AM\""
    echo ""
    echo "  Register-ScheduledTask \\"
    echo "    -TaskName \"TalentFlowDailyBackup\" \\"
    echo "    -Action \$action \\"
    echo "    -Trigger \$trigger \\"
    echo "    -RunLevel Highest"
    echo ""
    echo "--- Verify the registered task:"
    echo "  Get-ScheduledTask -TaskName 'TalentFlowDailyBackup'"
    echo ""
    echo "--- Remove the task:"
    echo "  Unregister-ScheduledTask -TaskName 'TalentFlowDailyBackup'"
    echo "================================================="
    exit 0
fi

# =============================================================
# MAC / LINUX: crontab
# =============================================================

chmod +x "$BACKUP_SCRIPT"

CRON_EXPRESSION="${CRON_MIN} ${CRON_HOUR} * * * $BACKUP_SCRIPT >> $LOG_FILE 2>&1"

# Check if a cron entry for this script already exists
# (crontab -l returns 1 when empty, so we wrap it to prevent pipefail exit)
EXISTING_CRON=$(crontab -l 2>/dev/null || true)
if echo "$EXISTING_CRON" | grep -qF "$BACKUP_SCRIPT"; then
    echo ""
    echo "An existing cron entry was found:"
    echo "$EXISTING_CRON" | grep "$BACKUP_SCRIPT"
    echo ""
    read -rp "Replace it? (y/N): " CONFIRM
    if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
        echo "Skipped. Existing cron entry is unchanged."
        exit 0
    fi
    # Remove the existing entry before re-adding
    echo "$EXISTING_CRON" | grep -vF "$BACKUP_SCRIPT" | crontab -
fi

mkdir -p "$(dirname "$LOG_FILE")"
(crontab -l 2>/dev/null || true; echo "# Talent Flow ATS - Daily DB Backup"; echo "$CRON_EXPRESSION") | crontab -

echo ""
echo "Cron job registered successfully."
echo "  Schedule : Daily at ${CRON_HOUR}:$(printf '%02d' $CRON_MIN) (local time)"
echo ""
echo "--- Verify:"
echo "  crontab -l"
echo ""
echo "--- Manual run:"
echo "  ./backend/scripts/daily_backup.sh"
echo ""
echo "--- Remove:"
echo "  crontab -e  (delete the Talent Flow ATS line)"
echo "================================================="
