from profile.models import RcrainfoProfile, RcrainfoSiteAccess
from typing import Optional

import pytest
from faker import Faker

from conftest import SiteIDProvider


@pytest.fixture
def rcrainfo_site_access_factory(db, rcra_site_factory, rcrainfo_profile_factory):
    """Abstract factory for crating model representing user's access to a site in RCRAInfo."""

    def create_permission(
        site: str | None = None,
        profile: RcrainfoProfile | None = None,
        site_manager: bool | None = True,
        annual_report: str | None = "Certifier",
        biennial_report: str | None = "Certifier",
        e_manifest: str | None = "Certifier",
        wiets: str | None = "Certifier",
        my_rcra_id: str | None = "Certifier",
    ) -> RcrainfoSiteAccess:
        fake = Faker()
        fake.add_provider(SiteIDProvider)
        return RcrainfoSiteAccess.objects.create(
            site=site or fake.site_id(),
            profile=profile or rcrainfo_profile_factory(),
            site_manager=site_manager,
            annual_report=annual_report,
            biennial_report=biennial_report,
            e_manifest=e_manifest,
            wiets=wiets,
            my_rcra_id=my_rcra_id,
        )

    return create_permission
