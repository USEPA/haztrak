from rest_framework.test import APIRequestFactory, force_authenticate

from apps.trak.views import HandlerSearch


class TestHandlerSearch:
    def test_returns_array_of_handlers(self, db, testuser1, generator001):
        generator001.save()
        factory = APIRequestFactory()
        request = factory.post('/api/trak/handler/search',
                               {'epaId': generator001.epa_id, 'name': '', 'type': 'Generator'},
                               format='json')
        force_authenticate(request, testuser1)
        response = HandlerSearch.as_view()(request)
        for i in response.data:
            assert isinstance(i, dict)
