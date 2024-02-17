from datetime import UTC, datetime

import emanifest
from responses import matchers
from rest_framework import status

from apps.core.services import RcrainfoService, get_rcrainfo_client
from apps.handler.models import QuickerSign
from apps.handler.serializers import QuickerSignSerializer


class TestRcrainfoService:
    """Tests the for the RcrainfoService class"""

    def test_inits_to_correct_environment(self):
        rcrainfo = RcrainfoService(rcrainfo_env="preprod")
        assert rcrainfo.rcrainfo_env == "preprod"

    def test_inits_base_url_by_env(self):
        rcrainfo_preprod = RcrainfoService(rcrainfo_env="preprod")
        assert rcrainfo_preprod.base_url == emanifest.RCRAINFO_PREPROD
        rcrainfo_prod = RcrainfoService(rcrainfo_env="prod")
        assert rcrainfo_prod.base_url == emanifest.RCRAINFO_PROD

    def test_uses_provided_rcra_profile_credentials(self, rcrainfo_profile_factory):
        admin_rcrainfo_profile = rcrainfo_profile_factory()
        rcrainfo = RcrainfoService(rcra_profile=admin_rcrainfo_profile, auto_renew=True)
        assert rcrainfo.retrieve_key() == admin_rcrainfo_profile.rcra_api_key
        assert rcrainfo.retrieve_id() == admin_rcrainfo_profile.rcra_api_id

    def test_constructor_retrieves_org_api_credentials(
        self,
        rcrainfo_profile_factory,
        user_factory,
        org_factory,
        profile_factory,
        org_access_factory,
    ):
        # Arrange
        # Set up org with RCRAInfo API credentials
        mock_api_id = "my_mock_id"
        mock_api_key = "my_mock_key"
        admin = user_factory(username="admin")
        my_org = org_factory(admin=admin)
        admin_rcrainfo_profile = rcrainfo_profile_factory(
            rcra_api_id=mock_api_id,
            rcra_api_key=mock_api_key,
        )
        profile_factory(user=admin, rcrainfo_profile=admin_rcrainfo_profile)
        # Set up user within org
        my_user = user_factory(username="testuser1")
        org_access_factory(user=my_user, org=my_org)
        profile_factory(user=my_user)
        # Act
        rcrainfo: RcrainfoService = get_rcrainfo_client(username=my_user.username)
        # Assert
        assert rcrainfo.has_rcrainfo_credentials

    def test_constructor_uses_provided_api_credentials(
        self, rcrainfo_profile_factory, user_factory, org_factory, profile_factory
    ):
        # Arrange
        mock_api_id = "my_mock_id"
        mock_api_key = "my_mock_key"
        # Act
        rcrainfo: RcrainfoService = get_rcrainfo_client(api_id=mock_api_id, api_key=mock_api_key)
        # Assert
        assert rcrainfo.has_rcrainfo_credentials
        assert rcrainfo.api_id == mock_api_id
        assert rcrainfo.api_key == mock_api_key


class TestQuickerSign:
    """Test Suite for the RCRAInfo Quicker Sign feature"""

    mtn = ["123456789ELC", "987654321ELC"]
    printed_name = "David Graham"
    site_id = "VATESTGEN001"
    site_type = "Generator"
    sign_date = datetime.now(UTC)

    def test_maps_keywords(
        self,
        mock_responses,
        user_factory,
        rcrainfo_profile_factory,
        profile_factory,
        quicker_sign_response_factory,
    ):
        """
        Test that our sign_manifest method maps arguments to a JSON representation
        that's recognized by RCRAInfo
        """
        testuser1 = user_factory()
        rcra_profile = rcrainfo_profile_factory()
        profile_factory(user=testuser1, rcrainfo_profile=rcra_profile)
        rcrainfo = RcrainfoService(auto_renew=False)
        quicker_sign_response_factory(mtn=self.mtn, site_id=self.site_id, sign_date=self.sign_date)
        quicker_sign_url = f"{rcrainfo.base_url}v1/emanifest/manifest/quicker-sign"
        mock_responses.post(
            url=quicker_sign_url,
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
            site_type="Generator",
            mtn=self.mtn,
            site_id=self.site_id,
            printed_name=self.printed_name,
            printed_date=self.sign_date,
        )
        signature_serializer = QuickerSignSerializer(quicker_signature)
        response = rcrainfo.sign_manifest(**signature_serializer.data)
        assert response.status_code == status.HTTP_200_OK
