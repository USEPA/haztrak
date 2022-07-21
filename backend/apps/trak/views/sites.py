import logging

from django.core.exceptions import ObjectDoesNotExist
from rest_framework import permissions, status
from rest_framework.exceptions import APIException
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import Profile
from apps.trak.models import Site
from apps.trak.serializers import SiteSerializer


class SiteAPI(APIView):
    response = Response
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: Request, epa_id: str = None) -> Response:
        try:
            if epa_id:
                profile_sites = [str(i) for i in
                                 Profile.objects.get(user=request.user).epa_sites.all()]
                if epa_id in profile_sites:
                    my_site = Site.objects.get(epa_site__epa_id=epa_id)
                    serializer = SiteSerializer(my_site)
                    return self.response(serializer.data)
                else:
                    return self.response(status=status.HTTP_401_UNAUTHORIZED)
            else:
                my_sites = Profile.objects.get(user=request.user).epa_sites.all()
                my_sites_json = []
                for i in my_sites:
                    my_site_serializer = SiteSerializer(i)
                    my_sites_json.append(my_site_serializer.data)
                return self.response(data=my_sites_json)
        except (APIException, AttributeError) as error:
            logging.warning(error)
            return self.response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except ObjectDoesNotExist:
            return self.response(status=status.HTTP_404_NOT_FOUND,
                                 data={'Error': f'{epa_id} not found'})
