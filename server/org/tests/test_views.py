from unittest.mock import patch

import pytest
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APIRequestFactory, force_authenticate

from org.models import Org
from org.views import OrgDetailsView


class TestOrgDetailsView:
    factory = APIRequestFactory()

    @pytest.fixture
    def user(self, user_factory):
        return user_factory()

    @pytest.fixture
    def org(self, org_factory):
        return org_factory()

    def test_get_returns_org_details(self, org, org_access_factory, user):
        org_access_factory(org=org, user=user)
        request = self.factory.get(reverse("org:details", args=[org.id]))
        force_authenticate(request, user)
        response = OrgDetailsView.as_view()(request, org_id=org.id)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == org.id

    def test_404_when_org_id_not_defined(self, org, org_access_factory, user):
        request = self.factory.get(reverse("org:details", args=["foo"]))
        force_authenticate(request, user)
        with patch("org.views.get_org_by_id") as mock_org:
            mock_org.side_effect = Org.DoesNotExist
            response = OrgDetailsView.as_view()(request, org_id="foo")
            assert response.status_code == status.HTTP_404_NOT_FOUND
