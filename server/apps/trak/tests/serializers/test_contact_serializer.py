class TestContactSerializer:
    def test_contact_serializes(self, contact_serializer) -> None:
        contact_serializer.is_valid()
        # print('\n', json.dumps(contact_serializer.data, indent=2))
        assert contact_serializer.is_valid() is True


class TestEpaPhoneSerializer:
    def test_phone_serializes(self, phone_serializer) -> None:
        phone_serializer.is_valid()
        assert phone_serializer.is_valid() is True
