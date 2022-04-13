from emanifest import client as eman
import os


def get_mtn():
    em = eman.new_client('preprod')  # type: eman.RcrainfoClient
    em.Auth(os.getenv('RCRAINFO_API_ID'), os.getenv('RCRAINFO_API_KEY'))
    test = em.GetMTNBySite('VATESTGEN001')
    print(test)
