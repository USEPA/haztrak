import datetime
import json
import os
import random
import string
from enum import Enum
from profile.models import Profile, RcrainfoProfile
from typing import Any, Dict, Literal, Optional, Required, TypedDict

import pytest
import pytest_mock
import responses
from django.contrib.auth.models import User
from django.db import IntegrityError
from faker import Faker
from faker.providers import BaseProvider
from guardian.shortcuts import assign_perm
from rest_framework.test import APIClient

from core.models import (
    TrakUser,
)
from org.models import Org, Site
from rcrasite.models import (
    Address,
    Contact,
    RcraPhone,
    RcraSite,
)


class SiteIDProvider(BaseProvider):
    PREFIXES = ["VAT", "VAD", "TXD", "TXR", "TND", "TNR", "LAD", "LAR", "CAD", "CAR", "MAD", "MAR"]
    NUMBERS = ["".join(random.choices(string.digits, k=9)) for _ in range(100)]

    def site_id(self):
        return f"{self.random_element(self.PREFIXES)}{self.random_element(self.NUMBERS)}"


@pytest.fixture
def haztrak_json():
    """Fixture with JSON data."""
    json_dir = os.path.dirname(os.path.abspath(__file__)) + "/fixtures/json"

    def read_file(path: str) -> dict:
        with open(path) as f:
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


class UserFactoryPermissions(TypedDict, total=False):
    perms: Required[list[str] | str]
    objs: list[Any]


@pytest.fixture
def user_factory(db, faker):
    """Abstract factory for Django's User model."""

    def create_user(
        username: str | None = None,
        first_name: str | None = None,
        last_name: str | None = None,
        email: str | None = None,
        password: str | None = None,
        permissions: list[UserFactoryPermissions] | None = None,
    ) -> TrakUser:
        user = TrakUser.objects.create_user(
            username=username or faker.user_name(),
            first_name=first_name or faker.first_name(),
            last_name=last_name or faker.last_name(),
            email=email or faker.email(),
            password=password or faker.password(),
        )

        if permissions is not None:
            for permission in permissions:
                assign_perm(permission["perms"], user, permission["objs"])

        return user

    return create_user


@pytest.fixture
def perm_factory(db):
    """Abstract factory for creating permissions for a user."""

    def create_permissions(
        user: TrakUser,
        perms: list[str] | str,
        obj: Any = None,
    ) -> None:
        if isinstance(perms, str):
            if obj:
                assign_perm(perms, user, obj)
            assign_perm(perms, user)
        else:
            for perm in perms:
                if obj:
                    assign_perm(perm, user, obj)
                assign_perm(perm, user)

    return create_permissions


@pytest.fixture
def rcrainfo_profile_factory(db, user_factory, faker: Faker):
    """Abstract factory for Haztrak RcrainfoProfile model."""

    def create_profile(
        rcra_api_id: str | None = str(faker.uuid4()),
        rcra_api_key: str | None = faker.pystr(min_chars=15),
        rcra_username: str | None = faker.pystr(min_chars=12),
    ) -> RcrainfoProfile:
        return RcrainfoProfile.objects.create(
            rcra_api_id=rcra_api_id,
            rcra_api_key=rcra_api_key,
            rcra_username=rcra_username,
        )

    return create_profile


@pytest.fixture
def profile_factory(db, user_factory, rcrainfo_profile_factory, org_factory):
    """Abstract factory for Haztrak RcrainfoProfile model."""

    def create_profile(
        user: User | None = None,
        rcrainfo_profile: RcrainfoProfile | None = rcrainfo_profile_factory(),
    ) -> Profile:
        return Profile.objects.create(
            user=user or user_factory(),
            rcrainfo_profile=rcrainfo_profile,
        )

    return create_profile


@pytest.fixture
def address_factory(db, faker: Faker):
    """Abstract factory for Haztrak Address model."""

    def create_address(
        address1: str | None = None,
        street_number: str | None = None,
        country: str | None = "US",
        city: str | None = None,
    ) -> Address:
        return Address.objects.create(
            address1=address1 or faker.street_name(),
            street_number=street_number or faker.building_number(),
            country=country,
            city=city or faker.city(),
        )

    return create_address


@pytest.fixture
def rcra_phone_factory(db, faker: Faker):
    """Abstract factory for Haztrak ManifestPhone model."""

    def create_site_phone(
        number: str | None = "202-505-5500",
        extension: str | None = "1234",
    ) -> RcraPhone:
        return RcraPhone.objects.create(
            number=number,
            extension=extension,
        )

    return create_site_phone


@pytest.fixture
def contact_factory(db, rcra_phone_factory, faker: Faker):
    """Abstract factory for Haztrak Contact model."""

    def create_contact(
        first_name: str | None = None,
        middle_initial: str | None = None,
        last_name: str | None = None,
        email: str | None = None,
        phone: RcraPhone | None = None,
    ) -> Contact:
        return Contact.objects.create(
            first_name=first_name or faker.first_name(),
            middle_initial=middle_initial or faker.pystr(max_chars=1),
            last_name=last_name or faker.last_name(),
            email=email or faker.email(),
            phone=phone or rcra_phone_factory(),
        )

    return create_contact


