import pytest

from apps.profile.models import RcrainfoSiteAccess
from apps.profile.serializers import TrakProfileSerializer
from apps.rcrasite.serializers import (
    RcrainfoSitePermissionsSerializer,
    RcraSitePermissionSerializer,
)


@pytest.mark.django_db
class TestTrakProfileSerializer:
    def test_serializer_includes_username(self, profile_factory, user_factory):
        my_username = "foobar1"
        user = user_factory(username=my_username)
        profile = profile_factory(user=user)
        serializer = TrakProfileSerializer(profile)
        assert serializer.data["user"] == my_username

    def test_org_returns_null(self, profile_factory, user_factory, org_factory):
        user = user_factory()
        profile = profile_factory(user=user)
        serializer = TrakProfileSerializer(profile)
        assert serializer.data["org"] is None

    def test_returns_the_user_org(
        self, profile_factory, user_factory, org_factory, org_access_factory
    ):
        user = user_factory()
        org = org_factory()
        org_access_factory(user=user, org=org)
        profile = profile_factory(user=user)
        serializer = TrakProfileSerializer(profile)
        assert serializer.data["org"]["name"] == org.name


class TestRcraSitePermissionSerializer:
    """This Test suite is for haztrak's internal record of user's RCRAInfo site permissions."""

    @pytest.fixture(autouse=True)
    def _permissions(self, rcrainfo_site_access_factory):
        self.permissions = rcrainfo_site_access_factory()

    @pytest.fixture
    def permission_serializer(self, haztrak_json) -> RcraSitePermissionSerializer:
        return RcraSitePermissionSerializer(data=haztrak_json.SITE_PERMISSION.value)

    def test_deserializes_json(self, permission_serializer) -> None:
        assert permission_serializer.is_valid() is True

    def test_object_serializes_permission_object(self, rcrainfo_site_access_factory) -> None:
        serializer = RcraSitePermissionSerializer(self.permissions)
        assert (
            str(self.permissions.biennial_report)
            == serializer.data["permissions"]["biennialReport"]
        )


class TestRcrainfoSitePermissionSerializer:
    """
    This Test suite is for Haztrak's serializer for communication with
    RCRAInfo for a user's site permissions.

    We don't use EPaPermissionSerializer to communicate internally, so
    currently we don't serialize, only deserialize
    """

    @pytest.fixture
    def epa_permission_serializer(self, haztrak_json) -> RcrainfoSitePermissionsSerializer:
        return RcrainfoSitePermissionsSerializer(data=haztrak_json.EPA_PERMISSION.value)

    def test_deserializes_epa_permissions(
        self, epa_permission_serializer, rcrainfo_profile_factory, rcra_site_factory
    ) -> None:
        if not epa_permission_serializer.is_valid():
            # if something is wrong with the serializer fixture, fail
            assert False
        rcrainfo_site_access = RcrainfoSiteAccess.objects.create(
            **epa_permission_serializer.validated_data,
            profile=rcrainfo_profile_factory(),
        )
        assert isinstance(rcrainfo_site_access, RcrainfoSiteAccess)
