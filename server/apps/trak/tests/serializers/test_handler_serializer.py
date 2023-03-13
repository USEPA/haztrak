from apps.trak.models import Handler, ManifestHandler, PaperSignature
from apps.trak.serializers import ManifestHandlerSerializer


class TestManifestHandlerSerializer:
    def test_m_handler_serializes(self, haztrak_json) -> None:
        manifest_handler_serializer = ManifestHandlerSerializer(data=haztrak_json.HANDLER.value)
        assert manifest_handler_serializer.is_valid()

    def test_serializer_saves_handler(self, db, manifest_handler_serializer) -> None:
        manifest_handler = manifest_handler_serializer.save()
        assert isinstance(manifest_handler, ManifestHandler)

    def test_paper_manifest_handler_serializes(self, haztrak_json) -> None:
        manifest_handler_serializer = ManifestHandlerSerializer(
            data=haztrak_json.PAPER_MANIFEST_HANDLER.value
        )
        assert manifest_handler_serializer.is_valid()

    def test_creates_paper_signature(self, db, paper_handler_serializer) -> None:
        manifest_handler: ManifestHandler = paper_handler_serializer.save()
        assert isinstance(manifest_handler.paper_signature, PaperSignature)

    def test_serializer_flattens_foreign_keys(self, manifest_handler_serializer) -> None:
        # The ManifestHandler holds a foreign key to a Handler instance
        # however it should flatten that representation.
        assert "epaSiteId" in manifest_handler_serializer.data
        assert "handler" not in manifest_handler_serializer.data


class TestHandlerSerializer:
    def test_save(self, handler_serializer):
        if handler_serializer.is_valid():
            saved_site = handler_serializer.save()
            assert isinstance(saved_site, Handler)
        else:
            assert False
