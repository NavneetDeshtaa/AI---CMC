from datetime import date
from sqlalchemy import func, case
from sqlalchemy.orm import Session

from app.models.contract import Contract
from app.models.extracted_fields import ExtractedFields
from app.models.risk_assessment import RiskAssessment


def get_status_breakdown(db: Session) -> list[dict]:
    """Contract count grouped by status (uploaded/processing/extracted/failed)."""
    rows = (
        db.query(Contract.status, func.count(Contract.id))
        .group_by(Contract.status)
        .all()
    )
    return [{"status": status, "count": count} for status, count in rows]


def get_volume_over_time(db: Session) -> list[dict]:
    """
    Contracts uploaded per month, all-time, sorted chronologically.
    to_char is Postgres-specific -- fine here since that's what we're on.
    """
    month = func.to_char(Contract.uploaded_at, "YYYY-MM").label("month")
    rows = (
        db.query(month, func.count(Contract.id))
        .group_by(month)
        .order_by(month)
        .all()
    )
    return [{"month": m, "count": c} for m, c in rows]


def get_expiry_timeline(db: Session) -> list[dict]:
    """
    Contracts expiring per month, looking forward only (today onward) --
    past expiries aren't useful on a forward-looking dashboard.
    """
    month = func.to_char(ExtractedFields.expiry_date, "YYYY-MM").label("month")
    rows = (
        db.query(month, func.count(ExtractedFields.id))
        .filter(ExtractedFields.expiry_date >= date.today())
        .group_by(month)
        .order_by(month)
        .all()
    )
    return [{"month": m, "count": c} for m, c in rows]


def get_value_distribution(db: Session) -> list[dict]:
    """
    Buckets contract value into ranges. Bucket boundaries are a reasonable
    general default -- adjust them once you see what your real contract
    values actually look like.
    """
    bucket = case(
        (ExtractedFields.value < 10_000, "< 10K"),
        (ExtractedFields.value < 50_000, "10K - 50K"),
        (ExtractedFields.value < 100_000, "50K - 100K"),
        (ExtractedFields.value < 500_000, "100K - 500K"),
        else_="500K+",
    ).label("bucket")

    rows = (
        db.query(bucket, func.count(ExtractedFields.id))
        .filter(ExtractedFields.value.isnot(None))
        .group_by(bucket)
        .all()
    )
    return [{"bucket": b, "count": c} for b, c in rows]


def get_risk_distribution(db: Session) -> list[dict]:
    """
    Risk level breakdown, including a 'not_analyzed' bucket for contracts
    that don't have a RiskAssessment yet -- so the chart reflects the
    TRUE state of your portfolio, not just the analyzed subset.
    """
    total_contracts = db.query(func.count(Contract.id)).scalar()

    rows = (
        db.query(RiskAssessment.risk_level, func.count(RiskAssessment.id))
        .group_by(RiskAssessment.risk_level)
        .all()
    )
    result = [{"level": level, "count": count} for level, count in rows]

    analyzed_count = sum(r["count"] for r in result)
    not_analyzed = total_contracts - analyzed_count
    if not_analyzed > 0:
        result.append({"level": "not_analyzed", "count": not_analyzed})

    return result