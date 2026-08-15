import uuid
from sqlalchemy import Column, String, Text, Date, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class RenewalObligation(Base):
    """
    A single trackable item: a renewal deadline or a contractual
    obligation, with a real, queryable due_date -- unlike
    extracted_fields.renewal_terms, which is just a free-text description
    a scheduler can't act on. This table is what Step 4's Celery job will
    scan to find things coming due.

    Many rows per contract (one-to-many), unlike the 1:1 pattern used by
    ContractSummary/RiskAssessment.
    """
    __tablename__ = "renewal_obligations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contract_id = Column(UUID(as_uuid=True), ForeignKey("contracts.id", ondelete="CASCADE"), nullable=False, index=True)

    item_type = Column(String(20), nullable=False)   # "renewal" | "obligation"
    title = Column(String, nullable=False)
    description = Column(Text)

    due_date = Column(Date, nullable=False, index=True)   # indexed -- the scheduler will query/sort on this constantly
    notice_period_days = Column(Integer, nullable=True)   # e.g. 60 -- how far before due_date notice must be given

    is_completed = Column(Boolean, default=False, nullable=False)   # user-managed, NOT touched by regeneration logic

    source_text_hash = Column(String(64), nullable=False)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())

    contract = relationship("Contract", back_populates="renewal_obligations")
    notified_at = Column(DateTime(timezone=True), nullable=True)   # when the user was last notified about this item