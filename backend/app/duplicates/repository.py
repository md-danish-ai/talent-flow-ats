from sqlalchemy.orm import Session
from app.duplicates.models import AdminNotification, DuplicateUserMatch
from typing import Optional, List, Tuple
from app.utils.pagination import PaginationParams

def get_notifications(
    db: Session, 
    pagination: PaginationParams, 
    is_read: Optional[bool] = None
) -> Tuple[List[Tuple[AdminNotification, Optional[DuplicateUserMatch]]], int]:
    query = db.query(AdminNotification, DuplicateUserMatch).outerjoin(
        DuplicateUserMatch, AdminNotification.reference_id == DuplicateUserMatch.id
    )

    if is_read is not None:
        query = query.filter(AdminNotification.is_read.is_(is_read))

    if pagination.search:
        search_term = f"%{pagination.search}%"
        query = query.filter(
            (AdminNotification.title.ilike(search_term)) | 
            (AdminNotification.message.ilike(search_term))
        )
    
    total_records = query.count()
    
    # Sorting
    if pagination.sort_by == "created_at":
        sort_col = AdminNotification.created_at.desc() if pagination.order == "desc" else AdminNotification.created_at.asc()
    else:
        sort_col = AdminNotification.created_at.desc()
        
    query = query.order_by(sort_col)
    
    offset = (pagination.page - 1) * pagination.limit
    results = query.offset(offset).limit(pagination.limit).all()
    
    return results, total_records

def get_counts(db: Session):
    unread = db.query(AdminNotification).filter(AdminNotification.is_read.is_(False)).count()
    read = db.query(AdminNotification).filter(AdminNotification.is_read.is_(True)).count()
    return unread, read

def update_notification_status(db: Session, ids: List[int], is_read: bool):
    notifications = db.query(AdminNotification).filter(
        AdminNotification.id.in_(ids)
    ).all()
    
    for notification in notifications:
        notification.is_read = is_read
        
    db.commit()
    return len(notifications)
