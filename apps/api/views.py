import http

from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import APIException
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.trak.models import Handler, Manifest, Transporter
from lib.rcrainfo import rcrainfo

from .serializers import (HandlerSerializer, ManifestSerializer,
                          TransporterSerializer)


class ManifestView(APIView):
    response = Response

    def get(self, request: Request, mtn: str = None) -> Response:
        try:
            if mtn:
                manifest = Manifest.objects.get(mtn=mtn)
                serializer = ManifestSerializer(manifest)
                return self.response(serializer.data)
            else:
                manifest = Manifest.objects.all()
                serializer = ManifestSerializer(manifest, many=True)
                return self.response(serializer.data)
        except APIException:
            return self.response(status=http.HTTPStatus.INTERNAL_SERVER_ERROR,
                                 data=APIException)
        except ObjectDoesNotExist:
            return self.response(status=http.HTTPStatus.NOT_FOUND,
                                 data={'Error': f'{mtn} not found'})

    def post(self, request: Request, mtn: str = None) -> Response:
        if not mtn:
            return self.response(status=400)
        else:
            serializer = ManifestSerializer(data=request.data)
            valid = serializer.is_valid()
            if valid:
                serializer.save()
                return self.response(status=200)
            else:
                return self.response(status=500)


# trash to be fixed, can't be bothered to remove it right now
class SyncSiteManifest(APIView):
    response = Response

    def get(self, request: Request, epa_id: str = None) -> Response:
        if epa_id:
            resp = rcrainfo.get_mtns(epa_id)
            return Response(data={'mtn': resp.json})
        else:
            return self.response(status=200)


class HandlerView(APIView):
    response = Response

    def get(self, request: Request, epa_id: str = None) -> Response:
        try:
            if epa_id:
                handler = Handler.objects.get(epa_id=epa_id)
                serializer = HandlerSerializer(handler)
                return self.response(serializer.data)
        except APIException:
            return self.response(status=http.HTTPStatus.INTERNAL_SERVER_ERROR)
        except ObjectDoesNotExist:
            return self.response(status=http.HTTPStatus.NOT_FOUND,
                                 data={'Error': f'{epa_id} not found'})


class TransporterView(APIView):
    response = Response

    def get(self, request: Request, tran_id: int = None) -> Response:
        try:
            if tran_id:
                transporter = Transporter.objects.get(id=tran_id)
                serializer = TransporterSerializer(transporter)
                return self.response(serializer.data)
        except APIException:
            return self.response(status=http.HTTPStatus.INTERNAL_SERVER_ERROR)
        except ObjectDoesNotExist:
            return self.response(status=http.HTTPStatus.NOT_FOUND,
                                 data={'Error': f'{tran_id} not found'})
