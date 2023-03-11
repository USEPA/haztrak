import json

import pytest as pytest
from rest_framework.response import Response


class TestRcraProfileEndpoint:
    """
    Tests the for the endpoints related to the user's RcraProfile
    """

    @pytest.fixture(autouse=True)
    def _api_client(self, api_client):
        self.client = api_client

    @pytest.fixture(autouse=True)
    def _profile(self, rcra_profile_factory, user_factory):
        self.user = user_factory()
        self.profile = rcra_profile_factory(user=self.user)

    url = "/api/trak/profile"

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
