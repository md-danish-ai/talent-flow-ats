from app.papers.models import Paper
from app.papers.schemas import PaperCreate, PaperUpdate
from sqlalchemy.orm import Session
from typing import List, Optional

from app.departments.models import Department
from app.classifications.models import Classification


def get_papers(db: Session, skip: int = 0, limit: int = 100) -> tuple[List[Paper], int]:
    query = (
        db.query(
            Paper,
            Department.name.label("department_name"),
            Classification.name.label("test_level_name"),
            Classification.code.label("test_level_code"),
        )
        .outerjoin(Department, Paper.department_id == Department.id)
        .outerjoin(Classification, Paper.test_level_id == Classification.id)
    )

    total_records = query.count()
    results = query.offset(skip).limit(limit).all()

    papers = []
    for paper, dept_name, level_name, level_code in results:
        paper.department_name = dept_name
        paper.test_level_name = level_name
        paper.test_level_id = level_code if level_code else str(paper.test_level_id)
        papers.append(paper)

    return papers, total_records


def get_paper(db: Session, paper_id: int) -> Optional[Paper]:
    result = (
        db.query(
            Paper,
            Department.name.label("department_name"),
            Classification.name.label("test_level_name"),
            Classification.code.label("test_level_code"),
        )
        .outerjoin(Department, Paper.department_id == Department.id)
        .outerjoin(Classification, Paper.test_level_id == Classification.id)
        .filter(Paper.id == paper_id)
        .first()
    )

    if not result:
        return None

    paper, dept_name, level_name, level_code = result
    paper.department_name = dept_name
    paper.test_level_name = level_name
    paper.test_level_id = level_code if level_code else str(paper.test_level_id)
    return paper


def create_paper(db: Session, paper: PaperCreate, user_id: int) -> Paper:
    paper_data = paper.model_dump()
    test_level_code = paper_data.pop("test_level_id")

    # Resolve test_level_id (code) to actual ID
    test_level = (
        db.query(Classification).filter(Classification.code == test_level_code).first()
    )
    test_level_id = test_level.id if test_level else None

    db_paper = Paper(**paper_data, test_level_id=test_level_id, created_by=user_id)
    db.add(db_paper)
    db.commit()
    db.refresh(db_paper)
    return get_paper(db, db_paper.id)


def update_paper(
    db: Session, paper_id: int, paper_update: PaperUpdate
) -> Optional[Paper]:
    db_paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not db_paper:
        return None

    update_data = paper_update.model_dump(exclude_unset=True)

    # If test_level_id (code) is being updated, resolve it to actual ID
    if "test_level_id" in update_data:
        test_level_code = update_data.pop("test_level_id")
        test_level = (
            db.query(Classification)
            .filter(Classification.code == test_level_code)
            .first()
        )
        if test_level:
            update_data["test_level_id"] = test_level.id

    for key, value in update_data.items():
        setattr(db_paper, key, value)

    db.commit()
    db.refresh(db_paper)
    return get_paper(db, paper_id)


def delete_paper(db: Session, paper_id: int) -> bool:
    db_paper = get_paper(db, paper_id)
    if not db_paper:
        return False
    db.delete(db_paper)
    db.commit()
    return True
