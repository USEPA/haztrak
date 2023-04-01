from drf_spectacular.utils import extend_schema
from rest_framework import permissions
from rest_framework.generics import ListAPIView, RetrieveAPIView

from apps.sites.models import EpaSite
from apps.trak.serializers import EpaSiteSerializer


@extend_schema(
    description="Retrieve details on a epa_site stored in the Haztrak database",
)
class EpaSiteView(RetrieveAPIView):
    """
    EpaSiteView returns details on a single EpaSite known to haztrak
    """

    queryset = EpaSite.objects.all()
    serializer_class = EpaSiteSerializer
    permission_classes = [permissions.IsAuthenticated]


class EpaSiteSearchView(ListAPIView):
    queryset = EpaSite.objects.all()
    serializer_class = EpaSiteSerializer

    def get_queryset(self):
        queryset = EpaSite.objects.all()
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
