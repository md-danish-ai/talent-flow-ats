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

export DB_HOST DB_PORT DB_NAME DB_USER DB_PASSWORD

# =================================================
# Validate input
# =================================================
if [ -z "$1" ]; then
  echo "❌ Migration name is required"
  echo "Usage: ./scripts/gen-migration.sh \"add users table\""
  exit 1
fi

MIGRATION_NAME="$1"

echo "================================================="
echo "🚀 Generating Alembic migration"
echo "📝 Name: $MIGRATION_NAME"
echo "================================================="
echo "DB: $DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
echo "================================================="

# =================================================
# Resolve Python interpreter for Alembic
# =================================================
if [ -x "venv/bin/python" ]; then
  ALEMBIC_PYTHON="venv/bin/python"
elif command -v python3 >/dev/null 2>&1; then
  ALEMBIC_PYTHON="python3"
else
  echo "❌ Python 3 not found. Please install Python or create backend/venv."
  exit 1
fi

echo "🐍 Using Python: $ALEMBIC_PYTHON"

# =================================================
# Set migration author from git config
# =================================================
GIT_USER=$(git config user.name 2>/dev/null || true)
SYSTEM_USER=${USER:-${USERNAME:-unknown}}
MIGRATION_AUTHOR=${GIT_USER:-$SYSTEM_USER}
export MIGRATION_AUTHOR

# =================================================
# Run Alembic
# =================================================
"$ALEMBIC_PYTHON" -m alembic revision --autogenerate -m "$MIGRATION_NAME"

echo "================================================="
echo "✅ Migration generated successfully"
echo "📁 Check alembic/versions/"
echo "================================================="
