#!/usr/bin/env bash
# =============================================================
# setup_backup_cron.sh - Daily Backup Scheduler Registration
# =============================================================
# macOS       : Registers a LaunchAgent (com.talentflow.dbbackup.plist)
#               (Recommended over cron on macOS due to FDA/TCC permissions)
# Linux       : Registers a crontab entry to run daily_backup.sh
# Windows     : Prints the equivalent Task Scheduler commands
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

# Schedule configurations
# Set TEST_INTERVAL_SECONDS to test at higher frequencies (e.g. 180 for every 3 minutes)
TEST_INTERVAL_SECONDS=${TEST_INTERVAL_SECONDS:-}

CRON_HOUR=${CRON_HOUR:-23}
CRON_MIN=${CRON_MIN:-55}

echo "================================================="
echo "Talent Flow ATS - Daily Backup Scheduler"
echo "  Platform : $OS"
echo "  Script   : $BACKUP_SCRIPT"
if [ -n "$TEST_INTERVAL_SECONDS" ]; then
    echo "  Schedule : Every $TEST_INTERVAL_SECONDS seconds (Interval mode)"
else
    echo "  Schedule : Daily at ${CRON_HOUR}:$(printf '%02d' $CRON_MIN)"
fi
echo "================================================="

# =============================================================
# WINDOWS: Task Scheduler
# =============================================================
if [ "$OS" = "windows" ]; then
    echo ""
    echo "crontab is not available on Windows."
    echo "Run the following commands in an elevated PowerShell terminal:"
    echo ""

    WIN_BASH=$(command -v bash 2>/dev/null || echo "C:\\Program Files\\Git\\bin\\bash.exe")

    if [ -n "$TEST_INTERVAL_SECONDS" ]; then
        # Running at an interval (e.g. every 3 minutes)
        MINUTES=$(( TEST_INTERVAL_SECONDS / 60 ))
        echo "  \$action = New-ScheduledTaskAction \\"
        echo "    -Execute \"$WIN_BASH\" \\"
        echo "    -Argument \"-c '$BACKUP_SCRIPT >> $LOG_FILE 2>&1'\""
        echo ""
        echo "  \$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes $MINUTES) -RepetitionDuration ([TimeSpan]::MaxValue)"
    else
        # Standard daily at Midnight
        echo "  \$action = New-ScheduledTaskAction \\"
        echo "    -Execute \"$WIN_BASH\" \\"
        echo "    -Argument \"-c '$BACKUP_SCRIPT >> $LOG_FILE 2>&1'\""
        echo ""
        echo "  \$trigger = New-ScheduledTaskTrigger -Daily -At \"12:00AM\""
    fi
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
# macOS: LaunchAgent (plist)
# =============================================================
if [ "$OS" = "mac" ]; then
    PLIST_NAME="com.talentflow.dbbackup"
    PLIST_PATH="$HOME/Library/LaunchAgents/${PLIST_NAME}.plist"

    # Make the backup script executable
    chmod +x "$BACKUP_SCRIPT"
    mkdir -p "$(dirname "$LOG_FILE")"

    # Check if LaunchAgent is already loaded
    if [ -f "$PLIST_PATH" ]; then
        echo ""
        echo "An existing LaunchAgent was found at $PLIST_PATH."
        read -rp "Replace and reload it? (y/N): " CONFIRM
        if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
            echo "Skipped. LaunchAgent left unchanged."
            exit 0
        fi
        echo "Unloading existing LaunchAgent..."
        launchctl unload "$PLIST_PATH" 2>/dev/null || true
        rm -f "$PLIST_PATH"
    fi

    echo "Creating LaunchAgent configuration at $PLIST_PATH..."
    
    # Generate LaunchAgent plist file
    if [ -n "$TEST_INTERVAL_SECONDS" ]; then
        # Using StartInterval (repeats every X seconds)
        cat <<EOF > "$PLIST_PATH"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${PLIST_NAME}</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>${BACKUP_SCRIPT}</string>
    </array>
    <key>StartInterval</key>
    <integer>${TEST_INTERVAL_SECONDS}</integer>
    <key>StandardOutPath</key>
    <string>${LOG_FILE}</string>
    <key>StandardErrorPath</key>
    <string>${LOG_FILE}</string>
</dict>
</plist>
EOF
    else
        # Using StartCalendarInterval (specific daily time)
        cat <<EOF > "$PLIST_PATH"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${PLIST_NAME}</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>${BACKUP_SCRIPT}</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>${CRON_HOUR}</integer>
        <key>Minute</key>
        <integer>${CRON_MIN}</integer>
    </dict>
    <key>StandardOutPath</key>
    <string>${LOG_FILE}</string>
    <key>StandardErrorPath</key>
    <string>${LOG_FILE}</string>
</dict>
</plist>
EOF
    fi

    # Set permissions
    chmod 644 "$PLIST_PATH"

    echo "Loading LaunchAgent..."
    launchctl load "$PLIST_PATH"

    echo ""
    echo "LaunchAgent registered and loaded successfully."
    if [ -n "$TEST_INTERVAL_SECONDS" ]; then
        echo "  Schedule : Running every $TEST_INTERVAL_SECONDS seconds"
    else
        echo "  Schedule : Daily at ${CRON_HOUR}:$(printf '%02d' $CRON_MIN) (local time)"
    fi
    echo "  Log File : $LOG_FILE"
    echo ""
    echo "--- Manual execution via launchctl:"
    echo "  launchctl start $PLIST_NAME"
    echo ""
    echo "--- Unregister / Remove:"
    echo "  launchctl unload $PLIST_PATH && rm $PLIST_PATH"
    echo "================================================="
    exit 0
fi

# =============================================================
# LINUX: crontab
# =============================================================
if [ "$OS" = "linux" ]; then
    # Make the backup script executable
    chmod +x "$BACKUP_SCRIPT"

    if [ -n "$TEST_INTERVAL_SECONDS" ]; then
        INTERVAL_MIN=$(( TEST_INTERVAL_SECONDS / 60 ))
        if [ "$INTERVAL_MIN" -lt 1 ]; then INTERVAL_MIN=1; fi
        CRON_EXPRESSION="*/${INTERVAL_MIN} * * * * $BACKUP_SCRIPT >> $LOG_FILE 2>&1"
    else
        CRON_EXPRESSION="${CRON_MIN} ${CRON_HOUR} * * * $BACKUP_SCRIPT >> $LOG_FILE 2>&1"
    fi

    # Check if a cron entry for this script already exists
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
    if [ -n "$TEST_INTERVAL_SECONDS" ]; then
        echo "  Schedule : Running every $((TEST_INTERVAL_SECONDS / 60)) minute(s)"
    else
        echo "  Schedule : Daily at ${CRON_HOUR}:$(printf '%02d' $CRON_MIN) (local time)"
    fi
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
fi
