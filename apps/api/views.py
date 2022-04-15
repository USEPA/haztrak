from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import ManifestSerializer
from apps.trak.models import Manifest
from rcrainfo import rcrainfo


class ManifestView(APIView):

    def get(self, request, mtn=None):
        if mtn:
            manifest = Manifest.objects.get(manifest_tracking_number=mtn)
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
