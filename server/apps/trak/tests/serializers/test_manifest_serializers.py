import pytest

from apps.trak.models import AdditionalInfo, Manifest, WasteLine
from apps.trak.serializers import ManifestSerializer


@pytest.fixture
def manifest_10003114elc_serializer(db, haztrak_json) -> ManifestSerializer:
    return ManifestSerializer(data=haztrak_json.MANIFEST.value)


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

    def test_saves_additional_info(self, manifest_10003114elc_serializer):
        manifest_10003114elc_serializer.is_valid()
        print(manifest_10003114elc_serializer.validated_data["additional_info"])
        manifest = manifest_10003114elc_serializer.save()
        additional_info = manifest.additional_info
        assert isinstance(additional_info, AdditionalInfo)
