import pytest
from rest_framework import status
from rest_framework.response import Response
from rest_framework.test import APIRequestFactory, force_authenticate

from apps.core.views import RcraProfileView


class TestRcraProfileView:
    """
    Tests the for the endpoints related to the user's RcraProfile
    """

    URL = "/api/user"
    id_field = "rcraAPIID"
    key_field = "rcraAPIKey"
    username_field = "rcraUsername"
    new_api_id = "updatedRcraAPIID"
    new_api_key = "updatedRcraAPIKey"
    new_username = "newRCRAInfoUsername"

    @pytest.fixture
    def user_and_client(self, rcra_profile_factory, user_factory, api_client_factory):
        self.user = user_factory()
        self.client = api_client_factory(user=self.user)

    @pytest.fixture
    def rcra_profile_request(self, user_and_client):
        factory = APIRequestFactory()
        request = factory.put(
            f"{self.URL}/{self.user.username}/rcra/profile",
            {
                self.id_field: self.new_api_id,
                self.username_field: self.new_username,
                self.key_field: self.new_api_key,
            },
            format="json",
        )
        force_authenticate(request, self.user)
        return request

    def test_returns_a_user_profile(self, user_and_client, rcra_profile_factory):
        # Arrange
        rcra_profile_factory(user=self.user)
        # Act
        response: Response = self.client.get(f"{self.URL}/{self.user.username}/rcra/profile/")
        # Assert
        assert response.headers["Content-Type"] == "application/json"
        assert response.status_code == status.HTTP_200_OK
        assert response.data["user"] == self.user.username

    def test_profile_updates(self, rcra_profile_factory, rcra_profile_request):
        # Arrange
        rcra_profile_factory(user=self.user)
        request = rcra_profile_request
        # Act
        response = RcraProfileView.as_view()(request, username=self.user.username)
        assert response.status_code == status.HTTP_200_OK
        assert response.data[self.id_field] == self.new_api_id
        assert response.data[self.username_field] == self.new_username

    def test_update_does_not_return_api_key(self, rcra_profile_factory, rcra_profile_request):
        # Arrange
        rcra_profile_factory(user=self.user)
        request = rcra_profile_request
        # Act
        response = RcraProfileView.as_view()(request, username=self.user.username)
        # Assert
        assert self.key_field not in response.data
