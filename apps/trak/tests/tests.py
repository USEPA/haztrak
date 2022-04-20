import json
from django.test import TestCase
from apps.trak.models import Manifest
from apps.trak.models import Handler


class TrakViewsTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        file = './apps/trak/tests/100033134ELC.json'
        with open(file, 'r') as json_file:
            data = json.loads(json_file.read())
        gen_object = Handler.objects.create(**data['generator'])
        data['generator'] = gen_object
        # cls.data = Manifest.objects.create(**data)

    def test_trak_url_exists(self):
        response = self.client.get('/trak/')
        self.assertEqual(response.status_code, 200)

    def test_intransit_exists(self):
        response = self.client.get('/trak/intransit/')
        self.assertEqual(response.status_code, 200)
