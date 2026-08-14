import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.Risk.orchestrator import get_or_create_risk_assessment

router = APIRouter(prefix="/contracts", tags=["risk"])

class FlaggedClause(BaseModel):
    clause: str
    issue: str
    severity: str

class MissingClause(BaseModel):
    clause: str
    why_it_matters: str

class RiskResponse(BaseModel):
    risk_score: int
    risk_level: str
    flagged_clauses: List[FlaggedClause]
    missing_clauses: List[MissingClause]
    explanation: str
    generated_at: str


def _to_response(a) -> RiskResponse:
    return RiskResponse(
        risk_score=a.risk_score,
        risk_level=a.risk_level,
        flagged_clauses=a.flagged_clauses or [],
        missing_clauses=a.missing_clauses or [],
        explanation=a.explanation,
        generated_at=a.generated_at.isoformat(),
    )


@router.get("/{contract_id}/risk", response_model=RiskResponse)
def get_risk(contract_id: uuid.UUID, db: Session = Depends(get_db)):
    try:
        assessment = get_or_create_risk_assessment(db, contract_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return _to_response(assessment)


@router.post("/{contract_id}/risk/regenerate", response_model=RiskResponse)
def regenerate_risk(contract_id: uuid.UUID, db: Session = Depends(get_db)):
    try:
        assessment = get_or_create_risk_assessment(db, contract_id, force=True)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return _to_response(assessment)