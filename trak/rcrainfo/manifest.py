from emanifest import client as em
import os


def sync_mtn():
    eman = em.new_client("preprod") # type: em.RcrainfoClient
    eman.Auth(os.getenv('RCRAINFO_API_ID'), os.getenv('RCRAINFO_API_KEY'))
    test = eman.GetMTNBySite("VATESTGEN001")
    return test