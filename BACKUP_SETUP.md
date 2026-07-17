# Database Backup and Restore Setup Guide

This guide provides instructions for configuring and scheduling automated database backups to local storage, AWS S3, and Google Drive for the Talent Flow ATS application.

---

## 1. Overview of Scripts

All database utility scripts are located in `backend/scripts/`:

*   [`daily_backup.sh`](file:///Users/mohammeddanish/Project/talent-flow-ats/backend/scripts/daily_backup.sh): The main backup script. Exports database tables, checks retention policies, and uploads backups to S3 and/or Google Drive if configured.
*   [`restore_db.sh`](file:///Users/mohammeddanish/Project/talent-flow-ats/backend/scripts/restore_db.sh): Restores the database from a specified SQL file. Disables foreign-key constraints temporarily to resolve circular dependency warning blocks during insertion.
*   [`setup_backup_cron.sh`](file:///Users/mohammeddanish/Project/talent-flow-ats/backend/scripts/setup_backup_cron.sh): Registers the daily backup schedule on the host operating system.

---

## 2. Configuration Settings

All configurations are read from the main `.env` file in the project root directory. Append or edit the following variables:

```env
# Database Connection Settings
DB_USER=postgres
DB_PASSWORD=Pass2020NothingSpecial
DB_HOST=localhost
DB_PORT=5435
DB_NAME=talent_flow_ats

# Local Retention Policy
# Number of days to keep local backup files before auto-deleting them (0 = disable deletion)
BACKUP_RETENTION_DAYS=7

# AWS S3 Settings
UPLOAD_S3=false
S3_BUCKET_NAME=your-s3-bucket-name-here
S3_PREFIX=talent-flow-ats/db-backups
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID_HERE
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY_HERE
AWS_DEFAULT_REGION=ap-south-1

# Google Drive Settings (requires rclone)
UPLOAD_GDRIVE=false
GDRIVE_REMOTE_NAME=gdrive
GDRIVE_FOLDER_PATH=TalentFlow/Backups
```

---

## 3. AWS S3 Setup Guide

To upload backups to AWS S3, ensure the following requirements are met:

### Step A: Prerequisites
1. Install AWS CLI on your system:
   *   **macOS**: `brew install awscli`
   *   **Windows**: `winget install Amazon.AWSCLI`
   *   **Linux**: `sudo apt-get install awscli`

### Step B: AWS Configuration
1. Open the [AWS Console](https://console.aws.amazon.com/) and navigate to the **S3** dashboard. Create a bucket (e.g., `talent-flow-backups`) if you do not have one.
2. Go to **IAM (Identity and Access Management)**.
3. Create a new user (e.g., `talent-flow-backup-agent`).
4. Attach an inline policy or permission policy granting access to write to your S3 bucket. You can use the standard policy **`AmazonS3FullAccess`** or write a restricted policy for a specific bucket.
5. In the user's details page, navigate to the **Security credentials** tab, and select **Create access key**. Select **Command Line Interface (CLI)** as the use case.
6. Copy the generated `Access Key ID` and `Secret Access Key`.

### Step C: Update Environment
In your `.env` file, configure the following values:
*   Set `UPLOAD_S3=true`
*   Set `S3_BUCKET_NAME` to your bucket name
*   Fill in `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

---

## 4. Google Drive Setup Guide (via Rclone)

Google Drive uploads require `rclone` to be configured on the host machine to handle OAuth authentication.

### Step A: Install Rclone
Install rclone on the host server:
*   **macOS**: `brew install rclone`
*   **Windows**: `winget install Rclone.Rclone`
*   **Linux**: `sudo -v && curl https://rclone.org/install.sh | sudo bash`

### Step B: Configure the Remote Connection (Interactive Choices)
1. Open your terminal and run:
   ```bash
   rclone config
   ```
2. Type **`n`** for "New remote".
3. For the remote name, type: **`gdrive-danish`** (or your custom name).
4. Select the option corresponding to **Google Drive** (type **`drive`** or choose its list index).
5. **`client_id`**: Leave blank (press **Enter** to leave empty).
6. **`client_secret`**: Leave blank (press **Enter** to leave empty).
7. **`scope`**: Type **`1`** (Full access to all files).
8. **`service_account_file`**: Leave blank (press **Enter** to leave empty).
9. **`Edit advanced config?`**: Type **`n`** (No).
10. **`Use web browser to automatically authenticate rclone with remote?`**: Type **`y`** (Yes).
    *   *Note: This will open your web browser automatically. Select your Google account and click **Allow** to authorize rclone. It will output `Got code` in terminal once done.*
11. **`Configure this as a Shared Drive (Team Drive)?`**: Type **`n`** (No).
12. **`Keep this "gdrive-danish" remote?`**: Type **`y`** (Yes, this is OK).
13. Select **`q`** to quit the config utility.

Verify the setup lists your Google Drive root directory:
```bash
rclone lsd gdrive-danish:
```

### Step C: Update Environment
In your `.env` file, configure the following values:
*   Set `UPLOAD_GDRIVE=true`
*   Set `GDRIVE_REMOTE_NAME=gdrive-danish` (must exactly match the remote name you typed in Step 3)
*   Set `GDRIVE_FOLDER_PATH` to your destination folder inside Google Drive (e.g. `TalentFlow/Backups`)

---

## 5. Automated Scheduling (Cron Jobs)

To automate the daily backups, run the scheduler configuration script from the project root directory:

```bash
./backend/scripts/setup_backup_cron.sh
```

### Platform Compatibility:
*   **macOS & Linux**: The script automatically registers a background crontab daemon schedule to trigger `daily_backup.sh` every day at 02:00 AM local time.
*   **Windows**: The script outputs the PowerShell command script block needed to create a task in Windows Task Scheduler. Run the printed commands inside an Administrator PowerShell terminal.

---

## 6. Monitoring Backup Logs

Both daily automated runs and manual runs log their details to `backup.log` and `cron.log`. 

### View via Docker Compose (Recommended)
Stream the logs in real-time using Docker:
```bash
docker compose logs -f backup-logs
```

### View on the Host System
```bash
tail -f backend/backups/backup.log
tail -f backend/backups/cron.log
```

### View inside the Backend Container
```bash
docker exec -it talent-flow-backend tail -f /backend/backups/backup.log
docker exec -it talent-flow-backend tail -f /backend/backups/cron.log
```
