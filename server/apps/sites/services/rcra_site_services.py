import logging
from typing import Dict, Optional, TypedDict

from django.core.cache import CacheKeyWarning, cache
from django.db import transaction
from django.db.models import QuerySet
from rest_framework.exceptions import ValidationError

from apps.core.services import RcrainfoService, get_rcrainfo_client
from apps.sites.models import RcraSite
from apps.sites.serializers import RcraSiteSerializer


class HandlerSearchResults(TypedDict):
    sites: list[RcraSite]


logger = logging.getLogger(__name__)


def query_rcra_sites(
    *, epa_id: Optional[str] = None, name: Optional[str] = None, site_type: Optional[str] = None
) -> QuerySet[RcraSite]:
    """Query RcraSites from our Database"""
    queryset: QuerySet[RcraSite] = RcraSite.objects.all()
    if epa_id is not None:
        queryset = queryset.filter(epa_id__icontains=epa_id)
    if name is not None:
        queryset = queryset.filter(name__icontains=name)
    if site_type is not None:
        queryset = queryset.filter(site_type__iexact=site_type)
    return queryset


class RcraSiteService:
    """
    RcraSiteService houses the (high-level) rcra_site subdomain specific business logic.
    RcraSiteService's public interface needs to be controlled strictly, public method
    directly relate to use cases.
    """

    def __init__(self, *, username: str, rcrainfo: Optional[RcrainfoService] = None):
        self.username = username
        self.rcrainfo = rcrainfo or get_rcrainfo_client(username=self.username)

    def __repr__(self):
        return (
            f"<{self.__class__.__name__}(api_username='{self.username}', "
            f"rcrainfo='{self.rcrainfo}')>"
        )

    def pull_rcrainfo_site(self, *, site_id: str) -> RcraSite:
        """Retrieve a site/rcra_site from Rcrainfo and return RcraSiteSerializer"""
        rcra_site_data: Dict = self.rcrainfo.get_site(site_id).json()
        return self._update_or_create_rcra_site_from_json(rcra_site_data=rcra_site_data)

    def get_or_pull_rcra_site(self, site_id: str) -> RcraSite:
        """
        Retrieves a rcra_site from the database or Pull it from RCRAInfo.
        This may be trying to do too much
        """
        if RcraSite.objects.filter(epa_id=site_id).exists():
            logger.debug(f"using existing rcra_site {site_id}")
            return RcraSite.objects.get(epa_id=site_id)
        new_rcra_site = self.pull_rcrainfo_site(site_id=site_id)
        logger.debug(f"pulled new rcra_site {new_rcra_site}")
        return new_rcra_site

    def search_rcrainfo_handlers(self, **search_parameters) -> HandlerSearchResults:
        """Search RCRAInfo for a site by name or EPA ID"""
        search_parameters["epaSiteId"] = search_parameters.get("epaSiteId", "").upper()
        cache_key = (
            f'handlerSearch:epaSiteId:{search_parameters["epaSiteId"]}:siteType:'
            f'{search_parameters["siteType"]}'
        )
        try:
            data = cache.get(cache_key)
            if not data:
                response = self.rcrainfo.search_sites(**search_parameters)
                if response.ok:
                    data = response.json()
                    cache.set(cache_key, data, 60 * 60 * 24)
                else:
                    raise ValidationError(
                        f"Error retrieving data from RCRAInfo: {response.json()}"
                    )
            return data
        except CacheKeyWarning:
            raise ValidationError("Error retrieving data from cache")

    @transaction.atomic
    def _update_or_create_rcra_site_from_json(self, *, rcra_site_data: dict) -> RcraSite:
        serializer = RcraSiteSerializer(data=rcra_site_data)
        serializer.is_valid(raise_exception=True)
        return serializer.save()
