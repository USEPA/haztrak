from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate

from apps.org.views import OrgDetailsView


class TestTrakOrgDetailsView:
    base_url = "/api/org"
    factory = APIRequestFactory()

    def test_get_returns_org_details(self, org_factory, org_access_factory, user_factory):
        org = org_factory()
        user = user_factory()
        org_access_factory(org=org, user=user)
        request = self.factory.get(
            f"{self.base_url}/{org.id}",
        )
        force_authenticate(request, user)
        response = OrgDetailsView.as_view()(request, org_id=org.id)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == org.id
