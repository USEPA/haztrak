from celery.exceptions import CeleryError
from celery.result import AsyncResult as CeleryTask
from rest_framework import status
from rest_framework.generics import GenericAPIView, RetrieveAPIView, RetrieveUpdateAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from apps.core.models import HaztrakProfile, HaztrakUser, RcraProfile
from apps.core.serializers import (
    HaztrakProfileSerializer,
    HaztrakUserSerializer,
    RcraProfileSerializer,
)
from apps.sites.tasks import sync_user_rcrainfo_sites


class HaztrakUserView(RetrieveUpdateAPIView):
    """Retrieve the current user's base information"""

    queryset = HaztrakUser.objects.all()
    serializer_class = HaztrakUserSerializer

    def get_object(self):
        return self.request.user


class HaztrakProfileView(RetrieveAPIView):
    """Displays a user's HaztrakProfile"""

    queryset = HaztrakProfile.objects.all()
    serializer_class = HaztrakProfileSerializer
    response = Response

    def get_object(self):
        return HaztrakProfile.objects.get(user=self.request.user)


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
    lookup_url_kwarg = "username"


class RcraProfileSyncView(GenericAPIView):
    """
    This endpoint launches a task to sync the logged-in user's RCRAInfo profile
    with their haztrak (Rcra)profile.
    """

    queryset = None
    response = Response

    def get(self, request: Request) -> Response:
        try:
            task: CeleryTask = sync_user_rcrainfo_sites.delay(str(self.request.user))
            return self.response({"task": task.id})
        except RcraProfile.DoesNotExist as exc:
            return self.response(data={"error": str(exc)}, status=status.HTTP_404_NOT_FOUND)
        except CeleryError as exc:
            return self.response(
                data={"error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
