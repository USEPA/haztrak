"""This module contains the CeleryWorker management command."""

import logging
import os
import shlex
import subprocess
import sys

from django.core.management.base import BaseCommand
from django.utils import autoreload

CELERY_LOG_LEVEL = os.getenv("CELERY_LOG_LEVEL", "INFO")
logger = logging.getLogger(name=__name__)


def restart_celery_worker():
    """Restarts the celery worker."""
    celery_worker_cmd = f"celery -A haztrak worker -l {CELERY_LOG_LEVEL} -E"
    cmd = f'pkill -f "{celery_worker_cmd}"'
    if sys.platform == "win32":
        cmd = "taskkill /f /t /im celery.exe"

    subprocess.call(shlex.split(cmd))  # noqa: S603
    subprocess.call(shlex.split(f"{celery_worker_cmd}"))  # noqa: S603


class Command(BaseCommand):
    """Starts a celery worker with autoreload."""

    def handle(self, *args, **options):
        """Starts a celery worker with autoreload."""
        logger.info("Starting celery worker with autoreload...")
        autoreload.run_with_reloader(restart_celery_worker)
