import logging

from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from org.models import Org, Site
from org.permissions import OrgObjectPermissions, SiteObjectPermissions
from org.serializers import OrgSerializer, SiteSerializer
from org.services import filter_sites_by_org, find_sites_by_user, get_org_by_id, get_site_by_epa_id

logger = logging.getLogger(__name__)


class OrgDetailsView(RetrieveAPIView):
    """Retrieve details for a given Org"""

    serializer_class = OrgSerializer
    queryset = Org.objects.all()
    lookup_url_kwarg = "org_id"
    permission_classes = [OrgObjectPermissions, IsAuthenticated]

    def get_object(self):
        org = get_org_by_id(self.kwargs["org_id"])
        self.check_object_permissions(self.request, org)
        return org

    def retrieve(self, request, *args, **kwargs):
        org = self.get_object()
        serializer = OrgSerializer(org)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class SiteListView(ListAPIView):
    """that returns all haztrak sites that the user has access to."""

    serializer_class = SiteSerializer
    queryset = Site.objects.all()

    def list(self, request, *args, **kwargs):
        sites = find_sites_by_user(request.user)
        data = self.serializer_class(sites, many=True).data
        return Response(data, status=status.HTTP_200_OK)


class SiteDetailsView(RetrieveAPIView):
    """View details of a Haztrak Site."""

    serializer_class = SiteSerializer
    lookup_url_kwarg = "epa_id"
    queryset = Site.objects.all()
    permission_classes = [SiteObjectPermissions, IsAuthenticated]

    def get_object(self):
        print(f"Checking permissions for user {self.request.user} ")
        site = get_site_by_epa_id(epa_id=self.kwargs["epa_id"])
        self.check_object_permissions(self.request, site)
        return site


class OrgSitesListView(ListAPIView):
    """Retrieve a list of sites filtered by organization."""

    queryset = Site.objects.all()
    serializer_class = SiteSerializer

    def get_queryset(self):
        return filter_sites_by_org(self.kwargs["org_id"])
