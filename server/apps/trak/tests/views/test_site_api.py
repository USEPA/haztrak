import http

import pytest
from rest_framework import status
from rest_framework.response import Response
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate

from apps.trak.models import Site
from apps.trak.views import SiteManifest


class TestSiteAPI:
    @pytest.fixture(autouse=True)
    def _api_client(self, api_client):
        self.client = api_client

    @pytest.fixture(autouse=True)
    def _profile(self, rcra_profile_factory):
        self.profile = rcra_profile_factory()

    base_url = "/api/trak/site/"

    def test_responds_200(self):
        response = self.client.get(f"{self.base_url}")
        assert response.status_code == status.HTTP_200_OK

    def test_returns_sites_with_access(self):
        response = self.client.get(f"{self.base_url}")
        sites_with_access = [
            str(i) for i in Site.objects.filter(sitepermission__profile=self.profile)
        ]
        response_site_id = [i["handler"]["epaSiteId"] for i in response.data]
        for site_id in sites_with_access:
            assert site_id in response_site_id

    def test_unauthenticated_returns_401(self):
        self.client.logout()
        response = self.client.get(f"{self.base_url}")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestSiteDetailsApi:
    """
    Tests the site details endpoint
    """

    url = "/api/trak/site"

    @pytest.fixture(autouse=True)
    def _profile(self, rcra_profile_factory, user_factory):
        self.user = user_factory()
        self.profile = rcra_profile_factory(user=self.user)

    #
    # @pytest.fixture(autouse=True)
    # def _site_permission(self, site_permission):
    #     self.site_permission = site_permission

    @pytest.fixture(autouse=True)
    def _site(self, site_factory, handler_factory):
        self.generator = handler_factory()
        self.site = site_factory(epa_site=self.generator)

    # @pytest.fixture(autouse=True)
    # def _site(self, site_generator001):
    #     self.site = site_generator001

    # def test_returns_site(self):
    #     client = APIClient()
    #     client.force_authenticate(user=self.user)
    #     response = client.get(f"{self.url}/{self.generator.epa_id}")
    #     assert response.headers["Content-Type"] == "application/json"
    #     assert response.status_code == 200

    def test_non_user_sites_not_returned(self):
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.get(f"{self.url}/{self.site.epa_site.epa_id}")
        assert response.headers["Content-Type"] == "application/json"
        assert response.status_code == http.HTTPStatus.NOT_FOUND


class TestSiteManifest:
    """
    Tests for the endpoint to retrieve a Site's manifests
    """

    url = "/api/trak/site"

    @pytest.fixture(autouse=True)
    def _user(self, user_factory):
        self.user = user_factory()

    @pytest.fixture(autouse=True)
    def _generator(self, handler_factory):
        self.generator = handler_factory()

    def test_returns_200(self, db):
        factory = APIRequestFactory()
        request = factory.get(f"{self.url}/{self.generator.epa_id}/manifest")
        force_authenticate(request, self.user)
        response: Response = SiteManifest.as_view()(request, self.generator.epa_id)
        print(response)
        # assert response.status_code == http.HTTPStatus.OK
