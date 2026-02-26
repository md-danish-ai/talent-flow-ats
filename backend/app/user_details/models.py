from sqlalchemy import (
    Column,
    Integer,
    Boolean,
    ForeignKey,
    TIMESTAMP,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB

from app.database.db import Base


class UserDetail(Base):
    __tablename__ = "user_details"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    personal_details = Column(JSONB, nullable=True)
    family_details = Column(JSONB, nullable=True)
    source_of_information = Column(JSONB, nullable=True)
    education_details = Column(JSONB, nullable=True)
    work_experience_details = Column(JSONB, nullable=True)
    other_details = Column(JSONB, nullable=True)

    is_submitted = Column(Boolean, server_default="false", nullable=False)

    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
        nullable=False
    )
