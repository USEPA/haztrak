from celery import Task, shared_task, states
from celery.exceptions import Ignore, Reject

from apps.trak.services.manifest import ManifestService


@shared_task(name="pull manifest", bind=True, acks_late=True)
def pull_manifest(self: Task, *, mtn: [str], username: str) -> dict:
    """
    This task initiates a call to the ManifestService to pull a manifest by MTN
    """
    try:
        manifest_service = ManifestService(username=username)
        results = manifest_service.pull_manifests(tracking_numbers=mtn)
        return results
    except (ConnectionError, TimeoutError):
        raise Reject()
    except Exception as e:
        self.update_state(
            state=states.FAILURE,
            meta=f'unknown error: {e}')
        raise Ignore()
