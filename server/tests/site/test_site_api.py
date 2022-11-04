from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import Profile


class SiteAPITests(APITestCase):
    base_url = '/api/trak/site/'
    fixtures = ['test_data.json']

    def setUp(self) -> None:
        self.user = User.objects.get(username='testuser1')
        self.profile = Profile.objects.get(user=self.user)
        self.client.force_authenticate(self.user)

    def test_responds_200(self):
        response = self.client.get(f'{self.base_url}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_returns_list_of_users_sites(self):
        response = self.client.get(f'{self.base_url}')
        profile_sites = [str(i) for i in self.profile.epa_sites.all()]
        response_sites = []
        try:
            for site in response.data:
                response_sites.append(site['siteHandler']['epaSiteId'])
        except KeyError as error:
            self.fail(error)
        self.assertEqual(profile_sites, response_sites)

    def test_if_id_return_200(self):
        sites = [str(i) for i in self.profile.epa_sites.all()]
        response = self.client.get(f'{self.base_url}{sites[0]}')
        self.assertIsNotNone(response.status_code, status.HTTP_200_OK)

    def test_nonexistent_site_returns_404(self):
        # sites = [str(i) for i in self.profile.epa_sites.all()]
        response = self.client.get(f'{self.base_url}NONEXISTENT')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_returns_401(self):
        self.client.logout()
        response = self.client.get(f'{self.base_url}')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class SiteManifestTests(APITestCase):
    base_url = '/api/trak/site/'
    fixtures = ['test_data.json']

    def setUp(self) -> None:
        self.user = User.objects.get(username='testuser1')
        self.profile = Profile.objects.get(user=self.user)
        self.client.force_authenticate(self.user)

    def test_site_manifest_returns_200(self):
        print(self.profile)
        response = self.client.get(f'{self.base_url}VATESTGEN001/manifest')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
