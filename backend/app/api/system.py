import redis as redis_lib
from fastapi import APIRouter
from app.core.config import settings
from app.core.celery_app import celery_app

router = APIRouter(prefix="/system", tags=["system"])


@router.get("/status")
def get_system_status():
    """
    Real, live health check -- not a guess. Redis check actually opens a
    connection and pings it. Celery check actually asks any running
    workers to respond within 2 seconds -- if no worker process is
    running (or it crashed), this correctly comes back empty rather than
    just assuming things are fine.
    """
    try:
        r = redis_lib.from_url(settings.redis_url)
        r.ping()
        redis_status = "connected"
    except Exception as e:
        redis_status = f"error: {e}"

    try:
        inspector = celery_app.control.inspect(timeout=2.0)
        pong = inspector.ping()
        workers = list(pong.keys()) if pong else []
    except Exception:
        workers = []

    return {
        "redis": redis_status,
        "celery_workers": workers,
        "celery_worker_count": len(workers),
    }