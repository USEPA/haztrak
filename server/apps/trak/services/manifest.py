from datetime import datetime

from django.db import transaction

from apps.trak.models import Manifest
from apps.trak.serializers import ManifestSerializer
from apps.trak.services import RcrainfoService


class ManifestService:
    """
    ManifestService encapsulates logic and exposes methods
    corresponding to uniform hazardous waste manifest use cases.
    """

    def __init__(self, *, username: str):
        self.username = username
        self.rcrainfo = RcrainfoService(username=self.username)

    def _retrieve_manifest(self, mtn: str):
        response = self.rcrainfo.get_manifest(mtn)
        if response.ok:
            return response.json()
        else:
            raise Exception(response.json())

    @transaction.atomic
    def _save_manifest(self, manifest_json: dict) -> Manifest:
        serializer = ManifestSerializer(data=manifest_json)
        if serializer.is_valid():
            return serializer.save()
        else:
            raise Exception(serializer.errors)

    def search_rcra_manifest(self, *, site_id: str = None, start_date: str | datetime = None,
                             end_date: str | datetime = None, status: str = None, **kwargs):
        print(kwargs)

    def pull_manifests(self, tracking_numbers: list) -> dict:
        results = {'success': [], 'error': []}
        for mtn in tracking_numbers:
            try:
                manifest_json: dict = self._retrieve_manifest(mtn)
                manifest = self._save_manifest(manifest_json)
                results['success'].append(manifest.mtn)
            except Exception:
                results['error'].append(mtn)
        return results

    def pull_recent_manifest(self):
        pass
