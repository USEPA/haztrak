from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.sites.models import Address

from .base_ser import SitesBaseSerializer


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


class AddressSerializer(SitesBaseSerializer):
    """
    Address model serializer for JSON representation
    """

    streetNumber = serializers.CharField(
        source="street_number",
        required=False,
        allow_blank=True,
    )
    state = LocalityField(
        choices=Address.EpaStates.choices,
        required=False,
    )
    country = LocalityField(
        choices=Address.EpaCountries.choices,
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
