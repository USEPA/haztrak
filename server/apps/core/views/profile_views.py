from celery.exceptions import CeleryError
from celery.result import AsyncResult as CeleryTask
from rest_framework import status
from rest_framework.generics import GenericAPIView, RetrieveAPIView, RetrieveUpdateAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from apps.core.models import HaztrakProfile, RcrainfoProfile
from apps.core.serializers import (
    HaztrakProfileSerializer,
    RcrainfoProfileSerializer,
)
from apps.rcrasite.tasks import sync_user_rcrainfo_sites


class HaztrakProfileView(RetrieveAPIView):
    """Displays a user's HaztrakProfile"""

    queryset = HaztrakProfile.objects.all()
    serializer_class = HaztrakProfileSerializer
    response = Response

    def get_object(self):
        return HaztrakProfile.objects.get(user=self.request.user)


class RcrainfoProfileView(RetrieveUpdateAPIView):
    """
    Responsible for Create/Update operations related to the user RcrainfoProfile,
    which maintains a user's RCRAInfo profile data. This info is necessary for
    actions that interface with RCRAInfo.
    """

    queryset = RcrainfoProfile.objects.all()
    serializer_class = RcrainfoProfileSerializer
    response = Response
    lookup_field = "haztrak_profile__user__username"
    lookup_url_kwarg = "username"


class SyncRcrainfoProfileView(GenericAPIView):
    """
    This endpoint launches a task to sync the logged-in user's RCRAInfo profile
    with their haztrak (Rcra)profile.
    """

    queryset = None
    response = Response

    def post(self, request: Request) -> Response:
        try:
            task: CeleryTask = sync_user_rcrainfo_sites.delay(str(self.request.user))
            return self.response({"taskId": task.id})
        except RcrainfoProfile.DoesNotExist as exc:
            return self.response(data={"error": str(exc)}, status=status.HTTP_404_NOT_FOUND)
        except CeleryError as exc:
            return self.response(
                data={"error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
