from profile.models import Profile, RcrainfoProfile
from profile.serializers import ProfileSerializer, RcrainfoProfileSerializer
from profile.services import get_user_profile

from celery.exceptions import CeleryError
from celery.result import AsyncResult as CeleryTask
from rcrasite.tasks import sync_user_rcrainfo_sites
from rest_framework import status
from rest_framework.generics import (
    CreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateAPIView,
)
from rest_framework.mixins import RetrieveModelMixin, UpdateModelMixin
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet


class ProfileViewSet(GenericViewSet, RetrieveModelMixin, UpdateModelMixin):
    """ViewSet for the Profile model"""

    lookup_field = "user__id"
    lookup_url_kwarg = "user_id"
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    # permission_classes = []
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class ProfileDetailsView(RetrieveAPIView):
    """Displays a user's HaztrakProfile"""

    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def get_object(self):
        if self.request.user.is_anonymous:
            raise PermissionError("You must be logged in to view this page")
        return get_user_profile(user=self.request.user)


class RcrainfoProfileRetrieveUpdateView(RetrieveUpdateAPIView):
    """
    Responsible for Create/Update operations related to the user RcrainfoProfile,
    which maintains a user's RCRAInfo profile data. This info is necessary for
    actions that interface with RCRAInfo.
    """

    queryset = RcrainfoProfile.objects.all()
    serializer_class = RcrainfoProfileSerializer
    response = Response
    lookup_url_kwarg = "username"

    def get_object(self):
        return RcrainfoProfile.objects.get_by_trak_username(self.kwargs.get(self.lookup_url_kwarg))


class RcrainfoProfileSyncView(CreateAPIView):
    """
    This endpoint launches a task to sync the logged-in user's RCRAInfo profile
    with their haztrak (Rcra)profile.
    """

    queryset = None
    response = Response

    def create(self, request: Request, **kwargs) -> Response:
        try:
            task: CeleryTask = sync_user_rcrainfo_sites.delay(str(self.request.user))
            return self.response({"taskId": task.id})
        except CeleryError as exc:
            return self.response(
                data={"error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
