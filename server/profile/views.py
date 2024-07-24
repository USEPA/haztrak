from profile.models import Profile, RcrainfoProfile
from profile.serializers import ProfileSerializer, RcrainfoProfileSerializer
from profile.services import get_user_profile

from celery.exceptions import CeleryError
from celery.result import AsyncResult as CeleryTask
from rest_framework import status
from rest_framework.generics import GenericAPIView, RetrieveAPIView, RetrieveUpdateAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from rcrasite.tasks import sync_user_rcrainfo_sites


class ProfileDetailsView(RetrieveAPIView):
    """Displays a user's HaztrakProfile"""

    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def get(self, request, *args, **kwargs):
        try:
            profile = get_user_profile(user=self.request.user)
            serializer = self.serializer_class(profile)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        except Profile.DoesNotExist as exc:
            return Response(data={"error": str(exc)}, status=status.HTTP_404_NOT_FOUND)


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


class RcrainfoProfileSyncView(GenericAPIView):
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
