from celery import Task, shared_task, states
from celery.exceptions import Ignore, Reject
from requests import RequestException

from apps.trak.models import RcraProfile, SitePermission
from apps.trak.serializers import EpaPermissionSerializer
from apps.trak.services import RcrainfoService, HandlerService, SiteService


class RcraProfileTasks(Task):
    """RcraProfileTasks acts as our base Celery class that encapsulate all logic related
    to a user's RCRAInfo profile"""
    username: str
    profile: RcraProfile
    site_permissions: list = []
    handlers: list = []
    user_response: dict


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
        self.rcrainfo = RcrainfoService(self.username)
        self.handler_service = HandlerService(username=self.username)
        self.site_service = SiteService(username=self.username)
        # retrieve a user's site permissions from RCRAInfo
        self.user_response = self.rcrainfo.get_rcrainfo_user_profile()
        # parse the response
        for permission_json in self.user_response['users'][0]['sites']:
            self.site_permissions.append(permission_json)
        # for each handler, get from database or retrieve from RCRAInfo
        for site_permission in self.site_permissions:
            handler_json = self.handler_service.get_or_retrieve_handler(
                site_permission['siteId'])
            self.handlers.append({'handler': handler_json,
                                  'permissions': site_permission})
        for handler in self.handlers:
            site = self.site_service.get_or_create_site(handler=handler['handler'])
            permission_serializer = EpaPermissionSerializer(
                data=handler['permissions'])
            if permission_serializer.is_valid():
                SitePermission.objects.update_or_create(
                    **permission_serializer.validated_data,
                    site=site,
                    profile=self.profile)
        self.handlers.clear()
        self.user_response.clear()
        self.rcrainfo = None
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
