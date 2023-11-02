from typing import Optional

from apps.trak.models import DotLookup


def get_dot_shipping_names(query: Optional[str]) -> list[str]:
    """Get a list of DOT Proper Shipping Names, optionally filtered by a query parameter"""
    queryset = DotLookup.shipping_names.all().filter(value__icontains=query)[0:100]
    return [option.value for option in queryset]
