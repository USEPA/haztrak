import os

from celery import shared_task, states
from celery.exceptions import Ignore
from emanifest import client as em

from apps.trak.models import Handler, RcraProfile
from apps.trak.serializers import HandlerSerializer


@shared_task(name="get handler", bind=True)
def get_handler(self, *, site_id: str, username: str):
    try:
        profile = RcraProfile.objects.get(user__username=username)
        ri = em.new_client(os.getenv('HT_RCRAINFO_ENV', 'preprod'))
        ri.Auth(profile.rcra_api_id, profile.rcra_api_key)
        if Handler.objects.filter(epa_id=site_id).exists():
            existing_handler = Handler.objects.get(epa_id=site_id)
            return {'epaId': existing_handler.epa_id, 'status': 'updated'}
        else:
            response = ri.GetSiteDetails(site_id)
            if response.ok:
                new_handler = save_handler(response.json)
                return {'epaId': new_handler.epa_id, 'status': 'created'}
    except RcraProfile.DoesNotExist:
        self.update_state(
            state=states.FAILURE,
            meta=f'More than one (or zero) users were returned from RCRAInfo.'
                 f'Check haztrak {self.profile}\'s RCRAInfo username'
        )
        raise Ignore()


def save_handler(handler_data) -> Handler:
    serializer = HandlerSerializer(data=handler_data)
    if serializer.is_valid():
        new_handler: Handler = serializer.save()
        return new_handler
