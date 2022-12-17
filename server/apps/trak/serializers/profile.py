from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from apps.trak.models import RcraProfile


class ProfileSerializer(ModelSerializer):
    user = serializers.StringRelatedField()
    epaSites = serializers.StringRelatedField(
        required=False,
        source='epa_sites',
        many=True,
    )
    phoneNumber = serializers.CharField(
        required=False,
        source='phone_number',
    )
    rcraAPIID = serializers.CharField(
        required=False,
        source='rcra_api_id',
    )
    rcraAPIKey = serializers.CharField(
        required=False,
        source='rcra_api_key',
    )

    class Meta:
        model = RcraProfile
        fields = [
            'user',
            'rcraAPIID',
            'rcraAPIKey',
            'epaSites',
            'phoneNumber',
        ]