@pytest.fixture
def rcra_site_factory(db, address_factory, contact_factory):
    """Abstract factory for Haztrak RcraSite model."""

    def create_rcra_site(
        epa_id: str | None = None,
        name: str | None = None,
        site_type: Literal["Generator", "Transporter", "Tsdf"] | None = "Generator",
        site_address: Address | None = None,
        mail_address: Address | None = None,
    ) -> RcraSite:
        fake = Faker()
        fake.add_provider(SiteIDProvider)
        while True:
            try:
                return RcraSite.objects.create(
                    epa_id=epa_id or fake.site_id(),
                    name=name or fake.name(),
                    site_type=site_type,
                    site_address=site_address or address_factory(),
                    mail_address=mail_address or address_factory(),
                    contact=contact_factory(),
                )
            except IntegrityError:
                return RcraSite.objects.create(
                    epa_id=fake.site_id(),
                    name=name or fake.name(),
                    site_type=site_type,
                    site_address=site_address or address_factory(),
                    mail_address=mail_address or address_factory(),
                    contact=contact_factory(),
                )

    return create_rcra_site


@pytest.fixture
def validated_data_factory():
    def _create_data_dict(*, instance, serializer) -> dict:
        data = serializer(instance).data
        new_serializer = serializer(data=data)
        new_serializer.is_valid(raise_exception=True)
        return new_serializer.validated_data

    return _create_data_dict


@pytest.fixture
def org_factory(db, rcrainfo_profile_factory, user_factory, faker):
    """Abstract factory for Haztrak Org model."""

    def create_org(
        org_id: str | None = None,
        name: str | None = None,
        admin: TrakUser | None = None,
    ) -> Org:
        return Org.objects.create(
            id=org_id or faker.uuid4(),
            name=name or faker.company(),
            admin=admin or user_factory(),
        )

    return create_org


@pytest.fixture
def site_factory(db, rcra_site_factory, org_factory, faker):
    """Abstract factory for Haztrak Site model."""

    def create_site(
        rcra_site: RcraSite | None = None,
        name: str | None = None,
        org: Org | None = None,
        last_rcrainfo_manifest_sync: datetime.datetime | None = None,
    ) -> Site:
        return Site.objects.create(
            rcra_site=rcra_site or rcra_site_factory(),
            name=name or faker.name(),
            org=org or org_factory(),
            last_rcrainfo_manifest_sync=last_rcrainfo_manifest_sync
            or datetime.datetime.now(datetime.UTC),
        )

    return create_site


@pytest.fixture
def api_client_factory(db, user_factory):
    """Abstract factory for DRF APIClient testing class."""

    def create_client(
        user: User | None = None,
    ) -> APIClient:
        client = APIClient()
        client.force_authenticate(
            user=user or user_factory(),
        )
        return client

    return create_client


@pytest.fixture
def mock_responses():
    """Fixture for mocking external http request responses
    see Responses docs
    https://github.com/getsentry/responses#responses-as-a-pytest-fixture.
    """
    with responses.RequestsMock() as mock_responses:
        yield mock_responses


@pytest.fixture
def mock_emanifest_auth_response(request, mock_responses):
    api_id, api_key = request.param
    mock_responses.get(
        f"https://rcrainfopreprod.epa.gov/rcrainfo/rest/api/v1/auth/{api_id}/{api_key}",
        body='{"token": "mocK_token", "expiration": "2021-01-01T00:00:00.000000Z"}',
    )


@pytest.fixture
def mocker(mocker: pytest_mock.MockerFixture):
    """Wrapper fixture pytest-mock's mocker fixture for easy type annotations
    https://github.com/pytest-dev/pytest-mock.
    """
    return mocker


@pytest.fixture
def user_with_org_factory(
    db,
    user_factory,
    org_factory,
    rcrainfo_profile_factory,
    profile_factory,
    perm_factory,
):
    """Fixture for creating a user with an org that has set up RCRAInfo integration."""

    def create_fixtures(
        user: User | None = None,
        org: Org | None = None,
        admin_rcrainfo_profile: RcrainfoProfile | None = None,
        is_rcrainfo_enabled: bool | None = True,
    ):
        if is_rcrainfo_enabled:
            rcra_profile_data = {
                "rcra_api_id": "mock_api_id",
                "rcra_api_key": "mock_api_key",
                "rcra_username": "mock_username",
            }
        else:
            rcra_profile_data = {"rcra_api_id": None, "rcra_api_key": None, "rcra_username": None}
        user = user or user_factory()
        admin = user_factory(username="admin")
        admin_rcrainfo_profile or rcrainfo_profile_factory(**rcra_profile_data)
        org = org or org_factory(admin=admin)
        perm_factory(user, ["org.view_org"], org)
        profile_factory(user=user)
        return user, org

    return create_fixtures


@pytest.fixture(autouse=True)
def use_local_mem_cache_backend(settings):
    settings.CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        },
    }


@pytest.fixture
def cache_factory(settings):
    """Abstract factory for Haztrak Contact model."""

    def create_cache(location):
        settings.CACHES = {
            "default": {
                "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
                "LOCATION": location,
            },
        }

    return create_cache
