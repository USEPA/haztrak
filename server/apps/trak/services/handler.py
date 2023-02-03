import os

from django.db import transaction
from emanifest import RcrainfoClient

from apps.trak.models import Handler, RcraProfile
from apps.trak.serializers import HandlerSerializer


class HandlerService:
    def __init__(self, *, username: str):
        self.username = username

    def retrieve_rcra_handler(self, *, site_id: str):
        """
        Retrieve a site/handler from Rcrainfo and save to the database.
        """
        profile = RcraProfile.objects.get(user__username=self.username)
        # ToDo, refactor when emanifest 3.0 python package is released
        rcrainfo_env = os.getenv('HT_RCRAINFO_ENV', 'preprod')
        rcrainfo = RcrainfoClient(rcrainfo_env, api_id=profile.rcra_api_id, api_key=profile.rcra_api_key)
        if Handler.objects.filter(epa_id=site_id).exists():
            existing_handler = Handler.objects.get(epa_id=site_id)
            return {'epaId': existing_handler.epa_id, 'status': 'updated'}
        else:
            response = rcrainfo.get_site(site_id)
            if response.ok:
                self.save_handler(response.response.json())

    @staticmethod
    @transaction.atomic
    def save_handler(handler_data) -> Handler:
        serializer = HandlerSerializer(data=handler_data)
        if serializer.is_valid():
            new_handler: Handler = serializer.save()
            return new_handler
