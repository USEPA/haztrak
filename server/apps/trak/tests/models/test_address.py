import pytest
from django.db import IntegrityError

from apps.trak.models import Address


class TestAddressModel:
    @pytest.fixture(autouse=True)
    def _setup(self, address_factory):
        self.address = address_factory()

    def test_address_create(self, db) -> None:
        print(repr(self.address))
        assert type(self.address) is Address

    def test_address_required_fields(self, address_factory) -> None:
        with pytest.raises(IntegrityError):
            address_factory(address1=None)
