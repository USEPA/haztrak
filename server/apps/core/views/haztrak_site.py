import logging

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.models import HaztrakSite
from apps.core.serializers import HaztrakSiteSerializer
from apps.core.services import get_org_sites

logger = logging.getLogger(__name__)


class HaztrakSiteListView(ListAPIView):
    """that returns haztrak sites that the current user has access to."""

    serializer_class = HaztrakSiteSerializer

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        user = self.request.user
        return HaztrakSite.objects.filter(sitepermissions__profile__user=user)


@method_decorator(cache_page(60 * 15), name="dispatch")
class HaztrakSiteDetailsView(RetrieveAPIView):
    """
    View to GET a Haztrak Site, which encapsulates the EPA RcraSite plus some.
    """

    serializer_class = HaztrakSiteSerializer
    lookup_field = "rcra_site__epa_id"
    lookup_url_kwarg = "epa_id"
    queryset = HaztrakSite.objects.all()

    @method_decorator(cache_page(60 * 15))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        epa_id = self.kwargs["epa_id"]
        queryset = HaztrakSite.objects.filter(
            rcra_site__epa_id=epa_id, sitepermissions__profile__user=self.request.user
        )
        return queryset


class HaztrakOrgSitesListView(APIView):
    """Retrieve a list of sites for a given HaztrakOrg"""

    @method_decorator(cache_page(60 * 15))
    def get(self, request, *args, **kwargs):
        haztrak_sites = get_org_sites(self.kwargs["org_id"])
        serializer = HaztrakSiteSerializer(haztrak_sites, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
