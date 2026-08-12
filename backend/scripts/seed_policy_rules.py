"""
Manage policy_rules as code. Edit RULES below, then run:

    python -m scripts.seed_policy_rules

Behavior:
- Rules in this list are upserted (matched on rule_code).
- Rules that exist in the DB but are NOT in this list are soft-deactivated
  (active=False), not deleted, so historical risk assessments referencing
  their rule_code stay meaningful.
- Pass --prune to hard-delete DB rules missing from this list instead.
- Pass --dry-run to see planned changes without writing.
"""
import argparse
import sys
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.policy_rule import PolicyRule

# ---------------------------------------------------------------------------
# EDIT THIS LIST to add / update / remove policy rules.
# To remove a rule: delete its entry here, then run this script normally
# (it will be soft-deactivated) or with --prune (hard delete).
# ---------------------------------------------------------------------------
RULES = [
    {
        "rule_code": "LIABILITY_CAP_MISSING",
        "category": "liability",
        "rule_type": "required_clause",
        "severity": "high",
        "title": "Missing liability cap",
        "description": "The contract does not specify a maximum cap on liability, exposing either party to unbounded financial risk.",
        "check_config": {"field": "liability_cap_clause"},
    },
    {
        "rule_code": "UNLIMITED_LIABILITY_LANGUAGE",
        "category": "liability",
        "rule_type": "forbidden_term",
        "severity": "critical",
        "title": "Unlimited liability language detected",
        "description": "The contract contains language indicating unlimited or uncapped liability for one or both parties.",
        "check_config": {"keywords": ["unlimited liability", "uncapped liability", "without limitation as to liability"]},
    },
    {
        "rule_code": "TERMINATION_CLAUSE_MISSING",
        "category": "termination",
        "rule_type": "required_clause",
        "severity": "high",
        "title": "Missing termination clause",
        "description": "The contract does not clearly define the conditions under which either party may terminate the agreement.",
        "check_config": {"field": "termination_clause"},
    },
    {
        "rule_code": "NOTICE_PERIOD_TOO_SHORT",
        "category": "termination",
        "rule_type": "threshold_numeric",
        "severity": "medium",
        "title": "Notice period below recommended minimum",
        "description": "The termination notice period is shorter than the recommended 30-day minimum, giving insufficient time to react.",
        "check_config": {"field": "notice_period_days", "operator": "<", "value": 30},
    },
    {
        "rule_code": "PAYMENT_TERMS_EXCESSIVE",
        "category": "payment",
        "rule_type": "threshold_numeric",
        "severity": "medium",
        "title": "Payment terms exceed standard range",
        "description": "Payment terms extend beyond the commonly accepted 60-day window, which can strain cash flow.",
        "check_config": {"field": "payment_terms_days", "operator": ">", "value": 60},
    },
    {
        "rule_code": "LATE_PAYMENT_TERMS_MISSING",
        "category": "payment",
        "rule_type": "required_clause",
        "severity": "low",
        "title": "No late-payment penalty clause",
        "description": "The contract does not specify penalties or interest for late payment, weakening enforcement of payment terms.",
        "check_config": {"field": "late_payment_clause"},
    },
    {
        "rule_code": "INDEMNIFICATION_CLAUSE_MISSING",
        "category": "indemnification",
        "rule_type": "required_clause",
        "severity": "high",
        "title": "Missing indemnification clause",
        "description": "The contract lacks an indemnification clause, leaving a party unprotected against third-party claims arising from the other party's actions.",
        "check_config": {"field": "indemnification_clause"},
    },
    {
        "rule_code": "ONE_SIDED_INDEMNIFICATION",
        "category": "indemnification",
        "rule_type": "forbidden_term",
        "severity": "medium",
        "title": "One-sided indemnification language",
        "description": "Indemnification language appears to obligate only one party, which is atypical for balanced commercial agreements.",
        "check_config": {"keywords": ["shall indemnify and hold harmless [company] only", "sole indemnification obligation"]},
    },
    {
        "rule_code": "CONFIDENTIALITY_CLAUSE_MISSING",
        "category": "confidentiality",
        "rule_type": "required_clause",
        "severity": "high",
        "title": "Missing confidentiality clause",
        "description": "The contract does not include confidentiality or non-disclosure provisions to protect sensitive information exchanged.",
        "check_config": {"field": "confidentiality_clause"},
    },
    {
        "rule_code": "CONFIDENTIALITY_TERM_UNDEFINED",
        "category": "confidentiality",
        "rule_type": "forbidden_term",
        "severity": "low",
        "title": "Confidentiality obligation has no defined duration",
        "description": "Confidentiality language does not specify how long obligations survive after termination.",
        "check_config": {"keywords": ["confidentiality obligations shall survive indefinitely with no defined term"]},
    },
    {
        "rule_code": "GOVERNING_LAW_MISSING",
        "category": "governing_law",
        "rule_type": "required_clause",
        "severity": "medium",
        "title": "Missing governing law clause",
        "description": "The contract does not specify which jurisdiction's laws govern the agreement, creating ambiguity in disputes.",
        "check_config": {"field": "governing_law"},
    },
    {
        "rule_code": "AUTO_RENEWAL_NO_OPT_OUT",
        "category": "renewal",
        "rule_type": "forbidden_term",
        "severity": "medium",
        "title": "Auto-renewal without clear opt-out mechanism",
        "description": "The contract auto-renews but does not clearly define how or when a party can opt out before the next term.",
        "check_config": {"keywords": ["automatically renew", "auto-renewal"], "requires_absence_of_field": "renewal_opt_out_clause"},
    },
    {
        "rule_code": "RENEWAL_NOTICE_WINDOW_SHORT",
        "category": "renewal",
        "rule_type": "threshold_numeric",
        "severity": "low",
        "title": "Renewal opt-out window is narrow",
        "description": "The window to opt out of auto-renewal is shorter than the recommended 30-day minimum.",
        "check_config": {"field": "renewal_notice_days", "operator": "<", "value": 30},
    },
    {
        "rule_code": "DISPUTE_RESOLUTION_MISSING",
        "category": "dispute_resolution",
        "rule_type": "required_clause",
        "severity": "medium",
        "title": "Missing dispute resolution mechanism",
        "description": "The contract does not specify a mechanism (arbitration, mediation, litigation venue) for resolving disputes.",
        "check_config": {"field": "dispute_resolution_clause"},
    },
    {
        "rule_code": "FORCE_MAJEURE_MISSING",
        "category": "force_majeure",
        "rule_type": "required_clause",
        "severity": "medium",
        "title": "Missing force majeure clause",
        "description": "The contract does not address obligations in the event of events beyond either party's reasonable control.",
        "check_config": {"field": "force_majeure_clause"},
    },
    {
        "rule_code": "IP_ASSIGNMENT_UNCLEAR",
        "category": "intellectual_property",
        "rule_type": "required_clause",
        "severity": "high",
        "title": "Unclear IP ownership/assignment terms",
        "description": "The contract does not clearly define who owns intellectual property created or used during the engagement.",
        "check_config": {"field": "ip_assignment_clause"},
    },
    {
        "rule_code": "DATA_PROTECTION_CLAUSE_MISSING",
        "category": "data_protection",
        "rule_type": "required_clause",
        "severity": "high",
        "title": "Missing data protection/processing clause",
        "description": "For a contract involving data handling, no clause addresses data protection obligations or compliance (e.g. GDPR-style terms).",
        "check_config": {"field": "data_protection_clause"},
    },
    {
        "rule_code": "INSURANCE_REQUIREMENT_MISSING",
        "category": "insurance",
        "rule_type": "required_clause",
        "severity": "low",
        "title": "No insurance requirement specified",
        "description": "The contract does not require either party to maintain insurance coverage relevant to the engagement.",
        "check_config": {"field": "insurance_clause"},
    },
    {
        "rule_code": "WARRANTY_DISCLAIMER_MISSING",
        "category": "warranty",
        "rule_type": "required_clause",
        "severity": "low",
        "title": "No warranty terms specified",
        "description": "The contract does not specify warranty terms or disclaimers, leaving expectations around product/service quality undefined.",
        "check_config": {"field": "warranty_clause"},
    },
    {
        "rule_code": "CONTRACT_VALUE_MISSING",
        "category": "commercial",
        "rule_type": "required_clause",
        "severity": "medium",
        "title": "Contract value not specified",
        "description": "The contract does not clearly state the total value or fee structure of the engagement.",
        "check_config": {"field": "contract_value"},
    },
]


