import http

import pytest
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import (APIClient, APIRequestFactory, APITestCase,
                                 force_authenticate)

from apps.trak.models import RcraProfile
from apps.trak.views import SiteManifest


class SiteAPITests(APITestCase):
    base_url = '/api/trak/site/'
    fixtures = ['dev_data.json']

    def setUp(self) -> None:
        self.user = User.objects.get(username='testuser1')
        self.profile = RcraProfile.objects.get(user=self.user)
        self.client.force_authenticate(self.user)

    def test_responds_200(self):
        response = self.client.get(f'{self.base_url}')
        assert response.status_code == status.HTTP_200_OK

    def test_returns_list_of_users_sites(self):
        response = self.client.get(f'{self.base_url}')
        profile_sites = [str(i) for i in self.profile.epa_sites.all()]
        response_sites = []
        try:
            for site in response.data:
                response_sites.append(site['handler']['epaSiteId'])
        except KeyError as error:
            self.fail(error)
        assert profile_sites == response_sites

    def test_unauthenticated_returns_401(self):
        self.client.logout()
        response = self.client.get(f'{self.base_url}')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestSiteDetailsApi:
    """
    Tests the site details endpoint
    """
    url = '/api/trak/site'

    @pytest.fixture(autouse=True)
    def _profile(self, test_user_profile):
        self.profile = test_user_profile

    @pytest.fixture(autouse=True)
    def _site_permission(self, site_permission):
        self.site_permission = site_permission

    @pytest.fixture(autouse=True)
    def _generator(self, generator001):
        self.generator = generator001

    @pytest.fixture(autouse=True)
    def _site(self, site_generator001):
        self.site = site_generator001

    @pytest.fixture(autouse=True)
    def _test_user(self, testuser1):
        self.user = testuser1

    def test_returns_site(self):
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.get(f'{self.url}/{self.generator.epa_id}')
        assert response.headers['Content-Type'] == 'application/json'
        assert response.data['name'] == self.site.name
        assert response.status_code == 200

    def test_non_user_sites_not_returned(self, site_tsd001):
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.get(f'{self.url}/{site_tsd001.epa_site.epa_id}')
        assert response.headers['Content-Type'] == 'application/json'
        assert response.status_code == http.HTTPStatus.NOT_FOUND


class TestSiteManifest:
    """
    Tests for the endpoint to retrieve a Site's manifests
    """
    url = '/api/trak/site'

    @pytest.fixture(autouse=True)
    def _manifest(self, manifest_elc):
        self.manifest = manifest_elc

    @pytest.fixture(autouse=True)
    def _profile(self, test_user_profile):
        self.profile = test_user_profile

    @pytest.fixture(autouse=True)
    def _generator(self, generator001):
        self.generator = generator001

    @pytest.fixture(autouse=True)
    def _site(self, site_generator001):
        self.site = site_generator001

    @pytest.fixture(autouse=True)
    def _test_user(self, testuser1):
        self.user = testuser1

    def test_returns_200(self, db):
        factory = APIRequestFactory()
        request = factory.get(f'{self.url}/{self.generator.epa_id}/manifest')
        force_authenticate(request, self.user)
        response = SiteManifest.as_view()(request, self.generator.epa_id)
        assert response.status_code == http.HTTPStatus.OK
