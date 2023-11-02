from typing import Optional

from apps.trak.models import DotLookup


def get_dot_shipping_names(query: Optional[str]) -> list[str]:
    """
    Returns a list of DOT Proper Shipping Names (e.g.'1,1,12-Tetrafluoroethane')
    optionally filtered by a query parameter
    """
    queryset = DotLookup.shipping_names.all().filter(value__icontains=query)[0:100]
    return [option.value for option in queryset]


def get_dot_hazard_classes(query: Optional[str]) -> list[str]:
    """Get a list of DOT Hazard Classes (e.g., '1.1A'), optionally filtered by a query parameter"""
    queryset = DotLookup.hazard_classes.all().filter(value__icontains=query)[0:100]
    return [option.value for option in queryset]


def get_dot_id_numbers(query: Optional[str]) -> list[str]:
    """Get a list of DOT ID Numbers (e.g., 'ID8000'), optionally filtered by a query parameter"""
    queryset = DotLookup.id_numbers.all().filter(value__icontains=query)[0:100]
    return [option.value for option in queryset]
