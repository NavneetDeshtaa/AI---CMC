from datetime import date
from dateutil.relativedelta import relativedelta
from sqlalchemy.orm import Session

from app.models.contract import Contract, ContractStatus
from app.models.extracted_fields import ExtractedFields
from app.models.contract_template import ContractTemplate
from app.services.Draft_Generation.generator import generate_draft_text


def create_draft_contract(db: Session, request, user_id) -> Contract:
    """
    Full draft generation flow: load the template, generate contract text,
    then save it as a normal Contract row (source='generated') with
    ExtractedFields populated directly from the form inputs -- these are
    already known with certainty (you specified them), so there's no
    reason to burn a second LLM call re-extracting facts you just decided.
    """
    template = (
        db.query(ContractTemplate)
        .filter(ContractTemplate.id == request.template_id, ContractTemplate.active == True)  # noqa: E712
        .first()
    )
    if template is None:
        raise ValueError(f"Template {request.template_id} not found or inactive")

    effective_date = date.today()
    expiry_date = effective_date + relativedelta(months=request.duration_months)

    inputs = {
        "our_company_name": request.our_company_name,
        "customer_name": request.customer_name,
        "value": request.value,
        "currency": request.currency,
        "effective_date": effective_date.isoformat(),
        "expiry_date": expiry_date.isoformat(),
        "jurisdiction": request.jurisdiction,
        "additional_instructions": request.additional_instructions,
    }

    draft_text = generate_draft_text(template, inputs)

    contract = Contract(
        file_name=f"{template.name} - {request.customer_name}.txt",
        file_path=None,          # no physical file -- this contract was never uploaded
        uploaded_by=user_id,
        status=ContractStatus.extracted,   # generation IS the extraction, nothing left pending
        source="generated",
        raw_text=draft_text,
    )
    db.add(contract)
    db.flush()  # assigns contract.id without committing yet, so ExtractedFields can reference it

    extracted = ExtractedFields(
        contract_id=contract.id,
        parties=[request.our_company_name, request.customer_name],
        effective_date=effective_date,
        expiry_date=expiry_date,
        value=request.value,
        currency=request.currency,
        governing_law=request.jurisdiction,
        renewal_terms=None,
        key_clauses=template.clause_outline,
    )
    db.add(extracted)

    db.commit()
    db.refresh(contract)
    return contract