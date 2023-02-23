import json
import os
from datetime import date, datetime
from http import HTTPStatus
from typing import Dict

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
    RcraProfile,
    Site,
    SitePermission,
)
from apps.trak.serializers import (
    EpaPermissionSerializer,
    HandlerSerializer,
    ManifestSerializer,
    SitePermissionSerializer,
    WasteLineSerializer,
)
from apps.trak.serializers.contact import ContactSerializer, EpaPhoneSerializer
from apps.trak.services import RcrainfoService

JSON_DIR = os.path.dirname(os.path.abspath(__file__)) + "/resources/json"
TEST_CONTACT_JSON = f"{JSON_DIR}/contact/good_contact.json"
TEST_PHONE_JSON = f"{JSON_DIR}/contact/phone.json"
TEST_WASTE1_JSON = f"{JSON_DIR}/test_wasteline1.json"
TEST_MANIFEST_JSON = f"{JSON_DIR}/test_manifest_100033134ELC.json"
TEST_SITE_PERM_JSON = f"{JSON_DIR}/site_permission.json"
TEST_EPA_PERM_JSON = f"{JSON_DIR}/epa_permission.json"
TEST_HANDLER_JSON = f"{JSON_DIR}/test_handler.json"


@pytest.fixture
def testuser1(db) -> User:
    """Django user with username: 'testuser1', password: 'password1'"""
    return User.objects.create_user(
        username="testuser1", email="testuser1@haztrak.net", password="password1"
    )


@pytest.fixture
def other_user(db) -> User:
    """Django user with username: 'other_user', password: 'password1'"""
    return User.objects.create_user(
        username="other_user", email="other@haztrak.net", password="password1"
    )


@pytest.fixture
def address_123_main(db) -> Address:
    """A Address model instance"""
    return Address.objects.create(
        address1="Main st.", street_number="123", country="VA", city="Arlington"
    )


@pytest.fixture
def epa_phone(db) -> EpaPhone:
    """A EpaPhone model instance"""
    return EpaPhone.objects.create(number="123-123-1234", extension="123")


@pytest.fixture
def handler_contact(db, epa_phone) -> Contact:
    """A Contact model instance"""
    return Contact.objects.create(
        first_name="test",
        middle_initial="M",
        last_name="User",
        email="testuser@haztrak.net",
        phone=epa_phone,
    )


@pytest.fixture
def generator001(db, address_123_main, handler_contact) -> Handler:
    """A Handler instance named generator001"""
    return Handler.objects.create(
        epa_id="handler001",
        name="my_handler",
        site_type="Generator",
        site_address=address_123_main,
        mail_address=address_123_main,
        contact=handler_contact,
    )


@pytest.fixture
def tsd001(db, address_123_main, handler_contact) -> Handler:
    """Returns a Handler instance named tsd001"""
    return Handler.objects.create(
        epa_id="tsd001",
        name="my_tsd",
        site_type="Tsd",
        site_address=address_123_main,
        mail_address=address_123_main,
        contact=handler_contact,
    )


@pytest.fixture
def site_generator001(db, generator001) -> Site:
    """A Site model instance with generator001 as the handler"""
    return Site.objects.create(epa_site=generator001, name=generator001.name)


@pytest.fixture
def site_tsd001(db, tsd001) -> Site:
    """A Site model instance with tsd001 as the handler"""
    return Site.objects.create(epa_site=tsd001, name=tsd001.name)


@pytest.fixture
def site_permission(db, site_generator001, test_user_profile) -> SitePermission:
    """Returns testuser1 SitePermission model to site_generator"""
    return SitePermission.objects.create(
        site=site_generator001,
        profile=test_user_profile,
        site_manager=True,
        annual_report="Certifier",
        biennial_report="Certifier",
        e_manifest="Certifier",
        wiets="Certifier",
        my_rcra_id="Certifier",
    )


