import logging
import os

from emanifest import client as em


# Prototyping functions
def get_mtns(site_id: str):
    ri = em.new_client('preprod')
    ri.Auth(os.getenv('RCRAINFO_API_ID'), os.getenv('RCRAINFO_API_KEY'))
    resp = ri.GetMTNBySite(site_id)
    if not resp.ok:
        logging.error("Bad response when getting MTNs")
    return resp


def get_manifest(mtn: str):
    ri = em.new_client('preprod')
    ri.Auth(os.getenv('RCRAINFO_API_ID'), os.getenv('RCRAINFO_API_KEY'))
    resp = ri.GetManByMTN(mtn)
    return resp
