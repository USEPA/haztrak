from django.contrib.auth.models import User
from rest_framework.test import (APIClient, APIRequestFactory,
                                 force_authenticate)

from apps.trak.models import Handler
from apps.trak.views import HandlerSearch


class TestHandlerSearch:
    """
    Test for the Handler Search endpoint
    """

    def test_returns_array_of_handlers(self, db, testuser1, generator001):
        # Arrange
        factory = APIRequestFactory()
        request = factory.post('/api/trak/handler/search',
                               {'epaId': generator001.epa_id, 'name': '', 'type': generator001.site_type},
                               format='json')
        force_authenticate(request, testuser1)
        # Act
        response = HandlerSearch.as_view()(request)
        # Assert
        assert len(response.data) > 0
        for i in response.data:
            assert isinstance(i, dict)

    def test_returns_error_with_invalid_search_criteria(self, db, testuser1: User) -> None:
        # Arrange
        factory = APIRequestFactory()
        request = factory.post('/api/trak/handler/search',
                               {'epaId': 'va', 'name': 'va', 'type': ''},
                               format='json')
        force_authenticate(request, testuser1)
        # Act
        response = HandlerSearch.as_view()(request)
        # Assert
        assert 400 <= response.status_code < 500

    def test_returns_correct_headers(self, db, testuser1: User, generator001: Handler) -> None:
        # Arrange
        client = APIClient()
        client.force_authenticate(user=testuser1)
        # Act
        response = client.post('/api/trak/handler/search',
                               {'epaId': generator001.epa_id, 'name': '', 'type': generator001.site_type},
                               format='json')
        # Assert
        assert response.headers['Content-Type'] == 'application/json'
        assert response.status_code == 200
