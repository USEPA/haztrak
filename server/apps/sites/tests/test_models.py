import pytest
from django.core.exceptions import ValidationError
from django.db import IntegrityError

from apps.sites.models import Address, Contact, RcraProfile


@pytest.mark.django_db
class TestAddressModel:
    def test_address_model_saves(self, address_factory) -> None:
        """simply check the model saves given our factory's defaults"""
        address = address_factory()
        assert isinstance(address, Address)

    def test_address_1_is_required(self, address_factory) -> None:
        """This is the only required field in the EPA schema"""
        with pytest.raises(IntegrityError):
            address_factory(address1=None)


@pytest.mark.django_db
class TestContactModel:
    def test_contact_modal_saves(self, contact_factory) -> None:
        """simply check the model saves given our factory's defaults"""
        contact = contact_factory()
        assert isinstance(contact, Contact)

    @pytest.mark.parametrize("email", ["bad_email", "email.@example.com", "email.example.com"])
    def test_contact_raises_error_with_invalid_emails(self, contact_factory, email):
        with pytest.raises(ValidationError):
            contact = Contact(email=email)
            contact.full_clean()


@pytest.mark.django_db
class TestRcraProfileModel:
    """Test related to the RcraProfile model and its API"""

    def test_rcra_profile_saves(self, rcra_profile_factory):
        """simply check the model saves given our factory's defaults"""
        rcra_profile = rcra_profile_factory()
        assert isinstance(rcra_profile, RcraProfile)

    @pytest.mark.parametrize("rcra_username", ["username", None])
    @pytest.mark.parametrize("rcra_api_id", ["id", None])
    @pytest.mark.parametrize("rcra_api_key", ["key", None])
    def test_rcra_profile_is_not_api_user_if_one_missing(
        self, rcra_profile_factory, rcra_username, rcra_api_id, rcra_api_key
    ):
        """If any of the three are None, the user should not be considered an API user"""
        # Arrange
        expected = True
        if rcra_username is None or rcra_api_id is None or rcra_api_key is None:
            expected = False
        rcra_profile = rcra_profile_factory(
            rcra_username=rcra_username, rcra_api_id=rcra_api_id, rcra_api_key=rcra_api_key
        )
        # Act
        api_user = rcra_profile.is_api_user
        # Assert
        assert api_user is expected
