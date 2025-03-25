"""Celery tasks for managing a user's RCRAInfo profile."""

import logging
from profile.services import RcraProfileService, RcraProfileServiceError

from celery import Task, shared_task, states
from celery.exceptions import Ignore, Reject
from requests import RequestException

logger = logging.getLogger(__name__)


class RcraProfileTasks(Task):
    """
    RcraProfileTasks acts as app base Celery class.

    Encapsulates all logic related to a user's RCRAInfo profile.
    """

    username: str


@shared_task(name="sync profile", base=RcraProfileTasks, bind=True, acks_late=True)
def sync_user_rcrainfo_sites(self: RcraProfileTasks, username: str) -> None:
    """
    Task to pull a user's RCRAInfo profile.

    This task initiates a call to the RcraProfileService to and update that information in Haztrak.
    """
    try:
        rcra_profile = RcraProfileService(username=username)
        rcra_profile.update_rcrainfo_profile()
    except (ConnectionError, RequestException, TimeoutError) as exc:
        # TODO(David): retry if network error, see celery docs   # noqa: TD003
        raise Reject from exc
    except RcraProfileServiceError as exc:
        self.update_state(state=states.FAILURE, meta={"error": f"{exc!s}"})
        raise Ignore from exc
    except Exception as exc:
        self.update_state(state=states.FAILURE, meta={"unknown error": f"{exc!s}"})
        raise Ignore from exc
