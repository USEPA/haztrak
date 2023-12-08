import logging

from drf_spectacular.utils import OpenApiResponse, extend_schema, inline_serializer
from rest_framework import serializers, status
from rest_framework.generics import GenericAPIView, ListAPIView, RetrieveAPIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.sites.services import HaztrakSiteService
from apps.trak.models import Manifest
from apps.trak.serializers import ManifestSerializer
from apps.trak.serializers.signature_serializer import QuickerSignSerializer
from apps.trak.services import EManifest, TaskResponse
from apps.trak.services.manifest_services import get_manifests

logger = logging.getLogger(__name__)


@extend_schema(
    responses={
        200: OpenApiResponse(
            response=ManifestSerializer,
            description="Manifest Details",
        )
    },
)
class GetManifestView(RetrieveAPIView):
    """Retrieve a Uniform hazardous waste manifest by the manifest tracking number (MTN)"""

    queryset = Manifest.objects.all()
    lookup_field = "mtn"
    serializer_class = ManifestSerializer


@extend_schema(request=ManifestSerializer)
class CreateManifestView(GenericAPIView):
    """Create a uniform hazardous waste manifest."""

    queryset = None
    serializer_class = ManifestSerializer
    http_method_names = ["post"]

    def post(self, request: Request) -> Response:
        manifest_serializer = self.serializer_class(data=request.data)
        manifest_serializer.is_valid(raise_exception=True)
        emanifest = EManifest(username=str(request.user))
        data = emanifest.create(manifest=manifest_serializer.data)
        return Response(data=data, status=status.HTTP_201_CREATED)


class MtnListView(ListAPIView):
    """List of manifest tracking numbers and select details."""

    class MtnSerializer(serializers.ModelSerializer):
        """Select details of a manifest including manifest tracking number (mtn)."""

        manifestTrackingNumber = serializers.CharField(
            source="mtn",
            required=False,
        )
        # status
        submissionType = serializers.CharField(
            source="submission_type",
            required=False,
        )
        signatureStatus = serializers.BooleanField(
            source="signature_status",
            allow_null=True,
            default=False,
        )

        class Meta:
            model = Manifest
            fields = [
                "manifestTrackingNumber",
                "status",
                "submissionType",
                "signatureStatus",
            ]

    serializer_class = MtnSerializer
    queryset = Manifest.objects.all()

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        return get_manifests(
            username=str(self.request.user),
            epa_id=self.kwargs.get("epa_id", None),
            site_type=self.kwargs.get("site_type", None),
        )


class SignManifestView(GenericAPIView):
    """
    Endpoint to Quicker Sign manifests via an async task
    """

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
class SyncSiteManifestView(APIView):
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
        site = HaztrakSiteService(username=str(request.user))
        data = site.sync_rcrainfo_manifest(**serializer.validated_data)
        return Response(data=data, status=status.HTTP_200_OK)
