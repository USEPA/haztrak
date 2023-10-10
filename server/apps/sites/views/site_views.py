import logging

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from apps.sites.models import RcraSite, RcraSiteType, Site  # type: ignore
from apps.sites.serializers import RcraSiteSerializer, SiteSerializer  # type: ignore
from apps.sites.services import RcraSiteService  # type: ignore

logger = logging.getLogger(__name__)


class SiteListView(ListAPIView):
    """
    SiteListView is a ListAPIView that returns haztrak sites that the current
    user has access to.
    """

    serializer_class = SiteSerializer

    def get_queryset(self):
        user = self.request.user
        return Site.objects.filter(rcrasitepermission__profile__user=user)


@method_decorator(cache_page(60 * 15), name="dispatch")
class SiteDetailView(RetrieveAPIView):
    """
    View to GET a Haztrak Site, which encapsulates the EPA RcraSite plus some.
    """

    serializer_class = SiteSerializer
    lookup_field = "rcra_site__epa_id"
    lookup_url_kwarg = "epa_id"
    queryset = Site.objects.all()

    def get_queryset(self):
        epa_id = self.kwargs["epa_id"]
        queryset = Site.objects.filter(
            rcra_site__epa_id=epa_id, rcrasitepermission__profile__user=self.request.user
        )
        return queryset


@extend_schema(
    description="Retrieve details on a rcra_site stored in the Haztrak database",
)
class RcraSiteView(RetrieveAPIView):
    """
    RcraSiteView returns details on a single RcraSite known to haztrak
    """

    queryset = RcraSite.objects.all()
    serializer_class = RcraSiteSerializer
    permission_classes = [permissions.IsAuthenticated]


class SiteSearchView(ListAPIView):
    """
    Search for locally saved hazardous waste sites ("Generators", "Transporters", "Tsdf's")
    """

    queryset = RcraSite.objects.all()
    serializer_class = RcraSiteSerializer

    def get_queryset(self):
        queryset = RcraSite.objects.all()
        epa_id_param = self.request.query_params.get("epaId")
        name_param = self.request.query_params.get("siteName")
        site_type_param: str = self.request.query_params.get("siteType")
        if epa_id_param is not None:
            queryset = queryset.filter(epa_id__icontains=epa_id_param)
        if name_param is not None:
            queryset = queryset.filter(name__icontains=name_param)
        if site_type_param is not None:
            match site_type_param.lower():
                case "transporter":
                    site_type = RcraSiteType.TRANSPORTER.label
                case "designatedfacility":
                    site_type = RcraSiteType.TSDF.label
                case "generator":
                    site_type = RcraSiteType.GENERATOR.label
                case _:
                    logger.warning("siteType query parameter not recognized")
                    site_type = RcraSiteType.GENERATOR.label
            queryset = queryset.filter(site_type=site_type)
        return queryset


handler_types = {
    "designatedFacility": "Tsdf",
    "generator": "Generator",
    "transporter": "Transporter",
    "broker": "Broker",
}


@api_view(["POST"])
def rcrainfo_site_search_view(request: Request):
    """
    Search and return a list of sites from RCRAInfo.
    """
    try:
        site_service = RcraSiteService(username=request.user.username)
        data = site_service.search_rcra_site(
            epaSiteId=request.data["siteId"], siteType=handler_types[request.data["siteType"]]
        )
        return Response(status=status.HTTP_200_OK, data=data["sites"])
    except KeyError:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    except ValidationError:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
