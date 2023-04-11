import pytest

from apps.trak.models import Handler, PaperSignature
from apps.trak.serializers import HandlerSerializer


@pytest.mark.django_db
class TestManifestHandlerSerializer:
    @pytest.fixture
    def manifest_handler_serializer(self, haztrak_json) -> HandlerSerializer:
        manifest_handler_serializer = HandlerSerializer(data=haztrak_json.HANDLER.value)
        manifest_handler_serializer.is_valid()
        return manifest_handler_serializer

    @pytest.fixture
    def paper_handler_serializer(self, haztrak_json) -> HandlerSerializer:
        handler_serializer = HandlerSerializer(data=haztrak_json.PAPER_MANIFEST_HANDLER.value)
        handler_serializer.is_valid()
        return handler_serializer

    def test_m_handler_serializes(self, haztrak_json) -> None:
        manifest_handler_serializer = HandlerSerializer(data=haztrak_json.HANDLER.value)
        assert manifest_handler_serializer.is_valid()

    def test_serializer_saves_handler(self, manifest_handler_serializer) -> None:
        manifest_handler = manifest_handler_serializer.save()
        assert isinstance(manifest_handler, Handler)

    def test_paper_manifest_handler_serializes(self, haztrak_json) -> None:
        manifest_handler_serializer = HandlerSerializer(
            data=haztrak_json.PAPER_MANIFEST_HANDLER.value
        )
        assert manifest_handler_serializer.is_valid()

    def test_creates_paper_signature(self, paper_handler_serializer) -> None:
        manifest_handler: Handler = paper_handler_serializer.save()
        assert isinstance(manifest_handler.paper_signature, PaperSignature)

    def test_serializer_flattens_foreign_keys(self, manifest_handler_serializer) -> None:
        # The Handler holds a foreign key to a RcraSite instance
        # however it should flatten that representation.
        assert "epaSiteId" in manifest_handler_serializer.data
        assert "rcra_site" not in manifest_handler_serializer.data
