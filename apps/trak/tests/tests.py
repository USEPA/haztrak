from random import randint

from django.test import TestCase

from lib.rcrainfo.manifest import from_json_file


class TrakViewsTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        file = './apps/trak/tests/100033134ELC.json'
        cls.manifest = from_json_file(file)

    def test_trak_url_exists(self):
        response = self.client.get('/trak/')
        self.assertEqual(response.status_code, 200)

    def test_intransit_exists(self):
        response = self.client.get('/trak/intransit/')
        self.assertEqual(response.status_code, 200)

    def test_manifest_view_exists(self):
        response = self.client.get(f'/trak/manifest/{self.manifest.id}')
        self.assertEqual(response.status_code, 200)

    def test_non_exist_mtn_view_returns_404(self):
        response = self.client.get(f'/trak/manifest/'
                                   f'{self.manifest.id + randint(100, 5000)}')
        self.assertEqual(response.status_code, 404)
