from django.contrib.auth.models import User
from django.db import IntegrityError, InternalError
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response


class SignUp(GenericAPIView):
    permission_classes = [AllowAny]
    response = Response

    @method_decorator(csrf_exempt)
    def post(self, request: Request) -> Response:
        try:
            data = JSONParser().parse(request)
            user = User.objects.create_user(
                username=data['username'],
                password=data['password'])
            user.save()
            token = Token.objects.create(user=user)
            return self.response(status=status.HTTP_200_OK, data={'token': str(token)})
        except InternalError:
            return self.response(status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                 data={
                                     'error': 'internal server error'})
        except IntegrityError:
            return self.response(status=status.HTTP_400_BAD_REQUEST,
                                 data={
                                     'error': 'username taken, please choose another'})


class Login(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': str(user)
        })
