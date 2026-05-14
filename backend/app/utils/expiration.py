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
    has_today_assignment = (
        db_session.query(PaperAssignment.user_id)
        .filter(PaperAssignment.assigned_date == today)
        .subquery()
    )

    # We care about users who are 'ready', 'inprogress', or 'pending' (if they already have an assignment).
    from app.user_details.models import UserDetail
    from sqlalchemy import or_, func

    to_expire_query = (
        db_session.query(User)
        .outerjoin(PaperAssignment, User.id == PaperAssignment.user_id)
        .outerjoin(UserDetail, User.id == UserDetail.user_id)
        .filter(
            User.role == "user",
            User.is_active.is_(True),
            User.process_status.in_(
                ["pending", "ready", "inprogress", "submitted", "auto_submitted"]
            ),
            # Identify candidates from past dates (by assignment or registration)
            or_(
                PaperAssignment.assigned_date < today,
                func.date(User.created_at) < today,
            ),
            # MUST NOT have been updated/touched today (Manual Override)
            func.date(User.updated_at) < today,
            # MUST NOT have an assignment for today
            ~User.id.in_(has_today_assignment),
            # Exclude users who are reset for re-interview today
            ~(
                UserDetail.is_reinterview
                & (UserDetail.reinterview_date == today)
            ),
        )
        .distinct()
    )

    expired_count = 0
    # Use .all() to fetch all matching users first to avoid cursor issues during iteration
    users_to_expire = to_expire_query.all()

    for user in users_to_expire:
        # Only set process_status to 'expired' if they haven't submitted
        if user.process_status not in ["submitted", "auto_submitted"]:
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
