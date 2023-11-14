import pytest

from apps.core.models import HaztrakProfile, RcraProfile


@pytest.mark.django_db
class TestRcraProfileModel:
    """Test related to the RcraProfile model and its API"""

    def test_rcra_profile_factory(self, rcra_profile_factory):
        """simply check the model saves given our factory's defaults"""
        rcra_profile = rcra_profile_factory()
        assert isinstance(rcra_profile, RcraProfile)

    @pytest.mark.parametrize("rcra_api_id", ["id", None])
    @pytest.mark.parametrize("rcra_api_key", ["key", None])
    def test_rcra_profile_is_not_api_user_if_one_missing(
        self, rcra_profile_factory, rcra_api_id, rcra_api_key
    ):
        """If any of the three are None, the user should not be considered an API user"""
        # Arrange
        expected = True
        if rcra_api_id is None or rcra_api_key is None:
            expected = False
        rcra_profile = rcra_profile_factory(rcra_api_id=rcra_api_id, rcra_api_key=rcra_api_key)
        # Act
        api_user = rcra_profile.has_api_credentials
        # Assert
        assert api_user is expected


@pytest.mark.django_db
class TestHaztrakProfileModel:
    def test_haztrak_profile_factory(self, haztrak_profile_factory):
        profile = haztrak_profile_factory()
        assert isinstance(profile, HaztrakProfile)
