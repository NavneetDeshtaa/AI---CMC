import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.Summarization.summary_orchestrator import get_or_create_summary

router = APIRouter(prefix="/contracts", tags=["summary"])


class ImportantDate(BaseModel):
    label: str
    date: Optional[str] = None


class SummaryResponse(BaseModel):
    overview: str
    key_obligations: List[str]
    payment_terms: str
    important_dates: List[ImportantDate]
    risks_flagged: List[str]
    generated_at: str

    class Config:
        from_attributes = True


@router.get("/{contract_id}/summary", response_model=SummaryResponse)
def get_summary(contract_id: uuid.UUID, db: Session = Depends(get_db)):
    try:
        summary = get_or_create_summary(db, contract_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return SummaryResponse(
        overview=summary.overview,
        key_obligations=summary.key_obligations or [],
        payment_terms=summary.payment_terms,
        important_dates=summary.important_dates or [],
        risks_flagged=summary.risks_flagged or [],
        generated_at=summary.generated_at.isoformat(),
    )


@router.post("/{contract_id}/summary/regenerate", response_model=SummaryResponse)
def regenerate_summary(contract_id: uuid.UUID, db: Session = Depends(get_db)):
    try:
        summary = get_or_create_summary(db, contract_id, force=True)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return SummaryResponse(
        overview=summary.overview,
        key_obligations=summary.key_obligations or [],
        payment_terms=summary.payment_terms,
        important_dates=summary.important_dates or [],
        risks_flagged=summary.risks_flagged or [],
        generated_at=summary.generated_at.isoformat(),
    )