# from datetime import datetime, timezone
# import os
# from rcrainfo import client as eman
# from .models import Manifest
#
# em = eman.new_client('preprod')  # type: eman.RcrainfoClient
# em.Auth(os.getenv('RCRAINFO_API_ID'), os.getenv('RCRAINFO_API_KEY'))
#
#
# def pull_mtns():
#     check_auth()
#     test = em.GetMTNBySite('VATESTGEN001')
#     print(test)
#
#
# def pull_manifest(request):
#     check_auth()
#     manifest_response = em.GetManByMTN('100032524ELC')  # type: eman.RcrainfoResponse
#     r = manifest_response.response.json()
#     print(r['generator'])
#     Manifest.objects.create(manifest_tracking_number=r['manifestTrackingNumber'],
#                             created_date=r['createdDate'],
#                             update_date=r['updatedDate'],
#                             status=r['status'],
#                             submission_type=r['submissionType'],
#                             origin_type=r['originType'],
#                             # shipped_date=r['shippedDate'],
#                             # received_date=r['receivedDate'],
#                             # certified_date=r['certifiedDate'],
#                             transporter=r['transporters'],
#                             generator_id=r['generator']['epaSiteId'],
#                             generator_info=r['generator'],
#                             tsd_id=r['designatedFacility']['epaSiteId'],
#                             tsd_info=r['designatedFacility'],
#                             rejection=r['rejection'],
#                             residue=r['residue'],
#                             import_waste=r['import'],
#                             )
#
#
# def check_auth():
#     if datetime.now(timezone.utc) >= em.token_expiration:
#         em.Auth(os.getenv('RCRAINFO_API_ID'), os.getenv('RCRAINFO_API_KEY'))
