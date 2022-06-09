from rest_framework import serializers

from apps.trak.models import Address

from .base import TrakSerializer

# from lib.rcrainfo.lookups import get_country_name, get_state_name


class AddressSerializer(TrakSerializer):
    streetNumber = serializers.CharField(
        source='street_number',
    )

    class Meta:
        model = Address
        fields = [
            'streetNumber',
            'address1',
            'address2',
            'city',
            'state',
            'country',
            'zip',
        ]
