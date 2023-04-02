import logging
from typing import Dict

from django.db import transaction
from rest_framework.exceptions import ValidationError

from apps.core.services import RcrainfoService
from apps.sites.models import EpaSite
from apps.sites.serializers import EpaSiteSerializer


class EpaSiteService:
    """
    EpaSiteService houses the (high-level) epa_site subdomain specific business logic.
    EpaSiteService's public interface needs to be controlled strictly, public method
    directly relate to use cases.
    """

    def __init__(self, *, username: str, rcrainfo: RcrainfoService = None):
        self.username = username
        self.rcrainfo = rcrainfo or RcrainfoService(api_username=self.username)
        self.logger = logging.getLogger(__name__)

    def __repr__(self):
        return (
            f"<{self.__class__.__name__}(api_username='{self.username}', "
            f"rcrainfo='{self.rcrainfo}')>"
        )

    def pull_epa_site(self, *, site_id: str) -> EpaSite:
        """
        Retrieve a site/epa_site from Rcrainfo and return EpaSiteSerializer
        """
        epa_site_data: Dict = self.rcrainfo.get_site(site_id).json()
        epa_site_serializer: EpaSiteSerializer = self._deserialize_epa_site(
            epa_site_data=epa_site_data
        )
        return self._create_or_update_epa_site(epa_site_data=epa_site_serializer.validated_data)

    def get_or_pull_epa_site(self, site_id: str) -> EpaSite:
        """
        Retrieves an epa_site from the database or Pull it from RCRAInfo.
        This may be trying to do too much
        """
        if EpaSite.objects.filter(epa_id=site_id).exists():
            self.logger.debug(f"using existing epa_site {site_id}")
            return EpaSite.objects.get(epa_id=site_id)
        new_epa_site = self.pull_epa_site(site_id=site_id)
        self.logger.debug(f"pulled new epa_site {new_epa_site}")
        return new_epa_site

    def _deserialize_epa_site(self, *, epa_site_data: dict) -> EpaSiteSerializer:
        serializer = EpaSiteSerializer(data=epa_site_data)
        if serializer.is_valid():
            return serializer
        self.logger.error(serializer.errors)
        raise ValidationError(serializer.errors)

    @transaction.atomic
    def _create_or_update_epa_site(self, *, epa_site_data: dict) -> EpaSite:
        epa_id = epa_site_data.get("epa_id")
        if EpaSite.objects.filter(epa_id=epa_id).exists():
            epa_site = EpaSite.objects.get(epa_id=epa_id)
            return epa_site
        epa_site = EpaSite.objects.save(**epa_site_data)
        return epa_site
