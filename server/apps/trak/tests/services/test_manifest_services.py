import pytest

from apps.trak.services import ManifestService, RcrainfoService


class TestManifestService:
    @pytest.fixture(autouse=True)
    def _setup(self, user_factory, site_factory, haztrak_json):
        self.user = user_factory()
        self.gen001 = site_factory()
        self.json_100031134elc = haztrak_json.MANIFEST.value
        self.tracking_number = self.json_100031134elc.get("manifestTrackingNumber", "123456789ELC")

    def test_pull_manifests(self, manifest_100033134elc_rcra_response):
        """Test retrieves a manifest from RCRAInfo"""
        rcrainfo = RcrainfoService(api_username=self.user.username, auto_renew=False)
        manifest_service = ManifestService(username=self.user.username, rcrainfo=rcrainfo)
        results = manifest_service.pull_manifests(tracking_numbers=[self.tracking_number])
        assert self.tracking_number in results["success"]

    def test_search_rcra_mtn(self, search_site_mtn_rcra_response):
        """Test retrieves a manifest from RCRAInfo"""
        rcrainfo = RcrainfoService(api_username=self.user.username, auto_renew=False)
        manifest_service = ManifestService(username=self.user.username, rcrainfo=rcrainfo)
        results = manifest_service.search_rcra_mtn(site_id=self.gen001.epa_site.epa_id)
        assert isinstance(results, list)
        assert self.json_100031134elc.get("manifestTrackingNumber") in results
