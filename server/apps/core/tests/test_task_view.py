import pytest
from django.core.cache import cache
from django_celery_results.models import TaskResult
from rest_framework import status
from rest_framework.response import Response
from rest_framework.test import APIRequestFactory, force_authenticate

from apps.core.views import TaskStatusView


class TestTaskStatusView:
    """Tests the for the TaskStatusView"""

    mock_task_id = "test_task_id"
    mock_task_name = "test_task_name"
    base_url = f"/api/task{mock_task_id}"

    @pytest.fixture
    def factory(self):
        return APIRequestFactory()

    @pytest.fixture
    def user(self, user_factory):
        return user_factory()

    def test_returns_cached_status_if_exists(self, factory, user):
        # Arrange
        task_status = "PENDING"
        cache.set(
            self.mock_task_id,
            {
                "status": task_status,
                "taskId": f"{self.mock_task_id}",
                "taskName": self.mock_task_name,
            },
        )
        request = factory.get(f"{self.base_url}")
        force_authenticate(request, user)
        # Act
        response: Response = TaskStatusView.as_view()(request, task_id=self.mock_task_id)
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert response.data["taskId"] == self.mock_task_id
        assert response.data["status"] == task_status

    def test_returns_404_if_no_cache_or_db_results(self, factory, user, cache_factory):
        # Arrange
        cache_factory("test_returns_404")
        cache.set(self.mock_task_id, None)
        request = factory.get(f"{self.base_url}")
        force_authenticate(request, user)
        # Act
        response: Response = TaskStatusView.as_view()(request, task_id=self.mock_task_id)
        # Assert
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_returns_db_results(self, factory, user, cache_factory):
        # Arrange
        cache_factory("test_returns_db")
        TaskResult.objects.create(
            task_id=self.mock_task_id,
            task_name=self.mock_task_name,
            status="SUCCESS",
            result={"foo": "bar"},
        )
        request = factory.get(f"{self.base_url}")
        force_authenticate(request, user)
        # Act
        response: Response = TaskStatusView.as_view()(request, task_id=self.mock_task_id)
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert response.data["taskId"] == self.mock_task_id
