from rest_framework import permissions
from rest_framework.generics import RetrieveAPIView

from apps.trak.models import Handler, Transporter
from apps.trak.serializers import (
    ManifestHandlerSerializer,
    TransporterSerializer,
)


class TransporterView(RetrieveAPIView):
    """
    Returns details on a Transporter
    """

    queryset = Transporter.objects.all()
    serializer_class = TransporterSerializer
    permission_classes = [permissions.AllowAny]


class ManifestHandlerView(RetrieveAPIView):
    """
    For Viewing a user's Site Permissions in the same JSON structure as RCRAInfo.

    This is not included in the current URL configs, but kept here for documentation.
    """

    queryset = Handler.objects.all()
    serializer_class = ManifestHandlerSerializer
    permission_classes = [permissions.AllowAny]
