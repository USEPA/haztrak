import datetime
import logging
from typing import Dict, List, Optional

from celery import Task, shared_task, states
from celery.exceptions import Ignore, Reject

from apps.sites.models import RcraSiteType
from apps.trak.models import QuickerSign

logger = logging.getLogger(__name__)


@shared_task(name="pull manifest", bind=True, acks_late=True)
def pull_manifest(self: Task, *, mtn: List[str], username: str) -> dict:
    """
    This task initiates a call to the ManifestService to pull a manifest by MTN
    """

    from apps.trak.services import ManifestService

    logger.debug(f"start task {self.name}, manifest {mtn}")
    try:
        manifest_service = ManifestService(username=username)
        results = manifest_service.pull_manifests(tracking_numbers=mtn)
        return results
    except (ConnectionError, TimeoutError):
        raise Reject()
    except Exception as exc:
        self.update_state(state=states.FAILURE, meta=f"unknown error: {exc}")
        raise Ignore()


@shared_task(name="sign manifests", bind=True, acks_late=True)
def sign_manifest(
    self: Task,
    *,
    username: str,
    mtn: List[str],
    site_id: str,
    site_type: RcraSiteType | str,
    printed_name: str,
    printed_date: datetime.datetime,
    transporter_order: Optional[int] = None,
) -> Dict:
    """
    a task to Quicker Sign manifest, by MTN, in RCRAInfo
    """
    from apps.trak.services import ManifestService

    logger.debug(f"start task {self.name}, manifest {mtn}")
    try:
        manifest_service = ManifestService(username=username)
        signature = QuickerSign(
            mtn=mtn,
            site_id=site_id,
            site_type=site_type,
            printed_name=printed_name,
            printed_date=printed_date,
            transporter_order=transporter_order,
        )
        results = manifest_service.sign_manifest(signature)
        return results
    except (ConnectionError, TimeoutError) as exc:
        raise Reject(exc)
    except ValueError as exc:
        self.update_state(state=states.FAILURE, meta=f"ValueError: {exc}")
        raise Ignore()
    except Exception as exc:
        self.update_state(state=states.FAILURE, meta=f"unknown error: {exc}")
        raise Ignore()


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


# create_rcra_manifest
@shared_task(name="create rcra manifests", bind=True)
def create_rcra_manifest(self, *, manifest: dict, username: str):
    from apps.trak.services import ManifestService

    logger.info(f"start task: {self.name}; manifest: ToDo")
    try:
        manifest_service = ManifestService(username=username)
        manifest_service.create_rcra_manifest(manifest=manifest)
    except Exception as exc:
        print("error: ", exc)
