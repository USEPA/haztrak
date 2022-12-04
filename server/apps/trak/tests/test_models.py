from django.test import TestCase

from apps.trak.models import Address


def create_handler(address: str, st_num: str, city: str, country: str):
    return Address.objects.create(address1=address, street_number=st_num,
                                  country=country, city=city)


def create_address(address: str, st_num: str, city: str, country: str):
    return Address.objects.create(address1=address, street_number=st_num,
                                  country=country, city=city)


class AddressModelTests(TestCase):

    def test_address_creation(self):
        address = 'main st.'
        w = create_address(address=address, st_num='123', country='US',
                           city='foo')
        self.assertTrue(isinstance(w, Address))
        self.assertEqual(w.address1, address)
