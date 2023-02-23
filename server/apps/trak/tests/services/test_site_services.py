import pytest


class TestSiteService:
    @pytest.fixture(autouse=True)
    def _test_user(self, testuser1):
        self.user = testuser1

    @pytest.fixture(autouse=True)
    def _site_gen001(self, site_generator001):
        self.site_gen001 = site_generator001

    @pytest.fixture(autouse=True)
    def _gen001(self, generator001):
        self.gen001 = generator001

    @pytest.fixture(autouse=True)
    def _manifest(self, json_100031134elc):
        self.manifest_json = json_100031134elc
        self.tracking_number = json_100031134elc.get("manifestTrackingNumber", "123456789ELC")

    def test_create_or_update_creates_new_site(self):
        """Test create_or_update_site creates a new site when non-existent"""
        # ToDo
        assert True

    def test_create_or_update_updates_existing_site(self):
        """Test create_or_update_site updates a site if it exist"""
        # ToDo
        assert True

    def test_sync_manifests_requests_rcrainfo_manifests(self):
        """Test sync_rcra_manifests"""
        # ToDo, will need to mock API responses (responses library)
        assert True
