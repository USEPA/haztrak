from datetime import datetime, timezone
import os
from emanifest import client as eman
from .models import Manifest

em = eman.new_client('preprod')  # type: eman.RcrainfoClient
em.Auth(os.getenv('RCRAINFO_API_ID'), os.getenv('RCRAINFO_API_KEY'))


def pull_mtns():
    check_auth()
    test = em.GetMTNBySite('VATESTGEN001')
    print(test)


def pull_manifest():
    check_auth()
    manifest_response = em.GetManByMTN('100032524ELC')  # type: eman.RcrainfoResponse
    r = manifest_response.response.json()
    print(r['generator']['epaSiteId'])
    Manifest.objects.create(manifest_tracking_number=r['manifestTrackingNumber'],
                            generator=r['generator']['epaSiteId'],
                            status=r['status'],
                            created_date=r['createdDate'],
                            update_date=r['updatedDate'],
                            tsd=r['designatedFacility']['epaSiteId'])


def check_auth():
    if datetime.now(timezone.utc) >= em.token_expiration:
        em.Auth(os.getenv('RCRAINFO_API_ID'), os.getenv('RCRAINFO_API_KEY'))
