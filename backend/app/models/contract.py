import uuid
import enum
from sqlalchemy import Column, String, Enum, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class ContractStatus(str, enum.Enum):
    uploaded = "uploaded"
    processing = "processing"
    extracted = "extracted"
    failed = "failed"

class Contract(Base):
    __tablename__ = "contracts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status = Column(Enum(ContractStatus), default=ContractStatus.uploaded, nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    uploader = relationship("User")
    extracted_fields = relationship(
        "ExtractedFields", back_populates="contract", uselist=False, cascade="all, delete-orphan"
    )