from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from drf_spectacular.utils import (
    OpenApiExample,
    OpenApiParameter,
    OpenApiResponse,
    extend_schema,
)
from rest_framework import serializers, status
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.wasteline.models import DotLookup, WasteCode
from apps.wasteline.serializers import WasteCodeSerializer
from apps.wasteline.services import (
    filter_dot_hazard_classes,
    filter_dot_id_numbers,
    filter_dot_shipping_names,
    get_state_waste_codes,
)


class FederalWasteCodesView(ListAPIView):
    """Retrieve a list EPA Federal waste codes"""

    serializer_class = WasteCodeSerializer
    queryset = WasteCode.federal.all()

    @method_decorator(cache_page(60 * 15 * 24))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class StateWasteCodesView(ListAPIView):
    """Retrieve a list state waste codes by state ID"""

    serializer_class = WasteCodeSerializer
    queryset = WasteCode.state.all()
    lookup_url_kwarg = "state_id"

    @method_decorator(cache_page(60 * 15 * 24))
    def get(self, request, *args, **kwargs):
        try:
            state_id = self.kwargs["state_id"]
            state_code_data = get_state_waste_codes(state_id)
            serializer = WasteCodeSerializer(state_code_data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response(data=str(e), status=status.HTTP_422_UNPROCESSABLE_ENTITY)


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
        id_numbers = filter_dot_id_numbers(query)
        return Response(data=id_numbers, status=status.HTTP_200_OK)


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
        shipping_names = filter_dot_shipping_names(query)
        return Response(data=shipping_names, status=status.HTTP_200_OK)


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
        dot_classes = filter_dot_hazard_classes(query)
        return Response(data=dot_classes, status=status.HTTP_200_OK)
