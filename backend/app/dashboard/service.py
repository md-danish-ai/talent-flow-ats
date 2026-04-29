from datetime import date
from typing import Optional
from sqlalchemy import func
from app.database.db import SessionLocal
from app.users.models import User
from app.papers.models import Paper
from app.questions.models import Question
from app.interview_attempts.models import InterviewRecord
from app.paper_assignments.models import PaperAssignment
from app.user_details.models import UserDetail
from .schemas import DashboardOverviewResponse, DashboardStats, TodayPulse, GradeCount
from app.utils.expiration import run_auto_expiration

class DashboardService:
    async def get_overview(self, start_date: Optional[date] = None, end_date: Optional[date] = None) -> DashboardOverviewResponse:
        db = SessionLocal()
        try:
            # Trigger Auto-Expiration on dashboard load to keep stats fresh
            run_auto_expiration(db)

            # Default to today if no date range provided
            today = date.today()
            filter_start = start_date or today
            filter_end = end_date or today
            
            # --- Top Stats (Overall status) ---
            # Standardizing role check to case-insensitive or common variants if needed, 
            # but User model default is 'user'
            total_candidates = db.query(User).filter(User.role == "user").count()
            active_papers = db.query(Paper).filter(Paper.is_active).count()
            total_questions = db.query(Question).filter(Question.is_active).count()
            
            # Today's Efforts / Attempts in range
            today_attempts_stat = db.query(InterviewRecord).filter(
                func.date(InterviewRecord.started_at) >= filter_start,
                func.date(InterviewRecord.started_at) <= filter_end
            ).count()
            
            stats = DashboardStats(
                total_candidates=total_candidates,
                active_papers=active_papers,
                total_questions=total_questions,
                today_attempts=today_attempts_stat
            )
            
            # --- Today's Pulse (Filtered by Date Range and Role) ---
            reg_count = db.query(User).filter(
                func.date(User.created_at) >= filter_start,
                func.date(User.created_at) <= filter_end,
                User.role == "user"
            ).count()
            
            reinterviews_count = db.query(UserDetail).join(User, UserDetail.user_id == User.id).filter(
                UserDetail.is_reinterview,
                UserDetail.reinterview_date >= filter_start,
                UserDetail.reinterview_date <= filter_end,
                User.role == "user"
            ).count()
            
            assignments_count = db.query(PaperAssignment).join(User, PaperAssignment.user_id == User.id).filter(
                PaperAssignment.assigned_date >= filter_start,
                PaperAssignment.assigned_date <= filter_end,
                User.role == "user"
            ).count()
            
            attempts_count = db.query(InterviewRecord).filter(
                func.date(InterviewRecord.started_at) >= filter_start,
                func.date(InterviewRecord.started_at) <= filter_end
            ).count()
            
            # Grade Distribution for range submissions
            grade_query = db.query(
                InterviewRecord.overall_grade, 
                func.count(InterviewRecord.id)
            ).filter(
                func.date(InterviewRecord.submitted_at) >= filter_start,
                func.date(InterviewRecord.submitted_at) <= filter_end
            ).group_by(InterviewRecord.overall_grade).all()
            
            grade_map = {str(row[0]).capitalize(): row[1] for row in grade_query if row[0]}
            
            target_grades = ["Excellent", "Good", "Average", "Poor"]
            grade_list = []
            for label in target_grades:
                grade_list.append(GradeCount(label=label, count=grade_map.get(label, 0)))
                
            today_pulse = TodayPulse(
                registrations=reg_count,
                reinterviews=reinterviews_count,
                assignments=assignments_count,
                attempts=attempts_count,
                grades=grade_list
            )
            
            return DashboardOverviewResponse(
                stats=stats,
                today_pulse=today_pulse
            )
            
        finally:
            db.close()
