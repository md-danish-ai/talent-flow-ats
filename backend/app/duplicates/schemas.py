from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class NotificationReadRequest(BaseModel):
    notification_ids: List[int]

class DuplicateMatchDetails(BaseModel):
    new_user: Dict[str, Any]
    matched_user: Dict[str, Any]
    scores: Dict[str, float]

class NotificationResponse(BaseModel):
    id: int
    type: str
    reference_id: int
    title: str
    message: str
    is_read: bool
    created_at: datetime
    match_details: Optional[Dict[str, Any]] = None
    final_score: Optional[float] = None

class PaginatedNotificationResponse(BaseModel):
    data: List[NotificationResponse]
    total_records: int
    unread_count: int
    read_count: int
