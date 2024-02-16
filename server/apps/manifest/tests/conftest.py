import random
import string
from datetime import UTC, datetime
from typing import Optional

import pytest
from faker import Faker
from faker.providers import BaseProvider

from apps.handler.models import Handler
from apps.manifest.models import Manifest
from apps.rcrasite.models import RcraSiteType


class MtnProvider(BaseProvider):
    SUFFIXES = ["ELC", "JJK", "FLE"]
    STATUSES = ["NotAssigned", "Pending", "Scheduled", "InTransit", "ReadyForSignature"]
    NUMBERS = ["".join(random.choices(string.digits, k=9)) for _ in range(100)]

    def mtn(self):
        return f"{self.random_element(self.NUMBERS)}{self.random_element(self.SUFFIXES)}"

    def status(self):
        return f"{self.random_element(self.STATUSES)}"


@pytest.fixture
def manifest_factory(db, manifest_handler_factory, rcra_site_factory):
    """Abstract factory for Haztrak Manifest model"""

    def create_manifest(
        mtn: Optional[str] = None,
        generator: Optional[Handler] = None,
        tsdf: Optional[Handler] = None,
        status: Optional[str] = None,
    ) -> Manifest:
        fake = Faker()
        fake.add_provider(MtnProvider)
        return Manifest.objects.create(
            mtn=mtn or fake.mtn(),
            status=status or fake.status(),
            created_date=datetime.now(UTC),
            potential_ship_date=datetime.now(UTC),
            generator=generator
            or manifest_handler_factory(
                rcra_site=rcra_site_factory(site_type=RcraSiteType.GENERATOR)
            ),
            tsdf=tsdf
            or manifest_handler_factory(rcra_site=rcra_site_factory(site_type=RcraSiteType.TSDF)),
        )

    return create_manifest
