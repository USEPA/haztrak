import logging
import time

from celery import Task, shared_task
from django.core.cache import cache

logger = logging.getLogger(__name__)


@shared_task(bind=True, name="example task")
def example_task(self: Task):
    cache.set(
        self.request.id,
        {"status": "STARTED", "taskName": self.name, "taskId": self.request.id},
    )
    time.sleep(15)
    cache.set(
        self.request.id,
        {"status": "SUCCESS", "taskName": self.name, "taskId": self.request.id},
    )
    return ({"status": "SUCCESS", "taskName": self.name, "taskId": self.request.id},)
