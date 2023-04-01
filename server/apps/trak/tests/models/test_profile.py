import pytest

from apps.trak.models import RcraProfile


@pytest.mark.django_db
class TestRcraProfileModel:
    """Test related to the RcraProfile model and its API"""

    @pytest.fixture(autouse=True)
    def _setup_profile(self, rcra_profile_factory):
        self.profile = rcra_profile_factory()

    def test_rcra_profile_saves(self):
        assert isinstance(self.profile, RcraProfile)

    def test_is_api_user_returns_true(self):
        assert self.profile.is_api_user

    def test_is_api_user_returns_false_one_empty(self, rcra_profile_factory, user_factory):
        profile = rcra_profile_factory(rcra_api_id=None, user=user_factory(username="foobar"))
        assert not profile.is_api_user

    def test_is_api_user_false_when_empty(self, rcra_profile_factory, user_factory):
        profile = rcra_profile_factory(
            user=user_factory(username="barfoo"),
            rcra_api_id=None,
            rcra_api_key=None,
            rcra_username=None,
        )
        assert not profile.is_api_user
