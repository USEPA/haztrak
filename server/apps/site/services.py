import logging
from datetime import UTC, datetime
from typing import Optional

from django.db import transaction
from django.db.models import QuerySet

from apps.core.services import get_rcrainfo_client
from apps.manifest.services import EManifest, PullManifestsResult, TaskResponse
from apps.manifest.services.emanifest_search import EmanifestSearch
from apps.manifest.tasks import sync_site_manifests
from apps.site.models import Site

logger = logging.getLogger(__name__)


class SiteServiceError(Exception):
    def __init__(self, message: str):
        super().__init__(message)


@transaction.atomic
def sync_manifests(*, site_id: str, username: str) -> PullManifestsResult:
    """Pull manifests and update the last sync date for a site"""
    try:
        rcra_client = get_rcrainfo_client(username=username)
        site = get_user_site(username=username, epa_id=site_id)
        updated_mtn = _get_updated_mtn(
            site_id=site.rcra_site.epa_id,
            last_sync_date=site.last_rcrainfo_manifest_sync,
            rcra_client=rcra_client,
        )
        updated_mtn = updated_mtn[:15]  # temporary limit to 15
        emanifest = EManifest(username=username, rcrainfo=rcra_client)
        results: PullManifestsResult = emanifest.pull(tracking_numbers=updated_mtn)
        update_last_emanifest_sync(site=site)
        return results
    except Site.DoesNotExist:
        logger.warning(f"Site Does not exists {site_id}")
        raise SiteServiceError(f"Site Does not exists {site_id}")


def _get_updated_mtn(site_id: str, last_sync_date: datetime, rcra_client) -> list[str]:
    logger.info(f"retrieving updated MTN for site {site_id}")
    response = (
        EmanifestSearch(rcra_client)
        .add_date_type("UpdatedDate")
        .add_site_id(site_id)
        .add_start_date(last_sync_date)
        .add_end_date()
        .execute()
    )
    if response.ok:
        return response.json()
    return []


@transaction.atomic
def update_last_emanifest_sync(site: Site, last_sync_date: Optional[datetime] = None):
    """Update the last sync date for a site. Defaults to now if no date is provided."""
    if last_sync_date is not None:
        site.last_rcrainfo_manifest_sync = last_sync_date
    else:
        site.last_rcrainfo_manifest_sync = datetime.now(UTC)
    site.save()


def filter_sites_by_org(org_id: str) -> [Site]:
    """Returns a list of Sites associated with an Org."""
    sites: QuerySet = Site.objects.filter(org_id=org_id).select_related("rcra_site")
    return sites


def get_user_site(username: str, epa_id: str) -> Site:
    """Returns a user Site if it exists, else throws a DoesNotExist exception."""
    return Site.objects.get_by_username_and_epa_id(username, epa_id)


def filter_sites_by_username(username: str) -> [Site]:
    """Returns a list of Sites associated with a user."""
    sites: QuerySet = Site.objects.filter_by_username(username)
    return sites


def sync_site_manifest_with_rcrainfo(
    *, username: str, site_id: Optional[str] = None
) -> TaskResponse:
    """Launch a batch processing task to sync a site's manifests from RCRAInfo"""
    task = sync_site_manifests.delay(site_id=site_id, username=username)
    return {"taskId": task.id}
