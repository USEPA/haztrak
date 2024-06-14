import pytest
from rest_framework import status
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.test import APIRequestFactory, force_authenticate

from apps.wasteline.models import DotLookupType, WasteCode
from apps.wasteline.views import (
    DotHazardClassView,
    DotIdNumberView,
    DotShippingNameView,
    FederalWasteCodesView,
    StateWasteCodesView,
)


class TestWasteCodeLookupViews:
    """Tests the for the Waste Code views"""

    @pytest.fixture
    def factory(self):
        return APIRequestFactory()

    @pytest.fixture
    def user(self, user_factory):
        return user_factory()

    def test_federal_returns_200(self, factory, user):
        request = factory.get(reverse("wasteline:code:federal"))
        force_authenticate(request, user)
        response: Response = FederalWasteCodesView.as_view()(request)
        assert response.status_code == status.HTTP_200_OK

    def test_federal_returns_list_of_all_federal_codes(self, factory, user):
        number_federal_codes = WasteCode.federal.all().count()
        request = factory.get(reverse("wasteline:code:federal"))
        force_authenticate(request, user)

        response: Response = FederalWasteCodesView.as_view()(request)

        assert len(response.data) == number_federal_codes

    def test_state_returns_200(self, factory, user):
        state_id = "VA"
        request = factory.get(f"{reverse("wasteline:code:state", args=[state_id])}")
        force_authenticate(request, user)
        response: Response = StateWasteCodesView.as_view()(request, state_id=state_id)
        assert response.status_code == status.HTTP_200_OK

    def test_state_waste_codes_returns_list_codes(self, factory, user, waste_code_factory):
        # Arrange
        waste_code_factory(
            code="mock",
            description="Ignitable",
            code_type=WasteCode.CodeType.STATE,
            state_id=WasteCode.VA,
        )
        waste_code_factory(
            code="foo",
            description="Something else",
            code_type=WasteCode.CodeType.STATE,
            state_id=WasteCode.VA,
        )
        waste_code_factory(
            code="blah",
            description="Corrosive",
            code_type=WasteCode.CodeType.STATE,
            state_id=WasteCode.VA,
        )
        number_state_codes = WasteCode.state.filter(state_id=WasteCode.VA).count()
        state_id = "VA"
        request = factory.get(f"{reverse("wasteline:code:state", args=[state_id])}")
        force_authenticate(request, user)
        # Act
        response: Response = StateWasteCodesView.as_view()(request, state_id=state_id)
        # Assert
        assert len(response.data) == number_state_codes
        assert len(response.data) > 0


class TestDOTLookupViews:
    """Tests the for the Waste Code views"""

    @pytest.fixture
    def factory(self):
        return APIRequestFactory()

    @pytest.fixture
    def user(self, user_factory):
        return user_factory()

    @pytest.fixture
    def dot_lookup(self, dot_lookup_factory):
        return dot_lookup_factory()

    def test_dot_id_view_returns_json_with_list_of_strings(self, factory, user):
        # Arrange
        request = factory.get(reverse("wasteline:dot:id-numbers"))
        force_authenticate(request, user)
        # Act
        response: Response = DotIdNumberView.as_view()(request)
        # Assert
        assert isinstance(response.data, list)
        assert response.status_code == status.HTTP_200_OK

    def test_dot_identifiers_can_be_queried(self, factory, user, dot_lookup_factory):
        # Arrange
        dot_id = "mock_id"
        dot_lookup_factory(value=dot_id, value_type=DotLookupType.ID)
        request = factory.get(reverse("wasteline:dot:id-numbers"), {"q": dot_id})
        force_authenticate(request, user)
        # Act
        response: Response = DotIdNumberView.as_view()(request)
        # Assert
        assert dot_id in response.data
        assert len(response.data) == 1
        assert response.status_code == status.HTTP_200_OK

    def test_dot_shipping_name_view_returns_json_with_list_of_strings(self, factory, user):
        # Arrange
        request = factory.get(reverse("wasteline:dot:id-numbers"))
        force_authenticate(request, user)
        # Act
        response: Response = DotShippingNameView.as_view()(request)
        # Assert
        assert isinstance(response.data, list)
        assert response.status_code == status.HTTP_200_OK

    def test_dot_hazard_class_view_returns_a_list_of_strings(self, factory, user):
        # Arrange
        request = factory.get(reverse("wasteline:dot:id-numbers"))
        force_authenticate(request, user)
        # Act
        response: Response = DotHazardClassView.as_view()(request)
        # Assert
        assert isinstance(response.data, list)
        assert response.status_code == status.HTTP_200_OK
