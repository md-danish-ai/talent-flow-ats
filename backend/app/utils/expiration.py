from datetime import date
from app.users.models import User
from app.paper_assignments.models import PaperAssignment

def run_auto_expiration(db_session):
    """
    Identifies users who were assigned a paper in the past but never finished it,
    marking them as 'expired' and deactivating their accounts.
    Runs a bulk update for all eligible users.
    """
    today = date.today()
    
    # Subquery: Users who have an assignment for TODAY (don't expire them yet)
    has_today_assignment = db_session.query(PaperAssignment.user_id).filter(
        PaperAssignment.assigned_date == today
    )

    # We join with PaperAssignment to find users who have an unattempted assignment from a past date.
    # We care about users who are 'ready', 'inprogress', or 'pending' (if they already have an assignment).
    to_expire_query = (
        db_session.query(User)
        .join(PaperAssignment, User.id == PaperAssignment.user_id)
        .filter(
            User.role == "user",
            User.is_active.is_(True),
            User.process_status.in_(["pending", "ready", "inprogress"]),
            PaperAssignment.assigned_date < today,
            PaperAssignment.is_attempted.is_(False),
            ~User.id.in_(has_today_assignment)
        )
    )

    expired_count = 0
    # Use .all() to fetch all matching users first to avoid cursor issues during iteration
    users_to_expire = to_expire_query.all()
    
    for user in users_to_expire:
        user.process_status = "expired"
        user.is_active = False
        expired_count += 1

    if expired_count > 0:
        try:
            db_session.commit()
            print(f"Auto-expired {expired_count} users.")
        except Exception as e:
            db_session.rollback()
            print(f"Error during auto-expiration: {str(e)}")
    
    return expired_count
