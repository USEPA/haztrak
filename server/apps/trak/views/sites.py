import logging

from django.core.exceptions import ObjectDoesNotExist, PermissionDenied
from django.http import Http404
from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions, status
from rest_framework.exceptions import APIException
from rest_framework.generics import get_object_or_404
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.trak.models import Manifest, RcraProfile, Site, Transporter
from apps.trak.serializers import SiteSerializer


class SiteList(generics.ListAPIView):
    """
    SiteList is a ListAPIView that returns haztrak sites that the current
    user has access to.
    """
    serializer_class = SiteSerializer

    def get_queryset(self):
        user = self.request.user
        return RcraProfile.objects.get(user=user).epa_sites.all()


class SiteApi(generics.RetrieveAPIView):
    """
    View to GET a Haztrak Site, which encapsulates the EPA Handler plus some.
    """
    serializer_class = SiteSerializer
    lookup_url_kwarg = 'epa_id'
    queryset = Site.objects.all()

    def retrieve(self, request, *args, **kwargs):
        profile = RcraProfile.objects.get(user=self.request.user)
        site_ids = [str(i) for i in profile.epa_sites.all()]
        epa_id = self.kwargs['epa_id']
        if epa_id not in site_ids:
            raise Http404
        site = get_object_or_404(self.queryset, epa_site__epa_id=epa_id)
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
                             RcraProfile.objects.get(user=request.user).epa_sites.all()]
            if epa_id not in profile_sites:
                raise PermissionDenied
            tsd_manifests = [str(i) for i in
                             Manifest.objects.filter(tsd__epa_id=epa_id)]
            gen_manifests = [str(i) for i in
                             Manifest.objects.filter(generator__epa_id=epa_id)]
            tran_manifests = [str(i) for i in
                              Transporter.objects.filter(handler__epa_id=epa_id).values_list(
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
