from rest_framework import serializers

from apps.trak.models import Handler
from apps.trak.serializers import AddressSerializer

from .contact import ContactSerializer, EpaPhoneSerializer
from .trak import TrakBaseSerializer


class HandlerSerializer(TrakBaseSerializer):
    """
    Handler model serializer for JSON marshalling/unmarshalling
    """

    epaSiteId = serializers.CharField(
        source="epa_id",
    )
    siteType = serializers.CharField(
        source="site_type",
        allow_null=True,
        required=False,
    )
    modified = serializers.BooleanField(
        allow_null=True,
        default=False,
    )
    # name
    mailingAddress = AddressSerializer(
        source="mail_address",
    )
    siteAddress = AddressSerializer(
        source="site_address",
    )
    contact = ContactSerializer()
    emergencyPhone = EpaPhoneSerializer(
        source="emergency_phone",
        allow_null=True,
        default=None,
    )
    # paperSignatureInfo
    electronicSignatureInfo = serializers.JSONField(
        source="electronic_signatures_info",
        allow_null=True,
        default=None,
    )
    registered = serializers.BooleanField(
        allow_null=True,
        default=False,
    )
    limitedEsign = serializers.BooleanField(
        source="limited_esign",
        allow_null=True,
        default=False,
    )
    canEsign = serializers.BooleanField(
        source="can_esign",
        allow_null=True,
        default=False,
    )
    hasRegisteredEmanifestUser = serializers.BooleanField(
        source="registered_emanifest_user",
        allow_null=True,
        default=False,
    )
    gisPrimary = serializers.BooleanField(
        source="gis_primary",
        allow_null=True,
        default=False,
    )

    def create(self, validated_data):
        return Handler.objects.create_handler(**validated_data)

    class Meta:
        model = Handler
        fields = [
            "epaSiteId",
            "siteType",
            "modified",
            "name",
            "siteAddress",
            "mailingAddress",
            "contact",
            "emergencyPhone",
            "electronicSignatureInfo",
            "registered",
            "limitedEsign",
            "canEsign",
            "hasRegisteredEmanifestUser",
            "gisPrimary",
        ]
