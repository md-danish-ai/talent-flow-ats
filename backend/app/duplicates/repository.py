from sqlalchemy.orm import Session
from app.duplicates.models import AdminNotification, DuplicateUserMatch
from typing import Optional, List, Tuple
from app.utils.pagination import PaginationParams


def get_notifications(
    db: Session,
    pagination: PaginationParams,
    is_read: Optional[bool] = None,
    user_id: Optional[int] = None,
) -> Tuple[List[Tuple[AdminNotification, Optional[DuplicateUserMatch]]], int]:
    query = db.query(AdminNotification, DuplicateUserMatch).outerjoin(
        DuplicateUserMatch, AdminNotification.reference_id == DuplicateUserMatch.id
    )

    if user_id is not None:
        query = query.filter(AdminNotification.user_id == user_id)
    else:
        query = query.filter(AdminNotification.user_id.is_(None))

    if is_read is not None:
        query = query.filter(AdminNotification.is_read.is_(is_read))

    if pagination.search:
        search_term = f"%{pagination.search}%"
        query = query.filter(
            (AdminNotification.title.ilike(search_term))
            | (AdminNotification.message.ilike(search_term))
        )

    total_records = query.count()

    # Sorting
    if pagination.sort_by == "created_at":
        sort_col = (
            AdminNotification.created_at.desc()
            if pagination.order == "desc"
            else AdminNotification.created_at.asc()
        )
    else:
        sort_col = AdminNotification.created_at.desc()

    query = query.order_by(sort_col)

    offset = (pagination.page - 1) * pagination.limit
    results = query.offset(offset).limit(pagination.limit).all()

    return results, total_records


def get_counts(db: Session, user_id: Optional[int] = None):
    query_unread = db.query(AdminNotification).filter(
        AdminNotification.is_read.is_(False)
    )
    query_read = db.query(AdminNotification).filter(AdminNotification.is_read.is_(True))

    if user_id is not None:
        query_unread = query_unread.filter(AdminNotification.user_id == user_id)
        query_read = query_read.filter(AdminNotification.user_id == user_id)
    else:
        query_unread = query_unread.filter(AdminNotification.user_id.is_(None))
        query_read = query_read.filter(AdminNotification.user_id.is_(None))

    unread = query_unread.count()
    read = query_read.count()
    return unread, read


def update_notification_status(
    db: Session, ids: List[int], is_read: bool, user_id: Optional[int] = None
):
    query = db.query(AdminNotification).filter(AdminNotification.id.in_(ids))
    if user_id is not None:
        query = query.filter(AdminNotification.user_id == user_id)
    else:
        query = query.filter(AdminNotification.user_id.is_(None))

    notifications = query.all()

    for notification in notifications:
        notification.is_read = is_read

    db.commit()
    return len(notifications)
