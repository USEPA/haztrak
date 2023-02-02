import os

import emanifest.client as em
from celery import Task, shared_task, states
from celery.exceptions import Ignore
from emanifest.client import RcrainfoClient

from apps.trak.models import RcraProfile
from apps.trak.serializers import ManifestSerializer


class ManifestTask(Task):
    """
    ManifestTask is Haztrak's interface for initiating Celery tasks that deal with
    either compute intensive jobs related to manifests or interfacing with RCRAInfo.
    """
    mtn: list
    serializer_class = ManifestSerializer
    ri: RcrainfoClient
    rcra_profile: RcraProfile

    def __init__(self):
        self.ri = em.new_client(os.getenv('HT_RCRAINFO_ENV', 'preprod'))
        super().__init__()


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
