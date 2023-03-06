from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

# ToDo (convert to enums and remove this import)
from apps.trak.models import Address, EpaCountries, EpaStates

from .trak_ser import TrakBaseSerializer


@extend_schema_field(OpenApiTypes.OBJECT)
class LocalityField(serializers.ChoiceField):
    """
    Locality is defined, in RCRAInfo, as an object used to describe region (state, nation)
    {
      "code": "TX",
      "name": "Texas"
    }
    """

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
    state = LocalityField(
        choices=EpaStates.choices,
        required=False,
    )
    country = LocalityField(
        choices=EpaCountries.choices,
        required=False,
    )

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
