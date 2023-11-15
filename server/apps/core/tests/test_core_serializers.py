import pytest

from apps.core.serializers import HaztrakProfileSerializer


class TestHaztrakProfileSerializer:
    def test_serializer_includes_username(self, haztrak_profile_factory, user_factory):
        my_username = "foobar1"
        user = user_factory(username=my_username)
        profile = haztrak_profile_factory(user=user)
        serializer = HaztrakProfileSerializer(profile)
        assert serializer.data["user"] == my_username

    def test_org_returns_null(self, haztrak_profile_factory, user_factory, haztrak_org_factory):
        user = user_factory()
        profile = haztrak_profile_factory(org=None, user=user)
        serializer = HaztrakProfileSerializer(profile)
        assert serializer.data["org"] is None

    def test_returns_the_user_org(
        self, haztrak_profile_factory, user_factory, haztrak_org_factory
    ):
        user = user_factory()
        org = haztrak_org_factory()
        profile = haztrak_profile_factory(org=org, user=user)
        serializer = HaztrakProfileSerializer(profile)
        assert serializer.data["org"]["name"] == org.name
