import random
import string
from datetime import UTC, datetime
from typing import Optional

import pytest
from django.db import IntegrityError
from faker import Faker
from faker.providers import BaseProvider
from rcrasite.models import RcraSite, RcraSiteType

from manifest.models import (
    ESignature,
    Handler,
    Manifest,
    PaperSignature,
    Signer,
    Transporter,
)


@pytest.fixture
def manifest_handler_factory(db, rcra_site_factory, paper_signature_factory):
    """Abstract factory for Haztrak Handler model"""

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
    """Abstract factory for Haztrak Handler model"""

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


@pytest.fixture
def e_signature_factory(db, signer_factory, manifest_handler_factory, faker: Faker):
    """Abstract factory for Haztrak Handler model"""

    def create_e_signature(
        signer: Optional[Signer] = None,
        manifest_handler: Optional[Handler] = None,
    ) -> ESignature:
        return ESignature.objects.create(
            signer=signer or signer_factory(),
            manifest_handler=manifest_handler or manifest_handler_factory(),
            sign_date=datetime.now(UTC),
            cromerr_activity_id=faker.pystr(max_chars=10),
            cromerr_document_id=faker.pystr(max_chars=10),
            on_behalf=False,
        )

    return create_e_signature


@pytest.fixture
def signer_factory(db, faker: Faker):
    """Abstract factory for Haztrak Signer model"""

    def creat_signer(
        first_name: Optional[str] = None,
        middle_initial: Optional[str] = None,
        last_name: Optional[str] = None,
        signer_role: Optional[str] = "EP",
        company_name: Optional[str] = None,
        rcra_user_id: Optional[str] = None,
    ) -> Signer:
        return Signer.objects.create(
            first_name=first_name or faker.first_name(),
            middle_initial=middle_initial or faker.pystr(max_chars=1),
            last_name=last_name or faker.last_name(),
            signer_role=signer_role,
            company_name=company_name or faker.company(),
            rcra_user_id=rcra_user_id or faker.user_name(),
        )

    return creat_signer


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
