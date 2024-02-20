import logging
from typing import Optional

from django.db import transaction

from apps.core.services import (
    RcrainfoService,
    get_rcrainfo_client,
)
from apps.profile.services import get_or_create_profile
from apps.rcrasite.models import RcraSite
from apps.rcrasite.serializers import RcrainfoSitePermissionsSerializer
from apps.site.services import TrakSiteServiceError

from ...profile.models import RcrainfoProfile, RcrainfoSiteAccess
from .rcra_site_services import RcraSiteService

logger = logging.getLogger(__name__)


def get_or_create_rcra_profile(*, username: str) -> tuple[RcrainfoProfile, bool]:
    """Retrieve a user's RcrainfoProfile"""
    profile, created = RcrainfoProfile.objects.get_or_create(
        haztrak_profile__user__username=username
    )
    if created:
        haztrak_profile, created = get_or_create_profile(username=username)
        haztrak_profile.rcrainfo_profile = profile
        haztrak_profile.save()
    return profile, created


class RcraProfileServiceError(Exception):
    """Exception for errors specific to the RcraProfileService"""

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


class RcraProfileService:
    """
    RcraProfileService encapsulates the RcrainfoProfile subdomain business logic
    of a and exposes method corresponding to use cases.
    """

    def __init__(self, *, username: str, rcrainfo: Optional[RcrainfoService] = None):
        self.username = username
        profile, created = get_or_create_rcra_profile(username=username)
        self.profile: RcrainfoProfile = profile
        self.rcrainfo = rcrainfo or get_rcrainfo_client(username=username)

    def update_rcrainfo_profile(self, *, rcrainfo_username: Optional[str] = None) -> None:
        """
        This high level function makes several requests to RCRAInfo to pull...
        1. A user's rcrainfo site permissions, it creates a RcraSitePermissions for each
        2. For each rcra site permission, it pulls the rcra_site details, and creates or updates
         a RcraSite instance for each
        3. If a Haztrak Site is not present, create one
        """
        try:
            if rcrainfo_username is None:
                rcrainfo_username = self.profile.rcra_username
            profile_response = self.rcrainfo.get_user_rcrainfo_profile(
                rcrainfo_username=rcrainfo_username
            )
            permissions = self._parse_rcra_response(rcra_response=profile_response.json())
            self._save_rcrainfo_profile_permissions(permissions)
        except (RcrainfoProfile.DoesNotExist, RcraSite.DoesNotExist) as exc:
            raise RcraProfileServiceError(exc)

    def _save_rcrainfo_profile_permissions(self, permissions: list[dict]) -> None:
        """
        This function creates or updates a user's RcraSitePermissions for each site permission
        :param permissions: body of response from RCRAInfo
        :return: None
        """
        try:
            handler = RcraSiteService(username=self.username, rcrainfo=self.rcrainfo)
            for rcra_site_permission in permissions:
                rcra_site = handler.get_or_pull_rcra_site(rcra_site_permission["siteId"])
                self._create_or_update_rcra_permission(
                    epa_permission=rcra_site_permission, site=rcra_site
                )
        except TrakSiteServiceError as exc:
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
        self, *, epa_permission: dict, site: RcraSite
    ) -> RcrainfoSiteAccess:
        permission_serializer = RcrainfoSitePermissionsSerializer(data=epa_permission)
        if permission_serializer.is_valid():
            obj, created = RcrainfoSiteAccess.objects.update_or_create(
                **permission_serializer.validated_data, site=site, profile=self.profile
            )
            return obj
        raise RcraProfileServiceError(
            f"Error creating instance of RcraSitePermissions {permission_serializer.errors}"
        )
