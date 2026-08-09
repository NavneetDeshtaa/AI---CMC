import hashlib
import json
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.contract import Contract
from app.models.contract_summary import ContractSummary
from app.services.summarizer import generate_summary_content


def _hash_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def get_or_create_summary(db: Session, contract_id, force: bool = False) -> ContractSummary:
    """
    Returns a cached summary if one exists and the contract's raw_text
    hasn't changed since it was generated. Regenerates when:
      - no summary exists yet, OR
      - the stored source_text_hash no longer matches raw_text's current
        hash (meaning the underlying text changed), OR
      - force=True (manual "Regenerate" button)

    This ties cache invalidation to actual content change rather than a
    timer, since contracts don't currently have any edit/re-upload flow --
    there's nothing for a time-based check to meaningfully catch that a
    hash check wouldn't catch immediately and for free.
    """
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if contract is None:
        raise ValueError(f"Contract {contract_id} not found")
    if not contract.raw_text or not contract.raw_text.strip():
        raise ValueError(f"Contract {contract_id} has no raw_text to summarize")

    current_hash = _hash_text(contract.raw_text)
    existing = db.query(ContractSummary).filter(ContractSummary.contract_id == contract_id).first()

    if existing and not force and existing.source_text_hash == current_hash:
        return existing  # cache hit, no LLM call

    extracted_json = "{}"
    if contract.extracted_fields:
        ef = contract.extracted_fields
        extracted_json = json.dumps({
            "parties": ef.parties,
            "effective_date": str(ef.effective_date) if ef.effective_date else None,
            "expiry_date": str(ef.expiry_date) if ef.expiry_date else None,
            "value": float(ef.value) if ef.value else None,
            "currency": ef.currency,
            "governing_law": ef.governing_law,
        })

    content = generate_summary_content(contract.raw_text, extracted_json)

    if existing:
        existing.overview = content.get("overview", "")
        existing.key_obligations = content.get("key_obligations", [])
        existing.payment_terms = content.get("payment_terms", "Not specified")
        existing.important_dates = content.get("important_dates", [])
        existing.risks_flagged = content.get("risks_flagged", [])
        existing.source_text_hash = current_hash
        existing.generated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(existing)
        return existing

    summary = ContractSummary(
        contract_id=contract_id,
        overview=content.get("overview", ""),
        key_obligations=content.get("key_obligations", []),
        payment_terms=content.get("payment_terms", "Not specified"),
        important_dates=content.get("important_dates", []),
        risks_flagged=content.get("risks_flagged", []),
        source_text_hash=current_hash,
    )
    db.add(summary)
    db.commit()
    db.refresh(summary)
    return summary