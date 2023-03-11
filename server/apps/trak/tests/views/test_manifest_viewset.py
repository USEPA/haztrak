import pytest
from rest_framework.response import Response
from rest_framework.test import APIRequestFactory, force_authenticate

from apps.trak.views import ManifestView


class TestManifestCRUD:
    """Tests the for the Manifest ModelViewSet"""

    base_url = "/api/trak/manifest"
    factory = APIRequestFactory()

    @pytest.fixture(autouse=True)
    def _user(self, user_factory):
        self.user = user_factory()

    @pytest.fixture(autouse=True)
    def _manifest_elc(self, manifest_factory):
        self.manifest = manifest_factory()

    @pytest.fixture(autouse=True)
    def _manifest_json(self, haztrak_json):
        self.manifest_json = haztrak_json.MANIFEST.value

    def test_get_manifest(self):
        request = self.factory.get(f"{self.base_url}/{self.manifest.mtn}")
        force_authenticate(request, self.user)
        response: Response = ManifestView.as_view({"get": "retrieve"})(
            request, mtn=self.manifest.mtn
        )
        assert response.status_code == 200
        assert response.data["manifestTrackingNumber"] == self.manifest.mtn

    def test_create_manifest(self):
        request = self.factory.post(f"{self.base_url}", self.manifest_json, format="json")
        force_authenticate(request, self.user)
        response: Response = ManifestView.as_view({"post": "create"})(request)
        assert response.status_code == 201
        assert response.data["manifestTrackingNumber"] == self.manifest_json.get(
            "manifestTrackingNumber"
        )
