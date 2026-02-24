from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    TIMESTAMP,
    Index,
    text,
)
from sqlalchemy.orm import relationship

from app.database.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(255), nullable=False)
    mobile = Column(String(10), nullable=False, unique=True)
    email = Column(String(255), nullable=True)

    password = Column(String(255), nullable=False)

    testlevel = Column(String(50), nullable=True)
    role = Column(String(50), nullable=False, server_default=text("'user'"))

    is_active = Column(Boolean, nullable=False, server_default=text("true"))

    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    created_at = Column(
        TIMESTAMP,
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
    )

    updated_at = Column(
        TIMESTAMP,
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
    )

    # Self-referencing relationship (who created this user)
    creator = relationship(
        "User",
        remote_side=[id],
        backref="created_users",
    )


# Explicit index (matches your SQL)
Index("idx_users_mobile", User.mobile)
