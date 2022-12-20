from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from apps.trak.models import RcraProfile


class ProfileGetSerializer(ModelSerializer):
    """
    Provides the user's RcraProfile information, excluding their RCRAInfo
    API key (see ProfileUpdateSerializer)
    """
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
    rcraUsername = serializers.CharField(
        required=False,
        source='rcra_username',
    )

    class Meta:
        model = RcraProfile
        fields = [
            'user',
            'rcraAPIID',
            'rcraUsername',
            'epaSites',
            'phoneNumber',
        ]


class ProfileUpdateSerializer(ProfileGetSerializer):
    """
    Adds the users RCRAInfo API Key to the trak Profile serializer to be used
    for post and update request (not for GET requests).
    """
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
            'rcraUsername',
            'epaSites',
            'phoneNumber',
        ]
