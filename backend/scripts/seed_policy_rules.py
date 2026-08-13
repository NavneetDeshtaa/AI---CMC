"""
Seeds the policy_rules table with a starter set of baseline clause
standards. Safe to re-run -- skips any clause_name that already exists,
so you can add more rules to this list later and re-run without
duplicating what's already there.

Usage (from your backend folder):
    python -m scripts.seed_policy_rules
"""
from app.database import SessionLocal
from app.models.policy_rule import PolicyRule

BASELINE_RULES = [
    {
        "clause_name": "Limitation of Liability",
        "description": "Contract should cap each party's financial liability at a defined amount. Flag as an issue if liability is explicitly unlimited or uncapped.",
        "is_required": True,
        "risk_weight": 25,
    },
    {
        "clause_name": "Indemnification",
        "description": "Contract should include an indemnification clause protecting each party from third-party claims arising from the other party's actions.",
        "is_required": True,
        "risk_weight": 20,
    },
    {
        "clause_name": "Termination Rights",
        "description": "Contract should clearly define conditions under which either party may terminate, and the required notice period.",
        "is_required": True,
        "risk_weight": 15,
    },
    {
        "clause_name": "Payment Terms",
        "description": "Contract should specify a clear payment schedule, amounts, and consequences for late payment.",
        "is_required": True,
        "risk_weight": 15,
    },
    {
        "clause_name": "Governing Law",
        "description": "Contract should specify which jurisdiction's law governs disputes.",
        "is_required": True,
        "risk_weight": 10,
    },
    {
        "clause_name": "Confidentiality",
        "description": "Contract should include confidentiality/non-disclosure obligations protecting sensitive information shared between parties.",
        "is_required": False,
        "risk_weight": 10,
    },
    {
        "clause_name": "Dispute Resolution",
        "description": "Contract should specify how disputes are resolved (e.g. arbitration, mediation) before litigation.",
        "is_required": False,
        "risk_weight": 10,
    },
    {
        "clause_name": "Intellectual Property Ownership",
        "description": "Contract should clearly state who owns any intellectual property created or used under the agreement.",
        "is_required": False,
        "risk_weight": 10,
    },
    {
        "clause_name": "Force Majeure",
        "description": "Contract should excuse performance delays caused by events outside either party's reasonable control.",
        "is_required": False,
        "risk_weight": 5,
    },
    {
        "clause_name": "Assignment Restrictions",
        "description": "Contract should state whether either party may transfer/assign their rights and obligations to a third party.",
        "is_required": False,
        "risk_weight": 5,
    },
]


def run():
    db = SessionLocal()
    try:
        created, skipped = 0, 0
        for rule_data in BASELINE_RULES:
            existing = db.query(PolicyRule).filter(
                PolicyRule.clause_name == rule_data["clause_name"]
            ).first()
            if existing:
                skipped += 1
                continue
            db.add(PolicyRule(**rule_data))
            created += 1

        db.commit()
        print(f"Done. Created: {created}, Skipped (already existed): {skipped}.")
    finally:
        db.close()


if __name__ == "__main__":
    run()