import logging

from celery import shared_task, states
from celery.exceptions import Ignore

from apps.sites.services import EpaSiteService

logger = logging.getLogger(__name__)


@shared_task(name="get epa_site", bind=True)
def get_epa_site(self, *, site_id: str, username: str) -> str:
    try:
        site_service = EpaSiteService(username=username)
        epa_site = site_service.pull_epa_site(site_id=site_id)
        return epa_site.epa_id
    except Exception as exc:
        self.update_state(state=states.FAILURE, meta=f"Internal Error {exc}")
        raise Ignore()
