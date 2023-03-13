import json
import os
from datetime import date, datetime
from enum import Enum
from http import HTTPStatus
from typing import Dict, Optional

import pytest
import responses
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from apps.trak.models import (
    Address,
    Contact,
    EpaPhone,
    Handler,
    Manifest,
    ManifestHandler,
    PaperSignature,
    RcraProfile,
    Signer,
    Site,
    SitePermission,
)
from apps.trak.serializers import (
    ContactSerializer,
    EpaPermissionSerializer,
    EpaPhoneSerializer,
    HandlerSerializer,
    ManifestHandlerSerializer,
    ManifestSerializer,
    SitePermissionSerializer,
    WasteLineSerializer,
)
from apps.trak.serializers.signature_ser import ESignatureSerializer
from apps.trak.services import RcrainfoService


@pytest.fixture
def haztrak_json():
    """Fixture with JSON data"""
    json_dir = os.path.dirname(os.path.abspath(__file__)) + "/resources/json"

    def read_file(path: str) -> Dict:
        with open(path, "r") as f:
            return json.load(f)

    class Json(Enum):
        CONTACT = read_file(f"{json_dir}/contact/good_contact.json")
        PHONE = read_file(f"{json_dir}/contact/phone.json")
        WASTELINE_1 = read_file(f"{json_dir}/test_wasteline1.json")
        MANIFEST = read_file(f"{json_dir}/test_manifest_100033134ELC.json")
        SITE_PERMISSION = read_file(f"{json_dir}/site_permission.json")
        EPA_PERMISSION = read_file(f"{json_dir}/epa_permission.json")
        HANDLER = read_file(f"{json_dir}/test_handler.json")
        PAPER_MANIFEST_HANDLER = read_file(f"{json_dir}/paper_manifest_handler.json")
        E_SIGNATURE = read_file(f"{json_dir}/test_e_signature.json")

    return Json


@pytest.fixture
def user_factory(db):
    """Abstract factory for Django's User model"""

    def create_user(
        username: Optional[str] = "testuser1",
        email: Optional[str] = "testuser1@haztrak.net",
        password: Optional[str] = "password1",
    ) -> User:
        # if username is None:
        #     username = "".join(
        #         random.choice(string.ascii_letters) for _ in range(10)
        #     )  # generate a random username
        return User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )

    return create_user


@pytest.fixture
def rcra_profile_factory(db, user_factory):
    """Abstract factory for Haztrak RcraProfile model"""

    def create_profile(
        rcra_api_id: Optional[str] = "rcraApiId",
        rcra_api_key: Optional[str] = "rcraApikey",
        rcra_username: Optional[str] = "dpgraham4401",
        user: Optional[User] = None,
    ) -> RcraProfile:
        return RcraProfile.objects.create(
            rcra_api_id=rcra_api_id,
            rcra_api_key=rcra_api_key,
            rcra_username=rcra_username,
            user=user or user_factory(),
        )

    return create_profile


@pytest.fixture
def address_factory(db):
    """Abstract factory for Haztrak Address model"""

    def create_address(
        address1: Optional[str] = "Main st.",
        street_number: Optional[str] = "123",
        country: Optional[str] = "US",
        city: Optional[str] = "Arlington",
    ) -> Address:
        return Address.objects.create(
            address1=address1,
            street_number=street_number,
            country=country,
            city=city,
        )

    return create_address


@pytest.fixture
def epa_phone_factory(db):
    """Abstract factory for Haztrak EpaPhone model"""

    def create_epa_phone(
        number: Optional[str] = "123-123-1234",
        extension: Optional[str] = "1234",
    ) -> EpaPhone:
        return EpaPhone.objects.create(
            number=number,
            extension=extension,
        )

    return create_epa_phone


@pytest.fixture
def paper_signature_factory(db):
    """Abstract factory for Paper Signature"""

    def create_signature(
        printed_name: Optional[str] = "David Graham",
        sign_date: Optional[datetime] = None,
    ) -> PaperSignature:
        return PaperSignature.objects.create(
            printed_name=printed_name,
            sign_date=sign_date or datetime.utcnow(),
        )

    return create_signature


@pytest.fixture
def contact_factory(db, epa_phone_factory):
    """Abstract factory for Haztrak Contact model"""

    def create_contact(
        first_name: Optional[str] = "test",
        middle_initial: Optional[str] = "Q",
        last_name: Optional[str] = "user",
        email: Optional[str] = "testuser@haztrak.net",
        phone: Optional[EpaPhone] = None,
    ) -> Contact:
        contact = Contact.objects.create(
            first_name=first_name,
            middle_initial=middle_initial,
            last_name=last_name,
            email=email,
            phone=phone or epa_phone_factory(),
        )
        return contact

    return create_contact


@pytest.fixture
def handler_factory(db, address_factory, contact_factory):
    """Abstract factory for Haztrak Handler model"""

    def create_handler(
        epa_id: Optional[str] = "handler001",
        name: Optional[str] = "my_handler",
        site_type: Optional[str] = "Generator",
        site_address: Optional[Address] = None,
        mail_address: Optional[Address] = None,
    ) -> Handler:
        return Handler.objects.create(
            epa_id=epa_id,
            name=name,
            site_type=site_type,
            site_address=site_address or address_factory(),
            mail_address=mail_address or address_factory(),
            contact=contact_factory(),
        )

    return create_handler


@pytest.fixture
def site_factory(db, handler_factory):
    """Abstract factory for Haztrak Site model"""

    def create_site(
        epa_site: Optional[Handler] = None,
        name: Optional[str] = "my_handler",
    ) -> Site:
        return Site.objects.create(
            epa_site=epa_site or handler_factory(),
            name=name,
        )

    return create_site


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

    return creat_signer


