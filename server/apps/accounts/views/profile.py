from django.db import IntegrityError, InternalError
from rest_framework import permissions, status
from rest_framework.generics import GenericAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from apps.accounts.models import Profile
from apps.accounts.serializers import ProfileSerializer
from apps.accounts.tasks import hello


class ProfileView(GenericAPIView):
    queryset = Profile.objects.all()
    response = Response
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: Request) -> Response:
        try:
            user = request.user
            profile = Profile.objects.get(user=user)
            profile_serializer = ProfileSerializer(profile)
            hello()  # this is just here as POC for using celery tasks
            return self.response(profile_serializer.data, status=status.HTTP_200_OK)
        except TypeError:
            raise InternalError
        except InternalError:
            return self.response(status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                 data={
                                     'error': 'internal server error'})
        except IntegrityError:
            return self.response(status=status.HTTP_400_BAD_REQUEST,
                                 data={
                                     'error': 'username taken, please choose another'})
