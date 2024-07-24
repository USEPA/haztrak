import pytest

from rcrasite.serializers import (
    ContactSerializer,
    RcraSiteSerializer,
)


class TestContactSerializer:
    @pytest.fixture
    def contact_serializer(self, haztrak_json) -> ContactSerializer:
        return ContactSerializer(data=haztrak_json.CONTACT.value)

    def test_serializes_contact_model(self, contact_serializer) -> None:
        assert contact_serializer.is_valid() is True


class TestRcraSiteSerializer:
    @pytest.fixture
    def rcra_site_serializer(self, haztrak_json) -> RcraSiteSerializer:
        return RcraSiteSerializer(data=haztrak_json.HANDLER.value)

    def test_serializes(self, rcra_site_serializer):
        assert rcra_site_serializer.is_valid() is True
