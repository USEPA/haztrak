import json


class TestContactSerializer:
    def test_contact_serializer_output(self, contact_serializer) -> None:
        contact_serializer.is_valid()
        print('\n', json.dumps(contact_serializer.data, indent=2))
        assert contact_serializer.is_valid() is True
