import uuid
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class ContractVersion(Base):
    """
    A stored snapshot of a contract's full text at a point in time.
    One-to-many with Contract -- unlike Summary/RiskAssessment, a
    contract can (and will) have many versions over its life.

    version_number is a simple incrementing integer per contract (1, 2,
    3...), not a UUID -- versions have a genuine natural order that
    matters for display and diffing, so a human-readable sequence beats
    an opaque identifier here.
    """
    __tablename__ = "contract_versions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contract_id = Column(UUID(as_uuid=True), ForeignKey("contracts.id", ondelete="CASCADE"), nullable=False, index=True)

    version_number = Column(Integer, nullable=False)
    raw_text = Column(Text, nullable=False)

    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    contract = relationship("Contract", back_populates="versions")