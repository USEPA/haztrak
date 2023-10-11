import pytest
from rest_framework import status
from rest_framework.response import Response
from rest_framework.test import APIRequestFactory, force_authenticate

from apps.trak.models import WasteCode
from apps.trak.models.waste_models import DotLookupType
from apps.trak.views import (
    DotHazardClassView,
    DotIdNumberView,
    DotShippingNameView,
    FederalWasteCodesView,
    StateWasteCodesView,
)


class TestWasteCodeLookupViews:
    """Tests the for the Waste Code views"""

    base_url = "/api/waste/code"

    @pytest.fixture
    def factory(self):
        return APIRequestFactory()

    @pytest.fixture
    def user(self, user_factory):
        return user_factory()

    def test_federal_returns_200(self, factory, user):
        request = factory.get(f"{self.base_url}/federal")
        force_authenticate(request, user)

        response: Response = FederalWasteCodesView.as_view()(request)

        assert response.status_code == status.HTTP_200_OK

    def test_federal_returns_list_of_all_federal_codes(self, factory, user):
        number_federal_codes = WasteCode.federal.all().count()
        request = factory.get(f"{self.base_url}/federal")
        force_authenticate(request, user)

        response: Response = FederalWasteCodesView.as_view()(request)

        assert len(response.data) == number_federal_codes

    def test_state_returns_200(self, factory, user):
        # Arrange
        state_id = "VA"
        request = factory.get(f"{self.base_url}/state/{state_id}")
        force_authenticate(request, user)
        # Act
        response: Response = StateWasteCodesView.as_view()(request, state_id=state_id)
        # Assert
        assert response.status_code == status.HTTP_200_OK

    def test_state_waste_codes_returns_list_codes(self, factory, user):
        # Arrange
        number_state_codes = WasteCode.state.filter(state_id=WasteCode.VA).count()
        state_id = "VA"
        request = factory.get(f"{self.base_url}/state/{state_id}")
        force_authenticate(request, user)
        # Act
        response: Response = StateWasteCodesView.as_view()(request, state_id=state_id)
        # Assert
        assert len(response.data) == number_state_codes
        assert len(response.data) > 0


class TestDOTLookupViews:
    """Tests the for the Waste Code views"""

    base_url = "/api/waste/dot"

    @pytest.fixture
    def factory(self):
        return APIRequestFactory()

    @pytest.fixture
    def user(self, user_factory):
        return user_factory()

    @pytest.fixture
    def dot_lookup(self, dot_option_factory):
        return dot_option_factory()

    def test_dot_id_view_returns_json_with_list_of_strings(self, factory, user):
        # Arrange
        request = factory.get(f"{self.base_url}/id")
        force_authenticate(request, user)
        # Act
        response: Response = DotIdNumberView.as_view()(request)
        # Assert
        assert isinstance(response.data, list)
        assert response.status_code == status.HTTP_200_OK

    def test_dot_identifiers_can_be_queried(self, factory, user, dot_option_factory):
        # Arrange
        dot_id = "mock_id"
        dot_option_factory(value=dot_id, value_type=DotLookupType.ID)
        request = factory.get(f"{self.base_url}/id", {"q": dot_id})
        force_authenticate(request, user)
        # Act
        response: Response = DotIdNumberView.as_view()(request)
        # Assert
        assert dot_id in response.data
        assert len(response.data) == 1
        assert response.status_code == status.HTTP_200_OK

    def test_dot_shipping_name_view_returns_json_with_list_of_strings(self, factory, user):
        # Arrange
        request = factory.get(f"{self.base_url}/id")
        force_authenticate(request, user)
        # Act
        response: Response = DotShippingNameView.as_view()(request)
        # Assert
        assert isinstance(response.data, list)
        assert response.status_code == status.HTTP_200_OK

    def test_dot_hazard_class_view_returns_a_list_of_strings(self, factory, user):
        # Arrange
        request = factory.get(f"{self.base_url}/id")
        force_authenticate(request, user)
        # Act
        response: Response = DotHazardClassView.as_view()(request)
        # Assert
        assert isinstance(response.data, list)
        assert response.status_code == status.HTTP_200_OK
