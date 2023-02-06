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
        ToDo:
        Retrieve a site's manifest from Rcrainfo and save to the database.
        """
        response = self.rcrainfo.get_manifest(site_id)
        return response

    @transaction.atomic
    def add_site_to_profile(self, username: str = None):
        pass

    @transaction.atomic
    def get_or_create_site(self, *, handler: Handler, site_name: str = None) -> Site:
        if site_name is None:
            site_name = handler.name
        if Site.objects.filter(epa_site__epa_id=handler.epa_id).exists():
            site = Site.objects.get(epa_site__epa_id=handler.epa_id)
            return site
        else:
            return Site.objects.create(epa_site=handler, name=site_name)
