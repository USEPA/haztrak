from apps.trak.models import ESignature, Handler, ManifestHandler


class TestHandlerModel:
    """Test related to the Handler model and its API"""

    def test_handler_created(self, db, generator001) -> None:
        assert type(generator001) is Handler

    def test_handler_connects_to_site_address(self, db, generator001, address_123_main) -> None:
        assert generator001.site_address.address1 == address_123_main.address1

    def test_handler_db_read_write(self, db, generator001) -> None:
        generator001.save()
        from_db_handler = Handler.objects.get(epa_id=generator001.epa_id)
        assert type(from_db_handler) is Handler


class TestManifestHandlerModel:
    """Test related to the Manifest Handler model and its API"""

    def test_handler_created(self, db, manifest_gen) -> None:
        assert type(manifest_gen) is ManifestHandler

    def test_manager_creates_new_handler(self, handler_serializer) -> None:
        handler_serializer.is_valid()
        ManifestHandler.objects.create_manifest_handler(handler=handler_serializer.validated_data)
        new_handler = Handler.objects.get(epa_id=handler_serializer.validated_data["epa_id"])
        assert isinstance(new_handler, Handler)
