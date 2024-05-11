import logging
from typing import Dict, List

from celery import Task, shared_task, states
from celery.exceptions import Ignore, Reject

logger = logging.getLogger(__name__)


@shared_task(name="pull manifest", bind=True, acks_late=True)
def pull_manifest(self: Task, *, mtn: List[str], username: str) -> dict:
    """
    This task initiates a call to the EManifest to pull a manifest by MTN
    """

    from apps.core.services import TaskService
    from apps.manifest.services import EManifest

    logger.info(f"start task {self.name}, manifest {mtn}")
    task_status = TaskService(task_id=self.request.id, task_name=self.name, status="STARTED")
    try:
        emanifest = EManifest(username=username)
        results = emanifest.pull(tracking_numbers=mtn)
        task_status.update_task_status(status="SUCCESS", results=results)
        return results
    except (ConnectionError, TimeoutError):
        task_status.update_task_status(status="FAILURE")
        raise Reject()
    except Exception as exc:
        task_status.update_task_status(status="FAILURE")
        self.update_state(state=states.FAILURE, meta={"unknown error": str(exc)})
        raise Ignore()


@shared_task(name="sign manifests", bind=True, acks_late=True)
def sign_manifest(
    self: Task,
    *,
    username: str,
    **signature_data: dict,
) -> Dict:
    """
    a task to Quicker Sign manifest, by MTN, in RCRAInfo
    """
    from apps.manifest.services import EManifest

    try:
        emanifest = EManifest(username=username)
        return emanifest.submit_quick_signature(signature_data)
    except (ConnectionError, TimeoutError) as exc:
        raise Reject(exc)  # To Do: add retry logic
    except Exception as exc:
        self.update_state(state=states.FAILURE, meta={"unknown error": f"{exc}"})
        raise Ignore()


@shared_task(name="sync site manifests", bind=True)
def sync_site_manifests(self, *, site_id: str, username: str):
    """asynchronous task to sync an EPA site's manifests"""
    from apps.site.services import TrakSiteService

    try:
        site_service = TrakSiteService(username=username)
        results = site_service.sync_manifests(site_id=site_id)
        return results
    except Exception as exc:
        logger.error(f"failed to sync {site_id} manifest")
        self.update_state(state=states.FAILURE, meta={f"error: {exc}"})
        raise Ignore()


@shared_task(name="save RCRAInfo manifests", bind=True)
def save_to_emanifest(self, *, manifest_data: dict, username: str):
    """
    asynchronous task to use the RCRAInfo web services to create an electronic (RCRA) manifest
    it accepts a Python dict of the manifest data to be submitted as JSON, and the username of the
    user who is creating the manifest
    """
    from apps.core.services import TaskService
    from apps.manifest.services import EManifest, EManifestError

    logger.info(f"start task: {self.name}")
    task_status = TaskService(task_id=self.request.id, task_name=self.name, status="STARTED")
    try:
        emanifest = EManifest(username=username)
        new_manifest = emanifest.save(manifest=manifest_data)
        if new_manifest:
            task_status.update_task_status(status="SUCCESS", results=new_manifest)
            return new_manifest
        raise EManifestError("error creating manifest")
    except EManifestError as exc:
        logger.error(f"failed to create manifest ({manifest_data}): {exc.message}")
        task_status.update_task_status(status="FAILURE", results=exc.message)
        return {"error": exc.message}
    except Exception as exc:
        logger.error("error: ", exc)
        task_status.update_task_status(status="FAILURE", results={"result": str(exc)})
        return {"error": f"Internal Error: {exc}"}
