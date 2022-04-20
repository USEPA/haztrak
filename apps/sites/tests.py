from django.contrib.auth.models import User
from django.test import TestCase

from apps.sites.models import EpaSite, Address

TEST_ADDRESS = {
    'street_number': '123',
    'address1': 'MLK drive',
    'city': 'Arlington',
    'zip_code': 20022,
    'state_name': 'Virginia'
}

TEST_EPA_SITE = {
    'epa_id': "VATESTID2021",
    'epa_name': 'test site name',
    'modified': False,
    'has_site_id': True,
    'registered': True,
    # 'mailing_address': TEST_ADDRESS,
    'gis_primary': False,
    'can_esign': True,
    'limited_esign': False,
    'has_emanifest_user': True,
    'site_type': 'Generator',
    'federal_generator_status': 'LQG',
}


class SiteViewTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        address_object = Address(**TEST_ADDRESS)
        cls.site = EpaSite(mailing_address=address_object, **TEST_EPA_SITE)

    def setUp(self):
        User.objects.create_user(username='username', password='password')
        self.client.login(username='username', password='password')

    def test_site_table_view_exists(self):
        response = self.client.get('/sites/')
        self.assertEqual(response.status_code, 200)


class UnauthorizedSiteViewTest(TestCase):

    def test_site_now_allowed(self):
        response = self.client.get('/sites/', follow=False)
        self.assertEqual(response.status_code, 302)
