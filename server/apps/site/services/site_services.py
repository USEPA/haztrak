import logging
from datetime import UTC, datetime
from typing import Optional

from django.db import transaction

from apps.core.services import RcrainfoService, get_rcrainfo_client
from apps.site.models import HaztrakSite
from apps.trak.services import EManifest, PullManifestsResult, TaskResponse
from apps.trak.tasks import sync_site_manifests

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
            emanifest = EManifest(username=self.username, rcrainfo=self.rcrainfo)
            results: PullManifestsResult = emanifest.pull(tracking_numbers=updated_mtn)
            site.last_rcrainfo_manifest_sync = datetime.now(UTC)
            site.save()
            return results
        except HaztrakSite.DoesNotExist:
            logger.warning(f"Site Does not exists {site_id}")
            raise HaztrakSiteServiceError(f"Site Does not exists {site_id}")

    def _get_updated_mtn(self, site_id: str, last_sync_date: datetime) -> list[str]:
        logger.info(f"retrieving updated MTN for site {site_id}")
        emanifest = EManifest(username=self.username, rcrainfo=self.rcrainfo)
        return emanifest.search(site_id=site_id, start_date=last_sync_date)


# ToDo: all of our current HaztrakSite service class (1) does not need to be a class and (2) should
#  probably be moved to the manifest service module
# def get_user_sites(*, username: str) -> QuerySet[HaztrakSite]:
#     """Get a user's sites"""
#     return HaztrakSite.objects.filter(haztrak_profile__user__username=username)
