import pytest
from django.core.exceptions import ValidationError

from apps.sites.models import Contact


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
