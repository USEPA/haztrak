import json

import pytest

from apps.sites.models import SitePermission
from apps.sites.serializers import (
    ContactSerializer,
    EpaPermissionSerializer,
    EpaSiteSerializer,
    SitePermissionSerializer,
)


class TestContactSerializer:
    @pytest.fixture
    def contact_serializer(self, haztrak_json) -> ContactSerializer:
        return ContactSerializer(data=haztrak_json.CONTACT.value)

    def test_serializes_contact_model(self, contact_serializer) -> None:
        assert contact_serializer.is_valid() is True


class TestEpaSiteSerializer:
    @pytest.fixture
    def epa_site_serializer(self, haztrak_json) -> EpaSiteSerializer:
        return EpaSiteSerializer(data=haztrak_json.HANDLER.value)

    def test_serializes(self, epa_site_serializer):
        assert epa_site_serializer.is_valid() is True


class TestSitePermissionSerializer:
    """
    This Test suite is for haztrak's internal record of
    user's RCRAInfo site permissions.
    """

    @pytest.fixture(autouse=True)
    def _permissions(self, site_permission_factory):
        self.permissions = site_permission_factory()

    @pytest.fixture
    def site_permission_serializer(self, haztrak_json) -> SitePermissionSerializer:
        return SitePermissionSerializer(data=haztrak_json.SITE_PERMISSION.value)

    def test_serializes(self, site_permission_serializer) -> None:
        assert site_permission_serializer.is_valid() is True

    def test_object_serializes_permission_object(self) -> None:
        serializer = SitePermissionSerializer(self.permissions)
        site_permission_json = json.dumps(serializer.data)
        assert str(self.permissions.biennial_report) in site_permission_json


class TestEpaPermissionSerializer:
    """
    This Test suite is for Haztrak's serializer for communication with
    RCRAInfo for a user's site permissions.

    We don't use EPaPermissionSerializer to communicate internally, so
    currently we don't serialize, only deserialize
    """

    @pytest.fixture
    def epa_permission_serializer(self, haztrak_json) -> EpaPermissionSerializer:
        return EpaPermissionSerializer(data=haztrak_json.EPA_PERMISSION.value)

    def test_deserializes_epa_permissions(
        self, epa_permission_serializer, epa_profile_factory, site_factory
    ) -> None:
        if not epa_permission_serializer.is_valid():
            # if something is wrong with the serializer fixture, fail
            assert False
        SitePermission.objects.create(
            **epa_permission_serializer.validated_data,
            site=site_factory(),
            profile=epa_profile_factory(),
        )
