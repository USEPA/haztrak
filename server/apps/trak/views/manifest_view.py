import logging

from celery.exceptions import TaskError
from django.db.models import Q
from drf_spectacular.utils import extend_schema
from rest_framework import status, viewsets
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from apps.sites.models import Site
from apps.trak.models import Manifest
from apps.trak.serializers import ManifestSerializer, MtnSerializer
from apps.trak.serializers.signature_ser import QuickerSignSerializer
from apps.trak.tasks import pull_manifest, sign_manifest, sync_site_manifests

logger = logging.getLogger(__name__)


@extend_schema(
    responses={201: ManifestSerializer},
)
class ManifestView(viewsets.ModelViewSet):
    """
    The Uniform hazardous waste manifest by the manifest tracking number (MTN)
    """

    queryset = Manifest.objects.all()
    lookup_field = "mtn"
    serializer_class = ManifestSerializer


class PullManifestView(GenericAPIView):
    """
    This endpoint launches a task to pull a manifest (by MTN) from RCRAInfo.
    On success, returns the task queue ID.
    """

    queryset = None
    response = Response

    def post(self, request: Request) -> Response:
        try:
            mtn = request.data["mtn"]
            task = pull_manifest.delay(mtn=mtn, username=str(request.user))
            return self.response(data={"task": task.id}, status=status.HTTP_200_OK)
        except KeyError:
            return self.response(
                data={"error": "malformed payload"}, status=status.HTTP_400_BAD_REQUEST
            )


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

        logger.info(sites)
        return Manifest.objects.filter(
            Q(generator__rcra_site__epa_id__in=sites) | Q(tsdf__rcra_site__epa_id__in=sites)
        )


class SignManifestView(GenericAPIView):
    """
    Endpoint to Quicker Sign manifests via an async task
    """

    serializer_class = QuickerSignSerializer
    queryset = None
    response = Response

    def post(self, request: Request) -> Response:
        """
        Accepts a Quicker Sign JSON object in the request body,
        parses the request data, and passes data to a celery async task.
        """
        try:
            quicker_serializer = self.serializer_class(data=request.data)
            if quicker_serializer.is_valid():
                quicker_serializer.save()
                # Use (json serializable) keyword args when handing off to celery
                task = sign_manifest.delay(
                    username=str(request.user), **quicker_serializer.validated_data
                )
                return Response(data={"task": task.id}, status=status.HTTP_200_OK)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except TaskError as exc:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data=exc)


class SyncSiteManifestView(GenericAPIView):
    """
    This endpoint launches a task to pull a site's manifests that are out of sync with RCRAInfo
    """

    queryset = None
    response = Response

    def post(self, request: Request) -> Response:
        """POST method rcra_site"""
        try:
            site_id = request.data["siteId"]
            task = sync_site_manifests.delay(site_id=site_id, username=str(request.user))
            return self.response(data={"task": task.id}, status=status.HTTP_200_OK)
        except KeyError:
            return self.response(
                data={"error": "malformed payload"}, status=status.HTTP_400_BAD_REQUEST
            )


class CreateRcraManifestView(GenericAPIView):
    """
    This is a proxy endpoint used to create electronic manifest(s) in RCRAInfo/e-Manifest
    """

    queryset = None
    response = Response

    def post(self, request: Request) -> Response:
        """The Body of the POST request should contain the complete and valid manifest object"""
        # ToDo: Validate the manifest object
        print("request.data: ", request.data)
        # task = save_manifest.delay(manifest_json=request.data)
        return self.response(data={"task": "scaffold"}, status=status.HTTP_201_CREATED)
