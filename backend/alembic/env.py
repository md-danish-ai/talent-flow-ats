from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

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
# Import SQLAlchemy Base and models
# IMPORTANT: These imports register tables with SQLAlchemy
# ---------------------------------------------------------
from app.database.db import Base

# Import ALL model modules here
from app.questions import models as question_models
from app.users import models as user_models
# later you can add:
# from app.answer import models as answer_models

# ---------------------------------------------------------
# Metadata for autogenerate support
# ---------------------------------------------------------
target_metadata = Base.metadata


# ---------------------------------------------------------
# Offline migration mode (generates SQL, no DB connection)
# ---------------------------------------------------------
def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.
    This is used when generating SQL files.
    """
    url = config.get_main_option("sqlalchemy.url")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,        # detect column type changes
        compare_server_default=True,  # detect default changes
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
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
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