import pytest

from apps.trak.serializers import WasteLineSerializer


@pytest.fixture
def waste_serializer(db, haztrak_json) -> WasteLineSerializer:
    return WasteLineSerializer(data=haztrak_json.WASTELINE_1.value)


class TestWasteLineSerializer:
    def test_waste_line_json_deserializes(self, waste_serializer) -> None:
        assert waste_serializer.is_valid() is True
