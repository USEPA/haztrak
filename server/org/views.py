from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

from org.filters import ObjectPermissionsFilter
from org.models import Org, Site
from org.permissions import OrgObjectPermissions, SiteObjectPermissions
from org.serializers import OrgSerializer, SiteSerializer
from org.services import (
    filter_sites_by_org,
    find_sites_by_user,
    get_org_by_slug,
    get_site_by_epa_id,
)


class OrgDetailsView(RetrieveAPIView):
    """Retrieve details for a given Org"""

    serializer_class = OrgSerializer
    queryset = Org.objects.all()
    lookup_url_kwarg = "org_slug"
    permission_classes = [OrgObjectPermissions, IsAuthenticated]

    def get_object(self):
        org = get_org_by_slug(self.kwargs["org_slug"])
        self.check_object_permissions(self.request, org)
        return org


class OrgListView(ListAPIView):
    """that returns all haztrak organization that the user has access to."""

    serializer_class = OrgSerializer
    queryset = Org.objects.all()
    filter_backends = [ObjectPermissionsFilter]


class SiteListView(ListAPIView):
    """that returns all haztrak sites that the user has access to."""

    serializer_class = SiteSerializer
    queryset = Site.objects.all()
    filter_backends = [ObjectPermissionsFilter]

    def get_queryset(self):
        if "org_slug" in self.kwargs:
            return filter_sites_by_org(self.kwargs["org_slug"])
        return find_sites_by_user(self.request.user)


class SiteDetailsView(RetrieveAPIView):
    """View details of a Haztrak Site."""

    serializer_class = SiteSerializer
    lookup_url_kwarg = "epa_id"
    queryset = Site.objects.all()
    permission_classes = [SiteObjectPermissions, IsAuthenticated]

    def get_object(self):
        site = get_site_by_epa_id(epa_id=self.kwargs["epa_id"])
        self.check_object_permissions(self.request, site)
        return site
