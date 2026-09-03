from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings

DATABASE_URL = (
    f"postgresql+psycopg2://{settings.DB_USER}:"
    f"{settings.DB_PASSWORD}@{settings.DB_HOST}:"
    f"{settings.DB_PORT}/{settings.DB_NAME}"
)

# Database connection pool (Tuned for 6 workers + PgBouncer)
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,  # Persistent connections per worker
    max_overflow=10,  # Max burst connections per worker
    pool_timeout=15,  # Timeout (seconds) waiting for connection
    pool_recycle=600,  # Recycle connections every 10 minutes
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
