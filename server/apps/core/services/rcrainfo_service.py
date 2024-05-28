import logging
from typing import Literal, Optional

import emanifest
from django.db import IntegrityError
from emanifest import RcrainfoClient, RcrainfoResponse

from apps.org.models import Org
from apps.profile.models import RcrainfoProfile
from apps.wasteline.models import WasteCode

logger = logging.getLogger(__name__)


class RcrainfoService(RcrainfoClient):
    """
    RcrainfoService is our IO interface for communicating with the EPA RCRAInfo
    web services.
    """

    datetime_format = "%Y-%m-%dT%H:%M:%S.%f%z"

    def __init__(
        self,
        *,
        rcra_profile: Optional[RcrainfoProfile] = None,
        api_id: Optional[str] = None,
        api_key: Optional[str] = None,
        rcrainfo_env: Optional[Literal["preprod"] | Literal["prod"]] = None,
        **kwargs,
    ):
        self.profile: RcrainfoProfile | None = rcra_profile
        self.api_id: str | None = api_id
        self.api_key: str | None = api_key
        self.rcrainfo_env: str = rcrainfo_env or "preprod"
        base_url = (
            emanifest.RCRAINFO_PROD if self.rcrainfo_env == "prod" else emanifest.RCRAINFO_PREPROD
        )
        super().__init__(base_url, api_id=api_id, api_key=api_key, **kwargs)

    @property
    def has_rcrainfo_credentials(self) -> bool:
        """returns boolean if the assigned API user has credentials"""
        try:
            return self.profile.has_rcrainfo_api_id_key
        except AttributeError:
            return self.api_id is not None and self.api_key is not None

    def __repr__(self):
        return f"<{self.__class__.__name__}" f"rcrainfo_env='{self.rcrainfo_env}')>"

    def retrieve_id(self, api_id=None) -> str:
        """Override RcrainfoClient method to retrieve API ID for authentication"""
        if self.has_rcrainfo_credentials:
            return super().retrieve_id(self.api_id or self.profile.rcra_api_id)
        return super().retrieve_key()

    def retrieve_key(self, api_key=None) -> str:
        """Override RcrainfoClient method to retrieve API key to authentication"""
        if self.has_rcrainfo_credentials:
            return super().retrieve_key(self.api_key or self.profile.rcra_api_key)
        return super().retrieve_key()

    def get_user_rcrainfo_profile(
        self, rcrainfo_username: Optional[str] = None
    ) -> RcrainfoResponse:
        """
        Retrieve a user's site permissions from RCRAInfo, It expects the
        haztrak user to have their unique RCRAInfo user and API credentials in their
        RcrainfoProfile
        """
        return self.search_users(userId=rcrainfo_username)

    def sync_federal_waste_codes(self):
        """
        Pull all federal waste codes from RCRAInfo and save

        We only create waste codes, they are not removed if a waste code was eliminated in the regs
        """
        response = self.get_fed_waste_codes()
        for federal_code in response.json():
            try:
                WasteCode.federal.create(code_type=WasteCode.CodeType.FEDERAL, **federal_code)
            except IntegrityError:
                # If a waste code already exists
                WasteCode.federal.update(code_type=WasteCode.CodeType.FEDERAL, **federal_code)
                pass

    def sign_manifest(self, **sign_data):
        """
        Utilizes RcraInfo's Quicker Sign endpoint to electronically sign manifest(s)
        we override the e-Manifest package's sign_manifest function to validate inputs.
        """
        sign_data = {k: v for k, v in sign_data.items() if v is not None}
        return super().sign_manifest(**sign_data)

    def __bool__(self):
        """
        This Overrides the RcrainfoClient bool
        we use this to test a RcrainfoService instance is not None
        """
        return True


def get_rcrainfo_client(
    *,
    username: Optional[str] = None,
    api_id: Optional[str] = None,
    api_key: Optional[str] = None,
    rcrainfo_env: Optional[Literal["preprod"] | Literal["prod"]] = None,
    **kwargs,
) -> RcrainfoService:
    """RcrainfoService Constructor for interacting with RCRAInfo web services"""
    if api_id is not None and api_key is not None:
        return RcrainfoService(
            api_id=api_id,
            api_key=api_key,
            rcrainfo_env=rcrainfo_env,
            **kwargs,
        )
    try:
        org: Org = Org.objects.get(orgaccess__user__username=username)
        if org.is_rcrainfo_integrated:
            api_id, api_key = org.rcrainfo_api_id_key
        return RcrainfoService(
            api_id=api_id,
            api_key=api_key,
            rcrainfo_env=rcrainfo_env,
            **kwargs,
        )
    except Org.DoesNotExist:
        raise ValueError(
            "If not using an organization with RCRAInfo credentials, "
            "you must provide api_id and api_key"
        )
