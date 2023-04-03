import json

import pytest
from rest_framework.response import Response
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate

from apps.sites.models import EpaSiteType
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
    def generator(self, epa_site_factory):
        return epa_site_factory()

    @pytest.fixture
    def user(self, user_factory):
        return user_factory()

    def test_view_returns_array_of_handlers(self, user, generator):
        # Arrange
        factory = APIRequestFactory()
        request = factory.get(
            self.ulr,
            {  # The expected parameters & args
                "epaId": generator.epa_id,
                "name": "",
                "siteType": generator.site_type,
            },
        )
        force_authenticate(request, user)
        # Act
        response = EpaSiteSearchView.as_view()(request)
        # Assert
        assert len(response.data) > 0
        for handler_data in response.data:
            assert isinstance(handler_data, dict)
            assert generator.epa_id in handler_data.values()

    def test_view_filters_by_handler_type(self, user, epa_site_factory):
        # Arrange
        # We have two epa sites with epa_id similar in first three characters
        common_prefix = "VAT"
        epa_site_factory(epa_id=f"{common_prefix}00000GEN1", site_type=EpaSiteType.GENERATOR)
        epa_site_factory(epa_id=f"{common_prefix}00000GEN2", site_type=EpaSiteType.GENERATOR)
        epa_site_factory(epa_id=f"{common_prefix}00000TSD1", site_type=EpaSiteType.TSDF)
        factory = APIRequestFactory()
        request = factory.get(
            self.ulr,
            {
                "epaId": common_prefix,
                "name": "",
                "siteType": EpaSiteType.TSDF,
            },
        )
        force_authenticate(request, user)
        # Act
        response = EpaSiteSearchView.as_view()(request)
        # Assert
        for handler_data in response.data:
            # ToDo: serialize based on display name
            # assert handler_data["siteType"] == EpaSiteType.TSDF.name
            assert handler_data["siteType"] == EpaSiteType.TSDF

    def test_endpoint_returns_json_formatted_data(self, user, generator) -> None:
        # Arrange
        client = APIClient()
        client.force_authenticate(user=user)
        # Act
        response = client.get(
            self.ulr,
            {
                "epaId": generator.epa_id,
                "name": "",
                "type": generator.site_type,
            },
        )
        # Assert
        assert response.headers["Content-Type"] == "application/json"
        assert response.status_code == 200


class TestEpaProfileEndpoint:
    """
    Tests the for the endpoints related to the user's EpaProfile
    """

    url = "/api/site/profile"

    @pytest.fixture()
    def user_and_client(self, epa_profile_factory, user_factory, api_client_factory):
        self.user = user_factory()
        self.client = api_client_factory(user=self.user)

    def test_returns_a_user_profile(self, user_and_client, epa_profile_factory):
        # Arrange
        epa_profile_factory(user=self.user)
        # Act
        response: Response = self.client.get(f"{self.url}/{self.user.username}")
        # Assert
        assert response.headers["Content-Type"] == "application/json"
        assert response.status_code == 200
        assert response.data["user"] == self.user.username

    def test_put_updates_profile(self, user_and_client, epa_profile_factory):
        # Arrange
        epa_profile_factory(user=self.user)
        id_json_key = "rcraAPIID"
        username_json_key = "rcraUsername"
        new_api_id = "updatedRcraAPIID"
        new_username = "newRCRAInfoUsername"
        put_data = json.dumps({id_json_key: new_api_id, username_json_key: new_username})
        # Act
        response: Response = self.client.put(
            f"{self.url}/{self.user.username}", data=put_data, content_type="application/json"
        )
        # Assert
        assert response.status_code == 200
        assert response.data[id_json_key] == new_api_id
        assert response.data[username_json_key] == new_username
