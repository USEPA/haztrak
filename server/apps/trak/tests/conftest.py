import random
import string
from datetime import UTC, datetime
from typing import Optional

import pytest
from faker import Faker
from faker.providers import BaseProvider

from apps.sites.models import RcraSite, RcraSiteType
from apps.trak.models import (
    DotLookup,
    ESignature,
    Handler,
    Manifest,
    PaperSignature,
    Signer,
    Transporter,
    WasteCode,
)
from apps.trak.models.waste_models import DotLookupType, WasteLine


class MTNProvider(BaseProvider):
    SUFFIXES = ["ELC", "JJK", "FLE"]
    NUMBERS = ["".join(random.choices(string.digits, k=9)) for _ in range(100)]

    def mtn(self):
        return f"{self.random_element(self.NUMBERS)}{self.random_element(self.SUFFIXES)}"


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
def waste_code_factory(db):
    """Abstract factory for waste codes"""

    def create_waste_code(
        code: Optional[str] = "D001",
        description: Optional[str] = "IGNITABLE WASTE",
        code_type: Optional[WasteCode.CodeType] = WasteCode.CodeType.FEDERAL,
        state_id: Optional[str] = "VA",
    ) -> WasteCode:
        if code_type == WasteCode.CodeType.STATE:
            waste_code = WasteCode.objects.create(
                code=code,
                description=description,
                code_type=code_type,
                state_id=state_id,
            )
        else:
            waste_code = WasteCode.objects.create(
                code=code,
                description=description,
                code_type=code_type,
            )
        return waste_code

    return create_waste_code


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


@pytest.fixture
def manifest_factory(db, manifest_handler_factory, rcra_site_factory):
    """Abstract factory for Haztrak Manifest model"""

    def create_manifest(
        mtn: Optional[str] = None,
        generator: Optional[Handler] = None,
        tsdf: Optional[Handler] = None,
    ) -> Manifest:
        fake = Faker()
        fake.add_provider(MTNProvider)
        return Manifest.objects.create(
            mtn=mtn or fake.mtn(),
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


@pytest.fixture
def waste_line_factory(db, faker: Faker):
    """Abstract factory for Haztrak DotLookup model"""

    def create_waste_line(
        manifest: Manifest = None,
        dot_hazardous: Optional[bool] = True,
        quantity: Optional[dict] = None,
        line_number: Optional[int] = 1,
        br: Optional[bool] = False,
        pcb: Optional[bool] = False,
        epa_waste: Optional[bool] = True,
    ) -> WasteLine:
        return WasteLine.objects.create(
            manifest=manifest,
            dot_hazardous=dot_hazardous,
            quantity=quantity or {"units": "G", "value": 1},  # Temporary
            line_number=line_number,
            br=br,
            pcb=pcb,
            epa_waste=epa_waste,
        )

    return create_waste_line


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

    return create_dot_option
