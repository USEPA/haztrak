import json

import pytest

from apps.sites.models import SitePermission
from apps.sites.serializers import SitePermissionSerializer


class TestContactSerializer:
    def test_serializes(self, contact_serializer) -> None:
        contact_serializer.is_valid()
        assert contact_serializer.is_valid() is True


class TestEpaSiteSerializer:
    def test_serializes(self, handler_serializer):
        assert handler_serializer.is_valid() is True


class TestSitePermissionSerializer:
    """
    This Test suite is for haztrak's internal record of
    user's RCRAInfo site permissions.
    """

    @pytest.fixture(autouse=True)
    def _permissions(self, site_permission_factory):
        self.permissions = site_permission_factory()

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

    def test_deserializes_epa_permissions(
        self, epa_permission_serializer, rcra_profile_factory, site_factory
    ) -> None:
        if not epa_permission_serializer.is_valid():
            # if something is wrong with the serializer fixture, fail
            assert False
        SitePermission.objects.create(
            **epa_permission_serializer.validated_data,
            site=site_factory(),
            profile=rcra_profile_factory(),
        )
