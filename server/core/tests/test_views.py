from http import HTTPStatus
from unittest import mock

import pytest
from core.views import TaskStatusView
from django.test.client import Client
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
        response = c.get(reverse("core:current_user"))
        data: dict = response.json()
        assert response.status_code == 200
        assert user.username in data.values()
        assert user.first_name in data.values()


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
            assert response.status_code == HTTPStatus.OK
            assert "PENDING" in response.data.values()
