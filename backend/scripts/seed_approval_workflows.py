"""
Seeds two starter approval workflows. Safe to re-run -- skips any name
that already exists.

Usage (from your backend folder):
    python -m scripts.seed_approval_workflows
"""
from app.database import SessionLocal
from app.models.approval_workflows import ApprovalWorkflow

WORKFLOWS = [
    {
        "name": "Standard Approval",
        "contract_type": "service_agreement",
        "stages": ["Sales", "Manager", "Legal", "Finance", "Signature"],
    },
    {
        "name": "Quick Approval",
        "contract_type": "nda",
        "stages": ["Manager", "Legal"],
    },
]


def run():
    db = SessionLocal()
    try:
        created, skipped = 0, 0
        for w in WORKFLOWS:
            existing = db.query(ApprovalWorkflow).filter(ApprovalWorkflow.name == w["name"]).first()
            if existing:
                skipped += 1
                continue
            db.add(ApprovalWorkflow(**w))
            created += 1
        db.commit()
        print(f"Done. Created: {created}, Skipped: {skipped}.")
    finally:
        db.close()


if __name__ == "__main__":
    run()