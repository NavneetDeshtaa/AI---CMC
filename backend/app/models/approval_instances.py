import uuid
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class ApprovalInstance(Base):
    """
    One contract's live journey through a specific ApprovalWorkflow.
    1:1 with Contract (unique constraint on contract_id) -- a contract has
    exactly one active approval process at a time, same relationship
    shape as ContractSummary/RiskAssessment.

    current_stage_index is the deterministic engine's source of truth:
    it's just an integer pointer into workflow.stages. No AI involved in
    this table or how it advances -- that's Step 2's whole point.
    """
    __tablename__ = "approval_instances"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contract_id = Column(UUID(as_uuid=True), ForeignKey("contracts.id", ondelete="CASCADE"), unique=True, nullable=False)
    workflow_id = Column(UUID(as_uuid=True), ForeignKey("approval_workflows.id"), nullable=False)

    current_stage_index = Column(Integer, default=0, nullable=False)   # 0-based index into workflow.stages
    status = Column(String(20), default="in_progress", nullable=False)   # "in_progress" | "approved" | "rejected"

    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    contract = relationship("Contract", back_populates="approval_instance")
    workflow = relationship("ApprovalWorkflow")
    actions = relationship("ApprovalAction", back_populates="approval_instance", cascade="all, delete-orphan", order_by="ApprovalAction.created_at")