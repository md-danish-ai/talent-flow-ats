from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.db import SessionLocal
from . import repository, schemas
from app.utils.response_handler import ResponseHandler
from app.utils.status_codes import StatusCode

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/assign-lead-evaluation", status_code=StatusCode.CREATED)
def assign_interviews(payload: schemas.InterviewEvaluationCreate, db: Session = Depends(get_db)):
    try:
        # Check if already assigned to this lead for this attempt
        existing = db.query(repository.InterviewEvaluation).filter(
            repository.InterviewEvaluation.user_id == payload.user_id,
            repository.InterviewEvaluation.project_lead_id == payload.project_lead_id,
            repository.InterviewEvaluation.attempt_id == payload.attempt_id
        ).first()
        
        if existing:
            return ResponseHandler.success(
                data=existing,
                message="Already assigned to this Lead for this attempt."
            )
            
        evaluation = repository.create_evaluation(db, payload)
        return ResponseHandler.success(
            data=evaluation,
            message="Interview assigned successfully."
        )
    except Exception as e:
        return ResponseHandler.error(message=str(e))

@router.get("/list-lead-tasks/{lead_id}")
def get_lead_tasks(
    lead_id: int, 
    status: str = None, 
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    try:
        tasks, total = repository.get_evaluations_by_lead(db, lead_id, status, page, limit)
        return ResponseHandler.success(
            data=tasks,
            pagination={
                "total_records": total,
                "current_page": page,
                "total_pages": (total + limit - 1) // limit,
                "page_size": limit
            }
        )
    except Exception as e:
        return ResponseHandler.error(message=str(e))

@router.get("/get-evaluation-detail/{evaluation_id}")
def get_evaluation_detail(evaluation_id: int, db: Session = Depends(get_db)):
    try:
        eval_obj = repository.get_evaluation(db, evaluation_id)
        if not eval_obj:
            raise HTTPException(status_code=StatusCode.NOT_FOUND, detail="Evaluation record not found")
        
        # Convert SQLAlchemy object to dict for serialization
        data = {
            "id": eval_obj.id,
            "user_id": eval_obj.user_id,
            "project_lead_id": eval_obj.project_lead_id,
            "attempt_id": eval_obj.attempt_id,
            "round_type": eval_obj.round_type,
            "status": eval_obj.status,
            "evaluation_data": eval_obj.evaluation_data,
            "overall_grade": eval_obj.overall_grade,
            "final_verdict_id": eval_obj.final_verdict_id,
            "comments": eval_obj.comments,
            "created_at": eval_obj.created_at,
            "updated_at": eval_obj.updated_at
        }
        
        return ResponseHandler.success(data=data)
    except HTTPException as e:
        raise e
    except Exception as e:
        return ResponseHandler.error(message=str(e))

@router.post("/submit-evaluation-results/{evaluation_id}")
def submit_evaluation(evaluation_id: int, payload: schemas.InterviewEvaluationUpdate, db: Session = Depends(get_db)):
    try:
        evaluation = repository.update_evaluation(db, evaluation_id, payload)
        if not evaluation:
            raise HTTPException(status_code=StatusCode.NOT_FOUND, detail="Evaluation record not found")
        return ResponseHandler.success(
            data=evaluation,
            message="Evaluation submitted successfully."
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        return ResponseHandler.error(message=str(e))

@router.get("/list-admin-evaluations")
def list_evaluations_for_admin(
    status: str | None = None,
    search: str | None = None,
    project_lead_id: str | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    try:
        offset = (page - 1) * limit
        results, total = repository.get_all_evaluations_with_details(
            db, 
            status=status, 
            search=search,
            project_lead_id=project_lead_id,
            limit=limit, 
            offset=offset
        )
        total_pages = (total + limit - 1) // limit
        
        return ResponseHandler.success(
            data=results,
            pagination={
                "total_records": total,
                "total_pages": total_pages,
                "current_page": page,
                "per_page": limit,
            }
        )
    except Exception as e:
        return ResponseHandler.error(message=str(e))

@router.get("/list-user-evaluations/{user_id}")
def get_user_evaluation_history(user_id: int, db: Session = Depends(get_db)):
    try:
        results = repository.get_evaluations_by_candidate_with_details(db, user_id)
        
        history = []
        for eval_obj, lead_name, verdict_name in results:
            history.append({
                "id": eval_obj.id,
                "project_lead_id": eval_obj.project_lead_id,
                "attempt_id": eval_obj.attempt_id,
                "lead_name": lead_name,
                "status": eval_obj.status,
                "evaluation_data": eval_obj.evaluation_data,
                "overall_grade": eval_obj.overall_grade,
                "final_verdict_id": eval_obj.final_verdict_id,
                "verdict_name": verdict_name,
                "comments": eval_obj.comments,
                "created_at": eval_obj.created_at,
                "updated_at": eval_obj.updated_at
            })
            
        return ResponseHandler.success(data=history)
    except Exception as e:
        return ResponseHandler.error(message=str(e))

@router.get("/list-user-evaluations/{user_id}/{attempt_id}")
def get_evaluation_history(user_id: int, attempt_id: int, db: Session = Depends(get_db)):
    try:
        results = repository.get_evaluations_for_admin_results(db, user_id, attempt_id)
        
        history = []
        for eval_obj, lead_name, verdict_name in results:
            history.append({
                "id": eval_obj.id,
                "project_lead_id": eval_obj.project_lead_id,
                "lead_name": lead_name,
                "status": eval_obj.status,
                "evaluation_data": eval_obj.evaluation_data,
                "overall_grade": eval_obj.overall_grade,
                "final_verdict_id": eval_obj.final_verdict_id,
                "verdict_name": verdict_name,
                "comments": eval_obj.comments,
                "created_at": eval_obj.created_at,
                "updated_at": eval_obj.updated_at
            })
            
        return ResponseHandler.success(data=history)
    except Exception as e:
        return ResponseHandler.error(message=str(e))

@router.delete("/remove-lead-assignment/{evaluation_id}")
def unassign_interview(evaluation_id: int, db: Session = Depends(get_db)):
    try:
        eval_obj = repository.get_evaluation(db, evaluation_id)
        if not eval_obj:
            raise HTTPException(status_code=StatusCode.NOT_FOUND, detail="Assignment not found")
        
        if eval_obj.status == "completed":
            raise HTTPException(
                status_code=StatusCode.BAD_REQUEST, 
                detail="Cannot unassign a completed evaluation"
            )
            
        repository.delete_evaluation(db, evaluation_id)
        return ResponseHandler.success(message="Assignment removed successfully.")
    except HTTPException as e:
        raise e
    except Exception as e:
        return ResponseHandler.error(message=str(e))
