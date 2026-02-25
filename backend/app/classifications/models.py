from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    TIMESTAMP,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB

from app.database.db import Base


class Classification(Base):
    __tablename__ = "classifications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(100), nullable=False)
    type = Column(String(100), nullable=False)
    name = Column(String(255), nullable=False)
    extra_metadata = Column("metadata", JSONB, nullable=True)
    sort_order = Column(Integer, server_default="0", nullable=False)
    is_active = Column(Boolean, server_default="true", nullable=False)

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        nullable=False
    )
    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
        nullable=False
    )
