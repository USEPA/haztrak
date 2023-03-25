import logging
from typing import Optional

from celery import shared_task, states
from celery.exceptions import Ignore, Reject

logger = logging.getLogger(__name__)


@shared_task(name="pull_federal_code", bind=True)
def pull_federal_codes(self, api_user: Optional[str] = None):
    from apps.trak.services import RcrainfoService

    logger.debug(f"start task {self.name}")
    try:
        # ToDo remove testuser1 and substitute with an admin
        #  Haztrak will need to be deployed with Rcrainfo API credentials and, when a user does not
        #  have API credentials but are authorized (in haztrak) to launch tasks
        #  The tasks should fall back to an administrator's API ID and key
        rcrainfo = RcrainfoService(api_username=api_user or "testuser1")
        return rcrainfo.sync_federal_waste_codes()
    except (ConnectionError, TimeoutError):
        raise Reject()
    except Exception as exc:
        self.update_state(state=states.FAILURE, meta=f"unknown error: {exc}")
        raise Ignore()
