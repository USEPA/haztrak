import pytest as pytest
from rest_framework.response import Response


class TestHandlerEndpoints:
    """
    Tests the for the endpoints related to the handlers
    """

    url = "/api/trak/handler"

    @pytest.fixture(autouse=True)
    def _api_client(self, api_client):
        self.client = api_client

    @pytest.fixture(autouse=True)
    def _generator(self, handler_factory):
        self.generator = handler_factory()

    def test_get_handler_headers(self):
        response: Response = self.client.get(f"{self.url}/details/{self.generator.pk}")
        assert response.headers["Content-Type"] == "application/json"
        assert response.status_code == 200

    def test_returns_serialized_handler(self):
        response: Response = self.client.get(f"{self.url}/details/{self.generator.pk}")
        assert response.data["epaSiteId"] == self.generator.epa_id
