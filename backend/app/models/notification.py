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

    # Add this ONE column to your existing Notification model:
    email_sent = Column(Boolean, default=False, nullable=False)
    # True only if smtplib's send actually completed without error.
    # NOTE: this proves Gmail ACCEPTED the message for delivery -- it
    # does NOT prove it reached the inbox (a later bounce, like the one
    # you saw earlier, happens asynchronously and isn't visible here).
    # This is the best signal available without building a full email
    # deliverability tracking system.