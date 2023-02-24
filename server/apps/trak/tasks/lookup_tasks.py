import logging

from celery import shared_task

logger = logging.getLogger(__name__)


@shared_task(name="pull_federal_code")
def pull_federal_codes():
    logger.warning("pulling federal waste codes from RCRAInfo")
