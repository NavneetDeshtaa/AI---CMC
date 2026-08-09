import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class ContractSummary(Base):
    __tablename__ = "contract_summaries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contract_id = Column(UUID(as_uuid=True), ForeignKey("contracts.id", ondelete="CASCADE"), unique=True, nullable=False)

    overview = Column(Text, nullable=False)
    key_obligations = Column(JSONB)      # ["Vendor must deliver goods within 30 days", ...]
    payment_terms = Column(Text)
    important_dates = Column(JSONB)      # [{"label": "Renewal deadline", "date": "2026-03-01"}, ...]
    risks_flagged = Column(JSONB)        # ["No indemnification clause found", ...]

    # sha256 of the raw_text this summary was generated from. If raw_text
    # ever changes (re-extraction, future edit/version flow), this won't
    # match anymore -- that mismatch is the trigger to regenerate, instead
    # of an arbitrary timer.
    source_text_hash = Column(String(64), nullable=False)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())

    contract = relationship("Contract", back_populates="summary")