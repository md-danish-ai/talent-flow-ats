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

case "$ACTION" in

    upgrade)
        echo "⬆️ Running upgrade..."
        alembic upgrade $REVISION
        ;;

    downgrade)
        echo "⬇️ Running downgrade..."
        alembic downgrade $REVISION
        ;;

    current)
        echo "📌 Current migration revision:"
        alembic current
        ;;

    history)
        echo "📜 Migration history:"
        alembic history
        ;;

    heads)
        echo "🔝 Current heads:"
        alembic heads
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