from django.contrib.auth.models import User
from django.db import InternalError
from django.http import JsonResponse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.parsers import JSONParser
from rest_framework.request import Request
from rest_framework.views import APIView


class SignUp(APIView):
    response = JsonResponse

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
            return self.response(status=400, data={'error': 'username taken'})
