from typing import Optional

import pytest

from apps.core.models import RcraProfile
from apps.sites.models import (
    RcraSite,
    RcraSitePermissions,
)


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

    return create_permission
