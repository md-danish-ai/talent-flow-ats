from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.db import SessionLocal
from app.papers import repository, schemas
from app.utils.status_codes import StatusCode, ResponseMessage, api_response
from app.utils.dependencies import authenticate_user

router = APIRouter(
    prefix="/papers",
    tags=["Papers"],
    dependencies=[Depends(authenticate_user)]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[schemas.PaperResponse])
def read_papers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    papers = repository.get_papers(db, skip=skip, limit=limit)
    return papers

@router.get("/{paper_id}", response_model=schemas.PaperResponse)
def read_paper(paper_id: int, db: Session = Depends(get_db)):
    db_paper = repository.get_paper(db, paper_id=paper_id)
    if db_paper is None:
        raise HTTPException(status_code=404, detail="Paper not found")
    return db_paper

@router.post("/", response_model=schemas.PaperResponse)
def create_paper(paper: schemas.PaperCreate, db: Session = Depends(get_db)):
    return repository.create_paper(db=db, paper=paper)

@router.put("/{paper_id}", response_model=schemas.PaperResponse)
def update_paper(paper_id: int, paper: schemas.PaperUpdate, db: Session = Depends(get_db)):
    db_paper = repository.update_paper(db=db, paper_id=paper_id, paper_update=paper)
    if db_paper is None:
        raise HTTPException(status_code=404, detail="Paper not found")
    return db_paper

@router.delete("/{paper_id}")
def delete_paper(paper_id: int, db: Session = Depends(get_db)):
    success = repository.delete_paper(db=db, paper_id=paper_id)
    if not success:
        raise HTTPException(status_code=404, detail="Paper not found")
    return api_response(StatusCode.OK, ResponseMessage.DELETED)
