from django.core.exceptions import PermissionDenied
from django.core.exceptions import ValidationError as DjangoValidationError
from django.http import Http404
from rest_framework import exceptions
from rest_framework.serializers import as_serializer_error
from rest_framework.views import exception_handler


def haztrak_exception_handler(exc, context):
    """
    This is our custom exception handler that builds on DRF
    see https://www.django-rest-framework.org/api-guide/exceptions/
    and the django-styleguide
    https://github.com/HackSoftware/Django-Styleguide#approach-1---use-drfs-default-exceptions-with-very-little-modifications
    """
    if isinstance(exc, DjangoValidationError):
        exc = exceptions.ValidationError(as_serializer_error(exc))

    if isinstance(exc, PermissionDenied):
        exc = exceptions.PermissionDenied()

    if isinstance(exc, Http404):
        exc = exceptions.NotFound()

    response = exception_handler(exc, context)

    if response is not None:
        response.data["status_code"] = response.status_code

    return response
