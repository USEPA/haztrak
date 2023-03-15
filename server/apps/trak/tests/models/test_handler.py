from apps.trak.models import Handler, ManifestHandler


class TestManifestHandlerModel:
    """Test related to the Manifest Handler model and its API"""

    def test_handler_created(self, db, manifest_handler_factory) -> None:
        assert type(manifest_handler_factory()) is ManifestHandler

    def test_manager_creates_new_handler(self, handler_serializer) -> None:
        handler_serializer.is_valid()
        ManifestHandler.objects.save(handler=handler_serializer.validated_data)
        new_handler = Handler.objects.get(epa_id=handler_serializer.validated_data["epa_id"])
        assert isinstance(new_handler, Handler)

    def test_signed_both_signatures_exists(self, manifest_handler_factory, e_signature_factory):
        manifest_handler = manifest_handler_factory()
        e_signature_factory(manifest_handler=manifest_handler)
        assert manifest_handler.signed is True

    def test_signed_only_paper(self, manifest_handler_factory):
        manifest_handler = manifest_handler_factory()
        assert manifest_handler.signed is True

    def test_signed_only_electronic(self, handler_factory, e_signature_factory):
        manifest_handler = ManifestHandler(
            handler=handler_factory(),
            paper_signature=None,
        )
        manifest_handler.save()
        e_signature_factory(manifest_handler=manifest_handler)
        assert manifest_handler.signed is True

    def test_signed_with_no_signatures(self, handler_factory):
        manifest_handler = ManifestHandler(
            handler=handler_factory(),
            paper_signature=None,
        )
        manifest_handler.save()
        assert manifest_handler.signed is False
