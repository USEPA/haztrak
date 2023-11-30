import json
import os
import random
import string
from enum import Enum
from typing import Dict, Literal, Optional, Union

import pytest
import pytest_mock
import responses
from django.contrib.auth.models import User
from faker import Faker
from faker.providers import BaseProvider
from rest_framework.test import APIClient

from apps.core.models import HaztrakProfile, HaztrakUser, RcraProfile  # type: ignore
from apps.sites.models import (  # type: ignore
    Address,
    Contact,
    HaztrakSite,
    RcraPhone,
    RcraSite,
)
from apps.sites.models.site_models import HaztrakOrg
from apps.trak.models import ManifestPhone  # type: ignore


class SiteIDProvider(BaseProvider):
    PREFIXES = ["VAT", "VAD", "TXD", "TXR", "TND", "TNR", "LAD", "LAR", "CAD", "CAR", "MAD", "MAR"]
    NUMBERS = ["".join(random.choices(string.digits, k=9)) for _ in range(100)]

    def site_id(self):
        return f"{self.random_element(self.PREFIXES)}{self.random_element(self.NUMBERS)}"


@pytest.fixture
def haztrak_json():
    """Fixture with JSON data"""
    json_dir = os.path.dirname(os.path.abspath(__file__)) + "/../fixtures/json"

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
def user_factory(db, faker):
    """Abstract factory for Django's User model"""

    def create_user(
        username: Optional[str] = None,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        email: Optional[str] = None,
        password: Optional[str] = None,
    ) -> HaztrakUser:
        return HaztrakUser.objects.create_user(
            username=username or faker.user_name(),
            first_name=first_name or faker.first_name(),
            last_name=last_name or faker.last_name(),
            email=email or faker.email(),
            password=password or faker.password(),
        )

    yield create_user


@pytest.fixture
def rcra_profile_factory(db, user_factory, faker: Faker):
    """Abstract factory for Haztrak RcraProfile model"""

    def create_profile(
        rcra_api_id: Optional[str] = str(faker.uuid4()),
        rcra_api_key: Optional[str] = faker.pystr(min_chars=15),
        rcra_username: Optional[str] = faker.pystr(min_chars=12),
    ) -> RcraProfile:
        return RcraProfile.objects.create(
            rcra_api_id=rcra_api_id,
            rcra_api_key=rcra_api_key,
            rcra_username=rcra_username,
        )

    yield create_profile


@pytest.fixture
def haztrak_profile_factory(db, user_factory, rcra_profile_factory, haztrak_org_factory):
    """Abstract factory for Haztrak RcraProfile model"""

    def create_profile(
        user: Optional[User] = None,
        rcrainfo_profile: Optional[RcraProfile] = rcra_profile_factory(),
        org: Optional[HaztrakOrg] = haztrak_org_factory(),
    ) -> HaztrakProfile:
        return HaztrakProfile.objects.create(
            user=user or user_factory(),
            rcrainfo_profile=rcrainfo_profile,
            org=org,
        )

    yield create_profile


@pytest.fixture
def address_factory(db, faker: Faker):
    """Abstract factory for Haztrak Address model"""

    def create_address(
        address1: Optional[str] = None,
        street_number: Optional[str] = None,
        country: Optional[str] = "US",
        city: Optional[str] = None,
    ) -> Address:
        return Address.objects.create(
            address1=address1 or faker.street_name(),
            street_number=street_number or faker.building_number(),
            country=country,
            city=city or faker.city(),
        )

    yield create_address


@pytest.fixture
def site_phone_factory(db, faker: Faker):
    """Abstract factory for Haztrak ManifestPhone model"""

    def create_site_phone(
        number: Optional[str] = "202-505-5500",
        extension: Optional[str] = "1234",
    ) -> RcraPhone:
        return RcraPhone.objects.create(
            number=number,
            extension=extension,
        )

    yield create_site_phone


@pytest.fixture
def epa_phone_factory(db, faker):
    """Abstract factory for Haztrak ManifestPhone model"""

    def create_epa_phone(
        number: Optional[str] = None,
        extension: Optional[str] = "1234",
    ) -> ManifestPhone:
        return ManifestPhone.objects.create(
            number=number or faker.phone_number(),
            extension=extension,
        )

    yield create_epa_phone


@pytest.fixture
def contact_factory(db, site_phone_factory, faker: Faker):
    """Abstract factory for Haztrak Contact model"""

    def create_contact(
        first_name: Optional[str] = None,
        middle_initial: Optional[str] = None,
        last_name: Optional[str] = None,
        email: Optional[str] = None,
        phone: Optional[RcraPhone] = None,
    ) -> Contact:
        contact = Contact.objects.create(
            first_name=first_name or faker.first_name(),
            middle_initial=middle_initial or faker.pystr(max_chars=1),
            last_name=last_name or faker.last_name(),
            email=email or faker.email(),
            phone=phone or site_phone_factory(),
        )
        return contact

    yield create_contact


@pytest.fixture
def rcra_site_factory(db, address_factory, contact_factory):
    """Abstract factory for Haztrak RcraSite model"""

    def create_rcra_site(
        epa_id: Optional[str] = None,
        name: Optional[str] = None,
        site_type: Optional[Literal["Generator", "Transporter", "Tsdf"]] = "Generator",
        site_address: Optional[Address] = None,
        mail_address: Optional[Address] = None,
    ) -> RcraSite:
        fake = Faker()
        fake.add_provider(SiteIDProvider)
        return RcraSite.objects.create(
            epa_id=epa_id or fake.site_id(),
            name=name or fake.name(),
            site_type=site_type,
            site_address=site_address or address_factory(),
            mail_address=mail_address or address_factory(),
            contact=contact_factory(),
        )

    return create_rcra_site


@pytest.fixture
def haztrak_org_factory(db, rcra_profile_factory, user_factory, faker):
    """Abstract factory for Haztrak Org model"""

    def create_org(
        org_id: Optional[str] = None,
        name: Optional[str] = None,
        admin: Optional[HaztrakUser] = None,
    ) -> HaztrakOrg:
        return HaztrakOrg.objects.create(
            id=org_id or faker.uuid4(),
            name=name or faker.company(),
            admin=admin or user_factory(),
        )

    yield create_org


@pytest.fixture
def haztrak_site_factory(db, rcra_site_factory, haztrak_org_factory, faker):
    """Abstract factory for Haztrak Site model"""

    def create_site(
        rcra_site: Optional[RcraSite] = None,
        name: Optional[str] = None,
        org: Optional[HaztrakOrg] = None,
    ) -> HaztrakSite:
        return HaztrakSite.objects.create(
            rcra_site=rcra_site or rcra_site_factory(),
            name=name or faker.name(),
            org=org or haztrak_org_factory(),
        )

    yield create_site


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

    yield create_client


@pytest.fixture
def mock_responses():
    """
    fixture for mocking external http request responses
    see Responses docs
    https://github.com/getsentry/responses#responses-as-a-pytest-fixture
    """
    with responses.RequestsMock() as mock_responses:
        yield mock_responses


@pytest.fixture
def mocker(mocker: pytest_mock.MockerFixture):
    """
    wrapper fixture pytest-mock's mocker fixture for easy type annotations
    https://github.com/pytest-dev/pytest-mock
    """
    return mocker
