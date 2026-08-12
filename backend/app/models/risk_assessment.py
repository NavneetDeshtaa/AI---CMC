import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.database import Base


class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contract_id = Column(UUID(as_uuid=True), ForeignKey("contracts.id", ondelete="CASCADE"),
                          nullable=False, unique=True, index=True)
    content_hash = Column(String, nullable=False)

    overall_risk_score = Column(Float, nullable=False)   # 0-100
    risk_level = Column(String, nullable=False)           # low | medium | high | critical

    flagged_issues = Column(JSONB, nullable=False, default=list)
    # each item: {rule_code, category, severity, title, explanation, evidence}

    summary_explanation = Column(String, nullable=True)

    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())