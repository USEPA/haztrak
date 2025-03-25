import pytest
from django.db import IntegrityError

from wasteline.models import DotLookup, DotLookupType, WasteCode


@pytest.mark.django_db
class TestWasteCodesModel:
    """Test WasteCode model, something to keep in mind is we use django data
    migrations to populate the database with initial waste codes.
    """

    federal_codes = [
        ("M001", "mock waste code"),
        ("M002", "mock description"),
        ("M003", "mock reactive waste"),
    ]
    state_waste_codes = [
        ("S123", "foo alkaline solution"),
        ("S131", "another foo mock description"),
        ("S132", "Aqueous solution w/metals"),
        ("S133", "Aqueous solution with 10% or more total organic residues"),
    ]

    @pytest.fixture
    def create_codes(self, waste_code_factory):
        for code in self.federal_codes:
            waste_code_factory(code=code[0], description=[1], code_type=WasteCode.CodeType.FEDERAL)
        for code in self.state_waste_codes:
            waste_code_factory(code=code[0], description=[1], code_type=WasteCode.CodeType.STATE)

    def test_base_manager_retrieves_all(self, create_codes) -> None:
        # Arrange
        all_codes = WasteCode.objects.all()
        # Act
        federal_mock = all_codes.filter(code=self.federal_codes[0][0])
        state_mock = all_codes.filter(code=self.state_waste_codes[0][0])
        # Assert
        assert len(federal_mock) == 1
        assert len(state_mock) == 1

    def test_federal_manager_retrieves_federal_waste_codes(self, create_codes) -> None:
        # Arrange
        all_codes = WasteCode.federal.all()
        # Act
        state_codes = all_codes.filter(code_type=WasteCode.CodeType.STATE)
        # Assert
        assert len(all_codes) > 0
        assert len(state_codes) == 0

    def test_state_manager_retrieves_only_state_waste_codes(self, create_codes) -> None:
        # Arrange
        all_codes = WasteCode.state.all()
        # Act
        federal_codes = all_codes.filter(code_type=WasteCode.CodeType.FEDERAL)
        # Assert
        assert len(all_codes) > 0
        assert len(federal_codes) == 0

    def test_waste_codes_are_unique(self, waste_code_factory) -> None:
        code = self.federal_codes[0][0]
        waste_code_factory(code=code)
        with pytest.raises(IntegrityError):
            WasteCode.objects.create(code=code)

    def test_filter_state_waste_codes_by_state_id(self, waste_code_factory) -> None:
        va_code = waste_code_factory(
            code="b123",
            code_type=WasteCode.CodeType.STATE,
            state_id="VA",
        )
        tx_code = waste_code_factory(
            code="c321",
            code_type=WasteCode.CodeType.STATE,
            state_id="TX",
        )
        filtered_codes = WasteCode.state.filter_by_state_id("VA")
        assert va_code in filtered_codes
        assert tx_code not in filtered_codes


class TestDOTLookupManager:
    def test_filter_shipping_names(self, dot_lookup_factory) -> None:
        # Arrange
        value = "xxxxxxxxxxxxx"
        other_value = "foo"
        dot_lookup_factory(value=value, value_type=DotLookupType.NAME)
        dot_lookup_factory(value=other_value, value_type=DotLookupType.NAME)
        # Act
        shipping_names = DotLookup.shipping_names.filter_by_value(value)
        # Assert
        assert value in [i["value"] for i in shipping_names.values()]
        assert other_value not in [i["value"] for i in shipping_names.values()]
