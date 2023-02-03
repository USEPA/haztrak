from emanifest import RcrainfoClient

from apps.trak.models import RcraProfile


class RcrainfoService(RcrainfoClient):

    def __init__(self, base_url: str, username: str, *args, **kwargs):
        self.username = username
        super().__init__(base_url, *args, **kwargs)

    def retrieve_id(self, api_id=None) -> str:
        if RcraProfile.objects.filter(user__username=self.username).exists():
            profile = RcraProfile.objects.get(user__username=self.username)
            return super().retrieve_id(profile.rcra_api_id)

    def retrieve_key(self, api_key=None) -> str:
        if RcraProfile.objects.filter(user__username=self.username).exists():
            profile = RcraProfile.objects.get(user__username=self.username)
            return super().retrieve_id(profile.rcra_api_key)
