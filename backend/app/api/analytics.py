from typing import List
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.Analytics.aggregations import (
    get_status_breakdown,
    get_volume_over_time,
    get_expiry_timeline,
    get_value_distribution,
    get_risk_distribution,
)

router = APIRouter(prefix="/analytics", tags=["analytics"])


class StatusCount(BaseModel):
    status: str
    count: int


class MonthCount(BaseModel):
    month: str
    count: int


class BucketCount(BaseModel):
    bucket: str
    count: int


class RiskLevelCount(BaseModel):
    level: str
    count: int


class AnalyticsSummary(BaseModel):
    total_contracts: int
    status_breakdown: List[StatusCount]
    volume_over_time: List[MonthCount]
    expiry_timeline: List[MonthCount]
    value_distribution: List[BucketCount]
    risk_distribution: List[RiskLevelCount]


@router.get("/summary", response_model=AnalyticsSummary)
def get_analytics_summary(db: Session = Depends(get_db)):
    status_breakdown = get_status_breakdown(db)
    return AnalyticsSummary(
        total_contracts=sum(s["count"] for s in status_breakdown),
        status_breakdown=status_breakdown,
        volume_over_time=get_volume_over_time(db),
        expiry_timeline=get_expiry_timeline(db),
        value_distribution=get_value_distribution(db),
        risk_distribution=get_risk_distribution(db),
    )