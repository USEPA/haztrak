from rest_framework import permissions, viewsets

from apps.trak.models import Manifest
from apps.trak.serializers import ManifestSerializer


class ManifestView(viewsets.ModelViewSet):
    """
    A CRUD operations for Uniform hazardous waste manifest by the manifest tracking
    number (MTN)
    """
    queryset = Manifest.objects.all()
    lookup_field = 'mtn'
    serializer_class = ManifestSerializer
    permission_classes = [permissions.AllowAny]

    # def get_queryset(self):
    #     return Manifest.objects.get(mtn=self.kwargs['mtn'])
    # @extend_schema(
    #     description='The uniform hazardous waste manifest',
    #     request=ManifestSerializer,
    #     responses={201: ManifestSerializer},
    # )
    # def create(self, request):
    #     """Save or create a hazardous waste manifest"""
    #     # your non-standard behaviour
    #     return super().create(request)
