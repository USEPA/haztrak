from django.core.exceptions import ObjectDoesNotExist
from rest_framework import permissions, status
from rest_framework.exceptions import APIException
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.trak.models import Handler, Transporter
from apps.trak.serializers import HandlerSerializer, TransporterSerializer


class HandlerView(APIView):
    response = Response
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: Request, epa_id: str = None) -> Response:
        try:
            if epa_id:
                handler = Handler.objects.get(epa_id=epa_id)
                serializer = HandlerSerializer(handler)
                return self.response(serializer.data)
        except APIException:
            return self.response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except ObjectDoesNotExist:
            return self.response(status=status.HTTP_404_NOT_FOUND,
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
            return self.response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except ObjectDoesNotExist:
            return self.response(status=status.HTTP_404_NOT_FOUND,
                                 data={'Error': f'{tran_id} not found'})
