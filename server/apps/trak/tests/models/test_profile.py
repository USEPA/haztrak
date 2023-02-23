class TestRcraProfileModel:
    """Test related to the RcraProfile model and it's API"""

    def test_is_api_user_returns_false_one_empty(self, db, test_user_profile):
        test_user_profile.rcra_api_id = None
        test_user_profile.save()
        assert not test_user_profile.is_api_user

    def test_is_api_user_returns_false_all_empty(self, db, test_user_profile):
        test_user_profile.rcra_api_id = None
        test_user_profile.rcra_api_key = None
        test_user_profile.rcra_username = None
        test_user_profile.save()
        assert not test_user_profile.is_api_user

    def test_is_api_user_returns_true(self, db, test_user_profile):
        test_user_profile.rcra_api_id = "mock_api_id"
        test_user_profile.rcra_api_key = "mock_api_key"
        test_user_profile.rcra_username = "mock_rcra_username"
        test_user_profile.save()
        assert test_user_profile.is_api_user
