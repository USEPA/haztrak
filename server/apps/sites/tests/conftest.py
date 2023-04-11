from typing import Optional

import pytest

from apps.sites.models import (
    RcraProfile,
    RcraSitePermission,
    Site,
)


@pytest.fixture
def rcra_permission_factory(db, site_factory, rcra_profile_factory):
    """Abstract factory for Haztrak RcraSitePermission model"""

    def create_permission(
        site: Optional[Site] = None,
        profile: Optional[RcraProfile] = None,
        site_manager: Optional[bool] = True,
        annual_report: Optional[str] = "Certifier",
        biennial_report: Optional[str] = "Certifier",
        e_manifest: Optional[str] = "Certifier",
        wiets: Optional[str] = "Certifier",
        my_rcra_id: Optional[str] = "Certifier",
    ) -> RcraSitePermission:
        """Returns testuser1 RcraSitePermission model to site_generator"""
        return RcraSitePermission.objects.create(
            site=site or site_factory(),
            profile=profile or rcra_profile_factory(),
            site_manager=site_manager,
            annual_report=annual_report,
            biennial_report=biennial_report,
            e_manifest=e_manifest,
            wiets=wiets,
            my_rcra_id=my_rcra_id,
        )

    yield create_permission
