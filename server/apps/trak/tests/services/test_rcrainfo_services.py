from datetime import datetime, timedelta, timezone

import responses
from emanifest import RcrainfoClient

from apps.trak.services import RcrainfoService


class TestRcrainfoService:
    def test_class_inits(self, testuser1):
        rcrainfo = RcrainfoService(api_username=testuser1.username, rcrainfo_env="preprod")
        assert isinstance(rcrainfo, RcrainfoService)
        rcrainfo_client = RcrainfoClient("preprod")
        assert rcrainfo.base_url == rcrainfo_client.base_url

    def test_auto_authorized(self, test_user_profile, testuser1):
        rcrainfo = RcrainfoService(api_username=testuser1.username)
        # retrieve_id() should get their API credentials from their RcraProfile
        testuser_id = rcrainfo.retrieve_id()
        assert testuser_id == test_user_profile.rcra_api_id

    @responses.activate
    def test_gets_credentials_correctly(self, testuser1, test_user_profile):
        """Test our overridden retrieve_id() and retrieve_key() function as expected"""
        rcrainfo = RcrainfoService(api_username=testuser1.username)
        auth_url = (
            f"{rcrainfo.base_url}api/v1/auth/{test_user_profile.rcra_api_id}/"
            f"{test_user_profile.rcra_api_key}"
        )
        mock_token = "thisIsAMockToken"
        mock_token_exp = datetime.utcnow().replace(tzinfo=timezone.utc) + timedelta(minutes=20)

        # check RcrainfoService is retrieving a user's API ID and Key
        with responses.RequestsMock() as mock:
            mock.add(
                responses.GET,
                auth_url,
                json={
                    "token": mock_token,
                    "expiration": mock_token_exp.strftime(rcrainfo.expiration_format),
                },
                status=200,
            )
            # Make the request
            rcrainfo.authenticate()
            # user's API credentials retrieved before making the http requests
            assert rcrainfo.is_authenticated
            assert rcrainfo.token == mock_token
