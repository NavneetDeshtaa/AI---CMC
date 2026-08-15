from celery import Celery
from celery.schedules import crontab
from app.core.config import settings

celery_app = Celery(
    "contract_intelligence",
    broker=settings.redis_url,
    backend=settings.redis_url,
)

celery_app.conf.beat_schedule = {
    "check-renewals-daily": {
        "task": "app.tasks.renewal_checks.check_renewals_task",
        "schedule": crontab(hour=9, minute=0),
    },
}

celery_app.conf.timezone = "UTC"

# Explicitly import the module containing Celery tasks.
celery_app.conf.imports = (
    "app.tasks.renewal_checks",
)