import logging
import time

from celery import shared_task

logger = logging.getLogger(__name__)


@shared_task(name="example task")
def example_task():
    time.sleep(10)
    return "The Task results"
