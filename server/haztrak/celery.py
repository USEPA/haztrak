"""
Haztrak's Celery task queue settings
"""

import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "haztrak.settings")

app = Celery("haztrak")

app.config_from_object("django.conf:settings", namespace="CELERY")

app.autodiscover_tasks()


@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(10.0, hello.s(), name="say hello every 10")


@app.task
def hello():
    print("hello")
