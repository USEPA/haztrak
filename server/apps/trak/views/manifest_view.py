import logging
from http import HTTPStatus

from celery.exceptions import TaskError
from django.db.models import Q
from drf_spectacular.utils import extend_schema
from rest_framework import permissions, viewsets
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from apps.trak.models import Manifest, Site
from apps.trak.serializers import ManifestSerializer, MtnSerializer
from apps.trak.serializers.signature_ser import QuickerSignSerializer
from apps.trak.tasks import pull_manifest, sign_manifest

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
    permission_classes = [permissions.AllowAny]  # uncomment for debugging via (browsable API)


class PullManifest(GenericAPIView):
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
            return self.response(data={"task": task.id}, status=HTTPStatus.OK)
        except KeyError:
            return self.response(
                data={"error": "malformed payload"}, status=HTTPStatus.BAD_REQUEST
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
                for i in Site.objects.filter(sitepermission__profile__user=self.request.user)
            ]
        else:
            sites = [str(i) for i in Site.objects.filter(epa_site__epa_id=epa_id)]

        logger.info(sites)
        return Manifest.objects.filter(
            Q(generator__handler__epa_id__in=sites) | Q(tsd__handler__epa_id__in=sites)
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
                return Response(data={"task": task.id}, status=HTTPStatus.OK)
            return Response(status=HTTPStatus.BAD_REQUEST)
        except TaskError as exc:
            return Response(status=HTTPStatus.INTERNAL_SERVER_ERROR, data=exc)
