from http import HTTPStatus

from celery.exceptions import CeleryError
from django.contrib.auth.models import User
from rest_framework import permissions
from rest_framework.generics import GenericAPIView, RetrieveAPIView, RetrieveUpdateAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from apps.sites.models import EpaProfile, SitePermission
from apps.sites.serializers import (
    EpaPermissionSerializer,
    EpaProfileGetSerializer,
    EpaProfileUpdateSerializer,
    SitePermissionSerializer,
)


class RcraProfileView(RetrieveUpdateAPIView):
    """
    Responsible for CRUD operations related to the user EpaProfile, which maintains
    information necessary for actions that interface with RCRAInfo
    """

    queryset = EpaProfile.objects.all()
    serializer_class = EpaProfileUpdateSerializer
    permission_classes = [permissions.AllowAny]  # temporary, remove me
    response = Response

    def get_serializer_class(self):
        if self.request.method == "PUT":
            return EpaProfileUpdateSerializer
        return EpaProfileGetSerializer

    def get_queryset(self):
        """
        Filter based on the current user
        """
        user = self.request.user
        return EpaProfile.objects.get(user=user)

    def get_object(self):
        return self.queryset.get(user__username=self.kwargs.get("user"))


class SyncProfileView(GenericAPIView):
    """
    This endpoint launches a task to sync the logged-in user's RCRAInfo profile
    with their haztrak (Rcra)profile.
    """

    queryset = None
    response = Response

    def get(self, request: Request, user: str = None) -> Response:
        """Sync Profile GET method epa_site"""
        try:
            profile = EpaProfile.objects.get(user=request.user)
            task = profile.sync()
            return self.response({"task": task.id})
        except (User.DoesNotExist, CeleryError) as exc:
            return self.response(data=exc, status=HTTPStatus.INTERNAL_SERVER_ERROR)


class SitePermissionView(RetrieveAPIView):
    """
    For Viewing a user's Site Permissions in haztrak's internal JSON structure.
    This is not included in the current URL configs, but kept here for documentation.
    """

    queryset = SitePermission.objects.all()
    serializer_class = SitePermissionSerializer
    permission_classes = [permissions.AllowAny]


class EpaPermissionView(RetrieveAPIView):
    """
    For Viewing a user's Site Permissions in the same JSON structure as RCRAInfo.

    This is not included in the current URL configs, but kept here for documentation.
    """

    queryset = SitePermission.objects.all()
    serializer_class = EpaPermissionSerializer
    permission_classes = [permissions.AllowAny]
