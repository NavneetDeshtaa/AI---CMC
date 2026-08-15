from celery import Celery
from celery.schedules import crontab
from app.core.config import settings

celery_app = Celery(
    "contract_intelligence",
    broker=settings.redis_url,    # Redis holds the queue of "tasks to run"
    backend=settings.redis_url,   # Redis also stores task results/status
)

celery_app.conf.beat_schedule = {
    "check-renewals-daily": {
        "task": "app.tasks.renewal_checks.check_renewals_task",
        "schedule": crontab(hour=9, minute=0),   # runs once daily at 9:00 AM
    },
}
celery_app.conf.timezone = "UTC"

# Auto-discovers tasks defined in app/tasks/ -- so any @celery_app.task
# decorated function in that package gets registered without needing to
# import it manually here.
celery_app.autodiscover_tasks(["app.tasks"])