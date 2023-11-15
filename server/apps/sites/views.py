import logging

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import permissions, serializers, status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.sites.models import HaztrakSite, RcraSite, RcraSiteType  # type: ignore
from apps.sites.serializers import HaztrakSiteSerializer, RcraSiteSerializer  # type: ignore
from apps.sites.services import RcraSiteService  # type: ignore
from apps.sites.services.rcra_site_services import query_rcra_sites

logger = logging.getLogger(__name__)


class SiteListView(ListAPIView):
    """
    SiteListView is a ListAPIView that returns haztrak sites that the current
    user has access to.
    """

    serializer_class = HaztrakSiteSerializer

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        user = self.request.user
        return HaztrakSite.objects.filter(sitepermissions__profile__user=user)


@method_decorator(cache_page(60 * 15), name="dispatch")
class SiteDetailView(RetrieveAPIView):
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

    @method_decorator(cache_page(60 * 15))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


@extend_schema(
    responses=RcraSiteSerializer(many=True),
    request=inline_serializer(
        "handler_search",
        fields={
            "epaId": serializers.CharField(),
            "siteName": serializers.CharField(),
            "siteType": serializers.CharField(),
        },
    ),
)
class RcraSiteSearchView(APIView):
    """
    Search for locally saved hazardous waste sites ("Generators", "Transporters", "Tsdf's")
    """

    queryset = RcraSite.objects.all()
    serializer_class = RcraSiteSerializer

    class RcraSiteSearchSerializer(serializers.Serializer):
        epaId = serializers.CharField(required=False, source="epa_id")
        siteName = serializers.CharField(required=False, source="name")
        siteType = serializers.ChoiceField(
            required=False,
            source="site_type",
            choices=[
                "transporter",
                "Transporter",
                "Tsdf",
                "tsdf",
                "Generator",
                "generator",
            ],
        )

    # @method_decorator(cache_page(60 * 15))
    def get(self, request, *args, **kwargs):
        query_params = request.query_params
        serializer = self.RcraSiteSearchSerializer(data=query_params)
        serializer.is_valid(raise_exception=True)
        rcra_sites = query_rcra_sites(**serializer.validated_data)
        data = RcraSiteSerializer(rcra_sites, many=True).data
        return Response(data, status=status.HTTP_200_OK)


handler_types = {
    "designatedFacility": "Tsdf",
    "generator": "Generator",
    "transporter": "Transporter",
    "broker": "Broker",
}


@extend_schema(
    responses=RcraSiteSerializer(many=True),
    request=inline_serializer(
        "handler_search",
        fields={
            "siteId": serializers.CharField(),
            "siteType": serializers.ChoiceField(
                choices=[
                    ("designatedFacility", "designatedFacility"),
                    ("generator", "generator"),
                    ("transporter", "transporter"),
                    ("broker", "broker"),
                ]
            ),
        },
    ),
)
class HandlerSearchView(APIView):
    """Search and return a list of Hazardous waste handlers from RCRAInfo."""

    class HandlerSearchSerializer(serializers.Serializer):
        siteId = serializers.CharField(required=True)
        siteType = serializers.ChoiceField(
            required=True,
            choices=[
                ("designatedFacility", "designatedFacility"),
                ("generator", "generator"),
                ("transporter", "transporter"),
                ("broker", "broker"),
            ],
        )

    def post(self, request: Request) -> Response:
        serializer = self.HandlerSearchSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        print("hello")
        sites = RcraSiteService(username=request.user.username)
        data = sites.search_rcrainfo_handlers(
            epaSiteId=serializer.data["siteId"],
            siteType=handler_types[serializer.data["siteType"]],
        )
        return Response(status=status.HTTP_200_OK, data=data["sites"])
