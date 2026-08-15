import uuid
from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.Tracking.orchestrator import get_or_create_obligations, mark_complete, get_upcoming

router = APIRouter(prefix="/contracts", tags=["tracking"])

# Separate top-level path -- avoids the same /contracts/{contract_id}
# collision issue we already hit twice this project.
upcoming_router = APIRouter(prefix="/obligations", tags=["tracking"])


class ObligationResponse(BaseModel):
    id: uuid.UUID
    contract_id: uuid.UUID
    item_type: str
    title: str
    description: Optional[str] = None
    due_date: date
    notice_period_days: Optional[int] = None
    is_completed: bool

    class Config:
        from_attributes = True


@router.get("/{contract_id}/obligations", response_model=List[ObligationResponse])
def get_obligations(contract_id: uuid.UUID, db: Session = Depends(get_db)):
    try:
        return get_or_create_obligations(db, contract_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{contract_id}/obligations/regenerate", response_model=List[ObligationResponse])
def regenerate_obligations(contract_id: uuid.UUID, db: Session = Depends(get_db)):
    try:
        return get_or_create_obligations(db, contract_id, force=True)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.patch("/{contract_id}/obligations/{obligation_id}/complete", response_model=ObligationResponse)
def complete_obligation(contract_id: uuid.UUID, obligation_id: uuid.UUID, db: Session = Depends(get_db)):
    try:
        return mark_complete(db, obligation_id, completed=True)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@upcoming_router.get("", response_model=List[ObligationResponse])
def list_upcoming(days: int = 30, db: Session = Depends(get_db)):
    return get_upcoming(db, days=days)