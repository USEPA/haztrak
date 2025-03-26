from core.utils import exception_handler
from django.http import Http404
from rest_framework import status


class TestTrakExceptionHandler:
    def test_http404_to_not_found(self):
        http404_exec = Http404()
        context = {}
        response = exception_handler(http404_exec, context)
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "Not found" in response.data["detail"]
