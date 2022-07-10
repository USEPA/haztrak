from rest_framework import authentication


class BearerAuthentication(authentication.TokenAuthentication):
    keyword = 'Bearer'
