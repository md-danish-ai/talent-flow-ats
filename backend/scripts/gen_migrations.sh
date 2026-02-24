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
# Activate virtual environment
# =================================================
if [ ! -d "venv" ]; then
  echo "❌ Python virtualenv not found (venv/)"
  exit 1
fi

source venv/bin/activate

# =================================================
# Run Alembic
# =================================================
alembic revision --autogenerate -m "$MIGRATION_NAME"

echo "================================================="
echo "✅ Migration generated successfully"
echo "📁 Check alembic/versions/"
echo "================================================="
