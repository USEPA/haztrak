import os

from emanifest import RcrainfoClient

from apps.trak.models import RcraProfile


class RcrainfoService(RcrainfoClient):
    """
    RcrainfoService is our IO interface for communicating with the EPA RCRAInfo
    web services.
    """

    def __init__(self, username: str, rcrainfo_env: str = None, *args, **kwargs):
        self.username = username
        if rcrainfo_env is None:
            rcrainfo_env = os.getenv('HT_RCRAINFO_ENV', 'preprod')
        super().__init__(rcrainfo_env, *args, **kwargs)

    def retrieve_id(self, api_id=None) -> str:
        if RcraProfile.objects.filter(user__username=self.username).exists():
            profile = RcraProfile.objects.get(user__username=self.username)
            if profile.is_api_user:
                return super().retrieve_id(profile.rcra_api_id)

    def retrieve_key(self, api_key=None) -> str:
        if RcraProfile.objects.filter(user__username=self.username).exists():
            profile = RcraProfile.objects.get(user__username=self.username)
            if profile.is_api_user:
                return super().retrieve_id(profile.rcra_api_key)
