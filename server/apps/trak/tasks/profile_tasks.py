import os

from celery import Task, shared_task, states
from celery.exceptions import Ignore, Reject
from emanifest import RcrainfoClient, RcrainfoResponse
from requests import RequestException

from apps.trak.models import Handler, RcraProfile, Site, SitePermission
from apps.trak.serializers import EpaPermissionSerializer, HandlerSerializer
from apps.trak.services import RcrainfoService


class RcraProfileTasks(Task):
    """RcraProfileTasks acts as our base Celery class that encapsulate all logic related
    to a user's RCRAInfo profile"""
    username: str
    profile: RcraProfile
    site_permissions: list = []
    handlers: list = []
    user_response: dict
    ri: RcrainfoClient
    sites: list = []

    @property
    def number_users_returned(self):
        if not self.user_response:
            return 0
        else:
            return len(self.user_response['users'])

    def get_rcrainfo_user(self):
        """
        Retrieve a user's site permissions from RCRAInfo, It expects the
        haztrak user to have their unique RCRAInfo user and API credentials in their
        RcraProfile
        """
        self.ri = RcrainfoClient(os.getenv('HT_RCRAINFO_ENV', 'preprod'))
        self.ri.authenticate(self.profile.rcra_api_id, self.profile.rcra_api_key)
        response: RcrainfoResponse = self.ri.search_users(
            userId=self.profile.rcra_username)
        self.user_response = response.json()

    def parse_response(self):
        if self.number_users_returned == 1:
            for site_permission in self.user_response['users'][0]['sites']:
                self.site_permissions.append(site_permission)
        else:
            self.update_state(
                state=states.FAILURE,
                meta=f'More than one (or zero) users were returned from RCRAInfo.'
                     f'Check haztrak {self.profile}\'s RCRAInfo username'
            )
            raise Ignore()

    def create_or_get_handlers(self):
        for site_permission in self.site_permissions:
            site_id = site_permission['siteId']
            if Handler.objects.filter(epa_id=site_id).exists():
                existing_handler = Handler.objects.get(epa_id=site_id)
                self.handlers.append(
                    {'handler': existing_handler,
                     'permissions': site_permission})
            else:
                response = self.ri.get_site(site_permission['siteId'])
                # handler_service = HandlerService(username=self.username)
                if response.response.ok:
                    new_handler = save_handler(response.response.json())
                    if new_handler:
                        self.handlers.append(
                            {'handler': new_handler,
                             'permissions': site_permission})

    def add_sites_to_profile(self):
        for handler_info in self.handlers:
            try:
                existing_site = Site.objects.get(epa_site=handler_info['handler'])
                permission_serializer = EpaPermissionSerializer(
                    data=handler_info['permissions'])
                if permission_serializer.is_valid():
                    SitePermission.objects.update_or_create(
                        **permission_serializer.validated_data,
                        site=existing_site,
                        profile=self.profile)
                self.sites.append(existing_site)
            except Site.DoesNotExist:
                new_site = handler_to_site_with_user(handler_info['handler'],
                                                     self.profile)
                permission_serializer = EpaPermissionSerializer(
                    data=handler_info['permissions'])
                if permission_serializer.is_valid():
                    SitePermission.objects.create(
                        **permission_serializer.validated_data,
                        site=new_site,
                        profile=self.profile)
                self.sites.append(new_site)

    def __str__(self):
        return f'{self.name}'


def save_handler(handler_data) -> Handler:
    serializer = HandlerSerializer(data=handler_data)
    if serializer.is_valid():
        new_handler: Handler = serializer.save()
        return new_handler


def handler_to_site_with_user(handler_object: Handler, profile: RcraProfile) -> Site:
    new_site = Site.objects.create(epa_site=handler_object, name=handler_object.name)
    profile.epa_sites.add(new_site)
    return new_site


@shared_task(name="sync profile", base=RcraProfileTasks, bind=True, acks_late=True)
def sync_user_sites(self: RcraProfileTasks, username: str) -> None:
    """
    This idempotent Task does a few things including:
    1. Create a user profile if non-existent
    2. Retrieves a user's RCRAInfo Site permissions
    3. If not present, retrieve and create a Handler, Site, and SitePermission for each
       site the user has access to in RCRAInfo.

    ToDo: See what logic we can refactor out of this task
    """
    try:
        self.username = username
        self.profile, created = RcraProfile.objects.get_or_create(
            user__username=self.username)
        if not self.profile.is_api_user:
            self.update_state(
                state=states.FAILURE,
                meta=f'{self.profile} does not have API credentials'
            )
            raise Ignore()
        self.user_response = RcrainfoService(self.username)
        self.parse_response()
        self.create_or_get_handlers()
        self.add_sites_to_profile()
    except KeyError:
        raise Reject()
    except (ConnectionError, RequestException, TimeoutError):
        # ToDo retry if network error, see celery docs
        raise Reject()
    except RcraProfile.DoesNotExist:
        self.update_state(
            state=states.FAILURE,
            meta=f'{self.profile} Does not exist, you need a RcraProfile with API '
                 f'credentials'
        )
        raise Reject()
