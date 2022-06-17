import os

from emanifest import client as em
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import Profile
from apps.api.serializers import ManifestSerializer
from apps.trak.models import Manifest
from lib.rcrainfo import rcrainfo


# ToDo authentication, right now will work as long as user is signed
#  into haztrak via the browser for demo purposes. Just Demo!
class PullManifest(APIView):
    if os.getenv('RCRAINFO_ENV'):
        ri_client = em.new_client(os.getenv('RCRAINFO_ENV'))
    else:
        ri_client = em.new_client('preprod')

    def post(self, request: Request) -> Response:
        try:
            user_profile = Profile.objects.get(user_id=self.request.user)
            if not user_profile.rcra_api_id and user_profile.rcra_api_key:
                return Response(status=status.HTTP_401_UNAUTHORIZED, data={
                    "msg": f'user {user_profile} RCRAInfo API ID and Key '
                           f'no found, add them to your profile'})
            self.ri_client.Auth(user_profile.rcra_api_id, user_profile.rcra_api_key)
            data = {'mtn': []}
            for mtn in self.request.data['mtn']:
                resp = self.ri_client.GetManByMTN(mtn)
                data['mtn'].append({mtn: resp.response.status_code})
                if Manifest.objects.filter(mtn=mtn):
                    print('manifest exists')
                    pass
                else:
                    new_manifest = ManifestSerializer(data=resp.json)
                    new_manifest.is_valid()
                    new_manifest.save()
            return Response(status=status.HTTP_200_OK, data=data)
        except KeyError:
            return Response(status=status.HTTP_400_BAD_REQUEST)


# trash, not time remove it right now
class SyncSiteManifest(APIView):
    response = Response

    def get(self, request: Request, epa_id: str = None) -> Response:
        if epa_id:
            resp = rcrainfo.get_mtns(epa_id)
            return Response(data={'mtn': resp.json})
        else:
            return self.response(status=status.HTTP_200_OK)
