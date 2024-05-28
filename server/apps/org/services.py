from apps.org.models import Org


def get_org_by_id(org_id: str) -> Org:
    """Returns a HaztrakOrg instance or raise an exception"""
    return Org.objects.get(id=org_id)


def get_org_rcrainfo_api_credentials(org_id: str) -> tuple[str, str] | None:
    """Returns a tuple of (rcrainfo_api_id, rcrainfo_api_key)"""
    try:
        org = get_org_by_id(org_id)
        if org.is_rcrainfo_integrated:
            return org.rcrainfo_api_id_key
    except Org.DoesNotExist:
        return None


def get_rcrainfo_api_credentials_by_user(user_id: str) -> tuple[str, str] | None:
    """Returns a tuple of (rcrainfo_api_id, rcrainfo_api_key) corresponding to the user's org"""
    try:
        org = Org.objects.get(user_id=user_id)
        if org.is_rcrainfo_integrated:
            return org.rcrainfo_api_id_key
    except Org.DoesNotExist:
        return None
