from django.core.exceptions import ObjectDoesNotExist
from django.core.exceptions import ValidationError as DjangoValidationError
from django.http import Http404
from rest_framework import exceptions, status
from rest_framework.exceptions import APIException, NotFound
from rest_framework.response import Response
from rest_framework.serializers import as_serializer_error
from rest_framework.views import exception_handler as drf_exception_handler


class InternalServer500(APIException):
    status_code = 500
    default_detail = "Internal Server Error"
    default_code = "internal_server_error"


def exception_handler(exc, context):
    """
    This maps exceptions that are not directly handled by our handler functions.

    to DRF exceptions. For example, if a django ValidationError is raised,
    it will be mapped to a DRF ValidationError.

    See https://www.django-rest-framework.org/api-guide/exceptions/
    and the django-styleguide
    https://github.com/HackSoftware/Django-Styleguide#approach-1---use-drfs-default-exceptions-with-very-little-modifications
    """
    match exc:
        case DjangoValidationError():
            exc = exceptions.ValidationError(as_serializer_error(exc))
        case Http404():
            exc = exceptions.NotFound()
        case ObjectDoesNotExist():
            exc = NotFound()
        case KeyError():
            exc = exceptions.ParseError()

    response = drf_exception_handler(exc, context)

    if response is not None:
        response.data["status_code"] = response.status_code
    else:
        response = Response(
            {"detail": "Unhandled server error"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
        response.data["status_code"] = 500

    return response
