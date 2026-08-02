import uuid
from sqlalchemy import Column, String, Numeric, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base

class ExtractedFields(Base):
    __tablename__ = "extracted_fields"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contract_id = Column(UUID(as_uuid=True), ForeignKey("contracts.id"), unique=True, nullable=False)

    parties = Column(JSONB)              # ["Acme Corp", "Your Company"]
    effective_date = Column(Date)
    expiry_date = Column(Date)
    value = Column(Numeric(14, 2))
    currency = Column(String(10))
    governing_law = Column(String)
    renewal_terms = Column(String)
    key_clauses = Column(JSONB)          # ["Indemnification", "Confidentiality"]

    contract = relationship("Contract", back_populates="extracted_fields")