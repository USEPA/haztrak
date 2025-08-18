"""Celery tasks for the manifest app."""

import logging

from celery import Task, shared_task, states
from celery.exceptions import Ignore, Reject
from core.services import get_rcra_client

logger = logging.getLogger(__name__)


@shared_task(name="pull manifest", bind=True, acks_late=True)
def pull_manifest_by_mtn_task(self: Task, *, mtn: list[str], username: str) -> dict:
    """This task initiates a call to the EManifest to pull a manifest by MTN."""
    from core.services import TaskService
    from manifest.services import EManifest

    msg = f"start task: {self.name}, manifest: {mtn}"
    logger.info(msg)
    task_status = TaskService(task_id=self.request.id, task_name=self.name, status="STARTED")
    try:
        emanifest = EManifest(username=username)
        results = emanifest.pull(tracking_numbers=mtn)
        task_status.update_task_status(status="SUCCESS", results=results)
    except (ConnectionError, TimeoutError) as exc:
        task_status.update_task_status(status="FAILURE")
        raise Reject from exc
    except Exception as exc:
        task_status.update_task_status(status="FAILURE")
        self.update_state(state=states.FAILURE, meta={"unknown error": str(exc)})
        raise Ignore from exc
    else:
        return results


@shared_task(name="sign manifests", bind=True, acks_late=True)
def sign_manifest_task(self: Task, *, username: str, **signature_data: dict) -> dict:
    """A task to Quicker Sign manifest, by MTN, in RCRAInfo."""
    from manifest.services import EManifest

    try:
        emanifest = EManifest(username=username)
        return emanifest.submit_quick_signature(signature_data)
    except (ConnectionError, TimeoutError) as exc:
        raise Reject(exc) from exc  # To Do: add retry logic
    except Exception as exc:
        self.update_state(state=states.FAILURE, meta={"unknown error": f"{exc}"})
        raise Ignore from exc


@shared_task(name="sync site manifests", bind=True)
def sync_site_manifests_task(self, *, site_id: str, username: str):
    """Asynchronous task to sync an EPA site's manifests."""
    from manifest.services.emanifest import sync_manifests
    from org.services import get_user_site, update_emanifest_sync_date

    try:
        client = get_rcra_client(username=username)
        site = get_user_site(username=username, epa_id=site_id)
        results = sync_manifests(
            site_id=site_id,
            last_sync_date=site.last_rcrainfo_manifest_sync,
            rcra_client=client,
        )
        update_emanifest_sync_date(site=site)
    except Exception as exc:
        msg = f"failed to sync {site_id} manifest: {exc}"
        logger.exception(msg)
        self.update_state(state=states.FAILURE, meta={f"error: {exc}"})
        raise Ignore from exc
    else:
        return results


@shared_task(name="save RCRAInfo manifests", bind=True)
def save_to_emanifest_task(self, *, manifest_data: dict, username: str):
    """Save manifest data to the EManifest.

    Asynchronous task to use the RCRAInfo web services to create an electronic (RCRA) manifest
    it accepts a Python dict of the manifest data to be submitted as JSON, and the username of the
    user who is creating the manifest.
    """
    from core.services import TaskService
    from manifest.services import EManifest, EManifestError

    msg = f"start task: {self.name}"
    logger.info(msg)
    task_status = TaskService(task_id=self.request.id, task_name=self.name, status="STARTED")
    try:
        emanifest = EManifest(username=username)
        new_manifest = emanifest.save(manifest=manifest_data)
        if new_manifest:
            task_status.update_task_status(status="SUCCESS", results=new_manifest)
            return new_manifest
        msg = "error creating manifest"
        raise EManifestError(msg)
    except EManifestError as exc:
        msg = f"failed to create manifest ({manifest_data}): {exc.message}"
        logger.exception(msg)
        task_status.update_task_status(status="FAILURE", results=exc.message)
        return {"error": exc.message}
    except Exception as exc:
        msg = f"Internal Error: {exc}"
        logger.exception(msg)
        task_status.update_task_status(status="FAILURE", results={"result": str(exc)})
        return {"error": f"Internal Error: {exc}"}
