import random
import string
from datetime import UTC, datetime, timezone
from typing import Dict, List, Optional

import pytest
from faker import Faker

from apps.sites.models import RcraSite, RcraSiteType
from apps.trak.models import (
    DotLookup,
    ESignature,
    Handler,
    Manifest,
    PaperSignature,
    Signer,
    WasteCode,
)
from apps.trak.models.waste_models import DotLookupType


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

    yield create_manifest_handler


@pytest.fixture
def quicker_sign_response_factory(faker: Faker):
    """
    Factory for creating dynamic quicker sign response data
    """

    def create_quicker_sign(
        mtn: List[str],
        site_id: str,
        site_type: Optional[RcraSiteType] = RcraSiteType.GENERATOR,
        printed_name: Optional[str] = None,
        sign_date: Optional[datetime] = datetime.utcnow().replace(tzinfo=timezone.utc),
        transporter_order: Optional[int] = None,
    ) -> Dict:
        sign_date_iso = sign_date.isoformat(timespec="milliseconds")
        return {
            "reportId": "5fff5aab-2172-4a28-b530-f4c42f1bfdaf",
            "date": sign_date_iso,
            "operationStatus": "Completed",
            "manifestReports": [{"manifestTrackingNumber": mtn} for mtn in mtn],
            "signerReport": {
                "printedSignatureName": printed_name or faker.name(),
                "printedSignatureDate": sign_date_iso,
                "electronicSignatureDate": sign_date_iso,
                "firstName": "David",
                "lastName": "Graham",
                "userId": "DPGRAHAM4401",
                "warnings": [],
            },
            "siteReport": {"siteId": site_id, "siteType": str(site_type.label)},
        }

    yield create_quicker_sign


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

    yield create_signature


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

    yield create_e_signature


@pytest.fixture
def waste_code_factory(db):
    """Abstract factory for waste codes"""

    def create_waste_code(
        code: Optional[str] = "D001",
        description: Optional[str] = "IGNITABLE WASTE",
        code_type: Optional[WasteCode.CodeType] = WasteCode.CodeType.FEDERAL,
    ) -> WasteCode:
        waste_code = WasteCode.objects.create(
            code=code,
            description=description,
            code_type=code_type,
        )
        return waste_code

    yield create_waste_code


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

    yield creat_signer


@pytest.fixture
def manifest_factory(db, manifest_handler_factory, rcra_site_factory):
    """Abstract factory for Haztrak Manifest model"""

    def create_manifest(
        mtn: Optional[str] = "123456789ELC",
        generator: Optional[Handler] = None,
        tsdf: Optional[Handler] = None,
    ) -> Manifest:
        return Manifest.objects.create(
            mtn=mtn,
            created_date=datetime.now(UTC),
            potential_ship_date=datetime.now(UTC),
            generator=generator
            or manifest_handler_factory(
                rcra_site=rcra_site_factory(site_type=RcraSiteType.GENERATOR)
            ),
            tsdf=tsdf
            or manifest_handler_factory(rcra_site=rcra_site_factory(site_type=RcraSiteType.TSDF)),
        )

    yield create_manifest


@pytest.fixture
def dot_option_factory(db, faker: Faker):
    """Abstract factory for Haztrak DotLookup model"""

    def create_dot_option(
        value: Optional[str] = None,
        value_type: Optional[DotLookupType] = DotLookupType.ID,
    ) -> Manifest:
        return DotLookup.objects.create(
            value=value or faker.pystr(max_chars=10), value_type=value_type
        )

    yield create_dot_option
