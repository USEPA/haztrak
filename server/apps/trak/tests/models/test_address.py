import re

import pytest

from apps.trak.models import Address


class TestAddressModel:
    @pytest.fixture(autouse=True)
    def _setup(self, address_factory):
        self.address = address_factory()

    def test_address_create(self, db) -> None:
        assert type(self.address) is Address

    def test_address_displays_address(self) -> None:
        assert re.match("main", self.address.address1, re.IGNORECASE)

    def test_address_db_read_write(self, db) -> None:
        self.address.save()
        from_db_address = Address.objects.get(address1=self.address.address1)
        assert type(from_db_address) is Address
