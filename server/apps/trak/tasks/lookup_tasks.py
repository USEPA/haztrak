import logging

from celery import shared_task

from haztrak.celery import app

logger = logging.getLogger(__name__)


@app.task(name="pull_federal_code")
def pull_federal_codes():
    logger.warning("pulling federal waste codes from RCRAInfo")


@app.on_after_finalize.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(10.0, pull_federal_codes.s(), name="pull codes every 10 seconds")
