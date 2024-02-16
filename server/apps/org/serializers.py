from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from apps.org.models import HaztrakOrg


class HaztrakOrgSerializer(ModelSerializer):
    """Haztrak Organization Model Serializer"""

    id = serializers.CharField(
        required=False,
    )
    name = serializers.CharField(
        required=False,
    )
    rcrainfoIntegrated = serializers.BooleanField(
        source="is_rcrainfo_integrated",
        required=False,
    )

    class Meta:
        model = HaztrakOrg
        fields = [
            "name",
            "id",
            "rcrainfoIntegrated",
        ]
