import http

from celery.exceptions import CeleryError
from django.contrib.auth.models import User
from django.db import IntegrityError, InternalError
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from apps.trak.models import RcraProfile
from apps.trak.serializers import ProfileSerializer
from apps.trak.tasks import sync_user_sites


class ProfileView(GenericAPIView):
    queryset = RcraProfile.objects.all()
    response = Response

    def get(self, request: Request) -> Response:
        try:
            user = request.user
            profile = RcraProfile.objects.get(user=user)
            profile_serializer = ProfileSerializer(profile)
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


class SyncProfile(GenericAPIView):
    queryset = None
    response = Response

    def get(self, request: Request) -> Response:
        try:
            user = User.objects.get(username=request.user)
            task = sync_user_sites.delay(user.username)
            return self.response({'task': task.id})
        except User.DoesNotExist:
            return self.response(data=None,
                                 status=http.HTTPStatus.INTERNAL_SERVER_ERROR)
        except CeleryError:
            return self.response(data=None,
                                 status=http.HTTPStatus.INTERNAL_SERVER_ERROR)
