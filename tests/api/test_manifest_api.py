import json
import os

from rest_framework.test import APITestCase

from apps.trak.models import Manifest

JSON_DIR = os.path.dirname(os.path.abspath(__file__))
TEST_MANIFEST_JSON = f'{JSON_DIR}/test_manifest.json'


class GetManifestTests(APITestCase):
    base_url = '/api/manifest/'
    fixtures = ['test_data.json']

    @classmethod
    def setUpTestData(cls):
        cls.number_of_mtn = Manifest.objects.all().count()
        cls.first_mtn = Manifest.objects.all()[0]
        with open(TEST_MANIFEST_JSON, 'r') as json_file:
            json_string = json_file.read()
        cls.data = json.loads(json_string)

    # Test that these urls return 200 with logged in user
    def test_get_manifest_by_mtn_response(self):
        response = self.client.get(f'{self.base_url}{self.first_mtn}')
        self.assertEqual(str(self.first_mtn), response.data['manifestTrackingNumber'])

    def test_get_manifest_by_mtn_status(self):
        response = self.client.get(f'{self.base_url}{self.first_mtn}')
        self.assertEqual(response.status_code, 200)

    def test_post_manifest(self):
        new_mtn = '000000009ELC'
        self.client.post(f'{self.base_url}{new_mtn}', data=self.data, format='json')
        new_manifest = Manifest.objects.get(mtn=new_mtn)
        self.assertEqual(new_mtn, str(new_manifest))
