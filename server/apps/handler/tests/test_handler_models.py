import pytest

from apps.handler.models import Handler


@pytest.mark.django_db
class TestHandlerModel:
    """Test related to the Manifest Handler model and its API"""

    def test_manifest_handler_saves(self, manifest_handler_factory) -> None:
        """simply check the model saves given our factory's defaults"""
        assert type(manifest_handler_factory()) is Handler

    def test_is_signed_with_both_signatures_types(
        self, manifest_handler_factory, e_signature_factory, paper_signature_factory
    ):
        # Arrange
        manifest_handler = manifest_handler_factory(paper_signature=paper_signature_factory())
        e_signature_factory(manifest_handler=manifest_handler)
        # Act/Assert
        assert manifest_handler.signed is True

    def test_is_signed_when_paper_signature_exists(
        self, manifest_handler_factory, paper_signature_factory
    ):
        # Arrange
        manifest_handler = manifest_handler_factory(paper_signature=paper_signature_factory())
        # Act/Assert
        assert manifest_handler.signed is True

    def test_is_signed_when_electronic_signature_exists(
        self, rcra_site_factory, e_signature_factory
    ):
        # Arrange
        manifest_handler = Handler(
            rcra_site=rcra_site_factory(),
            paper_signature=None,
        )
        manifest_handler.save()
        e_signature_factory(manifest_handler=manifest_handler)
        # Act/Assert
        assert manifest_handler.signed is True

    def test_is_not_signed_with_no_signatures(self, rcra_site_factory):
        # Arrange
        manifest_handler = Handler(
            rcra_site=rcra_site_factory(),
            paper_signature=None,
        )
        manifest_handler.save()
        # Act/Assert
        assert manifest_handler.signed is False
