import logging
import time

from celery import shared_task
from django.core.cache import cache

logger = logging.getLogger(__name__)


@shared_task(bind=True, name="example task", task_track_started=True)
def example_task(self):
    print(f"task ID: {self.request.id}")
    cache.set(self.request.id, {"status": "STARTED", "data": None})
    print(f"task status: {cache.get(self.request.id)}")
    time.sleep(15)
    cache.set(self.request.id, "SUCCESS")
    print(f"task status: {cache.get(self.request.id)}")
    return "The Task results"
