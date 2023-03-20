from rest_framework import permissions
from rest_framework.generics import ListAPIView

from apps.trak.models import WasteCode
from apps.trak.serializers import WasteCodeSerializer


class FederalWasteCodes(ListAPIView):
    """
    Endpoint for retrieving EPA Federal waste codes
    """

    serializer_class = WasteCodeSerializer
    queryset = WasteCode.objects.all()
    permission_classes = [permissions.AllowAny]
