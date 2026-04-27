from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, func
from sqlalchemy.dialects.postgresql import JSONB
from app.database.db import Base

class InterviewEvaluation(Base):
    __tablename__ = "interview_evaluations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Relations
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    project_lead_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    attempt_id = Column(Integer, ForeignKey("interview_records.id"), index=True, nullable=False)
    
    # Metadata
    round_type = Column(String(50), nullable=False, server_default="F2F")
    status = Column(String(20), nullable=False, server_default="pending") # pending, completed
    
    # Evaluation Data (JSONB for metrics ratings)
    evaluation_data = Column(JSONB, nullable=False, server_default="{}")
    
    # Results
    overall_grade = Column(String(20), nullable=True) # Excellent, Good, etc.
    final_verdict_id = Column(Integer, ForeignKey("classifications.id"), nullable=True) # Must Hire, etc.
    
    comments = Column(String(1000), nullable=True)
    
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.current_timestamp(), onupdate=func.current_timestamp(), nullable=False)
