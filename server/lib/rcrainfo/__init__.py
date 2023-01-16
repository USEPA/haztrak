from datetime import datetime

from emanifest.client import RcrainfoClient

from apps.trak.models import RcraProfile


class RiService(RcrainfoClient, RcraProfile):
    profile: RcraProfile

    def __init__(self, profile: RcraProfile, base_url: str):
        super().__init__(base_url)
        self.profile = profile
        urls = {
            "PROD": "https://rcrainfo.epa.gov/rcrainfoprod/rest/",
            "PREPROD": "https://rcrainfopreprod.epa.gov/rcrainfo/rest/"
        }
        if base_url.upper() in urls:
            self.base_url = urls[base_url.upper()]

    def __token_not_expired(self) -> bool:
        token_expiration = datetime.strptime(self.token, '%Y-%m-%dT%H:%M:%S.%f%z')
        print(token_expiration)
        if datetime.now() < token_expiration:
            return True
        else:
            return False

    def get_handler(self, epa_id: str):
        expired = self.__token_not_expired()
        print(expired)
        pass
