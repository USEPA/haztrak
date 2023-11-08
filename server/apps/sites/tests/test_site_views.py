from typing import Optional

import pytest
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate

from apps.core.models import RcraProfile  # type: ignore
from apps.sites.models import RcraSite, RcraSitePermission, Site  # type: ignore
from apps.sites.views import SiteDetailView  # type: ignore


class TestSiteListView:
    @pytest.fixture
    def api_client(
        self,
        api_client_factory,
        rcra_profile_factory,
        rcra_permission_factory,
        user_factory,
        site_factory,
        rcra_site_factory,
    ):
        self.user = user_factory()
        self.client = api_client_factory(user=self.user)
        self.profile = rcra_profile_factory(user=self.user)
        self.rcra_site = rcra_site_factory()
        self.user_site = site_factory(rcra_site=self.rcra_site)
        self.user_site_permission = rcra_permission_factory(
            site=self.user_site, profile=self.profile
        )
        self.other_site = site_factory(rcra_site=rcra_site_factory(epa_id="VA12345678"))

    base_url = "/api/site"

    def test_responds_with_site_in_json_format(self, api_client):
        response = self.client.get(f"{self.base_url}")
        assert response.status_code == status.HTTP_200_OK

    def test_returns_sites_with_access(self, api_client):
        response = self.client.get(f"{self.base_url}")
        response_site_id = [i["handler"]["epaSiteId"] for i in response.data]
        print(response_site_id)

    def test_other_sites_not_included(self, api_client):
        response = self.client.get(f"{self.base_url}")
        response_site_id = [i["handler"]["epaSiteId"] for i in response.data]
        assert self.other_site.rcra_site.epa_id not in response_site_id

    def test_unauthenticated_returns_401(self, api_client):
        self.client.logout()
        response = self.client.get(f"{self.base_url}")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestSiteDetailsApi:
    """
    Tests the site details endpoint
    """

    url = "/api/site"

    @pytest.fixture
    def local_site_factory(
        self,
        haztrak_profile_factory,
        site_access_factory,
        rcra_site_factory,
        user_factory,
        site_factory,
    ):
        """Create sets up a site, corresponding rcra_site, a rcra_site_permissions for a user"""

        def create_site_and_related(
            user: Optional[User] = user_factory(),
            rcra_site: Optional[RcraSite] = rcra_site_factory(),
            profile: Optional[RcraProfile] = None,
            site: Optional[Site] = None,
            rcra_site_permission: Optional[RcraSitePermission] = None,
        ):
            if profile is None:
                profile = haztrak_profile_factory(user=user)
            if site is None:
                site = site_factory(rcra_site=rcra_site)
            if rcra_site_permission is None:
                site_access_factory(site=site, profile=profile)
            return site

        return create_site_and_related

    def test_returns_site_by_id(self, user_factory, local_site_factory) -> None:
        # Arrange
        user = user_factory(username="username1")
        site = local_site_factory(user=user)
        factory = APIRequestFactory()
        request = factory.get(f"{self.url}/{site.rcra_site.epa_id}")
        force_authenticate(request, user)
        # Act
        response = SiteDetailView.as_view()(request, epa_id=site.rcra_site.epa_id)
        # Assert
        assert response.data["handler"]["epaSiteId"] == site.rcra_site.epa_id

    def test_non_user_sites_not_returned(self, user_factory, local_site_factory, site_factory):
        # Arrange
        user = user_factory(username="username1")
        local_site_factory(user=user)
        other_site = site_factory()
        factory = APIRequestFactory()
        request = factory.get(f"{self.url}/{other_site.rcra_site.epa_id}")
        force_authenticate(request, user)
        # Act
        response = SiteDetailView.as_view()(request, epa_id=other_site.rcra_site.epa_id)
        # Assert
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_returns_formatted_http_response(self, user_factory, local_site_factory, site_factory):
        # Arrange
        user = user_factory(username="username1")
        site = local_site_factory(user=user)
        client = APIClient()
        client.force_authenticate(user=user)
        # Act
        print(site.rcra_site.epa_id)
        response = client.get(f"{self.url}/{site.rcra_site.epa_id}")
        # Assert
        assert response.headers["Content-Type"] == "application/json"
        assert response.status_code == status.HTTP_200_OK
