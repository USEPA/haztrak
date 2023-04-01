import pytest

from apps.sites.models import EpaSite
from apps.trak.models import ManifestHandler


@pytest.mark.django_db
class TestManifestHandlerModel:
    """Test related to the Manifest EpaSite model and its API"""

    def test_handler_created(self, manifest_handler_factory) -> None:
        assert type(manifest_handler_factory()) is ManifestHandler

    def test_manager_creates_new_handler(self, handler_serializer) -> None:
        handler_serializer.is_valid()
        ManifestHandler.objects.save(epa_site=handler_serializer.validated_data)
        new_handler = EpaSite.objects.get(epa_id=handler_serializer.validated_data["epa_id"])
        assert isinstance(new_handler, EpaSite)

    def test_signed_both_signatures_exists(self, manifest_handler_factory, e_signature_factory):
        manifest_handler = manifest_handler_factory()
        e_signature_factory(manifest_handler=manifest_handler)
        assert manifest_handler.signed is True

    def test_signed_only_paper(self, manifest_handler_factory):
        manifest_handler = manifest_handler_factory()
        assert manifest_handler.signed is True

    def test_signed_only_electronic(self, epa_site_factory, e_signature_factory):
        manifest_handler = ManifestHandler(
            epa_site=epa_site_factory(),
            paper_signature=None,
        )
        manifest_handler.save()
        e_signature_factory(manifest_handler=manifest_handler)
        assert manifest_handler.signed is True

    def test_signed_with_no_signatures(self, epa_site_factory):
        manifest_handler = ManifestHandler(
            epa_site=epa_site_factory(),
            paper_signature=None,
        )
        manifest_handler.save()
        assert manifest_handler.signed is False
