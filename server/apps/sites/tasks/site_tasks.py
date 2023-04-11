import logging

from celery import shared_task, states
from celery.exceptions import Ignore

from apps.sites.services import RcraSiteService

logger = logging.getLogger(__name__)


@shared_task(name="sync site manifests", bind=True)
def sync_site_manifests(self, *, site_id: str, username: str):
    """asynchronous task to sync an EPA site's manifests"""
    from apps.sites.services import SiteService

    try:
        site_service = SiteService(username=username)
        results = site_service.sync_rcra_manifest(site_id=site_id)
        return results
    except Exception as exc:
        logger.error(f"failed to sync {site_id} manifest")
        self.update_state(state=states.FAILURE, meta=f"Internal Error {exc}")
        raise Ignore()


@shared_task(name="get epa_site", bind=True)
def get_rcra_site(self, *, site_id: str, username: str) -> str:
    try:
        site_service = RcraSiteService(username=username)
        epa_site = site_service.pull_rcra_site(site_id=site_id)
        return epa_site.epa_id
    except Exception as exc:
        self.update_state(state=states.FAILURE, meta=f"Internal Error {exc}")
        raise Ignore()
