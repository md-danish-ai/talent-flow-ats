# Talent Flow ATS

Talent Flow ATS is a modern application designed to streamline the recruitment process. It features a robust backend built with FastAPI and a dynamic frontend built with Next.js.

## Prerequisites

Before getting started, ensure you have the following installed on your system:

- **Node.js**: v18 or higher (using v24.13.0 recommended)
- **Python**: v3.9 or higher
- **npm**: (comes with Node.js)
- **Docker & Docker Compose**: (for containerized execution)

## Getting Started

### 1. clone the repository

```bash
git clone <repository-url>
cd talent-flow-ats
```

### 2. Backend Setup

The backend is built with FastAPI and runs on port **4000**.

1.  Navigate to the backend directory:

    ```bash
    cd backend
    ```

2.  Create and activate a virtual environment (optional but recommended):

    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3.  Install the required dependencies:

    ```bash
    pip install -r ../requirements.txt
    ```

4.  Start the backend server:

    ```bash
    python -m app.main
    ```

    Alternatively, using `uvicorn` directly:

    ```bash
    uvicorn app.main:app --reload --port 4000
    ```

    The backend will be available at [http://localhost:4000](http://localhost:4000).
    - API Documentation (Swagger UI): [http://localhost:4000/docs](http://localhost:4000/docs)
    - ReDoc: [http://localhost:4000/redoc](http://localhost:4000/redoc)

### 3. Frontend Setup

The frontend is built with Next.js and React.

1.  Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2.  Install the dependencies:

    ```bash
    npm install
    ```

3.  Start the development server:

    ```bash
    npm run dev
    ```

    The frontend will be available at [http://localhost:3000](http://localhost:3000).

### 4. Docker Setup (Recommended)

You can run the full application (backend + frontend) using Docker Compose for a consistent environment.

#### Environment Variables

Before starting, configure the following variables (you can set them in a `.env` file at the project root):

```env
# -------------------------------------------------------------
# Frontend Build Args (baked into Next.js build)
# -------------------------------------------------------------
# Public URL the browser uses to reach the backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# App environment ('prod' or 'dev')
NEXT_PUBLIC_APP_ENV=prod

# Toggle AI question generator feature ('true' or 'false')
NEXT_PUBLIC_ENABLE_AI_QUESTION_GENERATOR=false

# -------------------------------------------------------------
# AI / External Services
# -------------------------------------------------------------
# Hugging Face token (required for AI features)
HF_TOKEN=your_hugging_face_token_here

# -------------------------------------------------------------
# Database Backup & Upload Settings
# -------------------------------------------------------------
# Local retention policy (number of days to keep backups; 0 = keep forever)
BACKUP_RETENTION_DAYS=7

# AWS S3 Settings
UPLOAD_S3=false
S3_BUCKET_NAME=your-s3-bucket-name-here
S3_PREFIX=talent-flow-ats/db-backups
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID_HERE
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY_HERE
AWS_DEFAULT_REGION=ap-south-1

# Google Drive Settings (requires rclone setup)
UPLOAD_GDRIVE=false
GDRIVE_REMOTE_NAME=gdrive-danish
GDRIVE_FOLDER_PATH=TalentFlow/Backups
```

> [!IMPORTANT]
> `NEXT_PUBLIC_API_BASE_URL` is baked into the frontend **at build time**. If you change this value you must rebuild the frontend image (`docker compose build frontend`).

#### Commands

1.  Start all services (backend + frontend + db + redis):
    ```bash
    docker compose up -d --build
    ```
2.  Start only specific services:
    ```bash
    # Backend only
    docker compose up -d --build backend

    # Frontend only (requires backend to be running)
    docker compose up -d --build frontend
    ```
3.  Check running containers:
    ```bash
    docker compose ps
    ```
4.  Run database migrations:
    ```bash
    docker compose --profile migrate run --rm migrations
    ```
5.  View logs:
    ```bash
    # Backend logs
    docker compose logs -f backend

    # Frontend logs
    docker compose logs -f frontend

    # All services
    docker compose logs -f
    ```
6.  Rebuild frontend after code changes:
    ```bash
    docker compose build frontend
    docker compose up -d frontend
    ```
7.  Stop services:
    ```bash
    docker compose down
    ```

#### Service URLs (Docker)

| Service | URL |
|---|---|
| Frontend (Next.js) | [http://localhost:3000](http://localhost:3000) |
| Backend (FastAPI) | [http://localhost:4000](http://localhost:4000) |
| API Docs (Swagger) | [http://localhost:4000/docs](http://localhost:4000/docs) |
| RedisInsight GUI | [http://localhost:8001](http://localhost:8001) |

## Database Migrations

If you have modified existing models or created new ones in the application, you need to generate a database migration to keep the schema in sync.

### 1. Generating Migrations Locally

First, ensure your virtual environment is activated in the `backend/` directory.

1.  Grant executable permission to the generation script (one-time setup):

    ```bash
    chmod +x backend/scripts/gen_migrations.sh
    ```

2.  Generate the migration:
    ```bash
    cd backend && ./scripts/gen_migrations.sh "migration_name_here"
    ```
    _Replace `migration_name_here` with a descriptive name for your change._

### 2. Syncing with Docker

After generating the migration, you must update the Docker environment:

1.  Build the backend image again to include the new migration file:

    ```bash
    docker compose build
    docker compose up -d
    ```

2.  Run the migration script on Docker:

    ```bash
    # Run all pending migrations (upgrade to head)
    docker compose --profile migrate run --rm migrations

    # Check current migration status
    docker compose --profile migrate run --rm migrations current

    # View migration history
    docker compose --profile migrate run --rm migrations history

    # Upgrade to a specific revision
    docker compose --profile migrate run --rm migrations upgrade <revision_id>

    # Downgrade by one version
    docker compose --profile migrate run --rm migrations downgrade -1

    # Downgrade to a specific revision
    docker compose --profile migrate run --rm migrations downgrade <revision_id>

    # Downgrade to the base (empty) schema
    docker compose --profile migrate run --rm migrations downgrade base
    ```

### 3. When to use `docker compose down -v`

#### ✅ Use it when

- First-time project setup
- Migration history is broken (schema ≠ `alembic_version`)
- Major schema refactor in local/dev
- Switching branches with incompatible migrations
- You intentionally want a clean database

**Commands to run:**

```bash
docker compose down -v
docker compose up -d --build
docker compose --profile migrate run --rm migrations
```

#### ❌ Do NOT use it when

- Normal development
- Adding/updating migrations
- Applying new schema changes
- Working with important data
- Staging or production environments

> [!IMPORTANT]
> **Key takeaway**: `docker compose down -v` resets the database. Use it only when you want to start from scratch — not as part of a normal migration flow.

## Database Backup & Restore

This project provides standalone scripts to manually and automatically back up and restore your database **data**. This is particularly useful as a safety net before running migrations or for recovering your data into a fresh schema after a database reset (`docker compose down -v`).

For detailed instructions on setting up cloud backups (AWS S3 and Google Drive) or scheduling automated daily backups, refer to the [Database Backup Setup Guide](file:///Users/mohammeddanish/Project/talent-flow-ats/BACKUP_SETUP.md).

### Scenarios

- **Safety Net**: Run a backup before applying new migrations.
- **Recovery**: Restore data after `docker compose down -v` or a corrupted migration.
- **State Snapshot**: Save a specific state of your data to return to it later.

### Usage Instructions

#### 1. Backing Up the Database

To run a manual or on-demand backup (reads configuration settings from the main `.env` file):

**Option A: Running on the Host System (Without Docker)**
```bash
./backend/scripts/daily_backup.sh
```
*(The script will automatically detect and communicate with the Docker database container to perform the backup)*

**Option B: Running Inside the Backend Docker Container**
```bash
docker exec -it talent-flow-backend bash -c "/backend/scripts/daily_backup.sh"
```

*   **Output**: A timestamped SQL file in `backend/backups/` named `talent_flow_ats_backup_YYYY-MM-DD.sql`.
*   **Method**: Exports only the **data** using `INSERT` statements.
*   **Handling Empty DB**: The script calculates total rows across all tables. If the database is entirely empty, it will NOT create a backup file and will display a status report for each table.

#### 2. Restoring the Database

To restore a backup file (automatically resolves circular foreign-key constraints during insertion):

**Option A: Running on the Host System (Without Docker)**
*   Restore the **most recent** backup:
    ```bash
    ./backend/scripts/restore_db.sh
    ```
*   Restore a **specific** backup file:
    ```bash
    ./backend/scripts/restore_db.sh backend/backups/your_specific_file.sql
    ```

**Option B: Running Inside the Backend Docker Container**
*   Restore the **most recent** backup:
    ```bash
    docker exec -it talent-flow-backend bash -c "/backend/scripts/restore_db.sh"
    ```
*   Restore a **specific** backup file:
    ```bash
    docker exec -it talent-flow-backend bash -c "/backend/scripts/restore_db.sh backend/backups/your_specific_file.sql"
    ```

> [!CAUTION]
> The restore process will **truncate (empty)** existing tables and re-insert the data in hierarchical order. It preserves the table structure created by your migrations.

#### 3. Automated Backup Scheduling

To register the daily backup to run automatically at 12:00 AM (midnight) local time:

```bash
./backend/scripts/setup_backup_cron.sh
```

#### 4. Ideal Recovery Flow

If you need to reset and recover your data (e.g., after `docker compose down -v`):

1. **Clean up**: `docker compose down -v`
2. **Restart**: `docker compose up -d`
3. **Migrate**: `docker compose --profile migrate run --rm migrations`
4. **Recover Data**: `./backend/scripts/restore_db.sh`

## Project Structure

- `backend/`: Contains the FastAPI application logic.
  - `app/`: Main application source code.
  - `requirements.txt`: Python dependencies.
- `frontend/`: Contains the Next.js application logic.
  - `app/`: Next.js App Router structure.
  - `public/`: Static assets.

## CI/CD Pipeline

The project uses GitHub Actions for Continuous Integration. The pipeline is configured in [.github/workflows/ci.yml](file:///.github/workflows/ci.yml) and runs on every push to any branch and pull requests to `develop` and `main`.

### Checks Performed:

- **Backend**: Linting with `ruff`.
- **Frontend**: Linting with `eslint` and Build check with `next build`.
- **Branch Enforcement**: Ensures that Pull Requests from feature branches target the `develop` branch.

## Branching Strategy

To maintain a clean and stable codebase, follow this branching strategy:

1.  **Feature Branches**: Create branches named `feat/*` or `feature/*` for new features or bug fixes.
2.  **Develop Branch**: All feature branches MUST be merged into `develop` via a Pull Request.
3.  **Main Branch**: Stable releases are merged from `develop` into `main`.

> [!IMPORTANT]
> Always target `develop` when creating a Pull Request from a feature branch.

## Redis Cache Management

During development and testing, you can inspect, monitor, or clear the Redis cache visually or via the CLI.

### 1. Visual GUI Dashboard (Recommended)
With Redis Stack, a powerful graphical UI (**RedisInsight**) is available out of the box.
- **URL:** [http://localhost:8001](http://localhost:8001)
- **Usage:** Open in your browser to visually browse cached JSON papers (`paper:{id}:details`), monitor memory usage, and interact with data without commands.

### 2. View all cached keys (CLI)
```bash
docker exec -it talent-flow-redis redis-cli KEYS "*"
```

### 3. View specific formatted JSON data (CLI)
To view the cached details of a specific paper (replace `1` with the paper ID) in a pretty JSON format using `jq` from your terminal:
```bash
docker exec talent-flow-redis redis-cli GET "paper:1:details" | jq .
```
*(If `jq` is not installed, you can pipe to `python3 -m json.tool` instead).*

### 4. Clear all Redis cache
```bash
docker exec -it talent-flow-redis redis-cli FLUSHALL
```
