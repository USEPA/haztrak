from django.db.models import QuerySet

from apps.sites.models.site_models import HaztrakOrg, HaztrakSite


def get_org(org_id: str) -> HaztrakOrg:
    """Returns a HaztrakOrg instance or raise an exception"""
    return HaztrakOrg.objects.get(id=org_id)


def get_org_rcrainfo_api_credentials(org_id: str) -> tuple[str, str] | None:
    """Returns a tuple of (rcrainfo_api_id, rcrainfo_api_key)"""
    try:
        org = get_org(org_id)
        if org.is_rcrainfo_integrated:
            return org.rcrainfo_api_id_key
    except HaztrakOrg.DoesNotExist:
        return None


def get_rcrainfo_api_credentials_by_user(user_id: str) -> tuple[str, str] | None:
    """Returns a tuple of (rcrainfo_api_id, rcrainfo_api_key) corresponding to the user's org"""
    try:
        org = HaztrakOrg.objects.get(user_id=user_id)
        if org.is_rcrainfo_integrated:
            return org.rcrainfo_api_id_key
    except HaztrakOrg.DoesNotExist:
        return None


def get_org_sites(org_id: str) -> [HaztrakSite]:
    """Returns a tuple of (rcrainfo_api_id, rcrainfo_api_key) corresponding to the user's org"""
    try:
        sites: QuerySet = HaztrakSite.objects.filter(org_id=org_id)
        sites.select_related("rcra_site")
        return sites
    except HaztrakSite.DoesNotExist:
        return None
