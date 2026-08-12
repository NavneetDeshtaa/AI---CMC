import uuid
from sqlalchemy import Column, String, Boolean, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.database import Base


class PolicyRule(Base):
    __tablename__ = "policy_rules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    rule_code = Column(String, unique=True, nullable=False, index=True)
    category = Column(String, nullable=False, index=True)
    rule_type = Column(String, nullable=False)  # required_clause | forbidden_term | threshold_numeric | threshold_date
    severity = Column(String, nullable=False)   # low | medium | high | critical
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    check_config = Column(JSONB, nullable=False)
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())