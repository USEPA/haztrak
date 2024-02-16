import pytest
from rest_framework import status
from rest_framework.response import Response
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate

from apps.rcrasite.models import RcraSiteType  # type: ignore
from apps.rcrasite.views import SearchRcraSiteView  # type: ignore


class TestEpaSiteView:
    """Handler endpoints test suite"""

    URL = "/api/rcra/handler"

    @pytest.fixture
    def client(self, api_client_factory):
        return api_client_factory()

    @pytest.fixture
    def generator(self, rcra_site_factory):
        return rcra_site_factory()

    def test_endpoint_returns_json_with_rcra_site(self, client, generator):
        response: Response = client.get(f"{self.URL}/{generator.epa_id}")
        assert response.headers["Content-Type"] == "application/json"
        assert response.status_code == status.HTTP_200_OK
        assert response.data["epaSiteId"] == generator.epa_id


class TestRcraSiteSearchView:
    """
    Tests for the RcraSite Search endpoint
    """

    URL = "/api/rcra/site/search"

    def test_view_returns_array_of_handlers(self, user_factory, rcra_site_factory):
        # Arrange
        factory = APIRequestFactory()
        generator = rcra_site_factory(site_type=RcraSiteType.GENERATOR)
        user = user_factory()
        request = factory.get(
            self.URL,
            {  # The expected parameters & args
                "epaId": generator.epa_id,
                "siteName": "",
                "siteType": "Generator",
            },
        )
        force_authenticate(request, user)
        # Act
        response = SearchRcraSiteView.as_view()(request)
        # Assert
        assert len(response.data) > 0
        for handler_data in response.data:
            assert isinstance(handler_data, dict)
            assert generator.epa_id in handler_data.values()

    def test_view_filters_by_handler_type(self, user_factory, rcra_site_factory):
        # Arrange
        # We have two epa sites with epa_id similar in first three characters
        user = user_factory()
        common_prefix = "VAT"
        rcra_site_factory(epa_id=f"{common_prefix}00000GEN1", site_type=RcraSiteType.GENERATOR)
        rcra_site_factory(epa_id=f"{common_prefix}00000GEN2", site_type=RcraSiteType.GENERATOR)
        rcra_site_factory(epa_id=f"{common_prefix}00000TSD1", site_type=RcraSiteType.TSDF)
        rcra_site_factory(epa_id=f"{common_prefix}00000TSD2", site_type=RcraSiteType.TSDF)
        factory = APIRequestFactory()
        request = factory.get(
            self.URL,
            {
                "epaId": common_prefix,
                "SiteName": "",
                "siteType": RcraSiteType.TSDF,
            },
        )
        force_authenticate(request, user)
        # Act
        response = SearchRcraSiteView.as_view()(request)
        # Assert
        for handler_data in response.data:
            assert handler_data["siteType"] == RcraSiteType.TSDF

    def test_endpoint_returns_200_if_bad_query_params(
        self, user_factory, rcra_site_factory
    ) -> None:
        """Use APIClient to ensure our HTTP response meets spec"""
        # Arrange
        client = APIClient()
        user = user_factory()
        generator = rcra_site_factory()
        client.force_authenticate(user=user)
        # Act
        response = client.get(
            self.URL,
            {
                "epaId": generator.epa_id,
                "SiteName": "",
                "site": generator.site_type,  # misspelled
            },
        )
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert response.headers["Content-Type"] == "application/json"
