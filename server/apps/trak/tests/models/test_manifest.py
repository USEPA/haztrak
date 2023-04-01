import re

import pytest
from django.core.exceptions import ValidationError
from django.db.models import Q

from apps.trak.models.handler_model import HandlerType
from apps.trak.models.manifest_model import Manifest, draft_mtn, validate_mtn


@pytest.mark.django_db
class TestManifestModel:
    def test_draft_mtn_format(self):
        """
        ensure our default MTN for draft manifests follows the
        same format as EPA uniform hazardous waste (e.g., 123456789ELC)
        """
        new_mtn = draft_mtn()
        assert re.match(r"[0-9]{9}[A-Z]{3}", new_mtn)

    @pytest.mark.parametrize("mtn", ["123456789ELC", "111111111DFT", "100200300JJK"])
    def test_mtn_validation_raises_no_error(self, mtn):
        assert validate_mtn(mtn) is None

    @pytest.mark.parametrize("mtn", ["foo_bar", "111111DFT", "123456789"])
    def test_mtn_validation_raises_error(self, mtn):
        with pytest.raises(ValidationError):
            assert validate_mtn(mtn) is None

    def test_get_handler_query_maps_handler_types(self):
        query = Manifest.objects.get_handler_query(
            site_type=HandlerType.GENERATOR, site_id="mock_EPA_ID"
        )
        assert isinstance(query, Q)

    def test_get_handler_query_maps_strings(self):
        query = Manifest.objects.get_handler_query(site_type="generator", site_id="mock_EPA_ID")
        assert isinstance(query, Q)

    def test_get_handler_query_raises_value_error(self):
        with pytest.raises(ValueError):
            Manifest.objects.get_handler_query(site_type="bad_argument", site_id="mock_EPA_ID")
