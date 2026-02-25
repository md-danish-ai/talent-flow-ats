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

You can run the application (currently backend only) using Docker Compose for a consistent environment.

1.  Start the services:
    ```bash
    docker-compose up -d --build
    ```
2.  Check running containers:
    ```bash
    docker-compose ps
    ```
3.  Run database migrations:
    ```bash
    docker compose --profile migrate run --rm migrations
    ```
4.  View logs:
    ```bash
    docker-compose logs -f backend
    ```
5.  Stop services:
    ```bash
    docker-compose down
    ```

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
    *Replace `migration_name_here` with a descriptive name for your change.*

### 2. Syncing with Docker

After generating the migration, you must update the Docker environment:

1.  Build the backend image again to include the new migration file:
    ```bash
    docker compose build
    docker compose up -d
    ```

2.  Run the migration script on Docker to sync the database structure:
    ```bash
    docker compose --profile migrate run --rm migrations
    ```

### 3. When to use `docker compose down -v`

#### ✅ Use it when
-   First-time project setup
-   Migration history is broken (schema ≠ `alembic_version`)
-   Major schema refactor in local/dev
-   Switching branches with incompatible migrations
-   You intentionally want a clean database

**Commands to run:**
```bash
docker compose down -v
docker compose up -d --build
docker compose --profile migrate run --rm migrations
```

#### ❌ Do NOT use it when
-   Normal development
-   Adding/updating migrations
-   Applying new schema changes
-   Working with important data
-   Staging or production environments

> [!IMPORTANT]
> **Key takeaway**: `docker compose down -v` resets the database. Use it only when you want to start from scratch — not as part of a normal migration flow.


## Database Backup & Restore

This project provides standalone scripts to manually back up and restore your database **data**. This is particularly useful as a safety net before running migrations or for recovering your data into a fresh schema after a database reset (`docker compose down -v`).

### Purpose
The primary purpose is to ensure data persistence and provide a quick recovery path during development, especially when schema changes or environment resets are involved.

### Scenarios
- **Safety Net**: Run a backup before applying new migrations.
- **Recovery**: Restore data after `docker compose down -v` or a corrupted migration.
- **State Snapshot**: Save a specific state of your data to return to it later.

### Usage Instructions

#### 1. Backing Up the Database
Execute the backup script from the project root:
```bash
./backend/scripts/backup_db.sh
```
- **Output**: A timestamped SQL file in `backend/backups/`.
- **Method**: Exports only the **data** using `INSERT` statements.
- **Handling Empty DB**: The script calculates total rows across all tables. If the database is entirely empty, it will NOT create a backup file and will display a status report for each table.

#### 2. Restoring the Database
To restore the **most recent** backup from the `backend/backups/` directory:
```bash
./backend/scripts/restore_db.sh
```

To restore a **specific** backup file:
```bash
./backend/scripts/restore_db.sh backend/backups/your_specific_file.sql
```

> [!CAUTION]
> The restore process will **truncate (empty)** existing tables and re-insert the data in hierarchical order. It preserves the table structure created by your migrations.

#### 3. Ideal Recovery Flow
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