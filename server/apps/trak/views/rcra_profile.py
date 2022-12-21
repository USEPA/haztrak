import http

from celery.exceptions import CeleryError
from django.contrib.auth.models import User
from rest_framework.generics import GenericAPIView, RetrieveUpdateAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from apps.trak.models import RcraProfile
from apps.trak.serializers import ProfileUpdateSerializer
from apps.trak.serializers.rcra_profile import ProfileGetSerializer
from apps.trak.tasks import sync_user_sites


class RcraProfileView(RetrieveUpdateAPIView):
    """
    Responsible for CRUD operations related to the user RcraProfile, which maintains information
    necessary for actions that interface with RCRAInfo
    """
    queryset = RcraProfile.objects.all()
    serializer_class = ProfileUpdateSerializer
    response = Response

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProfileUpdateSerializer
        else:
            return ProfileGetSerializer

    def get_queryset(self):
        """
        Filter based on the current user
        """
        user = self.request.user
        return RcraProfile.objects.get(user=user)

    def get_object(self):
        return self.queryset.get(user__username=self.kwargs.get('user'))


class SyncProfile(GenericAPIView):
    """
    This endpoint launches a task to sync the logged-in user's RCRAInfo profile
    with their haztrak (Rcra)profile.

    It seems a little hacky, contributions welcome.
    """
    queryset = None
    response = Response

    def get(self, request: Request) -> Response:
        try:
            user = User.objects.get(username=request.user)
            task = sync_user_sites.delay(user.username)
            return self.response({'task': task.id})
        except (User.DoesNotExist, CeleryError) as e:
            return self.response(data=e,
                                 status=http.HTTPStatus.INTERNAL_SERVER_ERROR)
