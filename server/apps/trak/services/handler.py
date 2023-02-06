from django.db import transaction

from apps.trak.models import Handler
from apps.trak.serializers import HandlerSerializer
from .rcrainfo import RcrainfoService


class HandlerService:
    def __init__(self, *, username: str):
        self.username = username

    def retrieve_rcra_handler(self, *, site_id: str) -> HandlerSerializer:
        """
        Retrieve a site/handler from Rcrainfo and return HandlerSerializer
        """
        rcrainfo = RcrainfoService(self.username)
        response = rcrainfo.get_site(site_id)
        if response.ok:
            handler_serializer = HandlerSerializer(data=response.json())
            if handler_serializer.is_valid():
                return handler_serializer

    @staticmethod
    @transaction.atomic
    def save_handler_from_json(handler_data: str) -> Handler:
        serializer = HandlerSerializer(data=handler_data)
        if serializer.is_valid():
            new_handler: Handler = serializer.save()
            return new_handler

    def get_or_retrieve_handler(self, site_id: str) -> Handler:
        if Handler.objects.filter(epa_id=site_id).exists():
            return Handler.objects.get(epa_id=site_id)
        else:
            rcrainfo = RcrainfoService(self.username)
            response = rcrainfo.get_site(site_id)
            if response.response.ok:
                return self.save_handler_from_json(response.response.json())
