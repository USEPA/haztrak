import io
from django.test import TestCase
from apps.api.serializers import ManifestSerializer
from apps.trak.models import Manifest
from rest_framework.parsers import JSONParser

# Create your tests here.

TEST_MANIFEST_JSON = './apps/api/tests/100033134ELC.json'


class ManifestSerializerTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        with open(TEST_MANIFEST_JSON, 'rb') as json_file:
            data = json_file.read()
        stream = io.BytesIO(data)
        data = JSONParser().parse(stream=stream)
        serializer = ManifestSerializer(data=data)
        cls.serializer = serializer

    def test_serializer_is_valid(self):
        self.assertTrue(self.serializer.is_valid())

        # serializer.is_valid()
        # print("is valid: ", serializer.is_valid())
        # if not serializer.is_valid():
        #     print("errors: ", serializer.errors)
        # else:
        #     serializer.save()
