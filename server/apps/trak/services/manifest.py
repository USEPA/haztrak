import os

from django.db import transaction
from emanifest import RcrainfoClient

from apps.trak.models import Manifest, RcraProfile
from apps.trak.serializers import ManifestSerializer


class ManifestService:
    def __init__(self, *, user: str):
        self.user = user

    @transaction.atomic
    def retrieve_rcra_manifest(self, *, mtn: str):
        """
        Retrieve a manifest from Rcrainfo and save to the database.
        """
        profile = RcraProfile.objects.get(user__username=self.user)
        # ToDo, refactor when emanifest 3.0 python package is released
        rcrainfo = RcrainfoClient(os.getenv('HT_RCRAINFO_ENV', 'preprod'))
        rcrainfo.authenticate(profile.rcra_api_id, profile.rcra_api_key)
        if Manifest.objects.filter(mtn=mtn).exists():
            existing_manifest = Manifest.objects.get(mtn=mtn)
            return {'epaId': existing_manifest.mtn, 'status': 'updated'}
        else:
            response = rcrainfo.get_manifest(mtn)
            if response.ok:
                serializer = ManifestSerializer(data=response.json)
                if serializer.is_valid():
                    new_manifest: Manifest = serializer.save()
                    return new_manifest
