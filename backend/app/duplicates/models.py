from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    ForeignKey,
    TIMESTAMP,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB

from app.database.db import Base


class DuplicateUserMatch(Base):
    __tablename__ = "duplicate_user_matches"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    new_user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    matched_user_id = Column(
        Integer, ForeignKey("users.id"), nullable=False, index=True
    )
    primary_score = Column(Float, nullable=False)
    final_score = Column(Float, nullable=False)
    status = Column(
        String(50), nullable=False
    )  # 'possible', 'high', 'confirmed', 'rejected'
    match_details = Column(JSONB, nullable=True)
    is_reviewed = Column(Boolean, default=False, nullable=False)
    created_at = Column(
        TIMESTAMP, server_default=func.current_timestamp(), nullable=False
    )


class AdminNotification(Base):
    __tablename__ = "admin_notifications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    type = Column(String(100), nullable=False)  # 'duplicate_user'
    reference_id = Column(
        Integer, ForeignKey("duplicate_user_matches.id"), nullable=True
    )
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(
        TIMESTAMP, server_default=func.current_timestamp(), nullable=False
    )
