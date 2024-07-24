import logging

from django.core.exceptions import ValidationError
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers, status
from rest_framework.generics import RetrieveAPIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from rcrasite.models import RcraSite
from rcrasite.serializers import RcraSiteSearchSerializer, RcraSiteSerializer
from rcrasite.services import RcraSiteService, query_rcra_sites

logger = logging.getLogger(__name__)


@extend_schema(
    description="Retrieve details on a rcra_site stored in the Haztrak database",
)
class RcraSiteDetailsView(RetrieveAPIView):
    """Retrieve details on a RCRAInfo Site known to haztrak by their EPA ID number"""

    queryset = RcraSite.objects.all()
    serializer_class = RcraSiteSerializer
    lookup_url_kwarg = "epa_id"

    @method_decorator(cache_page(60 * 15))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_object(self):
        try:
            return RcraSite.objects.get_by_epa_id(self.kwargs[self.lookup_url_kwarg])
        except KeyError:
            raise ValidationError(
                {"detail": "The EPA ID parameter is required to retrieve a site"}
            )


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
    """Search for locally saved hazardous waste sites ("Generators", "Transporters", "TSDF")"""

    queryset = RcraSite.objects.all()
    serializer_class = RcraSiteSerializer

    def get(self, request, *args, **kwargs):
        query_params = request.query_params
        serializer = RcraSiteSearchSerializer(data=query_params)
        serializer.is_valid(raise_exception=True)
        rcra_sites = query_rcra_sites(**serializer.validated_data)
        data = self.serializer_class(rcra_sites, many=True).data
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
        siteId = serializers.CharField(
            required=True,
            min_length=2,
        )
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
