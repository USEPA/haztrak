from typing import Dict, List

import pytest
import pytest_mock
from emanifest import RcrainfoResponse
from rest_framework import status

from apps.core.services import RcrainfoService
from apps.sites.models import RcraSiteType
from apps.trak.models import QuickerSign
from apps.trak.serializers import QuickerSignSerializer
from apps.trak.services import ManifestService


class TestManifestService:
    @pytest.fixture(autouse=True)
    def _setup(self, user_factory, haztrak_site_factory, haztrak_json):
        self.user = user_factory()
        self.gen001 = haztrak_site_factory()
        self.json_100031134elc = haztrak_json.MANIFEST.value
        self.tracking_number = self.json_100031134elc.get("manifestTrackingNumber", "123456789ELC")

    @pytest.fixture
    def manifest_100033134elc_rcra_response(self, haztrak_json, mock_responses):
        rcrainfo = RcrainfoService(api_username="testuser1", rcrainfo_env="preprod")
        manifest_json = haztrak_json.MANIFEST.value
        mock_responses.get(
            url=f'{rcrainfo.base_url}v1/emanifest/manifest/{manifest_json.get("manifestTrackingNumber")}',
            content_type="application/json",
            json=manifest_json,
            status=status.HTTP_200_OK,
        )

    @pytest.fixture
    def search_site_mtn_rcra_response(self, haztrak_json, mock_responses):
        rcrainfo = RcrainfoService(api_username="testuser1", rcrainfo_env="preprod")
        mock_responses.post(
            url=f"{rcrainfo.base_url}v1/emanifest/search",
            content_type="application/json",
            json=[haztrak_json.MANIFEST.value.get("manifestTrackingNumber")],
            status=status.HTTP_200_OK,
        )

    def test_pull_manifests(
        self, manifest_100033134elc_rcra_response, mocker: pytest_mock.MockerFixture
    ):
        """Test retrieves a manifest from RCRAInfo"""
        # we are creating a real RcrainfoService object, setting the auto_renew to false so
        # it does not attempt to call the RCRAInfo auth endpoint, and faking the response (fixture)
        # ToDo: replace real RcrainfoService with mock class.
        rcrainfo = RcrainfoService(api_username=self.user.username, auto_renew=False)
        manifest_service = ManifestService(username=self.user.username, rcrainfo=rcrainfo)
        results = manifest_service.pull_manifests(tracking_numbers=[self.tracking_number])
        assert self.tracking_number in results["success"]

    def test_search_rcra_mtn(self, search_site_mtn_rcra_response):
        """Test retrieves a manifest from RCRAInfo"""
        rcrainfo = RcrainfoService(api_username=self.user.username, auto_renew=False)
        manifest_service = ManifestService(username=self.user.username, rcrainfo=rcrainfo)
        results = manifest_service.search_rcrainfo_mtn(site_id=self.gen001.rcra_site.epa_id)
        assert isinstance(results, list)
        assert self.json_100031134elc.get("manifestTrackingNumber") in results


class TestSignManifest:
    def test_filter_mtn_removed_mtn_not_associated_with_site(
        self, manifest_factory, rcra_site_factory, manifest_handler_factory
    ):
        # Arrange
        #  data user has access to
        my_site = rcra_site_factory()
        my_handler = manifest_handler_factory(rcra_site=my_site)
        my_manifest = manifest_factory(generator=my_handler)

        not_my_manifest = manifest_factory(mtn="123456555ELC")
        manifest_service = ManifestService(username="testuser1")
        filtered_manifest = manifest_service._filter_mtn(
            mtn=[my_manifest.mtn, not_my_manifest.mtn],
            site_id=my_handler.rcra_site.epa_id,
            site_type=my_handler.rcra_site.site_type,
        )
        assert my_manifest.mtn in filtered_manifest
        assert not_my_manifest.mtn not in filtered_manifest
