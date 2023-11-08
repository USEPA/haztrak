import pytest
from django.core.exceptions import ValidationError
from django.db import IntegrityError

from apps.core.models import RcraProfile
from apps.sites.models import Address, Contact, HaztrakSite


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

    @pytest.mark.parametrize("rcra_api_id", ["id", None])
    @pytest.mark.parametrize("rcra_api_key", ["key", None])
    def test_rcra_profile_is_not_api_user_if_one_missing(
        self, rcra_profile_factory, rcra_api_id, rcra_api_key
    ):
        """If any of the three are None, the user should not be considered an API user"""
        # Arrange
        expected = True
        if rcra_api_id is None or rcra_api_key is None:
            expected = False
        rcra_profile = rcra_profile_factory(rcra_api_id=rcra_api_id, rcra_api_key=rcra_api_key)
        # Act
        api_user = rcra_profile.has_api_credentials
        # Assert
        assert api_user is expected


class TestHaztrakSiteModel:
    def test_haztrak_site_model_factory(self, haztrak_site_factory):
        haztrak_site = haztrak_site_factory()
        assert isinstance(haztrak_site, HaztrakSite)

    def test_returns_true_if_admin_has_provided_api_credentials(
        self, haztrak_site_factory, rcra_profile_factory, user_factory
    ):
        admin = user_factory(username="admin")
        admin_rcrainfo_profile = rcra_profile_factory(
            user=admin,
            rcra_api_id="mock_id",
            rcra_api_key="mock_key",
        )
        haztrak_profile = haztrak_site_factory(admin_rcrainfo_profile=admin_rcrainfo_profile)
        assert haztrak_profile.admin_has_rcrainfo_api_credentials

    def test_returns_false_if_admin_has_not_provided_api_credentials(
        self, haztrak_site_factory, rcra_profile_factory, user_factory
    ):
        admin = user_factory(username="admin")
        admin_rcrainfo_profile = rcra_profile_factory(
            user=admin,
            rcra_api_id=None,
            rcra_api_key=None,
        )
        haztrak_profile = haztrak_site_factory(admin_rcrainfo_profile=admin_rcrainfo_profile)
        assert not haztrak_profile.admin_has_rcrainfo_api_credentials
