import json
import logging

from django.test import TestCase

from apps.trak.models import Handler, Manifest, WasteLine
from apps.trak.serializers import ManifestSerializer


class SerializerBaseTests(TestCase):
    def __int__(self, test_json, serializer):
        self.test_json = test_json
        self.serializer = serializer

    def setUp(self) -> None:
        self.valid = self.serializer.is_valid()
        if not self.valid:
            logging.error(f"{self.serializer.errors}")
            self.fail(
                f"{self.__class__.__name__} failed to initiate valid data\n"
                f"{json.dumps(self.serializer.errors)}"
            )


class TestManifestSerializer:
    serializer_class = ManifestSerializer

    def test_save(self, manifest_10003114elc_serializer):
        manifest = None
        if manifest_10003114elc_serializer.is_valid():
            manifest = manifest_10003114elc_serializer.save()
        assert isinstance(manifest, Manifest)

    def test_multiple_transporter_are_serialized(self, manifest_10003114elc_serializer):
        manifest_10003114elc_serializer.is_valid()
        saved_manifest = manifest_10003114elc_serializer.save()
        number_transporters = len(manifest_10003114elc_serializer.data["transporters"])
        transporter = saved_manifest.transporters.all()
        assert len(transporter), number_transporters

    def test_serializer_saves_first_wasteline(self, manifest_10003114elc_serializer):
        manifest_10003114elc_serializer.is_valid()
        saved_manifest = manifest_10003114elc_serializer.save()
        waste_line = WasteLine.objects.filter(manifest=saved_manifest).first()
        assert isinstance(waste_line, WasteLine)


class TestHandlerSerializer:
    def test_save(self, handler_serializer):
        if handler_serializer.is_valid():
            saved_site = handler_serializer.save()
            assert isinstance(saved_site, Handler)
        else:
            assert False
