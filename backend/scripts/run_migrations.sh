#!/bin/sh
set -e

ACTION=$1
REVISION=${2:-head}

echo "================================================="
echo "🚀 Database Migration Utility"
echo "Action: $ACTION"
echo "Revision: $REVISION"
echo "================================================="

# Function to print usage
usage() {
    echo ""
    echo "Usage:"
    echo "  ./run_migrations.sh upgrade [revision]"
    echo "  ./run_migrations.sh downgrade [revision]"
    echo "  ./run_migrations.sh current"
    echo "  ./run_migrations.sh history"
    echo "  ./run_migrations.sh heads"
    echo ""
    echo "Examples:"
    echo "  ./run_migrations.sh upgrade"
    echo "  ./run_migrations.sh upgrade head"
    echo "  ./run_migrations.sh downgrade -1"
    echo "  ./run_migrations.sh downgrade base"
    echo "  ./run_migrations.sh downgrade <revision_id>"
    echo ""
}

# Check if action provided
if [ -z "$ACTION" ]; then
    echo "❌ No action provided."
    usage
    exit 1
fi

if [ -x "venv/bin/python" ]; then
    ALEMBIC_PYTHON="venv/bin/python"
elif command -v python3 >/dev/null 2>&1; then
    ALEMBIC_PYTHON="python3"
else
    echo "❌ Python 3 not found. Please install Python or create backend/venv."
    exit 1
fi

echo "🐍 Using Python: $ALEMBIC_PYTHON"

case "$ACTION" in

    upgrade)
        echo "⬆️ Running upgrade..."
        "$ALEMBIC_PYTHON" -m alembic upgrade "$REVISION"
        ;;

    downgrade)
        echo "⬇️ Running downgrade..."
        "$ALEMBIC_PYTHON" -m alembic downgrade "$REVISION"
        ;;

    current)
        echo "📌 Current migration revision:"
        "$ALEMBIC_PYTHON" -m alembic current
        ;;

    history)
        echo "📜 Migration history:"
        "$ALEMBIC_PYTHON" -m alembic history
        ;;

    heads)
        echo "🔝 Current heads:"
        "$ALEMBIC_PYTHON" -m alembic heads
        ;;

    help)
        usage
        ;;

    *)
        echo "❌ Invalid command: $ACTION"
        usage
        exit 1
        ;;

esac

echo "================================================="
echo "✅ Migration command executed successfully"
echo "================================================="
