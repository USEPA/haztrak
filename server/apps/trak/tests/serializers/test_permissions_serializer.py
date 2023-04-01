import json
import logging

import pytest

from apps.sites.models.epa_profile_models import SitePermission
from apps.trak.serializers import SitePermissionSerializer

logger = logging.getLogger(__name__)


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
            logger.error(epa_permission_serializer.errors)
        SitePermission.objects.create(
            **epa_permission_serializer.validated_data,
            site=site_factory(),
            profile=rcra_profile_factory(),
        )
