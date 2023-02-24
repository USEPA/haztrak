"""
Haztrak's Celery task queue settings
"""

import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "haztrak.settings")

app = Celery("haztrak")

app.config_from_object("django.conf:settings", namespace="CELERY")

app.autodiscover_tasks()


@app.on_after_finalize.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(10.0, launch_task.s(), name="launch from celery.py")


@app.task(name="launch test task")
def launch_task():
    from apps.trak.tasks import pull_federal_codes

    pull_federal_codes()
