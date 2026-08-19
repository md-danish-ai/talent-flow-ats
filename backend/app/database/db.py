from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings

DATABASE_URL = (
    f"postgresql+psycopg2://{settings.DB_USER}:"
    f"{settings.DB_PASSWORD}@{settings.DB_HOST}:"
    f"{settings.DB_PORT}/{settings.DB_NAME}"
)

# Pool tuning for 250-300 concurrent candidates via PgBouncer (transaction mode)
# Formula: total_connections = workers × (pool_size + max_overflow)
# 16 workers × (15 + 15) = 480 — fits under PGBOUNCER_MAX_CLIENT_CONN (500) ✅
# pool_recycle=600 (10 min) avoids stale connections with PgBouncer's idle timeouts
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=15,       # Base persistent connections per worker
    max_overflow=15,    # Extra burst connections (total max per worker = 30)
    pool_timeout=15,    # Wait up to 15s for a free connection (was 30)
    pool_recycle=600,   # Recycle connections every 10min (was 1800)
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
