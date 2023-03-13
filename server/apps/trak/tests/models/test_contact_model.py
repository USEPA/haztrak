import pytest
from django.core.exceptions import ValidationError

from apps.trak.models import Contact


class TestContactModel:
    @pytest.fixture(autouse=True)
    def _setup(self, contact_factory, epa_phone_factory):
        self.phone = epa_phone_factory(number="214-555-5555")
        self.contact = contact_factory(
            phone=self.phone,
            first_name="test",
            middle_initial="Q",
            last_name="user",
        )

    def test_address_create(self, db) -> None:
        assert type(self.contact) is Contact

    def test_contact_email_validation(self, db, contact_factory):
        with pytest.raises(ValidationError):
            contact = Contact(first_name="test", last_name="foo", email="bad_email")
            contact.full_clean()
