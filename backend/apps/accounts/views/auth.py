from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError, InternalError
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.views import APIView


class SignUp(APIView):
    permission_classes = [AllowAny]
    response = JsonResponse

    @method_decorator(csrf_exempt)
    def post(self, request: Request) -> JsonResponse:
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


class Login(APIView):
    permission_classes = [AllowAny]
    response = JsonResponse

    @method_decorator(csrf_exempt)
    def post(self, request: Request) -> JsonResponse:
        data = JSONParser().parse(request)
        user = authenticate(request, username=data['username'],
                            password=data['password'])
        if user is None:
            return JsonResponse(status=status.HTTP_400_BAD_REQUEST,
                                data={'error': 'check username and password'})
        else:
            try:
                token = Token.objects.get(user=user)
            except ObjectDoesNotExist:
                token = Token.objects.create(user=user)
            return JsonResponse({'user': str(user), 'token': str(token)})
