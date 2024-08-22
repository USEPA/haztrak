from datetime import UTC, datetime

import pytest
from django.db import IntegrityError

from manifest.models import PaperSignature


@pytest.mark.django_db
class TestPaperSignatureModel:
    """Test related to the PaperSignature model and its API"""

    def test_paper_signature_saves(self, paper_signature_factory):
        """simply check the model saves given our factory's defaults"""
        paper_signature = paper_signature_factory()
        assert isinstance(paper_signature, PaperSignature)

    def test_printed_name_is_required(self, paper_signature_factory):
        with pytest.raises(IntegrityError):
            return PaperSignature.objects.create(
                printed_name=None,
                sign_date=datetime.now(UTC),
            )
