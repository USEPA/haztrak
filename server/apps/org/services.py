from django.db.models import QuerySet

from apps.org.models import TrakOrg
from apps.site.models import TrakSite


def get_org_by_id(org_id: str) -> TrakOrg:
    """Returns a HaztrakOrg instance or raise an exception"""
    return TrakOrg.objects.get(id=org_id)


def get_org_rcrainfo_api_credentials(org_id: str) -> tuple[str, str] | None:
    """Returns a tuple of (rcrainfo_api_id, rcrainfo_api_key)"""
    try:
        org = get_org_by_id(org_id)
        if org.is_rcrainfo_integrated:
            return org.rcrainfo_api_id_key
    except TrakOrg.DoesNotExist:
        return None


def get_rcrainfo_api_credentials_by_user(user_id: str) -> tuple[str, str] | None:
    """Returns a tuple of (rcrainfo_api_id, rcrainfo_api_key) corresponding to the user's org"""
    try:
        org = TrakOrg.objects.get(user_id=user_id)
        if org.is_rcrainfo_integrated:
            return org.rcrainfo_api_id_key
    except TrakOrg.DoesNotExist:
        return None


def get_org_sites(org_id: str) -> [TrakSite]:
    """Returns a tuple of (rcrainfo_api_id, rcrainfo_api_key) corresponding to the user's org"""
    try:
        sites: QuerySet = TrakSite.objects.filter(org_id=org_id)
        sites.select_related("rcra_site")
        return sites
    except TrakSite.DoesNotExist:
        return None
