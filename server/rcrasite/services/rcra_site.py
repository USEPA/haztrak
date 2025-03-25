"""RcraSiteService houses the (high-level) rcra_site subdomain specific business logic."""

import logging
from typing import TypedDict

from django.core.cache import CacheKeyWarning, cache
from django.db import transaction
from django.db.models import QuerySet
from rest_framework.exceptions import ValidationError

from core.services import RcraClient, get_rcra_client
from rcrasite.models import RcraSite
from rcrasite.serializers import RcraSiteSerializer

from .rcra_site_search import RcraSiteSearch


class HandlerSearchResults(TypedDict):
    """Search results from RCRAInfo."""

    sites: list[RcraSite]


logger = logging.getLogger(__name__)


def query_rcra_sites(
    *,
    epa_id: str | None = None,
    name: str | None = None,
    site_type: str | None = None,
) -> QuerySet[RcraSite]:
    """Query RcraSites from our Database."""
    if site_type == "designatedFacility":
        site_type = "Tsdf"
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
    """RcraSiteService houses the (high-level) rcra_site subdomain specific business logic.

    RcraSiteService's public interface needs to be controlled strictly, public method
    directly relate to use cases.
    """

    def __init__(self, *, username: str, rcrainfo: RcraClient | None = None):
        self.username = username
        self.rcrainfo = rcrainfo or get_rcra_client(username=self.username)

    def pull_rcrainfo_site(self, *, site_id: str) -> RcraSite:
        """Retrieve a site/rcra_site from Rcrainfo and return RcraSiteSerializer."""
        rcra_site_data: dict = self.rcrainfo.get_site(site_id).json()
        return self._update_or_create_rcra_site_from_json(rcra_site_data=rcra_site_data)

    def get_or_pull_rcra_site(self, site_id: str) -> RcraSite:
        """Retrieve a site from the database or pull it from RCRAInfo.

        Or Pull it from RCRAInfo.This may be trying to do too much.
        """
        if RcraSite.objects.filter(epa_id=site_id).exists():
            msg = f"using existing rcra_site {site_id}"
            logger.debug(msg)
            return RcraSite.objects.get(epa_id=site_id)
        new_rcra_site = self.pull_rcrainfo_site(site_id=site_id)
        msg = f"pulled new rcra_site {new_rcra_site}"
        logger.debug(msg)
        return new_rcra_site

    def search_rcrainfo_handlers(self, **search_parameters) -> HandlerSearchResults:
        """Search RCRAInfo for a site by name or EPA ID."""
        search_parameters["epaSiteId"] = search_parameters.get("epaSiteId", "").upper()
        cache_key = (
            f"handlerSearch:epaSiteId:{search_parameters['epaSiteId']}:siteType:"
            f"{search_parameters['siteType']}"
        )
        try:
            data = cache.get(cache_key)
            if not data:
                response = (
                    RcraSiteSearch(rcra_client=self.rcrainfo)
                    .site_type(search_parameters.get("siteType"))
                    .epa_id(search_parameters.get("epaSiteId"))
                    .execute()
                )
                if response.ok:
                    data = response.json()
                    cache.set(cache_key, data, 60 * 60 * 24)
                else:
                    msg = f"Error retrieving data from RCRAInfo: {response.json()}"
                    raise ValidationError(
                        msg,
                    )
        except CacheKeyWarning as exc:
            msg = "Error retrieving data from cache"
            raise ValidationError(msg) from exc
        else:
            return data

    @transaction.atomic
    def _update_or_create_rcra_site_from_json(self, *, rcra_site_data: dict) -> RcraSite:
        serializer = RcraSiteSerializer(data=rcra_site_data)
        serializer.is_valid(raise_exception=True)
        return serializer.save()
