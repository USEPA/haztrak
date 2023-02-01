from celery import shared_task, states
from celery.exceptions import Ignore

from apps.trak.models import RcraProfile
from apps.trak.services import HandlerService


@shared_task(name="get handler", bind=True)
def get_handler(self, *, site_id: str, username: str):
    try:
        handler_service = HandlerService(user=username)
        handler_service.retrieve_rcra_handler(site_id=site_id)
    except RcraProfile.DoesNotExist:  # ToDo: remove this, tasks doesn't need to know
        self.update_state(
            state=states.FAILURE,
            meta=f'More than one (or zero) users were returned from RCRAInfo.'
                 f'Check haztrak {self.profile}\'s RCRAInfo username'
        )
        raise Ignore()
