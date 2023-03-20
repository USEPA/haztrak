import datetime
import os
from typing import List, Optional

from emanifest import RcrainfoClient
from psycopg2._psycopg import IntegrityError

from apps.trak.models import RcraProfile, WasteCode
from apps.trak.models.handler_model import HandlerType


class RcrainfoService(RcrainfoClient):
    """
    RcrainfoService is our IO interface for communicating with the EPA RCRAInfo
    web services.
    """

    datetime_format = "%Y-%m-%dT%H:%M:%S.%f%z"

    def __init__(self, *, api_username: str, rcrainfo_env: str = None, **kwargs):
        self.api_user = api_username
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

    def sign_manifest(
        self,
        mtn: List[str],
        site_id: str,
        site_type: HandlerType.choices,
        printed_name: str,
        signature_date: Optional[datetime.datetime] = datetime.datetime.utcnow().replace(
            tzinfo=datetime.timezone.utc
        ),
        transporter_order: Optional[int] = None,
    ):
        """
        Utilizes RcraInfo's Quicker Sign endpoint to electronically sign manifest(s)
        we override the e-Manifest package's sign_manifest function, first validating.
        """
        if isinstance(site_type, HandlerType):
            site_type = str(site_type.label)
        sign_params = {
            "manifestTrackingNumbers": mtn,
            "siteId": site_id,
            "siteType": site_type,
            "printedSignatureName": printed_name,
            "printedSignatureDate": signature_date.isoformat(timespec="milliseconds"),
            "transporterOrder": transporter_order,
        }
        sign_params = {k: v for k, v in sign_params.items() if v is not None}
        return super().sign_manifest(**sign_params)

    def __bool__(self):
        """
        This Overrides the RcrainfoClient bool
        we use this to test RcrainfoService is not None
        """
        return True
