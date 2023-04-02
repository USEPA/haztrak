import json

import pytest
from rest_framework.response import Response
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate

from apps.sites.views import EpaSiteSearchView


class TestEpaSiteView:
    """
    Tests the for the endpoints related to the handlers
    """

    url = "/api/site/handler"

    @pytest.fixture(autouse=True)
    def _setup(self, epa_site_factory, api_client_factory):
        self.client = api_client_factory()
        self.generator = epa_site_factory()

    def test_endpoint_headers(self):
        response: Response = self.client.get(f"{self.url}/details/{self.generator.pk}")
        assert response.headers["Content-Type"] == "application/json"
        assert response.status_code == 200

    def test_returns_serialized_handler(self):
        response: Response = self.client.get(f"{self.url}/details/{self.generator.pk}")
        assert response.data["epaSiteId"] == self.generator.epa_id


class TestHandlerSearch:
    """
    Tests for the EpaSite Search endpoint
    """

    ulr = "/api/site/handler/search"

    @pytest.fixture(autouse=True)
    def _setup_handler(self, epa_site_factory):
        self.generator = epa_site_factory()

    @pytest.fixture(autouse=True)
    def _setup_user(self, user_factory):
        self.user = user_factory()

    def test_returns_array_of_handlers(self):
        # Arrange
        factory = APIRequestFactory()
        request = factory.get(
            self.ulr,
            {
                "epaId": self.generator.epa_id,
                "name": "",
                "type": self.generator.site_type,
            },
        )
        force_authenticate(request, self.user)

        # Act
        response = EpaSiteSearchView.as_view()(request)

        # Assert
        assert len(response.data) > 0
        for i in response.data:
            assert isinstance(i, dict)

    def test_endpoint_headers(self) -> None:
        # Arrange
        client = APIClient()
        client.force_authenticate(user=self.user)
        # Act
        response = client.get(
            self.ulr,
            {
                "epaId": self.generator.epa_id,
                "name": "",
                "type": self.generator.site_type,
            },
        )
        # Assert
        assert response.headers["Content-Type"] == "application/json"
        assert response.status_code == 200


class TestRcraProfileEndpoint:
    """
    Tests the for the endpoints related to the user's EpaProfile
    """

    url = "/api/site/profile"

    @pytest.fixture(autouse=True)
    def _setup(self, epa_profile_factory, user_factory, api_client_factory):
        self.user = user_factory()
        self.client = api_client_factory(user=self.user)
        self.client.force_authenticate(user=self.user)
        self.profile = epa_profile_factory(user=self.user)

    def test_returns_user_profile(self):
        response: Response = self.client.get(f"{self.url}/{self.user.username}")
        assert response.headers["Content-Type"] == "application/json"
        assert response.status_code == 200
        assert response.data["user"] == self.user.username

    def test_put_updates_profile(self):
        new_api_id = "updatedRcraAPIID"
        new_username = "newRCRAInfoUsername"
        put_data = json.dumps({"rcraAPIID": new_api_id, "rcraUsername": new_username})
        response: Response = self.client.put(
            f"{self.url}/{self.user.username}", data=put_data, content_type="application/json"
        )
        assert response.status_code == 200
        assert response.data["rcraAPIID"] == new_api_id
        assert response.data["rcraUsername"] == new_username
