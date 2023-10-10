import pytest
from celery.result import AsyncResult
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate

from apps.trak.views import ManifestView, SignManifestView


class TestManifestCRUD:
    """Tests the for the Manifest ModelViewSet"""

    base_url = "/api/rcra/manifest"

    @pytest.fixture
    def factory(self):
        return APIRequestFactory()

    @pytest.fixture
    def user(self, user_factory):
        return user_factory()

    @pytest.fixture
    def manifest_json(self, haztrak_json):
        return haztrak_json.MANIFEST.value

    @pytest.fixture
    def manifest(self, manifest_factory):
        return manifest_factory()

    def test_returns_manifest_by_mtn(self, factory, manifest, manifest_json, user):
        # Arrange
        request = factory.get(f"{self.base_url}/{manifest.mtn}")
        force_authenticate(request, user)
        # Act
        response = ManifestView.as_view()(request, mtn=manifest.mtn)
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert response.data["manifestTrackingNumber"] == manifest.mtn


class TestSignManifestVIew:
    """Quicker Sign endpoint test suite"""

    base_url = "/api/manifest/sign"
    factory = APIRequestFactory()
    mtn = ["123456789ELC", "987654321ELC"]

    @pytest.fixture(autouse=True)
    def _user(self, user_factory):
        self.user = user_factory()

    @pytest.fixture(autouse=True)
    def _patch_task(self, mocker):
        mock_task = mocker.patch("apps.trak.tasks.sign_manifest.delay")
        self.mock_task_id = "mock_task_id"
        mock_task.return_value = AsyncResult(self.mock_task_id)

    def test_returns_celery_task_id(self):
        request = self.factory.post(
            f"{self.base_url}",
            data={
                "manifestTrackingNumbers": self.mtn,
                "printedSignatureName": "Joe Blow",
                "siteType": "Generator",
                "siteId": "VATESTGEN001",
            },
            format="json",
        )
        force_authenticate(request, self.user)
        response = SignManifestView.as_view()(request)
        assert response.data["task"] == self.mock_task_id
