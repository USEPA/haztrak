import logging

from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response

from orgsite.models import Site
from orgsite.permissions import SiteObjectPermissions
from orgsite.serializers import SiteSerializer
from orgsite.services import (
    filter_sites_by_org,
    find_sites_by_user,
    get_site_by_epa_id,
)

logger = logging.getLogger(__name__)


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
    permission_classes = [SiteObjectPermissions]

    def get_object(self):
        site = get_site_by_epa_id(epa_id=self.kwargs["epa_id"])
        self.check_object_permissions(self.request, site)
        return site


class OrgSitesListView(ListAPIView):
    """Retrieve a list of sites filtered by organization."""

    queryset = Site.objects.all()
    serializer_class = SiteSerializer

    def get_queryset(self):
        return filter_sites_by_org(self.kwargs["org_id"])
