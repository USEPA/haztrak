from django.core.exceptions import PermissionDenied
from django.core.exceptions import ValidationError as DjangoValidationError
from django.http import Http404
from rest_framework import exceptions
from rest_framework.exceptions import APIException
from rest_framework.serializers import as_serializer_error
from rest_framework.views import exception_handler

from apps.site.services import TrakSiteServiceError


class InternalServer500(APIException):
    status_code = 500
    default_detail = "Internal Server Error"
    default_code = "internal_server_error"


def haztrak_exception_handler(exc, context):
    """
    This maps exceptions that are not directly handled by our handler functions
    to DRF exceptions. For example, if a django ValidationError is raised,
    it will be mapped to a DRF ValidationError.

    See https://www.django-rest-framework.org/api-guide/exceptions/
    and the django-styleguide
    https://github.com/HackSoftware/Django-Styleguide#approach-1---use-drfs-default-exceptions-with-very-little-modifications
    """
    match exc:
        case DjangoValidationError():
            exc = exceptions.ValidationError(as_serializer_error(exc))
        case PermissionDenied():
            exc = exceptions.PermissionDenied()
        case Http404():
            exc = exceptions.NotFound()
        case KeyError():
            exc = exceptions.ParseError()
        case ValueError():
            exc = InternalServer500()
        case TrakSiteServiceError():
            exc = InternalServer500()

    response = exception_handler(exc, context)

    if response is not None:
        response.data["status_code"] = response.status_code

    return response
