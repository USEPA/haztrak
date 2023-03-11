import pytest


class TestRcraProfileModel:
    """Test related to the RcraProfile model and its API"""

    @pytest.fixture(autouse=True)
    def _profile(self, rcra_profile_factory):
        self.profile = rcra_profile_factory()

    def test_is_api_user_returns_false_one_empty(self, db):
        self.profile.rcra_api_id = None
        self.profile.save()
        assert not self.profile.is_api_user

    def test_is_api_user_false_when_empty(self, db):
        self.profile.rcra_api_id = None
        self.profile.rcra_api_key = None
        self.profile.rcra_username = None
        self.profile.save()
        assert not self.profile.is_api_user

    def test_is_api_user_returns_true(self, db):
        self.profile.rcra_api_id = "mock_api_id"
        self.profile.rcra_api_key = "mock_api_key"
        self.profile.rcra_username = "mock_rcra_username"
        self.profile.save()
        assert self.profile.is_api_user
