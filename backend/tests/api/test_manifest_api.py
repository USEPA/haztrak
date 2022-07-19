import json
import os

from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from apps.trak.models import Manifest

JSON_DIR = os.path.dirname(os.path.abspath(__file__))
TEST_MANIFEST_JSON = f'{JSON_DIR}/test_manifest.json'


class ManifestAPITests(APITestCase):
    base_url = '/api/trak/manifest/'
    fixtures = ['test_data.json']

    @classmethod
    def setUpTestData(cls):
        cls.number_of_mtn = Manifest.objects.all().count()
        cls.first_mtn = Manifest.objects.all()[0]
        with open(TEST_MANIFEST_JSON, 'r') as json_file:
            json_string = json_file.read()
        cls.data = json.loads(json_string)

    def setUp(self) -> None:
        self.user = User.objects.create_user('username', 'foo@bar.com', 'Pas$w0rd')
        self.client.login(username='username', password='Pas$w0rd')
        self.client.force_authenticate(self.user)

    def test_get_manifest_by_mtn_status(self):
        response = self.client.get(f'{self.base_url}{self.first_mtn}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_non_existent_returns_404(self):
        response = self.client.get(f'{self.base_url}000000111FOO')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
