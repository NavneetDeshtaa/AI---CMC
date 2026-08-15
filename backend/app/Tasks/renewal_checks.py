from app.core.celery_app import celery_app
from app.database import SessionLocal
from app.services.Notifications.orchestrator import check_and_notify_upcoming


@celery_app.task(name="app.tasks.renewal_checks.check_renewals_task")
def check_renewals_task(days: int = 30):
    """
    Runs inside the Celery WORKER process, triggered either by Celery
    Beat's daily schedule or manually for testing. Opens its own DB
    session since it's not running inside a FastAPI request -- same
    pattern as your MCP server tools and backfill scripts.
    """
    db = SessionLocal()
    try:
        count = check_and_notify_upcoming(db, days=days)
        print(f"[renewal check] Created {count} notification(s).")
        return count
    finally:
        db.close()