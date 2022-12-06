from http import HTTPStatus

from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import permissions
from rest_framework.fields import CharField
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.response import Response

from apps.trak.models import Handler
from apps.trak.serializers import HandlerSerializer


# HandlerView is a DRF generic API view that filters by URL parameters and
# returns a single Handler, or an error
@extend_schema(
    description='Retrieve details on a handler stored in the Haztrak database',
)
class HandlerView(RetrieveAPIView):
    queryset = Handler.objects.all()
    serializer_class = HandlerSerializer
    permission_classes = [permissions.IsAuthenticated]


# ToDo: this is POC source, should be able to replace with ListAPIView
#  https://www.django-rest-framework.org/api-guide/filtering/
class HandlerSearch(GenericAPIView):
    queryset = Handler.objects.all()
    accepted_handler_types = ['any', 'generator', 'transporter', 'tsdf']
    handler_type_key = 'type'
    epa_id_key = 'epaId'
    name_key = 'name'

    @extend_schema(
        description='Search for Transporters saved to the Haztrak database',
        request=inline_serializer(name='test',
                                  fields={handler_type_key: CharField(),
                                          epa_id_key: CharField(),
                                          name_key: CharField()}),
    )
    def post(self, request):
        try:
            # Check if 'type' is in the POST body, and is one of the accepted handler
            # types
            if self.handler_type_key in self.request.data:
                if self.request.data[
                    self.handler_type_key].lower() in self.accepted_handler_types:
                    handler_type = self.request.data[self.handler_type_key].capitalize()
                else:
                    handler_type = 'Any'
            else:
                handler_type = 'Any'
            epa_id = self.request.data[self.epa_id_key]
            name = self.request.data[self.name_key]
            if len(epa_id) < 3 and len(name) < 3:
                return Response(status=HTTPStatus.UNPROCESSABLE_ENTITY)
            if handler_type == 'Any':
                handler_queryset = Handler.objects.filter(
                    epa_id__icontains=epa_id).filter(name__icontains=name)
            else:
                handler_queryset = Handler.objects.filter(
                    site_type=handler_type).filter(
                    epa_id__icontains=epa_id).filter(name__icontains=name)

            data = list(handler_queryset)
            response = []
            for i in data:
                response.append(HandlerSerializer(i).data)
            return Response(status=HTTPStatus.OK, data=response)
        except KeyError:
            return Response(status=HTTPStatus.BAD_REQUEST)
