import logging

from django.core.exceptions import ObjectDoesNotExist, PermissionDenied
from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status, generics
from rest_framework.exceptions import APIException
from rest_framework.generics import get_object_or_404
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import Profile
from apps.trak.models import Manifest, Site, Transporter
from apps.trak.serializers import SiteSerializer


class SiteList(generics.ListAPIView):
    """SiteList returns haztrak sites that a user has access to"""
    serializer_class = SiteSerializer

    def get_queryset(self):
        user = self.request.user
        return Profile.objects.get(user=user).epa_sites.all()


class SiteApi(generics.RetrieveAPIView):
    """Haztrak Site encompasses EPA and haztrak relevant information on a location"""
    serializer_class = SiteSerializer
    lookup_url_kwarg = 'epa_id'

    def retrieve(self, request, *args, **kwargs):
        queryset = Site.objects.all()
        epa_id = self.kwargs['epa_id']
        site = get_object_or_404(queryset, epa_site__epa_id=epa_id)
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
                             Profile.objects.get(user=request.user).epa_sites.all()]
            if epa_id not in profile_sites:
                raise PermissionDenied
            tsd_manifests = [str(i) for i in
                             Manifest.objects.filter(tsd__epa_id=epa_id)]
            gen_manifests = [str(i) for i in
                             Manifest.objects.filter(generator__epa_id=epa_id)]
            tran_manifests = [str(i) for i in
                              Transporter.objects.filter(epa_id=epa_id).values_list(
                                  'manifest__mtn', flat=True)]
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
