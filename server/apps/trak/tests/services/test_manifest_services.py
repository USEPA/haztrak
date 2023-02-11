import pytest

from apps.trak.services import ManifestService, RcrainfoService


class TestManifestService:

    @pytest.fixture(autouse=True)
    def _test_user(self, testuser1):
        self.user = testuser1

    @pytest.fixture(autouse=True)
    def _manifest(self, json_100031134elc):
        self.manifest_json = json_100031134elc
        self.tracking_number = json_100031134elc.get('manifestTrackingNumber',
                                                     '123456789ELC')

    def test_pull_manifests(self, manifest_100033134elc_response):
        """Test retrieves a manifest from RCRAInfo"""
        rcrainfo = RcrainfoService(api_username=self.user.username, auto_renew=False)
        manifest_service = ManifestService(username=self.user.username,
                                           rcrainfo=rcrainfo)
        results = manifest_service.pull_manifests(
            tracking_numbers=[self.tracking_number])
        assert self.tracking_number in results['success']
