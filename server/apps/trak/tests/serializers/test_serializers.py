import io
import json
import logging
import os

from django.db import IntegrityError
from django.test import TestCase
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import JSONParser

from apps.trak.models import Handler, Manifest, WasteLine
from apps.trak.serializers import HandlerSerializer, ManifestSerializer

JSON_DIR = os.path.dirname(os.path.abspath(__file__)) + '/json'
TEST_MANIFEST_JSON = f'{JSON_DIR}/test_manifest.json'
TEST_HANDLER_JSON = f'{JSON_DIR}/test_site.json'
TEST_ADDRESS_JSON = f'{JSON_DIR}/test_address.json'


class SerializerBaseTests(TestCase):
    def __int__(self, test_json, serializer):
        self.test_json = test_json
        self.serializer = serializer

    def setUp(self) -> None:
        self.valid = self.serializer.is_valid()
        if not self.valid:
            logging.error(f'{self.serializer.errors}')
            self.fail(
                f'{self.__class__.__name__} failed to initiate valid data\n'
                f'{json.dumps(self.serializer.errors)}')


class ManifestSerializerTests(SerializerBaseTests):
    def __int__(self, *args, **kwargs):
        super(ManifestSerializerTests, self).__int__(test_json=TEST_MANIFEST_JSON,
                                                     serializer=ManifestSerializer)

    @classmethod
    def setUpTestData(cls):
        try:
            data = bytes_from_json(TEST_MANIFEST_JSON)
            serializer = ManifestSerializer(data=data)
            cls.serializer = serializer
            cls.json_data = data
        except IntegrityError:
            cls.skipTest('integrity error placeholder')

    def test_save(self):
        saved_manifest = self.serializer.save()
        self.assertIsInstance(saved_manifest, Manifest)

    def test_multiple_transporter_are_serialized(self):
        try:
            number_transporters = len(dict(self.json_data)['transporters'])
            saved_manifest = self.serializer.save()
            transporter = saved_manifest.transporters.all()
            self.assertEqual(len(transporter), number_transporters)
        except KeyError:
            self.fail('Problem getting transporter data from JSON')

    def test_serializer_saves_first_wasteline(self):
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

    def test_save(self):
        saved_site = self.serializer.save()
        self.assertIsInstance(saved_site, Handler)


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
