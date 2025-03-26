"""Haztrak's Celery task queue settings."""

import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "haztrak.settings")

app = Celery("haztrak")

app.config_from_object("django.conf:settings", namespace="CELERY")

app.autodiscover_tasks()
