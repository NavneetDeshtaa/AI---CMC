import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.contract_template import ContractTemplate
from app.services.Draft_Generation.orchestrator import create_draft_contract

router = APIRouter(prefix="/contracts", tags=["drafts"])


class TemplateResponse(BaseModel):
    id: uuid.UUID
    name: str
    contract_type: str
    description: Optional[str] = None
    clause_outline: List[str]

    class Config:
        from_attributes = True


class DraftGenerationRequest(BaseModel):
    template_id: uuid.UUID
    customer_name: str
    our_company_name: str = "Our Company"
    value: Optional[float] = None
    currency: str = "USD"
    duration_months: int = 12
    jurisdiction: str
    additional_instructions: Optional[str] = None


class DraftGenerationResponse(BaseModel):
    id: uuid.UUID
    file_name: str
    status: str
    source: str

    class Config:
        from_attributes = True


@router.get("/templates", response_model=List[TemplateResponse])
def list_templates(db: Session = Depends(get_db)):
    return db.query(ContractTemplate).filter(ContractTemplate.active == True).all()  # noqa: E712


@router.post("/generate", response_model=DraftGenerationResponse)
def generate_draft(
    request: DraftGenerationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        contract = create_draft_contract(db, request, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return contract