def run(dry_run: bool = False, prune: bool = False) -> None:
    db: Session = SessionLocal()
    try:
        defined_codes = {r["rule_code"] for r in RULES}
        existing = {r.rule_code: r for r in db.query(PolicyRule).all()}

        created, updated, deactivated, deleted = 0, 0, 0, 0

        for rule_data in RULES:
            code = rule_data["rule_code"]
            if code in existing:
                row = existing[code]
                changed = any(getattr(row, k) != v for k, v in rule_data.items() if k != "rule_code")
                if changed or not row.active:
                    print(f"[update]   {code}")
                    if not dry_run:
                        for k, v in rule_data.items():
                            setattr(row, k, v)
                        row.active = True
                    updated += 1
            else:
                print(f"[create]   {code}")
                if not dry_run:
                    db.add(PolicyRule(active=True, **rule_data))
                created += 1

        for code, row in existing.items():
            if code not in defined_codes:
                if prune:
                    print(f"[delete]   {code}")
                    if not dry_run:
                        db.delete(row)
                    deleted += 1
                elif row.active:
                    print(f"[deactivate] {code}")
                    if not dry_run:
                        row.active = False
                    deactivated += 1

        if dry_run:
            print("\nDry run — no changes written.")
            db.rollback()
        else:
            db.commit()

        print(f"\nDone. created={created} updated={updated} deactivated={deactivated} deleted={deleted}")

    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Show planned changes without writing to DB")
    parser.add_argument("--prune", action="store_true", help="Hard-delete rules missing from RULES instead of deactivating")
    args = parser.parse_args()
    run(dry_run=args.dry_run, prune=args.prune)