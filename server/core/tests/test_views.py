from unittest import mock

import pytest
from core.views import LaunchExampleTaskView, TaskStatusView
from django.test.client import Client
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APIRequestFactory, force_authenticate


class TestUserViews:
    @pytest.fixture
    def factory(self):
        return APIRequestFactory()

    @pytest.fixture
    def user(self, user_factory):
        return user_factory()

    def test_returns_user_details(self, factory, user):
        c = Client()
        c.force_login(user)
        response = c.get(reverse("rest_user_details"))
        data: dict = response.json()
        assert response.status_code == 200
        assert user.username in data.values()
        assert user.first_name in data.values()


class TestLaunchExampleTaskView:
    @pytest.fixture
    def factory(self):
        return APIRequestFactory()

    def test_successful_launch(self, factory):
        with mock.patch("core.views.launch_example_task") as mock_task:
            request = factory.get(reverse("core:task:example"))
            mock_task.return_value = "123"
            response = LaunchExampleTaskView.as_view()(request)
            assert response.status_code == status.HTTP_200_OK
            assert response.data == {"taskId": "123"}


class TestTaskStatusView:
    @pytest.fixture
    def factory(self):
        return APIRequestFactory()

    def test_successful_get_status(self, factory, user_factory):
        user = user_factory()
        task_id = "123"
        request = factory.get(reverse("core:task:status", args=[task_id]))
        force_authenticate(request, user)
        with mock.patch("core.views.get_task_status") as mock_task:
            mock_task.return_value = {
                "status": "PENDING",
                "name": "task_name",
                "result": None,
                "taskId": task_id,
            }
            response = TaskStatusView.as_view()(request, task_id=task_id)
            assert response.status_code == status.HTTP_200_OK
            assert "PENDING" in response.data.values()
