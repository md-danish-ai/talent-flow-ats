from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .schemas import AIQuestionRequest, AIQuestionResponse
from .service import AIQuestionService
from .dependencies import get_db_session
from app.auth.dependencies import get_current_user
from app.utils.status_codes import StatusCode, api_response

router = APIRouter()

@router.post("/generate", response_model=AIQuestionResponse)
async def generate_questions(
    request: AIQuestionRequest,
    db: Session = Depends(get_db_session),
    user_id: int = Depends(get_current_user)
):
    try:
        service = AIQuestionService(db)
        questions = await service.generate_questions(request, user_id)
        
        if not questions:
            return api_response(
                StatusCode.OK, 
                "No questions were generated (possible duplicates or AI error).", 
                data=[]
            )
            
        return api_response(
            StatusCode.CREATED, 
            "Questions generated and stored successfully.", 
            data=[{"id": q.id, "text": q.question_text} for q in questions]
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
