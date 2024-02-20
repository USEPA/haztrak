import json
import os
import random
import string
from datetime import UTC, datetime
from enum import Enum
from typing import Dict, Literal, Optional

import pytest
import pytest_mock
import responses
from django.contrib.auth.models import User
from faker import Faker
from faker.providers import BaseProvider
from rest_framework.test import APIClient

from apps.core.models import (
    TrakUser,
)
from apps.handler.models import (
    ESignature,
    Handler,
    ManifestPhone,
    PaperSignature,
    Signer,
    Transporter,
)
from apps.manifest.models import Manifest
from apps.org.models import TrakOrg, TrakOrgAccess
from apps.profile.models import RcrainfoProfile, RcrainfoSiteAccess, TrakProfile
from apps.rcrasite.models import (
    Address,
    Contact,
    RcraPhone,
    RcraSite,
    RcraSiteType,
)
from apps.site.models import TrakSite, TrakSiteAccess


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


@pytest.fixture
def user_factory(db, faker):
    """Abstract factory for Django's User model"""

    def create_user(
        username: Optional[str] = None,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        email: Optional[str] = None,
        password: Optional[str] = None,
    ) -> TrakUser:
        return TrakUser.objects.create_user(
            username=username or faker.user_name(),
            first_name=first_name or faker.first_name(),
            last_name=last_name or faker.last_name(),
            email=email or faker.email(),
            password=password or faker.password(),
        )

    return create_user


@pytest.fixture
def rcra_profile_factory(db, user_factory, faker: Faker):
    """Abstract factory for Haztrak RcrainfoProfile model"""

    def create_profile(
        rcra_api_id: Optional[str] = str(faker.uuid4()),
        rcra_api_key: Optional[str] = faker.pystr(min_chars=15),
        rcra_username: Optional[str] = faker.pystr(min_chars=12),
    ) -> RcrainfoProfile:
        return RcrainfoProfile.objects.create(
            rcra_api_id=rcra_api_id,
            rcra_api_key=rcra_api_key,
            rcra_username=rcra_username,
        )

    return create_profile


@pytest.fixture
def haztrak_profile_factory(db, user_factory, rcra_profile_factory, haztrak_org_factory):
    """Abstract factory for Haztrak RcrainfoProfile model"""

    def create_profile(
        user: Optional[User] = None,
        rcrainfo_profile: Optional[RcrainfoProfile] = rcra_profile_factory(),
    ) -> TrakProfile:
        return TrakProfile.objects.create(
            user=user or user_factory(),
            rcrainfo_profile=rcrainfo_profile,
        )

    return create_profile


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

    return create_address


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

    return create_site_phone


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

    return create_epa_phone


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

    return create_contact


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
def validated_data_factory():
    def _create_data_dict(*, instance, serializer) -> Dict:
        data = serializer(instance).data
        new_serializer = serializer(data=data)
        new_serializer.is_valid(raise_exception=True)
        return new_serializer.validated_data

    return _create_data_dict


@pytest.fixture
def haztrak_org_factory(db, rcra_profile_factory, user_factory, faker):
    """Abstract factory for Haztrak Org model"""

    def create_org(
        org_id: Optional[str] = None,
        name: Optional[str] = None,
        admin: Optional[TrakUser] = None,
    ) -> TrakOrg:
        return TrakOrg.objects.create(
            id=org_id or faker.uuid4(),
            name=name or faker.company(),
            admin=admin or user_factory(),
        )

    return create_org


@pytest.fixture
def haztrak_site_factory(db, rcra_site_factory, haztrak_org_factory, faker):
    """Abstract factory for Haztrak Site model"""

    def create_site(
        rcra_site: Optional[RcraSite] = None,
        name: Optional[str] = None,
        org: Optional[TrakOrg] = None,
    ) -> TrakSite:
        return TrakSite.objects.create(
            rcra_site=rcra_site or rcra_site_factory(),
            name=name or faker.name(),
            org=org or haztrak_org_factory(),
        )

    return create_site


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


