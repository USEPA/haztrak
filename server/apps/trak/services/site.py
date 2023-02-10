from typing import Dict, List

from django.db import transaction

from ..models import Handler, Site
from .manifest import ManifestService
from .rcrainfo import RcrainfoService


class SiteService:
    """
    Use cases for the Site domain
    """

    def __init__(self, *, username: str, site_id: str = None, rcrainfo: RcrainfoService = None):
        self.username = username
        if rcrainfo is not None:
            self.rcrainfo = rcrainfo
        else:
            self.rcrainfo = RcrainfoService(username=username)
        if site_id:
            self.site = Site.objects.get(epa_site__epa_id=site_id)

    def sync_rcra_manifest(self, *, site_id: str = None) -> Dict[str, List[str]]:
        """
        Retrieve a site's manifest from Rcrainfo and save to the database.

        Keyword Args:
            site_id (str): the epa_id of the Site to sync with RCRAInfo's manifest. Defaults to None, uses self.site instead.
        """
        manifest_service = ManifestService(username=self.username)
        tracking_numbers: List[str] = manifest_service.search_rcra_mtn(site_id=site_id)
        return manifest_service.pull_manifests(tracking_numbers=tracking_numbers)

    @transaction.atomic
    def get_or_create_site(self, *, handler: Handler, site_name: str = None) -> Site:
        """
        Retrieve a site from the database or create.

        Keyword Args:
            handler (Handler): An instance of the (hazardous waste) Handler model
            site_name (str): A haztrak alias for a site
        """
        if site_name is None:
            site_name = handler.name
        if Site.objects.filter(epa_site__epa_id=handler.epa_id).exists():
            site = Site.objects.get(epa_site__epa_id=handler.epa_id)
            return site
        else:
            return Site.objects.create(epa_site=handler, name=site_name)
