import json

from apps.trak.models import SitePermission
from apps.trak.serializers import SitePermissionSerializer


class TestSitePermissionSerializer:
    """
    This Test suite is for haztrak's internal record of
    user's RCRAInfo site permissions.
    """

    def test_serializes(self, site_permission_serializer) -> None:
        assert site_permission_serializer.is_valid() is True

    def test_object_serializes_permission_object(self, site_permission) -> None:
        serializer = SitePermissionSerializer(site_permission)
        site_permission_json = json.dumps(serializer.data)
        assert str(site_permission.biennial_report) in site_permission_json


class TestEpaPermissionSerializer:
    """
    This Test suite is for Haztrak's serializer for communication with
    RCRAInfo for a user's site permissions.

    We don't use EPaPermissionSerializer to communicate internally, so
    currently we don't serialize, only deserialize
    """

    def test_deserializes_epa_permissions(
        self, epa_permission_serializer, test_user_profile, site_generator001
    ) -> None:
        # print(epa_permission_serializer.is_valid())
        if not epa_permission_serializer.is_valid():
            print(epa_permission_serializer.errors)
        print("validated data: ", epa_permission_serializer.validated_data)
        SitePermission.objects.create(
            **epa_permission_serializer.validated_data,
            site=site_generator001,
            profile=test_user_profile,
        )
