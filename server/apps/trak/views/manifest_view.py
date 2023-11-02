import logging
from datetime import timezone

from celery.exceptions import TaskError
from celery.result import AsyncResult
from django.db.models import Q
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers, status
from rest_framework.generics import GenericAPIView, ListAPIView, RetrieveAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from apps.core.services import TaskService  # type: ignore
from apps.sites.models import Site  # type: ignore
from apps.sites.services import SiteService
from apps.trak.models import Manifest  # type: ignore
from apps.trak.serializers import ManifestSerializer, MtnSerializer  # type: ignore
from apps.trak.serializers.signature_ser import QuickerSignSerializer  # type: ignore
from apps.trak.services import ManifestService
from apps.trak.services.manifest_service import TaskResponse
from apps.trak.tasks import (  # type: ignore
    pull_manifest,
    save_rcrainfo_manifest,
    sign_manifest,
    sync_site_manifests,
)

logger = logging.getLogger(__name__)


@extend_schema(
    responses={200: ManifestSerializer},
)
class ManifestView(RetrieveAPIView):
    """
    The Uniform hazardous waste manifest by the manifest tracking number (MTN)
    """

    queryset = Manifest.objects.all()
    lookup_field = "mtn"
    serializer_class = ManifestSerializer

    @method_decorator(cache_page(60 * 15))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class MtnList(ListAPIView):
    """
    MtnList returns select details on a user's manifest,
    """

    serializer_class = MtnSerializer
    queryset = Manifest.objects.all()

    @method_decorator(cache_page(60 * 15))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        epa_id = self.kwargs.get("epa_id", None)
        if epa_id is None:
            sites = [
                str(i)
                for i in Site.objects.filter(rcrasitepermission__profile__user=self.request.user)
            ]
        else:
            sites = [i.rcra_site.epa_id for i in Site.objects.filter(rcra_site__epa_id=epa_id)]

        return Manifest.objects.filter(
            Q(generator__rcra_site__epa_id__in=sites) | Q(tsdf__rcra_site__epa_id__in=sites)
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
        manifest = ManifestService(username=str(request.user))
        data: TaskResponse = manifest.sign_manifests(
            signature_data=quicker_serializer.validated_data
        )
        return Response(data=data, status=status.HTTP_200_OK)


@extend_schema(
    request=inline_serializer(
        "site_manifest_sync_request", fields={"siteId": serializers.CharField()}
    ),
    responses=inline_serializer(
        "site_manifest_sync_response", fields={"task": serializers.CharField()}
    ),
)
class SyncSiteManifestView(GenericAPIView):
    """
    Pull a site's manifests that are out of sync with RCRAInfo.
    It returns the task id of the long-running background task which can be used to poll
    for status.
    """

    class SyncSiteManifestSerializer(serializers.Serializer):
        siteId = serializers.CharField(source="site_id")

    queryset = None

    def post(self, request: Request) -> Response:
        serializer = self.SyncSiteManifestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        site = SiteService(username=str(request.user))
        data = site.sync_rcrainfo_manifest(**serializer.validated_data)
        return Response(data=data, status=status.HTTP_200_OK)


@extend_schema(request=ManifestSerializer)
class CreateRcraManifestView(GenericAPIView):
    """
    A proxy endpoint used to create electronic manifest(s) in RCRAInfo/e-Manifest
    """

    queryset = None
    serializer_class = ManifestSerializer
    http_method_names = ["post"]

    def post(self, request: Request) -> Response:
        manifest_serializer = self.serializer_class(data=request.data)
        manifest_serializer.is_valid(raise_exception=True)
        manifest = ManifestService(username=str(request.user))
        data = manifest.create_manifest(manifest=manifest_serializer.data)
        return Response(data=data, status=status.HTTP_201_CREATED)
