import logging

from django.core.exceptions import ObjectDoesNotExist, PermissionDenied
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status
from rest_framework.exceptions import APIException
from rest_framework.generics import GenericAPIView, ListAPIView, RetrieveAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from apps.sites.models import RcraSite, RcraSiteType, Site
from apps.sites.serializers import RcraSiteSerializer, SiteSerializer
from apps.trak.models import Manifest
from apps.trak.serializers import MtnSerializer

logger = logging.getLogger(__name__)


class SiteListView(ListAPIView):
    """
    SiteListView is a ListAPIView that returns haztrak sites that the current
    user has access to.
    """

    serializer_class = SiteSerializer

    def get_queryset(self):
        user = self.request.user
        return Site.objects.filter(rcrasitepermission__profile__user=user)


@method_decorator(cache_page(60 * 15), name="dispatch")
class SiteDetailView(RetrieveAPIView):
    """
    View to GET a Haztrak Site, which encapsulates the EPA RcraSite plus some.
    """

    serializer_class = SiteSerializer
    lookup_field = "rcra_site__epa_id"
    lookup_url_kwarg = "epa_id"
    queryset = Site.objects.all()

    def get_queryset(self):
        epa_id = self.kwargs["epa_id"]
        queryset = Site.objects.filter(
            rcra_site__epa_id=epa_id, rcrasitepermission__profile__user=self.request.user
        )
        return queryset


class SiteMtnListView(GenericAPIView):
    """
    Returns a site's manifest tracking numbers (MTN). Rhe MTN are broken down into three lists;
    generator, transporter, designated.Each array contains a list of objects with MTN and select
    details such as status
    """

    response = Response
    serializer_class = MtnSerializer

    def get(self, request: Request, epa_id: str = None) -> Response:
        """GET method rcra_site"""
        try:
            profile_sites = [
                str(i) for i in Site.objects.filter(rcrasitepermission__profile__user=request.user)
            ]
            if epa_id not in profile_sites:
                raise PermissionDenied
            tsdf_manifests = Manifest.objects.filter(tsdf__rcra_site__epa_id=epa_id).values(
                "mtn", "status"
            )
            gen_manifests = Manifest.objects.filter(generator__rcra_site__epa_id=epa_id).values(
                "mtn", "status"
            )
            tran_manifests = Manifest.objects.filter(
                transporters__rcra_site__epa_id__contains=epa_id
            ).values("mtn", "status")
            return self.response(
                status=status.HTTP_200_OK,
                data={
                    "tsdf": tsdf_manifests,
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


@extend_schema(
    description="Retrieve details on a rcra_site stored in the Haztrak database",
)
class RcraSiteView(RetrieveAPIView):
    """
    RcraSiteView returns details on a single RcraSite known to haztrak
    """

    queryset = RcraSite.objects.all()
    serializer_class = RcraSiteSerializer
    permission_classes = [permissions.IsAuthenticated]


class RcraSiteSearchView(ListAPIView):
    queryset = RcraSite.objects.all()
    serializer_class = RcraSiteSerializer

    def get_queryset(self):
        queryset = RcraSite.objects.all()
        epa_id_param = self.request.query_params.get("epaId")
        name_param = self.request.query_params.get("siteName")
        site_type_param: str = self.request.query_params.get("siteType")
        if epa_id_param is not None:
            queryset = queryset.filter(epa_id__icontains=epa_id_param)
        if name_param is not None:
            queryset = queryset.filter(name__icontains=name_param)
        if site_type_param is not None:
            match site_type_param.lower():
                case "transporter":
                    site_type = RcraSiteType.TRANSPORTER.label
                case "designatedfacility":
                    site_type = RcraSiteType.TSDF.label
                case "generator":
                    site_type = RcraSiteType.GENERATOR.label
                case _:
                    logger.warning("siteType query parameter not recognized")
                    site_type = RcraSiteType.GENERATOR.label
            queryset = queryset.filter(site_type=site_type)
        return queryset
