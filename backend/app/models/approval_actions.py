import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class ApprovalAction(Base):
    """
    Immutable audit log entry -- one row per approve/reject decision ever
    made. stage_name is SNAPSHOTTED at the time of the action (copied from
    the workflow at that moment) rather than looked up dynamically --
    important because if someone edits the workflow's stages later, this
    history should still accurately reflect what stage the action was
    actually taken at, not get silently rewritten.
    """
    __tablename__ = "approval_actions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    approval_instance_id = Column(UUID(as_uuid=True), ForeignKey("approval_instances.id", ondelete="CASCADE"), nullable=False, index=True)

    stage_name = Column(String, nullable=False)   # snapshotted, not a live reference
    action = Column(String(10), nullable=False)   # "approved" | "rejected"
    actor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    comment = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    approval_instance = relationship("ApprovalInstance", back_populates="actions")
    actor = relationship("User")