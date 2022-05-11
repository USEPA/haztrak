from rest_framework.response import Response
from rest_framework.views import APIView

from apps.trak.models import Handler, Manifest
from lib.rcrainfo import rcrainfo

from .serializers import HandlerSerializer, ManifestSerializer


class ManifestView(APIView):

    def get(self, request, mtn=None):
        if mtn:
            manifest = Manifest.objects.get(manifestTrackingNumber=mtn)
            serializer = ManifestSerializer(manifest)
            return Response({"manifest": serializer.data})
        else:
            manifest = Manifest.objects.all()
            serializer = ManifestSerializer(manifest, many=True)
            return Response({'manifest': serializer.data})


class SyncSiteManifest(APIView):

    def get(self, request, epa_id=None):
        if epa_id:
            resp = rcrainfo.get_mtns(epa_id)
            return Response(data={'mtn': resp.json})
        else:
            return Response(status=200)


class HandlerView(APIView):

    def get(self, request, epa_id=None):
        if epa_id:
            handler = Handler.objects.get(epa_id=epa_id)
            serializer = HandlerSerializer(handler)
            return Response(serializer.data)
