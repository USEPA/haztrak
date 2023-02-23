import logging
from logging import Logger
from typing import Dict

from django.db import transaction
from rest_framework.exceptions import ValidationError

from apps.trak.models import Handler
from apps.trak.serializers import HandlerSerializer

from .rcrainfo import RcrainfoService


class HandlerService:
    """
    HandlerService houses the (high-level) handler subdomain specific business logic.
    HandlerService's public interface needs to be controlled strictly, public method
    directly relate to use cases.
    """

    def __init__(self, *, username: str, rcrainfo: RcrainfoService = None, logger: Logger = None):
        self.username = username
        if rcrainfo is not None:
            self.rcrainfo = rcrainfo
        else:
            self.rcrainfo = RcrainfoService(api_username=self.username)
        if logger:
            self.logger = logger
        else:
            self.logger = logging.getLogger(__name__)

    def pull_rcra_handler(self, *, site_id: str) -> Handler:
        """
        Retrieve a site/handler from Rcrainfo and return HandlerSerializer
        """
        handler_data: Dict = self._pull_handler(site_id=site_id)
        handler_serializer: HandlerSerializer = self._deserialize_handler(
            handler_data=handler_data
        )
        return self._create_or_update_handler(handler_data=handler_serializer.validated_data)

    def get_or_pull_handler(self, site_id: str) -> Handler:
        """
        Retrieves a handler from the database or Pull it from RCRAInfo.
        This may be trying to do too much
        """
        if Handler.objects.filter(epa_id=site_id).exists():
            self.logger.debug(f"using existing handler {site_id}")
            return Handler.objects.get(epa_id=site_id)
        new_handler = self.pull_rcra_handler(site_id=site_id)
        self.logger.debug(f"pulled new handler {new_handler}")
        return new_handler

    def _pull_handler(self, *, site_id: str) -> Dict:
        """
        Pull a handler's information from RCRAInfo.
        """
        # In contrast to EPA, we reserve the term "site" for handlers that the user has access to
        response = self.rcrainfo.get_site(site_id)
        if not response.ok:
            self.logger.warning(response.response.json())
        return response.json()

    def _deserialize_handler(self, *, handler_data: dict) -> HandlerSerializer:
        serializer = HandlerSerializer(data=handler_data)
        if serializer.is_valid():
            return serializer
        self.logger.error(serializer.errors)
        raise ValidationError(serializer.errors)

    @transaction.atomic
    def _create_or_update_handler(self, *, handler_data: dict) -> Handler:
        epa_id = handler_data.get("epa_id")
        if Handler.objects.filter(epa_id=epa_id).exists():
            handler = Handler.objects.get(epa_id=epa_id)
            return handler
        handler = Handler.objects.create_handler(**handler_data)
        return handler
