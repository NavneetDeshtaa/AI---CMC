from datetime import date, timedelta, datetime, timezone
from sqlalchemy.orm import Session

from app.models.renewal_obligation import RenewalObligation
from app.models.contract import Contract
from app.models.notification import Notification
from app.services.Notifications.email_sender import send_email


def check_and_notify_upcoming(db: Session, days: int = 30) -> int:
    """
    Finds every RenewalObligation due within `days` that hasn't been
    completed and hasn't already triggered a notification (notified_at
    IS NULL) -- that last filter is what makes this safe to run daily
    without spamming the same reminder over and over.

    For each one: creates an in-app Notification row, sends an email to
    the contract's uploader, then marks notified_at so it won't fire
    again. Returns how many notifications were created (used for logging
    and for the manual "check now" testing endpoint).
    """
    cutoff = date.today() + timedelta(days=days)
    items = (
        db.query(RenewalObligation)
        .filter(RenewalObligation.due_date <= cutoff)
        .filter(RenewalObligation.due_date >= date.today())
        .filter(RenewalObligation.is_completed == False)  # noqa: E712
        .filter(RenewalObligation.notified_at.is_(None))
        .all()
    )

    count = 0
    for item in items:
        contract = db.query(Contract).filter(Contract.id == item.contract_id).first()
        if contract is None:
            continue
        user = contract.uploader  # existing relationship on Contract

        title = f"{item.item_type.title()} due {item.due_date.isoformat()}"
        message = (
            f"'{item.title}' for contract '{contract.file_name}' is due on "
            f"{item.due_date.isoformat()}. {item.description or ''}"
        ).strip()

        notification = Notification(
            user_id=user.id,
            contract_id=contract.id,
            obligation_id=item.id,
            title=title,
            message=message,
        )
        db.add(notification)

        if getattr(user, "email", None):
            send_email(user.email, title, message)

        item.notified_at = datetime.now(timezone.utc)
        count += 1

    db.commit()
    return count