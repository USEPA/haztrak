from http import HTTPStatus

from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.generics import GenericAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from apps.trak.models import Manifest
from apps.trak.serializers import ManifestSerializer
from apps.trak.tasks.manifest_tasks import pull_manifest
from apps.trak.tasks.site_tasks import sync_site_manifests


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


class PullManifest(GenericAPIView):
    """
    This endpoint launches a task to pull a manifest (by MTN) from RCRAInfo.
    On success, returns the task queue ID.
    """
    queryset = None
    response = Response

    def post(self, request: Request) -> Response:
        try:
            mtn = request.data['mtn']
            task = pull_manifest.delay(mtn=mtn, username=str(request.user))
            return self.response(data={'task': task.id}, status=HTTPStatus.OK)
        except KeyError:
            return self.response(data={'error': 'malformed payload'}, status=HTTPStatus.BAD_REQUEST)


class SyncSiteManifest(GenericAPIView):
    """
    This endpoint launches a task to pull a site's manifests that are out of sync with RCRAINfo
    """
    queryset = None
    response = Response

    def post(self, request: Request) -> Response:
        try:
            site_id = request.data['siteId']
            task = sync_site_manifests.delay(site_id=site_id, username=str(request.user))
            return self.response(data={'task': task.id}, status=HTTPStatus.OK)
        except KeyError:
            return self.response(data={'error': 'malformed payload'}, status=HTTPStatus.BAD_REQUEST)
