import json

import pytest as pytest
from rest_framework.response import Response


class TestRcraProfileEndpoint:
    """
    Tests the for the endpoints related to the user's EpaProfile
    """

    url = "/api/site/profile"

    @pytest.fixture(autouse=True)
    def _setup(self, rcra_profile_factory, user_factory, api_client_factory):
        self.user = user_factory()
        self.client = api_client_factory(user=self.user)
        self.client.force_authenticate(user=self.user)
        self.profile = rcra_profile_factory(user=self.user)

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
