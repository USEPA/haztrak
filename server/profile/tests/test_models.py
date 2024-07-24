from profile.models import Profile, RcrainfoProfile

import pytest


@pytest.mark.django_db
class TestRcrainfoProfileModel:
    """Test related to the RcrainfoProfile model and its API"""

    def test_rcra_profile_factory(self, rcrainfo_profile_factory):
        """simply check the model saves given our factory's defaults"""
        rcra_profile = rcrainfo_profile_factory()
        assert isinstance(rcra_profile, RcrainfoProfile)

    @pytest.mark.parametrize("rcra_api_id", ["id", None])
    @pytest.mark.parametrize("rcra_api_key", ["key", None])
    def test_rcra_profile_is_not_api_user_if_one_missing(
        self, rcrainfo_profile_factory, rcra_api_id, rcra_api_key
    ):
        """If any of the three are None, the user should not be considered an API user"""
        # Arrange
        expected = True
        if rcra_api_id is None or rcra_api_key is None:
            expected = False
        rcra_profile = rcrainfo_profile_factory(rcra_api_id=rcra_api_id, rcra_api_key=rcra_api_key)
        # Act
        api_user = rcra_profile.has_rcrainfo_api_id_key
        # Assert
        assert api_user is expected

    def test_get_by_trak_username_returns_a_rcrainfo_profile(
        self, rcrainfo_profile_factory, profile_factory
    ):
        rcrainfo_profile = rcrainfo_profile_factory()
        trak_profile = profile_factory(rcrainfo_profile=rcrainfo_profile)
        username = trak_profile.user.username
        returned_profile = RcrainfoProfile.objects.get_by_trak_username(username)
        assert isinstance(returned_profile, RcrainfoProfile)


class TestProfileModel:
    def test_haztrak_profile_factory(self, profile_factory):
        profile = profile_factory()
        assert isinstance(profile, Profile)

    def test_get_profile_by_user(self, profile_factory, user_factory):
        user = user_factory()
        saved_profile = profile_factory(user=user)
        profile = Profile.objects.get_profile_by_user(user)
        assert profile == saved_profile
