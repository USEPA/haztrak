from rest_framework import authentication


class BearerAuthentication(authentication.TokenAuthentication):
    """
    BearerAuthentication changes Authorization Header's value from
    'Token {token}' to 'Bearer {token}'
    https://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication
    It's used in /haztrak/settings.py under 'DEFAULT_AUTHENTICATION_CLASSES'
    """
    keyword = 'Bearer'
