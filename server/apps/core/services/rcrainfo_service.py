import logging
import os

from django.db import IntegrityError
from emanifest import RcrainfoClient, RcrainfoResponse

from apps.core.models import RcraProfile
from apps.trak.models import WasteCode


class RcrainfoService(RcrainfoClient):
    """
    RcrainfoService is our IO interface for communicating with the EPA RCRAInfo
    web services.
    """

    datetime_format = "%Y-%m-%dT%H:%M:%S.%f%z"

    def __init__(self, *, api_username: str, rcrainfo_env: str = None, **kwargs):
        self.api_user = api_username
        self.logger = logging.getLogger(__name__)
        if RcraProfile.objects.filter(user__username=self.api_user).exists():
            self.profile = RcraProfile.objects.get(user__username=self.api_user)
        else:
            self.profile = None
        if rcrainfo_env is None:
            rcrainfo_env = os.getenv("HT_RCRAINFO_ENV", "preprod")
            self.rcrainfo_env = rcrainfo_env
        super().__init__(rcrainfo_env, **kwargs)

    @property
    def has_api_user(self) -> bool:
        """returns boolean if the assigned API user has credentials"""
        try:
            return self.profile.is_api_user
        except AttributeError:
            return False

    def __repr__(self):
        return (
            f"<{self.__class__.__name__}(api_username='{self.api_user}', "
            f"rcrainfo_env='{self.rcrainfo_env}')>"
        )

    def retrieve_id(self, api_id=None) -> str:
        """Override RcrainfoClient method to retrieve API ID for authentication"""
        if self.has_api_user:
            return super().retrieve_id(self.profile.rcra_api_id)
        return super().retrieve_key()

    def retrieve_key(self, api_key=None) -> str:
        """Override RcrainfoClient method to retrieve API key to authentication"""
        if self.has_api_user:
            return super().retrieve_key(self.profile.rcra_api_key)
        return super().retrieve_key()

    def get_user_profile(self, username: str = None):
        """
        Retrieve a user's site permissions from RCRAInfo, It expects the
        haztrak user to have their unique RCRAInfo user and API credentials in their
        RcraProfile
        """
        profile = RcraProfile.objects.get(user__username=username or self.api_user)
        response = self.search_users(userId=profile.rcra_username)
        return response.json()

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

    def search_mtn(
        self,
        reg: bool = False,
        site_id: str = None,
        start_date: str = None,
        end_date: str = None,
        status: str = None,
        date_type: str = "UpdatedDate",
        state_code: str = None,
        site_type: str = None,
    ) -> RcrainfoResponse:
        # map our python friendly keyword arguments to RCRAInfo expected fields
        search_params = {
            "stateCode": state_code,
            "siteId": site_id,
            "status": status,
            "dateType": date_type,
            "siteType": site_type,
            "endDate": end_date,
            "startDate": start_date,
        }
        # Remove arguments that are None
        filtered_params = {k: v for k, v in search_params.items() if v is not None}
        self.logger.debug(f"rcrainfo manifest search parameters {filtered_params}")
        return super().search_mtn(**filtered_params)

    def __bool__(self):
        """
        This Overrides the RcrainfoClient bool
        we use this to test a RcrainfoService instance is not None
        """
        return True
