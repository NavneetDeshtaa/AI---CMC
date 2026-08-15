"""
Seeds a couple of starter templates. Safe to re-run -- skips any name
that already exists.

Usage (from your backend folder):
    python -m scripts.seed_contract_templates
"""
from app.database import SessionLocal
from app.models.contract_template import ContractTemplate

TEMPLATES = [
    {
        "name": "Standard Service Agreement",
        "contract_type": "service_agreement",
        "description": "A general-purpose services contract between a service provider and a client.",
        "clause_outline": [
            "Parties", "Term", "Scope of Services", "Payment Terms",
            "Limitation of Liability", "Indemnification", "Termination Rights",
            "Confidentiality", "Governing Law", "Dispute Resolution",
        ],
        "generation_instructions": "Use formal but plain business language, not archaic legalese. Keep payment terms balanced between both parties unless the form inputs suggest otherwise.",
    },
    {
        "name": "Mutual Non-Disclosure Agreement",
        "contract_type": "nda",
        "description": "A mutual NDA for two parties exploring a potential business relationship.",
        "clause_outline": [
            "Parties", "Definition of Confidential Information", "Obligations of Receiving Party",
            "Exclusions", "Term", "Governing Law",
        ],
        "generation_instructions": "Keep this concise -- NDAs should be shorter and simpler than full service agreements. Make obligations symmetric between both parties (mutual, not one-sided).",
    },
]


def run():
    db = SessionLocal()
    try:
        created, skipped = 0, 0
        for t in TEMPLATES:
            existing = db.query(ContractTemplate).filter(ContractTemplate.name == t["name"]).first()
            if existing:
                skipped += 1
                continue
            db.add(ContractTemplate(**t))
            created += 1
        db.commit()
        print(f"Done. Created: {created}, Skipped: {skipped}.")
    finally:
        db.close()


if __name__ == "__main__":
    run()