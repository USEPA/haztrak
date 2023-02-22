from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.trak.models import Address

from ..models.address import COUNTRIES, STATES
from .trak import TrakBaseSerializer


@extend_schema_field(OpenApiTypes.OBJECT)
class LocalityField(serializers.Field):
    """
    Locality is defined, in RCRAInfo, as an object used to describe region (state, nation)
    {
      "code": "TX",
      "name": "Texas"
    }
    """

    def __init__(self, choices=None, *args, **kwargs):
        self.choices = choices
        super().__init__(*args, **kwargs)

    def to_representation(self, obj):
        return {"code": obj, "name": dict(self.choices).get(obj)}

    def to_internal_value(self, data):
        try:
            return data["code"]
        except KeyError:
            raise ValidationError(f'"code" field is required, provided: {data}')


class AddressSerializer(TrakBaseSerializer):
    """
    Address model serializer for JSON representation
    """

    streetNumber = serializers.CharField(
        source="street_number",
        required=False,
    )
    state = LocalityField(STATES)
    country = LocalityField(COUNTRIES)

    class Meta:
        model = Address
        fields = [
            "streetNumber",
            "address1",
            "address2",
            "city",
            "state",
            "country",
            "zip",
        ]
