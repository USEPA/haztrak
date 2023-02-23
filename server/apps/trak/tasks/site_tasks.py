from celery import shared_task, states
from celery.exceptions import Ignore

from apps.trak.services import SiteService


@shared_task(name="sync site manifests", bind=True)
def sync_site_manifests(self, *, site_id: str, username: str):
    try:
        site_service = SiteService(username=username)
        results = site_service.sync_rcra_manifest(site_id=site_id)
        return results
    except Exception as exc:
        self.update_state(state=states.FAILURE, meta=f"Internal Error {exc}")
        raise Ignore()
