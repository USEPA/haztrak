from django.test import TestCase

from apps.trak.models import Address


class AddressModelTests(TestCase):

    @staticmethod
    def create_address(address: str, st_num: str, city: str, country: str):
        return Address.objects.create(address1=address, street_number=st_num,
                                      country=country, city=city)

    def test_model_creation(self):
        address = 'main st.'
        w = self.create_address(address=address, st_num='123', country='US',
                                city='foo')
        self.assertTrue(isinstance(w, Address))
        self.assertEqual(w.address1, address)
