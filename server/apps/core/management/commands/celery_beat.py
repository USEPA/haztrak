import logging
import os
import shlex
import subprocess
import sys

from django.core.management.base import BaseCommand
from django.utils import autoreload
from django_celery_beat.models import CrontabSchedule, IntervalSchedule, PeriodicTask

from apps.wasteline.tasks import pull_federal_codes

CELERY_LOG_LEVEL = os.getenv("CELERY_LOG_LEVEL", "INFO")
logger = logging.getLogger(__name__)


def restart_celery_beat():
    celery_beat_cmd = f"celery -A haztrak beat -l {CELERY_LOG_LEVEL}"
    cmd = f'pkill -f "{celery_beat_cmd}"'
    if sys.platform == "win32":
        cmd = "taskkill /f /t /im celery.exe"

    subprocess.call(shlex.split(cmd))
    subprocess.call(shlex.split(f"{celery_beat_cmd}"))


class Command(BaseCommand):
    def handle(self, *args, **options):
        """
        see HackSoftware's explanation here.
        https://github.com/HackSoftware/Django-Styleguide#periodic-tasks
        I'm not crazy about this implementation, but it will do for our POC.
        Note, adding @transaction.atomic causes problems with docker-compose
        """
        IntervalSchedule.objects.all().delete()
        CrontabSchedule.objects.all().delete()
        PeriodicTask.objects.all().delete()

        periodic_tasks_data = [
            {
                "task": pull_federal_codes,
                "name": f"{pull_federal_codes.name}",
                # https://crontab.guru/once-a-month
                "cron": {
                    "minute": "0",
                    "hour": "0",
                    "day_of_month": "1",
                    "month_of_year": "*",
                },
                "enabled": True,
            },
        ]

        for periodic_task in periodic_tasks_data:
            logger.info(f'Setting up {periodic_task["task"].name}')

            cron = CrontabSchedule.objects.create(**periodic_task["cron"])

            PeriodicTask.objects.create(
                name=periodic_task["name"],
                task=periodic_task["task"].name,
                crontab=cron,
                enabled=periodic_task["enabled"],
            )

        logger.info("Starting celery beat with autoreload...")
        autoreload.run_with_reloader(restart_celery_beat)
