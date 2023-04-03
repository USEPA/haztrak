import pytest
from rest_framework import status
from rest_framework.response import Response
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate

from apps.sites.models import EpaSiteType
from apps.sites.views import EpaProfileView, EpaSiteSearchView


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
        assert response.status_code == status.HTTP_200_OK

    def test_returns_serialized_handler(self):
        response: Response = self.client.get(f"{self.url}/details/{self.generator.pk}")
        assert response.data["epaSiteId"] == self.generator.epa_id


class TestEpaSiteSearchView:
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
        """Use APIClient to ensure our HTTP response meets spec"""
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
        assert response.status_code == status.HTTP_200_OK


class TestEpaProfileView:
    """
    Tests the for the endpoints related to the user's EpaProfile
    """

    url = "/api/site/profile"
    id_field = "rcraAPIID"
    key_field = "rcraAPIKey"
    username_field = "rcraUsername"
    new_api_id = "updatedRcraAPIID"
    new_api_key = "updatedRcraAPIKey"
    new_username = "newRCRAInfoUsername"

    @pytest.fixture
    def user_and_client(self, epa_profile_factory, user_factory, api_client_factory):
        self.user = user_factory()
        self.client = api_client_factory(user=self.user)

    @pytest.fixture
    def epa_profile_request(self, user_and_client):
        factory = APIRequestFactory()
        request = factory.put(
            f"{self.url}/{self.user.username}",
            {
                self.id_field: self.new_api_id,
                self.username_field: self.new_username,
                self.key_field: self.new_api_key,
            },
            format="json",
        )
        force_authenticate(request, self.user)
        return request

    def test_returns_a_user_profile(self, user_and_client, epa_profile_factory):
        # Arrange
        epa_profile_factory(user=self.user)
        # Act
        response: Response = self.client.get(f"{self.url}/{self.user.username}")
        # Assert
        assert response.headers["Content-Type"] == "application/json"
        assert response.status_code == status.HTTP_200_OK
        assert response.data["user"] == self.user.username

    def test_profile_updates(self, epa_profile_factory, epa_profile_request):
        # Arrange
        epa_profile_factory(user=self.user)
        request = epa_profile_request
        # Act
        response = EpaProfileView.as_view()(request, user=self.user.username)
        assert response.status_code == status.HTTP_200_OK
        assert response.data[self.id_field] == self.new_api_id
        assert response.data[self.username_field] == self.new_username

    def test_update_does_not_return_api_key(self, epa_profile_factory, epa_profile_request):
        # Arrange
        epa_profile_factory(user=self.user)
        request = epa_profile_request
        # Act
        response = EpaProfileView.as_view()(request, user=self.user.username)
        # Assert
        assert self.key_field not in response.data
