import logging

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import permissions, serializers, status
from rest_framework.generics import RetrieveAPIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.rcrasite.models import RcraSite
from apps.rcrasite.serializers import RcraSiteSerializer
from apps.rcrasite.services import RcraSiteService
from apps.rcrasite.services.rcra_site_services import query_rcra_sites

logger = logging.getLogger(__name__)


@extend_schema(
    description="Retrieve details on a rcra_site stored in the Haztrak database",
)
class GetRcraSiteView(RetrieveAPIView):
    """Retrieve details on a RCRAInfo Site known to haztrak by their EPA ID number"""

    queryset = RcraSite.objects.all()
    serializer_class = RcraSiteSerializer
    lookup_field = "epa_id__iexact"
    lookup_url_kwarg = "epa_id"
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
class SearchRcraSiteView(APIView):
    """Search for locally saved hazardous waste sites ("Generators", "Transporters", "Tsdf's")"""

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
                "designatedFacility",
                "Generator",
                "generator",
            ],
        )

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
class SearchHandlerView(APIView):
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
        sites = RcraSiteService(username=request.user.username)
        data = sites.search_rcrainfo_handlers(
            epaSiteId=serializer.data["siteId"],
            siteType=handler_types[serializer.data["siteType"]],
        )
        return Response(status=status.HTTP_200_OK, data=data["sites"])