@pytest.fixture
def site_permission_factory(db, site_factory, rcra_profile_factory):
    """Abstract factory for Haztrak SitePermission model"""

    def create_permission(
        site: Optional[Site] = None,
        profile: Optional[RcraProfile] = None,
        site_manager: Optional[bool] = True,
        annual_report: Optional[str] = "Certifier",
        biennial_report: Optional[str] = "Certifier",
        e_manifest: Optional[str] = "Certifier",
        wiets: Optional[str] = "Certifier",
        my_rcra_id: Optional[str] = "Certifier",
    ) -> SitePermission:
        """Returns testuser1 SitePermission model to site_generator"""
        return SitePermission.objects.create(
            site=site or site_factory(),
            profile=profile or rcra_profile_factory(),
            site_manager=site_manager,
            annual_report=annual_report,
            biennial_report=biennial_report,
            e_manifest=e_manifest,
            wiets=wiets,
            my_rcra_id=my_rcra_id,
        )

    return create_permission


@pytest.fixture
def manifest_handler_factory(db, handler_factory):
    """Abstract factory for Haztrak ManifestHandler model"""

    def create_manifest_handler(handler: Optional[Handler] = None) -> ManifestHandler:
        return ManifestHandler.objects.create(
            handler=handler or handler_factory(),
        )

    return create_manifest_handler


@pytest.fixture
def manifest_factory(db, manifest_handler_factory, handler_factory):
    """Abstract factory for Haztrak Manifest model"""

    def create_manifest(
        mtn: Optional[str] = "123456789ELC",
        generator: Optional[Handler] = None,
        tsd: Optional[Handler] = None,
    ) -> Manifest:
        if tsd is None:
            # ensure the TSD is a different EPA site
            handler = handler_factory(epa_id="foobar_id")
            tsd = manifest_handler_factory(handler=handler)
        return Manifest.objects.create(
            mtn=mtn,
            created_date=datetime.now(),
            potential_ship_date=date.today(),
            generator=generator or manifest_handler_factory(),
            tsd=tsd or manifest_handler_factory(handler=handler_factory(epa_id="tsd001")),
        )

    return create_manifest


@pytest.fixture
def api_client_factory(db, user_factory):
    """Abstract factory for DRF APIClient testing class"""

    def create_client(
        user: Optional[User] = None,
    ) -> APIClient:
        client = APIClient()
        client.force_authenticate(
            user=user or user_factory(),
        )
        return client

    return create_client


# Serializer fixtures, build on JSON fixtures to produce serializers
@pytest.fixture
def manifest_10003114elc_serializer(db, haztrak_json) -> ManifestSerializer:
    return ManifestSerializer(data=haztrak_json.MANIFEST.value)


@pytest.fixture
def waste_serializer(db, haztrak_json) -> WasteLineSerializer:
    return WasteLineSerializer(data=haztrak_json.WASTELINE_1.value)


@pytest.fixture
def handler_serializer(db, haztrak_json) -> HandlerSerializer:
    return HandlerSerializer(data=haztrak_json.HANDLER.value)


@pytest.fixture
def manifest_handler_serializer(db, haztrak_json) -> ManifestHandlerSerializer:
    manifest_handler_serializer = ManifestHandlerSerializer(data=haztrak_json.HANDLER.value)
    manifest_handler_serializer.is_valid()
    return manifest_handler_serializer


@pytest.fixture
def paper_handler_serializer(db, haztrak_json) -> ManifestHandlerSerializer:
    handler_serializer = ManifestHandlerSerializer(data=haztrak_json.PAPER_MANIFEST_HANDLER.value)
    handler_serializer.is_valid()
    return handler_serializer


@pytest.fixture
def contact_serializer(db, haztrak_json) -> ContactSerializer:
    return ContactSerializer(data=haztrak_json.CONTACT.value)


@pytest.fixture
def site_permission_serializer(db, haztrak_json) -> SitePermissionSerializer:
    return SitePermissionSerializer(data=haztrak_json.SITE_PERMISSION.value)


@pytest.fixture
def epa_permission_serializer(db, haztrak_json) -> EpaPermissionSerializer:
    return EpaPermissionSerializer(data=haztrak_json.EPA_PERMISSION.value)


@pytest.fixture
def phone_serializer(db, haztrak_json) -> EpaPhoneSerializer:
    return EpaPhoneSerializer(data=haztrak_json.PHONE.value)


@pytest.fixture
def e_signature_serializer(db, haztrak_json) -> ESignatureSerializer:
    e_signature_serializer = ESignatureSerializer(data=haztrak_json.E_SIGNATURE.value)
    e_signature_serializer.is_valid()
    return e_signature_serializer


@pytest.fixture
def manifest_100033134elc_rcra_response(db, haztrak_json):
    rcrainfo = RcrainfoService(api_username="testuser1", rcrainfo_env="preprod")
    manifest_json = haztrak_json.MANIFEST.value
    with responses.RequestsMock() as mock:
        mock.get(
            url=f'{rcrainfo.base_url}/api/v1/emanifest/manifest/{manifest_json.get("manifestTrackingNumber")}',
            content_type="application/json",
            json=manifest_json,
            status=HTTPStatus.OK,
        )
        yield mock


@pytest.fixture
def search_site_mtn_rcra_response(haztrak_json):
    rcrainfo = RcrainfoService(api_username="testuser1", rcrainfo_env="preprod")
    with responses.RequestsMock() as mock:
        mock.post(
            url=f"{rcrainfo.base_url}/api/v1/emanifest/search",
            content_type="application/json",
            json=[haztrak_json.MANIFEST.value.get("manifestTrackingNumber")],
            status=HTTPStatus.OK,
        )
        yield mock
