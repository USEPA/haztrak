import logging
from typing import Literal, Optional

from django.db import transaction
from django.db.models import Q, QuerySet

from apps.sites.models import HaztrakSite
from apps.trak.models import Manifest
from apps.trak.services import EManifestError

logger = logging.getLogger(__name__)


@transaction.atomic
def update_manifest(*, mtn: Optional[str], data: dict) -> Manifest:
    """Update a manifest in the Haztrak database"""
    try:
        original_manifest = Manifest.objects.get(mtn=mtn)
        manifest = Manifest.objects.save(original_manifest, **data)
        return manifest
    except Manifest.DoesNotExist:
        raise EManifestError(f"manifest {mtn} does not exist")


def get_manifests(
        *,
        username: str,
        epa_id: Optional[str] = None,
        site_type: Optional[Literal["Generator", "Tsdf", "Transporter"]] = None,
) -> QuerySet[Manifest]:
    """Get a list of manifest tracking numbers and select details for a users site"""
    sites: QuerySet[HaztrakSite] = (
        HaztrakSite.objects.select_related("rcra_site")
        .filter(sitepermissions__profile__user__username=username)
        .values("rcra_site__epa_id")
    )
    if epa_id:
        sites = sites.filter(rcra_site__epa_id__iexact=epa_id)
    if site_type:
        return Manifest.objects.filter(Q(**{f"{site_type.lower()}__rcra_site__epa_id__in": sites}))
    else:
        return Manifest.objects.filter(
            Q(generator__rcra_site__epa_id__in=sites)
            | Q(tsdf__rcra_site__epa_id__in=sites)
            | Q(transporters__rcra_site__epa_id__in=sites)
        )
