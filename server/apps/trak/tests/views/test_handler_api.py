from rest_framework.response import Response

from apps.trak.tests.conftest import TestApiClient


class TestHandlerEndpoints(TestApiClient):
    """
    Tests the for the endpoints related to the handlers
    """

    url = "/api/trak/handler"

    def test_get_handler_headers(self):
        print(f"{self.url}/{self.generator.pk}")
        response: Response = self.client.get(f"{self.url}/details/{self.generator.pk}")
        assert response.headers["Content-Type"] == "application/json"
        assert response.status_code == 200

    def test_returns_serialized_handler(self):
        print(f"{self.url}/{self.generator.pk}")
        response: Response = self.client.get(f"{self.url}/details/{self.generator.pk}")
        assert response.data["epaSiteId"] == self.generator.epa_id
