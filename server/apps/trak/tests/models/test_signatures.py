from datetime import datetime

import pytest

from apps.trak.models import PaperSignature


@pytest.fixture
def paper_signature(db):
    return PaperSignature.objects.create(printed_name="David Graham", sign_date=datetime.utcnow())


class TestPaperSignatureModel:
    """Test related to the PaperSignature model and its API"""

    def test_required_fields(self, db):
        paper_signature = PaperSignature.objects.create(
            printed_name="David Graham", sign_date=datetime.utcnow()
        )
        assert isinstance(paper_signature, PaperSignature)
