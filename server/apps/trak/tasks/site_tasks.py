from celery import shared_task, states
from celery.exceptions import Ignore

from apps.trak.services import SiteService


@shared_task(name="sync site manifests", bind=True)
def sync_site_manifests(self, *, site_id: str, username: str):
    try:
        site_service = SiteService(username=username)
        site_service.sync_rcra_manifest(site_id=site_id)
    except Exception as e:
        self.update_state(
            state=states.FAILURE,
            meta=f'Internal Error {e}'
        )
        raise Ignore()
