from apps.trak.models import RcraProfile, SitePermission
from apps.trak.serializers import EpaPermissionSerializer
from apps.trak.services import HandlerService, RcrainfoService, SiteService


class RcraProfileService:
    def __init__(self, *, username: str, api_user: str = None):
        self.username = username
        self.profile, created = RcraProfile.objects.get_or_create(
            user__username=self.username)
        if api_user:
            self.rcrainfo = RcrainfoService(username=api_user)
        elif self.profile.is_api_user:
            self.rcrainfo = RcrainfoService(username=self.username)
        else:
            self.rcrainfo = None

    def update_rcra_profile(self, *, username: str = None):
        handlers = []
        handler_service = HandlerService(username=self.username)
        site_service = SiteService(username=self.username)
        if username:
            user_to_update: str = username
        else:
            user_to_update = self.username
        user_profile_response = self.rcrainfo.get_user_profile(username=user_to_update)
        permissions = self.parse_rcra_response(rcra_response=user_profile_response)
        for site_permission in permissions:
            handler_json = handler_service.get_or_retrieve_handler(
                site_permission['siteId'])
            handlers.append({'handler': handler_json,
                             'permissions': site_permission})
        for handler in handlers:
            site = site_service.get_or_create_site(handler=handler['handler'])
            permission_serializer = EpaPermissionSerializer(
                data=handler['permissions'])
            if permission_serializer.is_valid():
                SitePermission.objects.update_or_create(
                    **permission_serializer.validated_data,
                    site=site,
                    profile=self.profile)

    @staticmethod
    def parse_rcra_response(*, rcra_response: dict) -> list[dict]:
        permissions = []
        for permission_json in rcra_response['users'][0]['sites']:
            permissions.append(permission_json)
        return permissions
