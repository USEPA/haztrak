import pytest

from apps.trak.models import PaperSignature


class TestPaperSignatureModel:
    """Test related to the PaperSignature model and its API"""

    @pytest.fixture(autouse=True)
    def _setup(self, db, paper_signature_factory):
        self.paper_signature = paper_signature_factory()

    def test_required_fields(self, db):
        assert isinstance(self.paper_signature, PaperSignature)
