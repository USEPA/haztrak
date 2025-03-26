from typing import Optional

import pytest
from org.models import Org, Site
from rcrasite.models import RcraSite


@pytest.fixture
def site_class_factory(faker):
    """Abstract factory for Site class."""

    def create_site(
        rcra_site: RcraSite | None = None,
        name: str | None = None,
        org: Org | None = None,
    ) -> Site:
        return Site(
            rcra_site=rcra_site or RcraSite(site_type="TSDF", epa_id="foo"),
            name=name or faker.name(),
            org=org or Org(name=faker.company()),
        )

    return create_site
