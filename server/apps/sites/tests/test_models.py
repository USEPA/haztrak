import pytest
from django.core.exceptions import ValidationError
from django.db import IntegrityError

from apps.sites.models import Address, Contact, EpaProfile


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
        assert type(contact_factory()) is Contact

    @pytest.mark.parametrize("email", ["bad_email", "email.@example.com", "email.example.com"])
    def test_contact_raises_error_with_invalid_emails(self, contact_factory, email):
        with pytest.raises(ValidationError):
            contact = Contact(email=email)
            contact.full_clean()


@pytest.mark.django_db
class TestEpaProfileModel:
    """Test related to the EpaProfile model and its API"""

    def test_rcra_profile_saves(self, epa_profile_factory):
        # Arrange
        epa_profile = epa_profile_factory()
        # Act/Assert
        assert isinstance(epa_profile, EpaProfile)

    @pytest.mark.parametrize("rcra_username", ["username", None])
    @pytest.mark.parametrize("rcra_api_id", ["id", None])
    @pytest.mark.parametrize("rcra_api_key", ["key", None])
    def test_epa_profile_is_not_api_user_if_one_missing(
        self, epa_profile_factory, rcra_username, rcra_api_id, rcra_api_key
    ):
        """If any of the three are None, the user should not be considered an API user"""
        # Arrange
        expected = True
        if rcra_username is None or rcra_api_id is None or rcra_api_key is None:
            expected = False
        epa_profile = epa_profile_factory(
            rcra_username=rcra_username, rcra_api_id=rcra_api_id, rcra_api_key=rcra_api_key
        )
        # Act
        api_user = epa_profile.is_api_user
        # Assert
        assert api_user is expected
