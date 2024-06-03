from apps.profile.models import Profile, RcrainfoProfile
from apps.profile.services import (
    get_or_create_rcra_profile,
    get_user_profile,
    get_user_rcrainfo_profile,
)


class TestTrakProfileServices:
    def test_get_user_profile(self, profile_factory, user_factory):
        user = user_factory()
        saved_profile = profile_factory(user=user)
        profile = get_user_profile(user=user)
        assert profile == saved_profile


class TestRcrainfoProfileServices:
    def test_getting_a_user_rcrainfo_profile(self, rcrainfo_profile_factory, profile_factory):
        rcrainfo_profile = rcrainfo_profile_factory()
        trak_profile = profile_factory(rcrainfo_profile=rcrainfo_profile)
        returned_profile = get_user_rcrainfo_profile(user=trak_profile.user)
        assert returned_profile == rcrainfo_profile

    def test_get_or_create_retrieves_by_username(
        self, rcrainfo_profile_factory, user_factory, profile_factory
    ):
        username = "my_username"
        mock_rcra_username = "my_rcra_username"
        user = user_factory(username=username)
        rcra_profile = rcrainfo_profile_factory(rcra_username=mock_rcra_username)
        profile_factory(user=user, rcrainfo_profile=rcra_profile)
        retrieved_rcra_profile, created = get_or_create_rcra_profile(username=username)
        assert retrieved_rcra_profile == rcra_profile
        assert created is False

    def test_get_or_create_returns_true_if_new_profile(self, user_factory):
        username = "my_username"
        user_factory(username=username)
        retrieved_rcra_profile, created = get_or_create_rcra_profile(username=username)
        assert isinstance(retrieved_rcra_profile, RcrainfoProfile)
        assert created is True

    def test_creates_creates_a_haztrak_profile_if_not_present(self, user_factory):
        # Arrange
        username = "my_username"
        user_factory(username=username)  # Note, we are not creating a HaztrakProfile
        # Act
        rcra_profile, created = get_or_create_rcra_profile(username=username)
        # Assert
        haztrak_profile = Profile.objects.get(user__username=username)
        assert haztrak_profile.rcrainfo_profile == rcra_profile
