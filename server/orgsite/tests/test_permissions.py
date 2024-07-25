from guardian.shortcuts import assign_perm
from rest_framework.test import APIRequestFactory

from orgsite.permissions import SiteObjectPermissions
from orgsite.views import SiteDetailsView


class TestSiteObjectPermissions:
    perm = SiteObjectPermissions()

    def test_user_can_view_site(self, user_factory, site_factory):
        user = user_factory()
        site = site_factory()
        assign_perm("orgsite.view_site", user, site)
        request = APIRequestFactory().get("")
        request.user = user
        mock_view = SiteDetailsView()
        assert self.perm.has_object_permission(request, mock_view, site) is True