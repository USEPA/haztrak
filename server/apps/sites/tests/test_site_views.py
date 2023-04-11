from typing import Optional

import pytest
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate

from apps.sites.models import RcraProfile, RcraSite, RcraSitePermission, Site
from apps.sites.views import SiteDetailView, SiteMtnListView


class TestSiteListView:
    @pytest.fixture(autouse=True)
    def _api_client(
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
        self.epa_site = rcra_site_factory()
        self.user_site = site_factory(epa_site=self.epa_site)
        self.user_site_permission = rcra_permission_factory(
            site=self.user_site, profile=self.profile
        )
        self.other_site = site_factory(epa_site=rcra_site_factory(epa_id="VA12345678"))

    base_url = "/api/site/"

    def test_responds_with_site_in_json_format(self):
        response = self.client.get(f"{self.base_url}")
        assert response.status_code == status.HTTP_200_OK

    def test_returns_sites_with_access(self):
        # ToDo: this test is testing details, not behavior (sort of) remove need to know
        #  query details
        response = self.client.get(f"{self.base_url}")
        sites_with_access = [
            i.epa_site.epa_id
            for i in Site.objects.filter(rcrasitepermission__profile=self.profile)
        ]
        response_site_id = [i["handler"]["epaSiteId"] for i in response.data]
        for site_id in sites_with_access:
            assert site_id in response_site_id

    def test_other_sites_not_included(self):
        response = self.client.get(f"{self.base_url}")
        response_site_id = [i["handler"]["epaSiteId"] for i in response.data]
        assert self.other_site.epa_site.epa_id not in response_site_id

    def test_unauthenticated_returns_401(self):
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
        rcra_profile_factory,
        rcra_site_factory,
        user_factory,
        site_factory,
        rcra_permission_factory,
    ):
        """Create sets up a site, corresponding epa_site, a rcra_site_permissions for a user"""

        def create_site_and_related(
            user: Optional[User] = user_factory(),
            epa_site: Optional[RcraSite] = rcra_site_factory(),
            profile: Optional[RcraProfile] = None,
            site: Optional[Site] = None,
            rcra_site_permission: Optional[RcraSitePermission] = None,
        ):
            if profile is None:
                profile = rcra_profile_factory(user=user)
            if site is None:
                site = site_factory(epa_site=epa_site)
            if rcra_site_permission is None:
                rcra_permission_factory(site=site, profile=profile)
            return site

        return create_site_and_related

    def test_returns_site_by_id(self, user_factory, local_site_factory):
        # Arrange
        user = user_factory(username="username1")
        site = local_site_factory(user=user)
        factory = APIRequestFactory()
        request = factory.get(f"{self.url}/{site.epa_site.epa_id}")
        force_authenticate(request, user)
        # Act
        response = SiteDetailView.as_view()(request, epa_id=site.epa_site.epa_id)
        # Assert
        assert response.data["handler"]["epaSiteId"] == site.epa_site.epa_id

    def test_non_user_sites_not_returned(self, user_factory, local_site_factory, site_factory):
        # Arrange
        user = user_factory(username="username1")
        local_site_factory(user=user)
        other_site = site_factory()
        factory = APIRequestFactory()
        request = factory.get(f"{self.url}/{other_site.epa_site.epa_id}")
        force_authenticate(request, user)
        # Act
        response = SiteDetailView.as_view()(request, epa_id=other_site.epa_site.epa_id)
        # Assert
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_returns_formatted_http_response(self, user_factory, local_site_factory, site_factory):
        # Arrange
        user = user_factory(username="username1")
        site = local_site_factory(user=user)
        client = APIClient()
        client.force_authenticate(user=user)
        # Act
        response = client.get(f"{self.url}/{site.epa_site.epa_id}")
        # Assert
        assert response.headers["Content-Type"] == "application/json"
        assert response.status_code == status.HTTP_200_OK


class TestSiteManifest:
    """
    Tests for the endpoint to retrieve a Site's manifests
    """

    # ToDo fix these false positive tests

    url = "/api/site"

    @pytest.fixture(autouse=True)
    def _user(self, user_factory):
        self.user = user_factory()

    @pytest.fixture(autouse=True)
    def _generator(self, rcra_site_factory):
        self.generator = rcra_site_factory()

    def test_returns_200(self):
        factory = APIRequestFactory()
        request = factory.get(f"{self.url}/{self.generator.epa_id}/manifest")
        force_authenticate(request, self.user)
        response: Response = SiteMtnListView.as_view()(request, self.generator.epa_id)
        print(response.data)
