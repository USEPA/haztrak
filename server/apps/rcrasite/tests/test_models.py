import pytest
from django.core.exceptions import ValidationError
from django.db import IntegrityError

from apps.rcrasite.models import Address, Contact
from apps.site.models import HaztrakSite


@pytest.mark.django_db
class TestAddressModel:
    def test_address_factory_saves_instance(self, address_factory) -> None:
        """simply check the model saves given our factory's defaults"""
        address = address_factory()
        assert isinstance(address, Address)

    def test_address_1_is_required(self, faker) -> None:
        """This is the only required field in the EPA schema"""
        with pytest.raises(IntegrityError):
            Address.objects.create(
                address1=None,
                city="springfield",
                state="TX",
                zip=12345,
                country="US",
            )


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


class TestHaztrakSiteModel:
    def test_haztrak_site_model_factory(self, haztrak_site_factory):
        haztrak_site = haztrak_site_factory()
        assert isinstance(haztrak_site, HaztrakSite)

    def test_returns_true_if_admin_has_provided_api_credentials(
        self,
        haztrak_site_factory,
        rcra_profile_factory,
        user_factory,
        haztrak_org_factory,
        haztrak_profile_factory,
    ):
        admin = user_factory(username="admin")
        rcra_profile = rcra_profile_factory(rcra_api_id="mock", rcra_api_key="mock")
        haztrak_profile_factory(user=admin, rcrainfo_profile=rcra_profile)
        org = haztrak_org_factory(admin=admin)
        site = haztrak_site_factory(org=org)
        assert site.admin_has_rcrainfo_api_credentials

    def test_returns_false_if_admin_has_not_provided_api_credentials(
        self,
        haztrak_site_factory,
        rcra_profile_factory,
        user_factory,
        haztrak_org_factory,
        haztrak_profile_factory,
    ):
        admin = user_factory(username="admin")
        rcra_profile = rcra_profile_factory(rcra_api_id=None, rcra_api_key=None)
        haztrak_profile_factory(user=admin, rcrainfo_profile=rcra_profile)
        org = haztrak_org_factory(admin=admin)
        site = haztrak_site_factory(org=org)
        assert not site.admin_has_rcrainfo_api_credentials
