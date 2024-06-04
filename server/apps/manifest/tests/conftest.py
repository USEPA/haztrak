import random
import string
from datetime import UTC, datetime
from typing import Optional

import pytest
from django.db import IntegrityError
from faker import Faker
from faker.providers import BaseProvider

from apps.handler.models import Handler, PaperSignature, Transporter
from apps.manifest.models import Manifest
from apps.rcrasite.models import RcraSite, RcraSiteType


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
    """Abstract factory for hazardous waste Manifest model"""

    def create_manifest(
        mtn: Optional[str] = None,
        generator: Optional[Handler] = None,
        tsdf: Optional[Handler] = None,
        status: Optional[str] = None,
    ) -> Manifest:
        fake = Faker()
        fake.add_provider(MtnProvider)
        while True:
            try:
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
                    or manifest_handler_factory(
                        rcra_site=rcra_site_factory(site_type=RcraSiteType.TSDF)
                    ),
                )
            except IntegrityError:
                return Manifest.objects.create(
                    mtn=fake.mtn(),
                    status=status or fake.status(),
                    created_date=datetime.now(UTC),
                    potential_ship_date=datetime.now(UTC),
                    generator=generator
                    or manifest_handler_factory(
                        rcra_site=rcra_site_factory(site_type=RcraSiteType.GENERATOR)
                    ),
                    tsdf=tsdf
                    or manifest_handler_factory(
                        rcra_site=rcra_site_factory(site_type=RcraSiteType.TSDF)
                    ),
                )

    return create_manifest


@pytest.fixture
def manifest_handler_factory(db, rcra_site_factory, paper_signature_factory):
    """Abstract factory for manifest Handler model"""

    def create_manifest_handler(
        rcra_site: Optional[RcraSite] = None,
        paper_signature: Optional[PaperSignature] = None,
    ) -> Handler:
        return Handler.objects.create(
            rcra_site=rcra_site or rcra_site_factory(),
            paper_signature=paper_signature or paper_signature_factory(),
        )

    return create_manifest_handler


@pytest.fixture
def manifest_transporter_factory(db, rcra_site_factory, paper_signature_factory):
    """Abstract factory for the manifest transporter model"""

    def create_manifest_handler(
        rcra_site: Optional[RcraSite] = None,
        paper_signature: Optional[PaperSignature] = None,
        manifest: Manifest = None,
        order: Optional[int] = 1,
    ) -> Transporter:
        return Transporter.objects.create(
            manifest=manifest,
            order=order,
            rcra_site=rcra_site or rcra_site_factory(),
            paper_signature=paper_signature or paper_signature_factory(),
        )

    return create_manifest_handler


@pytest.fixture
def paper_signature_factory(db, faker: Faker):
    """Abstract factory for Paper Signature"""

    def create_signature(
        printed_name: Optional[str] = None,
        sign_date: Optional[datetime] = None,
    ) -> PaperSignature:
        return PaperSignature.objects.create(
            printed_name=printed_name or faker.name(),
            sign_date=sign_date or datetime.now(UTC),
        )

    return create_signature
