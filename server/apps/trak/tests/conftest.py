import random
import string
from datetime import datetime, timezone
from typing import Dict, List, Optional

import pytest

from apps.sites.models import RcraSite, RcraSiteType
from apps.trak.models import (
    ESignature,
    Handler,
    Manifest,
    PaperSignature,
    Signer,
    WasteCode,
)


@pytest.fixture
def manifest_handler_factory(db, rcra_site_factory, paper_signature_factory):
    """Abstract factory for Haztrak Handler model"""

    def create_manifest_handler(
        epa_site: Optional[RcraSite] = None,
        paper_signature: Optional[PaperSignature] = None,
    ) -> Handler:
        return Handler.objects.create(
            epa_site=epa_site or rcra_site_factory(),
            paper_signature=paper_signature or paper_signature_factory(),
        )

    yield create_manifest_handler


@pytest.fixture
def quicker_sign_response_factory():
    """
    Factory for creating dynamic quicker sign response data
    """

    def create_quicker_sign(
        mtn: List[str],
        site_id: str,
        site_type: Optional[RcraSiteType] = RcraSiteType.GENERATOR,
        printed_name: Optional[str] = "David Graham",
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
                "printedSignatureName": printed_name,
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
def paper_signature_factory(db):
    """Abstract factory for Paper Signature"""

    def create_signature(
        printed_name: Optional[str] = "David Graham",
        sign_date: Optional[datetime] = None,
    ) -> PaperSignature:
        return PaperSignature.objects.create(
            printed_name=printed_name,
            sign_date=sign_date or datetime.utcnow().replace(tzinfo=timezone.utc),
        )

    yield create_signature


@pytest.fixture
def e_signature_factory(db, signer_factory, manifest_handler_factory):
    """Abstract factory for Haztrak Handler model"""

    def create_e_signature(
        signer: Optional[Signer] = None,
        manifest_handler: Optional[Handler] = None,
    ) -> ESignature:
        return ESignature.objects.create(
            signer=signer or signer_factory(),
            manifest_handler=manifest_handler or manifest_handler_factory(),
            sign_date=datetime.utcnow().replace(tzinfo=timezone.utc),
            cromerr_activity_id="".join(random.choices(string.ascii_letters, k=10)),
            cromerr_document_id="".join(random.choices(string.ascii_letters, k=10)),
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
def signer_factory(db):
    """Abstract factory for Haztrak Signer model"""

    def creat_signer(
        first_name: Optional[str] = "test",
        middle_initial: Optional[str] = "Q",
        last_name: Optional[str] = "user",
        signer_role: Optional[str] = "EP",
        company_name: Optional[str] = "haztrak",
        rcra_user_id: Optional[str] = "testuser1",
    ) -> Signer:
        return Signer.objects.create(
            first_name=first_name,
            middle_initial=middle_initial,
            last_name=last_name,
            signer_role=signer_role,
            company_name=company_name,
            rcra_user_id=rcra_user_id,
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
        if tsdf is None:
            # ensure the TSD is a different EPA site
            epa_site = rcra_site_factory()
            tsdf = manifest_handler_factory(epa_site=epa_site)
        return Manifest.objects.create(
            mtn=mtn,
            created_date=datetime.now().replace(tzinfo=timezone.utc),
            potential_ship_date=datetime.now().replace(tzinfo=timezone.utc),
            generator=generator or manifest_handler_factory(),
            tsdf=tsdf or manifest_handler_factory(epa_site=rcra_site_factory(epa_id="tsd001")),
        )

    yield create_manifest
