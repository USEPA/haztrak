from apps.trak.models import Handler, ManifestHandler


class TestManifestHandlerModel:
    """Test related to the Manifest Handler model and its API"""

    def test_handler_created(self, db, manifest_gen) -> None:
        assert type(manifest_gen) is ManifestHandler

    def test_manager_creates_new_handler(self, handler_serializer) -> None:
        handler_serializer.is_valid()
        ManifestHandler.objects.create_manifest_handler(handler=handler_serializer.validated_data)
        new_handler = Handler.objects.get(epa_id=handler_serializer.validated_data["epa_id"])
        assert isinstance(new_handler, Handler)
