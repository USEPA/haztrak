from datetime import UTC, datetime
from typing import Optional

import pytest
from faker import Faker

from handler.models import (
    ESignature,
    Handler,
    PaperSignature,
    Signer,
    Transporter,
)
from manifest.models import Manifest
from rcrasite.models import RcraSite


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
