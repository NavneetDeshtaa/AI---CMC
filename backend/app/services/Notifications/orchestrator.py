from datetime import date, timedelta, datetime, timezone
from sqlalchemy.orm import Session

from app.models.renewal_obligation import RenewalObligation
from app.models.contract import Contract
from app.models.notification import Notification
from app.services.Notifications.email_sender import send_email


def check_and_notify_upcoming(db: Session, days: int = 30) -> int:
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
        user = contract.uploader

        title = f"{item.item_type.title()} due {item.due_date.isoformat()}"
        message = (
            f"'{item.title}' for contract '{contract.file_name}' is due on "
            f"{item.due_date.isoformat()}. {item.description or ''}"
        ).strip()

        # CHANGED: capture the actual send result before saving, instead
        # of firing the email as an unchecked side effect.
        email_sent = False
        if getattr(user, "email", None):
            email_sent = send_email(user.email, title, message)

        notification = Notification(
            user_id=user.id,
            contract_id=contract.id,
            obligation_id=item.id,
            title=title,
            message=message,
            email_sent=email_sent,
        )
        db.add(notification)

        item.notified_at = datetime.now(timezone.utc)
        count += 1

    db.commit()
    return count