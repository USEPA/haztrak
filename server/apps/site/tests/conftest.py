from typing import Optional

import pytest

from apps.org.models import Org
from apps.rcrasite.models import RcraSite
from apps.site.models import Site


@pytest.fixture
def site_class_factory(faker):
    """Abstract factory for Site class"""

    def create_site(
        rcra_site: Optional[RcraSite] = None,
        name: Optional[str] = None,
        org: Optional[Org] = None,
    ) -> Site:
        return Site(
            rcra_site=rcra_site or RcraSite(site_type="TSDF", epa_id="foo"),
            name=name or faker.name(),
            org=org or Org(name=faker.company()),
        )

    return create_site
