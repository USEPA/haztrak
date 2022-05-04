import io
from django.test import TestCase
from django.contrib.auth.models import User
from random import randint
from lib.rcrainfo import manifest
from rest_framework.parsers import JSONParser
from apps.trak.models import Site, Manifest, Address
from apps.api.serializers import HandlerSerializer

TEST_MANIFEST_JSON = './apps/trak/tests/100033134ELC.json'
TEST_HANDLER_JSON = './apps/api/tests/test_site.json'

TEST_ADDRESS = {
    'street_number': '123',
    'address1': 'MLK drive',
    'city': 'Arlington',
    'state': 'Virginia',
    'country': 'US',
    'zip': '20022',
}

TEST_EPA_SITE = {
    'name': 'VA TEST GENERATOR',
}


# TODO clean up all tests across the apps and consolidate (DRY) methods,
#  may involve moving serializers to the lib directory
class TrakViewsTest(TestCase):
    # SetUpTestData() runs once per Test Class, setUp() runs each method
    @classmethod
    def setUpTestData(cls):
        # create and save objects to testing database
        serializer = manifest.serializer_from_file(TEST_MANIFEST_JSON)
        serializer.is_valid()
        serializer.save()
        with open(TEST_HANDLER_JSON, 'rb') as json_file:
            data = io.BytesIO(json_file.read())
        data = JSONParser().parse(stream=data)
        handler_serializer = HandlerSerializer(data=data)
        handler_serializer.is_valid()
        handler_instance = handler_serializer.save()
        Site.objects.create(epa_site=handler_instance,
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


class AddressModel(TestCase):
    @classmethod
    def setUpTestData(cls):
        Address.objects.create(**TEST_ADDRESS)
        cls.address = Address.objects.filter(street_number=TEST_ADDRESS['street_number']).get()
