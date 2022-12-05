import re

import pytest

from apps.trak.models import Address


@pytest.fixture
def address_123_main(db) -> Address:
    return Address.objects.create(address1='Main st.', street_number='123',
                                  country='VA', city='Arlington')


class TestAddressModel:

    def test_address_created(self, db, address_123_main: Address) -> None:
        assert type(address_123_main) is Address

    def test_address_displays_address(self, address_123_main: Address) -> None:
        assert re.match('main', address_123_main.address1, re.IGNORECASE)
