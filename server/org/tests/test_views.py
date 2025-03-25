from unittest.mock import patch

import pytest
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate

from org.models import Org
from org.views import OrgDetailsView, OrgListView, SiteDetailsView


class TestOrgDetailsView:
    factory = APIRequestFactory()

    @pytest.fixture
    def user(self, user_factory):
        return user_factory()

    @pytest.fixture
    def org(self, org_factory):
        return org_factory()

    def test_get_returns_org_details(self, org, user, perm_factory):
        perm_factory(user, ["org.view_org"], org)
        request = self.factory.get(reverse("org:details", args=[org.slug]))
        force_authenticate(request, user)
        response = OrgDetailsView.as_view()(request, org_slug=org.slug)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["slug"] == org.slug

    def test_404_when_org_id_not_defined(self, org, user):
        request = self.factory.get(reverse("org:details", args=["foo"]))
        force_authenticate(request, user)
        with patch("org.views.get_org_by_slug") as mock_org:
            mock_org.side_effect = Org.DoesNotExist
            response = OrgDetailsView.as_view()(request, org_slug="foo")
            assert response.status_code == status.HTTP_404_NOT_FOUND


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
        response = self.client.get(reverse("org:site:list"))
        assert response.status_code == status.HTTP_200_OK

    def test_other_sites_not_included(self, api_client):
        response = self.client.get(reverse("org:site:list"))
        response_site_id = [i["handler"]["epaSiteId"] for i in response.data]
        assert self.other_site.rcra_site.epa_id not in response_site_id

    def test_unauthenticated_returns_401(self, api_client):
        self.client.logout()
        response = self.client.get(reverse("org:site:list"))
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestSiteDetailsApi:
    """Tests the site details endpoint."""

    @pytest.fixture
    def setup_user_site_perm(self, user_factory, site_factory, perm_factory):
        user = user_factory()
        site = site_factory()
        perm_factory(user, ["org.view_site"], site)
        request = APIRequestFactory()
        request = request.get(reverse("org:site:details", args=[site.rcra_site.epa_id]))
        force_authenticate(request, user)
        return user, site, request

    def test_returns_site_by_id(self, setup_user_site_perm):
        # Arrange
        user, site, request = setup_user_site_perm
        # Act
        response = SiteDetailsView.as_view()(request, epa_id=site.rcra_site.epa_id)
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert response.data["handler"]["epaSiteId"] == site.rcra_site.epa_id

    def test_non_user_sites_not_returned(self, site_factory, org_factory, setup_user_site_perm):
        # Arrange
        user, site, request = setup_user_site_perm
        other_site = site_factory()
        # Act
        response = SiteDetailsView.as_view()(request, epa_id=other_site.rcra_site.epa_id)
        # Assert
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestOrgListView:
    @pytest.fixture
    def setup_user_org_perm(self, user_factory, org_factory, perm_factory):
        user = user_factory()
        org = org_factory()
        perm_factory(user, ["org.view_org"], org)
        request = APIRequestFactory()
        request = request.get(reverse("org:list"))
        force_authenticate(request, user)
        return user, org, request

    def test_returns_user_orgs(self, setup_user_org_perm):
        # Arrange
        user, org, request = setup_user_org_perm
        # Act
        response = OrgListView.as_view()(request)
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert response.data[0]["slug"] == org.slug

    def test_filters_orgs(self, setup_user_org_perm, org_factory):
        # Arrange
        user, org, request = setup_user_org_perm
        other_org = org_factory()
        # Act
        response = OrgListView.as_view()(request)
        org_slugs = [i["slug"] for i in response.data]
        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert org.slug in org_slugs
        assert other_org.slug not in org_slugs


class TestOrgSitesListView:
    def test_returns_list_of_organizations_sites(
        self,
        user_factory,
        site_factory,
        org_factory,
        perm_factory,
    ):
        # Arrange
        user = user_factory()
        org = org_factory()
        site = site_factory(org=org)
        perm_factory(user, ["org.view_site"], site)
        client = APIClient()
        client.force_authenticate(user=user)
        # Act
        response = client.get(reverse("org:sites", args=[org.slug]))
        # Assert
        assert response.headers["Content-Type"] == "application/json"
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
