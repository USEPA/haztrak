import json

import pytest

from apps.trak.models import Address, Handler
from apps.trak.serializers import WasteLineSerializer
from apps.trak.tests.serializers.test_serializers import TEST_WASTE1_JSON


@pytest.fixture
def address_123_main(db) -> Address:
    return Address.objects.create(address1='Main st.', street_number='123',
                                  country='VA', city='Arlington')


@pytest.fixture
def handler001(db, address_123_main) -> Handler:
    return Handler.objects.create(epa_id='handler001', name='my_handler',
                                  site_type='Generator', site_address=address_123_main,
                                  mail_address=address_123_main, contact="{}")


@pytest.fixture
def waste_serializer(db) -> WasteLineSerializer:
    with open(TEST_WASTE1_JSON, 'r') as f:
        data = json.load(f)
    return WasteLineSerializer(data=data)
