from django.db import transaction

from apps.trak.models import Handler
from apps.trak.serializers import HandlerSerializer

from .rcrainfo import RcrainfoService


class HandlerService:
    def __init__(self, *, username: str):
        self.username = username

    def pull_handler(self, *, site_id: str) -> HandlerSerializer:
        """
        Retrieve a site/handler from Rcrainfo and return HandlerSerializer
        """
        rcrainfo = RcrainfoService(username=self.username)
        response = rcrainfo.get_site(site_id)
        if response.ok:
            handler_serializer = HandlerSerializer(data=response.json())
            if handler_serializer.is_valid():
                return handler_serializer

    def _save_handler_from_json(self, *, handler_data: str) -> Handler:
        serializer = HandlerSerializer(data=handler_data)
        if serializer.is_valid():
            return self._create_or_update_handler(
                handler_data=serializer.validated_data)

    @transaction.atomic
    def _create_or_update_handler(self, *, handler_data: dict) -> Handler:
        handler_epa_id = handler_data.get('epa_id')
        if Handler.objects.filter(epa_id=handler_epa_id).exists():
            return Handler.objects.get(epa_id=handler_epa_id)
        else:
            return Handler.objects.create_with_related(**handler_data)

    def get_or_retrieve_handler(self, site_id: str) -> Handler:
        if Handler.objects.filter(epa_id=site_id).exists():
            return Handler.objects.get(epa_id=site_id)
        else:
            rcrainfo = RcrainfoService(username=self.username)
            response = rcrainfo.get_site(site_id)
            if response.response.ok:
                return self._save_handler_from_json(
                    handler_data=response.response.json())
