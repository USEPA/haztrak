import pytest
from django.db import IntegrityError

from apps.trak.models import PaperSignature


class TestPaperSignatureModel:
    """Test related to the PaperSignature model and its API"""

    @pytest.fixture(autouse=True)
    def _setup(self, db, paper_signature_factory):
        self.paper_signature = paper_signature_factory()

    def test_paper_signature_saves(self):
        assert isinstance(self.paper_signature, PaperSignature)

    def test_printed_name_is_required(self, paper_signature_factory):
        with pytest.raises(IntegrityError):
            paper_signature_factory(printed_name=None)
