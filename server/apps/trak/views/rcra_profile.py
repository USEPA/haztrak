import http

from celery.exceptions import CeleryError
from django.contrib.auth.models import User
from rest_framework import permissions
from rest_framework.generics import (GenericAPIView, RetrieveAPIView,
                                     RetrieveUpdateAPIView)
from rest_framework.request import Request
from rest_framework.response import Response

from apps.trak.models import RcraProfile, SitePermission
from apps.trak.serializers import ProfileUpdateSerializer
from apps.trak.serializers.rcra_profile import (EpaPermissionSerializer,
                                                ProfileGetSerializer,
                                                SitePermissionSerializer)
from apps.trak.tasks.handler_tasks import get_handler


class RcraProfileView(RetrieveUpdateAPIView):
    """
    Responsible for CRUD operations related to the user RcraProfile, which maintains
    information necessary for actions that interface with RCRAInfo
    """
    queryset = RcraProfile.objects.all()
    serializer_class = ProfileUpdateSerializer
    permission_classes = [permissions.AllowAny]  # temporary, remove me
    response = Response

    def get_serializer_class(self):
        if self.request.method == 'PUT':
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
    """
    queryset = None
    response = Response

    def get(self, request: Request, user: str = None) -> Response:
        try:
            profile = RcraProfile.objects.get(user=request.user)
            task = profile.sync()
            return self.response({'task': task.id})
        except (User.DoesNotExist, CeleryError) as e:
            return self.response(data=e,
                                 status=http.HTTPStatus.INTERNAL_SERVER_ERROR)


class SitePermissionView(RetrieveAPIView):
    """
    For Viewing a user's Site Permissions in haztrak's internal JSON structure.
    This is not included in the current URL configs, but kept here for documentation.
    """
    queryset = SitePermission.objects.all()
    serializer_class = SitePermissionSerializer
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, *args, **kwargs):
        # sync_user_sites.delay('testuser1')
        get_handler.delay(site_id='VATESTGEN001', username='testuser1')
        return super().retrieve(request, *args, **kwargs)


class EpaPermissionView(RetrieveAPIView):
    """
    For Viewing a user's Site Permissions in the same JSON structure as RCRAInfo.

    This is not included in the current URL configs, but kept here for documentation.
    """
    queryset = SitePermission.objects.all()
    serializer_class = EpaPermissionSerializer
    permission_classes = [permissions.AllowAny]
