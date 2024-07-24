import logging

from drf_spectacular.utils import OpenApiResponse, extend_schema, inline_serializer
from rest_framework import mixins, serializers, status, viewsets
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.site.services import sync_site_manifest_with_rcrainfo
from handler.serializers import QuickerSignSerializer
from manifest.models import Manifest
from manifest.serializers import ManifestSerializer, MtnSerializer
from manifest.services import (
    EManifest,
    TaskResponse,
    create_manifest,
    get_manifests,
    save_emanifest,
    update_manifest,
)

logger = logging.getLogger(__name__)


class ManifestViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin, mixins.CreateModelMixin):
    """Local CRUD operations for HazTrak manifests"""

    lookup_field = "mtn"
    allowed_methods = ["GET", "POST", "PUT"]
    queryset = Manifest.objects.all()
    serializer_class = ManifestSerializer
    lookup_regex = "[0-9]{9}[a-zA-Z]{3}"

    @extend_schema(request=ManifestSerializer)
    def create(self, request: Request) -> Response:
        """Create a HazTrak hazardous waste manifest."""
        manifest_serializer = self.serializer_class(data=request.data)
        manifest_serializer.is_valid(raise_exception=True)
        manifest = create_manifest(
            username=str(request.user), data=manifest_serializer.validated_data
        )
        data = ManifestSerializer(manifest).data
        return Response(data=data, status=status.HTTP_201_CREATED)

    def update(self, request: Request, mtn: str) -> Response:
        """Update a HazTrak hazardous waste manifest."""
        manifest_serializer = self.serializer_class(data=request.data)
        manifest_serializer.is_valid(raise_exception=True)
        manifest = update_manifest(
            username=str(request.user), mtn=mtn, data=manifest_serializer.validated_data
        )
        data = ManifestSerializer(manifest).data
        return Response(data=data, status=status.HTTP_200_OK)

    @extend_schema(
        responses={
            200: OpenApiResponse(
                response=ManifestSerializer,
                description="Manifest Details",
            )
        },
    )
    def retrieve(self, request, *args, **kwargs):
        """Retrieve a HazTrak hazardous waste manifest."""
        return super().retrieve(request, *args, **kwargs)


@extend_schema(request=ManifestSerializer)
class ElectronicManifestSaveView(GenericAPIView):
    """Save a manifest to RCRAInfo."""

    queryset = None
    serializer_class = ManifestSerializer
    http_method_names = ["post"]

    def post(self, request: Request) -> Response:
        manifest_serializer = self.serializer_class(data=request.data)
        manifest_serializer.is_valid(raise_exception=True)
        data = save_emanifest(username=str(request.user), data=manifest_serializer.data)
        return Response(data=data, status=status.HTTP_201_CREATED)


class MtnListView(ListAPIView):
    """List of manifest tracking numbers and select details. Filter by EPA ID and site type."""

    serializer_class = MtnSerializer
    queryset = Manifest.objects.all()

    def get_queryset(self):
        return get_manifests(
            username=str(self.request.user),
            epa_id=self.kwargs.get("epa_id", None),
            site_type=self.kwargs.get("site_type", None),
        )


class ElectronicManifestSignView(GenericAPIView):
    """Endpoint to Quicker Sign manifests via an async task."""

    serializer_class = QuickerSignSerializer
    queryset = None

    def post(self, request: Request) -> Response:
        """
        Accepts a Quicker Sign JSON object in the request body,
        parses the request data, and passes data to a celery async task.
        """
        quicker_serializer = self.serializer_class(data=request.data)
        quicker_serializer.is_valid(raise_exception=True)
        signature = quicker_serializer.save()
        emanifest = EManifest(username=str(request.user))
        data: TaskResponse = emanifest.sign(signature=signature)
        return Response(data=data, status=status.HTTP_200_OK)


@extend_schema(
    request=inline_serializer(
        "site_manifest_sync_request", fields={"siteId": serializers.CharField()}
    ),
    responses=inline_serializer(
        "site_manifest_sync_response", fields={"task": serializers.CharField()}
    ),
)
class SiteManifestSyncView(APIView):
    """
    Pull a site's manifests that are out of sync with RCRAInfo.
    It returns the task id of the long-running background task which can be used to poll
    for status.
    """

    class SyncSiteManifestSerializer(serializers.Serializer):
        siteId = serializers.CharField(source="site_id")

    def post(self, request: Request) -> Response:
        serializer = self.SyncSiteManifestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = sync_site_manifest_with_rcrainfo(
            username=request.user.username, **serializer.validated_data
        )
        return Response(data=data, status=status.HTTP_200_OK)
