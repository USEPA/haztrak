import pytest
import pytest_mock
from rest_framework import status

from core.services import RcraClient, get_rcra_client
from manifest.services import EManifest


class TestEManifestService:
    @pytest.fixture(autouse=True)
    def _setup(self, user_factory, site_factory, haztrak_json):
        self.user = user_factory()
        self.gen001 = site_factory()
        self.json_100031134elc = haztrak_json.MANIFEST.value
        self.tracking_number = self.json_100031134elc.get("manifestTrackingNumber", "123456789ELC")

    @pytest.fixture
    def manifest_100033134elc_rcra_response(self, haztrak_json, mock_responses):
        rcrainfo = get_rcra_client(api_id="my_mock_id", api_key="my_mock_key")
        manifest_json = haztrak_json.MANIFEST.value
        mock_responses.get(
            url=f"{rcrainfo.base_url}v1/emanifest/manifest/{manifest_json.get('manifestTrackingNumber')}",
            content_type="application/json",
            json=manifest_json,
            status=status.HTTP_200_OK,
        )

    def test_pull_manifests(
        self,
        manifest_100033134elc_rcra_response,
        mocker: pytest_mock.MockerFixture,
    ):
        """Test retrieves a manifest from RCRAInfo."""
        rcrainfo = RcraClient(auto_renew=False)
        emanifest = EManifest(username=self.user.username, rcrainfo=rcrainfo)
        results = emanifest.pull(tracking_numbers=[self.tracking_number])
        assert self.tracking_number in results["success"]