# JSON fixtures, fixtures that return a Dict from our test files
@pytest.fixture
def json_100031134elc() -> Dict:
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


# Serializer fixtures, build on JSON fixtures to produce serializers
@pytest.fixture
def manifest_10003114elc_serializer(db, json_100031134elc) -> ManifestSerializer:
    return ManifestSerializer(data=json_100031134elc)


@pytest.fixture
def waste_serializer(db, wasteline_json) -> WasteLineSerializer:
    return WasteLineSerializer(data=wasteline_json)


@pytest.fixture
def handler_serializer(db, handler_json) -> HandlerSerializer:
    return HandlerSerializer(data=handler_json)


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
def phone_serializer(db) -> EpaPhoneSerializer:
    with open(TEST_PHONE_JSON, "r") as f:
        data = json.load(f)
    return EpaPhoneSerializer(data=data)


@pytest.fixture
def manifest_elc(db, address_123_main, generator001, tsd001) -> Manifest:
    return Manifest.objects.create(
        mtn="0123456789ELC",
        created_date=datetime.now(),
        potential_ship_date=date.today(),
        generator=generator001,
        tsd=tsd001,
    )


@pytest.fixture
def test_user_profile(db, site_generator001, testuser1) -> RcraProfile:
    return RcraProfile.objects.create(
        rcra_api_id="rcraApiId",
        rcra_api_key="rcraApikey",
        rcra_username="dpgraham4401",
        user=testuser1,
    )


@pytest.fixture
def other_user_profile(db, site_tsd001, other_user) -> RcraProfile:
    return RcraProfile.objects.create(
        rcra_api_id="rcraApiId",
        rcra_api_key="rcraApikey",
        rcra_user_name="other_user",
        user=other_user,
    )


@pytest.fixture
def api_client(db, testuser1) -> APIClient:
    client = APIClient()
    client.force_authenticate(user=testuser1)
    return client


class TestApiClient:
    f"""
    This is a base class for Haztrak's other test suites.
    It includes a number of fixtures already...
    1. testuser1 {User} django's user model
    2. test_user_profile {RcraProfile} testuser1's RcraProfile
    3. generator001 {Handler} handler model testuser1 has access to
    4. site_generator001 {Site} Site with generator001 as it's handler
    5. api_client {APIClient} pre authenticated (testuser1) APIClient
    """

    @pytest.fixture(autouse=True)
    def _profile(self, test_user_profile):
        self.profile = test_user_profile

    @pytest.fixture(autouse=True)
    def _site_permission(self, site_permission):
        self.site_permission = site_permission

    @pytest.fixture(autouse=True)
    def _generator(self, generator001):
        self.generator = generator001

    @pytest.fixture(autouse=True)
    def _site(self, site_generator001):
        self.site = site_generator001

    @pytest.fixture(autouse=True)
    def _test_user(self, testuser1):
        self.user = testuser1

    @pytest.fixture(autouse=True)
    def _api_client(self, api_client):
        self.client = api_client


@pytest.fixture
def manifest_100033134elc_rcra_response(db, json_100031134elc):
    rcrainfo = RcrainfoService(api_username="testuser1", rcrainfo_env="preprod")
    with responses.RequestsMock() as mock:
        mock.get(
            url=f'{rcrainfo.base_url}/api/v1/emanifest/manifest/{json_100031134elc.get("manifestTrackingNumber")}',
            content_type="application/json",
            json=json_100031134elc,
            status=HTTPStatus.OK,
        )
        yield mock


@pytest.fixture
def search_site_mtn_rcra_response(json_100031134elc):
    rcrainfo = RcrainfoService(api_username="testuser1", rcrainfo_env="preprod")
    with responses.RequestsMock() as mock:
        mock.post(
            url=f"{rcrainfo.base_url}/api/v1/emanifest/search",
            content_type="application/json",
            json=[json_100031134elc.get("manifestTrackingNumber")],
            status=HTTPStatus.OK,
        )
        yield mock
