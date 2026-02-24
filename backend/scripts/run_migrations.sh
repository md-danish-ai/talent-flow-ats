#!/bin/sh
set -e

echo "================================================="
echo "🚀 Starting database migrations"
echo "================================================="

alembic upgrade head

echo "================================================="
echo "✅ Database migrations completed successfully"
echo "================================================="