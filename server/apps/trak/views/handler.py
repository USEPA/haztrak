from drf_spectacular.utils import extend_schema
from rest_framework import permissions
from rest_framework.generics import ListAPIView, RetrieveAPIView

from apps.trak.models import Handler, Transporter
from apps.trak.serializers import HandlerSerializer, TransporterSerializer


@extend_schema(
    description="Retrieve details on a handler stored in the Haztrak database",
)
class HandlerView(RetrieveAPIView):
    """
    HandlerView returns details on a single Handler known to haztrak
    """

    queryset = Handler.objects.all()
    serializer_class = HandlerSerializer
    permission_classes = [permissions.IsAuthenticated]


class HandlerSearch(ListAPIView):
    queryset = Handler.objects.all()
    serializer_class = HandlerSerializer

    def get_queryset(self):
        queryset = Handler.objects.all()
        epa_id_param = self.request.query_params.get("epaId")
        name_param = self.request.query_params.get("siteName")
        site_type_param = self.request.query_params.get("siteType")
        if epa_id_param is not None:
            queryset = queryset.filter(epa_id__contains=epa_id_param)
        if name_param is not None:
            queryset = queryset.filter(name__contains=name_param)
        if site_type_param is not None:
            queryset = queryset.filter(site_type=site_type_param)
        return queryset


class TransporterView(RetrieveAPIView):
    """
    Returns details on a Transporter
    """

    queryset = Transporter.objects.all()
    serializer_class = TransporterSerializer
    permission_classes = [permissions.AllowAny]
