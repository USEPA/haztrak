import logging
from typing import Optional

from celery import shared_task, states
from celery.exceptions import Ignore, Reject

logger = logging.getLogger(__name__)


@shared_task(name="pull_federal_code", bind=True)
def pull_federal_codes(self, api_user: Optional[str] = None):
    from apps.core.services import get_rcrainfo_client

    logger.debug(f"start task {self.name}")
    try:
        rcrainfo = get_rcrainfo_client(username=api_user)
        return rcrainfo.sync_federal_waste_codes()
    except (ConnectionError, TimeoutError):
        raise Reject()
    except Exception as exc:
        self.update_state(state=states.FAILURE, meta=f"unknown error: {exc}")
        raise Ignore()
