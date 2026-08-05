from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.database import get_db
from app.models.contract import Contract, ContractStatus
from app.models.extracted_fields import ExtractedFields
from app.models.user import User
from app.schemas.contract import ContractOut
from app.api.deps import get_current_user
from app.core.storage import save_file
from app.services.text_extraction import extract_contract_text
from app.services.extraction_pipeline import call_grok_extraction

router = APIRouter(prefix="/contracts", tags=["contracts"])

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx"}


@router.post("/upload", response_model=ContractOut)
async def upload_contract(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ext = "." + file.filename.split(".")[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only PDF and Word files are allowed")

    file_bytes = await file.read()
    file_path = save_file(file_bytes, file.filename)

    contract = Contract(
        file_name=file.filename,
        file_path=file_path,
        uploaded_by=current_user.id,
        status=ContractStatus.uploaded,
    )
    db.add(contract)
    db.commit()
    db.refresh(contract)

    # --- Run extraction synchronously (Phase 1 scope; Celery comes in Phase 4) ---
    contract.status = ContractStatus.processing
    db.commit()

    try:
        contract_text = extract_contract_text(file_path)

        if not contract_text or len(contract_text) < 20:
            raise ValueError("No extractable text found in document")

        extracted_data = call_grok_extraction(contract_text)

        extracted_fields = ExtractedFields(
            contract_id=contract.id,
            parties=extracted_data.get("parties"),
            effective_date=extracted_data.get("effective_date"),
            expiry_date=extracted_data.get("expiry_date"),
            value=extracted_data.get("value"),
            currency=extracted_data.get("currency"),
            governing_law=extracted_data.get("governing_law"),
            renewal_terms=extracted_data.get("renewal_terms"),
            key_clauses=extracted_data.get("key_clauses"),
        )
        db.add(extracted_fields)
        contract.status = ContractStatus.extracted

    except Exception as e:
        contract.status = ContractStatus.failed
        print(f"Extraction failed for contract {contract.id}: {e}")

    db.commit()
    db.refresh(contract)

    return contract


@router.get("", response_model=List[ContractOut])
def list_contracts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contracts = (
        db.query(Contract)
        .options(joinedload(Contract.extracted_fields))
        .order_by(Contract.uploaded_at.desc())
        .all()
    )
    return contracts


@router.get("/{contract_id}", response_model=ContractOut)
def get_contract(
    contract_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contract = (
        db.query(Contract)
        .options(joinedload(Contract.extracted_fields))
        .filter(Contract.id == contract_id)
        .first()
    )
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    return contract