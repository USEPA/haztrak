import io
import logging
from django.test import TestCase
from apps.api.serializers import HandlerSerializer, ManifestSerializer
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import JSONParser

TEST_MANIFEST_JSON = './apps/api/tests/test_manifest.json'
TEST_HANDLER_JSON = './apps/api/tests/test_site.json'
TEST_ADDRESS_JSON = './apps/api/tests/test_address.json'


class ManifestSerializerTests(TestCase):
    def __int__(self):
        self.test_json = TEST_MANIFEST_JSON

    @classmethod
    def setUpTestData(cls):
        data = bytes_from_json(TEST_MANIFEST_JSON)
        serializer = ManifestSerializer(data=data)
        cls.serializer = serializer

    def setUp(self) -> None:
        self.valid = self.serializer.is_valid()
        if not self.valid:
            logging.error(f'{self.serializer.errors}')
            self.skipTest(
                f'ManifestSerializerTests.SetUpTestData failed to '
                f'initiate valid data from {self.test_json}')

    def test_manifest_serializer_is_valid(self):
        self.assertTrue(self.serializer.is_valid())

    def test_serializer_creates_manifest_from_json(self):
        saved_manifest = self.serializer.save()
        self.assertEqual(f'{saved_manifest}', '100033134ELC')


class HandlerSerializerTests(TestCase):
    def __int__(self):
        self.test_json = TEST_HANDLER_JSON

    @classmethod
    def setUpTestData(cls):
        data = bytes_from_json(TEST_HANDLER_JSON)
        serializer = HandlerSerializer(data=data)
        cls.serializer = serializer

    def setUp(self) -> None:
        self.valid = self.serializer.is_valid()
        if not self.valid:
            logging.error(f'{self.serializer.errors}')
            self.skipTest(
                f'ManifestSerializerTests.SetUpTestData failed to '
                f'initiate valid data from {self.test_json}')

    def test_handler_serializer_is_valid(self):
        self.assertTrue(self.valid)

    def test_handler_save_new_model_instance(self):
        saved_site = self.serializer.save()
        self.assertEqual(f'{saved_site}', 'TESTSITEID2022')


# utility function primarily used for loading test data from a file
def bytes_from_json(json_file: str) -> bytes:
    try:
        with open(json_file, 'rb') as open_file:
            stream = io.BytesIO(open_file.read())
        data = JSONParser().parse(stream=stream)
        return data
    except IOError:
        logging.error(f'{json_file} not found')
    except ValidationError:
        logging.error(f'Validation Error when serializing {json_file}')
