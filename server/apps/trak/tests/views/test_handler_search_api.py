import pytest
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate

from apps.trak.views import HandlerSearch


class TestHandlerSearch:
    """
    Tests for the Handler Search endpoint
    """

    ulr = "/api/trak/handler/search"

    @pytest.fixture(autouse=True)
    def _setup_handler(self, handler_factory):
        self.generator = handler_factory()

    @pytest.fixture(autouse=True)
    def _setup_user(self, user_factory):
        self.user = user_factory()

    def test_returns_array_of_handlers(self, db):
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
        response = HandlerSearch.as_view()(request)
        # Assert
        assert len(response.data) > 0
        for i in response.data:
            assert isinstance(i, dict)

    def test_endpoint_headers(self, db) -> None:
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
