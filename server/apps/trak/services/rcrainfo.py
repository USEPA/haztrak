import os

from emanifest import RcrainfoClient

from apps.trak.models import RcraProfile


class RcrainfoService(RcrainfoClient):
    """
    RcrainfoService is our IO interface for communicating with the EPA RCRAInfo
    web services.
    """

    def __init__(self, *, api_username: str, rcrainfo_env: str = None, **kwargs):
        self.api_user = api_username
        if RcraProfile.objects.filter(user__username=self.api_user).exists():
            self.profile = RcraProfile.objects.get(user__username=self.api_user)
        else:
            self.profile = None
        if rcrainfo_env is None:
            rcrainfo_env = os.getenv("HT_RCRAINFO_ENV", "preprod")
        super().__init__(rcrainfo_env, **kwargs)

    @property
    def has_api_user(self):
        """returns boolean if the assigned API user has credentials"""
        return self.profile.is_api_user

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
        if username:
            profile = RcraProfile.objects.get(user__username=username)
        else:
            profile = RcraProfile.objects.get(user__username=self.api_user)
        response = self.search_users(userId=profile.rcra_username)
        return response.json()
