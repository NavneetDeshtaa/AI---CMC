import hashlib
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.contract import Contract
from app.models.policy_rule import PolicyRule
from app.models.risk_assessment import RiskAssessment
from app.services.Risk.graph import risk_graph


def _hash_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def get_or_create_risk_assessment(db: Session, contract_id, force: bool = False) -> RiskAssessment:
    """
    Same content-hash caching pattern as get_or_create_summary in Phase 2 --
    regenerate only when raw_text changed or force=True, not on a timer.
    """
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if contract is None:
        raise ValueError(f"Contract {contract_id} not found")
    if not contract.raw_text or not contract.raw_text.strip():
        raise ValueError(f"Contract {contract_id} has no raw_text to analyze")

    current_hash = _hash_text(contract.raw_text)
    existing = db.query(RiskAssessment).filter(RiskAssessment.contract_id == contract_id).first()

    if existing and not force and existing.source_text_hash == current_hash:
        return existing  # cache hit, no LLM calls, graph never runs

    policy_rules = db.query(PolicyRule).filter(PolicyRule.active == True).all()  # noqa: E712
    policy_rules_data = [
        {"clause_name": r.clause_name, "description": r.description, "is_required": r.is_required, "risk_weight": r.risk_weight}
        for r in policy_rules
    ]

    # This is the actual pipeline run -- .invoke() executes every node in
    # order, threading the state through extraction -> comparison ->
    # scoring -> explanation, and returns the final accumulated state.
    initial_state = {
        "contract_id": str(contract_id),
        "raw_text": contract.raw_text,
        "policy_rules": policy_rules_data,
    }
    final_state = risk_graph.invoke(initial_state)

    if existing:
        existing.risk_score = final_state["risk_score"]
        existing.risk_level = final_state["risk_level"]
        existing.flagged_clauses = final_state["flagged_clauses"]
        existing.missing_clauses = final_state["missing_clauses"]
        existing.explanation = final_state["explanation"]
        existing.source_text_hash = current_hash
        existing.generated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(existing)
        return existing

    assessment = RiskAssessment(
        contract_id=contract_id,
        risk_score=final_state["risk_score"],
        risk_level=final_state["risk_level"],
        flagged_clauses=final_state["flagged_clauses"],
        missing_clauses=final_state["missing_clauses"],
        explanation=final_state["explanation"],
        source_text_hash=current_hash,
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment