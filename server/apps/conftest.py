import json
import os
import random
import string
from enum import Enum
from typing import Dict, Optional

import pytest
import pytest_mock
import responses
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from apps.sites.models import (
    Address,
    Contact,
    EpaProfile,
    EpaSite,
    Site,
    SitePhone,
)
from apps.trak.models import (
    EpaPhone,
)


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
        username: Optional[str] = f"{''.join(random.choices(string.ascii_letters, k=9))}",
        first_name: Optional[str] = "John",
        last_name: Optional[str] = "Doe",
        email: Optional[str] = "testuser1@haztrak.net",
        password: Optional[str] = "password1",
    ) -> User:
        return User.objects.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,
        )

    yield create_user


@pytest.fixture
def epa_profile_factory(db, user_factory):
    """Abstract factory for Haztrak EpaProfile model"""

    def create_profile(
        rcra_api_id: Optional[str] = "rcraApiId",
        rcra_api_key: Optional[str] = "rcraApikey",
        rcra_username: Optional[str] = "dpgraham4401",
        user: Optional[User] = None,
    ) -> EpaProfile:
        return EpaProfile.objects.create(
            rcra_api_id=rcra_api_id,
            rcra_api_key=rcra_api_key,
            rcra_username=rcra_username,
            user=user or user_factory(),
        )

    yield create_profile


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

    yield create_address


@pytest.fixture
def site_phone_factory(db):
    """Abstract factory for Haztrak EpaPhone model"""

    def create_site_phone(
        number: Optional[str] = "123-123-1234",
        extension: Optional[str] = "1234",
    ) -> SitePhone:
        return SitePhone.objects.create(
            number=number,
            extension=extension,
        )

    yield create_site_phone


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

    yield create_epa_phone


@pytest.fixture
def contact_factory(db, site_phone_factory):
    """Abstract factory for Haztrak Contact model"""

    def create_contact(
        first_name: Optional[str] = "test",
        middle_initial: Optional[str] = "Q",
        last_name: Optional[str] = "user",
        email: Optional[str] = "testuser@haztrak.net",
        phone: Optional[SitePhone] = None,
    ) -> Contact:
        contact = Contact.objects.create(
            first_name=first_name,
            middle_initial=middle_initial,
            last_name=last_name,
            email=email,
            phone=phone or site_phone_factory(),
        )
        return contact

    yield create_contact


@pytest.fixture
def epa_site_factory(db, address_factory, contact_factory):
    """Abstract factory for Haztrak EpaSite model"""

    def create_epa_site(
        epa_id: Optional[str] = None,
        name: Optional[str] = "my epa_site name",
        site_type: Optional[str] = "Generator",
        site_address: Optional[Address] = None,
        mail_address: Optional[Address] = None,
    ) -> EpaSite:
        return EpaSite.objects.create(
            epa_id=epa_id or f"VAD{''.join(random.choices(string.digits, k=9))}",
            name=name,
            site_type=site_type,
            site_address=site_address or address_factory(),
            mail_address=mail_address or address_factory(),
            contact=contact_factory(),
        )

    yield create_epa_site


@pytest.fixture
def site_factory(db, epa_site_factory):
    """Abstract factory for Haztrak Site model"""

    def create_site(
        epa_site: Optional[EpaSite] = None,
        name: Optional[str] = "my site name",
    ) -> Site:
        return Site.objects.create(
            epa_site=epa_site or epa_site_factory(),
            name=name,
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
