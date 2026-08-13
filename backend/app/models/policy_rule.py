import uuid
from sqlalchemy import Column, String, Text, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class PolicyRule(Base):
    """
    A single baseline standard contracts get compared against -- e.g. "every
    contract should have a Limitation of Liability clause." Seeded as
    starter data, editable later without a code deploy (that's the whole
    reason this is a DB table rather than hardcoded Python or a config file).
    """
    __tablename__ = "policy_rules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    clause_name = Column(String, nullable=False, unique=True)   # e.g. "Limitation of Liability"

    # Written for the LLM to read during clause comparison -- describes what
    # "acceptable" looks like for this clause, not just that it must exist.
    description = Column(Text, nullable=False)

    is_required = Column(Boolean, default=True, nullable=False)   # must this clause exist at all
    risk_weight = Column(Integer, default=10, nullable=False)     # points added to score if missing/violated

    # Lets you disable a rule (e.g. temporarily) without deleting history of
    # past assessments that referenced it.
    active = Column(Boolean, default=True, nullable=False)