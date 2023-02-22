import logging
from logging import Logger

from django.db import transaction

from apps.trak.models import RcraProfile, Site, SitePermission
from apps.trak.serializers import EpaPermissionSerializer
from apps.trak.services import HandlerService, RcrainfoService, SiteService


# ToDo, may be better to have a service level module exception.
class RcraServiceError(Exception):
    """Exception for errors specific to the RcraProfileService"""

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


class RcraProfileService:
    """
    RcraProfileService encapsulates the RcraProfile subdomain business logic
    of a and exposes method corresponding to use cases.
    """

    def __init__(self, *, username: str, rcrainfo: RcrainfoService = None, logger: Logger = None):
        self.username = username
        self.profile, created = RcraProfile.objects.get_or_create(user__username=self.username)
        if rcrainfo is not None:
            self.rcrainfo = rcrainfo
        else:
            self.rcrainfo = RcrainfoService(api_username=self.username)
        if logger:
            self.logger = logger
        else:
            self.logger = logging.getLogger(__name__)

    @property
    def can_access_rcrainfo(self) -> bool:
        """
        Whether the service has a RcrainfoService class associated with it that can access RCRAInfo
        """
        if self.rcrainfo is not None:
            return True
        return False

    def pull_rcra_profile(self, *, username: str = None):
        """
        This high level function makes several requests to RCRAInfo to pull...
        1. A user's site permissions, it creates a SitePermission for each
        2. For each site permission, it pulls the handler details, and creates or updates
         a Handler instance for each
        3. If a Haztrak Site is not present, create one
        """
        try:
            handler_service = HandlerService(username=self.username, rcrainfo=self.rcrainfo)
            site_service = SiteService(username=self.username, rcrainfo=self.rcrainfo)
            if username:
                user_to_update: str = username
            else:
                user_to_update = self.username
            user_profile_response = self.rcrainfo.get_user_profile(username=user_to_update)
            permissions = self._parse_rcra_response(rcra_response=user_profile_response)
            for site_permission in permissions:
                handler = handler_service.get_or_pull_handler(site_permission["siteId"])
                site = site_service.create_or_update_site(handler=handler)
                self._create_or_update_rcra_permission(epa_permission=site_permission, site=site)

        except (RcraProfile.DoesNotExist, Site.DoesNotExist) as exc:
            raise Exception(exc)

    @staticmethod
    def _parse_rcra_response(*, rcra_response: dict) -> list:
        permissions = []
        for permission_json in rcra_response["users"][0]["sites"]:
            permissions.append(permission_json)
        return permissions

    @transaction.atomic
    def _create_or_update_rcra_permission(
        self, *, epa_permission: dict, site: Site
    ) -> SitePermission:
        permission_serializer = EpaPermissionSerializer(data=epa_permission)
        if permission_serializer.is_valid():
            return SitePermission.objects.update_or_create(
                **permission_serializer.validated_data, site=site, profile=self.profile
            )
        raise Exception("Error Attempting to create SitePermission")
