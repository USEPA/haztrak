"""Manifest services."""

import logging
from typing import Literal

from django.db import transaction
from django.db.models import Q, QuerySet
from manifest.models import Manifest
from manifest.services import EManifest, EManifestError, TaskResponse
from manifest.tasks import save_to_emanifest as save_to_emanifest_task
from org.models import Site

logger = logging.getLogger(__name__)


@transaction.atomic
def update_manifest(*, username: str, mtn: str, data: dict) -> Manifest:
    """Update a manifest in the Haztrak database."""
    try:
        original_manifest = Manifest.objects.get(mtn=mtn)
        return Manifest.objects.save(original_manifest, **data)
    except Manifest.DoesNotExist as exc:
        msg = f"manifest {mtn} does not exist"
        raise EManifestError(msg) from exc


def get_manifests(
    *,
    username: str,
    epa_id: str | None = None,
    site_type: Literal["Generator", "Tsdf", "Transporter"] | None = None,
) -> QuerySet[Manifest]:
    """Get a list of manifest tracking numbers and select details for a users site."""
    sites: QuerySet[Site] = Site.objects.filter_by_username(username).values("rcra_site__epa_id")
    if epa_id:
        sites = sites.filter(rcra_site__epa_id__iexact=epa_id)
    if site_type:
        return Manifest.objects.filter(Q(**{f"{site_type.lower()}__rcra_site__epa_id__in": sites}))
    return Manifest.objects.filter(
        Q(generator__rcra_site__epa_id__in=sites)
        | Q(tsdf__rcra_site__epa_id__in=sites)
        | Q(transporters__rcra_site__epa_id__in=sites),
    )


def save_emanifest(*, data: dict, username: str) -> TaskResponse:
    """Save a manifest to e-Manifest/RCRAInfo."""
    emanifest = EManifest(username=username)
    if emanifest.is_available:
        task = save_to_emanifest_task.delay(manifest_data=data, username=username)
        return TaskResponse(taskId=task.id)
    msg = "e-Manifest is not available"
    raise EManifestError(msg)


@transaction.atomic
def create_manifest(*, username: str, data: dict) -> Manifest:
    """Save a manifest to Haztrak database and/or e-Manifest/RCRAInfo."""
    return Manifest.objects.save(None, **data)
