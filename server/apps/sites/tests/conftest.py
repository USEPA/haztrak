from typing import Optional

import pytest

from apps.sites.models import (
    EpaProfile,
    Site,
    SitePermission,
)


@pytest.fixture
def site_permission_factory(db, site_factory, epa_profile_factory):
    """Abstract factory for Haztrak SitePermission model"""

    def create_permission(
        site: Optional[Site] = None,
        profile: Optional[EpaProfile] = None,
        site_manager: Optional[bool] = True,
        annual_report: Optional[str] = "Certifier",
        biennial_report: Optional[str] = "Certifier",
        e_manifest: Optional[str] = "Certifier",
        wiets: Optional[str] = "Certifier",
        my_rcra_id: Optional[str] = "Certifier",
    ) -> SitePermission:
        """Returns testuser1 SitePermission model to site_generator"""
        return SitePermission.objects.create(
            site=site or site_factory(),
            profile=profile or epa_profile_factory(),
            site_manager=site_manager,
            annual_report=annual_report,
            biennial_report=biennial_report,
            e_manifest=e_manifest,
            wiets=wiets,
            my_rcra_id=my_rcra_id,
        )

    yield create_permission
