from emanifest import client as em
import os
import io
from apps.trak.models import ManifestSimple
import datetime
from apps.api.serializers import ManifestSerializer, TestSerializer
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer


def get_mtns():
    # test = ManifestSimple(manifestTrackingNumber='123456789ELC', createdDate=datetime.datetime.now(), status='notAssigned')
    # serializer = TestSerializer(test)
    # json = JSONRenderer().render(serializer.data)

    ri = em.new_client('preprod')
    ri.Auth(os.getenv('RCRAINFO_API_ID'), os.getenv('RCRAINFO_API_KEY'))
    resp = ri.GetManByMTN('100032524ELC')
    json = JSONRenderer().render(resp.json)

    stream = io.BytesIO(json)
    data = JSONParser().parse(stream=stream)
    print('data type: %s' % type(data))
    serializer = TestSerializer(data=data)
    serializer.is_valid()
    print(serializer.is_valid())
    print(serializer.errors)
    serializer.save()


def get_manifest(mtn: str):
    ri = em.new_client('preprod')
    ri.Auth(os.getenv('RCRAINFO_API_ID'), os.getenv('RCRAINFO_API_KEY'))
    resp = ri.GetManByMTN(mtn)
    return resp
