import logging

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response

from apps.org.models import Org
from apps.org.serializers import TrakOrgSerializer
from apps.org.services import get_org_by_id

logger = logging.getLogger(__name__)


class OrgDetailsView(RetrieveAPIView):
    """Retrieve details for a given Org"""

    serializer_class = TrakOrgSerializer
    queryset = Org.objects.all()
    lookup_url_kwarg = "org_id"

    @method_decorator(cache_page(60 * 15))
    def get(self, request, *args, **kwargs):
        org = get_org_by_id(self.kwargs["org_id"])
        serializer = TrakOrgSerializer(org)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
