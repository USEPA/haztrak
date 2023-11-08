from typing import Optional

import pytest

from apps.core.models import HaztrakProfile, RcraProfile
from apps.sites.models import (
    HaztrakSite,
    RcraSite,
    RcraSitePermissions,
    SitePermissions,
)


@pytest.fixture
def site_access_factory(db, haztrak_site_factory, haztrak_profile_factory):
    """Abstract factory for Haztrak RcraSitePermissions model"""

    def create_permission(
        site: Optional[HaztrakSite] = None,
        profile: Optional[HaztrakProfile] = None,
        emanifest: Optional[str] = "viewer",
    ) -> RcraSitePermissions:
        """Returns testuser1 RcraSitePermissions model to site_generator"""
        return SitePermissions.objects.create(
            site=site or haztrak_site_factory(),
            profile=profile or haztrak_profile_factory(),
            emanifest=emanifest,
        )

    yield create_permission


@pytest.fixture
def rcra_permission_factory(db, rcra_site_factory, rcra_profile_factory):
    """Abstract factory for Haztrak RcraSitePermissions model"""

    def create_permission(
        site: Optional[RcraSite] = None,
        profile: Optional[RcraProfile] = None,
        site_manager: Optional[bool] = True,
        annual_report: Optional[str] = "Certifier",
        biennial_report: Optional[str] = "Certifier",
        e_manifest: Optional[str] = "Certifier",
        wiets: Optional[str] = "Certifier",
        my_rcra_id: Optional[str] = "Certifier",
    ) -> RcraSitePermissions:
        """Returns testuser1 RcraSitePermissions model to site_generator"""
        return RcraSitePermissions.objects.create(
            site=site or rcra_site_factory(),
            profile=profile or rcra_profile_factory(),
            site_manager=site_manager,
            annual_report=annual_report,
            biennial_report=biennial_report,
            e_manifest=e_manifest,
            wiets=wiets,
            my_rcra_id=my_rcra_id,
        )

    yield create_permission
