import logging
from datetime import UTC, datetime
from typing import Optional

from django.db import transaction
from django.db.models import QuerySet

from apps.core.services import RcrainfoService, get_rcrainfo_client
from apps.manifest.services import EManifest, PullManifestsResult, TaskResponse
from apps.manifest.services.emanifest_search import EmanifestSearch
from apps.manifest.tasks import sync_site_manifests
from apps.site.models import Site

logger = logging.getLogger(__name__)


class SiteService:
    """
    Business logic and use cases related to a Site,
    a location that conducts hazardous waste activities.
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
            site = Site.objects.get_by_epa_id(site_id)
            updated_mtn = self._get_updated_mtn(
                site_id=site.rcra_site.epa_id, last_sync_date=site.last_rcrainfo_manifest_sync
            )
            updated_mtn = updated_mtn[:15]  # temporary limit to 15
            logger.info(f"Pulling {updated_mtn} from RCRAInfo")
            emanifest = EManifest(username=self.username, rcrainfo=self.rcrainfo)
            results: PullManifestsResult = emanifest.pull(tracking_numbers=updated_mtn)
            site.last_rcrainfo_manifest_sync = datetime.now(UTC)
            site.save()
            return results
        except Site.DoesNotExist:
            logger.warning(f"Site Does not exists {site_id}")
            raise SiteServiceError(f"Site Does not exists {site_id}")

    def _get_updated_mtn(self, site_id: str, last_sync_date: datetime) -> list[str]:
        logger.info(f"retrieving updated MTN for site {site_id}")
        return (
            EmanifestSearch(self.rcrainfo)
            .add_site_id(site_id)
            .add_start_date(last_sync_date)
            .add_end_date()
            .execute()
        )


class SiteServiceError(Exception):
    def __init__(self, message: str):
        super().__init__(message)


def filter_sites_by_org(org_id: str) -> [Site]:
    """Returns a list of Sites associated with an Org."""
    sites: QuerySet = Site.objects.filter(org_id=org_id).select_related("rcra_site")
    return sites
