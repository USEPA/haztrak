from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.trak.models import DotOption


class DotIdNumberView(APIView):
    """
    The Uniform hazardous waste manifest by the manifest tracking number (MTN)
    """

    queryset = DotOption.id_numbers.all()

    def get(self, request: Request) -> Response:
        """
        Return a list of all DOT ID numbers
        """
        dot_id_numbers = [
            option.value
            for option in self.queryset.filter(value__icontains=request.query_params.get("id", ""))
        ]
        return Response(data=dot_id_numbers, status=status.HTTP_200_OK)
