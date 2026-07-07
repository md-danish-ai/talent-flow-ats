from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database.db import Base


class State(Base):
    __tablename__ = "states"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    code = Column(String(5), nullable=False, unique=True)

    districts = relationship(
        "District", back_populates="state", cascade="all, delete-orphan"
    )


class District(Base):
    __tablename__ = "districts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    state_id = Column(
        Integer, ForeignKey("states.id", ondelete="CASCADE"), nullable=False
    )
    name = Column(String(255), nullable=False)

    state = relationship("State", back_populates="districts")
