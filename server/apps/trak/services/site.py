import os

from django.db import transaction
from emanifest import RcrainfoClient

from apps.trak.models import RcraProfile


class SiteService:
    def __init__(self, *, user: str):
        self.user = user

    @transaction.atomic
    def sync_site_manifest(self, *, site_id: str):
        """
        Retrieve a manifest from Rcrainfo and save to the database.
        """
        profile = RcraProfile.objects.get(user__username=self.user)
        # ToDo, refactor when emanifest 3.0 python package is released
        rcrainfo = RcrainfoClient(os.getenv('HT_RCRAINFO_ENV', 'preprod'))
        rcrainfo.authenticate(profile.rcra_api_id, profile.rcra_api_key)
        response = rcrainfo.get_manifest(site_id)
        print(response.response.json())
        return response
