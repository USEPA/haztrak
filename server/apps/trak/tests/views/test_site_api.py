import http

import pytest
from rest_framework import status
from rest_framework.response import Response
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate

from apps.sites.models import Site
from apps.sites.views import SiteManifest


class TestSiteAPI:
    @pytest.fixture(autouse=True)
    def _api_client(
        self,
        api_client_factory,
        rcra_profile_factory,
        site_permission_factory,
        user_factory,
        site_factory,
        epa_site_factory,
    ):
        self.user = user_factory()
        self.client = api_client_factory(user=self.user)
        self.profile = rcra_profile_factory(user=self.user)
        self.epa_site = epa_site_factory()
        self.user_site = site_factory(epa_site=self.epa_site)
        self.user_site_permission = site_permission_factory(
            site=self.user_site, profile=self.profile
        )
        self.other_site = site_factory(epa_site=epa_site_factory(epa_id="VA12345678"))

    base_url = "/api/site/"

    def test_responds_200(self):
        response = self.client.get(f"{self.base_url}")
        assert response.status_code == status.HTTP_200_OK

    def test_returns_sites_with_access(self):
        response = self.client.get(f"{self.base_url}")
        sites_with_access = [
            i.epa_site.epa_id for i in Site.objects.filter(sitepermission__profile=self.profile)
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

    @pytest.fixture(autouse=True)
    def _site(
        self,
        user_factory,
        rcra_profile_factory,
        site_factory,
        epa_site_factory,
        site_permission_factory,
    ):
        self.user = user_factory(username="testuser1")
        self.profile = rcra_profile_factory(user=self.user)
        self.generator = epa_site_factory()
        self.site = site_factory(epa_site=self.generator)
        self.site_permission = site_permission_factory(site=self.site, profile=self.profile)
        self.other_site = site_factory(epa_site=epa_site_factory(epa_id="VAFOOBAR001"))

    def test_returns_site(self):
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.get(f"{self.url}/{self.site.epa_site.epa_id}")
        assert response.headers["Content-Type"] == "application/json"
        assert response.status_code == 200

    def test_non_user_sites_not_returned(self):
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.get(f"{self.url}/{self.other_site.epa_site.epa_id}")
        assert response.headers["Content-Type"] == "application/json"
        assert response.status_code == http.HTTPStatus.NOT_FOUND


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
    def _generator(self, epa_site_factory):
        self.generator = epa_site_factory()

    def test_returns_200(self):
        factory = APIRequestFactory()
        request = factory.get(f"{self.url}/{self.generator.epa_id}/manifest")
        force_authenticate(request, self.user)
        response: Response = SiteManifest.as_view()(request, self.generator.epa_id)
        print(response.data)
        # assert response.status_code == http.HTTPStatus.OK
