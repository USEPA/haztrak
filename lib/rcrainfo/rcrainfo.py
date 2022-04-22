import logging
import os

from emanifest import client as em


def get_mtns(site_id: str):
    ri = em.new_client('preprod')
    ri.Auth(os.getenv('RCRAINFO_API_ID'), os.getenv('RCRAINFO_API_KEY'))
    resp = ri.GetMTNBySite(site_id)
    if not resp.ok:
        logging.error("Bad response when getting MTNs")
    return resp

    # # prototyping function
    # ri = em.new_client('preprod')
    # ri.Auth(os.getenv('RCRAINFO_API_ID'), os.getenv('RCRAINFO_API_KEY'))
    # resp = ri.GetManByMTN('100033134ELC')
    # json = JSONRenderer().render(resp.json)
    #
    # stream = io.BytesIO(json)
    # data = JSONParser().parse(stream=stream)
    # serializer = ManifestSerializer(data=data)
    # serializer.is_valid()
    # print("is valid: ", serializer.is_valid())
    # if not serializer.is_valid():
    #     print("errors: ", serializer.errors)
    # else:
    #     serializer.save()


def get_manifest(mtn: str):
    ri = em.new_client('preprod')
    ri.Auth(os.getenv('RCRAINFO_API_ID'), os.getenv('RCRAINFO_API_KEY'))
    resp = ri.GetManByMTN(mtn)
    return resp
