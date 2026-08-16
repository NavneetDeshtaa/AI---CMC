import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.notification import Notification
from app.services.Notifications.orchestrator import check_and_notify_upcoming

router = APIRouter(prefix="/notifications", tags=["notifications"])


class NotificationResponse(BaseModel):
    id: uuid.UUID
    title: str
    message: str
    is_read: bool
    contract_id: Optional[uuid.UUID] = None
    created_at: str
    email_sent: bool

    class Config:
        from_attributes = True


def _to_response(n: Notification) -> NotificationResponse:
    return NotificationResponse(
        id=n.id, title=n.title, message=n.message, is_read=n.is_read,
        contract_id=n.contract_id, created_at=n.created_at.isoformat(),email_sent=n.email_sent,
    )


@router.get("", response_model=List[NotificationResponse])
def list_notifications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rows = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .all()
    )
    return [_to_response(n) for n in rows]


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_read(notification_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    n = (
        db.query(Notification)
        .filter(Notification.id == notification_id, Notification.user_id == current_user.id)
        .first()
    )
    if n is None:
        raise HTTPException(status_code=404, detail="Notification not found")
    n.is_read = True
    db.commit()
    db.refresh(n)
    return _to_response(n)


@router.post("/check-now")
def trigger_check_now(days: int = 30, db: Session = Depends(get_db)):
    """
    Manual trigger for testing -- runs the check SYNCHRONOUSLY, right now,
    inside this HTTP request, instead of waiting for Celery Beat's daily
    9am schedule. Useful during development; not something you'd expose
    to end users in a real product without auth/rate-limiting on it.
    """
    count = check_and_notify_upcoming(db, days=days)
    return {"notifications_created": count}