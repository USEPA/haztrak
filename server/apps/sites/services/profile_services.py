import logging
from typing import Optional

from django.db import transaction

from apps.core.services import RcrainfoService  # type: ignore
from apps.sites.models import RcraSitePermission, Site  # type: ignore
from apps.sites.serializers import RcraPermissionSerializer  # type: ignore

from ...core.models import RcraProfile  # type: ignore
from .site_services import RcraSiteService, SiteService, SiteServiceError  # type: ignore

logger = logging.getLogger(__name__)


class RcraProfileServiceError(Exception):
    """Exception for errors specific to the RcraProfileService"""

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


class RcraProfileService:
    """
    RcraProfileService encapsulates the RcraProfile subdomain business logic
    of a and exposes method corresponding to use cases.
    """

    def __init__(self, *, username: str, rcrainfo: Optional[RcrainfoService] = None):
        self.username = username
        self.profile, created = RcraProfile.objects.get_or_create(user__username=self.username)
        self.rcrainfo = rcrainfo or RcrainfoService(api_username=self.username)

    @property
    def can_access_rcrainfo(self) -> bool:
        """
        Whether the service has a RcrainfoService class associated with it that can access RCRAInfo
        """
        if self.rcrainfo is not None:
            return True
        return False

    def __repr__(self):
        return (
            f"<{self.__class__.__name__}(username='{self.username}', rcrainfo='{self.rcrainfo}')>"
        )

    def pull_rcra_profile(self, *, username: Optional[str] = None) -> None:
        """
        This high level function makes several requests to RCRAInfo to pull...
        1. A user's rcrainfo site permissions, it creates a RcraSitePermission for each
        2. For each rcra site permission, it pulls the rcra_site details, and creates or updates
         a RcraSite instance for each
        3. If a Haztrak Site is not present, create one
        """
        try:
            if username is None:
                username = self.username
            profile_response = self.rcrainfo.get_user_profile(username=username)
            permissions = self._parse_rcra_response(rcra_response=profile_response.json())
            self._update_profile_permissions(permissions)
        except (RcraProfile.DoesNotExist, Site.DoesNotExist) as exc:
            raise RcraProfileServiceError(exc)

    def _update_profile_permissions(self, permissions: list[dict]):
        """
        This function creates or updates a user's RcraSitePermission for each site permission
        :param permissions: body of response from RCRAInfo
        :return: None
        """
        try:
            handler = RcraSiteService(username=self.username, rcrainfo=self.rcrainfo)
            haztrak_site = SiteService(username=self.username, rcrainfo=self.rcrainfo)
            for rcra_site_permission in permissions:
                rcra_site = handler.get_or_pull_rcra_site(rcra_site_permission["siteId"])
                site = haztrak_site.create_or_update_site(rcra_site=rcra_site)
                self._create_or_update_rcra_permission(
                    epa_permission=rcra_site_permission, site=site
                )
        except SiteServiceError as exc:
            raise RcraProfileServiceError(f"Error creating or updating Haztrak Site {exc}")
        except KeyError as exc:
            raise RcraProfileServiceError(f"Error parsing RCRAInfo response: {str(exc)}")

    @staticmethod
    def _parse_rcra_response(*, rcra_response: dict) -> list:
        try:
            permissions = []
            for permission_json in rcra_response["users"][0]["sites"]:
                permissions.append(permission_json)
            return permissions
        except KeyError as exc:
            raise RcraProfileServiceError(f"Error parsing RCRAInfo response: {str(exc)}")

    @transaction.atomic
    def _create_or_update_rcra_permission(
        self, *, epa_permission: dict, site: Site
    ) -> RcraSitePermission:
        permission_serializer = RcraPermissionSerializer(data=epa_permission)
        if permission_serializer.is_valid():
            obj, created = RcraSitePermission.objects.update_or_create(
                **permission_serializer.validated_data, site=site, profile=self.profile
            )
            return obj
        raise RcraProfileServiceError(
            f"Error creating instance of RcraSitePermission {permission_serializer.errors}"
        )
