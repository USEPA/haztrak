from http import HTTPStatus

from django.core.exceptions import ObjectDoesNotExist
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import permissions, status
from rest_framework.exceptions import APIException
from rest_framework.generics import GenericAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from apps.trak.models import Handler
from apps.trak.serializers import HandlerSerializer


class HandlerView(GenericAPIView):
    """
    HandlerView  provides https handlers for reading handlers from the haztrak database

    """
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


class HandlerSearch(GenericAPIView):
    queryset = Handler.objects.all()

    @extend_schema(
        description='Search for Transporters saved to the Haztrak database',
        # methods=['POST'],
        request=inline_serializer(name='test',
                                  fields={'epaId': CharField(), 'name': CharField()}),
    )
    def post(self, request):
        try:
            epa_id = self.request.data['epaId']
            name = self.request.data['name']
            if len(epa_id) < 3 and len(name) < 3:
                return Response(status=HTTPStatus.UNPROCESSABLE_ENTITY)
            transporters_queryset = Handler.objects.filter(
                site_type='Transporter').filter(
                epa_id__icontains=epa_id).filter(name__icontains=name)
            data = list(transporters_queryset)
            response = []
            for i in data:
                response.append(HandlerSerializer(i).data)
            return Response(status=HTTPStatus.OK, data=response)
        except KeyError:
            return Response(status=HTTPStatus.BAD_REQUEST)
