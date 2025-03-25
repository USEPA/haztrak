from typing import Optional

from wasteline.models import DotLookup, WasteCode


def filter_dot_shipping_names(query: str | None) -> list[str]:
    """Returns a list of DOT Proper Shipping Names optionally filtered by a query parameter"""
    queryset = DotLookup.shipping_names.filter_by_value(query)[0:100]
    return [option.value for option in queryset]


def filter_dot_hazard_classes(query: str | None) -> list[str]:
    """Get a list of DOT Hazard Classes (e.g., '1.1A'), optionally filtered by a query parameter"""
    queryset = DotLookup.hazard_classes.filter_by_value(query)[0:100]
    return [option.value for option in queryset]


def filter_dot_id_numbers(query: str | None) -> list[str]:
    """Get a list of DOT ID Numbers (e.g., 'ID8000'), optionally filtered by a query parameter"""
    queryset = DotLookup.id_numbers.filter_by_value(query)[0:100]
    return [option.value for option in queryset]


def get_state_waste_codes(state_code: str) -> list[str]:
    """Get a list of state waste codes for a given state"""
    if len(state_code) != 2:
        raise ValueError("State code must be a 2-character string")
    return WasteCode.state.filter_by_state_id(state_code)
