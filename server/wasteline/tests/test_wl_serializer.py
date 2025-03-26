"""Tests for waste line serializer."""

import pytest
from wasteline.serializers import WasteLineSerializer


@pytest.fixture
def waste_serializer(db, haztrak_json) -> WasteLineSerializer:
    """Fixture for waste line serializer."""
    return WasteLineSerializer(data=haztrak_json.WASTELINE_1.value)


class TestWasteLineSerializer:
    """Tests for waste line serializer."""

    def test_waste_line_json_deserializes(self, waste_serializer) -> None:
        """Test that the waste line JSON deserializes."""
        assert waste_serializer.is_valid() is True
