from typing import Optional

import pytest
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate

from apps.core.models import HaztrakUser, RcraProfile  # type: ignore
from apps.sites.models import HaztrakSite, RcraSite, RcraSitePermissions  # type: ignore
from apps.sites.views import SiteDetailView  # type: ignore


class TestHaztrakSiteListView:
    @pytest.fixture
    def api_client(
        self,
        api_client_factory,
        rcra_profile_factory,
        rcra_permission_factory,
        user_factory,
        haztrak_site_factory,
        rcra_site_factory,
        haztrak_profile_factory,
    ):
        self.user = user_factory()
        self.client = api_client_factory(user=self.user)
        self.rcra_profile = rcra_profile_factory()
        self.profile = haztrak_profile_factory(user=self.user, rcrainfo_profile=self.rcra_profile)
        self.rcra_site = rcra_site_factory()
        self.user_site = haztrak_site_factory(rcra_site=self.rcra_site)
        self.user_site_permission = rcra_permission_factory(
            site=self.rcra_site, profile=self.rcra_profile
        )
        self.other_site = haztrak_site_factory(rcra_site=rcra_site_factory(epa_id="VA12345678"))

    base_url = "/api/site"

    def test_responds_with_site_in_json_format(self, api_client):
        response = self.client.get(f"{self.base_url}")
        assert response.status_code == status.HTTP_200_OK

    def test_other_sites_not_included(self, api_client):
        response = self.client.get(f"{self.base_url}")
        response_site_id = [i["handler"]["epaSiteId"] for i in response.data]
        assert self.other_site.rcra_site.epa_id not in response_site_id

    def test_unauthenticated_returns_401(self, api_client):
        self.client.logout()
        response = self.client.get(f"{self.base_url}")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestHaztrakSiteDetailsApi:
    """
    Tests the site details endpoint
    """

    url = "/api/site"

    def test_returns_site_by_id(
        self,
        user_factory,
        haztrak_site_factory,
        haztrak_site_permission_factory,
        haztrak_profile_factory,
    ):
        # Arrange
        user = user_factory(username="username1")
        profile = haztrak_profile_factory(user=user)
        site = haztrak_site_factory()
        haztrak_site_permission_factory(profile=profile, site=site)
        request = APIRequestFactory()
        request = request.get(f"{self.url}/{site.rcra_site.epa_id}")
        force_authenticate(request, user)
        # Act
        response = SiteDetailView.as_view()(request, epa_id=site.rcra_site.epa_id)
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert response.data["handler"]["epaSiteId"] == site.rcra_site.epa_id

    def test_non_user_sites_not_returned(
        self,
        user_factory,
        haztrak_site_factory,
        haztrak_profile_factory,
        haztrak_org_factory,
        haztrak_site_permission_factory,
    ):
        # Arrange
        user = user_factory()
        profile = haztrak_profile_factory(user=user)
        org = haztrak_org_factory(admin=user)
        site = haztrak_site_factory(org=org)
        haztrak_site_permission_factory(profile=profile, site=site)
        other_org = haztrak_org_factory()
        other_site = haztrak_site_factory(org=other_org)
        request = APIRequestFactory()
        request = request.get(f"{self.url}/{other_site.rcra_site.epa_id}")
        force_authenticate(request, user)
        # Act
        response = SiteDetailView.as_view()(request, epa_id=other_site.rcra_site.epa_id)
        # Assert
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_returns_formatted_http_response(
        self,
        user_factory,
        haztrak_site_factory,
        haztrak_profile_factory,
        haztrak_site_permission_factory,
        haztrak_org_factory,
    ):
        # Arrange
        user = user_factory()
        profile = haztrak_profile_factory(user=user)
        org = haztrak_org_factory(admin=user)
        site = haztrak_site_factory(org=org)
        haztrak_site_permission_factory(profile=profile, site=site)
        client = APIClient()
        client.force_authenticate(user=user)
        # Act
        response = client.get(f"{self.url}/{site.rcra_site.epa_id}")
        # Assert
        assert response.headers["Content-Type"] == "application/json"
        assert response.status_code == status.HTTP_200_OK
