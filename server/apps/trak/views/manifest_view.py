import logging

from celery.exceptions import TaskError
from celery.result import AsyncResult
from django.db.models import Q
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers, status
from rest_framework.generics import GenericAPIView, ListAPIView, RetrieveAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from apps.core.services import TaskService  # type: ignore
from apps.sites.models import Site  # type: ignore
from apps.trak.models import Manifest  # type: ignore
from apps.trak.serializers import ManifestSerializer, MtnSerializer  # type: ignore
from apps.trak.serializers.signature_ser import QuickerSignSerializer  # type: ignore
from apps.trak.tasks import (  # type: ignore
    create_rcra_manifest,
    pull_manifest,
    sign_manifest,
    sync_site_manifests,
)

logger = logging.getLogger(__name__)


@extend_schema(
    responses={201: ManifestSerializer},
)
class ManifestView(RetrieveAPIView):
    """
    The Uniform hazardous waste manifest by the manifest tracking number (MTN)
    """

    queryset = Manifest.objects.all()
    lookup_field = "mtn"
    serializer_class = ManifestSerializer


class MtnList(ListAPIView):
    """
    MtnList returns select details on a user's manifest,
    """

    serializer_class = MtnSerializer
    queryset = Manifest.objects.all()

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
        try:
            quicker_serializer = self.serializer_class(data=request.data)
            if quicker_serializer.is_valid():
                quicker_serializer.save()
                task = sign_manifest.delay(
                    username=str(request.user), **quicker_serializer.validated_data
                )
                return Response(data={"task": task.id}, status=status.HTTP_200_OK)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except TaskError as exc:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data=exc)


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

    queryset = None

    def post(self, request: Request) -> Response:
        try:
            site_id = request.data["siteId"]
            task = sync_site_manifests.delay(site_id=site_id, username=str(request.user))
            return Response(data={"task": task.id}, status=status.HTTP_200_OK)
        except KeyError:
            return Response(
                data={"error": "malformed payload"}, status=status.HTTP_400_BAD_REQUEST
            )


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
        if manifest_serializer.is_valid():
            logger.debug(
                f"manifest data submitted for creation in RCRAInfo: {manifest_serializer.data}"
            )
            task: AsyncResult = create_rcra_manifest.delay(
                manifest=manifest_serializer.data, username=str(request.user)
            )
            TaskService(task_id=task.id, task_name=task.name).update_task_status("PENDING")
            return Response(data={"taskId": task.id}, status=status.HTTP_201_CREATED)
        else:
            logger.error("manifest_serializer errors: ", manifest_serializer.errors)
            return Response(
                exception=manifest_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )
