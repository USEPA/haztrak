import io
import logging
import os

from django.test import TestCase
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import JSONParser

from apps.api.serializers import (HandlerSerializer, ManifestSerializer,
                                  WasteLineSerializer)
from apps.trak.models import Handler, Manifest, WasteLine

JSON_DIR = os.path.dirname(os.path.abspath(__file__))
TEST_MANIFEST_JSON = f'{JSON_DIR}/test_manifest.json'
TEST_HANDLER_JSON = f'{JSON_DIR}/test_site.json'
TEST_ADDRESS_JSON = f'{JSON_DIR}/test_address.json'
TEST_WASTE1_JSON = f'{JSON_DIR}/test_wasteline1.json'


class SerializerBaseTests(TestCase):
    def __int__(self, test_json, serializer):
        self.test_json = test_json
        self.serializer = serializer

    def setUp(self) -> None:
        self.valid = self.serializer.is_valid()
        if not self.valid:
            logging.error(f'{self.serializer.errors}')
            self.fail(
                f'{self.__class__.__name__} failed to initiate valid data')


class ManifestSerializerTests(SerializerBaseTests):
    def __int__(self, *args, **kwargs):
        super(ManifestSerializerTests, self).__int__(test_json=TEST_MANIFEST_JSON,
                                                     serializer=ManifestSerializer)

    @classmethod
    def setUpTestData(cls):
        data = bytes_from_json(TEST_MANIFEST_JSON)
        serializer = ManifestSerializer(data=data)
        cls.serializer = serializer
        cls.json_data = data

    def test_is_valid(self):
        self.assertTrue(self.serializer.is_valid())

    def test_save(self):
        saved_manifest = self.serializer.save()
        self.assertIsInstance(saved_manifest, Manifest)

    def test_create_populated_transporter_field(self):
        try:
            transporter_id = dict(self.json_data)['transporters'][0]['epaSiteId']
            saved_manifest = self.serializer.save()
            transporter = saved_manifest.transporters.all()
            transporter = [str(transporter) for transporter in transporter]
            self.assertIn(transporter_id, transporter)
        except KeyError:
            self.fail('Problem getting transporter data from JSON')

    def test_create_transporter_field_contains_multiple(self):
        try:
            number_transporters = len(dict(self.json_data)['transporters'])
            saved_manifest = self.serializer.save()
            transporter = saved_manifest.transporters.all()
            self.assertEqual(len(transporter), number_transporters)
        except KeyError:
            self.fail('Problem getting transporter data from JSON')

    def test_save_manifest_creates_wasteline(self):
        saved_manifest = self.serializer.save()
        waste_line = WasteLine.objects.filter(manifest=saved_manifest).first()
        self.assertIsInstance(waste_line, WasteLine)


class HandlerSerializerTests(SerializerBaseTests):
    def __int__(self, *args, **kwargs):
        super(HandlerSerializerTests, self).__int__(test_json=TEST_HANDLER_JSON,
                                                    serializer=HandlerSerializer)

    @classmethod
    def setUpTestData(cls):
        data = bytes_from_json(TEST_HANDLER_JSON)
        serializer = HandlerSerializer(data=data)
        cls.serializer = serializer

    def test_is_valid(self):
        self.assertTrue(self.valid)

    def test_save(self):
        saved_site = self.serializer.save()
        self.assertIsInstance(saved_site, Handler)


class WasteLineSerializerTest(SerializerBaseTests):

    def __int__(self, *args, **kwargs):
        super(WasteLineSerializerTest, self).__int__(test_json=TEST_WASTE1_JSON,
                                                     serializer=WasteLineSerializer)

    @classmethod
    def setUpTestData(cls):
        data = bytes_from_json(TEST_WASTE1_JSON)
        serializer = WasteLineSerializer(data=data)
        cls.serializer = serializer

    def test_is_valid(self):
        self.assertTrue(self.valid)

    # def test_save(self):
    #     save_waste_line = self.serializer.save()
    #     self.assertIsInstance(save_waste_line, WasteLine)


def bytes_from_json(json_file: str) -> bytes:
    """
    utility function primarily used for loading test data from a file
    """
    try:
        with open(json_file, 'rb') as open_file:
            stream = io.BytesIO(open_file.read())
        data = JSONParser().parse(stream=stream)
        return data
    except IOError:
        logging.error(f'{json_file} not found')
    except ValidationError:
        logging.error(f'Validation Error when serializing {json_file}')
