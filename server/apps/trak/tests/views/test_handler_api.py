from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from apps.trak.models import Address, Handler

# test data (for UnitTest based unit tests)
my_site_id = 'my_epa_id'
handler_test_object = {
    "site_type": 'Generator',
    "epa_id": my_site_id,
    "name": "VA TEST GEN 2021",
    "modified": None,
    "registered": None,
    "contact": {
        "phone": {
            "number": "703-308-0023"
        },
        "email": "Testing@EPA.GOV"
    },
    "emergency_phone": {
        "number": "703-308-0023"
    },
    "electronic_signatures_info": None,
    "gis_primary": False,
    "can_esign": None,
    "limited_esign": None,
    "registered_emanifest_user": None
}
handler_address = {
    "street_number": "123",
    "address1": "VA TEST GEN 2021 WAY",
    "address2": None,
    "city": "Arlington",
    "state": "VA",
    "country": "US",
    "zip": "20022"
}


class HandlerAPITest(APITestCase):
    base_url = '/api/trak/handler/'

    def setUp(self) -> None:
        self.user = User.objects.create_user(username='testuser1', email='foo@bar.com',
                                             password='password1')
        self.client.force_authenticate(self.user)
        self.address = Address.objects.create(**handler_address)
        self.Handler = Handler.objects.create(**handler_test_object,
                                              site_address=self.address,
                                              mail_address=self.address)

    def test_valid_request_returns_ok(self):
        handler_key = self.Handler.pk
        response = self.client.get(f'{self.base_url}details/{handler_key}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_valid_contains_serialized_handler(self):
        handler_key = self.Handler.pk
        response = self.client.get(f'{self.base_url}details/{handler_key}')
        self.assertEqual(response.data['epaSiteId'], my_site_id)
