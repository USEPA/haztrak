import logging
from datetime import UTC, datetime
from typing import Dict, Optional, TypedDict

from django.core.cache import CacheKeyWarning, cache
from django.db import transaction
from rest_framework.exceptions import ErrorDetail, ValidationError

from apps.core.services import RcrainfoService  # type: ignore
from apps.sites.models import RcraSite, Site  # type: ignore
from apps.sites.serializers import RcraSiteSerializer  # type: ignore
from apps.trak.services import ManifestService  # type: ignore
from apps.trak.services.manifest_service import PullManifestsResult, TaskResponse  # type: ignore
from apps.trak.tasks import sync_site_manifests  # type: ignore

logger = logging.getLogger(__name__)


class HandlerSearchResults(TypedDict):
    sites: list[RcraSite]


class SiteServiceError(Exception):
    def __init__(self, message: str):
        super().__init__(message)


class SiteService:
    """
    SiteService encapsulates the Haztrak site subdomain business logic and use cases.
    """

    def __init__(
        self,
        *,
        username: str,
        site_id: Optional[str] = None,
        rcrainfo: Optional[RcrainfoService] = None,
    ):
        self.username = username
        self.rcrainfo = rcrainfo or RcrainfoService(api_username=username)
        self.site_id = site_id

    def sync_rcrainfo_manifest(self, *, site_id: Optional[str] = None) -> TaskResponse:
        """Validate input and Launch a Celery task to sync a site's manifests from RCRAInfo"""
        logger.info(f"{self} sync rcra manifest, site ID {site_id}")
        task = sync_site_manifests.delay(site_id=site_id, username=self.username)
        return {"taskId": task.id}

    @transaction.atomic
    def update_manifests(self, *, site_id: str) -> PullManifestsResult:
        """Pull manifests and update the last sync date for a site"""
        try:
            site = Site.objects.get(rcra_site__epa_id=site_id)
            updated_mtn = self.get_updated_mtn(
                site_id=site.rcra_site.epa_id, last_sync_date=site.last_rcra_sync
            )
            updated_mtn = updated_mtn[:15]  # temporary limit to 15
            logger.info(f"Pulling {updated_mtn} from RCRAInfo")
            manifest = ManifestService(username=self.username, rcrainfo=self.rcrainfo)
            results: PullManifestsResult = manifest.pull_manifests(tracking_numbers=updated_mtn)
            site.last_rcra_sync = datetime.now(UTC)
            site.save()
            return results
        except Site.DoesNotExist:
            logger.warning(f"Site Does not exists {site_id}")
            raise SiteServiceError(f"Site Does not exists {site_id}")

    def get_updated_mtn(self, site_id: str, last_sync_date: datetime) -> list[str]:
        logger.info(f"retrieving updated MTN for site {site_id}")
        manifest = ManifestService(username=self.username, rcrainfo=self.rcrainfo)
        return manifest.search_rcra_mtn(site_id=site_id, start_date=last_sync_date)

    @transaction.atomic
    def create_or_update_site(
        self, *, rcra_site: RcraSite, site_name: Optional[str] = None
    ) -> Site:
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

    def __init__(self, *, username: str, rcrainfo: Optional[RcrainfoService] = None):
        self.username = username
        self.rcrainfo = rcrainfo or RcrainfoService(api_username=self.username)

    def __repr__(self):
        return (
            f"<{self.__class__.__name__}(api_username='{self.username}', "
            f"rcrainfo='{self.rcrainfo}')>"
        )

    def pull_rcrainfo_site(self, *, site_id: str) -> RcraSite:
        """Retrieve a site/rcra_site from Rcrainfo and return RcraSiteSerializer"""
        rcra_site_data: Dict = self.rcrainfo.get_site(site_id).json()
        return self._update_or_create_rcra_site_from_json(rcra_site_data=rcra_site_data)

    def get_or_pull_rcra_site(self, site_id: str) -> RcraSite:
        """
        Retrieves a rcra_site from the database or Pull it from RCRAInfo.
        This may be trying to do too much
        """
        if RcraSite.objects.filter(epa_id=site_id).exists():
            logger.debug(f"using existing rcra_site {site_id}")
            return RcraSite.objects.get(epa_id=site_id)
        new_rcra_site = self.pull_rcrainfo_site(site_id=site_id)
        logger.debug(f"pulled new rcra_site {new_rcra_site}")
        return new_rcra_site

    def search_rcrainfo_handlers(self, **search_parameters) -> HandlerSearchResults:
        """
        Search RCRAInfo for a site by name or EPA ID
        """
        cache_key = (
            f'handlerSearch:epaSiteId:{search_parameters["epaSiteId"]}:siteType:'
            f'{search_parameters["siteType"]}'
        )
        try:
            data = cache.get(cache_key)
            if not data:
                data: HandlerSearchResults = self.rcrainfo.search_sites(**search_parameters).json()
                cache.set(
                    cache_key,
                    data,
                    60 * 60 * 24,
                )
            return data
        except CacheKeyWarning:
            raise ValidationError("Error retrieving data from cache")

    @transaction.atomic
    def _update_or_create_rcra_site_from_json(self, *, rcra_site_data: dict) -> RcraSite:
        serializer = RcraSiteSerializer(data=rcra_site_data)
        serializer.is_valid(raise_exception=True)
        return serializer.save()
