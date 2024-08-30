import http
from profile.serializers import ProfileSerializer
from profile.views import ProfileDetailsView, RcrainfoProfileRetrieveUpdateView

import pytest
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate


class TestProfileViewSet:
    @pytest.fixture
    def api_client(self):
        return APIClient()

    @pytest.fixture
    def profile(self, db, profile_factory, user_factory):
        user = user_factory(username="testuser", password="password")
        user_profile = profile_factory(user=user)
        return user_profile

    def test_retrieves_profile_details(self, api_client, profile):
        api_client.login(username="testuser", password="password")
        url = reverse("profile:profile-detail", kwargs={"user_id": profile.user.id})
        response = api_client.get(url)
        assert response.status_code == 200
        assert response.data == ProfileSerializer(profile).data

    # def test_updates_profile(self, api_client, profile):
    #     api_client.login(username="testuser", password="password")
    #     url = reverse("profile:profile-detail", kwargs={"user_id": profile.user.id})
    #     profile.avatar = "new_avatar"
    #     response = api_client.put(url, ProfileSerializer(profile).data)
    #     print(response.data)
    #     # assert response.data == ProfileSerializer(user_profile).data

    def test_returns_401_for_anonymous_user(self, api_client, profile):
        url = reverse("profile:profile-detail", kwargs={"user_id": profile.user.pk})
        response = api_client.get(url)
        assert response.status_code == http.HTTPStatus.UNAUTHORIZED

    def test_returns_401_for_anonymous_user_on_update(self, api_client, profile):
        url = reverse("profile:profile-detail", kwargs={"user_id": profile.user.pk})
        data = {"field_name": "new_value"}  # Replace with actual fields
        response = api_client.put(url, data)
        assert response.status_code == http.HTTPStatus.UNAUTHORIZED


class TestRcrainfoProfileRetrieveUpdateView:
    factory = APIRequestFactory()

    id_field = "rcraAPIID"
    key_field = "rcraAPIKey"
    username_field = "rcraUsername"

    def test_returns_rcrainfo_profile_details(
        self, rcrainfo_profile_factory, profile_factory, user_factory
    ):
        user = user_factory()
        rcrainfo_profile = rcrainfo_profile_factory()
        profile_factory(user=user, rcrainfo_profile=rcrainfo_profile)
        request = self.factory.get(
            reverse("profile:rcrainfo:retrieve-update", args=[user.username])
        )
        force_authenticate(request, user)
        response = RcrainfoProfileRetrieveUpdateView.as_view()(request, username=user.username)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["rcraUsername"] == rcrainfo_profile.rcra_username

    def test_does_not_return_the_api_key_but_does_return_api_id(
        self, rcrainfo_profile_factory, profile_factory, user_factory
    ):
        my_key = "my_key"
        my_id = "my_id"
        user = user_factory()
        rcrainfo_profile = rcrainfo_profile_factory(rcra_api_key=my_key, rcra_api_id=my_id)
        profile_factory(user=user, rcrainfo_profile=rcrainfo_profile)
        request = self.factory.get(
            reverse("profile:rcrainfo:retrieve-update", args=[user.username])
        )
        force_authenticate(request, user)
        response = RcrainfoProfileRetrieveUpdateView.as_view()(request, username=user.username)
        assert my_key not in response.data.values()
        assert my_id in response.data.values()

    def test_returns_a_user_profile_in_json_representation(
        self, user_factory, rcrainfo_profile_factory, profile_factory, api_client_factory
    ):
        user = user_factory()
        client = api_client_factory(user=user)
        rcra_profile = rcrainfo_profile_factory()
        profile_factory(user=user, rcrainfo_profile=rcra_profile)
        response = client.get(reverse("profile:rcrainfo:retrieve-update", args=[user.username]))
        assert response.headers["Content-Type"] == "application/json"
        assert response.status_code == status.HTTP_200_OK

    def test_rcrainfo_profile_updates(
        self, rcrainfo_profile_factory, profile_factory, user_factory
    ):
        # Arrange
        user = user_factory()
        rcra_profile = rcrainfo_profile_factory()
        profile_factory(user=user, rcrainfo_profile=rcra_profile)
        factory = APIRequestFactory()
        request = factory.put(
            reverse("profile:rcrainfo:retrieve-update", args=[user.username]),
            {
                self.id_field: rcra_profile.rcra_api_id,
                self.username_field: user.username,
                self.key_field: rcra_profile.rcra_api_key,
            },
            format="json",
        )
        force_authenticate(request, user)
        # Act
        response = RcrainfoProfileRetrieveUpdateView.as_view()(request, username=user.username)
        assert response.data[self.id_field] == rcra_profile.rcra_api_id
        assert response.data[self.username_field] == user.username

    def test_update_does_not_return_api_key(
        self, rcrainfo_profile_factory, user_factory, profile_factory
    ):
        # Arrange
        user = user_factory()
        rcra_profile = rcrainfo_profile_factory()
        profile = profile_factory(user=user, rcrainfo_profile=rcra_profile)
        factory = APIRequestFactory()
        request = factory.put(
            reverse("profile:rcrainfo:retrieve-update", args=[user.username]),
            {
                self.id_field: rcra_profile.rcra_api_id,
                self.username_field: user.username,
                self.key_field: rcra_profile.rcra_api_key,
            },
            format="json",
        )
        force_authenticate(request, user)
        # Act
        response = RcrainfoProfileRetrieveUpdateView.as_view()(
            request, username=profile.user.username
        )
        # Assert
        assert self.key_field not in response.data
        assert self.id_field in response.data


class TestProfileDetailsView:
    @pytest.fixture
    def request_factory(self, user_factory):
        user = user_factory()
        factory = APIRequestFactory()
        request = factory.get(reverse("profile:my-profile"))
        force_authenticate(request, user)
        return request, user

    def test_returns_profile(self, request_factory, profile_factory):
        request, user = request_factory
        profile_factory(user=user)
        response = ProfileDetailsView.as_view()(request)
        assert response.status_code == status.HTTP_200_OK
        assert "user" in response.data.keys()

    def test_returns_401_when_unauthenticated(self, profile_factory, user_factory):
        user = user_factory()
        factory = APIRequestFactory()
        request = factory.get(reverse("profile:my-profile"))
        profile_factory(user=user)
        response = ProfileDetailsView.as_view()(request)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
