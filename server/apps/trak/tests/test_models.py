import re

import pytest

from apps.trak.models import Address, Handler


@pytest.fixture
def address_123_main(db) -> Address:
    return Address.objects.create(address1='Main st.', street_number='123',
                                  country='VA', city='Arlington')


@pytest.fixture
def handler001(db, address_123_main) -> Handler:
    return Handler.objects.create(epa_id='handler001', name='my_handler',
                                  site_type='Generator', site_address=address_123_main,
                                  mail_address=address_123_main, contact="{}")


class TestAddressModel:

    def test_address_created(self, db, address_123_main: Address) -> None:
        assert type(address_123_main) is Address

    def test_address_displays_address(self, address_123_main: Address) -> None:
        assert re.match('main', address_123_main.address1, re.IGNORECASE)

    def test_address_db_read_write(self, db, address_123_main) -> None:
        address_123_main.save()
        from_db_address = Address.objects.get(address1=address_123_main.address1)
        assert type(from_db_address) is Address


class TestHandlerModel:

    def test_handler_created(self, db, handler001: Handler) -> None:
        assert type(handler001) is Handler

    def test_handler_connects_to_site_address(self, db, handler001,
                                              address_123_main) -> None:
        assert handler001.site_address.address1 == address_123_main.address1

    def test_handler_db_read_write(self, db, handler001) -> None:
        handler001.save()
        from_db_handler = Handler.objects.get(epa_id=handler001.epa_id)
        assert type(from_db_handler) is Handler
