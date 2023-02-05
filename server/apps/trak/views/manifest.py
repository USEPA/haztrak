from drf_spectacular.utils import extend_schema
from rest_framework import viewsets

from apps.trak.models import Manifest
from apps.trak.serializers import ManifestSerializer


@extend_schema(
    responses={201: ManifestSerializer},
)
class ManifestView(viewsets.ModelViewSet):
    """
    The Uniform hazardous waste manifest by the manifest tracking number (MTN)
    """
    queryset = Manifest.objects.all()
    lookup_field = 'mtn'
    serializer_class = ManifestSerializer
    # permission_classes = [permissions.AllowAny] # uncomment for debugging via (browsable API)
