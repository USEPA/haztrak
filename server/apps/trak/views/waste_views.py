from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.trak.models import DotLookup, WasteCode
from apps.trak.serializers import DotOptionSerializer, WasteCodeSerializer
from apps.trak.services.waste_services import get_dot_shipping_names


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


class DotBaseView(APIView):
    queryset = DotLookup.objects.all()

    def get(self, request: Request, *args, **kwargs) -> Response:
        """
        Base API View for retrieving static DOT data used to build DOT shipping
        descriptions on the manifest.
        """
        dot_id_numbers = [
            option.value
            for option in self.queryset.filter(value__icontains=request.query_params.get("q", ""))[
                0:100
            ]
        ]
        return Response(data=dot_id_numbers, status=status.HTTP_200_OK)


class DotIdNumberView(DotBaseView):
    """
    Return a list of DOT ID numbers, optionally filtered by a query parameter
    """

    queryset = DotLookup.id_numbers.all()

    @method_decorator(cache_page(60 * 15 * 24))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class DotShippingNameView(APIView):
    """
    Return a list of DOT Proper Shipping Names, optionally filtered by a query parameter
    """

    queryset = DotLookup.shipping_names.all()

    @method_decorator(cache_page(60 * 15 * 24))
    def get(self, request, *args, **kwargs):
        query = request.query_params.get("q", "")
        data = get_dot_shipping_names(query)
        return Response(data=data, status=status.HTTP_200_OK)


class DotHazardClassView(DotBaseView):
    """
    Return a list of DOT Hazard classes, optionally filtered by a query parameter
    """

    queryset = DotLookup.hazard_classes.all()

    @method_decorator(cache_page(60 * 15 * 24))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
