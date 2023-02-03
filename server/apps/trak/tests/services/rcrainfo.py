import responses
from emanifest import RcrainfoClient

from apps.trak.services.rcrainfo import RcrainfoService


class TestRcrainfoService:

    def test_class_inits(self, testuser1):
        rcrainfo = RcrainfoService('preprod', testuser1.username)
        assert isinstance(rcrainfo, RcrainfoService)
        rcrainfo_client = RcrainfoClient('preprod')
        assert rcrainfo.base_url == rcrainfo_client.base_url

    def test_auto_authorized(self, test_user_profile, testuser1):
        rcrainfo = RcrainfoService('preprod', testuser1.username)
        # retrieve_id() should get their API credentials from their RcraProfile
        testuser_id = rcrainfo.retrieve_id()
        assert testuser_id == test_user_profile.rcra_api_id

    @responses.activate
    def test_gets_credentials_correctly(self, testuser1, test_user_profile):
        """Test our overridden retrieve_id() and retrieve_key() function as expected"""
        rcrainfo = RcrainfoService('preprod', testuser1.username)
        base_url = rcrainfo.base_url
        auth_url = f'{base_url}api/v1/auth/{test_user_profile.rcra_api_id}/{test_user_profile.rcra_api_key}'
        mock_token = "thisIsAMockToken"

        # use mock response to check RcrainfoService is retrieving a user's API ID and Key
        with responses.RequestsMock() as mock:
            mock.add(responses.GET, auth_url,
                     json={
                         "token": mock_token,
                         "expiration": "2023-02-03T21:35:39.553+00:00"
                     },
                     status=200)
            # Make the request
            rcrainfo.authenticate()
            # RcrainfoService retrieved the user's API credentials before making the http requests
            assert rcrainfo.is_authenticated
            assert rcrainfo.token == mock_token
