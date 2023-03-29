import datetime
import logging
from typing import Dict, List, Optional

from celery import Task, shared_task, states
from celery.exceptions import Ignore, Reject

from apps.trak.models import QuickerSign
from apps.trak.models.handler_model import HandlerType

logger = logging.getLogger(__name__)


@shared_task(name="pull manifest", bind=True, acks_late=True)
def pull_manifest(self: Task, *, mtn: [str], username: str) -> dict:
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
    site_type: HandlerType | str,
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
    except Exception as exc:
        self.update_state(state=states.FAILURE, meta=f"unknown error: {exc}")
        raise Ignore()
