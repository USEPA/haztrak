import logging

from django.core.exceptions import ObjectDoesNotExist, PermissionDenied
from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions, status
from rest_framework.exceptions import APIException
from rest_framework.generics import get_object_or_404
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.trak.models import Manifest, Site
from apps.trak.serializers import SiteSerializer


class SiteList(generics.ListAPIView):
    """
    SiteList is a ListAPIView that returns haztrak sites that the current
    user has access to.
    """
    serializer_class = SiteSerializer

    def get_queryset(self):
        user = self.request.user
        return Site.objects.filter(sitepermission__profile__user=user)


class SiteApi(generics.RetrieveAPIView):
    """
    View to GET a Haztrak Site, which encapsulates the EPA Handler plus some.
    """
    serializer_class = SiteSerializer
    lookup_url_kwarg = 'epa_id'
    queryset = Site.objects.all()

    def retrieve(self, request, *args, **kwargs):
        epa_id = self.kwargs['epa_id']
        site = get_object_or_404(self.queryset, epa_site__epa_id=epa_id,
                                 sitepermission__profile__user=request.user)
        serializer = SiteSerializer(site)
        return Response(serializer.data)


class SiteManifest(APIView):
    response = Response
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        description='Returns three lists of MTNs, generator, transporter, designated '
                    'facility manifests '
    )
    def get(self, request: Request, epa_id: str = None) -> Response:
        try:
            profile_sites = [str(i) for i in
                             Site.objects.filter(sitepermission__profile__user=request.user)]
            if epa_id not in profile_sites:
                raise PermissionDenied
            tsd_manifests = Manifest.objects.filter(tsd__epa_id=epa_id).values('mtn', 'status')
            gen_manifests = Manifest.objects.filter(tsd__epa_id=epa_id).values('mtn', 'status')
            tran_manifests = Manifest.objects.filter(transporters__handler__epa_id__contains=epa_id).values('mtn',
                                                                                                            'status')
            return self.response(status=status.HTTP_200_OK,
                                 data={'tsd': tsd_manifests,
                                       'generator': gen_manifests,
                                       'transporter': tran_manifests})
        except (APIException, AttributeError) as error:
            logging.warning(error)
            return self.response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except ObjectDoesNotExist:
            return self.response(status=status.HTTP_404_NOT_FOUND,
                                 data={'Error': f'{epa_id} not found'})
