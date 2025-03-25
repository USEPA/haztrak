from unittest.mock import patch

import pytest
from celery.result import AsyncResult
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APIRequestFactory, force_authenticate

from manifest.views import ElectronicManifestSignView, ManifestViewSet, MtnListView


class TestManifestCRUD:
    """Tests the for the Manifest views."""

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
        request = factory.get(reverse("manifest:manifest-detail", args=[manifest.mtn]))
        force_authenticate(request, user)
        # Act
        response = ManifestViewSet.as_view({"get": "retrieve"})(request, mtn=manifest.mtn)
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert manifest.mtn in response.data.values()


class TestSignManifestVIew:
    """Quicker Sign endpoint test suite."""

    factory = APIRequestFactory()
    mtn = ["123456789ELC", "987654321ELC"]

    @pytest.fixture(autouse=True)
    def _user(self, user_factory):
        self.user = user_factory()

    @pytest.fixture(autouse=True)
    def _patch_task(self, mocker):
        mock_task = mocker.patch("manifest.tasks.sign_manifest.delay")
        self.mock_task_id = "mock_task_id"
        mock_task.return_value = AsyncResult(self.mock_task_id)

    def test_returns_celery_task_id(
        self,
        user_factory,
        profile_factory,
        org_factory,
        perm_factory,
    ):
        user = user_factory()
        org = org_factory()
        profile_factory(user=user)
        perm_factory(user, ["org.view_org"], org)
        request = self.factory.post(
            reverse("manifest:emanifest:sign"),
            data={
                "manifestTrackingNumbers": self.mtn,
                "printedSignatureName": "John Doe",
                "siteType": "Generator",
                "siteId": "VATESTGEN001",
            },
            format="json",
        )
        force_authenticate(request, user)
        response = ElectronicManifestSignView.as_view()(request)
        assert response.data["taskId"] == self.mock_task_id


class TestMtnListView:
    @pytest.fixture
    def factory(self):
        return APIRequestFactory()

    @pytest.fixture
    def user(self, user_factory):
        return user_factory()

    def test_returns_empty_list_if_no_manifests(self, factory, user):
        with patch("manifest.views.get_manifests") as mock_get_manifests:
            mock_get_manifests.return_value = []
            request = factory.get(reverse("manifest:mtn:list"))
            force_authenticate(request, user)
            response = MtnListView.as_view()(request)
            assert isinstance(response.data, list)

    def test_401_if_not_authorized(self, factory, user):
        with patch("manifest.views.get_manifests") as mock_get_manifests:
            mock_get_manifests.return_value = []
            request = factory.get(reverse("manifest:mtn:list"))
            response = MtnListView.as_view()(request)
            assert response.status_code == status.HTTP_401_UNAUTHORIZED
