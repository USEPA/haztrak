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

    URL = "/api/site/handler"

    @pytest.fixture
    def client(self, epa_site_factory, api_client_factory):
        return api_client_factory()

    @pytest.fixture
    def generator(self, epa_site_factory, api_client_factory):
        return epa_site_factory()

    def test_endpoint_returns_json_with_epa_site(self, client, generator):
        response: Response = client.get(f"{self.URL}/details/{generator.pk}")
        assert response.headers["Content-Type"] == "application/json"
        assert response.status_code == status.HTTP_200_OK

    def test_returns_serialized_handler(self, client, generator):
        response: Response = client.get(f"{self.URL}/details/{generator.pk}")
        assert response.data["epaSiteId"] == generator.epa_id


class TestEpaSiteSearchView:
    """
    Tests for the EpaSite Search endpoint
    """

    URL = "/api/site/handler/search"

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
            self.URL,
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
            self.URL,
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
            self.URL,
            {
                "epaId": generator.epa_id,
                "name": "",
                "type": generator.site_type,
            },
        )
        # Assert
        assert response.headers["Content-Type"] == "application/json"
        assert response.status_code == status.HTTP_200_OK
