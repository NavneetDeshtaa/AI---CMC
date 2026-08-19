import uuid
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.database import Base


class ApprovalWorkflow(Base):
    """
    A named, reusable sequence of approval stages -- e.g. a "Standard"
    workflow might be ["Sales", "Manager", "Legal", "Finance",
    "Signature"], while a "Quick NDA" workflow might just be
    ["Manager", "Legal"]. This is the DEFINITION only; ApprovalInstance
    tracks one specific contract's live position within a chosen workflow.

    Same seedable-template pattern as ContractTemplate from Phase 4 --
    stages are stored as an ordered JSONB array rather than a separate
    table, since they're simple named steps with no independent identity
    of their own.
    """
    __tablename__ = "approval_workflows"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True)
    contract_type = Column(String, nullable=True)   # optional -- links to ContractTemplate.contract_type if relevant

    stages = Column(JSONB, nullable=False)   # ordered list, e.g. ["Sales", "Manager", "Legal", "Finance", "Signature"]

    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())