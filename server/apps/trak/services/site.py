from django.db import transaction

from ..models import Handler, Site
from .rcrainfo import RcrainfoService


class SiteService:
    def __init__(self, *, username: str):
        self.username = username
        self.rcrainfo = RcrainfoService(username=username)

    @transaction.atomic
    def sync_site_manifest(self, *, site_id: str):
        """
        Retrieve a site's manifest from Rcrainfo and save to the database.
        """
        response = self.rcrainfo.search_mtn(siteId=site_id, endDate="2022-01-01T01:01:01Z",
                                            startDate="2020-01-01T01:01:01Z", dateType="UpdatedDate")
        print(site_id)
        print(response.json())
        return response

    @transaction.atomic
    def get_or_create_site(self, *, handler: Handler, site_name: str = None) -> Site:
        if site_name is None:
            site_name = handler.name
        if Site.objects.filter(epa_site__epa_id=handler.epa_id).exists():
            site = Site.objects.get(epa_site__epa_id=handler.epa_id)
            return site
        else:
            return Site.objects.create(epa_site=handler, name=site_name)
