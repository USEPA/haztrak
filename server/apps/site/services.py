import logging
from datetime import UTC, datetime
from typing import Optional

from django.db import transaction
from django.db.models import QuerySet

from apps.site.models import Site
from manifest.services import TaskResponse
from manifest.tasks import sync_site_manifests

logger = logging.getLogger(__name__)


class SiteServiceError(Exception):
    def __init__(self, message: str):
        super().__init__(message)


@transaction.atomic
def update_emanifest_sync_date(site: Site, last_sync_date: Optional[datetime] = None):
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


def filter_sites_by_username_and_epa_id(username: str, epa_ids: [str]) -> [Site]:
    """Returns a list of Sites associated with a user."""
    sites: QuerySet = Site.objects.filter_by_username(username)
    other_sites = Site.objects.filter_by_epa_id(epa_ids)
    return [site for site in sites if site in other_sites]


def sync_site_manifest_with_rcrainfo(
    *, username: str, site_id: Optional[str] = None
) -> TaskResponse:
    """Launch a batch processing task to sync a site's manifests from RCRAInfo"""
    task = sync_site_manifests.delay(site_id=site_id, username=username)
    return {"taskId": task.id}
