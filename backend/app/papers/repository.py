from app.database.db import SessionLocal
from app.papers.models import Paper
from app.papers.schemas import PaperCreate, PaperUpdate
from sqlalchemy.orm import Session
from typing import List, Optional

def get_papers(db: Session, skip: int = 0, limit: int = 100) -> List[Paper]:
    return db.query(Paper).offset(skip).limit(limit).all()

def get_paper(db: Session, paper_id: int) -> Optional[Paper]:
    return db.query(Paper).filter(Paper.id == paper_id).first()

def create_paper(db: Session, paper: PaperCreate) -> Paper:
    db_paper = Paper(**paper.model_dump())
    db.add(db_paper)
    db.commit()
    db.refresh(db_paper)
    return db_paper

def update_paper(db: Session, paper_id: int, paper_update: PaperUpdate) -> Optional[Paper]:
    db_paper = get_paper(db, paper_id)
    if not db_paper:
        return None
    
    update_data = paper_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_paper, key, value)
    
    db.commit()
    db.refresh(db_paper)
    return db_paper

def delete_paper(db: Session, paper_id: int) -> bool:
    db_paper = get_paper(db, paper_id)
    if not db_paper:
        return False
    db.delete(db_paper)
    db.commit()
    return True