@pytest.fixture
def haztrak_site_permission_factory(db, faker, haztrak_site_factory, haztrak_profile_factory):
    """Abstract factory for Haztrak RcraSitePermissions model"""

    def create_permission(
        site: Optional[TrakSite] = None,
        user: Optional[TrakUser] = None,
        emanifest: Optional[Literal["viewer", "signer", "editor"]] = "viewer",
    ) -> TrakSiteAccess:
        """Returns testuser1 RcraSitePermissions model to site_generator"""
        return TrakSiteAccess.objects.create(
            site=site or haztrak_site_factory(),
            user=user or user_factory(),
            emanifest=emanifest,
        )

    return create_permission


@pytest.fixture
def user_with_org_factory(
    db,
    user_factory,
    haztrak_org_factory,
    rcra_profile_factory,
    haztrak_profile_factory,
    org_permission_factory,
):
    """Fixture for creating a user with an org that has set up RCRAInfo integration"""

    def create_fixtures(
        user: Optional[User] = None,
        org: Optional[TrakOrg] = None,
        admin_rcrainfo_profile: Optional[RcrainfoProfile] = None,
        is_rcrainfo_enabled: Optional[bool] = True,
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
        admin_rcrainfo_profile or rcra_profile_factory(**rcra_profile_data)
        org = org or haztrak_org_factory(admin=admin)
        org_permission_factory(org=org, user=user)
        haztrak_profile_factory(user=user)
        return user, org

    return create_fixtures


class MtnProvider(BaseProvider):
    SUFFIXES = ["ELC", "JJK", "FLE"]
    STATUSES = ["NotAssigned", "Pending", "Scheduled", "InTransit", "ReadyForSignature"]
    NUMBERS = ["".join(random.choices(string.digits, k=9)) for _ in range(100)]

    def mtn(self):
        return f"{self.random_element(self.NUMBERS)}{self.random_element(self.SUFFIXES)}"

    def status(self):
        return f"{self.random_element(self.STATUSES)}"


@pytest.fixture
def manifest_factory(db, manifest_handler_factory, rcra_site_factory):
    """Abstract factory for Haztrak Manifest model"""

    def create_manifest(
        mtn: Optional[str] = None,
        generator: Optional[Handler] = None,
        tsdf: Optional[Handler] = None,
        status: Optional[str] = None,
    ) -> Manifest:
        fake = Faker()
        fake.add_provider(MtnProvider)
        return Manifest.objects.create(
            mtn=mtn or fake.mtn(),
            status=status or fake.status(),
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


@pytest.fixture
def rcra_permission_factory(db, rcra_site_factory, rcra_profile_factory):
    """Abstract factory for Haztrak RcraSitePermissions model"""

    def create_permission(
        site: Optional[str] = None,
        profile: Optional[RcrainfoProfile] = None,
        site_manager: Optional[bool] = True,
        annual_report: Optional[str] = "Certifier",
        biennial_report: Optional[str] = "Certifier",
        e_manifest: Optional[str] = "Certifier",
        wiets: Optional[str] = "Certifier",
        my_rcra_id: Optional[str] = "Certifier",
    ) -> RcrainfoSiteAccess:
        """Returns testuser1 RcraSitePermissions model to site_generator"""
        fake = Faker()
        fake.add_provider(SiteIDProvider)
        return RcrainfoSiteAccess.objects.create(
            site=site or fake.site_id(),
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
def org_permission_factory(db, user_factory, haztrak_org_factory):
    """Abstract factory for Haztrak OrgPermissions model"""

    def create_permission(
        org: Optional[TrakOrg] = None,
        user: Optional[TrakUser] = None,
    ) -> TrakOrgAccess:
        """Returns testuser1 RcraSitePermissions model to site_generator"""
        return TrakOrgAccess.objects.create(
            org=org or haztrak_org_factory(),
            user=user or user_factory(),
        )

    return create_permission
