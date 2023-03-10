import re

from apps.trak.models.manifest_model import draft_mtn


class TestManifestModel:
    def test_draft_mtn_format(self, db):
        """
        ensure our default MTN for draft manifests follows the
        same format as EPA uniform hazardous waste (e.g., 123456789ELC)
        """
        new_mtn = draft_mtn()
        assert re.match(r"[0-9]{9}[A-Z]{3}", new_mtn)
