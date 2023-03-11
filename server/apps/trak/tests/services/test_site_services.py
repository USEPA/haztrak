import pytest


class TestSiteService:
    @pytest.fixture(autouse=True)
    def _setup_user(self, user_factory):
        self.user = user_factory()

    @pytest.fixture(autouse=True)
    def _setup_generator(self, handler_factory):
        self.gen001 = handler_factory()

    @pytest.fixture(autouse=True)
    def _manifest(self, haztrak_json):
        self.manifest_json = haztrak_json.MANIFEST.value
        self.tracking_number = self.manifest_json.get("manifestTrackingNumber", "123456789ELC")

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
