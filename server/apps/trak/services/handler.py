from django.db import transaction

from apps.trak.models import Handler
from apps.trak.serializers import HandlerSerializer
from .rcrainfo import RcrainfoService


class HandlerService:
    def __init__(self, *, username: str):
        self.username = username

    def retrieve_rcra_handler(self, *, site_id: str) -> HandlerSerializer:
        """
        Retrieve a site/handler from Rcrainfo and save to the database.
        """
        rcrainfo = RcrainfoService(self.username)
        response = rcrainfo.get_site(site_id)
        if response.ok:
            handler_serializer = HandlerSerializer(data=response.json())
            if handler_serializer.is_valid():
                return handler_serializer

    @staticmethod
    @transaction.atomic
    def save_handler(handler_data) -> Handler:
        serializer = HandlerSerializer(data=handler_data)
        if serializer.is_valid():
            new_handler: Handler = serializer.save()
            return new_handler
