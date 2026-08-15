import hashlib
from datetime import date, datetime
from sqlalchemy.orm import Session

from app.models.contract import Contract
from app.models.renewal_obligation import RenewalObligation
from app.services.Tracking.obligation_extraction import extract_obligations


def _hash_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def get_or_create_obligations(db: Session, contract_id, force: bool = False) -> list[RenewalObligation]:
    """
    Same hash-based caching idea as summary/risk, with one important
    difference: on a cache miss, this DELETES and RECREATES every item
    for the contract, including any the user had marked is_completed.
    That's an accepted trade-off for now -- regeneration is rare (only
    needed if raw_text genuinely changes), and this table is mostly
    populated once, right after a contract's text becomes available, then
    left alone while users check items off.
    """
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if contract is None:
        raise ValueError(f"Contract {contract_id} not found")
    if not contract.raw_text or not contract.raw_text.strip():
        raise ValueError(f"Contract {contract_id} has no raw_text to analyze")

    current_hash = _hash_text(contract.raw_text)
    existing = db.query(RenewalObligation).filter(RenewalObligation.contract_id == contract_id).all()

    if existing and not force and existing[0].source_text_hash == current_hash:
        return existing  # cache hit, no LLM call

    fields = contract.extracted_fields
    effective_date = fields.effective_date if fields else None
    expiry_date = fields.expiry_date if fields else None
    renewal_terms = fields.renewal_terms if fields else None

    raw_items = extract_obligations(contract.raw_text, effective_date, expiry_date, renewal_terms)

    # Wipe existing rows (including any completed ones -- the documented trade-off).
    for item in existing:
        db.delete(item)
    db.flush()

    new_items = []
    for item in raw_items:
        due_date_str = item.get("due_date")
        if not due_date_str:
            continue  # skip anything without a concrete date -- unusable by the scheduler
        try:
            due_date = datetime.strptime(due_date_str, "%Y-%m-%d").date()
        except ValueError:
            continue  # skip malformed dates rather than failing the whole batch

        obligation = RenewalObligation(
            contract_id=contract_id,
            item_type=item.get("item_type", "obligation"),
            title=item.get("title", "Untitled"),
            description=item.get("description", ""),
            due_date=due_date,
            notice_period_days=item.get("notice_period_days"),
            source_text_hash=current_hash,
        )
        db.add(obligation)
        new_items.append(obligation)

    db.commit()
    for item in new_items:
        db.refresh(item)
    return new_items


def mark_complete(db: Session, obligation_id, completed: bool = True) -> RenewalObligation:
    obligation = db.query(RenewalObligation).filter(RenewalObligation.id == obligation_id).first()
    if obligation is None:
        raise ValueError(f"Obligation {obligation_id} not found")
    obligation.is_completed = completed
    db.commit()
    db.refresh(obligation)
    return obligation


def get_upcoming(db: Session, days: int = 30) -> list[RenewalObligation]:
    """
    Cross-contract query: everything due within the next N days, not yet
    completed. This is what Step 4's scheduled job and Step 5's dashboard
    'renewing in 30 days' card both query.
    """
    from datetime import timedelta
    cutoff = date.today() + timedelta(days=days)
    return (
        db.query(RenewalObligation)
        .filter(RenewalObligation.due_date <= cutoff)
        .filter(RenewalObligation.due_date >= date.today())
        .filter(RenewalObligation.is_completed == False)  # noqa: E712
        .order_by(RenewalObligation.due_date)
        .all()
    )