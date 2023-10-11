from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.trak.models import DotOption


class DotBaseView(APIView):
    queryset = DotOption.objects.all()

    def get(self, request: Request) -> Response:
        """
        Base API View for retrieving static DOT data used to build DOT shipping
        descriptions on the manifest.
        """
        dot_id_numbers = [
            option.value
            for option in self.queryset.filter(value__icontains=request.query_params.get("q", ""))
        ]
        return Response(data=dot_id_numbers, status=status.HTTP_200_OK)


class DotIdNumberView(DotBaseView):
    """
    Return a list of DOT ID numbers, optionally filtered by a query parameter
    """

    queryset = DotOption.id_numbers.all()


class DotShippingNameView(DotBaseView):
    """
    Return a list of DOT Proper Shipping Names, optionally filtered by a query parameter
    """

    queryset = DotOption.shipping_names.all()


class DotHazardClassView(DotBaseView):
    """
    Return a list of DOT Hazard classes, optionally filtered by a query parameter
    """

    queryset = DotOption.hazard_classes.all()
