import logging

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.site.models import TrakSite
from apps.site.serializers import TrakSiteSerializer
from apps.site.services import filter_sites_by_org

logger = logging.getLogger(__name__)


class TrakSiteListView(ListAPIView):
    """that returns haztrak sites that the current user has access to."""

    serializer_class = TrakSiteSerializer

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        return TrakSite.objects.filter_by_user(self.request.user)


@method_decorator(cache_page(60 * 15), name="dispatch")
class TrakSiteDetailsView(RetrieveAPIView):
    """View details of a Haztrak Site, which encapsulates the EPA RcraSite plus some."""

    serializer_class = TrakSiteSerializer
    lookup_url_kwarg = "epa_id"
    queryset = TrakSite.objects.all()

    @method_decorator(cache_page(60 * 15))
    def get(self, request, *args, **kwargs):
        try:
            site = TrakSite.objects.get_user_site_by_epa_id(
                request.user, self.kwargs.get("epa_id")
            )
            data = self.serializer_class(site).data
            return Response(data, status=status.HTTP_200_OK)
        except TrakSite.DoesNotExist as e:
            return Response(data=str(e), status=status.HTTP_404_NOT_FOUND)


class TrakOrgSitesListView(APIView):
    """Retrieve a list of sites for a given Org"""

    @method_decorator(cache_page(60 * 15))
    def get(self, request, *args, **kwargs):
        try:
            trak_sites = filter_sites_by_org(self.kwargs["org_id"])
            serializer = TrakSiteSerializer(trak_sites, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        except TrakSite.DoesNotExist as e:
            return Response(data=str(e), status=status.HTTP_404_NOT_FOUND)
        except KeyError:
            return Response(data="bad request", status=status.HTTP_400_BAD_REQUEST)
