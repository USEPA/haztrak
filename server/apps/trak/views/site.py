from http import HTTPStatus
from logging import getLogger

from django.core.exceptions import ObjectDoesNotExist, PermissionDenied
from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.generics import ListAPIView, RetrieveAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.trak.models import Manifest, Site
from apps.trak.serializers import SiteSerializer
from apps.trak.tasks import sync_site_manifests

logger = getLogger(__name__)


class SiteList(ListAPIView):
    """
    SiteList is a ListAPIView that returns haztrak sites that the current
    user has access to.
    """

    serializer_class = SiteSerializer

    def get_queryset(self):
        user = self.request.user
        return Site.objects.filter(sitepermission__profile__user=user)


class SiteApi(RetrieveAPIView):
    """
    View to GET a Haztrak Site, which encapsulates the EPA Handler plus some.
    """

    serializer_class = SiteSerializer
    lookup_url_kwarg = "epa_id"
    queryset = Site.objects.all()

    def retrieve(self, request, *args, **kwargs):
        epa_id = self.kwargs["epa_id"]
        site = get_object_or_404(
            self.queryset, epa_site__epa_id=epa_id, sitepermission__profile__user=request.user
        )
        serializer = SiteSerializer(site)
        return Response(serializer.data)


class SiteManifest(APIView):
    """
    Returns a site's manifest tracking numbers (MTN). Rhe MTN are broken down into three lists;
    generator, transporter, designated.Each array contains a list of objects with MTN and select
    details such as status
    """

    response = Response
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, epa_id: str = None) -> Response:
        """GET method handler"""
        try:
            profile_sites = [
                str(i) for i in Site.objects.filter(sitepermission__profile__user=request.user)
            ]
            if epa_id not in profile_sites:
                raise PermissionDenied
            tsd_manifests = Manifest.objects.filter(tsd__epa_id=epa_id).values("mtn", "status")
            gen_manifests = Manifest.objects.filter(generator__epa_id=epa_id).values(
                "mtn", "status"
            )
            tran_manifests = Manifest.objects.filter(
                transporters__handler__epa_id__contains=epa_id
            ).values("mtn", "status")
            return self.response(
                status=status.HTTP_200_OK,
                data={
                    "tsd": tsd_manifests,
                    "generator": gen_manifests,
                    "transporter": tran_manifests,
                },
            )
        except (APIException, AttributeError) as error:
            logger.warning(error)
            return self.response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except ObjectDoesNotExist:
            return self.response(
                status=status.HTTP_404_NOT_FOUND, data={"Error": f"{epa_id} not found"}
            )


class SyncSiteManifest(APIView):
    """
    This endpoint launches a task to pull a site's manifests that are out of sync with RCRAInfo
    """

    queryset = None
    permission_classes = [IsAuthenticated]
    response = Response

    def post(self, request: Request) -> Response:
        """POST method handler"""
        try:
            site_id = request.data["siteId"]
            task = sync_site_manifests.delay(site_id=site_id, username=str(request.user))
            return self.response(data={"task": task.id}, status=HTTPStatus.OK)
        except KeyError:
            return self.response(
                data={"error": "malformed payload"}, status=HTTPStatus.BAD_REQUEST
            )
