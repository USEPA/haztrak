import os
import shlex
import subprocess
import sys

from django.core.management.base import BaseCommand
from django.utils import autoreload

CELERY_LOG_LEVEL = os.getenv("CELERY_LOG_LEVEL", "INFO")


def restart_celery_beat():
    celery_beat_cmd = f"celery -A haztrak beat -l {CELERY_LOG_LEVEL}"
    cmd = f'pkill -f "{celery_beat_cmd}"'
    if sys.platform == "win32":
        cmd = "taskkill /f /t /im celery.exe"

    subprocess.call(shlex.split(cmd))
    subprocess.call(shlex.split(f"{celery_beat_cmd}"))


class Command(BaseCommand):
    def handle(self, *args, **options):
        print("Starting celery beat with autoreload...")
        autoreload.run_with_reloader(restart_celery_beat)
