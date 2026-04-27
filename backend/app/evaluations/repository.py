from sqlalchemy.orm import Session, aliased
from sqlalchemy import desc, and_
from .models import InterviewEvaluation
from .schemas import InterviewEvaluationCreate, InterviewEvaluationUpdate
from app.users.models import User
from app.classifications.models import Classification
from app.interview_attempts.models import InterviewRecord

def create_evaluation(db: Session, obj_in: InterviewEvaluationCreate):
    db_obj = InterviewEvaluation(
        user_id=obj_in.user_id,
        project_lead_id=obj_in.project_lead_id,
        attempt_id=obj_in.attempt_id,
        round_type=obj_in.round_type or "F2F",
        status="pending"
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_evaluation(db: Session, evaluation_id: int):
    return db.query(InterviewEvaluation).filter(InterviewEvaluation.id == evaluation_id).first()

def get_evaluations_by_candidate(db: Session, user_id: int):
    return (
        db.query(InterviewEvaluation)
        .filter(InterviewEvaluation.user_id == user_id)
        .order_by(desc(InterviewEvaluation.created_at))
        .all()
    )

def get_evaluations_by_lead(db: Session, lead_id: int, status: str = None):
    query = (
        db.query(
            InterviewEvaluation.id,
            InterviewEvaluation.user_id,
            InterviewEvaluation.status,
            InterviewEvaluation.created_at,
            User.username.label("candidate_name"),
            User.mobile.label("candidate_mobile")
        )
        .join(User, User.id == InterviewEvaluation.user_id)
        .filter(InterviewEvaluation.project_lead_id == lead_id)
    )
    if status:
        query = query.filter(InterviewEvaluation.status == status)
    
    return [dict(r._asdict()) for r in query.order_by(desc(InterviewEvaluation.created_at)).all()]

def update_evaluation(db: Session, evaluation_id: int, obj_in: InterviewEvaluationUpdate):
    db_obj = get_evaluation(db, evaluation_id)
    if not db_obj:
        return None
    
    db_obj.evaluation_data = obj_in.evaluation_data
    db_obj.overall_grade = obj_in.overall_grade
    db_obj.final_verdict_id = obj_in.final_verdict_id
    db_obj.comments = obj_in.comments
    db_obj.status = "completed"
    
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_evaluation(db: Session, evaluation_id: int):
    db_obj = get_evaluation(db, evaluation_id)
    if db_obj:
        db.delete(db_obj)
        db.commit()
    return db_obj

def get_all_evaluations_with_details(db: Session, status: str | None = None):
    Candidate = aliased(User)
    Lead = aliased(User)
    
    query = (
        db.query(
            InterviewEvaluation.id,
            InterviewEvaluation.status,
            InterviewEvaluation.overall_grade,
            InterviewEvaluation.created_at,
            Candidate.username.label("candidate_name"),
            Candidate.id.label("candidate_id"),
            Candidate.mobile.label("candidate_mobile"),
            Lead.username.label("lead_name"),
            Classification.name.label("verdict_name")
        )
        .join(Candidate, Candidate.id == InterviewEvaluation.user_id)
        .join(Lead, Lead.id == InterviewEvaluation.project_lead_id)
        .outerjoin(Classification, Classification.id == InterviewEvaluation.final_verdict_id)
    )
    
    if status and status != "all":
        query = query.filter(InterviewEvaluation.status == status)
        
    return [dict(r._asdict()) for r in query.order_by(desc(InterviewEvaluation.id)).all()]

def get_evaluations_by_candidate_with_details(db: Session, user_id: int):
    return (
        db.query(InterviewEvaluation, User.username, Classification.name)
        .join(User, User.id == InterviewEvaluation.project_lead_id)
        .outerjoin(Classification, Classification.id == InterviewEvaluation.final_verdict_id)
        .filter(InterviewEvaluation.user_id == user_id)
        .order_by(desc(InterviewEvaluation.created_at))
        .all()
    )

def get_evaluations_for_admin_results(db: Session, user_id: int, attempt_id: int):
    """Fetch all evaluations for a specific Round 1 attempt to show in history."""
    return (
        db.query(InterviewEvaluation, User.username, Classification.name)
        .join(User, User.id == InterviewEvaluation.project_lead_id)
        .outerjoin(Classification, Classification.id == InterviewEvaluation.final_verdict_id)
        .filter(
            InterviewEvaluation.user_id == user_id,
            InterviewEvaluation.attempt_id == attempt_id
        )
        .all()
    )
