import logging
from typing import Dict, List

from django.db import transaction
from rest_framework.exceptions import ValidationError

from apps.core.services import RcrainfoService
from apps.sites.models import RcraSite, Site
from apps.sites.serializers import RcraSiteSerializer
from apps.trak.services import ManifestService

logger = logging.getLogger(__name__)


class SiteService:
    """
    SiteService encapsulates the Haztrak site subdomain business logic and use cases.
    """

    def __init__(self, *, username: str, site_id: str = None, rcrainfo: RcrainfoService = None):
        self.username = username
        self.rcrainfo = rcrainfo or RcrainfoService(api_username=username)
        if site_id:
            self.site = Site.objects.get(rcra_site__epa_id=site_id)

    def sync_rcra_manifest(self, *, site_id: str = None) -> Dict[str, List[str]]:
        """
        Retrieve a site's manifest from Rcrainfo and save to the database.

        Keyword Args:
            site_id (str): the epa_id to sync with RCRAInfo's manifest. Defaults self.site.
        """
        logger.info(f"{self} sync rcra manifest, site ID {site_id}")
        try:
            manifest_service = ManifestService(username=self.username, rcrainfo=self.rcrainfo)
            site = Site.objects.get(rcra_site__epa_id=site_id or self.site)
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
    def create_or_update_site(self, *, rcra_site: RcraSite, site_name: str = None) -> Site:
        """
        Retrieve a site from the database or create.

        Keyword Args:
            rcra_site (RcraSite): An instance of the (hazardous waste) Handler model
            site_name (str): A haztrak alias for a site
        """
        if site_name is None:
            site_name = rcra_site.name
        if Site.objects.filter(rcra_site__epa_id=rcra_site.epa_id).exists():
            return Site.objects.get(rcra_site__epa_id=rcra_site.epa_id)
        else:
            return Site.objects.create(rcra_site=rcra_site, name=site_name)


class RcraSiteService:
    """
    RcraSiteService houses the (high-level) rcra_site subdomain specific business logic.
    RcraSiteService's public interface needs to be controlled strictly, public method
    directly relate to use cases.
    """

    def __init__(self, *, username: str, rcrainfo: RcrainfoService = None):
        self.username = username
        self.rcrainfo = rcrainfo or RcrainfoService(api_username=self.username)
        self.logger = logging.getLogger(__name__)

    def __repr__(self):
        return (
            f"<{self.__class__.__name__}(api_username='{self.username}', "
            f"rcrainfo='{self.rcrainfo}')>"
        )

    def pull_rcra_site(self, *, site_id: str) -> RcraSite:
        """
        Retrieve a site/rcra_site from Rcrainfo and return RcraSiteSerializer
        """
        rcra_site_data: Dict = self.rcrainfo.get_site(site_id).json()
        rcra_site_serializer: RcraSiteSerializer = self._deserialize_rcra_site(
            rcra_site_data=rcra_site_data
        )
        return self._create_or_update_rcra_site(rcra_site_data=rcra_site_serializer.validated_data)

    def get_or_pull_rcra_site(self, site_id: str) -> RcraSite:
        """
        Retrieves an rcra_site from the database or Pull it from RCRAInfo.
        This may be trying to do too much
        """
        if RcraSite.objects.filter(epa_id=site_id).exists():
            self.logger.debug(f"using existing rcra_site {site_id}")
            return RcraSite.objects.get(epa_id=site_id)
        new_rcra_site = self.pull_rcra_site(site_id=site_id)
        self.logger.debug(f"pulled new rcra_site {new_rcra_site}")
        return new_rcra_site

    def _deserialize_rcra_site(self, *, rcra_site_data: dict) -> RcraSiteSerializer:
        serializer = RcraSiteSerializer(data=rcra_site_data)
        if serializer.is_valid():
            return serializer
        self.logger.error(serializer.errors)
        raise ValidationError(serializer.errors)

    @transaction.atomic
    def _create_or_update_rcra_site(self, *, rcra_site_data: dict) -> RcraSite:
        epa_id = rcra_site_data.get("epa_id")
        if RcraSite.objects.filter(epa_id=epa_id).exists():
            rcra_site = RcraSite.objects.get(epa_id=epa_id)
            return rcra_site
        rcra_site = RcraSite.objects.save(**rcra_site_data)
        return rcra_site
