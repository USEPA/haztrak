from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from drf_spectacular.utils import (
    OpenApiExample,
    OpenApiParameter,
    OpenApiResponse,
    extend_schema,
    inline_serializer,
)
from rest_framework import serializers, status
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.trak.models import DotLookup, WasteCode
from apps.trak.serializers import WasteCodeSerializer
from apps.trak.services import get_dot_hazard_classes, get_dot_id_numbers, get_dot_shipping_names


class FederalWasteCodesView(ListAPIView):
    """
    Endpoint for retrieving EPA Federal waste codes
    """

    serializer_class = WasteCodeSerializer
    queryset = WasteCode.federal.all()

    @method_decorator(cache_page(60 * 15 * 24))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class StateWasteCodesView(ListAPIView):
    """
    Endpoint for retrieving State waste codes
    """

    serializer_class = WasteCodeSerializer
    queryset = WasteCode.state.all()
    lookup_url_kwarg = "state_id"
    lookup_field = "state_id"

    @method_decorator(cache_page(60 * 15 * 24))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        try:
            state_id = self.kwargs["state_id"]
            return WasteCode.state.filter(state_id=state_id)
        except KeyError:
            raise ValueError("State ID is required")


@extend_schema(
    parameters=[
        OpenApiParameter(name="q", description="Query", type=str),
    ],
    responses={
        200: OpenApiResponse(
            serializers.ListSerializer(child=serializers.CharField()),
            description="ID Numbers",
            examples=[
                OpenApiExample(
                    "ID Numbers",
                    value="ID8000",
                )
            ],
        )
    },
)
class DotIdNumberView(APIView):
    """Return a list of DOT ID numbers, optionally filtered by a query parameter"""

    queryset = DotLookup.id_numbers.all()

    @method_decorator(cache_page(60 * 15 * 24))
    def get(self, request, *args, **kwargs):
        query = request.query_params.get("q", "")
        data = get_dot_id_numbers(query)
        return Response(data=data, status=status.HTTP_200_OK)


@extend_schema(
    parameters=[
        OpenApiParameter(name="q", description="Query", type=str),
    ],
    responses={
        200: OpenApiResponse(
            serializers.ListSerializer(child=serializers.CharField()),
            description="Shipping Names",
            examples=[
                OpenApiExample(
                    "Shipping Name",
                    value="1,1,12-Tetrafluoroethane",
                )
            ],
        )
    },
)
class DotShippingNameView(APIView):
    """Return a list of DOT Proper Shipping Names, optionally filtered by a query parameter"""

    queryset = DotLookup.shipping_names.all()

    @method_decorator(cache_page(60 * 15 * 24))
    def get(self, request, *args, **kwargs):
        query = request.query_params.get("q", "")
        data = get_dot_shipping_names(query)
        return Response(data=data, status=status.HTTP_200_OK)


@extend_schema(
    parameters=[
        OpenApiParameter(name="q", description="Query", type=str),
    ],
    responses={
        200: OpenApiResponse(
            serializers.ListSerializer(child=serializers.CharField()),
            description="Hazard Classes",
            examples=[
                OpenApiExample(
                    "Query for 1.1A",
                    value="1.1A",
                )
            ],
        )
    },
)
class DotHazardClassView(APIView):
    """Return a list of DOT Hazard classes, optionally filtered by a query parameter"""

    queryset = DotLookup.hazard_classes.all()

    @method_decorator(cache_page(60 * 15 * 24))
    def get(self, request, *args, **kwargs):
        query = request.query_params.get("q", "")
        data = get_dot_hazard_classes(query)
        return Response(data=data, status=status.HTTP_200_OK)
