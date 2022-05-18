from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.trak.models import Handler, Manifest
from lib.rcrainfo import rcrainfo

from .serializers import HandlerSerializer, ManifestSerializer


class ManifestView(APIView):

    def get(self, request: Request, mtn: str = None) -> Response:
        if mtn:
            manifest = Manifest.objects.get(mtn=mtn)
            serializer = ManifestSerializer(manifest)
            return Response(serializer.data)
        else:
            manifest = Manifest.objects.all()
            serializer = ManifestSerializer(manifest, many=True)
            return Response(serializer.data)

    def post(self, request: Request, mtn: str = None) -> Response:
        if not mtn:
            return Response(status=400)
        else:
            serializer = ManifestSerializer(data=request.data)
            valid = serializer.is_valid()
            if valid:
                serializer.save()
                return Response(status=200)
            else:
                return Response(status=500)


class SyncSiteManifest(APIView):

    def get(self, request: Request, epa_id: str = None) -> Response:
        if epa_id:
            resp = rcrainfo.get_mtns(epa_id)
            return Response(data={'mtn': resp.json})
        else:
            return Response(status=200)


class HandlerView(APIView):

    def get(self, request: Request, epa_id: str = None) -> Response:
        if epa_id:
            handler = Handler.objects.get(epa_id=epa_id)
            serializer = HandlerSerializer(handler)
            return Response(serializer.data)
