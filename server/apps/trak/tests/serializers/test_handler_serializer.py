import pytest

from apps.trak.models import Handler, ManifestHandler


class TestManifestHandlerSerializer:
    def test_m_handler_serializes(self, manifest_handler_serializer) -> None:
        assert manifest_handler_serializer.is_valid() is True

    def test_serializer_saves_handler(self, db, manifest_handler_serializer) -> None:
        if manifest_handler_serializer.is_valid():
            manifest_handler = manifest_handler_serializer.save()
            assert isinstance(manifest_handler, ManifestHandler)
        else:
            pytest.fail()

    def test_serializer_flattens_foreign_keys(self, manifest_handler_serializer) -> None:
        if manifest_handler_serializer.is_valid():
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
