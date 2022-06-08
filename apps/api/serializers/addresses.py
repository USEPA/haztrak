from rest_framework import serializers

from apps.trak.models import Address

# from lib.rcrainfo.lookups import get_country_name, get_state_name


class AddressSerializer(serializers.ModelSerializer):
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

    def to_representation(self, instance):
        data = super().to_representation(instance)
        for field in self.fields:
            try:
                if data[field] is None:
                    data.pop(field)
            except KeyError:
                pass
        return data
