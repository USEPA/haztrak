import pytest
from django.core.exceptions import ValidationError
from django.db import IntegrityError

from apps.sites.models import Address, Contact, EpaProfile


@pytest.mark.django_db
class TestAddressModel:
    def test_address_create(self, address_factory) -> None:
        address = address_factory()
        assert isinstance(address, Address)

    def test_address_required_fields(self, address_factory) -> None:
        with pytest.raises(IntegrityError):
            address_factory(address1=None)


@pytest.mark.django_db
class TestContactModel:
    @pytest.fixture(autouse=True)
    def _setup(self, contact_factory, site_phone_factory):
        self.phone = site_phone_factory(number="214-555-5555")
        self.contact = contact_factory(
            phone=self.phone,
            first_name="test",
            middle_initial="Q",
            last_name="user",
        )

    def test_address_create(self) -> None:
        assert type(self.contact) is Contact

    def test_contact_email_validation(self, contact_factory):
        with pytest.raises(ValidationError):
            contact = Contact(first_name="test", last_name="foo", email="bad_email")
            contact.full_clean()


@pytest.mark.django_db
class TestRcraProfileModel:
    """Test related to the EpaProfile model and its API"""

    @pytest.fixture(autouse=True)
    def _setup_profile(self, rcra_profile_factory):
        self.profile = rcra_profile_factory()

    def test_rcra_profile_saves(self):
        assert isinstance(self.profile, EpaProfile)

    def test_is_api_user_returns_true(self):
        assert self.profile.is_api_user

    def test_is_api_user_returns_false_one_empty(self, rcra_profile_factory, user_factory):
        profile = rcra_profile_factory(rcra_api_id=None, user=user_factory(username="foobar"))
        assert not profile.is_api_user

    def test_is_api_user_false_when_empty(self, rcra_profile_factory, user_factory):
        profile = rcra_profile_factory(
            user=user_factory(username="barfoo"),
            rcra_api_id=None,
            rcra_api_key=None,
            rcra_username=None,
        )
        assert not profile.is_api_user
