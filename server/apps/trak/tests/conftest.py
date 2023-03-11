import json
import os
import random
import string
from datetime import date, datetime
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

JSON_DIR = os.path.dirname(os.path.abspath(__file__)) + "/resources/json"
TEST_CONTACT_JSON = f"{JSON_DIR}/contact/good_contact.json"
TEST_PHONE_JSON = f"{JSON_DIR}/contact/phone.json"
TEST_WASTE1_JSON = f"{JSON_DIR}/test_wasteline1.json"
TEST_MANIFEST_JSON = f"{JSON_DIR}/test_manifest_100033134ELC.json"
TEST_SITE_PERM_JSON = f"{JSON_DIR}/site_permission.json"
TEST_EPA_PERM_JSON = f"{JSON_DIR}/epa_permission.json"
TEST_HANDLER_JSON = f"{JSON_DIR}/test_handler.json"
TEST_PAPER_HANDLER_JSON = f"{JSON_DIR}/paper_manifest_handler.json"
TEST_E_SIGNATURE_JSON = f"{JSON_DIR}/test_e_signature.json"


@pytest.fixture
def user_factory(db):
    def create_user(
        username: Optional[str] = None,
        email: Optional[str] = "testuser1@haztrak.net",
        password: Optional[str] = "password1",
    ) -> User:
        if username is None:
            username = "".join(
                random.choice(string.ascii_letters) for _ in range(10)
            )  # generate a random username
        return User.objects.create_user(username=username, email=email, password=password)

    return create_user


@pytest.fixture
def rcra_profile_factory(db, user_factory):
    def create_profile(
        rcra_api_id: Optional[str] = "rcraApiId",
        rcra_api_key: Optional[str] = "rcraApikey",
        rcra_username: Optional[str] = "dpgraham4401",
        user: Optional[User] = None,
    ) -> RcraProfile:
        if user is None:
            user = user_factory()
        return RcraProfile.objects.create(
            rcra_api_id=rcra_api_id,
            rcra_api_key=rcra_api_key,
            rcra_username=rcra_username,
            user=user,
        )

    return create_profile


@pytest.fixture
def address_factory(db):
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
    def create_epa_phone(
        number: Optional[str] = "123-123-1234", extension: Optional[str] = "1234"
    ) -> EpaPhone:
        return EpaPhone.objects.create(
            number=number,
            extension=extension,
        )

    return create_epa_phone


@pytest.fixture
def contact_factory(db, epa_phone_factory):
    def create_contact(
        first_name: Optional[str] = "test",
        middle_initial: Optional[str] = "Q",
        last_name: Optional[str] = "user",
        email: Optional[str] = "testuser@haztrak.net",
        phone: Optional[EpaPhone] = None,
    ) -> Contact:
        if phone is None:
            phone = epa_phone_factory()
        contact = Contact.objects.create(
            first_name=first_name,
            middle_initial=middle_initial,
            last_name=last_name,
            email=email,
            phone=phone,
        )
        return contact

    return create_contact


@pytest.fixture
def handler_factory(db, address_factory, contact_factory):
    def create_handler(
        epa_id: Optional[str] = "handler001",
        name: Optional[str] = "my_handler",
        site_type: Optional[str] = "Generator",
    ) -> Handler:
        return Handler.objects.create(
            epa_id=epa_id,
            name=name,
            site_type=site_type,
            site_address=address_factory(),
            mail_address=address_factory(),
            contact=contact_factory(),
        )

    return create_handler


@pytest.fixture
def site_factory(db, handler_factory):
    def create_site(
        epa_site: Optional[Handler] = None,
        name: Optional[str] = "my_handler",
    ) -> Site:
        if epa_site is None:
            epa_site = handler_factory()
        return Site.objects.create(
            epa_site=epa_site,
            name=name,
        )

    return create_site


@pytest.fixture
def testuser_signer(db) -> Signer:
    """A Signer model instance"""
    return Signer.objects.create(
        first_name="test",
        middle_initial="Q",
        last_name="user",
        signer_role="EP",
        company_name="haztrak",
        rcra_user_id="testuser1",
    )


@pytest.fixture
def site_permission_factory(db, site_factory, rcra_profile_factory):
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
        if site is None:
            site = site_factory()
        if profile is None:
            profile = rcra_profile_factory()
        return SitePermission.objects.create(
            site=site,
            profile=profile,
            site_manager=site_manager,
            annual_report=annual_report,
            biennial_report=biennial_report,
            e_manifest=e_manifest,
            wiets=wiets,
            my_rcra_id=my_rcra_id,
        )

    return create_permission


# JSON fixtures, fixtures that return a Dict from our test files
@pytest.fixture
def json_100033134elc() -> Dict:
    with open(TEST_MANIFEST_JSON, "r") as f:
        return json.load(f)


