from pydantic import BaseModel
from typing import List

class GradeCount(BaseModel):
    label: str
    count: int

class TodayPulse(BaseModel):
    registrations: int
    reinterviews: int
    assignments: int
    attempts: int
    grades: List[GradeCount]

class DashboardStats(BaseModel):
    total_candidates: int
    active_papers: int
    total_questions: int
    today_attempts: int

class DashboardOverviewResponse(BaseModel):
    stats: DashboardStats
    today_pulse: TodayPulse
