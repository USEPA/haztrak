import logging

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response

from apps.site.models import TrakSite
from apps.site.serializers import TrakSiteSerializer

logger = logging.getLogger(__name__)


class TrakSiteListView(ListAPIView):
    """that returns haztrak sites that the current user has access to."""

    serializer_class = TrakSiteSerializer

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        user = self.request.user
        return TrakSite.objects.filter_by_user(user)


@method_decorator(cache_page(60 * 15), name="dispatch")
class TrakSiteDetailsView(RetrieveAPIView):
    """View details of a Haztrak Site, which encapsulates the EPA RcraSite plus some."""

    serializer_class = TrakSiteSerializer
    lookup_url_kwarg = "epa_id"
    queryset = TrakSite.objects.all()

    @method_decorator(cache_page(60 * 15))
    def get(self, request, *args, **kwargs):
        try:
            site = TrakSite.objects.get_user_site_by_epa_id(
                request.user, self.kwargs.get("epa_id")
            )
            data = self.serializer_class(site).data
            return Response(data, status=status.HTTP_200_OK)
        except TrakSite.DoesNotExist as e:
            return Response(data=str(e), status=status.HTTP_404_NOT_FOUND)
