import logging
from datetime import UTC, datetime
from typing import Optional, TypedDict

from django.db import transaction

from apps.core.services import RcrainfoService, get_rcrainfo_client  # type: ignore
from apps.sites.models import HaztrakSite, RcraSite  # type: ignore
from apps.sites.serializers import RcraSiteSerializer  # type: ignore
from apps.trak.services import ManifestService  # type: ignore
from apps.trak.services.manifest_services import PullManifestsResult, TaskResponse  # type: ignore
from apps.trak.tasks import sync_site_manifests  # type: ignore

logger = logging.getLogger(__name__)


class HaztrakSiteServiceError(Exception):
    def __init__(self, message: str):
        super().__init__(message)


class HaztrakSiteService:
    """
    HaztrakSiteService encapsulates the Haztrak site subdomain business logic and use cases.
    """

    def __init__(
        self,
        *,
        username: str,
        site_id: Optional[str] = None,
        rcrainfo: Optional[RcrainfoService] = None,
    ):
        self.username = username
        self.rcrainfo = rcrainfo or get_rcrainfo_client(username=username)
        self.site_id = site_id

    def sync_rcrainfo_manifest(self, *, site_id: Optional[str] = None) -> TaskResponse:
        """Validate input and Launch a Celery task to sync a site's manifests from RCRAInfo"""
        logger.info(f"{self} sync rcra manifest, site ID {site_id}")
        task = sync_site_manifests.delay(site_id=site_id, username=self.username)
        return {"taskId": task.id}

    @transaction.atomic
    def sync_manifests(self, *, site_id: str) -> PullManifestsResult:
        """Pull manifests and update the last sync date for a site"""
        try:
            site = HaztrakSite.objects.get(rcra_site__epa_id=site_id)
            updated_mtn = self._get_updated_mtn(
                site_id=site.rcra_site.epa_id, last_sync_date=site.last_rcrainfo_manifest_sync
            )
            updated_mtn = updated_mtn[:15]  # temporary limit to 15
            logger.info(f"Pulling {updated_mtn} from RCRAInfo")
            manifest = ManifestService(username=self.username, rcrainfo=self.rcrainfo)
            results: PullManifestsResult = manifest.pull_manifests(tracking_numbers=updated_mtn)
            site.last_rcrainfo_manifest_sync = datetime.now(UTC)
            site.save()
            return results
        except HaztrakSite.DoesNotExist:
            logger.warning(f"Site Does not exists {site_id}")
            raise HaztrakSiteServiceError(f"Site Does not exists {site_id}")

    def _get_updated_mtn(self, site_id: str, last_sync_date: datetime) -> list[str]:
        logger.info(f"retrieving updated MTN for site {site_id}")
        manifest = ManifestService(username=self.username, rcrainfo=self.rcrainfo)
        return manifest.search_rcrainfo_mtn(site_id=site_id, start_date=last_sync_date)