@pytest.fixture
def handler_json() -> Dict:
    with open(TEST_HANDLER_JSON, "r") as f:
        return json.load(f)


@pytest.fixture
def contact_json() -> Dict:
    with open(TEST_CONTACT_JSON, "r") as f:
        return json.load(f)


@pytest.fixture
def site_permission_json(db) -> Dict:
    with open(TEST_SITE_PERM_JSON, "r") as f:
        return json.load(f)


@pytest.fixture
def epa_permission_json(db) -> Dict:
    with open(TEST_EPA_PERM_JSON, "r") as f:
        return json.load(f)


@pytest.fixture
def wasteline_json() -> Dict:
    with open(TEST_WASTE1_JSON, "r") as f:
        return json.load(f)


@pytest.fixture
def paper_manifest_handler_json() -> Dict:
    with open(TEST_PAPER_HANDLER_JSON, "r") as f:
        return json.load(f)


@pytest.fixture
def phone_json(db) -> Dict:
    with open(TEST_PHONE_JSON, "r") as f:
        return json.load(f)


@pytest.fixture
def e_signature_json(db) -> Dict:
    with open(TEST_E_SIGNATURE_JSON, "r") as f:
        return json.load(f)


# Serializer fixtures, build on JSON fixtures to produce serializers
@pytest.fixture
def manifest_10003114elc_serializer(db, json_100033134elc) -> ManifestSerializer:
    return ManifestSerializer(data=json_100033134elc)


@pytest.fixture
def waste_serializer(db, wasteline_json) -> WasteLineSerializer:
    return WasteLineSerializer(data=wasteline_json)


@pytest.fixture
def handler_serializer(db, handler_json) -> HandlerSerializer:
    return HandlerSerializer(data=handler_json)


@pytest.fixture
def manifest_handler_serializer(db, handler_json) -> ManifestHandlerSerializer:
    manifest_handler_serializer = ManifestHandlerSerializer(data=handler_json)
    manifest_handler_serializer.is_valid()
    return manifest_handler_serializer


@pytest.fixture
def paper_handler_serializer(db, paper_manifest_handler_json) -> ManifestHandlerSerializer:
    handler_serializer = ManifestHandlerSerializer(data=paper_manifest_handler_json)
    handler_serializer.is_valid()
    return handler_serializer


@pytest.fixture
def contact_serializer(db, contact_json) -> ContactSerializer:
    return ContactSerializer(data=contact_json)


@pytest.fixture
def site_permission_serializer(db, site_permission_json) -> SitePermissionSerializer:
    return SitePermissionSerializer(data=site_permission_json)


@pytest.fixture
def epa_permission_serializer(db, epa_permission_json) -> EpaPermissionSerializer:
    return EpaPermissionSerializer(data=epa_permission_json)


@pytest.fixture
def phone_serializer(db, phone_json) -> EpaPhoneSerializer:
    return EpaPhoneSerializer(data=phone_json)


@pytest.fixture
def e_signature_serializer(db, e_signature_json) -> ESignatureSerializer:
    e_signature_serializer = ESignatureSerializer(data=e_signature_json)
    e_signature_serializer.is_valid()
    return e_signature_serializer


@pytest.fixture
def manifest_gen(db, handler_factory) -> ManifestHandler:
    return ManifestHandler.objects.create(
        handler=handler_factory(),
    )


@pytest.fixture
def manifest_elc(db, manifest_gen, manifest_tsd) -> Manifest:
    return Manifest.objects.create(
        mtn="0123456789ELC",
        created_date=datetime.now(),
        potential_ship_date=date.today(),
        generator=manifest_gen,
        tsd=manifest_tsd,
    )


@pytest.fixture
def api_client(db, user_factory) -> APIClient:
    client = APIClient()
    client.force_authenticate(user=user_factory())
    return client


@pytest.fixture
def manifest_100033134elc_rcra_response(db, json_100033134elc):
    rcrainfo = RcrainfoService(api_username="testuser1", rcrainfo_env="preprod")
    with responses.RequestsMock() as mock:
        mock.get(
            url=f'{rcrainfo.base_url}/api/v1/emanifest/manifest/{json_100033134elc.get("manifestTrackingNumber")}',
            content_type="application/json",
            json=json_100033134elc,
            status=HTTPStatus.OK,
        )
        yield mock


@pytest.fixture
def search_site_mtn_rcra_response(json_100033134elc):
    rcrainfo = RcrainfoService(api_username="testuser1", rcrainfo_env="preprod")
    with responses.RequestsMock() as mock:
        mock.post(
            url=f"{rcrainfo.base_url}/api/v1/emanifest/search",
            content_type="application/json",
            json=[json_100033134elc.get("manifestTrackingNumber")],
            status=HTTPStatus.OK,
        )
        yield mock
