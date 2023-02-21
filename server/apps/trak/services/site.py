import logging
from typing import Dict, List

from django.db import transaction

from ..models import Handler, Site
from .manifest import ManifestService
from .rcrainfo import RcrainfoService

logger = logging.getLogger(__name__)


class SiteService:
    """
    SiteService encapsulates the site subdomain business logic and exposes methods
    corresponding to use cases.
    """

    def __init__(self, *, username: str, site_id: str = None,
                 rcrainfo: RcrainfoService = None):
        self.username = username
        if rcrainfo is not None:
            self.rcrainfo = rcrainfo
        else:
            self.rcrainfo = RcrainfoService(api_username=username)
        if site_id:
            self.site = Site.objects.get(epa_site__epa_id=site_id)

    def sync_rcra_manifest(self, *, site_id: str = None) -> Dict[str, List[str]]:
        """
        Retrieve a site's manifest from Rcrainfo and save to the database.

        Keyword Args:
            site_id (str): the epa_id to sync with RCRAInfo's manifest. Defaults self.site.
        """
        try:
            manifest_service = ManifestService(username=self.username,
                                               rcrainfo=self.rcrainfo)
            site = Site.objects.get(epa_site__epa_id=site_id)
            tracking_numbers: List[str] = manifest_service.search_rcra_mtn(site_id=site_id,
                                                                           start_date=site.last_rcra_sync)
            # limit the number of manifest to sync at a time to 30
            tracking_numbers = tracking_numbers[0:30]
            results: Dict[str, List[str]] = manifest_service.pull_manifests(
                tracking_numbers=tracking_numbers)
            # site.last_rcra_sync = datetime.now().replace(tzinfo=timezone.utc)
            site.save()
            return results
        except Site.DoesNotExist:
            logger.warning(f'Site Does not exists {site_id}')
            raise Exception

    @transaction.atomic
    def create_or_update_site(self, *, handler: Handler, site_name: str = None) -> Site:
        """
        Retrieve a site from the database or create.
        # ToDo convert to create_or_update_site()

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
