from celery.exceptions import CeleryError
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.generics import GenericAPIView, RetrieveAPIView, RetrieveUpdateAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from apps.core.models import HaztrakUser, RcraProfile
from apps.core.serializers import HaztrakUserSerializer, RcraProfileSerializer
from apps.sites.models import RcraSitePermission
from apps.sites.serializers import (
    RcraSitePermissionSerializer,
)


class HaztrakUserView(RetrieveUpdateAPIView):
    """Retrieve the current user's base information"""

    queryset = HaztrakUser.objects.all()
    serializer_class = HaztrakUserSerializer

    def get_object(self):
        # return HaztrakUser.objects.get(username="testuser1")
        return self.request.user


class RcraProfileView(RetrieveUpdateAPIView):
    """
    Responsible for Create/Update operations related to the user RcraProfile,
    which maintains a user's RCRAInfo profile data. This info is necessary for
    actions that interface with RCRAInfo.
    """

    queryset = RcraProfile.objects.all()
    serializer_class = RcraProfileSerializer
    response = Response
    lookup_field = "user__username"
    lookup_url_kwarg = "user"


class SyncProfileView(GenericAPIView):
    """
    This endpoint launches a task to sync the logged-in user's RCRAInfo profile
    with their haztrak (Rcra)profile.
    """

    queryset = None
    response = Response

    def get(self, request: Request, user: str = None) -> Response:
        """Sync Profile GET method rcra_site"""
        try:
            profile = RcraProfile.objects.get(user=request.user)
            task = profile.sync()
            return self.response({"task": task.id})
        except (User.DoesNotExist, CeleryError) as exc:
            return self.response(data=exc, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RcraSitePermissionView(RetrieveAPIView):
    """
    For Viewing the RcraSite Permissions for the given user
    """

    queryset = RcraSitePermission.objects.all()
    serializer_class = RcraSitePermissionSerializer

    def get_queryset(self):
        user = self.request.user
        return RcraSitePermission.objects.filter(profile__user=user)
