from sqlalchemy.orm import Session, aliased
from sqlalchemy import desc
from .models import InterviewEvaluation
from .schemas import InterviewEvaluationCreate, InterviewEvaluationUpdate
from app.users.models import User
from app.classifications.models import Classification

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

def bulk_create_evaluations(db: Session, user_ids: list[int], attempt_ids: list[int], lead_id: int, round_type: str = "F2F"):
    new_objs = []
    for user_id, attempt_id in zip(user_ids, attempt_ids):
        # Check if already assigned
        existing = db.query(InterviewEvaluation).filter(
            InterviewEvaluation.user_id == user_id,
            InterviewEvaluation.project_lead_id == lead_id,
            InterviewEvaluation.attempt_id == attempt_id
        ).first()
        
        if existing:
            continue
            
        db_obj = InterviewEvaluation(
            user_id=user_id,
            project_lead_id=lead_id,
            attempt_id=attempt_id,
            round_type=round_type or "F2F",
            status="pending"
        )
        db.add(db_obj)
        new_objs.append(db_obj)
    
    if new_objs:
        db.commit()
        for obj in new_objs:
            db.refresh(obj)
            
    return new_objs

def get_evaluation(db: Session, evaluation_id: int):
    return db.query(InterviewEvaluation).filter(InterviewEvaluation.id == evaluation_id).first()

def get_evaluations_by_candidate(db: Session, user_id: int):
    return (
        db.query(InterviewEvaluation)
        .filter(InterviewEvaluation.user_id == user_id)
        .order_by(desc(InterviewEvaluation.created_at))
        .all()
    )

def get_evaluations_by_lead(db: Session, lead_id: int, status: str = None, page: int = 1, limit: int = 10):
    Lead = aliased(User)
    Candidate = aliased(User)
    
    query = (
        db.query(
            InterviewEvaluation.id,
            InterviewEvaluation.user_id,
            InterviewEvaluation.status,
            InterviewEvaluation.overall_grade,
            InterviewEvaluation.created_at,
            Candidate.username.label("candidate_name"),
            Candidate.mobile.label("candidate_mobile"),
            Lead.username.label("lead_name"),
            Classification.name.label("result_name")
        )
        .join(Candidate, Candidate.id == InterviewEvaluation.user_id)
        .join(Lead, Lead.id == InterviewEvaluation.project_lead_id)
        .outerjoin(Classification, Classification.id == InterviewEvaluation.final_result_id)
        .filter(InterviewEvaluation.project_lead_id == lead_id)
    )
    if status and status != "all":
        query = query.filter(InterviewEvaluation.status == status)
    
    total = query.count()
    results = query.order_by(desc(InterviewEvaluation.created_at)).offset((page - 1) * limit).limit(limit).all()
    
    return [dict(r._asdict()) for r in results], total

def update_evaluation(db: Session, evaluation_id: int, obj_in: InterviewEvaluationUpdate):
    db_obj = get_evaluation(db, evaluation_id)
    if not db_obj:
        return None
    
    db_obj.evaluation_data = obj_in.evaluation_data
    db_obj.overall_grade = obj_in.overall_grade
    db_obj.final_result_id = obj_in.final_result_id
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

def get_all_evaluations_with_details(db: Session, status: str | None = None, search: str | None = None, project_lead_id: str | None = None, limit: int = 10, offset: int = 0):
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
            Classification.name.label("result_name")
        )
        .join(Candidate, Candidate.id == InterviewEvaluation.user_id)
        .join(Lead, Lead.id == InterviewEvaluation.project_lead_id)
        .outerjoin(Classification, Classification.id == InterviewEvaluation.final_result_id)
    )
    
    if status and status != "all":
        query = query.filter(InterviewEvaluation.status == status)
        
    if project_lead_id and project_lead_id != "all":
        query = query.filter(InterviewEvaluation.project_lead_id == int(project_lead_id))
        
    if search:
        query = query.filter(
            (Candidate.username.ilike(f"%{search}%")) |
            (Candidate.mobile.ilike(f"%{search}%"))
        )
        
    total_records = query.count()
    results = query.order_by(desc(InterviewEvaluation.id)).offset(offset).limit(limit).all()
    
    return [dict(r._asdict()) for r in results], total_records

def get_evaluations_by_candidate_with_details(db: Session, user_id: int):
    return (
        db.query(InterviewEvaluation, User.username, Classification.name)
        .join(User, User.id == InterviewEvaluation.project_lead_id)
        .outerjoin(Classification, Classification.id == InterviewEvaluation.final_result_id)
        .filter(InterviewEvaluation.user_id == user_id)
        .order_by(desc(InterviewEvaluation.created_at))
        .all()
    )

def get_evaluations_for_admin_results(db: Session, user_id: int, attempt_id: int):
    """Fetch all evaluations for a specific Round 1 attempt to show in history."""
    return (
        db.query(InterviewEvaluation, User.username, Classification.name)
        .join(User, User.id == InterviewEvaluation.project_lead_id)
        .outerjoin(Classification, Classification.id == InterviewEvaluation.final_result_id)
        .filter(
            InterviewEvaluation.user_id == user_id,
            InterviewEvaluation.attempt_id == attempt_id
        )
        .all()
    )
