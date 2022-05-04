import io
import logging

from django.test import TestCase
from apps.api.serializers import HandlerSerializer, AddressSerializer
from rest_framework.parsers import JSONParser
from lib.rcrainfo import manifest

TEST_MANIFEST_JSON = './apps/api/tests/test_manifest.json'
TEST_HANDLER_JSON = './apps/api/tests/test_site.json'
TEST_ADDRESS_JSON = './apps/api/tests/test_address.json'


class ManifestSerializerTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        serializer = manifest.serializer_from_file(TEST_MANIFEST_JSON)
        cls.serializer = serializer

    def setUp(self) -> None:
        self.valid = self.serializer.is_valid()
        if not self.serializer.is_valid():
            logging.error(f'{self.serializer.errors}')
            self.skipTest(
                f'ManifestSerializerTests.SetUpTestData failed to initiate valid data from {TEST_MANIFEST_JSON}')

    def test_manifest_serializer_is_valid(self):
        # test = self.serializer.validated_data.pop('tsd')
        # print(dict(test))
        self.assertTrue(self.serializer.is_valid())

    def test_custom_to_internal_values_method_reads_import_field(self):
        if not self.serializer.data['import']:
            self.assertFalse(self.serializer.validated_data.import_flag)
        elif self.serializer.data['import']:
            self.assertTrue(self.serializer.validated_data.import_flag)

    # def test_custom_to_representation_serializes_import_field(self):
    #     print(self.serializer.to_representation(self.serializer.validated_data))

    def test_serializer_creates_manifest_from_json(self):
        saved_manifest = self.serializer.save()
        self.assertEqual(f'{saved_manifest}', '100033134ELC')


class HandlerSerializerTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        with open(TEST_HANDLER_JSON, 'rb') as json_file:
            data = io.BytesIO(json_file.read())
        data = JSONParser().parse(stream=data)
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


class AddressSerializerTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        with open(TEST_ADDRESS_JSON, 'rb') as json_file:
            data = io.BytesIO(json_file.read())
        data = JSONParser().parse(stream=data)
        serializer = AddressSerializer(data=data)
        cls.serializer = serializer

    def setUp(self) -> None:
        self.valid = self.serializer.is_valid()

    def test_address_serializer_validates(self):
        print(self.serializer.data)
        self.assertIsNotNone(self.serializer.validated_data)
