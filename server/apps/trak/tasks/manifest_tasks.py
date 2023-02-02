from celery import Task, shared_task, states
from celery.exceptions import Ignore

from apps.trak.models import RcraProfile
from apps.trak.services import ManifestService


class ManifestTask(Task):
    """
    ManifestTask is Haztrak's interface for initiating Celery tasks that deal with
    either compute intensive jobs related to manifests or interfacing with RCRAInfo.
    """


@shared_task(bind=True, base=ManifestTask, name='sync manifests', retry_backoff=True)
def sync_site_manifests(self: ManifestTask, *args, **kwargs):
    try:
        self.rcra_profile = RcraProfile.objects.get(user__username=kwargs['user'])
        self.ri.Auth(api_id=self.rcra_profile.rcra_api_id,
                     api_key=self.rcra_profile.rcra_api_key)
        response = self.ri.GetSiteDetails(epa_id=kwargs['site_id'])
        print(response.json)
        return None
    except KeyError:
        self.update_state(
            state=states.FAILURE,
            meta=f'Malformed arguments passed to task {self.name}'
        )
        raise Ignore()


@shared_task(name="sync manifest")
def sync_manifest(*, mtn: str, user: str):
    manifest_service = ManifestService(user=user)
    manifest_service.retrieve_rcra_manifest(mtn=mtn)
