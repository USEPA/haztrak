from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from apps.profile.models import RcrainfoProfile

from .rcrasite_access import RcraSitePermissionSerializer


class RcrainfoProfileSerializer(ModelSerializer):
    """Model serializer for marshalling/unmarshalling a user's RcrainfoProfile"""

    user = serializers.StringRelatedField(
        source="haztrak_profile",
    )
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
        allow_null=True,
        allow_blank=True,
    )
    rcraAPIKey = serializers.CharField(
        source="rcra_api_key",
        required=False,
        write_only=True,
        allow_blank=True,
        allow_null=True,
    )
    rcraUsername = serializers.CharField(
        source="rcra_username",
        required=False,
    )
    apiUser = serializers.BooleanField(
        source="has_rcrainfo_api_id_key",
        required=False,
        allow_null=False,
    )

    class Meta:
        model = RcrainfoProfile
        fields = [
            "user",
            "rcraAPIID",
            "rcraAPIKey",
            "rcraUsername",
            "rcraSites",
            "phoneNumber",
            "apiUser",
        ]
