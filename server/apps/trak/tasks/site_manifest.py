import os

from celery import shared_task
from django.contrib.auth.models import User
from emanifest import client as em

from apps.trak.models import RcraProfile


@shared_task(name="sync_user_sites")
def sync_site_manifest(username: str, epa_id: str) -> None:
    """
    get a site's manifest
    """
    rcrainfo_env = os.getenv('HT_RCRAINFO_ENV', 'preprod')
    try:
        profile = RcraProfile.objects.get(user__username=username)
        if not profile.rcra_user_name or not profile.rcra_api_id or not profile.rcra_api_key:
            raise Exception('missing attribute(s) from RcraProfile')
    except RcraProfile.DoesNotExist:
        RcraProfile.objects.create(user=User.objects.get(username=username))
        raise Exception('RcraProfile is non existent... creating. Needs attributes')
    rcra_client = em.new_client(rcrainfo_env)
    rcra_client.Auth(profile.rcra_api_id, profile.rcra_api_key)
    response = rcra_client.GetMTNBySite(epa_id)
    print(response)
