from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate

from apps.core.views import RcraProfileView  # type: ignore


class TestRcraProfileView:
    """
    Tests the for the endpoints related to the user's RcraProfile
    """

    URL = "/api/"
    id_field = "rcraAPIID"
    key_field = "rcraAPIKey"
    username_field = "rcraUsername"
    new_api_id = "updatedRcraAPIID"
    new_api_key = "updatedRcraAPIKey"
    new_username = "newRCRAInfoUsername"

    def test_returns_a_user_profile(
        self, user_factory, rcra_profile_factory, haztrak_profile_factory, api_client_factory
    ):
        # Arrange
        user = user_factory()
        client = api_client_factory(user=user)
        rcra_profile = rcra_profile_factory()
        haztrak_profile_factory(user=user, rcrainfo_profile=rcra_profile)
        # Act
        response = client.get(f"{self.URL}rcra/profile/{user.username}")
        # Assert
        assert response.headers["Content-Type"] == "application/json"
        assert response.status_code == status.HTTP_200_OK

    def test_rcra_profile_updates(
        self, rcra_profile_factory, haztrak_profile_factory, user_factory
    ):
        # Arrange
        user = user_factory()
        rcra_profile = rcra_profile_factory()
        haztrak_profile_factory(user=user, rcrainfo_profile=rcra_profile)
        factory = APIRequestFactory()
        request = factory.put(
            f"{self.URL}rcra/profile/{user.username}",
            {
                self.id_field: rcra_profile.rcra_api_id,
                self.username_field: user.username,
                self.key_field: rcra_profile.rcra_api_key,
            },
            format="json",
        )
        force_authenticate(request, user)
        # Act
        response = RcraProfileView.as_view()(request, username=user.username)
        assert response.data[self.id_field] == rcra_profile.rcra_api_id
        assert response.data[self.username_field] == user.username

    def test_update_does_not_return_api_key(
        self, rcra_profile_factory, user_factory, haztrak_profile_factory
    ):
        # Arrange
        user = user_factory()
        rcra_profile = rcra_profile_factory()
        profile = haztrak_profile_factory(user=user, rcrainfo_profile=rcra_profile)
        factory = APIRequestFactory()
        request = factory.put(
            f"{self.URL}rcra/profile/{user.username}",
            {
                self.id_field: rcra_profile.rcra_api_id,
                self.username_field: user.username,
                self.key_field: rcra_profile.rcra_api_key,
            },
            format="json",
        )
        force_authenticate(request, user)
        # Act
        response = RcraProfileView.as_view()(request, username=profile.user.username)
        # Assert
        assert self.key_field not in response.data
        assert self.id_field in response.data
