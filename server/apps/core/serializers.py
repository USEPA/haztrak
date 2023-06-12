from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from apps.core.models import RcraProfile
from apps.sites.serializers import RcraSitePermissionSerializer


class RcraProfileSerializer(ModelSerializer):
    """
    Model serializer for marshalling/unmarshalling a user's RcraProfile
    """

    user = serializers.StringRelatedField()
    rcraSites = RcraSitePermissionSerializer(
        source="permissions",
        required=False,
        many=True,
    )
    phoneNumber = serializers.CharField(
        source="phone_number",
        required=False,
    )
    rcraAPIID = serializers.CharField(
        source="rcra_api_id",
        required=False,
    )
    rcraAPIKey = serializers.CharField(
        source="rcra_api_key",
        required=False,
        write_only=True,
    )
    rcraUsername = serializers.CharField(
        source="rcra_username",
        required=False,
    )
    apiUser = serializers.BooleanField(
        source="is_api_user",
        required=False,
        allow_null=False,
    )

    class Meta:
        model = RcraProfile
        fields = [
            "user",
            "rcraAPIID",
            "rcraAPIKey",
            "rcraUsername",
            "rcraSites",
            "phoneNumber",
            "apiUser",
        ]
