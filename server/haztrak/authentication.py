"""
Haztrak's authentication settings
"""
from rest_framework.authentication import TokenAuthentication


class BearerAuthentication(TokenAuthentication):
    """
    BearerAuthentication changes Authorization Header's value from
    'Token {token}' to 'Bearer {token}'
    https://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication
    It's used in /haztrak/settings.py under 'DEFAULT_AUTHENTICATION_CLASSES'
    """

    keyword = "Bearer"
