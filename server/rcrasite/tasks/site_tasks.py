"""Celery tasks for the rcra_site app."""

import logging

from celery import shared_task, states
from celery.exceptions import Ignore
from rcrasite.services import RcraSiteService

logger = logging.getLogger(__name__)


@shared_task(name="get rcra_site", bind=True)
def get_rcra_site_task(self, *, site_id: str, username: str) -> str:
    """Task to get the rcra_site from the EPA API."""
    try:
        site_service = RcraSiteService(username=username)
        rcra_site = site_service.pull_rcrainfo_site(site_id=site_id)
    except Exception as exc:
        self.update_state(state=states.FAILURE, meta=f"Internal Error {exc}")
        raise Ignore from exc
    else:
        return rcra_site.epa_id
