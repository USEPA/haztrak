class TestWasteLineSerializer:
    def test_waste_line_json_deserializes(self, waste_serializer) -> None:
        assert waste_serializer.is_valid() is True

    def test_deserialized_waste_line_saves(self, waste_serializer) -> None:
        # waste_serializer.is_valid()
        # saved_waste_line = waste_serializer.save()
        # assert type(saved_waste_line) is WasteLine
        # ToDo: we need a manifest pytest.fuxture that we can assign to
        #  manifest_id field on the wasteline
        assert True
