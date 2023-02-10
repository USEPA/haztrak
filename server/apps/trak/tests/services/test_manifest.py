import pytest
import responses

from apps.trak.services import RcrainfoService
from apps.trak.services.manifest import ManifestService


class TestManifestService:

    @pytest.fixture(autouse=True)
    def _test_user(self, testuser1):
        self.user = testuser1

    @pytest.fixture(autouse=True)
    def _manifest(self, manifest_json):
        self.manifest_json = manifest_json
        self.tracking_number = manifest_json.get('manifestTrackingNumber',
                                                 '123456789ELC')

    @responses.activate
    def test_gets_pull_manifests(self):
        """Test our overridden retrieve_id() and retrieve_key() function as expected"""
        rcrainfo = RcrainfoService(username=self.user.username, auto_renew=False)
        manifest_service = ManifestService(username=self.user.username,
                                           rcrainfo=rcrainfo)
        manifest_url = f'{rcrainfo.base_url}/api/v1/emanifest/manifest/{self.tracking_number}'

        with responses.RequestsMock() as mock:
            mock.get(manifest_url,
                     json=self.manifest_json,
                     status=200)
            results = manifest_service.pull_manifests(
                tracking_numbers=[self.tracking_number])
        assert self.tracking_number in results['success']
