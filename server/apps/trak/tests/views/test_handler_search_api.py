import pytest
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate

from apps.sites.views.epa_site_views import EpaSiteSearchView


class TestHandlerSearch:
    """
    Tests for the EpaSite Search endpoint
    """

    ulr = "/api/site/epa_site/search"

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
