import logging

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.org.models import TrakOrg
from apps.org.serializers import TrakOrgSerializer
from apps.org.services import get_org_by_id, get_org_sites
from apps.site.serializers import TrakSiteSerializer

logger = logging.getLogger(__name__)


class TrakOrgSitesListView(APIView):
    """Retrieve a list of sites for a given Org"""

    @method_decorator(cache_page(60 * 15))
    def get(self, request, *args, **kwargs):
        haztrak_sites = get_org_sites(self.kwargs["org_id"])
        serializer = TrakSiteSerializer(haztrak_sites, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class TrakOrgDetailsView(RetrieveAPIView):
    """Retrieve details for a given Org"""

    serializer_class = TrakOrgSerializer
    queryset = TrakOrg.objects.all()
    lookup_url_kwarg = "org_id"

    @method_decorator(cache_page(60 * 15))
    def get(self, request, *args, **kwargs):
        org = get_org_by_id(self.kwargs["org_id"])
        serializer = TrakOrgSerializer(org)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
