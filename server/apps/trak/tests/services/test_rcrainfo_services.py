from datetime import datetime, timedelta, timezone

import pytest
import responses
from emanifest import RcrainfoClient

from apps.trak.services import RcrainfoService


class TestRcrainfoService:
    @pytest.fixture(autouse=True)
    def _setup(self, user_factory, rcra_profile_factory):
        self.testuser1 = user_factory()
        self.profile = rcra_profile_factory(user=self.testuser1)

    def test_class_inits(self):
        rcrainfo = RcrainfoService(api_username=self.testuser1.username, rcrainfo_env="preprod")
        assert isinstance(rcrainfo, RcrainfoService)
        rcrainfo_client = RcrainfoClient("preprod")
        assert rcrainfo.base_url == rcrainfo_client.base_url

    def test_auto_authorized(self):
        rcrainfo = RcrainfoService(api_username=self.testuser1.username)
        # retrieve_id() should get their API credentials from their RcraProfile
        testuser_id = rcrainfo.retrieve_id()
        assert testuser_id == self.profile.rcra_api_id

    @responses.activate
    def test_gets_credentials_correctly(self):
        """Test our overridden retrieve_id() and retrieve_key() function as expected"""
        rcrainfo = RcrainfoService(api_username=self.testuser1.username)
        auth_url = (
            f"{rcrainfo.base_url}/api/v1/auth/{self.profile.rcra_api_id}/"
            f"{self.profile.rcra_api_key}"
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
