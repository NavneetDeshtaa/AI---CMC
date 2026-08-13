import uuid
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class RiskAssessment(Base):
    """
    The stored output of the Step 2 risk pipeline for one contract. Same
    pattern as ContractSummary: unique per contract, hash-based cache
    invalidation (source_text_hash), explicit generated_at set on both
    insert AND update (learned that lesson the hard way with summaries).
    """
    __tablename__ = "risk_assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contract_id = Column(UUID(as_uuid=True), ForeignKey("contracts.id", ondelete="CASCADE"), unique=True, nullable=False)

    risk_score = Column(Integer, nullable=False)      # 0-100, higher = riskier
    risk_level = Column(String(10), nullable=False)   # "low" | "medium" | "high"

    # [{"clause": "Limitation of Liability", "issue": "Uncapped liability for Party A", "severity": "high"}, ...]
    flagged_clauses = Column(JSONB)

    # [{"clause": "Indemnification", "why_it_matters": "No protection if a third party sues over this agreement"}, ...]
    missing_clauses = Column(JSONB)

    explanation = Column(Text, nullable=False)   # plain-English overall summary of findings

    source_text_hash = Column(String(64), nullable=False)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())

    contract = relationship("Contract", back_populates="risk_assessment")