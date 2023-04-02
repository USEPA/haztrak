class TestWasteLineSerializer:
    def test_waste_line_json_deserializes(self, waste_serializer) -> None:
        assert waste_serializer.is_valid() is True
