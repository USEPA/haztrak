from rest_framework.response import Response
from rest_framework.views import APIView

from apps.trak.models import Manifest
from lib.rcrainfo import rcrainfo
from .serializers import ManifestSerializer


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


class SyncManifest(APIView):

    def get(self, request, mtn=None):
        if mtn:
            return Response(status=200)
        else:
            rcrainfo.get_mtns()
            return Response(data={'test': 'hello'})
