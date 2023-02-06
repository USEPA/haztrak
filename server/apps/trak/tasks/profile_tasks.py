from celery import Task, shared_task, states
from celery.exceptions import Reject
from requests import RequestException

from apps.trak.models import RcraProfile
from apps.trak.services.profile import RcraProfileService


class RcraProfileTasks(Task):
    """RcraProfileTasks acts as our base Celery class that encapsulate all logic related
    to a user's RCRAInfo profile"""
    username: str


@shared_task(name="sync profile", base=RcraProfileTasks, bind=True, acks_late=True)
def sync_user_sites(self: RcraProfileTasks, username: str) -> None:
    """
    This Task does a few things including:
    1. Create a user profile if non-existent
    2. Retrieves a user's RCRAInfo Site permissions
    3. If not present, retrieve and create a Handler, Site, and SitePermission for each
       site the user has access to in RCRAInfo.
    """
    try:
        profile = RcraProfileService(username=username)
        profile.update_rcra_profile()
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
