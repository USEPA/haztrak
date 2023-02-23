import re

from apps.trak.models import Address


class TestAddressModel:
    def test_address_created(self, db, address_123_main: Address) -> None:
        assert type(address_123_main) is Address

    def test_address_displays_address(self, address_123_main: Address) -> None:
        assert re.match("main", address_123_main.address1, re.IGNORECASE)

    def test_address_db_read_write(self, db, address_123_main) -> None:
        address_123_main.save()
        from_db_address = Address.objects.get(address1=address_123_main.address1)
        assert type(from_db_address) is Address
