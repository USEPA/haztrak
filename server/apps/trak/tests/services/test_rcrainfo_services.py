import http
from datetime import datetime, timedelta, timezone

import pytest
from emanifest import RcrainfoClient
from responses import matchers

from apps.trak.models import QuickerSign
from apps.trak.serializers import QuickerSignSerializer
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
        # retrieve_id() should get their API credentials from their EpaProfile
        testuser_id = rcrainfo.retrieve_id()
        assert testuser_id == self.profile.rcra_api_id

    def test_gets_credentials_correctly(self, mock_responses):
        """Test our overridden retrieve_id() and retrieve_key() function as expected"""
        rcrainfo = RcrainfoService(api_username=self.testuser1.username)
        auth_url = (
            f"{rcrainfo.base_url}/api/v1/auth/{self.profile.rcra_api_id}/"
            f"{self.profile.rcra_api_key}"
        )
        mock_token = "thisIsAMockToken"
        mock_token_exp = datetime.utcnow().replace(tzinfo=timezone.utc) + timedelta(minutes=20)

        # check RcrainfoService is retrieving a user's API ID and Key
        mock_responses.get(
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


class TestQuickerSign:
    """Test Suite for the RCRAInfo Quicker Sign feature"""

    mtn = ["123456789ELC", "987654321ELC"]
    printed_name = "David Graham"
    site_id = "VATESTGEN001"
    site_type = "Generator"
    sign_date = datetime.utcnow().replace(tzinfo=timezone.utc)

    @pytest.fixture(autouse=True)
    def _setup(self, user_factory, rcra_profile_factory, quicker_sign_response_factory):
        self.testuser1 = user_factory()
        self.profile = rcra_profile_factory(user=self.testuser1)
        self.rcrainfo = RcrainfoService(api_username=self.testuser1.username, auto_renew=False)
        self.quicker_sign_url = f"{self.rcrainfo.base_url}/api/v1/emanifest/manifest/quicker-sign"
        self.response_json = quicker_sign_response_factory(
            mtn=self.mtn, site_id=self.site_id, sign_date=self.sign_date
        )

    def test_maps_keywords(self, mock_responses):
        """
        Test that our sign_manifest method maps arguments to a JSON representation
        that's recognized by RCRAInfo
        """
        mock_responses.post(
            url=self.quicker_sign_url,
            # the JSON received by the endpoint should match this
            match=[
                matchers.json_params_matcher(
                    {
                        "printedSignatureName": self.printed_name,
                        "printedSignatureDate": self.sign_date.isoformat(timespec="milliseconds"),
                        "siteType": self.site_type,
                        "manifestTrackingNumbers": self.mtn,
                        "siteId": self.site_id,
                    }
                )
            ],
            status=200,
        )
        quicker_signature = QuickerSign(
            site_type=self.site_type,
            mtn=self.mtn,
            site_id=self.site_id,
            printed_name=self.printed_name,
            printed_date=self.sign_date,
        )
        signature_serializer = QuickerSignSerializer(quicker_signature)
        response = self.rcrainfo.sign_manifest(**signature_serializer.data)
        assert response.status_code == http.HTTPStatus.OK
