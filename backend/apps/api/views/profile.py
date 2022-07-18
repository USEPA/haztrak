from django.db import IntegrityError, InternalError
from django.http import JsonResponse
from rest_framework import permissions, status
from rest_framework.request import Request
from rest_framework.views import APIView

from apps.accounts.models import Profile
from apps.api.serializers import ProfileSerializer


class ProfileView(APIView):
    response = JsonResponse
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: Request) -> JsonResponse:
        try:
            user = request.user
            profile = Profile.objects.get(user=user)
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
