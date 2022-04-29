from django.test import TestCase
from django.contrib.auth.models import User
from random import randint
from lib.rcrainfo import manifest
from apps.trak.models import Site, Manifest, Handler

TEST_MANIFEST_JSON = [
    './apps/trak/tests/100033134ELC.json',
    './apps/trak/tests/123456789ELC.json',
]

TEST_ADDRESS = {
    'street_number': '123',
    'address1': 'MLK drive',
    'city': 'Arlington',
    'zip_code': 20022,
    'state_name': 'Virginia'
}

TEST_HANDLER = {
    'epa_id': 'VATESTID2021',
    'name': 'test site name',
    'modified': False,
    'contact': {'blah': 'blah'},
    'registered': True,
    'site_address': {'blah': 'blah'},
    'mailing_address': {'blah': 'blah'},
    'gis_primary': False,
    'can_esign': True,
    'limited_esign': False,
}

TEST_EPA_SITE = {
    'name': 'VA TEST GENERATOR',
    # 'epa_site': TEST_HANDLER,
}


class TrakViewsTest(TestCase):
    # SetUpTestData() runs once per Test Class, setUp() runs each method
    @classmethod
    def setUpTestData(cls):
        # create and save objects to testing database
        serializer = manifest.serializer_from_file(TEST_MANIFEST_JSON[0])
        serializer.is_valid()
        serializer.save()
        handler_object = Handler.objects.create(**TEST_HANDLER)
        Site.objects.create(epa_site=handler_object,
                            **TEST_EPA_SITE)
        User.objects.create_user(username='username', password='password')
        # assign database objects to class for easy access
        cls.mtn_100033134ELC = Manifest.objects.get(mtn=serializer.validated_data['mtn'])
        cls.site = Site.objects.filter(id=1).get()

    def setUp(self) -> None:
        self.client.login(username='username', password='password')

    # Test that these urls return 200 with logged in user
    def test_trak_url_exists(self):
        response = self.client.get('/trak/')
        self.assertEqual(response.status_code, 200)

    def test_manifest_view_exists(self):
        response = self.client.get(f'/trak/manifest/{self.mtn_100033134ELC.id}')
        self.assertEqual(response.status_code, 200)

    def test_site_details_view_exists(self):
        response = self.client.get(f'/trak/{self.site.epa_site.epa_id}/details')
        self.assertEqual(response.status_code, 200)

    # Test that these URLs redirect to login page if user is logged out
    def test_trak_url_redirect_without_login(self):
        self.client.logout()
        response = self.client.get(f'/trak/{self.site.epa_site.epa_id}/details')
        self.assertEqual(response.status_code, 302)

    def test_manifest_view_redirects_without_login(self):
        self.client.logout()
        response = self.client.get(f'/trak/manifest/{self.mtn_100033134ELC.id}', follow=False)
        self.assertEqual(response.status_code, 302)

    def test_site_details_view_redirects_without_login(self):
        self.client.logout()
        response = self.client.get(f'/trak/{self.site.epa_site.epa_id}/details', follow=False)
        self.assertEqual(response.status_code, 302)

    # Test non-existent model objects return 404
    def test_non_exist_mtn_view_returns_404(self):
        response = self.client.get(f'/trak/manifest/'
                                   f'{randint(len(TEST_MANIFEST_JSON) + 1, 64)}')
        self.assertEqual(response.status_code, 404)

    def test_non_exist_site_view_returns_404(self):
        response = self.client.get(f'/trak/{randint(111111111, 999999999)}ELC/details')
        self.assertEqual(response.status_code, 404)
