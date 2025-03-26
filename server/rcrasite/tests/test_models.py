import pytest
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from rcrasite.models import Address, Contact


@pytest.mark.django_db
class TestAddressModel:
    def test_address_factory_saves_instance(self, address_factory) -> None:
        """Simply check the model saves given our factory's defaults."""
        address = address_factory()
        assert isinstance(address, Address)

    def test_address_1_is_required(self, faker) -> None:
        """The only required field in the EPA schema."""
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
        """Simply check the model saves given our factory's defaults."""
        contact = contact_factory()
        assert isinstance(contact, Contact)

    @pytest.mark.parametrize("email", ["bad_email", "email.@example.com", "email.example.com"])
    def test_contact_raises_error_with_invalid_emails(self, contact_factory, email):
        with pytest.raises(ValidationError):  # noqa: PT012
            contact = Contact(email=email)
            contact.full_clean()
