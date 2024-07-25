import pytest
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate

from orgsite.views import SiteDetailsView


class TestSiteListView:
    @pytest.fixture
    def api_client(
        self,
        api_client_factory,
        user_factory,
        site_factory,
        rcra_site_factory,
    ):
        self.user = user_factory()
        self.client = api_client_factory(user=self.user)
        self.user_site = site_factory()
        self.other_site = site_factory(rcra_site=rcra_site_factory(epa_id="VA12345678"))

    def test_responds_with_site_in_json_format(self, api_client):
        response = self.client.get(reverse("orgsite:list"))
        assert response.status_code == status.HTTP_200_OK

    def test_other_sites_not_included(self, api_client):
        response = self.client.get(reverse("orgsite:list"))
        response_site_id = [i["handler"]["epaSiteId"] for i in response.data]
        assert self.other_site.rcra_site.epa_id not in response_site_id

    def test_unauthenticated_returns_401(self, api_client):
        self.client.logout()
        response = self.client.get(reverse("orgsite:list"))
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestSiteDetailsApi:
    """Tests the site details endpoint"""

    def test_returns_site_by_id(self, user_factory, site_factory, perm_factory):
        # Arrange
        user = user_factory(username="username1")
        site = site_factory()
        perm_factory(user, ["orgsite.view_site"], site)
        request = APIRequestFactory()
        request = request.get(reverse("orgsite:details", args=[site.rcra_site.epa_id]))
        force_authenticate(request, user)
        print(user.has_perm("orgsite.view_site", site))
        print(user.has_perm("orgsite.view_site"))
        # Act
        response = SiteDetailsView.as_view()(request, epa_id=site.rcra_site.epa_id)
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert response.data["handler"]["epaSiteId"] == site.rcra_site.epa_id

    def test_non_user_sites_not_returned(
        self, user_factory, site_factory, org_factory, perm_factory
    ):
        # Arrange
        user = user_factory()
        site = site_factory()
        other_site = site_factory()
        perm_factory(user, ["orgsite.view_site"], site)
        request = APIRequestFactory()
        request = request.get(reverse("orgsite:details", args=[site.rcra_site.epa_id]))
        force_authenticate(request, user)
        # Act
        response = SiteDetailsView.as_view()(request, epa_id=other_site.rcra_site.epa_id)
        # Assert
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestOrgSitesListView:
    def test_returns_list_of_organizations_sites(
        self,
        user_factory,
        site_factory,
        org_factory,
    ):
        # Arrange
        user = user_factory()
        org = org_factory()
        site_factory(org=org)
        client = APIClient()
        client.force_authenticate(user=user)
        # Act
        response = client.get(reverse("orgsite:org-sites", args=[org.id]))
        # Assert
        assert response.headers["Content-Type"] == "application/json"
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
