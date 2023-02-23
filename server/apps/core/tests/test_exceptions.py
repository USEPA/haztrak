from http import HTTPStatus

from django.http import Http404

from apps.core.exceptions import haztrak_exception_handler


class TestHaztrakExecptionHandler:
    def test_http404_to_not_found(self):
        http404_exec = Http404()
        context = {}
        response = haztrak_exception_handler(http404_exec, context)
        assert response.status_code == HTTPStatus.NOT_FOUND
        assert "Not found" in response.data["detail"]
