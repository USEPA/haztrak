import pytest
from django.db import IntegrityError

from apps.sites.models import Address


@pytest.mark.django_db
class TestAddressModel:
    def test_address_create(self, address_factory) -> None:
        address = address_factory()
        assert isinstance(address, Address)

    def test_address_required_fields(self, address_factory) -> None:
        with pytest.raises(IntegrityError):
            address_factory(address1=None)
