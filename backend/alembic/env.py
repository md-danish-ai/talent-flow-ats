from logging.config import fileConfig
import os

from alembic import context
from sqlalchemy import engine_from_config, pool

# Import SQLAlchemy Base and models
# IMPORTANT: importing models registers tables with metadata
from app.database.db import Base
from app.questions import models as question_models  # noqa: F401
from app.users import models as user_models  # noqa: F401

# ---------------------------------------------------------
# Alembic Config object (reads alembic.ini)
# ---------------------------------------------------------
config = context.config

# ---------------------------------------------------------
# Configure logging from alembic.ini
# ---------------------------------------------------------
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ---------------------------------------------------------
# Metadata for autogenerate support
# ---------------------------------------------------------
target_metadata = Base.metadata


# ---------------------------------------------------------
# Build DATABASE URL from environment variables
# ---------------------------------------------------------
def get_database_url() -> str:
    required_vars = [
        "DB_USER",
        "DB_PASSWORD",
        "DB_HOST",
        "DB_PORT",
        "DB_NAME",
    ]

    missing = [v for v in required_vars if not os.getenv(v)]
    if missing:
        raise RuntimeError(
            f"Missing required DB environment variables: {', '.join(missing)}"
        )

    return (
        "postgresql+psycopg2://"
        f"{os.environ['DB_USER']}:{os.environ['DB_PASSWORD']}"
        f"@{os.environ['DB_HOST']}:{int(os.environ['DB_PORT'])}"
        f"/{os.environ['DB_NAME']}"
    )


# ---------------------------------------------------------
# Offline migration mode (generates SQL, no DB connection)
# ---------------------------------------------------------
def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.
    This does NOT connect to the database.
    """
    url = get_database_url()

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


# ---------------------------------------------------------
# Online migration mode (applies migrations to DB)
# ---------------------------------------------------------
def run_migrations_online() -> None:
    """
    Run migrations in 'online' mode.
    This connects to the database and applies changes.
    """
    # Inject computed DB URL into Alembic config
    config.set_main_option("sqlalchemy.url", get_database_url())

    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True,
        )

        with context.begin_transaction():
            context.run_migrations()


# ---------------------------------------------------------
# Entry point
# ---------------------------------------------------------
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
    