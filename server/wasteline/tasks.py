"""Celery tasks for the wasteline app."""

import logging

from celery import shared_task, states
from celery.exceptions import Ignore, Reject

logger = logging.getLogger(__name__)


@shared_task(name="pull_federal_code", bind=True)
def pull_federal_codes(self, api_user: str | None = None):
    """Pull federal waste codes from the EPA API."""
    from core.services import get_rcra_client

    msg = "start task {self.name}"
    logger.debug(msg)
    try:
        rcrainfo = get_rcra_client(username=api_user)
        return rcrainfo.sync_federal_waste_codes()
    except (ConnectionError, TimeoutError) as exc:
        raise Reject from exc
    except Exception as exc:
        self.update_state(state=states.FAILURE, meta=f"unknown error: {exc}")
        raise Ignore from exc
