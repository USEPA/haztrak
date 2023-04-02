import random
import string
from datetime import datetime, timezone
from typing import Optional

import pytest

from apps.trak.models import ESignature, ManifestHandler, Signer


@pytest.fixture
def e_signature_factory(db, signer_factory, manifest_handler_factory):
    """Abstract factory for Haztrak ManifestHandler model"""

    def create_e_signature(
        signer: Optional[Signer] = None,
        manifest_handler: Optional[ManifestHandler] = None,
    ) -> ESignature:
        return ESignature.objects.create(
            signer=signer or signer_factory(),
            manifest_handler=manifest_handler or manifest_handler_factory(),
            sign_date=datetime.utcnow().replace(tzinfo=timezone.utc),
            cromerr_activity_id="".join(random.choices(string.ascii_letters, k=10)),
            cromerr_document_id="".join(random.choices(string.ascii_letters, k=10)),
            on_behalf=False,
        )

    yield create_e_signature
