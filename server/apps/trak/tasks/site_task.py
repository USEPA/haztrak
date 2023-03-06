import logging

from celery import shared_task, states
from celery.exceptions import Ignore

from apps.trak.services import SiteService

logger = logging.getLogger(__name__)


@shared_task(name="sync site manifests", bind=True)
def sync_site_manifests(self, *, site_id: str, username: str):
    """asynchronous task to sync an EPA site's manifests"""
    try:
        site_service = SiteService(username=username)
        results = site_service.sync_rcra_manifest(site_id=site_id)
        return results
    except Exception as exc:
        logger.error(f"failed to sync {site_id} manifest")
        self.update_state(state=states.FAILURE, meta=f"Internal Error {exc}")
        raise Ignore()
