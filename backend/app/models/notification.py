import uuid
from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base


class Notification(Base):
    """
    An in-app notification, created by the Step 4 scheduled job (or
    manually via the check-now endpoint for testing). contract_id and
    obligation_id are nullable since not every future notification type
    necessarily needs to reference both.
    """
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    contract_id = Column(UUID(as_uuid=True), ForeignKey("contracts.id", ondelete="CASCADE"), nullable=True)
    obligation_id = Column(UUID(as_uuid=True), ForeignKey("renewal_obligations.id", ondelete="CASCADE"), nullable=True)

    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())