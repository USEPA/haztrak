from profile.models import RcrainfoProfile, RcrainfoSiteAccess
from typing import Optional

import pytest
from conftest import SiteIDProvider
from faker import Faker


@pytest.fixture
def rcrainfo_site_access_factory(db, rcra_site_factory, rcrainfo_profile_factory):
    """Abstract factory for crating model representing user's access to a site in RCRAInfo"""

    def create_permission(
        site: Optional[str] = None,
        profile: Optional[RcrainfoProfile] = None,
        site_manager: Optional[bool] = True,
        annual_report: Optional[str] = "Certifier",
        biennial_report: Optional[str] = "Certifier",
        e_manifest: Optional[str] = "Certifier",
        wiets: Optional[str] = "Certifier",
        my_rcra_id: Optional[str] = "Certifier",
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
