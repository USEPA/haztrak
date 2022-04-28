import io
from django.test import TestCase
from apps.api.serializers import ManifestSerializer, HandlerSerializer
from rest_framework.parsers import JSONParser

TEST_MANIFEST_JSON = './apps/api/tests/100033134ELC.json'
TEST_HANDLER_JSON = './apps/api/tests/test_site.json'


class ManifestSerializerTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        with open(TEST_MANIFEST_JSON, 'rb') as json_file:
            data = json_file.read()
        stream = io.BytesIO(data)
        data = JSONParser().parse(stream=stream)
        serializer = ManifestSerializer(data=data)
        cls.serializer = serializer

    def test_manifest_serializer_is_valid(self):
        is_valid = self.serializer.is_valid()
        if not is_valid:
            print(self.serializer.errors)
        self.assertTrue(self.serializer.is_valid())

    def test_serializer_creates_manifest_from_json(self):
        valid = self.serializer.is_valid()
        # print(self.serializer.validated_data)
        if not valid:
            print(self.serializer.errors)
        saved_manifest = self.serializer.save()
        self.assertEqual(f'{saved_manifest}', '100033134ELC')


class HandlerSerializerTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        with open(TEST_HANDLER_JSON, 'rb') as json_file:
            data = json_file.read()
        stream = io.BytesIO(data)
        data = JSONParser().parse(stream=stream)
        serializer = HandlerSerializer(data=data)
        cls.serializer = serializer

    def test_handler_serializer_is_valid(self):
        is_valid = self.serializer.is_valid()
        if not is_valid:
            print(self.serializer.errors)
        self.assertTrue(self.serializer.is_valid())

    def test_handler_save_new_model_instance(self):
        is_valid = self.serializer.is_valid()
        if not is_valid:
            print(self.serializer.errors)
        saved_site = self.serializer.save()
        self.assertEqual(f'{saved_site}', 'TESTSITEID2022')
