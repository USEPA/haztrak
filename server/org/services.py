from datetime import UTC, datetime
from typing import TYPE_CHECKING, Optional

from django.db import transaction
from django.db.models import QuerySet

from manifest.services import TaskResponse
from manifest.tasks import sync_site_manifests
from org.models import Org, Site

if TYPE_CHECKING:
    from django.contrib.auth.models import User


def get_org_by_id(org_id: str) -> Org:
    """Returns an Organization instance or raise a 404."""
    return Org.objects.get(id=org_id)


def get_org_by_slug(org_slug: str) -> Org:
    """Returns an Organization instance or raise a 404."""
    return Org.objects.get_by_slug(org_slug)


def get_org_rcrainfo_api_credentials(org_id: str) -> tuple[str, str] | None:
    """Returns a tuple of (rcrainfo_api_id, rcrainfo_api_key)."""
    try:
        org = get_org_by_id(org_id)
        if org.is_rcrainfo_integrated:
            return org.rcrainfo_api_id_key
    except Org.DoesNotExist:
        return None


def get_rcrainfo_api_credentials_by_user(user_id: str) -> tuple[str, str] | None:
    """Returns a tuple of (rcrainfo_api_id, rcrainfo_api_key) corresponding to the user's org."""
    try:
        org = Org.objects.get(user_id=user_id)
        if org.is_rcrainfo_integrated:
            return org.rcrainfo_api_id_key
    except Org.DoesNotExist:
        return None


class SiteServiceError(Exception):
    def __init__(self, message: str):
        super().__init__(message)


@transaction.atomic
def update_emanifest_sync_date(site: Site, last_sync_date: datetime | None = None):
    """Update the last sync date for a site. Defaults to now if no date is provided."""
    if last_sync_date is not None:
        site.last_rcrainfo_manifest_sync = last_sync_date
    else:
        site.last_rcrainfo_manifest_sync = datetime.now(UTC)
    site.save()


def filter_sites_by_org(org_slug: str) -> QuerySet[Site]:
    """Returns a list of Sites associated with an Org."""
    return Site.objects.filter(org__slug=org_slug).select_related("rcra_site")


def get_user_site(username: str, epa_id: str) -> Site:
    """Returns a user Site if it exists, else throws a DoesNotExist exception."""
    return Site.objects.get_by_username_and_epa_id(username, epa_id)


def get_site_by_epa_id(epa_id: str) -> Site:
    """Returns a Site by its RCRA EPA ID number, else throws a DoesNotExist exception."""
    return Site.objects.get_by_epa_id(epa_id)


def find_sites_by_user(user: "User") -> QuerySet[Site]:
    """Returns a list of Sites associated with a user."""
    return Site.objects.filter_by_user(user)


def filter_sites_by_username(username: str) -> QuerySet[Site]:
    """Returns a list of Sites associated with a user."""
    return Site.objects.filter_by_username(username)


def filter_sites_by_username_and_epa_id(username: str, epa_ids: [str]) -> [Site]:
    """Returns a list of Sites associated with a user."""
    sites: QuerySet = Site.objects.filter_by_username(username)
    other_sites = Site.objects.filter_by_epa_id(epa_ids)
    return [site for site in sites if site in other_sites]


def sync_site_manifest_with_rcrainfo(
    *,
    username: str,
    site_id: str | None = None,
) -> TaskResponse:
    """Launch a batch processing task to sync a site's manifests from RCRAInfo."""
    task = sync_site_manifests.delay(site_id=site_id, username=username)
    return {"taskId": task.id}
