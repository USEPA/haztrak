from drf_spectacular.utils import extend_schema
from rest_framework import permissions, viewsets
from rest_framework.generics import GenericAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from apps.trak.models import Manifest
from apps.trak.serializers import ManifestSerializer
from apps.trak.tasks import sync_site_manifests


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


@extend_schema(
    responses={200: {'blah': 'foo'}},
)
class SyncManifest(GenericAPIView):
    """
    This endpoint launches a task to sync a site's manifests with RCRAInfo
    """
    queryset = None
    response = Response
    permission_classes = [permissions.AllowAny]

    def post(self, request: Request) -> Response:
        print(request.data)
        task = sync_site_manifests.delay()
        return self.response({'task': task.id})
