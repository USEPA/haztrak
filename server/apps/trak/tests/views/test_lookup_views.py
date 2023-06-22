import pytest
from rest_framework import status
from rest_framework.response import Response
from rest_framework.test import APIRequestFactory, force_authenticate

from apps.trak.models import WasteCode
from apps.trak.views import FederalWasteCodesView, StateWasteCodesView


class TestLookupViews:
    """Tests the for the Waste Code views"""

    base_url = "/api/code"

    @pytest.fixture
    def factory(self):
        return APIRequestFactory()

    @pytest.fixture
    def user(self, user_factory):
        return user_factory()

    def test_federal_returns_200(self, factory, user):
        request = factory.get(f"{self.base_url}/waste/federal")
        force_authenticate(request, user)

        response: Response = FederalWasteCodesView.as_view()(request)

        assert response.status_code == status.HTTP_200_OK

    def test_federal_returns_list_of_all_federal_codes(self, factory, user):
        number_federal_codes = WasteCode.federal.all().count()
        request = factory.get(f"{self.base_url}/waste/federal")
        force_authenticate(request, user)

        response: Response = FederalWasteCodesView.as_view()(request)

        assert len(response.data) == number_federal_codes

    def test_state_returns_200(self, factory, user):
        state_id = "VA"
        request = factory.get(f"{self.base_url}/waste/state/{state_id}")
        force_authenticate(request, user)

        response: Response = StateWasteCodesView.as_view()(request, state_id=state_id)

        assert response.status_code == status.HTTP_200_OK

    #
    # def test_federal_returns_list_of_all_federal_codes(self, factory, user):
    #     number_federal_codes = WasteCode.federal.all().count()
    #     request = factory.get(f"{self.base_url}/waste/federal")
    #     force_authenticate(request, user)
    #
    #     response: Response = FederalWasteCodesView.as_view()(request)
    #
    #     assert len(response.data) == number_federal_codes
