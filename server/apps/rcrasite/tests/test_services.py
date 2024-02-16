from apps.core.models import HaztrakProfile, RcrainfoProfile
from apps.rcrasite.services import get_or_create_rcra_profile


class TestRcraProfileServices:
    def test_get_or_create_retrieves_by_username(
        self, rcra_profile_factory, user_factory, haztrak_profile_factory
    ):
        username = "my_username"
        mock_rcra_username = "my_rcra_username"
        user = user_factory(username=username)
        rcra_profile = rcra_profile_factory(rcra_username=mock_rcra_username)
        haztrak_profile_factory(user=user, rcrainfo_profile=rcra_profile)
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
        haztrak_profile = HaztrakProfile.objects.get(user__username=username)
        assert haztrak_profile.rcrainfo_profile == rcra_profile
