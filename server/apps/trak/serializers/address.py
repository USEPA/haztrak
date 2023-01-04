from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.trak.models import Address
from lib.rcrainfo.lookups import get_country_name, get_state_name

from .trak import TrakBaseSerializer


@extend_schema_field(OpenApiTypes.OBJECT)
class LocalityField(serializers.Field):

    def __init__(self, locality_type):
        super().__init__()
        self.locality_type = locality_type
        self.locality_name = None

    def to_internal_value(self, data):
        try:
            return data['code']
        except KeyError:
            raise ValidationError(f'state code is required for address {data}')

    def to_representation(self, value) -> dict:
        if self.locality_type == 'state':
            self.locality_name = get_state_name(value)
        elif self.locality_type == 'country':
            self.locality_name = get_country_name(value)
        representation = {"code": value,
                          "name": self.locality_name}
        return representation


class AddressSerializer(TrakBaseSerializer):
    streetNumber = serializers.CharField(
        source='street_number',
        required=False,
    )
    state = LocalityField('state')
    country = LocalityField('country')

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
