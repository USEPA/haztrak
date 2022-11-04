from drf_spectacular.utils import extend_schema
from rest_framework import viewsets

from apps.trak.models import Manifest
from apps.trak.serializers import ManifestSerializer


class ManifestView(viewsets.ModelViewSet):
    """Uniform hazardous waste manifest by manifest tracking number (MTN)"""
    queryset = Manifest.objects.all()
    lookup_field = 'mtn'
    serializer_class = ManifestSerializer

    @extend_schema(
        description='blah',
        request=ManifestSerializer,
        responses={201: ManifestSerializer},
    )
    def create(self, request):
        """Save or create a hazardous waste manifest"""
        # your non-standard behaviour
        return super().create(request)
