import logging
from typing import Dict, List

from django.db import transaction

from apps.core.services import RcrainfoService
from apps.sites.models import EpaSite, Site
from apps.trak.services.manifest_service import ManifestService

logger = logging.getLogger(__name__)


class SiteService:
    """
    SiteService encapsulates the site subdomain business logic and exposes methods
    corresponding to use cases.
    """

    def __init__(self, *, username: str, site_id: str = None, rcrainfo: RcrainfoService = None):
        self.username = username
        self.rcrainfo = rcrainfo or RcrainfoService(api_username=username)
        if site_id:
            self.site = Site.objects.get(epa_site__epa_id=site_id)

    def sync_rcra_manifest(self, *, site_id: str = None) -> Dict[str, List[str]]:
        """
        Retrieve a site's manifest from Rcrainfo and save to the database.

        Keyword Args:
            site_id (str): the epa_id to sync with RCRAInfo's manifest. Defaults self.site.
        """
        logger.info(f"{self} sync rcra manifest, site ID {site_id}")
        try:
            manifest_service = ManifestService(username=self.username, rcrainfo=self.rcrainfo)
            site = Site.objects.get(epa_site__epa_id=site_id or self.site)
            logger.info(f"site: {site}, manifest_service: {manifest_service}")
            tracking_numbers: List[str] = manifest_service.search_rcra_mtn(
                site_id=site_id, start_date=site.last_rcra_sync
            )
            # ToDo: uncomment this after we have manifest development fixtures
            # limit the number of manifest to sync at a time
            tracking_numbers = tracking_numbers[:30]
            logger.info(f"Pulling {tracking_numbers} from RCRAInfo")
            results: Dict[str, List[str]] = manifest_service.pull_manifests(
                tracking_numbers=tracking_numbers
            )
            # ToDo: uncomment this after we have manifest development fixtures
            # Update the Rcrainfo last sync date for future sync operations
            # site.last_rcra_sync = datetime.now().replace(tzinfo=timezone.utc)
            site.save()
            return results
        except Site.DoesNotExist:
            logger.warning(f"Site Does not exists {site_id}")
            raise Exception

    @transaction.atomic
    def create_or_update_site(self, *, epa_site: EpaSite, site_name: str = None) -> Site:
        """
        Retrieve a site from the database or create.

        Keyword Args:
            epa_site (EpaSite): An instance of the (hazardous waste) Handler model
            site_name (str): A haztrak alias for a site
        """
        if site_name is None:
            site_name = epa_site.name
        if Site.objects.filter(epa_site__epa_id=epa_site.epa_id).exists():
            return Site.objects.get(epa_site__epa_id=epa_site.epa_id)
        else:
            return Site.objects.create(epa_site=epa_site, name=site_name)
