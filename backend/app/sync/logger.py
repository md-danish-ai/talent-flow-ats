"""
Sync Logger — Beautiful, structured logging for Third-Party Candidate Sync.

Formats logs identically to backup.log:
  YYYY-MM-DD HH:MM:SS <EMOJI>  [<TAG>] <message>
  ----------------------------------------------------------------------------------------------------------------------------------------------

Includes smart candidate-sync specific stages:
  - 🚀  [START]    Trigger info (Cron 6:00 PM IST or Manual Admin)
  - 🔍  [SCAN]     Database scan of unsynced candidates
  - 📦  [BATCH]    Sync job creation, batch size, target API
  - 🔄  [SYNC]     ArcCRM API chunk transmission outcome
  - 💾  [DATABASE] Updating user_details (is_synced=True) & audit records
  - ✅  [SUCCESS]  Completion summary with timing & stats
  - ℹ️  [INFO]     Neutral status info (e.g. 0 pending candidates)
  - ⚠️  [WARNING]  Partial failures or non-fatal warnings
  - ❌  [ERROR]    API / network / execution failures
"""

import os
import logging
from datetime import datetime
from zoneinfo import ZoneInfo

IST = ZoneInfo("Asia/Kolkata")
SEPARATOR = "-" * 142


def get_sync_log_path() -> str:
    """Returns absolute path to sync.log under backend/backups/sync.log."""
    base_backend_dir = os.path.dirname(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    )
    backups_dir = os.path.join(base_backend_dir, "backups")
    os.makedirs(backups_dir, exist_ok=True)
    return os.path.join(backups_dir, "sync.log")


class SyncLogWriter:
    """
    Writes structured, formatted log lines to sync.log and console.
    Matches the visual style of backup.log.
    """

    def __init__(self):
        self.log_file = get_sync_log_path()
        self.logger = logging.getLogger("app.sync")

    def _write(self, emoji: str, tag: str, message: str, level: int = logging.INFO):
        now_ist = datetime.now(IST).strftime("%Y-%m-%d %H:%M:%S")
        line = f"{now_ist} {emoji}  [{tag}] {message}"

        # Write to sync.log file
        try:
            with open(self.log_file, "a", encoding="utf-8") as f:
                f.write(line + "\n")
        except Exception as e:
            self.logger.error(f"Failed to write to {self.log_file}: {e}")

        # Also log to Python logging system for docker stdout
        self.logger.log(level, f"{emoji} [{tag}] {message}")

    def log_start(self, msg: str):
        self._write("🚀", "START", msg, logging.INFO)

    def log_scan(self, msg: str):
        self._write("🔍", "SCAN", msg, logging.INFO)

    def log_batch(self, msg: str):
        self._write("📦", "BATCH", msg, logging.INFO)

    def log_sync(self, msg: str):
        self._write("🔄", "SYNC", msg, logging.INFO)

    def log_database(self, msg: str):
        self._write("💾", "DATABASE", msg, logging.INFO)

    def log_info(self, msg: str):
        self._write("ℹ️", "INFO", msg, logging.INFO)

    def log_success(self, msg: str):
        self._write("✅", "SUCCESS", msg, logging.INFO)

    def log_warning(self, msg: str):
        self._write("⚠️", "WARNING", msg, logging.WARNING)

    def log_error(self, msg: str):
        self._write("❌", "ERROR", msg, logging.ERROR)

    def log_failed(self, msg: str):
        self._write("❌", "FAILED", msg, logging.ERROR)

    def log_separator(self):
        """Append completion separator line matching backup.log."""
        try:
            with open(self.log_file, "a", encoding="utf-8") as f:
                f.write(SEPARATOR + "\n")
        except Exception:
            pass
        self.logger.info(SEPARATOR)


# Global singleton instance
sync_logger = SyncLogWriter()
